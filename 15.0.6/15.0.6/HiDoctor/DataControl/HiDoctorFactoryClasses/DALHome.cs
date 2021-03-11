using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Dapper;
using System.Data;
using System.Data.Sql;
using System.Data.SqlClient;
using System.Configuration;
using MVCModels;

namespace DataControl
{
    public class DALHome : DapperRepository
    {
        #region Private Variables
        SPData _objSPData = new SPData();
        private Data _objData = new Data();
        private CurrentInfo _objCurInfo = new CurrentInfo();
        #endregion Private Variables
        #region Constant Strings 
        const string SP_HDGETHOMEPAGENOTIFICATIONS = "SP_hdGetHomePageNotifications";
        const string SP_HDGETHOMEPAGEMESSAGES = "SP_hdGetHomePageMessages";
        const string SP_HDGETHOMEPAGEMEETINGPOINT = "SP_hdGetHomePageMeetingPoint";
        const string SP_HDGETHOMEPAGECHILDUSERMEETINGPOINT = "SP_hdGetHomePageChildUserMeetingPoint";
        const string SP_HDGETHOMEPAGEBIRTHDAYALERT = "SP_hdGetHomePageBirthdayAlert";
        const string SP_HDGETHOMEPAGEANNIVERSARYALERT = "SP_hdGetHomePageAnniversaryAlert";
        const string SP_HDGETHOMEPAGEHOLIDAYALERT = "SP_hdGetHomePageHolidayAlert";
        const string SP_HDGETHOMEPAGEACTIVITYSUMMARY = "SP_hdGetHomePageActivitySummary";
        const string SP_HDCHECKMENUACCESS = "SP_hdCheckMenuAccess";
        const string SP_HDGETUNREADNOTIFICATIONS = "SP_hdGetUnreadNotifications";
        const string SP_HD_ALT_GETCHILDUSERS = "SP_HD_ALT_GetChildUsers";
        const string SP_HDGETHOMEPAGEBIRTHDAYALERTFORCHILDUSER = "SP_hdGetHomePageBirthdayAlertforchildUser";
        const string SP_HDGETHOMEPAGEANNIVERSARYALERTFORCHILDUSER = "SP_hdGetHomePageAnniversaryAlertforchildUser";
        const string SP_GetprofilePopupAccess = "SP_GetprofilePopupAccess";
        const string Usp_HD_GetCodeofConduct = "Usp_HD_GetCodeofConduct";
        const string Usp_HD_GetCCForm = "Usp_HD_GetCCForm";
        const string Usp_HD_Saveacknowledgestatus = "Usp_HD_Saveacknowledgestatus";
        //const string Sp_hd_UpdateAccessDetails = "Sp_hd_UpdateAccessDetails";
        #endregion  Constant Strings
        /// <summary>
        /// Get the home page notification
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns> returns the top 2 notice board content</returns>
        public IEnumerable<MVCModels.NoticeBoardContentModel> GetHomePageNotification(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.NoticeBoardContentModel> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstContent = connection.Query<MVCModels.NoticeBoardContentModel>(SP_HDGETHOMEPAGENOTIFICATIONS,
                                  new { CompanyCode = companyCode, UserCode = userCode },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }
        /// <summary>
        /// Get the home page messages
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns>return the logged in user message</returns>
        public IEnumerable<MVCModels.NoticeBoardContentMSGModel> GetHomePageMessages(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.NoticeBoardContentMSGModel> lstMsg;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstMsg = connection.Query<MVCModels.NoticeBoardContentMSGModel>(SP_HDGETHOMEPAGEMESSAGES,
                                  new { CompanyCode = companyCode, UserCode = userCode },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstMsg;
        }
        /// <summary>
        /// Get the logged in user tomorrow meeting point
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns>returns the tour planner details for the logged in user</returns>
        public IEnumerable<MVCModels.TourPlannerModel> GetHomePageMeetingPoint(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.TourPlannerModel> lstMeeting;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstMeeting = connection.Query<MVCModels.TourPlannerModel>(SP_HDGETHOMEPAGEMEETINGPOINT,
                                  new { CompanyCode = companyCode, UserCode = userCode },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstMeeting;
        }

        /// <summary>
        /// Get the child users tomorrow meeting point
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns>returns the tour planner details for the child users</returns>
        public IEnumerable<MVCModels.TourPlannerModel> GetHomePageChildUserMeetingPoint(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.TourPlannerModel> lstPlan;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstPlan = connection.Query<MVCModels.TourPlannerModel>(SP_HDGETHOMEPAGECHILDUSERMEETINGPOINT,
                                  new { CompanyCode = companyCode, UserCode = userCode },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstPlan;
        }
        public List<string> GetCompanyMessages(string SubdomainName)
        {
            List<string> Message=new List<string>();
            try
            {

                string strConnString = ConfigurationManager.AppSettings["GlobalConfig"];

                using (IDbConnection connection = IDbOpenConnection(strConnString))
                {
                    Message = connection.Query<string>("SP_GetCompanyMessages",
                                  new { SubdomainName = SubdomainName },
                                  commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("regionCode", SubdomainName);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return Message;
        }


        /// <summary>
        /// Get the tomorrow birthday alert
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.DoctorModel> GetHomePageBirthdayAlert(string companyCode, string regionCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.DoctorModel> lstDoc;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstDoc = connection.Query<MVCModels.HiDoctor_Master.DoctorModel>(SP_HDGETHOMEPAGEBIRTHDAYALERT,
                                  new { CompanyCode = companyCode, RegionCode = regionCode },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("regionCode", regionCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstDoc;
        }

        /// <summary>
        /// get the tomorrow anniversary doctors
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.DoctorModel> GetHomePageAnniversaryAlert(string companyCode, string regionCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.DoctorModel> lstDoc;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstDoc = connection.Query<MVCModels.HiDoctor_Master.DoctorModel>(SP_HDGETHOMEPAGEANNIVERSARYALERT,
                                  new { CompanyCode = companyCode, RegionCode = regionCode },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("regionCode", regionCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstDoc;
        }

        /// <summary>
        /// get the logged in user holiday details of the month
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.HolidayModel> GetHomePageHolidayAlert(string companyCode, string regionCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.HolidayModel> lstHoliday;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstHoliday = connection.Query<MVCModels.HiDoctor_Master.HolidayModel>(SP_HDGETHOMEPAGEHOLIDAYALERT,
                                  new { CompanyCode = companyCode, RegionCode = regionCode },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("regionCode", regionCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstHoliday;
        }

        public IEnumerable<MVCModels.HiDoctor_Master.HolidayModel> GetHolidayInfo(string companyCode, string regionCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.HolidayModel> lst;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    lst = connection.Query<MVCModels.HiDoctor_Master.HolidayModel>("SP_hdGetUserDashboardHolidayDetails", p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lst;
        }

        /// <summary>
        /// Get the calc fields details for the home page
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns>returns the current month and previous month calc fields details </returns>
        public List<MVCModels.HiDoctor_Master.UserCALCFieldsModel> GetHomePageCALCFieldsDetails(string companyCode, string userCode)
        {
            List<MVCModels.HiDoctor_Master.UserCALCFieldsModel> lstCALCFields = new List<MVCModels.HiDoctor_Master.UserCALCFieldsModel>();
            List<MVCModels.HiDoctor_Master.UserCALCFieldsHeaderModel> lstHeader = new List<MVCModels.HiDoctor_Master.UserCALCFieldsHeaderModel>();
            List<MVCModels.HiDoctor_Master.UserCALCFieldsDetailsModel> lstDetails = new List<MVCModels.HiDoctor_Master.UserCALCFieldsDetailsModel>();
            List<MVCModels.HiDoctor_Master.DoctorCategoryModel> lstCategory = new List<MVCModels.HiDoctor_Master.DoctorCategoryModel>();

            using (IDbConnection connection = IDbOpenConnection())
            {
                using (var multi = connection.QueryMultiple(SP_HDGETHOMEPAGEACTIVITYSUMMARY,
                              new { CompanyCode = companyCode, UserCode = userCode },
                              commandType: CommandType.StoredProcedure))
                {
                    lstHeader = multi.Read<MVCModels.HiDoctor_Master.UserCALCFieldsHeaderModel>().ToList();
                    lstDetails = multi.Read<MVCModels.HiDoctor_Master.UserCALCFieldsDetailsModel>().ToList();
                    lstCategory = multi.Read<MVCModels.HiDoctor_Master.DoctorCategoryModel>().ToList();
                }
            }
            MVCModels.HiDoctor_Master.UserCALCFieldsModel obj = new MVCModels.HiDoctor_Master.UserCALCFieldsModel();
            obj.lstCALCHeader = lstHeader;
            obj.lstCALCDetails = lstDetails;
            obj.lstDoctorCategory = lstCategory;
            lstCALCFields.Add(obj);
            return lstCALCFields;
        }

        public int CheckMenuAccess(string companyCode, string userTypeCode, string menuUrl)
        {
            int count = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    count = connection.Query<int>(SP_HDCHECKMENUACCESS,
                        new { CompanyCode = companyCode, UserTypeCode = userTypeCode, MenuUrl = menuUrl }, commandType: CommandType.StoredProcedure).Single();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return 0;
            }
            return count;
        }

        public int GetDoctorCount(string companyCode, string regionCode)
        {
            int count = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    const string selectQry = "SELECT COUNT(1) FROM tbl_SFA_Customer_Master WHERE Company_Code=@Company_Code AND Region_Code=@Region_Code ";
                    count = connection.Query<int>(selectQry, new { Company_Code = companyCode, Region_Code = regionCode }
                                                  ).Single();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return 0;
            }
            return count;
        }

        /// <summary>
        /// Get the home page notification
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns> returns the notice board content</returns>
        public IEnumerable<MVCModels.NoticeBoardContentModel> GetHomePageUnreadNotification(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.NoticeBoardContentModel> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstContent = connection.Query<MVCModels.NoticeBoardContentModel>(SP_HDGETUNREADNOTIFICATIONS,
                                  new { CompanyCode = companyCode, UserCode = userCode },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }
        /// <summary>
        /// Get child User count
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.User_UserMasterModel> GetChildUserCount(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.User_UserMasterModel> lstCust;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@UserCode", userCode);
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstCust = connection.Query<MVCModels.User_UserMasterModel>(SP_HD_ALT_GETCHILDUSERS, p, commandType: CommandType.StoredProcedure);
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
        /// Get Birthday Alerts for Child Users
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Master.DoctorModel> GetBirthdayAlertforChildUser(string companyCode, string regionCode)
        {
            List<MVCModels.HiDoctor_Master.DoctorModel> lstBirthdayAlerts = new List<MVCModels.HiDoctor_Master.DoctorModel>();
            try
            {
                DynamicParameters parameter = new DynamicParameters();
                parameter.Add("@CompanyCode", companyCode);
                parameter.Add("@RegionCode", regionCode);
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstBirthdayAlerts = connection.Query<MVCModels.HiDoctor_Master.DoctorModel>(SP_HDGETHOMEPAGEBIRTHDAYALERTFORCHILDUSER, parameter, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch
            {
                throw;
            }
            return lstBirthdayAlerts;
        }
        /// <summary>
        /// Get Anniversay alerts for child users
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Master.DoctorModel> GetAnnviersaryAlertforChildUsers(string companyCode, string regionCode)
        {
            List<MVCModels.HiDoctor_Master.DoctorModel> lstAnniversayAlerts = new List<MVCModels.HiDoctor_Master.DoctorModel>();
            try
            {
                DynamicParameters parameter = new DynamicParameters();
                parameter.Add("@CompanyCode", companyCode);
                parameter.Add("@RegionCode", regionCode);
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstAnniversayAlerts = connection.Query<MVCModels.HiDoctor_Master.DoctorModel>(SP_HDGETHOMEPAGEANNIVERSARYALERTFORCHILDUSER, parameter, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch
            {
                throw;
            }
            return lstAnniversayAlerts;
        }

        public List<MVCModels.MyProfilePopupModel> GetprofilePopupAccess(string companyCode, string userCode, int NumOfDays)
        {
            List<MVCModels.MyProfilePopupModel> lstprofilePopup = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@UserCode", userCode);
                    p.Add("@NumberOfDays", NumOfDays);
                    lstprofilePopup = connection.Query<MVCModels.MyProfilePopupModel>(SP_GetprofilePopupAccess, p, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstprofilePopup;
        }

        public int GetCodeofConduct(string companyCode, string usertypecode, string userCode)
        {
           int result = 0;
           // CCOverlayModel objccRes = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@companyCode", companyCode);
                    p.Add("@usertypecode", usertypecode);
                    p.Add("@UserCode", userCode);
                    p.Add("@Result", result, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>(Usp_HD_GetCodeofConduct, p, commandType: CommandType.StoredProcedure);
                    result= p.Get<int>("@Result");
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        public List<MVCModels.CCOverlayModel> GetCCForm(string companyCode, string usertypecode, string userCode)
        {
            List<MVCModels.CCOverlayModel> lstccform = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@usertypecode", usertypecode);
                    p.Add("@userCode", userCode);
                    lstccform = connection.Query<MVCModels.CCOverlayModel>(Usp_HD_GetCCForm, p, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstccform;
        }

        public bool SaveAcknowledgement(string companyCode, string usertypeCode, string userCode, int FileId)
        {
            bool result = false;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@companyCode", companyCode);
                    p.Add("@usertypeCode", usertypeCode);
                    p.Add("@UserCode", userCode);
                    p.Add("@FileId", FileId);
                    connection.Execute(Usp_HD_Saveacknowledgestatus, p, commandType: CommandType.StoredProcedure);
                    result = true;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        //public int UpdateAccessDetails(string companyCode, string userCode)
        //{
        //    int result = 0;
        //    try
        //    {
        //        using (IDbConnection connection = IDbOpenConnection())
        //        {
        //            var p = new DynamicParameters();
        //            p.Add("@CompanyCode", companyCode);
        //            p.Add("@UserCode", userCode);
        //            result=connection.Execute(Sp_hd_UpdateAccessDetails, p, commandType: CommandType.StoredProcedure);
        //            connection.Close();

        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //    return result;
        //}
    }
    }

