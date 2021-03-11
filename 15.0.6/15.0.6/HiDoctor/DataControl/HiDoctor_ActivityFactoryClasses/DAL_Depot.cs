using System;
using System.Data;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MVCModels;

namespace DataControl.HiDoctor_ActivityFactoryClasses
{
    public class DAL_Depot
    {
        #region Private  Variables
        private Data _objData = new Data();
        #endregion Private  Variables

        #region Constant Variables
        const string SP_HD_INSERTDEPOTMASTER = "SP_HD_Insert_Depot_Master";
        const string SP_HD_GETDEPOTMASTER = "SP_HD_Get_Depot_Master";
        const string SP_HD_SEARCHDEPOTMASTER = "SP_HD_Search_Depot_Master";
        const string SP_HD_CHANGESTATUSDEPOTMASTER = "SP_HD_ChangeStatus_Depot_Master";
        #endregion Constant Variables

        public int InsertDepot(List<DepotModel> lstDeptMaster)
        {
            SqlConnection objSqlConnection = new SqlConnection();
            DataSet ds = new DataSet();
            int iRetValue = 0;
            try
            {
                SPData _objSPData = new SPData();
                SqlCommand command = new SqlCommand(SP_HD_INSERTDEPOTMASTER);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompCode", ParameterDirection.Input, SqlDbType.VarChar, 30, lstDeptMaster[0].Company_Code);
                //_objSPData.AddParamToSqlCommand(command, "@Location", ParameterDirection.Input, SqlDbType.VarChar, 30, lstDeptMaster[0].Location);
                _objSPData.AddParamToSqlCommand(command, "@DepotCode", ParameterDirection.Input, SqlDbType.VarChar, 50, lstDeptMaster[0].Depot_Code);
                _objSPData.AddParamToSqlCommand(command, "@DepotName", ParameterDirection.Input, SqlDbType.VarChar, 50, lstDeptMaster[0].Depot_Name);
                _objSPData.AddParamToSqlCommand(command, "@DeptShtName", ParameterDirection.Input, SqlDbType.VarChar, 12, lstDeptMaster[0].Depot_Short_Name);
                _objSPData.AddParamToSqlCommand(command, "@Add1", ParameterDirection.Input, SqlDbType.VarChar, 255, lstDeptMaster[0].Address1);
                _objSPData.AddParamToSqlCommand(command, "@Add2", ParameterDirection.Input, SqlDbType.VarChar, 255, lstDeptMaster[0].Address2);
                _objSPData.AddParamToSqlCommand(command, "@PhoneNo", ParameterDirection.Input, SqlDbType.VarChar, 20, lstDeptMaster[0].Phone_Number);
                _objSPData.AddParamToSqlCommand(command, "@MobileNo", ParameterDirection.Input, SqlDbType.VarChar, 20, lstDeptMaster[0].Mobile_Number);
                _objSPData.AddParamToSqlCommand(command, "@DrugLicNo1", ParameterDirection.Input, SqlDbType.VarChar, 40, lstDeptMaster[0].Drug_License_Number1);
                _objSPData.AddParamToSqlCommand(command, "@DrugLicNo2", ParameterDirection.Input, SqlDbType.VarChar, 40, lstDeptMaster[0].Drug_License_Number2);
                _objSPData.AddParamToSqlCommand(command, "@GSTNo", ParameterDirection.Input, SqlDbType.VarChar, 40, lstDeptMaster[0].CST_Number);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, lstDeptMaster[0].UserCode);
                _objSPData.AddParamToSqlCommand(command, "@RefKey1", ParameterDirection.Input, SqlDbType.VarChar, 50, lstDeptMaster[0].Ref_Key1);
                _objData.OpenConnection();
                ds = _objData.ExecuteDataSet(command);
                iRetValue = Convert.ToInt16(ds.Tables[0].Rows[0][0]);
                return iRetValue;
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

        public List<DepotModel> GetDepotDetails()
        {
            SqlConnection objSqlConnection = new SqlConnection();
            DepotModel lstDeptModel = new DepotModel();
            try
            {
                //Set command objects
                SqlCommand command = new SqlCommand(SP_HD_GETDEPOTMASTER);
                command.CommandType = CommandType.StoredProcedure;

                //Opens Connection
                _objData.OpenConnection();

                // Execuete the command.
                using (SqlDataReader reader = _objData.ExecuteReader(command))
                {
                    // converts and retruns the "Depot Master" list.
                    return ActvityDataReader_MaptoList(reader);
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

        private List<DepotModel> ActvityDataReader_MaptoList(SqlDataReader reader)
        {
            List<DepotModel> lstDepotModel = new List<DepotModel>();
            while (reader.Read())
            {
                DepotModel DepModel = new DepotModel();

                DepModel.Company_Code = reader["Company_Code"].ToString();
                DepModel.Depot_Code = reader["Depot_Code"].ToString();
                DepModel.Location = reader["Location"].ToString();
                DepModel.Depot_Name = reader["Depot_Name"].ToString();
                DepModel.Depot_Short_Name = reader["Depot_Short_Name"].ToString();
                DepModel.Address1 = reader["Address1"].ToString();
                DepModel.Address2 = reader["Address2"].ToString();
                DepModel.Phone_Number = reader["Phone_Number"].ToString();
                DepModel.Mobile_Number = reader["Mobile_Number"].ToString();
                DepModel.Drug_License_Number1 = reader["Drug_License_Number1"].ToString();
                DepModel.Drug_License_Number2 = reader["Drug_License_Number2"].ToString();
                DepModel.CST_Number = reader["CST_Number"].ToString();
                DepModel.Ref_Key1 = reader["Ref_Key1"].ToString();

                lstDepotModel.Add(DepModel);
            }
            return lstDepotModel;
        }

        public List<DepotModel> SearchDepotDetails(string CCode, string DCode, string DName)
        {
            SPData _objSPData = new SPData();
            SqlConnection objSqlConnection = new SqlConnection();
            
            try
            {
                //Set command objects
                SqlCommand command = new SqlCommand(SP_HD_SEARCHDEPOTMASTER);
                command.CommandType = CommandType.StoredProcedure;
                //Passing dynamic values to Database Parameters
                _objSPData.AddParamToSqlCommand(command, "@CompCode", ParameterDirection.Input, SqlDbType.VarChar, 30, CCode);
                _objSPData.AddParamToSqlCommand(command, "@DepotCode", ParameterDirection.Input, SqlDbType.VarChar, 30, DCode);
                _objSPData.AddParamToSqlCommand(command, "@DepotName", ParameterDirection.Input, SqlDbType.VarChar, 50, DName);

                //Opens Connection
                _objData.OpenConnection();

                // Execuete the command.
                using (SqlDataReader reader = _objData.ExecuteReader(command))
                {
                    // converts and retruns the "Depot Master" list.
                    return ActvityDataReader_MaptoList(reader);
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

        public int UpdateRecordStatus(string CmpCode, string DepCode, string DepName)
        {
            SPData _objSPData = new SPData();
            SqlConnection objSqlConnection = new SqlConnection();
            DataSet ds = new DataSet();
            int iResult = 0;
            try
            {
                //Set command objects
                SqlCommand command = new SqlCommand(SP_HD_CHANGESTATUSDEPOTMASTER);
                command.CommandType = CommandType.StoredProcedure;
                //Passing dynamic values to Database Parameters
                _objSPData.AddParamToSqlCommand(command, "@CompCode", ParameterDirection.Input, SqlDbType.VarChar, 30, CmpCode);
                _objSPData.AddParamToSqlCommand(command, "@DepotCode", ParameterDirection.Input, SqlDbType.VarChar, 30, DepCode);
                _objSPData.AddParamToSqlCommand(command, "@DepotName", ParameterDirection.Input, SqlDbType.VarChar, 50, DepName);

                //Opens Connection
                _objData.OpenConnection();

                // Execuete the command.
                ds = _objData.ExecuteDataSet(command);
                iResult = Convert.ToInt16(ds.Tables[0].Rows[0][0]);
                return iResult;
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
