using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MVCModels;
using DataControl.HiDoctor_ActivityFactoryClasses;
using System.IO;
using DataControl.Repository;
using DataControl;

namespace HiDoctor_Activity.Controllers
{
    public class MTOController : Controller
    {
        //
        // GET: /MTO/
        BL_MTO _objMto = new BL_MTO();
        private DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
        public ActionResult MTOMobile(string Lid)
        {
            string subDomainName, CompanyId, RegionCode, UserCode;
            Dictionary<string, string> param = ConvertParameter(Lid);
            param.TryGetValue("subDomainName", out subDomainName);
            param.TryGetValue("CompanyId", out CompanyId);
            param.TryGetValue("RegionCode", out RegionCode);
            param.TryGetValue("UserCode", out UserCode);

            ViewBag.subDomainName = subDomainName;
            ViewBag.CompanyId = CompanyId;
            ViewBag.LoginRegionCode = RegionCode;
            ViewBag.LoginUserCode = UserCode;
            var today = DateTime.Today;
            var month = new DateTime(today.Year, today.Month, 1);
            var MinDate = month.AddMonths(-2);
            var MaxDate = today;
            ViewBag.MinDate = MinDate.ToString();
            ViewBag.MaxDate = MaxDate.ToString();
            ViewBag.LID = Lid;
            //ViewBag.MTO_Date = MTO_Date;
            return View();
        }
        public Dictionary<string, string> ConvertParameter(string Lid)
        {
            try
            {
                Dictionary<string, string> dicparams = new Dictionary<string, string>();
                string parameters = System.Text.ASCIIEncoding.ASCII.GetString(System.Convert.FromBase64String(Lid));
                string[] param = parameters.Split('/');
                string[] key = { "subDomainName", "CompanyId", "RegionCode", "UserCode" };
                if (param.Length > 1)
                {
                    for (int index = 0; index < param.Length; index++)
                    {
                        dicparams.Add(key[index], param[index]);
                    }
                }

                return dicparams;
            }
            catch
            {
                throw;
            }

        }
        public JsonResult GettodayDate(string subDomainName)
        {
            _objMto.subDomainName = subDomainName;
            return Json(_objMto.GettodayDate(), JsonRequestBehavior.AllowGet);
        }
        public int GetUserStatus(string subDomainName, int CompanyId, string Usercode)
        {
            _objMto.subDomainName = subDomainName;
            _objMto.User_Code = Usercode;
            _objMto.CompanyId = CompanyId;
            return _objMto.GetUserStatus(subDomainName, CompanyId, Usercode);
        }
        public JsonResult fngetWeekEndAndHoliday(MTO.MTOData _objData)
        {
            _objMto.Region_Code = _objData.Region_Code;
            _objMto.User_Code = _objData.User_Code;
            _objMto.subDomainName = _objData.subDomainName;
            _objMto.StartDate = _objData.StartDate;
            _objMto.EndDate = _objData.EndDate;
            return Json(_objMto.fngetWeekEndAndHoliday(), JsonRequestBehavior.AllowGet);
        }
        #region Leave
        public ActionResult MTOLeave(string MTO_Date, int MTO_ID, string LID)
        {
            string subDomainName, CompanyId, RegionCode, UserCode;
            Dictionary<string, string> param = ConvertParameter(LID);
            param.TryGetValue("subDomainName", out subDomainName);
            param.TryGetValue("CompanyId", out CompanyId);
            param.TryGetValue("RegionCode", out RegionCode);
            param.TryGetValue("UserCode", out UserCode);
            ViewBag.subDomainName = subDomainName;
            ViewBag.CompanyId = CompanyId;
            ViewBag.LoginRegionCode = RegionCode;
            ViewBag.LoginUserCode = UserCode;
            ViewBag.MTO_Date = MTO_Date;
            ViewBag.MTO_ID = MTO_ID;
            ViewBag.LID = LID;
            return View();
        }

        public JsonResult GetLeavetype(MTO.MTOData _objData)
        {
            _objMto.User_Code = _objData.User_Code;
            _objMto.subDomainName = _objData.subDomainName;
            return Json(_objMto.GetLeavetype(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetLeaveValues(MTO.MTOData _objData)
        {
            //_objMto.User_Code = _objData.User_Code;
            _objMto.subDomainName = _objData.subDomainName;
            _objMto.MTO_ID = _objData.MTO_ID;
            return Json(_objMto.GetLeaveValues(), JsonRequestBehavior.AllowGet);
        }
        public int GetInsetLeave(MTO.MTOData _obj)
        {
            _objMto.User_Code = _obj.User_Code;
            _objMto.Region_Code = _obj.Region_Code;
            _objMto.subDomainName = _obj.subDomainName;
            _objMto.MTODate = _obj.MTODate;
            _objMto.MTO_ID = _obj.MTO_ID;
            _objMto.LeaveCode = _obj.LeaveCode;
            _objMto.MTOValue = _obj.MTOValue;
            _objMto.Reason = _obj.Reason;
            return _objMto.GetInsetLeave();
        }
        #endregion
        #region Attendance
        public ActionResult MTOAttendance(string MTO_Date, int MTO_ID, string LID)
        {
            string subDomainName, CompanyId, RegionCode, UserCode;
            Dictionary<string, string> param = ConvertParameter(LID);
            param.TryGetValue("subDomainName", out subDomainName);
            param.TryGetValue("CompanyId", out CompanyId);
            param.TryGetValue("RegionCode", out RegionCode);
            param.TryGetValue("UserCode", out UserCode);
            ViewBag.subDomainName = subDomainName;
            ViewBag.CompanyId = CompanyId;
            ViewBag.LoginRegionCode = RegionCode;
            ViewBag.LoginUserCode = UserCode;
            ViewBag.MTO_Date = MTO_Date;
            ViewBag.MTO_ID = MTO_ID;
            ViewBag.LID = LID;
            return View();
        }
        public JsonResult GetAttendancetype(MTO.MTOData _objData)
        {
            _objMto.User_Code = _objData.User_Code;
            _objMto.subDomainName = _objData.subDomainName;
            _objMto.MTODate = _objData.MTODate;
            return Json(_objMto.GetAttendancetype(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetMTOAttDraftDetails(MTO.MTOData _objData)
        {
            _objMto.MTO_ID = _objData.MTO_ID;
            _objMto.subDomainName = _objData.subDomainName;
            return Json(_objMto.GetMTOAttDraftDetails(), JsonRequestBehavior.AllowGet);
        }
        public int GetInsetAttendance(MTO.MTOData _obj)
        {
            _objMto.User_Code = _obj.User_Code;
            _objMto.Region_Code = _obj.Region_Code;
            _objMto.subDomainName = _obj.subDomainName;
            _objMto.MTODate = _obj.MTODate;
            _objMto.MTO_ID = _obj.MTO_ID;
            _objMto.Attendance = _obj.Attendance;
            _objMto.MTOValue = _obj.MTOValue;
            _objMto.GRemaks = _obj.GRemaks;
            _objMto.OutTime = _obj.OutTime;
            _objMto.Latitude = _obj.Latitude;
            _objMto.Longitude = _obj.Longitude;
            return _objMto.GetInsetAttendance();
        }
        #endregion
        #region Field
        public ActionResult MTOField(string MTO_Date, int MTO_ID, string LID)
        {
            string subDomainName, CompanyId, RegionCode, UserCode;
            Dictionary<string, string> param = ConvertParameter(LID);
            param.TryGetValue("subDomainName", out subDomainName);
            param.TryGetValue("CompanyId", out CompanyId);
            param.TryGetValue("RegionCode", out RegionCode);
            param.TryGetValue("UserCode", out UserCode);
            ViewBag.subDomainName = subDomainName;
            ViewBag.CompanyId = CompanyId;
            ViewBag.LoginRegionCode = RegionCode;
            ViewBag.LoginUserCode = UserCode;
            ViewBag.MTO_Date = MTO_Date;
            ViewBag.MTO_ID = MTO_ID;
            ViewBag.LID = LID;
            return View();
        }
        public JsonResult GetAllProductName(string Region_Code, string subDomainName,string User_Code)
        {
            _objMto.Region_Code = Region_Code;
            _objMto.subDomainName = subDomainName;
            _objMto.User_Code = User_Code;
            return Json(_objMto.GetAllProductName(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetAccompanistDetails(string User_Code, string Region_Code, string subDomainName)
        {
            _objMto.User_Code = User_Code;
            _objMto.Region_Code = Region_Code;
            _objMto.subDomainName = subDomainName;
            return Json(_objMto.GetAccompanistDetails(), JsonRequestBehavior.AllowGet);
        }
        public int GetInsetField(MTO.MTOData _obj)
        {
            _objMto.User_Code = _obj.User_Code;
            _objMto.Region_Code = _obj.Region_Code;
            _objMto.subDomainName = _obj.subDomainName;
            _objMto.MTODate = _obj.MTODate;
            _objMto.MTO_ID = _obj.MTO_ID;
            _objMto.StoreName = _obj.StoreName;
            _objMto.Accompanist = _obj.Accompanist;
            _objMto.ProductSale = _obj.ProductSale;
            _objMto.ProductSample = _obj.ProductSample;
            _objMto.CustomerDetails = _obj.CustomerDetails;
            _objMto.GRemaks = _obj.GRemaks;
            _objMto.MTOValue = _obj.MTOValue;
            _objMto.OutTime = _obj.OutTime;
            _objMto.Latitude = _obj.Latitude;
            _objMto.Longitude = _obj.Longitude;
            return _objMto.GetInsetField();
        }
        public int GetMTOPunchTime(MTO.MTOData _obj)
        {
            _objMto.User_Code = _obj.User_Code;
            _objMto.Region_Code = _obj.Region_Code;
            _objMto.subDomainName = _obj.subDomainName;
            _objMto.MTODate = _obj.MTODate;
            _objMto.MTO_ID = _obj.MTO_ID;
            _objMto.StoreName = _obj.StoreName;
            _objMto.Activity = _obj.Activity;
            _objMto.InTime = _obj.InTime;
            _objMto.OutTime = _obj.OutTime;
            _objMto.Latitude = _obj.Latitude;
            _objMto.Longitude = _obj.Longitude;
            return _objMto.GetMTOPunchTime();
        }
        public JsonResult GetMTOFieldDraftDetails(MTO.MTOData _objData)
        {
            _objMto.MTO_ID = _objData.MTO_ID;
            _objMto.subDomainName = _objData.subDomainName;
            return Json(_objMto.GetMTOFieldDraftDetails(), JsonRequestBehavior.AllowGet);
        }
        #endregion
        #region Report
        public ActionResult MTOReports(string Lid)
        {
            string subDomainName, CompanyId, RegionCode, UserCode;
            Dictionary<string, string> param = ConvertParameter(Lid);
            param.TryGetValue("subDomainName", out subDomainName);
            param.TryGetValue("CompanyId", out CompanyId);
            param.TryGetValue("RegionCode", out RegionCode);
            param.TryGetValue("UserCode", out UserCode);
            ViewBag.subDomainName = subDomainName;
            ViewBag.CompanyId = CompanyId;
            ViewBag.LoginRegionCode = RegionCode;
            ViewBag.LoginUserCode = UserCode;
            ViewBag.LID = Lid;
            return View();
        }
        public JsonResult GetUserDetails(string subDomainName, string UserCode)
        {
            _objMto.User_Code = UserCode;
            _objMto.subDomainName = subDomainName;
            return Json(_objMto.GetUserDetails(), JsonRequestBehavior.AllowGet);
        }

        public ActionResult MTODates(string User_Code,string LID, string UserName)
        {
            string subDomainName, CompanyId, RegionCode, UserCode;
            Dictionary<string, string> param = ConvertParameter(LID);
            param.TryGetValue("subDomainName", out subDomainName);
            param.TryGetValue("CompanyId", out CompanyId);
            param.TryGetValue("RegionCode", out RegionCode);
            param.TryGetValue("UserCode", out UserCode);
            ViewBag.subDomainName = subDomainName;
            ViewBag.CompanyId = CompanyId;
            ViewBag.User_Code = User_Code;
            ViewBag.UserName = UserName;
            ViewBag.LoggedUser_Code = UserCode;
            ViewBag.LID = LID;
            return View();
        }
        public JsonResult GetUserMtoDates(string subDomainName, string UserCode)
        {
            _objMto.User_Code = UserCode;
            _objMto.subDomainName = subDomainName;
            return Json(_objMto.GetUserMtoDates(), JsonRequestBehavior.AllowGet);
        }
        public ActionResult MTODetails(string User_Code, int MTO_Id, string UserName, string LID)
        {
            string subDomainName, CompanyId, RegionCode, UserCode;
            Dictionary<string, string> param = ConvertParameter(LID);
            param.TryGetValue("subDomainName", out subDomainName);
            param.TryGetValue("CompanyId", out CompanyId);
            param.TryGetValue("RegionCode", out RegionCode);
            param.TryGetValue("UserCode", out UserCode);
            ViewBag.subDomainName = subDomainName;
            ViewBag.CompanyId = CompanyId;
            ViewBag.MTO_Id = MTO_Id;
            ViewBag.LID = LID;
            ViewBag.LoginUserCode = UserCode;
            ViewBag.SelUserCode = User_Code;
            ViewBag.SelUserName = UserName;
            return View();
        }
        public JsonResult GetUserMtoDetails(string subDomainName, int MTO_ID)
        {
            _objMto.subDomainName = subDomainName;
            _objMto.MTO_ID = MTO_ID;
            return Json(_objMto.GetUserMtoDetails(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetChildcount(string subDomainName, string User_Code)
        {
            _objMto.subDomainName = subDomainName;
            _objMto.User_Code = User_Code;
            return Json(_objMto.GetChildcount(), JsonRequestBehavior.AllowGet);
        }
        public ActionResult MTODeleteReports(string Lid)
        {
            string subDomainName, CompanyId, RegionCode, UserCode;
            Dictionary<string, string> param = ConvertParameter(Lid);
            param.TryGetValue("subDomainName", out subDomainName);
            param.TryGetValue("CompanyId", out CompanyId);
            param.TryGetValue("RegionCode", out RegionCode);
            param.TryGetValue("UserCode", out UserCode);
            ViewBag.subDomainName = subDomainName;
            ViewBag.CompanyId = CompanyId;
            ViewBag.LoginRegionCode = RegionCode;
            ViewBag.LoginUserCode = UserCode;
            ViewBag.LID = Lid;
            return View();
        }
        public JsonResult GetDelUserDetails(string subDomainName, string UserCode)
        {
            _objMto.User_Code = UserCode;
            _objMto.subDomainName = subDomainName;
            return Json(_objMto.GetDelUserDetails(), JsonRequestBehavior.AllowGet);
        }
        public ActionResult MTODelDates(string User_Code, string User_Name, int usercount, string LID)
        {
            string subDomainName, CompanyId, RegionCode, UserCode, UserName;
            Dictionary<string, string> param = ConvertParameter(LID);
            param.TryGetValue("subDomainName", out subDomainName);
            param.TryGetValue("CompanyId", out CompanyId);
            param.TryGetValue("RegionCode", out RegionCode);
            param.TryGetValue("UserCode", out UserCode);
            param.TryGetValue("UserName", out UserName);
            ViewBag.subDomainName = subDomainName;
            ViewBag.CompanyId = CompanyId;
            ViewBag.User_Code = User_Code;
            ViewBag.UserName = User_Name;
            ViewBag.LoggedUser_Code = UserCode;
            ViewBag.usercount = usercount;
            ViewBag.LID = LID;
            return View();
        }
        public int DeleteMTORecord(string subDomainName, string Usercode, int Type, int MTO_Id)
        {
            _objMto.subDomainName = subDomainName;
            _objMto.User_Code = Usercode;
            _objMto.Type = Type;
            _objMto.MTO_ID = MTO_Id;
            return _objMto.DeleteMTORecord();
        }
        public JsonResult GetDelUserMTODates(string subDomainName, string UserCode, string FDate, string TDate)
        {
            _objMto.User_Code = UserCode;
            _objMto.subDomainName = subDomainName;
            _objMto.FDate = FDate;
            _objMto.TDate = TDate;
            return Json(_objMto.GetDelUserMTODates(), JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult UploadFieldAttachment()
        {
            // Checking no of files injected in Request object  
            AzureBlobUpload objblob = new AzureBlobUpload();            
          
            DataControl.Abstraction.IFileProvider objPathProv = new DataControl.Impl.FileSystemProvider();
            string accKey = objPathProv.GetConfigValue("UPLOADEDFILEBLOBACCKEY");
            List<string> lst = new List<string>();
            if (Request.Files.Count > 0)
            {
                try
                {
                    //  Get all files from Request object  
                    HttpFileCollectionBase files = Request.Files;
                    string containerName = "MTOAttachment";
                    for (int i = 0; i < files.Count; i++)
                    {
                        HttpPostedFileBase file = files[i];
                        string blobUrl = objblob.PutAzureBlobStorage(file.InputStream, file.FileName, accKey, containerName);
                        lst.Add(blobUrl);
                        lst.Add(file.FileName);
                    } 
                }
                catch (Exception)
                {
                    string blobUrl = "Failed";
                    lst.Add(blobUrl);
                }
            }
            return Json(lst, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetCompanyCode(string subDomainName, int CompanyId)
        {
            _objMto.subDomainName = subDomainName;
            _objMto.CompanyId = CompanyId;
            return Json(_objMto.GetCompanyCode(), JsonRequestBehavior.AllowGet);
        }
        public int InsertFileDetails(string subDomainName, string LoginUserCode, int MTOId, string Filename, string FilePath)
        {
            _objMto.subDomainName = subDomainName;
            _objMto.User_Code = LoginUserCode;
            _objMto.MTO_ID = MTOId;
            _objMto.File_Name = Filename;
            _objMto.File_Path = FilePath;
            return _objMto.InsertFileDetails();
        }
        public JsonResult GetMtoAttachment(string subDomainName, int MTO_ID)
        {
            _objMto.subDomainName = subDomainName;
            _objMto.MTO_ID = MTO_ID;
            return Json(_objMto.GetMtoAttachment(), JsonRequestBehavior.AllowGet);
        }
        public ActionResult MTOErrorPage()
        {
            return View();
        }
        public ActionResult MTOTrackingReport(string Lid)
        {
            string subDomainName, CompanyId, RegionCode, UserCode;
            Dictionary<string, string> param = ConvertParameter(Lid);
            param.TryGetValue("subDomainName", out subDomainName);
            param.TryGetValue("CompanyId", out CompanyId);
            param.TryGetValue("RegionCode", out RegionCode);
            param.TryGetValue("UserCode", out UserCode);
            ViewBag.subDomainName = subDomainName;
            ViewBag.CompanyId = CompanyId;
            ViewBag.LoginRegionCode = RegionCode;
            ViewBag.LoginUserCode = UserCode;
            ViewBag.LID = Lid;
            return View();
        }
        public JsonResult GetUserTrackDetails(string subDomainName, string UserCode)
        {
            _objMto.User_Code = UserCode;
            _objMto.subDomainName = subDomainName;
            return Json(_objMto.GetUserTrackDetails(), JsonRequestBehavior.AllowGet);
        }
        public ActionResult MTOTracking(string User_Code, string UserName, string LID)
        {
            string subDomainName, CompanyId, RegionCode, UserCode;
            Dictionary<string, string> param = ConvertParameter(LID);
            param.TryGetValue("subDomainName", out subDomainName);
            param.TryGetValue("CompanyId", out CompanyId);
            param.TryGetValue("RegionCode", out RegionCode);
            param.TryGetValue("UserCode", out UserCode);
            ViewBag.subDomainName = subDomainName;
            ViewBag.CompanyId = CompanyId;
            ViewBag.SelUserCode = User_Code;
            ViewBag.SelUserName = UserName;
            ViewBag.LoggedUserCode = UserCode;
            ViewBag.LID = LID;
            return View();
        }
        public JsonResult GetUserLatLong(string subDomainName, string UserCode, string From)
        {
            _objMto.User_Code = UserCode;
            _objMto.subDomainName = subDomainName;
            _objMto.FDate = From;
            return Json(_objMto.GetUserLatLong(), JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}
