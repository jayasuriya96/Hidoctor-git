using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataControl;
using System.Text;
using System.Data;
using DataControl.Impl;
using DataControl.Abstraction;
using DataControl.EnumType;
using System.Text.RegularExpressions;
using System.Net;
using System.IO;
using Newtonsoft.Json;
using MVCModels;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class UsercreationWizardController : Controller
    {
        #region Private Methods
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        private SPData _objSPData = new SPData();
        DataControl.Data _objData = new DataControl.Data();
        DataControl.JSONConverter _objJson = new DataControl.JSONConverter();
        DataControl.HD_MasterFactoryClasses.BL_UsercreationWizard _objUserCreation = new DataControl.HD_MasterFactoryClasses.BL_UsercreationWizard();
        IConfigSettings _objIconfigsettings = null;
        #endregion Private Methods

        #region Public Methods of New user creation wizard
        //Create Home Page for User creation Wizard
        public ActionResult Home()
        {
            Session["Employee_Details"] = "";
            Session["Leave_Details"] = "";
            Session["Product_Details"] = "";
            Session["NoticeBoard_Details"] = "";
            Session["Splash_Details"] = "";
            Session["Edetailing_Details"] = "";
            Session["Disable_UserDetails"] = "";
            Session["Update_User_Details"] = "";
            ViewBag.subDomainName = _objcurrentInfo.GetSubDomain();
            ViewBag.usertypeCode = _objcurrentInfo.GetUserTypeCode();
            return View();
        }
        //Create wizard Employee Master
        public ActionResult CreateUserWizard(int id)
        {
            DateTime todayDate = DateTime.Today;
            string activityDate = todayDate.ToString("yyyy-MM-dd");
            if (id == 1)
            {
                if (Session["Employee_Details"] != null && Session["Employee_Details"] != "")
                {
                    List<MVCModels.User_Employeedetails> lstsessionEmployeedetails = (List<MVCModels.User_Employeedetails>)Session["Employee_Details"];
                    string str_Employeedetails = JsonConvert.SerializeObject(lstsessionEmployeedetails);
                    ViewBag.SessionEmployeedetails = str_Employeedetails;
                }
            }

            ViewBag.Current_Date = activityDate;
            ViewBag.userCreationWiz = id;
            ViewBag.CompanyCode = _objcurrentInfo.GetCompanyCode();

            return View();
        }
        //Used to get Unassigned employee details
        public JsonResult GetEmployee()
        {
            DataControl.JSONConverter objJson = new DataControl.JSONConverter();
            List<MVCModels.User_EmployeeModel> lstEmployees = new List<MVCModels.User_EmployeeModel>();
            lstEmployees = _objUserCreation.GetEmployeeMaster(_objcurrentInfo.GetCompanyCode()).ToList();
            return Json(objJson.Serialize(lstEmployees));
        }

        // User bulk Add-Expense Group Mandatory for Privilege Set
        public string GetExpenseGroupMandatory(string User_Type_Code)
        {
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            DataControl.BLUser _objBlUser = new DataControl.BLUser();
            string Company_Code = _objCurrentInfo.GetCompanyCode();
            string User_Code = _objCurrentInfo.GetUserCode();
            string Region_Code = _objCurrentInfo.GetRegionCode();
            JSONConverter objJson = new JSONConverter();
            return objJson.Serialize(_objBlUser.GetExpenseGroupMandatory(Company_Code, User_Code, Region_Code, User_Type_Code));
        }


        //Used to Get Active empoyee details
        public JsonResult GetActiveEmployeedetails()
        {
            DataControl.BLUser _objBlUser = new DataControl.BLUser();
            List<MVCModels.HiDoctor_Master.EmployeeModel> lstActiveemployeedetails = new List<MVCModels.HiDoctor_Master.EmployeeModel>();
            lstActiveemployeedetails = _objBlUser.GetEmployees(_objcurrentInfo.GetCompanyCode()).ToList();
            return Json(_objJson.Serialize(lstActiveemployeedetails));
        }
        /// <summary>
        /// Used to Get User Type
        /// </summary>
        /// <returns></returns>
        public JsonResult GetUserType()
        {
            List<MVCModels.User_UserTypeMasterModel> lstUserTypes = new List<MVCModels.User_UserTypeMasterModel>();
            lstUserTypes = _objUserCreation.GetUserTypeMaster(_objcurrentInfo.GetCompanyCode(), _objcurrentInfo.GetUserTypeCode()).ToList();
            return Json(_objJson.Serialize(lstUserTypes));
        }
        /// <summary>
        /// Used to get Regions
        /// </summary>
        /// <returns></returns>
        public JsonResult GetRegions()
        {
            List<MVCModels.User_RegionMasterModel> lstRegions = new List<MVCModels.User_RegionMasterModel>();
            lstRegions = _objUserCreation.GetRegionMaster(_objcurrentInfo.GetCompanyCode()).ToList();
            return Json(_objJson.Serialize(lstRegions));
        }
        /// <summary>
        /// Used to Get User
        /// </summary>
        /// <returns></returns>
        public JsonResult GetUser()
        {
            List<MVCModels.User_UserMasterModel> lstuser = new List<MVCModels.User_UserMasterModel>();
            lstuser = _objUserCreation.GetUserMaster(_objcurrentInfo.GetCompanyCode()).ToList();
            return Json(_objJson.Serialize(lstuser));
        }
        /// <summary>
        /// Used to get divisions
        /// </summary>
        /// <returns></returns>
        public JsonResult GetDivision()
        {
            List<MVCModels.User_DivisionMasterModel> lstDivision = new List<MVCModels.User_DivisionMasterModel>();
            lstDivision = _objUserCreation.GetDivisions(_objcurrentInfo.GetUserCode()).ToList();
            return Json(_objJson.Serialize(lstDivision));
        }
        /// <summary>
        /// used to get Project Master
        /// </summary>
        /// <returns></returns>
        public JsonResult GetProjectMaster()
        {
            List<MVCModels.User_ProjectMaster> lstProject = new List<MVCModels.User_ProjectMaster>();
            lstProject = _objUserCreation.GetProjectMaster(_objcurrentInfo.GetCompanyCode()).ToList();
            return Json(_objJson.Serialize(lstProject));
        }
        /// <summary>
        /// used to get Expense
        /// </summary>
        /// <returns></returns>
        public JsonResult GetExpenseGroupHeader()
        {
            List<MVCModels.User_ExpenseGroupHeaderModel> lstExpenseGroupHeader = new List<MVCModels.User_ExpenseGroupHeaderModel>();
            lstExpenseGroupHeader = _objUserCreation.GetExpenseGroupHeader(_objcurrentInfo.GetCompanyCode()).ToList();
            return Json(_objJson.Serialize(lstExpenseGroupHeader));
        }
        public JsonResult GetEmployeeDetails(string employeeCode)
        {
            List<MVCModels.User_Employeedetails> lstEmployeedetails = new List<MVCModels.User_Employeedetails>();
            lstEmployeedetails = _objUserCreation.GetEmployeeDetails(_objcurrentInfo.GetCompanyCode(), employeeCode).ToList();
            return Json(_objJson.Serialize(lstEmployeedetails));
        }

        /// <summary>
        /// Used to Get All Regions by Division
        /// </summary>
        /// <param name="divisionCode"></param>
        /// <returns></returns>
        public JsonResult GetRegionsbyDivision(string divisionCode)
        {
            List<MVCModels.RigionByDivisionModel> lstregionsbyDivision = new List<MVCModels.RigionByDivisionModel>();
            lstregionsbyDivision = _objUserCreation.GetRegionbyDivision(_objcurrentInfo.GetCompanyCode(), divisionCode).ToList();
            return Json(_objJson.Serialize(lstregionsbyDivision));
        }
        /// <summary>
        /// Used to get users by region
        /// </summary>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public JsonResult GetUsersbyRegion(string regionCode)
        {
            List<MVCModels.User_UserMasterModel> lstUsers = new List<MVCModels.User_UserMasterModel>();
            lstUsers = _objUserCreation.GetUserbyRegion(_objcurrentInfo.GetCompanyCode(), regionCode).ToList();
            return Json(_objJson.Serialize(lstUsers));
        }
        /// <summary>
        /// Used to get regions by Region
        /// </summary>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public JsonResult GetRegionsbyRegion(string regionCode)
        {
            List<MVCModels.User_RegionMasterModel> lstRegions = new List<MVCModels.User_RegionMasterModel>();
            lstRegions = _objUserCreation.GetregionsByRegion(_objcurrentInfo.GetCompanyCode(), regionCode).ToList();
            return Json(_objJson.Serialize(lstRegions));
        }
        public JsonResult Getunderusers(string regionCode)
        {
            List<MVCModels.UnderUserModel> lstunderusers = new List<MVCModels.UnderUserModel>();
            lstunderusers = _objUserCreation.Getunderusers(_objcurrentInfo.GetCompanyCode(), regionCode).ToList();
            return Json(_objJson.Serialize(lstunderusers));
        }
        /// <summary>
        /// Used to get all Expense group header by region
        /// </summary>
        /// <param name="regionCode"></param>
        /// <param name="usertypeCode"></param>
        /// <returns></returns>
        public JsonResult GetExpensebyRegionorUsertype(string regionCode, string usertypeCode)
        {
            List<MVCModels.User_ExpenseGroupHeaderModel> lstExpensebyregion = new List<MVCModels.User_ExpenseGroupHeaderModel>();
            lstExpensebyregion = _objUserCreation.GetExpensebyRegionorUserType(_objcurrentInfo.GetCompanyCode(), regionCode, usertypeCode).ToList();
            return Json(_objJson.Serialize(lstExpensebyregion));
        }
        /// <summary>
        /// Used to get activities by project
        /// </summary>
        /// <param name="projectCode"></param>
        /// <param name="activityDate"></param>
        /// <returns></returns>
        public JsonResult GetActivitybyProject(string projectCode)
        {
            DateTime todayDate = DateTime.Today;
            string activityDate = todayDate.ToString("yyyy-MM-dd");

            List<MVCModels.User_ActivityMasterModel> lstActivities = new List<MVCModels.User_ActivityMasterModel>();
            lstActivities = _objUserCreation.GetActivitybyProject(_objcurrentInfo.GetCompanyCode(), projectCode, activityDate).ToList();
            return Json(_objJson.Serialize(lstActivities));
        }

        public string CheckVacantRegionOrnot(string regionCode)
        {
            string result = string.Empty;
            try
            {
                if (!string.IsNullOrEmpty(regionCode))
                {
                    result = _objUserCreation.CheckVacantRegionorNot(_objcurrentInfo.GetCompanyCode(), regionCode);
                }
                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("regionCode", regionCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return ex.Message.ToString();
            }
        }

        #region get region full tree details
        StringBuilder strTreeContent = new StringBuilder();
        public string GetRegionTreeDetails(string regionCode)
        {
            StringBuilder strRegionContent = new StringBuilder();
            DataSet ds = new DataSet();
            _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
            ds = _objData.ExecuteDataSet("exec SP_hdGetRegionTreeDetails '" + _objcurrentInfo.GetCompanyCode() + "', '" + regionCode + "'");
            if (ds.Tables.Count > 0)
            {
                if (ds.Tables[0].Rows.Count > 0)
                {
                    // List<string> vacantArr = new List<string>();
                    string regionUserName = "";

                    if (ds.Tables[0].Rows.Count > 0)
                    {

                        strTreeContent.Append("<ul  id='home' item-expanded='true'>");
                        DataRow[] drParent = ds.Tables[0].AsEnumerable().Where(a => Convert.ToString(a["Region_Code"]) == regionCode).ToArray();
                        if (drParent.Length > 0)
                        {
                            foreach (DataRow dr in drParent)
                            {
                                if (string.IsNullOrEmpty(Convert.ToString(dr["User_Name"])))
                                {

                                    // vacantArr.Add(Convert.ToString(dr["Region_Code"]));
                                    // var vacJson = jsonPath(jsData, "$.Tables[1].Rows[?(@.Region_Code=='" + jsData.Tables[0].Rows[i].Region_Code + "')]");
                                    DataRow[] drRegion = ds.Tables[1].AsEnumerable().Where(z => Convert.ToString(z["Region_Code"]) ==
                                        Convert.ToString(dr["Region_Code"])).ToArray();

                                    // vacant region
                                    if (drRegion.Length > 0)
                                    {
                                        regionUserName = "VACANT";
                                    }
                                    else
                                    {// not assigned region
                                        regionUserName = "NOT ASSIGNED";
                                    }
                                }
                                else
                                {
                                    regionUserName = Convert.ToString(dr["User_Name"]);
                                }

                                string[] userNameAr;
                                string title = string.Empty;
                                userNameAr = regionUserName.Split(',');
                                for (var a = 0; a < userNameAr.Length; a++)
                                {
                                    title += userNameAr[a] + ",";
                                }
                                title = title.TrimEnd(',');
                                if (regionUserName.Length > 30)
                                {
                                    strTreeContent.Append("<li class='expanded' id='" + Convert.ToString(dr["Region_Code"])
                                            + "' title='" + title + "'>" + Convert.ToString(dr["Region_Name"])
                                            + "(" + Convert.ToString(dr["Region_Type_Name"])
                                            + ")-" + regionUserName.Substring(0, 30) + "...");
                                }
                                else
                                {
                                    strTreeContent.Append("<li class='expanded' id='" + Convert.ToString(dr["Region_Code"])
                                           + "' title='" + title + "'>" + Convert.ToString(dr["Region_Name"])
                                           + "(" + Convert.ToString(dr["Region_Type_Name"])
                                           + ")-" + regionUserName);
                                }


                                DataRow[] drUnderUsers = ds.Tables[0].AsEnumerable().Where(b => Convert.ToString(b["Under_Region_Code"]) ==
                                    Convert.ToString(dr["Region_Code"])).ToArray();
                                if (drUnderUsers.Length > 0)
                                {
                                    strTreeContent.Append("<ul>");
                                    GenerateSubRegionTree(ds, Convert.ToString(dr["Region_Code"]));
                                    strTreeContent.Append("</ul>");
                                }
                                strTreeContent.Append("</li>");
                            }
                            strTreeContent.Append("</ul>");
                        }
                    }
                }
            }
            return strTreeContent.ToString();
        }

        //public string GenerateRegionFullTree()
        //{
        //    string LoggedInCompCode = objCurrentInfo.GetCompanyCode();
        //    string LoggedInRegionCode = objCurrentInfo.GetRegionCode();
        //    DataSet ds = null;
        //    objData.OpenConnection(LoggedInCompCode);
        //    ds = objData.ExecuteDataSet("exec SP_hdGetRegionTreeDetails '" + LoggedInCompCode + "', ''");
        //    if (ds.Tables.Count > 0)
        //    {
        //        if (ds.Tables[0].Rows.Count > 0)
        //        {
        //            // List<string> vacantArr = new List<string>();
        //            string regionUserName = "";

        //            if (ds.Tables[0].Rows.Count > 0)
        //            {

        //                strTreeContent.Append("<ul  id='home' item-expanded='true'>");
        //                DataRow[] drParent = ds.Tables[0].AsEnumerable().Where(a => Convert.ToString(a["Region_Code"]) == ds.Tables[0].Rows[0]["Region_Code"].ToString()).ToArray();
        //                if (drParent.Length > 0)
        //                {
        //                    foreach (DataRow dr in drParent)
        //                    {
        //                        if (string.IsNullOrEmpty(Convert.ToString(dr["User_Name"])))
        //                        {

        //                            // vacantArr.Add(Convert.ToString(dr["Region_Code"]));
        //                            // var vacJson = jsonPath(jsData, "$.Tables[1].Rows[?(@.Region_Code=='" + jsData.Tables[0].Rows[i].Region_Code + "')]");
        //                            DataRow[] drRegion = ds.Tables[1].AsEnumerable().Where(z => Convert.ToString(z["Region_Code"]) ==
        //                                Convert.ToString(dr["Region_Code"])).ToArray();

        //                            // vacant region
        //                            if (drRegion.Length > 0)
        //                            {
        //                                regionUserName = "VACANT";
        //                            }
        //                            else
        //                            {// not assigned region
        //                                regionUserName = "NOT ASSIGNED";
        //                            }
        //                        }
        //                        else
        //                        {
        //                            regionUserName = Convert.ToString(dr["User_Name"]);
        //                        }

        //                        string[] userNameAr;
        //                        string title = string.Empty;
        //                        userNameAr = regionUserName.Split(',');
        //                        for (var a = 0; a < userNameAr.Length; a++)
        //                        {
        //                            title += userNameAr[a] + ",";
        //                        }
        //                        title = title.TrimEnd(',');
        //                        if (regionUserName.Length > 30)
        //                        {
        //                            strTreeContent.Append("<li class='expanded' id='" + Convert.ToString(dr["Region_Code"])
        //                                    + "' title='" + title + "'>" + Convert.ToString(dr["Region_Name"])
        //                                    + "(" + Convert.ToString(dr["Region_Type_Name"])
        //                                    + ")-" + regionUserName.Substring(0, 30) + "...");
        //                        }
        //                        else
        //                        {
        //                            strTreeContent.Append("<li class='expanded' id='" + Convert.ToString(dr["Region_Code"])
        //                                   + "' title='" + title + "'>" + Convert.ToString(dr["Region_Name"])
        //                                   + "(" + Convert.ToString(dr["Region_Type_Name"])
        //                                   + ")-" + regionUserName);
        //                        }


        //                        DataRow[] drUnderUsers = ds.Tables[0].AsEnumerable().Where(b => Convert.ToString(b["Under_Region_Code"]) ==
        //                            Convert.ToString(dr["Region_Code"])).ToArray();
        //                        if (drUnderUsers.Length > 0)
        //                        {
        //                            strTreeContent.Append("<ul>");
        //                            GenerateSubRegionTree(ds, Convert.ToString(dr["Region_Code"]));
        //                            strTreeContent.Append("</ul>");
        //                        }
        //                        strTreeContent.Append("</li>");
        //                    }
        //                    strTreeContent.Append("</ul>");
        //                }
        //            }
        //        }
        //    }
        //    return strTreeContent.ToString();
        //}

        public void GenerateSubRegionTree(DataSet ds, string parentId)
        {
            try
            {
                DataRow[] dr = ds.Tables[0].AsEnumerable().Where(a => Convert.ToString(a["Under_Region_Code"]) == parentId
                    && Convert.ToString(a["Region_Code"]) != ds.Tables[0].Rows[0]["Region_Code"].ToString()).ToArray();
                if (dr.Length > 0)
                {
                    foreach (DataRow drChild in dr)
                    {
                        string regionUserName = string.Empty;

                        DataRow[] drUnderRegions = ds.Tables[0].AsEnumerable().Where(b => Convert.ToString(b["Under_Region_Code"]) ==
                            Convert.ToString(drChild["Region_Code"])).ToArray();
                        if (drUnderRegions.Length > 0)
                        {
                            //strTreeContent.Append(Convert.ToString(drChild["Region_Name"]) + "," + Convert.ToString(drChild["Region_Type_Name"])
                            //    + "(" + Convert.ToString(drChild["Region_Name"]) + ")");
                            if (string.IsNullOrEmpty(Convert.ToString(drChild["User_Name"])))
                            {

                                DataRow[] drRegion = ds.Tables[1].AsEnumerable().Where(z => Convert.ToString(z["Region_Code"]) ==
                                    Convert.ToString(drChild["Region_Code"])).ToArray();

                                // vacant region
                                if (drRegion.Length > 0)
                                {
                                    regionUserName = "VACANT";
                                }
                                else
                                {// not assigned region
                                    regionUserName = "NOT ASSIGNED";
                                }
                            }
                            else
                            {
                                regionUserName = Convert.ToString(drChild["User_Name"]);
                            }

                            string[] userNameAr;
                            string title = string.Empty;
                            userNameAr = regionUserName.Split(',');
                            for (var a = 0; a < userNameAr.Length; a++)
                            {
                                title += userNameAr[a] + ",";
                            }
                            title = title.TrimEnd(',');
                            //strTreeContent.Append("<li id='" + Convert.ToString(drChild["Region_Code"]) + "' class='expanded' >");
                            if (regionUserName.Length > 30)
                            {
                                strTreeContent.Append("<li class='expanded' id='" + Convert.ToString(drChild["Region_Code"])
                                        + "' title='" + title + "'>" + Convert.ToString(drChild["Region_Name"])
                                        + "(" + Convert.ToString(drChild["Region_Type_Name"])
                                        + ")-" + regionUserName.Substring(0, 30) + "...");
                            }
                            else
                            {
                                strTreeContent.Append("<li class='expanded' id='" + Convert.ToString(drChild["Region_Code"])
                                       + "' title='" + title + "'>" + Convert.ToString(drChild["Region_Name"])
                                       + "(" + Convert.ToString(drChild["Region_Type_Name"])
                                       + ")-" + regionUserName);
                            }
                            if (Convert.ToString(drChild["Region_Code"]) != null)
                            {
                                strTreeContent.Append("<ul>");
                                GenerateSecondLevelRegionTree(ds, Convert.ToString(drChild["Region_Code"]));
                                strTreeContent.Append("</ul>");
                            }
                        }
                        else
                        {
                            //strTreeContent.Append(Convert.ToString(drChild["Region_Name"]) + "," + Convert.ToString(drChild["Region_Type_Name"])
                            //    + "(" + Convert.ToString(drChild["Region_Name"]) + ")");
                            if (string.IsNullOrEmpty(Convert.ToString(drChild["User_Name"])))
                            {

                                DataRow[] drRegion = ds.Tables[1].AsEnumerable().Where(z => Convert.ToString(z["Region_Code"]) ==
                                    Convert.ToString(drChild["Region_Code"])).ToArray();

                                // vacant region
                                if (drRegion.Length > 0)
                                {
                                    regionUserName = "VACANT";
                                }
                                else
                                {// not assigned region
                                    regionUserName = "NOT ASSIGNED";
                                }
                            }
                            else
                            {
                                regionUserName = Convert.ToString(drChild["User_Name"]);
                            }

                            string[] userNameAr;
                            string title = string.Empty;
                            userNameAr = regionUserName.Split(',');
                            for (var a = 0; a < userNameAr.Length; a++)
                            {
                                title += userNameAr[a] + ",";
                            }
                            title = title.TrimEnd(',');
                            //strTreeContent.Append("<li id='" + Convert.ToString(drChild["Region_Code"]) + "' class='expanded' >");
                            if (regionUserName.Length > 30)
                            {
                                strTreeContent.Append("<li class='expanded' id='" + Convert.ToString(drChild["Region_Code"])
                                        + "' title='" + title + "'>" + Convert.ToString(drChild["Region_Name"])
                                        + "(" + Convert.ToString(drChild["Region_Type_Name"])
                                        + ")-" + regionUserName.Substring(0, 30) + "...");
                            }
                            else
                            {
                                strTreeContent.Append("<li class='expanded' id='" + Convert.ToString(drChild["Region_Code"])
                                       + "' title='" + title + "'>" + Convert.ToString(drChild["Region_Name"])
                                       + "(" + Convert.ToString(drChild["Region_Type_Name"])
                                       + ")-" + regionUserName);
                            }
                        }
                        strTreeContent.Append("</li>");
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public void GenerateSecondLevelRegionTree(DataSet ds, string underRegionCode)
        {
            try
            {
                DataRow[] dr = ds.Tables[0].AsEnumerable().Where(a => Convert.ToString(a["Under_Region_Code"]) == underRegionCode &&
                    Convert.ToString(a["Region_Code"]) != ds.Tables[0].Rows[0]["Region_Code"].ToString()).ToArray();
                if (dr.Length > 0)
                {
                    foreach (DataRow drChild in dr)
                    {
                        string regionUserName = string.Empty;
                        // strTreeContent.Append("<li id='" + Convert.ToString(drChild["Region_Code"]) + "' class='expanded'>");
                        DataRow[] drr = ds.Tables[0].AsEnumerable().Where(b => Convert.ToString(b["Under_Region_Code"]) == Convert.ToString(drChild["Region_Code"])).ToArray();
                        if (drr.Length > 0)
                        {
                            //strTreeContent.Append(Convert.ToString(drChild["Region_Name"]) + "," + Convert.ToString(drChild["Region_Type_Name"])
                            //    + "(" + Convert.ToString(drChild["Region_Name"]) + ")");
                            if (string.IsNullOrEmpty(Convert.ToString(drChild["User_Name"])))
                            {

                                DataRow[] drRegion = ds.Tables[1].AsEnumerable().Where(z => Convert.ToString(z["Region_Code"]) ==
                                    Convert.ToString(drChild["Region_Code"])).ToArray();

                                // vacant region
                                if (drRegion.Length > 0)
                                {
                                    regionUserName = "VACANT";
                                }
                                else
                                {// not assigned region
                                    regionUserName = "NOT ASSIGNED";
                                }
                            }
                            else
                            {
                                regionUserName = Convert.ToString(drChild["User_Name"]);
                            }

                            string[] userNameAr;
                            string title = string.Empty;
                            userNameAr = regionUserName.Split(',');
                            for (var a = 0; a < userNameAr.Length; a++)
                            {
                                title += userNameAr[a] + ",";
                            }
                            title = title.TrimEnd(',');
                            //strTreeContent.Append("<li id='" + Convert.ToString(drChild["Region_Code"]) + "' class='expanded' >");
                            if (regionUserName.Length > 30)
                            {
                                strTreeContent.Append("<li class='expanded' id='" + Convert.ToString(drChild["Region_Code"])
                                        + "' title='" + title + "'>" + Convert.ToString(drChild["Region_Name"])
                                        + "(" + Convert.ToString(drChild["Region_Type_Name"])
                                        + ")-" + regionUserName.Substring(0, 30) + "...");
                            }
                            else
                            {
                                strTreeContent.Append("<li class='expanded' id='" + Convert.ToString(drChild["Region_Code"])
                                       + "' title='" + title + "'>" + Convert.ToString(drChild["Region_Name"])
                                       + "(" + Convert.ToString(drChild["Region_Type_Name"])
                                       + ")-" + regionUserName);
                            }
                            strTreeContent.Append("<ul>");
                            GenerateSecondLevelRegionTree(ds, Convert.ToString(drChild["Region_Code"]));
                            strTreeContent.Append("</ul>");
                        }
                        else
                        {
                            //strTreeContent.Append(Convert.ToString(drChild["Region_Name"]) + "," + Convert.ToString(drChild["Region_Type_Name"])
                            //    + "(" + Convert.ToString(drChild["Region_Name"]) + ")");
                            if (string.IsNullOrEmpty(Convert.ToString(drChild["User_Name"])))
                            {

                                DataRow[] drRegion = ds.Tables[1].AsEnumerable().Where(z => Convert.ToString(z["Region_Code"]) ==
                                    Convert.ToString(drChild["Region_Code"])).ToArray();

                                // vacant region
                                if (drRegion.Length > 0)
                                {
                                    regionUserName = "VACANT";
                                }
                                else
                                {// not assigned region
                                    regionUserName = "NOT ASSIGNED";
                                }
                            }
                            else
                            {
                                regionUserName = Convert.ToString(drChild["User_Name"]);
                            }

                            string[] userNameAr;
                            string title = string.Empty;
                            userNameAr = regionUserName.Split(',');
                            for (var a = 0; a < userNameAr.Length; a++)
                            {
                                title += userNameAr[a] + ",";
                            }
                            title = title.TrimEnd(',');
                            //strTreeContent.Append("<li id='" + Convert.ToString(drChild["Region_Code"]) + "' class='expanded' >");
                            if (regionUserName.Length > 30)
                            {
                                strTreeContent.Append("<li class='expanded' id='" + Convert.ToString(drChild["Region_Code"])
                                        + "' title='" + title + "'>" + Convert.ToString(drChild["Region_Name"])
                                        + "(" + Convert.ToString(drChild["Region_Type_Name"])
                                        + ")-" + regionUserName.Substring(0, 30) + "...");
                            }
                            else
                            {
                                strTreeContent.Append("<li class='expanded' id='" + Convert.ToString(drChild["Region_Code"])
                                       + "' title='" + title + "'>" + Convert.ToString(drChild["Region_Name"])
                                       + "(" + Convert.ToString(drChild["Region_Type_Name"])
                                       + ")-" + regionUserName);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion get region full tree details
        #region Employee Master
        public string checkAssignUserId(string userName, string userCode, string employeeCode)
        {
            StringBuilder strContent = new StringBuilder();
            int countvalue = 0;
            try
            {
                string companyCode = _objcurrentInfo.GetCompanyCode();
                if (!string.IsNullOrEmpty(userName))
                {
                    countvalue = _objUserCreation.checkAssignUserId(companyCode, userName, employeeCode, userCode);
                }
                if (countvalue > 0)
                {
                    strContent.Append(userName + " is already exists.");
                }
                string result = strContent.ToString();
                if (string.IsNullOrEmpty(result))
                {
                    result = "SUCCESS";
                }
                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("userName", userName);
                dicContext.Add("userCode", userCode);
                dicContext.Add("employeeCode", employeeCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }
        }

        public List<MVCModels.User_Employeedetails> GetEmployeeDetailsList(string employee_Arr)
        {

            List<MVCModels.User_Employeedetails> lstEmployeeDetails = (List<MVCModels.User_Employeedetails>)JsonConvert.DeserializeObject(employee_Arr, typeof(List<MVCModels.User_Employeedetails>));
            Session["Employee_Details"] = lstEmployeeDetails;
            return lstEmployeeDetails;

        }


        #endregion Employee Master
        public ActionResult CreateLeaveDetails(string employeeName, string userType, string divisionName, string regionName, string userTypecode, string entryMode, string divisionCode, string UserregionCode, string reportingmanagerusercode, string hiDoctorStartDate, string DOJ)
        {
            if (Session["Leave_Details"] != null && Session["Leave_Details"] != "")
            {
                List<MVCModels.User_LeaveTypeModel> lstsessionLeavedetails = (List<MVCModels.User_LeaveTypeModel>)Session["Leave_Details"];
                string str_leavedetails = JsonConvert.SerializeObject(lstsessionLeavedetails);
                ViewBag.SessionLeavedetails = str_leavedetails;
            }

            ViewBag.Employee_Name = employeeName;
            ViewBag.User_Type = userType;
            ViewBag.Division_Name = divisionName;
            ViewBag.Region_Name = regionName;
            ViewBag.UserType_Code = userTypecode;
            ViewBag.entry_Mode = entryMode;
            ViewBag.Division_Code = divisionCode;
            ViewBag.Region_Code = UserregionCode;
            ViewBag.Reporting_Manager_User_Code = reportingmanagerusercode;
            ViewBag.hiDoctorStartDate = hiDoctorStartDate;
            ViewBag.DOJ = DOJ;
            return View();
        }
        public ActionResult CreateLeaveDetailsforhierarchychange(string employeeName, string userType, string divisionName, string regionName, string userTypecode, string entryMode, string divisionCode, string UserregionCode, string reportingmanagerusercode, string Usercode, string newusertypecode, string reportingregioncode, string reportingregionname)
        {
            if (Session["Leave_Details"] != null && Session["Leave_Details"] != "")
            {
                List<MVCModels.User_LeaveTypeModel> lstsessionLeavedetails = (List<MVCModels.User_LeaveTypeModel>)Session["Leave_Details"];
                string str_leavedetails = JsonConvert.SerializeObject(lstsessionLeavedetails);
                ViewBag.SessionLeavedetails = str_leavedetails;
            }
            ViewBag.newusertypecode = newusertypecode;
            ViewBag.User_Code = Usercode;
            ViewBag.Employee_Name = employeeName;
            ViewBag.User_Type = userType;
            ViewBag.Division_Name = divisionName;
            ViewBag.Region_Name = regionName;
            ViewBag.UserType_Code = userTypecode;
            ViewBag.entry_Mode = entryMode;
            ViewBag.Division_Code = divisionCode;
            ViewBag.Region_Code = UserregionCode;
            ViewBag.Reporting_Manager_User_Code = reportingmanagerusercode;
            ViewBag.reportingregioncode = reportingregioncode;
            ViewBag.reportingregionname = reportingregionname;
            return View();
        }
        public decimal getdecimalvalue(decimal value)
        {
            string test = value.ToString().Split('.')[1];

            if ((Convert.ToDecimal("0." + test) < Convert.ToDecimal("0.5")))
            {
                decimal diff = (Convert.ToDecimal("0.5")) - ((Convert.ToDecimal("0." + test)));
                value = Convert.ToDecimal(value) + Convert.ToDecimal(diff);
            }
            else if ((Convert.ToDecimal("0." + test) > Convert.ToDecimal("0.5")) && (Convert.ToDecimal("0." + test) < Convert.ToDecimal("0.99")))
            {
                decimal diff = (Convert.ToDecimal("1.0")) - ((Convert.ToDecimal("0." + test)));
                value = Convert.ToDecimal(Convert.ToDecimal(value) + Convert.ToDecimal(diff));
            }
            return Math.Round(value, 1);

        }
        #region Leave Details
        /// <summary>
        /// Get Leave Types by selected User Type
        /// </summary>
        /// <param name="userTypeCode"></param>
        /// <returns></returns>
        public string GetLeaveTypeNames(string userTypeCode, string entryMode, string hiDoctorStartDate, string doj)
        {
            StringBuilder strtbl = new StringBuilder();
            DateTime todayDate = DateTime.Today;
            //string effectiveTodate = todayDate.ToString("yyyy-MM-dd");
            try
            {
                List<MVCModels.User_LeaveTypeModel> lstLeaveTypes = new List<MVCModels.User_LeaveTypeModel>();
                //if (entryMode.ToUpper() == "BACK")
                //{
                lstLeaveTypes = _objUserCreation.GetLeaveTypebyUserType(_objcurrentInfo.GetCompanyCode(), userTypeCode, hiDoctorStartDate, doj).ToList();
                int Rowcount = 0;
                List<MVCModels.User_LeaveTypeModel> lstsessionLeavedetails = null;
                if (Session["Leave_Details"] != null && Session["Leave_Details"] != "")
                {
                    lstsessionLeavedetails = (List<MVCModels.User_LeaveTypeModel>)Session["Leave_Details"];
                }
                if (lstsessionLeavedetails != null && lstsessionLeavedetails.Count > 0)
                {
                    if (lstsessionLeavedetails[0].User_Type_Code != userTypeCode)
                    {
                        lstsessionLeavedetails = null;
                    }
                }
                if (lstsessionLeavedetails != null && lstsessionLeavedetails.Count > 0)
                {
                    foreach (var LeaveType in lstsessionLeavedetails)
                    {
                        strtbl.Append("<div class='col-md-12 cls_nomargin_nopadding form-group clearfix'>");
                        //Leave Type Name
                        strtbl.Append("<div class='col-xs-3'>");
                        strtbl.Append("<label id='txtLeaveTypeName_" + Rowcount + "' value='" + LeaveType.Leave_Type_Name + "'>" + LeaveType.Leave_Type_Name + "</label>");
                        strtbl.Append("<input type='hidden' id='hdnLeaveTypeCode_" + Rowcount + "' value='" + LeaveType.Leave_Type_Code + "'/>");
                        strtbl.Append("</div>");
                        //Leave Type text Box
                        strtbl.Append("<div class=col-xs-3>");
                        strtbl.Append("<input type='text' class='form-control' id='txtleave_" + Rowcount + "' value='" + LeaveType.Leave_Balance + "' />");
                        strtbl.Append("<input type='hidden' id='hdnLeavecount' value='" + lstLeaveTypes.Count + "' />");
                        strtbl.Append("</div>");
                        //Effective From
                        strtbl.Append("<div class=col-md-3>");
                        strtbl.Append("<input type='text' class='datepicker form-control' id='txtEffectiveFrom_" + Rowcount + "' placeholder ='Effective From' value='" + LeaveType.Effective_From + "' readonly/>");
                        strtbl.Append("</div>");
                        //Effectivee To
                        strtbl.Append("<div class=col-md-3>");
                        strtbl.Append("<input type='text' class='datepicker form-control' id='txtEffectiveTo_" + Rowcount + "' placeholder ='Effective To' value= '" + LeaveType.Effective_To + "' readonly/>");
                        strtbl.Append("</div>");
                        strtbl.Append("</div>");
                        Rowcount++;
                    }
                    foreach (var LeaveType in lstLeaveTypes)
                    {
                        if (lstsessionLeavedetails.Where(x => x.Leave_Type_Name == LeaveType.Leave_Type_Name).Count() == 0)
                        {
                            strtbl.Append("<div class='col-md-12 cls_nomargin_nopadding form-group clearfix'>");
                            //Leave Type Name
                            strtbl.Append("<div class='col-md-3'>");
                            strtbl.Append("<label id='txtLeaveTypeName_" + Rowcount + "' value='" + LeaveType.Leave_Type_Name + "'>" + LeaveType.Leave_Type_Name + "</label>");
                            strtbl.Append("<input type='hidden' id='hdnLeaveTypeCode_" + Rowcount + "' value='" + LeaveType.Leave_Type_Code + "'/>");
                            strtbl.Append("</div>");
                            //Leave Type text Box
                            strtbl.Append("<div class=col-md-3>");
                            strtbl.Append("<input type='text' class='form-control' id='txtleave_" + Rowcount + "' placeholder = 'Leave Balance'/>");
                            strtbl.Append("<input type='hidden' id='hdnLeavecount' value='" + lstLeaveTypes.Count + "' />");
                            strtbl.Append("</div>");
                            //Effective From
                            strtbl.Append("<div class=col-md-3>");
                            strtbl.Append("<input type='text' class='datepicker form-control' id='txtEffectiveFrom_" + Rowcount + "' placeholder ='Effective From' readonly/>");
                            strtbl.Append("</div>");
                            //Effectivee To
                            strtbl.Append("<div class=col-md-3>");
                            strtbl.Append("<input type='text' class='datepicker form-control' id='txtEffectiveTo_" + Rowcount + "' placeholder ='Effective To' readonly/>");
                            strtbl.Append("</div>");
                            strtbl.Append("</div>");
                            Rowcount++;
                        }
                    }
                }
                else
                {

                    if (lstLeaveTypes != null && lstLeaveTypes.Count > 0)
                    {
                        foreach (var LeaveType in lstLeaveTypes)
                        {
                            strtbl.Append("<div class='col-md-12 cls_nomargin_nopadding form-group clearfix'>");
                            //Leave Type Name
                            strtbl.Append("<div class='col-md-3'>");
                            strtbl.Append("<label id='txtLeaveTypeName_" + Rowcount + "' value='" + LeaveType.Leave_Type_Name + "'>" + LeaveType.Leave_Type_Name + "</label>");
                            strtbl.Append("<input type='hidden' id='hdnLeaveTypeCode_" + Rowcount + "' value='" + LeaveType.Leave_Type_Code + "'/>");
                            strtbl.Append("</div>");
                            //Leave Type text Box

                            //Effective From
                            if (LeaveType.leave_Eligibleforyear != null && LeaveType.leave_Eligibleforyear != "0.00")
                            {
                                strtbl.Append("<div class=col-md-3>");
                                strtbl.Append("<input type='text' class='form-control' id='txtleave_" + Rowcount + "' placeholder = 'Leave Balance' value='" + getdecimalvalue(Convert.ToDecimal(LeaveType.leave_Eligibleforyear)) + "'/>");
                                strtbl.Append("<input type='hidden' id='hdnLeavecount' value='" + lstLeaveTypes.Count + "' />");
                                strtbl.Append("</div>");
                                strtbl.Append("<div class=col-md-3>");
                                strtbl.Append("<input type='text' class='datepicker form-control' id='txtEffectiveFrom_" + Rowcount + "' placeholder ='Effective From' value='" + LeaveType.Effective_From + "' readonly />");
                                strtbl.Append("</div>");
                                //Effectivee To
                                strtbl.Append("<div class=col-md-3>");
                                strtbl.Append("<input type='text' class='datepicker form-control' id='txtEffectiveTo_" + Rowcount + "' placeholder ='Effective To' value='" + LeaveType.Effective_To + "' readonly/>");
                                strtbl.Append("</div>");
                            }
                            else
                            {
                                strtbl.Append("<div class=col-md-3>");
                                strtbl.Append("<input type='text' class='form-control' id='txtleave_" + Rowcount + "' placeholder = 'Leave Balance'/>");
                                strtbl.Append("<input type='hidden' id='hdnLeavecount' value='" + lstLeaveTypes.Count + "' />");
                                strtbl.Append("</div>");
                                strtbl.Append("<div class=col-md-3>");
                                strtbl.Append("<input type='text' class='datepicker form-control' id='txtEffectiveFrom_" + Rowcount + "' placeholder ='Effective From'  readonly />");
                                strtbl.Append("</div>");
                                //Effectivee To
                                strtbl.Append("<div class=col-md-3>");
                                strtbl.Append("<input type='text' class='datepicker form-control' id='txtEffectiveTo_" + Rowcount + "' placeholder ='Effective To' readonly/>");
                                strtbl.Append("</div>");
                            }
                            strtbl.Append("</div>");

                            Rowcount++;
                        }
                    }
                    else
                    {
                        strtbl.Append("<input type='hidden' id='hdnLeavecount' value='0' />");
                        strtbl.Append("<label>There seems to be no generic combination of Leave Types for a user with this Designation. Please check User Leave Type Master in HiDoctor for further configurations.</label>");
                    }
                }
                return strtbl.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("userTypeCode", userTypeCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return ex.Message.ToString();
            }
        }

        public List<MVCModels.User_LeaveTypeModel> GetLeaveDetailsList(string leavedetails_Arr)
        {
            List<MVCModels.User_LeaveTypeModel> lstLeavedetails = (List<MVCModels.User_LeaveTypeModel>)JsonConvert.DeserializeObject(leavedetails_Arr, typeof(List<MVCModels.User_LeaveTypeModel>));
            Session["Leave_Details"] = lstLeavedetails;
            return lstLeavedetails;
        }

        #endregion Leave Details

        public ActionResult CreateUserProductMapping(string employeeName, string userType, string divisionName, string regionName, string userTypecode, string divisionCode, string entryMode, string UserregionCode, string reportingmanagerusercode, string hiDoctorStartDate, string doj)
        {
            if (Session["Product_Details"] != null && Session["Product_Details"] != "")
            {
                List<MVCModels.User_ProductModel> lstsessionUserProductdetails = (List<MVCModels.User_ProductModel>)Session["Product_Details"];
                string str_Userproductdetails = JsonConvert.SerializeObject(lstsessionUserProductdetails);
                ViewBag.SessionProductdetails = str_Userproductdetails;
            }

            ViewBag.Employee_Name = employeeName;
            ViewBag.User_Type = userType;
            ViewBag.Division_Name = divisionName;
            ViewBag.Region_Name = regionName;
            ViewBag.UserType_Code = userTypecode;
            ViewBag.Division_Code = divisionCode;
            ViewBag.entry_Mode = entryMode;
            ViewBag.Region_Code = UserregionCode;
            ViewBag.Reporting_Manager_User_Code = reportingmanagerusercode;
            ViewBag.hiDoctorStartDate = hiDoctorStartDate;
            ViewBag.doj = doj;
            return View();
        }
        public ActionResult CreateUserProductMappinghierarchy(string employeeName, string userType, string divisionName, string regionName, string userTypecode, string divisionCode, string entryMode, string UserregionCode, string reportingmanagerusercode, string Usercode)
        {
            if (Session["Product_Details"] != null && Session["Product_Details"] != "")
            {
                List<MVCModels.User_ProductModel> lstsessionUserProductdetails = (List<MVCModels.User_ProductModel>)Session["Product_Details"];
                string str_Userproductdetails = JsonConvert.SerializeObject(lstsessionUserProductdetails);
                ViewBag.SessionProductdetails = str_Userproductdetails;
            }
            ViewBag.User_Code = Usercode;
            ViewBag.Employee_Name = employeeName;
            ViewBag.User_Type = userType;
            ViewBag.Division_Name = divisionName;
            ViewBag.Region_Name = regionName;
            ViewBag.UserType_Code = userTypecode;
            ViewBag.Division_Code = divisionCode;
            ViewBag.entry_Mode = entryMode;
            ViewBag.Region_Code = UserregionCode;
            ViewBag.Reporting_Manager_User_Code = reportingmanagerusercode;
            return View();
        }
        public ActionResult CreateUserProductMappingdivision(string employeeName, string userType, string divisionName, string regionName, string userTypecode, string divisionCode, string entryMode, string UserregionCode, string reportingmanagerusercode, string Usercode, string reportingregioncode, string reportingregionname)
        {
            if (Session["Product_Details"] != null && Session["Product_Details"] != "")
            {
                List<MVCModels.User_ProductModel> lstsessionUserProductdetails = (List<MVCModels.User_ProductModel>)Session["Product_Details"];
                string str_Userproductdetails = JsonConvert.SerializeObject(lstsessionUserProductdetails);
                ViewBag.SessionProductdetails = str_Userproductdetails;
            }
            ViewBag.User_Code = Usercode;
            ViewBag.Employee_Name = employeeName;
            ViewBag.User_Type = userType;
            ViewBag.Division_Name = divisionName;
            ViewBag.Region_Name = regionName;
            ViewBag.UserType_Code = userTypecode;
            ViewBag.Division_Code = divisionCode;
            ViewBag.entry_Mode = entryMode;
            ViewBag.Region_Code = UserregionCode;
            ViewBag.Reporting_Manager_User_Code = reportingmanagerusercode;
            ViewBag.reportingregioncode = reportingregioncode;
            ViewBag.reportingregionname = reportingregionname;
            return View();
        }
        #region Product Details
        public string GetUserProducts(string userTypeCode, string divisionCode, string entryMode, string ProductName)
        {
            StringBuilder strtbl = new StringBuilder();
            try
            {
                List<MVCModels.User_ProductModel> lstProducts = new List<MVCModels.User_ProductModel>();
                if ("undefined" == ProductName)
                {
                    ProductName = "";
                }

                List<MVCModels.User_ProductModel> lstsessionProductdetails = new List<MVCModels.User_ProductModel>();

                if (Session["Product_Details"] != null && Session["Product_Details"] != "")
                {
                    lstsessionProductdetails = (List<MVCModels.User_ProductModel>)Session["Product_Details"];
                }

                lstProducts = _objUserCreation.GetProductsbyDivision(_objcurrentInfo.GetCompanyCode(), userTypeCode, divisionCode, ProductName).ToList();
                string min_max_config_value = _objUserCreation.GetMinMaxConfig(_objcurrentInfo.GetCompanyCode());

                if (lstProducts != null && lstProducts.Count > 0)
                {
                    int i = 0;
                    // strtbl.Append("<div class='col-md-10 cls_nomargin_nopadding form-group'>");

                    strtbl.Append("<div class='col-md-12 cls_nomargin_nopadding form-group clearfix' >");
                    strtbl.Append("<div class='col-xs-3'>");
                    strtbl.Append("<input type='text' id='txtsearchproduct' class='form-control' placeholder='Search product Name' />");
                    strtbl.Append("</div>");

                    strtbl.Append("<div class='col-xs-3'>");
                    strtbl.Append("<button class='btn btn-primary' id='btnsearchproduct' onclick='return fnSearchProduct()'>Search</button>");
                    strtbl.Append("</div>");
                    strtbl.Append("</div>");
                    strtbl.Append("<table class='table table-responsive' style='width:98% !important;'>");
                    strtbl.Append("<thead style='display: block;'>");
                    strtbl.Append("<tr>");
                    strtbl.Append("<th><input type='checkbox' style='width: 20px !important;' name='chkSelectAll' onclick='fnSelectAll();'/></th>");
                    strtbl.Append("<th style='width:470px;'>Product Name</th>");
                    strtbl.Append("<th style='width:268px;'>Product Type</th>");
                    if (min_max_config_value == "YES")
                    {
                        strtbl.Append("<th style='width:126px;'>Min Count</th>");
                        strtbl.Append("<th style='width:125px;'>Max Count</th>");
                    }
                    strtbl.Append("</tr>");
                    strtbl.Append("</thead>");
                    strtbl.Append("<tbody style='display: block;overflow-y: scroll !important;height: 440px;'>");
                    foreach (var Product in lstProducts)
                    {
                        if (lstsessionProductdetails != null && lstsessionProductdetails.Count > 0)
                        {
                            var lstProductdetails = lstsessionProductdetails.Where(x => x.Product_Code == Product.Product_Code).ToList();
                            if (lstProductdetails != null && lstProductdetails.Count > 0)
                            {
                                strtbl.Append("<tr>");
                                strtbl.Append("<td style='padding-left: 12px; width:50px; !important;'><input type='checkbox' name='chkSelect' checked='checked' id='chkSelect_" + i + "' value='" + Product.Product_Code + "|" + Product.Product_Name + "|" + Product.Product_Type + "|" + Product.Product_Type_Name + "'/></td>");

                            }
                            else
                            {
                                strtbl.Append("<td style='padding-left: 12px; width:50px; !important;'><input type='checkbox' name='chkSelect' id='chkSelect_" + i + "' value='" + Product.Product_Code + "|" + Product.Product_Name + "|" + Product.Product_Type + "|" + Product.Product_Type_Name + "'/></td>");
                            }
                        }
                        else
                        {
                            strtbl.Append("<td style='padding-left: 12px; width:50px; !important;'><input type='checkbox' name='chkSelect' id='chkSelect_" + i + "' value='" + Product.Product_Code + "|" + Product.Product_Name + "|" + Product.Product_Type + "|" + Product.Product_Type_Name + "'/></td>");
                        }
                        strtbl.Append("<span id='txtProductName_" + i + "' value='" + Product.Product_Name + "'><td style='width:465px;'>" + Product.Product_Name + "</td></span>");
                        strtbl.Append("<input type='hidden' id='hdnProductCode_" + i + "' value='" + Product.Product_Code + "'/>");

                        strtbl.Append("<span id='txtProductTypeName_" + i + "' value='" + Product.Product_Type_Name + "'><td style='width:280px;'>" + Product.Product_Type_Name + "</td></span>");
                        strtbl.Append("<input type='hidden' id='hdnProductTypeCode_" + i + "' value='" + Product.Product_Type + "'/>");
                        strtbl.Append("<input type='hidden' id='hdnproductcount' value='" + lstProducts.Count + "'/>");
                        if (min_max_config_value == "YES")
                        {
                            if (lstsessionProductdetails != null && lstsessionProductdetails.Count > 0)
                            {
                                var lstProductdetails = lstsessionProductdetails.Where(x => x.Product_Code == Product.Product_Code).ToList();
                                if (lstProductdetails != null && lstProductdetails.Count > 0)
                                {
                                    strtbl.Append("<td><input type='number' id='txtMinCount_" + i + "' value = '" + lstProductdetails[0].Min_Count + "' style= 'width: 110px; text-align: right;'></td>");
                                    strtbl.Append("<td><input type='number' id='txtMaxCount_" + i + "' value = '" + lstProductdetails[0].Max_Count + "' style= 'width: 110px; text-align: right;'></td>");
                                }
                                else
                                {
                                    strtbl.Append("<td><input type='number' id='txtMinCount_" + i + "' value = '0' style= 'width: 110px; text-align: right;'></td>");
                                    strtbl.Append("<td><input type='number' id='txtMaxCount_" + i + "' value = '0' style= 'width: 110px; text-align: right;'></td>");
                                }
                            }
                            else
                            {
                                strtbl.Append("<td><input type='number' id='txtMinCount_" + i + "' value = '0' style= 'width: 110px; text-align: right;'></td>");
                                strtbl.Append("<td><input type='number' id='txtMaxCount_" + i + "' value = '0' style= 'width: 110px; text-align: right;'></td>");
                            }
                        }
                        strtbl.Append("</tr>");
                        i++;
                    }
                    strtbl.Append("</tbody>");
                    strtbl.Append("</table>");
                }

                else
                {
                    strtbl.Append("<div class='col-md-12 cls_nomargin_nopadding form-group clearfix' >");
                    //strtbl.Append("<div class='col-xs-2'>");
                    //strtbl.Append("<input type='checkbox' name='chkSelectAll' onclick='fnSelectAll();'/>Select All");
                    //strtbl.Append("</div>");

                    strtbl.Append("<div class='col-xs-3'>");
                    strtbl.Append("<input type='text' id='txtsearchproduct' class='form-control' placeholder='Search product Name' />");
                    strtbl.Append("</div>");

                    strtbl.Append("<div class='col-xs-3'>");
                    strtbl.Append("<button class='btn btn-primary' id='btnsearchproduct' onclick='return fnSearchProduct()'>Search</button>");
                    strtbl.Append("</div>");
                    strtbl.Append("</div>");
                    strtbl.Append("<input type='hidden' id='hdnproductcount' value='0'/>");
                    strtbl.Append("<label>There is no User Product Mapping details found</label>");
                }
                //strtbl.Append("</div>");
                //return "test";
                return strtbl.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("userTypeCode", userTypeCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return ex.Message.ToString();
            }
        }

        public List<MVCModels.User_ProductModel> GetUserProductMappingdetails(string productdetails_Arr)
        {
            List<MVCModels.User_ProductModel> lstProductdetails = (List<MVCModels.User_ProductModel>)JsonConvert.DeserializeObject(productdetails_Arr, typeof(List<MVCModels.User_ProductModel>));
            Session["Product_Details"] = lstProductdetails;
            return lstProductdetails;
        }
        #endregion Product Details

        public ActionResult CreateNoticeBoard(string employeeName, string userType, string divisionName, string regionName, string userTypecode, string divisionCode, string entryMode, string UserregionCode, string reportingmanagerusercode, string hidoctorstartdate, string doj)
        {
            if (Session["NoticeBoard_Details"] != null && Session["NoticeBoard_Details"] != "")
            {
                List<MVCModels.User_NoticeBoard> lstsessionnoticeboarddetails = (List<MVCModels.User_NoticeBoard>)Session["NoticeBoard_Details"];
                string str_noticeBoarddetails = JsonConvert.SerializeObject(lstsessionnoticeboarddetails);
                ViewBag.SessionNotieBoarddetails = str_noticeBoarddetails;
            }
            if (Session["Splash_Details"] != null && Session["Splash_Details"] != "")
            {
                List<MVCModels.Splash> lstsessionsplashdetails = (List<MVCModels.Splash>)Session["Splash_Details"];
                string str_splashdetails = JsonConvert.SerializeObject(lstsessionsplashdetails);
                ViewBag.Sessionsplashdetails = str_splashdetails;
            }
            if (Session["Edetailing_Details"] != null && Session["Edetailing_Details"] != "")
            {
                List<MVCModels.Edetailing> lstsessionEdetailingdetails = (List<MVCModels.Edetailing>)Session["Edetailing_Details"];
                string str_Edetailingdetails = JsonConvert.SerializeObject(lstsessionEdetailingdetails);
                ViewBag.SessionEdetailingdetails = str_Edetailingdetails;
            }
            ViewBag.Employee_Name = employeeName;
            ViewBag.User_Type = userType;
            ViewBag.Division_Name = divisionName;
            ViewBag.Region_Name = regionName;
            ViewBag.UserType_Code = userTypecode;
            ViewBag.Division_Code = divisionCode;
            ViewBag.entry_Mode = entryMode;
            ViewBag.Region_Code = UserregionCode;
            ViewBag.Reporting_Manager_User_Code = reportingmanagerusercode;
            ViewBag.Edetailing = _objcurrentInfo.GetEDetailing();
            ViewBag.hidoctorstartdate = hidoctorstartdate;
            ViewBag.doj = doj;
            return View();
        }

        #region Notice Board Details
        public string GetNoticeBoardDetails(string regionCode, string entryMode, string noticeBoardmessage, string reportingManagerUsercode)
        {
            StringBuilder strtbl = new StringBuilder();
            try
            {
                List<MVCModels.User_NoticeBoard> lstNoticeBoardDetails = new List<MVCModels.User_NoticeBoard>();
                List<MVCModels.User_NoticeBoard> lstsessionnoticeBoarddetails = new List<MVCModels.User_NoticeBoard>();
                if ("undefined" == noticeBoardmessage)
                {
                    noticeBoardmessage = "";
                }
                //if (entryMode.ToUpper() == "BACK")
                //{
                if (Session["NoticeBoard_Details"] != null && Session["NoticeBoard_Details"] != "")
                {
                    lstsessionnoticeBoarddetails = (List<MVCModels.User_NoticeBoard>)Session["NoticeBoard_Details"];
                }
                DateTime todayDate = DateTime.Today;
                string activityDate = todayDate.ToString("yyyy-MM-dd");

                lstNoticeBoardDetails = _objUserCreation.GetNoticeboardMessagedetails(_objcurrentInfo.GetCompanyCode(), regionCode, activityDate, noticeBoardmessage, reportingManagerUsercode).ToList();
                //strtbl.Append("<div class='col-md-10 cls_nomargin_nopadding form-group'>");

                //strtbl.Append("<div class='col-md-12 cls_nomargin_nopadding form-group clearfix'>");
                //strtbl.Append("<div class='col-xs-2'>");
                //strtbl.Append("<input type='checkbox' name='chkSelectAllmessage' onclick='fnSelectAllMessage();'/>Select All");
                //strtbl.Append("</div>");

                //strtbl.Append("<div class='col-xs-3'>");
                //strtbl.Append("<input type='text' id='txtsearchText' class='form-control' placeholder='Search Text' />");
                //strtbl.Append("</div>");

                //strtbl.Append("<div class='col-xs-3'>");
                //strtbl.Append("<button class='btn btn-primary' id='btnsearchText' onclick='return fnSearchNoticeboard()'>Search</button>");
                //strtbl.Append("</div>");
                //strtbl.Append("</div>");

                if (lstNoticeBoardDetails != null && lstNoticeBoardDetails.Count > 0)
                {
                    int i = 0;

                    strtbl.Append("<div class='col-md-12 cls_nomargin_nopadding form-group clearfix'>");
                    //strtbl.Append("<div class='col-xs-2'>");
                    //strtbl.Append("<input type='checkbox' name='chkSelectAllmessage' onclick='fnSelectAllMessage();'/>Select All");
                    //strtbl.Append("</div>");

                    strtbl.Append("<div class='col-xs-3'>");
                    strtbl.Append("<input type='text' id='txtsearchText' class='form-control' placeholder='Search Text' />");
                    strtbl.Append("</div>");

                    strtbl.Append("<div class='col-xs-3'>");
                    strtbl.Append("<button class='btn btn-primary' id='btnsearchText' onclick='return fnSearchNoticeboard()'>Search</button>");
                    strtbl.Append("</div>");
                    strtbl.Append("</div>");


                    strtbl.Append("<table class='table table-responsive' style='width:75% !important;margin-left:30px;'>");
                    strtbl.Append("<thead style='display:block;'>");
                    strtbl.Append("<tr>");
                    strtbl.Append("<th style='min-width:109px;'><input type='checkbox' name='chkSelectAllmessage' onclick='fnSelectAllMessage();'/>Select All</th>");
                    strtbl.Append("<th style='min-width:332px;'>Message</th>");
                    strtbl.Append("<th style='min-width:142px;'>Date From</th>");
                    strtbl.Append("<th>Date till which valid</th>");
                    strtbl.Append("</tr>");
                    strtbl.Append("</thead>");
                    strtbl.Append("<tbody style='display:block;height:200px;overflow-y:scroll !important;'>");
                    foreach (var Noticeboard in lstNoticeBoardDetails)
                    {


                        //single check
                        if (lstsessionnoticeBoarddetails != null && lstsessionnoticeBoarddetails.Count > 0)
                        {
                            var lstnoticeboard = lstsessionnoticeBoarddetails.Where(x => x.Msg_Code == Noticeboard.Msg_Code).ToList();
                            if (lstnoticeboard != null && lstnoticeboard.Count > 0)
                            {
                                strtbl.Append("<tr>");
                                strtbl.Append("<td style='min-width:110px;'><input type='checkbox' name='chkSelectmessage' checked='checked' id='chkSelectmessage_" + i + "'  value='" + Noticeboard.Msg_Code + "-" + Noticeboard.Title + "-" + Noticeboard.Date_From + "-" + Noticeboard.Date_To + "'/></td>");

                            }
                            else
                            {

                                strtbl.Append("<td style='min-width:110px;'><input type='checkbox' name='chkSelectmessage' id='chkSelectmessage_" + i + "'  value='" + Noticeboard.Msg_Code + "-" + Noticeboard.Title + "-" + Noticeboard.Date_From + "-" + Noticeboard.Date_To + "'/></td>");

                            }
                        }
                        else
                        {

                            strtbl.Append("<td style='min-width:110px;'><input type='checkbox' name='chkSelectmessage' id='chkSelectmessage_" + i + "'  value='" + Noticeboard.Msg_Code + "-" + Noticeboard.Title + "-" + Noticeboard.Date_From + "-" + Noticeboard.Date_To + "'/></td>");

                        }
                        strtbl.Append("<span id='txtTitle_" + i + "'><td style='min-width:331px;'>" + Noticeboard.Title + "</td></span>");
                        strtbl.Append("<input type='hidden' id='hdnmessageCode_" + i + "' value='" + Noticeboard.Title + "'/>");

                        strtbl.Append("<span id='txtfromDate_" + i + "'><td style='min-width:142px;'>" + Noticeboard.Date_From + "</td></span>");
                        strtbl.Append("<input type='hidden' id='hdnfromDate_" + i + "' value='" + Noticeboard.Date_From + "'/>");

                        strtbl.Append("<span id='txttoDate_" + i + "'><td style='min-width:118px;'>" + Noticeboard.Date_To + "</td></span>");
                        strtbl.Append("<input type='hidden' id='hdntoDate_" + i + "' value='" + Noticeboard.Date_To + "'/>");
                        strtbl.Append("<input type='hidden'id='hdnnoticecount' value='" + lstNoticeBoardDetails.Count + "'/>");
                        strtbl.Append("</tr>");
                        i++;


                    }
                    strtbl.Append("</tbody>");
                    strtbl.Append("</table>");
                }


                else
                {
                    strtbl.Append("<div class='col-md-12 cls_nomargin_nopadding form-group clearfix'>");
                    //strtbl.Append("<div class='col-xs-2'>");
                    //strtbl.Append("<input type='checkbox' name='chkSelectAllmessage' onclick='fnSelectAllMessage();'/>Select All");
                    //strtbl.Append("</div>");

                    strtbl.Append("<div class='col-xs-3'>");
                    strtbl.Append("<input type='text' id='txtsearchText' class='form-control' placeholder='Search Text' />");
                    strtbl.Append("</div>");

                    strtbl.Append("<div class='col-xs-3'>");
                    strtbl.Append("<button class='btn btn-primary' id='btnsearchText' onclick='return fnSearchNoticeboard()'>Search</button>");
                    strtbl.Append("</div>");
                    strtbl.Append("</div>");
                    strtbl.Append("<input type='hidden'id='hdnnoticecount' value='0'/>");
                    strtbl.Append("<label>There is No notice Board message</label>");
                }
                // strtbl.Append("</div>");
                return strtbl.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("regionCode", regionCode);
                dicContext.Add("entryMode", entryMode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return ex.Message.ToString();
            }
        }

        public List<MVCModels.User_NoticeBoard> GetNoticeBoardSessiondetails(string noticeBoardDetails_Arr)
        {
            List<MVCModels.User_NoticeBoard> lstNoticeBoarddetails = (List<MVCModels.User_NoticeBoard>)JsonConvert.DeserializeObject(noticeBoardDetails_Arr, typeof(List<MVCModels.User_NoticeBoard>));
            Session["NoticeBoard_Details"] = lstNoticeBoarddetails;
            return lstNoticeBoarddetails;
        }
        #endregion Notice Board Details
        #region Notice Board Details
        public string GetSplashdetails(string splashmessage)
        {
            StringBuilder strtbl = new StringBuilder();
            try
            {
                List<MVCModels.Splash> lstsplashDetails = new List<MVCModels.Splash>();
                List<MVCModels.Splash> lstsessionsplashdetails = new List<MVCModels.Splash>();

                if (Session["Splash_Details"] != null && Session["Splash_Details"] != "")
                {
                    lstsessionsplashdetails = (List<MVCModels.Splash>)Session["Splash_Details"];
                }
                DateTime todayDate = DateTime.Today;
                string activityDate = todayDate.ToString("yyyy-MM-dd");

                lstsplashDetails = _objUserCreation.GetSplashdetails(_objcurrentInfo.GetCompanyCode(), splashmessage).ToList();

                if (lstsplashDetails != null && lstsplashDetails.Count > 0)
                {
                    int i = 0;

                    strtbl.Append("<div class='col-md-12 cls_nomargin_nopadding form-group clearfix'>");

                    strtbl.Append("<div class='col-xs-3'>");
                    strtbl.Append("<input type='text' id='txtsplashsearchText' class='form-control' placeholder='Search Text' />");
                    strtbl.Append("</div>");

                    strtbl.Append("<div class='col-xs-3'>");
                    strtbl.Append("<button class='btn btn-primary' id='btnsearchText' onclick='return fnSearchsplash()'>Search</button>");
                    strtbl.Append("</div>");
                    strtbl.Append("</div>");

                    strtbl.Append("<table class='table table-responsive' style='width:75% !important;margin-left:30px;'>");
                    strtbl.Append("<thead style='display:block;'>");
                    strtbl.Append("<tr>");
                    strtbl.Append("<th style='min-width:109px;'><input type='checkbox' name='chkSelectAllsplashmessage' onclick='fnSelectAllMessagesplash();'/>Select All</th>");
                    strtbl.Append("<th style='min-width:332px;'>Message</th>");
                    strtbl.Append("<th style='min-width:142px;'>Date From</th>");
                    strtbl.Append("<th>Date till which valid</th>");
                    strtbl.Append("</tr>");
                    strtbl.Append("</thead>");
                    strtbl.Append("<tbody style='display:block;height:75px;overflow-y:scroll !important;'>");
                    foreach (var splash in lstsplashDetails)
                    {


                        // single check
                        if (lstsessionsplashdetails != null && lstsessionsplashdetails.Count > 0)
                        {
                            var lstsplash = lstsessionsplashdetails.ToList();
                            if (lstsplash != null && lstsplash.Count > 0)
                            {
                                strtbl.Append("<tr>");
                                strtbl.Append("<td style='min-width:110px;'><input type='checkbox' name='chkSelectmessagesplash' checked='checked' id='chkSelectmessagesplash_" + i + "'  value='" + splash.Title + "-" + splash.Date_From + "-" + splash.Date_To + "'/></td>");

                            }
                            else
                            {

                                strtbl.Append("<td style='min-width:110px;'><input type='checkbox' name='chkSelectmessagesplash' id='chkSelectmessagesplash_" + i + "'  value='" + splash.Title + "-" + splash.Date_From + "-" + splash.Date_To + "'/></td>");

                            }
                        }
                        else
                        {

                            strtbl.Append("<td style='min-width:110px;'><input type='checkbox' name='chkSelectmessagesplash' id='chkSelectmessagesplash_" + i + "'  value='" + "-" + splash.Title + "-" + splash.Date_From + "-" + splash.Date_To + "'/></td>");

                        }
                        strtbl.Append("<span id='txtTitle_" + i + "'><td style='min-width:331px;'>" + splash.Title + "</td></span>");
                        strtbl.Append("<input type='hidden' id='hdnmessageCode_" + i + "' value='" + splash.Title + "'/>");

                        strtbl.Append("<span id='txtfromDate_" + i + "'><td style='min-width:142px;'>" + splash.Date_From + "</td></span>");
                        strtbl.Append("<input type='hidden' id='hdnfromDate_" + i + "' value='" + splash.Date_From + "'/>");

                        strtbl.Append("<span id='txttoDate_" + i + "'><td style='min-width:118px;'>" + splash.Date_To + "</td></span>");
                        strtbl.Append("<input type='hidden' id='hdntoDate_" + i + "' value='" + splash.Date_To + "'/>");
                        strtbl.Append("<input type='hidden' id='hdnsplashid_" + i + "' value='" + splash.Splash_Screen_Id + "'/>");
                        strtbl.Append("<input type='hidden' id='hdnsplashcount' value='" + lstsplashDetails.Count + "'/>");
                        strtbl.Append("</tr>");
                        i++;


                    }
                    strtbl.Append("</tbody>");
                    strtbl.Append("</table>");
                }

                else
                {
                    strtbl.Append("<div class='col-md-12 cls_nomargin_nopadding form-group clearfix'>");

                    strtbl.Append("<div class='col-xs-3'>");
                    strtbl.Append("<input type='text' id='txtsearchText' class='form-control' placeholder='Search Text' />");
                    strtbl.Append("</div>");

                    strtbl.Append("<div class='col-xs-3'>");
                    strtbl.Append("<button class='btn btn-primary' id='btnsearchText' onclick='return fnSearchsplash()'>Search</button>");
                    strtbl.Append("</div>");
                    strtbl.Append("</div>");
                    strtbl.Append("<input type='hidden'id='hdnsplashcount' value='0'/>");
                    strtbl.Append("<label>There is No Splash message</label>");
                }
                // strtbl.Append("</div>");
                return strtbl.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return ex.Message.ToString();
            }
        }

        public List<MVCModels.Splash> GetSplashdetail(string splash_Arr)
        {

            List<MVCModels.Splash> lstsplashDetails = (List<MVCModels.Splash>)JsonConvert.DeserializeObject(splash_Arr, typeof(List<MVCModels.Splash>));
            Session["Splash_Details"] = lstsplashDetails;
            return lstsplashDetails;
        }
        #endregion Splash Details
        public string GetEdetailingdetails(string message)
        {
            StringBuilder strtbl = new StringBuilder();
            try
            {
                List<MVCModels.Edetailing> lstEdetailingDetails = new List<MVCModels.Edetailing>();
                List<MVCModels.Edetailing> lstsessionEdetailingdetails = new List<MVCModels.Edetailing>();

                if (Session["Edetailing_Details"] != null && Session["Edetailing_Details"] != "")
                {
                    lstsessionEdetailingdetails = (List<MVCModels.Edetailing>)Session["Edetailing_Details"];
                }
                DateTime todayDate = DateTime.Today;
                string activityDate = todayDate.ToString("yyyy-MM-dd");

                lstEdetailingDetails = _objUserCreation.GetEdetailingdata(_objcurrentInfo.GetCompanyCode(), message).ToList();

                if (lstEdetailingDetails != null && lstEdetailingDetails.Count > 0)
                {
                    int i = 0;

                    strtbl.Append("<div class='col-md-12 cls_nomargin_nopadding form-group clearfix' style='margin-top:15px;'>");

                    strtbl.Append("<div class='col-xs-3'>");
                    strtbl.Append("<input type='text' id='btnsearchedetailingText' class='form-control' placeholder='Search Text' />");
                    strtbl.Append("</div>");

                    strtbl.Append("<div class='col-xs-3'>");
                    strtbl.Append("<button class='btn btn-primary' id='btnsearchText' onclick='return fnSearchedetailing()'>Search</button>");
                    strtbl.Append("</div>");
                    strtbl.Append("</div>");

                    strtbl.Append("<table class='table table-responsive' style='width:75% !important;margin-left:30px;'>");
                    strtbl.Append("<thead style='display:block;'>");
                    strtbl.Append("<tr>");
                    strtbl.Append("<th style='min-width:109px;'><input type='checkbox' name='chkSelectAllEdetailingmessage' onclick='fnSelectAllMessageedetailing();'/>Select All</th>");
                    strtbl.Append("<th style='min-width:374px;'>Asset Name</th>");
                    strtbl.Append("<th style='min-width:142px;'>Date From</th>");
                    strtbl.Append("<th>Date till which valid</th>");
                    strtbl.Append("</tr>");
                    strtbl.Append("</thead>");
                    strtbl.Append("<tbody style='display:block;height:200px;overflow-y:scroll !important;'>");
                    foreach (var Edetailing in lstEdetailingDetails)
                    {

                        var From = Edetailing.FromDate;
                        var FromDate = From.Split(' ');
                        var to = Edetailing.ToDate;
                        var ToDate = to.Split(' ');
                        // single check
                        if (lstsessionEdetailingdetails != null && lstsessionEdetailingdetails.Count > 0)
                        {
                            //  var lstEdetailing = lstsessionEdetailingdetails.ToList();
                            var lstEdetailing = lstsessionEdetailingdetails.Where(x => x.DA_Code == Edetailing.DA_Code).ToList();
                            if (lstEdetailing != null && lstEdetailing.Count > 0)
                            {
                                strtbl.Append("<tr>");
                                strtbl.Append("<td style='min-width:110px;'><input type='checkbox' name='chkSelectmessageEdetailing' checked='checked' id='chkSelectmessageEdetailing_" + i + "'  value='" + Edetailing.DA_Name + "(" + FromDate[0] + "(" + ToDate[0] + "(" + Edetailing.DA_Code + "'/></td>");

                            }
                            else
                            {

                                strtbl.Append("<td style='min-width:110px;'><input type='checkbox' name='chkSelectmessageEdetailing' id='chkSelectmessageEdetailing_" + i + "'  value='" + Edetailing.DA_Name + "(" + FromDate[0] + "(" + ToDate[0] + "(" + Edetailing.DA_Code + "'/></td>");

                            }
                        }
                        else
                        {

                            strtbl.Append("<td style='min-width:110px;'><input type='checkbox' name='chkSelectmessageEdetailing' id='chkSelectmessageEdetailing_" + i + "'  value='" + Edetailing.DA_Name + "(" + FromDate[0] + "(" + ToDate[0] + "(" + Edetailing.DA_Code + "'/></td>");

                        }
                        strtbl.Append("<span id='txteTitle_" + i + "'><td style='min-width:373px;'>" + Edetailing.DA_Name + "</td></span>");
                        strtbl.Append("<input type='hidden' id='hdnemessageCode_" + i + "' value='" + Edetailing.DA_Name + "'/>");

                        strtbl.Append("<span id='txtefromDate_" + i + "'><td style='min-width:142px;'>" + FromDate[0] + "</td></span>");
                        strtbl.Append("<input type='hidden' id='hdnefromDate_" + i + "' value='" + FromDate[0] + "'/>");

                        strtbl.Append("<span id='txtetoDate_" + i + "'><td style='min-width:118px;'>" + ToDate[0] + "</td></span>");
                        strtbl.Append("<input type='hidden' id='hdnetoDate_" + i + "' value='" + ToDate[0] + "'/>");
                        strtbl.Append("<input type='hidden' id='hdnedetailingid_" + i + "' value='" + Edetailing.DA_Code + "'/>");
                        strtbl.Append("<input type='hidden' id='hdnedetailingcount' value='" + lstEdetailingDetails.Count + "'/>");
                        strtbl.Append("</tr>");
                        i++;


                    }
                    strtbl.Append("</tbody>");
                    strtbl.Append("</table>");
                }

                else
                {
                    strtbl.Append("<div class='col-md-12 cls_nomargin_nopadding form-group clearfix' style='margin-top:15px;'>");

                    strtbl.Append("<div class='col-xs-3'>");
                    strtbl.Append("<input type='text' id='btnsearchedetailingText' class='form-control' placeholder='Search Text' />");
                    strtbl.Append("</div>");

                    strtbl.Append("<div class='col-xs-3'>");
                    strtbl.Append("<button class='btn btn-primary' id='btnsearchText' onclick='return fnSearchedetailing()'>Search</button>");
                    strtbl.Append("</div>");
                    strtbl.Append("</div>");
                    strtbl.Append("<input type='hidden'id='hdnEdetailingcount' value='0'/>");
                    strtbl.Append("<label>There is No Edetailing message</label>");
                }
                // strtbl.Append("</div>");
                return strtbl.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return ex.Message.ToString();
            }
        }

        public List<MVCModels.Edetailing> GetEdetailingdetail(string Edetailing_Arr)
        {

            List<MVCModels.Edetailing> lstEdetailingDetails = (List<MVCModels.Edetailing>)JsonConvert.DeserializeObject(Edetailing_Arr, typeof(List<MVCModels.Edetailing>));
            Session["Edetailing_Details"] = lstEdetailingDetails;
            return lstEdetailingDetails;
        }
        #endregion edetailing
        //Launch New User
        public ActionResult CreateNewUser(string employeeName, string userType, string divisionName, string regionName, string userTypecode, string divisionCode, string UserregionCode, string reportingmanagerusercode, string hidoctorstartdate, string doj)
        {
            DataControl.CurrentInfo _objcurr = new CurrentInfo();
            string smsNeeded = string.Empty;
            _objIconfigsettings = new Config_Settings();
            smsNeeded = _objIconfigsettings.GetConfigDefaultValue(_objcurrentInfo.GetCompanyCode(), CONFIG_TYPE.USER, CONFIG_KEY.SMS_ON_USER_CREATION);
            if (Session["NoticeBoard_Details"] != null && Session["NoticeBoard_Details"] != "")
            {
                List<MVCModels.User_NoticeBoard> lstsessionnoticeboarddetails = (List<MVCModels.User_NoticeBoard>)Session["NoticeBoard_Details"];
                string str_noticeBoarddetails = JsonConvert.SerializeObject(lstsessionnoticeboarddetails);
                ViewBag.SessionNotieBoarddetails = str_noticeBoarddetails;
            }
            if (Session["Splash_Details"] != null && Session["Splash_Details"] != "")
            {
                List<MVCModels.Splash> lstsessionsplashdetails = (List<MVCModels.Splash>)Session["Splash_Details"];
                string str_splashdetails = JsonConvert.SerializeObject(lstsessionsplashdetails);
                ViewBag.Sessionsplashdetails = str_splashdetails;
            }
            if (Session["Edetailing_Details"] != null && Session["Edetailing_Details"] != "")
            {
                List<MVCModels.Edetailing> lstsessionEdetailingdetails = (List<MVCModels.Edetailing>)Session["Edetailing_Details"];
                string str_Edetailingdetails = JsonConvert.SerializeObject(lstsessionEdetailingdetails);
                ViewBag.SessionEdetailingdetails = str_Edetailingdetails;
            }
            if (Session["Employee_Details"] != null && Session["Employee_Details"] != "")
            {
                List<MVCModels.User_Employeedetails> lstsessionemployeedetails = (List<MVCModels.User_Employeedetails>)Session["Employee_Details"];
                ViewBag.User_Name = lstsessionemployeedetails[0].User_Name;
                ViewBag.Pass_Word = lstsessionemployeedetails[0].User_Pass;
                ViewBag.Mobile_No = lstsessionemployeedetails[0].Mobile;
                ViewBag.User_Code = lstsessionemployeedetails[0].User_Code;
            }
            ViewBag.Employee_Name = employeeName;
            ViewBag.User_Type = userType;
            ViewBag.Division_Name = divisionName;
            ViewBag.Region_Name = regionName;
            ViewBag.UserType_Code = userTypecode;
            ViewBag.Division_Code = divisionCode;
            ViewBag.Region_Code = UserregionCode;
            ViewBag.Sms_Alert = smsNeeded;
            ViewBag.Reporting_Manager_User_Code = reportingmanagerusercode;
            ViewBag.GetIsKangleIntegrated = _objcurr.GetIsKangleIntegrated();
            ViewBag.hidoctorstartdate = hidoctorstartdate;
            ViewBag.doj = doj;
            return View();
        }
        #region Create New User
        public string InsertUserDetails(int value, int TPLockvalue)
        {
            string result = string.Empty;
            DateTime todayDate = DateTime.Today;
            string activityDate = todayDate.ToString("yyyy-MM-dd");
            List<MVCModels.User_Employeedetails> lstEmployeedetails = new List<MVCModels.User_Employeedetails>();
            List<MVCModels.User_Employeedetails> lstsessionemployeedetails = new List<MVCModels.User_Employeedetails>();
            List<MVCModels.User_LeaveTypeModel> lstsessionleavedetails = new List<MVCModels.User_LeaveTypeModel>();
            List<MVCModels.User_ProductModel> lstsessionproductdetails = new List<MVCModels.User_ProductModel>();

            List<MVCModels.User_NoticeBoard> lstsessionnoticeboarddetails = new List<MVCModels.User_NoticeBoard>();
            List<MVCModels.Splash> lstsessionsplashdetails = new List<MVCModels.Splash>();
            List<MVCModels.Edetailing> lstsessionEdetailingdetails = new List<MVCModels.Edetailing>();
            if (Session["Employee_Details"] != null && Session["Employee_Details"] != "")
            {
                lstsessionemployeedetails = (List<MVCModels.User_Employeedetails>)Session["Employee_Details"];
            }
            if (Session["Leave_Details"] != null && Session["Leave_Details"] != "")
            {
                lstsessionleavedetails = (List<MVCModels.User_LeaveTypeModel>)Session["Leave_Details"];
            }
            if (Session["Product_Details"] != null && Session["Product_Details"] != "")
            {
                lstsessionproductdetails = (List<MVCModels.User_ProductModel>)Session["Product_Details"];
            }
            if (Session["NoticeBoard_Details"] != null && Session["NoticeBoard_Details"] != "")
            {
                lstsessionnoticeboarddetails = (List<MVCModels.User_NoticeBoard>)Session["NoticeBoard_Details"];
            }
            if (Session["Splash_Details"] != null && Session["Splash_Details"] != "")
            {
                lstsessionsplashdetails = (List<MVCModels.Splash>)Session["Splash_Details"];
            }
            if (Session["Edetailing_Details"] != null && Session["Edetailing_Details"] != "")
            {
                lstsessionEdetailingdetails = (List<MVCModels.Edetailing>)Session["Edetailing_Details"];
            }
            lstsessionemployeedetails.ForEach
                (
                x => x.Company_Code = _objcurrentInfo.GetCompanyCode()
                );
            lstsessionemployeedetails.ForEach
                    (
                    y => y.Created_By = _objcurrentInfo.GetUserCode()
                    );
            lstsessionleavedetails.ForEach
                (
                x => x.Company_Code = _objcurrentInfo.GetCompanyCode()
                );
            lstsessionproductdetails.ForEach
                  (
                  x => x.Company_Code = _objcurrentInfo.GetCompanyCode()
                  );
            lstsessionnoticeboarddetails.ForEach
                (
                x => x.Company_Code = _objcurrentInfo.GetCompanyCode()
                );
            lstsessionsplashdetails.ForEach
                (
                 x => x.Company_Code = _objcurrentInfo.GetCompanyCode()
                );
            lstsessionEdetailingdetails.ForEach
             (
              x => x.Company_Code = _objcurrentInfo.GetCompanyCode()
             );
            lstsessionemployeedetails.ForEach(
                    y => y.Effective_From = activityDate
                );
            lstsessionleavedetails.ForEach
                (
                y => y.Effective_From = y.Effective_From.Split('/')[2] + '-' + y.Effective_From.Split('/')[1] + '-' + y.Effective_From.Split('/')[0]
                );
            lstsessionleavedetails.ForEach
                (
                y => y.Effective_To = y.Effective_To.Split('/')[2] + '-' + y.Effective_To.Split('/')[1] + '-' + y.Effective_To.Split('/')[0]
                );
            lstsessionproductdetails.ForEach
                (
                y => y.Effective_From = activityDate
                );
            string underuser = lstsessionemployeedetails[0].lstunderuser;
            int SPLASHID = 0;
            if (lstsessionsplashdetails.Count() > 0)
            {
                SPLASHID = lstsessionsplashdetails[0].Splash_Screen_Id;

            }
            int EdetailingId = 0;
            int DACode = 0;
            if (lstsessionEdetailingdetails.Count() > 0)
            {
                DACode = lstsessionEdetailingdetails[0].DA_Code;

            }
            var daCode = "";
            foreach (var item in lstsessionEdetailingdetails)
            {
                if (daCode == "")
                    daCode = item.DA_Code.ToString();
                else
                    daCode = daCode + "," + item.DA_Code.ToString();
            }
            string strGuid = Guid.NewGuid().ToString();
            // int DA = lstsessionEdetailingdetails[0].DA_Code;
            // string DACode = Convert.ToString(DA);
            if (lstsessionEdetailingdetails.Count() > 0)
            {
                EdetailingId = lstsessionEdetailingdetails[0].DA_Code;

            }
            result = _objUserCreation.CreatNewUser(lstsessionemployeedetails, lstsessionleavedetails, lstsessionproductdetails, lstsessionnoticeboarddetails, lstsessionsplashdetails, lstsessionEdetailingdetails, _objcurrentInfo.GetUserName(), value, TPLockvalue, underuser, SPLASHID, EdetailingId, DACode, strGuid, daCode);
            // }
            return result;
        }

        public string SendPassword(string userCode, string mobileNumber)
        {
            try
            {
                StringBuilder sbTableContent = new StringBuilder();
                int successcount = 0;
                string mesgalert = string.Empty;
                string failure = string.Empty;
                string url = string.Empty;
                string message = string.Empty;
                string userName = string.Empty;
                string password = string.Empty;
                string mobileno = string.Empty;
                DateTime todayDate = DateTime.Today;
                string activityDate = todayDate.ToString("yyyy-MM-dd");
                Regex regExInt = new Regex("^([0-9]*)$");
                List<MVCModels.SendSMS> lstUser = new List<MVCModels.SendSMS>();
                DataControl.BLMaster _objMapping = new DataControl.BLMaster();
                DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
                string companyCode = _objCurInfo.GetCompanyCode();
                string companyId = _objCurInfo.GetCompanyId();
                string senderCode = _objCurInfo.GetUserCode();
                string senderName = _objCurInfo.GetUserName();

                lstUser = (List<MVCModels.SendSMS>)_objMapping.SendSMS(companyCode, userCode);

                url = "http://" + Request.Url.DnsSafeHost;
                foreach (var user in lstUser)
                {
                    userCode = user.User_Code.ToString();
                    userName = user.User_Name.ToString();
                    password = user.User_Pass.ToString();
                    mobileno = user.Mobile_Number.ToString();
                    message = "Welcome to HiDoctor. Website address for online reporting: [variable1] Your user name is [variable2] and password is [variable3].";
                    message = message.Replace("[variable1]", url).Replace("[variable2]", userName).Replace("[variable3]", password);

                    if (!string.IsNullOrEmpty(mobileno))
                    {
                        if (mobileno.Length == 10 && regExInt.IsMatch(mobileno))
                        {
                            HttpWebRequest request = (HttpWebRequest)
                            WebRequest.Create("http://www.smsintegra.co.in/smsweb/desktop_sms/desktopsms.asp?uid=swaassys&pwd=963900&mobile=" + mobileno + "&msg=" + message + "&sid=HIDOCT&dtNow=" + DateTime.Now.ToString("yyyy-MM-dd") + "");
                            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                            using (Stream responseStream = response.GetResponseStream())
                            {
                                using (StreamReader readStream = new StreamReader(responseStream, Encoding.UTF8))
                                {
                                    string strSMSResponseString = readStream.ReadToEnd();

                                    if (strSMSResponseString.StartsWith("100"))
                                    {
                                        successcount++;
                                        _objMapping.SMSSentLog(companyCode, companyId, userCode, userName, senderCode, senderName, mobileno, message);
                                    }
                                    else
                                    {
                                        failure += "<tr><td>" + userName + "</td><td>" + mobileno + "</td><td>Due to some technical error, unable to send SMS</td></tr>";
                                    }
                                }
                            }
                        }
                        else
                        {
                            failure += "<tr><td>" + userName + "</td><td>" + mobileno + "</td><td>Mobile No. is invalid. Please update the correct mobile no. in employee master</td></tr>";
                        }
                    }
                    else
                    {
                        failure += "<tr><td>" + userName + "</td><td>&nbsp</td><td>Mobile No. is empty. Please update the mobile no. in employee master</td></tr>";
                    }
                }
                if (failure != string.Empty)
                {
                    sbTableContent.Append("<table id='error' class='table table-striped' >");
                    sbTableContent.Append("<thead class='active'>");
                    sbTableContent.Append("<tr style='background-color: #428bca'>");
                    sbTableContent.Append("<td class='errortable'>User Name</td>");
                    sbTableContent.Append("<td class='errortable'>Mobile Number</td>");
                    sbTableContent.Append("<td class='errortable'>Error</td>");
                    sbTableContent.Append("</tr>");
                    sbTableContent.Append("</thead>");
                    sbTableContent.Append(failure);
                    sbTableContent.Append("</table>");

                    mesgalert = "SMS sent for " + successcount + " user(s). Unable to send SMS for some user(s). Please scroll down to see the error messages";
                }
                else
                {
                    mesgalert = "SMS sent for " + successcount.ToString() + " user(s)";
                }
                return sbTableContent.ToString() + "*" + mesgalert;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:UserCode", userCode);
                dicContext.Add("Filter:CreatedDate", mobileNumber);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return "Sorry an error occured. Please try again later.";
            }
        }

        #endregion Create New User
        #region Disable User
        public ActionResult DisableUser(string employeeCode, string userName, string userCode, string disableDate, string entrymode)
        {
            List<MVCModels.User_Employeedetails> lstsessiondisabledetails = new List<MVCModels.User_Employeedetails>();
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            if (Session["Disable_UserDetails"] != null && Session["Disable_UserDetails"] != "")
            {
                lstsessiondisabledetails = (List<MVCModels.User_Employeedetails>)Session["Disable_UserDetails"];
                string str_sessiondisabledetails = JsonConvert.SerializeObject(lstsessiondisabledetails);
                ViewBag.Sessiondisabledetails = str_sessiondisabledetails;
            }

            ViewBag.User_Code = userCode;
            ViewBag.Employee_Code = employeeCode;
            ViewBag.User_Name = userName;
            ViewBag.Acivie_Date = disableDate;
            ViewBag.Entry_Mode = entrymode;
            ViewBag.Company_Code = _objCurInfo.GetCompanyCode();
            if (lstsessiondisabledetails != null && lstsessiondisabledetails.Count > 0)
            {
                ViewBag.Employee_Number = lstsessiondisabledetails[0].Employee_Number;
                ViewBag.Region_Code = lstsessiondisabledetails[0].Region_Name;
                ViewBag.Region_Name = lstsessiondisabledetails[0].Region_Name;
                ViewBag.Employee_Name = lstsessiondisabledetails[0].Employee_Name;
            }
            return View();
        }
        public ActionResult UserHierarchy(int id, string UserCode)
        {
            ViewBag.ID = id;
            ViewBag.User_Code = UserCode;

            return View();
        }
        /// <summary>
        /// used to get user details
        /// </summary>
        /// <returns></returns>
        public JsonResult GetchildUsertoDisable()
        {
            List<MVCModels.User_UserMasterModel> lstuser = new List<MVCModels.User_UserMasterModel>();
            lstuser = _objUserCreation.GetUserToDisable(_objcurrentInfo.GetCompanyCode(), _objcurrentInfo.GetUserCode()).ToList();
            return Json(_objJson.Serialize(lstuser));
        }
        /// <summary>
        /// Get child regions
        /// </summary>
        /// <returns></returns>
        public JsonResult GetChildregiontoDisable()
        {
            List<MVCModels.User_RegionMasterModel> lstRegions = new List<MVCModels.User_RegionMasterModel>();
            lstRegions = _objUserCreation.GetRegiontoDisable(_objcurrentInfo.GetCompanyCode(), _objcurrentInfo.GetRegionCode()).ToList();
            return Json(_objJson.Serialize(lstRegions));
        }
        /// <summary>
        /// Get employee details to disable
        /// </summary>
        /// <returns></returns>
        public JsonResult GetEmployeedetailstoDisable()
        {
            List<MVCModels.HiDoctor_Master.EmployeeModel> lstActiveemployeedetails = new List<MVCModels.HiDoctor_Master.EmployeeModel>();
            lstActiveemployeedetails = _objUserCreation.GetEmployeeNumbertoDisable(_objcurrentInfo.GetCompanyCode(), _objcurrentInfo.GetUserCode()).ToList();
            return Json(_objJson.Serialize(lstActiveemployeedetails));
        }
        /// <summary>
        /// Get Child User count
        /// </summary>
        /// <param name="userCode"></param>
        /// <returns></returns>
        public JsonResult GetChildUsers(string userCode)
        {
            List<MVCModels.Disable_Emloyeedetails> lstEmployeeName = new List<MVCModels.Disable_Emloyeedetails>();
            lstEmployeeName = _objUserCreation.GetChildUsers(_objcurrentInfo.GetCompanyCode(), userCode).ToList();
            return Json(_objJson.Serialize(lstEmployeeName));
        }
        /// <summary>
        /// Get EmployeeName by Usercode
        /// </summary>
        /// <param name="userCode"></param>
        /// <returns></returns>
        public JsonResult GetEmployeeNamebyUserCode(string userCode)
        {
            List<MVCModels.Disable_Emloyeedetails> lstEmployeeName = new List<MVCModels.Disable_Emloyeedetails>();
            lstEmployeeName = _objUserCreation.GetEmployeeNamebyUserCode(_objcurrentInfo.GetCompanyCode(), userCode).ToList();
            return Json(_objJson.Serialize(lstEmployeeName));
        }
        /// <summary>
        /// Get EmployeeName by EmployeeCOde
        /// </summary>
        /// <param name="employeeCode"></param>
        /// <returns></returns>
        public JsonResult GetEmployeeNamebyEmployeeCode(string employeeCode)
        {
            List<MVCModels.Disable_Emloyeedetails> lstEmployeeName = new List<MVCModels.Disable_Emloyeedetails>();
            lstEmployeeName = _objUserCreation.GetEmployeeNamebyEmployeeCode(_objcurrentInfo.GetCompanyCode(), employeeCode).ToList();
            return Json(_objJson.Serialize(lstEmployeeName));
        }
        /// <summary>
        /// Get EmployeeName by Regioncode
        /// </summary>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public JsonResult GetEmployeeNamebyRegionCode(string regionCode)
        {
            List<MVCModels.Disable_Emloyeedetails> lstEmployeeName = new List<MVCModels.Disable_Emloyeedetails>();
            lstEmployeeName = _objUserCreation.GetEmployeeNamebyRegionCode(_objcurrentInfo.GetCompanyCode(), regionCode).ToList();
            return Json(_objJson.Serialize(lstEmployeeName));
        }

        public ActionResult DisableUserfromMasterData(string employeeCode, string userName, string userCode, string activeDate, string employeeNumber, string entrymode)
        {
            List<MVCModels.User_Employeedetails> lstsessiondisabledetails = new List<MVCModels.User_Employeedetails>();
            if (Session["Disable_UserDetails"] != null && Session["Disable_UserDetails"] != "")
            {
                lstsessiondisabledetails = (List<MVCModels.User_Employeedetails>)Session["Disable_UserDetails"];
                string str_sessiondisabledetails = JsonConvert.SerializeObject(lstsessiondisabledetails);
                ViewBag.Sessiondisabledetails = str_sessiondisabledetails;
            }

            ViewBag.User_Code = userCode;
            ViewBag.Employee_Code = employeeCode;
            ViewBag.User_Name = userName;
            ViewBag.Acivie_Date = activeDate;
            ViewBag.Employee_Number = employeeNumber;
            ViewBag.Entry_Mode = entrymode;
            if (lstsessiondisabledetails != null && lstsessiondisabledetails.Count > 0)
            {
                ViewBag.Region_Code = lstsessiondisabledetails[0].Region_Name;
                ViewBag.Region_Name = lstsessiondisabledetails[0].Region_Name;
                ViewBag.Employee_Name = lstsessiondisabledetails[0].Employee_Name;
            }
            return View();
        }

        public List<MVCModels.User_Employeedetails> GetDisableSessionValues(string disableUserdetaills_Arr)
        {
            List<MVCModels.User_Employeedetails> lstDisableuserDetails = (List<MVCModels.User_Employeedetails>)JsonConvert.DeserializeObject(disableUserdetaills_Arr, typeof(List<MVCModels.User_Employeedetails>));
            Session["Disable_UserDetails"] = lstDisableuserDetails;
            return lstDisableuserDetails;
        }
        /// <summary>
        /// Used to get disable User
        /// </summary>
        /// <param name="userCode"></param>
        /// <param name="employeeCode"></param>
        /// <param name="activeDate"></param>
        /// <returns></returns>
        public string DisableUserfromMaster(string userCode, string employeeCode, string activeDate, string Remarks)
        {
            try
            {
                string result = string.Empty;
                result = _objUserCreation.UpdateDisableUser(_objcurrentInfo.GetCompanyCode(), userCode, _objcurrentInfo.GetUserCode(), activeDate, Remarks);
                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("userCode", userCode);
                dicContext.Add("employeeCode", employeeCode);
                dicContext.Add("activeDate", activeDate);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return ex.Message.ToString();
            }
        }
        public JsonResult Getleafusers(string UserCode)
        {
            List<MVCModels.UnderUserModel> lstleafusers = new List<MVCModels.UnderUserModel>();
            lstleafusers = _objUserCreation.Getleafusers(UserCode).ToList();
            return Json(_objJson.Serialize(lstleafusers));
        }
        public JsonResult Getresuserdivision(string UserCode)
        {
            List<MVCModels.UserDivisions> lstUserDivision = new List<MVCModels.UserDivisions>();
            lstUserDivision = _objUserCreation.Getresuserdivision(_objcurrentInfo.GetCompanyCode(), UserCode).ToList();
            return Json(_objJson.Serialize(lstUserDivision));
        }
        public JsonResult GetReportedMangers(string UserCode)
        {
            List<MVCModels.ReportedUser> lstReported = new List<MVCModels.ReportedUser>();
            lstReported = _objUserCreation.GetReportedMangers(_objcurrentInfo.GetCompanyCode(), UserCode, _objcurrentInfo.GetUserCode()).ToList();
            return Json(_objJson.Serialize(lstReported));
        }
        public bool Insertleafuser(List<MVCModels.Reportuserhierarchy> lstuserdisable)
        {
            //string result = string.Empty;
            bool result = false;
            DataControl.CurrentInfo _objcurr = new CurrentInfo();

            result = _objUserCreation.Insertleafuser(_objcurr.GetCompanyCode(), lstuserdisable);
            return result;
        }

        public JsonResult GetDCRdate(string UserCode)
        {
            List<MVCModels.DCRDATE> lstReported = new List<MVCModels.DCRDATE>();
            lstReported = _objUserCreation.GetDCRdate(UserCode).ToList();
            return Json(_objJson.Serialize(lstReported));
        }
        public JsonResult GetUsers(string CompanyCode)
        {
            List<MVCModels.UnderUserModel> lstusers = new List<MVCModels.UnderUserModel>();
            DataControl.CurrentInfo _objcurr = new CurrentInfo();
            lstusers = _objUserCreation.GetUsers(_objcurr.GetCompanyCode()).ToList();
            return Json(_objJson.Serialize(lstusers));
        }
        public JsonResult Getempcode(string UserCode)
        {
            List<MVCModels.Employee> lstusers = new List<MVCModels.Employee>();

            lstusers = _objUserCreation.Getempcode(UserCode).ToList();
            return Json(_objJson.Serialize(lstusers));
        }
        public JsonResult Getuserdetails(string UserCode)
        {
            List<MVCModels.UserDetails> lstusers = new List<MVCModels.UserDetails>();

            if (Session["Update_User_Details"] != null && Session["Update_User_Details"] != "")
            {
                lstusers = (List<MVCModels.UserDetails>)Session["Update_User_Details"];
            }
            else
            {
                lstusers = _objUserCreation.Getuserdetails(UserCode).ToList();
            }
            return Json(_objJson.Serialize(lstusers));
        }

        public List<MVCModels.UserDetails> UpdateSessionUserDetails(string UpdateUser_arr, string mode)
        {
            List<MVCModels.UserDetails> lstUserDetails = (List<MVCModels.UserDetails>)JsonConvert.DeserializeObject(UpdateUser_arr, typeof(List<MVCModels.UserDetails>));
            Session["Update_User_Details"] = lstUserDetails;
            return lstUserDetails;
        }

        public string UpdateUserDetailsFromSession()
        {
            List<MVCModels.UserDetails> lstUpdateUserDetails = new List<UserDetails>();
            if (Session["Update_User_Details"] != null && Session["Update_User_Details"] != "")
            {
                lstUpdateUserDetails = (List<MVCModels.UserDetails>)Session["Update_User_Details"];
            }

            string User_Code = string.Empty;
            string Region_Code = string.Empty;
            string User_Type_Code = string.Empty;
            string Under_User_Code = string.Empty;
            string Division_Code = string.Empty;
            int ExpenseId = 0;
            string Effectivefrom = string.Empty;
            int Effective = 0;
            string RefKey1 = string.Empty;
            string RefKey2 = string.Empty;
            string ActulReporting = string.Empty;

            User_Code = lstUpdateUserDetails[0].User_Code;
            Region_Code = lstUpdateUserDetails[0].Region_Code;
            User_Type_Code = lstUpdateUserDetails[0].User_Type_Code;
            Under_User_Code = lstUpdateUserDetails[0].Under_User_Code;
            Division_Code = lstUpdateUserDetails[0].User_Division_Code;
            ExpenseId = lstUpdateUserDetails[0].Expense_Group_Id;
            Effectivefrom = lstUpdateUserDetails[0].Effectivefrom;
            Effective = lstUpdateUserDetails[0].Effective;
            RefKey1 = lstUpdateUserDetails[0].RefKey1;
            RefKey2 = lstUpdateUserDetails[0].RefKey2;
            ActulReporting = lstUpdateUserDetails[0].ActualReporting;



            UpdateUserDetails(User_Code, Region_Code, User_Type_Code, Under_User_Code, Division_Code, ExpenseId, Effectivefrom, Effective, RefKey1, RefKey2, ActulReporting);
            return User_Code;

        }

        public int UpdateUserDetails(string UserCode, string RegionCode, string UserTypeCode, string UnderUserCode, string UserDivisionCode, int ExpenseId, string Effectivefrom, int Effective, string RefKey1, string RefKey2, string ActulReporting)
        {
            int val = 0;

            val = _objUserCreation.UpdateUserDetails(UserCode, RegionCode, UserTypeCode, UnderUserCode, UserDivisionCode, ExpenseId, Effectivefrom, Effective, RefKey1, RefKey2, ActulReporting);
            return val;
        }

        public string UpdateUser(string UserCode)
        {
            string result = string.Empty;
            DateTime todayDate = DateTime.Today;
            string activityDate = todayDate.ToString("yyyy-MM-dd");
            List<MVCModels.User_LeaveTypeModel> lstsessionleavedetails = new List<MVCModels.User_LeaveTypeModel>();
            List<MVCModels.User_ProductModel> lstsessionproductdetails = new List<MVCModels.User_ProductModel>();


            if (Session["Leave_Details"] != null && Session["Leave_Details"] != "")
            {
                lstsessionleavedetails = (List<MVCModels.User_LeaveTypeModel>)Session["Leave_Details"];
            }
            if (Session["Product_Details"] != null && Session["Product_Details"] != "")
            {
                lstsessionproductdetails = (List<MVCModels.User_ProductModel>)Session["Product_Details"];
            }
            lstsessionleavedetails.ForEach
                (
                x => x.Company_Code = _objcurrentInfo.GetCompanyCode()
                );
            lstsessionleavedetails.ForEach
           (
           y => y.Effective_From = activityDate
           );
            lstsessionproductdetails.ForEach
                  (
                  x => x.Company_Code = _objcurrentInfo.GetCompanyCode()
                  );
            lstsessionleavedetails.ForEach
        (
        y => y.Effective_From = activityDate
        );
            lstsessionproductdetails.ForEach
                (
                y => y.Effective_From = activityDate
                );

            result = _objUserCreation.UpdateUser(lstsessionleavedetails, lstsessionproductdetails, UserCode);
            // }
            return result;
        }
        public JsonResult GetProduct(string UserCode)
        {
            List<MVCModels.Product> lstusers = new List<MVCModels.Product>();

            lstusers = _objUserCreation.GetProduct(UserCode).ToList();
            return Json(_objJson.Serialize(lstusers));
        }
        #endregion Disable User
        public string GetLeaveTypeNamesbyuser(string userTypeCode, string entryMode, string UserCode, string newusertypecode)
        {
            StringBuilder strtbl = new StringBuilder();
            DateTime todayDate = DateTime.Today;
            string effectiveTodate = todayDate.ToString("yyyy-MM-dd");
            try
            {
                List<MVCModels.User_LeaveTypeModel> lstLeaveTypes = new List<MVCModels.User_LeaveTypeModel>();
                //if (entryMode.ToUpper() == "BACK")
                //{
                if (Session["Leave_Details"] != null && Session["Leave_Details"] != "")
                {
                    List<MVCModels.User_LeaveTypeModel> lstsessionLeavedetails = (List<MVCModels.User_LeaveTypeModel>)Session["Leave_Details"];
                    if (lstsessionLeavedetails != null && lstsessionLeavedetails.Count > 0)
                    {
                        int Rowcount = 0;
                        foreach (var LeaveType in lstsessionLeavedetails)
                        {
                            strtbl.Append("<div class='col-md-12 cls_nomargin_nopadding form-group clearfix'>");
                            //Leave Type Name
                            strtbl.Append("<div class='col-xs-3'>");
                            strtbl.Append("<label id='txtLeaveTypeName_" + Rowcount + "' value='" + LeaveType.Leave_Type_Name + "'>" + LeaveType.Leave_Type_Name + "</label>");
                            strtbl.Append("<input type='hidden' id='hdnLeaveTypeCode_" + Rowcount + "' value='" + LeaveType.Leave_Type_Code + "'/>");
                            strtbl.Append("</div>");
                            //Leave Type text Box
                            strtbl.Append("<div class=col-xs-3>");
                            strtbl.Append("<input type='text' class='form-control' id='txtleave_" + Rowcount + "' value='" + LeaveType.Leave_Balance + "'/>");
                            strtbl.Append("<input type='hidden' id='hdnLeavecount' value='" + lstsessionLeavedetails.Count + "' />");
                            strtbl.Append("</div>");
                            strtbl.Append("</div>");
                            Rowcount++;
                        }
                    }
                    else
                    {
                        strtbl.Append("<input type='hidden' id='hdnLeavecount' value='0' />");
                        strtbl.Append("<label>There seems to be no generic combination of Leave Types for a user with this Designation. Please check User Leave Type Master in HiDoctor for further configurations.</label>");
                    }
                }
                // }
                else
                {
                    lstLeaveTypes = _objUserCreation.GetLeaveTypebyUserCode(_objcurrentInfo.GetCompanyCode(), UserCode, userTypeCode, effectiveTodate, newusertypecode).ToList();
                    if (lstLeaveTypes != null && lstLeaveTypes.Count > 0)
                    {
                        int Rowcount = 0;
                        foreach (var LeaveType in lstLeaveTypes)
                        {
                            strtbl.Append("<div class='col-md-12 cls_nomargin_nopadding form-group clearfix'>");
                            //Leave Type Name
                            strtbl.Append("<div class='col-xs-3'>");
                            strtbl.Append("<label id='txtLeaveTypeName_" + Rowcount + "' value='" + LeaveType.Leave_Type_Name + "'>" + LeaveType.Leave_Type_Name + "</label>");
                            strtbl.Append("<input type='hidden' id='hdnLeaveTypeCode_" + Rowcount + "' value='" + LeaveType.Leave_Type_Code + "'/>");
                            strtbl.Append("</div>");
                            //Leave Type text Box
                            strtbl.Append("<div class=col-xs-3>");
                            strtbl.Append("<input type='text' class='form-control' id='txtleave_" + Rowcount + "'/>");
                            strtbl.Append("<input type='hidden' id='hdnLeavecount' value='" + lstLeaveTypes.Count + "' />");
                            strtbl.Append("</div>");
                            strtbl.Append("</div>");
                            Rowcount++;
                        }
                    }
                    else
                    {
                        strtbl.Append("<input type='hidden' id='hdnLeavecount' value='0' />");
                        strtbl.Append("<label>There seems to be no generic combination of Leave Types for a user with this Designation. Please check User Leave Type Master in HiDoctor for further configurations.</label>");
                    }
                }
                return strtbl.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("userTypeCode", userTypeCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return ex.Message.ToString();
            }
        }
        public string GetProductsbyuser(string UserCode, string userTypeCode, string divisionCode, string entryMode, string ProductName)
        {
            StringBuilder strtbl = new StringBuilder();
            try
            {
                List<MVCModels.User_ProductModel> lstProducts = new List<MVCModels.User_ProductModel>();
                if ("undefined" == ProductName)
                {
                    ProductName = "";
                }

                List<MVCModels.User_ProductModel> lstsessionProductdetails = new List<MVCModels.User_ProductModel>();

                if (Session["Product_Details"] != null && Session["Product_Details"] != "")
                {
                    lstsessionProductdetails = (List<MVCModels.User_ProductModel>)Session["Product_Details"];
                }

                lstProducts = _objUserCreation.GetProductsbyDivisionuser(_objcurrentInfo.GetCompanyCode(), UserCode, userTypeCode, divisionCode, ProductName).ToList();

                string min_max_config_value = _objUserCreation.GetMinMaxConfig(_objcurrentInfo.GetCompanyCode());

                if (lstProducts != null && lstProducts.Count > 0)
                {
                    int i = 0;

                    strtbl.Append("<div class='col-md-12 cls_nomargin_nopadding form-group clearfix' >");
                    strtbl.Append("<div class='col-xs-3'>");
                    strtbl.Append("<input type='text' id='txtsearchproduct' class='form-control' placeholder='Search product Name' />");
                    strtbl.Append("</div>");

                    strtbl.Append("<div class='col-xs-3'>");
                    strtbl.Append("<button class='btn btn-primary' id='btnsearchproduct' onclick='return fnSearchProduct()'>Search</button>");
                    strtbl.Append("</div>");
                    strtbl.Append("</div>");
                    strtbl.Append("<table class='table table-responsive' style='width:98% !important;'>");
                    strtbl.Append("<thead style='display: block;'>");
                    strtbl.Append("<tr>");
                    strtbl.Append("<th><input type='checkbox' style='width: 20px !important;' name='chkSelectAll' onclick='fnSelectAll();'/></th>");
                    strtbl.Append("<th style='width:470px;'>Product Name</th>");
                    strtbl.Append("<th style='width:268px;'>Product Type</th>");
                    if (min_max_config_value == "YES")
                    {
                        strtbl.Append("<th style='width:126px;'>Min Count</th>");
                        strtbl.Append("<th style='width:125px;'>Max Count</th>");
                    }
                    strtbl.Append("</tr>");
                    strtbl.Append("</thead>");
                    strtbl.Append("<tbody style='display: block;overflow-y: scroll !important;height: 440px;'>");
                    foreach (var Product in lstProducts)
                    {
                        strtbl.Append("<tr>");
                        //single check                        
                        if (lstsessionProductdetails != null && lstsessionProductdetails.Count > 0)
                        {
                            var lstProductdetails = lstsessionProductdetails.Where(x => x.Product_Code == Product.Product_Code).ToList();
                            if (lstProductdetails != null && lstProductdetails.Count > 0)
                            {
                                strtbl.Append("<td style='padding-left: 12px; width:50px; !important;'><input type='checkbox' name='chkSelect' checked='checked' id='chkSelect_" + i + "' value='" + Product.Product_Code + "|" + Product.Product_Name + "|" + Product.Product_Type + "|" + Product.Product_Type_Name + "'/></td>");
                            }
                            else
                            {
                                strtbl.Append("<td style='padding-left: 12px; width:50px; !important;'><input type='checkbox' name='chkSelect' id='chkSelect_" + i + "' value='" + Product.Product_Code + "|" + Product.Product_Name + "|" + Product.Product_Type + "|" + Product.Product_Type_Name + "'/></td>");
                            }
                        }
                        else
                        {
                            var lstProductdetails = lstProducts.Where(x => x.Product_Code == Product.Product_Code).ToList();
                            if (lstProductdetails.Count > 0)
                            {
                                var lstProductdetailssel = lstProductdetails.Where(x => x.User_Product_Status == "0").ToList();
                                if (lstProductdetailssel.Count > 0)
                                {
                                    strtbl.Append("<td style='padding-left: 12px; width:50px; !important;'><input type='checkbox' name='chkSelect' checked='checked' id='chkSelect_" + i + "' value='" + Product.Product_Code + "|" + Product.Product_Name + "|" + Product.Product_Type + "|" + Product.Product_Type_Name + "'/></td>");
                                }
                                else
                                {
                                    strtbl.Append("<td style='padding-left: 12px; width:50px; !important;'><input type='checkbox' name='chkSelect' id='chkSelect_" + i + "' value='" + Product.Product_Code + "|" + Product.Product_Name + "|" + Product.Product_Type + "|" + Product.Product_Type_Name + "'/></td>");
                                }
                            }
                        }
                        strtbl.Append("<span id='txtProductName_" + i + "' value='" + Product.Product_Name + "'><td style='width:465px;'>" + Product.Product_Name + "</td></span>");
                        strtbl.Append("<input type='hidden' id='hdnProductCode_" + i + "' value='" + Product.Product_Code + "'/>");
                        strtbl.Append("<span id='txtProductTypeName_" + i + "' value='" + Product.Product_Type_Name + "'><td style='width:280px;'> " + Product.Product_Type_Name + " </td></span>");
                        if (min_max_config_value == "YES")
                        {
                            if (lstsessionProductdetails != null && lstsessionProductdetails.Count > 0)
                            {
                                var lstProductdetails = lstsessionProductdetails.Where(x => x.Product_Code == Product.Product_Code).ToList();
                                if (lstProductdetails != null && lstProductdetails.Count > 0)
                                {
                                    strtbl.Append("<td><input type='number' id='txtMinCount_" + i + "' value = '" + lstProductdetails[0].Min_Count + "' style= 'width: 110px; text-align: right;'></td>");
                                    strtbl.Append("<td><input type='number' id='txtMaxCount_" + i + "' value = '" + lstProductdetails[0].Max_Count + "' style= 'width: 110px; text-align: right;'></td>");
                                }
                                else
                                {
                                    strtbl.Append("<td><input type='number' id='txtMinCount_" + i + "' value = '" + Product.Min_Count + "' style= 'width: 110px; text-align: right;'></td>");
                                    strtbl.Append("<td><input type='number' id='txtMaxCount_" + i + "' value = '" + Product.Max_Count + "' style= 'width: 110px; text-align: right;'></td>");
                                }
                            }
                            else
                            {
                                var lstProductdetails = lstProducts.Where(x => x.Product_Code == Product.Product_Code).ToList();
                                if (lstProductdetails.Count > 0)
                                {
                                    var lstProductdetailssel = lstProductdetails.Where(x => x.User_Product_Status == "0").ToList();
                                    if (lstProductdetailssel.Count > 0)
                                    {
                                        strtbl.Append("<td><input type='number' id='txtMinCount_" + i + "' value = '" + Product.Min_Count + "' style= 'width: 110px; text-align: right;'></td>");
                                        strtbl.Append("<td><input type='number' id='txtMaxCount_" + i + "' value = '" + Product.Max_Count + "' style= 'width: 110px; text-align: right;'></td>");
                                    }
                                    else
                                    {
                                        strtbl.Append("<td><input type='number' id='txtMinCount_" + i + "' value = '" + Product.Min_Count + "' style= 'width: 110px; text-align: right;'></td>");
                                        strtbl.Append("<td><input type='number' id='txtMaxCount_" + i + "' value = '" + Product.Max_Count + "' style= 'width: 110px; text-align: right;'></td>");
                                    }
                                }
                            }
                        }
                        strtbl.Append("<input type='hidden' id='hdnProductTypeCode_" + i + "' value='" + Product.Product_Type + "'/>");
                        strtbl.Append("<input type='hidden' id='hdnproductcount' value='" + lstProducts.Count + "'/>");
                        // strtbl.Append("</div>");
                        //  strtbl.Append("</div>");
                        strtbl.Append("</tr>");
                        i++;
                    }
                    strtbl.Append("</tbody>");
                    strtbl.Append("</table>");
                }

                else
                {
                    strtbl.Append("<div class='col-xs-3'>");
                    strtbl.Append("<input type='text' id='txtsearchproduct' class='form-control' placeholder='Search product Name' />");
                    strtbl.Append("</div>");

                    strtbl.Append("<div class='col-xs-3'>");
                    strtbl.Append("<button class='btn btn-primary' id='btnsearchproduct' onclick='return fnSearchProduct()'>Search</button>");
                    strtbl.Append("</div>");
                    strtbl.Append("<input type='hidden' id='hdnproductcount' value='0'/>");
                    strtbl.Append("<label>There is no User Product Mapping details found</label>");
                }
                //strtbl.Append("</div>");
                //return "test";
                return strtbl.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("userTypeCode", userTypeCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return ex.Message.ToString();
            }
        }
        public ActionResult CreateEdetailing()
        {


            ViewBag.Edetailing = _objcurrentInfo.GetEDetailing();

            return View();
        }
        public JsonResult GetPriviligevalue(string Usertypecode)
        {
            List<MVCModels.Privilege> lstuser = new List<MVCModels.Privilege>();
            lstuser = _objUserCreation.GetPriviligevalue(_objcurrentInfo.GetCompanyCode(), Usertypecode).ToList();
            return Json(_objJson.Serialize(lstuser));
        }
        public JsonResult GetMailPriviligevalue(string Usertypecode)
        {
            List<MVCModels.Privilege> lstuser = new List<MVCModels.Privilege>();
            lstuser = _objUserCreation.GetMailPriviligevalue(_objcurrentInfo.GetCompanyCode(), Usertypecode).ToList();
            return Json(_objJson.Serialize(lstuser));
        }

        public JsonResult GetKangleUserDetails(string UserCode)
        {
            KangleUserEmployeeDetails objUserEmpDetails = new KangleUserEmployeeDetails();
            objUserEmpDetails.User = _objUserCreation.GetKangleUserDetails(_objcurrentInfo.GetCompanyCode(), UserCode);
            objUserEmpDetails.Employee = _objUserCreation.GetKangleEmployeeDetails(_objcurrentInfo.GetCompanyCode(), UserCode);
            return Json(_objJson.Serialize(objUserEmpDetails), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetDesignationbyDivision(string divisionCode)
        {
            List<MVCModels.DesignationByDivisionModel> lstdesignationbyDivision = new List<MVCModels.DesignationByDivisionModel>();
            lstdesignationbyDivision = _objUserCreation.GetDesignationbyDivision(_objcurrentInfo.GetCompanyCode(), divisionCode).ToList();
            return Json(_objJson.Serialize(lstdesignationbyDivision));
        }

        public string GetMinMaxConfig()
        {
            string result = string.Empty;
            result = _objUserCreation.GetMinMaxConfig(_objcurrentInfo.GetCompanyCode());
            return result;
        }
        public JsonResult GetCompanyEmail()
        {
            List<MVCModels.Email> lstuser = new List<MVCModels.Email>();
            lstuser = _objUserCreation.GetCompanyEmail().ToList();
            return Json(_objJson.Serialize(lstuser));
        }
        public JsonResult GetParentHierarchyByRegion(string RegionCode)
        {
            List<MVCModels.CCUsers> lstdesignationbyDivision = new List<MVCModels.CCUsers>();
            lstdesignationbyDivision = _objUserCreation.GetParentHierarchyByRegion(RegionCode).ToList();
            return Json(_objJson.Serialize(lstdesignationbyDivision));
        }
        public JsonResult GetMailTemplates()
        {
            List<MVCModels.MailTemplates> lstdesignationbyDivision = new List<MVCModels.MailTemplates>();
            lstdesignationbyDivision = _objUserCreation.GetMailTemplates().ToList();
            return Json(_objJson.Serialize(lstdesignationbyDivision));
        }
        public JsonResult GetAllMailPriviligevalue()
        {
            List<MVCModels.UserPrivilege> lstuser = new List<MVCModels.UserPrivilege>();
            lstuser = _objUserCreation.GetAllMailPriviligevalue(_objcurrentInfo.GetCompanyCode()).ToList();
            return Json(_objJson.Serialize(lstuser));
        }
        public JsonResult GetManagerEmpnumber(string UserCode)
        {
            List<MVCModels.Empdet> lstuser = new List<MVCModels.Empdet>();
            lstuser = _objUserCreation.GetManagerEmpnumber(UserCode).ToList();
            return Json(_objJson.Serialize(lstuser));
        }



        public JsonResult GetActuluser( string divisionCode)
        {
            List<MVCModels.ActualUser> lstusers = new List<MVCModels.ActualUser>();
            DataControl.CurrentInfo _objcurr = new CurrentInfo();
            lstusers = _objUserCreation.GetActuluser(_objcurrentInfo.GetCompanyCode(), divisionCode).ToList();
            return Json(_objJson.Serialize(lstusers));
        }

        //public JsonResult GetActuluser(string CompanyCode)
        //{
        //    List<MVCModels.ActualUser> lstuserdetails = new List<MVCModels.ActualUser>();
        //    lstuserdetails = _objUserCreation.GetActuluser(CompanyCode).ToList();
        //    return Json(_objJson.Serialize(lstuserdetails));

        //}
    }


}
