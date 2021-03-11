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
    public class ActivitySummaryController : Controller
    {
        #region Get
        //
        // GET: /ActivitySummary/

        public ActionResult Index(string dcrDate)
        {
            ViewBag.dcrDate = dcrDate;
            ViewBag.today = DateTime.Now.Date.ToString("dd/MM/yyyy");
            return View();
        }
        #endregion Get

        #region Private Variables
       DataControl.CurrentInfo objCurr = new DataControl.CurrentInfo();
       DataControl.Data objData = new DataControl.Data();
        #endregion Private Variables

        #region Public Methods
        public JsonResult GetActicitySummary(FormCollection coll)
        {
            try
            {

                DataControl.JSONConverter objJson = new DataControl.JSONConverter();
                DataSet dsActivity = new DataSet();

                string toDate = DateTime.Now.ToShortDateString();
                string fromDate = string.Empty;
                //fromDate = toDate.Split('-')[0] + "-" + toDate.Split('-')[1] + "-01";
                fromDate = DateTime.Now.Month + "/01/" + DateTime.Now.Year;

                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    dsActivity = objData.ExecuteDataSet("exec SP_hdGetActivitySummaryIR '" + objCurr.GetCompanyCode() + "','" + objCurr.GetUserCode() + "','" + fromDate + "','" + toDate + "'");
                }


                return Json(objJson.Serialize(dsActivity));
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

        public JsonResult GetActicitySummaryMissedDoctor(FormCollection coll)
        {
            try
            {
                DataControl.JSONConverter objJson = new DataControl.JSONConverter();
                DataSet dsActivity = new DataSet();
                DataTable dsMissed = new DataTable();

                string toDate = coll["dcrDate"].ToString();
                string fromDate = string.Empty;
                fromDate = toDate.Split('-')[0] + "-" + toDate.Split('-')[1] + "-01";
                //fromDate = "2012-08-01";

                objData.OpenConnection(objCurr.GetCompanyCode());
                {
                    dsActivity = objData.ExecuteDataSet("exec SP_hdGetActivitySummaryMissedDoctorsIR '" + objCurr.GetCompanyCode() + "','" + objCurr.GetUserCode() + "','" + fromDate + "','" + DateTime.Now.ToString("yyyy-MM-dd") + "'");
                }


                if (dsActivity.Tables.Count > 0)
                {
                    dsMissed = dsActivity.Tables[1].Clone();
                    if (dsActivity.Tables[2].Rows.Count > 0)
                    {

                        DataRow[] drVisit, drCP;
                        for (int i = 0; i < dsActivity.Tables[2].Rows.Count; i++)
                        {
                            drVisit = dsActivity.Tables[0].Select("Doctor_Code='" + dsActivity.Tables[2].Rows[i]["Doctor_Code"] + "'");
                            drCP = dsActivity.Tables[1].Select("Doctor_Code='" + dsActivity.Tables[2].Rows[i]["Doctor_Code"] + "'");
                            //dsMissed.Rows.Add(drCP[0].ItemArray);
                            if (drVisit.Length < drCP.Length)
                            {
                                dsMissed.Rows.Add(drCP[0].ItemArray);
                            }
                        }
                    }
                }

                return Json(objJson.Serialize(dsMissed));
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
