using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using MVCModels;
using Dapper;
namespace DataControl
{
    public class DAL_TP : DapperRepository
    {
        Data _objData;

        const string HD_GET_GETCPENTEREDDATE = "Sp_HG_GetCPEnteredDate";
        const string SP_HD_GETCAMPAIGNDOCTORS = "Sp_hd_GetCampaignDoctors";
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
        #endregion
        public string GetCpLastEnteredDate(string usercode, string cpcode, DateTime tp_date, string companyCode)
        {
            _objData = new Data();
            string cpstatus = "no";
            try
            {
                SqlCommand command = new SqlCommand(HD_GET_GETCPENTEREDDATE);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@cp_code", ParameterDirection.Input, SqlDbType.VarChar, 50, cpcode);
                AddParamToSqlCommand(command, "@usercode", ParameterDirection.Input, SqlDbType.VarChar, 30, usercode);
                AddParamToSqlCommand(command, "@Tp_Date", ParameterDirection.Input, SqlDbType.Date, 30, tp_date);
                _objData.OpenConnection(companyCode);
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                    if (dataReader.HasRows)
                        while (dataReader.Read())
                            cpstatus = dataReader["status"].ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return cpstatus;
        }

        public TPReport GetTpReport(string tp_Id, string company_Code)
        {

            TPReport objReport = new TPReport();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", company_Code);
                    p.Add("@tp_Id", tp_Id);
                    p.Add("@Status", "ALL");
                    var lsTpReport = connection.QueryMultiple("SP_hdGetTPForApprovalReport", p, commandType: CommandType.StoredProcedure);
                    objReport.TpHeader = lsTpReport.Read<TourPlannerModel>().ToList();
                    objReport.TpSfc = lsTpReport.Read<TourPlannerSFCModel>().ToList();
                    objReport.TpDoctor = lsTpReport.Read<TourPlannerDoctorsModel>().ToList().OrderBy(x => x.Region_Name).ToList();
                    objReport.TpSampleProduct = lsTpReport.Read<TourPlannerDoctorSample>().ToList();
                    objReport.lsAccName = lsTpReport.Read<TourPlannerModel>().ToList();
                    objReport.lstBatch = lsTpReport.Read<TourPlannerBatch>().ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return objReport;
        }

        public DataSet GetTpconsolidatedReport(string UserCode, string Month, string Year, string company_Code)
        {
            _objData = new Data();
            DataSet ds = new DataSet();
            try
            {
                SqlCommand cmd = new SqlCommand("HD_SP_TpReport");
                cmd.CommandType = CommandType.StoredProcedure;
                AddParamToSqlCommand(cmd, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                AddParamToSqlCommand(cmd, "@Month", ParameterDirection.Input, SqlDbType.Int, 8, Month);
                AddParamToSqlCommand(cmd, "@year", ParameterDirection.Input, SqlDbType.Int, 8, Year);
                AddParamToSqlCommand(cmd, "@user_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, UserCode);
                //cmd.Parameters.Add("@Company_Code", company_Code);
                //cmd.Parameters.Add("@Month", Month);
                //cmd.Parameters.Add("@year", Year);
                //cmd.Parameters.Add("@user_Code", UserCode);
                _objData.OpenConnection();
                ds = _objData.ExecuteDataSet(cmd);
                _objData.CloseConnection();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                _objData.CloseConnection();
            }

            return ds;
        }
        public List<TPTotalCount> GetTPCount(string user_Code, int month, int year, string company_Code)
        {
            List<TPTotalCount> lsTPCount = new List<TPTotalCount>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Comapny_code", company_Code);
                    p.Add("@user_code", user_Code);
                    p.Add("@month", month);
                    p.Add("@year", year);
                    lsTPCount = connection.Query<TPTotalCount>("Hd_SP_GetTPStatusWiseCount", p, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return lsTPCount;
        }
        public MVCModels.TPBatch GetBatchInformation(string AccRegionCode, string TpDate, string UserCode)
        {
            MVCModels.TPBatch lst = new MVCModels.TPBatch();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Code", AccRegionCode);
                    p.Add("@TP_Date", TpDate);
                    p.Add("@UserCode", UserCode);
                    var mullist = connection.QueryMultiple("Sp_hd_TP_Batch_Information", p, commandType: CommandType.StoredProcedure);
                    lst.current = mullist.Read<MVCModels.BatchInformation>().ToList();
                    lst.previous = mullist.Read<MVCModels.BatchInformation>().ToList();
                    lst.future = mullist.Read<MVCModels.BatchInformation>().ToList(); 
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lst;
        }
        public List<MVCModels.BatchProduct> GetBatchProduct(int Schedule_Id)
        {
            List<MVCModels.BatchProduct> lst = new List<BatchProduct>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Schedule_Id", Schedule_Id);
                    lst = connection.Query<BatchProduct>("Sp_hd_TP_Batch_ProductInfo", p, commandType: CommandType.StoredProcedure).ToList();
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lst;
        }
        public List<MVCModels.CampaignDoctor> GetCampaignDoctors(string UserCodes, string CreatedUserCode, string TP_Date, string VacantRegions)
        {
            List<MVCModels.CampaignDoctor> lst = new List<CampaignDoctor>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@UserCodes", UserCodes);
                    p.Add("@CreatedUserCode", CreatedUserCode);
                    p.Add("@TP_Date", TP_Date);
                    p.Add("@VacantRegions", VacantRegions);
                    lst = connection.Query<CampaignDoctor>(SP_HD_GETCAMPAIGNDOCTORS, p, commandType: CommandType.StoredProcedure).ToList();
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lst;
        }
        public MVCModels.BatchDetails GetBatchForDoctors(string DoctorCode, string DoctorRegion, string Region_Code,string TpDate)
        {
            MVCModels.BatchDetails lst = new BatchDetails();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@DoctorCode", DoctorCode);
                    p.Add("@DoctorRegion", DoctorRegion);
                    p.Add("@Region_Code", Region_Code);
                    p.Add("@TpDate", TpDate);
                    var mullist = connection.QueryMultiple("Sp_hd_TP_BatchDoctorDetails", p, commandType: CommandType.StoredProcedure);
                    lst.current = mullist.Read<MVCModels.BatchInfo>().ToList();
                    lst.previous = mullist.Read<MVCModels.BatchInfo>().ToList();
                    lst.future = mullist.Read<MVCModels.BatchInfo>().ToList();
                }
            }
            catch(Exception ex)
            {
                throw ex;
            }
            return lst;
        }

    }
}
