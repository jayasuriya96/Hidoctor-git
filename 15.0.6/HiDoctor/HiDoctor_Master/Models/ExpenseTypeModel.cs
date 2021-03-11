using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Configuration;
using System.Data;
using System.ComponentModel.DataAnnotations;
using HiDoctor_Master.Controllers;
using ElmahWrapper;

namespace HiDoctor_Master.Models
{
    public class ExpenseTypeModel
    {
        DataControl.Data objData = new DataControl.Data();
        SqlConnection con = new SqlConnection();
       DataControl.CurrentInfo objCurrentInfo = new DataControl.CurrentInfo();

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
            }
        }

        [Required]
        [RegularExpression(@"^[a-zA-Z\s]+", ErrorMessage = "Use letters only please")]
        [Display(Name = "Expense Type Name")]
        public string ExpenseTypeName { get; set; }
        [Required]
        [Display(Name = "Expense Mode")]
        public string ExpenseMode { get; set; }
        public string Period { get; set; }
        public string ExpenseTypestatus { get; set; }
        public string ExpensetypeCode { get; set; }
        public string ExpenseTypestatusname { get; set; }
        [Display(Name = "Display Order")]
        public string DisplayOrder { get; set; } 




        public string ExpenseInsert(string storedProcedure, string expensetypeCode, string companyCode, string expensetypeName, string expensetypeStatus, string expenseMode,
           string Period, string Mode, string displayOrder)
        {
            try
            {
               DataControl.CurrentInfo objCurentInfo = new DataControl.CurrentInfo();
                //string conStr = objData.GetConnectionString(objCurentInfo.GetCompanyCode());
                //con.ConnectionString = conStr;

               DataControl.Data db = new DataControl.Data();


                // Command - specify as StoredProcedure
                SqlCommand command = new SqlCommand(storedProcedure, con);
                command.CommandType = CommandType.StoredProcedure;

                AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                AddParamToSqlCommand(command, "@Expense_Type_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, expensetypeCode);
                AddParamToSqlCommand(command, "@Expense_Type_Name", ParameterDirection.Input, SqlDbType.VarChar, 50, expensetypeName);
                AddParamToSqlCommand(command, "@Expense_Type_Status", ParameterDirection.Input, SqlDbType.VarChar, 30, expensetypeStatus);
                AddParamToSqlCommand(command, "@Expense_Mode", ParameterDirection.Input, SqlDbType.VarChar, 30, expenseMode);
                AddParamToSqlCommand(command, "@Expense_Period", ParameterDirection.Input, SqlDbType.VarChar, 30, Period);
                AddParamToSqlCommand(command, "@Mode", ParameterDirection.Input, SqlDbType.VarChar, 30, Mode);
                AddParamToSqlCommand(command, "@DisplayOrder", ParameterDirection.Input, SqlDbType.VarChar, 30, displayOrder);


                // Return value as parameter
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);

                if (db.OpenConnection(objCurentInfo.GetCompanyCode()))
                {
                    // Execute the stored procedure
                    db.ExecuteNonQuery(command);
                    db.CloseConnection();
                }

                //For Handle the Error

                return returnValue.Value.ToString();

            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "ExpenseInsert()");
                return "ERROR";
            }

        }

        public DataSet GetAllExpense()
        {
            DataSet dssub = new DataSet();
            objData.OpenConnection(objCurrentInfo.GetCompanyCode());
            {
                string StrSQL = "EXEC SP_hd_ExpenseType_Select " + objCurrentInfo.GetCompanyCode();
                dssub = objData.ExecuteDataSet(StrSQL);
                objData.CloseConnection();
            }

            return dssub;
        }


    }




}