using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using System.Web;
using System.Web.Mvc;
using System.Collections;
using DataControl;

namespace HiDoctor_Activity.Controllers
{
    [AjaxSessionActionFilter]
    public class MobileHomeController : Controller
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
            List<Models.DCRHeaderModel> lstPreFillData = new List<Models.DCRHeaderModel>();
            List<Models.DCRHeaderModel> lstIntermediate = new List<Models.DCRHeaderModel>();
            List<Models.DCRAttendance> lstAttendance = new List<Models.DCRAttendance>();
            try
            {
                _objData.OpenConnection(_objCurr.GetCompanyCode());
                {
                    dsPreFill = _objData.ExecuteDataSet("exec SP_hdGetHeaderPrefillData '" + _objCurr.GetCompanyCode() + "','" + _objCurr.GetUserCode() + "','" + dcrStatus + "','" + dcrDate + "','" + _objCurr.GetDCRCode(dcrDate) + "','" + source + "','" + flag + "'");
                }
            }
            finally
            {
                _objData.CloseConnection();
            }
            #region Generate Prefill Json
            if (dsPreFill.Tables.Count > 0)
            {
                if (dsPreFill.Tables[0].Rows.Count > 0)
                {
                    #region drafted
                    string accName = "";
                    string accRegion = "";

                    // For unapproved or drafted DCR, it will select the saved data from dcr master.
                    if (dcrStatus == "3" || dcrStatus == "0" || source == "TAB")
                    {

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
                    _objData.OpenConnection(_objCurr.GetCompanyCode());
                    {
                        //  dsSFC = _objData.ExecuteDataSet("exec SP_hdGetAccompanistCodeAndSFCData '" + _objCurr.GetCompanyCode() + "','" + accName + "','" + _objCurr.GetRegionCode() + "','" + _objCurr.GetUserTypeCode() + "'");
                        dsSFC = _objData.ExecuteDataSet("exec SP_hdGetAccompanistCodeAndSFCData '" + _objCurr.GetCompanyCode() + "','" + accName + "','" + accRegion + "','" + _objCurr.GetRegionCode() + "','" + _objCurr.GetUserTypeCode() + "'");
                    }
                    _objData.CloseConnection();
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
                                      Distance = item["Travelled_Kms"].ToString(),
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
                                           Distance = item["Distance"].ToString(),
                                           Travel_Mode = item["Travel_Mode"].ToString(),
                                           Distance_Fare_Code = item["Distance_Fare_Code"].ToString(),
                                           Route_Way = item["Route_Way"].ToString()
                                       }).ToList<Models.DCRHeaderModel>();
                }
            }
            #endregion drafted
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
            #endregion Generate Prefill Json
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
    }
}
