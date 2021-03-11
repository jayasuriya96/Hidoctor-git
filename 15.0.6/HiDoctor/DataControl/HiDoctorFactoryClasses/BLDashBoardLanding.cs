using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using MVCModels;
using DataControl.HiDoctorFactoryClasses;

namespace DataControl.HiDoctorFactoryClasses
{
    public class BLDashBoardLanding
    {
        private string _companyCode = "";
        public BLDashBoardLanding(string companyCode)
        {
            this._companyCode = companyCode;
        }

        public int GetImmediateChildUserCount(string userCode)
        {
            DALDashBoardLanding objDAL = new DALDashBoardLanding(_companyCode);
            return objDAL.GetImmediateChildUserCount(userCode);
        }

        public int GetPendingApprovalCountForTeam(string companyCode, string userCode, string entity)
        {
            DALDashBoardLanding objDAL = new DALDashBoardLanding(_companyCode);
            return objDAL.GetPendingApprovalCountForTeam(userCode, entity);
        }

        public int GetMyUnapprovedEntries(string userCode, string regionCode, string entity)
        {
            DALDashBoardLanding objDAL = new DALDashBoardLanding(_companyCode);
            return objDAL.GetUnapproveCount(userCode, regionCode, entity);
        }


        public int GetMyPendingNotifications(string userCode, string entity)
        {
            DALDashBoardLanding objDAL = new DALDashBoardLanding(_companyCode);
            return objDAL.GetPendingNotifications(userCode, entity);
        }

        public List<DashBoardLanding.DCRApprovalMenuAccess> GetDCRApprovalMenuAccessList(string userTypeCode)
        {
            DALDashBoardLanding objDAL = new DALDashBoardLanding(_companyCode);
            return objDAL.GetDCRApprovalMenuAccessList(userTypeCode);
        }

        public List<DashBoardLanding.DCRApprovalMenuAccess> GetTPApprovalMenuAccessList(string userTypeCode)
        {
            DALDashBoardLanding objDAL = new DALDashBoardLanding(_companyCode);
            return objDAL.GetTPApprovalMenuAccessList(userTypeCode);
        }

        public List<DashBoardLanding.DCRPendingApprovalUsers> GetPendingApprovalUserList(string userCode, string entity)
        {
            DALDashBoardLanding objDAL = new DALDashBoardLanding(_companyCode);
            return objDAL.GetPendingApprovalUserList(userCode, entity);
        }

        public List<DashBoardLanding.DCRDetails> GetUnapproveDCRList(string userCode)
        {
            DALDashBoardLanding objDAL = new DALDashBoardLanding(_companyCode);
            return objDAL.GetUnapproveDCR(userCode, 0);
        }

        public List<DashBoardLanding.TPDetails> GetUnapproveTPList(string userCode)
        {
            DALDashBoardLanding objDAL = new DALDashBoardLanding(_companyCode);
            return objDAL.GetUnapproveTP(userCode, 0);
        }

        public List<DashBoardLanding.ExpenseClaimDetails> GetUnapproveExpenseClaimList(string userCode)
        {
            DALDashBoardLanding objDAL = new DALDashBoardLanding(_companyCode);
            return objDAL.GetUnapproveExpenseClaim(userCode);
        }

        public List<DashBoardLanding.DCRDetails> GetMyAppliedDCRDetails(string userCode)
        {
            DALDashBoardLanding objDAL = new DALDashBoardLanding(_companyCode);
            return objDAL.GetMyAppliedDCR(userCode, 1);
        }
        public List<DashBoardLanding.TPDetails> GetMyAppliedTPDetails(string userCode, int tptype)
        {
            DALDashBoardLanding objDAL = new DALDashBoardLanding(_companyCode);
            return objDAL.GetMyAppliedTP(userCode, 2, tptype);
        }

        public List<DashBoardLanding.ExpenseClaimDetails> GetMyAppliedExpenseClaimsDetails(string userCode)
        {
            DALDashBoardLanding objDAL = new DALDashBoardLanding(_companyCode);
            return objDAL.GetMyAppliedExpenseClaims(userCode);
        }
        public DashBoardLanding.HolidayHistory GetUserRegionholidays(string regionCode)
        {
            DALDashBoardLanding objDAL = new DALDashBoardLanding(_companyCode);
            return objDAL.GetUserRegionholidays(regionCode);
        }

        public List<DashBoardLanding.EmployeeBirthday> GetEmployeeBirthdays()
        {
            DALDashBoardLanding objDAL = new DALDashBoardLanding(_companyCode);
            return objDAL.GetEmployeeBirthdays();
        }
        public List<DashBoardLanding.DoctorBirthdayAnniversary> GetDoctorBirthdays(string regionCode)
        {
            DALDashBoardLanding objDAL = new DALDashBoardLanding(_companyCode);
            return objDAL.GetDoctorBirthdays(regionCode);
        }
        public List<DashBoardLanding.DoctorBirthdayAnniversary> GetDoctorAnniversary(string regionCode)
        {
            DALDashBoardLanding objDAL = new DALDashBoardLanding(_companyCode);
            return objDAL.GetDoctorAnniversary(regionCode);
        }

        public List<DashBoardLanding.BirthdayAnniversaryCount> GetBirthdayAnniversaryCount(string regionCode)
        {
            DALDashBoardLanding objDAL = new DALDashBoardLanding(_companyCode);
            return objDAL.GetBirthdayAnniversaryCount(regionCode);
        }

        public List<DashBoardLanding.LockDetails> GetLockDetails(string User_Code)
        {
            DALDashBoardLanding objDAL = new DALDashBoardLanding(_companyCode);
            return objDAL.GetLockDetails(User_Code);
        }
    }
}
