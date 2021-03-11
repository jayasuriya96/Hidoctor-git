using DataControl;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class PaySlipController : Controller
    {
        //
        // GET: /PaySlip/

        public ActionResult Index()
        {
            return View();
        }
        public ActionResult PaySlipMaintanance()
        {
            return View();
        }
        /// <summary>
        /// Get active User  types
        /// </summary>
        /// <returns>Get active User types</returns>
        public JsonResult GetUserTypes()
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLUser objUser = new DataControl.BLUser();
            List<MVCModels.HiDoctor_Master.UserTypeModel> lstUserType = new List<MVCModels.HiDoctor_Master.UserTypeModel>();
            lstUserType = objUser.GetUserTypes(objCurInfo.GetCompanyCode());
            DataControl.JSONConverter objJson = new DataControl.JSONConverter();
            return Json(objJson.Serialize(lstUserType));
        }
        public string GetPaySlipMetaData(string userTypeCode)
        {
            StringBuilder strContent = new StringBuilder();
            DataControl.BLUser objUser = new DataControl.BLUser();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            IEnumerable<MVCModels.HiDoctor_Master.PaySlipMetaDataModel> lstPaySlipData = null;
            lstPaySlipData = objUser.GetPaySlipMetaData(objCurInfo.GetCompanyCode(), userTypeCode);

            IEnumerable<MVCModels.HiDoctor_Master.PaySlipColDataTypeModel> lstPaySlipColDataType = null;
            lstPaySlipColDataType = objUser.GetPaySlipColDataType(objCurInfo.GetCompanyCode());
            try
            {
                strContent.Append("<table class='table table-striped'  id='tblPaySlipMetaData'><thead><tr><td>Delete</td><td>Col.No</td><td>Col.Name</td>");
                strContent.Append("<td>Label</td><td>Zone Index</td><td>Row Index</td><td>Col.Index</td><td>Hor.Align</td><td>Ver.Align</td>");
                strContent.Append("<td>Col.Type</td><td>Column Data Type</td><td>Status</td></tr></thead><tbody>");
                int j = 0;
                if (lstPaySlipData != null)
                {
                    foreach (var lstData in lstPaySlipData)
                    {
                        StringBuilder strColumnIndex = new StringBuilder();
                        StringBuilder strRowIndex = new StringBuilder();
                        StringBuilder strZoneIndex = new StringBuilder();
                        StringBuilder strVerticalAlign = new StringBuilder();
                        StringBuilder strHorAlign = new StringBuilder();
                        StringBuilder strColType = new StringBuilder();
                        StringBuilder strColDatalType = new StringBuilder();

                        string zoneIndex = string.Empty;
                        string rowIndex = string.Empty;
                        string columnIndex = string.Empty;
                        string horAlign = string.Empty;
                        string verAlign = string.Empty;
                        string colType = string.Empty;
                        string coldatatype = string.Empty;
                        j++;
                        strContent.Append("<tr>");
                        if (!string.IsNullOrEmpty(Convert.ToString(lstData.Column_Name)))
                        {
                            strContent.Append("<td><a href='#' onclick='fnChangePaySlipColumnStatus(\""
                                + lstData.Column_No + "\",\"" + lstData.Record_Status + "\");'>Change Status</a></td>");
                        }
                        else
                        {
                            strContent.Append("<td></td>");
                        }
                        strContent.Append("<td><span id='spnColumnNo_" + j + "'>" + lstData.Column_No + "</span></td>");
                        strContent.Append("<td><input type='text' class='form-control clsCheckSpecial' value='" + lstData.Column_Name
                            + "' id='txtColumnName_" + j + "' maxlength='30'/></td>");
                        strContent.Append("<td><input type='text' class='form-control clsCheckSpecial' value='" + lstData.Label_Text
                           + "' id='txtLabelText_" + j + "'  maxlength='500'/></td>");
                        var filtered = lstPaySlipData.Where(z => z.Column_No == Convert.ToString(lstData.Column_No)).ToList();
                        if (filtered.Count > 0)
                        {
                            zoneIndex = filtered[0].Zone_Index;
                            rowIndex = filtered[0].Row_Index;
                            columnIndex = filtered[0].Column_Index;
                            horAlign = filtered[0].Horizontal_Align;
                            verAlign = filtered[0].Vertical_Align;
                            colType = filtered[0].Column_Type;
                            coldatatype = filtered[0].Column_Data_Type;
                        }
                        strColumnIndex.Append("<option value='0' selected>-Select-</option>");
                        strRowIndex.Append("<option value='0' selected>-Select-</option>");
                        strZoneIndex.Append("<option value='0' selected>-Select-</option>");
                        for (int i = 1; i <= 25; i++)
                        {
                            if (columnIndex.ToString() == i.ToString())
                            {
                                strColumnIndex.Append("<option value=" + i + " selected>" + i + "</option>");
                            }
                            else
                            {
                                strColumnIndex.Append("<option value=" + i + ">" + i + "</option>");
                            }
                            if (rowIndex.ToString() == i.ToString())
                            {
                                strRowIndex.Append("<option value=" + i + " selected>" + i + "</option>");
                            }
                            else
                            {
                                strRowIndex.Append("<option value=" + i + ">" + i + "</option>");
                            }
                            if (zoneIndex.ToString() == i.ToString())
                            {
                                strZoneIndex.Append("<option value=" + i + " selected>" + i + "</option>");
                            }
                            else
                            {
                                strZoneIndex.Append("<option value=" + i + ">" + i + "</option>");
                            }
                        }
                        #region horizondal align
                        if (horAlign.ToString().ToUpper() == "LEFT")
                        {
                            strHorAlign.Append("<option value=''>-Select-</option>");
                            strHorAlign.Append("<option value='Left' selected>Left</option>");
                            strHorAlign.Append("<option value='Right'>Right</option>");
                            strHorAlign.Append("<option value='Center'>Center</option>");
                        }
                        else if (horAlign.ToString().ToUpper() == "RIGHT")
                        {
                            strHorAlign.Append("<option value=''>-Select-</option>");
                            strHorAlign.Append("<option value='Left'>Left</option>");
                            strHorAlign.Append("<option value='Right' selected>Right</option>");
                            strHorAlign.Append("<option value='Center'>Center</option>");
                        }
                        else if (horAlign.ToString().ToUpper() == "CENTER")
                        {
                            strHorAlign.Append("<option value=''>-Select-</option>");
                            strHorAlign.Append("<option value='Left'>Left</option>");
                            strHorAlign.Append("<option value='Right'>Right</option>");
                            strHorAlign.Append("<option value='Center' selected>Center</option>");
                        }
                        else
                        {
                            strHorAlign.Append("<option value='' selected>-Select-</option>");
                            strHorAlign.Append("<option value='Left'>Left</option>");
                            strHorAlign.Append("<option value='Right'>Right</option>");
                            strHorAlign.Append("<option value='Center'>Center</option>");
                        }
                        #endregion horizondal align

                        #region vertical align
                        if (verAlign.ToString().ToUpper() == "TOP")
                        {
                            strVerticalAlign.Append("<option value=''>-Select-</option>");
                            strVerticalAlign.Append("<option value='Top' selected>Top</option>");
                            strVerticalAlign.Append("<option value='Bottom'>Bottom</option>");
                            strVerticalAlign.Append("<option value='Middle'>Middle</option>");
                        }
                        else if (verAlign.ToString().ToUpper() == "BOTTOM")
                        {
                            strVerticalAlign.Append("<option value=''>-Select-</option>");
                            strVerticalAlign.Append("<option value='Top'>Top</option>");
                            strVerticalAlign.Append("<option value='Bottom' selected>Bottom</option>");
                            strVerticalAlign.Append("<option value='Middle'>Middle</option>");
                        }
                        else if (verAlign.ToString().ToUpper() == "MIDDLE")
                        {
                            strVerticalAlign.Append("<option value=''>-Select-</option>");
                            strVerticalAlign.Append("<option value='Top'>Top</option>");
                            strVerticalAlign.Append("<option value='Bottom'>Bottom</option>");
                            strVerticalAlign.Append("<option value='Middle' selected>Middle</option>");
                        }
                        else
                        {
                            strVerticalAlign.Append("<option value='' selected>-Select-</option>");
                            strVerticalAlign.Append("<option value='Top'>Top</option>");
                            strVerticalAlign.Append("<option value='Right'>Right</option>");
                            strVerticalAlign.Append("<option value='Middle'>Middle</option>");
                        }
                        #endregion vertical align

                        if (colType.ToString().ToUpper() == "KEY_VALUE")
                        {
                            strColType.Append("<option value=''>-Select-</option>");
                            strColType.Append("<option value='Key_Value' selected>Key_Value</option>");
                            strColType.Append("<option value='Key'>Key</option>");
                            strColType.Append("<option value='Header'>Header</option>");
                            strColType.Append("<option value='Key_Header_Value'>Key_Header_Value</option>");
                        }
                        else if (colType.ToString().ToUpper() == "KEY")
                        {
                            strColType.Append("<option value=''>-Select-</option>");
                            strColType.Append("<option value='Key_Value'>Key_Value</option>");
                            strColType.Append("<option value='Key' selected>Key</option>");
                            strColType.Append("<option value='Header'>Header</option>");
                            strColType.Append("<option value='Key_Header_Value'>Key_Header_Value</option>");
                        }
                        else if (colType.ToString().ToUpper() == "HEADER")
                        {
                            strColType.Append("<option value=''>-Select-</option>");
                            strColType.Append("<option value='Key_Value'>Key_Value</option>");
                            strColType.Append("<option value='Key'>Key</option>");
                            strColType.Append("<option value='Header' selected>Header</option>");
                            strColType.Append("<option value='Key_Header_Value'>Key_Header_Value</option>");
                        }
                        else if (colType.ToString().ToUpper() == "KEY_HEADER_VALUE")
                        {
                            strColType.Append("<option value=''>-Select-</option>");
                            strColType.Append("<option value='Key_Value'>Key_Value</option>");
                            strColType.Append("<option value='Key'>Key</option>");
                            strColType.Append("<option value='Header'>Header</option>");
                            strColType.Append("<option value='Key_Header_Value' selected>Key_Header_Value</option>");
                        }
                        else
                        {
                            strColType.Append("<option value='' selected>-Select-</option>");
                            strColType.Append("<option value='Key_Value'>Key_Value</option>");
                            strColType.Append("<option value='Key'>Key</option>");
                            strColType.Append("<option value='Header'>Header</option>");
                            strColType.Append("<option value='Key_Header_Value'>Key_Header_Value</option>");
                        }



                        #region datatype align
                        if (coldatatype.ToString() == "1")
                        {
                            //strHorAlign.Append("<option value=''>-Select-</option>");
                            strColDatalType.Append("<option value='1' selected>Number without decimal places</option>");
                            strColDatalType.Append("<option value='2'>Amount</option>");
                            strColDatalType.Append("<option value='3'>Text</option>");
                            strColDatalType.Append("<option value='4'>Date</option>");
                        }
                        else if (coldatatype.ToString() == "2")
                        {
                            strColDatalType.Append("<option value='1'>Number without decimal places</option>");
                            strColDatalType.Append("<option value='2' selected>Amount</option>");
                            strColDatalType.Append("<option value='3'>Text</option>");
                            strColDatalType.Append("<option value='4'>Date</option>");
                        }
                        else if (coldatatype.ToString() == "4")
                        {
                            strColDatalType.Append("<option value='1'>Number without decimal places</option>");
                            strColDatalType.Append("<option value='2'>Amount</option>");
                            strColDatalType.Append("<option value='3'>Text</option>");
                            strColDatalType.Append("<option value='4' selected>Date</option>");
                        }
                        else
                        {
                            strColDatalType.Append("<option value='1'>Number without decimal places</option>");
                            strColDatalType.Append("<option value='2'>Amount</option>");
                            strColDatalType.Append("<option value='3' selected>Text</option>");
                            strColDatalType.Append("<option value='4'>Date</option>");
                        }
                        #endregion datatype align




                        //if (lstPaySlipColDataType != null)
                        //{

                        //    foreach (var item in lstPaySlipColDataType)
                        //    {
                        //        if (item.DBDataTypeName.ToUpper() == "VARCHAR")
                        //        {
                        //            strColDatalType.Append("<option value=" + item.Id + " selected>" + item.DataTypeAliasName + "</option>");
                        //        }
                        //        if (item.DBDataTypeName.ToUpper() != "VARCHAR")
                        //        {
                        //            strColDatalType.Append("<option value=" + item.Id + ">" + item.DataTypeAliasName + "</option>");
                        //        }
                        //    }

                        //}



                        strContent.Append("<td><select id='cboZoneIndex_" + j + "' class='form-control'>" + strZoneIndex.ToString() + "</select></td>");
                        strContent.Append("<td><select id='cboRowIndex_" + j + "' class='form-control'>" + strRowIndex.ToString() + "</select></td>");
                        strContent.Append("<td><select id='cboColumnIndex_" + j + "' class='form-control'>" + strColumnIndex.ToString() + "</select></td>");
                        strContent.Append("<td><select id='cboHorAlign_" + j + "' class='form-control'>" + strHorAlign.ToString() + "</select></td>");
                        strContent.Append("<td><select id='cboVerAlign_" + j + "' class='form-control'>" + strVerticalAlign.ToString() + "</select></td>");
                        strContent.Append("<td><select id='cboColType_" + j + "' class='form-control'>" + strColType.ToString() + "</select></td>");
                        strContent.Append("<td><select id='cboColDataType_" + j + "' class='form-control'>" + strColDatalType.ToString() + "</select></td>");
                        if (!string.IsNullOrEmpty(Convert.ToString(lstData.Column_Name)))
                        {
                            if (lstData.Record_Status == "1")
                            {
                                strContent.Append("<td>Enabled</td>");
                            }
                            else
                            {
                                strContent.Append("<td>Disabled</td>");
                            }
                        }
                        else
                        {
                            strContent.Append("<td></td>");
                        }
                        strContent.Append("</tr>");
                    }
                    strContent.Append("</tbody></table>");
                }
                if (j == 0)
                {
                    strContent.Clear();
                    strContent.Append("No Payslip column data is available for the selected user type");
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("strContent", strContent.ToString());
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return strContent.ToString();
        }
        /// <summary>
        /// Update payslip meta data
        /// </summary>
        /// <param name="paySlipData"></param>
        /// <param name="userTypeCode"></param>
        /// <returns>returns no of rows updated</returns>
        public int UpdatePaySlipMetaData(string paySlipData, string userTypeCode)
        {
            int rowsAffected = 0;
            try
            {
                DataControl.BLUser objUser = new DataControl.BLUser();
                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                rowsAffected = objUser.UpdatePaySlipMetaData(objCurInfo.GetCompanyCode(), paySlipData, userTypeCode);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userTypeCode", userTypeCode);
                dicObj.Add("paySlipData", paySlipData);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return rowsAffected;
        }
        /// <summary>
        /// Get user type which is mapped in the payslip
        /// </summary>
        /// <returns></returns>
        public JsonResult GetPaySlipMappedUserTypes()
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLUser objUser = new DataControl.BLUser();
            IEnumerable<MVCModels.HiDoctor_Master.UserTypeModel> lstUserType = null;
            lstUserType = objUser.GetPaySlipMappedUserTypes(objCurInfo.GetCompanyCode());
            DataControl.JSONConverter objJson = new DataControl.JSONConverter();
            return Json(objJson.Serialize(lstUserType));
        }
        /// <summary>
        /// Payslip inheritance
        /// </summary>
        /// <param name="sourceUserTypeCode"></param>
        /// <param name="userTypes"></param>
        /// <returns>copy the payslip meta data from the source region to destination region</returns>
        public int PaySlipInheritance(string sourceUserTypeCode, string userTypes)
        {
            int rowsAffected = 0;
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLUser objUser = new DataControl.BLUser();
            try
            {
                List<MVCModels.HiDoctor_Master.UserTypeModel> lstUserTypes = new List<MVCModels.HiDoctor_Master.UserTypeModel>();
                if (!string.IsNullOrEmpty(userTypes))
                {
                    string[] arUserTypes;
                    arUserTypes = userTypes.Split('^');
                    for (int i = 0; i < arUserTypes.Length; i++)
                    {
                        if (!string.IsNullOrEmpty(arUserTypes[i]))
                        {
                            MVCModels.HiDoctor_Master.UserTypeModel objUserType = new MVCModels.HiDoctor_Master.UserTypeModel();
                            objUserType.User_Type_Code = Convert.ToString(arUserTypes[i]);
                            objUserType.Company_Code = objCurInfo.GetCompanyCode();
                            lstUserTypes.Add(objUserType);
                        }
                    }
                }
                rowsAffected = objUser.PaySlipInheritance(objCurInfo.GetCompanyCode(), sourceUserTypeCode, lstUserTypes);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("sourceUserTypeCode", sourceUserTypeCode);
                dicObj.Add("userTypes", userTypes);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return rowsAffected;
        }
        /// <summary>
        /// Update the payslip meta data status
        /// </summary>
        /// <param name="userTypeCode"></param>
        /// <param name="columnNo"></param>
        /// <param name="status"></param>
        /// <returns>change the status of the selected column</returns>
        public int ChangePaySlipMetadataStatus(string userTypeCode, string columnNo, string status)
        {
            int rowsAffected = 0;
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLUser objUser = new DataControl.BLUser();
            try
            {
                rowsAffected = objUser.ChangePaySlipMetadataStatus(objCurInfo.GetCompanyCode(), userTypeCode, columnNo, status);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userTypeCode", userTypeCode);
                dicObj.Add("columnNo", columnNo);
                dicObj.Add("status", status);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return rowsAffected;
        }

        public ActionResult PayslipColumnDefiner()
        {
            return View();
        }
        public ActionResult PayslipColumnDefinerResult()
        {
            return View();
        }
        public ActionResult PayslipDataUpload()
        {
            return View();
        }

        public ActionResult PayslipDataResult()
        {
            return View();
        }

        [HttpPost]
        public ActionResult ExcellPayslipDataUpload(HttpPostedFileBase file, FormCollection collection)
        {
            DataControl.BLUser objBlUser = new BLUser();
            DataControl.CurrentInfo objCurInfo = new CurrentInfo();
            string subDomain = objCurInfo.GetSubDomain();
            string result = string.Empty;
            string payslipMonth = collection["txtMonth"].ToString();
            string payslipYear = collection["txtYear"].ToString();
            string companyCode = objCurInfo.GetCompanyCode();

            List<MVCModels.HiDoctor_Master.PayslipDataModel> lstdata = new List<MVCModels.HiDoctor_Master.PayslipDataModel>();
            lstdata = (List<MVCModels.HiDoctor_Master.PayslipDataModel>)objBlUser.GetpayslipDetail(companyCode, payslipMonth, payslipYear);

            List<MVCModels.HiDoctor_Master.PayslipEmployeeDetail> lstEmpDetail = lstdata[0].lstEmpDetail;
            List<MVCModels.HiDoctor_Master.PayslipColunmDetail> lstColunmDetail = lstdata[0].lstpayslipColunm;
            List<MVCModels.HiDoctor_Master.PayslipDetails> lstDetail = lstdata[0].lstPayslipDetail;
            result = objBlUser.InsertPayslipDataUpload(objCurInfo.GetCompanyCode(), Guid.NewGuid().ToString(), file, lstdata, subDomain, payslipMonth, payslipYear);
            ViewBag.ErrorCode = result;
            return View("PayslipDataResult");
        }

        [HttpPost]
        public ActionResult ExcellPayslipDefiner(HttpPostedFileBase file, FormCollection collection)
        {
            try
            {
                string result = string.Empty;
                DataControl.BLUser objBlUser = new BLUser();
                DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
                string selectedUserType = collection["userTypeCode"].ToString();
                selectedUserType = selectedUserType.Replace(",,", ",");
                selectedUserType = selectedUserType.TrimEnd(',');
                result = objBlUser.PayslipDefinerBulkUpload(_objCurInfo.GetCompanyCode(), Guid.NewGuid().ToString(), file, _objCurInfo.GetUserCode(),
                                                            _objCurInfo.GetSubDomain(), selectedUserType);
                ViewBag.ErrorCode = result;
                return View("PayslipColumnDefinerResult");
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                ViewBag.ErrorCode = string.Empty;
                return View("PayslipColumnDefinerResult");
            }
        }



        public void PutPayslipmetadataintoExcel()
        {
            string error = string.Empty;

            StringBuilder sb = new StringBuilder();
            try
            {
                DataControl.BLUser objBlUser = new BLUser();
                DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
                string companyCode = _objCurInfo.GetCompanyCode();
  
                DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();
                DataControl.Abstraction.IFileProvider objProvider = new DataControl.Impl.FileSystemProvider();

                List<MVCModels.HiDoctor_Master.PaySlipMetaDataModel> lstdata = new List<MVCModels.HiDoctor_Master.PaySlipMetaDataModel>();
                lstdata = objBlUser.GetpaysliprefsheetDetail(companyCode).ToList();
                

                


                DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");

                sb.Append("<table WIDTH='40%' id='tblpaysummary' class='table table-striped'>");
                sb.Append("<thead class='active'>");
                sb.Append("<tr style='background-color:#428bca;'>");
                sb.Append("<td>User Type Name</td>");
                sb.Append("<td>Column No</td>");
                sb.Append("<td>Column Name</td>");
                sb.Append("<td>DataTypeName</td>");
                sb.Append("</tr>");
                sb.Append("</thead>");
                sb.Append("<tbody>");
                if (lstdata.Count >0)
                {

                    foreach (var lstPayMetadata in lstdata)
                    {

                        sb.Append("<tr><td>" + lstPayMetadata.User_Type_Name + "</td>");
                        sb.Append("<td>" + lstPayMetadata.Column_No + "</td>");
                        sb.Append("<td>" + lstPayMetadata.Column_Name + "</td>");
                        sb.Append("<td>" + lstPayMetadata.DataTypeAliasName + "</td></tr>");
                    }
                }
                string userName = _objCurInfo.GetUserName();
                string subdomainName = System.Web.HttpContext.Current.Request.Url.DnsSafeHost; ;

                string fileName = "PaySlipMetaData" + " - " + subdomainName + " - " + userName + ".xls";
                string blobUrl = objAzureBlob.AzureBlobUploadText(sb.ToString(), accKey, fileName, "bulkdatasvc");
                objFileDownload.DownloadFile(blobUrl, fileName, out error);

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
            }
        }

    }
}
