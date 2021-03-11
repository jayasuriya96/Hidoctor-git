using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ElmahWrapper;
using DataControl;
using DataControl.Impl;
using DataControl.Abstraction;
using DataControl.EnumType;

namespace HiDoctor.Controllers
{
    [AjaxSessionActionFilter]
    public class DashBoardController : Controller
    {


        DataControl.SPData _objSPData = new DataControl.SPData();
        private DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
        DataControl.Data _objData = new DataControl.Data();
        DataControl.JSONConverter _objJson = new DataControl.JSONConverter();

        #region BL Admin Dashboard Object Create
        DataControl.BLAdminDashboard _objBLAdminDashboard = new BLAdminDashboard();
        #endregion


        const string EXEC = "EXEC";

        const string COLL_DIVISION_CODE = "DivisionCode";
        const string COLL_DIVISION_ALL = "DivisionAll";
        const string COLL_REGION_TYPE_CODE = "RegionTypeCode";
        const string COLL_REGION_TYPE_ALL = "RegionTypeAll";
        const string COLL_REGION_CODES = "RegionCode";
        const string COLL_PRODUCT_CODES = "ProductCode";

        const string COLL_MONTHS = "Months";
        const string COLL_YEAR = "Year";
        const string COLL_REGION_NAMES = "RegionNames";
        const string COLL_MULTIPLE_REGION_CODES = "RegionCodes";

       
      

        public void GetPrivillegeValue()
        {
            string DashboardV2;
            DashboardV2 = _objCurrentInfo.GetPrivilegeValue("DashboardV2_As_HomePage", "NO");
            ViewBag.IsBacks = DashboardV2;
        }

        //const string m_CompanyCode = _objCurrentInfo.GetCompanyCode();
        //
        // GET: /DashBoard/

        public ActionResult Index()
        {
            return View();
        }

        //
        // GET: /DashBoard/Details/5

        public ActionResult Details(int id)
        {
            return View();
        }

        //
        // GET: /DashBoard/Create

        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /DashBoard/Create

        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /DashBoard/Edit/5

        public ActionResult Edit(int id)
        {
            return View();
        }

        //
        // POST: /DashBoard/Edit/5

        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /DashBoard/Delete/5

        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /DashBoard/Delete/5

        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
        public ActionResult ActivityDashBoard()
        {
            ViewBag.CurrentDate = DateTime.Now.ToString("yyyy-MM-dd");
            return View();
        }
        public ActionResult ActivityVsSalesDashBoard()
        {
            ViewBag.CurrentDate = DateTime.Now.ToString("yyyy-MM-dd");
            return View();
        }
        public ActionResult UserDashboard()
        {
            GetPrivillegeValue();
            CurrentInfo objCurInfo = new CurrentInfo();
            BLUser objUser = new BLUser();
            List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
            lstUser = objUser.GetChildUsersCodeAndNameOnly(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode());
            ViewBag.IsBack = Request.QueryString["IsBack"];
            ViewBag.Current_Date = System.DateTime.Now.ToString("yyyy-MM-dd");
            ViewBag.Previous_Date = System.DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd");
            ViewBag.Next_Date = System.DateTime.Now.AddDays(1).ToString("yyyy-MM-dd");
            ViewBag.Current_Month = System.DateTime.Now.Month + "-" + System.DateTime.Now.Year;
            ViewBag.Previous_Month = System.DateTime.Now.AddMonths(-1).Month + "-" + System.DateTime.Now.AddMonths(-1).Year;
            ViewBag.Next_Month = System.DateTime.Now.AddMonths(1).Month + "-" + System.DateTime.Now.AddMonths(1).Year;
            ViewBag.Child_User_Count = lstUser.Count();
            ViewBag.Day_After_Tomorrow = System.DateTime.Now.AddDays(2).ToString("yyyy-MM-dd");
            ViewBag.Month = System.DateTime.Now.Month;
            ViewBag.Year = System.DateTime.Now.Year;
            return View();
        }

        public ActionResult UserDashboardDoctorVisit(string id)
        {
            GetPrivillegeValue();
            ViewBag.Mode = id.Split('~')[0];
            ViewBag.Division_Code = id.Split('~')[1];
            ViewBag.Region_Code = id.Split('~')[2];
            ViewBag.Current_Month = System.DateTime.Now.Month;
            ViewBag.Current_Year = System.DateTime.Now.Year;
            ViewBag.Child_User_Count = id.Split('~')[3];
            ViewBag.IsCurrent = id.Split('~')[4];
            //ViewBag.IsSummaryMode = id.Split('~')[5];
            return View();
        }

        public ActionResult AdminDashboardDoctorVisit(string id)
        {
            GetPrivillegeValue();
            ViewBag.Mode = id.Split('~')[0];
            ViewBag.Division_Name = id.Split('~')[1];
            ViewBag.Region_Code = id.Split('~')[2];
            ViewBag.Current_Month = System.DateTime.Now.Month;
            ViewBag.Current_Year = System.DateTime.Now.Year;
            ViewBag.Child_User_Count = id.Split('~')[3];
            //ViewBag.CategoryCoverageDivisionCode = id.Split('~')[4];
            ViewBag.IsCurrent = id.Split('~')[4];
            return View();
        }

        public JsonResult GetUserDashboardInwardAcknowlegementConfigValue()
        {
            CurrentInfo _objcurrentInfo = new CurrentInfo();
            IConfigSettings IConfig_Settings = new Config_Settings();
            string INWARD_ACKNOWLEDGEMENT_NEEDED = IConfig_Settings.GetConfigDefaultValue(_objcurrentInfo.GetCompanyCode(), CONFIG_TYPE.INWARD, CONFIG_KEY.INWARD_ACKNOWLEDGEMENT_NEEDED);
            return Json(INWARD_ACKNOWLEDGEMENT_NEEDED, JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetDivision()
        {
            try
            {

                string companyCode = _objCurrentInfo.GetCompanyCode();
                string regionCode = _objCurrentInfo.GetRegionCode();
                DataSet ds = new DataSet();
                DataControl.BLDashboard _objBLDashboard = new BLDashboard();
                ds = _objBLDashboard.GetDivision(companyCode, regionCode);
                return Json(_objJson.Serialize(ds), JsonRequestBehavior.AllowGet);
                //_objData.OpenConnection(companyCode);
                //{
                //    ds = _objData.ExecuteDataSet("" + EXEC + " " + SP_HDGETDIVISIONSBYREGION + " '" + companyCode + "','" + regionCode + "'");
                //    return Json(_objJson.Serialize(ds), JsonRequestBehavior.AllowGet);
                //}
            }
            finally
            {
                //  _objData.CloseConnection();
            }
        }
        public JsonResult GetRegionTypesByDivision(FormCollection collection)
        {
            try
            {
                DataControl.BLDashboard _objBLDashboard = new BLDashboard();
                string companyCode = _objCurrentInfo.GetCompanyCode();
                string regionCode = _objCurrentInfo.GetRegionCode();
                DataSet ds = new DataSet();
                ds = _objBLDashboard.GetRegionTypesByDivision(companyCode, regionCode, collection[COLL_DIVISION_CODE], collection[COLL_DIVISION_ALL]);
                return Json(_objJson.Serialize(ds), JsonRequestBehavior.AllowGet);
                //_objData.OpenConnection(companyCode);
                //{
                //    ds = _objData.ExecuteDataSet("" + EXEC + " " + SP_HDGETREGIONTYPESBYDIVISION + " '" + companyCode + "','" + regionCode + "','" + collection[COLL_DIVISION_CODE] + "','" + collection[COLL_DIVISION_ALL] + "'");
                //    return Json(_objJson.Serialize(ds), JsonRequestBehavior.AllowGet);
                //}
            }
            finally
            {
                //   _objData.CloseConnection();
            }
        }
        public JsonResult GetRegionByDivisionAndRegionType(FormCollection collection)
        {
            try
            {
                DataControl.BLDashboard _objBLDashboard = new BLDashboard();
                string companyCode = _objCurrentInfo.GetCompanyCode();
                string regionCode = _objCurrentInfo.GetRegionCode();
                DataSet ds = new DataSet();
                ds = _objBLDashboard.GetRegionByDivisionAndRegionType(companyCode, regionCode, collection[COLL_DIVISION_CODE], collection[COLL_REGION_TYPE_CODE]);
                return Json(_objJson.Serialize(ds), JsonRequestBehavior.AllowGet);
                //_objData.OpenConnection(companyCode);
                //{
                //    ds = _objData.ExecuteDataSet("" + EXEC + " " + SP_HDGETREGIONBYDIVISIONANDREGIONTYPE + " '" + companyCode + "','" + regionCode + "','" + collection[COLL_DIVISION_CODE] + "','" + collection[COLL_REGION_TYPE_CODE] + "'");
                //    return Json(_objJson.Serialize(ds), JsonRequestBehavior.AllowGet);
                //}
            }
            finally
            {
                // _objData.CloseConnection();
            }
        }
        public JsonResult GetRegionByDivision(FormCollection collection)
        {
            try
            {
                string companyCode = _objCurrentInfo.GetCompanyCode();
                string regionCode = _objCurrentInfo.GetRegionCode();
                DataSet ds = new DataSet();
                DataControl.BLDashboard _objBLDashboard = new BLDashboard();
                ds = _objBLDashboard.GetRegionByDivision(companyCode, regionCode);
                return Json(_objJson.Serialize(ds), JsonRequestBehavior.AllowGet);
                //_objData.OpenConnection(companyCode);
                //{
                //    ds = _objData.ExecuteDataSet("" + EXEC + " " + SP_HDGETREGIONSBYDIVISION + " '" + companyCode + "','" + regionCode + "'");
                //    return Json(_objJson.Serialize(ds), JsonRequestBehavior.AllowGet);
                //}

            }
            finally
            {
                //_objData.CloseConnection();
            }
        }
        public JsonResult GetCategory(FormCollection collection)
        {
            try
            {
                DataControl.BLDashboard _objBLDashboard = new BLDashboard();
                string companyCode = _objCurrentInfo.GetCompanyCode();
                DataSet ds = new DataSet();
                ds = _objBLDashboard.GetCategory(companyCode, collection[COLL_DIVISION_CODE]);
                return Json(_objJson.Serialize(ds), JsonRequestBehavior.AllowGet);
                //_objData.OpenConnection(companyCode);
                //{
                //    ds = _objData.ExecuteDataSet("" + EXEC + " " + SP_HDGETDOCTORCATEGORY + " '" + collection[COLL_DIVISION_CODE] + "'");
                //    return Json(_objJson.Serialize(ds), JsonRequestBehavior.AllowGet);
                //}
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public JsonResult GetDivisionCount(FormCollection collection)
        {
            try
            {
                DataControl.BLDashboard _objBLDashboard = new BLDashboard();
                string companyCode = _objCurrentInfo.GetCompanyCode();
                DataSet ds = new DataSet();
                //_objData.OpenConnection(companyCode);
                //{
                //ds = _objData.ExecuteDataSet("" + EXEC + " " + SP_HDGETDIVISIONCOUNT + " '" + companyCode + "'");
                ds = _objBLDashboard.GetDivisionCount(companyCode);
                return Json(_objJson.Serialize(ds), JsonRequestBehavior.AllowGet);
                //}
            }
            finally
            {
                //_objData.CloseConnection();
            }
        }
        public JsonResult GetCategoryWiseVisitAnanlysis(FormCollection collection)
        {
            try
            {
                DataControl.BLDashboard _objBLDashboard = new BLDashboard();
                string companyCode = _objCurrentInfo.GetCompanyCode();
                string regionCode = _objCurrentInfo.GetRegionCode();
                DataSet ds = new DataSet();
                string months = collection[COLL_MONTHS];
                string years = collection[COLL_YEAR];
                string regionCodes = collection[COLL_MULTIPLE_REGION_CODES];
                string divisionCode = collection[COLL_DIVISION_CODE];

                ds = _objBLDashboard.GetCategoryWiseVisitAnanlysis(companyCode, regionCode, months, years, regionCodes, divisionCode);
                return Json(_objJson.Serialize(ds), JsonRequestBehavior.AllowGet);

            }
            finally
            {
                //_objData.CloseConnection();
            }
        }
        public JsonResult GetWorkedCalculation(FormCollection collection)
        {
            try
            {
                DataControl.BLDashboard _objBlDashboard = new BLDashboard();
                string companyCode = _objCurrentInfo.GetCompanyCode();
                string regionCode = _objCurrentInfo.GetRegionCode();

                string months = collection[COLL_MONTHS];
                string years = collection[COLL_YEAR];
                // string regionNames = collection[COLL_REGION_NAMES];
                string regionCodes = collection[COLL_MULTIPLE_REGION_CODES];

                //months = months.Replace("^", "'").Replace("'", "''");
                //regionNames = regionNames.Replace("^", "'").Replace("'", "''");
                //years = years.Replace("^", "'").Replace("'", "''");

                WorkCalculation objWorkCalculation = new WorkCalculation();
                DataSet ds = new DataSet();
                DataSet dsWorkCalculation = new DataSet();
                string leafRegion = string.Empty;
                try
                {
                    ds = _objBlDashboard.GetWorkedCalculation(companyCode, regionCodes, months, years);
                    leafRegion = _objSPData.GetLeafRegions(regionCodes);
                    //IWorkCalculation objWorkCalculation = new WorkCalculation();
                    months = collection[COLL_MONTHS].Replace("^", "");
                    regionCodes = collection[COLL_MULTIPLE_REGION_CODES].Replace("^", "");
                    years = collection[COLL_YEAR].Replace("^", "");

                    dsWorkCalculation = objWorkCalculation.CalculateWork(ds, months, int.Parse(years), regionCodes, leafRegion);
                    return Json(_objJson.Serialize(dsWorkCalculation), JsonRequestBehavior.AllowGet);
                }
                catch (Exception ex)
                {
                    ErrorLog.LogError(ex, "GetWorkedCalculation()");
                    return null;
                }
            }
            finally
            {
                _objData.CloseConnection();
            }

        }
        public JsonResult GetDoctorCallAverage(FormCollection collection)
        {
            try
            {
                DataControl.BLDashboard _objBlDashboard = new BLDashboard();
                string companyCode = _objCurrentInfo.GetCompanyCode();
                string regionCode = _objCurrentInfo.GetRegionCode();

                string months = collection[COLL_MONTHS];
                string years = collection[COLL_YEAR];
                //    string regionNames = collection[COLL_REGION_NAMES];
                string regionCodes = collection[COLL_MULTIPLE_REGION_CODES];
                string divisionCode = collection[COLL_DIVISION_CODE];

                //months = months.Replace("^", "'").Replace("'", "''");
                //regionNames = regionNames.Replace("^", "'").Replace("'", "''");
                //years = years.Replace("^", "'").Replace("'", "''");

                DoctorCallAverage objWorkCalculation = new DoctorCallAverage();

                DataSet ds = new DataSet();
                DataSet dsDoctorCallAverage = new DataSet();

                string leafRegion = string.Empty;
                //  _objData.OpenConnection(companyCode);
                // {
                try
                {
                    //ds = _objData.ExecuteDataSet("" + EXEC + " " + SP_HDDOCTORCALLAVERAGE + " '" + companyCode + "','" + regionNames + "','" + months + "','" + years + "','" + divisionCode + "'");
                    ds = _objBlDashboard.GetDoctorCallAverage(companyCode, regionCodes, months, years, divisionCode);
                    leafRegion = _objSPData.GetLeafRegions(regionCodes);
                    months = collection[COLL_MONTHS].Replace("^", "");
                    //regionNames = collection[COLL_REGION_NAMES].Replace("^", "");
                    regionCodes = collection[COLL_MULTIPLE_REGION_CODES].Replace("^", "");
                    years = collection[COLL_YEAR].Replace("^", "");

                    dsDoctorCallAverage = objWorkCalculation.CalculateDoctorCallAverage(ds, months, int.Parse(years), leafRegion);
                    return Json(_objJson.Serialize(dsDoctorCallAverage), JsonRequestBehavior.AllowGet);
                }
                catch (Exception ex)
                {

                    ErrorLog.LogError(ex, "GetWorkedCalculation()");
                    return null;
                }
                // }
            }
            finally
            {
                _objData.CloseConnection();
            }

        }
        public JsonResult GetChemistCallAverage(FormCollection collection)
        {
            try
            {
                DataControl.BLDashboard _objBLDashboard = new BLDashboard();
                string companyCode = _objCurrentInfo.GetCompanyCode();
                string regionCode = _objCurrentInfo.GetRegionCode();

                string months = collection[COLL_MONTHS];
                string years = collection[COLL_YEAR];
                //string regionNames = collection[COLL_REGION_NAMES];
                string regionCodes = collection[COLL_MULTIPLE_REGION_CODES];

                //months = months.Replace("^", "'").Replace("'", "''");
                //regionNames = regionNames.Replace("^", "'").Replace("'", "''");
                //years = years.Replace("^", "'").Replace("'", "''");

                ChemistCallAverage objWorkCalculation = new ChemistCallAverage();

                DataSet ds = new DataSet();
                DataSet dsDoctorCallAverage = new DataSet();

                string leafRegion = string.Empty;

                //_objData.OpenConnection(companyCode);
                //{
                try
                {
                    // ds = _objData.ExecuteDataSet("" + EXEC + " " + SP_HDCHEMISTCALLAVERAGE + " '" + companyCode + "','" + regionCodes + "','" + months + "','" + years + "'");
                    ds = _objBLDashboard.GetChemistCallAverage(companyCode, regionCodes, months, years);
                    leafRegion = _objSPData.GetLeafRegions(regionCodes);
                    months = collection[COLL_MONTHS].Replace("^", "");
                    regionCodes = collection[COLL_MULTIPLE_REGION_CODES].Replace("^", "");
                    years = collection[COLL_YEAR].Replace("^", "");

                    dsDoctorCallAverage = objWorkCalculation.CalculateChemistCallAverage(ds, months, int.Parse(years), leafRegion);
                    return Json(_objJson.Serialize(dsDoctorCallAverage), JsonRequestBehavior.AllowGet);
                }
                catch (Exception ex)
                {

                    ErrorLog.LogError(ex, "GetWorkedCalculation()");
                    return null;
                }
                // }
            }
            finally
            {
                _objData.CloseConnection();
            }

        }
        public JsonResult GetCategoryCoverage(FormCollection collection)
        {
            try
            {
                DataControl.BLDashboard _objBLDashboard = new BLDashboard();
                string companyCode = _objCurrentInfo.GetCompanyCode();
                string regionCode = _objCurrentInfo.GetRegionCode();

                string months = collection[COLL_MONTHS];
                string years = collection[COLL_YEAR];
                //  string regionNames = collection[COLL_REGION_NAMES];
                string regionCodes = collection[COLL_MULTIPLE_REGION_CODES];
                string divisionCode = collection[COLL_DIVISION_CODE];

                //months = months.Replace("^", "'").Replace("'", "''");
                //regionNames = regionNames.Replace("^", "'").Replace("'", "''");
                //years = years.Replace("^", "'").Replace("'", "''");

                CategoryWiseCoverage objWorkCalculation = new CategoryWiseCoverage();

                DataSet ds = new DataSet();
                DataSet dsDoctorCallAverage = new DataSet();

                string leafRegion = string.Empty;
                //_objData.OpenConnection(companyCode);
                //{
                try
                {
                    //  ds = _objData.ExecuteDataSet("" + EXEC + " " + SP_HDCATEGORYWISECOVERAGE + " '" + companyCode + "','" + regionCodes + "','" + months + "','" + years + "','" + divisionCode + "'");
                    ds = _objBLDashboard.GetCategoryCoverage(companyCode, regionCodes, months, years, divisionCode);
                    leafRegion = _objSPData.GetLeafRegions(regionCodes);

                    months = collection[COLL_MONTHS].Replace("^", "");
                    regionCodes = collection[COLL_MULTIPLE_REGION_CODES].Replace("^", "");
                    years = collection[COLL_YEAR].Replace("^", "");

                    dsDoctorCallAverage = objWorkCalculation.CalculateCategoryCoverage(ds, months, int.Parse(years), regionCodes, leafRegion);
                    return Json(_objJson.Serialize(dsDoctorCallAverage), JsonRequestBehavior.AllowGet);
                }
                catch (Exception ex)
                {

                    ErrorLog.LogError(ex, "GetWorkedCalculation()");
                    return null;
                }
                //}
            }
            finally
            {
                _objData.CloseConnection();
            }

        }

        public JsonResult GetCategorywiseDoctorCoverage(FormCollection collection)
        {
            try
            {
                DataControl.BLDashboard _objBLDashboard = new BLDashboard();
                string companyCode = _objCurrentInfo.GetCompanyCode();
                string regionCode = _objCurrentInfo.GetRegionCode();

                string months = collection[COLL_MONTHS];
                string years = collection[COLL_YEAR];
                // string regionNames = collection[COLL_REGION_NAMES];
                string regionCodes = collection[COLL_MULTIPLE_REGION_CODES];
                string divisionCode = collection[COLL_DIVISION_CODE];

                //months = months.Replace("^", "'").Replace("'", "''");
                //regionNames = regionNames.Replace("^", "'").Replace("'", "''");
                //years = years.Replace("^", "'").Replace("'", "''");

                CategoryWiseCoverage objWorkCalculation = new CategoryWiseCoverage();

                DataSet ds = new DataSet();
                DataSet dsDoctorCallAverage = new DataSet();

                string leafRegion = string.Empty;
                //_objData.OpenConnection(companyCode);
                //{
                try
                {
                    // ds = _objData.ExecuteDataSet("" + EXEC + " " + SP_HDCATEGORYWISECOVERAGE + " '" + companyCode + "','" + regionNames + "','" + months + "','" + years + "','" + divisionCode + "'");
                    ds = _objBLDashboard.GetCategoryCoverage(companyCode, regionCodes, months, years, divisionCode);
                    leafRegion = _objSPData.GetLeafRegions(regionCodes);

                    months = collection[COLL_MONTHS].Replace("^", "");
                    regionCodes = collection[COLL_MULTIPLE_REGION_CODES].Replace("^", "");
                    years = collection[COLL_YEAR].Replace("^", "");

                    dsDoctorCallAverage = objWorkCalculation.CalculateCategorywiseDoctorCoverage(ds, months, int.Parse(years), leafRegion);
                    return Json(_objJson.Serialize(dsDoctorCallAverage), JsonRequestBehavior.AllowGet);
                }
                catch (Exception ex)
                {

                    ErrorLog.LogError(ex, "GetWorkedCalculation()");
                    return null;
                }
                // }
            }
            finally
            {
                _objData.CloseConnection();
            }

        }
        public JsonResult GetNoOfDoctors(FormCollection collection)
        {
            try
            {
                DataControl.BLDashboard _objBLDashboard = new BLDashboard();
                string companyCode = _objCurrentInfo.GetCompanyCode();
                string regionCode = _objCurrentInfo.GetRegionCode();

                string months = collection[COLL_MONTHS];
                string years = collection[COLL_YEAR];
                //string regionNames = collection[COLL_REGION_NAMES];
                string regionCodes = collection[COLL_MULTIPLE_REGION_CODES];
                string divisionCode = collection[COLL_DIVISION_CODE];

                //months = months.Replace("^", "'").Replace("'", "''");
                //regionNames = regionNames.Replace("^", "'").Replace("'", "''");
                //years = years.Replace("^", "'").Replace("'", "''");

                CategoryWiseCoverage objWorkCalculation = new CategoryWiseCoverage();

                DataSet ds = new DataSet();
                DataSet dsDoctorCallAverage = new DataSet();

                string leafRegion = string.Empty;

                //  _objData.OpenConnection(companyCode);
                //  {
                try
                {
                    // ds = _objData.ExecuteDataSet("" + EXEC + " " + SP_HDCATEGORYWISECOVERAGE + " '" + companyCode + "','" + regionNames + "','" + months + "','" + years + "','" + divisionCode + "'");
                    ds = _objBLDashboard.GetCategoryCoverage(companyCode, regionCodes, months, years, divisionCode);
                    leafRegion = _objSPData.GetLeafRegions(regionCodes);

                    months = collection[COLL_MONTHS].Replace("^", "");
                    regionCodes = collection[COLL_MULTIPLE_REGION_CODES].Replace("^", "");
                    years = collection[COLL_YEAR].Replace("^", "");

                    dsDoctorCallAverage = objWorkCalculation.CalculateNoOfDoctors(ds, months, int.Parse(years), leafRegion);
                    return Json(_objJson.Serialize(dsDoctorCallAverage), JsonRequestBehavior.AllowGet);
                }
                catch (Exception ex)
                {

                    ErrorLog.LogError(ex, "GetWorkedCalculation()");
                    return null;
                }
                //  }
            }
            finally
            {
                _objData.CloseConnection();
            }

        }
        public JsonResult CategoryAndDoctorCoverage(FormCollection collection)
        {
            try
            {
                DataControl.BLDashboard _objBLDashboard = new BLDashboard();
                string companyCode = _objCurrentInfo.GetCompanyCode();
                string regionCode = _objCurrentInfo.GetRegionCode();

                string months = collection[COLL_MONTHS];
                string years = collection[COLL_YEAR];
                //  string regionNames = collection[COLL_REGION_NAMES];
                string regionCodes = collection[COLL_MULTIPLE_REGION_CODES];
                string divisionCode = collection[COLL_DIVISION_CODE];

                //months = months.Replace("^", "'").Replace("'", "''");
                //regionNames = regionNames.Replace("^", "'").Replace("'", "''");
                //years = years.Replace("^", "'").Replace("'", "''");

                CategoryWiseCoverage objWorkCalculation = new CategoryWiseCoverage();

                DataSet ds = new DataSet();
                DataSet dsDoctorCallAverage = new DataSet();

                string leafRegion = string.Empty;

                // _objData.OpenConnection(companyCode);
                // {
                try
                {
                    //  ds = _objData.ExecuteDataSet("" + EXEC + " " + SP_HDCATEGORYWISECOVERAGE + " '" + companyCode + "','" + regionNames + "','" + months + "','" + years + "','" + divisionCode + "'");
                    ds = _objBLDashboard.GetCategoryCoverage(companyCode, regionCodes, months, years, divisionCode);
                    leafRegion = _objSPData.GetLeafRegions(regionCodes);
                    months = collection[COLL_MONTHS].Replace("^", "");
                    regionCodes = collection[COLL_MULTIPLE_REGION_CODES].Replace("^", "");
                    years = collection[COLL_YEAR].Replace("^", "");

                    dsDoctorCallAverage = objWorkCalculation.CalculateCategoryAndDoctorCoverage(ds, months, int.Parse(years), leafRegion);
                    return Json(_objJson.Serialize(dsDoctorCallAverage), JsonRequestBehavior.AllowGet);
                }
                catch (Exception ex)
                {

                    ErrorLog.LogError(ex, "GetWorkedCalculation()");
                    return null;
                }
                // }
            }
            finally
            {
                _objData.CloseConnection();
            }

        }
        public JsonResult GetDivisonMappedProducts(FormCollection collection)
        {
            try
            {
                DataControl.BLDashboard _objBLDashboard = new BLDashboard();
                string companyCode = _objCurrentInfo.GetCompanyCode();
                string regionCode = _objCurrentInfo.GetRegionCode();
                DataSet ds = new DataSet();
                //_objData.OpenConnection(companyCode);
                //{
                //  ds = _objData.ExecuteDataSet("" + EXEC + " " + SP_HDGETPRODUCTSBYDIVISION + " '" + collection[COLL_DIVISION_CODE] + "','" + regionCode + "'");
                ds = _objBLDashboard.GetDivisonMappedProducts(companyCode, collection[COLL_DIVISION_CODE], regionCode);
                return Json(_objJson.Serialize(ds), JsonRequestBehavior.AllowGet);
                //}
            }
            finally
            {
                //_objData.CloseConnection();
            }
        }
        public JsonResult SSActivityVsSales(FormCollection collection)
        {
            try
            {
                DataControl.BLDashboard _objBLDashboard = new BLDashboard();
                string companyCode = _objCurrentInfo.GetCompanyCode();
                string regionCode = _objCurrentInfo.GetRegionCode();
                DataSet ds = new DataSet();
                DataSet dsActivity = new DataSet();

                string months = collection[COLL_MONTHS];
                string years = collection[COLL_YEAR];
                string regionCodes = collection[COLL_MULTIPLE_REGION_CODES]; //collection[COLL_REGION_CODES];
                string productCode = collection[COLL_PRODUCT_CODES];

                //months = months.Replace("^", "'").Replace("'", "''");
                //regionCodes = regionCodes.Replace("^", "'").Replace("'", "''");
                //years = years.Replace("^", "'").Replace("'", "''");
                //productCode = productCode.Replace("^", "'").Replace("'", "''");

                ActivityVsSales objActivity = new ActivityVsSales();
                string leafRegion = string.Empty;

                //_objData.OpenConnection(companyCode);
                //{
                // ds = _objData.ExecuteDataSet("" + EXEC + " " + SP_HDGETSSACTIVITY + " '" + companyCode + "','" + regionCode + "','" + regionCodes + "','" + productCode + "','" + months + "','" + years + "'");
                ds = _objBLDashboard.SSActivityVsSales(companyCode, regionCode, regionCodes, productCode, months, years);

                leafRegion = _objSPData.GetLeafRegions(regionCodes);

                months = collection[COLL_MONTHS].Replace("^", "");
                regionCodes = collection[COLL_MULTIPLE_REGION_CODES].Replace("^", "");
                productCode = collection[COLL_PRODUCT_CODES].Replace("^", "");
                years = collection[COLL_YEAR].Replace("^", "");


                dsActivity = objActivity.CalculateActivityVsSales(ds, months, int.Parse(years), regionCodes, productCode, leafRegion);
                return Json(_objJson.Serialize(dsActivity), JsonRequestBehavior.AllowGet);

            }
            //  }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string InsertConfigSetting(string redColor, string yellowColor, string greenColor)
        {
            string result = String.Empty;
            DataControl.BLDashboard _objBLDashboard = new BLDashboard();
            DataControl.CurrentInfo _objCurrentInfo = new CurrentInfo();
            result = _objBLDashboard.InsertConfigSettings(_objCurrentInfo.GetCompanyCode(), "DASHBOARD", "GAUGE_REDCOLOR_FROM_TO", redColor, "");
            result = _objBLDashboard.InsertConfigSettings(_objCurrentInfo.GetCompanyCode(), "DASHBOARD", "GAUGE_YELLOWCOLOR_FROM_TO", yellowColor, "");
            result = _objBLDashboard.InsertConfigSettings(_objCurrentInfo.GetCompanyCode(), "DASHBOARD", "GAUGE_GREENCOLOR_FROM_TO", greenColor, "");
            return result;
        }

        public string GetDashboardGaugeSettings()
        {
            string result = String.Empty;
            DataControl.BLDashboard _objBLDashboard = new BLDashboard();
            result = _objBLDashboard.GetDashboardGaugeSettings();
            return result;
        }
        #region User dashboard
        public JsonResult GetUserDashboardInfo()
        {
            try
            {
                BLDashboard objDashboard = new BLDashboard();
                CurrentInfo objCurInfo = new CurrentInfo();
                List<MVCModels.UserDashboardModel> lstContent = new List<MVCModels.UserDashboardModel>();
                lstContent = objDashboard.GetUserDashboardInfo(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode()).ToList();
                lstContent.ForEach(x =>
                {
                    x.Cur_Month_Doctor_Call_Avg = Double.IsNaN(Math.Round(x.Cur_Month_Doctor_Calls_Made / x.Cur_Month_Total_Field_Days, 2)) ? 0.00 : Math.Round(x.Cur_Month_Doctor_Calls_Made / x.Cur_Month_Total_Field_Days, 2);
                    x.Pre_Month_Doctor_Call_Avg = Double.IsNaN(Math.Round(x.Pre_Month_Doctor_Calls_Made / x.Pre_Month_Total_Field_Days, 2)) ? 0.00 : Math.Round(x.Pre_Month_Doctor_Calls_Made / x.Pre_Month_Total_Field_Days, 2);
                    x.Cur_Month_Chemist_Call_Avg = Double.IsNaN(Math.Round(x.Cur_Month_Unique_Chemist_Visited_Count / x.Cur_Month_Total_Field_Days, 2)) ? 0.00 : Math.Round(x.Cur_Month_Unique_Chemist_Visited_Count / x.Cur_Month_Total_Field_Days, 2);
                    x.Pre_Month_Chemist_Call_Avg = Double.IsNaN(Math.Round(x.Pre_Month_Unique_Chemist_Visited_Count / x.Pre_Month_Total_Field_Days, 2)) ? 0.00 : Math.Round(x.Pre_Month_Unique_Chemist_Visited_Count / x.Pre_Month_Total_Field_Days, 2);
                    x.Cur_Month_SS_Value = Math.Round(x.Cur_Month_SS_Value, 2);
                    x.Pre_Month_SS_Value = Math.Round(x.Pre_Month_SS_Value, 2);
                    x.Cur_Month_Claim_For_Approval = Math.Round(x.Cur_Month_Claim_For_Approval, 2);
                    x.Pre_Month_Claim_For_Approval = Math.Round(x.Pre_Month_Claim_For_Approval, 2);
                    x.Till_Date_UnApproved_ExpClaim_Count = Math.Round(x.Till_Date_UnApproved_ExpClaim_Count, 2);
                    x.Till_Date_Applied_ExpClaim_Count = Math.Round(x.Till_Date_Applied_ExpClaim_Count, 2);
                });

                return Json(lstContent, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                throw;
            }
        }


        public JsonResult GetManagerDashboardInfo()
        {
            try
            {
                BLDashboard objDashboard = new BLDashboard();
                CurrentInfo objCurInfo = new CurrentInfo();
                List<MVCModels.UserDashboardModel> lstContent = new List<MVCModels.UserDashboardModel>();
                lstContent = objDashboard.GetManagerDashboardInfo(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode()).ToList();
                lstContent.ForEach(x =>
                {
                    x.Cur_Month_Doctor_Call_Avg = Double.IsNaN(Math.Round(x.Cur_Month_Doctor_Calls_Made / x.Cur_Month_Total_Field_Days, 2)) ? 0.00 : Math.Round(x.Cur_Month_Doctor_Calls_Made / x.Cur_Month_Total_Field_Days, 2);
                    x.Pre_Month_Doctor_Call_Avg = Double.IsNaN(Math.Round(x.Pre_Month_Doctor_Calls_Made / x.Pre_Month_Total_Field_Days, 2)) ? 0.00 : Math.Round(x.Pre_Month_Doctor_Calls_Made / x.Pre_Month_Total_Field_Days, 2);
                    x.Cur_Month_Chemist_Call_Avg = Double.IsNaN(Math.Round(x.Cur_Month_Unique_Chemist_Visited_Count / x.Cur_Month_Total_Field_Days, 2)) ? 0.00 : Math.Round(x.Cur_Month_Doctor_Calls_Made / x.Cur_Month_Total_Field_Days, 2);
                    x.Pre_Month_Chemist_Call_Avg = Double.IsNaN(Math.Round(x.Pre_Month_Unique_Chemist_Visited_Count / x.Pre_Month_Total_Field_Days, 2)) ? 0.00 : Math.Round(x.Pre_Month_Unique_Chemist_Visited_Count / x.Pre_Month_Total_Field_Days, 2);
                    x.Cur_Month_SS_Value = Math.Round(x.Cur_Month_SS_Value, 2);
                    x.Pre_Month_SS_Value = Math.Round(x.Pre_Month_SS_Value, 2);
                    x.Cur_Month_Claim_For_Approval = Math.Round(x.Cur_Month_Claim_For_Approval, 2);
                    x.Pre_Month_Claim_For_Approval = Math.Round(x.Pre_Month_Claim_For_Approval, 2);
                    x.Till_Date_UnApproved_ExpClaim_Count = Math.Round(x.Till_Date_UnApproved_ExpClaim_Count, 2);
                    x.Till_Date_Applied_ExpClaim_Count = Math.Round(x.Till_Date_Applied_ExpClaim_Count, 2);
                });

                return Json(lstContent, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                throw;
            }
        }

        public JsonResult GetDashboardExpenseDataCount()
        {
            BLDashboard objDashboard = new BLDashboard();
            CurrentInfo objCurInfo = new CurrentInfo();
            MVCModels.DashboardExpense expenseCount = new MVCModels.DashboardExpense();
            expenseCount = objDashboard.GetDashboardExpenseDataCount(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode());
            return Json(expenseCount, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetExpensePopUp(string mode)
        {
            BLDashboard objDashboard = new BLDashboard();
            CurrentInfo objCurInfo = new CurrentInfo();
            List<MVCModels.DashboardExpense> lstExpenseCount = new List<MVCModels.DashboardExpense>();
            lstExpenseCount = objDashboard.GetExpensePopUp(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode(), mode).ToList();
            return Json(lstExpenseCount, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDashboardSSDataCount()
        {
            BLDashboard objDashboard = new BLDashboard();
            CurrentInfo objCurInfo = new CurrentInfo();
            MVCModels.DashboardSSTotalAmount expenseCount = new MVCModels.DashboardSSTotalAmount();
            expenseCount = objDashboard.GetDashboardSSDataCount(objCurInfo.GetCompanyCode(), objCurInfo.GetRegionCode());
            return Json(expenseCount, JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetSSPopUp(string mode)
        {
            BLDashboard objDashboard = new BLDashboard();
            CurrentInfo objCurInfo = new CurrentInfo();
            MVCModels.DasboardSSLst ssLst = new MVCModels.DasboardSSLst();
            ssLst = objDashboard.GetSSPopUp(objCurInfo.GetCompanyCode(), objCurInfo.GetRegionCode(), mode);
            return Json(ssLst, JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetUserDashboardCategoryInfo(MVCModels.AdminDashboardModel _objData)
        {
            try
            {
                BLDashboard objDashboard = new BLDashboard();
                CurrentInfo objCurInfo = new CurrentInfo();
                _objBLAdminDashboard.DivisionCode = _objData.DivisionCode;
                string _divisionCode = _objData.DivisionCode == null ? "All" : _objData.DivisionCode;
                List<MVCModels.UserCategoryDashboardModel> lstContent = new List<MVCModels.UserCategoryDashboardModel>();
                lstContent = objDashboard.GetUserDashboardCategoryInfo(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode(), _divisionCode).ToList();
                List<MVCModels.UserCategoryDashboardModel> lstApprovedDoc = new List<MVCModels.UserCategoryDashboardModel>();
                lstApprovedDoc = objDashboard.GetTotalApprovedDoctorsWithTeam(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode(), objCurInfo.GetRegionCode(), _divisionCode).ToList();
                lstContent.ForEach(x =>
                {
                    if (lstApprovedDoc.Count > 0)
                    {
                        x.Cur_Month_Total_Approved_Doctors = lstApprovedDoc[0].Cur_Month_Total_Approved_Doctors;
                        x.Pre_Month_Total_Approved_Doctors = lstApprovedDoc[0].Pre_Month_Total_Approved_Doctors;
                    }
                    else
                    {
                        x.Cur_Month_Total_Approved_Doctors = 0;
                        x.Pre_Month_Total_Approved_Doctors = 0;
                    }
                    //x.Cur_Month_Category_Missed_Doctors = (x.Cur_Month_Total_Visited_Doctors == 0) ? x.Cur_Month_Total_Approved_Doctors : x.Cur_Month_Category_Missed_Doctors;
                    //x.Pre_Month_Category_Missed_Doctors = (x.Pre_Month_Total_Visited_Doctors == 0) ? x.Pre_Month_Total_Approved_Doctors : x.Pre_Month_Category_Missed_Doctors;
                    x.Cur_Month_Category_Missed_Doctors = (x.Cur_Month_Total_Approved_Doctors - x.Cur_Month_Total_Visited_Doctors);
                    x.Pre_Month_Category_Missed_Doctors = (x.Pre_Month_Total_Approved_Doctors - x.Pre_Month_Total_Visited_Doctors);


                    x.Cur_Month_Category_Missed_Doctors_Percentage = Math.Round(((x.Cur_Month_Total_Approved_Doctors > 0) ? (Convert.ToDouble(x.Cur_Month_Category_Missed_Doctors) / Convert.ToDouble(x.Cur_Month_Total_Approved_Doctors)) * 100 : 0), 0);

                    x.Cur_Month_Category_VC_Exceeded_Percentage = Math.Round(((x.Cur_Month_Total_Approved_Doctors > 0) ? (Convert.ToDouble(x.Cur_Month_Category_VC_Exceeded) / Convert.ToDouble(x.Cur_Month_Total_Approved_Doctors)) * 100 : 0), 0);

                    x.Cur_Month_Category_VC_Missed_Percentage = Math.Round(((x.Cur_Month_Total_Approved_Doctors > 0) ? (Convert.ToDouble(x.Cur_Month_Category_VC_Missed) / Convert.ToDouble(x.Cur_Month_Total_Approved_Doctors)) * 100 : 0), 0);

                    x.Cur_Month_Category_VC_Followed_Percentage = Math.Round(((x.Cur_Month_Total_Approved_Doctors > 0) ? (Convert.ToDouble(x.Cur_Month_Category_VC_Followed) / Convert.ToDouble(x.Cur_Month_Total_Approved_Doctors)) * 100 : 0), 0);


                    x.Pre_Month_Category_Missed_Doctors_Percentage = Math.Round(((x.Pre_Month_Total_Approved_Doctors > 0) ? (Convert.ToDouble(x.Pre_Month_Category_Missed_Doctors) / Convert.ToDouble(x.Pre_Month_Total_Approved_Doctors)) * 100 : 0), 0);

                    x.Pre_Month_Category_VC_Exceeded_Percentage = Math.Round(((x.Pre_Month_Total_Approved_Doctors > 0) ? (Convert.ToDouble(x.Pre_Month_Category_VC_Exceeded) / Convert.ToDouble(x.Pre_Month_Total_Approved_Doctors)) * 100 : 0), 0);

                    x.Pre_Month_Category_VC_Missed_Percentage = Math.Round(((x.Pre_Month_Total_Approved_Doctors > 0) ? (Convert.ToDouble(x.Pre_Month_Category_VC_Missed) / Convert.ToDouble(x.Pre_Month_Total_Approved_Doctors)) * 100 : 0), 0);

                    x.Pre_Month_Category_VC_Followed_Percentage = Math.Round(((x.Pre_Month_Total_Approved_Doctors > 0) ? (Convert.ToDouble(x.Pre_Month_Category_VC_Followed) / Convert.ToDouble(x.Pre_Month_Total_Approved_Doctors)) * 100 : 0), 0);

                });
                return Json(lstContent, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                throw;
            }
        }

        public JsonResult GetUserDashboardCategoryInfoSingle()
        {
            try
            {
                BLDashboard objDashboard = new BLDashboard();
                CurrentInfo objCurInfo = new CurrentInfo();
                List<MVCModels.UserCategoryDashboardModel> lstContent = new List<MVCModels.UserCategoryDashboardModel>();
                lstContent = objDashboard.GetUserDashboardCategoryInfoSingle(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode()).ToList();
                List<MVCModels.UserCategoryDashboardModel> lstApprovedDoc = new List<MVCModels.UserCategoryDashboardModel>();
                lstApprovedDoc = objDashboard.GetTotalApprovedDoctors(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode(), objCurInfo.GetRegionCode()).ToList();
                lstContent.ForEach(x =>
                {
                    if (lstApprovedDoc.Count > 0)
                    {
                        x.Cur_Month_Total_Approved_Doctors = lstApprovedDoc[0].Cur_Month_Total_Approved_Doctors;
                        x.Pre_Month_Total_Approved_Doctors = lstApprovedDoc[0].Pre_Month_Total_Approved_Doctors;
                    }
                    else
                    {
                        x.Cur_Month_Total_Approved_Doctors = 0;
                        x.Pre_Month_Total_Approved_Doctors = 0;
                    }
                    //x.Cur_Month_Category_Missed_Doctors = (x.Cur_Month_Total_Visited_Doctors == 0) ? x.Cur_Month_Total_Approved_Doctors : x.Cur_Month_Category_Missed_Doctors;
                    //x.Pre_Month_Category_Missed_Doctors = (x.Pre_Month_Total_Visited_Doctors == 0) ? x.Pre_Month_Total_Approved_Doctors : x.Pre_Month_Category_Missed_Doctors;
                    x.Cur_Month_Category_Missed_Doctors = (x.Cur_Month_Total_Approved_Doctors - x.Cur_Month_Total_Visited_Doctors);
                    x.Pre_Month_Category_Missed_Doctors = (x.Pre_Month_Total_Approved_Doctors - x.Pre_Month_Total_Visited_Doctors);


                    x.Cur_Month_Category_Missed_Doctors_Percentage = Math.Round(((x.Cur_Month_Total_Approved_Doctors > 0) ? (Convert.ToDouble(x.Cur_Month_Category_Missed_Doctors) / Convert.ToDouble(x.Cur_Month_Total_Approved_Doctors)) * 100 : 0), 0);

                    x.Cur_Month_Category_VC_Exceeded_Percentage = Math.Round(((x.Cur_Month_Total_Approved_Doctors > 0) ? (Convert.ToDouble(x.Cur_Month_Category_VC_Exceeded) / Convert.ToDouble(x.Cur_Month_Total_Approved_Doctors)) * 100 : 0), 0);

                    x.Cur_Month_Category_VC_Missed_Percentage = Math.Round(((x.Cur_Month_Total_Approved_Doctors > 0) ? (Convert.ToDouble(x.Cur_Month_Category_VC_Missed) / Convert.ToDouble(x.Cur_Month_Total_Approved_Doctors)) * 100 : 0), 0);

                    x.Cur_Month_Category_VC_Followed_Percentage = Math.Round(((x.Cur_Month_Total_Approved_Doctors > 0) ? (Convert.ToDouble(x.Cur_Month_Category_VC_Followed) / Convert.ToDouble(x.Cur_Month_Total_Approved_Doctors)) * 100 : 0), 0);


                    x.Pre_Month_Category_Missed_Doctors_Percentage = Math.Round(((x.Pre_Month_Total_Approved_Doctors > 0) ? (Convert.ToDouble(x.Pre_Month_Category_Missed_Doctors) / Convert.ToDouble(x.Pre_Month_Total_Approved_Doctors)) * 100 : 0), 0);

                    x.Pre_Month_Category_VC_Exceeded_Percentage = Math.Round(((x.Pre_Month_Total_Approved_Doctors > 0) ? (Convert.ToDouble(x.Pre_Month_Category_VC_Exceeded) / Convert.ToDouble(x.Pre_Month_Total_Approved_Doctors)) * 100 : 0), 0);

                    x.Pre_Month_Category_VC_Missed_Percentage = Math.Round(((x.Pre_Month_Total_Approved_Doctors > 0) ? (Convert.ToDouble(x.Pre_Month_Category_VC_Missed) / Convert.ToDouble(x.Pre_Month_Total_Approved_Doctors)) * 100 : 0), 0);

                    x.Pre_Month_Category_VC_Followed_Percentage = Math.Round(((x.Pre_Month_Total_Approved_Doctors > 0) ? (Convert.ToDouble(x.Pre_Month_Category_VC_Followed) / Convert.ToDouble(x.Pre_Month_Total_Approved_Doctors)) * 100 : 0), 0);
                });
                return Json(lstContent, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                throw;
            }
        }

        public JsonResult GetUserDashboardTPMeetingPoint()
        {
            try
            {
                BLDashboard objDashboard = new BLDashboard();
                CurrentInfo objCurInfo = new CurrentInfo();
                List<MVCModels.TourPlannerModel> lstContent = new List<MVCModels.TourPlannerModel>();
                lstContent = objDashboard.GetUserDashboardTPMeetingPoint(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode()).ToList();
                lstContent.ForEach(z => z.TP_Date = Convert.ToDateTime(z.TP_Date).ToString("yyyy-MM-dd"));
                return Json(lstContent, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                throw;
            }
        }

        public JsonResult GetNextTwoDaysTourPlan()
        {
            try
            {
                BLDashboard objDashboard = new BLDashboard();
                CurrentInfo objCurInfo = new CurrentInfo();
                List<MVCModels.UserDashboardTourPlan> lstContent = new List<MVCModels.UserDashboardTourPlan>();
                lstContent = objDashboard.GetNextTwoDaysTourPlan(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode()).ToList();
                lstContent.ForEach(z => z.TP_Date = Convert.ToDateTime(z.TP_Date).ToString("yyyy-MM-dd"));
                return Json(lstContent, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                throw;
            }
        }
        public JsonResult GetUserDashboardUnapprovedDCR()
        {
            try
            {
                BLDashboard objDashboard = new BLDashboard();
                CurrentInfo objCurInfo = new CurrentInfo();
                List<MVCModels.DCRApprovalModel> lstContent = new List<MVCModels.DCRApprovalModel>();
                lstContent = objDashboard.GetUserDashboardUnapprovedDCR(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode()).ToList();
                lstContent.ForEach(x => { x.Unapproval_Reason = x.Unapproval_Reason.Split('~').Last().TrimEnd('^').ToString(); x.DCR_Date = Convert.ToDateTime(x.DCR_Date).ToString("dd/MM/yyyy"); });
                return Json(lstContent, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                throw;
            }
        }
        public JsonResult GetUserDashboardUnapprovedTP()
        {
            try
            {
                BLDashboard objDashboard = new BLDashboard();
                CurrentInfo objCurInfo = new CurrentInfo();
                List<MVCModels.TourPlannerModel> lstContent = new List<MVCModels.TourPlannerModel>();
                lstContent = objDashboard.GetUserDashboardUnapprovedTP(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode()).ToList();
                lstContent.ForEach(x => { x.TP_Date = Convert.ToDateTime(x.TP_Date).ToString("dd/MM/yyyy"); });
                return Json(lstContent, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                throw;
            }
        }
        public JsonResult GetUserDashboardTPLock()
        {
            try
            {
                BLDashboard objDashboard = new BLDashboard();
                CurrentInfo objCurInfo = new CurrentInfo();
                List<MVCModels.TPLockStatusModel> lstContent = new List<MVCModels.TPLockStatusModel>();
                lstContent = objDashboard.GetUserDashboardTPLock(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode(), objCurInfo.GetUserTypeCode()).ToList();
                return Json(lstContent, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                throw;
            }
        }
        public JsonResult GetUserDashboardCDRLock()
        {
            try
            {
                BLDashboard objDashboard = new BLDashboard();
                CurrentInfo objCurInfo = new CurrentInfo();
                List<MVCModels.DcrLockDetail> lstContent = new List<MVCModels.DcrLockDetail>();
                lstContent = objDashboard.GetUserDashboardCDRLock(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode(), objCurInfo.GetUserTypeCode()).ToList();
                return Json(lstContent, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                throw;
            }
        }
        public JsonResult GetUserDashboardSSDetails()
        {
            try
            {
                BLDashboard objDashboard = new BLDashboard();
                CurrentInfo objCurInfo = new CurrentInfo();
                List<MVCModels.SecondarySalesOpeningbalanaceModel> lstContent = new List<MVCModels.SecondarySalesOpeningbalanaceModel>();
                lstContent = objDashboard.GetUserDashboardSSDetails(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode()).ToList();
                return Json(lstContent, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                throw;
            }
        }
        public JsonResult GetUserDashboardDoctorBirthday()
        {
            try
            {
                BLDashboard objDashboard = new BLDashboard();
                CurrentInfo objCurInfo = new CurrentInfo();
                List<MVCModels.HiDoctor_Master.DoctorModel> lstContent = new List<MVCModels.HiDoctor_Master.DoctorModel>();
                lstContent = objDashboard.GetUserDashboardDoctorBirthday(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode()).ToList();
                return Json(lstContent, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                throw;
            }
        }
        public JsonResult GetUserDashboardTPLockDetails()
        {
            try
            {
                BLDashboard objDashboard = new BLDashboard();
                CurrentInfo objCurInfo = new CurrentInfo();
                List<MVCModels.TourPlannerWrapperModel> lstContent = new List<MVCModels.TourPlannerWrapperModel>();
                lstContent = objDashboard.GetUserDashboardTPLockDetails(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode()).ToList();
                lstContent[0].lstHeader.ForEach(x => x.TP_Date = Convert.ToDateTime(x.TP_Date).ToString("dd/MM/yyyy"));
                lstContent[0].lstTPDoctors.ForEach(x => x.TP_Date = Convert.ToDateTime(x.TP_Date).ToString("dd/MM/yyyy"));
                lstContent[0].lstTPSFC.ForEach(x => x.TP_Date = Convert.ToDateTime(x.TP_Date).ToString("dd/MM/yyyy"));
                return Json(lstContent, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                throw;
            }
        }
        public JsonResult GetUserDashboardCDRLockMoreInfo(string lockType)
        {
            try
            {
                BLDashboard objDashboard = new BLDashboard();
                CurrentInfo objCurInfo = new CurrentInfo();
                List<MVCModels.DcrLockDetail> lstContent = new List<MVCModels.DcrLockDetail>();
                lstContent = objDashboard.GetUserDashboardCDRLockMoreInfo(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode(), lockType).ToList();
                lstContent.ForEach(x =>
                {
                    x.LockedDate = Convert.ToDateTime(x.LockedDate).ToString("dd/MM/yyyy");
                    x.Released_Date = Convert.ToDateTime(x.Released_Date).ToString("dd/MM/yyyy");
                    x.DCR_Actual_Date = Convert.ToDateTime(x.DCR_Actual_Date).ToString("dd/MM/yyyy");
                }
                    );
                return Json(lstContent, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                throw;
            }
        }
        public JsonResult GetUserDashboardExpClaimMoreInfo()
        {
            try
            {
                BLDashboard objDashboard = new BLDashboard();
                CurrentInfo objCurInfo = new CurrentInfo();
                List<MVCModels.ExpenseClaimHeaderModel> lstContent = new List<MVCModels.ExpenseClaimHeaderModel>();
                lstContent = objDashboard.GetUserDashboardExpClaimMoreInfo(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode()).ToList();
                return Json(lstContent, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                throw;
            }
        }

        public JsonResult GetUserDashboardLiveCounts()
        {
            try
            {
                BLDashboard objDashboard = new BLDashboard();
                CurrentInfo objCurInfo = new CurrentInfo();
                List<MVCModels.UserDashboardCountModel> lstContent = new List<MVCModels.UserDashboardCountModel>();
                lstContent = objDashboard.GetUserDashboardLiveCounts(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode()).ToList();
                return Json(lstContent, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                throw;
            }
        }
        public JsonResult GetUserDashboardPendingDCR()
        {
            try
            {
                BLDashboard objDashboard = new BLDashboard();
                CurrentInfo objCurInfo = new CurrentInfo();
                List<MVCModels.UserDashboardPendingDCR> lstContent = new List<MVCModels.UserDashboardPendingDCR>();
                lstContent = objDashboard.GetUserDashboardPendingDCR(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode()).ToList();
                lstContent.ForEach(x =>
                {
                    x.DCR_Actual_Date = Convert.ToDateTime(x.DCR_Actual_Date).ToString("yyyy-MM-dd");
                    x.Formatted_DCR_Actual_Date = Convert.ToDateTime(x.DCR_Actual_Date).ToString("dd/MM/yyyy");
                });
                return Json(lstContent, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                throw;
            }
        }
        public JsonResult GetUserDashboardPendingTP()
        {
            try
            {
                BLDashboard objDashboard = new BLDashboard();
                CurrentInfo objCurInfo = new CurrentInfo();
                List<MVCModels.UserDashboardPendingTP> lstContent = new List<MVCModels.UserDashboardPendingTP>();
                lstContent = objDashboard.GetUserDashboardPendingTP(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode()).ToList();
                lstContent.ForEach(x =>
                {
                    x.Tp_Date = Convert.ToDateTime(x.Tp_Date).ToString("yyyy-MM-dd");
                    x.Formatted_Tp_Date = Convert.ToDateTime(x.Tp_Date).ToString("dd/MM/yyyy");
                });
                return Json(lstContent, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                throw;
            }
        }
        public JsonResult GetUserDashboardPendingClaim(int month, int year)
        {
            try
            {
                BLDashboard objDashboard = new BLDashboard();
                CurrentInfo objCurInfo = new CurrentInfo();
                List<MVCModels.UserDashboardPendingClaim> lstContent = new List<MVCModels.UserDashboardPendingClaim>();
                lstContent = objDashboard.GetUserDashboardPendingClaim(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode(), month, year).ToList();
                lstContent.ForEach(x =>
                {
                    x.Date_From = Convert.ToDateTime(x.Date_From).ToString("dd/MM/yyyy");
                    x.Date_To = Convert.ToDateTime(x.Date_To).ToString("dd/MM/yyyy");
                    x.Entered_DateTime = Convert.ToDateTime(x.Entered_DateTime).ToString("dd/MM/yyyy");
                });
                return Json(lstContent, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                throw;
            }

        }
        public JsonResult GetUserDashboardSS(string mode)
        {
            try
            {
                BLDashboard objDashboard = new BLDashboard();
                CurrentInfo objCurInfo = new CurrentInfo();
                List<MVCModels.SecondarySalesOpeningbalanaceModel> lstContent = new List<MVCModels.SecondarySalesOpeningbalanaceModel>();
                lstContent = objDashboard.GetUserDashboardSS(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode(), mode.Substring(0, 1)).ToList();
                return Json(lstContent, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                throw;
            }
        }

        public JsonResult GetUserDashboardAppliedDCR(string mode)
        {
            try
            {
                BLDashboard objDashboard = new BLDashboard();
                CurrentInfo objCurInfo = new CurrentInfo();
                List<MVCModels.UserDashboardPendingDCR> lstContent = new List<MVCModels.UserDashboardPendingDCR>();
                lstContent = objDashboard.GetUserDashboardAppliedDCR(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode(), mode).ToList();
                lstContent.ForEach(x =>
                {
                    x.DCR_Actual_Date = Convert.ToDateTime(x.DCR_Actual_Date).ToString("yyyy-MM-dd");
                    x.Formatted_DCR_Actual_Date = Convert.ToDateTime(x.DCR_Actual_Date).ToString("dd/MM/yyyy");
                });
                return Json(lstContent, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                throw;
            }
        }
        public JsonResult GetUserDashboardAppliedTP(string mode)
        {
            try
            {
                BLDashboard objDashboard = new BLDashboard();
                CurrentInfo objCurInfo = new CurrentInfo();
                List<MVCModels.UserDashboardPendingTP> lstContent = new List<MVCModels.UserDashboardPendingTP>();
                lstContent = objDashboard.GetUserDashboardAppliedTP(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode(), mode).ToList();
                lstContent.ForEach(x =>
                {
                    x.Tp_Date = Convert.ToDateTime(x.Tp_Date).ToString("yyyy-MM-dd");
                    x.Formatted_Tp_Date = Convert.ToDateTime(x.Tp_Date).ToString("dd/MM/yyyy");
                });
                return Json(lstContent, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                throw;
            }
        }
        public JsonResult GetUserDashboardAppliedClaim(string mode)
        {
            try
            {
                BLDashboard objDashboard = new BLDashboard();
                CurrentInfo objCurInfo = new CurrentInfo();
                List<MVCModels.UserDashboardPendingClaim> lstContent = new List<MVCModels.UserDashboardPendingClaim>();
                lstContent = objDashboard.GetUserDashboardAppliedClaim(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode(), mode).ToList();
                lstContent.ForEach(x =>
                {
                    x.Date_From = Convert.ToDateTime(x.Date_From).ToString("dd/MM/yyyy");
                    x.Date_To = Convert.ToDateTime(x.Date_To).ToString("dd/MM/yyyy");
                    x.Entered_DateTime = Convert.ToDateTime(x.Entered_DateTime).ToString("dd/MM/yyyy");
                });
                return Json(lstContent, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                throw;
            }

        }

        public JsonResult GetUserDashboardPendingInfo()
        {
            try
            {
                BLDashboard objDashboard = new BLDashboard();
                CurrentInfo objCurInfo = new CurrentInfo();
                List<MVCModels.UserDashboardModel> lstContent = new List<MVCModels.UserDashboardModel>();
                lstContent = objDashboard.GetUserDashboardPendingInfo(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode()).ToList();
                return Json(lstContent, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                throw;
            }
        }

        public JsonResult GetUserDashboardCategoryWiseVisits(string userCode, string regionCode, string mode, string category, string speciality, string isCurrent)
        {
            try
            {
                CurrentInfo objCurInfo = new CurrentInfo();
                if (string.IsNullOrEmpty(userCode))
                {
                    userCode = objCurInfo.GetUserCode();
                }
                if (string.IsNullOrEmpty(regionCode))
                {
                    regionCode = objCurInfo.GetRegionCode();
                }

                int CategoryMode = 4;
                if (mode == "MISSED")
                {
                    CategoryMode = 1;
                }
                else if (mode == "MET_AS_PER_STANDARD")
                {
                    CategoryMode = 2;
                }
                else if (mode == "LESS_THAN_MET")
                {
                    CategoryMode = 3;
                }
                else
                {
                    CategoryMode = 4;
                }
                BLDashboard objDashboard = new BLDashboard();

                List<MVCModels.DashboardCategoryWiseDoctorVisit> lstContent = new List<MVCModels.DashboardCategoryWiseDoctorVisit>();
                lstContent = objDashboard.GetUserDashboardCategoryWiseVisits(objCurInfo.GetCompanyCode(), userCode, regionCode, category, speciality, isCurrent, CategoryMode).ToList();
                List<MVCModels.DashboardCategoryWiseDoctorVisit> lstFilteredContent = new List<MVCModels.DashboardCategoryWiseDoctorVisit>();
                if (category.ToUpper() == "NULL")
                {
                    lstContent = lstContent.AsEnumerable().Where(z => z.Category_Name == "N/A").ToList();
                }
                if (mode == "MISSED")
                {
                    lstFilteredContent = lstContent.AsEnumerable().Where(x => x.Cur_Month_Count == 0).ToList();
                }
                else if (mode == "MET_AS_PER_STANDARD")
                {
                    lstFilteredContent = lstContent.AsEnumerable().Where(x => x.Cur_Month_Count == x.Standard_Visits_Count).ToList();
                }
                else if (mode == "LESS_THAN_MET")
                {
                    lstFilteredContent = lstContent.AsEnumerable().Where(x => x.Cur_Month_Count < x.Standard_Visits_Count && x.Cur_Month_Count > 0).ToList();
                }
                else
                {
                    lstFilteredContent = lstContent.AsEnumerable().Where(x => x.Cur_Month_Count > x.Standard_Visits_Count).ToList();
                }

                return Json(lstFilteredContent, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                throw;
            }
        }

        public JsonResult GetUserDashboardDoctorVisitSummary(string isCurrent, string IsSummaryMode, string Mode, int PageNo, int Pagesize)
        {
            try
            {
                CurrentInfo objCurInfo = new CurrentInfo();
                BLDashboard objDashboard = new BLDashboard();
                MVCModels.DashBoardDoctorVisitSummaryandTotalCount lstContent = new MVCModels.DashBoardDoctorVisitSummaryandTotalCount();
                lstContent = objDashboard.GetUserDashboardDoctorVisitSummary(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode(), objCurInfo.GetRegionCode(), isCurrent, IsSummaryMode, Mode, PageNo, Pagesize);
                lstContent.lstDashboardDoctorVisitSummary.ForEach(x => x.Category_Missed_Doctors = (x.Total_Approved_Doctors - x.Total_Visited_Doctors));
                return Json(lstContent, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                throw;
            }
        }

        #endregion User dashboard


        //------------------- Admin Dashboard --------------------//

        #region Admin Dashboard

        public ActionResult AdminDashBoard()
        {
            GetPrivillegeValue();
            CurrentInfo objCurInfo = new CurrentInfo();
            BLUser objUser = new BLUser();
            List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
            lstUser = objUser.GetChildUsersCodeAndNameOnly(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode());

            ViewBag.Current_Date = System.DateTime.Now.ToString("yyyy-MM-dd");
            ViewBag.Previous_Date = System.DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd");
            ViewBag.Next_Date = System.DateTime.Now.AddDays(1).ToString("yyyy-MM-dd");
            ViewBag.Current_Month = System.DateTime.Now.Month + "-" + System.DateTime.Now.Year;
            ViewBag.Previous_Month = System.DateTime.Now.AddMonths(-1).Month + "-" + System.DateTime.Now.AddMonths(-1).Year;
            ViewBag.Next_Month = System.DateTime.Now.AddMonths(1).Month + "-" + System.DateTime.Now.AddMonths(1).Year;
            ViewBag.Child_User_Count = lstUser.Count();
            ViewBag.Day_After_Tomorrow = System.DateTime.Now.AddDays(2).ToString("yyyy-MM-dd");
            ViewBag.Month = System.DateTime.Now.Month;
            ViewBag.Year = System.DateTime.Now.Year;

            return View();
        }
        public ActionResult AdminCategoryCoverage_Mobile()
        {
            return View();
        }

        public ActionResult AdminTargetDashBoard_Mobile()
        {
            return View();
        }
        public ActionResult AdminDashBoardMaster()
        { return View(); }
        public JsonResult GetEmployeeBirthdayPopUp()
        {
            _objBLAdminDashboard.CompanyCode = _objCurrentInfo.GetCompanyCode();

            return Json(_objBLAdminDashboard.GetEmployeeBirthdayPopUp().ToList(), JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetDivisions()
        {
            _objBLAdminDashboard.CompanyCode = _objCurrentInfo.GetCompanyCode();
            _objBLAdminDashboard.UserCode = _objCurrentInfo.GetUserCode();
            return Json(_objBLAdminDashboard.GetDivisions().ToList(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAdminDashboardLiveCounts()
        {
            try
            {
                GetPrivillegeValue();
                MVCModels.AdminDashboardCountModel _content = new MVCModels.AdminDashboardCountModel();
                _objBLAdminDashboard.CompanyCode = _objCurrentInfo.GetCompanyCode();
                _objBLAdminDashboard.UserCode = _objCurrentInfo.GetUserCode();
                _content = _objBLAdminDashboard.GetAdminDashboardLiveCounts();
                return Json(_content, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                throw;
            }
        }


        public JsonResult GetPrimarySecondarywithTarget(MVCModels.AdminDashboardModel _objData)
        {
            _objBLAdminDashboard.CompanyCode = _objCurrentInfo.GetCompanyCode();
            _objBLAdminDashboard.UserCode = _objCurrentInfo.GetUserCode();
            _objBLAdminDashboard.DivisionCode = _objData.DivisionCode;
            return Json(_objBLAdminDashboard.GetPrimarySecondarywithTarget().ToList(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetOpenPositionCount(MVCModels.AdminDashboardModel _objData)
        {
            _objBLAdminDashboard.CompanyCode = _objCurrentInfo.GetCompanyCode();
            _objBLAdminDashboard.RegionCode = _objCurrentInfo.GetRegionCode();
            return Json(_objBLAdminDashboard.GetOpenPositionCount(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetOpenPositionPopUp(MVCModels.AdminDashboardModel _objData)
        {
            _objBLAdminDashboard.CompanyCode = _objCurrentInfo.GetCompanyCode();
            _objBLAdminDashboard.RegionCode = _objCurrentInfo.GetRegionCode();
            _objBLAdminDashboard.DivisionCode = _objData.DivisionCode;
            return Json(_objBLAdminDashboard.GetPopUpOpenPosition(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetJoinerAttrition()
        {
            _objBLAdminDashboard.CompanyCode = _objCurrentInfo.GetCompanyCode();
            _objBLAdminDashboard.UserCode = _objCurrentInfo.GetUserCode();
            return Json(_objBLAdminDashboard.GetJoinerAttrition().ToList(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetJoinerAttritionPopUp(MVCModels.AdminDashboardModel _objData)
        {
            _objBLAdminDashboard.CompanyCode = _objCurrentInfo.GetCompanyCode();
            _objBLAdminDashboard.UserCode = _objCurrentInfo.GetUserCode();
            _objBLAdminDashboard.Month = _objData.Month;
            _objBLAdminDashboard.Year = _objData.Year;
            _objBLAdminDashboard.JA_Wise = _objData.JA_Wise;

            return Json(_objBLAdminDashboard.GetJoinerAttritionPopUp(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetTopTenProduct(MVCModels.AdminDashboardModel _objData)
        {
            MVCModels.TopTenSalesProduct _objTopTenSales = new MVCModels.TopTenSalesProduct();
            _objBLAdminDashboard.CompanyCode = _objCurrentInfo.GetCompanyCode();
            _objBLAdminDashboard.UserCode = _objCurrentInfo.GetUserCode();
            _objBLAdminDashboard.IsPS = _objData.IsPS;
            _objBLAdminDashboard.DivisionCode = _objData.DivisionCode;
            _objTopTenSales = _objBLAdminDashboard.GetTopTenProduct();
            return Json(_objTopTenSales, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDcrTPLockCounts(MVCModels.AdminDashboardModel _objData)
        {
            _objBLAdminDashboard.CompanyCode = _objCurrentInfo.GetCompanyCode();
            _objBLAdminDashboard.UserCode = _objCurrentInfo.GetUserCode();
            _objBLAdminDashboard.DcrTpLockStatus = _objData.DcrTpLockStatus;
            _objBLAdminDashboard.Lock_Type = _objData.Lock_Type;
            return Json(_objBLAdminDashboard.GetDcrTPLockCounts(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDcrTPLockPopUpDetails(MVCModels.AdminDashboardModel _objData)
        {
            _objBLAdminDashboard.CompanyCode = _objCurrentInfo.GetCompanyCode();
            _objBLAdminDashboard.UserCode = _objCurrentInfo.GetUserCode();
            _objBLAdminDashboard.DcrTpLockStatus = _objData.DcrTpLockStatus;
            _objBLAdminDashboard.Lock_Type = _objData.Lock_Type;
            return Json(_objBLAdminDashboard.GetDcrTPLockPopUpDetails(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAdminDashboardDoctorVisitSummary(MVCModels.AdminDashboardModel _objData)
        {
            try
            {
                _objBLAdminDashboard.CompanyCode = _objCurrentInfo.GetCompanyCode();
                _objBLAdminDashboard.UserCode = _objCurrentInfo.GetUserCode();
                _objBLAdminDashboard.RegionCode = _objCurrentInfo.GetRegionCode();
                _objBLAdminDashboard.IsCurrent = _objData.IsCurrent;
                _objBLAdminDashboard.DivisionCode = _objData.DivisionCode;
                _objBLAdminDashboard.Mode = _objData.Mode;
                _objBLAdminDashboard.PageNo = _objData.PageNo;
                _objBLAdminDashboard.Pagesize = _objData.Pagesize;
                MVCModels.DashBoardDoctorVisitSummaryandTotalCount Visits = new MVCModels.DashBoardDoctorVisitSummaryandTotalCount();
                Visits = _objBLAdminDashboard.GetAdminDashboardDoctorVisitSummary();
                Visits.lstDashboardDoctorVisitSummary.ForEach(x => x.Category_Missed_Doctors = (x.Total_Approved_Doctors - x.Total_Visited_Doctors));
                //lstContent.ForEach(x => x.Category_Missed_Doctors = (x.Total_Approved_Doctors - x.Total_Visited_Doctors));
                return Json(Visits, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                throw;
            }
        }


        public JsonResult GetAdminDashboardCategoryWiseVisits(string userCode, string regionCode, string mode, string category, string speciality, string isCurrent, string divisionCode)
        {
            try
            {
                CurrentInfo objCurInfo = new CurrentInfo();
                if (string.IsNullOrEmpty(userCode))
                {
                    userCode = objCurInfo.GetUserCode();
                }
                if (string.IsNullOrEmpty(regionCode))
                {
                    regionCode = objCurInfo.GetRegionCode();
                }

                int CategoryMode = 4;
                if (mode == "MISSED")
                {
                    CategoryMode = 1;
                }
                else if (mode == "MET_AS_PER_STANDARD")
                {
                    CategoryMode = 2;
                }
                else if (mode == "LESS_THAN_MET")
                {
                    CategoryMode = 3;
                }
                else
                {
                    CategoryMode = 4;
                }

                _objBLAdminDashboard.IsCurrent = isCurrent;
                List<MVCModels.DashboardCategoryWiseDoctorVisit> lstContent = new List<MVCModels.DashboardCategoryWiseDoctorVisit>();
                lstContent = _objBLAdminDashboard.GetAdminDashboardCategoryWiseVisits(objCurInfo.GetCompanyCode(), userCode, regionCode, category, speciality, divisionCode, CategoryMode).ToList();
                List<MVCModels.DashboardCategoryWiseDoctorVisit> lstFilteredContent = new List<MVCModels.DashboardCategoryWiseDoctorVisit>();
                if (category.ToUpper() == "NULL")
                {
                    lstContent = lstContent.AsEnumerable().Where(z => z.Category_Name == "N/A").ToList();
                }
                if (mode == "MISSED")
                {
                    lstFilteredContent = lstContent.AsEnumerable().Where(x => x.Cur_Month_Count == 0).ToList();
                }
                else if (mode == "MET_AS_PER_STANDARD")
                {
                    lstFilteredContent = lstContent.AsEnumerable().Where(x => x.Cur_Month_Count == x.Standard_Visits_Count).ToList();
                }
                else if (mode == "LESS_THAN_MET")
                {
                    lstFilteredContent = lstContent.AsEnumerable().Where(x => x.Cur_Month_Count < x.Standard_Visits_Count && x.Cur_Month_Count > 0).ToList();
                }
                else
                {
                    lstFilteredContent = lstContent.AsEnumerable().Where(x => x.Cur_Month_Count > x.Standard_Visits_Count).ToList();
                }

                return Json(lstFilteredContent, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                throw;
            }
        }



        public JsonResult GetMarketingCampaignCount()
        {
            _objBLAdminDashboard.CompanyCode = _objCurrentInfo.GetCompanyCode();
            _objBLAdminDashboard.UserCode = _objCurrentInfo.GetUserCode();
            _objBLAdminDashboard.RegionCode = _objCurrentInfo.GetRegionCode();
            return Json(_objBLAdminDashboard.GetMarketingCampaignCount(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetMarketingCampaignCountPopUp()
        {
            _objBLAdminDashboard.CompanyCode = _objCurrentInfo.GetCompanyCode();
            _objBLAdminDashboard.RegionCode = _objCurrentInfo.GetRegionCode();
            return Json(_objBLAdminDashboard.GetMarketingCampaignCountPopUp(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetMarketingCampaignRegionPopUP(MVCModels.AdminDashboardModel _objData)
        {
            _objBLAdminDashboard.Campaign_Code = _objData.Campaign_Code;
            _objBLAdminDashboard.RegionCode = _objCurrentInfo.GetRegionCode();
            return Json(_objBLAdminDashboard.GetMarketingCampaignRegionPopUP(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetMarketingCampaignDetailsForDoctor(MVCModels.AdminDashboardModel _objData)
        {
            _objBLAdminDashboard.RegionCode = _objData.RegionCode;
            _objBLAdminDashboard.Campaign_Code = _objData.Campaign_Code;
            _objBLAdminDashboard.Created_By = _objData.Created_By;
            return Json(_objBLAdminDashboard.GetMarketingCampaignDetailsForDoctor(), JsonRequestBehavior.AllowGet);
        }



        public JsonResult GetDCRCompliance(MVCModels.AdminDashboardModel _objData)
        {
            _objBLAdminDashboard.CompanyCode = _objCurrentInfo.GetCompanyCode();
            _objBLAdminDashboard.UserCode = _objCurrentInfo.GetUserCode();
            _objBLAdminDashboard.MonthType = _objData.MonthType;
            return Json(_objBLAdminDashboard.GetDCRCompliance(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDCRCompliancePopUp(MVCModels.AdminDashboardModel _objData)
        {
            _objBLAdminDashboard.CompanyCode = _objCurrentInfo.GetCompanyCode();
            _objBLAdminDashboard.UserCode = _objCurrentInfo.GetUserCode();
            _objBLAdminDashboard.MonthType = _objData.MonthType;
            _objBLAdminDashboard.Division_Name = _objData.Division_Name;
            _objBLAdminDashboard.User_Type = _objData.User_Type;
            return Json(_objBLAdminDashboard.GetDCRCompliancePopUp(), JsonRequestBehavior.AllowGet);
        }

        #endregion Admin Dashboard

        public ActionResult NotificationIcons() // right side notification to create new view for Non-field user
        {
            return View();
        }

        public ActionResult NotificationFieldUser() // right side notification to create new view for field user
        {
            return View();
        }

        #region Category Coverage

        public JsonResult GetNewCategoryCoverage(MVCModels.AdminDashboardModel _objData)
       {

            _objBLAdminDashboard.CompanyCode = _objCurrentInfo.GetCompanyCode();
            _objBLAdminDashboard.RegionCode = _objCurrentInfo.GetRegionCode();
            _objBLAdminDashboard.Division_Name = _objData.Division_Name;
            _objBLAdminDashboard.Month = _objData.Month;
            _objBLAdminDashboard.Year = _objData.Year;
            return Json(_objBLAdminDashboard.GetNewCategoryCoverage(), JsonRequestBehavior.AllowGet);


        }
        public JsonResult GetNewCategoryCoverageSummery(MVCModels.AdminDashboardModel _objData)
        {

            _objBLAdminDashboard.CompanyCode = _objCurrentInfo.GetCompanyCode();
            _objBLAdminDashboard.RegionCode = _objCurrentInfo.GetRegionCode();
            _objBLAdminDashboard.Division_Name = _objData.Division_Name;
            _objBLAdminDashboard.Month = _objData.Month;
            _objBLAdminDashboard.Year = _objData.Year;
            _objBLAdminDashboard.Option_Type = _objData.Option_Type;
            return Json(_objBLAdminDashboard.GetNewCategoryCoverageSummary(), JsonRequestBehavior.AllowGet);


        }
        public JsonResult GetNewCategoryCoverageSummery_Drill(MVCModels.AdminDashboardModel _objData)
        {
            _objBLAdminDashboard.CompanyCode = _objCurrentInfo.GetCompanyCode();
            _objBLAdminDashboard.Month = _objData.Month;
            _objBLAdminDashboard.Year = _objData.Year;
            _objBLAdminDashboard.RegionCode = _objData.RegionCode;
            _objBLAdminDashboard.Option_Type = _objData.Option_Type;
            return Json(_objBLAdminDashboard.GetNewCategoryCoverageSummary_Drill(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetRegionCategoryCoverageSummery(MVCModels.AdminDashboardModel _objData)
        {
            _objBLAdminDashboard.CompanyCode = _objCurrentInfo.GetCompanyCode();
            _objBLAdminDashboard.Month = _objData.Month;
            _objBLAdminDashboard.Year = _objData.Year;
            _objBLAdminDashboard.RegionCode = _objData.RegionCode;
            return Json(_objBLAdminDashboard.GetRegionCategoryCoverageSummery(), JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region Dashboard Revamp
        public ActionResult DashboardDrilldown(string id)
        {
            GetPrivillegeValue();
            ViewBag.Month_Status = id;
            return View();
        }
        public JsonResult GetDCRComplianceNew(MVCModels.AdminDashboardModel _objData)
        {
            _objBLAdminDashboard.CompanyCode = _objCurrentInfo.GetCompanyCode();
            _objBLAdminDashboard.UserCode = _objCurrentInfo.GetUserCode();
            _objBLAdminDashboard.MonthType = _objData.MonthType;
            _objBLAdminDashboard.Division_Name = _objData.Division_Name;
            _objBLAdminDashboard.User_Type = _objData.User_Type;
            return Json(_objBLAdminDashboard.GetDCRComplianceNew(), JsonRequestBehavior.AllowGet);
        }
        public ActionResult MarketingCampaign(string id)
        {
            GetPrivillegeValue();
            ViewBag.dashboard = id;
            return View();
        }

        #endregion



    }

}
