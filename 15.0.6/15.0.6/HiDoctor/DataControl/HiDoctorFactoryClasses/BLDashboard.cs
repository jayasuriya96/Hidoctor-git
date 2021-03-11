using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using DataControl.Abstraction;
using DataControl.Impl;
using DataControl.EnumType;

namespace DataControl
{
    public class BLDashboard
    {
        private IConfigSettings IConfig_Settings = null;
        DataControl.DALDashboard _objDALDashboard = new DALDashboard();

        public DataSet GetDivision(string companyCode, string regionCode)
        {
            return _objDALDashboard.GetDivision(companyCode, regionCode);
        }
        public DataSet GetRegionTypesByDivision(string companyCode, string regionCode, string divisionCode, string allDivision)
        {
            return _objDALDashboard.GetRegionTypesByDivision(companyCode, regionCode, divisionCode, allDivision);
        }
        public DataSet GetRegionByDivisionAndRegionType(string companyCode, string regionCode, string divisionCode, string regionTypeCode)
        {
            return _objDALDashboard.GetRegionByDivisionAndRegionType(companyCode, regionCode, divisionCode, regionTypeCode);
        }
        public DataSet GetRegionByDivision(string companyCode, string regionCode)
        {
            return _objDALDashboard.GetRegionByDivision(companyCode, regionCode);
        }
        public DataSet GetCategory(string companyCode, string divisionCode)
        {
            return _objDALDashboard.GetCategory(companyCode, divisionCode);
        }
        public DataSet GetCategoryWiseVisitAnanlysis(string companyCode, string regionCode, string months, string years, string regionNames, string divisionCode)
        {
            return _objDALDashboard.GetCategoryWiseVisitAnanlysis(companyCode, regionCode, months, years, regionNames, divisionCode);
        }
        public DataSet GetWorkedCalculation(string companyCode, string regionNames, string months, string years)
        {
            return _objDALDashboard.GetWorkedCalculation(companyCode, regionNames, months, years);
        }
        public DataSet GetDoctorCallAverage(string companyCode, string regionNames, string months, string years, string divisionCode)
        {
            return _objDALDashboard.GetDoctorCallAverage(companyCode, regionNames, months, years, divisionCode);
        }
        public DataSet GetChemistCallAverage(string companyCode, string regionCodes, string months, string years)
        {
            return _objDALDashboard.GetChemistCallAverage(companyCode, regionCodes, months, years);
        }
        public DataSet GetCategoryCoverage(string companyCode, string regionCodes, string months, string years, string divisionCode)
        {
            return _objDALDashboard.GetCategoryCoverage(companyCode, regionCodes, months, years, divisionCode);
        }

        public string InsertConfigSettings(string companyCode, string type, string configKey, string configValue, string possibleValues)
        {
            return _objDALDashboard.InsertConfigSettings(companyCode, type, configKey, configValue, possibleValues);
        }
        public string GetDashboardGaugeSettings()
        {
            CurrentInfo _objCurInfo = new CurrentInfo();
            IConfig_Settings = new Config_Settings();
            string companyCode = _objCurInfo.GetCompanyCode();

            // Retrives the DCR_ENTRY_TIME_GAP value.
            string gaugeRedColorFromTo = IConfig_Settings.GetConfigDefaultValue(companyCode, CONFIG_TYPE.DASHBOARD,
                CONFIG_KEY.GAUGE_REDCOLOR_FROM_TO);
            string gaugeYellowColorFromTo = IConfig_Settings.GetConfigDefaultValue(companyCode, CONFIG_TYPE.DASHBOARD,
            CONFIG_KEY.GAUGE_YELLOWCOLOR_FROM_TO);
            string gaugeGreenColorFromTo = IConfig_Settings.GetConfigDefaultValue(companyCode, CONFIG_TYPE.DASHBOARD,
            CONFIG_KEY.GAUGE_GREENCOLOR_FROM_TO);
            return gaugeRedColorFromTo + "_" + gaugeYellowColorFromTo + "_" + gaugeGreenColorFromTo;
        }
        public DataSet GetDivisionCount(string companyCode)
        {
            return _objDALDashboard.GetDivisionCount(companyCode);
        }
        public DataSet GetDivisonMappedProducts(string companyCode, string divisionCode, string regionCode)
        {
            return _objDALDashboard.GetDivisonMappedProducts(companyCode, divisionCode, regionCode);
        }
        public DataSet SSActivityVsSales(string companyCode, string regionCode, string regionCodes, string productCode, string months, string years)
        {
            return _objDALDashboard.SSActivityVsSales(companyCode, regionCode, regionCodes, productCode, months, years);
        }
        #region user dashboard
        public IEnumerable<MVCModels.UserDashboardModel> GetUserDashboardInfo(string companyCode, string userCode)
        {
            return _objDALDashboard.GetUserDashboardInfo(companyCode, userCode);
        }
        public IEnumerable<MVCModels.UserDashboardModel> GetManagerDashboardInfo(string companyCode, string userCode)
        {
            return _objDALDashboard.GetManagerDashboardInfo(companyCode, userCode);
        }

        public MVCModels.DashboardExpense GetDashboardExpenseDataCount(string companyCode, string userCode)
        {
            return _objDALDashboard.GetDashboardExpenseDataCount(companyCode, userCode);
        }

        public IEnumerable<MVCModels.DashboardExpense> GetExpensePopUp(string companyCode, string userCode, string mode)
        {
            return _objDALDashboard.GetExpensePopUp(companyCode, userCode, mode);
        }

        public MVCModels.DashboardSSTotalAmount GetDashboardSSDataCount(string companyCode, string regionCode)
        {
            return _objDALDashboard.GetDashboardSSDataCount(companyCode, regionCode);
        }

        public MVCModels.DasboardSSLst GetSSPopUp(string companyCode, string regionCode, string mode)
        {
            return _objDALDashboard.GetSSPopUp(companyCode, regionCode, mode);
        }


        public IEnumerable<MVCModels.UserCategoryDashboardModel> GetUserDashboardCategoryInfo(string companyCode, string userCode, string DivisionCode)
        {
            return _objDALDashboard.GetUserDashboardCategoryInfo(companyCode, userCode, DivisionCode);
        }
        public IEnumerable<MVCModels.TourPlannerModel> GetUserDashboardTPMeetingPoint(string companyCode, string userCode)
        {
            return _objDALDashboard.GetUserDashboardTPMeetingPoint(companyCode, userCode);
        }
        public IEnumerable<MVCModels.DCRApprovalModel> GetUserDashboardUnapprovedDCR(string companyCode, string userCode)
        {
            return _objDALDashboard.GetUserDashboardUnapprovedDCR(companyCode, userCode);
        }
        public IEnumerable<MVCModels.TourPlannerModel> GetUserDashboardUnapprovedTP(string companyCode, string userCode)
        {
            return _objDALDashboard.GetUserDashboardUnapprovedTP(companyCode, userCode);
        }
        public IEnumerable<MVCModels.TPLockStatusModel> GetUserDashboardTPLock(string companyCode, string userCode, string userTypeCode)
        {
            return _objDALDashboard.GetUserDashboardTPLock(companyCode, userCode, userTypeCode);
        }
        public IEnumerable<MVCModels.DcrLockDetail> GetUserDashboardCDRLock(string companyCode, string userCode, string userTypeCode)
        {
            return _objDALDashboard.GetUserDashboardCDRLock(companyCode, userCode, userTypeCode);
        }
        public IEnumerable<MVCModels.SecondarySalesOpeningbalanaceModel> GetUserDashboardSSDetails(string companyCode, string userCode)
        {
            return _objDALDashboard.GetUserDashboardSSDetails(companyCode, userCode);
        }
        public IEnumerable<MVCModels.HiDoctor_Master.DoctorModel> GetUserDashboardDoctorBirthday(string companyCode, string userCode)
        {
            return _objDALDashboard.GetUserDashboardDoctorBirthday(companyCode, userCode);
        }
        public IEnumerable<MVCModels.TourPlannerWrapperModel> GetUserDashboardTPLockDetails(string companyCode, string userCode)
        {
            return _objDALDashboard.GetUserDashboardTPLockDetails(companyCode, userCode);
        }
        public IEnumerable<MVCModels.DcrLockDetail> GetUserDashboardCDRLockMoreInfo(string companyCode, string userCode, string lockType)
        {
            return _objDALDashboard.GetUserDashboardCDRLockMoreInfo(companyCode, userCode, lockType);
        }
        public IEnumerable<MVCModels.ExpenseClaimHeaderModel> GetUserDashboardExpClaimMoreInfo(string companyCode, string userCode)
        {
            return _objDALDashboard.GetUserDashboardExpClaimMoreInfo(companyCode, userCode);
        }
        public IEnumerable<MVCModels.UserDashboardCountModel> GetUserDashboardLiveCounts(string companyCode, string userCode)
        {
            return _objDALDashboard.GetUserDashboardLiveCounts(companyCode, userCode);
        }
        public IEnumerable<MVCModels.UserDashboardPendingDCR> GetUserDashboardPendingDCR(string companyCode, string userCode)
        {
            return _objDALDashboard.GetUserDashboardPendingDCR(companyCode, userCode);
        }
        public IEnumerable<MVCModels.UserDashboardPendingTP> GetUserDashboardPendingTP(string companyCode, string userCode)
        {
            return _objDALDashboard.GetUserDashboardPendingTP(companyCode, userCode);
        }
        public IEnumerable<MVCModels.UserDashboardPendingClaim> GetUserDashboardPendingClaim(string companyCode, string userCode, int month, int year)
        {
            return _objDALDashboard.GetUserDashboardPendingClaim(companyCode, userCode, month, year);
        }
        public IEnumerable<MVCModels.SecondarySalesOpeningbalanaceModel> GetUserDashboardSS(string companyCode, string userCode, string mode)
        {
            return _objDALDashboard.GetUserDashboardSS(companyCode, userCode, mode);
        }
        public IEnumerable<MVCModels.UserCategoryDashboardModel> GetUserDashboardCategoryInfoSingle(string companyCode, string userCode)
        {
            return _objDALDashboard.GetUserDashboardCategoryInfoSingle(companyCode, userCode);
        }
        public IEnumerable<MVCModels.UserDashboardTourPlan> GetNextTwoDaysTourPlan(string companyCode, string userCode)
        {
            return _objDALDashboard.GetNextTwoDaysTourPlan(companyCode, userCode);
        }
        public IEnumerable<MVCModels.UserDashboardModel> GetUserDashboardPendingInfo(string companyCode, string userCode)
        {
            return _objDALDashboard.GetUserDashboardPendingInfo(companyCode, userCode);
        }
        public IEnumerable<MVCModels.UserDashboardPendingDCR> GetUserDashboardAppliedDCR(string companyCode, string userCode,string mode)
        {
            return _objDALDashboard.GetUserDashboardAppliedDCR(companyCode, userCode, mode);
        }
        public IEnumerable<MVCModels.UserDashboardPendingTP> GetUserDashboardAppliedTP(string companyCode, string userCode, string mode)
        {
            return _objDALDashboard.GetUserDashboardAppliedTP(companyCode, userCode, mode);
        }
        public IEnumerable<MVCModels.UserDashboardPendingClaim> GetUserDashboardAppliedClaim(string companyCode, string userCode, string mode)
        {
            return _objDALDashboard.GetUserDashboardAppliedClaim(companyCode, userCode, mode);
        }
        public IEnumerable<MVCModels.UserDashboardCategoryWiseDoctors> GetUserDashboardManagerVisits(string companyCode, string userCode)
        {
            return _objDALDashboard.GetUserDashboardManagerVisits(companyCode, userCode);
        }
        public IEnumerable<MVCModels.DashboardCategoryWiseDoctorVisit> GetUserDashboardCategoryWiseVisits(string companyCode, string userCode, string regionCode, string category, string speciality, string isCurrent, int CategoryMode)
        {
            return _objDALDashboard.GetUserDashboardCategoryWiseVisits(companyCode, userCode, regionCode, category, speciality, isCurrent, CategoryMode);
        }
        public MVCModels.DashBoardDoctorVisitSummaryandTotalCount GetUserDashboardDoctorVisitSummary(string companyCode, string userCode, string regionCode, string isCurrent, string IsSummaryMode, string Mode, int PageNo, int Pagesize)
        {
            return _objDALDashboard.GetUserDashboardDoctorVisitSummary(companyCode, userCode, regionCode, isCurrent, IsSummaryMode, Mode, PageNo, Pagesize);
        }

        public IEnumerable<MVCModels.UserCategoryDashboardModel> GetTotalApprovedDoctors(string companyCode, string userCode, string regionCode)
        {
            return _objDALDashboard.GetTotalApprovedDoctors(companyCode, userCode, regionCode); 
        }
        public IEnumerable<MVCModels.UserCategoryDashboardModel> GetTotalApprovedDoctorsWithTeam(string companyCode, string userCode, string regionCode, string DivisionCode)
        {
            return _objDALDashboard.GetTotalApprovedDoctorsWithTeam(companyCode, userCode, regionCode, DivisionCode); 
        }
        #endregion

    }
}
