using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using DataControl;
using MVCModels;
namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class UserProjectMappingController : Controller
    {
        //
        // GET: /UserProjectMapping/

        public ActionResult Index()
        {
            return View();
        }

        //
        // GET: /UserProjectMapping/Details/5

        public ActionResult Details(int id)
        {
            return View();
        }

        //
        // GET: /UserProjectMapping/Create

        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /UserProjectMapping/Create

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
        // GET: /UserProjectMapping/Edit/5

        public ActionResult Edit(int id)
        {
            return View();
        }

        //
        // POST: /UserProjectMapping/Edit/5

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
        // GET: /UserProjectMapping/Delete/5

        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /UserProjectMapping/Delete/5

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

        public ActionResult UserProjectMapping()
        {
            return View();
        }

        public JsonResult GetProjectDetails()
        {
            DataControl.BLMaster _objMapping = new DataControl.BLMaster();
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            List<MVCModels.UserProjectMapping> lstProject = new List<MVCModels.UserProjectMapping>();
            string companyCode = _objCurInfo.GetCompanyCode();
            try
            {
                lstProject = (List<MVCModels.UserProjectMapping>)_objMapping.GetUserProjects(companyCode);
                DataControl.JSONConverter _objJson = new DataControl.JSONConverter();
                return Json(_objJson.Serialize(lstProject));
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:companyCode", companyCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return Json("Sorry an error occured. Please try again later.");
            }

        }

        public string GetUserProjectDetails(int pageNo)
        {
            int totalPageNo = 1;
            const int PAGESIZE = 10;
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            List<UserProjectMapping> lstUserProject = new List<UserProjectMapping>();
            List<UserProjectMapping> lstUserProjectFiler = new List<UserProjectMapping>();

            DataControl.BLMaster _objMapping = new DataControl.BLMaster();
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            string companyCode = _objCurInfo.GetCompanyCode();
            StringBuilder sbTableContent = new StringBuilder();
            lstUserProject = (List<UserProjectMapping>)_objMapping.GetUserProjectMapDetails(companyCode, pageNo, PAGESIZE, ref totalPageNo);
            lstUserProjectFiler = (List<UserProjectMapping>)_objMapping.GetUserProjectMapallDetails(companyCode);
            try
            {
                if (lstUserProject != null && lstUserProject.Count > 0)
                {
                    sbTableContent.Append(Pager.Paging(pageNo, totalPageNo));
                    sbTableContent.Append("<table id='tblUserProject' class='table table-striped' >");
                    sbTableContent.Append("<thead class='active'>");
                    sbTableContent.Append("<tr style='background-color: #428bca'>");
                    sbTableContent.Append("<td>Edit</td>");
                    sbTableContent.Append("<td>Delete</td>");
                    sbTableContent.Append("<td>Project</td>");
                    sbTableContent.Append("<td>User</td>");
                    sbTableContent.Append("<td>Start Date</td>");
                    sbTableContent.Append("<td>End Date</td>");
                    sbTableContent.Append("</tr>");
                    sbTableContent.Append("</thead>");
                    sbTableContent.Append("<tbody>");
                    int i = 0;
                    foreach (var item in lstUserProject)
                    {
                        i++;
                        sbTableContent.Append("<tr><td><a href='#' onclick ='fnEdit(\"" + item.Project_Code.ToString() + "_" + item.User_Code.ToString() + "_" + item.Mapping_Code.ToString() + "_" + item.StartDate.ToString() + "_" + item.EndDate.ToString() + "\");'>Edit</a></td>");
                        sbTableContent.Append("<td><a href='#' onclick ='fnDelete(\"" + item.Project_Code.ToString() + "_" + item.User_Code.ToString() + "_" + item.Mapping_Code.ToString() + "\");'>Delete</a></td>");
                        sbTableContent.Append("<input type='hidden' id='hduserCode_" + i + "' value='" + item.User_Code.ToString() + "' />");
                        sbTableContent.Append("<input type='hidden' id='hdprojectCode_" + i + "' value='" + item.Project_Code.ToString() + "' />");
                        sbTableContent.Append("<td>" + item.Project_Name.ToString() + "</td>");
                        sbTableContent.Append("<td>" + item.User_Name.ToString() + "</td>");
                        sbTableContent.Append("<td>" + item.StartDate.ToString() + "</td>");
                        sbTableContent.Append("<td>" + item.EndDate.ToString() + "</td></tr>");
                    }
                }
                sbTableContent.Append("</tbody>");
                sbTableContent.Append("</table>");

                return sbTableContent.ToString() + "*" + json.Serialize(lstUserProjectFiler);

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:companyCode", companyCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "Sorry an error occured. Please try again later.";
            }
        }
        public int InsertUserProject(string userCode, string projectCode, string startDate, string endDate)
        {
            DataControl.BLMaster _objMapping = new DataControl.BLMaster();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string companyCode = objCurInfo.GetCompanyCode();
            int result = _objMapping.InsertUserProjectMapping(companyCode, userCode, projectCode, startDate, endDate);
            return result;
        }

        public int DeleteUserProject(string projectCode)
        {
            try
            {
                DataControl.BLMaster _objMapping = new DataControl.BLMaster();
                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                string companyCode = objCurInfo.GetCompanyCode();
                int result = _objMapping.UpdateUserProjectMapping(companyCode, projectCode);
                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:ProjectCode", projectCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return 2;
            }
        }

        public int UpdateUserProject(string userCode, string projectCode, string startDate, string endDate, string oldprojectCode)
        {
            DataControl.BLMaster _objMapping = new DataControl.BLMaster();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string companyCode = objCurInfo.GetCompanyCode();
            int result = _objMapping.UpdateUserProject(companyCode, userCode, projectCode, startDate, endDate, oldprojectCode);
            return result;
        }


    }
}
