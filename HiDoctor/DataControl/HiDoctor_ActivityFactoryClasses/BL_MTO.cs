using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MVCModels;
namespace DataControl.HiDoctor_ActivityFactoryClasses
{
    public class BL_MTO:MTO.MTOData
    {
        DAL_MTO _objDALMTO = new DAL_MTO();
        public List<MTO.TdDate> GettodayDate()
        {
             _objDALMTO._MTO.subDomainName = subDomainName;
            return  _objDALMTO.GettodayDate();
        }
        public int GetUserStatus(string subDomainName, int CompanyId, string Usercode)
        {
            _objDALMTO._MTO.subDomainName = subDomainName;
            _objDALMTO._MTO.User_Code = Usercode;
            _objDALMTO._MTO.CompanyId = CompanyId;
            return _objDALMTO.GetUserStatus(subDomainName, CompanyId, Usercode);
        }
        public MTO.LeaveDays fngetWeekEndAndHoliday()
        {
            _objDALMTO._MTO.Region_Code = Region_Code;
            _objDALMTO._MTO.User_Code = User_Code;
            _objDALMTO._MTO.subDomainName = subDomainName;
            _objDALMTO._MTO.StartDate = StartDate;
            _objDALMTO._MTO.EndDate = EndDate;
            return _objDALMTO.fngetWeekEndAndHoliday();
        }
        public List<MTO.LeaveType> GetLeavetype()
        {
            _objDALMTO._MTO.User_Code = User_Code;
            _objDALMTO._MTO.subDomainName = subDomainName;
            return _objDALMTO.GetLeavetype();
        }
        public List<MTO.LeaveValues> GetLeaveValues()
        {
            //_objDALMTO._MTO.User_Code = User_Code;
            _objDALMTO._MTO.subDomainName = subDomainName;
            _objDALMTO._MTO.MTO_ID = MTO_ID;
            return _objDALMTO.GetLeaveValues();
        }
        public int GetInsetLeave()
        {
            _objDALMTO._MTO.User_Code = User_Code;
            _objDALMTO._MTO.Region_Code = Region_Code;
            _objDALMTO._MTO.subDomainName = subDomainName;
            _objDALMTO._MTO.MTODate = MTODate;
            _objDALMTO._MTO.MTO_ID = MTO_ID;
            _objDALMTO._MTO.MTOValue = MTOValue;
            _objDALMTO._MTO.LeaveCode = LeaveCode;
            _objDALMTO._MTO.Reason = Reason;
            return _objDALMTO.GetInsetLeave();
        }
        public List<MTO.AttendanceType> GetAttendancetype()
        {
            _objDALMTO._MTO.User_Code = User_Code;
            _objDALMTO._MTO.subDomainName = subDomainName;
            _objDALMTO._MTO.MTODate = MTODate;
            return _objDALMTO.GetAttendancetype();

        }
        public MTO.AttendanceDraft GetMTOAttDraftDetails()
        {
            _objDALMTO._MTO.MTO_ID = MTO_ID;
            _objDALMTO._MTO.subDomainName = subDomainName;
            return _objDALMTO.GetMTOAttDraftDetails();

        }
        public int GetInsetAttendance()
        {
            _objDALMTO._MTO.User_Code = User_Code;
            _objDALMTO._MTO.Region_Code = Region_Code;
            _objDALMTO._MTO.subDomainName = subDomainName;
            _objDALMTO._MTO.MTODate = MTODate;
            _objDALMTO._MTO.MTO_ID = MTO_ID;
            _objDALMTO._MTO.MTOValue = MTOValue;
            _objDALMTO._MTO.Attendance = Attendance;
            _objDALMTO._MTO.GRemaks = GRemaks;
            _objDALMTO._MTO.OutTime = OutTime;
            _objDALMTO._MTO.Latitude = Latitude;
            _objDALMTO._MTO.Longitude = Longitude;
            return _objDALMTO.GetInsetAttendance();
        }

        public MTO.Product GetAllProductName()
        {
            _objDALMTO._MTO.Region_Code = Region_Code;
            _objDALMTO._MTO.subDomainName = subDomainName;
            _objDALMTO._MTO.User_Code = User_Code;
            return _objDALMTO.GetAllProductName();

        }
        public List<MTO.AccompanistDetails> GetAccompanistDetails()
        {
            _objDALMTO._MTO.User_Code = User_Code;
            _objDALMTO._MTO.Region_Code = Region_Code;
            _objDALMTO._MTO.subDomainName = subDomainName;
            return _objDALMTO.GetAccompanistDetails();

        }
        public int GetInsetField()
        {
            _objDALMTO._MTO.User_Code = User_Code;
            _objDALMTO._MTO.Region_Code = Region_Code;
            _objDALMTO._MTO.subDomainName = subDomainName;
            _objDALMTO._MTO.MTODate = MTODate;
            _objDALMTO._MTO.MTO_ID = MTO_ID;
            _objDALMTO._MTO.StoreName = StoreName;
            _objDALMTO._MTO.Accompanist = Accompanist;
            _objDALMTO._MTO.ProductSale = ProductSale;
            _objDALMTO._MTO.ProductSample = ProductSample;
            _objDALMTO._MTO.CustomerDetails = CustomerDetails;
            _objDALMTO._MTO.GRemaks = GRemaks;
            _objDALMTO._MTO.MTOValue = MTOValue;
            _objDALMTO._MTO.OutTime = OutTime;
            _objDALMTO._MTO.Latitude = Latitude;
            _objDALMTO._MTO.Longitude = Longitude;
            return _objDALMTO.GetInsetField();

        }
        public int GetMTOPunchTime()
        {
            _objDALMTO._MTO.User_Code = User_Code;
            _objDALMTO._MTO.Region_Code = Region_Code;
            _objDALMTO._MTO.subDomainName = subDomainName;
            _objDALMTO._MTO.MTODate = MTODate;
            _objDALMTO._MTO.MTO_ID = MTO_ID;
            _objDALMTO._MTO.StoreName = StoreName;
            _objDALMTO._MTO.Activity = Activity;
            _objDALMTO._MTO.InTime = InTime;
            _objDALMTO._MTO.OutTime = OutTime;
            _objDALMTO._MTO.Latitude = Latitude;
            _objDALMTO._MTO.Longitude = Longitude;
            return _objDALMTO.GetMTOPunchTime();
        }
        public MTO.FieldDraft GetMTOFieldDraftDetails()
        {
            _objDALMTO._MTO.MTO_ID = MTO_ID;
            _objDALMTO._MTO.subDomainName = subDomainName;
            return _objDALMTO.GetMTOFieldDraftDetails();

        }
        public List<MTO.AccompanistDetails> GetUserDetails()
        {
            _objDALMTO._MTO.User_Code = User_Code;
            _objDALMTO._MTO.subDomainName = subDomainName;
            return _objDALMTO.GetUserDetails();
        }
        public List<MTO.MTODate> GetUserMtoDates()
        {
            _objDALMTO._MTO.User_Code = User_Code;
            _objDALMTO._MTO.subDomainName = subDomainName;
            return _objDALMTO.GetUserMtoDates();
        }
        public MTO.MTODetails GetUserMtoDetails()
        {
            _objDALMTO._MTO.subDomainName = subDomainName;
            _objDALMTO._MTO.MTO_ID = MTO_ID;
            return _objDALMTO.GetUserMtoDetails();
        }
        public List<MTO.Count> GetChildcount()
        {
            _objDALMTO._MTO.subDomainName = subDomainName;
            _objDALMTO._MTO.User_Code = User_Code;
            return _objDALMTO.GetChildcount();
        }
        public List<MTO.AccompanistDetails> GetDelUserDetails()
        {
            _objDALMTO._MTO.User_Code = User_Code;
            _objDALMTO._MTO.subDomainName = subDomainName;
            return _objDALMTO.GetDelUserDetails();
        }
        public int DeleteMTORecord()
        {
            _objDALMTO._MTO.subDomainName = subDomainName;
            _objDALMTO._MTO.User_Code = User_Code;
            _objDALMTO._MTO.Type = Type;
            _objDALMTO._MTO.MTO_ID = MTO_ID;
            return _objDALMTO.DeleteMTORecord();
        }
        public List<MTO.MTODate> GetDelUserMTODates()
        {
            _objDALMTO._MTO.User_Code = User_Code;
            _objDALMTO._MTO.subDomainName = subDomainName;
            _objDALMTO._MTO.FDate = FDate;
            _objDALMTO._MTO.TDate = TDate;
            return _objDALMTO.GetDelUserMTODates();
        }
        public List<MTO.CompanyCredential> GetCompanyCode()
        {
            _objDALMTO._MTO.subDomainName = subDomainName;
            _objDALMTO._MTO.CompanyId = CompanyId;
            return _objDALMTO.GetCompanyCode();
        }
        public int InsertFileDetails()
        {
            _objDALMTO._MTO.subDomainName = subDomainName;
            _objDALMTO._MTO.User_Code = User_Code;
            _objDALMTO._MTO.MTO_ID = MTO_ID;
            _objDALMTO._MTO.File_Name = File_Name;
            _objDALMTO._MTO.File_Path = File_Path;
            return _objDALMTO.InsertFileDetails();
        }
        public List<MTO.MTOFile> GetMtoAttachment()
        {
            _objDALMTO._MTO.subDomainName = subDomainName;
            _objDALMTO._MTO.MTO_ID = MTO_ID;
            return _objDALMTO.GetMtoAttachment();
        }
        public List<MTO.AccompanistDetails> GetUserTrackDetails()
        {
            _objDALMTO._MTO.User_Code = User_Code;
            _objDALMTO._MTO.subDomainName = subDomainName;
            return _objDALMTO.GetUserTrackDetails();
        }
        public List<MTO.LocationDetails> GetUserLatLong()
        {
            _objDALMTO._MTO.User_Code = User_Code;
            _objDALMTO._MTO.subDomainName = subDomainName;
            _objDALMTO._MTO.FDate = FDate;
            return _objDALMTO.GetUserLatLong();
        }
    }
}
