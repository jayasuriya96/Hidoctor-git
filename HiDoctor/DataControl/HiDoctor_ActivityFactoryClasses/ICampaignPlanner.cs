using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace DataControl
{
    public interface ICampaignPlanner
    {
        List<MVCModels.ExpenseEntity> GetExpenseEntity(string companyCode);
        List<MVCModels.SFC> GetSFC(string companyCode, string regionCode);
        List<MVCModels.HiDoctor_Master.DoctorModel> GetApprovedDoctorsByRegion(string companyCode, string regionCode);
        DataSet GetCPDetails(string companyCode, string regionCode);
        DataSet GetModifiedCPSFCDetails(string companyCode, string regionCode, string cpCode);
    }
}
