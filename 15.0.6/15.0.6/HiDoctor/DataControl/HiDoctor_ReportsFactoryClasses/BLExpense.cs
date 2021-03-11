using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace DataControl
{
    public class BLExpense
    {
        DALExpense _objDALExpense = new DALExpense();
        public DataSet GetExpenseAnalysisReportNG(string companyCode, string userCode, string startDate, string endDate)
        {
            return _objDALExpense.GetExpenseAnalysisReportNG(companyCode, userCode, startDate, endDate);
        }

        public List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionReportModel> GetExpenseClaimDeductionReport(string companyCode, string userCode, string fromDate, string toDate, string claimStatus)
        {
            return _objDALExpense.GetExpenseClaimDeductionReport(companyCode, userCode, fromDate, toDate, claimStatus);
        }

        public List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionReportModelPopup> GetExpenseClaimDeductionDetailPopUp(string companyCode, string claimCode)
        {
            return _objDALExpense.GetExpenseClaimDeductionDetailPopUp(companyCode, claimCode);
        }
        public IEnumerable<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails> GetExpenseClaimDeductionDetailPopUpOld(string companyCode, string claimCode)
        {
            return _objDALExpense.GetExpenseClaimDeductionDetailPopUpOld(companyCode, claimCode);
        }
        public IEnumerable<MVCModels.HiDoctor_Reports.ExpenseClaimHeaderModel> GetOtherDecductionAmount(string companyCode, string claimCode)
        {
            return _objDALExpense.GetOtherDecductionAmount(companyCode, claimCode);
        }

        
    }
}
