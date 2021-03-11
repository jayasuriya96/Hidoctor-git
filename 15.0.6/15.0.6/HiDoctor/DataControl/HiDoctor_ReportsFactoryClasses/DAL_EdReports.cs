using Dapper;
using MVCModels;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace DataControl.HiDoctor_ReportsFactoryClasses
{
    public class DAL_DLReports : DapperRepository
    {
        #region Constant Strings
        const string USP_HD_GETSPECIALITYWISEEDETAILING = "USP_HD_GetSpecialityWiseEdetailing";
        const string USP_HD_GETASSERTDETAILS = "usp_hd_getAssertDetails";
        const string USP_HD_GETASSETWISEEDETAILING = "Usp_hd_getassetwiseedetailing";
        const string USP_HD_GETDOCTORDETAILS = "Usp_hd_getDoctordetails";
        const string USP_HD_GETCATEGORYINFO = "USP_HD_GetCategoryInfo";
        const string USP_ED_CATEGORYWISETOP10REPORT = "USP_ED_CategoryWiseTop10Report";
        const string USP_HD_GETSPECIALITYINFO = "USP_HD_GetSpecialityInfo";
        const string USP_ED_SPECIALITYWISETOP10REPORT = "USP_ED_SpecialityWiseTop10Report";
        #endregion Constant Strings

        Data _objData;
        SPData _objSPData;
        public List<Speciality> GetSpeciality(string subDomainName)
        {
            List<Speciality> lstSpeciality = new List<Speciality>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstSpeciality = connection.Query<Speciality>(USP_HD_GETSPECIALITYINFO, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
                return lstSpeciality;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<CustomerWiseReport> GetSpecialityWiseAnalyticsReport(string RegionCode, string spl_Name, int Spl_Month, int Spl_Year, int IsTeam, string subDomainName)
        {
            List<CustomerWiseReport> lstsplRpt = new List<CustomerWiseReport>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Code", RegionCode);
                    p.Add("@Spl_Name", spl_Name);
                    p.Add("@Spl_Month", Spl_Month);
                    p.Add("@Spl_Year", Spl_Year);
                    p.Add("@IsReprting_Region", IsTeam);
                    lstsplRpt = connection.Query<CustomerWiseReport>(USP_ED_SPECIALITYWISETOP10REPORT, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
            return lstsplRpt;
        }
        public List<POBReportCount> GetPOBSummaryCount(string User_Code, DateTime Actual_Date, string company_Code)
        {
            List<MVCModels.POBReportCount> lspobCount = new List<MVCModels.POBReportCount>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    DynamicParameters parameter = new DynamicParameters();
                    parameter.Add("@dcr_Date", Actual_Date);
                    parameter.Add("@user_Code", User_Code);
                    parameter.Add("@company_Code", company_Code);
                    lspobCount = connection.Query<POBReportCount>("HD_SP_GetPOBSummaryCount", parameter, commandType: CommandType.StoredProcedure).ToList();

                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return lspobCount;
        }
        #region Top 10 Asset-CategoryWise
        public List<Category> GetCategory(string subDomainName)
        {
            List<Category> lstCategory = new List<Category>();
            using (IDbConnection connection = IDbOpenConnection())
            {
                lstCategory = connection.Query<Category>(USP_HD_GETCATEGORYINFO, commandType: CommandType.StoredProcedure).ToList();
                connection.Close();
            }
            return lstCategory;
        }
        public List<CustomerWiseReport> GetCategoryWiseAnalyticsReport(string RegionCode, string Category_Name, int Category_Month, int Category_Year, int IsTeam, string subDomainName)
        {
            List<CustomerWiseReport> lstCatRpt = new List<CustomerWiseReport>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Code", RegionCode);
                    p.Add("@Category_Name", Category_Name);
                    p.Add("@Category_Month", Category_Month);
                    p.Add("@Category_Year", Category_Year);
                    p.Add("@IsReprting_Region", IsTeam);
                    lstCatRpt = connection.Query<CustomerWiseReport>(USP_ED_CATEGORYWISETOP10REPORT, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
            return lstCatRpt;
        }
        #endregion Top 10 Asset-CategoryWise
        #region specialityWise-Edetailing

        public DataSet GetSpecialityWiseEdetailing(string RegionCode, string subDomainName, string period, string IsTeam)
        {
            DataSet ds;
            _objData = new Data();
            _objSPData = new SPData();
            try
            {
                SqlCommand command = new SqlCommand(USP_HD_GETSPECIALITYWISEEDETAILING);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, RegionCode);
                _objSPData.AddParamToSqlCommand(command, "@period", ParameterDirection.Input, SqlDbType.VarChar, 30, period);
                _objSPData.AddParamToSqlCommand(command, "@IsTeam", ParameterDirection.Input, SqlDbType.VarChar, 30, IsTeam);
                _objData.OpenConnection(subDomainName);
                ds = _objData.ExecuteDataSet(command);
                _objData.CloseConnection();
                return SpecialityWiseTableCeation(ds);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public DataSet SpecialityWiseTableCeation(DataSet SWreport)
        {
            try
            {
                DataColumnCollection sp_col = SWreport.Tables[0].Columns;

                //category_name 
                foreach (var item in sp_col)
                {
                    if (item.ToString() == "No Record Found")
                        return SWreport;
                    for (int i = 0; i < SWreport.Tables[1].Rows.Count; i++)
                    {
                        if (item.ToString() == SWreport.Tables[1].Rows[i]["category_code"].ToString())
                            SWreport.Tables[0].Columns[item.ToString()].ColumnName = item.ToString() + "~" + SWreport.Tables[1].Rows[i]["category_name"].ToString();
                    }
                }
                //speciality_name
                for (int i = 0; i < SWreport.Tables[0].Rows.Count; i++)
                {
                    for (int j = 0; j < SWreport.Tables[2].Rows.Count; j++)
                    {
                        if (SWreport.Tables[0].Rows[i]["speciality"].ToString() == SWreport.Tables[2].Rows[j]["speciality_code"].ToString())
                            SWreport.Tables[0].Rows[i]["speciality"] = SWreport.Tables[0].Rows[i]["speciality"].ToString() + "~" + SWreport.Tables[2].Rows[j]["speciality_name"].ToString();
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return SWreport;
        }
        public DataSet GetAssertDetails(string regionCode, string speciality_Code, string category_Code, string period, string subDomainName)
        {
            DataSet ds;
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(USP_HD_GETASSERTDETAILS);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@period", ParameterDirection.Input, SqlDbType.Date, 30, period);
                _objSPData.AddParamToSqlCommand(command, "@category_code", ParameterDirection.Input, SqlDbType.VarChar, 30, category_Code);
                _objSPData.AddParamToSqlCommand(command, "@speciality_code", ParameterDirection.Input, SqlDbType.VarChar, 30, speciality_Code);
                _objSPData.AddParamToSqlCommand(command, "@region_code", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                _objData.OpenConnection(subDomainName);
                ds = _objData.ExecuteDataSet(command);
                _objData.CloseConnection();
                return ds;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public DataSet GetAssetWiseEdetailing(string RegionCode, string subDomainName, string period, string IsTeam)
        {
            DataSet ds;
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(USP_HD_GETASSETWISEEDETAILING);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, RegionCode);
                _objSPData.AddParamToSqlCommand(command, "@period", ParameterDirection.Input, SqlDbType.VarChar, 30, period);
                _objSPData.AddParamToSqlCommand(command, "@IsTeam", ParameterDirection.Input, SqlDbType.VarChar, 30, IsTeam);
                _objData.OpenConnection(subDomainName);
                ds = _objData.ExecuteDataSet(command);
                _objData.CloseConnection();
                return AssetWiseTableCeation(ds);
                // return ds;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public DataSet AssetWiseTableCeation(DataSet SWreport)
        {
            try
            {

                DataColumnCollection sp_col = SWreport.Tables[0].Columns;

                //category_name 
                foreach (var item in sp_col)
                {
                    if (item.ToString() == "No Record Found")
                        return SWreport;
                    for (int i = 0; i < SWreport.Tables[1].Rows.Count; i++)
                    {
                        if (item.ToString() == SWreport.Tables[1].Rows[i]["category_code"].ToString())
                            SWreport.Tables[0].Columns[item.ToString()].ColumnName = item.ToString() + "~" + SWreport.Tables[1].Rows[i]["category_name"].ToString();
                    }

                }
                //speciality_name
                for (int i = 0; i < SWreport.Tables[0].Rows.Count; i++)
                {
                    for (int j = 0; j < SWreport.Tables[2].Rows.Count; j++)
                    {
                        if (SWreport.Tables[0].Rows[i]["Asset Name"].ToString() == SWreport.Tables[2].Rows[j]["da_code"].ToString())
                        {
                            SWreport.Tables[0].Rows[i]["Asset Name"] = SWreport.Tables[0].Rows[i]["Asset Name"].ToString() + "~" + SWreport.Tables[2].Rows[j]["DA_Name"].ToString();
                            SWreport.Tables[0].Rows[i]["Da_Type"] = SWreport.Tables[2].Rows[j]["DA_Type"].ToString();
                        }

                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return SWreport;
        }
        public DataSet GetDoctorDetails(string regionCode, string da_code, string category_Code, string period, string subDomainName)
        {
            DataSet ds;
            _objData = new Data();
            _objSPData = new SPData();
            try
            {
                SqlCommand command = new SqlCommand(USP_HD_GETDOCTORDETAILS);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@period", ParameterDirection.Input, SqlDbType.Date, 30, period);
                _objSPData.AddParamToSqlCommand(command, "@category_code", ParameterDirection.Input, SqlDbType.VarChar, 30, category_Code);
                _objSPData.AddParamToSqlCommand(command, "@da_code", ParameterDirection.Input, SqlDbType.Int, 100, da_code);
                _objSPData.AddParamToSqlCommand(command, "@region_code", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                _objData.OpenConnection(subDomainName);
                ds = _objData.ExecuteDataSet(command);
                _objData.CloseConnection();
                return ds;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #endregion specialityWise-Edetailing





    }
}
