using MVCModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using HDQueueService;
using Newtonsoft.Json;

namespace DataControl.HD_MasterFactoryClasses
{
    public class BL_SS
    {
        private DAL_SS _objApproval = new DAL_SS();
        public List<MVCModels.StockiestData> GetSSStockiestDetails(string companyCode, string regionCode)
        {
            return _objApproval.GetSSStockiestDetails(companyCode, regionCode);
        }
    }
}
//