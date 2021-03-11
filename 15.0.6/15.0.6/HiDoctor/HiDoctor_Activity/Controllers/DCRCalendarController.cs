using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Web.Mvc;
using HiDoctor_Activity.Models;
using DataControl;
using MVCModels.HiDoctor_Master;
using DataControl.Impl;
using DataControl.Abstraction;
using DataControl.EnumType;
using Newtonsoft.Json;
namespace HiDoctor_Activity.Controllers
{
    [AjaxSessionActionFilter]
    public class DCRCalendarController : Controller
    {
        #region Private Variables
        private DataControl.SPData _objSPData = new DataControl.SPData();
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        #endregion Private Variables

        #region Index




        public ActionResult Index()
        {
            try
            {
                string managerApprovalPri = string.Empty;
                managerApprovalPri = GetpendingDCR();
                int TPPendingApprovalUserCount = GetPendingApprovedTPUsersCount();
                int SSPendingApprovalUserCount = GetPendingApprovedSSUsersCount();
                string regionCode = _objcurrentInfo.GetRegionCode();

                ViewBag.CurrentDate = System.DateTime.Now.ToShortDateString();
                bool isPayRollIntegrated = _objcurrentInfo.GetPayRollIntegratedStatus();
                ViewBag.isPayRollIntegrated = isPayRollIntegrated;
                string unApprovedDCRConfigValue = GetUnapprovedDCRCheckConfigValue();
                ViewBag.unApprovedDCRCheck = unApprovedDCRConfigValue;
                string singleActivityPerDay = GetSingleActivityperday();
                string LeaveEntryMode = GetLeaveEntryMode();
                ViewBag.singleActivityPerDay = singleActivityPerDay;
                ViewBag.LeaveEntryMode = LeaveEntryMode;
                ViewBag.TPPendingApprovalUserCount = TPPendingApprovalUserCount;
                ViewBag.SSPendingApprovalUserCount = SSPendingApprovalUserCount;
                ViewBag.Region_Code = regionCode;
                ViewBag.Company_Code = _objcurrentInfo.GetCompanyCode();
                //if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
                //{
                //    return View("Index.Mobile");
                //}
                //if (!string.IsNullOrEmpty(managerApprovalPri))
                //{
                //    return View("PendingApprovalScreen");
                //}
                //else
                //{
                //    return View();
                //}
                if (!string.IsNullOrEmpty(managerApprovalPri) || TPPendingApprovalUserCount > 0 || SSPendingApprovalUserCount > 0)
                {
                    if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
                    {
                        return View("PendingApprovalScreen.Mobile");
                    }
                    return View("PendingApprovalScreen"); ;

                }

                else
                {
                    if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
                    {
                        return View("Index.Mobile");
                    }
                    return View();
                }
            }
            catch
            {
                throw;
            }
        }

        public ActionResult GotoTPApproval()
        {
            return RedirectToAction("TPApproval", "TourPlanner");
        }
        #endregion Index

        #region Public Methods
        //
        // GET: /DCRCalendar/

        public JsonResult GetCalendarDetails(string startDate, string endDate)
        {
            List<JsonResult> dcrJSON = new List<JsonResult>();
            _objcurrentInfo = new CurrentInfo();
            MasterController masterController = new MasterController();
            DataSet dsParentRegions = new DataSet();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string regionCode = _objcurrentInfo.GetRegionCode();
            string userCode = _objcurrentInfo.GetUserCode();
            string GreytipLeaveConfigValue = "";
            dsParentRegions = masterController.GetParentRegionsDataSet(regionCode);

            bool payRollIntegratedStatus = _objcurrentInfo.GetPayRollIntegratedStatus();
            DataTable dtRegion = dsParentRegions.Tables[0];
            GreytipLeaveConfigValue = GetGreyTipPayRollShortNameConfigValue(); ;

            string parentRegions = string.Empty;
            for (int i = 0; i < dtRegion.Rows.Count; i++)
            {
                if (dtRegion.Rows[i]["Region_Code"].ToString() != regionCode)
                {
                    parentRegions += dtRegion.Rows[i]["Region_Code"] + "^";
                }
            }

            DataSet dsMasterDetails = _objSPData.GetCalendarDetails(startDate, endDate, userCode, regionCode, parentRegions);
            DataTable dtHeaderDetails = dsMasterDetails.Tables[0];
            DataTable dtLockDetails = dsMasterDetails.Tables[1];
            DataTable dtLockhelpInfo = dsMasterDetails.Tables[2];
            DataTable dtTPInfo = dsMasterDetails.Tables[3];
            DataTable dtActivityLock = dsMasterDetails.Tables[4];
            DataTable dtWAData = dsMasterDetails.Tables[5];
            DataTable dtSSData = dsMasterDetails.Tables[6];

            List<DCRCalendarModel> lstDCRHeaderDetails = (from Master_Data in dtHeaderDetails.AsEnumerable()
                                                          select new DCRCalendarModel
                                                          {
                                                              year = Master_Data["Year"].ToString(),
                                                              month = Master_Data["Month"].ToString(),
                                                              day = Master_Data["Day"].ToString(),
                                                              start = Master_Data["Month"].ToString() + "/" + Master_Data["Day"].ToString() + "/" + Master_Data["Year"].ToString(),
                                                              title = Convert.ToInt32(Master_Data["Status"]) == -1 ?
                                                                            "WA-" + masterController.GetFlagFullName(Master_Data["Flag"].ToString()) :
                                                                            Convert.ToInt32(Master_Data["Status"]) == -2 ? "Off-" + masterController.GetFlagFullName(Master_Data["Flag"].ToString()) :
                                                                     Master_Data["Flag"].ToString() == "L" ?
                                                                        Master_Data["Source_Of_Entry"].ToString() == "PAY_WS" ?
                                                                            masterController.GetFlagFullName(Master_Data["Flag"].ToString()) + " " + Enum.GetName(typeof(DCRStatus), Convert.ToInt32(Master_Data["Status"])) + " (" + GreytipLeaveConfigValue + ")"
                                                                            : masterController.GetFlagFullName(Master_Data["Flag"].ToString()) + " " + Enum.GetName(typeof(DCRStatus), Convert.ToInt32(Master_Data["Status"]))
                                                                    : masterController.GetFlagFullName(Master_Data["Flag"].ToString()) + " " + Enum.GetName(typeof(DCRStatus), Convert.ToInt32(Master_Data["Status"])),

                                                              isTP = "",
                                                              url = "#",
                                                              className = "DCR" + "-" + Enum.GetName(typeof(DCRStatus), Convert.ToInt32(Master_Data["Status"])) + "-" + Master_Data["Flag"].ToString(),
                                                              Activity_Count = Master_Data["Activity_Count"] == null ? "0" : Master_Data["Activity_Count"].ToString(),
                                                             // DCR_Lock_Status = Master_Data["DCR_Lock_Status"].ToString(),
                                                              Record_Status = Master_Data["Record_Status"] == null ? "0" : Master_Data["Record_Status"].ToString()
                                                          }).ToList<DCRCalendarModel>();

            List<DCRLockModel> lstDCRLockDetails = (from Master_Data in dtLockDetails.AsEnumerable()
                                                    select new DCRLockModel
                                                    {
                                                        Locked_Date = Master_Data["Locked_Date"].ToString(),
                                                        LockType = Master_Data["Lock_Type"].ToString(),
                                                        TP_Define_Month = Master_Data["TP_Define_Month"].ToString(),
                                                        TP_Define_Year = Master_Data["TP_Define_Year"].ToString(),
                                                        TP_Approval_Month = Master_Data["TP_Approval_Month"].ToString(),
                                                        TP_Approval_Year = Master_Data["TP_Approval_Year"].ToString(),
                                                        Lock_Reason = Master_Data["Lock_Reason"].ToString(),
                                                        Reason = Master_Data["Reason"].ToString(),
                                                        DCR_Actual_Date = Master_Data["DCR_Actual_Date"].ToString()
                                                    }).ToList<DCRLockModel>();

            List<DCRLockModel> lstDCRLockHelpInfo = (from Master_Data in dtLockhelpInfo.AsEnumerable()
                                                     select new DCRLockModel
                                                     {
                                                         // IsTPDefineNextMonth = Master_Data["IsTPDefineNextMonth"].ToString(),
                                                         MissedDCRDate = Master_Data["MissedDCRDate"].ToString(),
                                                         //IsRegionLock = Master_Data["RegionLock"].ToString(),
                                                         HidoctorStartDate = Master_Data["JoinDate"].ToString(),
                                                         Leave_Entry_Mode = Master_Data["Leave_Entry_Mode"].ToString(),
                                                         // TP_Approval_Lock = Convert.ToInt32(Master_Data["TP_Approval_Lock"]),
                                                         Is_WA_User = Master_Data["Is_WA_User"].ToString(),
                                                         Is_WA_TABLET_USER = Convert.ToBoolean(Master_Data["Is_WA_TABLET_USER"]),
                                                         WA_REGIS_DATE = Master_Data["WA_REGIS_DATE"].ToString()
                                                     }).ToList<DCRLockModel>();


            dcrJSON.Add(Json(lstDCRLockDetails));
            dcrJSON.Add(Json(lstDCRLockHelpInfo));
            dcrJSON.Add(Json(lstDCRHeaderDetails));


            DataSet dsLockLevaeDetails = _objSPData.GetLockLeaveDetails(startDate, endDate);
            DataTable dtLockLevaeDetails = dsLockLevaeDetails.Tables[0];
            List<DCRCalendarModel> lstDCRLockLeaveDetails = (from lock_leaveData in dtLockLevaeDetails.AsEnumerable()
                                                             select new DCRCalendarModel
                                                             {
                                                                 year = lock_leaveData["Year"].ToString(),
                                                                 month = lock_leaveData["Month"].ToString(),
                                                                 day = lock_leaveData["Day"].ToString(),
                                                                 LeaveType = lock_leaveData["Leave_Type"].ToString(),
                                                                 start = lock_leaveData["Month"].ToString() + "/" + lock_leaveData["Day"].ToString() + "/" + lock_leaveData["Year"].ToString(),
                                                                 title = lock_leaveData["Flag"].ToString() + "-" + lock_leaveData["Status"].ToString(),
                                                                 DCR_Lock_Status = lock_leaveData["Status"].ToString(),
                                                                 isTP = "",
                                                                 url = "#",
                                                                 className = lock_leaveData["ClassName"].ToString(),
                                                                 Record_Status = lock_leaveData["Record_Status"].ToString(),
                                                                 Released_Date = lock_leaveData["Released_Date"].ToString()
                                                             }).ToList<DCRCalendarModel>();

            dcrJSON.Add(Json(lstDCRLockLeaveDetails));


            DataSet dsHolidays = masterController.GetHolidays(companyCode, startDate, endDate, parentRegions, regionCode);
            DataTable dtHoliday = dsHolidays.Tables[0];
            List<DCRCalendarModel> lstDCRHolidayDetails = (from hoilday_data in dtHoliday.AsEnumerable()
                                                           select new DCRCalendarModel
                                                           {
                                                               year = hoilday_data["Year"].ToString(),
                                                               month = hoilday_data["Month"].ToString(),
                                                               day = hoilday_data["Day"].ToString(),
                                                               start = hoilday_data["Month"].ToString() + "/" + hoilday_data["Day"].ToString() + "/" + hoilday_data["Year"].ToString(),
                                                               title = hoilday_data["Flag"].ToString() + " " + hoilday_data["Status"].ToString(),
                                                               isTP = "",
                                                               url = "#",
                                                               className = hoilday_data["ClassName"].ToString()
                                                           }).ToList<DCRCalendarModel>();

            dcrJSON.Add(Json(lstDCRHolidayDetails));
            List<DCRCalendarModel> lstTPInfo = (from tp_data in dtTPInfo.AsEnumerable()
                                                select new DCRCalendarModel
                                                {
                                                    year = tp_data["Year"].ToString(),
                                                    month = tp_data["Month"].ToString(),
                                                    day = tp_data["Day"].ToString(),
                                                    start = tp_data["Month"].ToString() + "/" + tp_data["Day"].ToString() + "/" + tp_data["Year"].ToString(),
                                                    title = tp_data["Flag"].ToString() + "-" + tp_data["Status"].ToString(),
                                                    isTP = "",
                                                    url = "#",
                                                    className = tp_data["Status"].ToString()
                                                }).ToList<DCRCalendarModel>();


            dcrJSON.Add(Json(lstTPInfo));

            List<DCRActivityLock> lstActivityLock = (from activity_lock_data in dtActivityLock.AsEnumerable()
                                                     select new DCRActivityLock
                                                     {
                                                         User_Code = activity_lock_data["User_Code"].ToString(),
                                                         Lock_Status = activity_lock_data["Lock_Status"].ToString(),
                                                         DCR_Actual_Date = activity_lock_data["DCR_Actual_Date"].ToString(),
                                                         Flag = activity_lock_data["Activity_Flag"].ToString(),
                                                         UnapproveReason = activity_lock_data["Unapproval_Reason"].ToString(),
                                                     }).ToList<DCRActivityLock>();

            dcrJSON.Add(Json(lstActivityLock));

            List<DCRCalendarModel> lstWAData = (from wa_data in dtWAData.AsEnumerable()
                                                select new DCRCalendarModel
                                                {
                                                    year = wa_data["Year"].ToString(),
                                                    month = wa_data["Month"].ToString(),
                                                    day = wa_data["Day"].ToString(),
                                                    start = wa_data["Month"].ToString() + "/" + wa_data["Day"].ToString() + "/" + wa_data["Year"].ToString(),
                                                    title = Convert.ToInt32(wa_data["Status"]) == -1 ? "WA-" + masterController.GetFlagFullName(wa_data["Flag"].ToString())

                                                        : Convert.ToInt32(wa_data["Status"]) == -2 ? "Off-" + masterController.GetFlagFullName(wa_data["Flag"].ToString()) : masterController.GetFlagFullName(wa_data["Flag"].ToString()) + " " + Enum.GetName(typeof(DCRStatus), Convert.ToInt32(wa_data["Status"])),
                                                    isTP = "",
                                                    url = "#",
                                                    className = wa_data["Status"].ToString()
                                                }).ToList<DCRCalendarModel>();
            dcrJSON.Add(Json(lstWAData));
            BLRegion objBLRegion = new BLRegion();
            List<WeekendDaysForARegion> lstWeekEnd = objBLRegion.GetWeekendDaysForARegion(companyCode, regionCode, startDate, endDate);
            dcrJSON.Add(Json(lstWeekEnd));

            if (dtSSData.Rows.Count > 0)
            {

                List<DCRLockModel> lstSSDCRLock = (from Master_Data in dtSSData.AsEnumerable()
                                                   select new DCRLockModel
                                                   {
                                                       SS_Applied_Lock = Master_Data["Lock_Status"].ToString(),
                                                       Previous_Month_Year = Convert.ToDateTime(Master_Data["Previous_Month_Year"]).ToString("dd-MM-yyyy"),
                                                       SS_Id = Convert.ToInt32(Master_Data["SS_Id"])
                                                   }).ToList<DCRLockModel>();


                dcrJSON.Add(Json(lstSSDCRLock));

            }

            return Json(dcrJSON);
        }

        public string InsertDCRLock(string mode, string type, string releasedDate)
        {
            string lockType = type == "DCR" ? "IDLE_DCR" : "TP_UNAVAILABILITY";
            string result = _objSPData.InsertDCRLock(mode, lockType, releasedDate);
            return result;
        }

        public string InsertDCRLockLeave(string lockedDates)
        {
            string result = _objSPData.InsertDCRLockLeave(lockedDates);
            return result;
        }

        public int GetCountforDCRRestrictDate(string DCR_Date)
        {
            _objSPData = new SPData();
            _objcurrentInfo = new CurrentInfo();
            string company_Code = _objcurrentInfo.GetCompanyCode();
            string user_Code = _objcurrentInfo.GetUserCode();
            return _objSPData.GetCountforDCRRestrictDate(company_Code, user_Code, DCR_Date);
        }

        private string GetGreyTipPayRollShortNameConfigValue()
        {
            _objcurrentInfo = new CurrentInfo();
            IConfigSettings IConfig_Settings = new Config_Settings();
            string companyCode = _objcurrentInfo.GetCompanyCode();

            // Retrives the DCR_ENTRY_TIME_GAP value.
            string LEAVE_SHORT_NAME = IConfig_Settings.GetConfigDefaultValue(companyCode, CONFIG_TYPE.DCR,
                CONFIG_KEY.PAYROLL_VENDOR_SHORT_NAME);

            // Returns the dcrTimeGapValue.
            return LEAVE_SHORT_NAME;
        }

        private string GetUnapprovedDCRCheckConfigValue()
        {
            _objcurrentInfo = new CurrentInfo();
            IConfigSettings IConfig_Settings = new Config_Settings();
            string companyCode = _objcurrentInfo.GetCompanyCode();

            // Retrives the DCR_ENTRY_TIME_GAP value.
            string CHK_UNAPPROVED_DCR_SEQ = IConfig_Settings.GetConfigDefaultValue(companyCode, CONFIG_TYPE.DCR,
                CONFIG_KEY.DCR_UNAPPROVED_INCLUDE_IN_SEQ);

            // Returns the dcrTimeGapValue.
            return CHK_UNAPPROVED_DCR_SEQ;
        }

        #region - DCR - Single Activity Per Day
        /// <summary>
        /// Get Single activity per day config values
        /// </summary>
        /// <returns></returns>
        public string GetSingleActivityperday()
        {
            _objcurrentInfo = new CurrentInfo();
            //IConfigSettings _Objconfigsettings = new Config_Settings();
            //string SINGLE_ACTIVITY_PER_DAY = _Objconfigsettings.GetConfigDefaultValue(_objcurrentInfo.GetCompanyCode(), CONFIG_TYPE.DCR, CONFIG_KEY.SINGLE_ACTIVITY_PER_DAY);
            string SINGLE_ACTIVITY_PER_DAY = _objcurrentInfo.GetPrivilegeValue("SINGLE_ACTIVITY_PER_DAY", "MULTIPLE");
            return SINGLE_ACTIVITY_PER_DAY;
        }

        public string GetLeaveEntryMode()
        {
            _objcurrentInfo = new CurrentInfo();
            string Leave_Entry_Mode = _objcurrentInfo.GetPrivilegeValue("LEAVE_ENTRY_MODE", "FULL_DAY");
            return Leave_Entry_Mode;
        }
        #endregion - DCR - Single Activity Per Day

        public string GetpendingDCR()
        {
            string url = string.Empty;
            DataControl.BLMaster _objMaster = new DataControl.BLMaster();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string userCode = _objcurrentInfo.GetUserCode();
            string currentdate = DateTime.Now.ToString("yyyy-MM-dd");
            string dcrApprovalManagerPriv = _objcurrentInfo.GetPrivilegeValue("PENDING_APPROVAL_COUNT", "0");
            int ApprovalPrivilageCount = Convert.ToInt32(dcrApprovalManagerPriv);
            if (ApprovalPrivilageCount > 0)
            {
                int childuersappliedDcrCount = _objMaster.GetAppliedDCRChildUsersCount(companyCode, userCode, currentdate);
                if (childuersappliedDcrCount > ApprovalPrivilageCount)
                {
                    url = "HiDoctor_Master/Approval/DCRApproval";
                }
            }
            return url;
        }

        public int GetPendingApprovedTPUsersCount()
        {
            try
            {
                DataControl.BL_DCRHeader _objDCRHeader = new DataControl.BL_DCRHeader();
                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                string companyCode = _objcurrentInfo.GetCompanyCode();
                string userCode = _objcurrentInfo.GetUserCode();

                return _objDCRHeader.GetAppliedTPUsersCount(companyCode, userCode);
            }
            catch
            {
                throw;
            }


        }

        public int GetPendingApprovedSSUsersCount()
        {
            try
            {
                DataControl.BL_DCRHeader _objDCRHeader = new DataControl.BL_DCRHeader();
                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                string companyCode = _objcurrentInfo.GetCompanyCode();
                string userCode = _objcurrentInfo.GetUserCode();

                return _objDCRHeader.GetAppliedSSUsersCount(companyCode, userCode);
            }
            catch
            {
                throw;
            }


        }


        public JsonResult CheckTPAvailableForSelectedDCRDates(string DCRDates)
        {
            try
            {
                _objSPData = new SPData();
                _objcurrentInfo = new CurrentInfo();

                string company_Code = _objcurrentInfo.GetCompanyCode();
                string user_Code = _objcurrentInfo.GetUserCode();
                string region_Code = _objcurrentInfo.GetRegionCode();

                List<string> lstDCRDates = _objSPData.CheckTPAvailableForSelectedDCRDates(company_Code, user_Code, region_Code, DCRDates);

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

        public int GetDCREntryBasedOnPrivilege(string dcrDate, string flag)
        {
            int result = 1;
            try
            {
                _objSPData = new SPData();
                _objcurrentInfo = new CurrentInfo();

                string company_Code = _objcurrentInfo.GetCompanyCode();
                string user_Code = _objcurrentInfo.GetUserCode();
                if (flag == "FIELD" || flag == "FIELD_RCPA")
                {
                    flag = "F";
                }
                else if (flag == "ATTENDANCE")
                {
                    flag = "A";
                }
                else
                {
                    flag = "L";
                }
                result = _objSPData.GetDCREntryBasedOnPrivilege(company_Code, user_Code, dcrDate, flag);
            }
            catch(Exception ex)
            {
                throw ex;
            }
            return result;
        }
        public JsonResult Getlockedstockiestname(int SS_Id)
        {
            try
            {
                DataControl.BL_DCRHeader _objDCRHeader = new DataControl.BL_DCRHeader();
                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                string RegionCode = objCurInfo.GetUserCode();
                return Json(_objDCRHeader.Getlockedstockiestname(RegionCode, SS_Id), JsonRequestBehavior.AllowGet);
            }
            catch
            {
                throw;
            }

        }
    }
  
    #endregion Public Methods
}


