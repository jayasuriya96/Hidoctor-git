using MVCModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using DataControl.HiDoctor_ReportsFactoryClasses;

namespace DataControl.HiDoctor_ReportsFactoryClasses
{
    public class BL_EdReports
    {
        public List<Speciality> GetSpeciality(string subDomainName)
        {
            DAL_DLReports _objDALRpt = new DAL_DLReports();
            return _objDALRpt.GetSpeciality(subDomainName);
        }
        public List<CustomerWiseReport> GetSpecialityWiseAnalyticsReport(string RegionCode, string spl_Name, int Spl_Month, int Spl_Year, int IsTeam, string subDomainName)
        {
            DAL_DLReports _objDALRpt = new DAL_DLReports();
            return _objDALRpt.GetSpecialityWiseAnalyticsReport(RegionCode, spl_Name, Spl_Month, Spl_Year, IsTeam, subDomainName);
        }

        #region Top 10 Asset-CategoryWise
        public List<Category> GetCategory(string subDomainName)
        {
            DAL_DLReports _objDALRpt = new DAL_DLReports();
            return _objDALRpt.GetCategory(subDomainName);
        }
        public List<CustomerWiseReport> GetCategoryWiseAnalyticsReport(string RegionCode, string Category_Name, int Category_Month, int Category_Year, int IsTeam, string subDomainName)
        {
            DAL_DLReports _objRpt = new DAL_DLReports();
            return _objRpt.GetCategoryWiseAnalyticsReport(RegionCode, Category_Name, Category_Month, Category_Year, IsTeam, subDomainName);
        }
        #endregion Top 10 Asset-CategoryWise
        #region specialitywise-eDetailing
        public DataSet GetSpecialityWiseEdetailing(string RegionCode, string subDomainName, string period, string IsTeam)
        {
            DAL_DLReports _objDALRpt = new DAL_DLReports();
            return _objDALRpt.GetSpecialityWiseEdetailing(RegionCode, subDomainName, period, IsTeam);
        }
        public DataSet GetAssertDetails(string regionCode, string speciality_Code, string category_Code, string period, string subDomainName)
        {
            DAL_DLReports _objDALRpt = new DAL_DLReports();
            return _objDALRpt.GetAssertDetails(regionCode, speciality_Code, category_Code, period, subDomainName);
        }

        public DataSet GetAssetWiseEdetailing(string RegionCode, string subDomainName, string period, string IsTeam)
        {
            DAL_DLReports _objDALRpt = new DAL_DLReports();
            return _objDALRpt.GetAssetWiseEdetailing(RegionCode, subDomainName, period, IsTeam);
        }
        public DataSet GetDoctorDetails(string regionCode, string speciality_Code, string category_Code, string period, string subDomainName)
        {
            DAL_DLReports _objDALRpt = new DAL_DLReports();
            return _objDALRpt.GetDoctorDetails(regionCode, speciality_Code, category_Code, period, subDomainName);
        }

        #endregion specialitywise-eDetailing
    }
}
