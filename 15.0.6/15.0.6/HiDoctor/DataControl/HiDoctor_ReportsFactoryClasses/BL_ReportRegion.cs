#region Using
using System.Collections.Generic;
using MVCModels.HiDoctor_Reports;
using System.Data;
using System.Text;

#endregion Using

namespace DataControl.HiDoctor_ReportsFactoryClasses
{
    public class BL_ReportRegion
    {
        #region Private Variable
        private CurrentInfo _objCurrentInfo;
        private DAL_ReportRegion _objDALreportRegion;
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        private SPData _objSPData;
        #endregion Private Variable

        #region Public Methods
        //Get SFCReport Details
        public IEnumerable<SFCReport> GetSFCReportDetails(string companyCode, string regionCode, string SelectionType, string status, string travelMode, string SFCValidity)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetSFCReportDetails(companyCode, regionCode, SelectionType, status, travelMode, SFCValidity);
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// Get ActivityFrequencysummary Details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCodes"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Reports.ActivityFrequenceSummaryModel> GetActivityFrequencySummary(string companyCode, string userCodes, string startDate, string endDate)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetActivityFrequencySummary(companyCode, userCodes, startDate, endDate);
            }

            catch
            {
                throw;
            }
        }

        /// <summary>
        ///  Get the CountofDCRActualDate
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public int GetCountDCRActualDateDetails(string companyCode, string userCode, string startDate, string endDate)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetCountDCRActualDateDetails(companyCode, userCode, startDate, endDate);
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// Get ApprovedLeave Details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="Month"></param>
        /// <param name="Year"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Reports.ApprovedLeavesModel> GetApprovedLeavsDetails(string companyCode, string userCode, string Month, string Year)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetApprovedLeavsDetails(companyCode, userCode, Month, Year);
            }
            catch
            {
                throw;
            }
        }

        //DRBondDCReport
        public IEnumerable<MVCModels.HiDoctor_Reports.DRBondDCDetails> GetDCRDoctBondReport(string companyCode, string userCode)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetDCRDoctBondReport(companyCode, userCode);
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// Get TpDates
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="Month"></param>
        /// <param name="Year"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Reports.TpDatesModel> GetTpDates(string companyCode, string userCode, string Month, string Year)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetTpDates(companyCode, userCode, Month, Year);
        }

        /// <summary>
        /// Get Holiday details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="parentRegioncodes"></param>
        /// <param name="startdate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Reports.HolidayDetailsforActivitysummary> GetHolidaydetailsforActivitySummary(string companyCode, string regionCode, string startdate, string endDate)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetHolidaydetailsforActivitySummary(companyCode, regionCode, startdate, endDate);
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// Get Entered Product
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="FromDate"></param>
        /// <returns></returns>
        public bool GetEnteredProduct(string companyCode, string userCode, string FromDate)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetEnteredProduct(companyCode, userCode, FromDate);
        }
        /// <summary>
        /// Get BrandMasterReport Details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<MasterReportModel> GetBrandMasterDetails(string companyCode)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetBrandMasterDetails(companyCode);
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// Get ProductMasterReport Details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<MasterReportModel> GetProdcutMasterDetails(string companyCode)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetProdcutMasterDetails(companyCode);
            }
            catch
            {
                throw;
            }

        }
        public IEnumerable<MVCModels.HiDoctor_Reports.ProductWiseDoctor> GetProductWiseDoctorDetails(string companyCode, string userCode, string startDate, string endDate, string productSelection, string dcrStatus, string qunatity)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            var userCodes = userCode + ",";
            var dcrStatu = dcrStatus + "^";
            return _objDALreportRegion.GetProductWiseDoctorDetails(companyCode, userCodes, startDate, endDate, productSelection, dcrStatus, qunatity);
        }

        //overloaded method for asynchronous reports
        public IEnumerable<MVCModels.HiDoctor_Reports.ProductWiseDoctor> GetProductWiseDoctorDetails(string companyCode, string userCode, string startDate, string endDate, string productSelection, string dcrStatus, string qunatity, string ConnectionString)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            var userCodes = userCode + ",";
            var dcrStatu = dcrStatus + "^";
            return _objDALreportRegion.GetProductWiseDoctorDetails(companyCode, userCodes, startDate, endDate, productSelection, dcrStatus, qunatity, ConnectionString);
        }

        public IEnumerable<MVCModels.HiDoctor_Reports.TPStatusReport> GetchildUsers(string companyCode, string userCode)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetchildUsers(companyCode, userCode);
            }
            catch
            {
                throw;
            }
        }
        public List<MVCModels.HiDoctor_Reports.Tpstatusreportmodel> GetTpDetail(string companyCode, string userCodes, string tpStatus, string startDate, string endDate)
        {
            return _objDALreportRegion.GetTpDetail(companyCode, userCodes, tpStatus, startDate, endDate);
        }

        public CPStatusReport GetCPStatusReport(string company_Code, string selected_Region_Code, string level1_RegionType, string level2_RegionType, string status)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetCPStatus(company_Code, selected_Region_Code, level1_RegionType, level2_RegionType, status);
        }

        /// <summary>
        /// Last submitted Quick Refernce Report
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCodes"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Reports.DCRLastSubmittedQuickRefReportModel> GetLastSubmittedQuickrefDetails(string companyCode, string userCodes, string startDate, string endDate)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetLastSubmittedQuickrefDetails(companyCode, userCodes, startDate, endDate);
            }
            catch
            {
                throw;
            }
        }

        //async last submitted report
        public IEnumerable<MVCModels.HiDoctor_Reports.DCRLastSubmittedQuickRefReportModel> GetLastSubmittedQuickrefDetails(string companyCode, string userCodes, string startDate, string endDate, string ConnectionString)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetLastSubmittedQuickrefDetails(companyCode, userCodes, startDate, endDate, ConnectionString);
            }
            catch
            {
                throw;
            }
        }

        public IEnumerable<MVCModels.HiDoctor_Reports.DivisionModel> getdivision(string companyCode, string regionCode)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.getdivision(companyCode, regionCode);
            }
            catch
            {
                throw;
            }

        }

        //async last submitted calci report
        public IEnumerable<MVCModels.HiDoctor_Reports.DivisionModel> getdivision(string companyCode, string regionCode, string ConnectionString)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.getdivision(companyCode, regionCode, ConnectionString);
            }
            catch
            {
                throw;
            }

        }

        public IEnumerable<MVCModels.HiDoctor_Reports.DcrStatus> GetlastSubmittedDcrStatus(string companyCode, string userCode, string lastDate)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetlastSubmittedDcrStatus(companyCode, userCode, lastDate);

            }
            catch { throw; }

        }

        //async last submitted report
        public IEnumerable<MVCModels.HiDoctor_Reports.DcrStatus> GetlastSubmittedDcrStatus(string companyCode, string userCode, string lastDate, string ConnectionString)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetlastSubmittedDcrStatus(companyCode, userCode, lastDate, ConnectionString);

            }
            catch { throw; }

        }

        public IEnumerable<DeviationCPReportModel> GetDeviationCPReport(string company_Code, string user_Code, string start_Date, string end_Date)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetDeviationCPReport(company_Code, user_Code, start_Date, end_Date);

        }

        public TpWithCpDoctorMissed GetTpWithCpDoctorMissedReport(string company_Code, string regionCode, int month, int year, string tpStatus)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetTpWithCpDoctorMissedReport(company_Code, regionCode, month, year, tpStatus);
            }
            catch
            {
                throw;
            }
        }
        //SelfActivitReport//
        public IEnumerable<MVCModels.HiDoctor_Reports.SelfActivityModel> GetSelfActivitDetail(string companyCode, string userCode, string startDate, string endDate, string DcrStatus)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetSelfActivitDetail(companyCode, userCode, startDate, endDate, DcrStatus);
            }
            catch
            {
                throw;
            }
        }
        //DCR QUALITY//
        public IEnumerable<MVCModels.HiDoctor_Reports.DCRQualityModel> GetchildRegions(string companyCode, string regionCode)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetchildRegions(companyCode, regionCode);
            }
            catch
            {
                throw;
            }
        }

        public IEnumerable<MVCModels.HiDoctor_Reports.DCRQualityDCRDetail> GetDcrQualityDCR(string companyCode, string regionCodes, string startDate, string endDate, string dcrStatus)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            string status = dcrStatus + "^";
            return _objDALreportRegion.GetDcrQualityDCR(companyCode, regionCodes, startDate, endDate, status);
        }

        public IEnumerable<MVCModels.HiDoctor_Reports.DCRQualityDoctorCount> GetDcrQualityDoctorCount(string companyCode, string regionCodes, string startDate, string endDate, string dcrStatus)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            string status = dcrStatus + "^";
            return _objDALreportRegion.GetDcrQualityDoctorCount(companyCode, regionCodes, startDate, endDate, status);
        }

        public IEnumerable<MVCModels.HiDoctor_Reports.DCRQualityProductDetail> GetDcrQualityProduct(string companyCode, string regionCodes, string startDate, string endDate, string dcrStatus)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            string status = dcrStatus + "^";
            return _objDALreportRegion.GetDcrQualityProduct(companyCode, regionCodes, startDate, endDate, status);
        }

        public IEnumerable<MVCModels.HiDoctor_Reports.DCRQualityChemistDetail> GetDcrChemist(string companyCode, string regionCodes, string startDate, string endDate, string dcrStatus)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            string status = dcrStatus + "^";
            return _objDALreportRegion.GetDcrChemist(companyCode, regionCodes, startDate, endDate, status);
        }

        //DCR QUALITY END//

        public IEnumerable<MVCModels.HiDoctor_Reports.DoctorCategory> GetDoctorCategory(string companyCode)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetDoctorCategory(companyCode);
        }

        public List<MVCModels.HiDoctor_Reports.DCRWeeklyModel> GetDcrWeeklyDetail(string companyCode, string userCode, string startDate, string endDate, string dcrStatus)
        {
            return _objDALreportRegion.GetDcrWeeklyDetail(companyCode, userCode, startDate, endDate, dcrStatus);
        }
        public IEnumerable<MVCModels.HiDoctor_Reports.DCRWeeklyDoctorModel> GetDcrWeeklyDoctorDetail(string companyCode, string userCode, string startDate, string endDate, string dcrStatus)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetDcrWeeklyDoctorDetail(companyCode, userCode, startDate, endDate, dcrStatus);
        }
        public IEnumerable<MVCModels.HiDoctor_Reports.DCRWeeeklyChemistModel> GetDcrWeeklyChemistDetail(string companyCode, string userCode, string startDate, string endDate, string dcrStatus)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetDcrWeeklyChemistDetail(companyCode, userCode, startDate, endDate, dcrStatus);
        }
        //MC REport//
        public IEnumerable<MVCModels.HiDoctor_Reports.CampaignNameModel> GetCampaignName(string companyCode, string userCode, string startDate, string endDate)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetCampaignName(companyCode, userCode, startDate, endDate);
        }

        public IEnumerable<MVCModels.HiDoctor_Reports.DoctorSpeciality> GetSpeciality(string companyCode)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetSpeciality(companyCode);
        }

        public IEnumerable<MVCModels.HiDoctor_Reports.Campaignheader> Getcampaignheader(string companyCode, string campaignCode)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.Getcampaignheader(companyCode, campaignCode);
        }

        public IEnumerable<MVCModels.HiDoctor_Reports.DCRQualityModel> GetchildUsersFromUserCode(string companyCode, string userCode)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetchildUsersFromUserCode(companyCode, userCode);
        }
        public IEnumerable<MVCModels.HiDoctor_Reports.CampaignProductModel> GetcampaignProductdetail(string companyCode, string campaignCode)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetcampaignProductdetail(companyCode, campaignCode);
        }
        public List<MVCModels.HiDoctor_Reports.MCDoctorDetailModel> GetDoctorDetail(string companyCode, string regionCodes, string campaignCode, string startDate, string endDate, string plannedDates)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            //string regionCode = regionCodes + ",";
            return _objDALreportRegion.GetDoctorDetail(companyCode, regionCodes, campaignCode, startDate, endDate, plannedDates);
        }

        public List<MVCModels.HiDoctor_Reports.MCDoctorDetailModel> GetDoctorDetailPopup(string companyCode, string regionCodes, string campaignCode, string startDate, string endDate, string plannedDates)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            string regionCode = regionCodes + ",";
            return _objDALreportRegion.GetDoctorDetailPopup(companyCode, regionCode, campaignCode, startDate, endDate, plannedDates);
        }

        public IEnumerable<MVCModels.HiDoctor_Reports.EmployeeLeaveTakenModel> GetEmployeeLeavedetail(string companyCode, string userCode, string startDate, string endDate)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetEmployeeLeavedetail(companyCode, userCode, startDate, endDate);
        }

        //Daily Call Status Report
        /// <summary>
        /// Get DoctorCallcount  for Dailycallstatus Report
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Reports.DocotrCallCountModel> GetDoctorCallCountDetails(string companyCode, string regionCode, int month, int year, string status)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetDoctorCallCountDetails(companyCode, regionCode, month, year, status);
        }

        //async daily call status report
        public List<MVCModels.HiDoctor_Reports.DocotrCallCountModel> GetDoctorCallCountDetails(string companyCode, string regionCode, int month, int year, string status, string ConnectionString)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetDoctorCallCountDetails(companyCode, regionCode, month, year, status, ConnectionString);
        }

        /// <summary>
        /// Get RegionCode
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Reports.DoctorCallstatusChildRegionModel> GetRegionCode(string companyCode, string regionCode)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetRegionCode(companyCode, regionCode);
        }

        //for Async reports
        public IEnumerable<MVCModels.HiDoctor_Reports.DoctorCallstatusChildRegionModel> GetRegionCode(string companyCode, string regionCode, string ConnectionString)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetRegionCode(companyCode, regionCode, ConnectionString);
        }

        /// <summary>
        /// Get Parent Region Code
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Reports.DoctorVisitDetailsModel> GetParentRegionCode(string companyCode, string regionCode)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetParentRegionCode(companyCode, regionCode);
        }

        //Get ChildUser
        public IEnumerable<MVCModels.HiDoctor_Reports.DoctorCallstatusChildRegionModel> GetChildUser(string companyCode)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetChildUser(companyCode);
        }

        //for async reports
        public IEnumerable<MVCModels.HiDoctor_Reports.DoctorCallstatusChildRegionModel> GetChildUser(string companyCode, string ConnectionString)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetChildUser(companyCode, ConnectionString);
        }
        /// <summary>
        /// Get Holiday Details for Dailycallstatus Report
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCodes"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <param name="parentRegion"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Reports.HolidayDetailsModel> GetHolidayDetails(string companyCode, string regionCodes, string startDate, string endDate)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetHolidayDetails(companyCode, regionCodes, startDate, endDate);
        }

        //for async reports
        public IEnumerable<MVCModels.HiDoctor_Reports.HolidayDetailsModel> GetHolidayDetails(string companyCode, string regionCodes, string startDate, string endDate, string ConnectionString)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetHolidayDetails(companyCode, regionCodes, startDate, endDate, ConnectionString);
        }
        //Start CpCoverageand Deviation
        /// <summary>
        /// Cp Coverage and Deviation
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="startDate"></param>
        /// <param name="previousMonthStart"></param>
        /// <param name="endDate"></param>
        /// <param name="dcrStatus"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Reports.CPCoverageandDeviationModel> GetCpCoverageandDeviation(string companyCode, string userCode, string regionCode, string startDate, string previousMonthStart, string endDate, string dcrStatus)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetCpCoverageandDeviation(companyCode, userCode, regionCode, startDate, previousMonthStart, endDate, dcrStatus);
        }
        public SpecialityCoverageAnalysis GetSpecialityCoverageAnalysis(string companyCode, string userCode, string startDate, string endDate, string dcrStatus)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetSpecialityCoverageAnalysis(companyCode, userCode, startDate, endDate, dcrStatus);
            }
            catch
            {
                throw;
            }
        }


        /// <summary>
        /// Specialitywise Doctor Category Count
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCodes"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Reports.SpecialityWiseDoctorCategoryCountModel> GetSpecialitywiseDoctorCategoryCount(string companyCode)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetSpecialitywiseDoctorCategoryCount(companyCode);
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Get DoctorMaster Details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCodes"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Reports.DoctorMasterModel> GetDoctormasterdetails(string companyCode, string regionCodes)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetDoctormasterdetails(companyCode, regionCodes);
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// Get RegionType Names
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Reports.RegionTypeNamesModel> GetRegionType(string companyCode, string regionCode)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetRegionType(companyCode, regionCode);
            }
            catch
            {
                throw;
            }
        }

        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <param name="dcrStatus"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Reports.DocotorCallcountHeaderModel> GetDoctorDeviationDetails(string companyCode, string userCode, string startDate, string endDate, string dcrStatus)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetDoctorDeviationDetails(companyCode, userCode, startDate, endDate, dcrStatus);
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// Get Doctor Names
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userNames"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <param name="dcrStatus"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Reports.DCRDoctorVisitReportModel> GetDoctors(string companyCode, string userNames, string startDate, string endDate, string dcrStatus)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetDoctors(companyCode, userNames, startDate, endDate, dcrStatus);
            }
            catch
            {
                throw;
            }
        }
        //---------------------START-DOCTOR MASTER REPORT---------------------------------------------------//
        /// <summary>
        /// Doctor Master Report Details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Reports.DoctorMasterReportModel> GetDoctorMasterReportDetails(string companyCode)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetDoctorMasterReportDetails(companyCode);
            }
            catch
            {
                throw;
            }

        }

        //To get the categories with respect to the divisions
        public List<MVCModels.HiDoctor_Reports.DoctorMasterReportModel> GetCategoryWiseDoctorMasterReport(string companyCode, string regionCode)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetCategoryWiseDoctorMasterReport(companyCode, regionCode);
            }
            catch
            {
                throw;
            }

        }

        /// <summary>
        /// Doctor category count and speciality count
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCodes"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Reports.DoctorCountModel> GetcategoryandspecialityCount(string companyCode, string regionCodes)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetcategoryandspecialityCount(companyCode, regionCodes);
            }
            catch
            {
                throw;
            }
        }

        /// <summary> 
        /// Get details of Child region userwise
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Reports.DoctorMasterTreeDetails> GetDetailsofChildRegions(string companyCode, string regionCode)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetDetailsofChildRegions(companyCode, regionCode);
            }
            catch
            {
                throw;
            }
        }


        public IEnumerable<MVCModels.HiDoctor_Reports.DoctorMasterDivisionModel> GetDoctorMasterDivision(string companyCode, string regionCode)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetDoctorMasterDivision(companyCode, regionCode);
            }
            catch
            {
                throw;
            }
        }

        //---------------------END-DOCTOR MASTER REPORT---------------------------------------------------//
        //lastsubmitted report
        public List<MVCModels.HiDoctor_Reports.LastSubmittedReportModel> GetlastsubmittedDetail(string companyCode, string userCode, string month, string year, string userSelection, string selectedDate)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetlastsubmittedDetail(companyCode, userCode, month, year, userSelection, selectedDate);
        }

        //async last submitted report calci
        public List<MVCModels.HiDoctor_Reports.LastSubmittedReportModel> GetlastsubmittedDetail(string companyCode, string userCode, string month, string year, string userSelection, string selectedDate, string ConnectionString)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetlastsubmittedDetail(companyCode, userCode, month, year, userSelection, selectedDate, ConnectionString);
        }
        public List<MVCModels.HiDoctor_Reports.LastSubmittedReportModel> GetAsynclastsubmittedCalciArch(string companyCode, string userCode, string month, string year, string userSelection, string selectedDate, string ArchiveReportConnectionString)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetlastsubmittedDetailArchiveReport(companyCode, userCode, month, year, userSelection, selectedDate, ArchiveReportConnectionString);
        }

        public List<MVCModels.HiDoctor_Reports.LastSubmittedReportModel> GetlastsubmittedDetailArchiveReport(string companyCode, string userCode, string month, string year, string userSelection, string selectedDate, string ArchiveReportConnectionString)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetlastsubmittedDetailArchiveReport(companyCode, userCode, month, year, userSelection, selectedDate, ArchiveReportConnectionString);
        }

        public DayofWeekReport GetDayOfWeekReport(string company_Code, string user_Code, string DCR_Status, int month, int year)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetDayofWeekReport(company_Code, user_Code, DCR_Status, month, year);
        }

        public List<DayofWeekReportCalendarData> GetDayOfWeekReportCalendarData(string company_Code, string user_Code, string DCR_Status, int month, int year)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetDayOfWeekReportCalendarData(company_Code, user_Code, DCR_Status, month, year);
        }
        //---------------------END-DOCTOR MASTER REPORT---------------------------------------------------//
        //----------------------WORK ANALYSIS START-------------------------------------------------------//
        //WorkAnalysis report//
        public List<MVCModels.HiDoctor_Reports.WorkAnalyisModel> GetWorkAnalysisDetail(string companyCode, string userCodes, string endMonth, string endYear, string startDate, string endDate)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetWorkAnalysisDetail(companyCode, userCodes, endMonth, endYear, startDate, endDate);
        }
        //WorkAnalysis report//

        public List<MVCModels.HiDoctor_Reports.WorkanalysispopupModel> GetnonfieldWorkpopup(string companyCode, string userCode, string startDate, string endDate)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetnonfieldWorkpopup(companyCode, userCode, startDate, endDate);
        }
        //GetCpDeviationpopup
        public List<MVCModels.HiDoctor_Reports.CPdeviationModel> GetCpDeviationpopup(string companyCode, string userCode, string startDate, string endDate)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetCpDeviationpopup(companyCode, userCode, startDate, endDate);
        }

        public List<MVCModels.HiDoctor_Reports.GetMissedAgainstPlanModel> GetCCallMissedPopup(string companyCode, string userCode, string startDate, string endDate, string category)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetCCallMissedPopup(companyCode, userCode, startDate, endDate, category);
        }

        public List<MVCModels.HiDoctor_Reports.GetDoctorCallModel> GetDoctorCallDetail(string companyCode, string userCode, string startDate, string endDate, string category)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetDoctorCallDetail(companyCode, userCode, startDate, endDate, category);
        }

        public List<MVCModels.HiDoctor_Reports.TPDeviationNewPopUpModel> GetTpdivationDetail(string companyCode, string userCode, string startDate, string endDate)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetTpdivationDetail(companyCode, userCode, startDate, endDate);
        }

        public List<MVCModels.HiDoctor_Reports.RepeatsCallModelPopupModel> GetRepeatsCallPopup(string companyCode, string userCode, string startDate, string endDate, string category)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetRepeatsCallPopup(companyCode, userCode, startDate, endDate, category);
        }


        ////lastsubmitted report
        //public List<MVCModels.HiDoctor_Reports.LastSubmittedReportModel> GetlastsubmittedDetail(string companyCode, string userCode, string month, string year, string userSelection)
        //{
        //    _objDALreportRegion = new DAL_ReportRegion();
        //    return _objDALreportRegion.GetlastsubmittedDetail(companyCode, userCode, month, year, userSelection);
        //}
        // Pay sulip Report


        public int GetMaxZoneIndex(string companyCode, string userTypeCode)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetMaxZoneIndex(companyCode, userTypeCode);
        }
        public DataSet GetPayslipReport(string companyCode, string month, string year, string userCode, string userTypeCode)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetPayslipReport(companyCode, userCode, month, year, userTypeCode);
        }
        public DataSet GetZoneHeaders(string companyCode, string userTypeCode, string zoneIndex)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetZoneHeaders(companyCode, userTypeCode, zoneIndex);
        }

        public int GetMaxColIndex(string companyCode, string userTypeCode, string zoneIndex)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetMaxColIndex(companyCode, userTypeCode, zoneIndex);

        }
        public int GetMaxRowIndex(string companyCode, string userTypeCode, string zoneIndex)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetMaxRowIndex(companyCode, userTypeCode, zoneIndex);
        }
        /// <summary>
        /// Doctor ProductMapping Details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Reports.DoctorProductMappingModel> GetDoctorProductMappingreport(string companyCode, string regionCode)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetDoctorProductMappingreport(companyCode, regionCode);
        }
        /// <summary>
        /// Get single UserInfo
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <param name="statusName"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public string GetReportHeaderTableforDoctorProductMapping(string companyCode, string userCode, string regionCode)
        {
            StringBuilder strTableRept = new StringBuilder();
            BLUser _objuser = new BLUser();
            try
            {
                IEnumerable<MVCModels.HiDoctor_Master.UserModel> lstUser = null;
                lstUser = _objuser.GetSingleUserInfo(companyCode, userCode, regionCode);
                List<MVCModels.HiDoctor_Master.UserModel> lstUserInfo = (List<MVCModels.HiDoctor_Master.UserModel>)lstUser;
                if (lstUserInfo != null && lstUserInfo.Count > 0)
                {
                    strTableRept.Append("<table cellspacing='0' cellpadding='0' width='100%' id='tblUserDetails' class='table' >");
                    strTableRept.Append("<thead><tr>");
                    strTableRept.Append("<th colspan='4'>User Details</th>");
                    strTableRept.Append("</tr></thead>");
                    strTableRept.Append("<tbody>");
                    strTableRept.Append("<tr>");
                    strTableRept.Append("<td>Employee Name</td>");
                    strTableRept.Append("<td>" + lstUserInfo[0].Employee_Name + "</td>");
                    strTableRept.Append("<td>Level 1 Manager :</td>");
                    strTableRept.Append("<td>");
                    strTableRept.Append(lstUserInfo[0].Reporting_Manager_Emp_Name + "(" + lstUserInfo[0].Reporting_Manager_Emp_Number + ")");
                    strTableRept.Append("</td>");
                    //  strTableRept.Append("<td>" + lstUserInfo[0].Reporting_Manager_Emp_Name + "</td>");
                    strTableRept.Append("</tr>");

                    strTableRept.Append("<tr>");
                    strTableRept.Append("<td>Employee Number:</td>");
                    strTableRept.Append("<td><b>" + lstUserInfo[0].Employee_Number + "</b></td>");
                    strTableRept.Append("<td>Level 1 Manager Designation :</td>");
                    strTableRept.Append("<td><b>" + lstUserInfo[0].Reporting_Manager_User_Type_Name + "</b></td>");
                    strTableRept.Append("</tr>");

                    strTableRept.Append("<tr>");
                    strTableRept.Append("<td>User Name :</td>");
                    strTableRept.Append("<td>" + lstUserInfo[0].User_Name + "</td>");
                    strTableRept.Append("<td>Level 1 Manager Region :</td>");
                    strTableRept.Append("<td>" + lstUserInfo[0].Reporting_Manager_Region_Name + "</td>");
                    strTableRept.Append("</tr>");


                    strTableRept.Append("<tr>");
                    strTableRept.Append("<td>Designation :</td>");
                    strTableRept.Append("<td>" + lstUserInfo[0].User_Type_Name + "</td>");
                    strTableRept.Append("<td>Level 2 Manager :</td>");
                    strTableRept.Append("<td>");
                    strTableRept.Append(lstUserInfo[0].NextLevel_Reporting_Manager_Emp_Name + "(" + lstUserInfo[0].NextLevel_Reporting_Manager_Emp_Number + ")");
                    strTableRept.Append("</td>");
                    // strTableRept.Append("<td>" + lstUserInfo[0].NextLevel_Reporting_Manager_Emp_Name + "</td>");
                    strTableRept.Append("</tr>");

                    strTableRept.Append("<tr>");
                    strTableRept.Append("<td>Region Name :</td>");
                    strTableRept.Append("<td>" + lstUserInfo[0].Region_Name + "</td>");
                    strTableRept.Append("<td>Level 2 Manager Designation :</td>");
                    strTableRept.Append("<td>" + lstUserInfo[0].NextLevel_Reporting_Manager_User_Type_Name + "</td>");
                    strTableRept.Append("</tr>");

                    strTableRept.Append("<tr>");
                    strTableRept.Append("<td>Region Type Name:</td>");
                    strTableRept.Append("<td>" + lstUserInfo[0].Region_Type_Name + "</td>");
                    strTableRept.Append("<td>Level 2 Manager Region :</td>");
                    strTableRept.Append("<td>" + lstUserInfo[0].NextLevel_Reporting_Manager_Region_Name + "</td>");
                    strTableRept.Append("</tr>");

                    strTableRept.Append("</tbody>");
                    strTableRept.Append("</table>");
                }
            }
            catch
            {
                throw;
            }
            return strTableRept.ToString();
        }
        /// <summary>
        /// Campaign Details for Doctor and product
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="doctorCode"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Reports.CampaignDetailsModel> GetCampaignDetailsforDoctorandProduct(string companyCode, string regionCode, string doctorCode)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetCampaignDetailsforDoctorandProduct(companyCode, regionCode, doctorCode);
            }
            catch
            {
                throw;
            }

        }
        public IEnumerable<UserLogReportModel> GetUserLogReport(string companyCode, string userCode, string startDate, string endDate)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetUserLogReport(companyCode, userCode, startDate, endDate);
            }
            catch
            {
                throw;
            }
        }
        #region DoctorMaster TerritoryWise Report
        /// <summary>
        /// Get Customer Details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Reports.CustomerDetailsModel> GetCustomerDetails(string companyCode, string regionCode)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetCustomerDetails(companyCode, regionCode);
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Get User Details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetUserDetails(string companyCode, string regionCode)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetUserDetails(companyCode, regionCode);
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Get Category and Speciality Master
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Reports.CategoryandSpecialityModel> GetCategoryandSpecialityMaster(string companyCode)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetCategoryandSpecialityMaster(companyCode);
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Get Doctor Master Count
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.CustomerModel> GetDoctorMasterCount(string companyCode, string regionCode, string startDate, string endDate)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetDoctorMasterCount(companyCode, regionCode, startDate, endDate);
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Get Doctor Visit Count
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Reports.DoctorProductMappingModel> GetDoctorVisitCount(string companyCode, string userCode, string startDate, string endDate)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetDoctorVisitCount(companyCode, userCode, startDate, endDate);
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Get DoctorVisit details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Reports.DoctorVisitDetailsModel> GetDoctorVisitDetails(string companyCode, string regionCode)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetDoctorVisitDetails(companyCode, regionCode);
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Get Product Details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Reports.ProductDetailModel> GetProductDetails(string companyCode, string userCode)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetProductDetails(companyCode, userCode);
            }
            catch
            {
                throw;
            }
        }


        public string GetReportHeaderTableforExpenseAnalysisAlumini(string companyCode, string userCode, string regionCode)
        {
            StringBuilder sbPrintTbl = new StringBuilder();
            BLUser _objuser = new BLUser();
            try
            {
                DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
                IEnumerable<MVCModels.HiDoctor_Master.UserModel> lstUser = null;
                lstUser = _objuser.GetSingleUserInfo(companyCode, userCode, regionCode);
                List<MVCModels.HiDoctor_Master.UserModel> lstUserInfo = (List<MVCModels.HiDoctor_Master.UserModel>)lstUser;
                if (lstUserInfo != null && lstUserInfo.Count > 0)
                {

                    #region Print User DEtails
                    sbPrintTbl.Append("<table cellspacing='0' cellpadding='0' id='tblUserDetail' class='data display dataTable box' width='100%' border='1'>");
                    sbPrintTbl.Append("<thead>");

                    sbPrintTbl.Append("<tr>");
                    sbPrintTbl.Append("<th colspan='2'  style='font-size:18px;' align='left'><b>Expense Analysis Alumni–Group Wise Report </b></th>");
                    sbPrintTbl.Append("<th align='right'>");
                    sbPrintTbl.Append("<img style='display: inline;' src='Images/Company_Logo/" + _objcurrentInfo.GetSubDomain() + ".jpg'>");
                    sbPrintTbl.Append("</th>");
                    sbPrintTbl.Append("</tr>");

                    sbPrintTbl.Append("<tr>");
                    sbPrintTbl.Append("<th align='left'><b>Company Name : " + lstUserInfo[0].Company_Name + "</b></th>");
                    sbPrintTbl.Append("<th align='left'><b>User Name : " + lstUserInfo[0].User_Name + "</b></th>");
                    sbPrintTbl.Append("<th align='left'>Designation : " + lstUserInfo[0].User_Type_Name + "</th>");
                    sbPrintTbl.Append("</tr>");


                    sbPrintTbl.Append("<tr>");
                    sbPrintTbl.Append("<th align='left'><b>Employee Name : " + lstUserInfo[0].Employee_Name + "</b></th>");
                    sbPrintTbl.Append("<th align='left'>Employee Number : " + lstUserInfo[0].Employee_Number + "</th>");
                    sbPrintTbl.Append("<th align='left'>Division : " + lstUserInfo[0].Division_Name + "</th>");
                    sbPrintTbl.Append("</tr>");

                    sbPrintTbl.Append("<tr>");
                    sbPrintTbl.Append("<th align='left'>Territory Name : " + lstUserInfo[0].Region_Name + "</th>");
                    sbPrintTbl.Append("<th align='left'>Reporting Manager : " + lstUserInfo[0].Reporting_Manager_Emp_Name + "(" + lstUserInfo[0].Reporting_Manager_Name + ")</th>");
                    sbPrintTbl.Append("<th align='left'>Reporting HQ : " + lstUserInfo[0].Reporting_Manager_Region_Name + "</th>");
                    sbPrintTbl.Append("</tr>");


                    sbPrintTbl.Append("<tr>");
                    sbPrintTbl.Append("<th align='left'>Account Number : " + lstUserInfo[0].Acc_No + "</th>");
                    sbPrintTbl.Append("<th align='left'>Date of joining : " + ((lstUserInfo[0].User_Date_of_joining == null) ? "-" : lstUserInfo[0].User_Date_of_joining) + "</th>");
                    sbPrintTbl.Append("<th align='left'>Phone number : " + ((lstUserInfo[0].User_Mobile_Number == null) ? "NA" : lstUserInfo[0].User_Mobile_Number) + "</th>");
                    sbPrintTbl.Append("</tr>");




                    #endregion Print User DEtails



                }
            }
            catch
            {
                throw;
            }
            return sbPrintTbl.ToString();
        }




        public string GetReportHeaderTableforDoctorMaster(string companyCode, string userCode, string regionCode)
        {
            StringBuilder strTblContent = new StringBuilder();
            BLUser _objuser = new BLUser();
            try
            {
                IEnumerable<MVCModels.HiDoctor_Master.UserModel> lstUser = null;
                lstUser = _objuser.GetSingleUserInfo(companyCode, userCode, regionCode);
                List<MVCModels.HiDoctor_Master.UserModel> lstUserInfo = (List<MVCModels.HiDoctor_Master.UserModel>)lstUser;
                if (lstUserInfo != null && lstUserInfo.Count > 0)
                {
                    strTblContent.Append("<table cellspacing='0' cellpadding='0' width='100%' id='tblUserDetails' class='table' >");
                    strTblContent.Append("<thead><tr>");
                    strTblContent.Append("<th colspan='4'>User Details</th>");
                    strTblContent.Append("</tr></thead>");
                    strTblContent.Append("<tbody>");
                    strTblContent.Append("<tr>");
                    strTblContent.Append("<td>User Name :</td>");
                    strTblContent.Append("<td>" + lstUserInfo[0].User_Name + "</td>");
                    strTblContent.Append("<td>Designation :</td>");
                    strTblContent.Append("<td>" + lstUserInfo[0].User_Type_Name + "</td>");
                    strTblContent.Append("</tr>");

                    strTblContent.Append("<tr>");
                    strTblContent.Append("<td>Employee Name :</td>");
                    strTblContent.Append("<td><b>" + lstUserInfo[0].Employee_Name + "</b></td>");
                    strTblContent.Append("<td>Employee Number :</td>");
                    strTblContent.Append("<td><b>" + lstUserInfo[0].Employee_Number + "</b></td>");
                    strTblContent.Append("</tr>");

                    strTblContent.Append("<tr>");
                    strTblContent.Append("<td>Reporting HQ :</td>");
                    strTblContent.Append("<td>" + lstUserInfo[0].Reporting_Manager_Region_Name + "</td>");
                    strTblContent.Append("<td>Reporting Manager :</td>");
                    strTblContent.Append("<td>" + lstUserInfo[0].Reporting_Manager_Name + "</td>");
                    strTblContent.Append("</tr>");


                    strTblContent.Append("<tr>");
                    strTblContent.Append("<td>Territory Name :</td>");
                    strTblContent.Append("<td>" + lstUserInfo[0].Region_Name + "</td>");
                    strTblContent.Append("<td>Division :</td>");
                    strTblContent.Append("<td>" + lstUserInfo[0].Division_Name + "</td>");
                    strTblContent.Append("</tr>");
                    strTblContent.Append("<tr>");
                    strTblContent.Append("<td>Mobile number :</td>");
                    strTblContent.Append("<td>" + lstUserInfo[0].User_Mobile_Number + "</td>");
                    strTblContent.Append("<td>Date of joining :</td>");
                    strTblContent.Append("<td>" + lstUserInfo[0].User_Date_of_joining + "</td>");
                    strTblContent.Append("</tr>");
                    strTblContent.Append("</tbody>");
                    strTblContent.Append("</table>");
                }
            }
            catch
            {
                throw;
            }
            return strTblContent.ToString();
        }
        #endregion DoctorMaster TerritoryWise Report
        /// <summary>
        /// Get DoctorMaster Datewise Report
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Reports.DoctorMasterDateWiseReportModel> GetAllStatusCount(string companyCode, string regionCode)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetAllStatusCount(companyCode, regionCode);
        }
        /// <summary>
        ///  Get speciality and category count for all status
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Reports.CategoryandSpecialitycountforAllstatusModel> GetCategoryandSpecialitycountforAllstatus(string companyCode, string regionCode)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetCategoryandSpecialitycountforAllstatus(companyCode, regionCode);
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Get DoctorNames
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="statusDate"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.CustomerModel> GetDoctorNameforDatewiseReport(string companyCode, string regionCode, string statusDate, string status)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetDoctorNameforDatewiseReport(companyCode, regionCode, statusDate, status);
            }
            catch
            {
                throw;
            }
        }

        #region Samplestock for Resigned Employee Report
        public List<MVCModels.HiDoctor_Reports.SamplestockForResignedEmployee> GetSampleStockforResignedEmployee(string companyCode, string userCode, string startDate, string endDate)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetSampleStockforResignedEmployee(companyCode, userCode, startDate, endDate);

            }
            catch
            {
                throw;
            }
        }
        #endregion Samplestock for Resigned Employee Report
        #region Expense Analysis for  Alumni
        public List<MVCModels.HiDoctor_Reports.ExpenseAnalysisforAlumniModel> GetExpenseAnalysisforAlumni(string companyCode, string userCode, string fromDate, string toDate, string dcrStatus, string activityStatus)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetExpenseAnalysisforAlumni(companyCode, userCode, fromDate, toDate, dcrStatus, activityStatus);
            }
            catch
            {
                throw;
            }
        }
        //Doctor Counr
        public IEnumerable<MVCModels.HiDoctor_Reports.ExpenseAnalysisforAlumni_DoctCountModel> GetCustDocCount(string companyCode, string userCode, string fromDate, string toDate, string dcrStatus, string option)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetCustDocCount(companyCode, userCode, fromDate, toDate, dcrStatus, option);
            }
            catch
            {
                throw;
            }
        }
        //Chemist count
        public List<MVCModels.HiDoctor_Reports.ExpenseAnalysisforAlumni_ChemCountModel> GetChemistCount(string companyCode, string userCode, string fromDate, string toDate, string dcrStatus, string option)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetChemistCount(companyCode, userCode, fromDate, toDate, dcrStatus, option);
            }
            catch
            {
                throw;
            }
        }
        //Manager Count
        public IEnumerable<MVCModels.HiDoctor_Reports.ExpenseAnalysisforAlumni_ManagerCountModel> GetManagerCount(string companyCode, string userCode, string fromDate, string toDate, string dcrStatus, string option)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetManagerCount(companyCode, userCode, fromDate, toDate, dcrStatus, option);
            }
            catch
            {
                throw;
            }
        }
        #endregion Expense Analysis for  Alumni
        #region Audit Trail Report for Customer
        public IEnumerable<MVCModels.HiDoctor_Reports.AuditTrailforCustomerModel> GetAuditTrailforCustomer(string companyCode, string regionCode, string customerEntityType, string startDate, string endDate)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetAuditTrailforCustomer(companyCode, regionCode, customerEntityType, startDate, endDate);
            }
            catch
            {
                throw;
            }
        }
        #endregion Audit Trail Report for Customer

        #region Report Header For Alumni
        public string GetReportHeaderForAlumni(string companyCode, string userCode, string regionCode, string startDate, string endDate, string status)
        {
            StringBuilder strTableRept = new StringBuilder();
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            BLUser _objuser = new BLUser();
            try
            {
                IEnumerable<MVCModels.HiDoctor_Master.UserModel> lstUser = null;
                lstUser = _objuser.GetSingleUserInfo(companyCode, userCode, regionCode);
                List<MVCModels.HiDoctor_Master.UserModel> lstUserInfo = (List<MVCModels.HiDoctor_Master.UserModel>)lstUser;
                if (lstUserInfo != null && lstUserInfo.Count > 0)
                {
                    strTableRept.Append("<table cellspacing='0' cellpadding='0' width='100%' id='tblUserDetails' class='table' >");
                    strTableRept.Append("<thead><tr>");
                    strTableRept.Append("<th colspan='4' style='align:centre;'>User Details</th>");
                    strTableRept.Append("</tr></thead>");
                    strTableRept.Append("<tbody>");

                    strTableRept.Append("<tr>");
                    strTableRept.Append("<td>Company Name:</td>");
                    strTableRept.Append("<td>");
                    strTableRept.Append(lstUserInfo[0].Company_Name);
                    strTableRept.Append("</td>");
                    strTableRept.Append("<td>User Name :</td>");
                    strTableRept.Append("<td>" + lstUserInfo[0].User_Name + "</td>");
                    strTableRept.Append("</tr>");

                    strTableRept.Append("<tr>");
                    strTableRept.Append("<td>Designation :</td>");
                    strTableRept.Append("<td>" + lstUserInfo[0].User_Type_Name + "</td>");
                    strTableRept.Append("<td>Employee Name :</td>");
                    strTableRept.Append("<td><b>" + lstUserInfo[0].Employee_Name + "</b></td>");
                    strTableRept.Append("</tr>");

                    strTableRept.Append("<tr>");
                    strTableRept.Append("<td>Employee Number :</td>");
                    strTableRept.Append("<td><b>" + lstUserInfo[0].Employee_Number + "</b></td>");
                    strTableRept.Append("<td>Reporting HQ :</td>");
                    strTableRept.Append("<td>" + lstUserInfo[0].Reporting_Manager_Region_Name + "</td>");
                    strTableRept.Append("</tr>");

                    strTableRept.Append("<tr>");
                    strTableRept.Append("<td>Reporting Manager :</td>");
                    strTableRept.Append("<td>" + lstUserInfo[0].Reporting_Manager_Name + "</td>");
                    strTableRept.Append("<td>Territory Name :</td>");
                    strTableRept.Append("<td>" + lstUserInfo[0].Region_Name + "</td>");
                    strTableRept.Append("</tr>");

                    strTableRept.Append("<tr>");
                    strTableRept.Append("<td>Division :</td>");
                    strTableRept.Append("<td>" + lstUserInfo[0].Division_Name + "</td>");
                    strTableRept.Append("<td>Mobile number :</td>");
                    strTableRept.Append("<td>" + lstUserInfo[0].User_Mobile_Number + "</td>");
                    strTableRept.Append("</tr>");

                    strTableRept.Append("<tr>");
                    strTableRept.Append("<td>Date of joining :</td>");
                    strTableRept.Append("<td>" + lstUserInfo[0].User_Date_of_joining + "</td>");
                    if (!string.IsNullOrEmpty(endDate))
                    {
                        strTableRept.Append("<td>Period :</td>");
                        strTableRept.Append("<td>" + startDate + " - " + endDate + "</td>");
                    }
                    else
                    {
                        strTableRept.Append("<td>Period :</td>");
                        strTableRept.Append("<td>" + startDate + "</td>");
                    }
                    strTableRept.Append("</tr>");

                    strTableRept.Append("<tr>");
                    if (!string.IsNullOrEmpty(status))
                    {
                        strTableRept.Append("<td>Selected Status :</td>");
                        strTableRept.Append("<td>" + status + "</td>");
                    }
                    else
                    {
                        strTableRept.Append("<td></td>");
                        strTableRept.Append("<td></td>");
                    }
                    strTableRept.Append("</tr>");
                    strTableRept.Append("</tbody>");
                    strTableRept.Append("</table>");
                }
            }
            catch
            {
                throw;
            }
            return strTableRept.ToString();
        }
        #endregion Report Header For Alumni

        #region SFC Audit Report
        public IEnumerable<MVCModels.HiDoctor_Reports.SFCAuditReportModel> GetSFCAuditReport(string companyCode, string regionCode, string startDate, string endDate)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetSFCAuditReport(companyCode, regionCode, startDate, endDate);
            }
            catch
            {
                throw;
            }
        }
        #endregion SFC Audit Report

        #region - RCPA Detail Report
        /// <summary>
        /// Get RCPA Details Report
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <param name="productCodes"></param>
        /// <param name="dcrStatus"></param>
        /// <returns></returns>
        //public List<MVCModels.HiDoctor_Reports.RCPADetailsReportModel> GetRcpaReptDetails(string companyCode, string regionCode, string startDate, string endDate, string productCodes, string dcrStatus,int pageNo, int pageSize, ref int totalPageCount,string viewOption)
        //{
        public List<MVCModels.HiDoctor_Reports.RCPADetailsReportModel> GetRcpaReptDetails(string companyCode, string regionCode, string startDate, string endDate, string productCodes, string dcrStatus)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetRcpaReptDetails(companyCode, regionCode, startDate, endDate, productCodes, dcrStatus);
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Get RCPA User details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Reports.RCPAUserdetailsModel> GetUserdetailsforRCPA(string companyCode, string regionCode)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetUserdetailsforRCPA(companyCode, regionCode);
        }
        #endregion - RCPA Detail Report
        #endregion Public Methods



        public IEnumerable<MVCModels.HiDoctor_Reports.RegionKYDDetails> GetKYDDetails(string companyCode, string regionCode, string KeyColunm)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetKYDDetails(companyCode, regionCode, KeyColunm);
        }

        public IEnumerable<MVCModels.HiDoctor_Reports.DaywisefieldwrkRcpaDetail> GetfieldworkRCPADetail(string companyCode, string userCode, string startDate, string status)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetfieldworkRCPADetail(companyCode, userCode, startDate, status);
        }
        public DataSet GetDoctorMasterReportOpt(string regionCode, string company_code)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetDoctorMasterReportOpt(regionCode, company_code);
        }
        #region - Stockiest wise SS Report
        /// <summary>
        /// Get SS Report
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="productCodes"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public List<SSReportModel> GetStockiestwiseSSReport(string companyCode, string regionCode, string productCodes, string startDate, string endDate)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetStockiestwiseSSReport(companyCode, regionCode, productCodes, startDate, endDate);
            }
            catch
            {
                throw;
            }
        }
        #endregion - Stockiest wise SS Report


        public List<StockiestSSOLdReport> GetstockiestwiseSSOldReport(string companyCode, string regionCode, string productCodes, string stockiestCodes, string startDate, string endDate)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetstockiestwiseSSOldReport(companyCode, regionCode, productCodes, stockiestCodes, startDate, endDate);
            }
            catch
            {
                throw;
            }
        }
        #region - Users Report Process Queue
        /// <summary>
        /// Get Users report submitted
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="productCodes"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public IList<UsersReportQueues> GetUsersReportProcessQueue(string CompanyCode, string UserCode, string ReportName)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetUsersReportProcessQueue(CompanyCode, UserCode, ReportName);
            }
            catch
            {
                throw;
            }
        }

        public IList<UsersReportQueues> GetReportQueueByID(string CompanyCode, string TransactionID)
        {
            try
            {
                _objDALreportRegion = new DAL_ReportRegion();
                return _objDALreportRegion.GetReportQueueByID(CompanyCode, TransactionID);
            }
            catch
            {
                throw;
            }
        }


        #endregion - Users Report Process Queue

        #region - AsynReport
        public List<MVCModels.AsynReportModel> GetReportsURL(string userCode)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            return _objDALreportRegion.GetReportsURL(userCode);
        }

        public void ExcuteAsynLastSubmitted(string companyCode, string loginUserCode, string userCode, string startDate, string endDate, string userSelection, string subDomain, string missedDoc, string unlistedDoc)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            _objDALreportRegion.ExcuteAsynLastSubmitted(companyCode, loginUserCode, userCode, startDate, endDate, userSelection, subDomain, missedDoc, unlistedDoc);
        }
        public string GetAsynLastSubURL(int requestId, string companyCode, string missedDoc, string unlistedDoc, string startDate, string endDate)
        {
            _objDALreportRegion = new DAL_ReportRegion();
            DataTable dt = _objDALreportRegion.GetAsynLastSubURL(requestId, companyCode, missedDoc, unlistedDoc);
            string tblContent = string.Empty;
            tblContent = AsynTableConvert.ConvertDatasettoHtml(dt, startDate, endDate);
            return tblContent;
        }

        #endregion - AsynReport
    }
}
