#region Using
using System;
using System.Web;
using System.Linq;
using System.Web.Mvc;
using System.Data;
using System.Data.SqlClient;
using System.Collections.Generic;
using ElmahWrapper;
using DataControl;
using DataControl.HD_MasterFactoryClasses;
using System.Text;
using MVCModels.HiDoctor_Master;
#endregion Using

namespace HiDoctor.Controllers
{

    public enum DCRStatus { Unapproved = 0, Applied = 1, Approved = 2, Draft = 3 }
    [AjaxSessionActionFilter]
    public class MasterController : Controller
    {
        #region Private variables
        DataControl.Data objData = new DataControl.Data();
        DataControl.CurrentInfo objCurrentInfo = new DataControl.CurrentInfo();
        private Data _objData = new Data();
        private SqlDataReader sqlDataReader;
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
        public JsonResult fnGetselectedAllPrivileges(string user_Code)
        {
            try
            {
                DataControl.CurrentInfo objCurr = new DataControl.CurrentInfo();
                string companyCode = objCurr.GetCompanyCode();
                //string userTypeCode = objCurr.GetUserTypeCode();
                string userCode = user_Code;

                DataSet ds = new DataSet();

                string cmdText = "SP_hdGetSelectePrivilegeMapping";
                SqlCommand cmd = new SqlCommand(cmdText);
                cmd.CommandType = CommandType.StoredProcedure;

                // Added the parameter to SqlCommand.
                AddParamToSqlCommand(cmd, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                //AddParamToSqlCommand(cmd, "@userTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userTypeCode);
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

        public JsonResult GetChildRegionsJSON(string regionCode)
        {
            try
            {
                DataSet ds = new DataSet();

                objData.OpenConnection(objCurrentInfo.GetCompanyCode());
                {
                    ds = objData.ExecuteDataSet("exec SP_hdChildRegionCodes '" + objCurrentInfo.GetCompanyCode() + "','" + regionCode + "'");
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

        public JsonResult GetChildUsersJSON(string companyCode, string regionCode, string userCode)
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
                AddParamToSqlCommand(cmd, "@Hierarchy", ParameterDirection.Input, SqlDbType.VarChar, 30, "C");
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

        public DataSet GetChildUsersDataSet(string companyCode, string regionCode, string userCode)
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
                AddParamToSqlCommand(cmd, "@Hierarchy", ParameterDirection.Input, SqlDbType.VarChar, 30, "C");
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
                if (string.IsNullOrEmpty(userCode))
                {
                    userCode = objCurr.GetUserCode();
                }
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
            string LoggedInCompCode = objCurrentInfo.GetCompanyCode();
            string LoggedInRegionCode = objCurrentInfo.GetRegionCode();

            DataControl.JSONConverter json = null;
            DataSet ds = null;
            json = new DataControl.JSONConverter();

            try
            {
                objData.OpenConnection(LoggedInCompCode);
                ds = objData.ExecuteDataSet("exec SP_hdGetRegionTreeDetails '" + LoggedInCompCode + "', '" + LoggedInRegionCode + "'");

                json = new DataControl.JSONConverter();
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
                string LoggedInCompCode = objCurrentInfo.GetCompanyCode();
                string LoggedInUserCode = objCurrentInfo.GetUserCode();
                DataControl.JSONConverter json = null;
                DataSet ds = null;
                json = new DataControl.JSONConverter();
                ds = new DataSet();
                objData.OpenConnection(objCurrentInfo.GetCompanyCode());
                {
                    ds = objData.ExecuteDataSet("EXEC SP_hdGetUserTreeDetails '" + objCurrentInfo.GetCompanyCode() + "','" + objCurrentInfo.GetUserCode() + "'");
                }
                return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                objData.CloseConnection();
            }
        }
        public JsonResult GetRegionMasterFullTreeDetails()
        {
            try
            {
                objData.OpenConnection(objCurrentInfo.GetCompanyCode());
                DataSet ds = objData.ExecuteDataSet("exec SP_hdGetRegionFullTreeDetails '" + objCurrentInfo.GetCompanyCode() + "'");

                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                objData.CloseConnection();
            }

        }
        public DataSet GetMappedDepots()
        {
            try
            {
                objData.OpenConnection(objCurrentInfo.GetCompanyCode());
                DataSet ds = objData.ExecuteDataSet("exec sp_sdGetMappedDepots '" + objCurrentInfo.GetCompanyCode() + "','" + objCurrentInfo.GetUserCode() + "'");

                return ds;
            }
            finally
            {
                objData.CloseConnection();
            }
        }
        public JsonResult GetUserMasterFullTreeDetails()
        {
            DataSet ds = new DataSet();
            BLUser _objBlUser = new BLUser();
            ds = _objBlUser.GetUserFullTreeDetails(objCurrentInfo.GetCompanyCode());
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }
        #endregion PublicMethods

        #region user tree generation
        StringBuilder strTreeContent = new StringBuilder();
        public string GenerateFullUserTree()
        {
            try
            
            {
                strTreeContent = new StringBuilder();
                //DataSet ds = new DataSet();
                string LoggedInCompCode = objCurrentInfo.GetCompanyCode();
                string LoggedInUserCode = objCurrentInfo.GetUserCode();
                DAL_DoctorVisitAnalysis objjr = new DataControl.DAL_DoctorVisitAnalysis();
                List<UserrTreeModel> obbc = objjr.GetFullUserrTree(LoggedInCompCode, LoggedInUserCode).ToList();
               if (obbc.Count > 0)
                    {
                        strTreeContent.Append("<ul  id='home' item-expanded='true'>");
                        List<UserrTreeModel> drParent = obbc.Where(a => a.User_Code == obbc[0].User_Code).ToList();
                       if (drParent.Count > 0)
                        {
                            foreach (var Reg in drParent)
                            {

                                strTreeContent.Append("<li id='" + Reg.User_Code + "'  class='expanded' >" + Reg.User_Name
                            + "," + Reg.User_Type_Name + "(" + Reg.Region_Name + ")");
                                List<UserrTreeModel> drUnderUsers = obbc.Where(b => b.Under_User_Code == Reg.User_Code).ToList();
                               if (drUnderUsers.Count > 0)
                                {
                                    strTreeContent.Append("<ul>");
                                    GenerateSubUserTree(Reg.User_Code, obbc.ToList());
                                    strTreeContent.Append("</ul>");
                                }
                                strTreeContent.Append("</li>");
                            }
                            strTreeContent.Append("</ul>");
                        }
                    }
                
                return strTreeContent.ToString();
        }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        
      public string GenerateUserTree()
        {
            try
            {
                strTreeContent = new StringBuilder();
                string LoggedInCompCode = objCurrentInfo.GetCompanyCode();
                string LoggedInUserCode = objCurrentInfo.GetUserCode();
                DAL_DoctorVisitAnalysis objj = new DataControl.DAL_DoctorVisitAnalysis();
                IEnumerable<UserrTreeModel> obb = objj.GetUserrTree(LoggedInCompCode, LoggedInUserCode);
                strTreeContent.Append("<ul  id='home' item-expanded='true'>");
                List<UserrTreeModel> objUsers = obb.Where(a => a.User_Code == LoggedInUserCode).ToList();
                if (objUsers.Count > 0)
                {
                    foreach (var Reg in objUsers)
                    {
                        strTreeContent.Append("<li id='" + Reg.User_Code + "'  class='expanded' >" + Reg.User_Name
                             + "," + Reg.User_Type_Name + "(" + Reg.Region_Name + ")");
                        List<UserrTreeModel> objUserr1 = obb.Where(b => b.Under_User_Code == Reg.User_Code).ToList();
                        if (objUserr1.Count > 0)
                        {
                            strTreeContent.Append("<ul>");
                            GenerateSubUserTree(Reg.User_Code, obb.ToList());
                            strTreeContent.Append("</ul>");
                        }
                        strTreeContent.Append("</li>");
                    }
                    strTreeContent.Append("</ul>");
                }

                return strTreeContent.ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

      public void GenerateSubUserTree(string parentId, List<UserrTreeModel> lstR)
        {
            try
            {
                string LoggedInCompCode = objCurrentInfo.GetCompanyCode();
                string LoggedInUserCode = objCurrentInfo.GetUserCode();

                DAL_DoctorVisitAnalysis objj = new DataControl.DAL_DoctorVisitAnalysis();
                List<UserrTreeModel> objUsers1 = lstR.Where(a => a.Under_User_Code == parentId && a.User_Code != lstR[0].User_Code).ToList();
                if (objUsers1.Count > 0)
                {
                    foreach (var drChild in objUsers1)
                    {
                        strTreeContent.Append("<li id='" + drChild.User_Code + "' class='expanded' >");
                        List<UserrTreeModel> objUsers2 = lstR.Where(b => b.Under_User_Code == drChild.User_Code).ToList();
                        if (objUsers2.Count > 0)
                        {
                            strTreeContent.Append(drChild.User_Name + "," + drChild.User_Type_Name
                                + "(" + drChild.Region_Name + ")");
                            if ((drChild.User_Code) != null)
                            {
                                strTreeContent.Append("<ul>");
                                GenerateSecondLevelUserTree(drChild.User_Code, lstR);
                                strTreeContent.Append("</ul>");
                            }
                        }
                        else
                        {
                            strTreeContent.Append(drChild.User_Name + "," + drChild.User_Type_Name
                                + "(" + drChild.Region_Name + ")");
                        }
                        strTreeContent.Append("</li>");
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public void GenerateSecondLevelUserTree(string underUserCode, List<UserrTreeModel> lstR1)
        {
            try
            {
                string LoggedInCompCode = objCurrentInfo.GetCompanyCode();
                string LoggedInUserCode = objCurrentInfo.GetUserCode();
                DAL_DoctorVisitAnalysis objj = new DataControl.DAL_DoctorVisitAnalysis();
                List<UserrTreeModel> objUsers3 = lstR1.Where(a => a.Under_User_Code == underUserCode && a.User_Code != lstR1[0].User_Code).ToList();
                if (objUsers3.Count > 0)
                {
                    foreach (var drChild in objUsers3)
                    {
                        strTreeContent.Append("<li id='" + drChild.User_Code + "' class='expanded'>");
                        List<UserrTreeModel> objUsers4 = lstR1.Where(b => b.Under_User_Code == drChild.User_Code).ToList();
                        if (objUsers4.Count > 0)
                        {
                            strTreeContent.Append(drChild.User_Name + "," + drChild.User_Type_Name
                                 + "(" + drChild.Region_Name + ")");
                            strTreeContent.Append("<ul>");
                            GenerateSecondLevelUserTree(drChild.User_Code, lstR1);
                            strTreeContent.Append("</ul>");
                        }
                        else
                        {
                           strTreeContent.Append(drChild.User_Name + "," + drChild.User_Type_Name
                                + "(" + drChild.Region_Name + ")");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion  user tree generation

//       **************************#Start new User Treee**********************************

        public JsonResult GetUserMasterFullTreeDetailsNew()
        {
            DataSet ds = new DataSet();
            BLUser _objBlUser = new BLUser();
            ds = _objBlUser.GetUserFullTreeDetailsNew(objCurrentInfo.GetCompanyCode());
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }


        public string GenerateFullUserTreeNew()
        {
            try
            {
                strTreeContent = new StringBuilder();
                //DataSet ds = new DataSet();
                string LoggedInCompCode = objCurrentInfo.GetCompanyCode();
                string LoggedInUserCode = objCurrentInfo.GetUserCode();
                DAL_DoctorVisitAnalysis objjr = new DataControl.DAL_DoctorVisitAnalysis();
                List<UserTreeModelNew> obbc = objjr.GetFullUserTreeNew(LoggedInCompCode, LoggedInUserCode).ToList();
                if (obbc.Count > 0)
                {
                    strTreeContent.Append("<ul  id='home' item-expanded='true'>");
                    List<UserTreeModelNew> drParent = obbc.Where(a => a.User_Code == obbc[0].User_Code).ToList();
                    if (drParent.Count > 0)
                    {
                        foreach (var Reg in drParent)
                        {

                            strTreeContent.Append("<li id='" + Reg.User_Code + "'  class='expanded' >"  + Reg.Employee_Name + "(" + Reg.User_Name + ")"
                        + "," + Reg.User_Type_Name + "," + Reg.Region_Name);
                            List<UserTreeModelNew> drUnderUsers = obbc.Where(b => b.Under_User_Code == Reg.User_Code).ToList();
                            if (drUnderUsers.Count > 0)
                            {
                                strTreeContent.Append("<ul>");
                                GenerateSubUserTreeNew(Reg.User_Code, obbc.ToList());
                                strTreeContent.Append("</ul>");
                            }
                            strTreeContent.Append("</li>");
                        }
                        strTreeContent.Append("</ul>");
                    }
                }

                return strTreeContent.ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }



        // Create New Tree -Add Employee Name in first

        public string GenerateUserTreeNew()
        {
            try
            {
                strTreeContent = new StringBuilder();
                string LoggedInCompCode = objCurrentInfo.GetCompanyCode();
                string LoggedInUserCode = objCurrentInfo.GetUserCode();
                DAL_DoctorVisitAnalysis objj = new DataControl.DAL_DoctorVisitAnalysis();
                IEnumerable<UserTreeModelNew> obb = objj.GetUserTreeNew(LoggedInCompCode, LoggedInUserCode);
                strTreeContent.Append("<ul  id='home' item-expanded='true'>");
                List<UserTreeModelNew> objUsers = obb.Where(a => a.User_Code == LoggedInUserCode).ToList();
                if (objUsers.Count > 0)
                {
                    foreach (var Reg in objUsers)
                    {
                        strTreeContent.Append("<li id='" );
                        strTreeContent.Append(Reg.User_Code );
                        strTreeContent.Append("'  class='expanded' >"); 
                        strTreeContent.Append(Reg.Employee_Name);
                        strTreeContent.Append("("); 
                        strTreeContent.Append(Reg.User_Name); 
                        strTreeContent.Append(")");
                        strTreeContent.Append(","); 
                        strTreeContent.Append(Reg.User_Type_Name); 
                        strTreeContent.Append(","); 
                        strTreeContent.Append(Reg.Region_Name);
                        List<UserTreeModelNew> objUserr1 = obb.Where(b => b.Under_User_Code == Reg.User_Code).ToList();
                        if (objUserr1.Count > 0)
                        {
                            strTreeContent.Append("<ul>");
                            GenerateSubUserTreeNew(Reg.User_Code, obb.ToList());
                            strTreeContent.Append("</ul>");
                        }
                        strTreeContent.Append("</li>");
                    }
                    strTreeContent.Append("</ul>");
                }

                return strTreeContent.ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public void GenerateSubUserTreeNew(string parentId, List<UserTreeModelNew> lstR)
        {
            try
            {
                string LoggedInCompCode = objCurrentInfo.GetCompanyCode();
                string LoggedInUserCode = objCurrentInfo.GetUserCode();

                DAL_DoctorVisitAnalysis objj = new DataControl.DAL_DoctorVisitAnalysis();
                List<UserTreeModelNew> objUsers1 = lstR.Where(a => a.Under_User_Code == parentId && a.User_Code != lstR[0].User_Code).ToList();
                if (objUsers1.Count > 0)
                {
                    foreach (var drChild in objUsers1)
                    {
                        strTreeContent.Append("<li id='" + drChild.User_Code + "' class='expanded' >");
                        List<UserTreeModelNew> objUsers2 = lstR.Where(b => b.Under_User_Code == drChild.User_Code).ToList();
                        if (objUsers2.Count > 0)
                        {
                            strTreeContent.Append(drChild.Employee_Name +  "(" + drChild.User_Name + ")" + "," + drChild.User_Type_Name
                              + "," + drChild.Region_Name);
                            if ((drChild.User_Code) != null)
                            {
                                strTreeContent.Append("<ul>");
                                GenerateSecondLevelUserTree_New(drChild.User_Code, lstR);
                                strTreeContent.Append("</ul>");
                            }
                        }
                        else
                        {
                            strTreeContent.Append(drChild.Employee_Name + "(" + drChild.User_Name + ")" + "," + drChild.User_Type_Name
                              + "," + drChild.Region_Name);
                        }
                        strTreeContent.Append("</li>");
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public void GenerateSecondLevelUserTree_New(string underUserCode, List<UserTreeModelNew> lstR1)
        {
            try
            {
                string LoggedInCompCode = objCurrentInfo.GetCompanyCode();
                string LoggedInUserCode = objCurrentInfo.GetUserCode();
                DAL_DoctorVisitAnalysis objj = new DataControl.DAL_DoctorVisitAnalysis();
                List<UserTreeModelNew> objUsers3 = lstR1.Where(a => a.Under_User_Code == underUserCode && a.User_Code != lstR1[0].User_Code).ToList();
                if (objUsers3.Count > 0)
                {
                    foreach (var drChild in objUsers3)
                    {
                        strTreeContent.Append("<li id='" + drChild.User_Code + "' class='expanded'>");
                        List<UserTreeModelNew> objUsers4 = lstR1.Where(b => b.Under_User_Code == drChild.User_Code).ToList();
                        if (objUsers4.Count > 0)
                        {
                            strTreeContent.Append(drChild.Employee_Name + "(" + drChild.User_Name + ")" + "," + drChild.User_Type_Name
                              + "," + drChild.Region_Name);
                            strTreeContent.Append("<ul>");
                            GenerateSecondLevelUserTree_New(drChild.User_Code, lstR1);
                            strTreeContent.Append("</ul>");
                        }
                        else
                        {
                            strTreeContent.Append(drChild.Employee_Name + "(" + drChild.User_Name + ")" + "," + drChild.User_Type_Name
                               + "," + drChild.Region_Name);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #region get region full tree details
       public string GenerateRegionTree()
        {
            StringBuilder strRegionContent = new StringBuilder();
            string LoggedInCompCode = objCurrentInfo.GetCompanyCode();
            string LoggedInRegionCode = objCurrentInfo.GetRegionCode();
            DataSet ds = null;
            objData.OpenConnection(LoggedInCompCode);
            ds = objData.ExecuteDataSet("exec SP_hdGetRegionTreeDetails '" + LoggedInCompCode + "', '" + LoggedInRegionCode + "'");
            if (ds.Tables.Count > 0)
            {
                if (ds.Tables[0].Rows.Count > 0)
                {
                   
                    string regionUserName = "";

                    if (ds.Tables[0].Rows.Count > 0)
                    {

                        strTreeContent.Append("<ul  id='home' item-expanded='true'>");
                        DataRow[] drParent = ds.Tables[0].AsEnumerable().Where(a => Convert.ToString(a["Region_Code"]) == LoggedInRegionCode).ToArray();
                        if (drParent.Length > 0)
                        {
                            foreach (DataRow dr in drParent)
                            {
                                if (string.IsNullOrEmpty(Convert.ToString(dr["User_Name"])))
                                {

                                    // vacantArr.Add(Convert.ToString(dr["Region_Code"]));
                                    // var vacJson = jsonPath(jsData, "$.Tables[1].Rows[?(@.Region_Code=='" + jsData.Tables[0].Rows[i].Region_Code + "')]");
                                    DataRow[] drRegion = ds.Tables[1].AsEnumerable().Where(z => Convert.ToString(z["Region_Code"]) ==
                                        Convert.ToString(dr["Region_Code"])).ToArray();

                                    // vacant region
                                    if (drRegion.Length > 0)
                                    {
                                        regionUserName = "VACANT";
                                    }
                                    else
                                    {// not assigned region
                                        regionUserName = "NOT ASSIGNED";
                                    }
                                }
                                else
                                {
                                    regionUserName = Convert.ToString(dr["User_Name"]);
                                }

                                string[] userNameAr;
                                string title = string.Empty;
                                userNameAr = regionUserName.Split(',');
                                for (var a = 0; a < userNameAr.Length; a++)
                                {
                                    title += userNameAr[a] + ",";
                                }
                                title = title.TrimEnd(',');
                                if (regionUserName.Length > 0)
                                {
                                    strTreeContent.Append("<li class='expanded' id='" + Convert.ToString(dr["Region_Code"])
                                            + "' title='" + title + "'>" + Convert.ToString(dr["Region_Name"])
                                            + "(" + Convert.ToString(dr["Region_Type_Name"])
                                            + ")-" + regionUserName);

                                           //+")-" + regionUserName.Substring(0, 30) + "...");
                                }
                                else
                                {
                                    strTreeContent.Append("<li class='expanded' id='" + Convert.ToString(dr["Region_Code"])
                                           + "' title='" + title + "'>" + Convert.ToString(dr["Region_Name"])
                                           + "(" + Convert.ToString(dr["Region_Type_Name"])
                                           + ")-" + regionUserName);
                                }


                                DataRow[] drUnderUsers = ds.Tables[0].AsEnumerable().Where(b => Convert.ToString(b["Under_Region_Code"]) ==
                                    Convert.ToString(dr["Region_Code"])).ToArray();
                                if (drUnderUsers.Length > 0)
                                {
                                    strTreeContent.Append("<ul>");
                                    GenerateSubRegionTree(ds, Convert.ToString(dr["Region_Code"]));
                                    strTreeContent.Append("</ul>");
                                }
                                strTreeContent.Append("</li>");
                            }
                            strTreeContent.Append("</ul>");
                        }
                    }
                }
            }
            return strTreeContent.ToString();
        }

      public string GenerateRegionFullTree()
        {
            string LoggedInCompCode = objCurrentInfo.GetCompanyCode();
            string LoggedInRegionCode = objCurrentInfo.GetRegionCode();
            DataSet ds = null;
            objData.OpenConnection(LoggedInCompCode);
            ds = objData.ExecuteDataSet("exec SP_hdGetRegionTreeDetails '" + LoggedInCompCode + "', ''");
            if (ds.Tables.Count > 0)
            {
                if (ds.Tables[0].Rows.Count > 0)
                {
                    // List<string> vacantArr = new List<string>();
                    string regionUserName = "";

                    if (ds.Tables[0].Rows.Count > 0)
                    {

                        strTreeContent.Append("<ul  id='home' item-expanded='true'>");
                        DataRow[] drParent = ds.Tables[0].AsEnumerable().Where(a => Convert.ToString(a["Region_Code"]) == ds.Tables[0].Rows[0]["Region_Code"].ToString()).ToArray();
                        if (drParent.Length > 0)
                        {
                            foreach (DataRow dr in drParent)
                            {
                                if (string.IsNullOrEmpty(Convert.ToString(dr["User_Name"])))
                                {

                                    // vacantArr.Add(Convert.ToString(dr["Region_Code"]));
                                    // var vacJson = jsonPath(jsData, "$.Tables[1].Rows[?(@.Region_Code=='" + jsData.Tables[0].Rows[i].Region_Code + "')]");
                                    DataRow[] drRegion = ds.Tables[1].AsEnumerable().Where(z => Convert.ToString(z["Region_Code"]) ==
                                        Convert.ToString(dr["Region_Code"])).ToArray();

                                    // vacant region
                                    if (drRegion.Length > 0)
                                    {
                                        regionUserName = "VACANT";
                                    }
                                    else
                                    {// not assigned region
                                        regionUserName = "NOT ASSIGNED";
                                    }
                                }
                                else
                                {
                                    regionUserName = Convert.ToString(dr["User_Name"]);
                                }

                                string[] userNameAr;
                                string title = string.Empty;
                                userNameAr = regionUserName.Split(',');
                                for (var a = 0; a < userNameAr.Length; a++)
                                {
                                    title += userNameAr[a] + ",";
                                }
                                title = title.TrimEnd(',');
                                if (regionUserName.Length > 0)
                                {
                                    strTreeContent.Append("<li class='expanded' id='" + Convert.ToString(dr["Region_Code"])
                                            + "' title='" + title + "'>" + Convert.ToString(dr["Region_Name"])
                                            + "(" + Convert.ToString(dr["Region_Type_Name"])
                                            + ")-" + regionUserName); //.Substring(0, 30) + "...");
                                }
                                else
                                {
                                    strTreeContent.Append("<li class='expanded' id='" + Convert.ToString(dr["Region_Code"])
                                           + "' title='" + title + "'>" + Convert.ToString(dr["Region_Name"])
                                           + "(" + Convert.ToString(dr["Region_Type_Name"])
                                           + ")-" + regionUserName);
                                }


                                DataRow[] drUnderUsers = ds.Tables[0].AsEnumerable().Where(b => Convert.ToString(b["Under_Region_Code"]) ==
                                    Convert.ToString(dr["Region_Code"])).ToArray();
                                if (drUnderUsers.Length > 0)
                                {
                                    strTreeContent.Append("<ul>");
                                    GenerateSubRegionTree(ds, Convert.ToString(dr["Region_Code"]));
                                    strTreeContent.Append("</ul>");
                                }
                                strTreeContent.Append("</li>");
                            }
                            strTreeContent.Append("</ul>");
                        }
                    }
                }
            }
            return strTreeContent.ToString();
        }

        public void GenerateSubRegionTree(DataSet ds, string parentId)
        {
            try
            {
                DataRow[] dr = ds.Tables[0].AsEnumerable().Where(a => Convert.ToString(a["Under_Region_Code"]) == parentId
                    && Convert.ToString(a["Region_Code"]) != ds.Tables[0].Rows[0]["Region_Code"].ToString()).ToArray();
                if (dr.Length > 0)
                {
                    foreach (DataRow drChild in dr)
                    {
                        string regionUserName = string.Empty;

                        DataRow[] drUnderRegions = ds.Tables[0].AsEnumerable().Where(b => Convert.ToString(b["Under_Region_Code"]) ==
                            Convert.ToString(drChild["Region_Code"])).ToArray();
                        if (drUnderRegions.Length > 0)
                        {
                            //strTreeContent.Append(Convert.ToString(drChild["Region_Name"]) + "," + Convert.ToString(drChild["Region_Type_Name"])
                            //    + "(" + Convert.ToString(drChild["Region_Name"]) + ")");
                            if (string.IsNullOrEmpty(Convert.ToString(drChild["User_Name"])))
                            {

                                DataRow[] drRegion = ds.Tables[1].AsEnumerable().Where(z => Convert.ToString(z["Region_Code"]) ==
                                    Convert.ToString(drChild["Region_Code"])).ToArray();

                                // vacant region
                                if (drRegion.Length > 0)
                                {
                                    regionUserName = "VACANT";
                                }
                                else
                                {// not assigned region
                                    regionUserName = "NOT ASSIGNED";
                                }
                            }
                            else
                            {
                                regionUserName = Convert.ToString(drChild["User_Name"]);
                            }

                            string[] userNameAr;
                            string title = string.Empty;
                            userNameAr = regionUserName.Split(',');
                            for (var a = 0; a < userNameAr.Length; a++)
                            {
                                title += userNameAr[a] + ",";
                            }
                            title = title.TrimEnd(',');
                            //strTreeContent.Append("<li id='" + Convert.ToString(drChild["Region_Code"]) + "' class='expanded' >");
                            if (regionUserName.Length > 0)
                            {
                                strTreeContent.Append("<li class='expanded' id='" + Convert.ToString(drChild["Region_Code"])
                                        + "' title='" + title + "'>" + Convert.ToString(drChild["Region_Name"])
                                        + "(" + Convert.ToString(drChild["Region_Type_Name"])
                                        + ")-" + regionUserName); //.Substring(0, 30) + "...");
                            }
                            else
                            {
                                strTreeContent.Append("<li class='expanded' id='" + Convert.ToString(drChild["Region_Code"])
                                       + "' title='" + title + "'>" + Convert.ToString(drChild["Region_Name"])
                                       + "(" + Convert.ToString(drChild["Region_Type_Name"])
                                       + ")-" + regionUserName);
                            }
                            if (Convert.ToString(drChild["Region_Code"]) != null)
                            {
                                strTreeContent.Append("<ul>");
                                GenerateSecondLevelRegionTree(ds, Convert.ToString(drChild["Region_Code"]));
                                strTreeContent.Append("</ul>");
                            }
                        }
                        else
                        {
                            //strTreeContent.Append(Convert.ToString(drChild["Region_Name"]) + "," + Convert.ToString(drChild["Region_Type_Name"])
                            //    + "(" + Convert.ToString(drChild["Region_Name"]) + ")");
                            if (string.IsNullOrEmpty(Convert.ToString(drChild["User_Name"])))
                            {

                                DataRow[] drRegion = ds.Tables[1].AsEnumerable().Where(z => Convert.ToString(z["Region_Code"]) ==
                                    Convert.ToString(drChild["Region_Code"])).ToArray();

                                // vacant region
                                if (drRegion.Length > 0)
                                {
                                    regionUserName = "VACANT";
                                }
                                else
                                {// not assigned region
                                    regionUserName = "NOT ASSIGNED";
                                }
                            }
                            else
                            {
                                regionUserName = Convert.ToString(drChild["User_Name"]);
                            }

                            string[] userNameAr;
                            string title = string.Empty;
                            userNameAr = regionUserName.Split(',');
                            for (var a = 0; a < userNameAr.Length; a++)
                            {
                                title += userNameAr[a] + ",";
                            }
                            title = title.TrimEnd(',');
                            //strTreeContent.Append("<li id='" + Convert.ToString(drChild["Region_Code"]) + "' class='expanded' >");
                            if (regionUserName.Length > 0)
                            {
                                strTreeContent.Append("<li class='expanded' id='" + Convert.ToString(drChild["Region_Code"])
                                        + "' title='" + title + "'>" + Convert.ToString(drChild["Region_Name"])
                                        + "(" + Convert.ToString(drChild["Region_Type_Name"])
                                        + ")-" + regionUserName); //.Substring(0, 30) + "...");
                            }
                            else
                            {
                                strTreeContent.Append("<li class='expanded' id='" + Convert.ToString(drChild["Region_Code"])
                                       + "' title='" + title + "'>" + Convert.ToString(drChild["Region_Name"])
                                       + "(" + Convert.ToString(drChild["Region_Type_Name"])
                                       + ")-" + regionUserName);
                            }
                        }
                        strTreeContent.Append("</li>");
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public void GenerateSecondLevelRegionTree(DataSet ds, string underRegionCode)
        {
            try
            {
                DataRow[] dr = ds.Tables[0].AsEnumerable().Where(a => Convert.ToString(a["Under_Region_Code"]) == underRegionCode &&
                    Convert.ToString(a["Region_Code"]) != ds.Tables[0].Rows[0]["Region_Code"].ToString()).ToArray();
                if (dr.Length > 0)
                {
                    foreach (DataRow drChild in dr)
                    {
                        string regionUserName = string.Empty;
                        // strTreeContent.Append("<li id='" + Convert.ToString(drChild["Region_Code"]) + "' class='expanded'>");
                        DataRow[] drr = ds.Tables[0].AsEnumerable().Where(b => Convert.ToString(b["Under_Region_Code"]) == Convert.ToString(drChild["Region_Code"])).ToArray();
                        if (drr.Length > 0)
                        {
                            //strTreeContent.Append(Convert.ToString(drChild["Region_Name"]) + "," + Convert.ToString(drChild["Region_Type_Name"])
                            //    + "(" + Convert.ToString(drChild["Region_Name"]) + ")");
                            if (string.IsNullOrEmpty(Convert.ToString(drChild["User_Name"])))
                            {

                                DataRow[] drRegion = ds.Tables[1].AsEnumerable().Where(z => Convert.ToString(z["Region_Code"]) ==
                                    Convert.ToString(drChild["Region_Code"])).ToArray();

                                // vacant region
                                if (drRegion.Length > 0)
                                {
                                    regionUserName = "VACANT";
                                }
                                else
                                {// not assigned region
                                    regionUserName = "NOT ASSIGNED";
                                }
                            }
                            else
                            {
                                regionUserName = Convert.ToString(drChild["User_Name"]);
                            }

                            string[] userNameAr;
                            string title = string.Empty;
                            userNameAr = regionUserName.Split(',');
                            for (var a = 0; a < userNameAr.Length; a++)
                            {
                                title += userNameAr[a] + ",";
                            }
                            title = title.TrimEnd(',');
                            //strTreeContent.Append("<li id='" + Convert.ToString(drChild["Region_Code"]) + "' class='expanded' >");
                            if (regionUserName.Length > 0)
                            {
                                strTreeContent.Append("<li class='expanded' id='" + Convert.ToString(drChild["Region_Code"])
                                        + "' title='" + title + "'>" + Convert.ToString(drChild["Region_Name"])
                                        + "(" + Convert.ToString(drChild["Region_Type_Name"])
                                        + ")-" + regionUserName); // .Substring(0, 30) + "...");
                            }
                            else
                            {
                                strTreeContent.Append("<li class='expanded' id='" + Convert.ToString(drChild["Region_Code"])
                                       + "' title='" + title + "'>" + Convert.ToString(drChild["Region_Name"])
                                       + "(" + Convert.ToString(drChild["Region_Type_Name"])
                                       + ")-" + regionUserName);
                            }
                            strTreeContent.Append("<ul>");
                            GenerateSecondLevelRegionTree(ds, Convert.ToString(drChild["Region_Code"]));
                            strTreeContent.Append("</ul>");
                        }
                        else
                        {
                            //strTreeContent.Append(Convert.ToString(drChild["Region_Name"]) + "," + Convert.ToString(drChild["Region_Type_Name"])
                            //    + "(" + Convert.ToString(drChild["Region_Name"]) + ")");
                            if (string.IsNullOrEmpty(Convert.ToString(drChild["User_Name"])))
                            {

                                DataRow[] drRegion = ds.Tables[1].AsEnumerable().Where(z => Convert.ToString(z["Region_Code"]) ==
                                    Convert.ToString(drChild["Region_Code"])).ToArray();

                                // vacant region
                                if (drRegion.Length > 0)
                                {
                                    regionUserName = "VACANT";
                                }
                                else
                                {// not assigned region
                                    regionUserName = "NOT ASSIGNED";
                                }
                            }
                            else
                            {
                                regionUserName = Convert.ToString(drChild["User_Name"]);
                            }

                            string[] userNameAr;
                            string title = string.Empty;
                            userNameAr = regionUserName.Split(',');
                            for (var a = 0; a < userNameAr.Length; a++)
                            {
                                title += userNameAr[a] + ",";
                            }
                            title = title.TrimEnd(',');
                            //strTreeContent.Append("<li id='" + Convert.ToString(drChild["Region_Code"]) + "' class='expanded' >");
                            if (regionUserName.Length > 0)
                            {
                                strTreeContent.Append("<li class='expanded' id='" + Convert.ToString(drChild["Region_Code"])
                                        + "' title='" + title + "'>" + Convert.ToString(drChild["Region_Name"])
                                        + "(" + Convert.ToString(drChild["Region_Type_Name"])
                                        + ")-" + regionUserName); // .Substring(0, 30) + "...");
                            }
                            else
                            {
                                strTreeContent.Append("<li class='expanded' id='" + Convert.ToString(drChild["Region_Code"])
                                       + "' title='" + title + "'>" + Convert.ToString(drChild["Region_Name"])
                                       + "(" + Convert.ToString(drChild["Region_Type_Name"])
                                       + ")-" + regionUserName);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion get region full tree details

        public JsonResult GetUserTypeMasterTreeDetails()
        {
            DataControl.BLUser _objBluser = new DataControl.BLUser();
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            DataSet ds = new DataSet();
            DataControl.JSONConverter _objJson = new DataControl.JSONConverter();
            ds = _objBluser.GetUserTypetreedetail(_objCurrentInfo.GetCompanyCode());
            return Json(_objJson.Serialize(ds), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Generate disabled user tree
        /// </summary>
        /// <returns></returns>
        public string GetDisabledUsers()
        {
            Data _objData = new Data();
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            StringBuilder strContent = new StringBuilder();
            try
            {
                DataSet dsUsers = new DataSet();
                DataControl.JSONConverter json = new DataControl.JSONConverter();

                _objData.OpenConnection(_objCurrentInfo.GetCompanyCode());
                {
                    dsUsers = _objData.ExecuteDataSet("exec SP_hdGetDisabledUsers '" + _objCurrentInfo.GetCompanyCode() + "'");
                }
                if (dsUsers.Tables.Count > 0)
                {
                    for (var i = 0; i < dsUsers.Tables[0].Rows.Count; i++)
                    {
                        strContent.Append("<div class='dvDisableUser' onclick='fnDisabledUserTreeClick(\""
                                + Convert.ToString(dsUsers.Tables[0].Rows[i]["User_Code"]) + "\");$(this).addClass(\"selectNode\");' >"
                                + Convert.ToString(dsUsers.Tables[0].Rows[i]["User_Name"]) + "</div>");
                    }
                }
                //return Json(json.Serialize(dsUsers), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
            return strContent.ToString();
        }


        #region user tree generation new
        /// <summary>
        /// generate new user tree
        /// </summary>
        /// <returns></returns>
        public string UserTreeGeneration()
        {
            try
            {
                strTreeContent = new StringBuilder();
                DataSet ds = new DataSet();
                string LoggedInCompCode = objCurrentInfo.GetCompanyCode();
                string LoggedInUserCode = objCurrentInfo.GetUserCode();
                objData.OpenConnection(objCurrentInfo.GetCompanyCode());
                {
                    ds = objData.ExecuteDataSet("EXEC SP_hd_UM_GetUserTreeDetails '" + objCurrentInfo.GetCompanyCode() + "','" + objCurrentInfo.GetUserCode() + "'");
                }
                if (ds.Tables.Count > 0)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        strTreeContent.Append("<ul  id='home' item-expanded='true'>");
                        DataRow[] drParent = ds.Tables[0].AsEnumerable().Where(a => Convert.ToString(a["User_Code"]) == LoggedInUserCode).ToArray();
                        if (drParent.Length > 0)
                        {
                            foreach (DataRow dr in drParent)
                            {
                                strTreeContent.Append("<li id='" + Convert.ToString(dr["User_Code"]) + "'  class='expanded' >" + Convert.ToString(dr["User_Name"])
                                    + "," + Convert.ToString(dr["User_Type_Name"]) + "(" + Convert.ToString(dr["Region_Name"]) + ")");

                                DataRow[] drUnderUsers = ds.Tables[0].AsEnumerable().Where(b => Convert.ToString(b["Under_User_Code"]) == Convert.ToString(dr["User_Code"])).ToArray();
                                if (drUnderUsers.Length > 0)
                                {
                                    strTreeContent.Append("<ul>");
                                    //GenerateSubUserTree(ds, Convert.ToString(dr["User_Code"]));
                                    strTreeContent.Append("</ul>");
                                }
                                strTreeContent.Append("</li>");
                            }
                            strTreeContent.Append("</ul>");
                        }
                    }
                }
                return strTreeContent.ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        /// <summary>
        /// Get users by user name using search
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="treeId"></param>
        /// <param name="filterId"></param>
        /// <returns></returns>
        public string GetUsersByUserName(string userName, string treeId, string filterId)
        {
            StringBuilder strContent = new StringBuilder();
            try
            {
                BLUser objUser = new BLUser();
                DataControl.CurrentInfo objCurInfo = new CurrentInfo();
                List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
                lstUser = (List<MVCModels.HiDoctor_Master.UserModel>)objUser.GetUsersByUserName(objCurInfo.GetCompanyCode(), userName, objCurInfo.GetUserCode());
                if (lstUser.Count > 0)
                {
                    strContent.Append("<div class='list-group'>");
                    //  strContent.Append("<ul id='ulUsers'>");
                    foreach (MVCModels.HiDoctor_Master.UserModel user in lstUser)
                    {
                        //strContent.Append("<li onclick='fnGetUserTreeByUser(\"" + user.User_Code + "\",\"" + treeId + "\",\"" + filterId + "\");'>"
                        //                 + user.User_Name + "," + user.User_Type_Name + "(" + user.Region_Name + ")</li>");
                        strContent.Append("<a href='#' class='list-group-item' onclick='fnGetUserTreeByUser(\"" + user.User_Code + "\",\""
                            + treeId + "\",\"" + filterId + "\");'>" + user.User_Name + "," + user.User_Type_Name + "(" + user.Region_Name + ")</li>");
                    }
                    // strContent.Append("</ul>");
                    strContent.Append("</div>");
                }
                else
                {
                    strContent.Append("NO_USERS");
                }
            }

            catch (Exception ex)
            {
                strContent.Append("NO_USERS");
            }
            return strContent.ToString();
        }

        public string GetUsersByUserNameWithCheckBox(string userName, string treeId, string filterId)
        {
            StringBuilder strContent = new StringBuilder();
            try
            {
                BLUser objUser = new BLUser();
                DataControl.CurrentInfo objCurInfo = new CurrentInfo();
                List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
                lstUser = (List<MVCModels.HiDoctor_Master.UserModel>)objUser.GetUsersByUserName(objCurInfo.GetCompanyCode(), userName, objCurInfo.GetUserCode());
                if (lstUser.Count > 0)
                {
                    strContent.Append("<div class='list-group'>");
                    //  strContent.Append("<ul id='ulUsers'>");
                    foreach (MVCModels.HiDoctor_Master.UserModel user in lstUser)
                    {
                        //strContent.Append("<li onclick='fnGetUserTreeByUser(\"" + user.User_Code + "\",\"" + treeId + "\",\"" + filterId + "\");'>"
                        //                 + user.User_Name + "," + user.User_Type_Name + "(" + user.Region_Name + ")</li>");
                        strContent.Append("<a href='#' class='list-group-item' onclick='fnGetUserTreeByUserWithCheckBox(\"" + user.User_Code + "\",\""
                            + treeId + "\",\"" + filterId + "\");'>" + user.User_Name + "," + user.User_Type_Name + "(" + user.Region_Name + ")</li>");
                    }
                    // strContent.Append("</ul>");
                    strContent.Append("</div>");
                }
                else
                {
                    strContent.Append("NO_USERS");
                }
            }

            catch (Exception ex)
            {
                strContent.Append("NO_USERS");
            }
            return strContent.ToString();
        }

        public string UserTreeGenerationByUserCode(string userCode, string includeOneLevelParent, string excludeFirstLevel)
        {
            try
            {
                strTreeContent = new StringBuilder();
                DataSet ds = new DataSet();
                string LoggedInCompCode = objCurrentInfo.GetCompanyCode();
             
                objData.OpenConnection(objCurrentInfo.GetCompanyCode());
                {
                    ds = objData.ExecuteDataSet("EXEC SP_hd_UM_GetUserTreeDetails '" + objCurrentInfo.GetCompanyCode()
                        + "','" + userCode + "','" + includeOneLevelParent + "','" + excludeFirstLevel + "','" + objCurrentInfo.GetUserCode() + "' ");
                }
                if (ds.Tables.Count > 0)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        strTreeContent.Append("<ul  id='home' item-expanded='true'>");
                        DataRow[] drParent = ds.Tables[0].AsEnumerable().Where(a => Convert.ToString(a["User_Code"]) ==
                            Convert.ToString(ds.Tables[0].Rows[0]["User_Code"])).ToArray();
                       

                       
                        if (drParent.Length > 0)
                        {
                            foreach (DataRow dr in drParent)
                            {

                                strTreeContent.Append("<li id='" + Convert.ToString(dr["User_Code"]) + "'  class='expanded' >" + Convert.ToString(dr["User_Name"])
                                + "," + Convert.ToString(dr["User_Type_Name"]) + "(" + Convert.ToString(dr["Region_Name"]) + ")");

                                DataRow[] drUnderUsers = ds.Tables[0].AsEnumerable().Where(b => Convert.ToString(b["Under_User_Code"]) == Convert.ToString(dr["User_Code"])).ToArray();
                                if (drUnderUsers.Length > 0)
                                {
                                    strTreeContent.Append("<ul>");
                                    GenerateFirstLevelChildUserTree(ds, Convert.ToString(dr["User_Code"]));
                                    strTreeContent.Append("</ul>");
                                }
                                strTreeContent.Append("</li>");
                            }
                            strTreeContent.Append("</ul>");
                        }
                    }
                  
                }
                return strTreeContent.ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public void GenerateFirstLevelChildUserTree(DataSet ds, string parentId)
        {
            try
            {
                DataRow[] dr = ds.Tables[0].AsEnumerable().Where(a => Convert.ToString(a["Under_User_Code"]) == parentId
                    && Convert.ToString(a["User_Code"]) != ds.Tables[0].Rows[0]["User_Code"].ToString()).ToArray();
                if (dr.Length > 0)
                {
                    foreach (DataRow drChild in dr)
                    {
                        //if (Convert.ToInt32(drChild["Child_Count"]) > 0)
                        //{
                        //    strTreeContent.Append("<li data='addClass:\"parent\"' id='" + Convert.ToString(drChild["User_Code"]) + "' class='expanded' >");
                        //}
                        //else
                        //{
                        //    strTreeContent.Append("<li id='" + Convert.ToString(drChild["User_Code"]) + "' class='expanded' >");
                        //}

                        DataRow[] drUnderUsers = ds.Tables[0].AsEnumerable().Where(b => Convert.ToString(b["Under_User_Code"])
                            == Convert.ToString(drChild["User_Code"])).ToArray();
                        if (drUnderUsers.Length > 0)
                        {
                            strTreeContent.Append("<li id='" + Convert.ToString(drChild["User_Code"]) + "' class='expanded' >");
                            strTreeContent.Append(Convert.ToString(drChild["User_Name"]) + "," + Convert.ToString(drChild["User_Type_Name"])
                                + "(" + Convert.ToString(drChild["Region_Name"]) + ")");
                            if (Convert.ToString(drChild["User_Code"]) != null)
                            {
                                strTreeContent.Append("<ul>");
                                GenerateSecondLevelUserTreeNew(ds, Convert.ToString(drChild["User_Code"]));
                                strTreeContent.Append("</ul>");
                            }
                        }
                        else
                        {
                            if (Convert.ToInt32(drChild["Child_Count"]) > 1)
                            {
                                strTreeContent.Append("<li data='addClass:\"childIcon\"' id='" + Convert.ToString(drChild["User_Code"]) + "' >");
                            }
                            else
                            {
                                strTreeContent.Append("<li id='" + Convert.ToString(drChild["User_Code"]) + "' class='expanded' >");
                            }
                            strTreeContent.Append(Convert.ToString(drChild["User_Name"]) + "," + Convert.ToString(drChild["User_Type_Name"])
                                + "(" + Convert.ToString(drChild["Region_Name"]) + ")");

                        }
                        strTreeContent.Append("</li>");
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string GetUsersByUserNameEmployeeName(string userName, string treeId, string filterId)
        {
            StringBuilder strContent = new StringBuilder();
            try
            {
                BLUser objUser = new BLUser();
                DataControl.CurrentInfo objCurInfo = new CurrentInfo();
                List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
                lstUser = (List<MVCModels.HiDoctor_Master.UserModel>)objUser.GetUsersByUserNameNew(objCurInfo.GetCompanyCode(), userName, objCurInfo.GetUserCode());
                if (lstUser.Count > 0)
                {
                    strContent.Append("<div class='list-group'>");
                    foreach (MVCModels.HiDoctor_Master.UserModel user in lstUser)
                    {
                        
                        strContent.Append("<li><a href='#' class='list-group-item' onclick='fnGetUserTreeByUserNew(\"" + user.User_Code + "\",\""
                            + treeId + "\",\"" + filterId + "\");'>" + user.Employee_Name + "(" + user.User_Name + ")" + "," + user.User_Type_Name + "," + user.Region_Name + "</li>");
                    }
                    strContent.Append("</div>");
                }
                else
                {
                    strContent.Append("NO_USERS");
                }
            }

            catch (Exception ex)
            {
                strContent.Append("NO_USERS");
            }
            return strContent.ToString();
        }

        public string GetUsersByUserName_TP(string userName, string treeId, string filterId)
        {
            StringBuilder strContent = new StringBuilder();
            try
            {
                BLUser objUser = new BLUser();
                DataControl.CurrentInfo objCurInfo = new CurrentInfo();
                List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
                lstUser = (List<MVCModels.HiDoctor_Master.UserModel>)objUser.GetUsersByUserNameNew(objCurInfo.GetCompanyCode(), userName, objCurInfo.GetUserCode());
                if (lstUser.Count > 0)
                {
                    strContent.Append("<div class='list-group'>");
                    foreach (MVCModels.HiDoctor_Master.UserModel user in lstUser)
                    {

                        strContent.Append("<li><a href='#' class='list-group-item' onclick='fnGetUserTreeBySearchUser(\"" + user.User_Code + "\",\""
                            + treeId + "\",\"" + filterId + "\");'>" + user.Employee_Name + "(" + user.User_Name + ")" + "," + user.User_Type_Name + "," + user.Region_Name + "</li>");
                    }
                    strContent.Append("</div>");
                }
                else
                {
                    strContent.Append("NO_USERS");
                }
            }

            catch (Exception ex)
            {
                strContent.Append("NO_USERS");
            }
            return strContent.ToString();
        }

        public void GenerateSecondLevelUserTreeNew(DataSet ds, string underUserCode)
        {
            try
            {
                DataRow[] dr = ds.Tables[0].AsEnumerable().Where(a => Convert.ToString(a["Under_User_Code"]) == underUserCode &&
                    Convert.ToString(a["User_Code"]) != ds.Tables[0].Rows[0]["User_Code"].ToString()).ToArray();
                if (dr.Length > 0)
                {
                    foreach (DataRow drChild in dr)
                    {
       
                        DataRow[] drr = ds.Tables[0].AsEnumerable().Where(b => Convert.ToString(b["Under_User_Code"]) ==
                            Convert.ToString(drChild["User_Code"])).ToArray();
                        if (drr.Length > 0)
                        {
                            strTreeContent.Append("<li id='" + Convert.ToString(drChild["User_Code"]) + "' class='expanded' >");
                            strTreeContent.Append(Convert.ToString(drChild["User_Name"]) + "," + Convert.ToString(drChild["User_Type_Name"])
                                + "(" + Convert.ToString(drChild["Region_Name"]) + ")");
                            strTreeContent.Append("<ul>");
                            GenerateSecondLevelUserTreeNew(ds, Convert.ToString(drChild["User_Code"]));
                            strTreeContent.Append("</ul>");
                        }
                        else
                        {
                            if (Convert.ToInt32(drChild["Child_Count"]) > 1)
                            {
                                strTreeContent.Append("<li data='addClass:\"childIcon\"' id='" + Convert.ToString(drChild["User_Code"]) + "' >");
                            }
                            else
                            {
                                strTreeContent.Append("<li id='" + Convert.ToString(drChild["User_Code"]) + "' class='expanded' >");
                            }
                            strTreeContent.Append(Convert.ToString(drChild["User_Name"]) + "," + Convert.ToString(drChild["User_Type_Name"])
                                + "(" + Convert.ToString(drChild["Region_Name"]) + ")");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        // DCR Consolidate Report New Tree Generated

        public string UserTreeGenerationByUserCode_New(string userCode, string includeOneLevelParent, string excludeFirstLevel)
        {
            try
            {
               
                strTreeContent = new StringBuilder();
                DataSet ds = new DataSet();
                string LoggedInCompCode = objCurrentInfo.GetCompanyCode();
                string LoggedInuserCode = objCurrentInfo.GetUserCode();
                objData.OpenConnection(objCurrentInfo.GetCompanyCode());
                {
                    ds = objData.ExecuteDataSet("EXEC SP_hd_UM_GetUserTreeDetails_New '" + objCurrentInfo.GetCompanyCode()
                        + "','" + userCode + "','" + includeOneLevelParent + "','" + excludeFirstLevel + "','" + objCurrentInfo.GetUserCode() + "' ");
                }
                if (ds.Tables.Count > 0)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        
                        strTreeContent.Append("<ul  id='home' item-expanded='true'>");
                        DataRow[] drParent = ds.Tables[0].AsEnumerable().Where(a => Convert.ToString(a["User_Code"]) ==
                            Convert.ToString(ds.Tables[0].Rows[0]["User_Code"])).ToArray();
                        if (drParent.Length > 0)
                        {
                            foreach (DataRow dr in drParent)
                            {

                              
                        
                               strTreeContent.Append("<li id='" + Convert.ToString(dr["User_Code"]) + "'  class='expanded' >" + Convert.ToString(dr["Employee_Name"]) + "(" + Convert.ToString(dr["User_Name"]) + ")"
                               + "," + Convert.ToString(dr["User_Type_Name"]) + "," + Convert.ToString(dr["Region_Name"]));
                               
                               

                                DataRow[] drUnderUsers = ds.Tables[0].AsEnumerable().Where(b => Convert.ToString(b["Under_User_Code"]) == Convert.ToString(dr["User_Code"])).ToArray();
                                if (drUnderUsers.Length > 0)
                                {

                                   
                                    strTreeContent.Append("<ul>");
                                    GenerateFirstLevelChildUserTree_New(ds, Convert.ToString(dr["User_Code"]));
                                    strTreeContent.Append("</ul>");
                                

                                }

                               strTreeContent.Append("</li>");
                          
                            }

                            strTreeContent.Append("</ul>");
                        }
                    }
                }
                return strTreeContent.ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string UserTreeGenerationByUserCode_Newmethod(string userCode, string includeOneLevelParent, string excludeFirstLevel)
        {
            try
            {

                strTreeContent = new StringBuilder();
                DataSet ds = new DataSet();
                string LoggedInCompCode = objCurrentInfo.GetCompanyCode();
                string LoggedInuserCode = objCurrentInfo.GetUserCode();
                objData.OpenConnection(objCurrentInfo.GetCompanyCode());
                {
                    ds = objData.ExecuteDataSet("EXEC SP_hd_UM_GetUserTreeDetails_New '" + objCurrentInfo.GetCompanyCode()
                        + "','" + userCode + "','" + includeOneLevelParent + "','" + excludeFirstLevel + "','" + objCurrentInfo.GetUserCode() + "' ");
                }
                if (ds.Tables.Count > 0)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {

                        strTreeContent.Append("<ul  id='home' item-expanded='true'>");
                        DataRow[] drParent = ds.Tables[0].AsEnumerable().Where(a => Convert.ToString(a["User_Code"]) ==
                            Convert.ToString(ds.Tables[0].Rows[0]["User_Code"])).ToArray();
                        if (drParent.Length > 0)
                        {
                            foreach (DataRow dr in drParent)
                            {

                                //if (dr.ItemArray[9].ToString() != LoggedInuserCode)
                                //{

                                    strTreeContent.Append("<li id='" + Convert.ToString(dr["User_Code"]) + "'  class='expanded' >" + Convert.ToString(dr["Employee_Name"]) + "(" + Convert.ToString(dr["User_Name"]) + ")"
                                    + "," + Convert.ToString(dr["User_Type_Name"]) + "," + Convert.ToString(dr["Region_Name"]));
                             //   }


                                DataRow[] drUnderUsers = ds.Tables[0].AsEnumerable().Where(b => Convert.ToString(b["Under_User_Code"]) == Convert.ToString(dr["User_Code"])).ToArray();
                                if (drUnderUsers.Length > 0)
                                {

                                   // strTreeContent.Append("<li  class='expanded' >");

                                    strTreeContent.Append("<ul>");
                                    GenerateFirstLevelChildUserTree_New(ds, Convert.ToString(dr["User_Code"]));
                                    strTreeContent.Append("</ul>");
                                //    strTreeContent.Append("</li>");

                                }

                                strTreeContent.Append("</li>");

                            }

                            strTreeContent.Append("</ul>");
                        }
                    }
                }
                return strTreeContent.ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public void GenerateFirstLevelChildUserTree_New(DataSet ds, string parentId)
        {
            try
            {
                DataRow[] dr = ds.Tables[0].AsEnumerable().Where(a => Convert.ToString(a["Under_User_Code"]) == parentId
                    && Convert.ToString(a["User_Code"]) != ds.Tables[0].Rows[0]["User_Code"].ToString()).ToArray();
                if (dr.Length > 0)
                {
                    foreach (DataRow drChild in dr)
                    {
                         DataRow[] drUnderUsers = ds.Tables[0].AsEnumerable().Where(b => Convert.ToString(b["Under_User_Code"])
                            == Convert.ToString(drChild["User_Code"])).ToArray();
                        if (drUnderUsers.Length > 0)
                        {
                            strTreeContent.Append("<li id='" + Convert.ToString(drChild["User_Code"]) + "' class='expanded' >");
                            strTreeContent.Append(Convert.ToString(drChild["Employee_Name"]) + "(" + Convert.ToString(drChild["User_Name"]) +")" + "," + Convert.ToString(drChild["User_Type_Name"])
                                + "," + Convert.ToString(drChild["Region_Name"]));
                            if (Convert.ToString(drChild["User_Code"]) != null)
                            {
                                strTreeContent.Append("<ul>");
                                GenerateSecondLevelUserTreeNew_New(ds, Convert.ToString(drChild["User_Code"]));
                                strTreeContent.Append("</ul>");
                            }
                        }
                        else
                        {
                            if (Convert.ToInt32(drChild["Child_Count"]) > 1)
                            {
                                strTreeContent.Append("<li data='addClass:\"childIcon\"' id='" + Convert.ToString(drChild["User_Code"]) + "' >");
                            }
                            else
                            {
                                strTreeContent.Append("<li id='" + Convert.ToString(drChild["User_Code"]) + "' class='expanded' >");
                            }
                            strTreeContent.Append(Convert.ToString(drChild["Employee_Name"]) + "(" + Convert.ToString(drChild["User_Name"]) + ")" + "," + Convert.ToString(drChild["User_Type_Name"])
                                + "," + Convert.ToString(drChild["Region_Name"]));

                        }
                        strTreeContent.Append("</li>");
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public void GenerateSecondLevelUserTreeNew_New(DataSet ds, string underUserCode)
        {
            try
            {
                DataRow[] dr = ds.Tables[0].AsEnumerable().Where(a => Convert.ToString(a["Under_User_Code"]) == underUserCode &&
                    Convert.ToString(a["User_Code"]) != ds.Tables[0].Rows[0]["User_Code"].ToString()).ToArray();
                if (dr.Length > 0)
                {
                    foreach (DataRow drChild in dr)
                    {
                        DataRow[] drr = ds.Tables[0].AsEnumerable().Where(b => Convert.ToString(b["Under_User_Code"]) ==
                            Convert.ToString(drChild["User_Code"])).ToArray();
                        if (drr.Length > 0)
                        {
                            strTreeContent.Append("<li id='" + Convert.ToString(drChild["User_Code"]) + "' class='expanded' >");
                            strTreeContent.Append(Convert.ToString(drChild["Employee_Name"]) + "(" + Convert.ToString(drChild["User_Name"]) + ")" + "," + Convert.ToString(drChild["User_Type_Name"])
                                + "," + Convert.ToString(drChild["Region_Name"]));
                            strTreeContent.Append("<ul>");
                            GenerateSecondLevelUserTreeNew_New(ds, Convert.ToString(drChild["User_Code"]));
                            strTreeContent.Append("</ul>");
                        }
                        else
                        {
                            if (Convert.ToInt32(drChild["Child_Count"]) > 1)
                            {
                                strTreeContent.Append("<li data='addClass:\"childIcon\"' id='" + Convert.ToString(drChild["User_Code"]) + "' >");
                            }
                            else
                            {
                                strTreeContent.Append("<li id='" + Convert.ToString(drChild["User_Code"]) + "' class='expanded' >");
                            }
                            strTreeContent.Append(Convert.ToString(drChild["Employee_Name"]) + "(" + Convert.ToString(drChild["User_Name"]) + ")" + "," + Convert.ToString(drChild["User_Type_Name"])
                                + "," + Convert.ToString(drChild["Region_Name"]));
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }



        public string GetUsersJson(string userCode, string includeOneLevelParent, string excludeFirstLevel)
        {
            try
            {
                strTreeContent = new StringBuilder();
                DataSet ds = new DataSet();
                string LoggedInCompCode = objCurrentInfo.GetCompanyCode();
                string LoggedInUserCode = objCurrentInfo.GetUserCode();
                string DQ = @"""";
                objData.OpenConnection(objCurrentInfo.GetCompanyCode());
                {
                    ds = objData.ExecuteDataSet("EXEC SP_hd_UM_GetUserTreeDetails '" + objCurrentInfo.GetCompanyCode()
                       + "','" + userCode + "','" + includeOneLevelParent + "','" + excludeFirstLevel + "'");
                }
                if (ds.Tables.Count > 0)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        DataRow[] drParent = ds.Tables[0].AsEnumerable().Where(a => Convert.ToString(a["User_Code"]) ==
                             Convert.ToString(ds.Tables[0].Rows[0]["User_Code"])).ToArray();
                        if (drParent.Length > 0)
                        {
                            foreach (DataRow dr in drParent)
                            {
                                strTreeContent.Append(DQ + "Title" + DQ + ":" + DQ + Convert.ToString(dr["User_Name"])
                                     + "," + Convert.ToString(dr["User_Type_Name"]) + "(" + Convert.ToString(dr["Region_Name"]) + DQ + ",");
                                strTreeContent.Append(DQ + "Key" + DQ + ":" + DQ + Convert.ToString(dr["User_Code"]) + DQ + "");
                                DataRow[] drUnderUsers = ds.Tables[0].AsEnumerable().Where(b => Convert.ToString(b["Under_User_Code"])
                                    == Convert.ToString(dr["User_Code"])).ToArray();
                                if (drUnderUsers.Length > 0)
                                {
                                    strTreeContent.Append(",");
                                    strTreeContent.Append(DQ + "Children" + DQ + ":[");
                                    GenerateFirstLevelChildUserJson(ds, Convert.ToString(dr["User_Code"]));
                                    strTreeContent.Append("]");
                                }
                            }
                        }
                    }
                }
                return strTreeContent.ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public void GenerateFirstLevelChildUserJson(DataSet ds, string parentId)
        {
            string DQ = @"""";
            try
            {
                //   strTreeContent.Append(",");
                DataRow[] dr = ds.Tables[0].AsEnumerable().Where(a => Convert.ToString(a["Under_User_Code"]) == parentId
                    && Convert.ToString(a["User_Code"]) != ds.Tables[0].Rows[0]["User_Code"].ToString()).ToArray();
                if (dr.Length > 0)
                {
                    foreach (DataRow drChild in dr)
                    {
                        DataRow[] drUnderUsers = ds.Tables[0].AsEnumerable().Where(b => Convert.ToString(b["Under_User_Code"])
                            == Convert.ToString(drChild["User_Code"])).ToArray();
                        if (drUnderUsers.Length > 0)
                        {
                            strTreeContent.Append(DQ + "Title" + DQ + ":" + DQ + Convert.ToString(drChild["User_Name"]) + ","
                                + Convert.ToString(drChild["User_Type_Name"])
                                + "(" + Convert.ToString(drChild["Region_Name"]) + DQ + ",");
                            strTreeContent.Append(DQ + "Key" + DQ + ":" + DQ + Convert.ToString(drChild["User_Code"]) + DQ + "");

                            if (Convert.ToString(drChild["User_Code"]) != null)
                            {
                                strTreeContent.Append(",");
                                strTreeContent.Append(DQ + "Children" + DQ + ":[");
                                GenerateSecondLevelUserJson(ds, Convert.ToString(drChild["User_Code"]));
                                strTreeContent.Append("]");
                            }
                        }
                        else
                        {
                            strTreeContent.Append(DQ + "Title" + DQ + ":" + DQ + Convert.ToString(drChild["User_Name"]) + ","
                               + Convert.ToString(drChild["User_Type_Name"])
                               + "(" + Convert.ToString(drChild["Region_Name"]) + DQ + ",");
                            strTreeContent.Append(DQ + "Key" + DQ + ":" + DQ + Convert.ToString(drChild["User_Code"]) + DQ + "");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public void GenerateSecondLevelUserJson(DataSet ds, string underUserCode)
        {
            string DQ = @"""";
            try
            {
                strTreeContent.Append(",");
                DataRow[] dr = ds.Tables[0].AsEnumerable().Where(a => Convert.ToString(a["Under_User_Code"]) == underUserCode &&
                    Convert.ToString(a["User_Code"]) != ds.Tables[0].Rows[0]["User_Code"].ToString()).ToArray();
                if (dr.Length > 0)
                {
                    foreach (DataRow drChild in dr)
                    {

                        DataRow[] drr = ds.Tables[0].AsEnumerable().Where(b => Convert.ToString(b["Under_User_Code"]) ==
                            Convert.ToString(drChild["User_Code"])).ToArray();
                        if (drr.Length > 0)
                        {
                            strTreeContent.Append(DQ + "Title" + DQ + ":" + DQ + Convert.ToString(drChild["User_Name"]) + ","
                             + Convert.ToString(drChild["User_Type_Name"])
                             + "(" + Convert.ToString(drChild["Region_Name"]) + DQ + ",");
                            strTreeContent.Append(DQ + "Key" + DQ + ":" + DQ + Convert.ToString(drChild["User_Code"]) + DQ + "");

                            strTreeContent.Append(",");
                            strTreeContent.Append(DQ + "Children" + DQ + ":[");
                            GenerateSecondLevelUserJson(ds, Convert.ToString(drChild["User_Code"]));
                            strTreeContent.Append("]");
                        }
                        else
                        {
                            strTreeContent.Append(DQ + "Title" + DQ + ":" + DQ + Convert.ToString(drChild["User_Name"]) + ","
                       + Convert.ToString(drChild["User_Type_Name"])
                       + "(" + Convert.ToString(drChild["Region_Name"]) + DQ + ",");
                            strTreeContent.Append(DQ + "Key" + DQ + ":" + DQ + Convert.ToString(drChild["User_Code"]) + DQ + "");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public JsonResult GetImmediateChildUsers(string userCode)
        {
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            string companyCode = _objCurrentInfo.GetCompanyCode();
            DataControl.BLUser _objBlUser = new DataControl.BLUser();
            List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
            lstUser = (List<MVCModels.HiDoctor_Master.UserModel>)_objBlUser.GetImmediateChildUserForTree(companyCode, userCode);
            return Json(lstUser, JsonRequestBehavior.AllowGet);
        }
        #endregion user tree generation new

        #region region tree generation new
        public string RegionTreeGenerationByRegionCodeforCME(string regionCode, string includeOneLevelParent, string excludeFirstLevel,string divisioncode)
        {
            try
            {
                string regionUserName = string.Empty;
                string title = string.Empty;
                strTreeContent = new StringBuilder();
                DataSet ds = new DataSet();
                string LoggedInCompCode = objCurrentInfo.GetCompanyCode();
                objData.OpenConnection(objCurrentInfo.GetCompanyCode());
                {
                    ds = objData.ExecuteDataSet("EXEC SP_hd_RM_GetRegionTreeDetailsforCME '" + objCurrentInfo.GetCompanyCode()
                        + "','" + regionCode + "','" + includeOneLevelParent + "','" + excludeFirstLevel + "','" + objCurrentInfo.GetRegionCode() + "','"+ divisioncode + "' ");
                }
                if (ds.Tables.Count > 0)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        strTreeContent.Append("<ul  id='home' item-expanded='true'>");
                        DataRow[] drParent = ds.Tables[0].AsEnumerable().Where(a => Convert.ToString(a["Region_Code"]) ==
                        Convert.ToString(ds.Tables[0].Rows[0]["Region_Code"])).ToArray();
                        if (drParent.Length > 0)
                        {
                            foreach (DataRow dr in drParent)
                            {
                                regionUserName = GetUserNameforRegion(ds, Convert.ToString(dr["Region_Code"]));
                                //if (string.IsNullOrEmpty(Convert.ToString(dr["User_Name"])))
                                //{

                                //    // vacantArr.Add(Convert.ToString(dr["Region_Code"]));
                                //    // var vacJson = jsonPath(jsData, "$.Tables[1].Rows[?(@.Region_Code=='" + jsData.Tables[0].Rows[i].Region_Code + "')]");
                                //    DataRow[] drRegion = ds.Tables[1].AsEnumerable().Where(z => Convert.ToString(z["Region_Code"]) ==
                                //        Convert.ToString(dr["Region_Code"])).ToArray();

                                //    // vacant region
                                //    if (drRegion.Length > 0)
                                //    {
                                //        regionUserName = "VACANT";
                                //    }
                                //    else
                                //    {// not assigned region
                                //        regionUserName = "NOT ASSIGNED";
                                //    }
                                //}
                                //else
                                //{
                                //    regionUserName = Convert.ToString(dr["User_Name"]);
                                //}


                                string[] userNameAr;
                                userNameAr = regionUserName.Split(',');
                                for (var a = 0; a < userNameAr.Length; a++)
                                {
                                    title += userNameAr[a] + ",";
                                }
                                title = title.TrimEnd(',');
                                //if (regionUserName.Length > 30)
                                //{
                                //    strTreeContent.Append("<li class='expanded' id='" + Convert.ToString(dr["Region_Code"])
                                //            + "' title='" + title + "'>" + Convert.ToString(dr["Region_Name"])
                                //            + "(" + Convert.ToString(dr["Region_Type_Name"])
                                //            + ")-" + regionUserName.Substring(0, 30) + "...");
                                //}
                                //else
                                //{
                                strTreeContent.Append("<li id='" + Convert.ToString(dr["Region_Code"]) + "' titl='" + title + "'  class='expanded' >" + Convert.ToString(dr["Region_Name"])
                                + "(" + Convert.ToString(dr["Region_Type_Name"]) + ")-" + regionUserName + "");
                                //   }
                                DataRow[] drUnderUsers = ds.Tables[0].AsEnumerable().Where(b => Convert.ToString(b["Under_Region_Code"]) == Convert.ToString(dr["Region_Code"])).ToArray();
                                if (drUnderUsers.Length > 0)
                                {
                                    strTreeContent.Append("<ul>");
                                    GenerateFirstLevelChildRegionTree(ds, Convert.ToString(dr["Region_Code"]));
                                    strTreeContent.Append("</ul>");
                                }
                                strTreeContent.Append("</li>");
                            }
                            strTreeContent.Append("</ul>");
                        }
                    }
                }
                return strTreeContent.ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public string RegionTreeGenerationByRegionCode(string regionCode, string includeOneLevelParent, string excludeFirstLevel)
        {
            try
            {
                string regionUserName = string.Empty;
                string title = string.Empty;
                strTreeContent = new StringBuilder();
                DataSet ds = new DataSet();
                string LoggedInCompCode = objCurrentInfo.GetCompanyCode();
                objData.OpenConnection(objCurrentInfo.GetCompanyCode());
                {
                    ds = objData.ExecuteDataSet("EXEC SP_hd_RM_GetRegionTreeDetails '" + objCurrentInfo.GetCompanyCode()
                        + "','" + regionCode + "','" + includeOneLevelParent + "','" + excludeFirstLevel + "','" + objCurrentInfo.GetRegionCode() + "' ");
                }
                if (ds.Tables.Count > 0)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        strTreeContent.Append("<ul  id='home' item-expanded='true'>");
                        DataRow[] drParent = ds.Tables[0].AsEnumerable().Where(a => Convert.ToString(a["Region_Code"]) ==
                        Convert.ToString(ds.Tables[0].Rows[0]["Region_Code"])).ToArray();
                        if (drParent.Length > 0)
                        {
                            foreach (DataRow dr in drParent)
                            {
                                regionUserName = GetUserNameforRegion(ds, Convert.ToString(dr["Region_Code"]));
                                //if (string.IsNullOrEmpty(Convert.ToString(dr["User_Name"])))
                                //{

                                //    // vacantArr.Add(Convert.ToString(dr["Region_Code"]));
                                //    // var vacJson = jsonPath(jsData, "$.Tables[1].Rows[?(@.Region_Code=='" + jsData.Tables[0].Rows[i].Region_Code + "')]");
                                //    DataRow[] drRegion = ds.Tables[1].AsEnumerable().Where(z => Convert.ToString(z["Region_Code"]) ==
                                //        Convert.ToString(dr["Region_Code"])).ToArray();

                                //    // vacant region
                                //    if (drRegion.Length > 0)
                                //    {
                                //        regionUserName = "VACANT";
                                //    }
                                //    else
                                //    {// not assigned region
                                //        regionUserName = "NOT ASSIGNED";
                                //    }
                                //}
                                //else
                                //{
                                //    regionUserName = Convert.ToString(dr["User_Name"]);
                                //}


                                string[] userNameAr;
                                userNameAr = regionUserName.Split(',');
                                for (var a = 0; a < userNameAr.Length; a++)
                                {
                                    title += userNameAr[a] + ",";
                                }
                                title = title.TrimEnd(',');
                                //if (regionUserName.Length > 30)
                                //{
                                //    strTreeContent.Append("<li class='expanded' id='" + Convert.ToString(dr["Region_Code"])
                                //            + "' title='" + title + "'>" + Convert.ToString(dr["Region_Name"])
                                //            + "(" + Convert.ToString(dr["Region_Type_Name"])
                                //            + ")-" + regionUserName.Substring(0, 30) + "...");
                                //}
                                //else
                                //{
                                    strTreeContent.Append("<li id='" + Convert.ToString(dr["Region_Code"]) + "' titl='" + title + "'  class='expanded' >" + Convert.ToString(dr["Region_Name"])
                                    + "(" + Convert.ToString(dr["Region_Type_Name"]) + ")-" + regionUserName + "");
                             //   }
                                DataRow[] drUnderUsers = ds.Tables[0].AsEnumerable().Where(b => Convert.ToString(b["Under_Region_Code"]) == Convert.ToString(dr["Region_Code"])).ToArray();
                                if (drUnderUsers.Length > 0)
                                {
                                    strTreeContent.Append("<ul>");
                                    GenerateFirstLevelChildRegionTree(ds, Convert.ToString(dr["Region_Code"]));
                                    strTreeContent.Append("</ul>");
                                }
                                strTreeContent.Append("</li>");
                            }
                            strTreeContent.Append("</ul>");
                        }
                    }
                }
                return strTreeContent.ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public void GenerateFirstLevelChildRegionTree(DataSet ds, string parentId)
        {
            string regionUserName = string.Empty;
            string title = string.Empty;
            try
            {
                DataRow[] dr = ds.Tables[0].AsEnumerable().Where(a => Convert.ToString(a["Under_Region_Code"]) == parentId
                    && Convert.ToString(a["Region_Code"]) != ds.Tables[0].Rows[0]["Region_Code"].ToString()).ToArray();
                if (dr.Length > 0)
                {
                    foreach (DataRow drChild in dr)
                    {
                        title = "";
                        DataRow[] drUnderUsers = ds.Tables[0].AsEnumerable().Where(b => Convert.ToString(b["Under_Region_Code"])
                            == Convert.ToString(drChild["Region_Code"])).ToArray();

                        regionUserName = GetUserNameforRegion(ds, Convert.ToString(drChild["Region_Code"]));

                        //if (string.IsNullOrEmpty(Convert.ToString(drChild["User_Name"])))
                        //{

                        //    // vacantArr.Add(Convert.ToString(dr["Region_Code"]));
                        //    // var vacJson = jsonPath(jsData, "$.Tables[1].Rows[?(@.Region_Code=='" + jsData.Tables[0].Rows[i].Region_Code + "')]");
                        //    DataRow[] drRegion = ds.Tables[1].AsEnumerable().Where(z => Convert.ToString(z["Region_Code"]) ==
                        //        Convert.ToString(drChild["Region_Code"])).ToArray();

                        //    // vacant region
                        //    if (drRegion.Length > 0)
                        //    {
                        //        regionUserName = "VACANT";
                        //    }
                        //    else
                        //    {// not assigned region
                        //        regionUserName = "NOT ASSIGNED";
                        //    }
                        //}
                        //else
                        //{
                        //    regionUserName = Convert.ToString(drChild["User_Name"]);
                        //}

                        string[] userNameAr;
                        userNameAr = regionUserName.Split(',');
                        for (var a = 0; a < userNameAr.Length; a++)
                        {
                            title += userNameAr[a] + ",";
                        }
                        title = title.TrimEnd(',');

                        if (drUnderUsers.Length > 0)
                        {
                            strTreeContent.Append("<li id='" + Convert.ToString(drChild["Region_Code"]) + "' title='" + title + "' class='expanded' >");
                            strTreeContent.Append(Convert.ToString(drChild["Region_Name"]) + "(" + Convert.ToString(drChild["Region_Type_Name"])
                                + ")-" + regionUserName + "");
                            if (Convert.ToString(drChild["Region_Code"]) != null)
                            {
                                strTreeContent.Append("<ul>");
                                GenerateSecondLevelRegionTreeNew(ds, Convert.ToString(drChild["Region_Code"]));
                                strTreeContent.Append("</ul>");
                            }
                        }
                        else
                        {
                            if (Convert.ToInt32(drChild["Child_Count"]) > 1)
                            {
                                strTreeContent.Append("<li data='addClass:\"childIcon\"' id='" + Convert.ToString(drChild["Region_Code"]) + "' title='" + title + "'>");
                            }
                            else
                            {
                                strTreeContent.Append("<li id='" + Convert.ToString(drChild["Region_Code"]) + "' class='expanded' title='" + title + "' >");
                            }
                            strTreeContent.Append(Convert.ToString(drChild["Region_Name"]) + "(" + Convert.ToString(drChild["Region_Type_Name"])
                                + ")-" + regionUserName + "");

                        }
                        strTreeContent.Append("</li>");
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public void GenerateSecondLevelRegionTreeNew(DataSet ds, string underregionCode)
        {
            string regionUserName = string.Empty;
            string title = string.Empty;
            try
            {
                DataRow[] dr = ds.Tables[0].AsEnumerable().Where(a => Convert.ToString(a["Under_Region_Code"]) == underregionCode &&
                    Convert.ToString(a["Region_Code"]) != ds.Tables[0].Rows[0]["Region_Code"].ToString()).ToArray();
                if (dr.Length > 0)
                {
                    foreach (DataRow drChild in dr)
                    {
                        title = "";
                        DataRow[] drr = ds.Tables[0].AsEnumerable().Where(b => Convert.ToString(b["Under_Region_Code"]) ==
                            Convert.ToString(drChild["Region_Code"])).ToArray();
                        regionUserName = GetUserNameforRegion(ds, Convert.ToString(drChild["Region_Code"]));


                        //if (string.IsNullOrEmpty(Convert.ToString(drChild["User_Name"])))
                        //{

                        //    // vacantArr.Add(Convert.ToString(dr["Region_Code"]));
                        //    // var vacJson = jsonPath(jsData, "$.Tables[1].Rows[?(@.Region_Code=='" + jsData.Tables[0].Rows[i].Region_Code + "')]");
                        //    DataRow[] drRegion = ds.Tables[1].AsEnumerable().Where(z => Convert.ToString(z["Region_Code"]) ==
                        //        Convert.ToString(drChild["Region_Code"])).ToArray();

                        //    // vacant region
                        //    if (drRegion.Length > 0)
                        //    {
                        //        regionUserName = "VACANT";
                        //    }
                        //    else
                        //    {// not assigned region
                        //        regionUserName = "NOT ASSIGNED";
                        //    }
                        //}
                        //else
                        //{
                        //    regionUserName = Convert.ToString(drChild["User_Name"]);
                        //}

                        string[] userNameAr;
                        userNameAr = regionUserName.Split(',');
                        for (var a = 0; a < userNameAr.Length; a++)
                        {
                            title += userNameAr[a] + ",";
                        }
                        title = title.TrimEnd(',');
                        if (drr.Length > 0)
                        {
                            strTreeContent.Append("<li id='" + Convert.ToString(drChild["Region_Code"]) + "' title='" + title + "' class='expanded' >");
                            strTreeContent.Append(Convert.ToString(drChild["Region_Name"]) + "(" + Convert.ToString(drChild["Region_Type_Name"])
                                + ")-" + regionUserName + ")");
                            strTreeContent.Append("<ul>");
                            GenerateSecondLevelRegionTreeNew(ds, Convert.ToString(drChild["Region_Code"]));
                            strTreeContent.Append("</ul>");
                        }
                        else
                        {
                            if (Convert.ToInt32(drChild["Child_Count"]) > 1)
                            {
                                strTreeContent.Append("<li data='addClass:\"childIcon\"' id='" + Convert.ToString(drChild["Region_Code"]) + "' title='" + title + "' >");
                            }
                            else
                            {
                                strTreeContent.Append("<li id='" + Convert.ToString(drChild["Region_Code"]) + "' class='expanded' title='" + title + "' >");
                            }
                            strTreeContent.Append(Convert.ToString(drChild["Region_Name"]) + "(" + Convert.ToString(drChild["Region_Type_Name"])
                                + ")-" + regionUserName + "");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string GetUserNameforRegion(DataSet ds, string regionCode)
        {
            string regionUserName = string.Empty;
            try
            {
                if (ds.Tables[0].Rows.Count > 0)
                {
                    DataRow[] drParent = ds.Tables[0].AsEnumerable().Where(a => Convert.ToString(a["Region_Code"]) == regionCode).ToArray();
                    foreach (DataRow dr in drParent)
                    {
                        if (string.IsNullOrEmpty(Convert.ToString(dr["User_Name"])))
                        {
                            DataRow[] drRegion = ds.Tables[1].AsEnumerable().Where(z => Convert.ToString(z["Region_Code"]) ==
                                Convert.ToString(dr["Region_Code"])).ToArray();

                            // vacant region
                            if (drRegion.Length > 0)
                            {
                                regionUserName = "VACANT";
                            }
                            else
                            {// not assigned region
                                regionUserName = "NOT ASSIGNED";
                            }
                        }
                        else
                        {
                            regionUserName = Convert.ToString(dr["User_Name"]);
                        }
                        if (regionUserName.Length > 0)
                        {
                            regionUserName = regionUserName.ToString();
                        }
                        //if (regionUserName.Length > 30)
                        //{
                        //    regionUserName = regionUserName.Substring(0, 30) + "...";
                        //}
                        //else
                        //{
                        //    regionUserName = regionUserName.ToString();
                        //}
                    }
                }
            }
            catch
            {
                throw;
            }
            return regionUserName;
        }

        public string GetRegionsByRegionName(string regionName, string treeId, string filterId)
        {
            StringBuilder strContent = new StringBuilder();
            try
            {
                BLRegion _objRegion = new BLRegion();
                DataControl.CurrentInfo objCurInfo = new CurrentInfo();
                List<MVCModels.HiDoctor_Master.RegionModel> lstRegion = new List<MVCModels.HiDoctor_Master.RegionModel>();
                lstRegion = (List<MVCModels.HiDoctor_Master.RegionModel>)_objRegion.GetRegionsbyRegionName(objCurInfo.GetCompanyCode(), regionName, objCurInfo.GetRegionCode());
                if (lstRegion.Count > 0)
                {
                    strContent.Append("<div class='list-group'>");
                    foreach (MVCModels.HiDoctor_Master.RegionModel region in lstRegion)
                    {
                        string regionUserName = string.Empty;
                        if (string.IsNullOrEmpty(region.User_Name))
                        {
                            regionUserName = "VACANT";
                        }

                        //else if (region.User_Name.Length > 30)
                        //{
                        //    regionUserName = region.User_Name.Substring(0, 30) + "...";
                        //}
                        else
                        {
                            regionUserName = region.User_Name;
                        }
                        strContent.Append("<li><a href='#' class='list-group-item' onclick='fnGetRegionTreeByRegion(\"" + region.Region_Code + "\",\""
                            + treeId + "\",\"" + filterId + "\");'>" + region.Region_Name + "," + region.Region_Type_Name + "-" + regionUserName + "</li>");
                    }
                    strContent.Append("</div>");
                }
                else
                {
                    strContent.Append("NO_REGIONS");
                }
            }

            catch (Exception ex)
            {
                strContent.Append("NO_REGIONS");
            }
            return strContent.ToString();
        }

        public string GetRegionsByRegionNameWithCheckBox(string regionName, string treeId, string filterId)
        {
            StringBuilder strContent = new StringBuilder();
            try
            {
                BLRegion _objRegion = new BLRegion();
                DataControl.CurrentInfo objCurInfo = new CurrentInfo();
                List<MVCModels.HiDoctor_Master.RegionModel> lstRegion = new List<MVCModels.HiDoctor_Master.RegionModel>();
                lstRegion = (List<MVCModels.HiDoctor_Master.RegionModel>)_objRegion.GetRegionsbyRegionName(objCurrentInfo.GetCompanyCode(), regionName, objCurInfo.GetRegionCode());
                if (lstRegion.Count > 0)
                {
                    strContent.Append("<div class='list-group'>");
                    //  strContent.Append("<ul id='ulUsers'>");
                    foreach (MVCModels.HiDoctor_Master.RegionModel region in lstRegion)
                    {
                        //strContent.Append("<li onclick='fnGetUserTreeByUser(\"" + user.User_Code + "\",\"" + treeId + "\",\"" + filterId + "\");'>"
                        //                 + user.User_Name + "," + user.User_Type_Name + "(" + user.Region_Name + ")</li>");
                        strContent.Append("<a href='#' class='list-group-item' onclick='fnGetRegionTreeByRegionWithCheckBox(\"" + region.Region_Code + "\",\""
                            + treeId + "\",\"" + filterId + "\");'>" + region.Region_Name + "," + region.Region_Type_Name + "(" + region.Region_Name + ")</li>");
                    }
                    // strContent.Append("</ul>");
                    strContent.Append("</div>");
                }
                else
                {
                    strContent.Append("NO_REGIONS");
                }
            }

            catch (Exception ex)
            {
                strContent.Append("NO_REGIONS");
            }
            return strContent.ToString();
        }

        public JsonResult GetImmediateChildRegions(string regionCode)
        {
            DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
            string companyCode = _objCurrentInfo.GetCompanyCode();
            BLRegion _objBLRegion = new BLRegion();
            List<MVCModels.HiDoctor_Master.RegionModel> lstRegion = new List<MVCModels.HiDoctor_Master.RegionModel>();
            lstRegion = (List<MVCModels.HiDoctor_Master.RegionModel>)_objBLRegion.GetImmediateChildRegionForTree(companyCode, regionCode);
            return Json(lstRegion, JsonRequestBehavior.AllowGet);
        }    


        #endregion region tree generation new
    }
}