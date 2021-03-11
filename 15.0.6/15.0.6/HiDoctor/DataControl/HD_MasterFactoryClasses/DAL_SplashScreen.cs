using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MVCModels;
using System.Data;
using System.Data.SqlClient;
using Dapper;

namespace DataControl.HD_MasterFactoryClasses
{
    class DAL_SplashScreen : DapperRepository
    {
        DataControl.Data _objData = new DataControl.Data();
        SPData _objSPData = new SPData();

        const string SP_SC_INSERT_SPLASH_SCREEN_DATA = "SP_SC_Insert_Splash_Screen_Data";
        const string SP_SC_UPDATE_SPLASH_SCREEN_DATA = "SP_SC_Update_Splash_Screen_Data";
        const string SP_SC_GET_SPLASH_SCREEN_DATA = "SP_SC_Get_Splash_Screen_Data";
        const string SP_SC_GET_TODAYS_SPLASH_SCREEN = "SP_SC_Get_Todays_Splash_Screen";
        const string SP_SC_CHANGE_SPLASH_SCREEN_STATUS = "SP_SC_Change_Splash_Screen_Status";
        const string SP_SC_GET_SPLASH_SCREEN_DATA_FOR_EDIT = "SP_SC_Get_Splash_Screen_Data_For_Edit";
        const string SP_SC_CHECK_OVERLAPPING_SPLASH = "SP_SC_Check_Overlapping_Splash";
        const string SP_SC_CHECK_OVERLAPPING_SPLASH_EDIT = "SP_SC_Check_Overlapping_Splash_Edit";
        const string Active = "Active";
        const string Inactive = "Inactive";
        const string USP_HD_GetSelectedUserTypeCodes = "USP_HD_GetSelectedUserTypeCodes";
        const string USP_HD_GetSelectedGroupUserCodes = "USP_HD_GetSelectedGroupUserCodes";
        const string USP_HD_GETCHILDDIVISIONSBYUSER = "usp_hd_GetChildDivisionsByUser";
        const string USP_HD_GETCHILDUSERTYPESBYUSER = "usp_hd_GetChildUserTypesByUser";
        const string USP_HD_GETGROUPDETAILS = "USP_HD_GetGroupDetails";
        const string USP_HD_GETCHILDUSERBYDIVISIONANDUT = "usp_hd_GetChildUserByDivisionandUT";
        const string USP_HD_GETSPLASHMAPPEDUSERS = "usp_hd_GetSplashMappedUsers";


        public int CheckOverlappingSplashScreenData(string companyCode, SplashScreenModel objSplashScreenModel)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_SC_CHECK_OVERLAPPING_SPLASH);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Date_From", ParameterDirection.Input, SqlDbType.Date, 30, objSplashScreenModel.Date_From);
                _objSPData.AddParamToSqlCommand(command, "@Date_To", ParameterDirection.Input, SqlDbType.Date, 30, objSplashScreenModel.Date_To);

                int count = _objData.GetIntegerValue(companyCode, command);

                return count;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int CheckOverlappingSplashScreenDataForEdit(string companyCode, SplashScreenModel objSplashScreenModel)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_SC_CHECK_OVERLAPPING_SPLASH_EDIT);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@Splash_Screen_Id", ParameterDirection.Input, SqlDbType.Int, 30, objSplashScreenModel.Splash_Screen_Id);
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Date_From", ParameterDirection.Input, SqlDbType.Date, 30, objSplashScreenModel.Date_From);
                _objSPData.AddParamToSqlCommand(command, "@Date_To", ParameterDirection.Input, SqlDbType.Date, 30, objSplashScreenModel.Date_To);

                int count = _objData.GetIntegerValue(companyCode, command);

                return count;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int InsertSplashScreenData(string companyCode, SplashScreenModel objSplashScreenModel)
        {
            int result = 0;
            try
            {
                SqlCommand command = new SqlCommand(SP_SC_INSERT_SPLASH_SCREEN_DATA);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Splash_Type", ParameterDirection.Input, SqlDbType.VarChar, 150, objSplashScreenModel.Splash_Type);
                _objSPData.AddParamToSqlCommand(command, "@Title", ParameterDirection.Input, SqlDbType.VarChar, 150, objSplashScreenModel.Title);
                _objSPData.AddParamToSqlCommand(command, "@Description", ParameterDirection.Input, SqlDbType.VarChar, 1000, objSplashScreenModel.Description);
                _objSPData.AddParamToSqlCommand(command, "@File_Path", ParameterDirection.Input, SqlDbType.VarChar, 250, objSplashScreenModel.File_Path);
                _objSPData.AddParamToSqlCommand(command, "@Date_From", ParameterDirection.Input, SqlDbType.Date, 30, objSplashScreenModel.Date_From);
                _objSPData.AddParamToSqlCommand(command, "@Date_To", ParameterDirection.Input, SqlDbType.Date, 30, objSplashScreenModel.Date_To);
                _objSPData.AddParamToSqlCommand(command, "@Has_Attachment", ParameterDirection.Input, SqlDbType.Int, 4, objSplashScreenModel.Has_Attachment);
                _objSPData.AddParamToSqlCommand(command, "@Mobile_Attachment_Url", ParameterDirection.Input, SqlDbType.VarChar, 250, objSplashScreenModel.Mobile_Attachment_Url);
                _objSPData.AddParamToSqlCommand(command, "@Assigned_To_All_Users", ParameterDirection.Input, SqlDbType.Int, 4, objSplashScreenModel.Assigned_To_All_Users);
                _objSPData.AddParamToSqlCommand(command, "@Is_Completed", ParameterDirection.Input, SqlDbType.Int, 4, objSplashScreenModel.Is_Completed);
                _objSPData.AddParamToSqlCommand(command, "@Last_Modified_DateTime", ParameterDirection.Input, SqlDbType.DateTime, 20, objSplashScreenModel.Last_Modified_DateTime);
                _objSPData.AddParamToSqlCommand(command, "@Description_HTML", ParameterDirection.Input, SqlDbType.VarChar, -1, objSplashScreenModel.Description_HTML);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.Int);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                result = Convert.ToInt32(returnValue.Value);
                return result;

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

        public bool UpdateSplashScreenData(string companyCode, SplashScreenModel objSplashScreenModel)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_SC_UPDATE_SPLASH_SCREEN_DATA);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Splash_Screen_Id", ParameterDirection.Input, SqlDbType.Int, 30, objSplashScreenModel.Splash_Screen_Id);
                _objSPData.AddParamToSqlCommand(command, "@Splash_Type", ParameterDirection.Input, SqlDbType.VarChar, 150, objSplashScreenModel.Splash_Type);
                _objSPData.AddParamToSqlCommand(command, "@Title", ParameterDirection.Input, SqlDbType.VarChar, 150, objSplashScreenModel.Title);
                _objSPData.AddParamToSqlCommand(command, "@Description", ParameterDirection.Input, SqlDbType.VarChar, 1000, objSplashScreenModel.Description);
                _objSPData.AddParamToSqlCommand(command, "@File_Path", ParameterDirection.Input, SqlDbType.VarChar, 250, objSplashScreenModel.File_Path);
                _objSPData.AddParamToSqlCommand(command, "@Date_From", ParameterDirection.Input, SqlDbType.Date, 30, objSplashScreenModel.Date_From);
                _objSPData.AddParamToSqlCommand(command, "@Date_To", ParameterDirection.Input, SqlDbType.Date, 30, objSplashScreenModel.Date_To);
                _objSPData.AddParamToSqlCommand(command, "@Has_Attachment", ParameterDirection.Input, SqlDbType.Int, 4, objSplashScreenModel.Has_Attachment);
                _objSPData.AddParamToSqlCommand(command, "@Mobile_Attachment_Url", ParameterDirection.Input, SqlDbType.VarChar, 250, objSplashScreenModel.Mobile_Attachment_Url);
                _objSPData.AddParamToSqlCommand(command, "@Assigned_To_All_Users", ParameterDirection.Input, SqlDbType.Int, 4, objSplashScreenModel.Assigned_To_All_Users);
                _objSPData.AddParamToSqlCommand(command, "@Is_Completed", ParameterDirection.Input, SqlDbType.Int, 4, objSplashScreenModel.Is_Completed);
                _objSPData.AddParamToSqlCommand(command, "@Last_Modified_DateTime", ParameterDirection.Input, SqlDbType.DateTime, 20, objSplashScreenModel.Last_Modified_DateTime);
                _objSPData.AddParamToSqlCommand(command, "@Description_HTML", ParameterDirection.Input, SqlDbType.VarChar, -1, objSplashScreenModel.Description_HTML);

                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);

                return true;
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

        public bool ChangeSplashScreenStatus(string companyCode, int splashScreenId, bool statusToBeChanged)
        {
            try
            {
                SqlCommand command = new SqlCommand(SP_SC_CHANGE_SPLASH_SCREEN_STATUS);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Splash_Screen_Id", ParameterDirection.Input, SqlDbType.Int, 30, splashScreenId);
                _objSPData.AddParamToSqlCommand(command, "@Status_To_Be_Changed", ParameterDirection.Input, SqlDbType.Bit, 30, statusToBeChanged);

                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);

                return true;
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

        public List<SplashScreenModel> GetSplashScreenData(string companyCode)
        {
            SqlConnection objSqlConnection = new SqlConnection();

            try
            {
                objSqlConnection = _objData.GetConnectionObject(companyCode);

                SqlCommand command = new SqlCommand(SP_SC_GET_SPLASH_SCREEN_DATA);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);

                List<SplashScreenModel> lstSplashScreenModel = new List<SplashScreenModel>();
                SplashScreenModel objSplashScreenModel;

                objSqlConnection.Open();

                command.Connection = objSqlConnection;

                using (SqlDataReader sqlReader = command.ExecuteReader())
                {
                    if (sqlReader.HasRows)
                    {
                        while (sqlReader.Read())
                        {
                            objSplashScreenModel = new SplashScreenModel();

                            objSplashScreenModel.Splash_Screen_Id = Convert.ToInt32(sqlReader["Splash_Screen_Id"].ToString().Trim());
                            objSplashScreenModel.Title = sqlReader["Title"].ToString().Trim();
                            objSplashScreenModel.Description = sqlReader["Description"].ToString().Trim();
                            objSplashScreenModel.File_Path = sqlReader["File_Path"].ToString().Trim();
                            objSplashScreenModel.Date_From = Convert.ToDateTime(sqlReader["Date_From"].ToString().Trim());
                            objSplashScreenModel.Date_To = Convert.ToDateTime(sqlReader["Date_To"].ToString().Trim());
                            objSplashScreenModel.Record_Status = Convert.ToBoolean(sqlReader["Record_Status"].ToString().Trim());
                            objSplashScreenModel.Has_Attachment = Convert.ToBoolean(sqlReader["Has_Attachment"].ToString().Trim());

                            if (Convert.ToBoolean(sqlReader["Record_Status"].ToString().Trim()) == true)
                            {
                                objSplashScreenModel.Record_Status_Display_Name = Active;
                            }
                            else
                            {
                                objSplashScreenModel.Record_Status_Display_Name = Inactive;
                            }

                            lstSplashScreenModel.Add(objSplashScreenModel);
                        }
                    }
                }

                return lstSplashScreenModel;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objSqlConnection.Close();
            }
        }

        public SplashScreenModel GetSplashScreenDataForEdit(string companyCode, int splashScreenId)
        {
            SqlConnection objSqlConnection = new SqlConnection();

            try
            {
                objSqlConnection = _objData.GetConnectionObject(companyCode);

                SqlCommand command = new SqlCommand(SP_SC_GET_SPLASH_SCREEN_DATA_FOR_EDIT);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Splash_Screen_Id", ParameterDirection.Input, SqlDbType.Int, 30, splashScreenId);

                SplashScreenModel objSplashScreenModel = new SplashScreenModel();

                objSqlConnection.Open();

                command.Connection = objSqlConnection;

                using (SqlDataReader sqlReader = command.ExecuteReader())
                {
                    if (sqlReader.HasRows)
                    {
                        while (sqlReader.Read())
                        {
                            objSplashScreenModel = new SplashScreenModel();

                            objSplashScreenModel.Splash_Screen_Id = Convert.ToInt32(sqlReader["Splash_Screen_Id"].ToString().Trim());
                            objSplashScreenModel.Splash_Type = sqlReader["Splash_Type"].ToString().Trim();
                            objSplashScreenModel.Title = sqlReader["Title"].ToString().Trim();
                            objSplashScreenModel.Description = sqlReader["Description"].ToString().Trim();
                            objSplashScreenModel.File_Path = sqlReader["File_Path"].ToString().Trim();
                            objSplashScreenModel.Date_From = Convert.ToDateTime(sqlReader["Date_From"].ToString().Trim());
                            objSplashScreenModel.Date_To = Convert.ToDateTime(sqlReader["Date_To"].ToString().Trim());
                            objSplashScreenModel.Record_Status = Convert.ToBoolean(sqlReader["Record_Status"].ToString().Trim());
                            objSplashScreenModel.Mobile_Attachment_Url = Convert.ToString(sqlReader["Mobile_Attachment_Url"].ToString().Trim());
                            objSplashScreenModel.Description_HTML = Convert.ToString(sqlReader["Description_HTML"]).Trim();
                            objSplashScreenModel.Has_Attachment = Convert.ToBoolean(sqlReader["Has_Attachment"].ToString().Trim());
                            objSplashScreenModel.Company_Code = companyCode.ToLower();


                            if (Convert.ToBoolean(sqlReader["Record_Status"].ToString().Trim()) == true)
                            {
                                objSplashScreenModel.Record_Status_Display_Name = Active;
                            }
                            else
                            {
                                objSplashScreenModel.Record_Status_Display_Name = Inactive;
                            }

                        }
                    }
                }

                return objSplashScreenModel;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objSqlConnection.Close();
            }
        }

        public IEnumerable<SplashScreenModel> GetTodaysSplashScreen(string companyCode, string userCode)
        {
            //SqlConnection objSqlConnection = new SqlConnection();

            //try
            //{
            IEnumerable<MVCModels.SplashScreenModel> lstSplash;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    lstSplash = connection.Query<MVCModels.SplashScreenModel>(SP_SC_GET_TODAYS_SPLASH_SCREEN, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }


            //objSqlConnection = _objData.GetConnectionObject(companyCode);

            //SqlCommand command = new SqlCommand(SP_SC_GET_TODAYS_SPLASH_SCREEN);
            //command.CommandType = CommandType.StoredProcedure;

            //_objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);

            //SplashScreenModel objSplashScreenModel = new SplashScreenModel();

            //objSqlConnection.Open();

            //command.Connection = objSqlConnection;

            //using (SqlDataReader sqlReader = command.ExecuteReader())
            //{
            //    if (sqlReader.HasRows)
            //    {
            //        while (sqlReader.Read())
            //        {
            //            objSplashScreenModel = new SplashScreenModel();

            //            objSplashScreenModel.Splash_Screen_Id = Convert.ToInt32(sqlReader["Splash_Screen_Id"].ToString().Trim());
            //            objSplashScreenModel.Title = sqlReader["Title"].ToString().Trim();
            //            objSplashScreenModel.Description = sqlReader["Description"].ToString().Trim();
            //            objSplashScreenModel.File_Path = sqlReader["File_Path"].ToString().Trim();
            //        }
            //    }
            //}

            //return objSplashScreenModel;
            //}
            //catch (Exception ex)
            //{
            //    throw ex;
            //}
            return lstSplash;
        }

        public int InsertSplashUsers(List<MVCModels.SplashUsersModel> lstSplashUsers, int splashId, string Splashtype, string companyCode, string mode)
        {
            int rowsAffected = 0;
            StringBuilder QueryBuilder = new StringBuilder();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Splash_Screen_Id", splashId);
                    p.Add("@Splash_Type", Splashtype);
                    //if (mode == "R")
                    //{
                    QueryBuilder.Append("SELECT COUNT(1) FROM tbl_SFA_Splash_Screen_Users where Company_Code=@Company_Code and Splash_Screen_Id=@Splash_Screen_Id");
                    int count = connection.Query<int>(QueryBuilder.ToString(), p, transaction: trans).Single();
                    if (count > 0)
                    {
                        QueryBuilder.Clear();
                        QueryBuilder.Append("UPDATE tbl_SFA_Splash_Screen ");
                        QueryBuilder.Append("SET Splash_Type = @Splash_Type ");
                        QueryBuilder.Append("WHERE Company_Code=@Company_Code and Splash_Screen_Id=@Splash_Screen_Id");
                        rowsAffected = connection.Execute(QueryBuilder.ToString(), lstSplashUsers, transaction: trans);

                        QueryBuilder.Clear();
                        QueryBuilder.Append("INSERT INTO tbl_SFA_Splash_Screen_Users_History SELECT Company_Code,Splash_Screen_Id,User_Id,GETUTCDATE() FROM tbl_SFA_Splash_Screen_Users WHERE Company_Code=@Company_Code and Splash_Screen_Id=@Splash_Screen_Id");
                        rowsAffected = connection.Execute(QueryBuilder.ToString(), p, transaction: trans);
                        QueryBuilder.Clear();
                        if (rowsAffected > 0)
                        {
                            QueryBuilder.Append("DELETE FROM tbl_SFA_Splash_Screen_Users where Company_Code=@Company_Code and Splash_Screen_Id=@Splash_Screen_Id");
                            rowsAffected = connection.Execute(QueryBuilder.ToString(), p, transaction: trans);
                            QueryBuilder.Clear();
                            if (rowsAffected > 0)
                            {
                                QueryBuilder.Append("INSERT INTO tbl_SFA_Splash_Screen_Users ");
                                QueryBuilder.Append("(Company_Code,Splash_Screen_Id,User_Id) ");
                                QueryBuilder.Append(" VALUES (@Company_Code,@Splash_Screen_Id,@User_Id)");
                                rowsAffected = connection.Execute(QueryBuilder.ToString(), lstSplashUsers, transaction: trans);
                                QueryBuilder.Clear();
                            }
                            if (mode == "R")
                            {
                                QueryBuilder.Append("UPDATE tbl_SFA_Splash_Screen ");
                                QueryBuilder.Append("SET Assigned_To_All_Users=1 ");
                                QueryBuilder.Append("WHERE Company_Code=@Company_Code and Splash_Screen_Id=@Splash_Screen_Id");
                                rowsAffected = connection.Execute(QueryBuilder.ToString(), lstSplashUsers, transaction: trans);
                            }
                        }
                    }
                    else
                    {
                        QueryBuilder.Clear();
                        QueryBuilder.Append("INSERT INTO tbl_SFA_Splash_Screen_Users ");
                        QueryBuilder.Append("(Company_Code,Splash_Screen_Id,User_Id) ");
                        QueryBuilder.Append(" VALUES (@Company_Code,@Splash_Screen_Id,@User_Id)");

                        rowsAffected = connection.Execute(QueryBuilder.ToString(), lstSplashUsers, transaction: trans, commandTimeout: 120);
                    }
                    //}
                    //else
                    //{
                    //    QueryBuilder.Clear();
                    //    QueryBuilder.Append("INSERT INTO tbl_SFA_Splash_Screen_Users ");
                    //    QueryBuilder.Append("(Company_Code,Splash_Screen_Id,User_Id) ");
                    //    QueryBuilder.Append(" VALUES (@Company_Code,@Splash_Screen_Id,@User_Id)");

                    //    rowsAffected = connection.Execute(QueryBuilder.ToString(), lstSplashUsers, transaction: trans);
                    //}
                    trans.Commit();
                    return rowsAffected;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return 0;
            }
        }

        public IEnumerable<MVCModels.HiDoctor_Master.UserTypeSplashModel> GetselectedUserTypes(string companyCode, string userCode, DataTable dtdivisionCodes, DataTable dtUserTypeCodes)
        {
            List<MVCModels.HiDoctor_Master.UserTypeSplashModel> lstUsertypes = new List<MVCModels.HiDoctor_Master.UserTypeSplashModel>();
            SqlConnection objSqlConnection = new SqlConnection();
            try
            {
                objSqlConnection = _objData.GetConnectionObject(companyCode);
                //lstUsertypes = connection.Query<MVCModels.HiDoctor_Master.UserTypeSplashModel>(USP_HD_GetSelectedUserTypeCodes, p, commandType: CommandType.StoredProcedure);
                string commtxt = "USP_HD_GetSelectedUserTypeCodes";
                SqlCommand command = new SqlCommand(commtxt);
                command.CommandType = CommandType.StoredProcedure;
                SqlDataReader sqlReader;
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);

                if (dtUserTypeCodes.Rows.Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_UserTypeCode", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_UserTypeCode");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_UserTypeCode", ParameterDirection.Input, SqlDbType.Structured, dtUserTypeCodes, "TVP_UserTypeCode");
                }

                if (dtdivisionCodes.Rows.Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DivisionCode", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_DivisionCode");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DivisionCode", ParameterDirection.Input, SqlDbType.Structured, dtdivisionCodes, "TVP_DivisionCode");
                }

                objSqlConnection.Open();
                command.Connection = objSqlConnection;
                using (sqlReader = _objData.ExecuteReader(command))
                {
                    while (sqlReader.Read())
                    {
                        MVCModels.HiDoctor_Master.UserTypeSplashModel lstUsertypecodes = new MVCModels.HiDoctor_Master.UserTypeSplashModel();
                        lstUsertypecodes.User_Code = sqlReader["User_Code"].ToString();
                        lstUsertypes.Add(lstUsertypecodes);
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstUsertypes;
        }

        public IEnumerable<MVCModels.HiDoctor_Master.DivisionModel> GetUnderDivisions(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.DivisionModel> lstRegions;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    lstRegions = connection.Query<MVCModels.HiDoctor_Master.DivisionModel>(USP_HD_GETCHILDDIVISIONSBYUSER, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstRegions;
        }
        public IEnumerable<MVCModels.HiDoctor_Master.UserTypeModel> GetUnderUserTypes(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.UserTypeModel> lstRegions;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    lstRegions = connection.Query<MVCModels.HiDoctor_Master.UserTypeModel>(USP_HD_GETCHILDUSERTYPESBYUSER, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstRegions;
        }

        public IEnumerable<MVCModels.HiDoctor_Master.GroupDetails> GetGroupDetails(string UserName)
        {
            IEnumerable<MVCModels.HiDoctor_Master.GroupDetails> lstGroup;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Name", UserName);
                    lstGroup = connection.Query<MVCModels.HiDoctor_Master.GroupDetails>(USP_HD_GETGROUPDETAILS, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstGroup;
        }

        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetUnderUsersByDivisionAndUT(string companyCode, string userCode, string divisionCodes, string userTypeCodes)
        {
            IEnumerable<MVCModels.HiDoctor_Master.UserModel> lstUser;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    p.Add("@Division_Code", divisionCodes);
                    p.Add("@User_Type_Code", userTypeCodes);
                    lstUser = connection.Query<MVCModels.HiDoctor_Master.UserModel>(USP_HD_GETCHILDUSERBYDIVISIONANDUT, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstUser;
        }

        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetSplashMappedUsers(string companyCode, int splashId)
        {
            IEnumerable<MVCModels.HiDoctor_Master.UserModel> lstUser;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Splash_Id", splashId);
                    lstUser = connection.Query<MVCModels.HiDoctor_Master.UserModel>(USP_HD_GETSPLASHMAPPEDUSERS, p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstUser;
        }

        public IEnumerable<MVCModels.HiDoctor_Master.GroupDetails> GetselectedGroupCodes(string companyCode, DataTable dtGroupcodes)
        {
            List<MVCModels.HiDoctor_Master.GroupDetails> lstGroupcodes = new List<MVCModels.HiDoctor_Master.GroupDetails>();
            SqlConnection objSqlConnection = new SqlConnection();
            try
            {
                objSqlConnection = _objData.GetConnectionObject(companyCode);
                string commtxt = "USP_HD_GetSelectedGroupUserCodes";
                SqlCommand command = new SqlCommand(commtxt);
                command.CommandType = CommandType.StoredProcedure;
                SqlDataReader sqlReader;

                if (dtGroupcodes.Rows.Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_GroupUserCode", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_GroupUserCode");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_GroupUserCode", ParameterDirection.Input, SqlDbType.Structured, dtGroupcodes, "TVP_GroupUserCode");
                }
                objSqlConnection.Open();
                command.Connection = objSqlConnection;
                using (sqlReader = _objData.ExecuteReader(command))
                {
                    while (sqlReader.Read())
                    {
                        MVCModels.HiDoctor_Master.GroupDetails lstGroupusercodes = new MVCModels.HiDoctor_Master.GroupDetails();
                        lstGroupusercodes.User_Code = sqlReader["User_Code"].ToString();
                        lstGroupcodes.Add(lstGroupusercodes);
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstGroupcodes;
        }
    }
}
