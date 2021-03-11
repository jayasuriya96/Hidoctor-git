#region Using
using System;
using System.Web;
using System.Linq;
using System.Web.Mvc;
using System.Data;
using System.Data.SqlClient;
using System.Collections.Generic;
using DataControl;
#endregion Using

namespace HiDoctor_Master.Controllers
{
    public enum DCRStatus { Unapproved = 0, Applied = 1, Approved = 2, Draft = 3 }

    //[AjaxSessionActionFilter]
    public class MasterController : Controller
    {

        #region Private variables
        DataControl.Data _objData = new DataControl.Data();
        DataControl.CurrentInfo objCurrentInfo = new DataControl.CurrentInfo();
        #endregion Private variables

        #region Private methods
        private void AddParamToSqlCommand(SqlCommand cmd, string paramName, ParameterDirection paramDirection, SqlDbType dbType, int size, object paramValue)
        {
            try
            {
                SqlParameter parameter = new SqlParameter();
                parameter.ParameterName = paramName;
                parameter.Direction = paramDirection;
                parameter.SqlDbType = dbType;
                parameter.Value = paramValue;
                parameter.Size = size;
                cmd.Parameters.Add(parameter);
            }
            catch (Exception ex)
            {
                throw ex;
                // bool blError = insertLogTable(HttpContext.Current.Session["Comp_Code"].ToString(), HttpContext.Current.Session["Depot_Code"].ToString(), "QueryBuilder", "AddParamToSqlCommand()", "", ex, "Application");
            }
        }
        #endregion Private methods

        #region PublicMethods

        public JsonResult GetPrivileges()
        {
            try
            {
                DataControl.CurrentInfo objCurr = new DataControl.CurrentInfo();
                string companyCode = objCurr.GetCompanyCode();
                string userTypeCode = objCurr.GetUserTypeCode();
                string userCode = objCurr.GetUserCode();

                DataSet ds = new DataSet();

                string cmdText = "SP_hdGetPrivilegeMapping";
                SqlCommand cmd = new SqlCommand(cmdText);
                cmd.CommandType = CommandType.StoredProcedure;

                // Added the parameter to SqlCommand.
                AddParamToSqlCommand(cmd, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(cmd, "@userTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userTypeCode);
                AddParamToSqlCommand(cmd, "@userCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(cmd, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 30, "");

                _objData.OpenConnection(companyCode);
                ds = _objData.ExecuteDataSet(cmd);


                List<Models.MasterModel> lst = new List<Models.MasterModel>();
                if (ds.Tables[0].Rows.Count > 0)
                {
                    DataTable dt = new DataTable();
                    dt = ds.Tables[0];

                    lst = (from item in dt.AsEnumerable()
                           select new Models.MasterModel()
                           {
                               PrivilegeName = item["Privilege_Name"].ToString(),
                               PrivilegeValue = item["Privilege_Value_Name"].ToString(),
                               UsertypeCode = item["User_Type_Code"].ToString()
                           }).ToList<Models.MasterModel>();
                }

                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public JsonResult GetChildRegions(FormCollection collection)
        {
            try
            {
                DataSet ds = new DataSet();
                _objData.OpenConnection(objCurrentInfo.GetCompanyCode());
                {
                    ds = _objData.ExecuteDataSet("EXEC SP_hdGetChildRegions '" + objCurrentInfo.GetCompanyCode() + "','" + collection["RegionCode"].ToString() + "'");
                }

                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public JsonResult GetChildUsers(FormCollection collection)
        {
            try
            {
                DataSet ds = new DataSet();

                _objData.OpenConnection(objCurrentInfo.GetCompanyCode());
                {
                    ds = _objData.ExecuteDataSet("EXEC SP_hdGetChildUsers '" + objCurrentInfo.GetCompanyCode() + "','" + collection["UserCode"].ToString() + "'");
                }
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public JsonResult GetRegionMasterTreeDetails()
        {
            try
            {
                _objData.OpenConnection(objCurrentInfo.GetCompanyCode());
                DataSet ds = _objData.ExecuteDataSet("exec SP_hdGetRegionTreeDetails '" + objCurrentInfo.GetCompanyCode() + "', '" + objCurrentInfo.GetRegionCode() + "'");


                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }

        }

        public JsonResult GetUserMasterTreeDetails(FormCollection collection)
        {

            try
            {
                DataSet ds = new DataSet();
                _objData.OpenConnection(objCurrentInfo.GetCompanyCode());
                {
                    ds = _objData.ExecuteDataSet("EXEC SP_hdGetUserTreeDetails '" + objCurrentInfo.GetCompanyCode() + "','" + objCurrentInfo.GetUserCode() + "'");
                }
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public JsonResult GetRegionMasterFullTreeDetails()
        {
            try
            {
                _objData.OpenConnection(objCurrentInfo.GetCompanyCode());
                DataSet ds = _objData.ExecuteDataSet("exec SP_hdGetRegionFullTreeDetails '" + objCurrentInfo.GetCompanyCode() + "'");
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);

            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public JsonResult GetUserMasterFullTreeDetails(FormCollection collection)
        {

            try
            {
                DataSet ds = new DataSet();
                _objData.OpenConnection(objCurrentInfo.GetCompanyCode());
                {
                    ds = _objData.ExecuteDataSet("EXEC SP_hdGetUserFullTreeDetails '" + objCurrentInfo.GetCompanyCode() + "'");
                }
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        #endregion PublicMethods
    }


}