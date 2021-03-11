using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MVCModels;
using System.Data;

namespace DataControl.HD_MasterFactoryClasses
{
    public class BL_SplashScreen
    {
        DAL_SplashScreen _objDALSplashScreen = new DAL_SplashScreen();
        CurrentInfo _objCurrentInfo = new CurrentInfo();

        const string SUCCESS = "SUCCESS";
        const string ERROR = "ERROR";
        const string ACTIVE = "ACTIVE";
        const string EDIT = "EDIT";
        const string SAVE = "SAVE";
        const string BLOB_URL = "http://nbfiles.blob.core.windows.net/";

        private string GetCompanyCode()
        {
            string companyCode = _objCurrentInfo.GetCompanyCode();
            return companyCode;
        }

        private SplashScreenModel ConstructSplashScreenModel(string splashScreenId, string Splashtype, string title, string description, string validFrom, string validTo, string fileName, string saveMode, string mobileAttachmentUrl, string descHtml, bool hasAttachment, int assignToAllUsers, int isCompleted, DateTime lastModifiedDate)
        {
            try
            {
                SplashScreenModel objSplashScreenModel = new SplashScreenModel();

                if (saveMode.Trim().ToUpper() == EDIT)
                {
                    objSplashScreenModel.Splash_Screen_Id = Convert.ToInt32(splashScreenId);
                }
                objSplashScreenModel.Splash_Type = Splashtype;
                objSplashScreenModel.Title = title;
                objSplashScreenModel.Description = description;
                objSplashScreenModel.Date_From = Convert.ToDateTime(validFrom.Split('/')[2] + "-" + validFrom.Split('/')[1] + "-" + validFrom.Split('/')[0]);
                objSplashScreenModel.Date_To = Convert.ToDateTime(validTo.Split('/')[2] + "-" + validTo.Split('/')[1] + "-" + validTo.Split('/')[0]);
                objSplashScreenModel.File_Path = fileName;
                objSplashScreenModel.Mobile_Attachment_Url = mobileAttachmentUrl;
                objSplashScreenModel.Description_HTML = descHtml;
                objSplashScreenModel.Has_Attachment = hasAttachment;
                objSplashScreenModel.Assigned_To_All_Users = assignToAllUsers;
                objSplashScreenModel.Is_Completed = isCompleted;
                objSplashScreenModel.Last_Modified_DateTime = lastModifiedDate;

                return objSplashScreenModel;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //public string CheckOverlappingSplashScreenData(string splashScreenId, string validFrom, string validTo, string saveMode)
        //{
        //    try
        //    {
        //        SplashScreenModel objSplashScreenModel;
        //        string companyCode = GetCompanyCode();
        //        int recordCount;

        //        objSplashScreenModel = ConstructSplashScreenModel(splashScreenId, string.Empty, string.Empty, validFrom, validTo, string.Empty, saveMode);

        //        if (saveMode.Trim().ToUpper() != EDIT)
        //        {
        //            recordCount = _objDALSplashScreen.CheckOverlappingSplashScreenData(companyCode, objSplashScreenModel);
        //        }
        //        else
        //        {
        //            recordCount = _objDALSplashScreen.CheckOverlappingSplashScreenDataForEdit(companyCode, objSplashScreenModel);
        //        }

        //        if (recordCount > 0)
        //        {
        //            return ERROR;
        //        }
        //        else
        //        {
        //            return SUCCESS;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //}

        public string SaveSplashScreen(string splashScreenId, string Splashtype, string title, string description, string validFrom, string validTo, string fileName, string saveMode, string mobileAttachmentUrl, string descHtml, bool hasAttachment, int assignToAllUsers, int isCompleted, DateTime lastModifiedDate)
        {
            try
            {
                SplashScreenModel objSplashScreenModel;
                bool isSplashScreenDataSaved = false;
                int splashId = 0;
                string companyCode = GetCompanyCode();

                objSplashScreenModel = ConstructSplashScreenModel(splashScreenId, Splashtype, title, description, validFrom, validTo, fileName, saveMode, mobileAttachmentUrl, descHtml, hasAttachment, assignToAllUsers, isCompleted, lastModifiedDate);

                if (saveMode.Trim().ToUpper() != EDIT)
                {
                    splashId = _objDALSplashScreen.InsertSplashScreenData(companyCode, objSplashScreenModel);
                }
                else
                {
                    isSplashScreenDataSaved = _objDALSplashScreen.UpdateSplashScreenData(companyCode, objSplashScreenModel);
                    if (isSplashScreenDataSaved)
                    {
                        splashId = Convert.ToInt32(splashScreenId);
                    }
                }

                if (splashId > 0)
                {
                    return SUCCESS + ":" + splashId;
                }
                else
                {
                    return ERROR;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string GetSplashScreenDataForEdit(string splashScreenId)
        {
            try
            {
                string companyCode = GetCompanyCode();
                SplashScreenModel objSplashScreenModel = new SplashScreenModel();
                JSONConverter objJSON = new JSONConverter();

                objSplashScreenModel = _objDALSplashScreen.GetSplashScreenDataForEdit(companyCode, Convert.ToInt32(splashScreenId));

                return objJSON.Serialize(objSplashScreenModel);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string ChangeSplashScreenStatus(string splashScreenId, string currentStatus)
        {
            try
            {
                bool isSplashScreenStatusChanged = false;
                bool statusToBeChanged;

                if (currentStatus.Trim().ToUpper() == ACTIVE)
                {
                    statusToBeChanged = false;
                }
                else
                {
                    statusToBeChanged = true;
                }

                isSplashScreenStatusChanged = _objDALSplashScreen.ChangeSplashScreenStatus(GetCompanyCode(), Convert.ToInt32(splashScreenId), statusToBeChanged);

                if (isSplashScreenStatusChanged)
                {
                    return SUCCESS;
                }
                else
                {
                    return ERROR;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string GetAllSplashScreenData()
        {
            try
            {
                List<SplashScreenModel> lstSplashScreenModel = new List<SplashScreenModel>();
                StringBuilder tableContent = new StringBuilder();

                lstSplashScreenModel = _objDALSplashScreen.GetSplashScreenData(GetCompanyCode());

                if (lstSplashScreenModel != null && lstSplashScreenModel.Count > 0)
                {
                    tableContent.Append("<table cellpadding='0' cellsapcing='0' id='tblSplashScreen' width='100%' class='table table-striped'>");
                    tableContent.Append("<thead>");
                    tableContent.Append("<tr>");

                    tableContent.Append("<th>Edit</th>");
                    tableContent.Append("<th>Change Status</th>");
                    tableContent.Append("<th>Title</th>");
                    tableContent.Append("<th>Description</th>");
                    tableContent.Append("<th>Date From</th>");
                    tableContent.Append("<th>Date To</th>");
                    tableContent.Append("<th>Attachment</th>");
                    tableContent.Append("<th>Status</th>");
                    tableContent.Append("<th>Assign</th>");
                    tableContent.Append("</tr>");
                    tableContent.Append("</thead>");

                    tableContent.Append("<tbody>");
                    foreach (SplashScreenModel objSplashScreenModel in lstSplashScreenModel)
                    {
                        tableContent.Append("<tr>");

                        // tableContent.Append("<td><a href='#' onclick=\"fnEditSplashScreen('" + objSplashScreenModel.Splash_Screen_Id + "')\">Edit</a></td>");
                        tableContent.Append("<td><a href='#' onclick=\"fnEditSplashScreen('" + objSplashScreenModel.Splash_Screen_Id + "')\"><i class='fa fa-pencil'></i></a>");
                        tableContent.Append("<td><a href='#' onclick=\"fnChangeSplashScreenStatus('" + objSplashScreenModel.Splash_Screen_Id + "','" + objSplashScreenModel.Record_Status_Display_Name + "','" + objSplashScreenModel.Date_From.ToString("dd/MM/yyyy") + "','" + objSplashScreenModel.Date_To.ToString("dd/MM/yyyy") + "')\">Change Status</a></td>");
                        tableContent.Append("<td style=white-space:normal;word-wrap:break-word;word-break:break-word;>" + objSplashScreenModel.Title + "</td>");
                        tableContent.Append("<td style=white-space:normal;word-wrap:break-word;word-break:break-word;>" + objSplashScreenModel.Description + "</td>");
                        tableContent.Append("<td>" + objSplashScreenModel.Date_From.ToString("dd/MM/yyyy") + "</td>");
                        tableContent.Append("<td>" + objSplashScreenModel.Date_To.ToString("dd/MM/yyyy") + "</td>");
                        // tableContent.Append("<td><a href='" + BLOB_URL + GetCompanyCode().ToLower() + "/" + objSplashScreenModel.File_Path + "'>Download</a></td>");
                        if (objSplashScreenModel.Has_Attachment == true)
                        {
                            tableContent.Append("<td><a href='" + BLOB_URL + GetCompanyCode().ToLower() + "/" + objSplashScreenModel.File_Path + "'><i class='fa fa-download'></i></a></td>");
                        }
                        else {
                            tableContent.Append("<td> </td>");
                        }
                        tableContent.Append("<td>" + objSplashScreenModel.Record_Status_Display_Name + "</td>");
                        tableContent.Append("<td><a href='#' class='cls_lnk_assign' splash-id='" + objSplashScreenModel.Splash_Screen_Id + "'>Assign</a></td>");

                        tableContent.Append("</tr>");
                    }

                    tableContent.Append("</tbody>");

                    tableContent.Append("</table>");
                }

                return tableContent.ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public IEnumerable<MVCModels.SplashScreenModel> GetTodaysSplashScreen(string companyCode, string userCode)
        {
            try
            {
                _objDALSplashScreen = new DAL_SplashScreen();
                return _objDALSplashScreen.GetTodaysSplashScreen(companyCode, userCode);
                //string tableContent = string.Empty;
                //string companyCode = GetCompanyCode();

                //SplashScreenModel objSplashScreenModel;
                //System.Web.UI.HtmlControls.HtmlImage img;

                //objSplashScreenModel = _objDALSplashScreen.GetTodaysSplashScreen(companyCode);

                //if (objSplashScreenModel != null && objSplashScreenModel.Title != null)
                //{
                //    img = new System.Web.UI.HtmlControls.HtmlImage();
                //    img.Src = "" + BLOB_URL + GetCompanyCode().ToLower() + "/" + objSplashScreenModel.File_Path + "";

                //    tableContent = "<table cellpadding='0' cellsapcing='0' id='tblSplashScreen' width='100%'>";
                //    tableContent += "<tr>";
                //    tableContent += "<td colspan='2' class='splashTitle'>" + objSplashScreenModel.Title + "";
                //    tableContent += "<span style='float: right; cursor: pointer' onclick=\"HideModalPopup('modalSplash'); return false;\">X</span>";
                //    tableContent += "</tr>";
                //    tableContent += "<tr>";
                //    tableContent += "<td class='splashDescription'><p>" + objSplashScreenModel.Description + "</p></td>";
                //    tableContent += "<td class='splashImage'> <img src = '" + BLOB_URL + GetCompanyCode().ToLower() + "/" + objSplashScreenModel.File_Path + "' /></td>";
                //    tableContent += "</tr>";
                //    tableContent += "</table>";
                //}

                // return tableContent;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public IEnumerable<MVCModels.HiDoctor_Master.DivisionModel> GetUnderDivisions(string companyCode, string userCode)
        {
            _objDALSplashScreen = new DAL_SplashScreen();
            return _objDALSplashScreen.GetUnderDivisions(companyCode, userCode);
        }
        public IEnumerable<MVCModels.HiDoctor_Master.UserTypeModel> GetUnderUserTypes(string companyCode, string userCode)
        {
            _objDALSplashScreen = new DAL_SplashScreen();
            return _objDALSplashScreen.GetUnderUserTypes(companyCode, userCode);
        }
        public IEnumerable<MVCModels.HiDoctor_Master.GroupDetails> GetGroupDetails(string UserName)
        {
            _objDALSplashScreen = new DAL_SplashScreen();
            return _objDALSplashScreen.GetGroupDetails(UserName);
        }
        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetUnderUsersByDivisionAndUT(string companyCode, string userCode, string divisionCodes, string userTypeCodes)
        {
            _objDALSplashScreen = new DAL_SplashScreen();
            return _objDALSplashScreen.GetUnderUsersByDivisionAndUT(companyCode, userCode, divisionCodes, userTypeCodes);
        }
        public int InsertSplashUsers(List<MVCModels.SplashUsersModel> lstSplashUsers, int splashId, string Splashtype, string companyCode, string mode)
        {
            _objDALSplashScreen = new DAL_SplashScreen();
            return _objDALSplashScreen.InsertSplashUsers(lstSplashUsers, splashId, Splashtype, companyCode, mode);
        }
        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetSplashMappedUsers(string companyCode, int splashId)
        {
            _objDALSplashScreen = new DAL_SplashScreen();
            return _objDALSplashScreen.GetSplashMappedUsers(companyCode, splashId);
        }

        public IEnumerable<MVCModels.HiDoctor_Master.UserTypeSplashModel> GetselectedUserTypes(string companyCode, string userCode, string divisionCodes, string UserTypeCodes)
        {
            _objDALSplashScreen = new DAL_SplashScreen();
            var DivisionCodes = divisionCodes.Split(',');
            DataTable dtdivisionCodes = null;
            if (DivisionCodes.Length >= 1)
            {
                dtdivisionCodes = new DataTable();
                dtdivisionCodes.Columns.Add("Company_Code", typeof(string));
                dtdivisionCodes.Columns.Add("Division_Code", typeof(string));

                for (int i = 0; i < DivisionCodes.Length; i++)
                {
                    dtdivisionCodes.Rows.Add(companyCode, DivisionCodes[i]);
                }
            }
            var UsrTypeCodes = UserTypeCodes.Split(',');
            DataTable dtUserTypeCodes = null;
            if (UsrTypeCodes.Length >= 1)
            {
                dtUserTypeCodes = new DataTable();
                dtUserTypeCodes.Columns.Add("Company_Code", typeof(string));
                dtUserTypeCodes.Columns.Add("User_Type_Code", typeof(string));

              for (int i = 0; i < UsrTypeCodes.Length; i++)
              {
                    dtUserTypeCodes.Rows.Add(companyCode, UsrTypeCodes[i]);
              }
            }
            return _objDALSplashScreen.GetselectedUserTypes(companyCode, userCode, dtdivisionCodes, dtUserTypeCodes);
        }

        public IEnumerable<MVCModels.HiDoctor_Master.GroupDetails> GetselectedGroupCodes(string companyCode, string GroupCodes)
        {
            _objDALSplashScreen = new DAL_SplashScreen();
            var Groupcodes = GroupCodes.Split(',');
            DataTable dtGroupcodes = null;
            if (Groupcodes.Length >= 1)
            {
                dtGroupcodes = new DataTable();
                dtGroupcodes.Columns.Add("Group_ID", typeof(string));

                for (int i = 0; i < Groupcodes.Length; i++)
                {
                    dtGroupcodes.Rows.Add(Groupcodes[i]);
                }
            }
            return _objDALSplashScreen.GetselectedGroupCodes(companyCode,dtGroupcodes);
        }
    }
}
