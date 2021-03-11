using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;


namespace DataControl
{
    public class BL_TP
    {
        private DAL_TP _objTp;
        public string GetCpLastEnteredDate(string usercode, string cpcode, DateTime tp_date, string companyCode)
        {
            _objTp = new DAL_TP();
            return _objTp.GetCpLastEnteredDate(usercode, cpcode, tp_date, companyCode);
        }
        public MVCModels.TPReport GetTpReport(string tp_Id, string company_Code)
        {
            _objTp = new DAL_TP();
            return _objTp.GetTpReport(tp_Id, company_Code);
        }
        public System.Data.DataSet GetTpconsolidatedReport(string UserCode, string Month, string Year, string company_Code)
        {
            _objTp = new DAL_TP();
            return _objTp.GetTpconsolidatedReport(UserCode, Month, Year, company_Code);
        }
        public List<MVCModels.TPTotalCount> GetTPCount(string user_Code, int month, int year, string company_Code)
        {
            _objTp = new DAL_TP();
            return _objTp.GetTPCount(user_Code, month, year, company_Code);
        }
        public MVCModels.TPBatch GetBatchInformation(string AccRegionCode, string TpDate, string UserCode)
        {
            _objTp = new DAL_TP();
            return _objTp.GetBatchInformation(AccRegionCode, TpDate, UserCode);
        }
        public List<MVCModels.BatchProduct> GetBatchProduct(int Schedule_Id)
        {
            _objTp = new DAL_TP();
            return _objTp.GetBatchProduct(Schedule_Id);
        }
        public MVCModels.BatchDetails GetBatchForDoctors(string DoctorCode, string DoctorRegion,string Region_Code,string TpDate)
        {
            _objTp = new DAL_TP();
            return _objTp.GetBatchForDoctors(DoctorCode, DoctorRegion, Region_Code, TpDate);
        }
        public List<MVCModels.CampaignDoctor> GetCampaignDoctors(string UserCodes, string CreatedUserCode, string TP_Date, string VacantRegions)
        {
            _objTp = new DAL_TP();
            return _objTp.GetCampaignDoctors(UserCodes, CreatedUserCode, TP_Date, VacantRegions);
        }
    }
}
