
using System;
using System.Collections.Generic;
using System.Data;

using System.Linq;
using System.Text;
using Dapper;

namespace DataControl.HD_MasterFactoryClasses
{
    public class DALDoctor : DapperRepository
    {
       public const string SP_HDGETSPECIALITY = "SP_hdGetSpeciality";
        public const string SP_HD_CityDetailsnew = "SP_HD_CityDetailsnew";
        public const string SP_HD_GetDoctorCatgorybySelectedRegion = "SP_HD_GetDoctorCatgorybySelectedRegion";
        public const string SP_HD_addcitynamenew = "SP_HD_addcitynamenew";

        public List<MVCModels.speciality> GetDoctorspcl(string CompanyCode)
        {
            List<MVCModels.speciality> lstspcl = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", CompanyCode);
                    p.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output);
                    lstspcl = connection.Query<MVCModels.speciality>(SP_HDGETSPECIALITY, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstspcl;
        }
        public List<MVCModels.city> GetAllCities()
        {
            List<MVCModels.city> lstCities = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstCities = connection.Query<MVCModels.city>(SP_HD_CityDetailsnew, null, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstCities;
        }
        public List<MVCModels.category> GetDoctorcat(string CompanyCode,string RegionCode)
        {
            List<MVCModels.category> lstcat= null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {

                    var p = new DynamicParameters();
                    p.Add("@Company_Code", CompanyCode);
                    p.Add("@Region_Code", RegionCode);
                    // p.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output);
                    lstcat = connection.Query<MVCModels.category>(SP_HD_GetDoctorCatgorybySelectedRegion, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstcat;
        }
        public string InsertNewCityDetails(string UserCode, string cityname)
        {
            string result = string.Empty;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
               
                   p.Add("@UserCode", UserCode);
                    p.Add("@cityname", cityname);
                    connection.Execute(SP_HD_addcitynamenew, p, commandType: CommandType.StoredProcedure);
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

    }
}
