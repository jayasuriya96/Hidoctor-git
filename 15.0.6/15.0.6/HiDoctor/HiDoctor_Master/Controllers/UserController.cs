using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataControl;
using System.Text;
using MVCModels.HiDoctor_Master;
using Newtonsoft.Json;
using HiDoctor_Master.Models;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class UserController : Controller
    {
        const int PAGESIZE = 10;
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        private CurrentInfo objCurInfo;

        //
        // GET: /User/

        public ActionResult Index()
        {
            ViewBag.User_Code = _objcurrentInfo.GetUserCode();
            return View();
        }

        public ActionResult Employee(string id)
        {
            ViewBag.FromUserMaster = id;
            ViewBag.Company_Code = _objcurrentInfo.GetCompanyCode();
            ViewBag.Logged_User_Code = _objcurrentInfo.GetUserCode();
            return View();
        }

        public string InsertEmployee(MVCModels.HiDoctor_Master.Employeemasterpopup EmployeedetObj)
        {
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            DataControl.BLUser _objblUser = new DataControl.BLUser();

            return _objblUser.InsertEmployee(_objCurrentInfo.GetCompanyCode(), _objCurrentInfo.GetRegionCode(), EmployeedetObj.EmployeeName, EmployeedetObj.employeeNumber, EmployeedetObj.gender, EmployeedetObj.dateOfBirth, EmployeedetObj.Department_Id,
                EmployeedetObj.EDNProof, EmployeedetObj.salaryProof, EmployeedetObj.resumeGiven, EmployeedetObj.resignationSubmitted, EmployeedetObj.appointed, EmployeedetObj.dateofJoining, EmployeedetObj.ProDateofConfirm, EmployeedetObj.confirmationDate, EmployeedetObj.PFNumber, EmployeedetObj.PANNumber,
                EmployeedetObj.SCBAccountNumber, EmployeedetObj.ICICIAccountNumber, EmployeedetObj.address1, EmployeedetObj.address2, EmployeedetObj.address3, EmployeedetObj.State_ID, EmployeedetObj.City_ID, EmployeedetObj.Pincode_Id, EmployeedetObj.mobile, EmployeedetObj.phone, EmployeedetObj.emailId,
                EmployeedetObj.employeeEntityType, EmployeedetObj.employeeCode, EmployeedetObj.mode, _objCurrentInfo.GetUserCode(), EmployeedetObj.aadhaar_No, EmployeedetObj.Ref_Key1, EmployeedetObj.Ref_Key2, EmployeedetObj.Blood_Group, EmployeedetObj.Employee_Photo);
        }


        public ActionResult User(string id)
        {
            if (id == null)
            {
                id = "NEW_USER";
            }
            ViewBag.EntryMode = id.Split('_')[1];
            ViewBag.EntryValue = id.Split('_')[0];
            return View();
        }

        public JsonResult GetMasterDetailsForUser()
        {
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            string companyCode = _objCurrentInfo.GetCompanyCode();
            string usercode = _objCurrentInfo.GetUserCode();

            DataControl.BLRegion _objBlRegion = new DataControl.BLRegion();
            DataControl.BLUser _objBlUser = new DataControl.BLUser();
            List<MVCModels.HiDoctor_Master.DivisionModel> lstDivision = new List<MVCModels.HiDoctor_Master.DivisionModel>();
            lstDivision = _objBlUser.GetDivisions(companyCode);
            List<MVCModels.HiDoctor_Master.EmployeeModel> lstEmployee = new List<MVCModels.HiDoctor_Master.EmployeeModel>();
            lstEmployee = _objBlUser.GetUnassignedEmployees(companyCode);
            List<MVCModels.HiDoctor_Master.ExpenseModel> lstExpense = new List<MVCModels.HiDoctor_Master.ExpenseModel>();
            lstExpense = _objBlUser.GetExpenseGroup(companyCode);
            List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
            lstUser = _objBlUser.GetChildUsers(companyCode, usercode);
            List<MVCModels.HiDoctor_Master.RegionModel> lstRegion = new List<MVCModels.HiDoctor_Master.RegionModel>();
            lstRegion = _objBlRegion.GetChildRegions(companyCode);
            List<MVCModels.HiDoctor_Master.UserTypeModel> lstUserType = new List<MVCModels.HiDoctor_Master.UserTypeModel>();
            lstUserType = _objBlUser.GetUserTypes(companyCode);
            List<MVCModels.HiDoctor_Master.UserModel> lstUserAllUsers = new List<MVCModels.HiDoctor_Master.UserModel>();
            lstUserAllUsers = _objBlUser.GetAllStatusUsers(companyCode);


            List<JsonResult> lstJSON = new List<JsonResult> { Json(lstDivision, JsonRequestBehavior.AllowGet), Json(lstEmployee, JsonRequestBehavior.AllowGet),
                Json(lstExpense,JsonRequestBehavior.AllowGet), Json(lstUser,JsonRequestBehavior.AllowGet), Json(lstRegion,JsonRequestBehavior.AllowGet),
                Json(lstUserType,JsonRequestBehavior.AllowGet),Json(lstUserAllUsers,JsonRequestBehavior.AllowGet)};
            return new LargeJsonResult() { Data = lstJSON, MaxJsonLength = int.MaxValue };
        }

        public string InsertUserMaster(string UserCode, string EmployeeCode, string UserTypeCode, string UnderUserCode,
                                 string UserName, string UserPass, string UserStatus, string RegionCode, string UserDivisionCode,
                                 string ExpenseGroupId, string HiDOCTORStartDate, string mode)
        {
            DataControl.BLUser _objBlUser = new DataControl.BLUser();
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            if ("INSERT" == mode.ToUpper())
            {
                return _objBlUser.InsertUserMaster(_objCurrentInfo.GetCompanyCode(), UserCode, EmployeeCode, UserTypeCode, UnderUserCode,
                                     UserName, UserPass, UserStatus, RegionCode,
                                    ExpenseGroupId, HiDOCTORStartDate, _objCurrentInfo.GetUserCode());
            }
            else
            {
                return _objBlUser.UpdateUserMaster(_objCurrentInfo.GetCompanyCode(), UserCode, EmployeeCode, UserTypeCode, UnderUserCode,
                                    UserName, UserPass, UserStatus, RegionCode,
                                   ExpenseGroupId, HiDOCTORStartDate, _objCurrentInfo.GetUserCode());
            }
        }

        public ActionResult DisableUser(string id)
        {
            ViewBag.Mode = id.Split('|')[0];
            ViewBag.Value = id.Split('|')[1];
            return View();
        }
        public ActionResult UserBulkAdd()
        {
            return View();
        }
        public string UserBulkInsert(string tblContent)
        {
            string result = "";
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            DataControl.BLUser _objBlUser = new DataControl.BLUser();
            result = _objBlUser.BulkUserInsert(_objCurrentInfo.GetCompanyCode(), Guid.NewGuid(), tblContent, _objCurrentInfo.GetUserCode());
            return result;
        }

        // User bulk Add-Expense Group Mandatory for Privilege Set
        public string GetExpenseGroupMand(string User_Type_Code)
        {
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            DataControl.BLUser _objBlUser = new DataControl.BLUser();
            string Company_Code = _objCurrentInfo.GetCompanyCode();
            string User_Code = _objCurrentInfo.GetUserCode();
            string Region_Code = _objCurrentInfo.GetRegionCode();
            JSONConverter objJson = new JSONConverter();
            return objJson.Serialize(_objBlUser.GetExpenseGroupMand(Company_Code, User_Code, Region_Code, User_Type_Code));
        }

        public ActionResult UserExcelBulkAdd()
        {
            return View();
        }
        [HttpPost]
        public ActionResult UserExcelUploadResult(HttpPostedFileBase file)
        {
            string result = "";
            DataControl.BLUser _objBlUser = new DataControl.BLUser();
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            result = _objBlUser.InsertUserExcelBulkUpload(_objCurInfo.GetCompanyCode(), Guid.NewGuid().ToString(), file, _objCurInfo.GetUserCode(), _objCurInfo.GetSubDomain());
            ViewBag.ErrorCode = result;
            return View("UserExcelUploadResult");
        }

        public void DownloadUserExcelTemplate()
        {
            System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
            DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();
            DataControl.Abstraction.IFileProvider objProvider = new DataControl.Impl.FileSystemProvider();
            string error = string.Empty;

            string fileName = "HD_UserMaster.xls";
            string blobURL = objProvider.GetConfigValue("EXCELTEMPLATES") + fileName;

            objFileDownload.DownloadFile(blobURL, fileName, out error);

            //return new DownloadResult { VirtualPath = "~/Content/XLTemplates/UserMaster.xls", FileDownloadName = "UserMaster.xls" };
            //return new DownloadResult { VirtualPath = "~/Content/XLTemplates/" + File_Name.ToUpper() + "_MASTER.csv", FileDownloadName = File_Name.ToUpper() + "_MASTER.csv" };
        }

        public ActionResult UserHierarchyChange(string id)
        {
            ViewBag.OriginalUser = id;
            return View();
        }

        public JsonResult GetAllUsers()
        {
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            string companyCode = _objCurrentInfo.GetCompanyCode();
            DataControl.BLUser _objBlUser = new DataControl.BLUser();
            List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
            lstUser = _objBlUser.GetUsers(companyCode);
            return Json(lstUser, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetChildUsers(string userCode)
        {
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            string companyCode = _objCurrentInfo.GetCompanyCode();
            DataControl.BLUser _objBlUser = new DataControl.BLUser();
            List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
            lstUser = _objBlUser.GetChildUsers(companyCode, userCode);
            return Json(lstUser, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetChildUsersByRegion(string regionCode)
        {
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            string companyCode = _objCurrentInfo.GetCompanyCode();
            DataControl.BLUser _objBlUser = new DataControl.BLUser();
            List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
            lstUser = _objBlUser.GetChildUsersByRegion(companyCode, regionCode);
            return Json(lstUser, JsonRequestBehavior.AllowGet);
        }
        public string UpdateUserNewIndex()
        {
            string result = "";
            string guid = Guid.NewGuid().ToString();
            try
            {
                DataSet ds = new DataSet();
                DataControl.BLUser _objBlUser = new DataControl.BLUser();
                DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
                ds = _objBlUser.GetAllUsersForMigration(_objCurInfo.GetCompanyCode());
                DataSet dsAllUsers = new DataSet();
                DataRow[] dr;
                dr = ds.Tables[0].AsEnumerable().Where(c => c["Under_User_Id"].ToString() == "0").ToArray();
                if (dr.Length > 0)
                {
                    string userCode = dr[0]["User_Code"].ToString();
                    string userId = dr[0]["User_Id"].ToString();
                    dsAllUsers = _objBlUser.GetUserHierarchyDataset(_objCurInfo.GetCompanyCode(), userCode, _objCurInfo.GetUserCode(), guid);
                    if (dsAllUsers.Tables[0].Rows.Count > 0)
                    {
                        //Display Order Update
                        for (int d = 0; d < dsAllUsers.Tables[0].Rows.Count; d++)
                        {
                            dsAllUsers.Tables[0].Rows[d]["Display_Order"] = d + 1;
                            dsAllUsers.AcceptChanges();
                        }
                        //Root user seq and full index update
                        DataRow[] drRoot;
                        drRoot = dsAllUsers.Tables[0].AsEnumerable().Where(c => c["Under_User_Id"].ToString() == "0").ToArray();
                        drRoot[0]["Full_index"] = userId + ".";
                        drRoot[0]["Seq_index"] = "1";
                        drRoot[0]["Company_Code"] = _objCurInfo.GetCompanyCode();
                        // Root child nodes seq and full index updation
                        DataRow[] drChild;
                        drChild = dsAllUsers.Tables[0].AsEnumerable().Where(d => d["Under_User_Code"].ToString() == userCode).ToArray();
                        if (drChild.Length > 0)
                        {
                            int c = 0;
                            foreach (DataRow drr in drChild)
                            {
                                c++;
                                drr["Seq_index"] = c.ToString();
                                drr["Company_Code"] = _objCurInfo.GetCompanyCode();
                                dsAllUsers.AcceptChanges();
                            }
                        }
                        dsAllUsers.AcceptChanges();
                        int displayOrder = 0;
                        for (int i = 0; i < dsAllUsers.Tables[0].Rows.Count; i++)
                        {
                            displayOrder++;
                            string curUserCode = dsAllUsers.Tables[0].Rows[i]["User_Code"].ToString();
                            string curParUserCode = dsAllUsers.Tables[0].Rows[i]["Under_User_Code"].ToString();
                            if (curUserCode != curParUserCode)
                            {
                                string curUserId = dsAllUsers.Tables[0].Rows[i]["User_Id"].ToString();
                                string parIndex = "";
                                DataRow[] drTemp;
                                drTemp = dsAllUsers.Tables[0].AsEnumerable().Where(c => c["User_Code"].ToString() == curParUserCode).ToArray();
                                if (drTemp.Length > 0)
                                {
                                    parIndex = drTemp[0]["Full_index"].ToString();
                                    dsAllUsers.Tables[0].Rows[i]["Full_index"] = parIndex + curUserId + ".";
                                    dsAllUsers.Tables[0].Rows[i]["Company_Code"] = _objCurInfo.GetCompanyCode();
                                    dsAllUsers.Tables[0].Rows[i]["Under_User_Id"] = drTemp[0]["User_Id"].ToString();
                                }

                                drChild = dsAllUsers.Tables[0].AsEnumerable().Where(d => d["Under_User_Code"].ToString() == curUserCode).ToArray();
                                if (drChild.Length > 0)
                                {
                                    int c = 0;
                                    foreach (DataRow drr in drChild)
                                    {
                                        c++;
                                        drr["Seq_index"] = c.ToString();
                                        drr["Company_Code"] = _objCurInfo.GetCompanyCode();
                                        dsAllUsers.AcceptChanges();
                                    }
                                }
                            }
                        }
                        //Update Qry
                        result = _objBlUser.BulkUserTempInsert(_objCurInfo.GetCompanyCode(), dsAllUsers.Tables[0], "MIGRATION");
                        if (result.Split(':')[0].ToUpper() == "SUCCESS")
                        {
                            result = _objBlUser.UpdateUserIndexFromTemptoUserMaster(_objCurInfo.GetCompanyCode(), "MIGRATION", guid, _objCurInfo.GetUserCode());
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                result = "FAILURE:" + ex.Message;
            }
            return result;
        }

        public string UpdateUserFullIndex()
        {
            string result = "";
            string guid = Guid.NewGuid().ToString();
            try
            {
                DataSet ds = new DataSet();
                DataControl.BLUser _objBlUser = new DataControl.BLUser();
                DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
                ds = _objBlUser.GetAllUsersForMigration(_objCurInfo.GetCompanyCode());
                DataSet dsAllUsers = new DataSet();
                DataRow[] dr;
                DataRow[] drChild;
                dr = ds.Tables[0].AsEnumerable().Where(c => c["Under_User_Id"].ToString() == "0").ToArray();
                if (dr.Length > 0)
                {
                    string userCode = dr[0]["User_Code"].ToString();
                    string userId = dr[0]["User_Id"].ToString();
                    dsAllUsers = _objBlUser.GetUserHierarchyDataset(_objCurInfo.GetCompanyCode(), userCode, _objCurInfo.GetUserCode(), guid);
                    if (dsAllUsers.Tables[0].Rows.Count > 0)
                    {
                        DataRow[] drRoot;
                        drRoot = dsAllUsers.Tables[0].AsEnumerable().Where(c => c["Under_User_Id"].ToString() == "0").ToArray();
                        drRoot[0]["Full_index"] = userId + ".";
                        drRoot[0]["Company_Code"] = _objCurInfo.GetCompanyCode();
                        dsAllUsers.AcceptChanges();

                        for (int i = 0; i < dsAllUsers.Tables[0].Rows.Count; i++)
                        {
                            string curUserCode = dsAllUsers.Tables[0].Rows[i]["User_Code"].ToString();
                            string curParUserCode = dsAllUsers.Tables[0].Rows[i]["Under_User_Code"].ToString();
                            if (curUserCode != curParUserCode)
                            {
                                string curUserId = dsAllUsers.Tables[0].Rows[i]["User_Id"].ToString();
                                string parIndex = "";
                                DataRow[] drTemp;
                                drTemp = dsAllUsers.Tables[0].AsEnumerable().Where(c => c["User_Code"].ToString() == curParUserCode).ToArray();
                                if (drTemp.Length > 0)
                                {
                                    parIndex = drTemp[0]["Full_index"].ToString();
                                    dsAllUsers.Tables[0].Rows[i]["Full_index"] = parIndex + curUserId + ".";
                                    dsAllUsers.Tables[0].Rows[i]["Company_Code"] = _objCurInfo.GetCompanyCode();
                                }
                            }
                        }
                        //Update Qry
                        result = _objBlUser.BulkUserTempInsert(_objCurInfo.GetCompanyCode(), dsAllUsers.Tables[0], "REFRESH");
                        if (result.Split(':')[0].ToUpper() == "SUCCESS")
                        {
                            result = _objBlUser.UpdateUserIndexFromTemptoUserMaster(_objCurInfo.GetCompanyCode(), "REFRESH", guid, _objCurInfo.GetUserCode());
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                result = "FAILURE:" + ex.Message;
            }
            return result;
        }
        public ActionResult UserRegionMigration()
        {
            return View();
        }


        // Newly created Tree with Employee Name/////////

        public string UpdateUserFullIndexNew()
        {
            string result = "";
            string guid = Guid.NewGuid().ToString();
            try
            {
                DataSet ds = new DataSet();
                DataControl.BLUser _objBlUser = new DataControl.BLUser();
                DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
                ds = _objBlUser.GetAllUsersForMigrationNew(_objCurInfo.GetCompanyCode());
                DataSet dsAllUsers = new DataSet();
                DataRow[] dr;
                DataRow[] drChild;
                dr = ds.Tables[0].AsEnumerable().Where(c => c["Under_User_Id"].ToString() == "0").ToArray();
                if (dr.Length > 0)
                {
                    string userCode = dr[0]["User_Code"].ToString();
                    string userId = dr[0]["User_Id"].ToString();
                    dsAllUsers = _objBlUser.GetUserHierarchyDataset(_objCurInfo.GetCompanyCode(), userCode, _objCurInfo.GetUserCode(), guid);
                    if (dsAllUsers.Tables[0].Rows.Count > 0)
                    {
                        DataRow[] drRoot;
                        drRoot = dsAllUsers.Tables[0].AsEnumerable().Where(c => c["Under_User_Id"].ToString() == "0").ToArray();
                        drRoot[0]["Full_index"] = userId + ".";
                        drRoot[0]["Company_Code"] = _objCurInfo.GetCompanyCode();
                        dsAllUsers.AcceptChanges();

                        for (int i = 0; i < dsAllUsers.Tables[0].Rows.Count; i++)
                        {
                            string curUserCode = dsAllUsers.Tables[0].Rows[i]["User_Code"].ToString();
                            string curParUserCode = dsAllUsers.Tables[0].Rows[i]["Under_User_Code"].ToString();
                            if (curUserCode != curParUserCode)
                            {
                                string curUserId = dsAllUsers.Tables[0].Rows[i]["User_Id"].ToString();
                                string parIndex = "";
                                DataRow[] drTemp;
                                drTemp = dsAllUsers.Tables[0].AsEnumerable().Where(c => c["User_Code"].ToString() == curParUserCode).ToArray();
                                if (drTemp.Length > 0)
                                {
                                    parIndex = drTemp[0]["Full_index"].ToString();
                                    dsAllUsers.Tables[0].Rows[i]["Full_index"] = parIndex + curUserId + ".";
                                    dsAllUsers.Tables[0].Rows[i]["Company_Code"] = _objCurInfo.GetCompanyCode();
                                }
                            }
                        }
                        //Update Qry
                        result = _objBlUser.BulkUserTempInsert(_objCurInfo.GetCompanyCode(), dsAllUsers.Tables[0], "REFRESH");
                        if (result.Split(':')[0].ToUpper() == "SUCCESS")
                        {
                            result = _objBlUser.UpdateUserIndexFromTemptoUserMaster(_objCurInfo.GetCompanyCode(), "REFRESH", guid, _objCurInfo.GetUserCode());
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                result = "FAILURE:" + ex.Message;
            }
            return result;
        }


        //public string UpdateUserStatus(string userCode)
        //{
        //    DataControl.BLUser _objBlUser = new DataControl.BLUser();
        //    DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
        //    string result = String.Empty;
        //    string[] arUsers = userCode.Split('^');
        //    for (int i = 0; i < arUsers.Length; i++)
        //    {
        //        result = _objBlUser.UpdateUserStatus(_objCurInfo.GetCompanyCode(), arUsers[i]);
        //    }
        //    return result;
        //}

        public string ChangeUserHierarchy(string originalChildUsers, string proposedChildUsers, string originalParentIndex, string proposedParentIndex,
            string originalParentId, string proposedParentId, string originalParentUserCode, string proposedParentUserCode)
        {
            string result = "";
            DataControl.BLUser _objBlUser = new DataControl.BLUser();
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            result = _objBlUser.ChangeUserHierarchy(_objCurInfo.GetCompanyCode(), originalChildUsers, proposedChildUsers, originalParentIndex, proposedParentIndex,
                        originalParentId, proposedParentId, Guid.NewGuid().ToString(), _objCurInfo.GetUserCode(), originalParentUserCode, proposedParentUserCode);
            return result;
        }
        public ActionResult EmployeeBulkAdd()
        {
            return View();
        }
        public ActionResult EmployeeExcelBulkAddResult(HttpPostedFileBase file)
        {
            string result = "";
            DataControl.BLUser _objBlUser = new DataControl.BLUser();
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            string subDomain = _objCurInfo.GetSubDomain();
            result = _objBlUser.InsertEmployeeExcelBulkUpload(subDomain, _objCurInfo.GetCompanyCode(), _objCurInfo.GetRegionCode(), Guid.NewGuid().ToString(), file, _objCurInfo.GetUserCode());
            ViewBag.ErrorCode = result;
            return View("EmployeeExcelBulkAddResult");
        }
        public void DownloadEmployeeExcelTemplate()
        {
            try
            {
                System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
                DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();
                DataControl.Abstraction.IFileProvider objProvider = new DataControl.Impl.FileSystemProvider();
                string error = string.Empty;

                string fileName = "EmployeeMaster.xlsx";
                string blobURL = objProvider.GetConfigValue("EXCELTEMPLATES") + fileName;

                objFileDownload.DownloadFile(blobURL, fileName, out error);

                // return new DownloadResult { VirtualPath = "~/Content/XLTemplates/EmployeeMaster.xls", FileDownloadName = "EmployeeMaster.xls" };
                //return new DownloadResult { VirtualPath = "~/Content/XLTemplates/" + File_Name.ToUpper() + "_MASTER.csv", FileDownloadName = File_Name.ToUpper() + "_MASTER.csv" };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Get selected user details
        /// </summary> 
        public JsonResult GetSelectedUserDetails(string userCode)
        {
            List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
            DataControl.BLUser _objBlUser = new DataControl.BLUser();
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            lstUser = _objBlUser.GetUserDetails(_objCurInfo.GetCompanyCode(), userCode);
            return Json(lstUser, JsonRequestBehavior.AllowGet);
        }


        public ActionResult UserBulkDisable()
        {
            return View();
        }

        public string BulkUserDisable(string userCodes, string resignationDate)
        {
            string result = "";
            DataControl.BLUser _objBlUser = new DataControl.BLUser();
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            string[] userCode = userCodes.Split('~');
            for (int i = 0; i < userCode.Length - 1; i++)
            {
                result = _objBlUser.UpdateUserStatus(_objCurInfo.GetCompanyCode(), userCode[i].ToString().Split('|')[0],
                    _objCurInfo.GetUserName(), userCode[i].ToString().Split('|')[1]);
            }
            return result;
        }

        //public string GetDCRdate(string UserCode)
        //{
        //    DataControl.BLUser _objBlUser = new DataControl.BLUser();
        //    string Reported = "";
        //    Reported = _objBlUser.GetDCRdate(UserCode).ToString() ;
        //    return Reported;
        //}

        public JsonResult GetDCRdate(string UserCode)
        {
            DataControl.BLUser _objBlUser = new DataControl.BLUser();
            DataControl.JSONConverter _objJson = new DataControl.JSONConverter();
            List<MVCModels.DCRDATE> lstReported = new List<MVCModels.DCRDATE>();
            lstReported = _objBlUser.GetDCRdate(UserCode).ToList();
            return Json(_objJson.Serialize(lstReported));
        }
        public JsonResult GetImmediateChildUsers(string userCode)
        {
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            string companyCode = _objCurrentInfo.GetCompanyCode();
            DataControl.BLUser _objBlUser = new DataControl.BLUser();
            List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
            lstUser = _objBlUser.GetImmediateChildUsers(companyCode, userCode);
            return Json(lstUser, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAllEmployees()
        {
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            string companyCode = _objCurrentInfo.GetCompanyCode();
            DataControl.BLRegion _objBlRegion = new DataControl.BLRegion();
            DataControl.BLUser _objBlUser = new DataControl.BLUser();
            List<MVCModels.HiDoctor_Master.EmployeeModel> lstAllEmployee = new List<MVCModels.HiDoctor_Master.EmployeeModel>();
            lstAllEmployee = _objBlUser.GetEmployees(companyCode);
            return new LargeJsonResult() { Data = lstAllEmployee, MaxJsonLength = int.MaxValue };
        }

        public string VacancyMigration()
        {
            string result = "";
            DataControl.BLUser _objBLUser = new BLUser();
            DataControl.CurrentInfo _objCurInfo = new CurrentInfo();
            result = _objBLUser.VacancyHeaderMigration(_objCurInfo.GetCompanyCode(), _objCurInfo.GetUserCode());
            return result;
        }

        public JsonResult GetChildUsersOrderByUserName(string userCode)
        {
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            string companyCode = _objCurrentInfo.GetCompanyCode();
            DataControl.BLUser _objBlUser = new DataControl.BLUser();
            List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
            lstUser = _objBlUser.GetChildUsersOrderByUserName(companyCode, userCode);
            return Json(lstUser, JsonRequestBehavior.AllowGet);
        }

        public LargeJsonResult GetAllEmployeeDetails(int pageNumber, bool excelDownload, string empName)
        {
            List<JsonResult> lstLargeJson = new List<JsonResult>();
            StringBuilder strTblContent = new StringBuilder();
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            string companyCode = _objCurrentInfo.GetCompanyCode();
            //string RegionCode = _objCurrentInfo.GetRegionCode();
            string userCode = _objCurrentInfo.GetUserCode();
            DataControl.BLUser _objBlUser = new DataControl.BLUser();
            IEnumerable<MVCModels.HiDoctor_Master.EmployeeModel> lstAllEmployee = null;
            List<MVCModels.HiDoctor_Master.EmployeeModel> lstAllEmployeeMain = new List<MVCModels.HiDoctor_Master.EmployeeModel>();
            int totalPageCount = 0;
            StringBuilder sbExeclExport = new StringBuilder();
            //lstAllEmployee = _objBlUser.GetAllEmployeeDetails(companyCode, RegionCode, pageNumber, PAGESIZE, excelDownload, empName, ref totalPageCount);
            lstAllEmployee = _objBlUser.GetAllEmployeeDetails(companyCode, userCode);
            lstAllEmployeeMain = lstAllEmployee.ToList();
            return new LargeJsonResult
            {
                MaxJsonLength = Int32.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                Data = new
                {
                    total = lstAllEmployeeMain.Count,
                    Data = lstAllEmployeeMain
                }
            };
        }

        public LargeJsonResult GetAllEmployeeInactiveDetails(int pageNumber, bool excelDownload, string empName)
        {
            List<JsonResult> lstLargeJson = new List<JsonResult>();
            StringBuilder strTblContent = new StringBuilder();
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            string companyCode = _objCurrentInfo.GetCompanyCode();
            //string RegionCode = _objCurrentInfo.GetRegionCode();
            string userCode = _objCurrentInfo.GetUserCode();
            DataControl.BLUser _objBlUser = new DataControl.BLUser();
            IEnumerable<MVCModels.HiDoctor_Master.EmployeeModel> lstAllEmployeedetails = null;
            List<MVCModels.HiDoctor_Master.EmployeeModel> lstAllEmployee = new List<MVCModels.HiDoctor_Master.EmployeeModel>();
            int totalPageCount = 0;
            StringBuilder sbExeclExport = new StringBuilder();
            lstAllEmployeedetails = _objBlUser.GetAllEmployeeInactiveDetails(companyCode, userCode);
            lstAllEmployee = lstAllEmployeedetails.ToList();
            return new LargeJsonResult
            {
                MaxJsonLength = Int32.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                Data = new
                {
                    total = lstAllEmployee.Count,
                    Data = lstAllEmployee
                }
            };
        }



        public StringBuilder GetEmployeeExcelExportString(string companyCode, int pageNumber, string empName)
        {

            int totalPageCount = 0;
            IEnumerable<MVCModels.HiDoctor_Master.EmployeeModel> lstAllEmployee = null;
            DataControl.BLUser _objBlUser = new DataControl.BLUser();
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            //string RegionCode = _objCurrentInfo.GetRegionCode();
            string userCode = _objCurrentInfo.GetUserCode();
            bool excelDownload = true;
            lstAllEmployee = _objBlUser.GetAllEmployeeDetails(companyCode, userCode);
            StringBuilder strTblContent = new StringBuilder();
            strTblContent.Append("<table class='table table-striped' ><thead><tr><th>Employee Name</th><th>DOB</th>");
            strTblContent.Append("<th>Gender</th><th>Address</th><th>Phone</th><th>Mobile</th><th>Email</th><th>DOJ</th><th>Employee Number</th>");
            strTblContent.Append("<th>EDN Proof</th><th>Salary Proof</th><th>Resume Given</th><th>Resignation Submitted</th><th>Appointed</th>");
            strTblContent.Append("<th>Bank A/C No 1</th><th>Bank A/C No 2</th><th>PF Number</th><th>PAN Number</th><th>Employee Type</th><th>Conf Date</th>");
            strTblContent.Append("<th>Status</th></tr></thead><tbody>");
            if (lstAllEmployee != null)
            {
                foreach (var emp in lstAllEmployee)
                {
                    strTblContent.Append("<tr>");
                    strTblContent.Append("<td>" + emp.Employee_Name + "</td>");
                    if (emp.Date_Of_Birth == "01/01/1900")
                    {
                        strTblContent.Append("<td></td>");
                    }
                    else
                    {
                        strTblContent.Append("<td>" + emp.Date_Of_Birth + "</td>");
                    }
                    strTblContent.Append("<td>" + emp.Gender + "</td>");
                    strTblContent.Append("<td>" + emp.Address + "</td>");
                    strTblContent.Append("<td>" + emp.Phone + "</td>");
                    strTblContent.Append("<td>" + emp.Mobile + "</td>");
                    strTblContent.Append("<td>" + emp.Email_Id + "</td>");
                    if (emp.Date_of_Joining == "01/01/1900")
                    {
                        strTblContent.Append("<td></td>");
                    }
                    else
                    {
                        strTblContent.Append("<td>" + emp.Date_of_Joining + "</td>");
                    }
                    strTblContent.Append("<td>" + emp.Employee_Number + "</td>");
                    strTblContent.Append("<td>" + ((emp.EDN_Proof == "0") ? "NO" : "YES") + "</td>");
                    strTblContent.Append("<td>" + ((emp.Salary_Proof == "0") ? "NO" : "YES") + "</td>");
                    strTblContent.Append("<td>" + ((emp.Resume_Given == "0") ? "NO" : "YES") + "</td>");
                    strTblContent.Append("<td>" + ((emp.Resignation_Submitted == "0") ? "NO" : "YES") + "</td>");
                    strTblContent.Append("<td>" + ((emp.Appointed == "0") ? "NO" : "YES") + "</td>");
                    strTblContent.Append("<td>" + emp.SCB_Account_Number + "</td>");
                    strTblContent.Append("<td>" + emp.ICICI_Account_Number + "</td>");
                    strTblContent.Append("<td>" + emp.PF_Number + "</td>");
                    strTblContent.Append("<td>" + emp.PAN_Number + "</td>");
                    strTblContent.Append("<td>" + emp.Employee_Entity_Type + "</td>");
                    if (emp.Confirmation_Date == "01/01/1900")
                    {
                        strTblContent.Append("<td></td>");
                    }
                    else
                    {
                        strTblContent.Append("<td>" + emp.Confirmation_Date + "</td>");
                    }
                    if (emp.Employee_Status == "1")
                    {
                        strTblContent.Append("<td>Disabled</td>");
                    }
                    else
                    {
                        strTblContent.Append("<td>Enabled</td>");
                    }
                    strTblContent.Append("</tr>");
                }
            }

            return strTblContent;
        }

        public StringBuilder GetAllEmployeeInactiveExcelExportString(string companyCode, int pageNumber, string empName)
        {

            int totalPageCount = 0;
            IEnumerable<MVCModels.HiDoctor_Master.EmployeeModel> lstAllEmployee = null;
            DataControl.BLUser _objBlUser = new DataControl.BLUser();
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            //string RegionCode = _objCurrentInfo.GetRegionCode();
            string userCode = _objCurrentInfo.GetUserCode();
            bool excelDownload = true;
            lstAllEmployee = _objBlUser.GetAllEmployeeInactiveDetails(companyCode, userCode);
            StringBuilder strTblContent = new StringBuilder();
            strTblContent.Append("<table class='table table-striped' id='tblEditEmp'><thead><tr><th>Employee Name</th><th>DOB</th>");
            strTblContent.Append("<th>Gender</th><th>Address</th><th>Phone</th><th>Mobile</th><th>Email</th><th>DOJ</th><th>Hidoctor Start Date</th><th>Disabled Date</th><th>Resignation Date</th>");
            strTblContent.Append("<th>Employee Number</th><th>EDN Proof</th><th>Salary Proof</th><th>Resume Given</th><th>Resignation Submitted</th><th>Appointed</th>");
            strTblContent.Append("<th>Bank A/C No 1</th><th>Bank A/C No 2</th><th>PF Number</th><th>PAN Number</th><th>Employee Type</th><th>Conf Date</th>");
            strTblContent.Append("<th>Status</th></tr></thead><tbody>");
            if (lstAllEmployee != null)
            {
                foreach (var emp in lstAllEmployee)
                {
                    strTblContent.Append("<tr>");
                    strTblContent.Append("<td>" + emp.Employee_Name + "</td>");
                    if (emp.Date_Of_Birth == "01/01/1900")
                    {
                        strTblContent.Append("<td></td>");
                    }
                    else
                    {
                        strTblContent.Append("<td>" + emp.Date_Of_Birth + "</td>");
                    }
                    strTblContent.Append("<td>" + emp.Gender + "</td>");
                    strTblContent.Append("<td>" + emp.Address + "</td>");
                    strTblContent.Append("<td>" + emp.Phone + "</td>");
                    strTblContent.Append("<td>" + emp.Mobile + "</td>");
                    strTblContent.Append("<td>" + emp.Email_Id + "</td>");
                    if (emp.Date_of_Joining == "01/01/1900")
                    {
                        strTblContent.Append("<td></td>");
                    }
                    else
                    {
                        strTblContent.Append("<td>" + emp.Date_of_Joining + "</td>");
                    }
                    strTblContent.Append("<td>" + emp.HiDOCTOR_Start_Date + "</td>");
                    strTblContent.Append("<td>" + emp.Updated_DateTime + "</td>");
                    strTblContent.Append("<td>" + emp.Resignation_Date + "</td>");
                    strTblContent.Append("<td>" + emp.Employee_Number + "</td>");
                    strTblContent.Append("<td>" + ((emp.EDN_Proof == "0") ? "NO" : "YES") + "</td>");
                    strTblContent.Append("<td>" + ((emp.Salary_Proof == "0") ? "NO" : "YES") + "</td>");
                    strTblContent.Append("<td>" + ((emp.Resume_Given == "0") ? "NO" : "YES") + "</td>");
                    strTblContent.Append("<td>" + ((emp.Resignation_Submitted == "0") ? "NO" : "YES") + "</td>");
                    strTblContent.Append("<td>" + ((emp.Appointed == "0") ? "NO" : "YES") + "</td>");
                    strTblContent.Append("<td>" + emp.SCB_Account_Number + "</td>");
                    strTblContent.Append("<td>" + emp.ICICI_Account_Number + "</td>");
                    strTblContent.Append("<td>" + emp.PF_Number + "</td>");
                    strTblContent.Append("<td>" + emp.PAN_Number + "</td>");
                    strTblContent.Append("<td>" + emp.Employee_Entity_Type + "</td>");
                    if (emp.Confirmation_Date == "01/01/1900")
                    {
                        strTblContent.Append("<td></td>");
                    }
                    else
                    {
                        strTblContent.Append("<td>" + emp.Confirmation_Date + "</td>");
                    }
                    if (emp.Employee_Status == "1")
                    {
                        strTblContent.Append("<td>Disabled</td>");
                    }
                    else
                    {
                        strTblContent.Append("<td>Enabled</td>");
                    }
                    strTblContent.Append("</tr>");

                }
            }

            return strTblContent;
        }


        public string DeleteEmployee(string employeeCode, string userCode, string resignationDate)
        {
            string result = string.Empty;
            try
            {
                DataControl.BLUser objUser = new BLUser();
                DataControl.CurrentInfo objCurInfo = new CurrentInfo();
                result = objUser.DeleteEmployee(objCurInfo.GetCompanyCode(), employeeCode, userCode,
                    objCurInfo.GetUserName(), DateTime.Now.ToString(), resignationDate);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("employeeCode", employeeCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                result = "FAILURE:";
            }
            return result;
        }


        public int UpdateEmployeeStatus(string employeeCode, string employeeStatus)
        {
            int rowsAffected = 0;
            try
            {
                DataControl.BLUser objUser = new BLUser();
                DataControl.CurrentInfo objCurInfo = new CurrentInfo();
                rowsAffected = objUser.UpdateEmployeeStatus(objCurInfo.GetCompanyCode(), employeeCode, employeeStatus, objCurInfo.GetUserName(),
                    DateTime.Now.ToString());
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("employeeCode", employeeCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return rowsAffected;
        }



        public string InsertRemarks(string employeeCode, string Remarks,string User_Code,int Status)
        {
            string result = string.Empty;
            DataControl.BLUser objUser = new BLUser();
            DataControl.CurrentInfo objCurInfo = new CurrentInfo();
            result = objUser.InsertRemarks(objCurInfo.GetUserCode(), employeeCode, Remarks, User_Code, Status);
            return result;

        }

        #region greytip integration
        public ActionResult UserPayrollMapping()
        {
            return View();
        }

        public string GetChildUsersWithPayrollId(int pageSize, int pageNumber, string searchKey, string userCode)
        {
            StringBuilder strContent = new StringBuilder();
            int totalPageCount = 0;
            try
            {
                DataControl.CurrentInfo objCurInfo = new CurrentInfo();
                DataControl.BLUser objUser = new BLUser();
                List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
                lstUser = (List<MVCModels.HiDoctor_Master.UserModel>)objUser.GetChildUsersWithPayrollId(objCurInfo.GetCompanyCode(),
                    userCode, pageNumber, pageSize, searchKey, ref totalPageCount);
                strContent.Append(Pager.Paging(pageNumber, totalPageCount));
                strContent.Append("<table id='tblUsers' class='table table-striped'>");
                strContent.Append("<thead><tr><th>S.No</th><th>HiDoctor User Name</th><th>Payroll User Id</th><th>Employee No</th><th>Region Name</th>");
                strContent.Append("<th>Mobile No</th><th>Manager Name</th>");
                strContent.Append("</tr></thead><tbody>");


                if (lstUser.Count > 0)
                {
                    int i = 0;
                    if (pageNumber > 1)
                    {
                        i = (pageNumber - 1) * pageSize;
                    }
                    foreach (var user in lstUser)
                    {
                        i++;
                        strContent.Append("<tr><td>" + i + "</td><td id='tdUserName_" + i + "'>" + user.User_Name + "</td>");
                        strContent.Append("<td><input type='text' class='form-control' maxlength='30' id='txtPayrollId_" + i + "' value='"
                            + user.Payroll_User_Id + "' /> <input type='hidden' id='hdnUserCode_" + i + "' value='"
                            + user.User_Code + "'/>");
                        if (!string.IsNullOrEmpty(user.Payroll_User_Id))
                        {
                            strContent.Append("<input type='hidden' id='hdnMode_" + i + "' value='E'/></td>");
                        }
                        else
                        {
                            strContent.Append("<input type='hidden' id='hdnMode_" + i + "' value='I'/></td>");
                        }
                        strContent.Append("<td>" + user.Employee_Number + "</td>");
                        strContent.Append("<td>" + user.Region_Name + "</td>");
                        strContent.Append("<td>" + user.User_Mobile_Number + "</td>");
                        strContent.Append("<td>" + user.Reporting_Manager_Name + "</td>");
                        strContent.Append("</tr>");
                    }
                }
                else
                {
                    strContent.Append("<tr>");
                    strContent.Append("<td colspan='7' style='text-align:center'>No records found</td>");
                    strContent.Append("</tr>");
                }
                strContent.Append("</tbody>");
                strContent.Append("</table>");
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return strContent.ToString();
        }
        public string InsertPayrollMapping(string userCodes)
        {
            string result = string.Empty;
            List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
            try
            {
                DataControl.BLUser objBljUser = new BLUser();
                DataControl.CurrentInfo objCurInfo = new CurrentInfo();
                if (!string.IsNullOrEmpty(userCodes))
                {
                    string[] ar = userCodes.Split('~');
                    for (int i = 0; i < ar.Length; i++)
                    {
                        if (!string.IsNullOrEmpty(ar[i].ToString()))
                        {
                            MVCModels.HiDoctor_Master.UserModel objUser = new MVCModels.HiDoctor_Master.UserModel();
                            string userCode = ar[i].Split('|')[0].ToString();
                            string payrollId = ar[i].Split('|')[1].ToString();
                            string userName = ar[i].Split('|')[2].ToString();
                            objUser.User_Code = userCode;
                            objUser.Payroll_User_Id = payrollId;
                            objUser.User_Name = userName;
                            objUser.Company_Code = objCurInfo.GetCompanyCode();
                            if (!string.IsNullOrEmpty(payrollId))
                            {
                                objUser.User_Status = "1";
                            }
                            else
                            {
                                objUser.User_Status = "0";
                            }
                            lstUser.Add(objUser);
                        }
                    }
                    List<MVCModels.HiDoctor_Master.UserModel> lstPayrollUsers = new List<MVCModels.HiDoctor_Master.UserModel>();
                    lstPayrollUsers = (List<MVCModels.HiDoctor_Master.UserModel>)objBljUser.GetPayrollUsers(objCurInfo.GetCompanyCode());
                    int rowsAffected = 0;
                    if (lstPayrollUsers.Count > 0)
                    {
                        List<MVCModels.HiDoctor_Master.UserModel> lstInsertMenu =
                                lstUser.Where(s => !lstPayrollUsers.Where(e => e.User_Code == s.User_Code).Any()).ToList();
                        lstUser.RemoveAll(s => lstInsertMenu.Where(e => e.User_Code == s.User_Code).Any());
                        lstUser.RemoveAll(s => lstPayrollUsers.Where(e => e.User_Code == s.User_Code && e.Payroll_User_Id == s.Payroll_User_Id).Any());
                        foreach (MVCModels.HiDoctor_Master.UserModel user in lstInsertMenu)
                        {
                            var lstExists = lstPayrollUsers.AsEnumerable().Where(x => x.Payroll_User_Id == user.Payroll_User_Id).ToList();
                            if (lstExists.Count > 0)
                            {
                                result = "ERROR: Payroll user id " + lstExists[0].Payroll_User_Id + " already exists";
                                return result;
                            }
                        }
                        foreach (MVCModels.HiDoctor_Master.UserModel user in lstUser)
                        {
                            var lstExists = lstPayrollUsers.AsEnumerable().Where(x => x.Payroll_User_Id == user.Payroll_User_Id
                                && x.User_Code != user.User_Code).ToList();
                            if (lstExists.Count > 0)
                            {
                                result = "ERROR: Payroll user id " + lstExists[0].Payroll_User_Id + " already exists";
                                return result;
                            }
                        }
                        rowsAffected = objBljUser.InsertPayrollMapping(objCurInfo.GetCompanyCode(), lstInsertMenu, lstUser,
                                        System.DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss"), objCurInfo.GetUserName());
                        if (lstInsertMenu.Count > 0 || lstUser.Count > 0)
                        {
                            if (rowsAffected > 0)
                            {
                                if (lstInsertMenu.Count > 0 & lstUser.Count > 0)
                                {
                                    result = "SUCCESS:" + lstInsertMenu.Count + " users are newly mapped to payroll and " + lstUser.Count + " users are updated";
                                }
                                else if (lstInsertMenu.Count > 0 & lstUser.Count == 0)
                                {
                                    result = "SUCCESS:" + lstInsertMenu.Count + " users are newly mapped to payroll";
                                }
                                else if (lstUser.Count > 0 & lstInsertMenu.Count == 0)
                                {
                                    result = "SUCCESS:" + lstUser.Count + " users are updated into payroll mapping";
                                }
                            }
                            else
                            {
                                result = "ERROR: Error while mapping the users to payroll";
                            }
                        }
                        else
                        {
                            result = "ERROR:Please do some changes then try to submit";
                        }
                    }
                    else
                    {
                        if (lstUser.Count > 0)
                        {
                            rowsAffected = objBljUser.InsertPayrollMapping(objCurInfo.GetCompanyCode(), lstUser, null,
                                           System.DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss"), objCurInfo.GetUserName());
                            if (rowsAffected > 0)
                            {
                                result = "SUCCESS:" + lstUser.Count + " users are newly mapped to payroll";
                            }
                            else
                            {
                                result = "ERROR: Error while mapping the users to payroll";
                            }
                        }
                        else
                        {
                            result = "ERROR: Do any changes then try to submit";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                result = "ERROR: Error while mapping the users to payroll";
            }
            return result;
        }
        #endregion greytip integration

        #region usertype new index update
        public string UpdateUserTypeNewIndex()
        {
            string result = "";
            string guid = Guid.NewGuid().ToString();
            try
            {
                DataSet ds = new DataSet();
                DataControl.BLUser _objBlUser = new DataControl.BLUser();
                DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
                ds = _objBlUser.GetAllUserTypesForMigration(_objCurInfo.GetCompanyCode());
                DataSet dsAllUserTypes = new DataSet();
                DataRow[] dr;
                dr = ds.Tables[0].AsEnumerable().Where(c => c["User_Type_Code"].ToString() == c["Under_User_Type"].ToString()).ToArray();
                if (dr.Length > 0)
                {
                    string userTypeCode = dr[0]["User_Type_Code"].ToString();
                    string userTypeId = dr[0]["User_Type_ID"].ToString();
                    dsAllUserTypes = _objBlUser.GetUserTypesHierarchyDataset(_objCurInfo.GetCompanyCode(), userTypeCode, _objCurInfo.GetUserCode(), guid);
                    if (dsAllUserTypes.Tables[0].Rows.Count > 0)
                    {
                        //Display Order Update
                        for (int d = 0; d < dsAllUserTypes.Tables[0].Rows.Count; d++)
                        {
                            dsAllUserTypes.Tables[0].Rows[d]["User_Type_Display_Order"] = d + 1;
                            dsAllUserTypes.AcceptChanges();
                        }
                        //Root user seq and full index update
                        DataRow[] drRoot;
                        drRoot = dsAllUserTypes.Tables[0].AsEnumerable().Where(c => c["User_Type_Code"].ToString() == c["Under_User_Type"].ToString()).ToArray();
                        drRoot[0]["User_Type_Full_Index"] = userTypeId + ".";
                        drRoot[0]["User_Type_Seq_Index"] = "1";
                        drRoot[0]["Company_Code"] = _objCurInfo.GetCompanyCode();
                        // Root child nodes seq and full index updation
                        DataRow[] drChild;
                        drChild = dsAllUserTypes.Tables[0].AsEnumerable().Where(d => d["Under_User_Type"].ToString() == userTypeCode).ToArray();
                        if (drChild.Length > 0)
                        {
                            int c = 0;
                            foreach (DataRow drr in drChild)
                            {
                                c++;
                                drr["User_Type_Seq_Index"] = c.ToString();
                                drr["Company_Code"] = _objCurInfo.GetCompanyCode();
                                dsAllUserTypes.AcceptChanges();
                            }
                        }
                        dsAllUserTypes.AcceptChanges();
                        int displayOrder = 0;
                        for (int i = 0; i < dsAllUserTypes.Tables[0].Rows.Count; i++)
                        {
                            displayOrder++;
                            string curUserTypeCode = dsAllUserTypes.Tables[0].Rows[i]["User_Type_Code"].ToString();
                            string curParUserTypeCode = dsAllUserTypes.Tables[0].Rows[i]["Under_User_Type"].ToString();
                            if (curUserTypeCode != curParUserTypeCode)
                            {
                                string curUserTypeId = dsAllUserTypes.Tables[0].Rows[i]["User_Type_ID"].ToString();
                                string parIndex = "";
                                DataRow[] drTemp;
                                drTemp = dsAllUserTypes.Tables[0].AsEnumerable().Where(c => c["User_Type_Code"].ToString() == curParUserTypeCode).ToArray();
                                if (drTemp.Length > 0)
                                {
                                    parIndex = drTemp[0]["User_Type_Full_Index"].ToString();
                                    dsAllUserTypes.Tables[0].Rows[i]["User_Type_Full_Index"] = parIndex + curUserTypeId + ".";
                                    dsAllUserTypes.Tables[0].Rows[i]["Company_Code"] = _objCurInfo.GetCompanyCode();
                                    dsAllUserTypes.Tables[0].Rows[i]["Under_User_Type_ID"] = drTemp[0]["User_Type_ID"].ToString();
                                }

                                drChild = dsAllUserTypes.Tables[0].AsEnumerable().Where(d => d["Under_User_Type"].ToString() == curUserTypeCode).ToArray();
                                if (drChild.Length > 0)
                                {
                                    int c = 0;
                                    foreach (DataRow drr in drChild)
                                    {
                                        c++;
                                        drr["User_Type_Seq_Index"] = c.ToString();
                                        drr["Company_Code"] = _objCurInfo.GetCompanyCode();
                                        dsAllUserTypes.AcceptChanges();
                                    }
                                }
                            }
                        }
                        //Update Qry
                        result = _objBlUser.UserTypeBulkTempInsert(_objCurInfo.GetCompanyCode(), dsAllUserTypes.Tables[0], "MIGRATION");
                        if (result.Split(':')[0].ToUpper() == "SUCCESS")
                        {
                            result = _objBlUser.UpdateUserTypeIndexFromTemptoUserMaster(_objCurInfo.GetCompanyCode(), "MIGRATION", guid, _objCurInfo.GetUserCode());
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                result = "FAILURE:" + ex.Message;
            }
            return result;
        }
        #endregion usertype new index update


        public JsonResult GetStateDetails()
        {
            List<StateModel> lststate = new List<StateModel>();

            BLUser objState = new BLUser();
            lststate = objState.GetStateDetails().ToList();
            return Json(objState.GetStateDetails().ToList(), JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetEmpStateDetails()
        {
            List<StateModel> lststate = new List<StateModel>();

            BLUser objState = new BLUser();
            lststate = objState.GetEmpStateDetails().ToList();
            return Json(objState.GetEmpStateDetails().ToList(), JsonRequestBehavior.AllowGet);

        }
        public string InsertNewStateDetails(string statename)
        {
            string result = string.Empty;
            DataControl.BLUser objUser = new BLUser();
            DataControl.CurrentInfo objCurInfo = new CurrentInfo();
            result = objUser.InsertNewStateDetails(objCurInfo.GetUserCode(), statename);
            return result;

        }



        public JsonResult GetCitiesDetails(int State_ID)
        {
            List<CityModel> lstCity = new List<CityModel>();
            BLUser objCity = new BLUser();
            lstCity = objCity.GetCitiesDetails(State_ID).ToList();
            return Json(objCity.GetCitiesDetails(State_ID).ToList(), JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetEmpCitiesDetails(int State_ID)
        {
            List<CityModel> lstCity = new List<CityModel>();
            BLUser objCity = new BLUser();
            lstCity = objCity.GetEmpCitiesDetails(State_ID).ToList();
            return Json(objCity.GetEmpCitiesDetails(State_ID).ToList(), JsonRequestBehavior.AllowGet);

        }

        public string InsertNewCityDetails(string cityname, int state_Id)
        {
            string result = string.Empty;
            DataControl.BLUser objInsCity = new BLUser();
            DataControl.CurrentInfo objCurInfo = new CurrentInfo();
            result = objInsCity.InsertNewCityDetails(objCurInfo.GetUserCode(), cityname, state_Id);
            return result;

        }
        public JsonResult GetPincodeDetails(int State_ID, int City_Id)
        {
            List<PincodeModel> lstPin = new List<PincodeModel>();
            BLUser objPin = new BLUser();
            lstPin = objPin.GetPincodeDetails(State_ID, City_Id).ToList();
            return Json(objPin.GetPincodeDetails(State_ID, City_Id).ToList(), JsonRequestBehavior.AllowGet);

        }
        public string InsertPincode(int Pincode, int state_Id, int cityId)
        {
            string result = string.Empty;
            BLUser objInsPin = new BLUser();
            CurrentInfo objCurInfo = new CurrentInfo();
            result = objInsPin.InsertPincode(objCurInfo.GetUserCode(), Pincode, state_Id, cityId);
            return result;
        }
        public JsonResult GetDepartmentDetails()
        {
            List<DepartmentModel> lstdept = new List<DepartmentModel>();

            BLUser objDept = new BLUser();
            lstdept = objDept.GetDepartmentDetails().ToList();
            return Json(objDept.GetDepartmentDetails().ToList(), JsonRequestBehavior.AllowGet);

        }
        public string InsertNewDept(string Department)
        {
            string result = string.Empty;
            BLUser objInsDept = new BLUser();
            CurrentInfo objCurInfo = new CurrentInfo();
            result = objInsDept.InsertNewDept(objCurInfo.GetUserCode(), Department);
            return result;
        }
        public bool GetEmpNumb(string employeeNUmber)
        {
            bool result = false;
            try
            {
                BLUser objInsDept = new BLUser();
                CurrentInfo objCurInfo = new CurrentInfo();
                string companyCode = objCurInfo.GetCompanyCode();
                result = objInsDept.GetEmpNumb(companyCode, employeeNUmber);
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        public bool GetAadhaarNumber(string aadhaarNumber)
        {
            bool result = false;
            try
            {
                BLUser objInsDept = new BLUser();
                CurrentInfo objCurInfo = new CurrentInfo();
                string companyCode = objCurInfo.GetCompanyCode();
                result = objInsDept.GetAadhaarNumber(companyCode, aadhaarNumber);
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        public bool GetRefKey_1(string refKey)
        {
            bool result = false;
            try
            {
                BLUser objInsDept = new BLUser();
                CurrentInfo objCurInfo = new CurrentInfo();
                string companyCode = objCurInfo.GetCompanyCode();
                result = objInsDept.GetRefKey_1(companyCode, refKey);
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        public bool GetRefKey_2(string refKey)
        {
            bool result = false;
            try
            {
                BLUser objInsDept = new BLUser();
                CurrentInfo objCurInfo = new CurrentInfo();
                string companyCode = objCurInfo.GetCompanyCode();
                result = objInsDept.GetRefKey_2(companyCode, refKey);
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }
        public void DownloadSubList()
        {
            DataControl.BLUser objUser = new BLUser();
            DataControl.CurrentInfo objCurInfo = new CurrentInfo();
            string companyCode = objCurInfo.GetCompanyCode();
            DataSet Ds = new DataSet();
            Ds = objUser.DownloadSubList(companyCode);
            Ds.Tables[0].TableName = "State Details";
            Ds.Tables[1].TableName = "City Details";
            Ds.Tables[2].TableName = "Pincode Details";
            Ds.Tables[3].TableName = "Department Details";
            HttpResponse response = System.Web.HttpContext.Current.Response;
            DownloadExcel excel = new DownloadExcel();
            excel.Convert(Ds, "State_City_Pincode" + "_" + DateTime.Now.ToShortDateString(), response);

        }
       



      



        public JsonResult GetBloodgroupName()
        {
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            string companyCode = _objCurrentInfo.GetCompanyCode();
            DataControl.BLUser _objBlUser = new DataControl.BLUser();
            List<MVCModels.HiDoctor_Master.BloodGroup> lstUser = new List<MVCModels.HiDoctor_Master.BloodGroup>();
            lstUser = _objBlUser.GetBloodgroupName(companyCode);
            return Json(lstUser, JsonRequestBehavior.AllowGet);
        }


        public string BlopUpload()
        {
            HttpFileCollectionBase file = Request.Files;
            string blobURL = string.Empty;
            try
            {
                string companyCode = _objcurrentInfo.GetCompanyCode();
                string subDomain = _objcurrentInfo.GetSubDomain();

                DataControl.Abstraction.IFileProvider objPathProv = new DataControl.Impl.FileSystemProvider();

                string accKey = objPathProv.GetConfigValue("UPLOADEDFILEBLOBACCKEY");

                if (file.Count != 0)
                {
                    if (file[0] != null)
                    {
                        DataControl.Repository.AzureBlobUpload objAzureUpload = new DataControl.Repository.AzureBlobUpload();
                        string fileName = file[0].FileName.Split('.')[0] + DateTime.Now.ToString("mmddyyyyhhMMss") + "." + file[0].FileName.Split('.')[1];
                        blobURL = objAzureUpload.PutAzureBlobStorage(file[0].InputStream, fileName, accKey, companyCode);
                    }
                }

                return blobURL;
            }
            catch (Exception ex)
            {
                return ex.Message.ToString();
            }
        }
    }
}
