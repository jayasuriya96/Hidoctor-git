﻿
namespace DataControl.EnumType
{
    public enum CUSTOMER_MASTER_ENTITY_TYPE { DOCTOR, CHEMIST, STOCKIEST };
    public enum CUSTOMER_MASTER_LOOKUP_COLUMNS { REGION, SPECIALITY, CATEGORY };
    public enum CONFIG_KEY  
    {
        OTC_PRODUCT_UNIT_PRICE, LEAVE_ENTRY_MODE, DCR_ENTRY_TIME_GAP, DCR_DOCTOR_VISIT_TIME_ENTRY_MODE, DATE_DISPLAY_FORMAT_SERVER,
        GAUGE_GREENCOLOR_FROM_TO, GAUGE_REDCOLOR_FROM_TO, GAUGE_YELLOWCOLOR_FROM_TO, SHOW_CP_IN_DOCTOR_YEARLY_ANALYSIS_REPORT, ALLOW_SS_AUTO_APPROVAL,
        INWARD_MAX_PRODUCT_COUNT_USERWISE, INWARD_MAX_PRODUCT_COUNT_USERTYPEWISE, PAYROLL_VENDOR_SHORT_NAME, DCR_VERSION, PAYROLL_ACCESS_KEY, IS_CCM_ENABLED, ALL_OPTION_FOR_INWARD, SMS_ON_USER_CREATION
        , IS_KYD_ENABLED_FOR_DESIGNATION, KYD_MANDATORY_COLUMNS, KYD_DISPLAY_COLUMNS, DOCTOR_MASTER_MANDATORY_COLUMNS, DOCTOR_DUPLICATE_KEY_CHECK_COLUMN, KYD_DOCTOR_DUPLICATE_KEY_CHECK_COLUMN,
        IS_KANGLE_INTEGRATED, DCR_DOCTOR_SUFIX_COLUMNS, DCR_NO_PREFIL_EXPENSE_VALUE, DCR_UNAPPROVED_INCLUDE_IN_SEQ, DCR_CATEGORY_VISIT_COUNT_RESTRICTION
        , SINGLE_ACTIVITY_PER_DAY, CHEMIST_MASTER_MANDATORY_COLUMNS, INWARD_ACKNOWLEDGEMENT_NEEDED , EXPENSE_GROUP_PRINT_FORMAT ,MAX_FILE_SIZE_PS
    };
    public enum CONFIG_TYPE { OTC, DCR, DASHBOARD, REPORT, APPROVAL, INWARD, CUSTOMER,USER,KYD,PRIMARY_SALES };
}
