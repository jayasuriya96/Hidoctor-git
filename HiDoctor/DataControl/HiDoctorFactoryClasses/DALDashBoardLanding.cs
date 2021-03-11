using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using Dapper;
using MVCModels;

namespace DataControl.HiDoctorFactoryClasses
{
    public class DALDashBoardLanding : DapperRepository
    {
        private string _companyCode = "";
        public DALDashBoardLanding(string companyCode)
        {
            this._companyCode = companyCode;
        }

        #region SP NAMES
        const string SP_HDGETLANDINGPAGEAPPROVALPENDINGCOUNT = "SP_HdGetLandingPageApprovalPendingCount";
        const string SP_HDGETLANDINGPAGETEAMPENDINGUSERLIST = "SP_HDGetLandingPageTeamPendingUserList";
        const string USP_HD_GETLANDINGPAGEUNAPPROVECOUNT = "usp_hd_GetLandingPageUnapproveCount";
        const string USP_HD_GETPENDINGNOTIFICATIONS = "usp_hd_GetPendingNotifications";
        const string USP_HD_GETCHILDIMMEDIATEUSERCOUNT = "usp_hd_GetChildImmediateUserCount";
        const string Usp_hd_UserRegion_HolidayList = "Usp_hd_UserRegion_HolidayList";
        const string Usp_hd_Employee_BirthdayList = "Usp_hd_Employee_BirthdayList";
        const string Usp_hd_Doctor_BirthdayList = "SP_hdGetDocBirthdayforchildUser";
        const string SP_hdGetDocAnniversaryforchildUser = "SP_hdGetDocAnniversaryforchildUser";
        const string Usp_hd_getholidayandbirthdaycount = "Usp_hd_getholidayandbirthdaycount";

        // Unapprove list
        const string USP_HD_GETMYREJECTEDEXPENSECLAIMS = "usp_hd_GetMyRejectedExpenseClaims";
        const string USP_HD_GETTPLIST = "usp_hd_GetTPList";
        const string USP_HD_GETTPLIST_APPROVAL = "usp_hd_GetTPList_Approval";
        const string USP_HD_GETMYDCRLIST = "usp_hd_GetMyDCRList";
        const string USP_HD_GETMYEXPENSECLAIMS = "usp_hd_GetMyExpenseClaims";
        const string Sp_HDGetDCRApprovalMenuAccess = "Sp_HDGetDCRApprovalMenuAccessList";
        const string Sp_HDGetTPApprovalMenuAccess = "Sp_HDGetTPApprovalMenuAccessList";

        //Lock List
        const string SP_HD_GetLockDetils = "SP_HD_GetLockDetils";
        #endregion SP NAMES


        public int GetImmediateChildUserCount(string userCode)
        {
            int result = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", _companyCode);
                    p.Add("@UserCode", userCode);
                    p.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output);

                    connection.Execute(USP_HD_GETCHILDIMMEDIATEUSERCOUNT, p, commandType: CommandType.StoredProcedure);
                    result = p.Get<int>("@Result");
                }

                return result;
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }


        public List<DashBoardLanding.DCRDetails> GetMyAppliedDCR(string userCode, int status)
        {
            List<DashBoardLanding.DCRDetails> MyDCRList = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", _companyCode);
                    p.Add("@UserCode", userCode);
                    p.Add("@DCRStatus", status);
                    MyDCRList = connection.Query<DashBoardLanding.DCRDetails>(USP_HD_GETMYDCRLIST, p, commandType: CommandType.StoredProcedure).ToList();
                    return MyDCRList;
                }
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public List<DashBoardLanding.TPDetails> GetMyAppliedTP(string userCode, int status, int tptype)
        {
            List<DashBoardLanding.TPDetails> MyTPList = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", _companyCode);
                    p.Add("@UserCode", userCode);
                    p.Add("@TPStatus", status);
                    p.Add("@TPType", tptype);
                    MyTPList = connection.Query<DashBoardLanding.TPDetails>(USP_HD_GETTPLIST_APPROVAL, p, commandType: CommandType.StoredProcedure).ToList();
                    return MyTPList;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<DashBoardLanding.ExpenseClaimDetails> GetMyAppliedExpenseClaims(string userCode)
        {
            List<DashBoardLanding.ExpenseClaimDetails> MyExpenseClaimList = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", _companyCode);
                    p.Add("@UserCode", userCode);
                    MyExpenseClaimList = connection.Query<DashBoardLanding.ExpenseClaimDetails>(USP_HD_GETMYEXPENSECLAIMS, p, commandType: CommandType.StoredProcedure).ToList();
                    return MyExpenseClaimList;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int GetPendingApprovalCountForTeam(string userCode, string entity)
        {
            int result = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", _companyCode);
                    p.Add("@UserCode", userCode);
                    p.Add("@Entity", entity);
                    p.Add("@Result", 0, dbType: DbType.Int32, direction: ParameterDirection.Output);
                    connection.Query<int>(SP_HDGETLANDINGPAGEAPPROVALPENDINGCOUNT, p, commandType: CommandType.StoredProcedure);
                    result = p.Get<int>("@Result");
                }
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<DashBoardLanding.DCRApprovalMenuAccess> GetDCRApprovalMenuAccessList(string userTypeCode)
        {
            List<DashBoardLanding.DCRApprovalMenuAccess> lstUserMenuAccess = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    //p.Add("@CompanyCode", _companyCode);
                    p.Add("@UserTypeCode", userTypeCode);
                    lstUserMenuAccess = connection.Query<DashBoardLanding.DCRApprovalMenuAccess>(Sp_HDGetDCRApprovalMenuAccess, p, commandType: CommandType.StoredProcedure).ToList();
                    return lstUserMenuAccess;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<DashBoardLanding.DCRApprovalMenuAccess> GetTPApprovalMenuAccessList(string userTypeCode)
        {
            List<DashBoardLanding.DCRApprovalMenuAccess> lstUserMenuAccess = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    //p.Add("@CompanyCode", _companyCode);
                    p.Add("@UserTypeCode", userTypeCode);
                    lstUserMenuAccess = connection.Query<DashBoardLanding.DCRApprovalMenuAccess>(Sp_HDGetTPApprovalMenuAccess, p, commandType: CommandType.StoredProcedure).ToList();
                    return lstUserMenuAccess;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<DashBoardLanding.DCRPendingApprovalUsers> GetPendingApprovalUserList(string userCode, string entity)
        {
            List<DashBoardLanding.DCRPendingApprovalUsers> lstPendingUserlist = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", _companyCode);
                    p.Add("@UserCode", userCode);
                    p.Add("@Entity", entity);
                    lstPendingUserlist = connection.Query<DashBoardLanding.DCRPendingApprovalUsers>(SP_HDGETLANDINGPAGETEAMPENDINGUSERLIST, p, commandType: CommandType.StoredProcedure).ToList();
                    return lstPendingUserlist;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<DashBoardLanding.TPPendingApprovalPending> GetTPApprovalPending(string companyCode, string userCode)
        {
            List<DashBoardLanding.TPPendingApprovalPending> lstDash = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@UserCode", userCode);
                    p.Add("@Entity", "TP");
                    lstDash = connection.Query<DashBoardLanding.TPPendingApprovalPending>(SP_HDGETLANDINGPAGETEAMPENDINGUSERLIST, p, commandType: CommandType.StoredProcedure).ToList();
                    return lstDash;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int GetUnapproveCount(string userCode, string regionCode, string entity)
        {
            int result = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", _companyCode);
                    p.Add("@UserCode", userCode);
                    p.Add("@RegionCode", userCode);
                    p.Add("@Entity", entity);
                    p.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output);

                    connection.Execute(USP_HD_GETLANDINGPAGEUNAPPROVECOUNT, p, commandType: CommandType.StoredProcedure);
                    result = p.Get<int>("@Result");
                }

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Retrieve the pending Messages and Noticeboard items count.
        /// </summary>
        /// <param name="userCode"></param>
        /// <param name="entity"></param>
        /// <returns>int</returns>
        public int GetPendingNotifications(string userCode, string entity)
        {
            int result = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", _companyCode);
                    p.Add("@UserCode", userCode);
                    p.Add("@Entity", entity);
                    p.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output);

                    connection.Execute(USP_HD_GETPENDINGNOTIFICATIONS, p, commandType: CommandType.StoredProcedure);
                    result = p.Get<int>("@Result");
                }

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<DashBoardLanding.DCRDetails> GetUnapproveDCR(string userCode, int status)
        {
            List<DashBoardLanding.DCRDetails> unapproveDCRList = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", _companyCode);
                    p.Add("@UserCode", userCode);
                    p.Add("@DCRStatus", status);

                    unapproveDCRList = connection.Query<DashBoardLanding.DCRDetails>(USP_HD_GETMYDCRLIST, p, commandType: CommandType.StoredProcedure).ToList();
                    return unapproveDCRList;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<DashBoardLanding.TPDetails> GetUnapproveTP(string userCode, int status)
        {
            List<DashBoardLanding.TPDetails> unapproveTPList = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", _companyCode);
                    p.Add("@UserCode", userCode);
                    p.Add("@TPStatus", status);

                    unapproveTPList = connection.Query<DashBoardLanding.TPDetails>(USP_HD_GETTPLIST, p, commandType: CommandType.StoredProcedure).ToList();
                    return unapproveTPList;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<DashBoardLanding.ExpenseClaimDetails> GetUnapproveExpenseClaim(string userCode)
        {
            List<DashBoardLanding.ExpenseClaimDetails> unapproveExpenseClaimList = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", _companyCode);
                    p.Add("@UserCode", userCode);

                    unapproveExpenseClaimList = connection.Query<DashBoardLanding.ExpenseClaimDetails>(USP_HD_GETMYREJECTEDEXPENSECLAIMS, p, commandType: CommandType.StoredProcedure).ToList();
                    return unapproveExpenseClaimList;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public DashBoardLanding.HolidayHistory GetUserRegionholidays(string regionCode)
        {
            DashBoardLanding.HolidayHistory lstRegHoliday = new DashBoardLanding.HolidayHistory();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@RegionCode", regionCode);
                    var multiselect = connection.QueryMultiple(Usp_hd_UserRegion_HolidayList, p, commandType: CommandType.StoredProcedure);
                    lstRegHoliday.Past_Holidaylst = multiselect.Read<DashBoardLanding.Past_Holiday>().ToList();
                    lstRegHoliday.Present_Holiday = multiselect.Read<DashBoardLanding.Present_Holiday>().ToList();
                    connection.Close();
                    return lstRegHoliday;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        public List<DashBoardLanding.EmployeeBirthday> GetEmployeeBirthdays()
        {
            List<DashBoardLanding.EmployeeBirthday> lstEmpBirthday = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", _companyCode);
                    lstEmpBirthday = connection.Query<DashBoardLanding.EmployeeBirthday>(Usp_hd_Employee_BirthdayList, p, commandType: CommandType.StoredProcedure).ToList();
                    return lstEmpBirthday;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<DashBoardLanding.DoctorBirthdayAnniversary> GetDoctorBirthdays(string regionCode)
        {
            List<DashBoardLanding.DoctorBirthdayAnniversary> lstDocBirthday = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@RegionCode", regionCode);
                    p.Add("@CompanyCode", _companyCode);
                    lstDocBirthday = connection.Query<DashBoardLanding.DoctorBirthdayAnniversary>(Usp_hd_Doctor_BirthdayList, p, commandType: CommandType.StoredProcedure).ToList();
                    return lstDocBirthday;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<DashBoardLanding.DoctorBirthdayAnniversary> GetDoctorAnniversary(string regionCode)
        {
            List<DashBoardLanding.DoctorBirthdayAnniversary> lstDocBirthday = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@RegionCode", regionCode);
                    p.Add("@CompanyCode", _companyCode);
                    lstDocBirthday = connection.Query<DashBoardLanding.DoctorBirthdayAnniversary>(SP_hdGetDocAnniversaryforchildUser, p, commandType: CommandType.StoredProcedure).ToList();
                    return lstDocBirthday;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<DashBoardLanding.BirthdayAnniversaryCount> GetBirthdayAnniversaryCount(string regionCode)
        {
            List<DashBoardLanding.BirthdayAnniversaryCount> lstDocBirthdayCount = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@RegionCode", regionCode);
                    p.Add("@CompanyCode", _companyCode);
                    lstDocBirthdayCount = connection.Query<DashBoardLanding.BirthdayAnniversaryCount>(Usp_hd_getholidayandbirthdaycount, p, commandType: CommandType.StoredProcedure).ToList();
                    return lstDocBirthdayCount;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<DashBoardLanding.LockDetails> GetLockDetails(string User_Code)
        {
            List<DashBoardLanding.LockDetails> lstLockDetails = null;
            try
            {
                using(IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Code", User_Code);
                    p.Add("@Company_Code", _companyCode);
                    lstLockDetails = connection.Query<DashBoardLanding.LockDetails>(SP_HD_GetLockDetils, p, commandType: CommandType.StoredProcedure).ToList();
                    return lstLockDetails;
                }
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }
    }
}
