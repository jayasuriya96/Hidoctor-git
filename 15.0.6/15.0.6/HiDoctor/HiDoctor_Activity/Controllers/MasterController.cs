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

namespace HiDoctor_Activity.Controllers
{
    public enum DCRStatus { Unapproved = 0, Applied = 1, Approved = 2, Draft = 3, WA =4 }
    [AjaxSessionActionFilter]
    public class MasterController : Controller
    {
        #region Private variables
        DataControl.Data objData = new DataControl.Data();
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

        public string GetFlagFullName(string f)
        {
            string flagName = "";
            switch (f)
            {
                case "F":
                    flagName = "Field";
                    break;
                case "A":
                    flagName = "Attendance";
                    break;
                case "L":
                    flagName = "Leave";
                    break;
                case "WA":
                    flagName = "WA";
                    break;
            }
            return flagName;
        }

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

                try
                {
                    objData.OpenConnection(companyCode);
                    ds = objData.ExecuteDataSet(cmd);
                }
                finally
                {
                    objData.CloseConnection();
                }
              

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
        }

        public JsonResult GetChildRegionsJSON(string regionCode)
        {
            try
            {
                DataSet ds = new DataSet();

                try
                {
                    objData.OpenConnection(objCurrentInfo.GetCompanyCode());
                    {
                        ds = objData.ExecuteDataSet("exec SP_hdChildRegionCodes '" + objCurrentInfo.GetCompanyCode() + "','" + regionCode + "'");
                    }
                }
                finally
                {
                    objData.CloseConnection();
                }
              

                List<Models.MasterModel> lstRegion = new List<Models.MasterModel>();
                if (ds.Tables[0].Rows.Count > 0)
                {
                    DataTable dt = new DataTable();
                    dt = ds.Tables[0];

                    lstRegion = (from item in dt.AsEnumerable()
                                 select new Models.MasterModel()
                                 {
                                     RegionCode = item["Region_Code"].ToString(),
                                     RegionName = item["Region_Name"].ToString(),
                                     RegionTypeCode = item["Region_Type_Code"].ToString(),
                                     RegionTypeName = item["Region_Type_Name"].ToString()
                                 }).ToList<Models.MasterModel>();
                }

                return Json(lstRegion, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public DataSet GetChildRegionsDataSet(string regionCode)
        {
            try
            {
                DataSet ds = new DataSet();

                objData.OpenConnection(objCurrentInfo.GetCompanyCode());
                {
                    ds = objData.ExecuteDataSet("exec SP_hdChildRegionCodes '" + objCurrentInfo.GetCompanyCode() + "','" + regionCode + "'");
                }             

                return ds;
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

        public JsonResult GetChildUsersJSON(string companyCode, string userCode)
        {
            try
            {
                DataSet ds = new DataSet();

                string cmdText = "SP_hdGetChildUsers";
                SqlCommand cmd = new SqlCommand(cmdText);
                cmd.CommandType = CommandType.StoredProcedure;

                // Added the parameter to SqlCommand.
                AddParamToSqlCommand(cmd, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(cmd, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);

                objData.OpenConnection(companyCode);
                ds = objData.ExecuteDataSet(cmd);


                List<Models.MasterModel> lstRegion = new List<Models.MasterModel>();

                if (ds.Tables[0].Rows.Count > 0)
                {
                    DataTable dt = new DataTable();
                    dt = ds.Tables[0];

                    lstRegion = (from item in dt.AsEnumerable()
                                 select new Models.MasterModel()
                                 {
                                     UserCode = item["User_Code"].ToString(),
                                     UserName = item["User_Name"].ToString(),
                                     UsertypeCode = item["User_Type_Code"].ToString(),
                                     UserTypeName = item["User_Type_Name"].ToString()
                                 }).ToList<Models.MasterModel>();
                }
                return Json(lstRegion, JsonRequestBehavior.AllowGet);
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

        public DataSet GetChildUsersDataSet(string companyCode, string userCode)
        {
            try
            {
                DataSet ds = new DataSet();

                string cmdText = "SP_hdGetChildUsers";
                SqlCommand cmd = new SqlCommand(cmdText);
                cmd.CommandType = CommandType.StoredProcedure;

                // Added the parameter to SqlCommand.
                AddParamToSqlCommand(cmd, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(cmd, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);

                objData.OpenConnection(companyCode);
                ds = objData.ExecuteDataSet(cmd);


                return ds;
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

        public JsonResult GetParentRegionsJSON(string regionCode)
        {
            try
            {
                DataSet ds = new DataSet();
                objData.OpenConnection(objCurrentInfo.GetCompanyCode());
                {
                    ds = objData.ExecuteDataSet("exec SP_hdGetParentRegions '" + objCurrentInfo.GetCompanyCode() + "','" + regionCode + "'");
                }


                List<Models.MasterModel> lstRegion = new List<Models.MasterModel>();

                if (ds.Tables[0].Rows.Count > 0)
                {
                    DataTable dt = new DataTable();
                    dt = ds.Tables[0];

                    lstRegion = (from item in dt.AsEnumerable()
                                 select new Models.MasterModel()
                                 {
                                     RegionCode = item["Region_Code"].ToString(),
                                     RegionName = item["Region_Name"].ToString(),
                                     RegionTypeCode = item["Region_Type_Code"].ToString(),
                                     RegionTypeName = item["Region_Type_Name"].ToString()
                                 }).ToList<Models.MasterModel>();
                }
                return Json(lstRegion, JsonRequestBehavior.AllowGet);
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

        public DataSet GetParentRegionsDataSet(string regionCode)
        {
            try
            {
                DataSet ds = new DataSet();

                objData.OpenConnection(objCurrentInfo.GetCompanyCode());
                {
                    ds = objData.ExecuteDataSet("exec SP_hdGetParentRegions '" + objCurrentInfo.GetCompanyCode() + "','" + regionCode + "'");
                }
           
                return ds;
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

        public JsonResult GetParentUsersJSON(string companyCode, string regionCode, string userCode)
        {
            try
            {
                JsonResult objParentUsers = new JsonResult();
                DataSet ds = new DataSet();

                string cmdText = "SP_hdGetRegion_User_Data";
                SqlCommand cmd = new SqlCommand(cmdText);
                cmd.CommandType = CommandType.StoredProcedure;

                // Added the parameter to SqlCommand.
                AddParamToSqlCommand(cmd, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(cmd, "@Entity", ParameterDirection.Input, SqlDbType.VarChar, 30, "U");
                AddParamToSqlCommand(cmd, "@Hierarchy", ParameterDirection.Input, SqlDbType.VarChar, 30, "P");
                AddParamToSqlCommand(cmd, "@Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(cmd, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(cmd, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 30, "");

                objData.OpenConnection(companyCode);
                ds = objData.ExecuteDataSet(cmd);
               

                List<Models.MasterModel> lstRegion = new List<Models.MasterModel>();

                if (ds.Tables[0].Rows.Count > 0)
                {
                    DataTable dt = new DataTable();
                    dt = ds.Tables[0];

                    lstRegion = (from item in dt.AsEnumerable()
                                 select new Models.MasterModel()
                                 {
                                     UserCode = item["User_Code"].ToString(),
                                     UserName = item["User_Name"].ToString(),
                                     UsertypeCode = item["User_Type_Code"].ToString(),
                                     UserTypeName = item["User_Type_Name"].ToString(),
                                 }).ToList<Models.MasterModel>();
                }
                return Json(lstRegion, JsonRequestBehavior.AllowGet);
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

        public DataSet GetParentUsersDataSet(string companyCode, string regionCode, string userCode)
        {
            try
            {
                DataSet ds = new DataSet();

                string cmdText = "SP_hdGetRegion_User_Data";
                SqlCommand cmd = new SqlCommand(cmdText);
                cmd.CommandType = CommandType.StoredProcedure;

                // Added the parameter to SqlCommand.
                AddParamToSqlCommand(cmd, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(cmd, "@Entity", ParameterDirection.Input, SqlDbType.VarChar, 30, "U");
                AddParamToSqlCommand(cmd, "@Hierarchy", ParameterDirection.Input, SqlDbType.VarChar, 30, "P");
                AddParamToSqlCommand(cmd, "@Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(cmd, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(cmd, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 30, "");

                objData.OpenConnection(companyCode);
                ds = objData.ExecuteDataSet(cmd);
           

                return ds;
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

        public DataSet GetDistanceMatrix(string companyCode, string userTypeCode, string entity)
        {
            try
            {
                DataSet ds = new DataSet();

                string cmdText = "SP_hdGetDistanceMatrixValues";
                SqlCommand cmd = new SqlCommand(cmdText);
                cmd.CommandType = CommandType.StoredProcedure;

                // Added the parameter to SqlCommand.
                AddParamToSqlCommand(cmd, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(cmd, "@userTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userTypeCode);
                AddParamToSqlCommand(cmd, "@entity", ParameterDirection.Input, SqlDbType.VarChar, 50, entity);
                AddParamToSqlCommand(cmd, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 30, "");

                objData.OpenConnection(companyCode);
                ds = objData.ExecuteDataSet(cmd);
             


                return ds;
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

        public DataSet GetTrvelPlace(string companyCode, string dcrCode, string flag, string userCode, string dcrDate)
        {
            try
            {
                DataSet ds = new DataSet();

                string cmdText = "SP_hdGetTravelPlaces";
                SqlCommand cmd = new SqlCommand(cmdText);
                cmd.CommandType = CommandType.StoredProcedure;

                // Added the parameter to SqlCommand.
                AddParamToSqlCommand(cmd, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(cmd, "@dcrCode", ParameterDirection.Input, SqlDbType.VarChar, 50, dcrCode);               
                AddParamToSqlCommand(cmd, "@flag", ParameterDirection.Input, SqlDbType.VarChar, 1, flag);
                objData.OpenConnection(companyCode);
                ds = objData.ExecuteDataSet(cmd);        

                return ds;
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

        public DataSet GetHolidays(string companyCode, string startDate, string endDate, string parentRegions, string regionCode)
        {
            try
            {
                DataSet ds = new DataSet();

                string cmdText = "SPhd_GetHolidays";
                SqlCommand cmd = new SqlCommand(cmdText);
                cmd.CommandType = CommandType.StoredProcedure;

                // Added the parameter to SqlCommand.
                AddParamToSqlCommand(cmd, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(cmd, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
                AddParamToSqlCommand(cmd, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);
                AddParamToSqlCommand(cmd, "@ParentRegions", ParameterDirection.Input, SqlDbType.VarChar, parentRegions.Length, parentRegions);
                AddParamToSqlCommand(cmd, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);

                objData.OpenConnection(companyCode);
                ds = objData.ExecuteDataSet(cmd);             

                return ds;
            }
            finally
            {
                objData.CloseConnection();
            }
        }
        public JsonResult GetRegionDetails(string companyCode)
        {
            try
            {
                DataSet ds = new DataSet();
                objData.OpenConnection(objCurrentInfo.GetCompanyCode());
                {
                    ds = objData.ExecuteDataSet("exec sp_GetRegionMaster '" + objCurrentInfo.GetCompanyCode() + "'");
                }       

                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                objData.CloseConnection();
            }
        }

        public JsonResult GetUserPrivileges(string regionCode)
        {
            try
            {
                DataControl.CurrentInfo objCurr = new DataControl.CurrentInfo();
                string companyCode = objCurr.GetCompanyCode();
                DataSet ds = new DataSet();
                DataSet dsUserDetails = new DataSet();
                dsUserDetails = GetRegionWiseUser(companyCode, regionCode);
                string userCode = "", userTypeCode = "";
                if (dsUserDetails.Tables[0].Rows.Count > 0)
                {
                    userCode = dsUserDetails.Tables[0].Rows[0]["User_Code"].ToString();
                    userTypeCode = dsUserDetails.Tables[0].Rows[0]["User_Type_Code"].ToString();
                }
                else
                {
                    userCode = objCurr.GetUserCode();
                    userTypeCode = objCurr.GetUserTypeCode();
                }

                string cmdText = "SP_hdGetUserPrivilegeMapping";
                SqlCommand cmd = new SqlCommand(cmdText);
                cmd.CommandType = CommandType.StoredProcedure;

                // Added the parameter to SqlCommand.
                AddParamToSqlCommand(cmd, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(cmd, "@userTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userTypeCode);
                AddParamToSqlCommand(cmd, "@userCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(cmd, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 30, "");

                objData.OpenConnection(companyCode);
                ds = objData.ExecuteDataSet(cmd);


                List<Models.MasterModel> lstPrivilege = new List<Models.MasterModel>();
                List<Models.MasterModel> lstUserDetails = new List<Models.MasterModel>();

                if (ds.Tables[0].Rows.Count > 0)
                {
                    DataTable dt = new DataTable();
                    dt = ds.Tables[0];

                    lstPrivilege = (from item in dt.AsEnumerable()
                                    select new Models.MasterModel()
                                    {
                                        PrivilegeName = item["Privilege_Name"].ToString(),
                                        PrivilegeValue = item["Privilege_Value_Name"].ToString(),
                                        UsertypeCode = item["User_Type_Code"].ToString()
                                    }).ToList<Models.MasterModel>();
                }


                if (dsUserDetails.Tables[0].Rows.Count > 0)
                {
                    DataTable dt = new DataTable();
                    dt = dsUserDetails.Tables[0];

                    lstUserDetails = (from item in dt.AsEnumerable()
                                      select new Models.MasterModel()
                                      {
                                          UserCode = item["User_Code"].ToString(),
                                          RegionCode = item["Region_Code"].ToString(),
                                          UsertypeCode = item["User_Type_Code"].ToString()
                                      }).ToList<Models.MasterModel>();
                }
                List<JsonResult> lstPrivilegeDetails = new List<JsonResult> { Json(lstPrivilege, JsonRequestBehavior.AllowGet), Json(lstUserDetails, JsonRequestBehavior.AllowGet) };
                return Json(lstPrivilegeDetails, JsonRequestBehavior.AllowGet);
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

        public DataSet GetRegionWiseUser(string companyCode, string regionCode)
        {
            try
            {
                DataSet ds = new DataSet();

                string cmdText = "SP_hdGetRegionWiseUser";
                SqlCommand cmd = new SqlCommand(cmdText);
                cmd.CommandType = CommandType.StoredProcedure;

                // Added the parameter to SqlCommand.
                AddParamToSqlCommand(cmd, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(cmd, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                AddParamToSqlCommand(cmd, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, "");
                objData.OpenConnection(companyCode);
                ds = objData.ExecuteDataSet(cmd);
           

                return ds;
            }
            finally
            {
                objData.CloseConnection();
            }
        }
        public JsonResult Getusermaster(FormCollection collection)
        {

            try
            {
                DataSet ds = new DataSet();
                objData.OpenConnection(objCurrentInfo.GetCompanyCode());
                {
                    ds = objData.ExecuteDataSet("EXEC SP_GetUserDetails");
                }
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                objData.CloseConnection();
            }
        }
        public JsonResult GetPrivilegesByUser(FormCollection collection)
        {
            try
            {
                DataControl.CurrentInfo objCurr = new DataControl.CurrentInfo();
                string companyCode = objCurr.GetCompanyCode();
                string userTypeCode = "";
                string userCode = collection["UserCode"].ToString();

                DataSet ds = new DataSet();

                string cmdText = "SP_hdGetPrivilegeMapping";
                SqlCommand cmd = new SqlCommand(cmdText);
                cmd.CommandType = CommandType.StoredProcedure;

                // Added the parameter to SqlCommand.
                AddParamToSqlCommand(cmd, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(cmd, "@userTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userTypeCode);
                AddParamToSqlCommand(cmd, "@userCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                AddParamToSqlCommand(cmd, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 30, "");

                objData.OpenConnection(companyCode);
                ds = objData.ExecuteDataSet(cmd);


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
                objData.CloseConnection();
            }
        }
        public JsonResult GetRegionMasterTreeDetails()
        {
            try
            {
                objData.OpenConnection(objCurrentInfo.GetCompanyCode());
                DataSet ds = objData.ExecuteDataSet("exec SP_hdGetRegionTreeDetails '" + objCurrentInfo.GetCompanyCode() + "', '" + objCurrentInfo.GetRegionCode() + "'");
              

                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                objData.CloseConnection();
            }

        }

        public JsonResult GetUserMasterTreeDetails(FormCollection collection)
        {

            try
            {
                DataSet ds = new DataSet();
                objData.OpenConnection(objCurrentInfo.GetCompanyCode());
                {
                    ds = objData.ExecuteDataSet("EXEC SP_hdGetUserTreeDetails '" + objCurrentInfo.GetCompanyCode() + "','" + objCurrentInfo.GetUserCode() + "'");
                }
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                objData.CloseConnection();
            }
        }
        #endregion PublicMethods
    }
}