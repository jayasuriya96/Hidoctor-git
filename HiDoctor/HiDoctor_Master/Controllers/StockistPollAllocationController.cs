using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ElmahWrapper;
using DataControl;
using System.Data;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class StockistPollAllocationController : Controller
    {
        //
        // GET: /StockistPollAllocation/
        #region Private Variables
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        #endregion Private Variables

        public ActionResult Index()
        {
            return View();
        }

        public LargeJsonResult GetStockistData(FormCollection coll)
        {
            BL_Customer objStockist = new BL_Customer();
            List<MVCModels.HiDoctor_Master.CustomerModel> lstStockist = new List<MVCModels.HiDoctor_Master.CustomerModel>();
            lstStockist = objStockist.GetStockistWithRegion(_objcurrentInfo.GetCompanyCode(), coll["regionCode"].ToString());            
            return new LargeJsonResult
            {
                MaxJsonLength = Int32.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                Data = new
                {
                    total = lstStockist.Count,
                    data = lstStockist
                }
            };
        }

        // get all Sale Products
        public JsonResult GetAllSaleProducts()
        {
            BLProduct objProduct = new BLProduct();           
            List<MVCModels.HiDoctor_Master.ProductModel> lstProd = new List<MVCModels.HiDoctor_Master.ProductModel>();
            lstProd = objProduct.GetAllSaleProducts(_objcurrentInfo.GetCompanyCode());
            return Json(lstProd, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetChildRegionsWithDivision(FormCollection coll)
        {
            BLRegion objProduct = new BLRegion();
            List<MVCModels.HiDoctor_Master.RegionModel> lstRegion = new List<MVCModels.HiDoctor_Master.RegionModel>();
            lstRegion = objProduct.GetChildRegionsWithDivision(_objcurrentInfo.GetCompanyCode(), coll["regionCode"].ToString());
            return Json(lstRegion, JsonRequestBehavior.AllowGet);
        }

        public string InsertStockistPoolAllocation(FormCollection col)
        {
            string result = string.Empty;
            BL_Customer objCust=new BL_Customer();
            result = objCust.InsertStockistPoolAllocation(_objcurrentInfo.GetCompanyCode(), col["stockist"].ToString(), col["product"].ToString(), col["territory"].ToString(), col["from"].ToString(), col["to"].ToString(), Convert.ToInt16(col["status"]), col["stockID"].ToString(), col["baseRegion"].ToString(),_objcurrentInfo.GetRegionCode());
            return result;
        }

        public string UpdateStockistAllocation(FormCollection col)
        {
            string result = string.Empty;

            return result;
        }

        public JsonResult GetStockistPoolAllocationDetails(FormCollection col)
        {
            DataSet ds = new DataSet();           
            BL_Customer objCust=new BL_Customer();
            ds = objCust.GetStockistPoolAllocationDetails(_objcurrentInfo.GetCompanyCode(), col["regionCode"].ToString());
            JSONConverter json = new JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

    }
}
