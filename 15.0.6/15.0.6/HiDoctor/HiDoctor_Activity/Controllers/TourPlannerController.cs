using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.Web.Script.Serialization;
using Newtonsoft.Json;
using ElmahWrapper;
using DataControl;
using System.Text;
using System.Web.SessionState;
using MVCModels.HiDoctor_Master;
using System.Net;
using MVCModels;
namespace HiDoctor_Activity.Controllers
{
    //[SessionState(SessionStateBehavior.ReadOnly)]
    //[AjaxSessionActionFilter]
    public class TourPlannerController : Controller
    {

        //
        // GET: /TourPlanner/
        #region Private variales
        MasterController objMaster = new MasterController();
        DataControl.CurrentInfo objCurr = new DataControl.CurrentInfo();
        DataControl.JSONConverter _objJson = new DataControl.JSONConverter();
        DataControl.SPData objSP = new DataControl.SPData();
        DataControl.Data objData = new DataControl.Data();
        #endregion

        public ActionResult Index()
        {
            ViewBag.CurrentDate = DateTime.Now.ToString("MM/dd/yyyy");
            ViewBag.UserCode = objCurr.GetUserCode();
            ViewBag.UserName = objCurr.GetUserName();
            return View();
        }




        public ActionResult TPApproval()
        {
            ViewBag.CurrentDate = DateTime.Now.ToString("MM/dd/yyyy");
            ViewBag.UserCode = objCurr.GetUserCode();
            return View();
        }

        public ActionResult TPLockManualRelease()
        {
            return View();
        }


        public JsonResult GetAccompanistDetails(FormCollection collection)
        {
            try
            {

                DataSet dsAccomp = new DataSet();
                //List<Models.DCRHeaderModel> lstAccompanist = new List<Models.DCRHeaderModel>();
                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    string empty = "";
                    dsAccomp = objData.ExecuteDataSet("exec SP_hdGetAccompanistDetails '" + objCurr.GetCompanyCode() + "','" + collection["RegionCode"].ToString() + "','" + empty + "','" + collection["User_Code"].ToString() + "','" + collection["TP_Date"].ToString() + "'");
                }


                for (int a = 0; a < dsAccomp.Tables[0].Rows.Count; a++)
                {
                    dsAccomp.Tables[0].Rows[a]["User_Name"] = dsAccomp.Tables[0].Rows[a]["Region_Name"].ToString() + "," + dsAccomp.Tables[0].Rows[a]["User_Name"].ToString() + "(" + dsAccomp.Tables[0].Rows[a]["Employee_Name"].ToString() + "," + dsAccomp.Tables[0].Rows[a]["User_Type_Name"].ToString() + ")";
                    dsAccomp.AcceptChanges();
                }

                return Json(_objJson.Serialize(dsAccomp), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                objData.CloseConnection();
            }
        }
        public JsonResult GetCategory()
        {
            try
            {
                DataSet dsCategory = new DataSet();
                //List<Models.DCRHeaderModel> lstAccompanist = new List<Models.DCRHeaderModel>();
                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    dsCategory = objData.ExecuteDataSet("exec SP_hdGetExpenseEntity '" + objCurr.GetCompanyCode() + "'");
                }
                return Json(_objJson.Serialize(dsCategory), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                objData.CloseConnection();
            }
        }
        public JsonResult GetCPDetails(FormCollection collection)
        {
            try
            {
                DataSet dsCategory = new DataSet();
                DataSet dsUserDtl = new DataSet();
                try
                {
                    objData.OpenConnection(objCurr.GetCompanyCode());
                    {
                        dsUserDtl = objData.ExecuteDataSet("exec SP_hdGetUserTypeCodeByUser '" + objCurr.GetCompanyCode() + "','" + collection["UserCode"].ToString() + "'");
                    }

                }
                finally
                {
                    objData.CloseConnection();
                }
                string userTypeCode = dsUserDtl.Tables[0].Rows[0]["User_Type_Code"].ToString();
                string regionCode = dsUserDtl.Tables[0].Rows[0]["Region_Code"].ToString();
                string tpDate = collection["tpDate"].ToString();
                string accom_CurrentregionCode = collection["AccompanistRegion"].ToString();
                tpDate = ((string.IsNullOrEmpty(tpDate)) ? "" : tpDate);

                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    dsCategory = objData.ExecuteDataSet("exec SP_HD_GetAccompanistCPandCpData '" + objCurr.GetCompanyCode() + "','" + regionCode + "','" + collection["AccompanistName"].ToString() + "','" + collection["AccompanistRegion"].ToString() + "','" + userTypeCode + "','" + tpDate + "'");
                    // dsCategory = objData.ExecuteDataSet("exec SP_hdGetHeaderAutofillData '" + objCurr.GetCompanyCode() + "','" + collection["UserCode"].ToString() + "','" + collection["RegionCode"].ToString() + "'");
                }
                return Json(_objJson.Serialize(dsCategory), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                objData.CloseConnection();
            }
        }
        public JsonResult GetTPDoctors(FormCollection collection)
        {
            try
            {
                DataSet dsDoc = new DataSet();
                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    dsDoc = objData.ExecuteDataSet("exec SP_hdGetDoctorsForTP '" + objCurr.GetCompanyCode() + "'," + collection["RegionCode"].ToString() + ",'" + collection["CPCode"].ToString() + "'");
                }
                return Json(_objJson.Serialize(dsDoc), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                objData.CloseConnection();
            }
        }
        public JsonResult GetSFC(FormCollection collection)
        {
            DataSet dsUserDtl = new DataSet();
            List<Models.DCRHeaderModel> lstSFC = new List<Models.DCRHeaderModel>();

            try
            {
                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    dsUserDtl = objData.ExecuteDataSet("exec SP_hdGetUserTypeCodeByUser '" + objCurr.GetCompanyCode() + "','" + collection["UserCode"].ToString() + "'");
                }
            }
            finally
            {
                objData.CloseConnection();
            }
            string userTypeCode = dsUserDtl.Tables[0].Rows[0]["User_Type_Code"].ToString();
            string regionCode = dsUserDtl.Tables[0].Rows[0]["Region_Code"].ToString();
            string tpDate = collection["tpDate"].ToString();
            tpDate = ((string.IsNullOrEmpty(tpDate)) ? "" : tpDate);
            //ViewBag.RegionCode = regionCode;

            DataSet dsSFC = new DataSet();
            try
            {
                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    dsSFC = objData.ExecuteDataSet("exec SP_hd_V4_GetAccompanistCodeAndSFCData '" + objCurr.GetCompanyCode() + "','" + collection["AccompanistName"].ToString() + "','" + collection["AccompanistRegion"].ToString() + "','" + regionCode + "','" + userTypeCode + "','" + tpDate + "'");
                }
            }
            finally
            {
                objData.CloseConnection();
            }
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
                              //    Distance = item["Distance"].ToString(),
                              Distance = (item["Distance"] != System.DBNull.Value) ? Convert.ToDouble(item["Distance"]).ToString("0.00") : "0.00",
                              Travel_Mode = item["Travel_Mode"].ToString(),
                              Category_Name = item["Category_Name"].ToString(),
                              Region_Code = item["Region_Code"].ToString(),
                              SFC_Version_No = item["SFC_Version_No"].ToString(),
                              SFC_Category_Name = item["SFC_Category_Name"].ToString(),
                              SFC_Region_Code = item["SFC_Region_Code"].ToString(),
                              Fare_Amount = item["Fare_Amount"].ToString(),
                              SFC_Visit_Count = item["SFC_Visit_Count"].ToString(),
                              Minimum_Count = item["Minimum_Count"].ToString(),
                              Region_Name = item["Region_Name"].ToString(),
                          }).ToList<Models.DCRHeaderModel>();
            }
            return Json(lstSFC, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetUserInfo(FormCollection collection)
        {
            try
            {
                DataSet dsUserDtl = new DataSet();
                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    dsUserDtl = objData.ExecuteDataSet("exec SP_hdGetUserTypeCodeByUser '" + objCurr.GetCompanyCode() + "','" + collection["UserCode"].ToString() + "'");
                }
                return Json(_objJson.Serialize(dsUserDtl), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                objData.CloseConnection();
            }
        }
        public JsonResult GetActivity(FormCollection collection)
        {
            try
            {
                DataSet dsUserDtl = new DataSet();
                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    dsUserDtl = objData.ExecuteDataSet("exec SP_hdGetSelectedActivity '" + objCurr.GetCompanyCode() + "','" + collection["UserCode"].ToString() + "'");
                }
                return Json(_objJson.Serialize(dsUserDtl), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                objData.CloseConnection();
            }
        }
        public JsonResult GetCampaignByDoctors(FormCollection collection)
        {
            try
            {
                DataSet dsUserDtl = new DataSet();
                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    dsUserDtl = objData.ExecuteDataSet("EXEC SP_hdGetCampaignByCustomers '" + objCurr.GetCompanyCode() + "'," + collection["DoctorCode"].ToString() + ",'" + collection["TpDate"].ToString() + "'");
                }
                return Json(_objJson.Serialize(dsUserDtl), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                objData.CloseConnection();
            }
        }
        public JsonResult GetProductsForTP(FormCollection collection)
        {
            try
            {
                DataSet dsUserDtl = new DataSet();
                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    dsUserDtl = objData.ExecuteDataSet("EXEC SP_hdGetProductsForTP '" + objCurr.GetCompanyCode() + "','" + collection["DoctorCode"].ToString() + "','" + collection["UserCode"] + "','" + collection["TpDate"].ToString() + "'");
                }
                return Json(_objJson.Serialize(dsUserDtl), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                objData.CloseConnection();
            }
        }
        public JsonResult GetDoctorVisitHistory(FormCollection collection)
        {
            try
            {
                DataSet dsUserDtl = new DataSet();
                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    dsUserDtl = objData.ExecuteDataSet("EXEC SP_hdGetDoctorVisitHistory '" + objCurr.GetCompanyCode() + "','" + collection["DoctorCode"].ToString() + "','" + collection["UserCode"] + "'");
                }
                return Json(_objJson.Serialize(dsUserDtl), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "GetDoctorVisitHistory()");
                return Json("Error", JsonRequestBehavior.AllowGet);
            }
            finally
            {
                objData.CloseConnection();
            }
        }
        public JsonResult GetCPDocCount(FormCollection collection)
        {
            try
            {
                DataSet dsUserDtl = new DataSet();
                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    dsUserDtl = objData.ExecuteDataSet("EXEC SP_hdGetCPDocCount '" + objCurr.GetCompanyCode() + "'," + collection["CPCode"].ToString() + ",'" + collection["UserCode"].ToString() + "'");
                }
                return Json(_objJson.Serialize(dsUserDtl), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                objData.CloseConnection();
            }
        }
        public JsonResult GetTPDaysByMonth(FormCollection collection)
        {
            try
            {
                DataSet dsUserDtl = new DataSet();
                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    dsUserDtl = objData.ExecuteDataSet("EXEC SP_hdGetTPDaysByMonth '" + objCurr.GetCompanyCode() + "','" + collection["UserCode"].ToString() + "','" + collection["Month"].ToString() + "','" + collection["Year"].ToString() + "'");
                }
                return Json(_objJson.Serialize(dsUserDtl), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                objData.CloseConnection();
            }
        }
        public JsonResult GetTPDetailsByMonth(FormCollection collection)
        {
            try
            {
                DataSet dsUserDtl = new DataSet();
                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    dsUserDtl = objData.ExecuteDataSet("EXEC SP_hdGetTPDetailsByMonth '" + objCurr.GetCompanyCode() + "','" + collection["UserCode"].ToString() + "','" + collection["Month"].ToString() + "','" + collection["Year"].ToString() + "'");
                }
                return Json(_objJson.Serialize(dsUserDtl), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                objData.CloseConnection();
            }
        }
        public JsonResult GetTPDayMoreInfo(FormCollection collection)
        {
            try
            {
                DataSet dsUserDtl = new DataSet();
                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    dsUserDtl = objData.ExecuteDataSet("EXEC SP_hdGetTPDayMoreInfo '" + objCurr.GetCompanyCode() + "','" + collection["TPDate"].ToString() + "','" + collection["UserCode"].ToString() + "','" + collection["AccUserCodes"].ToString() + "','" + collection["VacantRegions"].ToString() + "'");
                }
                return Json(_objJson.Serialize(dsUserDtl), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                objData.CloseConnection();
            }
        }
        public string InsertTP(FormCollection collection)
        {
            try
            {
                //Sample Data

                //TPDate=2012-11-01&CallObjective=FIELD&acc_1=banerjee&acc_2=rajendrakumar&acc_3=pompa01&acc_4=goa000&NoOfAccompanist=4&
                //CPCode=CPMJodhpur 2CPtest121042011&Category=EEC00000003&WorkPlace=Barmer&fromPlace_1=Jodhpur&toPlace_1=Barmer&sfcCode=&
                //Doctors=[{},{"id":"DOC00000025D53"},{"id":"DOC00000025D55"},{"id":"DOC00000025D56"},{"id":"DOC00000025D57"},{"id":"DOC00000025D61"}]&
                //DoctorProduct=[{"id":0},{"id":"DOC00000025D53","ProductCode":"PDC00000138","ProductName":"Colimex Tab - Sample(MY-PROD)","Qty":""},{"id":"DOC00000025D55","ProductCode":"PDC00000138","ProductName":"Colimex Tab - Sample(MY-PROD)","Qty":""}]

                //Decalre Variables
                string tpDate = "", callObject = "", cpCode = "", category = "", workPlace = "", acc1Name = "", acc2Name = "", acc3Name = "", acc4Name = "", userCode = "", remarks = "", activityCode = "", projectCode = "";
                string acc1OnlyDoc = "", acc2OnlyDoc = "", acc3OnlyDoc = "", acc4OnlyDoc = "", meetingPoint = "", meetingTime = "";
                string tp_Approval_Needed = string.Empty;
                int noOfAccompanist = 0, sfcCount = 0, accompOnlyForDocCount = 0;
                string tpId = "", TPStatus = "";

                //Get the value from form collection
                tpDate = collection["TPDate"].ToString();
                callObject = collection["CallObjective"].ToString();

                if (callObject.ToUpper() == "FIELD" || callObject.ToUpper() == "FIELD_RCPA")
                {
                    noOfAccompanist = int.Parse(collection["NoOfAccompanist"]);
                    accompOnlyForDocCount = int.Parse(collection["AccompanistOnlyDocCount"]);
                    cpCode = collection["CPCode"].ToString();
                    workPlace = collection["WorkPlace"].ToString();
                    category = collection["Category"].ToString();
                    userCode = collection["UserCode"].ToString();
                    remarks = collection["Remarks"].ToString();
                    sfcCount = int.Parse(collection["SFCCount"].ToString());
                    meetingPoint = collection["meeingPoint"].ToString();
                    meetingTime = collection["meetingTime"].ToString();
                    tp_Approval_Needed = collection["tp_Approval_Nedded"].ToString();
                    TPStatus = collection["TPStatus"].ToString();
                    if (noOfAccompanist > 0)
                    {
                        if (collection.AllKeys.Contains("acc_1"))
                        {
                            acc1Name = collection["acc_1"].ToString();
                        }
                        if (collection.AllKeys.Contains("acc_2"))
                        {
                            acc2Name = collection["acc_2"].ToString();
                        }
                        if (collection.AllKeys.Contains("acc_3"))
                        {
                            acc3Name = collection["acc_3"].ToString();
                        }
                        if (collection.AllKeys.Contains("acc_4"))
                        {
                            acc4Name = collection["acc_4"].ToString();
                        }
                    }
                    //for (int a = 1; a <= noOfAccompanist; a++)
                    //{
                    //    switch (a)
                    //    {
                    //        case 1:
                    //            acc1Name = collection["acc_" + a].ToString();
                    //            break;
                    //        case 2:
                    //            acc2Name = collection["acc_" + a].ToString();
                    //            break;
                    //        case 3:
                    //            acc3Name = collection["acc_" + a].ToString();
                    //            break;
                    //        case 4:
                    //            acc4Name = collection["acc_" + a].ToString();
                    //            break;
                    //    }
                    //}
                    if (accompOnlyForDocCount > 0)
                    {
                        if (collection.AllKeys.Contains("accOnly_1"))
                        {
                            acc1OnlyDoc = collection["accOnly_1"].ToString();
                        }
                        if (collection.AllKeys.Contains("accOnly_2"))
                        {
                            acc2OnlyDoc = collection["accOnly_2"].ToString();
                        }
                        if (collection.AllKeys.Contains("accOnly_3"))
                        {
                            acc3OnlyDoc = collection["accOnly_3"].ToString();
                        }
                        if (collection.AllKeys.Contains("accOnly_4"))
                        {
                            acc4OnlyDoc = collection["accOnly_4"].ToString();
                        }
                    }
                    //for (int a = 1; a <= accompOnlyForDocCount; a++)
                    //{
                    //    switch (a)
                    //    {
                    //        case 1:
                    //            acc1OnlyDoc = collection["accOnly_" + a].ToString();
                    //            break;
                    //        case 2:
                    //            acc2OnlyDoc = collection["accOnly_" + a].ToString();
                    //            break;
                    //        case 3:
                    //            acc3OnlyDoc = collection["accOnly_" + a].ToString();
                    //            break;
                    //        case 4:
                    //            acc4OnlyDoc = collection["accOnly_" + a].ToString();
                    //            break;
                    //    }

                    //generate query for tp header insertion
                    string tpheaderQry = "EXEC SP_hdInsertTPHeader '" + objCurr.GetCompanyCode() + "','" + userCode + "','" + cpCode + "','" + tpDate + "','" + workPlace + "','" + acc1Name + "',";
                    tpheaderQry += "'" + acc2Name + "','" + acc3Name + "','" + acc4Name + "','" + acc1OnlyDoc + "','" + acc2OnlyDoc + "','";
                    tpheaderQry += acc3OnlyDoc + "','" + acc4OnlyDoc + "','" + callObject + "','" + callObject + "','" + category + "','";
                    tpheaderQry += objCurr.GetUserName() + "','" + remarks + "','" + @meetingPoint + "','" + @meetingTime + "','" + tp_Approval_Needed + "','" + TPStatus + "'";

                    //tP header insert
                    tpId = "";
                    try
                    {
                        objData.OpenConnection(objCurr.GetCompanyCode());
                        {
                            tpId = objData.ExecuteScalar(tpheaderQry).ToString();
                        }
                    }
                    finally
                    {
                        objData.CloseConnection();
                    }


                    //SFC insert
                    string tpsfcQry = "", sfcCode = "", fromPlace = "", toPlace = "";
                    string SFCVersionNo = "", TravelMode = "", SFCCategoryName = "", Distance = "", FareAmount = "", SFCVisitCount = "", SFCRegionCode = "";
                    for (int s = 1; s <= sfcCount; s++)
                    {
                        if (collection["sfcCode_" + s] != null)
                        {
                            sfcCode = collection["sfcCode_" + s].ToString();
                            fromPlace = collection["fromPlace_" + s].ToString();
                            toPlace = collection["toPlace_" + s].ToString();
                            SFCVersionNo = collection["SFCVersionNo_" + s].ToString();
                            TravelMode = collection["TravelMode_" + s].ToString();
                            SFCCategoryName = collection["SFCCategoryName_" + s].ToString();
                            Distance = collection["Distance_" + s].ToString();
                            FareAmount = collection["FareAmount_" + s].ToString();
                            SFCVisitCount = collection["SFCVisitCount_" + s].ToString();
                            SFCRegionCode = collection["SFCRegionCode_" + s].ToString();

                            if (!string.IsNullOrEmpty(fromPlace) && !string.IsNullOrEmpty(toPlace))
                            {
                                tpsfcQry += "EXEC SP_hdInsertTPSFC '" + tpId + "','" + sfcCode + "','" + fromPlace + "','" + toPlace + "','" + SFCVersionNo + "','" + TravelMode + "','" + SFCCategoryName + "','" + Distance + "','" + FareAmount + "','" + SFCVisitCount + "','" + SFCRegionCode + "';";
                            }
                        }
                    }
                    if (!string.IsNullOrEmpty(tpsfcQry))
                    {
                        try
                        {
                            objData.OpenConnection(objCurr.GetCompanyCode());
                            {
                                objData.ExecuteNonQuery(tpsfcQry);
                            }
                        }
                        finally
                        {
                            objData.CloseConnection();
                        }

                    }

                    //Doctors & Product Insert
                    var js = new JavaScriptSerializer();
                    var doctors = (object[])js.DeserializeObject(collection["Doctors"].ToString());
                    List<Models.TourPlannerModel> products = (List<Models.TourPlannerModel>)Newtonsoft.Json.JsonConvert.DeserializeObject(collection["DoctorProduct"], typeof(List<Models.TourPlannerModel>));

                    string doctorCode = "", tpdoctosQry = "", tpdoctorId = "", regionCode = "", batchInsert = "";
                    if (doctors != null)
                    {
                        foreach (Dictionary<string, object> docObj in doctors)
                        {
                            doctorCode = docObj["id"].ToString().Split('_')[0].ToString();
                            regionCode = docObj["id"].ToString().Split('_')[1].ToString();
                            tpdoctosQry = "EXEC SP_hdInsertTPDoctors '" + objCurr.GetCompanyCode() + "','" + tpId + "','" + doctorCode + "','" + regionCode + "'";

                            try
                            {
                                objData.OpenConnection(objCurr.GetCompanyCode());
                                {
                                    tpdoctorId = objData.ExecuteScalar(tpdoctosQry).ToString();
                                }
                            }
                            finally
                            {
                                objData.CloseConnection();
                            }
                            string productCode = "", qty = "", tpProductsQry = "";
                                //Filter product for the doctor`
                                var product = (from c in products
                                               where c.id == doctorCode + "_" + regionCode
                                               select c).ToList();
                                foreach (var prod in product)
                                {
                                    productCode = prod.ProductCode.ToString();
                                    qty = prod.Qty.ToString();
                                    tpProductsQry += "EXEC SP_hdInsertTPProducts '" + tpdoctorId + "','" + productCode + "','" + qty + "';";
                                }

                          

                            if (!string.IsNullOrEmpty(tpProductsQry))
                            {
                                try
                                {
                                    objData.OpenConnection(objCurr.GetCompanyCode());
                                    {
                                        objData.ExecuteNonQuery(tpProductsQry);
                                    }
                                }
                                finally
                                {
                                    objData.CloseConnection();
                                }

                            }
                            //BAtch Insert`
                            string Batchprivillege = objCurr.GetPrivilegeValue("TP_BATCH_AVALIBILITY", "NO");
                            var batchs = (object[])js.DeserializeObject(collection["TPBatch"].ToString());
                            TPStatus = collection["TPStatus"].ToString();
                            batchInsert = "";
                            for (int a = 0; a < batchs.Length; a++)
                            {
                                if (batchs[a].ToString().Split('_')[0] + '_' + batchs[a].ToString().Split('_')[1] == doctorCode + "_" + regionCode)
                                {
                                    batchInsert += "EXEC SP_hdInsertTPBatchs '" + tpId + "','" + tpdoctorId + "','" + TPStatus + "','" + batchs[a].ToString().Split('_')[2] + "','" + batchs[a].ToString().Split('_')[3] + "';";
                                }
                            }
                            if (!string.IsNullOrEmpty(batchInsert))
                            {
                                try
                                {
                                    objData.OpenConnection(objCurr.GetCompanyCode());
                                    {
                                        objData.ExecuteNonQuery(batchInsert);
                                    }
                                }
                                finally
                                {
                                    objData.CloseConnection();
                                }

                            }


                        }
                    }
                 
                   


                    // CP deviation                    
                    try
                    {
                        objData.OpenConnection(objCurr.GetCompanyCode());
                        {
                            objData.ExecuteNonQuery("EXEC SP_hdUpdateCPDeviation '" + objCurr.GetCompanyCode() + "','" + cpCode + "','" + tpId + "';");
                        }
                    }
                    finally
                    {
                        objData.CloseConnection();
                    }

                }
                else if (callObject.ToUpper() == "ATTENDANCE")
                {
                    workPlace = collection["WorkPlace"].ToString();
                    category = collection["Category"].ToString();
                    userCode = collection["UserCode"].ToString();
                    remarks = collection["Remarks"].ToString();
                    sfcCount = int.Parse(collection["SFCCount"].ToString());
                    activityCode = collection["ActivityCode"].Split('_')[0].ToString();
                    projectCode = collection["ActivityCode"].Split('_')[1].ToString();
                    tp_Approval_Needed = collection["tp_Approval_Nedded"].ToString();
                    TPStatus = collection["TPStatus"].ToString(); ;

                    //generate query for tp header insertion
                    string tpheaderQry = "EXEC SP_hdInsertTPHeader '" + objCurr.GetCompanyCode() + "','" + userCode + "','" + cpCode + "','" + tpDate + "','" + workPlace + "','" + acc1Name + "',";
                    tpheaderQry += "'" + acc2Name + "','" + acc3Name + "','" + acc4Name + "','" + acc1OnlyDoc + "','" + acc2OnlyDoc + "','";
                    tpheaderQry += acc3OnlyDoc + "','" + acc4OnlyDoc + "','" + projectCode + "','" + activityCode + "','" + category + "','";
                    tpheaderQry += objCurr.GetUserName() + "','" + remarks + "','" + @meetingPoint + "','" + @meetingTime + "','" + @tp_Approval_Needed + "','" + TPStatus + "'";

                    //tP header insert
                    tpId = "";
                    try
                    {
                        objData.OpenConnection(objCurr.GetCompanyCode());
                        {
                            tpId = objData.ExecuteScalar(tpheaderQry).ToString();
                        }
                    }
                    finally
                    {
                        objData.CloseConnection();
                    }


                    //SFC insert
                    string tpsfcQry = "", sfcCode = "", fromPlace = "", toPlace = "";
                    string SFCVersionNo = "", TravelMode = "", SFCCategoryName = "", Distance = "", FareAmount = "", SFCVisitCount = "", SFCRegionCode = "";
                    for (int s = 1; s <= sfcCount; s++)
                    {
                        if (collection["sfcCode_" + s] != null)
                        {
                            sfcCode = collection["sfcCode_" + s].ToString();
                            fromPlace = collection["fromPlace_" + s].ToString();
                            toPlace = collection["toPlace_" + s].ToString();

                            sfcCode = collection["sfcCode_" + s].ToString();
                            fromPlace = collection["fromPlace_" + s].ToString();
                            toPlace = collection["toPlace_" + s].ToString();
                            SFCVersionNo = collection["SFCVersionNo_" + s].ToString();
                            TravelMode = collection["TravelMode_" + s].ToString();
                            SFCCategoryName = collection["SFCCategoryName_" + s].ToString();
                            Distance = collection["Distance_" + s].ToString();
                            FareAmount = collection["FareAmount_" + s].ToString();
                            SFCVisitCount = collection["SFCVisitCount_" + s].ToString();
                            SFCRegionCode = collection["SFCRegionCode_" + s].ToString();

                            if (!string.IsNullOrEmpty(fromPlace) && !string.IsNullOrEmpty(toPlace))
                            {
                                tpsfcQry += "EXEC SP_hdInsertTPSFC '" + tpId + "','" + sfcCode + "','" + fromPlace + "','" + toPlace + "','" + SFCVersionNo + "','" + TravelMode + "','" + SFCCategoryName + "','" + Distance + "','" + FareAmount + "','" + SFCVisitCount + "','" + SFCRegionCode + "';";
                            }
                        }
                    }
                    if (!string.IsNullOrEmpty(tpsfcQry))
                    {
                        try
                        {
                            objData.OpenConnection(objCurr.GetCompanyCode());
                            {
                                objData.ExecuteNonQuery(tpsfcQry);
                            }
                        }
                        finally
                        {
                            objData.CloseConnection();
                        }

                    }
                }
                else if (callObject.ToUpper() == "LEAVE")
                {
                    projectCode = collection["LeaveTypeCode"].ToString();
                    userCode = collection["UserCode"].ToString();
                    remarks = collection["Remarks"].ToString();
                    tp_Approval_Needed = collection["tp_Approval_Nedded"].ToString();
                    TPStatus = collection["TPStatus"].ToString();

                    //generate query for tp header insertion
                    string tpheaderQry = "EXEC SP_hdInsertTPHeader '" + objCurr.GetCompanyCode() + "','" + userCode + "','" + cpCode + "','" + tpDate + "','" + workPlace + "','" + acc1Name + "',";
                    tpheaderQry += "'" + acc2Name + "','" + acc3Name + "','" + acc4Name + "','" + acc1OnlyDoc + "','" + acc2OnlyDoc;
                    tpheaderQry += "','" + acc3OnlyDoc + "','" + acc4OnlyDoc + "','" + callObject.ToUpper() + "','" + projectCode + "','";
                    tpheaderQry += category + "','" + objCurr.GetUserName() + "','" + remarks + "','" + @meetingPoint + "','" + @meetingTime + "','" + tp_Approval_Needed + "','" + TPStatus + "'";

                    //tP header insert
                    tpId = "";
                    try
                    {
                        objData.OpenConnection(objCurr.GetCompanyCode());
                        {
                            tpId = objData.ExecuteScalar(tpheaderQry).ToString();
                        }
                    }
                    finally
                    {
                        objData.CloseConnection();
                    }

                }

                // inser tp history
                DataControl.BLApproval _objApp = new DataControl.BLApproval();
            //    int result = _objApp.InsertTPHistory(objCurr.GetCompanyCode(), Convert.ToInt32(tpId));

                return "PASS";
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "InsertTP()");
                return "FAIL:" + ex.Message.ToString();
            }
        }
        public JsonResult GetTPDetailsByDay(FormCollection collection)
        {
            try
            {
                DataSet dsUserDtl = new DataSet();
                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    dsUserDtl = objData.ExecuteDataSet("EXEC SP_hdGetTPDetailsByDay '" + objCurr.GetCompanyCode() + "','" + collection["TPDate"].ToString() + "','" + collection["UserCode"].ToString() + "'");

                }
                return Json(_objJson.Serialize(dsUserDtl), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                objData.CloseConnection();
            }
        }


        public JsonResult GetLeaveTypes(FormCollection collection)
        {
            try
            {
                DataSet dsUserDtl = new DataSet();
                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    dsUserDtl = objData.ExecuteDataSet("EXEC SP_hdGetLeaveTypes '" + objCurr.GetCompanyCode() + "','','" + collection["UserCode"].ToString() + "', '" + collection["tpDate"] + "'");
                }
                return Json(_objJson.Serialize(dsUserDtl), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                objData.CloseConnection();
            }
        }
        public JsonResult GetTPDashBoard(FormCollection collection)
        {
            try
            {
                DataSet dsUserDtl = new DataSet();
                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    dsUserDtl = objData.ExecuteDataSet("EXEC SP_hdGetTPDashBoard '" + objCurr.GetCompanyCode() + "','" + collection["UserCode"].ToString() + "'");
                }
                return Json(_objJson.Serialize(dsUserDtl), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                objData.CloseConnection();
            }
        }
        public JsonResult GetTPSFC(FormCollection collection)
        {
            try
            {
                DataSet dsUserDtl = new DataSet();
                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    dsUserDtl = objData.ExecuteDataSet("EXEC SP_hdGetTPSFC '" + objCurr.GetCompanyCode() + "','" + collection["TPDate"] + "','" + collection["UserCode"].ToString() + "'");
                }
                return Json(_objJson.Serialize(dsUserDtl), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                objData.CloseConnection();
            }

        }
        public JsonResult GetMonthlyTP(FormCollection collection)
        {
            try
            {
                DataSet dsUserDtl = new DataSet();
                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    dsUserDtl = objData.ExecuteDataSet("EXEC SP_HD_GET_MonthlyTP " + collection["Month"] + "," + collection["Year"] + ",'" + collection["UserCode"].ToString() + "'");
                }
                return Json(_objJson.Serialize(dsUserDtl), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                objData.CloseConnection();
            }
        }
        public string GlobalSubmit(FormCollection collection)
        {
            try
            {
                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    objData.ExecuteNonQuery("EXEC SP_HD_UPD_GlobalSubmit " + collection["Month"] + "," + collection["Year"] + ",'" + collection["UserCode"].ToString() + "'");
                }
                return "SUCCESS";
            }
            catch (Exception ex)
            {
                return "FAILED";
            }
            finally
            {
                objData.CloseConnection();
            }
        }
        public string CheckTPofMonthCompleted(FormCollection collection)
        {
            try
            {
                string val;
                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    string str = "EXEC SP_HD_CHECK_MonthlyTPCompleted " + collection["Month"] + "," + collection["Year"] + ",'" + collection["UserCode"].ToString() + "'";
                    val = (string)objData.ExecuteScalar(str);
                }
                return val;
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

        public JsonResult GetAccompanistPopUpData(FormCollection coll)
        {
            try
            {
                DataSet dsAcc = new DataSet();

                try
                {
                    objData.OpenConnection(objCurr.GetCompanyCode());
                    {
                        dsAcc = objData.ExecuteDataSet("exec SP_hdGetAllUserRegionDataForTP '" + objCurr.GetCompanyCode() + "','" + coll["RegionCode"] + "','" + coll["matchingString"].ToString() + "'");
                    }
                }
                finally
                {
                    objData.CloseConnection();
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
                                              Accompanist_Name = item["Region_Name"].ToString() + "," + item["User_Name"].ToString() + "," + "(" + item["Employee_Name"].ToString() + "," + item["User_Type_Name"].ToString() + ")",
                                              Accompanist_Region_Code = item["Region_Code"].ToString() + "," + item["User_Code"].ToString(),
                                              Region_Code = item["Region_Code"].ToString(),
                                              User_Code = item["User_Code"].ToString(),
                                              Customer_Count_Per_Region = item["Customer_Count_Per_Region"].ToString()
                                          }).ToList<Models.DCRHeaderModel>();
                    }
                }
                return Json(lstAccompanist, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string GetTourPlannerExcelLink(string userCode, int month, int year, string monthName)
        {
            try
            {
                IEnumerable<MVCModels.TourPlannerModel> lstTp;
                BLUser objBL = new BLUser();
                StringBuilder sbTbl = new StringBuilder();
                StringBuilder sbTableContentExcel = new StringBuilder();
                string blobUrl = string.Empty, error = string.Empty;

                lstTp = objBL.GetTourPlannerDetails(objCurr.GetCompanyCode(), userCode, month, year);

                if (lstTp != null && lstTp.Count() > 0)
                {
                    //	Accompanist		Unapproval Reason	Entered Date	Meeting Point	Meeting Time

                    string userName = "";
                    sbTbl.Append("<table>");
                    sbTbl.Append("<tr>");
                    sbTbl.Append("<th>TP Date</th>");
                    sbTbl.Append("<th>CP Name</th>");
                    sbTbl.Append("<th>Call Objective</th>");
                    sbTbl.Append("<th>Status</th>");
                    sbTbl.Append("<th>Category</th>");
                    sbTbl.Append("<th>Work Area</th>");
                    sbTbl.Append("<th>Travel Place</th>");
                    sbTbl.Append("<th>Accompanists</th>");
                    sbTbl.Append("<th>Meeting Point</th>");
                    sbTbl.Append("<th>Meeting Time</th>");
                    sbTbl.Append("<th>Activity</th>");
                    sbTbl.Append("<th>Leave Type</th>");
                    sbTbl.Append("<th>Entered Date</th>");
                    sbTbl.Append("<th>Unapprove Reason</th>");
                    sbTbl.Append("<th>Unapproved Date</th>");
                    sbTbl.Append("</tr><tbody>");


                    foreach (var tp in lstTp)
                    {
                        if (userName == "")
                        {
                            userName = tp.User_Name;
                        }
                        string tpStatus = (tp.TP_Status == "1") ? "Approved" : ((tp.TP_Status == "0") ? "Unapproved" : tp.TP_Status == "3" ? "Draft" : "Applied");
                        string callObj = (tp.Project_Code == "FIELD") ? "Field" : ((tp.Project_Code == "FIELD_RCPA") ? "Field RCPA" : ((tp.Project_Code == "LEAVE") ? "Leave" : "Attendance"));
                        string accomp = "";
                        if (tp.Accomp_Name != "") { accomp += tp.Accomp_Name + ","; }
                        if (tp.Accompanist2_Name != "") { accomp += tp.Accompanist2_Name + ","; }
                        if (tp.Accompanist3_Name != "") { accomp += tp.Accompanist3_Name + ","; }
                        if (tp.Accompanist4_Name != "") { accomp += tp.Accompanist4_Name + ","; }
                        if (accomp != "") { accomp = accomp.TrimEnd(','); }

                        sbTbl.Append("<tr>");
                        sbTbl.Append("<td>" + tp.TP_Date + "</td>");
                        sbTbl.Append("<td>" + tp.CP_name + "</td>");
                        sbTbl.Append("<td>" + callObj + "</td>");
                        sbTbl.Append("<td>" + tpStatus + "</td>");
                        sbTbl.Append("<td>" + tp.Category + "</td>");
                        sbTbl.Append("<td>" + tp.Work_Area + "</td>");
                        sbTbl.Append("<td>" + ((string.IsNullOrEmpty(tp.Travelled_Place)) ? "" : tp.Travelled_Place) + "</td>");
                        sbTbl.Append("<td>" + accomp + "</td>");
                        sbTbl.Append("<td>" + tp.Meeting_Point + "</td>");
                        sbTbl.Append("<td>" + tp.Meeting_Time + "</td>");
                        sbTbl.Append("<td>" + tp.Activity_Name + "</td>");
                        sbTbl.Append("<td>" + tp.Leave_Type_Name + "</td>");
                        sbTbl.Append("<td>" + tp.Entered_Date + "</td>");
                        sbTbl.Append("<td>" + tp.Unapprove_Reason + "</td>");
                        sbTbl.Append("<td>" + tp.Approved_Date + "</td>");
                        sbTbl.Append("</tr>");
                    }
                    sbTbl.Append("</tbody></table>");
                    // Excel Header
                    sbTableContentExcel.Append("<table>Tour Planner for the user - " + userName + " for " + monthName + "-" + year.ToString() + "</table>");
                    sbTableContentExcel.Append(sbTbl.ToString());
                }
                else
                {
                    sbTableContentExcel.Append("No Tour Planner details found.");
                }

                DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                string userNameExcel = objCurr.GetUserName();
                string subDomin = objCurr.GetSubDomain();
                string fileName = "TourPlanner" + "_" + subDomin + "_" + userNameExcel + ".xls";

                blobUrl = objAzureBlob.AzureBlobUploadText(sbTableContentExcel.ToString(), accKey, fileName, "bulkdatasvc");
                return blobUrl;
            }
            catch (Exception ex)
            {
                return "FAIL^" + ex.Message;
            }
        }
        public JsonResult GetTPMandatoryAccompCount(List<TPAccomp> lstAccomp)
        {
            string AccompUserCodes = "";
            int i = 0;
            DataSet ds = new DataSet();
            try
            {
                if (lstAccomp != null)
                {
                    for (i = 0; i < lstAccomp.Count; i++)
                    {
                        if ((lstAccomp[i].AccUserCode.ToString().ToUpper() != "VACANT") && (lstAccomp[i].AccUserCode.ToString().ToUpper() != "NOT ASSIGNED")
                            && (lstAccomp[i].AccUserCode.ToString().ToUpper() != "UNDEFINED"))
                        {
                            objData.OpenConnection(objCurr.GetCompanyCode());
                            {
                                ds = objData.ExecuteDataSet("exec SP_hdGetChildUsers '" + objCurr.GetCompanyCode() + "','" + lstAccomp[i].AccUserCode + "'");
                            }
                        }
                        else
                        {
                            objData.OpenConnection(objCurr.GetCompanyCode());
                            {
                                ds = objData.ExecuteDataSet("exec SP_hdGetChildRegions '" + objCurr.GetCompanyCode() + "','" + lstAccomp[i].AccRegionCode + "'");
                            }
                        }

                        if (ds.Tables[0].Rows.Count == 1)
                        {
                            AccompUserCodes = AccompUserCodes + lstAccomp[i].AccUserCode + ",";
                        }
                        else if (ds.Tables[0].Rows.Count > 1)
                        {
                            AccompUserCodes = AccompUserCodes + "," + "Select a LEAF NODE USER";
                        }
                    }
                }
                return Json(AccompUserCodes, JsonRequestBehavior.AllowGet);
            }
            finally
            {
                objData.CloseConnection();
            }
        }


        public JsonResult GetTPMandatoryDetails(FormCollection coll)
        {
            DataSet dsUserDtl = new DataSet();
            DataSet ds = new DataSet();
            string userCodes;
            string[] AccCompRegion = coll["accRegionCode"].ToString().Split(',');
            int i = 0;
            string result = string.Empty;
            try
            {
                userCodes = coll["accRegionCode"].ToString();
                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    dsUserDtl = objData.ExecuteDataSet("EXEC SP_HDGetTPMandatoryDetails '" + objCurr.GetCompanyCode() + "','" + userCodes + "','" + coll["UserCode"].ToString() + "'");
                }
            }
            catch
            {
                objData.CloseConnection();
            }
            return Json(_objJson.Serialize(dsUserDtl), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetTPDoctorDetails(string companyCode, string userCode, string tpDate, string tpUserCode, string AccregionCodes)
        {
            string[] userCodes;
            string AccompUserCodes = "";

            List<MVCModels.TPAccompanistDetails> lstAccompanist = new List<MVCModels.TPAccompanistDetails>();
            List<MVCModels.TPAccompanistDetails> lstDoctorDetails = new List<MVCModels.TPAccompanistDetails>();

            List<MVCModels.TPPrivilegeForAccompanistDetails> lstPrivilege = new List<MVCModels.TPPrivilegeForAccompanistDetails>();
            int i = 0;

            try
            {
                DataSet userDetails = new DataSet();
                try
                {
                    objData.OpenConnection(objCurr.GetCompanyCode());
                    {
                        userDetails = objData.ExecuteDataSet("exec SP_hdGetChildUsers'" + objCurr.GetCompanyCode() + "','" + objCurr.GetUserCode() + "'");
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }

                //if (userDetails.Tables[0].Rows.Count > 1)
                //{

                DataSet ds = new DataSet();

                try
                {
                    userCodes = userCode.Split(',');

                    for (i = 0; i < userCodes.Length; i++)
                    {
                        objData.OpenConnection(objCurr.GetCompanyCode());
                        {
                            ds = objData.ExecuteDataSet("exec SP_hdGetChildUsers '" + objCurr.GetCompanyCode() + "','" + userCodes[i].ToString() + "'");

                        }

                        if (ds.Tables[0].Rows.Count == 1)
                        {
                            AccompUserCodes = AccompUserCodes + userCodes[i] + ",";
                        }
                    }

                }
                catch (Exception ex)
                {
                    throw ex;
                }
                DataSet dsAcc = new DataSet();
                try
                {
                    objData.OpenConnection(objCurr.GetCompanyCode());
                    {
                        dsAcc = objData.ExecuteDataSet("exec SP_HDGetTPAccompanist '" + objCurr.GetCompanyCode() + "','" + userCode + "','" + tpUserCode + "','" + tpDate + "','" + AccregionCodes + "'");

                    }
                }
                finally
                {
                    objData.CloseConnection();
                }

                if (dsAcc.Tables.Count > 0)
                {
                    if (dsAcc.Tables[2].Rows.Count > 0)
                    {
                        DataTable dt = new DataTable();
                        dt = dsAcc.Tables[2];
                        lstDoctorDetails = (from item in dt.AsEnumerable()
                                            select new MVCModels.TPAccompanistDetails()
                                            {
                                                UserCode = item["User_Code"].ToString(),
                                                Doctor_Name = item["Doctor_Name"].ToString(),
                                                Doctor_Code = item["Doctor_Code"].ToString(),
                                                RegionName = item["Region_Name"].ToString(),
                                                MDL_Number = item["MDL_Number"].ToString(),
                                                Region_Code = item["Region_Code"].ToString(),
                                                TPPlannedDoctors = item["Doctor_Count"].ToString()
                                            }).ToList<MVCModels.TPAccompanistDetails>();
                    }
                }
                //}

                return Json(lstDoctorDetails);
            }
            catch
            {
                throw;
            }
        }
        public string GetTPAccompPopUpData(FormCollection coll)
        {
            string[] userCodes;
            string[] arr;
            string AccompUserCodes = "";
            string[] selectedUserCodes;
            StringBuilder strAccomp = new StringBuilder();
            StringBuilder strSelectedUser = new StringBuilder();
            List<MVCModels.TPAccompanistDetails> lstAccompanist = new List<MVCModels.TPAccompanistDetails>();
            List<MVCModels.TPAccompanistDetails> lstDoctorDetails = new List<MVCModels.TPAccompanistDetails>();
            List<MVCModels.TPAccompanistDetails> lstSelectedAccompanist = new List<MVCModels.TPAccompanistDetails>();
            List<MVCModels.TPAccompanistDetails> lstDoctorCount = new List<MVCModels.TPAccompanistDetails>();
            List<MVCModels.TPAccompanistDetails> lstDoctorCountInRegion = new List<MVCModels.TPAccompanistDetails>();
            List<MVCModels.TPAccompanistDetails> lstAccompnistName = new List<MVCModels.TPAccompanistDetails>();



            List<MVCModels.TPPrivilegeForAccompanistDetails> lstPrivilege = new List<MVCModels.TPPrivilegeForAccompanistDetails>();
            int i = 0, p = 0;

            userCodes = coll["User_Code"].ToString().Split(',');

            try
            {
                DataSet userDetails = new DataSet();

                try
                {
                    objData.OpenConnection(objCurr.GetCompanyCode());
                    {
                        userDetails = objData.ExecuteDataSet("exec SP_hdGetChildUsers'" + objCurr.GetCompanyCode() + "','" + coll["Tp_UserCode"].ToString() + "'");
                    }
                }
                catch (Exception ex)
                {
                    objData.CloseConnection();
                    throw ex;
                }
                DataSet dsAcc = new DataSet();
                DataSet ds = new DataSet();

                try
                {
                    userCodes = coll["User_Code"].ToString().Split(',');
                    selectedUserCodes = userCodes;
                    objData.OpenConnection(objCurr.GetCompanyCode());
                    {
                        dsAcc = objData.ExecuteDataSet("exec SP_HDGetTPAccompanist '" + objCurr.GetCompanyCode() + "','" + coll["User_Code"].ToString() + "','" + coll["Tp_UserCode"].ToString() + "','" + coll["TP_Date"].ToString() + "','" + coll["AccRegionCodes"].ToString() + "'");
                    }
                }
                finally
                {
                    objData.CloseConnection();
                }
                var s = AccompUserCodes;
                arr = s.Split(',');
                if (dsAcc.Tables.Count > 0)
                {
                    if (dsAcc.Tables[0].Rows.Count > 0)
                    {
                        DataTable dt = new DataTable();
                        dt = dsAcc.Tables[0];
                        lstAccompanist = (from item in dt.AsEnumerable()
                                          select new MVCModels.TPAccompanistDetails()
                                          {
                                              UserCode = item["User_Code"].ToString(),
                                              Region_Code = item["Region_Code"].ToString(),
                                              UserName = item["User_Name"].ToString(),
                                              Designation = item["User_Type_Name"].ToString(),
                                              RegionName = item["Region_Name"].ToString(),
                                              Category = item["Category"].ToString(),
                                              WorkPlace = item["Work_Area"].ToString(),
                                              CPName = item["CP_Name"].ToString(),
                                              Category_Code = item["Category_Code"].ToString(),
                                              CP_Code = item["CP_code"].ToString()
                                          }).ToList<MVCModels.TPAccompanistDetails>();
                    }
                    if (dsAcc.Tables[1].Rows.Count > 0)
                    {
                        DataTable dt = new DataTable();
                        dt = dsAcc.Tables[1];
                        lstPrivilege = (from item in dt.AsEnumerable()
                                        select new MVCModels.TPPrivilegeForAccompanistDetails()
                                        {
                                            UserCode = item["User_Code"].ToString(),
                                            Privilege_Name = item["Privilege_Name"].ToString(),
                                            Privilege_Value_Name = item["Privilege_Value_Name"].ToString()
                                        }).ToList<MVCModels.TPPrivilegeForAccompanistDetails>();

                    }
                    if (dsAcc.Tables[2].Rows.Count > 0)
                    {
                        DataTable dt = new DataTable();
                        dt = dsAcc.Tables[2];
                        lstDoctorDetails = (from item in dt.AsEnumerable()
                                            select new MVCModels.TPAccompanistDetails()
                                            {
                                                UserCode = item["User_Code"].ToString(),
                                                Doctor_Name = item["Doctor_Name"].ToString(),
                                                Doctor_Code = item["Doctor_Code"].ToString(),
                                                RegionName = item["Region_Name"].ToString(),
                                                MDL_Number = item["MDL_Number"].ToString(),
                                                Region_Code = item["Region_Code"].ToString(),
                                                TPPlannedDoctors = item["Doctor_Count"].ToString()
                                            }).ToList<MVCModels.TPAccompanistDetails>();
                    }

                    if (dsAcc.Tables[3].Rows.Count > 0)
                    {
                        DataTable dt = new DataTable();
                        dt = dsAcc.Tables[3];
                        lstSelectedAccompanist = (from item in dt.AsEnumerable()
                                                  select new MVCModels.TPAccompanistDetails()
                                                  {
                                                      UserCode = item["User_Code"].ToString(),
                                                      UserName = item["User_Name"].ToString(),
                                                      Designation = item["User_Type_Name"].ToString(),
                                                      RegionName = item["Region_Name"].ToString()
                                                  }).ToList<MVCModels.TPAccompanistDetails>();
                    }
                    if (dsAcc.Tables[4].Rows.Count > 0)
                    {
                        DataTable dt = new DataTable();
                        dt = dsAcc.Tables[4];
                        lstDoctorCount = (from item in dt.AsEnumerable()
                                          select new MVCModels.TPAccompanistDetails()
                                          {
                                              UserCode = item["User_Code"].ToString(),
                                              TPPlannedDoctors = item["Doctor_Count"].ToString()
                                          }).ToList<MVCModels.TPAccompanistDetails>();
                    }

                    if (dsAcc.Tables[5].Rows.Count > 0)
                    {
                        DataTable dt = new DataTable();
                        dt = dsAcc.Tables[5];
                        lstDoctorCountInRegion = (from item in dt.AsEnumerable()
                                                  select new MVCModels.TPAccompanistDetails()
                                                  {
                                                      UserCode = item["User_Code"].ToString(),

                                                  }).ToList<MVCModels.TPAccompanistDetails>();
                    }

                    if (dsAcc.Tables[6].Rows.Count > 0)
                    {
                        DataTable dt = new DataTable();
                        dt = dsAcc.Tables[6];
                        lstAccompnistName = (from item in dt.AsEnumerable()
                                             select new MVCModels.TPAccompanistDetails()
                                             {
                                                 UserCode = item["User_Code"].ToString(),
                                                 TPAccompanistName = item["Accompanist"].ToString()
                                             }).ToList<MVCModels.TPAccompanistDetails>();
                    }
                }
                strAccomp.Append("<table id='tblAccompData' class='table table-striped' cellspacing='0' style='margin-bottom: 0px;border: 1px solid #aaa;font-size: 11px;'>");
                strAccomp.Append("<tr><th style='text-align:center;background-color: #78b6dd;'></th>");
                strAccomp.Append("<th style='text-align:center;background-color: #78b6dd;'> Users </th>");
                strAccomp.Append("<th style='text-align:center; background-color: #78b6dd;'> Category </th>");
                strAccomp.Append("<th style='text-align:center; background-color: #78b6dd;' style='max-width: 8px;'> Accompanist </th>");
                strAccomp.Append("<th style='text-align:center; background-color: #78b6dd;'> Work Place </th>");
                strAccomp.Append("<th style='text-align:center; background-color: #78b6dd;'> Beat / Patch Name </th>");
                strAccomp.Append("<th style='text-align:center; background-color: #78b6dd;'> TP Planned <span name='spnDoctorLabel'>Doctor</span> </th></tr>");

                if (lstAccompanist.Count > 0)
                {
                    for (i = 0; i < lstAccompanist.Count; i++)
                    {
                        var lstDisPrivilege = lstPrivilege;
                        var lstDoc = lstDoctorCountInRegion.Where(x => x.UserCode == lstAccompanist[i].UserCode).ToList();

                        if (lstDisPrivilege.Count == 1 && lstDoc.Count > 0)
                        {
                            strAccomp.Append("<tr>");

                            objData.OpenConnection(objCurr.GetCompanyCode());
                            {
                                ds = objData.ExecuteDataSet("exec SP_hdGetChildUsers '" + objCurr.GetCompanyCode() + "','" + lstAccompanist[i].UserCode + "'");

                            }

                            if ((lstDisPrivilege[0].Privilege_Name == "SHOW_ACCOMPANISTS_DATA") && ((lstDoc.Count > 0) && (ds.Tables[0].Rows.Count == 1)))
                            {
                                strAccomp.Append("<td><input type='radio' name='holidayList'/></td>");
                            }
                            else
                            {
                                strAccomp.Append("<td></td>");
                            }



                            strAccomp.Append("<td>" + lstAccompanist[i].UserName + "_" + lstAccompanist[i].Designation + "_" + lstAccompanist[i].RegionName + "</td>");
                            strAccomp.Append("<td>" + lstAccompanist[i].Category + "</td>");
                            strAccomp.Append("<input type='hidden' id='hdnSelectedAcc' value='" + lstAccompanist[i].UserCode + "'>");
                            strAccomp.Append("<input type='hidden' id='hdnCategory' value='" + lstAccompanist[i].Category_Code + "'>");

                            var lstAccomp = lstAccompnistName.Where(x => x.UserCode == lstAccompanist[i].UserCode).ToList();
                            if (lstAccomp.Count > 0)
                            {
                                string[] accompNames;
                                string Acc = string.Empty;
                                accompNames = lstAccomp[0].TPAccompanistName.Split(',');
                                for (int a = 0; a < accompNames.Count(); a++)
                                {
                                    if (accompNames[a].Trim() != "")
                                    {
                                        Acc = Acc + accompNames[a] + ",";
                                    }

                                }
                                strAccomp.Append("<td style='max-width: 138px;'>" + Acc.TrimEnd(',').ToString() + "</td>");
                            }
                            else
                            {
                                strAccomp.Append("<td>--</td>");
                            }
                            strAccomp.Append("<td>" + lstAccompanist[i].WorkPlace + "</td>");
                            if (lstAccompanist[i].CPName != "")
                            {
                                strAccomp.Append("<td>" + lstAccompanist[i].CPName + "</td>");
                                strAccomp.Append("<input type='hidden' id='hdnAccCPName' value='" + lstAccompanist[i].CPName + "'>");
                                strAccomp.Append("<input type='hidden' id='hdnAccCP' value='" + lstAccompanist[i].CP_Code + "'>");
                            }
                            else
                            {
                                strAccomp.Append("<td>--</td>");
                                strAccomp.Append("<input type='hidden' id='hdnAccCPName' value=''>");
                                strAccomp.Append("<input type='hidden' id='hdnAccCP' value=''>");
                            }



                            if (lstDoctorDetails.Count > 0)
                            {
                                lstDoc = lstDoctorDetails.Where(x => x.UserCode == lstAccompanist[i].UserCode).ToList();
                                if (lstDoc.Count > 0)
                                {
                                    strAccomp.Append("<td>" + lstDoc.Count + "</td>");
                                    strAccomp.Append("<input type='hidden' id='hdnTPPlannedDoct' value='" + lstDoc.Count + "'>");

                                }
                                else
                                {
                                    strAccomp.Append("<td>--</td>");
                                    strAccomp.Append("<input type='hidden' id='hdnTPPlannedDoct' value=''>");
                                }
                            }
                            else
                            {
                                strAccomp.Append("<td>--</td>");
                                strAccomp.Append("<input type='hidden' id='hdnTPPlannedDoct' value=''>");
                            }
                        }

                        else
                        {
                            strAccomp.Append("<tr>");

                            objData.OpenConnection(objCurr.GetCompanyCode());
                            {
                                ds = objData.ExecuteDataSet("exec SP_hdGetChildUsers '" + objCurr.GetCompanyCode() + "','" + lstAccompanist[i].UserCode + "'");

                            }

                            if ((lstDoc.Count > 0) && (ds.Tables[0].Rows.Count == 1))
                            {
                                strAccomp.Append("<td><input type='radio' name='holidayList'/></td>");
                            }
                            else
                            {
                                strAccomp.Append("<td></td>");
                            }

                            strAccomp.Append("<td>" + lstAccompanist[i].UserName + "_" + lstAccompanist[i].Designation + "_" + lstAccompanist[i].RegionName + "</td>");
                            strAccomp.Append("<td>" + lstAccompanist[i].Category + "</td>");
                            strAccomp.Append("<input type='hidden' id='hdnSelectedAcc' value='" + lstAccompanist[i].UserCode + "'>");
                            strAccomp.Append("<input type='hidden' id='hdnCategory' value='" + lstAccompanist[i].Category_Code + "'>");

                            var lstAccomp = lstAccompnistName.Where(x => x.UserCode == lstAccompanist[i].UserCode).ToList();
                            if (lstAccomp.Count > 0)
                            {
                                string[] accompNames;
                                string Acc = string.Empty;
                                accompNames = lstAccomp[0].TPAccompanistName.Split(',');
                                for (int a = 0; a < accompNames.Count(); a++)
                                {
                                    if (accompNames[a].Trim() != "")
                                    {
                                        Acc = Acc + accompNames[a] + ",";
                                    }

                                }
                                strAccomp.Append("<td style='max-width: 138px;'>" + Acc.TrimEnd(',').ToString() + "</td>");
                            }
                            else
                            {
                                strAccomp.Append("<td>--</td>");
                            }

                            strAccomp.Append("<td>" + lstAccompanist[i].WorkPlace + "</td>");

                            if (lstAccompanist[i].CPName != "")
                            {
                                strAccomp.Append("<td>" + lstAccompanist[i].CPName + "</td>");
                                strAccomp.Append("<input type='hidden' id='hdnAccCPName' value='" + lstAccompanist[i].CPName + "'>");
                                strAccomp.Append("<input type='hidden' id='hdnAccCP' value='" + lstAccompanist[i].CP_Code + "'>");
                            }
                            else
                            {
                                strAccomp.Append("<td>--</td>");
                                strAccomp.Append("<input type='hidden' id='hdnAccCPName' value=''>");
                                strAccomp.Append("<input type='hidden' id='hdnAccCP' value=''>");
                            }



                            if (lstDoctorDetails.Count > 0)
                            {
                                lstDoc = lstDoctorDetails.Where(x => x.UserCode == lstAccompanist[i].UserCode).ToList();
                                if (lstDoc.Count > 0)
                                {
                                    strAccomp.Append("<td>" + lstDoc.Count + "</td>");
                                    strAccomp.Append("<input type='hidden' id='hdnTPPlannedDoct' value='" + lstDoc.Count + "'>");

                                }
                                else
                                {
                                    strAccomp.Append("<td>--</td>");
                                    strAccomp.Append("<input type='hidden' id='hdnTPPlannedDoct' value=''>");
                                }
                            }
                            else
                            {
                                strAccomp.Append("<td>--</td>");
                                strAccomp.Append("<input type='hidden' id='hdnTPPlannedDoct' value=''>");
                            }

                        }
                    }
                    var Except = selectedUserCodes.Except(lstAccompanist.Select(x => x.UserCode)).ToList();

                    foreach (var a in Except)
                    {
                        var join = lstSelectedAccompanist.Where(x => x.UserCode == a.ToString()).ToList();
                        if (join.Count != 0)
                        {
                            for (int k = 0; k < join.Count; k++)
                            {
                                strAccomp.Append("<tr>");
                                strAccomp.Append("<td></td>");
                                strAccomp.Append("<td>" + join[k].UserName + "_" + join[k].Designation + "_" + join[k].RegionName + "</td>");
                                strAccomp.Append("<td colspan='5' style='text-align: center;'>--No TP--</td>");
                                strAccomp.Append("</tr>");
                            }
                        }
                    }
                }
                else
                {
                    var Except = selectedUserCodes.Except(lstAccompanist.Select(x => x.UserCode)).ToList();

                    //for (i = 0; i < Except.Count; i++)
                    //{
                    var lstDisPrivilege = lstPrivilege;
                    if (lstDisPrivilege.Count == 1)
                    {
                        foreach (var a in Except)
                        {
                            var join = lstSelectedAccompanist.Where(x => x.UserCode == a.ToString()).ToList();
                            if (join.Count != 0)
                            {
                                for (int k = 0; k < join.Count; k++)
                                {
                                    strAccomp.Append("<tr>");
                                    strAccomp.Append("<td></td>");
                                    strAccomp.Append("<td>" + join[k].UserName + "_" + join[k].Designation + "_" + join[k].RegionName + "</td>");
                                    strAccomp.Append("<td colspan='5' style='text-align: center;'>--No TP--</td>");
                                    strAccomp.Append("</tr>");
                                }
                            }
                        }
                    }
                    else
                    {
                        foreach (var a in Except)
                        {
                            var join = lstSelectedAccompanist.Where(x => x.UserCode == a.ToString()).ToList();
                            if (join.Count != 0)
                            {
                                for (int k = 0; k < join.Count; k++)
                                {
                                    strAccomp.Append("<tr>");
                                    strAccomp.Append("<td></td>");
                                    strAccomp.Append("<td>" + join[k].UserName + "_" + join[k].Designation + "_" + join[k].RegionName + "</td>");
                                    strAccomp.Append("<td colspan='5' style='text-align: center;'>--No TP--</td>");
                                    strAccomp.Append("</tr>");
                                }
                            }
                        }
                    }
                    //}
                }

                if (strAccomp.ToString() != "")
                {
                    return strAccomp.ToString();
                }
                else
                {
                    return "False";
                }
            }
            catch (Exception ex)
            {
                objData.CloseConnection();
                throw ex;
            }

        }
        public string GetCpLastEnteredDate(string usercode, string cpcode, string tp_date)
        {
            var _objbltp = new BL_TP();
            return _objbltp.GetCpLastEnteredDate(usercode, cpcode, Convert.ToDateTime(tp_date), objCurr.GetCompanyCode());
        }
        public JsonResult GetCampaignDoctors(string UserCodes, string CreatedUserCode, string TP_Date, string VacantRegions)
        {
            var _objbltp = new BL_TP();
            return Json(_objbltp.GetCampaignDoctors(UserCodes, CreatedUserCode, TP_Date, VacantRegions), JsonRequestBehavior.AllowGet);
        }
        #region TPApproval
        /// <summary>
        /// Get users based on Tp status
        /// </summary>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <param name="dcrStatus"></param>
        /// <param name="dcrFlag"></param>
        /// <param name="selection"></param>
        /// <returns></returns>
        public string GetTPSelectedUsers(string month, string year, string tpStatus, string selection, string divisionCodes)
        {
            BLApproval _objApproval = new BLApproval();
            StringBuilder sbContent = new StringBuilder();
            IEnumerable<MVCModels.HiDoctor_Master.UserModel> lstUserList = null;
            lstUserList = _objApproval.GetTPUsersCount(objCurr.GetCompanyCode(), objCurr.GetUserCode(), tpStatus, month, year, selection, divisionCodes).ToList();

            string currentUserCode = string.Empty;
            currentUserCode = objCurr.GetUserCode();

            if (lstUserList != null && lstUserList.ToList().Count > 0)
            {
                sbContent.Append("<ul>");
                foreach (var TpApproval in lstUserList)
                {
                    sbContent.Append("<li><a onclick='fnGetTPDetails(\"" + TpApproval.User_Code + "|" + TpApproval.User_Name + "," + TpApproval.User_Type_Name + "(" + TpApproval.Region_Name + ")" + "\")'>" + TpApproval.User_Name + "," + TpApproval.User_Type_Name + "(" + TpApproval.Region_Name + ")" + "</a></li>");

                }
                sbContent.Append("</ul>");
            }
            else
            {
                sbContent.Append("No users found");
            }

            return sbContent.ToString();
        }

        public JsonResult GetTPApproval(FormCollection collection)
        {
            try
            {
                DataSet dsUserDtl = new DataSet();
                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    dsUserDtl = objData.ExecuteDataSet("EXEC SP_hdGetTPForApproval '" + objCurr.GetCompanyCode() + "','" + collection["UserCode"] + "','" + collection["Month"].ToString() + "','" + collection["Year"].ToString() + "','" + collection["Status"].ToString() + "'");
                }
                return Json(_objJson.Serialize(dsUserDtl), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                objData.CloseConnection();
            }
        }
        public JsonResult GetTpAppliedUsers(FormCollection collection)
        {
            try
            {
                DataSet dsUserDtl = new DataSet();
                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    dsUserDtl = objData.ExecuteDataSet("EXEC SP_hdGetTpAppliedUsers '" + objCurr.GetCompanyCode() + "','" + collection["UserCodes"] + "'");
                }
                return Json(_objJson.Serialize(dsUserDtl), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                objData.CloseConnection();
            }
        }
        public JsonResult TPStatusChange(FormCollection collection)
        {
            try
            {
                DataSet dsUserDtl = new DataSet();
                DataControl.BLApproval _objApp = new DataControl.BLApproval();

                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    int result = _objApp.InsertTPHistory(objCurr.GetCompanyCode(), Convert.ToInt32(collection["TPId"]));

                    //dsUserDtl = objData.ExecuteDataSet("EXEC SP_hdTPStatusChange '" + objCurr.GetCompanyCode() + "','" + collection["TPId"] + "','" + collection["Status"] + "','" + collection["Remarks"].ToString() + "','" + objCurr.GetUserCode() + "','" + objCurr.GetUserName() + "'");
                }
                dsUserDtl = _objApp.GetTPStatusChange(objCurr.GetCompanyCode(), Convert.ToInt32(collection["TPId"].ToString()), collection["Status"].ToString(), collection["Remarks"].ToString(), objCurr.GetUserCode(), objCurr.GetUserName());

                int release = _objApp.GetTPStatusApprovalLockRelease(objCurr.GetCompanyCode(), Convert.ToInt32(collection["TPId"].ToString()), objCurr.GetUserCode());

                //int result = _objApp.InsertTPHistory(objCurr.GetCompanyCode(), Convert.ToInt32(collection["TPId"]));


                return Json(_objJson.Serialize(dsUserDtl), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                objData.CloseConnection();
            }
        }
        public string TPBulkStatusChange(FormCollection collection)
        {
            try
            {
                int tpId = 0;
                string remarks = "";
                DataControl.BLApproval _objApp = new DataControl.BLApproval();

                int rowCount = int.Parse(collection["Count"].ToString());
                DataSet ds = new DataSet();
                for (int i = 1; i <= rowCount; i++)
                {
                    tpId = Convert.ToInt32(collection["tpid_" + i].ToString());
                    int result = _objApp.InsertTPHistory(objCurr.GetCompanyCode(), Convert.ToInt32(tpId));
                }

                for (int i = 1; i <= rowCount; i++)
                {
                    tpId = Convert.ToInt32(collection["tpid_" + i].ToString());
                    remarks = collection["tpremarks_" + i].ToString();

                    ds = _objApp.GetTPStatusChange(objCurr.GetCompanyCode(), tpId, collection["Status"].ToString(), remarks, objCurr.GetUserCode(), objCurr.GetUserName());
                    //qry += "EXEC SP_hdTPStatusChange '" + objCurr.GetCompanyCode() + "','" + tpId + "','" + collection["Status"].ToString() + "','" + remarks + "','" + objCurr.GetUserCode() + "','" + objCurr.GetUserName() + "';";
                }

                int release = _objApp.GetTPStatusApprovalLockRelease(objCurr.GetCompanyCode(), tpId, objCurr.GetUserCode());


                return "";
            }
            finally
            {
                objData.CloseConnection();
            }
        }

        public JsonResult GetTPHistory(string UserCode, string TP_Date)
        {
            try
            {
                //string tblContent = string.Empty;
                //tblContent = BindTPHistoryListString(UserCode, TP_Date);
                // return tblContent;

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("UserCode", UserCode.ToString());
                dicObj.Add("TP_Date", TP_Date.ToString());
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                //return "FAIL^" + ex.Message;
            }
            return BindTPHistoryListString(UserCode, TP_Date);
        }

        private JsonResult BindTPHistoryListString(string UserCode, string TP_Date)
        {
            try
            {

                DataControl.BLApproval _objApp = new DataControl.BLApproval();
                DataControl.CurrentInfo _objCur = new DataControl.CurrentInfo();

                DataSet ds = new DataSet();
                ds = _objApp.GetTPHistory(_objCur.GetCompanyCode(), UserCode, TP_Date);
                //int prodTblCnt = 1;

                return Json(_objJson.Serialize(ds));
                //if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                //{
                //    sbTbl.Append("<div class='col-lg-12 boldText'>TP Date : " + ds.Tables[0].Rows[0]["TP_Date"] + "</div>");
                //    sbTbl.Append("<div class='col-lg-12'>");
                //    sbTbl.Append("<div id='dvAccordion'>");
                //    foreach (DataRow dr in ds.Tables[0].Rows)
                //    {
                //        string headerAccordian = "";
                //        string modifiedDate = "";
                //        headerAccordian = dr["Status"].ToString();
                //        modifiedDate = ((headerAccordian == "2") ? dr["Entered_Date"].ToString() : dr["Approved_Date"].ToString());
                //        headerAccordian = ((headerAccordian == "1") ? "Approved" : ((headerAccordian == "2") ? "Applied" : "Unapproved"));


                //        sbTbl.Append("<h3 style='padding-left: 20px;'>" + headerAccordian + " on " + modifiedDate + "</h3>");
                //        sbTbl.Append("<div class='productBox'>");
                //         tp date
                //        sbTbl.Append("<div class='col-lg-12'>");
                //        sbTbl.Append("<div class='col-lg-3 boldText'>TP Date : </div><div class='col-lg-9'>" + dr["TP_Date"].ToString() + "</div>");
                //        sbTbl.Append("<div style='clear:both;'></div>");
                //        sbTbl.Append("</div>");

                //        tp type
                //        string dcrType = "";
                //        dcrType = dr["Project_Code"].ToString();
                //        if (dcrType == "FIELD" || dcrType == "FIELD_RCPA")
                //        {
                //            dcrType = "Field";
                //        }
                //        else if (dcrType == "LEAVE")
                //        {
                //            dcrType = "Leave";
                //        }
                //        else
                //        {
                //            dcrType = "Attendance";
                //        }
                //        sbTbl.Append("<div class='col-lg-12'>");
                //        sbTbl.Append("<div class='col-lg-3 boldText' >DCR Type : </div><div class='col-lg-9'>" + dcrType + "</div>");
                //        sbTbl.Append("<div style='clear:both;'></div>");
                //        sbTbl.Append("</div>");

                //         for leave
                //        if (dcrType == "Leave")
                //        {
                //            Leave Type
                //            Activity name
                //            DataRow drActivity;
                //            string activityName = "";
                //            drActivity = ds.Tables[4].AsEnumerable().Where(a => a["Header_Tran_ID"].ToString().Equals(dr["Header_Tran_ID"].ToString())).FirstOrDefault();
                //            if (drActivity != null && drActivity["Activity_Name"] != null)
                //            {
                //                activityName = drActivity["Activity_Name"].ToString();
                //            }
                //            sbTbl.Append("<div class='col-lg-12'>");
                //            sbTbl.Append("<div class='col-lg-3 boldText' >Leave Type Name : </div><div class='col-lg-9'>" + activityName + "</div>");
                //            sbTbl.Append("<div style='clear:both;'></div>");
                //            sbTbl.Append("</div>");
                //        }
                //        for field and attendance
                //        else
                //        {
                //            if (dcrType == "Field")
                //            {
                //                CP Name
                //                sbTbl.Append("<div class='col-lg-12'>");
                //                sbTbl.Append("<div class='col-lg-3 boldText'>CP Name : </div><div class='col-lg-9'>" + dr["CP_name"].ToString() + "</div>");
                //                sbTbl.Append("<div style='clear:both;'></div>");
                //                sbTbl.Append("</div>");
                //            }

                //            if (dcrType == "Attendance")
                //            {
                //                Activity name
                //                DataRow drActivity;
                //                string activityName = "";
                //                drActivity = ds.Tables[4].AsEnumerable().Where(a => a["Header_Tran_ID"].ToString().Equals(dr["Header_Tran_ID"].ToString())).FirstOrDefault();
                //                if (drActivity != null && drActivity["Activity_Name"] != null)
                //                {
                //                    activityName = drActivity["Activity_Name"].ToString();
                //                }
                //                sbTbl.Append("<div class='col-lg-12'>");
                //                sbTbl.Append("<div class='col-lg-3 boldText'>Activity Name : </div><div class='col-lg-9'>" + activityName + "</div>");
                //                sbTbl.Append("<div style='clear:both;'></div>");
                //                sbTbl.Append("</div>");
                //            }


                //            Category
                //            sbTbl.Append("<div class='col-lg-12'>");
                //            sbTbl.Append("<div class='col-lg-3 boldText'>Category : </div><div class='col-lg-9'>" + dr["Category"].ToString() + "</div>");
                //            sbTbl.Append("<div style='clear:both;'></div>");
                //            sbTbl.Append("</div>");

                //            Work Place
                //            sbTbl.Append("<div class='col-lg-12'>");
                //            sbTbl.Append("<div class='col-lg-3 boldText'>Work Place : </div><div class='col-lg-9'>" + dr["Work_Area"].ToString() + "</div>");
                //            sbTbl.Append("<div style='clear:both;'></div>");
                //            sbTbl.Append("</div>");

                //             sfc details
                //            #region SFC
                //            sbTbl.Append("<div class='col-lg-12 boldText'>SFC Details</div>");
                //            DataRow[] drSFC;
                //            drSFC = ds.Tables[2].Select("Header_Tran_ID='" + dr["Header_Tran_ID"].ToString() + "'");
                //            if (drSFC != null && drSFC.Length > 0)
                //            {
                //                foreach (var drrSFC in drSFC)
                //                {
                //                    sbTbl.Append("<div class='col-lg-12'>");
                //                    sbTbl.Append("<div class='col-lg-2 boldText'></div><div class='col-lg-10'>" + drrSFC["From_Place"].ToString() + " to " + drrSFC["To_Place"].ToString() + "</div>");
                //                    sbTbl.Append("<div style='clear:both;'></div>");
                //                    sbTbl.Append("</div>");
                //                }
                //            }
                //            else
                //            {
                //                sbTbl.Append("<div class='col-lg-12'>No SFC Details found.</div>");
                //            }
                //            #endregion SFC

                //            if (dcrType == "Field") // for accompanist and doctor details
                //            {
                //                Accomapnist details
                //                #region Accompanist
                //                sbTbl.Append("<div class='col-lg-12 boldText'>Accompanist Details</div>");
                //                DataRow drAcc;
                //                string accNames = "";

                //                int j = 0;

                //                if (dr["ACC1"].ToString() != "")
                //                {
                //                    drAcc = ds.Tables[3].AsEnumerable().Where(a => a["Name"].ToString().Equals(dr["ACC1"].ToString())).FirstOrDefault();
                //                    if (drAcc != null)
                //                    {
                //                        accNames += drAcc["User_Name"].ToString() + "^";
                //                    }
                //                }
                //                if (dr["ACC2"].ToString() != "")
                //                {
                //                    drAcc = ds.Tables[3].AsEnumerable().Where(a => a["Name"].ToString().Equals(dr["ACC2"].ToString())).FirstOrDefault();
                //                    if (drAcc != null)
                //                    {
                //                        accNames += drAcc["User_Name"].ToString() + "^";
                //                    }
                //                }
                //                if (dr["ACC3"].ToString() != "")
                //                {
                //                    drAcc = ds.Tables[3].AsEnumerable().Where(a => a["Name"].ToString().Equals(dr["ACC3"].ToString())).FirstOrDefault();
                //                    if (drAcc != null)
                //                    {
                //                        accNames += drAcc["User_Name"].ToString() + "^";
                //                    }
                //                }
                //                if (dr["ACC4"].ToString() != "")
                //                {
                //                    drAcc = ds.Tables[3].AsEnumerable().Where(a => a["Name"].ToString().Equals(dr["ACC4"].ToString())).FirstOrDefault();
                //                    if (drAcc != null)
                //                    {
                //                        accNames += drAcc["User_Name"].ToString() + "^";
                //                    }
                //                }
                //                if (dr["ACC_ONLY1"].ToString() != "")
                //                {
                //                    drAcc = ds.Tables[3].AsEnumerable().Where(a => a["Region_Code"].ToString().Equals(dr["ACC1"].ToString())).FirstOrDefault();
                //                    if (drAcc != null)
                //                    {
                //                        accNames += drAcc["User_Name"].ToString() + "^";
                //                    }
                //                }
                //                if (dr["ACC_ONLY2"].ToString() != "")
                //                {
                //                    drAcc = ds.Tables[3].AsEnumerable().Where(a => a["Region_Code"].ToString().Equals(dr["ACC2"].ToString())).FirstOrDefault();
                //                    if (drAcc != null)
                //                    {
                //                        accNames += drAcc["User_Name"].ToString() + "^";
                //                    }
                //                }
                //                if (dr["ACC_ONLY3"].ToString() != "")
                //                {
                //                    drAcc = ds.Tables[3].AsEnumerable().Where(a => a["Region_Code"].ToString().Equals(dr["ACC3"].ToString())).FirstOrDefault();
                //                    if (drAcc != null)
                //                    {
                //                        accNames += drAcc["User_Name"].ToString() + "^";
                //                    }
                //                }
                //                if (dr["ACC_ONLY4"].ToString() != "")
                //                {
                //                    drAcc = ds.Tables[3].AsEnumerable().Where(a => a["Region_Code"].ToString().Equals(dr["ACC4"].ToString())).FirstOrDefault();
                //                    if (drAcc != null)
                //                    {
                //                        accNames += drAcc["User_Name"].ToString() + "^";
                //                    }
                //                }

                //                if (accNames != "")
                //                {
                //                    foreach (string accName in accNames.Split('^'))
                //                    {
                //                        if (accName != "")
                //                        {
                //                            j++;
                //                            sbTbl.Append("<div class='col-lg-12'>");
                //                            sbTbl.Append("<div class='col-lg-2 boldText'></div><div class='col-lg-10'>" + j.ToString() + ". " + (accName.Split(',')[1]).Split('(')[0] + "|" + (accName.Split('(')[1]).Split(')')[0] + "|" + accName.Split(',')[0] + "</div>");
                //                            sbTbl.Append("<div style='clear:both;'></div>");
                //                            sbTbl.Append("</div>");
                //                        }
                //                    }
                //                }
                //                else
                //                {
                //                    sbTbl.Append("<div class='col-lg-12'>No Accompanist Details found.</div>");
                //                }
                //                #endregion Accompanist

                //                 doctor details
                //                #region Doctor
                //                sbTbl.Append("<div class='col-lg-12 boldText'>Doctor Details</div>");
                //                DataRow[] drDoc;
                //                drDoc = ds.Tables[1].Select("Header_Tran_ID='" + dr["Header_Tran_ID"].ToString() + "'");
                //                if (drDoc != null && drDoc.Length > 0)
                //                {
                //                    sbTbl.Append("<div class='col-lg-12'>");
                //                    sbTbl.Append("<div  class='table-responsive'><table class='table table-striped' id='tblDFC' cellspacing='0' cellpadding='0'>");
                //                    sbTbl.Append("<thead>");
                //                    sbTbl.Append("<tr>");
                //                    sbTbl.Append("<th >S.No</th>");
                //                    sbTbl.Append("<th >MDL Number</th>");
                //                    sbTbl.Append("<th>Doctor Name</th>");
                //                    sbTbl.Append("<th>Region Name</th>");
                //                    sbTbl.Append("<th>Category</th>");
                //                    sbTbl.Append("<th>Seciality</th>");
                //                    sbTbl.Append("</tr>");
                //                    sbTbl.Append("</thead>");
                //                    sbTbl.Append("<tbody>");
                //                    int i = 1;
                //                    foreach (var drrdoc in drDoc)
                //                    {
                //                        sbTbl.Append("<tr>");
                //                        sbTbl.Append("<td >" + i.ToString() + "</td>");
                //                        sbTbl.Append("<td>" + drrdoc["MDL"].ToString() + "</td>");
                //                        sbTbl.Append("<td class='td-a' onclick='fnShowProducts(\"" + prodTblCnt + "\");'>" + drrdoc["Customer_Name"].ToString() + " (" + drrdoc["Product_Count"].ToString() + " Inputs)</td>");
                //                        sbTbl.Append("<td>" + drrdoc["Region_Name"].ToString() + "</td>");
                //                        sbTbl.Append("<td>" + drrdoc["Speciality_Name"].ToString() + "</td>");
                //                        sbTbl.Append("<td>" + drrdoc["Category_Name"].ToString() + "</td>");
                //                        sbTbl.Append("</tr>");

                //                         bind product details
                //                        DataRow[] drProd;
                //                        drProd = ds.Tables[5].Select("Header_Tran_ID='" + drrdoc["Header_Tran_ID"].ToString() + "' AND TP_Doctor_Id='" + drrdoc["TP_Doctor_Id"].ToString() + "'");

                //                        sbTbl.Append("<tr id='tr_" + prodTblCnt + "' style='display:none'>");
                //                        sbTbl.Append("<td colspan='5'>");
                //                        sbTbl.Append("<div style='border:1px solid #efefef;padding:3px;color:#09778E'>");
                //                        if (drProd != null && drProd.Length > 0)
                //                        {
                //                            foreach (var drrProd in drProd)
                //                            {
                //                                sbTbl.Append(drrProd["Product_Name"].ToString() + " ( " + drrProd["Quantity"].ToString() + " )<br />");
                //                            }
                //                        }
                //                        else
                //                        {
                //                            sbTbl.Append("(No sample details found for this doctor)");
                //                        }
                //                        sbTbl.Append("</div>");

                //                        sbTbl.Append("</td>");
                //                        sbTbl.Append("</tr>");
                //                        i++;
                //                        prodTblCnt++;
                //                    }
                //                    sbTbl.Append("</tbody>");
                //                    sbTbl.Append("</table></div>");
                //                    sbTbl.Append("</div>");
                //                }
                //                else
                //                {
                //                    sbTbl.Append("<div class='col-lg-12'>No Doctor Details found.</div>");
                //                }
                //                #endregion Doctor
                //            }
                //        }

                //        Remarks
                //        sbTbl.Append("<div class='col-lg-12'>");
                //        sbTbl.Append("<div class='col-lg-3 boldText'>Reason : </div><div class='col-lg-9'>" + dr["Remarks"].ToString() + "</div>");
                //        sbTbl.Append("<div style='clear:both;'></div>");
                //        sbTbl.Append("</div>");
                //        if (dr["Status"].ToString() == "0")
                //        {
                //            UnapprovedBy
                //            sbTbl.Append("<div class='col-lg-12'>");
                //            sbTbl.Append("<div class='col-lg-3 boldText'>Unapproved By : </div><div class='col-lg-9'>" + dr["Approved_By"].ToString() + "</div>");
                //            sbTbl.Append("<div style='clear:both;'></div>");
                //            sbTbl.Append("</div>");

                //            Unapproved Date
                //            sbTbl.Append("<div class='col-lg-12'>");
                //            sbTbl.Append("<div class='col-lg-3 boldText'>Unapproved Date : </div><div class='col-lg-9'>" + dr["Approved_Date"].ToString() + "</div>");
                //            sbTbl.Append("<div style='clear:both;'></div>");
                //            sbTbl.Append("</div>");

                //            Unapproved Reason
                //            sbTbl.Append("<div class='col-lg-12'>");
                //            sbTbl.Append("<div class='col-lg-3 boldText'>Unapproved Reason : </div><div class='col-lg-9'>" + dr["Unapprove_Reason"].ToString() + "</div>");
                //            sbTbl.Append("<div style='clear:both;'></div>");
                //            sbTbl.Append("</div>");
                //        }
                //        if (dr["Status"].ToString() == "1")
                //        {
                //            ApprovedBy
                //            sbTbl.Append("<div class='col-lg-12'>");
                //            sbTbl.Append("<div class='col-lg-3 boldText'>Approved By : </div><div class='col-lg-9'>" + dr["Approved_By"].ToString() + "</div>");
                //            sbTbl.Append("<div style='clear:both;'></div>");
                //            sbTbl.Append("</div>");

                //            Approved Date
                //            sbTbl.Append("<div class='col-lg-12'>");
                //            sbTbl.Append("<div class='col-lg-3 boldText'>Approved Date : </div><div class='col-lg-9'>" + dr["Approved_Date"].ToString() + "</div>");
                //            sbTbl.Append("<div style='clear:both;'></div>");
                //            sbTbl.Append("</div>");

                //            Approved Reason
                //            sbTbl.Append("<div class='col-lg-12'>");
                //            sbTbl.Append("<div class='col-lg-3 boldText'>Approved Reason : </div><div class='col-lg-9'>" + dr["Unapprove_Reason"].ToString() + "</div>");
                //            sbTbl.Append("<div style='clear:both;'></div>");
                //            sbTbl.Append("</div>");
                //        }


                //        sbTbl.Append("</div>");
                //    }
                //    sbTbl.Append("</div>");
                //    sbTbl.Append("</div>");

                //}
                //else
                //{
                //    sbTbl.Append("<div class='col-lg-12'>No History found for this tp.</div>");
                //}
                //return sbTbl.ToString();
            }
            catch
            {
                throw;
            }
        }


        #endregion TPApproval

        #region TPLockManuelRelease
        public string BindTPLockReleaseHolidayList()
        {
            try
            {
                string tblContent = string.Empty;
                tblContent = BindTPLockReleaseHolidayListString();
                return tblContent;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return "FAIL^" + ex.Message;
            }
        }

        private string BindTPLockReleaseHolidayListString()
        {
            try
            {
                StringBuilder sbTbl = new StringBuilder();
                IEnumerable<MVCModels.HiDoctor_Master.HolidayModel> lstHoliday;
                DataControl.BLRegion _objRegion = new DataControl.BLRegion();
                DataControl.CurrentInfo _objCur = new DataControl.CurrentInfo();

                lstHoliday = _objRegion.GetHolidaysEnteredInLast15Days(_objCur.GetCompanyCode());
                if (lstHoliday != null && lstHoliday.Count() > 0)
                {
                    List<MVCModels.HiDoctor_Master.HolidayModel> lstHolidays = lstHoliday.ToList();

                    List<String> lstRegion = lstHoliday.Select(h => h.Region_Name).Distinct().ToList();

                    sbTbl.Append("<div  class='table-responsive'><table class='table table-striped' cellspacing='0' cellpadding='0'>");
                    sbTbl.Append("<thead>");
                    sbTbl.Append("<tr>");
                    sbTbl.Append("<th >Select</th>");
                    sbTbl.Append("<th >Region Name</th>");
                    sbTbl.Append("<th >Holiday Date and Name</th>");
                    sbTbl.Append("<th >Lock Month</th>");
                    sbTbl.Append("<th >Lock Year</th>");
                    sbTbl.Append("</tr>");
                    sbTbl.Append("</thead>");
                    sbTbl.Append("<tbody>");


                    foreach (string region in lstRegion)
                    {
                        List<HolidayModel> Holiday = lstHolidays.Where(c => c.Region_Name == region).ToList();
                        var lockCount = Holiday.GroupBy(L => new { L.Lock_Month_Name, L.Lock_Year });


                        for (int i = 0; i < lockCount.ToList().Count; i++)
                        {
                            List<HolidayModel> hlist = Holiday.Where(h1 => h1.Lock_Month_Name == lockCount.ToList()[i].Key.Lock_Month_Name && h1.Lock_Year == lockCount.ToList()[i].Key.Lock_Year).ToList();
                            StringBuilder hdate = new StringBuilder();
                            hdate.Clear();
                            sbTbl.Append("<tr>");
                            foreach (var keyhol in hlist)
                            {
                                hdate.Append(keyhol.Holiday_Date + ",");
                            }
                            sbTbl.Append("<td><input type='radio' value='" + Holiday[0].Region_Code + "^" + hdate.ToString() + "' name='holidayList'/></td>");

                            sbTbl.Append("<td>" + region + "</td>");
                            sbTbl.Append("<td>");
                            foreach (var hol in hlist)
                            {
                                sbTbl.Append("<span>" + hol.Holiday_Name + " - " + hol.Holiday_Date + "</span><br />");
                            }
                            sbTbl.Append("<td>" + lockCount.ToList()[i].Key.Lock_Month_Name + "</td>");
                            sbTbl.Append("<td>" + lockCount.ToList()[i].Key.Lock_Year + "</td>");
                            sbTbl.Append("</tr>");
                        }
                    }
                    sbTbl.Append("</tbody></table></div>");
                    sbTbl.Append("<div class='col-lg-12'><input type='button' class='btn btn-primary' value='Unlock DCR (TP) Lock Entries' onclick='fnUpdateTPLockManuelRelease();' /></div>");
                }
                else
                {
                    sbTbl.Append("<div class='col-lg-12'>No records found.</div>");
                }
                return sbTbl.ToString();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public string UpdateTPLockManuelRelease(string holidayDates, string region_Code)
        {
            try
            {
                string result = string.Empty;
                DataControl.BLRegion _objRegion = new DataControl.BLRegion();
                DataControl.CurrentInfo _objCur = new DataControl.CurrentInfo();
                result = _objRegion.UpdateTPLockManuelRelease(_objCur.GetCompanyCode(), holidayDates, region_Code, _objCur.GetUserCode());
                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return "FAIL^" + ex.Message;
            }
        }
        #endregion TPLockManuelRelease

        #region Adding Cp details for Selected Accompanist
        /// <summary>
        /// Used to Get the Cp details for Selected Accompanist
        /// </summary>
        /// <param name="collection"></param>
        /// <returns></returns>
        public JsonResult GetCpforAccompanist(FormCollection collection)
        {
            try
            {
                DataSet dscpforselectedAccom = new DataSet();
                DataSet dsUserDtl = new DataSet();

                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    dscpforselectedAccom = objData.ExecuteDataSet("exec SP_GetCpforAccompanist '" + objCurr.GetCompanyCode() + "','" + collection["accomcurrentregionCode"] + "'");
                }
                return Json(_objJson.Serialize(dscpforselectedAccom), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                objData.CloseConnection();
            }
        }
        #endregion Adding Cp details for Selected Accompanist

        #region TPReport
        public JsonResult GetTPReport(string tp_Id)
        {
            var _objbltp = new BL_TP();
            return Json(_objbltp.GetTpReport(tp_Id, ""));
        }
        public JsonResult GetTpconsolidatedReport(string userCode, string month, string year)
        {
            BL_TP _objbltp = new BL_TP();
            return Json(_objJson.Serialize(_objbltp.GetTpconsolidatedReport(userCode, month, year, objCurr.GetCompanyCode())));
        }

        public JsonResult GetTPCount(string userCode, string month, string year)
        {
            BL_TP _objbltp = new BL_TP();
            return Json(_objbltp.GetTPCount(userCode, Convert.ToInt32(month), Convert.ToInt32(year), objCurr.GetCompanyCode()));
        }
        #endregion
        #region Batch
        public JsonResult GetBatchInformation(string AccRegionCode, string TpDate, string UserCode)
        {
            var _objbltp = new BL_TP();
            return Json(_objbltp.GetBatchInformation(AccRegionCode, TpDate, UserCode), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetBatchProduct(int Schedule_Id)
        {
            var _objbltp = new BL_TP();
            return Json(_objbltp.GetBatchProduct(Schedule_Id), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetBatchForDoctors(string DoctorCode,string DoctorRegion,string TpDate)
        {
            var _objbltp = new BL_TP();
            string Region_Code = objCurr.GetRegionCode();
            return Json(_objbltp.GetBatchForDoctors(DoctorCode, DoctorRegion, Region_Code, TpDate), JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region TP Syncfusion

        public ActionResult TPSync()
        {
            ViewBag.CurrentDate = DateTime.Now.ToString("MM/dd/yyyy");
            ViewBag.UserCode = objCurr.GetUserCode();
            ViewBag.UserName = objCurr.GetUserName();
            return View();
        }

        #endregion
    }

}



