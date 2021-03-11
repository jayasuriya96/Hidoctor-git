using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using MVCModels;

namespace DataControl.HiDoctor_ActivityFactoryClasses
{
   public class Bl_SSCustomer
    {
       private DAL_SSCustomer _objSSS = new DAL_SSCustomer();

        #region - SS for CustomerWise
        /// <summary>
        /// Get Approved ss based on region
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <returns></returns>
       public List<SecondarySalesforCustomerModel> GetApprovedSS(string companyCode, string regionCode, int month, int year)
       {
           return _objSSS.GetApprovedSS(companyCode, regionCode, month, year);
       }

         /// <summary>
        /// Get approved customers for selectd region
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
       public List<SecondarySalesforCustomerModel> GetApprovedCustomer(string companyCode, string regionCode)
       {
           return _objSSS.GetApprovedCustomer(companyCode, regionCode);
       }
        /// <summary>
        /// Get ss product details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="baseCode"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <returns></returns>
       public List<SecondarySalesDetailsforCustomerModel> GetSSProductDetails(string companyCode, string regionCode, string baseCode, int month, int year)
       {
          return  _objSSS.GetSSProductDetails(companyCode, regionCode, baseCode, month, year);
       }

       /// <summary>
        /// Insert Customer product quantity
        /// </summary>
        /// <param name="lstSSCustomerProducts"></param>
        /// <returns></returns>
       public int InsertSSCusotmerProduct(List<SecondarySalesCustomerProductDeatilsModel> lstSSCustomerProducts,string formstatus)
       {
           return _objSSS.InsertSSCusotmerProduct(lstSSCustomerProducts,formstatus);
       }

       public List<SecondarySalesforCustomerModel> GetApprovedCustomerForEdit(string companyCode, string regionCode)
       {
           return _objSSS.GetApprovedCustomerForEdit(companyCode, regionCode);
       }

      //public List<SecondarySalesforCustomerModel> GetApprovedChemist(string companyCode, string regionCode)
      //{
      //   return _objSSS.GetApprovedChemist(companyCode,regionCode);
      //}
        #endregion - SS for CustomerWise
    }
}
