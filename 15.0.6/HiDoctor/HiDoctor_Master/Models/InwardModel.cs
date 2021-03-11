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
    public class InwardModel
    {
        DataControl.Data objData = new DataControl.Data();
        SqlConnection con = new SqlConnection();

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

    
       DataControl.CurrentInfo objCurrentInfo = new DataControl.CurrentInfo();

        public string ProductTypeName { get; set; }
        public string ProductName { get; set; }
        public string CurrentStock { get; set; }
        public string UserCode { get; set; }
        public string ProductCode { get; set; }
        public string Username { get; set; }
        public string InwardDate{ get; set; }
        public string InwardQuantity { get; set; }
        public string ThenStock { get; set; }
        public string UserinwardCode { get; set; }
        public string UserinwardDetails { get; set; }
        public string product { get; set; }
        public string count { get; set; }
        public int Effective_Status { get; set; }
        public string Inward(string storedProcedure, string companyCode, string UserCode, string ProductCode, string InwardDate, string Inwardstock,string UserInwardCode,string UserInwarddetails,string CurrentStock)
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
                AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, UserCode);
                AddParamToSqlCommand(command, "@Product_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, ProductCode);
                AddParamToSqlCommand(command, "@Inward_Date", ParameterDirection.Input, SqlDbType.VarChar, 30, InwardDate);
                AddParamToSqlCommand(command, "@Inward_stock", ParameterDirection.Input, SqlDbType.VarChar, 30, Inwardstock);
                AddParamToSqlCommand(command, "@User_Inward_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, UserInwardCode);
                AddParamToSqlCommand(command, "@User_Inward_Detail", ParameterDirection.Input, SqlDbType.VarChar, 30, UserInwarddetails);
                AddParamToSqlCommand(command, "@Current_Stock", ParameterDirection.Input, SqlDbType.VarChar, 30, CurrentStock);
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
                ErrorLog.LogError(ex, "Inward()");
                return "ERROR";
            }

        }



    }

    public class InwardBatch
    {
        public int UPB_ID { get; set; }
        public string Product_Code { get; set; }
        public string Batch_Number { get; set; }
        public int Current_Stock { get; set; }
        public string Inward_Date { get; set; }
        public int Inward_Stock { get; set; }
        public int Batch_Status { get; set; }
        public string Effective_From { get; set; }
        public string Effective_To { get; set; }
        public string Expiry_Date { get; set; }
        public int Effective_Status { get; set; }
    }
}