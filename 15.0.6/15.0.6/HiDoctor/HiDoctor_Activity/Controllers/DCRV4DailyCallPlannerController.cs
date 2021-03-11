#region Using
using System;
using System.Web;
using System.Web.Mvc;
using System.Data;
using DataControl;
#endregion Using

namespace HiDoctor_Activity.Controllers
{
    [AjaxSessionActionFilter]
    public class DCRV4DailyCallPlannerController : Controller
    {
        #region Index
        public ActionResult Index(string dcrDate, string type)
        {
            ViewBag.dcrDate = dcrDate;
            ViewBag.type = type;
            return View();
        }

        public ActionResult Create(string dcrDate, string type)
        {
            ViewBag.dcrDate = dcrDate;
            ViewBag.type = type;
            return View();
        }
        #endregion Index

        #region Private Variables
        CurrentInfo objCurr = new CurrentInfo();
        BL_DCRReport _objDCRBL = new BL_DCRReport();
        #endregion Private Variables

        #region Public Methods
        public JsonResult GetDailyCallPlanner(FormCollection coll)
        {
            try
            {
                DataControl.JSONConverter objJson = new DataControl.JSONConverter();
                DataTable dtDailyPlan = new DataTable();
                dtDailyPlan = _objDCRBL.GetDailyCallPlanner(objCurr.GetCompanyCode(), objCurr.GetUserCode(), coll["dcrDate"].ToString());
                return Json(objJson.Serialize(dtDailyPlan));
            }
            catch
            {
                throw;
            }
        }

        public JsonResult GetDailyCallPlannerDoctorDetails(FormCollection coll)
        {
            try
            {
                DataControl.JSONConverter objJson = new DataControl.JSONConverter();
                DataSet dsDailyPlanDoctor = new DataSet();
                string fromDate = string.Empty, month = string.Empty, year = string.Empty;

                #region FromDate calculation

                if (coll["YTDType"].ToString() == "APRIL")
                {
                    if (DateTime.Now.Month < 4)
                    {
                        fromDate = (DateTime.Now.Year - 1).ToString() + "-04-01";
                    }
                    else
                    {
                        fromDate = DateTime.Now.Year.ToString() + "-04-01";
                    }
                }
                else
                {
                    if (DateTime.Now.Month < 3)
                    {
                        fromDate = (DateTime.Now.Year - 1).ToString() + "-03-01";
                    }
                    else
                    {
                        fromDate = DateTime.Now.Year.ToString() + "-03-01";
                    }
                }
                #endregion FromDate calculation

                DateTime dtdcrDate = Convert.ToDateTime(coll["dcrDate"]);
                DateTime dtPrevDate = dtdcrDate.AddMonths(-1);

                month = dtPrevDate.Month.ToString();
                year = dtPrevDate.Year.ToString();

                dsDailyPlanDoctor = _objDCRBL.GetDailyCallPlannerDoctorDetails(objCurr.GetCompanyCode(), objCurr.GetUserCode(), objCurr.GetRegionCode(), month, year, fromDate, coll["dcrDate"].ToString());
                return Json(objJson.Serialize(dsDailyPlanDoctor));
            }
            catch
            {
                throw;
            }
        }

        public JsonResult GetDoctorProductMappingDetail(FormCollection coll)
        {
            try
            {
                DataControl.JSONConverter objJson = new DataControl.JSONConverter();
                DataTable dtDoctorProduct = new DataTable();
                dtDoctorProduct = _objDCRBL.GetDoctorProductMappingDetail(objCurr.GetCompanyCode(), coll["customerCode"].ToString(), objCurr.GetRegionCode());

                return Json(objJson.Serialize(dtDoctorProduct));
            }
            catch
            {
                throw;
            }
        }

        public JsonResult GetProductGivenInLastMonth(FormCollection coll)
        {
            try
            {
                DataControl.JSONConverter objJson = new DataControl.JSONConverter();
                DataTable dtProduct = new DataTable();
                string month = string.Empty, year = string.Empty;

                DateTime dtdcrDate = Convert.ToDateTime(coll["dcrDate"]);
                DateTime dtPrevDate = dtdcrDate.AddMonths(-1);

                month = dtPrevDate.Month.ToString();
                year = dtPrevDate.Year.ToString();

                dtProduct = _objDCRBL.GetProductGivenInLastMonth(objCurr.GetCompanyCode(), objCurr.GetUserCode(), year, month, coll["type"].ToString(), coll["customerCode"].ToString());

                return Json(objJson.Serialize(dtProduct));
            }
            catch
            {
                throw;
            }
        }

        public JsonResult GetNonSampleGivenYTD(FormCollection coll)
        {
            try
            {
                DataControl.JSONConverter objJson = new DataControl.JSONConverter();
                DataTable dtProduct = new DataTable();
                string fromDate = string.Empty;

                #region FromDate calculation

                if (coll["YTDType"].ToString() == "APRIL")
                {
                    if (DateTime.Now.Month < 4)
                    {
                        fromDate = (DateTime.Now.Year - 1).ToString() + "-04-01";
                    }
                    else
                    {
                        fromDate = DateTime.Now.Year.ToString() + "-04-01";
                    }
                }
                else
                {
                    if (DateTime.Now.Month < 3)
                    {
                        fromDate = (DateTime.Now.Year - 1).ToString() + "-03-01";
                    }
                    else
                    {
                        fromDate = DateTime.Now.Year.ToString() + "-03-01";
                    }
                }
                #endregion FromDate calculation

                dtProduct = _objDCRBL.GetNonSampleGivenYTD(objCurr.GetCompanyCode(), objCurr.GetUserCode(), fromDate, coll["customerCode"].ToString());
                return Json(objJson.Serialize(dtProduct));
            }
            catch
            {
                throw;
            }            
        }

        public JsonResult GetOurBrandProducts(FormCollection coll)
        {
            try
            {
                DataControl.JSONConverter objJson = new DataControl.JSONConverter();
                DataTable dtProduct = new DataTable();
                string month = string.Empty, year = string.Empty;

                DateTime dtdcrDate = Convert.ToDateTime(coll["dcrDate"]);
                DateTime dtPrevDate = dtdcrDate.AddMonths(-1);

                month = dtPrevDate.Month.ToString();
                year = dtPrevDate.Year.ToString();

                dtProduct = _objDCRBL.GetOurBrandProducts(objCurr.GetCompanyCode(), objCurr.GetUserCode(), year, month, coll["customerCode"].ToString());

                return Json(objJson.Serialize(dtProduct));
            }
            catch
            {
                throw;
            }           
        }

        public JsonResult GetCompetitorBrandProducts(FormCollection coll)
        {
            try
            {
                DataControl.JSONConverter objJson = new DataControl.JSONConverter();
                DataTable dtProduct = new DataTable();
                string month = string.Empty, year = string.Empty;

                DateTime dtdcrDate = Convert.ToDateTime(coll["dcrDate"]);
                DateTime dtPrevDate = dtdcrDate.AddMonths(-1);

                month = dtPrevDate.Month.ToString();
                year = dtPrevDate.Year.ToString();

                dtProduct = _objDCRBL.GetCompetitorBrandProducts(objCurr.GetCompanyCode(), objCurr.GetUserCode(), year, month, coll["customerCode"].ToString());
                return Json(objJson.Serialize(dtProduct));
            }
            catch
            {
                throw;
            }
        }

        public string GetAttendanceDetail(FormCollection coll)
        {
            try
            {
                string result = "";
                result = _objDCRBL.GetAttendanceDetail(objCurr.GetCompanyCode(), objCurr.GetUserCode(), coll["dcrDate"].ToString());
                return result;
            }
            catch
            {
                throw;
            }
        }
        #endregion Public Methods

    }
}
