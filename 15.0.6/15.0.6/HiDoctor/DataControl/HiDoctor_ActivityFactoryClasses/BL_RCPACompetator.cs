using DataControl.Abstraction;
using DataControl.Impl;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using MVCModels;
namespace DataControl.HiDoctor_ActivityFactoryClasses
{
    public class BL_RCPACompetator
    {
        private string _employeeExcelTemplateFileName = string.Empty;
        private const string UPLOAD_PATH_KEY_NAME = "ExcelUploadPath";

        DAL_RCPACompetator _objDALRCPACompetator = new DAL_RCPACompetator();
        CurrentInfo _objCurrentInfo = new CurrentInfo();

        private DataTable ConvertRCPAExcelToDataTable(System.Web.HttpPostedFileBase postedFile)
        {
            IFileProvider fileProvider = new FileSystemProvider();
            IExcelFactory excelFactory = new ExcelFactory();
            CurrentInfo objCurInfo = new CurrentInfo();
            string containerName = objCurInfo.GetCompanyCode().ToLower();
            string fileName = postedFile.FileName;
            string[] excelRetrieveColumns = new string[] { "*" };

            _employeeExcelTemplateFileName = fileProvider.GetFilePathToSave(UPLOAD_PATH_KEY_NAME, fileName);
            string whereQuery = " LEN(Region_Name) >0 ";
            //  postedFile.SaveAs(_employeeExcelTemplateFileName);

            DataControl.Repository.AzureBlobUpload objAzureUpload = new Repository.AzureBlobUpload();
            DataControl.Abstraction.IFileProvider objPathProv = new DataControl.Impl.FileSystemProvider();

            string accKey = objPathProv.GetConfigValue("UPLOADEDFILEBLOBACCKEY");

            string blobURL = objAzureUpload.PutAzureBlobStorage(postedFile.InputStream, postedFile.FileName, accKey, containerName);

            System.IO.Stream stream = objAzureUpload.AzureblockDownload(postedFile.FileName, accKey, containerName);
            DataTable dt = new DataTable();
            dt = objAzureUpload.ConvertStreamToDataTable(stream, "D_Doctor_Name");
            return dt;
        }

        public string RCPAExcelBulkAddResult(string subDomain, string companyCode, string Regioncode, string guid, System.Web.HttpPostedFileBase postedFile, string uploadedBy, MVCModels.RCPA_Header objrcpaHeader)
        {
            string result = "";
            try
            {
                DataTable dt = ConvertRCPAExcelToDataTable(postedFile);
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
                    //dt.Columns.Add("Company_Code", typeof(String));
                    //dt.Columns.Add("Region_Code", typeof(String));
                    //dt.Columns.Add("GUID", typeof(String));
                    //dt.Columns.Add("Status", typeof(String));
                    //for (int i = 0; i < dt.Rows.Count; i++)
                    //{
                    //    dt.Rows[i]["Company_Code"] = companyCode;
                    //    dt.Rows[i]["Region_Code"] = Regioncode;
                    //    dt.Rows[i]["GUID"] = guid.ToString();
                    //    dt.Rows[i]["Status"] = "PROCESSING";
                    //}


                    List<RCPA_Doctor> lsRCPA_Doctor = new List<RCPA_Doctor>();
                    List<RCPA_SalesProduct> lsRCPA_SalesProduct = new List<RCPA_SalesProduct>();
                    List<RCPA_CompProduct> lsRCPA_CompProduct = new List<RCPA_CompProduct>();
                    List<string> columnName = new List<string>();
                    for (int j = 0; j < dt.Columns.Count; j++)
                    {
                        columnName.Add(dt.Columns[j].ColumnName.ToString());
                    }
                    var Count = 0;
                    foreach (DataRow row in dt.Rows)
                    {

                        string Doctor_name = "";
                        string SalesProduct_Name = "";
                        int sale_Product_Count = 0;
                        int Com_Product_Count = 0;
                        //GetDoctor Name
                        for (int i = 0; i < columnName.Count; i++)
                        {
                            var name = columnName[i].ToString().Split('_');
                            if (name.Length > 1)
                            {
                                if (name[0].ToUpper() == "D")
                                {
                                    Count++;
                                    lsRCPA_Doctor.Add(new RCPA_Doctor { Doctor_Name = row["D_Doctor_Name"].ToString(), Row_Number = Count });
                                    Doctor_name = row["D_Doctor_Name"].ToString();
                                }
                                else if (name[0].ToUpper() == "S")
                                {
                                    sale_Product_Count++;
                                    Com_Product_Count = 0;
                                    lsRCPA_SalesProduct.Add(new RCPA_SalesProduct { SalesProduct_Name = name[1], Product_Quantity = row[(name[0] + "_" + name[1])].ToString(), Doctor_Name = Doctor_name, Row_No = sale_Product_Count });
                                    SalesProduct_Name = name[1];
                                }
                                else if (name[0].ToUpper() == "C")
                                {
                                    Com_Product_Count++;
                                    lsRCPA_CompProduct.Add(new RCPA_CompProduct { SalesProduct_Name = SalesProduct_Name, Comp_Product_Name = name[1], Product_Quantity = row[(name[0] + "_" + name[1])].ToString(), Doctor_Name = Doctor_name, Row_No = Com_Product_Count });
                                }
                                else if (name[0] == "K")
                                {
                                }
                            }


                        }
                    }
                    result = _objDALRCPACompetator.RCPAInsert(lsRCPA_Doctor, lsRCPA_SalesProduct, lsRCPA_CompProduct, objrcpaHeader);
                    //result = _objDALRCPACompetator.RCPAExcelBulkInsert(companyCode, dt);
                    //  if (result == "SUCCESS")
                    // {
                    //     result = _objDALRCPACompetator.RCPAExcelBulkAddResult(subDomain, companyCode, Regioncode, guid, _employeeExcelTemplateFileName, uploadedBy, "EMPLOYEE_UPLOAD");
                    //// }
                    //  else
                    //  {
                    /////      result = "ERROR:Instructions are not followed." + result;
                    //   }

                }
            }

            catch (Exception ex)
            {
                result = "ERROR:Instructions not followed." + ex.Message;
            }
            return result;
        }

        public List<RcpaExcelUpload> GetExcelList(string Companycode, string Regioncode)
        {
            return _objDALRCPACompetator.GetExcelList(Companycode, Regioncode);
        }
    }
}
