using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;
using System.Data;
using DataControl;
using MVCModels;
using System.IO;
using DataControl.Abstraction;
using DataControl.Impl;
using System.Xml;
using System.Xml.Xsl;
using Excel;
using System.Text.RegularExpressions;
using System.Collections;
using DataControl.HD_MasterFactoryClasses;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class LeaveTypeController : Controller
    {
        #region Private Methods
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        private SPData _objSPData = new SPData();
        DataControl.Data _objData = new DataControl.Data();

        //Excel Download
        private IFileProvider fileProvider = new FileSystemProvider();
        private IExcelFactory _objExcelConverter = null;
        private StringBuilder _fileNameString = new StringBuilder();
        const string DOWNLOAD_PATH_KEY_NAME = "ExcelDownloadPath";
        private const string FILE_UPLOAD_PATH = "ExcelUploadPath";
        private string _LeaveBalanceExcel = string.Empty;
        private int j;
        private void CreateFileName(string Leave_Type_Name, string Employee_Details)
        {
            #region File Name Generated
            _fileNameString.Append(_objcurrentInfo.GetSubDomain() + "_");
            _fileNameString.Append(_objcurrentInfo.GetUserName() + "_");
            if (string.IsNullOrEmpty(Employee_Details))
            {
                _fileNameString.Append("Leave Type Name");
            }
            else
            {
                _fileNameString.Append("Employee Details");
            }
            _fileNameString.Append("_");
            _fileNameString.Append(DateTime.Now.ToString("dd-MM-yyyy"));
            _fileNameString.Append("_");
            _fileNameString.Append((DateTime.Now.ToString("HH-mm-ss-ffffff")));
            _fileNameString.Append(".xls");
            #endregion File Name Generated
        }
        #endregion Private Methods
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Create()
        {
            ViewBag.isPayrollUser = _objcurrentInfo.GetPayRollIntegratedStatus();
            return View();
        }

        /// <summary>
        /// Insert and Update
        /// </summary>
        /// <param name="LeaveTypeName"></param>
        /// <param name="Iscompoff"></param>
        /// <param name="Mode"></param>
        /// <param name="LveLeaveTypeCode"></param>
        /// <returns></returns>
        public int InsertLeaveType(string LeaveTypeName, string Mode, string LveLeaveTypeCode, string payrollleavetypeCode, string IsLop)
        {
            string CompanyCode = _objcurrentInfo.GetCompanyCode();
            try
            {
                BLLeave Leave = new BLLeave();

                string modemodel = Mode.ToUpper();

                if (modemodel == "I")
                {
                    string LeaveTypecode = _objData.GetMaxCode(CompanyCode, "tbl_SFA_Leave_Type_Master", "Leave_Type_Code", "LTC");
                    string status = "0";
                    int InsertLeavetype = Leave.InsertLeaveType(CompanyCode, LeaveTypecode, LeaveTypeName, status, _objcurrentInfo.GetUserName(), DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff"), payrollleavetypeCode, IsLop);
                    return InsertLeavetype;
                }
                else
                {
                    int UpdateLeaveType = Leave.UpdateLeaveType(CompanyCode, LveLeaveTypeCode, LeaveTypeName, _objcurrentInfo.GetUserName(), DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff"), payrollleavetypeCode, IsLop);
                    return UpdateLeaveType;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:LeaveTypeName", LeaveTypeName);
                dicContext.Add("Filter:Mode", Mode);
                dicContext.Add("Filter:LeaveTypeCode", LveLeaveTypeCode);
                dicContext.Add("Filter:CompanyCode", CompanyCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return 0;
            }
        }

        /// <summary>
        /// Bind LeaveType with Html table
        /// </summary>
        /// <returns></returns>
        public string GetLeaveTypeMaster()
        {
            string companycode = _objcurrentInfo.GetCompanyCode();
            try
            {
                BLLeave Leave = new BLLeave();
                DataSet dsLeaveType = new DataSet();
                dsLeaveType = Leave.GetLeaveTypeDetails(companycode);
                bool isPayrollUser = false;
                isPayrollUser = _objcurrentInfo.GetPayRollIntegratedStatus();

                StringBuilder sb = new StringBuilder();
                sb.Append("<table WIDTH='75%' id='tblsummary' class='table table-striped' >");
                sb.Append("<thead class='active'>");
                sb.Append("<tr style='background-color:#428bca;'>");
                sb.Append("<td>Edit</td>");
                sb.Append("<td>Change Status</td>");
                sb.Append("<td>Leave Type Name</td>");
                sb.Append("<td>Status</td>");
                sb.Append("<td>Is LOP</td>");
                if (isPayrollUser)
                {
                    sb.Append("<td>Payroll Leave Type Code</td>");
                }
                sb.Append("</tr>");
                sb.Append("</thead>");
                sb.Append("<tbody>");

                if (dsLeaveType != null && dsLeaveType.Tables[0] != null && dsLeaveType.Tables[0].Rows.Count > 0)
                {
                    for (int i = 0; i < dsLeaveType.Tables[0].Rows.Count; i++)
                    {
                        sb.Append("<tr><td class='td-a'><a id='E" + i + "' onclick='fnEditLeaveType(this)'>Edit</a></td>");
                        sb.Append("<td class='td-a'><a id='C" + i + "' onclick='fnchangeStatus(this)'>Change Status</a></td>");
                        sb.Append("<td style='display:none' id='Leave_Type_Code" + i + "'>" + dsLeaveType.Tables[0].Rows[i]["Leave_Type_Code"] + "</td>");
                        sb.Append("<td id='Leave_Type_Name" + i + "'>" + dsLeaveType.Tables[0].Rows[i]["Leave_Type_Name"] + "</td>");
                        sb.Append("<td id='Leave_Type_Status" + i + "'>" + dsLeaveType.Tables[0].Rows[i]["Leave_Type_Status"] + "</td>");
                        sb.Append("<td id='Is_LOP" + i + "'>" + dsLeaveType.Tables[0].Rows[i]["Is_LOP"] + "</td>");
                        if (isPayrollUser)
                        {
                            sb.Append("<td id='Payroll_Leave_Type_Code" + i + "' prlc='" + dsLeaveType.Tables[0].Rows[i]["Payroll_Leave_Type_Code"].ToString().ToUpper() + "'>" + dsLeaveType.Tables[0].Rows[i]["Payroll_Leave_Type_Code"] + "</td>");
                        }
                        sb.Append("</tr>");
                    }
                }
                else
                {
                    sb.Append("<tr><td>No records To Display</td></tr>");
                }
                sb.Append("</tbody>");
                sb.Append("</table>");
                return sb.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:companycode", companycode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return ex.Message.ToString();
            }
        }

        /// <summary>
        /// DownLoad The LeaveTypeMasterDetails into Excel
        /// </summary>
        /// <returns></returns>
        public void PutLeaveTypeMasterIntoExcel()
        {
            string companycode = _objcurrentInfo.GetCompanyCode();
            string error = string.Empty;
            try
            {
                BLLeave Leave = new BLLeave();
                DataSet dsLeaveType = new DataSet();
                DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();
                DataControl.Abstraction.IFileProvider objProvider = new DataControl.Impl.FileSystemProvider();
                dsLeaveType = Leave.GetLeaveTypeDetails(companycode);
                bool isPayrollUser = false;
                isPayrollUser = _objcurrentInfo.GetPayRollIntegratedStatus();

                StringBuilder sb = new StringBuilder();
                sb.Append("<table WIDTH='75%' id='tblsummary' class='table table-striped' >");
                sb.Append("<thead class='active'>");
                sb.Append("<tr style='background-color:#428bca;'>");
                sb.Append("<td>Leave Type Name</td>");
                sb.Append("<td>Status</td>");
                sb.Append("<td>Is LOP</td>");
                if (isPayrollUser)
                {
                    sb.Append("<td>Payroll Leave Type Code</td>");
                }
                sb.Append("</tr>");
                sb.Append("</thead>");
                sb.Append("<tbody>");

                if (dsLeaveType != null && dsLeaveType.Tables[0] != null && dsLeaveType.Tables[0].Rows.Count > 0)
                {
                    for (int i = 0; i < dsLeaveType.Tables[0].Rows.Count; i++)
                    {
                        sb.Append("<tr>");
                        sb.Append("<td >" + dsLeaveType.Tables[0].Rows[i]["Leave_Type_Name"] + "</td>");
                        sb.Append("<td >" + dsLeaveType.Tables[0].Rows[i]["Leave_Type_Status"] + "</td>");
                        sb.Append("<td >" + dsLeaveType.Tables[0].Rows[i]["Is_LOP"] + "</td>");
                        if (isPayrollUser)
                        {
                            sb.Append("<td >" + dsLeaveType.Tables[0].Rows[i]["Payroll_Leave_Type_Code"] + "</td>");
                        }
                        sb.Append("</tr>");
                    }
                }
                else
                {
                    sb.Append("<tr><td>No records To Display</td></tr>");
                }
                sb.Append("</tbody>");
                sb.Append("</table>");

                DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");

                string userName = _objcurrentInfo.GetUserName();
                string subdomainName = System.Web.HttpContext.Current.Request.Url.DnsSafeHost; ;

                string fileName = "LeaveTypeMaster" + " - " + subdomainName + " - " + userName + ".xls";
                string blobUrl = objAzureBlob.AzureBlobUploadText(sb.ToString(), accKey, fileName, "bulkdatasvc");

                objFileDownload.DownloadFile(blobUrl, fileName, out error);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
            }
        }
        //Changestatus
        public bool ChangestatusforLeaveType(string status, string LeaveTypeCode)
        {
            string DocStatus = string.Empty;
            bool changeResult = false;
            try
            {
                string companycode = _objcurrentInfo.GetCompanyCode();
                DocStatus = status.ToUpper() == "ENABLED" ? "0" : "1"; // 0 is Enabled, 1 is Disabled
                BLLeave Leave = new BLLeave();
                Leave.ChangeStatus(companycode, LeaveTypeCode, DocStatus);
                changeResult = true;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:status", status);
                dicContext.Add("Filter:LeaveTypeCode", LeaveTypeCode);
                changeResult = false;
            }
            return changeResult;
        }

        #region user leave type mapping start
        public ActionResult UserLeaveTypeMapping()
        {
            return View();
        }
        /// <summary>
        /// Get active User Types
        /// </summary>
        /// <returns>returns the active user type</returns>
        public string GetUserTypes()
        {
            StringBuilder strContent = new StringBuilder();
            try
            {
                DataControl.CurrentInfo objCurInfo = new CurrentInfo();
                DataControl.BLUser objUser = new BLUser();
                List<MVCModels.HiDoctor_Master.UserTypeModel> lstUserType = new List<MVCModels.HiDoctor_Master.UserTypeModel>();
                lstUserType = objUser.GetUserTypes(objCurInfo.GetCompanyCode());
                strContent.Append("<option value=''>-Select User Type-</option>");
                if (lstUserType.Count > 0)
                {
                    foreach (var dr in lstUserType)
                    {
                        if (dr.User_Type_Status == "1")
                        {
                            strContent.Append("<option value='" + dr.User_Type_Code + "'>" + dr.User_Type_Name + "</option>");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return strContent.ToString();
        }
        /// <summary>
        /// Get Active leave types
        /// </summary>
        /// <returns>returns the active leave types</returns>
        public string GetLeaveTypes()
        {
            StringBuilder strContent = new StringBuilder();
            StringBuilder strCheckBox = new StringBuilder();
            try
            {
                DataControl.CurrentInfo objCurInfo = new CurrentInfo();
                DataControl.BLLeave objLeave = new BLLeave();
                IEnumerable<MVCModels.LeaveTypeModel> lstLeaveType = null;
                lstLeaveType = objLeave.GetActiveLeaveType(objCurInfo.GetCompanyCode());
                strContent.Append("<option value=''>-Select Leave Type-</option>");
                if (lstLeaveType != null)
                {
                    foreach (var dr in lstLeaveType)
                    {
                        strContent.Append("<option value='" + dr.Leave_Type_Code + "'>" + dr.Leave_Type_Name + "</option>");
                        strCheckBox.Append("<label class='checkbox'><input type='checkbox' name='chkClub' value='" + dr.Leave_Type_Code + "'>" + dr.Leave_Type_Name + "</label>");
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return strContent.ToString() + "^" + strCheckBox.ToString();
        }
        /// <summary>
        /// Get users by user type
        /// </summary>
        /// <param name="userTypeCode"></param>
        /// <returns>returns the users by user type code</returns>
        public string GetUsersByUserType(string userTypeCode)
        {
            StringBuilder strContent = new StringBuilder();
            try
            {
                DataControl.CurrentInfo objCurInfo = new CurrentInfo();
                DataControl.BLUser objUser = new BLUser();
                IEnumerable<MVCModels.HiDoctor_Master.UserModel> lstUser = null;
                lstUser = objUser.GetUsersByUserType(objCurInfo.GetCompanyCode(), userTypeCode);
                strContent.Append("<option value=''>-Select User-</option>");
                strContent.Append("<option value='ALL'>ALL</option>");
                if (lstUser != null)
                {
                    foreach (var dr in lstUser)
                    {
                        strContent.Append("<option value='" + dr.User_Code + "'>" + dr.User_Name + "</option>");
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return strContent.ToString();
            // return Json(objUser.GetUsersByUserType(objCurInfo.GetCompanyCode(), userTypeCode));
        }
        /// <summary>
        /// Get user leave type master records
        /// </summary>
        /// <param name="userCode"></param>
        /// <returns>returns the selected user leave type details</returns>
        public string GetUserLeaveTypeMaster(string userCode)
        {

            DataControl.CurrentInfo objCurInfo = new CurrentInfo();
            DataControl.BLLeave objLeave = new BLLeave();
            IEnumerable<MVCModels.UserLeaveTypeModel> lstUserleave = null;
            StringBuilder strTblContent = new StringBuilder();
            try
            {
                lstUserleave = objLeave.GetUserLeaveType(objCurInfo.GetCompanyCode(), userCode == null ? "" : userCode);
                List<MVCModels.UserLeaveTypeModel> lstUserType = new List<MVCModels.UserLeaveTypeModel>();
                var userTypes = lstUserleave.Select(x => new { x.User_Type_Code, x.User_Type_Name }).Distinct().ToList();
                if (lstUserleave != null)
                {
                    strTblContent.Append("<table class='table table-striped'><thead><tr><th>Edit</th><th>Change Status</th><th>User Type</th><th>User</th>");
                    strTblContent.Append("<th>Leave Type</th>");
                    strTblContent.Append("<th>Min Leave</th><th>Max Leave</th>");
                    strTblContent.Append("<th>Clubbing</th><th>Weekend</th><th>Holiday</th>");
                    strTblContent.Append("<th>Validation Mode</th><th>Leave Occurence Count</th><th>Leave Max Count</th><th>Document Upload Days</th>");
                    strTblContent.Append("<th>Effective From</th><th>Effective To</th><th>Status</th></tr></thead><tbody>");

                    if (userTypes.Count > 0)
                    {
                        foreach (var dr in userTypes)
                        {
                            strTblContent.Append("<tr><th class='collapseHeader' colspan='31' onclick='fnSummaryHide(\"dv_" + dr.User_Type_Code + "\",\"spn_"
                                + dr.User_Type_Code + "\")'>");
                            strTblContent.Append("<span class='expandLeaveType' id='spn_" + dr.User_Type_Code + "' style='padding: 2px;'>"
                                + dr.User_Type_Name + "<span style='font-size: 11px; font-style: italic;cursor:pointer;'>(Click to Expand/Collapse)</span></span>");
                            strTblContent.Append("</th></tr>");
                            lstUserType = lstUserleave.AsEnumerable().Where(a => a.User_Type_Code == Convert.ToString(dr.User_Type_Code)).ToList();
                            if (lstUserType.Count > 0)
                            {
                                foreach (var leave in lstUserType)
                                {

                                    //foreach (var leave in lstUserleave)
                                    //{
                                    // strTblContent.Append("<tr>");
                                    // strTblContent.Append("<td><a onclick='fnEdit(\"" + leave.User_Leave_Type_Code + "\",\"" + leave.User_Type_Code + "\");'>Edit</a></td>");
                                    strTblContent.Append("<tr class='dv_" + dr.User_Type_Code + "'>");
                                    if (leave.User_Leave_Status == "Enabled")
                                    {
                                        strTblContent.Append("<td style='width:1%'><a onclick='fnEdit(\""
                                            + leave.User_Leave_Type_Code + "\",\"" + leave.User_Type_Code + "\");'  href='#'>Edit</a></td>");
                                    }
                                    else
                                    {
                                        strTblContent.Append("<td></td>");
                                    }
                                    strTblContent.Append("<td><a onclick='fnChangeStatus(\"" + leave.User_Leave_Type_Code + "\",\""
                                                    + leave.User_Leave_Status.ToUpper() + "\");' href='#'>Change Status</a></td>");
                                    strTblContent.Append("<td>" + leave.User_Type_Name + "</td>");
                                    strTblContent.Append("<td>" + leave.User_Name + "</td>");
                                    strTblContent.Append("<td>" + leave.Leave_Type_Name + "</td>");
                                    strTblContent.Append("<td>" + leave.Min_Leave + "</td>");
                                    strTblContent.Append("<td>" + leave.Max_Leave + "</td>");
                                    strTblContent.Append("<td>" + leave.Club_Other_Leavetype + "</td>");
                                    strTblContent.Append("<td>" + ((leave.IS_Added_Weekend_Holiday == "Y") ? "YES" : "NO") + "</td>");
                                    strTblContent.Append("<td>" + ((leave.IS_Added_Holiday == "Y") ? "YES" : "NO") + "</td>");
                                    if (leave.Validation_Mode == "0")
                                    {
                                        leave.Validation_Mode = "";
                                    }
                                    else if (leave.Validation_Mode == "1")
                                    {
                                        leave.Validation_Mode = "MONTHLY";
                                    }
                                    else if (leave.Validation_Mode == "2")
                                    {
                                        leave.Validation_Mode = "YEARLY";
                                    }
                                    strTblContent.Append("<td>" + leave.Validation_Mode + "</td>");
                                    strTblContent.Append("<td>" + leave.Leave_Occurence_Count + "</td>");
                                    strTblContent.Append("<td>" + leave.Leave_Max_Count + "</td>");
                                    strTblContent.Append("<td>" + leave.Document_Upload_Days + "</td>");
                                    strTblContent.Append("<td>" + leave.Effective_From + "</td>");
                                    strTblContent.Append("<td>" + leave.Effective_To + "</td>");
                                    strTblContent.Append("<td>" + leave.User_Leave_Status + "</td>");
                                    strTblContent.Append("</tr>");
                                }
                            }
                        }
                    }
                    strTblContent.Append("</tbody></table>");

                    JSONConverter objJson = new JSONConverter();
                    return strTblContent.ToString();
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
        }

        /// <summary>
        /// Get user leave type master records
        /// </summary>
        /// <param name="userCode"></param>
        /// <returns>returns the selected user leave type details</returns>
        public string GetUserLeaveTypeMasterExcelDownload(string userCode)
        {
            string blobUrl = string.Empty;
            DataControl.CurrentInfo objCurInfo = new CurrentInfo();
            DataControl.BLLeave objLeave = new BLLeave();
            IEnumerable<MVCModels.UserLeaveTypeModel> lstUserleave = null;
            StringBuilder strTblContent = new StringBuilder();
            try
            {
                lstUserleave = objLeave.GetUserLeaveType(objCurInfo.GetCompanyCode(), userCode == null ? "" : userCode);
                if (lstUserleave != null)
                {
                    strTblContent.Append("<table class='table table-striped'><thead><tr><th>User Type</th><th>User</th>");
                    strTblContent.Append("<th>Leave Type</th>");
                    strTblContent.Append("<th>Min Leave</th><th>Max Leave</th>");
                    strTblContent.Append("<th>Clubbing</th><th>WeekEnd</th><th>Holiday</th>");
                    strTblContent.Append("<th>Validation Mode</th><th>Leave Occurence Count</th><th>Leave Max Count</th><th>Document Upload Days</th>");
                    strTblContent.Append("<th>Effective From</th><th>Effective To</th><th>Status</th></tr></thead><tbody>");
                    foreach (var leave in lstUserleave)
                    {
                        strTblContent.Append("<tr>");
                        strTblContent.Append("<td>" + leave.User_Type_Name + "</td>");
                        strTblContent.Append("<td>" + leave.User_Name + "</td>");
                        strTblContent.Append("<td>" + leave.Leave_Type_Name + "</td>");
                        strTblContent.Append("<td>" + leave.Min_Leave + "</td>");
                        strTblContent.Append("<td>" + leave.Max_Leave + "</td>");
                        strTblContent.Append("<td>" + leave.Club_Other_Leavetype + "</td>");
                        strTblContent.Append("<td>" + ((leave.IS_Added_Weekend_Holiday == "Y") ? "YES" : "NO") + "</td>");
                        strTblContent.Append("<td>" + ((leave.IS_Added_Holiday == "Y") ? "YES" : "NO") + "</td>");
                        if (leave.Validation_Mode == "0")
                        {
                            leave.Validation_Mode = "";
                        }
                        else if (leave.Validation_Mode == "1")
                        {
                            leave.Validation_Mode = "MONTHLY";
                        }
                        else if (leave.Validation_Mode == "2")
                        {
                            leave.Validation_Mode = "YEARLY";
                        }
                        strTblContent.Append("<td>" + leave.Validation_Mode + "</td>");
                        strTblContent.Append("<td>" + leave.Leave_Occurence_Count + "</td>");
                        strTblContent.Append("<td>" + leave.Leave_Max_Count + "</td>");
                        strTblContent.Append("<td>" + leave.Document_Upload_Days + "</td>");
                        strTblContent.Append("<td>" + leave.Effective_From + "</td>");
                        strTblContent.Append("<td>" + leave.Effective_To + "</td>");
                        strTblContent.Append("<td>" + leave.User_Leave_Status + "</td>");
                        strTblContent.Append("</tr>");
                    }
                    strTblContent.Append("</tbody></table>");
                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                    string userName = objCurInfo.GetUserName();
                    string compCode = objCurInfo.GetCompanyCode();
                    string fileName = "UserLeaveType_" + "_" + compCode + "_" + userName + ".xls";
                    blobUrl = objAzureBlob.AzureBlobUploadText(strTblContent.ToString(), accKey, fileName, "bulkdatasvc");
                    return blobUrl;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
        }


        /// <summary>
        /// Insert or update user leave type master
        /// </summary>
        /// <param name="userTypeCode"></param>
        /// <param name="user"></param>
        /// <param name="leaveType"></param>       
        /// <param name="minLeave"></param>
        /// <param name="maxLeave"></param>
        /// <param name="clibbing"></param>
        /// <param name="includeWeekEnd"></param>        
        /// <param name="effectiveFrom"></param>
        /// <param name="effectiveTo"></param>       
        /// <param name="mode"></param>
        /// <param name="userLeaveTypeCode"></param>
        /// <returns>returns the no of rows affected</returns>
        public int InsertUserLeaveTypeMaster(string userTypeCode, string user, string leaveType, string minLeave, string maxLeave,
            string clubbing,int leaveeligible,string leaveconfirmation,string leaveoncompletion,int noofdays,int applicdays, string includeWeekEnd, string includeHoliday, string effectiveFrom, string effectiveTo, string mode,
            string userLeaveTypeCode, string selectedUserName, string selectedUserTypeName, string leaveTypeName, string validation_Mode,
            string leave_Occurrence_Count, string leave_Max_Count, string Document_Upload, string consecutvie_Leave_Allowed)
        {

            string result = string.Empty;
            bool isContinue = true;
            int rowsAffected = 0;
            BLLeave objBlLeave = new BLLeave();
            CurrentInfo objCurInfo = new CurrentInfo();
            SPData objSPData = new SPData();

            List<MVCModels.UserLeaveTypeModel> lstUserLeaveType = new List<MVCModels.UserLeaveTypeModel>();
            List<MVCModels.LeaveTypeClubbing> lstLeaveClubbing = new List<MVCModels.LeaveTypeClubbing>();
            List<MVCModels.UserLeaveTypeModel> IlstUserLeave = new List<MVCModels.UserLeaveTypeModel>();

            IlstUserLeave = new List<UserLeaveTypeModel>(objBlLeave.CheckUserLeaveTypeMapping(objCurInfo.GetCompanyCode(), user, userTypeCode, leaveType, effectiveFrom, effectiveTo));
            if ("INSERT" == mode)
            {
                if (IlstUserLeave.Count > 0)
                {
                    result = "ERROR: " + leaveTypeName + " leave type is already mapped to " + selectedUserTypeName + "user type  and " + selectedUserName + " user";
                    isContinue = false;
                }
            }
            else
            {
                if (IlstUserLeave.Count > 0)
                {
                    if (IlstUserLeave[0].User_Leave_Type_Code != userLeaveTypeCode)
                    {

                        result = "ERROR: " + leaveTypeName + " leave type is already mapped to " + selectedUserTypeName
                                + "user type  and " + selectedUserName + " user";
                        isContinue = false;
                    }
                }
            }

            if (isContinue)
            {
                MVCModels.UserLeaveTypeModel objLeaveType = new MVCModels.UserLeaveTypeModel();
                var Company_Code = objCurInfo.GetCompanyCode();
                var Effective_From = effectiveFrom;
                var Effective_To = effectiveTo;
                var IS_Added_Weekend_Holiday = includeWeekEnd;
                var IS_Added_Holiday = includeHoliday;
                var Leave_Type_Code = leaveType;
                var Min_Leave = "";
                if (minLeave == "")
                {
                    Min_Leave = "0";
                }
                else
                {
                    Min_Leave = minLeave;
                }
                var Max_Leave = "";
                if (maxLeave == "")
                {
                    Max_Leave = "0";
                }
                else
                {
                    Max_Leave = maxLeave;
                }
                var User_Code = user;
                var User_Type_Code = userTypeCode;
                var Created_By = "";
                var Created_Date = "";
                var User_Leave_Status = "";
                var Updated_By = "";
                var Updated_Date = "";
                var User_Leave_Type_Code = "";
                if ("INSERT" == mode)
                {
                    Created_By = objCurInfo.GetUserName();
                    Created_Date = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");

                    userLeaveTypeCode = Convert.ToString(objSPData.GetSeqNumber("SEQ_tbl_SFA_User_Leave_Type_Master"));
                    User_Leave_Type_Code = userLeaveTypeCode;
                    User_Leave_Status = "0";
                }
                else
                {
                    Updated_By = objCurInfo.GetUserName();
                    Updated_Date = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                    User_Leave_Type_Code = userLeaveTypeCode;
                }

                rowsAffected = objBlLeave.InsertUserLeaveTypeMaster(Company_Code, Effective_From, Effective_To, IS_Added_Weekend_Holiday,
                    IS_Added_Holiday, Leave_Type_Code, Min_Leave, Max_Leave, User_Code, User_Type_Code, Created_By, Created_Date,
                    User_Leave_Status, Updated_By, Updated_Date, User_Leave_Type_Code, clubbing,leaveeligible,leaveconfirmation,leaveoncompletion,noofdays, applicdays, validation_Mode, leave_Occurrence_Count, leave_Max_Count, Document_Upload,
                    consecutvie_Leave_Allowed, (mode == null) ? "INSERT" : mode);
            }
            return rowsAffected;
        }

        /// <summary>
        /// Delete user leave type mapping
        /// </summary>
        /// <param name="userLeaveTypeCode"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        public int DeleteUserLeaveTypeMaster(string userLeaveTypeCode, string status)
        {
            int rowsAffected = 0;
            BLLeave objBlLeave = new BLLeave();
            CurrentInfo objCurInfo = new CurrentInfo();
            return objBlLeave.DeleteUserLeaveTypeMaster(objCurInfo.GetCompanyCode(), userLeaveTypeCode, status, objCurInfo.GetUserName(),
                DateTime.Now.ToString("yyyy-MM-dd"));
        }

        public JsonResult GetSelectedUserLeaveTypeDetails(string userLeaveTypeCode)
        {
            DataControl.CurrentInfo objCurInfo = new CurrentInfo();
            DataControl.BLLeave objLeave = new BLLeave();
            IEnumerable<MVCModels.UserLeaveTypeModel> lstUserleave = null;
            lstUserleave = objLeave.GetSelectedUserLeaveType(objCurInfo.GetCompanyCode(), userLeaveTypeCode);
            DataControl.JSONConverter objJson = new JSONConverter();
            return Json(objJson.Serialize(lstUserleave), JsonRequestBehavior.AllowGet);
        }
        #endregion user leave type mapping end

        #region Leave Balance Update
        public ActionResult LeaveBalanceUpdate()
        {
            return View();
        }

        /// <summary>
        /// Download The Leave Balance Excel Template
        /// </summary>
        public void DownloadLeaveBalanceExcelTemplate()
        {
            DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();
            DataControl.Abstraction.IFileProvider objProvider = new DataControl.Impl.FileSystemProvider();
            string error = string.Empty;

            string fileName = "LeaveBalanceExcelUpload_new.xlsx";
            string blobURL = objProvider.GetConfigValue("EXCELTEMPLATES") + fileName;

            objFileDownload.DownloadFile(blobURL, fileName, out error);
        }

        /// <summary>
        /// Download the Employee Details Excel Template To Refer
        /// </summary>
        public StringBuilder DownloadEmployeeDetailsExcelTemplate()
        {
            BLMaster _objBlMaster = new BLMaster();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            try
            {
                CreateFileName("", "Employee_Details");
                string[] hiddenColumns = new string[] { };
                string[] editableColumnNames = new string[] { };
                string[] hiddenColumnNames = new string[] { };
                _objExcelConverter = new ExcelFactory();


                DataSet dsEmployeedetails = null;
                dsEmployeedetails = _objBlMaster.GetEmployeeDetails(companyCode);

                if (dsEmployeedetails.Tables[0] != null && dsEmployeedetails.Tables[0].Rows.Count > 0 && dsEmployeedetails.Tables[0].Rows != null)
                {
                    DataRowCollection dr = dsEmployeedetails.Tables[0].Rows;
                    DataColumnCollection dc = dsEmployeedetails.Tables[0].Columns;

                    _objExcelConverter.DataSetToExcel(DOWNLOAD_PATH_KEY_NAME, _fileNameString.ToString(), dsEmployeedetails, hiddenColumnNames, hiddenColumns, false, editableColumnNames);
                }
                else
                {
                    StringBuilder str = new StringBuilder("No Data Found");
                    return str;
                }
                return _fileNameString;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return _fileNameString.Append(ex.Message);
            }

        }

        /// <summary>
        /// Download the Leave Type Name Excel Template To Refer
        /// </summary>
        public StringBuilder DownloadLeaveTypeNameExcelTemplate()
        {
            BLMaster _objBlMaster = new BLMaster();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            try
            {
                CreateFileName("Leave_Type_Name", "");
                string[] hiddenColumns = new string[] { };
                string[] editableColumnNames = new string[] { };
                string[] hiddenColumnNames = new string[] { };
                _objExcelConverter = new ExcelFactory();

                DataSet dsLeaveTypeName = null;
                dsLeaveTypeName = _objBlMaster.GetLeaveTypeName(companyCode);

                if (dsLeaveTypeName.Tables[0] != null && dsLeaveTypeName.Tables[0].Rows.Count > 0 && dsLeaveTypeName.Tables[0].Rows != null)
                {
                    DataRowCollection dr = dsLeaveTypeName.Tables[0].Rows;
                    DataColumnCollection dc = dsLeaveTypeName.Tables[0].Columns;

                    _objExcelConverter.DataSetToExcel(DOWNLOAD_PATH_KEY_NAME, _fileNameString.ToString(), dsLeaveTypeName, hiddenColumnNames, hiddenColumns, false, editableColumnNames);
                }
                else
                {
                    StringBuilder str = new StringBuilder("No Data Found");
                    return str;
                }
                return _fileNameString;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return _fileNameString.Append(ex.Message);
            }
        }

        /// <summary>
        /// Upload the File and Insert
        /// </summary>
        /// <param name="fileUpload"></param>
        /// <param name="collection"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult LeaveBalanceUpdateUploadResult(HttpPostedFileBase fileUpload, FormCollection collection)
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string subDomain = _objcurrentInfo.GetSubDomain();
            BLMaster _objBLMaster = new BLMaster();
            DataTable dsLeaveType = new DataTable();

            DataControl.Repository.AzureBlobUpload objAzureUpload = new DataControl.Repository.AzureBlobUpload();
            DataControl.Abstraction.IFileProvider objPathProv = new DataControl.Impl.FileSystemProvider();
            IExcelFactory excelFactory = new ExcelFactory();

            string fileName = "LeaveTypeName_" + DateTime.Now.Ticks.ToString() + ".xlsx";
            //string fileName = "LeaveTypeName_" + _objcurrentInfo.GetUserName() + ".xls"; //fileUpload.FileName;

            string[] excelRetrieveColumns = new string[] { "*" };
            string accKey = objPathProv.GetConfigValue("UPLOADEDFILEBLOBACCKEY");

            //Upload the Excel to Azure
            string blobURL = objAzureUpload.PutAzureBlobStorage(fileUpload.InputStream, fileName, accKey, companyCode);
            //Download the Excel from Azure
            System.IO.Stream stream = objAzureUpload.AzureblockDownload(fileName, accKey, companyCode);
            //Asign the Excel into Datatable
            dsLeaveType = objAzureUpload.ConvertStreamToDataTable(stream, "User Name");
            string guid = Guid.NewGuid().ToString();
            string result = string.Empty;
            string inward_Requestform = collection["txtRequestform"].ToString();
            string inward_RequestDate = collection["txtRequestdate"].ToString();
            string inward_RequestReason = collection["txtReason"].ToString();
            string inward_UserName = collection["txtsupportUserName"].ToString();
            try
            {
                if (dsLeaveType == null || dsLeaveType.Rows.Count == 0)
                {
                    ViewBag.Result = "ERROR:NO DATA found in the uploaded excel file";
                }
                else
                {
                    dsLeaveType.Columns.Add("Company_Code", typeof(String));
                    dsLeaveType.Columns.Add("GUID", typeof(String));
                    dsLeaveType.Columns.Add("Status", typeof(String));
                    for (int i = 0; i < dsLeaveType.Rows.Count; i++)
                    {
                        dsLeaveType.Rows[i]["Company_Code"] = companyCode;
                        dsLeaveType.Rows[i]["GUID"] = guid.ToString();
                        dsLeaveType.Rows[i]["Status"] = "PROCESSING";
                    }
                    dsLeaveType.Columns["Row No"].ColumnName = "Row_No";
                    dsLeaveType.Columns["User Name"].ColumnName = "User_Name";
                    dsLeaveType.Columns["Leave Type Name"].ColumnName = "Leave_Type_Name";
                    dsLeaveType.Columns["Balance CF"].ColumnName = "Balance_CF";
                    dsLeaveType.Columns["Eligible Leave"].ColumnName = "Eligible_Leave";
                    dsLeaveType.Columns["Effective From"].ColumnName = "Effective_From";
                    dsLeaveType.Columns["Effective To"].ColumnName = "Effective_To";
                    result = _objBLMaster.ExcelBulkLeaveInsertIntoStaging(companyCode, dsLeaveType, subDomain);
                    if (result == "SUCCESS")
                    {
                        string res = string.Empty;
                        res = _objBLMaster.ExcelBulkLeaveInsertFromStagingToMaster(subDomain, companyCode, guid, fileUpload.FileName, _objcurrentInfo.GetUserCode(), inward_UserName, inward_Requestform, inward_RequestDate, inward_RequestReason, "LEAVE_BALANCE_UPLOAD");
                    }
                    else
                    {
                        result = "ERROR:Instructions are not followed." + result;
                    }
                }
                ViewBag.Result = result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return View();
            //try
            //{
            //    string scanResult = ScantheFile(dsLeaveType);

            //    if ("0" == scanResult) // If Scan Success Upload the File.
            //    {
            //        if (FileUpload(dsLeaveType, collection) > 0)
            //        {
            //            //bool mailsend = true;
            //            //string mailId = collection["txtmailid"].ToString();
            //            //string mailBody = collection["txtemailBody"].ToString();
            //            //if (mailId != "")
            //            //{
            //            //    BLMaster _objMaster = new BLMaster();
            //            //    mailsend = _objMaster.SendMail(mailId, "Employee Leave Balance Updated", mailBody);
            //            //}
            //            //if (mailsend)
            //            //{
            //            //    ViewBag.mailId = mailId;
            //            if (lstUploadFailure.Count > 0)
            //            {
            //                var reason = "";
            //                for (var i = 0; i < lstUploadFailure.Count; i++)
            //                {
            //                    reason = reason + (i + 1) + "." + " Row No : " + lstUploadFailure[i].Row_No + ", Un-upload reason : " + lstUploadFailure[i].Failure_Reason + ".";
            //                }
            //                var result = "All the rows have been uploaded except for:" + reason;
            //                ViewBag.Result = result;
            //            }
            //            else
            //            {
            //                ViewBag.Result = " Leave balance inserted successfully.";
            //            }
            //            //ViewBag.Result = " Leave balance inserted successfully.Mail send to " + mailId + " email id";
            //            //}
            //            //else
            //            //{
            //            //    ViewBag.mailId = mailId;
            //            //    ViewBag.Result = "Leave balance inserted successfully.unable to send " + mailId + "  email id";
            //            //}
            //        }
            //        else
            //        {
            //            if (lstUploadFailure.Count > 0)
            //            {
            //                var reason = "";
            //                for (var i = 0; i < lstUploadFailure.Count; i++)
            //                {
            //                    reason = reason + (i + 1) + "." + " Row No : " + lstUploadFailure[i].Row_No + ", Un-upload reason : " + lstUploadFailure[i].Failure_Reason + ".";
            //                }
            //                var result = "All the rows have been uploaded except for:" + reason;
            //                ViewBag.Result = result;
            //            }
            //            else
            //            {
            //                ViewBag.Result = "Insertion Failed";
            //            }
            //        }
            //    }
            //    else
            //    {
            //        string result = scanResult;
            //        ViewBag.Result = result;
            //    }
            //    return View();
            //}
            //catch (Exception ex)
            //{
            //    ViewBag.Result = ex.Message;
            //    return View();
            //}
        }

        /// <summary>
        /// Scan The File
        /// </summary>
        /// <param name="dsLeaveType"></param>
        /// <returns></returns>
        public string ScantheFile(DataTable dsLeaveType)
        {

            Regex regExName = new Regex("^[a-zA-Z0-9''.''_'\\s]{1,50}$");

            string RowNo = "", UserName = "", UserLeaveTypeName = "", BalanceCF = "", Lapsed = "", EligibleLeave = "";
            string result = "";
            int i = 0;
            bool blEnd = false;
            bool blFlag = true;
            Regex regNumber = new Regex("^[0-9]*[.]?[0-9]+$");
            DataView dv;
            DataRowView[] foundRows;
            ArrayList columnNameArr = new ArrayList();
            BLMaster _objMaster = new BLMaster();
            LeaveCurBalance objLeaveBalance = new LeaveCurBalance();
            List<LeaveCurBalance> lstLeavecurBalance = new List<LeaveCurBalance>();
            try
            {
                string companyCode = _objcurrentInfo.GetCompanyCode();
                DataSet dsLeaveBalanceUpdate = null;
                dsLeaveBalanceUpdate = _objMaster.GetleaveBalanceUpdate(companyCode);

                dsLeaveType.Columns.Add("Message", System.Type.GetType("System.String"));

                columnNameArr.Add("Row No");
                columnNameArr.Add("User Name");
                columnNameArr.Add("Leave Type Name");
                columnNameArr.Add("Balance CF");
                columnNameArr.Add("Lapsed");
                columnNameArr.Add("Eligible Leave");
                //columnNameArr.Add("Opening Balance");
                //columnNameArr.Add("Leave Taken");
                //columnNameArr.Add("Leave Balance");
                columnNameArr.Add("Effective From");
                columnNameArr.Add("Effective To");
                columnNameArr.Add("Message");
                string strColumnName = "";

                if (dsLeaveType.Rows.Count > 0 && dsLeaveType.Rows != null && dsLeaveType != null)
                {
                    for (int j = 0; j < dsLeaveType.Columns.Count; j++)
                    {
                        if (!columnNameArr.Contains(dsLeaveType.Columns[j].ToString()))
                        {
                            strColumnName = dsLeaveType.Columns[j].ToString();
                            blFlag = false;
                            result = strColumnName + "Column Name is not a Valid";
                            return result;
                        }
                    }
                }
                if (dsLeaveType.Rows.Count > 0)
                {

                    for (i = 0; i < dsLeaveType.Rows.Count; i++)
                    {
                        if (dsLeaveType.Rows.Count == 1 && dsLeaveType.Rows[i][0].ToString().Trim() == "*")
                        {
                            result = "No details found in the Leave Balance Update File.";
                            return result;
                        }
                        if (i == dsLeaveType.Rows.Count - 1)
                        {
                            if (dsLeaveType.Rows[i][1].ToString().Trim() != "*")
                            {
                                result = "* should be mentioned to indicate the end of the file in User Name column";
                                return result;
                            }
                        }
                    }

                    for (i = 0; i < dsLeaveType.Rows.Count; i++)
                    {
                        RowNo = dsLeaveType.Rows[i]["Row No"].ToString().Trim().Replace("'", "");
                        UserName = dsLeaveType.Rows[i]["User Name"].ToString().Trim().Replace("'", "'");
                        UserLeaveTypeName = dsLeaveType.Rows[i]["Leave Type Name"].ToString().Trim().Replace("'", "");
                        BalanceCF = dsLeaveType.Rows[i]["Balance CF"].ToString().Trim().Replace("'", "");
                        Lapsed = dsLeaveType.Rows[i]["Lapsed"].ToString().Trim().Replace("'", "");
                        EligibleLeave = dsLeaveType.Rows[i]["Eligible Leave"].ToString().Trim().Replace("'", "");
                        //OpeningBalance = dsLeaveType.Rows[i]["Opening Balance"].ToString().Trim().Replace("'", "");
                        //LeaveTaken = dsLeaveType.Rows[i]["Leave Taken"].ToString().Trim().Replace("'", "");
                        //LeaveBalance = dsLeaveType.Rows[i]["Leave Balance"].ToString().Trim().Replace("'", ""); ;

                        if (UserName == "*")
                        {
                            result = "0";
                            return result;
                        }
                        else
                        {
                            if (UserName == "")
                            {
                                blFlag = false;
                                result = UserName + " is not a valid user name. Error at row number " + (Convert.ToInt16(i + 2)).ToString();
                                return result;
                            }
                            else
                            {
                                dv = new DataView(dsLeaveBalanceUpdate.Tables[0], "", "User_Name", DataViewRowState.CurrentRows);
                                foundRows = dv.FindRows(new object[] { UserName });
                                if (foundRows.Length == 0)
                                {
                                    blFlag = true;
                                    result = UserName + " is not a valid user name. Error at row number " + (Convert.ToInt16(i + 2)).ToString();
                                    return result;
                                }
                            }

                            //Validate the UserName
                            blFlag = regExName.IsMatch(UserName);
                            if (!blFlag)
                            {
                                blFlag = false;
                                result = UserName + " is not a valid user name. Error at row number " + (Convert.ToInt16(i + 2)).ToString();
                                return result;
                            }

                            if (UserLeaveTypeName == "")
                            {
                                blFlag = false;
                                result = "Leave Type Name must be given. Error at row number " + (Convert.ToInt16(i + 2)).ToString();
                                return result;
                            }
                            {
                                dv = new DataView(dsLeaveBalanceUpdate.Tables[1], "", "Leave_Type_Name", DataViewRowState.CurrentRows);
                                foundRows = dv.FindRows(new object[] { UserLeaveTypeName });
                                if (foundRows.Length == 0)
                                {
                                    blFlag = false;
                                    result = UserLeaveTypeName + " is not a valid Leave Type Name. Error at row number " + (Convert.ToInt16(i + 2)).ToString();
                                    return result;
                                }
                            }
                            //Validate the LeaveType Name
                            blFlag = regExName.IsMatch(UserLeaveTypeName);
                            if (!blFlag)
                            {
                                blFlag = false;
                                result = UserLeaveTypeName + " is not a valid Leave Type Name. Error at row number " + (Convert.ToInt16(i + 2)).ToString();
                                return result;
                            }
                            //Validate the Balance CF
                            blFlag = regNumber.IsMatch(BalanceCF);
                            if (!blFlag)
                            {
                                blFlag = false;
                                result = "Entered Value in Balance CF is Invalid. Error at row number " + (Convert.ToInt16(i + 2)).ToString();
                                return result;
                            }
                            //Valiate the Lapsed
                            blFlag = regNumber.IsMatch(Lapsed);
                            if (!blFlag)
                            {
                                blFlag = false;
                                result = "Entered Value in Lapsed is Invalid. Error at row number " + (Convert.ToInt16(i + 2)).ToString();
                                return result;
                            }
                            //Validate the YearEligibleLeave
                            blFlag = regNumber.IsMatch(EligibleLeave);
                            if (!blFlag)
                            {
                                blFlag = false;
                                result = "Entered Valued in Eligible Leave is Invalid. Error at row number " + (Convert.ToInt16(i + 2)).ToString();
                                return result;
                            }
                            //validate the OpeningBalance
                            //blFlag = regNumber.IsMatch(strOpeningBalance);
                            //if (!blFlag)
                            //{
                            //    blFlag = false;
                            //    result = "Entered Value in Opening Balance is Invalid. Error at row number " + (Convert.ToInt16(i + 2)).ToString();
                            //    return result;
                            //}
                            ////Validate the LeaveTaken
                            //blFlag = regNumber.IsMatch(strLeaveTaken);
                            //if (!blFlag)
                            //{
                            //    blFlag = false;
                            //    result = "Entered Value in LeaveTaken is Invalid. Error at row number " + (Convert.ToInt16(i + 2)).ToString();
                            //    return result;
                            //}
                            ////Validate the LeaveBalance
                            //blFlag = regNumber.IsMatch(strLeaveBalance);
                            //if (!blFlag)
                            //{
                            //    blFlag = false;
                            //    result = "Entered Value in Leave Balance is Invalid. Error at row number " + (Convert.ToInt16(i + 2)).ToString();
                            //    return result;
                            //}
                        }
                    }
                }
                else
                {
                    result = "No details found in the Leave Balance Update File.";
                    return result;
                }
                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "FAIL^" + ex.Message;
            }
        }

        List<LeaveBalanceUploadFailure> lstUploadFailure = new List<LeaveBalanceUploadFailure>();
        /// <summary>
        /// Insert and Update
        /// </summary>
        /// <param name="dsLeaveType"></param>
        /// <param name="collection"></param>
        /// <returns></returns>
        [HttpPost]
        private int FileUpload(DataTable dsLeaveType, FormCollection collection)
        {
            BLMaster _objMaster = new BLMaster();
            SPData objSPData = new SPData();

            //parameters declared for insertion of values
            string UserTypeCode = string.Empty;
            string UserCode = string.Empty;
            string LeaveTypeCode = string.Empty;

            int Row_No = 0;
            string UserName = string.Empty;
            string User_Leave_Code = string.Empty;
            string LeaveTypeName = string.Empty;
            string BalanceCF = string.Empty;
            string Lapsed = string.Empty;
            string EligibleLeave = string.Empty;
            string Effective_From = string.Empty;
            string Effective_To = string.Empty;

            int updateResult = 0;

            //parameters declared for sending mail
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string subDomain = _objcurrentInfo.GetSubDomain();

            string inward_Requestform = collection["txtRequestform"].ToString();
            string inward_RequestDate = collection["txtRequestdate"].ToString();
            string inward_RequestReason = collection["txtReason"].ToString();
            string inward_UserName = collection["txtsupportUserName"].ToString();
            //string inward_Emailid = collection["txtmailid"].ToString();
            //string inward_EmailBody = collection["txtemailBody"].ToString();
            _objExcelConverter = new ExcelFactory();

            DataView dv;
            DataRowView[] foundRows;
            DataSet dsLeaveBalanceUpdate = null;
            dsLeaveBalanceUpdate = _objMaster.GetleaveBalanceUpdate(companyCode);

            string isTrue = string.Empty;
            try
            {
                if (dsLeaveType.Rows.Count > 0 && dsLeaveType.Rows != null && dsLeaveType != null)
                {
                    for (int i = 0; i < dsLeaveType.Rows.Count; i++)
                    {
                        User_Leave_Code = Convert.ToString(objSPData.GetSeqNumber("SEQ_tbl_SFA_User_Leave_Type_Master"));
                        UserName = dsLeaveType.Rows[i]["User Name"].ToString().Trim().Replace("'", "");
                        if (UserName == "*")
                        {
                            break;
                        }
                        Row_No = Convert.ToInt32(dsLeaveType.Rows[i]["Row No"].ToString().Trim().Replace("'", ""));
                        LeaveTypeName = dsLeaveType.Rows[i]["Leave Type Name"].ToString().Trim().Replace("'", "");
                        BalanceCF = dsLeaveType.Rows[i]["Balance CF"].ToString().Trim().Replace("'", "");
                        Lapsed = dsLeaveType.Rows[i]["Lapsed"].ToString().Trim().Replace("'", "");
                        EligibleLeave = dsLeaveType.Rows[i]["Eligible Leave"].ToString().Trim().Replace("'", "");
                        Effective_From = dsLeaveType.Rows[i]["Effective From"].ToString().Trim().Replace("'", "");
                        Effective_To = dsLeaveType.Rows[i]["Effective To"].ToString().Trim().Replace("'", "");
                        string stringRequesteddate = inward_RequestDate.Split('/')[2] + "-" + inward_RequestDate.Split('/')[1] + "-" + inward_RequestDate.Split('/')[0];

                        //Get Usercode
                        dv = new DataView(dsLeaveBalanceUpdate.Tables[0], "", "User_Name", DataViewRowState.CurrentRows);
                        foundRows = dv.FindRows(new object[] { UserName });
                        if (foundRows.Length > 0)
                        {
                            UserCode = foundRows[0].Row.ItemArray[1].ToString().Trim();
                        }
                        //Get LeaveTypecode
                        dv = new DataView(dsLeaveBalanceUpdate.Tables[1], "", "Leave_Type_Name", DataViewRowState.CurrentRows);
                        foundRows = dv.FindRows(new object[] { LeaveTypeName });
                        if (foundRows.Length > 0)
                        {
                            LeaveTypeCode = foundRows[0].Row.ItemArray[0].ToString().Trim();
                        }
                        //Get Usertypecode
                        dv = new DataView(dsLeaveBalanceUpdate.Tables[0], "", "User_Name", DataViewRowState.CurrentRows);
                        foundRows = dv.FindRows(new object[] { UserName });
                        if (foundRows.Length > 0)
                        {
                            UserTypeCode = foundRows[0].Row.ItemArray[3].ToString().Trim();
                        }

                        //Insert and Update
                        LeaveCurBalance objLeaveBalance = new LeaveCurBalance();
                        List<LeaveCurBalance> lstLeavecurBalance = new List<LeaveCurBalance>();
                        objLeaveBalance.Company_Code = companyCode;
                        objLeaveBalance.User_Type_Code = UserTypeCode;
                        objLeaveBalance.Row_No = Row_No;
                        objLeaveBalance.User_Code = UserCode;
                        objLeaveBalance.User_Leave_Code = User_Leave_Code;
                        objLeaveBalance.Leave_Type_Code = LeaveTypeCode;
                        objLeaveBalance.Balance_CF = BalanceCF.ToString();
                        objLeaveBalance.Leave_Eligible = EligibleLeave.ToString();
                        //objLeaveBalance.Leave_Taken = intLeaveTaken.ToString();
                        //objLeaveBalance.Leave_Balance = intLeaveBalance.ToString();
                        objLeaveBalance.Lapsed = Lapsed.ToString();
                        //objLeaveBalance.Opening_Balance = intOpeningBalance.ToString();
                        //objLeaveBalance.Effective_From = Effective_From.Split('-')[2] + '-' + Effective_From.Split('-')[1] + '-' + Effective_From.Split('-')[0];
                        //objLeaveBalance.Effective_To = Effective_To.Split('-')[2] + '-' + Effective_To.Split('-')[1] + '-' + Effective_To.Split('-')[0];
                        objLeaveBalance.Effective_From = Effective_From;
                        objLeaveBalance.Effective_To = Effective_To;
                        objLeaveBalance.Request_From = inward_Requestform;
                        objLeaveBalance.Requested_Date = stringRequesteddate;
                        objLeaveBalance.Request_Reason = inward_RequestReason;
                        objLeaveBalance.Entered_By = _objcurrentInfo.GetUserName();
                        objLeaveBalance.Entered_DateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff");
                        objLeaveBalance.Support_User_Name = inward_UserName;
                        //objLeaveBalance.Is_Active = "1";
                        lstLeavecurBalance.Add(objLeaveBalance);
                        //to check if any row exists in the given effective from and effective to range
                        isTrue = _objMaster.CheckLeaveBalance(companyCode, UserCode, LeaveTypeCode, Effective_From, Effective_To);

                        if (isTrue.Split('-')[0] == "False")
                        {
                            LeaveBalanceUploadFailure objUploadFailure = new LeaveBalanceUploadFailure();
                            objUploadFailure.Row_No = Row_No;
                            objUploadFailure.Failure_Reason = isTrue.Split('-')[1];
                            lstUploadFailure.Add(objUploadFailure);
                            updateResult = 0;
                        }
                        else
                        {
                            updateResult = _objMaster.InsertUserLeave(lstLeavecurBalance); //Insert
                        }
                    }

                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return updateResult;
        }

        #endregion Leave Balance Update

        public JsonResult GetLopStatus()
        {
            List<LeaveModel> lstLops = new List<LeaveModel>();
            BLLeave _objLeave = new BLLeave();
            lstLops = _objLeave.GetLopStatus(_objcurrentInfo.GetCompanyCode()).ToList();
            JSONConverter objJsoon = new JSONConverter();
            return Json(objJsoon.Serialize(lstLops));
        }

        #region User Leave Type Balance
        public ActionResult UserLeaveTypeBalance()
        {
            return View();
        }

        public string GetUnderUserTypes()
        {
            StringBuilder strContent = new StringBuilder();
            try
            {
                DataControl.CurrentInfo objCurInfo = new CurrentInfo();
                BL_SplashScreen _objBLSplashScreen = new BL_SplashScreen();
                string userCode = string.Empty;
                string companyCode = string.Empty;
                userCode = objCurInfo.GetUserCode();
                companyCode = objCurInfo.GetCompanyCode();
                List<MVCModels.HiDoctor_Master.UserTypeModel> lstUserType = new List<MVCModels.HiDoctor_Master.UserTypeModel>();
                lstUserType = _objBLSplashScreen.GetUnderUserTypes(companyCode, userCode).ToList();
                if (lstUserType.Count > 0)
                {
                    foreach (var dr in lstUserType)
                    {
                        if (dr.User_Type_Status == "1")
                        {
                            strContent.Append("<option value='" + dr.User_Type_Code + "'>" + dr.User_Type_Name + "</option>");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return strContent.ToString();
        }

        public JsonResult GetUsersForTree(string userTypeCode)
        {
            BLLeave _objLeave = new BLLeave();
            List<MVCModels.UsersForLeaveBalance> lstTreeUser = new List<MVCModels.UsersForLeaveBalance>();
            lstTreeUser = _objLeave.GetUsersForTree(_objcurrentInfo.GetCompanyCode(), userTypeCode);
            return Json(lstTreeUser, JsonRequestBehavior.AllowGet);
        }

        public string GetUserTypeLeave(string UserTypeCode, string cal_Year)
        {
            List<MVCModels.UserTypeLeaveType> lstUserLeaveType = new List<MVCModels.UserTypeLeaveType>();
            StringBuilder strngContent = new StringBuilder();
            try
            {
                DataControl.CurrentInfo objCurInfo = new CurrentInfo();
                BLLeave _objLeave = new BLLeave();
                lstUserLeaveType = _objLeave.GetUserTypeLeave(_objcurrentInfo.GetCompanyCode(), UserTypeCode, cal_Year);
                strngContent.Append("<option value=''>-Select Leave Type-</option>");
                if (lstUserLeaveType.Count > 0)
                {
                    foreach (var dr in lstUserLeaveType)
                    {
                        strngContent.Append("<option value='" + dr.Leave_Type_Code + "'>" + dr.Leave_Type_Name + "</option>");
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return strngContent.ToString();
        }

        public JsonResult GetLeaveTypesForFilter(string UserTypeCode, string cal_Year)
        {
            List<MVCModels.UserTypeLeaveType> lstUserLeaveType = new List<MVCModels.UserTypeLeaveType>();
            try
            {
                BLLeave _objLeave = new BLLeave();
                lstUserLeaveType = _objLeave.GetUserTypeLeave(_objcurrentInfo.GetCompanyCode(), UserTypeCode, cal_Year);
                return Json(lstUserLeaveType, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public JsonResult GetUserLeaveDetails(string LeaveTypeCode, string userTypeCode, string Usercodes)
        {
            BLLeave _objLeave = new BLLeave();
            List<MVCModels.UserLeaveDetails> lstUsrLvDet = new List<MVCModels.UserLeaveDetails>();
            lstUsrLvDet = _objLeave.GetUserLeaveDetails(_objcurrentInfo.GetCompanyCode(), LeaveTypeCode, userTypeCode, Usercodes).ToList();
            return Json(lstUsrLvDet, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetUserLeaveFilterDetails(string LeaveTypeCode, string UserCodes, string Year)
        {
            BLLeave _objLeave = new BLLeave();
            List<UserLeaveDetails> lstUserLeaveDet = new List<UserLeaveDetails>();
            lstUserLeaveDet = _objLeave.GetUserLeaveFilterDetails(_objcurrentInfo.GetCompanyCode(), LeaveTypeCode, UserCodes, Year).ToList();
            return Json(lstUserLeaveDet, JsonRequestBehavior.AllowGet);
        }

        public bool UpdateUserLeaveDetails(string LeaveTypeCode, string userTypeCode, string UserCode, float BalCF, float LeaveElg, float OpenBal, float LvTkn, float Lapsed, float LeaveBal)
        {
            bool result = false;
            BLLeave _objLeave = new BLLeave();
            result = _objLeave.UpdateUserLeaveDetails(_objcurrentInfo.GetCompanyCode(), _objcurrentInfo.GetUserCode(), LeaveTypeCode, userTypeCode, UserCode, BalCF, LeaveElg, OpenBal, LvTkn, Lapsed, LeaveBal);
            return result;
        }

        public JsonResult BulkUpdateUserLeaveDetails(UpdateUserLeaveDetails obj)
        {
            string result = "";
            BLLeave _objLeave = new BLLeave();
            result = _objLeave.BulkUpdateUserLeaveDetails(_objcurrentInfo.GetCompanyCode(), obj.lstUpdateDet);
            return Json(result);
        }

        public JsonResult AddNewLeaveType(string NewLeaveType, string userTypeCode, string UserCode, string Effective_From, string Effective_To)
        {
            BLLeave _objLeave = new BLLeave();
            List<AddUserLeave> lstAddLeaveDet = new List<AddUserLeave>();
            lstAddLeaveDet = _objLeave.AddNewLeaveType(_objcurrentInfo.GetCompanyCode(), _objcurrentInfo.GetUserName(), NewLeaveType, userTypeCode, UserCode, Effective_From, Effective_To).ToList();
            return Json(lstAddLeaveDet, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSelectedLeaveDetails(string User_Leave_Code)
        {
            List<UserLeaveDetails> lstLeaveDetails = new List<UserLeaveDetails>();
            BLLeave _objLeave = new BLLeave();
            lstLeaveDetails = _objLeave.GetSelectedLeaveDetails(_objcurrentInfo.GetCompanyCode(), User_Leave_Code);
            return Json(lstLeaveDetails, JsonRequestBehavior.AllowGet);

        }

        #endregion User Leave Type Balance
    }
}
