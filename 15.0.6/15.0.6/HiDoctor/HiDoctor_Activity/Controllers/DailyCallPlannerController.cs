#region Using
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using DataControl;
#endregion Using

namespace HiDoctor_Activity.Controllers
{
    [AjaxSessionActionFilter]
    public class DailyCallPlannerController : Controller
    {

        #region Index
        //
        // GET: /DailyCallPlanner/

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
        DataControl.CurrentInfo objCurr = new DataControl.CurrentInfo();
        DataControl.Data objData = new DataControl.Data();
        #endregion Private Variables

        #region Public Methods

        public JsonResult GetDailyCallPlanner(FormCollection coll)
        {
            try
            {
                DataControl.JSONConverter objJson = new DataControl.JSONConverter();
                DataSet dsDailyPlan = new DataSet();

                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    dsDailyPlan = objData.ExecuteDataSet("exec SP_hdGetDailyPlanHeader '" + objCurr.GetCompanyCode() + "','" + objCurr.GetUserCode() + "','" + coll["dcrDate"].ToString() + "'");
                }


                return Json(objJson.Serialize(dsDailyPlan));
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objData.CloseConnection();
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

                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    dsDailyPlanDoctor = objData.ExecuteDataSet("exec SP_hdGetDailyPlanDoctorYTD '" + objCurr.GetCompanyCode() + "','" + objCurr.GetUserCode() + "','" + objCurr.GetRegionCode() + "','" + month + "','" + year + "','" + fromDate + "','" + coll["dcrDate"].ToString() + "'");
                }

                return Json(objJson.Serialize(dsDailyPlanDoctor));
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objData.CloseConnection();
            }
        }

        public JsonResult GetDoctorProductMappingDetail(FormCollection coll)
        {
            try
            {
                DataControl.JSONConverter objJson = new DataControl.JSONConverter();
                DataSet dsDoctorProduct = new DataSet();

                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    dsDoctorProduct = objData.ExecuteDataSet("exec SP_hdGetDoctorProductMappimgDetail '" + objCurr.GetCompanyCode() + "','" + coll["customerCode"].ToString() + "','" + objCurr.GetRegionCode() + "'");
                }


                return Json(objJson.Serialize(dsDoctorProduct));
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objData.CloseConnection();
            }
        }

        public JsonResult GetProductGivenInLastMonth(FormCollection coll)
        {
            try
            {
                DataControl.JSONConverter objJson = new DataControl.JSONConverter();
                DataSet dsProduct = new DataSet();
                string month = string.Empty, year = string.Empty;

                DateTime dtdcrDate = Convert.ToDateTime(coll["dcrDate"]);
                DateTime dtPrevDate = dtdcrDate.AddMonths(-1);

                month = dtPrevDate.Month.ToString();
                year = dtPrevDate.Year.ToString();

                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    dsProduct = objData.ExecuteDataSet("exec SP_hdGetProductGivenInLastMonth '" + objCurr.GetCompanyCode() + "','" + objCurr.GetUserCode() + "','" + year + "','" + month + "','" + coll["type"].ToString() + "','" + coll["customerCode"].ToString() + "'");
                }

                return Json(objJson.Serialize(dsProduct));
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objData.CloseConnection();
            }
        }

        public JsonResult GetNonSampleGivenYTD(FormCollection coll)
        {
            try
            {
                DataControl.JSONConverter objJson = new DataControl.JSONConverter();
                DataSet dsProduct = new DataSet();
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

                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    dsProduct = objData.ExecuteDataSet("exec SP_hdGetGiftsGivenYTD '" + objCurr.GetCompanyCode() + "','" + objCurr.GetUserCode() + "','" + fromDate + "','" + coll["customerCode"].ToString() + "'");
                }

                return Json(objJson.Serialize(dsProduct));
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objData.CloseConnection();
            }
        }

        public JsonResult GetOurBrandProducts(FormCollection coll)
        {
            try
            {
                DataControl.JSONConverter objJson = new DataControl.JSONConverter();
                DataSet dsProduct = new DataSet();
                string month = string.Empty, year = string.Empty;

                DateTime dtdcrDate = Convert.ToDateTime(coll["dcrDate"]);
                DateTime dtPrevDate = dtdcrDate.AddMonths(-1);

                month = dtPrevDate.Month.ToString();
                year = dtPrevDate.Year.ToString();

                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    dsProduct = objData.ExecuteDataSet("exec SP_hdGetOurBrandProducts '" + objCurr.GetCompanyCode() + "','" + objCurr.GetUserCode() + "','" + year + "','" + month + "','" + coll["customerCode"].ToString() + "'");
                }

                return Json(objJson.Serialize(dsProduct));
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objData.CloseConnection();
            }
        }

        public JsonResult GetCompetitorBrandProducts(FormCollection coll)
        {
            try
            {
                DataControl.JSONConverter objJson = new DataControl.JSONConverter();
                DataSet dsProduct = new DataSet();
                string month = string.Empty, year = string.Empty;

                DateTime dtdcrDate = Convert.ToDateTime(coll["dcrDate"]);
                DateTime dtPrevDate = dtdcrDate.AddMonths(-1);

                month = dtPrevDate.Month.ToString();
                year = dtPrevDate.Year.ToString();

                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    dsProduct = objData.ExecuteDataSet("exec SP_hdGetCompetitorBrandProducts '" + objCurr.GetCompanyCode() + "','" + objCurr.GetUserCode() + "','" + year + "','" + month + "','" + coll["customerCode"].ToString() + "'");
                }
                return Json(objJson.Serialize(dsProduct));
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objData.CloseConnection();
            }
        }

        public JsonResult GetAttendanceDetail(FormCollection coll)
        {
            try
            {
                DataControl.JSONConverter objJson = new DataControl.JSONConverter();
                DataSet dsProduct = new DataSet();

                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    dsProduct = objData.ExecuteDataSet("exec SP_hdGetTPAttendanceDetails '" + objCurr.GetCompanyCode() + "','" + objCurr.GetUserCode() + "','" + coll["dcrDate"].ToString() + "'");
                }


                return Json(objJson.Serialize(dsProduct));
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objData.CloseConnection();
            }
        }
        #endregion Public Methods
    }
}
