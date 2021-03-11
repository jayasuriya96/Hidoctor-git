using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MVCModels;

namespace DataControl.HiDoctor_ActivityFactoryClasses
{
    public class BL_CPD: CPD.CPDData
    {
        DAL_CPD _objDALCPD = new DAL_CPD();
        public int GetUserStatus(string subDomainName, int CompanyId, string Usercode)
        {
            _objDALCPD._CPD.subDomainName = subDomainName;
            _objDALCPD._CPD.User_Code = Usercode;
            _objDALCPD._CPD.CompanyId = CompanyId;
            return _objDALCPD.GetUserStatus(subDomainName, CompanyId, Usercode);
        }
        public List<CPD.TdDate> GettodayDate()
        {
            _objDALCPD._CPD.subDomainName = subDomainName;
            return _objDALCPD.GettodayDate();
        }
        public CPD.LeaveDays fngetWeekEndAndHoliday()
        {
            _objDALCPD._CPD.Region_Code = Region_Code;
            _objDALCPD._CPD.User_Code = User_Code;
            _objDALCPD._CPD.subDomainName = subDomainName;
            _objDALCPD._CPD.StartDate = StartDate;
            _objDALCPD._CPD.EndDate = EndDate;
            return _objDALCPD.fngetWeekEndAndHoliday();
        }
        public CPD.FieldDraft GetCPDFieldDraftDetails()
          {
            _objDALCPD._CPD.CPD_ID = CPD_ID;
            _objDALCPD._CPD.subDomainName = subDomainName;
            return _objDALCPD.GetCPDFieldDraftDetails();

        }
        public List<CPD.MarketName> GetAllMarketNames()
        {
            _objDALCPD._CPD.Region_Code = Region_Code;
            _objDALCPD._CPD.subDomainName = subDomainName;
            return _objDALCPD.GetAllMarketNames();
        }
        public List<CPD.ProductName> GetAllProductNames()
        {
            _objDALCPD._CPD.Region_Code = Region_Code;
            _objDALCPD._CPD.subDomainName = subDomainName;
            _objDALCPD._CPD.User_Code = User_Code;
            _objDALCPD._CPD.CPDDate = CPDDate;
            return _objDALCPD.GetAllProductNames();
        }
        public int InsertFieldDraft()
        {
            _objDALCPD._CPD.subDomainName = subDomainName;
            _objDALCPD._CPD.CompanyId = CompanyId;
            _objDALCPD._CPD.User_Code = User_Code;
            _objDALCPD._CPD.Region_Code = Region_Code;
            _objDALCPD._CPD.CPDDate = CPDDate;
            _objDALCPD._CPD.CPD_ID = CPD_ID;
            _objDALCPD._CPD.MarketName = MarketName;
            _objDALCPD._CPD.Activity = Activity;
            _objDALCPD._CPD.InTime = InTime;
            _objDALCPD._CPD.OutTime = OutTime;
            _objDALCPD._CPD.TotalCalls = TotalCalls;
            _objDALCPD._CPD.Productivecalls = Productivecalls;
            _objDALCPD._CPD.BrightCalls = BrightCalls;
            _objDALCPD._CPD.ShineCalls = ShineCalls;
            return _objDALCPD.InsertFieldDraft();
        }
        public int InsertFieldDetails()
        {
            _objDALCPD._CPD.subDomainName = subDomainName;
            _objDALCPD._CPD.CompanyId = CompanyId;
            _objDALCPD._CPD.Region_Code = Region_Code;
            _objDALCPD._CPD.User_Code = User_Code;
            _objDALCPD._CPD.CPDDate = CPDDate;
            _objDALCPD._CPD.CPD_ID = CPD_ID;
            _objDALCPD._CPD.MarketName = MarketName;
            _objDALCPD._CPD.Totaloutlets = Totaloutlets;
            _objDALCPD._CPD.Activity = Activity;
            _objDALCPD._CPD.TotalCalls = TotalCalls;
            _objDALCPD._CPD.Productivecalls = Productivecalls;
            _objDALCPD._CPD.BrightCalls = BrightCalls;
            _objDALCPD._CPD.ShineCalls = ShineCalls;
            _objDALCPD._CPD.ProdDetails = ProdDetails;
            _objDALCPD._CPD.Brightoutlet = Brightoutlet;
            _objDALCPD._CPD.Shineoutlet = Shineoutlet;
            _objDALCPD._CPD.GRemaks = GRemaks;
            _objDALCPD._CPD.OutTime = OutTime;
            _objDALCPD._CPD.CPDValue = CPDValue;
            return _objDALCPD.InsertFieldDetails();
        }
        public List<CPD.LeaveType> GetLeavetype()
        {
            _objDALCPD._CPD.User_Code = User_Code;
            _objDALCPD._CPD.subDomainName = subDomainName;
            return _objDALCPD.GetLeavetype();
        }
        public List<CPD.LeaveValues> GetLeaveValues()
        {
            //_objDALCPD._CPD.User_Code = User_Code;
            _objDALCPD._CPD.subDomainName = subDomainName;
            _objDALCPD._CPD.CPD_ID = CPD_ID;
            return _objDALCPD.GetLeaveValues();
        }
        public int InsertLeave()
        {
            _objDALCPD._CPD.CompanyId = CompanyId;
            _objDALCPD._CPD.subDomainName = subDomainName;
            _objDALCPD._CPD.User_Code = User_Code;
            _objDALCPD._CPD.Region_Code = Region_Code;
            _objDALCPD._CPD.CPDDate = CPDDate;
            _objDALCPD._CPD.CPD_ID = CPD_ID;
            _objDALCPD._CPD.Activity = Activity;
            _objDALCPD._CPD.CPDValue = CPDValue;
            _objDALCPD._CPD.LeaveCode = LeaveCode;
            _objDALCPD._CPD.Reason = Reason;
            return _objDALCPD.InsertLeave();
        }
        public List<CPD.AttendanceType> GetAttendancetype()
        {
            _objDALCPD._CPD.User_Code = User_Code;
            _objDALCPD._CPD.subDomainName = subDomainName;
            _objDALCPD._CPD.CPDDate = CPDDate;
            return _objDALCPD.GetAttendancetype();

        }
        public CPD.AttendanceDraft GetCPDAttDraftDetails()
        {
            _objDALCPD._CPD.CPD_ID = CPD_ID;
            _objDALCPD._CPD.subDomainName = subDomainName;
            return _objDALCPD.GetCPDAttDraftDetails();

        }
        public int GetCPDPunchTime()
        {
             _objDALCPD._CPD.subDomainName = subDomainName;
             _objDALCPD._CPD.CompanyId = CompanyId;
             _objDALCPD._CPD.User_Code = User_Code;
             _objDALCPD._CPD.Region_Code = Region_Code;
             _objDALCPD._CPD.CPDDate = CPDDate;
             _objDALCPD._CPD.CPD_ID = CPD_ID;
             _objDALCPD._CPD.Activity = Activity;
             _objDALCPD._CPD.MarketName = MarketName;
             _objDALCPD._CPD.TotalCalls = TotalCalls;
             _objDALCPD._CPD.Productivecalls = Productivecalls;
             _objDALCPD._CPD.BrightCalls = BrightCalls;
             _objDALCPD._CPD.ShineCalls = ShineCalls;
             _objDALCPD._CPD.GRemaks = GRemaks;
             _objDALCPD._CPD.InTime = InTime;
             _objDALCPD._CPD.OutTime = OutTime;
            return _objDALCPD.GetCPDPunchTime();
        }
        public int InsertAttendance()
        {
            _objDALCPD._CPD.User_Code = User_Code;
            _objDALCPD._CPD.Region_Code = Region_Code;
            _objDALCPD._CPD.subDomainName = subDomainName;
            _objDALCPD._CPD.CompanyId = CompanyId;
            _objDALCPD._CPD.CPDDate = CPDDate;
            _objDALCPD._CPD.CPD_ID = CPD_ID;
            _objDALCPD._CPD.CPDValue = CPDValue;
            _objDALCPD._CPD.Attendance = Attendance;
            _objDALCPD._CPD.Activity = Activity;
            _objDALCPD._CPD.GRemaks = GRemaks;
            _objDALCPD._CPD.OutTime = OutTime;
            return _objDALCPD.InsertAttendance();
        }
        public List<CPD.AccompanistDetails> GetUserDetails()
        {
            _objDALCPD._CPD.User_Code = User_Code;
            _objDALCPD._CPD.subDomainName = subDomainName;
            _objDALCPD._CPD.CompanyId = CompanyId;
            return _objDALCPD.GetUserDetails();
        }
        public List<CPD.CPDDate> GetUserCpdDates()
        {
            _objDALCPD._CPD.User_Code = User_Code;
            _objDALCPD._CPD.subDomainName = subDomainName;
            _objDALCPD._CPD.CompanyId = CompanyId;
            _objDALCPD._CPD.FDate = FDate;
            _objDALCPD._CPD.TDate = TDate;
            return _objDALCPD.GetUserCpdDates();
        }
        public CPD.FieldDraft GetUserCPDDetails()
        {
            _objDALCPD._CPD.subDomainName = subDomainName;
            _objDALCPD._CPD.CompanyId = CompanyId;
            _objDALCPD._CPD.CPD_ID = CPD_ID;
            return _objDALCPD.GetUserCPDDetails();
        }
        public List<CPD.Count> GetChildcount()
        {
            _objDALCPD._CPD.subDomainName = subDomainName;
            _objDALCPD._CPD.User_Code = User_Code;
            return _objDALCPD.GetChildcount();
        }
        public int DeleteCPDRecord()
        {
            _objDALCPD._CPD.subDomainName = subDomainName;
            _objDALCPD._CPD.CompanyId = CompanyId;
            _objDALCPD._CPD.Type = Type;
            _objDALCPD._CPD.CPD_ID = CPD_ID;
           return _objDALCPD.DeleteCPDRecord();
        }
        public int InsertDefaultLeave()
        {
            _objDALCPD._CPD.subDomainName = subDomainName;
            _objDALCPD._CPD.CompanyId = CompanyId;
            _objDALCPD._CPD.MinDate = MinDate;
            _objDALCPD._CPD.MaxDate = MaxDate;
            _objDALCPD._CPD.User_Code = User_Code;
            _objDALCPD._CPD.Region_Code = Region_Code;
            return _objDALCPD.InsertDefaultLeave();
        }
        public List<CPD.CPDNumbers> GetCPDData()
        {
            _objDALCPD._CPD.subDomainName = subDomainName;
            _objDALCPD._CPD.CompanyId = CompanyId;
            _objDALCPD._CPD.FromDate = FromDate;
            _objDALCPD._CPD.Todate = Todate;
            _objDALCPD._CPD.User_Code = User_Code;
            return _objDALCPD.GetCPDData();
        }
        public List<CPD.ProductName> GetProductDetails()
        {
            _objDALCPD._CPD.CompanyId = CompanyId;
            _objDALCPD._CPD.Region_Code = Region_Code;
            _objDALCPD._CPD.subDomainName = subDomainName;
            _objDALCPD._CPD.User_Code = User_Code;
            _objDALCPD._CPD.FDate = FDate;
            _objDALCPD._CPD.TDate = TDate;
            return _objDALCPD.GetProductDetails();
        }
         public List<CPD.Cummulate> GetProductwiseDetails()
        {
            _objDALCPD._CPD.CompanyId = CompanyId;
            _objDALCPD._CPD.Region_Code = Region_Code;
            _objDALCPD._CPD.subDomainName = subDomainName;
            _objDALCPD._CPD.User_Code = User_Code;
            _objDALCPD._CPD.FDate = FDate;
            _objDALCPD._CPD.TDate = TDate;
            return _objDALCPD.GetProductwiseDetails();
        }
    }
}
