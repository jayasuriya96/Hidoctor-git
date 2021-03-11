using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class FormControl
    {
    }
    public class FormMaster
    {
        public int Form_ID { get; set; }
        public string Form_Name { get; set; }
        public int Status { get; set; }
        public string Form_Custom_Name { get; set; }
    }

    public class FormControlMaster
    {
        public int Control_ID { get; set; }
        public string Control_Name { get; set; }
        public string Control_Ref_Name { get; set; }
        public int Status { get; set; }
    }
    public class FormValidationMaster
    {
        public int Validation_ID { get; set; }
        public string Validation_Name { get; set; }
        public string Validation_Ref_Name { get; set; }
        public int Status { get; set; }
    }
    public class FormControls
    {
        public int Form_Control_Id { get; set; }
        public int Form_ID { get; set; }
        public Int16 Control_Id { get; set; }
        public string Label_Value { get; set; }
        public Int16 Display_Order { get; set; }
        public string InputType { get; set; }
        public int Control_Ref_Name { get; set; }
        public string Form_Control_values { get; set; }
    }
    public class FormControlsValues
    {
        public long Form_Control_Value_Id { get; set; }
        public long Form_Control_Id { get; set; }
        public string Control_values { get; set; }
        public int Form_Id { get; set; }
    }
    public class FormControlValidation
    {
        public long Form_Control_validation_Id { get; set; }
        public int Form_Id { get; set; }
        public long Form_Control_Id { get; set; }
        public int Validation_ID { get; set; }
        public string Validation_Values { get; set; }
        public int Validation_Ref_Name { get; set; }
    }
    public class FormMasterData
    {
        public int aa { get; set; }
        public List<FormControlMaster> lsForm_Control_Master { get; set; }
        public List<FormValidationMaster> lsForm_Validation_Master { get; set; }
        public List<FormMaster> ls_Form_Master { get; set; }
    }
    public class FormControlDetails
    {
        public int Form_ID { get; set; }
        public int Company_Id { get; set; }
        public string Company_Code { get; set; }
        public string Created_By { get; set; }
        public List<FormControls> lsFormControls { get; set; }
        public List<FormControlValidation> lsFormvalidation { get; set; }
        public List<FormControlsValues> lsFormControlsValues { get; set; }
        public List<Form_Value> lsFormValue { get; set; }

    }
    public class Form_Value
    {
        public long Form_Value_Id { get; set; }
        public int Form_ID { get; set; }
        public string Form_Custom_name { get; set; }
        public string Aknowledged_By { get; set; }
        public string Aknowledged_Date { get; set; }
        public int Company_Id { get; set; }
        public string Company_Code { get; set; }
        public string Created_By { get; set; }
        public string Created_Date { get; set; }
        public List<Form_Value_Details> lsFormValueDetails { get; set; }
    }

    public class Form_Value_Details
    {
        public long Form_Value_Details_Id { get; set; }
        public int Form_Value_Id { get; set; }
        public int Form_ID { get; set; }
        public long Form_Control_Id { get; set; }
        public string Form_Control_values { get; set; }
    }
    public static class IntExtensions
    {
        public static bool IsGreaterThan(this int i, int value)
        {
            return i > value;
        }
    }
}
