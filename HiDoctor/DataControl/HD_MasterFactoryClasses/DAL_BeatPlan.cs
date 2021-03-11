using Dapper;
using MVCModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Text;

namespace DataControl.HD_MasterFactoryClasses
{
    public class DAL_BeatPlan : DapperRepository
    {

        private SPData _objSPData = null;
        private Data _objData = null;


        #region MyRegion
        public const string SP_HD_BPP_GETACTIVEWORKCATEGORIES = "SP_HD_BPP_GetActiveWorkCategories";
        public const string SP_HD_BPP_GETWORKAREALIST = "SP_HD_BPP_GetWorkAreaList";
        public const string SP_HD_BPP_GETUSERDETAILSBYREGION = "SP_HD_BPP_GetUserDetailsByRegion";
        public const string SP_HD_BPP_GETPRIVILEGESBYUSERTYPECODE = "SP_HD_BPP_GetPrivilegesByUserTypeCode";
        public const string SP_HD_BPP_GETALLSFCSBYREGION = "SP_HD_BPP_GetAllSFCsByRegion";
        public const string SP_HD_BPP_INSERTBEATPLANDETAILS = "SP_HD_BPP_InsertBeatPlanDetails";
        public const string SP_HD_BPP_GETBEATPLANDETAILS = "SP_HD_BPP_GetBeatPlanDetails";
        public const string SP_HD_BPP_UPDATEAPPROVEORUNAPPROVEOFBEATS = "SP_HD_BPP_UpdateApproveOrUnApproveOfBeats";
        public const string SP_HD_BPP_GETREGIONDETAILS = "SP_HD_BPP_GetRegionDetails";
        public const string SP_HD_BPP_GETALLAPPROVEDBEATS = "SP_HD_BPP_GetAllApprovedBeats";
        public const string SP_HD_BPP_GETALLMASTERDATA = "SP_HD_BPP_GetAllMasterData";
        public const string SP_HD_BPP_INSERTMASTERDATATAGGING = "SP_HD_BPP_InsertMasterDataTagging";
        public const string SP_HD_BPP_GETREGIONWISEPIECHARTSDATA = "SP_HD_BPP_GetRegionWisePieChartsData";
        public const string SP_HD_BPP_GETBEATWISEFULLDETAILS = "SP_HD_BPP_GetBeatWiseFullDetails";
        public const string SP_HD_BPP_GETENTITYWISEDETAILS = "SP_HD_BPP_GetEntityWiseDetails";
        public const string SP_HD_BPP_GETBEATWISEHISTORYDETAILS = "SP_HD_BPP_GetBeatWiseHistoryDetails";
        public const string SP_HD_BPP_UPDATEBEATPLANDETAILS = "SP_HD_BPP_UpdateBeatPlanDetails";
        public const string SP_HD_BPP_GETALLDOCTORDETAILS = "SP_HD_BPP_GetAllDoctorDetails";
        #endregion

        #region Create Beat/Patch Plan
        public List<WorkCategoryModel> GetAllWorkCategories(string companyCode)
        {
            List<WorkCategoryModel> lstWorkCategories = null;
            try
            {

                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    lstWorkCategories = conn.Query<WorkCategoryModel>(SP_HD_BPP_GETACTIVEWORKCATEGORIES, p, commandType: CommandType.StoredProcedure).ToList();
                    conn.Close();
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return lstWorkCategories;
        }
        public List<WorkAreaModel> GetAllWorkAreas(string companyCode, string regionCode, string workCategoryCode,int sfcValidation)
        {
            List<WorkAreaModel> lstWorkAreas = null;
            try
            {

                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    p.Add("@WorkCategoryCode", workCategoryCode);
                    p.Add("@SFCValidationFlag",sfcValidation);
                    lstWorkAreas = conn.Query<WorkAreaModel>(SP_HD_BPP_GETWORKAREALIST, p, commandType: CommandType.StoredProcedure).ToList();
                    conn.Close();
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return lstWorkAreas;
        }
        public List<UserDetailsModel> GetUserDetails(string companyCode, string regionCode)
        {
            List<UserDetailsModel> lstUserDetails = null;
            try
            {

                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    lstUserDetails = conn.Query<UserDetailsModel>(SP_HD_BPP_GETUSERDETAILSBYREGION, p, commandType: CommandType.StoredProcedure).ToList();
                    conn.Close();
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
            return lstUserDetails;
        }
        public List<PrivilegeDetailsModel> GetUserTypePrivileges(string companyCode, string regionCode, string userCode, string userTypeCode)
        {
            List<PrivilegeDetailsModel> lstPrivileges = null;
            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    p.Add("@UserCode", userCode);
                    p.Add("@UserTypeCode", userTypeCode);
                    lstPrivileges = conn.Query<PrivilegeDetailsModel>(SP_HD_BPP_GETPRIVILEGESBYUSERTYPECODE, p, commandType: CommandType.StoredProcedure).ToList();
                    conn.Close();
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return lstPrivileges;
        }

        public List<SFCDetailsModel> GetSFCDetails(string companyCode, string regionCode)
        {
            List<SFCDetailsModel> lstSFCs = null;
            try
            {

                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    lstSFCs = conn.Query<SFCDetailsModel>(SP_HD_BPP_GETALLSFCSBYREGION, p, commandType: CommandType.StoredProcedure).ToList();
                    conn.Close();
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return lstSFCs;
        }
        public long GetSeqNumber(string objName)
        {
            long value = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    string query = "SELECT NEXT VALUE FOR " + objName + "";
                    value = connection.Query<Int64>(query).Single();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return value;
        }
        public OutPutJsonBeatModel InsertBeatPlanDetails(string companyCode, string regionCode, BeatPlanModel _ObjBeatData, DataTable dtSFC, DataTable dtWorkArea,int Weeknumber,string Weekday)
        {
            bool result = false;
            _objSPData = new SPData();
            _objData = new Data();
            OutPutJsonBeatModel output = new OutPutJsonBeatModel();
            string response = string.Empty;
            long BeatCode = GetSeqNumber("SEQ_tbl_SFA_Camp_Planner_Header");
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_BPP_INSERTBEATPLANDETAILS);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                _objSPData.AddParamToSqlCommand(command, "@BeatName", ParameterDirection.Input, SqlDbType.VarChar, 1000, _ObjBeatData.Beat_Name);
                _objSPData.AddParamToSqlCommand(command, "@BeatCode", ParameterDirection.Input, SqlDbType.VarChar, 100, BeatCode);
                _objSPData.AddParamToSqlCommand(command, "@WorKArea", ParameterDirection.Input, SqlDbType.VarChar, 8000, _ObjBeatData.Work_Area);
                _objSPData.AddParamToSqlCommand(command, "@Work_Category_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, _ObjBeatData.Work_Category_Code);
                _objSPData.AddParamToSqlCommand(command, "@Work_Category_Name", ParameterDirection.Input, SqlDbType.VarChar, 1000, _ObjBeatData.Work_Category_Name);
                _objSPData.AddParamToSqlCommand(command, "@Created_By", ParameterDirection.Input, SqlDbType.VarChar, 100, _ObjBeatData.Created_By);
                _objSPData.AddParamToSqlCommand(command, "@WeekNumber", ParameterDirection.Input, SqlDbType.Int, 8, Weeknumber);
                _objSPData.AddParamToSqlCommand(command, "@WeekDay", ParameterDirection.Input, SqlDbType.VarChar, 30, Weekday);
                if (dtSFC.Rows.Count > 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_BPP_InsertBeatSFCDetails", ParameterDirection.Input, SqlDbType.Structured, dtSFC, "TVP_BPP_InsertBeatSFCDetails");

                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_BPP_InsertBeatSFCDetails", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_BPP_InsertBeatSFCDetails");
                }
                if (dtSFC.Rows.Count > 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_BPP_InsertBeatWADetails", ParameterDirection.Input, SqlDbType.Structured, dtWorkArea, "TVP_BPP_InsertBeatWADetails");

                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_BPP_InsertBeatWADetails", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_BPP_InsertBeatWADetails");
                }
                _objSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 8000, "");
                _objData.OpenConnection();
                _objData.ExecuteNonQuery(command);
                response = Convert.ToString(command.Parameters["@Result"].Value);
                if (!(response.Contains("INFO")))
                {
                    if (Convert.ToInt32(response) > 0)
                    {
                        output.Status_Message = true;
                        output.Message = "Success:Successfully Created a Beat/Patch Plan.";
                    }
                    else
                    {
                        output.Status_Message = true;
                        output.Message = "Error:Check.";
                    }
                }
                else
                {
                    output.Status_Message = false;
                    output.Message = response;
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return output;
        }

        public OutPutJsonBeatModel UpdateBeatPlanDetails(string companyCode, string regionCode, BeatPlanModel _ObjBeatData, DataTable dtSFC, DataTable dtWorkArea,int Weeknumber,string Weekday)
        {
            bool result = false;
            _objSPData = new SPData();
            _objData = new Data();
            OutPutJsonBeatModel output = new OutPutJsonBeatModel();
            long BeatCodeHistory = GetSeqNumber("SEQ_tbl_SFA_Camp_Planner_Header_History");
            string response = string.Empty;
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_BPP_UPDATEBEATPLANDETAILS);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                _objSPData.AddParamToSqlCommand(command, "@BeatName", ParameterDirection.Input, SqlDbType.VarChar, 1000, _ObjBeatData.Beat_Name);
                _objSPData.AddParamToSqlCommand(command, "@BeatCode", ParameterDirection.Input, SqlDbType.VarChar, 100, _ObjBeatData.Beat_Code);
                _objSPData.AddParamToSqlCommand(command, "@HistoryBeatCode", ParameterDirection.Input, SqlDbType.VarChar, 100, BeatCodeHistory);
                _objSPData.AddParamToSqlCommand(command, "@WorKArea", ParameterDirection.Input, SqlDbType.VarChar, 8000, _ObjBeatData.Work_Area);
                _objSPData.AddParamToSqlCommand(command, "@Work_Category_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, _ObjBeatData.Work_Category_Code);
                _objSPData.AddParamToSqlCommand(command, "@Work_Category_Name", ParameterDirection.Input, SqlDbType.VarChar, 1000, _ObjBeatData.Work_Category_Name);
                _objSPData.AddParamToSqlCommand(command, "@Created_By", ParameterDirection.Input, SqlDbType.VarChar, 100, _ObjBeatData.Created_By);
                _objSPData.AddParamToSqlCommand(command, "@WeekNumber", ParameterDirection.Input, SqlDbType.Int, 8, Weeknumber);
                _objSPData.AddParamToSqlCommand(command, "@WeekDay", ParameterDirection.Input, SqlDbType.VarChar, 30, Weekday);
                if (dtSFC.Rows.Count > 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_BPP_InsertBeatSFCDetails", ParameterDirection.Input, SqlDbType.Structured, dtSFC, "TVP_BPP_InsertBeatSFCDetails");

                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_BPP_InsertBeatSFCDetails", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_BPP_InsertBeatSFCDetails");
                }
                if (dtSFC.Rows.Count > 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_BPP_InsertBeatWADetails", ParameterDirection.Input, SqlDbType.Structured, dtWorkArea, "TVP_BPP_InsertBeatWADetails");

                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_BPP_InsertBeatWADetails", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_BPP_InsertBeatWADetails");
                }
                _objSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 8000, "");
                _objData.OpenConnection();
                _objData.ExecuteNonQuery(command);
                response = Convert.ToString(command.Parameters["@Result"].Value);
                if (!(response.Contains("INFO")))
                {
                    output.Status_Message = true;
                    output.Message = "Success:Successfully Updated Beat/Patch Plan.";
                }
                else
                {
                    output.Status_Message = false;
                    output.Message = response;
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return output;
        }

        public List<BeatPlanModel> GetBeatPlanDetails(string companyCode, string regionCode, string beatStatus)
        {
            List<BeatPlanModel> lstBeatHeaderDetails = null;
            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    p.Add("@BeatStatus", beatStatus);
                    //p.Add("@FromDate", Convert.ToString(DateTime.Now));
                    //p.Add("@ToDate", Convert.ToString(DateTime.Now));
                    lstBeatHeaderDetails = conn.Query<BeatPlanModel>(SP_HD_BPP_GETBEATPLANDETAILS, p, commandType: CommandType.StoredProcedure).ToList();
                    conn.Close();
                }

            }
            catch (Exception ex)
            {

                throw;
            }
            return lstBeatHeaderDetails;
        }
        public OutPutJsonBeatModel UpdateApproveorUnApproveBeat(string companyCode, int companyId, string regionCode, List<BeatPlanModel> lstApprorUnAppr, DataTable dtApprorUnAppr)
        {
            _objSPData = new SPData();
            _objData = new Data();
            OutPutJsonBeatModel output = new OutPutJsonBeatModel();
            string response = string.Empty;
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_BPP_UPDATEAPPROVEORUNAPPROVEOFBEATS);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                if (dtApprorUnAppr.Rows.Count > 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_BPP_UpdateBeatApproveOrUnApprove", ParameterDirection.Input, SqlDbType.Structured, dtApprorUnAppr, "TVP_BPP_UpdateBeatApproveOrUnApprove");

                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_BPP_UpdateBeatApproveOrUnApprove", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_BPP_UpdateBeatApproveOrUnApprove");
                }
                _objSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 8000, "");
                _objData.OpenConnection();
                _objData.ExecuteNonQuery(command);
                response = Convert.ToString(command.Parameters["@Result"].Value);
                if (!(response.Contains("INFO")))
                {
                    output.Status_Message = true;
                    output.Message = "Success:Successfully Approved/UnApproved selected Beat/Patch Plan(s).";
                }
                else
                {
                    output.Status_Message = false;
                    output.Message = response;
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return output;
        }


        public List<UserDetailsModel> GetRegionDetails(string companyCode, string regionCode)
        {
            List<UserDetailsModel> lstRegionDetails = null;
            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    lstRegionDetails = conn.Query<UserDetailsModel>(SP_HD_BPP_GETREGIONDETAILS, p, commandType: CommandType.StoredProcedure).ToList();
                    conn.Close();
                }

            }
            catch (Exception ex)
            {

                throw;
            }
            return lstRegionDetails;
        }
        public List<BeatPlanModel> GetApprovedBeatsByRegion(string companyCode, string regionCode)
        {
            List<BeatPlanModel> lstBeatDetails = null;
            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    lstBeatDetails = conn.Query<BeatPlanModel>(SP_HD_BPP_GETALLAPPROVEDBEATS, p, commandType: CommandType.StoredProcedure).ToList();
                    conn.Close();
                }

            }
            catch (Exception ex)
            {

                throw;
            }
            return lstBeatDetails;
        }

        public List<dynamic> GetAllMasterandMappedDataByRegion(string companyCode, MasterDataParamModel _objParamData)
        {
            List<dynamic> lstMasterData = new List<dynamic>();
            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", _objParamData.Company_Code);
                    p.Add("@RegionCode", _objParamData.Region_Code);
                    p.Add("@BeatCode", _objParamData.Beat_Code);
                    p.Add("@CustomerEntityType", _objParamData.Customer_Entity_Type);
                    p.Add("@DataLoadType", _objParamData.Data_Load_Type);
                    p.Add("@DataMappedorNot", _objParamData.Data_Mapped_Or_Not);
                    p.Add("@OnceOrMultiple", _objParamData.OnceOrMultiple);
                    lstMasterData = conn.Query<dynamic>(SP_HD_BPP_GETALLMASTERDATA, p, commandType: CommandType.StoredProcedure).ToList();
                    conn.Close();
                }

            }
            catch (Exception ex)
            {

                throw;
            }
            return lstMasterData;
        }

        public OutPutJsonBeatModel InsertBeatToMasterDataTagging(string companyCode, DataTable dtTagged, List<MasterDataTaggedModel> lstTaggedData)
        {
            _objSPData = new SPData();
            _objData = new Data();
            OutPutJsonBeatModel output = new OutPutJsonBeatModel();
            string response = string.Empty;
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_BPP_INSERTMASTERDATATAGGING);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                if (dtTagged.Rows.Count > 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_BPP_InsertTaggedMasterData", ParameterDirection.Input, SqlDbType.Structured, dtTagged, "TVP_BPP_InsertTaggedMasterData");

                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_BPP_InsertTaggedMasterData", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_BPP_InsertTaggedMasterData");
                }
                _objSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 8000, "");
                _objData.OpenConnection();
                _objData.ExecuteNonQuery(command);
                response = Convert.ToString(command.Parameters["@Result"].Value);
                if (!(response.Contains("INFO")))
                {
                    output.Status_Message = true;
                    output.Message = "Success:Successfully Tagged to the selected Beat/Patch Plan(s).";
                }
                else
                {
                    output.Status_Message = false;
                    output.Message = response;
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return output;
        }

        public PieChartWrapperModel GetAllPieChartDetails(string companyCode, string regionCode,string onceormultiplePriv)
        {
            PieChartWrapperModel _ObjPieChartDetails = new PieChartWrapperModel();
            try
            {
                List<PieChartModel> lstbeats = new List<PieChartModel>();
                List<PieChartModel> lstbeattodoc = new List<PieChartModel>();
                List<PieChartModel> lstbeattochem = new List<PieChartModel>();
                List<PieChartModel> lstbeattostock = new List<PieChartModel>();
                List<PieChartModel> lstdocTagdorNot = new List<PieChartModel>();
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    p.Add("@onceormultiplePriv", onceormultiplePriv);
                    using (var multiselect = conn.QueryMultiple(SP_HD_BPP_GETREGIONWISEPIECHARTSDATA, p, commandType: CommandType.StoredProcedure))
                    {
                        lstbeats = multiselect.Read<PieChartModel>().ToList();
                        lstbeattodoc = multiselect.Read<PieChartModel>().ToList();
                        lstbeattochem = multiselect.Read<PieChartModel>().ToList();
                        lstbeattostock = multiselect.Read<PieChartModel>().ToList();
                        lstdocTagdorNot = multiselect.Read<PieChartModel>().ToList();
                    }
                    conn.Close();
                    _ObjPieChartDetails.lstBeats = lstbeats;
                    _ObjPieChartDetails.lstBeatsToChemists = lstbeattochem;
                    _ObjPieChartDetails.lstBeatsToDoctors = lstbeattodoc;
                    _ObjPieChartDetails.lstBeatsToStockists = lstbeattostock;
                    _ObjPieChartDetails.lstDoctorsTaggedOrNotTagged = lstdocTagdorNot;
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return _ObjPieChartDetails;
        }

        public BeatWrapperModel GetBeatWiseDetails(string companyCode, string regionCode, string beatCode, string beatType)
        {
            BeatWrapperModel _objBeatDetails = new BeatWrapperModel();
            try
            {
                List<BeatDetailsModel> lsthdr = null;
                List<BeatDetailsModel> lstsfc = null;
                List<BeatDetailsModel> lstdoc = null;
                List<BeatDetailsModel> lstChem = null;
                List<BeatDetailsModel> lststockist = null;
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    p.Add("@BeatCode", beatCode);
                    p.Add("@EntityType", beatType);
                    var multiselect = conn.QueryMultiple(SP_HD_BPP_GETBEATWISEFULLDETAILS, p, commandType: CommandType.StoredProcedure);
                    lsthdr = multiselect.Read<BeatDetailsModel>().ToList();
                    lstsfc = multiselect.Read<BeatDetailsModel>().ToList();
                    lstdoc = multiselect.Read<BeatDetailsModel>().ToList();
                    lstChem = multiselect.Read<BeatDetailsModel>().ToList();
                    lststockist = multiselect.Read<BeatDetailsModel>().ToList();
                    conn.Close();

                }
                _objBeatDetails.lstHeader = lsthdr;
                _objBeatDetails.lstSFC = lstsfc;
                _objBeatDetails.lstDoctors = lstdoc;
                _objBeatDetails.lstChemists = lstChem;
                _objBeatDetails.lstStockists = lststockist;

            }
            catch (Exception ex)
            {

                throw;
            }
            return _objBeatDetails;
        }


        public CustomerEntityModel GetDoctorWiseDetails(string companyCode, string regionCode, string customerCode, string customerEntityType, string gridId)
        {
            CustomerEntityModel _objDoctor = new CustomerEntityModel();
            try
            {
                _objDoctor.Customer_Entity_Type = customerEntityType;
                _objDoctor.GridId = gridId;
                List<CustomerHeaderModel> lsthdr = null;
                List<EntityAddressModel> lstAddre = null;
                List<HospitalModel> lstHosp = null;
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    p.Add("@CustomerCode", customerCode);
                    p.Add("@CustomerEntityType", customerEntityType);
                    var multiselect = conn.QueryMultiple(SP_HD_BPP_GETENTITYWISEDETAILS, p, commandType: CommandType.StoredProcedure);
                    lsthdr = multiselect.Read<CustomerHeaderModel>().ToList();
                    lstAddre = multiselect.Read<EntityAddressModel>().ToList();
                    lstHosp = multiselect.Read<HospitalModel>().ToList();
                    _objDoctor.lstDoctor = lsthdr;
                    _objDoctor.lstAddress = lstAddre;
                    _objDoctor.lstHospital = lstHosp;
                    conn.Close();
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return _objDoctor;
        }

        public ChemistEntityModel GetChemistWiseDetails(string companyCode, string regionCode, string customerCode, string customerEntityType, string gridId)
        {
            ChemistEntityModel _objChemist = new ChemistEntityModel();
            try
            {
                _objChemist.Customer_Entity_Type = customerEntityType;
                _objChemist.GridId = gridId;
                List<ChemistStockistHeaderModel> lsthdr = null;
                List<EntityAddressModel> lstAddre = null;
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    p.Add("@CustomerCode", customerCode);
                    p.Add("@CustomerEntityType", customerEntityType);
                    var multiselect = conn.QueryMultiple(SP_HD_BPP_GETENTITYWISEDETAILS, p, commandType: CommandType.StoredProcedure);
                    lsthdr = multiselect.Read<ChemistStockistHeaderModel>().ToList();
                    lstAddre = multiselect.Read<EntityAddressModel>().ToList();
                    _objChemist.lstChemist = lsthdr;
                    _objChemist.lstAddress = lstAddre;
                    conn.Close();
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return _objChemist;
        }

        public StockistEntityModel GetStockistWiseDetails(string companyCode, string regionCode, string customerCode, string customerEntityType, string gridId)
        {
            StockistEntityModel _objStockist = new StockistEntityModel();
            try
            {
                _objStockist.Customer_Entity_Type = customerEntityType;
                _objStockist.GridId = gridId;
                List<ChemistStockistHeaderModel> lsthdr = null;
                List<EntityAddressModel> lstAddre = null;
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    p.Add("@CustomerCode", customerCode);
                    p.Add("@CustomerEntityType", customerEntityType);
                    var multiselect = conn.QueryMultiple(SP_HD_BPP_GETENTITYWISEDETAILS, p, commandType: CommandType.StoredProcedure);
                    lsthdr = multiselect.Read<ChemistStockistHeaderModel>().ToList();
                    lstAddre = multiselect.Read<EntityAddressModel>().ToList();
                    _objStockist.lstStockist = lsthdr;
                    _objStockist.lstAddress = lstAddre;
                    conn.Close();
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return _objStockist;
        }

        public List<BeatHistoryModel> GetBeatHistoryDetails(string companyCode, string beatCode, string regionCode)
        {
            List<BeatHistoryModel> lstBeatHistory = new List<BeatHistoryModel>();
            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);
                    p.Add("@BeatCode", beatCode);
                    lstBeatHistory = conn.Query<BeatHistoryModel>(SP_HD_BPP_GETBEATWISEHISTORYDETAILS, p, commandType: CommandType.StoredProcedure).ToList();
                    conn.Close();
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return lstBeatHistory;
        }
        public List<DoctordetailModel> GetDoctordetails(string companyCode, string regioncode, string type)
        {
            List<DoctordetailModel> lstdoctordetails = new List<DoctordetailModel>();
            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Region_Code", regioncode);
                    p.Add("@type", type);
                    lstdoctordetails = conn.Query<DoctordetailModel>(SP_HD_BPP_GETALLDOCTORDETAILS, p, commandType: CommandType.StoredProcedure).ToList();
                    conn.Close();
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return lstdoctordetails;
        }











        //Generics
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
        #endregion

    }
}
