using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using DataControl;

namespace HiDoctor_Master.Controllers
{
    public class AppMappingController : Controller
    {
        //
        // GET: /AppMapping/

        public ActionResult Index()
        {
            return View();
        }
        public ActionResult CompanyAppMapping()
        {
            return View();
        }

        public ActionResult AppUserMapping()
        {
            return View();
        }

        public string GetAppDetails()
        {
            CurrentInfo _objCurr = new CurrentInfo();
            BLMaster _objMaster = new BLMaster();
            StringBuilder strContent = new StringBuilder();
            int rowNo = 0;
            strContent.Append("<table class='table table-striped'><thead><tr><th><input type='checkbox' id='bulkcheckDetails' name='chkWideSelect' onclick='fnAppSelectAll()'/></th><th>App Name</th>");
            strContent.Append("</tr></thead>");
            try
            {
                IEnumerable<MVCModels.CompanyAppMappingModel> lstApp = null;
              
                lstApp = _objMaster.GetAppDetail();
                IEnumerable<MVCModels.CompanyAppMappingModel> lstmappedApp = null;
                lstmappedApp = _objMaster.GetCompanyAppMappedDetail(_objCurr.GetCompanyCode());
                if (lstApp != null)
                {
                    foreach (var app in lstApp)
                    {
                        rowNo++;
                        strContent.Append("<tr><td style='text-align:left'>");
                         var filteredList = lstmappedApp.AsEnumerable().Where(n => n.App_Name.ToString() == app.App_Name.ToString() && n.Platform.ToString() == app.Platform.ToString()).ToList();
                         if (filteredList.Count > 0)
                         {
                             strContent.Append("<input  type='checkbox'  id='chkSelect_" + rowNo + "' name='chkSelect' checked=checked />");
                         }
                         else
                         {
                             strContent.Append("<input  type='checkbox'  id='chkSelect_" + rowNo + "' name='chkSelect' />");
                         }
                     
                        strContent.Append("<input type='hidden' id='hdnApprovlDetails_" + rowNo + "'");
                        strContent.Append("value='" + app.App_Id + "|" + app.App_Suite_Id + "|" + app.App_Name + "|" + app.Platform + "'/>");
                        strContent.Append("</td>");
                        strContent.Append("<td>" + app.App_Name + "( " + app.Platform + ")</td>");
                        strContent.Append("</tr>");
                    }

                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
            }
            return strContent.ToString();

        }

        public string InsertCompanyAppMapping(string appDetails)
        {
            CurrentInfo _objCurr = new CurrentInfo();
            BLMaster _objMaster = new DataControl.BLMaster();
            return _objMaster.UpdateCompanyApp(_objCurr.GetCompanyCode(), appDetails, _objCurr.GetUserCode());

        }
    }
}
