#region Usings
using System;
using System.Data;
using System.Collections.Generic;
using System.Data.SqlClient;
using MVCModels;
using Dapper;
using Microsoft.SqlServer.Server;
#endregion Usings

namespace DataControl
{
    public class DAL_KYD : DapperRepository
    {
        #region Private Variables
        private SqlDataReader sqldataReader;
        private SPData _objSPData = null;
        private Data _objData = null;
        #endregion Private Variables

        #region Constant string
        const string SP_HDKYDGETCUSTOMERLIST = "SP_HDKYDGetCustomerList";
        const string SPHD_KYDCHECKDUPLICATEENTRY = "SPHD_KYDCheckDuplicateEntry";
        const string SPHD_KYDSAVEDOCINFO = "SPHD_KYDSaveDocInfo";
        const string KYD_TYPE_NAME = "KYD_TVP";
        #endregion Constant string

        #region Private Methods
        #endregion Private Methods

        #region Public Methods
        public IEnumerable<KYDModel> GetKYDCustomerList(string company_Code, string user_Code, string DCR_Date, string key_Column)
        {
            IEnumerable<KYDModel> lstKYD;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", company_Code, DbType.String, ParameterDirection.Input, 30);
                    p.Add("@User_Code", user_Code, DbType.String, ParameterDirection.Input, 30);
                    p.Add("@DCR_Date", DCR_Date, DbType.Date, ParameterDirection.Input, 12);
                    p.Add("@Key_Column", key_Column, DbType.String, ParameterDirection.Input, 30);

                    lstKYD = connection.Query<KYDModel>(SP_HDKYDGETCUSTOMERLIST, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }

            return lstKYD;
        }

        public List<KYDModel> DuplicateValidationOnKYD(string company_Code, string key_Column, IEnumerable<KYDModel> IlstKYDModel)
        {
            List<KYDModel> lstKYD = new List<KYDModel>();
            try
            {
                _objSPData = new SPData();
                _objData = new Data();

                string cmdText = SPHD_KYDCHECKDUPLICATEENTRY;
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                _objSPData.AddParamToSqlCommand(command, "@Key_Column", ParameterDirection.Input, SqlDbType.VarChar, 20, key_Column);
                if (((List<KYDModel>)IlstKYDModel).Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@KYD_TEMP", ParameterDirection.Input, SqlDbType.Structured, null, KYD_TYPE_NAME);
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@KYD_TEMP", ParameterDirection.Input, SqlDbType.Structured, new KYDEnumurator(IlstKYDModel), KYD_TYPE_NAME);
                }
                _objData.OpenConnection(company_Code);
                // Execuete the data reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    while (dataReader.Read())
                    {
                        KYDModel KYD = new KYDModel();
                        KYD.Doctor_Code = dataReader["Doctor_Code"].ToString();
                        KYD.Doctor_Region_Code = dataReader["Doctor_Region_Code"].ToString();
                        KYD.Registration_No = dataReader["Registration_No"].ToString();
                        KYD.Mobile = dataReader["Mobile"].ToString();
                        KYD.Email_Id = dataReader["Email"].ToString();
                        lstKYD.Add(KYD);
                    }
                }
                _objData.CloseConnection();
                // returns the list.
                return lstKYD;
            }
            catch
            {
                _objData.CloseConnection();
                throw;
            }
        }


        public string SaveKYDInfo(string company_Code, IEnumerable<KYDModel> IlstKYDModel)
        {
            try
            {
                _objSPData = new SPData();
                _objData = new Data();

                string cmdText = SPHD_KYDSAVEDOCINFO;
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                
                if (((List<KYDModel>)IlstKYDModel).Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@KYD_TEMP", ParameterDirection.Input, SqlDbType.Structured, null, KYD_TYPE_NAME);
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@KYD_TEMP", ParameterDirection.Input, SqlDbType.Structured, new KYDEnumurator(IlstKYDModel), KYD_TYPE_NAME);
                }

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);

                _objData.OpenConnection(company_Code);
                _objData.ExecuteNonQuery(command);
                string result = command.Parameters["@Result"].Value.ToString();
                _objData.CloseConnection();
                // returns the list.
                return result;
            }
            catch
            {
                throw;
            }
        }
        #endregion Public Methods
    }

    public class KYDEnumurator : IEnumerable<SqlDataRecord>
    {

        public KYDEnumurator(IEnumerable<KYDModel> data)
        {
            _data = data;
        }
        private IEnumerable<KYDModel> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("ID", SqlDbType.Int),
         new SqlMetaData("Doctor_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("Doctor_Region_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("Registration_No", SqlDbType.VarChar, 50),
         new SqlMetaData("Mobile", SqlDbType.VarChar, 13),
         new SqlMetaData("Local_Area", SqlDbType.VarChar, 500),
         new SqlMetaData("Hospital_Name", SqlDbType.VarChar, 100),
         new SqlMetaData("PinCode", SqlDbType.VarChar, 10),
         new SqlMetaData("Region_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("Place_Type", SqlDbType.VarChar, 100),
         new SqlMetaData("Email",SqlDbType.VarChar,100)

          };
            int i=0;
            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, ++i);
                record.SetValue(1, item.Doctor_Code);
                record.SetValue(2, item.Doctor_Region_Code);
                record.SetValue(3, item.Registration_No);
                record.SetValue(4, item.Mobile);
                record.SetValue(5, item.Local_Area);
                record.SetValue(6, item.Hospital_Name);
                record.SetValue(7, item.Pin_Code);
                record.SetValue(8, item.Region_Code);
                record.SetValue(9, item.Medical_Council);
                record.SetValue(10, item.Email_Id);
                yield return record;
            }

        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }

    
}
