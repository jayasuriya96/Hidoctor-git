using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HiDoctor.Controllers
{
    public class KangleIntegrationController : Controller
    {
        //
        // GET: /KangleIntegration/
        DataControl.DAL_KangleIntegration obj = new DataControl.DAL_KangleIntegration();


        public void KangleRequestLog(string methodName, string data, string status, string message)
        {
            obj.InsertRequest(methodName, data, status, message);
        }

        public string CheckKangleAccess()
        {
            return obj.CheckKangleAccess().ToString();
        }
    }
}
