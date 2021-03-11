#region Using
using DataControl.Abstraction;
using DataControl.EnumType;
using DataControl;
using System.Data;
using System.Text;
using System;
using DataControl.Impl;
using System.Threading.Tasks;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using System.Collections;
using System.Web;
#endregion Using

namespace DataControl.HD_MasterFactoryClasses
{
    public class BL_StockiestInheritance
    {
        #region Private Variable
        private CurrentInfo _objCurrentInfo;
        public DAL_StockiestInheritance _objDALStockiest;

        #endregion Private Variable

        public DataSet GetCustomerData(string entity, string tableName, string mode, string regionCode, int pageNum, string pageName)
        {
            _objDALStockiest = new DAL_StockiestInheritance();
            DataSet dsDoctorEntityFields = _objDALStockiest.GetCustomerData(entity, tableName, mode, regionCode, 0, "SINGLE");

            return dsDoctorEntityFields;
        }

        public string ShiftStockiest(string companyCode, List<MVCModels.StockiestHeaderDetails> lstStock, List<MVCModels.StockiestHeaderDetails> lstStock1, string targetRegionCode, string customerCodes)
        {
            string[] regionCode = targetRegionCode.Split('^');

            DAL_StockiestInheritance  _objDALStockiest = new DAL_StockiestInheritance();
            string result = string.Empty;
            string rowsAffected = string.Empty;
            SPData objData = new SPData();
            DataControl.CurrentInfo _objcurrentInfo = new CurrentInfo();
          
            if (lstStock != null && lstStock.Count > 0)
            {
                lstStock.ForEach
                    (
                    s => s.Company_Code = _objcurrentInfo.GetCompanyCode()
                    );
                rowsAffected = _objDALStockiest.GetCustomerData1(lstStock,lstStock1,regionCode,customerCodes);
                if (rowsAffected !="0")
                {
                    result = "Inserted Successfully";
                }
            }
            return result;
        }

        public List<string> GetStokiestInheritanceStatus(string companyCode, string customerCode, string customerEntityType,string region_Code)
        {
            DAL_StockiestInheritance _objDALStockiest = new DAL_StockiestInheritance();
            List<string> result = _objDALStockiest.GetStokiestInheritanceStatus(companyCode, customerCode, customerEntityType, region_Code);
            return result;
        }

        public string InheritStockiest(string companyCode, List<MVCModels.StockiestHeaderDetails> lstStock, string targetRegionCode)
        {

            DAL_StockiestInheritance _objDALStockiest = new DAL_StockiestInheritance();
            SPData objData = new SPData();
            string result = string.Empty;
            string rowsAffected = string.Empty;
            string[] regionCode = targetRegionCode.Split('^');
            DataControl.CurrentInfo _objcurrentInfo = new CurrentInfo();
            //for (int i = 0; i < lstStock.Count; i++)
            //{
            //    long SeqNum =objData.GetSeqNumber("SEQ_TBL_SFA_STOCKIEST_INHERITANCE");
            //    lstStock[i].Customer_Code = SeqNum.ToString();
            //}

            if (lstStock != null && lstStock.Count > 0)
            {
                lstStock.ForEach
                    (
                    s => s.Company_Code = _objcurrentInfo.GetCompanyCode()
                    );


                rowsAffected = _objDALStockiest.InheritStockiest(lstStock, regionCode, out result);
                if (rowsAffected == "-2")
                {
                    return result;
                }
                else if (rowsAffected !="0")
                {
                    result = "Inserted Successfully";
                }
            }
            return result;
        }


    }
}

