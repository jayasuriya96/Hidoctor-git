#region Using
using System;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.Text;
using System.Collections.Generic;
#endregion Using

namespace DataControl
{
    public class CurrentInfo
    {
        #region System generated
        //
        // GET: /DataControl.CurrentInfo/


        #endregion System generated

        Data _objData = new Data();

        public bool SetCompanyCode()
        {
            bool isTrue = false;

            if (System.Web.HttpContext.Current.Session["Comp_Code"] == null)
            {
                string subDomainName = System.Web.HttpContext.Current.Request.Url.DnsSafeHost;
                DataSet dsCredentials = new DataSet();
                SPData objData = new SPData();
                try
                {
                    dsCredentials = objData.GetConnectionString(subDomainName);

                    if (dsCredentials != null && dsCredentials.Tables.Count > 0 && dsCredentials.Tables[0].Rows.Count > 0)
                    {
                        System.Web.HttpContext.Current.Session["Comp_Code"] = dsCredentials.Tables[0].Rows[0]["CompanyCode"].ToString().Trim();
                        System.Web.HttpContext.Current.Session["SubDomain"] = dsCredentials.Tables[0].Rows[0]["SubDomain"].ToString().Trim();
                        System.Web.HttpContext.Current.Session["SFAWAUrl"] = dsCredentials.Tables[0].Rows[0]["SFAWAUrl"].ToString().Trim();
                        System.Web.HttpContext.Current.Session["SalesDriveUrl"] = dsCredentials.Tables[0].Rows[0]["SalesDriveUrl"].ToString().Trim();
                        System.Web.HttpContext.Current.Session["WideAngleUrl"] = dsCredentials.Tables[0].Rows[0]["WideAngleUrl"].ToString().Trim();
                        System.Web.HttpContext.Current.Session["OneLibUrl"] = dsCredentials.Tables[0].Rows[0]["OneLibUrl"].ToString().Trim();
                        System.Web.HttpContext.Current.Session["Is_Payroll_Integrated"] = dsCredentials.Tables[0].Rows[0]["Is_Payroll_Integrated"].ToString().Trim();
                        System.Web.HttpContext.Current.Session["Payroll_Integrated_URL"] = dsCredentials.Tables[0].Rows[0]["Payroll_Integrated_URL"].ToString().Trim();
                        System.Web.HttpContext.Current.Session["Payroll_Security_Token"] = dsCredentials.Tables[0].Rows[0]["Payroll_Security_Token"].ToString().Trim();
                        System.Web.HttpContext.Current.Session["Payroll_Vendor_Security_Token"] = dsCredentials.Tables[0].Rows[0]["Payroll_Vendor_Security_Token"].ToString().Trim();
                        System.Web.HttpContext.Current.Session["Is_Kangle_Integrated"] = dsCredentials.Tables[0].Rows[0]["Is_Kangle_Integrated"].ToString().Trim();
                        System.Web.HttpContext.Current.Session["KangleUrl"] = dsCredentials.Tables[0].Rows[0]["KangleUrl"].ToString().Trim();
                        System.Web.HttpContext.Current.Session["FormsManagement_Integrated"] = dsCredentials.Tables[0].Rows[0]["FormsManagement_Integrated"].ToString().Trim();
                        System.Web.HttpContext.Current.Session["FormsManagement_URL"] = dsCredentials.Tables[0].Rows[0]["FormsManagement_URL"].ToString().Trim();
                        System.Web.HttpContext.Current.Session["FAQ_Url"] = dsCredentials.Tables[0].Rows[0]["FAQ_Url"].ToString().Trim();
                        System.Web.HttpContext.Current.Session["EDetailing_URL"] = dsCredentials.Tables[0].Rows[0]["EDetailing_URL"].ToString().Trim();
                        System.Web.HttpContext.Current.Session["CompanyId"] = dsCredentials.Tables[0].Rows[0]["CompanyId"].ToString().Trim();
                        System.Web.HttpContext.Current.Session["CommonPassword"] = dsCredentials.Tables[0].Rows[0]["CommonPassword"].ToString().Trim();
                        System.Web.HttpContext.Current.Session["GeoLocationSupport"] = "NO";
                        if (dsCredentials.Tables[0].Rows[0]["GeoLocationSupport"].ToString().Trim().ToUpper() == "1"
                            || dsCredentials.Tables[0].Rows[0]["GeoLocationSupport"].ToString().Trim().ToUpper() == "TRUE")
                        {
                            System.Web.HttpContext.Current.Session["GeoLocationSupport"] = "YES";

                        }
                        System.Web.HttpContext.Current.Session["HRMS_URL"] = dsCredentials.Tables[0].Rows[0]["HRMS_URL"].ToString().Trim();
                        System.Web.HttpContext.Current.Session["Is_HRMS_Integrated"] = dsCredentials.Tables[0].Rows[0]["Is_HRMS_Integrated"].ToString().Trim();

                        // KRA Integration 
                        System.Web.HttpContext.Current.Session["KRA_URL"] = dsCredentials.Tables[0].Rows[0]["KRA_URL"].ToString().Trim();
                        System.Web.HttpContext.Current.Session["Is_KRA_Integrated"] = dsCredentials.Tables[0].Rows[0]["Is_KRA_Integrated"].ToString().Trim();


                        //SetCommonPassword(dsCredentials);
                        //SetGeoLocationSupport(dsCredentials);

                        isTrue = true;
                    }
                }
                finally
                {
                    dsCredentials.Dispose();
                }
            }

            return isTrue;
        }

        private void SetCommonPassword(DataSet dsCredentials)
        {

            if (dsCredentials != null && dsCredentials.Tables.Count > 0 && dsCredentials.Tables[0].Rows != null)
            {
                if (dsCredentials.Tables[0].Rows.Count > 0)
                {
                    System.Web.HttpContext.Current.Session["CommonPassword"] =
                        dsCredentials.Tables[0].Rows[0]["CommonPassword"].ToString().Trim();
                }
            }
        }

        private void SetGeoLocationSupport(DataSet dsCredentials)
        {
            string NeedToGetGeoLocationSupport = "NO";
            if (dsCredentials != null && dsCredentials.Tables.Count > 0 && dsCredentials.Tables[0].Rows.Count > 0)
            {
                if (dsCredentials.Tables[0].Rows[0]["GeoLocationSupport"].ToString().Trim().ToUpper() == "1"
                    || dsCredentials.Tables[0].Rows[0]["GeoLocationSupport"].ToString().Trim().ToUpper() == "TRUE")
                {
                    NeedToGetGeoLocationSupport = "YES";

                }
            }

            System.Web.HttpContext.Current.Session["GeoLocationSupport"] = NeedToGetGeoLocationSupport;

        }



        public string GetCompanyCode()
        {
            return System.Web.HttpContext.Current.Session["Comp_Code"].ToString();
        }
        public string GetCompanyId()
        {
            return System.Web.HttpContext.Current.Session["CompanyId"].ToString();
        }
        public string GetSubDomain()
        {
            return System.Web.HttpContext.Current.Session["SubDomain"].ToString();
        }
        public string GetUserCode()
        {
            return System.Web.HttpContext.Current.Session["User_Code"].ToString();
        }

        public string GetRegionCode()
        {
            return System.Web.HttpContext.Current.Session["Region_Code"].ToString();
        }
        public string GetSFAWAUrl()
        {
            return System.Web.HttpContext.Current.Session["SFAWAUrl"].ToString();
        }
        public string GetSalesDriveUrl()
        {
            return System.Web.HttpContext.Current.Session["SalesDriveUrl"].ToString();
        }
        public string GetWideAngleUrl()
        {
            return System.Web.HttpContext.Current.Session["WideAngleUrl"].ToString();
        }
        public string GetOneLibUrl()
        {
            return System.Web.HttpContext.Current.Session["OneLibUrl"].ToString();
        }
        public string GetKangleUrl()
        {
            return System.Web.HttpContext.Current.Session["KangleUrl"].ToString();
        }
        public string GetPayrollIntegratedURL()
        {
            return System.Web.HttpContext.Current.Session["Payroll_Integrated_URL"].ToString();
        }
        public string GetEDetailing()
        {
            return System.Web.HttpContext.Current.Session["EDetailing_URL"].ToString();
        }
        public string GetPayrollSecurityToken()
        {
            return System.Web.HttpContext.Current.Session["Payroll_Security_Token"].ToString();
        }
        public string GetPayrollVendorSecurityToken()
        {
            return System.Web.HttpContext.Current.Session["Payroll_Vendor_Security_Token"].ToString();
        }
        public bool GetPayRollIntegratedStatus()
        {
            if (System.Web.HttpContext.Current.Session["Is_Payroll_Integrated"] != null && System.Web.HttpContext.Current.Session["Is_Payroll_Integrated"].ToString().Length > 0)
            {
                return Convert.ToBoolean(System.Web.HttpContext.Current.Session["Is_Payroll_Integrated"]);
            }
            else
            {
                return false;
            }
        }

        public bool GetIsKangleIntegrated()
        {
            if (System.Web.HttpContext.Current.Session["Is_Kangle_Integrated"] != null && System.Web.HttpContext.Current.Session["Is_Kangle_Integrated"].ToString().Length > 0)
            {
                return Convert.ToBoolean(System.Web.HttpContext.Current.Session["Is_Kangle_Integrated"]);
            }
            else
            {
                return false;
            }
        }
        public string GetUserTypeName()
        {
            return System.Web.HttpContext.Current.Session["User_Type_Name"].ToString();
        }

        public string GetRegionName()
        {
            return System.Web.HttpContext.Current.Session["Region_Name"].ToString();
        }

        public string GetUserTypeCode()
        {
            return System.Web.HttpContext.Current.Session["User_Type_Code"].ToString();
        }

        public string GetUserName()
        {
            return System.Web.HttpContext.Current.Session["User_Name"].ToString();
        }

        public string GetEmployeeName()
        {
            return System.Web.HttpContext.Current.Session["Employee_Name"].ToString();
        }
        public string GetEmployeeCode()
        {
            return System.Web.HttpContext.Current.Session["Employee_Code"].ToString();
        }
        public string GetEmployeeNumber()
        {
            return System.Web.HttpContext.Current.Session["Employee_Number"].ToString();
        }
        public string GetCommonPassword()
        {
            return System.Web.HttpContext.Current.Session["CommonPassword"].ToString();
        }
        public string GetDCRCode(string dcrDate)
        {
            string userName = GetUserName();
            string dcrCode = "DCR" + userName + dcrDate.Split('-')[2].Trim() + dcrDate.Split('-')[1].Trim() + dcrDate.Split('-')[0].Trim();
            return dcrCode;
        }

        public string GetLattitude()
        {
            return System.Web.HttpContext.Current.Session["Latitude"].ToString().Trim();
        }

        public string GetLongitude()
        {
            return System.Web.HttpContext.Current.Session["Longitude"].ToString().Trim();
        }

        public string GetLocation()
        {
            return System.Web.HttpContext.Current.Session["Location"].ToString().Trim();
        }

        public string GetGeoUrl()
        {
            return System.Web.HttpContext.Current.Session["GeoLocationSupport"].ToString().Trim();
        }

        public string GetSessionId()
        {
            return System.Web.HttpContext.Current.Session["S_Id"].ToString();
        }

        public string GetPayrollUserId()
        {
            return System.Web.HttpContext.Current.Session["Payroll_User_Id"].ToString();
        }
        public string GetUserTypeCategory()
        {
            return Convert.ToString(System.Web.HttpContext.Current.Session["User_Type_Category"]);
        }
        public string GetSFAWA_ClickTime()
        {
            if (System.Web.HttpContext.Current.Session["SFAWA_ClickTime"] != null)
            {
                return System.Web.HttpContext.Current.Session["SFAWA_ClickTime"].ToString();
            }
            else
            {
                System.Web.HttpContext.Current.Session["SFAWA_ClickTime"] = DateTime.Now;
                return System.Web.HttpContext.Current.Session["SFAWA_ClickTime"].ToString();
            }
        }

        public void SetCurrentInfo(string companyCode, string userCode)
        {
            SPData objData = new SPData();
            DataSet dsCurrentInfo = objData.GetUserCurrentInfo(companyCode, userCode);
            try
            {
                System.Web.HttpContext.Current.Session["Comp_Code"] = companyCode;
                System.Web.HttpContext.Current.Session["User_Code"] = userCode;
                System.Web.HttpContext.Current.Session["User_Name"] = dsCurrentInfo.Tables[0].Rows[0]["User_Name"].ToString();
                System.Web.HttpContext.Current.Session["Employee_Name"] = dsCurrentInfo.Tables[0].Rows[0]["Employee_Name"].ToString();
                System.Web.HttpContext.Current.Session["Region_Code"] = dsCurrentInfo.Tables[0].Rows[0]["Region_Code"].ToString();
                System.Web.HttpContext.Current.Session["Region_Name"] = dsCurrentInfo.Tables[0].Rows[0]["Region_Name"].ToString();
                System.Web.HttpContext.Current.Session["User_Type_Code"] = dsCurrentInfo.Tables[0].Rows[0]["User_Type_Code"].ToString();
                System.Web.HttpContext.Current.Session["User_Type_Name"] = dsCurrentInfo.Tables[0].Rows[0]["User_Type_Name"].ToString();
                System.Web.HttpContext.Current.Session["S_Id"] = System.Web.HttpContext.Current.Session.SessionID + DateTime.Now;
            }
            finally
            {
                dsCurrentInfo.Dispose();
            }
        }

        public void UserAuthendication(string companyCode, string userCode, string sessionID)
        {
            Data objData = new Data();
            DataSet dsCurrentInfo = new DataSet();
            try
            {
                // check authendication.
                objData.OpenConnection(companyCode);
                {
                    dsCurrentInfo = objData.ExecuteDataSet("exec SP_hdUserAuthendication '" + companyCode + "','" + userCode + "','" + sessionID + "'");
                }

                if (dsCurrentInfo.Tables.Count > 0)
                {
                    if (dsCurrentInfo.Tables[0].Rows.Count > 0)
                    {
                        System.Web.HttpContext.Current.Session["Comp_Code"] = companyCode;
                        System.Web.HttpContext.Current.Session["User_Code"] = userCode;
                        System.Web.HttpContext.Current.Session["User_Name"] = dsCurrentInfo.Tables[0].Rows[0]["User_Name"].ToString();
                        System.Web.HttpContext.Current.Session["Region_Code"] = dsCurrentInfo.Tables[0].Rows[0]["Region_Code"].ToString();
                        System.Web.HttpContext.Current.Session["Region_Name"] = dsCurrentInfo.Tables[0].Rows[0]["Region_Name"].ToString();
                        System.Web.HttpContext.Current.Session["User_Type_Code"] = dsCurrentInfo.Tables[0].Rows[0]["User_Type_Code"].ToString();
                        System.Web.HttpContext.Current.Session["User_Type_Name"] = dsCurrentInfo.Tables[0].Rows[0]["User_Type_Name"].ToString();
                        System.Web.HttpContext.Current.Session["Latitude"] = dsCurrentInfo.Tables[0].Rows[0]["Lattitude"].ToString();
                        System.Web.HttpContext.Current.Session["Longitude"] = dsCurrentInfo.Tables[0].Rows[0]["Longitude"].ToString();
                        System.Web.HttpContext.Current.Session["Location"] = dsCurrentInfo.Tables[0].Rows[0]["Location"].ToString();
                    }
                    else
                    {
                        // Redirect to session expired page.
                    }
                }
            }
            catch
            {
                throw;
            }
            finally
            {
                objData.CloseConnection();

                dsCurrentInfo.Dispose();
            }
        }


        public string GetPrivilegeValue(string privilegeName, string defaultValue)
        {
            string returnValue = defaultValue;

            if (System.Web.HttpContext.Current.Session["Privilege_Data"] != null)
            {
                DataSet dsPrivilege = (DataSet)System.Web.HttpContext.Current.Session["Privilege_Data"];
                DataRow[] rowFilter;

                rowFilter = dsPrivilege.Tables[0].Select("Privilege_Name = '" + privilegeName + "'");
                if (rowFilter.Length > 0)
                {
                    returnValue = rowFilter[0]["Privilege_Value_Name"].ToString().Trim();
                }
            }

            return returnValue.Trim().ToUpper();
        }

        public void SetPrivilegeValues(DataSet dsPrivilege)
        {
            System.Web.HttpContext.Current.Session["Privilege_Data"] = dsPrivilege;
        }

        public void SetGeoLocationDetails(string latitude, string longitude, string location)
        {
            System.Web.HttpContext.Current.Session["Latitude"] = latitude;
            System.Web.HttpContext.Current.Session["Longitude"] = longitude;
            System.Web.HttpContext.Current.Session["Location"] = location;
        }
        public void SetUserInfo(DataSet dsUserInfo)
        {
            System.Web.HttpContext.Current.Session["Employee_Name"] = dsUserInfo.Tables[0].Rows[0]["Employee_Name"].ToString().Trim();
            System.Web.HttpContext.Current.Session["User_Code"] = dsUserInfo.Tables[0].Rows[0]["User_Code"].ToString().Trim();
            System.Web.HttpContext.Current.Session["User_Name"] = dsUserInfo.Tables[0].Rows[0]["User_Name"].ToString().Trim();
            System.Web.HttpContext.Current.Session["User_Type_Code"] = dsUserInfo.Tables[0].Rows[0]["User_Type_Code"].ToString().Trim();
            System.Web.HttpContext.Current.Session["User_Type_Name"] = dsUserInfo.Tables[0].Rows[0]["User_Type_Name"].ToString().Trim();
            System.Web.HttpContext.Current.Session["Region_Code"] = dsUserInfo.Tables[0].Rows[0]["Region_Code"].ToString().Trim();
            System.Web.HttpContext.Current.Session["Region_Name"] = dsUserInfo.Tables[0].Rows[0]["Region_Name"].ToString().Trim();
            System.Web.HttpContext.Current.Session["S_Id"] = System.Web.HttpContext.Current.Session.SessionID + DateTime.Now;
            System.Web.HttpContext.Current.Session["Payroll_User_Id"] = dsUserInfo.Tables[0].Rows[0]["Payroll_User_Id"].ToString().Trim();
            System.Web.HttpContext.Current.Session["User_Type_Category"] = dsUserInfo.Tables[0].Rows[0]["User_Type_Category"].ToString().Trim();
            System.Web.HttpContext.Current.Session["Employee_Code"] = dsUserInfo.Tables[0].Rows[0]["Employee_Code"].ToString();
            System.Web.HttpContext.Current.Session["Employee_Number"] = dsUserInfo.Tables[0].Rows[0]["Employee_Number"].ToString();
        }

        public static bool IsMobile(string userAgent)
        {
            userAgent = userAgent.ToLower();
            //return true;
            return userAgent.Contains("iphone") |
                userAgent.Contains("ppc") |
                userAgent.Contains("windows ce") |
                userAgent.Contains("blackberry") |
                userAgent.Contains("operamini") |
                userAgent.Contains("opera mini") |
                userAgent.Contains("opera mobi") |
                userAgent.Contains("mobile") |
                userAgent.Contains("palm") |
                userAgent.Contains("midp") |
                userAgent.Contains("portable") |
                userAgent.Contains("android");
        }

        public string GetConnectionString()
        {

            if (System.Web.HttpContext.Current.Session["Connection_String"] == null)
            {
                string subDomainName = System.Web.HttpContext.Current.Request.Url.DnsSafeHost;
                DataSet dsCredentials = new DataSet();
                SPData objData = new SPData();
                StringBuilder connectionString = new StringBuilder();
                dsCredentials = objData.GetConnectionString(subDomainName);
                DataTable dtCredentials = dsCredentials.Tables[0];
                if (dtCredentials != null && dtCredentials.Rows.Count > 0)
                {
                    connectionString.Append("data source=");
                    connectionString.Append(dtCredentials.Rows[0]["SqlIPAddress"].ToString().Trim());
                    connectionString.Append(";Initial Catalog=");
                    connectionString.Append(dtCredentials.Rows[0]["DatabaseName"].ToString().Trim());
                    connectionString.Append(";User Id=");
                    connectionString.Append(dtCredentials.Rows[0]["SqlLoginId"].ToString().Trim());
                    connectionString.Append(";Password=");
                    connectionString.Append(dtCredentials.Rows[0]["SqlPassword"].ToString().Trim());

                    System.Web.HttpContext.Current.Session["Connection_String"] = connectionString.ToString();
                }

            }



            return System.Web.HttpContext.Current.Session["Connection_String"].ToString();
        }

        public string GetArchiveConnectionString()
        {

            if (System.Web.HttpContext.Current.Session["Connection_String"] != null)
            {
                string subDomainName = System.Web.HttpContext.Current.Request.Url.DnsSafeHost;
                DataSet dsCredentials = new DataSet();
                SPData objData = new SPData();
                StringBuilder connectionString = new StringBuilder();
                dsCredentials = objData.GetArchiveConnectionString(subDomainName);
                DataTable dtCredentials = dsCredentials.Tables[0];
                if (dtCredentials != null && dtCredentials.Rows.Count > 0)
                {
                    connectionString.Append("data source=");
                    connectionString.Append(dtCredentials.Rows[0]["RptSqlIPAddress"].ToString().Trim());
                    connectionString.Append(";Initial Catalog=");
                    connectionString.Append(dtCredentials.Rows[0]["RptDatabaseName"].ToString().Trim());
                    connectionString.Append(";User Id=");
                    connectionString.Append(dtCredentials.Rows[0]["RptSqlLoginId"].ToString().Trim());
                    connectionString.Append(";Password=");
                    connectionString.Append(dtCredentials.Rows[0]["RptSqlPassword"].ToString().Trim());

                    System.Web.HttpContext.Current.Session["Connection_String"] = connectionString.ToString();
                }

            }



            return System.Web.HttpContext.Current.Session["Connection_String"].ToString();
        }

        public void SetDoctorMasterSelectedRegion(string SelectedRegionCode)
        {
            System.Web.HttpContext.Current.Session["SeletedRegionCode"] = SelectedRegionCode;
        }


        public string GetDoctorMasterSelectedRegion()
        {
            return System.Web.HttpContext.Current.Session["SeletedRegionCode"].ToString();
        }

        public bool GetFormManagementIntegratedStatus()
        {
            if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Session["FormsManagement_Integrated"].ToString()) && System.Web.HttpContext.Current.Session["FormsManagement_Integrated"].ToString().Length > 0)
            {
                return Convert.ToBoolean(System.Web.HttpContext.Current.Session["FormsManagement_Integrated"]);
            }
            else
            {
                return false;
            }
        }

        public string GetFormManagementURL()
        {
            string formmanagementurl = string.Empty;

            if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Session["FormsManagement_URL"].ToString()))
            {
                return formmanagementurl = System.Web.HttpContext.Current.Session["FormsManagement_URL"].ToString();
            }
            else
            {
                return formmanagementurl;
            }
        }

        public bool GetHRMSIntegratedStatus()
        {
            if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Session["Is_HRMS_Integrated"].ToString()) && System.Web.HttpContext.Current.Session["Is_HRMS_Integrated"].ToString().Length > 0)
            {
                return Convert.ToBoolean(System.Web.HttpContext.Current.Session["Is_HRMS_Integrated"]);
            }
            else
            {
                return false;
            }
        }
        public string GetHRMURL()
        {
            string hrmsUrl = string.Empty;

            if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Session["HRMS_URL"].ToString()))
            {
                return hrmsUrl = System.Web.HttpContext.Current.Session["HRMS_URL"].ToString();
            }
            else
            {
                return hrmsUrl;
            }
        }

        public bool GetKRAIntegratedStatus()
        {
            if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Session["Is_KRA_Integrated"].ToString()) && System.Web.HttpContext.Current.Session["Is_KRA_Integrated"].ToString().Length > 0)
            {
                return Convert.ToBoolean(System.Web.HttpContext.Current.Session["Is_KRA_Integrated"]);
            }
            else
            {
                return false;
            }
        }
        public string GetKRAURL()
        {
            string kraUrl = string.Empty;

            if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Session["KRA_URL"].ToString()))
            {
                return kraUrl = System.Web.HttpContext.Current.Session["KRA_URL"].ToString();
            }
            else
            {
                return kraUrl;
            }
        }

    }
}