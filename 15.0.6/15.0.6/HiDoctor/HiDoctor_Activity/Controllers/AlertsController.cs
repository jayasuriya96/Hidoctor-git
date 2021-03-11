using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataControl;
using System.Net;

namespace HiDoctor_Activity.Controllers
{
    [AjaxSessionActionFilter]
    public class AlertsController : Controller
    {
        //
        // GET: /Alerts/
        /// <summary>
        /// View page for displaying alerts
        /// </summary>
        CurrentInfo _objCurrentInfo;
        public ActionResult Index()
        {
            _objCurrentInfo = new CurrentInfo();
            ViewBag.CompanyCode = _objCurrentInfo.GetCompanyCode();
            ViewBag.LoggedUserName = _objCurrentInfo.GetUserName();
            ViewBag.LoggedEmployeeName = _objCurrentInfo.GetEmployeeName();
            ViewBag.loggedUserTypeName = _objCurrentInfo.GetUserTypeName();
            ViewBag.RequestUserCode = _objCurrentInfo.GetUserCode();
            return View();
        }
       
        public string ConvertHtmlToPdf()
        {
            DataControl.CurrentInfo objCurInfo = new CurrentInfo();
            DataControl.Repository.AzureBlobUpload objAzureUpload = new DataControl.Repository.AzureBlobUpload();
            DataControl.Abstraction.IFileProvider objPathProv = new DataControl.Impl.FileSystemProvider();
            string accKey = objPathProv.GetConfigValue("NBBLOBACCKEY");
            string apiKey = "a06abb07-d574-4a8c-b223-845635e0cb16";
            string value = "";
            value += "<div class='col - xs - 12 clearfix' id='formtitle>< p >< b > Dear < span id = 'formUsername' ></ span >,</ b ></ p >";
            value += "< p > Greetings of the day,</ p > < br />< p style ='text-indent:40px' > As per clause 7 of the agreed Work Norms, you are expected to make the following minimum call average:</ p >";
            value +="< p style ='text-indent:100px' >< b > 1.Doctor Call Average - < span id = formExpcalAvg ></ span ></ b ></ p >< p style = 'text-indent:40px' >";
            value += "However, on review of your call average, we are shocked to note that your call average is only<b> < span id = 'formCurcalAvg' ></ span ></ b > for the month of < b >< span id = 'formmnth'>";
            value += "</ span ></ b >, < b >< span id = 'formyear' ></ span ></ b > which is much below the expectation.< br /> We also understand that your Regional Manager has already sent communication to you in this regard but has not received any assurance from you that you would improve upon the above.This is being viewed very seriously.You are cautioned to maintain doctor call average of < b >";
            value += "< span id = 'testexpavg' ></ span ></ b > month after month, which will also help you in improving our business in your territory.We are sure you will take note of the above very seriously and ensure compliance.</ p >";
            value += "< p style = 'position: relative;top: 9px;margin-bottom: 25px;' >< b > Regards,</ b ></ p >< p >< span id = 'ModRepusername' ></ span ></ p >";
            value +="</ div > "; // a direct HTML string
            string containerName = objCurInfo.GetCompanyCode().ToLower();
            using (var client = new System.Net.WebClient())
            {
                // Build the conversion options 
                System.Collections.Specialized.NameValueCollection options = new System.Collections.Specialized.NameValueCollection();
                options.Add("apikey", apiKey);
                options.Add("value", value);
                string HtmlToPDF = System.Configuration.ConfigurationManager.AppSettings["AlertHtmlToPDF"].ToString();
                // Call the API convert to a PDF
                System.IO.MemoryStream ms = new System.IO.MemoryStream(client.UploadValues(HtmlToPDF, options));

                // Make the file a downloadable attachment - comment this out to show it directly inside
                var fileName = objCurInfo.GetUserName()+DateTime.Now.ToString("ddMMyyyyHHmmssfff") + ".pdf";
                string blobURL = objAzureUpload.PutAzureBlobStorage(ms, fileName, accKey, containerName);
                    // Return the file as a PDF
                    return fileName;
                }

        }
    }
}
