using DataControl.HiDoctor_ActivityFactoryClasses;
using MVCModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HiDoctor_Activity.Controllers
{
    public class CPDController : Controller
    {
        BL_CPD _objCpd = new BL_CPD();
        private DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();

        public ActionResult CPDMobile(string Lid)

        {
            string subDomainName, CompanyId, RegionCode, UserCode, UserName;
            Dictionary<string, string> param = ConvertParameter(Lid);
            param.TryGetValue("subDomainName", out subDomainName);
            param.TryGetValue("CompanyId", out CompanyId);
            param.TryGetValue("RegionCode", out RegionCode);
            param.TryGetValue("UserCode", out UserCode);
            param.TryGetValue("UserName", out UserName);
            ViewBag.subDomainName = subDomainName;
            ViewBag.CompanyId = CompanyId;
            ViewBag.LoginRegionCode = RegionCode;
            ViewBag.LoginUserCode = UserCode;
            //var today = DateTime.Today;
            //var month = new DateTime(today.Year, today.Month, 1);
            var today = System.DateTime.Now;
            var month = new DateTime(today.Year, today.Month, 1);
            var MinDate = month.AddMonths(-2);
            var MaxDate = today;
            ViewBag.today = today.ToString();
            ViewBag.MinDate = MinDate.ToString();
            ViewBag.MaxDate = MaxDate.ToString();
            ViewBag.LID = Lid;
            return View();
        }
        public Dictionary<string, string> ConvertParameter(string Lid)
        {
            try
            {
                Dictionary<string, string> dicparams = new Dictionary<string, string>();
                string parameters = System.Text.ASCIIEncoding.ASCII.GetString(System.Convert.FromBase64String(Lid));
                string[] param = parameters.Split('/');
                string[] key = { "subDomainName", "CompanyId", "RegionCode", "UserCode", "UserName" };
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
        public int GetUserStatus(string subDomainName, int CompanyId, string Usercode)
        {
            _objCpd.subDomainName = subDomainName;
            _objCpd.User_Code = Usercode;
            _objCpd.CompanyId = CompanyId;
            return _objCpd.GetUserStatus(subDomainName, CompanyId, Usercode);
        }
        public JsonResult GettodayDate(string subDomainName)
        {
            _objCpd.subDomainName = subDomainName;
            return Json(_objCpd.GettodayDate(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult fngetWeekEndAndHoliday(CPD.CPDData _obj)
        {
            _objCpd.Region_Code = _obj.Region_Code;
            _objCpd.User_Code = _obj.User_Code;
            _objCpd.subDomainName = _obj.subDomainName;
            _objCpd.StartDate = _obj.StartDate;
            _objCpd.EndDate = _obj.EndDate;
            return Json(_objCpd.fngetWeekEndAndHoliday(), JsonRequestBehavior.AllowGet);
        }
        #region Field
        public ActionResult CPDField(string CPD_Date, int CPD_Id, string Repnum,string Lid)
        {
            string subDomainName, CompanyId, RegionCode, UserCode, UserName;
            Dictionary<string, string> param = ConvertParameter(Lid);
            param.TryGetValue("subDomainName", out subDomainName);
            param.TryGetValue("CompanyId", out CompanyId);
            param.TryGetValue("RegionCode", out RegionCode);
            param.TryGetValue("UserCode", out UserCode);
            param.TryGetValue("UserName", out UserName);
            ViewBag.subDomainName = subDomainName;
            ViewBag.CompanyId = CompanyId;
            ViewBag.LoginRegionCode = RegionCode;
            ViewBag.LoginUserCode = UserCode;
            ViewBag.LoginUserName = UserName;
            ViewBag.Repnum = Repnum;
            ViewBag.CPD_Date = CPD_Date;
            ViewBag.CPD_Id = CPD_Id;
            ViewBag.LID = Lid;
            return View();
        }
        public JsonResult GetCPDFieldDraftDetails(CPD.CPDData _obj)
        {
            _objCpd.CPD_ID = _obj.CPD_ID;
            _objCpd.subDomainName = _obj.subDomainName;
            return Json(_objCpd.GetCPDFieldDraftDetails(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetAllMarketNames(string Region_Code, string subDomainName)
        {
            _objCpd.Region_Code = Region_Code;
            _objCpd.subDomainName = subDomainName;
            return Json(_objCpd.GetAllMarketNames(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetAllProductNames(string Region_Code, string subDomainName, string User_Code, string CPD_Date)
        {
            _objCpd.Region_Code = Region_Code;
            _objCpd.subDomainName = subDomainName;
            _objCpd.User_Code = User_Code;
            _objCpd.CPDDate = CPD_Date;
            return Json(_objCpd.GetAllProductNames(), JsonRequestBehavior.AllowGet);
        }
        public int InsertFieldDraft(CPD.CPDData _obj)
        {
            _objCpd.subDomainName = _obj.subDomainName;
            _objCpd.CompanyId = _obj.CompanyId;
            _objCpd.User_Code = _obj.User_Code;
            _objCpd.Region_Code = _obj.Region_Code;
            _objCpd.CPDDate = _obj.CPDDate;
            _objCpd.CPD_ID = _obj.CPD_ID;
            _objCpd.MarketName = _obj.MarketName;
            _objCpd.Activity = _obj.Activity;
            _objCpd.InTime = _obj.InTime;
            _objCpd.OutTime = _obj.OutTime;
            _objCpd.TotalCalls = _obj.TotalCalls;
            _objCpd.Productivecalls = _obj.Productivecalls;
            _objCpd.BrightCalls = _obj.BrightCalls;
            _objCpd.ShineCalls= _obj.ShineCalls;
            return _objCpd.InsertFieldDraft();
        }
        public int InsertFieldDetails(CPD.CPDData _obj)
        {
            _objCpd.subDomainName = _obj.subDomainName;
            _objCpd.CompanyId = _obj.CompanyId;
            _objCpd.Region_Code = _obj.Region_Code;
            _objCpd.User_Code = _obj.User_Code;
            _objCpd.CPDDate = _obj.CPDDate;
            _objCpd.CPD_ID = _obj.CPD_ID;
            _objCpd.MarketName = _obj.MarketName;
            _objCpd.Totaloutlets = _obj.Totaloutlets;
            _objCpd.Activity = _obj.Activity;
            _objCpd.TotalCalls = _obj.TotalCalls;
            _objCpd.Productivecalls = _obj.Productivecalls;
            _objCpd.BrightCalls = _obj.BrightCalls;
            _objCpd.ShineCalls = _obj.ShineCalls;
            _objCpd.ProdDetails = _obj.ProdDetails;
            _objCpd.Brightoutlet = _obj.Brightoutlet;
            _objCpd.Shineoutlet = _obj.Shineoutlet;
            _objCpd.GRemaks = _obj.GRemaks;
            _objCpd.OutTime = _obj.OutTime;
            _objCpd.CPDValue = _obj.CPDValue;
            return _objCpd.InsertFieldDetails();
        }
        #endregion

            #region Leave
        public ActionResult CPDLeave(string CPD_Date, int CPD_Id)
        {
            ViewBag.subDomainName = _objCurrentInfo.GetSubDomain();
            ViewBag.CompanyId = _objCurrentInfo.GetCompanyId();
            ViewBag.LoginRegionCode = _objCurrentInfo.GetRegionCode();
            ViewBag.LoginUserCode = _objCurrentInfo.GetUserCode();
            ViewBag.CPD_Date = CPD_Date;
            ViewBag.CPD_Id = CPD_Id;
            return View();
        }
        public JsonResult GetLeavetype(CPD.CPDData _obj)
        {
            _objCpd.User_Code = _obj.User_Code;
            _objCpd.subDomainName = _obj.subDomainName;
            return Json(_objCpd.GetLeavetype(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetLeaveValues(CPD.CPDData _obj)
        {
            _objCpd.subDomainName = _obj.subDomainName;
            _objCpd.CPD_ID = _obj.CPD_ID;
            return Json(_objCpd.GetLeaveValues(), JsonRequestBehavior.AllowGet);
        }
        public int InsertLeave(CPD.CPDData _obj)
        {
            _objCpd.subDomainName = _obj.subDomainName;
            _objCpd.CompanyId = _obj.CompanyId;
            _objCpd.User_Code = _obj.User_Code;
            _objCpd.Region_Code = _obj.Region_Code;
            _objCpd.CPDDate = _obj.CPDDate;
            _objCpd.CPD_ID = _obj.CPD_ID;
            _objCpd.Activity = _obj.Activity;
            _objCpd.LeaveCode = _obj.LeaveCode;
            _objCpd.CPDValue = _obj.CPDValue;
            _objCpd.Reason = _obj.Reason;
            return _objCpd.InsertLeave();
        }
        #endregion
        #region Attendance
        public ActionResult CPDAttendance(string CPD_Date, int CPD_Id, string Lid)
        {
            string subDomainName, CompanyId, RegionCode, UserCode, UserName;
            Dictionary<string, string> param = ConvertParameter(Lid);
            param.TryGetValue("subDomainName", out subDomainName);
            param.TryGetValue("CompanyId", out CompanyId);
            param.TryGetValue("RegionCode", out RegionCode);
            param.TryGetValue("UserCode", out UserCode);
            param.TryGetValue("UserName", out UserName);
            ViewBag.subDomainName = subDomainName;
            ViewBag.CompanyId = CompanyId;
            ViewBag.LoginRegionCode = RegionCode;
            ViewBag.LoginUserCode = UserCode;
            ViewBag.CPD_Date = CPD_Date;
            ViewBag.CPD_Id = CPD_Id;
            ViewBag.LID = Lid;
            return View();
        }
        public JsonResult GetAttendancetype(CPD.CPDData _obj)
        {
            _objCpd.User_Code = _obj.User_Code;
            _objCpd.subDomainName = _obj.subDomainName;
            _objCpd.CPDDate = _obj.CPDDate;
            return Json(_objCpd.GetAttendancetype(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetCPDAttDraftDetails(CPD.CPDData _obj)
        {
            _objCpd.CPD_ID = _obj.CPD_ID;
            _objCpd.subDomainName = _obj.subDomainName;
            return Json(_objCpd.GetCPDAttDraftDetails(), JsonRequestBehavior.AllowGet);
        }
        public int GetCPDPunchTime(CPD.CPDData _obj)
        {
            _objCpd.subDomainName = _obj.subDomainName;
            _objCpd.CompanyId = _obj.CompanyId;
            _objCpd.User_Code = _obj.User_Code;
            _objCpd.Region_Code = _obj.Region_Code;
            _objCpd.CPDDate = _obj.CPDDate;
            _objCpd.CPD_ID = _obj.CPD_ID;
            _objCpd.Activity = _obj.Activity;
            _objCpd.MarketName = _obj.MarketName;
            _objCpd.TotalCalls = _obj.TotalCalls;
            _objCpd.Productivecalls = _obj.Productivecalls;
            _objCpd.BrightCalls = _obj.BrightCalls;
            _objCpd.ShineCalls = _obj.ShineCalls;
            _objCpd.GRemaks = _obj.GRemaks;
            _objCpd.InTime = _obj.InTime;
            _objCpd.OutTime = _obj.OutTime;
            return _objCpd.GetCPDPunchTime();
        }
        public int InsertAttendance(CPD.CPDData _obj)
        {
            _objCpd.User_Code = _obj.User_Code;
            _objCpd.Region_Code = _obj.Region_Code;
            _objCpd.subDomainName = _obj.subDomainName;
            _objCpd.CompanyId = _obj.CompanyId;
            _objCpd.CPDDate = _obj.CPDDate;
            _objCpd.CPD_ID = _obj.CPD_ID;
            _objCpd.Attendance = _obj.Attendance;
            _objCpd.CPDValue = _obj.CPDValue;
            _objCpd.GRemaks = _obj.GRemaks;
            _objCpd.Activity = _obj.Activity;
            _objCpd.OutTime = _obj.OutTime;
            return _objCpd.InsertAttendance();
        }
        #endregion
        #region Report
        public ActionResult CPDReports(string Lid)
        {
            string subDomainName, CompanyId, RegionCode, UserCode, UserName;
            Dictionary<string, string> param = ConvertParameter(Lid);
            param.TryGetValue("subDomainName", out subDomainName);
            param.TryGetValue("CompanyId", out CompanyId);
            param.TryGetValue("RegionCode", out RegionCode);
            param.TryGetValue("UserCode", out UserCode);
            param.TryGetValue("UserName", out UserName);
            ViewBag.subDomainName = subDomainName;
            ViewBag.CompanyId = CompanyId;
            ViewBag.LoginRegionCode = RegionCode;
            ViewBag.LoginUserCode = UserCode;
            ViewBag.LoginUserName = UserName;
            ViewBag.LID = Lid;
            return View();
        }
        public JsonResult GetUserDetails(string subDomainName, int CompanyId, string UserCode)
        {
            _objCpd.User_Code = UserCode;
            _objCpd.subDomainName = subDomainName;
            _objCpd.CompanyId = CompanyId;
            return Json(_objCpd.GetUserDetails(), JsonRequestBehavior.AllowGet);
        }
        public ActionResult CPDDates(string User_Code, string SelUserName, int UsrCount, string LID)
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
            ViewBag.UserName = SelUserName;
            ViewBag.LoggedUser_Code = UserCode;
            ViewBag.usercount = UsrCount;
            ViewBag.LID = LID;
            return View();
        }
        public JsonResult GetUserCpdDates(string subDomainName, int CompanyId, string UserCode, string FDate, string TDate)
        {
            _objCpd.User_Code = UserCode;
            _objCpd.subDomainName = subDomainName;
            _objCpd.CompanyId = CompanyId;
            _objCpd.FDate = FDate;
            _objCpd.TDate = TDate;
            return Json(_objCpd.GetUserCpdDates(), JsonRequestBehavior.AllowGet);
        }
        public ActionResult CPDDetails(string User_Code, int CPD_Id, string User_Name, int usrcnt, string LID)
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
            ViewBag.CPD_Id = CPD_Id;
            ViewBag.SelUserCode = User_Code;
            ViewBag.SelUserName = User_Name;
            ViewBag.LoginUserCode = UserCode;
            ViewBag.usrcnt = usrcnt;
            ViewBag.Lid = LID;
            return View();
        }
        public JsonResult GetUserCPDDetails(string subDomainName, int CompanyId, int CPD_Id)
        {
            _objCpd.subDomainName = subDomainName;
            _objCpd.CompanyId = CompanyId;
            _objCpd.CPD_ID = CPD_Id;
            return Json(_objCpd.GetUserCPDDetails(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetChildcount(string subDomainName, string User_Code)
        {
            _objCpd.subDomainName = subDomainName;
            _objCpd.User_Code = User_Code;
            return Json(_objCpd.GetChildcount(), JsonRequestBehavior.AllowGet);
        }
        #endregion
        public ActionResult CPDDeleteReports(string Lid)
        {
            string subDomainName, CompanyId, RegionCode, UserCode, UserName;
            Dictionary<string, string> param = ConvertParameter(Lid);
            param.TryGetValue("subDomainName", out subDomainName);
            param.TryGetValue("CompanyId", out CompanyId);
            param.TryGetValue("RegionCode", out RegionCode);
            param.TryGetValue("UserCode", out UserCode);
            param.TryGetValue("UserName", out UserName);
            ViewBag.subDomainName = subDomainName;
            ViewBag.CompanyId = CompanyId;
            ViewBag.LoginRegionCode = RegionCode;
            ViewBag.LoginUserCode = UserCode;
            ViewBag.LoginUserName = UserName;
            ViewBag.LID = Lid;
            return View();
        }
        public ActionResult CPDDelDates(string User_Code, string User_Name, int usercount, string LID)
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
        public int DeleteCPDRecord(string subDomainName, int CompanyId, string Type, int CPD_Id)
        {
            _objCpd.subDomainName = subDomainName;
            _objCpd.CompanyId = CompanyId;
            _objCpd.Type = Type;
            _objCpd.CPD_ID = CPD_Id;
            return _objCpd.DeleteCPDRecord();
        }
        public int InsertDefaultLeave(string subDomainName, int CompanyId, string MinDate, string MaxDate, string Regioncode, string UserCode)
        {
            _objCpd.subDomainName = subDomainName;
            _objCpd.CompanyId = CompanyId;
            _objCpd.MinDate = MinDate;
            _objCpd.MaxDate = MaxDate;
            _objCpd.User_Code = UserCode;
            _objCpd.Region_Code = Regioncode;
            return _objCpd.InsertDefaultLeave();
        }
        public ActionResult CPDDashboard(string Fromdate, string Todate, string Lid) 
        {
            string subDomainName, CompanyId, RegionCode, UserCode, UserName;
            Dictionary<string, string> param = ConvertParameter(Lid);
            param.TryGetValue("subDomainName", out subDomainName);
            param.TryGetValue("CompanyId", out CompanyId);
            param.TryGetValue("RegionCode", out RegionCode);
            param.TryGetValue("UserCode", out UserCode);
            param.TryGetValue("UserName", out UserName);
            ViewBag.subDomainName = subDomainName;
            ViewBag.CompanyId = CompanyId;
            ViewBag.LoginRegionCode = RegionCode;
            ViewBag.LoginUserCode = UserCode;
            ViewBag.LoginUserName = UserName;
            ViewBag.Fromdate = Fromdate;
            ViewBag.Todate = Todate;
            ViewBag.LID = Lid;
            return View();
        }
        public JsonResult GetCPDData(string subDomainName, int CompanyId, string LoggedUserCode, string FromDate, string Todate)
        {
            _objCpd.subDomainName = subDomainName;
            _objCpd.CompanyId = CompanyId;
            _objCpd.FromDate = FromDate;
            _objCpd.Todate = Todate;
            _objCpd.User_Code = LoggedUserCode;
            return Json(_objCpd.GetCPDData(), JsonRequestBehavior.AllowGet);
        }
        public ActionResult CPDProducts(string FromDate, string Todate, string Lid)
        {
            string subDomainName, CompanyId, RegionCode, UserCode, UserName;
            Dictionary<string, string> param = ConvertParameter(Lid);
            param.TryGetValue("subDomainName", out subDomainName);
            param.TryGetValue("CompanyId", out CompanyId);
            param.TryGetValue("RegionCode", out RegionCode);
            param.TryGetValue("UserCode", out UserCode);
            param.TryGetValue("UserName", out UserName);
            ViewBag.subDomainName = subDomainName;
            ViewBag.CompanyId = CompanyId;
            ViewBag.LoginRegionCode = RegionCode;
            ViewBag.LoginUserCode = UserCode;
            ViewBag.LoginUserName = UserName;
            ViewBag.FromDate = FromDate;
            ViewBag.Todate = Todate;
            ViewBag.LID = Lid;
            return View();
        }
         public JsonResult GetProductDetails(int CompanyId, string Region_Code, string subDomainName, string User_Code, string FromDate, string Todate)
        {
            _objCpd.CompanyId = CompanyId;
            _objCpd.Region_Code = Region_Code;
            _objCpd.subDomainName = subDomainName;
            _objCpd.User_Code = User_Code;
            _objCpd.FDate = FromDate;
            _objCpd.TDate = Todate;
            return Json(_objCpd.GetProductDetails(), JsonRequestBehavior.AllowGet);
        }
         public JsonResult GetProductwiseDetails(int CompanyId, string Region_Code, string subDomainName, string User_Code, string FromDate, string Todate)
        {
            _objCpd.CompanyId = CompanyId;
            _objCpd.Region_Code = Region_Code;
            _objCpd.subDomainName = subDomainName;
            _objCpd.User_Code = User_Code;
            _objCpd.FDate = FromDate;
            _objCpd.TDate = Todate;
            return Json(_objCpd.GetProductwiseDetails(), JsonRequestBehavior.AllowGet);
        }
    }
}
