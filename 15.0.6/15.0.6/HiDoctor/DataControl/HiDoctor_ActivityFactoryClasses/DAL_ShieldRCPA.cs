using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace DataControl.HiDoctor_ActivityFactoryClasses
{
    public class DAL_ShieldRCPA : DapperRepository
    {
        private Data _objData = new Data();
        private CurrentInfo _objCurInfo = new CurrentInfo();

        const string SP_HDINSERTRCPAFROMEXCELSTAGING = "Sp_hd_InsertRCPAFromExcelStaging";

        public string ExcelBulkRCPAInsert(string companyCode, DataTable dt)
        {
            string result = string.Empty;
            try
            {
                using (SqlConnection cn = _objData.GetConnectionObject(companyCode))
                {
                    cn.Open();
                    using (SqlBulkCopy copy = new SqlBulkCopy(cn))
                    {
                        copy.ColumnMappings.Add("Company_Id", "Company_Id");
                        copy.ColumnMappings.Add("Company_code", "Company_Code");
                        copy.ColumnMappings.Add("NAME OF THE DOCTOR", "Doctor_Name");
                        copy.ColumnMappings.Add("MDL No", "MDL_Number");
                        copy.ColumnMappings.Add("AGE","Age");
                        copy.ColumnMappings.Add("MOBILE NUMBER", "Mobile_Number");
                        copy.ColumnMappings.Add("QUALIFICATION", "Qualification");
                        copy.ColumnMappings.Add("NAME OF THE PLACE", "Location");
                        copy.ColumnMappings.Add("NAME OF MR HQ", "Region_Name");
                        copy.ColumnMappings.Add("IVF OR NON-IVF", "Is_Ivf");
                        copy.ColumnMappings.Add("NO OF RX FOR ESTRO G 100 PER WEEK", "Sales_Product");
                        copy.ColumnMappings.Add("NO OF Rx PREMARIN PER WEEK", "CompProductS11");
                        copy.ColumnMappings.Add("NO OF Rx FOR MENOPACE ISO, SHELCAL ISO, CALCIMAX ISO PER WEEK", "CompProductS12");
                        copy.ColumnMappings.Add("NO OF MENOPAUSE PATIENTS PER WEEK", "Key_ValueS1");
                        copy.ColumnMappings.Add("NO OF RX FOR OVAA SHIELD & DS PER WEEK", "Sales_Product2");
                        copy.ColumnMappings.Add("NO OF RX FOR CC PER WEEK", "CompProductS21");
                        copy.ColumnMappings.Add("NO OF RX FOR LETROZOLE PER WEEK", "CompProductS22");
                        copy.ColumnMappings.Add("NO OF FEMALE INFERTILITY PATIENTS PER WEEK", "Key_ValueS2");
                        copy.ColumnMappings.Add("NO OF RX FOR ZOAMATES PER WEEK", "Sales_Product3");
                        copy.ColumnMappings.Add("NO OF RX FOR CoQ10, FERTISURE M, MAXOZA L PER WEEK", "CompProductS31");
                        copy.ColumnMappings.Add("NO OF MALE INFERTILITY PATIENTS PER WEEK", "Key_ValueS3");
                        copy.ColumnMappings.Add("Sales_ProductName", "Sales_ProductName");
                        copy.ColumnMappings.Add("CompProductS11_Name", "CompProductS11_Name");
                        copy.ColumnMappings.Add("CompProductS12_Name", "CompProductS12_Name");
                        copy.ColumnMappings.Add("Key_ValueS1_Name", "Key_ValueS1_Name");
                        copy.ColumnMappings.Add("Sales_Product2Name", "Sales_Product2Name");
                        copy.ColumnMappings.Add("CompProductS21_Name", "CompProductS21_Name");
                        copy.ColumnMappings.Add("CompProductS22_Name", "CompProductS22_Name");
                        copy.ColumnMappings.Add("Key_ValueS2_Name", "Key_ValueS2_Name");
                        copy.ColumnMappings.Add("Sales_Product3Name", "Sales_Product3Name");
                        copy.ColumnMappings.Add("CompProductS31_Name", "CompProductS31_Name");
                        copy.ColumnMappings.Add("Key_ValueS3_Name", "Key_ValueS3_Name");
                        copy.ColumnMappings.Add("PeriodFrom", "Period_From");
                        copy.ColumnMappings.Add("PeriodTo", "Period_To");
                        copy.ColumnMappings.Add("File_Name", "File_Name");
                        copy.ColumnMappings.Add("GUID", "GUID");
                        copy.ColumnMappings.Add("Row_No", "Row_No");
                        copy.ColumnMappings.Add("Status", "Status");
                        copy.DestinationTableName = "tbl_SFA_RCPA_Master_Staging";
                        copy.WriteToServer(dt);
                    }
                    cn.Close();
                }
                result = "SUCCESS";
            }
            catch(Exception ex)
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }

        public string InsertExcelBulkRCPAStagingToMaster(string subDomain, string companyCode, string Regioncode, string guid, string fileName, string uploadedBy, string bpType)
        {

            SPData _objSPData = new SPData();
            string result = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HDINSERTRCPAFROMEXCELSTAGING);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 1000;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Regioncode", ParameterDirection.Input, SqlDbType.VarChar, 30, Regioncode);
                _objSPData.AddParamToSqlCommand(command, "@GUID", ParameterDirection.Input, SqlDbType.NVarChar, 100, guid);
                _objSPData.AddParamToSqlCommand(command, "@FileName", ParameterDirection.Input, SqlDbType.NVarChar, 500, fileName);
                _objSPData.AddParamToSqlCommand(command, "@UploadedBy", ParameterDirection.Input, SqlDbType.NVarChar, 30, uploadedBy);
                _objSPData.AddParamToSqlCommand(command, "@BPType", ParameterDirection.Input, SqlDbType.NVarChar, 30, bpType);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                returnValue.Value = "";
                command.Parameters.Add(returnValue);
                _objData.OpenConnectionAsync(subDomain);
                _objData.ExecuteNonQueryAsync(command);
                result = "SUCCESS:";
            }
            catch (Exception ex)
            {
                result = String.Concat("FAILURE: ", ex.StackTrace.Substring(0, 499));
            }

            return result;
        }
    }
}
