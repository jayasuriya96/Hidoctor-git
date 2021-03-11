using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.Threading.Tasks;
using System.Collections;
using System.Text;
using DataControl;
using HiDoctor_Master.Models;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class PrivilegeMasterController : Controller
    {
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        private SPData _objSPData = new SPData();
        DataControl.Data _objData = new DataControl.Data();
        #region "PrivilegeMaster"
        /// <summary>
        /// Privilege Master Screen
        /// </summary>
        /// <returns></returns>       

        public ActionResult PrivilegeMaster()
        {
            return View();
        }
        public ActionResult PrivilegeMappingSD()
        {
            return View();
        }
        /// <summary>
        /// Get Feature Name
        /// </summary>
        /// <returns></returns>
        public string GetFeatureName()
        {
            try
            {
                BLMaster objMaster = new BLMaster();
                StringBuilder strChk = new StringBuilder();
                List<MVCModels.HiDoctor_Master.FeatureModel> lstFeatureName = new List<MVCModels.HiDoctor_Master.FeatureModel>();
                string companyCode = _objcurrentInfo.GetCompanyCode();
                lstFeatureName = (List<MVCModels.HiDoctor_Master.FeatureModel>)objMaster.GetActiveFeatre(companyCode);

                var FeatureList = (from feature in lstFeatureName.AsEnumerable()
                                   select new MVCModels.HiDoctor_Master.FeatureModel()
                                   {
                                       Feature_Code = feature.Feature_Code.ToString(),
                                       Feature_Name = feature.Feature_Name.ToString()
                                   }).ToList<MVCModels.HiDoctor_Master.FeatureModel>();
                if (FeatureList.Count() > 0 && FeatureList != null)
                {
                    foreach (var lstfeature in FeatureList)
                    {
                        strChk.Append("<table>");
                        for (int i = 0; i < FeatureList.Count(); i++)
                        {
                            strChk.Append("<tr id=" + i + ">");
                        }

                        strChk.Append("<td>");
                        strChk.Append("<input type='checkbox' value=" + lstfeature.Feature_Code + " name='chkFeature' id ='chkFeature' />");
                        strChk.Append("</td>");
                        strChk.Append("<td>");
                        strChk.Append(lstfeature.Feature_Name);
                        strChk.Append("</td>");
                        strChk.Append("</tr>");
                        strChk.Append("</table>");
                    }

                }
                else
                {
                    strChk.Append("No Features Found");
                }

                return strChk.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return ex.Message.ToString();
            }
        }

        /// <summary>
        /// GetLiteralName
        /// </summary>
        /// <returns></returns>
        public string GetLiteralName()
        {
            try
            {
                BLMaster objMaster = new BLMaster();
                StringBuilder strChk = new StringBuilder();
                List<MVCModels.HiDoctor_Master.PrivilegeMasterModel> lstLiterals = new List<MVCModels.HiDoctor_Master.PrivilegeMasterModel>();
                string companyCode = _objcurrentInfo.GetCompanyCode();
                lstLiterals = (List<MVCModels.HiDoctor_Master.PrivilegeMasterModel>)objMaster.GetActivePrivilegeValue(companyCode);

                var litralList = (from literals in lstLiterals.AsEnumerable()
                                  select new MVCModels.HiDoctor_Master.PrivilegeMasterModel()
                                  {
                                      Privilege_Value_Code = literals.Privilege_Value_Code.ToString(),
                                      Privilege_Value_Name = literals.Privilege_Value_Name.ToString()
                                  }).ToList<MVCModels.HiDoctor_Master.PrivilegeMasterModel>();
                if (litralList.Count() > 0 && litralList != null)
                {
                    foreach (var litral in litralList)
                    {
                        strChk.Append("<table>");
                        strChk.Append("<tr>");
                        strChk.Append("<td>");
                        strChk.Append("<input type='checkbox' id='chkLitral' value='" + litral.Privilege_Value_Code + "' name='chkLitral'/>");
                        strChk.Append("</td>");
                        strChk.Append("<td>");
                        strChk.Append(litral.Privilege_Value_Name);
                        strChk.Append("</td>");
                        strChk.Append("</tr>");
                        strChk.Append("</table>");
                    }
                }

                else
                {
                    strChk.Append("No Literal Found");
                }

                return strChk.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return ex.Message.ToString();
            }
        }
        /// <summary>
        // Return the string into Table
        /// </summary>
        /// <returns></returns>       
        public string GetPrivilegeMaster(string searchName)
        {
            string companycode = _objcurrentInfo.GetCompanyCode();
            try
            {
                BLMaster _objmaster = new BLMaster();
                List<MVCModels.HiDoctor_Master.PrivilegeandFeatureMasterModel> lstPrivilegeandFeature = new List<MVCModels.HiDoctor_Master.PrivilegeandFeatureMasterModel>();
                string featureCodes = "";
                if ("undefined" == searchName)
                {
                    searchName = "";
                }
                lstPrivilegeandFeature = (List<MVCModels.HiDoctor_Master.PrivilegeandFeatureMasterModel>)_objmaster.GetPrivilegeandActiveMaster(companycode, searchName);
                //dsc            
                StringBuilder sb = new StringBuilder();

                if (lstPrivilegeandFeature[0].lstPrivilegeMaster != null && lstPrivilegeandFeature[0].lstPrivilegeMaster.Count() > 0)
                {
                    sb.Append("<table WIDTH='100%' id='tblsummary' class='table table-striped' >");
                    sb.Append("<thead class='active'>");
                    sb.Append("<tr style='background-color:#428bca;'>");
                    sb.Append("<td>Edit</td>");
                    sb.Append("<td>Privilege Name</td>");
                    sb.Append("<td>Base Privilege</td>");
                    sb.Append("<td>Feature Name</td>");
                    sb.Append("<td>Description</td>");
                    sb.Append("<td>Value Type</td>");
                    sb.Append("<td>Lookup Table</td>");
                    sb.Append("<td>Lookup Column</td>");
                    sb.Append("</tr>");
                    sb.Append("</thead>");
                    sb.Append("<tbody>");
                    int i = 0;

                    foreach (var lstprivilege in lstPrivilegeandFeature[0].lstPrivilegeMaster)
                    {
                        i++;
                        sb.Append("<td>");
                        sb.Append("<a href='#' id='pricode_" + lstprivilege.Privilege_Code + "' onclick='fnEditprivilegeMaster(\"" + lstprivilege.Privilege_Code + "|" + lstprivilege.Privilege_Name + "\")'>Edit</a>");
                        sb.Append("</td>");

                        //PrivilegeName
                        sb.Append("<td id='priName_" + lstprivilege.Privilege_Name + "'>");
                        sb.Append(lstprivilege.Privilege_Name);
                        sb.Append("</td>");
                        //Base Privilege
                        sb.Append("<td id='basePrivilege_" + lstprivilege.Privilege_Code + "'>");
                        sb.Append(lstprivilege.Base_Privilege_Name);
                        sb.Append("</td>");

                        featureCodes = lstprivilege.Feature_Code.ToString();
                        string[] alFeaturecodes = featureCodes.Split(',');
                        featureCodes = string.Empty;
                        for (int featureIndex = 0; featureIndex < alFeaturecodes.Length; featureIndex++)
                        {
                            featureCodes += alFeaturecodes[featureIndex].ToString() + ',';
                            // featureCodes += "'" + alFeaturecodes[featureIndex].ToString() + "',";
                        }

                        featureCodes = featureCodes.LastIndexOf(',') != -1 ? featureCodes.Remove(featureCodes.Length - 1) : featureCodes;
                        var lstFeatureName = lstPrivilegeandFeature[0].lstFeatureMaster.Where(s => featureCodes.Contains(s.Feature_Code)).ToList();
                        string featuresNames = string.Empty;

                        foreach (var featurename in lstFeatureName)
                        {
                            featuresNames += featurename.Feature_Name.ToString().Trim() + ',';
                        }
                        //Feature Name
                        sb.Append("<td id='featureName_" + lstprivilege.Privilege_Code + "'>");
                        sb.Append(featuresNames.TrimEnd(','));
                        sb.Append("</td>");

                        sb.Append("<td style='display:none' id='featureCode_" + lstprivilege.Privilege_Code + "'>" + featureCodes + "</td>");
                        //Description
                        sb.Append("<td id='descri_" + lstprivilege.Privilege_Code + "'>");
                        sb.Append(lstprivilege.Description);
                        sb.Append("</td>");
                        //Value Type
                        sb.Append("<td id='ValueType_" + lstprivilege.Privilege_Code + "'>");
                        sb.Append(lstprivilege.Privilege_Value_Type);
                        sb.Append("</td>");
                        //Look Up Table
                        sb.Append("<td id='lookUptbl_" + lstprivilege.Privilege_Code + "'>");
                        sb.Append(lstprivilege.Lookup_Table);
                        sb.Append("</td>");
                        //Look Up Column
                        sb.Append("<td id='lookUpColumn_" + lstprivilege.Privilege_Code + "'>");
                        sb.Append(lstprivilege.Lookup_Column);
                        sb.Append("</td>");

                        sb.Append("</tr>");
                    }
                    sb.Append("</tbody>");
                    sb.Append("</table>");
                }
                else
                {
                    sb.Append("No Records To Display");
                }
                return sb.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return ex.Message.ToString();
            }
        }
        /// <summary>
        /// Get BasePrivilegeName
        /// </summary>
        /// <returns></returns>
        public JsonResult GetBasePrivilegeName()
        {
            BLMaster objMaster = new BLMaster();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            List<MVCModels.HiDoctor_Master.PrivilegeMasterModel> lstActivePrivilege = new List<MVCModels.HiDoctor_Master.PrivilegeMasterModel>();
            List<MVCModels.HiDoctor_Master.PrivilegeMasterModel> lstAllprivilegeValue = new List<MVCModels.HiDoctor_Master.PrivilegeMasterModel>();
            lstActivePrivilege = objMaster.GetActivePrivilegeMasterValues(companyCode).ToList();
            //lstAllprivilegeValue = objMaster.GetAllPrivilegesFromMaster(companyCode).ToList();
            DataControl.JSONConverter objJson = new DataControl.JSONConverter();
            return Json(objJson.Serialize(lstActivePrivilege));
        }
        /// <summary>
        /// Check LitralValue
        /// </summary>
        /// <param name="litralValue"></param>
        /// <returns></returns>
        public string checkLitralValue(string litralValue)
        {
            StringBuilder strContent = new StringBuilder();           
            try
            {
                BLMaster objMaster = new BLMaster();
                string companyCode = _objcurrentInfo.GetCompanyCode();
                if (!string.IsNullOrEmpty(litralValue))
                {
                    List<MVCModels.HiDoctor_Master.PrivilegeMasterModel> lstAllprivilegeValue = new List<MVCModels.HiDoctor_Master.PrivilegeMasterModel>();
                    lstAllprivilegeValue = objMaster.GetAllprivilegeValue(companyCode).ToList();
                    if (lstAllprivilegeValue.Count > 0 && lstAllprivilegeValue != null)
                    {
                        var privilegeValueName = lstAllprivilegeValue.Where(x => x.Privilege_Value_Name.ToUpper() == litralValue).ToList();
                        if (privilegeValueName.Count > 0)
                        {
                            if (lstAllprivilegeValue[0].Record_Status == "1")
                            {
                                strContent.Append(litralValue + " value already exists.");
                            }
                            else if (lstAllprivilegeValue[0].Record_Status == "0")
                            {
                                strContent.Append(litralValue + " value already exists but status is inactive.");
                            }
                        }
                    }                    
                }  
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("litralValue", litralValue);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }
            string result = strContent.ToString();
            if (string.IsNullOrEmpty(result))
            {
                result = "SUCCESS";
            }
            return result;
        }

        public string InsertLitralValue(string litralValue)
        {
            string result = string.Empty;
            try
            {
                BLMaster objMaster = new BLMaster();
                if (!string.IsNullOrEmpty(litralValue))
                {
                    MVCModels.HiDoctor_Master.PrivilegeMasterModel objPrivilegeMaster = new MVCModels.HiDoctor_Master.PrivilegeMasterModel();
                    List<MVCModels.HiDoctor_Master.PrivilegeMasterModel> lstlirals = new List<MVCModels.HiDoctor_Master.PrivilegeMasterModel>();
                    objPrivilegeMaster.Company_Code = _objcurrentInfo.GetCompanyCode();
                    objPrivilegeMaster.Privilege_Value_Name = litralValue;
                    objPrivilegeMaster.Record_Status = "1";
                    objPrivilegeMaster.Row_Version_No = "0";
                    lstlirals.Add(objPrivilegeMaster);
                    int rowsAffected = 0;
                    rowsAffected = objMaster.InsertPrivilegeValue(lstlirals);
                    if (rowsAffected > 0)
                    {
                        result = "SUCCESS:" + litralValue + " value Added Successfully ";
                    }
                    else
                    {
                        result = "ERROR:Error while inserted " + litralValue;
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }
            return result;
        }

        public void PutPrivilegeMasterintoExcel(string searchName)
        {
            string companycode = _objcurrentInfo.GetCompanyCode();
            string error = string.Empty;
            try
            {
                BLMaster _objmaster = new BLMaster();
                DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();
                DataControl.Abstraction.IFileProvider objProvider = new DataControl.Impl.FileSystemProvider();
                List<MVCModels.HiDoctor_Master.PrivilegeandFeatureMasterModel> lstPrivilegeandFeature = new List<MVCModels.HiDoctor_Master.PrivilegeandFeatureMasterModel>();
                string featureCodes = "";
                if (string.IsNullOrEmpty(searchName))
                {
                    searchName = "";
                }
                lstPrivilegeandFeature = (List<MVCModels.HiDoctor_Master.PrivilegeandFeatureMasterModel>)_objmaster.GetPrivilegeandActiveMaster(companycode, searchName);

                //dsc
                StringBuilder sb = new StringBuilder();

                if (lstPrivilegeandFeature[0].lstPrivilegeMaster != null && lstPrivilegeandFeature[0].lstPrivilegeMaster.Count() > 0)
                {
                    sb.Append("<table WIDTH='100%' id='tblsummary' class='table table-striped' >");
                    sb.Append("<thead class='active'>");
                    sb.Append("<tr style='background-color:#428bca;'>");
                    sb.Append("<td>Privilege Name</td>");
                    sb.Append("<td>Base Privilege</td>");
                    sb.Append("<td>Feature Name</td>");
                    sb.Append("<td>Description</td>");
                    sb.Append("<td>Value Type</td>");
                    sb.Append("<td>Lookup Table</td>");
                    sb.Append("<td>Lookup Column</td>");                   
                    sb.Append("</tr>");
                    sb.Append("</thead>");
                    sb.Append("<tbody>");

                    if (lstPrivilegeandFeature[0].lstPrivilegeMaster != null && lstPrivilegeandFeature[0].lstPrivilegeMaster.Count() > 0)
                    {
                        int i = 0;

                        foreach (var lstprivilege in lstPrivilegeandFeature[0].lstPrivilegeMaster)
                        {
                            i++;
                            //PrivilegeName
                            sb.Append("<td id='priName_" + lstprivilege.Privilege_Name + "'>");
                            sb.Append(lstprivilege.Privilege_Name);
                            sb.Append("</td>");
                            //Base Privilege
                            sb.Append("<td id='basePrivilege_" + lstprivilege.Privilege_Code + "'>");
                            sb.Append(lstprivilege.Base_Privilege_Name);
                            sb.Append("</td>");

                            featureCodes = lstprivilege.Feature_Code.ToString();
                            string[] alFeaturecodes = featureCodes.Split(',');
                            featureCodes = string.Empty;
                            for (int featureIndex = 0; featureIndex < alFeaturecodes.Length; featureIndex++)
                            {
                                featureCodes += "'" + alFeaturecodes[featureIndex].ToString() + "',";
                            }

                            featureCodes = featureCodes.LastIndexOf(',') != -1 ? featureCodes.Remove(featureCodes.Length - 1) : featureCodes;
                            var lstFeatureName = lstPrivilegeandFeature[0].lstFeatureMaster.Where(s => featureCodes.Contains(s.Feature_Code)).ToList();
                            string featuresNames = string.Empty;

                            foreach (var featurename in lstFeatureName)
                            {
                                featuresNames += featurename.Feature_Name.ToString().Trim() + ',';
                            }
                            //Feature Name
                            sb.Append("<td>");
                            sb.Append(featuresNames.TrimEnd(','));
                            sb.Append("</td>");
                            //Description
                            sb.Append("<td>");
                            sb.Append(lstprivilege.Description);
                            sb.Append("</td>");
                            //Value Type
                            sb.Append("<td>");
                            sb.Append(lstprivilege.Privilege_Value_Type);
                            sb.Append("</td>");
                            //Look Up Table
                            sb.Append("<td>");
                            sb.Append(lstprivilege.Lookup_Table);
                            sb.Append("</td>");
                            //Look Up Column
                            sb.Append("<td>");
                            sb.Append(lstprivilege.Lookup_Column);
                            sb.Append("</td>");  
                            sb.Append("</tr>");
                        }
                        sb.Append("</tbody>");
                        sb.Append("</table>");
                    }
                    else
                    {
                        sb.Append("No Records To Display");
                    }

                    DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                    DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                    string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");

                    string userName = _objcurrentInfo.GetUserName();
                    string subdomainName = System.Web.HttpContext.Current.Request.Url.DnsSafeHost; ;

                    string fileName = "Privilege_New Master" + " - " + subdomainName + " - " + userName + ".xls";
                    string blobUrl = objAzureBlob.AzureBlobUploadText(sb.ToString(), accKey, fileName, "bulkdatasvc");

                    objFileDownload.DownloadFile(blobUrl, fileName, out error);
                }
            }

            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
            }
        }
        /// <summary>
        /// Get ColumnNames
        /// </summary>
        /// <returns></returns>
        public JsonResult GetColumNames(string tableName)
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            BLMaster _objMaster = new BLMaster();
            List<MVCModels.HiDoctor_Master.PrivilegeModel> lstcolumnNames = new List<MVCModels.HiDoctor_Master.PrivilegeModel>();
            lstcolumnNames = _objMaster.GetColumnNames(_objcurrentInfo.GetCompanyCode(), tableName).ToList();
            DataControl.JSONConverter objJson = new DataControl.JSONConverter();
            return Json(objJson.Serialize(lstcolumnNames));
        }

        public JsonResult GetPrivilegeMasterbyPrivilegeCode(string privilegeCode)
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            BLMaster _objMaster = new BLMaster();
            List<MVCModels.HiDoctor_Master.PrivilegeMasterModel> lstPrivilegeCode = new List<MVCModels.HiDoctor_Master.PrivilegeMasterModel>();
            lstPrivilegeCode = _objMaster.GetPrivilegeMasterbyPrivilegeCode(_objcurrentInfo.GetCompanyCode(), privilegeCode).ToList();
            DataControl.JSONConverter objJson = new DataControl.JSONConverter();
            return Json(objJson.Serialize(lstPrivilegeCode));
        }

        public string checkPrivilegeName(string privilegeName, string privilegeCode)
        {
            StringBuilder strContent = new StringBuilder();
            int countvalue = 0;
            try
            {
                BLMaster objMaster = new BLMaster();
                string companyCode = _objcurrentInfo.GetCompanyCode();
                if (!string.IsNullOrEmpty(privilegeName))
                {
                    countvalue = objMaster.checkPrivilegeName(companyCode, privilegeName, privilegeCode);
                }
                if (countvalue > 0)
                {
                    strContent.Append(privilegeName + " is already exists.");
                }
                string result = strContent.ToString();
                if (string.IsNullOrEmpty(result))
                {
                    result = "SUCCESS";
                }
                return result;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("privilegeName", privilegeName);
                dicContext.Add("privilegeCode", privilegeCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }
        }

        public string InsertandUpdatethePrivilegeMaster(string privilegeName, string BaseprivilegeName, string BasePrivilegecode, string Featurecode, string Description, string privilegeValueType, string LookupTableName, string LookUpColumnName, string mode, string LitralValues, string editPrivilegeCode)
        {
            try
            {
                string result = string.Empty;
                long privilegeCode = 0;
                int rowsAffected = 0;
                BLMaster Master = new BLMaster();
                string[] litralvaluesArr = LitralValues.Split(',');
                List<MVCModels.HiDoctor_Master.PrivilegeMasterModel> lstPrivilegeMaster = new List<MVCModels.HiDoctor_Master.PrivilegeMasterModel>();
                List<MVCModels.HiDoctor_Master.PrivilegeValueMappingModel> lstprivilegeValuemapping = new List<MVCModels.HiDoctor_Master.PrivilegeValueMappingModel>();
                if (mode.ToUpper() == "I") // Insert Data
                {
                    MVCModels.HiDoctor_Master.PrivilegeMasterModel objPrivilegeMaster = new MVCModels.HiDoctor_Master.PrivilegeMasterModel();
                    DALCampaignPlanner Objcampaign = new DALCampaignPlanner();
                    privilegeCode = Objcampaign.GetSeqNumber("SEQ_tbl_SFA_Privilege_Master");
                    objPrivilegeMaster.Company_Code = _objcurrentInfo.GetCompanyCode();
                    objPrivilegeMaster.Privilege_Code = privilegeCode.ToString();
                    objPrivilegeMaster.Privilege_Name = privilegeName;
                    objPrivilegeMaster.Base_privilege_code = BasePrivilegecode;
                    objPrivilegeMaster.Feature_Code = Featurecode.TrimEnd(',');
                    objPrivilegeMaster.Description = Description;
                    objPrivilegeMaster.Privilege_Value_Type = privilegeValueType;
                    objPrivilegeMaster.Lookup_Table = LookupTableName;
                    objPrivilegeMaster.Lookup_Column = LookUpColumnName;
                    foreach (string litralValue in litralvaluesArr)
                    {
                        if (!string.IsNullOrEmpty(litralValue))
                        {
                            MVCModels.HiDoctor_Master.PrivilegeValueMappingModel objPrivilegeValueMapping = new MVCModels.HiDoctor_Master.PrivilegeValueMappingModel();
                            objPrivilegeValueMapping.Company_Code = _objcurrentInfo.GetCompanyCode();
                            objPrivilegeValueMapping.Privilege_Code = privilegeCode.ToString();
                            objPrivilegeValueMapping.Privilege_Value_Code = litralValue;
                            objPrivilegeValueMapping.Created_By = _objcurrentInfo.GetUserName();
                            objPrivilegeValueMapping.Created_Date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff");
                            lstprivilegeValuemapping.Add(objPrivilegeValueMapping);

                        }
                    }
                    objPrivilegeMaster.Record_Status = "1";
                    objPrivilegeMaster.Row_Version_No = "0";
                    objPrivilegeMaster.Entered_by = _objcurrentInfo.GetUserName();
                    objPrivilegeMaster.Entered_on = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff");
                    lstPrivilegeMaster.Add(objPrivilegeMaster);
                    rowsAffected = Master.InsertforPrivilegeMaster(lstPrivilegeMaster, lstprivilegeValuemapping);
                }
                else
                {
                    MVCModels.HiDoctor_Master.PrivilegeMasterModel objPrivilegeMaster = new MVCModels.HiDoctor_Master.PrivilegeMasterModel();
                    objPrivilegeMaster.Company_Code = _objcurrentInfo.GetCompanyCode();
                    objPrivilegeMaster.Privilege_Code = editPrivilegeCode;
                    objPrivilegeMaster.Privilege_Name = privilegeName;
                    objPrivilegeMaster.Base_privilege_code = BasePrivilegecode;
                    objPrivilegeMaster.Feature_Code = Featurecode.TrimEnd(',');
                    objPrivilegeMaster.Description = Description;
                    objPrivilegeMaster.Privilege_Value_Type = privilegeValueType;
                    objPrivilegeMaster.Lookup_Table = LookupTableName;
                    objPrivilegeMaster.Lookup_Column = LookUpColumnName;
                    foreach (string litralValue in litralvaluesArr)
                    {
                        if (!string.IsNullOrEmpty(litralValue))
                        {
                            MVCModels.HiDoctor_Master.PrivilegeValueMappingModel objPrivilegeValueMapping = new MVCModels.HiDoctor_Master.PrivilegeValueMappingModel();
                            objPrivilegeValueMapping.Company_Code = _objcurrentInfo.GetCompanyCode();
                            objPrivilegeValueMapping.Privilege_Code = editPrivilegeCode.ToString();
                            objPrivilegeValueMapping.Privilege_Value_Code = litralValue;
                            objPrivilegeValueMapping.Created_By = _objcurrentInfo.GetUserName();
                            objPrivilegeValueMapping.Created_Date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff");
                            lstprivilegeValuemapping.Add(objPrivilegeValueMapping);

                        }
                    }
                    objPrivilegeMaster.Record_Status = "1";
                    objPrivilegeMaster.Row_Version_No = "0";
                    objPrivilegeMaster.Updated_By = _objcurrentInfo.GetUserName();
                    objPrivilegeMaster.Updated_Date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff");
                    lstPrivilegeMaster.Add(objPrivilegeMaster);
                    rowsAffected = Master.UpdateforPrivilegeMaster(lstPrivilegeMaster, lstprivilegeValuemapping);
                }

                if (rowsAffected > 0)
                {
                    result = "SUCCESS: Saved Successfully.";
                }
                else
                {
                    result = "ERROR:Error while Inserrting.";
                }                
                if (string.IsNullOrEmpty(result))
                {
                    result = "SUCCESS";
                }
                return result;              
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:privilegeName", privilegeName);
                dicContext.Add("Filter:BaseprivilegeName", BaseprivilegeName);
                dicContext.Add("Filter:Description", Description);
                dicContext.Add("Filter:mode", mode);
                dicContext.Add("Filter:privilegeValueType", privilegeValueType);
                dicContext.Add("Filter:LookUpColumnName", LookUpColumnName);
                dicContext.Add("Filter:LookupTableName", LookupTableName);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return ex.Message.ToString();
            }
        }
        #endregion "PrivilegeMaster"


        #region privilege usertype mapping
        public ActionResult PrivilegeMapping()
        {
            return View();
        }
        /// <summary>
        /// Get the active privileges
        /// </summary>
        /// <returns>returns the active privileges from the privilege master table </returns>
        public string GetPrivileges()
        {
            StringBuilder strPrivilege = new StringBuilder();
            //strPrivilege.Append("<option value=''>-Select Privilege-</option>");
            try
            {
                DataControl.BLMaster objMaster = new BLMaster();
                DataControl.CurrentInfo objCurInfo = new CurrentInfo();
                IEnumerable<MVCModels.HiDoctor_Master.PrivilegeMasterModel> lstPrivilege = null;
                lstPrivilege = objMaster.GetActivePrivilegeMasterValues(objCurInfo.GetCompanyCode());
                if (lstPrivilege != null)
                {
                    foreach (var dr in lstPrivilege)
                    {
                        strPrivilege.Append("<option value=" + dr.Privilege_Code + ">" + dr.Privilege_Name + "</option>");
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
            }
            return strPrivilege.ToString();
        }

        /// <summary>
        /// Get the user type wise privilege mapping details 
        /// </summary>
        /// <returns>returns the user type wise privilege mapping table string from the tbl_SFA_UserType_Privilege_Mapping_NG table </returns>
        public string GetPrivilegeMapping(string privilegeCode, string userTypeCode)
        {
            StringBuilder strContent = new StringBuilder();
            try
            {
                DataControl.BLMaster objMaster = new BLMaster();
                DataControl.CurrentInfo objCurInfo = new CurrentInfo();
                IEnumerable<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> lstPrivilege = null;
                lstPrivilege = objMaster.GetPrivilegeMappingDetails(objCurInfo.GetCompanyCode(), privilegeCode, userTypeCode);
                List<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> lstUserType = new List<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel>();
                var userTypes = lstPrivilege.Select(x => new { x.User_Type_Code, x.User_Type_Name }).Distinct().ToList();
                strContent.Append("<table class='table table-striped'><thead><tr><th>Edit</th><th>User Type Name</th>");
                strContent.Append("<th>Privilege Name</th>");
                strContent.Append("<th>Privilege Value Name</th><th>Description</th><th>Status</th>");
                strContent.Append("<th>Request From</th><th>Request Date</th><th>Request Reason</th>");
                strContent.Append("<th>Support User Name</th></tr></thead><tbody>");
                if (lstPrivilege != null)
                {
                    if (userTypes.Count > 0)
                    {
                        foreach (var dr in userTypes)
                        {
                            strContent.Append("<tr><th class='collapseHeader' colspan='10' onclick='fnSummaryHide(\"dv_" + dr.User_Type_Code + "\",\"spn_"
                                + dr.User_Type_Code + "\")'>");
                            strContent.Append("<span class='expandPrivilege' id='spn_" + dr.User_Type_Code + "' style='padding: 2px;'>"
                                + dr.User_Type_Name + "<span style='font-size: 11px; font-style: italic;cursor:pointer;'>(Click to Expand/Collapse)</span></span>");
                            strContent.Append("</th></tr>");
                            lstUserType = lstPrivilege.AsEnumerable().Where(a => a.User_Type_Code == Convert.ToString(dr.User_Type_Code)).ToList();
                            if (lstUserType.Count > 0)
                            {
                                foreach (var drMapping in lstUserType)
                                {
                                    strContent.Append("<tr class='dv_" + dr.User_Type_Code + "'><td style='width:1%'><a onclick='fnEdit(\"" + drMapping.Privilege_Code + "\",\""
                                        + Convert.ToString(dr.User_Type_Code) + "\");'>Edit</a></td>");
                                    strContent.Append("<td>" + drMapping.User_Type_Name + "</td>");
                                    strContent.Append("<td>" + drMapping.Privilege_Name + "</td>");
                                    strContent.Append("<td>" + drMapping.Privilege_Value_Name + "</td>");
                                    strContent.Append("<td>" + drMapping.Description + "</td>");
                                    strContent.Append("<td>" + drMapping.Record_Status + "</td>");
                                    strContent.Append("<td>" + drMapping.Request_From + "</td>");
                                    strContent.Append("<td>" + drMapping.Request_Date + "</td>");
                                    strContent.Append("<td>" + drMapping.Request_Reason + "</td>");
                                    strContent.Append("<td>" + drMapping.Support_User_Name + "</td>");
                                    strContent.Append("</tr>");
                                }
                            }
                        }
                    }
                }
                strContent.Append("</tbody></table>");
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
            }
            return strContent.ToString();
        }
        public string GetSDPrivilegeMapping(string privilegeCode, string userTypeCode)
        {
            StringBuilder strContent = new StringBuilder();
            try
            {
                DataControl.BLMaster objMaster = new BLMaster();
                DataControl.CurrentInfo objCurInfo = new CurrentInfo();
                IEnumerable<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> lstPrivilege = null;
                lstPrivilege = objMaster.GetSDPrivilegeMappingDetails(objCurInfo.GetCompanyCode(), privilegeCode, userTypeCode);
                List<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> lstUserType = new List<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel>();
                var userTypes = lstPrivilege.Select(x => new { x.User_Type_Code, x.User_Type_Name }).Distinct().ToList();
                strContent.Append("<table class='table table-striped'><thead><tr><th>Edit</th><th>User Type Name</th>");
                strContent.Append("<th>Privilege Name</th>");
                strContent.Append("<th>Privilege Value Name</th><th>Description</th><th>Status</th>");
                strContent.Append("<th>Request From</th><th>Request Date</th><th>Request Reason</th>");
                strContent.Append("<th>Support User Name</th></tr></thead><tbody>");
                if (lstPrivilege != null)
                {
                    if (userTypes.Count > 0)
                    {
                        foreach (var dr in userTypes)
                        {
                            strContent.Append("<tr><th class='collapseHeader' colspan='10' onclick='fnSummaryHide(\"dv_" + dr.User_Type_Code + "\",\"spn_"
                                + dr.User_Type_Code + "\")'>");
                            strContent.Append("<span class='expandPrivilege' id='spn_" + dr.User_Type_Code + "' style='padding: 2px;'>"
                                + dr.User_Type_Name + "<span style='font-size: 11px; font-style: italic;cursor:pointer;'>(Click to Expand/Collapse)</span></span>");
                            strContent.Append("</th></tr>");
                            lstUserType = lstPrivilege.AsEnumerable().Where(a => a.User_Type_Code == Convert.ToString(dr.User_Type_Code)).ToList();
                            if (lstUserType.Count > 0)
                            {
                                foreach (var drMapping in lstUserType)
                                {
                                    strContent.Append("<tr class='dv_" + dr.User_Type_Code + "'><td style='width:1%'><a onclick='fnEditSD(\"" + drMapping.Privilege_Code + "\",\""
                                        + Convert.ToString(dr.User_Type_Code) + "\");'>Edit</a></td>");
                                    strContent.Append("<td>" + drMapping.User_Type_Name + "</td>");
                                    strContent.Append("<td>" + drMapping.Privilege_Name + "</td>");
                                    strContent.Append("<td>" + drMapping.Privilege_Value_Name + "</td>");
                                    strContent.Append("<td>" + drMapping.Description + "</td>");
                                    strContent.Append("<td>" + drMapping.Record_Status + "</td>");
                                    strContent.Append("<td>" + drMapping.Request_From + "</td>");
                                    strContent.Append("<td>" + drMapping.Request_Date + "</td>");
                                    strContent.Append("<td>" + drMapping.Request_Reason + "</td>");
                                    strContent.Append("<td>" + drMapping.Support_User_Name + "</td>");
                                    strContent.Append("</tr>");
                                }
                            }
                        }
                    }
                }
                strContent.Append("</tbody></table>");
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
            }
            return strContent.ToString();
        }
        /// <summary>
        /// Get the privilege mapping details for edit
        /// </summary>
        /// <param name="userTypeCode"></param>
        /// <param name="privilegeCode"></param>
        /// <returns></returns>
        public JsonResult GetPrivilegeDetails(string userTypeCode, string privilegeCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> lstPrivilege = null;
            JSONConverter objJson = new JSONConverter();
            try
            {
                DataControl.BLMaster objMaster = new BLMaster();
                DataControl.CurrentInfo objCurInfo = new CurrentInfo();
                lstPrivilege = objMaster.GetMappingDetailsByPrivilegeCode(objCurInfo.GetCompanyCode(), privilegeCode, userTypeCode);
                return Json(objJson.Serialize(lstPrivilege), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }

        }

        public JsonResult GetSDPrivilegeDetails(string userTypeCode, string privilegeCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> lstPrivilege = null;
            JSONConverter objJson = new JSONConverter();
            try
            {
                DataControl.BLMaster objMaster = new BLMaster();
                DataControl.CurrentInfo objCurInfo = new CurrentInfo();
                lstPrivilege = objMaster.GetMappingDetailsByPrivilegeCodeSD(objCurInfo.GetCompanyCode(), privilegeCode, userTypeCode);
                return Json(objJson.Serialize(lstPrivilege), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }

        }
        /// <summary>
        /// Get the privilege values by privilege code
        /// </summary>
        /// <param name="privilegeCode"></param>
        /// <returns>returns the privilege description and possible privilege values </returns>
        public JsonResult GetPrivilegeValues(string privilegeCode)
        {
            JSONConverter objJson = new JSONConverter();
            IEnumerable<MVCModels.HiDoctor_Master.PrivilegeMasterModel> lstPrivilege = null;
            try
            {
                DataControl.BLMaster objMaster = new BLMaster();
                DataControl.CurrentInfo objCurInfo = new CurrentInfo();
                lstPrivilege = objMaster.GetPrivilegeValuesByPrivilegeCode(objCurInfo.GetCompanyCode(), privilegeCode);
                if (lstPrivilege != null)
                {
                    return Json(objJson.Serialize(lstPrivilege), JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }

        }


        public string checkUserTypePrivilegeMapping(string privilegeCode, string userTypeCodes, string userTypeNames,
            string privilegeName)
        {
            StringBuilder strContent = new StringBuilder();
            try
            {
                DataControl.CurrentInfo objCurInfo = new CurrentInfo();
                DataControl.BLMaster objMaster = new BLMaster();
                if (!string.IsNullOrEmpty(userTypeCodes))
                {
                    string[] arUserType;
                    string[] arUserTypeNames;
                    arUserType = userTypeCodes.Split(',');
                    arUserTypeNames = userTypeNames.Split(',');
                    int j = 0;
                    for (int i = 0; i < arUserType.Length; i++)
                    {
                        if (!string.IsNullOrEmpty(Convert.ToString(arUserType[i])))
                        {
                            List<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> lstUserType =
                                new List<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel>(objMaster.GetMappingDetailsByPrivilegeCode(
                                objCurInfo.GetCompanyCode(), privilegeCode, Convert.ToString(arUserType[i])));
                            if (lstUserType.Count > 0)
                            {
                                j++;
                                if (j == 1)
                                {
                                    strContent.Append(privilegeName + " is already mapped for ");
                                }
                                strContent.Append(Convert.ToString(arUserTypeNames[i]) + " ,");
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }

            string result = strContent.ToString().TrimEnd(',');
            if (string.IsNullOrEmpty(result))
            {
                result = "SUCCESS";
            }
            return result;
        }

        public string SDcheckUserTypePrivilegeMapping(string privilegeCode, string userTypeCodes, string userTypeNames,
           string privilegeName)
        {
            StringBuilder strContent = new StringBuilder();
            try
            {
                DataControl.CurrentInfo objCurInfo = new CurrentInfo();
                DataControl.BLMaster objMaster = new BLMaster();
                if (!string.IsNullOrEmpty(userTypeCodes))
                {
                    string[] arUserType;
                    string[] arUserTypeNames;
                    arUserType = userTypeCodes.Split(',');
                    arUserTypeNames = userTypeNames.Split(',');
                    int j = 0;
                    for (int i = 0; i < arUserType.Length; i++)
                    {
                        if (!string.IsNullOrEmpty(Convert.ToString(arUserType[i])))
                        {
                            List<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> lstUserType =
                                new List<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel>(objMaster.GetMappingDetailsByPrivilegeCodeSD(
                                objCurInfo.GetCompanyCode(), privilegeCode, Convert.ToString(arUserType[i])));
                            if (lstUserType.Count > 0)
                            {
                                j++;
                                if (j == 1)
                                {
                                    strContent.Append(privilegeName + " is already mapped for ");
                                }
                                strContent.Append(Convert.ToString(arUserTypeNames[i]) + " ,");
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }

            string result = strContent.ToString().TrimEnd(',');
            if (string.IsNullOrEmpty(result))
            {
                result = "SUCCESS";
            }
            return result;
        }

        public string InsertUserTypePrivilegeMapping(string privilegeCode, string privilegeName, string privilegeValueCodes, string privilegeValueNames,
                string userTypeCodes, string requestFrom, string requestDate, string requestReason, string supportUser, string userTypeNames,
                string status, string mode, string description)
        {
            string result = string.Empty;
            DataControl.BLMaster objMaster = new BLMaster();
            DataControl.CurrentInfo objCurInfo = new CurrentInfo();
            try
            {
                List<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> lstUserTypePrivilege =
                    new List<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel>();
                if (!string.IsNullOrEmpty(userTypeCodes))
                {
                    string[] arUserType;
                    string[] arUserTypeNames;
                    arUserType = userTypeCodes.Split(',');
                    arUserTypeNames = userTypeNames.Split(',');
                    for (int i = 0; i < arUserType.Length; i++)
                    {
                        if (!string.IsNullOrEmpty(Convert.ToString(arUserType[i])))
                        {
                            MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel objModel = new MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel();
                            objModel.Company_Code = objCurInfo.GetCompanyCode();
                            objModel.Privilege_Code = privilegeCode;
                            objModel.Privilege_Name = privilegeName;
                            objModel.Privilege_Value_Code = privilegeValueCodes;
                            objModel.Privilege_Value_Name = privilegeValueNames;
                            objModel.User_Type_Code = arUserType[i];
                            objModel.User_Type_Name = arUserTypeNames[i];
                            objModel.User_Code = "ALL";
                            objModel.Support_User_Name = supportUser;
                            objModel.Request_From = requestFrom;
                            objModel.Request_Reason = requestReason;
                            objModel.Request_Date = requestDate;
                            objModel.Record_Status = status;
                            objModel.Description = description;
                            if ("INSERT" == mode.ToUpper())
                            {
                                objModel.EnteredBy = objCurInfo.GetUserName();
                                objModel.EnteredDate = System.DateTime.Now.ToString();
                            }
                            else
                            {
                                objModel.Mapping_Updated_By = objCurInfo.GetUserName();
                                objModel.Mapping_Updated_Date = System.DateTime.Now.ToString();
                            }
                            lstUserTypePrivilege.Add(objModel);
                        }
                    }
                    int rowsAffected = 0;
                    rowsAffected = objMaster.InsertUserTypePrivilegeMapping(lstUserTypePrivilege, mode);
                    if (rowsAffected > 0)
                    {
                        result = "SUCCESS:" + privilegeName + " is mapped for the " + userTypeNames;
                    }
                    else
                    {
                        result = "ERROR:Error while mapping the " + privilegeName;
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }
            return result;
        }
        public string SDInsertUserTypePrivilegeMapping(string privilegeCode, string privilegeName, string privilegeValueCodes, string privilegeValueNames,
                string userTypeCodes, string requestFrom, string requestDate, string requestReason, string supportUser, string userTypeNames,
                string status, string mode, string description)
        {
            string result = string.Empty;
            DataControl.BLMaster objMaster = new BLMaster();
            DataControl.CurrentInfo objCurInfo = new CurrentInfo();
            try
            {
                List<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> lstUserTypePrivilege =
                    new List<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel>();
                if (!string.IsNullOrEmpty(userTypeCodes))
                {
                    string[] arUserType;
                    string[] arUserTypeNames;
                    arUserType = userTypeCodes.Split(',');
                    arUserTypeNames = userTypeNames.Split(',');
                    for (int i = 0; i < arUserType.Length; i++)
                    {
                        if (!string.IsNullOrEmpty(Convert.ToString(arUserType[i])))
                        {
                            MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel objModel = new MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel();
                            objModel.Company_Code = objCurInfo.GetCompanyCode();
                            objModel.Privilege_Code = privilegeCode;
                            objModel.Privilege_Name = privilegeName;
                            objModel.Privilege_Value_Code = privilegeValueCodes;
                            objModel.Privilege_Value_Name = privilegeValueNames;
                            objModel.User_Type_Code = arUserType[i];
                            objModel.User_Type_Name = arUserTypeNames[i];
                            objModel.User_Code = "ALL";
                            objModel.Support_User_Name = supportUser;
                            objModel.Request_From = requestFrom;
                            objModel.Request_Reason = requestReason;
                            objModel.Request_Date = requestDate;
                            objModel.Record_Status = status;
                            objModel.Description = description;
                            if ("INSERT" == mode.ToUpper())
                            {
                                objModel.EnteredBy = objCurInfo.GetUserName();
                                objModel.EnteredDate = System.DateTime.Now.ToString();
                            }
                            else
                            {
                                objModel.Mapping_Updated_By = objCurInfo.GetUserName();
                                objModel.Mapping_Updated_Date = System.DateTime.Now.ToString();
                            }
                            lstUserTypePrivilege.Add(objModel);
                        }
                    }
                    int rowsAffected = 0;
                    rowsAffected = objMaster.SDInsertUserTypePrivilegeMapping(lstUserTypePrivilege, mode);
                    if (rowsAffected > 0)
                    {
                        result = "SUCCESS:" + privilegeName + " is mapped for the " + userTypeNames;
                    }
                    else
                    {
                        result = "ERROR:Error while mapping the " + privilegeName;
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }
            return result;
        }


        public string GetUserTypes()
        {
            StringBuilder strUserType = new StringBuilder();
            strUserType.Append("<option value='ALL'>ALL</option>");
            try
            {
                DataControl.BLUser objUser = new BLUser();
                DataControl.CurrentInfo objCurInfo = new CurrentInfo();
                IEnumerable<MVCModels.HiDoctor_Master.UserTypeModel> lstUserType = null;
                lstUserType = objUser.GetUserTypes(objCurInfo.GetCompanyCode());
                if (lstUserType != null)
                {
                    foreach (var dr in lstUserType)
                    {
                        if (dr.User_Type_Status == "1")
                        {
                            strUserType.Append("<option value=" + dr.User_Type_Code + ">" + dr.User_Type_Name + "</option>");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
            }
            return strUserType.ToString();
        }

        public JsonResult GetPrivilegeMasterDetails(string privilegeCode)
        {
            JSONConverter objJson = new JSONConverter();
            IEnumerable<MVCModels.HiDoctor_Master.PrivilegeMasterModel> lstPrivilege = null;
            try
            {
                DataControl.BLMaster objMaster = new BLMaster();
                DataControl.CurrentInfo objCurInfo = new CurrentInfo();
                lstPrivilege = objMaster.GetPrivilegeDetails(objCurInfo.GetCompanyCode(), privilegeCode);
                if (lstPrivilege != null)
                {
                    return Json(objJson.Serialize(lstPrivilege), JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }

        }

        public JsonResult GetSingleActivityPerDayValue(string User_Type)
        {
            List<MVCModels.HiDoctor_Master.SingleActivityPerDayValue> result = new List<MVCModels.HiDoctor_Master.SingleActivityPerDayValue>();
            DataControl.BLMaster objMaster = new BLMaster();
            DataControl.CurrentInfo objCurInfo = new CurrentInfo();
            result = objMaster.GetSingleActivityPerDayValue(objCurInfo.GetCompanyCode(), User_Type);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        #endregion privilege usertype mapping
    }
}
