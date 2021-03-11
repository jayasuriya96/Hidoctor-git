#region Using
using System;
using System.Web;
using System.Data;
using DataControl;
#endregion Using

namespace HiDoctor_Activity.Controllers
{
    [AjaxSessionActionFilter]
    public class DCRExpense
    {
        #region Private Variables
        private MasterController objMaster = new MasterController();
        private DataControl.CurrentInfo objCurr = new DataControl.CurrentInfo();
        private DataControl.SPData objSP = new DataControl.SPData();
        private DataControl.Data objData = new DataControl.Data();
        #endregion Private Variables

        #region Public Methods      

        public double GetExpenseSum(string dcrActualDate, string mode, string expenseTypeCode)
        {
            try
            {
                DateTime dcrDate = new DateTime();
                double sum = 0.0;
                string fromDate = string.Empty, toDate = string.Empty;
                int startDay = 0, endDay = 0;

                string expenseMode = mode.ToUpper();
                dcrDate = Convert.ToDateTime(dcrActualDate);

                switch (expenseMode)
                {
                    case "MONTHLY":
                        startDay = 1;
                        endDay = DateTime.DaysInMonth(dcrDate.Year, dcrDate.Month);

                        fromDate = Convert.ToString(dcrDate.Year.ToString() + "-" + dcrDate.Month.ToString() + "-" + startDay.ToString());
                        toDate = Convert.ToString(dcrDate.Year.ToString() + "-" + dcrDate.Month.ToString() + "-" + endDay.ToString());
                        sum = GetSum(fromDate, toDate, expenseTypeCode);
                        break;

                    case "YEARLY":
                        fromDate = Convert.ToString(dcrDate.Year.ToString() + "-01-01");
                        toDate = Convert.ToString(dcrDate.Year.ToString() + "-12-31");
                        sum = GetSum(fromDate, toDate, expenseTypeCode);
                        break;

                    case "WEEKLY":
                        objData.OpenConnection(objCurr.GetCompanyCode());
                        {
                            sum = Convert.ToDouble(objData.ExecuteScalar("exec SP_hdGetWeeklyExpenseSum '" + objCurr.GetCompanyCode() + "','" + objCurr.GetUserCode() + "','" + dcrDate + "','" + expenseTypeCode + "'"));
                        }
                        objData.CloseConnection();
                        break;

                    //case "FORTNIGHTLY":
                    //    if (dcrDate.Day > 15)
                    //    {
                    //        startDay = 16;
                    //        endDay = DateTime.DaysInMonth(dcrDate.Year, dcrDate.Month);
                    //    }
                    //    else
                    //    {
                    //        startDay = 1;
                    //        endDay = 15;
                    //    }
                    //    fromDate = Convert.ToString(dcrDate.Year.ToString() + "-" + dcrDate.Month.ToString() + "-" + startDay.ToString());
                    //    toDate = Convert.ToString(dcrDate.Year.ToString() + "-" + dcrDate.Month.ToString() + "-" + endDay.ToString());
                    //    sum = GetSum(fromDate, toDate, expenseTypeCode);
                    //    break;                        
                    default:
                        break;
                }
                return sum;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public bool InsertExpense(string expenseContent, string dcrDate, string dcrStatus, string dailyAllowance, string dcrFlag)
        {
            try
            {
                bool flag = false;
                string result = string.Empty;
                result = objSP.InsertExpense(dcrDate, dcrStatus, expenseContent, dailyAllowance, dcrFlag);
                if (result == "SUCCESS")
                {
                    flag = true;
                }

                return flag;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #endregion Public Methods

        #region Private Method
        private double GetSum(string fromDate, string toDate, string expenseTypeCode)
        {
            try
            {
                string companyCode = objCurr.GetCompanyCode();
                string userCode = objCurr.GetUserCode();
                double sum = 0.0;

                objData.OpenConnection(companyCode);
                {
                    sum = Convert.ToDouble(objData.ExecuteScalar("exec SP_hdGetExpenseSum '" + companyCode + "','" + userCode + "','" + fromDate + "','" + toDate + "','" + expenseTypeCode + "'"));
                }
              
                return sum;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objData.CloseConnection();
            }
        }
        #endregion Private Method
    }
}