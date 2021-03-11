using System;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using Dapper;
using System.Collections.Generic;

namespace DataControl.HiDoctorFactoryClasses
{
    public class DAL_ChangePassword : DapperRepository
    {
        DataControl.SPData _objSPData = new DataControl.SPData();
        DataControl.Data _objData = new DataControl.Data();

        #region constants
        const string SPHDGETPASSWORDHISTORY = "sp_hdGetPasswordHistory";
        #endregion constants

        public IEnumerable<MVCModels.PasswordHistory> GetPasswordHistory(string companyCode, string userCode, string historyCount)
        {
            IEnumerable<MVCModels.PasswordHistory> lstPasswordHis;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@UserCode", userCode);
                    p.Add("@HistoryCount", historyCount);

                    lstPasswordHis = connection.Query<MVCModels.PasswordHistory>(SPHDGETPASSWORDHISTORY, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return lstPasswordHis;
        }

        public bool CheckOldPassWord(string companyCode,string userName,string userPass)
        {
            bool isPasswordExist = false;
            
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    int count = 0;
                    const string selectQry = "SELECT COUNT(1) FROM tbl_SFA_User_Master WHERE Company_Code = @Company_Code AND User_Name = @User_Name AND User_Pass = @User_Pass";

                    count = connection.Query<int>(selectQry, new { Company_Code = companyCode, User_Name = userName, User_Pass = userPass }
                                                    ).Single();

                    if (count > 0)
                    {
                        isPasswordExist = true;
                    }
                    connection.Close();
                }
                return isPasswordExist;
            }
            catch
            {
                throw;
            }
        }

        public bool InsertUserMasterHistory(string companyCode, string userCode)
        {
            int rowsAffected = 0;
            bool isInsert = false;
            string Effectivefrom = "";
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                       Effectivefrom = "(SELECT Convert(varchar,Convert(Date,Effective_From,103)) as Effective_From FROM tbl_SFA_User_Master WHERE Company_Code = @companyCode AND User_Code = @userCode)";
                    Effectivefrom = connection.Query<string>(Effectivefrom, new
                    {
                        companyCode = companyCode,
                        userCode = userCode
                    },
                       transaction: trans).SingleOrDefault();
                    trans.Commit();
                    DateTime dateAndTime = DateTime.Now;
                    DateTime date = dateAndTime.Date;


                    if (Convert.ToDateTime(Effectivefrom) != Convert.ToDateTime(date.Year + "-" + date.Month + "-" + date.Day))
                    {
                        const string insertQry = "INSERT INTO " +
                                                    "tbl_SFA_User_Master_History " +
                                                    "(" +
                                                    "Company_Code,User_Code,Employee_Code,User_Type_Code,Under_User_Code,Effective_From,Effective_To,User_Name,User_Pass," +
                                                    "User_Status,Region_Code,User_Division_Code,User_Category_Code,Expense_Eligibility_Region,Ref_Key1,Ref_Key2,Sync_Made," +
                                                    "Sync_Up_Status,Sync_Down_Status,Sync_Date,Updated_By,Updated_Time,Is_Account_Locked,Account_Locked_DateTime,Account_Released_DateTime," +
                                                    "Account_Released_By,Account_Released_Mode,Edit_Reason,Password_Failure_Count,Last_Password_Updated_Date,Created_Date,Expense_Group_Id," +
                                                    "Row_Version_No,Is_Mobile_Access,HiDOCTOR_Start_Date,User_Id,Under_User_Id,Seq_index,Full_index)" +
                                                "SELECT " +
                                                    "Company_Code,User_Code,Employee_Code,User_Type_Code,Under_User_Code,Effective_From,GETDATE()-1,User_Name,User_Pass," +
                                                    "User_Status,Region_Code,User_Division_Code,User_Category_Code,Expense_Eligibility_Region,Ref_Key1,Ref_Key2,Sync_Made," +
                                                    "Sync_Up_Status,Sync_Down_Status,Sync_Date,Updated_By,Updated_Time,Is_Account_Locked,Account_Locked_DateTime,Account_Released_DateTime," +
                                                    "Account_Released_By,Account_Released_Mode,Edit_Reason,Password_Failure_Count,Last_Password_Updated_Date,Created_Date,Expense_Group_Id," +
                                                    "Row_Version_No,Is_Mobile_Access,HiDOCTOR_Start_Date,User_Id,Under_User_Id,Seq_index,Full_index " +
                                                "FROM " +
                                                    "tbl_SFA_User_Master " +
                                                "WHERE " +
                                                    "User_Code = @User_Code";

                        rowsAffected = connection.Execute(insertQry, new { User_Code = userCode });
                    }
                    if (rowsAffected > 0)
                    {
                        isInsert = true;
                    }
                    else
                    {
                        isInsert = true;
                    }

                    connection.Close();
                  
                }

                return isInsert;
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }
        public bool UpdatePassword(string companyCode, string userCode,string userPass,string userName)
        {
            int rowsAffected = 0;
            bool isPasswordUpdated = false;
            string Effectivefrom ="";
          
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();
                     Effectivefrom = "(SELECT Convert(varchar,Convert(Date,Effective_From,103)) as Effective_From FROM tbl_SFA_User_Master WHERE Company_Code = @Company_Code AND User_Code = @User_Code)";
                    Effectivefrom = connection.Query<string>(Effectivefrom, new
                    {
                        Company_Code = companyCode,
                        User_Code = userCode
                    },

                      transaction: trans).SingleOrDefault();
                    trans.Commit();
                    DateTime dateAndTime = DateTime.Now;
                    DateTime date = dateAndTime.Date;
                 

                    if (Convert.ToDateTime(Effectivefrom) == Convert.ToDateTime(date.Year + "-" + date.Month + "-" + date.Day))
                    {
                        const string insertQry = "UPDATE tbl_SFA_User_Master SET User_Pass = @User_Pass, Last_Password_Updated_Date= GETDATE() , Edit_Reason='PASSWORD CHANGE',Updated_By = @User_Name,Updated_Time = GETDATE()  WHERE Company_Code = @Company_Code AND User_Code = @User_Code";

                        rowsAffected = connection.Execute(insertQry, new { User_Code = userCode, Company_Code = companyCode, User_Pass = userPass, User_Name = userName });
                   }
                    else
                    {
                        const string insertQry = "UPDATE tbl_SFA_User_Master SET User_Pass = @User_Pass, Last_Password_Updated_Date= GETDATE() , Edit_Reason='PASSWORD CHANGE',Updated_By = @User_Name,Updated_Time = GETDATE(),Effective_From = GETDATE(), Effective_To = NULL WHERE Company_Code = @Company_Code AND User_Code = @User_Code";

                        rowsAffected = connection.Execute(insertQry, new { User_Code = userCode, Company_Code = companyCode, User_Pass = userPass, User_Name = userName });

                    }
                    if (rowsAffected > 0)
                    {
                        isPasswordUpdated = true;
                    }

                    connection.Close();
                    
                }

                return isPasswordUpdated;
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public int InsertVisitedScreen(string companyCode, string menuId, string userCode, string dateTime)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    if (menuId.Length < 30)
                    {
                        IDbTransaction trans = connection.BeginTransaction();
                        #region Insert InsertVisitedScreen
                        string query = "INSERT INTO tbl_SFA_Screens_Visited_Statistics(Company_Code,Menu_Id,User_Code,Visited_DateTime) VALUES (@Company_Code,@Menu_Id,@User_Code,@Visited_DateTime)";
                        rowsAffected = connection.Execute(query, new
                        {
                            Company_Code = companyCode,
                            Menu_Id = menuId,
                            User_Code = userCode,
                            Visited_DateTime = dateTime
                        },
                        transaction: trans);
                        #endregion Insert InsertVisitedScreen
                        trans.Commit();
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowsAffected;
        }
    }
}
