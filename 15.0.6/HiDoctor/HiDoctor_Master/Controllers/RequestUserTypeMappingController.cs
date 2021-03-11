using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MVCModels;
using System.Data;
using System.Text;

namespace HiDoctor_Master.Controllers
{
    public class RequestUserTypeMappingController : Controller
    {
        //
        // GET: /RequestUserTypeMapping/

        public ActionResult Index()
        {
            return View();
        }

        //
        // GET: /RequestUserTypeMapping/Details/5

        public ActionResult Details(int id)
        {
            return View();
        }

        //
        // GET: /RequestUserTypeMapping/Create

        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /RequestUserTypeMapping/Create

        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /RequestUserTypeMapping/Edit/5

        public ActionResult Edit(int id)
        {
            return View();
        }

        //
        // POST: /RequestUserTypeMapping/Edit/5

        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /RequestUserTypeMapping/Delete/5

        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /RequestUserTypeMapping/Delete/5

        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        public ActionResult RequestUserTypeMapping()
        {
            return View();
        }
        /// <summary>
        /// Get under Usertype Name
        /// </summary>
        /// <returns></returns>
        public JsonResult GetUserType()
        {
            DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
            DataControl.BLMaster _objBlmaster = new DataControl.BLMaster();
            DivisionUserProducts objDroUserType = new DivisionUserProducts();
            objDroUserType.Company_Code = _objcurrentInfo.GetCompanyCode();
           // objDroUserType.User_Code = _objcurrentInfo.GetUserCode();
            try
            {
                IEnumerable<DivisionUserProducts> lstUsertype = _objBlmaster.GetUserTypeNames(objDroUserType);
                var userTypelist = (from userType in lstUsertype.AsEnumerable()
                                    select new DivisionUserProducts()
                                    {
                                        User_Type_Code = userType.User_Type_Code.ToString(),
                                        User_Type_Name = userType.User_Type_Name.ToString()
                                    }).ToList<DivisionUserProducts>();
                return Json(userTypelist);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:companyCode", objDroUserType.Company_Code);
                dicContext.Add("Filter:userCode", objDroUserType.User_Code);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return Json("Sorry an error occured. Please try again later.");
            }
        }

        public JsonResult Getrequest()
        {
            DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
            DataControl.BLMaster _objBlmaster = new DataControl.BLMaster();
            RequestModel objDroRequest = new RequestModel();
            objDroRequest.Company_Code = _objcurrentInfo.GetCompanyCode();
            try
            {
                IEnumerable<RequestModel> lstRequest = _objBlmaster.GetRequest(objDroRequest);

                var requestlist = (from request in lstRequest.AsEnumerable()
                                   select new RequestModel()
                                   {
                                       Request_Code = request.Request_Code.ToString(),
                                       Request_Name = request.Request_Name.ToString()
                                   }).ToList<RequestModel>();
                return Json(requestlist);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:companyCode", objDroRequest.Company_Code);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return Json("Sorry an error occured. Please try again later.");
            }
        }

        //fill grid

        public string GetRequestmapValues()
        {
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            string companyCode = _objCurInfo.GetCompanyCode();
            try
            {
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                List<RequestModel> lstRequestMap = new List<RequestModel>();
                DataControl.BLMaster _objMapping = new DataControl.BLMaster();
                StringBuilder sbTableContent = new StringBuilder();
                lstRequestMap = (List<RequestModel>)_objMapping.GetRequestMapDetails(companyCode);
                if (lstRequestMap != null && lstRequestMap.Count > 0)
                {
                    sbTableContent.Append("<table id='tblrequest' class='table table-striped' >");
                    sbTableContent.Append("<thead class='active'>");
                    sbTableContent.Append("<tr style='background-color: #428bca'>");
                    sbTableContent.Append("<td>Edit</td>");
                    sbTableContent.Append("<td>Change Status</td>");
                    sbTableContent.Append("<td>Request</td>");
                    sbTableContent.Append("<td>UserType</td>");
                    sbTableContent.Append("<td>Status</td>");
                    sbTableContent.Append("</tr>");
                    sbTableContent.Append("</thead>");
                    sbTableContent.Append("<tbody>");
                    int i = 0;
                    foreach (var item in lstRequestMap)
                    {
                        i++;
                        sbTableContent.Append("<tr><td><a href='#' onclick ='fnEdit(\"" + item.Request_Code.ToString() + "_" + item.User_Type_Code.ToString() + "_" + item.Request_Mapping_Code.ToString() + "\");'>Edit</a></td>");
                        sbTableContent.Append("<td><a href='#' onclick ='fnStatusChange(\"" + item.Request_Mapping_Code.ToString() + "_" + item.Record_Status.ToString() + "\");'>Change Status</a></td>");
                        sbTableContent.Append("<td>" + item.Request_Name.ToString() + "</td>");
                        sbTableContent.Append("<td>" + item.User_Type_Name.ToString() + "</td>");
                        sbTableContent.Append("<td>" + item.Status.ToString() + "</td></tr>");
                    }
                }
                sbTableContent.Append("</tbody>");
                sbTableContent.Append("</table>");

                return sbTableContent.ToString() + "*" + json.Serialize(lstRequestMap);

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:companyCode", companyCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "Sorry an error occured. Please try again later.";
            }
        }

        public int RequestChangeStatus(string mapCode, string recordStatus)
        {
            DataControl.BLMaster _objMapping = new DataControl.BLMaster();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string companyCode = objCurInfo.GetCompanyCode();
            try
            {
                int result = _objMapping.RequestChangeStatus(companyCode, mapCode, recordStatus);
                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:companyCode", companyCode);
                dicContext.Add("Filter:mapCode", mapCode);
                dicContext.Add("Filter:recordStatus", recordStatus);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return 2;
            }
        }

        public int InsertRequestMapping(string requestCode, string userTypeCode)
        {
            DataControl.BLMaster _objMapping = new DataControl.BLMaster();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string companyCode = objCurInfo.GetCompanyCode();
            try
            {
                int result = _objMapping.InsertRequestMapping(companyCode, requestCode, userTypeCode);
                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:companyCode", companyCode);
                dicContext.Add("Filter:requestCode", requestCode);
                dicContext.Add("Filter:userTypeCode", userTypeCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return 2;
            }
        }


        public int UpdateRequestMapping(string requestCode, string userTypeCode, string mapCode)
        {
            DataControl.BLMaster _objMapping = new DataControl.BLMaster();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string companyCode = objCurInfo.GetCompanyCode();
            try
            {
                int result = _objMapping.UpdateRequestMapping(companyCode, requestCode, userTypeCode, mapCode);
                return result;
            }
            catch (Exception ex) {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:companyCode", companyCode);
                dicContext.Add("Filter:requestCode", requestCode);
                dicContext.Add("Filter:userTypeCode", userTypeCode);
                dicContext.Add("Filter:userTypeCode", mapCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return 2;
            }
        }


    }
}




