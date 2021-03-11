using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using System.Web;
using System.Web.Mvc;
using System.Collections;
using DataControl;
using MVCModels;

namespace HiDoctor_Activity.Controllers
{
    public class DCRV4MobileHomeController : Controller
    {
        //
        // GET: /MobileHome/

        #region Private Variables
        private DataControl.CurrentInfo _objCurr = new DataControl.CurrentInfo();
        private DataControl.SPData _objSP = new DataControl.SPData();
        private DataControl.Data _objData = new DataControl.Data();
        #endregion Private Variables

        public ActionResult Index(string dcrDate, string dcrStatus, string isrcpa, string source, string flag, string travelKm)
        {
            ViewBag.Data = dcrDate + "^" + dcrStatus + "^" + isrcpa + "^" + source + "^" + flag + "^" + travelKm + "^";
            if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
            {
                return View("Index.Mobile");
            }
            else
            {
                return View();
            }

        }

        public JsonResult GetHeaderDetails(string dcrStatus, string dcrDate, string source, string flag)
        {
            DataSet dsPreFill = new DataSet();
            DataSet dsSFC = new DataSet();
            List<DCRHeaderModel> lstPreFillData = new List<DCRHeaderModel>();
                List<DCRHeaderModel> lstIntermediate = new List<DCRHeaderModel>();
                 List<DCRAttendance> lstAttendance = new List<DCRAttendance>();
            string dataFrom = string.Empty;
            string activityFlag = flag;
            //try
            //{
                BL_DCRHeader _objDCRBL = new BL_DCRHeader();
                dsPreFill = _objDCRBL.GetHeaderPrefillData(_objCurr.GetCompanyCode(), _objCurr.GetUserCode(), dcrStatus, dcrDate, _objCurr.GetDCRCode(dcrDate), source, flag);

                 DataRow drAccomp = null;
                if (activityFlag != "A" && dsPreFill.Tables.Count > 0 && dsPreFill.Tables[0].Rows.Count > 0)
                    drAccomp = dsPreFill.Tables[0].Rows[0]; 

                // Drafted Accopanist and SFC details
                dsSFC = _objDCRBL.GetAccompanistCodeAndSFCData(_objCurr.GetCompanyCode(), drAccomp, _objCurr.GetRegionCode(),_objCurr.GetUserTypeCode(), dcrDate);
                //_objData.OpenConnection(_objCurr.GetCompanyCode());
                //{
                //    dsPreFill = _objData.ExecuteDataSet("exec SP_hdGetHeaderPrefillData '" + _objCurr.GetCompanyCode() + "','" + _objCurr.GetUserCode() + "','" + dcrStatus + "','" + dcrDate + "','" + _objCurr.GetDCRCode(dcrDate) + "','" + source + "','" + flag + "'");
                //}
            //}
            //finally
            //{
            //    _objData.CloseConnection();
            //}

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
                                    dsPreFill.Tables[0].Rows[0]["Acc1_Name"] = dr["Region_Name"].ToString() + "," + dr["User_Name"].ToString() + "(" + dr["Employee_Name"].ToString() +","+ dr["User_Type_Name"].ToString() + ")";
                                    dsPreFill.Tables[0].Rows[0]["Acc1_Code"] = dr["Region_Code"].ToString();
                                }
                            }
                            else if (!(string.IsNullOrEmpty(drAccompanist["Acc1_Only_For_Doctor"].ToString())))
                            {
                                dr = dtAccompUser.AsEnumerable().Where(a => a["Region_Code"].ToString().Equals(drAccompanist["Acc1_Only_For_Doctor"].ToString())).FirstOrDefault();
                                if (dr != null)
                                {
                                    dsPreFill.Tables[0].Rows[0]["Acc1_Name"] = dr["Region_Name"].ToString() + "," + dr["User_Name"].ToString() + "(" + dr["Employee_Name"].ToString() + "," + dr["User_Type_Name"].ToString() + ")";
                                    dsPreFill.Tables[0].Rows[0]["Acc1_Code"] = dr["Region_Code"].ToString();
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
                            }
                            else if (!(string.IsNullOrEmpty(drAccompanist["Acc2_Only_For_Doctor"].ToString())))
                            {
                                dr = dtAccompUser.AsEnumerable().Where(a => a["Region_Code"].ToString().Equals(drAccompanist["Acc2_Only_For_Doctor"].ToString())).FirstOrDefault();
                                if (dr != null)
                                {
                                    dsPreFill.Tables[0].Rows[0]["Acc2_Name"] = dr["Region_Name"].ToString() + "," + dr["User_Name"].ToString() + "(" + dr["Employee_Name"].ToString() + "," + dr["User_Type_Name"].ToString() + ")";
                                    dsPreFill.Tables[0].Rows[0]["Acc2_Code"] = dr["Region_Code"].ToString();
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
                            }
                            else if (!(string.IsNullOrEmpty(drAccompanist["Acc3_Only_For_Doctor"].ToString())))
                            {
                                dr = dtAccompUser.AsEnumerable().Where(a => a["Region_Code"].ToString().Equals(drAccompanist["Acc3_Only_For_Doctor"].ToString())).FirstOrDefault();
                                if (dr != null)
                                {
                                    dsPreFill.Tables[0].Rows[0]["Acc3_Name"] = dr["Region_Name"].ToString() + "," + dr["User_Name"].ToString() + "(" + dr["Employee_Name"].ToString() + "," + dr["User_Type_Name"].ToString() + ")";
                                    dsPreFill.Tables[0].Rows[0]["Acc3_Code"] = dr["Region_Code"].ToString();
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
                            }
                            else if (!(string.IsNullOrEmpty(drAccompanist["Acc4_Only_For_Doctor"].ToString())))
                            {
                                dr = dtAccompUser.AsEnumerable().Where(a => a["Region_Code"].ToString().Equals(drAccompanist["Acc4_Only_For_Doctor"].ToString())).FirstOrDefault();
                                if (dr != null)
                                {
                                    dsPreFill.Tables[0].Rows[0]["Acc4_Name"] = dr["Region_Name"].ToString() + "," + dr["User_Name"].ToString() + "(" + dr["Employee_Name"].ToString() + "," + dr["User_Type_Name"].ToString() + ")";
                                    dsPreFill.Tables[0].Rows[0]["Acc4_Code"] = dr["Region_Code"].ToString();
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
                                                  Data_From = item["Data_From"].ToString()
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
                                                       SFC_Version_No = item["SFC_Version_No"].ToString()
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
                                                  SFC_Version_No = item["SFC_Version_No"].ToString()

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
                                                       SFC_Version_No = item["SFC_Version_No"].ToString()
                                                   }).ToList<DCRHeaderModel>();
                            }
                        }
                        #endregion drafted


                        //#region Generate Prefill Json
                        //if (dsPreFill.Tables.Count > 0)
                        //{
                        //    if (dsPreFill.Tables[0].Rows.Count > 0)
                        //    {
                        //        #region drafted
                        //        string accName = "";
                        //        string accRegion = "";

                        //        // For unapproved or drafted DCR, it will select the saved data from dcr master.
                        //        if (dcrStatus == "3" || dcrStatus == "0" || source == "TAB")
                        //        {

                        //            if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc1_Name"].ToString())))
                        //            {
                        //                accName = dsPreFill.Tables[0].Rows[0]["Acc1_Name"].ToString() + "^";
                        //            }

                        //            if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc2_Name"].ToString())))
                        //            {
                        //                accName += dsPreFill.Tables[0].Rows[0]["Acc2_Name"].ToString() + "^";
                        //            }

                        //            if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc3_Name"].ToString())))
                        //            {
                        //                accName += dsPreFill.Tables[0].Rows[0]["Acc3_Name"].ToString() + "^";
                        //            }

                        //            if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc4_Name"].ToString())))
                        //            {
                        //                accName += dsPreFill.Tables[0].Rows[0]["Acc4_Name"].ToString() + "^";
                        //            }

                        //            //accompanist region
                        //            if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc1_Only_For_Doctor"].ToString())))
                        //            {
                        //                accRegion = dsPreFill.Tables[0].Rows[0]["Acc1_Only_For_Doctor"].ToString() + "^";
                        //            }
                        //            if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc2_Only_For_Doctor"].ToString())))
                        //            {
                        //                accRegion += dsPreFill.Tables[0].Rows[0]["Acc2_Only_For_Doctor"].ToString() + "^";
                        //            }
                        //            if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc3_Only_For_Doctor"].ToString())))
                        //            {
                        //                accRegion += dsPreFill.Tables[0].Rows[0]["Acc3_Only_For_Doctor"].ToString() + "^";
                        //            }
                        //            if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc4_Only_For_Doctor"].ToString())))
                        //            {
                        //                accRegion += dsPreFill.Tables[0].Rows[0]["Acc4_Only_For_Doctor"].ToString() + "^";
                        //            }

                        //        }
                        //        _objData.OpenConnection(_objCurr.GetCompanyCode());
                        //        {
                        //            //  dsSFC = _objData.ExecuteDataSet("exec SP_hdGetAccompanistCodeAndSFCData '" + _objCurr.GetCompanyCode() + "','" + accName + "','" + _objCurr.GetRegionCode() + "','" + _objCurr.GetUserTypeCode() + "'");
                        //            dsSFC = _objData.ExecuteDataSet("exec SP_hdGetAccompanistCodeAndSFCData '" + _objCurr.GetCompanyCode() + "','" + accName + "','" + accRegion + "','" + _objCurr.GetRegionCode() + "','" + _objCurr.GetUserTypeCode() + "'");
                        //        }
                        //        _objData.CloseConnection();
                        //        #endregion drafted
                        //    }

                        //    if (flag.ToUpper() == "A")
                        //    {
                        //        if (dsPreFill.Tables[2].Rows.Count > 0)
                        //        {
                        //            DataTable dt = new DataTable();
                        //            dt = dsPreFill.Tables[2];
                        //            if (dcrStatus == "1" && source != "TAB")
                        //            {
                        //                lstAttendance = (from item in dt.AsEnumerable()
                        //                                 select new Models.DCRAttendance()
                        //                                 {
                        //                                     Activity_Name = item["Activity_Name"].ToString(),
                        //                                     Activity_Code = item["Activity_Code"].ToString(),
                        //                                     Project_Code = item["Project_Code"].ToString(),
                        //                                     Start_Time = "",
                        //                                     End_Time = "",
                        //                                     Remarks = "",
                        //                                     Category = item["Expense_Entity_Code"].ToString()

                        //                                 }).ToList<Models.DCRAttendance>();
                        //            }
                        //            else if (dcrStatus == "3" || dcrStatus == "0" || source == "TAB")
                        //            {
                        //                lstAttendance = (from item in dt.AsEnumerable()
                        //                                 select new Models.DCRAttendance()
                        //                                 {
                        //                                     Activity_Name = item["Activity_Name"].ToString(),
                        //                                     Activity_Code = item["Activity_Code"].ToString(),
                        //                                     Project_Code = item["Project_Code"].ToString(),
                        //                                     Start_Time = item["Start_Time"].ToString(),
                        //                                     End_Time = item["End_Time"].ToString(),
                        //                                     Remarks = item["Remarks"].ToString()
                        //                                 }).ToList<Models.DCRAttendance>();
                        //            }
                        //        }
                        //    }
                        //}

                        //#region drafted
                        //// For unapproved or drafted DCR, it will select the saved data from dcr master.
                        //if (dcrStatus == "3" || dcrStatus == "0" || source == "TAB")
                        //{
                        //    DataRow[] dr;
                        //    dsPreFill.Tables[0].Columns.Add("Acc1_Code", typeof(string));
                        //    dsPreFill.Tables[0].Columns.Add("Acc2_Code", typeof(string));
                        //    dsPreFill.Tables[0].Columns.Add("Acc3_Code", typeof(string));
                        //    dsPreFill.Tables[0].Columns.Add("Acc4_Code", typeof(string));

                        //    if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc1_Name"].ToString())))
                        //    {
                        //        dr = dsSFC.Tables[1].Select("User_Name='" + dsPreFill.Tables[0].Rows[0]["Acc1_Name"].ToString() + "'");
                        //        if (dr.Length > 0)
                        //        {
                        //            dsPreFill.Tables[0].Rows[0]["Acc1_Name"] = dr[0]["Region_Name"].ToString() + "," + dr[0]["User_Name"].ToString() + "(" + dr[0]["User_Type_Name"].ToString() + ")";
                        //            dsPreFill.Tables[0].Rows[0]["Acc1_Code"] = dr[0]["Region_Code"].ToString();
                        //        }
                        //    }
                        //    else if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc1_Only_For_Doctor"].ToString())))
                        //    {
                        //        dr = dsSFC.Tables[1].Select("Region_Code='" + dsPreFill.Tables[0].Rows[0]["Acc1_Only_For_Doctor"].ToString() + "'");
                        //        if (dr.Length > 0)
                        //        {
                        //            dsPreFill.Tables[0].Rows[0]["Acc1_Name"] = dr[0]["Region_Name"].ToString() + "," + dr[0]["User_Name"].ToString() + "(" + dr[0]["User_Type_Name"].ToString() + ")";
                        //            dsPreFill.Tables[0].Rows[0]["Acc1_Code"] = dr[0]["Region_Code"].ToString();
                        //        }
                        //    }


                        //    if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc2_Name"].ToString())))
                        //    {
                        //        dr = dsSFC.Tables[1].Select("User_Name='" + dsPreFill.Tables[0].Rows[0]["Acc2_Name"].ToString() + "'");
                        //        if (dr.Length > 0)
                        //        {
                        //            dsPreFill.Tables[0].Rows[0]["Acc2_Name"] = dr[0]["Region_Name"].ToString() + "," + dr[0]["User_Name"].ToString() + "(" + dr[0]["User_Type_Name"].ToString() + ")";
                        //            dsPreFill.Tables[0].Rows[0]["Acc2_Code"] = dr[0]["Region_Code"].ToString();
                        //        }
                        //    }
                        //    else if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc2_Only_For_Doctor"].ToString())))
                        //    {
                        //        dr = dsSFC.Tables[1].Select("Region_Code='" + dsPreFill.Tables[0].Rows[0]["Acc2_Only_For_Doctor"].ToString() + "'");
                        //        if (dr.Length > 0)
                        //        {
                        //            dsPreFill.Tables[0].Rows[0]["Acc2_Name"] = dr[0]["Region_Name"].ToString() + "," + dr[0]["User_Name"].ToString() + "(" + dr[0]["User_Type_Name"].ToString() + ")";
                        //            dsPreFill.Tables[0].Rows[0]["Acc2_Code"] = dr[0]["Region_Code"].ToString();
                        //        }
                        //    }

                        //    if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc3_Name"].ToString())))
                        //    {
                        //        dr = dsSFC.Tables[1].Select("User_Name='" + dsPreFill.Tables[0].Rows[0]["Acc3_Name"].ToString() + "'");
                        //        if (dr.Length > 0)
                        //        {
                        //            dsPreFill.Tables[0].Rows[0]["Acc3_Name"] = dr[0]["Region_Name"].ToString() + "," + dr[0]["User_Name"].ToString() + "(" + dr[0]["User_Type_Name"].ToString() + ")";
                        //            dsPreFill.Tables[0].Rows[0]["Acc3_Code"] = dr[0]["Region_Code"].ToString();
                        //        }
                        //    }
                        //    else if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc3_Only_For_Doctor"].ToString())))
                        //    {
                        //        dr = dsSFC.Tables[1].Select("Region_Code='" + dsPreFill.Tables[0].Rows[0]["Acc3_Only_For_Doctor"].ToString() + "'");
                        //        if (dr.Length > 0)
                        //        {
                        //            dsPreFill.Tables[0].Rows[0]["Acc3_Name"] = dr[0]["Region_Name"].ToString() + "," + dr[0]["User_Name"].ToString() + "(" + dr[0]["User_Type_Name"].ToString() + ")";
                        //            dsPreFill.Tables[0].Rows[0]["Acc3_Code"] = dr[0]["Region_Code"].ToString();
                        //        }
                        //    }

                        //    if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc4_Name"].ToString())))
                        //    {
                        //        dr = dsSFC.Tables[1].Select("User_Name='" + dsPreFill.Tables[0].Rows[0]["Acc4_Name"].ToString() + "'");
                        //        if (dr.Length > 0)
                        //        {
                        //            dsPreFill.Tables[0].Rows[0]["Acc4_Name"] = dr[0]["Region_Name"].ToString() + "," + dr[0]["User_Name"].ToString() + "(" + dr[0]["User_Type_Name"].ToString() + ")";
                        //            dsPreFill.Tables[0].Rows[0]["Acc4_Code"] = dr[0]["Region_Code"].ToString();
                        //        }
                        //    }
                        //    else if (!(string.IsNullOrEmpty(dsPreFill.Tables[0].Rows[0]["Acc4_Only_For_Doctor"].ToString())))
                        //    {
                        //        dr = dsSFC.Tables[1].Select("Region_Code='" + dsPreFill.Tables[0].Rows[0]["Acc4_Only_For_Doctor"].ToString() + "'");
                        //        if (dr.Length > 0)
                        //        {
                        //            dsPreFill.Tables[0].Rows[0]["Acc4_Name"] = dr[0]["Region_Name"].ToString() + "," + dr[0]["User_Name"].ToString() + "(" + dr[0]["User_Type_Name"].ToString() + ")";
                        //            dsPreFill.Tables[0].Rows[0]["Acc4_Code"] = dr[0]["Region_Code"].ToString();
                        //        }
                        //    }


                        //    DataTable dt = new DataTable();
                        //    dt = dsPreFill.Tables[0];
                        //    lstPreFillData = (from item in dt.AsEnumerable()
                        //                      select new Models.DCRHeaderModel()
                        //                      {
                        //                          Work_Place = item["Place_Worked"].ToString().ToUpper(),
                        //                          Category_Name = item["Category"].ToString(),
                        //                          From_Place = item["From_Place"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                        //                          To_Place = item["To_Place"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                        //                          Travel_Mode = item["Travel_Mode"].ToString(),
                        //                          Distance = item["Travelled_Kms"].ToString(),
                        //                          CP_No = item["CP_Name"].ToString(),
                        //                          CP_Code = item["CPM_No"].ToString(),
                        //                          Start_Time = item["User_Start_Time"].ToString(),
                        //                          End_Time = item["User_End_Time"].ToString(),
                        //                          Acc1_Only_For_Doctor = item["Acc1_Only_For_Doctor"].ToString(),
                        //                          Acc1_Name = item["Acc1_Name"].ToString(),
                        //                          Acc1_Code = item["Acc1_Code"].ToString(),
                        //                          Acc1_Start_Time = item["Accomp_Start_Time"].ToString(),
                        //                          Acc1_End_Time = item["Accomp_End_Time"].ToString(),

                        //                          Acc2_Name = item["Acc2_Name"].ToString(),
                        //                          Acc2_Code = item["Acc2_Code"].ToString(),
                        //                          Acc2_Start_Time = item["Acc2_Start_Time"].ToString(),
                        //                          Acc2_End_Time = item["Acc2_End_Time"].ToString(),
                        //                          Acc2_Only_For_Doctor = item["Acc2_Only_For_Doctor"].ToString(),

                        //                          Acc3_Name = item["Acc3_Name"].ToString(),
                        //                          Acc3_Code = item["Acc3_Code"].ToString(),
                        //                          Acc3_Start_Time = item["Acc3_Time"].ToString(),
                        //                          Acc3_Only_For_Doctor = item["Acc3_Only_For_Doctor"].ToString(),

                        //                          Acc4_Name = item["Acc4_Name"].ToString(),
                        //                          Acc4_Code = item["Acc4_Code"].ToString(),
                        //                          Acc4_Start_Time = item["Acc4_Time"].ToString(),
                        //                          Acc4_Only_For_Doctor = item["Acc4_Only_For_Doctor"].ToString(),
                        //                          Category = item["Entity_Code"].ToString(),
                        //                          Distance_Fare_Code = item["Distance_Fare_code"].ToString(),
                        //                          Route_Way = item["Route_Way"].ToString(),
                        //                          UnApprovalReason = item["Unapproval_Reason"].ToString(),
                        //                          UnApproveBy = item["Approved_By"].ToString(),
                        //                          TPDeviation = item["TP_Deviation"].ToString(),
                        //                          CPDeviation = item["CP_Deviation"].ToString(),
                        //                          Tp_Code = item["TP_Code"].ToString()

                        //                      }).ToList<Models.DCRHeaderModel>();

                        //    // Intermediate place
                        //    if (dsPreFill.Tables[1].Rows.Count > 0)
                        //    {
                        //        DataTable dt1 = new DataTable();
                        //        dt1 = dsPreFill.Tables[1];
                        //        lstIntermediate = (from item in dt1.AsEnumerable()
                        //                           select new Models.DCRHeaderModel()
                        //                           {
                        //                               From_Place = item["From_Place"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                        //                               To_Place = item["To_Place"].ToString().ToUpper().Replace("\n", "").Replace("\r", ""),
                        //                               Distance = item["Distance"].ToString(),
                        //                               Travel_Mode = item["Travel_Mode"].ToString(),
                        //                               Distance_Fare_Code = item["Distance_Fare_Code"].ToString(),
                        //                               Route_Way = item["Route_Way"].ToString()
                        //                           }).ToList<Models.DCRHeaderModel>();
                        //    }
                        //}
                        // #endregion drafted
                    }
                }
            List<JsonResult> lstPreFill;
            if (flag == "A")
            {
                lstPreFill = new List<JsonResult> { Json(lstPreFillData, JsonRequestBehavior.AllowGet), Json(lstIntermediate, JsonRequestBehavior.AllowGet), Json(lstAttendance, JsonRequestBehavior.AllowGet) };
            }
            else
            {
                lstPreFill = new List<JsonResult> { Json(lstPreFillData, JsonRequestBehavior.AllowGet), Json(lstIntermediate, JsonRequestBehavior.AllowGet) };
            }
            return Json(lstPreFill, JsonRequestBehavior.AllowGet);
            //#endregion Generate Prefill Json
        }

        public JsonResult GetStockiests(FormCollection collection)
        {
            try
            {
                string dcrStatus = collection["dcrStatus"].ToString();
                string dcrDate = collection["dcrDate"].ToString();
                string dcrCode = _objCurr.GetDCRCode(dcrDate);
                DataSet dsDraftedStockiest = new DataSet();

                List<Models.DCRStockiestModel> lstDraftedStockiest = new List<Models.DCRStockiestModel>();
                _objData.OpenConnection(_objCurr.GetCompanyCode());
                {
                    dsDraftedStockiest = _objData.ExecuteDataSet("exec SP_hdGetDraftedStockiest '" + _objCurr.GetCompanyCode() + "','" + dcrCode + "','" + _objCurr.GetUserCode() + "','" + dcrDate + "'");
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
                return Json(lstDraftedStockiest, JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        /// <summary>
        /// Get Activity lock type for the day in mobile
        /// </summary>
        /// <param name="userCode"></param>
        /// <param name="dcrDate"></param>
        /// <returns></returns>
        public int GetActivityLocktype(string dcrDate,string flag)
        {
            BL_DCRHeader _objBlheader = new BL_DCRHeader();
            int activityLocktype = 0;
            activityLocktype = _objBlheader.GetActivityLockType(_objCurr.GetCompanyCode(), _objCurr.GetUserCode(), dcrDate,flag);
            return activityLocktype;
        }
    }
}
