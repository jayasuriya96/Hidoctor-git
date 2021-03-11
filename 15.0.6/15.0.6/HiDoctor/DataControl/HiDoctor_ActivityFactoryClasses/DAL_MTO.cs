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
    public class DAL_MTO : DapperRepository
    {
        public MTO.MTOData _MTO;
        public DAL_MTO()
        {
            _MTO = new MTO.MTOData();
        }
        public List<MTO.LeaveType> GetLeavetype()
        {
            List<MTO.LeaveType> lst = new List<MTO.LeaveType>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_MTO.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Code", _MTO.User_Code);
                    lst = connection.Query<MTO.LeaveType>("Sp_Hd_GetMTOLeaveType", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch
            {
                throw;
            }
            return lst;
        }
        public List<MTO.LeaveValues> GetLeaveValues()
        {
            List<MTO.LeaveValues> lst = new List<MTO.LeaveValues>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_MTO.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@MTO_ID", _MTO.MTO_ID);
                    lst = connection.Query<MTO.LeaveValues>("Sp_Hd_GetMTOLeaveValForDraft", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch
            {
                throw;
            }
            return lst;
        }
        public List<MTO.AttendanceType> GetAttendancetype()
        {
            List<MTO.AttendanceType> lst = new List<MTO.AttendanceType>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_MTO.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Code", _MTO.User_Code);
                    p.Add("@MTO_Date", _MTO.MTODate);
                    lst = connection.Query<MTO.AttendanceType>("SP_hdGetMTOAttendanceActivity", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch
            {
                throw;
            }
            return lst;
        }
        public MTO.AttendanceDraft GetMTOAttDraftDetails()
        {
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_MTO.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@MTOID", _MTO.MTO_ID);
                    var lst = connection.QueryMultiple("SP_hdGetMTOAttDraftDetails", p, commandType: CommandType.StoredProcedure);
                    MTO.AttendanceDraft Draft = new MTO.AttendanceDraft();
                    Draft.Details = lst.Read<MTO.AttendanceDetails>().ToList();
                    Draft.Header = lst.Read<MTO.AttendanceHeader>().ToList();
                    connection.Close();
                    return Draft;
                }

            }
            catch
            {
                throw;
            }

        }
        public MTO.Product GetAllProductName()
        {
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_MTO.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Code", _MTO.Region_Code);
                    p.Add("@User_Code", _MTO.User_Code);
                    var lst = connection.QueryMultiple("Sp_Hd_GetProductSampleName", p, commandType: CommandType.StoredProcedure);
                    MTO.Product Mt = new MTO.Product();
                    Mt.Prod = lst.Read<MTO.ProductName>().ToList();
                    Mt.Sample = lst.Read<MTO.SampleName>().ToList();
                    connection.Close();
                    return Mt;
                }

            }
            catch
            {
                throw;
            }
        }
        public List<MTO.AccompanistDetails> GetAccompanistDetails()
        {
            List<MTO.AccompanistDetails> lst = new List<MTO.AccompanistDetails>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_MTO.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@RegionCode", _MTO.Region_Code);
                    p.Add("@User_Code", _MTO.User_Code);
                    lst = connection.Query<MTO.AccompanistDetails>("SP_hdGetAccompanistDetailsForMTO", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch
            {
                throw;
            }
            return lst;
        }
        public int GetInsetField()
        {
            int result = 1;
            int success;
            int lst = 0;
            int CID = 0;
            List<MTO.Accompanist> Acc = JsonConvert.DeserializeObject<List<MTO.Accompanist>>(_MTO.Accompanist).ToList();
            List<MTO.MTOProduct> Salesobj = JsonConvert.DeserializeObject<List<MTO.MTOProduct>>(_MTO.ProductSale).ToList();
            List<MTO.MTOProduct> Sampleobj = JsonConvert.DeserializeObject<List<MTO.MTOProduct>>(_MTO.ProductSample).ToList();
            List<MTO.CustomerDetails> Cusheader = JsonConvert.DeserializeObject<List<MTO.CustomerDetails>>(_MTO.CustomerDetails).ToList();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_MTO.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Code", _MTO.User_Code);
                    p.Add("@Region_Code", _MTO.Region_Code);
                    p.Add("@MTODate", _MTO.MTODate);
                    p.Add("@MTOID", _MTO.MTO_ID);
                    p.Add("@Activity", 1);
                    p.Add("@StoreName", _MTO.StoreName);
                    p.Add("@InTime", null);
                    p.Add("@OutTime", _MTO.OutTime);
                    p.Add("@Status", _MTO.MTOValue);
                    p.Add("@GRemaks", _MTO.GRemaks);
                    p.Add("@Latitude", _MTO.Latitude);
                    p.Add("@Longitude", _MTO.Longitude);
                    p.Add("@Result", 0, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>("Sp_hd_InsertMTOField", p, commandType: CommandType.StoredProcedure);
                    lst = p.Get<int>("@Result");

                    if (lst != 0)
                    {
                        foreach (var sch in Acc)
                        {
                            var par = new DynamicParameters();
                            par.Add("@MTO_Id", lst);
                            par.Add("@User_Code", sch.User_Code);
                            par.Add("@User_Name", sch.User_Name);
                            par.Add("@StartTime", sch.StartTime);
                            par.Add("@EndTime", sch.EndTime);
                            success = connection.Query<int>("Sp_hd_InsertMTOAccompanist ", par, commandType: CommandType.StoredProcedure).SingleOrDefault();

                        }
                        foreach (var Sales in Salesobj)
                        {
                            var par = new DynamicParameters();
                            par.Add("@MTO_Id", lst);
                            par.Add("@Product_Code", Sales.Product_Code);
                            par.Add("@Product_Name", Sales.Product_Name);
                            par.Add("@Entity ", Sales.Entity);
                            par.Add("@Opening", Sales.Opening);
                            par.Add("@Receipt", Sales.Recepit);
                            par.Add("@Sales", Sales.Sales);
                            par.Add("@Closing ", Sales.Closing);
                            success = connection.Query<int>("Sp_hd_InsertMTOSalesProduct ", par, commandType: CommandType.StoredProcedure).SingleOrDefault();

                        }
                        foreach (var Sample in Sampleobj)
                        {
                            var par = new DynamicParameters();
                            par.Add("@MTO_Id", lst);
                            par.Add("@Product_Code", Sample.Product_Code);
                            par.Add("@Product_Name", Sample.Product_Name);
                            par.Add("@Entity ", Sample.Entity);
                            par.Add("@Opening", Sample.Opening);
                            par.Add("@Receipt", Sample.Recepit);
                            par.Add("@Sales", Sample.Sales);
                            par.Add("@Closing ", Sample.Closing);
                            success = connection.Query<int>("Sp_hd_InsertMTOSalesProduct ", par, commandType: CommandType.StoredProcedure).SingleOrDefault();

                        }
                        foreach (var Cuhead in Cusheader)
                        {
                            var par = new DynamicParameters();
                            par.Add("@MTO_Id", lst);
                            par.Add("@Customer_Name", Cuhead.Customer_Name);
                            par.Add("@Mobile_Number", Cuhead.MobileNumber);
                            par.Add("@Remark ", Cuhead.Remark);
                            par.Add("@Result", 0, DbType.Int32, ParameterDirection.Output);
                            connection.Query<int>("Sp_hd_InsertMTOCustomerHeader", par, commandType: CommandType.StoredProcedure);
                            CID = par.Get<int>("@Result");

                            if (CID != 0)
                            {
                                foreach (var CD in Cuhead.Product)
                                {
                                    var pa = new DynamicParameters();
                                    pa.Add("@Customer_Id", CID);
                                    pa.Add("@MTO_Id", lst);
                                    pa.Add("@Product_Code", CD.Product_Code);
                                    pa.Add("@Product_Name", CD.Product_Name);
                                    pa.Add("@Quantity", CD.Quantity);
                                    pa.Add("@Entity", CD.Entity);
                                    success = connection.Query<int>("Sp_hd_InsertMTOCustomerDetails ", pa, commandType: CommandType.StoredProcedure).SingleOrDefault();

                                }
                            }
                        }


                    }
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return lst;
        }

        public int GetInsetAttendance()
        {
            int success = 0;
            int lst = 0;
            List<MTO.Attendance> Att = JsonConvert.DeserializeObject<List<MTO.Attendance>>(_MTO.Attendance).ToList();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_MTO.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Code", _MTO.User_Code);
                    p.Add("@Region_Code", _MTO.Region_Code);
                    p.Add("@MTODate", _MTO.MTODate);
                    p.Add("@MTOID", _MTO.MTO_ID);
                    p.Add("@Activity", 2);
                    p.Add("@Status", _MTO.MTOValue);
                    p.Add("@GRemaks", _MTO.GRemaks);
                    p.Add("@OutTime", _MTO.OutTime);
                    p.Add("@Latitude", _MTO.Latitude);
                    p.Add("@Longitude", _MTO.Longitude);
                    p.Add("@Result", 0, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>("Sp_hd_InsertMTOAttendance", p, commandType: CommandType.StoredProcedure);
                    lst = p.Get<int>("@Result");

                    if (lst != 0)
                    {
                        foreach (var sch in Att)
                        {
                            var par = new DynamicParameters();
                            par.Add("@MTO_Id", lst);
                            par.Add("@AttendanceType", sch.AttendanceType);
                            par.Add("@AttendanceCode", sch.AttendanceCode);
                            par.Add("@FromTime", sch.FromTime);
                            par.Add("@ToTime", sch.ToTime);
                            par.Add("@Remark", sch.Remark);
                            success = connection.Query<int>("Sp_hd_InsertMTOAttendanceDetails ", par, commandType: CommandType.StoredProcedure).SingleOrDefault();

                        }
                    }
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return lst;
        }
        public int GetInsetLeave()
        {
            int success = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_MTO.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Code", _MTO.User_Code);
                    p.Add("@Region_Code", _MTO.Region_Code);
                    p.Add("@MTODate", _MTO.MTODate);
                    p.Add("@MTOID", _MTO.MTO_ID);
                    p.Add("@Activity", 3);
                    p.Add("@Status", _MTO.MTOValue);
                    p.Add("@Reason", _MTO.Reason);
                    p.Add("@LeaveCode", _MTO.LeaveCode);
                    p.Add("@Result", 0, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>("Sp_hd_InsertMTOLeave", p, commandType: CommandType.StoredProcedure);
                    success = p.Get<int>("@Result");
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return success;
        }
        public List<MTO.TdDate> GettodayDate()
        {
            List<MTO.TdDate> lst = new List<MTO.TdDate>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_MTO.subDomainName))
                {
                    lst = connection.Query<MTO.TdDate>("Sp_hd_CPD_GetTodayDate", null, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                    return lst;
                }

            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public int GetUserStatus(string subDomainName, int CompanyId, string Usercode)
        {
            int result = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_MTO.subDomainName))
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
                
        public MTO.LeaveDays fngetWeekEndAndHoliday()
        {
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_MTO.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@RegionCode", _MTO.Region_Code);
                    p.Add("@UserCode", _MTO.User_Code);
                    p.Add("@StartDate", _MTO.StartDate);
                    p.Add("@EndDate", _MTO.EndDate);
                    var lst = connection.QueryMultiple("Sp_hd_GetMTOWeekEndAndHoliday", p, commandType: CommandType.StoredProcedure);
                    MTO.LeaveDays Mt = new MTO.LeaveDays();
                    Mt.WeekEnd = lst.Read<MTO.WeekEnd>().ToList();
                    Mt.Holiday = lst.Read<MTO.Holiday>().ToList();
                    Mt.Activity = lst.Read<MTO.MTOActivity>().ToList();
                    connection.Close();
                    return Mt;
                }

            }
            catch
            {
                throw;
            }

        }
        public int GetMTOPunchTime()
        {
            int lst = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_MTO.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Code", _MTO.User_Code);
                    p.Add("@Region_Code", _MTO.Region_Code);
                    p.Add("@MTODate", _MTO.MTODate);
                    p.Add("@MTOID", _MTO.MTO_ID);
                    p.Add("@Activity", _MTO.Activity);
                    p.Add("@StoreName", _MTO.StoreName);
                    p.Add("@InTime", _MTO.InTime);
                    p.Add("@OutTime", _MTO.OutTime);
                    p.Add("@Status", 0);
                    p.Add("@GRemaks", null);
                    p.Add("@Latitude", _MTO.Latitude);
                    p.Add("@Longitude", _MTO.Longitude);
                    p.Add("@Result", 0, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>("Sp_hd_InsertMTOField", p, commandType: CommandType.StoredProcedure);
                    lst = p.Get<int>("@Result");
                    return lst;
                }
            }
            catch(Exception ex)
            {
                throw;
            }
        }
        public MTO.FieldDraft GetMTOFieldDraftDetails()
        {
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_MTO.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@MTOID", _MTO.MTO_ID);
                    var lst = connection.QueryMultiple("SP_hdGetMTOFieldDraftDetails", p, commandType: CommandType.StoredProcedure);
                    MTO.FieldDraft Draft = new MTO.FieldDraft();
                    Draft.header = lst.Read<MTO.FieldHeader>().ToList();
                    Draft.FieldAcc = lst.Read<MTO.FieldAccompanist>().ToList();
                    Draft.SS = lst.Read<MTO.SalesAndSample>().ToList();
                    Draft.CusHeader = lst.Read<MTO.CustomerHeader>().ToList();
                    Draft.CusDetails = lst.Read<MTO.FieldCustomer>().ToList();
                    connection.Close();
                    return Draft;
                }

            }
            catch
            {
                throw;
            }

        }

        public List<MTO.AccompanistDetails> GetUserDetails()
        {
            List<MTO.AccompanistDetails> lst = new List<MTO.AccompanistDetails>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_MTO.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Code", _MTO.User_Code);
                    lst = connection.Query<MTO.AccompanistDetails>("SP_Hd_GetMTOUserDetails", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return lst;
        }
        public List<MTO.MTODate> GetUserMtoDates()
        {
            List<MTO.MTODate> lstDates = new List<MTO.MTODate>();
            try {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_MTO.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Code", _MTO.User_Code);
                    lstDates = connection.Query<MTO.MTODate>("SP_hd_GetUserMtoDates", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch
            {
                throw;
            }
            return lstDates;
        }
        public MTO.MTODetails GetUserMtoDetails()
        {
            try {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_MTO.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@MTO_ID", _MTO.MTO_ID);
                    var lstData = connection.QueryMultiple("SP_hd_GetUserMtoDetails", p, commandTimeout: 300, commandType: CommandType.StoredProcedure);
                    MTO.MTODetails MtDetails = new MTO.MTODetails();
                    MtDetails.Header = lstData.Read<MTO.Header>().ToList();
                    MtDetails.AccompanistList = lstData.Read<MTO.AccompanistList>().ToList();
                    MtDetails.SalesAndSamples = lstData.Read<MTO.SalesAndSamples>().ToList();
                    MtDetails.CustomerHeader = lstData.Read<MTO.CusHeader>().ToList();
                    MtDetails.CustomerProductInfo = lstData.Read<MTO.CustomerProductInfo>().ToList();
                    MtDetails.AttendanceDetail = lstData.Read<MTO.AttendanceDetail>().ToList();
                    MtDetails.FileDetail = lstData.Read<MTO.MTOFile>().ToList();
                    connection.Close();
                    return MtDetails;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public List<MTO.Count> GetChildcount()
        {
            List<MTO.Count> lstDates = new List<MTO.Count>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_MTO.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Code", _MTO.User_Code);
                    lstDates = connection.Query<MTO.Count>("SP_hd_GetChildUserCount", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch
            {
                throw;
            }
            return lstDates;
        }
        public List<MTO.AccompanistDetails> GetDelUserDetails()
        {
            List<MTO.AccompanistDetails> lst = new List<MTO.AccompanistDetails>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_MTO.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Code", _MTO.User_Code);
                    lst = connection.Query<MTO.AccompanistDetails>("SP_Hd_GetMTODelUserDetails", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return lst;
        }
        public int DeleteMTORecord()
        {
            int success = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_MTO.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Code", _MTO.User_Code);
                    p.Add("@MTOID", _MTO.MTO_ID);
                    p.Add("@Type", _MTO.Type);
                    p.Add("@Result", 0, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>("Sp_hd_MTO_Deleterecord", p, commandType: CommandType.StoredProcedure);
                    success = p.Get<int>("@Result");
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return success;
        }
        public List<MTO.MTODate> GetDelUserMTODates()
        {
            List<MTO.MTODate> lstDates = new List<MTO.MTODate>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_MTO.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Code", _MTO.User_Code);
                    p.Add("@Fromdate", _MTO.FDate);
                    p.Add("@Todate", _MTO.TDate);
                    lstDates = connection.Query<MTO.MTODate>("SP_hd_GetDelUserMTODates", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstDates;
        }
        public List<MTO.CompanyCredential> GetCompanyCode()
        {
            List<MTO.CompanyCredential> lstDates = new List<MTO.CompanyCredential>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_MTO.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyId", _MTO.CompanyId);
                    lstDates = connection.Query<MTO.CompanyCredential>("SP_hd_GetCompanyCode", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstDates;
        }
        public int InsertFileDetails()
        {
            int success = -1;
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_MTO.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Code", _MTO.User_Code);
                    p.Add("@MtoId", _MTO.MTO_ID);
                    p.Add("@Filename", _MTO.File_Name);
                    p.Add("@Filepath", _MTO.File_Path);
                    p.Add("@Result", 0, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>("Sp_hd_MTO_InsertFileDetails", p, commandType: CommandType.StoredProcedure);
                    success = p.Get<int>("@Result");
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return success;
        }
        public List<MTO.MTOFile> GetMtoAttachment()
        {
            List<MTO.MTOFile> lstFiles = new List<MTO.MTOFile>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_MTO.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@MTO_ID", _MTO.MTO_ID);
                    lstFiles = connection.Query<MTO.MTOFile>("SP_hd_GetMtoAttachments", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch
            {
                throw;
            }
            return lstFiles;
        }
        public List<MTO.AccompanistDetails> GetUserTrackDetails()
        {
            List<MTO.AccompanistDetails> lst = new List<MTO.AccompanistDetails>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_MTO.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Code", _MTO.User_Code);
                    lst = connection.Query<MTO.AccompanistDetails>("SP_Hd_GetUserTrackDetails", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return lst;
        }
        public List<MTO.LocationDetails> GetUserLatLong()
        {
            List<MTO.LocationDetails> lst = new List<MTO.LocationDetails>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_MTO.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Code", _MTO.User_Code);
                    p.Add("@Fromdate", _MTO.FDate);
                    lst = connection.Query<MTO.LocationDetails>("SP_Hd_GetUserLocDetails", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return lst;
        }
    }
}
