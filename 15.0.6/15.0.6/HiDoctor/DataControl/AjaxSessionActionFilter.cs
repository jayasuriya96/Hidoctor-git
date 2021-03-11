using System.Web.Mvc;


namespace DataControl
{
    public class AjaxSessionActionFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var request = filterContext.HttpContext.Request;
            var response = filterContext.HttpContext.Response;
            var session = filterContext.HttpContext.Session;

            if (session["Comp_Code"] == null)
            {
                if (request.IsAjaxRequest())
                {
                    response.StatusCode = 590;
                }
                else
                {
                    var url = new UrlHelper(filterContext.HttpContext.Request.RequestContext);
                    response.Redirect("~/Home/SessionExpiry/");
                    //response.Redirect(url.Action("SessionExpiry", "Home"));
                }

                filterContext.Result = new EmptyResult();
            }

            base.OnActionExecuting(filterContext);
        }
    }
}