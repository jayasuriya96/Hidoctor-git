using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using Dapper;
using MVCModels;


namespace DataControl
{
    public class DALAdminDashboard : DapperRepository
    {


        public AdminDashboardModel _adminDashboard;

        public DALAdminDashboard()
        {
            _adminDashboard = new AdminDashboardModel();
        }



        #region Admin Dashboard



        public MVCModels.AdminDashboardCountModel GetAdminDashboardLiveCounts()
        {
            MVCModels.AdminDashboardCountModel _admin;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", _adminDashboard.CompanyCode);
                    p.Add("@User_Code", _adminDashboard.UserCode);
                    _admin = connection.Query<MVCModels.AdminDashboardCountModel>("asp_hd_GetDashboardLiveCounts", p, commandType: CommandType.StoredProcedure).SingleOrDefault();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return _admin;
        }


        public IEnumerable<EmployeeBirthdayPopUp> GetEmployeeBirthdayPopUp()
        {
            IEnumerable<EmployeeBirthdayPopUp> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", _adminDashboard.CompanyCode);
                    lstContent = connection.Query<MVCModels.EmployeeBirthdayPopUp>("SP_HD_EmployeeNotificationPopUp", p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", _adminDashboard.UserCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }

        public IEnumerable<DDL_Division> GetDivisions()
        {
            IEnumerable<DDL_Division> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", _adminDashboard.CompanyCode);
                    p.Add("@User_Code", _adminDashboard.UserCode);
                    lstContent = connection.Query<MVCModels.DDL_Division>("SP_HD_GetlstDivisions", p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", _adminDashboard.UserCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }


        public IEnumerable<tbl_PrimarySecondaryTarget> GetPrimarySecondarywithTarget()
        {
            IEnumerable<tbl_PrimarySecondaryTarget> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", _adminDashboard.CompanyCode);
                    p.Add("@User_Code", _adminDashboard.UserCode);
                    p.Add("@Division_Code", _adminDashboard.DivisionCode);
                    lstContent = connection.Query<MVCModels.tbl_PrimarySecondaryTarget>("SP_HD_GetlstPrimarySecondaryTarget", p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", _adminDashboard.UserCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }


        public IEnumerable<tbl_OpenPosition> GetLstVacant()
        {
            IEnumerable<tbl_OpenPosition> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", _adminDashboard.CompanyCode);
                    p.Add("@Region_Code", _adminDashboard.RegionCode);
                    lstContent = connection.Query<MVCModels.tbl_OpenPosition>("USP_APIhdGetOpenPosition_Summary", p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("aDMIN", _adminDashboard.CompanyCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }
        public IEnumerable<tbl_VacantPopUP> GetOpenPositionPopUp()
        {
            IEnumerable<tbl_VacantPopUP> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", _adminDashboard.CompanyCode);
                    p.Add("@Region_Code", _adminDashboard.RegionCode);
                    p.Add("@Division_Code", _adminDashboard.DivisionCode);
                    lstContent = connection.Query<MVCModels.tbl_VacantPopUP>("USP_APIhdGetOpenPosition_Drill", p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("aDMIN", _adminDashboard.CompanyCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }


        public IEnumerable<tbl_JoinerVsAttrition> GetJoinerAttrition()
        {
            IEnumerable<tbl_JoinerVsAttrition> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", _adminDashboard.CompanyCode);
                    p.Add("@User_Code", _adminDashboard.UserCode);
                    lstContent = connection.Query<MVCModels.tbl_JoinerVsAttrition>("USP_APIhdGetJoinersReleivers_Summary", p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", _adminDashboard.UserCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }



        public IEnumerable<tbl_JoinerAttrition> GetJoinerAttritionPopUp()
        {
            IEnumerable<tbl_JoinerAttrition> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", _adminDashboard.CompanyCode);
                    p.Add("@User_Code", _adminDashboard.UserCode);
                    p.Add("@Month", _adminDashboard.Month);
                    p.Add("@Year", _adminDashboard.Year);
                    p.Add("@Option", _adminDashboard.JA_Wise);
                    lstContent = connection.Query<MVCModels.tbl_JoinerAttrition>("USP_APIhdGetJoinersReleivers_Drill", p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", _adminDashboard.UserCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }



        public DataTable GetTopTenProduct()
        {
            DataTable dt = new DataTable();
            try
            {

                CurrentInfo _objCurrentInfo = new CurrentInfo();
                SqlDataAdapter da = new SqlDataAdapter();
                SqlConnection con = new SqlConnection();
                con.ConnectionString = _objCurrentInfo.GetConnectionString();
                con.Open();
                SqlCommand Command = new SqlCommand();
                Command.Parameters.Clear();
                Command.CommandType = CommandType.StoredProcedure;
                if (_adminDashboard.IsPS)
                {
                    Command.CommandText = "SP_HD_GetlstTopTenPrimarySalesProduct";
                }
                else
                {
                    Command.CommandText = "SP_HD_GetlstTopTenSecondarySalesProduct";
                }
                Command.Parameters.AddWithValue("@User_Code", _adminDashboard.UserCode);
                Command.Parameters.AddWithValue("@Company_Code", _adminDashboard.CompanyCode);
                Command.Parameters.AddWithValue("@Division_Code", _adminDashboard.DivisionCode);
                Command.Connection = con;

                da = new SqlDataAdapter(Command);

                da.Fill(dt);
                con.Close();

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", _adminDashboard.UserCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return dt;
        }


        public IEnumerable<tbl_DCR_TP_LockDetails> GetDcrTPLockDetails()
        {
            IEnumerable<tbl_DCR_TP_LockDetails> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", _adminDashboard.CompanyCode);
                    p.Add("@User_Code", _adminDashboard.UserCode);
                    p.Add("@MonthStatus", _adminDashboard.DcrTpLockStatus);
                    p.Add("@Lock_Type", _adminDashboard.Lock_Type);
                    lstContent = connection.Query<MVCModels.tbl_DCR_TP_LockDetails>("SP_HD_GetDCR_TP_LockDetails", p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", _adminDashboard.UserCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }


        public IEnumerable<tbl_EntityMapping> GetlstEntityMapping()
        {
            IEnumerable<tbl_EntityMapping> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", _adminDashboard.CompanyCode);
                    lstContent = connection.Query<MVCModels.tbl_EntityMapping>("SP_HD_GetLstEntityMapping", p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", _adminDashboard.UserCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }

        public MVCModels.DashBoardDoctorVisitSummaryandTotalCount GetAdminDashboardDoctorVisitSummary()
        {
            MVCModels.DashBoardDoctorVisitSummaryandTotalCount Visits = new DashBoardDoctorVisitSummaryandTotalCount();
            List<MVCModels.DashboardDoctorVisitSummary> lstDocVisitSummary = new List<DashboardDoctorVisitSummary>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", _adminDashboard.CompanyCode);
                    p.Add("@User_Code", _adminDashboard.UserCode);
                    p.Add("@Region_Code", _adminDashboard.RegionCode);
                    p.Add("@IsCurrent", _adminDashboard.IsCurrent);
                    p.Add("@DivisionCode", _adminDashboard.DivisionCode);
                    p.Add("@Option_Type", _adminDashboard.Mode);
                    p.Add("@PageNo", _adminDashboard.PageNo);
                    p.Add("@Pagesize", _adminDashboard.Pagesize);
                    p.Add("@Totalcount", dbType: DbType.Int32, direction: ParameterDirection.Output);
                    lstDocVisitSummary = connection.Query<MVCModels.DashboardDoctorVisitSummary>("asp_hd_GetDashboardDoctorVisitSummary", p, commandType: CommandType.StoredProcedure).ToList();
                    Visits.Totalcount = p.Get<int>("@Totalcount");
                    Visits.lstDashboardDoctorVisitSummary = lstDocVisitSummary;
                }

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return Visits;
        }

        public IEnumerable<MVCModels.DashboardCategoryWiseDoctorVisit> GetAdminDashboardCategoryWiseVisits(string companyCode, string userCode, string regionCode, string category, string speciality, string divisionCode, int CategoryMode)
        {
            IEnumerable<MVCModels.DashboardCategoryWiseDoctorVisit> lstVisits;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    p.Add("@Region_Code", regionCode);
                    p.Add("@Category_Code", category);
                    p.Add("@Speciality_Code", speciality);
                    p.Add("@IsCurrent", _adminDashboard.IsCurrent);
                    p.Add("@DivisionCode", divisionCode);
                    p.Add("@Option_Type", CategoryMode);
                    lstVisits = connection.Query<MVCModels.DashboardCategoryWiseDoctorVisit>("asp_hd_GetCategoryWiseDoctorVisitForRegion", p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstVisits;
        }




        public tbl_CampaignCounts GetMarketingCampaignCount()
        {
            MVCModels.tbl_CampaignCounts campaignCounts;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", _adminDashboard.CompanyCode);
                    p.Add("@User_Code", _adminDashboard.UserCode);
                    p.Add("@Region_Code", _adminDashboard.RegionCode);
                    campaignCounts = connection.Query<MVCModels.tbl_CampaignCounts>("SP_HD_GetCampaignCount_New", p, commandType: CommandType.StoredProcedure).SingleOrDefault();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return campaignCounts;
        }


        public IEnumerable<MVCModels.MC_Details> GetMarketingCampaignDetails()
        {
            IEnumerable<MVCModels.MC_Details> lstVisits;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", _adminDashboard.CompanyCode);
                    p.Add("@Region_Code", _adminDashboard.RegionCode);
                    lstVisits = connection.Query<MVCModels.MC_Details>("Sp_hd_MarketingCamp_Detail", p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstVisits;

        }
        public IEnumerable<MVCModels.MC_RegionWise> GetMarketingCampaignRegionPopUP()
        {
            IEnumerable<MVCModels.MC_RegionWise> lstVisits;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Campaign_Code", _adminDashboard.Campaign_Code);
                    p.Add("@Region_Code", _adminDashboard.RegionCode);
                    lstVisits = connection.Query<MVCModels.MC_RegionWise>("Sp_hd_MarketingCamp_RegionWiseDetail", p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstVisits;

        }
        public IEnumerable<MVCModels.MC_Doctor_Details> GetMarketingCampaignDetailsForDoctor()
        {
            IEnumerable<MVCModels.MC_Doctor_Details> lstVisits;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Code", _adminDashboard.RegionCode);
                    p.Add("@Campaign_Code", _adminDashboard.Campaign_Code);
                    p.Add("@Created_By", _adminDashboard.Created_By);
                    lstVisits = connection.Query<MVCModels.MC_Doctor_Details>("Sp_hd_MarketingCamp_DoctorWiseDetail", p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstVisits;

        }

        public IEnumerable<MVCModels.tbl_lstCategory> GetLstCategoryCodeName()
        {
            IEnumerable<MVCModels.tbl_lstCategory> lstVisits;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", _adminDashboard.CompanyCode);
                    lstVisits = connection.Query<MVCModels.tbl_lstCategory>("SP_HD_GetLstCategoryCodeName", p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstVisits;
        }

        public IEnumerable<MVCModels.tbl_lstSpeciality> GetLstSpecialityCodeName()
        {
            IEnumerable<MVCModels.tbl_lstSpeciality> lstVisits;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", _adminDashboard.CompanyCode);
                    lstVisits = connection.Query<MVCModels.tbl_lstSpeciality>("SP_HD_GetLstSpecialityCodeName", p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstVisits;
        }

        public List<DCRCompliance> GetDCRCompliance()
        {
            List<DCRCompliance> lstcom = new List<DCRCompliance>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", _adminDashboard.CompanyCode);
                    p.Add("@User_Code", _adminDashboard.UserCode);
                    p.Add("@monthType", _adminDashboard.MonthType);
                    lstcom = connection.Query<MVCModels.DCRCompliance>("Sp_hd_getdcrcompliance_Summary", p, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstcom;
        }


        public IEnumerable<tbl_DcrCompliance> GetDCRComplianceDetails()
        {
            IEnumerable<MVCModels.tbl_DcrCompliance> lstVisits;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", _adminDashboard.CompanyCode);
                    p.Add("@User_Code", _adminDashboard.UserCode);
                    p.Add("@monthType", _adminDashboard.MonthType);
                    lstVisits = connection.Query<MVCModels.tbl_DcrCompliance>("Sp_hd_getdcrcompliancedetails", p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstVisits;
        }
        public List<CategoryNew> GetNewCategoryCoverage()
        {
            List<CategoryNew> lstcategory = new List<CategoryNew>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", _adminDashboard.CompanyCode);
                    p.Add("@Year", _adminDashboard.Year);
                    p.Add("@Month", _adminDashboard.Month);
                    p.Add("@Region_Code", _adminDashboard.RegionCode);
                    p.Add("@Division_Name", _adminDashboard.Division_Name);
                    lstcategory = connection.Query<CategoryNew>("USP_APIhdGetCustomerCoverage_SummaryDashboard", p, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch (Exception ex)
            {
                throw (ex);
            }
            return lstcategory;

        }
        public List<CategoryNewSummary> GetNewCategoryCoverageSummary()
        {
            List<CategoryNewSummary> lstSummery = new List<CategoryNewSummary>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", _adminDashboard.CompanyCode);
                    p.Add("@Year", _adminDashboard.Year);
                    p.Add("Month", _adminDashboard.Month);
                    p.Add("@Region_Code", _adminDashboard.RegionCode);
                    p.Add("@Division_Name", _adminDashboard.Division_Name);
                    p.Add("@Option_Type", _adminDashboard.Option_Type);
                    lstSummery = connection.Query<CategoryNewSummary>("USP_APIhdGetCustomerCoverage_Summary", p, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch (Exception ex)
            {
                throw (ex);
            }
            return lstSummery;

        }
        public List<CategoryNewSummary_Drill> GetNewCategoryCoverageSummary_Drill()
        {
            List<CategoryNewSummary_Drill> lstSummerydrill = new List<CategoryNewSummary_Drill>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", _adminDashboard.CompanyCode);
                    p.Add("@Year", _adminDashboard.Year);
                    p.Add("Month", _adminDashboard.Month);
                    p.Add("@Region_Code", _adminDashboard.RegionCode);
                    p.Add("@Option_Type", _adminDashboard.Option_Type);
                    lstSummerydrill = connection.Query<CategoryNewSummary_Drill>("USP_APIhdGetCustomerCoverage_Drill", p, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch (Exception ex)
            {
                throw (ex);
            }
            return lstSummerydrill;

        }
        public List<CategoryRegion> GetRegionCategoryCoverageSummery()
        {
            List<CategoryRegion> lstRegion = new List<CategoryRegion>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", _adminDashboard.CompanyCode);
                    p.Add("@Year", _adminDashboard.Year);
                    p.Add("@Month", _adminDashboard.Month);
                    p.Add("@Region_Code", _adminDashboard.RegionCode);
                    lstRegion = connection.Query<CategoryRegion>("USP_APIhdGetCustomerCoverage_RegionAggregation", p, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch (Exception ex)
            {
                throw (ex);
            }
            return lstRegion;

        }
        public IEnumerable<DcrComplianceNew> GetDCRComplianceDetailsNew()
        {
            IEnumerable<MVCModels.DcrComplianceNew> lstVisits;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", _adminDashboard.CompanyCode);
                    p.Add("@User_Code", _adminDashboard.UserCode);
                    p.Add("@monthType", _adminDashboard.MonthType);
                    p.Add("@User_Type", _adminDashboard.User_Type);
                    p.Add("@Division_Name", _adminDashboard.Division_Name);
                    lstVisits = connection.Query<MVCModels.DcrComplianceNew>("Sp_hd_getdcrcompliancedetailsNew", p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstVisits;
        }
        public IEnumerable<tbl_DcrCompliance> GetDCRCompliancePopUp()
        {
            IEnumerable<MVCModels.tbl_DcrCompliance> lstVisits;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", _adminDashboard.CompanyCode);
                    p.Add("@User_Code", _adminDashboard.UserCode);
                    p.Add("@monthType", _adminDashboard.MonthType);
                    p.Add("@Division_Name", _adminDashboard.Division_Name);
                    p.Add("@User_Type", _adminDashboard.User_Type);
                    lstVisits = connection.Query<MVCModels.tbl_DcrCompliance>("Sp_hd_getdcrcompliancepopup", p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstVisits;
        }

        #endregion

    }
}
