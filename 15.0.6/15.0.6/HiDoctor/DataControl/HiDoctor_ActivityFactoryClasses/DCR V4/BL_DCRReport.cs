using System;
using System.Data;
using System.Text;

namespace DataControl
{
    public class BL_DCRReport
    {
        private DAL_DCRReport _objDCRDAL = new DAL_DCRReport();

        public string GetNextTwoPossibleDays(string companyCode, string userCode, string regionCode, string dcrDate)
        {
            return _objDCRDAL.GetNextTwoPossibleDays(companyCode, userCode, regionCode, dcrDate);
        }
        public DataTable GetDailyCallPlanner(string companyCode, string userCode, string dcrDate)
        {
            return _objDCRDAL.GetDailyCallPlanner(companyCode, userCode, dcrDate);
        }

        public DataSet GetDailyCallPlannerDoctorDetails(string companyCode, string userCode, string regionCode, string month, string year, string fromDate, string dcrDate)
        {
            return _objDCRDAL.GetDailyCallPlannerDoctorDetails(companyCode, userCode, regionCode, month, year, fromDate, dcrDate);
        }
        public DataTable GetDoctorProductMappingDetail(string companyCode, string customerCode, string regionCode)
        {
            return _objDCRDAL.GetDoctorProductMappingDetail(companyCode, customerCode, regionCode);
        }
        public DataTable GetProductGivenInLastMonth(string companyCode, string userCode, string year, string month, string productType, string customerCode)
        {
            return _objDCRDAL.GetProductGivenInLastMonth(companyCode, userCode, year, month, productType, customerCode);
        }

        public DataTable GetNonSampleGivenYTD(string companyCode, string userCode, string fromDate, string customerCode)
        {
            return _objDCRDAL.GetNonSampleGivenYTD(companyCode, userCode, fromDate, customerCode);
        }

        public DataTable GetOurBrandProducts(string companyCode, string userCode, string year, string month, string customerCode)
        {
            return _objDCRDAL.GetOurBrandProducts(companyCode, userCode, year, month, customerCode);
        }

        public DataTable GetCompetitorBrandProducts(string companyCode, string userCode, string year, string month, string customerCode)
        {
            return _objDCRDAL.GetCompetitorBrandProducts(companyCode, userCode, year, month, customerCode);
        }

        public string GetAttendanceDetail(string companyCode, string userCode, string dcrDate)
        {
            return _objDCRDAL.GetAttendanceDetail(companyCode, userCode, dcrDate);        
        }

        public DataSet GetInstantReportDetails(string companyCode, string userCode, string regionCode, string dcrActualDate, string dcrCode, string flag)
        {
            return _objDCRDAL.GetInstantReportDetails(companyCode, userCode, regionCode, dcrActualDate, dcrCode, flag);
        }
    }
}
