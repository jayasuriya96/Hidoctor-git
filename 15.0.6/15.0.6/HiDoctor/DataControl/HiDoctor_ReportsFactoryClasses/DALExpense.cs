using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using Dapper;

namespace DataControl
{
    public class DALExpense : DapperRepository
    {
        Data _objData = new Data();
        CurrentInfo _objcurrentInfo = new CurrentInfo();
        SPData objSPData = new SPData();

        const string SP_HDGETEXPENSEANALYSISREPORT_NG = "SP_hdGetExpenseAnalysisReport_NG";
        const string SP_hdGetExpenseClaimDeductionReport = "SP_hdGetExpenseClaimDeductionReport";
        const string SP_hdGetExpenseClaimDeductionDetailPopup = "SP_hdGetExpenseClaimDeductionDetailPopup_New";
        const string SP_hdGetExpenseClaimDeductionDetailPopupOld = "SP_hdGetExpenseClaimDeductionDetailPopupOld";
        const string SP_HDEXPENSECLAIMOTHERDEDUCTIONAMOUNT = "SP_HdExpenseClaimOtherDeductionAmount";
        public DataSet GetExpenseAnalysisReportNG(string companyCode, string userCode, string startDate, string endDate)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETEXPENSEANALYSISREPORT_NG);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, companyCode);
                objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, userCode);
                objSPData.AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.NVarChar, 30, startDate);
                objSPData.AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.NVarChar, 30, endDate);
                _objData.OpenConnection();
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }


        public List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionReportModel> GetExpenseClaimDeductionReport(string companyCode, string userCode, string fromDate, string toDate, string claimStatus)
        {
            List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionReportModel> lst = new List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionReportModel>();
            try
            {
                List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails> lstExpClaim = null;
                List<MVCModels.HiDoctor_Reports.DCRHOPPlace> lstDCRHop = null;

                using (IDbConnection connection = IDbOpenConnection())
                {
                    using (var multi = connection.QueryMultiple(SP_hdGetExpenseClaimDeductionReport,
                                  new { CompanyCode = companyCode, UserCode = userCode, FromDate = fromDate, ToDate = toDate, ClaimStatus = claimStatus },
                                  commandType: CommandType.StoredProcedure))
                    {
                        lstExpClaim = multi.Read<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails>().ToList();
                        lstDCRHop = multi.Read<MVCModels.HiDoctor_Reports.DCRHOPPlace>().ToList();
                    }
                }
                MVCModels.HiDoctor_Reports.ExpenseClaimDeductionReportModel objExp = new MVCModels.HiDoctor_Reports.ExpenseClaimDeductionReportModel();
                objExp.lstClaimDetails = lstExpClaim;
                objExp.lstDCRHOP = lstDCRHop;

                lst.Add(objExp);

            }
            catch (Exception)
            {
                throw;
            }
            return lst;
        }

        public IEnumerable<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails> GetExpenseClaimDeductionDetailPopUpOld(string companyCode, string claimCode)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails> lstExp;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstExp = connection.Query<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails>(SP_hdGetExpenseClaimDeductionDetailPopupOld,
                                  new { CompanyCode = companyCode, ClaimCode = claimCode },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstExp;
        }


        //ADDED SRI


        public List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionReportModelPopup> GetExpenseClaimDeductionDetailPopUp(string companyCode, string claimCode)
        {
            List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionReportModelPopup> lst = new List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionReportModelPopup>();
            try
            {
                List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails> lstExpClaim = null;
                List<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetailsTravellplaces> lstDCRHop = null;

                using (IDbConnection connection = IDbOpenConnection())
                {
                    using (var multi = connection.QueryMultiple(SP_hdGetExpenseClaimDeductionDetailPopup,
                                  new { CompanyCode = companyCode, ClaimCode = claimCode },
                                  commandType: CommandType.StoredProcedure))
                    {
                        lstExpClaim = multi.Read<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetails>().ToList();
                        lstDCRHop = multi.Read<MVCModels.HiDoctor_Reports.ExpenseClaimDeductionDetailsTravellplaces>().ToList();
                    }
                }
                MVCModels.HiDoctor_Reports.ExpenseClaimDeductionReportModelPopup objExp = new MVCModels.HiDoctor_Reports.ExpenseClaimDeductionReportModelPopup();
                objExp.lstClaimDetails = lstExpClaim;
                objExp.lstDCRHOP = lstDCRHop;

                lst.Add(objExp);

            }
            catch (Exception)
            {
                throw;
            }
            return lst;
        }


        public IEnumerable<MVCModels.HiDoctor_Reports.ExpenseClaimHeaderModel> GetOtherDecductionAmount(string companyCode, string claimCode)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.ExpenseClaimHeaderModel> lstODAmount;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstODAmount = connection.Query<MVCModels.HiDoctor_Reports.ExpenseClaimHeaderModel>(SP_HDEXPENSECLAIMOTHERDEDUCTIONAMOUNT,
                                  new { CompanyCode = companyCode, ClaimCode = claimCode },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstODAmount;
        }
    }
}
