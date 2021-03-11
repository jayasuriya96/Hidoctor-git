using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MVCModels;
using DataControl;
using DataControl.Abstraction;
using DataControl.EnumType;
using DataControl.Impl;

namespace HiDoctor_Master.Controllers
{
    public class OrderController : Controller
    {
        private IConfigSettings IConfig_Settings = null;
        private DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
        private BLOrder objBLOrder = new BLOrder();
        //
        // GET: /Order/

        public ActionResult OrderList()
        {
            BLUser objUser = new BLUser();
            List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
            lstUser = objUser.GetChildUsersCodeAndNameOnly(_objCurrentInfo.GetCompanyCode(), _objCurrentInfo.GetUserCode());
            ViewBag.Child_User_Count = lstUser.Count();

            string strRegionCode = _objCurrentInfo.GetRegionCode();
            strRegionCode += "^";
            ViewBag.LineOfBusiness = objBLOrder.GetCheckLineOfBusiness(strRegionCode);
            ViewBag.Region_Code = _objCurrentInfo.GetRegionCode();
            ViewBag.Region_Name = _objCurrentInfo.GetRegionName();
            ViewBag.Current_Month = System.DateTime.Now.Month + "-" + System.DateTime.Now.Year;
            ViewBag.Previous_Month = System.DateTime.Now.AddMonths(-1).Month + "-" + System.DateTime.Now.AddMonths(-1).Year;
            ViewBag.Next_Month = System.DateTime.Now.AddMonths(1).Month + "-" + System.DateTime.Now.AddMonths(1).Year;
            return View();
        }

        public JsonResult GetOrderList(OrderInputs objOrderInputs)
        {
            objBLOrder.objOrder.orderInputs.startDate = objOrderInputs.startDate;
            objBLOrder.objOrder.orderInputs.endDate = objOrderInputs.endDate;
            objBLOrder.objOrder.orderInputs.Region_Code = objOrderInputs.Region_Code;
            return Json(objBLOrder.GetOrderList(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult PutOrderStatus(OrderInputs objOrderInputs)
        {
            objBLOrder.objOrder.orderInputs.Order_Id = objOrderInputs.Order_Id;
            objBLOrder.objOrder.orderInputs.Order_Status = objOrderInputs.Order_Status;
            objBLOrder.objOrder.orderInputs.Order_Mode = objOrderInputs.Order_Mode;
            objBLOrder.objOrder.orderInputs.Order_Date = objOrderInputs.Order_Date;
            objBLOrder.objOrder.orderInputs.User_Code = _objCurrentInfo.GetUserCode();
            return Json(objBLOrder.PutOrderStatus(), JsonRequestBehavior.AllowGet);
        }

        public ActionResult OrderAdd(string id)
        {
            BLUser objUser = new BLUser();
            List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
            lstUser = objUser.GetChildUsersCodeAndNameOnly(_objCurrentInfo.GetCompanyCode(), _objCurrentInfo.GetUserCode());
            ViewBag.Child_User_Count = lstUser.Count();

            string OrderMode = id.Split('~')[0];
            if (OrderMode == "Add")
            {
                ViewBag.OrderMode = OrderMode;
                ViewBag.action_Region_Code = _objCurrentInfo.GetRegionCode();
            }
            else
            {
                ViewBag.OrderMode = OrderMode;
                ViewBag.Order_Id = id.Split('~')[1];
                ViewBag.action_Region_Code = id.Split('~')[2];
            }

            ViewBag.Current_Date = System.DateTime.Now.ToString("yyyy-MM-dd");
          
            ViewBag.action_User_Name = _objCurrentInfo.GetUserName();
            ViewBag.action_User_Code = _objCurrentInfo.GetUserCode();
            ViewBag.Current_Month = System.DateTime.Now.Month + "-" + System.DateTime.Now.Year;
            ViewBag.Previous_Month = System.DateTime.Now.AddMonths(-1).Month + "-" + System.DateTime.Now.AddMonths(-1).Year;
            ViewBag.Next_Month = System.DateTime.Now.AddMonths(1).Month + "-" + System.DateTime.Now.AddMonths(1).Year;
            return View();
        }


        public JsonResult GetStockist(string accom_Regioncodes)
        {
            var lstStockiestAuto = new List<DCRStockiestModel>();
            try
            {
                var _objDCRStockiestExpense = new BL_DCRStockiestExpense();
                var _objDCRBL = new BL_DCRStockiestExpense();
                lstStockiestAuto = _objDCRBL.GetAccompaistStockist(_objCurrentInfo.GetCompanyCode(), accom_Regioncodes, accom_Regioncodes, "");

            }
            catch (Exception ex)
            {
            }
            return Json(lstStockiestAuto);
        }
     
        private string GetDoctorSufPreColumns(string company_Code)
        {
            IConfig_Settings = new Config_Settings();
            return IConfig_Settings.GetConfigDefaultValue(company_Code, CONFIG_TYPE.DCR, CONFIG_KEY.DCR_DOCTOR_SUFIX_COLUMNS);

        }

        public JsonResult GetDoctorOrChemist(string Region_Code, string showAccDataValue, string dcrActualDate)
        {
            BL_DCRDoctorVisit _objBL_DCRDoctorVisit = new BL_DCRDoctorVisit();
            List<DCRDoctorVisitModel> lstDCRDoctorVisitModel = null;
            string DoctorNameSufPreConfigValue = GetDoctorSufPreColumns(_objCurrentInfo.GetCompanyCode());
            lstDCRDoctorVisitModel = _objBL_DCRDoctorVisit.GetDoctorsList(_objCurrentInfo.GetCompanyCode(), Region_Code, Region_Code, showAccDataValue, DoctorNameSufPreConfigValue, dcrActualDate);
            return Json(lstDCRDoctorVisitModel, JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetProduct(string Region_Code)
        {
            objBLOrder.objOrder.orderInputs.Company_Code = _objCurrentInfo.GetCompanyCode();
            objBLOrder.objOrder.orderInputs.Region_Code = Region_Code;
            return Json(objBLOrder.GetProduct(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult SetOrder(OrderAdd orderAdd)
        {
            objBLOrder.objOrder.orderInputs.Company_Code = _objCurrentInfo.GetCompanyCode();
            objBLOrder.objOrder.orderAdd = orderAdd;
            return Json(objBLOrder.SetOrder(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetOrder(int orderId)
        {
            objBLOrder.objOrder.orderInputs.Order_Id = orderId;
            return Json(objBLOrder.GetOrder(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetUserDetails(string Region_Code)
        {
            objBLOrder.objOrder.orderInputs.Region_Code = Region_Code;
            return Json(objBLOrder.GetUserDetails(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetLineOfBusiness(string Region_Code)
        {
            Region_Code += "^";
            return Json(objBLOrder.GetCheckLineOfBusiness(Region_Code), JsonRequestBehavior.AllowGet);
        }

    }
}
