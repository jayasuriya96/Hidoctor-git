using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;

using HiDoctor_Master.Controllers;
using System.ComponentModel;
using ElmahWrapper;


namespace HiDoctor_Master.Models
{

    public class ExpensesMapping
    {
        DataControl.Data objData = new DataControl.Data();
        DataControl.CurrentInfo _ObjCurInfo = new DataControl.CurrentInfo();

        [DisplayName("Division")]
        public string DivisionCode { get; set; }

        [DisplayName("Region Type")]
        public string RegionType { get; set; }

        public string Classification { get; set; }

        [DisplayName("Expense Group")]
        public string ExpenseGroup { get; set; }
        public string Regions { get; set; }
        public string RegionCode { get; set; }
        public string RegionName { get; set; }

        [DisplayName("User Type")]
        public string UserType { get; set; }
        public string UserCode { get; set; }
        public string UserName { get; set; }

        //Fill DDL Division , Region-Type , Region-Classification , User-Type , Expense-Header-Group
        #region Get ExpenseMapping Master Data
        public DataSet GetExpenseMappingMasterData()
        {
            DataSet ds = new DataSet();


            objData.OpenConnection(_ObjCurInfo.GetCompanyCode());
            {
                string StrSQL = "EXEC SP_hdGetExpenseMappingMasterData " + _ObjCurInfo.GetCompanyCode();
                ds = objData.ExecuteDataSet(StrSQL);
                objData.CloseConnection();
            }
            return ds;
        }
        #endregion

        //Get Region Names Filtered By Division , Region ,Classification , Expense Group
        #region  Get Regions
        public DataTable GetRegions(string DivisionCode, string RegionTypeCode, string RegionClassificatinCode, string ExpenseGroup)
        {
            DataSet ds = new DataSet();

            objData.OpenConnection(_ObjCurInfo.GetCompanyCode());
            {
                string StrSQL = "EXEC SP_hd_GetDivisionRegionMasterValues '" + DivisionCode + "','" + RegionTypeCode + "','" + RegionClassificatinCode + "','" + ExpenseGroup + "','" + _ObjCurInfo.GetCompanyCode() + "'";
                ds = objData.ExecuteDataSet(StrSQL);
                objData.CloseConnection();
            }
            DataTable dt = new DataTable();
            if (ds.Tables.Count > 0)
                if (ds.Tables[0].Rows.Count > 0)
                    dt = ds.Tables[0];
            return dt;
        }
        #endregion

        //Get User Details Filtered By Division , User-Type , Expense Group
        #region  Get Users
        public DataTable GetUsers(string DivisionCode, string UserTypeCode, string ExpenseGroup, string regionClassification, string regionTypeCode)
        {
            DataSet ds = new DataSet();

            objData.OpenConnection(_ObjCurInfo.GetCompanyCode());
            {
                string StrSQL = "EXEC SP_hd_GetDivisionUserMasterValues '" + DivisionCode + "','" + UserTypeCode + "','" + regionClassification + "','" + regionTypeCode + "','" + ExpenseGroup + "','" + _ObjCurInfo.GetCompanyCode() + "'";
                ds = objData.ExecuteDataSet(StrSQL);
                objData.CloseConnection();
            }
            DataTable dt = new DataTable();
            if (ds.Tables.Count > 0)
                if (ds.Tables[0].Rows.Count > 0)
                    dt = ds.Tables[0];
            return dt;
        }
        #endregion

        #region  Expense Insert
        public string ExpenseMappingInsert(string strQuery)
        {
            objData.OpenConnection(_ObjCurInfo.GetCompanyCode());
            {
                //string StrSQL = "EXEC SP_SFA_User_Master_Update_Expense_Group '" + UserCode + "','" + ExpenseGroup + "','" + Checked + "','" + "COM00000009" + "'";                
                try
                {
                    objData.executeStringQuery(strQuery);
                    return "SUCCESS";
                }
                catch (Exception ex)
                {
                    ErrorLog.LogError(ex, "ExpenseMappingInsert()");
                    return "FAIL";
                }
                finally
                {
                    objData.CloseConnection();
                }
            }
        }
        #endregion

    }
}