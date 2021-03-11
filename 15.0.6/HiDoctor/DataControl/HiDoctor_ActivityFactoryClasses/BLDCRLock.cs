#region Usings
using System;
using System.Collections.Generic;
using System.Text;

using MVCModels;
using MVCModels.HiDoctor_Master;
using Newtonsoft.Json;
using System.Linq;
#endregion Usings

namespace DataControl.HiDoctor_ActivityFactoryClasses
{
    public class BLDCRLock : IDCRLock
    {
        #region Private Variables
        private DALDCRLock _objdalDCRLock;
        #endregion Private Variables
        /// <summary>
        /// Retrieve the acivity locks list from DAL.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="user_Code"></param>
        /// <returns></returns>
        private List<DCRActivityLockModel> GetDCRActivityLockslist(string company_Code, string user_Code)
        {
            _objdalDCRLock = new DALDCRLock();
            List<DCRActivityLockModel> lstDCRActivityLockModel = _objdalDCRLock.GetActivityLocksForSingleUser(company_Code, user_Code);
            return lstDCRActivityLockModel;
        }

        /// <summary>
        /// Converts DCR Activity Lock list to HTML Table format.
        /// </summary>
        /// <param name="lstDCRActivityLockModel"></param>
        /// <returns></returns>
        private StringBuilder ActivityLockHTMLString(List<DCRActivityLockModel> lstDCRActivityLockModel)
        {

            StringBuilder activityLockString = new StringBuilder();
            string type = "[null, { type: 'date-range' }, { type: 'text' }, { type: 'text' }]";
            if (lstDCRActivityLockModel != null && lstDCRActivityLockModel.Count > 0)
            {
                //activityLockString.Append("<a href='#'id='lnkFilter' onclick='fnToggleFilter()'>Show Filter</a>");
                activityLockString.Append("<table cellspacing='0' cellpadding='0' class='data display datatable' width='105%' id='tblActivityLock' >");
                activityLockString.Append("<thead>");
                activityLockString.Append("<tr id='lockFilter' style='display:none' >");
                activityLockString.Append("<th ></th>");
                activityLockString.Append("<th >User Name</th>");
                activityLockString.Append("<th >Locked Date</th>");
                activityLockString.Append("<th >DCR Date</th>");
                activityLockString.Append("<th >Actvity Type</th>");
                activityLockString.Append("<th >Unapproval Reason</th>");
                activityLockString.Append("<th >Unapproved By</th>");
                activityLockString.Append("<th style='text-align:left'>Request Released By</th>");
                activityLockString.Append("<th style='text-align:left;padding-right:7%;'>Released Reason</th>");
                activityLockString.Append("</tr>");
                activityLockString.Append("<tr >");
                activityLockString.Append("<th style='background: #5E87B0 !important;color: #fff !important;text - align:center !important;'><input type='checkbox' id='chk_0' onclick='fnSelectAll()' /><label for='chk_0'></label></th>");
                activityLockString.Append("<th style='background: #5E87B0 !important;color: #fff !important;text - align:center !important;'>User Name</th>");
                activityLockString.Append("<th style='background: #5E87B0 !important;color: #fff !important;text - align:center !important;'>Locked Date</th>");
                activityLockString.Append("<th style='background: #5E87B0 !important;color: #fff !important;text - align:center !important;'>DCR Date</th>");
                activityLockString.Append("<th style='background: #5E87B0 !important;color: #fff !important;text - align:center !important;'>Actvity Type</th>");
                activityLockString.Append("<th style='background: #5E87B0 !important;color: #fff !important;text - align:center !important;'>Unapproval Reason</th>");
                activityLockString.Append("<th style='background: #5E87B0 !important;color: #fff !important;text - align:center !important;'>Unapproved By</th>");
                activityLockString.Append("<th style='background: #5E87B0 !important;color: #fff !important;text - align:center !important;'>Request Released By</th>");
                activityLockString.Append("<th style='background: #5E87B0 !important;color: #fff !important;text - align:center !important;padding-right:7%;'>Released Reason</th>");
                activityLockString.Append("</tr>");
                activityLockString.Append("</thead>");
                activityLockString.Append("<tbody>");
                List<MVCModels.ReportedUser> lstReported = new List<MVCModels.ReportedUser>();
                DataControl.HD_MasterFactoryClasses.BL_UsercreationWizard _objUserCreation = new DataControl.HD_MasterFactoryClasses.BL_UsercreationWizard();
                DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
                lstReported = _objUserCreation.GetReportedMangers(_objcurrentInfo.GetCompanyCode(), lstDCRActivityLockModel[0].User_Code, _objcurrentInfo.GetUserCode()).ToList();
                string list = "";
                foreach (var item in lstReported)
                {
                    if (item.User_Code == _objcurrentInfo.GetUserCode())
                        list += "<option  selected='selected' value='" + item.User_Code + "'>" + item.User_Name + "</option>";
                    else
                        list += "<option value='" + item.User_Code + "'>" + item.User_Name + "</option>";
                }
                int index = 0;
                foreach (DCRActivityLockModel activityLock in lstDCRActivityLockModel)
                {
                    index++;
                    activityLockString.Append("<tr id='trActivity_"+index+"'>");
                    activityLockString.Append("<td valign='top' align='left' width='3%' > ");
                    activityLockString.Append("<input name='chkUserSelect' class='checkboxclass' type='checkbox'  id='chk_" + index.ToString() + "' name='checkbox'>");
                    activityLockString.Append("</td>");
                    activityLockString.Append("<td align='left' id='dcruser_" + index.ToString() + "' width='10%'>");
                    activityLockString.Append(activityLock.User_Name);
                    activityLockString.Append("</td>");
                    activityLockString.Append("<td align='left' id='dcrlock_" + index.ToString() + "' width='10%'>");
                    activityLockString.Append(activityLock.Locked_Date);
                    activityLockString.Append("</td>");
                    activityLockString.Append("<td align='left' id='dcrDate_"+index.ToString()+"' width='10%'>");
                    activityLockString.Append(activityLock.DCR_Actual_Date);
                    activityLockString.Append("</td>");
                    activityLockString.Append("<td align='left' id='dcrFlag_"+index.ToString()+"' width='10%'>");
                    activityLockString.Append(activityLock.Activity_Flag);
                    activityLockString.Append("</td>");
                    activityLockString.Append("<td align='left' width='18%'>");
                    activityLockString.Append(activityLock.Unapprove_Reason);
                    activityLockString.Append("</td>");
                    activityLockString.Append("<td align='left' width='10%'>");
                    activityLockString.Append(activityLock.Unapproved_by);
                    activityLockString.Append("</td>");
                    string ddl = "<select id='ddluser_code_" + index.ToString() + "'><option value='0'>-Select-</option>" + list;
                    ddl += "</select>";
                    activityLockString.Append("<td>" + ddl + "</td>");
                    activityLockString.Append("<td><textarea id='txtReason_" + index.ToString() + "' maxlength='250'>-Nil-</textarea></td>");
                    activityLockString.Append("</tr>");
                }
                activityLockString.Append("</tbody></table>");
            }

            StringBuilder strTableHTMLString = new StringBuilder();
            if (activityLockString.Length > 0)
            {
                strTableHTMLString.Append(activityLockString);
                strTableHTMLString.Append("$$");
                strTableHTMLString.Append(type);
            }
            return strTableHTMLString;
        }

        /// <summary>
        /// Converts the user details to HTML format.
        /// </summary>
        /// <param name="userModel"></param>
        /// <returns></returns>
        private StringBuilder UserHeaderDetailsHTMLString(UserModel userModel)
        {

            StringBuilder strUserHeaderDetails = new StringBuilder();
            // User Details.
            string emp_Name = userModel.Employee_Name == null ? "NA" : userModel.Employee_Name.Trim().Length == 0 ? "NA" : userModel.Employee_Name;
            string user_Name = userModel.User_Name == null ? "NA" : userModel.User_Name.Trim().Length == 0 ? "NA" : userModel.User_Name;
            string region_Name = userModel.Region_Name == null ? "NA" : userModel.Region_Name.Trim().Length == 0 ? "NA" : userModel.Region_Name;
            string desigination = userModel.User_Type_Name == null ? "NA" : userModel.User_Type_Name.Trim().Length == 0 ? "NA" : userModel.User_Type_Name;
            string mobile = userModel.User_Mobile_Number == null ? "NA" : userModel.User_Mobile_Number.Trim().Length == 0 ? "NA" : userModel.User_Mobile_Number;
            string phone = userModel.User_Phone_Number == null ? "NA" : userModel.User_Phone_Number.Trim().Length == 0 ? "NA" : userModel.User_Phone_Number;

            // Manager Details.
            string manager_Name = userModel.Reporting_Manager_Emp_Name == null ? "NA" : userModel.Reporting_Manager_Emp_Name.Trim().Length == 0 ? "NA" : userModel.Reporting_Manager_Emp_Name;
            string manager_user_Name = userModel.Reporting_Manager_Name == null ? "NA" : userModel.Reporting_Manager_Name.Trim().Length == 0 ? "NA" : userModel.Reporting_Manager_Name;
            string manager_region_Name = userModel.Reporting_Manager_Region_Name == null ? "NA" : userModel.Reporting_Manager_Region_Name.Trim().Length == 0 ? "NA" : userModel.Reporting_Manager_Region_Name;
            string manager_desigination = userModel.Reporting_Manager_Type_Name == null ? "NA" : userModel.Reporting_Manager_Type_Name.Trim().Length == 0 ? "NA" : userModel.Reporting_Manager_Type_Name;
            string manager_mobile = userModel.Reproting_Managet_Mobile_Number == null ? "NA" : userModel.Reproting_Managet_Mobile_Number.Trim().Length == 0 ? "NA" : userModel.Reproting_Managet_Mobile_Number;
            string manager_phone = userModel.User_Phone_Number == null ? "NA" : userModel.User_Phone_Number.Trim().Length == 0 ? "NA" : userModel.User_Phone_Number;

            // User Details
            strUserHeaderDetails.Append("<div id='HeaderDetails' class='headerbox'>");
            strUserHeaderDetails.Append("<div id='HeaderUserDetails'>");
            strUserHeaderDetails.Append("<table id='tbluserDetails' style='width:100%' border='0' cellspacing='0' cellpadding='0'>");
            strUserHeaderDetails.Append("<tr style='background-color:#f0f0e0'><td colspan='2'>");
            strUserHeaderDetails.Append("<div class='headerTitle'>User Details</div>");
            strUserHeaderDetails.Append("</td></tr>");
            strUserHeaderDetails.Append("<tr>");
            strUserHeaderDetails.Append("<td>Employee Name</td>");
            strUserHeaderDetails.Append("<td>");
            strUserHeaderDetails.Append(emp_Name);
            strUserHeaderDetails.Append("</td>");
            strUserHeaderDetails.Append("</tr>");

            strUserHeaderDetails.Append("<tr>");
            strUserHeaderDetails.Append("<td>User Name</td>");
            strUserHeaderDetails.Append("<td>");
            strUserHeaderDetails.Append(user_Name);
            strUserHeaderDetails.Append("</td>");
            strUserHeaderDetails.Append("</tr>");

            strUserHeaderDetails.Append("<tr>");
            strUserHeaderDetails.Append("<td>Region Name</td>");
            strUserHeaderDetails.Append("<td>");
            strUserHeaderDetails.Append(region_Name);
            strUserHeaderDetails.Append("</td>");
            strUserHeaderDetails.Append("</tr>");

            strUserHeaderDetails.Append("<tr>");
            strUserHeaderDetails.Append("<td>Designation</td>");
            strUserHeaderDetails.Append("<td>");
            strUserHeaderDetails.Append(desigination);
            strUserHeaderDetails.Append("</td>");
            strUserHeaderDetails.Append("</tr>");

            strUserHeaderDetails.Append("</table>");
            strUserHeaderDetails.Append("</div>");

            strUserHeaderDetails.Append("<div id='HeaderManagerDetails'>");
            
            strUserHeaderDetails.Append("<table id='tblManagerDetails' style='width:100%' border='0' cellspacing='0' cellpadding='0'>");
            strUserHeaderDetails.Append("<tr style='background-color:#f0f0e0'><td colspan='2'>");
            strUserHeaderDetails.Append("<div class='headerTitle'>Reporting Manager Details</div>");
            strUserHeaderDetails.Append("</td></tr>");
            strUserHeaderDetails.Append("<tr>");
            strUserHeaderDetails.Append("<td>Employee Name</td>");
            strUserHeaderDetails.Append("<td>");
            strUserHeaderDetails.Append(manager_Name);
            strUserHeaderDetails.Append("</td>");
            strUserHeaderDetails.Append("</tr>");

            strUserHeaderDetails.Append("<tr>");
            strUserHeaderDetails.Append("<td>User Name</td>");
            strUserHeaderDetails.Append("<td>");
            strUserHeaderDetails.Append(manager_user_Name);
            strUserHeaderDetails.Append("</td>");
            strUserHeaderDetails.Append("</tr>");

            strUserHeaderDetails.Append("<tr>");
            strUserHeaderDetails.Append("<td>Region Name</td>");
            strUserHeaderDetails.Append("<td>");
            strUserHeaderDetails.Append(manager_region_Name);
            strUserHeaderDetails.Append("</td>");
            strUserHeaderDetails.Append("</tr>");

            strUserHeaderDetails.Append("<tr>");
            strUserHeaderDetails.Append("<td>Designation</td>");
            strUserHeaderDetails.Append("<td>");
            strUserHeaderDetails.Append(manager_desigination);
            strUserHeaderDetails.Append("</td>");
            strUserHeaderDetails.Append("</tr>");

            strUserHeaderDetails.Append("</table>");
            strUserHeaderDetails.Append("</div>");

            return strUserHeaderDetails;
        }

        public string ReleaseActivityLock(string company_Code,string userCode,string dcrDetails,string releasedBy)
        {            
            _objdalDCRLock = new DALDCRLock();
            IEnumerable<DCRActivityLockModel> IDCRDetails = (IEnumerable<DCRActivityLockModel>)JsonConvert.DeserializeObject(dcrDetails, typeof(List<DCRActivityLockModel>));

            string result = _objdalDCRLock.ReleaseActivityLock(company_Code, userCode, releasedBy, IDCRDetails);
            return result;
        }

        /// <summary>
        /// Retrieve the Activity locks details for per user and returns the HTML table format.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="user_Code"></param>
        /// <returns></returns>
        public StringBuilder GetActivityLockHTMLFormat(string company_Code, string user_Code)
        {
            DALUser objdalUser = new DALUser();

            // Retrieves the User Header details.
            UserModel userModel = objdalUser.GetUserHeaderDetails(company_Code, user_Code);
            StringBuilder strHeaderDetails = UserHeaderDetailsHTMLString(userModel);

            // Retrieves the Activity lock details.
            List<DCRActivityLockModel> lstDCRActivityLockModel = GetDCRActivityLockslist(company_Code, user_Code);
            StringBuilder activityLockHtmlString = ActivityLockHTMLString(lstDCRActivityLockModel);

            // returns the HTML format string with Header details and Activity lock details.
            if (activityLockHtmlString.Length == 0)
            {
                StringBuilder strNoRecords = new StringBuilder();
                return strNoRecords.Append("No lock details found.");
            }
            else
            {
                return strHeaderDetails.Append("$" + activityLockHtmlString.ToString());
            }
        }

        /// <summary>
        /// Retrieve the activity locked users.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <returns></returns>
        public List<UserModel> GetAcivityLockedUsers(string company_Code)
        {
            _objdalDCRLock = new DALDCRLock();
            List<UserModel> activityLockUsersList = _objdalDCRLock.GetActivityLockUsers(company_Code);
            return activityLockUsersList;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="dcrActivityLockModel"></param>
        /// <returns></returns>
        public int InsertActivityLock(string company_Code, List<DCRActivityLockModel> dcrActivityLockModel)
        {
            _objdalDCRLock = new DALDCRLock();
            int result = _objdalDCRLock.InsertDCRActivityLock(company_Code, dcrActivityLockModel);
            return result;
        }

        public bool InsertDCRManualLock(string company_Code, string lock_User_Codes, string LockDateFrom, string LockDateTo, string user_Code, string lockReason)
        {
            _objdalDCRLock = new DALDCRLock();
            return _objdalDCRLock.InsertDCRManualLock(company_Code, lock_User_Codes, LockDateFrom, LockDateTo, user_Code, lockReason); 
        }
        public List<MVCModels.HiDoctor_Master.UserModel> EmployeeDetails(string companycode, string user_Code)
        {
            _objdalDCRLock = new DALDCRLock();
            return _objdalDCRLock.EmployeeDetails(companycode, user_Code);
        }

    }
}
