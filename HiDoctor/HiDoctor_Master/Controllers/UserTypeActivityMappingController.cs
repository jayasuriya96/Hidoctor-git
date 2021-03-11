using DataControl;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Configuration;
using System.Text;
using MVCModels.HiDoctor_Master;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class UserTypeActivityMappingController : Controller
    {
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        CurrentInfo _objCurInfo = new CurrentInfo();
        JSONConverter _objJson = new JSONConverter();
        private DataControl.Data _objData = new DataControl.Data();
        private DataControl.SPData _objSPData = new DataControl.SPData();
        //
        // GET: /UserTypeActivityMapping/

        public ActionResult Index()
        {
            return View();
        }

        //
        // GET: /UserTypeActivityMapping/Details/5

        public ActionResult Details(int id)
        {
            return View();
        }

        //
        // GET: /UserTypeActivityMapping/Create

        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /UserTypeActivityMapping/Create

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
        // GET: /UserTypeActivityMapping/Edit/5

        public ActionResult Edit(int id)
        {
            return View();
        }

        //
        // POST: /UserTypeActivityMapping/Edit/5

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
        // GET: /UserTypeActivityMapping/Delete/5

        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /UserTypeActivityMapping/Delete/5

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
        public ActionResult UsertypeActivityMapping()
        {
            ViewBag.UserCode = _objcurrentInfo.GetUserCode();
            ViewBag.UserTypeCode = _objcurrentInfo.GetUserTypeCode();
            return View();
        }

        public JsonResult GetUserTypeMasterTreeDetails()
        {
            DataControl.BLUser _objBluser = new DataControl.BLUser();
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            DataSet ds = new DataSet();
            DataControl.JSONConverter _objJson = new DataControl.JSONConverter();
            ds = _objBluser.GetUserTypetreedetail(_objCurrentInfo.GetCompanyCode());
            return Json(_objJson.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetActivityDetails()
        {
            DataControl.BLUser _objBluser = new DataControl.BLUser();
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            DataSet ds = new DataSet();
            DataControl.JSONConverter _objJson = new DataControl.JSONConverter();
            ds = _objBluser.GetActivitydetail(_objCurrentInfo.GetCompanyCode());
            return Json(_objJson.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetUserTypeActivityMap()
        {
            DataControl.BLUser _objBluser = new DataControl.BLUser();
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();

            return Json(_objBluser.GetUserTypeActivityMapdata(_objCurrentInfo.GetCompanyCode()), JsonRequestBehavior.AllowGet); //GetUserTypeActivityMaptable(ds);
        }

        public string GetUserTypeActivityMaptable(DataSet ds)
        {
            try
            {
                StringBuilder sbTableContent = new StringBuilder();
                StringBuilder sb = new StringBuilder();
                if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    sbTableContent.Append("<table id='tblActivitysummary' class='table table-striped' >");
                    sbTableContent.Append("<thead class='active'>");
                    sbTableContent.Append("<tr style='background-color: #428bca'>");
                    sbTableContent.Append("<td>Edit</td>");
                    sbTableContent.Append("<td>Delete</td>");
                    sbTableContent.Append("<td>UserType</td>");
                    sbTableContent.Append("<td>Activity</td>");
                    sbTableContent.Append("<td>Start Date</td>");
                    sbTableContent.Append("<td>End Date</td>");
                    sbTableContent.Append("</tr>");
                    sbTableContent.Append("</thead>");
                    sbTableContent.Append("<tbody>");

                    for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                    {
                        sbTableContent.Append("<tr><td><a href='#' onclick ='fnEdit(\"" + ds.Tables[0].Rows[i]["UserType_Activity_Code"] + "_" + ds.Tables[0].Rows[i]["User_Type_Code"] + "_" + ds.Tables[0].Rows[i]["Activity_Code"] + "_" + ds.Tables[0].Rows[i]["StartDate"] + "_" + ds.Tables[0].Rows[i]["EndDate"] + "_"+ ds.Tables[0].Rows[i]["SFC_Mandatory"] + "\");'>Edit</a></td>");
                        sbTableContent.Append("<input type='hidden' id='EditUserTypeCode'/>");
                        sbTableContent.Append("<td><a href='#' onclick ='fnDelete(\"" + ds.Tables[0].Rows[i]["UserType_Activity_Code"] + "\");'>Delete</a></td>");
                        sbTableContent.Append("<td>" + ds.Tables[0].Rows[i]["User_type_Name"] + "</td>");
                        sbTableContent.Append("<td>" + ds.Tables[0].Rows[i]["Activity_Name"] + "</td>");
                        sbTableContent.Append("<td>" + ds.Tables[0].Rows[i]["StartDate"] + "</td>");
                        sbTableContent.Append("<td>" + ds.Tables[0].Rows[i]["EndDate"] + "</td></tr>");
                    }
                }
                else
                {
                    return sb.ToString();
                }
                sbTableContent.Append("</tbody>");
                sbTableContent.Append("</table>");
                return sbTableContent.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>(); ;
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw new Exception("Sorry an error occurred. Please try again later");
            }

        }
        public string InsertActivity(ActivityDataModel obj)
        {

            DataControl.BLUser _objBluser = new DataControl.BLUser();
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            bool blFlag; 
            string result = "";
            string error = "";
            List<ValidationActivityDataListModel> lstModel = new List<ValidationActivityDataListModel>();
            foreach(var item in obj.lst)
            {
                ValidationActivityDataListModel objModel = new ValidationActivityDataListModel();
                objModel.UserTypeCode = item.UserTypeCode;
                objModel.ActivityCode = item.ActivityCode;
                lstModel.Add(objModel);
            }
            blFlag = _objBluser.checkActivityAlreadMapped(lstModel);
            if (blFlag)
            {
                error = "0";
                return error;
            }
            foreach (var item in obj.lst)
            {
                //blFlag = _objBluser.getActivityMapped(_objCurrentInfo.GetCompanyCode(), item.UserTypeCode, item.ActivityCode);
                //if (blFlag)
                //{
                //    error = "0";
                //    return error;
                //}

                string UserTypeActivityCode = _objData.GetMaxCode(_objcurrentInfo.GetCompanyCode(), "tbl_SFA_Usertype_Activity_Mapping", "Usertype_Activity_Code", "UTA");
                int mapActivity = _objBluser.activityInsert(_objCurrentInfo.GetCompanyCode(), UserTypeActivityCode, item.UserTypeCode, item.ActivityCode, item.StartDate, item.EndDate,item.Sfc_Mandatory);
                result = mapActivity.ToString();
            }
            return result;

        }

        public string DeleteActivity(string activitymapCode)
        {
            string result = "";
            DataControl.BLUser _objBluser = new DataControl.BLUser();
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            int deleteActivity = _objBluser.DeleteMappedActivity(_objCurrentInfo.GetCompanyCode(), activitymapCode);
            result = deleteActivity.ToString();
            return result;
        }


        public string EditActivity(ActivityDataModel obj)
        {
            DataControl.BLUser _objBluser = new DataControl.BLUser();
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            bool blFlag;
           
            string result = "";
            string error = "";
            foreach (var item in obj.lst)
            {
                blFlag = _objBluser.GetActivityMappedForEdit(_objCurrentInfo.GetCompanyCode(), item.UserTypeCode, item.ActivityCode, item.Mapped_code);
                if (blFlag)
                {
                    error = "0";
                    return error;
                }
                int mapActivity = _objBluser.updateUserTypeActivityMap(_objCurrentInfo.GetCompanyCode(), item.UserTypeCode, item.ActivityCode, item.StartDate, item.EndDate, item.Mapped_code,item.Sfc_Mandatory);
                result = mapActivity.ToString();
            }
            return result;
        }
    }
}
