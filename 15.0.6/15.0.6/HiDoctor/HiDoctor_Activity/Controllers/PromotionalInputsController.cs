using System.Web.Mvc;
using DataControl;
using DataControl.HiDoctor_ActivityFactoryClasses;
using System.Collections.Generic;
using System.Text;
using MVCModels.HiDoctor_Master;
using HiDoctor_Activity.Models;
using MVCModels;
using System;
using System.Linq;

namespace HiDoctor_Activity.Controllers
{
    public class PromotionalInputsController : Controller
    {
        BLPromotionalInput _objBLPromotionalInput = new BLPromotionalInput();
        DataControl.JSONConverter _objJson = new DataControl.JSONConverter();
        private CurrentInfo _objCurrentInfo;
        //
        //
        // GET: /PromotionalInputs/

        public ActionResult PromotionalInputTransfer()
        {
            return View();
        }

        public ActionResult PromotionalInputApproval()
        {
            return View();
        }
        public JsonResult GetUsers(string effective_from, string effective_to)
        {
            _objBLPromotionalInput = new BLPromotionalInput();

            _objCurrentInfo = new CurrentInfo();
            List<MVCModels.PromotionalInputUserModel> lstusers = new List<MVCModels.PromotionalInputUserModel>();
            lstusers = _objBLPromotionalInput.GetUsers(_objCurrentInfo.GetCompanyCode(), _objCurrentInfo.GetUserCode(), effective_from, effective_to).ToList();
            return Json(_objJson.Serialize(lstusers));
        }
        public JsonResult GetUserProductdata(string UserCode)
        {
            _objBLPromotionalInput = new BLPromotionalInput();

            _objCurrentInfo = new CurrentInfo();
            List<MVCModels.Productmodel> lstproduct = new List<MVCModels.Productmodel>();
            lstproduct = _objBLPromotionalInput.GetUserProductdata(_objCurrentInfo.GetCompanyCode(), UserCode).ToList();
            return Json(_objJson.Serialize(lstproduct));
        }
        public bool Insertuserproduct(List<MVCModels.UserProductModel> lstuserproduct, string UserCode)
        {
            //string result = string.Empty;
            bool result = false;
            DataControl.CurrentInfo _objcurr = new CurrentInfo();
            string companyid = _objcurr.GetCompanyId();
            int Company_id = Int32.Parse(companyid);
            result = _objBLPromotionalInput.Insertuserproduct(_objcurr.GetCompanyCode(), _objcurr.GetUserCode(), Company_id, lstuserproduct, UserCode);
            return result;
        }
        public JsonResult GetRejectedUserProductdata(string username, string sourceusercode, string destinationusercode, int transferid)
        {
            _objBLPromotionalInput = new BLPromotionalInput();

            _objCurrentInfo = new CurrentInfo();
            List<MVCModels.Productmodel> lstproduct = new List<MVCModels.Productmodel>();
            lstproduct = _objBLPromotionalInput.GetRejectedUserProductdata(_objCurrentInfo.GetCompanyCode(), _objCurrentInfo.GetUserCode(), username, sourceusercode, destinationusercode, transferid).ToList();
            return Json(_objJson.Serialize(lstproduct));
        }


        //To show the list of data to be approved/////////////

        public JsonResult GetUsersForApproval()
        {
            _objBLPromotionalInput = new BLPromotionalInput();
            _objCurrentInfo = new CurrentInfo();
            List<MVCModels.promotionalApprovalModel> lstuserapproval = new List<MVCModels.promotionalApprovalModel>();
            lstuserapproval = _objBLPromotionalInput.GetUsersForApproval(_objCurrentInfo.GetCompanyCode(), _objCurrentInfo.GetUserCode()).ToList();
            return Json(lstuserapproval,JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="username"></param>
        /// <param name="sourceusercode"></param>
        /// <param name="destinationusercode"></param>
        /// <param name="transferid"></param>
        /// <returns></returns>
        //To show particular transfer details on clicking view

        public JsonResult GetUserDetailsOnView(string username, string sourceusercode, string destinationusercode, int transferid)
        {
            _objBLPromotionalInput = new BLPromotionalInput();
            _objCurrentInfo = new CurrentInfo();
            List<MVCModels.ViewTransferModel> lstviewselecteduser = new List<MVCModels.ViewTransferModel>();
            lstviewselecteduser = _objBLPromotionalInput.GetUserDetailsOnView(_objCurrentInfo.GetCompanyCode(), _objCurrentInfo.GetUserCode(), username, sourceusercode, destinationusercode, transferid).ToList();
            return Json(_objJson.Serialize(lstviewselecteduser));
        }
        public JsonResult GetUsersdata()
        {
            _objBLPromotionalInput = new BLPromotionalInput();

            _objCurrentInfo = new CurrentInfo();
            List<MVCModels.PromotionalInputUserModel> lstusers = new List<MVCModels.PromotionalInputUserModel>();
            lstusers = _objBLPromotionalInput.GetUsersdata(_objCurrentInfo.GetCompanyCode(), _objCurrentInfo.GetUserCode()).ToList();
            return Json(_objJson.Serialize(lstusers));
        }
        // For approving the Transfer Request
        /// <summary>
        /// 
        /// </summary>
        /// <param name="lstuserproduct"></param>
        /// <param name="UserCode"></param>
        /// <returns></returns>
        ///
        public bool ApproveUserRequest(List<MVCModels.UserProductModel> lstuserproduct)
        {
            //string result = string.Empty;
            bool result = false;
            DataControl.CurrentInfo _objcurr = new CurrentInfo();
            string companyid = _objcurr.GetCompanyId();
            int Company_id = Int32.Parse(companyid);
            result = _objBLPromotionalInput.ApproveUserRequest(_objcurr.GetCompanyCode(), _objcurr.GetUserCode(), Company_id, lstuserproduct);
            return result;
        }
        public bool Resubmitproductdata(List<MVCModels.UserProductModel> lstuserproduct)
        {
            //string result = string.Empty;
            bool result = false;
            DataControl.CurrentInfo _objcurr = new CurrentInfo();

            result = _objBLPromotionalInput.Resubmitproductdata(lstuserproduct);
            return result;
        }
        public bool RejectUserRequest(List<MVCModels.RejectedRequestModel> lstuserproduct, string UserCode)
        {
            _objBLPromotionalInput = new BLPromotionalInput();

            _objCurrentInfo = new CurrentInfo();
            bool result = false;
      
            //string companyid = _objCurrentInfo.GetCompanyId();
            //int Company_id = Int32.Parse(companyid);
            result = _objBLPromotionalInput.RejectUserRequest(_objCurrentInfo.GetCompanyCode(), _objCurrentInfo.GetUserCode(), lstuserproduct);
            return result;
        }
       
        public bool Canceluserrequest(List<MVCModels.UserProductModel> lstuserproduct)
        {
            //string result = string.Empty;
            bool result = false;
            DataControl.CurrentInfo _objcurr = new CurrentInfo();
            string companyid = _objcurr.GetCompanyId();
            int Company_id = Int32.Parse(companyid);
            result = _objBLPromotionalInput.Canceluserrequest(_objcurr.GetCompanyCode(), _objcurr.GetUserCode(), Company_id, lstuserproduct);
            return result;
        }

        public string Deliverychallan(string Deliverychallanno)
        {
            //string result = string.Empty;
            string result = string.Empty;
            DataControl.CurrentInfo _objcurr = new CurrentInfo();
          
            result = _objBLPromotionalInput.Deliverychallan(_objcurr.GetCompanyCode(), Deliverychallanno);
            return result;
        }
        public JsonResult GetUsersForApprovalHistory()
        {
            _objBLPromotionalInput = new BLPromotionalInput();
            _objCurrentInfo = new CurrentInfo();
            List<MVCModels.promotionalApprovalModel> lstuserapproval = new List<MVCModels.promotionalApprovalModel>();
            lstuserapproval = _objBLPromotionalInput.GetUsersForApprovalHistory(_objCurrentInfo.GetCompanyCode(), _objCurrentInfo.GetUserCode()).ToList();
            return Json(lstuserapproval, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetRemarksHistory(int TransId,string Product_Code)
        {
            _objBLPromotionalInput = new BLPromotionalInput();
            _objCurrentInfo = new CurrentInfo();
            List<MVCModels.promotionalApprovalModel> lstuserapproval = new List<MVCModels.promotionalApprovalModel>();
            lstuserapproval = _objBLPromotionalInput.GetRemarksHistory(_objCurrentInfo.GetCompanyCode(), TransId, Product_Code).ToList();
            return Json(lstuserapproval, JsonRequestBehavior.AllowGet);
        }
    }
}

