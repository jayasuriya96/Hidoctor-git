using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataControl;
using MVCModels;
using System.Text;
using Microsoft.WindowsAzure.Storage.Blob;
using System.IO;
using Ionic.Zip;
using System.Net;
using Newtonsoft.Json.Linq;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class MyDocumentController : Controller
    {
        #region Private Variables
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        private SPData _objSPData = new SPData();
        DataControl.Data _objData = new DataControl.Data();
        BLMaster _objBlMaster = new BLMaster();
        string fileExtractingStatus = "YET TO PROCESS";
        #endregion Private Variables

        #region Public Methods
        public ActionResult DownloadmyDocuments()
        {
            return View();
        }

        public string GetMyDocumentstoDownload()
        {
            StringBuilder strTbl = new StringBuilder();
            List<MyDocumentTypeModel> lstDocumentTypes = new List<MyDocumentTypeModel>();
            int i = 0;
            try
            {
                lstDocumentTypes = _objBlMaster.GetMyDocumentstoDownload(_objcurrentInfo.GetCompanyCode(), _objcurrentInfo.GetUserCode(), _objcurrentInfo.GetRegionCode()).ToList();

                strTbl.Append("<table WIDTH='75%' id='tblMydoc' class='table table-striped'>");
                strTbl.Append("<thead class='active'>");
                strTbl.Append("<tr style='background-color:#428bca;'>");
                strTbl.Append("<th>Sl.No.</th>");
                strTbl.Append("<th>Type</th>");
                strTbl.Append("<th>Name</th>");
                strTbl.Append("<th> Actual File Name</th>");
                strTbl.Append("<th>Download</th>");
                strTbl.Append("</tr>");
                strTbl.Append("</thead>");
                strTbl.Append("<tbody>");
                if (lstDocumentTypes != null && lstDocumentTypes.Count > 0)
                {
                    foreach (var document in lstDocumentTypes)
                    {
                        i++;
                        strTbl.Append("<tr>");
                        //S.NO
                        strTbl.Append("<td>");
                        strTbl.Append(i);
                        strTbl.Append("</td>");
                        //Doc Type
                        strTbl.Append("<td>");
                        strTbl.Append(document.Doc_Type_Name);
                        strTbl.Append("</td>");
                        //Doc Name
                        strTbl.Append("<td>");
                        strTbl.Append(document.Doc_Name);
                        strTbl.Append("</td>");
                        strTbl.Append("<td>");
                        strTbl.Append(document.File_name);
                        strTbl.Append("</td>");
                        //Download
                        byte[] docidEncode = System.Text.Encoding.UTF8.GetBytes(document.Doc_Id);
                        String docId = Convert.ToBase64String(docidEncode);
                        strTbl.Append("<td>");
                        strTbl.Append("<a class='td-a downloadicon' data-id= id='aSubmit'  style='text-decoration:underline !important;' onclick=\"fnSetDocId('" + docId + "');\">&nbsp;</a>");
                        strTbl.Append("</td>");
                        strTbl.Append("</tr>");
                    }
                }
                else
                {
                    strTbl.Append("No Document details found to download.");
                }
                strTbl.Append("</tbody>");
                strTbl.Append("</table>");

                return strTbl.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return ex.Message.ToString();
            }
        }

        public ActionResult GetDocumentByDocId(FormCollection coll)
        {
            DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();
            DataControl.Abstraction.IFileProvider objProvider = new DataControl.Impl.FileSystemProvider();
            string docmentURL = string.Empty;
            string fileName = string.Empty;
            string docmentId = string.Empty;
            string error = "";
            string DOCSS = coll["docid"].ToString();
            if (!string.IsNullOrEmpty(DOCSS))
            {
                byte[] docIdDncode = System.Convert.FromBase64String(DOCSS);
                String docId = System.Text.Encoding.UTF8.GetString(docIdDncode);
                //docmentId = docId;

                docmentURL = _objBlMaster.GetDocumentbyDocId(_objcurrentInfo.GetCompanyCode(), _objcurrentInfo.GetUserCode(), docId);
                if (!string.IsNullOrEmpty(docmentURL.Split('#')[0]))
                {
                    //fileName = docmentURL.Substring(docmentURL.LastIndexOf(("/")) + 1);
                    int updatedResult = _objBlMaster.UpdateMyDocMentforDownload(_objcurrentInfo.GetCompanyCode(), _objcurrentInfo.GetUserCode(), docId, DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff"), _objcurrentInfo.GetUserCode());
                }
            }


            objFileDownload.DownloadFile(docmentURL.Split('#')[0],docmentURL.Split('#')[1], out error);
            return new EmptyResult();

        }

        #region Zip File uploads
        public ActionResult ZipFileUpload()
        {
            return View();
        }


        public string ZipFileuploadResult(HttpPostedFileBase fileUpload, FormCollection collection)
        {
            string documentTypecode = string.Empty;
            string month = string.Empty;
            string year = string.Empty;
            string documentName = string.Empty;
            string documentCategory = string.Empty;
            if (!string.IsNullOrEmpty(collection["txtdoctype"].ToString()))
            {
                documentTypecode = collection["txtdoctype"].ToString();
            }
            if (!string.IsNullOrEmpty(collection["txtdocMonth"].ToString()))
            {
                month = collection["txtdocMonth"].ToString();
            }
            if (!string.IsNullOrEmpty(collection["txtdocYear"].ToString()))
            {
                year = collection["txtdocYear"].ToString();
            }
            if (!string.IsNullOrEmpty(collection["txtdocName"].ToString()))
            {
                documentName = collection["txtdocName"].ToString();
            }
            if (!string.IsNullOrEmpty(collection["txtdocName"].ToString()))
            {
                documentCategory = collection["txtCatType"].ToString();
            }
            List <MVCModels.MyDocumentFileUploads> lstFiles = new List<MyDocumentFileUploads>();
            MyDocumentFileUploads _objFileupload = new MyDocumentFileUploads();
            DataControl.Repository.AzureBlobUpload objAzureUpload = new DataControl.Repository.AzureBlobUpload();
            WebClient wc = new WebClient();
            int rowsAffected = 0;
            string result = string.Empty;

            string companyCode = _objcurrentInfo.GetCompanyCode();
            // string companyCode = "HCT00000011";
            string fileName = fileUpload.FileName;
            string accountKey = "DefaultEndpointsProtocol=https;AccountName=uploadedfile;AccountKey=gUccvu0LoMEfdlYhbuE+TMP7QxDe8SF7TGZ8c35CJcBY4vJto9OCNOSbxuNPR5CTKgCvwxu1STD4c+IBtGfNcA==";

            string blobURL = objAzureUpload.AzureBlopforChunkUpload(fileUpload.InputStream, fileName, companyCode, accountKey);
            if (!string.IsNullOrEmpty(blobURL))
            {
                _objFileupload.Company_Code = companyCode;
                _objFileupload.Doc_Type_Id = documentTypecode;
                _objFileupload.Doc_Month = month;
                _objFileupload.Doc_Year = year;
                _objFileupload.Doc_Name = documentName;
                _objFileupload.Uploaded_File_Url = blobURL;
                _objFileupload.Uploaded_File_name = fileName;
                _objFileupload.Uploaded_Date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff");
                _objFileupload.Status = 1;
                _objFileupload.Processing_Status = 0;
                _objFileupload.File_Extracting_status = fileExtractingStatus;
                _objFileupload.Uploaded_By = _objcurrentInfo.GetUserCode();
                _objFileupload.Doc_Upload_Category = documentCategory;
                lstFiles.Add(_objFileupload);
                if (lstFiles.Count > 0)
                {
                    rowsAffected = _objBlMaster.InsertChunkFiles(lstFiles);
                }
                if (rowsAffected > 0)
                {
                    result = "SUCCESS";
                }
            }
            return result;
        }

        public JsonResult GetDocTypes()
        {
            DataControl.JSONConverter objJson = new DataControl.JSONConverter();
            List<MVCModels.MyDocumentsModel> lstMydocTypes = null;
            lstMydocTypes = _objBlMaster.GetMyDocTypes(_objcurrentInfo.GetCompanyCode()).ToList();
            return Json(objJson.Serialize(lstMydocTypes));
        }

        public JObject GetFileUploadStatus()
        {
            JObject jObject = new JObject();

            //jObject.Add("TotalSize", DataControl.Repository.AzureBlobUpload.TotalFileSize);
            //jObject.Add("FileBytesRead", DataControl.Repository.AzureBlobUpload.filesBytesRead);
            //jObject.Add("FileBytesLeft", DataControl.Repository.AzureBlobUpload.filesBytesLeft);

            return jObject;
        }

        public string GetSession()
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();

            return companyCode;
        }
        #endregion Zip File uploads

        #region Uploaded files count
        public ActionResult UploadedFileStatus()
        {
            return View();
        }

        public string GetUploadedFilesCount()
        {
            StringBuilder strTbl = new StringBuilder();
            _objBlMaster = new BLMaster();
            List<MVCModels.MyDocumentFileUploads> lstUploadeFilescount = new List<MyDocumentFileUploads>();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            try
            {
                lstUploadeFilescount = _objBlMaster.GetUploadedFilesCount(companyCode, _objcurrentInfo.GetUserCode()).ToList();

                strTbl.Append("<table WIDTH='75%' id='tblMydoc' class='table table-striped'>");
                strTbl.Append("<thead class='active'>");
                strTbl.Append("<tr style='background-color:#428bca;'>");
                strTbl.Append("<th>Uploaded File Name</th>");
                strTbl.Append("<th>Uploaded Date</th><th>Uploaded By</th><th>Uploaded File Count</th>");
                strTbl.Append("<th>Invalid File Count</th><th>File Extracting Status</th>");
                strTbl.Append("</tr>");
                strTbl.Append("</thead>");
                strTbl.Append("<tbody>");
                if (lstUploadeFilescount != null && lstUploadeFilescount.Count > 0)
                {
                    foreach (var file in lstUploadeFilescount)
                    {
                        strTbl.Append("<tr>");
                        //Uploaded File Name
                        strTbl.Append("<td>");
                        strTbl.Append(file.Uploaded_File_name);
                        strTbl.Append("</td>");
                        //Uploaded Date
                        strTbl.Append("<td>");
                        strTbl.Append(file.Uploaded_Date);
                        strTbl.Append("</td>");
                        //Uploaded By
                        strTbl.Append("<td>");
                        strTbl.Append(file.Uploaded_By);
                        strTbl.Append("</td>");
                        //Uploaded File Cound
                        strTbl.Append("<td>");
                        strTbl.Append(file.System_Uploaded_Files_Count);
                        strTbl.Append("</td>");
                        if (file.Invalid_File_Count > 0)
                        {
                            //Invalid file count
                            strTbl.Append("<td>");
                            //class='td-a downloadicon' data-id= id='aSubmit'  style='text-decoration:underline !important;' onclick=\"fnSetDocId('" + docId + "');\"
                            strTbl.Append("<a class='td-a' style='text-decoration:underline !important' onclick=\"CHUNKUPLOAD.fnGetInvalidFiles('" + file.Doc_Upload_Id + "_" + file.Uploaded_File_name + "_" + file.Uploaded_Date + "_" + file.Uploaded_By + "');\">" + file.Invalid_File_Count + "</a>");
                            // strTbl.Append(file.Invalid_File_Count);
                            strTbl.Append("</td>");
                        }
                        else
                        {
                            strTbl.Append("<td>0</td>");

                        }
                        //Extracting file status
                        strTbl.Append("<td>");
                        strTbl.Append(file.File_Extracting_status);
                        strTbl.Append("</td>");
                        strTbl.Append("</tr>");
                    }
                }
                else
                {
                    strTbl.Append("<span>No details found.</span>");
                }
                strTbl.Append("</tbody>");
                strTbl.Append("</table>");
                return strTbl.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return ex.Message.ToString();
            }
        }

        public string GetInvalidFiles(string docUploadId)
        {
            StringBuilder strTbl = new StringBuilder();
            _objBlMaster = new BLMaster();
            List<MVCModels.InvalidFiles> lstInvalidFiles = new List<InvalidFiles>();
            int s = 0;
            try
            {
                lstInvalidFiles = _objBlMaster.GetInvalidFiles(_objcurrentInfo.GetCompanyCode(), docUploadId).ToList();
                strTbl.Append("<table WIDTH='100%' id='tblMydoc' class='table table-striped'>");
                strTbl.Append("<thead class='active'>");
                strTbl.Append("<tr style='background-color:#428bca;'>");
                strTbl.Append("<th>S.No</th><th>Invalid File Name</th><th>Reason</th>");
                strTbl.Append("</tr>");
                strTbl.Append("</thead>");
                strTbl.Append("<tbody>");
                if (lstInvalidFiles != null && lstInvalidFiles.Count > 0)
                {
                    foreach (var fileName in lstInvalidFiles)
                    {
                        s++;
                        strTbl.Append("<tr>");
                        //S.No
                        strTbl.Append("<td>");
                        strTbl.Append(s);
                        strTbl.Append("</td>");
                        //Invalid File Name
                        strTbl.Append("<td>");
                        strTbl.Append(fileName.Doc_file_Name);
                        strTbl.Append("</td>");
                        //Reason
                        strTbl.Append("<td>");
                        strTbl.Append(fileName.ERR_REASON);
                        strTbl.Append("</td>");
                        strTbl.Append("</tr>");
                    }
                }
                else
                {
                    strTbl.Append("No Details Found.");
                }
                strTbl.Append("</tbody>");
                strTbl.Append("</table>");
                return strTbl.ToString();
            }

            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("docUploadId", docUploadId);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return ex.Message.ToString();
            }
        }
        #endregion Uploaded files count
        #endregion Public Methods

    }
}
