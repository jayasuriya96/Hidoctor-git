#region Using
using DataControl.Abstraction;
using DataControl.EnumType;
using DataControl;
using System.Data;
using System.Text;
using System;
using DataControl.Impl;
using System.Threading.Tasks;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using MVCModels;

#endregion Using

namespace DataControl
{
    public class BLLeave
    {
        #region Private Variable
        private CurrentInfo _objCurrentInfo;
        private DALLeave _objDALLeave;
        private SPData _objSPData;
        #endregion Private Variable

        public DataSet GetLeaveTypeDetails(string companycode)
        {
            try
            {
                _objDALLeave = new DALLeave();
                DataSet ds = new DataSet();
                ds = _objDALLeave.GetLeaveTypeDetails(companycode);
                return ds;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<MVCModels.LeaveModel> GetLopStatus(string companycode)
        {
            try
            {
                _objDALLeave = new DALLeave();
                List<MVCModels.LeaveModel> lstLops = new List<MVCModels.LeaveModel>();
                lstLops = _objDALLeave.GetLopStatus(companycode);
                return lstLops;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string ChangeStatus(string companyCode, string LeaveTypeCode, string status)
        {
            try
            {
                _objDALLeave = new DALLeave();
                string changestatusforleavetype = _objDALLeave.ChangeStatus(companyCode, LeaveTypeCode, status);
                return changestatusforleavetype;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int InsertLeaveType(string CompanyCode, string LeaveTypeCode, string LeaveTypeName, string LeaveTypeStatus, string createdBY, string createdDate, string payrollleavetypeCode, string IsLop)
        {
            try
            {
                _objDALLeave = new DALLeave();
                int InsertLeave = _objDALLeave.InsertLeaveType(CompanyCode, LeaveTypeCode, LeaveTypeName, LeaveTypeStatus, createdBY, createdDate, payrollleavetypeCode, IsLop);
                return InsertLeave;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        public int UpdateLeaveType(string CompanyCode, string LeaveTypeCode, string LeaveTypeName, string updatedBy, string updatedDate, string payrollleavetypeCode, string IsLop)
        {
            try
            {
                _objDALLeave = new DALLeave();
                int UpdateLeaveType = _objDALLeave.UpdateLeaveType(CompanyCode, LeaveTypeCode, LeaveTypeName, updatedBy, updatedDate, payrollleavetypeCode, IsLop);
                return UpdateLeaveType;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #region user leave type master start
        public IEnumerable<MVCModels.LeaveTypeModel> GetActiveLeaveType(string companyCode)
        {
            _objDALLeave = new DALLeave();
            return _objDALLeave.GetActiveLeaveType(companyCode);
        }
        public IEnumerable<MVCModels.UserLeaveTypeModel> GetUserLeaveType(string companyCode, string userCode)
        {
            _objDALLeave = new DALLeave();
            return _objDALLeave.GetUserLeaveType(companyCode, userCode);
        }
        public IEnumerable<MVCModels.UserLeaveTypeModel> GetSelectedUserLeaveType(string companyCode, string userLeaveTypeCode)
        {
            _objDALLeave = new DALLeave();
            return _objDALLeave.GetSelectedUserLeaveType(companyCode, userLeaveTypeCode);
        }
        public IEnumerable<MVCModels.UserLeaveTypeModel> CheckUserLeaveTypeMapping(string companyCode, string userCode, string userTypeCode, string leaveTypeCode, string effectiveFrom, string effectiveTo)
        {
            _objDALLeave = new DALLeave();
            return _objDALLeave.CheckUserLeaveTypeMapping(companyCode, userCode, userTypeCode, leaveTypeCode, effectiveFrom, effectiveTo);
        }
        /// <summary>
        /// insert or update the user leave type master
        /// </summary>
        /// <param name="lstUserLeaveType"></param>
        /// <param name="mode"></param>
        /// <returns></returns>
        public int InsertUserLeaveTypeMaster(string Company_Code, string Effective_From, string Effective_To, string IS_Added_Weekend_Holiday,
                    string IS_Added_Holiday, string Leave_Type_Code, string Min_Leave, string Max_Leave, string User_Code, string User_Type_Code,
                    string Created_By, string Created_Date, string User_Leave_Status, string Updated_By, string Updated_Date,
                    string User_Leave_Type_Code, string clubbing, int leaveeligible, string leaveconfirmation, string leaveoncompletion, int noofdays,int applicdays, string validation_Mode, string leave_Occurrence_Count, string leave_Max_Count, string Document_Upload, string consecutvie_Leave_Allowed, string mode)
        {
            try
            {
                _objDALLeave = new DALLeave();
                return _objDALLeave.InsertUserLeaveTypeMaster(Company_Code, Effective_From, Effective_To, IS_Added_Weekend_Holiday,
                    IS_Added_Holiday, Leave_Type_Code, Min_Leave, Max_Leave, User_Code, User_Type_Code, Created_By, Created_Date,
                    User_Leave_Status, Updated_By, Updated_Date, User_Leave_Type_Code, clubbing,leaveeligible,leaveconfirmation,leaveoncompletion,noofdays, applicdays, validation_Mode, leave_Occurrence_Count, leave_Max_Count, Document_Upload, consecutvie_Leave_Allowed, mode);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("mode", mode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return 0;
            }
        }
        /// <summary>
        /// change the status of the user leave type master
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userLeaveTypeCode"></param>
        /// <param name="status"></param>
        /// <param name="updatedBy"></param>
        /// <param name="updatedDate"></param>
        /// <returns>returns the no of rows deleted</returns>
        public int DeleteUserLeaveTypeMaster(string companyCode, string userLeaveTypeCode, string status, string updatedBy, string updatedDate)
        {
            _objDALLeave = new DALLeave();
            return _objDALLeave.DeleteUserLeaveTypeMaster(companyCode, userLeaveTypeCode, status, updatedBy, updatedDate);
        }
        #endregion user leave type master end
        #region Employee Leave Taken
        /// <summary>
        /// Get user leave taken
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <returns>returns the leave details of the selected user</returns>
        public IEnumerable<MVCModels.DCRLeaveEntryModel> GetUserLeaveTaken(string companyCode, string userCode, string startDate, string endDate)
        {
            return _objDALLeave.GetUserLeaveTaken(companyCode, userCode, startDate, endDate);
        }
        /// <summary>
        /// Get User leave cur balance
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns>return the list of cur balance leave for the selected user</returns>
        public IEnumerable<MVCModels.LeaveCurBalance> GetUserLeaveCurBalance(string companyCode, string userCode)
        {
            return _objDALLeave.GetUserLeaveCurBalance(companyCode, userCode);
        }
        #endregion Employee leave taken

        public List<MVCModels.UsersForLeaveBalance> GetUsersForTree(string companyCode, string userTypeCode)
        {
            _objDALLeave = new DALLeave();
            return _objDALLeave.GetUsersForTree(companyCode, userTypeCode);
        }

        public List<MVCModels.UserTypeLeaveType> GetUserTypeLeave(string companyCode, string UserTypeCode, string cal_Year)
        {
            _objDALLeave = new DALLeave();
            return _objDALLeave.GetUserTypeLeave(companyCode, UserTypeCode, cal_Year);
        }
        //public List<MVCModels.UserLeaveDetails> GetUserLeaveDetails(string companyCode, string LeaveTypeCode, string userTypeCode, string Usercodes)
        //{
        //    _objDALLeave = new DALLeave();
        //    return _objDALLeave.GetUserLeaveDetails(companyCode, LeaveTypeCode, userTypeCode, Usercodes);
        //}

        public IEnumerable<MVCModels.UserLeaveDetails> GetUserLeaveDetails(string companyCode, string LeaveTypeCode, string userTypeCode, string Usercodes)
        {
            _objDALLeave = new DALLeave();
            var UserCodes = Usercodes.Split(',');
            DataTable dtUserCodes = null;
            if (UserCodes.Length >= 1)
            {
                dtUserCodes = new DataTable();
                dtUserCodes.Columns.Add("Company_Code", typeof(string));
                dtUserCodes.Columns.Add("User_Code", typeof(string));

                for (int i = 0; i < UserCodes.Length; i++)
                {
                    dtUserCodes.Rows.Add(companyCode, UserCodes[i]);
                }
            }
            var LeaveTypeCodes = LeaveTypeCode.Split(',');
            DataTable dtLeaveTypeCodes = null;
            if (LeaveTypeCodes.Length >= 1)
            {
                dtLeaveTypeCodes = new DataTable();
                dtLeaveTypeCodes.Columns.Add("Company_Code", typeof(string));
                dtLeaveTypeCodes.Columns.Add("Leave_Type_Code", typeof(string));

                for (int i = 0; i < LeaveTypeCodes.Length; i++)
                {
                    dtLeaveTypeCodes.Rows.Add(companyCode, LeaveTypeCodes[i]);
                }
            }
            return _objDALLeave.GetUserLeaveDetails(companyCode, dtLeaveTypeCodes, userTypeCode, dtUserCodes);
        }

        public IEnumerable<UserLeaveDetails> GetUserLeaveFilterDetails(string companyCode, string LeaveTypeCode, string Usercodes, string Year)
        {
            _objDALLeave = new DALLeave();
            var UserCodes = Usercodes.Split(',');
            DataTable dtUserCodes = null;
            if (UserCodes.Length >= 1)
            {
                dtUserCodes = new DataTable();
                dtUserCodes.Columns.Add("Company_Code", typeof(string));
                dtUserCodes.Columns.Add("User_Code", typeof(string));

                for (int i = 0; i < UserCodes.Length; i++)
                {
                    dtUserCodes.Rows.Add(companyCode, UserCodes[i]);
                }
            }
            var LeaveTypeCodes = LeaveTypeCode.Split(',');
            DataTable dtLeaveTypeCodes = null;
            if (LeaveTypeCodes.Length >= 1)
            {
                dtLeaveTypeCodes = new DataTable();
                dtLeaveTypeCodes.Columns.Add("Company_Code", typeof(string));
                dtLeaveTypeCodes.Columns.Add("Leave_Type_Code", typeof(string));

                for (int i = 0; i < LeaveTypeCodes.Length; i++)
                {
                    dtLeaveTypeCodes.Rows.Add(companyCode, LeaveTypeCodes[i]);
                }
            }
            return _objDALLeave.GetUserLeaveFilterDetails(companyCode, dtLeaveTypeCodes, dtUserCodes, Year);
        }

        public bool UpdateUserLeaveDetails(string companyCode, string Usercode, string LeaveTypeCode, string userTypeCode, string UserCode, float BalCF, float LeaveElg, float OpenBal, float LvTkn, float Lapsed, float LeaveBal)
        {
            bool result = false;
            try
            {
                _objDALLeave = new DALLeave();
                result = _objDALLeave.UpdateUserLeaveDetails(companyCode, Usercode, LeaveTypeCode, userTypeCode, UserCode, BalCF, LeaveElg, OpenBal, LvTkn, Lapsed, LeaveBal);
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        public string BulkUpdateUserLeaveDetails(string Company_Code, List<UpdateLeavelist> obj)
        {
            string result = "";
            try
            {
                _objDALLeave = new DALLeave();
                result = _objDALLeave.BulkUpdateUserLeaveDetails(Company_Code, obj);
                return result;
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public IEnumerable<MVCModels.AddUserLeave> AddNewLeaveType(string companyCode, string UserName, string NewLeaveType, string userTypeCode, string UserCode, string Effective_From, string Effective_To)
        {
            string result = string.Empty;
            _objDALLeave = new DALLeave();
            var UserCodes = UserCode.Split(',');
            DataTable dtUserCodes = null;
            if (UserCodes.Length >= 1)
            {
                dtUserCodes = new DataTable();
                dtUserCodes.Columns.Add("Company_Code", typeof(string));
                dtUserCodes.Columns.Add("User_Code", typeof(string));

                for (int i = 0; i < UserCodes.Length; i++)
                {
                    dtUserCodes.Rows.Add(companyCode, UserCodes[i]);
                }
            }
            return _objDALLeave.AddNewLeaveType(companyCode, UserName, NewLeaveType, userTypeCode, dtUserCodes, Effective_From, Effective_To);
        }

        public List<UserLeaveDetails> GetSelectedLeaveDetails(string Company_Code, string User_Leave_Code)
        {
            _objDALLeave = new DALLeave();
            try
            {
                return _objDALLeave.GetSelectedLeaveDetails(Company_Code, User_Leave_Code);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
