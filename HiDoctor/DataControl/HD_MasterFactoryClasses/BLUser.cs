using DataControl.Abstraction;
using DataControl.Impl;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Data.SqlClient;
using Excel;
using System.Collections;
using Newtonsoft.Json;
using MVCModels;
using Microsoft.WindowsAzure;
using MVCModels.HiDoctor_Master;
using OfficeOpenXml;
using DataControl.HiDoctor_ActivityFactoryClasses;

namespace DataControl
{
    public class BLUser
    {
        #region Private Variable
        private string _userExcelTemplateFileName = string.Empty;
        private string _employeeExcelTemplateFileName = string.Empty;
        private const string DOWNLOAD_PATH_KEY_NAME = "ExcelDownloadPath";
        private const string UPLOAD_PATH_KEY_NAME = "ExcelUploadPath";
        private const string KEY_COL_NAME = "Employee_Name";
        const string USER_EXCEL_SHEET_NAME = "Table$";
        const string EMPLOYEE_EXCEL_SHEET_NAME = "Table$";
        private const string FILE_UPLOAD_PATH = "ExcelUploadPath";
        private string _PayslipTemplateFileName = string.Empty;

        #endregion Private Variable

        DALUser _dalUser = new DALUser();
        public List<MVCModels.HiDoctor_Master.BillingReportModel> GetBillingReport(string companyCode, string fromDate, string toDate, string mode)
        {
            return _dalUser.GetBillingReport(companyCode, fromDate, toDate, mode);
        }
        public string InsertEmployee(string companyCode, string RegionCode, string EmployeeName, string employeeNumber, string gender, string dateOfBirth, int Department_Id, string EDNProof,
            string salaryProof, string resumeGiven, string resignationSubmitted, string appointed, string dateofJoining, string ProDateofConfirm, string confirmationDate, string PFNumber,
            string PANNumber, string SCBAccountNumber, string ICICIAccountNumber, string address1, string address2, string address3, int State_ID, int City_ID, int Pincode,
            string mobile, string phone, string emailId, string employeeEntityType, string employeeCode, string mode, string createdBy, string aadhaar_No, string Ref_Key1, string Ref_Key2, string Blood_Group, string Employee_Photo)
        {
            return _dalUser.InsertEmployee(companyCode, RegionCode, EmployeeName, employeeNumber, gender, dateOfBirth, Department_Id, EDNProof, salaryProof,
                resumeGiven, resignationSubmitted, appointed, dateofJoining, ProDateofConfirm, confirmationDate, PFNumber, PANNumber, SCBAccountNumber, ICICIAccountNumber,
                address1, address2, address3, State_ID, City_ID, Pincode, mobile, phone, emailId, employeeEntityType, employeeCode, mode, createdBy, aadhaar_No, Ref_Key1, Ref_Key2, Blood_Group, Employee_Photo);
        }

        public List<MVCModels.HiDoctor_Master.EmployeeModel> GetUnassignedEmployees(string companyCode)
        {
            return _dalUser.GetUnassignedEmployees(companyCode);
        }
        public List<MVCModels.HiDoctor_Master.UserModel> GetUsers(string companyCode)
        {
            return _dalUser.GetUsers(companyCode);
        }
        public List<MVCModels.HiDoctor_Master.DivisionModel> GetDivisions(string companyCode)
        {
            return _dalUser.GetDivisions(companyCode);
        }
        public List<MVCModels.HiDoctor_Master.ExpenseModel> GetExpenseGroup(string companyCode)
        {
            return _dalUser.GetExpenseGroup(companyCode);
        }
        public List<MVCModels.HiDoctor_Master.UserTypeModel> GetUserTypes(string companyCode)
        {
            return _dalUser.GetUserTypes(companyCode);
        }
        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetLogo(string CompanyCode, string UserCode)
        {
            return _dalUser.GetLogo(CompanyCode, UserCode);
        }
        public string InsertUserMaster(string CompanyCode, string UserCode, string EmployeeCode, string UserTypeCode, string UnderUserCode,
        string UserName, string UserPass, string UserStatus, string RegionCode,
           string ExpenseGroupId, string HiDOCTORStartDate, string createdBy)
        {
            return _dalUser.InsertUserMaster(CompanyCode, UserCode, EmployeeCode, UserTypeCode, UnderUserCode,
                                 UserName, UserPass, UserStatus, RegionCode,
                                 ExpenseGroupId, HiDOCTORStartDate, createdBy);
        }
        public string BulkUserInsert(string companyCode, Guid guid, string tblContent, string uploadedBy)
        {
            DataTable dt = new DataTable();
            dt = UserStringToDataTable(companyCode, tblContent, guid);
            string result = "";
            result = _dalUser.BulkUserInsert(companyCode, dt);
            if ("SUCCESS" == result.Split(':')[0])
            {
                result = _dalUser.InsertBulkUserStagingToMaster(companyCode, guid, uploadedBy);
            }
            return result;
        }
        public DataTable GetExpenseGroupMand(string Company_Code, string User_Code, string Region_Code, string User_Type_Code)
        {
            return _dalUser.GetExpenseGroupMand(Company_Code, User_Code, Region_Code, User_Type_Code);
        }
        public DataTable UserStringToDataTable(string companyCode, string tblContent, Guid guid)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("Company_Code", typeof(String));
            dt.Columns.Add("Employee_Code", typeof(String));
            dt.Columns.Add("User_Type_Code", typeof(String));
            dt.Columns.Add("Under_User_Code", typeof(String));
            dt.Columns.Add("Under_User_Name", typeof(String));
            dt.Columns.Add("User_Name", typeof(String));
            dt.Columns.Add("User_Pass", typeof(String));
            dt.Columns.Add("Region_Code", typeof(String));
            dt.Columns.Add("HiDOCTOR_Start_Date", typeof(String));
            dt.Columns.Add("Expense_Group_Id", typeof(String));
            dt.Columns.Add("GUID", typeof(String));
            dt.Columns.Add("Row_No", typeof(Int32));
            dt.Columns.Add("Status", typeof(String));
            string[] rowArr;
            rowArr = tblContent.Split('~');
            for (int i = 0; i < rowArr.Length - 1; i++)
            {
                string[] columnArr;
                columnArr = rowArr[i].Split('^');
                DataRow dr = dt.NewRow();
                dr[0] = companyCode;
                dr[1] = columnArr[0];//Employee code
                dr[2] = columnArr[8];//User type code
                dr[3] = columnArr[4];//under user code
                dr[4] = columnArr[3];//under user name
                dr[5] = columnArr[1];//user name
                dr[6] = columnArr[2];//password
                dr[7] = columnArr[5];// region code
                // dr[8] = columnArr[5];//division code
                dr[8] = columnArr[6];//hidoctor start date
                // dr[9] = columnArr[7];//expense group id
                if (columnArr[7] == "")
                {
                    dr[9] = "0";
                }
                else
                {
                    dr[9] = columnArr[7];//expense group id
                }
                dr[10] = guid.ToString();
                dr[11] = Convert.ToInt32(i) + 1;
                dr[12] = "PROCESSING";
                dt.Rows.Add(dr);
            }
            return dt;
        }
        /// <summary>
        /// Converts the Excel file to DataTable.
        /// </summary>
        /// <param name="postedFile"></param>
        /// <returns></returns>
        private DataTable ConvertExcelToDataTable(System.Web.HttpPostedFileBase postedFile)
        {
            System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
            DataTable dt = new DataTable();
            CurrentInfo objCurInfo = new CurrentInfo();
            string containerName = objCurInfo.GetCompanyCode().ToLower();

            IFileProvider fileProvider = new FileSystemProvider();
            IExcelFactory excelFactory = new ExcelFactory();

            string fileName = postedFile.FileName;
            string[] excelRetrieveColumns = new string[] { "*" };

            _userExcelTemplateFileName = fileProvider.GetFilePathToSave(UPLOAD_PATH_KEY_NAME, fileName);
            DataControl.Repository.AzureBlobUpload objAzureUpload = new Repository.AzureBlobUpload();
            DataControl.Abstraction.IFileProvider objPathProv = new DataControl.Impl.FileSystemProvider();

            string accKey = objPathProv.GetConfigValue("UPLOADEDFILEBLOBACCKEY");

            string blobURL = objAzureUpload.PutAzureBlobStorage(postedFile.InputStream, postedFile.FileName, accKey, containerName);

            System.IO.Stream stream = objAzureUpload.AzureblockDownload(postedFile.FileName, accKey, containerName);

            dt = objAzureUpload.ConvertStreamToDataTable(stream, "Employee_Name");
            return dt;
        }

        public string InsertUserExcelBulkUpload(string companyCode, string guid, System.Web.HttpPostedFileBase postedFile, string uploadedBy, string subDomain)
        {
            string result = "";
            try
            {
                DataTable dt = ConvertExcelToDataTable(postedFile);

                if (dt == null)
                {
                    result = "ERROR:NO DATA FOUND IN THE EXCEL SHEET";
                }
                else
                {
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        dt.Rows[i]["User_Name"] = dt.Rows[i]["User_Name"].ToString().ToUpper().Trim();
                        dt.AcceptChanges();
                    }
                    List<MVCModels.HiDoctor_Master.UserModel> lstAllUsers = new List<MVCModels.HiDoctor_Master.UserModel>();
                    lstAllUsers = _dalUser.GetUsers(companyCode);
                    string errorResult = String.Empty;
                    //UNSER USER VALIDATION
                    dt.Columns.Add("Company_Code", typeof(String));
                    dt.Columns.Add("GUID", typeof(String));
                    dt.Columns.Add("Status", typeof(String));
                    List<MVCModels.HiDoctor_Master.UserModel> lstUnderUsers = new List<MVCModels.HiDoctor_Master.UserModel>();

                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        MVCModels.HiDoctor_Master.UserModel objUserModel = new MVCModels.HiDoctor_Master.UserModel();
                        if (!string.IsNullOrEmpty(dt.Rows[i]["Reporting_Manager_Name"].ToString()))
                        {
                            List<MVCModels.HiDoctor_Master.UserModel> lstTemp =
                                 lstAllUsers.FindAll(p => p.User_Name.ToString().ToUpper().Equals(dt.Rows[i]["Reporting_Manager_Name"].ToString().ToUpper()));
                            if (lstTemp.Count > 0)
                            {
                                objUserModel.User_Name = dt.Rows[i]["User_Name"].ToString().ToUpper().Trim();
                                lstUnderUsers.Add(objUserModel);
                            }
                            else
                            {
                                lstTemp =
                                lstUnderUsers.FindAll(p => p.User_Name.ToString().ToUpper().Equals(dt.Rows[i]["Reporting_Manager_Name"].ToString().ToUpper()));
                                if (lstTemp.Count == 0)
                                {
                                    errorResult = "ERROR:Please validate the Reporting Manager Name - " + dt.Rows[i]["Reporting_Manager_Name"].ToString().ToUpper();
                                    break;
                                }
                                else
                                {
                                    objUserModel.User_Name = dt.Rows[i]["User_Name"].ToString().ToUpper().Trim();
                                    lstUnderUsers.Add(objUserModel);
                                }
                                string userTypeName = dt.Rows[i]["User_Type_Name"].ToString();
                                if (userTypeName.Length > 30)
                                {
                                    errorResult = "ERROR:User Type Name can only have a maximum of 30 characters.";
                                    break;
                                }
                                string regionName = dt.Rows[i]["Region_Name"].ToString();
                                if (regionName.Length > 30)
                                {
                                    errorResult = "Error:Region Name can only have a maximum of 30 characters.";
                                    break;
                                }
                            }
                            string password = dt.Rows[i]["User_Pass"].ToString();
                            string[] words = { "#", "$", "%", "^", "&", "(", ")", "{", "+", "=", "[", "}", "]", "?", ">", "<", ",", ".", ";", ":", "/", "|" };
                            foreach (var arr in words)
                            {
                                if (password.Contains(arr))
                                {
                                    errorResult = "ERROR:Special characters like !@*_- are only allowed.";
                                    break;
                                }
                            }
                            if (password.Length >= 31)
                            {
                                errorResult = "ERROR: Please enter a maximum of 30 characters in password.- " + dt.Rows[i]["User_Pass"].ToString().ToUpper();
                                break;
                            }
                            if (password.Length < 5)
                            {
                                errorResult = "ERROR: Please enter minimum 6 characters in password.- " + dt.Rows[i]["User_Pass"].ToString().ToUpper();
                                break;
                            }
                        }
                        dt.Rows[i]["Company_Code"] = companyCode;
                        dt.Rows[i]["GUID"] = guid.ToString();
                        dt.Rows[i]["Status"] = "PROCESSING";
                    }
                    if (string.IsNullOrEmpty(errorResult))
                    {
                        result = _dalUser.ExcelBulkUserInsert(companyCode, dt, subDomain);
                        if (result == "SUCCESS")
                        {
                            result = _dalUser.InsertExcelBulkUserStagingToMaster(companyCode, guid, _userExcelTemplateFileName, uploadedBy, "USER_UPLOAD", subDomain);
                        }
                        else
                        {
                            result = "ERROR:Instructions are not followed.User Bulk insert failed." + result;
                        }
                    }
                    else
                    {
                        result = errorResult;
                    }
                }
            }
            catch (Exception ex)
            {
                result = "ERROR:Instructions are not followed." + ex.Message;
            }
            return result;
        }
        public List<MVCModels.HiDoctor_Master.UserModel> GetChildUsers(string companyCode, string userCode)
        {
            return _dalUser.GetChildUsers(companyCode, userCode);
        }
        public List<MVCModels.HiDoctor_Master.UserModel> GetExpenseChildUsers(string companyCode, string userCode)
        {
            return _dalUser.GetExpenseChildUsers(companyCode, userCode);
        }
        public List<MVCModels.HiDoctor_Master.UserModel> GetChildUsersCodeAndNameOnly(string companyCode, string userCode)
        {
            return _dalUser.GetChildUsersCodeAndNameOnly(companyCode, userCode);
        }
        public DataSet GetAllUsersForMigration(string companyCode)
        {
            DataSet ds = new DataSet();
            ds = _dalUser.GetAllUsersForMigration(companyCode);
            return ds;
        }
        public DataSet GetAllUsersForMigrationNew(string companyCode)
        {
            DataSet ds = new DataSet();
            ds = _dalUser.GetAllUsersForMigrationNew(companyCode);
            return ds;
        }
        public DataSet GetUserHierarchyDataset(string companyCode, string strUserCode, string enteredBy, string Guid)
        {
            DataSet ds = new DataSet();
            ds = _dalUser.GetUserHierarchyDataset(companyCode, strUserCode, enteredBy, Guid);
            return ds;
        }
        public string BulkUserTempInsert(string companyCode, DataTable dt, string mode)
        {
            return _dalUser.BulkUserTempInsert(companyCode, dt, mode);
        }
        public string UpdateUserIndexFromTemptoUserMaster(string companyCode, string mode, string guid, string userCode)
        {
            string result = _dalUser.UpdateUserIndexFromTemptoUserMaster(companyCode, mode, guid, userCode);
            if ("SUCCESS" == result.Split(':')[0])
            {
                result = _dalUser.DeleteUserMasterTemp(companyCode, guid, userCode);
            }
            return result;
        }
        public List<MVCModels.HiDoctor_Master.UserModel> GetChildUsersByRegion(string companyCode, string regionCode)
        {
            return _dalUser.GetChildUsersByRegion(companyCode, regionCode);
        }
        public string UpdateUserStatus(string companyCode, string userCode, string updatedBy, string resignationDate)
        {
            return _dalUser.UpdateUserStatus(companyCode, userCode, updatedBy, resignationDate);
        }
        public IEnumerable<MVCModels.DCRDATE> GetDCRdate(string UserCode)
        {
            return _dalUser.GetDCRdate(UserCode);
        }

        public DataTable UserHierarchyDataTable(string companyCode, string childUsers, string parentIndex,
                                    string parentId, string guid, string userCode, string parentUserCode)
        {
            string[] arOriUsers = childUsers.Split('^');
            DataTable dt = new DataTable();
            dt.Columns.Add("Company_Code", typeof(String));
            dt.Columns.Add("User_Code", typeof(String));
            dt.Columns.Add("User_Id", typeof(String));
            dt.Columns.Add("Under_User_Id", typeof(String));
            dt.Columns.Add("Seq_Index", typeof(String));
            dt.Columns.Add("Full_Index", typeof(String));
            dt.Columns.Add("GUID", typeof(String));
            dt.Columns.Add("Created_By", typeof(String));
            dt.Columns.Add("Under_User_Code", typeof(String));
            for (int i = 0; i < arOriUsers.Length - 1; i++)
            {
                DataRow dr = dt.NewRow();
                dr[0] = companyCode;
                dr[1] = arOriUsers[i].Split('_')[0];
                dr[2] = arOriUsers[i].Split('_')[1].Split('|')[0];
                dr[3] = parentId;
                dr[4] = arOriUsers[i].Split('|')[1];
                dr[5] = parentIndex + arOriUsers[i].Split('_')[1].Split('|')[0] + ".";
                dr[6] = guid;
                dr[7] = userCode;
                dr[8] = parentUserCode;
                dt.Rows.Add(dr);
            }
            return dt;
        }

        public string ChangeUserHierarchy(string companyCode, string originalChildUsers, string proposedChildUsers, string originalParentIndex,
         string proposedParentIndex, string originalParentId, string proposedParentId, string guid, string userCode,
            string originalParentUserCode, string proposedParentUserCode)
        {
            string result = "";
            DataTable dtOriginal = UserHierarchyDataTable(companyCode, originalChildUsers, originalParentIndex,
                                     originalParentId, guid, userCode, originalParentUserCode);
            if (dtOriginal != null)
            {
                if (dtOriginal.Rows.Count > 0)
                {
                    result = _dalUser.BulkUserHierarchyTemp(companyCode, dtOriginal, userCode);
                    if ("SUCCESS" == result)
                    {
                        result = _dalUser.UpdateUserHierarchyFromTemptoUserMaster(companyCode, guid, userCode);
                        if ("SUCCESS" == result)
                        {
                            result = _dalUser.DeleteUserMasterTemp(companyCode, guid, userCode);
                        }
                    }
                }
            }

            //Proposed child users
            DataTable dtProposed = new DataTable();
            dtProposed = UserHierarchyDataTable(companyCode, proposedChildUsers,
                         proposedParentIndex, proposedParentId, guid, userCode, proposedParentUserCode);
            if (dtProposed != null)
            {
                if (dtProposed.Rows.Count > 0)
                {
                    result = _dalUser.BulkUserHierarchyTemp(companyCode, dtProposed, userCode);
                    if ("SUCCESS" == result)
                    {
                        result = _dalUser.UpdateUserHierarchyFromTemptoUserMaster(companyCode, guid, userCode);
                        if ("SUCCESS" == result)
                        {
                            result = _dalUser.DeleteUserMasterTemp(companyCode, guid, userCode);
                        }
                    }
                }
            }
            return result;
        }

        private DataTable ConvertEmployeeExcelToDataTable(System.Web.HttpPostedFileBase postedFile)
        {
            System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
            IFileProvider fileProvider = new FileSystemProvider();
            IExcelFactory excelFactory = new ExcelFactory();
            CurrentInfo objCurInfo = new CurrentInfo();
            string containerName = objCurInfo.GetCompanyCode().ToLower();
            string fileName = postedFile.FileName;
            string[] excelRetrieveColumns = new string[] { "*" };

            _employeeExcelTemplateFileName = fileProvider.GetFilePathToSave(UPLOAD_PATH_KEY_NAME, fileName);
            string whereQuery = " LEN(Employee_Name) >0 ";
            //  postedFile.SaveAs(_employeeExcelTemplateFileName);

            DataControl.Repository.AzureBlobUpload objAzureUpload = new Repository.AzureBlobUpload();
            DataControl.Abstraction.IFileProvider objPathProv = new DataControl.Impl.FileSystemProvider();

            string accKey = objPathProv.GetConfigValue("UPLOADEDFILEBLOBACCKEY");

            string blobURL = objAzureUpload.PutAzureBlobStorage(postedFile.InputStream, postedFile.FileName, accKey, containerName);

            System.IO.Stream stream = objAzureUpload.AzureblockDownload(postedFile.FileName, accKey, containerName);
            DataTable dt = new DataTable();
            var package = new ExcelPackage(postedFile.InputStream);
            dt = package.ToDataTable();
            return dt;
        }

        public string InsertEmployeeExcelBulkUpload(string subDomain, string companyCode, string Regioncode, string guid, System.Web.HttpPostedFileBase postedFile, string uploadedBy)
        {
            string result = "";
            try
            {
                DataTable dt = ConvertEmployeeExcelToDataTable(postedFile);
                if (dt == null)
                {
                    result = "ERROR:NO DATA found in the uploaded excel file";
                }
                else if (dt.Rows.Count == 0)
                {
                    result = "ERROR:NO DATA found in the uploaded excel file";
                }
                else
                {
                    dt.Columns.Add("Company_Code", typeof(String));
                    dt.Columns.Add("Region_Code", typeof(String));
                    dt.Columns.Add("GUID", typeof(String));
                    dt.Columns.Add("Status", typeof(String));
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        dt.Rows[i]["Company_Code"] = companyCode;
                        dt.Rows[i]["Region_Code"] = Regioncode;
                        dt.Rows[i]["GUID"] = guid.ToString();
                        dt.Rows[i]["Status"] = "PROCESSING";
                    }
                    result = _dalUser.ExcelBulkEmployeeInsert(companyCode, dt);
                    if (result == "SUCCESS")
                    {
                        result = _dalUser.InsertExcelBulkEmployeeStagingToMaster(subDomain, companyCode, Regioncode, guid, _employeeExcelTemplateFileName, uploadedBy, "EMPLOYEE_UPLOAD");
                    }
                    else
                    {
                        result = "ERROR:Instructions are not followed." + result;
                    }
                }
            }
            catch (Exception ex)
            {
                result = "ERROR:Instructions not followed." + ex.Message;
            }
            return result;
        }

        public List<MVCModels.HiDoctor_Master.UserModel> GetUserDetails(string companyCode, string userCode)
        {
            return _dalUser.GetUserDetails(companyCode, userCode);
        }
        public string UpdateUserMaster(string CompanyCode, string UserCode, string EmployeeCode, string UserTypeCode, string UnderUserCode,
                string UserName, string UserPass, string UserStatus, string RegionCode,
                 string ExpenseGroupId, string HiDOCTORStartDate, string updatedBy)
        {
            return _dalUser.UpdateUserMaster(CompanyCode, UserCode, EmployeeCode, UserTypeCode, UnderUserCode,
                 UserName, UserPass, UserStatus, RegionCode,
                 ExpenseGroupId, HiDOCTORStartDate, updatedBy);
        }
        public List<MVCModels.HiDoctor_Master.UserModel> GetImmediateChildUsers(string companyCode, string userCode)
        {
            return _dalUser.GetImmediateChildUsers(companyCode, userCode);
        }
        public List<MVCModels.HiDoctor_Master.UserModel> GetAllStatusUsers(string companyCode)
        {
            return _dalUser.GetAllStatusUsers(companyCode);
        }
        public DataTable GetExpenseGroupMandatory(string Company_Code, string User_Code, string Region_Code, string User_Type_Code)
        {
            return _dalUser.GetExpenseGroupMandatory(Company_Code, User_Code, Region_Code, User_Type_Code);
        }
        public List<MVCModels.HiDoctor_Master.EmployeeModel> GetEmployees(string companyCode)
        {
            return _dalUser.GetEmployees(companyCode);
        }
        public string VacancyHeaderMigration(string companyCode, string userCode)
        {
            string result = String.Empty;
            result = _dalUser.VacancyHeaderMigration(companyCode, userCode);
            if ("SUCCESS" == result)
            {
                DataTable dtResult = new DataTable();
                DataSet dsVacantHeader = new DataSet();

                dtResult.Columns.Add("Company_Code", typeof(string));
                dtResult.Columns.Add("Vacancy_Id", typeof(int));
                dtResult.Columns.Add("User_Code", typeof(string));
                dtResult.Columns.Add("Vacant_From_Date", typeof(DateTime));
                dtResult.Columns.Add("Vacancy_Details_Id", typeof(Int32));
                dtResult.Columns.Add("Updated_by", typeof(string));
                DataRow dr;
                DataSet dsRegUsers = new DataSet();
                dsVacantHeader = _dalUser.GetVacanyHeader(companyCode);
                if (dsVacantHeader.Tables[0].Rows.Count > 0)
                {
                    for (int i = 0; i < dsVacantHeader.Tables[0].Rows.Count; i++)
                    {
                        string regionCode = dsVacantHeader.Tables[0].Rows[i]["Region_Code"].ToString();
                        dsRegUsers = _dalUser.GetUsersByRegionForVacancyMigration(companyCode, regionCode);
                        dsRegUsers.Tables[0].DefaultView.Sort = "User_Code desc";
                        if (dsRegUsers.Tables[0].Rows.Count > 0)
                        {
                            dr = dtResult.NewRow();
                            DataSet dsWOTDummy = new DataSet();
                            DataRow[] drWOTDummy;
                            DataRow[] drDummy;
                            drWOTDummy = dsRegUsers.Tables[0].Select("User_Name not like 'DUMMY%'");
                            if (drWOTDummy.Length > 0)
                            {
                                if (drWOTDummy[0]["Effective_To"].ToString() == System.DBNull.Value.ToString())
                                {
                                    drDummy = dsRegUsers.Tables[0].Select("User_Name like 'DUMMY%'");
                                    if (drDummy.Length > 0)
                                    {
                                        dr[0] = companyCode;
                                        dr[1] = dsVacantHeader.Tables[0].Rows[i]["Vacancy_Id"].ToString();
                                        dr[2] = drDummy[0]["User_Code"].ToString();
                                        dr[3] = drDummy[0]["Created_Date"].ToString();
                                        dr[4] = 1;
                                        dr[5] = userCode;
                                    }
                                }
                                else
                                {
                                    dr[0] = companyCode;
                                    dr[1] = dsVacantHeader.Tables[0].Rows[i]["Vacancy_Id"].ToString();
                                    dr[2] = drWOTDummy[0]["User_Code"].ToString();
                                    dr[3] = drWOTDummy[0]["Effective_To"].ToString();
                                    dr[4] = 1;
                                    dr[5] = userCode;
                                }
                            }
                            else
                            {
                                dr[0] = companyCode;
                                dr[1] = dsVacantHeader.Tables[0].Rows[i]["Vacancy_Id"].ToString();
                                dr[2] = null;
                                dr[3] = dsVacantHeader.Tables[0].Rows[i]["Effective_From"].ToString();
                                dr[4] = 1;
                                dr[5] = userCode;
                            }
                        }
                        else
                        {
                            dr = dtResult.NewRow();
                            dr[0] = companyCode;
                            dr[1] = dsVacantHeader.Tables[0].Rows[i]["Vacancy_Id"].ToString();
                            dr[2] = null;
                            dr[3] = dsVacantHeader.Tables[0].Rows[i]["Effective_From"].ToString();
                            dr[4] = 1;
                            dr[5] = userCode;
                        }
                        dtResult.Rows.Add(dr);
                        dtResult.AcceptChanges();
                    }
                    result = _dalUser.VacancyDetailsBulkInsertion(companyCode, dtResult, userCode);
                }
            }
            return result;
        }
        public List<MVCModels.HiDoctor_Master.UserModel> GetChildUsersOrderByUserName(string companyCode, string userCode)
        {
            DataControl.DALUser _dalUser = new DALUser();
            return _dalUser.GetChildUsersOrderByUserName(companyCode, userCode);
        }
        public string GetAccountlock(string userCode)
        {
            string result = "";
            DataControl.DALUser _dalUser = new DALUser();
            result = _dalUser.GetAccountlock(userCode);
            return result;
        }
        public bool GetLockRelease(string companyCode, string userCode, string userName, string date, string mode)
        {
            DataControl.DALUser _dalUser = new DALUser();
            bool result = _dalUser.GetLockRelease(companyCode, userCode, userName, date, mode);
            return result;
        }
        public DataSet checkEmailid(string companyCode, string userCode)
        {
            DataSet ds = new DataSet();
            ds = _dalUser.checkEmailid(companyCode, userCode);
            return ds;
        }
        //overloaded function for asynchronous function
        public DataSet checkEmailid(string companyCode, string userCode, string ConnectionString)
        {
            DataSet ds = new DataSet();
            ds = _dalUser.checkEmailid(companyCode, userCode, ConnectionString);
            return ds;
        }
        public DataSet Getempinfo(string companyCode, string userName)
        {
            DataSet ds = new DataSet();
            ds = _dalUser.Getempinfo(companyCode, userName);
            return ds;
        }
        //get usertype//
        public DataSet GetUserTypetreedetail(string companyCode)
        {
            DataSet ds = new DataSet();
            ds = _dalUser.GetUserTypetreedetail(companyCode);
            return ds;
        }
        //get activity
        public DataSet GetActivitydetail(string companyCode)
        {
            DataSet ds = new DataSet();
            ds = _dalUser.GetActivitydetail(companyCode);
            return ds;
        }
        //GetUserTypeActivityMapdata
        public List<ActivityMappedDataModel> GetUserTypeActivityMapdata(string companyCode)
        {
            try
            {
                return _dalUser.GetUserTypeActivityMapdata(companyCode);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        ///get mapped activity//
        public bool getActivityMapped(string companyCode, string userTypeCode, string activityCodes)
        {
            int count = _dalUser.getActivityMapped(companyCode, userTypeCode, activityCodes);
            if (count > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        public bool checkActivityAlreadMapped(List<ValidationActivityDataListModel> lst)
        {
            int count = _dalUser.checkActivityAlreadMapped(lst);
            if (count > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public int activityInsert(string companyCode, string mapCode, string userTypeCode, string activityCode, string startDate, string endDate, int Sfc_Mandatory)
        {
            try
            {
                int activityInsert = _dalUser.activityInsert(companyCode, mapCode, userTypeCode, activityCode, startDate, endDate, Sfc_Mandatory);
                return activityInsert;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public int DeleteMappedActivity(string companyCode, string activityCode)
        {
            try
            {
                int activityInsert = _dalUser.DeleteMappedActivity(companyCode, activityCode);
                return activityInsert;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        //edit
        public bool GetActivityMappedForEdit(string companyCode, string userTypeCode, string activityCodes, string mapCode)
        {
            int count = _dalUser.GetActivityMappedForEdit(companyCode, userTypeCode, activityCodes, mapCode);
            if (count > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        //updateUserTypeActivityMap
        public int updateUserTypeActivityMap(string companyCode, string userTypeCode, string activityCode, string startDate, string endDate, string mapCode, int SFC_Mandatory)
        {
            try
            {
                int activityedit = _dalUser.updateUserTypeActivityMap(companyCode, userTypeCode, activityCode, startDate, endDate, mapCode, SFC_Mandatory);
                return activityedit;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public DataSet GetUserFullTreeDetails(string companyCode)
        {
            return _dalUser.GetUserFullTreeDetails(companyCode);
        }
        public DataSet GetPassword(string companyCode, string userCode)
        {
            try
            {
                DataSet Getpwd = _dalUser.GetPassword(companyCode, userCode);
                return Getpwd;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public DataSet GetUserFullTreeDetailsNew(string companyCode)
        {
            return _dalUser.GetUserFullTreeDetailsNew(companyCode);
        }

        public IEnumerable<MVCModels.PasswordHistory> GetPasswordHistory(string companyCode, string userCode, string historyCount)
        {
            return _dalUser.GetPasswordHistory(companyCode, userCode, historyCount);
        }
        public string UpdatePasswordReset(string companyCode, string usercode, string newPassWord)
        {
            try
            {
                string result = _dalUser.UpdatePasswordReset(companyCode, usercode, newPassWord);
                return result;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetUsersByUserType(string companyCode, string userTypeCode)
        {
            return _dalUser.GetUsersByUserType(companyCode, userTypeCode);
        }
        public IEnumerable<MVCModels.HiDoctor_Master.EmployeeModel> GetAllEmployeeDetails(string companyCode, string userCode)
        {
            return _dalUser.GetAllEmployeeDetails(companyCode, userCode);
        }
        public IEnumerable<MVCModels.HiDoctor_Master.EmployeeModel> GetAllEmployeeInactiveDetails(string companyCode, string userCode)
        {
            return _dalUser.GetAllEmployeeInactiveDetails(companyCode, userCode);
        }
        public string DeleteEmployee(string companyCode, string employeeCode, string userCode, string updatedBy, string updatedDate, string resignationDate)
        {

            return _dalUser.DeleteEmployee(companyCode, employeeCode, userCode, updatedBy, updatedDate, resignationDate);
        }

        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetDisabledUsers(string companyCode)
        {
            return _dalUser.GetDisabledUsers(companyCode);
        }
        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetSingleUserInfo(string companyCode, string userCode, string regionCode)
        {
            return _dalUser.GetSingleUserInfo(companyCode, userCode, regionCode);
        }
        //For async report, passing the connection string
        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetSingleUserInfo(string companyCode, string userCode, string regionCode, string ConnectionString)
        {
            return _dalUser.GetSingleUserInfo(companyCode, userCode, regionCode, ConnectionString);
        }
        public string GetReportHeaderTableString(string companyCode, string userCode, string startDate, string endDate, string statusName, string regionCode)
        {
            StringBuilder strTblContent = new StringBuilder();
            try
            {
                IEnumerable<MVCModels.HiDoctor_Master.UserModel> lstUser = null;
                lstUser = GetSingleUserInfo(companyCode, userCode, regionCode);
                List<MVCModels.HiDoctor_Master.UserModel> lstUserInfo = (List<MVCModels.HiDoctor_Master.UserModel>)lstUser;
                if (lstUser != null)
                {
                    strTblContent.Append("<table cellspacing='0' cellpadding='0' width='100%' id='tblUserDetails' class='table' >");
                    strTblContent.Append("<thead><tr>");
                    strTblContent.Append("<th colspan='4'>User Details</th>");
                    strTblContent.Append("</tr></thead>");
                    strTblContent.Append("<tbody>");
                    strTblContent.Append("<tr>");
                    strTblContent.Append("<td>User Name :</td>");
                    strTblContent.Append("<td>" + lstUserInfo[0].User_Name + "</td>");
                    strTblContent.Append("<td>Designation :</td>");
                    strTblContent.Append("<td>" + lstUserInfo[0].User_Type_Name + "</td>");
                    strTblContent.Append("</tr>");

                    strTblContent.Append("<tr>");
                    strTblContent.Append("<td>Employee Name :</td>");
                    strTblContent.Append("<td><b>" + lstUserInfo[0].Employee_Name + "</b></td>");
                    strTblContent.Append("<td>Employee Number :</td>");
                    strTblContent.Append("<td><b>" + lstUserInfo[0].Employee_Number + "</b></td>");
                    strTblContent.Append("</tr>");

                    strTblContent.Append("<tr>");
                    strTblContent.Append("<td>Reporting HQ :</td>");
                    strTblContent.Append("<td>" + lstUserInfo[0].Reporting_Manager_Region_Name + "</td>");
                    strTblContent.Append("<td>Reporting Manager :</td>");
                    strTblContent.Append("<td>" + lstUserInfo[0].Reporting_Manager_Name + "</td>");
                    strTblContent.Append("</tr>");


                    strTblContent.Append("<tr>");
                    strTblContent.Append("<td>Territory Name :</td>");
                    strTblContent.Append("<td>" + lstUserInfo[0].Region_Name + "</td>");
                    strTblContent.Append("<td>Division :</td>");
                    strTblContent.Append("<td>" + lstUserInfo[0].Division_Name + "</td>");
                    strTblContent.Append("</tr>");
                    strTblContent.Append("<tr>");
                    strTblContent.Append("<td>Mobile number :</td>");
                    strTblContent.Append("<td>" + lstUserInfo[0].User_Mobile_Number + "</td>");
                    strTblContent.Append("<td>Date of joining :</td>");
                    strTblContent.Append("<td>" + lstUserInfo[0].User_Date_of_joining + "</td>");
                    strTblContent.Append("</tr>");
                    strTblContent.Append("<tr>");
                    if (!string.IsNullOrEmpty(endDate))
                    {
                        strTblContent.Append("<td>Period :</td>");
                        strTblContent.Append("<td>" + startDate + " - " + endDate + "</td>");
                    }
                    else
                    {
                        strTblContent.Append("<td>Period :</td>");
                        strTblContent.Append("<td>" + startDate + "</td>");
                    }
                    if (!string.IsNullOrEmpty(statusName))
                    {
                        strTblContent.Append("<td>Selected Status :</td>");
                        strTblContent.Append("<td>" + statusName + "</td>");
                    }
                    else
                    {
                        strTblContent.Append("<td></td>");
                        strTblContent.Append("<td></td>");
                    }
                    strTblContent.Append("</tr>");
                    strTblContent.Append("</tbody>");
                    strTblContent.Append("</table>");
                }
            }
            catch (Exception ex)
            {

            }
            return strTblContent.ToString();
        }


        public string GetReportHeaderTableString(string companyCode, string userCode, string startDate, string endDate, string statusName, string regionCode, string ConnectionString)
        {
            StringBuilder strTblContent = new StringBuilder();
            try
            {
                IEnumerable<MVCModels.HiDoctor_Master.UserModel> lstUser = null;
                lstUser = GetSingleUserInfo(companyCode, userCode, regionCode, ConnectionString);
                List<MVCModels.HiDoctor_Master.UserModel> lstUserInfo = (List<MVCModels.HiDoctor_Master.UserModel>)lstUser;
                if (lstUser != null)
                {
                    strTblContent.Append("<table cellspacing='0' cellpadding='0' width='100%' id='tblUserDetails' class='table' >");
                    strTblContent.Append("<thead><tr>");
                    strTblContent.Append("<th colspan='4'>User Details</th>");
                    strTblContent.Append("</tr></thead>");
                    strTblContent.Append("<tbody>");
                    strTblContent.Append("<tr>");
                    strTblContent.Append("<td>User Name :</td>");
                    strTblContent.Append("<td>" + lstUserInfo[0].User_Name + "</td>");
                    strTblContent.Append("<td>Designation :</td>");
                    strTblContent.Append("<td>" + lstUserInfo[0].User_Type_Name + "</td>");
                    strTblContent.Append("</tr>");

                    strTblContent.Append("<tr>");
                    strTblContent.Append("<td>Employee Name :</td>");
                    strTblContent.Append("<td><b>" + lstUserInfo[0].Employee_Name + "</b></td>");
                    strTblContent.Append("<td>Employee Number :</td>");
                    strTblContent.Append("<td><b>" + lstUserInfo[0].Employee_Number + "</b></td>");
                    strTblContent.Append("</tr>");

                    strTblContent.Append("<tr>");
                    strTblContent.Append("<td>Reporting HQ :</td>");
                    strTblContent.Append("<td>" + lstUserInfo[0].Reporting_Manager_Region_Name + "</td>");
                    strTblContent.Append("<td>Reporting Manager :</td>");
                    strTblContent.Append("<td>" + lstUserInfo[0].Reporting_Manager_Name + "</td>");
                    strTblContent.Append("</tr>");


                    strTblContent.Append("<tr>");
                    strTblContent.Append("<td>Territory Name :</td>");
                    strTblContent.Append("<td>" + lstUserInfo[0].Region_Name + "</td>");
                    strTblContent.Append("<td>Division :</td>");
                    strTblContent.Append("<td>" + lstUserInfo[0].Division_Name + "</td>");
                    strTblContent.Append("</tr>");
                    strTblContent.Append("<tr>");
                    strTblContent.Append("<td>Mobile number :</td>");
                    strTblContent.Append("<td>" + lstUserInfo[0].User_Mobile_Number + "</td>");
                    strTblContent.Append("<td>Date of joining :</td>");
                    strTblContent.Append("<td>" + lstUserInfo[0].User_Date_of_joining + "</td>");
                    strTblContent.Append("</tr>");
                    strTblContent.Append("<tr>");
                    if (!string.IsNullOrEmpty(endDate))
                    {
                        strTblContent.Append("<td>Period :</td>");
                        strTblContent.Append("<td>" + startDate + " - " + endDate + "</td>");
                    }
                    else
                    {
                        strTblContent.Append("<td>Period :</td>");
                        strTblContent.Append("<td>" + startDate + "</td>");
                    }
                    if (!string.IsNullOrEmpty(statusName))
                    {
                        strTblContent.Append("<td>Selected Status :</td>");
                        strTblContent.Append("<td>" + statusName + "</td>");
                    }
                    else
                    {
                        strTblContent.Append("<td></td>");
                        strTblContent.Append("<td></td>");
                    }
                    strTblContent.Append("</tr>");
                    strTblContent.Append("</tbody>");
                    strTblContent.Append("</table>");
                }
            }
            catch (Exception ex)
            {

            }
            return strTblContent.ToString();
        }
        public IEnumerable<MVCModels.HiDoctor_Reports.FullTreeDetailsModel> GetFullUserTreeDetails(string companyCode)
        {
            try
            {
                DALUser _objUser = new DALUser();
                return _objUser.GetFullUserTreeDetails(companyCode);
            }
            catch
            {
                throw;
            }

        }
        public int UpdateEmployeeStatus(string companyCode, string employeeCode, string employeeStatus, string updatedBy, string updatedDate)
        {
            return _dalUser.UpdateEmployeeStatus(companyCode, employeeCode, employeeStatus, updatedBy, updatedDate);
        }
        public string InsertRemarks(string companyCode, string employeeCode, string Remarks, string User_Code, int Status)
        {
            return _dalUser.InsertRemarks(companyCode, employeeCode, Remarks, User_Code, Status);
        }
        public List<MVCModels.HiDoctor_Master.PayslipDataModel> GetpayslipDetail(string companyCode, string month, string year)
        {
            _dalUser = new DALUser(); ;
            return _dalUser.GetpayslipDetail(companyCode, month, year);
        }
        public List<MVCModels.HiDoctor_Master.PaySlipMetaDataModel> GetMetaDataDetails(string companyCode, string empNo)
        {
            _dalUser = new DALUser();
            return _dalUser.GetMetaDataDetails(companyCode, empNo);
        }
        public List<MVCModels.HiDoctor_Master.PaySlipMetaDataModel> GetpaysliprefsheetDetail(string companyCode)
        {
            List<MVCModels.HiDoctor_Master.PaySlipMetaDataModel> lstpayslip = new List<MVCModels.HiDoctor_Master.PaySlipMetaDataModel>();
            _dalUser = new DALUser(); ;
            lstpayslip = _dalUser.GetpaysliprefsheetDetail(companyCode);
            return lstpayslip;
        }
        private DataTable ConvertSFCExcelToDataTable(System.Web.HttpPostedFileBase postedFile, out string result)
        {
            try
            {
                System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
                result = "";
                DataTable dt = new DataTable();
                CurrentInfo objCurInfo = new CurrentInfo();
                string containerName = objCurInfo.GetCompanyCode().ToLower();
                string userCode = objCurInfo.GetUserCode();
                string userName = objCurInfo.GetUserName();
                string companyCode = objCurInfo.GetCompanyCode();

                IFileProvider fileProvider = new FileSystemProvider();
                IExcelFactory excelFactory = new ExcelFactory();
                string fileName = postedFile.FileName;

                string fileexten = fileName.Split('.')[1];

                string[] excelRetrieveColumns = new string[] { "*" };
                _PayslipTemplateFileName = fileProvider.GetFilePathToSave(FILE_UPLOAD_PATH, fileName);
                DataControl.Repository.AzureBlobUpload objAzureUpload = new Repository.AzureBlobUpload();
                DataControl.Abstraction.IFileProvider objPathProv = new DataControl.Impl.FileSystemProvider();
                string accKey = objPathProv.GetConfigValue("UPLOADEDFILEBLOBACCKEY");
                string blobURL = objAzureUpload.PutAzureBlobStorage(postedFile.InputStream, postedFile.FileName, accKey, containerName);
                System.IO.Stream stream = objAzureUpload.AzureblockDownload(postedFile.FileName, accKey, containerName);
                string privilegeValue = "";
                DataControl.SPData objSP = new DataControl.SPData();
                privilegeValue = objSP.GetSinglePrivilegeNameForUser(companyCode, userCode, "PAYSLIP_EMP_NO");
                dt = objAzureUpload.ConvertStreamToDataTablePayslip(stream, privilegeValue, fileexten);
                return dt;
            }
            catch
            {
                throw;
            }
        }
        public string InsertPayslipDataUpload(string companyCode, string guid, System.Web.HttpPostedFileBase postedFile, List<MVCModels.HiDoctor_Master.PayslipDataModel> lstdata, string subDomain, string payslipMonth, string payslipYear)
        {
            string result = "";
            string convertResult = "";
            ArrayList arHeader = new ArrayList();
            DataControl.SPData objSP = new DataControl.SPData();
            DataControl.CurrentInfo objCurInfo = new CurrentInfo();
            string userCode = objCurInfo.GetUserCode();
            string userName = objCurInfo.GetUserName();
            bool Flag = false;
            try
            {
                DataTable dt = ConvertSFCExcelToDataTable(postedFile, out convertResult);
                string EmpNo = dt.Rows[0][0].ToString();
                DataControl.BLUser objBlUser = new BLUser();

                //Check Employee active
                bool isEmployeeActive = GetCheckEmployeeStatus(companyCode, EmpNo);
                if (isEmployeeActive)
                {
                    List<MVCModels.HiDoctor_Master.PaySlipMetaDataModel> lstMetadata = new List<MVCModels.HiDoctor_Master.PaySlipMetaDataModel>();
                    lstMetadata = (List<MVCModels.HiDoctor_Master.PaySlipMetaDataModel>)objBlUser.GetMetaDataDetails(companyCode, EmpNo).ToList();

                    if (dt.Columns.Count != lstMetadata.Count)
                    {
                        result = "ERROR:Do not add new (or) Alter (or) Delete colunms in Excel sheet.";
                        return result;
                    }

                    for (int k = 0; k < dt.Columns.Count; k++)
                    {

                        if (dt.Columns[k].ColumnName.ToUpper() == lstMetadata[k].Column_Name.ToUpper())
                        {
                            continue;
                        }
                        else
                        {
                            result = "ERROR:One or more columns are mismatched.";
                            return result;
                        }
                    }
                    if (convertResult == string.Empty)
                    {
                        List<MVCModels.HiDoctor_Master.PayslipEmployeeDetail> lstEmpDetail = lstdata[0].lstEmpDetail;
                        List<MVCModels.HiDoctor_Master.PayslipColunmDetail> lstColunmDetail = lstdata[0].lstpayslipColunm;
                        List<MVCModels.HiDoctor_Master.PayslipDetails> lstDetail = lstdata[0].lstPayslipDetail;
                        string privilegeValue = "";
                        privilegeValue = objSP.GetSinglePrivilegeNameForUser(companyCode, userCode, "PAYSLIP_EMP_NO");
                        if (dt.Columns.Count > 0)
                        {
                            foreach (DataColumn col in dt.Columns)
                            {
                                if (col.ColumnName.ToUpper() == privilegeValue.ToUpper())
                                {
                                    Flag = true;
                                    break;
                                }
                                else
                                {
                                    Flag = false;
                                    break;
                                }
                            }
                        }
                        if (dt == null)
                        {
                            result = "ERROR:No payslip details found in the excel sheet";
                        }
                        else if (string.IsNullOrEmpty(privilegeValue))
                        {
                            result = "ERROR:PAYSLIP_EMP_NO privilege mapping is missing for this user type";

                        }
                        else if (dt.Rows.Count == 0)
                        {
                            result = "ERROR:No payslip details found in the excel sheet";
                        }
                        else if (dt.Columns.Count > 100)
                        {
                            result = "ERROR:Payslip excel can not have more than 100 columns";
                        }
                        else if (dt.Columns[privilegeValue] == null)
                        {
                            result = "ERROR:Unable to upload. Employee Number column is missing";
                        }
                        else if (!Flag)
                        {
                            result = "ERROR: " + privilegeValue + " should be the first column";
                        }
                        else
                        {
                            int index = 0;
                            foreach (DataColumn col in dt.Columns)
                            {
                                index++;
                                MVCModels.HiDoctor_Master.PaySlipMetaDataModel IPaySlip = lstMetadata.Where(a => a.Column_Name.ToUpper() == col.ColumnName.ToUpper()).Single();
                                col.ColumnName = "Column" + IPaySlip.Column_No.ToString();
                            }

                            StringBuilder errorResult = new StringBuilder();
                            dt.Columns.Add("Row_NO", typeof(String));
                            dt.Columns.Add("Company_Code", typeof(String));
                            dt.Columns.Add("GUID", typeof(String));
                            dt.Columns.Add("Created_By", typeof(String));
                            dt.Columns.Add("Emp_No", typeof(String));
                            dt.Columns.Add("Payslip_Month", typeof(String));
                            dt.Columns.Add("Payslip_Year", typeof(String));
                            dt.Columns.Add("BP_Status", typeof(String));
                            var k = 1;
                            for (int i = 0; i < dt.Rows.Count; i++)
                            {
                                dt.Rows[i]["Row_NO"] = k++;
                                dt.Rows[i]["Company_Code"] = companyCode;
                                dt.Rows[i]["Payslip_Month"] = payslipMonth;
                                dt.Rows[i]["Payslip_Year"] = payslipYear;
                                dt.Rows[i]["GUID"] = guid;
                                dt.Rows[i]["BP_Status"] = "PROCESSING";
                                dt.Rows[i]["Created_By"] = userName;
                            }
                            if (lstColunmDetail.Count > 0)
                            {
                                foreach (var item in lstColunmDetail)
                                {

                                    arHeader.Add(item.Column_Name);
                                }
                            }
                            if (string.IsNullOrEmpty(errorResult.ToString()))
                            {
                                result = _dalUser.PayslipBulkCopy(companyCode, dt, subDomain);
                                if (result == "SUCCESS")
                                {
                                    result = _dalUser.InsertPayslipUpload(companyCode, guid, _PayslipTemplateFileName, userCode, "PAYSLIP_UPLOAD", subDomain);
                                }
                                else
                                {
                                    result = "ERROR:Instructions are not followed.PAYSLIP Bulk insert failed." + result;
                                }
                            }
                            else
                            {
                                result = errorResult.ToString();
                            }
                        }
                    }
                    else
                    {
                        result = "ERROR:" + convertResult;
                    }
                }
                else
                {
                    result = "ERROR:Please Enter Active Employee Number in first row of Excel Sheet";
                    return result;
                }
            }
            catch (Exception ex)
            {
                result = "ERROR:Instructions are not followed." + ex.Message.Replace("DataTable", "Excel");
            }
            return result;
        }
        #region payslip meta data
        public IEnumerable<MVCModels.HiDoctor_Master.PaySlipMetaDataModel> GetPaySlipMetaData(string companyCode,
            string userTypeCode)
        {
            return _dalUser.GetPaySlipMetaData(companyCode, userTypeCode);
        }
        public IEnumerable<MVCModels.HiDoctor_Master.PaySlipColDataTypeModel> GetPaySlipColDataType(string companyCode)
        {
            return _dalUser.GetPaySlipColDataType(companyCode);
        }
        public int UpdatePaySlipMetaData(string companyCode, string paySlipData, string userTypeCode)
        {
            int rowsAffected = 0;
            if (!string.IsNullOrEmpty(paySlipData))
            {
                List<MVCModels.HiDoctor_Master.PaySlipMetaDataModel> lstDetails = (List<MVCModels.HiDoctor_Master.PaySlipMetaDataModel>)
                    JsonConvert.DeserializeObject(paySlipData, typeof(List<MVCModels.HiDoctor_Master.PaySlipMetaDataModel>));

                lstDetails.ForEach(c => { c.Company_Code = companyCode; c.Record_Status = "1"; c.User_Type_Code = userTypeCode; });
                rowsAffected = _dalUser.UpdatePaySlipMetaData(companyCode, lstDetails, userTypeCode);
            }
            return rowsAffected;
        }
        public IEnumerable<MVCModels.HiDoctor_Master.UserTypeModel> GetPaySlipMappedUserTypes(string companyCode)
        {
            return _dalUser.GetPaySlipMappedUserTypes(companyCode);
        }
        public int PaySlipInheritance(string companyCode, string sourceUserTypeCode, List<MVCModels.HiDoctor_Master.UserTypeModel> lstUserTypes)
        {
            return _dalUser.PaySlipInheritance(companyCode, sourceUserTypeCode, lstUserTypes);
        }
        public int ChangePaySlipMetadataStatus(string companyCode, string userTypeCode, string columnNo, string status)
        {
            return _dalUser.ChangePaySlipMetadataStatus(companyCode, userTypeCode, columnNo, status);
        }
        #endregion payslip metadata

        public string PayslipDefinerBulkUpload(string companyCode, string guid, System.Web.HttpPostedFileBase postedFile, string uploadedBy, string subDomain, string userTypeCode)
        {
            string result = string.Empty;
            DataRow[] rowFilter;
            try
            {
                DataSet dsMetaData = new DataSet();
                bool isTrue = false;
                bool blEnd = false;
                DataSet dsPayslip = ConvertPaySlipToDataTable(postedFile);
                dsMetaData = _dalUser.GetColumnNames(companyCode);

                if (dsPayslip.Tables[0].Rows.Count > 0)
                {
                    for (int i = 0; i < dsPayslip.Tables[0].Rows.Count; i++)
                    {
                        if (dsPayslip.Tables[0].Rows[i][0].ToString().Trim() == "*")
                        {
                            blEnd = true;
                            break;
                        }
                    }
                }

                if (dsPayslip.Tables.Count == 0)
                {
                    result = "ERROR:Invalid excel format";
                }

                else if (dsPayslip.Tables[0].Columns.Count > 100)
                {
                    result = "ERROR:Payslip template can not have more than 100 columns";

                }
                else if (!blEnd)
                {
                    result = "ERROR:* should be mentioned to indicate the end of the file";
                }

                else if (dsPayslip.Tables[0].Rows.Count == 0)
                {
                    result = "ERROR:Excel file should contain one row";

                }
                else
                {
                    string[] userTypes = userTypeCode.Split(',');
                    foreach (string userType in userTypes)
                    {
                        rowFilter = dsMetaData.Tables[0].Select("User_Type_Code = '" + userType + "'");

                        if (rowFilter.Length > 0)
                        {
                            rowFilter = dsMetaData.Tables[1].Select("User_Type_Code = '" + userType + "'");

                            result = "ERROR:You have already defined the column names for  '" + rowFilter[0]["User_Type_Name"].ToString() + "'";
                            isTrue = false;
                            break;
                        }
                        else
                        {
                            isTrue = true;
                        }
                    }

                    if (isTrue)
                    {

                        isTrue = InsertMetaData(companyCode, userTypeCode, dsPayslip);

                        if (isTrue)
                        {
                            result = "Save successful";
                        }
                        else
                        {
                            result = "Error on save";
                        }
                    }
                }

            }
            catch (Exception ex)
            {
                result = "ERROR:Instructions are not followed." + ex.Message;
            }
            return result;
        }
        private DataSet ConvertPaySlipToDataTable(System.Web.HttpPostedFileBase postedFile)
        {
            DataSet dsPayslip = new DataSet();
            try
            {
                System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
                CurrentInfo objCurInfo = new CurrentInfo();
                DataControl.Repository.AzureBlobUpload objAzureUpload = new Repository.AzureBlobUpload();
                DataControl.Abstraction.IFileProvider objPathProv = new DataControl.Impl.FileSystemProvider();
                string companyCode = objCurInfo.GetCompanyCode().ToLower();
                string fileName = "Payslip_Template_" + companyCode + ".xls";
                string accKey = objPathProv.GetConfigValue("UPLOADEDFILEBLOBACCKEY");
                string blobURL = objAzureUpload.PutAzureBlobStorage(postedFile.InputStream, postedFile.FileName, accKey, companyCode);
                System.IO.Stream stream = objAzureUpload.AzureblockDownload(postedFile.FileName, accKey, companyCode);
                IExcelDataReader excelReader = ExcelReaderFactory.CreateBinaryReader(stream);
                excelReader.IsFirstRowAsColumnNames = true;
                dsPayslip = excelReader.AsDataSet();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return dsPayslip;
        }

        public bool InsertMetaData(string companyCode, string userTypeCodes, DataSet dsPayslip)
        {
            int i = 0;
            int j = 0;
            string[] userTypes = userTypeCodes.Split(',');
            List<MVCModels.HiDoctor_Master.PaySlipDefinerModel> lstPaySlipDetail = new List<MVCModels.HiDoctor_Master.PaySlipDefinerModel>();
            bool isTrue = false;
            MVCModels.HiDoctor_Master.PaySlipDefinerModel lstDetails;
            foreach (var userType in userTypes)
            {
                for (j = 0; j < 100; j++)
                {
                    lstDetails = new MVCModels.HiDoctor_Master.PaySlipDefinerModel();
                    lstDetails.Company_Code = companyCode;
                    lstDetails.User_Type_Code = userType;
                    lstDetails.User_Code = "ALL";

                    if (j < dsPayslip.Tables[0].Columns.Count)
                    {
                        lstDetails.Column_No = (j + 1).ToString();
                        lstDetails.Column_Name = dsPayslip.Tables[0].Columns[j].ColumnName.Trim();
                        lstDetails.Label_Text = dsPayslip.Tables[0].Columns[j].ColumnName.Trim();
                        lstDetails.Column_Type = "Key_Value";
                        lstDetails.Horizontal_Align = "Left";
                        lstDetails.Vertical_Align = "Top";
                    }
                    else
                    {
                        lstDetails.Column_No = (j + 1).ToString();
                        lstDetails.Column_Name = "";
                        lstDetails.Label_Text = "";
                        lstDetails.Column_Type = "";
                        lstDetails.Horizontal_Align = "";
                        lstDetails.Vertical_Align = "";
                    }

                    lstDetails.Zone_Index = "";
                    lstDetails.Row_Index = ""; ;
                    lstDetails.Column_Index = "";
                    lstDetails.Record_Status = "1";
                    lstPaySlipDetail.Add(lstDetails);
                }
            }
            return isTrue = _dalUser.InsertPaySlipDefiner(companyCode, lstPaySlipDetail);
        }

        #region employee audit report

        public IEnumerable<MVCModels.HiDoctor_Master.EmployeeModel> GetEmployeeAuditReport(string companyCode, string fromDate, string toDate)
        {
            return _dalUser.GetEmployeeAuditReport(companyCode, fromDate, toDate);
        }
        #endregion employee audit report

        public IEnumerable<MVCModels.TourPlannerModel> GetTourPlannerDetails(string companyCode, string userCode, int month, int year)
        {
            try
            {
                return _dalUser.GetTourPlannerDetails(companyCode, userCode, month, year);
            }
            catch (Exception)
            {
                throw;
            }
        }

        #region greytip integration
        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetChildUsersWithPayrollId(string companyCode, string userCode, int pageNumber,
            int pageSize, string searchKey, ref int totalPageCount)
        {
            return _dalUser.GetChildUsersWithPayrollId(companyCode, userCode, pageNumber, pageSize, searchKey, ref totalPageCount);
        }

        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetPayrollUsers(string companyCode)
        {
            return _dalUser.GetPayrollUsers(companyCode);
        }

        public int InsertPayrollMapping(string companyCode, List<MVCModels.HiDoctor_Master.UserModel> lstInsertMenu,
            List<MVCModels.HiDoctor_Master.UserModel> lstUpdateMenu, string updatedDatetime, string updatedBy)
        {
            return _dalUser.InsertPayrollMapping(companyCode, lstInsertMenu, lstUpdateMenu, updatedDatetime, updatedBy);
        }
        #endregion greytip integration
        public IEnumerable<DivisionUserProducts> GetUserBasedOnDivisionAndUserType(string company_Code, string division_Code, string user_Type_Code)
        {
            return _dalUser.GetUserBasedOnDivisionAndUserType(company_Code, division_Code: division_Code, user_Type_Code: user_Type_Code);
        }

        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetUsersByUserName(string companyCode, string userName, string userCode)
        {
            return _dalUser.GetUsersByUserName(companyCode, userName, userCode);
        }

        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetUsersByUserNameNew(string companyCode, string userName, string userCode)
        {
            return _dalUser.GetUsersByUserNameNew(companyCode, userName, userCode);
        }

        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetImmediateChildUserForTree(string companyCode, string userCode)
        {
            return _dalUser.GetImmediateChildUserForTree(companyCode, userCode);
        }

        #region user type master migration
        public DataSet GetAllUserTypesForMigration(string companyCode)
        {
            return _dalUser.GetAllUserTypesForMigration(companyCode);
        }
        public DataSet GetUserTypesHierarchyDataset(string companyCode, string strUserTypeCode, string enteredBy, string Guid)
        {
            return _dalUser.GetUserTypesHierarchyDataset(companyCode, strUserTypeCode, enteredBy, Guid);
        }

        public bool GetEmpNumb(string companyCode, string employeeNUmber)
        {
            bool result = false;
            try
            {
                DALUser objdept = new DALUser();
                result = objdept.GetEmpNumb(companyCode, employeeNUmber);
                return result;
            }
            catch
            {
                throw;
            }
        }

        public bool GetAadhaarNumber(string companyCode, string aadhaarNumber)
        {
            bool result = false;
            try
            {
                DALUser objdept = new DALUser();
                result = objdept.GetAadhaarNumb(companyCode, aadhaarNumber);
                return result;
            }
            catch
            {
                throw;
            }
        }

        public bool GetRefKey_1(string companyCode, string referenceKey)
        {
            bool result = false;
            try
            {
                DALUser objdept = new DALUser();
                result = objdept.GetRefKey_1(companyCode, referenceKey);
                return result;
            }
            catch
            {
                throw;
            }
        }

        public bool GetRefKey_2(string companyCode, string referenceKey)
        {
            bool result = false;
            try
            {
                DALUser objdept = new DALUser();
                result = objdept.GetRefKey_2(companyCode, referenceKey);
                return result;
            }
            catch
            {
                throw;
            }
        }
        public string UserTypeBulkTempInsert(string companyCode, DataTable dt, string mode)
        {
            return _dalUser.UserTypeBulkTempInsert(companyCode, dt, mode);
        }
        public string UpdateUserTypeIndexFromTemptoUserMaster(string companyCode, string mode, string guid, string userCode)
        {
            return _dalUser.UpdateUserTypeIndexFromTemptoUserMaster(companyCode, mode, guid, userCode);
        }
        #endregion user type master migrtaion
        public List<StateModel> GetStateDetails()
        {
            List<StateModel> lststate = new List<StateModel>();
            try
            {
                DALUser objState = new DALUser();
                lststate = objState.GetStateDetails().ToList();
                return lststate;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<StateModel> GetEmpStateDetails()
        {
            List<StateModel> lststate = new List<StateModel>();
            try
            {
                DALUser objState = new DALUser();
                lststate = objState.GetEmpStateDetails().ToList();
                return lststate;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string InsertNewStateDetails(string usercode, string statename)
        {
            return _dalUser.InsertNewStateDetails(usercode, statename);
        }
        public List<CityModel> GetCitiesDetails(int State_ID)
        {
            List<CityModel> lstCity = new List<CityModel>();
            try
            {
                DALUser objCities = new DALUser();
                lstCity = objCities.GetCitiesDetails(State_ID).ToList();
                return lstCity;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<CityModel> GetEmpCitiesDetails(int State_ID)
        {
            List<CityModel> lstCity = new List<CityModel>();
            try
            {
                DALUser objCities = new DALUser();
                lstCity = objCities.GetEmpCitiesDetails(State_ID).ToList();
                return lstCity;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string InsertNewCityDetails(string usercode, string cityname, int state_Id)
        {
            return _dalUser.InsertNewCityDetails(usercode, cityname, state_Id);
        }
        public List<PincodeModel> GetPincodeDetails(int State_ID, int City_Id)
        {
            List<PincodeModel> lstPincodes = new List<PincodeModel>();
            try
            {
                DALUser objPincode = new DALUser();
                lstPincodes = objPincode.GetPincodeDetails(State_ID, City_Id).ToList();
                return lstPincodes;
            }
            catch
            {
                throw;
            }
        }
        public string InsertPincode(string usercode, int Pincode, int state_Id, int cityId)
        {
            string result = string.Empty;
            DALUser objInsPin = new DALUser();
            result = objInsPin.InsertPincode(usercode, Pincode, state_Id, cityId);
            return result;
        }
        public List<DepartmentModel> GetDepartmentDetails()
        {
            List<DepartmentModel> lstdept = new List<DepartmentModel>();
            try
            {
                DALUser objdept = new DALUser();
                lstdept = objdept.GetDepartmentDetails().ToList();
                return lstdept;
            }
            catch
            {
                throw;
            }
        }
        public string InsertNewDept(string usercode, string Department)
        {
            string result = string.Empty;
            DALUser objInsDept = new DALUser();
            result = objInsDept.InsertNewDept(usercode, Department);
            return result;
        }
        public DataSet DownloadSubList(string companyCode)
        {
            DataSet Ds = new DataSet();
            DALUser objdept = new DALUser();
            Ds = objdept.DownloadSubList(companyCode);
            return Ds;
        }
        public DataSet DownloadMasterList(string companyCode)
        {
            DataSet Ds = new DataSet();
            DALUser objdept = new DALUser();
            Ds = objdept.DownloadMasterList(companyCode);
            return Ds;
        }

        public List<PasswordPrivValues> checkPasswordPrivilge(string companyCode, string usertypename)
        {
            return _dalUser.checkPasswordPrivilge(companyCode, usertypename);
        }

        public List<PasswordDetails> checkCurrentPassword(string companyCode, string usercode)
        {
            return _dalUser.checkCurrentPassword(companyCode, usercode);
        }

        public List<PasswordDetails> checkPasswordHistory(string companyCode, string usercode, string historyCount)
        {
            return _dalUser.checkPasswordHistory(companyCode, usercode, historyCount);
        }

        public List<PasswordDetails> GetUnderusercode(string companyCode, string userCode)
        {
            return _dalUser.GetUnderusercode(companyCode, userCode);
        }
        public List<string> GetUsersEmailID(string companyCode, string userCode)
        {
            return _dalUser.GetUserEmailID(companyCode, userCode);
        }
        public bool GetCheckEmployeeStatus(string companyCode, string EmployeeNUmber)
        {
            bool result = false;
            try
            {
                DALUser objdept = new DALUser();
                result = objdept.GetCheckEmployeeStatus(companyCode, EmployeeNUmber);
                return result;
            }
            catch
            {
                throw;
            }
        }

        public List<UserInfo> GetUserDetailsForHDAccess(string LoginUserCode)
        {
            List<UserInfo> lstdept = new List<UserInfo>();
            try
            {
                DALUser objdept = new DALUser();
                lstdept = objdept.GetUserDetailsForHDAccess(LoginUserCode).ToList();
                return lstdept;
            }
            catch
            {
                throw;
            }
        }

        public List<HDAccessDetails> GetHDAccessUsersDetails(string LoginUserCode)
        {
            List<HDAccessDetails> lstdept = new List<HDAccessDetails>();
            try
            {
                DALUser objdept = new DALUser();
                lstdept = objdept.GetHDAccessUsersDetails(LoginUserCode).ToList();
                return lstdept;
            }
            catch
            {
                throw;
            }
        }

        public List<SingleDeviceGUID> GetSingleDeviceEntriesByGuid(string LoginUserCode)
        {
            List<SingleDeviceGUID> lstdept = new List<SingleDeviceGUID>();
            try
            {
                DALUser objdept = new DALUser();
                lstdept = objdept.GetSingleDeviceEntriesByGuid(LoginUserCode).ToList();
                return lstdept;
            }
            catch
            {
                throw;
            }
        }
        public List<BloodGroup> GetBloodgroupName(string Company_code)
        {
            List<BloodGroup> lstdept = new List<BloodGroup>();
            try
            {
                DALUser objbdgrp = new DALUser();
                lstdept = objbdgrp.GetBloodgroupName(Company_code).ToList();
                return lstdept;
            }
            catch
            {
                throw;
            }
        }
    }
}