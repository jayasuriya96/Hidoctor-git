using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using MVCModels;

namespace DataControl
{
    public class BLAdminDashboard : AdminDashboardModel
    {

        DataControl.DALAdminDashboard _objDALAdminDashboard;

        public BLAdminDashboard()
        {
            _objDALAdminDashboard = new DALAdminDashboard();
        }



        #region Admin Dashboard Methods

        public MVCModels.AdminDashboardCountModel GetAdminDashboardLiveCounts()
        {
            _objDALAdminDashboard._adminDashboard.CompanyCode = CompanyCode;
            _objDALAdminDashboard._adminDashboard.UserCode = UserCode;
            return _objDALAdminDashboard.GetAdminDashboardLiveCounts();
        }

        public IEnumerable<EmployeeBirthdayPopUp> GetEmployeeBirthdayPopUp()
        {
            _objDALAdminDashboard._adminDashboard.CompanyCode = CompanyCode;
            return _objDALAdminDashboard.GetEmployeeBirthdayPopUp();
        }

        public IEnumerable<DDL_Division> GetDivisions()
        {
            _objDALAdminDashboard._adminDashboard.CompanyCode = CompanyCode;
            _objDALAdminDashboard._adminDashboard.UserCode = UserCode;
            return _objDALAdminDashboard.GetDivisions();
        }


        public IEnumerable<tbl_OpenPosition> GetOpenPositionCount()
        {
            _objDALAdminDashboard._adminDashboard.CompanyCode = CompanyCode;
            _objDALAdminDashboard._adminDashboard.RegionCode = RegionCode;
             return _objDALAdminDashboard.GetLstVacant();
        }
        //public IEnumerable<tbl_VacantPopUP> GetPopUpOpenPosition()
       public IEnumerable<tbl_VacantPopUP> GetPopUpOpenPosition()
        {
            _objDALAdminDashboard._adminDashboard.CompanyCode = CompanyCode;
            _objDALAdminDashboard._adminDashboard.RegionCode = RegionCode;
            _objDALAdminDashboard._adminDashboard.DivisionCode = DivisionCode;
             return _objDALAdminDashboard.GetOpenPositionPopUp();
          
        }

        public IEnumerable<tbl_JoinerVsAttrition> GetJoinerAttrition()
        {
            _objDALAdminDashboard._adminDashboard.CompanyCode = CompanyCode;
            _objDALAdminDashboard._adminDashboard.UserCode = UserCode;
            return _objDALAdminDashboard.GetJoinerAttrition();
        }

        public List<tbl_JoinerAttrition> GetJoinerAttritionPopUp()
        {
            _objDALAdminDashboard._adminDashboard.CompanyCode = CompanyCode;
            _objDALAdminDashboard._adminDashboard.UserCode = UserCode;
            _objDALAdminDashboard._adminDashboard.Month = Month;
            _objDALAdminDashboard._adminDashboard.Year = Year;
            _objDALAdminDashboard._adminDashboard.JA_Wise = JA_Wise;
            List<tbl_JoinerAttrition> lstJA = _objDALAdminDashboard.GetJoinerAttritionPopUp().ToList();

            return lstJA;
        }


        public IEnumerable<tbl_PrimarySecondaryTarget> GetPrimarySecondarywithTarget()
        {
            _objDALAdminDashboard._adminDashboard.CompanyCode = CompanyCode;
            _objDALAdminDashboard._adminDashboard.UserCode = UserCode;
            _objDALAdminDashboard._adminDashboard.DivisionCode = DivisionCode;
            return _objDALAdminDashboard.GetPrimarySecondarywithTarget();
        }




        public TopTenSalesProduct GetTopTenProduct()
        {
            TopTenSalesProduct _objTopTenSales = new TopTenSalesProduct();

            DataTable dt;
            _objDALAdminDashboard._adminDashboard.CompanyCode = CompanyCode;
            _objDALAdminDashboard._adminDashboard.UserCode = UserCode;
            _objDALAdminDashboard._adminDashboard.DivisionCode = DivisionCode;
            _objDALAdminDashboard._adminDashboard.IsPS = IsPS;
            dt = _objDALAdminDashboard.GetTopTenProduct();
            if (dt != null && dt.Rows.Count > 0)
            {
                _objTopTenSales.lstTenSalesProductColumns = (from dc in dt.Columns.Cast<DataColumn>()
                                                             select new tbl_TenSalesProductColumns { columns = dc.ColumnName }).ToList();
            }

            if (_objTopTenSales == null || _objTopTenSales.lstTenSalesProductColumns == null)
                return _objTopTenSales;

            switch (_objTopTenSales.lstTenSalesProductColumns.Count)
            {
                case 2:
                    _objTopTenSales.lstTenSalesProduct = (from DataRow row in dt.Rows
                                                          select new tbl_TenSalesProduct
                                                          {
                                                              productName = row["Product_Name"].ToString(),
                                                              month1 = row[_objTopTenSales.lstTenSalesProductColumns[1].columns].ToString()
                                                          }).ToList();
                    break;
                case 3:
                    _objTopTenSales.lstTenSalesProduct = (from DataRow row in dt.Rows
                                                          select new tbl_TenSalesProduct
                                                          {
                                                              productName = row["Product_Name"].ToString(),
                                                              month1 = row[_objTopTenSales.lstTenSalesProductColumns[1].columns].ToString(),
                                                              month2 = row[_objTopTenSales.lstTenSalesProductColumns[2].columns].ToString()
                                                          }).ToList();
                    break;
                case 4:
                    _objTopTenSales.lstTenSalesProduct = (from DataRow row in dt.Rows
                                                          select new tbl_TenSalesProduct
                                                          {
                                                              productName = row["Product_Name"].ToString(),
                                                              month1 = row[_objTopTenSales.lstTenSalesProductColumns[1].columns].ToString(),
                                                              month2 = row[_objTopTenSales.lstTenSalesProductColumns[2].columns].ToString(),
                                                              month3 = row[_objTopTenSales.lstTenSalesProductColumns[3].columns].ToString()
                                                          }).ToList();
                    break;
            }
            return _objTopTenSales;
        }


        public object GetDcrTPLockCounts()
        {
            _objDALAdminDashboard._adminDashboard.CompanyCode = CompanyCode;
            _objDALAdminDashboard._adminDashboard.UserCode = UserCode;
            _objDALAdminDashboard._adminDashboard.DcrTpLockStatus = DcrTpLockStatus;
            _objDALAdminDashboard._adminDashboard.Lock_Type = Lock_Type;
            List<tbl_DCR_TP_LockDetails> lstDcrTpDetails = _objDALAdminDashboard.GetDcrTPLockDetails().ToList();

            tbl_GetCounts _objCounts = new tbl_GetCounts
            {
                LockedUserCount = lstDcrTpDetails.GroupBy(a => a.User_Code).Select(grp => grp.First()).Count().ToString(),
                LockedCount = lstDcrTpDetails.Count().ToString()
            };

            return _objCounts;
        }


        public object GetDcrTPLockPopUpDetails()
        {
            _objDALAdminDashboard._adminDashboard.CompanyCode = CompanyCode;
            _objDALAdminDashboard._adminDashboard.UserCode = UserCode;
            _objDALAdminDashboard._adminDashboard.DcrTpLockStatus = DcrTpLockStatus;
            _objDALAdminDashboard._adminDashboard.Lock_Type = Lock_Type;
            List<tbl_DCR_TP_LockDetails> lstDcrTpDetails = _objDALAdminDashboard.GetDcrTPLockDetails().ToList();

            lstDcrTpDetails.ForEach(x => x.Division_Name = GetDivisionName(x.User_Code));

            return lstDcrTpDetails;
        }


        private string GetDivisionName(string userCode)
        {
            string str = string.Empty;

            List<DDL_Division> lstDivisions = _objDALAdminDashboard.GetDivisions().ToList();

            List<tbl_EntityMapping> lstEntityMap = _objDALAdminDashboard.GetlstEntityMapping().ToList();
            var lstData = (from d in lstDivisions
                           join e in lstEntityMap on d.Division_Code equals e.Division_Code
                           where e.Entity_Code == userCode
                           select new { d.Division_Name }).ToList();


            for (int i = 0; i < lstData.Count; i++)
            {
                if (i == 0)
                {
                    str += lstData[i].Division_Name;
                }
                else
                {
                    str += "," + lstData[i].Division_Name;
                }
            }

            return str;
        }


        public MVCModels.DashBoardDoctorVisitSummaryandTotalCount GetAdminDashboardDoctorVisitSummary()
        {
            _objDALAdminDashboard._adminDashboard.CompanyCode = CompanyCode;
            _objDALAdminDashboard._adminDashboard.UserCode = UserCode;
            _objDALAdminDashboard._adminDashboard.RegionCode = RegionCode;
            _objDALAdminDashboard._adminDashboard.IsCurrent = IsCurrent;
            _objDALAdminDashboard._adminDashboard.DivisionCode = DivisionCode;
            _objDALAdminDashboard._adminDashboard.Mode = Mode;
            _objDALAdminDashboard._adminDashboard.PageNo = PageNo;
            _objDALAdminDashboard._adminDashboard.Pagesize = Pagesize;
            return _objDALAdminDashboard.GetAdminDashboardDoctorVisitSummary();
        }

        public IEnumerable<MVCModels.DashboardCategoryWiseDoctorVisit> GetAdminDashboardCategoryWiseVisits(string companyCode, string userCode, string regionCode, string category, string speciality, string divisionCode, int CategoryMode)
        {
            _objDALAdminDashboard._adminDashboard.IsCurrent = IsCurrent;
            return _objDALAdminDashboard.GetAdminDashboardCategoryWiseVisits(companyCode, userCode, regionCode, category, speciality, divisionCode, CategoryMode);
        }


        public string GetCategoryName(string Category_Code)
        {
            string str = string.Empty;

            _objDALAdminDashboard._adminDashboard.CompanyCode = CompanyCode;
            List<tbl_lstCategory> lstCategory = _objDALAdminDashboard.GetLstCategoryCodeName().ToList();

            string[] arrCategoryCode = Category_Code.Split(',');

            for (int i = 0; i < arrCategoryCode.Length; i++)
            {
                if (i == 0)
                {
                    str = lstCategory.Where(x => x.Category_Code == arrCategoryCode[i]).Select(s => s.Category_Name).SingleOrDefault().ToString();
                }
                else
                {
                    str += "," + lstCategory.Where(x => x.Category_Code == arrCategoryCode[i]).Select(s => s.Category_Name).SingleOrDefault().ToString();
                }
            }

            return str;

        }


        public string GetSpecialityName(string Speciality_Code)
        {
            string str = string.Empty;

            _objDALAdminDashboard._adminDashboard.CompanyCode = CompanyCode;
            List<tbl_lstSpeciality> lstSpeciality = _objDALAdminDashboard.GetLstSpecialityCodeName().ToList();

            string[] arrSpecialityCode = Speciality_Code.Split(',');

            for (int i = 0; i < arrSpecialityCode.Length; i++)
            {
                if (i == 0)
                {
                    str = lstSpeciality.Where(x => x.Speciality_Code == arrSpecialityCode[i]).Select(s => s.Speciality_Name).SingleOrDefault().ToString();
                }
                else
                {
                    str += "," + lstSpeciality.Where(x => x.Speciality_Code == arrSpecialityCode[i]).Select(s => s.Speciality_Name).SingleOrDefault().ToString();
                }
            }

            return str;

        }


        public tbl_CampaignCounts GetMarketingCampaignCount()
        {
            _objDALAdminDashboard._adminDashboard.CompanyCode = CompanyCode;
            _objDALAdminDashboard._adminDashboard.UserCode = UserCode;
            _objDALAdminDashboard._adminDashboard.RegionCode = RegionCode;
            return _objDALAdminDashboard.GetMarketingCampaignCount();
        }

        public object GetMarketingCampaignCountPopUp()
        {
            _objDALAdminDashboard._adminDashboard.CompanyCode = CompanyCode;
            _objDALAdminDashboard._adminDashboard.RegionCode = RegionCode;
            return _objDALAdminDashboard.GetMarketingCampaignDetails();
        }

        public object GetMarketingCampaignRegionPopUP()
        {
            _objDALAdminDashboard._adminDashboard.Campaign_Code = Campaign_Code;
            _objDALAdminDashboard._adminDashboard.RegionCode = RegionCode;
            return _objDALAdminDashboard.GetMarketingCampaignRegionPopUP();
        }

        public object GetMarketingCampaignDetailsForDoctor()
        {
            _objDALAdminDashboard._adminDashboard.RegionCode = RegionCode;
            _objDALAdminDashboard._adminDashboard.Campaign_Code = Campaign_Code;
            _objDALAdminDashboard._adminDashboard.Created_By = Created_By;
            return _objDALAdminDashboard.GetMarketingCampaignDetailsForDoctor();
        }




        public List<DCRCompliance> GetDCRCompliance()
        {
            _objDALAdminDashboard._adminDashboard.CompanyCode = CompanyCode;
            _objDALAdminDashboard._adminDashboard.UserCode = UserCode;
            _objDALAdminDashboard._adminDashboard.MonthType = MonthType;
            List<DCRCompliance> lstcom = new List<DCRCompliance>();
            lstcom = _objDALAdminDashboard.GetDCRCompliance().ToList();
            return lstcom;
        }

        public object GetDCRCompliancePopUp()
        {
            _objDALAdminDashboard._adminDashboard.CompanyCode = CompanyCode;
            _objDALAdminDashboard._adminDashboard.UserCode = UserCode;
            _objDALAdminDashboard._adminDashboard.MonthType = MonthType;
            _objDALAdminDashboard._adminDashboard.Division_Name = Division_Name;
            _objDALAdminDashboard._adminDashboard.User_Type = User_Type;
            List<tbl_DcrCompliance> lstCompliance = new List<tbl_DcrCompliance>();
            return _objDALAdminDashboard.GetDCRCompliancePopUp().ToList();

        }

        #endregion

        public List<CategoryNew> GetNewCategoryCoverage()
        {
            _objDALAdminDashboard._adminDashboard.CompanyCode = CompanyCode;
            _objDALAdminDashboard._adminDashboard.RegionCode = RegionCode;
            _objDALAdminDashboard._adminDashboard.Division_Name = Division_Name;
            _objDALAdminDashboard._adminDashboard.Month = Month;
            _objDALAdminDashboard._adminDashboard.Year = Year;
            return _objDALAdminDashboard.GetNewCategoryCoverage();
        }
        public List<CategoryNewSummary> GetNewCategoryCoverageSummary()
        {
            _objDALAdminDashboard._adminDashboard.CompanyCode = CompanyCode;
            _objDALAdminDashboard._adminDashboard.RegionCode = RegionCode;
            _objDALAdminDashboard._adminDashboard.Division_Name = Division_Name;
            _objDALAdminDashboard._adminDashboard.Month = Month;
            _objDALAdminDashboard._adminDashboard.Year = Year;
            _objDALAdminDashboard._adminDashboard.Option_Type = Option_Type;
            return _objDALAdminDashboard.GetNewCategoryCoverageSummary();


        }
        public List<CategoryNewSummary_Drill> GetNewCategoryCoverageSummary_Drill()
        {
            _objDALAdminDashboard._adminDashboard.CompanyCode = CompanyCode;
            _objDALAdminDashboard._adminDashboard.Month = Month;
            _objDALAdminDashboard._adminDashboard.Year = Year;
            _objDALAdminDashboard._adminDashboard.RegionCode = RegionCode;
            _objDALAdminDashboard._adminDashboard.Option_Type = Option_Type;
            return _objDALAdminDashboard.GetNewCategoryCoverageSummary_Drill();
        }
        public List<CategoryRegion> GetRegionCategoryCoverageSummery()
        {
            _objDALAdminDashboard._adminDashboard.CompanyCode = CompanyCode;
            _objDALAdminDashboard._adminDashboard.Month = Month;
            _objDALAdminDashboard._adminDashboard.Year = Year;
            _objDALAdminDashboard._adminDashboard.RegionCode = RegionCode;
            return _objDALAdminDashboard.GetRegionCategoryCoverageSummery();
        }
        public object GetDCRComplianceNew()
        {
            _objDALAdminDashboard._adminDashboard.CompanyCode = CompanyCode;
            _objDALAdminDashboard._adminDashboard.UserCode = UserCode;
            _objDALAdminDashboard._adminDashboard.MonthType = MonthType;
            _objDALAdminDashboard._adminDashboard.Division_Name = Division_Name;
            _objDALAdminDashboard._adminDashboard.User_Type = User_Type;
            return _objDALAdminDashboard.GetDCRComplianceDetailsNew().ToList();

        }
    }
}
