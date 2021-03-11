using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Dapper;
using MVCModels;
using System.Data;
using System.Data.SqlClient;
using Microsoft.SqlServer.Server;
namespace DataControl.HD_MasterFactoryClasses
{
    public class DAL_FormControls : DapperRepository
    {
        private SPData _objSPData = null;
        private Data _objData = null;
        public const string FormMasterData = "HD_SP_FormMaster";

        public FormMasterData GetFormMasterData(string companyCode)
        {
            FormMasterData objFormMasterData = new FormMasterData();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@companyCode", companyCode);
                    var masterData = connection.QueryMultiple(FormMasterData, p, commandType: CommandType.StoredProcedure);

                    objFormMasterData.lsForm_Control_Master = masterData.Read<FormControlMaster>().ToList();
                    objFormMasterData.lsForm_Validation_Master = masterData.Read<FormValidationMaster>().ToList();
                    objFormMasterData.ls_Form_Master = masterData.Read<FormMaster>().ToList();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return objFormMasterData;
        }
        public int SaveFormName(string formName, string company_code, string user_code, int company_id, string formCusName)
        {
            int form_ID = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    string sql = "insert into tbl_sfa_Form_Master(Form_Name,Created_By,Created_Date,Company_Id,Company_Code,Form_Custom_Name) ";
                    sql += "values(@formName,@user_code,getdate(),@company_id,@compnay_Code,@formCusName);";
                    sql += "SELECT convert(int,SCOPE_IDENTITY());";
                    var id = connection.Query<int>(sql, new { formName = formName, user_code = user_code, company_id = company_id, compnay_Code = company_code, formCusName = formCusName }).Single();
                    //if (id != null)
                    Int32.TryParse(id.ToString(), out form_ID);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return form_ID;
        }
        public int SaveFormControl(FormControlDetails objFormControlDetails)
        {
            int rValue = 0;
            _objSPData = new SPData();
            _objData = new Data();

            try
            {
                string cmdText = "HD_SP_InsertFromControl";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@Form_ID", ParameterDirection.Input, SqlDbType.VarChar, 30, objFormControlDetails.Form_ID);
                _objSPData.AddParamToSqlCommand(command, "@Company_Id", ParameterDirection.Input, SqlDbType.Int, 30, objFormControlDetails.Company_Id);
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, objFormControlDetails.Company_Code);
                _objSPData.AddParamToSqlCommand(command, "@Created_By", ParameterDirection.Input, SqlDbType.VarChar, 30, objFormControlDetails.Created_By);
                if (objFormControlDetails.lsFormControls == null || objFormControlDetails.lsFormControls.Count == 0)
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Form_Controls", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_Form_Controls");
                else
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Form_Controls", ParameterDirection.Input, SqlDbType.Structured, new FormControlEnumurator(objFormControlDetails.lsFormControls), "TVP_Form_Controls");

                if (objFormControlDetails.lsFormControlsValues == null || objFormControlDetails.lsFormControlsValues.Count == 0)
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Form_Controls_Values", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_Form_Controls_Values");
                else
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Form_Controls_Values", ParameterDirection.Input, SqlDbType.Structured, new FormControlValuesEnumurator(objFormControlDetails.lsFormControlsValues), "TVP_Form_Controls_Values");

                if (objFormControlDetails.lsFormvalidation == null || objFormControlDetails.lsFormvalidation.Count == 0)
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Form_Control_validation", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_Form_Control_validation");
                else
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Form_Control_validation", ParameterDirection.Input, SqlDbType.Structured, new FormControlvalidationEnumurator(objFormControlDetails.lsFormvalidation), "TVP_Form_Control_validation");
                _objData.OpenConnection(objFormControlDetails.Company_Code);
                _objData.ExecuteNonQuery(command);
                rValue = 1;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rValue;
        }
        public FormControlDetails BindFormControls(int formId, string company_Code, int Form_Value_Id)
        {
            FormControlDetails objFormControlDetails = new FormControlDetails();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@company_Code", company_Code);
                    p.Add("@form_ID", formId);
                    p.Add("@Form_Value_Id", Form_Value_Id);
                    var formControl = connection.QueryMultiple("HD_SP_BindFormDetails", p, commandType: CommandType.StoredProcedure);
                    objFormControlDetails.lsFormControls = formControl.Read<FormControls>().ToList();
                    if (Form_Value_Id == 0)
                    {
                        objFormControlDetails.lsFormControlsValues = formControl.Read<FormControlsValues>().ToList();
                        objFormControlDetails.lsFormvalidation = formControl.Read<FormControlValidation>().ToList();
                        objFormControlDetails.lsFormValue = formControl.Read<Form_Value>().ToList();
                    }
                }
            }
            catch (Exception ex)
            {
            }
            return objFormControlDetails;
        }
        public int SaveFormValue(MVCModels.Form_Value objFormValue)
        {
            int rValue = 0;
            try
            {
                int Form_Value_Id = 0;
                using (IDbConnection connection = IDbOpenConnection())
                {
                    string sql = "insert into tbl_sfa_Form_Value(Form_ID,Form_Custom_Name,Company_Code,Compnay_Id,Created_By,Created_Date)";
                    sql += "values(@Form_ID,@Form_Custom_Name,@Company_Code,@Compnay_Id,@user_code,getdate())";
                    sql += "SELECT convert(int,SCOPE_IDENTITY());";
                    Form_Value_Id = connection.Query<int>(sql, new { @Form_ID = objFormValue.Form_ID, @Form_Custom_Name = objFormValue.Form_Custom_name, @Company_Code = objFormValue.Company_Code, @Compnay_Id = objFormValue.Company_Id, @user_code = objFormValue.Created_By}).Single();
                    connection.Close();
                }
                using (IDbConnection connection = IDbOpenConnection())
                {
                    foreach (var item in objFormValue.lsFormValueDetails)
                    {
                        string sql = "insert into tbl_sfa_Form_Value_Details(Form_Value_Id,Form_ID,Form_Control_Id,Form_Control_values,Company_Code,Compnay_ID)";
                        sql += "values(@Form_Value_Id,@Form_ID,@Form_Control_Id,@Form_Control_values,@Company_Code,@Compnay_ID)";
                        connection.Execute(sql, new { @Form_Value_Id = Form_Value_Id, @Form_ID = item.Form_ID, @Form_Control_Id = item.Form_Control_Id, @Form_Control_values = item.Form_Control_values, @Company_Code = objFormValue.Company_Code, @Compnay_ID = objFormValue.Company_Id });
                        connection.Close();
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rValue;
        }
    }
    public class FormControlEnumurator : IEnumerable<SqlDataRecord>
    {
        int count = 1;
        public FormControlEnumurator(IEnumerable<FormControls> data)
        {
            _data = data;
        }
        private IEnumerable<FormControls> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("Form_Control_Id", SqlDbType.Int),
         new SqlMetaData("Control_Id", SqlDbType.SmallInt),
         new SqlMetaData("InputType", SqlDbType.VarChar, 30),
         new SqlMetaData("Label_Value", SqlDbType.VarChar, 500),
         new SqlMetaData("Display_Order", SqlDbType.SmallInt),
         new SqlMetaData("id",SqlDbType.Int),
          };
            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.Form_Control_Id);
                record.SetValue(1, item.Control_Id);
                record.SetValue(2, item.InputType);
                record.SetValue(3, item.Label_Value);
                record.SetValue(4, item.Display_Order);
                record.SetValue(5, count);
                count++;
                yield return record;
            }
        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }
    public class FormControlValuesEnumurator : IEnumerable<SqlDataRecord>
    {

        public FormControlValuesEnumurator(IEnumerable<FormControlsValues> data)
        {
            _data = data;
        }
        private IEnumerable<FormControlsValues> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("Form_Control_Value_Id", SqlDbType.BigInt),
         new SqlMetaData("Form_Id", SqlDbType.Int),
         new SqlMetaData("Form_Control_Id", SqlDbType.BigInt),
         new SqlMetaData("Control_values", SqlDbType.VarChar, 500),
          };
            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.Form_Control_Value_Id);
                record.SetValue(1, item.Form_Id);
                record.SetValue(2, item.Form_Control_Id);
                record.SetValue(3, item.Control_values);
                yield return record;
            }
        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }
    public class FormControlvalidationEnumurator : IEnumerable<SqlDataRecord>
    {

        public FormControlvalidationEnumurator(IEnumerable<FormControlValidation> data)
        {
            _data = data;
        }
        private IEnumerable<FormControlValidation> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("Form_Control_validation_Id", SqlDbType.BigInt),
         new SqlMetaData("Form_Id", SqlDbType.Int),
         new SqlMetaData("Form_Control_Id", SqlDbType.BigInt),
         new SqlMetaData("Validation_ID", SqlDbType.Int),
         new SqlMetaData("Validation_Values", SqlDbType.VarChar, 50),
          };
            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.Form_Control_validation_Id);
                record.SetValue(1, item.Form_Id);
                record.SetValue(2, item.Form_Control_Id);
                record.SetValue(3, item.Validation_ID);
                record.SetValue(4, item.Validation_Values);
                yield return record;
            }
        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }
}
