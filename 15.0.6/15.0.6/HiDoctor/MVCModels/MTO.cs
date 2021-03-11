using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class MTO
    {
        public class MTOData
        {
            public int CompanyId { get; set; }
            public string Company_Code { get; set; }
            public string subDomainName { get; set; }
            public string Region_Code { get; set; }
            public string User_Code { get; set; }
            public string MTODate { get; set; }
            public string StoreName { get; set; }
            public string Accompanist { get; set; }
            public string ProductSale { get; set; }
            public string ProductSample { get; set; }
            public string CustomerDetails { get; set; }
            public string CustomerProduct { get; set; }
            public string GRemaks { get; set; }
            public string Status { get; set; }
            public string MTOValue { get; set; }
            public string Attendance { get; set; }
            public string Reason { get; set; }
            public string LeaveCode { get; set; }
            public string StartDate { get; set; }
            public string EndDate { get; set; }
            public int MTO_ID { get; set; }
            public string InTime { get; set; }
            public string OutTime { get; set; }
            public int Activity { get; set; }
            public string FDate { get; set; }
            public string TDate { get; set; }
            public int Type { get; set; }
            public string File_Path { get; set; }
            public string File_Name { get; set; }
            public string Latitude { get; set; }
            public string Longitude { get; set; }
        }
        public class TdDate
        {
            public string TodayDate { get; set; }
        }
        public class MTOFile
        {
            public int Attachment_Id { get; set; }
            public int MTO_Id { get; set; }
            public string File_Path { get; set; }
            public string File_Name { get; set; }
        }
        public class CompanyCredential
        {
            public int CompanyId { get; set; }
            public string Company_Code { get; set; }
            public string subDomainName { get; set; }
        }
        public class Attendance
        {
            public string AttendanceType { get; set; }
            public string AttendanceCode { get; set; }
            public string FromTime { get; set; }
            public string ToTime { get; set; }
            public string Remark { get; set; }
        }
        public class Accompanist
        {
            public string User_Name { get; set; }
            public string User_Code { get; set; }
            public string StartTime { get; set; }
            public string EndTime { get; set; }
        }
        public class MTOProduct
        {
            public string Product_Code { get; set; }
            public string Product_Name { get; set; }
            public decimal Opening { get; set; }
            public decimal Recepit { get; set; }
            public decimal Sales { get; set; }
            public decimal Closing { get; set; }
            public string Entity { get; set; }
        }
        public class CustomerDetails
        {
            public string Customer_Name { get; set; }
            public string MobileNumber { get; set; }
            public string Remark { get; set; }
            public List<CustomerProduct> Product {get;set;}
        }
        public class CustomerProduct
        {
            public string Product_Code { get; set; }
            public string Product_Name { get; set; }
            public decimal Quantity { get; set; }
            public string Entity { get; set; }
        }
        public class LeaveType
        {
            public string Leave_Type_Code { get; set; }
            public string Leave_Type_Name { get; set; }
        }
        public class LeaveValues
        {
            public int MTO_Id { get; set; }
            public string Leave_Type_Code { get; set; }
            public string Leave_Type_Name { get; set; }
            public string LeaveReason { get; set; }
        }
        public class AttendanceType
        {
            public string Activity_Code { get; set; }
            public string Project_Code { get; set; }
            public string Activity_Name { get; set; }
            public string Project_Name { get; set; }
        }
        public class AttendanceDraft
        {
            public List<AttendanceDetails> Details { get; set; }
            public List<AttendanceHeader> Header { get; set; }
          
        }
        public class AttendanceDetails
        {
            public int MTO_Id { get; set; }
            public string Activity_Code { get; set; }
            public string Activity_Name { get; set; }
            public string From_Time { get; set; }
            public string To_Time { get; set; }
            public string Remark { get; set; }
            public string Project_Name { get; set; }
        }
        public class AttendanceHeader
        {
            public string GeneralRemarks { get; set; }
            public string In_time { get; set; }
        }
        public class LeaveDays
        {
            public List<WeekEnd> WeekEnd { get; set; }
            public List<Holiday> Holiday { get; set; }
            public List<MTOActivity> Activity { get; set; }
        }
        public class MTOActivity
        {
            public int MTO_Id { get; set; }
            public string MTO_Date { get; set; }
            public int Activity { get; set; }
            public int Status { get; set; }
        }
        public class FieldDraft
        {
            public List<FieldHeader> header { get; set; }
            public List<FieldAccompanist> FieldAcc { get; set; }
            public List<SalesAndSample> SS { get; set; }
            public List<CustomerHeader> CusHeader { get; set; }
            public List<FieldCustomer> CusDetails { get; set; }
        }
        public class FieldHeader
        {
           public int MTO_Id { get; set; }
            public string Store_Name { get; set; }
            public string GeneralRemarks { get; set; }
            public string In_time { get; set; }
        }
        public class FieldAccompanist
        {
            public string Accompanist_Code { get; set; }
            public string Accompanist_Name { get; set; }
            public string Start_Time { get; set; }
            public string End_Time { get; set; }
        }
        public class SalesAndSample
        {
            public string Product_Code { get; set; }
            public string Product_Name { get; set; }
            public string Entity { get; set; }
            public decimal Opening { get; set; }
            public decimal  Receipt { get; set; }
            public decimal Sales { get; set; }
            public decimal Closing { get; set; }
        }
        public class CustomerHeader
        {
            public int Customer_Id { get; set; }
            public string Customer_Name { get; set; }
            public string MobileNumber { get; set; }
            public string Remark { get; set; }
        }
        public class FieldCustomer
        {
            public int Customer_Id { get; set; }
            public string Product_Code { get; set; }
            public string Product_Name { get; set; }
            public decimal Quantity { get; set; }
            public string Entity { get; set; }
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
        public class Product
        {
            public List<ProductName> Prod { get; set; }
            public List<SampleName> Sample { get; set; }
        }
        public class ProductName
        {
            public string Product_Code { get; set; }
            public string Product_Name { get; set; }
        }
        public class SampleName
        {
            public string Product_Code { get; set; }
            public string Product_Name { get; set; }
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
        }
        public class LocationDetails
        {
            public string Latitude { get; set; }
            public string Longitude { get; set; }
            public string outLatitude { get; set; }
            public string outLongitude { get; set; }
            public string User_Code { get; set; }
            public string MTO_Date { get; set; }
            public string Activity { get; set; }
        }
        public class MTODate
        {
            public int MTO_Id { get; set; }
            public string MTO_Date{get; set;}
            public string Activity { get; set; }
            public string User_Name { get; set; }
            public int Status { get; set; }
        }
        public class Header
        {
            public int MTO_Id { get; set; }
            public string User_Name { get; set; }
            public int Activity { get; set; }
            public string MTO_Date { get; set; }
            public string Store_Name { get; set; }
            public string GeneralRemarks { get; set; }
            public string Leave_Type_Name { get; set; }
            public string LeaveReason { get; set; }
            public string In_time { get; set; }
            public string Out_time { get; set; }
        }
        public class AccompanistList
        {
            public int MTO_Id { get; set; }
            public string Accompanist_Name { get; set; }
            public string Start_Time { get; set; }
            public string End_Time { get; set; }
        }
        public class SalesAndSamples
        {
            public int MTO_Id { get; set; }
            public string Product_Name { get; set; }
            public decimal Opening { get; set; }
            public decimal Receipt { get; set; }
            public decimal Sales { get; set; }
            public decimal Closing { get; set; }
            public string Entity { get; set; }
        }
        public class CusHeader
        {
            public int MTO_Id { get; set; }
            public int Customer_Id { get; set; }
            public string Customer_Name { get; set; }
            public string MobileNumber { get; set; }
            public string Remark { get; set; }
        }
        public class CustomerProductInfo
        {
            public int MTO_Id { get; set; }
            public int Customer_Id { get; set; }
            public string Product_Name { get; set; }
            public decimal Quantity { get; set; }
            public string Entity { get; set; }
        }
        public class AttendanceDetail
        {
            public string Activity_Name { get; set; }
            public string From_Time { get; set; }
            public string To_Time { get; set; }
            public string Remark { get; set; }
        }
        public class MTODetails
        {
            public List<Header> Header { get; set; }
            public List<AccompanistList> AccompanistList { get; set; }
            public List<SalesAndSamples> SalesAndSamples { get; set; }
            public List<CusHeader> CustomerHeader { get; set; }
            public List<CustomerProductInfo> CustomerProductInfo { get; set; }
            public List<AttendanceDetail> AttendanceDetail { get; set; }
            public List<MTOFile> FileDetail { get; set; }
            
        }
        public class Count
        {
            public int count { get; set; }
        }
    }
}
