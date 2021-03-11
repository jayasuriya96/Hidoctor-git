using DataControl;
using DataControl.HD_MasterFactoryClasses;
using MVCModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class PurchaseRequisitionController : Controller
    {


        #region BLObject
        BL_PurchaseRequisition ObjPR = new BL_PurchaseRequisition();
        CurrentInfo ObjCurrInfo = new CurrentInfo();
        #endregion BLObject

        #region  ActionResults
    
        //ActionResult to Direct into  Purchase Requisition Form
        public ActionResult PurchaseRequisitionForm(string CampaignCode,string StartDate,string EndDate)
        {
            ViewBag.User_Name = ObjCurrInfo.GetUserName();
            ViewBag.User_Code = ObjCurrInfo.GetUserCode();
            ViewBag.CampaignCode = CampaignCode;
            ViewBag.StartDate = StartDate;
            ViewBag.EndDate = EndDate;
            return View();
        }


        public ActionResult PlaceOrderForm()
        {
            return View();
        } 

        public ActionResult PurchaseDispatch()
        {
            ViewBag.User_Code = ObjCurrInfo.GetUserCode();
            return View();
        }

        public ActionResult RequisitionSummary()
        {
            return View();
        }
        #endregion

        /// <summary>
        /// Method to Get All Marketing Campaigns for Dropdown
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [ActionName("GetAllCampaignsBasedonRegion")]
        public JsonResult GetAllCampaignsBasedonRegion()
        {
            string companyCode = null;
            string currentregionCode = null;
            List<CampaignModel> lstCamp = null;
            try
            {
                companyCode = ObjCurrInfo.GetCompanyCode();
                currentregionCode = ObjCurrInfo.GetRegionCode();
                lstCamp = ObjPR.GetAllCampaignsBasedonRegion(companyCode, currentregionCode).ToList();
                return Json(lstCamp, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        /// <summary>
        /// Method to get all Sample Products Based on Divisions Mapped to Current Region
        /// </summary>
        /// <param name="campaignCode"></param>
        /// <returns></returns>
        [HttpGet]
        [ActionName("GetSampleProducts")]
        public JsonResult GetSampleProducts(string campaignCode)
        {
            string companyCode = null;
            string currentregionCode = null;
            List<SampleProductModel> lstSamp = null;
            try
            {
                companyCode = ObjCurrInfo.GetCompanyCode();
                currentregionCode = ObjCurrInfo.GetRegionCode();
                lstSamp = ObjPR.GetSampleProducts(companyCode, campaignCode, currentregionCode).ToList();
                return Json(lstSamp, JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex)
            {
                throw;
            }
        }
        /// <summary>
        /// Method to Insert Purchase Requisition Form
        /// </summary>
        /// <param name="ObjPurchaseRequisitionModel"></param>
        /// <returns></returns>

        public bool InsertPurchaseRequisition(PurchaseRequisitionModel ObjPurchaseRequisitionModel)
        {
            bool result = false;
            string companyCode = null;
            int companyId = 0;
            string companyid = null;
            string createdBy = null;
            string regionCode = null;
            try
            {
                companyCode = ObjCurrInfo.GetCompanyCode();
                companyid = ObjCurrInfo.GetCompanyId();
                Int32.TryParse(companyid, out companyId);
                createdBy = ObjCurrInfo.GetUserCode();
                regionCode = ObjCurrInfo.GetRegionCode();
                result = ObjPR.InsertPurchaseRequisition(companyCode, companyId, createdBy, ObjPurchaseRequisitionModel, regionCode);

            }catch(Exception ex)
            {
                throw;
            }
            return result;
        }
        public long GetNextRowId()
        {
            long value = 0;
            try
            {
                value = ObjPR.GetNextRowId();
            }catch(Exception ex)
            {
                throw;
            }
            return value;
        }

        /// <summary>
        /// Method to get all purchase requisitions for place order
        /// </summary>
        /// <returns></returns>

        public JsonResult GetAllPurchaseRequisitions()
        {
            RequisitionModel lstReq = null;
            string companyCode = null;
            try
            {
                companyCode = ObjCurrInfo.GetCompanyCode();
                lstReq = ObjPR.GetAllPurchaseRequisitions(companyCode);
                return Json(lstReq, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        /// <summary>
        /// Method to Acknowledge Line Item,Receipt
        /// </summary>
        /// <param name="mode"></param>
        /// <param name="UpdateId"></param>
        /// <returns></returns>

        public bool UpdateAcknowledgement(string mode,int UpdateId)
        {
            bool result = false;
            string companyCode = null;
            string updatedBy = null;
            try
            {
                companyCode = ObjCurrInfo.GetCompanyCode();
                updatedBy = ObjCurrInfo.GetUserCode();
                result = ObjPR.UpdateAcknowledgement(companyCode, mode, UpdateId, updatedBy);
            }
            catch(Exception ex)
            {
                throw;
            }
            return result;
        }

        /// <summary>
        /// Method to save place order form
        /// </summary>
        /// <param name="requisition_Id"></param>
        /// <returns></returns>
        public bool InsertPlaceOrderDetails(PlaceOrderModel Objplaceorder)
        {
            bool result = false;
            string companyCode = null;
            string created_By = null;
            string companyid = null;
            int companyId = 0;          
            try
            {
                companyCode = ObjCurrInfo.GetCompanyCode();
                created_By = ObjCurrInfo.GetUserCode();
                companyid = ObjCurrInfo.GetCompanyId();
                Int32.TryParse(companyid, out companyId);
                result = ObjPR.InsertPlaceOrderDetails(companyCode, companyId, Objplaceorder, created_By);
            }
            catch(Exception ex)
            {
                throw;
            }
            return result;
        }
        /// <summary>
        /// Mehtod to Get All Place Ordered Details for Receipts
        /// </summary>
        /// <returns></returns>
        public JsonResult GetAllPlaceOrders()
        {
            List<PlaceOrderModel> lstPlaceOrders = null;
            try
            {
                lstPlaceOrders = ObjPR.GetAllPlaceOrders();
                return Json(lstPlaceOrders, JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex)
            {
                throw;
            }
        }

        /// <summary>
        /// Method to Save Receipt Details
        /// </summary>
        /// <param name="ObjReceipt"></param>
        /// <returns></returns>
        public bool InsertReceiptDetails(ReceiptModel objReceipt)
        {
            bool result = false;
            string companyCode = null;
            string companyid = null;
            int companyId = 0;
            string createdby = null;
            try
            {
                companyCode = ObjCurrInfo.GetCompanyCode();
                companyid = ObjCurrInfo.GetCompanyId();
                Int32.TryParse(companyid, out companyId);
                createdby = ObjCurrInfo.GetUserCode();
                result = ObjPR.InsertReceiptDetails(companyCode, companyId, objReceipt, createdby);
            }
            catch(Exception ex)
            {
                throw;
            }
            return result;
        }
        /// <summary>
        /// Method to get all Receipts for Dispatch
        /// </summary>
        /// <returns></returns>
        public JsonResult GetAllReceiptstoDispatch()
        {
            List<ReceiptModel> lstRec = null;
            string companyCode = null;
            try
            {
                companyCode = ObjCurrInfo.GetCompanyCode();
                lstRec = ObjPR.GetAllReceiptstoDispatch(companyCode);
                return Json(lstRec, JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex)
            {
                throw;
            }
        }
        public JsonResult GetActiveUsers(string userCode, string includeOneLevelParent, string excludeFirstLevel)
        {
            List<ICEUserTreeModel> lstUsers = null;
            string companyCode = null;
            string CurrentuserCode = null;
            try
            {
                companyCode = ObjCurrInfo.GetCompanyCode();
                CurrentuserCode = ObjCurrInfo.GetUserCode();
                lstUsers = ObjPR.GetActiveUsers(companyCode,userCode,includeOneLevelParent,excludeFirstLevel,CurrentuserCode);
                return Json(lstUsers, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public bool InsertDispatchDetails(List<DispatchModel> lstDispatch)
        {
            bool result = false;
            string companyCode = null;
            string companyid = null;
            int companyId = 0;
            string createdBy = null;

            try
            {
                companyCode = ObjCurrInfo.GetCompanyCode();
                companyid = ObjCurrInfo.GetCompanyId();
                Int32.TryParse(companyid, out companyId);
                createdBy = ObjCurrInfo.GetUserCode();
                result = ObjPR.InsertDispatchDetails(companyCode, companyId, lstDispatch, createdBy);
            }
            catch(Exception ex)
            {
                throw;
            }
            return result;
        }
        public JsonResult GetRegionHierarchy(string campaignCode)
        {
            List<RegionDetailsModel> lstRegions = null;
            string companyCode = null;
            string regionCode = null;
            try
            {
                companyCode = ObjCurrInfo.GetCompanyCode();
                regionCode = ObjCurrInfo.GetRegionCode();
                lstRegions=ObjPR.GetRegionHierarchy(companyCode, campaignCode, regionCode);
                return Json(lstRegions, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {

                throw;
            }
        
        }
        public JsonResult GetAllChallans()
        {
            List<DispatchModel> lstChall = null;
            try
            {
                lstChall = ObjPR.GetAllChallans();
                return Json(lstChall, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {

                throw;
            }
            
        }
        public JsonResult GetAllInvoices()
        {
            List<ReceiptModel> lstInv = null;
            try
            {
                lstInv = ObjPR.GetAllInvoices();
                return Json(lstInv, JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex)
            {
                throw;
            }

        }
        public JsonResult GetAllRequisitionstoSummary(string Code,string mode,string startDate,string endDate)
        {
            PurchaseRequisitionSummary ObjSumm = null;
            string companyCode = null;
            string currentregionCode = null;
            try
            {
                companyCode = ObjCurrInfo.GetCompanyCode();
                currentregionCode = ObjCurrInfo.GetRegionCode();
                ObjSumm = ObjPR.GetAllRequisitionstoSummary(companyCode, currentregionCode, Code, mode, startDate, endDate);
                return Json(ObjSumm, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {

                throw;
            }
        }

        public JsonResult GetAllMarketingCampaignsFromRequisitions(string Code, string mode, string startDate, string endDate)
        {
            List<CampaignModel> lstMC = null;
            string companyCode = null;
            string currentregionCode = null;
            try
            {
                companyCode = ObjCurrInfo.GetCompanyCode();
                currentregionCode = ObjCurrInfo.GetRegionCode();
                lstMC = ObjPR.GetAllMarketingCampaignsFromRequisitions(companyCode, currentregionCode, Code, mode, startDate, endDate);
                return Json(lstMC, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {

                throw;
            }
        }
        public JsonResult GetAllOrdersProductWise(int Requisition_Details_Id)
        {
            List<PlaceOrderModel> lstOrders = null;
            try
            {
                lstOrders = ObjPR.GetAllOrdersProductWise(Requisition_Details_Id);
                return Json(lstOrders, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {

                throw;
            }      
        }
        public JsonResult GetAllReceiptsOrderWise(int Order_Id)
        {
            List<ReceiptModel> lstRecept = null;
            try
            {
                lstRecept = ObjPR.GetAllReceiptsOrderWise(Order_Id);
                return Json(lstRecept, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {

                throw;
            }
        }
        public JsonResult GetAllDispatchDetailsProductWise(int Requisition_Details_Id)
        {
            List<DispatchModel> lstDis = null;
            try
            {
                lstDis = ObjPR.GetAllDispatchDetailsProductWise(Requisition_Details_Id);
                return Json(lstDis, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {

                throw;
            }  
        }
    }
}
