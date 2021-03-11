using DataControl.EnumType;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Collections.Generic;
using System.Reflection;
using Dapper;
using Microsoft.SqlServer.Server;
using MVCModels;

namespace DataControl.HD_MasterFactoryClasses
{
    public class DAL_UsercreationWizard : DapperRepository
    {
        Data _objData;
        SPData _objSPData;
        SqlDataReader sqldataReader;
        private CurrentInfo _objCurInfo = new CurrentInfo();

        #region constant string
        //Employee details
        const string SP_HD_GETEMPLOYEE = "SP_HD_GetEmployee";
        const string SP_HD_GETEMPLOYEEDETAILS = "SP_HD_GetEmployeedetails";
        const string SP_HD_GETUNDERUSERTYPES = "SP_HD_GetUnderUserTypes";
        //  const string SP_HD_GETUSERTYPE = "SP_HD_GetUserType";
        const string SP_hdGetDivisionsbyUser = "SP_hdGetDivisionsbyUser";
        const string SP_HD_GETREGIONBASEDONDIVISION = "SP_HD_GETREGIONBASEDONDIVISION";
        const string SP_HD_GETREPORTINGTOMANAGERBYREGION = "SP_HD_GetReportingtomanagerByRegion";
        const string SP_HD_GETREGIONBYSELECTEDREPORTINGREGION = "SP_HD_GetRegionByselectedReportingRegion";
        const string SP_HD_GETPROJECTMASTER = "SP_HD_GetProjectMaster";
        const string SP_HD_GETEXPENSEGROUPHEADERBYREGION = "SP_HD_GetExpenseGroupHeaderByRegion";
        const string SP_HDGETREGIONTREEDETAILS = "SP_hdGetRegionTreeDetails";
        const string SP_HD_GETACITIVITIESBYPOJECT = "SP_HD_GetAcitivitiesbyPoject";
        const string SP_HD_GETACTIVEREGION = "SP_hdGetChildRegions";
        const string SP_HDGETUSERS = "SP_hdGetChildUsers";
        const string SP_HD_GETEXPENSEGROUPHEADER = "SP_HD_GetExpenseGroupHeader";
        const string SP_HD_CHECKASSIGNUSERID = "SP_HD_CheckAssignUserId";
        const string SP_hdGetunderusers = "SP_hdGetunderusers";
        const string SP_HD_Edetailingdata = "SP_HD_Edetailingdata";
        const string SP_hdGetUserPrivilegeMappingfortp = "SP_hdGetUserPrivilegeMappingfortp";
        const string SP_hdGetUserPrivilegeMappingformail = "SP_hdGetUserPrivilegeMappingformail";
        const string SP_HD_GETDESIGNATIONSBASEDONDIVISION = "SP_HD_GetdesignationsbasedonDivision";
        const string Sp_Hd_GetEmailDetails = "Sp_Hd_GetEmailDetails";
        const string Sp_Hd_GetMailTemplates = "Sp_Hd_GetMailTemplates";
        const string SP_hdGetAllUserPrivilegeMappedformail = "SP_hdGetAllUserPrivilegeMappedformail";
        const string SP_hdGetManagerEmpnumberformail = "SP_hdGetManagerEmpnumberformail";

        const string SP_hdGetActualUserDetils = "SP_hdGetActualUserDetils";
        const string Sp_Hd_GetRegUsersforMail = "Sp_Hd_GetRegUsersforMail";
        //Leave Details
        const string SP_HD_GETLEAVETYPEBYUSERTYPE = "SP_HD_GetLeaveTypebyUserType";
        //Product Details
        const string SP_HD_GETUSERPRODUCTMAPPING = "SP_HD_GetUserProductMapping";
        //Notice Board Details
        const string SP_HD_CHECKVACANTORNOT = "SP_HD_CheckVacantorNot";
        const string SP_HD_GETNOTICEBOARDMESSAGEBYREGION = "SP_HD_GetNoticeboardMessagebyregion";
        const string SP_HD_GETNOTICEBOARDMESSAGEFORVACANTREGION = "SP_HD_GetNoticeboardmessageforvacantregion";
        const string SP_HD_GETNOTICEBOARDMESSAGEFORUNASSIGNEDREGION = "SP_HD_GetNoticeboardmessageforunassignedregion";
        //Splash Board Details
        const string SP_HD_Getsplashscreenmsg = "SP_HD_Getsplashscreenmsg";

        //Insert and Update
        const string SP_HD_USER_INSERTEMPLOYEEDETAILS = "SP_HD_USER_InsertEmployeeDetails";
        const string SP_HD_USER_INSERUSERDETAILS = "SP_HD_USER_InseruserDetails";
        const string SP_HD_USER_INSERTNOTICEBOARDMESSAGE = "SP_HD_USER_InsertNoticeBoardMessage";

        //Disable User
        const string SP_HD_GETCHILDUSER = "SP_Hd_UCW_GetchildUser";
        const string SP_HD_UCW_GETACTIVEREGIONTODISABLE = "SP_HD_UCW_GetActiveRegiontoDisable";
        const string SP_HD_UCW_GETEMPLOYEES = "SP_HD_UCW_GetEmployees";
        const string SP_HD_GETEMPLOYEENAMEBYUSERCODE = "SP_HD_GetEmployeeNamebyUsercode";
        const string SP_HD_GETEMPLOYEENAMEBYEMPLOYEECODE = "SP_HD_GetEmployeeNamebyEmployeeCode";
        const string SP_HD_GETEMPLOYEENAMEBYREGIONCODE = "SP_HD_GetEmployeeNamebyRegionCode";
        const string SP_HDGETCHILDUSERS = "SP_hdGetChildUsers";
        const string SP_HD_UPDATEUSERMASTER = "SP_HD_UpdateuserMaster";
        const string SP_HD_GETEMPLOYEEDETAILSBYUSERCODE = "SP_HD_GetEmployeedetailsbyUsercode";
        const string SP_HD_Getleafusers = "SP_HD_Getleafusers";
        const string SP_HD_Getresuserdivision = "SP_HD_Getresuserdivision";
        const string SP_HD_Getreportedusers = "SP_HD_Getreportedusers";
        const string SP_HD_INSERTDisableleafUsers = "SP_HD_INSERTDisableleafUsers";
        const string SP_HD_GetDCRLastentereddate = "SP_HD_GetDCRLastentereddate";
        //Hierarchy change
        const string SP_HD_GetUserlist = "SP_HD_GetUserlist";
        const string SP_HD_GetEmployeeDetailsforuser = "SP_HD_GetEmployeeDetailsforuser";
        const string SP_HD_GetUserDetails = "SP_HD_GetUserDetails";
        const string SP_HD_UpdateUserDetails = "SP_HD_UpdateUserDetails";
        const string SP_HD_getuserproductdetails = "SP_HD_getuserproductdetails";
        const string SP_HD_GetLeaveTypebyUserCode = "SP_HD_GetLeaveTypebyUserCode";
        const string SP_HD_GET_KANGLEUSERDETAILS = "SP_HD_GET_KangleUserDetails";
        const string SP_HD_GET_KANGLEEMPLOYEEDETAILS = "SP_HD_GET_KangleEmployeeDetails";

        const string SP_HD_InsertUserProductDetails = "SP_HD_InsertUserProductDetails";
        const string SP_HD_GetMinMaxConfig_In_UCW = "SP_HD_GetMinMaxConfig_In_UCW";

        #endregion constant string

        #region Public Methods

        #region Master Data
        /// <summary>
        /// Used to get Master Region
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.User_RegionMasterModel> GetRegionMaster(string companyCode)
        {
            IEnumerable<MVCModels.User_RegionMasterModel> lstRegion;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@RegionCode", _objCurInfo.GetRegionCode());
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstRegion = connection.Query<MVCModels.User_RegionMasterModel>(SP_HD_GETACTIVEREGION, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstRegion;
        }
        /// <summary>
        /// Used to Get All user
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.User_UserMasterModel> GetUserMaster(string companyCode)
        {
            IEnumerable<MVCModels.User_UserMasterModel> lstCust;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@UserCode", _objCurInfo.GetUserCode());
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstCust = connection.Query<MVCModels.User_UserMasterModel>(SP_HDGETUSERS, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstCust;
        }
        /// <summary>
        /// Used to get all user Types
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.User_UserTypeMasterModel> GetUserTypeMaster(string companyCode, string userTypeCode)
        {
            IEnumerable<MVCModels.User_UserTypeMasterModel> lstUserType;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@UserTypeCode", userTypeCode);
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstUserType = connection.Query<MVCModels.User_UserTypeMasterModel>(SP_HD_GETUNDERUSERTYPES, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstUserType;
        }
        /// <summary>
        /// Used to get all divisions
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.User_DivisionMasterModel> GetDivisions(string UserCode)
        {
            IEnumerable<MVCModels.User_DivisionMasterModel> lstDivisions;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@UserCode", UserCode);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstDivisions = connection.Query<MVCModels.User_DivisionMasterModel>(SP_hdGetDivisionsbyUser, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstDivisions;
        }
        /// <summary>
        /// Used to get all project 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.User_ProjectMaster> GetProjectMaster(string companyCode)
        {
            IEnumerable<MVCModels.User_ProjectMaster> lstProject;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstProject = connection.Query<MVCModels.User_ProjectMaster>(SP_HD_GETPROJECTMASTER, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstProject;
        }
        /// <summary>
        /// Used to get all Expense group header
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.User_ExpenseGroupHeaderModel> GetExpenseGroupHeader(string companyCode)
        {
            IEnumerable<MVCModels.User_ExpenseGroupHeaderModel> lstExpenseGroupHeader;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstExpenseGroupHeader = connection.Query<MVCModels.User_ExpenseGroupHeaderModel>(SP_HD_GETEXPENSEGROUPHEADER, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstExpenseGroupHeader;
        }
        /// <summary>
        /// Used to get All Employee
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.User_EmployeeModel> GetEmployeeMaster(string companyCode)
        {
            IEnumerable<MVCModels.User_EmployeeModel> lstEmployees;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstEmployees = connection.Query<MVCModels.User_EmployeeModel>(SP_HD_GETEMPLOYEE, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstEmployees;
        }
        #endregion Master Data
        #region Employee details
        /// <summary>
        /// Used to Get Regions By selected division
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="divisionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.RigionByDivisionModel> GetRegionbyDivision(string companyCode, string divisionCode)
        {
            IEnumerable<MVCModels.RigionByDivisionModel> lstRegionsbydivision;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@DivisionCode", divisionCode);
                // p.Add("@RegionCode", regionCode);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstRegionsbydivision = connection.Query<MVCModels.RigionByDivisionModel>(SP_HD_GETREGIONBASEDONDIVISION, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstRegionsbydivision;
        }
        /// <summary>
        /// Get Users by selected region
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.User_UserMasterModel> GetUserbyRegion(string companyCode, string regionCode)
        {
            IEnumerable<MVCModels.User_UserMasterModel> lstUsers;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@RegionCode", regionCode);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstUsers = connection.Query<MVCModels.User_UserMasterModel>(SP_HD_GETREPORTINGTOMANAGERBYREGION, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstUsers;
        }
        /// <summary>
        /// Get region by Seleted Region
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.User_RegionMasterModel> GetregionsByRegion(string companyCode, string regionCode)
        {
            IEnumerable<MVCModels.User_RegionMasterModel> lstUserregion;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@RegionCode", regionCode);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstUserregion = connection.Query<MVCModels.User_RegionMasterModel>(SP_HD_GETREGIONBYSELECTEDREPORTINGREGION, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstUserregion;
        }
        public IEnumerable<MVCModels.UnderUserModel> Getunderusers(string companyCode, string regionCode)
        {
            IEnumerable<MVCModels.UnderUserModel> lstunderusers;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@RegionCode", regionCode);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstunderusers = connection.Query<MVCModels.UnderUserModel>(SP_hdGetunderusers, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstunderusers;
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
            IEnumerable<MVCModels.User_ExpenseGroupHeaderModel> lstExpensebyregion;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@RegionCode", regionCode);
                p.Add("@UserTypeCode", userTypecode);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstExpensebyregion = connection.Query<MVCModels.User_ExpenseGroupHeaderModel>(SP_HD_GETEXPENSEGROUPHEADERBYREGION, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstExpensebyregion;
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
            IEnumerable<MVCModels.User_ActivityMasterModel> lstActivities;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@ProjectCode", projectCode);
                p.Add("@ActivityDate", activityDate);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstActivities = connection.Query<MVCModels.User_ActivityMasterModel>(SP_HD_GETACITIVITIESBYPOJECT, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstActivities;
        }
        /// <summary>
        /// Used to get Employee Detailss
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="employeeCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.User_Employeedetails> GetEmployeeDetails(string companyCode, string employeeCode)
        {
            IEnumerable<MVCModels.User_Employeedetails> lstEmpolyeedetails;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@EmployeeCode", employeeCode);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstEmpolyeedetails = connection.Query<MVCModels.User_Employeedetails>(SP_HD_GETEMPLOYEEDETAILS, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstEmpolyeedetails;
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
            int rowcount = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@UserName", userName);
                    p.Add("@UserCode", userCode);
                    p.Add("@EmployeeCode", employeeCode);
                    p.Add("@Result", 0, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>(SP_HD_CHECKASSIGNUSERID, p, commandType: CommandType.StoredProcedure);
                    rowcount = p.Get<int>("@Result");
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowcount;
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
            IEnumerable<MVCModels.User_LeaveTypeModel> lstLeaveTypes;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@UserTypeCode", userTypecode);
                p.Add("@EffectiveTodate", hiDoctorStartDate);
                p.Add("@doj", doj);
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstLeaveTypes = connection.Query<MVCModels.User_LeaveTypeModel>(SP_HD_GETLEAVETYPEBYUSERTYPE, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstLeaveTypes;
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
            IEnumerable<MVCModels.User_ProductModel> lstProducts;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@UserTypeCode", userTypeCode);
                p.Add("@DivisionCode", divisionCode);
                p.Add("@ProductName", productName);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstProducts = connection.Query<MVCModels.User_ProductModel>(SP_HD_GETUSERPRODUCTMAPPING, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstProducts;
        }
        #endregion Product Details
        #region NoticeBoard Details
        /// <summary>
        /// Check vacant or Not assigned or vacant
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public string CheckVacantorNot(string companyCode, string regionCode)
        {
            string result = string.Empty;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@RegionCode", regionCode);
                p.Add("@Result", "", DbType.String, ParameterDirection.Output);
                using (IDbConnection connection = IDbOpenConnection())
                {
                    connection.Query<string>(SP_HD_CHECKVACANTORNOT, p, commandType: CommandType.StoredProcedure);
                    result = p.Get<string>("@Result");
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return result;
        }
        /// <summary>
        /// Get Noticeboard message for region
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.User_NoticeBoard> GetNoticeBoardMessageByRegion(string companyCode, string noticeBoardmessage)
        {
            IEnumerable<MVCModels.User_NoticeBoard> lstNoticeboardMessage;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@messageName", noticeBoardmessage);
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstNoticeboardMessage = connection.Query<MVCModels.User_NoticeBoard>(SP_HD_GETNOTICEBOARDMESSAGEBYREGION, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstNoticeboardMessage;
        }
        public IEnumerable<MVCModels.Splash> GetSplashdetails(string companyCode, string splashmessage)
        {
            IEnumerable<MVCModels.Splash> lstsplash;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@Message", splashmessage);
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstsplash = connection.Query<MVCModels.Splash>(SP_HD_Getsplashscreenmsg, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstsplash;
        }
        /// <summary>
        /// Used to get vacant region notice board message
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.User_NoticeBoard> GetNoticeboardmessageforvacantRegion(string companyCode, string regionCode, string activeDate, string titleName)
        {
            IEnumerable<MVCModels.User_NoticeBoard> lstNoticeboardMessage;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@RegionCode", regionCode);
                p.Add("@CurrentDate", activeDate);
                p.Add("@titleName", titleName);
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstNoticeboardMessage = connection.Query<MVCModels.User_NoticeBoard>(SP_HD_GETNOTICEBOARDMESSAGEFORVACANTREGION, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstNoticeboardMessage;
        }
        /// <summary>
        /// Get notice board message for unassigned region
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="activeDate"></param>
        /// <param name="titleName"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.User_NoticeBoard> GetNoticeboardmessageforUnassignedRegion(string companyCode, string regionCode, string activeDate, string titleName, string reportingtousercode)
        {
            IEnumerable<MVCModels.User_NoticeBoard> lstNoticeboardMessage;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@RegionCode", regionCode);
                p.Add("@CurrentDate", activeDate);
                p.Add("@titleName", titleName);
                p.Add("@Reporting_User_Code", reportingtousercode);
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstNoticeboardMessage = connection.Query<MVCModels.User_NoticeBoard>(SP_HD_GETNOTICEBOARDMESSAGEFORUNASSIGNEDREGION, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstNoticeboardMessage;
        }
        #endregion NoticeBoard Details
        #region Create or Update the User
        /// <summary>
        /// Insert Employee Details
        /// </summary>
        /// <param name="lstEmployeedetails"></param>
        /// <returns></returns>
        public string InsertEmployeedetails(List<MVCModels.User_Employeedetails> lstEmployeedetails)
        {
            string result = string.Empty;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", lstEmployeedetails[0].Company_Code);
                    parameter.Add("@EmployeeName", lstEmployeedetails[0].Employee_Name);
                    parameter.Add("@Gender", lstEmployeedetails[0].Gender);
                    parameter.Add("@DateOfBirth", lstEmployeedetails[0].Date_of_birth);
                    parameter.Add("@Address", lstEmployeedetails[0].Address);
                    parameter.Add("@Phone", lstEmployeedetails[0].Phone);
                    parameter.Add("@Mobile", lstEmployeedetails[0].Mobile);
                    parameter.Add("@EmailId", lstEmployeedetails[0].Email_Id);
                    parameter.Add("@DateofJoining", lstEmployeedetails[0].Date_of_Joining);
                    parameter.Add("@EmployeeNumber", lstEmployeedetails[0].Employee_Number);
                    parameter.Add("@EDNProof", lstEmployeedetails[0].EDN_Proof);
                    parameter.Add("@SalaryProof", lstEmployeedetails[0].Salary_Proof);
                    parameter.Add("@ResumeGiven", lstEmployeedetails[0].Resume_Given);
                    parameter.Add("@ResignationSubmitted", lstEmployeedetails[0].Resignation_Submitted);
                    parameter.Add("@Appointed", lstEmployeedetails[0].Appointed);
                    parameter.Add("@SCBAccountNumber", lstEmployeedetails[0].SCB_Account_Number);
                    parameter.Add("@ICICIAccountNumber", lstEmployeedetails[0].ICICI_Account_Number);
                    parameter.Add("@PFNumber", lstEmployeedetails[0].PF_Number);
                    parameter.Add("@PANNumber", lstEmployeedetails[0].PAN_Number);

                    parameter.Add("@Prop_Date_of_Confirmation", lstEmployeedetails[0].Prop_Date_of_Confirmation);
                    //parameter.Add("@EmployeeEntityType", ParameterDirection.Input, SqlDbType.VarChar, 30, employeeEntityType);
                    parameter.Add("@EmployeeCode", lstEmployeedetails[0].Employee_Code);
                    parameter.Add("@Mode", lstEmployeedetails[0].Entry_Mode);
                    parameter.Add("@CreatedBy", lstEmployeedetails[0].Created_By);
                    parameter.Add("@Result", "", DbType.String, ParameterDirection.Output);
                    connection.Query<string>(SP_HD_USER_INSERTEMPLOYEEDETAILS, parameter, commandType: CommandType.StoredProcedure);
                    result = parameter.Get<string>("@Result");
                    connection.Close();
                    return result;

                }

            }
            catch (Exception ex)
            {
                return "FAILURE:";
            }
        }
        /// <summary>
        /// Delete Employee details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="employeeCode"></param>
        /// <returns></returns>
        public int DeleteEmployeeMasterDetails(string companyCode, string employeeCode)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    const string query = "DELETE FROM tbl_SFA_Employee_Master where Company_Code = @companyCode and Company_Code = @employeeCode";
                    rowsAffected = connection.Execute(query, new { companyCode = companyCode, employeeCode = employeeCode });
                    connection.Close();
                }
                return rowsAffected;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        /// <summary>
        /// Insert User Details
        /// </summary>
        /// <param name="lstuserdetails"></param>
        /// <returns></returns>
        public string InsertUserDetails(List<MVCModels.User_Employeedetails> lstuserdetails, int value, int TPLockvalue, string underuser, int SPLASHID, int EdetailingId, int DACode, string strGuid, string daCode)
        {
            string result = string.Empty;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", lstuserdetails[0].Company_Code);
                    parameter.Add("@UserCode", lstuserdetails[0].User_Code);
                    parameter.Add("@EmployeeCode", lstuserdetails[0].Employee_Code);
                    parameter.Add("@UserTypeCode", lstuserdetails[0].User_Type_Code);
                    parameter.Add("@UnderUserCode", lstuserdetails[0].Reporting_Manager_User_Code);
                    parameter.Add("@UserName", lstuserdetails[0].User_Name);
                    parameter.Add("@UserPass", lstuserdetails[0].User_Pass);
                    parameter.Add("@UserStatus", "1");
                    parameter.Add("@RegionCode", lstuserdetails[0].Region_Code);
                    parameter.Add("@UserDivisionCode", lstuserdetails[0].Division_Code);
                    parameter.Add("@ExpenseGroupId", lstuserdetails[0].Expense_Group_Id);
                    parameter.Add("@HiDOCTORStartDate", lstuserdetails[0].HiDOCTOR_Start_Date);
                    parameter.Add("@CreatedBy", lstuserdetails[0].Created_By);
                    parameter.Add("@IsKangleAccess", value);
                    parameter.Add("@TPLockvalue", TPLockvalue);
                    parameter.Add("@ReportingUser", underuser);
                    parameter.Add("@Splashid", SPLASHID);
                    parameter.Add("@EdetailingId", EdetailingId);
                    parameter.Add("@DACode", DACode);
                    parameter.Add("@strGuid", strGuid);
                    parameter.Add("@daCodelist", daCode);
                    parameter.Add("@RefKey1", lstuserdetails[0].RefKey1);
                    parameter.Add("@RefKey2", lstuserdetails[0].RefKey2);
                    parameter.Add("@ActualReporting", lstuserdetails[0].ActualReporting);
                    parameter.Add("@Result", "", DbType.String, ParameterDirection.Output);
                    connection.Query<string>(SP_HD_USER_INSERUSERDETAILS, parameter, commandType: CommandType.StoredProcedure);
                    result = parameter.Get<string>("@Result");
                    connection.Close();
                    return result;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        /// <summary>
        /// Delete user master details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns></returns>
        public int DeleteUserMasterDetails(string companyCode, string userCode)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    const string query = "DELETE FROM tbl_SFA_User_Master where Company_Code = @companyCode and User_Code = @userCode";
                    rowsAffected = connection.Execute(query, new { companyCode = companyCode, userCode = userCode });
                    connection.Close();
                }
                return rowsAffected;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        /// <summary>
        /// Insert Division Entity Mapping
        /// </summary>
        /// <param name="entityName"></param>
        /// <param name="companyCode"></param>
        /// <param name="divisionCode"></param>
        /// <param name="createdBy"></param>
        /// <param name="createdDate"></param>
        /// <returns></returns>
        public int InsertDivisionEntityMapping(string companyCode, string divisionCode, string userCode, string createdBy, string createdDate)
        {
            int rowsAffected = 0;
            string entityName = "USER";
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@Company_Code", companyCode);
                    parameter.Add("@Division_Code", divisionCode);
                    parameter.Add("@Entity_Code", userCode);
                    parameter.Add("@Created_By", createdBy);
                    parameter.Add("Created_Date", createdDate);

                    const string insertQry = "INSERT INTO tbl_SFA_Division_Entity_Mapping(Company_Code,Division_Code, Entity_Code,Entity_Type,Record_Status, " +
                                             "Created_By,Created_Date) " +
                                            "VALUES(@Company_Code, @Division_Code,@Entity_Code,'USER','1',@Created_By,@Created_Date)";

                    rowsAffected = connection.Execute(insertQry, parameter);

                    return rowsAffected;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("divisionCode", divisionCode);
                dicObj.Add("entity", entityName);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return 0;
            }
        }
        /// <summary>
        /// Delete Division Mapping Details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="divisionCode"></param>
        /// <param name="entityCode"></param>
        /// <returns></returns>
        public int DeletedDivisionEntityMapping(string companyCode, string divisionCode, string entityCode)
        {
            int rowsAffected = 0;
            try
            {
                var parameter = new DynamicParameters();
                parameter.Add("@Company_Code", companyCode);
                parameter.Add("@Entity_Code", entityCode);
                parameter.Add("@Division_Code", divisionCode);
                using (IDbConnection connection = IDbOpenConnection())
                {
                    const string deleteQuery = "DELETE FROM tbl_SFA_Division_Entity_Mapping WHERE Company_Code = @Company_Code AND Entity_Code = @Entity_Code AND Division_Code = @Division_Code AND Entity_Type ='USER'";
                    rowsAffected = connection.Execute(deleteQuery, parameter);
                }
                return rowsAffected;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        /// <summary>
        /// Insert Project details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="projectCode"></param>
        /// <returns></returns>
        public int InsertUserProjectDetails(string companyCode, string userCode, string projectCode, string effectivefrom)
        {
            int rowsAffected = 0;
            string endDate = "2099-12-31";
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@Company_Code", companyCode);
                    parameter.Add("User_Code", userCode);
                    parameter.Add("@Project_Code", projectCode);
                    parameter.Add("@Start_Date", effectivefrom);
                    parameter.Add("@End_Date", endDate);
                    const string query = "INSERT INTO tbl_SFA_User_Project_Mapping(Company_Code,Mapping_Code,Project_Code,User_Code,Start_Date,End_Date,Status)" +
                                            "VALUES(@Company_Code,NEXT VALUE FOR SEQ_tbl_SFA_User_Project_Mapping,@Project_Code,@User_Code,@Start_Date,@End_Date,'1')";
                    rowsAffected = connection.Execute(query, parameter);
                    connection.Close();
                }
                return rowsAffected;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        /// <summary>
        /// Delete User Project details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns></returns>
        public int DeleteUserProjectDetails(string companyCode, string userCode)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@Company_Code", companyCode);
                    parameter.Add("@User_Code", userCode);
                    const string deleteQuery = "DELETE FROM tbl_SFA_User_Project_Mapping WHERE Company_Code = @Company_Code AND User_Code = @User_Code";
                    rowsAffected = connection.Execute(deleteQuery, parameter);
                }
                return rowsAffected;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        /// <summary>
        /// Insert Leave Details
        /// </summary>
        /// <param name="lstLeavedetails"></param>
        /// <returns></returns>
        public int InsertLeaveDetails(List<MVCModels.User_LeaveTypeModel> lstLeavedetails)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    const string query = "INSERT INTO tbl_SFA_User_Leave_CurBalance(Company_Code,User_Leave_Code,User_Type_Code,User_Code,Leave_Type_Code,Opening_Balance,Leave_Balance,Leave_Eligible,Balance_CF,Lapsed,Leave_Taken,Effective_From,Effective_To,Is_Active,CurBalance_Updated_Date)" +
                                        " VALUES(@Company_Code,NEXT VALUE FOR SEQ_tbl_SFA_User_Leave_CurBalance,@User_Type_Code,@User_Code,@Leave_Type_Code,@Opening_Balance,case when @Leave_Balance=0 then null else @Leave_Balance end,@Leave_Eligible,'0','0','0',@Effective_From,@Effective_To,'0',GETDATE())";
                    rowsAffected = connection.Execute(query, lstLeavedetails);
                    connection.Close();
                }
                return rowsAffected;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        /// <summary>
        /// Delete Leave Details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns></returns>
        public int DeleteLeaveDetails(string companyCode, string userCode)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    const string query = "DELETE FROM tbl_SFA_User_Leave_CurBalance where Company_Code = @companyCode and User_Code = @userCode";
                    rowsAffected = connection.Execute(query, new { companyCode = companyCode, userCode = userCode });
                    connection.Close();
                }
                return rowsAffected;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        /// <summary>
        /// Insert Product Details
        /// </summary>
        /// <param name="lstProductdetails"></param>
        /// <returns></returns>
        public int InsertProductDetails(DataTable dtUserProduct)
        {
            int rowsAffected = 0;
            try
            {
                _objSPData = new SPData();
                _objData = new DataControl.Data();
                {
                    string cmdTxt = SP_HD_InsertUserProductDetails;
                    SqlCommand command = new SqlCommand(cmdTxt);
                    command.CommandType = CommandType.StoredProcedure;

                    if (dtUserProduct == null || dtUserProduct.Rows.Count == 0)
                    {

                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_InsertUserProducts", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_InsertUserProducts");
                    }
                    else
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_InsertUserProducts", ParameterDirection.Input, SqlDbType.Structured, dtUserProduct, "TVP_InsertUserProducts");
                    }
                    _objSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.Int, 100, "");


                    _objData.OpenConnection();
                    _objData.ExecuteNonQuery(command);
                    rowsAffected = Convert.ToInt32(command.Parameters["@Result"].Value);
                }
                return rowsAffected;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        /// <summary>
        /// Delete user Product Details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns></returns>
        public int DeleteUserProductDetails(string companyCode, string userCode)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    const string query = "DELETE FROM tbl_SFA_User_Product where Company_Code = @companyCode and User_Code = @userCode";
                    rowsAffected = connection.Execute(query, new { companyCode = companyCode, userCode = userCode });
                    connection.Close();
                }
                return rowsAffected;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        /// <summary>
        /// Insert NoticeBoard details
        /// </summary>
        /// <param name="lstNoticeBoard"></param>
        /// <returns></returns>
        public int InsertNoticeBoardDetails(List<MVCModels.User_NoticeBoard> lstNoticeBoard)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    const string insertQuery = "INSERT INTO tbl_SFA_Noticeboard_Agent(Company_Code,Msg_Code,Target_UserCode,IsRead,Project_Code)" +
                                               "VALUES (@Company_Code,@Msg_Code,@User_Code,'N','NOTICE')";
                    rowsAffected = connection.Execute(insertQuery, lstNoticeBoard);
                    connection.Close();
                }
                return rowsAffected;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }


        /// <summary>
        /// Delete Notice board details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns></returns>
        public int DeleteNoticeBoardDetails(string companyCode, string userCode)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    const string query = "DELETE FROM tbl_SFA_Noticeboard_Agent WHERE Company_Code = @companyCode and User_Code = @userCode";
                    rowsAffected = connection.Execute(query, new { companyCode = companyCode, userCode = userCode });
                    connection.Close();
                }
                return rowsAffected;
            }
            catch (Exception ex)
            {
                throw ex;
            }
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
            IEnumerable<MVCModels.User_UserMasterModel> lstCust;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@UserCode", userCode);
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstCust = connection.Query<MVCModels.User_UserMasterModel>(SP_HD_GETCHILDUSER, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstCust;
        }
        /// <summary>
        /// Get active region to disable
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.User_RegionMasterModel> GetRegiontoDisable(string companyCode, string regionCode)
        {
            IEnumerable<MVCModels.User_RegionMasterModel> lstRegion;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@RegionCode", regionCode);
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstRegion = connection.Query<MVCModels.User_RegionMasterModel>(SP_HD_UCW_GETACTIVEREGIONTODISABLE, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstRegion;
        }
        /// <summary>
        /// Get employee no by usercode
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.EmployeeModel> GetEmployeeNumbertoDisable(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.EmployeeModel> lstEmployeemodel;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@UserCode", userCode);
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstEmployeemodel = connection.Query<MVCModels.HiDoctor_Master.EmployeeModel>(SP_HD_UCW_GETEMPLOYEES, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstEmployeemodel;
        }
        /// <summary>
        /// Get Employee details by usercode
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.Disable_Emloyeedetails> GetEmployeeNamebyUserCode(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.Disable_Emloyeedetails> lstEmployeeName;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@UserCode", userCode);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstEmployeeName = connection.Query<MVCModels.Disable_Emloyeedetails>(SP_HD_GETEMPLOYEENAMEBYUSERCODE, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstEmployeeName;
        }
        /// <summary>
        /// Get Employee details by regioncode
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.Disable_Emloyeedetails> GetEmployeeNamebyRegionCode(string companyCode, string regionCode)
        {
            IEnumerable<MVCModels.Disable_Emloyeedetails> lstEmployeeName;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@RegionCode", regionCode);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstEmployeeName = connection.Query<MVCModels.Disable_Emloyeedetails>(SP_HD_GETEMPLOYEENAMEBYREGIONCODE, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstEmployeeName;
        }
        /// <summary>
        /// Get Employee details by employeecode
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="employeeCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.Disable_Emloyeedetails> GetEmployeeNamebyEmployeeCode(string companyCode, string employeeCode)
        {
            IEnumerable<MVCModels.Disable_Emloyeedetails> lstEmployeeName;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@EmployeeNmber", employeeCode);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstEmployeeName = connection.Query<MVCModels.Disable_Emloyeedetails>(SP_HD_GETEMPLOYEENAMEBYEMPLOYEECODE, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstEmployeeName;
        }
        public IEnumerable<MVCModels.Disable_Emloyeedetails> GetChildUsers(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.Disable_Emloyeedetails> lstEmployeeName;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@UserCode", userCode);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstEmployeeName = connection.Query<MVCModels.Disable_Emloyeedetails>(SP_HDGETCHILDUSERS, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstEmployeeName;
        }
        /// <summary>
        /// Get employee details by employeecode
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="employeeCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.User_Employeedetails> GetEmployeeDetailsByempoyeeCode(string companyCode, string employeeCode)
        {
            IEnumerable<MVCModels.User_Employeedetails> lstEmpolyeedetails;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@EmployeeCode", employeeCode);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstEmpolyeedetails = connection.Query<MVCModels.User_Employeedetails>(SP_HD_GETEMPLOYEEDETAILSBYUSERCODE, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstEmpolyeedetails;
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
            string result = string.Empty;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@UserCode", userCode);
                    parameter.Add("@UpdatedBy", updateBy);
                    parameter.Add("@Disabledate", disableDate);
                    parameter.Add("@Remarks", Remarks);
                    parameter.Add("@Result", "", DbType.String, ParameterDirection.Output);
                    connection.Query<string>(SP_HD_UPDATEUSERMASTER, parameter, commandType: CommandType.StoredProcedure);
                    result = parameter.Get<string>("@Result");
                    return result;
                    connection.Close();
                }

            }
            catch (Exception ex)
            {
                return "FAILURE:";
            }
        }
        public IEnumerable<MVCModels.UnderUserModel> Getleafusers(string UserCode)
        {
            IEnumerable<MVCModels.UnderUserModel> lstRegion;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@UserCode", UserCode);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstRegion = connection.Query<MVCModels.UnderUserModel>(SP_HD_Getleafusers, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstRegion;
        }
        public List<MVCModels.UserDivisions> Getresuserdivision(string CompanyCode, string UserCode)
        {
            List<MVCModels.UserDivisions> lstReported;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", CompanyCode);
                p.Add("@UserCode", UserCode);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstReported = connection.Query<MVCModels.UserDivisions>(SP_HD_Getresuserdivision, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstReported;
        }
        public List<MVCModels.ReportedUser> GetReportedMangers(string CompanyCode, string UserCode, string loginUserCode)
        {
            List<MVCModels.ReportedUser> lstReported;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", CompanyCode);
                p.Add("@UserCode", UserCode);
                p.Add("@CurrentUserCode", loginUserCode);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstReported = connection.Query<MVCModels.ReportedUser>(SP_HD_Getreportedusers, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstReported;
        }

        public bool Insertleafuser(string companyCode, List<MVCModels.Reportuserhierarchy> lstuserdisable, DataTable dtdisable)
        {
            _objSPData = new SPData();
            bool result = false;
            _objData = new Data();
            string cmdText = string.Empty;
            try
            {
                cmdText = SP_HD_INSERTDisableleafUsers;
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                if (lstuserdisable == null)
                {

                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Disablehierarchy", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_Disablehierarchy");

                }
                else if (lstuserdisable.Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Disablehierarchy", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_Disablehierarchy");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Disablehierarchy", ParameterDirection.Input, SqlDbType.Structured, dtdisable, "TVP_Disablehierarchy");
                }


                //SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                //returnValue.Direction = ParameterDirection.Output;
                //returnValue.Size = 500;
                //command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                result = true;
                //string result = returnValue.Value.ToString();

            }
            catch (Exception ex)
            {

                throw ex;
            }
            return result;
        }


        public List<MVCModels.DCRDATE> GetDCRdate(string UserCode)
        {
            List<MVCModels.DCRDATE> lstReported;
            try
            {
                DynamicParameters p = new DynamicParameters();

                p.Add("@UserCode", UserCode);


                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstReported = connection.Query<MVCModels.DCRDATE>(SP_HD_GetDCRLastentereddate, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstReported;
        }
        #endregion Disable User
        public List<MVCModels.UnderUserModel> GetUsers(string CompanyCode)
        {
            List<MVCModels.UnderUserModel> lstusers;
            try
            {
                DynamicParameters p = new DynamicParameters();

                p.Add("@CompanyCode", CompanyCode);


                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstusers = connection.Query<MVCModels.UnderUserModel>(SP_HD_GetUserlist, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstusers;
        }
        public List<MVCModels.Employee> Getempcode(string UserCode)
        {
            List<MVCModels.Employee> lstusers;
            try
            {
                DynamicParameters p = new DynamicParameters();

                p.Add("@UserCode", UserCode);


                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstusers = connection.Query<MVCModels.Employee>(SP_HD_GetEmployeeDetailsforuser, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstusers;
        }
        public List<MVCModels.UserDetails> Getuserdetails(string UserCode)
        {
            List<MVCModels.UserDetails> lstusers;
            try
            {
                DynamicParameters p = new DynamicParameters();

                p.Add("@UserCode", UserCode);


                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstusers = connection.Query<MVCModels.UserDetails>(SP_HD_GetUserDetails, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstusers;
        }
        public int UpdateUserDetails(string UserCode, string RegionCode, string UserTypeCode, string UnderUserCode, string UserDivisionCode, int ExpenseId, string Effectivefrom, int Effective, string RefKey1, string RefKey2, string ActulReporting)
        {
            int val = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    DynamicParameters p = new DynamicParameters();

                    p.Add("@UserCode", UserCode);
                    p.Add("@Region_Code", RegionCode);
                    p.Add("@User_Type_Code", UserTypeCode);
                    p.Add("@Under_User_Code", UnderUserCode);
                    p.Add("@User_Division_Code", UserDivisionCode);
                    p.Add("@Expense_Group_Id", ExpenseId);
                    p.Add("@Effectivefrom", Effectivefrom);
                    p.Add("@Effective", Effective);
                    p.Add("@RefKey1", RefKey1);
                    p.Add("@RefKey2", RefKey2);
                    p.Add("@ActulReporting", ActulReporting);
                    p.Add("@Result", 0, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>(SP_HD_UpdateUserDetails, p, commandType: CommandType.StoredProcedure);
                    val = p.Get<int>("@Result");
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return val;
        }

        public int InsertLeaveuserDetails(List<MVCModels.User_LeaveTypeModel> lstLeavedetails)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    const string query = "INSERT INTO tbl_SFA_User_Leave_CurBalance(Company_Code,User_Leave_Code,User_Type_Code,User_Code,Leave_Type_Code,Opening_Balance,Leave_Balance,Leave_Eligible,Balance_CF,Lapsed,Leave_Taken,Effective_From,Is_Active)" +
                                        " VALUES(@Company_Code,NEXT VALUE FOR SEQ_tbl_SFA_User_Leave_CurBalance,@User_Type_Code,@User_Code,@Leave_Type_Code,@Opening_Balance,case when @Leave_Balance=0 then null else @Leave_Balance end,@Leave_Eligible,'0','0','0',@Effective_From,'1')";
                    rowsAffected = connection.Execute(query, lstLeavedetails);
                    connection.Close();
                }
                return rowsAffected;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        SPData _ObjSPData = new SPData();
        private Data _OjData = new Data();
        public string InsertProductuserDetails(List<MVCModels.User_ProductModel> lstProductdetails)
        {
            string result = "";
            //  List<MVCModels.User_ProductModel> lstproducts = new List<MVCModels.User_ProductModel>();
            //int rowsAffected1 = 0;
            //int rowsAffected2 = 0;
            // int rowsAffected3 = 0;
            List<MVCModels.User_ProductModel> lstProductMap;
            List<MVCModels.User_ProductModel> lstProductUnMap;

            lstProductMap = lstProductdetails.AsEnumerable().Where(n => n.Product_Code.Split('_').Length <= 1).ToList<User_ProductModel>();
            lstProductUnMap = lstProductdetails.AsEnumerable().Where(n => n.Product_Code.Split('_').Length > 1).ToList<User_ProductModel>();

            foreach (User_ProductModel item in lstProductUnMap)
            {
                item.Product_Code = item.Product_Code.Split('_')[1];
            }

            DataTable dtProductMap = new DataTable();
            dtProductMap.Columns.Add("Company_Code", typeof(string));
            dtProductMap.Columns.Add("Product_Code", typeof(string));
            dtProductMap.Columns.Add("Product_Name", typeof(string));
            dtProductMap.Columns.Add("Product_Type", typeof(string));
            dtProductMap.Columns.Add("Product_Type_Name", typeof(string));
            dtProductMap.Columns.Add("Current_Stock", typeof(int));
            dtProductMap.Columns.Add("Effective_From", typeof(DateTime));
            dtProductMap.Columns.Add("User_Code", typeof(string));
            dtProductMap.Columns.Add("User_Product_Status", typeof(char));
            dtProductMap.Columns.Add("Min_Count", typeof(int));
            dtProductMap.Columns.Add("Max_Count", typeof(int));

            DataTable dtProductUnMap = dtProductMap.Clone();

            if (lstProductMap.Count >= 1)
            {
                for (int i = 0; i < lstProductMap.Count; i++)
                {
                    dtProductMap.Rows.Add(lstProductMap[i].Company_Code, lstProductMap[i].Product_Code, lstProductMap[i].Product_Name,
                        lstProductMap[i].Product_Type, lstProductMap[i].Product_Type_Name, lstProductMap[i].Current_Stock, lstProductMap[i].Effective_From, lstProductMap[i].User_Code, lstProductMap[i].User_Product_Status, lstProductMap[i].Min_Count, lstProductMap[i].Max_Count);
                }
            }

            if (lstProductUnMap.Count >= 1)
            {
                for (int i = 0; i < lstProductUnMap.Count; i++)
                {
                    dtProductUnMap.Rows.Add(lstProductUnMap[i].Company_Code, lstProductUnMap[i].Product_Code, lstProductUnMap[i].Product_Name,
                        lstProductUnMap[i].Product_Type, lstProductUnMap[i].Product_Type_Name, lstProductUnMap[i].Current_Stock, lstProductUnMap[i].Effective_From, lstProductUnMap[i].User_Code, lstProductUnMap[i].User_Product_Status, lstProductUnMap[i].Min_Count, lstProductUnMap[i].Max_Count);
                }
            }

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    string cmdTxt = "SP_HD_GET_UserProductMapping";
                    SqlCommand command = new SqlCommand(cmdTxt);
                    command.CommandType = CommandType.StoredProcedure;
                    _ObjSPData.AddParamToSqlCommandWithTypeName(command, "@UserProductMap", ParameterDirection.Input, SqlDbType.Structured, dtProductMap, "UserProductTVP");
                    _ObjSPData.AddParamToSqlCommandWithTypeName(command, "@UserProductUnMap", ParameterDirection.Input, SqlDbType.Structured, dtProductUnMap, "UserProductTVP");
                    _OjData.OpenConnection();
                    result = _OjData.ExecuteScalar(command).ToString();
                    return result;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        public List<MVCModels.Product> GetProduct(string UserCode)
        {
            List<MVCModels.Product> lstusers;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@UserCode", UserCode);
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstusers = connection.Query<MVCModels.Product>(SP_HD_getuserproductdetails, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstusers;
        }
        public IEnumerable<MVCModels.User_LeaveTypeModel> GetLeaveTypebyUserCode(string companyCode, string UserCode, string userTypecode, string effectiveTo, string newusertypecode)
        {
            IEnumerable<MVCModels.User_LeaveTypeModel> lstLeaveTypes;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@UserCode", UserCode);
                p.Add("@UserTypeCode", userTypecode);
                p.Add("@EffectiveTodate", effectiveTo);
                p.Add("@NewUserTypeCode", newusertypecode);
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstLeaveTypes = connection.Query<MVCModels.User_LeaveTypeModel>(SP_HD_GetLeaveTypebyUserCode, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstLeaveTypes;
        }
        public IEnumerable<MVCModels.User_ProductModel> GetProductsbyDivisionuser(string companyCode, string UserCode, string userTypeCode, string divisionCode, string productName)
        {
            IEnumerable<MVCModels.User_ProductModel> lstProducts;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@UserTypeCode", userTypeCode);
                p.Add("@DivisionCode", divisionCode);
                p.Add("@UserCode", UserCode);
                p.Add("@ProductName", productName);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstProducts = connection.Query<MVCModels.User_ProductModel>(SP_HD_getuserproductdetails, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstProducts;
        }
        public IEnumerable<MVCModels.Edetailing> GetEdetailingdata(string companyCode, string message)
        {
            IEnumerable<MVCModels.Edetailing> lstProducts;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@message", message);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstProducts = connection.Query<MVCModels.Edetailing>(SP_HD_Edetailingdata, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstProducts;
        }
        public IEnumerable<MVCModels.Privilege> GetPriviligevalue(string companyCode, string Usertypecode)
        {
            IEnumerable<MVCModels.Privilege> lstProducts;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@userTypeCode", Usertypecode);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstProducts = connection.Query<MVCModels.Privilege>(SP_hdGetUserPrivilegeMappingfortp, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstProducts;
        }
        public IEnumerable<MVCModels.Privilege> GetMailPriviligevalue(string companyCode, string Usertypecode)
        {
            IEnumerable<MVCModels.Privilege> lstProducts;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@userTypeCode", Usertypecode);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstProducts = connection.Query<MVCModels.Privilege>(SP_hdGetUserPrivilegeMappingformail, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstProducts;
        }

        public KangleUserDetails GetKangleUserDetails(string companyCode, string UserCode)
        {
            KangleUserDetails UserDetails;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@Company_Code", companyCode);
                p.Add("@User_Code", UserCode);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    UserDetails = connection.Query<MVCModels.KangleUserDetails>(SP_HD_GET_KANGLEUSERDETAILS, p, commandType: CommandType.StoredProcedure).ToList<KangleUserDetails>()[0];
                    connection.Close();
                }
                return UserDetails;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        public kangleEmployeeDetails GetKangleEmployeeDetails(string companyCode, string UserCode)
        {
            kangleEmployeeDetails EmployeeDetails;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@Company_Code", companyCode);
                p.Add("@User_Code", UserCode);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    EmployeeDetails = connection.Query<MVCModels.kangleEmployeeDetails>(SP_HD_GET_KANGLEEMPLOYEEDETAILS, p, commandType: CommandType.StoredProcedure).ToList<kangleEmployeeDetails>()[0];
                    connection.Close();
                }
                return EmployeeDetails;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        #endregion Public Methods

        public IEnumerable<MVCModels.DesignationByDivisionModel> GetDesignationbyDivision(string companyCode, string divisionCode)
        {
            IEnumerable<MVCModels.DesignationByDivisionModel> lstDesignationbydivision;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@DivisionCode", divisionCode);
                // p.Add("@RegionCode", regionCode);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstDesignationbydivision = connection.Query<MVCModels.DesignationByDivisionModel>(SP_HD_GETDESIGNATIONSBASEDONDIVISION, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstDesignationbydivision;
        }

        public string GetMinMaxConfig(string Company_Code)
        {
            string result = string.Empty;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@Company_Code", Company_Code);
                p.Add("@Result", "", DbType.String, ParameterDirection.Output);
                using (IDbConnection connection = IDbOpenConnection())
                {
                    connection.Query<string>(SP_HD_GetMinMaxConfig_In_UCW, p, commandType: CommandType.StoredProcedure);
                    result = p.Get<string>("@Result");
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }
        public IEnumerable<MVCModels.Email> GetCompanyEmail()
        {
            IEnumerable<MVCModels.Email> lstEmaildets;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstEmaildets = connection.Query<MVCModels.Email>(Sp_Hd_GetEmailDetails, null, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstEmaildets;
        }

        public IEnumerable<MVCModels.CCUsers> GetParentHierarchyByRegion(string RegionCode)
        {
            IEnumerable<MVCModels.CCUsers> lstCCdets;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@RegionCode", RegionCode);
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstCCdets = connection.Query<MVCModels.CCUsers>(Sp_Hd_GetRegUsersforMail, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstCCdets;
        }

        public IEnumerable<MVCModels.MailTemplates> GetMailTemplates()
        {
            IEnumerable<MVCModels.MailTemplates> lstEmaildets;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstEmaildets = connection.Query<MVCModels.MailTemplates>(Sp_Hd_GetMailTemplates, null, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstEmaildets;
        }

        public IEnumerable<MVCModels.UserPrivilege> GetAllMailPriviligevalue(string companyCode)
        {
            IEnumerable<MVCModels.UserPrivilege> lstProducts;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstProducts = connection.Query<MVCModels.UserPrivilege>(SP_hdGetAllUserPrivilegeMappedformail, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstProducts;
        }

        public IEnumerable<MVCModels.Empdet> GetManagerEmpnumber(string UserCode)
        {
            IEnumerable<MVCModels.Empdet> lstProducts;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@UserCode", UserCode);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstProducts = connection.Query<MVCModels.Empdet>(SP_hdGetManagerEmpnumberformail, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstProducts;
        }
        public List<MVCModels.ActualUser> GetActuluser(string companyCode, string divisionCode)
        {
            List<MVCModels.ActualUser> lstusers;
            try
            {
                DynamicParameters p = new DynamicParameters();

                p.Add("@companyCode", companyCode);
                p.Add("@divisionCode", divisionCode);


                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstusers = connection.Query<MVCModels.ActualUser>(SP_hdGetActualUserDetils, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstusers;
        }

        //public IEnumerable<MVCModels.ActualUser> GetActuluser(string CompanyCode)
        //{
        //    IEnumerable<MVCModels.ActualUser> lstProducts;
        //    try
        //    {
        //        DynamicParameters p = new DynamicParameters();
        //        p.Add("@CompanyCode ", CompanyCode);

        //        using (IDbConnection connection = IDbOpenConnection())
        //        {
        //            lstProducts = connection.Query<MVCModels.ActualUser>(SP_hdGetActualUserDetils, p, commandType: CommandType.StoredProcedure);
        //            connection.Close();
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //    return lstProducts;
        //}
    }
}
