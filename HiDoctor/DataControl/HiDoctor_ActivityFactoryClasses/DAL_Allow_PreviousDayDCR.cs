using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using DataControl;
using MVCModels;


namespace DataControl.HiDoctor_ActivityFactoryClasses
{
    public class DAL_Allow_PreviousDayDCR
    {
        #region Private Variables
        SPData _objSPData = new SPData();
        private Data _objData = new Data();
        private CurrentInfo _objCurInfo = new CurrentInfo();
        #endregion Private Variables

        #region Constant Variables
        const string SPHDGetPrevDayDCRByUserCode = "SP_HD_GetPrevDayDCRByUserCode";
        const string SPHDInsertAllowPreDayDCR = "SP_HD_Insert_Allow_PreDayDCR";
        #endregion Constant Variables

        public List<Allow_PreviousDayDCR> GetPreviousDayDCR(string company_Code, string user_Code, char PrvDayDCRStatus)
        {
            try
            {
                SPData _objSPData = new SPData();

                // set command objects
                SqlCommand command = new SqlCommand(SPHDGetPrevDayDCRByUserCode);
                command.CommandType = CommandType.StoredProcedure;

                // assign to parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.NVarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.NVarChar, 500, user_Code);
                _objSPData.AddParamToSqlCommand(command, "@PreDayDCRStatus", ParameterDirection.Input, SqlDbType.NChar, 1, PrvDayDCRStatus);

                // Opens the connection.
                _objData.OpenConnection();

                // Execuete the command.
                using (SqlDataReader reader = _objData.ExecuteReader(command))
                {
                    // converts and retruns the user model list.
                    return ActvityDataReader_MaptoList(company_Code, reader);
                }
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

        private List<Allow_PreviousDayDCR> ActvityDataReader_MaptoList(string company_Code, SqlDataReader reader)
        {
            List<Allow_PreviousDayDCR> lstPrvDayDCR = new List<Allow_PreviousDayDCR>();
            while (reader.Read())
            {
                Allow_PreviousDayDCR allowPrvDayDCR = new Allow_PreviousDayDCR();

                allowPrvDayDCR.Company_Code = company_Code;
                allowPrvDayDCR.Region_Name = reader["Region_Name"].ToString();
                allowPrvDayDCR.User_Code = reader["User_Code"].ToString();
                allowPrvDayDCR.User_Name = reader["User_Name"].ToString();
                allowPrvDayDCR.Employee_Name = reader["Employee_Name"].ToString();
                allowPrvDayDCR.User_Type_Name = reader["Designation"].ToString();
                allowPrvDayDCR.Dcr_Date = reader["DCR_Date"].ToString();
                allowPrvDayDCR.Remarks = reader["Remarks"].ToString();
                allowPrvDayDCR.CreatedBy = reader["CreatedBy"].ToString();
                allowPrvDayDCR.CreatedDate = reader["CreatedDate"].ToString();
                allowPrvDayDCR.UpdatedBy = reader["UpdatedBy"].ToString();
                allowPrvDayDCR.UpdatedDate = reader["UpdatedDate"].ToString();
                allowPrvDayDCR.Uploaded_Date = reader["Uploaded_Date"].ToString();

                lstPrvDayDCR.Add(allowPrvDayDCR);
            }
            return lstPrvDayDCR;
        }

        public bool InserPreviousDayDCR(string CompCode, string user_Codes, string LoggedUserCode, string DCRDate, string Remarks)
        {
            SqlConnection objSqlConnection = new SqlConnection();
            try
            {
                SPData _objSPData = new SPData();
                Data _objData = new Data();
                DataSet ds = new DataSet();
                bool ReturnValue = false;
                SqlCommand command = new SqlCommand(SPHDInsertAllowPreDayDCR);
                command.CommandType = CommandType.StoredProcedure;

                // assign to parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@CompCode", ParameterDirection.Input, SqlDbType.VarChar, 30, CompCode);
                _objSPData.AddParamToSqlCommand(command, "@UsrCode", ParameterDirection.Input, SqlDbType.VarChar, 100, user_Codes);
                _objSPData.AddParamToSqlCommand(command, "@LogUsrCode", ParameterDirection.Input, SqlDbType.VarChar, 30, LoggedUserCode);
                _objSPData.AddParamToSqlCommand(command, "@DcrDt", ParameterDirection.Input, SqlDbType.VarChar, 12, DCRDate);
                _objSPData.AddParamToSqlCommand(command, "@Remarks", ParameterDirection.Input, SqlDbType.VarChar, 150, Remarks);
                _objData.OpenConnection();
                ds =_objData.ExecuteDataSet(command);
                ReturnValue = (ds.Tables[0].Rows[0][0].ToString() == "Success") ? true : false;
                return ReturnValue;
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
    }
}
