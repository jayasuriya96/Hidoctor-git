using System.Web.Mvc;

namespace HiDoctor_Master
{
    public class HiDoctor_MasterAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "HiDoctor_Master";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "HiDoctor_Master_default",
                "HiDoctor_Master/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
