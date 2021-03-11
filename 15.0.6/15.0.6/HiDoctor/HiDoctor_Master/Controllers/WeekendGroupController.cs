using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ElmahWrapper;
using DataControl;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class WeekendGroupController : Controller
    {
        #region Private Variables
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        #endregion Private Variables


        public ActionResult Index()
        {
            ViewBag.LoginUserCode = _objcurrentInfo.GetUserCode();
            ViewBag.todayDate = DateTime.Now.ToString("yyyy/MM/dd");
            List<MVCModels.HiDoctor_Master.WeekendGroupModel> lstHolidayMethod = WeekendOffHolidayMethods(_objcurrentInfo.GetCompanyCode());
            ViewBag.holidayMethod = lstHolidayMethod.ToArray();
            return View();
        }
        public ActionResult WeekendEdit()
        {
            ViewBag.todayDate = DateTime.Now.ToString("yyyy/MM/dd");
            ViewBag.LoginUserCode = _objcurrentInfo.GetUserCode();
            List<MVCModels.HiDoctor_Master.WeekendGroupModel> lstHolidayMethod = WeekendOffHolidayMethods(_objcurrentInfo.GetCompanyCode());
            ViewBag.holidayMethod = lstHolidayMethod.ToArray();
            return View();

            return View();
        }

        public ActionResult WeekendGroupDefinerReport()
        {
            return View();
        }


        private List<MVCModels.HiDoctor_Master.WeekendGroupModel> WeekendOffHolidayMethods(string companyCode)
        {
            BLRegion objWeekend = new BLRegion();
            return objWeekend.WeekendOffHolidayMethods(companyCode);
        }

        // Inert or update Sales order(applied or drafted status)
        public string InsertWeekendGroup(string weekendGroupName, string selectedDays, string holidayMethodDetails)
        {
            BLRegion objWeekend = new BLRegion();
            return objWeekend.InsertWeekendGroup(_objcurrentInfo.GetCompanyCode(), weekendGroupName, selectedDays, holidayMethodDetails);
        }

        // get all defined weekend groups
        public JsonResult GetAllWeekendGroups()
        {
            BLRegion objWeekend = new BLRegion();
            List<MVCModels.HiDoctor_Master.WeekendGroupModel> lstWeek = new List<MVCModels.HiDoctor_Master.WeekendGroupModel>();
            lstWeek = objWeekend.GetAllWeekendGroups(_objcurrentInfo.GetCompanyCode());
            return Json(lstWeek, JsonRequestBehavior.AllowGet);
        }

        // get weekend group definr report
        public JsonResult GetWeekendGroupDefinerReport(FormCollection coll)
        {
            BLRegion objWeekend = new BLRegion();
            List<MVCModels.HiDoctor_Master.WeekendGroupModel> lstWeek = new List<MVCModels.HiDoctor_Master.WeekendGroupModel>();
            lstWeek = objWeekend.GetWeekendGroupDefinerReport(_objcurrentInfo.GetCompanyCode(), Convert.ToInt32(coll["weekEndGroupCode"]));
            return Json(lstWeek, JsonRequestBehavior.AllowGet);
        }
        // get delete week end  group
      
        public int DeleteWeekend(int Year, string Date,string User_Code)
        {
            BLRegion objWeekend = new BLRegion();
            return objWeekend.DeleteWeekend(_objcurrentInfo.GetCompanyCode(), Year, Date, User_Code);
        }

        //public JsonResult ManualInsertWeekEnd(string weekEndGroupCode, string Date)
        //{
        //    BLRegion objWeekend = new BLRegion();
        //    return objWeekend.ManualInsertWeekEnd(_objcurrentInfo.GetCompanyCode(), weekEndGroupCode, Date);
        //}
        public int ManualInsertWeekEnd(string weekEndGroupCode, string Date)
        {
            BLRegion objWeekend = new BLRegion();
            return objWeekend.ManualInsertWeekEnd(_objcurrentInfo.GetCompanyCode(), weekEndGroupCode, Date);
        }
        //public JsonResult ManualInsertWeekEnd(string weekEndGroupCode, string Date)
        //{
        //    BLRegion objWeekend = new BLRegion();
        //    List<MVCModels.HiDoctor_Master.WeekendGroupModel> lstWeek = new List<MVCModels.HiDoctor_Master.WeekendGroupModel>();
        //    lstWeek = objWeekend.ManualInsertWeekEnd(_objcurrentInfo.GetCompanyCode(), weekEndGroupCode, Date);
        //    return Json(lstWeek, JsonRequestBehavior.AllowGet);
        //}
    }
}
