using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using Dapper;
using MVCModels;
using Newtonsoft.Json;
using static MVCModels.Batch;

namespace DataControl.HiDoctor_ActivityFactoryClasses
{
    public class DAL_Batch : DapperRepository
    {
        SPData _objSPData = new SPData();
        public Batch.BatchData _batch;
        private Data _objData = new Data();
        private SPData _ObjSPData = new SPData();
        public DAL_Batch()
        {
            _batch = new Batch.BatchData();
        }
        public List<Batch.BatchDetails> GetBatchDetails()
        {
            List<Batch.BatchDetails> lst = new List<Batch.BatchDetails>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_batch.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Status", _batch.status);
                    p.Add("@Region_Code", _batch.Region_Code);
                    p.Add("@CustomerCode", _batch.CustomerCode);
                    lst = connection.Query<Batch.BatchDetails>("Sp_hd_GetBatchsDetails", p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch
            {
                throw;
            }
            return lst;
        }
        public List<Batch.CustomerName> GetDoctorName()
        {
            List<Batch.CustomerName> lst = new List<Batch.CustomerName>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_batch.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Code", _batch.Region_Code);
                    lst = connection.Query<Batch.CustomerName>("Sp_Hd_GetCustomerName", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch
            {
                throw;
            }
            return lst;
        }
        public List<Batch.ProductName> GetAllProductName()
        {
            List<Batch.ProductName> lst = new List<Batch.ProductName>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_batch.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Code", _batch.Region_Code);
                    lst = connection.Query<Batch.ProductName>("Sp_Hd_GetProductName", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch
            {
                throw;
            }
            return lst;
        }
        public List<Batch.RegionName> GetAllRegionName()
        {
            List<Batch.RegionName> lst = new List<Batch.RegionName>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_batch.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Code", _batch.Region_Code);
                    lst = connection.Query<Batch.RegionName>("Sp_Hd_GetBatchRegionName", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch
            {
                throw;
            }
            return lst;
        }
        public int GetSaveBatchDetalis()
        {
            int result;
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_batch.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Code", _batch.Region_Code);
                    p.Add("@User_Code", _batch.User_Code);
                    p.Add("@CustomerRegion_Code", _batch.Customer_RegionCode);
                    p.Add("@CustomerCode", _batch.CustomerCode);
                    p.Add("@CustomerName", _batch.CustomerName);
                    p.Add("@BatchName", _batch.BatchName);
                    p.Add("@NoOfChicks", _batch.NoOfChicks);
                    p.Add("@StartDate", _batch.StartDate);
                    p.Add("@EndDate", _batch.EndDate);
                    p.Add("@Status", _batch.status);
                    result = connection.Query<int>("Sp_Insert_BatchCreation", p, commandType: CommandType.StoredProcedure).SingleOrDefault();
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return result;
        }
        public int GetUpDateBatchDetalis()
        {
            int result;
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_batch.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Code", _batch.Region_Code);
                    p.Add("@User_Code", _batch.User_Code);
                    p.Add("@CustomerRegion_Code", _batch.Customer_RegionCode);
                    p.Add("@CustomerCode", _batch.CustomerCode);
                    p.Add("@CustomerName", _batch.CustomerName);
                    p.Add("@Batch_ID", _batch.Batch_Id);
                    p.Add("@BatchName", _batch.BatchName);
                    p.Add("@NoOfChicks", _batch.NoOfChicks);
                    p.Add("@StartDate", _batch.StartDate);
                    p.Add("@EndDate", _batch.EndDate);
                    p.Add("@Status", _batch.status);
                    result = connection.Query<int>("Sp_UpDate_BatchCreation", p, commandType: CommandType.StoredProcedure).SingleOrDefault();
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return result;
        }
        public int GetInsertSchedule()
        {
            int result = 1;
            int success;
            int lst = 0;
            List<Batch.Product> obj = JsonConvert.DeserializeObject<List<Batch.Product>>(_batch.Product).ToList();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_batch.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Code", _batch.User_Code);
                    p.Add("@ScheduleName", _batch.ScheduleName);
                    p.Add("@StartDate", _batch.StartDate);
                    p.Add("@EndDate", _batch.EndDate);
                    p.Add("@Notes", _batch.Notes);
                    p.Add("@NumofWeeks", _batch.NumofWeeks);
                    p.Add("@Batch_Id", _batch.Batch_Id);
                    p.Add("@Result", 0, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>("Sp_hd_InsertSchedule", p, commandType: CommandType.StoredProcedure);
                    lst = p.Get<int>("@Result");

                    if (lst != 0)
                    {
                        foreach (var sch in obj)
                        {
                            var par = new DynamicParameters();
                            par.Add("@User_Code", _batch.User_Code);
                            par.Add("@Batch_Id", _batch.Batch_Id);
                            par.Add("@Schedule_Id", lst);
                            par.Add("@Product_Code", sch.ProductCode);
                            par.Add("@ProductName", sch.ProductName);
                            par.Add("@dose", sch.dose);
                            success = connection.Query<int>("Sp_hd_InsertProductForSchedule ", par, commandType: CommandType.StoredProcedure).SingleOrDefault();

                        }
                    }
                    else if (lst == 0)
                    {
                        result = 100;
                    }
                    else
                    {
                        result = 0;
                    }


                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return result;
        }
        public int GetUpdateSchedule()
        {
            int result = 1;
            int success;
            List<Batch.Schedule> lst = new List<Batch.Schedule>();
            List<Batch.Product> obj = JsonConvert.DeserializeObject<List<Batch.Product>>(_batch.Product).ToList();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_batch.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Code", _batch.User_Code);
                    p.Add("@ScheduleName", _batch.ScheduleName);
                    p.Add("@StartDate", _batch.StartDate);
                    p.Add("@EndDate", _batch.EndDate);
                    p.Add("@Notes", _batch.Notes);
                    p.Add("@NumofWeeks", _batch.NumofWeeks);
                    p.Add("@Batch_Id", _batch.Batch_Id);
                    p.Add("@Schedule_Id", _batch.Schedule_Id);
                    result = connection.Query<int>("Sp_hd_UpdateSchedule", p, commandType: CommandType.StoredProcedure).SingleOrDefault();

                    if (result != 0 && result != 100)
                    {
                        foreach (var sch in obj)
                        {
                            var par = new DynamicParameters();
                            par.Add("@User_Code", _batch.User_Code);
                            par.Add("@Batch_Id", _batch.Batch_Id);
                            par.Add("@Schedule_Id", _batch.Schedule_Id);
                            par.Add("@Product_Code", sch.ProductCode);
                            par.Add("@ProductName", sch.ProductName);
                            par.Add("@dose", sch.dose);
                            success = connection.Query<int>("Sp_hd_UpdateProductForSchedule ", par, commandType: CommandType.StoredProcedure).SingleOrDefault();

                        }
                    }
                    else if (result == 100)
                    {
                        result = 100;
                    }
                    else
                    {
                        result = 0;
                    }


                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return result;
        }
        public Batch.ScheduleDetails GetScheduledetails()
        {

            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_batch.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Batch_Id", _batch.Batch_Id);
                    var lst = connection.QueryMultiple("Sp_hd_GetScheduleDetails", p, commandType: CommandType.StoredProcedure);
                    Batch.ScheduleDetails batch = new Batch.ScheduleDetails();
                    batch.Schedule = lst.Read<Batch.BatchSchedule>().ToList();
                    batch.Product = lst.Read<Batch.ProductSchedule>().ToList();
                    connection.Close();
                    return batch;
                }
            }
            catch
            {
                throw;
            }

        }
        public int GetDeleteSchedule(int Schedule_Id, string subDomainName)
        {
            int result = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Schedule_Id", Schedule_Id);
                    result = connection.Query<int>("Sp_hd_DeleteSchedule", p, commandType: CommandType.StoredProcedure).SingleOrDefault();
                }
            }
            catch
            {
                throw;
            }
            return result;
        }
        public int GetInsertQuantity()
        {
            int result = 1;

            List<Batch.ProductQuantity> obj = JsonConvert.DeserializeObject<List<Batch.ProductQuantity>>(_batch.Product).ToList();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_batch.subDomainName))
                {

                    foreach (var sch in obj)
                    {
                        var par = new DynamicParameters();
                        par.Add("@User_Code", _batch.User_Code);
                        par.Add("@Batch_Id", sch.Batch_Id);
                        par.Add("@Schedule_Id", sch.Schedule_Id);
                        par.Add("@Product_Id", sch.ProductID);
                        par.Add("@Quantity", sch.Quantity);
                        par.Add("@Date", sch.Date);
                        par.Add("@Remark", sch.Remark);
                        result = connection.Query<int>("Sp_hd_InsertBatchProductQuantity", par, commandType: CommandType.StoredProcedure).SingleOrDefault();

                    }

                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return result;
        }

        public List<Batch.Information> GetInformation(string Product_Id, string Batch_Id, string Schedule_Id, string subDomainName)
        {
            List<Batch.Information> lst = new List<Batch.Information>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Product_Id", Product_Id);
                    p.Add("@Batch_Id", Batch_Id);
                    p.Add("@Schedule_Id", Schedule_Id);
                    lst = connection.Query<Batch.Information>("Sp_Hd_GetBatchProductInformation", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch
            {
                throw;
            }
            return lst;
        }
        public int GetChangeScheduleStatus(int Status, int Schedule_Id, string User_Code, string Remark, string subDomainName)
        {
            int result = 1;
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(subDomainName))
                {
                    var par = new DynamicParameters();
                    par.Add("@Schedule_Id", Schedule_Id);
                    par.Add("@Status", Status);
                    par.Add("@User_Code", User_Code);
                    par.Add("@Remark", Remark);
                    result = connection.Query<int>("Sp_hd_ChangeScheduleStatus", par, commandType: CommandType.StoredProcedure).SingleOrDefault();



                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return result;
        }
        public int GetScheduleStatus(int Schedule_Id, string subDomainName)
        {
            int result = 1;
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(subDomainName))
                {
                    var par = new DynamicParameters();
                    par.Add("@Schedule_Id", Schedule_Id);
                    result = connection.Query<int>("Sp_hd_ScheduleStatusCheck", par, commandType: CommandType.StoredProcedure).SingleOrDefault();
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return result;
        }

        public List<Batch.CustomerDetails> GetCustomerDetails(string RegionCode, string subDomainName, string Value, string SDate, string doctoMasterFrom, int month, int year)
        {
            List<Batch.CustomerDetails> lst = new List<Batch.CustomerDetails>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@RegionCode", RegionCode);
                    p.Add("@Value", Value);
                    p.Add("@Date", SDate);
                    p.Add("@DoctorMasterFrom", doctoMasterFrom);
                    p.Add("@Month", month);
                    p.Add("@Year", year);
                    lst = connection.Query<Batch.CustomerDetails>("Sp_hd_GetCustomerDetails", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lst;
        }
        public List<Batch.State> GetStateName(string subDomainName)
        {
            List<Batch.State> lst = new List<Batch.State>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(subDomainName))
                {
                    var p = new DynamicParameters();
                    lst = connection.Query<Batch.State>("Sp_hd_GetStateCityName", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();

                }
            }
            catch
            {
                throw;
            }
            return lst;
        }
        public List<Batch.City> GetCityName(string subDomainName, string StateID)
        {
            List<Batch.City> lst = new List<Batch.City>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@StateID", StateID);
                    lst = connection.Query<Batch.City>("Sp_hd_GetCityName", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();

                }
            }
            catch
            {
                throw;
            }
            return lst;
        }
        public List<Batch.HospitalDetails> GetHospitalName(string subDomainName, int StateID, int CityID)
        {
            List<Batch.HospitalDetails> lst = new List<Batch.HospitalDetails>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@StateID", StateID);
                    p.Add("@CityID", CityID);
                    lst = connection.Query<Batch.HospitalDetails>("Sp_hd_GetHospitalName", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch
            {
                throw;
            }
            return lst;
        }
        public List<Batch.HSProductName> GetAllProductSales()
        {
            List<Batch.HSProductName> lst = new List<Batch.HSProductName>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_batch.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Code", _batch.Region_Code);
                    //p.Add("@TypeOfMapping", _batch.TypeOfMapping);
                    lst = connection.Query<Batch.HSProductName>("Sp_hd_GetSalesProductName", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch
            {
                throw;
            }
            return lst;
        }
        //public int GetSaveSalesMonth()
        //{
        //    int result;
        //    try
        //    {
        //        using (IDbConnection connection = IDbOpenConnectionCompanyWise(_batch.subDomainName))
        //        {
        //            var p = new DynamicParameters();
        //            p.Add("@Region_Code", _batch.Region_Code);
        //            p.Add("@EntityCode", _batch.EntityCode);
        //            p.Add("@Entity", _batch.Entity);
        //            p.Add("@Month", _batch.Month);
        //            p.Add("@Year", _batch.Year);
        //            p.Add("@Date", _batch.Date);
        //            p.Add("@CompanyId", _batch.CompanyId);
        //            p.Add("@UserCode", _batch.User_Code);
        //            p.Add("@EntityName", _batch.EntityName);
        //            p.Add("@Result", 0, DbType.Int32, ParameterDirection.Output);
        //            connection.Query<int>("Sp_hd_EntitySaveMonthWise", p, commandType: CommandType.StoredProcedure);
        //            result = p.Get<int>("@Result");
        //           // result = connection.Query<int>("Sp_hd_EntitySaveMonthWise", p, commandType: CommandType.StoredProcedure).SingleOrDefault();
        //            connection.Close();
        //        }
        //    }
        //    catch
        //    {
        //        throw;
        //    }
        //    return result;
        //}
        //public int GetUpdateSalesMonth()
        //{
        //    int result;
        //    try
        //    {
        //        using (IDbConnection connection = IDbOpenConnectionCompanyWise(_batch.subDomainName))
        //        {
        //            var p = new DynamicParameters();
        //            p.Add("@Region_Code", _batch.Region_Code);
        //            p.Add("@EntityCode", _batch.EntityCode);
        //            p.Add("@Entity", _batch.Entity);
        //            p.Add("@Month", _batch.Month);
        //            p.Add("@Year", _batch.Year);
        //            p.Add("@Date", _batch.Date);
        //            p.Add("@CompanyId", _batch.CompanyId);
        //            p.Add("@UserCode", _batch.User_Code);
        //            p.Add("@EntityName", _batch.EntityName);
        //            p.Add("@Sales_Id", _batch.Sales_Id);
        //           result = connection.Query<int>("Sp_hd_EntityUpdateMonthWise", p, commandType: CommandType.StoredProcedure).SingleOrDefault();
        //            connection.Close();
        //        }
        //    }
        //    catch
        //    {
        //        throw;
        //    }
        //    return result;
        //}
        public List<Batch.SalesDetails> GetAllSalesDetails()
        {
            List<Batch.SalesDetails> lst = new List<Batch.SalesDetails>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_batch.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Code", _batch.Region_Code);
                    p.Add("@Entity_Type", _batch.Entity_Type);
                    lst = connection.Query<Batch.SalesDetails>("Sp_hd_GetAllEntitySalesDetails", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch (Exception ex)
            {
                throw;
            }
            return lst;
        }
        public List<Batch.ProductDeatils> GetAllEntityProduct()
        {
            List<Batch.ProductDeatils> lst = new List<Batch.ProductDeatils>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_batch.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Code", _batch.Region_Code);
                    lst = connection.Query<Batch.ProductDeatils>("Sp_hd_GetAllEntityProductDetails", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch
            {
                throw;
            }
            return lst;
        }
        public int GetInsertProductSales(DataTable dtTable)
        {
            int result = 1;
            int save = 0;
            //List<Batch.ProductInsert> obj = JsonConvert.DeserializeObject<List<Batch.ProductInsert>>(_batch.Product).ToList();
            try
            {

                string cmdTxt = "SP_HD_EntitySalesInsert";
                SqlCommand command = new SqlCommand(cmdTxt);
                command.CommandType = CommandType.StoredProcedure;
                //var p = new DynamicParameters();
                _objSPData.AddParamToSqlCommand(command, "@Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, _batch.Region_Code);
                _objSPData.AddParamToSqlCommand(command, "@EntityCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _batch.EntityCode);
                _objSPData.AddParamToSqlCommand(command, "@Entity", ParameterDirection.Input, SqlDbType.VarChar, 30, _batch.Entity);
                _objSPData.AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.Int, 8, _batch.Month);
                _objSPData.AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.Int, 8, _batch.Year);
                _objSPData.AddParamToSqlCommand(command, "@Date", ParameterDirection.Input, SqlDbType.DateTime, 30, _batch.Date);
                _objSPData.AddParamToSqlCommand(command, "@CompanyId", ParameterDirection.Input, SqlDbType.Int, 8, _batch.CompanyId);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _batch.User_Code);
                _objSPData.AddParamToSqlCommand(command, "@EntityName", ParameterDirection.Input, SqlDbType.VarChar, 30, _batch.EntityName);
                _objSPData.AddParamToSqlCommand(command, "@TypeOfMapping", ParameterDirection.Input, SqlDbType.VarChar, 30, _batch.TypeOfMapping);
                _objSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.Int, 8, "");
                if (dtTable != null)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Entity_Insert_Products", ParameterDirection.Input, SqlDbType.Structured, dtTable, "TVP_Entity_Insert_Products");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Entity_Insert_Products", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_Entity_Insert_Products");
                }
                //_objData.OpenConnection();
                _objData.ExecuteNonQuery(command, _batch.subDomainName);
                result = Convert.ToInt32(command.Parameters["@Result"].Value);
                //if (save != 0)
                //{
                //    foreach (var sch in obj)
                //    {

                //        var par = new DynamicParameters();
                //        par.Add("@Company_Id", _batch.CompanyId);
                //        par.Add("@User_Code", _batch.User_Code);
                //        par.Add("@Product_Code", sch.Product_Code);
                //        par.Add("@Product_Name", sch.Product_Name);
                //        par.Add("@Units", sch.Units);
                //        par.Add("@Closing", sch.Closing);
                //        par.Add("@Sales_Id", save);
                //        par.Add("@Transit", sch.Transit);
                //        result = connection.Query<int>("Sp_hd_InsertEntitysalesProduct", par, commandType: CommandType.StoredProcedure).SingleOrDefault();

                //    }
                //}
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }
        public int GetUpdateProductSales(DataTable dtTable)
        {
            int result = 1;
            int save = 0;
            //List<Batch.ProductInsert> obj = JsonConvert.DeserializeObject<List<Batch.ProductInsert>>(_batch.Product).ToList();
            try
            {
                string cmdTxt = "SP_HD_EntitySales_Update";
                SqlCommand command = new SqlCommand(cmdTxt);
                command.CommandType = CommandType.StoredProcedure;
                //var p = new DynamicParameters();
                _objSPData.AddParamToSqlCommand(command, "@Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, _batch.Region_Code);
                _objSPData.AddParamToSqlCommand(command, "@EntityCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _batch.EntityCode);
                _objSPData.AddParamToSqlCommand(command, "@Entity", ParameterDirection.Input, SqlDbType.VarChar, 30, _batch.Entity);
                _objSPData.AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.Int, 8, _batch.Month);
                _objSPData.AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.Int, 8, _batch.Year);
                _objSPData.AddParamToSqlCommand(command, "@Date", ParameterDirection.Input, SqlDbType.DateTime, 30, _batch.Date);
                _objSPData.AddParamToSqlCommand(command, "@CompanyId", ParameterDirection.Input, SqlDbType.Int, 8, _batch.CompanyId);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, _batch.User_Code);
                _objSPData.AddParamToSqlCommand(command, "@EntityName", ParameterDirection.Input, SqlDbType.VarChar, 30, _batch.EntityName);
                _objSPData.AddParamToSqlCommand(command, "@TypeOfMapping", ParameterDirection.Input, SqlDbType.VarChar, 30, _batch.TypeOfMapping);
                _objSPData.AddParamToSqlCommand(command, "@Sales_Id", ParameterDirection.Input, SqlDbType.Int, 8, _batch.Sales_Id);
                _objSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.Int, 8, "");
                if (dtTable != null)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Entity_Insert_Products", ParameterDirection.Input, SqlDbType.Structured, dtTable, "TVP_Entity_Insert_Products");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Entity_Insert_Products", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_Entity_Insert_Products");
                }
                //_objData.OpenConnection();
                _objData.ExecuteNonQuery(command, _batch.subDomainName);
                result = Convert.ToInt32(command.Parameters["@Result"].Value);

            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }
        public Batch.EntityDetails GetAllEntityDetails()
        {

            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_batch.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Code", _batch.Region_Code);
                    p.Add("@EntityCode", _batch.EntityCode);
                    p.Add("@Entity", _batch.Entity);
                    p.Add("@Month", _batch.Month);
                    p.Add("@Year", _batch.Year);
                    var lst = connection.QueryMultiple("Sp_hd_GetAllEntityDetails", p, commandType: CommandType.StoredProcedure);
                    Batch.EntityDetails Sdetails = new Batch.EntityDetails();
                    Sdetails.Sales = lst.Read<Batch.SalesDetails>().ToList();
                    Sdetails.Release = lst.Read<Batch.ReleaseDetails>().ToList();
                    connection.Close();
                    return Sdetails;
                }

            }
            catch
            {
                throw;
            }

        }
        public int GetEntityStatusChange()
        {
            int result = 1;
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_batch.subDomainName))
                {
                    var par = new DynamicParameters();
                    par.Add("@User_Code", _batch.User_Code);
                    par.Add("@Sales_Id", _batch.Sales_Id);
                    par.Add("@Remark", _batch.Remark);
                    result = connection.Query<int>("Sp_hd_EntityStatusChange", par, commandType: CommandType.StoredProcedure).SingleOrDefault();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        public int GetMultipleEntityStatusChange(DataTable dtTable)
        {
            int rowsAffected = 0;

            try
            {
                string cmdTxt = "Sp_hd_EntityStatusMultipleChange";
                SqlCommand command = new SqlCommand(cmdTxt);
                command.CommandType = CommandType.StoredProcedure;
                //   _objSPData.AddParamToSqlCommand(command, "@value", ParameterDirection.Input, SqlDbType.VarChar, 10, value);
                if (dtTable != null)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Entity_Sales", ParameterDirection.Input, SqlDbType.Structured, dtTable, "TVP_Entity_Sales");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Entity_Sales", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_Entity_Sales");
                }
                _objData.OpenConnection();
                _objData.ExecuteNonQuery(command, _batch.subDomainName);
                rowsAffected = 1;
                //connection.Close();

            }
            catch (Exception ex)
            {
                throw;
            }
            return rowsAffected;
        }



        public string GetEntitySalesMob()
        {
            string result = "";
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_batch.subDomainName))
                {
                    var par = new DynamicParameters();
                    par.Add("@User_Code", _batch.User_Code);
                    par.Add("@Default_Value", _batch.default_value);
                    par.Add("@Privilege_Name", _batch.privilege_Name);
                    result = connection.Query<string>("Sp_Hd_Get_ENTITY_Sales_Privilage", par, commandType: CommandType.StoredProcedure).SingleOrDefault();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }
        public List<ProductDeatils> GetAlreadyMappedData(string entityType, int month, int year, string selectedMappingCode, string mappingType,string subDomainName)
        {
            List<ProductDeatils> lstEnteredData = new List<ProductDeatils>();
            try
            {
                using (IDbConnection conn = IDbOpenConnectionCompanyWise(subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Month", month);
                    p.Add("@Year", year);
                    p.Add("@EntityType", entityType);
                    p.Add("@SelectedMappingCode", selectedMappingCode);
                    p.Add("@MappingType", mappingType);
                    lstEnteredData = conn.Query<ProductDeatils>("SP_HD_EntitySalesEnteredDatePrefill", p, commandType: CommandType.StoredProcedure).ToList();
                    conn.Close();
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return lstEnteredData;
        }
        public bool UpdateStatusofDraft(string regionCode, int salesId, string subDomainName)
        {
            bool result = false;
            string response = "";
            try
            {
                using (IDbConnection conn = IDbOpenConnectionCompanyWise(subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Regioncode", regionCode);
                    p.Add("@salesId", salesId);
                    p.Add("@Subdomain", subDomainName);
                    p.Add("@Results", "", DbType.String, ParameterDirection.Output);
                    conn.Execute("SP_HD_EntitySales_UpdateAllDraftRecords", p, commandType: CommandType.StoredProcedure);
                    response = p.Get<string>("@Results");
                    if (!(response.Contains("INFO")))
                    {
                        if (Convert.ToInt16(response) > 0)
                        {
                            result = true;
                        }

                    }
                    else
                    {
                        result = false;
                    }

                }

            }
            catch (Exception ex)
            {

                throw;
            }
            return result;
        }


        public List<ConfigDetails> GetConfigMaster(string Config_Key, string Possible_Values, string Config_Value, string Type, string companycode, string subdomain)
        {
            List<ConfigDetails> lstconfig = new List<ConfigDetails>();
            try
            {
                using (IDbConnection conn = IDbOpenConnectionCompanyWise(subdomain))
                {
                    var p = new DynamicParameters();
                    p.Add("@Config_Key", Config_Key);
                    p.Add("@Possible_Values", Possible_Values);
                    p.Add("@Config_Value", Config_Value);
                    p.Add("@Type", Type);
                    p.Add("@companycode", companycode);
                    p.Add("@subdomain", subdomain);
                    lstconfig = conn.Query<ConfigDetails>("SP_HD_EntitySalesConfig", p, commandType: CommandType.StoredProcedure).ToList();
                    conn.Close();
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return lstconfig;
        }
    }
}
