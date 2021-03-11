using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataControl;
using System.Data;
using System.Text;
using System.Web.SessionState;
using System.Net;
using System.IO;
using System.Diagnostics;
using System.Security.Cryptography.X509Certificates;
using System.Net.Security;
using System.Reflection;

namespace HiDoctor_Reports.Controllers
{
    //[SessionState(SessionStateBehavior.ReadOnly)]
    //[AjaxSessionActionFilter]

    public class UserPerDayController : Controller
    {
        #region Private Variable
        const string COLL_USER_CODE = "userCode";
        const string COLL_START_DATE = "sd";
        const string COLL_FLAG = "flag";
        CurrentInfo _objCur = new CurrentInfo();
        bool header = true;
        #endregion Private Variable

        public ActionResult Index()
        {
            return View();
        }
        string DOCTOR_CAPTION;
        string CHEMIST_CAPTION;
        string STOCKIEST_CAPTION;
        string Reportflag;
        string flag_g;
        public string GetPrivillegeValue()
        {
            CurrentInfo _objCur = new CurrentInfo();
            DOCTOR_CAPTION = _objCur.GetPrivilegeValue("DOCTOR_CAPTION_DISPLAY_NAME", "Doctor");

            if (DOCTOR_CAPTION.Length >= 21)
            {
                DOCTOR_CAPTION = DOCTOR_CAPTION.Remove(20) + "...";

            }
            DOCTOR_CAPTION = System.Threading.Thread.CurrentThread.CurrentCulture.TextInfo.ToTitleCase(DOCTOR_CAPTION.ToLower());
            CHEMIST_CAPTION = _objCur.GetPrivilegeValue("CHEMIST_CAPTION_DISPLAY_NAME", "Chemist");
            if (CHEMIST_CAPTION.Length >= 21)
            {
                CHEMIST_CAPTION = CHEMIST_CAPTION.Remove(20) + "...";

            }
            CHEMIST_CAPTION = System.Threading.Thread.CurrentThread.CurrentCulture.TextInfo.ToTitleCase(CHEMIST_CAPTION.ToLower());
            STOCKIEST_CAPTION = _objCur.GetPrivilegeValue("STOCKIEST_CAPTION_DISPLAY_NAME", "Stockist");
            if (STOCKIEST_CAPTION.Length >= 21)
            {
                STOCKIEST_CAPTION = STOCKIEST_CAPTION.Remove(20) + "...";

            }
            STOCKIEST_CAPTION = System.Threading.Thread.CurrentThread.CurrentCulture.TextInfo.ToTitleCase(STOCKIEST_CAPTION.ToLower());
            var ChemistVisitPrvilg = _objCur.GetPrivilegeValue("DCR_Chemist_Visit_Mode", "No");
            return DOCTOR_CAPTION;
        }
        //public JsonResult Getuserperday(FormCollection collection)
        //{
        //    try
        //    {
        //        CurrentInfo _objCur = new CurrentInfo();
        //        SPData _objSP = new SPData();
        //        string companyCode = _objCur.GetCompanyCode();
        //        string userCode = collection[COLL_USER_CODE].ToString();
        //        string startDate = collection[COLL_START_DATE].ToString();
        //        string flag = collection[COLL_FLAG].ToString();
        //        DataSet ds = new DataSet();
        //        ds = _objSP.GetUserperdayNew(companyCode, userCode, startDate, flag);
        //        DataControl.JSONConverter json = new DataControl.JSONConverter();
        //        return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception ex)
        //    {
        //        Dictionary<string, string> dicObj = new Dictionary<string, string>();
        //        dicObj.Add("userCode", collection[COLL_USER_CODE].ToString());
        //        dicObj.Add("dcrDate", collection[COLL_START_DATE].ToString());
        //        dicObj.Add("flag", collection[COLL_FLAG].ToString());
        //        DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
        //        throw;
        //    }
        //}

        #region User Perday new
        public string GetUserPerDayReport(FormCollection collection)
        {
            string viewoption = string.Empty;
            string companyCode = "";
            string userName = "";
            string userCode = "";
            string startDate = "";
            string Region_Code = "";
            string details = "";
            SPData _objSP = new SPData();
            try
            {
                GetPrivillegeValue();
                CurrentInfo _objCur = new CurrentInfo();
                companyCode = collection["Company_Code"].ToString();
                userName = collection["User_Name"].ToString();
                userCode = collection[COLL_USER_CODE].ToString();
                startDate = collection[COLL_START_DATE].ToString();
                Region_Code = collection["Region_Code"].ToString();
                details = companyCode + '/' + userName + '/' + userCode + '/' + startDate + '/' + Region_Code;
                if (string.IsNullOrEmpty(collection["options"]))
                {
                    viewoption = "S";
                }
                else
                {
                    viewoption = collection["options"].ToString();
                }

                DataSet ds = new DataSet();

                if (string.IsNullOrEmpty(collection[COLL_FLAG]))
                {
                    ds = _objSP.GetUserperdayNew(companyCode, userCode, startDate);
                }
                else
                {
                    string flag = collection[COLL_FLAG].ToString();
                    Reportflag = "DCRApproval";
                    flag_g = flag;
                    ds = _objSP.GetUserperdayNewFlag(companyCode, userCode, startDate, flag);
                }

                StringBuilder strTb = new StringBuilder();

                if (viewoption == "S")
                {
                    strTb = GetUserPerdayReportinHTML(ds, startDate, viewoption, userCode, companyCode, Region_Code);
                }
                else
                {
                    string lastSubmittedTable = GetUserPerdayReportinHTML(ds, startDate, viewoption, userCode, companyCode, Region_Code).ToString();

                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");

                    //string userName = _objCur.GetUserName();
                    //string compCode = _objCur.GetCompanyCode();
                    string subdomainName = System.Web.HttpContext.Current.Request.Url.DnsSafeHost; ;

                    string fileName = "USER_PER_DAY_REPORT" + "_" + subdomainName + "_" + userName + ".xls";
                    string blobUrl = objAzureBlob.AzureBlobUploadText(lastSubmittedTable, accKey, fileName, "bulkdatasvc");

                    strTb.Append("<a href='" + blobUrl + "'>Click here to Download</a>");
                }
                return strTb.ToString();
            }
            catch (Exception ex)
            {
                //Dictionary<string, string> dicObj = new Dictionary<string, string>();
                //dicObj.Add("userCode", collection[COLL_USER_CODE].ToString());
                //dicObj.Add("dcrDate", collection[COLL_START_DATE].ToString());
                //dicObj.Add("options", collection["options"].ToString());
                //DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                //return "FAIL^" + ex.Message;
                string screen_name = "";
                string menuurl = "";
                string result = "";
                if (Reportflag == "DCRApproval")
                {
                    screen_name = "DCRApprovalReport";
                    menuurl = "hidoctor_reports/Userperday/GetUserPerDayReport";
                    result = DataControl.Impl.ErrorHandler.InsertErrorLog(ex, screen_name, menuurl);
                }
                else
                {
                    screen_name = "UserPerDayReport";
                    menuurl = "hidoctor_reports/Userperday/GetUserPerDayReport";
                    result = DataControl.Impl.ErrorHandler.InsertErrorLog(ex, screen_name, menuurl);
                }

                return result;
            }
        }

        public StringBuilder GetUserPerdayReportinHTML(DataSet ds, string startDate, string viewoption, string userCode, string Company_Code, string Region_Code)
        {

            DataTable Table = new DataTable();
            DataTable AttenTable = new DataTable();
            DataSet newtable = new DataSet();
            StringBuilder sbTbl = new StringBuilder();
            DataTable drFiltered = new DataTable();
            DataTable drExpense = new DataTable();
            //string Company_Code = _objCurr.GetCompanyCode();
            if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                //Added for Showing the Accompanist Details                
                if (ds.Tables[0].Rows.Count != 2)
                {
                    string flag = string.Empty;
                    //  var FieldRow = (from m in dt.AsEnumerable()
                    // where m.Field<string>("Flag") == "F"
                    // select m).FirstOrDefault();
                    //if (FlagResult != null)
                    //{                       
                    if (ds.Tables[0].Rows[0]["Flag"].ToString() == "F")
                    {
                        #region Field

                        flag = "F";
                        drFiltered = ds.Tables[0].AsEnumerable().Where(z => Convert.ToString(z["Flag"]) == flag).CopyToDataTable();
                        sbTbl.Append(BindDCRDeatils(ds.Tables[0], flag, startDate, viewoption));
                        sbTbl.Append(BindAccompanistDetails(drFiltered, flag));
                        sbTbl.Append(BindHOPPlaces(ds.Tables[0], ds.Tables[1], flag));
                        int count = ds.Tables[2].Rows.Count;
                        sbTbl.Append(BindOwnDoctorsVisit(ds.Tables[2], viewoption, count, userCode));
                        // sbTbl.Append(BindAccDoctorsVisit(ds.Tables[3], viewoption, ds.Tables[2].Rows.Count));
                        sbTbl.Append(BindCallActivity(ds.Tables[23]));
                        sbTbl.Append(BindMCActivity(ds.Tables[24]));
                        sbTbl.Append(BindDigitalsigndata(ds.Tables[34], flag));
                        if (Company_Code != "COM00000146")
                        {
                            sbTbl.Append(BindDetailedDigitalAssets(ds.Tables[15]));
                        }

                        sbTbl.Append(BindDetaildProductDetails(ds.Tables[11]));
                        sbTbl.Append(BindProductDetails(ds.Tables[4]));
                        sbTbl.Append(BindChemistDetails(ds.Tables[5]));
                        sbTbl.Append(BindPOBDetails(ds.Tables[14]));
                        sbTbl.Append(BindRCPADetails(ds.Tables[6]));
                        sbTbl.Append(BindAttachments(ds.Tables[13]));
                        sbTbl.Append(BindFollowUps(ds.Tables[12]));
                        sbTbl.Append(BindCompetitorProductDetails(ds.Tables[25]));

                        #endregion Field
                        DataControl.HiDoctor_ActivityFactoryClasses.DCR_V4.BL_DCRChemistVisit objDCRChemistVisit = new DataControl.HiDoctor_ActivityFactoryClasses.DCR_V4.BL_DCRChemistVisit();

                        string chemistPlv = objDCRChemistVisit.GetRegionModuleAccess(Region_Code, userCode, ds.Tables[0].Rows[0]["Flag"].ToString());
                        if (ds.Tables[0].Rows[0]["Flag"].ToString() == "F" && chemistPlv == "CHEMIST_DAY")
                        {
                            //  #region field and chemist visit privilege Enabled
                            sbTbl.Append(BindChemistVisitAccompanistDetails(ds.Tables[16]));
                            sbTbl.Append(BindChemistVisitContact(ds.Tables[33]));
                            sbTbl.Append(BindChemistDetaildProductDetails(ds.Tables[18]));
                            sbTbl.Append(BindSamplePromotionProductDetails(ds.Tables[17]));
                            sbTbl.Append(BindChemistVisitPOBDetails(ds.Tables[20]));
                            sbTbl.Append(BindChemistVisitRCPADetails(ds.Tables[19]));
                            sbTbl.Append(BindChemistVisitAttachments(ds.Tables[22]));
                            sbTbl.Append(BindChemistVisitFollowUps(ds.Tables[21]));

                        }
                        sbTbl.Append(BindStockiestDetails(ds.Tables[7]));
                        sbTbl.Append(BindExpenseDetails(ds.Tables[8]));
                        var numb = ds.Tables[35].AsEnumerable().Where(z => Convert.ToString(z["Flag"]) == "F").Count();
                        if (numb > 0)
                        {
                            drExpense = ds.Tables[35].AsEnumerable().Where(z => Convert.ToString(z["Flag"]) == "F").CopyToDataTable();
                            sbTbl.Append(BindExpenseAttachmentDetails(drExpense));
                            sbTbl.Append("<div style='border-bottom: 5px solid #a52e09;margin-top: 10px;'></div>");
                        }
                        else
                        {
                            sbTbl.Append("<div style='border-bottom: 5px solid #a52e09;margin-top: 10px;'></div>");
                        }
                    }

                    else if (ds.Tables[0].Rows[0]["Flag"].ToString() == "A")
                    {
                        #region Attendance
                        flag = "A";
                        sbTbl.Append(BindDCRDeatils(ds.Tables[0], flag, startDate, viewoption));
                        sbTbl.Append(BindHOPPlaces(ds.Tables[0], ds.Tables[1], flag));
                        sbTbl.Append(BindAttendanceDetails(ds.Tables[9]));
                        sbTbl.Append(BindAttendanceDoctorDetails(ds.Tables[29]));
                        sbTbl.Append(BindAttendanceProductDetails(ds.Tables[26], userCode));
                        sbTbl.Append(BindAttendanceHospitalProductDetails(ds.Tables[30], userCode));
                        sbTbl.Append(BindAttendanceContactDetails(ds.Tables[31]));
                        sbTbl.Append(BindAttendanceHospitalCallActivityDetails(ds.Tables[32]));
                        sbTbl.Append(BindAttendanceCallActivityDetails(ds.Tables[27]));
                        sbTbl.Append(BindAttendanceMCActivityDetails(ds.Tables[28]));
                        sbTbl.Append(BindExpenseDetails(ds.Tables[8]));
                        var numb = ds.Tables[35].AsEnumerable().Where(z => Convert.ToString(z["Flag"]) == "A").Count();
                        if (numb > 0)
                        {
                            drExpense = ds.Tables[35].AsEnumerable().Where(z => Convert.ToString(z["Flag"]) == "A").CopyToDataTable();
                            sbTbl.Append(BindExpenseAttachmentDetails(drExpense));
                            sbTbl.Append("<div style='border-bottom: 5px solid #a52e09;margin-top: 10px;'></div>");
                        }
                        else
                        {
                            sbTbl.Append("<div style='border-bottom: 5px solid #a52e09;margin-top: 10px;'></div>");
                        }
                        #endregion Attendance
                    }
                    else
                    {
                        #region Leave
                        sbTbl.Append(BindLeaveDetails(ds.Tables[10], startDate));
                        #endregion Leave
                    }
                }
                else
                {
                    string DCRflag = string.Empty;
                    if (Reportflag == "DCRApproval")
                    {
                        if (flag_g == "A")
                        {
                            DCRflag = "A";
                            sbTbl.Append(BindDCRDeatils(ds.Tables[0], DCRflag, startDate, viewoption));
                            sbTbl.Append(BindHOPPlaces(ds.Tables[0], ds.Tables[1], DCRflag));
                            sbTbl.Append(BindAttendanceDetails(ds.Tables[9]));
                            sbTbl.Append(BindAttendanceDoctorDetails(ds.Tables[29]));
                            sbTbl.Append(BindAttendanceProductDetails(ds.Tables[26], userCode));
                            sbTbl.Append(BindAttendanceHospitalProductDetails(ds.Tables[30], userCode));
                            sbTbl.Append(BindAttendanceContactDetails(ds.Tables[31]));
                            sbTbl.Append(BindAttendanceHospitalCallActivityDetails(ds.Tables[32]));
                            sbTbl.Append(BindAttendanceCallActivityDetails(ds.Tables[27]));
                            sbTbl.Append(BindAttendanceMCActivityDetails(ds.Tables[28]));
                            AttenTable = ds.Tables[8].Copy();
                            //attfilter = AttenTable.Select("Flag<>'A'");
                            for (int i = 0; i < AttenTable.Rows.Count; i++)
                            {
                                if (AttenTable.Rows[i]["Flag"].ToString() == "F")
                                {
                                    AttenTable.Rows[i].Delete();
                                }
                            }
                            AttenTable.AcceptChanges();
                            sbTbl.Append(BindExpenseDetails(AttenTable));
                            var numb = ds.Tables[35].AsEnumerable().Where(z => Convert.ToString(z["Flag"]) == "A").Count();
                            if (numb > 0)
                            {
                                drExpense = ds.Tables[35].AsEnumerable().Where(z => Convert.ToString(z["Flag"]) == "A").CopyToDataTable();
                                sbTbl.Append(BindExpenseAttachmentDetails(drExpense));
                                sbTbl.Append("<div style='border-bottom: 5px solid #a52e09;margin-top: 10px;'></div>");
                            }
                            else
                            {
                                sbTbl.Append("<div style='border-bottom: 5px solid #a52e09;margin-top: 10px;'></div>");
                            }
                        }
                        else
                        {
                            DCRflag = "F";
                            drFiltered = ds.Tables[0].AsEnumerable().Where(z => Convert.ToString(z["Flag"]) == DCRflag).CopyToDataTable();
                            sbTbl.Append(BindDCRDeatils(ds.Tables[0], DCRflag, startDate, viewoption));
                            sbTbl.Append(BindAccompanistDetails(drFiltered, DCRflag));
                            sbTbl.Append(BindHOPPlaces(ds.Tables[0], ds.Tables[1], DCRflag));
                            //int count = ds.Tables[2].Rows.Count + ds.Tables[3].Rows.Count;
                            int count = ds.Tables[2].Rows.Count;
                            sbTbl.Append(BindOwnDoctorsVisit(ds.Tables[2], viewoption, count, userCode));
                            sbTbl.Append(BindDigitalsigndata(ds.Tables[34], DCRflag));
                            //sbTbl.Append(BindAccDoctorsVisit(ds.Tables[3], viewoption, ds.Tables[2].Rows.Count));
                            if (Company_Code != "COM00000146")
                            {
                                sbTbl.Append(BindDetailedDigitalAssets(ds.Tables[15]));
                            }
                            sbTbl.Append(BindDetaildProductDetails(ds.Tables[11]));
                            sbTbl.Append(BindProductDetails(ds.Tables[4]));
                            sbTbl.Append(BindChemistDetails(ds.Tables[5]));
                            sbTbl.Append(BindPOBDetails(ds.Tables[14]));
                            sbTbl.Append(BindCallActivity(ds.Tables[23]));
                            sbTbl.Append(BindMCActivity(ds.Tables[24]));
                            sbTbl.Append(BindRCPADetails(ds.Tables[6]));
                            sbTbl.Append(BindAttachments(ds.Tables[13]));
                            sbTbl.Append(BindFollowUps(ds.Tables[12]));
                            sbTbl.Append(BindCompetitorProductDetails(ds.Tables[25]));
                            // sbTbl.Append(BindExpenseDetails(ds.Tables[8]));
                            //////////////Chemist visit/////////////////////

                            DataControl.HiDoctor_ActivityFactoryClasses.DCR_V4.BL_DCRChemistVisit objDCRChemistVisit = new DataControl.HiDoctor_ActivityFactoryClasses.DCR_V4.BL_DCRChemistVisit();

                            string chemistPlv = objDCRChemistVisit.GetRegionModuleAccess(Region_Code, userCode, ds.Tables[0].Rows[0]["Flag"].ToString());
                            if (ds.Tables[0].Rows[0]["Flag"].ToString() == "F" || chemistPlv == "CHEMIST_DAY")
                            {
                                //  #region field and chemist visit privilege Enabled
                                sbTbl.Append(BindChemistVisitAccompanistDetails(ds.Tables[16]));
                                sbTbl.Append(BindChemistVisitContact(ds.Tables[33]));
                                sbTbl.Append(BindSamplePromotionProductDetails(ds.Tables[17]));
                                sbTbl.Append(BindChemistDetaildProductDetails(ds.Tables[18]));
                                sbTbl.Append(BindChemistVisitPOBDetails(ds.Tables[20]));
                                sbTbl.Append(BindChemistVisitRCPADetails(ds.Tables[19]));
                                sbTbl.Append(BindChemistVisitAttachments(ds.Tables[22]));
                                sbTbl.Append(BindChemistVisitFollowUps(ds.Tables[21]));

                            }
                            sbTbl.Append(BindStockiestDetails(ds.Tables[7]));
                            Table = ds.Tables[8].Copy();
                            //filter = Table.Select("Flag<>'F'");

                            for (int i = 0; i < Table.Rows.Count; i++)
                            {
                                if (Table.Rows[i]["Flag"].ToString() == "A")
                                {

                                    Table.Rows[i].Delete();

                                }
                            }

                            Table.AcceptChanges();
                            sbTbl.Append(BindExpenseDetails(Table));
                            var numb = ds.Tables[35].AsEnumerable().Where(z => Convert.ToString(z["Flag"]) == "F").Count();
                            if (numb > 0)
                            {
                                drExpense = ds.Tables[35].AsEnumerable().Where(z => Convert.ToString(z["Flag"]) == "F").CopyToDataTable();
                                sbTbl.Append(BindExpenseAttachmentDetails(drExpense));
                                sbTbl.Append("<div style='border-bottom: 5px solid #a52e09;margin-top: 10px;'></div>");
                            }
                            else
                            {
                                sbTbl.Append("<div style='border-bottom: 5px solid #a52e09;margin-top: 10px;'></div>");
                            }
                        }
                    }
                    else
                    {
                        DataRow[] drFilter;
                        drFilter = ds.Tables[0].Select("Flag ='F'");
                        //  string DCRflag = string.Empty;
                        if (drFilter.Length > 0)
                        {
                            DCRflag = "F";
                            drFiltered = ds.Tables[0].AsEnumerable().Where(z => Convert.ToString(z["Flag"]) == DCRflag).CopyToDataTable();
                            sbTbl.Append(BindDCRDeatils(ds.Tables[0], DCRflag, startDate, viewoption));
                            sbTbl.Append(BindAccompanistDetails(drFiltered, DCRflag));
                            sbTbl.Append(BindHOPPlaces(ds.Tables[0], ds.Tables[1], DCRflag));
                            //int count = ds.Tables[2].Rows.Count + ds.Tables[3].Rows.Count;
                            int count = ds.Tables[2].Rows.Count;
                            sbTbl.Append(BindOwnDoctorsVisit(ds.Tables[2], viewoption, count, userCode));
                            sbTbl.Append(BindDigitalsigndata(ds.Tables[34], DCRflag));
                            //sbTbl.Append(BindAccDoctorsVisit(ds.Tables[3], viewoption, ds.Tables[2].Rows.Count));
                            if (Company_Code != "COM00000146")
                            {
                                sbTbl.Append(BindDetailedDigitalAssets(ds.Tables[15]));
                            }
                            sbTbl.Append(BindDetaildProductDetails(ds.Tables[11]));
                            sbTbl.Append(BindProductDetails(ds.Tables[4]));
                            sbTbl.Append(BindChemistDetails(ds.Tables[5]));
                            sbTbl.Append(BindPOBDetails(ds.Tables[14]));
                            sbTbl.Append(BindCallActivity(ds.Tables[23]));
                            sbTbl.Append(BindMCActivity(ds.Tables[24]));
                            sbTbl.Append(BindRCPADetails(ds.Tables[6]));
                            sbTbl.Append(BindAttachments(ds.Tables[13]));
                            sbTbl.Append(BindFollowUps(ds.Tables[12]));
                            sbTbl.Append(BindCompetitorProductDetails(ds.Tables[25]));
                            // sbTbl.Append(BindExpenseDetails(ds.Tables[8]));
                            //////////////Chemist visit/////////////////////

                            DataControl.HiDoctor_ActivityFactoryClasses.DCR_V4.BL_DCRChemistVisit objDCRChemistVisit = new DataControl.HiDoctor_ActivityFactoryClasses.DCR_V4.BL_DCRChemistVisit();

                            string chemistPlv = objDCRChemistVisit.GetRegionModuleAccess(Region_Code, userCode, ds.Tables[0].Rows[0]["Flag"].ToString());
                            if (ds.Tables[0].Rows[0]["Flag"].ToString() == "F" || chemistPlv == "CHEMIST_DAY")
                            {
                                //  #region field and chemist visit privilege Enabled
                                sbTbl.Append(BindChemistVisitAccompanistDetails(ds.Tables[16]));
                                sbTbl.Append(BindChemistVisitContact(ds.Tables[33]));
                                sbTbl.Append(BindSamplePromotionProductDetails(ds.Tables[17]));
                                sbTbl.Append(BindChemistDetaildProductDetails(ds.Tables[18]));
                                sbTbl.Append(BindChemistVisitPOBDetails(ds.Tables[20]));
                                sbTbl.Append(BindChemistVisitRCPADetails(ds.Tables[19]));
                                sbTbl.Append(BindChemistVisitAttachments(ds.Tables[22]));
                                sbTbl.Append(BindChemistVisitFollowUps(ds.Tables[21]));

                            }
                            sbTbl.Append(BindStockiestDetails(ds.Tables[7]));
                            Table = ds.Tables[8].Copy();
                            //filter = Table.Select("Flag<>'F'");

                            for (int i = 0; i < Table.Rows.Count; i++)
                            {
                                if (Table.Rows[i]["Flag"].ToString() == "A")
                                {

                                    Table.Rows[i].Delete();

                                }
                            }

                            Table.AcceptChanges();
                            sbTbl.Append(BindExpenseDetails(Table));
                            var numb = ds.Tables[35].AsEnumerable().Where(z => Convert.ToString(z["Flag"]) == "F").Count();
                            if (numb > 0)
                            {
                                drExpense = ds.Tables[35].AsEnumerable().Where(z => Convert.ToString(z["Flag"]) == "F").CopyToDataTable();
                                sbTbl.Append(BindExpenseAttachmentDetails(drExpense));
                                sbTbl.Append("<div style='border-bottom: 5px solid #a52e09;margin-top: 10px;'></div>");
                            }
                            else
                            {
                                sbTbl.Append("<div style='border-bottom: 5px solid #a52e09;margin-top: 10px;'></div>");
                            }
                        }
                        drFilter = ds.Tables[0].Select("Flag ='A'");
                        if (drFilter.Length > 0)
                        {
                            DCRflag = "A";
                            sbTbl.Append(BindDCRDeatils(ds.Tables[0], DCRflag, startDate, viewoption));
                            sbTbl.Append(BindHOPPlaces(ds.Tables[0], ds.Tables[1], DCRflag));
                            sbTbl.Append(BindAttendanceDetails(ds.Tables[9]));
                            sbTbl.Append(BindAttendanceDoctorDetails(ds.Tables[29]));
                            sbTbl.Append(BindAttendanceProductDetails(ds.Tables[26], userCode));
                            sbTbl.Append(BindAttendanceHospitalProductDetails(ds.Tables[30], userCode));
                            sbTbl.Append(BindAttendanceContactDetails(ds.Tables[31]));
                            sbTbl.Append(BindAttendanceHospitalCallActivityDetails(ds.Tables[32]));
                            sbTbl.Append(BindAttendanceCallActivityDetails(ds.Tables[27]));
                            sbTbl.Append(BindAttendanceMCActivityDetails(ds.Tables[28]));
                            AttenTable = ds.Tables[8].Copy();
                            //attfilter = AttenTable.Select("Flag<>'A'");
                            for (int i = 0; i < AttenTable.Rows.Count; i++)
                            {
                                if (AttenTable.Rows[i]["Flag"].ToString() == "F")
                                {
                                    AttenTable.Rows[i].Delete();
                                }
                            }
                            AttenTable.AcceptChanges();
                            sbTbl.Append(BindExpenseDetails(AttenTable));
                            var numb = ds.Tables[35].AsEnumerable().Where(z => Convert.ToString(z["Flag"]) == "A").Count();
                            if (numb > 0)
                            {
                                drExpense = ds.Tables[35].AsEnumerable().Where(z => Convert.ToString(z["Flag"]) == "A").CopyToDataTable();
                                sbTbl.Append(BindExpenseAttachmentDetails(drExpense));
                            }
                            else
                            {
                                sbTbl.Append("<div style='border-bottom: 5px solid #a52e09;margin-top: 10px;'></div>");
                            }
                        }
                        drFilter = ds.Tables[0].Select("Flag ='L'");
                        if (drFilter.Length > 0)
                        {
                            sbTbl.Append(BindLeaveDetails(ds.Tables[10], startDate));
                        }
                    }
                }
            }
            else
            {
                sbTbl.Append("<div style='text-align: center;font-size: 16px;color: #4a89dc!important;font-weight: bold;'>No DCR Details Found");
                //sbTbl.Append("No DCR Details Found");
            }
            return sbTbl;
        }
        // HEADER DETAILS
        string sdate = "";
        private string BindDCRDeatils(DataTable dt, string dcrFlag, string startDate, string viewoption)
        {
            StringBuilder sbTbl = new StringBuilder();

            if (header == true)
            {
                sdate = startDate.Split('-')[2] + "/" + startDate.Split('-')[1] + "/" + startDate.Split('-')[0];
                sbTbl.Append("<div style='margin-left:25%;font-weight: bold;font-size: large;'class='dvheader-inner'>User Per Day Report of - " + dt.Rows[0]["Employee_Name"] + "(" + dt.Rows[0]["User_Name"] + ") for " + sdate + "</div>");
                header = false;
            }
            sbTbl.Append("</br>");
            sbTbl.Append("<div id='dvheader' class='gridHeader'>");
            sbTbl.Append("<h3 style='margin: 0px auto;background: grey;'>Header Details </h3>");
            sbTbl.Append("<span hidden id='UserName'></span>");
            sbTbl.Append("</div>");
            sbTbl.Append("<table id='dvheaderdetail' class='data display dataTable box'>");
            sbTbl.Append("<thead><tr>");
            sbTbl.Append("<th>Type of DCR</th>");
            sbTbl.Append("<th>Beat / Patch Name</th>");
            sbTbl.Append("<th>Work Category</th>");
            sbTbl.Append("<th>Place Worked</th>");
            sbTbl.Append("<th>Start Time</th>");
            sbTbl.Append("<th>End Time</th>");
            sbTbl.Append("<th>DCR Status</th>");
            sbTbl.Append("<th>DCR Common Remarks</th>");
            sbTbl.Append("<th>Approved / Un Approved By</th>");
            sbTbl.Append("<th>Approved / Un Approved Date</th>");
            sbTbl.Append("<th>Approval / Un Approval Reason</th>");
            sbTbl.Append("</tr></thead>");
            for (int j = 0; j < dt.Rows.Count; j++)
            {
                // Unapprove reason.
                string unapprovereason = dt.Rows[j]["Unapproval_Reason"].ToString();
                unapprovereason = unapprovereason.Replace("~^", " - N/A<br />");//.replace(/~\^/g, ' - N/A<br />');
                unapprovereason = unapprovereason.Replace("^", "<br />");//.replace(/\^/g, '<br />');
                unapprovereason = unapprovereason.Replace("~", " - ");//.replace(/~/g, ' - ');

                string commonRemarks = dt.Rows[j]["DCR_General_Remarks"].ToString();
                commonRemarks = commonRemarks.Replace("~^", " - N/A<br />");//.replace(/~\^/g, ' - N/A<br />');
                commonRemarks = commonRemarks.Replace("^", "<br />");//.replace(/\^/g, '<br />');
                commonRemarks = commonRemarks.Replace("~", " - ");//.replace(/~/g, ' - ');

                string dcrstatus = dt.Rows[j]["DCR_Status"].ToString();
                dcrstatus = ((dcrstatus == "1") ? "Applied" : ((dcrstatus == "2") ? "Approved" : ((dcrstatus == "0") ? "Unapproved" : "Drafted")));
                string dcrVersion = viewoption.ToUpper() == "S" ? dt.Rows[j]["Ref_Key1"].ToString() : "";
                string dcrentereddate = viewoption.ToUpper() == "S" ? dt.Rows[j]["DCR_Entered_Date"].ToString() : "";
                string tdEmployeeName = viewoption.ToUpper() == "S" ? dt.Rows[j]["Employee_Name"].ToString() : "";
                string tdDivisionName = viewoption.ToUpper() == "s" ? dt.Rows[j]["Division_Name"].ToString() : "";
                if ("F" == dcrFlag && "F" == dt.Rows[j]["Flag"].ToString())
                {
                    sbTbl.Append("<tr>");
                    sbTbl.Append("<td><span id='spnTypeofDCR'>Field</span><span id='spndcrversion' style='display:none'>" + dcrVersion + "</span></td>");
                    sbTbl.Append("<td><span id='spnCpName'>" + dt.Rows[j]["CP_Name"] + "</span></td>");
                    sbTbl.Append("<td><span id='spnCategory'>" + dt.Rows[j]["Category"] + "</span></td>");
                    sbTbl.Append("<td><span id='spnPlaceWorked'>" + dt.Rows[j]["Place_Worked"] + "</span></td>");
                    sbTbl.Append("<td><span id='spnStartTime'>" + dt.Rows[j]["User_Start_Time"] + "</span></td>");
                    sbTbl.Append("<td><span id='spnEndTime'>" + dt.Rows[j]["User_End_Time"] + "</span></td>");
                    sbTbl.Append("<td><span id='spnDCRStatus'>" + dcrstatus + "</span></td>");
                    sbTbl.Append("<td><span id='spnDCRStatus'>" + commonRemarks + "</span></td>");
                    sbTbl.Append("<td><span id='spnApprovedby'>" + dt.Rows[j]["Approved_By"] + "</span></td>");
                    sbTbl.Append("<td><span id='spnApproveddate'>" + dt.Rows[j]["ApprovedDate"] + "</span></td>");
                    sbTbl.Append("<td><span id='spnUnapprovalreason'>" + unapprovereason + "</span><span id='spndcrEnteredDate' style='display: none'> " + dcrentereddate + "</span><span id='spnEmpName' style='display: none'>" + tdEmployeeName + "</span>");
                    sbTbl.Append("<span id='lbnDivisionName' style='display: none'>" + dt.Rows[j]["Division_Name"] + "</span><span id='lbnEmpNumber' style='display: none'>" + dt.Rows[j]["Employee_Number"] + "</span><span id='lbndesignation' style='display: none'>" + dt.Rows[j]["User_Type_Name"] + "</span></td>");
                    sbTbl.Append("</tr>");
                }
                else if ("A" == dcrFlag && "A" == dt.Rows[j]["Flag"].ToString())
                {
                    sbTbl.Append("<tr>");
                    sbTbl.Append("<td><span id='spnTypeofDCR'>Attendance</span><span id='spndcrversion' style='display:none'>" + dcrVersion + "</span></td>");
                    sbTbl.Append("<td><span id='spnCpName'>N/A</span></td>");
                    sbTbl.Append("<td><span id='spnCategory'>" + dt.Rows[j]["Category"] + "</span></td>");
                    sbTbl.Append("<td><span id='spnPlaceWorked'>" + dt.Rows[j]["Place_Worked"] + "</span></td>");
                    sbTbl.Append("<td><span id='spnStartTime'>" + dt.Rows[j]["User_Start_Time"] + "</span></td>");
                    sbTbl.Append("<td><span id='spnEndTime'>" + dt.Rows[j]["User_End_Time"] + "</span></td>");
                    sbTbl.Append("<td><span id='spnDCRStatus'>" + dcrstatus + "</span></td>");
                    sbTbl.Append("<td><span id='spnDCRStatus'>" + commonRemarks + "</span></td>");
                    sbTbl.Append("<td><span id='spnApprovedby'>" + dt.Rows[j]["Approved_By"] + "</span></td>");
                    sbTbl.Append("<td><span id='spnApproveddate'>" + dt.Rows[j]["ApprovedDate"] + "</span></td>");
                    sbTbl.Append("<td><span id='spnUnapprovalreason'>" + unapprovereason + "</span><span id='spndcrEnteredDate' style='display: none'> " + dcrentereddate + "</span><span id='spnEmpName' style='display: none'>" + tdEmployeeName + "</span><span id='lbnDivisionName' style='display: none'>" + dt.Rows[j]["Division_Name"] + "</span></td>");
                    sbTbl.Append("</tr>");
                }
            }
            sbTbl.Append("</table>");
            sbTbl.Append("<div id='dcrSummary'></div>");
            sbTbl.Append("<div id='pobSummary'></div>");
            return sbTbl.ToString();
        }
        // SFC DEATILS
        private string BindHOPPlaces(DataTable dtHeader, DataTable dtHop, string flag)
        {
            StringBuilder sbTbl = new StringBuilder();
            sbTbl.Append("<div class='gridHeader'><h3 style='margin: 0px auto;background: grey;'>SFC Details</h3></div>");
            sbTbl.Append("<table id='tblHOP' class='data display dataTable box'><thead><th>Region Name</th><th>From Place</th><th>To Place</th><th>Travel Mode</th><th>Distance</th></thead>");
            sbTbl.Append("<tbody>");

            DataRow[] drHop;
            drHop = dtHop.Select("Flag='" + flag + "'");
            if (drHop != null && drHop.Length > 0)
            {
                foreach (DataRow dr in drHop)
                {
                    string region = (dr["Region_Name"] == System.DBNull.Value) ? "" : dr["Region_Name"].ToString();
                    string routeWay = (dr["Route_Way"] == System.DBNull.Value) ? "D" : dr["Route_Way"].ToString();

                    sbTbl.Append("<tr>");
                    sbTbl.Append("<td class='sfcFrom'>" + region + "</td>");
                    if (routeWay == "R")
                    {
                        sbTbl.Append("<td class='sfcFrom'>" + dr["To_Place"] + "</td>");
                        sbTbl.Append("<td class='sfcTo'>" + dr["From_Place"] + "</td>");
                    }
                    else
                    {
                        sbTbl.Append("<td class='sfcFrom'>" + dr["From_Place"] + "</td>");
                        sbTbl.Append("<td class='sfcTo'>" + dr["To_Place"] + "</td>");
                    }
                    sbTbl.Append("<td>" + dr["Travel_Mode"].ToString() + "</td>");
                    sbTbl.Append("<td>" + dr["Distance"].ToString() + "</td>");
                    sbTbl.Append("</tr>");
                }
            }
            else// for HQ
            {
                var drTravelPlace = dtHeader.AsEnumerable().Where(a => a["Flag"].ToString().Equals(flag)).FirstOrDefault();
                if (drTravelPlace != null)
                {
                    string routeWay = (drTravelPlace["Route_Way"] == System.DBNull.Value) ? "D" : drTravelPlace["Route_Way"].ToString();
                    string SFCregion = (drTravelPlace["SFC_Region"] == System.DBNull.Value) ? "" : drTravelPlace["SFC_Region"].ToString();
                    sbTbl.Append("<tr>");
                    sbTbl.Append("<td class='sfcFrom'>" + SFCregion + "</td>");
                    if (routeWay == "R")
                    {
                        sbTbl.Append("<td class='sfcFrom'>" + drTravelPlace["To_Place"] + "</td>");
                        sbTbl.Append("<td class='sfcTo'>" + drTravelPlace["From_Place"] + "</td>");
                    }
                    else
                    {
                        sbTbl.Append("<td class='sfcFrom'>" + drTravelPlace["From_Place"] + "</td>");
                        sbTbl.Append("<td class='sfcTo'>" + drTravelPlace["To_Place"] + "</td>");
                    }
                    sbTbl.Append("<td>" + drTravelPlace["Travel_Mode"].ToString() + "</td>");
                    sbTbl.Append("<td>" + drTravelPlace["Travelled_Kms"].ToString() + "</td>");
                    sbTbl.Append("</tr>");
                }

            }

            sbTbl.Append("</tbody></table>");

            return sbTbl.ToString();
        }
        // ACCOMPANIST DETAILS
        private string BindAccompanistDetails(DataTable dt, string flag)
        {
            StringBuilder sbTbl = new StringBuilder();
            if (dt.Rows[0]["Person_Type_Code"].ToString() != "" || dt.Rows[0]["Acc1_Only_For_Doctor"].ToString() != "" || dt.Rows[0]["Acc2_Type_Code"].ToString() != "" || dt.Rows[0]["Acc2_Only_For_Doctor"].ToString() != "" || dt.Rows[0]["Acc_3_Person"].ToString() != "" || dt.Rows[0]["Acc3_Only_For_Doctor"].ToString() != "" || dt.Rows[0]["Acc_4_Person"].ToString() != "" || dt.Rows[0]["Acc4_Only_For_Doctor"].ToString() != "")
            {
                sbTbl.Append("<div id='dvaccom'>");
                sbTbl.Append("<div class='gridHeader' id='dvAcc'>");
                sbTbl.Append("<h3 style='margin: 0px auto;background: grey;'>Accompanist Visit Details</h3>");
                sbTbl.Append("</div>");
                sbTbl.Append("<table id='tblAcc' class='data display dataTable box'>");
                sbTbl.Append("<thead><tr>");
                sbTbl.Append("<th>Region Name</th>");
                sbTbl.Append("<th>Accompanist Name</th>");
                sbTbl.Append("<th>Independent call</th>");
                sbTbl.Append("<th>Start Time</th>");
                sbTbl.Append("<th>End Time</th>");
                //sbTbl.Append("<th>Digital Signature</th>");
                sbTbl.Append("</tr></thead>");
                sbTbl.Append("<tbody>");

                if (dt.Rows[0]["Person_Type_Code"].ToString() != "" || dt.Rows[0]["Acc1_Only_For_Doctor"].ToString() != "")
                {
                    sbTbl.Append("<tr id='accRow1'>");
                    if (dt.Rows[0]["Acc1_Only_For_Doctor"].ToString() != "" && dt.Rows[0]["Acc1_region_Code"].ToString() == "")
                    {
                        sbTbl.Append("<td><span>" + dt.Rows[0]["Acc1_Only_For_Doctor"] + "</span></td>");
                        sbTbl.Append("<td><span id='spnFirstAccPersonName'>" + dt.Rows[0]["Person_Code"] + "</span></td>");
                        sbTbl.Append("<td><span> Yes </span></td>");
                    }
                    else if (dt.Rows[0]["Acc1_Only_For_Doctor"].ToString() != "" && dt.Rows[0]["Acc1_region_Code"].ToString() != "")
                    {
                        sbTbl.Append("<td><span>" + dt.Rows[0]["Acc1_Only_For_Doctor"] + "</span></td>");
                        sbTbl.Append("<td><span id='spnFirstAccPersonName'>" + dt.Rows[0]["Person_Code"] + "</span></td>");
                        sbTbl.Append("<td><span> No </span></td>");
                    }
                    else if (dt.Rows[0]["Acc1_region_Code"].ToString() != "")
                    {
                        sbTbl.Append("<td><span>" + dt.Rows[0]["Acc1_region_Code"] + "</span></td>");
                        sbTbl.Append("<td><span class='hyperlink' id='spnFirstAccPersonName' onclick=fnShowAccDoctor(this,'" + dt.Rows[0]["DCR_Code"] + "')>" + dt.Rows[0]["Person_Code"] + "</span></td>");
                        sbTbl.Append("<td><span> No </span></td>");
                    }
                    // sbTbl.Append("<td><span>" + dt.Rows[0]["Region_Name"] + "</span></td>");

                    sbTbl.Append("<td><span id='spnFirstAccStartTime'>" + dt.Rows[0]["Accomp_Start_Time"] + "</span></td>");
                    sbTbl.Append("<td><span id='spnFirstAccEndTime'>" + dt.Rows[0]["Accomp_End_Time"] + "</span></td>");
                    //sbTbl.Append("<td><span id='spnFirstbloburl'><a href =" + dt.Rows[0]["Blob_url"] + ">Uploaded_File_Name</a></span></td>");
                    //Added for showing DCR Type
                    sbTbl.Append("<input type='hidden' id='hdnFlag' value='" + flag + "'></input>");
                    sbTbl.Append("</tr>");
                }
                else
                {
                    sbTbl.Append("<tr id='accRow1' style='display:none;'>");
                    if (dt.Rows[0]["Acc1_Only_For_Doctor"].ToString() != "")
                    {
                        sbTbl.Append("<td><span>" + dt.Rows[0]["Acc1_Only_For_Doctor"] + "</span></td>");
                        sbTbl.Append("<td><span id='spnFirstAccPersonName')>N/A</span></td>");
                        sbTbl.Append("<td><span> No </span></td>");
                    }
                    else if (dt.Rows[0]["Acc1_region_Code"].ToString() != "")
                    {
                        sbTbl.Append("<td><span>" + dt.Rows[0]["Acc1_region_Code"] + "</span></td>");
                        sbTbl.Append("<td><span class='hyperlink' id='spnFirstAccPersonName' onclick=fnShowAccDoctor(this,'" + dt.Rows[0]["DCR_Code"] + "')>N/A</span></td>");
                        sbTbl.Append("<td><span> Yes </span></td>");
                    }


                    sbTbl.Append("<td><span id='spnFirstAccStartTime'>N/A</span></td>");
                    sbTbl.Append("<td><span id='spnFirstAccEndTime'>N/A</span></td>");
                    //Added for showing DCR Type
                    sbTbl.Append("<input type='hidden' id='hdnFlag' value='" + flag + "'></input>");
                    sbTbl.Append("</tr>");
                }

                if (dt.Rows[0]["Acc2_Type_Code"].ToString() != "" || dt.Rows[0]["Acc2_Only_For_Doctor"].ToString() != "")
                {
                    sbTbl.Append("<tr id='accRow2'>");
                    if (dt.Rows[0]["Acc2_Only_For_Doctor"].ToString() != "" && dt.Rows[0]["Acc2_region_Code"].ToString() == "")
                    {
                        sbTbl.Append("<td><span>" + dt.Rows[0]["Acc2_Only_For_Doctor"] + "</span></td>");
                        sbTbl.Append("<td><span id='spnSecAccPersonName'>" + dt.Rows[0]["Acc2_User_Code"] + "</span></td>");
                        sbTbl.Append("<td><span> Yes </span></td>");
                    }
                    else if (dt.Rows[0]["Acc2_Only_For_Doctor"].ToString() != "" && dt.Rows[0]["Acc2_region_Code"].ToString() != "")
                    {
                        sbTbl.Append("<td><span>" + dt.Rows[0]["Acc2_Only_For_Doctor"] + "</span></td>");
                        sbTbl.Append("<td><span id='spnSecAccPersonName'>" + dt.Rows[0]["Acc2_User_Code"] + "</span></td>");
                        sbTbl.Append("<td><span> No </span></td>");
                    }
                    else if (dt.Rows[0]["Acc2_region_Code"].ToString() != "")
                    {
                        sbTbl.Append("<td><span>" + dt.Rows[0]["Acc2_region_Code"] + "</span></td>");
                        sbTbl.Append("<td><span class='hyperlink' id='spnSecAccPersonName' onclick=fnShowAccDoctor(this,'" + dt.Rows[0]["DCR_Code"] + "')>" + dt.Rows[0]["Acc2_User_Code"] + "</span></td>");
                        sbTbl.Append("<td><span> No </span></td>");
                    }

                    if (!string.IsNullOrEmpty(dt.Rows[0]["Acc2_Start_Time"].ToString()))
                    {
                        sbTbl.Append("<td><span id='spnSecondAccStartTime'>" + dt.Rows[0]["Acc2_Start_Time"] + "</span></td>");
                    }
                    else
                    {
                        sbTbl.Append("<td><span id='spnSecondAccStartTime'></span></td>");
                    }
                    if (!string.IsNullOrEmpty(dt.Rows[0]["Acc2_Start_Time"].ToString()))
                    {
                        sbTbl.Append("<td><span id='spnSecondAccEndTime'>" + dt.Rows[0]["Acc2_End_Time"] + "</span></td>");
                    }
                    else
                    {
                        sbTbl.Append("<td><span id='spnSecondAccEndTime'></span></td>");
                    }
                    //Added for showing DCR Type
                    sbTbl.Append("<input type='hidden' id='hdnFlag' value='" + flag + "'></input>");
                    sbTbl.Append("</tr>");
                }

                else
                {
                    sbTbl.Append("<tr id='accRow2' style='display:none;'>");
                    if (dt.Rows[0]["Acc2_Only_For_Doctor"].ToString() != "")
                    {
                        sbTbl.Append("<td><span>" + dt.Rows[0]["Acc2_Only_For_Doctor"] + "</span></td>");
                        sbTbl.Append("<td><span  id='spnSecAccPersonName'>N/A</span></td>");
                        sbTbl.Append("<td><span> No </span></td>");
                    }
                    else if (dt.Rows[0]["Acc2_region_Code"].ToString() != " ")
                    {
                        sbTbl.Append("<td><span>" + dt.Rows[0]["Acc2_region_Code"] + "</span></td>");
                        sbTbl.Append("<td><span class='hyperlink' id='spnSecAccPersonName' onclick=fnShowAccDoctor(this,'" + dt.Rows[0]["DCR_Code"] + "')>N/A</span></td>");
                        sbTbl.Append("<td><span> Yes </span></td>");
                    }

                    sbTbl.Append("<td><span id='spnSecondAccStartTime'></span></td>");
                    sbTbl.Append("<td><span id='spnSecondAccEndTime'></span></td>");
                    //Added for showing DCR Type
                    sbTbl.Append("<input type='hidden' id='hdnFlag' value='" + flag + "'></input>");
                    sbTbl.Append("</tr>");
                }

                if (dt.Rows[0]["Acc_3_Person"].ToString() != "" || dt.Rows[0]["Acc3_Only_For_Doctor"].ToString() != "")
                {

                    sbTbl.Append("<tr id='accRow3'>");
                    if (dt.Rows[0]["Acc3_Only_For_Doctor"].ToString() != "" && dt.Rows[0]["Acc3_region_Code"].ToString() == "")
                    {
                        sbTbl.Append("<td><span>" + dt.Rows[0]["Acc3_Only_For_Doctor"] + "</span></td>");
                        sbTbl.Append("<td><span id='spnThirdAccPersonName'>" + dt.Rows[0]["Acc_3_Person"] + "</span></td>");
                        sbTbl.Append("<td><span> Yes </span></td>");
                    }
                    else if (dt.Rows[0]["Acc3_Only_For_Doctor"].ToString() != "" && dt.Rows[0]["Acc3_region_Code"].ToString() != "")
                    {
                        sbTbl.Append("<td><span>" + dt.Rows[0]["Acc3_Only_For_Doctor"] + "</span></td>");
                        sbTbl.Append("<td><span id='spnThirdAccPersonName'>" + dt.Rows[0]["Acc_3_Person"] + "</span></td>");
                        sbTbl.Append("<td><span> No </span></td>");
                    }
                    else if (dt.Rows[0]["Acc3_region_Code"].ToString() != "")
                    {
                        sbTbl.Append("<td><span>" + dt.Rows[0]["Acc3_region_Code"] + "</span></td>");
                        sbTbl.Append("<td><span class='hyperlink' id='spnThirdAccPersonName' onclick=fnShowAccDoctor(this,'" + dt.Rows[0]["DCR_Code"] + "')>" + dt.Rows[0]["Acc_3_Person"] + "</span></td>");
                        sbTbl.Append("<td><span> No </span></td>");
                    }

                    if (!string.IsNullOrEmpty(dt.Rows[0]["Acc_3_Time"].ToString()))
                    {
                        sbTbl.Append("<td><span id='spnThirdAccPersonStartTime'>" + dt.Rows[0]["Acc_3_Time"].ToString().Split('_')[0] + "</span></td>");
                        sbTbl.Append("<td><span id='spnThirdAccPersonEndTime'>" + dt.Rows[0]["Acc_3_Time"].ToString().Split('_')[1] + "</span></td>");
                    }
                    else
                    {
                        sbTbl.Append("<td><span id='spnThirdAccPersonStartTime'></span></td>");
                        sbTbl.Append("<td><span id='spnThirdAccPersonEndTime'></span></td>");
                    }
                    //Added for showing DCR Type
                    sbTbl.Append("<input type='hidden' id='hdnFlag' value='" + flag + "'></input>");
                    sbTbl.Append("</tr>");
                }

                else
                {
                    sbTbl.Append("<tr id='accRow3' style='display:none;'>");
                    if (dt.Rows[0]["Acc3_Only_For_Doctor"].ToString() != "")
                    {
                        sbTbl.Append("<td><span>" + dt.Rows[0]["Acc3_Only_For_Doctor"] + "</span></td>");
                        sbTbl.Append("<td><span id='spnThirdAccPersonName'>N/A</span></td>");
                        sbTbl.Append("<td><span> No </span></td>");
                    }
                    else if (dt.Rows[0]["Acc3_region_Code"].ToString() != "")
                    {
                        sbTbl.Append("<td><span>" + dt.Rows[0]["Acc3_region_Code"] + "</span></td>");
                        sbTbl.Append("<td><span class='hyperlink' id='spnThirdAccPersonName' onclick=fnShowAccDoctor(this,'" + dt.Rows[0]["DCR_Code"] + "')>N/A</span></td>");
                        sbTbl.Append("<td><span> Yes </span></td>");
                    }

                    sbTbl.Append("<td><span id='spnThirdAccPersonStartTime'></span></td>");
                    sbTbl.Append("<td><span id='spnThirdAccPersonEndTime'></span></td>");
                    //Added for showing DCR Type
                    sbTbl.Append("<input type='hidden' id='hdnFlag' value='" + flag + "'></input>");
                    sbTbl.Append("</tr>");
                }

                if (dt.Rows[0]["Acc_4_Person"].ToString() != "" || dt.Rows[0]["Acc4_Only_For_Doctor"].ToString() != "")
                {
                    sbTbl.Append("<tr id='accRow4'>");
                    if (dt.Rows[0]["Acc4_Only_For_Doctor"].ToString() != "" && dt.Rows[0]["Acc4_region_Code"].ToString() == "")
                    {
                        sbTbl.Append("<td><span>" + dt.Rows[0]["Acc4_Only_For_Doctor"] + "</span></td>");
                        sbTbl.Append("<td><span id='spnFourthAccPersonName'>" + dt.Rows[0]["Acc_4_Person"] + "</span></td>");
                        sbTbl.Append("<td><span> Yes </span></td>");
                    }

                    else if (dt.Rows[0]["Acc4_Only_For_Doctor"].ToString() != "" && dt.Rows[0]["Acc4_region_Code"].ToString() != "")
                    {
                        sbTbl.Append("<td><span>" + dt.Rows[0]["Acc4_Only_For_Doctor"] + "</span></td>");
                        sbTbl.Append("<td><span id='spnFourthAccPersonName'>" + dt.Rows[0]["Acc_4_Person"] + "</span></td>");
                        sbTbl.Append("<td><span> No </span></td>");
                    }
                    else if (dt.Rows[0]["Acc4_region_Code"].ToString() != "")
                    {
                        sbTbl.Append("<td><span>" + dt.Rows[0]["Acc4_region_Code"] + "</span></td>");
                        sbTbl.Append("<td><span class='hyperlink' id='spnFourthAccPersonName' onclick=fnShowAccDoctor(this,'" + dt.Rows[0]["DCR_Code"] + "')>" + dt.Rows[0]["Acc_4_Person"] + "</span></td>");
                        sbTbl.Append("<td><span> No </span></td>");
                    }

                    if (!string.IsNullOrEmpty(dt.Rows[0]["Acc_4_Time"].ToString()))
                    {
                        sbTbl.Append("<td><span id='spnFourthAccPersonStartTime'>" + dt.Rows[0]["Acc_4_Time"].ToString().Split('_')[0] + "</span></td>");
                        sbTbl.Append("<td><span id='spnFourthAccPersonEndTime'>" + dt.Rows[0]["Acc_4_Time"].ToString().Split('_')[0] + "</span></td>");
                    }
                    else
                    {
                        sbTbl.Append("<td><span id='spnFourthAccPersonStartTime'></span></td>");
                        sbTbl.Append("<td><span id='spnFourthAccPersonEndTime'></span></td>");
                    }
                    //Added for showing DCR Type
                    sbTbl.Append("<input type='hidden' id='hdnFlag' value='" + flag + "'></input>");
                    sbTbl.Append("</tr></tbody></table>");
                    sbTbl.Append("</div>");
                }

                else
                {
                    sbTbl.Append("<tr id='accRow4' style='display:none;'>");
                    if (dt.Rows[0]["Acc4_Only_For_Doctor"].ToString() != "")
                    {
                        sbTbl.Append("<td><span>" + dt.Rows[0]["Acc4_Only_For_Doctor"] + "</span></td>");
                        sbTbl.Append("<td><span  id='spnFourthAccPersonName'>N/A</span></td>");
                        sbTbl.Append("<td><span> No </span></td>");
                    }
                    else if (dt.Rows[0]["Acc4_region_Code"].ToString() != "")
                    {
                        sbTbl.Append("<td><span>" + dt.Rows[0]["Acc4_region_Code"] + "</span></td>");
                        sbTbl.Append("<td><span class='hyperlink' id='spnFourthAccPersonName' onclick=onclick=fnShowAccDoctor(this,'" + dt.Rows[0]["DCR_Code"] + "')>N/A</span></td>");
                        sbTbl.Append("<td><span> Yes </span></td>");
                    }

                    sbTbl.Append("<td><span id='spnFourthAccPersonStartTime'></span></td>");
                    sbTbl.Append("<td><span id='spnFourthAccPersonEndTime'></span></td>");
                    //Added for showing DCR Type
                    sbTbl.Append("<input type='hidden' id='hdnFlag' value='" + flag + "'></input>");
                    sbTbl.Append("</tr></tbody></table>");
                    sbTbl.Append("</div>");
                }

            }

            return sbTbl.ToString();
        }


        // EXPENSE
        private string BindExpenseDetails(DataTable dt)
        {
            StringBuilder sbTbl = new StringBuilder();
            if (dt != null && dt.Rows.Count > 0)
            {
                sbTbl.Append("<div class='gridHeader'><h3 style='margin: 0px auto;background: grey;'>Expense Details</h3></div>");
                sbTbl.Append("<table id='tblExpenseSummary' class='data display dataTable box'><thead><th>Expense Name</th><th>Amount</th><th>Remarks</th></thead>");
                sbTbl.Append("<tbody>");
                foreach (DataRow dr in dt.Rows)
                {
                    sbTbl.Append("<tr>");
                    sbTbl.Append("<td>" + dr["Expense_Type_Name"] + "</td>");
                    sbTbl.Append("<td>" + dr["Expense_Amount"] + "</td>");
                    sbTbl.Append("<td>" + dr["Expense_Remarks"] + "</td>");
                    sbTbl.Append("</tr>");
                }
                sbTbl.Append("</tbody></table>");
            }

            return sbTbl.ToString();

        }
        private string BindExpenseAttachmentDetails(DataTable dt)
        {
            StringBuilder sbTbl = new StringBuilder();
            if (dt != null && dt.Rows.Count > 0)
            {
                sbTbl.Append("<div class='gridHeader'><h3 style='margin: 0px auto;background: grey;'>Expense Attachment Details</h3></div>");
                sbTbl.Append("<table id='tblExpenseSummary' class='data display dataTable box'><thead><th>File Name</th></thead>");
                sbTbl.Append("<tbody>");
                foreach (DataRow dr in dt.Rows)
                {
                    sbTbl.Append("<tr>");

                    sbTbl.Append("<td><a class='attlink' onclick=fnshowattachments(\"" + dr["Blob_Url"] + "\") style='cursor: pointer;'>" + dr["Uploaded_File_Name"] + "</a></td>");
                    sbTbl.Append("</tr>");
                }
                sbTbl.Append("</tbody></table>");
            }
            //  sbTbl.Append("<div style='border-bottom: 5px solid #a52e09;margin-top: 10px;'></div>");
            return sbTbl.ToString();

        }

        //ATTENDANCE
        private string BindAttendanceDetails(DataTable dt)
        {
            StringBuilder sbTbl = new StringBuilder();
            if (dt != null && dt.Rows.Count > 0)
            {
                sbTbl.Append("<div class='gridHeader'><h3 style='margin: 0px auto;background: grey;'>Activity Details</h3></div>");
                sbTbl.Append("<table id='tblAttendance' class='data display dataTable box'><thead><th>Activity</th><th>Start Time</th><th>End Time</th><th>Remarks</th><th>Additional Info</th></thead>");
                sbTbl.Append("<tbody>");
                foreach (DataRow dr in dt.Rows)
                {
                    sbTbl.Append("<tr>");
                    //sbTbl.Append("<td>" + dr["Project_Name"] + "</td>");
                    sbTbl.Append("<td>" + dr["Activity_Name"] + "</td>");
                    sbTbl.Append("<td>" + dr["startTime"] + "</td>");
                    sbTbl.Append("<td>" + dr["EndTime"] + "</td>");
                    sbTbl.Append("<td>" + dr["Remarks"] + "</td>");
                    if (dr["Header_Id"].ToString() != null && (dr["status"].ToString() != null && dr["status"].ToString() != ""))
                    {
                        sbTbl.Append("<td><a href='#' style='color:blue' onclick='fnshowDRReport("+ dr["Header_Id"].ToString() + ");'>Click here</a></td>");
                    }
                    else
                    {
                        sbTbl.Append("<td></td>");
                    }
                    sbTbl.Append("</tr>");
                }
                sbTbl.Append("</tbody></table>");
            }
            return sbTbl.ToString();
        }
        private string BindAttendanceCallActivityDetails(DataTable dt)
        {
            StringBuilder sbTbl = new StringBuilder();
            if (dt != null && dt.Rows.Count > 0)
            {
                sbTbl.Append("<div class='gridHeader'><h3 style='margin: 0px auto;background: grey;'>Call Activity Details</h3></div>");
                sbTbl.Append("<table id='tblAttendancecallact' class='data display dataTable box'><thead><th>" + DOCTOR_CAPTION + " Region</th><th>" + DOCTOR_CAPTION + "</th><th>Call Activity</th><th>Activity Remarks</th></thead>");
                sbTbl.Append("<tbody>");
                foreach (DataRow dr in dt.Rows)
                {
                    sbTbl.Append("<tr>");
                    //sbTbl.Append("<td>" + dr["Project_Name"] + "</td>");
                    sbTbl.Append("<td>" + dr["Doctor_Region_Name"] + "</td>");
                    sbTbl.Append("<td>" + dr["Doctor_Name"] + "</td>");
                    sbTbl.Append("<td>" + dr["Activity_Name"] + "</td>");
                    sbTbl.Append("<td>" + dr["Activity_Remarks"] + "</td>");
                    sbTbl.Append("</tr>");
                }
                sbTbl.Append("</tbody></table>");
            }
            return sbTbl.ToString();
        }
        private string BindAttendanceHospitalCallActivityDetails(DataTable dt)
        {
            StringBuilder sbTbl = new StringBuilder();
            if (dt != null && dt.Rows.Count > 0)
            {
                sbTbl.Append("<div class='gridHeader'><h3 style='margin: 0px auto;background: grey;'>Hospital Call Activity Details</h3></div>");
                sbTbl.Append("<table id='tblAttendancecallact' class='data display dataTable box'><thead><th>Hospital Region</th><th>Hospital Name</th><th>Call Activity</th><th>Activity Remarks</th></thead>");
                sbTbl.Append("<tbody>");
                foreach (DataRow dr in dt.Rows)
                {
                    sbTbl.Append("<tr>");
                    //sbTbl.Append("<td>" + dr["Project_Name"] + "</td>");
                    sbTbl.Append("<td>" + dr["Region_Name"] + "</td>");
                    sbTbl.Append("<td>" + dr["Hospital_Name"] + "</td>");
                    sbTbl.Append("<td>" + dr["Activity_Name"] + "</td>");
                    sbTbl.Append("<td>" + dr["Activity_Remarks"] + "</td>");
                    sbTbl.Append("</tr>");
                }
                sbTbl.Append("</tbody></table>");
            }
            return sbTbl.ToString();
        }
        private string BindAttendanceContactDetails(DataTable dt)
        {
            StringBuilder sbTbl = new StringBuilder();
            if (dt != null && dt.Rows.Count > 0)
            {
                sbTbl.Append("<div class='gridHeader'><h3 style='margin: 0px auto;background: grey;'>Hospital Contact Details</h3></div>");
                sbTbl.Append("<table id='tblAttendancecallact' class='data display dataTable box'><thead><th>Hospital Name</th><th>Contact Name</th><th>Mobile</th><th>Email</th></thead>");
                sbTbl.Append("<tbody>");
                foreach (DataRow dr in dt.Rows)
                {
                    sbTbl.Append("<tr>");
                    //sbTbl.Append("<td>" + dr["Project_Name"] + "</td>");
                    //  sbTbl.Append("<td>" + dr["Region_Name"] + "</td>");
                    sbTbl.Append("<td>" + dr["Hospital_Name"] + "</td>");
                    sbTbl.Append("<td>" + dr["Contact_Name"] + "</td>");
                    sbTbl.Append("<td>" + dr["Mobile_Number"] + "</td>");
                    sbTbl.Append("<td>" + dr["Email_Id"] + "</td>");
                    sbTbl.Append("</tr>");
                }
                sbTbl.Append("</tbody></table>");
            }
            return sbTbl.ToString();
        }

        private string BindAttendanceMCActivityDetails(DataTable dt)
        {
            StringBuilder sbTbl = new StringBuilder();
            if (dt != null && dt.Rows.Count > 0)
            {
                sbTbl.Append("<div class='gridHeader'><h3 style='margin: 0px auto;background: grey;'>MC/CME Activity Details</h3></div>");
                sbTbl.Append("<table id='tblAttendancecallact' class='data display dataTable box'><thead><th>" + DOCTOR_CAPTION + " Region</th><th>" + DOCTOR_CAPTION + "</th><th>Campaign Name</th><th>MC Activity</th><th>Activity Remarks</th></thead>");
                sbTbl.Append("<tbody>");
                foreach (DataRow dr in dt.Rows)
                {
                    sbTbl.Append("<tr>");
                    //sbTbl.Append("<td>" + dr["Project_Name"] + "</td>");
                    sbTbl.Append("<td>" + dr["Doctor_Region_Name"] + "</td>");
                    sbTbl.Append("<td>" + dr["Doctor_Name"] + "</td>");
                    if (dr["Campaign_Type"].ToString() == "CME")
                    {
                        sbTbl.Append("<td><a class='link' onclick=fngetCMEProductDetails('" + dr["DCR_Code"] + "','" + dr["DCR_Attendance_Doctor_Id"] + "','" + dr["Campaign_Code"] + "')>" + dr["Campaign_Name"] + "</td>");
                    }
                    else
                    {
                        sbTbl.Append("<td>" + dr["Campaign_Name"] + "</td>");
                    }
                    sbTbl.Append("<td>" + dr["Activity_Name"] + "</td>");
                    sbTbl.Append("<td>" + dr["MC_Remark"] + "</td>");
                    sbTbl.Append("</tr>");
                }
                sbTbl.Append("</tbody></table>");
            }
            return sbTbl.ToString();
        }
        private string BindAttendanceDoctorDetails(DataTable dt)
        {
            StringBuilder sbTbl = new StringBuilder();
            if (dt != null && dt.Rows.Count > 0)
            {
                sbTbl.Append("<div class='gridHeader'><h3 style='margin: 0px auto;background: grey;'>Doctor Visit Details</h3></div>");
                sbTbl.Append("<table id='tblAttendancecallact' class='data display dataTable box'><thead><th>" + DOCTOR_CAPTION + " Region</th><th>" + DOCTOR_CAPTION + "</th><th>MDL/SVL#</th><th>Category</th><th>Speciality</th><th>Visit Mode/Time</th><th>Campaign Name</th><th>Call Objective</th><th>Business Status</th><th>Remarks</th></thead>");
                sbTbl.Append("<tbody>");
                foreach (DataRow dr in dt.Rows)
                {
                    string visitMode = (dr["Visit_Mode"] == System.DBNull.Value) ? "" : dr["Visit_Mode"].ToString();
                    string visitTime = (dr["Visit_Time"] == System.DBNull.Value) ? "" : dr["Visit_Time"].ToString().ToUpper();
                    if (visitTime.Length > 0)
                    {
                        if (visitMode.Length > 0)
                        {
                            if (!(visitTime.Contains("AM")) && !(visitTime.Contains("PM")))
                            {
                                visitTime = visitTime + " " + visitMode;
                            }

                        }
                        else
                        {
                            if (!(visitTime.Contains("AM")))
                            {
                                visitTime = visitTime + " AM";
                            }

                        }
                    }
                    string timemode = visitTime.Length > 0 ? visitTime : (visitMode.Length > 0 ? visitMode : "AM");
                    sbTbl.Append("<tr>");
                    //sbTbl.Append("<td>" + dr["Project_Name"] + "</td>");
                    sbTbl.Append("<td>" + dr["Doctor_Region_Name"] + "</td>");
                    sbTbl.Append("<td>" + dr["Doctor_Name"] + "</td>");

                    sbTbl.Append("<td>" + dr["MDL_Number"] + "</td>");
                    sbTbl.Append("<td>" + dr["Category_Name"] + "</td>");
                    sbTbl.Append("<td>" + dr["Speciality_Name"] + "</td>");
                    sbTbl.Append("<td>" + timemode + "</td>");
                    sbTbl.Append("<td>" + dr["Campaign_Name"] + "</td>");
                    sbTbl.Append("<td>" + dr["Call_Objective_Name"] + "</td>");
                    sbTbl.Append("<td>" + dr["Status_Name"] + "</td>");
                    sbTbl.Append("<td>" + dr["Remarks_By_User"] + "</td>");
                    sbTbl.Append("</tr>");
                }
                sbTbl.Append("</tbody></table>");
            }
            return sbTbl.ToString();
        }
        //Own Doctor Visit Details
        private string BindOwnDoctorsVisit(DataTable dt, string viewoption, int count, string userCode)
        {
            var drCountlist = 0;
            //int result = 0;
            string result = string.Empty;
            StringBuilder sbTabl = new StringBuilder();
            var objPathProv = new DataControl.Impl.FileSystemProvider();
            string ApiaccKey = "https://surveydev-api.hidoctor.me/";
            string accKey = objPathProv.GetConfigValue("SurveyURL");
            if (dt != null && dt.Rows.Count > 0)
            {
                drCountlist = dt.Rows.Count;
                sbTabl.Append("<div class='gridHeader'><h3 style='margin: 0px auto'>" + DOCTOR_CAPTION + " Visited Details</h3> <h4 id='drCount' style='float:right'> Total " + DOCTOR_CAPTION + "  Met Count : <td> " + count + " </td> </h4> </div>");
                sbTabl.Append("<table id='tblOwnDoctor' style='width:100%' class='data display dataTable box'><thead><th>" + DOCTOR_CAPTION + " Region</th><th>" + DOCTOR_CAPTION + " Name</th><th>MDL/SVL#</th><th>Category</th><th>Specialty</th><th>Visit Mode/Time</th><th>Accompanist Details</th><th>POB Amount</th>");
                DAL_DoctorVisit objDocVisit = new DAL_DoctorVisit();
                CurrentInfo objCurrentinfo = new CurrentInfo();
                sbTabl.Append("<th>Campaign Name</th>");
                sbTabl.Append("<th>Business Status</th>");
                sbTabl.Append("<th>Call Objective</th>");
                sbTabl.Append("<th>Remarks</th>");
                sbTabl.Append("<th>Survey</th>");
                sbTabl.Append("</thead>");
                sbTabl.Append("<tbody>");
                if (dt != null && dt.Rows.Count > 0)
                {
                    string type = "own";
                    int i = 1;
                    var id = 1;
                    foreach (DataRow dr in dt.Rows)
                    {
                        string docCode = dr["Doctor_Code"].ToString();
                        string doctorName = (dr["Doctor_Name"] == System.DBNull.Value) ? "" : dr["Doctor_Name"].ToString();
                        // string surName = (dr["Sur_Name"] == System.DBNull.Value) ? "" : dr["Sur_Name"].ToString();
                        string mdlNumber = (dr["MDL_Number"] == System.DBNull.Value) ? "NA" : dr["MDL_Number"].ToString();
                        string specialityName = (dr["Speciality_Name"] == System.DBNull.Value) ? "" : dr["Speciality_Name"].ToString();
                        string visitMode = (dr["Visit_Mode"] == System.DBNull.Value) ? "" : dr["Visit_Mode"].ToString();
                        string visitTime = (dr["Doctor_Visit_Time"] == System.DBNull.Value) ? "" : dr["Doctor_Visit_Time"].ToString().ToUpper();
                        string po_Amount = (dr["PO_Amount"] == System.DBNull.Value) ? "" : dr["PO_Amount"].ToString();
                        string remarks = (dr["Remarks_By_User"] == System.DBNull.Value) ? "" : dr["Remarks_By_User"].ToString();
                        string survey = (dr["Survey"] == System.DBNull.Value) ? "" : dr["Survey"].ToString();

                        //Bad code - Putting a try - catch to swallow the webrequest error
                        //TBD - Sahiti - 10/30

                        //try
                        //{

                        //if (survey != "")
                        //{

                        //    //var screen_name = "DCRApprovalReport";
                        //    //var menuurl = "hidoctor_reports/Userperday/GetUserPerDayReport";
                        //    //result = DataControl.Impl.ErrorHandler.InsertErrorLogsurvey("webrequeststart", screen_name, menuurl);
                        //    HttpWebRequest request = (HttpWebRequest)
                        //    //WebRequest.Create(accKey+ "SurveyAPI/GetSurveyResponse?CompanyCode=" + _objCur.GetCompanyCode()+ "&RegionCode=" + _objCur.GetRegionCode() + "&UserCode = " + _objCur.GetUserCode() + "&CustomerCode = " + dr["Doctor_Code"].ToString() + "&SurveyId=" + dr["Survey"] + "");
                        //    WebRequest.Create(ApiaccKey + "SurveyAPI/GetSurveyResponse/" + _objCur.GetCompanyCode() + "/" + _objCur.GetRegionCode() + "/" + userCode + "/" + dr["Doctor_Code"].ToString() + "/" + dr["Survey"] + "");
                        //    ServicePointManager.ServerCertificateValidationCallback += new System.Net.Security.RemoteCertificateValidationCallback(ValidateServerCertificate);
                        //    HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                        //    using (Stream responseStream = response.GetResponseStream())
                        //    {
                        //        using (StreamReader readStream = new StreamReader(responseStream, Encoding.UTF8))
                        //        {
                        //            string strSMSResponseString = readStream.ReadToEnd();
                        //            result = strSMSResponseString;


                        //        }
                        //    }
                        //    // screen_name = "DCRApprovalReport";
                        //    // menuurl = "hidoctor_reports/Userperday/GetUserPerDayReport";
                        //    //result = DataControl.Impl.ErrorHandler.InsertErrorLogsurvey("webrequestend", screen_name, menuurl);
                        //}
                        //}
                        //catch (Exception ex)
                        //{
                        //    //SWALLOW
                        //}
                        //finally {
                        //    //SWALLOW 
                        //}

                        if (visitTime.Length > 0)
                        {
                            if (visitMode.Length > 0)
                            {
                                if (!(visitTime.Contains("AM")) && !(visitTime.Contains("PM")))
                                {
                                    visitTime = visitTime + " " + visitMode;
                                }
                            }
                            else
                            {
                                if (!(visitTime.Contains("AM")))
                                {
                                    visitTime = visitTime + " AM";
                                }
                            }
                        }
                        string timemode = visitTime.Length > 0 ? visitTime : (visitMode.Length > 0 ? visitMode : "AM");
                        string doccate = (dr["Category_Name"] == System.DBNull.Value) ? "NA" : (dr["Category_Name"].ToString().Length > 0 ? dr["Category_Name"].ToString() : "NA");
                        string displaycategory = viewoption.ToUpper() == "S" ? doccate : "";
                        string RegionName = (dr["Region_Name"] == System.DBNull.Value) ? "" : dr["Region_Name"].ToString();
                        sbTabl.Append("<tr>");
                        //if (string.IsNullOrEmpty(surName))
                        //{
                        //    sbTabl.Append("<td id='docName_" + i.ToString() + "'>" + doctorName + "</td>");//Doctor Name
                        //}
                        //else
                        // {
                        //tblCont += "<td><span onclick='fnDoctor360Popup(\"" + chemJson[0].Customer_Code + "\")' style='text-decoration:underline;cursor:pointer'>" + chemJson[0].Doctor_Name + "</span></td>";
                        if ((docCode != null) && (docCode != ""))
                        {
                            sbTabl.Append("<td style='width:20%;' id='reg_Name_" + i.ToString() + "'>" + RegionName + "</td>");
                            sbTabl.Append("<td style='width:15%;' id='docName_" + i.ToString() + "'><span id='spnDoctCode_" + i.ToString() + "' onclick='fnDoctor360Popup(\"" + docCode + "\")' style='text-decoration:underline;cursor:pointer;'>" + doctorName + "</span><input type='hidden' value='" + docCode + "|" + survey + "|" + userCode + "' id='hdnDetails_" + i.ToString() + "'/></td>");//Added by ramya for Doctor360Popup
                        }
                        else
                        {
                            sbTabl.Append("<td style='width:10%;' id='reg_Name_" + i.ToString() + "'>" + RegionName + "</td>");
                            sbTabl.Append("<td style='width:15%;' id='doc_Name_" + i.ToString() + "'>" + doctorName + "</td>");
                        }
                        //sbTabl.Append("<td id='docName_" + i.ToString() + "'>" + doctorName+ "</td>");//Doctor Name
                        //}
                        sbTabl.Append("<td style='width:5%;' id='docMDL_" + i.ToString() + "'>" + mdlNumber + "</td>");
                        sbTabl.Append("<td style='width:10%;' id='docCategory_" + i.ToString() + "'>" + doccate + "</td>");
                        sbTabl.Append("<td style='width:10%;' id='docSpec_" + i.ToString() + "'>" + specialityName + "<span id='docCategory_" + i + "' style='display:none'>" + displaycategory + "</span></td>");
                        sbTabl.Append("<td style='width:10%;'>" + timemode + "</td>");
                        if (Convert.ToInt32(dr["Acc_Visit_Count"]) > 0)
                        {
                            sbTabl.Append("<td style='width:10%;'> YES </td>");
                            id++;
                        }
                        else
                        {
                            sbTabl.Append("<td style='width:10%;'>No</td>");
                        }
                        //sbTabl.Append("<td class='td-a' onclick='fnShowDetailedProducts(\"" + i.ToString() + "\",\"" + docCode + "\",\"" + type + "\");'>View</td>");
                        sbTabl.Append("<td style='width:10%;text-align: right;'>" + po_Amount + "</td>");
                        sbTabl.Append("<td style='width:10%;'>" + ((dr["Campaign_Name"] == System.DBNull.Value) ? "" : dr["Campaign_Name"].ToString()) + "</td>");
                        sbTabl.Append("<td style='width:10%;'>" + ((dr["Status_Name"] == System.DBNull.Value) ? "" : dr["Status_Name"].ToString()) + "</td>");
                        sbTabl.Append("<td style='width:10%;'>" + ((dr["Call_Objective_Name"] == System.DBNull.Value) ? "" : dr["Call_Objective_Name"].ToString()) + "</td>");
                        sbTabl.Append("<td style='width:10%;'>" + remarks + "</td>");
                        if (survey != "")
                        {
                            //    var screen_name = "DCRApprovalReport";
                            //    var menuurl = "hidoctor_reports/Userperday/GetUserPerDayReport";
                            //    result = DataControl.Impl.ErrorHandler.InsertErrorLogsurvey("resultpagestart", screen_name, menuurl);
                            //WebRequest.Create(accKey+ "SurveyAPI/GetSurveyResponse?CompanyCode=" + _objCur.GetCompanyCode()+ "&RegionCode=" + _objCur.GetRegionCode() + "&UserCode = " + _objCur.GetUserCode() + "&CustomerCode = " + dr["Doctor_Code"].ToString() + "&SurveyId=" + dr["Survey"] + "");
                            //  var qeyString = accKey + "/Survey/KASurveyResultPage?CompanyCode=" + _objCur.GetCompanyCode() + "&ChecklistId=" + dr["Survey"] + "&CompanyId=" + _objCur.GetCompanyId() + "&UserId=" + userCode + "&CustomerCode=" + dr["Doctor_Code"].ToString() + "";
                            sbTabl.Append("<td style='width:10%;'  class='surveylinkyes' id='surveylink_" + i.ToString() + "'><a href='#'>YES</a></td>");
                            //screen_name = "DCRApprovalReport";
                            //menuurl = "hidoctor_reports/Userperday/GetUserPerDayReport";
                            //result = DataControl.Impl.ErrorHandler.InsertErrorLogsurvey("resultpageend", screen_name, menuurl);
                        }
                        else
                        {
                            sbTabl.Append("<td style='width:10%;'  class='surveylinkno' id='surveylink_" + i.ToString() + "'><span>NO</span></td>");
                        }
                        sbTabl.Append("</tr>");
                        i++;
                    }
                }
                //var drCountlist2 = 0;
                //// StringBuilder sbTbl = new StringBuilder();
                //if (ds != null && ds.Rows.Count > 0)
                //{
                //    drCountlist2 = ds.Rows.Count;
                //    //sbTbl.Append("<div id='tblAccDoctorheader' class='gridHeader'><h3 style='margin: 0px auto'>" + DOCTOR_CAPTION + " Visited from Accompanists Master</h3>  <h4 id='drCount' style='float:right'> Total" + DOCTOR_CAPTION + "  Met Count <td> " + drCountlist + " </td> </h4> </div>");
                //    //sbTbl.Append("<table id='tblAccDoctor' style='width:100%'  class='data display dataTable box'><thead><th>" + DOCTOR_CAPTION + "</th><th>MDL/SVL#</th><th>Specialty</th><th>Category</th><th>Visit Mode/Time</th><th>Accompanist Details</th><th>POB Amount</th><th>Remarks</th></thead>");
                //    //sbTbl.Append("<tbody>");
                //    string type = "acc";
                //    int i = 1;
                //    foreach (DataRow dr in ds.Rows)
                //    {
                //        string docCode = dr["Doctor_Code"].ToString();
                //        string doctorName = (dr["Doctor_Name"] == System.DBNull.Value) ? "" : dr["Doctor_Name"].ToString();
                //        //  string surName = (dr["Sur_Name"] == System.DBNull.Value) ? "" : dr["Sur_Name"].ToString();
                //        string mdlNumber = (dr["MDL_Number"] == System.DBNull.Value) ? "NA" : dr["MDL_Number"].ToString();
                //        string specialityName = (dr["Speciality_Name"] == System.DBNull.Value) ? "" : dr["Speciality_Name"].ToString();
                //        string visitMode = (dr["Visit_Mode"] == System.DBNull.Value) ? "" : dr["Visit_Mode"].ToString();
                //        string visitTime = (dr["Doctor_Visit_Time"] == System.DBNull.Value) ? "" : dr["Doctor_Visit_Time"].ToString().ToUpper();
                //        string po_Amount = (dr["PO_Amount"] == System.DBNull.Value) ? "" : dr["PO_Amount"].ToString();
                //        string remarks = (dr["Remarks_By_User"] == System.DBNull.Value) ? "" : dr["Remarks_By_User"].ToString();
                //        if (visitTime.Length > 0)
                //        {
                //            if (visitMode.Length > 0)
                //            {
                //                if (!(visitTime.Contains("AM")) && !(visitTime.Contains("PM")))
                //                {
                //                    visitTime = visitTime + " " + visitMode;
                //                }

                //            }
                //            else
                //            {
                //                if (!(visitTime.Contains("AM")))
                //                {
                //                    visitTime = visitTime + " AM";
                //                }

                //            }
                //        }
                //        string timemode = visitTime.Length > 0 ? visitTime : (visitMode.Length > 0 ? visitMode : "AM");
                //        string doccate = (dr["Category_Name"] == System.DBNull.Value) ? "NA" : (dr["Category_Name"].ToString().Length > 0 ? dr["Category_Name"].ToString() : "NA");
                //        string displaycategory = viewoption.ToUpper() == "S" ? doccate : "";
                //        string RegionName = (dr["Region_Name"] == System.DBNull.Value) ? "" : dr["Region_Name"].ToString();

                //        sbTabl.Append("<tr>");
                //        //if (string.IsNullOrEmpty(surName))
                //        //{

                //        if ((docCode != null) && (docCode != ""))
                //        {
                //            sbTabl.Append("<td style='width:10%;' id='reg_Name_" + i.ToString() + "'>" + RegionName + "</td>");
                //            sbTabl.Append("<td style='width:25%;' id='accdocName_'><span onclick='fnDoctor360Popup(\"" + docCode + "\")' style='text-decoration:underline;cursor:pointer;'>" + doctorName + "</span></td>");//Added by ramya for Doctor360Popup
                //        }
                //        else
                //        {
                //            sbTabl.Append("<td style='width:10%;' id='reg_Name_" + i.ToString() + "'>" + RegionName + "</td>");
                //            sbTabl.Append("<td style='width:25%;' id='accdocName_" + i.ToString() + "'>" + doctorName + "</td>");
                //        }
                //        //}
                //        //else
                //        //{
                //        //    sbTbl.Append("<td id='accdocName_" + i.ToString() + "'>" + doctorName + "-" + surName + "</td>");//Doctor Name
                //        //}

                //        sbTabl.Append("<td style='width:10%;' id='accdocMDL_" + i.ToString() + "'>" + mdlNumber + "</td>");
                //        sbTabl.Append("<td style='width:10%;' id='accdocCategory_" + i.ToString() + "'>" + doccate + "</td>");
                //        sbTabl.Append("<td style='width:10%;' id='accdocSpec_" + i.ToString() + "'>" + specialityName + "<span id='accdocCategory_" + i + "' style='display:none'>" + displaycategory + "</span></td>");
                //        sbTabl.Append("<td style='width:10%;'>" + timemode + "</td>");
                //        if (Convert.ToInt32(dr["Acc_Visit_Count"]) > 0)
                //        {
                //            count++;
                //            sbTabl.Append("<td style='width:10%;'>YES</td>");
                //        }
                //        else
                //        {
                //            sbTabl.Append("<td style='width:10%;'>No</td>");
                //        }
                //        //sbTbl.Append("<td class='td-a' onclick='fnShowDetailedProducts(\"" + i.ToString() + "\",\"" + docCode + "\",\"" + type + "\");'>View</td>");
                //        sbTabl.Append("<td style='width:10%;text-align: right;'>" + po_Amount + "</td>");
                //        sbTabl.Append("<td style='width:10%;'>" + ((dr["Campaign_Name"] == System.DBNull.Value) ? "" : dr["Campaign_Name"].ToString()) + "</td>");
                //        sbTabl.Append("<td style='width:10%;'>" + ((dr["Status_Name"] == System.DBNull.Value) ? "" : dr["Status_Name"].ToString()) + "</td>");
                //        sbTabl.Append("<td style='width:10%;'>" + ((dr["Call_Objective_Name"] == System.DBNull.Value) ? "" : dr["Call_Objective_Name"].ToString()) + "</td>");
                //        sbTabl.Append("<td style='width:10%;'>" + remarks + "</td>");
                //        sbTabl.Append("</tr>");
                //        i++;



                //    }
                //}
                sbTabl.Append("</tbody></table>");
            }
            return sbTabl.ToString();
        }


        //Accompanist Doctor Visit Details
        private string BindAccDoctorsVisit(DataTable dt, string viewoption, int count)
        {
            var drCountlist = 0;
            StringBuilder sbTbl = new StringBuilder();
            if (dt != null && dt.Rows.Count > 0)
            {
                drCountlist = dt.Rows.Count;
                //sbTbl.Append("<div id='tblAccDoctorheader' class='gridHeader'><h3 style='margin: 0px auto'>" + DOCTOR_CAPTION + " Visited from Accompanists Master</h3>  <h4 id='drCount' style='float:right'> Total" + DOCTOR_CAPTION + "  Met Count <td> " + drCountlist + " </td> </h4> </div>");
                //sbTbl.Append("<table id='tblAccDoctor' style='width:100%'  class='data display dataTable box'><thead><th>" + DOCTOR_CAPTION + "</th><th>MDL/SVL#</th><th>Specialty</th><th>Category</th><th>Visit Mode/Time</th><th>Accompanist Details</th><th>POB Amount</th><th>Remarks</th></thead>");
                //sbTbl.Append("<tbody>");
                string type = "acc";
                int i = 1;
                foreach (DataRow dr in dt.Rows)
                {
                    string docCode = dr["Doctor_Code"].ToString();
                    string doctorName = (dr["Doctor_Name"] == System.DBNull.Value) ? "" : dr["Doctor_Name"].ToString();
                    // string surName = (dr["Sur_Name"] == System.DBNull.Value) ? "" : dr["Sur_Name"].ToString();
                    string mdlNumber = (dr["MDL_Number"] == System.DBNull.Value) ? "NA" : dr["MDL_Number"].ToString();
                    string specialityName = (dr["Speciality_Name"] == System.DBNull.Value) ? "" : dr["Speciality_Name"].ToString();
                    string visitMode = (dr["Visit_Mode"] == System.DBNull.Value) ? "" : dr["Visit_Mode"].ToString();
                    string visitTime = (dr["Doctor_Visit_Time"] == System.DBNull.Value) ? "" : dr["Doctor_Visit_Time"].ToString();
                    string po_Amount = (dr["PO_Amount"] == System.DBNull.Value) ? "" : dr["PO_Amount"].ToString();
                    string remarks = (dr["Remarks_By_User"] == System.DBNull.Value) ? "" : dr["Remarks_By_User"].ToString();
                    if (visitTime.Length > 0)
                    {
                        if (visitMode.Length > 0)
                        {
                            if (!(visitTime.Contains("AM")) && !(visitTime.Contains("PM")))
                            {
                                visitTime = visitTime + " " + visitMode;
                            }

                        }
                        else
                        {
                            if (!(visitTime.Contains("AM")))
                            {
                                visitTime = visitTime + " AM";
                            }

                        }
                    }
                    string timemode = visitTime.Length > 0 ? visitTime : (visitMode.Length > 0 ? visitMode : "AM");
                    string doccate = (dr["Category_Name"] == System.DBNull.Value) ? "NA" : (dr["Category_Name"].ToString().Length > 0 ? dr["Category_Name"].ToString() : "NA");
                    string displaycategory = viewoption.ToUpper() == "S" ? doccate : "";

                    sbTbl.Append("<tr>");
                    //if (string.IsNullOrEmpty(surName))
                    //{

                    if ((docCode != null) && (docCode != ""))
                    {
                        sbTbl.Append("<td style='width:25%;' id='accdocName_'><span onclick='fnDoctor360Popup(\"" + docCode + "\")' style='text-decoration:underline;cursor:pointer;'>" + doctorName + "</span></td>");//Added by ramya for Doctor360Popup
                    }
                    else
                    {
                        sbTbl.Append("<td style='width:25%;' id='accdocName_" + i.ToString() + "'>" + doctorName + "</td>");
                    }
                    //}
                    //else
                    //{
                    //    sbTbl.Append("<td id='accdocName_" + i.ToString() + "'>" + doctorName + "-" + surName + "</td>");//Doctor Name
                    //}

                    sbTbl.Append("<td style='width:10%;' id='accdocMDL_" + i.ToString() + "'>" + mdlNumber + "</td>");
                    sbTbl.Append("<td style='width:10%;' id='accdocSpec_" + i.ToString() + "'>" + specialityName + "<span id='accdocCategory_" + i + "' style='display:none'>" + displaycategory + "</span></td>");
                    sbTbl.Append("<td style='width:10%;' id='accdocCategory_" + i.ToString() + "'>" + doccate + "</td>");
                    sbTbl.Append("<td style='width:10%;'>" + timemode + "</td>");
                    if (Convert.ToInt32(dr["Acc_Visit_Count"]) > 0)
                    {
                        count++;
                        sbTbl.Append("<td><div style='display:none;' id='divDocAccDetails_" + count + "'>" + dr["DCR_Actual_Date"] + "$" + dr["DCR_Visit_Code"] + "$" + dr["MDL_Number"] + "$" + dr["Doctor_Name"] + "$" + dr["Category_Name"] + "</div><a href='#' onclick='fnGetDoctorAccompanist(\"" + count + "\");'> YES </a></td>");
                    }
                    else
                        sbTbl.Append("<td style='width:10%;'>No</td>");
                    //sbTbl.Append("<td class='td-a' onclick='fnShowDetailedProducts(\"" + i.ToString() + "\",\"" + docCode + "\",\"" + type + "\");'>View</td>");
                    sbTbl.Append("<td style='width:10%;text-align: right;'>" + po_Amount + "</td>");
                    sbTbl.Append("<td style='width:10%;'>" + remarks + "</td>");
                    sbTbl.Append("</tr>");
                    i++;
                }
                sbTbl.Append("</tbody></table>");
            }
            return sbTbl.ToString();
        }
        //Product Details
        private string BindProductDetails(DataTable dt)
        {
            StringBuilder sbTbl = new StringBuilder();
            if (dt != null && dt.Rows.Count > 0)
            {
                sbTbl.Append("<div class='gridHeader'><h3 style='margin: 0px auto'>" + DOCTOR_CAPTION + " Sample / Promotional item Details</h3></div>");
                sbTbl.Append("<table id='tblProducts'  class='data display dataTable box'><thead><th>" + DOCTOR_CAPTION + " Region</th><th>" + DOCTOR_CAPTION + "</th><th>Sample / Promotional item name</th><th>Batch Number</th><th>Qty given</th><th>Brand Name</th>");

                sbTbl.Append("</thead>");
                sbTbl.Append("<tbody>");
                List<string> docname = new List<string>();
                List<string> regname = new List<string>();
                int match, matchdoc, i = 0;
                foreach (DataRow dr in dt.Rows)
                {
                    string regionname = dr["Region_Name"] == System.DBNull.Value ? "" : dr["Region_Name"].ToString();
                    string doctorName = dr["Doctor_Name"] == System.DBNull.Value ? "" : dr["Doctor_Name"].ToString();
                    string productName = dr["Product_Name"] == System.DBNull.Value ? "" : dr["Product_Name"].ToString();
                    string quantityProvided = dr["Quantity_Provided"] == System.DBNull.Value ? "" : dr["Quantity_Provided"].ToString();
                    string currentStcok = dr["Current_Stock"] == System.DBNull.Value ? "" : dr["Current_Stock"].ToString();
                    string brandName = dr["Brand_Name"] == System.DBNull.Value ? "" : dr["Brand_Name"].ToString();
                    string Batch_Number = dr["Batch_Number"] == System.DBNull.Value ? "" : dr["Batch_Number"].ToString();
                    // string detailed = dr["Detailed"] == System.DBNull.Value ? "" : dr["Detailed"].ToString();
                    // string isCpDoc = dr["Is_CP_Doc"] == System.DBNull.Value ? "" : dr["Is_CP_Doc"].ToString();

                    match = Array.IndexOf(regname.ToArray(), regionname.Trim());
                    matchdoc = Array.IndexOf(docname.ToArray(), doctorName.Trim());
                    if (i != 0)
                    {
                        if (match == -1)
                        {
                            regname.Add(regionname.Trim());
                        }
                        if (matchdoc == -1)
                        {
                            docname.Add(doctorName.Trim());

                        }
                    }
                    sbTbl.Append("<tr>");
                    if (i == 0)
                    {
                        regname.Add(regionname.Trim());
                        sbTbl.Append("<td>" + regionname + "</td>");
                    }
                    else if (match != -1)
                    {
                        if (matchdoc == -1)
                        {
                            sbTbl.Append("<td>" + regionname + "</td>");
                        }
                        else
                        {
                            sbTbl.Append("<td></td>");
                        }
                    }
                    else
                    {
                        sbTbl.Append("<td>" + regionname + "</td>");
                    }
                    if (i == 0)
                    {
                        docname.Add(doctorName.Trim());
                        sbTbl.Append("<td>" + doctorName + "</td>");
                    }
                    else if (matchdoc != -1)
                    {
                        if (match == -1)
                        {
                            sbTbl.Append("<td>" + doctorName + "</td>");
                        }
                        else
                        {
                            sbTbl.Append("<td></td>");
                        }
                    }
                    else
                    {
                        sbTbl.Append("<td>" + doctorName + "</td>");
                    }

                    sbTbl.Append("<td>" + productName + "</td>");
                    sbTbl.Append("<td>" + Batch_Number + "</td>");
                    sbTbl.Append("<td style='text-align: right;'>" + quantityProvided + "</td>");
                    // sbTbl.Append("<td>" + currentStcok + "</td>");
                    sbTbl.Append("<td>" + brandName + "</td>");


                    //sbTbl.Append("<td style='display:none'>" + detailed + "</td>");
                    //sbTbl.Append("<td>" + isCpDoc + "</td>");
                    sbTbl.Append("</tr>");
                    i++;
                }
                sbTbl.Append("</tbody></table>");
            }
            return sbTbl.ToString();
        }
        private string BindAttendanceHospitalProductDetails(DataTable dt, string userCode)
        {
            StringBuilder sbTbl = new StringBuilder();
            string result = string.Empty;
            StringBuilder sbTabl = new StringBuilder();
            var objPathProv = new DataControl.Impl.FileSystemProvider();
            if (dt != null && dt.Rows.Count > 0)
            {
                sbTbl.Append("<div class='gridHeader'><h3 style='margin: 0px auto;background: grey;'>Hospital Sample / Promotional item Details</h3></div>");
                sbTbl.Append("<table id='tblProducts'  class='data display dataTable box'><thead><th>Hospital Region</th><th>Hospital Name</th><th>Sample / Promotional item name</th><th>Batch Number</th><th>Qty given</th>");

                sbTbl.Append("</thead>");
                sbTbl.Append("<tbody>");
                List<string> hsptlname = new List<string>();
                List<string> regname = new List<string>();
                int match, matchdoc, i = 0;
                foreach (DataRow dr in dt.Rows)
                {
                    string hstplcode = dr["Hospital_Id"].ToString();
                    string regionname = dr["Region_Name"] == System.DBNull.Value ? "" : dr["Region_Name"].ToString();
                    string HospitalName = dr["Hospital_Name"] == System.DBNull.Value ? "" : dr["Hospital_Name"].ToString();
                    string productName = dr["Product_Name"] == System.DBNull.Value ? "" : dr["Product_Name"].ToString();
                    string Batchnumber = dr["Batch_Number"] == System.DBNull.Value ? "" : dr["Batch_Number"].ToString();
                    string quantityProvided = dr["Quantity_Provided"] == System.DBNull.Value ? "" : dr["Quantity_Provided"].ToString();

                    match = Array.IndexOf(regname.ToArray(), regionname.Trim());
                    matchdoc = Array.IndexOf(hsptlname.ToArray(), HospitalName.Trim());
                    if (i != 0)
                    {
                        if (match == -1)
                        {
                            regname.Add(regionname.Trim());
                        }
                        if (matchdoc == -1)
                        {
                            hsptlname.Add(HospitalName.Trim());

                        }
                    }
                    sbTbl.Append("<tr>");
                    if (i == 0)
                    {
                        regname.Add(regionname.Trim());
                        sbTbl.Append("<td>" + regionname + "</td>");
                    }
                    else if (match != -1)
                    {
                        if (matchdoc == -1)
                        {
                            sbTbl.Append("<td>" + regionname + "</td>");
                        }
                        else
                        {
                            sbTbl.Append("<td></td>");
                        }
                    }
                    else
                    {
                        sbTbl.Append("<td>" + regionname + "</td>");
                    }
                    if (i == 0)
                    {
                        hsptlname.Add(HospitalName.Trim());
                        sbTbl.Append("<td>" + HospitalName + "<input type='hidden' value='" + hstplcode + "|" + userCode + "' id='hdnAtteDetails_" + i.ToString() + "'/></td></td>");
                    }
                    else if (matchdoc != -1)
                    {
                        if (match == -1)
                        {
                            sbTbl.Append("<td>" + HospitalName + "<input type='hidden' value='" + hstplcode + "|" + userCode + "' id='hdnAtteDetails_" + i.ToString() + "'/></td>");
                        }
                        else
                        {
                            sbTbl.Append("<td></td>");
                        }
                    }
                    else
                    {
                        sbTbl.Append("<td>" + HospitalName + "<input type='hidden' value='" + hstplcode + "|" + userCode + "' id='hdnAtteDetails_" + i.ToString() + "'/></td>");
                    }

                    sbTbl.Append("<td>" + productName + "</td>");
                    sbTbl.Append("<td>" + Batchnumber + "</td>");
                    sbTbl.Append("<td style='text-align: right;'>" + quantityProvided + "</td>");
                    sbTbl.Append("</tr>");
                    i++;
                }
                sbTbl.Append("</tbody></table>");
            }
            return sbTbl.ToString();
        }
        private string BindAttendanceProductDetails(DataTable dt, string userCode)
        {
            StringBuilder sbTbl = new StringBuilder();
            string result = string.Empty;
            StringBuilder sbTabl = new StringBuilder();
            var objPathProv = new DataControl.Impl.FileSystemProvider();
            string ApiaccKey = "https://surveydev-api.hidoctor.me/";
            string accKey = objPathProv.GetConfigValue("SurveyURL");
            if (dt != null && dt.Rows.Count > 0)
            {
                sbTbl.Append("<div class='gridHeader'><h3 style='margin: 0px auto;background: grey;'>" + DOCTOR_CAPTION + " Sample / Promotional item Details</h3></div>");
                sbTbl.Append("<table id='tblProducts'  class='data display dataTable box'><thead><th>" + DOCTOR_CAPTION + " Region</th><th>" + DOCTOR_CAPTION + "</th><th>Sample / Promotional item name</th><th>Batch Number</th><th>Qty given</th><th>Campaign Name</th><th>Survey</th>");

                sbTbl.Append("</thead>");
                sbTbl.Append("<tbody>");
                List<string> docname = new List<string>();
                List<string> regname = new List<string>();
                int match, matchdoc, i = 0;
                foreach (DataRow dr in dt.Rows)
                {
                    string docCode = dr["Doctor_Code"].ToString();
                    string regionname = dr["Region_Name"] == System.DBNull.Value ? "" : dr["Region_Name"].ToString();
                    string doctorName = dr["Doctor_Name"] == System.DBNull.Value ? "" : dr["Doctor_Name"].ToString();
                    string productName = dr["Product_Name"] == System.DBNull.Value ? "" : dr["Product_Name"].ToString();
                    string Batchnumber = dr["Batch_Number"] == System.DBNull.Value ? "" : dr["Batch_Number"].ToString();
                    string quantityProvided = dr["Quantity_Provided"] == System.DBNull.Value ? "" : dr["Quantity_Provided"].ToString();
                    string CampaignName = dr["Campaign_Name"] == System.DBNull.Value ? "" : dr["Campaign_Name"].ToString();
                    string survey = (dr["Survey"] == System.DBNull.Value) ? "" : dr["Survey"].ToString();
                    //if (survey != "")
                    //{
                    //    HttpWebRequest request = (HttpWebRequest)
                    // //WebRequest.Create(accKey+ "SurveyAPI/GetSurveyResponse?CompanyCode=" + _objCur.GetCompanyCode()+ "&RegionCode=" + _objCur.GetRegionCode() + "&UserCode = " + _objCur.GetUserCode() + "&CustomerCode = " + dr["Doctor_Code"].ToString() + "&SurveyId=" + dr["Survey"] + "");
                    // WebRequest.Create(ApiaccKey + "SurveyAPI/GetSurveyResponse/" + _objCur.GetCompanyCode() + "/" + _objCur.GetRegionCode() + "/" + userCode + "/" + dr["Doctor_Code"].ToString() + "/" + dr["Survey"] + "");
                    //    HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                    //    using (Stream responseStream = response.GetResponseStream())
                    //    {
                    //        using (StreamReader readStream = new StreamReader(responseStream, Encoding.UTF8))
                    //        {
                    //            string strSMSResponseString = readStream.ReadToEnd();
                    //            result = strSMSResponseString;


                    //        }
                    //    }
                    //}
                    // currentStcok = dr["Current_Stock"] == System.DBNull.Value ? "" : dr["Current_Stock"].ToString();
                    // string brandName = dr["Brand_Name"] == System.DBNull.Value ? "" : dr["Brand_Name"].ToString();
                    // string detailed = dr["Detailed"] == System.DBNull.Value ? "" : dr["Detailed"].ToString();
                    // string isCpDoc = dr["Is_CP_Doc"] == System.DBNull.Value ? "" : dr["Is_CP_Doc"].ToStriifng();
                    //     string remark = dr["Remark"] == System.DBNull.Value ? "" : dr["Remark"].ToString();
                    match = Array.IndexOf(regname.ToArray(), regionname.Trim());
                    matchdoc = Array.IndexOf(docname.ToArray(), doctorName.Trim());
                    if (i != 0)
                    {
                        if (match == -1)
                        {
                            regname.Add(regionname.Trim());
                        }
                        if (matchdoc == -1)
                        {
                            docname.Add(doctorName.Trim());

                        }
                    }
                    sbTbl.Append("<tr>");
                    if (i == 0)
                    {
                        regname.Add(regionname.Trim());
                        sbTbl.Append("<td>" + regionname + "</td>");
                    }
                    else if (match != -1)
                    {
                        if (matchdoc == -1)
                        {
                            sbTbl.Append("<td>" + regionname + "</td>");
                        }
                        else
                        {
                            sbTbl.Append("<td></td>");
                        }
                    }
                    else
                    {
                        sbTbl.Append("<td>" + regionname + "</td>");
                    }
                    if (i == 0)
                    {
                        docname.Add(doctorName.Trim());
                        sbTbl.Append("<td>" + doctorName + "<input type='hidden' value='" + docCode + "|" + survey + "|" + userCode + "' id='hdnAtteDetails_" + i.ToString() + "'/></td></td>");
                    }
                    else if (matchdoc != -1)
                    {
                        if (match == -1)
                        {
                            sbTbl.Append("<td>" + doctorName + "<input type='hidden' value='" + docCode + "|" + survey + "|" + userCode + "' id='hdnAtteDetails_" + i.ToString() + "'/></td>");
                        }
                        else
                        {
                            sbTbl.Append("<td></td>");
                        }
                    }
                    else
                    {
                        sbTbl.Append("<td>" + doctorName + "<input type='hidden' value='" + docCode + "|" + survey + "|" + userCode + "' id='hdnAtteDetails_" + i.ToString() + "'/></td>");
                    }

                    sbTbl.Append("<td>" + productName + "</td>");
                    sbTbl.Append("<td>" + Batchnumber + "</td>");
                    sbTbl.Append("<td style='text-align: right;'>" + quantityProvided + "</td>");
                    // sbTbl.Append("<td>" + currentStcok + "</td>");
                    //     sbTbl.Append("<td>" + remark + "</td>");
                    sbTbl.Append("<td>" + CampaignName + "</td>");
                    if (survey != "")
                    {

                        sbTbl.Append("<td style='width:10%;'  class='surveylinkyes' id='surveylinkA_" + i.ToString() + "'><a href='#'>YES</a></td>");

                    }
                    else
                    {
                        sbTbl.Append("<td style='width:10%;'  class='surveylinkno' id='surveylinkA_" + i.ToString() + "'><span>NO</span></td>");
                    }

                    //sbTbl.Append("<td style='display:none'>" + detailed + "</td>");
                    //sbTbl.Append("<td>" + isCpDoc + "</td>");
                    sbTbl.Append("</tr>");
                    i++;
                }
                sbTbl.Append("</tbody></table>");
            }
            return sbTbl.ToString();
        }
        //RCPA Details
        //private string BindRCPADetails(DataTable dt)
        //{
        //    StringBuilder sbTbl = new StringBuilder();


        //    if (dt != null && dt.Rows != null && dt.Rows.Count > 0)
        //    {
        //        sbTbl.Append("<div class='gridHeader'><h3 style='margin: 0px auto'>" + DOCTOR_CAPTION + "  RCPA Details</h3></div>");
        //        sbTbl.Append("<table id='tblRCPA'  class='data display dataTable box'><thead><th>" + DOCTOR_CAPTION + " Name</th><th>" + CHEMIST_CAPTION + " Name</th><th>My Product Name</th><th>My Product Quantity</th><th>Competitor Product Name</th><th>Competitor Product Qty</th></thead>");
        //        sbTbl.Append("<tbody>");

        //        List<string> docname = new List<string>();
        //        List<string> chemname = new List<string>();
        //        List<string> prodname = new List<string>();
        //        List<string> prodqty = new List<string>();

        //        int matchchem, matchdoc, matchprod, matchprodqty, i = 0;

        //        foreach (DataRow dr in dt.Rows)
        //        {
        //            string Docname = dr["Doctor_Name"] == System.DBNull.Value ? "" : dr["Doctor_Name"].ToString();
        //            string Chemname = dr["Chemists_Name"] == System.DBNull.Value ? "" : dr["Chemists_Name"].ToString();
        //            string productName = dr["Product_Name"] == System.DBNull.Value ? "" : dr["Product_Name"].ToString();
        //            string productqty = dr["Support_Qty"] == System.DBNull.Value ? "" : dr["Support_Qty"].ToString();
        //            string competitorProductName = dr["Competitor_Product_Name"] == System.DBNull.Value ? "" : dr["Competitor_Product_Name"].ToString();
        //            string competitorqty = (dr["Support_Qty"] == System.DBNull.Value) ? "" : dr["Support_Qty"].ToString();
        //            string prodCode = dr["Product_Code"]== System.DBNull.Value ? "" : dr["Product_Code"].ToString();
        //            //if (productName != competitorProductName)
        //            //{
        //                matchdoc = Array.IndexOf(docname.ToArray(), Docname.Trim());
        //                matchchem = Array.IndexOf(chemname.ToArray(), Chemname.Trim());
        //                matchprod = Array.IndexOf(prodname.ToArray(), productName.Trim());
        //                matchprodqty = Array.IndexOf(prodqty.ToArray(), productqty.Trim());

        //                if (i != 0)
        //                {
        //                    if (matchchem == -1)
        //                    {
        //                        chemname.Add(Chemname.Trim());
        //                    }
        //                    if (matchdoc == -1)
        //                    {
        //                        docname.Add(Docname.Trim());
        //                    }
        //                    if (matchdoc == -1)
        //                    {
        //                        prodname.Clear();
        //                    }
        //                    if (matchprod == -1)
        //                    {
        //                        prodname.Add(productName.Trim());

        //                    }
        //                }
        //                sbTbl.Append("<tr>");
        //                //doctor name
        //                if (i == 0)
        //                {
        //                    docname.Add(Docname.Trim());
        //                    sbTbl.Append("<td>" + Docname + "</td>");
        //                }
        //                else if (matchdoc != -1)
        //                {
        //                    if (matchchem == -1)
        //                    {
        //                        sbTbl.Append("<td>" + Docname + "</td>");
        //                    }
        //                    else
        //                    {
        //                        sbTbl.Append("<td></td>");
        //                    }
        //                }
        //                else
        //                {
        //                    sbTbl.Append("<td>" + Docname + "</td>");
        //                }

        //                //chemist name

        //                if (i == 0)
        //                {
        //                    chemname.Add(Chemname.Trim());
        //                    sbTbl.Append("<td>" + Chemname + "</td>");
        //                }
        //                else if (matchchem != -1)
        //                {
        //                    if (matchdoc == -1)
        //                    {
        //                        sbTbl.Append("<td>" + Chemname + "</td>");
        //                    }
        //                    else
        //                    {
        //                        sbTbl.Append("<td></td>");
        //                    }
        //                }
        //                else
        //                {
        //                    sbTbl.Append("<td>" + Chemname + "</td>");
        //                }

        //                //product name

        //                if (i == 0)
        //                {
        //                    prodname.Add(productName.Trim());
        //                    sbTbl.Append("<td>" + productName + "</td>");
        //                }
        //                else if (matchprod != -1)
        //                {
        //                    if (matchchem == -1 || matchdoc == -1)
        //                    {
        //                        sbTbl.Append("<td>" + productName + "</td>");
        //                    }
        //                    else
        //                    {
        //                        sbTbl.Append("<td></td>");
        //                    }
        //                }
        //                else
        //                {
        //                    sbTbl.Append("<td>" + productName + "</td>");
        //                }

        //                //product qty

        //                if (i == 0)
        //                {
        //                    prodqty.Add(productqty.Trim());
        //                    sbTbl.Append("<td>" + productqty + "</td>");
        //                }
        //                else if (matchdoc != -1)
        //                {
        //                    if (matchchem == -1 || matchprod == -1)
        //                    {
        //                        sbTbl.Append("<td>" + productqty + "</td>");

        //                    }
        //                    else
        //                    {
        //                        sbTbl.Append("<td></td>");
        //                    }
        //                }
        //                else
        //                {
        //                    sbTbl.Append("<td>" + productqty + "</td>");
        //                }

        //            if (prodCode == "")
        //            {
        //                sbTbl.Append("<td>" + competitorProductName + "</td>");
        //                sbTbl.Append("<td>" + competitorqty + "</td>");
        //            }
        //            else
        //            {
        //                sbTbl.Append("<td></td>");
        //                sbTbl.Append("<td></td>");
        //            }
        //                i++;
        //         //   }
        //        }
        //    }

        //    sbTbl.Append("</tbody></table>");
        //    return sbTbl.ToString();
        //}

        private string BindRCPADetails(DataTable dt)
        {
            StringBuilder sbTbl = new StringBuilder();
            DataTable distproductcode = new DataTable();
            DataTable distChemisName = new DataTable();
            DataRow[] drOwnandcompetitorproducts;
            DataRow[] ChemistsName;
            DataTable dtDoctorlist = new DataTable();
            DataTable drdoctorlist = new DataTable();
            int ownproductCount;

            if (dt != null && dt.Rows != null && dt.Rows.Count > 0)
            {
                sbTbl.Append("<div class='gridHeader'><h3 style='margin: 0px auto'>" + DOCTOR_CAPTION + "  RCPA Details</h3></div>");
                sbTbl.Append("<table id='tblRCPA'  class='data display dataTable box'><thead><th>" + DOCTOR_CAPTION + " Name</th><th>" + CHEMIST_CAPTION + " Name</th><th>My Product Name</th><th>My Product Quantity</th><th>Competitor Product Name</th><th>Competitor Product Qty</th></thead>");
                sbTbl.Append("<tbody>");
                dt.DefaultView.Sort = "Doctor_Name ASC";
                dtDoctorlist = dt.DefaultView.ToTable(true, "Doctor_Name");


                if (dtDoctorlist.Rows != null && dtDoctorlist.Rows.Count > 0)
                {
                    foreach (DataRow doctorlist in dtDoctorlist.Rows)
                    {
                        if (!string.IsNullOrEmpty(Convert.ToString(doctorlist["Doctor_Name"])))
                        {
                            //Get doctor and His details
                            drdoctorlist = dt.AsEnumerable().Where(a => Convert.ToString(a["Doctor_Name"]) == Convert.ToString(doctorlist["Doctor_Name"])).CopyToDataTable();
                            if (drdoctorlist.Rows.Count > 0)
                            {
                                DataRow drdoctor = drdoctorlist.AsEnumerable().Where(own => Convert.ToString(own["Doctor_Name"]) != "").FirstOrDefault();
                                string doctorName = (drdoctor["Doctor_Name"] == System.DBNull.Value) ? "" : drdoctor["Doctor_Name"].ToString();
                                //  string surName = (drdoctor["Sur_Name"] == System.DBNull.Value) ? "" : drdoctor["Sur_Name"].ToString();
                                //string chemistName = (drdoctor["Chemists_Name"] == System.DBNull.Value) ? "" : drdoctor["Chemists_Name"].ToString();

                                sbTbl.Append("<tr>");
                                if (doctorName != "")
                                {
                                    sbTbl.Append("<td>" + doctorName + "</td>");//Doctor Name
                                }
                                else
                                {
                                    sbTbl.Append("<td></td>");
                                }
                                //sbTbl.Append("<td>" + chemistName + "</td>");//Chemist Name

                                //Get own product and its competitor product

                                int chemistcount = 0;
                                distproductcode = drdoctorlist.DefaultView.ToTable(true, "DCR_Product_Code");
                                distChemisName = drdoctorlist.DefaultView.ToTable(true, "Chemists_Name");

                                foreach (DataRow chem in distChemisName.Rows)
                                {
                                    ChemistsName = drdoctorlist.AsEnumerable().Where(a => Convert.ToString(a["Chemists_Name"]) == Convert.ToString(chem["Chemists_Name"])).ToArray();
                                    if (ChemistsName.Length > 0)
                                    {
                                        DataRow drChem = ChemistsName.AsEnumerable().Where(own => Convert.ToString(own["Chemists_Name"]) != "").FirstOrDefault();
                                        string chname = drChem["Chemists_Name"] == System.DBNull.Value ? "" : drChem["Chemists_Name"].ToString();
                                        if (chemistcount > 0)
                                        {
                                            sbTbl.Append("<td></td>");
                                            sbTbl.Append("<td>" + chname + "</td>");
                                        }
                                        else
                                        {
                                            sbTbl.Append("<td>" + chname + "</td>");
                                        }
                                        ownproductCount = 0;
                                        foreach (DataRow dcrProductcode in distproductcode.Rows)
                                        {
                                            int compRowcount = 0;

                                            drOwnandcompetitorproducts = ChemistsName.AsEnumerable().Where(a => Convert.ToString(a["DCR_Product_Code"]) == Convert.ToString(dcrProductcode["DCR_Product_Code"])).ToArray();
                                            if (drOwnandcompetitorproducts.Length > 0)
                                            {
                                                //Create Own product details
                                                DataRow drOwnProduct = drOwnandcompetitorproducts.AsEnumerable().Where(own => Convert.ToString(own["DCR_Product_Code"]) != "").FirstOrDefault();
                                                DataRow drCompProduct = drOwnandcompetitorproducts.AsEnumerable().Where(own => Convert.ToString(own["Product_Code"]) == "").FirstOrDefault();
                                                string productName = drOwnProduct["Product_Name"] == System.DBNull.Value ? "" : drOwnProduct["Product_Name"].ToString();
                                                string ownProductQty = drOwnProduct["Support_Qty"] == System.DBNull.Value ? "" : drOwnProduct["Support_Qty"].ToString();
                                            
                                                if (ownproductCount > 0)
                                                {
                                                    //sbTbl.Append("<tr></tr>");
                                                    sbTbl.Append("<tr>");
                                                    sbTbl.Append("<td></td>");//Doctor Name
                                                    sbTbl.Append("<td></td>");//Chemist Name
                                                    sbTbl.Append("<td>" + productName + "</td>");//My product Name
                                                    sbTbl.Append("<td>" + ownProductQty + "</td>");//My Product quanity    
                                                }
                                                else
                                                {
                                                    sbTbl.Append("<td>" + productName + "</td>");//My product Name
                                                    sbTbl.Append("<td>" + ownProductQty + "</td>");//My Product quanity  
                                                }
                                                ownproductCount++;
                                                //To create competitor Product
                                                foreach (DataRow dr in drOwnandcompetitorproducts)
                                                {
                                                    if (string.IsNullOrEmpty(Convert.ToString(dr["Product_Code"])))
                                                    {
                                                        string competitorProductName = dr["Competitor_Product_Name"] == System.DBNull.Value ? "" : dr["Competitor_Product_Name"].ToString();
                                                        string competitorqty = (dr["Support_Qty"] == System.DBNull.Value) ? "" : dr["Support_Qty"].ToString();
                                                        if (compRowcount > 0)
                                                        {
                                                            sbTbl.Append("<tr>");
                                                            sbTbl.Append("<td></td>"); // Doctor Name
                                                            sbTbl.Append("<td></td>");//Chemist Name
                                                            sbTbl.Append("<td></td>");//My Product Name
                                                            sbTbl.Append("<td></td>"); // My product qty
                                                            sbTbl.Append("<td>" + competitorProductName + "</td>"); // Competitor Product name
                                                            sbTbl.Append("<td>" + competitorqty + "</td>");//Competitor Product Quantity 
                                                            sbTbl.Append("</tr>");
                                                        }
                                                        else
                                                        {
                                                            sbTbl.Append("<td>" + competitorProductName + "</td>"); // Competitor Product name
                                                            sbTbl.Append("<td>" + competitorqty + "</td>");//Competitor Product Quantity 
                                                            sbTbl.Append("</tr>");
                                                        }
                                                        compRowcount++;
                                                    }
                                                }
                                                if (drCompProduct == null)
                                                {
                                                    sbTbl.Append("<td></td>");//Competitor product Name
                                                    sbTbl.Append("<td></td>");//Competitor Produt qty
                                                    sbTbl.Append("</tr>");
                                                }
                                            }
                                        }
                                    }
                                    chemistcount++;
                                }
                            }

                        }
                        distChemisName.Clear();
                    }

                }
            }

            sbTbl.Append("</tbody></table>");
            return sbTbl.ToString();
        }

        //Chemist Details
        private string BindChemistDetails(DataTable dt)
        {
            StringBuilder sbTbl = new StringBuilder();
            int chemistCount = dt.Rows.Count;
            if (dt != null && dt.Rows.Count > 0)
            {
                sbTbl.Append("<div class='gridHeader'><h3 style='margin: 0px auto'>" + DOCTOR_CAPTION + " " + CHEMIST_CAPTION + " Details</h3><h4 id='chCount' style='float:right'> Total " + CHEMIST_CAPTION + " Met Count : " + chemistCount + "  </h4></div>");
                sbTbl.Append("<table id='tblChemist' class='data display dataTable box'><thead><th>" + CHEMIST_CAPTION + " Name</th><th>POB Amount</th></thead>");
                sbTbl.Append("<tbody>");
                foreach (DataRow dr in dt.Rows)
                {
                    string chemistName = dr["Chemists_Name"] == null ? "" : dr["Chemists_Name"].ToString();
                    string poAmount = dr["PO_Amount"] == null ? "" : dr["PO_Amount"].ToString();
                    sbTbl.Append("<tr>");
                    sbTbl.Append("<td>" + chemistName + "</td>");
                    sbTbl.Append("<td style='text-align: right;'>" + poAmount + "</td>");
                    sbTbl.Append("</tr>");
                }
                sbTbl.Append("</tbody></table>");
            }
            return sbTbl.ToString();
        }
        //////////////////
        //  POB Details //
        //////////////////
        private string BindPOBDetails(DataTable dt)
        {
            StringBuilder sbTbl = new StringBuilder();
            if (dt != null && dt.Rows.Count > 0)
            {
                bool statusTemp = false;
                sbTbl.Append("<div class= 'gridHeader'><h3 style='width:100%;margin:0px auto'>" + DOCTOR_CAPTION + " Purchase Order Booking </h3></div>");
                sbTbl.Append("<table id='tblPobOrders' style='width:100%' class='data display box'><thead><th>" + DOCTOR_CAPTION + " Region</th><th>" + DOCTOR_CAPTION + " Name</th><th>" + STOCKIEST_CAPTION + "</th><th>Order Number</th><th>Order Due Date</th><th>No Of Products</th><th>Total Value</th></thead>");
                sbTbl.Append("<tbody>");
                List<string> docname = new List<string>();
                List<string> regname = new List<string>();
                List<string> stckname = new List<string>();
                int match, matchdoc, matchstock, i = 0;
                foreach (DataRow dr in dt.Rows)
                {
                    string regionname = dr["Region_Name"] == System.DBNull.Value ? "" : dr["Region_Name"].ToString();
                    string doctorName = dr["Customer_Name"] == System.DBNull.Value ? "" : dr["Customer_Name"].ToString();
                    string stockistname = dr["Stockist_Name"] == System.DBNull.Value ? "" : dr["Stockist_Name"].ToString();
                    match = Array.IndexOf(regname.ToArray(), regionname.Trim());
                    matchdoc = Array.IndexOf(docname.ToArray(), doctorName.Trim());
                    matchstock = Array.IndexOf(stckname.ToArray(), stockistname.Trim());
                    //if (i != 0)
                    //{
                    //    if (match == -1)
                    //    {
                    //        regname.Add(regionname.Trim());
                    //    }
                    //    if (matchdoc == -1)
                    //    {
                    //        docname.Add(doctorName.Trim());
                    //    }
                    //    if (matchstock == -1)
                    //    {
                    //        stckname.Add(stockistname.Trim());
                    //    }
                    //}
                    sbTbl.Append("<tr>");
                    //if (i == 0)
                    //{
                    //    regname.Add(regionname.Trim());
                    //    sbTbl.Append("<td style='width:20%;'>" + regionname + "</td>");
                    //}
                    //else if (match != -1)
                    //{
                    //    if (matchdoc == -1)
                    //    {
                    //        sbTbl.Append("<td style='width:20%;'>" + regionname + "</td>");
                    //    }
                    //    else
                    //    {
                    //        sbTbl.Append("<td></td>");
                    //    }
                    //}
                    //else
                    //{
                    sbTbl.Append("<td style='width:20%;'>" + regionname + "</td>");
                    //  }
                    //if (i == 0)
                    //{
                    //    docname.Add(doctorName.Trim());
                    //    sbTbl.Append("<td style='width:20%;'>" + doctorName + "</td>");
                    //}
                    //else if (matchdoc != -1)
                    //{
                    //    if (match == -1)
                    //    {
                    //        sbTbl.Append("<td style='width:20%;'>" + doctorName + "</td>");
                    //    }
                    //    else
                    //    {
                    //        sbTbl.Append("<td></td>");
                    //    }
                    //}
                    //else
                    //{
                    sbTbl.Append("<td style='width:20%;'>" + doctorName + "</td>");
                    //}
                    //if (i == 0)
                    //{
                    //    stckname.Add(stockistname.Trim());
                    //    sbTbl.Append("<td style='width:20%;'>" + stockistname + "</td>");
                    //}
                    //else if (matchstock != -1)
                    //{
                    //    if (match == -1 || matchdoc == -1)
                    //    {
                    //        sbTbl.Append("<td>" + stockistname + "</td>");
                    //    }
                    //    else
                    //    {
                    //        sbTbl.Append("<td></td>");
                    //    }
                    //}
                    //else
                    //{
                    sbTbl.Append("<td style='width:20%;'>" + stockistname + "</td>");
                    //}


                    //  sbTbl.Append("<td style='width:20%;'>" + dr["Stockist_Name"].ToString() + "</td>");
                    sbTbl.Append("<td style='width:10%;text-decoration:underline;cursor:pointer;'><a href='javascript:fnGetPOBProductDetailsforReport(" + dr["Order_Id"].ToString() + ");' class='btnEditOrder'>" + dr["Order_Number"].ToString() + "</a></td>");
                    sbTbl.Append("<td style='width:10%;'>" + dr["Order_Due_Date"].ToString() + "</td>");
                    sbTbl.Append("<td style='width:10%;text-align: right;'>" + dr["No_Of_Products"].ToString() + "</td>");
                    sbTbl.Append("<td style='width:10%;text-align: right;'>" + dr["Total_POB_Value"].ToString() + "</td>");
                    sbTbl.Append("</tr>");

                    if (Convert.ToInt32(dr["Order_Status"].ToString()) == 3)
                    {
                        statusTemp = true;
                    }
                    i++;
                }
                if (statusTemp)
                {
                    sbTbl.Append("<tr><td colspan='5' style='font-size:11px;'>T : Temporary/Drafted Order Number.</td></tr>");
                }

                sbTbl.Append("</tbody></table>");

            }
            return sbTbl.ToString();
        }
        // Follow Ups
        private string BindFollowUps(DataTable dt)
        {
            StringBuilder sbTbl = new StringBuilder();
            if (dt != null && dt.Rows.Count > 0)
            {
                sbTbl.Append("<div class='gridHeader'><h3 style='margin: 0px auto'>" + DOCTOR_CAPTION + " Follow Ups</h3></div>");
                sbTbl.Append("<table id='tblFollowUps' style='width:100%' class='data display dataTable box'><thead><th>" + DOCTOR_CAPTION + " Region</th><th>" + DOCTOR_CAPTION + "</th><th>Tasks</th><th>Due Date</th></thead>");
                sbTbl.Append("<tbody>");
                List<string> docname = new List<string>();
                List<string> regname = new List<string>();
                int match, matchdoc, i = 0;
                foreach (DataRow dr in dt.Rows)
                {
                    string regionname = dr["Region_Name"] == null ? "" : dr["Region_Name"].ToString();
                    string doctorName = dr["Doctor_Name"] == null ? "" : dr["Doctor_Name"].ToString();
                    string tasks = dr["Tasks"] == null ? "" : dr["Tasks"].ToString();
                    string dueDate = dr["Due_Date"] == null ? "" : dr["Due_Date"].ToString();
                    match = Array.IndexOf(regname.ToArray(), regionname.Trim());
                    matchdoc = Array.IndexOf(docname.ToArray(), doctorName.Trim());
                    if (i != 0)
                    {
                        if (match == -1)
                        {
                            regname.Add(regionname.Trim());
                        }
                        if (matchdoc == -1)
                        {
                            docname.Add(doctorName.Trim());

                        }
                    }

                    sbTbl.Append("<tr>");
                    if (i == 0)
                    {
                        regname.Add(regionname.Trim());
                        sbTbl.Append("<td style='width:25%;'>" + regionname + "</td>");
                    }
                    else if (match != -1)
                    {
                        if (matchdoc == -1)
                        {
                            sbTbl.Append("<td style='width:25%;'>" + regionname + "</td>");
                        }
                        else
                        {
                            sbTbl.Append("<td></td>");
                        }
                    }
                    else
                    {
                        sbTbl.Append("<td style='width:25%;'>" + regionname + "</td>");
                    }
                    if (i == 0)
                    {
                        docname.Add(doctorName.Trim());
                        sbTbl.Append("<td style='width:25%;'>" + doctorName + "</td>");
                    }
                    else if (matchdoc != -1)
                    {
                        if (match == -1)
                        {
                            sbTbl.Append("<td style='width:25%;'>" + doctorName + "</td>");
                        }
                        else
                        {
                            sbTbl.Append("<td></td>");
                        }
                    }
                    else
                    {
                        sbTbl.Append("<td style='width:25%;'>" + doctorName + "</td>");
                    }

                    // sbTbl.Append("<td style='width:15%;'>" + mdlNo + "</td>");
                    sbTbl.Append("<td style='width:20%;'>" + tasks + "</td>");
                    sbTbl.Append("<td style='width:10%;'>" + dueDate + "</td>");
                    //sbTbl.Append("<td>" + dcrActualDate + "</td>");
                    //sbTbl.Append("<td style='width:20%;'>" + updatedDateTime + "</td>");
                    sbTbl.Append("</tr>");
                    i++;
                }
                sbTbl.Append("</tbody></table>");
            }
            return sbTbl.ToString();
        }
        private string BindCallActivity(DataTable dt)
        {
            StringBuilder sbTbl = new StringBuilder();
            if (dt != null && dt.Rows.Count > 0)
            {
                sbTbl.Append("<div class='gridHeader'><h3 style='margin: 0px auto'>" + DOCTOR_CAPTION + " Call Activity</h3></div>");
                sbTbl.Append("<table id='tblActivity' style='width:100%' class='data display dataTable box'><thead><th>" + DOCTOR_CAPTION + " Region</th><th>" + DOCTOR_CAPTION + "</th><th>Activity</th><th>Remark</th></thead>");
                sbTbl.Append("<tbody>");
                List<string> docname = new List<string>();
                List<string> regname = new List<string>();
                int match, matchdoc, i = 0;
                foreach (DataRow dr in dt.Rows)
                {
                    string regionname = dr["Region_Name"] == null ? "" : dr["Region_Name"].ToString();
                    string doctorName = dr["Doctor_Name"] == null ? "" : dr["Doctor_Name"].ToString();
                    string Activity_Name = dr["Activity_Name"] == null ? "" : dr["Activity_Name"].ToString();
                    string Activity_Remarks = dr["Activity_Remarks"] == null ? "" : dr["Activity_Remarks"].ToString();
                    match = Array.IndexOf(regname.ToArray(), regionname.Trim());
                    matchdoc = Array.IndexOf(docname.ToArray(), doctorName.Trim());
                    if (i != 0)
                    {
                        if (match == -1)
                        {
                            regname.Add(regionname.Trim());
                        }
                        if (matchdoc == -1)
                        {
                            docname.Add(doctorName.Trim());

                        }
                    }

                    sbTbl.Append("<tr>");
                    if (i == 0)
                    {
                        regname.Add(regionname.Trim());
                        sbTbl.Append("<td style='width:25%;'>" + regionname + "</td>");
                    }
                    else if (match != -1)
                    {
                        if (matchdoc == -1)
                        {
                            sbTbl.Append("<td style='width:25%;'>" + regionname + "</td>");
                        }
                        else
                        {
                            sbTbl.Append("<td></td>");
                        }
                    }
                    else
                    {
                        sbTbl.Append("<td style='width:25%;'>" + regionname + "</td>");
                    }
                    if (i == 0)
                    {
                        docname.Add(doctorName.Trim());
                        sbTbl.Append("<td style='width:25%;'>" + doctorName + "</td>");
                    }
                    else if (matchdoc != -1)
                    {
                        if (match == -1)
                        {
                            sbTbl.Append("<td style='width:25%;'>" + doctorName + "</td>");
                        }
                        else
                        {
                            sbTbl.Append("<td></td>");
                        }
                    }
                    else
                    {
                        sbTbl.Append("<td style='width:25%;'>" + doctorName + "</td>");
                    }

                    // sbTbl.Append("<td style='width:15%;'>" + mdlNo + "</td>");
                    sbTbl.Append("<td style='width:20%;'>" + Activity_Name + "</td>");
                    sbTbl.Append("<td style='width:10%;'>" + Activity_Remarks + "</td>");
                    //sbTbl.Append("<td>" + dcrActualDate + "</td>");
                    //sbTbl.Append("<td style='width:20%;'>" + updatedDateTime + "</td>");
                    sbTbl.Append("</tr>");
                    i++;
                }
                sbTbl.Append("</tbody></table>");
            }
            return sbTbl.ToString();
        }
        private string BindMCActivity(DataTable dt)
        {
            StringBuilder sbTbl = new StringBuilder();
            if (dt != null && dt.Rows.Count > 0)
            {
                sbTbl.Append("<div class='gridHeader'><h3 style='margin: 0px auto'>" + DOCTOR_CAPTION + " Marketing Campaign Activity</h3></div>");
                sbTbl.Append("<table id='tblMCActivity' style='width:100%' class='data display dataTable box'><thead><th>" + DOCTOR_CAPTION + " Region</th><th>" + DOCTOR_CAPTION + "</th><th>Marketing Campaign</th><th>Activity</th><th>Remark</th></thead>");
                sbTbl.Append("<tbody>");
                List<string> docname = new List<string>();
                List<string> regname = new List<string>();
                int match, matchdoc, i = 0;
                foreach (DataRow dr in dt.Rows)
                {
                    string regionname = dr["Region_Name"] == null ? "" : dr["Region_Name"].ToString();
                    string doctorName = dr["Doctor_Name"] == null ? "" : dr["Doctor_Name"].ToString();
                    string Campaign_Name = dr["Campaign_Name"] == null ? "" : dr["Campaign_Name"].ToString();
                    string Activity_Name = dr["Activity_Name"] == null ? "" : dr["Activity_Name"].ToString();
                    string remark = dr["MC_Remark"] == null ? "" : dr["MC_Remark"].ToString();
                    match = Array.IndexOf(regname.ToArray(), regionname.Trim());
                    matchdoc = Array.IndexOf(docname.ToArray(), doctorName.Trim());
                    if (i != 0)
                    {
                        if (match == -1)
                        {
                            regname.Add(regionname.Trim());
                        }
                        if (matchdoc == -1)
                        {
                            docname.Add(doctorName.Trim());

                        }
                    }

                    sbTbl.Append("<tr>");
                    if (i == 0)
                    {
                        regname.Add(regionname.Trim());
                        sbTbl.Append("<td style='width:25%;'>" + regionname + "</td>");
                    }
                    else if (match != -1)
                    {
                        if (matchdoc == -1)
                        {
                            sbTbl.Append("<td style='width:25%;'>" + regionname + "</td>");
                        }
                        else
                        {
                            sbTbl.Append("<td></td>");
                        }
                    }
                    else
                    {
                        sbTbl.Append("<td style='width:25%;'>" + regionname + "</td>");
                    }
                    if (i == 0)
                    {
                        docname.Add(doctorName.Trim());
                        sbTbl.Append("<td style='width:25%;'>" + doctorName + "</td>");
                    }
                    else if (matchdoc != -1)
                    {
                        if (match == -1)
                        {
                            sbTbl.Append("<td style='width:25%;'>" + doctorName + "</td>");
                        }
                        else
                        {
                            sbTbl.Append("<td></td>");
                        }
                    }
                    else
                    {
                        sbTbl.Append("<td style='width:25%;'>" + doctorName + "</td>");
                    }

                    // sbTbl.Append("<td style='width:15%;'>" + mdlNo + "</td>");
                    sbTbl.Append("<td style='width:20%;'>" + Campaign_Name + "</td>");
                    sbTbl.Append("<td style='width:10%;'>" + Activity_Name + "</td>");
                    sbTbl.Append("<td>" + remark + "</td>");
                    //sbTbl.Append("<td style='width:20%;'>" + updatedDateTime + "</td>");
                    sbTbl.Append("</tr>");
                    i++;
                }
                sbTbl.Append("</tbody></table>");
            }
            return sbTbl.ToString();
        }
        // Attchments Add and Download
        private string BindAttachments(DataTable dt)
        {
            StringBuilder sbTbl = new StringBuilder();
            if (dt != null && dt.Rows.Count > 0)
            {
                sbTbl.Append("<div class='gridHeader'><h3 style='margin: 0px auto'>" + DOCTOR_CAPTION + " Attachments</h3></div>");
                sbTbl.Append("<table id='tblAttachments' style='width:100%' class='data display dataTable box'><thead><th>" + DOCTOR_CAPTION + " Region</th><th>" + DOCTOR_CAPTION + "</th><th>Attachement File name (click on the file to download locally)</th><th>Updated DateTime</th><th>Status </th></thead>");
                sbTbl.Append("<tbody>");
                List<string> docname = new List<string>();
                List<string> regname = new List<string>();
                int match, matchdoc, i = 0;
                foreach (DataRow dr in dt.Rows)
                {
                    string regionname = dr["Region_Name"] == null ? "" : dr["Region_Name"].ToString();
                    string doctorName = dr["Doctor_Name"] == null ? "" : dr["Doctor_Name"].ToString();
                    //string mdlNo = dr["MDL_Number"] == null ? "" : dr["MDL_Number"].ToString();
                    // string id = dr["ID"] == null ? "" : dr["ID"].ToString();
                    string bloburl = dr["Blob_Url"] == null ? "" : dr["Blob_Url"].ToString();
                    string uploadFileName = dr["Uploaded_File_Name"] == null ? "" : dr["Uploaded_File_Name"].ToString();
                    //string dcrActualDate = dr["DCR_Actual_Date"] == null ? "" : dr["DCR_Actual_Date"].ToString();
                    string updatedDateTime = dr["Updated_Date_Time"] == null ? "" : dr["Updated_Date_Time"].ToString();
                    //string attachmentStatus = dr["Blob_Url"] == null ? "" : dr["Blob_Url"].ToString();
                    match = Array.IndexOf(regname.ToArray(), regionname.Trim());
                    matchdoc = Array.IndexOf(docname.ToArray(), doctorName.Trim());
                    if (i != 0)
                    {
                        if (match == -1)
                        {
                            regname.Add(regionname.Trim());
                        }
                        if (matchdoc == -1)
                        {
                            docname.Add(doctorName.Trim());

                        }
                    }
                    sbTbl.Append("<tr>");
                    if (i == 0)
                    {
                        regname.Add(regionname.Trim());
                        sbTbl.Append("<td style='width:25%;'>" + regionname + "</td>");
                    }
                    else if (match != -1)
                    {
                        if (matchdoc == -1)
                        {
                            sbTbl.Append("<td style='width:25%;'>" + regionname + "</td>");
                        }
                        else
                        {
                            sbTbl.Append("<td></td>");
                        }
                    }
                    else
                    {
                        sbTbl.Append("<td style='width:25%;'>" + regionname + "</td>");
                    }
                    if (i == 0)
                    {
                        docname.Add(doctorName.Trim());
                        sbTbl.Append("<td style='width:25%;'>" + doctorName + "</td>");
                    }
                    else if (matchdoc != -1)
                    {
                        if (match == -1)
                        {
                            sbTbl.Append("<td style='width:25%;'>" + doctorName + "</td>");
                        }
                        else
                        {
                            sbTbl.Append("<td></td>");
                        }
                    }
                    else
                    {
                        sbTbl.Append("<td style='width:25%;'>" + doctorName + "</td>");
                    }
                    // sbTbl.Append("<td style='width:10%;'>" + mdlNo + "</td>");
                    if (bloburl == "")
                    {
                        sbTbl.Append("<td style='width:40%;'>" + uploadFileName + "</td>");
                    }
                    else
                    {
                        sbTbl.Append("<td style='width:40%;'><a href='" + bloburl + "'>" + uploadFileName + "</td>");
                    }
                    //sbTbl.Append("<td>" + dcrActualDate + "</td>");
                    sbTbl.Append("<td style='width:15%;'>" + updatedDateTime + "</td>");
                    if (bloburl == null || bloburl == "")
                    {
                        sbTbl.Append("<td style='width:10%;'>" + "Yet to upload" + "</td>");
                    }
                    else
                    {
                        sbTbl.Append("<td style='width:10%;'>" + "Attached" + "</td>");
                    }
                    sbTbl.Append("</tr>");
                    i++;
                }
                sbTbl.Append("</tbody></table>");
            }
            return sbTbl.ToString();
        }
        //Stockiest Details
        private string BindStockiestDetails(DataTable dt)
        {
            StringBuilder sbTbl = new StringBuilder();
            int StockiestCount = dt.Rows.Count;
            if (dt != null && dt.Rows.Count > 0)
            {
                sbTbl.Append("<div class='gridHeader'><h3 style='margin: 0px auto;background: #ec9e0e;'>" + STOCKIEST_CAPTION + " Details</h3><h4 id='chCount' style='float:right'> Total " + STOCKIEST_CAPTION + " Met Count : " + StockiestCount + "  </h4></div>");
                sbTbl.Append("<table id='tblstockist' class='data display dataTable box'><thead><th>" + STOCKIEST_CAPTION + " Name</th><th>Visit Time/Mode</th><th>POB</th><th>Collection</th><th>Remarks</th></thead>");
                sbTbl.Append("<tbody>");
                foreach (DataRow dr in dt.Rows)
                {
                    string stockiestName = dr["Stockiest_Name"] == System.DBNull.Value ? "" : dr["Stockiest_Name"].ToString();
                    string visitMode = dr["Visit_Mode"] == System.DBNull.Value ? "" : dr["Visit_Mode"].ToString();
                    string visitTime = dr["Visit_Time"] == System.DBNull.Value ? "" : dr["Visit_Time"].ToString().Split(':')[0] + ':' + dr["Visit_Time"].ToString().Split(':')[1];

                    string remarks = dr["Remarks_By_User"] == System.DBNull.Value ? "" : dr["Remarks_By_User"].ToString();
                    string pobamount = dr["PO_Amount"] == System.DBNull.Value ? "" : dr["PO_Amount"].ToString();
                    string collectionamount = dr["Collection_Amount"] == System.DBNull.Value ? "" : dr["Collection_Amount"].ToString();
                    sbTbl.Append("<tr>");
                    sbTbl.Append("<td>" + stockiestName + "</td>");
                    sbTbl.Append("<td>" + visitTime + ' ' + visitMode + "</td>");
                    //POB
                    sbTbl.Append("<td>");
                    sbTbl.Append(pobamount);
                    sbTbl.Append("</td>");
                    //Collections
                    sbTbl.Append("<td>");
                    sbTbl.Append(collectionamount);
                    sbTbl.Append("</td>");
                    sbTbl.Append("<td>" + remarks + "</td>");
                    sbTbl.Append("</tr>");
                }
                sbTbl.Append("</tbody></table>");
            }
            return sbTbl.ToString();
        }
        //Leave Details
        private string BindLeaveDetails(DataTable dt, string startDate)
        {
            StringBuilder sbTbl = new StringBuilder();
            string approvedBy = string.Empty;
            string approvedDate = string.Empty;
            string approvedreason = string.Empty;
            string attachment = string.Empty;

            if (dt != null && dt.Rows.Count > 0)
            {
                string dcrStatus = (dt.Rows[0]["DCR_Status"].ToString() == "1") ? "Applied" : ((dt.Rows[0]["DCR_Status"].ToString() == "2") ? "Approved" : ((dt.Rows[0]["DCR_Status"].ToString() == "0") ? "Unapproved" : "Drafted"));
                approvedBy = dt.Rows[0]["Approved_By"].ToString();
                approvedDate = dt.Rows[0]["Approved_Date"].ToString();
                approvedreason = dt.Rows[0]["Unapproval_Reason"].ToString();
                attachment = dt.Rows[0]["Attachment_Id"].ToString();
                if (!string.IsNullOrEmpty(approvedreason))
                {
                    approvedreason = approvedreason.Split('~').Last().TrimEnd('^').ToString();
                }
                else
                {
                    approvedreason = "";
                }
                string sdate = startDate.Split('-')[2] + "/" + startDate.Split('-')[1] + "/" + startDate.Split('-')[0];
                sbTbl.Append("<div style='margin-left:25%;font-weight: bold;font-size: large;'class='dvheader-inner' ><div id='divHeader' style='float: left;'>User Per Day Report of </div> - " + dt.Rows[0]["Employee_Name"] + "(" + dt.Rows[0]["User_Name"] + ") for " + sdate + "</div>");

                sbTbl.Append("</br>");
                sbTbl.Append("<div class='gridHeader' id='dvleavedetails'>");
                sbTbl.Append("<h3 style='margin: 0px auto;background: grey;'>Leave Details</h3>");
                sbTbl.Append("<span hidden id='UserName'></span>");
                sbTbl.Append("</div>");
                sbTbl.Append("<table id='tblleaveDetails' class='data display dataTable box'>");
                sbTbl.Append("<thead>");
                sbTbl.Append("<tr>");
                sbTbl.Append("<th>Type Of DCR</th>");
                sbTbl.Append("<th>DCR Status</th>");
                sbTbl.Append("<th>Leave Type Name</th>");
                sbTbl.Append("<th>Leave Reason</th>");
                sbTbl.Append("<th>Approved / Un Approved By</th>");
                sbTbl.Append("<th>Approved / Un Approved Date</th>");
                sbTbl.Append("<th>Approval / Un Approval Reason</th>");
                sbTbl.Append("<th>Attachments</th>");
                sbTbl.Append("</tr>");
                sbTbl.Append("</thead><tbody>");
                sbTbl.Append("<tr>");
                sbTbl.Append("<td><span id='spnleave'>Leave</span></td>");
                sbTbl.Append("<td><span id='spndcr'>" + dcrStatus + "</span></td>");
                sbTbl.Append("<td><span id='spntypename'>" + dt.Rows[0]["Leave_Type_Name"] + "</span></td>");
                if (!string.IsNullOrEmpty(dt.Rows[0]["Reason"].ToString()))
                {
                    sbTbl.Append("<td><span id='spnleavereason'>" + dt.Rows[0]["Reason"] + "</span></td>");
                }
                else
                {
                    sbTbl.Append("<td></td>");
                }
                sbTbl.Append("<td><span id='spndcr'>" + approvedBy + "</span></td>");
                sbTbl.Append("<td><span id='spndcr'>" + approvedDate + "</span></td>");
                sbTbl.Append("<td><span id='spndcr'>" + approvedreason + "</span></td>");
                if (attachment != null && attachment != "")
                {
                    sbTbl.Append("<td><span id='spndcr'><a onclick='fnLeavePopup(\"" + approvedBy + "|" + approvedDate + "|" + approvedreason + "|" + attachment + "\");'><i class='fa fa-paperclip' aria-hidden='true' style='font-size: 15px;cursor: pointer;'></i></a></span></td>");
                }
                else
                {
                    sbTbl.Append("<td>No Attachments Found</td>");
                }
                //sbTbl.Append("<td class='td-a'><a onclick='fnLeavePopup(\"" + approvedBy + "|" + approvedDate + "|" + approvedreason + "\");'>View</a></td>");
                sbTbl.Append("</tr></tbody></table>");
            }
            else
            {
                sbTbl.Append("<div style='width:100%;float:left;'>No Data Found</div>");
            }
            return sbTbl.ToString();
        }

        public JsonResult GetAttachments(int attachment_Id)
        {
            CurrentInfo _objCurr = new CurrentInfo();
            string company_Code = _objCurr.GetCompanyCode();
            SPData objSPData = new SPData();
            List<MVCModels.DCRLeaveAttachmentModel> lsAttachments = objSPData.GetAttachments(company_Code, attachment_Id);
            return Json(lsAttachments, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Bind Details Product details
        /// </summary>
        /// <param name="dt"></param>
        /// <returns></returns>
        private string BindDetaildProductDetails(DataTable dt)
        {
            StringBuilder sbTbl = new StringBuilder();
            CurrentInfo objCurrentinfo = new CurrentInfo();
            string Competitor_Prod_privil = objCurrentinfo.GetPrivilegeValue("COLLECT_RETAIL_COMPETITOR_INFO", "0");
            if (dt != null && dt.Rows.Count > 0)
            {

                DAL_DoctorVisit objDocVisit = new DAL_DoctorVisit();

                sbTbl.Append("<div class='gridHeader'><h3 style='margin: 0px auto'>" + DOCTOR_CAPTION + " Detailed Products</h3></div>");
                sbTbl.Append("<table id='tblProducts'  class='data display dataTable box'><thead><th>" + DOCTOR_CAPTION + " Region</th><th>" + DOCTOR_CAPTION + " Name</th><th>Detailed Product Name</th><th>Brand</th>");
                sbTbl.Append("<th>Business Status</th>");
                sbTbl.Append("<th>Business Potential</th><th>Remark</th></thead>");
                sbTbl.Append("<tbody>");
                List<string> docname = new List<string>();
                List<string> regname = new List<string>();

                int match, matchdoc, i = 0;
                foreach (DataRow dr in dt.Rows)
                {
                    string regionname = dr["Region_Name"] == System.DBNull.Value ? "" : dr["Region_Name"].ToString();
                    string doctorName = dr["Doctor_Name"] == System.DBNull.Value ? "" : dr["Doctor_Name"].ToString();
                    string productName = dr["Product_Name"] == System.DBNull.Value ? "" : dr["Product_Name"].ToString();
                    //string productTypeName = dr["Product_Type_Name"] == System.DBNull.Value ? "" : dr["Product_Type_Name"].ToString();
                    string BrandName = dr["Brand_Name"] == System.DBNull.Value ? "" : dr["Brand_Name"].ToString();

                    // string isCpDoc = dr["Is_CP_Doc"] == System.DBNull.Value ? "" : dr["Is_CP_Doc"].ToString();
                    match = Array.IndexOf(regname.ToArray(), regionname.Trim());
                    matchdoc = Array.IndexOf(docname.ToArray(), doctorName.Trim());

                    if (i != 0)
                    {
                        if (match == -1)
                        {
                            regname.Add(regionname.Trim());
                        }
                        if (matchdoc == -1)
                        {
                            docname.Add(doctorName.Trim());

                        }

                    }
                    sbTbl.Append("<tr>");
                    if (i == 0)
                    {
                        regname.Add(regionname.Trim());
                        sbTbl.Append("<td>" + regionname + "</td>");
                    }
                    else if (match != -1)
                    {
                        if (matchdoc == -1)
                        {
                            sbTbl.Append("<td>" + regionname + "</td>");
                        }
                        else
                        {
                            sbTbl.Append("<td></td>");
                        }
                    }
                    else
                    {
                        sbTbl.Append("<td>" + regionname + "</td>");
                    }
                    if (i == 0)
                    {
                        docname.Add(doctorName.Trim());
                        sbTbl.Append("<td>" + doctorName + "</td>");
                    }
                    else if (matchdoc != -1)
                    {
                        if (match == -1)
                        {
                            sbTbl.Append("<td>" + doctorName + "</td>");
                        }
                        else
                        {
                            sbTbl.Append("<td></td>");
                        }
                    }
                    else
                    {
                        sbTbl.Append("<td>" + doctorName + "</td>");
                    }

                    sbTbl.Append("<td>" + productName + "</td>");
                    // sbTbl.Append("<td>" + productTypeName + "</td>");
                    sbTbl.Append("<td>" + BrandName + "</td>");
                    sbTbl.Append("<td>" + (dr["Status_Name"] == System.DBNull.Value ? "" : dr["Status_Name"].ToString()) + "</td>");
                    sbTbl.Append("<td>" + (dr["BusinessPotential"] == System.DBNull.Value ? "" : dr["BusinessPotential"].ToString()) + "</td>");

                    sbTbl.Append("<td>" + (dr["Business_Status_Remarks"] == System.DBNull.Value ? "" : dr["Business_Status_Remarks"].ToString()) + "</td>");

                    //sbTbl.Append("<td>" + isCpDoc + "</td>");
                    sbTbl.Append("</tr>");
                    i++;
                }
                sbTbl.Append("</tbody></table>");
            }
            return sbTbl.ToString();
        }
        //Competitor product//
        private string BindCompetitorProductDetails(DataTable dt)
        {
            StringBuilder sbTbl = new StringBuilder();
            CurrentInfo objCurrentinfo = new CurrentInfo();
            string Competitor_Prod_privil = objCurrentinfo.GetPrivilegeValue("COLLECT_RETAIL_COMPETITOR_INFO", "0");
            if (dt != null && dt.Rows.Count > 0)
            {
                // if (Competitor_Prod_privil == "1")
                //  {
                DAL_DoctorVisit objDocVisit = new DAL_DoctorVisit();

                sbTbl.Append("<div class='gridHeader'><h3 style='margin: 0px auto'> Competitor Products</h3></div>");
                sbTbl.Append("<table id='tblProducts'  class='data display dataTable box'><thead><th>" + DOCTOR_CAPTION + " Region</th><th>" + DOCTOR_CAPTION + " Name</th><th>Detailed Product Name</th><th>Brand</th>");

                sbTbl.Append("<th>Competitor Name</th><th>Competitor Product Name</th></thead>");
                sbTbl.Append("<tbody>");
                List<string> docname = new List<string>();
                List<string> regname = new List<string>();
                List<string> prodname = new List<string>();
                List<string> brandname = new List<string>();
                int match, matchdoc, i = 0, matchprod, matchbrand;
                foreach (DataRow dr in dt.Rows)
                {
                    string regionname = dr["Region_Name"] == System.DBNull.Value ? "" : dr["Region_Name"].ToString();
                    string doctorName = dr["Doctor_Name"] == System.DBNull.Value ? "" : dr["Doctor_Name"].ToString();
                    string productName = dr["Product_Name"] == System.DBNull.Value ? "" : dr["Product_Name"].ToString();

                    string BrandName = dr["Brand_Name"] == System.DBNull.Value ? "" : dr["Brand_Name"].ToString();
                    string Competitorname = dr["Competitor_name"] == System.DBNull.Value ? "" : dr["Competitor_name"].ToString();

                    match = Array.IndexOf(regname.ToArray(), regionname.Trim());
                    matchdoc = Array.IndexOf(docname.ToArray(), doctorName.Trim());
                    matchprod = Array.IndexOf(prodname.ToArray(), productName.Trim());
                    matchbrand = Array.IndexOf(brandname.ToArray(), BrandName.Trim());
                    if (i != 0)
                    {
                        if (match == -1)
                        {
                            regname.Add(regionname.Trim());
                        }
                        if (matchdoc == -1)
                        {
                            docname.Add(doctorName.Trim());

                        }
                        if (matchdoc == -1)
                        {
                            prodname.Clear();
                        }
                        if (matchprod == -1)
                        {
                            prodname.Add(productName.Trim());

                        }
                    }
                    sbTbl.Append("<tr>");
                    if (i == 0)
                    {
                        regname.Add(regionname.Trim());
                        sbTbl.Append("<td>" + regionname + "</td>");
                    }
                    else if (match != -1)
                    {
                        if (matchdoc == -1)
                        {
                            sbTbl.Append("<td>" + regionname + "</td>");
                        }
                        else
                        {
                            sbTbl.Append("<td></td>");
                        }
                    }
                    else
                    {
                        sbTbl.Append("<td>" + regionname + "</td>");
                    }
                    if (i == 0)
                    {
                        docname.Add(doctorName.Trim());
                        sbTbl.Append("<td>" + doctorName + "</td>");
                    }
                    else if (matchdoc != -1)
                    {
                        if (match == -1)
                        {
                            sbTbl.Append("<td>" + doctorName + "</td>");
                        }
                        else
                        {
                            sbTbl.Append("<td></td>");
                        }
                    }
                    else
                    {
                        sbTbl.Append("<td>" + doctorName + "</td>");
                    }
                    if (i == 0)
                    {
                        prodname.Add(productName.Trim());
                        sbTbl.Append("<td>" + productName + "</td>");
                    }
                    else if (matchprod != -1)
                    {
                        if (match == -1 || matchdoc == -1)
                        {
                            sbTbl.Append("<td>" + productName + "</td>");
                        }
                        else
                        {
                            sbTbl.Append("<td></td>");
                        }
                    }
                    else
                    {
                        sbTbl.Append("<td>" + productName + "</td>");
                    }

                    if (i == 0)
                    {
                        brandname.Add(BrandName.Trim());
                        sbTbl.Append("<td>" + BrandName + "</td>");
                    }
                    else if (match != -1)
                    {
                        if (matchdoc == -1 || matchprod == -1)
                        {
                            sbTbl.Append("<td>" + BrandName + "</td>");

                        }
                        else
                        {
                            sbTbl.Append("<td></td>");
                        }
                    }
                    else
                    {
                        sbTbl.Append("<td>" + BrandName + "</td>");
                    }


                    //    sbTbl.Append("<td>" + productName + "</td>");
                    //   sbTbl.Append("<td>" + BrandName + "</td>");

                    sbTbl.Append("<td>" + Competitorname + "</td>");
                    sbTbl.Append("<td>" + (dr["Comp_product"] == System.DBNull.Value ? "" : dr["Comp_product"].ToString()) + "</td>");



                    sbTbl.Append("</tr>");
                    //if(matchdoc == -1)
                    //{
                    //    matchprod=0;
                    //}
                    i++;
                }
                sbTbl.Append("</tbody></table>");


                //  }
                //    else
                //    {
                //        DAL_DoctorVisit objDocVisit = new DAL_DoctorVisit();

                //        sbTbl.Append("<div class='gridHeader'><h3 style='margin: 0px auto'>" + DOCTOR_CAPTION + " Detailed Products</h3></div>");
                //        sbTbl.Append("<table id='tblProducts'  class='data display dataTable box'><thead><th>" + DOCTOR_CAPTION + " Region</th><th>" + DOCTOR_CAPTION + " Name</th><th>Detailed Product Name</th><th>Brand</th>");

                //        sbTbl.Append("<th>Remark</th></thead>");
                //        sbTbl.Append("<tbody>");
                //        List<string> docname = new List<string>();
                //        List<string> regname = new List<string>();
                //        int match, matchdoc, i = 0;
                //        foreach (DataRow dr in dt.Rows)
                //        {
                //            string regionname = dr["Region_Name"] == System.DBNull.Value ? "" : dr["Region_Name"].ToString();
                //            string doctorName = dr["Doctor_Name"] == System.DBNull.Value ? "" : dr["Doctor_Name"].ToString();
                //            string productName = dr["Product_Name"] == System.DBNull.Value ? "" : dr["Product_Name"].ToString();

                //            string BrandName = dr["Brand_Name"] == System.DBNull.Value ? "" : dr["Brand_Name"].ToString();

                //            match = Array.IndexOf(regname.ToArray(), regionname.Trim());
                //            matchdoc = Array.IndexOf(docname.ToArray(), doctorName.Trim());
                //            if (i != 0)
                //            {
                //                if (match == -1)
                //                {
                //                    regname.Add(regionname.Trim());
                //                }
                //                if (matchdoc == -1)
                //                {
                //                    docname.Add(doctorName.Trim());

                //                }
                //            }
                //            sbTbl.Append("<tr>");
                //            if (i == 0)
                //            {
                //                regname.Add(regionname.Trim());
                //                sbTbl.Append("<td>" + regionname + "</td>");
                //            }
                //            else if (match != -1)
                //            {
                //                if (matchdoc == -1)
                //                {
                //                    sbTbl.Append("<td>" + regionname + "</td>");
                //                }
                //                else
                //                {
                //                    sbTbl.Append("<td></td>");
                //                }
                //            }
                //            else
                //            {
                //                sbTbl.Append("<td>" + regionname + "</td>");
                //            }
                //            if (i == 0)
                //            {
                //                docname.Add(doctorName.Trim());
                //                sbTbl.Append("<td>" + doctorName + "</td>");
                //            }
                //            else if (matchdoc != -1)
                //            {
                //                if (match == -1)
                //                {
                //                    sbTbl.Append("<td>" + doctorName + "</td>");
                //                }
                //                else
                //                {
                //                    sbTbl.Append("<td></td>");
                //                }
                //            }
                //            else
                //            {
                //                sbTbl.Append("<td>" + doctorName + "</td>");
                //            }

                //            sbTbl.Append("<td>" + productName + "</td>");
                //            // sbTbl.Append("<td>" + productTypeName + "</td>");
                //            sbTbl.Append("<td>" + BrandName + "</td>");
                //         //   sbTbl.Append("<td>" + (dr["Status_Name"] == System.DBNull.Value ? "" : dr["Status_Name"].ToString()) + "</td>");
                //           // sbTbl.Append("<td>" + (dr["BusinessPotential"] == System.DBNull.Value ? "" : dr["BusinessPotential"].ToString()) + "</td>");
                //        //    sbTbl.Append("<td>" + (dr["Business_Status_Remarks"] == System.DBNull.Value ? "" : dr["Business_Status_Remarks"].ToString()) + "</td>");

                //            //sbTbl.Append("<td>" + isCpDoc + "</td>");
                //            sbTbl.Append("</tr>");
                //            i++;
                //        }
                //        sbTbl.Append("</tbody></table>");


                //    }
            }
            return sbTbl.ToString();
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="dt"></param>
        /// <returns></returns>
        //////////////////////////Detailed Digital Assets/////////////////////////////////////////
        private string BindDetailedDigitalAssets(DataTable dt)
        {
            StringBuilder sbTbl = new StringBuilder();
            if (dt != null && dt.Rows.Count > 0)
            {
                sbTbl.Append("<div class='gridHeader'><h3 style='margin: 0px auto'>Detailed Digital Assets</h3></div>");
                sbTbl.Append("<table id='tblDigitalAssets' style='width:100%' class='data display dataTable box'><thead><th>" + DOCTOR_CAPTION + "</th><th>MDL/SVL#</th><th>Speciality</th><th>DA Name</th><th>DA Type</th><th>Total Viewed Durations</th></thead>");
                sbTbl.Append("<tbody>");
                foreach (DataRow dr in dt.Rows)
                {
                    string doctorName = dr["Doctor_Name"] == null ? "" : dr["Doctor_Name"].ToString();
                    string mdlNo = dr["MDL_Number"] == null ? "" : dr["MDL_Number"].ToString();
                    string speciality = dr["Speciality_Name"] == null ? "" : dr["Speciality_Name"].ToString();
                    string daName = dr["DA_Name"] == null ? "" : dr["DA_Name"].ToString();
                    string daType = dr["DA_Type"] == null ? "" : dr["DA_Type"].ToString();
                    string viewedDuration = dr["Total_Duration"] == null ? "" : dr["Total_Duration"].ToString();

                    sbTbl.Append("<tr>");
                    sbTbl.Append("<td>" + doctorName + "</td>");
                    sbTbl.Append("<td>" + mdlNo + "</td>");
                    sbTbl.Append("<td>" + speciality + "</td>");
                    sbTbl.Append("<td>" + daName + "</td>");
                    sbTbl.Append("<td>" + daType + "</td>");
                    sbTbl.Append("<td>" + viewedDuration + "</td>");
                    sbTbl.Append("</tr>");
                }
                sbTbl.Append("</tbody></table>");
            }
            return sbTbl.ToString();
        }
        #endregion User Perday new
        #region Chemist visit
        ///////////////////////////////////////////////////////////  Chemist Visit Day //////////////////////////////////
        //Contact Details////

        private string BindChemistVisitContact(DataTable dt)
        {

            StringBuilder sbTbl = new StringBuilder();
            if (dt != null && dt.Rows.Count > 0)
            {
                sbTbl.Append("<div class='gridHeader'><h3 style='margin: 0px auto;background: lightseagreen;'>Chemist Contact Details</h3></div>");
                sbTbl.Append("<table id='tblChemistContact' class='data display dataTable box'><thead><th>Chemist Name</th><th>Contact Name</th><th>Mobile</th><th>Email</th></thead>");
                sbTbl.Append("<tbody>");
                foreach (DataRow dr in dt.Rows)
                {
                    sbTbl.Append("<tr>");
                    sbTbl.Append("<td>" + dr["Chemists_Name"] + "</td>");
                    sbTbl.Append("<td>" + dr["Contact_Name"] + "</td>");
                    sbTbl.Append("<td>" + dr["Mobile"] + "</td>");
                    sbTbl.Append("<td>" + dr["Email"] + "</td>");
                    sbTbl.Append("</tr>");
                }
                sbTbl.Append("</tbody></table>");
            }
            return sbTbl.ToString();
        }
        ////Accompanist details///////////////
        private string BindChemistVisitAccompanistDetails(DataTable dt)
        {

            StringBuilder sbTbl = new StringBuilder();
            //if (dt != null)

            var chemistCount = 0;
            if (dt != null && dt.Rows.Count > 0)
            {
                chemistCount = dt.Rows.Count;
                sbTbl.Append("<div id='tblAccDoctorheader' class='gridHeader'><h3 style='margin: 0px auto;background:lightseagreen;'>" + CHEMIST_CAPTION + " Visited Details</h3> <h4 id='chCount' style='float:right'> Total " + CHEMIST_CAPTION + " Met Count : <td> " + chemistCount + " </td> </h4></div>");
                sbTbl.Append("<table id='tblAccDoctor' style='width:100%'  class='data display dataTable box'><thead><th>" + CHEMIST_CAPTION + " Region</th><th>" + CHEMIST_CAPTION + "</th><th>MDL/SVL#</th><th>Visit Time</th><th>Accompanist Details</th><th>POB Amount</th><th>Remarks</th><th>Business Category Name</th></thead>");
                sbTbl.Append("<tbody>");
                string type = "acc";
                int i = 1;
                foreach (DataRow dr in dt.Rows)
                {
                    string docCode = dr["Chemist_Code"].ToString();
                    //   chemistCount += docCode.Count();
                    string regionname = (dr["Region_Name"] == System.DBNull.Value) ? "" : dr["Region_Name"].ToString();
                    string chemistName = (dr["Chemists_Name"] == System.DBNull.Value) ? "" : dr["Chemists_Name"].ToString();
                    string mdlNumber = (dr["MDL_Number"] == System.DBNull.Value) ? "NA" : dr["MDL_Number"].ToString();
                    string visitTime = (dr["Visit_Time"] == System.DBNull.Value) ? "" : dr["Visit_Time"].ToString();
                    string visitMode = (dr["Visit_Mode"] == System.DBNull.Value) ? "" : dr["Visit_Mode"].ToString();
                    string po_Amount = (dr["PO_Amount"] == System.DBNull.Value) ? "" : dr["PO_Amount"].ToString();
                    string remarks = (dr["Remarks_By_User"] == System.DBNull.Value) ? "" : dr["Remarks_By_User"].ToString();
                    string CategoryName = (dr["Business_Category_Name"] == System.DBNull.Value) ? "" : dr["Business_Category_Name"].ToString();
                    if (visitTime.Length > 0)
                    {
                        if (visitMode.Length > 0)
                        {
                            if (!(visitTime.Contains("AM")) && !(visitTime.Contains("PM")))
                            {
                                visitTime = visitTime.Substring(0, 5) + " " + visitMode;
                            }

                        }
                        else
                        {
                            if (!(visitTime.Contains("AM")))
                            {
                                visitTime = visitTime.Substring(0, 5) + " AM";
                            }
                        }
                    }
                    // string visitedtime = visitTime + " " + visitMode;
                    string visitedtime = visitTime;
                    if (visitMode.Length > 0 && visitTime.Length == 0)
                    {
                        visitedtime = visitMode;
                    }
                    sbTbl.Append("<tr>");
                    //if (string.IsNullOrEmpty(surName))
                    //{
                    sbTbl.Append("<td style='width:20%;' id='regionName_" + i.ToString() + "'>" + regionname + "</td>");

                    if ((docCode != null) && (docCode != ""))
                    {
                        sbTbl.Append("<td style='width:20%;' id='accdocName_" + i.ToString() + "'>" + chemistName + "</td>");
                        //  sbTbl.Append("<td style='width:25%;' id='accdocName_'><span onclick='fnDoctor360Popup(\"" + docCode + "\")' style='text-decoration:underline;cursor:pointer;'>" + chemistName + "</span></td>");//Added by ramya for Doctor360Popup
                    }
                    else
                    {
                        sbTbl.Append("<td style='width:20%;' id='accdocName_" + i.ToString() + "'>" + chemistName + "</td>");
                    }
                    //}
                    //else
                    //{
                    //    sbTbl.Append("<td id='accdocName_" + i.ToString() + "'>" + doctorName + "-" + surName + "</td>");//Doctor Name
                    //}

                    sbTbl.Append("<td style='width:10%;' id='accdocMDL_" + i.ToString() + "'>" + mdlNumber + "</td>");
                    sbTbl.Append("<td style='width:20%;'>" + visitedtime.Trim() + "</td>");
                    //sbTbl.Append("<td style='width:10%;'>" + visitMode + "</td>");
                    if (Convert.ToInt32(dr["Acc_Visit_Count"]) > 0)
                    {
                        sbTbl.Append("<td style='width:10%;'>YES </td>");
                        //  count++;
                        //  sbTbl.Append("<td><div style='display:none;' id='divDocAccDetails_" + count + "'>" + dr["DCR_Actual_Date"] + "$" + dr["DCR_Visit_Code"] + "$" + dr["MDL_Number"] + "$" + dr["Doctor_Name"] + "$" + dr["Category_Name"] + "</div><a href='#' onclick='fnGetDoctorAccompanist(\"" + count + "\");'> YES </a></td>");
                    }
                    else
                        sbTbl.Append("<td style='width:10%;'>NO</td>");
                    //sbTbl.Append("<td class='td-a' onclick='fnShowDetailedProducts(\"" + i.ToString() + "\",\"" + docCode + "\",\"" + type + "\");'>View</td>");
                    sbTbl.Append("<td style='width:10%;text-align: right;'>" + po_Amount + "</td>");
                    sbTbl.Append("<td style='width:10%;'>" + remarks + "</td>");
                    sbTbl.Append("<td style='width:10%;'>" + CategoryName + "</td>");
                    sbTbl.Append("</tr>");
                    i++;
                }
                sbTbl.Append("</tbody></table>");
            }
            return sbTbl.ToString();
        }
        // Sample Promotion ///////////////////////////////
        private string BindSamplePromotionProductDetails(DataTable dt)
        {
            StringBuilder sbTbl = new StringBuilder();
            if (dt != null && dt.Rows.Count > 0)
            {
                sbTbl.Append("<div class='gridHeader'><h3 style='margin: 0px auto;background:lightseagreen;'>" + CHEMIST_CAPTION + " Sample / Promotional item Details</h3></div>");
                sbTbl.Append("<table id='tblCVProducts'  class='data display dataTable box'><thead><th>" + CHEMIST_CAPTION + " Region</th><th>" + CHEMIST_CAPTION + "</th><th>Sample/Promotional item name</th><th>Batch Number</th><th>Qty given</th><th>Brand</th></thead>");
                sbTbl.Append("<tbody>");
                List<string> chename = new List<string>();
                List<string> regname = new List<string>();
                int match, matchdoc, i = 0;
                foreach (DataRow dr in dt.Rows)
                {
                    string regionname = dr["Region_Name"] == System.DBNull.Value ? "" : dr["Region_Name"].ToString();
                    string chemistName = dr["Chemists_Name"] == System.DBNull.Value ? "" : dr["Chemists_Name"].ToString();
                    string productName = dr["Product_Name"] == System.DBNull.Value ? "" : dr["Product_Name"].ToString();
                    string BatchNumber = dr["Batch_Number"] == System.DBNull.Value ? "" : dr["Batch_Number"].ToString();
                    string quantityProvided = dr["Quantity_Provided"] == System.DBNull.Value ? "" : dr["Quantity_Provided"].ToString();
                    //      string currentStcok = dr["Current_Stock"] == System.DBNull.Value ? "" : dr["Current_Stock"].ToString();
                    string Brand = dr["Brand_Name"] == System.DBNull.Value ? "" : dr["Brand_Name"].ToString();
                    // string detailed = dr["Detailed"] == System.DBNull.Value ? "" : dr["Detailed"].ToString();


                    sbTbl.Append("<tr>");
                    match = Array.IndexOf(regname.ToArray(), regionname.Trim());
                    matchdoc = Array.IndexOf(chename.ToArray(), chemistName.Trim());
                    if (i != 0)
                    {
                        if (match == -1)
                        {
                            regname.Add(regionname.Trim());
                        }
                        if (matchdoc == -1)
                        {
                            chename.Add(chemistName.Trim());

                        }
                    }
                    sbTbl.Append("<tr>");
                    if (i == 0)
                    {
                        regname.Add(regionname.Trim());
                        sbTbl.Append("<td>" + regionname + "</td>");
                    }
                    else if (match != -1)
                    {
                        if (matchdoc == -1)
                        {
                            sbTbl.Append("<td>" + regionname + "</td>");
                        }
                        else
                        {
                            sbTbl.Append("<td></td>");
                        }
                    }
                    else
                    {
                        sbTbl.Append("<td>" + regionname + "</td>");
                    }
                    if (i == 0)
                    {
                        chename.Add(chemistName.Trim());
                        sbTbl.Append("<td>" + chemistName + "</td>");
                    }
                    else if (matchdoc != -1)
                    {
                        if (match == -1)
                        {
                            sbTbl.Append("<td>" + chemistName + "</td>");
                        }
                        else
                        {
                            sbTbl.Append("<td></td>");
                        }
                    }
                    else
                    {
                        sbTbl.Append("<td>" + chemistName + "</td>");
                    }
                    sbTbl.Append("<td>" + productName + "</td>");
                    sbTbl.Append("<td>" + BatchNumber + "</td>");
                    sbTbl.Append("<td>" + quantityProvided + "</td>");
                    //      sbTbl.Append("<td>" + currentStcok + "</td>");
                    sbTbl.Append("<td>" + Brand + "</td>");
                    //   sbTbl.Append("<td style='display:none'>" + detailed + "</td>");

                    sbTbl.Append("</tr>");
                    i++;
                }
                sbTbl.Append("</tbody></table>");
            }
            return sbTbl.ToString();
        }
        // Detailed Products/////////////////////////
        private string BindChemistDetaildProductDetails(DataTable dt)
        {
            StringBuilder sbTbl = new StringBuilder();
            if (dt != null && dt.Rows.Count > 0)
            {
                sbTbl.Append("<div class='gridHeader'><h3 style='margin: 0px auto; background:lightseagreen;'>" + CHEMIST_CAPTION + " Detailed Products</h3></div>");
                sbTbl.Append("<table id='tblChemistProducts'  class='data display dataTable box'><thead><th>" + CHEMIST_CAPTION + " Region</th><th>" + CHEMIST_CAPTION + " Name</th><th>Detailed Product Name</th><th>Brand Name</th></thead>");
                sbTbl.Append("<tbody>");
                List<string> chename = new List<string>();
                List<string> regname = new List<string>();
                int match, matchdoc, i = 0;
                foreach (DataRow dr in dt.Rows)
                {
                    string chemistName = dr["Chemists_Name"] == System.DBNull.Value ? "" : dr["Chemists_Name"].ToString();
                    string regionname = dr["Region_Name"] == System.DBNull.Value ? "" : dr["Region_Name"].ToString();
                    string salesproductName = dr["Sales_Product_Name"] == System.DBNull.Value ? "" : dr["Sales_Product_Name"].ToString();
                    // string Batchnumber = dr["Batch_Number"] == System.DBNull.Value ? "" : dr["Batch_Number"].ToString();
                    // string productTypeName = dr["Product_Type_Name"] == System.DBNull.Value ? "" : dr["Product_Type_Name"].ToString();
                    string BrandName = dr["Brand_Name"] == System.DBNull.Value ? "" : dr["Brand_Name"].ToString();


                    match = Array.IndexOf(regname.ToArray(), regionname.Trim());
                    matchdoc = Array.IndexOf(chename.ToArray(), chemistName.Trim());
                    if (i != 0)
                    {
                        if (match == -1)
                        {
                            regname.Add(regionname.Trim());
                        }
                        if (matchdoc == -1)
                        {
                            chename.Add(chemistName.Trim());

                        }
                    }
                    sbTbl.Append("<tr>");
                    if (i == 0)
                    {
                        regname.Add(regionname.Trim());
                        sbTbl.Append("<td>" + regionname + "</td>");
                    }
                    else if (match != -1)
                    {
                        if (matchdoc == -1)
                        {
                            sbTbl.Append("<td>" + regionname + "</td>");
                        }
                        else
                        {
                            sbTbl.Append("<td></td>");
                        }
                    }
                    else
                    {
                        sbTbl.Append("<td>" + regionname + "</td>");
                    }
                    if (i == 0)
                    {
                        chename.Add(chemistName.Trim());
                        sbTbl.Append("<td>" + chemistName + "</td>");
                    }
                    else if (matchdoc != -1)
                    {
                        if (match == -1)
                        {
                            sbTbl.Append("<td>" + chemistName + "</td>");
                        }
                        else
                        {
                            sbTbl.Append("<td></td>");
                        }
                    }
                    else
                    {
                        sbTbl.Append("<td>" + chemistName + "</td>");
                    }

                    sbTbl.Append("<td>" + salesproductName + "</td>");
                    // sbTbl.Append("<td>" + productTypeName + "</td>");
                    sbTbl.Append("<td>" + BrandName + "</td>");
                    sbTbl.Append("</tr>");
                    i++;
                }
                sbTbl.Append("</tbody></table>");
            }
            return sbTbl.ToString();
        }
        //RCPA Details ///////////////////////////////
        //   private string BindChemistVisitRCPADetails(DataTable dt)
        //     {
        //     StringBuilder sbTbl = new StringBuilder();



        //if (dt != null && dt.Rows != null && dt.Rows.Count > 0)
        //{

        //   sbTbl.Append("<div class='gridHeader'><h3 style='margin: 0px auto;background:lightseagreen;'>" + CHEMIST_CAPTION + "  RCPA Details</h3> </div>");
        //   sbTbl.Append("<table id='tblCVRCPA'  class='data display dataTable box'><thead><th>" + CHEMIST_CAPTION + " Name</th><th>" + DOCTOR_CAPTION + " Name</th><th>My Product Name</th><th>My Product Quantity</th><th>Competitor Product Name</th><th>Competitor Product Qty</th></thead>");
        //  sbTbl.Append("<tbody>");



        //    if (dtDoctorlist.Rows != null && dtDoctorlist.Rows.Count > 0)
        //    {
        //        foreach (DataRow doctorlist in dtDoctorlist.Rows)
        //        {
        //            if (!string.IsNullOrEmpty(Convert.ToString(doctorlist["Chemists_Name"])))
        //            {
        //                //Get doctor and His details
        //                drdoctorlist = dt.AsEnumerable().Where(a => Convert.ToString(a["Chemists_Name"]) == Convert.ToString(doctorlist["Chemists_Name"])).OrderBy(a => a["Customer_Name"].ToString()).CopyToDataTable();
        //                if (drdoctorlist.Rows.Count > 0)
        //                {
        //                    DataRow drdoctor = drdoctorlist.AsEnumerable().Where(own => Convert.ToString(own["Chemists_Name"]) != "").FirstOrDefault();
        //                    string chemistName = (drdoctor["Chemists_Name"] == System.DBNull.Value) ? "" : drdoctor["Chemists_Name"].ToString();
        //                    string doctorName = (drdoctor["Customer_Name"] == System.DBNull.Value) ? "" : drdoctor["Customer_Name"].ToString();
        //                    //  string surName = (drdoctor["Sur_Name"] == System.DBNull.Value) ? "" : drdoctor["Sur_Name"].ToString();
        //                    //string chemistName = (drdoctor["Chemists_Name"] == System.DBNull.Value) ? "" : drdoctor["Chemists_Name"].ToString();

        //                    sbTbl.Append("<tr>");

        //                    //sbTbl.Append("<td>" + chemistName + "</td>");//Chemist Name

        //                    //Get own product and its competitor product

        //                    int chemistcount = 0;
        //                    distproductcode = drdoctorlist.DefaultView.ToTable(true, "Product_Code");
        //                    distChemisName = drdoctorlist.DefaultView.ToTable(true, "Chemists_Name");

        //                    foreach (DataRow chem in distChemisName.Rows)
        //                    {
        //                        ChemistsName = drdoctorlist.AsEnumerable().Where(a => Convert.ToString(a["Chemists_Name"]) == Convert.ToString(chem["Chemists_Name"])).ToArray();
        //                        if (ChemistsName.Length > 0)
        //                        {
        //                            DataRow drChem = ChemistsName.AsEnumerable().Where(own => Convert.ToString(own["Chemists_Name"]) != "").FirstOrDefault();
        //                            string chname = drChem["Chemists_Name"] == System.DBNull.Value ? "" : drChem["Chemists_Name"].ToString();
        //                            if (chemistcount > 0)
        //                            {
        //                                sbTbl.Append("<td></td>");
        //                                sbTbl.Append("<td>" + chname + "</td>"); // 1st append
        //                            }
        //                            else
        //                            {
        //                                sbTbl.Append("<td>" + chname + "</td>");
        //                            }

        //                            ownproductCount = 0;
        //                            List<string> doc = new List<string>();
        //                            foreach (DataRow dcrProductcode in distproductcode.Rows)
        //                            {
        //                                int compRowcount = 0;

        //                                drOwnandcompetitorproducts = ChemistsName.AsEnumerable().Where(a => Convert.ToString(a["Product_Code"]) == Convert.ToString(dcrProductcode["Product_Code"])).ToArray();
        //                                var doc_Dis = 0;
        //                                if (drOwnandcompetitorproducts.Length > 0)
        //                                {
        //                                    //Create Own product details
        //                                    DataRow drOwnProduct = drOwnandcompetitorproducts.AsEnumerable().Where(own => Convert.ToString(own["Product_Code"]) != "").FirstOrDefault();
        //                                    doctorName = drOwnProduct["Customer_Name"].ToString();
        //                                    if (!doc.Contains(doctorName))
        //                                    {
        //                                        doc.Add(doctorName);
        //                                        if (doctorName != "")
        //                                        {
        //                                            doc_Dis = 1;
        //                                            if (ownproductCount == 0)
        //                                            {
        //                                                sbTbl.Append("<td>" + doctorName + "</td>");//Doctor Name

        //                                            }
        //                                        }
        //                                        else
        //                                        {
        //                                            sbTbl.Append("<td></td>");
        //                                        }
        //                                    }

        //                                    DataRow drCompProduct = drOwnandcompetitorproducts.AsEnumerable().Where(own => Convert.ToString(own["Competitor_Product_Name"]) != "").FirstOrDefault();
        //                                    string productName = drOwnProduct["Product_Name"] == System.DBNull.Value ? "" : drOwnProduct["Product_Name"].ToString();
        //                                    string ownProductQty = drOwnProduct["Qty"] == System.DBNull.Value ? "" : drOwnProduct["Qty"].ToString();

        //                                    if (ownproductCount > 0)
        //                                    {
        //                                        //sbTbl.Append("<tr></tr>");
        //                                        sbTbl.Append("<tr>");
        //                                        sbTbl.Append("<td></td>");//Chemist Name
        //                                        if (doc_Dis == 1)
        //                                            sbTbl.Append("<td>" + doctorName + "</td>");//Doctor Name
        //                                        else
        //                                            sbTbl.Append("<td></td>");

        //                                        sbTbl.Append("<td>" + productName + "</td>");//My product Name
        //                                        sbTbl.Append("<td>" + ownProductQty + "</td>");//My Product quanity                              
        //                                    }
        //                                    else
        //                                    {
        //                                        sbTbl.Append("<td>" + productName + "</td>");//My product Name                 // 2nd Append
        //                                        sbTbl.Append("<td>" + ownProductQty + "</td>");//My Product quanity              // 3rd append
        //                                    }
        //                                    ownproductCount++;
        //                                    //To create competitor Product
        //                                    foreach (DataRow dr in drOwnandcompetitorproducts)
        //                                    {
        //                                        // if (string.IsNullOrEmpty(Convert.ToString(dr["Competitor_Product_Code"])))
        //                                        // {
        //                                        string competitorProductName = dr["Competitor_Product_Name"] == System.DBNull.Value ? "" : dr["Competitor_Product_Name"].ToString();
        //                                        string competitorqty = (dr["Comp_Qty"] == System.DBNull.Value) ? "" : dr["Comp_Qty"].ToString();
        //                                        if (compRowcount > 0)
        //                                        {
        //                                            sbTbl.Append("<tr>");
        //                                            sbTbl.Append("<td></td>"); // Doctor Name
        //                                            sbTbl.Append("<td></td>");//Chemist Name
        //                                            sbTbl.Append("<td></td>");//My Product Name
        //                                            sbTbl.Append("<td></td>"); // My product qty
        //                                            sbTbl.Append("<td>" + competitorProductName + "</td>"); // Competitor Product name
        //                                            sbTbl.Append("<td>" + competitorqty + "</td>");//Competitor Product Quantity 
        //                                            sbTbl.Append("</tr>");
        //                                        }
        //                                        else
        //                                        {
        //                                            sbTbl.Append("<td>" + competitorProductName + "</td>"); // Competitor Product name
        //                                            sbTbl.Append("<td>" + competitorqty + "</td>");//Competitor Product Quantity 
        //                                            sbTbl.Append("</tr>");
        //                                        }
        //                                        compRowcount++;
        //                                        //  }
        //                                    }
        //                                    if (drCompProduct == null)
        //                                    {
        //                                        sbTbl.Append("<td></td>");//Competitor product Name
        //                                        sbTbl.Append("<td></td>");//Competitor Produt qty
        //                                        sbTbl.Append("</tr>");
        //                                    }
        //                                }
        //                            }
        //                        }
        //                        chemistcount++;
        //                    }
        //                }

        //            }
        //            distChemisName.Clear();
        //        }

        //}
        // else
        // {
        //    sbTbl.Append("No RCPA details found.");
        // }
        // }

        //    sbTbl.Append("</tbody></table>");
        //    return sbTbl.ToString();
        //}      
        private string BindChemistVisitRCPADetails(DataTable dt)
        {
            StringBuilder sbTbl = new StringBuilder();
            CurrentInfo objCurrentinfo = new CurrentInfo();

            if (dt != null && dt.Rows.Count > 0)
            {

                DAL_DoctorVisit objDocVisit = new DAL_DoctorVisit();

                sbTbl.Append("<div class='gridHeader'><h3 style='margin: 0px auto;background:lightseagreen;'>" + CHEMIST_CAPTION + "  RCPA Details</h3> </div>");
                sbTbl.Append("<table id='tblCVRCPA'  class='data display dataTable box'><thead><th>" + CHEMIST_CAPTION + " Name</th><th>" + DOCTOR_CAPTION + " Name</th><th>My Product Name</th><th>My Product Quantity</th><th>Product Remarks</th><th>Rx Number</th><th>Competitor Product Name</th><th>Competitor Product Qty</th></thead>");
                sbTbl.Append("<tbody>");

                List<string> chemname = new List<string>();
                List<string> custname = new List<string>();
                List<string> prodname = new List<string>();
                List<string> prodqty = new List<string>();
                //List<string> remarks = new List<string>();
                //List<int> rxnumber = new List<int>();
                int matchchem, matchcust, matchprod, matchqty, i = 0;
                foreach (DataRow dr in dt.Rows)
                {
                    string Chemistname = dr["Chemists_Name"] == System.DBNull.Value ? "" : dr["Chemists_Name"].ToString();
                    string customername = dr["Customer_Name"] == System.DBNull.Value ? "" : dr["Customer_Name"].ToString();
                    string productName = dr["Product_Name"] == System.DBNull.Value ? "" : dr["Product_Name"].ToString();
                    string productqty = dr["Qty"] == System.DBNull.Value ? "" : dr["Qty"].ToString();
                    //string Remarks = dr["Product_Remarks"] == System.DBNull.Value ? "" : dr["Product_Remarks"].ToString();
                    //string RxNumber = dr["RxNumber"] == System.DBNull.Value ? "" : dr["RxNumber"].ToString();

                    matchchem = Array.IndexOf(chemname.ToArray(), Chemistname.Trim());
                    matchcust = Array.IndexOf(custname.ToArray(), customername.Trim());
                    matchprod = Array.IndexOf(prodname.ToArray(), productName.Trim());
                    matchqty = Array.IndexOf(prodqty.ToArray(), productqty.Trim());
                    //matchremarks = Array.IndexOf(remarks.ToArray(), Remarks.Trim());
                    //matchrxnumber = Array.IndexOf(rxnumber.ToArray(), RxNumber.Trim());
                    if (i != 0)
                    {
                        if (matchchem == -1)
                        {
                            chemname.Add(Chemistname.Trim());
                        }
                        if (matchcust == -1)
                        {
                            custname.Add(customername.Trim());

                        }
                        if (matchcust == -1)
                        {
                            prodname.Clear();
                        }
                        if (matchprod == -1)
                        {
                            prodname.Add(productName.Trim());

                        }
                    }
                    sbTbl.Append("<tr>");
                    if (i == 0)
                    {
                        chemname.Add(Chemistname.Trim());
                        sbTbl.Append("<td>" + Chemistname + "</td>");
                    }
                    else if (matchchem != -1)
                    {
                        if (matchcust == -1)
                        {
                            sbTbl.Append("<td>" + Chemistname + "</td>");
                        }
                        else
                        {
                            sbTbl.Append("<td></td>");
                        }
                    }
                    else
                    {
                        sbTbl.Append("<td>" + Chemistname + "</td>");
                    }
                    if (i == 0)
                    {
                        custname.Add(customername.Trim());
                        sbTbl.Append("<td>" + customername + "</td>");
                    }
                    else if (matchcust != -1)
                    {
                        if (matchchem == -1)
                        {
                            sbTbl.Append("<td>" + customername + "</td>");
                        }
                        else
                        {
                            sbTbl.Append("<td></td>");
                        }
                    }
                    else
                    {
                        sbTbl.Append("<td>" + customername + "</td>");
                    }
                    if (i == 0)
                    {
                        prodname.Add(productName.Trim());
                        sbTbl.Append("<td>" + productName + "</td>");
                    }
                    else if (matchprod != -1)
                    {
                        if (matchchem == -1 || matchcust == -1)
                        {
                            sbTbl.Append("<td>" + productName + "</td>");
                        }
                        else
                        {
                            sbTbl.Append("<td></td>");
                        }
                    }
                    else
                    {
                        sbTbl.Append("<td>" + productName + "</td>");
                    }

                    if (i == 0)
                    {
                        prodqty.Add(productqty.Trim());
                        sbTbl.Append("<td>" + productqty + "</td>");
                    }
                    else if (matchchem != -1)
                    {
                        if (matchcust == -1 || matchprod == -1)
                        {
                            sbTbl.Append("<td>" + productqty + "</td>");

                        }
                        else
                        {
                            sbTbl.Append("<td></td>");
                        }
                    }
                    else
                    {
                        sbTbl.Append("<td>" + productqty + "</td>");
                    }
                    sbTbl.Append("<td>" + (dr["Product_Remarks"] == System.DBNull.Value ? "" : dr["Product_Remarks"].ToString()) + "</td>");
                    sbTbl.Append("<td>" + (dr["RxNumber"] == System.DBNull.Value ? "" : dr["RxNumber"].ToString()) + "</td>");
                    sbTbl.Append("<td>" + (dr["Competitor_Product_Name"] == System.DBNull.Value ? "" : dr["Competitor_Product_Name"].ToString()) + "</td>");
                    sbTbl.Append("<td>" + (dr["Comp_Qty"] == System.DBNull.Value ? "" : dr["Comp_Qty"].ToString()) + "</td>");



                    sbTbl.Append("</tr>");
                    i++;
                }
                sbTbl.Append("</tbody></table>");
            }
            return sbTbl.ToString();
        }
        //POB details/////////////////////////
        private string BindChemistVisitPOBDetails(DataTable dt)
        {
            StringBuilder sbTbl = new StringBuilder();
            if (dt != null && dt.Rows.Count > 0)
            {
                bool statusTemp = false;
                sbTbl.Append("<div class= 'gridHeader'><h3 style='width:100%;margin:0px auto;background:lightseagreen;'>" + CHEMIST_CAPTION + " Purchase Order Booking </h3></div>");
                sbTbl.Append("<table id='tblCVPobOrders' style='width:100%' class='data display box'><thead><th>" + CHEMIST_CAPTION + " Region</th><th>" + CHEMIST_CAPTION + " Name</th><th>" + STOCKIEST_CAPTION + " Name</th><th>Order Number</th><th>Order Due Date</th><th>No Of Products</th><th>Total Value</th></thead>");
                sbTbl.Append("<tbody>");
                List<string> chename = new List<string>();
                List<string> regname = new List<string>();
                int match, matchdoc, i = 0;
                foreach (DataRow dr in dt.Rows)
                {
                    string chemistName = dr["Customer_Name"] == System.DBNull.Value ? "" : dr["Customer_Name"].ToString();
                    string regionname = dr["Region_Name"] == System.DBNull.Value ? "" : dr["Region_Name"].ToString();
                    match = Array.IndexOf(regname.ToArray(), regionname.Trim());
                    matchdoc = Array.IndexOf(chename.ToArray(), chemistName.Trim());
                    if (i != 0)
                    {
                        if (match == -1)
                        {
                            regname.Add(regionname.Trim());
                        }
                        if (matchdoc == -1)
                        {
                            chename.Add(chemistName.Trim());

                        }
                    }
                    sbTbl.Append("<tr>");
                    if (i == 0)
                    {
                        regname.Add(regionname.Trim());
                        sbTbl.Append("<td style='width:20%;'>" + regionname + "</td>");
                    }
                    else if (match != -1)
                    {
                        if (matchdoc == -1)
                        {
                            sbTbl.Append("<td style='width:20%;'>" + regionname + "</td>");
                        }
                        else
                        {
                            sbTbl.Append("<td></td>");
                        }
                    }
                    else
                    {
                        sbTbl.Append("<td style='width:20%;'>" + regionname + "</td>");
                    }
                    if (i == 0)
                    {
                        chename.Add(chemistName.Trim());
                        sbTbl.Append("<td style='width:20%;'>" + chemistName + "</td>");
                    }
                    else if (matchdoc != -1)
                    {
                        if (match == -1)
                        {
                            sbTbl.Append("<td style='width:20%;'>" + chemistName + "</td>");
                        }
                        else
                        {
                            sbTbl.Append("<td></td>");
                        }
                    }
                    else
                    {
                        sbTbl.Append("<td style='width:20%;'>" + chemistName + "</td>");
                    }

                    sbTbl.Append("<td style='width:20%;'>" + dr["Stockist_Name"].ToString() + "</td>");
                    sbTbl.Append("<td style='width:10%;'><a href='javascript:fnGetPOBProductDetailsforReport(" + dr["Order_Id"].ToString() + ");' class='btnEditOrder'>" + dr["Order_Number"].ToString() + "</a></td>");
                    //     sbTbl.Append("<td style='width:10%;text-decoration:underline;cursor:pointer;'><a href='javascript:fnGetPOBProductDetailsforReport(" + dr["Order_Id"].ToString() + ");' class='btnEditOrder'>" + dr["Order_Number"].ToString() + "</a></td>");
                    sbTbl.Append("<td style='width:10%;'>" + dr["Order_Due_Date"].ToString() + "</td>");
                    sbTbl.Append("<td style='width:10%;text-align: right;'>" + dr["No_Of_Products"].ToString() + "</td>");
                    sbTbl.Append("<td style='width:10%;text-align: right;'>" + dr["Total_POB_Value"].ToString() + "</td>");
                    sbTbl.Append("</tr>");

                    if (Convert.ToInt32(dr["Order_Status"].ToString()) == 3)
                    {
                        statusTemp = true;
                    }
                    i++;
                }
                //if (statusTemp)
                //{
                //    sbTbl.Append("<tr><td colspan='5' style='font-size:11px;'>T : Temporary/Drafted Order Number.</td></tr>");
                //}

                sbTbl.Append("</tbody></table>");
            }
            return sbTbl.ToString();
        }
        // Follow Ups
        private string BindChemistVisitFollowUps(DataTable dt)
        {
            StringBuilder sbTbl = new StringBuilder();
            if (dt != null && dt.Rows.Count > 0)
            {
                sbTbl.Append("<div class='gridHeader'><h3 style='margin: 0px auto;background:lightseagreen;'>" + CHEMIST_CAPTION + " Follow Ups</h3></div>");
                sbTbl.Append("<table id='tblCVFollowUps' style='width:100%' class='data display dataTable box'><thead><th>" + CHEMIST_CAPTION + " Region</th><th>" + CHEMIST_CAPTION + "</th><th>Tasks</th><th>Due Date</th></thead>");
                sbTbl.Append("<tbody>");
                List<string> chename = new List<string>();
                List<string> regname = new List<string>();
                int match, matchdoc, i = 0;
                foreach (DataRow dr in dt.Rows)
                {
                    string regionname = dr["Region_Name"] == System.DBNull.Value ? "" : dr["Region_Name"].ToString();
                    string chemistName = dr["Chemists_Name"] == null ? "" : dr["Chemists_Name"].ToString();
                    string mdlNo = dr["MDL_Number"] == null ? "" : dr["MDL_Number"].ToString();
                    string tasks = dr["Tasks"] == null ? "" : dr["Tasks"].ToString();
                    string dueDate = dr["Due_Date"] == null ? "" : dr["Due_Date"].ToString();
                    //string dcrActualDate = dr["DCR_Actual_Date"] == null ? "" : dr["DCR_Actual_Date"].ToString();
                    string updatedDateTime = dr["Updated_Date_Time"] == null ? "" : dr["Updated_Date_Time"].ToString();
                    match = Array.IndexOf(regname.ToArray(), regionname.Trim());
                    matchdoc = Array.IndexOf(chename.ToArray(), chemistName.Trim());
                    if (i != 0)
                    {
                        if (match == -1)
                        {
                            regname.Add(regionname.Trim());
                        }
                        if (matchdoc == -1)
                        {
                            chename.Add(chemistName.Trim());

                        }
                    }
                    sbTbl.Append("<tr>");
                    if (i == 0)
                    {
                        regname.Add(regionname.Trim());
                        sbTbl.Append("<td style='width:20%;'>" + regionname + "</td>");
                    }
                    else if (match != -1)
                    {
                        if (matchdoc == -1)
                        {
                            sbTbl.Append("<td style='width:20%;'>" + regionname + "</td>");
                        }
                        else
                        {
                            sbTbl.Append("<td></td>");
                        }
                    }
                    else
                    {
                        sbTbl.Append("<td style='width:20%;'>" + regionname + "</td>");
                    }
                    if (i == 0)
                    {
                        chename.Add(chemistName.Trim());
                        sbTbl.Append("<td style='width:20%;'>" + chemistName + "</td>");
                    }
                    else if (matchdoc != -1)
                    {
                        if (match == -1)
                        {
                            sbTbl.Append("<td style='width:20%;'>" + chemistName + "</td>");
                        }
                        else
                        {
                            sbTbl.Append("<td></td>");
                        }
                    }
                    else
                    {
                        sbTbl.Append("<td style='width:20%;'>" + chemistName + "</td>");
                    }
                    //sbTbl.Append("<td style='width:15%;'>" + mdlNo + "</td>");
                    sbTbl.Append("<td style='width:20%;'>" + tasks + "</td>");
                    sbTbl.Append("<td style='width:20%;'>" + dueDate + "</td>");
                    //sbTbl.Append("<td>" + dcrActualDate + "</td>");
                    //sbTbl.Append("<td style='width:20%;'>" + updatedDateTime + "</td>");
                    sbTbl.Append("</tr>");
                    i++;
                }
                sbTbl.Append("</tbody></table>");
            }
            return sbTbl.ToString();
        }
        // Attchments Add and Download
        private string BindChemistVisitAttachments(DataTable dt)
        {
            StringBuilder sbTbl = new StringBuilder();
            if (dt != null && dt.Rows.Count > 0)
            {
                sbTbl.Append("<div class='gridHeader'><h3 style='margin: 0px auto;background:lightseagreen;'>" + CHEMIST_CAPTION + " Attachments</h3></div>");
                sbTbl.Append("<table id='tblCVAttachments' style='width:100%' class='data display dataTable box'><thead><th>" + CHEMIST_CAPTION + " Region</th><th>" + CHEMIST_CAPTION + "</th><th>Attachement File name (click on the file to download locally)</th><th>Updated DateTime</th><th>Status </th></thead>");
                sbTbl.Append("<tbody>");
                List<string> chename = new List<string>();
                List<string> regname = new List<string>();
                int match, matchdoc, i = 0;
                foreach (DataRow dr in dt.Rows)
                {
                    string regionname = dr["Region_Name"] == System.DBNull.Value ? "" : dr["Region_Name"].ToString();
                    string chemistName = dr["Chemists_Name"] == null ? "" : dr["Chemists_Name"].ToString();
                    // string mdlNo = dr["MDL_Number"] == null ? "" : dr["MDL_Number"].ToString();
                    string bloburl = dr["Blob_Url"] == null ? "" : dr["Blob_Url"].ToString();
                    string uploadFileName = dr["Uploaded_File_Name"] == null ? "" : dr["Uploaded_File_Name"].ToString();
                    string updatedDateTime = dr["Updated_Date_Time"] == null ? "" : dr["Updated_Date_Time"].ToString();
                    match = Array.IndexOf(regname.ToArray(), regionname.Trim());
                    matchdoc = Array.IndexOf(chename.ToArray(), chemistName.Trim());
                    if (i != 0)
                    {
                        if (match == -1)
                        {
                            regname.Add(regionname.Trim());
                        }
                        if (matchdoc == -1)
                        {
                            chename.Add(chemistName.Trim());

                        }
                    }
                    sbTbl.Append("<tr>");
                    if (i == 0)
                    {
                        regname.Add(regionname.Trim());
                        sbTbl.Append("<td style='width:20%;'>" + regionname + "</td>");
                    }
                    else if (match != -1)
                    {
                        if (matchdoc == -1)
                        {
                            sbTbl.Append("<td style='width:20%;'>" + regionname + "</td>");
                        }
                        else
                        {
                            sbTbl.Append("<td></td>");
                        }
                    }
                    else
                    {
                        sbTbl.Append("<td style='width:20%;'>" + regionname + "</td>");
                    }
                    if (i == 0)
                    {
                        chename.Add(chemistName.Trim());
                        sbTbl.Append("<td style='width:20%;'>" + chemistName + "</td>");
                    }
                    else if (matchdoc != -1)
                    {
                        if (match == -1)
                        {
                            sbTbl.Append("<td style='width:20%;'>" + chemistName + "</td>");
                        }
                        else
                        {
                            sbTbl.Append("<td></td>");
                        }
                    }
                    else
                    {
                        sbTbl.Append("<td style='width:20%;'>" + chemistName + "</td>");
                    }
                    //sbTbl.Append("<td style='width:10%;'>" + mdlNo + "</td>");
                    if (bloburl == "")
                    {
                        sbTbl.Append("<td style='width:40%;'>" + uploadFileName + "</td>");
                    }
                    else
                    {
                        sbTbl.Append("<td style='width:40%;'><a href='" + bloburl + "'>" + uploadFileName + "</td>");
                    }
                    sbTbl.Append("<td style='width:15%;'>" + updatedDateTime + "</td>");
                    if (bloburl == null || bloburl == "")
                    {
                        sbTbl.Append("<td style='width:10%;'>" + "Yet to upload" + "</td>");
                    }
                    else
                    {
                        sbTbl.Append("<td style='width:10%;'>" + "Attached" + "</td>");
                    }
                    sbTbl.Append("</tr>");
                    i++;
                }
                sbTbl.Append("</tbody></table>");
            }
            return sbTbl.ToString();
        }
        #endregion
        //summary 
        public string GetSummaryCount(string User_Code, string Actual_Date, int Month, int Year)
        {
            SPData _objSP = new SPData();
            DataSet ds = new DataSet();
            ds = _objSP.GetSummaryCount(User_Code, Actual_Date, Month, Year);
            StringBuilder stb = new StringBuilder();
            stb = GetDCRSummaryCountHtml(ds);
            return stb.ToString();
        }
        public JsonResult GetPOBSummaryCount(string User_Code, DateTime Actual_Date)
        {
            DataControl.HiDoctor_ReportsFactoryClasses.DAL_DLReports objReport = new DataControl.HiDoctor_ReportsFactoryClasses.DAL_DLReports();
            CurrentInfo objCurrentInfo = new CurrentInfo();
            List<MVCModels.POBReportCount> lspobCount = objReport.GetPOBSummaryCount(User_Code, Actual_Date, objCurrentInfo.GetCompanyCode());
            return Json(lspobCount);
        }
        public StringBuilder GetDCRSummaryCountHtml(DataSet ds)
        {
            GetPrivillegeValue();
            StringBuilder sbTbl = new StringBuilder();

            sbTbl.Append("<div class='gridHeader'><h3 style='margin: 0px auto;background: grey;'>Summary Details</h3></div>");
            sbTbl.Append("<table id='tblSummaryCount' class='data display dataTable box'><thead><th></th><th> " + DOCTOR_CAPTION + " </th><th> " + CHEMIST_CAPTION + " </th><th> " + STOCKIEST_CAPTION + " </th></thead>");
            sbTbl.Append("<tbody>");

            sbTbl.Append("<tr>");
            sbTbl.Append("<td style='font-weight:bold;'>" + sdate + "  Visit Count (for the day)</td>");
            sbTbl.Append("<td style='text-align: right;'>" + ds.Tables[0].Rows[0]["DayDoctorCount"] + "</td>");
            sbTbl.Append("<td style='text-align: right;'>" + ds.Tables[0].Rows[0]["DayChemistCount"] + "</td>");
            sbTbl.Append("<td style='text-align: right;'>" + ds.Tables[0].Rows[0]["DayStockistCount"] + "</td>");
            sbTbl.Append("</tr>");
            sbTbl.Append("<tr>");
            sbTbl.Append("<td style='font-weight:bold;'>Met Count (for the month)</td>");
            sbTbl.Append("<td style='text-align: right;'>" + ds.Tables[2].Rows[0]["MetDoctorCount"] + "</td>");
            sbTbl.Append("<td style='text-align: right;'>" + ds.Tables[2].Rows[0]["MetChemistCount"] + "</td>");
            sbTbl.Append("<td style='text-align: right;'>" + ds.Tables[2].Rows[0]["MetStockistCount"] + "</td>");
            sbTbl.Append("</tr>");

            sbTbl.Append("<tr>");
            sbTbl.Append("<td style='font-weight:bold;'>Coverage (for the month) </td>");
            sbTbl.Append("<td style='text-align: right;'>" + ds.Tables[3].Rows[0]["CoverageDoc"] + "</td>");
            sbTbl.Append("<td style='text-align: right;'>" + ds.Tables[3].Rows[0]["CoverageChe"] + "</td>");
            sbTbl.Append("<td style='text-align: right;'>" + ds.Tables[3].Rows[0]["CoverageStoc"] + "</td>");
            sbTbl.Append("</tr>");

            sbTbl.Append("<tr>");
            sbTbl.Append("<td style='font-weight:bold;'>Visit Count (for the month)</td>");
            sbTbl.Append("<td style='text-align: right;'>" + ds.Tables[1].Rows[0]["VisitDoctorCount"] + "</td>");
            sbTbl.Append("<td style='text-align: right;'>" + ds.Tables[1].Rows[0]["VisitChemistCount"] + "</td>");
            sbTbl.Append("<td style='text-align: right;'>" + ds.Tables[1].Rows[0]["VisitStockistCount"] + "</td>");
            sbTbl.Append("</tr>");


            sbTbl.Append("<tr>");
            sbTbl.Append("<td style='font-weight:bold;'>Call Average (for the month)</td>");
            sbTbl.Append("<td style='text-align: right;'>" + ds.Tables[4].Rows[0]["CallAverageDoc"] + "</td>");
            sbTbl.Append("<td style='text-align: right;'>" + ds.Tables[4].Rows[0]["CallAverageChe"] + "</td>");
            sbTbl.Append("<td style='text-align: right;'>" + ds.Tables[4].Rows[0]["CallAverageStoc"] + "</td>");
            sbTbl.Append("</tr>");

            sbTbl.Append("</tbody></table>");
            return sbTbl;

        }
        public DataTable GroupByFromDataTable(string i_sGroupByColumn, string i_sAggregateColumn, DataTable i_dSourceTable)
        {

            DataView dv = new DataView(i_dSourceTable);

            //getting distinct values for group column
            DataTable dtGroup = dv.ToTable(true, new string[] { i_sGroupByColumn });

            //adding column for the row count
            dtGroup.Columns.Add("Count", typeof(int));

            //looping thru distinct values for the group, counting
            foreach (DataRow dr in dtGroup.Rows)
            {
                dr["Count"] = i_dSourceTable.Compute("Count(" + i_sAggregateColumn + ")", i_sGroupByColumn + " = '" + dr[i_sGroupByColumn] + "'");
            }

            //returning grouped/counted result
            return dtGroup;
        }
        //sbTbl.Append("<td><span id='spnFirstbloburl'><a href =" + dt.Rows[0]["Blob_url"] + ">Uploaded_File_Name</a></span></td>");
        public List<T> ConvertDataTable<T>(DataTable dt)
        {
            List<T> data = new List<T>();
            foreach (DataRow row in dt.Rows)
            {
                T item = GetItem<T>(row);
                data.Add(item);
            }
            return data;
        }
        public static T GetItem<T>(DataRow dr)
        {
            Type temp = typeof(T);
            T obj = Activator.CreateInstance<T>();

            foreach (DataColumn column in dr.Table.Columns)
            {
                foreach (PropertyInfo pro in temp.GetProperties())
                {
                    if (pro.Name == column.ColumnName)
                        pro.SetValue(obj, dr[column.ColumnName], null);
                    else
                        continue;
                }
            }
            return obj;
        }

        public string BindDigitalsigndata(DataTable dt, string flag)
        {
            StringBuilder sbTbl = new StringBuilder();
            List<MVCModels.DigitalSignatureModel> lstDigitalSigns = ConvertDataTable<MVCModels.DigitalSignatureModel>(dt);
            List<string> lstUniqueDoctors = lstDigitalSigns.Select(x => x.Doctor_Name).Distinct().ToList();
            if (lstUniqueDoctors != null && lstUniqueDoctors.Count() > 0)
            {

                DataTable dtNew = GroupByFromDataTable("Doctor_Name", "Doctor_Name", dt);
                sbTbl.Append("<div class='gridHeader'><h3 style='margin: 0px auto;background:#6082AD;'>Doctor Digital Signature</h3></div>");
                sbTbl.Append("<table id='tblgigitalsign' class='data display dataTable box'><thead><th>Doctor Name</th><th>Doctor</th><th>Self</th><th>Accompanist1</th><th>Accompanist2</th><th>Accompanist3</th><th>Accompanist4</th></thead>");
                sbTbl.Append("<tbody>");

                for (int i = 0; i < lstUniqueDoctors.Count; i++)
                {
                    sbTbl.Append("<tr>");
                    List<MVCModels.DigitalSignatureModel> lstDoctorwiseDetails = lstDigitalSigns.AsEnumerable().Where(x => x.Doctor_Name == lstUniqueDoctors[i]).ToList();
                    List<MVCModels.DigitalSignatureModel> lstDoctorSign = lstDoctorwiseDetails.AsEnumerable().Where(x => x.Entity_Type == "DOCTOR").ToList();
                    sbTbl.Append("<td>" + lstUniqueDoctors[i] + "</td>");
                    if (lstDoctorSign != null && lstDoctorSign.Count() > 0)
                    {
                        sbTbl.Append("<td><a href='#' id='spnDoctorsign' onclick=fnShowDigitalsig(this,\"" + lstDoctorSign[0].Blob_Url.ToString() + "\")>" + lstDoctorSign[0].Uploaded_File_Name.ToString() + "</a></td>");
                    }
                    else
                    {
                        sbTbl.Append("<td></td>");
                    }
                    List<MVCModels.DigitalSignatureModel> lstSelfSign = lstDoctorwiseDetails.AsEnumerable().Where(x => x.Entity_Type == "SELF").ToList();
                    if (lstSelfSign != null && lstSelfSign.Count() > 0)
                    {
                        sbTbl.Append("<td><a href='#' id='spnDoctorsign' onclick=fnShowDigitalsig(this,\"" + lstSelfSign[0].Blob_Url.ToString() + "\")>" + lstSelfSign[0].Uploaded_File_Name.ToString() + "</a></td>");
                    }
                    else
                    {
                        sbTbl.Append("<td></td>");
                    }
                    List<MVCModels.DigitalSignatureModel> lstAccompanistSign = lstDoctorwiseDetails.AsEnumerable().Where(x => x.Entity_Type == "ACCOMPANIST").ToList();
                    if (lstAccompanistSign != null && lstAccompanistSign.Count() > 0)
                    {
                        for (int j = 0; j < lstAccompanistSign.Count; j++)
                        {
                            if (lstAccompanistSign[j].Row_No == 1)
                            {
                                sbTbl.Append("<td><a href='#' id='spnDoctorsign' onclick=fnShowDigitalsig(this,\"" + lstAccompanistSign[j].Blob_Url.ToString() + "\")>" + lstAccompanistSign[j].Uploaded_File_Name.ToString() + "</a></td>");
                            }
                            else if (lstAccompanistSign[j].Row_No == 2)
                            {
                                sbTbl.Append("<td><a href='#' id='spnDoctorsign' onclick=fnShowDigitalsig(this,\"" + lstAccompanistSign[j].Blob_Url.ToString() + "\")>" + lstAccompanistSign[j].Uploaded_File_Name.ToString() + "</a></td>");
                            }
                            else if (lstAccompanistSign[j].Row_No == 3)
                            {
                                sbTbl.Append("<td><a href='#' id='spnDoctorsign' onclick=fnShowDigitalsig(this,\"" + lstAccompanistSign[j].Blob_Url.ToString() + "\")>" + lstAccompanistSign[j].Uploaded_File_Name.ToString() + "</a></td>");
                            }
                            else if (lstAccompanistSign[j].Row_No == 4)
                            {
                                sbTbl.Append("<td><a href='#' id='spnDoctorsign' onclick=fnShowDigitalsig(this,\"" + lstAccompanistSign[j].Blob_Url.ToString() + "\")>" + lstAccompanistSign[j].Uploaded_File_Name.ToString() + "</a></td>");
                            }
                            else
                            {
                                sbTbl.Append("<td></td>");
                            }
                        }
                    }
                    else
                    {
                        sbTbl.Append("<td></td>");
                        sbTbl.Append("<td></td>");
                        sbTbl.Append("<td></td>");
                        sbTbl.Append("<td></td>");
                    }
                    sbTbl.Append("</tr>");

                }
                sbTbl.Append("</tbody></table>");


            }
            sbTbl.Append("<div style='border-bottom: 5px solid #a52e09;margin-top: 10px;'></div>");
            return sbTbl.ToString();
        }

    }
}















//public string BindDigitalsigndata(DataTable dt, string flag)
//{
//    StringBuilder sbTbl = new StringBuilder();
//    if (dt != null && dt.Rows.Count > 0)
//    {

//        //DataTable dtNew = GroupByFromDataTable("Doctor_Name", "Doctor_Name", dt);
//        sbTbl.Append("<div class='gridHeader'><h3 style='margin: 0px auto;background:#6082AD;'>Doctor Digital Signature</h3></div>");
//        sbTbl.Append("<table id='tblgigitalsign' class='data display dataTable box'><thead><th>Doctor Name</th><th>Doctor Signature</th><th>Self</th><th>Accompanist1</th><th>Accompanist2</th><th>Accompanist3</th><th>Accompanist4</th></thead>");
//        sbTbl.Append("<tbody>");

//        var lst = dt.AsEnumerable().GroupBy(r => new { Col1 = r.Field<string>("Doctor_Name") }).Select(g => g.First()).CopyToDataTable();

//        foreach (DataRow dr1 in lst.Rows)
//        {
//            sbTbl.Append("<tr>");

//                sbTbl.Append("<td><span>" + dt.AsEnumerable().Where(a => a.Field<string>("Doctor_Name").Equals(dr1["Doctor_Name"].ToString())).FirstOrDefault()["Doctor_Name"] + "</span></td>");
//            sbTbl.Append("<td><span>" + dt.AsEnumerable().Where(a => a.Field<string>("DOCTOR1").Equals(dr1["DOCTOR1"].ToString())).FirstOrDefault()["DOCTOR1"] + "</span></td>");
//            sbTbl.Append("<td><span>" + dt.AsEnumerable().Where(a => a.Field<string>("SELF1").Equals(dr1["SELF1"].ToString())).FirstOrDefault()["SELF1"] + "</span></td>");
//            sbTbl.Append("<td><span>" + dt.AsEnumerable().Where(a => a.Field<string>("ACCOMPANIST1").Equals(dr1["ACCOMPANIST1"].ToString())).FirstOrDefault()["ACCOMPANIST1"] + "</span></td>");
//            sbTbl.Append("<td><span>" + dt.AsEnumerable().Where(a => a.Field<string>("ACCOMPANIST2").Equals(dr1["ACCOMPANIST2"].ToString())).FirstOrDefault()["ACCOMPANIST2"] + "</span></td>");
//            sbTbl.Append("<td><span>" + dt.AsEnumerable().Where(a => a.Field<string>("ACCOMPANIST3").Equals(dr1["ACCOMPANIST3"].ToString())).FirstOrDefault()["ACCOMPANIST3"] + "</span></td>");
//            sbTbl.Append("<td><span>" + dt.AsEnumerable().Where(a => a.Field<string>("ACCOMPANIST4").Equals(dr1["ACCOMPANIST4"].ToString())).FirstOrDefault()["ACCOMPANIST4"] + "</span></td>");

//            //sbTbl.Append("<td><span>" + dt.AsEnumerable().Where(a => a.Field<string>("DOCTOR1") == dr1["DOCTOR1"].ToString()).ToString() + "</span></td>");
//            //    sbTbl.Append("<td><span>" + dt.AsEnumerable().Where(a => a.Field<string>("SELF1") == dr1["SELF1"].ToString()).ToString() + "</span></td>");
//            //    sbTbl.Append("<td><span>" + dt.AsEnumerable().Where(a => a.Field<string>("ACCOMPANIST1") == dr1["ACCOMPANIST1"].ToString()).ToString() + "</span></td>");
//            //    sbTbl.Append("<td><span>" + dt.AsEnumerable().Where(a => a.Field<string>("ACCOMPANIST2") == dr1["ACCOMPANIST2"].ToString()).ToString() + "</span></td>");
//            //    sbTbl.Append("<td><span>" + dt.AsEnumerable().Where(a => a.Field<string>("ACCOMPANIST3") == dr1["ACCOMPANIST3"].ToString()).ToString() + "</span></td>");
//            //    sbTbl.Append("<td><span>" + dt.AsEnumerable().Where(a => a.Field<string>("ACCOMPANIST4") == dr1["ACCOMPANIST4"].ToString()).ToString() + "</span></td>");


//            sbTbl.Append("</tr>"); 
//        }


//        sbTbl.Append("</tbody></table>");

//    //foreach (DataRow dr in dtNew.Rows)
//    //{

//    //    var results = from myRow in dt.AsEnumerable() where myRow.Field<string>("Doctor_Name") == dr["Doctor_Name"].ToString() select myRow;
//    //    //DataTable dtData = dt.Select("Doctor_Name=" + dr["Doctor_Name"] + "").CopyToDataTable();
//    //    sbTbl.Append("<tr>");
//    //    sbTbl.Append("<td><span id='spnDoctorlist'>" + dr["Doctor_Name"] + "</span></td>");
//    //    //sbTbl.Append("<td><span id='spndigitalsign' onclick=fnShowDigitalsignature()</a></td>");
//    //    List<string> arr = new List<string>();
//    //    arr.Add("Doctor Name");
//    //    arr.Add("Doctor");
//    //    arr.Add("SELF");
//    //    arr.Add("ACCOMPANIST1");
//    //    arr.Add("ACCOMPANIST2");
//    //    arr.Add("ACCOMPANIST3");
//    //    arr.Add("ACCOMPANIST4");

//    //    foreach (var row in arr)
//    //    {
//    //        if (row.ToUpper() == "DOCTOR NAME")
//    //        {
//    //            if(dr["Doctor_Name"] != "")
//    //            {
//    //                sbTbl.Append("<td><a href='#' id='spnDoctorsign' onclick=fnShowDigitalsig(this,\"" + arr + "\")>" + dr["Doctor_Name"] + "</a></td>");
//    //            }
//    //            else
//    //            {
//    //                sbTbl.Append("<td></td>");
//    //            }


//    //        }

//    //        if (row.ToUpper() == "DOCTOR")
//    //        {

//    //            sbTbl.Append("<td><a href='#' id='spnDoctorsign' onclick=fnShowDigitalsig(this,\"" + arr + "\")>" + dr["Entity_Name"] + "</a></td>");

//    //        }
//    //        else
//    //        {
//    //            sbTbl.Append("<td></td>");
//    //        }

//    //         if (row.ToUpper() == "SELF")
//    //        {

//    //                sbTbl.Append("<td></td><td><a href='#' id='spnDoctorsign' onclick=fnShowDigitalsig(this,\"" + arr + "\")>" + dr["Entity_Name"] + "</a></span></td>");

//    //            }
//    //        else
//    //        {
//    //            sbTbl.Append("<td></td>");
//    //        }

//    //        if (row.ToUpper() == "ACCOMPANIST1")
//    //        {

//    //            sbTbl.Append("<td></td><td><a href='#' id='spnDoctorsign' onclick=fnShowDigitalsig(this,\"" +arr + "\")>" + dr["Entity_Name"] + "</a></span></td>");

//    //        }
//    //        else
//    //        {
//    //            sbTbl.Append("<td></td>");
//    //        }      
//    //      if (row.ToUpper() == "ACCOMPANIST2")

//    //        {
//    //            sbTbl.Append("<td><a href='#' id='spnDoctorsign' onclick=fnShowDigitalsig(this,\"" +arr + "\")>" + dr["Entity_Name"] + "</a></span></td>");

//    //        }
//    //        else
//    //        {
//    //            sbTbl.Append("<td></td>");
//    //        }
//    //        if (row.ToUpper() == "ACCOMPANIST3")

//    //        {
//    //            sbTbl.Append("<td><a href='#' id='spnDoctorsign' onclick=fnShowDigitalsig(this,\"" + arr + "\")>" + dr["Entity_Name"] + "</a></span></td>");

//    //        }
//    //        else
//    //        {
//    //            sbTbl.Append("<td></td>");
//    //        }
//    //        if (row.ToUpper() == "ACCOMPANIST4")

//    //        {
//    //            sbTbl.Append("<td><a href='#' id='spnDoctorsign' onclick=fnShowDigitalsig(this,\"" + arr + "\")>" + dr["Entity_Name"] + "</a></span></td>");

//    //        }
//    //        else
//    //        {
//    //            sbTbl.Append("<td></td>");
//    //        }
//    //    }
//    //    //sbTbl.Append("<td><span id='spnFirst2bloburl'><a href =" + dt.Rows[0]["Blob_url"] + ">Uploaded_File_Name</a></span></td>");
//    //    //sbTbl.Append("<td><span id='spnFirst3bloburl'><a href =" + dt.Rows[0]["Blob_url"] + ">Uploaded_File_Name</a></span></td>");
//    //    //sbTbl.Append("<td><span id='spnFirstb4loburl'><a href =" + dt.Rows[0]["Blob_url"] + ">Uploaded_File_Name</a></span></td>");
//    //    sbTbl.Append("</tr>");
//    //}

//}
//   // sbTbl.Append("<div style='border-bottom: 5px solid #a52e09;margin-top: 10px;'></div>");
//    return sbTbl.ToString();

//}




#region Private Methods

#endregion Private Methods



