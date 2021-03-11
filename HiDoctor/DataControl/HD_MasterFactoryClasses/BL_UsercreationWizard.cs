#region Using
using MVCModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
#endregion Using

namespace DataControl.HD_MasterFactoryClasses
{
    public class BL_UsercreationWizard
    {
        #region Private Variable
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        private DAL_UsercreationWizard _objDALUsercretion;
        private SPData _objSPData;
        #endregion Private


        #region Master Data
        /// <summary>
        /// Used to get Master Region
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.User_RegionMasterModel> GetRegionMaster(string companyCode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetRegionMaster(companyCode);
        }
        /// <summary>
        /// Used to Get All user
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.User_UserMasterModel> GetUserMaster(string companyCode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetUserMaster(companyCode);
        }
        /// <summary>
        /// Used to get all user Types
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.User_UserTypeMasterModel> GetUserTypeMaster(string companyCode, string userTypecode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetUserTypeMaster(companyCode, userTypecode);
        }
        /// <summary>
        /// Used to get all divisions
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.User_DivisionMasterModel> GetDivisions(string UserCode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetDivisions(UserCode);
        }
        /// <summary>
        /// Used to get all project 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.User_ProjectMaster> GetProjectMaster(string companyCode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetProjectMaster(companyCode);
        }
        /// <summary>
        /// Used to get all Expense group header
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.User_ExpenseGroupHeaderModel> GetExpenseGroupHeader(string companyCode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetExpenseGroupHeader(companyCode);
        }
        /// <summary>
        /// Used to get All Employee
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.User_EmployeeModel> GetEmployeeMaster(string companyCode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetEmployeeMaster(companyCode);
        }
        #endregion Master Data

        #region  Employee details
        /// <summary>
        /// Used to get Employee Detailss
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="employeeCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.User_Employeedetails> GetEmployeeDetails(string companyCode, string employeeCode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetEmployeeDetails(companyCode, employeeCode);
        }
        /// <summary>
        /// Check assign User id already exists or not
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userName"></param>
        /// <param name="employeeCode"></param>
        /// <param name="userCode"></param>
        /// <returns></returns>
        public int checkAssignUserId(string companyCode, string userName, string employeeCode, string userCode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.checkAssignUserId(companyCode, userName, employeeCode, userCode);
        }
        /// <summary>
        /// Used to Get Regions By selected division
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="divisionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.RigionByDivisionModel> GetRegionbyDivision(string companyCode, string divisionCode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            //string Region_Code = _objcurrentInfo.GetRegionCode();
            return _objDALUsercretion.GetRegionbyDivision(companyCode, divisionCode);
        }
        /// <summary>
        /// Get Users by selected region
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.User_UserMasterModel> GetUserbyRegion(string companyCode, string regionCode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetUserbyRegion(companyCode, regionCode);
        }
        /// <summary>
        /// Get region by Seleted Region
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.User_RegionMasterModel> GetregionsByRegion(string companyCode, string regionCode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetregionsByRegion(companyCode, regionCode);
        }
        public IEnumerable<MVCModels.UnderUserModel> Getunderusers(string companyCode, string regionCode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.Getunderusers(companyCode, regionCode);
        }
        /// <summary>
        /// Get Expense by region or User Type
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="userTypecode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.User_ExpenseGroupHeaderModel> GetExpensebyRegionorUserType(string companyCode, string regionCode, string userTypecode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetExpensebyRegionorUserType(companyCode, regionCode, userTypecode);
        }
        /// <summary>
        /// Used to get Activity based on Project
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="projectCode"></param>
        /// <param name="activityDate"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.User_ActivityMasterModel> GetActivitybyProject(string companyCode, string projectCode, string activityDate)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetActivitybyProject(companyCode, projectCode, activityDate);
        }
        /// <summary>
        /// Check vacant or Unassigned
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public string CheckVacantRegionorNot(string companyCode, string regionCode)
        {
            string result = string.Empty;
            _objDALUsercretion = new DAL_UsercreationWizard();
            List<MVCModels.User_RegionMasterModel> lstRegionstatus = new List<MVCModels.User_RegionMasterModel>();
            result = _objDALUsercretion.CheckVacantorNot(companyCode, regionCode);
            return result;
        }
        #endregion Employee details
        #region Leave Details
        /// <summary>
        /// Get Leave types by UserType
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userTypecode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.User_LeaveTypeModel> GetLeaveTypebyUserType(string companyCode, string userTypecode, string hiDoctorStartDate, string doj)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetLeaveTypebyUserType(companyCode, userTypecode, hiDoctorStartDate, doj);
        }
        #endregion Leave Details
        #region Product Details
        /// <summary>
        /// Get User Product 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userTypeCode"></param>
        /// <param name="divisionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.User_ProductModel> GetProductsbyDivision(string companyCode, string userTypeCode, string divisionCode, string productName)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetProductsbyDivision(companyCode, userTypeCode, divisionCode, productName);
        }
        #endregion Product Details
        #region NoticeBoard Details
        /// <summary>
        /// Check vacant or Not assigned or vacant
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.User_NoticeBoard> GetNoticeboardMessagedetails(string companyCode, string regionCode, string activeDate, string noticeBoardmessage, string reportingtousercode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            string result = string.Empty;
            List<MVCModels.User_NoticeBoard> lstNoticeboardmessage = new List<MVCModels.User_NoticeBoard>();
            result = _objDALUsercretion.CheckVacantorNot(companyCode, regionCode);
            //if (result.ToUpper() == "ACTIVE") //Get active region Notice board message
            //{
            lstNoticeboardmessage = _objDALUsercretion.GetNoticeBoardMessageByRegion(companyCode, noticeBoardmessage).ToList();
            // }
            //else if (result.ToUpper() == "VACANT") //Get vacant region Notice board message
            //{
            //    lstNoticeboardmessage = _objDALUsercretion.GetNoticeboardmessageforvacantRegion(companyCode, regionCode, activeDate, titleName).ToList();
            //}
            //else // Get Not assigned region Details
            //{
            //    lstNoticeboardmessage = _objDALUsercretion.GetNoticeboardmessageforUnassignedRegion(companyCode, regionCode, activeDate, titleName,reportingtousercode).ToList();
            //}
            return lstNoticeboardmessage;
        }
        #endregion NoticeBoard Details
        #region  Splash Details
        public IEnumerable<MVCModels.Splash> GetSplashdetails(string companyCode, string splashmessage)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetSplashdetails(companyCode, splashmessage);
        }
        #endregion  Splash Details
        #region Create or Update the User
        /// <summary>
        /// Insert Employee Details
        /// </summary>
        /// <param name="lstEmployeedetails"></param>
        /// <returns></returns>
        public string CreatNewUser(List<MVCModels.User_Employeedetails> lstEmployeedetails, List<MVCModels.User_LeaveTypeModel> lstLeavedetails, List<MVCModels.User_ProductModel> lstProductdetails, List<MVCModels.User_NoticeBoard> lstNoticeboarddetails, List<MVCModels.Splash> lstsplashdetails, List<MVCModels.Edetailing> lstEdetailingDetails, string createdBy, int value, int TPLockvalue, string underuser, int SPLASHID, int EdetailingId, int DACode, string strGuid, string daCode)
        {
            string result = string.Empty;
            _objDALUsercretion = new DAL_UsercreationWizard();

            string divisionCode = lstEmployeedetails[0].Division_Code;
            string projectCode = lstEmployeedetails[0].Project_Code;
            string effectiveFromdate = lstEmployeedetails[0].Effective_From;
            int InsertDivisionCount = 1, InsertUserProjectCount = 1;

            if (lstEmployeedetails != null && lstEmployeedetails.Count > 0)
            {
                string companyCode = lstEmployeedetails[0].Company_Code;
                string employeeEntrymode = lstEmployeedetails[0].Entry_Mode;
                result = _objDALUsercretion.InsertEmployeedetails(lstEmployeedetails);


                if (result.Split(':')[0].ToUpper() == "SUCCESS")
                {

                    string employeeCode = result.Split(':')[1];
                    lstEmployeedetails.ForEach
                        (
                        y => y.Employee_Code = employeeCode
                        );

                    result = _objDALUsercretion.InsertUserDetails(lstEmployeedetails, value, TPLockvalue, underuser, SPLASHID, EdetailingId, DACode, strGuid, daCode);
                    if (result.Split(':')[0] == "SUCCESS")
                    {
                        string userCode = result.Split('-')[1];
                        string userName = result.Split('-')[0];
                        //Inset Project Details
                        if (!string.IsNullOrEmpty(projectCode))
                        {
                            int rowsAffected = _objDALUsercretion.InsertUserProjectDetails(companyCode, userCode, projectCode, effectiveFromdate);
                            if (rowsAffected < InsertUserProjectCount)
                            {
                                result = revertInsertedUserDetails(companyCode, employeeCode, userCode, 0, 0, 0, employeeEntrymode, divisionCode, InsertDivisionCount, InsertUserProjectCount);
                            }
                        }

                        if (lstLeavedetails.Count > 0)
                        {
                            lstLeavedetails.ForEach
                           (
                           z => z.User_Code = userCode
                           );
                            int rowsaffected = _objDALUsercretion.InsertLeaveDetails(lstLeavedetails);

                            if (rowsaffected < lstLeavedetails.Count)
                                result = revertInsertedUserDetails(companyCode, employeeCode, userCode, 0, 0, lstLeavedetails.Count, employeeEntrymode, divisionCode, InsertDivisionCount, InsertUserProjectCount);

                        }
                        if (lstProductdetails.Count > 0)
                        {
                            lstProductdetails.ForEach
                                    (
                                    z => z.User_Code = userCode
                                    );
                            DataTable dtUserProduct = null;
                            if (lstProductdetails.Count >= 1)
                            {
                                dtUserProduct = new DataTable();
                                dtUserProduct.Columns.Add("Company_Code", typeof(string));
                                dtUserProduct.Columns.Add("User_Code", typeof(string));
                                dtUserProduct.Columns.Add("Product_Code", typeof(string));
                                dtUserProduct.Columns.Add("Current_Stock", typeof(string));
                                dtUserProduct.Columns.Add("Effective_From", typeof(string));
                                dtUserProduct.Columns.Add("Min_Count", typeof(int));
                                dtUserProduct.Columns.Add("Max_Count", typeof(int));

                                for (int i = 0; i < lstProductdetails.Count; i++)
                                {
                                    dtUserProduct.Rows.Add(lstProductdetails[i].Company_Code, lstProductdetails[i].User_Code, lstProductdetails[i].Product_Code, lstProductdetails[i].Current_Stock, lstProductdetails[i].Effective_From, lstProductdetails[i].Min_Count, lstProductdetails[i].Max_Count);
                                }
                            }
                            int insertproduct = _objDALUsercretion.InsertProductDetails(dtUserProduct);

                            if (insertproduct < lstProductdetails.Count)
                                result = revertInsertedUserDetails(companyCode, employeeCode, userCode, 0, lstProductdetails.Count, lstLeavedetails.Count, employeeEntrymode, divisionCode, InsertDivisionCount, InsertUserProjectCount);
                        }

                        if (lstNoticeboarddetails.Count > 0)
                        {
                            lstNoticeboarddetails.ForEach
                                        (
                                        z => z.User_Code = userCode
                                        );

                            int insertnotice = _objDALUsercretion.InsertNoticeBoardDetails(lstNoticeboarddetails);

                            if (insertnotice < lstNoticeboarddetails.Count)
                                result = revertInsertedUserDetails(companyCode, employeeCode, userCode, lstNoticeboarddetails.Count, lstProductdetails.Count, lstLeavedetails.Count, employeeEntrymode, divisionCode, InsertDivisionCount, InsertUserProjectCount);
                        }
                        //if (lstsplashdetails.Count > 0)
                        //{
                        //    //lstsplashdetails.ForEach
                        //    //            (
                        //    //           // z => z.User_Code = userCode
                        //    //            );

                        //    int insertsplash = _objDALUsercretion.Insertsplash(lstsplashdetails);

                        //    if (insertsplash < lstsplashdetails.Count)
                        //        result = revertInsertedUserDetails(companyCode, employeeCode, userCode, lstsplashdetails.Count, lstProductdetails.Count, lstLeavedetails.Count, employeeEntrymode, divisionCode, InsertDivisionCount, InsertUserProjectCount);
                        //}
                    }
                    else
                        result = revertInsertedUserDetails(companyCode, employeeCode, "", 0, 0, 0, employeeEntrymode, divisionCode, InsertDivisionCount, InsertUserProjectCount);
                    //end of user creation
                }
            }
            else
            {
                result = "FAILURE";
            }
            return result;



        }

        public string revertInsertedUserDetails(string companyCode,
                                                string employeeCode,
                                                string userCode,
                                                int noticeBoardCount,
                                                int productDetailCount,
                                                int leaveDetailCount, string employeeEntrymode,
                                                string divisionCode, int DivisiondetailsCount, int UserProjectdetailsCount)
        {
            string returnString = string.Empty;

            int rowsAffected = 0;

            //Delete NoticeBoard Details
            if (noticeBoardCount > 0)
                rowsAffected = _objDALUsercretion.DeleteNoticeBoardDetails(companyCode, userCode);
            //Delete User Product Details
            if (productDetailCount > 0)
                rowsAffected = _objDALUsercretion.DeleteUserProductDetails(companyCode, userCode);
            //Delete Leave Details
            if (leaveDetailCount > 0)
                rowsAffected = _objDALUsercretion.DeleteLeaveDetails(companyCode, userCode);
            //Delete User Project Details
            if (UserProjectdetailsCount > 0)
            {
                rowsAffected = _objDALUsercretion.DeleteUserProjectDetails(companyCode, userCode);
            }
            //Delete Division Details
            if (DivisiondetailsCount > 0)
            {
                rowsAffected = _objDALUsercretion.DeletedDivisionEntityMapping(companyCode, divisionCode, userCode);
            }
            //Delete User Details
            if (!string.IsNullOrEmpty(userCode))
                rowsAffected = _objDALUsercretion.DeleteUserMasterDetails(companyCode, userCode);
            //Delete Employee Details
            if (employeeEntrymode.ToUpper() == "I")
                if (!string.IsNullOrEmpty(employeeCode))
                    rowsAffected = _objDALUsercretion.DeleteEmployeeMasterDetails(companyCode, employeeCode);

            return "FAILURE";

        }
        public IEnumerable<MVCModels.UnderUserModel> Getleafusers(string UserCode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.Getleafusers(UserCode);
        }
        public IEnumerable<MVCModels.UserDivisions> Getresuserdivision(string CompanyCode, string UserCode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.Getresuserdivision(CompanyCode, UserCode);
        }
        public IEnumerable<MVCModels.ReportedUser> GetReportedMangers(string CompanyCode, string UserCode, string loginUserCode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetReportedMangers(CompanyCode, UserCode, loginUserCode);
        }

        #endregion Create or Update the User
        #region Disable User
        /// <summary>
        /// Used to get all user to disable
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.User_UserMasterModel> GetUserToDisable(string companyCode, string userCode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetUserToDisable(companyCode, userCode);
        }
        /// <summary>
        /// Get active region to disable
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.User_RegionMasterModel> GetRegiontoDisable(string companyCode, string regionCode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetRegiontoDisable(companyCode, regionCode);
        }
        /// <summary>
        /// Get employee no by usercode
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.EmployeeModel> GetEmployeeNumbertoDisable(string companyCode, string userCode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetEmployeeNumbertoDisable(companyCode, userCode);
        }
        /// <summary>
        /// Get Employee details by usercode
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.Disable_Emloyeedetails> GetEmployeeNamebyUserCode(string companyCode, string userCode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetEmployeeNamebyUserCode(companyCode, userCode);
        }
        /// <summary>
        /// Get Employee details by regioncode
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.Disable_Emloyeedetails> GetEmployeeNamebyRegionCode(string companyCode, string regionCode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetEmployeeNamebyRegionCode(companyCode, regionCode);
        }
        /// <summary>
        /// Get Employee details by employeecode
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="employeeCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.Disable_Emloyeedetails> GetEmployeeNamebyEmployeeCode(string companyCode, string employeeCode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetEmployeeNamebyEmployeeCode(companyCode, employeeCode);
        }
        public IEnumerable<MVCModels.Disable_Emloyeedetails> GetChildUsers(string companyCode, string userCode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetChildUsers(companyCode, userCode);
        }
        /// <summary>
        /// used to disable the suer from user and Employee master
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="updateBy"></param>
        /// <param name="disableDate"></param>
        /// <returns></returns>
        public string UpdateDisableUser(string companyCode, string userCode, string updateBy, string disableDate, string Remarks)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.UpdateDisableUser(companyCode, userCode, updateBy, disableDate, Remarks);
        }
        /// <summary>
        /// Get employee details by employeecode
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="employeeCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.User_Employeedetails> GetEmployeeDetailsByempoyeeCode(string companyCode, string employeeCode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetEmployeeDetailsByempoyeeCode(companyCode, employeeCode);
        }
        public bool Insertleafuser(string companyCode, List<MVCModels.Reportuserhierarchy> lstuserdisable)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            //  List<MVCModels.Reportuserhierarchy> lstuserdisable = new List<MVCModels.Reportuserhierarchy>();

            // string[] userdisable = null;
            DataTable dtdisable = null;
            if (lstuserdisable != null)
            {
                if (lstuserdisable.Count >= 1)
                {
                    dtdisable = new DataTable();
                    dtdisable.Columns.Add("ID", typeof(int));
                    dtdisable.Columns.Add("Reporting_UserCode", typeof(string));
                    dtdisable.Columns.Add("Reporting_User_Name", typeof(string));
                    dtdisable.Columns.Add("Reporting_To_UserCode", typeof(string));
                    dtdisable.Columns.Add("Reporting_To_UserName", typeof(string));

                    int j = 0;
                    for (int i = 0; i < lstuserdisable.Count; i++)
                    {
                        j++;
                        dtdisable.Rows.Add(j, lstuserdisable[i].Reporting_UserCode, lstuserdisable[i].Reporting_User_Name, lstuserdisable[i].Reporting_To_UserCode, lstuserdisable[i].Reporting_To_UserName);
                    }
                }
            }
            return _objDALUsercretion.Insertleafuser(companyCode, lstuserdisable, dtdisable);
        }
        public IEnumerable<MVCModels.DCRDATE> GetDCRdate(string UserCode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetDCRdate(UserCode);
        }
        public IEnumerable<MVCModels.UnderUserModel> GetUsers(string CompanyCode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetUsers(CompanyCode);
        }
        public IEnumerable<MVCModels.Employee> Getempcode(string UserCode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.Getempcode(UserCode);
        }
        public IEnumerable<MVCModels.UserDetails> Getuserdetails(string UserCode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.Getuserdetails(UserCode);
        }
        public int UpdateUserDetails(string UserCode, string RegionCode, string UserTypeCode, string UnderUserCode, string UserDivisionCode, int ExpenseId, string Effectivefrom, int Effective, string RefKey1, string RefKey2, string ActulReporting)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.UpdateUserDetails(UserCode, RegionCode, UserTypeCode, UnderUserCode, UserDivisionCode, ExpenseId, Effectivefrom, Effective, RefKey1, RefKey2, ActulReporting);
        }

        public string UpdateUser(List<MVCModels.User_LeaveTypeModel> lstLeavedetails, List<MVCModels.User_ProductModel> lstProductdetails, string UserCode)
        {
            string result = string.Empty;
            _objDALUsercretion = new DAL_UsercreationWizard();



            if (lstLeavedetails.Count > 0)
            {
                lstLeavedetails.ForEach
               (
               z => z.User_Code = UserCode
               );
                int rowsaffected = _objDALUsercretion.InsertLeaveuserDetails(lstLeavedetails);


            }
            if (lstProductdetails.Count > 0)
            {
                lstProductdetails.ForEach
                        (
                        z => z.User_Code = UserCode
                        );
                string insertproduct = _objDALUsercretion.InsertProductuserDetails(lstProductdetails);


            }



            else
            {
                result = "";
            }
            return result;



        }
        public IEnumerable<MVCModels.Product> GetProduct(string UserCode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetProduct(UserCode);
        }
        public IEnumerable<MVCModels.User_LeaveTypeModel> GetLeaveTypebyUserCode(string companyCode, string UserCode, string userTypecode, string effectiveTo, string newusertypecode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetLeaveTypebyUserCode(companyCode, UserCode, userTypecode, effectiveTo, newusertypecode);
        }
        public IEnumerable<MVCModels.User_ProductModel> GetProductsbyDivisionuser(string companyCode, string UserCode, string userTypeCode, string divisionCode, string productName)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetProductsbyDivisionuser(companyCode, UserCode, userTypeCode, divisionCode, productName);
        }
        public IEnumerable<MVCModels.Edetailing> GetEdetailingdata(string companyCode, string message)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetEdetailingdata(companyCode, message);
        }
        public IEnumerable<MVCModels.Privilege> GetPriviligevalue(string companyCode, string Usertypecode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetPriviligevalue(companyCode, Usertypecode);
        }
        public IEnumerable<MVCModels.Privilege> GetMailPriviligevalue(string companyCode, string Usertypecode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetMailPriviligevalue(companyCode, Usertypecode);
        }

        public KangleUserDetails GetKangleUserDetails(string companyCode, string UserCode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetKangleUserDetails(companyCode, UserCode);
        }
        public kangleEmployeeDetails GetKangleEmployeeDetails(string companyCode, string UserCode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetKangleEmployeeDetails(companyCode, UserCode);
        }
        #endregion Disable User


        public IEnumerable<MVCModels.DesignationByDivisionModel> GetDesignationbyDivision(string companyCode, string divisionCode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            //string Region_Code = _objcurrentInfo.GetRegionCode();
            return _objDALUsercretion.GetDesignationbyDivision(companyCode, divisionCode);
        }

        public string GetMinMaxConfig(string Company_Code)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetMinMaxConfig(Company_Code);
        }
        public IEnumerable<MVCModels.Email> GetCompanyEmail()
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetCompanyEmail();
        }
        public IEnumerable<MVCModels.CCUsers> GetParentHierarchyByRegion(string RegionCode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetParentHierarchyByRegion(RegionCode);
        }
        public IEnumerable<MVCModels.MailTemplates> GetMailTemplates()
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetMailTemplates();
        }

        public IEnumerable<MVCModels.UserPrivilege> GetAllMailPriviligevalue(string companyCode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetAllMailPriviligevalue(companyCode);
        }
        public IEnumerable<MVCModels.Empdet> GetManagerEmpnumber(string UserCode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetManagerEmpnumber(UserCode);
        }


        public IEnumerable<MVCModels.ActualUser> GetActuluser(string companyCode, string divisionCode)
        {
            _objDALUsercretion = new DAL_UsercreationWizard();
            return _objDALUsercretion.GetActuluser(companyCode, divisionCode);
        }
        //public IEnumerable<MVCModels.ActualUser> GetActuluser(string CompanyCode)
        //{
        //    _objDALUsercretion = new DAL_UsercreationWizard();
        //    return _objDALUsercretion.GetActuluser(CompanyCode);
        //}

    }
}
