using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Collections;

namespace DataControl.HiDoctor_ReportsFactoryClasses
{
    public class BL_DCRConsolidated
    {
        #region Private Variables
        HiDoctor_ReportsFactoryClasses.DAL_DCRConsolidated _objDAL = new HiDoctor_ReportsFactoryClasses.DAL_DCRConsolidated();
        #endregion Private Variables

        public List<MVCModels.HiDoctor_Reports.DCRConsHeaderModel> GetDCRConsTabHeaderDetails(string companyCode, string userCode, string fromDate, string toDate, string dcrStatus)
        {
            try
            {
                return _objDAL.GetDCRConsTabHeaderDetails(companyCode, userCode, fromDate, toDate, dcrStatus);
            }
            catch
            {
                throw;
            }
        }

        public List<MVCModels.HiDoctor_Reports.DCRConsDoctorVisitModel> GetDCRConsTabDoctorVisitDetails(string companyCode, string userCode, string fromDate, string toDate, string dcrStatus)
        {
            try
            {
                return _objDAL.GetDCRConsTabDoctorVisitDetails(companyCode, userCode, fromDate, toDate, dcrStatus);
            }
            catch
            {
                throw;
            }
        }

        public List<MVCModels.HiDoctor_Reports.DCRConsChemistVisitModel> GetDCRConsTabChemistVisitDetails(string companyCode, string userCode, string fromDate, string toDate, string dcrStatus)
        {
            try
            {
                return _objDAL.GetDCRConsTabChemistVisitDetails(companyCode, userCode, fromDate, toDate, dcrStatus);
            }
            catch
            {
                throw;
            }
        }

        public IEnumerable<MVCModels.HiDoctor_Reports.DCRConsStokistVisitModel> GetDCRConsTabStockistVisitDetails(string companyCode, string userCode, string fromDate, string toDate, string dcrStatus)
        {
            try
            {
                return _objDAL.GetDCRConsTabStockistVisitDetails(companyCode, userCode, fromDate, toDate, dcrStatus);
            }
            catch
            {
                throw;
            }
        }

        public List<MVCModels.HiDoctor_Reports.DCRConsProductDetailsModel> GetDCRConsTabProductDetails(string companyCode, string userCode, string fromDate, string toDate, string dcrStatus)
        {
            try
            {
                return _objDAL.GetDCRConsTabProductDetails(companyCode, userCode, fromDate, toDate, dcrStatus);
            }
            catch
            {
                throw;
            }
        }
        public List<MVCModels.HiDoctor_Reports.DCRConsExpenseDetailsModel> GetDCRConsTabExpenseDetails(string companyCode, string userCode, string fromDate, string toDate, string dcrStatus)
        {
            try
            {
                return _objDAL.GetDCRConsTabExpenseDetails(companyCode, userCode, fromDate, toDate, dcrStatus);
            }
            catch
            {
                throw;
            }
        }

        public IEnumerable<MVCModels.HiDoctor_Reports.DCRWADetailsModel> GetDCRConsTabWADetails(string companyCode, string userCode, string fromDate, string toDate)
        {
            try
            {
                return _objDAL.GetDCRConsTabWADetails(companyCode, userCode, fromDate, toDate);
            }
            catch
            {
                throw;
            }
        }


    }
}
