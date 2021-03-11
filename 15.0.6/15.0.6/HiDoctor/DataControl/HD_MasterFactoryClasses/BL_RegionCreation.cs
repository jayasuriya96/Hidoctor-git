using MVCModels;
using MVCModels.OutputJson;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace DataControl.HD_MasterFactoryClasses
{
    public class BL_RegionCreation
    {
        DAL_RegionCreation _objDal = new DAL_RegionCreation();
        public List<UnderRegion> GetUnderRegions(string companyCode, string regioncode, string divisionName, string divisionCode)
        {
            List<UnderRegion> lstunderreg = null;
            try
            {
                DAL_RegionCreation _objDal = new DAL_RegionCreation();
                lstunderreg = _objDal.GetUnderRegions(companyCode, regioncode, divisionName, divisionCode);
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstunderreg;
        }
        public List<UnderRegion> GetRegions(string companyCode)
        {
            List<UnderRegion> lstreg = null;
            try
            {
                DAL_RegionCreation _objDal = new DAL_RegionCreation();
                lstreg = _objDal.GetRegions(companyCode);
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstreg;
        }
        public List<RegionType> GetRegionType(string companyCode)
        {
            List<RegionType> lstregtype = null;
            try
            {
                DAL_RegionCreation _objDal = new DAL_RegionCreation();
                lstregtype = _objDal.GetRegionType(companyCode);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstregtype;
        }
        public List<RegionClassification> GetRegionClass(string companyCode)
        {
            List<RegionClassification> lstregtype = null;
            try
            {
                DAL_RegionCreation _objDal = new DAL_RegionCreation();
                lstregtype = _objDal.GetRegionClass(companyCode);
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstregtype;
        }
        public List<ExpenseGroup> GetExpenseGroup(string companyCode)
        {
            List<ExpenseGroup> lstregtype = null;
            try
            {
                DAL_RegionCreation _objDal = new DAL_RegionCreation();
                lstregtype = _objDal.GetExpenseGroup(companyCode);
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstregtype;
        }
        public List<Divisions> GetDivisions(string companyCode, string UserCode)
        {
            List<Divisions> lstdiv = null;
            try
            {
                DAL_RegionCreation _objDal = new DAL_RegionCreation();
                lstdiv = _objDal.GetDivisions(companyCode, UserCode);
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstdiv;
        }
      
        public List<Deport> GetDepo(string companyCode)
        {
            List<Deport> lstdeport = null;
            try
            {
                DAL_RegionCreation _objDal = new DAL_RegionCreation();
                lstdeport = _objDal.GetDepo(companyCode);
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstdeport;
        }
        public bool InsertRegions(string companycode, string UserCode, string regionCode, string Companyid, string Region_Name, string Under_Region_Code, string Under_Region_Id, string Region_Type_Code, string Region_Classification_Code, string Expense_Group_Id, string Country, string State, string City, string Local_Area,string Primary_Division,string Ref_Key1,string Ref_Key2,string Depot_Code)
        {
            bool result = false;
            try
            {

                DAL_RegionCreation _objDal = new DAL_RegionCreation();
                result = _objDal.InsertRegions(companycode, UserCode, regionCode, Companyid, Region_Name, Under_Region_Code, Under_Region_Id, Region_Type_Code, Region_Classification_Code, Expense_Group_Id, Country, State, City, Local_Area, Primary_Division, Ref_Key1, Ref_Key2, Depot_Code);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }
        public List<PriceGroup> GetPriceGroup(string companyCode)
        {
            List<PriceGroup> lstpricegrp = null;
            try
            {
                DAL_RegionCreation _objDal = new DAL_RegionCreation();
                lstpricegrp = _objDal.GetPriceGroup(companyCode);
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstpricegrp;
        }
        public List<Weekend> GetWeekends(string companyCode)
        {
            List<Weekend> lstWeekend = null;
            try
            {
                DAL_RegionCreation _objDal = new DAL_RegionCreation();
                lstWeekend = _objDal.GetWeekends(companyCode);
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstWeekend;
        }
        public List<UnderRegion> Getregionsforholiday(string companyCode, string Under_Region_Code)
        {
            List<UnderRegion> lstregionholiday = null;
            try
            {
                DAL_RegionCreation _objDal = new DAL_RegionCreation();
                lstregionholiday = _objDal.Getregionsforholiday(companyCode, Under_Region_Code);
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstregionholiday;
        }
        public HolidayInfoModel GetHolidays(string companyCode, string Region_Code)
        {
            HolidayInfoModel lstregionholiday = null;
            try
            {
                DAL_RegionCreation _objDal = new DAL_RegionCreation();
                lstregionholiday = _objDal.GetHolidays(companyCode, Region_Code);
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstregionholiday;
        }
        public List<Holiday> GetHolidayDateOnYear(string SelectedYear,string RegionCode)
        {
            List<Holiday> lstregionholiday = null;
            try
            {
                DAL_RegionCreation _objDal = new DAL_RegionCreation();
                lstregionholiday = _objDal.GetHolidayDateOnYear(SelectedYear, RegionCode);
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstregionholiday;
        }
        public bool SaveMapping(string companycode, string UserCode, string regionCode, string Companyid, string Weekend_Code, string Price_group_code, string Region_Lock, string Chemist_Lock, string Region_Type_Code, string Effective_From, string Effective_To_Month, string Effective_To_Year, string divisionCode, string holiday_Code, string holiday_name)
        {
            bool result = false;
            try
            {

                DAL_RegionCreation _objDal = new DAL_RegionCreation();
                result = _objDal.SaveMapping(companycode, UserCode, regionCode, Companyid, Weekend_Code, Price_group_code, Region_Lock, Chemist_Lock, Region_Type_Code, Effective_From, Effective_To_Month, Effective_To_Year,divisionCode, holiday_Code, holiday_name);
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        //Disable - Region Creation

        public List<UnderRegion> GetActiveRegions(string companyCode, string region_Code)
        {
            List<UnderRegion> lstactreg = null;
            try
            {
                DAL_RegionCreation _objDal = new DAL_RegionCreation();
                lstactreg = _objDal.GetActiveRegions(companyCode, region_Code);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstactreg;
        }

        public RegInfoModel GetRegionInfo(string companyCode, string Region_Code)
        {
            RegInfoModel lstreginfo = null;
            try
            {
                DAL_RegionCreation _objDal = new DAL_RegionCreation();
                lstreginfo = _objDal.GetRegionInfo(companyCode, Region_Code);
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstreginfo;
        }
        public List<RegionInfo> GetLeafRegions(string companyCode, string RegionCode)
        {
            List<RegionInfo> lstleafreg = null;
            try
            {
                DAL_RegionCreation _objDal = new DAL_RegionCreation();
                lstleafreg = _objDal.GetLeafRegions(companyCode, RegionCode);
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstleafreg;
        }
        public List<UnderRegion> GetReportingRegions(string companyCode, string RegionCode)
        {
            List<UnderRegion> lstreportingregion = null;
            try
            {
                DAL_RegionCreation _objDal = new DAL_RegionCreation();
                lstreportingregion = _objDal.GetReportingRegions(companyCode, RegionCode);
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstreportingregion;
        }
        public List<UnderRegion> GetSelUnderRegions(string companyCode, string RegionCode)
        {
            List<UnderRegion> lstreportingregion = null;
            try
            {
                DAL_RegionCreation _objDal = new DAL_RegionCreation();
                lstreportingregion = _objDal.GetSelUnderRegions(companyCode, RegionCode);
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstreportingregion;
        }
        public List<DCRDatemodel> GetDCRLastEnteredDate(string companyCode, string RegionCode)
        {
            List<DCRDatemodel> lstdcrdate = null;
            try
            {
                DAL_RegionCreation _objDal = new DAL_RegionCreation();
                lstdcrdate = _objDal.GetDCRLastEnteredDate(companyCode, RegionCode);
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstdcrdate;
        }
        public bool SaveReportingreg(string companyCode, List<Reportingreg> lstregdisable)
        {

            DataTable dtdisable = null;

            if (lstregdisable.Count >= 1)
            {
                dtdisable = new DataTable();
                dtdisable.Columns.Add("ID", typeof(int));
                dtdisable.Columns.Add("Reporting_Region_Code", typeof(string));
                dtdisable.Columns.Add("Reporting_Region_Name", typeof(string));
                dtdisable.Columns.Add("Reporting_Toregcode", typeof(string));
                dtdisable.Columns.Add("Reporting_Fromregcode", typeof(string));

                int j = 0;
                for (int i = 0; i < lstregdisable.Count; i++)
                {
                    j++;
                    dtdisable.Rows.Add(j, lstregdisable[i].Reporting_Region_Code, lstregdisable[i].Reporting_Region_Name, lstregdisable[i].Reporting_To_RegCode, lstregdisable[i].Reporting_ToRegName);
                }
            }

            return _objDal.SaveReportingreg(companyCode, lstregdisable, dtdisable);
        }


        public bool SaveDisableRegion(string companycode, string UserCode, string Companyid, string Disable_Date, string Region_Name, string Region_Code)
        {
            bool result = false;
            try
            {

                DAL_RegionCreation _objDal = new DAL_RegionCreation();
                result = _objDal.SaveDisableRegion(companycode, UserCode, Companyid, Disable_Date, Region_Name, Region_Code);
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        //Hierarchy
        public List<UnderRegion> GetAllRegions(string companyCode)
        {
            List<UnderRegion> lstactreg = null;
            try
            {
                DAL_RegionCreation _objDal = new DAL_RegionCreation();
                lstactreg = _objDal.GetAllRegions(companyCode);
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstactreg;
        }
        public List<UnderRegion> GetAllUnderRegions(string companyCode)
        {
            List<UnderRegion> lstactreg = null;
            try
            {
                DAL_RegionCreation _objDal = new DAL_RegionCreation();
                lstactreg = _objDal.GetAllUnderRegions(companyCode);
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstactreg;
        }
        public List<RegionType> GetAllRegionType(string companyCode)
        {
            List<RegionType> lstregtype = null;
            try
            {
                DAL_RegionCreation _objDal = new DAL_RegionCreation();
                lstregtype = _objDal.GetAllRegionType(companyCode);
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstregtype;
        }
        public RegionCreationModelRCW GetRegionDetails(string companyCode, string regioncode)
        {
            RegionCreationModelRCW lstregdetails = null;
            try
            {
                DAL_RegionCreation _objDal = new DAL_RegionCreation();
                lstregdetails = _objDal.GetRegionDetails(companyCode, regioncode);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstregdetails;
        }
        public bool EditRegions(string companycode, string UserCode, string Companyid, string regionCode, string Under_Region_Code, string Region_Type_Code, string Under_Region_Id, string Region_Classification_Code, string Expense_Group_Id, string Country, string State, string City, string Local_Area, string Division_Code, string Region_Name, string Notional_Territory,string Primary_Division,string Ref_Key1,string Ref_Key2,string Depot_Name,string Depot_Code)
        {
            bool result = false;
            try
            {

                DAL_RegionCreation _objDal = new DAL_RegionCreation();
                result = _objDal.EditRegions(companycode, UserCode, Companyid, regionCode, Under_Region_Code, Region_Type_Code, Under_Region_Id, Region_Classification_Code, Expense_Group_Id, Country, State, City, Local_Area, Division_Code, Region_Name, Notional_Territory, Primary_Division,Ref_Key1,Ref_Key2, Depot_Name, Depot_Code);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        public bool CheckDuplicateRegion(string companyCode,string Region_Name, string Region_Code)
        {
            bool result = false;
            try
            {
                DAL_RegionCreation _objDal = new DAL_RegionCreation();
                result = _objDal.CheckDuplicateRegion(companyCode, Region_Name, Region_Code);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        public RegionMigrationModel GetRegionMigrationDetails(string Region_Name)
        {
            try
            {

                DAL_RegionCreation _objDal = new DAL_RegionCreation();
                return _objDal.GetRegionMigrationDetails(Region_Name);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

    }
}
