using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace HiDoctor
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                  "Default", // Route name
               "{controller}/{action}/{id}", // URL with parameters
               new { controller = "Home", action = "Index", id = UrlParameter.Optional },
               new[] { "HiDoctor.Controllers" }
            );

        //    routes.MapRoute(
        //         "Reports/DCRConsoliadteReport/", // Route name
        //      "DCRConsoliadteReport/DCRConsolidateNG/{CompanyCode}/{UserCode}/{FromDate}/{ToDate}/{Status}", // URL with parameters
        //      new { controller = "DCRConsolidatedReport", action = "DCRConsolidateNG", },
        //      new[] { "HiDoctor_Reports.Controllers" }
        //   );

        //    routes.MapRoute(
        //         "DoctorChemistMetMongoReport", // Route name
        //      "Reports/DoctorChemistMetMongoReport/{CompanyCode}/{userCode}/{startDate}/{endDate}", // URL with parameters
        //      new { controller = "Reports", action = "DoctorChemistMetMongoReport", },
        //      new[] { "HiDoctor_Reports.Controllers" }
        //   );

        //            routes.MapRoute(
        //     "UserPerday", // Route name
        //  "Reports/NextGenUserPerDayReport/{CompanyCode}/{userCode}/{DCRDate}", // URL with parameters
        //  new { controller = "Reports", action = "NextGenUserPerDayReport", },
        //  new[] { "HiDoctor_Reports.Controllers" }
        //);

            //routes.MapRoute(
            //   name: "DoctorChemistMetMongoReport",
            //   url: "Reports/DoctorChemistMetMongoReport/{userCode}/{startDate}/{endDate}",
            //   defaults: new { controller = "Reports", action = "DoctorChemistMetMongoReport" },

        }
    }
}