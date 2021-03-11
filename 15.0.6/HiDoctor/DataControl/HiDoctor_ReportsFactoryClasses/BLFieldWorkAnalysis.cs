using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace DataControl
{
    public class BLFieldWorkAnalysis
    {
        DALFieldWorkAnalysis objDALFWA = new DALFieldWorkAnalysis();

        public DataSet GetUnderUserType(string companyCode, string userCode)
        {
            return objDALFWA.GetUnderUserType(companyCode, userCode);
        }
        public int GetUnderUserTypeCount(string companyCode, string userTypeCode)
        {
            return objDALFWA.GetUnderUserTypeCount(companyCode, userTypeCode);
        }
        public DataSet GetFWAnalysisDetails(string companyCode, string userCode, string userTypeCode, string month, string year, string mode, string reportType)
        {
            return objDALFWA.GetFWAnalysisDetails(companyCode, userCode, userTypeCode, month, year, mode, reportType);
        }
        public DataSet GetDoctorVisifrequencyAnalysisCalsi(string companyCode, string userCode, string userTypeCode, string month, string year, string mode, string reportType)
        {
            return objDALFWA.GetDoctorVisifrequencyAnalysisCalsi(companyCode, userCode, userTypeCode, month, year, mode, reportType);
        }
        //async Doctor Visit frequency analysis report
        public DataSet GetDoctorVisifrequencyAnalysisCalsi(string companyCode, string userCode, string userTypeCode, string month, string year, string mode, string reportType, string ConnectionString)
        {
            return objDALFWA.GetDoctorVisifrequencyAnalysisCalsi(companyCode, userCode, userTypeCode, month, year, mode, reportType, ConnectionString);
        }
        public DataSet GetFWDoctorDetails(string companyCode, string category, string userCode, string month, string year)
        {
            return objDALFWA.GetFWDoctorDetails(companyCode, category, userCode, month, year);
        }
        public DataSet GetDaywiseAnalysis(string companyCode, string userCode, string month, string year, string type)
        {
            return objDALFWA.GetDaywiseAnalysis(companyCode, userCode, month, year, type);
        }
        public DataSet GetFWJointWorkAnalysisDetails(string companyCode, string userCode, string month, string year)
        {
            return objDALFWA.GetFWJointWorkAnalysisDetails(companyCode, userCode, month, year);
        }
        public DataSet GetFWListedDrsCoveredDetails(string companyCode, string category, string userCode, string month, string year)
        {
            return objDALFWA.GetFWListedDrsCoveredDetails(companyCode, category, userCode, month, year);
        }
        public DataSet GetFWEntityDetails(string companyCode, string userCode, string month, string year, string entity, string mode)
        {
            return objDALFWA.GetFWEntityDetails(companyCode, userCode, month, year, entity,mode);
        }

        public int GetUnderChildUserCount(string companyCode, string userCode)
        {
            return objDALFWA.GetUnderChildUserCount(companyCode, userCode);
        }

    }
}
