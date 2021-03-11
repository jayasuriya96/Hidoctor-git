using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;

namespace DataControl
{
    public interface IOTC
    {
        List<MVCModels.HiDoctor_Master.CustomerModel> GetCustomerDetails(string companyCode, string matchingString, string regionCode, string customerEntity);
        List<MVCModels.HiDoctor_Master.CustomerModel> GetCustomerDetails(string companyCode, string regionCode,string mode);
        List<MVCModels.HiDoctor_Master.SalesOrderStatusModel> GetSalesOrderStatus(string companyCode, string regionCode);

        List<MVCModels.HiDoctor_Activity.OTCModel> GetProductDetails(string companyCode, string matchingString, string regionCode, string columnName);
        List<MVCModels.HiDoctor_Activity.OTCModel> GetCustomerOrders(string companyCode, string regionCode, string customerCode, int month, int Year);
        
        DataSet GetOrderDetails(string companyCode, string orderId, string mode);
        DataSet GetApproveOrder(string companyCode, string userCode, string mode);

        List<MVCModels.HiDoctor_Activity.OTCModel> GetSchemeDetails(string companyCode, string regionCode, string productCodes, string orderDate);
    }
}
