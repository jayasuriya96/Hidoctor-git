#region Usings
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

using MVCModels.HiDoctor_Master;
using DataControl;
using Dapper;
using MVCModels;
using System.Reflection;
#endregion Usings

namespace DataControl
{
    public class DALUser : DapperRepository
    {
        #region Private Variables
        private Data _objData = new Data();
        private CurrentInfo _objCurInfo = new CurrentInfo();
        private SqlDataReader sqlDataReader;
        #endregion Private Variables

        #region Constant Strings
        const string SP_HDGETBILLINGREPORT = "SP_hdGetBillingReport";
        const string SP_HDINSERTEMPLOYEE = "SP_hdInsertEmployee";
        const string SP_HD_USER_TYPE_SELECT = "SP_hd_User_Type_Select";
        const string SP_HDGETUNASSIGNEDEMPLOYEE = "SP_hdGetUnAssignedEmployee";
        const string SP_HDGETUSERS = "SP_hdGetUsers";
        const string SP_HDGETDIVISIONS = "SP_hdGetDivisions";
        const string SP_HDGETEXPENSEGROUP = "SP_hdGetExpenseGroup";
        const string SP_HD_GET_USER_HEADER_DETAIL = "SP_Hd_Get_User_Header_Detail";
        const string SP_HDINSERTUSERFROMBULKSTAGING = "SP_hdInsertUserFromBulkStaging";
        const string tbl_SFA_User_Master_Staging = "tbl_SFA_User_Master_Staging";
        const string SP_HDGETCHILDUSERDETAILS = "SP_hdGetChildUserDetails";
        const string SP_HDGETALLUSERFORMIGRATION = "SP_hdGetAllUserForMigration";
        const string SP_HDGETALLUSERFORMIGRATION_New = "SP_hdGetAllUserForMigration_New";
        const string SP_HDUPDATEUSERINDEXFROMTEMPTOUSERMASTER = "SP_hdUpdateUserIndexFromTemptoUserMaster";
        const string SP_HDINSERTUSERFROMEXCELSTAGING = "SP_hdInsertUserFromExcelStaging";
        const string SP_HDDELETEUSERMASTERTEMP = "SP_hdDeleteUserMasterTemp";
        const string SP_HDGETCHILDUSERSBYREGION = "SP_hdGetChildUsersByRegion";
        const string SP_HDCHANGEUSERHIERARCHYFROMTEMPTABLE = "SP_hdChangeUserHierarchyFromTempTable";
        const string SP_HDINSERTEMPLOYEEFROMEXCELSTAGING = "SP_hdInsertEmployeeFromExcelStaging";
        const string SP_HDGETSELECTEDUSER = "SP_hdGetSelectedUser";
        const string SP_HDGETIMMEDIATECHILDUSERS = "SP_hdGetImmediateChildUsers";
        const string SP_HDGETALLSTATUSUSERS = "SP_hdGetAllStatusUsers";
        const string SP_HDGETEMPLOYEE = "SP_hdGetEmployee";
        const string SP_HDVACANCYHEADERMIGRATION = "SP_hdVacancyHeaderMigration";
        const string SP_HDGETVACANCYHEADER = "SP_hdGetVacancyHeader";
        const string SP_HDGETUSERSBYREGIONFORVACANCY = "SP_hdGetUsersByRegionForVacancy";
        const string SP_HDGETCHILDUSERDETAILSORDERBYNAME = "SP_hdGetChildUserDetailsOrderbyName";
        const string SP_HDGETACCOUNTLOCK = "Sp_HdGetAccountlock";
        const string SP_HDGETLOCKRELEASE = "SP_hdGetLockRelease";
        const string SP_HDGETLOCKEMPLOYEEDETAIL = "SP_HdGetLockEmployeeDetail";
        const string SP_HDGETEMPLOYEEDETAIL = "SP_HdGetEmployeeDetail";
        const string SP_HDGETUSERTYPES = "SP_hdGetUserTypes";
        const string SP_HDGETGETACTIVITY = "SP_HdGetgetActivity";
        const string SP_HDGETUSERTYPEACTIVITYMAPDETAILS = "SP_hdGetUserTypeActivityMapDetails";
        const string SP_HDGETUSERACTIVITYTYPESAVE = "SP_hdGetUserActivityTypeSave";
        const string SP_HDACTIVITYTYPESAVE = "SP_hdActivityTypeSave";
        const string SP_HDDELETEACTIVITYS = "SP_hdDeleteActivitys";
        const string SP_HDGETACTIVITYMAPPEDFOREDIT = "Sp_HdGetActivityMappedForEdit";
        const string SP_HDGETUPDATEUSERTYPEACTIVITYMAP = "SP_hdgetupdateUserTypeActivityMap";
        const string sp_hdGetPassWord = "sp_hdGetPassWord";
        const string sp_hdUpdateResetPassword = "sp_hdUpdateResetPassword";
        const string SPHDGETPASSWORDHISTORY = "sp_hdGetPasswordHistory";
        const string SP_HDGETUSERFULLTREEDETAILS = "SP_hdGetUserFullTreeDetails";
        const string SP_hdGetUserFullTreeDetails_NEW = "SP_hdGetUserFullTreeDetails_New";
        const string SP_HDGETUSERSBYUSERTYPE = "SP_hdGetUsersByUserType";
        const string SP_HDGETACTIVEEMPLOYEEDETAILS = "SP_hdGetActiveEmployeeDetails";
        const string SP_HDGETINACTIVEEMPLOYEEDETAILS = "SP_hdGetInActiveEmployeeDetails";
        const string SP_HDGETDISABLEDUSERS = "SP_hdGetDisabledUsers";
        const string SP_HDGETSINGLEUSERINFO = "SP_hdGetSingleUserInfo";
        const string SP_HDGETBILLINGREPORT_LOG = "SP_hdGetBillingReport_LOG";
        const string SP_HDGETBILLINGREPORT_DCR = "SP_hdGetBillingReport_DCR";
        const string SP_HDGETPAYSLIPDETAIL = "Sp_HdGetPayslipDetail";
        const string TBL_SFA_PAYSLIP_DETAILS_STAGING = "TBL_SFA_PAYSLIP_DETAILS_STAGING";
        const string SP_HDGETPAYSLIPCOLUMN = "SP_hdGetPaySlipColumn";
        const string SP_HDINSERTPAYSLIPFROMSTAGING = "SP_hdInsertPAYSLIPFromStaging";
        const string SP_HDGETPAYSLIPMETADATA = "SP_hdGetPaySlipMetaData";
        const string SP_HDGETPAYSLIPDATAMAPPEDUSERTYPE = "SP_hdGetPaySlipDataMappedUserType";
        const string SP_HDGETEMPLOYEEAUDITREPORT = "SP_hdGetEmployeeAuditReport";
        const string SP_hdGetTPFullDetails = "SP_hdGetTPFullDetails";
        const string SP_HDGETUSERSBASEDONUSERTYPEANDDIVISION = "SP_HDGetUsersBasedOnUserTypeAndDivision";
        const string SP_HDGETPAYROLLUSERS = "SP_hdGetPayrollUsers";
        const string SP_HDGETCHILDUSERSWITHPAYROLLID = "SP_hdGetChildUsersWithPayrollId";
        const string SP_HD_UM_GETUSERSBYUSERNAMEEMPLOYEENAME = "SP_hd_UM_GetUsersByUserNameEmployeeName";
        const string SP_HD_UM_GETUSERSBYUSERNAME = "SP_hd_UM_GetUsersByUserName";
        const string SP_HD_UM_GETIMMEDIATECHILDUSERS = "SP_hd_UM_GetImmediateChildUsers";
        const string SP_HD_UTM_GETALLUSERTYPESFORMIGRATION = "SP_hd_UTM_GetAlluserTypesForMigration";
        const string SP_HDUPDATEUSERTYPEINDEXFROMTEMPTOMASTER = "SP_hdUpdateUserTypeIndexFromTemptoMaster";
        const string SP_HD_GETUSERADDEXPENSEGROUPMAND = "Sp_hd_GetUserAddExpenseGroupMand"; // Expense Group Mandatory for Add New User 
        const string SP_HDGETCOLUMNDATATTYPEMASTER = "Sp_hdGetColumnDatatTypeMaster";
        const string SP_HDGETPAYSLIPMETTADATAREFSHEETDETAIL = "Sp_HdGetPaySlipMettaDataRefSheetDetail";
        const string SP_HDGETUSERTYPEMETADATA = "Sp_HdGetUserTypeMetaData";
        const string SP_HD_GETSTATEDETAILS = "SP_HD_GetStateDetails";
        const string SP_HD_GETEMPSTATEDETAILS = "SP_HD_GetEmpStateDetails";
        const string SP_HD_INSERTUSERSTATE = "SP_HD_INSERTUSERSTATE";
        const string SP_HD_ADDCITYNAME = "SP_HD_addcityname";
        const string SP_HD_ADDPINCODE = "SP_HD_addpincode";
        const string SP_HD_CITYDETAILS = "SP_HD_CityDetails";
        const string SP_HD_EMPCITYDETAILS = "SP_HD_EmpCityDetails";
        const string SP_HD_GETPINCODE = "SP_HD_getpincode";
        const string SP_HD_GETDEPARTMENTDETAILS = "SP_HD_GetDepartmentDetails";
        const string SP_HD_ADDDEPARTMENTNAME = "SP_HD_addDepartmentName";
        const string GetEmployeeNumber = "SP_hdGetEmployeeNumber";
        const string GetAadhaarNumber = "SP_hdGetAadhaarNumber";
        const string GetReferenceKey_1 = "Sp_hdGetReferenceKey_1";
        const string GetReferenceKey_2 = "Sp_hdGetReferenceKey_2";
        const string Sp_hdGetActiveEmployees = "Sp_hdGetActiveEmployees";
        const string Sp_hdGetInactiveEmployees = "Sp_hdGetInactiveEmployees";
        const string SP_HD_Getstatecitypincodelst = "SP_HD_Getstatecitypincodelst";
        const string SP_HD_GetMasterDatalst = "SP_HD_GetMasterDatalst";
        const string Sp_hd_PassPrivilegeValues = "Sp_hd_PassPrivilegeValues";
        const string sp_hdGetPasswordHistory = "sp_hdGetPasswordHistory";
        const string sp_hdGetUnderusercode = "sp_hdGetUnderusercode";
        const string Sp_hdGetCurrentPassword = "Sp_hdGetCurrentPassword";
        const string SP_HD_GetDCRLastentereddate = "SP_HD_GetDCRLastentereddate";
        const string Sp_HDGetDivisionForLogo = "Sp_HDGetDivisionForLogo";
        const string EXEC = "EXEC";
        const string USP_hdGetCheckEmployeeNumberStatus = "USP_hdGetCheckEmployeeNumberStatus";
        const string SP_HD_GETCHILDUSERDETAILS = "SP_HD_GETCHILDUSERDETAILS";
        const string SP_HD_INSERTRemarks = "SP_HD_INSERTRemarks";
        const string SP_HD_GET_Blood_Group_Names = "SP_HD_GET_Blood_Group_Names";
        const string SP_HD_GET_Users_EmailID = "SP_HD_Get_Users_EmailID";

        DataSet dsUser, dsRegion, dsAllUsers, dsAllUserTypes, dsUserTypes;
        string tCode, sCode;
        #endregion Constant Strings

        public List<MVCModels.HiDoctor_Master.BillingReportModel> GetBillingReport(string companyCode, string fromDate, string toDate, string mode)
        {
            List<MVCModels.HiDoctor_Master.BillingReportModel> lstReport = new List<MVCModels.HiDoctor_Master.BillingReportModel>();
            try
            {
                _objData.OpenConnection();
                if (mode.ToUpper() == "LOG")
                {
                    using (sqlDataReader = _objData.ExecuteReader("" + EXEC + " " + SP_HDGETBILLINGREPORT_LOG + " '" + companyCode + "','"
                                                              + fromDate + "','" + toDate + "'"))
                    {
                        while (sqlDataReader.Read())
                        {
                            MVCModels.HiDoctor_Master.BillingReportModel objReport = new MVCModels.HiDoctor_Master.BillingReportModel();
                            objReport.User_Code = sqlDataReader["User_Code"].ToString();
                            objReport.User_Name = sqlDataReader["User_Name"].ToString();
                            objReport.User_Type_Name = sqlDataReader["User_Type_Name"].ToString();
                            objReport.Region_Name = sqlDataReader["Region_Name"].ToString();
                            objReport.User_Status = sqlDataReader["User_Status"].ToString();
                            objReport.Reporting_Manager = sqlDataReader["Reporting_Manager"].ToString();
                            objReport.Reporting_User_Type_Name = sqlDataReader["Reporting_User_Type_Name"].ToString();
                            objReport.Created_Date = sqlDataReader["Created_Date"].ToString();
                            objReport.Effective_To = sqlDataReader["Effective_To"].ToString();
                            objReport.User_Type_Category = sqlDataReader["User_Type_Category"].ToString();
                            objReport.Division_Name = sqlDataReader["Division_Name"].ToString();
                            objReport.Count = sqlDataReader["COUNT"].ToString();
                            objReport.Resignation_Date = sqlDataReader["Resignation_Date"].ToString();
                            lstReport.Add(objReport);
                        }
                    }
                }
                else
                {
                    using (sqlDataReader = _objData.ExecuteReader("" + EXEC + " " + SP_HDGETBILLINGREPORT_DCR + " '" + companyCode + "','"
                                                              + fromDate + "','" + toDate + "'"))
                    {
                        while (sqlDataReader.Read())
                        {
                            MVCModels.HiDoctor_Master.BillingReportModel objReport = new MVCModels.HiDoctor_Master.BillingReportModel();
                            objReport.User_Code = sqlDataReader["User_Code"].ToString();
                            objReport.User_Name = sqlDataReader["User_Name"].ToString();
                            objReport.User_Type_Name = sqlDataReader["User_Type_Name"].ToString();
                            objReport.Region_Name = sqlDataReader["Region_Name"].ToString();
                            objReport.User_Status = sqlDataReader["User_Status"].ToString();
                            objReport.Reporting_Manager = sqlDataReader["Reporting_Manager"].ToString();
                            objReport.Reporting_User_Type_Name = sqlDataReader["Reporting_User_Type_Name"].ToString();
                            objReport.Created_Date = sqlDataReader["Created_Date"].ToString();
                            objReport.Effective_To = sqlDataReader["Effective_To"].ToString();
                            objReport.User_Type_Category = sqlDataReader["User_Type_Category"].ToString();
                            objReport.Division_Name = sqlDataReader["Division_Name"].ToString();
                            objReport.Count = sqlDataReader["COUNT"].ToString();
                            objReport.Resignation_Date = sqlDataReader["Resignation_Date"].ToString();
                            lstReport.Add(objReport);
                        }
                    }
                }
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstReport;
        }

        public string InsertEmployee(string companyCode, string RegionCode, string EmployeeName, string employeeNumber, string gender, string dateOfBirth, int Department_Id, string EDNProof,
            string salaryProof, string resumeGiven, string resignationSubmitted, string appointed, string dateofJoining, string ProDateofConfirm, string confirmationDate, string PFNumber,
            string PANNumber, string SCBAccountNumber, string ICICIAccountNumber, string address1, string address2, string address3, int State_ID, int City_ID, int Pincode_Id,
            string mobile, string phone, string emailId, string employeeEntityType, string employeeCode, string mode, string createdBy, string aadhaar_No, string Ref_Key1, string Ref_Key2, string Blood_Group, string Employee_Photo)
        {
            SPData _objSPData = new SPData();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HDINSERTEMPLOYEE);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objCurInfo.GetCompanyCode());
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _objCurInfo.GetRegionCode());
                _objSPData.AddParamToSqlCommand(command, "@EmployeeName", ParameterDirection.Input, SqlDbType.VarChar, 50, EmployeeName);
                _objSPData.AddParamToSqlCommand(command, "@EmployeeNumber", ParameterDirection.Input, SqlDbType.VarChar, 30, employeeNumber);
                _objSPData.AddParamToSqlCommand(command, "@Gender", ParameterDirection.Input, SqlDbType.Char, 1, gender);
                _objSPData.AddParamToSqlCommand(command, "@DateOfBirth", ParameterDirection.Input, SqlDbType.VarChar, 15, dateOfBirth);
                _objSPData.AddParamToSqlCommand(command, "@Department_Id", ParameterDirection.Input, SqlDbType.VarChar, 25, Department_Id);
                _objSPData.AddParamToSqlCommand(command, "@EDNProof", ParameterDirection.Input, SqlDbType.Char, 1, EDNProof);
                _objSPData.AddParamToSqlCommand(command, "@SalaryProof", ParameterDirection.Input, SqlDbType.Char, 1, salaryProof);
                _objSPData.AddParamToSqlCommand(command, "@ResumeGiven", ParameterDirection.Input, SqlDbType.Char, 1, resumeGiven);
                _objSPData.AddParamToSqlCommand(command, "@ResignationSubmitted", ParameterDirection.Input, SqlDbType.Char, 1, resignationSubmitted);
                _objSPData.AddParamToSqlCommand(command, "@Appointed", ParameterDirection.Input, SqlDbType.Char, 1, appointed);
                _objSPData.AddParamToSqlCommand(command, "@DateofJoining", ParameterDirection.Input, SqlDbType.VarChar, 15, dateofJoining);
                _objSPData.AddParamToSqlCommand(command, "@ProDateofConfirm", ParameterDirection.Input, SqlDbType.VarChar, 15, ProDateofConfirm);
                _objSPData.AddParamToSqlCommand(command, "@ConfirmationDate", ParameterDirection.Input, SqlDbType.VarChar, 15, confirmationDate);
                _objSPData.AddParamToSqlCommand(command, "@PFNumber", ParameterDirection.Input, SqlDbType.VarChar, 50, PFNumber);
                _objSPData.AddParamToSqlCommand(command, "@PANNumber", ParameterDirection.Input, SqlDbType.VarChar, 20, PANNumber);
                _objSPData.AddParamToSqlCommand(command, "@AadhaarNumber", ParameterDirection.Input, SqlDbType.VarChar, 12, aadhaar_No);
                _objSPData.AddParamToSqlCommand(command, "@RefKey1", ParameterDirection.Input, SqlDbType.VarChar, 50, Ref_Key1);
                _objSPData.AddParamToSqlCommand(command, "@RefKey2", ParameterDirection.Input, SqlDbType.VarChar, 50, Ref_Key2);
                _objSPData.AddParamToSqlCommand(command, "@Blood_Group", ParameterDirection.Input, SqlDbType.VarChar, 30, Blood_Group);
                _objSPData.AddParamToSqlCommand(command, "@Employee_Photo", ParameterDirection.Input, SqlDbType.VarChar, 1000, Employee_Photo);
                _objSPData.AddParamToSqlCommand(command, "@SCBAccountNumber", ParameterDirection.Input, SqlDbType.VarChar, 20, SCBAccountNumber);
                _objSPData.AddParamToSqlCommand(command, "@ICICIAccountNumber", ParameterDirection.Input, SqlDbType.VarChar, 20, ICICIAccountNumber);
                _objSPData.AddParamToSqlCommand(command, "@Address1", ParameterDirection.Input, SqlDbType.VarChar, 300, address1);
                _objSPData.AddParamToSqlCommand(command, "@Address2", ParameterDirection.Input, SqlDbType.VarChar, 300, address2);
                _objSPData.AddParamToSqlCommand(command, "@Address3", ParameterDirection.Input, SqlDbType.VarChar, 300, address3);
                _objSPData.AddParamToSqlCommand(command, "@State_Id", ParameterDirection.Input, SqlDbType.VarChar, 35, State_ID);
                _objSPData.AddParamToSqlCommand(command, "@City_Id", ParameterDirection.Input, SqlDbType.VarChar, 35, City_ID);
                _objSPData.AddParamToSqlCommand(command, "@Pincode_Id", ParameterDirection.Input, SqlDbType.Int, 8, Pincode_Id);
                _objSPData.AddParamToSqlCommand(command, "@Phone", ParameterDirection.Input, SqlDbType.VarChar, 15, phone);
                _objSPData.AddParamToSqlCommand(command, "@Mobile", ParameterDirection.Input, SqlDbType.VarChar, 10, mobile);
                _objSPData.AddParamToSqlCommand(command, "@EmailId", ParameterDirection.Input, SqlDbType.VarChar, 50, emailId);
                _objSPData.AddParamToSqlCommand(command, "@EmployeeEntityType", ParameterDirection.Input, SqlDbType.VarChar, 30, employeeEntityType);
                _objSPData.AddParamToSqlCommand(command, "@EmployeeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, employeeCode);
                _objSPData.AddParamToSqlCommand(command, "@Mode", ParameterDirection.Input, SqlDbType.VarChar, 10, mode);
                _objSPData.AddParamToSqlCommand(command, "@CreatedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, createdBy);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception ex)
            {
                return "FAILURE:";
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public List<MVCModels.HiDoctor_Master.UserTypeModel> GetUserTypes(string companyCode)
        {
            List<MVCModels.HiDoctor_Master.UserTypeModel> lstuserType = new List<MVCModels.HiDoctor_Master.UserTypeModel>();
            try
            {
                _objData.OpenConnection();
                using (sqlDataReader = _objData.ExecuteReader("" + EXEC + "  " + SP_HD_USER_TYPE_SELECT + " '" + companyCode + "'"))
                {
                    while (sqlDataReader.Read())
                    {
                        MVCModels.HiDoctor_Master.UserTypeModel _objUserType = new MVCModels.HiDoctor_Master.UserTypeModel();
                        _objUserType.User_Type_Code = sqlDataReader["User_Type_Code"].ToString();
                        _objUserType.User_Type_Name = sqlDataReader["User_Type_Name"].ToString();
                        _objUserType.User_Type_Status = sqlDataReader["User_Type_Status"].ToString();
                        lstuserType.Add(_objUserType);
                    }
                }
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstuserType;
        }

        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetLogo(string CompanyCode, string UserCode)
        {
            List<MVCModels.HiDoctor_Master.UserModel> lstDivision = new List<MVCModels.HiDoctor_Master.UserModel>();
            SPData _objSPData = new SPData();
            try
            {
                _objData.OpenConnection();
                using (sqlDataReader = _objData.ExecuteReader("" + EXEC + "  " + Sp_HDGetDivisionForLogo + " '" + CompanyCode + "','" + UserCode + "'"))
                {
                    while (sqlDataReader.Read())
                    {
                        MVCModels.HiDoctor_Master.UserModel _objUser = new MVCModels.HiDoctor_Master.UserModel();
                        _objUser.Division_Code = sqlDataReader["Division_Code"].ToString();
                        _objUser.Division_Name = sqlDataReader["Division_Name"].ToString();
                        lstDivision.Add(_objUser);
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstDivision;
        }

        public List<MVCModels.HiDoctor_Master.EmployeeModel> GetUnassignedEmployees(string companyCode)
        {
            List<MVCModels.HiDoctor_Master.EmployeeModel> lstEmployee = new List<MVCModels.HiDoctor_Master.EmployeeModel>();
            try
            {
                _objData.OpenConnection();
                using (sqlDataReader = _objData.ExecuteReader("" + EXEC + "  " + SP_HDGETUNASSIGNEDEMPLOYEE + " '" + companyCode + "'"))
                {
                    while (sqlDataReader.Read())
                    {
                        MVCModels.HiDoctor_Master.EmployeeModel _objEmployee = new MVCModels.HiDoctor_Master.EmployeeModel();
                        _objEmployee.Employee_Code = sqlDataReader["Employee_Code"].ToString();
                        _objEmployee.Employee_Name = sqlDataReader["Employee_Name"].ToString();
                        _objEmployee.Employee_Number = sqlDataReader["Employee_Number"].ToString();
                        lstEmployee.Add(_objEmployee);
                    }
                }
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstEmployee;
        }

        public List<MVCModels.HiDoctor_Master.UserModel> GetUsers(string companyCode)
        {
            List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
            try
            {
                _objData.OpenConnection();
                using (sqlDataReader = _objData.ExecuteReader("" + EXEC + "  " + SP_HDGETUSERS + " '" + companyCode + "'"))
                {
                    while (sqlDataReader.Read())
                    {
                        MVCModels.HiDoctor_Master.UserModel _objUser = new MVCModels.HiDoctor_Master.UserModel();
                        _objUser.User_Code = sqlDataReader["User_Code"].ToString();
                        _objUser.User_Name = sqlDataReader["User_Name"].ToString();
                        lstUser.Add(_objUser);
                    }
                }
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstUser;
        }

        public List<MVCModels.HiDoctor_Master.DivisionModel> GetDivisions(string companyCode)
        {
            List<MVCModels.HiDoctor_Master.DivisionModel> lstDivision = new List<MVCModels.HiDoctor_Master.DivisionModel>();
            try
            {
                _objData.OpenConnection();
                using (sqlDataReader = _objData.ExecuteReader("" + EXEC + "  " + SP_HDGETDIVISIONS + " '" + companyCode + "'"))
                {
                    while (sqlDataReader.Read())
                    {
                        MVCModels.HiDoctor_Master.DivisionModel _objDivision = new MVCModels.HiDoctor_Master.DivisionModel();
                        _objDivision.Division_Code = sqlDataReader["Division_Code"].ToString();
                        _objDivision.Division_Name = sqlDataReader["Division_Name"].ToString();
                        lstDivision.Add(_objDivision);
                    }
                }
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstDivision;
        }

        public List<MVCModels.HiDoctor_Master.ExpenseModel> GetExpenseGroup(string companyCode)
        {
            List<MVCModels.HiDoctor_Master.ExpenseModel> lstExpense = new List<MVCModels.HiDoctor_Master.ExpenseModel>();
            try
            {
                _objData.OpenConnection();
                using (sqlDataReader = _objData.ExecuteReader("" + EXEC + "  " + SP_HDGETEXPENSEGROUP + " '" + companyCode + "'"))
                {
                    while (sqlDataReader.Read())
                    {
                        MVCModels.HiDoctor_Master.ExpenseModel _objExpense = new MVCModels.HiDoctor_Master.ExpenseModel();
                        _objExpense.Expense_Group_Id = sqlDataReader["Expense_Group_Id"].ToString();
                        _objExpense.Expense_Group_Name = sqlDataReader["Expense_Group_Name"].ToString();
                        lstExpense.Add(_objExpense);
                    }
                }
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstExpense;
        }

        public string InsertUserMaster(string CompanyCode, string UserCode, string EmployeeCode, string UserTypeCode, string UnderUserCode,
         string UserName, string UserPass, string UserStatus, string RegionCode,
            string ExpenseGroupId, string HiDOCTORStartDate, string createdBy)
        {
            SPData _objSPData = new SPData();
            string result = "";
            result = _objSPData.InsertUserMaster(CompanyCode, UserCode, EmployeeCode, UserTypeCode, UnderUserCode,
                        UserName, UserPass, UserStatus, RegionCode,
                        ExpenseGroupId, HiDOCTORStartDate, createdBy);
            return result;
        }

        // INSERT BULK USER 
        public string BulkUserInsert(string companyCode, DataTable dt)
        {
            string result = string.Empty;
            try
            {
                using (SqlConnection cn = _objData.GetConnectionObject(companyCode))
                {
                    cn.Open();
                    using (SqlBulkCopy copy = new SqlBulkCopy(cn))
                    {
                        copy.ColumnMappings.Add("Company_Code", "Company_Code");
                        copy.ColumnMappings.Add("Employee_Code", "Employee_Code");
                        copy.ColumnMappings.Add("User_Type_Code", "User_Type_Code");
                        copy.ColumnMappings.Add("Under_User_Code", "Under_User_Code");
                        copy.ColumnMappings.Add("Under_User_Name", "Under_User_Name");
                        copy.ColumnMappings.Add("User_Name", "User_Name");
                        copy.ColumnMappings.Add("User_Pass", "User_Pass");
                        copy.ColumnMappings.Add("Region_Code", "Region_Code");
                        copy.ColumnMappings.Add("HiDOCTOR_Start_Date", "HiDOCTOR_Start_Date");
                        copy.ColumnMappings.Add("Expense_Group_Id", "Expense_Group_Id");
                        copy.ColumnMappings.Add("GUID", "GUID");
                        copy.ColumnMappings.Add("Row_No", "Row_No");
                        copy.ColumnMappings.Add("Status", "Status");
                        copy.DestinationTableName = tbl_SFA_User_Master_Staging;
                        copy.WriteToServer(dt);
                    }
                    cn.Close();
                }
                result = "SUCCESS";
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }


        public DataTable GetExpenseGroupMandatory(string Company_Code, string User_Code, string Region_Code, string User_Type_Code)
        {
            DataTable ExpenseGroupMandatory = new DataTable();
            SPData _objSPData = new SPData();
            _objData = new Data();
            try
            {

                string cmdText = SP_HD_GETUSERADDEXPENSEGROUPMAND;

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                _objData.OpenConnection(Company_Code);
                ExpenseGroupMandatory = _objData.ExecuteDataTable(command);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ExpenseGroupMandatory;
        }

        public DataTable GetExpenseGroupMand(string Company_Code, string User_Code, string Region_Code, string User_Type_Code)
        {
            DataTable ExpenseGroupMandatory = new DataTable();
            SPData _objSPData = new SPData();
            _objData = new Data();
            try
            {

                string cmdText = SP_HD_GETUSERADDEXPENSEGROUPMAND;

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                _objData.OpenConnection(Company_Code);
                ExpenseGroupMandatory = _objData.ExecuteDataTable(command);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return ExpenseGroupMandatory;
        }

        public string InsertBulkUserStagingToMaster(string companyCode, Guid guid, string uploadedBy)
        {

            SPData _objSPData = new SPData();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HDINSERTUSERFROMBULKSTAGING);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 1000;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@GUID", ParameterDirection.Input, SqlDbType.NVarChar, 100, guid.ToString());
                _objSPData.AddParamToSqlCommand(command, "@UploadedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, uploadedBy);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
                return result;
            }
            catch
            {
                result = "FAILURE:";
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }
        // INSERT BULK USER 
        public string ExcelBulkUserInsert(string companyCode, DataTable dt, string subDomain)
        {
            string result = string.Empty;
            try
            {
                using (SqlConnection cn = _objData.GetConnectionObjectForSqlBulCopy(subDomain))
                {
                    cn.Open();
                    using (SqlBulkCopy copy = new SqlBulkCopy(cn))
                    {
                        copy.ColumnMappings.Add("Company_Code", "Company_Code");
                        copy.ColumnMappings.Add("Employee_Name", "Employee_Name");
                        copy.ColumnMappings.Add("Employee_Number", "Employee_Number");
                        copy.ColumnMappings.Add("User_Name", "User_Name");
                        copy.ColumnMappings.Add("User_Pass", "User_Pass");
                        copy.ColumnMappings.Add("Reporting_Manager_Name", "Under_User_Name");
                        copy.ColumnMappings.Add("User_Type_Name", "User_Type_Name");
                        copy.ColumnMappings.Add("Region_Name", "Region_Name");
                        copy.ColumnMappings.Add("HiDOCTOR_Start_Date", "HiDOCTOR_Start_Date");
                        copy.ColumnMappings.Add("Expense_Group_Name", "Expense_Group_Name");
                        copy.ColumnMappings.Add("GUID", "GUID");
                        copy.ColumnMappings.Add("Row_No", "Row_No");
                        copy.ColumnMappings.Add("Status", "Status");
                        copy.DestinationTableName = tbl_SFA_User_Master_Staging;
                        copy.WriteToServer(dt);
                    }
                    cn.Close();
                }
                result = "SUCCESS";
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }
        public string InsertExcelBulkUserStagingToMaster(string companyCode, string guid, string fileName, string uploadedBy, string bpType, string subDomain)
        {

            SPData _objSPData = new SPData();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HDINSERTUSERFROMEXCELSTAGING);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 1000;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@GUID", ParameterDirection.Input, SqlDbType.NVarChar, 100, guid);
                _objSPData.AddParamToSqlCommand(command, "@FileName", ParameterDirection.Input, SqlDbType.NVarChar, 500, fileName);
                _objSPData.AddParamToSqlCommand(command, "@UploadedBy", ParameterDirection.Input, SqlDbType.NVarChar, 30, uploadedBy);
                _objSPData.AddParamToSqlCommand(command, "@BPType", ParameterDirection.Input, SqlDbType.NVarChar, 30, bpType);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnectionAsync(subDomain);
                _objData.ExecuteNonQueryAsync(command);
                return result;
            }
            catch
            {
                result = "FAILURE:";
            }
            finally
            {
                // _objData.CloseConnection();
            }
            return result;
        }

        public List<MVCModels.HiDoctor_Master.UserModel> GetChildUsers(string companyCode, string userCode)
        {
            List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
            try
            {
                _objData.OpenConnection();
                using (sqlDataReader = _objData.ExecuteReader("" + EXEC + "  " + SP_HDGETCHILDUSERDETAILS + " '" + companyCode + "','" + userCode + "'"))
                {
                    while (sqlDataReader.Read())
                    {
                        MVCModels.HiDoctor_Master.UserModel _objUser = new MVCModels.HiDoctor_Master.UserModel();
                        _objUser.User_Code = sqlDataReader["User_Code"].ToString();
                        _objUser.User_Name = sqlDataReader["User_Name"].ToString();
                        _objUser.Under_User_Id = sqlDataReader["Under_User_Id"].ToString();
                        _objUser.User_Id = sqlDataReader["User_Id"].ToString();
                        _objUser.Full_Index = sqlDataReader["Full_Index"].ToString();
                        _objUser.Reporting_Manager_Code = sqlDataReader["Under_User_Code"].ToString();
                        _objUser.Region_Name = sqlDataReader["Region_Name"].ToString();
                        _objUser.User_Type_Name = sqlDataReader["User_Type_Name"].ToString();
                        lstUser.Add(_objUser);
                    }
                }
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstUser;
        }
        public List<MVCModels.HiDoctor_Master.UserModel> GetExpenseChildUsers(string companyCode, string userCode)
        {
            List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
            try
            {
                _objData.OpenConnection();
                using (sqlDataReader = _objData.ExecuteReader("" + EXEC + "  " + SP_HD_GETCHILDUSERDETAILS + " '" + companyCode + "','" + userCode + "'"))
                {
                    while (sqlDataReader.Read())
                    {
                        MVCModels.HiDoctor_Master.UserModel _objUser = new MVCModels.HiDoctor_Master.UserModel();
                        _objUser.User_Code = sqlDataReader["User_Code"].ToString();
                        _objUser.User_Name = sqlDataReader["User_Name"].ToString();
                        _objUser.Under_User_Id = sqlDataReader["Under_User_Id"].ToString();
                        _objUser.User_Id = sqlDataReader["User_Id"].ToString();
                        _objUser.Full_Index = sqlDataReader["Full_Index"].ToString();
                        _objUser.Reporting_Manager_Code = sqlDataReader["Under_User_Code"].ToString();
                        _objUser.Region_Name = sqlDataReader["Region_Name"].ToString();
                        _objUser.User_Type_Name = sqlDataReader["User_Type_Name"].ToString();
                        lstUser.Add(_objUser);
                    }
                }
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstUser;
        }
        public List<MVCModels.HiDoctor_Master.UserModel> GetChildUsersCodeAndNameOnly(string companyCode, string userCode)
        {
            List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
            try
            {
                _objData.OpenConnection();
                using (sqlDataReader = _objData.ExecuteReader("" + EXEC + "  " + SP_HDGETCHILDUSERDETAILS + " '" + companyCode + "','" + userCode + "'"))
                {
                    while (sqlDataReader.Read())
                    {
                        MVCModels.HiDoctor_Master.UserModel _objUser = new MVCModels.HiDoctor_Master.UserModel();
                        _objUser.User_Code = sqlDataReader["User_Code"].ToString();
                        _objUser.User_Name = sqlDataReader["User_Name"].ToString();
                        lstUser.Add(_objUser);
                    }
                }
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstUser;
        }

        public DataSet GetAllUsersForMigration(string companyCode)
        {
            DataSet ds = new DataSet();
            try
            {
                _objData.OpenConnection();
                {
                    dsUser = _objData.getDataSet("" + EXEC + "  " + SP_HDGETALLUSERFORMIGRATION + "  '" + companyCode + "'");
                    dsAllUsers = dsUser.Clone();
                    dsAllUsers.Tables[0].Columns.Add("Created_By", typeof(String));
                    dsAllUsers.Tables[0].Columns.Add("GUID", typeof(String));
                    dsAllUsers.Tables[0].Columns.Add("Display_Order", typeof(Int32));
                }
            }
            finally
            {
                _objData.CloseConnection();
            }
            return dsUser;
        }

        public DataSet GetAllUsersForMigrationNew(string companyCode)
        {
            DataSet ds = new DataSet();
            try
            {
                _objData.OpenConnection();
                {
                    dsUser = _objData.getDataSet("" + EXEC + "  " + SP_HDGETALLUSERFORMIGRATION_New + "  '" + companyCode + "'");
                    dsAllUsers = dsUser.Clone();
                    dsAllUsers.Tables[0].Columns.Add("Created_By", typeof(String));
                    dsAllUsers.Tables[0].Columns.Add("GUID", typeof(String));
                    dsAllUsers.Tables[0].Columns.Add("Display_Order", typeof(Int32));
                }
            }
            finally
            {
                _objData.CloseConnection();
            }
            return dsUser;
        }

        public DataSet GetUserHierarchyDataset(string companyCode, string strUserCode, string enteredBy, string Guid)
        {
            DataRow[] dr;
            dr = dsUser.Tables[0].AsEnumerable().Where(c => c["Under_User_Code"].ToString() == strUserCode).ToArray();
            DataRow[] temp;
            if (dr.Length > 0)
            {
                foreach (DataRow drr in dr)
                {
                    tCode = drr["Under_User_Code"].ToString();
                    sCode = drr["User_Code"].ToString();
                    DataRow drTemp = dsAllUsers.Tables[0].NewRow();
                    drTemp["Under_User_Code"] = drr["Under_User_Code"].ToString();
                    drTemp["User_Code"] = drr["User_Code"].ToString();
                    drTemp["User_Id"] = drr["User_Id"].ToString();
                    drTemp["Under_User_Id"] = drr["Under_User_Id"].ToString();
                    drTemp["Created_By"] = enteredBy;
                    drTemp["GUID"] = Guid;
                    dsAllUsers.Tables[0].Rows.Add(drTemp);
                    dsAllUsers.AcceptChanges();
                    if (tCode != sCode)
                    {
                        GetUserHierarchyDataset(companyCode, sCode, enteredBy, Guid);
                    }
                }
            }
            return dsAllUsers;
        }

        // INSERT BULK USER  Temp
        public string BulkUserTempInsert(string companyCode, DataTable dt, string mode)
        {
            string result = string.Empty;
            try
            {
                using (SqlConnection cn = _objData.GetConnectionObject(companyCode))
                {
                    cn.Open();
                    using (SqlBulkCopy copy = new SqlBulkCopy(cn))
                    {
                        copy.ColumnMappings.Add("Company_Code", "Company_Code");
                        copy.ColumnMappings.Add("Under_User_Code", "Under_User_Code");
                        copy.ColumnMappings.Add("User_Code", "User_Code");
                        copy.ColumnMappings.Add("User_Id", "User_Id");
                        copy.ColumnMappings.Add("Under_User_Id", "Under_User_Id");
                        if (mode.ToUpper() == "MIGRATION")
                        {
                            copy.ColumnMappings.Add("Seq_index", "Seq_index");
                        }
                        copy.ColumnMappings.Add("Full_index", "Full_index");
                        copy.ColumnMappings.Add("Created_By", "Created_By");
                        copy.ColumnMappings.Add("GUID", "GUID");
                        copy.ColumnMappings.Add("Display_Order", "Display_Order");
                        copy.DestinationTableName = "tbl_SFA_User_Master_Temp";
                        copy.WriteToServer(dt);
                    }
                    cn.Close();
                }
                result = "SUCCESS";
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }

        public string UpdateUserIndexFromTemptoUserMaster(string companyCode, string mode, string guid, string userCode)
        {
            SPData _objSPData = new SPData();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HDUPDATEUSERINDEXFROMTEMPTOUSERMASTER);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 1000;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Mode", ParameterDirection.Input, SqlDbType.VarChar, 30, mode);
                _objSPData.AddParamToSqlCommand(command, "@GUID", ParameterDirection.Input, SqlDbType.VarChar, 200, guid);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
                return result;
            }
            catch
            {
                result = "FAILURE:";
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }
        public string DeleteUserMasterTemp(string companyCode, string guid, string userCode)
        {

            SPData _objSPData = new SPData();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HDDELETEUSERMASTERTEMP);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 1000;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Guid", ParameterDirection.Input, SqlDbType.VarChar, 100, guid);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
                return result;
            }
            catch
            {
                result = "FAILURE:";
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }

        public List<MVCModels.HiDoctor_Master.UserModel> GetChildUsersByRegion(string companyCode, string regionCode)
        {
            List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
            try
            {
                _objData.OpenConnection();
                using (sqlDataReader = _objData.ExecuteReader("" + EXEC + "  " + SP_HDGETCHILDUSERSBYREGION + " '" + companyCode + "','" + regionCode + "'"))
                {
                    while (sqlDataReader.Read())
                    {
                        MVCModels.HiDoctor_Master.UserModel _objUser = new MVCModels.HiDoctor_Master.UserModel();
                        _objUser.User_Code = sqlDataReader["User_Code"].ToString();
                        _objUser.User_Name = sqlDataReader["User_Name"].ToString();
                        _objUser.User_Type_Name = sqlDataReader["User_Type_Name"].ToString();
                        _objUser.Region_Name = sqlDataReader["Region_Name"].ToString();
                        _objUser.Region_Code = sqlDataReader["Region_Code"].ToString();
                        _objUser.Reporting_Manager_Code = sqlDataReader["Under_User_Code"].ToString();
                        _objUser.Child_User_Count = sqlDataReader["Child_User_Count"].ToString();
                        lstUser.Add(_objUser);
                    }
                }
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstUser;
        }
        public string UpdateUserStatus(string companyCode, string userCode, string updatedBy, string resignationDate)
        {
            SPData _objSPData = new SPData();
            string result = "";
            try
            {
                result = _objSPData.UpdateUserStatus(companyCode, userCode, updatedBy, resignationDate);
            }
            catch
            {
            }
            return result;
        }
        public List<MVCModels.DCRDATE> GetDCRdate(string UserCode)
        {
            List<MVCModels.DCRDATE> lstReported;
            try
            {
                DynamicParameters p = new DynamicParameters();

                p.Add("@UserCode", UserCode);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstReported = connection.Query<MVCModels.DCRDATE>(SP_HD_GetDCRLastentereddate, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstReported;
        }

        public string BulkUserHierarchyTemp(string companyCode, DataTable dt, string createdBy)
        {
            string result = string.Empty;
            try
            {
                using (SqlConnection cn = _objData.GetConnectionObject(companyCode))
                {
                    cn.Open();
                    using (SqlBulkCopy copy = new SqlBulkCopy(cn))
                    {
                        copy.ColumnMappings.Add("Company_Code", "Company_Code");
                        copy.ColumnMappings.Add("User_Code", "User_Code");
                        copy.ColumnMappings.Add("User_Id", "User_Id");
                        copy.ColumnMappings.Add("Under_User_Id", "Under_User_Id");
                        copy.ColumnMappings.Add("Seq_index", "Seq_index");
                        copy.ColumnMappings.Add("Full_index", "Full_index");
                        copy.ColumnMappings.Add("GUID", "GUID");
                        copy.ColumnMappings.Add("Created_By", "Created_By");
                        copy.ColumnMappings.Add("Under_User_Code", "Under_User_Code");
                        copy.DestinationTableName = "tbl_SFA_User_Master_Temp";
                        copy.WriteToServer(dt);
                    }
                    cn.Close();
                }
                result = "SUCCESS";
            }
            catch
            {
                result = "FAILURE";
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }
        public string UpdateUserHierarchyFromTemptoUserMaster(string companyCode, string guid, string userCode)
        {
            SPData _objSPData = new SPData();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HDCHANGEUSERHIERARCHYFROMTEMPTABLE);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 1000;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@GUID", ParameterDirection.Input, SqlDbType.VarChar, 100, guid);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
                return result;
            }
            catch
            {
                result = "FAILURE:";
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }

        // INSERT BULK USER 
        public string ExcelBulkEmployeeInsert(string companyCode, DataTable dt)
        {
            string result = string.Empty;
            try
            {
                using (SqlConnection cn = _objData.GetConnectionObject(companyCode))
                {
                    cn.Open();
                    using (SqlBulkCopy copy = new SqlBulkCopy(cn))
                    {
                        copy.ColumnMappings.Add("Company_Code", "Company_Code");
                        copy.ColumnMappings.Add("Employee_Name", "Employee_Name");
                        copy.ColumnMappings.Add("Gender", "Gender");
                        copy.ColumnMappings.Add("Date_Of_Birth", "Date_Of_Birth");
                        copy.ColumnMappings.Add("Address", "Address");
                        copy.ColumnMappings.Add("Phone", "Phone");
                        copy.ColumnMappings.Add("Mobile", "Mobile");
                        copy.ColumnMappings.Add("Email_Id", "Email_Id");
                        copy.ColumnMappings.Add("Date_of_Joining", "Date_of_Joining");
                        copy.ColumnMappings.Add("Employee_Number", "Employee_Number");
                        copy.ColumnMappings.Add("EDN_Proof", "EDN_Proof");
                        copy.ColumnMappings.Add("Salary_Proof", "Salary_Proof");
                        copy.ColumnMappings.Add("Resume_Given", "Resume_Given");
                        copy.ColumnMappings.Add("Resignation_Submitted", "Resignation_Submitted");
                        copy.ColumnMappings.Add("Appointed", "Appointed");
                        copy.ColumnMappings.Add("Bank_Account_Number1", "SCB_Account_Number");
                        copy.ColumnMappings.Add("Bank_Account_Number2", "ICICI_Account_Number");
                        copy.ColumnMappings.Add("PF_Number", "PF_Number");
                        copy.ColumnMappings.Add("PAN_Number", "PAN_Number");
                        copy.ColumnMappings.Add("Confirmation_Date", "Confirmation_Date");
                        copy.ColumnMappings.Add("Employee_Entity_Type", "Employee_Entity_Type");
                        copy.ColumnMappings.Add("State_Name", "State_Name");
                        copy.ColumnMappings.Add("City_Name", "City_Name");
                        copy.ColumnMappings.Add("Pincode", "Pincode");
                        copy.ColumnMappings.Add("Department_Name", "Department_Name");
                        copy.ColumnMappings.Add("Aadhar_Number", "Aadhar_Number");
                        copy.ColumnMappings.Add("GUID", "GUID");
                        copy.ColumnMappings.Add("Row_No", "Row_No");
                        copy.ColumnMappings.Add("Status", "Status");
                        copy.DestinationTableName = "tbl_SFA_Employee_Master_Staging";
                        copy.WriteToServer(dt);
                    }
                    cn.Close();
                }
                result = "SUCCESS";
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }

        public string InsertExcelBulkEmployeeStagingToMaster(string subDomain, string companyCode, string Regioncode, string guid, string fileName, string uploadedBy, string bpType)
        {
            SPData _objSPData = new SPData();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HDINSERTEMPLOYEEFROMEXCELSTAGING);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 1000;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Regioncode", ParameterDirection.Input, SqlDbType.VarChar, 30, Regioncode);
                _objSPData.AddParamToSqlCommand(command, "@GUID", ParameterDirection.Input, SqlDbType.NVarChar, 100, guid);
                _objSPData.AddParamToSqlCommand(command, "@FileName", ParameterDirection.Input, SqlDbType.NVarChar, 500, fileName);
                _objSPData.AddParamToSqlCommand(command, "@UploadedBy", ParameterDirection.Input, SqlDbType.NVarChar, 30, uploadedBy);
                _objSPData.AddParamToSqlCommand(command, "@BPType", ParameterDirection.Input, SqlDbType.NVarChar, 30, bpType);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnectionAsync(subDomain);
                _objData.ExecuteNonQueryAsync(command);
                result = "SUCCESS:";
            }
            catch (Exception ex)
            {
                result = String.Concat("FAILURE: ", ex.StackTrace.Substring(0, 499));
            }

            return result;
        }
        public List<MVCModels.HiDoctor_Master.UserModel> GetUserDetails(string companyCode, string userCode)
        {
            List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
            try
            {
                _objData.OpenConnection();
                using (sqlDataReader = _objData.ExecuteReader("" + EXEC + "  " + SP_HDGETSELECTEDUSER + " '" + companyCode + "','" + userCode + "'"))
                {
                    while (sqlDataReader.Read())
                    {
                        MVCModels.HiDoctor_Master.UserModel _objUser = new MVCModels.HiDoctor_Master.UserModel();
                        _objUser.Employee_Code = sqlDataReader["Employee_Code"].ToString();
                        _objUser.User_Type_Code = sqlDataReader["User_Type_Code"].ToString();
                        _objUser.Reporting_Manager_Code = sqlDataReader["Under_User_Code"].ToString();
                        _objUser.User_Name = sqlDataReader["User_Name"].ToString();
                        _objUser.User_Pass = sqlDataReader["User_Pass"].ToString();
                        _objUser.Region_Code = sqlDataReader["Region_Code"].ToString();
                        _objUser.User_Division_Code = sqlDataReader["User_Division_Code"].ToString();
                        _objUser.HiDOCTOR_Start_Date = sqlDataReader["HiDOCTOR_Start_Date"].ToString();
                        _objUser.Expense_Group_Id = sqlDataReader["Expense_Group_Id"].ToString();
                        _objUser.User_Id = sqlDataReader["User_Id"].ToString();
                        _objUser.Under_User_Id = sqlDataReader["Under_User_Id"].ToString();
                        _objUser.Employee_Name = sqlDataReader["Employee_Name"].ToString();
                        _objUser.User_Code = sqlDataReader["User_Code"].ToString();
                        lstUser.Add(_objUser);
                    }
                }
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstUser;
        }

        public string UpdateUserMaster(string CompanyCode, string UserCode, string EmployeeCode, string UserTypeCode, string UnderUserCode,
      string UserName, string UserPass, string UserStatus, string RegionCode,
         string ExpenseGroupId, string HiDOCTORStartDate, string updatedBy)
        {
            SPData _objSPData = new SPData();
            string result = "";
            result = _objSPData.UpdateUserMaster(CompanyCode, UserCode, EmployeeCode, UserTypeCode, UnderUserCode,
                        UserName, UserPass, UserStatus, RegionCode,
                        ExpenseGroupId, HiDOCTORStartDate, updatedBy);
            return result;
        }


        public List<MVCModels.HiDoctor_Master.UserModel> GetImmediateChildUsers(string companyCode, string userCode)
        {
            List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
            try
            {
                _objData.OpenConnection();
                using (sqlDataReader = _objData.ExecuteReader("" + EXEC + "  " + SP_HDGETIMMEDIATECHILDUSERS + " '" + companyCode + "','" + userCode + "'"))
                {
                    while (sqlDataReader.Read())
                    {
                        MVCModels.HiDoctor_Master.UserModel _objUser = new MVCModels.HiDoctor_Master.UserModel();
                        _objUser.User_Code = sqlDataReader["User_Code"].ToString();
                        _objUser.User_Name = sqlDataReader["User_Name"].ToString();
                        _objUser.Under_User_Id = sqlDataReader["Under_User_Id"].ToString();
                        _objUser.User_Id = sqlDataReader["User_Id"].ToString();
                        _objUser.Full_Index = sqlDataReader["Full_Index"].ToString();
                        _objUser.User_Type_Name = sqlDataReader["User_Type_Name"].ToString();
                        _objUser.Region_Name = sqlDataReader["Region_Name"].ToString();
                        lstUser.Add(_objUser);
                    }
                }
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstUser;
        }
        public UserModel GetUserHeaderDetails(string company_Code, string user_Code)
        {
            try
            {
                SPData _objSPData = new SPData();

                // set command objects
                SqlCommand command = new SqlCommand(SP_HD_GET_USER_HEADER_DETAIL);
                command.CommandType = CommandType.StoredProcedure;

                // assign to parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.NVarChar, 30, user_Code);

                // Opens the connection
                _objData.OpenConnection();

                // Execuete the command.
                using (SqlDataReader reader = _objData.ExecuteReader(command))
                {
                    // converts and retruns the user modal list.
                    return UserHeaderDataReader_MaptoList(reader);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                // close the connection.
                _objData.CloseConnection();
            }
        }

        #region Private Methods

        private UserModel UserHeaderDataReader_MaptoList(SqlDataReader reader)
        {
            UserModel userModal = new UserModel();
            while (reader.Read())
            {
                // User Details.
                userModal.Employee_Name = reader["Employee_Number"].ToString();
                userModal.Employee_Number = reader["Employee_Name"].ToString();
                userModal.User_Code = reader["User_Code"].ToString();
                userModal.User_Name = reader["User_Name"].ToString();
                userModal.User_Type_Name = reader["User_Type_Name"].ToString();
                userModal.Region_Code = reader["Region_Code"].ToString();
                userModal.Region_Name = reader["Region_Name"].ToString();
                userModal.User_Mobile_Number = reader["Mobile"].ToString();
                userModal.User_Phone_Number = reader["Phone"].ToString();
                userModal.User_Date_of_Birth = reader["DOB"].ToString();
                userModal.User_Date_of_joining = reader["DOJ"].ToString();

                // Manager Details.
                userModal.Reporting_Manager_Emp_Name = reader["Manager_Emp_Name"].ToString();
                userModal.Reporting_Manager_Name = reader["Manager_Name"].ToString();
                userModal.Reporting_Manager_Region_Name = reader["Manager_Region_Name"].ToString();
                userModal.Reporting_Manager_Type_Name = reader["Manager_Type_Name"].ToString();
                userModal.Reproting_Managet_Mobile_Number = reader["Mobile"].ToString();

            }
            return userModal;
        }
        #endregion Private Methods

        public List<MVCModels.HiDoctor_Master.UserModel> GetAllStatusUsers(string companyCode)
        {
            List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
            try
            {
                _objData.OpenConnection();
                using (sqlDataReader = _objData.ExecuteReader("" + EXEC + "  " + SP_HDGETALLSTATUSUSERS + " '" + companyCode + "'"))
                {
                    while (sqlDataReader.Read())
                    {
                        MVCModels.HiDoctor_Master.UserModel _objUser = new MVCModels.HiDoctor_Master.UserModel();
                        _objUser.User_Code = sqlDataReader["User_Code"].ToString();
                        _objUser.User_Name = sqlDataReader["User_Name"].ToString();
                        _objUser.User_Status = sqlDataReader["User_Status"].ToString();
                        lstUser.Add(_objUser);
                    }
                }
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstUser;
        }

        public List<MVCModels.HiDoctor_Master.EmployeeModel> GetEmployees(string companyCode)
        {
            List<MVCModels.HiDoctor_Master.EmployeeModel> lstEmployee = new List<MVCModels.HiDoctor_Master.EmployeeModel>();
            try
            {
                _objData.OpenConnection();
                using (sqlDataReader = _objData.ExecuteReader("" + EXEC + "  " + SP_HDGETEMPLOYEE + " '" + companyCode + "'"))
                {
                    while (sqlDataReader.Read())
                    {
                        MVCModels.HiDoctor_Master.EmployeeModel _objEmployee = new MVCModels.HiDoctor_Master.EmployeeModel();
                        _objEmployee.Employee_Code = sqlDataReader["Employee_Code"].ToString();
                        _objEmployee.Employee_Name = sqlDataReader["Employee_Name"].ToString();
                        _objEmployee.Employee_Number = sqlDataReader["Employee_Number"].ToString();
                        lstEmployee.Add(_objEmployee);
                    }
                }
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstEmployee;
        }

        public string VacancyHeaderMigration(string companyCode, string userCode)
        {
            SPData _objSPData = new SPData();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HDVACANCYHEADERMIGRATION);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 1000;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@UpdatedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
                return result;
            }
            catch
            {
                result = "FAILURE:";
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }

        public DataSet GetVacanyHeader(string companyCode)
        {
            DataSet ds = new DataSet();
            try
            {
                _objData.OpenConnection();
                {
                    ds = _objData.getDataSet("" + EXEC + "  " + SP_HDGETVACANCYHEADER + "  '" + companyCode + "'");
                }
            }
            finally
            {
                _objData.CloseConnection();
            }
            return ds;
        }
        public DataSet GetUsersByRegionForVacancyMigration(string companyCode, string regionCode)
        {
            DataSet ds = new DataSet();
            try
            {
                _objData.OpenConnection();
                {
                    ds = _objData.getDataSet("" + EXEC + "  " + SP_HDGETUSERSBYREGIONFORVACANCY + "  '" + companyCode + "','" + regionCode + "'");
                }
            }
            finally
            {
                _objData.CloseConnection();
            }
            return ds;
        }

        // INSERT BULK USER  Temp
        public string VacancyDetailsBulkInsertion(string companyCode, DataTable dt, string userCode)
        {
            string result = string.Empty;
            try
            {
                using (SqlConnection cn = _objData.GetConnectionObject(companyCode))
                {
                    cn.Open();
                    using (SqlBulkCopy copy = new SqlBulkCopy(cn))
                    {
                        copy.ColumnMappings.Add("Company_Code", "Company_Code");
                        copy.ColumnMappings.Add("Vacancy_Id", "Vacancy_Id");
                        copy.ColumnMappings.Add("User_Code", "User_Code");
                        copy.ColumnMappings.Add("Vacant_From_Date", "Vacant_From_Date");
                        copy.ColumnMappings.Add("Vacancy_Details_Id", "Vacancy_Details_Id");
                        copy.ColumnMappings.Add("Updated_by", "Updated_by");
                        copy.DestinationTableName = "tbl_SFA_Vacancy_Details";
                        copy.WriteToServer(dt);
                    }
                    cn.Close();
                }
                result = "SUCCESS";
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }

        public List<MVCModels.HiDoctor_Master.UserModel> GetChildUsersOrderByUserName(string companyCode, string userCode)
        {
            List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
            try
            {
                _objData.OpenConnection();
                using (sqlDataReader = _objData.ExecuteReader("" + EXEC + "  " + SP_HDGETCHILDUSERDETAILSORDERBYNAME + " '" + companyCode + "','" + userCode + "'"))
                {
                    while (sqlDataReader.Read())
                    {
                        MVCModels.HiDoctor_Master.UserModel _objUser = new MVCModels.HiDoctor_Master.UserModel();
                        _objUser.User_Code = sqlDataReader["User_Code"].ToString();
                        _objUser.User_Name = sqlDataReader["User_Name"].ToString();
                        _objUser.Under_User_Id = sqlDataReader["Under_User_Id"].ToString();
                        _objUser.User_Id = sqlDataReader["User_Id"].ToString();
                        _objUser.Full_Index = sqlDataReader["Full_Index"].ToString();
                        _objUser.Reporting_Manager_Code = sqlDataReader["Under_User_Code"].ToString();
                        _objUser.Region_Name = sqlDataReader["Region_Name"].ToString();
                        _objUser.User_Type_Name = sqlDataReader["User_Type_Name"].ToString();
                        lstUser.Add(_objUser);
                    }
                }
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstUser;
        }

        public DataSet GetUserFullTreeDetails(string companyCode)
        {
            DataSet ds = new DataSet();
            try
            {
                _objData.OpenConnection();
                {
                    ds = _objData.getDataSet("" + EXEC + "  " + SP_HDGETUSERFULLTREEDETAILS + "  '" + companyCode + "'");
                }
            }
            finally
            {
                _objData.CloseConnection();
            }
            return ds;
        }

        public DataSet GetUserFullTreeDetailsNew(string companyCode)
        {
            DataSet ds = new DataSet();
            try
            {
                _objData.OpenConnection();
                {
                    ds = _objData.getDataSet("" + EXEC + "  " + SP_hdGetUserFullTreeDetails_NEW + "  '" + companyCode + "'");
                }
            }
            finally
            {
                _objData.CloseConnection();
            }
            return ds;
        }

        public string GetAccountlock(string userCode)
        {
            SPData _objSPData = new SPData();
            string companyCode = _objCurInfo.GetCompanyCode();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETACCOUNTLOCK);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objData.OpenConnection(companyCode);
                result = Convert.ToString(_objData.ExecuteScalar(command));
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public bool GetLockRelease(string companyCode, string userCode, string userName, string date, string mode)
        {
            try
            {
                SPData _objSPData = new SPData();

                // set command objects
                SqlCommand command = new SqlCommand(SP_HDGETLOCKRELEASE);
                command.CommandType = CommandType.StoredProcedure;

                // assign to parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objSPData.AddParamToSqlCommand(command, "@UserName", ParameterDirection.Input, SqlDbType.VarChar, 30, userName);
                _objSPData.AddParamToSqlCommand(command, "@Date", ParameterDirection.Input, SqlDbType.VarChar, 30, date);
                _objSPData.AddParamToSqlCommand(command, "@Mode", ParameterDirection.Input, SqlDbType.VarChar, 30, mode);
                // Opens the connection.
                _objData.OpenConnection();
                _objData.ExecuteNonQuery(command);
                return true;
            }
            catch
            {
                return false;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public bool GetEmpNumb(string companyCode, string employeeNUmber)
        {
            bool result = false;
            int exists = 0;
            try
            {
                SPData _objSPData = new SPData();

                SqlCommand command = new SqlCommand(GetEmployeeNumber);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Employee_Number", ParameterDirection.Input, SqlDbType.VarChar, 30, employeeNUmber);
                _objData.OpenConnection();
                exists = Convert.ToInt32(_objData.ExecuteScalar(command));
                if (exists == 0)
                {
                    result = false;
                }
                else
                {
                    result = true;
                }
                return result;
            }
            catch
            {
                throw;
            }
        }

        public bool GetAadhaarNumb(string companyCode, string aadhaarNumber)
        {
            bool result = false;
            int exists = 0;
            try
            {
                SPData _objSPData = new SPData();

                SqlCommand command = new SqlCommand(GetAadhaarNumber);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@AadhaarNumber", ParameterDirection.Input, SqlDbType.VarChar, 12, aadhaarNumber);
                _objData.OpenConnection();
                exists = Convert.ToInt32(_objData.ExecuteScalar(command));
                if (exists == 0)
                {
                    result = false;
                }
                else
                {
                    result = true;
                }
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
            int exists = 0;
            try
            {
                SPData _objSPData = new SPData();

                SqlCommand command = new SqlCommand(GetReferenceKey_1);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Reference_Key", ParameterDirection.Input, SqlDbType.VarChar, 50, referenceKey);
                _objData.OpenConnection();
                exists = Convert.ToInt32(_objData.ExecuteScalar(command));
                if (exists == 0)
                {
                    result = false;
                }
                else
                {
                    result = true;
                }
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
            int exists = 0;
            try
            {
                SPData _objSPData = new SPData();

                SqlCommand command = new SqlCommand(GetReferenceKey_2);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Reference_Key", ParameterDirection.Input, SqlDbType.VarChar, 50, referenceKey);
                _objData.OpenConnection();
                exists = Convert.ToInt32(_objData.ExecuteScalar(command));
                if (exists == 0)
                {
                    result = false;
                }
                else
                {
                    result = true;
                }
                return result;
            }
            catch
            {
                throw;
            }
        }

        public DataSet checkEmailid(string companyCode, string userCode)
        {
            try
            {
                SPData _objSPData = new SPData();
                SqlCommand command = new SqlCommand(SP_HDGETLOCKEMPLOYEEDETAIL);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objData.OpenConnection();
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }

        //overloaded function for asynchronous reports
        public DataSet checkEmailid(string companyCode, string userCode, string ConnectionString)
        {
            try
            {
                SPData _objSPData = new SPData();
                SqlCommand command = new SqlCommand(SP_HDGETLOCKEMPLOYEEDETAIL);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objData.OpenConnection(companyCode, ConnectionString);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }

        public DataSet Getempinfo(string companyCode, string userName)
        {
            try
            {
                SPData _objSPData = new SPData();
                SqlCommand command = new SqlCommand(SP_HDGETEMPLOYEEDETAIL);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@User_Name", ParameterDirection.Input, SqlDbType.VarChar, 30, userName);
                _objData.OpenConnection();
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }

        public DataSet GetPassword(string companyCode, string userCode)
        {
            SPData _objSPData = new SPData();
            try
            {
                SqlCommand command = new SqlCommand(sp_hdGetPassWord);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@userCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public IEnumerable<MVCModels.PasswordHistory> GetPasswordHistory(string companyCode, string userCode, string historyCount)
        {
            IEnumerable<MVCModels.PasswordHistory> lstPasswordHis;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@UserCode", userCode);
                    p.Add("@HistoryCount", historyCount);

                    lstPasswordHis = connection.Query<MVCModels.PasswordHistory>(SPHDGETPASSWORDHISTORY, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return lstPasswordHis;
        }

        public string UpdatePasswordReset(string companyCode, string usercode, string newPassWord)
        {
            SPData _objSPData = new SPData();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(sp_hdUpdateResetPassword);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@userCode", ParameterDirection.Input, SqlDbType.VarChar, 30, usercode);
                _objSPData.AddParamToSqlCommand(command, "@newPassWord", ParameterDirection.Input, SqlDbType.VarChar, 30, newPassWord);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                _objData.CloseConnection();
                return result;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public DataSet GetUserTypetreedetail(string companyCode)
        {
            try
            {
                SPData _objSPData = new SPData();
                SqlCommand command = new SqlCommand(SP_HDGETUSERTYPES);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objData.OpenConnection();
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }
        public DataSet GetActivitydetail(string companyCode)
        {
            try
            {
                SPData _objSPData = new SPData();
                SqlCommand command = new SqlCommand(SP_HDGETGETACTIVITY);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objData.OpenConnection();
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }

        public List<ActivityMappedDataModel> GetUserTypeActivityMapdata(string companyCode)
        {
            try
            {
                List<ActivityMappedDataModel> lst = new List<ActivityMappedDataModel>();
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    lst = conn.Query<ActivityMappedDataModel>(SP_HDGETUSERTYPEACTIVITYMAPDETAILS, p, commandType: CommandType.StoredProcedure).ToList();
                }
                return lst;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        public int checkActivityAlreadMapped(List<ValidationActivityDataListModel> lst)
        {
            try
            {
                int result = 0;
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Tvp_Table", ToDataTable(lst).AsTableValuedParameter());
                    p.Add("@Result", "", DbType.Int32, ParameterDirection.Output);
                    conn.Query<int>(SP_HDGETUSERACTIVITYTYPESAVE, p, commandType: CommandType.StoredProcedure);
                    result = p.Get<int>("@Result");
                }
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public int getActivityMapped(string companyCode, string userTypeCode, string activityCodes)
        {
            try
            {
                SPData _objSPData = new SPData();
                SqlCommand command = new SqlCommand(SP_HDGETUSERACTIVITYTYPESAVE);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@UserTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userTypeCode);
                _objSPData.AddParamToSqlCommand(command, "@ActivityCode", ParameterDirection.Input, SqlDbType.VarChar, 30, activityCodes);
                _objData.OpenConnection();
                string returnvalue = _objData.ExecuteScalar(command).ToString();
                _objData.CloseConnection();
                return Convert.ToInt32(returnvalue);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        //activityInsert

        public int activityInsert(string companyCode, string mapCode, string userTypeCode, string activityCode, string startDate, string endDate, int Sfc_Mandatory)
        {
            SPData _objSPData = new SPData();
            try
            {
                SqlCommand command = new SqlCommand(SP_HDACTIVITYTYPESAVE);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@MapCode", ParameterDirection.Input, SqlDbType.VarChar, 30, mapCode);
                _objSPData.AddParamToSqlCommand(command, "@UserTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userTypeCode);
                _objSPData.AddParamToSqlCommand(command, "@ActivityCode", ParameterDirection.Input, SqlDbType.VarChar, 30, activityCode);
                _objSPData.AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                _objSPData.AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);
                _objSPData.AddParamToSqlCommand(command, "@Sfc_Mandatory", ParameterDirection.Input, SqlDbType.Int, 8, Sfc_Mandatory);
                _objData.OpenConnection(companyCode);
                string returnvalue = _objData.ExecuteScalar(command).ToString();
                _objData.CloseConnection();
                return Convert.ToInt32(returnvalue);

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public int DeleteMappedActivity(string companyCode, string activityCode)
        {
            SPData _objSPData = new SPData();
            try
            {
                SqlCommand command = new SqlCommand(SP_HDDELETEACTIVITYS);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@ActivityCode", ParameterDirection.Input, SqlDbType.VarChar, 30, activityCode);
                _objData.OpenConnection(companyCode);
                string returnvalue = _objData.ExecuteScalar(command).ToString();
                _objData.CloseConnection();
                return Convert.ToInt32(returnvalue);

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        //activity edit
        public int GetActivityMappedForEdit(string companyCode, string userTypeCode, string activityCodes, string mapCode)
        {
            try
            {
                SPData _objSPData = new SPData();
                SqlCommand command = new SqlCommand(SP_HDGETACTIVITYMAPPEDFOREDIT);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                _objSPData.AddParamToSqlCommand(command, "@ComapanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@UserTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userTypeCode);
                _objSPData.AddParamToSqlCommand(command, "@ActivityCode", ParameterDirection.Input, SqlDbType.VarChar, 30, activityCodes);
                _objSPData.AddParamToSqlCommand(command, "@UserTypeActivityCode", ParameterDirection.Input, SqlDbType.VarChar, 30, mapCode);
                _objData.OpenConnection();
                string returnvalue = _objData.ExecuteScalar(command).ToString();
                _objData.CloseConnection();
                return Convert.ToInt32(returnvalue);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        //EditInsert
        public int updateUserTypeActivityMap(string companyCode, string userTypeCode, string activityCode, string startDate, string endDate, string mapCode, int SFC_Mandatory)
        {
            SPData _objSPData = new SPData();
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETUPDATEUSERTYPEACTIVITYMAP);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@UserTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userTypeCode);
                _objSPData.AddParamToSqlCommand(command, "@ActivityCode", ParameterDirection.Input, SqlDbType.VarChar, 30, activityCode);
                _objSPData.AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                _objSPData.AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);
                _objSPData.AddParamToSqlCommand(command, "@UserTypeActivityCode", ParameterDirection.Input, SqlDbType.VarChar, 30, mapCode);
                _objSPData.AddParamToSqlCommand(command, "@SfcMandatory", ParameterDirection.Input, SqlDbType.Int, 8, SFC_Mandatory);
                _objData.OpenConnection(companyCode);
                string returnvalue = _objData.ExecuteScalar(command).ToString();
                _objData.CloseConnection();
                return Convert.ToInt32(returnvalue);

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetUsersByUserType(string companyCode, string userTypeCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.UserModel> lstUser = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstUser = connection.Query<MVCModels.HiDoctor_Master.UserModel>(SP_HDGETUSERSBYUSERTYPE,
                                  new { CompanyCode = companyCode, UserTypeCode = userTypeCode },
                                  commandType: CommandType.StoredProcedure);
                    return lstUser;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        public IEnumerable<MVCModels.HiDoctor_Master.EmployeeModel> GetAllEmployeeDetails(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.EmployeeModel> lstEmp = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@userCode", userCode);
                    p.Add("@CompanyCode", companyCode);

                    lstEmp = connection.Query<MVCModels.HiDoctor_Master.EmployeeModel>(Sp_hdGetActiveEmployees, p, commandType: CommandType.StoredProcedure);
                    //totalPageCount = p.Get<int>("@TotalPageNo");
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstEmp;
        }

        public IEnumerable<MVCModels.HiDoctor_Master.EmployeeModel> GetAllEmployeeInactiveDetails(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.EmployeeModel> lstEmp = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@userCode", userCode);
                    p.Add("@CompanyCode", companyCode);

                    lstEmp = connection.Query<MVCModels.HiDoctor_Master.EmployeeModel>(Sp_hdGetInactiveEmployees, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstEmp;
        }


        public string DeleteEmployee(string companyCode, string employeeCode, string userCode, string updatedBy, string updatedDate, string resignationDate)
        {
            int rowsAffected = 0;
            string result = string.Empty;
            try
            {
                if (string.IsNullOrEmpty(userCode))
                {
                    using (IDbConnection connection = IDbOpenConnection())
                    {
                        IDbTransaction trans = connection.BeginTransaction();

                        string historyQuery = "INSERT INTO tbl_SFA_Employee_Master_History(Company_Code,History_Id,Employee_Code, " +
                                       "Employee_Name,Gender,Date_Of_Birth,Address,Address2,Address3,Phone,Mobile,Employee_Status, " +
                                       "Email_Id,Date_of_Joining,Employee_Number,EDN_Proof,Salary_Proof,Resume_Given, " +
                                       "Resignation_Submitted,Appointed,SCB_Account_Number, " +
                                       "ICICI_Account_Number,PF_Number,PAN_Number,Confirmation_Date,Employee_Entity_Type,Created_By, " +
                                       "Created_DateTime,Updated_By,Updated_DateTime,State_ID,City_ID,Pincode_Id,Department_Id)  " +
                                       "SELECT  " +
                                       "Company_Code,NEXT VALUE FOR SEQ_tbl_SFA_Employee_Master_History,Employee_Code,Employee_Name, " +
                                       "Gender,Date_Of_Birth,Address,Address2,Address3,Phone,Mobile,1, " +
                                       "Email_Id,Date_of_Joining,Employee_Number,EDN_Proof,Salary_Proof,Resume_Given, " +
                                       "Resignation_Submitted,Appointed,SCB_Account_Number, " +
                                       "ICICI_Account_Number,PF_Number,PAN_Number,Confirmation_Date,Employee_Entity_Type,Created_By, " +
                                       "Created_DateTime,'" + updatedBy + "',GETDATE(),State_ID,City_ID,Pincode_Id,Department_Id " +
                                       "FROM tbl_SFA_Employee_Master  WHERE " +
                                       "Company_Code='" + companyCode + "' AND Employee_Code='" + employeeCode + "'";
                        rowsAffected = connection.Execute(historyQuery, transaction: trans);
                        if (rowsAffected > 0)
                        {
                            rowsAffected = 0;
                            const string deleteQuery = "update tbl_SFA_Employee_Master set Employee_Status='1',Updated_DateTime= @Updated_DateTime, " +
                                                       "Updated_By=@Updated_By " +
                                                   "WHERE Employee_Code = @Employee_Code  and Company_Code=@Company_Code";
                            rowsAffected = connection.Execute(deleteQuery, new
                            {
                                Company_Code = companyCode,
                                Employee_Code = employeeCode,
                                Updated_DateTime = updatedDate,
                                Updated_By = updatedBy
                            },
                            transaction: trans);
                        }
                        if (rowsAffected > 0)
                        {
                            result = "SUCCESS:";
                        }
                        trans.Commit();
                    }
                }
                else
                {
                    result = UpdateUserStatus(companyCode, userCode, updatedBy, resignationDate);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("employeeCode", employeeCode);
                dicObj.Add("userCode", userCode);
                dicObj.Add("resignationDate", resignationDate);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return "FAILURE";
            }
            return result;
        }

        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetDisabledUsers(string companyCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.UserModel> lstUser = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstUser = connection.Query<MVCModels.HiDoctor_Master.UserModel>(SP_HDGETDISABLEDUSERS,
                                  new { CompanyCode = companyCode },
                                  commandType: CommandType.StoredProcedure);
                    return lstUser;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetSingleUserInfo(string companyCode, string userCode, string regionCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.UserModel> lstUser = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstUser = connection.Query<MVCModels.HiDoctor_Master.UserModel>(SP_HDGETSINGLEUSERINFO,
                                  new { CompanyCode = companyCode, UserCode = userCode, RegionCode = regionCode },
                                  commandType: CommandType.StoredProcedure);
                    return lstUser;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetSingleUserInfo(string companyCode, string userCode, string regionCode, string ConnectionString)
        {
            IEnumerable<MVCModels.HiDoctor_Master.UserModel> lstUser = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection(ConnectionString))
                {
                    lstUser = connection.Query<MVCModels.HiDoctor_Master.UserModel>(SP_HDGETSINGLEUSERINFO,
                                  new { CompanyCode = companyCode, UserCode = userCode, RegionCode = regionCode },
                                  commandType: CommandType.StoredProcedure);
                    return lstUser;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #region PaySlip

        public IEnumerable<MVCModels.HiDoctor_Master.PaySlipMetaDataModel> GetPaySlipMetaData(string companyCode,
            string userTypeCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.PaySlipMetaDataModel> lstPaySlipData = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstPaySlipData = connection.Query<MVCModels.HiDoctor_Master.PaySlipMetaDataModel>(SP_HDGETPAYSLIPMETADATA,
                                  new { Company_Code = companyCode, User_Type_Code = userTypeCode },
                                  commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userTypeCode", userTypeCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstPaySlipData;
        }


        public IEnumerable<MVCModels.HiDoctor_Master.PaySlipColDataTypeModel> GetPaySlipColDataType(string companyCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.PaySlipColDataTypeModel> lstPaySlipData = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstPaySlipData = connection.Query<MVCModels.HiDoctor_Master.PaySlipColDataTypeModel>(SP_HDGETCOLUMNDATATTYPEMASTER,
                                  new { @CompanyCode = companyCode },
                                  commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();

                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstPaySlipData;
        }

        public int UpdatePaySlipMetaData(string companyCode, List<MVCModels.HiDoctor_Master.PaySlipMetaDataModel> lstData, string userTypeCode)
        {
            int rowsAffected = 0;
            string result = string.Empty;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                    const string updateQuery = "UPDATE tbl_SFA_Payslip_MetaData SET Column_Name = @Column_Name,Label_Text =@Label_Text, " +
                                                "Column_Type = @Column_Type,Column_Data_Type = @Column_Data_Type, Horizontal_Align = @Horizontal_Align,Vertical_Align =@Vertical_Align, " +
                                                "Zone_Index = @Zone_Index,Row_Index =@Row_Index, Column_Index =@Column_Index  " +
                                                "WHERE Company_Code = @Company_Code AND User_Type_Code = @User_Type_Code AND Column_No = @Column_No";
                    rowsAffected = connection.Execute(updateQuery, lstData, transaction: trans);
                    const string Query = "UPDATE tbl_SFA_Payslip_MetaData SET Column_Name = NULL,Label_Text =NULL,User_Code='ALL', " +
                                                "Column_Type = NULL,Column_Data_Type = NULL,Horizontal_Align = NULL,Vertical_Align =NULL, " +
                                                "Zone_Index = NULL,Row_Index =NULL, Column_Index =NULL  " +
                                                "WHERE Company_Code = @Company_Code AND User_Type_Code = @User_Type_Code AND (Column_Name = '' " +
                                                "or Column_Name='NULL' OR Column_Name='null')";
                    int rows = connection.Execute(Query, lstData, transaction: trans);
                    trans.Commit();
                }

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userTypeCode", userTypeCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return 0;
            }
            return rowsAffected;
        }

        public IEnumerable<MVCModels.HiDoctor_Master.UserTypeModel> GetPaySlipMappedUserTypes(string companyCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.UserTypeModel> lstUserType = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstUserType = connection.Query<MVCModels.HiDoctor_Master.UserTypeModel>(SP_HDGETPAYSLIPDATAMAPPEDUSERTYPE,
                                  new { Company_Code = companyCode, },
                                  commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstUserType;
        }

        public int PaySlipInheritance(string companyCode, string sourceUserTypeCode, List<MVCModels.HiDoctor_Master.UserTypeModel> lstUserTypes)
        {
            int rowsAffected = 0;
            int rowsExists = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                    const string deleteQuery = "DELETE FROM tbl_SFA_Payslip_MetaData WHERE User_Type_Code=@User_Type_Code and Company_Code=@Company_Code";
                    rowsAffected = connection.Execute(deleteQuery, lstUserTypes, transaction: trans);
                    string insertQuery = "INSERT INTO tbl_SFA_Payslip_MetaData (Company_Code,User_Type_Code,User_Code,Column_No,Column_Name, " +
                                               "Label_Text,Column_Type,Horizontal_Align,Vertical_Align,Zone_Index, " +
                                               "Row_Index,Column_Index,Column_Data_Type,Record_Status) SELECT Company_Code,@User_Type_Code,User_Code,Column_No,  " +
                                               "Column_Name,Label_Text,Column_Type,Horizontal_Align,Vertical_Align,Zone_Index, " +
                                               "Row_Index,Column_Index,Column_Data_Type,Record_Status FROM tbl_SFA_Payslip_MetaData WHERE User_Type_Code='" + sourceUserTypeCode + "'" +
                                               "and  Company_Code=@Company_Code";
                    rowsAffected = connection.Execute(insertQuery, lstUserTypes, transaction: trans);
                    trans.Commit();
                }

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userTypeCode", sourceUserTypeCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return 0;
            }
            return rowsAffected;
        }

        public IEnumerable<MVCModels.HiDoctor_Reports.FullTreeDetailsModel> GetFullUserTreeDetails(string companyCode)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.FullTreeDetailsModel> lstFullTreedetails;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstFullTreedetails = connection.Query<MVCModels.HiDoctor_Reports.FullTreeDetailsModel>(SP_HDGETUSERFULLTREEDETAILS,

                                                                                    new
                                                                                    {
                                                                                        @CompanyCode = companyCode

                                                                                    },
                                                                                  commandType: CommandType.StoredProcedure);
                }
            }
            catch
            {
                throw;
            }
            return lstFullTreedetails;
        }

        public int UpdateEmployeeStatus(string companyCode, string employeeCode, string employeeStatus, string updatedBy, string updatedDate)
        {
            int rowsAffected = 0;
            string result = string.Empty;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                    string historyQuery = "INSERT INTO tbl_SFA_Employee_Master_History(Company_Code,History_Id,Employee_Code, " +
                                        "Employee_Name,Gender,Date_Of_Birth,Address,Phone,Mobile,Employee_Status, " +
                                        "Email_Id,Date_of_Joining,Employee_Number,EDN_Proof,Salary_Proof,Resume_Given, " +
                                        "Resignation_Submitted,Appointed,SCB_Account_Number, " +
                                        "ICICI_Account_Number,PF_Number,PAN_Number,Confirmation_Date,Employee_Entity_Type,Created_By, " +
                                        "Created_DateTime,Updated_By,Updated_DateTime)  " +
                                        "SELECT  " +
                                        "Company_Code,NEXT VALUE FOR SEQ_tbl_SFA_Employee_Master_History,Employee_Code,Employee_Name, " +
                                        "Gender,Date_Of_Birth,Address,Phone,Mobile," + employeeStatus + ", " +
                                        "Email_Id,Date_of_Joining,Employee_Number,EDN_Proof,Salary_Proof,Resume_Given, " +
                                        "Resignation_Submitted,Appointed,SCB_Account_Number, " +
                                        "ICICI_Account_Number,PF_Number,PAN_Number,Confirmation_Date,Employee_Entity_Type,Created_By, " +
                                        "Created_DateTime,'" + updatedBy + "',GETDATE() FROM tbl_SFA_Employee_Master  WHERE " +
                                        "Company_Code='" + companyCode + "' AND Employee_Code='" + employeeCode + "'";
                    rowsAffected = connection.Execute(historyQuery, transaction: trans);
                    if (rowsAffected > 0)
                    {
                        rowsAffected = 0;
                        const string deleteQuery = "update tbl_SFA_Employee_Master set Employee_Status=@Employee_Status,Updated_DateTime= @Updated_DateTime, " +
                                                   "Updated_By=@Updated_By WHERE Employee_Code = @Employee_Code  and Company_Code=@Company_Code";
                        rowsAffected = connection.Execute(deleteQuery, new
                        {
                            Company_Code = companyCode,
                            Employee_Code = employeeCode,
                            Employee_Status = employeeStatus,
                            Updated_DateTime = updatedDate,
                            Updated_By = updatedBy
                        },
                        transaction: trans);
                    }
                    trans.Commit();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("employeeCode", employeeCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return 0;
            }
            return rowsAffected;
        }
        public string InsertRemarks(string companyCode, string employeeCode, string Remarks, string User_Code, int Status)
        {
            string result = string.Empty;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {

                    var p = new DynamicParameters();
                    p.Add("@employeeCode", employeeCode);
                    p.Add("@Remarks", Remarks);
                    p.Add("@User_Code", User_Code);
                    p.Add("@Status", Status);
                    connection.Execute(SP_HD_INSERTRemarks, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {

            }
            return result;
        }

        public List<MVCModels.HiDoctor_Master.PayslipDataModel> GetpayslipDetail(string companyCode, string month, string year)
        {
            List<MVCModels.HiDoctor_Master.PayslipDataModel> lst = new List<MVCModels.HiDoctor_Master.PayslipDataModel>();
            try
            {
                List<MVCModels.HiDoctor_Master.PayslipEmployeeDetail> lstEmpDetail = null;
                List<MVCModels.HiDoctor_Master.PayslipColunmDetail> lstPayslipColunms = null;
                List<MVCModels.HiDoctor_Master.PayslipDetails> lstPayslipDetail = null;

                using (IDbConnection connection = IDbOpenConnection())
                {
                    using (var multi = connection.QueryMultiple(SP_HDGETPAYSLIPDETAIL,
                                  new { CompanyCode = companyCode, Month = month, Year = year },
                                  commandType: CommandType.StoredProcedure))
                    {
                        lstEmpDetail = multi.Read<MVCModels.HiDoctor_Master.PayslipEmployeeDetail>().ToList();
                        lstPayslipColunms = multi.Read<MVCModels.HiDoctor_Master.PayslipColunmDetail>().ToList();
                        lstPayslipDetail = multi.Read<MVCModels.HiDoctor_Master.PayslipDetails>().ToList();


                    }
                }

                MVCModels.HiDoctor_Master.PayslipDataModel objExp = new MVCModels.HiDoctor_Master.PayslipDataModel();
                objExp.lstEmpDetail = lstEmpDetail;
                objExp.lstpayslipColunm = lstPayslipColunms;
                objExp.lstPayslipDetail = lstPayslipDetail;
                lst.Add(objExp);

            }
            catch
            {
                throw;
            }
            return lst;
        }

        public List<MVCModels.HiDoctor_Master.PaySlipMetaDataModel> GetMetaDataDetails(string companyCode, string empNo)
        {
            List<MVCModels.HiDoctor_Master.PaySlipMetaDataModel> lstRefPayslipDetail = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstRefPayslipDetail = connection.Query<MVCModels.HiDoctor_Master.PaySlipMetaDataModel>(SP_HDGETUSERTYPEMETADATA,
                                  new { EmployeeNo = empNo, CompanyCode = companyCode },
                                  commandType: CommandType.StoredProcedure).ToList();
                    return lstRefPayslipDetail;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<MVCModels.HiDoctor_Master.PaySlipMetaDataModel> GetpaysliprefsheetDetail(string companyCode)
        {
            List<MVCModels.HiDoctor_Master.PaySlipMetaDataModel> lstRefPayslipDetail = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstRefPayslipDetail = connection.Query<MVCModels.HiDoctor_Master.PaySlipMetaDataModel>(SP_HDGETPAYSLIPMETTADATAREFSHEETDETAIL,
                                  new { CompanyCode = companyCode },
                                  commandType: CommandType.StoredProcedure).ToList();
                    return lstRefPayslipDetail;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string PayslipBulkCopy(string companyCode, DataTable dt, string subDomain)
        {
            string result = string.Empty;
            try
            {
                using (SqlConnection cn = _objData.GetConnectionObjectForSqlBulCopy(subDomain))
                {
                    cn.Open();
                    using (SqlBulkCopy copy = new SqlBulkCopy(cn))
                    {

                        for (int i = 0; i < dt.Columns.Count; i++)
                        {
                            copy.ColumnMappings.Add(dt.Columns[i].ColumnName, dt.Columns[i].ColumnName);

                        }
                        copy.DestinationTableName = TBL_SFA_PAYSLIP_DETAILS_STAGING;
                        copy.WriteToServer(dt);
                    }
                    cn.Close();
                }
                result = "SUCCESS";
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }

        public string InsertPayslipUpload(string companyCode, string guid, string fileName, string uploadedBy, string bpType, string subDomain)
        {
            SPData _objSPData = new SPData();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HDINSERTPAYSLIPFROMSTAGING);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 1000;
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@BP_Id", ParameterDirection.Input, SqlDbType.NVarChar, 100, guid);
                _objSPData.AddParamToSqlCommand(command, "@File_Name", ParameterDirection.Input, SqlDbType.NVarChar, 500, fileName);
                _objSPData.AddParamToSqlCommand(command, "@Uploaded_By", ParameterDirection.Input, SqlDbType.NVarChar, 30, uploadedBy);
                _objSPData.AddParamToSqlCommand(command, "@BP_Type", ParameterDirection.Input, SqlDbType.NVarChar, 30, bpType);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnectionAsync(subDomain);
                _objData.ExecuteNonQueryAsync(command);
                return result;
            }
            catch
            {
                result = "FAILURE:File is not proper manner";
            }

            return result;
        }


        public int ChangePaySlipMetadataStatus(string companyCode, string userTypeCode, string columnNo, string status)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();

                    const string updateQuery = "UPDATE tbl_SFA_Payslip_MetaData SET Record_Status=@Record_Status where User_Type_Code=@User_Type_Code " +
                                               "and Company_Code=@Company_Code and Column_No=@Column_No";
                    rowsAffected = connection.Execute(updateQuery, new
                    {
                        User_Type_Code = userTypeCode,
                        Company_Code = companyCode,
                        Column_No = columnNo,
                        Record_Status = status
                    }, transaction: trans);

                    trans.Commit();
                }

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userTypeCode", userTypeCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return 0;
            }
            return rowsAffected;
        }
        #endregion PaySlip

        public DataSet GetColumnNames(string companyCode)
        {
            try
            {
                SPData _objSPData = new SPData();
                SqlCommand command = new SqlCommand(SP_HDGETPAYSLIPCOLUMN);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objData.OpenConnection();
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }

        public bool InsertPaySlipDefiner(string companyCode, List<MVCModels.HiDoctor_Master.PaySlipDefinerModel> lstPaySlipDefiner)
        {
            bool isTrue = false;
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();

                    const string detailQuery = "INSERT INTO tbl_SFA_Payslip_MetaData(Company_Code,User_Type_Code,User_Code,Column_No,Column_Name,Label_Text,Column_Type,Horizontal_Align,Vertical_Align,Zone_Index,Row_Index,Column_Index,Record_Status) VALUES " +
                        " (@Company_Code,@User_Type_Code,@User_Code,@Column_No,@Column_Name,@Label_Text,@Column_Type,@Horizontal_Align,@Vertical_Align,@Zone_Index,@Row_Index,@Column_Index,@Record_Status)";
                    rowsAffected = connection.Execute(detailQuery, lstPaySlipDefiner, transaction: trans);

                    const string Query = "UPDATE tbl_SFA_Payslip_MetaData SET Column_Name = NULL,Label_Text =NULL,User_Code='ALL', " +
                                                "Column_Type = NULL,Horizontal_Align = NULL,Vertical_Align =NULL, " +
                                                "Zone_Index = NULL,Row_Index =NULL, Column_Index =NULL  " +
                                                "WHERE Company_Code = @Company_Code AND User_Type_Code = @User_Type_Code AND (Column_Name = '' " +
                                                "or Column_Name='NULL' OR Column_Name='null')";
                    int rows = connection.Execute(Query, lstPaySlipDefiner, transaction: trans);
                    trans.Commit();

                    if (rowsAffected > 0)
                    {
                        isTrue = true;
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return isTrue;
        }

        #region employee audit report

        public IEnumerable<MVCModels.HiDoctor_Master.EmployeeModel> GetEmployeeAuditReport(string companyCode, string fromDate, string toDate)
        {
            IEnumerable<MVCModels.HiDoctor_Master.EmployeeModel> lstEmp = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@From_Date", fromDate);
                    p.Add("@To_Date", toDate);
                    lstEmp = connection.Query<MVCModels.HiDoctor_Master.EmployeeModel>(SP_HDGETEMPLOYEEAUDITREPORT, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstEmp;
        }
        #endregion employee audit report
        public IEnumerable<MVCModels.TourPlannerModel> GetTourPlannerDetails(string companyCode, string userCode, int month, int year)
        {
            IEnumerable<MVCModels.TourPlannerModel> lstTp;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstTp = connection.Query<MVCModels.TourPlannerModel>(SP_hdGetTPFullDetails,
                                  new { CompanyCode = companyCode, UserCode = userCode, Month = month, Year = year },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstTp;
        }

        #region greytip integration

        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetChildUsersWithPayrollId(string companyCode, string userCode, int pageNumber,
            int pageSize, string searchKey, ref int totalPageCount)
        {
            IEnumerable<MVCModels.HiDoctor_Master.UserModel> lstUser = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    p.Add("@Page_Number", pageNumber);
                    p.Add("@Page_Size", pageSize);
                    p.Add("@Search_Key", searchKey);
                    p.Add("@TotalPageNo", totalPageCount, DbType.Int32, ParameterDirection.Output);
                    lstUser = connection.Query<MVCModels.HiDoctor_Master.UserModel>(SP_HDGETCHILDUSERSWITHPAYROLLID, p, commandType: CommandType.StoredProcedure);
                    totalPageCount = p.Get<int>("@TotalPageNo");
                    return lstUser;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetPayrollUsers(string companyCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.UserModel> lstUser = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    lstUser = connection.Query<MVCModels.HiDoctor_Master.UserModel>(SP_HDGETPAYROLLUSERS, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                    return lstUser;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }
        }

        public int InsertPayrollMapping(string companyCode, List<MVCModels.HiDoctor_Master.UserModel> lstInsertMenu,
            List<MVCModels.HiDoctor_Master.UserModel> lstUpdateMenu, string updatedDatetime, string updatedBy)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                    if (lstUpdateMenu != null)
                    {
                        if (lstUpdateMenu.Count > 0)
                        {
                            const string query = "IF((SELECT COUNT(1) FROM tbl_sfa_payroll_mapping WHERE User_Code=@User_Code) >0) BEGIN " +
                                                 "INSERT INTO tbl_SFA_Payroll_Mapping_History(Company_Code,User_Code,User_Name,Payroll_User_Id,Updated_By, " +
                                                 "Updated_Date,Created_By,Created_Date,Status,History_Updated_Date) " +
                                                 "select Company_Code,User_Code,User_Name,Payroll_User_Id,Updated_By, " +
                                                 "Updated_Date,Created_By,Created_Date,Status,GETDATE() from tbl_SFA_Payroll_Mapping where User_Code=@User_Code " +
                                                 " AND Company_Code = @Company_Code END";
                            rowsAffected = connection.Execute(query, lstUpdateMenu, transaction: trans);
                            rowsAffected = 0;
                            string updateQry = "IF((SELECT COUNT(1) FROM tbl_sfa_payroll_mapping WHERE User_Code=@User_Code) >0) BEGIN " +
                                             "UPDATE tbl_sfa_payroll_mapping SET Payroll_User_Id=@Payroll_User_Id, User_Name=@User_Name,  " +
                                             "Updated_Date='" + updatedDatetime + "',Updated_By='" + updatedBy + "',Status=@User_Status " +
                                             " where User_Code=@User_Code end else begin " +
                                             "insert into tbl_SFA_Payroll_Mapping(Company_Code,User_Code,User_Name,Payroll_User_Id,Created_By, " +
                                             "Created_Date,Status) values(" +
                                             "@Company_Code,@User_Code,@User_Name,@Payroll_User_Id, " +
                                             "'" + updatedBy + "','" + updatedDatetime + "',@User_Status) end";
                            rowsAffected = connection.Execute(updateQry, lstUpdateMenu, transaction: trans);
                        }
                    }
                    if (lstInsertMenu.Count > 0)
                    {
                        rowsAffected = 0;
                        string updateQry = "IF((SELECT COUNT(1) FROM tbl_sfa_payroll_mapping WHERE User_Code=@User_Code) >0) BEGIN " +
                                              "UPDATE tbl_sfa_payroll_mapping SET Payroll_User_Id=@Payroll_User_Id, User_Name=@User_Name,  " +
                                              "Updated_Date='" + updatedDatetime + "',Updated_By='" + updatedBy + "',Status=@User_Status " +
                                              " where User_Code=@User_Code end else begin " +
                                              "insert into tbl_SFA_Payroll_Mapping(Company_Code,User_Code,User_Name,Payroll_User_Id,Created_By, " +
                                              "Created_Date,Status) values(" +
                                              "@Company_Code,@User_Code,@User_Name,@Payroll_User_Id, " +
                                              "'" + updatedBy + "','" + updatedDatetime + "',@User_Status) end";
                        rowsAffected = connection.Execute(updateQry, lstInsertMenu, transaction: trans);
                    }
                    trans.Commit();
                    return rowsAffected;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return 0;
            }
        }
        #endregion greytip integration
        public IEnumerable<DivisionUserProducts> GetUserBasedOnDivisionAndUserType(string company_Code, string user_Type_Code, string division_Code)
        {
            IEnumerable<DivisionUserProducts> lstusers;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", company_Code);
                    p.Add("@Division_Code", division_Code);
                    p.Add("@User_Type_Codes", user_Type_Code);
                    lstusers = connection.Query<DivisionUserProducts>(SP_HDGETUSERSBASEDONUSERTYPEANDDIVISION, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }

            return lstusers;
        }

        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetUsersByUserName(string companyCode, string userName, string userCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.UserModel> lstUser = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Name", userName);
                    p.Add("@User_Code", userCode);
                    lstUser = connection.Query<MVCModels.HiDoctor_Master.UserModel>(SP_HD_UM_GETUSERSBYUSERNAME, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                    return lstUser;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return lstUser;
        }

        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetUsersByUserNameNew(string companyCode, string userName, string userCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.UserModel> lstUser = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Name", userName);
                    p.Add("@User_Code", userCode);
                    lstUser = connection.Query<MVCModels.HiDoctor_Master.UserModel>(SP_HD_UM_GETUSERSBYUSERNAMEEMPLOYEENAME, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                    return lstUser;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return lstUser;
        }

        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetImmediateChildUserForTree(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.UserModel> lstUser = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@UserCode", userCode);
                    lstUser = connection.Query<MVCModels.HiDoctor_Master.UserModel>(SP_HD_UM_GETIMMEDIATECHILDUSERS, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                    return lstUser;

                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return lstUser;
        }
        #region user type master migration

        public DataSet GetAllUserTypesForMigration(string companyCode)
        {
            DataSet ds = new DataSet();
            try
            {
                _objData.OpenConnection();
                {
                    dsUserTypes = _objData.getDataSet("" + EXEC + "  " + SP_HD_UTM_GETALLUSERTYPESFORMIGRATION + "  '" + companyCode + "'");
                    dsAllUserTypes = dsUserTypes.Clone();
                    dsAllUserTypes.Tables[0].Columns.Add("Company_Code", typeof(String));
                    dsAllUserTypes.Tables[0].Columns.Add("Created_By", typeof(String));
                    dsAllUserTypes.Tables[0].Columns.Add("GUID", typeof(String));
                }
            }
            finally
            {
                _objData.CloseConnection();
            }
            return dsUserTypes;
        }

        public DataSet GetUserTypesHierarchyDataset(string companyCode, string strUserTypeCode, string enteredBy, string Guid)
        {
            DataRow[] dr;
            string parentCode = string.Empty;
            string childCode = string.Empty;
            dr = dsUserTypes.Tables[0].AsEnumerable().Where(c => c["Under_User_Type"].ToString() == strUserTypeCode).ToArray();
            DataRow[] temp;
            if (dr.Length > 0)
            {
                foreach (DataRow drr in dr)
                {

                    parentCode = drr["Under_User_Type"].ToString();
                    childCode = drr["User_Type_Code"].ToString();
                    DataRow drTemp = dsAllUserTypes.Tables[0].NewRow();
                    drTemp["Under_User_Type"] = drr["Under_User_Type"].ToString();
                    drTemp["User_Type_Code"] = drr["User_Type_Code"].ToString();
                    drTemp["User_Type_ID"] = drr["User_Type_ID"].ToString();
                    drTemp["Under_User_Type_ID"] = drr["Under_User_Type_ID"].ToString();
                    drTemp["Created_By"] = enteredBy;
                    drTemp["GUID"] = Guid;
                    dsAllUserTypes.Tables[0].Rows.Add(drTemp);
                    dsAllUserTypes.AcceptChanges();
                    if (parentCode != childCode)
                    {
                        GetUserTypesHierarchyDataset(companyCode, childCode, enteredBy, Guid);
                    }
                }
            }
            return dsAllUserTypes;
        }


        public string UserTypeBulkTempInsert(string companyCode, DataTable dt, string mode)
        {
            string result = string.Empty;
            try
            {
                using (SqlConnection cn = _objData.GetConnectionObject(companyCode))
                {
                    cn.Open();
                    using (SqlBulkCopy copy = new SqlBulkCopy(cn))
                    {
                        copy.ColumnMappings.Add("Company_Code", "Company_Code");
                        copy.ColumnMappings.Add("User_Type_Code", "User_Type_Code");
                        copy.ColumnMappings.Add("Under_User_Type", "Under_User_Type");
                        copy.ColumnMappings.Add("User_Type_ID", "User_Type_ID");
                        copy.ColumnMappings.Add("Under_User_Type_ID", "Under_User_Type_ID");
                        if (mode.ToUpper() == "MIGRATION")
                        {
                            copy.ColumnMappings.Add("User_Type_Seq_Index", "User_Type_Seq_Index");
                        }
                        copy.ColumnMappings.Add("User_Type_Full_Index", "User_Type_Full_Index");
                        copy.ColumnMappings.Add("Created_By", "Created_By");
                        copy.ColumnMappings.Add("GUID", "GUID");
                        copy.ColumnMappings.Add("User_Type_Display_Order", "User_Type_Display_Order");
                        copy.DestinationTableName = "tbl_SFA_User_Type_Master_Temp";
                        copy.WriteToServer(dt);
                    }
                    cn.Close();
                }
                result = "SUCCESS";
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }

        public string UpdateUserTypeIndexFromTemptoUserMaster(string companyCode, string mode, string guid, string userCode)
        {

            SPData _objSPData = new SPData();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HDUPDATEUSERTYPEINDEXFROMTEMPTOMASTER);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 1000;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Mode", ParameterDirection.Input, SqlDbType.VarChar, 30, mode);
                _objSPData.AddParamToSqlCommand(command, "@GUID", ParameterDirection.Input, SqlDbType.VarChar, 200, guid);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                result = returnValue.Value.ToString();
                return result;
            }
            catch
            {
                result = "FAILURE:";
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }
        #endregion user type master migrtaion

        public IEnumerable<StateModel> GetStateDetails()
        {
            IEnumerable<StateModel> lstState = null;

            using (IDbConnection connection = IDbOpenConnection())
            {
                lstState = connection.Query<StateModel>(SP_HD_GETSTATEDETAILS, commandType: CommandType.StoredProcedure);
                connection.Close();
                return lstState;
            }

        }

        public IEnumerable<StateModel> GetEmpStateDetails()
        {
            IEnumerable<StateModel> lstState = null;

            using (IDbConnection connection = IDbOpenConnection())
            {
                lstState = connection.Query<StateModel>(SP_HD_GETEMPSTATEDETAILS, commandType: CommandType.StoredProcedure);
                connection.Close();
                return lstState;
            }

        }


        public string InsertNewStateDetails(string usercode, string statename)
        {
            string result = string.Empty;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {

                    var p = new DynamicParameters();
                    p.Add("@usercode", usercode);
                    p.Add("@statename", statename);
                    connection.Execute(SP_HD_INSERTUSERSTATE, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);

            }
            return result;
        }
        public IEnumerable<CityModel> GetCitiesDetails(int State_ID)
        {
            IEnumerable<CityModel> lstCities = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@State_Id", State_ID);
                    lstCities = connection.Query<CityModel>(SP_HD_CITYDETAILS, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstCities;
        }
        public IEnumerable<CityModel> GetEmpCitiesDetails(int State_ID)
        {
            IEnumerable<CityModel> lstCities = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@State_Id", State_ID);
                    lstCities = connection.Query<CityModel>(SP_HD_EMPCITYDETAILS, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstCities;
        }
        public string InsertNewCityDetails(string usercode, string cityname, int state_id)
        {
            string result = string.Empty;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@StateId", state_id);
                    p.Add("@usercode", usercode);
                    p.Add("@cityname", cityname);
                    connection.Execute(SP_HD_ADDCITYNAME, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return result;
        }
        public IEnumerable<PincodeModel> GetPincodeDetails(int State_ID, int City_Id)
        {
            IEnumerable<PincodeModel> lstPincodes = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@State_Id", State_ID);
                    p.Add("@City_Id", City_Id);
                    lstPincodes = connection.Query<PincodeModel>(SP_HD_GETPINCODE, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return lstPincodes;
        }
        public string InsertPincode(string usercode, int Pincode, int state_id, int cityId)
        {
            string result = string.Empty;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@usercode", usercode);
                    p.Add("@pincode", Pincode);
                    p.Add("@state_Id", state_id);
                    p.Add("@City_Id", cityId);
                    connection.Execute(SP_HD_ADDPINCODE, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);

            }
            return result;
        }
        public IEnumerable<DepartmentModel> GetDepartmentDetails()
        {

            IEnumerable<DepartmentModel> lstDept = null;

            using (IDbConnection connection = IDbOpenConnection())
            {
                lstDept = connection.Query<DepartmentModel>(SP_HD_GETDEPARTMENTDETAILS, commandType: CommandType.StoredProcedure);
                connection.Close();
                return lstDept;
            }
        }
        public string InsertNewDept(string usercode, string Department)
        {
            string result = string.Empty;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@usercode", usercode);
                    p.Add("@Department_Name", Department);
                    connection.Execute(SP_HD_ADDDEPARTMENTNAME, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);

            }
            return result;
        }

        public DataSet DownloadSubList(string companyCode)
        {
            DataSet Ds = new DataSet();
            SPData _objSPData = new SPData();
            try
            {
                _objData.OpenConnection();
                {
                    Ds = _objData.ExecuteDataSet("" + EXEC + " " + SP_HD_Getstatecitypincodelst + "'" + companyCode + "'");
                }
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return Ds;
        }
        public DataSet DownloadMasterList(string companyCode)
        {
            DataSet Ds = new DataSet();
            SPData _objSPData = new SPData();
            try
            {
                _objData.OpenConnection();
                {
                    Ds = _objData.ExecuteDataSet("" + EXEC + " " + SP_HD_GetMasterDatalst + "'" + companyCode + "'");
                }
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return Ds;
        }

        public List<PasswordPrivValues> checkPasswordPrivilge(string companyCode, string usertypename)
        {
            List<PasswordPrivValues> lstresult = new List<PasswordPrivValues>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@companycode", companyCode);
                    p.Add("@usertype", usertypename);
                    lstresult = connection.Query<PasswordPrivValues>(Sp_hd_PassPrivilegeValues, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstresult;
        }

        public List<PasswordDetails> checkCurrentPassword(string companyCode, string usercode)
        {
            List<PasswordDetails> Current_Password = new List<PasswordDetails>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@companyCode", companyCode);
                    p.Add("@userCode", usercode);
                    Current_Password = connection.Query<PasswordDetails>(Sp_hdGetCurrentPassword, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Current_Password;
        }

        public List<PasswordDetails> checkPasswordHistory(string companyCode, string usercode, string historyCount)
        {
            List<PasswordDetails> lstHistory = new List<PasswordDetails>();
            List<PasswordDetails> Passwordlst = new List<PasswordDetails>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@UserCode", usercode);
                    p.Add("@HistoryCount", historyCount);
                    lstHistory = connection.Query<PasswordDetails>(sp_hdGetPasswordHistory, p, commandType: CommandType.StoredProcedure).ToList();
                    List<PasswordDetails> lsCurrentPassword = checkCurrentPassword(companyCode, usercode);
                    Passwordlst = lsCurrentPassword.Concat(lstHistory).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Passwordlst;
        }

        public List<PasswordDetails> GetUnderusercode(string companyCode, string userCode)
        {
            List<PasswordDetails> lstUnderuser = new List<PasswordDetails>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@UserCode", userCode);
                    lstUnderuser = connection.Query<PasswordDetails>(sp_hdGetUnderusercode, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstUnderuser;
        }

        public List<string> GetUserEmailID(string companyCode, string userCode)
        {
            List<string> lstUserEmailID = new List<string>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@UserCode", userCode);
                    lstUserEmailID = connection.Query<string>(SP_HD_GET_Users_EmailID, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstUserEmailID;
        }
        public bool GetCheckEmployeeStatus(string companyCode, string employeeNUmber)
        {
            bool result = false;
            int exists = 0;
            try
            {
                SPData _objSPData = new SPData();

                SqlCommand command = new SqlCommand(USP_hdGetCheckEmployeeNumberStatus);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Employee_Number", ParameterDirection.Input, SqlDbType.VarChar, 30, employeeNUmber);
                _objData.OpenConnection();
                exists = Convert.ToInt32(_objData.ExecuteScalar(command));
                _objData.CloseConnection();
                result = exists == 0 ? false : true;
                return result;
            }
            catch
            {
                return result;
            }
        }
        public static DataTable ToDataTable<T>(List<T> items)
        {
            DataTable dataTable = new DataTable(typeof(T).Name);

            //Get all the properties
            PropertyInfo[] Props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
            foreach (PropertyInfo prop in Props)
            {
                //Defining type of data column gives proper data table 
                var type = (prop.PropertyType.IsGenericType && prop.PropertyType.GetGenericTypeDefinition() == typeof(Nullable<>) ? Nullable.GetUnderlyingType(prop.PropertyType) : prop.PropertyType);
                //Setting column names as Property names
                dataTable.Columns.Add(prop.Name, type);
            }
            foreach (T item in items)
            {
                var values = new object[Props.Length];
                for (int i = 0; i < Props.Length; i++)
                {
                    //inserting property values to datatable rows
                    values[i] = Props[i].GetValue(item, null);
                }
                dataTable.Rows.Add(values);
            }
            //put a breakpoint here and check datatable
            return dataTable;
        }

        public IEnumerable<UserInfo> GetUserDetailsForHDAccess(string LoginUserCode)
        {

            IEnumerable<UserInfo> lstUserInfo = null;

            using (IDbConnection connection = IDbOpenConnection())
            {
                var p = new DynamicParameters();
                p.Add("@LoginUserCode", LoginUserCode);
                lstUserInfo = connection.Query<UserInfo>("SP_HD_Get_AllUsers", p, commandType: CommandType.StoredProcedure).ToList();
                connection.Close();
                return lstUserInfo;
            }
        }

        public IEnumerable<HDAccessDetails> GetHDAccessUsersDetails(string LoginUserCode)
        {

            IEnumerable<HDAccessDetails> lstHDAccessDetails = null;

            using (IDbConnection connection = IDbOpenConnection())
            {
                var p = new DynamicParameters();
                p.Add("@LoginUserCode", LoginUserCode);
                lstHDAccessDetails = connection.Query<HDAccessDetails>("SP_HD_Get_HD_Access_User_Details", p, commandType: CommandType.StoredProcedure).ToList();
                connection.Close();
                return lstHDAccessDetails;
            }
        }

        public IEnumerable<SingleDeviceGUID> GetSingleDeviceEntriesByGuid(string LoginUserCode)
        {

            IEnumerable<SingleDeviceGUID> lstUserInfo = null;

            using (IDbConnection connection = IDbOpenConnection())
            {
                var p = new DynamicParameters();

                p.Add("@LoginUserCode", LoginUserCode);
                lstUserInfo = connection.Query<SingleDeviceGUID>("SP_HD_Get_SingleDeviceLockEntriesByGUID", p, commandType: CommandType.StoredProcedure).ToList();
                connection.Close();
                return lstUserInfo;
            }
        }

        public IEnumerable<BloodGroup> GetBloodgroupName(string Company_code)
        {

            IEnumerable<BloodGroup> lstUserInfo = null;

            using (IDbConnection connection = IDbOpenConnection())
            {
                var p = new DynamicParameters();

                p.Add("@Company_code", Company_code);
                lstUserInfo = connection.Query<BloodGroup>(SP_HD_GET_Blood_Group_Names, p, commandType: CommandType.StoredProcedure).ToList();
                connection.Close();
                return lstUserInfo;
            }
        }
    }
}
