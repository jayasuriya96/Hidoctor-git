using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Dapper;
using System.Data.SqlClient;


namespace DataControl.HiDoctor_ReportsFactoryClasses
{
    public class DAL_DCRConsolidated : DapperRepository
    {
        #region Private Variables
        SPData _objSPData = new SPData();
        private Data _objData = new Data();
        #endregion Private Variables

        #region Const Strings
        const string SP_hdGetDCRConsDCRHeader = "SP_hdGetDCRConsDCRHeader";
        const string SP_hdGetDCRConsTabDoctorVisitDetails = "SP_hdGetDCRConsTabDoctorVisitDetails";
        const string SP_hdGetDCRConsTabChemistVisitDetails = "SP_hdGetDCRConsTabChemistVisitDetails";
        const string SP_hdGetDCRConsTabStockistVisit = "SP_hdGetDCRConsTabStockistVisit";
        const string SP_hdGetDCRConsTabProductDetails = "SP_hdGetDCRConsTabProductDetails";
        const string SP_hdGetDCRConsTabExpenseDetails = "SP_hdGetDCRConsTabExpenseDetails";
        const string SP_hdGetDCRConsWADCRDetails = "SP_hdGetDCRConsWADCRDetails";
        #endregion Const Strings

        // HEADER
        public List<MVCModels.HiDoctor_Reports.DCRConsHeaderModel> GetDCRConsTabHeaderDetails(string companyCode, string userCode, string fromDate, string toDate, string dcrStatus)
        {
            List<MVCModels.HiDoctor_Reports.DCRConsHeaderModel> lstDCRHeader = new List<MVCModels.HiDoctor_Reports.DCRConsHeaderModel>();
            try
            {
                List<MVCModels.HiDoctor_Reports.DCRHeaderModel> lstHeader = null;
                List<MVCModels.HiDoctor_Reports.DCRSFCModel> lstSFC = null;
                List<MVCModels.HiDoctor_Reports.DCRAttendanceModel> lstAttendance = null;
                List<MVCModels.HiDoctor_Reports.DCRLeaveModel> lstLeave = null;


                using (IDbConnection connection = IDbOpenConnection())
                {
                    using (var multi = connection.QueryMultiple(SP_hdGetDCRConsDCRHeader,
                                  new { CompanyCode = companyCode, UserCode = userCode, FromDate = fromDate, ToDate = toDate, DCRStatus = dcrStatus },
                                  commandType: CommandType.StoredProcedure))
                    {
                        lstHeader = multi.Read<MVCModels.HiDoctor_Reports.DCRHeaderModel>().ToList();
                        lstSFC = multi.Read<MVCModels.HiDoctor_Reports.DCRSFCModel>().ToList();
                        lstAttendance = multi.Read<MVCModels.HiDoctor_Reports.DCRAttendanceModel>().ToList();
                        lstLeave = multi.Read<MVCModels.HiDoctor_Reports.DCRLeaveModel>().ToList();
                    }
                }

                MVCModels.HiDoctor_Reports.DCRConsHeaderModel objHeader = new MVCModels.HiDoctor_Reports.DCRConsHeaderModel();
                objHeader.lstHeader = lstHeader;
                objHeader.lstSFC = lstSFC;
                objHeader.lstAttendance = lstAttendance;
                objHeader.lstLeave = lstLeave;
                lstDCRHeader.Add(objHeader);
            }
            catch
            {
                throw;
            }
            return lstDCRHeader;
        }

        // DOCTOR
        public List<MVCModels.HiDoctor_Reports.DCRConsDoctorVisitModel> GetDCRConsTabDoctorVisitDetails(string companyCode, string userCode, string fromDate, string toDate, string dcrStatus)
        {
            List<MVCModels.HiDoctor_Reports.DCRConsDoctorVisitModel> lstDoctorVisit = new List<MVCModels.HiDoctor_Reports.DCRConsDoctorVisitModel>();
            try
            {
                List<MVCModels.HiDoctor_Reports.DCRDoctorVisitDetailsModel> lstDoctorVisitDetails = null;
                List<MVCModels.HiDoctor_Reports.DCRDoctorVisitDetailsModel> lstDistinctDoctors = null;
                List<MVCModels.HiDoctor_Reports.DCRDoctorVisitDetailsModel> lstMissedDoctors = null;


                using (IDbConnection connection = IDbOpenConnection())
                {
                    using (var multi = connection.QueryMultiple(SP_hdGetDCRConsTabDoctorVisitDetails,
                                  new { CompanyCode = companyCode, UserCode = userCode, FromDate = fromDate, ToDate = toDate, DCRStatus = dcrStatus },
                                  commandType: CommandType.StoredProcedure))
                    {
                        lstDoctorVisitDetails = multi.Read<MVCModels.HiDoctor_Reports.DCRDoctorVisitDetailsModel>().ToList();
                        lstDistinctDoctors = multi.Read<MVCModels.HiDoctor_Reports.DCRDoctorVisitDetailsModel>().ToList();
                        lstMissedDoctors = multi.Read<MVCModels.HiDoctor_Reports.DCRDoctorVisitDetailsModel>().ToList();
                        
                    }
                }

                MVCModels.HiDoctor_Reports.DCRConsDoctorVisitModel objDoc = new MVCModels.HiDoctor_Reports.DCRConsDoctorVisitModel();
                objDoc.lstDoctorVisitDetails = lstDoctorVisitDetails;
                objDoc.lstDistinctDoctors = lstDistinctDoctors;
                objDoc.lstMissedDoctors = lstMissedDoctors;
                lstDoctorVisit.Add(objDoc);
            }
            catch
            {
                throw;
            }
            return lstDoctorVisit;
        }

        //CHEMIST
        public List<MVCModels.HiDoctor_Reports.DCRConsChemistVisitModel> GetDCRConsTabChemistVisitDetails(string companyCode, string userCode, string fromDate, string toDate, string dcrStatus)
        {
            List<MVCModels.HiDoctor_Reports.DCRConsChemistVisitModel> lstChemistVisit = new List<MVCModels.HiDoctor_Reports.DCRConsChemistVisitModel>();
            try
            {
                List<MVCModels.HiDoctor_Reports.DCRChemistVisitDetailsModel> lstChemistVisitDetails = null;
                List<MVCModels.HiDoctor_Reports.DCRChemistVisitDetailsModel> lstDistinctChemist = null;
               
                using (IDbConnection connection = IDbOpenConnection())
                {
                    using (var multi = connection.QueryMultiple(SP_hdGetDCRConsTabChemistVisitDetails,
                                  new { CompanyCode = companyCode, UserCode = userCode, FromDate = fromDate, ToDate = toDate, DCRStatus = dcrStatus },
                                  commandType: CommandType.StoredProcedure))
                    {
                        lstChemistVisitDetails = multi.Read<MVCModels.HiDoctor_Reports.DCRChemistVisitDetailsModel>().ToList();
                        lstDistinctChemist = multi.Read<MVCModels.HiDoctor_Reports.DCRChemistVisitDetailsModel>().ToList();                        
                    }
                }

                MVCModels.HiDoctor_Reports.DCRConsChemistVisitModel objChem = new MVCModels.HiDoctor_Reports.DCRConsChemistVisitModel();
                objChem.lstChemistVisitDetails = lstChemistVisitDetails;
                objChem.lstDistinctChemist = lstDistinctChemist;
                lstChemistVisit.Add(objChem);
            }
            catch
            {
                throw;
            }
            return lstChemistVisit;
        }

        //STOCKIST
        public IEnumerable<MVCModels.HiDoctor_Reports.DCRConsStokistVisitModel> GetDCRConsTabStockistVisitDetails(string companyCode, string userCode, string fromDate, string toDate, string dcrStatus)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.DCRConsStokistVisitModel> lstStock;            
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstStock = connection.Query<MVCModels.HiDoctor_Reports.DCRConsStokistVisitModel>(SP_hdGetDCRConsTabStockistVisit,
                                  new { CompanyCode = companyCode, UserCode = userCode, FromDate = fromDate, ToDate = toDate, DCRStatus = dcrStatus },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstStock;
        }

        //PRODUCT
        public List<MVCModels.HiDoctor_Reports.DCRConsProductDetailsModel> GetDCRConsTabProductDetails(string companyCode, string userCode, string fromDate, string toDate, string dcrStatus)
        {
            List<MVCModels.HiDoctor_Reports.DCRConsProductDetailsModel> lstProductDetails=new List<MVCModels.HiDoctor_Reports.DCRConsProductDetailsModel>();
            try
            {
                List<MVCModels.HiDoctor_Reports.DCRProductDetailsModel> lstProduct = null;
                List<MVCModels.HiDoctor_Reports.DCRDoctorVisitDetailsModel> lstDistinctDoctor = null;

                using (IDbConnection connection = IDbOpenConnection())
                {
                    using (var multi = connection.QueryMultiple(SP_hdGetDCRConsTabProductDetails,
                                  new { CompanyCode = companyCode, UserCode = userCode, FromDate = fromDate, ToDate = toDate, DCRStatus = dcrStatus },
                                  commandType: CommandType.StoredProcedure))
                    {
                        lstProduct = multi.Read<MVCModels.HiDoctor_Reports.DCRProductDetailsModel>().ToList();
                        lstDistinctDoctor = multi.Read<MVCModels.HiDoctor_Reports.DCRDoctorVisitDetailsModel>().ToList();
                    }
                }

                MVCModels.HiDoctor_Reports.DCRConsProductDetailsModel objProd = new MVCModels.HiDoctor_Reports.DCRConsProductDetailsModel();
                objProd.lstProduct = lstProduct;
                objProd.lstDistinctDoctor = lstDistinctDoctor;
                lstProductDetails.Add(objProd);
            }
            catch (Exception)
            {
                throw;
            }
            return lstProductDetails;
        }

        //EXPENSE
        public List<MVCModels.HiDoctor_Reports.DCRConsExpenseDetailsModel> GetDCRConsTabExpenseDetails(string companyCode, string userCode, string fromDate, string toDate, string dcrStatus)
        {
            List<MVCModels.HiDoctor_Reports.DCRConsExpenseDetailsModel> lstExpense = new List<MVCModels.HiDoctor_Reports.DCRConsExpenseDetailsModel>();
            try
            {
                List<MVCModels.HiDoctor_Reports.DCRExpenseDetailsModel> lstExpenseDetails = null;
                List<MVCModels.HiDoctor_Reports.DCRSFCModel> lstSFC = null;

                using (IDbConnection connection = IDbOpenConnection())
                {
                    using (var multi = connection.QueryMultiple(SP_hdGetDCRConsTabExpenseDetails,
                                  new { CompanyCode = companyCode, UserCode = userCode, FromDate = fromDate, ToDate = toDate, DCRStatus = dcrStatus },
                                  commandType: CommandType.StoredProcedure))
                    {
                        lstExpenseDetails = multi.Read<MVCModels.HiDoctor_Reports.DCRExpenseDetailsModel>().ToList();
                        lstSFC = multi.Read<MVCModels.HiDoctor_Reports.DCRSFCModel>().ToList();
                    }
                }

                MVCModels.HiDoctor_Reports.DCRConsExpenseDetailsModel objProd = new MVCModels.HiDoctor_Reports.DCRConsExpenseDetailsModel();
                objProd.lstExpenseDetails = lstExpenseDetails;
                objProd.lstSFC = lstSFC;
                lstExpense.Add(objProd);
            }
            catch (Exception)
            {
                throw;
            }
            return lstExpense;
        }

        //WA
        public IEnumerable<MVCModels.HiDoctor_Reports.DCRWADetailsModel> GetDCRConsTabWADetails(string companyCode, string userCode, string fromDate, string toDate)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.DCRWADetailsModel> lstWA;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstWA = connection.Query<MVCModels.HiDoctor_Reports.DCRWADetailsModel>(SP_hdGetDCRConsWADCRDetails,
                                  new { CompanyCode = companyCode, UserCode = userCode, FromDate = fromDate, ToDate = toDate},
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstWA;
        }
    }
}
