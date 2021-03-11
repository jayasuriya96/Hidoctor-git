#region Using
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataControl;
#endregion Using

namespace HiDoctor_Activity.Controllers
{
    [AjaxSessionActionFilter]
    public class DCRReportController : Controller
    {
        #region Index
        //
        // GET: /DCRReport/

        public ActionResult Index(string dcrActualDate, string flag)
        {
            string today = DateTime.Now.ToShortDateString();
            ViewBag.possibleDays = GetNextTwoPossibleDays(today);
            ViewBag.flag = flag;
            ViewBag.dcrDate = dcrActualDate;
            return View();
        }
        #endregion Index

        #region Private Variables
       DataControl.CurrentInfo objCurr = new DataControl.CurrentInfo();
        DataControl.Data objData = new DataControl.Data();
        #endregion Private Variables

        #region Private Method
        private string GetNextTwoPossibleDays(string dcrDate)
        {
            try
            {
                string possibleDays = string.Empty;
                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    possibleDays = Convert.ToString(objData.ExecuteScalar("exec SP_hdGetNextTwoPossibleDays '" + objCurr.GetCompanyCode() + "','" + objCurr.GetUserCode() + "','" + objCurr.GetRegionCode() + "','" + dcrDate + "'"));
                }
                return possibleDays;
            }
            finally
            {
                objData.CloseConnection();
            }
         

           
        }
        #endregion Private Method
    }
}
