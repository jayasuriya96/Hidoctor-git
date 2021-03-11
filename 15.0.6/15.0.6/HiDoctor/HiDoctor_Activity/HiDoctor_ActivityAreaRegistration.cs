using System.Web.Mvc;

namespace HiDoctor_Activity
{
    public class HiDoctor_ActivityAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "HiDoctor_Activity";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "HiDoctor_Activity_default",
                "HiDoctor_Activity/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
