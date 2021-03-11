using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Practices.EnterpriseLibrary.Logging;

namespace DataControl.Impl
{
    public class ExceptionHandler
    {
        public static bool WriteLog(Exception ex, Dictionary<string, string> dic)
        {
            StringBuilder strBuilder = new StringBuilder();
            LogEntry logEntry = new LogEntry();
            logEntry.Title = System.Web.HttpContext.Current.Request.Url.AbsoluteUri.ToString();
            logEntry.AppDomainName = AppDomain.CurrentDomain.BaseDirectory.ToString();
            logEntry.MachineName = System.Web.HttpContext.Current.Server.MachineName.ToString();
            logEntry.Message = ex.Message.ToString();
            logEntry.TimeStamp = DateTime.Now;
            if (dic != null)
            {
                foreach (KeyValuePair<string, string> entry in dic)
                {
                    logEntry.ExtendedProperties.Add(entry.Key.ToString(), entry.Value.ToString());
                }
            }
            if (System.Web.HttpContext.Current.Session["Comp_Code"] != null)
            {
                logEntry.ExtendedProperties.Add("Session Company Code :", System.Web.HttpContext.Current.Session["Comp_Code"].ToString());
                logEntry.ExtendedProperties.Add("Session User Name :", System.Web.HttpContext.Current.Session["User_Name"].ToString());
                logEntry.ExtendedProperties.Add("Session Region Name :", System.Web.HttpContext.Current.Session["Region_Name"].ToString());
                logEntry.ExtendedProperties.Add("Session User Code :", System.Web.HttpContext.Current.Session["User_Code"].ToString());
                logEntry.ExtendedProperties.Add("Session Region Code :", System.Web.HttpContext.Current.Session["Region_Code"].ToString());
                logEntry.ExtendedProperties.Add("Session User Type Code :", System.Web.HttpContext.Current.Session["User_Type_Code"].ToString());
            }
            else
            {
                logEntry.ExtendedProperties.Add("Session : ", "-- No session values available --");
            }
            logEntry.ExtendedProperties.Add("Exception StackTrace :", ex.StackTrace.ToString());
            Logger.Write(logEntry);
            return true;
        }
    }
}
