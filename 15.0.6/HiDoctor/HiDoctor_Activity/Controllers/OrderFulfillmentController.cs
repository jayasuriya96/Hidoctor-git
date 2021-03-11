using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MVCModels;
using DataControl.HiDoctor_ActivityFactoryClasses;
using HiDoctor_Activity.Models;
using Newtonsoft.Json;
using DataControl.Repository;
using System.Web;
using MVCModels.HiDoctor_Master;
using MVCModels.HiDoctor_Activity;
using DataControl;

namespace HiDoctor_Activity.Controllers
{
    public class OrderFulfillmentController : Controller
    {
        //
        // GET: /OrderFulfillment/
        private DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
        BL_OrderFulfillment _blOrder = new BL_OrderFulfillment();

        public ActionResult OrderProcessing(string Lid)
        {
            if (Lid == null)
            {
                ViewBag.subDomainName = _objCurrentInfo.GetSubDomain();
                ViewBag.CompanyCode = _objCurrentInfo.GetCompanyCode();
                ViewBag.RegionCode = _objCurrentInfo.GetRegionCode();
                ViewBag.UserCode = _objCurrentInfo.GetUserCode();
                ViewBag.Company_Id = _objCurrentInfo.GetCompanyId();
                ViewBag.IsResponsive = "No";
                System.Web.HttpContext.Current.Session["IsResponsive"] = "No";
            }
            else
            {
                string parameters = System.Text.ASCIIEncoding.ASCII.GetString(System.Convert.FromBase64String(Lid));
                ParameterMode dd = Newtonsoft.Json.JsonConvert.DeserializeObject<ParameterMode>(parameters);

                ViewBag.subDomainName = dd.SubDomain_Name;
                ViewBag.CompanyCode = dd.Company_Code;
                ViewBag.RegionCode = dd.Region_Code;
                ViewBag.UserCode = dd.User_Code;
                ViewBag.Company_Id = dd.Company_Id;
                ViewBag.IsResponsive = "Yes";
                System.Web.HttpContext.Current.Session["IsResponsive"] = "Yes";
            }
            return View();
        }
        public JsonResult GetAllRegionName(string Region_Code, string subDomainName, string CompanyCode)
        {
            _blOrder.Region_Code = Region_Code;
            _blOrder.subDomainName = subDomainName;
            _blOrder.CompanyCode = CompanyCode;
            return Json(_blOrder.GetAllRegionName(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetRegionWiseStockiest(string Region_Code, DateTime Order_Date, string subDomainName, string Entity)
        {
            _blOrder.Region_Code = Region_Code;
            _blOrder.Order_Date = Order_Date;
            _blOrder.subDomainName = subDomainName;
            _blOrder.Entity = Entity;
            return Json(_blOrder.GetRegionWiseStockiest(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetOrderMaintenance(string Region_Code, string subDomainName)
        {
            _blOrder.Region_Code = Region_Code;
            _blOrder.subDomainName = subDomainName;
            return Json(_blOrder.GetOrderMaintenance(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetProductDetails(int Order_Id, string subDomainName)
        {
            _blOrder.Order_Id = Order_Id;
            _blOrder.subDomainName = subDomainName;
            return Json(_blOrder.GetProductDetails(), JsonRequestBehavior.AllowGet);
        }
        public int InsertMaintaningOrder(OrderFulfillment.Order obj)
        {
            int result = 0;
            _blOrder.Company_Id = obj.Company_Id;
            _blOrder.User_Code = obj.User_Code;
            _blOrder.Region_Code = obj.Region_Code;
            _blOrder.OrderRegion = obj.OrderRegion;
            _blOrder.Order_Id = obj.Order_Id;
            _blOrder.Stockiest_Code = obj.Stockiest_Code;
            _blOrder.Stockiest_Name = obj.Stockiest_Name;
            _blOrder.Remarks = obj.Remarks;
            _blOrder.subDomainName = obj.subDomainName;
            _blOrder.Status = obj.Status;
            return result = _blOrder.InsertMaintaningOrder();
        }
        public int UpdatePratialProduct(OrderFulfillment.OrderCancelData obj)
        {
            int result = 0;
            List<OrderFulfillment.OrderCancelProduct> Acc = JsonConvert.DeserializeObject<List<OrderFulfillment.OrderCancelProduct>>(obj.Product).ToList();
            return result = _blOrder.UpdatePratialProduct(Acc, obj.subDomainName);
        }
        #region Order Shipment
        public ActionResult OrderShipment(string Lid)
        {
            if (Lid == null)
            {
                ViewBag.subDomainName = _objCurrentInfo.GetSubDomain();
                ViewBag.CompanyCode = _objCurrentInfo.GetCompanyCode();
                ViewBag.RegionCode = _objCurrentInfo.GetRegionCode();
                ViewBag.UserCode = _objCurrentInfo.GetUserCode();
                ViewBag.Company_Id = _objCurrentInfo.GetCompanyId();
                ViewBag.IsResponsive = "No";
                System.Web.HttpContext.Current.Session["IsResponsive"] = "No";

            }
            else
            {
                string parameters = System.Text.ASCIIEncoding.ASCII.GetString(System.Convert.FromBase64String(Lid));
                ParameterMode dd = Newtonsoft.Json.JsonConvert.DeserializeObject<ParameterMode>(parameters);

                ViewBag.subDomainName = dd.SubDomain_Name;
                ViewBag.CompanyCode = dd.Company_Code;
                ViewBag.RegionCode = dd.Region_Code;
                ViewBag.UserCode = dd.User_Code;
                ViewBag.Company_Id = dd.Company_Id;
                ViewBag.IsResponsive = "Yes";
                System.Web.HttpContext.Current.Session["IsResponsive"] = "Yes";
            }
            return View();
        }
        public JsonResult GetShipmentOrders(string Region_Code, string subDomainName)
        {
            _blOrder.Region_Code = Region_Code;
            _blOrder.subDomainName = subDomainName;
            return Json(_blOrder.GetShipmentOrders(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetDispatchOrderDetails(int Order_Id, string subDomainName)
        {
            _blOrder.Order_Id = Order_Id;
            _blOrder.subDomainName = subDomainName;
            return Json(_blOrder.GetDispatchOrderDetails(), JsonRequestBehavior.AllowGet);
        }

        public string UploadAttachment()
        {
            var result = "";

            try
            {
                System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;

                var objAzureUpload = new DataControl.Repository.AzureBlobUpload();
                var objPathProv = new DataControl.Impl.FileSystemProvider();
                string accKey = objPathProv.GetConfigValue("UPLOADEDFILEBLOBACCKEY");
                HttpFileCollectionBase files = Request.Files;
                if (files.Count > 0)
                {
                    for (var i = 0; i < files.Count; i++)
                    {
                        HttpPostedFileBase fileUpload = files[i];
                        String fileNametimeStamp = DateTime.Now.ToString("ddMMyyyyHHmmssfff");
                        fileNametimeStamp = fileNametimeStamp + '_' + fileUpload.FileName;
                        string containerName = "ORDERSHIPMENT";
                        result = objAzureUpload.PutAzureBlobStorage(fileUpload.InputStream, fileNametimeStamp, accKey, containerName);

                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }
        public int InsertOrderShipmentDetails(OrderFulfillment.OrderShipmentDetails obj)
        {
            int result = 0;

            result = _blOrder.InsertOrderShipmentDetails(obj, obj.subDomainName);
            return result;
        }
        #endregion
        #region Shipment Process
        public ActionResult OrderShipmentSummary(string Lid)
        {
            if (Lid == null)
            {
                ViewBag.subDomainName = _objCurrentInfo.GetSubDomain();
                ViewBag.CompanyCode = _objCurrentInfo.GetCompanyCode();
                ViewBag.RegionCode = _objCurrentInfo.GetRegionCode();
                ViewBag.UserCode = _objCurrentInfo.GetUserCode();
                ViewBag.Company_Id = _objCurrentInfo.GetCompanyId();
                ViewBag.IsResponsive = "No";
                System.Web.HttpContext.Current.Session["IsResponsive"] = "No";
            }
            else
            {
                string parameters = System.Text.ASCIIEncoding.ASCII.GetString(System.Convert.FromBase64String(Lid));
                ParameterMode dd = Newtonsoft.Json.JsonConvert.DeserializeObject<ParameterMode>(parameters);

                ViewBag.subDomainName = dd.SubDomain_Name;
                ViewBag.CompanyCode = dd.Company_Code;
                ViewBag.RegionCode = dd.Region_Code;
                ViewBag.UserCode = dd.User_Code;
                ViewBag.Company_Id = dd.Company_Id;
                ViewBag.IsResponsive = "Yes";
                System.Web.HttpContext.Current.Session["IsResponsive"] = "Yes";
            }
            return View();
        }
        public JsonResult GetOrderShipmentSummary(string Region_Code, string subDomainName)
        {
            _blOrder.Region_Code = Region_Code;
            _blOrder.subDomainName = subDomainName;
            return Json(_blOrder.GetOrderShipmentSummary(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetSummaryDetails(int Order_Id, string subDomainName)
        {
            _blOrder.Order_Id = Order_Id;
            _blOrder.subDomainName = subDomainName;
            return Json(_blOrder.GetSummaryDetails(), JsonRequestBehavior.AllowGet);
        }
        #endregion
        public ActionResult OrderCreation(string Lid)
        {
            if (Lid == null)
            {
                ViewBag.subDomainName = _objCurrentInfo.GetSubDomain();
                ViewBag.CompanyCode = _objCurrentInfo.GetCompanyCode();
                ViewBag.RegionCode = _objCurrentInfo.GetRegionCode();
                ViewBag.UserCode = _objCurrentInfo.GetUserCode();
                ViewBag.Company_Id = _objCurrentInfo.GetCompanyId();
                ViewBag.IsResponsive = "No";
                System.Web.HttpContext.Current.Session["IsResponsive"] = "No";

            }
            else
            {
                string parameters = System.Text.ASCIIEncoding.ASCII.GetString(System.Convert.FromBase64String(Lid));
                ParameterMode dd = Newtonsoft.Json.JsonConvert.DeserializeObject<ParameterMode>(parameters);

                ViewBag.subDomainName = dd.SubDomain_Name;
                ViewBag.CompanyCode = dd.Company_Code;
                ViewBag.RegionCode = dd.Region_Code;
                ViewBag.UserCode = dd.User_Code;
                ViewBag.Company_Id = dd.Company_Id;
                ViewBag.IsResponsive = "Yes";
                System.Web.HttpContext.Current.Session["IsResponsive"] = "Yes";
            }
            return View();
        }
        public JsonResult GetRegionWiseProduct(string Region_Code, string CompanyCode, string UserCode, string subDomainName)
        {
            _blOrder.Region_Code = Region_Code;
            _blOrder.CompanyCode = CompanyCode;
            _blOrder.subDomainName = subDomainName;
            _blOrder.User_Code = UserCode;
            return Json(_blOrder.GetRegionWiseProduct(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetOderNumber(string Region_Code, string Start_Date, string End_Date, string Customer_Code, string subDomainName)
        {
            _blOrder.Region_Code = Region_Code;
            _blOrder.Start_Date = Start_Date;
            _blOrder.End_Date = End_Date;
            _blOrder.Customer_Code = Customer_Code;
            _blOrder.subDomainName = subDomainName;
            return Json(_blOrder.GetOderNumber(), JsonRequestBehavior.AllowGet);
        }
        public int InsertPOBOrder(OrderFulfillment.OrderList obj)
        {
            int result = 0;

            return result = _blOrder.InsertPOBOrder(obj, obj.subDomainName);
        }
        public JsonResult GetPOBOrderDetails(int Order_Id, string subDomainName)
        {
            _blOrder.Order_Id = Order_Id;
            _blOrder.subDomainName = subDomainName;
            return Json(_blOrder.GetPOBOrderDetails(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetUsers(string LoginUserCode)
        {
            //String CompanyCode = "";
            //CompanyCode = _objCurrentInfo.GetCompanyCode();
            IEnumerable<UserInfo> lstUser = new List<UserInfo>();
            try
            {
                BLUser objDept = new BLUser();
                lstUser = objDept.GetUserDetailsForHDAccess(LoginUserCode).ToList();

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
            }
            return Json(lstUser, JsonRequestBehavior.AllowGet);
        }

        public ActionResult HDAccess(string Lid = null)
        {
            // DataControl.CurrentInfo objCurInfo = new CurrentInfo();
            if (Lid == null)
            {
                ViewBag.CompanyCode = _objCurrentInfo.GetCompanyCode();
                ViewBag.UserCode = _objCurrentInfo.GetUserCode();
                ViewBag.IsResponsive = "No";
                ViewBag.subDomainName = _objCurrentInfo.GetSubDomain();
                System.Web.HttpContext.Current.Session["IsResponsive"] = "No";
            }
            else
            {
                string parameters = System.Text.ASCIIEncoding.ASCII.GetString(System.Convert.FromBase64String(Lid));
                ParameterMode dd = Newtonsoft.Json.JsonConvert.DeserializeObject<ParameterMode>(parameters);

                ViewBag.CompanyCode = dd.Company_Code;
                ViewBag.subDomainName = dd.SubDomain_Name;
                //ViewBag.CompanyCode = dd.Company_Code;
                //ViewBag.RegionCode = dd.Region_Code;
                ViewBag.UserCode = dd.User_Code;
                //ViewBag.Company_Id = dd.Company_Id;
                ViewBag.IsResponsive = "Yes";
                System.Web.HttpContext.Current.Session["IsResponsive"] = "Yes";
            }
            return View();
        }
        public JsonResult GetHDAccessInfo(string UserName, string subDomainName)
        {
            //string CompanyCode = "";
            //CompanyCode= _objCurrentInfo.GetCompanyCode();

            return Json(_blOrder.GetHDAccessInfo(UserName, subDomainName), JsonRequestBehavior.AllowGet);
        }

        public int InsertHDAccess(OrderFulfillment.HDAccessForUser obj)
        {
            //obj.LoginUserCode= _objCurrentInfo.GetUserCode();
            //obj.CompanyCode= obj.GetCompanyCode();
            int result = 0;
            return result = _blOrder.InsertHDAccess(obj, obj.subDomainName);
        }

        public ActionResult SingleDeviceLockRelease(string Lid = null)
        {
            // DataControl.CurrentInfo objCurInfo = new CurrentInfo();
            if (Lid == null)
            {
                ViewBag.CompanyCode = _objCurrentInfo.GetCompanyCode();
                ViewBag.UserCode = _objCurrentInfo.GetUserCode();
                ViewBag.IsResponsive = "No";
                ViewBag.subDomainName = _objCurrentInfo.GetSubDomain();
                System.Web.HttpContext.Current.Session["IsResponsive"] = "No";
            }
            else
            {
                string parameters = System.Text.ASCIIEncoding.ASCII.GetString(System.Convert.FromBase64String(Lid));
                ParameterMode dd = Newtonsoft.Json.JsonConvert.DeserializeObject<ParameterMode>(parameters);

                ViewBag.CompanyCode = dd.Company_Code;
                ViewBag.subDomainName = dd.SubDomain_Name;
                //ViewBag.CompanyCode = dd.Company_Code;
                //ViewBag.RegionCode = dd.Region_Code;
                ViewBag.UserCode = dd.User_Code;
                //ViewBag.Company_Id = dd.Company_Id;
                ViewBag.IsResponsive = "Yes";
                System.Web.HttpContext.Current.Session["IsResponsive"] = "Yes";
            }
            return View();
        }

        public JsonResult GetSingleDeviceLockEntries(string UserName, string DeviceGuid, string subDomainName)
        {
            //CompanyCode= _objCurrentInfo.GetCompanyCode();
            return Json(_blOrder.GetSingleDeviceLockEntries(UserName, DeviceGuid, subDomainName), JsonRequestBehavior.AllowGet);
        }

        public int ReleaseSingleDeviceLock(OrderFulfillment.ReleaseSingleDeviceLock obj)
        {
            //obj.LoginUserCode= _objCurrentInfo.GetUserCode();
            //obj.CompanyCode= obj.GetCompanyCode();
            int result = 0;
            return result = _blOrder.ReleaseSingleDeviceLock(obj, obj.subDomainName);
        }

        //Single Device Lock Release
        public JsonResult GetSingleDeviceEntriesByGuid(string LoginUserCode)
        {

            IEnumerable<SingleDeviceGUID> lstUser = new List<SingleDeviceGUID>();
            try
            {
                BLUser objDept = new BLUser();
                lstUser = objDept.GetSingleDeviceEntriesByGuid(LoginUserCode).ToList();

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
            }
            return Json(lstUser, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetHDAccessUsersDetails(string LoginUserCode)
        {
            //String CompanyCode = "";
            //CompanyCode = _objCurrentInfo.GetCompanyCode();
            List<HDAccessDetails> lstUser = new List<HDAccessDetails>();
            try
            {
                BLUser objDept = new BLUser();
                lstUser = objDept.GetHDAccessUsersDetails(LoginUserCode).ToList();

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
            }
            return Json(lstUser, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSingleDeviceLoginReleaseHistory(string UserCode)
        {
            //string CompanyCode = "";
            //CompanyCode= _objCurrentInfo.GetCompanyCode();

            return Json(_blOrder.GetSingleDeviceLoginReleaseHistory(UserCode), JsonRequestBehavior.AllowGet);
        }
    }
}
