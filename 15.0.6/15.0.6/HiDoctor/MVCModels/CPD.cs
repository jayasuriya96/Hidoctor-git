using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class CPD
    {
        public class CPDData
        {
            public string subDomainName { get; set; }
            public int CompanyId { get; set; }
            public string Region_Code { get; set; }
            public string User_Code { get; set; }
            public int CPD_ID { get; set; }
            public string CPDDate { get; set; }
            public string MarketName { get; set; }
            public int MarketID { get; set; }
            public int Totaloutlets { get; set; }
            public int TotalCalls { get; set; }
            public int Productivecalls { get; set; }
            public int BrightCalls { get; set; }
            public int ShineCalls { get; set; }
            public string MarketDetails { get; set; }
            public string ProdDetails { get; set; }
            public string Brightoutlet { get; set; }
            public string Shineoutlet { get; set; }
            public string GRemaks { get; set; }
            public string Status { get; set; }
            public string CPDValue { get; set; }
            public string Attendance { get; set; }
            public string Reason { get; set; }
            public string LeaveCode { get; set; }
            public string StartDate { get; set; }
            public string EndDate { get; set; }
            public string InTime { get; set; }
            public string OutTime { get; set; }
            public int Activity { get; set; }
            public string Type { get; set; }
            public string MinDate { get; set; }
            public string MaxDate { get; set; }
            public string FDate { get; set; }
            public string TDate { get; set; }
            public string FromDate { get; set; }
            public string Todate { get; set; }
        }
        public class TdDate
        {
            public string TodayDate { get; set; }
        }
        public class LeaveDays
        {
            public List<WeekEnd> WeekEnd { get; set; }
            public List<Holiday> Holiday { get; set; }
            public List<CPDActivity> Activity { get; set; }
            public List<Employee> Employee { get; set; }
        }
        public class Employee
        {
            public string HiDOCTOR_Start_Date { get; set; }
            public string Employee_Number { get; set; }
        }
        public class CPDActivity
        {
            public int CPD_Id { get; set; }
            public string CPD_Date { get; set; }
            public int Activity { get; set; }
            public int Status { get; set; }
        }
        public class WeekEnd
        {
            public string Weekend_Day { get; set; }
        }
        public class Holiday
        {
            public string Holiday_Date { get; set; }
            public string Holiday_Name { get; set; }
        }
        public class FieldDraft
        {
            public List<FieldHeader> header { get; set; }
            public List<ProdDetails> Proddetails { get; set; }
            public List<OutletDetails> Outlet { get; set; }
        }
        public class FieldHeader
        {
            public int CPD_Id { get; set; }
            public string CPD_Date { get; set; }
            public string User_Name { get; set; }
            public string Employee_Name { get; set; }
            public string Employee_Number { get; set; }
            public string Market_Name { get; set; }
            public int Market_Id { get; set; }
            public int Total_Outlets { get; set; }
            public int Total_Calls { get; set; }
            public int Productive_Calls { get; set; }
            public int Bright_Calls { get; set; }
            public int Shine_Calls { get; set; }
           // public string In_Time { get; set; }
            //public string OutTime { get; set; }
            public string GRemaks { get; set; }
        }
        public class MarketDetails
        {
            public string Region_Code { get; set; }
            public string User_Code { get; set; }
            public string StoreName { get; set; }
            public int Totaloutlets { get; set; }
        }
        public class ProdDetails
        {
            public string Product_Code { get; set; }
            public string Product_Name { get; set; }
            public decimal Product_Value { get; set; }
        }
        public class OutletDetails
        {
            public int Outlet_Type { get; set; }
            public string Product_Code { get; set; }
            public string Product_Name { get; set; }
            public int Outlet_Count { get; set; }
            public decimal Outlet_Value { get; set; }
        }
        public class MarketName
        {
            public int Market_Id { get; set; }
            public string Market_Name { get; set; }
            public string Region_Code { get; set; }
            public int Total_Outlets { get; set; }
        }
        public class ProductName
        {
            public string Product_Code { get; set; }
            public string Product_Name { get; set; }
        }
        public class LeaveType
        {
            public string Leave_Type_Code { get; set; }
            public string Leave_Type_Name { get; set; }
        }
        public class LeaveValues
        {
            public int CPD_Id { get; set; }
            public string Leave_Type_Code { get; set; }
            public string Leave_Type_Name { get; set; }
            public string LeaveReason { get; set; }
        }
        public class AttendanceType
        {
            public string Activity_Code { get; set; }
            public string Activity_Name { get; set; }
        }
        public class AttendanceDraft
        {
            public List<AttendanceDetails> Details { get; set; }
            public List<AttendanceHeader> Header { get; set; }

        }
        public class AttendanceDetails
        {
            public int CPD_Id { get; set; }
            public string Activity_Code { get; set; }
            public string Activity_Name { get; set; }
            public string From_Time { get; set; }
            public string To_Time { get; set; }
            public string Remark { get; set; }
        }
        public class AttendanceHeader
        {
            public string GeneralRemarks { get; set; }
            public string In_time { get; set; }
        }
        public class Attendance
        {
            public int CompanyId { get; set; }
            public string User_Code { get; set; }
            public string AttendanceType { get; set; }
            public string AttendanceCode { get; set; }
            public string FromTime { get; set; }
            public string ToTime { get; set; }
            public string Remark { get; set; }
        }
        public class AccompanistDetails
        {
            public string Region_Name { get; set; }
            public string Region_Code { get; set; }
            public string User_Name { get; set; }
            public string User_Code { get; set; }
            public string User_Type_Name { get; set; }
            public string Employee_Name { get; set; }
            public int Child_Count { get; set; }
            public int Activity { get; set; }
        }
        public class CPDDate
        {
            public int CPD_Id { get; set; }
            public string CPD_Date { get; set; }
            public string Activity { get; set; }
        }
        public class Count
        {
            public int count { get; set; }
        }
        public class CPDNumbers
        {
            public string subDomainName { get; set; }
            public int CompanyId { get; set; }
            public string User_Code { get; set; }
            public int DCREnteredCount { get; set; }
            public int NotEnteredDcr { get; set; }
            public Int64 Totalcalls { get; set; }
            public Int64 Prodcalls { get; set; }
            public Int64 brightcall { get; set; }
            public Int64 shinecall { get; set; }
            public decimal Bcallvalue { get; set; }
            public decimal Scallvalue { get; set; }
            public decimal Tcallvalue { get; set; }
        }
        public class Cummulate
        {
            public string Product_Code { get; set; }
            public string Product_Name { get; set; }
            public Int64 Bright_Calls { get; set; }
            public Int64 Shine_Calls { get; set; }
            public decimal Product_Value { get; set; }
            public decimal Shine_Outlet { get; set; }
            public decimal Bright_Outlet { get; set; }
        }
    }
}
