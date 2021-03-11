using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using System.Text;
using MVCModels;
using Dapper;
using Newtonsoft.Json;

namespace DataControl.HiDoctor_ActivityFactoryClasses
{
    public class DAL_CPD : DapperRepository
    {
        public CPD.CPDData _CPD;
        public DAL_CPD()
        {
            _CPD = new CPD.CPDData();
        }
        public int GetUserStatus(string subDomainName, int CompanyId, string Usercode)
        {
            int result = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_CPD.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyId", CompanyId);
                    p.Add("@Usercode", Usercode);
                    p.Add("@Result", 0, DbType.Int32, ParameterDirection.Output, 1000);
                    connection.Query<int>("Sp_hd_GetUserStatus", p, commandType: CommandType.StoredProcedure);
                    result = p.Get<int>("@Result");
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }
        public List<CPD.TdDate> GettodayDate()
        {
            List<CPD.TdDate> lst = new List<CPD.TdDate>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_CPD.subDomainName))
                {
                    lst = connection.Query<CPD.TdDate>("Sp_hd_CPD_GetTodayDate", null, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                    return lst;
                }

            }
              catch(Exception ex)
            {
                throw;
            }
        }

        public CPD.LeaveDays fngetWeekEndAndHoliday()
        {
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_CPD.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@RegionCode", _CPD.Region_Code);
                    p.Add("@UserCode", _CPD.User_Code);
                    p.Add("@StartDate", _CPD.StartDate);
                    p.Add("@EndDate", _CPD.EndDate);
                    var lst = connection.QueryMultiple("Sp_hd_GetCPDWeekEndAndHoliday", p, commandType: CommandType.StoredProcedure);
                    CPD.LeaveDays Mt = new CPD.LeaveDays();
                    Mt.WeekEnd = lst.Read<CPD.WeekEnd>().ToList();
                    Mt.Holiday = lst.Read<CPD.Holiday>().ToList();
                    Mt.Activity = lst.Read<CPD.CPDActivity>().ToList();
                    Mt.Employee = lst.Read<CPD.Employee>().ToList();
                    connection.Close();
                    return Mt;
                }

            }
              catch(Exception ex)
            {
                throw;
            }

        }
        public CPD.FieldDraft GetCPDFieldDraftDetails()
        {
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_CPD.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@CPDID", _CPD.CPD_ID);
                    var lst = connection.QueryMultiple("SP_hdGetCPDFieldDraftDetails", p, commandType: CommandType.StoredProcedure);
                    CPD.FieldDraft Draft = new CPD.FieldDraft();
                    Draft.header = lst.Read<CPD.FieldHeader>().ToList();
                    Draft.Proddetails = lst.Read<CPD.ProdDetails> ().ToList();
                    Draft.Outlet = lst.Read<CPD.OutletDetails>().ToList();
                    connection.Close();
                    return Draft;
                }

            }
              catch(Exception ex)
            {
                throw;
            }

        }
        public List<CPD.MarketName> GetAllMarketNames()
        {
            List<CPD.MarketName> lst = new List<CPD.MarketName>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_CPD.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Code", _CPD.Region_Code);
                    lst = connection.Query<CPD.MarketName>("Sp_hd_CPD_GetMarketNames", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                    return lst;
                }

            }
              catch(Exception ex)
            {
                throw;
            }
        }
        public List<CPD.ProductName> GetAllProductNames()
        {
            List<CPD.ProductName> lst = new List<CPD.ProductName>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_CPD.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Code", _CPD.Region_Code);
                    p.Add("@User_Code", _CPD.User_Code);
                    p.Add("@CPDDate", _CPD.CPDDate);
                    lst = connection.Query<CPD.ProductName>("Sp_hd_CPD_GetProductLists", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                    return lst;
                }

            }
              catch(Exception ex)
            {
                throw;
            }
        }

        public int InsertFieldDraft()
        {
            int success = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_CPD.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyId", _CPD.CompanyId);
                    p.Add("@User_Code", _CPD.User_Code);
                    p.Add("@Region_Code", _CPD.Region_Code);
                    p.Add("@CPDDate", _CPD.CPDDate);
                    p.Add("@CPDID", _CPD.CPD_ID);
                    p.Add("@MarketName",_CPD.MarketName);
                    p.Add("@Activity",_CPD.Activity);
                    p.Add("@InTime",_CPD.InTime);
                    p.Add("@OutTime",_CPD.OutTime);
                    p.Add("@TotalCalls",_CPD.TotalCalls);
                    p.Add("@Productivecalls",_CPD.Productivecalls);
                    p.Add("@BrightCalls",_CPD.BrightCalls);
                    p.Add("@ShineCalls",_CPD.ShineCalls);
                    p.Add("@Status", 0);
                    p.Add("@GRemaks", null);
                    p.Add("@Result", 0, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>("Sp_hd_CPD_InsertFieldDraft", p, commandType: CommandType.StoredProcedure);
                    success = p.Get<int>("@Result");
                    connection.Close();
                }
            }
              catch(Exception ex)
            {
                throw;
            }
            return success;

        }
        public int InsertFieldDetails()
        {
            int result = 1;
            int success;
            int lst = 0;
            int CID = 0;
            List<CPD.ProdDetails> Pobj = JsonConvert.DeserializeObject<List<CPD.ProdDetails>>(_CPD.ProdDetails).ToList();
            List<CPD.OutletDetails> Bobj = JsonConvert.DeserializeObject<List<CPD.OutletDetails>>(_CPD.Brightoutlet).ToList();
            List<CPD.OutletDetails> Sobj = JsonConvert.DeserializeObject<List<CPD.OutletDetails>>(_CPD.Shineoutlet).ToList();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_CPD.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyId", _CPD.CompanyId);
                    p.Add("@User_Code", _CPD.User_Code);
                    p.Add("@Region_Code", _CPD.Region_Code);
                    p.Add("@CPDDate", _CPD.CPDDate);
                    p.Add("@CPDID", _CPD.CPD_ID);
                    p.Add("@MarketName", _CPD.MarketName);
                    p.Add("@Totaloutlets", _CPD.Totaloutlets);
                    p.Add("@Activity", _CPD.Activity);
                    p.Add("@InTime", null);
                    p.Add("@OutTime",_CPD.OutTime);
                    p.Add("@TotalCalls", _CPD.TotalCalls);
                    p.Add("@Productivecalls", _CPD.Productivecalls);
                    p.Add("@BrightCalls", _CPD.BrightCalls);
                    p.Add("@ShineCalls", _CPD.ShineCalls);
                    p.Add("@Status",_CPD.CPDValue);
                    p.Add("@GRemaks",_CPD.GRemaks);
                    p.Add("@Result", 0, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>("Sp_hd_InsertCPDField", p, commandType: CommandType.StoredProcedure);
                    lst = p.Get<int>("@Result");
                    if (lst != 0)
                    {
                        foreach (var sch in Pobj)
                        {
                            var par = new DynamicParameters();
                            par.Add("@CompanyId", _CPD.CompanyId);
                            par.Add("@User_Code", _CPD.User_Code);
                            par.Add("@CPDID", lst);
                            par.Add("@Product_Code", sch.Product_Code);
                            par.Add("@Product_Value", sch.Product_Value);
                            success = connection.Query<int>("Sp_hd_InsertCPDProducts ", par, commandType: CommandType.StoredProcedure).SingleOrDefault();

                        }
                        foreach (var item in Bobj)
                        {
                            var par = new DynamicParameters();
                            par.Add("@CompanyId", _CPD.CompanyId);
                            par.Add("@User_Code", _CPD.User_Code);
                            par.Add("@CPDID", lst);
                            par.Add("@Outlet_Type", item.Outlet_Type);
                            par.Add("@Product_Code", item.Product_Code);
                            par.Add("@Outlet_Count", item.Outlet_Count);
                            par.Add("@Outlet_Value", item.Outlet_Value);
                            success = connection.Query<int>("Sp_hd_InsertCPDOutlets ", par, commandType: CommandType.StoredProcedure).SingleOrDefault();
                        }
                        foreach (var shn in Sobj)
                        {
                            var par = new DynamicParameters();
                            par.Add("@CompanyId", _CPD.CompanyId);
                            par.Add("@User_Code", _CPD.User_Code);
                            par.Add("@CPDID", lst);
                            par.Add("@Outlet_Type", shn.Outlet_Type);
                            par.Add("@Product_Code", shn.Product_Code);
                            par.Add("@Outlet_Count", shn.Outlet_Count);
                            par.Add("@Outlet_Value", shn.Outlet_Value);
                            success = connection.Query<int>("Sp_hd_InsertCPDOutlets ", par, commandType: CommandType.StoredProcedure).SingleOrDefault();
                        }
                    }
                    connection.Close();
                }

            }
              catch(Exception ex)
            {
                throw;
            }
            return result;
        }
        public List<CPD.LeaveType> GetLeavetype()
        {
            List<CPD.LeaveType> lst = new List<CPD.LeaveType>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_CPD.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Code", _CPD.User_Code);
                    lst = connection.Query<CPD.LeaveType>("Sp_Hd_GetCPDLeaveType", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
              catch(Exception ex)
            {
                throw;
            }
            return lst;
        }
        public List<CPD.LeaveValues> GetLeaveValues()
        {
            List<CPD.LeaveValues> lst = new List<CPD.LeaveValues>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_CPD.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@CPD_Id", _CPD.CPD_ID);
                    lst = connection.Query<CPD.LeaveValues>("Sp_Hd_GetCPDLeaveValForDraft", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
              catch(Exception ex)
            {
                throw;
            }
            return lst;
        }
        public int InsertLeave()
        {
            int success = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_CPD.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyId", _CPD.CompanyId);
                    p.Add("@User_Code", _CPD.User_Code);
                    p.Add("@Region_Code", _CPD.Region_Code);
                    p.Add("@CPDDate", _CPD.CPDDate);
                    p.Add("@CPDID", _CPD.CPD_ID);
                    p.Add("@Activity", _CPD.Activity);
                    p.Add("@Status", _CPD.CPDValue);
                    p.Add("@Reason", _CPD.Reason);
                    p.Add("@LeaveCode", _CPD.LeaveCode);
                    p.Add("@Result", 0, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>("Sp_hd_InsertCPDLeave", p, commandType: CommandType.StoredProcedure);
                    success = p.Get<int>("@Result");
                    connection.Close();
                }
            }
              catch(Exception ex)
            {
                throw;
            }
            return success;
        }
        public List<CPD.AttendanceType> GetAttendancetype()
        {
            List<CPD.AttendanceType> lst = new List<CPD.AttendanceType>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_CPD.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Code", _CPD.User_Code);
                    p.Add("@CPD_Date", _CPD.CPDDate);
                    lst = connection.Query<CPD.AttendanceType>("SP_hdGetCPDAttendanceActivity", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
              catch(Exception ex)
            {
                throw;
            }
            return lst;
        }
        public CPD.AttendanceDraft GetCPDAttDraftDetails()
        {
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_CPD.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@CPDID", _CPD.CPD_ID);
                    var lst = connection.QueryMultiple("SP_hdGetCPDAttDraftDetails", p, commandType: CommandType.StoredProcedure);
                    CPD.AttendanceDraft Draft = new CPD.AttendanceDraft();
                    Draft.Details = lst.Read<CPD.AttendanceDetails>().ToList();
                    Draft.Header = lst.Read<CPD.AttendanceHeader>().ToList();
                    connection.Close();
                    return Draft;
                }

            }
              catch(Exception ex)
            {
                throw;
            }

        }
        public int GetCPDPunchTime()
        {
            int lst = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_CPD.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyId", _CPD.CompanyId);
                    p.Add("@User_Code", _CPD.User_Code);
                    p.Add("@Region_Code", _CPD.Region_Code);
                    p.Add("@CPDDate", _CPD.CPDDate);
                    p.Add("@CPDID", _CPD.CPD_ID);
                    p.Add("@Activity", _CPD.Activity);
                    p.Add("@MarketName", _CPD.MarketName);
                    p.Add("@TotalCalls", _CPD.TotalCalls);
                    p.Add("@ProductiveCalls", _CPD.Productivecalls);
                    p.Add("@BrightCalls", _CPD.BrightCalls);
                    p.Add("@ShineCalls", _CPD.ShineCalls);
                    p.Add("@InTime", _CPD.InTime);
                    p.Add("@OutTime", _CPD.OutTime);
                    p.Add("@Status", 0);
                    p.Add("@GRemaks", null);
                    p.Add("@Result", 0, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>("Sp_hd_InsertCPDField", p, commandType: CommandType.StoredProcedure);
                    lst = p.Get<int>("@Result");
                    return lst;
                }
            }
              catch(Exception ex)
            {
                throw;
            }
        }
        public int InsertAttendance()
        {
            int success = 0;
            int lst = 0;
            List<CPD.Attendance> Att = JsonConvert.DeserializeObject<List<CPD.Attendance>>(_CPD.Attendance).ToList();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_CPD.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyId", _CPD.CompanyId);
                    p.Add("@User_Code", _CPD.User_Code);
                    p.Add("@Region_Code", _CPD.Region_Code);
                    p.Add("@CPDDate", _CPD.CPDDate);
                    p.Add("@CPDID", _CPD.CPD_ID);
                    p.Add("@Activity", _CPD.Activity);
                    p.Add("@Status", _CPD.CPDValue);
                    p.Add("@GRemaks", _CPD.GRemaks);
                    p.Add("@OutTime", _CPD.OutTime);
                    p.Add("@Result", 0, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>("Sp_hd_InsertCPDAttendance", p, commandType: CommandType.StoredProcedure);
                    lst = p.Get<int>("@Result");

                    if (lst != 0)
                    {
                        foreach (var sch in Att)
                        {
                            var par = new DynamicParameters();
                            par.Add("@CPD_Id", lst);
                            par.Add("@CompanyId", _CPD.CompanyId);
                            par.Add("@User_Code", sch.User_Code);
                            par.Add("@AttendanceType", sch.AttendanceType);
                            par.Add("@AttendanceCode", sch.AttendanceCode);
                            par.Add("@FromTime", sch.FromTime);
                            par.Add("@ToTime", sch.ToTime);
                            par.Add("@Remark", sch.Remark);
                            success = connection.Query<int>("Sp_hd_InsertCPDAttendanceDetails ", par, commandType: CommandType.StoredProcedure).SingleOrDefault();

                        }
                    }
                    connection.Close();
                }
            }
              catch(Exception ex)
            {
                throw;
            }
            return success;
        }
        public List<CPD.AccompanistDetails> GetUserDetails()
        {
            List<CPD.AccompanistDetails> lst = new List<CPD.AccompanistDetails>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_CPD.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyId", _CPD.CompanyId);
                    p.Add("@User_Code", _CPD.User_Code);
                    lst = connection.Query<CPD.AccompanistDetails>("SP_Hd_GetCPDUserDetails", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
              catch(Exception ex)
            {
                throw;
            }
            return lst;
        }
        public List<CPD.CPDDate> GetUserCpdDates()
        {
            List<CPD.CPDDate> lstDates = new List<CPD.CPDDate>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_CPD.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyId", _CPD.CompanyId);
                    p.Add("@User_Code", _CPD.User_Code);
                    p.Add("@Fromdate", _CPD.FDate);
                    p.Add("@Todate", _CPD.TDate);
                    lstDates = connection.Query<CPD.CPDDate>("SP_hd_GetUserCPDDates", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                }
            }
              catch(Exception ex)
            {
                throw;
            }
            return lstDates;
        }
        public CPD.FieldDraft GetUserCPDDetails()
        {
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_CPD.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyId", _CPD.CompanyId);
                    p.Add("@CPD_ID", _CPD.CPD_ID);
                    var lstData = connection.QueryMultiple("SP_hd_GetUserCPDDetails", p, commandTimeout: 300, commandType: CommandType.StoredProcedure);
                    CPD.FieldDraft CPDDetails = new CPD.FieldDraft();
                    CPDDetails.header = lstData.Read<CPD.FieldHeader>().ToList();
                    CPDDetails.Proddetails = lstData.Read<CPD.ProdDetails>().ToList();
                    CPDDetails.Outlet = lstData.Read<CPD.OutletDetails>().ToList();
                    connection.Close();
                    return CPDDetails;
                }
            }
              catch(Exception ex)
            {
                throw;
            }
        }
        public List<CPD.Count> GetChildcount()
        {
            List<CPD.Count> lstDates = new List<CPD.Count>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_CPD.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Code", _CPD.User_Code);
                    lstDates = connection.Query<CPD.Count>("SP_hd_GetChildUserCount", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                }
            }
              catch(Exception ex)
            {
                throw;
            }
            return lstDates;
        }
        public int DeleteCPDRecord()
        {
            int success = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_CPD.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyId", _CPD.CompanyId);
                    p.Add("@CPDID", _CPD.CPD_ID);
                    p.Add("@Type", _CPD.Type);
                    p.Add("@Result", 0, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>("Sp_hd_CPD_Deleterecord", p, commandType: CommandType.StoredProcedure);
                    success = p.Get<int>("@Result");
                    connection.Close();
                }
            }
              catch(Exception ex)
            {
                throw;
            }
            return success;

        }
        public int InsertDefaultLeave()
        {
            int success = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_CPD.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyId", _CPD.CompanyId);
                    p.Add("@MinDate", _CPD.MinDate);
                    p.Add("@MaxDate", _CPD.MaxDate);
                    p.Add("@User_Code", _CPD.User_Code);
                    p.Add("@Region_Code", _CPD.Region_Code);
                    p.Add("@Result", 0, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>("SP_hd_InsertLeave", p, commandType: CommandType.StoredProcedure);
                    success = p.Get<int>("@Result");
                    connection.Close();
                }
            }
              catch(Exception ex) 
            {
                throw;
            }
            return success;
        }
        public List<CPD.CPDNumbers> GetCPDData()
        {
            List<CPD.CPDNumbers> lstData = new List<CPD.CPDNumbers>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_CPD.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyId", _CPD.CompanyId);
                    p.Add("@User_Code", _CPD.User_Code);
                    p.Add("@Fromdate", _CPD.FromDate);
                    p.Add("@Todate", _CPD.Todate);
                    lstData = connection.Query<CPD.CPDNumbers>("Sp_hd_GetCPDData", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                }
            }
              catch(Exception ex)
            {
                throw;
            }
            return lstData;
        }
        public List<CPD.ProductName> GetProductDetails()
        {
            List<CPD.ProductName> lst = new List<CPD.ProductName>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_CPD.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyId", _CPD.CompanyId);
                    p.Add("@Region_Code", _CPD.Region_Code);
                    p.Add("@User_Code", _CPD.User_Code);
                    p.Add("@Fromdate", _CPD.FDate);
                    p.Add("@Todate", _CPD.TDate);
                    lst = connection.Query<CPD.ProductName>("Sp_hd_CPD_GetProducts", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                    return lst;
                }

            }
              catch(Exception ex)
            {
                throw;
            }
        }
         public List<CPD.Cummulate> GetProductwiseDetails()
        {
            List<CPD.Cummulate> lst = new List<CPD.Cummulate>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_CPD.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyId", _CPD.CompanyId);
                    p.Add("@Region_Code", _CPD.Region_Code);
                    p.Add("@User_Code", _CPD.User_Code);
                    p.Add("@Fromdate", _CPD.FDate);
                    p.Add("@Todate", _CPD.TDate);
                    lst = connection.Query<CPD.Cummulate>("Sp_hd_CPD_GetProductwisevalue", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                    return lst;
                }

            }
              catch(Exception ex)
            {
                throw;
            }
        }
    }
}

