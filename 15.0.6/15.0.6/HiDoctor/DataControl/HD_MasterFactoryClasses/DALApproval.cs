using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using MVCModels;
using Dapper;

namespace DataControl
{



    public class DALApproval : DapperRepository
    {
        SPData _objSPData = new SPData();
        private Data _objData = new Data();
        const string SP_hdGetApprovedDoctorSpecialityCount = "SP_hdGetApprovedDoctorSpecialityCount";
        const string HD_GET_APPLIED_USER_COUNT = "SP_hdGetAppliedUserCount";
        const string SP_hdDCRDetails = "SP_hdDCRDetails";
        const string SP_hdDeleteDCR = "SP_hdDeleteDCR";
        const string SP_HD_GETDCRLOCKEDROWSPERUSER = "SP_HD_GetDCRLockedRowsPerUser";
        const string HD_GET_DCR_APPROVED_DATA = "SP_hdGetDCRApprovalData";
        const string SP_HD_UPDATEDCRLOCKTORELEASE = "SP_HD_UpdateDCRLockToRelease";
        const string SP_HDGETNOTICESFORAPPROVEANDUNAPPROVE = "SP_HDGetNoticesForApproveAndUnapprove";
        const string SP_HDCHANGESTATUSFORNOTICES = "SP_HDChangeStatusForNotices";
        const string Sp_hd_GETEXPENSEREQUESTDETAILS = "Sp_hd_GetExpenseRequestDetails";

        const string SP_HDGETSFCAPPLIEDUSERS = "SP_HdGetSFCAppliedUsers";
        const string SP_HDGETREGIONDISTANCEMAPVALUES = "Sp_HdGetRegionDistanceMapValues";
        const string SP_HDSFCSTATUSCHANGE = "SP_hdSFCStatusChange";
        const string Sp_hdCheckSFCInCPTPDCR = "Sp_hdCheckSFCInCPTPDCR";
        const string SPHDGETMARKETCHILDAPPLIEDUSERS = "SP_HdGetMarketChildAppliedUsers";
        const string SP_HD_GET_DCR_RATING_PARAMETRE = "SP_hdGetDCRRatingParameter";
        const string SP_GET_APPLIED_CP_USER = "SP_hdGetAppliedCPUserCount";
        const string SP_GET_CP_HEADER_DETAILS = "SP_hdGetCPApprove";
        const string SP_GET_CP_LISTED_DOCTOR = "SP_HDGETCPDoctorList";
        const string SP_GET_CP_SFC_DETAILS = "SP_hdGETCPSFCDetails";
        const string SP_GET_DCR_USER_COUNT = "SP_hdGetDCRUserCount";
        const string SP_HD_JOB_UCF_ROLLBACKUNAPPROVEDDOCTORCOUNT = "SP_hd_Job_UCF_RollbackUnapprovedDoctorCount";
        const string SP_HDGETSECONDARYSALESAPPHEADER = "SP_hdGetSecondarySalesAppHeader";
        const string SP_HDGETSECONDARYSALESAPP_DETAILS = "SP_hdGetSecondarySalesAppDetails";
        const string SP_HDGETWIDEANGLEAPPHEADER = "SP_hdGetWideAngleAppHeader";
        const string SP_HDGETWIDEANGLEAPPDETAILS = "SP_hdGetWideAngleAppDetails";
        const string SP_HDGETSECONDARYSALESAPPROVALTWO = "SP_hdGetSecondarySalesApprovalTwo";
        const string SP_HD_JOB_UCF_INSERT_APPROVED_DATES = "SP_hd_Job_UCF_Insert_Approved_Dates";
        const string SP_HDUPDATEDCRENTITYCOUNT = "SP_HDUpdateDCREntityCount";

        const string SP_hdInsertTPHistory = "SP_hdInsertTPHistory";
        const string SP_hdGetTPHistoryDetails = "SP_hdGetTPHistoryDetails";
        const string SP_hdTPStatusChange = "SP_hdTPStatusChange";
        const string SP_hdTPApprovalLockRelease = "SP_hdTPApprovalLockRelease";
        const string SP_HD_GetTwoActivityDCR = "SP_HD_GetTwoActivityDCR";

        //Cp History
        const string SP_INSERTCPHISTORY = "Sp_InsertCpHistory";
        const string SP_HDGETCPHISTORYDETAILS = "Sp_HdGetCpHistoryDetails";

        //DCR History
        const string SP_INSERTDCRHISTORY = "SP_InsertDCRHistory";
        const string SP_GETDCRAPPROVALHISTORYDETAILS = "SP_GetDCRApprovalHistoryDetails";

        const string SP_CHECK_CLAIMFORDCRUNAPPROVE = "SP_Check_ClaimforDCRUnapprove";

        //TP Approval Get User Status
        const string SP_HD_GETTPUSERSCOUNTFORTHEMONTH = "SP_HD_GetTpUsersCountfortheMonth";

        //Division Master - DCR Approval
        const string SP_Hd_GetDivisionsByLoggedUser = "SP_Hd_GetDivisionsByLoggedUser";


        //Tp Details in DCR Approval
        const string SP_HD_GETTPDETAILSINDCRAPPROVAL = "Sp_HD_GetTpDetailsinDCRApproval";


        //Get Privilege values for delete DCR
        const string SP_HD_GETPRIVILEGEMAPPINGFORDELETEDCR = "SP_hd_GetPrivilegeMappingforDeleteDCR";

        //Dcr approval for dcr lock release
        const string SP_HD_GETACTIVITYLOCKTYPEFORDCRAPPROVAL = "SP_hd_GetActivityLocktypeforDCRApproval";

        //Doctor Approval and Maximum Counts
        const string SP_hdGetDoctorApprovedMaxCount = "SP_hdGetDoctorApprovedMaxCount";

        const string SP_hdUpdateSS_Manager_Lock = "SP_hdUpdateSS_Manager_Lock";


        //Secondary Sales Delete
        const string SP_HDGETSTOCKIEST = "SP_hdGetStockiest";
        const string SP_HDGETDELETESECONDARYSALESDETAIL = "Sp_HdGetDeleteSecondarySalesDetail";
        const string SP_HDGETSELECTEDSS = "sp_hdGetSelectedSS";
        const string SP_HD_SS_UNAPPROVESECONDARYSALES = "SP_HD_SS_UnApproveSecondarySales";
        const string SP_HD_SS_DELETESECONDARYSALES = "SP_HD_SS_DeleteSecondarySales";

        //Secondary Sales Entry
        const string SP_HD_SS_GETSSSTOCKISTBASEDONINPUTS = "SP_HD_SS_GetSSStockistBasedOnInputs";
        const string SP_HD_SS_GETSECONDARYSALESDETAILS = "SP_HD_SS_GetSecondarySalesDetails";
        const string SP_HD_SS_GETUSERLISTOFAREGION = "SP_HD_SS_GetUserListofARegion";
        const string SP_HDGETPRIVILEGEMAPPING = "SP_hdGetPrivilegeMapping";
        const string SP_HD_SS_GetSSPriceGorup = "SP_HD_SS_GetSSPriceGorup";
        const string SP_HD_SS_GETPRODUCTSBASEDONSTOCKIST = "SP_HD_SS_GetProductsBasedonStockist";
        const string SP_HD_SS_GETDYNAMICCOLUMNSSS = "SP_HD_SS_GetDynamicColumnsSS";
        const string SP_HD_SS_GETDYNAMICCOLUMSINFO = "SP_HD_SS_GetDynamicColumsInfo";
        const string SP_HD_SS_GETSELECTEDSTOCKISTSSENTRIESCOUNT = "SP_HD_SS_GetSelectedStockistSSEntriesCount";
        const string SP_HD_SS_GETSSDETAILSFOREDIT = "SP_HD_SS_GetSSDetailsForEdit";


        //Secondary Sales Approval

        const string SP_HD_SS_GETSSDETAILSOFSELREGION = "SP_HD_SS_GetSSDetailsofSelRegion";
        const string SP_HD_SS_UPDATESSHEADERSTATUS = "SP_HD_SS_UpdateSSheaderStatus";
        const string SP_HD_SS_UPDATEUNAPPROVEDSSSTATUS = "SP_HD_SS_UpdateUnApprovedSSStatus";
        const string SP_HD_SS_GETHISTORYOFSSFORSELECTEDSTOCKIEST = "SP_HD_SS_GetHistoryOfSSForSelectedStockiest";

        //secondary sales new approval
        const string SP_HD_SS_GetSSDetailsofSelectedInputs = "SP_HD_SS_GetSSDetailsofSelectedInputs";
        const string SP_HD_SS_SecondarySalesApprovalDetails = "SP_HD_SS_SecondarySalesApprovalDetails";
        const string sp_hd_ShowSSDetails = "sp_hd_ShowSSDetails";
        // const string SP_HD_SS_GetUsersinaRegion = "SP_HD_SS_GetUsersinaRegion";
        const string SP_HD_SS_SingleApproveorUnapprove = "SP_HD_SS_SingleApproveorUnapprove";
        const string SP_HD_SS_CascadeSecondarySales = "SP_HD_SS_CascadeSecondarySales";

        //Dcr Freeze release
        const string SP_HD_GETDCRFREEZERELEASEDAPPROVALDATA = "SP_HD_GetDcrFreezeReleasedApprovalData";

        //DCR Leave Approval
        const string SP_HD_DCRLeaveApproval = "SP_HD_DCRLeaveApproval";
        const string SP_HD_UpdateDCRLeaveStatus = "SP_HD_UpdateDCRLeaveStatus";

        //Delete DCR & Delete Leave DCR Screen
        const string SP_HD_Leave_Policy_Status = "SP_HD_Leave_Policy_Status";

        //DCR Approval Screen Activity Count And Leave Balance Update
        const string SP_HD_UpdateActivityCount_AND_LeaveBalance_On_Approval = "SP_HD_UpdateActivityCount_AND_LeaveBalance_On_Approval";

        //Lock Details
        const string SP_HD_GetLockDetils = "SP_HD_GetLockDetils";

        #region Private Methods
        public void AddParamToSqlCommand(SqlCommand cmd, string paramName, ParameterDirection paramDirection, SqlDbType dbType, int size, object paramValue)
        {
            try
            {
                SqlParameter parameter = new SqlParameter();
                parameter.ParameterName = paramName;
                parameter.Direction = paramDirection;
                parameter.SqlDbType = dbType;
                parameter.Value = paramValue;
                parameter.Size = size;
                cmd.Parameters.Add(parameter);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private List<DCRActivityLockModel> GetDCRLockedList(SqlDataReader dataReader)
        {
            List<DCRActivityLockModel> lstdcrLockModel = new List<DCRActivityLockModel>();

            while (dataReader.Read())
            {
                DCRActivityLockModel dcrLockModel = new DCRActivityLockModel();

                dcrLockModel.User_Name = dataReader["User_Name"].ToString();
                dcrLockModel.User_Code = dataReader["User_Code"].ToString();
                dcrLockModel.Locked_Date = dataReader["LockedDate"].ToString();
                dcrLockModel.Lock_Status = dataReader["Lock_Status"].ToString();
                dcrLockModel.DCR_Actual_Date = dataReader["DCR_Actual_Date"].ToString();
                dcrLockModel.Lock_Type = dataReader["Lock_Type"].ToString();

                lstdcrLockModel.Add(dcrLockModel);
            }
            return lstdcrLockModel;
        }

        private List<NoticeBoardModel> GetNoticeList(SqlDataReader dataReader)
        {
            List<NoticeBoardModel> lstnoticeBoardModel = new List<NoticeBoardModel>();

            while (dataReader.Read())
            {
                NoticeBoardModel noticeBoardModel = new NoticeBoardModel();

                noticeBoardModel.MsgCode = dataReader["Msg_Code"].ToString();
                noticeBoardModel.MsgTitle = dataReader["Title"].ToString();
                noticeBoardModel.MsgBody = dataReader["Message"].ToString();
                noticeBoardModel.MsgValidFrom = dataReader["Date_From"].ToString();
                noticeBoardModel.MsgValidTo = dataReader["Date_To"].ToString();
                noticeBoardModel.MsgPriority = Convert.ToInt32(dataReader["Priority"]);
                noticeBoardModel.MsgDistributionType = Convert.ToChar(dataReader["Distribution_Type"]);
                noticeBoardModel.MsgApprovalStatus = Convert.ToChar(dataReader["Approved"]);
                noticeBoardModel.User_Name = dataReader["User_Name"].ToString();

                lstnoticeBoardModel.Add(noticeBoardModel);
            }
            return lstnoticeBoardModel;
        }
        #endregion Private Methods
        // DCR Approval Screen Start here
        /// <summary>
        /// Get Divisions
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public List<MVCModels.DivisionModel> GetDivisions(string companyCode, string userCode)
        {
            List<MVCModels.DivisionModel> lstDivisions = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@UserCode", userCode);
                    lstDivisions = connection.Query<MVCModels.DivisionModel>(SP_Hd_GetDivisionsByLoggedUser, parameter, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch
            {
                throw;
            }
            return lstDivisions;
        }

        public DataSet GetDCRAppliedUserCount(string companyCode, string userCode, string flag, string dcrStatus, string month, string year)
        {
            try
            {
                SqlCommand command = new SqlCommand(HD_GET_APPLIED_USER_COUNT);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@DCRStatus", ParameterDirection.Input, SqlDbType.VarChar, 6, dcrStatus);
                AddParamToSqlCommand(command, "@Flag", ParameterDirection.Input, SqlDbType.VarChar, 3, flag);
                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.VarChar, 2, month);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.VarChar, 4, year);
                _objData.OpenConnection();

                DataSet ds = _objData.ExecuteDataSet(command);

                return ds;
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

        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetDCRUserCount(string companyCode, string userCode, string flag, string dcrStatus, string month, string year, string selection, string divisionCodes)
        {
            IEnumerable<MVCModels.HiDoctor_Master.UserModel> lstUserList;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstUserList = connection.Query<MVCModels.HiDoctor_Master.UserModel>(SP_GET_DCR_USER_COUNT,
                                  new { CompanyCode = companyCode, UserCode = userCode, DCRStatus = dcrStatus, Flag = flag, Month = month, Year = year, Selection = selection, DivisionCode = divisionCodes },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return lstUserList;
        }

        public DataSet GetSFCAppliedUsers(string companyCode, string regionCodes)
        {
            try
            {

                SqlCommand command = new SqlCommand(SP_HDGETSFCAPPLIEDUSERS);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCodes", ParameterDirection.Input, SqlDbType.VarChar, regionCodes.Length, regionCodes);
                _objData.OpenConnection();

                DataSet ds = _objData.ExecuteDataSet(command);

                return ds;
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

        //GetRegionSFCRecord


        public DataSet GetSFCrecord(string companyCode, string regionCode, string status)
        {
            try
            {

                SqlCommand command = new SqlCommand(SP_HDGETREGIONDISTANCEMAPVALUES);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(command, "@Status", ParameterDirection.Input, SqlDbType.VarChar, 30, status);
                _objData.OpenConnection();
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public string SFCBulkApproval(string companyCode, string regionCode, string fareCodes, string mode)
        {
            SPData _objSPData = new SPData();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HDSFCSTATUSCHANGE);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                _objSPData.AddParamToSqlCommand(command, "@DFCCodes", ParameterDirection.Input, SqlDbType.VarChar, fareCodes.Length, fareCodes);
                _objSPData.AddParamToSqlCommand(command, "@mode", ParameterDirection.Input, SqlDbType.VarChar, 30, mode);
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

        public string SFCBulkApprovals(string companyCode, string regionCode, string fareCodes, string mode)
        {
            SPData _objSPData = new SPData();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HDSFCSTATUSCHANGE);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                _objSPData.AddParamToSqlCommand(command, "@DFCCodes", ParameterDirection.Input, SqlDbType.VarChar, fareCodes.Length, fareCodes);
                _objSPData.AddParamToSqlCommand(command, "@mode", ParameterDirection.Input, SqlDbType.VarChar, 30, mode);
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

        //CheckSFCInCPTPDCR

        public DataSet CheckSFCInCPTPDCR(string companyCode, string regionCode, string fareCodes)
        {
            try
            {

                SqlCommand command = new SqlCommand(Sp_hdCheckSFCInCPTPDCR);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, regionCode.Length, regionCode);
                AddParamToSqlCommand(command, "@SfcCode", ParameterDirection.Input, SqlDbType.VarChar, fareCodes.Length, fareCodes);
                _objData.OpenConnection();
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
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

        public DataSet GetDCRDetailsForDelete(string companyCode, string userCode, int month, int year, string dcrFlag, int dcrStatus)
        {
            try
            {
                DataSet ds = new DataSet();

                SqlCommand command = new SqlCommand(SP_hdDCRDetails);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.Int, 30, month);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.Int, 30, year);
                AddParamToSqlCommand(command, "@DCRFlag", ParameterDirection.Input, SqlDbType.VarChar, 10, dcrFlag);
                AddParamToSqlCommand(command, "@DCRStatus", ParameterDirection.Input, SqlDbType.Int, 30, dcrStatus);
                _objData.OpenConnection();

                ds = _objData.ExecuteDataSet(command);

                return ds;
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

        public string DeleteDCR(string companyCode, string userCode, string selectedDCRs, string lockPrivilege, int dcrStatus, string LoginuserCode)
        {
            try
            {
                string cmdText = SP_hdDeleteDCR;

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@SelectedDCRs", ParameterDirection.Input, SqlDbType.VarChar, selectedDCRs.Length, selectedDCRs);
                AddParamToSqlCommand(command, "@LockPrivilege", ParameterDirection.Input, SqlDbType.VarChar, 10, lockPrivilege);
                AddParamToSqlCommand(command, "@DCRStatus", ParameterDirection.Input, SqlDbType.Int, 10, dcrStatus);
                AddParamToSqlCommand(command, "@LoginUserName", ParameterDirection.Input, SqlDbType.VarChar, 30, LoginuserCode);

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
                _objSPData.ErrorInsert(companyCode, userCode, ex.Message);
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                dicObj.Add("selectedDCRs", selectedDCRs);
                dicObj.Add("lockPrivilege", lockPrivilege);
                dicObj.Add("dcrStatus", dcrStatus.ToString());
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return "FAIL^" + ex.Message;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }

        /// <summary>
        /// Retrieves the DCR Locked Data.
        /// </summary>
        /// <returns></returns>
        public List<DCRActivityLockModel> GetDCRLockedRows(string company_Code, string user_Code, string FromDate, string ToDate,string Privilegevalue)
        {
            try
            {
                // Creates Instance
                // We are using DCR Activity Model for DCR Lock.
                List<DCRActivityLockModel> lstDCRActivityLockModel = new List<DCRActivityLockModel>();
                string cmdText = SP_HD_GETDCRLOCKEDROWSPERUSER;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                AddParamToSqlCommand(command, "@Compnay_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, user_Code);
                AddParamToSqlCommand(command, "@FromDate", ParameterDirection.Input, SqlDbType.VarChar, 30, FromDate);
                AddParamToSqlCommand(command, "@ToDate", ParameterDirection.Input, SqlDbType.VarChar, 30, ToDate);
                //AddParamToSqlCommand(command, "@Privilegevalue", ParameterDirection.Input, SqlDbType.VarChar, 30, Privilegevalue);

                // Opens the connection.
                _objData.OpenConnection(company_Code);

                // Execuete the data reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    // Converts the DataReader to Speciality list.
                    lstDCRActivityLockModel = GetDCRLockedList(dataReader);
                }

                // returns the list.
                return lstDCRActivityLockModel;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        /// <summary>
        /// Update DCR Lock To Release
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="dcrLockModel"></param>
        /// <returns></returns>
        public string UpdateDCRLockToRelease(string company_Code, DCRActivityLockModel dcrLockModel)
        {
            try
            {
                string cmdText = SP_HD_UPDATEDCRLOCKTORELEASE;
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                AddParamToSqlCommand(command, "@Locked_User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, dcrLockModel.User_Code);
                AddParamToSqlCommand(command, "@DCR_Actual_Date", ParameterDirection.Input, SqlDbType.VarChar, dcrLockModel.DCR_Actual_Date.Length, dcrLockModel.DCR_Actual_Date);
                AddParamToSqlCommand(command, "@Locked_Date", ParameterDirection.Input, SqlDbType.VarChar, dcrLockModel.Locked_Date.Length, dcrLockModel.Locked_Date);
                AddParamToSqlCommand(command, "@LockType", ParameterDirection.Input, SqlDbType.VarChar, 30, dcrLockModel.Lock_Type);
                AddParamToSqlCommand(command, "@ReleasedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, dcrLockModel.Released_By);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, string.Empty);
                AddParamToSqlCommand(command, "@Request_Released_By", ParameterDirection.Input, SqlDbType.VarChar, dcrLockModel.Request_Released_By.Length, dcrLockModel.Request_Released_By);
                AddParamToSqlCommand(command, "@Privilegevalue", ParameterDirection.Input, SqlDbType.VarChar, dcrLockModel.Privilegevalue.Length, dcrLockModel.Privilegevalue);

                _objData.OpenConnection(company_Code);
                _objData.ExecuteNonQuery(command);
                return command.Parameters["@Result"].Value.ToString();
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="selected_User_Code"></param>
        /// <param name="loggedIn_User_Code"></param>
        /// <returns></returns>
        public List<NoticeBoardModel> GetNoticesForApprovalAndUnapproval(string company_Code, string selected_User_Code,
            string loggedIn_User_Code, string Self_Approval_Pri_Value)
        {
            try
            {
                // Creates Instance
                List<NoticeBoardModel> lstNoticeBoardModel = new List<NoticeBoardModel>();
                string cmdText = SP_HDGETNOTICESFORAPPROVEANDUNAPPROVE;

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                AddParamToSqlCommand(command, "@Selected_User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, selected_User_Code);
                AddParamToSqlCommand(command, "@LoggedIn_User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, loggedIn_User_Code);
                AddParamToSqlCommand(command, "@Self_Approval_Privi_Value", ParameterDirection.Input, SqlDbType.VarChar, 30, Self_Approval_Pri_Value);

                // Opens the connection.
                _objData.OpenConnection(company_Code);

                // Execuete the data reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    // Converts the DataReader to Speciality list.
                    lstNoticeBoardModel = GetNoticeList(dataReader);
                }

                // returns the list.
                return lstNoticeBoardModel;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="msg_Codes"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        public string ChangeStatusForNotices(string company_Code, string msg_Codes, string status)
        {
            try
            {
                string cmdText = SP_HDCHANGESTATUSFORNOTICES;
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                AddParamToSqlCommand(command, "@Msg_Code", ParameterDirection.Input, SqlDbType.VarChar, msg_Codes.Length, msg_Codes);
                AddParamToSqlCommand(command, "@Status", ParameterDirection.Input, SqlDbType.VarChar, 30, status);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, string.Empty);

                _objData.OpenConnection(company_Code);
                _objData.ExecuteNonQuery(command);
                return command.Parameters["@Result"].Value.ToString();

            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        //----------------------------------START- MARKETING CAMPAIGN APPROVAL----------------------------------------//
        /// <summary>
        ///  Insert BulkApproval for MarketCampaignToApproval
        /// </summary>
        /// <param name="lstStatusMaster"></param>
        /// <returns></returns>
        public int InsertBulkApprovalforMarketCampaignToApproval(List<MCHeaderModel> lstMarketcampaign, DataTable dtunapproval, string updatedBy)
        {
            int rowAffected = 0;
            try
            {
                string cmdtxt = "SP_HD_MC_UnApproveMarketingCampaigns";
                SqlCommand command = new SqlCommand(cmdtxt);
                command.CommandType = CommandType.StoredProcedure;


                if (dtunapproval.Rows.Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_MC_UnApproval", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_MC_UnApproval");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_MC_UnApproval", ParameterDirection.Input, SqlDbType.Structured, dtunapproval, "TVP_MC_UnApproval");
                }
                _objData.OpenConnection(lstMarketcampaign[0].Company_Code);
                _objData.ExecuteNonQuery(command);
                rowAffected = 1;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return rowAffected;
        }
        /// <summary>
        /// GetChildAppliedUser
        /// </summary>
        /// <param name="mcHeaderModel"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.MCHeaderModel> GetAppliedChildUserForMarketingCampaign(string companyCode, string regionCode)
        {
            IEnumerable<MVCModels.MCHeaderModel> lstmcHeadetModel;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@RegionCodes", regionCode);
                    lstmcHeadetModel = connection.Query<MVCModels.MCHeaderModel>(SPHDGETMARKETCHILDAPPLIEDUSERS, parameter, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("SPNAME", SPHDGETMARKETCHILDAPPLIEDUSERS);
                Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
            return lstmcHeadetModel;
        }
        //----------------------------------END-MARKETING CAMPAIGN APPROVAL ----------------------------------------//

        //**********************************************DCR APPROVAL *********************************************************//

        public List<DCRLeaveApprovalDataModel> DCRLeaveApprovalData(string companyCode, string userCode, string flag, string dcrStatus, string month, string year)
        {
            Data dataObj = new Data();
            try
            {
                List<DCRLeaveApprovalDataModel> lstDCRLeaveApproval = new List<DCRLeaveApprovalDataModel>();
                SqlCommand command = new SqlCommand(SP_HD_DCRLeaveApproval);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@DCRStatus", ParameterDirection.Input, SqlDbType.VarChar, 6, dcrStatus);
                AddParamToSqlCommand(command, "@Flag", ParameterDirection.Input, SqlDbType.VarChar, 3, flag);
                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.Int, 2, month);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.Int, 4, year);
                // Opens the connection.
                dataObj.OpenConnection(companyCode);
                // Execuete the data reader.
                using (SqlDataReader dataReader = dataObj.ExecuteReader(command))
                {
                    lstDCRLeaveApproval = GetDCRLeaveApprovedDate(dataReader);
                }

                // returns the list.
                return lstDCRLeaveApproval;
            }
            finally
            {
                dataObj.CloseConnection();
            }
        }

        public List<DCRApprovalDataModel> GetDCRApprovalData(string companyCode, string userCode, string flag, string dcrStatus, string month, string year)
        {
            Data dataObj = new Data();
            try
            {

                List<DCRApprovalDataModel> lstDCRApproval = new List<DCRApprovalDataModel>();
                SqlCommand command = new SqlCommand(HD_GET_DCR_APPROVED_DATA);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCode.Length, userCode);
                AddParamToSqlCommand(command, "@DCRStatus", ParameterDirection.Input, SqlDbType.VarChar, 6, dcrStatus);
                AddParamToSqlCommand(command, "@Flag", ParameterDirection.Input, SqlDbType.VarChar, 3, flag);
                AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.VarChar, 2, month);
                AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.VarChar, 4, year);
                // Opens the connection.
                dataObj.OpenConnection(companyCode);
                // Execuete the data reader.
                using (SqlDataReader dataReader = dataObj.ExecuteReader(command))
                {
                    lstDCRApproval = GetDCRApprovedData(dataReader);
                }

                // returns the list.
                return lstDCRApproval;
            }
            finally
            {
                dataObj.CloseConnection();

            }
        }
        public string GetGetMonthExpenseStatus(string userCode, DateTime dcr_Date, string companyCode)
        {
            Data dataObj = new Data();
            string expensestatus = "no";
            try
            {
                SqlCommand command = new SqlCommand(Sp_hd_GETEXPENSEREQUESTDETAILS);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@dcr_date", ParameterDirection.Input, SqlDbType.VarChar, 30, dcr_Date);
                AddParamToSqlCommand(command, "@usercode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                dataObj.OpenConnection(companyCode);
                using (SqlDataReader dataReader = dataObj.ExecuteReader(command))
                    if (dataReader.HasRows)
                        while (dataReader.Read())
                            expensestatus = dataReader["status"].ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                dataObj.CloseConnection();
            }
            return expensestatus;
        }


        private List<DCRLeaveApprovalDataModel> GetDCRLeaveApprovedDate(SqlDataReader dataReader)
        {
            List<DCRLeaveApprovalModel> lstDCRLeaveApprovalModel = new List<DCRLeaveApprovalModel>();
            List<DCRLeaveAttachmentModel> lstDCRAttachmentModel = new List<DCRLeaveAttachmentModel>();
            List<DCRLeaveApprovalDataModel> lstDCRLeaveData = new List<DCRLeaveApprovalDataModel>();
            try
            {
                while (dataReader.Read())
                {
                    DCRLeaveApprovalModel dcrLeaveApprovalModel = new DCRLeaveApprovalModel();
                    dcrLeaveApprovalModel.User_Code = dataReader["User_Code"].ToString();
                    dcrLeaveApprovalModel.User_Name = dataReader["User_Name"].ToString();
                    dcrLeaveApprovalModel.From_Date = dataReader["From_Date"].ToString();
                    dcrLeaveApprovalModel.To_Date = dataReader["To_Date"].ToString();
                    dcrLeaveApprovalModel.Entered_Date = dataReader["Entered_Date"].ToString();
                    dcrLeaveApprovalModel.Flag = dataReader["Flag"].ToString();
                    dcrLeaveApprovalModel.DCR_Status = dataReader["DCR_Status"].ToString();
                    dcrLeaveApprovalModel.Leave_Type_Name = dataReader["Leave_Type_Name"].ToString();
                    dcrLeaveApprovalModel.Attachment_Id = Convert.ToInt16(dataReader["Attachment_Id"]);
                    dcrLeaveApprovalModel.Attachment_Count = Convert.ToInt16(dataReader["Attachment_Count"]);
                    dcrLeaveApprovalModel.Leave_Reason = dataReader["Leave_Reason"].ToString();
                    //dcrLeaveApprovalModel.Source_Of_Entry = dataReader["Source_Of_Entry"].ToString();
                    //dcrLeaveApprovalModel.Approved_By = dataReader["Approved_By"].ToString();
                    dcrLeaveApprovalModel.Month = Convert.ToInt16(dataReader["Month"]);
                    dcrLeaveApprovalModel.Year = Convert.ToInt16(dataReader["Year"]);
                    dcrLeaveApprovalModel.Approval_Unapproval_Reason = dataReader["Approval_Unapproval_Reason"].ToString();
                    dcrLeaveApprovalModel.Created_By = dataReader["Created_By"].ToString();
                    dcrLeaveApprovalModel.Updated_By = dataReader["Updated_By"].ToString();
                    dcrLeaveApprovalModel.Updated_Date = dataReader["Updated_Date"].ToString();
                    lstDCRLeaveApprovalModel.Add(dcrLeaveApprovalModel);
                }
                dataReader.NextResult();
                while (dataReader.Read())
                {
                    DCRLeaveAttachmentModel dcrLeaveAttachmentModel = new DCRLeaveAttachmentModel();
                    dcrLeaveAttachmentModel.Attachment_Id = Convert.ToInt16(dataReader["Attachment_Id"]);
                    dcrLeaveAttachmentModel.Attachment_Name = dataReader["Attachment_Name"].ToString();
                    dcrLeaveAttachmentModel.Attachment_Url = dataReader["Attachment_Url"].ToString();
                    lstDCRAttachmentModel.Add(dcrLeaveAttachmentModel);
                }
                DCRLeaveApprovalDataModel _objDCRLeaveApprovaldata = new DCRLeaveApprovalDataModel();
                _objDCRLeaveApprovaldata.lstDCRLeaveApprovalData = lstDCRLeaveApprovalModel;
                _objDCRLeaveApprovaldata.lstLeaveAttachmentData = lstDCRAttachmentModel;
                lstDCRLeaveData.Add(_objDCRLeaveApprovaldata);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstDCRLeaveData;
        }

        private List<DCRApprovalDataModel> GetDCRApprovedData(SqlDataReader dataReader)
        {
            List<DCRApprovalModel> lstDCRApprovalModel = new List<DCRApprovalModel>();
            List<DCRTPApprovalModel> lstDCRTP = new List<DCRTPApprovalModel>();
            List<DCRApprovalDataModel> lstDCRData = new List<DCRApprovalDataModel>();



            while (dataReader.Read())
            {
                DCRApprovalModel dcrApprovalModel = new DCRApprovalModel();
                dcrApprovalModel.User_Name = dataReader["User_Name"].ToString();
                dcrApprovalModel.User_Code = dataReader["User_Code"].ToString();
                dcrApprovalModel.DCR_Code = dataReader["DCR_Code"].ToString();
                dcrApprovalModel.DCR_Date = dataReader["DCR_Date"].ToString();
                dcrApprovalModel.Entered_Date = dataReader["Entered_Date"].ToString();
                dcrApprovalModel.Place_Worked = dataReader["Place_Worked"].ToString();
                dcrApprovalModel.Category = dataReader["Category"].ToString();
                dcrApprovalModel.Flag = dataReader["Flag"].ToString();
                dcrApprovalModel.DCR_Status = dataReader["DCR_Status"].ToString();
                dcrApprovalModel.Leave_Type_Name = dataReader["Leave_Type_Name"].ToString();
                dcrApprovalModel.Unapproval_Reason = dataReader["Unapproval_Reason"].ToString();
                dcrApprovalModel.Region_Code = "";
                dcrApprovalModel.Leave_Reason = dataReader["Leave_Reason"].ToString();
                dcrApprovalModel.Source_Of_Entry = dataReader["Source_Of_Entry"].ToString();
                dcrApprovalModel.DCR_General_Remarks = dataReader["DCR_General_Remarks"].ToString();
                dcrApprovalModel.Doctor_Count = Convert.ToInt16(dataReader["Doctor_Count"]);
                dcrApprovalModel.Chemist_Count = Convert.ToInt16(dataReader["Chemist_Count"]);
                dcrApprovalModel.Stockist_Count = Convert.ToInt16(dataReader["Stockist_Count"]);
                lstDCRApprovalModel.Add(dcrApprovalModel);

                // lstDCRData[0].lstDCRApprovalData.Add(dcrApprovalModel);
            }
            dataReader.NextResult();
            while (dataReader.Read())
            {
                DCRTPApprovalModel dcrTpData = new DCRTPApprovalModel();
                dcrTpData.TP_ID = dataReader["TP_ID"].ToString();
                dcrTpData.TP_DATE = dataReader["TP_DATE"].ToString();
                lstDCRTP.Add(dcrTpData);
                //lstDCRData[0].lstTPApprovaldata.Add(dcrTpData);
            }
            DCRApprovalDataModel _objDCRApprovaldata = new DCRApprovalDataModel();
            _objDCRApprovaldata.lstDCRApprovalData = lstDCRApprovalModel;
            _objDCRApprovaldata.lstTPApprovaldata = lstDCRTP;
            lstDCRData.Add(_objDCRApprovaldata);
            //lstDCRData[0].lstDCRApprovalData = lstDCRApprovalModel;
            //lstDCRData[0].lstTPApprovaldata = lstDCRTP;


            // lstDCRData[0].lstDCRApprovalData.Add(lstDCRApprovalModel);
            //  lstDCRData[0].lstTPApprovaldata.Add(dcrTpData);
            return lstDCRData;
        }
        public DataSet GetDCRRatingparameter(string companyCode, string userCode, string dcrCode, string flag)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_GET_DCR_RATING_PARAMETRE);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@DCRCode", ParameterDirection.Input, SqlDbType.VarChar, dcrCode.Length, dcrCode);
                AddParamToSqlCommand(command, "@Flag", ParameterDirection.Input, SqlDbType.VarChar, 3, flag);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objData.OpenConnection();

                DataSet ds = _objData.ExecuteDataSet(command);

                return ds;
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



        public string RollbackUnapprovedDoctorCount(string companyCode, string dcrCode, string userCode, string status)
        {
            //Data dataObj = new Data();
            string returnValue = string.Empty;
            SqlConnection con = _objData.OpenSqlConnection(companyCode);
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_JOB_UCF_ROLLBACKUNAPPROVEDDOCTORCOUNT);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, dcrCode);
                AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@StatusToBeChanged", ParameterDirection.Input, SqlDbType.VarChar, 1, status);
                //dataObj.OpenConnection();
                //returnValue = dataObj.GetStringValue(companyCode, command);
                command.Connection = con;
                con.Open();
                returnValue = command.ExecuteScalar().ToString();
                con.Close();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                con.Close();
                // dataObj.CloseConnection();
            }
            return returnValue;
        }

        public void InsertDCRApprovalDate(string companyCode, string dcrActualDate)
        {


            //Data dataObj = new Data();
            SqlConnection con = _objData.OpenSqlConnection(companyCode);
            string returnValue = string.Empty;

            try
            {
                SqlCommand command = new SqlCommand(SP_HD_JOB_UCF_INSERT_APPROVED_DATES);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@DCR_Actual_Date", ParameterDirection.Input, SqlDbType.Date, 30, dcrActualDate);
                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                //dataObj.OpenConnection();
                //returnValue = dataObj.GetStringValue(companyCode, command);
                command.Connection = con;
                con.Open();
                returnValue = command.ExecuteScalar().ToString();
                con.Close();

            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                //dataObj.CloseConnection();
                con.Close();
            }
        }

        public int UpdateDCREntityCount(string companyCode, string userCode, string dcrStatus)
        {
            int result = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@UserCode", userCode);
                    p.Add("@DCRStatus", dcrStatus);
                    p.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output);

                    connection.Execute(SP_HDUPDATEDCRENTITYCOUNT, p, commandType: CommandType.StoredProcedure);

                    result = p.Get<int>("@Result");
                    connection.Close();
                }

                return result;
            }
            catch
            {
                throw;
            }
        }

        public string UpdateDCRLeaveStatus(string companyCode, string usercode, string from_date, string to_date, string Activity_Lock, string remarks, string status, string Login_userName)
        {
            string result = string.Empty;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@UserCode", usercode);
                    p.Add("@from_date", from_date);
                    p.Add("@to_date", to_date);
                    p.Add("@Activity_Lock", Activity_Lock);
                    p.Add("@remarks", remarks);
                    p.Add("@DCRStatus", status);
                    p.Add("@Approved_By", Login_userName);
                    p.Add("@Result", "", dbType: DbType.String, direction: ParameterDirection.Output);
                    connection.Execute(SP_HD_UpdateDCRLeaveStatus, p, commandType: CommandType.StoredProcedure);
                    result = p.Get<string>("@Result");
                    connection.Close();
                }

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int UpdateDCRStatus(string companyCode, string flag, string dcrCode, string dcrStatus, string approvedBy, string approvedDate
                                    , string newReason, string callBackCode, string remarksRating)
        {

            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();

                    #region Update DCR
                    const string query = "UPDATE tbl_SFA_DCR_Master SET DCR_Status = @DCR_Status,Approved_By = @Approved_By,Approved_Date = @Approved_Date" +
                                         ",Unapproval_Reason = @Unapproval_Reason,Call_Feedback_Code = @Call_Feedback_Code,Remarks_Rating=@Remarks_Rating" +
                                         " WHERE DCR_Code = @DCR_Code AND Flag = @Flag AND Company_Code = @Company_Code";

                    rowsAffected = connection.Execute(query, new
                    {
                        Company_Code = companyCode,
                        Flag = flag,
                        DCR_Code = dcrCode,
                        DCR_Status = dcrStatus,
                        Approved_By = approvedBy,
                        Approved_Date = approvedDate,
                        Unapproval_Reason = newReason,
                        Call_Feedback_Code = callBackCode,
                        Remarks_Rating = remarksRating,

                    },
                    transaction: trans);
                    #endregion Update DCR

                    trans.Commit();
                    connection.Close();

                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowsAffected;
        }

        public int DeleteDCRExpense(string flag, string dcrCode, string fareDailyAllowance)
        {
            int rowcount = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    #region DeleteDCRExpense
                    var p = new DynamicParameters();
                    p.Add("@DCR_Code", dcrCode);
                    p.Add("@Flag", flag);
                    p.Add("@fareDailyAllowance", fareDailyAllowance);
                    p.Add("@Result", 0, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>("SP_HD_DeleteDCRExpense", p, commandType: CommandType.StoredProcedure);
                    rowcount = p.Get<int>("@Result");
                    connection.Close();

                    #endregion DeleteDCRExpense
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowcount;
        }

        public int UpdateActivityCountAndUserLeaveBalance(string companyCode, string userCode, string dcrDate, string dcrCode, string flag, string dcrStatus)
        {
            int rowsAffected = 0;
            dcrDate = dcrDate.Split('/')[2] + '-' + dcrDate.Split('/')[1] + '-' + dcrDate.Split('/')[0];
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    p.Add("@DCR_Code", dcrCode);
                    p.Add("@FD", dcrDate);
                    p.Add("@Flag", flag);
                    p.Add("@DCR_Status", dcrStatus);
                    connection.Execute(SP_HD_UpdateActivityCount_AND_LeaveBalance_On_Approval, p, commandType: CommandType.StoredProcedure);
                    rowsAffected = 1;
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowsAffected;
        }

        public int CheckExpenseClaim(string companyCode, string userCode, string dcrCode, string flag, string dcrDate)
        {
            int rowcount = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@DCR_Actual_Date", dcrDate);
                    p.Add("@Flag", flag);
                    p.Add("@User_Code", userCode);
                    p.Add("@Result", 0, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>(SP_CHECK_CLAIMFORDCRUNAPPROVE, p, commandType: CommandType.StoredProcedure);
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


        public int InsertUnapproveLock(string companyCode, string userCode, string dcrDate, string lockDate, string flag)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    //   IDbTransaction trans = connection.BeginTransaction();

                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@UserCode", userCode);
                    parameter.Add("@DcrDate", dcrDate);
                    parameter.Add("@DcrFlag", flag);

                    rowsAffected = connection.Query<int>(SP_HD_GETACTIVITYLOCKTYPEFORDCRAPPROVAL, parameter, commandType: CommandType.StoredProcedure).Single();
                    if (rowsAffected > 0)
                    {
                        #region - DCR Lock and move to DCR Lock release history
                        //If any lock relese on that day have to move it to History table and delete it from original table

                        rowsAffected = 0;
                        string query = "INSERT INTO tbl_SFA_DCR_Lock_Release_Log_History" +
                                        "(Logged_Date,Company_Code,User_Code,Locked_Date,Released_Date,Lock_Status,Released_By,Record_Status,Ref_Key1,Ref_Key2" +
                                        ", Lock_Type,Lock_Reason,DCR_Actual_Date,Activiy_Flag,TP_Month,TP_Year)" +
                                        "SELECT GETDATE(),Company_Code,User_Code,Locked_Date,Released_Date,Lock_Status,Released_By,Record_Status,Ref_Key1,Ref_Key2" +
                                        ", Lock_Type,Lock_Reason,DCR_Actual_Date,Activiy_Flag,TP_Month,TP_Year FROM tbl_SFA_DCR_Lock WHERE User_Code = @UserCode AND DCR_Actual_Date=@DcrDate AND Activiy_Flag = @DcrFlag AND Company_Code = @CompanyCode";
                        rowsAffected = connection.Execute(query, new
                        {
                            CompanyCode = companyCode,
                            UserCode = userCode,
                            DcrDate = dcrDate,
                            DcrFlag = flag,
                        });
                        if (rowsAffected > 0)
                        {
                            rowsAffected = 0;
                            string deleteQuery = "DELETE FROM Tbl_sfa_DCR_Lock WHERE User_Code = @UserCode AND DCR_Actual_Date=@DcrDate AND Activiy_Flag = @DcrFlag AND Company_Code = @CompanyCode";
                            rowsAffected = connection.Execute(deleteQuery, new
                            {
                                CompanyCode = companyCode,
                                UserCode = userCode,
                                DcrDate = dcrDate,
                                DcrFlag = flag,
                            });
                        }
                        #endregion - DCR Lock and move to DCR Lock release history
                    }
                    //else
                    //{
                    #region InsertUnapproveLock

                    rowsAffected = 0;

                    string insertQuery = "INSERT INTO tbl_SFA_DCR_Lock" +
                                         "(Company_Code, User_Code, Locked_Date, Lock_Status, Lock_Type, Activiy_Flag" +
                                         ", DCR_Actual_Date, Record_Status)" +
                                         "VALUES(@Company_Code, @User_Code, @Locked_Date, @Lock_Status,@Lock_Type, @Flag" +
                                         ", @DCR_Actual_Date, @Record_Status)";

                    rowsAffected = connection.Execute(insertQuery, new
                    {
                        Company_Code = companyCode,
                        User_Code = userCode,
                        Locked_Date = lockDate,
                        Lock_Status = "LOCKED",
                        Lock_Type = "ACTIVITY_LOCK",
                        Flag = flag,
                        DCR_Actual_Date = dcrDate,
                        Record_Status = "1",
                    });
                    // transaction: trans);
                    #endregion Update DCRInsertUnapproveLock
                    // }
                    //trans.Commit();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowsAffected;
        }

        public double GetLeaveBalance(string companyCode, string userCode, string leaveTypeName)
        {

            double leaveBalance = 0.0;
            int leaveCount = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                    //  string query = "SELECT Count(1) FROM tbl_SFA_User_Leave_CurBalance WHERE Leave_Type_Name=@Leave_Type_Name  AND Is_Active ='1'  AND User_Leave_Status ='0'  AND User_Code=@User_Code";
                    string query = "SELECT Count(1) FROM tbl_SFA_User_Leave_CurBalance LCB INNER JOIN tbl_SFA_Leave_Type_Master LTM ON LCB.Leave_Type_Code=LTM.Leave_Type_Code" +
                                     " WHERE LTM.Leave_Type_Name= @Leave_Type_Name AND User_Code=@User_Code AND User_Leave_Status ='0' AND Is_Active ='1'" +
                                     " AND LCB.Company_Code = @Company_Code";
                    leaveCount = connection.Query<int>(query, new
                    {
                        Company_Code = companyCode,
                        User_Code = userCode,
                        Leave_Type_Name = leaveTypeName,
                    },
                    transaction: trans).Single();

                    // single entry of dcr ---> unapproval update activity Count as '0'
                    if (leaveCount > 0)
                    {
                        // get DCR_ENTRY_UNAPPROVED_ACTIVITY_LOCK value
                        query = "SELECT Leave_Balance FROM tbl_SFA_User_Leave_CurBalance LCB INNER JOIN tbl_SFA_Leave_Type_Master LTM ON LCB.Leave_Type_Code=LTM.Leave_Type_Code" +
                                       " WHERE LTM.Leave_Type_Name= @Leave_Type_Name AND User_Code=@User_Code AND User_Leave_Status ='0' AND Is_Active ='1'" +
                                       " AND LCB.Company_Code = @Company_Code";
                        leaveBalance = connection.Query<double>(query, new
                        {
                            Company_Code = companyCode,
                            User_Code = userCode,
                            Leave_Type_Name = leaveTypeName,
                        },
                        transaction: trans).Single();
                    }
                    trans.Commit();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return leaveBalance;
        }

        public bool InsertRatingParameret(string companyCode, string dcrCode, string flag, List<MVCModels.DCRRatingParameter> lstRatingDetail)
        {
            bool isTrue = false;
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                    // delete MC detail
                    const string deleteQuery = "DELETE FROM tbl_SFA_DCR_Rating WHERE  Company_Code = @Company_Code AND DCR_Code =@DCR_Code AND DCR_Flag =@DCR_Flag";
                    connection.Execute(deleteQuery, new { Company_Code = companyCode, DCR_Code = dcrCode, DCR_Flag = flag },
                                            transaction: trans);


                    const string detailQuery = "INSERT INTO tbl_SFA_DCR_Rating(Company_Code,DCR_Code,Parameter_Code,Rating_Value,DCR_Flag,Remarks) VALUES " +
                        "(@Company_Code,@DCR_Code,@Parameter_Code,@Rating_Value,@DCR_Flag,@Remarks)";
                    rowsAffected = connection.Execute(detailQuery, lstRatingDetail, transaction: trans);
                    trans.Commit();
                    connection.Close();

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

        public string GetTwoActivityDCRApproval(string DCR_Code, string Flag, string fareDailyAllowance)
        {
            //Data dataObj = new Data();
            CurrentInfo _objCurrInfo = new CurrentInfo();
            SqlConnection con = _objData.OpenSqlConnection(_objCurrInfo.GetCompanyCode());
            //SPData _objSPData = new SPData();
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_GetTwoActivityDCR);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Code);
                AddParamToSqlCommand(command, "@Flag", ParameterDirection.Input, SqlDbType.VarChar, Flag.Length, Flag);
                AddParamToSqlCommand(command, "@fareDailyAllowance", ParameterDirection.Input, SqlDbType.VarChar, fareDailyAllowance.Length, fareDailyAllowance);
                AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 8000, "");
                //dataObj.OpenConnection(_objCurrInfo.GetCompanyCode());
                //dataObj.ExecuteScalar(command);
                con.Open();
                command.Connection = con;
                command.ExecuteScalar();
                con.Close();
                if (command.Parameters["@Result"].Value.ToString().Length > 0)
                {
                    return command.Parameters["@Result"].Value.ToString();
                }
                else
                {
                    return "";
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                //dataObj.CloseConnection();
                con.Close();
            }


        }

        public string CheckDayExpenseClaim(string DCR_Code, string flag)
        {
            //Data dataObj = new Data();
            //SPData _objSPData = new SPData();
            CurrentInfo _objCurrInfo = new CurrentInfo();
            SqlConnection con = _objData.OpenSqlConnection(_objCurrInfo.GetCompanyCode());
            string result = string.Empty;
            try
            {
                SqlCommand command = new SqlCommand("SP_HD_checkDayExpenseClaim");
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, DCR_Code);
                AddParamToSqlCommand(command, "@Flag", ParameterDirection.Input, SqlDbType.VarChar, 10, flag);
                //dataObj.OpenConnection(_objCurrInfo.GetCompanyCode());
                //result = Convert.ToString(dataObj.ExecuteScalar(command));
                command.Connection = con;
                con.Open();
                result = Convert.ToString(command.ExecuteScalar());
                con.Close();
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                //dataObj.CloseConnection();
                con.Close();
            }
        }

        // CP APPROVAL

        public DataSet GetAppliedCPRegions(string companyCode, string regionCode)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_GET_APPLIED_CP_USER);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                _objData.OpenConnection();

                DataSet ds = _objData.ExecuteDataSet(command);

                return ds;
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
        public IEnumerable<MVCModels.CampaignPlannerHeader> GetCPHeader(string companyCode, string regionCode, string status)
        {
            IEnumerable<MVCModels.CampaignPlannerHeader> lstCPHeader;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstCPHeader = connection.Query<MVCModels.CampaignPlannerHeader>(SP_GET_CP_HEADER_DETAILS,
                                  new { CompanyCode = companyCode, RegionCode = regionCode, Status = status },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return lstCPHeader;
        }

        public bool UpdateCPStatus(string companyCode, string regionCode, string cpCode, string status, string remarks, string approvedBy, string approvedDate)
        {
            bool isTrue = false;
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();

                    const string query = "update tbl_SFA_Camp_Planner_header set status= @Status,Unapprove_Reason=@Unapprove_Reason,Cp_Approved_By = @Cp_Approved_By,Cp_Approved_Date = @Cp_Approved_Date where Company_Code =  @Company_Code and CP_code=@CP_code AND Region_Code=@Region_Code";

                    rowsAffected = connection.Execute(query, new
                    {
                        Company_Code = companyCode,
                        Region_Code = regionCode,
                        Status = status,
                        CP_Code = cpCode,
                        Unapprove_Reason = remarks,
                        Cp_Approved_By = approvedBy,
                        Cp_Approved_Date = approvedDate
                    },
                     transaction: trans);

                    if (rowsAffected > 0)
                    {
                        isTrue = true;
                    }
                    trans.Commit();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return isTrue;
        }

        public IEnumerable<MVCModels.CampaignPlannerDetails> GetCPDoctors(string companyCode, string cpCode, string regionCode)
        {
            IEnumerable<MVCModels.CampaignPlannerDetails> lstCpDoctor;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstCpDoctor = connection.Query<MVCModels.CampaignPlannerDetails>(SP_GET_CP_LISTED_DOCTOR,
                                  new { CompanyCode = companyCode, CPCode = cpCode, RegionCode = regionCode },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return lstCpDoctor;
        }


        public List<DoctorApprovalCountsModel> GetDoctorApproverMaxCounts(string regionCode)
        {
            List<DoctorApprovalCountsModel> lstDoctorApprovalCounts = new List<DoctorApprovalCountsModel>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@regionCode", regionCode);
                    lstDoctorApprovalCounts = connection.Query<MVCModels.DoctorApprovalCountsModel>(SP_hdGetDoctorApprovedMaxCount, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return lstDoctorApprovalCounts;
        }

        public List<SpecialityDoctorApprovalCountsModel> GetDocSpecialityCounts(string regionCode, string CompanyCode)
        {
            List<SpecialityDoctorApprovalCountsModel> lstDocSpecialityCount = new List<SpecialityDoctorApprovalCountsModel>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", CompanyCode);
                    p.Add("@regionCode", regionCode);
                    lstDocSpecialityCount = connection.Query<MVCModels.SpecialityDoctorApprovalCountsModel>(SP_hdGetApprovedDoctorSpecialityCount, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstDocSpecialityCount;
        }

        public IEnumerable<MVCModels.CampaignPlannerSFC> GetCPSFCDetails(string companyCode, string cpCode, string regionCode)
        {
            IEnumerable<MVCModels.CampaignPlannerSFC> lstCpDoctor;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstCpDoctor = connection.Query<MVCModels.CampaignPlannerSFC>(SP_GET_CP_SFC_DETAILS,
                                  new { CompanyCode = companyCode, CPCode = cpCode, RegionCode = regionCode },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return lstCpDoctor;
        }

        // *******************************************  Secondary Sales Approval ******************************************//

        public IEnumerable<MVCModels.EmployeeDetailModel> GetSecondarySalesHeader(string companyCode, string regionCode, string status, string month, string year)
        {
            IEnumerable<MVCModels.EmployeeDetailModel> lstSSApprovelHeader;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstSSApprovelHeader = connection.Query<MVCModels.EmployeeDetailModel>(SP_HDGETSECONDARYSALESAPPHEADER,
                                  new { CompanyCode = companyCode, RegionCode = regionCode, Status = status, Month = month, Year = year },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return lstSSApprovelHeader;
        }


        public IEnumerable<MVCModels.EmployeeDetailModel> GetSecondarySalesDetails(string companyCode, string regionCode, string status, string month, string year)
        {
            IEnumerable<MVCModels.EmployeeDetailModel> lstSSApprovelHeader;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstSSApprovelHeader = connection.Query<MVCModels.EmployeeDetailModel>(SP_HDGETSECONDARYSALESAPP_DETAILS,
                                  new { CompanyCode = companyCode, RegionCode = regionCode, Status = status, Month = month, Year = year },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return lstSSApprovelHeader;
        }
        public List<MVCModels.SecondarySalesApprovalModel> GetSecondarySalesApprovalTwo(string companyCode, string regionCode, string status, string month, string year, string ss_Code)
        {
            List<MVCModels.SecondarySalesApprovalModel> lst = new List<MVCModels.SecondarySalesApprovalModel>();
            try
            {
                List<MVCModels.EmployeeDetailModel> lstUserDetail = null;
                List<MVCModels.SecondarySalesProductModel> lstssProduct = null;

                using (IDbConnection connection = IDbOpenConnection())
                {
                    using (var multi = connection.QueryMultiple(SP_HDGETSECONDARYSALESAPPROVALTWO,
                                  new { CompanyCode = companyCode, RegionCode = regionCode, Status = status, Month = month, Year = year, ssCode = ss_Code },
                                  commandType: CommandType.StoredProcedure))
                    {
                        lstUserDetail = multi.Read<MVCModels.EmployeeDetailModel>().ToList();
                        lstssProduct = multi.Read<MVCModels.SecondarySalesProductModel>().ToList();
                    }
                }

                MVCModels.SecondarySalesApprovalModel objSS = new MVCModels.SecondarySalesApprovalModel();
                objSS.lstEmployeeDetail = lstUserDetail;
                objSS.lstSecondarySalesProduct = lstssProduct;

                lst.Add(objSS);
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return lst;
        }

        // *******************************************  Wide Angle Approval ******************************************//

        public IEnumerable<MVCModels.EmployeeDetailModel> GetWideAngleHeader(string companyCode, string userCode, string status, string month, string year)
        {
            IEnumerable<MVCModels.EmployeeDetailModel> lstWideAngleApprovelHeader;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstWideAngleApprovelHeader = connection.Query<MVCModels.EmployeeDetailModel>(SP_HDGETWIDEANGLEAPPHEADER,
                                  new { CompanyCode = companyCode, UserCode = userCode, Status = status, Month = month, Year = year },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return lstWideAngleApprovelHeader;
        }

        public bool UpdateWideAngleStatus(string companyCode, string status, string userCode, string requestId, string releasedBy, string releasedDate, string approvedDateFrom, string approvedDateTo, string remarks)
        {
            bool isTrue = false;
            int rowsAffected = 0;
            int header = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();

                    const string query = "UPDATE tbl_SFA_DCR_Restriction SET Request_Status=@Request_Status ,Approved_Date_From=@Approved_Date_From,Approved_Date_To=@Approved_Date_To " +
                           " WHERE Request_Id=@Request_Id  AND User_Code=@User_Code";
                    header = connection.Execute(query, new
                    {
                        Company_Code = companyCode,
                        Request_Status = status,
                        Approved_Date_From = approvedDateFrom,
                        Approved_Date_To = approvedDateTo,
                        Request_Id = requestId,
                        User_Code = userCode,
                    },
                    transaction: trans);
                    if (header > 0)
                    {
                        const string detailQuery = "UPDATE tbl_SFA_DCR_Restriction_Extension SET Released_By=@Released_By ,Released_Date=@Released_Date,Admin_Remarks=@Admin_Remarks  WHERE Request_Id=@Request_Id  ";
                        rowsAffected = connection.Execute(detailQuery, new
                        {
                            Released_By = releasedBy,
                            Released_Date = releasedDate,
                            Admin_Remarks = remarks,
                            Request_Id = requestId,

                        },
                        transaction: trans);
                    }
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
        public IEnumerable<MVCModels.EmployeeDetailModel> GetWideAngleDetails(string companyCode, string userCode, string requestid)
        {
            IEnumerable<MVCModels.EmployeeDetailModel> lstWideAngleApprovelHeader;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstWideAngleApprovelHeader = connection.Query<MVCModels.EmployeeDetailModel>(SP_HDGETWIDEANGLEAPPDETAILS,
                                  new { CompanyCode = companyCode, UserCode = userCode, RequestId = requestid },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return lstWideAngleApprovelHeader;
        }

        #region CpHistory
        /// <summary>
        /// Insert Cp History
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="cpCode"></param>
        /// <param name="categoryName"></param>
        /// <returns></returns>
        public int InsertCpHistory(string companyCode, string regionCode, string cpCode, string categoryName)
        {

            int result = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    p.Add("@CpCode", cpCode);
                    p.Add("@CategoryName", categoryName);
                    p.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output);

                    connection.Execute(SP_INSERTCPHISTORY, p, commandType: CommandType.StoredProcedure);
                    result = p.Get<int>("@Result");
                }

                return result;
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Get Cp History Details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="cpCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.CampaignPlannerHistoryModel> GetCpHistoryDetails(string companyCode, string cpCode, string regionCode)
        {
            List<MVCModels.CampaignPlannerHistoryModel> lstCpHistory = new List<CampaignPlannerHistoryModel>();
            try
            {
                List<CampaignPlannerHeader_History> lstCpHeaderHistory = null;
                List<CampaignPlannerSFC_History> lstCpSFCHistory = null;
                List<CampaignPlannerDetails_History> lstCpDetailsHistory = null;


                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@CpCode", cpCode);
                    parameter.Add("@RegionCode", regionCode);
                    using (var mulitSelect = connection.QueryMultiple(SP_HDGETCPHISTORYDETAILS, parameter, commandType: CommandType.StoredProcedure))
                    {
                        lstCpHeaderHistory = mulitSelect.Read<CampaignPlannerHeader_History>().ToList();
                        lstCpSFCHistory = mulitSelect.Read<CampaignPlannerSFC_History>().ToList();
                        lstCpDetailsHistory = mulitSelect.Read<CampaignPlannerDetails_History>().ToList();
                    }
                }
                MVCModels.CampaignPlannerHistoryModel _objCpHistoryDetails = new MVCModels.CampaignPlannerHistoryModel();
                _objCpHistoryDetails.lstCpHeaderHistory = lstCpHeaderHistory;
                _objCpHistoryDetails.lstCpSFCHistory = lstCpSFCHistory;
                _objCpHistoryDetails.lstCpDetailsHistory = lstCpDetailsHistory;
                lstCpHistory.Add(_objCpHistoryDetails);
            }
            catch
            {
                throw;
            }
            return lstCpHistory;
        }
        #endregion CpHistory
        public int InsertTPHistory(string companyCode, int tpId)
        {

            int result = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@TpId", tpId);
                    p.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output);

                    connection.Execute(SP_hdInsertTPHistory, p, commandType: CommandType.StoredProcedure);

                    result = p.Get<int>("@Result");
                }

                return result;
            }
            catch
            {
                throw;
            }
        }

        public DataSet GetTPHistory(string companyCode, string UserCode, string TP_Date)
        {
            try
            {
                //SqlCommand command = new SqlCommand(SP_hdGetTPHistoryDetails);
                SqlCommand command = new SqlCommand("SP_hdGetTPHistoryDetails_New");
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, UserCode);
                AddParamToSqlCommand(command, "@TP_Date", ParameterDirection.Input, SqlDbType.Date, 12, TP_Date);
                _objData.OpenConnection();

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
        public DataSet GetTPStatusChange(string companyCode, int tpId, string Status, string remarks, string userCode, string userName)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_hdTPStatusChange);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@TpId", ParameterDirection.Input, SqlDbType.Int, 30, tpId);
                AddParamToSqlCommand(command, "@Status", ParameterDirection.Input, SqlDbType.VarChar, 10, Status);
                AddParamToSqlCommand(command, "@Remarks", ParameterDirection.Input, SqlDbType.VarChar, 500, remarks);
                AddParamToSqlCommand(command, "@ApprovedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(command, "@ApprovedByToApprove", ParameterDirection.Input, SqlDbType.VarChar, 30, userName);


                _objData.OpenConnection();

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


        public int GetTPStatusApprovalLockRelease(string companyCode, int tpId, string releaseedBy)
        {

            int result = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@TpId", tpId);
                    p.Add("@Released_By", releaseedBy);

                    p.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output);

                    connection.Execute(SP_hdTPApprovalLockRelease, p, commandType: CommandType.StoredProcedure);

                    result = p.Get<int>("@Result");
                }

                return result;
            }
            catch
            {
                throw;
            }
        }

        #region DCR-Approval History
        /// <summary>
        /// Insert DCR Header History
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="DCRCode"></param>
        /// <returns></returns>
        public int InsertDcrHistory(string companyCode, string DCRCode, string flag)
        {
            int result = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@DCRCode", DCRCode);
                    parameter.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output);
                    parameter.Add("@Flag", flag);
                    connection.Execute(SP_INSERTDCRHISTORY, parameter, commandType: CommandType.StoredProcedure);
                    result = parameter.Get<int>("@Result");
                    connection.Close();
                }
                return result;
            }
            catch
            {
                throw;
            }

        }
        /// <summary>
        /// Get History Details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="dcrCode"></param>
        /// <returns></returns>
        public List<MVCModels.DCRHeaderHistoryModel> GetDCRHistoryDetails(string companyCode, string dcrCode, string userCode)
        {
            List<MVCModels.DCRHeaderHistoryModel> lstDCRHistorydetails = new List<MVCModels.DCRHeaderHistoryModel>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@DcrCode", dcrCode);
                    parameter.Add("@UserCode", userCode);
                    lstDCRHistorydetails = connection.Query<MVCModels.DCRHeaderHistoryModel>(SP_GETDCRAPPROVALHISTORYDETAILS, parameter,
                                      commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
                return lstDCRHistorydetails;
            }
            catch
            {
                throw;
            }
        }
        #endregion DCR-Approval History

        #region - TP Approval
        /// <summary>
        /// Get TP users count
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="flag"></param>
        /// <param name="tpStatus"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <param name="selection"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetTPUsersCount(string companyCode, string userCode, string tpStatus, string month, string year, string selection, string divisionCodes)
        {
            IEnumerable<MVCModels.HiDoctor_Master.UserModel> lstUserList;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstUserList = connection.Query<MVCModels.HiDoctor_Master.UserModel>(SP_HD_GETTPUSERSCOUNTFORTHEMONTH,
                                  new { CompanyCode = companyCode, UserCode = userCode, tpStatus = tpStatus, Month = month, Year = year, Selection = selection, DivisionCode = divisionCodes },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return lstUserList;
        }
        #endregion - TP Approval

        #region - TP in DCR
        /// <summary>
        /// Get Tp details in DCR Approval
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="tpID"></param>
        /// <returns></returns>
        public List<DCRTPDetailsModel> GetDCRTpdeails(string companyCode, int tpID)
        {
            List<DCRTPDetailsModel> lstDCRTpdetails = new List<DCRTPDetailsModel>();
            List<DCRTPHeaderApprovalModel> lstTPHeader = null;
            List<DCRTPSFCDataModel> lstTPSFC = null;
            List<DCRTPDoctorDataModel> lstTpDoctors = null;
            List<DCRTPActivityModel> lstTpActivites = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@TpId", tpID);
                    using (var multiselect = connection.QueryMultiple(SP_HD_GETTPDETAILSINDCRAPPROVAL, parameter, commandType: CommandType.StoredProcedure))
                    {
                        lstTPHeader = multiselect.Read<DCRTPHeaderApprovalModel>().ToList();
                        lstTPSFC = multiselect.Read<DCRTPSFCDataModel>().ToList();
                        lstTpDoctors = multiselect.Read<DCRTPDoctorDataModel>().ToList();
                        lstTpActivites = multiselect.Read<DCRTPActivityModel>().ToList();
                    }
                }
                DCRTPDetailsModel _objData = new DCRTPDetailsModel();
                _objData.lstTPHeader = lstTPHeader;
                _objData.lstTPSFC = lstTPSFC;
                _objData.lstTpDoctors = lstTpDoctors;
                _objData.lstTpActivities = lstTpActivites;
                lstDCRTpdetails.Add(_objData);
            }
            catch
            {
                throw;
            }
            return lstDCRTpdetails;
        }
        #endregion - TP in DCR

        #region DCR Freeze Screen

        public IEnumerable<MVCModels.DCRFreezeUsersModel> GetDcrFreezeReleaseUsers(DCRFreezeInputs objInputs)
        {
            IEnumerable<MVCModels.DCRFreezeUsersModel> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", objInputs.Company_Code);
                    p.Add("@User_Code", objInputs.User_Code);
                    p.Add("@DivisionCode", objInputs.DivisionCode);
                    p.Add("@Month", objInputs.Month);
                    p.Add("@Year", objInputs.Year);
                    lstContent = connection.Query<MVCModels.DCRFreezeUsersModel>("SP_HD_GetDcrFreezeReleaseUsers", p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("DivisionCode", objInputs.DivisionCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }

        public IEnumerable<MVCModels.DCRUNFreezeModel> GetDcrFreezeReleaseApproval(DCRFreezeInputs objInputs)
        {
            IEnumerable<MVCModels.DCRUNFreezeModel> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Code", objInputs.User_Code);
                    p.Add("@Month", objInputs.Month);
                    p.Add("@Year", objInputs.Year);
                    lstContent = connection.Query<MVCModels.DCRUNFreezeModel>("SP_HD_GetDcrFreezeReleaseApproval", p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("User_Code", objInputs.User_Code);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }
        public IEnumerable<MVCModels.DCRUNFreezeModel> GetDcrFreezeReleasedApprovalData(DCRFreezeInputs objInputs)
        {
            IEnumerable<MVCModels.DCRUNFreezeModel> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Code", objInputs.User_Code);
                    p.Add("@Month", objInputs.Month);
                    p.Add("@Year", objInputs.Year);
                    lstContent = connection.Query<MVCModels.DCRUNFreezeModel>("SP_HD_GetDcrFreezeReleasedApprovalData", p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("User_Code", objInputs.User_Code);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }
        public string SetDCRFreezeReleaseApproval(List<DCRUNFreezeModel> lstDCRFreezeModel)
        {
            int rowsAffected = 0;
            string strResult = "Failure";
            using (IDbConnection connection = IDbOpenConnection())
            {
                IDbTransaction trans = connection.BeginTransaction();
                try
                {
                    const string query = "INSERT INTO tbl_sfa_DCR_UN_Freeze (User_Code,TP_Date,project_code,Created_Date,Created_By,Company_Code,Request_Released_By,Released_Reason,Company_Id)VALUES(@User_Code,@TP_Date,@Activity_Code,GETDATE(),@created_by,@Company_Code,@Request_UserCode,@Remark,@Company_Id)";
                    rowsAffected = connection.Execute(query, lstDCRFreezeModel, transaction: trans);
                    trans.Commit();

                    if (rowsAffected > 0)
                    {
                        strResult = "SUCCESS";
                    }
                }
                catch (Exception ex)
                {
                    trans.Rollback();
                    throw ex;
                }
            }

            return strResult;
        }
        #endregion


        /************************************************* Secondary Sales Entry Screen Methods**************************************/
        #region SS_Entry_Approval
        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public List<SSUserListModel> GetUsersByRegion(string companyCode, string regionCode)
        {
            List<SSUserListModel> lstuserdet = null;
            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    lstuserdet = conn.Query<SSUserListModel>(SP_HD_SS_GETUSERLISTOFAREGION, p, commandType: CommandType.StoredProcedure).ToList();
                    conn.Close();
                }
            }
            catch (Exception)
            {

                throw;
            }
            return lstuserdet;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <returns></returns>
        public List<MVCModels.StockiestData> GetSSStockistBasedOnInput(string companyCode, string regionCode, int month, int year)
        {
            List<StockiestData> lstSSStockist = null;
            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    p.Add("@Month", month);
                    p.Add("@Year", year);
                    lstSSStockist = conn.Query<StockiestData>(SP_HD_SS_GETSSSTOCKISTBASEDONINPUTS, p, commandType: CommandType.StoredProcedure).ToList();
                    conn.Close();
                }

            }
            catch (Exception ex)
            {

                throw;
            }
            return lstSSStockist;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <returns></returns>
        public List<PreviousSSDetailsModel> GetSSDetailsForSelectedRegion(string companyCode, string regionCode, int month, int year)
        {
            List<PreviousSSDetailsModel> lstSSDet = null;
            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    p.Add("@Month", month);
                    p.Add("@Year", year);
                    lstSSDet = conn.Query<PreviousSSDetailsModel>(SP_HD_SS_GETSECONDARYSALESDETAILS, p, commandType: CommandType.StoredProcedure).ToList();
                    conn.Close();
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return lstSSDet;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="RegionCode"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <param name="statementDate"></param>
        /// <param name="ssCode"></param>
        /// <returns></returns>
        public List<MVCModels.SS_ProductsDetailedView> GetSSDetailsForSelectedRecord(string companyCode, string RegionCode, string month, string year, string statementDate, string ssCode)
        {
            List<SS_ProductsDetailedView> lstSSDetailedView = null;
            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    string cmdText = "sp_hdGetSelectedSS";
                    SqlCommand command = new SqlCommand(cmdText);
                    command.CommandType = CommandType.StoredProcedure;

                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", RegionCode);
                    p.Add("@Month", month);
                    p.Add("@Year", year);
                    p.Add("@StatementDate", statementDate);
                    p.Add("@SSCode", ssCode);
                    lstSSDetailedView = conn.Query<SS_ProductsDetailedView>(SP_HDGETSELECTEDSS, p, commandType: CommandType.StoredProcedure).ToList();
                    conn.Close();
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return lstSSDetailedView;

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="customerCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="prevmonth"></param>
        /// <param name="prevyear"></param>
        /// <param name="datebyMonth"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <returns></returns>
        public PriceGroupMain GetPriceforSecondarySales(string companyCode, string customerCode, string regionCode, string prevmonth, string prevyear, string datebyMonth, string month, string year)
        {
            PriceGroupMain _objSSmainprice = new PriceGroupMain();
            try
            {
                List<PriceGroupModelSS> lstprice = null;
                List<PriceTypeModel> lstStckstCount = null;
                List<PriceTypeModel> lstpricetype = null;
                List<PriceTypeModel> lstinher = null;
                List<PriceTypeModel> lstcount = null;
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Customer_Code", customerCode);
                    p.Add("@Region_Code", regionCode);
                    p.Add("@Month", prevmonth);
                    p.Add("@Year", prevyear);
                    p.Add("@StartDate", datebyMonth);
                    p.Add("@CurrentMonth", month);
                    p.Add("@CurrentYear", year);
                    using (var multiselect = conn.QueryMultiple(SP_HD_SS_GetSSPriceGorup, p, commandType: CommandType.StoredProcedure))
                    {
                        lstprice = multiselect.Read<PriceGroupModelSS>().ToList();
                        lstpricetype = multiselect.Read<PriceTypeModel>().ToList();
                        lstStckstCount = multiselect.Read<PriceTypeModel>().ToList();
                        lstcount = multiselect.Read<PriceTypeModel>().ToList();
                        lstinher = multiselect.Read<PriceTypeModel>().ToList();

                    }
                    conn.Close();
                }
                _objSSmainprice.lstPricegrpSS = lstprice;
                _objSSmainprice.lstgrpType = lstpricetype;
                _objSSmainprice.lstCheck = lstStckstCount;
                _objSSmainprice.lstisAvail = lstcount;
                _objSSmainprice.lststckstinhertd = lstinher;
            }
            catch (Exception ex)
            {

                throw;
            }
            return _objSSmainprice;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="customerCode"></param>
        /// <returns></returns>
        public SSProdPriceModelMain GetProductsBasedonStockist(string companyCode, string regionCode, string customerCode)//,int month,int year)
        {
            SSProdPriceModelMain _objProdPric = new SSProdPriceModelMain();
            try
            {
                List<SSProductModel> lstprod = null;
                List<SSOpeningBalModel> lstOpeBal = null;
                List<SSProductPriceModel> lstprice = null;
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    p.Add("@CustomerCode", customerCode);
                    //p.Add("@Month", month);
                    //p.Add("@Year", year);
                    using (var multi = conn.QueryMultiple(SP_HD_SS_GETPRODUCTSBASEDONSTOCKIST, p, commandType: CommandType.StoredProcedure))
                    {
                        lstprod = multi.Read<SSProductModel>().ToList();
                        lstOpeBal = multi.Read<SSOpeningBalModel>().ToList();
                        lstprice = multi.Read<SSProductPriceModel>().ToList();

                    }
                    conn.Close();
                    _objProdPric.lstProdDet = lstprod;
                    _objProdPric.lstOpnBal = lstOpeBal;
                    _objProdPric.lstProdPrice = lstprice;

                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return _objProdPric;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="customerCode"></param>
        /// <returns></returns>
        public List<DynamicColumnsInfo> GetCountofSSFortheSelectedStockiest(string companyCode, string customerCode)
        {
            List<DynamicColumnsInfo> lstSSEntr = null;
            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@CustomerCode", customerCode);
                    lstSSEntr = conn.Query<DynamicColumnsInfo>(SP_HD_SS_GETSELECTEDSTOCKISTSSENTRIESCOUNT, p, commandType: CommandType.StoredProcedure).ToList();
                    conn.Close();
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return lstSSEntr;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <returns></returns>
        public List<DynamicColumnsSS> GetDynamicColumnsForSS(string companyCode, int month, int year)
        {
            List<DynamicColumnsSS> lstDynSS = null;
            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@Month", month);
                    p.Add("@Year", year);
                    lstDynSS = conn.Query<DynamicColumnsSS>(SP_HD_SS_GETDYNAMICCOLUMNSSS, p, commandType: CommandType.StoredProcedure).ToList();
                    conn.Close();
                }

            }
            catch (Exception ex)
            {

                throw;
            }
            return lstDynSS;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="ssdetailCode"></param>
        /// <returns></returns>
        public List<DynamicColumnsInfo> GetDynamicColumnsInfo(string companyCode, int ssdetailCode)
        {
            List<DynamicColumnsInfo> lstDynSS = null;
            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@SS_Detail_Code", ssdetailCode);
                    lstDynSS = conn.Query<DynamicColumnsInfo>(SP_HD_SS_GETDYNAMICCOLUMSINFO, p, commandType: CommandType.StoredProcedure).ToList();
                    conn.Close();
                }

            }
            catch (Exception ex)
            {

                throw;
            }
            return lstDynSS;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="createdBy"></param>
        /// <param name="ObjSSDetails"></param>
        /// <param name="dsProd"></param>
        /// <param name="dsDynaDet"></param>
        /// <returns></returns>
        public string InsertSecondarySalesDraft(string companyCode, string createdBy, SSMainModel ObjSSDetails, DataTable dsProd, DataTable dsDynaDet)
        {
            string result = null;
            try
            {

                string cmdTxt = "SP_HD_SS_InsertSSDraftDetails";
                SqlCommand command = new SqlCommand(cmdTxt);
                command.CommandType = CommandType.StoredProcedure;


                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, ObjSSDetails.Region_Code);
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 100, ObjSSDetails.User_Code);
                _objSPData.AddParamToSqlCommand(command, "@Base_Code", ParameterDirection.Input, SqlDbType.VarChar, 100, ObjSSDetails.Base_Code);
                _objSPData.AddParamToSqlCommand(command, "@Base_Type", ParameterDirection.Input, SqlDbType.VarChar, 100, ObjSSDetails.Base_Type);
                _objSPData.AddParamToSqlCommand(command, "@SS_Statement_Date", ParameterDirection.Input, SqlDbType.VarChar, 100, ObjSSDetails.SS_Statement_Date);
                _objSPData.AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.Int, 16, ObjSSDetails.Month);
                _objSPData.AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.Int, 16, ObjSSDetails.Year);
                _objSPData.AddParamToSqlCommand(command, "@Created_By", ParameterDirection.Input, SqlDbType.VarChar, 30, createdBy);
                _objSPData.AddParamToSqlCommand(command, "@SS_Approval_Status", ParameterDirection.Input, SqlDbType.Char, 10, "3");
                _objSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 30, "");

                if (dsProd.Rows.Count > 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_SS_Product_Details", ParameterDirection.Input, SqlDbType.Structured, dsProd, "TVP_SS_Product_Details");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_SS_Product_Details", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_SS_Product_Details");
                }
                if (dsDynaDet.Rows.Count > 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_SS_Dynamic_Details", ParameterDirection.Input, SqlDbType.Structured, dsDynaDet, "TVP_SS_Dynamic_Details");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_SS_Dynamic_Details", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_SS_Dynamic_Details");
                }
                _objData.OpenConnection();
                _objData.ExecuteNonQuery(command);
                result = command.Parameters["@Result"].Value.ToString();
            }
            catch (Exception ex)
            {

                throw;
            }
            return result;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="createdBy"></param>
        /// <param name="ObjSSDetails"></param>
        /// <param name="dsProd"></param>
        /// <param name="dsDynaDet"></param>
        /// <returns></returns>
        public string UpdateSecondarySalesDraft(string companyCode, string createdBy, SSMainModel ObjSSDetails, DataTable dsProd, DataTable dsDynaDet)
        {
            string result = null;
            try
            {

                string cmdTxt = "SP_HD_SS_UpdateSSDraftDetails";
                SqlCommand command = new SqlCommand(cmdTxt);
                command.CommandType = CommandType.StoredProcedure;


                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, ObjSSDetails.Region_Code);
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 100, ObjSSDetails.User_Code);
                _objSPData.AddParamToSqlCommand(command, "@Base_Code", ParameterDirection.Input, SqlDbType.VarChar, 100, ObjSSDetails.Base_Code);
                _objSPData.AddParamToSqlCommand(command, "@Base_Type", ParameterDirection.Input, SqlDbType.VarChar, 100, ObjSSDetails.Base_Type);
                _objSPData.AddParamToSqlCommand(command, "@SS_Statement_Date", ParameterDirection.Input, SqlDbType.VarChar, 100, ObjSSDetails.SS_Statement_Date);
                _objSPData.AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.Int, 16, ObjSSDetails.Month);
                _objSPData.AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.Int, 16, ObjSSDetails.Year);
                _objSPData.AddParamToSqlCommand(command, "@Created_By", ParameterDirection.Input, SqlDbType.VarChar, 30, createdBy);
                _objSPData.AddParamToSqlCommand(command, "@SS_Code", ParameterDirection.Input, SqlDbType.VarChar, 100, ObjSSDetails.SS_Code);
                _objSPData.AddParamToSqlCommand(command, "@SS_Approval_Status", ParameterDirection.Input, SqlDbType.Char, 10, ObjSSDetails.SS_Approval_Status);
                _objSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 30, "");
                if (dsProd.Rows.Count > 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_SS_Product_Details", ParameterDirection.Input, SqlDbType.Structured, dsProd, "TVP_SS_Product_Details");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_SS_Product_Details", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_SS_Product_Details");
                }
                if (dsDynaDet.Rows.Count > 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_SS_Dynamic_Details", ParameterDirection.Input, SqlDbType.Structured, dsDynaDet, "TVP_SS_Dynamic_Details");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_SS_Dynamic_Details", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_SS_Dynamic_Details");
                }
                _objData.OpenConnection();
                _objData.ExecuteNonQuery(command);
                result = command.Parameters["@Result"].Value.ToString();
            }
            catch (Exception ex)
            {

                throw;
            }
            return result;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="createdBy"></param>
        /// <param name="ObjSSDetails"></param>
        /// <param name="dsProd"></param>
        /// <param name="dsDynaDet"></param>
        /// <returns></returns>
        public string InsertSecondarySalesSubmit(string companyCode, string createdBy, SSMainModel ObjSSDetails, DataTable dsProd, DataTable dsDynaDet)
        {
            string result = null;
            try
            {

                string cmdTxt = "SP_HD_SS_InsertSSDraftDetails";
                SqlCommand command = new SqlCommand(cmdTxt);
                command.CommandType = CommandType.StoredProcedure;


                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, ObjSSDetails.Region_Code);
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 100, ObjSSDetails.User_Code);
                _objSPData.AddParamToSqlCommand(command, "@Base_Code", ParameterDirection.Input, SqlDbType.VarChar, 100, ObjSSDetails.Base_Code);
                _objSPData.AddParamToSqlCommand(command, "@Base_Type", ParameterDirection.Input, SqlDbType.VarChar, 100, ObjSSDetails.Base_Type);
                _objSPData.AddParamToSqlCommand(command, "@SS_Statement_Date", ParameterDirection.Input, SqlDbType.VarChar, 100, ObjSSDetails.SS_Statement_Date);
                _objSPData.AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.Int, 16, ObjSSDetails.Month);
                _objSPData.AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.Int, 16, ObjSSDetails.Year);
                _objSPData.AddParamToSqlCommand(command, "@Created_By", ParameterDirection.Input, SqlDbType.VarChar, 30, createdBy);
                _objSPData.AddParamToSqlCommand(command, "@SS_Approval_Status", ParameterDirection.Input, SqlDbType.VarChar, 100, ObjSSDetails.SS_Approval_Status);
                _objSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 30, "");
                if (dsProd.Rows.Count > 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_SS_Product_Details", ParameterDirection.Input, SqlDbType.Structured, dsProd, "TVP_SS_Product_Details");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_SS_Product_Details", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_SS_Product_Details");
                }
                if (dsDynaDet.Rows.Count > 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_SS_Dynamic_Details", ParameterDirection.Input, SqlDbType.Structured, dsDynaDet, "TVP_SS_Dynamic_Details");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_SS_Dynamic_Details", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_SS_Dynamic_Details");
                }
                _objData.OpenConnection();
                _objData.ExecuteNonQuery(command);
                result = command.Parameters["@Result"].Value.ToString();
            }
            catch (Exception ex)
            {

                throw;
            }
            return result;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="createdBy"></param>
        /// <param name="ObjSSDetails"></param>
        /// <param name="dsProd"></param>
        /// <param name="dsDynaDet"></param>
        /// <returns></returns>
        public string UpdateSecondarySalesSubmit(string companyCode, string createdBy, SSMainModel ObjSSDetails, DataTable dsProd, DataTable dsDynaDet)
        {
            string result = null;
            try
            {

                string cmdTxt = "SP_HD_SS_UpdateSSDraftDetails";
                SqlCommand command = new SqlCommand(cmdTxt);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, ObjSSDetails.Region_Code);
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 100, ObjSSDetails.User_Code);
                _objSPData.AddParamToSqlCommand(command, "@Base_Code", ParameterDirection.Input, SqlDbType.VarChar, 100, ObjSSDetails.Base_Code);
                _objSPData.AddParamToSqlCommand(command, "@Base_Type", ParameterDirection.Input, SqlDbType.VarChar, 100, ObjSSDetails.Base_Type);
                _objSPData.AddParamToSqlCommand(command, "@SS_Statement_Date", ParameterDirection.Input, SqlDbType.VarChar, 100, ObjSSDetails.SS_Statement_Date);
                _objSPData.AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.Int, 16, ObjSSDetails.Month);
                _objSPData.AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.Int, 16, ObjSSDetails.Year);
                _objSPData.AddParamToSqlCommand(command, "@Created_By", ParameterDirection.Input, SqlDbType.VarChar, 30, createdBy);
                _objSPData.AddParamToSqlCommand(command, "@SS_Code", ParameterDirection.Input, SqlDbType.VarChar, 100, ObjSSDetails.SS_Code);
                _objSPData.AddParamToSqlCommand(command, "@SS_Approval_Status", ParameterDirection.Input, SqlDbType.Char, 10, ObjSSDetails.SS_Approval_Status);
                _objSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 30, "");
                if (dsProd.Rows.Count > 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_SS_Product_Details", ParameterDirection.Input, SqlDbType.Structured, dsProd, "TVP_SS_Product_Details");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_SS_Product_Details", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_SS_Product_Details");
                }
                if (dsDynaDet.Rows.Count > 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_SS_Dynamic_Details", ParameterDirection.Input, SqlDbType.Structured, dsDynaDet, "TVP_SS_Dynamic_Details");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_SS_Dynamic_Details", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_SS_Dynamic_Details");
                }
                _objData.OpenConnection();
                _objData.ExecuteNonQuery(command);
                result = command.Parameters["@Result"].Value.ToString();
            }
            catch (Exception ex)
            {

                throw;
            }
            return result;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <param name="ssCode"></param>
        /// <param name="ssStatementDate"></param>
        /// <param name="createdBy"></param>
        /// <returns></returns>
        public SSDetailsMainEdit GetSecondarySalesEditDetails(string companyCode, string regionCode, int month, int year, string ssCode, string ssStatementDate, string createdBy)
        {
            SSDetailsMainEdit _objSSEdit = new SSDetailsMainEdit();
            try
            {
                List<SSMainModelforEdit> lsthdr = null;
                List<SSDetailsModel> lstdet = null;
                List<DynamicColumnsInfo> lstdyna = null;
                List<DynamicColumnsSS> lstdynacol = null;
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    p.Add("@Month", month);
                    p.Add("@Year", year);
                    p.Add("@SSCode", ssCode);
                    //p.Add("@BaseCode", baseCode);
                    p.Add("@SSStatementDate", ssStatementDate);
                    using (var multiselect = conn.QueryMultiple(SP_HD_SS_GETSSDETAILSFOREDIT, p, commandType: CommandType.StoredProcedure))
                    {
                        lsthdr = multiselect.Read<SSMainModelforEdit>().ToList();
                        lstdet = multiselect.Read<SSDetailsModel>().ToList();
                        lstdyna = multiselect.Read<DynamicColumnsInfo>().ToList();
                        lstdynacol = multiselect.Read<DynamicColumnsSS>().ToList();
                    }
                    conn.Close();
                    _objSSEdit.lstHeader = lsthdr;
                    _objSSEdit.lstDetails = lstdet;
                    _objSSEdit.lstDynaDet = lstdyna;
                    _objSSEdit.lstDynaCol = lstdynacol;
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return _objSSEdit;
        }

        //Method Not Used
        public List<SSUserListModel> GetPrivilegesBasedOnSelection(string companyCode, string regionCode, string userCode, string usertypeCode)
        {
            List<SSUserListModel> lstpriv = null;
            string result = "";
            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@UserTypeCode", usertypeCode);
                    p.Add("@UserCode", userCode);
                    p.Add("@Result", "", DbType.String, ParameterDirection.Output, 500);
                    lstpriv = conn.Query<SSUserListModel>(SP_HDGETPRIVILEGEMAPPING, p, commandType: CommandType.StoredProcedure).ToList();
                    result = p.Get<string>("@Result");
                    conn.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstpriv;
        }
        #endregion
        /****************************************************************************************************************************/

        /************************************************* Secondary Sales Delete Screen Methods*************************************/

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="IncludeClosedStockiest"></param>
        /// <returns></returns>
        public List<StockiestData> GetSSStockiestDetails(string companyCode, string regionCode, int IncludeClosedStockiest, int month, int year)
        {
            List<StockiestData> lstStockiest = null;
            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {

                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    p.Add("@IncludeClosedStockiest", IncludeClosedStockiest);
                    p.Add("@Month", month);
                    p.Add("@Year", year);
                    lstStockiest = conn.Query<StockiestData>(SP_HDGETSTOCKIEST, p, commandType: CommandType.StoredProcedure).ToList();
                    conn.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstStockiest;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="stockiestCode"></param>
        /// <param name="mode"></param>
        /// <returns></returns>
        public List<StockiestEntryDetailsDelete> GetListSecondarySalesForDelete(string companyCode, string regionCode, string stockiestCode, string mode)
        {
            List<StockiestEntryDetailsDelete> lstStockiestEntryDet = null;
            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {

                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Region_Code", regionCode);
                    p.Add("@Stockiest_Code", stockiestCode);
                    p.Add("@Mode", mode);
                    lstStockiestEntryDet = conn.Query<StockiestEntryDetailsDelete>(SP_HDGETDELETESECONDARYSALESDETAIL, p, commandType: CommandType.StoredProcedure).ToList();
                    conn.Close();
                }

            }
            catch (Exception ex)
            {

                throw;
            }
            return lstStockiestEntryDet;
        }

        public bool UnapprovedSecondarySale(string companyCode, List<SSMainModelforEdit> lstDet, DataTable dtDel, string updatedBy, int status)
        {
            bool isTrue = false;
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_SS_UNAPPROVESECONDARYSALES);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Status", ParameterDirection.Input, SqlDbType.Int, 16, status);
                _objSPData.AddParamToSqlCommand(command, "@UpdatedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, updatedBy);
                if (dtDel.Rows.Count > 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_SS_ApprovalStatus_Change", ParameterDirection.Input, SqlDbType.Structured, dtDel, "TVP_SS_ApprovalStatus_Change");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_SS_ApprovalStatus_Change", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_SS_ApprovalStatus_Change");
                }
                _objSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Input, SqlDbType.VarChar, 30, result);
                _objData.OpenConnection();
                _objData.ExecuteNonQuery(command);
                result = command.Parameters["@Result"].Value.ToString();
                isTrue = true;

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return isTrue;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="ssCode"></param>
        /// <param name="status"></param>
        /// <param name="customerCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="remarks"></param>
        /// <param name="isInherited"></param>
        /// <returns></returns>
        public bool DeletedsecondarySale(string companyCode, List<SSMainModelforEdit> lstDet, DataTable dtDel, string updatedBy, int status)
        {
            bool isTrue = false;
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_SS_DELETESECONDARYSALES);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Status", ParameterDirection.Input, SqlDbType.Int, 16, status);
                _objSPData.AddParamToSqlCommand(command, "@UpdatedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, updatedBy);
                if (dtDel.Rows.Count > 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_SS_ApprovalStatus_Change", ParameterDirection.Input, SqlDbType.Structured, dtDel, "TVP_SS_ApprovalStatus_Change");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_SS_ApprovalStatus_Change", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_SS_ApprovalStatus_Change");
                }
                _objSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Input, SqlDbType.VarChar, 30, result);
                _objData.OpenConnection();
                _objData.ExecuteNonQuery(command);
                result = command.Parameters["@Result"].Value.ToString();
                isTrue = true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return isTrue;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <returns></returns>
        public int UpdateSSPendingApprovalLock(string companyCode, string regionCode, string month, string year)
        {
            int result = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    p.Add("@Month", month);
                    p.Add("@Year", year);
                    p.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output);

                    connection.Execute(SP_hdUpdateSS_Manager_Lock, p, commandType: CommandType.StoredProcedure);

                    result = p.Get<int>("@Result");
                    connection.Close();
                }
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        /****************************************************************************************************************************/


        /******************************************Secondary Sales Approval Screen Methods*******************************************/
        /// <summary>
        /// to get the regions with user details.
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <param name="status"></param>
        /// <param name="regionSelection"></param>
        /// <param name="customerType"></param>
        /// <returns></returns>
        public List<GetSSRegion> GetRegionsWithUserDetails(string companyCode, string regionCode, int month, int year, int status, string regionSelection, string customerType)
        {
            List<GetSSRegion> lstRegion = null;
            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    p.Add("@Month", month);
                    p.Add("@Year", year);
                    p.Add("@Status", status);
                    p.Add("@Region_SelectionType", regionSelection);
                    p.Add("@Customer_Entity_Type", customerType);
                    lstRegion = conn.Query<GetSSRegion>(SP_HD_SS_GetSSDetailsofSelectedInputs, p, commandTimeout: 0, commandType: CommandType.StoredProcedure).ToList();
                    conn.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstRegion;
        }
        //public List<GetSSRegion> GetUserinaRegion(string companyCode, string regionCode)
        //{
        //    List<GetSSRegion> lstUsersinaRegion = null;
        //    try
        //    {
        //        using (IDbConnection conn = IDbOpenConnection())
        //        {
        //            var p = new DynamicParameters();
        //            p.Add("@CompanyCode", companyCode);
        //            p.Add("@RegionCode", regionCode);
        //            lstUsersinaRegion = conn.Query<GetSSRegion>(SP_HD_SS_GetUsersinaRegion, p, commandType: CommandType.StoredProcedure).ToList();
        //            conn.Close();
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        throw;
        //    }
        //    return lstUsersinaRegion;
        //}
        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        /// 

        public List<TotalSSDetails> GetTotalSSDetailsForMonth(string companyCode, string regionCode, int month, int year, int status, int Mode, string selectionOrLoad)
        {
            List<TotalSSDetails> lstSSDetails = null;
            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@companyCode", companyCode);
                    p.Add("@regionCode", regionCode);
                    p.Add("@Month", month);
                    p.Add("@Year", year);
                    p.Add("@Status", status);
                    p.Add("@Mode", Mode);
                    p.Add("@TypeOfLoad", selectionOrLoad);
                    lstSSDetails = conn.Query<TotalSSDetails>(SP_HD_SS_SecondarySalesApprovalDetails, p, commandTimeout: 0, commandType: CommandType.StoredProcedure).ToList();
                    conn.Close();
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return lstSSDetails;
        }

        public List<SecondarySalesDetailsView> GetSSDetailsView(string companyCode, string regionCode, int month, int year, int status, int Mode, string selectionOrLoad)
        {
            List<SecondarySalesDetailsView> lstSSDetailsView = null;
            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@companyCode", companyCode);
                    p.Add("@regionCode", regionCode);
                    p.Add("@Month", month);
                    p.Add("@Year", year);
                    p.Add("@Status", status);
                    p.Add("@Mode", Mode);
                    p.Add("@@TypeOfLoad", selectionOrLoad);
                    lstSSDetailsView = conn.Query<SecondarySalesDetailsView>(sp_hd_ShowSSDetails, p, commandTimeout: 0, commandType: CommandType.StoredProcedure).ToList();
                    conn.Close();
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return lstSSDetailsView;
        }



        public List<SecondarySalesApprovalHeaderModel> GetSSDetailsForAMonth(string companyCode, string regionCode, int month, int year, int status, string Currentregcode)
        {
            List<SecondarySalesApprovalHeaderModel> lstSSheader = null;
            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    p.Add("@Month", month);
                    p.Add("@Year", year);
                    p.Add("@StatusMode", status);
                    p.Add("@CurrenRegioncode", Currentregcode);
                    lstSSheader = conn.Query<SecondarySalesApprovalHeaderModel>(SP_HD_SS_GETSSDETAILSOFSELREGION, p, commandType: CommandType.StoredProcedure).ToList();
                    conn.Close();
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return lstSSheader;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <param name="customerCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public bool CheckSecondarySalesMonth(string companyCode, string month, string year, string customerCode, string regionCode)
        {
            bool isTrue = false;
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();


                    string query = "SELECT COUNT(1) FROM tbl_SFA_SecondarySales_Header WHERE Company_Code = @Company_Code  AND Base_Code =@Customer_Code " +
                                   " AND Region_Code=@Region_Code AND Year=@Year AND Month =@Month  AND SS_Status IN(1,0) ";
                    rowsAffected = connection.Query<int>(query, new
                    {
                        Company_Code = companyCode,
                        Month = month,
                        Year = year,
                        Customer_Code = customerCode,
                        Region_Code = regionCode
                    },
                    transaction: trans).Single();
                    trans.Commit();
                    //if (rowsAffected > 0)
                    //{
                    //    UpdateUnapprovedStatusSecondarySales(companyCode, year + "-" + month + "-01", customerCode, regionCode);
                    //    isTrue = true;
                    //}
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return isTrue;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="ssCode"></param>
        /// <param name="status"></param>
        /// <param name="remarks"></param>
        /// <param name="approvedBy"></param>
        /// <param name="approvedDate"></param>
        /// <param name="customerCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public bool UpdateSecondarySalesStatus(string companyCode, List<SSMainModelforEdit> lstDet, DataTable dtDel, string updatedBy, int status)
        {
            bool isTrue = false;
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_SS_UNAPPROVESECONDARYSALES);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Status", ParameterDirection.Input, SqlDbType.Int, 16, status);
                _objSPData.AddParamToSqlCommand(command, "@UpdatedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, updatedBy);
                if (dtDel.Rows.Count > 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_SS_ApprovalStatus_Change", ParameterDirection.Input, SqlDbType.Structured, dtDel, "TVP_SS_ApprovalStatus_Change");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_SS_ApprovalStatus_Change", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_SS_ApprovalStatus_Change");
                }
                _objSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Input, SqlDbType.VarChar, 30, result);
                _objData.OpenConnection();
                _objData.ExecuteNonQuery(command);
                result = command.Parameters["@Result"].Value.ToString();
                isTrue = true;
                _objData.CloseConnection();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return isTrue;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="startDate"></param>
        /// <param name="customerCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public bool UpdateUnapprovedStatusSecondarySales(string companyCode, List<SSMainModelforEdit> lstDet, DataTable dtDel, string updatedBy, int status)
        {
            bool isTrue = false;
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_SS_UNAPPROVESECONDARYSALES);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Status", ParameterDirection.Input, SqlDbType.Int, 16, status);
                _objSPData.AddParamToSqlCommand(command, "@UpdatedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, updatedBy);
                if (dtDel.Rows.Count > 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_SS_ApprovalStatus_Change", ParameterDirection.Input, SqlDbType.Structured, dtDel, "TVP_SS_ApprovalStatus_Change");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_SS_ApprovalStatus_Change", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_SS_ApprovalStatus_Change");
                }
                _objSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Input, SqlDbType.VarChar, 30, result);
                _objData.OpenConnection();
                _objData.ExecuteNonQuery(command);
                result = command.Parameters["@Result"].Value.ToString();
                isTrue = true;
                _objData.CloseConnection();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return isTrue;
        }

        public bool CascadeSecondarySalesDetails(string companyCode, int SS_Code, string Base_Code)
        {
            bool isTrue = false;
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_SS_CascadeSecondarySales);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@SS_Code", ParameterDirection.Input, SqlDbType.Int, 8, SS_Code);
                _objSPData.AddParamToSqlCommand(command, "@Base_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, Base_Code);
                _objSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Input, SqlDbType.VarChar, 30, result);
                _objData.OpenConnection();
                _objData.ExecuteNonQuery(command);
                result = command.Parameters["@Result"].Value.ToString();
                isTrue = true;
                _objData.CloseConnection();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return isTrue;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="ssCode"></param>
        /// <returns></returns>
        public List<SSRemarksModel> GetSSRemarksHistory(string companyCode, string regionCode, string ssCode)
        {
            List<SSRemarksModel> lstSSRemarks = null;
            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    p.Add("@SS_Code", ssCode);
                    lstSSRemarks = conn.Query<SSRemarksModel>(SP_HD_SS_GETHISTORYOFSSFORSELECTEDSTOCKIEST, p, commandType: CommandType.StoredProcedure).ToList();
                    conn.Close();
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return lstSSRemarks;
        }
        public bool SingleApproveorUnapprove(string companyCode, string regionCode, string status, string ssCode, string baseCode, string updatedBy, string remarks)
        {
            bool result = false;

            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    p.Add("@Status", status);
                    p.Add("@SSCode", ssCode);
                    p.Add("@BaseCode", baseCode);
                    //p.Add("@SS_Status", status);
                    p.Add("@UpdatedBy", updatedBy);
                    p.Add("@Remarks", remarks);
                    p.Add("@result", result);
                    conn.Execute(SP_HD_SS_SingleApproveorUnapprove, p, commandType: CommandType.StoredProcedure);
                    conn.Close();
                    result = true;
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return result;
        }
        public bool UpdateSSStatusFromUnApproval(string regionCode, string ssCode)
        {
            bool result = false;
            string response = "";
            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@RegionCode", regionCode);
                    p.Add("@SSCode", ssCode);
                    //p.Add("@Result", dbType: DbType.String, direction: ParameterDirection.Output);
                    conn.Execute("SP_HD_SS_UpdateSSStatusFromUnApproval", p, commandType: CommandType.StoredProcedure);
                    result = true;
                    conn.Close();
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return result;
        }
        /****************************************************************************************************************************/

        public string GetLeavePrivilege(string companyCode, string userCode)
        {
            string result = "";
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@company_Code", companyCode);
                    p.Add("@user_Code", userCode);
                    //p.Add("@Result", result, DbType.Int16, ParameterDirection.Output);
                    result = connection.Query<string>(SP_HD_Leave_Policy_Status, p, commandType: CommandType.StoredProcedure).FirstOrDefault();
                    //result = p.Get<int>("@Result");
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        public List<DashBoardLanding.LockDetails> GetLockDetails(string companyCode, string userCode)
        {
            List<DashBoardLanding.LockDetails> lstLockDetails = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    lstLockDetails = connection.Query<DashBoardLanding.LockDetails>(SP_HD_GetLockDetils, p, commandType: CommandType.StoredProcedure).ToList();
                    return lstLockDetails;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}

