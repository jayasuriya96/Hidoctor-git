using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MVCModels;
using DataControl.HiDoctor_ActivityFactoryClasses;
using System.IO;

namespace DataControl.HiDoctor_ActivityFactoryClasses
{
  public  class BL_OrderFulfillment:OrderFulfillment.Order
    {
        DAL_OrderFulfillment DAL_Order = new DAL_OrderFulfillment();
        public List<OrderFulfillment.RegionModel> GetAllRegionName()
        {
            DAL_Order._Order.Region_Code = Region_Code;
            DAL_Order._Order.subDomainName = subDomainName;
            DAL_Order._Order.CompanyCode = CompanyCode;
            return DAL_Order.GetAllRegionName();
        }
        public List<OrderFulfillment.RegionWiseStockiest> GetRegionWiseStockiest()
        {
            DAL_Order._Order.Region_Code = Region_Code;
            DAL_Order._Order.Order_Date = Order_Date;
            DAL_Order._Order.subDomainName = subDomainName;
            DAL_Order._Order.Entity = Entity;
            return DAL_Order.GetRegionWiseStockiest();
        }
        public OrderFulfillment.POBOrder GetOrderMaintenance()
        {
            DAL_Order._Order.Region_Code = Region_Code;
            DAL_Order._Order.subDomainName = subDomainName;
            return DAL_Order.GetOrderMaintenance();
        }
        public List<OrderFulfillment.OrderProduct> GetProductDetails()
        {
            DAL_Order._Order.Order_Id = Order_Id;
            DAL_Order._Order.subDomainName = subDomainName;
            return DAL_Order.GetProductDetails();
        }
        public int InsertMaintaningOrder()
        {
            DAL_Order._Order.Company_Id = Company_Id;
            DAL_Order._Order.User_Code = User_Code;
            DAL_Order._Order.Region_Code = Region_Code;
            DAL_Order._Order.OrderRegion = OrderRegion;
            DAL_Order._Order.Order_Id = Order_Id;
            DAL_Order._Order.Stockiest_Code = Stockiest_Code;
            DAL_Order._Order.Stockiest_Name = Stockiest_Name;
            DAL_Order._Order.Remarks = Remarks;
            DAL_Order._Order.subDomainName = subDomainName;
            DAL_Order._Order.Status = Status;
            return DAL_Order.InsertMaintaningOrder();
        }
        public int UpdatePratialProduct(List<OrderFulfillment.OrderCancelProduct> obj,string subDomainName)
        {
            return DAL_Order.UpdatePratialProduct(obj, subDomainName);
        }
        public OrderFulfillment.POBOrder GetShipmentOrders()
        {
            DAL_Order._Order.Region_Code = Region_Code;
            DAL_Order._Order.subDomainName = subDomainName;
            return DAL_Order.GetShipmentOrders();
        }
        public List<OrderFulfillment.OrderPOBDetails> GetDispatchOrderDetails()
        {
            DAL_Order._Order.Order_Id = Order_Id;
            DAL_Order._Order.subDomainName = subDomainName;
            return DAL_Order.GetDispatchOrderDetails();
        }
        public int InsertOrderShipmentDetails(OrderFulfillment.OrderShipmentDetails obj, string subDomainName)
        {
            return DAL_Order.InsertOrderShipmentDetails(obj, subDomainName);
        }
        public OrderFulfillment.SummaryDetails GetOrderShipmentSummary()
        {
            DAL_Order._Order.Region_Code = Region_Code;
            DAL_Order._Order.subDomainName = subDomainName;
            return DAL_Order.GetOrderShipmentSummary();
        }
        public OrderFulfillment.DispatchDetails GetSummaryDetails()
        {
            DAL_Order._Order.Order_Id = Order_Id;
            DAL_Order._Order.subDomainName = subDomainName;
            return DAL_Order.GetSummaryDetails();
        }
        public List<OrderFulfillment.RegionWiseProduct> GetRegionWiseProduct()
        {
            List<OrderFulfillment.RegionWiseProduct> lst = new List<OrderFulfillment.RegionWiseProduct>();
            DAL_Order._Order.Region_Code = Region_Code;
            DAL_Order._Order.CompanyCode = CompanyCode;
            DAL_Order._Order.User_Code = User_Code;
            DAL_Order._Order.subDomainName = subDomainName;
            lst = DAL_Order.GetRegionWiseProduct();

            return lst;
        }
        public List<OrderFulfillment.PobOrder> GetOderNumber()
        {
            DAL_Order._Order.Region_Code = Region_Code;
            DAL_Order._Order.Start_Date = Start_Date;
            DAL_Order._Order.End_Date = End_Date;
            DAL_Order._Order.Customer_Code = Customer_Code;
            DAL_Order._Order.subDomainName = subDomainName;
            return DAL_Order.GetOderNumber();
        }
        public int InsertPOBOrder(OrderFulfillment.OrderList obj, string subDomainName)
        {
            return DAL_Order.InsertPOBOrder(obj, subDomainName);
        }
        public List<OrderFulfillment.OrderPOBDetails> GetPOBOrderDetails()
        {
            DAL_Order._Order.Order_Id = Order_Id;
            DAL_Order._Order.subDomainName = subDomainName;
            return DAL_Order.GetPOBOrderDetails();
        }

        public List<OrderFulfillment.HDAccessInfo> GetHDAccessInfo(string UserName, string subDomainName)
        {
            return DAL_Order.GetHDAccessInfo(UserName, subDomainName);
        }

        public int InsertHDAccess(OrderFulfillment.HDAccessForUser obj,string subDomainName)
        {
            return DAL_Order.InsertHDAccess(obj,subDomainName);
        }

        public List<OrderFulfillment.SingleDeviceLockEntries> GetSingleDeviceLockEntries(string UserName, string DeviceGuid, string subDomainName)
        {
            return DAL_Order.GetSingleDeviceLockEntries(UserName, DeviceGuid, subDomainName);
        }

        public int ReleaseSingleDeviceLock(OrderFulfillment.ReleaseSingleDeviceLock obj, string subDomainName)
        {
            return DAL_Order.ReleaseSingleDeviceLock(obj, subDomainName);
        }

        //public List<OrderFulfillment.SingleDeviceRelease> GetSingleDeviceLoginReleaseHistory(string UserCode)
        //{
        //    return DAL_Order.GetSingleDeviceLoginReleaseHistory(UserCode);
        //}

        public List<OrderFulfillment.SingleDeviceRelease> GetSingleDeviceLoginReleaseHistory(string UserCode)
        {
            return DAL_Order.GetSingleDeviceLoginReleaseHistory(UserCode);
        }
    }
}
