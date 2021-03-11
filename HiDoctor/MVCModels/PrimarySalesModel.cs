using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class PrimarySalesModel
    {
        public string RowNo { get; set; }
        public string ERR_CODE { get; set; }
        public string BP_ID { get; set; }   
        public string Company_Code { get; set; }
        public string D_Column {get; set; }
        //public string Customer_code { get; set; }
        //public string Customer_name { get; set; }
  

        #region constructor

        public PrimarySalesModel()
        {

        }
        
        public PrimarySalesModel(string Companycode, string BPId, string XLRowNo, string Err_Code, string Dynamic_Column)
        {
            Company_Code = Companycode;
            RowNo = XLRowNo;
            ERR_CODE = Err_Code;
            BP_ID = BPId;
            D_Column = Dynamic_Column;
        }

        #endregion 


    }

    public class PSJsonModel
    {
        public MetaDataModel __metadata { get; set; }
        public string DepotName { get; set; }
        public string StockiestName { get; set; }
        public string DocumentNumber { get; set; }
        public string DocumentDate { get; set; }
        public string CustomerNumber { get; set; }
        public decimal NetQty { get; set; }
        public decimal FreeQty { get; set; }
        public decimal NetValue { get; set; }
        public string ProductRefKey { get; set; }
        public string ProductName { get; set; }
        public string BatchNumber { get; set; }
        public string DocTypName { get; set; }
        public string RegionRefKey { get; set; }
        public string RegionName { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
    }
    public class MetaDataModel
    {
        public string id { get; set; }
        public string uri { get; set; }
        public string type { get; set; }
    }
    public class PSModel
    {
        public List<PSJsonModel> results { get; set; }
    }
    public class PSMainModel
    {
        public PSModel d { get; set; }
    }
}
