using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using ElmahWrapper;
using DataControl;

namespace HiDoctor_Activity.Controllers
{
    [AjaxSessionActionFilter]
    public class TargetController : Controller
    {
        //
        // GET: /Target/
        #region Private Variables
        private DataControl.CurrentInfo _objCurr = new DataControl.CurrentInfo();
        private DataControl.SPData _objSP = new DataControl.SPData();
        private DataControl.Data _objData = new DataControl.Data();
        private DataControl.JSONConverter _objJson = new DataControl.JSONConverter();
        #endregion Private Variables

        public ActionResult Index(string id)
        {
            if (!string.IsNullOrEmpty(id))
            {
                ViewBag.TargetCode = id;
            }

            ViewBag.regionCode = _objCurr.GetRegionCode();
            return View();
        }

        //
        // GET: /Target/Details/5

        public ActionResult Details(int id)
        {
            return View();
        }

        //
        // GET: /Target/Create

        public ActionResult Create()
        {
            ViewBag.regionCode = _objCurr.GetRegionCode();
            return View();
        }

        //
        // POST: /Target/Create

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
        // GET: /Target/Edit/5

        public ActionResult Edit(int id)
        {
            return View();
        }

        //
        // POST: /Target/Edit/5

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
        // GET: /Target/Delete/5

        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /Target/Delete/5

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
        public string InsertTargetHeader(FormCollection collection)
        {
            string fromDate = "", toDate = "";
            if (!string.IsNullOrEmpty(collection["From"].ToString()))
            {
                fromDate = Convert.ToDateTime(collection["From"].ToString()).ToString("yyyy-MM-dd");
            }
            if (!string.IsNullOrEmpty(collection["To"].ToString()))
            {
                toDate = Convert.ToDateTime(collection["To"].ToString()).ToString("yyyy-MM-dd");
            }

            string result = _objSP.InsertTargetHeader("SP_hdInsertTargetHeader", collection["TargetName"].ToString(), collection["RegionCode"].ToString(),
                    fromDate, toDate, collection["Mode"].ToString(), collection["TargetCode"].ToString());

            return result;
        }
        public JsonResult GetTargetHeader(FormCollection collection)
        {
            try
            {
                DataSet ds = new DataSet();
                _objData.OpenConnection(_objCurr.GetCompanyCode());
                {
                    ds = _objData.ExecuteDataSet("exec SP_hdGetTargetHeader '" + _objCurr.GetCompanyCode() + "','" + collection["RegionCode"].ToString() + "'");
                }
             


                return Json(_objJson.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public JsonResult GetTargetByRegion(FormCollection collection)
        {
            try
            {
                DataSet ds = new DataSet();
                _objData.OpenConnection(_objCurr.GetCompanyCode());
                {
                    ds = _objData.ExecuteDataSet("exec SP_hdGetTargetByRegion '" + _objCurr.GetCompanyCode() + "','" + collection["RegionCode"].ToString() + "','" + _objCurr.GetRegionCode() + "'");
                }
                return Json(_objJson.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
          
        }
        public JsonResult GetTargetProductDetails(FormCollection collection)
        {
            try
            {
                DataSet ds = new DataSet();
                _objData.OpenConnection(_objCurr.GetCompanyCode());
                {
                    ds = _objData.ExecuteDataSet("exec SP_hdGetTargetProductDetails '" + _objCurr.GetCompanyCode() + "','" + collection["RegionCode"].ToString() + "','" + collection["TargetCode"].ToString() + "','" + _objCurr.GetRegionCode() + "'");
                }
                return Json(_objJson.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();

            }
      

           
        }
        public JsonResult GetTargetDetails(FormCollection collection)
        {
            try
            {
                DataSet ds = new DataSet();
                _objData.OpenConnection(_objCurr.GetCompanyCode());
                {
                    ds = _objData.ExecuteDataSet("exec SP_hdGetTargetDetail '" + _objCurr.GetCompanyCode() + "','" + collection["RegionCode"].ToString() + "','" + collection["TargetCode"].ToString() + "','" + _objCurr.GetRegionCode() + "'");
                }

                return Json(_objJson.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();

            }
        }
        //public string InsertTarget(FormCollection collection)
        //{
        //    string result = _objSP.InsertTarget("SP_hdInsertTarget", collection["TargetCode"].ToString(), collection["RegionCode"].ToString(),
        //            collection["TargetDetails"].ToString(), collection["MonthCount"].ToString(), collection["Mode"].ToString(), _objCurr.GetUserCode());
        //    return result;
        //}
        public string InsertTargetDetails(FormCollection collection)
        {
            try
            {
                string productId = "", selfId = "", monthId = "", monthValue = "", productCode = "", value = "", unit = "", amount = "", targetMonth = "", qry = "", detailId = "", detailCode = "", mode = "", history = "";
                string regionCode = collection["RegionCode"].ToString();
                string targetCode = collection["TargetCode"].ToString();

                int productCount = int.Parse(collection["NoOfProduct"].ToString());
                int monthCount = int.Parse(collection["MonthCount"].ToString());

                for (int i = 0; i < productCount; i++)
                {
                    if (collection["pdc_" + i] == null)
                    {
                        continue;
                    }

                    //Get the product code from collection
                    productId = "pdc_" + i;
                    productCode = collection[productId].ToString();

                    for (int j = 0; j < monthCount; j++)
                    {
                        //Generating Id
                        monthId = "mnt_" + i + "_" + j;
                        selfId = "self_" + i + "_" + j;
                        detailId = "detailCode_" + i + "_" + j;

                        //Get the value from collection
                        monthValue = collection[monthId].ToString();
                        value = collection[selfId].ToString();
                        detailCode = collection[detailId].ToString();
                        history = collection["history_" + i + "_" + j].ToString();

                        targetMonth = monthValue + "-01";

                        unit = value.Split('_')[0].ToString();
                        amount = value.Split('_')[1].ToString();

                        if (unit != "0" || amount != "0")
                        {
                            if (detailCode == "0") { mode = "I"; } else { mode = "U"; }

                            qry += "EXEC SP_hdInsertTargetDetails '" + _objCurr.GetCompanyCode() + "','" + targetCode + "','" + regionCode + "',";
                            qry += "'" + unit + "','" + amount + "','" + targetMonth + "','" + productCode + "','" + mode + "','" + _objCurr.GetUserCode() + "','" + detailCode + "','" + history + "';";
                        }

                    }
                }
                DataSet ds = new DataSet();
                _objData.OpenConnection(_objCurr.GetCompanyCode());
                {
                    if (qry != "")
                    {
                        ds = _objData.ExecuteDataSet(qry);
                    }
                }
             

                return "SUCCESS";
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "InsertTargetDetails()");
                return "FAIL:" + ex.Message.ToString();
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public string FreezeTarget(FormCollection collection)
        {
            try
            {
                string qry = "EXEC SP_hdFreezeTarget '" + _objCurr.GetCompanyCode() + "','" + collection["TargetCode"].ToString() + "','" + collection["RegionCode"].ToString() + "','" + collection["TargetMonth"].ToString() + "'";
                _objData.OpenConnection(_objCurr.GetCompanyCode());
                {
                    _objData.ExecuteNonQuery(qry);
                }

                return "";
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "FreezeTarget()");
                return ex.Message.ToString();
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public string UnFreezeTarget(FormCollection collection)
        {
            try
            {
                string qry = "EXEC SP_hdUnFreezeTarget '" + _objCurr.GetCompanyCode() + "','" + collection["TargetCode"].ToString() + "','" + collection["RegionCode"].ToString() + "','" + collection["TargetMonth"].ToString() + "'";
                _objData.OpenConnection(_objCurr.GetCompanyCode());
                {
                    _objData.ExecuteNonQuery(qry);
                }
             
                return "";
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "UnFreezeTarget()");
                return ex.Message.ToString();
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public string DeleteTargetDetails(FormCollection collection)
        {
            try
            {
                string qry = "EXEC SP_hdDeleteTargetDetail '" + _objCurr.GetCompanyCode() + "','" + collection["RegionCode"].ToString() + "','" + collection["TargetCode"].ToString() + "','" + collection["ProductCode"].ToString() + "'";
                _objData.OpenConnection(_objCurr.GetCompanyCode());
                {
                    _objData.ExecuteNonQuery(qry);
                }
             
                return "";
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "DeleteTargetDetails()");
                return ex.Message.ToString();
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
    }
}
