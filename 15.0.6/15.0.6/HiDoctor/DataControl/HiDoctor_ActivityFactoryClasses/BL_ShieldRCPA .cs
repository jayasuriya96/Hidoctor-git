using DataControl.Abstraction;
using DataControl.Impl;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using OfficeOpenXml;

namespace DataControl.HiDoctor_ActivityFactoryClasses
{
    public class BL_ShieldRCPA
    {
        DAL_ShieldRCPA _objDALRCPA = new DAL_ShieldRCPA();
        CurrentInfo _objCurrentInfo = new CurrentInfo();
        private string _RCPAExcelTemplateFileName = string.Empty;
        private const string DOWNLOAD_PATH_KEY_NAME = "ExcelDownloadPath";
        private const string UPLOAD_PATH_KEY_NAME = "ExcelUploadPath";
        private const string KEY_COL_NAME = "NAME OF THE DOCTOR";
        const string EMPLOYEE_EXCEL_SHEET_NAME = "Table$";

        public string InsertRCPAExcelBulkUpload(string subDomain, string companyCode, string Regioncode, string guid, System.Web.HttpPostedFileBase postedFile, string uploadedBy, MVCModels.ShieldRCPA objrcpaHeader)
        {
            string result = "";
            try
            {
                //DataTable dt = 
                string BloblFileURL;
                DataTable dt = ConvertRCPAExcelToDataTable(postedFile,out BloblFileURL);
                if (dt == null)
                {
                    result = "ERROR:NO DATA found in the uploaded excel file";
                }
                else if (dt.Rows.Count == 0)
                {
                    result = "ERROR:NO DATA found in the uploaded excel file";
                }
                else
                {
                    dt.Columns.Add("Row_No", typeof(int));
                    dt.Columns.Add("Company_Id", typeof(int));
                    dt.Columns.Add("Company_code", typeof(String));
                    dt.Columns.Add("Sales_ProductName", typeof(String));
                    dt.Columns.Add("CompProductS11_Name", typeof(String));
                    dt.Columns.Add("CompProductS12_Name", typeof(String));
                    dt.Columns.Add("Sales_Product2Name", typeof(String));
                    dt.Columns.Add("CompProductS21_Name", typeof(String));
                    dt.Columns.Add("CompProductS22_Name", typeof(String));
                    dt.Columns.Add("Sales_Product3Name", typeof(String));
                    dt.Columns.Add("CompProductS31_Name", typeof(String));
                    dt.Columns.Add("Key_ValueS1_Name", typeof(String));
                    dt.Columns.Add("Key_ValueS2_Name", typeof(String));
                    dt.Columns.Add("Key_ValueS3_Name", typeof(String));
                    dt.Columns.Add("PeriodFrom", typeof(String));
                    dt.Columns.Add("PeriodTo", typeof(String));
                    dt.Columns.Add("File_Name", typeof(String));
                    dt.Columns.Add("GUID", typeof(String));
                    dt.Columns.Add("Status", typeof(String));
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        dt.Rows[i]["Row_No"] = i + 2;
                        dt.Rows[i]["Company_Id"] = objrcpaHeader.Company_Id;
                        dt.Rows[i]["Company_code"] = companyCode;
                        dt.Rows[i]["Sales_ProductName"] = dt.Columns[8].ColumnName;
                        dt.Rows[i]["CompProductS11_Name"] = dt.Columns[9].ColumnName;
                        dt.Rows[i]["CompProductS12_Name"] = dt.Columns[10].ColumnName;
                        dt.Rows[i]["Key_ValueS1_Name"] = dt.Columns[11].ColumnName;
                        dt.Rows[i]["Sales_Product2Name"] = dt.Columns[12].ColumnName;
                        dt.Rows[i]["CompProductS21_Name"] = dt.Columns[13].ColumnName;
                        dt.Rows[i]["CompProductS22_Name"] = dt.Columns[14].ColumnName;
                        dt.Rows[i]["Key_ValueS2_Name"] = dt.Columns[15].ColumnName;
                        dt.Rows[i]["Sales_Product3Name"] = dt.Columns[16].ColumnName;
                        dt.Rows[i]["CompProductS31_Name"] = dt.Columns[17].ColumnName;
                        dt.Rows[i]["Key_ValueS3_Name"] = dt.Columns[18].ColumnName;
                        dt.Rows[i]["PeriodFrom"] = objrcpaHeader.PeriodFrom;
                        dt.Rows[i]["PeriodTo"] = objrcpaHeader.PeriodTo;
                        dt.Rows[i]["File_Name"] = postedFile.FileName;
                        dt.Rows[i]["GUID"] = guid.ToString();
                        dt.Rows[i]["Status"] = "PROCESSING";
                    }
                    result = _objDALRCPA.ExcelBulkRCPAInsert(companyCode, dt);
                    if (result == "SUCCESS")
                    {
                        result = _objDALRCPA.InsertExcelBulkRCPAStagingToMaster(subDomain, companyCode, Regioncode, guid, postedFile.FileName, uploadedBy, "RCPA_UPLOAD");
                    }
                    else
                    {
                        result = "ERROR:Instructions are not followed." + result;
                    }
                }
            }
            catch (Exception ex)
            {
                result = "ERROR:Instructions not followed." + ex.Message;
            }
            return result;
        }

        private DataTable ConvertRCPAExcelToDataTable(System.Web.HttpPostedFileBase postedFile, out string BloblUrl)
        {
            IFileProvider fileProvider = new FileSystemProvider();
            IExcelFactory excelFactory = new ExcelFactory();
            CurrentInfo objCurInfo = new CurrentInfo();
            string containerName = objCurInfo.GetCompanyCode().ToLower();
            string fileName = postedFile.FileName;
            string[] excelRetrieveColumns = new string[] { "*" };

            _RCPAExcelTemplateFileName = fileProvider.GetFilePathToSave(UPLOAD_PATH_KEY_NAME, fileName);
            //  postedFile.SaveAs(_employeeExcelTemplateFileName);

            DataControl.Repository.AzureBlobUpload objAzureUpload = new Repository.AzureBlobUpload();
            DataControl.Abstraction.IFileProvider objPathProv = new DataControl.Impl.FileSystemProvider();

            string accKey = objPathProv.GetConfigValue("UPLOADEDFILEBLOBACCKEY");

            BloblUrl = objAzureUpload.PutAzureBlobStorage(postedFile.InputStream, postedFile.FileName, accKey, containerName);

            System.IO.Stream stream = objAzureUpload.AzureblockDownload(postedFile.FileName, accKey, containerName);
            DataTable dt = new DataTable();
            var package = new ExcelPackage(postedFile.InputStream);
            dt = package.ToDataTable();
            return dt;
        }
    }
}
