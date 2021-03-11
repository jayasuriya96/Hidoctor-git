using System;
using System.Collections.Generic;
using System.Linq;

using System.Web;
using System.Web.Mvc;
using DataControl;
using DataControl;
using DataControl.Impl;
using System.Text;
namespace HiDoctor_Activity.Controllers
{
    [AjaxSessionActionFilter]
    public class MobileNotificationController : Controller
    {
        //
        // GET: /MobileNotification/

        #region Private variales

        MasterController objMaster = new MasterController();
        DataControl.CurrentInfo objCurr = new DataControl.CurrentInfo();
        #endregion

        public ActionResult Index()
        {
            if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
            {
                return View("Index.Mobile");
            }
            return View();
        }
        public ActionResult Messages()
        {
            if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
            {
                return View("Messages.Mobile");
            }
            return View();
        }
        public ActionResult Announcements()
        {
            if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
            {
                return View("Announcements.Mobile");
            }
            return View();
        }

        public ActionResult DCRLockRelease()
        {
            if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
            {
                return View("DCRLockRelease.Mobile");
            }
            return View();
        }

        public ActionResult DCRLockDetail(string userCode)
        {
            ViewBag.userCode = userCode;
            if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
            {
                return View("DCRLockDetail.Mobile");
            }
            return View();
        }

        // Messages
        public int GetUnreadMessageCount()
        {
            int msgCount = 0;
            DataControl.BLMessaging objMsg = new DataControl.BLMessaging();
            msgCount = objMsg.GetUnreadMessageCount(objCurr.GetCompanyCode(), objCurr.GetUserCode());
            return msgCount;
        }

        public string GetMessagesForUser(int pageNo, int isPrevious)
        {
            try
            {
                List<MVCModels.MessagingModel> lstAllMsg = new List<MVCModels.MessagingModel>();
                double totalPageCnt = 0;
                int currentpage = 0;
                StringBuilder sbTbl = new StringBuilder();

                currentpage = pageNo + isPrevious;
                DataControl.BLMessaging objMsg = new DataControl.BLMessaging();
                lstAllMsg = (List<MVCModels.MessagingModel>)objMsg.GetMessagesForUser(objCurr.GetCompanyCode(), objCurr.GetUserCode()).ToList();
                var lstPage = lstAllMsg.Skip((currentpage - 1) * 5).Take(5);

                totalPageCnt = Math.Ceiling(Convert.ToDouble(lstAllMsg.Count) / Convert.ToDouble(5));

                if (lstAllMsg.Count > 0)
                {
                    sbTbl.Append("<ul data-role='listview' data-divider-theme='b' data-inset='true'>");
                    sbTbl.Append("<li data-role='list-divider' role='heading'>Messages</li>");
                    foreach (var msg in lstPage)
                    {
                        string className = "";
                        string statusName = "";
                        if (msg.IsRead == "1")
                        {
                            statusName = "Read";
                            className = "class='lstNotBold'";
                        }
                        else
                        {
                            statusName = "Unread";
                            className = "class='lstBold'";
                        }
                        sbTbl.Append("<li data-theme='c' >");
                        sbTbl.Append("<a href='#' data-transition='slide' onclick='fnOpenDetailMessage(\"" + msg.Msg_Code + "\")'>");
                        sbTbl.Append("<span " + className + ">" + msg.Employee_Name + " (" + msg.Sender + ")" + "</span>");
                        sbTbl.Append("<span " + className + "><span style='float:left;'>Sub : </span><span style='float:left;width:80%;white-space: normal;'>" + msg.Subject + "</span></span>");
                        sbTbl.Append("<span " + className + " style='text-align:right;'>" + msg.Date_From + "</span>");
                        sbTbl.Append("<span " + className + ">Status : " + statusName + "</span>");
                        sbTbl.Append("</a>");
                        sbTbl.Append("</li>");
                    }

                    sbTbl.Append("</ul>");
                }
                return totalPageCnt.ToString() + '^' + currentpage.ToString() + '^' + sbTbl.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("pageNo", pageNo.ToString());
                dicObj.Add("isPrevious", isPrevious.ToString());
                ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return "FAIL^" + ex.Message;
            }
        }

        public LargeJsonResult GetMessageFullDetail(string msgCode)
        {
            try
            {
                List<MVCModels.MessagingModel> lstAllMsg = new List<MVCModels.MessagingModel>();
                List<MVCModels.MessagingModel> lstPreviousNextMsg = new List<MVCModels.MessagingModel>();
                StringBuilder sbTbl = new StringBuilder();

                DataControl.BLMessaging objMsg = new DataControl.BLMessaging();
                lstAllMsg = (List<MVCModels.MessagingModel>)objMsg.GetSelectedMessageDetails(objCurr.GetCompanyCode(), msgCode, objCurr.GetUserCode()).ToList();
                lstPreviousNextMsg = (List<MVCModels.MessagingModel>)objMsg.GetPreviousAndNextMsgCode(objCurr.GetCompanyCode(), objCurr.GetUserCode(), msgCode).ToList();

                List<JsonResult> lst = new List<JsonResult> { Json(lstAllMsg, JsonRequestBehavior.AllowGet),
                                                              Json(lstPreviousNextMsg, JsonRequestBehavior.AllowGet)
                                                                     };

                return new LargeJsonResult
                {
                    MaxJsonLength = Int32.MaxValue,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                    Data = new
                    {
                        total = lstAllMsg.Count + lstPreviousNextMsg.Count,
                        data = lst
                    }
                };
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("msgCode", msgCode);
                ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
        }
        public LargeJsonResult GetMessageToCCDetail(string msgCode)
        {
            try
            {
                List<MVCModels.MessagingModel> lstAllMsg = new List<MVCModels.MessagingModel>();
                List<MVCModels.MessagingModel> lstMsg = new List<MVCModels.MessagingModel>();
                StringBuilder sbTbl = new StringBuilder();

                DataControl.BLMessaging objMsg = new DataControl.BLMessaging();
                lstAllMsg = (List<MVCModels.MessagingModel>)objMsg.GetSelectedMsgDetails(objCurr.GetCompanyCode(), msgCode, objCurr.GetUserCode()).ToList();
                List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
                lstUser = (List<MVCModels.HiDoctor_Master.UserModel>)objMsg.GetUsersForMessaging(objCurr.GetCompanyCode(), objCurr.GetUserCode());

                foreach (MVCModels.MessagingModel userMsg in lstAllMsg)
                {

                    IEnumerable<MVCModels.HiDoctor_Master.UserModel> lstModel = lstUser.Where(c => c.User_Code == userMsg.Target_Address);
                    if (lstModel.ToList().Count > 0)
                    {
                        lstMsg.Add(userMsg);
                    }
                }
                //var a = (from msgUser in lstAllMsg
                //         join user in lstUser on msgUser.Target_Address equals user.User_Code
                //         where msgUser.Target_Address != user.User_Code
                //         select (msgUser));

                //lstAllMsg = a.ToList();
                return new LargeJsonResult
                {
                    MaxJsonLength = Int32.MaxValue,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                    Data = new
                    {
                        total = lstMsg.Count,
                        data = lstMsg
                    }
                };
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("msgCode", msgCode);
                ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
        }

        public JsonResult GetChildUsers()
        {
            try
            {
                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                DataControl.BLMessaging objMsg = new DataControl.BLMessaging();
                DataControl.JSONConverter objJson = new DataControl.JSONConverter();
                List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
                lstUser = (List<MVCModels.HiDoctor_Master.UserModel>)objMsg.GetUsersForMessaging(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode());
                return Json(lstUser);
            }
            catch
            {
                throw;
            }
        }

        //

        //Announcements
        public int GetUnreadAnnouncementCount()
        {
            int msgCount = 0;
            DataControl.BLMessaging objMsg = new DataControl.BLMessaging();
            msgCount = objMsg.GetUnreadAnnouncementCount(objCurr.GetCompanyCode(), objCurr.GetUserCode());
            return msgCount;
        }

        public string GetAnnouncementForUser(int pageNo, int isPrevious)
        {
            try
            {
                List<MVCModels.NoticeboardAgentMSGModel> lstAllMsg = new List<MVCModels.NoticeboardAgentMSGModel>();
                double totalPageCnt = 0;
                int currentpage = 0;
                StringBuilder sbTbl = new StringBuilder();

                currentpage = pageNo + isPrevious;
                DataControl.BLMessaging objMsg = new DataControl.BLMessaging();
                lstAllMsg = (List<MVCModels.NoticeboardAgentMSGModel>)objMsg.GetAnnouncementForUser(objCurr.GetCompanyCode(), objCurr.GetUserCode()).ToList();
                var lstPage = lstAllMsg.Skip((currentpage - 1) * 5).Take(5);

                totalPageCnt = Math.Ceiling(Convert.ToDouble(lstAllMsg.Count) / Convert.ToDouble(5));

                if (lstAllMsg.Count > 0)
                {
                    sbTbl.Append("<ul data-role='listview' data-divider-theme='b' data-inset='true'>");
                    sbTbl.Append("<li data-role='list-divider' role='heading'>Announcement</li>");
                    foreach (var msg in lstPage)
                    {
                        string className = "";
                        string statusName = "";
                        if (msg.IsRead == "Y")
                        {
                            statusName = "Read";
                            className = "class='lstNotBold'";
                        }
                        else
                        {
                            statusName = "Unread";
                            className = "class='lstBold'";
                        }
                        sbTbl.Append("<li data-theme='c' >");
                        sbTbl.Append("<a href='#' data-transition='slide' onclick='fnOpenDetailMessage(\"" + msg.Msg_Code + "\")'>");
                        sbTbl.Append("<span " + className + ">" + msg.Employee_Name + " (" + msg.Sender + ")" + "</span>");
                        sbTbl.Append("<span " + className + "><span style='float:left;'>Sub : </span><span style='float:left;width:80%;white-space: normal;'>" + msg.Title + "</span></span>");
                        sbTbl.Append("<span " + className + ">Active Period : " + msg.Date_From + " to " + msg.Date_To + "</span>");
                        //sbTbl.Append("<span " + className + ">Status : " + statusName + "</span>");
                        sbTbl.Append("</a>");
                        sbTbl.Append("</li>");
                    }

                    sbTbl.Append("</ul>");
                }
                return totalPageCnt.ToString() + '^' + currentpage.ToString() + '^' + sbTbl.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("pageNo", pageNo.ToString());
                dicObj.Add("isPrevious", isPrevious.ToString());
                ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return "FAIL^" + ex.Message;
            }
        }

        public JsonResult GetAnnouncementFullDetail(string msgCode)
        {
            try
            {
                List<MVCModels.NoticeBoardContentModel> lstAllMsg = new List<MVCModels.NoticeBoardContentModel>();
                List<MVCModels.NoticeboardAgentMSGModel> lstPreviousNextMsg = new List<MVCModels.NoticeboardAgentMSGModel>();
                JSONConverter objJson = new JSONConverter();
                StringBuilder sbTbl = new StringBuilder();
                DataControl.HiDoctor_ActivityFactoryClasses.BL_NoticeBoard objNot = new DataControl.HiDoctor_ActivityFactoryClasses.BL_NoticeBoard();

                DataControl.BLMessaging objMsg = new DataControl.BLMessaging();
                lstAllMsg = (List<MVCModels.NoticeBoardContentModel>)objNot.GetNoticeBoardPopup(objCurr.GetCompanyCode(), msgCode, objCurr.GetUserCode()).ToList();
                lstPreviousNextMsg = (List<MVCModels.NoticeboardAgentMSGModel>)objMsg.GetPreviousAndNextAnnouncementCode(objCurr.GetCompanyCode(), objCurr.GetUserCode(), msgCode).ToList();

                List<JsonResult> lst = new List<JsonResult> { Json(lstAllMsg, JsonRequestBehavior.AllowGet),
                                                              Json(lstPreviousNextMsg, JsonRequestBehavior.AllowGet)
                                                                     };

                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("msgCode", msgCode);
                ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
        }
        //

        public JsonResult GetlockUsers(string match)
        {
            List<MVCModels.UserDivisionWise> lstlockUsers = new List<MVCModels.UserDivisionWise>();
            JSONConverter objJson = new JSONConverter();
            DataControl.HiDoctor_ActivityFactoryClasses.BL_NoticeBoard objNot = new DataControl.HiDoctor_ActivityFactoryClasses.BL_NoticeBoard();
            DataControl.BLMessaging objMsg = new DataControl.BLMessaging();
            lstlockUsers = (List<MVCModels.UserDivisionWise>)objNot.GetLockUsersDetails(objCurr.GetCompanyCode(), objCurr.GetUserCode(), match).ToList();

            return Json(lstlockUsers, JsonRequestBehavior.AllowGet);
        }



        public string GetLockDcrDetail(string userCode)
        {
            try
            {
                List<MVCModels.DcrLockDetail> lst = new List<MVCModels.DcrLockDetail>();

                StringBuilder sbTbl = new StringBuilder();
                DataControl.HiDoctor_ActivityFactoryClasses.BL_NoticeBoard objNot = new DataControl.HiDoctor_ActivityFactoryClasses.BL_NoticeBoard();
                lst = (List<MVCModels.DcrLockDetail>)objNot.GetDcrLockedetails(objCurr.GetCompanyCode(), userCode).ToList();
                if (lst.Count > 0)
                {
                    sbTbl.Append("<ul data-role='listview' data-divider-theme='b' data-inset='true'>");
                    sbTbl.Append("<li data-role='list-divider' role='heading'>Lock Detail</li>");
                    int rowNo = 0;
                    foreach (var item in lst)
                    {
                        rowNo++;
                        sbTbl.Append("<li data-theme='c' >");

                        sbTbl.Append("<input type='checkbox' id='rowcheckbox_" + rowNo + "' name='checkbox-0'>");
                        sbTbl.Append("<label for='rowcheckbox_" + rowNo + "'>");

                        sbTbl.Append("<span style='display:none'>user:" + item.User_Code + "</span><br>");
                        sbTbl.Append("<span >DCR Date:</span><span id='spnDcrActualDate_" + rowNo + "'>" + item.DCR_Actual_Date + "</span><br>");
                        sbTbl.Append("<span >Lock Date:</span><span id='spnlockedDate_" + rowNo + "'>" + item.LockedDate + "</span><br>");
                        sbTbl.Append("<span >Lock Status:</span><span id='spnLockStatus_" + rowNo + "'>" + item.Lock_Status + "</span><br>");
                        sbTbl.Append("<span >Lock Type:</span><span id='spnLockType_" + rowNo + "'>" + item.Lock_Type + "</span><br>");
                        sbTbl.Append("</label>");
                        sbTbl.Append("</li>");
                    }
                    sbTbl.Append("</ul>");

                }

                return sbTbl.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                return "FAIL^" + ex.Message;
            }
        }

        public string UpdateDCRLockToReleaseMob(string user_Code, string lock_Type, string locked_Date, string dcr_Actual_Date)
        {
            try
            {
                string company_Code = objCurr.GetCompanyCode();
                DataControl.BLApproval _objBlApproval = new DataControl.BLApproval();
                _objBlApproval = new BLApproval();

                MVCModels.DCRActivityLockModel dcrLock = new MVCModels.DCRActivityLockModel();
                dcrLock.Lock_Type = lock_Type;
                dcrLock.Locked_Date = locked_Date;
                dcrLock.DCR_Actual_Date = dcr_Actual_Date;
                dcrLock.User_Code = user_Code;
                dcrLock.Released_By = objCurr.GetUserCode();

                return _objBlApproval.UpdateDCRLockToRelease(company_Code, dcrLock);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Tree Selected user:", user_Code); //Filter indicates UI level filters
                dicContext.Add("Lock Type:", lock_Type); //Filter indicates UI level filters
                dicContext.Add("Locked Date:", locked_Date); //Filter indicates UI level filters
                dicContext.Add("DCR Actual Date:", dcr_Actual_Date); //Filter indicates UI level filters

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return ex.Message;
            }
        }

        #region DCR Lock release
        /// <summary>
        /// Get DCR Lock release dates
        /// </summary>
        /// <param name="userCode"></param>
        /// <returns></returns>
        public string GetDCRLockReleaseDates(string userCode)
        {
            DataControl.HiDoctor_ActivityFactoryClasses.BL_NoticeBoard _objBlNotification = new DataControl.HiDoctor_ActivityFactoryClasses.BL_NoticeBoard();
            List<MVCModels.DCRActivityLockModel> lstDcrlockreleasedates = new List<MVCModels.DCRActivityLockModel>();
            lstDcrlockreleasedates = _objBlNotification.GetDcrLockReleaseDates(objCurr.GetCompanyCode(), userCode, "", "-1", "-1").ToList();
            StringBuilder strTbl = new StringBuilder();
            try
            {
                strTbl.Append("<ul data-role='listview' data-divider-theme='s' data-inset='true'>");
                strTbl.Append("<li data-role='list-divider' role='heading'>DCR Lock Release History</li>");

                if (lstDcrlockreleasedates.Count > 0)
                {


                    foreach (var dcrDetails in lstDcrlockreleasedates)
                    {

                        strTbl.Append("<li data-theme='c' >");
                        strTbl.Append("<label for='rowcheckbox_'>");

                        strTbl.Append("<span >Locked Date:</span><span>" + dcrDetails.Locked_Date + "</span><br>");
                        strTbl.Append("<span >Released Date:</span><span>" + dcrDetails.Released_Date + "</span><br>");
                        strTbl.Append("<span >DCR Actual Date:</span><span>" + dcrDetails.DCR_Actual_Date + "</span><br>");
                        strTbl.Append("<span>Lock Type:</span><span>" + dcrDetails.Lock_Type + "</span><br>");
                        strTbl.Append("<span >Released By:</span><span>" + dcrDetails.Released_By + "</span><br>");

                        strTbl.Append("</label>");
                        strTbl.Append("</li>");

                    }
                    strTbl.Append("</ul>");
                }

                else
                {
                    strTbl.Append("<span style='color:red;'>No Details Available.</span>");
                    strTbl.Append("</ul>");
                }

                return strTbl.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                return ex.Message.ToString();
            }
        }
        #endregion DCR Lock release
    }
}
