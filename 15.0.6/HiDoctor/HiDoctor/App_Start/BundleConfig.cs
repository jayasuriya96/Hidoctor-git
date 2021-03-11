using System.Web;
using System.Web.Optimization;

namespace HiDoctor
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            //bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
            //             "~/Scripts/jquery-1.8.3.min.js"));

            //bundles.Add(new ScriptBundle("~/bundles/jquerymobile").Include(
            //            "~/Scripts/jquery.mobile-1.2.0.min.js"));

            //bundles.Add(new ScriptBundle("~/bundles/common").Include(
            //            "~/Scripts/Mobile/mCommon.min.js"));

            //bundles.Add(new ScriptBundle("~/bundles/json").Include(
            //            "~/Scripts/json2.min.js",
            //            "~/Scripts/jsonpath-0.8.0.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include("~/Scripts/Bootstrap/bootstrap.js"));
            bundles.Add(new ScriptBundle("~/bundles/landingpagejs").Include("~/Scripts/HD/DashBoardLanding.js","~/Scripts/HD/rpttable.js"));
            bundles.Add(new StyleBundle("~/bundles/bootstrapcss").Include("~/Content/Bootstrap/bootstrap.css"));
            bundles.Add(new StyleBundle("~/bundles/dashboardlandingcss").Include("~/Content/DashBoard/dashboardLandingpage.css"));


        }
    }
}