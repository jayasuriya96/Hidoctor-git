using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MVCModels;
using System.Data;
using System.Data.SqlClient;
using Dapper;

namespace DataControl.HD_MasterFactoryClasses
{
    class DAL_DcrStatusMaster : DapperRepository
    {
        DataControl.Data _objData = new DataControl.Data();
        SPData _objSPData = new SPData();

        const string SP_HD_GetAllDivisions = "SP_HD_GetAllDivisions";
        const string SP_HD_GetDcrStatusDetails = "SP_HD_GetDcrStatusDetails";
        const string SP_HD_UpdateRecordStatus = "SP_HD_UpdateRecordStatus";
        const string SP_HD_AddNewStatus = "SP_HD_AddNewStatus";
        const string usp_hd_GetChildUserTypes = "usp_hd_GetChildUserTypes";
        const string SP_HD_GetUserRegionDetails = "SP_HD_GetUserRegionDetails";
        const string SP_HD_GetUserRegionforHospitalDetails = "SP_HD_GetUserRegionforHospitalDetails"; 
        const string SP_HD_GetUserRegionforHospitalDetailsField = "SP_HD_GetUserRegionforHospitalDetailsField";

        const string SP_HD_UnMapRegion = "SP_HD_UnMapRegion";
        const string SP_HD_UnMappedHospitalRegion = "SP_HD_UnMappedHospitalRegion";
        const string SP_HD_UnMappedHospitalRegionField = "SP_HD_UnMappedHospitalRegionField";

        public List<MVCModels.HiDoctor_Master.DivisionModel> GetAllDivisions(string companyCode)
        {
            List<MVCModels.HiDoctor_Master.DivisionModel> lstDivision = new List<MVCModels.HiDoctor_Master.DivisionModel>(); 
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    lstDivision = connection.Query<MVCModels.HiDoctor_Master.DivisionModel>(SP_HD_GetAllDivisions, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstDivision;
        }

        public List<MVCModels.HiDoctor_Master.DCRStatusModel> GetDcrStatusDetails(string DivisionCode, string Usertypecode, string Status, string Catagory)
        {
            List<MVCModels.HiDoctor_Master.DCRStatusModel> lstDcrstatus = new List<MVCModels.HiDoctor_Master.DCRStatusModel>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Division_Code", DivisionCode);
                    p.Add("@Usertypecode", Usertypecode);
                    p.Add("@Status", Status);
                    p.Add("@Catagory", Catagory);
                    lstDcrstatus = connection.Query<MVCModels.HiDoctor_Master.DCRStatusModel>(SP_HD_GetDcrStatusDetails, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstDcrstatus;

        }

        public int UpdateRecordStatus(string DivisionCode, string Usertypecode, string Status, string Catagory, string Statusname, int Recstatus)
        {
            int result = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Division_Code", DivisionCode);
                    p.Add("@Usertypecode", Usertypecode); 
                    p.Add("@Status", Status);
                    p.Add("@Catagory", Catagory);
                    p.Add("@Statusname", Statusname);
                    p.Add("@Recstatus", Recstatus);
                    connection.Execute(SP_HD_UpdateRecordStatus, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
                result = 1;
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        public int AddNewStatus(string companyCode, string username, string Usertype, string Division, string Status, string Catagory, string NewStatus)
        {
            int result = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Username", username);
                    p.Add("@Usertype", Usertype);
                    p.Add("@DivisionCode", Division);
                    p.Add("@Status", Status);
                    p.Add("@Catagory", Catagory);
                    p.Add("@NewStatusValue", NewStatus);
                    p.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output);
                    result =connection.Execute(SP_HD_AddNewStatus, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        public IEnumerable<MVCModels.HiDoctor_Master.UserTypeModel> GetUnderUserTypes(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.UserTypeModel> lstUserTypes;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    lstUserTypes = connection.Query<MVCModels.HiDoctor_Master.UserTypeModel>(usp_hd_GetChildUserTypes, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstUserTypes;
        }

        public List<MVCModels.HiDoctor_Master.MappedRegionModel> GetMappedRegion()
        {
            List<MVCModels.HiDoctor_Master.MappedRegionModel> lstRegDet = new List<MVCModels.HiDoctor_Master.MappedRegionModel>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstRegDet = connection.Query<MVCModels.HiDoctor_Master.MappedRegionModel>(SP_HD_GetUserRegionDetails, null, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstRegDet;

        }

        public List<MVCModels.HiDoctor_Master.MappedRegionModel> GetMappedHospRegion()
        {
            List<MVCModels.HiDoctor_Master.MappedRegionModel> lstRegDet = new List<MVCModels.HiDoctor_Master.MappedRegionModel>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstRegDet = connection.Query<MVCModels.HiDoctor_Master.MappedRegionModel>(SP_HD_GetUserRegionforHospitalDetails, null, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstRegDet;

        }



        public bool InsertMappedRegions(DataTable dtRegCodes, string UserName)
        {
            
            bool result =false;
            try
            {
                SqlCommand command = new SqlCommand("SP_HD_InsertMappedRegion");
                command.CommandType = CommandType.StoredProcedure;
                //using (IDbConnection connection = IDbOpenConnection())
                //{
                //    var p = new DynamicParameters();
                //    p.Add("@UserName", UserName);
                //    result=connection.Execute(SP_HD_InsertMappedRegion, p, commandType: CommandType.StoredProcedure);
                //    connection.Close();
                //}

                if (dtRegCodes.Rows.Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCRStatus_RegionCodes", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_DCRStatus_RegionCodes");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCRStatus_RegionCodes", ParameterDirection.Input, SqlDbType.Structured, dtRegCodes, "TVP_DCRStatus_RegionCodes");
                }
                _objData.OpenConnection();
                _objData.ExecuteNonQuery(command);
                result = true;
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        public bool InsertMappedHospitalRegions(DataTable dtRegCodes, string UserName)
        {

            bool result = false;
            try
            {
                SqlCommand command = new SqlCommand("SP_HD_InsertHospitalMappedRegion");
                command.CommandType = CommandType.StoredProcedure;
                //using (IDbConnection connection = IDbOpenConnection())
                //{
                //    var p = new DynamicParameters();
                //    p.Add("@UserName", UserName);
                //    result=connection.Execute(SP_HD_InsertMappedRegion, p, commandType: CommandType.StoredProcedure);
                //    connection.Close();
                //}

                if (dtRegCodes.Rows.Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCRStatus_RegionCodes", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_DCRStatus_RegionCodes");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCRStatus_RegionCodes", ParameterDirection.Input, SqlDbType.Structured, dtRegCodes, "TVP_DCRStatus_RegionCodes");
                }
                _objData.OpenConnection();
                _objData.ExecuteNonQuery(command);
                result = true;
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        public int UnmapRegions(string Regioncode, string UserName)
        {
            int result = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Regioncode", Regioncode);
                    p.Add("@UserName", UserName);
                    result = connection.Execute(SP_HD_UnMapRegion, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        public int UnMapHospitalRegions(string Regioncode, string UserName)
        {
            int result = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Regioncode", Regioncode);
                    p.Add("@UserName", UserName);
                    result = connection.Execute(SP_HD_UnMappedHospitalRegion, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }
            ////   DcrStatusMaster for field Hospital   ////

        public bool InsertMappedHospitalRegionsField(DataTable dtRegCodes, string UserName)
        {

            bool result = false;
            try
            {
                SqlCommand command = new SqlCommand("SP_HD_InsertHospitalMappedRegionField");
                command.CommandType = CommandType.StoredProcedure;
                //using (IDbConnection connection = IDbOpenConnection())
                //{
                //    var p = new DynamicParameters();
                //    p.Add("@UserName", UserName);
                //    result=connection.Execute(SP_HD_InsertMappedRegion, p, commandType: CommandType.StoredProcedure);
                //    connection.Close();
                //}

                if (dtRegCodes.Rows.Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCRStatus_RegionCodes", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_DCRStatus_RegionCodes");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCRStatus_RegionCodes", ParameterDirection.Input, SqlDbType.Structured, dtRegCodes, "TVP_DCRStatus_RegionCodes");
                }
                _objData.OpenConnection();
                _objData.ExecuteNonQuery(command);
                result = true;
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }


        public List<MVCModels.HiDoctor_Master.MappedRegionModel> GetMappedHospRegionField()
        {
            List<MVCModels.HiDoctor_Master.MappedRegionModel> lstRegDet = new List<MVCModels.HiDoctor_Master.MappedRegionModel>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstRegDet = connection.Query<MVCModels.HiDoctor_Master.MappedRegionModel>(SP_HD_GetUserRegionforHospitalDetailsField, null, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstRegDet;

        }

        public int UnMapHospitalRegionsField(string Regioncode, string UserName)
        {
            int result = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Regioncode", Regioncode);
                    p.Add("@UserName", UserName);
                    result = connection.Execute(SP_HD_UnMappedHospitalRegionField, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }
                                     /// End ///

    }
}
