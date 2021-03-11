using System.Web;
using System.Web.Optimization;

namespace HiDoctor {
    public class BundleMobileConfig {
        public static void RegisterBundles(BundleCollection bundles) {

            // JavaScript
            bundles.Add(new ScriptBundle("~/bundles/jquerymobile").Include(
                        "~/Scripts/jquery.mobile-1.3.1.js"));
            bundles.Add(new ScriptBundle("~/bundles/common").Include(
                        "~/Scripts/Mobile/mCommon.js"));
            bundles.Add(new ScriptBundle("~/bundles/json").Include(
                        "~/Scripts/json2.js",
                        "~/Scripts/jsonpath-0.8.0.js"));
            bundles.Add(new ScriptBundle("~/bundles/easytimepickerjs").Include(
            "~/Scripts/jquery.easytimepicker.js",
            "~/Scripts/jquery.easytimepicker.mobile.js"
           ));


            bundles.Add(new ScriptBundle("~/bundles/Loginjs").Include(
                        "~/Scripts/Mobile/mLogIn.js"
                       ));
            bundles.Add(new ScriptBundle("~/bundles/dcrcalendar").Include(
                        "~/Areas/HiDoctor_Activity/Scripts/Mobile/mDCRCalendar.js"
                       ));
           

            bundles.Add(new ScriptBundle("~/bundles/dcrhomejs").Include(
                        "~/Areas/HiDoctor_Activity/Scripts/Mobile/mHome.js"
                       ));
            bundles.Add(new ScriptBundle("~/bundles/dcrheaderjs").Include(
                "~/Areas/HiDoctor_Activity/Scripts/Mobile/mDCRHeader.js"
                       ));
                bundles.Add(new ScriptBundle("~/bundles/dcrdoctorjs").Include(
                "~/Areas/HiDoctor_Activity/Scripts/Mobile/mDCRDoctorVisit.js"
                       ));
                
            bundles.Add(new ScriptBundle("~/bundles/doctorselectionjs").Include(
                "~/Areas/HiDoctor_Activity/Scripts/Mobile/mDoctorSelection.js"
                       ));
            bundles.Add(new ScriptBundle("~/bundles/dcrapprovaljs").Include(
                "~/Areas/HiDoctor_Activity/Scripts/Mobile/mDCRApproval12.6.11.js"
                       ));
            bundles.Add(new ScriptBundle("~/bundles/dcrleaveentryjs").Include(
                "~/Areas/HiDoctor_Activity/Scripts/Mobile/mLeaveEntry.js"
                       ));
            bundles.Add(new ScriptBundle("~/bundles/dcrstockiestexpensejs").Include(
                "~/Areas/HiDoctor_Activity/Scripts/Mobile/mStockiestExpense.js"
                       ));
            bundles.Add(new ScriptBundle("~/bundles/mobileReportsjs").Include(
               "~/Areas/HiDoctor_Activity/Scripts/Mobile/mReports12.6.11.js"
                      ));
                    
            // DCR V4 mobile Js
            bundles.Add(new ScriptBundle("~/bundles/dcrV4headerjs").Include(
              "~/Areas/HiDoctor_Activity/Scripts/Mobile/DCRV4/mDCRV4Header12.6.11.js"
                     ));
            bundles.Add(new ScriptBundle("~/bundles/dcrV4stockiestexpensejs").Include(
              "~/Areas/HiDoctor_Activity/Scripts/Mobile/DCRV4/mDCRV4StockistExpense12.6.11.js"
                     ));
            bundles.Add(new ScriptBundle("~/bundles/DCRV4dcrhomejs").Include(
               "~/Areas/HiDoctor_Activity/Scripts/Mobile/DCRV4/mHome.js"
              ));
            bundles.Add(new ScriptBundle("~/bundles/DCRV4doctorselectionjs").Include(
               "~/Areas/HiDoctor_Activity/Scripts/Mobile/DCRV4/mDCRV4DoctorSelection.js"
              ));
            bundles.Add(new ScriptBundle("~/bundles/mDCRV4DoctorVisitjs").Include(
                "~/Areas/HiDoctor_Activity/Scripts/Mobile/DCRV4/mDCRV4DoctorVisit12.6.11.js"
               ));
            bundles.Add(new ScriptBundle("~/bundles/mDCRDetailedProductsjs").Include(
                "~/Areas/HiDoctor_Activity/Scripts/Mobile/DCRV4/mDCRV4DetailedProductsEntry.js"
               ));
            bundles.Add(new ScriptBundle("~/bundles/mDCRDoctorAccompanistjs").Include(
                "~/Areas/HiDoctor_Activity/Scripts/Mobile/DCRV4/mDCRV4DoctorAccompanistEntry.js"
               ));
                    

            // Style Sheet
            bundles.Add(new StyleBundle("~/MobileBundle/sitemobilecss").Include(
                      "~/Content/Mobile/css/Site.Mobile.css"));
            bundles.Add(new StyleBundle("~/MobileBundle/jquerymobilecss").Include(
                      "~/Content/Mobile/jquery.mobile-1.3.1.css"));
            bundles.Add(new StyleBundle("~/MobileBundle/jquerymobilestructure").Include(
                      "~/Content/Mobile/jquery.mobile.structure-1.3.1.css"));
            bundles.Add(new StyleBundle("~/MobileBundle/mobilethemecss").Include(
                      "~/Content/Mobile/jquery.mobile.theme-1.3.1.css"));

        }
    }
}