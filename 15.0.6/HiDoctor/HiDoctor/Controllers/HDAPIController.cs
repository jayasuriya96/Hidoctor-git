using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataControl;
using System.Data;
using System.Text;

namespace HiDoctor.Controllers
{
    [AjaxSessionActionFilter]
    public class HDAPIController : Controller
    {
        JSONConverter _objJSON = new JSONConverter();
        CurrentInfo _objCur = new CurrentInfo();

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult APIHome()
        {
            return View();
        }

        public ActionResult AsyncAPIHome()
        {
            return View();
        }
        public ActionResult AsyncAPIDetails(int? apiId, string ServiceId, string ServiceName)
        {
            ViewBag.ApiId = apiId;
            ViewBag.ServiceId = ServiceId;
            ViewBag.ServiceName = ServiceName;
            return View();

        }
        public JsonResult GetAPIServices()
        {
            try
            {
                Repository.APIRepository objAPIRepo = new Repository.APIRepository();
                DataSet ds = objAPIRepo.GetAPIServices(_objCur.GetCompanyCode(), _objCur.GetUserTypeCode());
                return Json(_objJSON.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
        }
        public JsonResult GetAPIUI(FormCollection coll)
        {
            try
            {
                int apiId = Convert.ToInt32(coll["APIId"]);
                Repository.APIRepository objAPIRepo = new Repository.APIRepository();
                DataSet ds = objAPIRepo.GetAPIUIElements(apiId);
                return Json(_objJSON.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("apiId", coll["APIId"].ToString());
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
        }
        public string ExecuteAPI(FormCollection coll)
        {
            try
            {
                string error = string.Empty;
                Repository.APIRepository objAPIRepo = new Repository.APIRepository();
                //public string ExecuteService(string companyCode, string userName, System.Web.Mvc.FormCollection coll,string subDominName, out string error)
                string url = objAPIRepo.ExecuteService(_objCur.GetCompanyCode(), _objCur.GetUserName(), coll, _objCur.GetSubDomain(), out error);

                return url;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
        }

        public string AsyncExecuteAPI(FormCollection coll)
        {
            try
            {
                string error = string.Empty;
                Repository.APIRepository objAPIRepo = new Repository.APIRepository();
                string url = objAPIRepo.AysncExecuteService(_objCur.GetCompanyCode(), _objCur.GetUserName(), coll, _objCur.GetSubDomain(), out error);
                int isExcel = Convert.ToInt32(coll["isExcel"]);
                if (isExcel == 1)
                {
                    if (url == "SUCCESS")
                    {
                        return error;
                    }
                    else { return "Fail:" + error; }
                }
                else
                {
                    return url;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
        }

        public string GetExcelAPIProcessQueueStatus(int API_ID)
        {
            CurrentInfo _objcurrentInfo = new CurrentInfo();
            string CompanyCode = _objcurrentInfo.GetCompanyCode();
            string UserCode = _objcurrentInfo.GetUserCode();
            Repository.APIRepository objAPIRepo = new Repository.APIRepository();
            List<MVCModels.HiDoctor_Reports.UsersExcelAPIQueues> lstExcelAPIQueue = objAPIRepo.GetUsersExcelAPIProcessQueue(UserCode, API_ID).ToList();
            StringBuilder strTbl = new StringBuilder();

            strTbl.Append("<table WIDTH='99%' id='tblsummary' class='table table-striped'>");
            strTbl.Append("<thead class='active'>");
            strTbl.Append("<tr>");
            strTbl.Append("<td width='25%'>Transaction ID</td><td width='10%'>Request Date time</td><td width='25%'>Report Parameters</td><td width='10%'>Process State</td><td width='20%'>Action</td>");
            strTbl.Append("</tr>");
            strTbl.Append("</thead>");
            strTbl.Append("<tbody>");
            if (lstExcelAPIQueue != null)
            {
                foreach (var item in lstExcelAPIQueue)
                {
                    strTbl.Append("<tr>");
                    strTbl.Append("<td>" + item.Transaction_ID + "</td>");
                    strTbl.Append("<td>" + item.Rpt_Req_DateTime + "</td>");
                    strTbl.Append("<td>" + item.Rpt_Parameters + "</td>");
                    strTbl.Append("<td>" + item.Process_State + "</td>");
                    if ((item.Process_State.Trim() == "Completed") && (item.Excel_File_Path.Trim() != ""))
                    {
                        strTbl.Append("<td class='td-a'><a href='" + item.Excel_File_Path + "' download>View</a></td>");
                    }
                    else if (item.Process_State.Trim() == "Error")
                    {
                        strTbl.Append("<td class='td'>" + item.User_Error_Desc + "</td>");
                    }
                    else
                    {
                        strTbl.Append("<td>" + item.Process_State + "</td>");
                    }
                    strTbl.Append("</tr>");
                }
            }
            else
            {
                strTbl.Append("<tr><td colspan='4' style='text-align:center;'>No Details Found.</td></tr>");
            }
            strTbl.Append("</tbody>");
            strTbl.Append("</table>");
            return strTbl.ToString();
        }

        public JsonResult GetExcelApiInputData(string sessionKey, string searchKey)
        {
            CurrentInfo _objcurrentInfo = new CurrentInfo();
            Repository.APIRepository objAPIRepo = new Repository.APIRepository();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string userCode = _objcurrentInfo.GetUserCode();
            string regionCode = _objcurrentInfo.GetRegionCode();
            List<MVCModels.HiDoctor_Reports.ExcelApiInput> lstExcelApiList = new List<MVCModels.HiDoctor_Reports.ExcelApiInput>();
            lstExcelApiList = objAPIRepo.GetExcelApiInputData(companyCode, userCode, regionCode, sessionKey, searchKey);
            return Json(_objJSON.Serialize(lstExcelApiList), JsonRequestBehavior.AllowGet);
        }
    }
}
