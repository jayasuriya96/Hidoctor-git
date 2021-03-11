using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataControl.HD_MasterFactoryClasses;
using MVCModels;
using System.IO;
using System.Text;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.WindowsAzure.Storage.RetryPolicies;
using System.Globalization;
using System.Configuration;
using System.Reflection;

namespace HiDoctor_Master.Controllers
{
    [DataControl.AjaxSessionActionFilter]
    public class SplashScreenController : Controller
    {
        BL_SplashScreen _objBLSplashScreen = new BL_SplashScreen();
        //
        // GET: /SplashScreen/

        public ActionResult Index()
        {
            return View();
        }

        //
        // GET: /SplashScreen/Details/5

        public ActionResult Details(int id)
        {
            return View();
        }

        //
        // GET: /SplashScreen/Create

        public ActionResult Create()
        {
            ViewBag.TodaysDate = DateTime.Now.Date.ToString("yyyy-MM-dd");
            return View();
        }

        public string GetAllSplashScreenData()
        {
            try
            {
                string tableContent = _objBLSplashScreen.GetAllSplashScreenData();

                return tableContent;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //
        // POST: /SplashScreen/Create

        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /SplashScreen/Edit/5

        public ActionResult Edit(int id)
        {
            return View();
        }

        //
        // POST: /SplashScreen/Edit/5

        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /SplashScreen/Delete/5

        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /SplashScreen/Delete/5

        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //public string CheckOverlappingSplashScreenData(string splashScreenId, string validFrom, string validTo, string saveMode)
        //{
        //    try
        //    {
        //        string returnMsg = _objBLSplashScreen.CheckOverlappingSplashScreenData(splashScreenId, validFrom, validTo, saveMode);

        //        return returnMsg;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //}

        public string SaveSplashScreenData(FormCollection collection)
        {
            try
            {
                string splashScreenId = Convert.ToString(collection["splashScreenId"]).Trim();
                string Splashtype = Convert.ToString(collection["Splashtype"]).Trim();
                string title = Convert.ToString(collection["title"]).Trim();
                string description = Convert.ToString(collection["description"]).Trim();
                string validFrom = Convert.ToString(collection["validFrom"]).Trim();
                string validTo = Convert.ToString(collection["validTo"]).Trim();
                string fileName = Convert.ToString(collection["fileName"]).Trim();
                string mobileAttachmentUrl = Convert.ToString(collection["mobileFileName"]).Trim();
                string saveMode = Convert.ToString(collection["saveMode"]).Trim();
                string descHtml = Convert.ToString(collection["descHtml"]).Trim();
                descHtml = System.Uri.UnescapeDataString(descHtml.Replace("á", "<").Replace("í", ">").Replace("ó", "/").Replace("ú", "\"")); ////ALT+160 = á , ALT+161 = í,ALT+162= ó,ALT+163 = ú
                bool hasAttachment = false;
                int assignToAllUsers = 0;
                int isCompleted = 0;
                if (!string.IsNullOrEmpty(fileName))
                {
                    hasAttachment = true;
                }

                DateTime lastModifiedDate = System.DateTime.UtcNow;

                string returnMsg = _objBLSplashScreen.SaveSplashScreen(splashScreenId, Splashtype, title, description, validFrom, validTo, fileName, saveMode, mobileAttachmentUrl, descHtml, hasAttachment, assignToAllUsers, isCompleted, lastModifiedDate);


                return returnMsg;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string EditSplashScreen(string splashScreenId)
        {
            try
            {
                string editString = _objBLSplashScreen.GetSplashScreenDataForEdit(splashScreenId);

                return editString;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string ChangeStatus(string splashScreenId, string currentStatus)
        {
            try
            {
                string returnMsg = _objBLSplashScreen.ChangeSplashScreenStatus(splashScreenId, currentStatus);

                return returnMsg;
            }
            catch (Exception ex)
            {
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

                var container = Microsoft.WindowsAzure.Storage.CloudStorageAccount.Parse(
                        ConfigurationManager.AppSettings["NBBLOBACCKEY"]).CreateCloudBlobClient()
                    .GetContainerReference(companyCode.ToLower());
                container.CreateIfNotExists();

                int blocksCount = int.Parse(coll["blocksCount"].ToString());
                string fileName = coll["fileName"].ToString();
                long fileSize = long.Parse(coll["fileSize"].ToString());
                string fileExtenstion = fileName.Substring(fileName.LastIndexOf('.'));
                fileName = "SPLASH_" + Guid.NewGuid().ToString() + fileExtenstion;

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
                ViewBag.FileName = fileName;

                return "SUCCESS:" + fileName;
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

        public JsonResult GetChildUsers()
        {
            try
            {
                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                string userCode = string.Empty;
                string companyCode = string.Empty;
                userCode = objCurInfo.GetUserCode();
                companyCode = objCurInfo.GetCompanyCode();
                List<MVCModels.HiDoctor_Master.DivisionModel> lstDivision = new List<MVCModels.HiDoctor_Master.DivisionModel>();
                lstDivision = _objBLSplashScreen.GetUnderDivisions(companyCode, userCode).ToList();

                List<MVCModels.HiDoctor_Master.UserTypeModel> lstUT = new List<MVCModels.HiDoctor_Master.UserTypeModel>();
                lstUT = _objBLSplashScreen.GetUnderUserTypes(companyCode, userCode).ToList();
                List<JsonResult> lst = new List<JsonResult> { Json(lstDivision, JsonRequestBehavior.AllowGet), Json(lstUT, JsonRequestBehavior.AllowGet) };
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public LargeJsonResult GetSplashMappedUsers(int splashId)
        {
            try
            {
                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                string userCode = string.Empty;
                string companyCode = string.Empty;
                userCode = objCurInfo.GetUserCode();
                companyCode = objCurInfo.GetCompanyCode();
                List<MVCModels.HiDoctor_Master.UserModel> lstUT = new List<MVCModels.HiDoctor_Master.UserModel>();
                lstUT = _objBLSplashScreen.GetSplashMappedUsers(companyCode, splashId).ToList();
                //  return Json(lstUT, JsonRequestBehavior.AllowGet);
                return new LargeJsonResult
                {
                    MaxJsonLength = Int32.MaxValue,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                    Data = new
                    {
                        lstUT
                    }
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public JsonResult GetGroupDetails()
        {
            try
            {
                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                string UserName = objCurInfo.GetUserName();
                List<MVCModels.HiDoctor_Master.GroupDetails> lstGroup = new List<MVCModels.HiDoctor_Master.GroupDetails>();
                lstGroup = _objBLSplashScreen.GetGroupDetails(UserName).ToList();
                return Json(lstGroup, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        public JsonResult GetUnderUsersByDivisionAndUT(string divisionCodes, string userTypeCodes)
        {
            try
            {
                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                string userCode = string.Empty;
                string companyCode = string.Empty;
                userCode = objCurInfo.GetUserCode();
                companyCode = objCurInfo.GetCompanyCode();
                List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
                lstUser = _objBLSplashScreen.GetUnderUsersByDivisionAndUT(companyCode, userCode, divisionCodes, userTypeCodes).ToList();
                return Json(lstUser, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public string InsertSplashUsers(int splashId, string Splashtype, string users, int isAssignToAll, string mode)
        {
            try
            {
                _objBLSplashScreen = new BL_SplashScreen();
                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                List<MVCModels.SplashUsersModel> lstSplashUsers = new List<SplashUsersModel>();
                DataControl.BLUser objUser = new DataControl.BLUser();
                List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
                lstUser = objUser.GetChildUsers(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode());
                if (isAssignToAll == 1)
                {
                    foreach (MVCModels.HiDoctor_Master.UserModel user in lstUser)
                    {
                        MVCModels.SplashUsersModel objSUsers = new SplashUsersModel();
                        objSUsers.User_Id = Convert.ToInt32(user.User_Id);
                        objSUsers.Company_Code = objCurInfo.GetCompanyCode();
                        objSUsers.Splash_Screen_Id = splashId;
                        lstSplashUsers.Add(objSUsers);
                    }
                }
                else
                {
                    string[] ar = users.Split(',');
                    foreach (string strUser in ar)
                    {
                        MVCModels.SplashUsersModel objSUsers = new SplashUsersModel();
                        List<MVCModels.HiDoctor_Master.UserModel> lstDistict = lstUser.AsEnumerable().Where(x => x.User_Code == strUser).ToList();
                        objSUsers.User_Id = Convert.ToInt32(lstDistict[0].User_Id);
                        objSUsers.Company_Code = objCurInfo.GetCompanyCode();
                        objSUsers.Splash_Screen_Id = splashId;
                        lstSplashUsers.Add(objSUsers);
                    }
                }
                int rowsAffected = 0;
                //if (mode == "A")
                //{
                //    List<MVCModels.HiDoctor_Master.UserModel> lstUsersMapped = new List<MVCModels.HiDoctor_Master.UserModel>();
                //    lstUsersMapped = _objBLSplashScreen.GetSplashMappedUsers(objCurInfo.GetCompanyCode(), splashId).ToList();
                //    List<MVCModels.SplashUsersModel> lst = lstSplashUsers.Where(s => !lstUsersMapped.Where(e => Convert.ToString(e.User_Id) == Convert.ToString(s.User_Id)).Any()).ToList();
                //    rowsAffected = _objBLSplashScreen.InsertSplashUsers(lst, splashId, objCurInfo.GetCompanyCode(), mode);
                //}
                //else
                //{
                rowsAffected = _objBLSplashScreen.InsertSplashUsers(lstSplashUsers, splashId, Splashtype, objCurInfo.GetCompanyCode(), mode);
                // }
                if (rowsAffected > 0)
                {
                    return "SUCCESS";
                }
                else
                {
                    return "ERROR";
                }
            }
            catch (Exception ex)
            {
                return "ERROR";
            }
        }

        public JsonResult GetselectedUserTypes(string divisionCodes, string UserTypeCodes)
        {
            try
            {
                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                string companyCode = string.Empty;
                string userCode = string.Empty;
                companyCode = objCurInfo.GetCompanyCode();
                userCode = objCurInfo.GetUserCode();
                List<MVCModels.HiDoctor_Master.UserTypeSplashModel> lstUsertype = new List<MVCModels.HiDoctor_Master.UserTypeSplashModel>();
                lstUsertype = _objBLSplashScreen.GetselectedUserTypes(companyCode, userCode, divisionCodes, UserTypeCodes).ToList();
                return Json(lstUsertype, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public JsonResult GetselectedGroupCodes(string GroupCodes)
        {
            try
            {
                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                string companyCode = string.Empty;
                companyCode = objCurInfo.GetCompanyCode();
                List<MVCModels.HiDoctor_Master.GroupDetails> lstGroupCode = new List<MVCModels.HiDoctor_Master.GroupDetails>();
                lstGroupCode = _objBLSplashScreen.GetselectedGroupCodes(companyCode,GroupCodes).ToList();
                return Json(lstGroupCode, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
