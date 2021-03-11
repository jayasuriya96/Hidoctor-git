using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Data;
using MVCModels;
using DataControl;
using System.Web.SessionState;
using Newtonsoft.Json;
using System.Configuration;
using HDQueueService;
using MVCModels.HiDoctor_Master;
using MVCModels.OutputJson;

namespace HiDoctor_Master.Controllers
{

    //[SessionState(SessionStateBehavior.ReadOnly)]
    //[AjaxSessionActionFilter]
    public class ApprovalController : Controller
    {

        #region Private Variables
        private CurrentInfo _objCurr = new CurrentInfo();
        private BLApproval _objApp = new BLApproval();

        private const string COLL_USER_CODE = "userCode";
        private const string COLL_MONTH = "month";
        private const string COLL_YEAR = "year";
        private const string COLL_DCR_FLAG = "dcrFlag";
        private const string COLL_DCR_STATUS = "dcrStatus";
        private const string COLL_DCR_CODE = "dcrCode";
        //var ALLOW_ONLY_LEAVE = "NO";
        private string _queueAccountKey = ConfigurationManager.AppSettings["ServiceBusConnection"].ToString();
        private string _topicName = ConfigurationManager.AppSettings["busDCRTopicName"].ToString();
        private string _subscriptionName = ConfigurationManager.AppSettings["busDCRSubscriptionName"].ToString();

        #endregion Private Variables


        BLApproval _objBLApproval = null;
        public ActionResult Index(string id)
        {
            ViewBag.UserName = _objCurr.GetUserName();
            ViewBag.RegionCode = _objCurr.GetRegionCode();
            ViewBag.Entity = id;
            return View();
        }

        // DCR Lock Release...
        public ActionResult DCRLockRelease()
        {
            DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
            ViewBag.User_Code = _objcurrentInfo.GetUserCode();
            return View();
        }

        public ActionResult DeleteDCR()
        {
            return View();
        }

        public ActionResult DeleteLeaveDCR()
        {
            ViewBag.Company_Code = _objCurr.GetCompanyCode();
            ViewBag.User_Code = _objCurr.GetUserCode();
            ViewBag.Region_Code = _objCurr.GetRegionCode();
            return View();
        }
        public ActionResult DCRApproval()
        {
            var objPathProv = new DataControl.Impl.FileSystemProvider();
            string accKey = objPathProv.GetConfigValue("SurveyURL");
            ViewBag.Company_Code = _objCurr.GetCompanyCode();
            ViewBag.Region_Code = _objCurr.GetRegionCode();
            ViewBag.CompanyId = _objCurr.GetCompanyId();
            ViewBag.accKey = accKey;
            return View();
        }
        public ActionResult NoticeBoardApproval()
        {
            ViewBag.UserCode = _objCurr.GetUserCode();
            return View();
        }
        public ActionResult CPapproval()
        {
            return View();
        }

        public ActionResult SecondarySalesApproval()
        {
            ViewBag.Company_Code = _objCurr.GetCompanyCode();
            ViewBag.User_Code = _objCurr.GetUserCode();
            ViewBag.Region_Code = _objCurr.GetRegionCode();
            return View();
        }
        public ActionResult WideAngleUsersApproval()
        {
            return View();

        }
        public ActionResult DCRLeaveApproval()
        {

            return View();
        }

        public JsonResult GetCustomerRegions(string entity, string status)
        {
            DataControl.BL_Customer _objBlCustomer = new DataControl.BL_Customer();
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            DataSet ds = new DataSet();
            DataControl.JSONConverter _objJson = new DataControl.JSONConverter();
            ds = _objBlCustomer.GetCustomerRegions(_objCurrentInfo.GetCompanyCode(), status, entity);
            return Json(_objJson.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        public string GetCustomersForApproval(string entity, string regionCode, string mode)
        {
            string result = String.Empty;
            int count = 0;
            StringBuilder strCustomer = new StringBuilder();
            DataControl.BL_Customer _objBlCustomer = new DataControl.BL_Customer();
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            List<MVCModels.HiDoctor_Master.DoctorModel> lstDoctor = new List<MVCModels.HiDoctor_Master.DoctorModel>();
            MVCModels.HiDoctor_Master.DoctorModel _objDoctor = new MVCModels.HiDoctor_Master.DoctorModel();
            lstDoctor = _objBlCustomer.GetDoctorsByRegionAndMode(_objCurrentInfo.GetCompanyCode(), regionCode, mode, entity);
            count = lstDoctor.Count;
            strCustomer.Append("<table id='tblCustomer' class='data display datatable' cellspacing=0 cellpadding=0>");
            strCustomer.Append("<thead>");
            strCustomer.Append("<tr>");
            strCustomer.Append("<th>");
            strCustomer.Append("<input type='checkbox' id='chkSelectAll' name='chkSelectAll' onclick='fnCheckAll();' />Select</th>");
            strCustomer.Append("<th>" + entity + " Name</th>");
            strCustomer.Append("<th>MDL Number</th>");
            if (entity.ToUpper() == "DOCTOR")
            {
                strCustomer.Append("<th>Speciality Name</th>");
                strCustomer.Append("<th>Category Name</th>");
                strCustomer.Append("<th>Qualification</th>");
            }
            strCustomer.Append("<th>Start Date</th>");
            if (entity.ToUpper() != "DOCTOR")
            {
                strCustomer.Append("<th>End Date</th>");
            }
            strCustomer.Append("<th>Status</th>");
            if (entity.ToUpper() == "DOCTOR")
            {
                strCustomer.Append("<th>History</th>");
            }
            strCustomer.Append("</tr>");
            strCustomer.Append("</thead>");
            strCustomer.Append("<tbody>");
            if (lstDoctor.Count > 0)
            {
                for (int i = 0; i < lstDoctor.Count; i++)
                {
                    strCustomer.Append("<tr>");
                    // strCustomer.Append("<td MDL='" + lstDoctor[i].MDL_Number.Replace(" ", "|") + "'>");
                    strCustomer.Append("<td>");
                    strCustomer.Append("<input type='checkbox' id='chkSelect_" + i + "' name='chkSelect' class='chkSelect' />");
                    strCustomer.Append("<input type='hidden' id='hdnCustomerCode_" + i + "'");
                    strCustomer.Append("value='" + lstDoctor[i].Customer_Code + "'/><input type='hidden' id='hdnRegionCode_" + i + "'");
                    strCustomer.Append("value='" + lstDoctor[i].Region_Code + "'/></td>");
                    strCustomer.Append("<td   id='hdnCustomerName_" + i + "'>" + lstDoctor[i].Customer_Name + "</td>");
                    strCustomer.Append("<td id='hdnMDLNumber_" + i + "'>" + lstDoctor[i].MDL_Number + "</td>");
                    if (entity.ToUpper() == "DOCTOR")
                    {
                        strCustomer.Append("<td>" + lstDoctor[i].Speciality_Name + "</td>");
                        strCustomer.Append("<input type='hidden' id='hdnSpecialityCode_" + i + "' value='" + lstDoctor[i].Speciality_Code + "'/>");
                        strCustomer.Append("<td>" + lstDoctor[i].Category_Name + "</td>");
                        strCustomer.Append("<input type='hidden' id='hdnCategorycode_" + i + "' value='" + lstDoctor[i].Category + "' />");
                        strCustomer.Append("<td>" + lstDoctor[i].Qualification + "</td>");
                    }
                    strCustomer.Append("<td>" + lstDoctor[i].Effective_From + "</td>");
                    if (entity.ToUpper() != "DOCTOR")
                    {
                        strCustomer.Append("<td>" + lstDoctor[i].Effective_To + "</td>");
                    }
                    strCustomer.Append("<td>" + lstDoctor[i].Customer_Status + "</td>");
                    if (entity.ToUpper() == "DOCTOR")
                    {
                        strCustomer.Append("<td><a onclick='fnViewHistory(\"" + lstDoctor[i].Customer_Code + "\");'>View</a></td>");
                    }
                    strCustomer.Append("</tr>");
                }
            }
            strCustomer.Append("</tbody>");
            strCustomer.Append("</table>");
            return strCustomer.ToString();
        }

        public JsonResult GetDoctorsCheckCounts(string doctorLst, string regionCode)
        {
            List<DoctorApprovalCountsModel> _objDoctorApprovalCountsModel = new List<DoctorApprovalCountsModel>();
            _objDoctorApprovalCountsModel = JsonConvert.DeserializeObject<List<DoctorApprovalCountsModel>>(doctorLst);

            List<DoctorApprovalCountsModel> lstdoctorApprovalCountsModel = new List<DoctorApprovalCountsModel>();
            lstdoctorApprovalCountsModel = (from p in _objDoctorApprovalCountsModel
                                            group p.CategoryCode by p.CategoryCode into g
                                            select new DoctorApprovalCountsModel
                                            {
                                                CategoryCode = g.Key,
                                                SelectedForApproval = g.Count(),
                                                CategoryName = "",
                                            }).ToList();
            _objBLApproval = new BLApproval();
            var doctorCounts = _objBLApproval.GetDoctorApproverMaxCounts(lstdoctorApprovalCountsModel, regionCode);
            return Json(doctorCounts, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDocSpecialityCounts(string docSpecialityLst, string regionCode)
        {

            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            ViewBag.UserName = _objCurrentInfo.GetUserName();
            List<SpecialityDoctorApprovalCountsModel> _objDocSpeciality = new List<SpecialityDoctorApprovalCountsModel>();
            _objDocSpeciality = JsonConvert.DeserializeObject<List<SpecialityDoctorApprovalCountsModel>>(docSpecialityLst);

            List<SpecialityDoctorApprovalCountsModel> lstDocSpeciality = new List<SpecialityDoctorApprovalCountsModel>();
            lstDocSpeciality = (from p in _objDocSpeciality
                                group p.SpecialityCode by p.SpecialityCode into g
                                select new SpecialityDoctorApprovalCountsModel
                                {
                                    SpecialityCode = g.Key,
                                    SelectedForApproval = g.Count(),
                                    Speciality = "",
                                }).ToList();
            _objBLApproval = new BLApproval();
            var DocSpecialityCount = _objBLApproval.GetDocSpecialityCounts(lstDocSpeciality, regionCode, _objCurrentInfo.GetCompanyCode());
            return Json(DocSpecialityCount, JsonRequestBehavior.AllowGet);
        }

        public string CustomerBulkApproval(string tblContent, string action, string entity)
        {
            string result = String.Empty;
            try
            {
                DataControl.BL_Customer _objCustomer = new DataControl.BL_Customer();
                DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
                result = _objCustomer.CustomerBulkApproval(_objCurrentInfo.GetCompanyCode(), tblContent,
                    Guid.NewGuid().ToString(), action, entity, _objCurrentInfo.GetUserName());
            }
            catch (Exception ex)
            {
                result = "ERROR:" + ex.Message;
            }
            return result;
        }

        public string GetCustomerHistory(string customerCode, string regionCode, string entity)
        {
            StringBuilder strCustomer = new StringBuilder();
            DataControl.BL_Customer _objBlCustomer = new DataControl.BL_Customer();
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            IEnumerable<MVCModels.HiDoctor_Master.DoctorModel> lstDoctor = null;
            lstDoctor = _objBlCustomer.GetCustomerHistory(_objCurrentInfo.GetCompanyCode(), customerCode, regionCode, entity);
            List<MVCModels.HiDoctor_Master.DoctorCategoryModel> lstCat = new List<MVCModels.HiDoctor_Master.DoctorCategoryModel>();
            lstCat = _objBlCustomer.GetDoctorCategory(_objCurr.GetCompanyCode());
            BLProduct objProd = new BLProduct();
            List<MVCModels.HiDoctor_Master.SpecialityModel> lstSpeciality = new List<MVCModels.HiDoctor_Master.SpecialityModel>();
            lstSpeciality = objProd.GetSpeciality(_objCurr.GetCompanyCode());
            strCustomer.Append("<table class='table table-striped'>");
            strCustomer.Append("<thead>");
            strCustomer.Append("<tr>");
            strCustomer.Append("<th>Doctor Name</th>");
            strCustomer.Append("<th>MDL Number</th>");
            strCustomer.Append("<th>Speciality Name</th>");
            strCustomer.Append("<th>Category Name</th>");
            strCustomer.Append("<th>Doctor Status</th>");
            strCustomer.Append("<th>Changed Column Name</th>");
            strCustomer.Append("<th>Old Value</th>");
            strCustomer.Append("<th>New Value</th>");
            strCustomer.Append("</tr>");
            strCustomer.Append("</thead>");
            strCustomer.Append("<tbody>");
            if (lstDoctor != null)
            {
                foreach (var dr in lstDoctor)
                {
                    strCustomer.Append("<tr>");
                    strCustomer.Append("<td>" + dr.Customer_Name + "</td>");
                    strCustomer.Append("<td>" + dr.MDL_Number + "</td>");
                    strCustomer.Append("<td>" + dr.Speciality_Name + "</td>");
                    strCustomer.Append("<td>" + dr.Category_Name + "</td>");
                    strCustomer.Append("<td>" + dr.Customer_Status + "</td>");
                    strCustomer.Append("<td>" + dr.Changed_Column_Name + "</td>");
                    if (dr.Changed_Column_Name == "Speciality")
                    {
                        var filtered = lstSpeciality.AsEnumerable().Where(z => z.Speciality_Code == dr.Old_Value).ToList();
                        if (filtered.Count > 0)
                        {
                            strCustomer.Append("<td>" + filtered[0].Speciality_Name + "</td>");
                        }
                        else
                        {
                            strCustomer.Append("<td>" + dr.Old_Value + "</td>");
                        }
                    }
                    else if (dr.Changed_Column_Name == "Category")
                    {
                        var filtered = lstCat.AsEnumerable().Where(z => z.Category_Code == dr.Old_Value).ToList();
                        if (filtered.Count > 0)
                        {
                            strCustomer.Append("<td>" + filtered[0].Category_Name + "</td>");
                        }
                        else
                        {
                            strCustomer.Append("<td>" + dr.Old_Value + "</td>");
                        }
                    }
                    else
                    {
                        strCustomer.Append("<td>" + dr.Old_Value + "</td>");
                    }
                    if (dr.Changed_Column_Name == "Speciality")
                    {
                        var filtered = lstSpeciality.AsEnumerable().Where(z => z.Speciality_Code == dr.New_Value).ToList();
                        if (filtered.Count > 0)
                        {
                            strCustomer.Append("<td>" + filtered[0].Speciality_Name + "</td>");
                        }
                        else
                        {
                            strCustomer.Append("<td>" + dr.New_Value + "</td>");
                        }
                    }
                    else if (dr.Changed_Column_Name == "Category")
                    {
                        var filtered = lstCat.AsEnumerable().Where(z => z.Category_Code == dr.New_Value).ToList();
                        if (filtered.Count > 0)
                        {
                            strCustomer.Append("<td>" + filtered[0].Category_Name + "</td>");
                        }
                        else
                        {
                            strCustomer.Append("<td>" + dr.New_Value + "</td>");
                        }
                    }
                    else
                    {
                        strCustomer.Append("<td>" + dr.New_Value + "</td>");
                    }
                    strCustomer.Append("</tr>");
                }
            }
            else
            {
                strCustomer.Append("<tr><td colspan='7'>No history details found</td></tr>");
            }
            strCustomer.Append("</tbody></table>");
            return strCustomer.ToString();
        }


        //********************************** START- DELETE DCR ***************************************//
        public string GetDCRDetailsForDelete(FormCollection col)
        {
            try
            {
                StringBuilder ddCnt = new StringBuilder();
                string userCode = col[COLL_USER_CODE].ToString();
                int month = Convert.ToInt32(col[COLL_MONTH]);
                int year = Convert.ToInt32(col[COLL_YEAR]);
                string dcrFlag = col[COLL_DCR_FLAG].ToString();
                int dcrStatus = Convert.ToInt32(col[COLL_DCR_STATUS]);
                string companyCode = _objCurr.GetCompanyCode();
                _objBLApproval = new BLApproval();

                string Leave_Policy = string.Empty;

                DataSet ds = new DataSet();
                DataTable dt = new DataTable();

                Leave_Policy = _objBLApproval.GetLeavePrivilege(companyCode, userCode);
                ds = _objApp.GetDCRDetailsForDelete(companyCode, userCode, month, year, dcrFlag, dcrStatus);
                dt = ds.Tables[0];

                if (dt != null && dt.Rows.Count > 0)
                {
                    ddCnt.Append("<div class='table-responsive'><table class='table table-striped' id='tblDCRDelete' cellspacing='0' cellpadding='0'>");
                    ddCnt.Append("<thead>");
                    ddCnt.Append("<tr>");
                    ddCnt.Append("<th></th>");
                    ddCnt.Append("<th>See Report</th>");
                    ddCnt.Append("<th>User Name</th>");
                    ddCnt.Append("<th>DCR Date</th>");
                    ddCnt.Append("<th>Entered Date</th>");
                    ddCnt.Append("<th>Place Worked</th>");
                    ddCnt.Append("<th>Category</th>");
                    ddCnt.Append("<th>Activity</th>");
                    ddCnt.Append("<th>Status</th>");
                    ddCnt.Append("<th>Leave Type</th>");
                    ddCnt.Append("<th>Comments</th>");
                    ddCnt.Append("<th>Lock Type</th>");
                    ddCnt.Append("</tr>");
                    ddCnt.Append("</thead>");

                    ddCnt.Append("<tbody>");
                    foreach (DataRow dr in dt.Rows)
                    {
                        DataRow[] drlockCount;
                        drlockCount = ds.Tables[1].Select("DCR_Date='" + dr["DCR_Date"].ToString() + "' AND Activiy_Flag='" + dr["Flag"].ToString() + "'");

                        string showFlag = ((dr["Flag"].ToString() == "F") ? "Field" : ((dr["Flag"].ToString() == "A") ? "Attendance" : "Leave"));
                        string showStatus = ((Convert.ToInt32(dr["DCR_Status"]) == 0) ? "Unapproved" : "Drafted");
                        string comments = dr["Comments"].ToString();

                        if (comments != "")
                        {
                            comments = comments.Replace("~^", " - N/A<br />");
                            comments = comments.Replace("^", "<br />");
                            comments = comments.Replace("~", " - ");
                        }
                        ddCnt.Append("<tr>");
                        if (drlockCount.Length > 0)
                        {
                            ddCnt.Append("<td></td>");
                        }
                        else
                        {
                            if (Convert.ToInt16(dr["Origin_Of_DCR"]) == 4 && dr["Flag"].ToString() == "L") // don show the ceck box for pay roll user to delete leave
                            {
                                ddCnt.Append("<td></td>");
                            }
                            else if (dr["Flag"].ToString() == "L" && Leave_Policy == "YES")
                            {
                                ddCnt.Append("<td></td>");
                            }
                            else
                            {
                                ddCnt.Append("<td><input type='checkbox' name='dcrDelete' value='" + dr["DCR_Code"] + "^" + dr["Flag"] + "^" + dr["DCR_Date"] + "'></td>");
                            }
                        }
                        ddCnt.Append("<td class='td-a' onclick='fnOpenUserPerDayFromDCR(\"" + userCode + "\",\"" + dr["DCR_Actual_Date"] + "\",\"" + dr["Flag"] + "\",\"" + dr["User_Name"] + "\")'>Report</td>");
                        ddCnt.Append("<td>" + dr["User_Name"] + "</td>");
                        ddCnt.Append("<td>" + dr["DCR_Actual_Date"] + "</td>");
                        ddCnt.Append("<td>" + dr["DCR_Entered_Date"] + "</td>");
                        ddCnt.Append("<td>" + dr["Place_Worked"] + "</td>");
                        ddCnt.Append("<td>" + dr["Category"] + "</td>");
                        ddCnt.Append("<td>" + showFlag + "</td>");
                        ddCnt.Append("<td class='dd" + showStatus + "'>" + showStatus + "</td>");
                        ddCnt.Append("<td>" + dr["Leave_Type_Name"] + "</td>");
                        ddCnt.Append("<td>" + comments + "</td>");

                        if (drlockCount.Length > 0)
                        {
                            ddCnt.Append("<td>Unapproved Activity Lock</td>");//Lock Type
                        }
                        else
                        {
                            ddCnt.Append("<td></td>");
                        }
                        ddCnt.Append("</tr>");
                    }
                    ddCnt.Append("</tbody>");
                    ddCnt.Append("</table></div>");
                    ddCnt.Append("<div class='col-lg-12' style='margin-top:20px;'> <input type='button' value='Delete' class='btn small primary' onclick='fnDeleteDCR();' /></div>");
                }
                else
                {
                    ddCnt.Append("<div class='col-lg-12'>No DCRs found for this input selection.</div>");
                }
                return ddCnt.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", col[COLL_USER_CODE].ToString());
                dicObj.Add("month", col[COLL_MONTH].ToString());
                dicObj.Add("year", col[COLL_YEAR].ToString());
                dicObj.Add("dcrStatus", col[COLL_DCR_STATUS].ToString());
                dicObj.Add("dcrFlag", col[COLL_DCR_FLAG].ToString());
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return "FAIL^" + ex.Message;
            }
        }

        public string DCRDelete(FormCollection col)
        {
            try
            {
                string result = string.Empty;
                string selectedDCRs = col["selectedDCR"].ToString();
                string userCode = col[COLL_USER_CODE].ToString();
                int dcrStatus = Convert.ToInt32(col[COLL_DCR_STATUS].ToString());
                string companyCode = _objCurr.GetCompanyCode();
                string selectedDCRQueue = col["selectedDCRForQueue"].ToString();
                string LoginuserCode = _objCurr.GetUserCode();
                result = _objApp.DeleteDCR(companyCode, userCode, selectedDCRs, dcrStatus, LoginuserCode);

                if (selectedDCRQueue != null && selectedDCRQueue.Length > 0)
                {
                    string[] selectedDCRArray = selectedDCRQueue.Split('~');

                    foreach (string dcrObj in selectedDCRArray)
                    {
                        if (dcrObj != null && dcrObj.Trim().Length > 0)
                        {
                            string dcrCode = dcrObj.Split('^')[0];
                            string flag = dcrObj.Split('^')[1];
                            string dcrDate = dcrObj.Split('^')[2];
                        }
                    }

                }
                return result;
            }
            catch (Exception ex)
            {
                return "FAIL^" + ex.Message;
            }
        }

        public JsonResult HighlightTree(FormCollection col)
        {
            try
            {
                string userCode = _objCurr.GetUserCode();
                string dcrFlag = col[COLL_DCR_FLAG].ToString();
                string dcrStatus = col[COLL_DCR_STATUS].ToString();
                string month = col[COLL_MONTH].ToString();
                string year = col[COLL_YEAR].ToString();
                string companyCode = _objCurr.GetCompanyCode();

                if (dcrFlag == "F,A,L")
                {
                    dcrFlag = "ALL";
                }

                DataSet ds = new DataSet();

                ds = _objApp.GetDCRAppliedUserCount(companyCode, userCode, dcrFlag, dcrStatus + "^", month, year);
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(ds.Tables[0]), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("month", col[COLL_MONTH].ToString());
                dicObj.Add("year", col[COLL_YEAR].ToString());
                dicObj.Add("dcrStatus", col[COLL_DCR_STATUS].ToString());
                dicObj.Add("dcrFlag", col[COLL_DCR_FLAG].ToString());
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
        }
        //********************************** END - DELETE DCR ***************************************//

        /****************** START: DCR Lock ********************************/
        public string GetLockedData(string user_Code, string FromDate, string ToDate, string Privilegevalue)
        {
            try
            {
                string company_Code = _objCurr.GetCompanyCode();
                _objBLApproval = new BLApproval();
                List<DCRActivityLockModel> lstDCRActivityLock = _objBLApproval.GetDCRLockedData(company_Code, user_Code, FromDate, ToDate, Privilegevalue);
                StringBuilder strLockTableBuilder = GetLockedDataINHTMLFormat(lstDCRActivityLock, Privilegevalue);
                return strLockTableBuilder.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Tree Selected user:", user_Code); //Filter indicates UI level filters
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw;
            }
        }


        public JsonResult GetlockReleaseData(string user_Code, string showmore, string FromDate, string ToDate)
        {
            try
            {
                string company_Code = _objCurr.GetCompanyCode();

                DataControl.HiDoctor_ActivityFactoryClasses.BL_NoticeBoard objNot = new DataControl.HiDoctor_ActivityFactoryClasses.BL_NoticeBoard();
                List<DCRActivityLockModel> lstDCRActivityLock = objNot.GetDcrLockReleaseDates(company_Code, user_Code, showmore, FromDate, ToDate);
                //JsonResult strLockTableBuilder = GetLockedReleasedINHTMLFormat(lstDCRActivityLock);
                return Json(lstDCRActivityLock, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Tree Selected user:", user_Code); //Filter indicates UI level filters
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw;
            }
        }


        public JsonResult GetDCRLockRelease(string User_Code, string PageNumber, string PageSize)
        {
            string Company_Code = _objCurr.GetCompanyCode();
            DataControl.HiDoctor_ActivityFactoryClasses.BL_NoticeBoard objNot = new DataControl.HiDoctor_ActivityFactoryClasses.BL_NoticeBoard();
            MVCModels.DCRLockReleaseDataForPagination lstlock = new MVCModels.DCRLockReleaseDataForPagination();
            lstlock = objNot.GetAllDCRLockRelease(Company_Code, User_Code, PageNumber, PageSize);
            return Json(lstlock, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAlllockData(string user_Code, string showmore)
        {
            try
            {
                string company_Code = _objCurr.GetCompanyCode();

                DataControl.HiDoctor_ActivityFactoryClasses.BL_NoticeBoard objNot = new DataControl.HiDoctor_ActivityFactoryClasses.BL_NoticeBoard();
                List<DCRActivityLockModel> lstDCRLock = objNot.GetAlllockData(company_Code, user_Code, showmore);
                return Json(lstDCRLock, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }




        public string UpdateDCRLockToRelease(string user_Code, string lock_Type, string locked_Date, string dcr_Actual_Date, string Request_Released_By, string Privilegevalue)
        {
            try
            {
                string company_Code = _objCurr.GetCompanyCode();
                _objBLApproval = new BLApproval();

                DCRActivityLockModel dcrLock = new DCRActivityLockModel();
                dcrLock.Lock_Type = lock_Type;
                dcrLock.Locked_Date = locked_Date;
                dcrLock.DCR_Actual_Date = dcr_Actual_Date;
                dcrLock.User_Code = user_Code;
                dcrLock.Released_By = _objCurr.GetUserCode();
                dcrLock.Request_Released_By = Request_Released_By;
                dcrLock.Privilegevalue = Privilegevalue;
                return _objBLApproval.UpdateDCRLockToRelease(company_Code, dcrLock);
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

        private StringBuilder GetLockedDataINHTMLFormat(List<DCRActivityLockModel> lstDCRActivityLock,string Privilegevalue)
        {
            StringBuilder strLockTableBuilder = new StringBuilder();
            int rowNo = 0;
            //var ALLOW_ONLY_LEAVE = "NO";
            if (lstDCRActivityLock != null && lstDCRActivityLock.Count > 0)
            {
                //string previlege = lstDCRActivityLock[0].Privilegevalue;
                //if(privilege == 'YES')
                //{

                //}
                strLockTableBuilder.Append("<table cellspacing='0' cellpadding='0' id='tblDCRLockDetails' class='table table-striped'><thead><tr>");
                if (Privilegevalue == "YES")
                {
                    strLockTableBuilder.Append("<th style='text-align:left'><input type='checkbox' id='prvCheckBox' onclick='fnCheckorUncheck()' />Lock for leave</th>");
                }
                strLockTableBuilder.Append("<th style='text-align:left'><input type='checkbox' id='hdrCheckBox' onclick='fnCheckOrUncheckRowsCheckbox()' /></th>");
                strLockTableBuilder.Append("<th style='text-align:left'>User Name</th>");
                strLockTableBuilder.Append("<th style='text-align:left'>Locked Date</th>");
                strLockTableBuilder.Append("<th style='text-align:left'>DCR Date</th>");
                strLockTableBuilder.Append("<th style='text-align:left'>Lock Status</th>");
                strLockTableBuilder.Append("<th style='text-align:left'>Lock Type</th>");
                strLockTableBuilder.Append("<th style='text-align:left'>Request Released By</th>");
                strLockTableBuilder.Append("<th style='text-align:left'>Released Reason</th>");
                strLockTableBuilder.Append("</tr></thead><tbody>");
                List<MVCModels.ReportedUser> lstReported = new List<MVCModels.ReportedUser>();
                DataControl.HD_MasterFactoryClasses.BL_UsercreationWizard _objUserCreation = new DataControl.HD_MasterFactoryClasses.BL_UsercreationWizard();
                DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
                lstReported = _objUserCreation.GetReportedMangers(_objcurrentInfo.GetCompanyCode(), lstDCRActivityLock[0].User_Code, _objcurrentInfo.GetUserCode()).ToList();
                string list = "";
                foreach (var item in lstReported)
                {
                    if (item.User_Code == _objcurrentInfo.GetUserCode())
                        list += "<option  selected='selected' value='" + item.User_Code + "'>" + item.User_Name + "</option>";
                    else
                        list += "<option value='" + item.User_Code + "'>" + item.User_Name + "</option>";
                }
                foreach (DCRActivityLockModel dcrLock in lstDCRActivityLock)
                {
                    rowNo++;
                    strLockTableBuilder.Append("<tr>");
                    //if (ALLOW_ONLY_LEAVE == "Yes")
                    //{
                    //    strLockTableBuilder.Append("<td><input type='checkbox' onclick='fnCheckOrUncheckHeader()' id='rowcheck_");
                    //}
                    if (Privilegevalue == "YES")
                    {
                        strLockTableBuilder.Append("<td><input type='checkbox' onclick='fnCheckOrUncheckHeader()' id='rowcheck_");
                        strLockTableBuilder.Append(rowNo.ToString());
                        strLockTableBuilder.Append("'/></td>");
                    }
                  
                    strLockTableBuilder.Append("<td><input type='checkbox' onclick='fnCheckOrUncheckHeaderRow()' id='rowcheckbox_");
                    strLockTableBuilder.Append(rowNo.ToString());
                    strLockTableBuilder.Append("'/></td>");
                    strLockTableBuilder.Append("<td><span id='spnuserName_");
                    strLockTableBuilder.Append(rowNo.ToString());
                    strLockTableBuilder.Append("'>");
                    strLockTableBuilder.Append(dcrLock.User_Name);
                    strLockTableBuilder.Append("</span><span style='display:none' id='spnUserCode_");
                    strLockTableBuilder.Append(rowNo.ToString());
                    strLockTableBuilder.Append("'>");
                    strLockTableBuilder.Append(dcrLock.User_Code);
                    strLockTableBuilder.Append("</span></td>");
                    strLockTableBuilder.Append("<td><span id='spnlockedDate_");
                    strLockTableBuilder.Append(rowNo.ToString());
                    strLockTableBuilder.Append("'>");
                    strLockTableBuilder.Append(dcrLock.Locked_Date);
                    strLockTableBuilder.Append("</span></td>");
                    strLockTableBuilder.Append("<td><span id='spnDcrActualDate_");
                    strLockTableBuilder.Append(rowNo.ToString());
                    strLockTableBuilder.Append("'>");
                    strLockTableBuilder.Append(dcrLock.DCR_Actual_Date);
                    strLockTableBuilder.Append("</span></td>");
                    strLockTableBuilder.Append("<td><span id='spnLockStatus_");
                    strLockTableBuilder.Append(rowNo.ToString());
                    strLockTableBuilder.Append("'>");
                    strLockTableBuilder.Append(dcrLock.Lock_Status);
                    strLockTableBuilder.Append("</span></td>");
                    strLockTableBuilder.Append("<td><span id='spnLockType_");
                    strLockTableBuilder.Append(rowNo.ToString());
                    strLockTableBuilder.Append("'>");
                    strLockTableBuilder.Append(dcrLock.Lock_Type);
                    strLockTableBuilder.Append("</span></td>");
                    string ddl = "<select id='ddluser_code_" + rowNo.ToString() + "'><option value='0'>-Select-</option>" + list;
                    ddl += "</select>";
                    strLockTableBuilder.Append("<td>" + ddl + "</td>");
                    strLockTableBuilder.Append("<td><textarea id='txtReason_" + rowNo.ToString() + "' maxlength='250'>-Nil-</textarea> </td>");
                    strLockTableBuilder.Append("</tr>");
                }
                strLockTableBuilder.Append("</tbody></table>");
            }
            else
            {
                strLockTableBuilder.Append("<span>No lock Details Found.</span>");
            }
            return strLockTableBuilder;
        }


        private JsonResult GetLockedReleasedINHTMLFormat(List<DCRActivityLockModel> lstDCRActivityLock)
        {

            DataControl.JSONConverter objJson = new DataControl.JSONConverter();
            List<MVCModels.DCRActivityLockModel> lstActivitylock = new List<MVCModels.DCRActivityLockModel>();

            //int rowNo = 0;
            //if (lstDCRActivityLock != null && lstDCRActivityLock.Count > 0)
            //{
            //    strLockTableBuilder.Append("<table cellspacing='0' cellpadding='0' id='tblDCRLockRelaseDetails' class='table table-striped'><thead><tr>");
            //    strLockTableBuilder.Append("<th style='text-align:left'>Locked Date</th>");
            //    strLockTableBuilder.Append("<th style='text-align:left'>Released Date</th>");
            //    strLockTableBuilder.Append("<th style='text-align:left'>DCR Actual Date</th>");
            //    strLockTableBuilder.Append("<th style='text-align:left'>Lock Type</th>");
            //    strLockTableBuilder.Append("<th style='text-align:left'>Released By</th>");
            //    strLockTableBuilder.Append("<th style='text-align:left'>Request Released By </th>");
            //    strLockTableBuilder.Append("<th style='text-align:left'>Released Reason</th>");
            //    strLockTableBuilder.Append("</tr></thead><tbody>");
            //    foreach (DCRActivityLockModel dcrLock in lstDCRActivityLock)
            //    {
            //        rowNo++;
            //        strLockTableBuilder.Append("<tr>");
            //        strLockTableBuilder.Append("<td><span id='spnlockedDate_");
            //        strLockTableBuilder.Append(rowNo.ToString());
            //        strLockTableBuilder.Append("'>");
            //        strLockTableBuilder.Append(dcrLock.Locked_Date);
            //        strLockTableBuilder.Append("</span></td>");
            //        strLockTableBuilder.Append("<td><span id='spnDcrReleaseDate_");
            //        strLockTableBuilder.Append(rowNo.ToString());
            //        strLockTableBuilder.Append("'>");
            //        strLockTableBuilder.Append(dcrLock.Released_Date);
            //        strLockTableBuilder.Append("</span></td>");

            //        if (dcrLock.Lock_Type == "LOCK_LEAVE")
            //        {
            //            strLockTableBuilder.Append("<td><span id='spnDcrReleaseDate_");
            //            strLockTableBuilder.Append(rowNo.ToString());
            //            strLockTableBuilder.Append("'>");
            //            strLockTableBuilder.Append(dcrLock.DCR_Actual_Date);
            //            strLockTableBuilder.Append("</span></td>");
            //        }
            //        else if (dcrLock.Lock_Type == "IDLE_DCR")
            //        {
            //            strLockTableBuilder.Append("<td><span id='spnDcrReleaseDate_");
            //            strLockTableBuilder.Append(rowNo.ToString());
            //            strLockTableBuilder.Append("'>");
            //            strLockTableBuilder.Append(dcrLock.DCR_Actual_Date);
            //            strLockTableBuilder.Append("</span></td>");
            //        }

            //        strLockTableBuilder.Append("<td><span id='spnLockkType_");
            //        strLockTableBuilder.Append(rowNo.ToString());
            //        strLockTableBuilder.Append("'>");
            //        strLockTableBuilder.Append(dcrLock.Lock_Type);
            //        strLockTableBuilder.Append("</span></td>");
            //        strLockTableBuilder.Append("<td><span id='spnReleaseBy_");
            //        strLockTableBuilder.Append(rowNo.ToString());
            //        strLockTableBuilder.Append("'>");
            //        strLockTableBuilder.Append(dcrLock.Released_By);
            //        strLockTableBuilder.Append("</span></td>");
            //        strLockTableBuilder.Append("<td><span>" + dcrLock.Request_Released_By + "</span></td>");
            //        strLockTableBuilder.Append("<td><span>" + dcrLock.Released_Reason + "</span></td>");
            //        strLockTableBuilder.Append("</tr>");
            //    }
            //    strLockTableBuilder.Append("</tbody></table>");
            //}
            //else
            //{
            //    strLockTableBuilder.Append("<span>No Details available.</span>");
            //}
            return Json(objJson.Serialize(lstActivitylock));

        }

        /****************** END: DCR Lock ********************************/


        /****************** START: Notice Board Approval ********************************/
        public string GetNoticesForApprovalAndUnapproval(string selected_User_Code, string Self_Approval_Pri_Value)
        {
            try
            {
                string company_Code = _objCurr.GetCompanyCode();
                string user_Code = _objCurr.GetUserCode();
                _objBLApproval = new BLApproval();
                List<NoticeBoardModel> lstNotices = _objBLApproval.GetNoticesForApprovalAndUnapproval(company_Code, selected_User_Code, user_Code, Self_Approval_Pri_Value);
                StringBuilder strNoticesTableBuilder = GetNoticesDataInHTMLFormat(lstNotices);
                return strNoticesTableBuilder.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Tree Selected user:", selected_User_Code); //Filter indicates UI level filters
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw;
            }
        }

        /// <summary>
        /// Change the Approve Or Unapprove the Notice.
        /// </summary>
        /// <param name="msg_Codes"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        public string ChangeStatusForNotices(string msg_Codes, string status)
        {
            try
            {
                string company_Code = _objCurr.GetCompanyCode();
                string user_Code = _objCurr.GetUserCode();
                _objBLApproval = new BLApproval();
                return _objBLApproval.ChangeStatusForNotices(company_Code, msg_Codes, status);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Message Codes:", msg_Codes); //Filter indicates UI level filters
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw;
            }
        }

        private StringBuilder GetNoticesDataInHTMLFormat(List<NoticeBoardModel> lstNotices)
        {
            StringBuilder strNoticeTableBuilder = new StringBuilder();
            int rowNo = 0;
            if (lstNotices != null && lstNotices.Count > 0)
            {
                strNoticeTableBuilder.Append("<table id='tblNoticeDetails' cellpadding='0' cellspacing='0' class='table table-striped'><thead><tr>");
                strNoticeTableBuilder.Append("<th><input type='checkbox' id='hdrCheckBox' onclick='fnCheckOrUncheckRowsCheckbox()' /></th>");
                strNoticeTableBuilder.Append("<th>Approved?</th>");
                strNoticeTableBuilder.Append("<th>Message</th>");
                strNoticeTableBuilder.Append("<th>Priority</th>");
                strNoticeTableBuilder.Append("<th>Active From</th>");
                strNoticeTableBuilder.Append("<th>Active To</th>");
                strNoticeTableBuilder.Append("<th>Distribution Type</th>");
                strNoticeTableBuilder.Append("<th>Author</th>");
                strNoticeTableBuilder.Append("</tr></thead><tbody>");
                foreach (NoticeBoardModel notices in lstNotices)
                {
                    rowNo++;
                    strNoticeTableBuilder.Append("<tr>");
                    strNoticeTableBuilder.Append("<td><input type='checkbox' onclick='fnCheckOrUncheckHeaderRow()' id='rowcheckbox_");
                    strNoticeTableBuilder.Append(rowNo.ToString());
                    strNoticeTableBuilder.Append("'/></td>");
                    string className = notices.MsgApprovalStatus.ToString().Trim().ToUpper() == "N" ? "NoticeNO" : "NoticeYES";
                    strNoticeTableBuilder.Append("<td title='Approval' class='" + className + "'><span id='spnStatus_");
                    strNoticeTableBuilder.Append(rowNo.ToString());
                    strNoticeTableBuilder.Append("'>");
                    strNoticeTableBuilder.Append(notices.MsgApprovalStatus.ToString().Trim().ToUpper() == "N" ? "No" : "Yes");
                    strNoticeTableBuilder.Append("</span><span style='display:none' id='spnMsgCode_");
                    strNoticeTableBuilder.Append(rowNo.ToString());
                    strNoticeTableBuilder.Append("'>");
                    strNoticeTableBuilder.Append(notices.MsgCode);
                    strNoticeTableBuilder.Append("</span></td>");
                    strNoticeTableBuilder.Append("<td title='Message'><p id='msgBody_");
                    strNoticeTableBuilder.Append(rowNo.ToString());
                    strNoticeTableBuilder.Append("'>");
                    strNoticeTableBuilder.Append(notices.MsgBody);
                    strNoticeTableBuilder.Append("</p></td>");
                    strNoticeTableBuilder.Append("<td title='Priority'><span id='spnpriority_");
                    strNoticeTableBuilder.Append(rowNo.ToString());
                    strNoticeTableBuilder.Append("'>");
                    strNoticeTableBuilder.Append(notices.MsgPriority == 0 ? "High" : notices.MsgPriority == 1 ? "Medium" : "Low");
                    strNoticeTableBuilder.Append("</span></td>");
                    strNoticeTableBuilder.Append("<td title='Active From'><span id='spnActiveFrom_");
                    strNoticeTableBuilder.Append(rowNo.ToString());
                    strNoticeTableBuilder.Append("'>");
                    strNoticeTableBuilder.Append(notices.MsgValidFrom);
                    strNoticeTableBuilder.Append("</span></td>");
                    strNoticeTableBuilder.Append("<td title='Active To'><span id='spnActiveTo_");
                    strNoticeTableBuilder.Append(rowNo.ToString());
                    strNoticeTableBuilder.Append("'>");
                    strNoticeTableBuilder.Append(notices.MsgValidTo);
                    strNoticeTableBuilder.Append("</span></td>");
                    strNoticeTableBuilder.Append("<td title='Distribution Type'><span id='spnDistributionType_");
                    strNoticeTableBuilder.Append(rowNo.ToString());
                    strNoticeTableBuilder.Append("'>");
                    strNoticeTableBuilder.Append(notices.MsgDistributionType == 'A' ? "All" : notices.MsgDistributionType == 'U' ? "Users" : notices.MsgDistributionType == 'R' ? "Regions" : notices.MsgDistributionType == 'G' ? "Group" : "My Team");
                    strNoticeTableBuilder.Append("</span></td>");
                    strNoticeTableBuilder.Append("<td title='Author'><span id='spnAuthor_");
                    strNoticeTableBuilder.Append(rowNo.ToString());
                    strNoticeTableBuilder.Append("'>");
                    strNoticeTableBuilder.Append(notices.User_Name);
                    strNoticeTableBuilder.Append("</span></td>");
                    strNoticeTableBuilder.Append("</tr>");
                }
                strNoticeTableBuilder.Append("</tbody></table>");
            }
            else
            {
                strNoticeTableBuilder.Append("<span>No Notices Found.</span>");
            }
            return strNoticeTableBuilder;
        }
        /****************** END: Notice Board Approval **********************************/

        //SFC Approval

        public ActionResult SFCApproval()
        {
            ViewBag.RegionCode = _objCurr.GetRegionCode();
            return View();
        }

        //GetSFCAppliedUsers


        public JsonResult GetTpAppliedUsers(string regionCodes)
        {
            try
            {
                DataControl.BLApproval _objBlApproval = new DataControl.BLApproval();
                DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
                DataSet ds = new DataSet();
                DataControl.JSONConverter _objJson = new DataControl.JSONConverter();

                ds = _objBlApproval.GetSFCAppliedUsers(_objCurrentInfo.GetCompanyCode(), regionCodes);
                return Json(_objJson.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:RegionCode", regionCodes);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw new Exception("Sorry an error occurred. Please try again later");
            }
        }

        //get sfc record
        public string GetRegionSFCRecord(string regionCode, string status)
        {
            try
            {
                DataControl.BLApproval _objBlApproval = new DataControl.BLApproval();
                DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
                DataSet ds = new DataSet();
                ds = _objBlApproval.GetRegionSFCRecord(_objCurrentInfo.GetCompanyCode(), regionCode, status);
                return GetRegionSFCRecordTable(ds, regionCode, status);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:RegionCode", regionCode);
                dicContext.Add("Filter:Status", status);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw new Exception("Sorry an error occurred. Please try again later");
            }
        }


        public string GetRegionSFCRecordTable(DataSet ds, string regionCode, string status)
        {
            try
            {
                StringBuilder sbTableContent = new StringBuilder();
                StringBuilder sb = new StringBuilder();
                if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    sbTableContent.Append("<table id='tblSFCsummary' class='table table-striped' >");
                    sbTableContent.Append("<thead class='active'>");
                    sbTableContent.Append("<tr style='background-color: #428bca'>");
                    sbTableContent.Append("<td>SFC Number</td>");
                    sbTableContent.Append("<td><input type='checkbox' id='bulkcheck'name='bulkchk_sfc' onclick='fnselectall()'/>Select</td>");
                    sbTableContent.Append("<td>Category</td>");
                    sbTableContent.Append("<td>From Place</td>");
                    sbTableContent.Append("<td>To Place</td>");
                    sbTableContent.Append("<td>Travel Mode</td>");
                    sbTableContent.Append("<td>Distance</td>");
                    sbTableContent.Append("<td>Amount</td>");
                    sbTableContent.Append("<td>Min Visit Count</td>");
                    sbTableContent.Append("<td>Max Visit Count</td>");
                    sbTableContent.Append("<td>Status</td>");
                    sbTableContent.Append("<td>Validity of SFC Route</td>");
                    sbTableContent.Append("</tr>");
                    sbTableContent.Append("</thead>");
                    sbTableContent.Append("<tbody>");

                    for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                    {
                        sbTableContent.Append("<tr><td>" + ds.Tables[0].Rows[i]["Row_Number"] + "</td>");
                        var sfcCode = ds.Tables[0].Rows[i]["Distance_Fare_Code"].ToString() + '_' + ds.Tables[0].Rows[i]["SFC_Version_No"].ToString();
                        if (ds.Tables[0].Rows[i]["SFCValidation"].ToString().ToUpper() != "EXPIRED" && ds.Tables[0].Rows[i]["Status"].ToString().ToLower() != "unapproved")
                        {
                            sbTableContent.Append("<td><input type='checkbox' id='Chk_sfc_' value=" + sfcCode + " name='chk_SFC' />");
                        }
                        else
                        {
                            sbTableContent.Append("<td></td>");
                        }
                        sbTableContent.Append("<td>" + ds.Tables[0].Rows[i]["Category_Name"] + "</td>");
                        sbTableContent.Append("<td>" + ds.Tables[0].Rows[i]["From_Region_Name"] + "</td>");
                        sbTableContent.Append("<td>" + ds.Tables[0].Rows[i]["To_Region_Name"] + "</td>");
                        sbTableContent.Append("<td>" + ds.Tables[0].Rows[i]["Travel_Mode"] + "</td>");
                        sbTableContent.Append("<td >" + ds.Tables[0].Rows[i]["Distance"] + "</td>");
                        sbTableContent.Append("<td>" + ds.Tables[0].Rows[i]["Fare_Amount"] + "</td>");
                        sbTableContent.Append("<td>" + ds.Tables[0].Rows[i]["Minimum_Count"] + "</td>");
                        sbTableContent.Append("<td>" + ds.Tables[0].Rows[i]["SFC_Visit_Count"] + "</td>");
                        sbTableContent.Append("<td " + GetColorCode(ds.Tables[0].Rows[i]["Status"].ToString()) + ">" + ds.Tables[0].Rows[i]["Status"] + "</td>");
                        sbTableContent.Append("<td>" + ds.Tables[0].Rows[i]["SFCValidation"] + "</td></tr>");
                    }
                }
                else
                {
                    return sb.Append("No data found.").ToString();
                }
                sbTableContent.Append("</tbody>");
                sbTableContent.Append("</table>");
                return sbTableContent.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:RegionCode", regionCode);
                dicContext.Add("Filter:Status", status);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw new Exception("Sorry an error occurred. Please try again later");
            }

        }


        public string SFCBulkApproval(string regionCode, string dfcCode, string mode)
        {
            string[] fareCode;
            string result = string.Empty;
            try
            {
                DataControl.BLApproval _objBlApproval = new DataControl.BLApproval();
                DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
                fareCode = dfcCode.ToString().Split(',');
                result = _objBlApproval.SFCBulkApprovals(_objCurrentInfo.GetCompanyCode(), regionCode, dfcCode, mode);
                result = "APPROVED";
                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:RegionCode", regionCode);
                dicContext.Add("Filter:Mode", mode);
                dicContext.Add("Filter:DfcCode", mode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw new Exception("Sorry an error occurred. Please try again later");
            }

        }

        public string SFCBulkUnapproval(string regionCode, string dfcCode, string mode)
        {
            string result = string.Empty;
            DataSet dsDcrCpTpCheck = new DataSet();
            bool DcrCpTpCheck = false;
            try
            {
                DataControl.BLApproval _objBlApproval = new DataControl.BLApproval();
                DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
                DcrCpTpCheck = _objBlApproval.CheckSFCInCPTPDCR(_objCurrentInfo.GetCompanyCode(), regionCode, dfcCode);

                if (DcrCpTpCheck == false)
                {
                    result = _objBlApproval.SFCBulkApprovals(_objCurrentInfo.GetCompanyCode(), regionCode, dfcCode, mode);
                    result = "UNAPPROVED";
                }
                else
                {
                    dsDcrCpTpCheck = _objBlApproval.GetSFCInCPTPDCRPopup(_objCurrentInfo.GetCompanyCode(), regionCode, dfcCode);
                    result = GetDcrCpTppopupTable(dsDcrCpTpCheck, regionCode);
                    return result;
                }

                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:RegionCode", regionCode);
                dicContext.Add("Filter:Mode", mode);
                dicContext.Add("Filter:DfcCode", mode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw new Exception("Sorry an error occurred. Please try again later");
            }

        }


        public string GetDcrCpTppopupTable(DataSet ds, string regionCode)
        {
            try
            {
                StringBuilder sbTableContent = new StringBuilder();
                sbTableContent.Append("<table id='tblPopsummary' class='table table-striped' >");
                sbTableContent.Append("<thead style='background-color: gainsboro; font-weight: bold' class='active'>");
                sbTableContent.Append("<tr>");
                sbTableContent.Append("<td>SFC Row</td>");
                sbTableContent.Append("<td>Screen</td>");
                sbTableContent.Append("<td>Name</td>");
                sbTableContent.Append("<td>Date</td>");
                sbTableContent.Append("<td>Status</td>");
                sbTableContent.Append("</tr>");
                sbTableContent.Append("</thead>");
                sbTableContent.Append("<tbody>");
                if (ds.Tables.Count > 0)
                {

                    for (int i = 0; i < ds.Tables.Count; i++)
                    {
                        for (int j = 0; j < ds.Tables[i].Rows.Count; j++)
                        {
                            sbTableContent.Append("<tr><td>" + ds.Tables[i].Rows[j]["Row_Number"] + "</td>");
                            sbTableContent.Append("<td>" + ds.Tables[i].Rows[j]["Transaction"] + "</td>");
                            sbTableContent.Append("<td>" + ds.Tables[i].Rows[j]["Name"] + "</td>");
                            sbTableContent.Append("<td>" + ds.Tables[i].Rows[j]["Date"] + "</td>");
                            sbTableContent.Append("<td>" + ds.Tables[i].Rows[j]["Status"] + "</td></tr>");
                        }
                    }

                }
                sbTableContent.Append("</tbody>");
                sbTableContent.Append("</table>");
                return sbTableContent.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:RegionCode", regionCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw new Exception("Sorry an error occurred. Please try again later");
            }
        }

        /****************** START: Marketing Campaign Approval ********************************/
        public ActionResult MarketingCampaignApproval()
        {
            return View();
        }


        /// <summary>
        /// returns a Html Table string of all the Campaign for a region
        /// </summary>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public JsonResult GetMarketingCampaignsForARegion(string approvalStatus)
        {
            List<MCHeaderModel> lstMC = null;
            string regionCode = null;
            string mode = "AP";
            string startDate = "";
            string endDate = "";
            try
            {

                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                DataControl.HiDoctor_Master.BLMarketingCampaign objMC = new DataControl.HiDoctor_Master.BLMarketingCampaign();


                string blobUrl = string.Empty;
                string companyCode = objCurInfo.GetCompanyCode();
                regionCode = objCurInfo.GetRegionCode();

                lstMC = objMC.GetMarketingCampaignsForARegion(companyCode, regionCode, approvalStatus, startDate, endDate, mode);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("regionCode", regionCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return Json(lstMC, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetSelectedMarketingCampaignProducts(string campaignCode)
        {
            IEnumerable<MVCModels.MCDetailsModel> lstProd = null;
            string companyCode = null;
            try
            {
                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                DataControl.HiDoctor_Master.BLMarketingCampaign objMC = new DataControl.HiDoctor_Master.BLMarketingCampaign();
                companyCode = objCurInfo.GetCompanyCode();
                lstProd = objMC.GetMCProductDetails(companyCode, campaignCode);

            }
            catch (Exception ex)
            {
                throw;
            }
            return Json(lstProd, JsonRequestBehavior.AllowGet);
        }



        public int MarketingCampaignBulkApproval(List<MCHeaderModel> lstUnApproval)
        {
            MVCModels.MCHeaderModel objMaraketCampaign;
            DataControl.BLApproval _objBlApproval = new DataControl.BLApproval();
            List<MVCModels.MCHeaderModel> lstMarketCampaign = new List<MVCModels.MCHeaderModel>();
            string updatedBy = null;
            try
            {

                foreach (var campaignCodeval in lstUnApproval)
                {

                    objMaraketCampaign = new MVCModels.MCHeaderModel();
                    objMaraketCampaign.Company_Code = _objCurr.GetCompanyCode();
                    objMaraketCampaign.Campaign_Code = campaignCodeval.Campaign_Code;
                    objMaraketCampaign.Record_Status = campaignCodeval.Record_Status;
                    objMaraketCampaign.Remarks = campaignCodeval.Remarks;
                    lstMarketCampaign.Add(objMaraketCampaign);

                }
                updatedBy = _objCurr.GetUserName();
                int result = _objBlApproval.InsertBulkApprovalforMarketCampaignToApproval(lstMarketCampaign, updatedBy);
                return result;
            }
            catch (Exception ex)
            {
                throw;
            }
        }


        /// <summary>
        /// Get ChildAppliedUser
        /// </summary>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public JsonResult GetAppliedChildUserforMarketCampaign(string RegionCodes)
        {
            string regionCode = null;
            try
            {

                DataControl.BLApproval _objBlApproval = new DataControl.BLApproval();
                DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
                //string RegionCodes = _objCurrentInfo.GetRegionCode();
                regionCode = _objCurrentInfo.GetRegionCode();
                List<MVCModels.MCHeaderModel> lstmcHeader;
                lstmcHeader = _objBlApproval.GetAppliedChildUserForMarketingCampaign(_objCurrentInfo.GetCompanyCode(), RegionCodes).ToList();
                DataControl.JSONConverter objJson = new DataControl.JSONConverter();
                return Json(objJson.Serialize(lstmcHeader));
            }

            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
        }
        /****************** END: Marketing Campaign Approval ********************************/

        // ***********************************DCR APPROVAL ********************************//
        /// <summary>
        /// Get Divisions
        /// </summary>
        /// <returns></returns>
        public JsonResult GetDivisions()
        {
            _objBLApproval = new BLApproval();
            List<MVCModels.DivisionModel> lstDivisions = new List<MVCModels.DivisionModel>();
            JSONConverter _objJson = new JSONConverter();
            lstDivisions = _objBLApproval.GetDivisions(_objCurr.GetCompanyCode(), _objCurr.GetUserCode()).ToList();
            return Json(_objJson.Serialize(lstDivisions));
        }

        public string GetDCRLeaveData(FormCollection collection)
        {
            StringBuilder sbTblContent = new StringBuilder();
            _objBLApproval = new BLApproval();
            try
            {
                string loginUserTypeCode = _objCurr.GetUserTypeCode();
                string userCode = collection[COLL_USER_CODE].ToString();
                string flag = collection[COLL_DCR_FLAG].ToString();
                string dcrStatus = collection[COLL_DCR_STATUS].ToString();
                string month = collection[COLL_MONTH].ToString();
                string year = collection[COLL_YEAR].ToString();
                string companyCode = _objCurr.GetCompanyCode();
                sbTblContent = _objBLApproval.GetDCRLeaveData(companyCode, userCode, flag, dcrStatus, month, year, loginUserTypeCode);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:UserCode", collection[COLL_USER_CODE].ToString());
                dicContext.Add("Filter:flag", collection[COLL_DCR_FLAG].ToString());
                dicContext.Add("Filter:dcrStatus", collection[COLL_DCR_STATUS].ToString());
                dicContext.Add("Filter:Month", collection[COLL_MONTH].ToString());
                dicContext.Add("Filter:year", collection[COLL_YEAR].ToString());
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw new Exception("Sorry an error occurred. Please try again later");
            }
            return sbTblContent.ToString();
        }

        public string GetDCRData(FormCollection collection)
        {
            StringBuilder sbTableContent = new StringBuilder();
            try
            {
                string loginUserTypeCode = _objCurr.GetUserTypeCode();

                string userCode = collection[COLL_USER_CODE].ToString();
                string flag = collection[COLL_DCR_FLAG].ToString();
                string dcrStatus = collection[COLL_DCR_STATUS].ToString();
                string month = collection[COLL_MONTH].ToString();
                string year = collection[COLL_YEAR].ToString();
                string companyCode = _objCurr.GetCompanyCode();
                _objBLApproval = new BLApproval();
                sbTableContent = _objBLApproval.GetDCRData(companyCode, userCode, flag, dcrStatus, month, year, loginUserTypeCode);

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:UserCode", collection[COLL_USER_CODE].ToString());
                dicContext.Add("Filter:flag", collection[COLL_DCR_FLAG].ToString());
                dicContext.Add("Filter:dcrStatus", collection[COLL_DCR_STATUS].ToString());
                dicContext.Add("Filter:Month", collection[COLL_MONTH].ToString());
                dicContext.Add("Filter:year", collection[COLL_YEAR].ToString());
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw new Exception("Sorry an error occurred. Please try again later");
            }
            return sbTableContent.ToString();
        }

        public int GetLeavePolicy(string userCode)
        {
            int result = 0;
            _objBLApproval = new BLApproval();
            string companyCode = _objCurr.GetCompanyCode();
            result = _objBLApproval.GetLeavePolicy(userCode, companyCode);
            return result;
        }

        public string GetDCRApprovalAllDCR(FormCollection collection)
        {
            StringBuilder sbTableContent = new StringBuilder();
            try
            {
                string userCode = collection[COLL_USER_CODE].ToString();
                string flag = collection[COLL_DCR_FLAG].ToString();
                string dcrStatus = collection[COLL_DCR_STATUS].ToString();
                string month = collection[COLL_MONTH].ToString();
                string year = collection[COLL_YEAR].ToString();
                string companyCode = _objCurr.GetCompanyCode();
                _objBLApproval = new BLApproval();
                sbTableContent = _objBLApproval.GetDCRApprovalAll(companyCode, userCode, flag, dcrStatus, month, year);

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:UserCode", collection[COLL_USER_CODE].ToString());
                dicContext.Add("Filter:flag", collection[COLL_DCR_FLAG].ToString());
                dicContext.Add("Filter:dcrStatus", collection[COLL_DCR_STATUS].ToString());
                dicContext.Add("Filter:Month", collection[COLL_MONTH].ToString());
                dicContext.Add("Filter:year", collection[COLL_YEAR].ToString());
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw new Exception("Sorry an error occurred. Please try again later");
            }
            return sbTableContent.ToString();
        }
        public string GetRatingParameter(FormCollection collection)
        {
            StringBuilder sbTableContent = new StringBuilder();
            try
            {
                string loginUserTypeCode = _objCurr.GetUserTypeCode();

                string dcrStatus = collection[COLL_DCR_STATUS].ToString();

                string userCode = collection[COLL_USER_CODE].ToString();
                string dcrCode = collection[COLL_DCR_CODE].ToString();
                string flag = collection[COLL_DCR_FLAG].ToString();
                string companyCode = _objCurr.GetCompanyCode();
                _objBLApproval = new BLApproval();
                sbTableContent = _objBLApproval.GetDCRRatingparameter(companyCode, userCode, dcrCode, flag, loginUserTypeCode, dcrStatus);

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:dcrCode", collection[COLL_DCR_CODE].ToString());
                dicContext.Add("Filter:flag", collection[COLL_DCR_FLAG].ToString());
                throw new Exception("Sorry an error occurred. Please try again later");
            }
            return sbTableContent.ToString();
        }

        public string UpdateLeaveDCRStatus(string usercode, string dcrDetails, string status, string month, string year, string selectedStatus)
        {
            BLApproval objApp = new BLApproval();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string companyCode = objCurInfo.GetCompanyCode();
            string Login_userName = objCurInfo.GetUserName();
            string Login_userCode = objCurInfo.GetUserCode();
            string result = objApp.UpdateLeaveDCRStatus(companyCode, usercode, dcrDetails, status, Login_userName, Login_userCode);
            return result;
        }

        public string UpdateDCRStatus(string userCode, string dcrDetails, string status, string month, string year, string selectedStatus, string selectedFlag, string ratingRemarks, string parameter)
        {
            BLApproval objApp = new BLApproval();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string result = objApp.UpdateDCRStatus(objCurInfo.GetCompanyCode(), userCode, dcrDetails, status, "", objCurInfo.GetUserName(), objCurInfo.GetUserCode(), DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss"), ratingRemarks, parameter);
            return result;

        }

        public JsonResult fnGetDCRPrivilegeReport(string userCode)
        {
            List<UserTypePrivilegeMappingModel> lstdcrReport = null;
            BLApproval objApp = new BLApproval();
            DataControl.JSONConverter _objJson = new DataControl.JSONConverter();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            lstdcrReport = objApp.fnGetDCRPrivilegeReport(objCurInfo.GetCompanyCode(), userCode);
            return Json(_objJson.Serialize(lstdcrReport), JsonRequestBehavior.AllowGet);


        }

        public string GetMonthExpenseStatus(string userCode, string month, string year)
        {
            _objBLApproval = new BLApproval();
            return _objBLApproval.GetMonthExpenseStatus(userCode, Convert.ToDateTime(month + "-1-" + year), _objCurr.GetCompanyCode());
        }
        //srisudhan//
        public string CheckExpenseClaim(string userCode, string dcrDetails, string status, string month, string year, string selectedStatus, string selectedFlag)
        {
            BLMaster objMast = new BLMaster();
            BLApproval objApp = new BLApproval();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string claimDates = string.Empty;
            string checktwoActivityExpenseValidation = string.Empty;
            checktwoActivityExpenseValidation = objMast.GetPrivilegeValue(objCurInfo.GetCompanyCode(), userCode, "VALIDATE_TWO_ACTIVITY_EXPENSES");
            if (checktwoActivityExpenseValidation.ToUpper() != "NO")
            {
                claimDates = objApp.CheckExpenseClaim(objCurInfo.GetCompanyCode(), userCode, dcrDetails, status);
                if (!string.IsNullOrEmpty(claimDates))
                {
                    claimDates = claimDates.TrimEnd(',');
                }
            }
            return claimDates;

        }


        public JsonResult GetAppliedCPRegions(FormCollection collection)
        {
            DataSet ds = new DataSet();
            DataControl.BLApproval objApproval = new BLApproval();
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();


            DataControl.JSONConverter _objJson = new DataControl.JSONConverter();
            ds = objApproval.GetAppliedCPRegions(_objCurrentInfo.GetCompanyCode(), _objCurrentInfo.GetRegionCode());
            return Json(_objJson.Serialize(ds), JsonRequestBehavior.AllowGet);
        }
        public string GetCPHeader(string regionCode, string status)
        {
            IEnumerable<MVCModels.CampaignPlannerHeader> lstCPheader = null;
            lstCPheader = _objApp.GetCPHeader(_objCurr.GetCompanyCode(), regionCode, status);
            StringBuilder sbTableContent = new StringBuilder();
            int rowNo = 0;
            if (lstCPheader != null && lstCPheader.ToList().Count > 0)
            {
                sbTableContent.Append("<table class='table table-striped'>");
                sbTableContent.Append("<thead>");
                sbTableContent.Append("<tr>");
                sbTableContent.Append("<th>Approve</th>");
                sbTableContent.Append("<th>Unapprove</th>");
                sbTableContent.Append("<th>Reason</th>");
                sbTableContent.Append("<th>History</th>");
                sbTableContent.Append("<th>Doctors List</th>");
                sbTableContent.Append("<th><input type='checkbox' id='bulkCPcheck'name='bulkchk_CP' onclick='fnCPselectall()'/>CPName</th>");
                sbTableContent.Append("<th>User Name</th>");
                sbTableContent.Append("<th>Status</th>");
                sbTableContent.Append("<th>Category</th>");
                sbTableContent.Append("<th>Work Place</th>");
                sbTableContent.Append("<th>SFC Details</th>");
                sbTableContent.Append("<th>Reason</th>");
                sbTableContent.Append("</tr></thead><tbody>");
                foreach (var cpDetails in lstCPheader)
                {
                    rowNo++;
                    sbTableContent.Append("<tr>");
                    sbTableContent.Append("<td><span onclick='fnCPChangeStatus(\"" + cpDetails.CP_Code + "|" + cpDetails.Category_Name + "|" + cpDetails.Status + "|" + regionCode + "|1|" + rowNo + "\")' style='text-decoration:underline;cursor:pointer'>Approve</span></td>");
                    sbTableContent.Append("<td><span onclick='fnCPChangeStatus(\"" + cpDetails.CP_Code + "|" + cpDetails.Category_Name + "|" + cpDetails.Status + "|" + regionCode + "|0|" + rowNo + "\")' style='text-decoration:underline;cursor:pointer'>Unapprove</span></td>");
                    sbTableContent.Append("<td><textarea rows='2' cols='15' maxlength='500' id='txtRemarks_" + rowNo + "'/></td>");
                    sbTableContent.Append("<td class='td-a'><span onclick='fnViewCpHistory(\"" + cpDetails.CP_Code + "|" + cpDetails.CP_Name + "|" + regionCode + "\")' style='text-decoration:underline;cursor:pointer'>View</span></td>");
                    sbTableContent.Append("<td><span onclick='fnDoctorList(\"" + cpDetails.CP_Code + "|" + cpDetails.Category_Name + "|" + cpDetails.CP_Name + "|" + regionCode + "|1" + "\")' style='text-decoration:underline;cursor:pointer'>Doctors List</span></td>");
                    sbTableContent.Append("<td style='text-align:left'>");
                    sbTableContent.Append("<input type='checkbox'  id='chkSelect_" + rowNo + "' name='chkSelect' />");
                    sbTableContent.Append("<input type='hidden' id='hdnCP_" + rowNo + "'");
                    sbTableContent.Append("value='" + cpDetails.CP_Code + "|" + cpDetails.Category_Name + "|" + cpDetails.Status + "|" + regionCode + "'/>");
                    sbTableContent.Append(cpDetails.CP_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(cpDetails.User_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td " + GetColorCode(cpDetails.Status) + ">");
                    sbTableContent.Append(cpDetails.Status);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(cpDetails.Category_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>" + cpDetails.Work_Area + "</td>");
                    sbTableContent.Append("<td><span onclick='fnSFCDetails(\"" + cpDetails.CP_Code + "|" + cpDetails.Category_Name + "|" + cpDetails.CP_Name + "|" + regionCode + "|0" + "\")' style='text-decoration:underline;cursor:pointer'>SFC Details</span></td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(cpDetails.Unapprove_Reason);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("</tr>");
                }
                sbTableContent.Append("</tbody></table>");
            }
            else
            {
                sbTableContent.Append("NO");
            }

            return sbTableContent.ToString();

        }
        public string GetColorCode(string status)
        {
            string style = string.Empty;
            switch (status.ToUpper())
            {
                case "APPROVED":
                    style = "style=color:white;background-color:darkgreen";
                    break;
                case "APPLIED":
                    style = "style=color:white;background-color:DodgerBlue";
                    break;
                case "UNAPPROVED":
                    style = "style=color:white;background-color:crimson";
                    break;
                default:
                    style = "";
                    break;
            }
            return style;
        }

        public string UpdateCPStatus(string regionCode, string status, string cpDetails, string selection)
        {
            BLApproval objApp = new BLApproval();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string approvedBy = _objCurr.GetUserName();
            string approvedDate = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff");
            string result = objApp.UpdateCPStatus(objCurInfo.GetCompanyCode(), regionCode, cpDetails, status, selection, approvedBy, approvedDate);
            return result;
        }
        public string GetCPDoctorList(string regionCode, string cpCode, string cpName)
        {
            IEnumerable<MVCModels.CampaignPlannerDetails> lstCPDoctorList = null;
            lstCPDoctorList = _objApp.GetCPDoctors(_objCurr.GetCompanyCode(), cpCode, regionCode);
            StringBuilder sbTableContent = new StringBuilder();
            if (lstCPDoctorList != null && lstCPDoctorList.ToList().Count > 0)
            {
                sbTableContent.Append("<div> CP Name : " + cpName + "</div>");
                sbTableContent.Append("<table class='table table-striped'>");
                sbTableContent.Append("<thead>");
                sbTableContent.Append("<tr>");
                sbTableContent.Append("<th>Doctor Name</th>");
                sbTableContent.Append("<th>MDL Number</th>");
                sbTableContent.Append("<th>Speciality Name</th>");
                sbTableContent.Append("<th>Qualification</th>");
                sbTableContent.Append("</tr></thead><tbody>");
                foreach (var cpDetails in lstCPDoctorList)
                {
                    sbTableContent.Append("<tr>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(cpDetails.Doctor_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(cpDetails.MDL_Number);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(cpDetails.Speciality_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(cpDetails.Qualification);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("</tr>");
                }
                sbTableContent.Append("</tbody></table>");
            }
            else
            {
                sbTableContent.Append("<span>No  Details Found.</span>");
            }

            return sbTableContent.ToString();
        }

        public string GetCpHistory(string cpCode, string cpName, string regionCode)
        {
            StringBuilder strTbl = new StringBuilder();
            DataControl.CurrentInfo _objCur = new DataControl.CurrentInfo();
            DataControl.BLApproval _objApproval = new DataControl.BLApproval();
            try
            {
                List<CampaignPlannerHistoryModel> lstcampaingPlannerhistory = new List<CampaignPlannerHistoryModel>();
                lstcampaingPlannerhistory = _objApproval.GetCpHistoryDetails(_objCur.GetCompanyCode(), cpCode, regionCode).ToList();
                if (lstcampaingPlannerhistory != null && lstcampaingPlannerhistory.Count > 0 && lstcampaingPlannerhistory[0].lstCpHeaderHistory != null && lstcampaingPlannerhistory[0].lstCpHeaderHistory.Count > 0)
                {
                    strTbl.Append("<div class='col-lg-12 boldText'>CP Date : " + lstcampaingPlannerhistory[0].lstCpHeaderHistory[0].Created_Date + "</div>");
                    strTbl.Append("<div class='col-lg-12'>");
                    strTbl.Append("<div id='dvAccordion'>");
                    foreach (var CampaignPlannerHistory in lstcampaingPlannerhistory[0].lstCpHeaderHistory)
                    {
                        string headerAccordianstatus = "";
                        string modifiedDate = "";
                        headerAccordianstatus = CampaignPlannerHistory.Status.ToString();
                        if ("2" == headerAccordianstatus)
                        {
                            if (string.IsNullOrEmpty(CampaignPlannerHistory.Created_Date))
                            {
                                modifiedDate = CampaignPlannerHistory.Updated_Date.ToString();
                            }
                            else
                            {
                                modifiedDate = CampaignPlannerHistory.Created_Date.ToString();
                            }
                        }
                        else
                        {
                            if (CampaignPlannerHistory.Cp_Approved_Date != null)
                            {
                                modifiedDate = CampaignPlannerHistory.Cp_Approved_Date.ToString();
                            }
                        }
                        headerAccordianstatus = ((headerAccordianstatus == "1") ? "Approved" : ((headerAccordianstatus == "2") ? "Applied" : "Unapproved"));

                        strTbl.Append("<h3 style='padding-left: 20px;'>" + headerAccordianstatus + " on " + modifiedDate + "</h3>");
                        strTbl.Append("<div class='productBox'>");

                        //Cp Name
                        strTbl.Append("<div class='col-lg-12'>");
                        strTbl.Append("<div class='col-lg-3 boldText' >Cp Name: </div><div class='col-lg-9'>" + CampaignPlannerHistory.CP_Name + "</div>");
                        strTbl.Append("<div style='clear:both;'></div>");
                        strTbl.Append("</div>");
                        //Category Name
                        strTbl.Append("<div class='col-lg-12'>");
                        strTbl.Append("<div class='col-lg-3 boldText' >Category Name: </div><div class='col-lg-9'>" + CampaignPlannerHistory.Category_Name + "</div>");
                        strTbl.Append("<div style='clear:both;'></div>");
                        strTbl.Append("</div>");

                        //Work Area
                        strTbl.Append("<div class='col-lg-12'>");
                        strTbl.Append("<div class='col-lg-3 boldText' >Work Place:  </div><div class='col-lg-9'>" + CampaignPlannerHistory.Work_Area + "</div>");
                        strTbl.Append("<div style='clear:both;'></div>");
                        strTbl.Append("</div>");

                        #region SFC Details
                        strTbl.Append("<div class='col-lg-12 boldText'>SFC Details</div>");
                        var lstSfcDetails = lstcampaingPlannerhistory[0].lstCpSFCHistory.Where(a => a.Header_Tran_Code == CampaignPlannerHistory.Header_Tran_Code).ToList();

                        strTbl.Append("<div class='col-lg-12'>");
                        strTbl.Append("<table class='table table-striped'>");
                        strTbl.Append("<thead class='active'><tr>");
                        // strTbl.Append("<th>Work Area</th>");
                        strTbl.Append("<th>From</th><th>To</th>");
                        strTbl.Append("<th>Distance</th><th>Fare</th><th>Travel Mode</th></tr></thead>");
                        strTbl.Append("<tbody>");
                        if (lstSfcDetails != null && lstSfcDetails.Count > 0)
                        {
                            foreach (var SfcDetails in lstSfcDetails)
                            {
                                strTbl.Append("<tr>");
                                if (SfcDetails.Route_Way.Trim() == "D" && SfcDetails.Route_Way != null)
                                {
                                    strTbl.Append("<td>");
                                    strTbl.Append(SfcDetails.From_Place);
                                    strTbl.Append("</td>");
                                    strTbl.Append("<td>");
                                    strTbl.Append(SfcDetails.To_Place);
                                    strTbl.Append("</td>");
                                }
                                else if (SfcDetails.Route_Way.Trim() == "R")
                                {
                                    strTbl.Append("<td>");
                                    strTbl.Append(SfcDetails.To_Place);
                                    strTbl.Append("</td>");
                                    strTbl.Append("<td>");
                                    strTbl.Append(SfcDetails.From_Place);
                                    strTbl.Append("</td>");

                                }
                                else
                                {
                                    strTbl.Append("<td>");
                                    strTbl.Append(SfcDetails.From_Place);
                                    strTbl.Append("</td>");
                                    strTbl.Append("<td>");
                                    strTbl.Append(SfcDetails.To_Place);
                                    strTbl.Append("</td>");
                                }

                                //strTbl.Append("<td>");
                                //strTbl.Append(SfcDetails.From_Place);
                                //strTbl.Append("</td>");
                                ////To
                                //strTbl.Append("<td>");
                                //strTbl.Append(SfcDetails.To_Place);
                                //strTbl.Append("</td>");
                                //Disdance
                                strTbl.Append("<td>");
                                strTbl.Append(SfcDetails.Distance);
                                strTbl.Append("</td>");
                                //Fare
                                strTbl.Append("<td>");
                                strTbl.Append(SfcDetails.Amount);
                                strTbl.Append("</td>");
                                //Travel Mode
                                strTbl.Append("<td>");
                                strTbl.Append(SfcDetails.Travel_Mode);
                                strTbl.Append("</td>");
                                strTbl.Append("</tr>");
                            }
                        }
                        else
                        {
                            strTbl.Append("No SFC Details found.");
                        }
                        strTbl.Append("</tbody></table>");
                        strTbl.Append("</div>");
                        #endregion SFC Details

                        #region Doctor Details
                        strTbl.Append("<div class='col-lg-12 boldText'>Doctor Details</div>");
                        var lstDoctorDetails = lstcampaingPlannerhistory[0].lstCpDetailsHistory.Where(b => b.Header_Tran_Code == CampaignPlannerHistory.Header_Tran_Code).ToList();

                        strTbl.Append("<div class='col-lg-12'>");
                        strTbl.Append("<table class='table table-striped'>");
                        strTbl.Append("<thead class='active'><tr><th>MDL Number</th><th>Doctor Name</th><th>Region Name</th>");
                        strTbl.Append("<th>Category</th><th>Speciality</th></tr></thead>");
                        strTbl.Append("<tbody>");
                        if (lstDoctorDetails != null && lstDoctorDetails.Count > 0)
                        {
                            int rowCount = 0;
                            foreach (var DoctorDetails in lstDoctorDetails)
                            {
                                rowCount++;
                                strTbl.Append("<tr>");
                                ////S.No
                                //strTbl.Append("<td>");
                                //strTbl.Append(rowCount);
                                //strTbl.Append("</td");
                                //MDL Number
                                strTbl.Append("<td>");
                                strTbl.Append(DoctorDetails.MDL_Number);
                                strTbl.Append("</td>");
                                //Doctor Name
                                strTbl.Append("<td>");
                                strTbl.Append(DoctorDetails.Doctor_Name);
                                strTbl.Append("</td>");
                                //Region Name
                                strTbl.Append("<td>");
                                strTbl.Append(DoctorDetails.Region_Name);
                                strTbl.Append("</td>");
                                //Category
                                strTbl.Append("<td>");
                                strTbl.Append(DoctorDetails.Category_Name);
                                strTbl.Append("</td>");
                                //Speciality
                                strTbl.Append("<td>");
                                strTbl.Append(DoctorDetails.Speciality_Name);
                                strTbl.Append("</td>");
                                strTbl.Append("</tr>");
                            }
                        }
                        else
                        {
                            strTbl.Append("No Doctor Details found.");
                        }
                        strTbl.Append("</tbody></table>");
                        strTbl.Append("</div>");
                        #endregion Doctor Details
                        if (CampaignPlannerHistory.Status == "2")
                        {
                            if (string.IsNullOrEmpty(CampaignPlannerHistory.Created_Date))
                            {
                                //AppliedBy
                                strTbl.Append("<div class='col-lg-12'>");
                                if (!string.IsNullOrEmpty(CampaignPlannerHistory.Updated_By))
                                {
                                    strTbl.Append("<div class='col-lg-3 boldText'>Applied By : </div><div class='col-lg-9'>" + CampaignPlannerHistory.Updated_By + "</div>");
                                }
                                else
                                {
                                    strTbl.Append("<div class='col-lg-3 boldText'>Applied By : </div><div class='col-lg-9'></div>");
                                }
                                strTbl.Append("<div style='clear:both;'></div>");
                                strTbl.Append("</div>");

                                //Applied Date
                                strTbl.Append("<div class='col-lg-12'>");
                                if (!string.IsNullOrEmpty(CampaignPlannerHistory.Updated_Date))
                                {
                                    strTbl.Append("<div class='col-lg-3 boldText'>Applied Date : </div><div class='col-lg-9'>" + CampaignPlannerHistory.Updated_Date + "</div>");
                                }
                                else
                                {
                                    strTbl.Append("<div class='col-lg-3 boldText'>Applied Date : </div><div class='col-lg-9'></div>");
                                }
                                strTbl.Append("<div style='clear:both;'></div>");
                                strTbl.Append("</div>");
                            }
                            else
                            {
                                //AppliedBy
                                strTbl.Append("<div class='col-lg-12'>");

                                if (!string.IsNullOrEmpty(CampaignPlannerHistory.Created_By))
                                {
                                    strTbl.Append("<div class='col-lg-3 boldText'>Applied Date : </div><div class='col-lg-9'>" + CampaignPlannerHistory.Created_By + "</div>");
                                }
                                else
                                {
                                    strTbl.Append("<div class='col-lg-3 boldText'>Applied Date : </div><div class='col-lg-9'></div>");
                                }

                                strTbl.Append("<div style='clear:both;'></div>");
                                strTbl.Append("</div>");

                                //Applied Date
                                strTbl.Append("<div class='col-lg-12'>");

                                if (!string.IsNullOrEmpty(CampaignPlannerHistory.Created_Date))
                                {
                                    strTbl.Append("<div class='col-lg-3 boldText'>Applied Date : </div><div class='col-lg-9'>" + CampaignPlannerHistory.Created_Date + "</div>");
                                }
                                else
                                {
                                    strTbl.Append("<div class='col-lg-3 boldText'>Applied Date : </div><div class='col-lg-9'></div>");
                                }

                                strTbl.Append("<div style='clear:both;'></div>");
                                strTbl.Append("</div>");
                            }
                        }
                        if (CampaignPlannerHistory.Status == "0")
                        {
                            //UnapprovedBy
                            strTbl.Append("<div class='col-lg-12'>");
                            if (!string.IsNullOrEmpty(CampaignPlannerHistory.Cp_Approved_By))
                            {
                                strTbl.Append("<div class='col-lg-3 boldText'>Unapproved By : </div><div class='col-lg-9'>" + CampaignPlannerHistory.Cp_Approved_By + "</div>");
                            }
                            else
                            {
                                strTbl.Append("<div class='col-lg-3 boldText'>Applied Date : </div><div class='col-lg-9'></div>");
                            }

                            strTbl.Append("<div style='clear:both;'></div>");
                            strTbl.Append("</div>");

                            //Unapproved Date
                            strTbl.Append("<div class='col-lg-12'>");
                            strTbl.Append("<div class='col-lg-3 boldText'>Unapproved Date : </div><div class='col-lg-9'>" + CampaignPlannerHistory.Cp_Approved_Date + "</div>");
                            strTbl.Append("<div style='clear:both;'></div>");
                            strTbl.Append("</div>");

                            //Unapproved Reason
                            strTbl.Append("<div class='col-lg-12'>");
                            strTbl.Append("<div class='col-lg-3 boldText'>Unapproved Reason : </div><div class='col-lg-9'>" + CampaignPlannerHistory.Unapprove_Reason + "</div>");
                            strTbl.Append("<div style='clear:both;'></div>");
                            strTbl.Append("</div>");
                        }
                        if (CampaignPlannerHistory.Status.ToString() == "1")
                        {
                            //ApprovedBy
                            strTbl.Append("<div class='col-lg-12'>");
                            strTbl.Append("<div class='col-lg-3 boldText'>Approved By : </div><div class='col-lg-9'>" + CampaignPlannerHistory.Cp_Approved_By + "</div>");
                            strTbl.Append("<div style='clear:both;'></div>");
                            strTbl.Append("</div>");

                            //Approved Date
                            strTbl.Append("<div class='col-lg-12'>");
                            strTbl.Append("<div class='col-lg-3 boldText'>Approved Date : </div><div class='col-lg-9'>" + CampaignPlannerHistory.Cp_Approved_Date + "</div>");
                            strTbl.Append("<div style='clear:both;'></div>");
                            strTbl.Append("</div>");
                        }

                        strTbl.Append("</div>");
                    }
                    strTbl.Append("</div>");
                    strTbl.Append("</div>");
                }
                else
                {
                    strTbl.Append("No History Details found for this CP.");
                }
                return strTbl.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("cpCode", cpCode);
                dicObj.Add("cpName", cpName);
                dicObj.Add("regionCode", regionCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return "FAIL^" + ex.Message;
            }
        }

        public string GetCPSFCDetails(string regionCode, string cpCode, string cpName)
        {
            IEnumerable<MVCModels.CampaignPlannerSFC> lstCPSFC = null;
            lstCPSFC = _objApp.GetCPSFCDetails(_objCurr.GetCompanyCode(), cpCode, regionCode);
            StringBuilder sbTableContent = new StringBuilder();
            if (lstCPSFC != null && lstCPSFC.ToList().Count > 0)
            {
                sbTableContent.Append("<div> SFC Details - CP Name : " + cpName + "</div>");
                sbTableContent.Append("<table class='table table-striped'>");
                sbTableContent.Append("<thead>");
                sbTableContent.Append("<tr>");
                // sbTableContent.Append("<th>Work Area</th>");
                sbTableContent.Append("<th>From Place</th>");
                sbTableContent.Append("<th>To Place</th>");
                sbTableContent.Append("<th>Distance</th>");
                sbTableContent.Append("<th>Fare Amount</th>");
                sbTableContent.Append("<th>Travel Mode</th>");
                sbTableContent.Append("</tr></thead><tbody>");
                foreach (var cpDetails in lstCPSFC)
                {
                    sbTableContent.Append("<tr>");
                    //sbTableContent.Append("<td>");
                    //sbTableContent.Append(cpDetails.Work_Place);
                    //sbTableContent.Append("</td>");
                    if (cpDetails.Route_Way.Trim() == "D" && cpDetails.Route_Way != null)
                    {
                        sbTableContent.Append("<td>");
                        sbTableContent.Append(cpDetails.From_Place);
                        sbTableContent.Append("</td>");
                        sbTableContent.Append("<td>");
                        sbTableContent.Append(cpDetails.To_Place);
                        sbTableContent.Append("</td>");
                    }
                    else if (cpDetails.Route_Way.Trim() == "R")
                    {
                        sbTableContent.Append("<td>");
                        sbTableContent.Append(cpDetails.To_Place);
                        sbTableContent.Append("</td>");
                        sbTableContent.Append("<td>");
                        sbTableContent.Append(cpDetails.From_Place);
                        sbTableContent.Append("</td>");

                    }
                    else
                    {
                        sbTableContent.Append("<td>");
                        sbTableContent.Append(cpDetails.From_Place);
                        sbTableContent.Append("</td>");
                        sbTableContent.Append("<td>");
                        sbTableContent.Append(cpDetails.To_Place);
                        sbTableContent.Append("</td>");
                    }

                    sbTableContent.Append("<td>");
                    sbTableContent.Append(cpDetails.Distance);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(cpDetails.Amount);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(cpDetails.Travel_Mode);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("</tr>");
                }
                sbTableContent.Append("</tbody></table>");
            }
            else
            {
                sbTableContent.Append("<span>No  Details Found.</span>");
            }

            return sbTableContent.ToString();
        }

        public string GetDCRSelectedUsers(string month, string year, string dcrStatus, string dcrFlag, string selection, string divisionCodes)
        {
            StringBuilder sbContent = new StringBuilder();
            IEnumerable<MVCModels.HiDoctor_Master.UserModel> lstUserList = null;
            lstUserList = _objApp.GetDCRUserCount(_objCurr.GetCompanyCode(), _objCurr.GetUserCode(), dcrFlag, dcrStatus, month, year, selection, divisionCodes);
            lstUserList = lstUserList.OrderBy(x => x.Full_Index).ToList();
            string currentUserCode = string.Empty;
            currentUserCode = _objCurr.GetUserCode();

            if (lstUserList != null && lstUserList.ToList().Count > 0)
            {
                sbContent.Append("<ul>");
                foreach (var dcrApproval in lstUserList)
                {
                    sbContent.Append("<li><a onclick='fnGetDCRDetails(\"" + dcrApproval.User_Code + "|" + dcrApproval.Region_Code + "|" + dcrApproval.User_Name + "," + dcrApproval.User_Type_Name + "(" + dcrApproval.Region_Name + ")" + "\")'>" + dcrApproval.User_Name + "," + dcrApproval.User_Type_Name + "(" + dcrApproval.Region_Name + ")" + "</a></li>");

                }
                sbContent.Append("</ul>");
            }
            else
            {
                sbContent.Append("No users found");
            }

            return sbContent.ToString();
        }

        public ActionResult ExpenseClaimApproval()
        {
            ViewBag.Company_Code = _objCurr.GetCompanyCode();
            ViewBag.Region_Code = _objCurr.GetRegionCode();
            ViewBag.User_Name = _objCurr.GetUserName();
            ViewBag.RegionName = _objCurr.GetRegionName();
            ViewBag.User_Code = _objCurr.GetUserCode();
            ViewBag.User_Type_Code = _objCurr.GetUserTypeCode();
            ViewBag.User_Type_Name = _objCurr.GetUserTypeName();
            return View();
        }


        public string GetSecondarySalesApprovalHeader(string month, string year, string status)
        {

            IEnumerable<MVCModels.EmployeeDetailModel> lstEmpDetails = null;
            lstEmpDetails = _objApp.GetSecondarySalesHeader(_objCurr.GetCompanyCode(), _objCurr.GetRegionCode(), status, month, year);
            StringBuilder sbTableContent = new StringBuilder();
            int rowNo = 0;

            if (lstEmpDetails != null && lstEmpDetails.ToList().Count > 0)
            {
                sbTableContent.Append("<table class='table table-striped'>");
                sbTableContent.Append("<thead>");
                sbTableContent.Append("<tr>");
                sbTableContent.Append("<th><input type='checkbox' id='bulkSScheck' name='bulkchk_SS' onclick='fnSSselectall()'/></th>");
                sbTableContent.Append("<th>Region Name</th>");
                sbTableContent.Append("<th>User Name</th>");
                sbTableContent.Append("<th>Employee Name</th>");
                sbTableContent.Append("<th>Reporting Manager Name</th>");
                sbTableContent.Append("<th>Manager Region Name</th>");
                sbTableContent.Append("</tr></thead><tbody>");
                foreach (var empInfo in lstEmpDetails)
                {
                    rowNo++;
                    sbTableContent.Append("<tr>");
                    sbTableContent.Append("<td style='text-align:left'>");
                    sbTableContent.Append("<input type='checkbox'  id='chkSelect_" + rowNo + "' name='chkSelect' />");
                    sbTableContent.Append("<input type='hidden' id='hdnApprovl_" + rowNo + "'");
                    sbTableContent.Append("value='" + empInfo.Region_Code + "|" + status + "|" + month + "|" + year + "'/>");
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(empInfo.Region_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(empInfo.User_Name);
                    sbTableContent.Append("<input type='hidden' value='" + empInfo.User_Code + "' />");
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td >");
                    sbTableContent.Append(empInfo.Employee_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(empInfo.Manager_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(empInfo.Manager_Region_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("</tr>");
                }
                sbTableContent.Append("</tbody></table>");
            }
            else
            {
                sbTableContent.Append("NO");

            }
            return sbTableContent.ToString();
        }




        public string GetSecondarySalesApprovalDetails(string month, string year, string status, string regionCode)
        {

            IEnumerable<MVCModels.EmployeeDetailModel> lstEmpDetails = null;
            lstEmpDetails = _objApp.GetSecondarySalesDetails(_objCurr.GetCompanyCode(), regionCode, status, month, year);
            StringBuilder sbTableContent = new StringBuilder();
            int rowNo = 0;

            if (lstEmpDetails != null && lstEmpDetails.ToList().Count > 0)
            {
                sbTableContent.Append("<table class='table table-striped'>");
                sbTableContent.Append("<thead>");
                sbTableContent.Append("<tr>");
                sbTableContent.Append("<th><input type='checkbox' id='bulkSScheckDetails' name='chkSSSelectS' onclick='fnSSDetailsSelectAll()'/></th>");
                sbTableContent.Append("<th>Remarks</th>");
                sbTableContent.Append("<th>View</th>");
                sbTableContent.Append("<th>Region Name</th>");
                sbTableContent.Append("<th>User Name</th>");
                sbTableContent.Append("<th>Employee Name</th>");
                sbTableContent.Append("<th>Reporting Manager Name</th>");
                sbTableContent.Append("<th>Manager Region Name</th>");
                sbTableContent.Append("<th>Stockiest Name</th>");
                sbTableContent.Append("<th>Customer Name</th>");
                sbTableContent.Append("<th>Statement Date</th>");
                sbTableContent.Append("<th>Status</th>");
                sbTableContent.Append("</tr></thead><tbody>");
                foreach (var empInfo in lstEmpDetails)
                {
                    rowNo++;
                    sbTableContent.Append("<tr>");
                    sbTableContent.Append("<td style='text-align:left'>");
                    if (empInfo.SS_Status.ToUpper() != "APPROVED")
                    {
                        sbTableContent.Append("<input  type='checkbox'  id='chkSSSelect_" + rowNo + "' name='chkSSSelect' />");
                    }
                    sbTableContent.Append("<input type='hidden' id='hdnApprovlDetails_" + rowNo + "'");
                    sbTableContent.Append("value='" + empInfo.Region_Code + "|" + empInfo.SS_Code + "|" + status + "|" + month + "|" + year + "|" + empInfo.User_Code + "|" + empInfo.Remarks + "|" + empInfo.Customer_Code + "|" + empInfo.Customer_Name + "'/>");
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td><textarea rows='2' cols='15' maxlength='500' id='txtRemarks_" + rowNo + "'/></td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append("<span onclick='fnReportSSTwo(\"" + empInfo.Region_Code + "|" + empInfo.SS_Code + "|" + status + "|" + month + "|" + year + "|" + empInfo.User_Code + "|" + empInfo.Remarks + "|" + empInfo.Customer_Code + "|" + empInfo.Customer_Name + "|" + empInfo.SS_Statement_Date + "\")' style='text-decoration:underline;cursor:pointer'>View</span></td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(empInfo.Region_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(empInfo.User_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td >");
                    sbTableContent.Append(empInfo.Employee_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(empInfo.Manager_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(empInfo.Manager_Region_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(empInfo.Stockiest_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(empInfo.Customer_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(empInfo.SS_Statement_Date);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td " + GetColorCode(empInfo.SS_Status) + ">");
                    sbTableContent.Append(empInfo.SS_Status);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("</tr>");
                }
                sbTableContent.Append("</tbody></table>");
            }
            else
            {
                sbTableContent.Append("NO");

            }
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return sbTableContent.ToString() + "$" + json.Serialize(lstEmpDetails);
        }




        public JsonResult GetSecondarySalesApprovalTwo(string month, string year, string status, string regionCode, string ssCode, string userCode)
        {

            List<MVCModels.SecondarySalesApprovalModel> lstEmpDetails = null;
            try
            {
                lstEmpDetails = _objApp.GetSecondarySalesApprovalTwo(_objCurr.GetCompanyCode(), regionCode, status, month, year, ssCode);
                return Json(lstEmpDetails, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
            //StringBuilder sbTableContent = new StringBuilder();
            //if (lstEmpDetails.Count > 0 && lstEmpDetails[0].lstEmployeeDetail.ToList().Count > 0)
            //{
            //    sbTableContent.Append("<table class='table table-striped'>");
            //    sbTableContent.Append("<tr><td> User Name : </td>");
            //    sbTableContent.Append("<td>");
            //    sbTableContent.Append(lstEmpDetails[0].lstEmployeeDetail[0].User_Name);
            //    sbTableContent.Append("</td>");
            //    sbTableContent.Append("<td> Reporting Manager name :</td>");
            //    sbTableContent.Append("<td>");
            //    sbTableContent.Append(lstEmpDetails[0].lstEmployeeDetail[0].Manager_Name);
            //    sbTableContent.Append("</td></tr>");

            //    sbTableContent.Append("<tr><td> Employee Name : </td>");
            //    sbTableContent.Append("<td>");
            //    sbTableContent.Append(lstEmpDetails[0].lstEmployeeDetail[0].Employee_Name);
            //    sbTableContent.Append("</td>");
            //    sbTableContent.Append("<td> Manager Region Name :</td>");
            //    sbTableContent.Append("<td>");
            //    sbTableContent.Append(lstEmpDetails[0].lstEmployeeDetail[0].Manager_Region_Name);
            //    sbTableContent.Append("</td></tr>");

            //    sbTableContent.Append("<tr><td> Region Name : </td>");
            //    sbTableContent.Append("<td>");
            //    sbTableContent.Append(lstEmpDetails[0].lstEmployeeDetail[0].Employee_Name);
            //    sbTableContent.Append("</td>");
            //    sbTableContent.Append("<td></td>");
            //    sbTableContent.Append("<td>");
            //    sbTableContent.Append("</td></tr>");

            //    sbTableContent.Append("<tr><td> Stockiest Name :  </td>");
            //    sbTableContent.Append("<td>");
            //    sbTableContent.Append(lstEmpDetails[0].lstEmployeeDetail[0].Stockiest_Name);
            //    sbTableContent.Append("</td>");
            //    sbTableContent.Append("<td></td>");
            //    sbTableContent.Append("<td>");
            //    sbTableContent.Append("</td></tr>");

            //    sbTableContent.Append("<tr><td> Customer Name :  </td>");
            //    sbTableContent.Append("<td>");
            //    sbTableContent.Append(lstEmpDetails[0].lstEmployeeDetail[0].Customer_Name);
            //    sbTableContent.Append("</td>");
            //    sbTableContent.Append("<td></td>");
            //    sbTableContent.Append("<td>");
            //    sbTableContent.Append("</td></tr>");


            //    sbTableContent.Append("<tr ><td > Statement Date :  </td>");
            //    sbTableContent.Append("<td>");
            //    sbTableContent.Append(lstEmpDetails[0].lstEmployeeDetail[0].SS_Statement_Date);
            //    sbTableContent.Append("</td>");
            //    sbTableContent.Append("<td>Status :</td>");
            //    sbTableContent.Append("<td>");
            //    sbTableContent.Append(lstEmpDetails[0].lstEmployeeDetail[0].SS_Status);
            //    sbTableContent.Append("</td></tr></table>");

            //    sbTableContent.Append("<table class='table table-striped'>");
            //    sbTableContent.Append("<thead>");
            //    sbTableContent.Append("<tr>");
            //    sbTableContent.Append("<th rowspan='2'>SNo</th>");
            //    sbTableContent.Append("<th rowspan='2'>Product Name</th>");
            //    sbTableContent.Append("<th rowspan='2'>Unit Rate</th>");

            //    string ssPrivilege = string.Empty;
            //    SPData objSP = new SPData();
            //    string[] ssInputColumn = null;
            //    int iRow = 0;

            //    if (string.IsNullOrEmpty(userCode))
            //    {
            //        userCode = _objCurr.GetUserCode();
            //    }

            //    ssPrivilege = objSP.GetSinglePrivilegeNameForUser(_objCurr.GetCompanyCode(), userCode, "SS_INPUT_COLUMNS");
            //    ssPrivilege += ",Remarks";

            //    if (!string.IsNullOrEmpty(ssPrivilege))
            //    {
            //        ssInputColumn = ssPrivilege.Split(',');
            //    }
            //    if (ssInputColumn != null)
            //    {
            //        foreach (string inputColumn in ssInputColumn)
            //        {
            //            if (inputColumn.ToUpper() != "REMARKS")
            //            {
            //                sbTableContent.Append("<th style='text-align:center' colspan='2'>");
            //                sbTableContent.Append(inputColumn);
            //                sbTableContent.Append("</th>");
            //            }
            //            else
            //            {
            //                sbTableContent.Append("<th rowspan='2'>");
            //                sbTableContent.Append(inputColumn);
            //                sbTableContent.Append("</th>");
            //            }
            //        }
            //    }
            //    sbTableContent.Append("</tr><tr>");
            //    if (ssInputColumn != null)
            //    {
            //        foreach (string inputColumn in ssInputColumn)
            //        {
            //            if (inputColumn.ToUpper() != "REMARKS")
            //            {
            //                sbTableContent.Append("<th>");
            //                sbTableContent.Append("Qty");
            //                sbTableContent.Append("</th>");
            //                sbTableContent.Append("<th>");
            //                sbTableContent.Append("Value");
            //                sbTableContent.Append("</th>");
            //            }
            //        }
            //    }
            //    sbTableContent.Append("</tr>");

            //    sbTableContent.Append(" </thead><tbody>");

            //    foreach (var empInfo in lstEmpDetails[0].lstSecondarySalesProduct)
            //    {

            //        sbTableContent.Append("<tr>");
            //        iRow++;
            //        sbTableContent.Append("<td>");
            //        sbTableContent.Append(iRow);
            //        sbTableContent.Append("</td>");
            //        sbTableContent.Append("<td>");
            //        sbTableContent.Append(empInfo.Product_Name);
            //        sbTableContent.Append("</td>");
            //        sbTableContent.Append("<td>");
            //        sbTableContent.Append(empInfo.Price_Per_Unit);
            //        sbTableContent.Append("</td>");
            //        if (ssInputColumn != null)
            //        {
            //            foreach (string inputColumn in ssInputColumn)
            //            {
            //                if (inputColumn.ToUpper() == "OPENING_BALANCE")
            //                {
            //                    sbTableContent.Append("<td>");
            //                    sbTableContent.Append(empInfo.Opening_Stock);
            //                    sbTableContent.Append("</td>");
            //                    sbTableContent.Append("<td>");
            //                    sbTableContent.Append(empInfo.Opening_Stock_Value);
            //                    sbTableContent.Append("</td>");
            //                }
            //                else if (inputColumn.ToUpper() == "PURCHASE")
            //                {
            //                    sbTableContent.Append("<td>");
            //                    sbTableContent.Append(empInfo.Purchase);
            //                    sbTableContent.Append("</td>");
            //                    sbTableContent.Append("<td>");
            //                    sbTableContent.Append(empInfo.Purchase_Value);
            //                    sbTableContent.Append("</td>");
            //                }
            //                else if (inputColumn.ToUpper() == "PURCHASE_RETURN")
            //                {
            //                    sbTableContent.Append("<td>");
            //                    sbTableContent.Append(empInfo.Purchase_Return);
            //                    sbTableContent.Append("</td>");
            //                    sbTableContent.Append("<td>");
            //                    sbTableContent.Append(empInfo.Purchase_return_Value);
            //                    sbTableContent.Append("</td>");
            //                }
            //                else if (inputColumn.ToUpper() == "SALES")
            //                {
            //                    sbTableContent.Append("<td>");
            //                    sbTableContent.Append(empInfo.Sales);
            //                    sbTableContent.Append("</td>");
            //                    sbTableContent.Append("<td>");
            //                    sbTableContent.Append(empInfo.Sales_Value);
            //                    sbTableContent.Append("</td>");
            //                }
            //                else if (inputColumn.ToUpper() == "SALES_RETURN")
            //                {
            //                    sbTableContent.Append("<td>");
            //                    sbTableContent.Append(empInfo.Sales_Return);
            //                    sbTableContent.Append("</td>");
            //                    sbTableContent.Append("<td>");
            //                    sbTableContent.Append(empInfo.Sales_Return_Value);
            //                    sbTableContent.Append("</td>");
            //                }
            //                else if (inputColumn.ToUpper() == "TRANSIT")
            //                {
            //                    sbTableContent.Append("<td>");
            //                    sbTableContent.Append(empInfo.Transit);
            //                    sbTableContent.Append("</td>");
            //                    sbTableContent.Append("<td>");
            //                    sbTableContent.Append(empInfo.Transit_value);
            //                    sbTableContent.Append("</td>");
            //                }
            //                else if (inputColumn.ToUpper() == "CLOSING_BALANCE")
            //                {

            //                    sbTableContent.Append("<td>");
            //                    sbTableContent.Append(empInfo.Closing_Stock);
            //                    sbTableContent.Append("</td>");
            //                    sbTableContent.Append("<td>");
            //                    sbTableContent.Append(empInfo.Closing_Stock_Value);
            //                    sbTableContent.Append("</td>");
            //                }
            //                else if (inputColumn.ToUpper() == "FREE_GOODS")
            //                {
            //                    sbTableContent.Append("<td>");
            //                    sbTableContent.Append(empInfo.Free_Goods);
            //                    sbTableContent.Append("</td>");
            //                    sbTableContent.Append("<td>");
            //                    sbTableContent.Append(empInfo.Free_Goods_Value);
            //                    sbTableContent.Append("</td>");
            //                }
            //                else if (inputColumn.ToUpper() == "REMARKS")
            //                {
            //                    sbTableContent.Append("<td>");
            //                    sbTableContent.Append(empInfo.Remarks);
            //                    sbTableContent.Append("</td>");

            //                }
            //            }
            //        }
            //        sbTableContent.Append("</tr>");
            //    }
            //    sbTableContent.Append("<tr>");
            //    sbTableContent.Append("<td style='text-align:right' colspan='2'>");
            //    sbTableContent.Append("Total");
            //    sbTableContent.Append("</td>");
            //    sbTableContent.Append("<td >");
            //    sbTableContent.Append("</td>");
            //    if (ssInputColumn != null)
            //    {
            //        foreach (string inputColumn in ssInputColumn)
            //        {
            //            if (inputColumn.ToUpper() == "OPENING_BALANCE")
            //            {
            //                sbTableContent.Append("<td>");
            //                sbTableContent.Append(lstEmpDetails[0].lstSecondarySalesProduct.Sum(c => Convert.ToDecimal(c.Opening_Stock)));
            //                sbTableContent.Append("</td>");
            //                sbTableContent.Append("<td>");
            //                sbTableContent.Append(lstEmpDetails[0].lstSecondarySalesProduct.Sum(c => Convert.ToDecimal(c.Opening_Stock_Value)));
            //                sbTableContent.Append("</td>");
            //            }
            //            else if (inputColumn.ToUpper() == "PURCHASE")
            //            {
            //                sbTableContent.Append("<td>");
            //                sbTableContent.Append(lstEmpDetails[0].lstSecondarySalesProduct.Sum(c => Convert.ToDecimal(c.Purchase)));
            //                sbTableContent.Append("</td>");
            //                sbTableContent.Append("<td>");
            //                sbTableContent.Append(lstEmpDetails[0].lstSecondarySalesProduct.Sum(c => Convert.ToDecimal(c.Purchase_Value)));
            //                sbTableContent.Append("</td>");
            //            }
            //            else if (inputColumn.ToUpper() == "PURCHASE_RETURN")
            //            {
            //                sbTableContent.Append("<td>");
            //                sbTableContent.Append(lstEmpDetails[0].lstSecondarySalesProduct.Sum(c => Convert.ToDecimal(c.Purchase_Return)));
            //                sbTableContent.Append("</td>");
            //                sbTableContent.Append("<td>");
            //                sbTableContent.Append(lstEmpDetails[0].lstSecondarySalesProduct.Sum(c => Convert.ToDecimal(c.Purchase_return_Value)));
            //                sbTableContent.Append("</td>");
            //            }
            //            else if (inputColumn.ToUpper() == "SALES")
            //            {
            //                sbTableContent.Append("<td>");
            //                sbTableContent.Append(lstEmpDetails[0].lstSecondarySalesProduct.Sum(c => Convert.ToDecimal(c.Sales)));
            //                sbTableContent.Append("</td>");
            //                sbTableContent.Append("<td>");
            //                sbTableContent.Append(lstEmpDetails[0].lstSecondarySalesProduct.Sum(c => Convert.ToDecimal(c.Sales_Value)));
            //                sbTableContent.Append("</td>");
            //            }
            //            else if (inputColumn.ToUpper() == "SALES_RETURN")
            //            {
            //                sbTableContent.Append("<td>");
            //                sbTableContent.Append(lstEmpDetails[0].lstSecondarySalesProduct.Sum(c => Convert.ToDecimal(c.Sales_Return)));
            //                sbTableContent.Append("</td>");
            //                sbTableContent.Append("<td>");
            //                sbTableContent.Append(lstEmpDetails[0].lstSecondarySalesProduct.Sum(c => Convert.ToDecimal(c.Sales_Return_Value)));
            //                sbTableContent.Append("</td>");
            //            }
            //            else if (inputColumn.ToUpper() == "TRANSIT")
            //            {

            //                sbTableContent.Append("<td>");
            //                sbTableContent.Append(lstEmpDetails[0].lstSecondarySalesProduct.Sum(c => Convert.ToDecimal(c.Transit)));
            //                sbTableContent.Append("</td>");
            //                sbTableContent.Append("<td>");
            //                sbTableContent.Append(lstEmpDetails[0].lstSecondarySalesProduct.Sum(c => Convert.ToDecimal(c.Transit_value)));
            //                sbTableContent.Append("</td>");
            //            }
            //            else if (inputColumn.ToUpper() == "CLOSING_BALANCE")
            //            {
            //                sbTableContent.Append("<td>");
            //                sbTableContent.Append(lstEmpDetails[0].lstSecondarySalesProduct.Sum(c => Convert.ToDecimal(c.Closing_Stock)));
            //                sbTableContent.Append("</td>");
            //                sbTableContent.Append("<td>");
            //                sbTableContent.Append(lstEmpDetails[0].lstSecondarySalesProduct.Sum(c => Convert.ToDecimal(c.Closing_Stock_Value)));
            //                sbTableContent.Append("</td>");
            //            }
            //            else if (inputColumn.ToUpper() == "FREE_GOODS")
            //            {
            //                sbTableContent.Append("<td>");
            //                sbTableContent.Append(lstEmpDetails[0].lstSecondarySalesProduct.Sum(c => Convert.ToDecimal(c.Free_Goods)));
            //                sbTableContent.Append("</td>");
            //                sbTableContent.Append("<td>");
            //                sbTableContent.Append(lstEmpDetails[0].lstSecondarySalesProduct.Sum(c => Convert.ToDecimal(c.Free_Goods_Value)));
            //                sbTableContent.Append("</td>");
            //            }
            //        }
            //    }
            //    sbTableContent.Append("</tr>");
            //    sbTableContent.Append("</tbody></table>$");

            //    if (!string.IsNullOrEmpty(lstEmpDetails[0].lstEmployeeDetail[0].Remarks))
            //    {
            //        string[] remarksArr = lstEmpDetails[0].lstEmployeeDetail[0].Remarks.Split('^');
            //        sbTableContent.Append("<div >Remarks :</div >");
            //        for (var j = 0; j < remarksArr.Length; j++)
            //        {
            //            if (remarksArr[j] != "")
            //            {
            //                sbTableContent.Append("<div >");
            //                if (remarksArr[j].Split('~')[0] != "")
            //                {
            //                    sbTableContent.Append("<div >" + remarksArr[j].Split('~')[0] + "</div>");
            //                }
            //                if (remarksArr[j].Split('~')[1] != "")
            //                {
            //                    sbTableContent.Append("<div >" + remarksArr[j].Split('~')[1] + "</div>");
            //                }
            //                sbTableContent.Append("</div>");
            //            }
            //        }
            //    }
            //}
            //else
            //{
            //    sbTableContent.Append("");

            //}
            //return sbTableContent.ToString();
        }


        public string GetWideAngleUserHeader(string month, string year, string status)
        {

            IEnumerable<MVCModels.EmployeeDetailModel> lstEmpDetails = null;
            lstEmpDetails = _objApp.GetWideAngleHeader(_objCurr.GetCompanyCode(), _objCurr.GetUserCode(), status, month, year);
            StringBuilder sbTableContent = new StringBuilder();
            int rowNo = 0;

            if (lstEmpDetails != null && lstEmpDetails.ToList().Count > 0)
            {
                sbTableContent.Append("<table class='table table-striped'>");
                sbTableContent.Append("<thead>");
                sbTableContent.Append("<tr>");
                sbTableContent.Append("<th><input type='checkbox' id='bulkcheckDetails' name='chkWideSelect' onclick='fnDetailsSelectAll()'/></th>");
                sbTableContent.Append("<th>Remarks</th>");
                sbTableContent.Append("<th>View</th>");
                sbTableContent.Append("<th>User Name</th>");
                sbTableContent.Append("<th>Employee Name</th>");
                sbTableContent.Append("<th>Region Name</th>");
                sbTableContent.Append("<th>Reporting Manager Name</th>");
                sbTableContent.Append("<th>Manager Region Name</th>");
                sbTableContent.Append("<th>Request category</th>");
                sbTableContent.Append("<th>Period</th>");
                sbTableContent.Append("<th>Date of Reqeust</th>");
                sbTableContent.Append("<th>Remarks</th>");
                sbTableContent.Append("<th>Status</th>");
                sbTableContent.Append("</tr></thead><tbody>");
                foreach (var empInfo in lstEmpDetails)
                {
                    rowNo++;
                    sbTableContent.Append("<tr>");
                    sbTableContent.Append("<td style='text-align:left'>");
                    //if (empInfo.Request_Status.ToUpper() != "APPROVED")
                    //{
                    sbTableContent.Append("<input  type='checkbox'  id='chkSelect_" + rowNo + "' name='chkSelect' />");
                    //}
                    sbTableContent.Append("<input type='hidden' id='hdnApprovlDetails_" + rowNo + "'");
                    sbTableContent.Append("value='" + empInfo.User_Code + "|" + empInfo.Request_Id + "|" + status + "|" + empInfo.Region_Code + "|" + empInfo.Date_From + "|" + empInfo.Date_To + "'/>");
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td><textarea rows='2' cols='15' maxlength='500' id='txtRemarks_" + rowNo + "'/></td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append("<span onclick='fnReportWideAngleTwo(\"" + empInfo.User_Code + "|" + empInfo.Request_Id + "|" + status + "|" + empInfo.Region_Code + "|" + empInfo.Date_From + "|" + empInfo.Date_To + "\")' style='text-decoration:underline;cursor:pointer'>View</span></td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(empInfo.User_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td >");
                    sbTableContent.Append(empInfo.Employee_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(empInfo.Region_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(empInfo.Manager_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(empInfo.Manager_Region_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(empInfo.Request_Category);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(empInfo.Date_From + " - ");
                    sbTableContent.Append(empInfo.Date_To + " - ");
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(empInfo.Requested_Date);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append("<span onclick='fnShowWideAngleRemarks(\"" + empInfo.Remarks + "\")' style='text-decoration:underline;cursor:pointer'>View</span>");
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td " + GetColorCode(empInfo.Request_Status) + ">");
                    sbTableContent.Append(empInfo.Request_Status);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("</tr>");
                }
                sbTableContent.Append("</tbody></table>~");
                StringBuilder sbExeclExport = bindWideAngleApprovalExcelExport(lstEmpDetails);
                DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                string userName = _objCurr.GetUserName();
                string domainName = _objCurr.GetSubDomain();

                string fileName = "WideAngleApproval" + "_" + domainName + "_" + userName + ".xls";
                string blobUrl = objAzureBlob.AzureBlobUploadText(sbExeclExport.ToString(), accKey, fileName, "bulkdatasvc");
                sbTableContent.Append("<div class='col-lg-3' style='text-align:right'><a href='" + blobUrl + "'>Click here to Download</a></div>");

            }
            else
            {
                sbTableContent.Append("NO");

            }

            return sbTableContent.ToString();
        }

        public StringBuilder bindWideAngleApprovalExcelExport(IEnumerable<MVCModels.EmployeeDetailModel> lstEmpDetails)
        {
            StringBuilder sbTableContent = new StringBuilder();
            if (lstEmpDetails != null && lstEmpDetails.ToList().Count > 0)
            {
                sbTableContent.Append("<table class='table table-striped'>");
                sbTableContent.Append("<thead>");
                sbTableContent.Append("<tr>");
                sbTableContent.Append("<th>User Name</th>");
                sbTableContent.Append("<th>Employee Name</th>");
                sbTableContent.Append("<th>Region Name</th>");
                sbTableContent.Append("<th>Reporting Manager Name</th>");
                sbTableContent.Append("<th>Manager Region Name</th>");
                sbTableContent.Append("<th>Request category</th>");
                sbTableContent.Append("<th>Period</th>");
                sbTableContent.Append("<th>Date of Reqeust</th>");
                sbTableContent.Append("<th>Remarks</th>");
                sbTableContent.Append("<th>Status</th>");
                sbTableContent.Append("</tr></thead><tbody>");
                foreach (var empInfo in lstEmpDetails)
                {

                    sbTableContent.Append("<tr>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(empInfo.User_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td >");
                    sbTableContent.Append(empInfo.Employee_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(empInfo.Region_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(empInfo.Manager_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(empInfo.Manager_Region_Name);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(empInfo.Request_Category);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(empInfo.Date_From + " - ");
                    sbTableContent.Append(empInfo.Date_To + " - ");
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(empInfo.Requested_Date);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td>");
                    sbTableContent.Append(empInfo.Remarks);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("<td " + GetColorCode(empInfo.Request_Status) + ">");
                    sbTableContent.Append(empInfo.Request_Status);
                    sbTableContent.Append("</td>");
                    sbTableContent.Append("</tr>");
                }
                sbTableContent.Append("</tbody></table>");

            }

            return sbTableContent;
        }

        public string UpdateWideAngleStatus(string details, string status)
        {
            BLApproval objApp = new BLApproval();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string result = objApp.UpdateWideAngleStatus(objCurInfo.GetCompanyCode(), details, status, objCurInfo.GetUserCode(), DateTime.Now.ToString("yyyy-MM-dd"));
            return result;

        }

        public string GetWideAngleApprovalTwo(string status, string userCode, string requestId)
        {
            List<MVCModels.EmployeeDetailModel> lstEmpDetails = null;
            lstEmpDetails = _objApp.GetWideAngleApprovalTwo(_objCurr.GetCompanyCode(), userCode, requestId).ToList();
            StringBuilder sbTableContent = new StringBuilder();
            if (lstEmpDetails != null && lstEmpDetails.Count > 0)
            {
                sbTableContent.Append("DCR Calendar Release request of <" + lstEmpDetails[0].User_Name + "> for the period <" + lstEmpDetails[0].Date_From + "> to <" + lstEmpDetails[0].Date_To + "><br>");
                sbTableContent.Append("<table class='table table-striped'>");
                sbTableContent.Append("<tr><td> User Name : </td>");
                sbTableContent.Append("<td>");
                sbTableContent.Append(lstEmpDetails[0].User_Name);
                sbTableContent.Append("</td>");
                sbTableContent.Append("<td> Reporting Manager name :</td>");
                sbTableContent.Append("<td>");
                sbTableContent.Append(lstEmpDetails[0].Manager_Name);
                sbTableContent.Append("</td></tr>");

                sbTableContent.Append("<tr><td> Employee Name : </td>");
                sbTableContent.Append("<td>");
                sbTableContent.Append(lstEmpDetails[0].Employee_Name);
                sbTableContent.Append("</td>");
                sbTableContent.Append("<td> Manager Region Name :</td>");
                sbTableContent.Append("<td>");
                sbTableContent.Append(lstEmpDetails[0].Manager_Region_Name);
                sbTableContent.Append("</td></tr>");

                sbTableContent.Append("<tr><td> Region Name : </td>");
                sbTableContent.Append("<td>");
                sbTableContent.Append(lstEmpDetails[0].Employee_Name);
                sbTableContent.Append("</td>");
                sbTableContent.Append("<td></td>");
                sbTableContent.Append("<td>");
                sbTableContent.Append("</td></tr>");

                sbTableContent.Append("<tr><td> Category Name  </td>");
                sbTableContent.Append("<td>");
                sbTableContent.Append(lstEmpDetails[0].Request_Category);
                sbTableContent.Append("</td>");
                sbTableContent.Append("<td></td>");
                sbTableContent.Append("<td>");
                sbTableContent.Append("</td></tr>");

                sbTableContent.Append("<tr><td>From Date </td>");
                sbTableContent.Append("<td>");
                sbTableContent.Append(lstEmpDetails[0].Date_From);
                sbTableContent.Append("</td>");
                sbTableContent.Append("<td>To date</td>");
                sbTableContent.Append("<td>");
                sbTableContent.Append(lstEmpDetails[0].Date_To);
                sbTableContent.Append("</td></tr>");

                sbTableContent.Append("<tr ><td > Remarks  </td>");
                sbTableContent.Append("<td>");
                sbTableContent.Append(lstEmpDetails[0].Remarks);
                sbTableContent.Append("</td>");
                sbTableContent.Append("<td>Status :</td>");
                sbTableContent.Append("<td>");
                sbTableContent.Append(lstEmpDetails[0].Request_Status);
                sbTableContent.Append("</td></tr></table>$" + lstEmpDetails[0].Date_From + "|" + lstEmpDetails[0].Date_To + "|" + lstEmpDetails[0].Requested_Date);
            }
            else
            {
                sbTableContent.Append("NO");

            }
            return sbTableContent.ToString();
        }

        #region DCR-Approval
        public string GetDCRApprovalHistorydetails(string dcrCode, string userCode)
        {
            StringBuilder strTbl = new StringBuilder();
            BLApproval _objBLApproval = new BLApproval();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            List<MVCModels.DCRHeaderHistoryModel> lstHistoryDeatils = new List<DCRHeaderHistoryModel>();
            lstHistoryDeatils = _objBLApproval.GetDCRHistoryDetails(objCurInfo.GetCompanyCode(), dcrCode, userCode).ToList();
            try
            {
                strTbl.Append("<table class='table table-striped'>");
                strTbl.Append("<thead class='active'>");
                strTbl.Append("<th>DCR Date</th>");
                strTbl.Append("<th>DCR Submitted Date</th>");
                strTbl.Append("<th>Action</th>");
                strTbl.Append("<th>Action By</th>");
                strTbl.Append("<th>Date of Action</th>");
                strTbl.Append("<th>Reason for Action</th>");
                strTbl.Append("</thead>");
                strTbl.Append("<tbody>");
                if (lstHistoryDeatils != null && lstHistoryDeatils.Count > 0)
                {
                    foreach (var Historydetails in lstHistoryDeatils)
                    {
                        //DCR Date
                        strTbl.Append("<tr>");
                        strTbl.Append("<td>");
                        strTbl.Append(Historydetails.DCR_Actual_Date);
                        strTbl.Append("</td>");
                        //Last Submitted Date
                        strTbl.Append("<td>");
                        strTbl.Append(Historydetails.DCR_Entered_Date);
                        strTbl.Append("</td>");
                        //Action
                        strTbl.Append("<td>");
                        strTbl.Append(Historydetails.DCR_Status);
                        strTbl.Append("</td>");
                        //Action By
                        strTbl.Append("<td>");
                        strTbl.Append(Historydetails.Approved_By + "," + Historydetails.Region_Type_Name + "," + Historydetails.Region_Name);
                        strTbl.Append("</td>");
                        //Date of Action
                        strTbl.Append("<td>");
                        strTbl.Append(Historydetails.Approved_Date);
                        strTbl.Append("</td>");
                        //UnApproval Reason
                        strTbl.Append("<td>");
                        strTbl.Append(Historydetails.Unapproval_Reason.Split('~').Last().TrimEnd('^').ToString());
                        strTbl.Append("</td>");
                        strTbl.Append("</tr>");
                    }
                }
                else
                {
                    strTbl.Append("No History Details found");
                }
                strTbl.Append("</tbody>");
                strTbl.Append("</table>");
                return strTbl.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("dcrCode", dcrCode);
                dicObj.Add("userCode", userCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return "FAIL^" + ex.Message;
            }
        }

        public string GetpendingDCR()
        {
            string result = string.Empty;
            result = "NO";
            DataControl.BLMaster _objMaster = new DataControl.BLMaster();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string companyCode = objCurInfo.GetCompanyCode();
            string userCode = objCurInfo.GetUserCode();
            string currentdate = DateTime.Now.ToString("yyyy-MM-dd");
            string dcrApprovalManagerPriv = objCurInfo.GetPrivilegeValue("PENDING_APPROVAL_COUNT", "0");
            int ApprovalPrivilageCount = Convert.ToInt32(dcrApprovalManagerPriv);
            if (ApprovalPrivilageCount > 0)
            {
                int childuersappliedDcrCount = _objMaster.GetAppliedDCRChildUsersCount(companyCode, userCode, currentdate);
                if (childuersappliedDcrCount > ApprovalPrivilageCount)
                {
                    result = "YES" + "_" + childuersappliedDcrCount + "_" + (Convert.ToString(dcrApprovalManagerPriv));
                }
                else
                {
                    result = "NO";
                }
            }

            return result;

        }

        public string DCRApprovalPending(string month, string Year)
        {
            string result = string.Empty;
            result = "NO";
            DataControl.BLMaster _objMaster = new DataControl.BLMaster();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string companyCode = objCurInfo.GetCompanyCode();
            string userCode = objCurInfo.GetUserCode();
            string currentdate = DateTime.Now.ToString("yyyy-MM-dd");
            string dcrApprovalManagerPriv = objCurInfo.GetPrivilegeValue("PENDING_APPROVAL_COUNT", "0");
            int ApprovalPrivilageCount = Convert.ToInt32(dcrApprovalManagerPriv);
            if (ApprovalPrivilageCount > 0)
            {
                int childuersappliedDcrCount = _objMaster.GetAppliedDCRChildUsersCount(companyCode, userCode, currentdate);
                int currentmonthDcrAppliedUsers = _objMaster.GetCurrentMonthAppliedDCRChildUsersCount(companyCode, userCode, month, Year);
                if (childuersappliedDcrCount > ApprovalPrivilageCount)
                {
                    if (childuersappliedDcrCount > 0)
                        result = "YES" + "_" + childuersappliedDcrCount + "_" + (Convert.ToString(currentmonthDcrAppliedUsers));
                    else
                        result = "NO";


                }
                else
                {
                    result = "NO";
                }
            }

            return result;

        }



        public string dcrapprovalscreen()
        {
            string Url = string.Empty;
            Url = "HiDoctor_Master/Approval/DCRApproval";
            return Url;
        }
        /// <summary>
        /// Get TP details
        /// </summary>
        /// <returns></returns>
        public string GetDCRTpdetails(int tpId)
        {
            BLApproval _objApproval = new BLApproval();
            List<DCRTPDetailsModel> lstTPDetails = null;
            StringBuilder strTb = new StringBuilder();
            string dcrType = string.Empty;
            string leaveTypeName = string.Empty;
            string accName = string.Empty;

            try
            {
                lstTPDetails = _objApproval.GetDCRTpdeails(_objCurr.GetCompanyCode(), tpId).ToList();
                if (lstTPDetails.Count != null && lstTPDetails.Count > 0)
                {
                    strTb.Append("<div class='col-lg-12' style='border:3px solid lightblue;margin-left:9px;'>");

                    #region - TP Deatils
                    strTb.Append("<div class='col-lg-12' style='font-weight:bold;font-size:15px;text-align:left;'>TP Details</div>");
                    //Tp Header Details
                    if (lstTPDetails[0].lstTPHeader != null && lstTPDetails[0].lstTPHeader.Count > 0)
                    {
                        dcrType = "";
                        string enteredDate = ((!string.IsNullOrEmpty(lstTPDetails[0].lstTPHeader[0].Entered_Date)) ? lstTPDetails[0].lstTPHeader[0].Entered_Date : "-");
                        string enteredBy = ((!string.IsNullOrEmpty(lstTPDetails[0].lstTPHeader[0].Entered_by)) ? lstTPDetails[0].lstTPHeader[0].Entered_by : "-");
                        string remarks = ((!string.IsNullOrEmpty(lstTPDetails[0].lstTPHeader[0].Remarks)) ? lstTPDetails[0].lstTPHeader[0].Remarks : "-");
                        string approvedBy = ((!string.IsNullOrEmpty(lstTPDetails[0].lstTPHeader[0].Tp_Approved_By)) ? lstTPDetails[0].lstTPHeader[0].Tp_Approved_By : "-");

                        dcrType = lstTPDetails[0].lstTPHeader[0].Project_Code;
                        if (dcrType == "FIELD" || dcrType == "FIELD_RCPA")
                        {
                            dcrType = "Field";
                        }
                        else if (dcrType == "LEAVE")
                        {
                            dcrType = "Leave";
                        }
                        else
                        {
                            dcrType = "Attendance";
                        }

                        strTb.Append("<div class='col-lg-12'>");
                        strTb.Append("<div class='col-lg-3' style='font-weight:bold;'>Tp Date:</div><div class='col-lg-9'>" + lstTPDetails[0].lstTPHeader[0].TP_Date + "</div>");
                        strTb.Append("<div class='col-lg-3' style='font-weight:bold;'>Call Objective:</div><div class='col-lg-9'>" + dcrType + "</div>");
                        strTb.Append("<div class='col-lg-3' style='font-weight:bold;'>Entered Date</div><div class='col-lg-9'>" + enteredDate + "</div>");
                        strTb.Append("<div class='col-lg-3' style='font-weight:bold;'>Entered By</div><div class='col-lg-9'>" + enteredBy + "</div>");
                        strTb.Append("<div class='col-lg-3' style='font-weight:bold;'>Remarks</div><div class='col-lg-9'>" + remarks + "</div>");
                        strTb.Append("<div class='col-lg-3' style='font-weight:bold;'>Status</div><div class='col-lg-9'>Approved</div>");

                        var lstLeaveType = lstTPDetails[0].lstTpActivities.Where(s => s.Tp_Id == tpId).ToList();
                        leaveTypeName = "";
                        if (lstLeaveType != null && lstLeaveType.Count > 0)
                        {
                            leaveTypeName = ((!string.IsNullOrEmpty(lstLeaveType[0].Activity_Name)) ? lstLeaveType[0].Activity_Name : "-");
                        }

                        if (dcrType == "Leave")
                        {
                            strTb.Append("<div class='col-lg-3'; style='font-weight:bold;'>Leave Type Name</div><div class='col-lg-9'>" + leaveTypeName + "</div>");
                            // strTb.Append("</div>");
                        }
                        else
                        {
                            string cpName = ((!string.IsNullOrEmpty(lstTPDetails[0].lstTPHeader[0].CP_name)) ? lstTPDetails[0].lstTPHeader[0].CP_name : "-");
                            string workArea = ((!string.IsNullOrEmpty(lstTPDetails[0].lstTPHeader[0].Work_Area)) ? lstTPDetails[0].lstTPHeader[0].Work_Area : "-");
                            string category = ((!string.IsNullOrEmpty(lstTPDetails[0].lstTPHeader[0].Category)) ? lstTPDetails[0].lstTPHeader[0].Category : "-");
                            if (dcrType == "Field")
                            {
                                accName = "-";
                                string meetingPoint = ((!string.IsNullOrEmpty(lstTPDetails[0].lstTPHeader[0].Meeting_Point)) ? lstTPDetails[0].lstTPHeader[0].Meeting_Point : "-");
                                string meetingTime = ((!string.IsNullOrEmpty(lstTPDetails[0].lstTPHeader[0].Meeting_Time)) ? lstTPDetails[0].lstTPHeader[0].Meeting_Time : "-");
                                if (!string.IsNullOrEmpty(lstTPDetails[0].lstTPHeader[0].ACC1))
                                {
                                    accName += lstTPDetails[0].lstTPHeader[0].ACC1 + ',';
                                }
                                if (!string.IsNullOrEmpty(lstTPDetails[0].lstTPHeader[0].ACC2))
                                {
                                    accName += lstTPDetails[0].lstTPHeader[0].ACC2 + ',';
                                }
                                if (!string.IsNullOrEmpty(lstTPDetails[0].lstTPHeader[0].ACC3))
                                {
                                    accName += lstTPDetails[0].lstTPHeader[0].ACC3 + ',';
                                }
                                if (!string.IsNullOrEmpty(lstTPDetails[0].lstTPHeader[0].ACC4))
                                {
                                    accName += lstTPDetails[0].lstTPHeader[0].ACC4 + ',';
                                }
                                if (!string.IsNullOrEmpty(accName))
                                {
                                    accName = accName.TrimEnd(',');
                                }

                                strTb.Append("<div class='col-lg-3' style='font-weight:bold;'>Accompanist Name</div><div class='col-lg-9'>" + accName + "</div>");
                                strTb.Append("<div class='col-lg-3' style='font-weight:bold'>Meeting Point:</div><div class='col-lg-9'>" + meetingPoint + "</div>");
                                strTb.Append("<div class='col-lg-3' style='font-weight:bold'>Meeting Time:</div><div class='col-lg-9'>" + meetingTime + "</div>");
                                strTb.Append("<div class='col-lg-3' style='font-weight:bold'>Cp Name:</div><div class='col-lg-9'>" + cpName + "</div>");

                            }
                            else
                            {
                                strTb.Append("<div class='col-lg-3'; style='font-weight:bold;'>Activity Type Name</div><div class='col-lg-9'>" + leaveTypeName + "</div>");
                            }

                            strTb.Append("<div class='col-lg-3' style='font-weight:bold'>Work Area:</div><div class='col-lg-9'>" + workArea + "</div>");
                            strTb.Append("<div class='col-lg-3' style='font-weight:bold'>Category:</div><div class='col-lg-9'>" + category + "</div>");
                            strTb.Append("</div>");

                            #endregion - TP Deatils
                            strTb.Append("<br/>");
                            #region - TP SFC Details
                            //TP SFC Deatils

                            strTb.Append("<div class='col-lg-12' style='font-weight:bold;text-align:left;font-size:15px;'>TP SFC Details</div>");
                            strTb.Append("<div class='table-responsive'>");
                            strTb.Append("<table class='table table-striped'>");
                            strTb.Append("<thead class='active'>");
                            strTb.Append("<tr>");
                            strTb.Append("<th>From Place</th>");
                            strTb.Append("<th>To Place</th>");
                            strTb.Append("<th>Travel Mode</th>");
                            strTb.Append("<th>SFC Category Name</th>");
                            strTb.Append("</tr></thead>");
                            strTb.Append("<tbody>");
                            if (lstTPDetails[0].lstTPSFC != null && lstTPDetails[0].lstTPSFC.Count > 0)
                            {
                                foreach (var sfc in lstTPDetails[0].lstTPSFC)
                                {
                                    strTb.Append("<tr>");
                                    strTb.Append("<td>");
                                    strTb.Append(sfc.From_Place);
                                    strTb.Append("</td>");
                                    strTb.Append("<td>");
                                    strTb.Append(sfc.To_Place);
                                    strTb.Append("</td>");
                                    strTb.Append("<td>");
                                    strTb.Append(sfc.Travel_Mode);
                                    strTb.Append("</td>");
                                    strTb.Append("<td>");
                                    strTb.Append(sfc.SFC_Category_Name);
                                    strTb.Append("</td>");
                                    strTb.Append("</tr>");
                                }
                            }
                            else
                            {
                                strTb.Append("<tr><td colspan='4'>No SFC Deatils found.</td></tr>");
                            }
                            strTb.Append("</tbody></table>");
                            strTb.Append("</div>");
                            #endregion - TP SFC Details
                            strTb.Append("<br/>");
                            #region - TP doctors
                            if (dcrType == "Field")
                            {

                                //TP Doctor Details
                                strTb.Append("<div class='col-lg-12' style='font-weight:bold;text-align:left;font-size:15px;'>TP Doctor Details</div>");
                                strTb.Append("<div class='table-responsive'>");
                                strTb.Append("<table class='table table-striped'>");
                                strTb.Append("<thead class='active'>");
                                strTb.Append("<tr>");
                                strTb.Append("<th>Doctor Name</th>");
                                strTb.Append("<th>MDL Number</th>");
                                strTb.Append("<th>Region Name</th>");
                                strTb.Append("<th>Specialty Name</th>");
                                strTb.Append("<th>Category Name</th>");
                                strTb.Append("</tr>");
                                strTb.Append("</thead>");
                                strTb.Append("<tbody>");
                                if (lstTPDetails[0].lstTpDoctors != null && lstTPDetails[0].lstTpDoctors.Count > 0)
                                {
                                    foreach (var doctor in lstTPDetails[0].lstTpDoctors)
                                    {
                                        var mdlNumber = ((!string.IsNullOrEmpty(doctor.MDL_Number)) ? doctor.MDL_Number : "");
                                        var specialityName = ((!string.IsNullOrEmpty(doctor.Speciality_Name)) ? doctor.Speciality_Name : "");
                                        var categoryName = ((!string.IsNullOrEmpty(doctor.Category_Name)) ? doctor.Category_Name : "-");

                                        strTb.Append("<tr>");
                                        strTb.Append("<td>");
                                        strTb.Append(doctor.Customer_Name);
                                        strTb.Append("</td>");
                                        strTb.Append("<td>");
                                        strTb.Append(mdlNumber);
                                        strTb.Append("</td>");
                                        strTb.Append("<td>");
                                        strTb.Append(doctor.Region_Name);
                                        strTb.Append("</td>");
                                        strTb.Append("<td>");
                                        strTb.Append(specialityName);
                                        strTb.Append("</td>");
                                        strTb.Append("<td>");
                                        strTb.Append(categoryName);
                                        strTb.Append("</td>");
                                        strTb.Append("</tr>");
                                    }
                                }
                                else
                                {
                                    strTb.Append("<tr><td colspan='5'>No Doctor Details found.</td></tr>");
                                }
                                strTb.Append("</tbody>");
                                strTb.Append("</table>");
                                strTb.Append("</div>");
                            }
                            #endregion - TP doctors
                        }
                    }

                    strTb.Append("</div>");
                }
                return strTb.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("tpId", tpId.ToString());
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return "FAIL^" + ex.Message;
            }

        }

        #endregion DCR-Approval


        #region Dcr Freeze Release

        public ActionResult DCRFreezeReleaseApproval(string UserCode)
        {

            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            ViewBag.UserCode = _objCurrentInfo.GetUserCode();
            return View();
        }

        public JsonResult GetDcrFreezeReleaseUsers(DCRFreezeInputs objInputs)
        {
            BLApproval _objBLApproval = new BLApproval();
            objInputs.User_Code = _objCurr.GetUserCode();
            objInputs.Company_Code = _objCurr.GetCompanyCode();
            return Json(_objBLApproval.GetDcrFreezeReleaseUsers(objInputs), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDcrFreezeReleaseApproval(DCRFreezeInputs objInputs)
        {
            BLApproval _objBLApproval = new BLApproval();
            return Json(_objBLApproval.GetDcrFreezeReleaseApproval(objInputs), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetDcrFreezeReleasedApprovalData(DCRFreezeInputs objInputs)
        {
            BLApproval _objBLApproval = new BLApproval();
            return Json(_objBLApproval.GetDcrFreezeReleasedApprovalData(objInputs), JsonRequestBehavior.AllowGet);
        }
        public JsonResult SetDCRFreezeReleaseApproval(List<DCRUNFreezeModel> lstDCRFreezeModel)
        {
            BLApproval _objBLApproval = new BLApproval();
            return Json(_objBLApproval.SetDCRFreezeReleaseApproval(lstDCRFreezeModel), JsonRequestBehavior.AllowGet);
        }

        #endregion

        public JsonResult GetDoctorUnapproveStatus(string Customer_Code, string regionCode)
        {
            DataControl.BL_Customer _objCustomer = new DataControl.BL_Customer();
            DataSet dsDoctorDetails = new DataSet();
            List<DoctorUnapproveMC> lstMC = new List<DoctorUnapproveMC>();
            List<DoctorUnapproveCRM> lstCRM = new List<DoctorUnapproveCRM>();
            List<JsonResult> lstResult = new List<JsonResult>();

            dsDoctorDetails = _objCustomer.GetDoctorUnapproveStatus(Customer_Code, regionCode);
            if (dsDoctorDetails.Tables.Count > 0)
            {
                if (dsDoctorDetails.Tables[0].Rows.Count > 0)
                {
                    lstMC = (from item in dsDoctorDetails.Tables[0].AsEnumerable()
                             select new DoctorUnapproveMC()
                             {
                                 Doctor_Code = item["Doctor_Code"].ToString(),
                                 Doctor_Name = item["Doctor_Name"].ToString(),
                                 Campaign_Name = item["Campaign_Name"].ToString(),
                                 Campaign_Code = item["Campaign_Code"].ToString(),
                                 MDL_Number = item["MDL_Number"].ToString(),
                                 Category_Name = item["Category_Name"].ToString(),
                                 Speciality_Name = item["Speciality_Name"].ToString()
                             }).ToList<DoctorUnapproveMC>();
                }

                if (dsDoctorDetails.Tables[1].Rows.Count > 0)
                {
                    lstCRM = (from item in dsDoctorDetails.Tables[1].AsEnumerable()
                              select new DoctorUnapproveCRM()
                              {
                                  Claim_Code = item["Claim_Code"].ToString(),
                                  Doctor_Code = item["Doctor_Code"].ToString(),
                                  Doctor_Name = item["Doctor_Name"].ToString(),
                                  Request_Entity = item["Request_Entity"].ToString(),
                                  MDL_Number = item["MDL_Number"].ToString(),
                                  Category_Name = item["Category_Name"].ToString(),
                                  Speciality_Name = item["Speciality_Name"].ToString()
                              }).ToList<DoctorUnapproveCRM>();
                }
            }
            lstResult = new List<JsonResult> {  Json(lstMC,JsonRequestBehavior.AllowGet),
                                                Json(lstCRM,JsonRequestBehavior.AllowGet),};

            return Json(lstResult, JsonRequestBehavior.AllowGet);
        }



        /**************************************************Secondary Sales Approval Screen Methods*************************************/
        public JsonResult GetRegionsWithUserDetails(string regionCode, int month, int year, int status, string regionSelection, string customerType)
        {
            string companyCode = null;
            List<GetSSRegion> lstRegion = null;
            try
            {
                BLApproval objApp = new BLApproval();
                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                companyCode = objCurInfo.GetCompanyCode();
                lstRegion = objApp.GetRegionsWithUserDetails(companyCode, regionCode, month, year, status, regionSelection, customerType);
            }
            catch (Exception ex)
            {
                throw;
            }
            return Json(lstRegion, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetTotalSSDetailsForMonth(string regionCode, int month, int year, int status, int Mode, string selectionOrLoad)
        {
            string companyCode = null;
            List<TotalSSDetails> lstSSDetails = null;
            try
            {
                BLApproval objApp = new BLApproval();
                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                companyCode = objCurInfo.GetCompanyCode();
                lstSSDetails = objApp.GetTotalSSDetailsForMonth(companyCode, regionCode, month, year, status, Mode, selectionOrLoad);
            }
            catch (Exception ex)
            {
                throw;
            }
            return Json(lstSSDetails, JsonRequestBehavior.AllowGet);


        }
        public JsonResult GetSSDetailsView(string regionCode, int month, int year, int status, int Mode, string selectionOrLoad)
        {
            string companyCode = null;
            List<SecondarySalesDetailsView> lstSSDetailsView = null;
            try
            {
                BLApproval objApp = new BLApproval();
                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                companyCode = objCurInfo.GetCompanyCode();
                lstSSDetailsView = objApp.GetSSDetailsView(companyCode, regionCode, month, year, status, Mode, selectionOrLoad);

            }
            catch (Exception ex)
            {

                throw;
            }
            return Json(lstSSDetailsView, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// To the users in a region.
        /// </summary>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        //public JsonResult GetUserinaRegion(string regionCode)
        //{
        //    string companyCode = null;
        //    List<GetSSRegion> lstUsersinaRegion = null;
        //    try
        //    {
        //        BLApproval objApp = new BLApproval();
        //        DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
        //        companyCode = objCurInfo.GetCompanyCode();
        //        lstUsersinaRegion = objApp.GetUserinaRegion(companyCode, regionCode);

        //    }
        //    catch (Exception ex)
        //    {
        //        throw;
        //    }
        //    return Json(lstUsersinaRegion, JsonRequestBehavior.AllowGet);
        //}


        /// <summary>
        /// 
        /// </summary>
        /// <param name="regionCode"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        public JsonResult GetSSDetailsForAMonth(string regionCode, int month, int year, int status, string Currentregcode)
        {
            string companyCode = null;
            List<SecondarySalesApprovalHeaderModel> lstSSHeader = null;
            try
            {
                BLApproval objApp = new BLApproval();
                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                companyCode = objCurInfo.GetCompanyCode();
                lstSSHeader = objApp.GetSSDetailsForAMonth(companyCode, regionCode, month, year, status, Currentregcode);

            }
            catch (Exception ex)
            {

                throw;
            }
            return Json(lstSSHeader, JsonRequestBehavior.AllowGet);
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="details"></param>
        /// <param name="status"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <param name="currentStatus"></param>
        /// <returns></returns>
        public bool UpdateSecondarySalesStatus(List<SSMainModelforEdit> lstApprvDet, int status)
        {
            BLApproval objApp = new BLApproval();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string companyCode = objCurInfo.GetCompanyCode();
            string updatedBy = objCurInfo.GetUserCode();
            bool result = objApp.UpdateSecondarySalesStatus(companyCode, lstApprvDet, status, updatedBy);
            return result;

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="regionCode"></param>
        /// <param name="ssCode"></param>
        /// <returns></returns>
        public JsonResult GetSSRemarksHistory(string regionCode, string ssCode)
        {
            string companyCode = null;
            List<SSRemarksModel> lstSSRemarks = null;
            try
            {
                BLApproval objApp = new BLApproval();
                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                companyCode = objCurInfo.GetCompanyCode();
                lstSSRemarks = objApp.GetSSRemarksHistory(companyCode, regionCode, ssCode);
                return Json(lstSSRemarks, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {

                throw;
            }
        }
        public bool SingleApproveorUnapprove(string regionCode, string status, string ssCode, string baseCode, string remarks)
        {
            string companyCode = null;
            string updatedBy = null;
            bool result = false;

            try
            {
                BLApproval objApp = new BLApproval();
                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                companyCode = objCurInfo.GetCompanyCode();
                updatedBy = objCurInfo.GetUserCode();
                result = objApp.SingleApproveorUnapprove(companyCode, regionCode, status, ssCode, baseCode, updatedBy, remarks);

            }
            catch (Exception ex)
            {

                throw;
            }
            return result;
        }

        public bool UpdateSSStatusFromUnApproval(string regionCode, string ssCode)
        {
            BLApproval objApp = new BLApproval();
            return objApp.UpdateSSStatusFromUnApproval(regionCode, ssCode);
        }
        /***********************************************************************************************************************/
        public JsonResult EmployeeDetails(string user_Code)
        {


            List<UserModel> lstEmployee = new List<UserModel>();
            DataControl.BL_Customer _objCustomer = new DataControl.BL_Customer();
            DataControl.CurrentInfo objCurInfo = new CurrentInfo();
            //   string company_code = objCurInfo.GetCompanyCode();
            lstEmployee = _objCustomer.EmployeeDetails(objCurInfo.GetCompanyCode(), user_Code).ToList();
            return Json(lstEmployee, JsonRequestBehavior.AllowGet);

        }

        public string GetLeavePrivilege(string userCode)
        {
            string result = string.Empty;
            _objBLApproval = new BLApproval();
            DataControl.CurrentInfo objCurInfo = new CurrentInfo();
            string companyCode = objCurInfo.GetCompanyCode();
            try
            {
                result = _objBLApproval.GetLeavePrivilege(companyCode, userCode);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        public JsonResult GetLockDetails(string userCode)
        {
            _objBLApproval = new BLApproval();
            DataControl.CurrentInfo objCurInfo = new CurrentInfo();
            string companyCode = objCurInfo.GetCompanyCode();
            return Json(_objBLApproval.GetLockDetails(companyCode, userCode), JsonRequestBehavior.AllowGet);
        }
    }
}

