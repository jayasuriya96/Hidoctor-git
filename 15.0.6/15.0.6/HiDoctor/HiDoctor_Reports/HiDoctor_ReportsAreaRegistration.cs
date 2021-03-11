using System.Web.Mvc;

namespace HiDoctor_Reports
{
    public class HiDoctor_ReportsAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "HiDoctor_Reports";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "HiDoctor_Reports_default",
                "HiDoctor_Reports/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
