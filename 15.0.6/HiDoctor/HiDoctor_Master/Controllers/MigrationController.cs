using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.IO;
using System.Xml;
using ElmahWrapper;
using DataControl;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class MigrationController : Controller
    {
        //
        // GET: /Migration/

        DataControl.SPData _objSPData = new DataControl.SPData();
        DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        public ActionResult Index()
        {
            return View();
        }

        //
        // GET: /Migration/Details/5

        public ActionResult Details(int id)
        {
            return View();
        }

        //
        // GET: /Migration/Create

        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /Migration/Create

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
        // GET: /Migration/Edit/5

        public ActionResult Edit(int id)
        {
            return View();
        }

        //
        // POST: /Migration/Edit/5

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
        // GET: /Migration/Delete/5

        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /Migration/Delete/5

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


        public ActionResult Migration()
        {
            return View();
        }

        /// <summary>
        /// 1.Add new column(Region_Order) in region master
        /// 2.Update region order usinf all region xml.
        /// 3.rename tbl_SFA_Region_Master table as tbl_SFA_Region_Master_Old
        /// 4.rename tbl_SFA_Region_Master_New as tbl_SFA_Region_Master
        /// </summary> 
        /// <returns>SUCCESS OR FAILURE</returns>
        public string UpdateRegion(FormCollection collection)
        {
            string spResult = "";
            bool result = false;
            try
            {
                DataSet ds = new DataSet();
                //ds.ReadXml("C:\\Users\\rajeshwari@swaas.local\\Desktop\\ALL_Region.xml");
                //ds.ReadXml("http:\\\\" + collection["Domain"].ToString() + "\\XMLFile\\" + _objcurrentInfo.GetCompanyCode() + "\\ALL_Region.xml");
                //"http://" + Session["Return_URL"].ToString().Split('/')[2].ToString() + "/XMLFile/" + objCurInfo.GetCompanyCode() + "/Logo_Client.jpg";
                string path = Server.MapPath("/XMLFiles/" + _objcurrentInfo.GetCompanyCode() + "/ALL_Region.xml");
                ds.ReadXml(path);
                string strQry = "";
                int count = ds.Tables[0].Rows.Count;
                strQry += "IF NOT EXISTS(SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='tbl_SFA_Region_Master' AND COLUMN_NAME='Region_Order') ALTER TABLE tbl_SFA_Region_Master ADD Region_Order INT ;";
                int results = _objSPData.ExecuteStoredProcedure("ExecQuery", strQry, _objcurrentInfo.GetCompanyCode());
                if (results == 1)
                {
                    result = true;
                }
                else
                {
                    result = false;
                }
                if (result)
                {
                    strQry = "";
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                        {
                            strQry += "Update tbl_SFA_region_Master set Region_Order=" + ds.Tables[0].Rows[i][0].ToString() + " where Region_Code='" + ds.Tables[0].Rows[i][2].ToString().Split('_')[0].ToString() + "' and Company_Code='" + _objcurrentInfo.GetCompanyCode() + "';";
                        }
                        strQry += "Update tbl_SFA_region_Master set Region_Order=" + ds.Tables[0].Rows[count - 1][0].ToString() + " where Region_Order is NULL and Company_Code='" + _objcurrentInfo.GetCompanyCode() + "';";
                    }
                    DataControl.Data _objData = new DataControl.Data();

                    if (!string.IsNullOrEmpty(strQry))
                    {
                        strQry = strQry.TrimEnd(';');

                    }
                    results = _objSPData.ExecuteStoredProcedure("ExecQuery", strQry, _objcurrentInfo.GetCompanyCode());
                    if (results == 1)
                    {
                        result = true;
                    }
                    else
                    {
                        result = false;
                    }
                    if (result)
                    {
                        // DataControl.SPData objData = new DataControl.SPData();
                        spResult = _objSPData.RegionMigration(_objcurrentInfo.GetCompanyCode());
                    }
                    if (spResult.Split(':')[0].ToString().ToUpper() == "SUCCESS")
                    {
                        strQry = "SP_RENAME 'tbl_SFA_Region_Master','tbl_SFA_Region_Master_Old'";
                        results = _objSPData.ExecuteStoredProcedure("ExecQuery", strQry, _objcurrentInfo.GetCompanyCode());

                        strQry = "SP_RENAME 'tbl_SFA_Region_Master_New','tbl_SFA_Region_Master'";
                        results = _objSPData.ExecuteStoredProcedure("ExecQuery", strQry, _objcurrentInfo.GetCompanyCode());
                    }
                }
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "UpdateRegion()");
                string exec = ex.Message;
            }
            return spResult;
        }
        /// <summary>
        /// 1.Add new column(User_Order) in user master
        /// 2.Update user order usinf all user xml.
        /// 3.rename tbl_SFA_User_Master table as tbl_SFA_User_Master_Old
        /// 4.rename tbl_SFA_User_Master_New as tbl_SFA_User_Master
        /// </summary> 
        /// <returns>SUCCESS OR FAILURE</returns>
        public string UpdateUser(FormCollection collection)
        {
            string spResult = "";
            try
            {
                bool result = false;
                DataSet ds = new DataSet();
                //ds.ReadXml("C:\\Users\\rajeshwari@swaas.local\\Desktop\\ALL_User.xml");
                string path = Server.MapPath("/XMLFiles/" + _objcurrentInfo.GetCompanyCode() + "/ALL_User.xml");
                ds.ReadXml(path);
                string strQry = "";
                int count = ds.Tables[0].Rows.Count;
                strQry += "IF NOT EXISTS(SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='tbl_SFA_User_Master' AND COLUMN_NAME='User_Order') ALTER TABLE tbl_SFA_User_Master ADD User_Order INT ;";
                int results = _objSPData.ExecuteStoredProcedure("ExecQuery", strQry, _objcurrentInfo.GetCompanyCode());
                if (results == 1)
                {
                    result = true;
                }
                else
                {
                    result = false;
                }
                if (result)
                {
                    strQry = "";
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                        {
                            strQry += "Update tbl_SFA_User_Master set User_Order=" + ds.Tables[0].Rows[i][0].ToString() + " where User_Code='" + ds.Tables[0].Rows[i][2].ToString().Split('_')[0].ToString() + "' and Company_Code='" + _objcurrentInfo.GetCompanyCode() + "';";
                        }
                        strQry += "Update tbl_SFA_User_Master set User_Order=" + ds.Tables[0].Rows[count - 1][0].ToString() + " where User_Order is NULL and Company_Code='" + _objcurrentInfo.GetCompanyCode() + "';";
                    }
                    DataControl.Data _objData = new DataControl.Data();

                    if (!string.IsNullOrEmpty(strQry))
                    {
                        strQry = strQry.TrimEnd(';');

                    }
                    results = _objSPData.ExecuteStoredProcedure("ExecQuery", strQry, _objcurrentInfo.GetCompanyCode());
                    if (results == 1)
                    {
                        result = true;
                    }
                    else
                    {
                        result = false;
                    }
                    if (result)
                    {
                        DataControl.SPData objData = new DataControl.SPData();
                        spResult = objData.UserMigration(_objcurrentInfo.GetCompanyCode());
                    }
                    if (spResult.Split(':')[0].ToString().ToUpper() == "SUCCESS")
                    {
                        strQry = "SP_RENAME 'tbl_SFA_User_Master','tbl_SFA_User_Master_Old'";
                        results = _objSPData.ExecuteStoredProcedure("ExecQuery", strQry, _objcurrentInfo.GetCompanyCode());

                        strQry = "SP_RENAME 'tbl_SFA_User_Master_New','tbl_SFA_User_Master'";
                        results = _objSPData.ExecuteStoredProcedure("ExecQuery", strQry, _objcurrentInfo.GetCompanyCode());
                    }
                }
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "UpdateUser()");
                string exec = ex.Message;
            }
            return spResult;
        }
    }
}
