using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.Text;
using DataControl;
using HiDoctor_Master.Models;
using MVCModels.HiDoctor_Master;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class UserTypeMasterController : Controller
    {
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        private SPData _objSPData = new SPData();
        DataControl.Data _objData = new DataControl.Data();

        public ActionResult UserType()
        {
            ViewBag.CompanyCode = _objcurrentInfo.GetCompanyCode();
            return View();
        }

        /// <summary>
        /// Bind UserType with Html Table
        /// </summary>
        /// <returns></returns>
        public JsonResult GetUserTypeMaster()
        {
            string companycode = _objcurrentInfo.GetCompanyCode();
            try
            {
                BLMaster Master = new BLMaster();
                DataSet dsUserType = new DataSet();
                dsUserType = Master.GetUserTypeMaster(companycode);
                DataControl.JSONConverter _objJson = new DataControl.JSONConverter();
                return Json(_objJson.Serialize(dsUserType), JsonRequestBehavior.AllowGet);

                //StringBuilder sb = new StringBuilder();
                //sb.Append("<table WIDTH='70%' id='tblsummary' class='table table-striped'>");
                //sb.Append("<thead class='active'>");
                //sb.Append("<tr style='background-color:grey;'>");
                //sb.Append("<td>Edit</td>");
                //sb.Append("<td>Change Status</td>");
                //sb.Append("<td>User Type</td>");
                //sb.Append("<td>Under User Type</td>");
                //sb.Append("<td>User Type Category</td>");
                //sb.Append("<td>Status</td>");
                //sb.Append("</tr>");
                //sb.Append("</thead>");
                //sb.Append("<tbody>");

                //if (dsUserType != null && dsUserType.Tables[0] != null && dsUserType.Tables[0].Rows.Count > 0)
                //{
                //    for (int i = 0; i < dsUserType.Tables[0].Rows.Count; i++)
                //    {
                //        sb.Append("<tr><td class='td-a'><a id='E" + i + "' onclick='fnEdit(this)'>Edit</a></td>");
                //        sb.Append("<td class='td-a'><a id='C" + i + "' onclick='fnchangeStatus(this)'>Change Status</a></td>");
                //        sb.Append("<td style='display:none; text-align:left;' id='User_Type_Code" + i + "'>" + dsUserType.Tables[0].Rows[i]["User_Type_Code"] + "</td>");
                //        sb.Append("<td id='User_Type_Name" + i + "' style='text-align:left;'>" + dsUserType.Tables[0].Rows[i]["User_Type_Name"] + "</td>");
                //        sb.Append("<td style='display:none; text-align:left;' id='Under_User_Type" + i + "'>" + dsUserType.Tables[0].Rows[i]["Under_User_Type"] + "</td>");
                //        sb.Append("<td id='UnderUser" + i + "' style='text-align:left;'>" + dsUserType.Tables[0].Rows[i]["UnderUser"] + "</td>");
                //        sb.Append("<td id='User_Type_Category" + i + "' style='text-align:left;'>" + dsUserType.Tables[0].Rows[i]["User_Type_Category"] + "</td>");
                //        sb.Append("<td id='Status" + i + "' style='text-align:left;'>" + dsUserType.Tables[0].Rows[i]["Status"] + "</td></tr>");
                //    }
                //}
                //else
                //{
                //    sb.Append("<tr><td>No Records TO Display</td></tr>");
                //}

                //sb.Append("</body>");
                //sb.Append("</table>");

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Download the UserTypeMaster Into Excel
        /// </summary>
        /// <returns></returns>
        public void PutUserTypeIntoExcel()
        {
            string companycode = _objcurrentInfo.GetCompanyCode();
            string error = string.Empty;
            try
            {
                BLMaster Master = new BLMaster();
                DataSet dsUserType = new DataSet();
                dsUserType = Master.GetUserTypeMaster(companycode);
                DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();
                DataControl.Abstraction.IFileProvider objProvider = new DataControl.Impl.FileSystemProvider();
                StringBuilder sb = new StringBuilder();
                sb.Append("<table WIDTH='70%' id='tblsummary' class='table table-striped'>");
                sb.Append("<thead class='active'>");
                sb.Append("<tr style='background-color:grey;'>");
                sb.Append("<td>User Type</td>");
                sb.Append("<td>Under User Type</td>");
                sb.Append("<td>User Type Category</td>");
                sb.Append("<td>Status</td>");
                sb.Append("</tr>");
                sb.Append("</thead>");
                sb.Append("<tbody>");

                if (dsUserType != null && dsUserType.Tables[0] != null && dsUserType.Tables[0].Rows.Count > 0)
                {
                    for (int i = 0; i < dsUserType.Tables[0].Rows.Count; i++)
                    {
                        sb.Append("<td id='User_Type_Name" + i + "' style='text-align:left;'>" + dsUserType.Tables[0].Rows[i]["User_Type_Name"] + "</td>");
                        sb.Append("<td id='UnderUser" + i + "' style='text-align:left;'>" + dsUserType.Tables[0].Rows[i]["UnderUser"] + "</td>");
                        sb.Append("<td id='User_Type_Category" + i + "' style='text-align:left;'>" + dsUserType.Tables[0].Rows[i]["User_Type_Category"] + "</td>");
                        sb.Append("<td id='Status" + i + "' style='text-align:left;'>" + dsUserType.Tables[0].Rows[i]["Status"] + "</td></tr>");
                    }
                }
                else
                {
                    sb.Append("<tr><td>No Records TO Display</td></tr>");
                }

                sb.Append("</body>");
                sb.Append("</table>");
                DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");

                string userName = _objcurrentInfo.GetUserName();
                string subdomainName = System.Web.HttpContext.Current.Request.Url.DnsSafeHost; ;

                string fileName = "UserTypeMaster" + " - " + subdomainName + " - " + userName + ".xls";
                string blobUrl = objAzureBlob.AzureBlobUploadText(sb.ToString(), accKey, fileName, "bulkdatasvc");

                objFileDownload.DownloadFile(blobUrl, fileName, out error);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
            }
        }

        //Bind UnderUserType
        public JsonResult GetUnderUserType()
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            try
            {
                BLMaster Master = new BLMaster();
                DataTable dtDivision = null;
                List<UserTypeMasterModel> Divisionlst = new List<UserTypeMasterModel>();
                DataSet ds = Master.Getdivisions(companyCode);


                if (ds != null && ds.Tables != null && ds.Tables.Count > 0)
                {
                    dtDivision = ds.Tables[0];
                }

                Divisionlst = (from Division in dtDivision.AsEnumerable()
                               select new UserTypeMasterModel
                               {
                                   User_Type_Code = Division["User_Type_Code"].ToString(),
                                   User_Type_Name = Division["User_Type_Name"].ToString()
                               }).ToList<UserTypeMasterModel>();

                return Json(Divisionlst);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }
        }

        /// <summary>
        /// ChangeStatus
        /// </summary>
        /// <param name="status"></param>
        /// <param name="userTypeCode"></param>
        /// <returns></returns>
        public string ChangestatusforUserType(string status, string userTypeCode)
        {
            string UserStatus = string.Empty;
            try
            {
                UserStatus = status.ToUpper() == "ENABLED" ? "1" : "0"; //1 is Enable, 0 is Disable
                BLMaster Master = new BLMaster();
                string companyCode = _objcurrentInfo.GetCompanyCode();
                return Master.ChangestatusforUserType(companyCode, userTypeCode, UserStatus, _objcurrentInfo.GetUserName(), DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff"));
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:status", status);
                dicContext.Add("Filter:userTypeCode", userTypeCode);
                return "ERROR: " + ex.Message.ToString();
            }
        }

        /// <summary>
        /// Insert and Update
        /// </summary>
        /// <param name="userTypeCodeval"></param>
        /// <param name="userTypeName"></param>
        /// <param name="underUserType"></param>
        /// <param name="userTypeCategory"></param>
        /// <param name="Mode"></param>
        /// <returns></returns>
        public int InsertandUpdateUserType(string userTypeCodeval, string userTypeName, string underUserType, string userTypeCategory, string Mode, string refkey1, string refkey2)
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            try
            {
                string data = string.Empty;
                BLMaster Master = new BLMaster();


                if (Mode.ToUpper() == "I") // Insert Data
                {
                    string userTypeCode = _objData.GetMaxCode(_objcurrentInfo.GetCompanyCode(), "tbl_SFA_User_Type_Master", "User_Type_Code", "UTC");
                    string status = "1";
                    string EffectiveFrom = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff");
                    if (string.IsNullOrEmpty(userTypeCategory))
                    {
                        userTypeCategory = "";
                    }
                    int InsertUserType = Master.InsertUserType(companyCode, userTypeCode, userTypeName, underUserType, EffectiveFrom, status, userTypeCategory, _objcurrentInfo.GetUserCode(), DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff"), refkey1, refkey2);
                    UpdateUserTypeNewIndex();
                    return InsertUserType;
                }
                else
                {
                    string EffectiveFrom = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff");
                    if (string.IsNullOrEmpty(userTypeCategory))
                    {
                        userTypeCategory = "";
                    }

                    int UpdateUserType = Master.UpdateUserType(companyCode, userTypeCodeval, userTypeName, underUserType, EffectiveFrom, userTypeCategory, _objcurrentInfo.GetUserCode(), DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff"), refkey1, refkey2);
                    UpdateUserTypeNewIndex();
                    return UpdateUserType;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:userTypeName", userTypeName);
                dicContext.Add("Filter:userTypeCodeval", userTypeCodeval);
                dicContext.Add("Filter:underUserType", underUserType);
                dicContext.Add("Filter:userTypeCategory", userTypeCategory);
                dicContext.Add("Filter:companyCode", companyCode);
                dicContext.Add("Filter:Mode", Mode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return 0;
            }

        }
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

        public JsonResult GetKIUserType(string UserTypeName)
        {
            KI_UserTypeModel obj = new KI_UserTypeModel();
            try
            {
                CurrentInfo _objCurrInfo = new CurrentInfo();
                BLMaster _objBlmaster = new DataControl.BLMaster();
                string companyCode = _objCurrInfo.GetCompanyCode();
                obj = _objBlmaster.GetKIUserType(companyCode, UserTypeName);
                return Json(obj, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}

