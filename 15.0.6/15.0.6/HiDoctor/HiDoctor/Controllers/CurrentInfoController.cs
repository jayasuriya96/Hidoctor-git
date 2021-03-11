#region Using
using System;
using System.Web;
using System.Web.Mvc;
using System.Data;
#endregion Using

namespace HiDoctor.Controllers
{
    public class CurrentInfoController : Controller
    {
        #region System generated
        //
        // GET: /DataControl.CurrentInfo/


        #endregion System generated

        DataControl.Data _objData = new DataControl.Data();
        DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();

        public void UserAuthendication(string companyCode, string userCode, string sessionID)
        {
            //System.Web.HttpContext.Current.Session["DB_CON_STR"] = null;

            _objCurrentInfo.UserAuthendication(companyCode, userCode, sessionID);
        }





    }
}