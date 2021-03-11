using DataControl;
using DataControl.HD_MasterFactoryClasses;
using MVCModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class RegionCreationController : Controller
    {
        private CurrentInfo _objCurrInfo = null;
        private Data _objData = new Data();
        // GET: /RegionCreation/
        BL_RegionCreation _objbl = new BL_RegionCreation();
        string region_Code = null;
       

        public ActionResult RegionCreation()
        {
           
            return View();
        }
        public ActionResult RegionCreationWizard()
        {
            _objCurrInfo = new CurrentInfo();
            ViewBag.CompanyCode = _objCurrInfo.GetCompanyCode();
            return View();
        }
        public ActionResult Disableregion()
        {
            _objCurrInfo = new CurrentInfo();
            ViewBag.CompanyCode = _objCurrInfo.GetCompanyCode();
            return View();
        }
        public ActionResult RegionHierarchy()
        {
            _objCurrInfo = new CurrentInfo();
            ViewBag.CompanyCode = _objCurrInfo.GetCompanyCode();
            return View();
        }

        #region Creation
        public JsonResult GetUnderRegions(string divisionName, string divisionCode)
        {
            string companyCode = null;
            string regioncode = null;
            List<UnderRegion> lstunderreg = null;
            try
            {
                _objCurrInfo = new CurrentInfo();
                companyCode = _objCurrInfo.GetCompanyCode();
                regioncode = _objCurrInfo.GetRegionCode();

                lstunderreg = _objbl.GetUnderRegions(companyCode, regioncode, divisionName, divisionCode).ToList();
                return Json(lstunderreg, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public JsonResult GetRegionType()
        {
            string companyCode = null;
            List<RegionType> lstregtype = null;
            try
            {
                _objCurrInfo = new CurrentInfo();
                companyCode = _objCurrInfo.GetCompanyCode();
                lstregtype = _objbl.GetRegionType(companyCode).ToList();
                return Json(lstregtype, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public JsonResult GetRegionClass()
        {
            string companyCode = null;
            List<RegionClassification> lstregtype = null;
            try
            {
                _objCurrInfo = new CurrentInfo();
                companyCode = _objCurrInfo.GetCompanyCode();
                lstregtype = _objbl.GetRegionClass(companyCode).ToList();
                return Json(lstregtype, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public JsonResult GetExpenseGroup()
        {
            string companyCode = null;
            List<ExpenseGroup> lstregtype = null;
            try
            {
                _objCurrInfo = new CurrentInfo();
                companyCode = _objCurrInfo.GetCompanyCode();
                lstregtype = _objbl.GetExpenseGroup(companyCode).ToList();
                return Json(lstregtype, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public JsonResult GetRegions()
        {
            string companyCode = null;
            List<UnderRegion> lstreg = null;
            try
            {
                _objCurrInfo = new CurrentInfo();
                companyCode = _objCurrInfo.GetCompanyCode();
                lstreg = _objbl.GetRegions(companyCode).ToList();
                return Json(lstreg, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public JsonResult GetDivisions()
        {
            string companyCode = null;
            string UserCode = null;
            List<Divisions> lstdivisions = null;
            try
            {
                _objCurrInfo = new CurrentInfo();
                companyCode = _objCurrInfo.GetCompanyCode();
                UserCode = _objCurrInfo.GetUserCode();
                lstdivisions = _objbl.GetDivisions(companyCode, UserCode).ToList();
                return Json(lstdivisions, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public JsonResult GetDepo()
        {
            string companyCode = null;
            try
            {
                _objCurrInfo = new CurrentInfo();
            companyCode = _objCurrInfo.GetCompanyCode();

            return Json(_objbl.GetDepo(companyCode), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        
        //public bool InsertRegions(string Region_Name, string Under_Region_Code, string Under_Region_Id, string Region_Type_Code, string Region_Classification_Code, string Expense_Group_Id, string Country, string State, string City, string Local_Area, string Weekend_Code, string Price_group_code, string Region_Lock, string Chemist_Lock, string Effective_From, string Effective_To_Month, string Effective_To_Year, string divisionCode, string holiday_Code, string holiday_name)
        public bool InsertRegions(RegionCreationChanges _objCreationChanges)
        {
            bool result = false;
            string companyCode = null;
            string UserCode = null;
            string Companyid = null;
            string regionCode = null;
            try
            {
                _objCurrInfo = new CurrentInfo();
                companyCode = _objCurrInfo.GetCompanyCode();
                UserCode = _objCurrInfo.GetUserCode();
                regionCode = _objData.GetMaxCode(companyCode, "tbl_SFA_Region_Master", "Region_Code", "REC");
                Companyid = _objCurrInfo.GetCompanyId();
                //result = _objbl.InsertRegions(companyCode, UserCode, regionCode, Companyid, Region_Name, Under_Region_Code, Under_Region_Id, Region_Type_Code, Region_Classification_Code, Expense_Group_Id, Country, State, City, Local_Area);
                result = _objbl.InsertRegions(companyCode, UserCode, regionCode, Companyid, _objCreationChanges.Region_Name, _objCreationChanges.Under_Region_Code, _objCreationChanges.Under_Region_Id, _objCreationChanges.Region_Type_Code, _objCreationChanges.Region_Classification_Code,
                    _objCreationChanges.Expense_Group_Id, _objCreationChanges.Country, _objCreationChanges.State, _objCreationChanges.City, _objCreationChanges.Local_Area,_objCreationChanges.Primary_Division, _objCreationChanges.Ref_Key1, _objCreationChanges.Ref_Key2, _objCreationChanges.Depot_Code);

                _objbl.SaveMapping(companyCode, UserCode, regionCode, Companyid, _objCreationChanges.Weekend_Code, _objCreationChanges.Price_group_code, _objCreationChanges.Region_Lock, _objCreationChanges.Chemist_Lock, _objCreationChanges.Region_Type_Code, _objCreationChanges.Effective_From, _objCreationChanges. Effective_To_Month, _objCreationChanges.Effective_To_Year, _objCreationChanges.Division_Code, _objCreationChanges.Holiday_Code, _objCreationChanges.Holiday_Name);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        public JsonResult GetPriceGroup()
        {
            string companyCode = null;
            try
            {
                _objCurrInfo = new CurrentInfo();
                companyCode = _objCurrInfo.GetCompanyCode();
                return Json(_objbl.GetPriceGroup(companyCode), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public JsonResult GetWeekends()
        {
            string companyCode = null;
            List<Weekend> lstWeekend = null;
            try
            {
                _objCurrInfo = new CurrentInfo();
                companyCode = _objCurrInfo.GetCompanyCode();

                lstWeekend = _objbl.GetWeekends(companyCode).ToList();
                return Json(lstWeekend, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public JsonResult Getregionsforholiday(string Underregion)
        {
            string companyCode = null;
            List<UnderRegion> lstregholiday = null;
            try
            {
                _objCurrInfo = new CurrentInfo();
                companyCode = _objCurrInfo.GetCompanyCode();

                lstregholiday = _objbl.Getregionsforholiday(companyCode, Underregion).ToList();
                return Json(lstregholiday, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public JsonResult GetHolidays(string RegionCode)
        {
            string companyCode = null;
            HolidayInfoModel lstholidays = null;
            try
            {
                _objCurrInfo = new CurrentInfo();
                companyCode = _objCurrInfo.GetCompanyCode();

                lstholidays = _objbl.GetHolidays(companyCode, RegionCode);
                return Json(lstholidays, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public JsonResult GetHolidayDateOnYear(string SelectedYear, string RegionCode)
        {
            string companyCode = null;
            List<Holiday> lstholidays = null;
            try
            {
                _objCurrInfo = new CurrentInfo();
                companyCode = _objCurrInfo.GetCompanyCode();

                lstholidays = _objbl.GetHolidayDateOnYear(SelectedYear, RegionCode);
                return Json(lstholidays, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public JsonResult GetRegionMigrationDetails(string Region_Name)
        {
            string companyCode = null;
            RegionMigrationModel objRegionModel = null;
            try
            {
                _objCurrInfo = new CurrentInfo();
                companyCode = _objCurrInfo.GetCompanyCode();

                objRegionModel = _objbl.GetRegionMigrationDetails(Region_Name);
                return Json(objRegionModel, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        //public bool SaveMapping(string Weekend_Code, string Price_group_code, string Region_Lock, string Chemist_Lock, string Region_Type_Code, string Effective_From, string Effective_To, string divisionCode, string holiday_Code, string holiday_name)
        //{
        //    bool result = false;
        //    string companyCode = null;
        //    string UserCode = null;
        //    string Companyid = null;
        //    try
        //    {
        //        _objCurrInfo = new CurrentInfo();
        //        companyCode = _objCurrInfo.GetCompanyCode();
        //        UserCode = _objCurrInfo.GetUserCode();
        //        Companyid = _objCurrInfo.GetCompanyId();
        //        result = _objbl.SaveMapping(companyCode, UserCode, region_Code, Companyid, Weekend_Code, Price_group_code, Region_Lock, Chemist_Lock, Region_Type_Code, Effective_From, Effective_To, divisionCode, holiday_Code, holiday_name);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw;
        //    }
        //    return result;
        //}
        #endregion Creation

        #region Disable
        //Disable - Region Creation Wizard
        public JsonResult GetActiveRegions()
        {
            string companyCode = null;
            string region_Code = null;
            List<UnderRegion> lstactreg = null;
            try
            {
                _objCurrInfo = new CurrentInfo();
                companyCode = _objCurrInfo.GetCompanyCode();
                region_Code = _objCurrInfo.GetRegionCode();
                lstactreg = _objbl.GetActiveRegions(companyCode, region_Code).ToList();
                return Json(lstactreg, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public JsonResult GetRegionInfo(string Region_Code)
        {
            string companyCode = null;
            RegInfoModel lstreginfo = null;
            try
            {
                _objCurrInfo = new CurrentInfo();
                companyCode = _objCurrInfo.GetCompanyCode();
                lstreginfo = _objbl.GetRegionInfo(companyCode, Region_Code);
                return Json(lstreginfo, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public JsonResult GetLeafRegions(string Region_Code)
        {
            string companyCode = null;
            List<RegionInfo> lstleafreg = null;
            try
            {
                _objCurrInfo = new CurrentInfo();
                companyCode = _objCurrInfo.GetCompanyCode();
                lstleafreg = _objbl.GetLeafRegions(companyCode, Region_Code).ToList();
                return Json(lstleafreg, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public JsonResult GetReportingRegions(string Region_Code)
        {
            string companyCode = null;
            List<UnderRegion> lstreportingregion = null;
            try
            {
                _objCurrInfo = new CurrentInfo();
                companyCode = _objCurrInfo.GetCompanyCode();
                lstreportingregion = _objbl.GetReportingRegions(companyCode, Region_Code).ToList();
                return Json(lstreportingregion, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public JsonResult GetSelUnderRegions(string Region_Code)
        {
            string companyCode = null;
            List<UnderRegion> lstreportingregion = null;
            try
            {
                _objCurrInfo = new CurrentInfo();
                companyCode = _objCurrInfo.GetCompanyCode();
                lstreportingregion = _objbl.GetSelUnderRegions(companyCode, Region_Code).ToList();
                return Json(lstreportingregion, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public JsonResult GetDCRLastEnteredDate(string Region_Code)
        {
            string companyCode = null;
            List<DCRDatemodel> lstdcrlastentereddate = null;
            try
            {
                _objCurrInfo = new CurrentInfo();
                companyCode = _objCurrInfo.GetCompanyCode();
                lstdcrlastentereddate = _objbl.GetDCRLastEnteredDate(companyCode, Region_Code).ToList();
                return Json(lstdcrlastentereddate, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public bool SaveReportingreg(List<Reportingreg> lstregdisable)
        {
            string companyCode = null;
            bool result = false;
            _objCurrInfo = new CurrentInfo();
            companyCode = _objCurrInfo.GetCompanyCode();
            result = _objbl.SaveReportingreg(companyCode, lstregdisable);
            return result;
        }

        public bool SaveDisableRegion(string Disable_Date, string Region_Name, string Region_Code)
        {
            bool result = false;
            string companyCode = null;
            string UserCode = null;
            string Companyid = null;
            try
            {
                _objCurrInfo = new CurrentInfo();
                companyCode = _objCurrInfo.GetCompanyCode();
                UserCode = _objCurrInfo.GetUserCode();
                Companyid = _objCurrInfo.GetCompanyId();
                result = _objbl.SaveDisableRegion(companyCode, UserCode, Companyid, Disable_Date, Region_Name, Region_Code);
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }


        #endregion Disable

        #region Hierarchy

        public JsonResult GetAllRegions()
        {
            string companyCode = null;
            List<UnderRegion> lstactreg = null;
            try
            {
                _objCurrInfo = new CurrentInfo();
                companyCode = _objCurrInfo.GetCompanyCode();
                lstactreg = _objbl.GetAllRegions(companyCode).ToList();
                return Json(lstactreg, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public JsonResult GetAllUnderRegions()
        {
            string companyCode = null;
            List<UnderRegion> lstactreg = null;
            try
            {
                _objCurrInfo = new CurrentInfo();
                companyCode = _objCurrInfo.GetCompanyCode();
                lstactreg = _objbl.GetAllUnderRegions(companyCode).ToList();
                return Json(lstactreg, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public JsonResult GetAllRegionType()
        {
            string companyCode = null;
            List<RegionType> lstregtype = null;
            try
            {
                _objCurrInfo = new CurrentInfo();
                companyCode = _objCurrInfo.GetCompanyCode();
                lstregtype = _objbl.GetAllRegionType(companyCode).ToList();
                return Json(lstregtype, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public JsonResult GetRegionDetails(string regioncode)
        {
            string companyCode = null;
            RegionCreationModelRCW lstactreg = null;
            try
            {
                _objCurrInfo = new CurrentInfo();
                companyCode = _objCurrInfo.GetCompanyCode();
                lstactreg = _objbl.GetRegionDetails(companyCode, regioncode);
                return Json(lstactreg, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        //public bool EditRegions(string Region_Code, string Under_Region_Code, string Region_Type_Code ,string Under_Region_Id, string Region_Classification_Code, string Expense_Group_Id, string Country, string State, string City, string Local_Area, string divisionCode, string Region_Name, string Notional_Territory)
        public bool EditRegions(RegionHierarchyChanges _ObjHirearchyChanges)
        {
            bool result = false;
            string companyCode = null;
            string UserCode = null;
            string Companyid = null;

            try
            {
                _objCurrInfo = new CurrentInfo();
                companyCode = _objCurrInfo.GetCompanyCode();
                UserCode = _objCurrInfo.GetUserCode();
                Companyid = _objCurrInfo.GetCompanyId();
                //result = _objbl.EditRegions(companyCode, UserCode, Companyid, Region_Code, Under_Region_Code, Region_Type_Code, Under_Region_Id, Region_Classification_Code, Expense_Group_Id, Country, State, City, Local_Area, divisionCode, Region_Name, Notional_Territory);
                result = _objbl.EditRegions(companyCode, UserCode, Companyid, _ObjHirearchyChanges.Region_Code, _ObjHirearchyChanges.Under_Region_Code,
                 _ObjHirearchyChanges.Region_Type_Code, _ObjHirearchyChanges.Under_Region_Id, _ObjHirearchyChanges.Region_Classification_Code,
                 _ObjHirearchyChanges.Expense_Group_Id, _ObjHirearchyChanges.Country, _ObjHirearchyChanges.State, _ObjHirearchyChanges.City, _ObjHirearchyChanges.Local_Area,
                 _ObjHirearchyChanges.DivisionCode, _ObjHirearchyChanges.Region_Name, _ObjHirearchyChanges.Notional_Territory,_ObjHirearchyChanges.Primary_Division, _ObjHirearchyChanges.Ref_Key1, _ObjHirearchyChanges.Ref_key2, _ObjHirearchyChanges.Depot_Name, _ObjHirearchyChanges.Depot_Code); 

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        public bool CheckDuplicateRegion(string Region_Name, string Region_Code)
        {
            bool result = false;
            string companyCode = null;

            try
            {
                _objCurrInfo = new CurrentInfo();
                companyCode = _objCurrInfo.GetCompanyCode();
                result = _objbl.CheckDuplicateRegion(companyCode, Region_Name, Region_Code);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        #endregion Hierarchy
    }
}