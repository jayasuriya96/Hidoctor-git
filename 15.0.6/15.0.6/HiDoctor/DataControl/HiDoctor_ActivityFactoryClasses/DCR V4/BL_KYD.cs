#region Usings
using MVCModels;
using System.Collections.Generic;
using DataControl.Abstraction;
using DataControl.Impl;
using DataControl.EnumType;
using System;
using System.Linq;
using Newtonsoft.Json;
#endregion Usings

namespace DataControl
{
    public class BL_KYD
    {
        #region Private Variable
        private IConfigSettings _objIconfigsettings = null;
        private DAL_KYD _objDALKYD;
        #endregion Private

        #region Constants
        const string REGISTRATION_NO = "REGISTRATION_NO";
        const string LOCAL_AREA = "LOCAL_AREA";
        const string PIN_CODE = "PIN_CODE";
        const string HOSPITAL_NAME = "HOSPITAL_NAME";
        const string MOBILE = "MOBILE";
        #endregion Constatns

        #region Public Methods
        /// <summary>
        /// Retrievs the  Duplicate Key Column value
        /// Default value is : Registration_No
        /// Possible Values: Registration_No, Mobile.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <returns></returns>
        public string GetKYDDuplicateKeyColumnValue(string company_Code)
        {
            _objIconfigsettings = new Config_Settings();
            return _objIconfigsettings.GetConfigDefaultValue(company_Code, CONFIG_TYPE.KYD, CONFIG_KEY.KYD_DOCTOR_DUPLICATE_KEY_CHECK_COLUMN);
        }

        /// <summary>
        /// Retrievs the KYD Mandatory Columns.
        /// Default Value: Registration_No
        /// /// </summary>
        /// <param name="company_Code"></param>
        /// <returns></returns>
        public string GetKYDMandatoryColumns(string company_Code, string Key_Column)
        {
            _objIconfigsettings = new Config_Settings();
            string mandatory_Columns = _objIconfigsettings.GetConfigDefaultValue(company_Code, CONFIG_TYPE.KYD, CONFIG_KEY.KYD_MANDATORY_COLUMNS);
            string[] mandatory_ColumnsArr = mandatory_Columns.Trim().Split(',');
            //Trim spaces
            if (mandatory_ColumnsArr.Length > 0)
            {
                for (int i = 0; i < mandatory_ColumnsArr.Length; i++)
                {
                    mandatory_ColumnsArr[i] = mandatory_ColumnsArr[i].Trim();
                }
            }
            // Key Column Exist.
            if (Key_Column != null && Key_Column.Length > 0)
            {
                if (Array.IndexOf(mandatory_ColumnsArr, Key_Column) == -1)
                {
                    mandatory_Columns = mandatory_Columns + "," + Key_Column;
                }

            }
            return mandatory_Columns;
        }

        /// <summary>
        /// Retrievs the KYD Displayed Columns.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <returns></returns>
        public string GetKYDDisplayColumns(string company_Code, string key_Column, string mandatory_Columns)
        {
            _objIconfigsettings = new Config_Settings();

         //   string KeyColum = GetKYDDuplicateKeyColumnValue(company_Code);
           // string mandtoryColumns = GetKYDMandatoryColumns(company_Code, key_Column);

            string Display_Columns = _objIconfigsettings.GetConfigDefaultValue(company_Code, CONFIG_TYPE.KYD, CONFIG_KEY.KYD_DISPLAY_COLUMNS);
            string[] Display_ColumnsArr = Display_Columns.Split(',');

            //trim the unwanted spances
            if (Display_ColumnsArr.Length > 0)
            {
                for (int i = 0; i < Display_ColumnsArr.Length; i++)
                {
                    Display_ColumnsArr[i] = Display_ColumnsArr[i].Trim();
                }
            }
            // Merging Key and Mandatoty columns.
            // Key Column Exist.
            if (key_Column != null && key_Column.Length > 0)
            {
                if (Array.IndexOf(Display_ColumnsArr, key_Column) == -1)
                {
                    Display_Columns = Display_Columns + "," + key_Column;
                }

            }

            // Mandorty Columns exist.
            if (mandatory_Columns != null && mandatory_Columns.Length > 0)
            {
                string[] mandArray = mandatory_Columns.Split(',');

                for (int s = 0; s < mandArray.Length; s++)
                {
                    mandArray[s] = mandArray[s].Trim();
                }

                for (int i = 0; i < mandArray.Length; i++)
                {
                    if (Array.IndexOf(Display_ColumnsArr, mandArray[i]) == -1)
                    {
                        Display_Columns = Display_Columns + "," + mandArray[i];
                    }
                }

            }
            return Display_Columns;
        }

        /// <summary>
        /// Used to check KYD screen is Enabled for User Type or Not
        /// </summary>
        /// <param name="configEnable"></param>
        /// <param name="userTypeName"></param>
        /// <returns></returns>
        public string GetConfigValueforDesigantion(string companyCode, string userTypeName)
        {
            try
            {
                string configEnable = string.Empty;
                string configvaluefordesignation = string.Empty;

                //Retrive the config enable for Desigantion
                configEnable = _objIconfigsettings.GetConfigDefaultValue(companyCode, CONFIG_TYPE.KYD, CONFIG_KEY.IS_KYD_ENABLED_FOR_DESIGNATION); //Get config is enable or not
                
                if (!string.IsNullOrEmpty(configEnable))
                {                    

                    string[] configDesignation = configEnable.Split(',');
                    //trim unwanted spances
                    if (configDesignation.Length > 0)
                    {
                        for (int i = 0; i < configDesignation.Length; i++)
                        {
                            configDesignation[i] = configDesignation[i].Trim();
                        }
                    }

                    KYD_Config_Enabled _objconfigenable = new KYD_Config_Enabled();
                    if (Array.IndexOf(configDesignation, userTypeName) != -1)
                    {
                        configvaluefordesignation = "1";
                    }
                    else
                    {
                        configvaluefordesignation = "0";
                    }                    
                }
                else
                {
                    configvaluefordesignation = "0";
                }
                return configvaluefordesignation;
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// Used to get All config values
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public List<KYD_Config_Values> GetConfigValues(string companyCode, string userTypename)
        {
            try
            {
                _objIconfigsettings = new Config_Settings();

                KYD_Config_Values _objconfig = new KYD_Config_Values();
                List<KYD_Config_Values> lstconfigvalues = new List<KYD_Config_Values>();
                List<KYD_Config_Enabled> lstconfigforDesignation = new List<KYD_Config_Enabled>();
                string setconfigvaluefordesignation = string.Empty;
                string configvalueforDesignation = string.Empty;
                //Retrive Config value to enable the KYD screen                
                setconfigvaluefordesignation = GetConfigValueforDesigantion(companyCode, userTypename);
                configvalueforDesignation = setconfigvaluefordesignation;
                ////if (!string.IsNullOrEmpty(setconfigvaluefordesignation))
                ////{
                //        configvalueforDesignation = "1";
                  
                ///}
                //else
                //{
                //    configvalueforDesignation = "0";
                //}
                //Retrive Doctor_Duplicate check values
                string configvalueforDuplicatecheck = GetKYDDuplicateKeyColumnValue(companyCode);

                //Retrive config value for Mandatory columns
                string configvalueforMandatorycolumn = GetKYDMandatoryColumns(companyCode, configvalueforDuplicatecheck);

                //Retrive config value for Display columns
                string configvalueforDisplaycolumn = GetKYDDisplayColumns(companyCode, configvalueforDuplicatecheck, configvalueforMandatorycolumn);

                _objconfig.Config_KYDvaluesforDesignation = configvalueforDesignation;
                _objconfig.Config_DuplicatecheckColumn = configvalueforDuplicatecheck;
                _objconfig.Config_MandatoryColumns = configvalueforMandatorycolumn;
                _objconfig.Config_DisplayColumns = configvalueforDisplaycolumn;

                lstconfigvalues.Add(_objconfig);
                return lstconfigvalues;
            }
            catch
            {
                throw;
            }
        }


        /// <summary>
        /// Retrieves the KYD Customer List.
        /// based on Duplicate Key Value.
        /// </summary>
        /// <param name="company_Code"></param>
        /// <param name="user_Code"></param>
        /// <param name="DCR_Date"></param>
        /// <param name="key_Column"></param>
        /// <returns></returns>
        public IEnumerable<KYDModel> GetKYDCustomerList(string company_Code, string user_Code, string DCR_Date, string key_Column)
        {
            try
            {
                _objDALKYD = new DAL_KYD();
                return _objDALKYD.GetKYDCustomerList(company_Code, user_Code, DCR_Date, key_Column);
            }
            catch
            {
                throw;
            }
        }

        public List<KYDModel> DuplicateValidationOnKYD(string company_Code, string Key_Column, string KYDJson, string region_Code )
        {
            try
            {
                _objDALKYD = new DAL_KYD();
                IEnumerable<KYDModel> IKYDModel = (IEnumerable<KYDModel>)JsonConvert.DeserializeObject(KYDJson, typeof(List<KYDModel>));
                IKYDModel.ToList().ForEach(KYD => KYD.Region_Code = region_Code);

                return _objDALKYD.DuplicateValidationOnKYD(company_Code, Key_Column, IKYDModel);
            }
            catch
            {
                throw;
            }
        }


        public string SaveKYDInfo(string company_Code, string Key_Column, string KYDJson, string region_Code)
        {
            try
            {
                _objDALKYD = new DAL_KYD();
                IEnumerable<KYDModel> IKYDModel = (IEnumerable<KYDModel>)JsonConvert.DeserializeObject(KYDJson, typeof(List<KYDModel>));
                IKYDModel.ToList().ForEach(KYD => KYD.Region_Code = region_Code);

                return _objDALKYD.SaveKYDInfo(company_Code, IKYDModel);
            }
            catch
            {
                throw;
            }
        }
        #endregion Public Methods
    }
}
