namespace HiDoctor.Controllers
{
    #region Usings
    using System.Web.Mvc;

    using DataControl;
    using DataControl.HiDoctorFactoryClasses;
    using DataControl.HiDoctor_ActivityFactoryClasses;
    using MVCModels;
    using DataControl.Impl;
    using DataControl.Abstraction;
    using DataControl.EnumType;
    #endregion Usings

    [AjaxSessionActionFilter]
    public class DashBoardLandingPageController : Controller
    {
        #region Action Results
        /// <summary>
        /// Dashboard landing page.
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            // create intances.
            CurrentInfo objInfo = new CurrentInfo();
            BLDashBoardLanding objDash = new BLDashBoardLanding(objInfo.GetCompanyCode());
            ViewBag.User_Code = objInfo.GetUserCode();
            int teamCount = objDash.GetImmediateChildUserCount(objInfo.GetUserCode());
            ViewBag.teamCount = teamCount;
            ViewBag.CompanyCode = objInfo.GetCompanyCode();
            ViewBag.Region_Code = objInfo.GetRegionCode();
            return View();
        }
        #endregion Action Results

        /// <summary>
        //  Get Team DCR Approval Count.
        /// its only picking immediate users count. Not an entire reporting list.
        /// </summary>
        /// <returns>int</returns>
        public int GetDCRPendingApprovalCountForTeam()
        {
            // create intances.
            CurrentInfo objInfo = new CurrentInfo();
            BLDashBoardLanding objDash = new BLDashBoardLanding(objInfo.GetCompanyCode());

            // get DCR Pending approval count.
            return objDash.GetPendingApprovalCountForTeam(objInfo.GetCompanyCode(), objInfo.GetUserCode(), DashBoardLanding.Entity.DCR);
        }

        /// <summary>
        /// Get Team TP Count for Approval.
        /// its only picking immediate users count. Not an entire reporting list.
        /// </summary>
        /// <returns>int</returns>
        public int GetTPPendingApprovalCountForTeam()
        {
            // create instances
            CurrentInfo objInfo = new CurrentInfo();
            BLDashBoardLanding objDash = new BLDashBoardLanding(objInfo.GetCompanyCode());

            // get TP Pending Approval count.
            return objDash.GetPendingApprovalCountForTeam(objInfo.GetCompanyCode(), objInfo.GetUserCode(), DashBoardLanding.Entity.TP);
        }

        /// <summary>
        /// Get Team Expense claims for Approval.
        /// Its get entire reporting user list.
        /// </summary>
        /// <returns>int</returns>
        public int GetExpenseClaimPendingApprovalCountForTeam()
        {
            // Cretaes Instance.
            CurrentInfo objInfo = new CurrentInfo();
            BLDashBoardLanding objDash = new BLDashBoardLanding(objInfo.GetCompanyCode());

            // Get Count for Entire Team Applied Expense claims.
            return objDash.GetPendingApprovalCountForTeam(objInfo.GetCompanyCode(), objInfo.GetUserCode(), DashBoardLanding.Entity.EXPNESECLAIM);
        }

        /// <summary>
        /// Retrieve My Unapproved DCR Count.
        /// </summary>
        /// <returns>int</returns>
        public int GetMyDCRUnapprovedCount()
        {
            // Cretaes Instance.
            CurrentInfo objInfo = new CurrentInfo();
            BLDashBoardLanding objDash = new BLDashBoardLanding(objInfo.GetCompanyCode());

            // Get My Unapprove DCR.
            return objDash.GetMyUnapprovedEntries(objInfo.GetUserCode(), objInfo.GetRegionCode(), DashBoardLanding.Entity.DCR);

        }


        /// <summary>
        /// Retrieve My Unapproved TP Count.
        /// </summary>
        /// <returns>int</returns>
        public int GetMyTPUnapprovedCount()
        {
            // Cretaes Instance.
            CurrentInfo objInfo = new CurrentInfo();
            BLDashBoardLanding objDash = new BLDashBoardLanding(objInfo.GetCompanyCode());

            // Get My Unapprove TP.
            return objDash.GetMyUnapprovedEntries(objInfo.GetUserCode(), objInfo.GetRegionCode(), DashBoardLanding.Entity.TP);

        }

        /// <summary>
        /// Retrieve My Expense Claim Count.
        /// </summary>
        /// <returns>int</returns>
        public int GetMyExpenseClaimUnapprovedCount()
        {
            // Cretaes Instance.
            CurrentInfo objInfo = new CurrentInfo();
            BLDashBoardLanding objDash = new BLDashBoardLanding(objInfo.GetCompanyCode());

            // Get My Unapproved claims.
            return objDash.GetMyUnapprovedEntries(objInfo.GetUserCode(), objInfo.GetRegionCode(), DashBoardLanding.Entity.EXPNESECLAIM);

        }

        /// <summary>
        /// Retrive the Unread Messaging count.
        /// </summary>
        /// <returns>int</returns>
        public int GetMyUnreadMessageCount()
        {
            // Cretaes Instance.
            CurrentInfo objInfo = new CurrentInfo();
            BLDashBoardLanding objDash = new BLDashBoardLanding(objInfo.GetCompanyCode());

            // Get My Unapproved claims.
            return objDash.GetMyPendingNotifications(objInfo.GetUserCode(), DashBoardLanding.Entity.MESSAGING);
        }

        /// <summary>
        /// Retrieve the Unread NoticeBoard.
        /// </summary>
        /// <returns></returns>
        public int GetMyUnreadNoticeBoard()
        {
            // Cretaes Instance.
            CurrentInfo objInfo = new CurrentInfo();
            BLDashBoardLanding objDash = new BLDashBoardLanding(objInfo.GetCompanyCode());

            // Get My Unapproved claims.
            return objDash.GetMyPendingNotifications(objInfo.GetUserCode(), DashBoardLanding.Entity.NOTICEBOARD);
        }


        /// <summary>
        /// Retrieve the pending tasks.
        /// </summary>
        /// <returns>JsonResult</returns>

        [HttpGet]
        public JsonResult GetMyTaskCount()
        {
            BL_ICE objtskscount = new BL_ICE();
            CurrentInfo objInfo = new CurrentInfo();
            return Json(objtskscount.GetTaskLiveCount(objInfo.GetCompanyCode(), objInfo.GetUserCode(), objInfo.GetUserName()), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDCRApprovalMenuAccess()
        {
            CurrentInfo _objcurrentInfo = new CurrentInfo();
            BLDashBoardLanding objDash = new BLDashBoardLanding(_objcurrentInfo.GetUserTypeCode());
            return Json(objDash.GetDCRApprovalMenuAccessList(_objcurrentInfo.GetUserTypeCode()), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetTPApprovalMenuAccess()
        {
            CurrentInfo _objcurrentInfo = new CurrentInfo();
            BLDashBoardLanding objDash = new BLDashBoardLanding(_objcurrentInfo.GetUserTypeCode());
            return Json(objDash.GetTPApprovalMenuAccessList(_objcurrentInfo.GetUserTypeCode()), JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Retrive the Inward Acknowledgement Value.
        /// </summary>
        /// <returns>JsonResult</returns>
        public JsonResult GetUserDashboardInwardAcknowlegementConfigValue()
        {
            CurrentInfo _objcurrentInfo = new CurrentInfo();
            IConfigSettings IConfig_Settings = new Config_Settings();
            string INWARD_ACKNOWLEDGEMENT_NEEDED = IConfig_Settings.GetConfigDefaultValue(_objcurrentInfo.GetCompanyCode(), CONFIG_TYPE.INWARD, CONFIG_KEY.INWARD_ACKNOWLEDGEMENT_NEEDED);
            return Json(INWARD_ACKNOWLEDGEMENT_NEEDED, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetDCRPendingUserList()
        {
            CurrentInfo _objcurrentInfo = new CurrentInfo();
            BLDashBoardLanding objDash = new BLDashBoardLanding(_objcurrentInfo.GetCompanyCode());
            return Json(objDash.GetPendingApprovalUserList(_objcurrentInfo.GetUserCode(), DashBoardLanding.Entity.DCR),JsonRequestBehavior.AllowGet);

        }

        [HttpGet]
        public JsonResult GetTPPendingUserList()
        {
            CurrentInfo _objcurrentInfo = new CurrentInfo();
            BLDashBoardLanding objDash = new BLDashBoardLanding(_objcurrentInfo.GetCompanyCode());
            return Json(objDash.GetPendingApprovalUserList(_objcurrentInfo.GetUserCode(), DashBoardLanding.Entity.TP), JsonRequestBehavior.AllowGet);

        }

        [HttpGet]
        public JsonResult GetExpenseClaimPendingUserList()
        {
            CurrentInfo _objcurrentInfo = new CurrentInfo();
            BLDashBoardLanding objDash = new BLDashBoardLanding(_objcurrentInfo.GetCompanyCode());
            return Json(objDash.GetPendingApprovalUserList(_objcurrentInfo.GetUserCode(), DashBoardLanding.Entity.EXPNESECLAIM),JsonRequestBehavior.AllowGet);

        }

        [HttpGet]
        public JsonResult GetUnapproveDCRList()
        {
            CurrentInfo _objcurrentInfo = new CurrentInfo();
            BLDashBoardLanding objDash = new BLDashBoardLanding(_objcurrentInfo.GetCompanyCode());
            return Json(objDash.GetUnapproveDCRList(_objcurrentInfo.GetUserCode()), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetAppliedDCR(string userCode)
        {
            CurrentInfo _objcurrentInfo = new CurrentInfo();
            BLDashBoardLanding objDash = new BLDashBoardLanding(_objcurrentInfo.GetCompanyCode());
            return Json(objDash.GetMyAppliedDCRDetails(userCode), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetUnapproveTPList()
        {
            CurrentInfo _objcurrentInfo = new CurrentInfo();
            BLDashBoardLanding objDash = new BLDashBoardLanding(_objcurrentInfo.GetCompanyCode());
            return Json(objDash.GetUnapproveTPList(_objcurrentInfo.GetUserCode()), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetAppliedTPList(string userCode, int tptype)
        {
            CurrentInfo _objcurrentInfo = new CurrentInfo();
            BLDashBoardLanding objDash = new BLDashBoardLanding(_objcurrentInfo.GetCompanyCode());
            return Json(objDash.GetMyAppliedTPDetails(userCode,tptype), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetUnapproveExpenseClaimList()
        {
            CurrentInfo _objcurrentInfo = new CurrentInfo();
            BLDashBoardLanding objDash = new BLDashBoardLanding(_objcurrentInfo.GetCompanyCode());
            return Json(objDash.GetUnapproveExpenseClaimList(_objcurrentInfo.GetUserCode()), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetAppliedExpenseClaimList(string userCode)
        {
            CurrentInfo _objcurrentInfo = new CurrentInfo();
            BLDashBoardLanding objDash = new BLDashBoardLanding(_objcurrentInfo.GetCompanyCode());
            return Json(objDash.GetMyAppliedExpenseClaimsDetails(userCode), JsonRequestBehavior.AllowGet);
        }


        [HttpGet]
        public JsonResult GetUserRegionholidays()
        {
            CurrentInfo _objcurrentInfo = new CurrentInfo();
            BLDashBoardLanding objDash = new BLDashBoardLanding(_objcurrentInfo.GetCompanyCode());
            return Json(objDash.GetUserRegionholidays(_objcurrentInfo.GetRegionCode()), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetEmployeeBirthdays()
        {
            CurrentInfo _objcurrentInfo = new CurrentInfo();
            BLDashBoardLanding objDash = new BLDashBoardLanding(_objcurrentInfo.GetCompanyCode());
            return Json(objDash.GetEmployeeBirthdays(), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetDoctorBirthdays()
        {
            CurrentInfo _objcurrentInfo = new CurrentInfo();
            BLDashBoardLanding objDash = new BLDashBoardLanding(_objcurrentInfo.GetCompanyCode());
            return Json(objDash.GetDoctorBirthdays(_objcurrentInfo.GetRegionCode()), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetDoctorAnniversary()
        {
            CurrentInfo _objcurrentInfo = new CurrentInfo();
            BLDashBoardLanding objDash = new BLDashBoardLanding(_objcurrentInfo.GetCompanyCode());
            return Json(objDash.GetDoctorAnniversary(_objcurrentInfo.GetRegionCode()), JsonRequestBehavior.AllowGet);
        }
        
        [HttpGet]
        public JsonResult GetBirthdayAnniversaryCount()
        {
            CurrentInfo _objcurrentInfo = new CurrentInfo();
            BLDashBoardLanding objDash = new BLDashBoardLanding(_objcurrentInfo.GetCompanyCode());
            return Json(objDash.GetBirthdayAnniversaryCount(_objcurrentInfo.GetRegionCode()), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetLockDetails()
        {
            CurrentInfo _objcurrentInfo = new CurrentInfo();
            BLDashBoardLanding objDash = new BLDashBoardLanding(_objcurrentInfo.GetCompanyCode());
            return Json(objDash.GetLockDetails(_objcurrentInfo.GetUserCode()), JsonRequestBehavior.AllowGet);
        }
    }
}