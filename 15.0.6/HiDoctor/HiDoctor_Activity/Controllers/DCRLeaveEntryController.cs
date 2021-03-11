#region Using
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using DataControl;
using MVCModels;
using System.Text;
using HDQueueService;
using System.Configuration;
using Newtonsoft.Json;
#endregion Using

namespace HiDoctor_Activity.Controllers
{
    [AjaxSessionActionFilter]
    public class DCRLeaveEntryController : Controller
    {
        #region Private Variables
        private DataControl.CurrentInfo _objCurr = new DataControl.CurrentInfo();
        private DataControl.SPData _objSP = new DataControl.SPData();
        private DataControl.Data _objData = new DataControl.Data();
        private string _queueAccountKey = ConfigurationManager.AppSettings["ServiceBusConnection"].ToString();
        private string _topicName = ConfigurationManager.AppSettings["busDCRTopicName"].ToString();
        private string _subscriptionName = ConfigurationManager.AppSettings["busDCRSubscriptionName"].ToString();

        #endregion Private variables

        #region Create
        // GET: /DCRLeaveEntry/Create
        public ActionResult Create(string dcrDate, string dcrStatus)
        {
            ViewBag.leaveType = GetLeaveType(dcrDate);
            ViewBag.Company_Code = _objCurr.GetCompanyCode();
            ViewBag.Region_Code = _objCurr.GetRegionCode();
            ViewBag.User_Name = _objCurr.GetUserName();

            string[] viewArray = new string[3];
            viewArray[0] = dcrDate;
            viewArray[1] = dcrStatus;
            viewArray[2] = _objCurr.GetDCRCode(dcrDate);
            ViewBag.viewArray = viewArray;

            DataSet ds = new DataSet();
            if (dcrStatus == "1")
            {
                //SP_hdGetTPLeaveForDCR
                try
                {
                    _objData.OpenConnection(_objCurr.GetCompanyCode());
                    {
                        ds = _objData.ExecuteDataSet("exec SP_hdGetTPLeaveForDCR '" + _objCurr.GetCompanyCode() + "','" + dcrDate + "','" + _objCurr.GetUserCode() + "'");
                    }
                }
                finally
                {
                    _objData.CloseConnection();
                }

            }
            if (dcrStatus == "0")
            {
                //SP_hdGetTPLeaveForDCR
                try
                {
                    _objData.OpenConnection(_objCurr.GetCompanyCode());
                    {
                        ds = _objData.ExecuteDataSet("exec SP_hdGetUnapprovedDCRLeave '" + _objCurr.GetCompanyCode() + "','" + dcrDate + "','" + _objCurr.GetUserCode() + "'");
                    }
                }
                finally
                {
                    _objData.CloseConnection();
                }

            }


            string remarks = string.Empty, typeCode = string.Empty;
            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                remarks = ds.Tables[0].Rows[0]["Remarks"].ToString();
                typeCode = ds.Tables[0].Rows[0]["Activity_Code"].ToString();
            }

            ViewBag.remarks = remarks;
            ViewBag.typeCode = typeCode;

            if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
            {
                return View("Create.Mobile");
            }
            return View();
        }
        #endregion Create

        #region Public Methods
        public JsonResult GetLeaveBalance(FormCollection collection)
        {
            DataSet dsLeaveBalance = new DataSet();
            DataSet dsLeaveTypeValues = new DataSet();

            //string startDate = DateTime.Now.Year.ToString() + "-01-01";
            //string endDate = DateTime.Now.Year.ToString() + "-12-31";
            string leaveValidationNeed = collection["leaveValidationLeaves"].ToString();
            string dcrDate = collection["dcrDate"].ToString();

            // Added the parameter to SqlCommand.
            try
            {
                _objData.OpenConnection(_objCurr.GetCompanyCode());
                {
                    //dsLeaveBalance = _objData.ExecuteDataSet("exec SP_hdGetUserLeaveBalance '" + _objCurr.GetCompanyCode() + "','" + _objCurr.GetUserCode() + "','" + _objCurr.GetUserTypeCode() + "','" + startDate + "','" + endDate + "','" + dcrDate + "'");
                    dsLeaveBalance = _objData.ExecuteDataSet("exec SP_hdGetUserLeaveBalance '" + _objCurr.GetCompanyCode() + "','" + _objCurr.GetUserCode() + "','" + _objCurr.GetUserTypeCode() + "','" + dcrDate + "'");
                }
            }
            finally
            {
                _objData.CloseConnection();
            }


            List<Models.DCRLeaveEntryModel> lstLeaveBalance = new List<Models.DCRLeaveEntryModel>();
            List<Models.DCRLeaveEntryModel> lstLeaveValidation = new List<Models.DCRLeaveEntryModel>();

            #region Leave Balance
            if (dsLeaveBalance.Tables.Count > 0)
            {
                if (dsLeaveBalance.Tables[0].Rows.Count > 0)
                {
                    DataTable dt = new DataTable();
                    dt = dsLeaveBalance.Tables[0];
                    lstLeaveBalance = (from item in dt.AsEnumerable()
                                       select new Models.DCRLeaveEntryModel()
                                       {
                                           Leave_Type_Code = item["Leave_Type_Code"].ToString(),
                                           Leave_Type_Name = item["Leave_Type_Name"].ToString(),
                                           Balance_CF = (item["Balance_CF"] != System.DBNull.Value) ? Convert.ToDouble(item["Balance_CF"]) : 0.0,
                                           Leave_Eligible = (item["Leave_Eligible"] != System.DBNull.Value) ? Convert.ToDouble(item["Leave_Eligible"]) : 0.0,
                                           Leave_Balance = (item["Leave_Balance"] != System.DBNull.Value) ? Convert.ToDouble(item["Leave_Balance"]) : 0.0,
                                           Lapsed = (item["Lapsed"] != System.DBNull.Value) ? Convert.ToDouble(item["Lapsed"]) : 0.0,
                                           Opening_Balance = (item["Opening_Balance"] != System.DBNull.Value) ? Convert.ToDouble(item["Opening_Balance"]) : 0.0,
                                           Leave_Taken = (item["Leave_Taken"] != System.DBNull.Value) ? Convert.ToDouble(item["Leave_Taken"]) : 0.0,
                                           leave_Eligibleforyear = Convert.ToInt32(item["leave_Eligibleforyear"]),
                                           leave_confirmation_days = item["leave_confirmation_days"].ToString(),
                                           leave_Oncompletion = item["leave_Oncompletion"].ToString(),
                                           No_of_days = Convert.ToInt32(item["No_of_days"].ToString()),
                                           leave_application_days = Convert.ToInt32(item["leave_application_days"].ToString()),
                                           Confirmation_date = item["Confirmation_date"].ToString(),
                                       }).ToList<Models.DCRLeaveEntryModel>();
                }
            }

            // Get the leave validation details
            if (!(string.IsNullOrEmpty(leaveValidationNeed)))
            {
                try
                {
                    _objData.OpenConnection(_objCurr.GetCompanyCode());
                    {
                        dsLeaveTypeValues = _objData.ExecuteDataSet("exec SP_hdGetUserLeaveTypeValues '" + _objCurr.GetCompanyCode() + "','" + _objCurr.GetUserCode() + "','" + _objCurr.GetUserTypeCode() + "','" + dcrDate + "'");
                    }
                }
                finally
                {
                    _objData.CloseConnection();
                }


                if (dsLeaveTypeValues.Tables.Count > 0)
                {
                    if (dsLeaveTypeValues.Tables[0].Rows.Count > 0)
                    {
                        DataTable dt = new DataTable();
                        dt = dsLeaveTypeValues.Tables[0];
                        lstLeaveValidation = (from item in dt.AsEnumerable()
                                              select new Models.DCRLeaveEntryModel()
                                              {
                                                  Leave_Type_Code = item["Leave_Type_Code"].ToString(),
                                                  IS_Added_Weekend_Holiday = (item["IS_Added_Weekend_Holiday"] != System.DBNull.Value) ? Convert.ToChar(item["IS_Added_Weekend_Holiday"]) : 'Y',
                                                  Min_Leave = (item["Min_Leave"] != System.DBNull.Value) ? Convert.ToDouble(item["Min_Leave"]) : 0.0,
                                                  Max_Leave = (item["Max_Leave"] != System.DBNull.Value) ? Convert.ToDouble(item["Max_Leave"]) : 0.0,
                                                  Effective_From = item["Effective_From"].ToString(),
                                                  Effective_To = item["Effective_To"].ToString(),
                                                  User_Leave_Type_Code = item["User_Leave_Type_Code"].ToString(),
                                                  IS_Added_Holiday = (item["IS_Added_Holiday"] != System.DBNull.Value) ? Convert.ToChar(item["IS_Added_Holiday"]) : 'Y'
                                              }).ToList<Models.DCRLeaveEntryModel>();
                    }
                }
            }
            #endregion Leave Balance


            List<JsonResult> lstLeave = new List<JsonResult> { Json(lstLeaveBalance, JsonRequestBehavior.AllowGet), Json(lstLeaveValidation, JsonRequestBehavior.AllowGet) };

            return Json(lstLeave, JsonRequestBehavior.AllowGet);
        }

        public string GetHolidayCount(FormCollection collection)
        {
            try
            {
                string result = string.Empty;
                BLRegion objRegion = new BLRegion();
                JSONConverter objJson = new JSONConverter();

                string fromDate = collection["fromDate"].ToString();
                string toDate = collection["toDate"].ToString();
                string companyCode = _objCurr.GetCompanyCode();

                _objData.OpenConnection(companyCode);
                {
                    result = Convert.ToString(_objData.ExecuteScalar("exec SP_hdGetHolidayCount '" + companyCode + "','" + _objCurr.GetUserCode() + "','" + fromDate + "','" + toDate + "','" + _objCurr.GetRegionCode() + "'"));
                }

                #region WeekendDays
                List<MVCModels.HiDoctor_Master.WeekendDaysForARegion> lstWeekend = new List<MVCModels.HiDoctor_Master.WeekendDaysForARegion>();
                lstWeekend = objRegion.GetWeekendDaysForARegion(companyCode, _objCurr.GetRegionCode(), fromDate, toDate);
                #endregion WeekendDays

                return result + "$" + objJson.Serialize(lstWeekend);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }


        public string CheckClubLeave(FormCollection collection)
        {
            string result = string.Empty;
            string fromDate = collection["fromDate"].ToString();
            string toDate = collection["toDate"].ToString();

            result = _objSP.CheckClubLeave(fromDate, toDate, collection["leaveTypeCode"].ToString(), collection["userLeaveTypeCode"].ToString());
            return result;
        }

        public string UpdateLeave(FormCollection collection)
        {
            string result = string.Empty;
            result = _objSP.UpdateLeave(collection["fromDate"].ToString(), collection["reason"].ToString(), collection["leaveTypeCode"].ToString(), collection["entryMode"].ToString());
            return result;
        }

        public string LeaveValidation(string fromDate, string toDate, string leaveTypeCode, string uploaded_files)
        {
            string result = "";
            string company_Code = _objCurr.GetCompanyCode();
            string user_Code = _objCurr.GetUserCode();
            result = _objSP.LeaveValidation(company_Code, user_Code, fromDate, toDate, leaveTypeCode);
            if (result == "NO ISSUE")
            {
                int privilege_value = _objSP.GetLeaveValidationPrivilege(company_Code, user_Code, leaveTypeCode);
                if (privilege_value == 1)
                {
                    result = _objSP.AllowAcrossMonthLeaveValidation(company_Code, user_Code, fromDate, toDate, leaveTypeCode);
                    if (result == "NO ISSUE")
                    {
                        result = _objSP.MinMaxValidation(company_Code, user_Code, fromDate, toDate, leaveTypeCode);
                        if (result == "NO ISSUE")
                        {
                            result = _objSP.MonthlyYearlyValidation(company_Code, user_Code, fromDate, toDate, leaveTypeCode);
                            if (result == "NO ISSUE")
                            {
                                result = _objSP.AttachmentValidation(company_Code, user_Code, fromDate, toDate, leaveTypeCode, uploaded_files);
                                if (result == "NO ISSUE")
                                {
                                    result = _objSP.SandwichPolicyValidation(company_Code, user_Code, fromDate, toDate, leaveTypeCode);
                                    if (result == "NO ISSUE")
                                    {
                                        result = _objSP.ClubbingValidation(company_Code, user_Code, fromDate, toDate, leaveTypeCode);
                                        if (result == "NO ISSUE")
                                        {
                                            result = _objSP.LeavebalanceValidation(company_Code, user_Code, fromDate, toDate, leaveTypeCode);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return result;
        }

    public string InsertUpdateLeave(string fromDate, string toDate, string reason, string leaveTypeCode, string entry_mode,
         int leave_Status, string doc_Url, string uploaded_files, string objDateDetails)
    {
        string result = "";
        int originOfDCR = 0;
        string company_Code = _objCurr.GetCompanyCode();
        string user_Code = _objCurr.GetUserCode();
        string user_Name = _objCurr.GetUserName();
        string region_Code = _objCurr.GetRegionCode();
        DateCapturingModel _obDateDet = JsonConvert.DeserializeObject<DateCapturingModel>(objDateDetails);
        if (!(_obDateDet.Off_Set.Contains('+') && !(_obDateDet.Off_Set.Contains('-'))))
        {
            _obDateDet.Off_Set = '+' + _obDateDet.Off_Set.Trim();
        }
        if (entry_mode == "WEB" && leave_Status == 1)
        {
            originOfDCR = 1;
        }
        result = _objSP.InsertUpdateLeave(company_Code, user_Code, user_Name, region_Code, fromDate, toDate, reason, leaveTypeCode, entry_mode, leave_Status, doc_Url, originOfDCR, uploaded_files, _obDateDet);
        return result;
    }

    public string UploadAttachment()
    {
        var result = "";
        StringBuilder strbuilder = new StringBuilder();
        try
        {
                System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
                CurrentInfo _objCurr = new CurrentInfo();
            var objAzureUpload = new DataControl.Repository.AzureBlobUpload();
            var objPathProv = new DataControl.Impl.FileSystemProvider();
            string accKey = objPathProv.GetConfigValue("UPLOADEDFILEBLOBACCKEY");
            HttpFileCollectionBase files = Request.Files;
            if (files.Count > 0)
            {
                for (var i = 0; i < files.Count; i++)
                {
                    HttpPostedFileBase fileUpload = files[i];
                    String fileNametimeStamp = DateTime.Now.ToString("ddMMyyyyHHmmssfff");
                    fileNametimeStamp = fileNametimeStamp + '_' + fileUpload.FileName;
                    strbuilder.Append(objAzureUpload.PutAzureBlobStorage(fileUpload.InputStream, fileNametimeStamp, accKey, _objCurr.GetCompanyCode()));
                    strbuilder.Append("~");
                }
            }
        }
        catch (Exception ex)
        {
            throw ex;
        }
        result = strbuilder.ToString();
        return result;
    }

    public string InsertLeave(FormCollection collection)
    {
        string result = string.Empty;
        string fromDate = collection["fromDate"].ToString();
        string toDate = collection["toDate"].ToString();
        string reason = collection["reason"].ToString();
        string leaveTypeCode = collection["leaveTypeCode"].ToString();
        string sundayValidation = collection["sundayValidation"].ToString();
        string isWeekend = collection["isAddedWeekendHoliday"].ToString();
        string entryMode = collection["entryMode"].ToString();
        string isAddHoliday = collection["isAddHoliday"].ToString();
        int originOfDCR = 0;
        string checkLeaveValidation = string.Empty;
        //userLeaveTypeCode=" + userLeaveTypeCode + "&leaveTypeName=" + $("#ddlLeaveType :selected").text() + "&noOfDays=" + noOfDays,
        string userLeaveTypeCode = collection["userLeaveTypeCode"].ToString();
        string leaveTypeName = collection["leaveTypeName"].ToString();
        double noOfDays = Convert.ToDouble(collection["noOfDays"]);
        string leaveweekendHoliday = string.Empty;

        if (entryMode == "WEB")
        {
            originOfDCR = 1;
        }
        else if (entryMode == "MOBILE")
        {
            originOfDCR = 2;
        }

        // check leave validation
        checkLeaveValidation = _objSP.CheckLeaveValidation(fromDate, toDate, leaveTypeCode, userLeaveTypeCode, leaveTypeName, isWeekend, isAddHoliday, noOfDays);

        if (checkLeaveValidation.Split('|')[0] == "SUCCESS" || checkLeaveValidation == "")
        {
            if (checkLeaveValidation != "")
            {
                /*SET @Result= 'SUCCESS^'+@OtherLeaveType+'^'+@OtherLeaveTypeName+'^'+@HOLIDAYDATES+'^'+@WEEKENDDATES
                +'^'+ISNULL(CONVERT(VARCHAR,@CurrentLeaveTypeBalane),'')+'^'+ISNULL(CONVERT(VARCHAR,@OtherLeaveTypeBalane),'')
                +'^'+ISNULL(CONVERT(VARCHAR,@IntermediateDateCount),'')*/
                string otherLeaveType = checkLeaveValidation.Split('|')[1];
                string otherLeaveName = checkLeaveValidation.Split('|')[2];
                string holidayDates = checkLeaveValidation.Split('|')[3];
                string weekendDates = checkLeaveValidation.Split('|')[4];
                double currentLeaveBal = Convert.ToDouble(checkLeaveValidation.Split('|')[5]);
                double otherLeaveBal = Convert.ToDouble(checkLeaveValidation.Split('|')[6]);
                int weekendHolidayDates = Convert.ToInt32(checkLeaveValidation.Split('|')[7]);

                if (weekendHolidayDates > 0)
                {
                    int totalLeaves = (weekendDates.Split('^').Count() - 1) + (holidayDates.Split('^').Count() - 1);
                    int leaveAssigned = 0;
                    foreach (string weekend in weekendDates.Split('^'))
                    {
                        if (weekend != "")
                        {
                            leaveAssigned++;
                            if (leaveAssigned <= currentLeaveBal)
                            {
                                //assign leave for currentleave type
                                leaveweekendHoliday += weekend + "^";
                                leaveweekendHoliday += leaveTypeCode + "^";
                            }
                            else if (otherLeaveType != "" && leaveAssigned <= otherLeaveBal)
                            {
                                //assign leave for other leave type
                                leaveweekendHoliday += weekend + "^";
                                leaveweekendHoliday += otherLeaveType + "^";
                            }
                            else
                            {
                                result = "No enough leave balance to enter the leave..";
                                return result;
                            }
                        }
                    }

                    foreach (string holiday in holidayDates.Split('^'))
                    {
                        if (holiday != "")
                        {
                            if (!weekendDates.Split('^').Contains(holiday))
                            {
                                leaveAssigned++;
                                if (leaveAssigned <= currentLeaveBal)
                                {
                                    //assign leave for currentleave type
                                    leaveweekendHoliday += holiday + "^";
                                    leaveweekendHoliday += leaveTypeCode + "^";
                                }
                                else if (otherLeaveType != "" && leaveAssigned <= otherLeaveBal)
                                {
                                    //assign leave for other leave type
                                    leaveweekendHoliday += holiday + "^";
                                    leaveweekendHoliday += otherLeaveType + "^";
                                }
                                else
                                {
                                    result = "No enough leave balance to enter the leave...";
                                    return result;
                                }
                            }
                        }
                    }
                }
            }
            result = _objSP.InsertLeave(fromDate, toDate, reason, leaveTypeCode, sundayValidation, isWeekend, entryMode, originOfDCR, isAddHoliday, leaveweekendHoliday);


            DateTime leaveFromDate = Convert.ToDateTime(fromDate);
            DateTime leaveToDate = Convert.ToDateTime(toDate);

            for (DateTime i = leaveFromDate; i <= leaveToDate; i = i.AddDays(1))
            {

                try
                {
                    IQueueService<DCRQueue> dcrHeaderQueue = new QueueService<DCRQueue>(_queueAccountKey, _topicName, _subscriptionName);
                    if (dcrHeaderQueue.Initialize())
                    {
                        DCRQueue dcrQueue = new DCRQueue();
                        List<DCRQueue> dcrQueueList = new List<DCRQueue>();
                        dcrQueue.CompanyCode = _objCurr.GetCompanyCode();
                        dcrQueue.DCRCode = _objCurr.GetDCRCode(i.ToString("yyyy-MM-dd"));
                        dcrQueue.UserCode = _objCurr.GetUserCode();
                        dcrQueue.UserName = _objCurr.GetUserName();
                        dcrQueue.DCRDate = i.ToShortDateString();
                        dcrQueue.ActivityFlag = "L";
                        dcrQueue.DCRStatus = 1;//Convert.ToInt32(dcrStatus);

                        dcrQueue.Event = "APPLIED";


                        DCRQueueTracker dcrQueueTracker = new DCRQueueTracker();
                        dcrQueueTracker.CompanyCode = _objCurr.GetCompanyCode();
                        dcrQueueTracker.UserCode = _objCurr.GetUserCode();
                        dcrQueueTracker.DCRCode = _objCurr.GetDCRCode(i.ToString("yyyy-MM-dd"));
                        dcrQueueTracker.Flag = "L";
                        dcrQueueTracker.TopicName = _topicName;
                        dcrQueueTracker.SubscriptionName = _subscriptionName;
                        dcrQueueTracker.ProcessStatus = 0;
                        dcrQueueTracker.EventName = dcrQueue.Event;


                        dcrQueueList.Add(dcrQueue);
                        dcrQueueTracker.JSONObject = JsonConvert.SerializeObject(dcrQueueList);

                        BL_DCRHeader blDCRHeader = new BL_DCRHeader();
                        int Id = blDCRHeader.InsertDCRQueueTracker(_objCurr.GetCompanyCode(), dcrQueueTracker);
                        dcrQueueList[0].Id = Id;
                        dcrQueueTracker.Id = Id;
                        if (!dcrHeaderQueue.CreateQueueItem(dcrQueueList))
                        {
                            dcrQueueTracker.Mesg = "Queue Failed.";
                            dcrQueueTracker.StackTrace = "";
                            dcrQueueTracker.ProcessStatus = -1;
                            blDCRHeader.UpdateDCRQueueTracker(_objCurr.GetCompanyCode(), dcrQueueTracker);
                        }
                    }
                }
                catch (Exception ex)
                {
                    BL_DCRHeader blDCRHeader = new BL_DCRHeader();

                    string dcrCode = _objCurr.GetDCRCode(i.ToString("yyyy-MM-dd"));
                    blDCRHeader.InsertDCRQueueExceptionLogs(_objCurr.GetCompanyCode(), dcrCode, "L", _objCurr.GetUserCode(), i.ToString("yyyy-MM-dd"), ex.Message, ex.StackTrace, "Applied");

                }

            }


        }
        else
        {
            result = checkLeaveValidation;
        }
        return result;
    }

    public JsonResult CheckTPAvailableForSelectedLeaveDates(string leaveFromDate, string leaveToDate)
    {
        try
        {
            SPData objSPData = new SPData();
            CurrentInfo objcurrentInfo = new CurrentInfo();
            StringBuilder LeaveDates = new StringBuilder();



            DateTime fromDate = Convert.ToDateTime(leaveFromDate);
            DateTime toDate = Convert.ToDateTime(leaveToDate);

            for (DateTime i = fromDate; i <= toDate; i = i.AddDays(1))
            {
                LeaveDates.Append(i.ToShortDateString());
                LeaveDates.Append("^");
            }



            string company_Code = objcurrentInfo.GetCompanyCode();
            string user_Code = objcurrentInfo.GetUserCode();
            string region_Code = objcurrentInfo.GetRegionCode();

            List<string> lstDCRDates = objSPData.CheckTPAvailableForSelectedDCRDates(company_Code, user_Code, region_Code, LeaveDates.ToString());

            // List<string> DCR_Dates = DCRDates.Split('^').ToList();
            // DCR_Dates = DCR_Dates.Where(d => d != "").ToList();
            // //compare two list and return not matching items using linq
            //List<string> lstDCRDatesWithoutPlan =  DCR_Dates.Except(lstDCRDates).ToList();
            if (lstDCRDates != null)
            {
                return Json(lstDCRDates);
            }
            return null;
        }
        catch
        {
            throw;
        }
    }
    #endregion Public Methods

    #region Private Methods
    private SelectList GetLeaveType(string dcrDate)
    {
        DataSet dsLeaveType = new DataSet();
        List<object> lt = new List<object>();

        // Added the parameter to SqlCommand.
        try
        {
            _objData.OpenConnection(_objCurr.GetCompanyCode());
            {
                dsLeaveType = _objData.ExecuteDataSet("exec SP_hdGetActiveLeaveTypesInGivenDate '" + _objCurr.GetCompanyCode() + "','" + _objCurr.GetUserTypeCode() + "','" + _objCurr.GetUserCode() + "','" + dcrDate + "'");
            }
        }
        finally
        {
            _objData.CloseConnection();
        }


        if (dsLeaveType.Tables.Count > 0)
        {
            if (dsLeaveType.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in dsLeaveType.Tables[0].Rows)
                {
                    lt.Add(new
                    {
                        value = dr["Leave_Type_Code"].ToString(),
                        text = dr["Leave_Type_Name"].ToString()
                    });
                }
            }
        }
        return new SelectList(lt.AsEnumerable(), "value", "text");
    }
    #endregion Private Methods
}
}