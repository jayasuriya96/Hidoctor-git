using Dapper;
using MVCModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static MVCModels.DoctorMissedReason;

namespace DataControl.HD_MasterFactoryClasses
{
   public  class DAL_MissedDoctorsEntry : DapperRepository
    {
        SPData _objSPData = new SPData();
        //public DoctorMissedReason.PPAndSS PPAndSS;
        private Data _objData = new Data();
        private SPData _ObjSPData = new SPData();

        public List<DoctorMissedReason.RegionName> GetAllRegionName(string subDomainName,string Company_Code,string Region_Code)
        {
            List<DoctorMissedReason.RegionName> lst = new List<DoctorMissedReason.RegionName>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Code", Region_Code);
                    lst = connection.Query<DoctorMissedReason.RegionName>("Sp_Hd_GetRegionName", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch (Exception ex)
            {
                throw;
            }
            return lst;
        }

        public List<DoctorsList> GetAllDoctorslist(string subDomainName ,string Company_Code, string Region_Code,int Month, int Year)
        {
            List<DoctorsList> lst = new List<DoctorsList>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@subDomainName", subDomainName);
                    p.Add("@Company_Code", Company_Code);
                    p.Add("@Region_Code", Region_Code);
                    p.Add("@Month", Month);
                    p.Add("@Year", Year);

                    lst = connection.Query<DoctorsList>("SP_HD_Get_Doctors_List", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }

            catch (Exception ex)
            {

                throw;
            }
            return lst;
        }
        public int GetInsertDoctorsList(DoctorMissedReason.DoctorsDetailsList _ObjData, DataTable dtTable)
        {
            int result = 1;
            int save = 0;
            try
            {

                string cmdTxt = "SP_HD_Insert_DoctorsList";
                SqlCommand command = new SqlCommand(cmdTxt);
                command.CommandType = CommandType.StoredProcedure;
                //var p = new DynamicParameters();
                _objSPData.AddParamToSqlCommand(command, "@subDomainName", ParameterDirection.Input, SqlDbType.VarChar, 30, _ObjData.subDomainName);
                _objSPData.AddParamToSqlCommand(command, "@Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, _ObjData.Region_Code);

                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, _ObjData.Company_Code);
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, _ObjData.User_Code);
                // _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _ObjData.LoginUserCode);
                //_objSPData.AddParamToSqlCommand(command, "@Norms_Visit_Count", ParameterDirection.Input, SqlDbType.Int, 8, _ObjData.Actual_Visit_Count);
               // _objSPData.AddParamToSqlCommand(command, "@Reason", ParameterDirection.Input, SqlDbType.Int, 8, _ObjData.Reason);
                //_objSPData.AddParamToSqlCommand(command, "@Remarks", ParameterDirection.Input, SqlDbType.VarChar, 1000, _ObjData.Remarks);
                _objSPData.AddParamToSqlCommand(command, "@Status", ParameterDirection.Input, SqlDbType.Int, 8, _ObjData.Status);
                _objSPData.AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.Int, 8, _ObjData.Month);
                _objSPData.AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.Int, 8, _ObjData.Year);

                _objSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.Int, 8, "");
                if (dtTable != null)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Insert_Doctors_Data", ParameterDirection.Input, SqlDbType.Structured, dtTable, "TVP_Insert_Doctors_Data");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Insert_Doctors_Data", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_Insert_Doctors_Data");
                }
                _objData.ExecuteNonQuery(command, _ObjData.subDomainName);
                result = Convert.ToInt32(command.Parameters["@Result"].Value);

            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }
        public List<DoctorMissedReason.SalesDetails> GetAllDoctorDetails(string subDomainName,string Company_Code, string Region_Code, int Month, int Year)
        {
           
            List<DoctorMissedReason.SalesDetails> lst = new List<DoctorMissedReason.SalesDetails>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@subDomainName", subDomainName);
                    p.Add("@Company_Code", Company_Code);
                    p.Add("@Region_Code", Region_Code);

                    p.Add("@Month", Month);
                    p.Add("@Year", Year);
                    lst = connection.Query<DoctorMissedReason.SalesDetails>("SP_HD_Get_DocDetails", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch (Exception ex)
            {
                throw;
            }

            return lst;

        }


        public List<DoctorMissedReason.DetailsGrid> GetGridDetails(string subDomainName,string Company_Code, string Region_Code, int Month, int Year)
        {

            List<DoctorMissedReason.DetailsGrid> lst = new List<DoctorMissedReason.DetailsGrid>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@subDomainName", subDomainName);
                    p.Add("@Company_Code", Company_Code);
                    p.Add("@Region_Code", Region_Code);

                    p.Add("@Month", Month);
                    p.Add("@Year", Year);
                    lst = connection.Query<DoctorMissedReason.DetailsGrid>("SP_HD_Get_GridDetails", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch (Exception ex)
            {
                throw;
            }

            return lst;

        }

        public List<DoctorsList> GetprefilDoctorslist( string subDomainName,string Company_Code, string Region_Code, int Month, int Year)
        {
            List<DoctorsList> lst = new List<DoctorsList>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@subDomainName", subDomainName);
                    p.Add("@Company_Code", Company_Code);
                    p.Add("@Region_Code", Region_Code);
                    p.Add("@Month", Month);
                    p.Add("@Year", Year);

                    lst = connection.Query<DoctorsList>("SP_HD_Get_prefilDoc_List", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }

            catch (Exception ex)
            {

                throw;
            }
            return lst;
        }

        public List<DoctorMissedReason.DetailsGrid> GetGridDetailslist(string subDomainName,string Company_Code, string Region_Code, int Month, int Year)
        {

            List<DoctorMissedReason.DetailsGrid> lst = new List<DoctorMissedReason.DetailsGrid>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@subDomainName", subDomainName);
                    p.Add("@Company_Code", Company_Code);
                    p.Add("@Region_Code", Region_Code);

                    p.Add("@Month", Month);
                    p.Add("@Year", Year);
                    //p.Add("@Status", Status);
                    lst = connection.Query<DoctorMissedReason.DetailsGrid>("SP_HD_Get_GridprefilDetails", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch (Exception ex)
            {
                throw;
            }

            return lst;

        }
        public List<DoctorMissedReason.SalesDetails> prefileditDetails(string subDomainName, string Company_Code, string Region_Code, int Month, int Year)
        {

            List<DoctorMissedReason.SalesDetails> lst = new List<DoctorMissedReason.SalesDetails>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@subDomainName", subDomainName);
                    p.Add("@Company_Code", Company_Code);
                    p.Add("@Region_Code", Region_Code);

                    p.Add("@Month", Month);
                    p.Add("@Year", Year);
                    lst = connection.Query<DoctorMissedReason.SalesDetails>("SP_HD_Get_editDEtails", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch (Exception ex)
            {
                throw;
            }

            return lst;

        }
        public List<DoctorMissedReason.ReasonDetails> ReasonDetails(string subDomainName, string Region_Code)
        {

            List<DoctorMissedReason.ReasonDetails> lst = new List<DoctorMissedReason.ReasonDetails>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Code", Region_Code);
                    p.Add("@subDomainName", subDomainName);
                    //p.Add("@Month", Month);
                    //p.Add("@Year", Year);
                    lst = connection.Query<DoctorMissedReason.ReasonDetails>("SP_HD_ReasonsList", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch (Exception ex)
            {
                throw;
            }

            return lst;

        }

    }
}
