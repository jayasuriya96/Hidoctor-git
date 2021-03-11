using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using DataControl.HiDoctor_ActivityFactoryClasses;
using System.IO;
using System.Text;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.WindowsAzure.Storage.RetryPolicies;
using System.Globalization;
using System.Configuration;
using System.Reflection;
using MVCModels;

namespace HiDoctor_Activity.Controllers
{
    public class NoticeBoardController : Controller
    {
        BL_NoticeBoard _ObjNoticeBoard = new BL_NoticeBoard();
        DataControl.JSONConverter json = new DataControl.JSONConverter();
        DataControl.CurrentInfo _objCurrent = new DataControl.CurrentInfo();


        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Details(int id)
        {
            return View();
        }

        public ActionResult Create()
        {
            ViewBag.TodaysDate = DateTime.Now.Date.ToString("yyyy-MM-dd");
            ViewBag.AttachmentSize = GetNoticeBoardAttachmentMaxSize();
            return View();
        }

        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        public ActionResult Edit(int id)
        {
            return View();
        }

        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        public ActionResult Delete(int id)
        {
            return View();
        }

        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //Notice Board Read//
        public ActionResult NoticeBoardRead()
        {
            return View();
        }



        private int GetNoticeBoardAttachmentMaxSize()
        {
            try
            {
                int attachmentSize = 0;

                attachmentSize = _ObjNoticeBoard.GetNoticeBoardAttachmentMaxSize();


                return attachmentSize;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
        }

        public string GetDistributionTypes()
        {
            try
            {
                string distributionTypes = string.Empty;

                distributionTypes = _ObjNoticeBoard.GetDistributionTypes();

                return distributionTypes;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
        }
        public string GetGroupDetails()
        {
            try
            {
                string GroupNames = string.Empty;

                GroupNames = _ObjNoticeBoard.GetGroupDetails();

                return GroupNames;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
        }
        public string GetAllRegionTypes()
        {
            try
            {
                string regionTypes = string.Empty;

                regionTypes = _ObjNoticeBoard.GetAllRegionTypes();

                return regionTypes;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
        }

        public string GetAllUserTypes()
        {
            try
            {
                string userTypes = string.Empty;

                userTypes = _ObjNoticeBoard.GetAllUserTypes();

                return userTypes;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
        }

        public string GetAllDivision()
        {
            try
            {
                string userTypes = string.Empty;

                userTypes = _ObjNoticeBoard.GetAllDivision();

                return userTypes;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
        }

        public string GetUserTypesUnderMe()
        {
            try
            {
                string userTypes = string.Empty;

                userTypes = _ObjNoticeBoard.GetUserTypesUnderMe();

                return userTypes;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
        }

        public string GetAllNotices()
        {
            try
            {
                string tableContent = string.Empty;

                tableContent = _ObjNoticeBoard.GetAllNoticeDetails();

                return tableContent;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
        }

        public string SaveNoticeBoard(FormCollection collection)
        {
            try
            {
                string msgCode = collection["MsgCode"].ToString().Trim();
                string msgTitle = collection["MsgTitle"].ToString().Trim().Replace("~~~", "&");
                string msgBody = collection["MsgBody"].ToString().Trim().Replace("~~~", "&");
                string hyperlink = collection["HyperLink"].ToString().Trim().Replace("~~~", "&");
                string priority = collection["Priority"].ToString().Trim();
                string validFrom = collection["ValidFrom"].ToString().Trim();
                string validTo = collection["ValidTo"].ToString().Trim();
                string distType = collection["DistType"].ToString().Trim();
                string ackReqd = collection["AckReqd"].ToString().Trim();
                string fileName = collection["FileName"].ToString().Trim();
                string selectedNodeValues = collection["SelectedNodeValues"].ToString().Trim();
                string saveMode = collection["SaveMode"].ToString().Trim();
                string showTicker = collection["showTicker"].ToString().Trim();
                string highlight = collection["highlight"].ToString().Trim();

                string message = string.Empty;

                message = _ObjNoticeBoard.SaveNoticeBoard(msgCode, msgTitle, msgBody, hyperlink, priority, validFrom, validTo, distType, ackReqd, fileName, selectedNodeValues, saveMode, showTicker, highlight);

                return message;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
        }

        public JsonResult EditNoticeBoard(string msgCode)
        {
            try
            {
                MVCModels.NoticeBoardModel objNoticeBoardModel;

                objNoticeBoardModel = _ObjNoticeBoard.GetSingleNoticeDetails(msgCode);

                return Json(objNoticeBoardModel);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("msgCode:", msgCode);
                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
        }

        public string DeleteNoticeBoard(string msgCode)
        {
            try
            {
                string deleteMessage = string.Empty;

                deleteMessage = _ObjNoticeBoard.DeleteNoticeBoard(msgCode);

                return deleteMessage;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("msgCode:", msgCode);
                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
        }

        public string GetNoticeReadStatus(string msgCode)
        {
            try
            {
                string readStatusString = string.Empty;

                readStatusString = _ObjNoticeBoard.GetNoticeReadStatus(msgCode);

                return readStatusString;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("msgCode:", msgCode);
                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
        }

        [HttpPost]
        public string UploadAttachment(FormCollection coll)
        {
            try
            {
                System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
                DataControl.CurrentInfo objCur = new DataControl.CurrentInfo();
                string companyCode = objCur.GetCompanyCode();
                string newFilename = string.Empty;
                var container = Microsoft.WindowsAzure.Storage.CloudStorageAccount.Parse(
                        ConfigurationManager.AppSettings["NBBLOBACCKEY"]).CreateCloudBlobClient()
                    .GetContainerReference(companyCode.ToLower());
                container.CreateIfNotExists();

                int blocksCount = int.Parse(coll["blocksCount"].ToString());
                string fileName = coll["fileName"].ToString();
                fileName = fileName.Substring(fileName.LastIndexOf("\\") + 1);
                newFilename = fileName;
                string fileExtenstion = fileName.Substring(fileName.LastIndexOf("."));
                long fileSize = long.Parse(coll["fileSize"].ToString());
                newFilename = newFilename.Substring(0, newFilename.LastIndexOf('.'));
                newFilename = newFilename.ToString().Trim().Replace(" ", "_");

                fileName = newFilename + "_" + objCur.GetUserName() + "_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + fileExtenstion;

                var fileToUpload = new MVCModels.CloudFile()
                {
                    BlockCount = blocksCount,
                    FileName = fileName,
                    Size = fileSize,
                    BlockBlob = container.GetBlockBlobReference(fileName),
                    StartTime = DateTime.Now,
                    IsUploadCompleted = false,
                    UploadStatusMessage = string.Empty
                };
                Session.Add("CurrentFile", fileToUpload);
                return fileName;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult UploadChunk(int id)
        {
            try
            {
                HttpPostedFileBase request = Request.Files["Slice"];
                byte[] chunk = new byte[request.ContentLength];
                request.InputStream.Read(chunk, 0, Convert.ToInt32(request.ContentLength));
                JsonResult returnData = null;
                string fileSession = "CurrentFile";
                if (Session[fileSession] != null)
                {
                    MVCModels.CloudFile model = (MVCModels.CloudFile)Session[fileSession];
                    returnData = UploadCurrentChunk(model, chunk, id);
                    if (returnData != null)
                    {
                        return returnData;
                    }
                    if (id == model.BlockCount)
                    {
                        return CommitAllChunks(model);
                    }
                }
                else
                {
                    returnData = Json(new
                    {
                        error = true,
                        isLastBlock = false,
                        message = string.Format(CultureInfo.CurrentCulture,
                            "Failed to Upload file.", "Session Timed out")
                    });
                    return returnData;
                }

                return Json(new { error = false, isLastBlock = false, message = string.Empty });
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
        }

        private ActionResult CommitAllChunks(MVCModels.CloudFile model)
        {
            model.IsUploadCompleted = true;
            bool errorInOperation = false;
            try
            {
                var blockList = Enumerable.Range(1, (int)model.BlockCount).ToList<int>().ConvertAll(rangeElement =>
                            Convert.ToBase64String(Encoding.UTF8.GetBytes(
                                string.Format(CultureInfo.InvariantCulture, "{0:D4}", rangeElement))));
                model.BlockBlob.PutBlockList(blockList);
                var duration = DateTime.Now - model.StartTime;
                float fileSizeInKb = model.Size / 1024;
                string fileSizeMessage = fileSizeInKb > 1024 ?
                    string.Concat((fileSizeInKb / 1024).ToString(CultureInfo.CurrentCulture), " MB") :
                    string.Concat(fileSizeInKb.ToString(CultureInfo.CurrentCulture), " KB");
                model.UploadStatusMessage = string.Format(CultureInfo.CurrentCulture,
                    "File uploaded successfully. {0} took {1} seconds to upload",
                    fileSizeMessage, duration.TotalSeconds);
            }
            catch (Exception e)
            {
                model.UploadStatusMessage = "Failed to Upload file. Exception - " + e.Message;
                errorInOperation = true;

                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(e, dicContext);
            }
            finally
            {

            }
            return Json(new
            {
                error = errorInOperation,
                isLastBlock = model.IsUploadCompleted,
                message = model.UploadStatusMessage
            });
        }

        private JsonResult UploadCurrentChunk(MVCModels.CloudFile model, byte[] chunk, int id)
        {
            try
            {
                using (var chunkStream = new MemoryStream(chunk))
                {
                    var blockId = Convert.ToBase64String(Encoding.UTF8.GetBytes(
                            string.Format(CultureInfo.InvariantCulture, "{0:D4}", id)));
                    try
                    {
                        model.BlockBlob.PutBlock(
                            blockId,
                            chunkStream, null, null,
                            new BlobRequestOptions()
                            {
                                RetryPolicy = new LinearRetry(TimeSpan.FromSeconds(10), 3)
                            },
                            null);
                        return null;
                    }
                    catch (StorageException e)
                    {
                        Session.Remove("CurrentFile");
                        model.IsUploadCompleted = true;
                        model.UploadStatusMessage = "Failed to Upload file. Exception - " + e.Message;
                        return Json(new { error = true, isLastBlock = false, message = model.UploadStatusMessage });
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();

                dicContext.Add("Method:", MethodBase.GetCurrentMethod().Name);

                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);

                throw ex;
            }
        }

        public string GetAllNoticesReadDetail()
        {
            DataControl.CurrentInfo objCur = new DataControl.CurrentInfo();
            string companyCode = objCur.GetCompanyCode();
            string userCode = objCur.GetUserCode();
            try
            {
                StringBuilder sbTableContent = new StringBuilder();
                DataControl.HiDoctor_ActivityFactoryClasses.BL_NoticeBoard _objBlActivity = new DataControl.HiDoctor_ActivityFactoryClasses.BL_NoticeBoard();
                DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
                IEnumerable<MVCModels.NoticeBoardContentModel> lstdata = null;
                lstdata = _objBlActivity.GetNoticeBoarddetail(companyCode, userCode);
                sbTableContent.Append("</div>");
                sbTableContent.Append("<table id='NoticeBoardRead' class='table table-striped' >");
                sbTableContent.Append("<thead class='active'>");
                sbTableContent.Append("<tr><td>Title</td>");
                sbTableContent.Append("<td>ActiveFrom</td>");
                sbTableContent.Append("<td>ActiveTo</td>");
                sbTableContent.Append("<td>Author</td>");
                sbTableContent.Append("<td>IsRead</td></tr>");
                sbTableContent.Append("</thead>");
                if (lstdata.ToList().Count > 0)
                {
                    foreach (var item in lstdata)
                    {
                        if (item.Is_Read.ToString() == "No")
                        {
                            sbTableContent.Append("<tr style='font-weight:bold;font-style:italic;color:rgb(52, 172, 52)'><td><span   onclick=\"GetNoticepopup('" + item.Msg_Code + "')\" style='text-decoration:underline;cursor:pointer'>" + item.Title + "</span></td>");
                            sbTableContent.Append("<td>" + item.Active_From + "</td>");
                            sbTableContent.Append("<td>" + item.Active_To + "</td>");
                            sbTableContent.Append("<td>" + item.Employee_Name + "(" + item.Author + ")</td>");
                            sbTableContent.Append("<td>" + item.Is_Read + "</td></tr>");
                        }
                        else
                        {
                            sbTableContent.Append("<tr><td><span   onclick=\"GetNoticepopup('" + item.Msg_Code + "')\" style='text-decoration:underline;cursor:pointer'>" + item.Title + "</span></td>");
                            sbTableContent.Append("<td>" + item.Active_From + "</td>");
                            sbTableContent.Append("<td>" + item.Active_To + "</td>");
                            sbTableContent.Append("<td>" + item.Employee_Name + "(" + item.Author + ")</td>");
                            sbTableContent.Append("<td>" + item.Is_Read + "</td></tr>");
                        }
                    }
                }
                else
                {

                    sbTableContent.Append("No records found");
                }
                return sbTableContent.ToString();

            }


            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:CompanyCode", companyCode);
                dicContext.Add("Filter:UserCode", userCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw new Exception("Sorry an error occurred. Please try again later");

                throw ex;
            }

        }

        public string GetAllNoticeMandatoryDetail()
        {
            DataControl.CurrentInfo objCur = new DataControl.CurrentInfo();
            string companyCode = objCur.GetCompanyCode();
            string userCode = objCur.GetUserCode();
            try
            {
                StringBuilder sbTableContent = new StringBuilder();
                DataControl.HiDoctor_ActivityFactoryClasses.BL_NoticeBoard _objBlActivity = new DataControl.HiDoctor_ActivityFactoryClasses.BL_NoticeBoard();
                DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
                IEnumerable<MVCModels.NoticeBoardContentModel> lstdata = null;
                lstdata = _objBlActivity.GetNoticeBoarddetail(companyCode, userCode);
                sbTableContent.Append("</div>");
                sbTableContent.Append("<table id='NoticeBoardRead' class='table table-striped' style='width:100% !important;padding:4px !important;'>");
                sbTableContent.Append("<thead class='active'>");
                sbTableContent.Append("<tr><td>Title</td>");
                sbTableContent.Append("<td>ActiveFrom</td>");
                sbTableContent.Append("<td>ActiveTo</td>");
                sbTableContent.Append("<td>Author</td>");
                sbTableContent.Append("<td>IsRead</td></tr>");
                sbTableContent.Append("</thead>");
                if (lstdata.ToList().Count > 0)
                {
                    foreach (var item in lstdata)
                    {
                        if (item.Is_Read.ToString() == "No")
                        {
                            sbTableContent.Append("<tr style='font-weight:bold;font-style:italic;color:rgb(52, 172, 52)'><td><span   onclick=\"GetNoticepopup('" + item.Msg_Code + "')\" style='text-decoration:underline;cursor:pointer'>" + item.Title + "</span></td>");
                            sbTableContent.Append("<td>" + item.Active_From + "</td>");
                            sbTableContent.Append("<td>" + item.Active_To + "</td>");
                            sbTableContent.Append("<td>" + item.Employee_Name + "(" + item.Author + ")</td>");
                            sbTableContent.Append("<td>" + item.Is_Read + "</td></tr>");
                        }
                    }
                }
                else
                {

                    sbTableContent.Append("No records found");
                }
                return sbTableContent.ToString();

            }


            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:CompanyCode", companyCode);
                dicContext.Add("Filter:UserCode", userCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw new Exception("Sorry an error occurred. Please try again later");

                throw ex;
            }

        }

        public JsonResult GetNoticeBoardIsRead()
        {
            DataControl.CurrentInfo objCur = new DataControl.CurrentInfo();
            string companyCode = objCur.GetCompanyCode();
            string userCode = objCur.GetUserCode();
            try
            {
                StringBuilder sbTableContent = new StringBuilder();
                DataControl.HiDoctor_ActivityFactoryClasses.BL_NoticeBoard _objBlActivity = new DataControl.HiDoctor_ActivityFactoryClasses.BL_NoticeBoard();
                DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
                IEnumerable<MVCModels.NoticeBoardContentModel> lstdata = null;
                lstdata = _objBlActivity.GetNoticeBoarddetail(companyCode, userCode);
                return Json(lstdata, JsonRequestBehavior.AllowGet);

            }


            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:CompanyCode", companyCode);
                dicContext.Add("Filter:UserCode", userCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw new Exception("Sorry an error occurred. Please try again later");

                throw ex;
            }

        }


        public string GetAllNoticesReadPopup(string mesgCode)
        {
            DataControl.CurrentInfo objCur = new DataControl.CurrentInfo();
            string companyCode = objCur.GetCompanyCode();
            string userCode = objCur.GetUserCode();
            try
            {
                StringBuilder sbTableContent = new StringBuilder();
                DataControl.HiDoctor_ActivityFactoryClasses.BL_NoticeBoard _objBlActivity = new DataControl.HiDoctor_ActivityFactoryClasses.BL_NoticeBoard();
                DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
                IEnumerable<MVCModels.NoticeBoardContentModel> lstdata = null;
                lstdata = _objBlActivity.GetNoticeBoardPopup(companyCode, mesgCode, userCode);
                sbTableContent.Append("</div>");
                sbTableContent.Append("<table id='NoticeBoardpopup' class='table table-striped' style='width:100%;'>");
                DataControl.Repository.AzureBlobUpload objAzureUpload = new DataControl.Repository.AzureBlobUpload();
                DataControl.Abstraction.IFileProvider objPathProv = new DataControl.Impl.FileSystemProvider();
                string accKey = objPathProv.GetConfigValue("NBFILES");
                //   string blobURL = objAzureUpload.AzureblockDownload(postedFile.FileName, accKey, containerName);

                foreach (var item in lstdata)
                {
                    sbTableContent.Append("<thead class='active'>");
                    sbTableContent.Append("<tr><td>NoticeBoardInfo</td><td></td></tr>");
                    sbTableContent.Append("</thead>");
                    sbTableContent.Append("<tr><td>Author</td>");
                    sbTableContent.Append("<td>" + item.Employee_Name + "(" + item.Author + ")</td></tr>");
                    sbTableContent.Append("<tr><td>Title</td>");
                    sbTableContent.Append("<td>" + item.Title + "</td></tr>");
                    sbTableContent.Append("<tr><td>Message</td>");
                    sbTableContent.Append("<td>" + item.Message + "</td></tr>");
                    sbTableContent.Append("<tr><td>Hyperlink</td>");
                    sbTableContent.Append("<td class='td-a'><a style='text-decoration:underline;cursor:pointer;' target='_blank' href='" + item.Hyperlink + "'>" + item.Hyperlink + "</a></td></tr>");
                    sbTableContent.Append("<tr><td>Attachments</td>");
                    string blobURL = accKey + Session["Comp_Code"].ToString().ToLower() + "/" + HttpUtility.UrlEncode(item.FilePath).ToString();
                    if (item.FilePath != "")
                    {
                        sbTableContent.Append("<td <div id='dvURL' class='div-alert'>Click on link to download : <a href=" + blobURL + " target='_blank' >" + item.FilePath + "</a></div></td></tr>");
                    }
                    else
                    {
                        sbTableContent.Append("<td></td></tr>");
                    }
                }
                return sbTableContent.ToString();

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:CompanyCode", companyCode);
                dicContext.Add("Filter:UserCode", userCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw new Exception("Sorry an error occurred. Please try again later");

                throw ex;
            }

        }
        public JsonResult GetUserCodeDivisionwise(string userTypeCodes, string divisionCodes)
        {
            List<MVCModels.userList> lstUser = new List<MVCModels.userList>();
            lstUser = _ObjNoticeBoard.GetUserDivisionWise(userTypeCodes, divisionCodes);
            return Json(json.Serialize(lstUser));
        }

        public JsonResult GetRegionCodeDivisionwise(string regionsCodes, string divisionCodes)
        {
            List<MVCModels.userList> lstRegions = new List<MVCModels.userList>();
            lstRegions = _ObjNoticeBoard.GetRegionDivisionWise(regionsCodes, divisionCodes);
            return Json(json.Serialize(lstRegions));
        }

        #region - Active Notice for Inactive User
        public ActionResult NoticeauthorMovement()
        {
            ViewBag.User_Code = _objCurrent.GetUserCode();
            return View();
        }

        public string GetActiveNoticeforInactiveUser()
        {
            StringBuilder strList = new StringBuilder();
            List<NoticeContentforUserModel> lstInactiveUserforActivenotice = new List<NoticeContentforUserModel>();

            _ObjNoticeBoard = new BL_NoticeBoard();
            lstInactiveUserforActivenotice = _ObjNoticeBoard.GetActiveNoticeforInactiveUser(_objCurrent.GetCompanyCode()).ToList();
            if (lstInactiveUserforActivenotice != null && lstInactiveUserforActivenotice.Count > 0)
            {
                foreach (var inactiveUser in lstInactiveUserforActivenotice)
                {
                    strList.Append("<div class='dvDisableUser' onclick='fnDisableUserClick(\"" + inactiveUser.User_Code + "\");$(this).addClass(\"selectNode\");' >" + inactiveUser.User_Name + "</div>");
                }
            }

            return strList.ToString();
        }

        public string GetNoticeContent(string userCode)
        {
            StringBuilder strTbl = new StringBuilder();
            _ObjNoticeBoard = new BL_NoticeBoard();
            List<NoticeContentforUserModel> lstNoticecontent = new List<NoticeContentforUserModel>();
            lstNoticecontent = _ObjNoticeBoard.GetNoticeContent(_objCurrent.GetCompanyCode(), userCode).ToList();
            int s = 0;
            strTbl.Append("<table class='table table-striped' id='tblNoticecontent'>");
            strTbl.Append("<thead class='active'>");
            strTbl.Append("<tr>");
            strTbl.Append("<th></th><th>Tile</th><th>Active From</th><th>Active To</th><th>Author</th>");
            strTbl.Append("</tr>");
            strTbl.Append("</thead>");
            strTbl.Append("<tbody>");
            if (lstNoticecontent != null && lstNoticecontent.Count > 0)
            {
                foreach (var notice in lstNoticecontent)
                {
                    strTbl.Append("<tr>");
                    strTbl.Append("<td>");
                    //activityLockString.Append("<input name='chkUserSelect' class='checkboxclass' type='checkbox'  id='chk_" + index.ToString() + "' name='checkbox'>");
                    strTbl.Append("<input type='checkbox' id='chk_" + s + "' name='chkselect'  value='" + notice.Msg_Code + "'>");
                    strTbl.Append("</td>");
                    strTbl.Append("<td>" + notice.Title + "</td>");
                    strTbl.Append("<td>" + notice.Date_From + "</td>");
                    strTbl.Append("<td>" + notice.Date_To + "</td>");
                    strTbl.Append("<td>" + notice.User_Name + "</td>");
                    strTbl.Append("<input type='hidden' id='hdnUserNotice_" + s + "' value='" + notice.User_Code + "$" + notice.Msg_Code + "'/>");
                    strTbl.Append("</tr>");
                    s++;
                }
            }
            else
            {
                strTbl.Append("<tr><td colspan='4' style='text-align:center;'>No Notice Found</td></tr>");
            }
            strTbl.Append("</tbody>");
            strTbl.Append("</table>");
            return strTbl.ToString();
        }

        public string UpdateNoticetoActiveUser(string AsignuserCode, string MessageCodes, string userCode)
        {
            string[] messageCodesarr = MessageCodes.Split('^');
            _ObjNoticeBoard = new BL_NoticeBoard();
            List<NoticeContentforUserModel> lstNotices = new List<NoticeContentforUserModel>();
            string message = string.Empty;
            int result = 0;
            if (messageCodesarr.Length > 0)
            {
                foreach (string messageCode in messageCodesarr)
                {
                    if (!string.IsNullOrEmpty(messageCode))
                    {
                        NoticeContentforUserModel _objNotice = new NoticeContentforUserModel();
                        _objNotice.Msg_Code = messageCode;
                        lstNotices.Add(_objNotice);
                    }
                }
                lstNotices.ForEach
                    (
                     s => s.Company_Code = _objCurrent.GetCompanyCode()
                    );
                lstNotices.ForEach
                    (
                    s => s.Asigned_User_Code = AsignuserCode
                    );
                lstNotices.ForEach
                    (
                    s => s.User_Code = userCode
                    );


            }
            result = _ObjNoticeBoard.UpdateActiveNoticeforInactiveuser(lstNotices);
            if (result > 0)
            {
                message = "Notice Asigned correctly";
            }
            return message;
        }
        #endregion - Active Notice for Inactive User

        #region - User Group Creation

        public ActionResult GroupCreation()
        {
            return View();
        }

        public int InsertNewGroup(string UserCodes, string GroupName)
        {
            int result = 0;

            BL_NoticeBoard ObjNewGroup = new BL_NoticeBoard();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string UserName = objCurInfo.GetUserName();
            string RegionCode = objCurInfo.GetRegionCode();
            result = ObjNewGroup.InsertNewGroup(UserCodes, GroupName, UserName, RegionCode);
            return result;
        }
        public JsonResult GetGroupNames()
        {
            List<MVCModels.UserGroup> lstGroups = new List<MVCModels.UserGroup>();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string RegionCode = objCurInfo.GetRegionCode();
            lstGroups = _ObjNoticeBoard.GetGroupNames(RegionCode);
            return Json(lstGroups, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetGroupmembers(int Group_Id)
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string RegionCode = objCurInfo.GetRegionCode();
            UserGroupHistory lstGrpMembs = new UserGroupHistory();
            lstGrpMembs = _ObjNoticeBoard.GetGroupmembers(Group_Id, RegionCode);
            return Json(lstGrpMembs, JsonRequestBehavior.AllowGet);

        }
        public JsonResult GetUserCodesForTree(int Group_Id)
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            List<MVCModels.UserCodeTree> lstTreeMembs = new List<MVCModels.UserCodeTree>();
            lstTreeMembs = _ObjNoticeBoard.GetUserCodesForTree(Group_Id);
            return Json(lstTreeMembs, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetMembsUpdDateWise(int Group_Id, int GROUP_SEQ)
        {
            List<MVCModels.GroupUpdatedHistory> lstGrpHisMembs = new List<MVCModels.GroupUpdatedHistory>();
            lstGrpHisMembs = _ObjNoticeBoard.GetMembsUpdDateWise(Group_Id, GROUP_SEQ);
            return Json(lstGrpHisMembs, JsonRequestBehavior.AllowGet);

        }
        public int UpdateGroupStatus(int Group_Id, int Status)
        {
            int result = 0;
            BL_NoticeBoard ObjGroupStatus = new BL_NoticeBoard();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            result = ObjGroupStatus.UpdateGroupStatus(Group_Id, Status);
            return result;
        }
        public int UpdateGroupDetails(string UserCodes, string GroupName, int Group_Id)
        {
            int result = 0;
            BL_NoticeBoard ObjGroupDet = new BL_NoticeBoard();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string UserName = objCurInfo.GetUserName();
            result = ObjGroupDet.UpdateGroupDetails(UserCodes, GroupName, Group_Id, UserName);
            return result;
        }
        #endregion - User Group Creation

    }
}

