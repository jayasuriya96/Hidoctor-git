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
   
    public class SalestypeMapping
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

        public string ProductName { get; set; }
        public string Productcode { get; set; }
        public string BrandName { get; set; }
        public string SpecialityName { get; set; }
        public string ProductTypeName{ get; set; }
        public string CompetitorName{ get; set; }
        public string UOMName{ get; set; }
        public string UOMTypeName{ get; set; }
        public string SalesMappingcode{ get; set; }
        public string productInsert(string storedProcedure, string companyCode, string salesproductCode, string mappingproductCode, string effectiveFrom, string createdDate,string createdBy, string recordStatus)
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
                AddParamToSqlCommand(command, "@Sales_Product_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, salesproductCode);
                AddParamToSqlCommand(command, "@Mapping_Product_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, mappingproductCode);
                AddParamToSqlCommand(command, "@Effective_From", ParameterDirection.Input, SqlDbType.VarChar, 30, effectiveFrom);
                AddParamToSqlCommand(command, "@Created_Date", ParameterDirection.Input, SqlDbType.VarChar, 30, createdDate);
                AddParamToSqlCommand(command, "@Created_By", ParameterDirection.Input, SqlDbType.VarChar, 30, createdBy);
                AddParamToSqlCommand(command, "@Record_Status", ParameterDirection.Input, SqlDbType.VarChar, 1, recordStatus);
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
                ErrorLog.LogError(ex, "productInsert()");
                return "ERROR";
            }

        }

    }
}