using DataControl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataControl.Abstraction;
using DataControl.Impl;
using DataControl.EnumType;
using MVCModels;
using DataControl.HD_MasterFactoryClasses;
//using DataControl.HiDoctor_ActivityFactoryClasses;

namespace HiDoctor_Master.Controllers
{
    public class SecondarySalesNewController : Controller
    {
        //
        // GET: /SecondarySalesNew/

        public ActionResult SecondarySalesEntry()
        {
            return View();
        }
        public ActionResult SecondarySalesDelete()
        {
            CurrentInfo _objCunr = new CurrentInfo();
            ViewBag.currentregioncode = _objCunr.GetRegionCode();
            return View();
        }

        /// <summary>
        /// Method to get Stockist for Delete Screen
        /// </summary>
        /// <param name="regionCode"></param>
        /// <param name="IncludeClosedStockiest"></param>
        /// <returns></returns>
        public JsonResult GetSSStockiestDetails(string regionCode)
        {
            string companyCode = null;
            List<MVCModels.StockiestData> lstStockiest = null;
            try
            {
                DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
                BL_SS _objApproval = new DataControl.HD_MasterFactoryClasses.BL_SS();
                companyCode = _objcurrentInfo.GetCompanyCode();
                lstStockiest = _objApproval.GetSSStockiestDetails(companyCode, regionCode);
                return Json(lstStockiest, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
            
        }


        public ActionResult SecondarySalesForCustomer()
        {
            return View();
        }
    }
 }

