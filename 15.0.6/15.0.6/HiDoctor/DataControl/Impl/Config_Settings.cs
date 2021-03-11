#region Usings
using DataControl.EnumType;
using DataControl.Abstraction;
#endregion Usings

namespace DataControl.Impl
{
    public class Config_Settings : IConfigSettings
    {
        #region Private Variables
        private SPData _objSPData;
        #endregion Private Variables

        #region Private Methods
        private string GetDefaultVaue(CONFIG_KEY config_Key)
        {
            string config_value = "";
            switch (config_Key)
            {
                case CONFIG_KEY.OTC_PRODUCT_UNIT_PRICE:
                    config_value = "PTS";
                    break;
                case CONFIG_KEY.LEAVE_ENTRY_MODE:
                    config_value = "HALF_A_DAY";
                    break;
                case CONFIG_KEY.DCR_ENTRY_TIME_GAP:
                    config_value = "5";
                    break;
                case CONFIG_KEY.DCR_DOCTOR_VISIT_TIME_ENTRY_MODE:
                    config_value = "MANUAL";
                    break;
                case CONFIG_KEY.DATE_DISPLAY_FORMAT_SERVER:
                    config_value = "dd/MM/yyyy";
                    break;
                case CONFIG_KEY.GAUGE_REDCOLOR_FROM_TO:
                    config_value = "0,60";
                    break;
                case CONFIG_KEY.GAUGE_YELLOWCOLOR_FROM_TO:
                    config_value = "60,80";
                    break;
                case CONFIG_KEY.GAUGE_GREENCOLOR_FROM_TO:
                    config_value = "80,100";
                    break;
                case CONFIG_KEY.SHOW_CP_IN_DOCTOR_YEARLY_ANALYSIS_REPORT:
                    config_value = "NO";
                    break;
                case CONFIG_KEY.ALLOW_SS_AUTO_APPROVAL:
                    config_value = "NO";
                    break;
                case CONFIG_KEY.DCR_VERSION:
                    config_value = "3";
                    break;
                case CONFIG_KEY.INWARD_MAX_PRODUCT_COUNT_USERTYPEWISE:
                    config_value = "30";
                    break;
                case CONFIG_KEY.INWARD_MAX_PRODUCT_COUNT_USERWISE:
                    config_value = "10";
                    break;
                case CONFIG_KEY.PAYROLL_VENDOR_SHORT_NAME:
                    config_value = "";
                    break;
                case CONFIG_KEY.PAYROLL_ACCESS_KEY:
                    config_value = "";
                    break;
                case CONFIG_KEY.IS_CCM_ENABLED:
                    config_value = "DISABLED";
                    break;
                case CONFIG_KEY.SMS_ON_USER_CREATION:
                    config_value = "YES";
                    break;
                // Start: KYD
                case CONFIG_KEY.IS_KYD_ENABLED_FOR_DESIGNATION:
                    config_value = "";
                    break;
                case CONFIG_KEY.DOCTOR_DUPLICATE_KEY_CHECK_COLUMN:
                    config_value = "";
                    break;
                case CONFIG_KEY.KYD_MANDATORY_COLUMNS:
                    config_value = "REGISTRATION_NO";
                    break;
                case CONFIG_KEY.KYD_DISPLAY_COLUMNS:
                    config_value = "EMAIL_ID,REGISTRATION_NO,LOCAL_AREA,MOBILE,PIN_CODE,HOSPITAL_NAME";
                    break;
                case CONFIG_KEY.KYD_DOCTOR_DUPLICATE_KEY_CHECK_COLUMN:
                    config_value = "REGISTRATION_NO";
                    break;
                case CONFIG_KEY.DOCTOR_MASTER_MANDATORY_COLUMNS:
                    config_value = "";
                    break;
                // End: KYD

                case CONFIG_KEY.IS_KANGLE_INTEGRATED:
                    config_value = "NO";
                    break;
                case CONFIG_KEY.DCR_DOCTOR_SUFIX_COLUMNS:
                    config_value="";
                    break;
                case CONFIG_KEY.DCR_UNAPPROVED_INCLUDE_IN_SEQ:
                    config_value = "NO";
                    break;
                case CONFIG_KEY.DCR_NO_PREFIL_EXPENSE_VALUE:
                    config_value = "NO";
                    break;
                case CONFIG_KEY.DCR_CATEGORY_VISIT_COUNT_RESTRICTION:
                    config_value="NO";
                    break;
                
                // Single Entry per day
                case CONFIG_KEY.SINGLE_ACTIVITY_PER_DAY:
                    config_value = "SINGLE";
                    break;
                case CONFIG_KEY.INWARD_ACKNOWLEDGEMENT_NEEDED:
                    config_value = "NO";
                    break;
                case CONFIG_KEY.EXPENSE_GROUP_PRINT_FORMAT:
                    config_value = "NO";
                    break;
                default:
                    break;
            }
            return config_value;
        }
        #endregion Private Methods

        /// <summary>
        /// Retrieves the config value.
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="config_Type"></param>
        /// <param name="config_Key"></param>
        /// <returns></returns>
        public string GetConfigDefaultValue(string companyCode, CONFIG_TYPE config_Type, CONFIG_KEY config_Key)
        {
            // Creates the SP Data instance.
            _objSPData = new SPData();

            // Call SPData method.
            string configDefaultValue = _objSPData.GetConfigDefaultValue(companyCode, config_Type, config_Key);

            // DB retruns value if null returns the default value.
            return configDefaultValue == null ? GetDefaultVaue(config_Key) :
                configDefaultValue.Trim().Length == 0 ? GetDefaultVaue(config_Key) : configDefaultValue;
        }

        public string GetDateDisplayFormate(string companyCode)
        {
            // Retrives the DCR_ENTRY_TIME_GAP value.
            string dcrTimeGapValue = GetConfigDefaultValue(companyCode, CONFIG_TYPE.DCR,
                CONFIG_KEY.DATE_DISPLAY_FORMAT_SERVER);

            // Returns the dcrTimeGapValue.
            return dcrTimeGapValue;
        }
        /// <summary>
        /// Used to get config values as it is in DB
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="config_Type"></param>
        /// <param name="config_Key"></param>
        /// <returns></returns>
        public string GetConfigValueasperDB(string companyCode, CONFIG_TYPE config_Type, CONFIG_KEY config_Key)
        {
            // Creates the SP Data instance.
            _objSPData = new SPData();

            // Call SPData method.
            string configDefaultValue = _objSPData.GetConfigDefaultValue(companyCode, config_Type, config_Key);

            // DB retruns value if null returns the default value.
            return configDefaultValue == null ? "" : configDefaultValue;
        }
    }
}
