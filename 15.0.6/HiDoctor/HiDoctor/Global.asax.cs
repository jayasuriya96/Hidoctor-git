using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Web.WebPages;

namespace HiDoctor
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            DisplayModeProvider.Instance.Modes.Insert(0, new
            DefaultDisplayMode("Mobi")
            {
                ContextCondition = (context => context.GetOverriddenUserAgent().IndexOf
                    ("Mobi", StringComparison.OrdinalIgnoreCase) >= 0 || context.GetOverriddenUserAgent().IndexOf
                    ("Android", StringComparison.OrdinalIgnoreCase) >= 0)
            });

            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            BundleMobileConfig.RegisterBundles(BundleTable.Bundles);
            AuthConfig.RegisterAuth();
        }
        protected void Session_Start()
        {
            System.Web.HttpContext.Current.Session["Comp_Code"] = null;
        }

        //protected void Application_BeginRequest()
        //{
        //    MiniProfiler.Start();
        //}
        //protected void Application_EndRequest()
        //{
        //    MiniProfiler.Stop();
        //}
    }

    public class BuildNumber
    {
        public static string BuildNo = "12.8.6.5";
    }
    public class BuildVersion
    {
        public static string KangleVersion = "4.0";
    }
    public class BuildNo
    {
        public static string Build_No = DateTime.Now.Ticks.ToString();
    }
    public class LatestBuildVersion
    {
        public static string LatestVersion = "15.0.6";
    }
}