using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using Dapper;

namespace DataControl
{
    public class DALCampaignPlanner : DapperRepository
    {
        #region Private Variables
        private Data _objData = new Data();
        private SPData _objSPData = new SPData();
        private CurrentInfo _objCurInfo = new CurrentInfo();
        private SqlDataReader sqlDataReader;
        #endregion Private Variables

        #region Constant Strings
        const string SP_HDGETEXPENSEENTITY = "SP_hdGetExpenseEntity";
        const string SP_hdGetSFCByRegion = "SP_hdGetSFCByRegion";
        const string SP_HDGETAPPROVEDDOCTORSBYREGION = "SP_hdGetApprovedDoctorsByRegion";
        const string SP_HDGETCPDETAILS = "SP_hdGetCPDetails";
        const string SP_HDGETACTIVESFCBYSFCCODE = "SP_hdGetActiveSFCBySFCCode";
        const string SP_HDGETSELECTEDSFC = "SP_HDGetSelectedSFC";
        const string SP_HDGETMODIFIEDCPSFCDETAILS = "SP_hdGetModifiedCPSFCDetails";
        #endregion Constant Strings

        #region public methods
        public List<MVCModels.ExpenseEntity> GetExpenseEntity(string companyCode)
        {
            List<MVCModels.ExpenseEntity> lstExpenseEntity = new List<MVCModels.ExpenseEntity>();
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETEXPENSEENTITY);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objData.OpenConnection();
                using (sqlDataReader = _objData.ExecuteReader(command))
                {
                    while (sqlDataReader.Read())
                    {
                        MVCModels.ExpenseEntity _objExpenseEntity = new MVCModels.ExpenseEntity();
                        _objExpenseEntity.Expense_Entity_Code = sqlDataReader["Expense_Entity_Code"].ToString();
                        _objExpenseEntity.Expense_Entity_Name = sqlDataReader["Expense_Entity_Name"].ToString();
                        lstExpenseEntity.Add(_objExpenseEntity);
                    }
                }
            }
            catch (Exception ex)
            {
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: null);
                throw ex;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstExpenseEntity;
        }

        public List<MVCModels.SFC> GetSFC(string companyCode, string regionCode)
        {
            List<MVCModels.SFC> lstSFC = new List<MVCModels.SFC>();
            try
            {
                SqlCommand command = new SqlCommand(SP_hdGetSFCByRegion);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                _objData.OpenConnection();
                using (sqlDataReader = _objData.ExecuteReader(command))
                {
                    while (sqlDataReader.Read())
                    {
                        MVCModels.SFC _objSFC = new MVCModels.SFC();
                        _objSFC.Distance_Fare_Code = sqlDataReader["Distance_Fare_Code"].ToString();
                        _objSFC.From_Region_Name = sqlDataReader["From_Region_Name"].ToString();
                        _objSFC.To_Region_Name = sqlDataReader["To_Region_Name"].ToString();
                        _objSFC.Distance = sqlDataReader["Distance"] == null ? 0 : Convert.ToDouble(sqlDataReader["Distance"]);
                        _objSFC.Fare_Amount = sqlDataReader["Fare_Amount"] == null ? 0 : Convert.ToDouble(sqlDataReader["Fare_Amount"]);
                        _objSFC.Travel_Mode = sqlDataReader["Travel_Mode"].ToString();
                        _objSFC.Category_Name = sqlDataReader["Category_Name"].ToString();
                        _objSFC.SFC_Version_No = sqlDataReader["SFC_Version_No"].ToString();
                        _objSFC.SFC_Visit_Count = sqlDataReader["SFC_Visit_Count"].ToString();
                        lstSFC.Add(_objSFC);
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("RegionCode", regionCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);

                throw ex;
            }
            finally
            {

                _objData.CloseConnection();
            }
            return lstSFC;
        }
        public List<MVCModels.HiDoctor_Master.DoctorModel> GetApprovedDoctorsByRegion(string companyCode, string regionCode)
        {
            List<MVCModels.HiDoctor_Master.DoctorModel> lstDoctor = new List<MVCModels.HiDoctor_Master.DoctorModel>();
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETAPPROVEDDOCTORSBYREGION);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                _objData.OpenConnection();
                using (sqlDataReader = _objData.ExecuteReader(command))
                {
                    while (sqlDataReader.Read())
                    {
                        MVCModels.HiDoctor_Master.DoctorModel _objDoctor = new MVCModels.HiDoctor_Master.DoctorModel();
                        _objDoctor.Customer_Name = Convert.ToString(sqlDataReader["Customer_Name"]);
                        _objDoctor.Region_Name = Convert.ToString(sqlDataReader["Region_Name"]);
                        _objDoctor.Speciality_Name = Convert.ToString(sqlDataReader["Speciality_Name"]);
                        _objDoctor.MDL_Number = Convert.ToString(sqlDataReader["MDL_Number"]);
                        _objDoctor.Qualification = Convert.ToString(sqlDataReader["Qualification"]);
                        _objDoctor.Customer_Code = Convert.ToString(sqlDataReader["Customer_Code"]);
                        _objDoctor.Category_Name = Convert.ToString(sqlDataReader["Category_Name"]);
                        lstDoctor.Add(_objDoctor);
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("regionCode", regionCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                throw ex;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstDoctor;
        }

        public DataSet GetCPDetails(string companyCode, string regionCode)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETCPDETAILS);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                _objData.OpenConnection();
                ds = _objData.ExecuteDataSet(command);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("regionCode", regionCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                throw ex;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return ds;
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
        public int InsertCampaignPlanner(string companyCode, string cpCode, List<MVCModels.CampaignPlannerHeader> lstHeader,
                List<MVCModels.CampaignPlannerDetails> lstDetails, List<MVCModels.CampaignPlannerSFC> lstSFC, string mode,
                string regionCode, string categoryName)
        {
            int rowsAffected = 0;
            int rowsAffected_History = 0;
            long headerTranId = 0;
            try
            {
                headerTranId = GetSeqNumber("SEQ_tbl_SFA_Camp_Planner_Header_History");
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                    #region campaign planner delete while edit the cp
                    if ("EDIT" == mode.ToUpper())
                    {
                        //const string deleteQuery_History = "DELETE FROM tbl_SFA_Camp_Planner_SFC_History WHERE Company_Code =@Company_Code AND CP_Code =@CP_Code  " +
                        //                        "DELETE FROM tbl_SFA_Camp_Planner_Detail_History WHERE Company_Code =@Company_Code AND CP_Code =@CP_Code  " +
                        //                        "DELETE FROM tbl_SFA_Camp_Planner_Header_History WHERE Company_Code = @Company_Code AND CP_Code =@CP_Code  " +
                        //                        "AND Region_Code = @Region_Code ";
                        //rowsAffected_History = connection.Execute(deleteQuery_History, new
                        //{
                        //    Company_Code = companyCode,
                        //    CP_Code = cpCode,
                        //    Region_Code = regionCode
                        //}, transaction: trans);
                        //if (rowsAffected_History > 0)
                        //{
                        const string deleteQuery = "DELETE FROM tbl_SFA_Camp_Planner_SFC WHERE Company_Code =@Company_Code AND CP_Code =@CP_Code  " +
                                                   "DELETE FROM tbl_SFA_Camp_Planner_Detail WHERE Company_Code =@Company_Code AND CP_Code =@CP_Code  " +
                                                   "DELETE FROM tbl_SFA_Camp_Planner_Header WHERE Company_Code = @Company_Code AND CP_Code =@CP_Code  " +
                                                   "AND Region_Code = @Region_Code ";
                        rowsAffected = connection.Execute(deleteQuery, new
                        {
                            Company_Code = companyCode,
                            CP_Code = cpCode,
                            Region_Code = regionCode
                        }, transaction: trans);
                        //}
                    }
                    #endregion campaign planner delete while edit the cp
                    #region CP Header_History insert
                    //if ("EDIT" == mode.ToUpper() && rowsAffected_History == 0)
                    //{
                    //    return 0;
                    //}
                    string headerQuery_History = "INSERT INTO tbl_SFA_Camp_Planner_Header_History(Company_Code,CP_code,CP_name, " +
                                                 "Status,Region_Code,Work_area,Place_From,Place_To,Distance,Fare_Amount,Travel_Mode, " +
                                                 "Category_Code,Created_Date,Created_By,Distance_Fare_Code,Route_Way, " +
                                                 "Updated_By,Updated_Date,Header_Tran_code,SFC_Version_No,SFC_Visit_Count,SFC_Category_Name) " +
                                                 "VALUES(@Company_Code,@CP_Code,@CP_Name,@Status,@Region_Code, " +
                                                 "@Work_Area,@Place_From,@Place_To,@Distance,@Fare_Amount,@Travel_Mode, " +
                                                 "@Category_Code,@Created_Date,@Created_By,@Distance_Fare_Code,@Route_Way, " +
                                                 "@Updated_By,@Updated_Date," + headerTranId + ",@SFC_Version_No,@SFC_Visit_Count,@Category_Name)";
                    rowsAffected_History = connection.Execute(headerQuery_History, lstHeader, transaction: trans);


                    if (rowsAffected_History > 0)
                    {
                        if ("HQ" != categoryName)
                        {
                            rowsAffected_History = 0;
                            string sfcQuery_History = "INSERT INTO tbl_SFA_Camp_Planner_SFC_History(Company_Code ,CP_HOP_Code,CP_Code,Work_Place,From_Place, " +
                                                       "To_Place,Distance,Travel_Mode,Amount,Distance_Fare_Code,Route_Way,Header_Tran_code, " +
                                                       "SFC_Version_No,SFC_Visit_Count,SFC_Category_Name)" +
                                                       "VALUES(@Company_Code ,@CP_HOP_Code,@CP_Code,@Work_Place,@From_Place,@To_Place, " +
                                                       "@Distance,@Travel_Mode,@Amount,@Distance_Fare_Code,@Route_Way," + headerTranId + ", " +
                                                       "@SFC_Version_No,@SFC_Visit_Count,@SFC_Category_Name)";
                            rowsAffected_History = connection.Execute(sfcQuery_History, lstSFC, transaction: trans);
                        }
                    }
                    #endregion CP Header_History insert
                    #region CP Details_History insert
                    if (rowsAffected_History > 0)
                    {
                        rowsAffected_History = 0;
                        string detailsQuery_History = "INSERT INTO tbl_SFA_Camp_Planner_Detail_History(Company_Code,CP_Code,Doctor_code, " +
                                                      "Doctor_Name,Estimated_Time,Header_Tran_code) " +
                                                      "VALUES (@Company_Code,@CP_Code,@Doctor_Code,@Doctor_Name,@Estimated_Time," + headerTranId + ")";
                        rowsAffected_History = connection.Execute(detailsQuery_History, lstDetails, transaction: trans);
                    }
                    #endregion CP Details_History insert
                    #region campaign planner header insert
                    if ("EDIT" == mode.ToUpper() && rowsAffected == 0)
                    {
                        return 0;
                    }
                    if (rowsAffected_History > 0)
                    {
                        const string headerQuery = "INSERT INTO tbl_SFA_Camp_Planner_Header(Company_Code,CP_code,CP_name,Status,Region_Code,Work_area,Place_From, " +
                                                   "Place_To,Distance,Fare_Amount,Travel_Mode,Category_Code,Created_Date,Created_By,Distance_Fare_Code,Route_Way, " +
                                                   "Updated_By,Updated_Date,SFC_Version_No,SFC_Visit_Count,SFC_Category_Name) " +
                                                   "VALUES(@Company_Code,@CP_Code,@CP_Name,@Status,@Region_Code,@Work_Area,@Place_From, " +
                                                   "@Place_To,@Distance,@Fare_Amount,@Travel_Mode,@Category_Code,@Created_Date,@Created_By,@Distance_Fare_Code, " +
                                                   "@Route_Way,@Updated_By,@Updated_Date,@SFC_Version_No,@SFC_Visit_Count,@Category_Name)";
                        rowsAffected = connection.Execute(headerQuery, lstHeader, transaction: trans);
                        if (rowsAffected > 0)
                        {
                            if ("HQ" != categoryName)
                            {
                                rowsAffected = 0;
                                const string sfcQuery = "INSERT INTO tbl_SFA_Camp_Planner_SFC(Company_Code ,CP_HOP_Code,CP_Code,Work_Place,From_Place, " +
                                                        "To_Place,Distance,Travel_Mode,Amount,Distance_Fare_Code,Route_Way," +
                                                        "SFC_Version_No,SFC_Visit_Count,SFC_Category_Name)" +
                                                        "VALUES(@Company_Code ,@CP_HOP_Code,@CP_Code,@Work_Place,@From_Place,@To_Place, " +
                                                        "@Distance,@Travel_Mode,@Amount,@Distance_Fare_Code,@Route_Way, " +
                                                        "@SFC_Version_No,@SFC_Visit_Count,@SFC_Category_Name)";
                                rowsAffected = connection.Execute(sfcQuery, lstSFC, transaction: trans);
                            }
                        }
                        #endregion campaign planner header insert
                        #region campaign planner details insert
                        if (rowsAffected > 0)
                        {
                            rowsAffected = 0;
                            const string detailsQuery = "INSERT INTO tbl_SFA_Camp_Planner_Detail(Company_Code,CP_Code,Doctor_code,Doctor_Name,Estimated_Time) " +
                                                        "VALUES (@Company_Code,@CP_Code,@Doctor_Code,@Doctor_Name,@Estimated_Time)";
                            rowsAffected = connection.Execute(detailsQuery, lstDetails, transaction: trans);
                        }
                        #endregion campaign planner details insert
                        trans.Commit();
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("regionCode", regionCode);
                dicObj.Add("regionCode", regionCode);
                dicObj.Add("mode", mode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                throw ex;
            }
            return rowsAffected;
        }

        public IEnumerable<MVCModels.SFC> GetActiveSFCBySFCCode(string companyCode, string distanceFareCode, string regionCode)
        {
            IEnumerable<MVCModels.SFC> lstSFC;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Distance_Fare_Code", distanceFareCode);
                    p.Add("@Region_Code", regionCode);
                    lstSFC = connection.Query<MVCModels.SFC>(SP_HDGETACTIVESFCBYSFCCODE, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                throw ex;
            }
            return lstSFC;
        }

        public IEnumerable<MVCModels.SFC> GetSelectedSFC(string companyCode, string distanceFareCode, string regionCode)
        {
            IEnumerable<MVCModels.SFC> lstSFC;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Distance_Fare_Code", distanceFareCode);
                    p.Add("@Region_Code", regionCode);
                    lstSFC = connection.Query<MVCModels.SFC>(SP_HDGETSELECTEDSFC, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                throw ex;
            }
            return lstSFC;
        }

        public DataSet GetModifiedCPSFCDetails(string companyCode, string regionCode, string cpCode)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETMODIFIEDCPSFCDETAILS);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                _objSPData.AddParamToSqlCommand(command, "@CP_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, cpCode);
                _objData.OpenConnection();
                ds = _objData.ExecuteDataSet(command);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("cpCode", cpCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                throw ex;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return ds;
        }
        #endregion public methods
    }
}
