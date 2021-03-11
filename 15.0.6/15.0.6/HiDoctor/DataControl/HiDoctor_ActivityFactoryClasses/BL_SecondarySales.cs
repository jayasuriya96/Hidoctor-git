using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MVCModels;


namespace DataControl.HiDoctor_ActivityFactoryClasses
{
    public class BL_SecondarySales
    {
        DAL_SecondarySales _objDALSS = new DAL_SecondarySales();
        DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();

        string Company_Code = string.Empty;
        string User_Code = string.Empty;

        public string UpdateSecondarySalesHeader(string month, string year, string statementDate, string ss_status, string enterdUser, string baseCode, string customerCode, string baseTypeCode, string CustomerEntityType, string ssCode)
        {
            Company_Code = _objCurrentInfo.GetCompanyCode();
            return _objDALSS.UpdateSecondarySalesHeader(Company_Code, month, year, statementDate, ss_status, enterdUser, baseCode, customerCode, baseTypeCode, CustomerEntityType, ssCode);
        }

        public string InsertSecondarySalesHeader(string month, string year, string baseCode, string baseTypeCode, string userCode, string customerCode, string CustomerEntityType, string regionCode, string statementDate, string ss_status, string enterdUser)
        {
            Company_Code = _objCurrentInfo.GetCompanyCode();
            return _objDALSS.InsertSecondarySalesHeader(Company_Code, month, year, baseCode, baseTypeCode, userCode, customerCode, CustomerEntityType, regionCode, statementDate, ss_status, enterdUser);
        }


        public int InsertSecondarySalesDetails(string ssCode, string ss_Code, List<SS_Detail_Entry_Model> lst)
        {
            Company_Code = _objCurrentInfo.GetCompanyCode();
            User_Code = _objCurrentInfo.GetUserCode();
            return _objDALSS.InsertSecondarySalesDetails(Company_Code, User_Code, ssCode, ss_Code, lst);
        }
    }
}
