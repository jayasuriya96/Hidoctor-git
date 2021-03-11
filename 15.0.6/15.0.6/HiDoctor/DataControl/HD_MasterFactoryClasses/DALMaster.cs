using DataControl.EnumType;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using System.Reflection;
using MVCModels;
using Dapper;
using Microsoft.SqlServer.Server;
using MVCModels.HiDoctor_Master;

namespace DataControl
{
    public class DALMaster : DapperRepository
    {
        Data _objData;
        SPData _objSPData;
        SqlDataReader sqldataReader;

        #region Constant Strings
        const string SP_HDGETMAXCODE = "SP_hdGetMaxCode";
        const string SP_HD_GetActivityMaster = "SP_HD_GetActivityMaster";
        const string SP_HD_InserActivityMaster = "SP_HD_InserActivityMaster";
        const string SP_HD_UpdateActivityMaster = "SP_HD_UpdateActivityMaster";
        const string SP_HD_ChangeStatuSForActivityMaster = "SP_HD_ChangeStatuSForActivityMaster";
        const string SP_HD_GetExpenseEntityMaster = "SP_HD_GetExpenseEntityMaster";
        const string SP_HD_InsertExpenseEntity = "SP_HD_InsertExpenseEntity";
        const string SP_HD_UpdateExpenseEntity = "SP_HD_UpdateExpenseEntity";
        const string SP_HD_ChangestatusforExpenseEntityMaster = "SP_HD_ChangestatusforExpenseEntityMaster";
        const string SP_HD_GetUserTypeMaster = "SP_HD_GetUserTypeMaster";
        const string SP_HD_GetUnderUserType = "SP_HD_GetUnderUserType";
        const string SP_HD_ChangestatusforUserType = "SP_HD_ChangestatusforUserType";
        const string SP_HD_InsertUserType = "SP_HD_InsertUserType";
        const string SP_HD_UpdateUserType = "SP_HD_UpdateUserType";
        const string sp_edTagUserType = "sp_edTagUserType";
        const string SP_hdGetDistanceFareMapping = "SP_hdGetDistanceFareMapping";
        const string SP_HDGETDISTANCEMATRIXVALUES = "SP_hdGetDistanceMatrixValues";
        const string SP_hdInsertDistanceFareMapping = "SP_hdInsertDistanceFareMapping";
        const string SPHDGETPROJECTACTIVITYDET = "sp_hdGetProjectActivityDet";
        const string SPHDGETPROJECTACTIVITYMAPPING = "sp_hdGetProjectActivityMapping";
        const string SPHDINSERTPROJECTACTIVITYMAPPING = "sp_hdInsertProjectActivityMapping";
        const string SPHDUPDATEPROJECTACTIVITY = "sp_hdUpdateProjectActivity";
        const string SP_HDGETREGIONTYPE = "SP_hdGetRegionType";
        const string SP_HDREGIONTYPETABLE = "SP_HdRegionTypeTable";
        const string SP_HDINSERTREGIONTYPE = "SP_HdInsertRegionType";
        const string SP_HDREGIONTYPECHANGESTATUS = "SP_hdRegionTypeChangeStatus";
        const string SP_HDUPDATEREGIONTYPE = "SP_hdUpdateRegionType";
        const string SP_HD_UpdateHiDoctorStartDate = "SP_HD_UpdateHiDoctorStartDate";
        const string Sp_hdInsertDFCExcelFromStaging = "Sp_hdInsertDFCExcelFromStaging";

        const string SP_hdGetRegionCategory = "SP_hdGetRegionCategory";
        const string sp_hdInsertRegionCategory = "sp_hdInsertRegionCategory";
        const string sp_hdUpdateRegionCategory = "sp_hdUpdateRegionCategory";
        const string SP_HdGetMaxRowversionNo = "SP_HdGetMaxRowversionNo";
        const string SP_HDGETSFCREGIONS = "SP_HDGetSFCRegions";
        const string SP_HDCHECKSFCEXIST = "SP_HDCheckSFCExist";
        const string SP_HDINSERTSFC = "SP_HDInsertSFC";
        const string SP_HDGETSELECTEDSFC = "SP_HDGetSelectedSFC";
        const string SP_HdGetProjectdetails = "SP_HdGetProjectdetails";
        const string SP_HdGetProjectLead = "SP_HdGetProjectLead";
        const string SP_HdGetClient = "SP_HdGetClient";
        const string SP_HdGetDomain = "SP_HdGetDomain";
        const string SP_HdcheckprojectNameforInsert = "SP_HdcheckprojectNameforInsert";
        const string SP_hdGetMaxCode = "SP_hdGetMaxCode";

        const string SP_HD_GetLeaveDeatils = "SP_HD_GetLeaveDeatils";
        const string SP_HdGetDomainDetails = "SP_HdGetDomainDetails";
        const string SP_HdGetFeatureDetails = "SP_HdGetFeatureDetails";
        const string SP_HdGetCycledetails = "SP_HdGetCycledetails";

        const string SPHDGETPRODUCT = "SP_HdGetProduct";
        const string SPHDGETREGIONTYPE = "SP_hdGetRegionType";
        const string SPHDGETREGIONFORPRODUCTPRICE = "SP_HdGetRegionForProductPrice";
        const string SPHDGETPRODUCTPRICEDETAILS = "SP_HdGetProductpriceDetails";
        const string SPHDGETSTATUSMASTERDETAILS = "SP_HdGetStatusMasterDetails";
        const string SPHDGETREQUESTMASTERDETAILS = "SP_HdGetRequestMasterDetails";
        const string SPHDGETCYCLES = "SP_HdGetCycles";

        const string SP_HDGETUSERPROJECT = "SP_HDGetUserProject";
        const string SP_HDGETUSERPROJECTMAPDETAILS = "SP_HdGetUserProjectMapDetails";
        const string SP_HDGETCHILDUSERTYPES = "SP_hdGetChildUserTypes";
        const string SP_HDGETREQUEST = "SP_HdGetRequest";
        const string SP_HDGETREQUESTUSERTYPEMAPVALUES = "Sp_hdGetRequestUserTypeMapValues";
        const string SP_HDGETDIVISIONS = "SP_hdGetDivisions";
        const string SP_HDGETUSERDIVISIONS = "SP_hdGetUserDivisions";
        const string SP_HDGETUSERTYPELIST = "SP_HdGetUserTypeList";
        const string SP_HDGETUNDERUSERTYPELIST = "SP_HdGetUnderUserTypeList";
        const string SP_hdGetUsersByUserTypeAndDivision = "SP_hdGetUsersByUserTypeAndDivision";
        const string SP_HDGETDIVUSERPRODUCTPRIVALEGEVALUE = "SP_hdGetDivUserProductPrivalegeValue";
        const string SP_HDGETDIVISIONUSERPRODUCTMAPDETAIL = "SP_HdGetDivisionUserproductMapDetail";
        const string SP_HDGETDIVUSERPROASSIGNEDPRODUCT = "SP_hdGetDivUserProAssignedProduct";
        const string SPHDSTATUSCYCLEMAPPING = "sp_hdStatusCycleMapping";

        const string SP_hd_Getdoctorcategory = "SP_hd_Getdoctorcategory";
        const string SP_hdGetDivisions = "SP_hdGetDivisions";
        const string SPHDGETHIDOCTORSTARTDATE = "SP_HdGethidoctorStartDate";
        const string SP_HDGETUSERINFOFORSMS = "Sp_hdGetUserInfoForSMS";
        const string SP_HDGETSENTSMSDETAILS = "Sp_hdGetSentSMSDetails";
        const string SP_HDGETUSERCODE = "Sp_hdGetUserCode";
        const string SP_HDSENTSMSLOG = "Sp_hdSentSMSLog";
        const string SP_HdGetHiDoctorStartDateDetails = "SP_HdGetHiDoctorStartDateDetails";
        const string SP_HDGETUSERPROJECTMAPPEDFULLDETAILS = "SP_HdGetUserProjectMappedfullDetails";
        const string SP_HDRegion_Classification_ReferenceKey_2 = "SP_HDRegion_Classification_ReferenceKey_2";

        //Sub Region Master
        const string SP_HDGETSUBREGIONMASTER = "SP_HdGetSubRegionMaster";

        //LeaveBalance Update
        const string SP_HDGETEMPLOYEEDETAILS = "SP_HdGetEmployeeDetails";
        const string SP_HDGETLEAVETYPENAME = "SP_HdGetLeaveTypeName";
        const string SP_HDGETLEAVEBALANCEUPDATEFORUSER = "SP_HdGetLeaveBalanceUpdateforUser";
        const string SP_HDGETCHECKLEAVEBALANCE = "SP_HdGetCheckLeaveBalance";

        const string SP_HDGETALUMINIUSERDETAIL = "SP_hdGetAluminiUserDetail";

        //Privilege_New Master
        #region privilege Master
        const string SP_HDGETACTIVEPRIVILEGEVALUE = "SP_HdGetActivePrivilegeValue";
        const string SP_HDGETALLPRIVIELGEVALUE = "SP_HdGetAllPrivielgeValue";
        const string SP_HDGETACTIVEFEATURE = "SP_HdGetActiveFeature";
        const string SP_HDGETALLPRIVILEGESFROMMASTER = "SP_HdGetAllPrivilegesFromMaster";
        const string SP_HDGETACTIVEPRIVILEGEMASTERVALUES = "SP_HdGetActivePrivilegeMasterValues";
        const string SP_HDGETPRIVILEGEMASTER_NEW = "SP_HdGetPrivilegeMaster_New";
        const string SP_HDGETCOLUMNNAMES = "SP_HdGetColumnNames";
        const string SP_HDGETPRIVILEGEMASTERBYPRIVILEGECODE = "SP_HdGetPrivilegeMasterbyPrivilegeCode";
        const string SP_HDCHECKPRIVILEGENAME = "SP_HdCheckPrivilegeName";
        const string SP_HDGETCHILDUSERSDCRAPPLIEDSTATUS = "SP_HdGetChildUsersDCRAppliedStatus";

        #endregion privilege Master

        #region usertype privilege mapping
        const string SP_HDGETUSERTYPEPRIVILEGEMAPPING = "SP_hdGetUserTypePrivilegeMapping";
        const string SP_HDGETMAPPINGDETAILSBYPRIVILEGECODE = "SP_hdGetMappingDetailsByPrivilegeCode";
        const string SP_HDGETPRIVILEGEVALUEBYPRIVILEGECODE = "SP_hdGetPrivilegeValueByPrivilegeCode";
        const string SP_HDGETPRIVILEGEDETAILS = "SP_hdGetPrivilegeDetails";
        const string SP_HDGETPRIVILEGEMAPPINGLOG = "SP_hdGetPrivilegeMappingLog";
        const string SP_SDGETMAPPINGDETAILSBYPRIVILEGECODE = "SP_SDGETMAPPINGDETAILSBYPRIVILEGECODE";
        const string SP_SDGETUSERTYPEPRIVILEGEMAPPINGDETAILS = "SP_sdGetUserTypePrivilegeMappingDetails";
        const string SP_SDGETMAPPINGDETAILSFORPRIVILEGECODE = "SP_sdGetMappingDetailsforPrivilegeCode";
        const string Sp_SingleActivityPerDayValue = "Sp_SingleActivityPerDayValue";
        #endregion usertype privilege mapping

        //Request Screen-DCR Restrict
        const string SP_HDGETREQUESTCATEGORY = "SP_HdGetRequestCategory";
        const string SP_HDGETDCRRESTRICTIONREQUEST = "SP_HdGetDCRRestrictionRequest";
        const string SP_HDCHECKWAUSER = "sp_hdCheckWAUser";

        const string SP_HDGETREQUESTCATEGORYDETAIL = "SP_HdGetRequestCategoryDetail";
        //MyProfile
        const string SP_HDGETMYPROFILEDEATILS = "SP_HdGetMyProfileDeatils";

        //API
        const string SP_HDGETAPICATEGORYDETAIL = "SP_hdGetAPICategoryDetail";
        const string SP_HDGETAPICATEGORY = "SP_hdGetAPICategory";

        #region menu master
        const string SP_HDGETMENUITEMS = "SP_hdGetMenuItems";
        const string SP_HDGETPARENTMENUITEMS = "SP_hdGetParentMenuItems";
        const string SP_HDGETSELECTEDMENUDETAILS = "SP_hdGetSelectedMenuDetails";
        const string SP_HDGETUSERTYPEMENUACCESS = "SP_hdGetUserTypeMenuAccess";
        const string SP_HDGETMENUMAPPEDUSERTYPES = "SP_hdGetMenuMappedUserTypes";
        const string SP_HDGETUSERMENUACCESSLOG = "SP_hdGetUserMenuAccessLog";
        const string SP_HDCHECKMENUURL = "SP_hdCheckMenuUrl";
        const string SP_HDM_GETMENUACCESSFORMOBILE = "SP_HDM_GetMenuAccessforMobile";
        #endregion menu master

        const string SP_HDAPIGETSERVICEDETAIL = "SP_HdAPIGetServiceDetail";
        const string SP_APIGETCOMPANYACCESSDETAIL = "SP_APIGetCompanyAccessDetail";
        const string SP_HDGETAPIUIDEFDETAIL = "SP_HDGetApiUidefDetail";

        //User Product Mapping     
        #endregion Constant Strings


        // Check Privilege
        const string SP_SFA_GetlstPrivilege = "SP_SFA_GetlstPrivilege";
        const string SP_SFA_GetlstPrivilege_ApprovalUser = "SP_SFA_GetlstPrivilege_ApprovalUser";
        const string SP_SFA_GetlstPrivilege_UnApprovalUser = "SP_SFA_GetlstPrivilege_UnApprovalUser";
        const string SP_SFA_GetlstPrivilege_ApprovalUser_Report = "SP_SFA_GetlstPrivilege_ApprovalUser_Report";
        //
        const string SP_SFA_GetlstRatingConfig = "SP_SFA_GetlstRatingConfig";

        const string Sp_hd_UpdateProfileDetails = "Sp_hd_UpdateProfileDetails";
        //GetUserModel
        const string SP_hdGetUserMaster = "SP_hdGetUserMaster";

        const string SP_HDGETPRODUCTSANDNONSAMPLE = "SP_HdGetProductsandNonsample";
        const string SP_HDGETPRODUCTS = "SP_HdGetProducts";
        const string SP_HDGETASSIGNEDPRODUCTS = "SP_HdGetAssignedProducts";
        const string SP_HDGETINWARDEXCELDATAUSERBASED = "SP_HDGetInwardExcelDataUserBased";
        const string SP_HDGETUNMAPPEDDIVISIONPRODUCTS = "SP_HDGetUnmappedDivisionProducts";
        const string SP_HDGETCONFIGDETAILS = "SP_hdGetConfigDetails";
        const string SP_HDGETSELECTEDCONFIGDETAILS = "SP_hdGetSelectedConfigDetails";
        const string SP_HDGETAPPDETAILS = "SP_hdGetAppDetails";
        const string SP_HDGETAPPMAPPDETAILS = "SP_hdGetAppMappDetails";
        const string SP_HDGETAPPMAPPEDUSERDETAILS = "SP_hdGetAppMappedUserDetails";
        const string SP_HDGETDISTANCEFAREMAPPING_NEW = "SP_hdGetDistanceFareMapping_NEW";
        const string SP_HDGETCHILDUSERSDCRAPPLIEDSTATUSCURRENTMONT = "SP_HdGetChildUsersDCRAppliedStatusCurrentMont";
        const string SP_HDGETCUSTOMERMASTERDUPLICATIONCHECKCOUNT = "SP_HdGetCustomerMasterDuplicationCheckCount";
        const string SP_HDRegion_Classification_ReferenceKey_1 = "SP_HDRegion_Classification_ReferenceKey_1";
        const string Sp_Hd_GetHiDoctorActualDate = "Sp_Hd_GetHiDoctorActualDate";

        //My Documents
        const string SP_HD_MYDOC_GETDOCUMENTTYPES = "SP_HD_MyDoc_GetDocumentTypes";
        const string SP_HD_MYDOC_GETDOCUMENTBYDOCTYPEID = "SP_HD_Mydoc_GetDocumentbyDocTypeid";
        const string SP_HD_GETMYDOCTYPES = "SP_HD_GetMyDocTypes";
        const string SP_HD_GETUPLOADEDFILESCOUNT = "SP_HD_GetUploadedFilesCount";
        const string SP_HD_MYDOC_GETINVALIDFILES = "SP_HD_MyDoc_GetInvalidFiles";
        const string SP_HDGETSFCREGIONBASEDDETAIL = "SP_HDGetSFCFromRegionBasedDetail";
        const string SP_HDGETSFTOREGIONBASEDDETAIL = "SP_HDGetSFToRegionBasedDetail";
        const string SP_GetAppMenuDet = "SP_GetAppMenuDet";
        const string SP_GetAppMenuDetByUserType = "SP_GetAppMenuDetByUserType";
        const string SP_GETKIREGIONTYPE = "sp_GetKIRegionType";
        const string SP_GETKIUSERTYPE = "sp_GetKIUserType";

        //Leave Balance Upload
        const string SP_HD_Insert_Leave_Balance_From_Staging_To_Master = "SP_HD_Insert_Leave_Balance_From_Staging_To_Master";


        #region Inward Adjustment
        const string SP_GetUserDeliveryChallan = "SP_GetUserDeliveryChallan";
        const string SP_DeliveryChallanInfo = "SP_DeliveryChallanInfo";
        const string SP_HD_GetRemarksHistoryForInward = "SP_HD_GetRemarksHistoryForInward";
        #endregion

        #region SFC Check
        const string SP_HD_CHECKSFCFORREGION = "SP_HD_CheckSFCforRegion";
        #endregion SFC Check

        //Division User Product Mapping
        const string SP_HD_INSERTDIVISIONUSERPRODUCTS = "SP_HD_InsertDivisionUserProducts";
        const string SP_HD_GETINWARDACK = "SP_HD_GetInwardAck";
        const string SP_HD_GET_USERPRODUCT = "SP_HD_GET_UserProduct";

        const string SP_HD_RegionClassificationChangeStatus = "SP_HD_RegionClassificationChangeStatus";
        const string SP_HD_CheckRefkey1 = "SP_HD_CheckRefkey1";
        const string SP_HD_CheckRefkey2 = "SP_HD_CheckRefkey2";
        const string SP_GETUSERDETAILS_KENNECTWEB = "SP_GetUserdetails_KennectWeb";
        const string SP_HD_GetLeavePrivilegeForSelectedUser = "SP_HD_GetLeavePrivilegeForSelectedUser";

        //Document Upload
        const string SP_HD_Document_Upload_Tracker = "SP_HD_Document_Upload_Tracker";

        //Leave Balance Upload
        const string SP_HdGetCheckLeaveBalance = "SP_HdGetCheckLeaveBalance";
        const string SP_HD_Upload_Leave_Balance = "SP_HD_Upload_Leave_Balance";
        #region Public Methods

        public string GetMaxCode(string companyCode, string tableName, string colName, string prefixName, string depotCode)
        {
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@TableName", tableName);
                    p.Add("@ColumnName", colName);
                    p.Add("@Prefix", prefixName);
                    p.Add("@DepotCode", depotCode);
                    p.Add("@Max_Code", "", DbType.VarNumeric, ParameterDirection.Output, 30);

                    connection.Query(SP_HDGETMAXCODE, p, commandType: CommandType.StoredProcedure);
                    string maxCode = p.Get<string>("@Max_Code");
                    connection.Close();
                    return maxCode;
                }
            }
            catch
            {
                throw;
            }
        }

        public DataSet GetActivityMaster(string companyCode)
        {
            DataSet ds;
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_GetActivityMaster);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objData.OpenConnection(companyCode);
                ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public int InsertActivityMaster(string companyCode, string activityName, string startDate, string endDate, string status, string activityCode, string createdBy, string createdDate)
        {
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_InserActivityMaster);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 50, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@activityName", ParameterDirection.Input, SqlDbType.VarChar, 200, activityName);
                _objSPData.AddParamToSqlCommand(command, "@startDate", ParameterDirection.Input, SqlDbType.VarChar, 50, startDate);
                _objSPData.AddParamToSqlCommand(command, "@endDate", ParameterDirection.Input, SqlDbType.VarChar, 50, endDate);
                _objSPData.AddParamToSqlCommand(command, "@status", ParameterDirection.Input, SqlDbType.VarChar, 50, status);
                _objSPData.AddParamToSqlCommand(command, "@activityCode", ParameterDirection.Input, SqlDbType.VarChar, 50, activityCode);
                _objSPData.AddParamToSqlCommand(command, "@CreatedBy", ParameterDirection.Input, SqlDbType.VarChar, 50, createdBy);
                _objSPData.AddParamToSqlCommand(command, "@CreatedDate", ParameterDirection.Input, SqlDbType.VarChar, 50, createdDate);
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

        public List<object> GetUserType(string companyCode)
        {
            List<object> ltCat = new List<object>();
            _objData = new Data();
            _objSPData = new SPData();
            try
            {
                SqlCommand command = new SqlCommand(sp_edTagUserType);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, "");

                _objData.OpenConnection(companyCode);
                {
                    using (sqldataReader = _objData.ExecuteReader(command))
                    {
                        while (sqldataReader.Read())
                        {
                            ltCat.Add(new
                            {
                                value = sqldataReader["User_Type_Code"].ToString(),
                                text = sqldataReader["User_Type_Name"].ToString()
                            });
                        }
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
            return ltCat;
        }

        public int UpdateActivityMaster(string companyCode, string activityName, string startDate, string endDate, string activityCode, string updatedBy, string updateDate)
        {
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_UpdateActivityMaster);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 50, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@activityName", ParameterDirection.Input, SqlDbType.VarChar, 200, activityName);
                _objSPData.AddParamToSqlCommand(command, "@startDate", ParameterDirection.Input, SqlDbType.VarChar, 50, startDate);
                _objSPData.AddParamToSqlCommand(command, "@endDate", ParameterDirection.Input, SqlDbType.VarChar, 50, endDate);
                _objSPData.AddParamToSqlCommand(command, "@activityCode", ParameterDirection.Input, SqlDbType.VarChar, 50, activityCode);
                _objSPData.AddParamToSqlCommand(command, "@UpdatedBy", ParameterDirection.Input, SqlDbType.VarChar, 50, updatedBy);
                _objSPData.AddParamToSqlCommand(command, "@UpdatedDate", ParameterDirection.Input, SqlDbType.VarChar, 50, updateDate);
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

        public string ChangeStatusForActivityMaster(string companyCode, string activityCode, string status)
        {
            _objSPData = new SPData();
            _objData = new Data();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_ChangeStatuSForActivityMaster);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@activityCode", ParameterDirection.Input, SqlDbType.VarChar, 30, activityCode);
                _objSPData.AddParamToSqlCommand(command, "@status", ParameterDirection.Input, SqlDbType.VarChar, 30, status);
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

        public DataSet GetExpenseEntityMaster(string companyCode)
        {
            DataSet ds;
            _objSPData = new SPData();
            _objData = new Data();
            try
            {

                SqlCommand command = new SqlCommand(SP_HD_GetExpenseEntityMaster);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objData.OpenConnection(companyCode);
                ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }


        public DataSet GetRegionTypeDetails(string companyCode)
        {
            DataSet ds;
            _objSPData = new SPData();
            _objData = new Data();
            try
            {

                SqlCommand command = new SqlCommand(SP_HDGETREGIONTYPE);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objData.OpenConnection(companyCode);
                ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetRegiontypeDetailsAll(string companyCode)
        {
            DataSet ds;
            _objSPData = new SPData();
            _objData = new Data();
            try
            {

                SqlCommand command = new SqlCommand(SP_HDREGIONTYPETABLE);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objData.OpenConnection(companyCode);
                ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetSalesActivity(string companyCode)
        {
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SPHDGETPROJECTACTIVITYDET);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objData.OpenConnection(companyCode);
                DataSet ds = new DataSet();
                ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("SPNAME", SPHDGETPROJECTACTIVITYDET);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet GetSalesActivityMapping(string companyCode)
        {
            DataSet ds;
            _objSPData = new SPData();
            _objData = new Data();

            try
            {
                SqlCommand command = new SqlCommand(SPHDGETPROJECTACTIVITYMAPPING);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objData.OpenConnection(companyCode);
                ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("SPNAME", SPHDGETPROJECTACTIVITYMAPPING);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public string InsertSalesActivityMapping(string companyCode, string projectCode, string activityCode, string startDate, string endDate, string createdBy, string createdDate)
        {
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SPHDINSERTPROJECTACTIVITYMAPPING);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@ProjectCode", ParameterDirection.Input, SqlDbType.VarChar, 30, projectCode);
                _objSPData.AddParamToSqlCommand(command, "@ActivityCode", ParameterDirection.Input, SqlDbType.VarChar, 30, activityCode);
                _objSPData.AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                _objSPData.AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);
                _objSPData.AddParamToSqlCommand(command, "@CreatedBy", ParameterDirection.Input, SqlDbType.VarChar, 100, createdBy);
                _objSPData.AddParamToSqlCommand(command, "@CreatedDate", ParameterDirection.Input, SqlDbType.VarChar, 30, createdDate);
                _objSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, -1, "");


                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);

                return command.Parameters["@Result"].Value.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("SPNAME", SPHDINSERTPROJECTACTIVITYMAPPING);
                dicObj.Add("ProjectCode", projectCode);
                dicObj.Add("ActivityCode", activityCode);
                dicObj.Add("StartDate", startDate);
                dicObj.Add("EndDate", endDate);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);

                return "ERROR: " + ex.Message.ToString();
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public int InsertExpenseEntityMaster(string companyCode, string expenseEntityCode, string expenseEntityName, string effectiveFrom, string effectiveTo, string status, string createdBy, string createdDate)
        {
            _objSPData = new SPData();
            _objData = new Data();

            try
            {
                SqlCommand command = new SqlCommand(SP_HD_InsertExpenseEntity);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@expenseEntityCode", ParameterDirection.Input, SqlDbType.VarChar, 30, expenseEntityCode);
                _objSPData.AddParamToSqlCommand(command, "@expenseEntityName", ParameterDirection.Input, SqlDbType.VarChar, 50, expenseEntityName);
                _objSPData.AddParamToSqlCommand(command, "@effectiveFrom", ParameterDirection.Input, SqlDbType.VarChar, 30, effectiveFrom);
                _objSPData.AddParamToSqlCommand(command, "@effectiveTo", ParameterDirection.Input, SqlDbType.VarChar, 30, effectiveTo);
                _objSPData.AddParamToSqlCommand(command, "@status", ParameterDirection.Input, SqlDbType.VarChar, 30, status);
                _objSPData.AddParamToSqlCommand(command, "@CreatedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, createdBy);
                _objSPData.AddParamToSqlCommand(command, "@CreatedDate", ParameterDirection.Input, SqlDbType.VarChar, 30, createdDate);
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

        public int UpdateExpenseEntityMaster(string companyCode, string expenseEntityCode, string expenseEntityName, string effectiveFrom, string effectiveTo, string updatedBy, string updatedDate)
        {
            _objSPData = new SPData();
            _objData = new Data();

            try
            {
                SqlCommand command = new SqlCommand(SP_HD_UpdateExpenseEntity);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@expenseEntityCode", ParameterDirection.Input, SqlDbType.VarChar, 30, expenseEntityCode);
                _objSPData.AddParamToSqlCommand(command, "@expenseEntityName", ParameterDirection.Input, SqlDbType.VarChar, 50, expenseEntityName);
                _objSPData.AddParamToSqlCommand(command, "@effectiveFrom", ParameterDirection.Input, SqlDbType.VarChar, 30, effectiveFrom);
                _objSPData.AddParamToSqlCommand(command, "@effectiveTo", ParameterDirection.Input, SqlDbType.VarChar, 30, effectiveTo);
                _objSPData.AddParamToSqlCommand(command, "@UpdatedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, updatedBy);
                _objSPData.AddParamToSqlCommand(command, "@UpdatedDate", ParameterDirection.Input, SqlDbType.VarChar, 30, updatedDate);
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
        public int InsertRegionType(string companyCode, string regionTypeCode, string regionTypeName, string underRegionCode, string effectiveFrom, string status, string updatedBy, string updatedDate, string Refkey1, string Refkey2, string RegionTypeCat)
        {
            SPData _objSPData = new SPData();
            _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_HDINSERTREGIONTYPE);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionTypeCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionTypeName", ParameterDirection.Input, SqlDbType.VarChar, 30, regionTypeName);
                _objSPData.AddParamToSqlCommand(command, "@UnderRegionType", ParameterDirection.Input, SqlDbType.VarChar, 30, underRegionCode);
                _objSPData.AddParamToSqlCommand(command, "@EffectiveFrom", ParameterDirection.Input, SqlDbType.VarChar, 30, effectiveFrom);
                _objSPData.AddParamToSqlCommand(command, "@RegionTypeStatus", ParameterDirection.Input, SqlDbType.VarChar, 30, status);
                _objSPData.AddParamToSqlCommand(command, "@UpdatedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, updatedBy);
                _objSPData.AddParamToSqlCommand(command, "@UpdatedDate", ParameterDirection.Input, SqlDbType.VarChar, 30, updatedDate);
                _objSPData.AddParamToSqlCommand(command, "@Refkey1", ParameterDirection.Input, SqlDbType.VarChar, 30, Refkey1);
                _objSPData.AddParamToSqlCommand(command, "@Refkey2", ParameterDirection.Input, SqlDbType.VarChar, 30, Refkey2);
                _objSPData.AddParamToSqlCommand(command, "@RegionTypeCat", ParameterDirection.Input, SqlDbType.VarChar, 100, RegionTypeCat);
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
        public string RegionChangeStatus(string companyCode, string regionTypeCode, string changeStatus, string updatedBy, string updatedDate)
        {
            SPData _objSPData = new SPData();
            _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_HDREGIONTYPECHANGESTATUS);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionTypeCode);
                _objSPData.AddParamToSqlCommand(command, "@Status", ParameterDirection.Input, SqlDbType.VarChar, 30, changeStatus);
                _objSPData.AddParamToSqlCommand(command, "@UpdatedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, updatedBy);
                _objSPData.AddParamToSqlCommand(command, "@UpdatedDate", ParameterDirection.Input, SqlDbType.VarChar, 30, updatedDate);
                _objSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, -1, "");
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                return command.Parameters["@Result"].Value.ToString();

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //UpdateRegionType
        public int UpdateRegionType(string companyCode, string regionTypeCode, string regionTypeName, string underRegionCode, string updatedBy, string updatedDate, string Refkey1, string Refkey2, string RegionTypeCat)
        {
            SPData _objSPData = new SPData();
            _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_HDUPDATEREGIONTYPE);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionTypeCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionTypeName", ParameterDirection.Input, SqlDbType.VarChar, 30, regionTypeName);
                _objSPData.AddParamToSqlCommand(command, "@UnderRegionType", ParameterDirection.Input, SqlDbType.VarChar, 30, underRegionCode);
                _objSPData.AddParamToSqlCommand(command, "@updatedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, updatedBy);
                _objSPData.AddParamToSqlCommand(command, "@updatedDate", ParameterDirection.Input, SqlDbType.VarChar, 30, updatedDate);
                _objSPData.AddParamToSqlCommand(command, "@Refkey1", ParameterDirection.Input, SqlDbType.VarChar, 30, Refkey1);
                _objSPData.AddParamToSqlCommand(command, "@Refkey2", ParameterDirection.Input, SqlDbType.VarChar, 30, Refkey2);
                _objSPData.AddParamToSqlCommand(command, "@RegionTypeCat", ParameterDirection.Input, SqlDbType.VarChar, 100, RegionTypeCat);
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

        public string ChangeStatusforExpenseEntityMaster(string companyCode, string expenseEntityCode, string status)
        {
            _objSPData = new SPData();
            _objData = new Data();
            string result = "";

            try
            {
                SqlCommand command = new SqlCommand(SP_HD_ChangestatusforExpenseEntityMaster);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@expenseEntityCode", ParameterDirection.Input, SqlDbType.VarChar, 30, expenseEntityCode);
                _objSPData.AddParamToSqlCommand(command, "@status", ParameterDirection.Input, SqlDbType.VarChar, 30, status);
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

        public DataSet GetUserTypeMaster(string companyCode)
        {
            DataSet ds;
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_GetUserTypeMaster);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objData.OpenConnection(companyCode);
                ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public string UpdateSalesActivityMapping(string companyCode, string nprojectCode, string nactivityCode, string oprojectCode, string oactivityCode, string mode, string status, string startDate, string endDate, string updatedBy, string updatedDate)
        {
            _objSPData = new SPData();
            _objData = new Data();

            try
            {
                SqlCommand command = new SqlCommand(SPHDUPDATEPROJECTACTIVITY);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@NProjectCode", ParameterDirection.Input, SqlDbType.VarChar, 30, nprojectCode);
                _objSPData.AddParamToSqlCommand(command, "@NActivityCode", ParameterDirection.Input, SqlDbType.VarChar, 30, nactivityCode);
                _objSPData.AddParamToSqlCommand(command, "@OProjectCode", ParameterDirection.Input, SqlDbType.VarChar, 30, oprojectCode);
                _objSPData.AddParamToSqlCommand(command, "@OActivityCode", ParameterDirection.Input, SqlDbType.VarChar, 30, oactivityCode);
                _objSPData.AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                _objSPData.AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);
                _objSPData.AddParamToSqlCommand(command, "@Mode", ParameterDirection.Input, SqlDbType.Char, 1, mode);
                _objSPData.AddParamToSqlCommand(command, "@Status", ParameterDirection.Input, SqlDbType.Int, 5, status);
                _objSPData.AddParamToSqlCommand(command, "@UpdatedBy", ParameterDirection.Input, SqlDbType.VarChar, 100, updatedBy);
                _objSPData.AddParamToSqlCommand(command, "@UpdatedDate", ParameterDirection.Input, SqlDbType.VarChar, 30, updatedDate);
                _objSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, -1, "");

                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                return command.Parameters["@Result"].Value.ToString(); ;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("SPNAME", SPHDUPDATEPROJECTACTIVITY);
                dicObj.Add("NProjectCode", nprojectCode);
                dicObj.Add("NActivityCode", nactivityCode);
                dicObj.Add("OProjectCode", oprojectCode);
                dicObj.Add("OActivityCode", oactivityCode);
                dicObj.Add("Mode", mode);
                dicObj.Add("Status", status);

                dicObj.Add("StartDate", startDate);
                dicObj.Add("EndDate", endDate);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return "ERROR: " + ex.Message.ToString();
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public DataSet Getdivisions(string companyCode)
        {
            try
            {
                DataSet ds;
                _objSPData = new SPData();
                _objData = new Data();

                SqlCommand Command = new SqlCommand(SP_HD_GetUnderUserType);
                Command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(Command, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objData.OpenConnection(companyCode);
                ds = _objData.ExecuteDataSet(Command);
                return ds;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        public string ChangestatusforUserType(string companyCode, string userTypeCode, string status, string updatedBy, string updatedDate)
        {
            _objSPData = new SPData();
            _objData = new Data();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_ChangestatusforUserType);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@userTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userTypeCode);
                _objSPData.AddParamToSqlCommand(command, "@status", ParameterDirection.Input, SqlDbType.VarChar, 30, status);
                _objSPData.AddParamToSqlCommand(command, "@UpdatedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, updatedBy);
                _objSPData.AddParamToSqlCommand(command, "@UpdatedDate", ParameterDirection.Input, SqlDbType.VarChar, 30, updatedDate);
                _objSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, -1, "");
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                return command.Parameters["@Result"].Value.ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int InsertUserType(string companyCode, string userTypeCode, string userTypeName,
                                  string underUserType, string effectiveFrom, string status, string userTypeCategory, string createdBy, string createdDate,
                                  string refkey1, string refkey2)
        {
            _objSPData = new SPData();
            _objData = new Data();

            try
            {
                SqlCommand command = new SqlCommand(SP_HD_InsertUserType);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@userTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userTypeCode);
                _objSPData.AddParamToSqlCommand(command, "@userTypeName", ParameterDirection.Input, SqlDbType.VarChar, 30, userTypeName);
                _objSPData.AddParamToSqlCommand(command, "@underUserType", ParameterDirection.Input, SqlDbType.VarChar, 30, underUserType);
                _objSPData.AddParamToSqlCommand(command, "@effectiveFrom", ParameterDirection.Input, SqlDbType.VarChar, 30, effectiveFrom);
                _objSPData.AddParamToSqlCommand(command, "@status", ParameterDirection.Input, SqlDbType.VarChar, 50, status);
                _objSPData.AddParamToSqlCommand(command, "@userTypeCategory", ParameterDirection.Input, SqlDbType.VarChar, 30, userTypeCategory);
                _objSPData.AddParamToSqlCommand(command, "@createdBy", ParameterDirection.Input, SqlDbType.VarChar, 30, createdBy);
                _objSPData.AddParamToSqlCommand(command, "@createdDate", ParameterDirection.Input, SqlDbType.VarChar, 30, createdDate);
                //_objSPData.AddParamToSqlCommand(command, "@UpdatedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, updatedBy);
                //_objSPData.AddParamToSqlCommand(command, "@UpdatedDate", ParameterDirection.Input, SqlDbType.VarChar, 30, updatedDate);
                _objSPData.AddParamToSqlCommand(command, "@refkey1", ParameterDirection.Input, SqlDbType.VarChar, 30, refkey1);
                _objSPData.AddParamToSqlCommand(command, "@refkey2", ParameterDirection.Input, SqlDbType.VarChar, 30, refkey2);
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

        public int UpdateUserType(string companyCode, string userTypeCode, string userTypeName, string underUserType,
                                   string effectiveFrom, string userTypeCategory, string updatedBy, string updatedDate, string refkey1, string refkey2)
        {
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_UpdateUserType);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@userTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userTypeCode);
                _objSPData.AddParamToSqlCommand(command, "@userTypeName", ParameterDirection.Input, SqlDbType.VarChar, 30, userTypeName);
                _objSPData.AddParamToSqlCommand(command, "@underUserType", ParameterDirection.Input, SqlDbType.VarChar, 30, underUserType);
                _objSPData.AddParamToSqlCommand(command, "@effectiveFrom", ParameterDirection.Input, SqlDbType.VarChar, 30, effectiveFrom);
                _objSPData.AddParamToSqlCommand(command, "@userTypeCategory", ParameterDirection.Input, SqlDbType.VarChar, 30, userTypeCategory);
                _objSPData.AddParamToSqlCommand(command, "@UpdatedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, updatedBy);
                _objSPData.AddParamToSqlCommand(command, "@UpdatedDate", ParameterDirection.Input, SqlDbType.VarChar, 30, updatedDate);
                _objSPData.AddParamToSqlCommand(command, "@refkey1", ParameterDirection.Input, SqlDbType.VarChar, 30, refkey1);
                _objSPData.AddParamToSqlCommand(command, "@refkey2", ParameterDirection.Input, SqlDbType.VarChar, 30, refkey2);
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

        public DataSet GetRegionCategory(string companyCode)
        {
            DataSet ds;
            _objSPData = new SPData();
            _objData = new Data();

            try
            {
                SqlCommand command = new SqlCommand(SP_hdGetRegionCategory);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objData.OpenConnection(companyCode);
                ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string InsertRegionCategory(string companyCode, int CompanyId, string regionClassificationCode, string regionCalssificationName,
                                           string status, string Ref_Key1, string Ref_Key2, string rowVersionNo, string createdBy, string createdDate)
        {
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(sp_hdInsertRegionCategory);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@CompanyId", ParameterDirection.Input, SqlDbType.Int, 8, CompanyId);
                _objSPData.AddParamToSqlCommand(command, "@regionClassificationCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionClassificationCode);
                _objSPData.AddParamToSqlCommand(command, "@regionCalssificationName", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCalssificationName);
                _objSPData.AddParamToSqlCommand(command, "@status", ParameterDirection.Input, SqlDbType.VarChar, 30, status);
                _objSPData.AddParamToSqlCommand(command, "@Ref_Key1", ParameterDirection.Input, SqlDbType.VarChar, 50, Ref_Key1);
                _objSPData.AddParamToSqlCommand(command, "@Ref_Key2", ParameterDirection.Input, SqlDbType.VarChar, 50, Ref_Key2);
                _objSPData.AddParamToSqlCommand(command, "@rowVersionNo", ParameterDirection.Input, SqlDbType.VarChar, 30, rowVersionNo);
                _objSPData.AddParamToSqlCommand(command, "@CreatedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, createdBy);
                _objSPData.AddParamToSqlCommand(command, "@CreatedDate", ParameterDirection.Input, SqlDbType.VarChar, 30, createdDate);
                _objSPData.AddParamToSqlCommand(command, "@UpdatedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, createdBy);
                _objSPData.AddParamToSqlCommand(command, "@UpdatedDate", ParameterDirection.Input, SqlDbType.VarChar, 30, createdDate);
                _objSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, -1, "");
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                return command.Parameters["@Result"].Value.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("SPNAME", sp_hdInsertRegionCategory);
                dicObj.Add("regionClassificationCode", regionClassificationCode);
                dicObj.Add("regionCalssificationName", regionCalssificationName);
                dicObj.Add("status", status);
                dicObj.Add("rowVersionNo", rowVersionNo);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return "ERROR: " + ex.Message.ToString();
                throw (ex);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string UpdateRegionCategory(string companyCode, int CompanyId, string regionClassificationCode, string regionCalssificationName,
                                           string status, string Ref_key1, string Ref_key2, string rowVersionNo, string updatedBy, string updatedDate)
        {
            _objSPData = new SPData();
            _objData = new Data();

            try
            {
                SqlCommand command = new SqlCommand(sp_hdUpdateRegionCategory);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Companyid", ParameterDirection.Input, SqlDbType.Int, 8, CompanyId);
                _objSPData.AddParamToSqlCommand(command, "@regionClassificationCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionClassificationCode);
                _objSPData.AddParamToSqlCommand(command, "@regionCalssificationName", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCalssificationName);
                _objSPData.AddParamToSqlCommand(command, "@status", ParameterDirection.Input, SqlDbType.VarChar, 30, status);
                _objSPData.AddParamToSqlCommand(command, "@Ref_Key1", ParameterDirection.Input, SqlDbType.VarChar, 50, Ref_key1);
                _objSPData.AddParamToSqlCommand(command, "@Ref_Key2", ParameterDirection.Input, SqlDbType.VarChar, 50, Ref_key2);
                _objSPData.AddParamToSqlCommand(command, "@rowVersionNo", ParameterDirection.Input, SqlDbType.VarChar, 30, rowVersionNo);
                _objSPData.AddParamToSqlCommand(command, "@UpdatedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, updatedBy);
                _objSPData.AddParamToSqlCommand(command, "@UpdatedDate", ParameterDirection.Input, SqlDbType.VarChar, 30, updatedDate);
                _objSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, -1, "");
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                return command.Parameters["@Result"].Value.ToString();

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("SPNAME", sp_hdUpdateRegionCategory);
                dicObj.Add("regionClassificationCode", regionClassificationCode);
                dicObj.Add("regionCalssificationName", regionCalssificationName);
                dicObj.Add("status", status);
                dicObj.Add("rowVersionNo", rowVersionNo);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return "ERROR: " + ex.Message.ToString();

            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        //change status

        public string regionclassificationchangestatus(string companyCode, string regionClassificationCode, string regionClassificationName, string RecordStatus, string updatedBy, string updatedDate)
        {
            SPData _objSPData = new SPData();
            _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_RegionClassificationChangeStatus);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@regionClassificationCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionClassificationCode);
                _objSPData.AddParamToSqlCommand(command, "@Status", ParameterDirection.Input, SqlDbType.Char, 1, RecordStatus);
                _objSPData.AddParamToSqlCommand(command, "@UpdatedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, updatedBy);
                _objSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, -1, "");
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                return command.Parameters["@Result"].Value.ToString();

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public bool GetRefKey_1(string companyCode, string refKey, string Regionclassificationname, string mode)
        {
            bool result = false;
            int exists = 0;
            try
            {
                SPData _objSPData = new SPData();
                _objData = new Data();
                SqlCommand command = new SqlCommand(SP_HDRegion_Classification_ReferenceKey_1);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Reference_Key", ParameterDirection.Input, SqlDbType.VarChar, 50, refKey);
                _objSPData.AddParamToSqlCommand(command, "@Region_Classification_name", ParameterDirection.Input, SqlDbType.VarChar, 50, Regionclassificationname);
                _objSPData.AddParamToSqlCommand(command, "@mode", ParameterDirection.Input, SqlDbType.VarChar, 10, mode);
                _objData.OpenConnection(companyCode);
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
            catch (Exception ex)
            {
                throw;
            }
        }

        public bool GetRefKey_2(string companyCode, string refKey, string Regionclassificationname, string mode)
        {
            bool result = false;
            int exists = 0;
            try
            {
                SPData _objSPData = new SPData();
                _objData = new Data();
                SqlCommand command = new SqlCommand(SP_HDRegion_Classification_ReferenceKey_2);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Reference_Key", ParameterDirection.Input, SqlDbType.VarChar, 50, refKey);
                _objSPData.AddParamToSqlCommand(command, "@Region_Classification_name", ParameterDirection.Input, SqlDbType.VarChar, 50, Regionclassificationname);
                _objSPData.AddParamToSqlCommand(command, "@mode", ParameterDirection.Input, SqlDbType.VarChar, 10, mode);
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
        /// <summary>
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>

        public int GetMaxRowversionNo(string companyCode)
        {
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_HdGetMaxRowversionNo);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
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

        // ****************** START - DFC ************************
        public List<DistanceFareChartModel> GetDistanceFareChart(string companyCode)
        {
            _objSPData = new SPData();
            _objData = new Data();
            List<DistanceFareChartModel> lstDFC = new List<DistanceFareChartModel>();
            try
            {
                SqlCommand command = new SqlCommand(SP_hdGetDistanceFareMapping);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);

                _objData.OpenConnection(companyCode);
                {
                    using (sqldataReader = _objData.ExecuteReader(command))
                    {
                        while (sqldataReader.Read())
                        {
                            DistanceFareChartModel objDFC = new DistanceFareChartModel();
                            objDFC.Distance_Range_Code = sqldataReader["Distance_Range_Code"].ToString();
                            objDFC.From_Km = Convert.ToInt32(sqldataReader["From_Km"]);
                            objDFC.To_Km = Convert.ToInt32(sqldataReader["To_Km"]);
                            objDFC.Fare_Amount = sqldataReader["Fare_Amount"].ToString();
                            objDFC.User_Type_Code = sqldataReader["User_Type_Code"].ToString();
                            objDFC.User_Type_Name = sqldataReader["User_Type_Name"].ToString();
                            objDFC.Date_From = sqldataReader["Date_From"].ToString();
                            objDFC.Date_To = sqldataReader["Date_To"].ToString();
                            objDFC.Status = Convert.ToInt16(sqldataReader["Status"]);
                            objDFC.Is_Amount_Fixed = Convert.ToString(sqldataReader["Is_Amount_Fixed"]);
                            objDFC.Entity_Name = sqldataReader["Entity_Name"].ToString();
                            objDFC.Entity_Code = sqldataReader["Entity_Code"].ToString();
                            objDFC.Travel_Mode = sqldataReader["Travel_Mode"].ToString();
                            lstDFC.Add(objDFC);
                        }
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
            return lstDFC;
        }

        public List<DistanceFareChartModel> GetDistanceFareChartNew(string companyCode, string userTypeCode, string travelMode, string category)
        {
            _objSPData = new SPData();
            _objData = new Data();
            List<DistanceFareChartModel> lstDFC = new List<DistanceFareChartModel>();
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETDISTANCEFAREMAPPING_NEW);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@UserTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userTypeCode);
                _objSPData.AddParamToSqlCommand(command, "@TravelMode", ParameterDirection.Input, SqlDbType.VarChar, 30, travelMode);
                _objSPData.AddParamToSqlCommand(command, "@Category", ParameterDirection.Input, SqlDbType.VarChar, 30, category);


                _objData.OpenConnection(companyCode);
                {
                    using (sqldataReader = _objData.ExecuteReader(command))
                    {
                        while (sqldataReader.Read())
                        {
                            DistanceFareChartModel objDFC = new DistanceFareChartModel();
                            objDFC.Distance_Range_Code = sqldataReader["Distance_Range_Code"].ToString();
                            objDFC.From_Km = Convert.ToInt32(sqldataReader["From_Km"]);
                            objDFC.To_Km = Convert.ToInt32(sqldataReader["To_Km"]);
                            objDFC.Fare_Amount = sqldataReader["Fare_Amount"].ToString();
                            objDFC.User_Type_Code = sqldataReader["User_Type_Code"].ToString();
                            objDFC.User_Type_Name = sqldataReader["User_Type_Name"].ToString();
                            objDFC.Date_From = sqldataReader["Date_From"].ToString();
                            objDFC.Date_To = sqldataReader["Date_To"].ToString();
                            objDFC.Status = Convert.ToInt16(sqldataReader["Status"]);
                            objDFC.Is_Amount_Fixed = Convert.ToString(sqldataReader["Is_Amount_Fixed"]);
                            objDFC.Entity_Name = sqldataReader["Entity_Name"].ToString();
                            objDFC.Entity_Code = sqldataReader["Entity_Code"].ToString();
                            objDFC.Travel_Mode = sqldataReader["Travel_Mode"].ToString();
                            lstDFC.Add(objDFC);
                        }
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
            return lstDFC;
        }


        public IEnumerable<DistanceFareChartModel> GetDistanceMatrixForSFCCalculation(string companyCode, string userTypeCode, string entity)
        {
            IEnumerable<DistanceFareChartModel> lstDistanceFare;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@companyCode", companyCode);
                    p.Add("@userTypeCode", userTypeCode);
                    p.Add("@entity", entity);
                    p.Add("@Result", "", DbType.String, ParameterDirection.Output, 30);

                    lstDistanceFare = connection.Query<DistanceFareChartModel>(SP_HDGETDISTANCEMATRIXVALUES, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }

            return lstDistanceFare;
        }

        public IEnumerable<Employeedetails> GetSelectedKennect(string companyCode, string userCode)
        {
            IEnumerable<Employeedetails> lstDistanceFare;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Code", userCode);
                    lstDistanceFare = connection.Query<Employeedetails>(SP_GETUSERDETAILS_KENNECTWEB, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }

            return lstDistanceFare;
        }

        public string InertSFC(string companyCode, SFCRegionModel SFCRegionEntity)
        {
            return string.Empty;
        }

        public string InsertDistanceFareChart(string companyCode, string userTypeCode, string entityCode, string entityName, int fromKm, int toKm, double fareAmount, string dateFrom, string dateTo,
                                              string isAmountFixed, string distanceRangeCode, string status, string action, string userName)
        {
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                string cmdText = SP_hdInsertDistanceFareMapping;

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@UserTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userTypeCode);
                _objSPData.AddParamToSqlCommand(command, "@EntityCode", ParameterDirection.Input, SqlDbType.VarChar, 30, entityCode);
                _objSPData.AddParamToSqlCommand(command, "@EntityName", ParameterDirection.Input, SqlDbType.VarChar, 50, entityName);
                _objSPData.AddParamToSqlCommand(command, "@FromKm", ParameterDirection.Input, SqlDbType.Int, 30, fromKm);
                _objSPData.AddParamToSqlCommand(command, "@ToKm", ParameterDirection.Input, SqlDbType.Int, 30, toKm);
                _objSPData.AddParamToSqlCommand(command, "@FareAmount", ParameterDirection.Input, SqlDbType.Decimal, 30, fareAmount);
                _objSPData.AddParamToSqlCommand(command, "@DateFrom", ParameterDirection.Input, SqlDbType.VarChar, 10, dateFrom);
                _objSPData.AddParamToSqlCommand(command, "@DateTo", ParameterDirection.Input, SqlDbType.VarChar, 10, dateTo);
                _objSPData.AddParamToSqlCommand(command, "@IsAmountFixed", ParameterDirection.Input, SqlDbType.Char, 1, isAmountFixed);
                _objSPData.AddParamToSqlCommand(command, "@DistanceRangeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, distanceRangeCode);
                _objSPData.AddParamToSqlCommand(command, "@Status", ParameterDirection.Input, SqlDbType.Char, 1, status);
                _objSPData.AddParamToSqlCommand(command, "@Action", ParameterDirection.Input, SqlDbType.VarChar, 10, action);
                _objSPData.AddParamToSqlCommand(command, "@UserName", ParameterDirection.Input, SqlDbType.VarChar, 30, userName);


                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                string result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userTypeCode", userTypeCode);
                dicObj.Add("entityCode", entityCode);
                dicObj.Add("entityName", entityName);
                dicObj.Add("fromKm", fromKm.ToString());
                dicObj.Add("toKm", toKm.ToString());
                dicObj.Add("fareAmount", fareAmount.ToString());
                dicObj.Add("dateFrom", dateFrom);
                dicObj.Add("dateTo", dateTo);
                dicObj.Add("isAmountFixed", isAmountFixed);
                dicObj.Add("distanceRangeCode", distanceRangeCode);
                dicObj.Add("status", status);
                dicObj.Add("action", action);

                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return "FAIL^" + ex.Message;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }

        public string InsertDistanceFareChart(string company_Code, List<DistanceFareChartModel> lstDFCModel)
        {
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                string cmdText = SP_hdInsertDistanceFareMapping;

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                if (lstDFCModel.Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@DFC_TYPE", ParameterDirection.Input, SqlDbType.Structured, null, "DFC_TVP");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@DFC_TYPE", ParameterDirection.Input, SqlDbType.Structured, new DFCMasterEnumurator(lstDFCModel.AsEnumerable()), "DFC_TVP");
                }


                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(company_Code);
                _objData.ExecuteNonQuery(command);
                string result = returnValue.Value.ToString();
                return result;
            }
            catch
            {
                throw;
            }
        }

        //Leave Balance Excel Upload
        public string ExcelBulkLeaveInsertIntoStaging(string companyCode, DataTable dt, string subDomain)
        {
            string result = string.Empty;
            try
            {
                _objData = new Data();
                using (SqlConnection cn = _objData.GetConnectionObjectForSqlBulCopy(subDomain))
                {
                    cn.Open();
                    using (SqlBulkCopy copy = new SqlBulkCopy(cn))
                    {
                        copy.ColumnMappings.Add("GUID", "GUID");
                        copy.ColumnMappings.Add("Row_No", "Row_No");
                        copy.ColumnMappings.Add("Company_Code", "Company_Code");
                        copy.ColumnMappings.Add("User_Name", "User_Name");
                        copy.ColumnMappings.Add("Leave_Type_Name", "Leave_Type_Name");
                        copy.ColumnMappings.Add("Balance_CF", "Balance_CF");
                        copy.ColumnMappings.Add("Lapsed", "Lapsed");
                        copy.ColumnMappings.Add("Eligible_Leave", "Eligible_Leave");
                        copy.ColumnMappings.Add("Effective_From", "Effective_From");
                        copy.ColumnMappings.Add("Effective_To", "Effective_To");
                        copy.DestinationTableName = "tbl_SFA_Leave_Balance_Upload_Staging";
                        copy.WriteToServer(dt);
                    }
                    cn.Close();
                }
                result = "SUCCESS";
            }
            catch(Exception ex)
            {
                throw ex;
            }
            return result;
        }

        public string ExcelBulkLeaveInsertFromStagingToMaster(string subDomain, string companyCode, string guid, string fileName, string Login_User_Code, string uploadedBy, string inward_Requestform, string inward_RequestDate, string inward_RequestReason, string bpType)
        {
            string Result = string.Empty;
            try
            {
                using(IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@GUID", guid);
                    p.Add("@fileName", fileName);
                    p.Add("@Login_User_Code", Login_User_Code);
                    p.Add("@Uploaded_By", uploadedBy);
                    p.Add("@Request_From", inward_Requestform);
                    p.Add("@Request_Date", inward_RequestDate);
                    p.Add("@Request_Reason", inward_RequestReason);
                    p.Add("@BPType", bpType);
                    p.Add("@Result", string.Empty, DbType.String, ParameterDirection.Output);
                    connection.Query<string>(SP_HD_Insert_Leave_Balance_From_Staging_To_Master, p, commandType: CommandType.StoredProcedure).ToString();
                    Result = p.Get<string>("@Result");
                    connection.Close();
                }
            }
            catch(Exception ex)
            {
                throw ex;
            }
            return Result;
        }

        //DFC Excel Upload
        public string ExcelBulkDFCInsert(string companyCode, DataTable dt, string subDomain)
        {
            string result = string.Empty;
            try
            {
                _objData = new Data();
                using (SqlConnection cn = _objData.GetConnectionObjectForSqlBulCopy(subDomain))
                {
                    cn.Open();
                    using (SqlBulkCopy copy = new SqlBulkCopy(cn))
                    {
                        copy.ColumnMappings.Add("GUID", "GUID");
                        copy.ColumnMappings.Add("Row_No", "Row_No");
                        copy.ColumnMappings.Add("Company_Code", "Company_Code");
                        copy.ColumnMappings.Add("User_Type_Name", "User_Type_Name");
                        copy.ColumnMappings.Add("Entity_Name", "Entity_Name");
                        copy.ColumnMappings.Add("Travel_Mode", "Travel_Mode");
                        copy.ColumnMappings.Add("Date_From", "Date_From");
                        copy.ColumnMappings.Add("Date_To", "Date_To");
                        copy.ColumnMappings.Add("From_Km", "From_Km");
                        copy.ColumnMappings.Add("To_Km", "To_Km");
                        copy.ColumnMappings.Add("Fare_Amount", "Fare_Amount");
                        copy.ColumnMappings.Add("Is_Amount_Fixed", "Is_Amount_Fixed");
                        copy.DestinationTableName = "tbl_SFA_DFC_Upload_Staging";
                        copy.WriteToServer(dt);
                    }
                    cn.Close();
                }
                result = "SUCCESS";
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }

        public string InsertExcelBulkDFCStagingToMaster(string subDomain, string companyCode, string guid, string fileName, string uploadedBy, string bpType)
        {
            _objSPData = new SPData();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(Sp_hdInsertDFCExcelFromStaging);
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
                result = "SUCCESS:";
            }
            catch(Exception ex)
            {
                result = String.Concat("FAILURE: ", ex.StackTrace.Substring(0, 499));
            }
            return result;
        }


        public string ValidateDFCDateOverlapping(string company_Code, string user_Type_Code, string entity_Code, string travel_Mode,
            string Date_From, string Date_To, string DFC_Codes, string Form_Mode)
        {
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                string cmdText = "SP_HDValidateDFCDateOverlapping";

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@User_Type_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, user_Type_Code);
                _objSPData.AddParamToSqlCommand(command, "@Entity_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, entity_Code);
                _objSPData.AddParamToSqlCommand(command, "@Travel_Mode", ParameterDirection.Input, SqlDbType.VarChar, 50, travel_Mode);
                _objSPData.AddParamToSqlCommand(command, "@Date_From", ParameterDirection.Input, SqlDbType.VarChar, 12, Date_From);
                _objSPData.AddParamToSqlCommand(command, "@Date_To", ParameterDirection.Input, SqlDbType.VarChar, 12, Date_To);
                _objSPData.AddParamToSqlCommand(command, "@Dis_Range_Codes", ParameterDirection.Input, SqlDbType.VarChar, 4000, DFC_Codes);

                _objData.OpenConnection(company_Code);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);
                _objData.ExecuteNonQuery(command);
                string result = command.Parameters["@Result"] == null ? null : command.Parameters["@Result"].Value.ToString();
                return result;
            }
            catch
            {
                throw;
            }
        }




        // ****************** END - DFC ************************


        /********************* START: SFC Master ******************************/
        public IEnumerable<SFCRegionModel> GetSFCRegions(SFCRegionModel sfcRegion, int pageNumber, int pageSize, bool isAllRowsReq, ref int totalPageCount, string searchregion, string searchFromPlace, string searchToPlace, string SFCStatus, int showArchived)
        {
            IEnumerable<SFCRegionModel> lstSFCRegions;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", sfcRegion.Company_Code);
                    p.Add("@Region_Code", sfcRegion.Region_Code);
                    p.Add("@PageNumber", pageNumber);
                    p.Add("@PageSize", pageSize);
                    p.Add("@IsAllRecordsRequired", isAllRowsReq);
                    p.Add("@TotalPageNo", totalPageCount, DbType.Int32, ParameterDirection.Output);
                    p.Add("@searchregion", searchregion);
                    p.Add("@searchFromPlace", searchFromPlace);
                    p.Add("@searchToPlace", searchToPlace);
                    p.Add("@SFCStatus", SFCStatus);
                    p.Add("@showArchived", showArchived);
                    lstSFCRegions = connection.Query<SFCRegionModel>(SP_HDGETSFCREGIONS, p, commandType: CommandType.StoredProcedure);
                    totalPageCount = p.Get<int>("@TotalPageNo");
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }

            return lstSFCRegions;
        }

        #region SFC - Check Existing SFC for same region
        /// <summary>
        ///  Used to check the existing sfc record for same region
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="fromPlace"></param>
        /// <param name="toPlace"></param>
        /// <param name="categoryName"></param>
        /// <param name="travelMode"></param>
        /// <returns></returns>
        public int GetExistingSFCCount(string companyCode, string regionCode, string fromPlace, string toPlace, string categoryName, string travelMode)
        {
            int sfcCount = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@RegionCode", regionCode);
                    parameter.Add("@FromPlace", fromPlace);
                    parameter.Add("@ToPlace", toPlace);
                    parameter.Add("@CategoryName", categoryName);
                    parameter.Add("@TravelMode", travelMode);
                    sfcCount = connection.Query<Int32>(SP_HD_CHECKSFCFORREGION, parameter, commandType: CommandType.StoredProcedure).Single();
                }
            }
            catch
            {
                throw;
            }
            return sfcCount;
        }
        #endregion SFC - Check Existing SFC for same region

        public int SaveSFC(string company_Code, List<SFCRegionModel> lstSFCRegion, string region_Code, string ipAddress, string hostName)
        {
            int rowsAffected = 0;
            try
            {
                _objSPData = new SPData();
                _objData = new Data();

                string cmdText = "SP_HDInsertSFC";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, region_Code);
                _objSPData.AddParamToSqlCommand(command, "@IP_Address", ParameterDirection.Input, SqlDbType.VarChar, 30, ipAddress);
                _objSPData.AddParamToSqlCommand(command, "@HostName", ParameterDirection.Input, SqlDbType.VarChar, 30, hostName);
                if (lstSFCRegion.Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@SFCTEMP_TVP", ParameterDirection.Input, SqlDbType.Structured, null, "SFC_TVP");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@SFCTEMP_TVP", ParameterDirection.Input, SqlDbType.Structured, new SFCMasterEnumurator(lstSFCRegion.AsEnumerable()), "SFC_TVP");
                }
                _objData.OpenConnection(company_Code);
                _objData.ExecuteNonQuery(command);
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return rowsAffected;

        }

        public string CheckSFCExist(string company_Code, List<SFCRegionModel> lstSFCRegion, string region_Code)
        {
            try
            {
                string validationMessage = null;
                _objSPData = new SPData();
                _objData = new Data();

                string cmdText = "SP_HDCheckSFCExist";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, region_Code);
                _objSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 1000, null);
                if (lstSFCRegion.Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@SFCTEMP_TVP", ParameterDirection.Input, SqlDbType.Structured, null, "SFC_TVP");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@SFCTEMP_TVP", ParameterDirection.Input, SqlDbType.Structured, new SFCMasterEnumurator(lstSFCRegion.AsEnumerable()), "SFC_TVP");
                }
                _objData.OpenConnection(company_Code);
                _objData.ExecuteScalar(command);

                validationMessage = command.Parameters["@Result"].Value == null ? null : command.Parameters["@Result"].Value.ToString();
                return validationMessage;
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }



        public IEnumerable<SFCRegionModel> GetSelectedSFC(string company_Code, string region_Code, Int64 SFCCode)
        {
            IEnumerable<SFCRegionModel> lstSFCRegions;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", company_Code);
                    p.Add("@Region_Code", region_Code);
                    p.Add("@Distance_Fare_Code", SFCCode);

                    lstSFCRegions = connection.Query<SFCRegionModel>(SP_HDGETSELECTEDSFC, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }

            return lstSFCRegions;
        }


        public IEnumerable<SFCRegionModel> GetSFC(string companyCode, string regionCode)
        {
            IEnumerable<SFCRegionModel> lstSFCRegions;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Region_Code", regionCode);


                    lstSFCRegions = connection.Query<SFCRegionModel>(SP_HDGETSFCREGIONBASEDDETAIL, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }

            return lstSFCRegions;
        }


        public IEnumerable<SFCRegionModel> GetSFCTo(string companyCode, string regionCode)
        {
            IEnumerable<SFCRegionModel> lstSFCRegions;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Region_Code", regionCode);


                    lstSFCRegions = connection.Query<SFCRegionModel>(SP_HDGETSFTOREGIONBASEDDETAIL, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }

            return lstSFCRegions;
        }

        /********************* END: SFC Master ******************************/

        //Get Project Details
        public IEnumerable<ProjectMasterModel> GetProjectDetails(ProjectMasterModel projectMaster)
        {
            IEnumerable<ProjectMasterModel> lstProjectMaster;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@companyCode", projectMaster.Company_Code);

                    lstProjectMaster = connection.Query<ProjectMasterModel>(SP_HdGetProjectdetails, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("SPNAME", SP_HdGetProjectdetails);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
            return lstProjectMaster;
        }

        //Get UserName 
        public IEnumerable<ProjectLead> GetProjectLead(ProjectLead projectLead)
        {
            IEnumerable<ProjectLead> lstProjectlead;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@companyCode", projectLead.Company_Code);

                    lstProjectlead = connection.Query<ProjectLead>(SP_HdGetProjectLead, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("SPNAME", SP_HdGetProjectLead);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
            return lstProjectlead;
        }

        //Get ComapanyName
        public IEnumerable<ProjectMasterModel> GetClient(ProjectMasterModel projectMaster)
        {
            IEnumerable<ProjectMasterModel> lstcompanyName;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@companyCode", projectMaster.Company_Code);

                    lstcompanyName = connection.Query<ProjectMasterModel>(SP_HdGetClient, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("SPNAME", SP_HdGetClient);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
            return lstcompanyName;
        }

        //Get Domain
        public IEnumerable<ProjectMasterModel> GetDomain(ProjectMasterModel projectMaster)
        {
            IEnumerable<ProjectMasterModel> lstDomain;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@companyCode", projectMaster.Company_Code);

                    lstDomain = connection.Query<ProjectMasterModel>(SP_HdGetDomain, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("SPNAME", SP_HdGetDomain);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
            return lstDomain;
        }

        public string ChangeStatusforProjectMaster(string status, string projectCode, string companyCode)
        {
            string result = "";
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    if ("1" == status)
                    {
                        const string query = "UPDATE tbl_SFA_Project_Master SET Status = 0 WHERE Company_Code=@companyCode AND Project_Code=@projectCode";
                        connection.Execute(query, new { projectCode = projectCode, companyCode = companyCode });
                    }
                    else
                    {
                        const string query = "UPDATE tbl_SFA_Project_Master SET Status = 1 WHERE Company_Code=@companyCode AND Project_Code=@projectCode";
                        connection.Execute(query, new { projectCode = projectCode, companyCode = companyCode });
                    }

                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("status", status);
                dicObj.Add("projectCode", projectCode);
                dicObj.Add("companyCode", companyCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return "ERROR: " + ex.Message.ToString();
            }
            return result;
        }

        public int InsertforProjectMaster(List<ProjectMasterModel> lstprojectmaster)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    const string query = "INSERT INTO tbl_SFA_Project_Master(Company_Code,Project_Code,Project_Name,Project_Lead_Code,Project_Lead_Name,Client_Code,Domain_Code,Start_Date,End_Date,Status,Remarks)VALUES(@Company_Code,NEXT VALUE FOR SEQ_tbl_SFA_Project_Master,@Project_Name,@Project_Lead_Code,@Project_Lead_Name,@Client_Code,@Domain_Code,@Start_Date,@End_Date,@Status,@Remarks) ";
                    rowsAffected = connection.Execute(query, lstprojectmaster);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowsAffected;

        }

        public int UpdateforProjectMaster(List<ProjectMasterModel> lstprojectMaster)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {

                    var parameters = new DynamicParameters();
                    const string query = "UPDATE tbl_SFA_Project_Master SET Project_Name=@Project_Name,Project_Lead_Code=@Project_Lead_Code,Project_Lead_Name=@Project_Lead_Name,Client_Code=@Client_Code,Domain_Code=@Domain_Code,Start_Date=@Start_Date,End_Date=@End_Date,Remarks=@Remarks WHERE Company_Code = @Company_Code AND Project_Code=@Project_Code ";
                    rowsAffected = connection.Execute(query, lstprojectMaster);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowsAffected;

        }

        //Get DomainMaster Details
        public IEnumerable<DomainMasterModel> GetDomainMasterDetails(DomainMasterModel domainMaster)
        {
            IEnumerable<DomainMasterModel> lstdomainMaster;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@companyCode", domainMaster.Company_Code);

                    lstdomainMaster = connection.Query<DomainMasterModel>(SP_HdGetDomainDetails, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("SPNAME", SP_HdGetDomainDetails);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
            return lstdomainMaster;
        }

        public string ChangestatusforDomainMaster(string status, string domainCode, string companyCode)
        {
            string result = "";
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    if ("1" == status)
                    {
                        const string query = "UPDATE tbl_SFA_Domain_Master SET Status = 0 WHERE Company_Code=@companyCode AND Domain_Code=@domainCode";
                        connection.Execute(query, new { domainCode = domainCode, companyCode = companyCode });
                    }
                    else
                    {
                        const string query = "UPDATE tbl_SFA_Domain_Master SET Status = 1 WHERE Company_Code=@companyCode AND Domain_Code=@domainCode";
                        connection.Execute(query, new { domainCode = domainCode, companyCode = companyCode });
                    }

                }
            }
            catch
            {
                throw;
            }
            return result;
        }

        public int InsertforDomainMaster(List<DomainMasterModel> lstdomainmaster)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    const string query = "INSERT INTO tbl_SFA_Domain_Master (Company_Code,Domain_Code,Domain_Name,Start_Date,End_Date,Status)VALUES(@Company_Code,NEXT VALUE FOR SEQ_tbl_SFA_Domain_Master,@Domain_Name,@Start_Date,@End_Date,@Status) ";
                    rowsAffected = connection.Execute(query, lstdomainmaster);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowsAffected;

        }

        public int UpdateforDomainMaster(List<DomainMasterModel> lstdomainmaster)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {

                    var parameters = new DynamicParameters();
                    const string query = "UPDATE tbl_SFA_Domain_Master SET Domain_Name = @Domain_Name,Start_Date=@Start_Date,End_Date=@End_Date WHERE Company_Code = @Company_Code AND Domain_Code = @Domain_Code ";
                    rowsAffected = connection.Execute(query, lstdomainmaster);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowsAffected;

        }

        //Get FeatureMaster Details

        public IEnumerable<FeatureMasterModel> GetFeatureMasterDetails(FeatureMasterModel featureMaster)
        {
            try
            {
                IEnumerable<FeatureMasterModel> lstfeatureMaster;
                try
                {
                    using (IDbConnection connection = IDbOpenConnection())
                    {
                        var p = new DynamicParameters();
                        p.Add("@companyCode", featureMaster.Company_Code);

                        lstfeatureMaster = connection.Query<FeatureMasterModel>(SP_HdGetFeatureDetails, p, commandType: CommandType.StoredProcedure);
                        connection.Close();
                    }
                }
                catch (Exception ex)
                {
                    Dictionary<string, string> dicObj = new Dictionary<string, string>();
                    dicObj.Add("SPNAME", SP_HdGetFeatureDetails);
                    DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                    return null;
                }
                return lstfeatureMaster;
            }
            catch
            {
                throw;
            }
        }

        public string ChangestatusforFeatureMaster(string status, string featureCode, string companyCode)
        {
            string result = "";
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    if ("1" == status)
                    {
                        const string query = "UPDATE tbl_SFA_Feature_Master SET Record_Status = 0 WHERE Company_Code=@companyCode AND Feature_Code=@Featurecode";
                        connection.Execute(query, new { Featurecode = featureCode, companyCode = companyCode });
                    }
                    else
                    {
                        const string query = "UPDATE tbl_SFA_Feature_Master SET Record_Status = 1 WHERE Company_Code=@companyCode AND Feature_Code=@Featurecode";
                        connection.Execute(query, new { Featurecode = featureCode, companyCode = companyCode });
                    }

                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("status", status);
                dicObj.Add("featureCode", featureCode);
                dicObj.Add("companyCode", companyCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return "ERROR: " + ex.Message.ToString();
            }
            return result;
        }

        public int InsertforFeatureMaster(List<FeatureMasterModel> lstfeatureMaster)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    const string query = "INSERT INTO tbl_SFA_Feature_Master(Company_Code,Feature_Code,Feature_Name,Effective_From,Record_Status,Description,Is_Active)VALUES(@Company_Code,NEXT VALUE FOR SEQ_tbl_SFA_Feature_Master,@Feature_Name,@Effective_From,@Record_Status,@Description,@Is_Active)";
                    rowsAffected = connection.Execute(query, lstfeatureMaster);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowsAffected;

        }

        public int UpdateforFeatureMaster(List<FeatureMasterModel> lstfeatureMaster)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {

                    var parameters = new DynamicParameters();
                    const string query = "UPDATE tbl_SFA_Feature_Master SET Feature_Name = @Feature_Name,Effective_From = @Effective_From,Description = @Description WHERE Company_Code = @Company_Code AND Feature_Code = @Feature_Code";
                    rowsAffected = connection.Execute(query, lstfeatureMaster);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowsAffected;

        }

        //Get CycleMaster Details
        public IEnumerable<CycleMasterModel> GetCycleMasterDetails(CycleMasterModel cycleMaster)
        {
            IEnumerable<CycleMasterModel> lstcycleMaster;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@companyCode", cycleMaster.Company_Code);
                    p.Add("@regionCode", cycleMaster.Region_Code);

                    lstcycleMaster = connection.Query<CycleMasterModel>(SP_HdGetCycledetails, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("SPNAME", SP_HdGetCycledetails);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
            return lstcycleMaster;
        }

        public int InsertforCycleMaster(List<CycleMasterModel> lstCycleMaster)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    const string query = "INSERT INTO tbl_SFA_Cycle_Master (Company_Code,Cycle_Code,Cycle_Name,Long_Description,Record_Status,Region_Code,Start_Date,End_Date,Created_By,Created_Date) VALUES (@Company_Code,NEXT VALUE FOR SEQ_tbl_SFA_Cycle_Master,@Cycle_Name,@Long_Description,@Record_Status,@Region_Code,@Start_Date,@End_Date,@Created_By,@Created_Date)";
                    rowsAffected = connection.Execute(query, lstCycleMaster);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowsAffected;
        }

        public int UpdateforCycleMaster(List<CycleMasterModel> lstCycleMaster)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {

                    var parameters = new DynamicParameters();
                    const string query = " UPDATE tbl_SFA_Cycle_Master SET Cycle_Name = @Cycle_Name,Start_Date = @Start_Date,End_Date = @End_Date,Long_Description = @Long_Description,Updated_By=@Updated_By,Updated_Date=@Updated_Date,Record_Status=@Record_Status WHERE Region_Code = @Region_Code AND Cycle_Code = @Cycle_Code";
                    rowsAffected = connection.Execute(query, lstCycleMaster);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowsAffected;
        }


        //Get LeaveTypeMaster Details
        public IEnumerable<LeaveTypeMasterModel> GetLeaveTypeMasterDetails(LeaveTypeMasterModel objLeaveType)
        {
            IEnumerable<LeaveTypeMasterModel> lstLeaveType;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@companyCode", objLeaveType.Company_Code);

                    lstLeaveType = connection.Query<LeaveTypeMasterModel>(SP_HD_GetLeaveDeatils, parameter, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("SPNAME", SP_HD_GetLeaveDeatils);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
            return lstLeaveType;
        }

        //Get ProductPriceMaster Details
        public IEnumerable<ProductPriceMasterModel> GetProjectPriceMasterDetails(ProductPriceMasterModel objProductPriceMaster)
        {
            IEnumerable<ProductPriceMasterModel> lstProductpriceMaster;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@ppCompanyCode", objProductPriceMaster.Pp_Company_Code);
                    parameter.Add("@rmCompanyCode", objProductPriceMaster.Rm_Company_Code);
                    parameter.Add("@rtmCompanyCode", objProductPriceMaster.Rtm_Company_Code);
                    parameter.Add("@pmCompanyCode", objProductPriceMaster.pm_Company_Code);

                    lstProductpriceMaster = connection.Query<ProductPriceMasterModel>(SPHDGETPRODUCTPRICEDETAILS, parameter, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("SPNAME", SPHDGETPRODUCTPRICEDETAILS);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
            return lstProductpriceMaster;
        }

        //Get RegionType
        public IEnumerable<ProductPriceMasterModel> GetRegionType(ProductPriceMasterModel ObjdropRegionType)
        {
            IEnumerable<ProductPriceMasterModel> lstRegionType;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@companyCode", ObjdropRegionType.Company_Code);

                    lstRegionType = connection.Query<ProductPriceMasterModel>(SPHDGETREGIONTYPE, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("SPNAME", SPHDGETREGIONTYPE);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
            return lstRegionType;
        }
        public int GetRefKey1(string Company_Code, string RefKey1)
        {
            List<int> result = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", Company_Code);
                    p.Add("@Ref_Key1", RefKey1);
                    result = connection.Query<int>(SP_HD_CheckRefkey1, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result[0];
        }
        public int GetRefKey2(string Company_Code, string RefKey2)
        {
            List<int> result = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", Company_Code);
                    p.Add("@Ref_Key2", RefKey2);
                    result = connection.Query<int>(SP_HD_CheckRefkey2, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result[0];
        }
        //Get Region
        public IEnumerable<ProductPriceMasterModel> GetRegion(ProductPriceMasterModel objDropRegion)
        {
            IEnumerable<ProductPriceMasterModel> lstRegionName;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@companyCode", objDropRegion.Company_Code);
                    p.Add("@regionTypeCode", objDropRegion.Region_Type_Code);

                    lstRegionName = connection.Query<ProductPriceMasterModel>(SPHDGETREGIONFORPRODUCTPRICE, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {

                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("SPNAME", SPHDGETREGIONFORPRODUCTPRICE);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
            return lstRegionName;
        }

        //Get Product
        public IEnumerable<ProductPriceMasterModel> GetProduct(ProductPriceMasterModel objdropProduct)
        {
            IEnumerable<ProductPriceMasterModel> lstproductNames;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@companyCode", objdropProduct.Company_Code);

                    lstproductNames = connection.Query<ProductPriceMasterModel>(SPHDGETPRODUCT, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {

                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("SPNAME", SPHDGETPRODUCT);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
            return lstproductNames;
        }

        //Changestatus for ProductPriceMaster
        public string ChangestatusforProductpriceMaster(string status, string priceCode, string companyCode)
        {
            string result = "";
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    if ("1" == status)
                    {
                        const string query = "UPDATE tbl_SFA_Product_Price SET Price_Status = 0 WHERE Company_Code=@companyCode AND Price_Code=@priceCode";
                        connection.Execute(query, new { priceCode = priceCode, companyCode = companyCode });
                    }
                    else
                    {
                        const string query = "UPDATE tbl_SFA_Product_Price SET Price_Status = 1 WHERE Company_Code=@companyCode AND Price_Code=@priceCode";
                        connection.Execute(query, new { priceCode = priceCode, companyCode = companyCode });
                    }

                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("status", status);
                dicObj.Add("priceCode", priceCode);
                dicObj.Add("companyCode", companyCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return "ERROR: " + ex.Message.ToString();
            }
            return result;
        }

        //Insert for ProductPriceMaster
        public int InsertforProductPriceMaster(List<ProductPriceMasterModel> lstproductPriceMaster)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    const string query = "INSERT INTO tbl_SFA_Product_Price(Company_Code,Price_Code,Region_Type_Code,Region_Code,Product_Code,Price,Effective_From,Effective_To,Price_Status)VALUES(@Company_Code,NEXT VALUE FOR SEQ_tbl_SFA_Product_Price,@Region_Type_Code,@Region_Code,@Product_Code,@Price,@Effective_From,@Effective_To,@Price_Status)";
                    rowsAffected = connection.Execute(query, lstproductPriceMaster);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowsAffected;
        }

        //Update for ProductpriceMaster
        public int UpdateforProductpriceMaster(List<ProductPriceMasterModel> lstProductPriceMaster)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    const string query = "UPDATE tbl_SFA_Product_Price SET Price = @Price,Region_Type_Code = @Region_Type_Code,Region_Code =@Region_Code,Effective_From =@Effective_From,Effective_To=@Effective_To WHERE Company_Code = @Company_Code AND Price_Code=@Price_Code";
                    rowsAffected = connection.Execute(query, lstProductPriceMaster);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowsAffected;
        }

        //Get StatusMaster Details
        public IEnumerable<StatusMasterModel> GetStatusmasterDetails(StatusMasterModel statusMaster)
        {
            IEnumerable<StatusMasterModel> lststatusMaster;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@companyCode", statusMaster.Company_Code);
                    lststatusMaster = connection.Query<StatusMasterModel>(SPHDGETSTATUSMASTERDETAILS, parameter, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("SPNAME", SPHDGETSTATUSMASTERDETAILS);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
            return lststatusMaster;
        }

        //Change status for StatusMaster 
        public string ChangestatusforStatusMaster(string status, string statusCode, string companyCode)
        {
            string result = "";
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    if ("1" == status)
                    {
                        const string query = "UPDATE tbl_SFA_Status_Master SET Record_Status = 0 WHERE Company_Code=@companyCode AND Status_Code=@statusCode";
                        connection.Execute(query, new { statusCode = statusCode, companyCode = companyCode });
                    }

                    else
                    {
                        const string query = "UPDATE tbl_SFA_Status_Master SET Record_Status = 1 WHERE Company_Code=@companyCode AND Status_Code=@statusCode";
                        connection.Execute(query, new { statusCode = statusCode, companyCode = companyCode });
                    }
                }
                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("status", status);
                dicObj.Add("statusCode", statusCode);
                dicObj.Add("companyCode", companyCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return "ERROR: " + ex.Message.ToString();
            }
        }

        //Insert for StatusMaster
        public int InsertforStatusMaster(List<StatusMasterModel> lstStatusMaster)
        {
            int rowAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    string query = "INSERT INTO tbl_SFA_Status_Master(Company_Code,Status_Code,Status_Name,Display_Name,Record_Status)VALUES(@Company_Code,NEXT VALUE FOR SEQ_tbl_SFA_Status_Master,@Status_Name,@Display_Name,@Record_Status)";
                    rowAffected = connection.Execute(query, lstStatusMaster);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowAffected;
        }


        //Update for StatusMaster
        public int UpdateforstatusMaster(List<StatusMasterModel> lstStatusMaster)
        {
            int rowAffected;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    string query = "UPDATE tbl_SFA_Status_Master SET Status_Name = @Status_Name,Display_Name=@Display_Name WHERE Company_Code = @Company_Code AND Status_Code=@Status_Code";
                    rowAffected = connection.Execute(query, lstStatusMaster);
                }
            }
            catch
            {
                throw;
            }
            return rowAffected;
        }

        //Get RequestMaster Details
        public IEnumerable<RequestMasterModel> GetRequestMasterDetails(RequestMasterModel requestMaster)
        {
            IEnumerable<RequestMasterModel> lstRequestMastermodel;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@cmCompanyCode", requestMaster.CM_Company_Code);
                    p.Add("@rmCompanyCode", requestMaster.RM_Company_Code);
                    lstRequestMastermodel = connection.Query<RequestMasterModel>(SPHDGETREQUESTMASTERDETAILS, p, commandType: CommandType.StoredProcedure);

                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("SPNAME", SPHDGETREQUESTMASTERDETAILS);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
            return lstRequestMastermodel;
        }

        //Get CycleList
        public IEnumerable<RequestMasterModel> GetDropCycle(RequestMasterModel requestMaster)
        {
            IEnumerable<RequestMasterModel> lstRequestMastermodel;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@cmCompanyCode", requestMaster.CM_Company_Code);
                    lstRequestMastermodel = connection.Query<RequestMasterModel>(SPHDGETCYCLES, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("SPNAME", SPHDGETCYCLES);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
            return lstRequestMastermodel;
        }

        //Changestatus for RequestMaster
        public string ChangestatusforRequestMaster(string status, string requestCode, string companyCode)
        {
            string result = "";
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    if ("1" == status)
                    {
                        const string query = "UPDATE tbl_SFA_Request_Master SET Record_Status = 0 WHERE Company_Code=@companyCode AND Request_Code=@requestCode";
                        connection.Execute(query, new { requestCode = requestCode, companyCode = companyCode });
                    }
                    else
                    {
                        const string query = "UPDATE tbl_SFA_Request_Master SET Record_Status = 1 WHERE Company_Code=@companyCode AND Request_Code=@requestCode";
                        connection.Execute(query, new { requestCode = requestCode, companyCode = companyCode });
                    }
                }
            }

            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("status", status);
                dicObj.Add("requestCode", requestCode);
                dicObj.Add("companyCode", companyCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return "ERROR: " + ex.Message.ToString();
            }
            return result;
        }

        //Insert for RequestMaster
        public int InsertforRequestMaster(List<RequestMasterModel> lstRequestMaster)
        {
            int rowsAffected = 0;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    string query = "INSERT INTO tbl_SFA_Request_Master(Company_Code,Request_Code,Request_Name,Request_Entity,Request_Type,Credit_Limit,Record_Status,Cycle_Code)VALUES(@CM_Company_Code,NEXT VALUE FOR SEQ_tbl_SFA_Request_Master,@Request_Name,@Request_Entity,@Request_Type,@Credit_Limit,@Record_Status,@Cycle_Code)";
                    rowsAffected = connection.Execute(query, lstRequestMaster);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowsAffected;
        }

        //Update for RequestMaster
        public int UpdateforRequestMaster(List<RequestMasterModel> lstRequestMaster)
        {
            int rowAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    string query = "UPDATE tbl_SFA_Request_Master SET Request_Name = @Request_Name,Request_Entity = @Request_Entity,Request_Type = @Request_Type,Credit_Limit = @Credit_Limit,Cycle_Code = @Cycle_Code WHERE Company_Code =@CM_Company_Code AND Request_Code = @Request_Code";
                    rowAffected = connection.Execute(query, lstRequestMaster);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowAffected;
        }
        //public int InsertforStatusMaster(StatusMasterModel statusmaster)
        //{
        //    IEnumerable<StatusMasterModel> lststatusmodel;
        //    int rowAffected = 0;
        //    try
        //    {
        //        using (IDbConnection connection = IDbOpenConnection())
        //        {
        //            var p = new DynamicParameters();
        //            p.Add("", statusmaster.Company_Code);
        //            p.Add("", statusmaster.Status_Code);
        //            p.Add("", statusmaster.Status_Name);

        //            string query = "INSERT INTO tbl_SFA_Status_Master(Company_Code,Status_Code,Status_Name,Record_Status)VALUES(@Company_Code,NEXT VALUE FOR SEQ_tbl_SFA_Status_Master,@Status_Name,@Record_Status)";
        //            rowAffected = connection.Execute(query, lstStatusMaster);
        //        }
        //    }
        //    catch
        //    {
        //        throw;
        //    }
        //    return rowAffected;
        //}


        /********************* START: USER PROJECT ******************************/
        public IEnumerable<UserProjectMapping> GetUserProjects(string companyCode)
        {
            IEnumerable<UserProjectMapping> lstprojects;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    lstprojects = connection.Query<UserProjectMapping>(SP_HDGETUSERPROJECT, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }

            return lstprojects;
        }

        public IEnumerable<UserProjectMapping> GetUserProjectMapDetails(string companyCode, int pageNumber, int pagesize, ref int totalpageNo)
        {
            IEnumerable<UserProjectMapping> lstprojects;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@PageNumber", pageNumber);
                    p.Add("@PageSize", pagesize);
                    p.Add("@TotalPageNo", totalpageNo, DbType.Int32, ParameterDirection.Output);
                    lstprojects = connection.Query<UserProjectMapping>(SP_HDGETUSERPROJECTMAPDETAILS, p, commandType: CommandType.StoredProcedure);
                    totalpageNo = p.Get<int>("@TotalPageNo");
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }

            return lstprojects;
        }


        public IEnumerable<UserProjectMapping> GetUserProjectMapallDetails(string companyCode)
        {
            IEnumerable<UserProjectMapping> lstprojects;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    lstprojects = connection.Query<UserProjectMapping>(SP_HDGETUSERPROJECTMAPPEDFULLDETAILS, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }

            return lstprojects;
        }



        public int InsertUserProjectMapping(List<MVCModels.UserProjectMapping> lstUserProject)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                    const string insertQuery = "INSERT INTO tbl_SFA_User_Project_Mapping(Company_Code,Mapping_Code,Project_Code,User_Code, " +
                                              "Start_Date,End_Date,Status) VALUES(@Company_Code,NEXT VALUE FOR SEQ_tbl_SFA_User_Project_Mapping,@Project_Code,@User_Code,@StartDate, " +
                                              "@EndDate,@Status)";
                    rowsAffected = connection.Execute(insertQuery, lstUserProject, transaction: trans);
                    trans.Commit();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }


            return rowsAffected;
        }

        public int UpdateUserProject(List<MVCModels.UserProjectMapping> lstUserProject)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();

                    const string UpdateQuery = "UPDATE tbl_SFA_User_Project_Mapping SET Project_Code = @Project_Code,Start_Date=@StartDate,End_Date=@EndDate  WHERE Company_Code = @Company_Code and " +
                                                   "Project_Code = @OldProjectCode AND User_Code= @User_Code";
                    rowsAffected = connection.Execute(UpdateQuery, lstUserProject, transaction: trans);
                    trans.Commit();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }


            return rowsAffected;
        }

        public int UpdateUserProjectMapping(string companyCode, string projectCode)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                    const string deleteQuery = "UPDATE tbl_SFA_User_Project_Mapping SET Status = 0  WHERE Company_Code = @CompanyCode and " +
                                                   "Mapping_Code = @MapCode";
                    rowsAffected = connection.Execute(deleteQuery, new { CompanyCode = companyCode, MapCode = projectCode },
                                                transaction: trans);
                    trans.Commit();
                    return rowsAffected;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowsAffected;
        }
        //********************************************************Start Request MApping*********************************************88888//
        public IEnumerable<RequestModel> GetUnderUserType(RequestModel objDroUserType)
        {
            IEnumerable<RequestModel> lstUserTypeNames;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", objDroUserType.Company_Code);
                    p.Add("@User_Code", objDroUserType.User_Code);

                    lstUserTypeNames = connection.Query<RequestModel>(SP_HDGETCHILDUSERTYPES, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch
            {
                throw;
            }
            return lstUserTypeNames;
        }

        public IEnumerable<RequestModel> GetRequest(RequestModel objDroRequest)
        {
            IEnumerable<RequestModel> lstRequest;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", objDroRequest.Company_Code);
                    lstRequest = connection.Query<RequestModel>(SP_HDGETREQUEST, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch
            {
                throw;
            }
            return lstRequest;
        }

        public IEnumerable<RequestModel> GetRequestMapDetails(string companyCode)
        {
            IEnumerable<RequestModel> lstrequest;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    lstrequest = connection.Query<RequestModel>(SP_HDGETREQUESTUSERTYPEMAPVALUES, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }

            return lstrequest;
        }

        public int RequestChangeStatus(string companyCode, string mapCode, string statusChange)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                    const string deleteQuery = "UPDATE tbl_SFA_Request_UserType_Mapping SET Record_Status = @RecordStatus  WHERE Company_Code = @CompanyCode and " +
                                                   "Request_Mapping_Code = @MapCode";
                    rowsAffected = connection.Execute(deleteQuery, new { CompanyCode = companyCode, MapCode = mapCode, RecordStatus = statusChange },
                                                transaction: trans);
                    trans.Commit();
                    return rowsAffected;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowsAffected;
        }

        public int InsertRequestMapping(List<MVCModels.RequestModel> lstRequest)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                    const string insertQuery = "INSERT INTO tbl_SFA_Request_UserType_Mapping(Company_Code,Request_Mapping_Code,Request_Code,User_Type_Code, " +
                                              "Record_Status) VALUES(@Company_Code,NEXT VALUE FOR SEQ_tbl_SFA_Request_UserType_Mapping,@Request_Code,@User_Type_Code,@Record_Status)";
                    rowsAffected = connection.Execute(insertQuery, lstRequest, transaction: trans);
                    trans.Commit();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }


            return rowsAffected;
        }


        public int UpdateRequestMapping(List<MVCModels.RequestModel> lstRequest)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                    const string updateQuery = "UPDATE tbl_SFA_Request_UserType_Mapping SET Request_Code = @Request_Code,User_Type_Code = @User_Type_Code WHERE Company_Code = @Company_Code and " +
                                                  "Request_Mapping_Code = @Request_Mapping_Code";
                    rowsAffected = connection.Execute(updateQuery, lstRequest, transaction: trans);
                    trans.Commit();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }


            return rowsAffected;
        }



        //*********************************************************END USER REQUEST MAPPING*********************************************//

        //*********************************************************START DIVSION USER PRODUCTS MAPPING*********************************************//
        public IEnumerable<DivisionUserProducts> GetDivisionNames(DivisionUserProducts objDivUserProduct)
        {
            IEnumerable<DivisionUserProducts> lstDivisionNames;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", objDivUserProduct.Company_Code);
                    p.Add("@UserCode", objDivUserProduct.User_Code);
                    //lstDivisionNames = connection.Query<DivisionUserProducts>(SP_HDGETDIVISIONS, p, commandType: CommandType.StoredProcedure);
                    lstDivisionNames = connection.Query<DivisionUserProducts>(SP_HDGETUSERDIVISIONS, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch
            {
                throw;
            }
            return lstDivisionNames;
        }



        public IEnumerable<DivisionUserProducts> GetUserTypeNames(DivisionUserProducts objDivUserProduct)
        {
            IEnumerable<DivisionUserProducts> lstUserTypeNames;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", objDivUserProduct.Company_Code);
                    p.Add("@User_Code", objDivUserProduct.User_Code);
                    //lstUserTypeNames = connection.Query<DivisionUserProducts>(SP_HDGETUSERTYPELIST, p, commandType: CommandType.StoredProcedure);
                    lstUserTypeNames = connection.Query<DivisionUserProducts>(SP_HDGETUNDERUSERTYPELIST, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch
            {
                throw;
            }
            return lstUserTypeNames;
        }

        public IEnumerable<DivisionUserProducts> GetUsersByUserTypeAndDivision(string companyCode, string userTypeCode, string divisionCode)
        {
            IEnumerable<DivisionUserProducts> lstusers;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@UserTypeCode", userTypeCode);
                    p.Add("@DivisionCode", divisionCode);
                    lstusers = connection.Query<DivisionUserProducts>(SP_hdGetUsersByUserTypeAndDivision, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }

            return lstusers;
        }

        public IEnumerable<User_Employeedetails> GetaluminiUserDetail(string companyCode, string userCode)
        {
            IEnumerable<User_Employeedetails> lstusers;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@UserCode", userCode);
                    lstusers = connection.Query<User_Employeedetails>(SP_HDGETALUMINIUSERDETAIL, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }

            return lstusers;
        }

        public List<MVCModels.HiDoctor_Master.SingleActivityPerDayValue> GetSingleActivityPerDayValue(string Company_Code, string User_Type)
        {
            List<MVCModels.HiDoctor_Master.SingleActivityPerDayValue> lstvalue = new List<MVCModels.HiDoctor_Master.SingleActivityPerDayValue>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", Company_Code);
                    p.Add("@User_Type", User_Type);
                    lstvalue = connection.Query<MVCModels.HiDoctor_Master.SingleActivityPerDayValue>(Sp_SingleActivityPerDayValue, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return lstvalue;
        }

        public IEnumerable<DivisionUserProducts> Getprivilagevalues(string companyCode, string userTypeCode, string privilageName)
        {
            IEnumerable<DivisionUserProducts> lstprivilegeValues;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Type_Code", userTypeCode);
                    p.Add("@Privilege_Name", privilageName);
                    lstprivilegeValues = connection.Query<DivisionUserProducts>(SP_HDGETDIVUSERPRODUCTPRIVALEGEVALUE, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }

            return lstprivilegeValues;
        }




        public IEnumerable<DivisionUserProducts> GetDivUserProductMapDetails(string companyCode, string divisionCode, string proSelectMode, string productType, string actionType, string userCode)
        {
            IEnumerable<DivisionUserProducts> lstDivuserPro;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@DivisionCode", divisionCode);
                    p.Add("@proSelectMode", proSelectMode);
                    p.Add("@productType", productType);
                    p.Add("@userCode", userCode);
                    p.Add("@actionType", actionType);
                    lstDivuserPro = connection.Query<DivisionUserProducts>(SP_HDGETDIVISIONUSERPRODUCTMAPDETAIL, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }

            return lstDivuserPro;
        }


        public IEnumerable<DivisionUserProducts> GetAssignedProducts(string companyCode, string userCodes)
        {
            IEnumerable<DivisionUserProducts> lstAssignedPro;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@UserCode", userCodes);
                    lstAssignedPro = connection.Query<DivisionUserProducts>(SP_HDGETDIVUSERPROASSIGNEDPRODUCT, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }

            return lstAssignedPro;
        }




        public int InsertDivUserProducts(List<MVCModels.DivisionUserProducts> lstUserProduct)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                    const string insertQuery = "INSERT INTO tbl_SFA_User_Product(Company_Code,User_Product_Code,User_Code,Product_Code, " +
                                              "Current_Stock,Effective_From) VALUES(@Company_Code,NEXT VALUE FOR SEQ_tbl_SFA_User_Product,@User_Code,@Product_Code,@Current_Stock, " +
                                              "@Effective_From)";
                    rowsAffected = connection.Execute(insertQuery, lstUserProduct, transaction: trans);
                    trans.Commit();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }


            return rowsAffected;
        }
        /// <summary>
        /// Insert Division User Product Mapping
        /// </summary>
        /// <param name="lstDivisionUserProducts"></param>
        /// <returns></returns>
        public int InsertDivisionUserProductMapping(List<MVCModels.DivisionUserProducts> lstDivisionUserProducts)
        {
            int rowCount = 0;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", lstDivisionUserProducts[0].Company_Code);
                    parameter.Add("@UserCodes", lstDivisionUserProducts[0].User_Code);
                    parameter.Add("@ProductCodes", lstDivisionUserProducts[0].Product_Code);
                    parameter.Add("@MinCounts", lstDivisionUserProducts[0].Min_Counts);
                    parameter.Add("@MaxCounts", lstDivisionUserProducts[0].Max_Counts);
                    parameter.Add("@Result", 0, DbType.Int32, ParameterDirection.Output);

                    connection.Query<int>(SP_HD_INSERTDIVISIONUSERPRODUCTS, commandTimeout: 500, param: parameter, commandType: CommandType.StoredProcedure);
                    rowCount = parameter.Get<int>("@Result");
                }
                return rowCount;
            }
            catch
            {
                throw;
            }
        }

        //*********************************************************end DIVSION USER PRODUCTS MAPPING*********************************************//

        /// <summary>
        /// To Get the Status Cycle Mapping Details.
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<StatusCycleMapping> GetStatusCylceMappingDetails(string companyCode)
        {
            _objData = new Data();
            IEnumerable<StatusCycleMapping> lststatusCycleMapping;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@companyCode", companyCode);
                    lststatusCycleMapping = connection.Query<StatusCycleMapping>(SPHDSTATUSCYCLEMAPPING, parameter, commandType: CommandType.StoredProcedure);
                }
                return lststatusCycleMapping;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("SPNAME", SPHDSTATUSCYCLEMAPPING);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
        }


        public int InsertStatusCycleMapping(string companyCode, string cycleCode, string cycleName, string statusCode, string statusName, string description, string statusOwnerType,
            int orderNo, string moveOrder, string mode, string oCycleCode, string oStatusCode, int recordStatus, string createdBy, string createdDate, string updatedBy, string updatedDate)
        {
            try
            {
                StatusCycleMapping objStatusCycleMapp = new StatusCycleMapping();
                objStatusCycleMapp.Company_Code = companyCode;
                objStatusCycleMapp.Cycle_Code = cycleCode;
                objStatusCycleMapp.Cycle_Name = cycleName;
                objStatusCycleMapp.Status_Code = statusCode;
                objStatusCycleMapp.Status_Name = statusName;
                objStatusCycleMapp.Long_Description = description;
                objStatusCycleMapp.Status_Owner_Type = statusOwnerType;
                objStatusCycleMapp.Order_No = orderNo;
                objStatusCycleMapp.Move_Order = moveOrder;
                objStatusCycleMapp.OCycle_Code = oCycleCode;
                objStatusCycleMapp.OStatus_Code = oStatusCode;
                objStatusCycleMapp.Record_Status = recordStatus;
                objStatusCycleMapp.Created_By = createdBy;
                objStatusCycleMapp.Created_Date = createdDate;
                objStatusCycleMapp.Updated_By = updatedBy;
                objStatusCycleMapp.Updated_Date = updatedDate;


                List<StatusCycleMapping> lstStatCycleMapp = new List<StatusCycleMapping>();
                lstStatCycleMapp.Add(objStatusCycleMapp);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    int count = 0;
                    int rowsAffected = 0;
                    if (mode.ToUpper() != "C")
                    {

                        const string selectQry = "SELECT COUNT(1) FROM tbl_SFA_Status_Cycle_Master WHERE Company_Code = @Company_Code AND Cycle_Code = @Cycle_Code AND Status_Code = @Status_Code";

                        count = connection.Query<int>(selectQry, new { Company_Code = companyCode, Cycle_Code = cycleCode, Status_Code = statusCode }
                                                        ).Single();
                        if (count == 0)
                        {
                            rowsAffected = 0;
                            if (mode.ToUpper() == "I")
                            {
                                const string insertQry = "INSERT INTO tbl_SFA_Status_Cycle_Master(Company_Code,Cycle_Code,Cycle_Name,Status_Code, " +
                                                        "Status_Name,Long_Description,Status_Owner_Type,Order_No,Record_Status,Move_Order,Created_By,Created_Date) " +
                                                        "VALUES (@Company_Code,@Cycle_Code,@Cycle_Name,@Status_Code,@Status_Name,@Long_Description, " +
                                                        "@Status_Owner_Type,@Order_No,1,@Move_Order,@Created_By,@Created_Date)";
                                rowsAffected = connection.Execute(insertQry, lstStatCycleMapp);

                            }
                            else if (mode == "E")
                            {
                                const string updateQry = "UPDATE tbl_SFA_Status_Cycle_Master SET Cycle_Code = @Cycle_Code," +
                                                            "Cycle_Name = @Cycle_Name,Status_Code = @Status_Code,Status_Name = @Status_Name,Long_Description = @Long_Description," +
                                                            "Status_Owner_Type = @Status_Owner_Type,Order_No = @Order_No,Move_Order=@Move_Order,Updated_By=@Updated_By,Updated_Date=@Updated_Date WHERE Company_Code = @Company_Code " +
                                                            "AND Cycle_Code = @OCycle_Code AND Status_Code = @OStatus_Code";
                                rowsAffected = connection.Execute(updateQry, lstStatCycleMapp);
                            }
                        }
                        else
                        {
                            if (mode == "E")
                            {

                                const string uniqueChkQry = "SELECT COUNT(1) FROM tbl_SFA_Status_Cycle_Master WHERE Company_Code = @Company_Code AND (Cycle_Code = @Cycle_Code AND Status_Code = @Status_Code) AND (Cycle_Code <> @OCycle_Code OR Status_Code <> @OStatus_Code)";

                                count = connection.Query<int>(uniqueChkQry, new { Company_Code = companyCode, Cycle_Code = cycleCode, Status_Code = statusCode, OCycle_Code = oCycleCode, OStatus_Code = oStatusCode }
                                                                ).Single();

                                if (count == 0)
                                {
                                    const string updateQry = "UPDATE tbl_SFA_Status_Cycle_Master SET Cycle_Code = @Cycle_Code,Cycle_Name = @Cycle_Name," +
                                                            "Status_Code = @Status_Code,Status_Name = @Status_Name,Long_Description = @Long_Description," +
                                                            "Status_Owner_Type = @Status_Owner_Type,Order_No = @Order_No,Move_Order=@Move_Order,Updated_By=@Updated_By,Updated_Date=@Updated_Date " +
                                                            "WHERE Company_Code = @Company_Code AND Cycle_Code = @Cycle_Code AND Status_Code = @Status_Code";

                                    rowsAffected = connection.Execute(updateQry, lstStatCycleMapp);
                                }
                                else
                                {
                                    rowsAffected = -1;
                                }

                            }
                            else
                            {
                                rowsAffected = -1;
                            }
                        }
                    }
                    else
                    {
                        const string updateQry = "UPDATE tbl_SFA_Status_Cycle_Master SET Record_Status = @Record_Status,Updated_By=@Updated_By,Updated_Date=@Updated_Date WHERE Company_Code = @Company_Code " +
                                                    "AND Cycle_Code = @Cycle_Code AND Status_Code = @Status_Code";

                        rowsAffected = connection.Execute(updateQry, lstStatCycleMapp);
                    }
                    return rowsAffected;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("companyCode", companyCode);
                dicObj.Add("cycleCode", cycleCode);
                dicObj.Add("cycleName", cycleName);
                dicObj.Add("statusCode", statusCode);
                dicObj.Add("statusName", statusName);
                dicObj.Add("description", description);
                dicObj.Add("statusOwnerType", statusOwnerType);
                dicObj.Add("orderNo", orderNo.ToString());
                dicObj.Add("moveOrder", moveOrder);
                dicObj.Add("mode", mode);
                dicObj.Add("oCycleCode", oCycleCode);
                dicObj.Add("oStatusCode", oStatusCode);
                dicObj.Add("recordStatus", recordStatus.ToString());
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return 0;
            }
        }

        //DoctorCategoryDetails
        public IEnumerable<MVCModels.HiDoctor_Master.DoctorModel> GetdoctorCategoryDetails(MVCModels.HiDoctor_Master.DoctorModel doctorCategory)
        {
            IEnumerable<MVCModels.HiDoctor_Master.DoctorModel> lstdoctorCategory;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", doctorCategory.Company_Code);
                    lstdoctorCategory = connection.Query<MVCModels.HiDoctor_Master.DoctorModel>(SP_hd_Getdoctorcategory, p, commandType: CommandType.StoredProcedure);

                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("SPNAME", SP_hd_Getdoctorcategory);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
            return lstdoctorCategory;
        }

        //GetDivisions
        public IEnumerable<MVCModels.HiDoctor_Master.DoctorModel> GetDivisionName(MVCModels.HiDoctor_Master.DoctorModel doctorCategory)
        {
            IEnumerable<MVCModels.HiDoctor_Master.DoctorModel> lstdoctorCategory;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", doctorCategory.Company_Code);
                    lstdoctorCategory = connection.Query<MVCModels.HiDoctor_Master.DoctorModel>(SP_hdGetDivisions, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("SPNAME", SP_hdGetDivisions);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
            return lstdoctorCategory;
        }

        //change Status for doctorcategory
        public string ChangestatusforDoctorCategoryMaster(string status, string doctorCategoryCode, string companyCode)
        {
            string result = "";
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    if ("1" == status)
                    {
                        const string query = "UPDATE tbl_SFA_Doctor_Category SET Status=0 WHERE Category_Code = @DoctorcategoryCode AND Company_Code = @CompanyCode";
                        connection.Execute(query, new { DoctorcategoryCode = doctorCategoryCode, CompanyCode = companyCode });
                    }
                    else
                    {
                        const string query = "UPDATE tbl_SFA_Doctor_Category SET Status=1 WHERE Category_Code = @DoctorcategoryCode AND Company_Code = @CompanyCode";
                        connection.Execute(query, new { DoctorcategoryCode = doctorCategoryCode, CompanyCode = companyCode });
                    }
                }
            }

            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("status", status);
                dicObj.Add("doctorCategoryCode", doctorCategoryCode);
                dicObj.Add("companyCode", companyCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return "ERROR: " + ex.Message.ToString();
            }
            return result;
        }

        //Insert for Doctorcategory
        public int InsertforDoctorCategoryMaster(List<MVCModels.HiDoctor_Master.DoctorModel> lstDoctorCategory)
        {
            int rowsAffected = 0;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    string query = "INSERT INTO tbl_SFA_Doctor_Category(Company_Code,Category_Code,Category_Name,Status,Visit_Count,Doctor_Count,Division_Code,Effective_From,Effective_To,Created_By,Created_Date)VALUES(@Company_Code,NEXT VALUE FOR SEQ_tbl_SFA_Doctor_Category,@Category_Name,@Status,@Visit_Count,@Doctor_Count,@Division_Code,@Effective_From,@Effective_To,@Created_By,@Created_Date)";
                    rowsAffected = connection.Execute(query, lstDoctorCategory);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowsAffected;
        }

        //Update for DoctorCategory
        public int UpdateforDoctorcategoryMaster(List<MVCModels.HiDoctor_Master.DoctorModel> lstDoctorCategory)
        {
            int rowAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    string query = "UPDATE tbl_SFA_Doctor_Category SET Category_Name = @Category_Name,Visit_Count=@Visit_Count,Doctor_Count=@Doctor_Count,Division_Code=@Division_Code,Effective_From=@Effective_From,Effective_To=@Effective_To,Updated_By = @Updated_By,Updated_Date=@Updated_Date WHERE Category_Code=@Category_Code AND Company_Code=@Company_Code";
                    rowAffected = connection.Execute(query, lstDoctorCategory);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowAffected;
        }

        //HiDoctorStartDate
        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetHidoctorStartdateDetails(MVCModels.HiDoctor_Master.UserModel userModel)
        {
            IEnumerable<MVCModels.HiDoctor_Master.UserModel> lstUserModel;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", userModel.Company_Code);
                    lstUserModel = connection.Query<MVCModels.HiDoctor_Master.UserModel>(SPHDGETHIDOCTORSTARTDATE, p, commandType: CommandType.StoredProcedure);

                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("SPNAME", SPHDGETHIDOCTORSTARTDATE);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
            return lstUserModel;
        }

        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetHidoctorStartdate(MVCModels.HiDoctor_Master.UserModel userModel)
        {
            IEnumerable<MVCModels.HiDoctor_Master.UserModel> lstUserModel;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", userModel.Company_Code);
                    lstUserModel = connection.Query<MVCModels.HiDoctor_Master.UserModel>(SP_HdGetHiDoctorStartDateDetails, p, commandType: CommandType.StoredProcedure);

                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("SPNAME", SP_HdGetHiDoctorStartDateDetails);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
            return lstUserModel;
        }

        //Update for HidoctorstartDate
        public string UpdateforHidoctorStartDate(List<MVCModels.HiDoctor_Master.UserModel> lstUser)
        {

            _objSPData = new SPData();
            _objData = new Data();
            // int rowAffected = 0;
            try
            {

                foreach (var item in lstUser)
                {
                    SqlCommand command = new SqlCommand(SP_HD_UpdateHiDoctorStartDate);
                    command.CommandType = CommandType.StoredProcedure;

                    _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, item.Company_Code);
                    _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 1000, item.User_Code);
                    _objSPData.AddParamToSqlCommand(command, "@HiDOCTOR_Start_Date", ParameterDirection.Input, SqlDbType.VarChar, 30, item.HiDOCTOR_Start_Date);
                    _objSPData.AddParamToSqlCommand(command, "@Updated_By", ParameterDirection.Input, SqlDbType.VarChar, 30, item.Updated_By);
                    _objSPData.AddParamToSqlCommand(command, "@Updated_Time", ParameterDirection.Input, SqlDbType.VarChar, 30, item.Updated_Time);

                    _objData.OpenConnection(item.Company_Code);
                    _objData.ExecuteNonQuery(command);
                    _objData.CloseConnection();
                }

                return "success";

                //  return command.Parameters["@Result"].Value.ToString();

            }
            catch (Exception ex)
            {
                throw ex;
            }
            //finally
            //{
            //    _objData.CloseConnection();
            //}
        }
        //using (IDbConnection connection = IDbOpenConnection())
        //{



        //   // string query = "UPDATE tbl_SFA_User_Master SET HiDOCTOR_Start_Date =@HiDOCTOR_Start_Date,Updated_By=@Updated_By,Updated_Time=@Updated_Time WHERE Company_Code =@Company_Code AND User_Code=@User_Code AND User_Status ='1'";
        //  //  rowAffected = connection.Execute(query, lstuserModel);
        //}
        //  }
        //catch (Exception ex)
        //{
        //    throw ex;
        //}
        // return rowAffected;

        public string GetPrivilegeValue(string companyCode, string userCode, string privilegeName)
        {
            int rowCount = 0;
            string privilegeValue = string.Empty;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    //IDbTransaction trans = connection.BeginTransaction();


                    // get DCR_ENTRY_UNAPPROVED_ACTIVITY_LOCK value
                    string query = "SELECT COUNT(1) FROM tbl_SFA_UserType_Privilege_Mapping_NG PM" +
                                   " INNER JOIN TBL_SFA_USER_MASTER UM ON PM.User_Type_Code=UM.User_Type_Code" +
                                   " WHERE UM.User_Code=@User_Code AND Privilege_Name = @Privilege_Name" +
                                   " AND PM.Record_Status=@Record_Status AND PM.Company_Code = @Company_Code";

                    rowCount = connection.Query<int>(query, new
                    {
                        Company_Code = companyCode,
                        User_Code = userCode,
                        Privilege_Name = privilegeName,
                        Record_Status = "1",
                    }).Single();
                    //,transaction: trans
                    if (rowCount > 0)
                    {
                        // get DCR_ENTRY_UNAPPROVED_ACTIVITY_LOCK value
                        query = "SELECT Privilege_Value_Name FROM tbl_SFA_UserType_Privilege_Mapping_NG PM" +
                                      " INNER JOIN TBL_SFA_USER_MASTER UM ON PM.User_Type_Code=UM.User_Type_Code" +
                                      " WHERE UM.User_Code=@User_Code AND Privilege_Name = @Privilege_Name" +
                                      " AND PM.Record_Status=@Record_Status AND PM.Company_Code = @Company_Code";

                        privilegeValue = connection.Query<string>(query, new
                        {
                            Company_Code = companyCode,
                            User_Code = userCode,
                            Privilege_Name = privilegeName,
                            Record_Status = "1",
                        }).Single();
                        //transaction: trans
                    }

                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return privilegeValue;
        }

        //************************************************************************SMEs************************
        public IEnumerable<SendSMS> GetUserInfoDetails(string companyCode, string fromDate, string toDate)
        {
            IEnumerable<SendSMS> lstuserInfo;

            using (IDbConnection connection = IDbOpenConnection())
            {
                var p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@FromDate", fromDate);
                p.Add("@ToDate", toDate);
                lstuserInfo = connection.Query<SendSMS>(SP_HDGETUSERINFOFORSMS, p, commandType: CommandType.StoredProcedure);
                connection.Close();
            }
            return lstuserInfo;
        }

        public IEnumerable<SendSMS> GetSentSMSDetails(string userCode)
        {
            IEnumerable<SendSMS> lstSentSMSDetails;

            using (IDbConnection connection = IDbOpenConnection())
            {
                var p = new DynamicParameters();
                p.Add("@UserCode", userCode);
                lstSentSMSDetails = connection.Query<SendSMS>(SP_HDGETSENTSMSDETAILS, p, commandType: CommandType.StoredProcedure);
                connection.Close();
            }
            return lstSentSMSDetails;
        }

        public IEnumerable<SendSMS> GetUserDetails(string companyCode, string userCode)
        {
            IEnumerable<SendSMS> lstuserDetails;

            using (IDbConnection connection = IDbOpenConnection())
            {
                var p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@UserCode", userCode);
                lstuserDetails = connection.Query<SendSMS>(SP_HDGETUSERCODE, p, commandType: CommandType.StoredProcedure);
                connection.Close();
            }
            return lstuserDetails;
        }

        public bool SMSSentLog(string companyCode, string companyId, string userCode, string userName, string senderCode, string senderName, string mobileno, string message)
        {
            bool lstSMSLog = false;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@Company_Id", companyId);
                    p.Add("@UserCode", userCode);
                    p.Add("@User_Name", userName);
                    p.Add("@Sender_User_Code", senderCode);
                    p.Add("@Sender_User_Name", senderName);
                    p.Add("@Mobile", mobileno);
                    p.Add("@SMS_Details", message);
                    connection.Execute(SP_HDSENTSMSLOG, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                    lstSMSLog = true;
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return lstSMSLog;
        }


        //--------------START - SUB REGION MASTER---------------------------//
        /// <summary>
        /// Get Sub Region Master 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<SubRegionMasterModel> GetSubRegionMaster(string companyCode)
        {
            IEnumerable<SubRegionMasterModel> lstSubregion;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    lstSubregion = connection.Query<SubRegionMasterModel>(SP_HDGETSUBREGIONMASTER, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }

            return lstSubregion;
        }

        //Insert for SubRegionMaster
        public int InsertforSubRegionMaster(List<SubRegionMasterModel> lstSubRegionMaster)
        {
            int rowsAffected = 0;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    string query = "INSERT INTO tbl_SFA_Subregion_Master(Company_Code,Subregion_Code,Subregion_Name,Underregion_Code,Subregion_Status,Created_By,Created_Date) VALUES (@Company_Code,NEXT VALUE FOR SEQ_tbl_SFA_Subregion_Master,@Subregion_Name,@Underregion_Code,@Subregion_Status,@Created_By,@Created_Date)";
                    rowsAffected = connection.Execute(query, lstSubRegionMaster);
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return rowsAffected;
        }
        /// <summary>
        /// Update SubRegionMaster
        /// </summary>
        /// <param name="lstSubregion"></param>
        /// <returns></returns>
        public int UpdateforSubRegionMaster(List<SubRegionMasterModel> lstSubregion)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {

                    var parameters = new DynamicParameters();
                    const string query = "UPDATE tbl_SFA_Subregion_Master SET Subregion_Name = @Subregion_Name,Underregion_Code = @Underregion_Code,Updated_By=@Updated_By,Updated_Date=@Updated_Date WHERE Company_Code = @Company_Code AND Subregion_Code = @Subregion_Code";
                    rowsAffected = connection.Execute(query, lstSubregion);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowsAffected;

        }

        /// <summary>
        /// change Status for SubRegionMaster
        /// </summary>
        /// <param name="status"></param>
        /// <param name="subRegionCodeVal"></param>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public string ChangestatusforSubRegionMaster(string status, string subRegionCodeVal, string companyCode)
        {
            string result = "";
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    if ("1" == status)
                    {
                        const string query = "UPDATE tbl_SFA_Subregion_Master SET Subregion_Status =0 WHERE Company_Code = @CompanyCode AND Subregion_Code = @SubRegioncode";
                        connection.Execute(query, new { SubRegioncode = subRegionCodeVal, CompanyCode = companyCode });
                    }
                    else
                    {
                        const string query = "UPDATE tbl_SFA_Subregion_Master SET Subregion_Status =1 WHERE Company_Code = @CompanyCode AND Subregion_Code = @SubRegioncode";
                        connection.Execute(query, new { SubRegioncode = subRegionCodeVal, CompanyCode = companyCode });
                    }
                }
            }

            catch
            {
                throw;
            }
            return result;
        }
        //--------------END - SUB REGION MASTER---------------------------//
        #region LeaveBalanceUpdate
        /// <summary>
        /// Get LeaveTypeNames
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public DataSet GetLeaveTypeName(string companyCode)
        {
            DataSet ds;
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETLEAVETYPENAME);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objData.OpenConnection(companyCode);
                ds = _objData.ExecuteDataSet(command);
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return ds;
        }
        /// <summary>
        /// Get Employee Details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public DataSet GetEmployeeDetails(string companyCode)
        {
            DataSet ds;
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETEMPLOYEEDETAILS);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objData.OpenConnection(companyCode);
                ds = _objData.ExecuteDataSet(command);
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return ds;
        }
        /// <summary>
        /// Get UserMaster and LeaveTypeValues
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public DataSet GetleaveBalanceUpdate(string companyCode)
        {
            DataSet ds;
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETLEAVEBALANCEUPDATEFORUSER);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objData.OpenConnection(companyCode);
                ds = _objData.ExecuteDataSet(command);
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return ds;
        }

        public string CheckLeaveBalance(string companyCode, string userCode, string leaveTypecode, string Effective_From, string Effective_To)
        {
            _objSPData = new SPData();
            _objData = new Data();

            //Effective_From = Effective_From.Split('-')[2] + '-' + Effective_From.Split('-')[1] + '-' + Effective_From.Split('-')[0];
            //Effective_To = Effective_To.Split('-')[2] + '-' + Effective_To.Split('-')[1] + '-' + Effective_To.Split('-')[0];

            string result = string.Empty;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    p.Add("@Leave_Type_Code", leaveTypecode);
                    p.Add("@Effective_From", Effective_From);
                    p.Add("@Effective_To", Effective_To);
                    p.Add("@Result", string.Empty, DbType.String, ParameterDirection.Output);
                    connection.Query<string>(SP_HdGetCheckLeaveBalance, p, commandType: CommandType.StoredProcedure).ToString();
                    result = p.Get<string>("@Result");
                    _objData.CloseConnection();
                }
            }
            catch(Exception ex)
            {
                throw ex;
            }
            return result;
        }

        /// <summary>
        /// Check leavebalance Update
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="leaveTypecode"></param>
        /// <returns></returns>
        //public bool CheckLeaveBalance(string companyCode, string userCode, string leaveTypecode)
        //{
        //    bool countvalue = false;

        //    try
        //    {
        //        using (IDbConnection connection = IDbOpenConnection())
        //        {
        //            countvalue = connection.Query<bool>(SP_HDGETCHECKLEAVEBALANCE, new
        //            {
        //                @CompanyCode = companyCode,
        //                @UserCode = userCode,
        //                @LeaveTypeCode = leaveTypecode
        //            },
        //                                                                  commandType: CommandType.StoredProcedure).FirstOrDefault();
        //        }
        //        if (!countvalue)
        //        {
        //            return true;
        //        }
        //        else
        //        {
        //            return false;
        //        }
        //    }
        //    catch
        //    {
        //        throw;
        //    }
        //}
        /// <summary>
        /// Update the LeaveBalance
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="leaveTypeCode"></param>
        /// <param name="updatedBy"></param>
        /// <param name="UpdateDate"></param>
        /// <returns></returns>
        public int UpdateUserLeave(string companyCode, string userCode, string leaveTypeCode, string updatedBy, string UpdateDate)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameters = new DynamicParameters();
                    parameters.Add("@Company_Code", companyCode);
                    parameters.Add("@User_Code", userCode);
                    parameters.Add("@Leave_Type_Code", leaveTypeCode);
                    parameters.Add("@CurBalance_Updated_By", updatedBy);
                    parameters.Add("@CurBalance_Updated_Date", UpdateDate);
                    const string query = "UPDATE tbl_SFA_User_Leave_CurBalance SET Is_Active='0',CurBalance_Updated_By= @CurBalance_Updated_By,CurBalance_Updated_Date=@CurBalance_Updated_Date WHERE Company_Code =@Company_Code  AND User_Code =@User_Code AND Leave_Type_Code =@Leave_Type_Code";
                    rowsAffected = connection.Execute(query, parameters);
                }
            }
            catch
            {
                throw;
            }
            return rowsAffected;
        }
        /// <summary>
        /// Insert LeaveBalance
        /// </summary>
        /// <param name="lstLeavecurBalance"></param>
        /// <returns></returns>
        public int InsertUserLeave(List<LeaveCurBalance> lstLeavecurBalance)
        {
            int rowsAffected = 0;
            
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    //string query = "INSERT INTO tbl_SFA_User_Leave_CurBalance(Company_Code,User_Leave_Code,User_Type_Code,User_Code,Leave_Type_Code,Balance_CF,Leave_Eligible,Leave_Taken,Leave_Balance,Lapsed,Opening_Balance,Effective_From,Request_From,Requested_Date,Request_Reason,Entered_By,Entered_DateTime,Support_User_Name,Is_Active)VALUES(@Company_Code,NEXT VALUE FOR SEQ_tbl_SFA_User_Leave_CurBalance,@User_Type_Code,@User_Code,@Leave_Type_Code,@Balance_CF,@Leave_Eligible,@Leave_Taken,@Leave_Balance,@Lapsed,@Opening_Balance,@Effective_From,@Request_From,@Requested_Date,@Request_Reason,@Entered_By,@Entered_DateTime,@Support_User_Name,@Is_Active)";
                    //rowsAffected = connection.Execute(query, lstLeavecurBalance);
                    //var p = new DynamicParameters();
                    //p.Add("@Company_Code", lstLeavecurBalance.Company_Code);
                    //p.Add("@User_Leave_Code", "NEXT VALUE FOR SEQ_tbl_SFA_User_Leave_CurBalance");
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", lstLeavecurBalance[0].Company_Code);
                    p.Add("@User_Leave_Code", lstLeavecurBalance[0].User_Leave_Code);
                    p.Add("@User_Type_Code", lstLeavecurBalance[0].User_Type_Code);
                    p.Add("@User_Code", lstLeavecurBalance[0].User_Code);
                    p.Add("@Leave_Type_Code", lstLeavecurBalance[0].Leave_Type_Code);
                    p.Add("@Balance_CF", lstLeavecurBalance[0].Balance_CF);
                    p.Add("@Lapsed", lstLeavecurBalance[0].Lapsed);
                    p.Add("@Leave_Eligible", lstLeavecurBalance[0].Leave_Eligible);
                    p.Add("@Effective_From", lstLeavecurBalance[0].Effective_From);
                    p.Add("@Effective_To", lstLeavecurBalance[0].Effective_To);
                    p.Add("@Request_From", lstLeavecurBalance[0].Request_From);
                    p.Add("@Requested_Date", lstLeavecurBalance[0].Requested_Date);
                    p.Add("@Request_Reason", lstLeavecurBalance[0].Request_Reason);
                    p.Add("@Entered_By", lstLeavecurBalance[0].Entered_By);
                    p.Add("@Entered_DateTime", lstLeavecurBalance[0].Entered_DateTime);
                    p.Add("@Support_User_Name", lstLeavecurBalance[0].Support_User_Name);
                    rowsAffected = Convert.ToInt32(connection.Execute(SP_HD_Upload_Leave_Balance, p, commandType: CommandType.StoredProcedure));
                    connection.Close();
                }
            }
            catch(Exception ex)
            {
                throw ex;
            }
            return rowsAffected;
        }
        #endregion LeaveBalanceUpdate

        #region Privilege_New Master]
        /// <summary>
        /// GetActivePrivilegeValue
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.PrivilegeMasterModel> GetActivePrivilegeValue(string companyCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.PrivilegeMasterModel> lstActivePrivilegeMaster;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    lstActivePrivilegeMaster = connection.Query<MVCModels.HiDoctor_Master.PrivilegeMasterModel>(SP_HDGETACTIVEPRIVILEGEVALUE, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }

            return lstActivePrivilegeMaster;
        }
        /// <summary>
        /// Get All privilegeValue
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.PrivilegeMasterModel> GetAllprivilegeValue(string companyCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.PrivilegeMasterModel> lstActivePrivilegeMaster;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    lstActivePrivilegeMaster = connection.Query<MVCModels.HiDoctor_Master.PrivilegeMasterModel>(SP_HDGETALLPRIVIELGEVALUE, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }

            return lstActivePrivilegeMaster;
        }
        /// <summary>
        /// GetActiveFeatre
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.FeatureModel> GetActiveFeatre(string companyCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.FeatureModel> lstActiveFeatre;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    lstActiveFeatre = connection.Query<MVCModels.HiDoctor_Master.FeatureModel>(SP_HDGETACTIVEFEATURE, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }

            return lstActiveFeatre;
        }
        /// <summary>
        /// GetAllPrivilegesFromMaster
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.PrivilegeMasterModel> GetAllPrivilegesFromMaster(string companyCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.PrivilegeMasterModel> lstAllPrivilegesFromMaster;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    lstAllPrivilegesFromMaster = connection.Query<MVCModels.HiDoctor_Master.PrivilegeMasterModel>(SP_HDGETALLPRIVILEGESFROMMASTER, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }

            return lstAllPrivilegesFromMaster;
        }
        /// <summary>
        /// GetActivePrivilegeMasterValues
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.PrivilegeMasterModel> GetActivePrivilegeMasterValues(string companyCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.PrivilegeMasterModel> lstActivePrivilegeMasterValues;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    lstActivePrivilegeMasterValues = connection.Query<MVCModels.HiDoctor_Master.PrivilegeMasterModel>(SP_HDGETACTIVEPRIVILEGEMASTERVALUES, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }

            return lstActivePrivilegeMasterValues;
        }
        /// <summary>
        /// Privilege and Active Master List
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Master.PrivilegeandFeatureMasterModel> GetPrivilegeandActiveMaster(string companyCode, string searchName)
        {
            List<MVCModels.HiDoctor_Master.PrivilegeandFeatureMasterModel> lstPrivilegeandActiveMaster = new List<MVCModels.HiDoctor_Master.PrivilegeandFeatureMasterModel>();

            try
            {
                List<MVCModels.HiDoctor_Master.PrivilegeMasterModel> lstPrivilegeMaster = null;
                List<MVCModels.HiDoctor_Master.FeatureModel> lstFeatureMaster = null;

                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@SearchName", searchName);
                    using (var mulitSelect = connection.QueryMultiple(SP_HDGETPRIVILEGEMASTER_NEW, parameter, commandType: CommandType.StoredProcedure))
                    {
                        lstPrivilegeMaster = mulitSelect.Read<MVCModels.HiDoctor_Master.PrivilegeMasterModel>().ToList();
                        lstFeatureMaster = mulitSelect.Read<MVCModels.HiDoctor_Master.FeatureModel>().ToList();
                    }
                }
                MVCModels.HiDoctor_Master.PrivilegeandFeatureMasterModel _objPrivilegeandActive = new MVCModels.HiDoctor_Master.PrivilegeandFeatureMasterModel();
                _objPrivilegeandActive.lstPrivilegeMaster = lstPrivilegeMaster;
                _objPrivilegeandActive.lstFeatureMaster = lstFeatureMaster;

                lstPrivilegeandActiveMaster.Add(_objPrivilegeandActive);
            }
            catch
            {
                throw;
            }

            return lstPrivilegeandActiveMaster;
        }
        /// <summary>
        /// Get ColumnNames
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="tableName"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.PrivilegeModel> GetColumnNames(string companyCode, string tableName)
        {
            IEnumerable<MVCModels.HiDoctor_Master.PrivilegeModel> lstCheckColumnNames;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@TableName", tableName);
                    lstCheckColumnNames = connection.Query<MVCModels.HiDoctor_Master.PrivilegeModel>(SP_HDGETCOLUMNNAMES, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }

            return lstCheckColumnNames;
        }
        /// <summary>
        /// Get PrivilegeValues for Litral
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="privilegeCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.PrivilegeMasterModel> GetPrivilegeMasterbyPrivilegeCode(string companyCode, string privilegeCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.PrivilegeMasterModel> lstPrivilegecode;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@PrivilegeCode", privilegeCode);
                    lstPrivilegecode = connection.Query<MVCModels.HiDoctor_Master.PrivilegeMasterModel>(SP_HDGETPRIVILEGEMASTERBYPRIVILEGECODE, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return lstPrivilegecode;
        }
        /// <summary>
        /// Add the Litral Value
        /// </summary>
        /// <param name="lstlitralvalues"></param>
        /// <returns></returns>
        public int InsertPrivilegeValue(List<MVCModels.HiDoctor_Master.PrivilegeMasterModel> lstlitralvalues)
        {
            int rowAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {

                    string query = "INSERT INTO tbl_SFA_Privilege_Values (Company_Code,Privilege_Value_Code,Privilege_Value_Name,Record_Status,Row_version_No) VALUES (@Company_Code,NEXT VALUE FOR SEQ_tbl_SFA_Privilege_Values,@Privilege_Value_Name,@Record_Status,@Row_version_No)";
                    rowAffected = connection.Execute(query, lstlitralvalues);
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowAffected;
        }

        //Insert for PrivilegeMaster New
        public int InsertforPrivilegeMaster(List<MVCModels.HiDoctor_Master.PrivilegeMasterModel> lstprivilege, List<MVCModels.HiDoctor_Master.PrivilegeValueMappingModel> lstPrivilegeValueMapping)
        {
            int rowAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                    string query = "INSERT INTO tbl_SFA_Privilege_Master(Company_Code,Privilege_Code,Privilege_Name,Base_privilege_code,Feature_Code,Description,Privilege_Value_Type,Lookup_table,Lookup_column,Row_Version_No,Record_Status,Entered_by,Entered_on)VALUES(@Company_Code,@Privilege_Code,@Privilege_Name,@Base_privilege_code,@Feature_Code,@Description,@Privilege_Value_Type,@Lookup_table,@Lookup_column,@Row_Version_No,@Record_Status,@Entered_by,@Entered_on)";
                    rowAffected = connection.Execute(query, lstprivilege, transaction: trans);
                    if (rowAffected > 0)
                    {
                        if (lstPrivilegeValueMapping.Count > 0 && lstPrivilegeValueMapping != null)
                        {
                            rowAffected = 0;
                            string mappingquery = "INSERT INTO tbl_SFA_Privilege_Value_Mapping (Company_Code, Privilege_Code, Privilege_Value_Code, Status,Created_By,Created_Date)  VALUES (@Company_Code,@Privilege_Code,@Privilege_Value_Code, '1',@Created_By,@Created_Date)";
                            rowAffected = connection.Execute(mappingquery, lstPrivilegeValueMapping, transaction: trans);

                        }
                    }
                    trans.Commit();
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowAffected;
        }

        /// <summary>
        /// Update for Privilege Master
        /// </summary>
        /// <param name="lstprivilege"></param>
        /// <returns></returns>
        public int UpdateforPrivilegeMaster(List<MVCModels.HiDoctor_Master.PrivilegeMasterModel> lstprivilege, List<MVCModels.HiDoctor_Master.PrivilegeValueMappingModel> lstPrivilegeValueMapping)
        {
            int rowAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                    string query = "UPDATE tbl_SFA_Privilege_Master SET Privilege_Name=@Privilege_Name,Base_privilege_code=@Base_privilege_code,Privilege_Value_Type=@Privilege_Value_Type,Feature_Code=@Feature_Code,Description=@Description,Lookup_table=@Lookup_table,Lookup_column=@Lookup_column,Updated_By=@Updated_By,Updated_Date=@Updated_Date WHERE Company_Code=@Company_Code AND Privilege_Code=@Privilege_Code";
                    rowAffected = connection.Execute(query, lstprivilege, transaction: trans);
                    if (rowAffected > 0)
                    {
                        if (lstPrivilegeValueMapping.Count > 0 && lstPrivilegeValueMapping != null)
                        {
                            rowAffected = 0;
                            const string deletequery = "DELETE FROM tbl_SFA_Privilege_Value_Mapping WHERE Privilege_Code=@Privilege_Code";
                            connection.Execute(deletequery, lstPrivilegeValueMapping, transaction: trans);

                            string mappingquery = "INSERT INTO tbl_SFA_Privilege_Value_Mapping (Company_Code, Privilege_Code, Privilege_Value_Code, Status,Created_By,Created_Date)  VALUES (@Company_Code,@Privilege_Code,@Privilege_Value_Code, '1',@Created_By,@Created_Date)";
                            rowAffected = connection.Execute(mappingquery, lstPrivilegeValueMapping, transaction: trans);
                        }
                    }
                    trans.Commit();
                }
            }
            catch
            {
                throw;
            }
            return rowAffected;
        }
        /// <summary>
        /// Check PrivilegeName
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="privilegeName"></param>
        /// <param name="privilegeCode"></param>
        /// <returns></returns>
        public int checkPrivilegeName(string companyCode, string privilegeName, string privilegeCode)
        {
            int rowcount = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@companyCode", companyCode);
                    p.Add("@privilegeName", privilegeName);
                    p.Add("@privilegeCode", privilegeCode);
                    p.Add("@Result", 0, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>(SP_HDCHECKPRIVILEGENAME, p, commandType: CommandType.StoredProcedure);
                    rowcount = p.Get<int>("@Result");
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowcount;
        }

        #endregion Privilege_New Master


        #region usertype privlege mapping
        /// <summary>
        /// Get the usertype privilege mapping details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns>returns the mapped privileges</returns>
        public IEnumerable<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> GetPrivilegeMappingDetails(string companyCode,
            string privilegeCode, string userTypeCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> lstPrivilegeMapping;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@PrivilegeCode", privilegeCode);
                    p.Add("@UserTypeCode", userTypeCode);
                    lstPrivilegeMapping = connection.Query<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel>(SP_HDGETUSERTYPEPRIVILEGEMAPPING,
                        p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }

            return lstPrivilegeMapping;
        }

        public IEnumerable<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> GetSDPrivilegeMappingDetails(string companyCode,
           string privilegeCode, string userTypeCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> lstPrivilegeMapping;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@PrivilegeCode", privilegeCode);
                    p.Add("@UserTypeCode", userTypeCode);
                    lstPrivilegeMapping = connection.Query<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel>(SP_SDGETUSERTYPEPRIVILEGEMAPPINGDETAILS,
                        p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }

            return lstPrivilegeMapping;
        }
        /// <summary>
        /// Get the privilege values by privilege code and user type code
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userTypeCode"></param>
        /// <param name="privilegeCode"></param>
        /// <returns>return the mapped privilege values</returns>
        public IEnumerable<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> GetMappingDetailsByPrivilegeCode(string companyCode,
           string privilegeCode, string userTypeCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> lstPrivilegeMapping;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Privilege_Code", privilegeCode);
                    p.Add("@User_Type_Code", userTypeCode);
                    lstPrivilegeMapping = connection.Query<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel>(SP_HDGETMAPPINGDETAILSBYPRIVILEGECODE,
                        p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }

            return lstPrivilegeMapping;
        }


        public IEnumerable<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> GetSDMappingDetailsByPrivilegeCode(string companyCode,
         string privilegeCode, string userTypeCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> lstPrivilegeMapping;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Privilege_Code", privilegeCode);
                    p.Add("@User_Type_Code", userTypeCode);
                    lstPrivilegeMapping = connection.Query<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel>(SP_SDGETMAPPINGDETAILSFORPRIVILEGECODE,
                        p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }

            return lstPrivilegeMapping;
        }
        /// <summary>
        /// Get the privilege values by privilege code
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="privilegeCode"></param>
        /// <returns>returns the privilege values from the privilege value table</returns>
        /// 

        public IEnumerable<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> GetMappingDetailsByPrivilegeCodeSD(string companyCode,
          string privilegeCode, string userTypeCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> lstPrivilegeMapping;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Privilege_Code", privilegeCode);
                    p.Add("@User_Type_Code", userTypeCode);
                    lstPrivilegeMapping = connection.Query<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel>(SP_SDGETMAPPINGDETAILSBYPRIVILEGECODE,
                        p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }

            return lstPrivilegeMapping;
        }

        public IEnumerable<MVCModels.HiDoctor_Master.PrivilegeMasterModel> GetPrivilegeValuesByPrivilegeCode(string companyCode,
         string privilegeCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.PrivilegeMasterModel> lstPrivilegeMapping;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Privilege_Code", privilegeCode);
                    lstPrivilegeMapping = connection.Query<MVCModels.HiDoctor_Master.PrivilegeMasterModel>(SP_HDGETPRIVILEGEVALUEBYPRIVILEGECODE,
                        p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }

            return lstPrivilegeMapping;
        }
        public int InsertUserTypePrivilegeMapping(List<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> lstUserTypeMapping, string mode)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                    if ("INSERT" == mode.ToUpper())
                    {
                        const string query = "INSERT INTO tbl_SFA_UserType_Privilege_Mapping_History_NG (Company_Code, Privilege_Code, Privilege_Name, " +
                                      "Privilege_Value_Name, Privilege_Value_Code, User_Type_Name, User_Type_Code, Description, Table_Name, Column_Name, " +
                                      "Request_From, Request_Date, Request_Reason, Support_User_Name, EnteredBy, EnteredDate, Record_Status, User_Code, " +
                                      " Updated_By,Updated_Date,Row_Version_No)" +
                                      "VALUES(@Company_Code, @Privilege_Code, @Privilege_Name, " +
                                      "@Privilege_Value_Name, @Privilege_Value_Code, @User_Type_Name, @User_Type_Code, @Description, @Table_Name, @Column_Name, " +
                                      "@Request_From, @Request_Date, @Request_Reason, @Support_User_Name, @EnteredBy, @EnteredDate, @Record_Status,  " +
                                      "@User_Code, @EnteredBy, @EnteredDate,0)";
                        rowsAffected = connection.Execute(query, lstUserTypeMapping, transaction: trans);

                        const string insertQuery = "INSERT INTO tbl_SFA_UserType_Privilege_Mapping_NG (Company_Code, Privilege_Code, Privilege_Name, " +
                                       "Privilege_Value_Name, Privilege_Value_Code, User_Type_Name, User_Type_Code, Description, Table_Name, Column_Name, " +
                                       "Request_From, Request_Date, Request_Reason, Support_User_Name, EnteredBy, EnteredDate, Record_Status, User_Code)" +
                                       "VALUES(@Company_Code, @Privilege_Code, @Privilege_Name, " +
                                       "@Privilege_Value_Name, @Privilege_Value_Code, @User_Type_Name, @User_Type_Code, @Description, @Table_Name, @Column_Name, " +
                                       "@Request_From, @Request_Date, @Request_Reason, @Support_User_Name, @EnteredBy, @EnteredDate, @Record_Status, @User_Code)";
                        rowsAffected = connection.Execute(insertQuery, lstUserTypeMapping, transaction: trans);
                    }
                    else
                    {
                        const string historyQuery = "INSERT INTO tbl_SFA_UserType_Privilege_Mapping_History_NG(Company_Code,Privilege_Code,Privilege_Name, " +
                                                   "Privilege_Value_Code,Privilege_Value_Name,User_Type_Code,User_Type_Name,Description,Table_Name,Column_Name, " +
                                                   "Record_Status,User_Code," +
                                                   "Row_Version_No,Request_From,Request_Date,Request_Reason, " +
                                                   "Support_User_Name,EnteredBy,EnteredDate,Updated_By,Updated_Date) " +
                                                   "values (@Company_Code,@Privilege_Code,@Privilege_Name,@Privilege_Value_Code, " +
                                                   "@Privilege_Value_Name,@User_Type_Code,@User_Type_Name,@Description,@Table_Name,@Column_Name, " +
                                                   "@Record_Status,@User_Code,0, " +
                                                   "@Request_From,@Request_Date,@Request_Reason,@Support_User_Name,@Mapping_Updated_By,@Mapping_Updated_Date, " +
                                                   "@Mapping_Updated_By,@Mapping_Updated_Date)";
                        rowsAffected = connection.Execute(historyQuery, lstUserTypeMapping, transaction: trans);
                        if (rowsAffected > 0)
                        {
                            rowsAffected = 0;
                            const string deleteQuery = "DELETE FROM tbl_SFA_UserType_Privilege_Mapping_NG WHERE Company_Code=@Company_Code " +
                                               "AND Privilege_Code=@Privilege_Code AND User_Type_Code =@User_Type_Code ";
                            rowsAffected = connection.Execute(deleteQuery, lstUserTypeMapping, transaction: trans);
                            if (rowsAffected > 0)
                            {
                                rowsAffected = 0;
                                const string insertQuery = "INSERT INTO tbl_SFA_UserType_Privilege_Mapping_NG (Company_Code, Privilege_Code, Privilege_Name, " +
                                           "Privilege_Value_Name, Privilege_Value_Code, User_Type_Name, User_Type_Code, Description, Table_Name, Column_Name, " +
                                           "Request_From, Request_Date, Request_Reason, Support_User_Name, EnteredBy, EnteredDate, Record_Status, User_Code)" +
                                           "VALUES(@Company_Code, @Privilege_Code, @Privilege_Name, " +
                                         "@Privilege_Value_Name, @Privilege_Value_Code, @User_Type_Name, @User_Type_Code, @Description, @Table_Name, @Column_Name, " +
                                           "@Request_From, @Request_Date, @Request_Reason, @Support_User_Name, @EnteredBy, @EnteredDate, @Record_Status, @User_Code)";
                                rowsAffected = connection.Execute(insertQuery, lstUserTypeMapping, transaction: trans);
                            }
                        }
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

        public int SDInsertUserTypePrivilegeMapping(List<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> lstUserTypeMapping, string mode)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                    if ("INSERT" == mode.ToUpper())
                    {


                        const string insertQuery = "INSERT INTO tbl_SFA_UserType_Privilege_Mapping (Company_Code, Privilege_Code, Privilege_Name, " +
                                       "Privilege_Value_Name, Privilege_Value_Code, User_Type_Name, User_Type_Code, Description, Table_Name, Column_Name, " +
                                       "Request_From, Request_Date, Request_Reason, Support_User_Name, EnteredBy, EnteredDate, Record_Status, User_Code)" +
                                       "VALUES(@Company_Code, @Privilege_Code, @Privilege_Name, " +
                                       "@Privilege_Value_Name, @Privilege_Value_Code, @User_Type_Name, @User_Type_Code, @Description, @Table_Name, @Column_Name, " +
                                       "@Request_From, @Request_Date, @Request_Reason, @Support_User_Name, @EnteredBy, @EnteredDate, @Record_Status, @User_Code)";
                        rowsAffected = connection.Execute(insertQuery, lstUserTypeMapping, transaction: trans);
                    }
                    else
                    {
                        rowsAffected = 0;
                        const string deleteQuery = "DELETE FROM tbl_SFA_UserType_Privilege_Mapping WHERE Company_Code=@Company_Code " +
                                           "AND Privilege_Code=@Privilege_Code AND User_Type_Code =@User_Type_Code ";
                        rowsAffected = connection.Execute(deleteQuery, lstUserTypeMapping, transaction: trans);
                        if (rowsAffected > 0)
                        {
                            rowsAffected = 0;
                            const string insertQuery = "INSERT INTO tbl_SFA_UserType_Privilege_Mapping (Company_Code, Privilege_Code, Privilege_Name, " +
                                       "Privilege_Value_Name, Privilege_Value_Code, User_Type_Name, User_Type_Code, Description, Table_Name, Column_Name, " +
                                       "Request_From, Request_Date, Request_Reason, Support_User_Name, EnteredBy, EnteredDate, Record_Status, User_Code)" +
                                       "VALUES(@Company_Code, @Privilege_Code, @Privilege_Name, " +
                                     "@Privilege_Value_Name, @Privilege_Value_Code, @User_Type_Name, @User_Type_Code, @Description, @Table_Name, @Column_Name, " +
                                       "@Request_From, @Request_Date, @Request_Reason, @Support_User_Name, @EnteredBy, @EnteredDate, @Record_Status, @User_Code)";
                            rowsAffected = connection.Execute(insertQuery, lstUserTypeMapping, transaction: trans);
                        }

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

        public IEnumerable<MVCModels.HiDoctor_Master.PrivilegeMasterModel> GetPrivilegeDetails(string companyCode,
                string privilegeCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.PrivilegeMasterModel> lstPrivilegeMapping;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@PrivilegeCode", privilegeCode);
                    lstPrivilegeMapping = connection.Query<MVCModels.HiDoctor_Master.PrivilegeMasterModel>(SP_HDGETPRIVILEGEDETAILS,
                        p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }

            return lstPrivilegeMapping;
        }

        #endregion usertype privilege mapping

        #region Reguest Screen
        /// <summary>
        ///Get Request Screen
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<DCRRestrictionModel> GetRequestScreenforDcrRestrict(string companyCode, string userCode)
        {
            IEnumerable<DCRRestrictionModel> lstRequest;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@UserCode", userCode);
                    lstRequest = connection.Query<DCRRestrictionModel>(SP_HDGETDCRRESTRICTIONREQUEST, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }

            return lstRequest;
        }
        /// <summary>
        /// Get RegionCategory Name
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<DCRRestrictionModel> GetRequestCategoryName(string companyCode)
        {
            IEnumerable<DCRRestrictionModel> lstRegioncategoryName;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    lstRegioncategoryName = connection.Query<DCRRestrictionModel>(SP_HDGETREQUESTCATEGORY, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }

            return lstRegioncategoryName;
        }
        /// <summary>
        /// Check WA User
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns></returns>
        public int checkWAUser(string companyCode, string userCode)
        {
            int rowcount = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@UserCode", userCode);
                    p.Add("@Result", 0, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>(SP_HDCHECKWAUSER, p, commandType: CommandType.StoredProcedure);
                    rowcount = p.Get<int>("@Result");
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowcount;
        }
        /// <summary>
        /// Insert for the DCR Request Screen
        /// </summary>
        /// <param name="lstDCRRequest"></param>
        /// <param name="requestId"></param>
        /// <param name="remarks"></param>
        /// <param name="requestedDate"></param>
        /// <returns></returns>
        public int InsertforDCRRequestScreen(List<DCRRestrictionModel> lstDCRRequest, string requestId, string remarks, string requestedDate)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                    const string insertQuery = "INSERT INTO tbl_SFA_DCR_Restriction(Request_Id,Company_Code,User_Code,Region_Code,Date_From,Date_To,Request_Category_Id,Request_Category_Name,Request_Status)VALUES(@Request_Id,@Company_Code,@User_Code,@Region_Code,@Date_From,@Date_To,@Request_Category_Id,@Request_Category_Name,@Request_Status)";
                    rowsAffected = connection.Execute(insertQuery, lstDCRRequest, transaction: trans);
                    if (rowsAffected > 0)
                    {
                        rowsAffected = 0;
                        const string query = "INSERT INTO tbl_SFA_DCR_Restriction_Extension(Request_Id,Requesting_User_Remarks,Requested_Date)VALUES(@Request_Id,@Requesting_User_Remarks,@Requested_Date)";
                        rowsAffected = connection.Execute(query, new
                        {
                            @Request_Id = requestId,
                            @Requesting_User_Remarks = remarks,
                            @Requested_Date = requestedDate
                        }, transaction: trans);
                    }
                    trans.Commit();
                }
            }
            catch
            {
                throw;
            }


            return rowsAffected;
        }
        /// <summary>
        /// Update for DCR Request screen
        /// </summary>
        /// <param name="lstDCRRequest"></param>
        /// <param name="requestId"></param>
        /// <param name="remarks"></param>
        /// <param name="requestedDate"></param>
        /// <returns></returns>
        public int UpdateforDCRRequestScreen(List<DCRRestrictionModel> lstDCRRequest, string requestId, string remarks, string requestedDate)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                    const string updateQuery = "UPDATE tbl_SFA_DCR_Restriction SET User_Code=@User_Code,Region_Code = @Region_Code,Request_Category_Id = @Request_Category_Id,Request_Category_Name = @Request_Category_Name,Request_Status = @Request_Status,Date_From = @Date_From,Date_To = @Date_To WHERE Request_Id = @Request_Id AND Company_Code = @Company_Code";
                    rowsAffected = connection.Execute(updateQuery, lstDCRRequest, transaction: trans);
                    if (rowsAffected > 0)
                    {
                        rowsAffected = 0;
                        const string query = "UPDATE tbl_SFA_DCR_Restriction_Extension SET Requesting_User_Remarks = @Requesting_User_Remarks,Requested_Date = @Requested_Date WHERE Request_Id = @Request_Id";
                        rowsAffected = connection.Execute(query, new
                        {
                            @Request_Id = requestId,
                            @Requesting_User_Remarks = remarks,
                            Requested_Date = requestedDate
                        }, transaction: trans);
                    }
                    trans.Commit();
                }
            }
            catch
            {
                throw;
            }
            return rowsAffected;
        }

        #endregion Reguest Screen
        #endregion Public Methods
        public int InsertRequestCategory(List<MVCModels.RequestCategoryMasterModel> lstRequestCategory)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                    const string insertQuery = "INSERT INTO tbl_SFA_DCR_Restrction_Request_Category(Company_Code,Request_Category_Id,Request_Category_Name,Request_Category_Status) VALUES(@Company_Code,NEXT VALUE FOR SEQ_tbl_SFA_DCR_Restrction_Request_Category,@Request_Category_Name,@Request_Category_Status)";
                    rowsAffected = connection.Execute(insertQuery, lstRequestCategory, transaction: trans);
                    trans.Commit();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }


            return rowsAffected;
        }
        public IEnumerable<RequestCategoryMasterModel> GetRequestCategoryDetail(string companyCode)
        {
            IEnumerable<RequestCategoryMasterModel> lstrequest;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    lstrequest = connection.Query<RequestCategoryMasterModel>(SP_HDGETREQUESTCATEGORYDETAIL, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }

            return lstrequest;
        }


        public int UpdateRequestCategory(List<MVCModels.RequestCategoryMasterModel> lstRequest)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                    const string updateQuery = "UPDATE tbl_SFA_DCR_Restrction_Request_Category SET Request_Category_Id = @Request_Category_Id,Request_Category_Name = @Request_Category_Name,Request_Category_Status=@Request_Category_Status WHERE Company_Code = @Company_Code and " +
                                                  "Request_Category_Id = @Request_Category_Id";
                    rowsAffected = connection.Execute(updateQuery, lstRequest, transaction: trans);
                    trans.Commit();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowsAffected;
        }
        #region Myprofile
        /// <summary>
        /// Get Profile
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.EmployeeModel> GetMyProfileDetails(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.EmployeeModel> lstMyprofileDetails;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@UserCode", userCode);
                    lstMyprofileDetails = connection.Query<MVCModels.HiDoctor_Master.EmployeeModel>(SP_HDGETMYPROFILEDEATILS, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }

            return lstMyprofileDetails;
        }
        /// <summary>
        /// Update Employee Profile
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="employeeCode"></param>
        /// <param name="mailId"></param>
        /// <returns></returns>
        public int UpdateEmployeeDetails(string companyCode, string employeeCode, string mailId)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    const string insertQuery = "UPDATE tbl_SFA_Employee_Master SET Email_Id = @EmailId,Row_Version_No='0' WHERE Company_Code = @CompanyCode AND Employee_Code = @EmployeeCode";
                    rowsAffected = connection.Execute(insertQuery, new { EmailId = mailId, CompanyCode = companyCode, EmployeeCode = employeeCode });

                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowsAffected;
        }
        #endregion MyProfile



        public int APIInsertCategory(List<MVCModels.APICategoryModel> lstAPICategory, string CategoryName)
        {
            int rowsAffected = 0;
            int count = 0;
            try
            {
                using (IDbConnection connection = IDbOpenGlobalConnection())
                {


                    const string selectQry = "SELECT COUNT(1) FROM tbl_HD_API_Category_Master WHERE API_Category_Name =@API_Category_Name";
                    count = connection.Query<int>(selectQry, new { API_Category_Name = CategoryName }
                                                       ).Single();
                    var exitsCount = 6;
                    rowsAffected = exitsCount;

                    if (count == 0)
                    {

                        IDbTransaction trans = connection.BeginTransaction();
                        const string insertQuery = "INSERT INTO tbl_HD_API_Category_Master(API_Category_Code,API_Category_Name,API_Category_Status,Created_By,Created_Date,API_Category_Description) VALUES(NEXT VALUE FOR SEQ_tbl_HD_API_Category_Master,@API_Category_Name,@API_Category_Status,@Created_By,@Created_Date,@API_Category_Description)";
                        rowsAffected = connection.Execute(insertQuery, lstAPICategory, transaction: trans);
                        trans.Commit();
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }


            return rowsAffected;
        }


        public IEnumerable<APICategoryModel> GetAPICategoryDetail()
        {
            IEnumerable<APICategoryModel> lstCategory;
            try
            {
                using (IDbConnection connection = IDbOpenGlobalConnection())
                {
                    var p = new DynamicParameters();
                    lstCategory = connection.Query<APICategoryModel>(SP_HDGETAPICATEGORYDETAIL, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }

            return lstCategory;
        }

        public int UpdateAPICategory(List<MVCModels.APICategoryModel> lstAPIcatUpdate, string CategoryName, string APIcategoryID)
        {
            int rowsAffected = 0;
            int count = 0;
            try
            {
                using (IDbConnection connection = IDbOpenGlobalConnection())
                {

                    const string selectQry = "SELECT COUNT(*) FROM tbl_HD_API_Category_Master WHERE API_Category_Name =@API_Category_Name AND API_Category_Code <> @API_Category_Code";
                    count = connection.Query<int>(selectQry, new { API_Category_Name = CategoryName, API_Category_Code = APIcategoryID }
                                                       ).Single();
                    var exitsCount = 6;
                    rowsAffected = exitsCount;

                    if (count == 0)
                    {
                        IDbTransaction trans = connection.BeginTransaction();
                        const string updateQuery = "UPDATE tbl_HD_API_Category_Master SET API_Category_Name = @API_Category_Name,API_Category_Description = @API_Category_Description,API_Category_Status=@API_Category_Status WHERE  " +
                                                      "API_Category_Code = @API_Category_Code";
                        rowsAffected = connection.Execute(updateQuery, lstAPIcatUpdate, transaction: trans);
                        trans.Commit();
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowsAffected;
        }

        public IEnumerable<APICategoryModel> GetAPICategory()
        {
            IEnumerable<APICategoryModel> lstAPICategory;
            try
            {
                using (IDbConnection connection = IDbOpenGlobalConnection())
                {
                    var p = new DynamicParameters();

                    lstAPICategory = connection.Query<APICategoryModel>(SP_HDGETAPICATEGORY, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch
            {
                throw;
            }
            return lstAPICategory;
        }

        public int InsertAPIService(List<MVCModels.APIServiceModel> lstAPIService, string ServiceId)
        {
            int rowsAffected = 0;
            int count = 0;
            try
            {
                using (IDbConnection connection = IDbOpenGlobalConnection())
                {

                    const string selectQry = "SELECT COUNT(1) FROM tbl_HD_API_Services WHERE ServiceId =@ServiceId";
                    count = connection.Query<int>(selectQry, new { ServiceId = ServiceId }
                                                       ).Single();
                    var exitsCount = 6;
                    rowsAffected = exitsCount;

                    if (count == 0)
                    {
                        IDbTransaction trans = connection.BeginTransaction();
                        const string insertQuery = "INSERT INTO tbl_HD_API_Services(API_ID,API_Category_Code,ServiceId,ServiceDescrn,ServiceType,ServiceParamNos,ServiceParams,ServiceOutputHeaders,ServiceInternalName,ServiceTypeMappingClassName,ServiceName,Is_Visible) VALUES " +
                           "(NEXT VALUE FOR SEQ_tbl_HD_API_Services,@API_Category_Code,@ServiceId,@ServiceDescrn,@ServiceType,@ServiceParamNos,@ServiceParams,@ServiceOutputHeaders,@ServiceInternalName,@ServiceTypeMappingClassName,@ServiceName,@Is_Visible)";
                        rowsAffected = connection.Execute(insertQuery, lstAPIService, transaction: trans);
                        trans.Commit();
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }


            return rowsAffected;
        }

        public IEnumerable<APIServiceModel> GetAPIServiceDetail(string APIId)
        {
            IEnumerable<APIServiceModel> lstService;
            try
            {
                using (IDbConnection connection = IDbOpenGlobalConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@APIId", APIId);
                    lstService = connection.Query<APIServiceModel>(SP_HDAPIGETSERVICEDETAIL, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }

            return lstService;
        }

        public int UpdateAPIService(List<MVCModels.APIServiceModel> lstAPIService, string ServiceId, string APIID)
        {
            int rowsAffected = 0;
            int count = 0;
            try
            {

                using (IDbConnection connection = IDbOpenGlobalConnection())
                {
                    const string selectQry = "SELECT COUNT(1) FROM tbl_HD_API_Services WHERE ServiceId = @ServiceId AND API_ID <> @API_ID ";
                    count = connection.Query<int>(selectQry, new { ServiceId = ServiceId, API_ID = APIID }
                                                       ).Single();
                    var exitsCount = 6;
                    rowsAffected = exitsCount;


                    if (count == 0)
                    {

                        IDbTransaction trans = connection.BeginTransaction();
                        const string updateQuery = "UPDATE tbl_HD_API_Services SET ServiceId = @ServiceId,ServiceDescrn = @ServiceDescrn,ServiceType=@ServiceType," +
                                                      "ServiceParamNos = @ServiceParamNos,ServiceParams=@ServiceParams,ServiceOutputHeaders=@ServiceOutputHeaders," +
                                                      "ServiceInternalName=@ServiceInternalName,ServiceTypeMappingClassName=@ServiceTypeMappingClassName,ServiceName=@ServiceName,Is_Visible=@Is_Visible WHERE @API_ID=API_ID";
                        rowsAffected = connection.Execute(updateQuery, lstAPIService, transaction: trans);
                        trans.Commit();
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowsAffected;
        }

        public IEnumerable<APIServiceModel> GetAPIServiceID()
        {
            IEnumerable<APIServiceModel> lstAPIServiceID;
            try
            {
                using (IDbConnection connection = IDbOpenGlobalConnection())
                {
                    var p = new DynamicParameters();

                    lstAPIServiceID = connection.Query<APIServiceModel>(SP_HDAPIGETSERVICEDETAIL, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch
            {
                throw;
            }
            return lstAPIServiceID;
        }
        public int InsertAPIUIDef(List<MVCModels.APIUIModel> APIUIDefModel)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenGlobalConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                    const string insertQuery = "INSERT INTO tbl_HD_API_UI(ServiceId,InputParam,Type,ParamOrder,Show_In_UI,Session_Key,Help_Description,API_ID) VALUES " +
                       "(@ServiceId,@InputParam,@Type,@ParamOrder,@Show_In_UI,@Session_Key,@Help_Description,@API_ID)";
                    rowsAffected = connection.Execute(insertQuery, APIUIDefModel, transaction: trans);
                    trans.Commit();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }


            return rowsAffected;
        }

        //GetAPIUserTypeDetail
        public IEnumerable<MVCModels.UserTypeModel> GetAPIUserTypeDetail(string companyCode)
        {
            IEnumerable<MVCModels.UserTypeModel> lstUsertypes;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    lstUsertypes = connection.Query<MVCModels.UserTypeModel>(SP_HDGETUSERTYPELIST, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch
            {
                throw;
            }
            return lstUsertypes;
        }


        public int InsertAPICompanyAccess(List<MVCModels.CompanyAccessModel> APICompanyAcess)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenGlobalConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                    const string deletequery = "DELETE FROM tbl_HD_API_CompanyAccess WHERE Company_Code=@Company_Code AND API_ID=@API_ID AND User_Type_Code=@User_Type_Code ";
                    connection.Execute(deletequery, APICompanyAcess, transaction: trans);


                    const string insertQuery = "INSERT INTO tbl_HD_API_CompanyAccess(Company_Code,API_ID,User_Type_Code,User_Type_Name) VALUES " +
                       "(@Company_Code,@API_ID,@User_Type_Code,@User_Type_Name)";
                    rowsAffected = connection.Execute(insertQuery, APICompanyAcess, transaction: trans);
                    trans.Commit();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }


            return rowsAffected;
        }


        public IEnumerable<CompanyAccessModel> GetAPIComapanyMapDetail(string APIServiceId, string companyCode)
        {
            IEnumerable<CompanyAccessModel> lstUsertypes;
            try
            {
                using (IDbConnection connection = IDbOpenGlobalConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@API_ID", APIServiceId);
                    lstUsertypes = connection.Query<CompanyAccessModel>(SP_APIGETCOMPANYACCESSDETAIL, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch
            {
                throw;
            }
            return lstUsertypes;
        }


        #region menu master
        /// <summary>
        /// Get All Menu Items
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns>returns the list of menu items</returns>
        public IEnumerable<MVCModels.MenuMasterModel> GetMenuItems(string companyCode)
        {
            IEnumerable<MVCModels.MenuMasterModel> lstMenu = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    lstMenu = connection.Query<MVCModels.MenuMasterModel>(SP_HDGETMENUITEMS,
                        p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }

            return lstMenu;
        }

        //App Master 
        public IEnumerable<MVCModels.MenuMasterModel> GetAppMenuItems(string companyCode)
        {
            IEnumerable<MVCModels.MenuMasterModel> lstMenu = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    lstMenu = connection.Query<MVCModels.MenuMasterModel>("SP_HDGETAppMENUITEMS",
                        p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }

            return lstMenu;
        }
        /// <summary>
        /// get the menu items to fill the parent menu dropdown
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns>>returns the list of menu items</returns>
        public IEnumerable<MVCModels.MenuMasterModel> GetParentMenuItems(string companyCode)
        {
            IEnumerable<MVCModels.MenuMasterModel> lstMenu = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    lstMenu = connection.Query<MVCModels.MenuMasterModel>(SP_HDGETPARENTMENUITEMS,
                        p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }

            return lstMenu;
        }

        public IEnumerable<MVCModels.MenuMasterModel> GetAppParentMenuItems(string companyCode)
        {
            IEnumerable<MVCModels.MenuMasterModel> lstMenudet = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    //p.Add("@Menu_Id", Menu_ID);
                    lstMenudet = connection.Query<MVCModels.MenuMasterModel>("SP_GetAppMenuDet",
                        p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }

            return lstMenudet;
        }

        //New
        public IEnumerable<MVCModels.MenuMasterModel> GetAppParentMenuItemsNew(string companyCode)
        {
            IEnumerable<MVCModels.MenuMasterModel> lstMenudet = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    //p.Add("@Menu_Id", Menu_ID);
                    lstMenudet = connection.Query<MVCModels.MenuMasterModel>("SP_GetAppMenuDetails",
                        p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }

            return lstMenudet;
        }
        /// <summary>
        /// Get seleted menu details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="menuId"></param>
        /// <returns>returns the selected menu details</returns>

        public IEnumerable<MVCModels.MenuMasterModel> GetSelectedMenuDetails(string companyCode, string menuId)
        {
            IEnumerable<MVCModels.MenuMasterModel> lstMenu = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Menu_ID", menuId);
                    lstMenu = connection.Query<MVCModels.MenuMasterModel>(SP_HDGETSELECTEDMENUDETAILS,
                        p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }

            return lstMenu;
        }

        //App Menu Master Parent Menu List
        public IEnumerable<MVCModels.MenuMasterModel> GetAppSelectedMenuDetails(string companyCode, string menuId)
        {
            IEnumerable<MVCModels.MenuMasterModel> lstMenu = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Menu_ID", menuId);
                    lstMenu = connection.Query<MVCModels.MenuMasterModel>("SP_hdGetAppSelectedMenuDetails",
                        p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }

            return lstMenu;
        }


        /// <summary>
        /// check menu url is already exist or not
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="menuurl"></param>
        /// <returns></returns>
        public IEnumerable<MenuMasterModel> CheckMenuUrl(string companyCode, string menuurl)
        {
            IEnumerable<MVCModels.MenuMasterModel> lstMenu = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Menu_url", menuurl);
                    lstMenu = connection.Query<MVCModels.MenuMasterModel>(SP_HDCHECKMENUURL,
                        p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }
            return lstMenu;
        }

        /// <summary>
        /// Insert or update menu master
        /// </summary>
        /// <param name="lstMenuMaster"></param>
        /// <param name="mode"></param>
        /// <returns>returns the no of rows affected</returns>
        public int InsertMenuMaster(List<MVCModels.MenuMasterModel> lstMenuMaster, string mode)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                    if ("INSERT" == mode.ToUpper())
                    {
                        const string query = "INSERT INTO tbl_SFA_Rad_Menu(Company_Code,Menu_ID,Menu_ParentID,Menu_Text,Menu_URL,MM_Order,SM_Order, " +
                                             "Feature_Code,Is_Report,Report_Category,Description,IsPrint,IsExcelExport,IsChart,IsDrillDown,IsMultiUser, " +
                                             "Menu_Full_Path,Menu_Key_Words,Menu_Created_By,Menu_Created_DateTime,Project_Name) VALUES " +
                                             "(@Company_Code,NEXT VALUE FOR SEQ_tbl_SFA_Rad_Menu,@Menu_ParentID,@Menu_Text,@Menu_URL,@MM_Order,@SM_Order, " +
                                             "@Feature_Code,@Is_Report,@Report_Category,@Description,@IsPrint,@IsExcelExport,@IsChart,@IsDrillDown,@IsMultiUser, " +
                                             "@Menu_Full_Path,@Menu_Key_Words,@Menu_Created_By,@Menu_Created_DateTime,@Project_Name)";
                        rowsAffected = connection.Execute(query, lstMenuMaster, transaction: trans);
                    }
                    else
                    {
                        const string updateQry = "update tbl_SFA_Rad_Menu set Menu_ParentID=@Menu_ParentID,Menu_Text=@Menu_Text,Menu_URL=@Menu_URL, " +
                                                 "MM_Order=@MM_Order,SM_Order=@SM_Order,Feature_Code=@Feature_Code,Is_Report=@Is_Report, " +
                                                 "Report_Category=@Report_Category,Description=@Description,IsPrint=@IsPrint,IsExcelExport=@IsExcelExport, " +
                                                 "IsChart=@IsChart,IsDrillDown=@IsDrillDown,IsMultiUser=@IsMultiUser, " +
                                                 "Menu_Full_Path=@Menu_Full_Path,Menu_Key_Words=@Menu_Key_Words,Menu_Updated_By=@Menu_Updated_By, " +
                                                 "Menu_Updated_DateTime=@Menu_Updated_DateTime where Menu_ID=@Menu_ID and Company_Code=@Company_Code ";
                        rowsAffected = connection.Execute(updateQry, lstMenuMaster, transaction: trans);
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

        //App Menu Master
        public int InsertAppMenuMaster(List<MVCModels.MenuMasterModel> lstMenuMaster, string mode)
        {
            int rowsAffected = 0;
            
            //lstMenuMaster[0].MenuLevel = Int32.Parse(lstMenuMaster[0].MenuLevel);
            //lstMenuMaster[0].MenuLevel = Int32.Parse(lstMenuMaster[0].Type);
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                    if ("INSERT" == mode.ToUpper())
                    {
                        if (lstMenuMaster[0].Type == "3")
                        {
                            const string query = "INSERT INTO tbl_SFA_App_Menu_Master(Company_Code,Menu_ParentID,Menu_Name,MDM_Menu_Url,Active_Status,Type, " +
                                                 "Category,Menu_Type,Created_By,Created_Date,Menu_Id,TypeOfModule,Query_String_Parameters) VALUES " +
                                                "(@Company_Code,@Menu_ParentID,@Menu_Text,@Menu_URL,'1',@Type,@Category, " +
                                                 "@MenuLevel,@Menu_Created_By,@Menu_Created_DateTime,(Select isnull(MAX(Menu_Id)+1,1000) FROM tbl_SFA_App_Menu_Master cust where TypeOfModule is not null and Type is not null and type not in(1,2)),@TypeOfModule,@Query_String_Parameters)";
                            rowsAffected = connection.Execute(query, lstMenuMaster, transaction: trans);
                        }
                        else
                        {
                            const string query = "INSERT INTO tbl_SFA_App_Menu_Master(Company_Code,Menu_ParentID,Menu_Name,MDM_Menu_Url,Active_Status,Type, " +
                                                                             "Category,Menu_Type,Created_By,Created_Date,Menu_Id,TypeOfModule,Query_String_Parameters) VALUES " +
                                                                            "(@Company_Code,@Menu_ParentID,@Menu_Text,@Menu_URL,'1',@Type,@Category, " +
                                                                             "@MenuLevel,@Menu_Created_By,@Menu_Created_DateTime,(Select MAX(Menu_Id)+1 FROM tbl_SFA_App_Menu_Master cust where Type<>3),@TypeOfModule,@Query_String_Parameters)";
                            rowsAffected = connection.Execute(query, lstMenuMaster, transaction: trans);
                        }
                    }
                    else
                    {
                        const string updateQry = "update tbl_SFA_App_Menu_Master set Menu_ParentID=@Menu_ParentID,Menu_Name=@Menu_Text,MDM_Menu_Url=@Menu_URL, " +
                                                 "Type=@Type,Category=@Category,Menu_Type=@MenuLevel,Menu_Updated_By=@Menu_Updated_By,Menu_Updated_DateTime=@Menu_Updated_DateTime,TypeOfModule=@TypeOfModule,Query_String_Parameters=@Query_String_Parameters where Menu_ID=@Menu_ID and Company_Code=@Company_Code";
                                                 rowsAffected = connection.Execute(updateQry, lstMenuMaster, transaction: trans);
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

        #endregion menu master
        #region menu access
        /// <summary>
        /// Get menu access for selected user types
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userTypeCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.UserTypeMenuAccessModel> GetUserTypeMenuAccess(string companyCode, string userTypeCode)
        {
            IEnumerable<MVCModels.UserTypeMenuAccessModel> lstMenu = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Type_Code", userTypeCode);
                    lstMenu = connection.Query<MVCModels.UserTypeMenuAccessModel>(SP_HDGETUSERTYPEMENUACCESS,
                        p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }

            return lstMenu;
        }

        public IEnumerable<MVCModels.UserTypeAppMenuAccessModel> GetAppUserTypeMenuAccess(string companyCode, string userTypeCode)
        {
            IEnumerable<MVCModels.UserTypeAppMenuAccessModel> lstAppMenu = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Type_Code", userTypeCode);
                    lstAppMenu = connection.Query<MVCModels.UserTypeAppMenuAccessModel>(SP_GetAppMenuDetByUserType,
                        p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }

            return lstAppMenu;
        }
        /// <summary>
        /// Insert/Update user type menu access
        /// </summary>
        /// <param name="lstInsertMenu"></param>
        /// <param name="lstUpdateMenu"></param>
        /// <param name="userTypeCode"></param>
        /// <param name="companyCode"></param>
        /// <returns>returns the no of rows affected</returns>
        public int InsertMenuAccess(List<MVCModels.UserTypeMenuAccessModel> lstInsertMenu, List<MVCModels.UserTypeMenuAccessModel> lstUpdateMenu,
                      string userTypeCode, string companyCode)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                    if (lstUpdateMenu.Count > 0)
                    {
                        const string query = "INSERT INTO Tbl_SFA_USR_MNU_ACCESS_PERM_LOG(LOG_ID,User_Type_Code,User_Type,Menu_ID,Menu_Name,Menu_URL, " +
                                             "Is_Access_Allowed,Updated_By,Updated_Date)VALUES(NEXT VALUE FOR SEQ_Tbl_SFA_USR_MNU_ACCESS_PERM_LOG, " +
                                             "@User_Type_Code,@User_Type_Name,@Menu_Id,@Menu_Text,@Menu_URL,0,@Updated_By,@Updated_Date)";
                        rowsAffected = connection.Execute(query, lstUpdateMenu, transaction: trans);
                        if (rowsAffected > 0)
                        {
                            rowsAffected = 0;
                            //const string updateQry = "UPDATE tbl_SFA_User_MenuAccess SET Access = '0' WHERE User_Type_Code = @User_Type_Code " +
                            //                     "AND Menu_Id=@Menu_Id AND Company_Code = @Company_Code";
                            const string updateQry = "DELETE FROM tbl_SFA_User_MenuAccess WHERE User_Type_Code = @User_Type_Code " +
                                               "AND Menu_Id=@Menu_Id AND Company_Code = @Company_Code";
                            rowsAffected = connection.Execute(updateQry, lstUpdateMenu, transaction: trans);
                        }
                    }
                    if (lstInsertMenu.Count > 0)
                    {
                        const string query = "INSERT INTO Tbl_SFA_USR_MNU_ACCESS_PERM_LOG(LOG_ID,User_Type_Code,User_Type,Menu_ID,Menu_Name,Menu_URL, " +
                                            "Is_Access_Allowed,Updated_By,Updated_Date)VALUES(NEXT VALUE FOR SEQ_Tbl_SFA_USR_MNU_ACCESS_PERM_LOG, " +
                                            "@User_Type_Code,@User_Type_Name,@Menu_Id,@Menu_Text,@Menu_URL,1,@Updated_By,@Updated_Date)";
                        rowsAffected = connection.Execute(query, lstInsertMenu, transaction: trans);
                        if (rowsAffected > 0)
                        {
                            rowsAffected = 0;
                            const string insertQry = "INSERT INTO tbl_SFA_User_MenuAccess (Company_Code,Userrights_id,Menu_Id,User_Type_Code,Access)  " +
                                                     "VALUES(@Company_Code,NEXT VALUE FOR SEQ_tbl_SFA_User_MenuAccess,@Menu_Id,@User_Type_Code,@Access)";
                            rowsAffected = connection.Execute(insertQry, lstInsertMenu, transaction: trans);
                        }
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

        public int AppInsertMenuAccess(List<MVCModels.UserTypeAppMenuAccessModel> lstAppMenu, string userTypeCode, string companyCode)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();

                    StringBuilder strInsertQuery = new StringBuilder();

                    strInsertQuery.Append("INSERT INTO tbl_SFA_App_User_MenuAccess_history SELECT * ");
                    strInsertQuery.Append("FROM [tbl_SFA_App_User_MenuAccess] WHERE USER_TYPE_CODE = '" + userTypeCode + "'");

                    connection.Execute(strInsertQuery.ToString(), transaction: trans);
                    strInsertQuery.Clear();
                    strInsertQuery.Append("delete from  tbl_SFA_App_User_MenuAccess WHERE USER_TYPE_CODE = '" + userTypeCode + "'");

                    connection.Execute(strInsertQuery.ToString(), transaction: trans);
                    strInsertQuery.Clear();

                    if (lstAppMenu.Count > 0)
                    {

                        strInsertQuery.Append("INSERT INTO ");
                        strInsertQuery.Append("tbl_SFA_App_User_MenuAccess");
                        strInsertQuery.Append(" (Company_Code,Menu_Id,User_Type_Code,active_Status,created_by) ");

                        strInsertQuery.Append(" VALUES ");
                        strInsertQuery.Append(" (@Company_Code,@Menu_Id,@User_Type_Code,1,@created_by) ");

                        rowsAffected = connection.Execute(strInsertQuery.ToString(),
                            lstAppMenu,
                            transaction: trans);

                        //const string query = "INSERT INTO tbl_SFA_App_User_MenuAccess(Company_Code,Menu_Id,User_Type_Code)VALUES(@Company_Code,@Menu_Id,@User_Type_Code)";
                        //rowsAffected = connection.Execute(query, lstInsertMenu, transaction: trans);

                    }
                    trans.Commit();
                    //else if (lstAppUpdateMenu.Count > 0)
                    //{
                    //    StringBuilder strMapping = new StringBuilder();
                    //    strMapping.Append(" UPDATE ");
                    //    strMapping.Append(" tbl_SFA_App_User_MenuAccess");
                    //    strMapping.Append(" SET  "
                    //    strMapping.Append(" WHERE User_Type_Code=@User_Type_Code and " +
                    //                               "Menu_Id=@Menu_Id AND Company_Code= @Company_Code");
                    //    //strMapping.Append(" SET Company_Code=@Company_Code, User_Type_Code=@User_Type_Code,Menu_Id=@Menu_Id");
                    //    rowsAffected = connection.Execute(strMapping.ToString(),
                    //        lstAppUpdateMenu,
                    //        transaction: trans);
                    //    trans.Commit();
                    //}
                }

                //connection.Close();
            }

            catch (Exception ex)
            {
                throw ex;
            }


            return rowsAffected;
        }
        public IEnumerable<MVCModels.HiDoctor_Master.UserTypeModel> GetMenuMappedUserTypes(string companyCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.UserTypeModel> lstUserTypes = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    lstUserTypes = connection.Query<MVCModels.HiDoctor_Master.UserTypeModel>(SP_HDGETMENUMAPPEDUSERTYPES,
                        p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }

            return lstUserTypes;
        }
        public int CopyMenuAccess(List<MVCModels.HiDoctor_Master.UserTypeModel> lstUserTypes, string sourceUserTypeCode, string companyCode,
               string updatedBy, string updatedDate)
        {
            int rowsAffected = 0;
            int rowsExists = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();

                    string query = "INSERT INTO Tbl_SFA_USR_MNU_ACCESS_PERM_LOG(LOG_ID,User_Type_Code,User_Type,Menu_ID,Menu_Name,Menu_URL, " +
                                         "Is_Access_Allowed,Updated_By,Updated_Date) " +
                                         "SELECT NEXT VALUE FOR SEQ_Tbl_SFA_USR_MNU_ACCESS_PERM_LOG,@User_Type_Code,tbl_SFA_User_Type_Master.User_Type_Name, " +
                                         "tbl_SFA_User_MenuAccess.Menu_Id,tbl_SFA_Rad_Menu.Menu_Text, tbl_SFA_Rad_Menu.Menu_URL, " +
                                         "tbl_SFA_User_MenuAccess.Access,'" + updatedBy + "','" + updatedDate
                                         + "' FROM tbl_SFA_User_MenuAccess INNER JOIN tbl_SFA_Rad_Menu " +
                                         "ON tbl_SFA_User_MenuAccess.Menu_Id= tbl_SFA_Rad_Menu.Menu_ID " +
                                         "inner join tbl_SFA_User_Type_Master on tbl_SFA_User_MenuAccess.User_Type_Code = tbl_SFA_User_Type_Master.User_Type_Code " +
                                         "WHERE tbl_SFA_User_MenuAccess.User_Type_Code=@User_Type_Code " +
                                         "AND tbl_SFA_User_MenuAccess.Company_Code=@Company_Code ";
                    rowsAffected = connection.Execute(query, lstUserTypes, transaction: trans);

                    const string deleteQuery = "DELETE FROM tbl_SFA_User_MenuAccess WHERE User_Type_Code=@User_Type_Code and Company_Code=@Company_Code";
                    rowsAffected = connection.Execute(deleteQuery, lstUserTypes, transaction: trans);
                    string insertQuery = "INSERT INTO tbl_SFA_User_MenuAccess (Company_Code,Userrights_id, " +
                                         "Menu_Id,User_Type_Code,Access,Ref_Key1,Ref_Key2, " +
                                         "Record_Status,Effective_From,Effective_To) SELECT Company_Code, " +
                                         "NEXT VALUE FOR SEQ_tbl_SFA_User_MenuAccess,Menu_Id,@User_Type_Code,Access,  " +
                                         "Ref_Key1,Ref_Key2,Record_Status,Effective_From,Effective_To from tbl_SFA_User_MenuAccess " +
                                         "WHERE User_Type_Code='" + sourceUserTypeCode + "'" +
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

        /// <summary>
        /// get user type menu access log report
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="fromDate"></param>
        /// <param name="toDate"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.UserTypeMenuAccessModel> GetUserTypeMenuAccessLog(string companyCode, string fromDate,
                string toDate, string userTypeCodes)
        {
            IEnumerable<MVCModels.UserTypeMenuAccessModel> lstMenu = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@From_Date", fromDate);
                    p.Add("@To_Date", toDate);
                    p.Add("@User_Type_Codes", userTypeCodes);
                    lstMenu = connection.Query<MVCModels.UserTypeMenuAccessModel>(SP_HDGETUSERMENUACCESSLOG,
                        p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }

            return lstMenu;
        }

        /// <summary>
        /// Get privilege mapping log report
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="fromDate"></param>
        /// <param name="toDate"></param>
        /// <param name="userTypeCodes"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> GetPrivilegeLogReport(string companyCode,
        string fromDate, string toDate, string userTypeCodes)
        {
            IEnumerable<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> lstPrivilegeMapping;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@From_Date", fromDate);
                    p.Add("@To_Date", toDate);
                    p.Add("@User_Type_Codes", userTypeCodes);
                    lstPrivilegeMapping = connection.Query<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel>(SP_HDGETPRIVILEGEMAPPINGLOG,
                        p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }

            return lstPrivilegeMapping;
        }
        #endregion menu access

        #region - Menu access for mobile
        /// <summary>
        /// Get Menu access for mobile
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userTypeCode"></param>
        /// <returns></returns>
        public List<MenuMasterModel> GetMenuaccessforMobile(string companyCode, string userTypeCode)
        {
            List<MenuMasterModel> lstMenus = new List<MenuMasterModel>();
            using (IDbConnection connection = IDbOpenConnection())
            {
                DynamicParameters parameter = new DynamicParameters();
                parameter.Add("@CompanyCode", companyCode);
                parameter.Add("@UserTypeCode", userTypeCode);
                lstMenus = connection.Query<MenuMasterModel>(SP_HDM_GETMENUACCESSFORMOBILE, parameter, commandType: CommandType.StoredProcedure).ToList();
                return lstMenus;
            }
        }

        #endregion - Menu access for mobile
        #region UserProductMapping
        /// <summary>
        /// Get User Types
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<DivisionUserProducts> GetUserTypeNamesforProductMapping(string companyCode)
        {
            IEnumerable<DivisionUserProducts> lstUsertypes;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    lstUsertypes = connection.Query<DivisionUserProducts>(SP_HDGETUSERTYPELIST, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch
            {
                throw;
            }
            return lstUsertypes;
        }
        /// <summary>
        /// Get sample and Non Sample Products
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userTypeCode"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Master.ProductandSampleModel> GetProductandSample(string companyCode, string userTypeCode)
        {
            List<MVCModels.HiDoctor_Master.ProductandSampleModel> lstProductsandSample = new List<MVCModels.HiDoctor_Master.ProductandSampleModel>();

            try
            {
                List<MVCModels.HiDoctor_Master.SampleModel> lstsamples = null;
                List<MVCModels.HiDoctor_Master.NonsampleModel> lstNonsample = null;

                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@UserTypeCode", userTypeCode);
                    using (var mulitSelect = connection.QueryMultiple(SP_HDGETPRODUCTSANDNONSAMPLE, parameter, commandType: CommandType.StoredProcedure))
                    {
                        lstsamples = mulitSelect.Read<MVCModels.HiDoctor_Master.SampleModel>().ToList();
                        lstNonsample = mulitSelect.Read<MVCModels.HiDoctor_Master.NonsampleModel>().ToList();
                    }
                }
                MVCModels.HiDoctor_Master.ProductandSampleModel _objProductandSample = new MVCModels.HiDoctor_Master.ProductandSampleModel();
                _objProductandSample.lstsamples = lstsamples;
                _objProductandSample.lstNonsample = lstNonsample;

                lstProductsandSample.Add(_objProductandSample);
            }
            catch
            {
                throw;
            }

            return lstProductsandSample;
        }
        /// <summary>
        /// Get user product Mapping
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="productType"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.UserProductaMappingModel> GetUserProductMapping(string companyCode, string productType)
        {
            IEnumerable<MVCModels.HiDoctor_Master.UserProductaMappingModel> lstUserProductMapping;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@ProductType", productType);
                    lstUserProductMapping = connection.Query<MVCModels.HiDoctor_Master.UserProductaMappingModel>(SP_HDGETPRODUCTS, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch
            {
                throw;
            }
            return lstUserProductMapping;
        }
        /// <summary>
        /// Get Asigned Products
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCodes"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.UserProductModel> GetAssignedProductsforUserProdcut(string companyCode, string userCodes)
        {
            IEnumerable<MVCModels.HiDoctor_Master.UserProductModel> lstUserProduct;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@UserCodes", userCodes);
                    lstUserProduct = connection.Query<MVCModels.HiDoctor_Master.UserProductModel>(SP_HDGETASSIGNEDPRODUCTS, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch
            {
                throw;
            }
            return lstUserProduct;
        }
        /// <summary>
        /// Insert User Product
        /// </summary>
        /// <param name="lstUserProduct"></param>
        /// <returns></returns>
        public int InsertUserProduct(List<MVCModels.HiDoctor_Master.UserProductModel> lstUserProduct)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                    const string insertQuery = "INSERT INTO tbl_SFA_User_Product(Company_Code,User_Product_Code,User_Code,Product_Code, " +
                                              "Current_Stock,Effective_From) VALUES(@Company_Code,NEXT VALUE FOR SEQ_tbl_SFA_User_Product,@User_Code,@Product_Code,@Current_Stock, " +
                                              "@Effective_From)";
                    rowsAffected = connection.Execute(insertQuery, lstUserProduct, transaction: trans);
                    trans.Commit();
                }
            }
            catch
            {
                throw;
            }
            return rowsAffected;
        }
        #endregion UserProductMapping

        public DataSet GetInwardExcelDataUserBased(string company_Code, IEnumerable<DivisionUserProducts> lstUsers, IEnumerable<DivisionUserProducts> lstProducts)
        {
            try
            {
                _objSPData = new SPData();
                _objData = new Data();

                string cmdText = SP_HDGETINWARDEXCELDATAUSERBASED;
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                if (((List<DivisionUserProducts>)lstUsers).Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Users", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_Users_Table");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Users", ParameterDirection.Input, SqlDbType.Structured, new UserMasterEnumurator(lstUsers), "TVP_Users_Table");
                }
                if (((List<DivisionUserProducts>)lstProducts).Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Products", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_Products_Table");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Products", ParameterDirection.Input, SqlDbType.Structured, new ProductsEnumurator(lstProducts), "TVP_Products_Table");
                }

                _objData.OpenConnection(company_Code);
                DataSet ds = _objData.ExecuteDataSet(command);

                return ds;
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetUnMappedDivisionProducts(string company_Code, string division_Code, string product_Type_Code)
        {
            DataSet ds;
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETUNMAPPEDDIVISIONPRODUCTS);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@Division_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, division_Code);
                _objSPData.AddParamToSqlCommand(command, "@Product_Type", ParameterDirection.Input, SqlDbType.VarChar, 30, product_Type_Code);
                _objData.OpenConnection(company_Code);
                ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public int GetAppliedDCRChildUsersCount(string companyCode, string userCode, string currentdate)
        {
            int rowcount = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@UserCode", userCode);
                    p.Add("@CurrentDate", currentdate);
                    p.Add("@Result", 0, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>(SP_HDGETCHILDUSERSDCRAPPLIEDSTATUS, p, commandType: CommandType.StoredProcedure);
                    rowcount = p.Get<int>("@Result");
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowcount;
        }


        public int GetCustomerMasterDupicationvalue(string companyCode, string regionCode, string mobileNo, string regNo, string configValue)
        {
            int rowcount = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    p.Add("@MobileNo", mobileNo);
                    p.Add("@RegNo", regNo);
                    p.Add("@configValue", configValue);
                    p.Add("@Result", 0, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>(SP_HDGETCUSTOMERMASTERDUPLICATIONCHECKCOUNT, p, commandType: CommandType.StoredProcedure);
                    rowcount = p.Get<int>("@Result");
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowcount;
        }



        public IEnumerable<MVCModels.RegionModel> GetSeletedRegionName(string companyCode, string regionCode)
        {
            string result = string.Empty;
            List<MVCModels.RegionModel> lst = new List<MVCModels.RegionModel>();
            // int rowsaffeted = 0;
            using (IDbConnection connection = IDbOpenConnection())
            {
                var parameter = new DynamicParameters();
                parameter.Add("@Company_Code", companyCode);
                parameter.Add("@Region_Code", regionCode);
                string insertquery = "SELECT Region_Name from tbl_Sfa_Region_Master WHERE Company_Code=@Company_Code AND Region_Code = @Region_Code";
                lst = connection.Query<MVCModels.RegionModel>(insertquery, parameter).ToList();

            }
            return lst;
        }


        public int GetCurrentMonthAppliedDCRChildUsersCount(string companyCode, string userCode, string month, string year)
        {
            int rowcount = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@UserCode", userCode);
                    p.Add("@Month", month);
                    p.Add("@Year", year);
                    p.Add("@Result", 0, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>(SP_HDGETCHILDUSERSDCRAPPLIEDSTATUSCURRENTMONT, p, commandType: CommandType.StoredProcedure);
                    rowcount = p.Get<int>("@Result");
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowcount;
        }


        #region Config Settings
        public bool CheckConfigSettings(string companyCode, string configKey, string mode, string confValue)
        {
            bool isTrue = false;
            int rowsAffected = 0;
            string query = string.Empty;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                    if (mode.ToUpper() == "INSERT")
                    {
                        query = "SELECT COUNT(1) FROM tbl_SFA_Config_Settings WHERE Company_Code=@Company_Code AND Config_Key =@Config_Key ";
                    }
                    else
                    {
                        query = "SELECT COUNT(1) FROM tbl_SFA_Config_Settings WHERE Company_Code=@Company_Code AND Config_Key =@Config_Key AND Config_Value=@Config_Value";
                    }

                    rowsAffected = connection.Query<int>(query, new
                    {
                        Company_Code = companyCode,
                        Config_Key = configKey,
                        Config_Value = confValue,
                    },
                    transaction: trans).Single();
                    trans.Commit();
                    if (rowsAffected > 0)
                    {
                        isTrue = true;
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return isTrue;
        }


        public bool InsertConfigSettings(string companyCode, string configName, string configValue, string possibleValue, string configType, string mode, string confId)
        {
            bool isTrue = false;
            int rowsAffected = 0;
            string query = "";
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();

                    if (mode.ToUpper() == "INSERT")
                    {
                        query = "INSERT INTO tbl_SFA_Config_Settings" +
                                            "(Company_Code,Config_Key,Config_Value,Possible_Values,Type)" +
                                            "VALUES(@Company_Code, @Config_Key, @Config_Value, @Possible_Values,@Type)";
                    }
                    else
                    {
                        query = "UPDATE tbl_SFA_Config_Settings SET Config_Key =@Config_Key,Config_Value= @Config_Value,Possible_Values=@Possible_Values,Type=@Type " +
                                " WHERE Config_Id=@Config_Id";
                    }
                    rowsAffected = connection.Execute(query, new
                    {
                        Company_Code = companyCode,
                        Config_Key = configName,
                        Config_Value = configValue,
                        Possible_Values = possibleValue,
                        Type = configType,
                        Config_Id = confId
                    },
                    transaction: trans);
                    trans.Commit();
                    if (rowsAffected > 0)
                    {
                        isTrue = true;
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return isTrue;
        }
        public IEnumerable<MVCModels.ConfigSettingsModel> GetConfigDetails(string companyCode)
        {
            IEnumerable<MVCModels.ConfigSettingsModel> lstConfig = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    lstConfig = connection.Query<MVCModels.ConfigSettingsModel>(SP_HDGETCONFIGDETAILS,
                        p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }

            return lstConfig;
        }

        public IEnumerable<MVCModels.ConfigSettingsModel> GetSelectedConfigDetails(string companyCode, string configId)
        {
            IEnumerable<MVCModels.ConfigSettingsModel> lstMenu = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Config_Id", configId);
                    lstMenu = connection.Query<MVCModels.ConfigSettingsModel>(SP_HDGETSELECTEDCONFIGDETAILS,
                        p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }

            return lstMenu;
        }
        #endregion config Settings


        #region App settings
        public IEnumerable<MVCModels.CompanyAppMappingModel> GetCompanyAppMappedDetail(string companyCode)
        {
            IEnumerable<MVCModels.CompanyAppMappingModel> lstApp;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    lstApp = connection.Query<MVCModels.CompanyAppMappingModel>(SP_HDGETAPPMAPPDETAILS,
                        p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return lstApp;
        }
        public IEnumerable<MVCModels.CompanyAppMappingModel> GetAppDetail()
        {
            IEnumerable<MVCModels.CompanyAppMappingModel> lstApp;
            try
            {
                using (IDbConnection connection = IDbOpenGlobalConnection())
                {
                    var p = new DynamicParameters();
                    lstApp = connection.Query<MVCModels.CompanyAppMappingModel>(SP_HDGETAPPDETAILS, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return lstApp;
        }
        public bool InsertCompanyAppDelete(string companyCode)
        {
            bool isTrue = false;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                    // delete MC detail
                    const string deleteQuery = "DELETE FROM tbl_SFA_Company_App_Mapping  WHERE  Company_Code = @Company_Code";
                    connection.Execute(deleteQuery, new { Company_Code = companyCode },
                                            transaction: trans);
                    trans.Commit();
                    isTrue = true;

                }
            }
            catch (Exception)
            {
                throw;
            }
            return isTrue;
        }

        public bool InsertCompanyApp(string companyCode, List<MVCModels.CompanyAppMappingModel> lstCompanyApp)
        {
            bool isTrue = false;
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                    // delete MC detail
                    const string deleteQuery = "DELETE FROM tbl_SFA_Company_App_Mapping  WHERE  Company_Code = @Company_Code";
                    connection.Execute(deleteQuery, new { Company_Code = companyCode },
                                            transaction: trans);

                    const string detailQuery = "INSERT INTO tbl_SFA_Company_App_Mapping(Company_App_Mapping_Id,Company_Code,Company_Code_Num,App_Id,App_Suite_Id,App_Name,Platform,Last_Updated_User_Code,Last_Updated_DateTime,Company_App_Mapping_Status) VALUES " +
                        "(NEXT VALUE FOR SEQ_CompanyApp_setting,@Company_Code,@Company_Code_Num,@App_Id,@App_Suite_Id,@App_Name,@Platform,@Last_Updated_User_Code,@Last_Updated_DateTime,@Company_App_Mapping_Status)";
                    rowsAffected = connection.Execute(detailQuery, lstCompanyApp, transaction: trans);
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

        public IEnumerable<MVCModels.UserAppMappingModel> GetAppMappedUser(string companyCode, string userCode, string appId)
        {
            IEnumerable<MVCModels.UserAppMappingModel> lstUser = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstUser = connection.Query<MVCModels.UserAppMappingModel>(SP_HDGETAPPMAPPEDUSERDETAILS,
                                  new { Company_Code = companyCode, User_Code = userCode, App_Id = appId },
                                  commandType: CommandType.StoredProcedure);
                    return lstUser;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        public bool InsertUserMappingApp(string companyCode, List<MVCModels.UserAppMappingModel> lstCompanyApp, List<MVCModels.UserAppMappingModel> lstmappedApp)
        {
            bool isTrue = false;
            int rowsAffected = 0;
            try
            {

                List<MVCModels.UserAppMappingModel> lstInsertHistory = lstCompanyApp.Where(s => !lstmappedApp.Where(e => e.User_Code == s.User_Code && e.App_Id == s.App_Id).Any()).ToList();

                List<MVCModels.UserAppMappingModel> lstInsertHistoryRevoke = lstmappedApp.Where(s => !lstCompanyApp.Where(e => e.User_Code == s.User_Code && e.App_Id == s.App_Id).Any()).ToList();


                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                    // delete MC detail
                    const string deleteQuery = "UPDATE tbl_SFA_App_User_Mapper SET App_User_Mapper_Status ='0' WHERE App_Id=@App_Id AND Company_Code = @Company_Code";
                    connection.Execute(deleteQuery, lstCompanyApp, transaction: trans);

                    const string deleteQuery1 = "UPDATE tbl_SFA_App_User_Mapper SET App_User_Mapper_Status ='0' WHERE App_Id=@App_Id AND Company_Code = @Company_Code";
                    connection.Execute(deleteQuery1, lstmappedApp, transaction: trans);

                    const string InsertHistory = "INSERT INTO tbl_SFA_App_User_Mapper_History (Company_Id, User_Id,User_Name,Region_Name,Region_Code, App_Suite_Id,App_Id,History_Reason, Modified_DateTime, Modified_By,Company_Code, " +
                                                " User_Code,  App_Name, Platform )SELECT @Company_Id,@User_Id,um.User_Name,Region_Name,rm.Region_Code, @App_Suite_Id,@App_Id,'ACCESS_GIVEN', @Modified_DateTime, @Modified_By,um.Company_Code,  " +
                                                " @User_Code,@App_Name,@Platform FROM tbl_SFA_User_Master um  INNER JOIN tbl_SFA_Region_Master rm ON rm.Region_Code =um.Region_Code " +
                                                "  WHERE um.User_Code=@User_Code ";
                    connection.Execute(InsertHistory, lstInsertHistory, transaction: trans);

                    const string UpdateHistory = "INSERT INTO tbl_SFA_App_User_Mapper_History (Company_Id, User_Id,User_Name,Region_Name,Region_Code, App_Suite_Id,App_Id,History_Reason, Modified_DateTime, Modified_By,Company_Code, " +
                                                " User_Code,  App_Name, Platform )SELECT @Company_Id,@User_Id,um.User_Name,Region_Name,rm.Region_Code, @App_Suite_Id,@App_Id,'ACCESS_REVOKED', @Modified_DateTime, @Modified_By,um.Company_Code,  " +
                                                " @User_Code,@App_Name,@Platform FROM tbl_SFA_User_Master um  INNER JOIN tbl_SFA_Region_Master rm ON rm.Region_Code =um.Region_Code " +
                                                "  WHERE um.User_Code=@User_Code ";
                    connection.Execute(UpdateHistory, lstInsertHistoryRevoke, transaction: trans);

                    const string detailQuery = "INSERT INTO tbl_SFA_App_User_Mapper(Mapper_Id,Company_Id, User_Id, App_Suite_Id, App_Id, Effective_From, Effective_To,App_User_Mapper_Status,  User_Code, Company_Code, App_Name, Platform) VALUES " +
                        "(NEXT VALUE FOR SEQ_tbl_SFA_App_User_Mapper,@Company_Id,@User_Id,@App_Suite_Id,@App_Id,@Effective_From,@Effective_To,@App_User_Mapper_Status,@User_Code,@Company_Code,@App_Name,@Platform)";
                    rowsAffected = connection.Execute(detailQuery, lstCompanyApp, transaction: trans);
                    trans.Commit();
                    //if (rowsAffected > 0)
                    //{
                    isTrue = true;
                    //}
                }
            }
            catch (Exception)
            {
                throw;
            }
            return isTrue;
        }

        #endregion App settings

        #region - My Documents
        /// <summary>
        /// Get Documents Types
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public List<MVCModels.MyDocumentTypeModel> GetMyDocumentstoDownload(string companyCode, string userCode, string regionCode)
        {
            List<MVCModels.MyDocumentTypeModel> lstDocuments = new List<MyDocumentTypeModel>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@UserCode", userCode);
                    p.Add("@RegionCode", regionCode);
                    lstDocuments = connection.Query<MVCModels.MyDocumentTypeModel>(SP_HD_MYDOC_GETDOCUMENTTYPES, p, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch
            {
                throw;
            }
            return lstDocuments;
        }
        //// <summary>
        /// Get URl by document ID
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="docTypeid"></param>
        /// <returns></returns>
        public string GetDocumentbyDocId(string companyCode, string userCode, string docId)
        {
            string docUrl = string.Empty;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@UserCode", userCode);
                    parameter.Add("@DocId", docId);

                    docUrl = connection.Query<string>(SP_HD_MYDOC_GETDOCUMENTBYDOCTYPEID, parameter, commandType: CommandType.StoredProcedure).FirstOrDefault();
                }
            }
            catch
            {
                throw;
            }
            return docUrl;
        }
        /// <summary>
        /// Downloaded date and name while downloading
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="docId"></param>
        /// <param name="downloadDate"></param>
        /// <param name="downloadBy"></param>
        /// <returns></returns>
        public int UpdateMyDocMentforDownload(String companyCode, string userCode, string docId, string downloadDate, string downloadBy)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@Company_Code", companyCode);
                    parameter.Add("@User_Code", userCode);
                    parameter.Add("@Doc_Id", docId);
                    parameter.Add("@Download_Date", downloadDate);
                    parameter.Add("@Download_By", downloadBy);

                    const string query = "UPDATE tbl_SFA_My_Documents SET Download_By = @Download_By,Download_Date = @Download_Date WHERE Company_Code = @Company_Code AND User_Code = @User_Code AND Doc_Id = @Doc_Id";
                    rowsAffected = connection.Execute(query, parameter);
                }
            }
            catch
            {
                throw;
            }
            return rowsAffected;
        }

        #region File Upload
        /// <summary>
        /// Get Document Types
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public List<MVCModels.MyDocumentsModel> GetMyDocTypes(string companyCode)
        {
            List<MVCModels.MyDocumentsModel> lstDocTypes = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    lstDocTypes = connection.Query<MVCModels.MyDocumentsModel>(SP_HD_GETMYDOCTYPES, parameter, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch
            {
                throw;
            }
            return lstDocTypes;
        }
        /// <summary>
        /// insert chunk files
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="documentTypeCode"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <param name="documentName"></param>
        /// <param name="uploadFileURL"></param>
        /// <param name="uploadFileName"></param>
        /// <param name="uploadedDate"></param>
        /// <returns></returns>
        public int InsertChunkFiles(List<MVCModels.MyDocumentFileUploads> lstFiles)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", lstFiles[0].Company_Code);
                    p.Add("@Doc_Type_Id", lstFiles[0].Doc_Type_Id);
                    p.Add("@Doc_Month", lstFiles[0].Doc_Month);
                    p.Add("@Doc_Year", lstFiles[0].Doc_Year);
                    p.Add("@Doc_Name", lstFiles[0].Doc_Name);
                    p.Add("@Uploaded_File_Url", lstFiles[0].Uploaded_File_Url);
                    p.Add("@Uploaded_File_name", lstFiles[0].Uploaded_File_name);
                    p.Add("@Uploaded_Date", lstFiles[0].Uploaded_Date);
                    p.Add("@status", lstFiles[0].Status);
                    p.Add("@Processing_Status", lstFiles[0].Processing_Status);
                    p.Add("@File_Extracting_status", lstFiles[0].File_Extracting_status);
                    p.Add("@User_Uploaded_Files_Count", lstFiles[0].User_Uploaded_Files_Count);
                    p.Add("@System_Uploaded_Files_Count", lstFiles[0].System_Uploaded_Files_Count);
                    p.Add("@Invalid_File_Count", lstFiles[0].Invalid_File_Count);
                    p.Add("@Uploaded_By", lstFiles[0].Uploaded_By);
                    p.Add("@Doc_Upload_Category", lstFiles[0].Doc_Upload_Category);
                    p.Add("@Result", lstFiles[0].result, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>(SP_HD_Document_Upload_Tracker, p, commandType: CommandType.StoredProcedure);
                    rowsAffected = p.Get<int>("@Result");
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowsAffected;
        }
        /// <summary>
        /// Get Uploaded Fiels count
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns></returns>
        public List<MVCModels.MyDocumentFileUploads> GetUploadedFilesCount(string companyCode, string userCode)
        {
            List<MVCModels.MyDocumentFileUploads> lstUploadedFielscount = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@UserCode", userCode);
                    lstUploadedFielscount = connection.Query<MVCModels.MyDocumentFileUploads>(SP_HD_GETUPLOADEDFILESCOUNT, parameter, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch
            {
                throw;
            }
            return lstUploadedFielscount;
        }
        /// <summary>
        /// Get Invalid Files
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="docUploadId"></param>
        /// <returns></returns>
        public List<MVCModels.InvalidFiles> GetInvalidFiles(string companyCode, string docUploadId)
        {
            List<MVCModels.InvalidFiles> lstInvalidFiles = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@Company_Code", companyCode);
                    parameter.Add("@Doc_Upload_Id", docUploadId);
                    lstInvalidFiles = connection.Query<MVCModels.InvalidFiles>(SP_HD_MYDOC_GETINVALIDFILES, parameter, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch
            {
                throw;
            }
            return lstInvalidFiles;
        }
        #endregion File Upload
        #endregion - My Documents


        public IEnumerable<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> GetPrivilegeLst(string loginUserTypeCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> lst = new List<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Type_Code", loginUserTypeCode);
                    lst = connection.Query<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel>(SP_SFA_GetlstPrivilege, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return lst;
        }

        public int GetLeavePrivilegeForSelectedUser(string userCode, string companyCode)
        {
            int result = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Code", userCode);
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Result", result, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>(SP_HD_GetLeavePrivilegeForSelectedUser, p, commandType: CommandType.StoredProcedure);
                    result = p.Get<int>("@Result");
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        public List<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> fnGetDCRPrivilegeReport(string companyCode, string loginUserTypeCode)
        {
            List<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> lst = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Code", loginUserTypeCode);
                    lst = connection.Query<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel>(SP_SFA_GetlstPrivilege_ApprovalUser, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return lst.ToList();
        }

        public IEnumerable<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> GetPrivilegeLstApproval(string userCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> lst = new List<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Code", userCode);
                    lst = connection.Query<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel>(SP_SFA_GetlstPrivilege_ApprovalUser, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return lst;
        }

        public IEnumerable<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> GetPrivilegeLstUnApproval(string userCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> lst = new List<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Code", userCode);
                    lst = connection.Query<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel>(SP_SFA_GetlstPrivilege_UnApprovalUser, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return lst;
        }

        public MVCModels.HiDoctor_Master.UserModel GetUserMaster(string userCode)
        {
            MVCModels.HiDoctor_Master.UserModel _userModel = new MVCModels.HiDoctor_Master.UserModel();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@userCode", userCode);
                    _userModel = connection.Query<MVCModels.HiDoctor_Master.UserModel>(SP_hdGetUserMaster, p, commandType: CommandType.StoredProcedure).SingleOrDefault();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return _userModel;
        }


        public IEnumerable<MVCModels.DCRRatingConfig> GetDCRRatingConfigLst(string loginUserTypeCode)
        {
            IEnumerable<MVCModels.DCRRatingConfig> lst = new List<MVCModels.DCRRatingConfig>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Type_Code", loginUserTypeCode);
                    lst = connection.Query<MVCModels.DCRRatingConfig>(SP_SFA_GetlstRatingConfig, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return lst;
        }
        public string UpdateProfileDetails(string companyCode, string userCode, string Mail, string Mobile, string phone, string Add1, string Add2, string Add3, int City, int State, int Pincode,string Bloodgroup,string Employeephoto)
        {
            string result = string.Empty;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@UserCode", userCode);
                    p.Add("@Email", Mail);
                    p.Add("@Mobile", Mobile);
                    p.Add("@Phone", phone);
                    p.Add("@Address1", Add1);
                    p.Add("@Address2", Add2);
                    p.Add("@Address3", Add3);
                    p.Add("@City_ID", City); 
                    p.Add("@State_ID", State);
                    p.Add("@Pincode_Id", Pincode);
                    p.Add("@Bloodgroup", Bloodgroup);
                    p.Add("@Employeephoto", Employeephoto);
                    result = connection.Execute(Sp_hd_UpdateProfileDetails, p, commandType: CommandType.StoredProcedure).ToString();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }


        #region  Inward Acknolodgement

        public InwardAckWrap GetInwardAck(string companyCode, string userCode)
        {
            List<InwardAck> lstrequest = new List<InwardAck>();
            List<InwardAckBatch> lstAckBatch = new List<InwardAckBatch>();
            InwardAckWrap wrap = new InwardAckWrap();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    using (var multiselect = connection.QueryMultiple(SP_HD_GETINWARDACK, p, commandType: CommandType.StoredProcedure))
                    {
                        lstrequest = multiselect.Read<InwardAck>().ToList();
                        lstAckBatch = multiselect.Read<InwardAckBatch>().ToList();

                    }
                    connection.Close();
                    wrap.ProductInfo = lstrequest;
                    wrap.BatchInfo = lstAckBatch;
                }
            }
            catch
            {
                throw;
            }

            return wrap;
        }

        /// <summary>
        ///  Method used to save the invard ack functionality.
        /// </summary>
        /// <param name="companyCode"> represents the company code as <see cref="string"/> </param>
        /// <param name="userCode">refered as user code <see cref="string"/></param>
        /// <param name="lstInwardAck"></param>
        /// <returns><see cref="string"/> comma separated value</returns>
        public string SaveInwardAck(string companyCode, string userCode, DataTable dtInwardAck)
        {
            CurrentInfo _objcurrentinfo = new CurrentInfo();
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                string cmdText = "SP_HD_SetInwardAck";

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommandWithTypeName(command, "@InwardList", ParameterDirection.Input, SqlDbType.Structured, dtInwardAck, "TVP_Web_Inward_ACK");
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentinfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                string result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        #endregion

        #region Inward Adjustment
        public MVCModels.CombinedDeliveryChallanInfo GetUserDeliveryChallan(string UserCode, int Page_Number, int Page_Size)
        {
            MVCModels.CombinedDeliveryChallanInfo CombinedDC = new CombinedDeliveryChallanInfo();
            List<InwardDeliverychallan> lstDeliveryChallan = new List<InwardDeliverychallan>();

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@UserCode", UserCode);
                    p.Add("@Page_Number", Page_Number);
                    p.Add("@Page_Size", Page_Size);
                    p.Add("@Totalcount", dbType: DbType.Int32, direction: ParameterDirection.Output);
                    lstDeliveryChallan = connection.Query<MVCModels.InwardDeliverychallan>(SP_GetUserDeliveryChallan, p, commandType: CommandType.StoredProcedure).ToList();
                    CombinedDC.PageCount = p.Get<int>("@Totalcount");
                    CombinedDC.lstDC = lstDeliveryChallan;
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return CombinedDC;
        }

        public DCInfoWrap GetDeliveryChallanInfo(string DCSelect, string UserCode)
        {
            List<DeliveryChallanInfo> lstDCInfo = new List<DeliveryChallanInfo>();
            List<DeliveryChallanBatchInfo> lstDCBInfo = new List<DeliveryChallanBatchInfo>();
            DCInfoWrap wrap = new DCInfoWrap();

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@DeliveryChallan", DCSelect);
                    p.Add("@UserCode", UserCode);
                    using (var multiselect = connection.QueryMultiple(SP_DeliveryChallanInfo, p, commandType: CommandType.StoredProcedure))
                    {
                        lstDCInfo = multiselect.Read<DeliveryChallanInfo>().ToList();
                        lstDCBInfo = multiselect.Read<DeliveryChallanBatchInfo>().ToList();
                    }
                    connection.Close();
                }

                wrap.ProductInfo = lstDCInfo;
                wrap.BatchInfo = lstDCBInfo;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return wrap;
        }

        public string InsertAdjustment(DataTable dtInwardAdj)
        {
            CurrentInfo _objcurrentinfo = new CurrentInfo();
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                string cmdText = "SP_InsertInwardAdjustment";

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommandWithTypeName(command, "@InwardAdj", ParameterDirection.Input, SqlDbType.Structured, dtInwardAdj, "InwardAdj_TVP");
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(_objcurrentinfo.GetCompanyCode());
                _objData.ExecuteNonQuery(command);
                string result = returnValue.Value.ToString();
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

        public InwardRemarksModel GetRemarksHistory(int Header_Id)
        {
            InwardRemarksModel ObjInward = new InwardRemarksModel();
            try
            {
                List<InwardAck> lstinwrdack = null;
                List<InwardledgerModel> lstledger = null;
                List<InwardBatchledgerModel> lstBatchLedger = null;
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var param = new DynamicParameters();
                    param.Add("@Header_Id", Header_Id);
                    using (var multiselect = connection.QueryMultiple(SP_HD_GetRemarksHistoryForInward, param, commandType: CommandType.StoredProcedure))
                    {
                        lstinwrdack = multiselect.Read<InwardAck>().ToList();
                        lstledger = multiselect.Read<InwardledgerModel>().ToList();
                        lstBatchLedger = multiselect.Read<InwardBatchledgerModel>().ToList();

                    }
                    ObjInward.lstHeader = lstinwrdack;
                    ObjInward.lstLedger = lstledger;
                    ObjInward.lstBatchLedger = lstBatchLedger;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return ObjInward;
        }

        #endregion

        #region SFCExtendedDetails
        public List<SFCRegionModel> GetSFCExtendedDetails(string region_code, DateTime dcr_Date, int distance_Fare_Code, string companyCode)
        {
            List<SFCRegionModel> lsSFCRegion = new List<SFCRegionModel>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@companyCode", companyCode);
                    p.Add("@region_code", region_code);
                    p.Add("@distance_Fare_Code", distance_Fare_Code);
                    p.Add("@dcr_Date", dcr_Date);
                    lsSFCRegion = connection.Query<SFCRegionModel>("SP_Hd_GetSFCExtendedDetails", p, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lsSFCRegion;
        }
        public List<SFCRegionModel> GetRegionSFC(string region_code, DateTime dcr_Date, string company_code)
        {
            List<SFCRegionModel> lsSFCRegion = new List<SFCRegionModel>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@companyCode", company_code);
                    p.Add("@region_code", region_code);
                    p.Add("@dcr_Date", dcr_Date);
                    lsSFCRegion = connection.Query<SFCRegionModel>("SP_HD_BindRegionSFC", p, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lsSFCRegion;
        }
        public int SaveExtendSFC(int distance_Fare_Code, int sfc_Version_No, DateTime dcr_Date, string company_code, string remark, string userCode, int sfc_Extend_Count)
        {
            int rValue = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@companyCode", company_code);
                    p.Add("@Distance_Fare_Code", distance_Fare_Code);
                    p.Add("@DCR_Date", dcr_Date);
                    p.Add("@SFC_Version_No", sfc_Version_No);
                    p.Add("@Remark", remark);
                    p.Add("@Extended_By", userCode);
                    p.Add("@SFC_Extend_Count", sfc_Extend_Count);
                    connection.Execute("SP_HD_ExtendSFC", p, commandType: CommandType.StoredProcedure);
                    rValue = 1;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rValue;
        }
        public int DisableSFCCount(int sfc_Extend_Id)
        {
            int rValue = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@ID", sfc_Extend_Id);
                    connection.Execute("SP_HD_DisableSFCCount", p, commandType: CommandType.StoredProcedure);
                    rValue = 1;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rValue;
        }
        #endregion

        public List<UserProducts> GetUserProducts(string User_Code)
        {
            List<UserProducts> IUserProduct = new List<UserProducts>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Code", User_Code);
                    IUserProduct = connection.Query<UserProducts>(SP_HD_GET_USERPRODUCT, p, commandType: CommandType.StoredProcedure).ToList<UserProducts>();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return IUserProduct;
        }

        public string SaveUserProduct(string User_Code, string Product_Code, int minCount, int maxCount, string User_Product_Status)
        {
            string str = "";
            DataControl.Data ds = new DataControl.Data();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            try
            {
                ds.OpenConnection(objCurInfo.GetCompanyCode());
                {
                    string strSQL = "";
                    strSQL = "EXEC SP_HD_SAV_UserProduct '" + User_Code + "','" + objCurInfo.GetCompanyCode() + "','" + Product_Code + "'," + minCount + "," + maxCount + ",'" + User_Product_Status + "'";
                    str = ds.ExecuteScalar(strSQL).ToString();

                }
                return str;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                ds.CloseConnection();
            }
        }
        public List<UserModel> GetHiDoctorActualDate(string companyCode, List<MVCModels.HiDoctor_Master.Usercodelst> lstUsers)
        {
            List<UserModel> lstActDate = null;
            try
            {
                string userCode = "";
                for (int i = 0; i < lstUsers.Count; i++)
                {
                    if (userCode == "")
                        userCode = "'" + lstUsers[i].User_Code + "'";
                    else
                        userCode = userCode + "," + "'" + lstUsers[i].User_Code + "'";
                }
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@user_Code", userCode);
                    lstActDate = connection.Query<UserModel>(Sp_Hd_GetHiDoctorActualDate, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstActDate;
        }

        public KI_RegionTypeModel GetKIRegionType(string companyCode, string regionTypeName)
        {
            try
            {
                KI_RegionTypeModel obj = new KI_RegionTypeModel();
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@regionTypeName", regionTypeName);
                    obj = connection.Query<KI_RegionTypeModel>(SP_GETKIREGIONTYPE, p, commandType: CommandType.StoredProcedure).ToList<KI_RegionTypeModel>()[0];
                    connection.Close();
                    return obj;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public IEnumerable<AppMenuParams> GetAppParams()
        {
            IEnumerable<AppMenuParams> lstAppParams = null;

            using (IDbConnection connection = IDbOpenConnection())
            {
                lstAppParams = connection.Query<AppMenuParams>("sp_hd_GetAppMenuMasterParams", commandType: CommandType.StoredProcedure);
                connection.Close();
                return lstAppParams;
            }

        }



        public KI_UserTypeModel GetKIUserType(string companyCode, string userTypeName)
        {
            try
            {
                KI_UserTypeModel obj = new KI_UserTypeModel();
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@userTypeName", userTypeName);
                    obj = connection.Query<KI_UserTypeModel>(SP_GETKIUSERTYPE, p, commandType: CommandType.StoredProcedure).ToList<KI_UserTypeModel>()[0];
                    connection.Close();
                    return obj;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }

    
    public class UserMasterEnumurator : IEnumerable<SqlDataRecord>
    {

        public UserMasterEnumurator(IEnumerable<DivisionUserProducts> data)
        {
            _data = data;
        }
        private IEnumerable<DivisionUserProducts> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("User_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("User_Name", SqlDbType.VarChar, 50),
          };

            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.User_Code);
                record.SetValue(1, item.User_Name == null ? "" : item.User_Name);
                yield return record;
            }

        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }

    public class ProductsEnumurator : IEnumerable<SqlDataRecord>
    {

        public ProductsEnumurator(IEnumerable<DivisionUserProducts> data)
        {
            _data = data;
        }
        private IEnumerable<DivisionUserProducts> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
            new SqlMetaData("Product_Code", SqlDbType.VarChar, 50),
            new SqlMetaData("Product_Name", SqlDbType.VarChar, 300),
         };

            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.Product_Code);
                record.SetValue(1, item.Product_Name == null ? "" : item.Product_Name);
                yield return record;
            }
        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }

    public class SFCMasterEnumurator : IEnumerable<SqlDataRecord>
    {

        public SFCMasterEnumurator(IEnumerable<SFCRegionModel> data)
        {
            _data = data;
        }
        private IEnumerable<SFCRegionModel> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
            new SqlMetaData("Company_Code", SqlDbType.VarChar, 50),
            new SqlMetaData("Region_Code", SqlDbType.VarChar, 300),
            new SqlMetaData("Distance_Fare_Code", SqlDbType.BigInt),
            new SqlMetaData("SFC_Version_No", SqlDbType.Int),
            new SqlMetaData("From_Region_Name", SqlDbType.VarChar, 100),
            new SqlMetaData("To_Region_Name", SqlDbType.VarChar, 100),
            new SqlMetaData("Travel_Mode", SqlDbType.VarChar, 50),
            new SqlMetaData("Category_Name", SqlDbType.VarChar, 50),
            new SqlMetaData("Distance", SqlDbType.Float),
            new SqlMetaData("Fare_Amount", SqlDbType.Float),
            new SqlMetaData("Date_From", SqlDbType.VarChar, 12),
            new SqlMetaData("Date_To", SqlDbType.VarChar, 12),
            new SqlMetaData("SFC_Visit_Count", SqlDbType.Int),
            new SqlMetaData("Status", SqlDbType.VarChar, 3),
            new SqlMetaData("Created_By", SqlDbType.VarChar, 30),
            new SqlMetaData("Updated_By", SqlDbType.VarChar, 30),
            new SqlMetaData("Action", SqlDbType.VarChar, 20),
            new SqlMetaData("Minimum_Count", SqlDbType.Int),
         };

            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.Company_Code);
                record.SetValue(1, item.Region_Code);
                record.SetValue(2, item.Distance_Fare_Code == null ? -1 : Convert.ToInt64(item.Distance_Fare_Code));
                record.SetValue(3, item.SFC_Version_No == null ? -1 : Convert.ToInt32(item.SFC_Version_No));
                record.SetValue(4, item.From_Region_Name);
                record.SetValue(5, item.To_Region_Name);
                record.SetValue(6, item.Travel_Mode);
                record.SetValue(7, item.Category_Name);
                if (item.Distance == "")
                {
                    record.SetValue(8, 0.0);
                }
                else
                {
                    record.SetValue(8, item.Distance == null ? 0 : Convert.ToDouble(item.Distance));
                }
                if (item.Fare_Amount == "")
                {
                    record.SetValue(9, 0.0);
                }
                else
                {
                    record.SetValue(9, item.Fare_Amount == null ? 0 : Convert.ToDouble(item.Fare_Amount));
                }
                record.SetValue(10, item.Date_From);
                record.SetValue(11, item.Date_To);
                record.SetValue(12, item.SFC_Visit_Count == null ? 0 : item.SFC_Visit_Count.Trim().Length > 0 ? Convert.ToInt32(item.SFC_Visit_Count) : 0);
                record.SetValue(13, item.Status);
                record.SetValue(14, item.Created_By);
                record.SetValue(15, item.Updated_By);
                record.SetValue(16, item.Action);
                record.SetValue(17, item.Minimum_Count);
                yield return record;
            }
        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }

    public class DFCMasterEnumurator : IEnumerable<SqlDataRecord>
    {

        public DFCMasterEnumurator(IEnumerable<DistanceFareChartModel> data)
        {
            _data = data;
        }
        private IEnumerable<DistanceFareChartModel> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
            new SqlMetaData("Distance_Range_Code", SqlDbType.VarChar, 30),
            new SqlMetaData("From_Km", SqlDbType.Decimal),
            new SqlMetaData("To_Km", SqlDbType.Decimal),
            new SqlMetaData("Fare_Amount", SqlDbType.VarChar,6),
            new SqlMetaData("User_Type_Code", SqlDbType.VarChar, 30),
            new SqlMetaData("Travel_Mode", SqlDbType.VarChar, 50),
            new SqlMetaData("Date_From", SqlDbType.VarChar, 12),
            new SqlMetaData("Date_To", SqlDbType.VarChar,12),
            new SqlMetaData("Status", SqlDbType.Char, 1),
            new SqlMetaData("Is_Amount_Fixed", SqlDbType.Char, 1),
            new SqlMetaData("Entity_Name", SqlDbType.VarChar, 50),
            new SqlMetaData("Entity_Code", SqlDbType.VarChar, 50),
            new SqlMetaData("Created_By", SqlDbType.VarChar, 30),
            new SqlMetaData("Updated_By", SqlDbType.VarChar, 30),
            new SqlMetaData("Action", SqlDbType.VarChar, 20),
         };

            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.Distance_Range_Code);
                record.SetValue(1, item.From_Km == null ? 0 : Convert.ToDecimal(item.From_Km));
                record.SetValue(2, item.To_Km == null ? 0 : Convert.ToDecimal(item.To_Km));
                record.SetValue(3, item.Fare_Amount == null ? "0" : item.Fare_Amount.ToString().Length > 0 ? item.Fare_Amount : "0");
                record.SetValue(4, item.User_Type_Code);
                record.SetValue(5, item.Travel_Mode);
                record.SetValue(6, item.Date_From);
                record.SetValue(7, item.Date_To);
                record.SetValue(8, item.Status == null ? "1" : item.Status.ToString());
                record.SetValue(9, item.Is_Amount_Fixed);
                record.SetValue(10, item.Entity_Name);
                record.SetValue(11, item.Entity_Code);
                record.SetValue(12, item.Created_By);
                record.SetValue(13, item.Update_By);
                record.SetValue(14, item.Action);
                yield return record;
            }
        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }

    }

 }