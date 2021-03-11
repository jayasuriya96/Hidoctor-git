using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MVCModels;
using Dapper;
using Newtonsoft.Json;
using System.Data;
using System.Reflection;
using System.IO;
using static MVCModels.OrderFulfillment;

namespace DataControl.HiDoctor_ActivityFactoryClasses
{

  public   class DAL_OrderFulfillment: DapperRepository
    {
        public OrderFulfillment.Order _Order;
        public DAL_OrderFulfillment()
        {
            _Order = new OrderFulfillment.Order();
        }
        public List<OrderFulfillment.RegionModel> GetAllRegionName()
        {
            List<OrderFulfillment.RegionModel> lst = new List<OrderFulfillment.RegionModel>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_Order.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", _Order.CompanyCode);
                    p.Add("@RegionCode", _Order.Region_Code);
                    lst = connection.Query<OrderFulfillment.RegionModel>("SP_HD_CME_GETREGIONDETAILS", p, commandType: CommandType.StoredProcedure).ToList();
                }
                return lst;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<OrderFulfillment.RegionWiseStockiest> GetRegionWiseStockiest()
        {
            List<OrderFulfillment.RegionWiseStockiest> lst = new List<OrderFulfillment.RegionWiseStockiest>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_Order.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Code", _Order.Region_Code);
                    p.Add("@Order_Date", _Order.Order_Date);
                    p.Add("@Entity", _Order.Entity);
                    lst = connection.Query<OrderFulfillment.RegionWiseStockiest>("sp_OD_GetUserWiseStockiest", p, commandType: CommandType.StoredProcedure).ToList();
                }
                return lst;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public OrderFulfillment.POBOrder GetOrderMaintenance()
        {
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_Order.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Code", _Order.Region_Code);
                    var lst = connection.QueryMultiple("Sp_OD_POBOrder_Maintenance", p, commandType: CommandType.StoredProcedure);
                    OrderFulfillment.POBOrder Order = new OrderFulfillment.POBOrder();
                    Order.lstOrder = lst.Read<OrderFulfillment.OrderMaintenance>().ToList();
                    Order.lstDetails = lst.Read<OrderFulfillment.OrderPOBDetails>().ToList();
                    connection.Close();
                    return Order;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
           
        }
        public List<OrderFulfillment.OrderProduct> GetProductDetails()
        {
            List<OrderFulfillment.OrderProduct> lst = new List<OrderFulfillment.OrderProduct>();

            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_Order.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Order_Id", _Order.Order_Id);
                    lst = connection.Query<OrderFulfillment.OrderProduct>("Sp_OD_POBProduct_Details", p, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lst;
        }
        public int InsertMaintaningOrder()
        {
           int result = 0;

            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_Order.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Id", _Order.Company_Id);
                    p.Add("@User_Code", _Order.User_Code);
                    p.Add("@Region_Code", _Order.Region_Code);
                    p.Add("@OrderRegion", _Order.OrderRegion);
                    p.Add("@Order_Id", _Order.Order_Id);
                    p.Add("@Stockiest_Code", _Order.Stockiest_Code);
                    p.Add("@Stockiest_Name", _Order.Stockiest_Name);
                    p.Add("@Remarks", _Order.Remarks);
                    p.Add("@Status", _Order.Status);
                    p.Add("@Result", 0, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>("Sp_OD_InsertMaintaningOrder", p, commandType: CommandType.StoredProcedure);
                    result = p.Get<int>("@Result");
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }
        public int UpdatePratialProduct(List<OrderFulfillment.OrderCancelProduct> obj,string subDomainName)
        {
            int row = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(subDomainName))
                {

                    row = connection.Execute("sp_OD_UpdatePratialCancelProduct", new { Tvptable = ToDataTable(obj) }, commandType: CommandType.StoredProcedure);
                    connection.Close();
               
                }
                return row;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public static DataTable ToDataTable<T>(List<T> items)
        {
            DataTable dataTable = new DataTable(typeof(T).Name);

            //Get all the properties
            PropertyInfo[] Props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
            foreach (PropertyInfo prop in Props)
            {
                //Defining type of data column gives proper data table 
                var type = (prop.PropertyType.IsGenericType && prop.PropertyType.GetGenericTypeDefinition() == typeof(Nullable<>) ? Nullable.GetUnderlyingType(prop.PropertyType) : prop.PropertyType);
                //Setting column names as Property names
                dataTable.Columns.Add(prop.Name, type);
            }
            foreach (T item in items)
            {
                var values = new object[Props.Length];
                for (int i = 0; i < Props.Length; i++)
                {
                    //inserting property values to datatable rows
                    values[i] = Props[i].GetValue(item, null);
                }
                dataTable.Rows.Add(values);
            }
            //put a breakpoint here and check datatable
            return dataTable;
        }
         public OrderFulfillment.POBOrder GetShipmentOrders()
        {
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_Order.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Code", _Order.Region_Code);
                    var lst = connection.QueryMultiple("Sp_OD_OrderShipmentDetails", p, commandType: CommandType.StoredProcedure);
                    OrderFulfillment.POBOrder Order = new OrderFulfillment.POBOrder();
                    Order.lstOrder = lst.Read<OrderFulfillment.OrderMaintenance>().ToList();
                    Order.lstDetails = lst.Read<OrderFulfillment.OrderPOBDetails>().ToList();
                    connection.Close();
                    return Order;
                }
            }
            catch (Exception ex)
                {
                    throw ex;
                }
        }
        public List<OrderFulfillment.OrderPOBDetails> GetDispatchOrderDetails()
        {
            List<OrderFulfillment.OrderPOBDetails> lst = new List<OrderFulfillment.OrderPOBDetails>();

            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_Order.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Order_Id", _Order.Order_Id);
                    lst = connection.Query<OrderFulfillment.OrderPOBDetails>("Sp_OD_OrderDispatch_Products", p, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lst;
        }
        public int InsertOrderShipmentDetails(OrderFulfillment.OrderShipmentDetails obj, string subDomainName)
        {
           
                List<OrderFulfillment.OrderShipmentProductDetails> Acc = JsonConvert.DeserializeObject<List<OrderFulfillment.OrderShipmentProductDetails>>(obj.lstProduct).ToList();
            
            
            int rowAffected = 0;
            string error = string.Empty;

            try
            {
                int newId = 0;

                using (IDbConnection connection = IDbOpenConnectionCompanyWise(subDomainName))
                {
                    StringBuilder query = new StringBuilder();
                    query.Append("Select count(1) From Tbl_SfA_POB_OrderDispatch_Header Where Invoice_No = @InvoiceNo and Order_Id = @Order_Id");
                    rowAffected = connection.Query<int>(query.ToString(),
                        new
                        {
                            InvoiceNo = obj.InvoiceNo,
                            Order_Id = obj.Order_Id,
                        }).FirstOrDefault();
                    connection.Close();
                }
                if (rowAffected == 0)
                {
                    using (IDbConnection connection = IDbOpenConnectionCompanyWise(subDomainName))
                    {
                        StringBuilder query = new StringBuilder();
                        query.Append("Insert Into Tbl_SfA_POB_OrderDispatch_Header (Company_Id,Order_Id,Invoice_No,Invoice_Date,Dispatch_Date,Acknowledge_Date,Attachement,Created_by,Created_Date)");
                        query.Append(" Values(@Company_Id, @Order_Id, @InvoiceNo,@InvoiceDate, @DispatchDate, @AckDate, @UploadImg , @UserCode, GetDate()) Select  CAST(SCOPE_IDENTITY() as int)");

                        newId = connection.Query<int>(query.ToString(),
                            new
                            {
                                Company_Id = obj.Company_Id,
                                UserCode = obj.UserCode,
                                Order_Id = obj.Order_Id,
                                InvoiceNo = obj.InvoiceNo,
                                InvoiceDate = obj.InvoiceDate,
                                DispatchDate = obj.DispatchDate,
                                AckDate = obj.AckDate,
                                UploadImg = obj.Attachment
                            }).FirstOrDefault();

                        connection.Close();
                    }
                    using (IDbConnection connection = IDbOpenConnectionCompanyWise(subDomainName))
                    {
                        IDbTransaction trans = connection.BeginTransaction();
                        foreach (var item in Acc)
                        {
                            string LineQuery = "Insert Into Tbl_SfA_POB_OrderDispatch_Details (Company_Id,Order_Id,Dispatch_Id,Product_Code,Dispatch_Quantity,Rate,Created_By,Created_Date)" +
                                " Values(@Company_Id, @Order_Id, @Dipatch_Id,@Product_Code,@Dispatch_Qty,@Rate,@UserCode,GetDate())  Select  CAST(SCOPE_IDENTITY() as int)";
                            rowAffected = connection.Execute(LineQuery,
                               new
                               {
                                   Company_Id = obj.Company_Id,
                                   Order_Id = obj.Order_Id,
                                   Dipatch_Id = newId,
                                   Product_Code = item.Product_Code,
                                   Product_Name = item.Product_Name,
                                   Order_Qty = 0,
                                   Dispatch_Qty = item.Dispatch_Qty,
                                   Rate = item.Rate,
                                   Product_Type = item.Product_Type,
                                   UserCode = obj.UserCode
                               }, transaction: trans);
                        }
                        trans.Commit();
                    }

                    using (IDbConnection connection = IDbOpenConnectionCompanyWise(subDomainName))
                    {
                        IDbTransaction trans = connection.BeginTransaction();
                        foreach (var item1 in Acc)
                        {
                            string LineQuery = "Update TBL_SFA_OrderMaintenance_Details Set Dispatch_Qty = (Dispatch_Qty+@Dispatch_Qty), Balance_Qty = (Balance_Qty-@Dispatch_Qty), Updated_Date = GetDate(), Updated_By = @UserCode Where  Order_Id = @Order_Id and Product_Code=@Product_Code";
                            rowAffected = connection.Execute(LineQuery,
                               new
                               {
                                   Order_Id = obj.Order_Id,
                                   Dispatch_Qty = item1.Dispatch_Qty,
                                   Rate = item1.Rate,
                                   Product_Code = item1.Product_Code,
                                   UserCode = obj.UserCode
                               }, transaction: trans);
                           
                        }
                        trans.Commit();
                       
                    }
                }
                else
                {
                    rowAffected = -1;
                }
                return rowAffected;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public OrderFulfillment.SummaryDetails GetOrderShipmentSummary()
        {
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_Order.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Code", _Order.Region_Code);
                    var lst = connection.QueryMultiple("Sp_OD_GetOrderShipmentSummary", p, commandType: CommandType.StoredProcedure);
                    OrderFulfillment.SummaryDetails Order = new OrderFulfillment.SummaryDetails();
                    Order.lstOrder = lst.Read<OrderFulfillment.OrderMaintenance>().ToList();
                    Order.lstDetails = lst.Read<OrderFulfillment.OrderPOBDetails>().ToList();
                    Order.lstCancel = lst.Read<OrderFulfillment.Cancel>().ToList();
                    connection.Close();
                    return Order;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        public OrderFulfillment.DispatchDetails GetSummaryDetails()
        {
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_Order.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Order_Id", _Order.Order_Id);
                    var lst = connection.QueryMultiple("Sp_OD_GetdispatchDetails", p, commandType: CommandType.StoredProcedure);
                    OrderFulfillment.DispatchDetails Order = new OrderFulfillment.DispatchDetails();
                    Order.lstProduct = lst.Read<OrderFulfillment.DispatchProduct>().ToList();
                    Order.lstHeader = lst.Read<OrderFulfillment.DispatchHeaderDetails>().ToList();
                    Order.lstDetails = lst.Read<OrderFulfillment.DispatchProductDetails>().ToList();
                    Order.lstCancel = lst.Read<OrderFulfillment.PartialCancelation>().ToList();
                    connection.Close();
                    return Order;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        public List<OrderFulfillment.RegionWiseProduct> GetRegionWiseProduct()
        {
            List<OrderFulfillment.RegionWiseProduct> lst = new List<OrderFulfillment.RegionWiseProduct>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_Order.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Code", _Order.Region_Code);
                    lst = connection.Query<OrderFulfillment.RegionWiseProduct>("Sp_OD_GetProductName", p, commandType: CommandType.StoredProcedure).ToList();
                }
                return lst;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<OrderFulfillment.PobOrder> GetOderNumber()
        {
            List<OrderFulfillment.PobOrder> lst = new List<OrderFulfillment.PobOrder>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_Order.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Code", _Order.Region_Code);
                    p.Add("@Start_Date", _Order.Start_Date);
                    p.Add("@End_Date", _Order.End_Date);
                    p.Add("@Customer_Code", _Order.Customer_Code);
                    lst = connection.Query<OrderFulfillment.PobOrder>("Sp_Hd_GetPOBInvoice", p, commandType: CommandType.StoredProcedure).ToList();
                }
                return lst;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public int InsertPOBOrder(OrderFulfillment.OrderList obj, string subDomainName)
        {
            int row = 0;
            List<OrderFulfillment.Oredertvp> Acc = JsonConvert.DeserializeObject<List<OrderFulfillment.Oredertvp>>(obj.Product).ToList();
            OrderFulfillment.DateCapturingModel objdate = JsonConvert.DeserializeObject<OrderFulfillment.DateCapturingModel>(obj.date);
            if (!(objdate.Off_Set.Contains('+') && !(objdate.Off_Set.Contains('-'))))
            {
                objdate.Off_Set = '+' + objdate.Off_Set.Trim();
            }
          //  List<OrderFulfillment.DateCapturingModel> objdate = JsonConvert.DeserializeObject<List<OrderFulfillment.DateCapturingModel>>(obj.date).ToList();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(subDomainName))
                {

                    var p = new DynamicParameters();
                    p.Add("@CompanyID", obj.Company_Id);
                    //p.Add("@ClaimCode", claimCode);
                    p.Add("@User_Code", obj.UserCode);
                    p.Add("@Region_Code", obj.Region_Code);
                    p.Add("@Customer_Code", obj.Customer_Code);
                    p.Add("@Customer_Name", obj.Customer_Name);
                    p.Add("@Category", obj.Category);
                    p.Add("@Speciality_Name", obj.Speciality_Name);
                    p.Add("@MDL_Number", obj.MDL_Number);
                    p.Add("@Customer_Entity_Type", obj.Customer_Entity_Type);
                    p.Add("@Stockiest_Code", obj.Stockiest_Code);
                    p.Add("@DueDate", obj.DueDate);
                    p.Add("@Created_Date", objdate.Date);
                    p.Add("@Created_TimeZone", objdate.TimeZone);
                    p.Add("@Created_OffSet", objdate.Off_Set);
                    p.Add("@UTC_Date", objdate.UTC_Date);
                    p.Add("@remark", obj.remark);
                    p.Add("@OldOrder_Id", obj.Order_Id);
                    p.Add("@TVP_InsertPOBDetails", ToDataTable(Acc).AsTableValuedParameter());
                   // p.Add("@Result", 0, DbType.Int32, ParameterDirection.Output);
                    //connection.Execute("SP_OD_InsertPOBOrder", p, commandType: CommandType.StoredProcedure);
                    //row = p.Get<int>("@Result");
                    //connection.Close();
                    p.Add("@Result", 0, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>("SP_OD_InsertPOBOrder", p, commandType: CommandType.StoredProcedure);
                    row= p.Get<int>("@Result");
                }
                return row;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<OrderFulfillment.OrderPOBDetails> GetPOBOrderDetails()
        {
            List<OrderFulfillment.OrderPOBDetails> lst = new List<OrderFulfillment.OrderPOBDetails>();

            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(_Order.subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Order_Id", _Order.Order_Id);
                    lst = connection.Query<OrderFulfillment.OrderPOBDetails>("Sp_OD_POBOrder_Products", p, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lst;
        }

        public List<OrderFulfillment.HDAccessInfo> GetHDAccessInfo(string UserName, string subDomainName)
        {
            List<OrderFulfillment.HDAccessInfo> lst = new List<OrderFulfillment.HDAccessInfo>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@UserName", UserName);
                    lst = connection.Query<OrderFulfillment.HDAccessInfo>("SP_HD_GetHDAccessUsersInfo", p, commandType: CommandType.StoredProcedure).ToList();
                }
                return lst;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int InsertHDAccess(OrderFulfillment.HDAccessForUser obj,string subDomainName)
        {
            int result = 0;

            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", obj.CompanyCode);
                    p.Add("@User_Code", obj.UserCode);
                    p.Add("@LoginUserCode", obj.LoginUserCode);
                    p.Add("@Is_Web_Access", obj.Is_Web_Access);
                    p.Add("@Is_App_Access", obj.Is_App_Access);
                    p.Add("@Created_By", obj.LoginUserCode);
                    //connection.Query<int>("Sp_HD_InsertHDAccess", p, commandType: CommandType.StoredProcedure);
                    result = connection.Execute("Sp_HD_InsertHDAccess", p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        public List<OrderFulfillment.SingleDeviceLockEntries> GetSingleDeviceLockEntries(string UserName, string DeviceGuid, string subDomainName)
        {
            List<OrderFulfillment.SingleDeviceLockEntries> lst = new List<OrderFulfillment.SingleDeviceLockEntries>();
            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@UserName", UserName);
                    p.Add("@Device_GUID", DeviceGuid);
                    lst = connection.Query<OrderFulfillment.SingleDeviceLockEntries>("SP_HD_GetSingleDeviceLoginEntries", p, commandType: CommandType.StoredProcedure).ToList();
                }
                return lst;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int ReleaseSingleDeviceLock(OrderFulfillment.ReleaseSingleDeviceLock obj, string subDomainName)
        {
            int result = 0;

            try
            {
                using (IDbConnection connection = IDbOpenConnectionCompanyWise(subDomainName))
                {
                    var p = new DynamicParameters();
                    p.Add("@UserCode", obj.UserCode);
                    p.Add("@Device_GUID", obj.Device_GUID);
                    p.Add("@LoginUserCode", obj.LoginUserCode);
                    p.Add("@Reason", obj.Reason);
                   //connection.Query<int>("Sp_HD_InsertHDAccess", p, commandType: CommandType.StoredProcedure);
                    result = connection.Execute("SP_HD_ReleaseSingleDeviceLock", p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        public List<OrderFulfillment.SingleDeviceRelease> GetSingleDeviceLoginReleaseHistory(string LoginUserCode)
        {

            List<OrderFulfillment.SingleDeviceRelease> lst = new List<OrderFulfillment.SingleDeviceRelease>();

            using (IDbConnection connection = IDbOpenConnection())
            {
                var p = new DynamicParameters();
                p.Add("@LoginUserCode", LoginUserCode);
                lst = connection.Query<OrderFulfillment.SingleDeviceRelease>("SP_HD_GetSingleDeviceLoginReleaseHistory", p, commandType: CommandType.StoredProcedure).ToList();
                connection.Close();
                return lst;
            }
        }
    }
}
