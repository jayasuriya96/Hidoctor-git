using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using DataControl;

namespace HiDoctor_Activity.Controllers
{
    [AjaxSessionActionFilter]
    public class MigrationController : Controller
    {
        //
        // GET: /Migration/

        private DataControl.SPData _objSPData = new DataControl.SPData();
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
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

        public bool InsertRegionTypeTree(FormCollection collection)
        {
            try
            {
                bool result = true;
                string query = "", parentregionTypeCode = "";
                int level = 0;
                DataSet dsRegionType = new DataSet();
                DataRow[] drFilter;

                string companyCode = _objcurrentInfo.GetCompanyCode();
                dsRegionType = _objSPData.GetRegionTypeMaster(companyCode);
                if (dsRegionType.Tables[0].Rows.Count > 0)
                {
                    foreach (DataRow dr in dsRegionType.Tables[0].Rows)
                    {
                        if (dr["Region_Type_Code"].ToString() == dr["Under_Region_Type"].ToString())
                        {
                            level++;
                            parentregionTypeCode = dr["Region_Type_Code"].ToString();

                        }
                        else
                        {

                            drFilter = dsRegionType.Tables[0].Select("Under_Region_Type='" + parentregionTypeCode + "' AND Region_Type_Code <> '" + parentregionTypeCode + "'");
                            if (drFilter.Length > 0)
                            {
                                parentregionTypeCode = drFilter[0]["Region_Type_Code"].ToString();
                                level++;
                            }

                        }
                        query += "UPDATE tbl_SFA_Region_Type_Master  SET Region_Type_Level ='L" + level + "' ,Region_Type_Order =" + level + " WHERE Region_Type_Code='" + dr["Region_Type_Code"].ToString() + "' AND Region_Type_ID='" + dr["Region_Type_ID"].ToString() + "';";

                    }

                    if (!string.IsNullOrEmpty(query))
                    {
                        query = query.TrimEnd(';');

                    }
                    int results = _objSPData.ExecuteStoredProcedure("ExecQuery", query, companyCode);
                    if (results == 1)
                    {
                        result = true;
                    }
                    else
                    {
                        result = false;
                    }
                    return result;
                }


                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        public bool InsertRegionMasterTree(FormCollection collection)
        {
            try
            {
                bool result = true;
                string query = "", order = "", regionTypeId = "";
                int level = 0, nodeLevel = 0;

                DataSet dsRegionMaster = new DataSet();
                DataSet dsParentRegion = new DataSet();
                DataRow[] drFilter;

                string companyCode = _objcurrentInfo.GetCompanyCode();
                dsRegionMaster = _objSPData.GetRegionMaster(companyCode);

                if (dsRegionMaster.Tables[0].Rows.Count > 0)
                {
                    query = "UPDATE tbl_SFA_Region_Master SET L1=Null,L2=null,L3=null,L4=null,L5=null,L6=null,L7=null ,L8=null,L9=null,L10=null,L11=null,L12=null,L13=null,L14=null,L15=null,L17=null,L18=null,L20=null,L21=null,L22=null,L23=null,L24=null,L25=null,L26=null,L27=null,L28=null,L29=null,L30=null,";
                    query += "Region_Type_Id=null;";
                    foreach (DataRow dr in dsRegionMaster.Tables[0].Rows)
                    {

                        dsParentRegion = _objSPData.GetParentRegionDataSet(companyCode, dr["Region_Code"].ToString());
                        level = 0;
                        nodeLevel = 0;
                        order = "";
                        if (dsParentRegion.Tables[0].Rows.Count == 0)
                        {
                            level++;
                            order = dr["Region_Type_Level"].ToString() + "=" + dr["Region_ID"].ToString() + ",";
                            nodeLevel++;
                        }

                        if (dsParentRegion.Tables[0].Rows.Count > 0)
                        {
                            foreach (DataRow drs in dsParentRegion.Tables[0].Rows)
                            {
                                order += drs["Region_Type_Level"].ToString() + "=" + drs["Region_ID"].ToString() + ",";
                                nodeLevel++;
                            }

                            if (dr["Region_Code"].ToString() != dr["Under_Region_Code"].ToString())
                            {

                                order += dr["Region_Type_Level"].ToString() + " =" + dr["Region_ID"].ToString() + ",";
                                nodeLevel++;
                            }
                        }


                        if (!string.IsNullOrEmpty(order))
                        {
                            drFilter = dsRegionMaster.Tables[1].Select("Region_Type_Code='" + dr["Region_Type_Code"].ToString() + "'");
                            if (drFilter.Length > 0)
                            {
                                regionTypeId = drFilter[0]["Region_Type_ID"].ToString();
                            }
                            else
                            {
                                regionTypeId = "''";
                            }


                            order = order.TrimEnd(',');
                            query += "UPDATE tbl_SFA_Region_Master  SET Region_Type_ID ='" + regionTypeId + "' ," + order + ",Node_Level=" + nodeLevel + "  WHERE Region_Code='" + dr["Region_Code"].ToString() + "' AND Region_ID='" + dr["Region_ID"].ToString() + "';";

                        }

                    }
                    if (!string.IsNullOrEmpty(query))
                    {
                        query = query.TrimEnd(';');

                    }
                    int results = _objSPData.ExecuteStoredProcedure("ExecQuery", query, companyCode);
                    if (results == 1)
                    {
                        result = true;
                    }
                    else
                    {
                        result = false;
                    }
                    return result;
                }


                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
    }
}
