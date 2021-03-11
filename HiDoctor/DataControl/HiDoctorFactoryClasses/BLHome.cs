using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataControl
{
    public class BLHome
    {
        DALHome objHome;
        /// <summary> 
        /// Get the home page notification
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns> returns the top 2 notice board content</returns>
        public IEnumerable<MVCModels.NoticeBoardContentModel> GetHomePageNotification(string companyCode, string userCode)
        {
            objHome = new DALHome();
            return objHome.GetHomePageNotification(companyCode, userCode);
        }

        /// <summary>
        /// Get the home page messages
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns>return the logged in user message</returns>
        public IEnumerable<MVCModels.NoticeBoardContentMSGModel> GetHomePageMessages(string companyCode, string userCode)
        {
            objHome = new DALHome();
            return objHome.GetHomePageMessages(companyCode, userCode);
        }
        /// <summary>
        /// Get the logged in user tomorrow meeting point
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns>returns the tour planner details for the logged in user</returns>
        public IEnumerable<MVCModels.TourPlannerModel> GetHomePageMeetingPoint(string companyCode, string userCode)
        {
            objHome = new DALHome();
            return objHome.GetHomePageMeetingPoint(companyCode, userCode);
        }
        /// <summary>
        /// Get the child users tomorrow meeting point
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns>returns the tour planner details for the child users</returns>
        public IEnumerable<MVCModels.TourPlannerModel> GetHomePageChildUserMeetingPoint(string companyCode, string userCode)
        {
            objHome = new DALHome();
            return objHome.GetHomePageChildUserMeetingPoint(companyCode, userCode);
        }


        /// <summary>
        /// Get the tomorrow birthday alert
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.DoctorModel> GetHomePageBirthdayAlert(string companyCode, string regionCode)
        {
            objHome = new DALHome();
            return objHome.GetHomePageBirthdayAlert(companyCode, regionCode);
        }

        /// <summary>
        /// get the tomorrow anniversary doctors
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.DoctorModel> GetHomePageAnniversaryAlert(string companyCode, string regionCode)
        {
            objHome = new DALHome();
            return objHome.GetHomePageAnniversaryAlert(companyCode, regionCode);
        }
        /// <summary>
        /// get the logged in user holiday details of the month
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.HolidayModel> GetHomePageHolidayAlert(string companyCode, string regionCode)
        {
            objHome = new DALHome();
            return objHome.GetHomePageHolidayAlert(companyCode, regionCode);
        }

        /// <summary>
        /// Get the calc fields details for the home page
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns>returns the current month and previous month calc fields details </returns>
        public List<MVCModels.HiDoctor_Master.UserCALCFieldsModel> GetHomePageCALCFieldsDetails(string companyCode, string userCode)
        {
            objHome = new DALHome();
            return objHome.GetHomePageCALCFieldsDetails(companyCode, userCode);
        }

        public int CheckMenuAccess(string companyCode, string userTypeCode, string menuUrl)
        {
            objHome = new DALHome();
            return objHome.CheckMenuAccess(companyCode, userTypeCode, menuUrl);
        }
        public int GetDoctorCount(string companyCode, string regionCode)
        {
            objHome = new DALHome();
            return objHome.GetDoctorCount(companyCode, regionCode);
        }

        /// <summary>
        /// Get the home page notification
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns> returns the notice board content</returns>
        public IEnumerable<MVCModels.NoticeBoardContentModel> GetHomePageUnreadNotification(string companyCode, string userCode)
        {
            objHome = new DALHome();
            return objHome.GetHomePageUnreadNotification(companyCode, userCode);
        }

        /// <summary>
        /// Get child User count
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.User_UserMasterModel> GetChildUserCount(string companyCode, string userCode)
        {
            objHome = new DALHome();
            return objHome.GetChildUserCount(companyCode, userCode);
        }

        /// <summary>
        /// Get Birthday Alerts for Child Users
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Master.DoctorModel> GetBirthdayAlertforChildUser(string companyCode, string regionCode)
        {
            objHome = new DALHome();
            return objHome.GetBirthdayAlertforChildUser(companyCode, regionCode);
        }
        /// <summary>
        /// Get Anniversay alerts for child users
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Master.DoctorModel> GetAnnviersaryAlertforChildUsers(string companyCode, string regionCode)
        {
            objHome = new DALHome();
            return objHome.GetAnnviersaryAlertforChildUsers(companyCode, regionCode);
        }

        public IEnumerable<MVCModels.HiDoctor_Master.HolidayModel> GetHolidayInfo(string companyCode, string regionCode)
        {
            objHome = new DALHome();
            return objHome.GetHolidayInfo(companyCode, regionCode); 
        }
        public List<string> GetCompanyMessages(string SubdomainName)
        {
            DALHome objHome = new DALHome();
            return objHome.GetCompanyMessages(SubdomainName);
        }

        public List<MVCModels.MyProfilePopupModel> GetprofilePopupAccess(string companyCode, string userCode, int NumOfDays)
        {
            List<MVCModels.MyProfilePopupModel> lstpopup = null;
            try
            {
                DALHome objHome = new DALHome();
                lstpopup = objHome.GetprofilePopupAccess(companyCode, userCode, NumOfDays).ToList();
            }
            catch(Exception ex)
            {
                throw;
            }
            return lstpopup;
        }

        public int GetCodeofConduct(string companyCode, string usertypecode, string userCode)
        {
            int result = 0;
            DALHome objHome = new DALHome();
            result = objHome.GetCodeofConduct(companyCode, usertypecode, userCode);
            return result;
        }

        public List<MVCModels.CCOverlayModel> GetCCForm(string companyCode, string usertypecode, string userCode)
        {
            List<MVCModels.CCOverlayModel> lstCCForm = null;
            try
            {
                DALHome objHome = new DALHome();
                lstCCForm = objHome.GetCCForm(companyCode, usertypecode, userCode).ToList();
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstCCForm;
        }

        public bool SaveAcknowledgement(string companyCode, string usertypeCode, string userCode, int FileId)
        {
            bool result = false;
            try
            {
                DALHome objHome = new DALHome();
                result = objHome.SaveAcknowledgement(companyCode, usertypeCode, userCode, FileId);
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }



        //public int UpdateAccessDetails(string companyCode, string userCode)
        //{
        //    DALHome objHome = new DALHome();
        //    return objHome.UpdateAccessDetails(companyCode, userCode);

        //}

    }
}
