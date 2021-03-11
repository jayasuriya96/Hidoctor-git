using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.SessionState;

namespace HiDoctor_Reports.Controllers
{
     [SessionState(SessionStateBehavior.ReadOnly)]
    public class ActivityCountController : Controller
    {
        //
        // GET: /ActivityCount/  
        private DataControl.SPData _objSPData = new DataControl.SPData();
        public DataSet dsActivity = new DataSet();
        public DataSet dsSunday = new DataSet();
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();   
        public ActionResult Index()
        {
            return View();
        }
        public void SetActivityCount(string userCodes, string regionCodes, string startDate, string endDate, string dcrStatus)
        {          
            string companyCode = _objcurrentInfo.GetCompanyCode();

            dsActivity = _objSPData.GetActivityCount(companyCode, userCodes, regionCodes, startDate, endDate, dcrStatus);

            SetSundayCount(userCodes, regionCodes, startDate, endDate, dcrStatus);
        }

        private void SetSundayCount(string userCodes, string regionCodes, string startDate, string endDate, string dcrStatus)
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();

            dsSunday = _objSPData.GetSundayCount(companyCode, userCodes, regionCodes, startDate, endDate, dcrStatus);
        }

        public double GetFlagCount(string userCode, char flag)
        {
            double count = 0.0;

            if (dsActivity != null && dsActivity.Tables.Count > 0 && dsActivity.Tables[0].Rows.Count > 0)
            {
                DataRow[] rowFilter;

                rowFilter = dsActivity.Tables[0].Select("User_Code = '" + userCode + "' AND Flag = '" + flag + "'");
                if (rowFilter.Length > 0)
                {
                    count = Convert.ToDouble(rowFilter[0]["Count"].ToString());
                }
            }

            return count;
        }

        public double GetSundayCount(string userCode)
        {
            double count = 0.0;

            if (dsSunday != null && dsSunday.Tables.Count > 0 && dsSunday.Tables[0].Rows.Count > 0)
            {
                DataRow[] rowFilter;

                rowFilter = dsSunday.Tables[1].Select("User_Code = '" + userCode + "'");
                if (rowFilter.Length > 0)
                {
                    count = Convert.ToDouble(rowFilter[0]["Sunday_Count"].ToString());
                }
                else
                {
                    count = Convert.ToDouble(dsSunday.Tables[0].Rows[0]["Sunday_Count"].ToString());
                }
            }

            return count;
        }

        public object GetHolidayCount(string userCode, string regionCode, string startDate, string endDate, string dcrStatus, string mode)
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            DataSet dsHoliday = new DataSet();

            dsHoliday = _objSPData.GetHolidayCount(companyCode, userCode, regionCode, startDate, endDate, dcrStatus);

            if (mode.Trim().ToUpper() == "COUNT")
            {
                return dsHoliday.Tables[0].Rows.Count;
            }
            else // DETAILS
            {
                return dsHoliday;
            }
        }
    }
}
