using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Mvc;
using System.Data;
using ElmahWrapper;
using DataControl;

namespace HiDoctor_Activity.Controllers
{
    [AjaxSessionActionFilter]
    public class OTCController : Controller
    {
        #region Private Variables
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        private const string customerEntity = "ALL";
        private const string IsSession = "SESSION";
        #endregion Private Variables

        #region Views
        public ActionResult Index()
        {
            if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
            {
                return View("Index.Mobile");
            }
            return View();
        }

        public ActionResult SalesOrder()
        {
            if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
            {
                return View("SalesOrder.Mobile");
            }
            return View();
        }

        public ActionResult SalesOrderCustomerList()
        {
            if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
            {
                return View("SalesOrderCustomerList.Mobile");
            }
            return View();
        }


        public ActionResult SalesOrderStatus()
        {
            if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
            {
                return View("SalesOrderStatus.Mobile");
            }
            return View();
        }

        public ActionResult OrderStatusEdit(string orderCode,string isEdit)
        {
            ViewBag.orderCode = orderCode;
            ViewBag.isEdit = isEdit;

            if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
            {
                return View("OrderStatusEdit.Mobile");
            }
            return View();
        }
        //ApproveOrder
        public ActionResult ApproveOrder()
        {
            if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
            {
                return View("ApproveOrder.Mobile");
            }
            return View();
        }

        public ActionResult SalesOrderEntry(string customerCode, string customerName, string Address, string salesPersonCode, string tinNumber, string cstNumber)
        {
            ViewBag.customerCode = customerCode;
            ViewBag.customerName = customerName;
            ViewBag.Address = Address;
            ViewBag.salesPersonCode = salesPersonCode;
            ViewBag.tinNumber = tinNumber;
            ViewBag.cstNumber = cstNumber;

            if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
            {
                return View("SalesOrderEntry.Mobile");
            }
            return View();
        }

        public ActionResult SOAddProduct(string orderId, string orderDate)
        {
            ViewBag.orderId = orderId;
            ViewBag.orderDate = orderDate;
            ViewBag.todayDate = DateTime.Now.ToString("yyyy/MM/dd");

            if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
            {
                return View("SOAddProduct.Mobile");
            }
            return View();
        }

        public ActionResult OrderHistory()
        {
            ViewBag.currentDate = DateTime.Now.ToString("dd/MM/yyyy");

            if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
            {
                return View("OrderHistory.Mobile");
            }
            return View();
        }

        public ActionResult OrderHistoryDetailView(string orderID,string from)
        {
            ViewBag.orderID = orderID;
            ViewBag.from = from;

            if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
            {
                return View("OrderHistoryDetailView.Mobile");
            }
            return View();
        }

        public ActionResult SalesOrderBulkApproval(string userCode)
        {
            ViewBag.userCode = userCode;
            if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
            {
                return View("SalesOrderBulkApproval.Mobile");
            }
            return View();
        }

        public ActionResult SalesOrderSingleApproval(string orderID, string userCode)
        {
            ViewBag.orderID = orderID;
            ViewBag.userCode = userCode;
            if (DataControl.CurrentInfo.IsMobile(Request.UserAgent))
            {
                return View("SalesOrderSingleApproval.Mobile");
            }
            return View();
        }
        #endregion Views

        #region Public Methods
        // customer detail based on the entity
        public JsonResult GetCustomerDetails(FormCollection coll)
        {
            List<MVCModels.HiDoctor_Master.CustomerModel> lstCust = new List<MVCModels.HiDoctor_Master.CustomerModel>();
            IOTC icustDetail = new BAL_OTC();
            string regionCode = string.Empty;

            if (coll["customerEntity"].ToString().ToUpper() == customerEntity) //  if cust entity is equals to ALL, it returns all the customer detail for the reion code.
            {
                string mode = coll["mode"].ToString();
                lstCust = icustDetail.GetCustomerDetails(_objcurrentInfo.GetCompanyCode(), _objcurrentInfo.GetRegionCode(), mode);
            }
            else
            {
                regionCode = (coll["regionCode"].ToString() == IsSession) ? _objcurrentInfo.GetRegionCode() : coll["regionCode"].ToString();
                lstCust = icustDetail.GetCustomerDetails(_objcurrentInfo.GetCompanyCode(), coll["match"].ToString(), regionCode, coll["customerEntity"].ToString());
            }

            return Json(lstCust, JsonRequestBehavior.AllowGet);
        }


        // Product Details 
        public JsonResult GetProductDetails(FormCollection coll)
        {
            List<MVCModels.HiDoctor_Activity.OTCModel> lstProduct = new List<MVCModels.HiDoctor_Activity.OTCModel>();
            IOTC icustDetail = new BAL_OTC();
            string regionCode = string.Empty;

            regionCode = (coll["regionCode"].ToString() == IsSession) ? _objcurrentInfo.GetRegionCode() : coll["regionCode"].ToString();
            lstProduct = icustDetail.GetProductDetails(_objcurrentInfo.GetCompanyCode(), coll["match"].ToString(), regionCode, coll["columnName"].ToString());
            return Json(lstProduct, JsonRequestBehavior.AllowGet);
        }

        // customer total order detail for a month
        public JsonResult GetCustomerOrders(FormCollection coll)
        {
            List<MVCModels.HiDoctor_Activity.OTCModel> lstCustOrder = new List<MVCModels.HiDoctor_Activity.OTCModel>();
            IOTC icustDetail = new BAL_OTC();
            string regionCode = string.Empty;

            regionCode = (coll["regionCode"].ToString() == IsSession) ? _objcurrentInfo.GetRegionCode() : coll["regionCode"].ToString();
            lstCustOrder = icustDetail.GetCustomerOrders(_objcurrentInfo.GetCompanyCode(), regionCode, coll["customerCode"].ToString(), Convert.ToInt32(coll["month"]), Convert.ToInt32(coll["year"]));
            return Json(lstCustOrder, JsonRequestBehavior.AllowGet);
        }

        // Order detail
        public JsonResult GetOrderDetails(FormCollection coll)
        {
            DataSet ds = new DataSet();
            IOTC icustDetail = new BAL_OTC();

            ds = icustDetail.GetOrderDetails(_objcurrentInfo.GetCompanyCode(), coll["orderId"].ToString(), coll["mode"].ToString());
            JSONConverter json = new JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSalesOrderLoadDetails(FormCollection coll)
        {
            DataSet ds = new DataSet();
            BAL_OTC objBALOTC = new BAL_OTC();

            ds = objBALOTC.GetSalesOrderLoadDetails(_objcurrentInfo.GetCompanyCode(), _objcurrentInfo.GetRegionCode());

            JSONConverter json = new JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSchemeDetails(FormCollection coll)
        {
            List<MVCModels.HiDoctor_Activity.OTCModel> lstScheme = new List<MVCModels.HiDoctor_Activity.OTCModel>();
            IOTC ischeme = new BAL_OTC();
            string regionCode = string.Empty;

            regionCode = (coll["regionCode"].ToString() == IsSession) ? _objcurrentInfo.GetRegionCode() : coll["regionCode"].ToString();
            lstScheme = ischeme.GetSchemeDetails(_objcurrentInfo.GetCompanyCode(), regionCode, coll["productCodes"].ToString(), coll["orderDate"].ToString());
            return Json(lstScheme, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSalesOrderStatus(FormCollection coll)
        {
            List<MVCModels.HiDoctor_Master.SalesOrderStatusModel> lstCust = new List<MVCModels.HiDoctor_Master.SalesOrderStatusModel>();
            IOTC icustDetail = new BAL_OTC();
            string regionCode = string.Empty;
            lstCust = icustDetail.GetSalesOrderStatus(_objcurrentInfo.GetCompanyCode(), _objcurrentInfo.GetRegionCode());
            return Json(lstCust, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetOrderStatusView(FormCollection coll)
        {
            DataSet ds = new DataSet();
            IOTC icustDetail = new BAL_OTC();

            ds = icustDetail.GetOrderDetails(_objcurrentInfo.GetCompanyCode(), coll["orderId"].ToString(), coll["mode"].ToString());
            JSONConverter json = new JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetApproveOrderlist(FormCollection coll)
        {
            DataSet ds = new DataSet();
            IOTC icustDetail = new BAL_OTC();
            string userCode = string.Empty;
            userCode = (coll["mode"].ToString() == "ALL") ? _objcurrentInfo.GetUserCode() : coll["userCode"].ToString();
            ds = icustDetail.GetApproveOrder(_objcurrentInfo.GetCompanyCode(), userCode, coll["mode"].ToString());
            JSONConverter json = new JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }


        // Inert or update Sales order(applied or drafted status)
        public string InsertOTC(string orderId, string orderDate, string isSubmit, string productString, string custCode, string salesPersonCode
                                , string salesPersonName, string orderValue, string remarks, string refNumber, string productCodes, string offerCodes, string dueDate)
        {
            BAL_OTC objBALOTC = new BAL_OTC();
            salesPersonCode = (salesPersonCode == IsSession) ? _objcurrentInfo.GetRegionCode() : salesPersonCode;
            string enterBy = _objcurrentInfo.GetUserCode();
            string enterByRegion = _objcurrentInfo.GetRegionCode();
            salesPersonName = (salesPersonName == "") ? _objcurrentInfo.GetUserName() : salesPersonName.Split('(')[0];
            return objBALOTC.InsertOTC(_objcurrentInfo.GetCompanyCode(), orderId, orderDate, isSubmit, productString, custCode, salesPersonCode, salesPersonName, enterBy, enterByRegion, orderValue, remarks, refNumber, productCodes, offerCodes, dueDate);
        }

        // Approve or unapprove sales order(approved or unapproved status)
        public string ChangeOrderStatus(FormCollection coll)
        {
            string result = string.Empty;
            BAL_OTC objBALOTC = new BAL_OTC();
            result = objBALOTC.ChangeOrderStatus(_objcurrentInfo.GetCompanyCode(), Convert.ToChar(coll["status"]), coll["orderIds"].ToString(), _objcurrentInfo.GetUserCode(), coll["approvalRemarks"].ToString());
            return result;
        }
        #endregion Public Methods


    }
}
