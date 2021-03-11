using DataControl;
using DataControl.HD_MasterFactoryClasses;
using MVCModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class MasterDataDownloadController : Controller
    {
        //
        // GET: /MasterDataDownload/
        BL_MasterDataDownload _objBLMasterDataDownload = new BL_MasterDataDownload();
        public ActionResult MasterDataDownload()
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            ViewBag.Companycode = objCurInfo.GetCompanyCode();
            ViewBag.UserCode = objCurInfo.GetUserCode();
            ViewBag.RegionCode = objCurInfo.GetRegionCode();
            ViewBag.Usercode = objCurInfo.GetUserCode();
            return View();
        }

        public bool InsertMasterData(List<MasterDataModel> lstUsers)
        {
            bool result = false;
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            result = _objBLMasterDataDownload.InsertMasterData(lstUsers);
            return result;
        }

        public JsonResult GetMasterData(string FromDate, string ToDate)
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            List<MasterDetails> lstUsrLvDet = new List<MasterDetails>();
            lstUsrLvDet = _objBLMasterDataDownload.GetMasterData(FromDate, ToDate);
            return Json(lstUsrLvDet, JsonRequestBehavior.AllowGet);
        }


        //For Tree

        public string GetUsersByUserNameEmployeeNameMD(string userName, string treeId, string filterId)
        {
            StringBuilder strContent = new StringBuilder();
            try
            {
                BLUser objUser = new BLUser();
                DataControl.CurrentInfo objCurInfo = new CurrentInfo();
                List<MVCModels.HiDoctor_Master.UserModel> lstUser = new List<MVCModels.HiDoctor_Master.UserModel>();
                lstUser = (List<MVCModels.HiDoctor_Master.UserModel>)objUser.GetUsersByUserNameNew(objCurInfo.GetCompanyCode(), userName, objCurInfo.GetUserCode());
                if (lstUser.Count > 0)
                {
                    strContent.Append("<div class='list-group'>");
                    foreach (MVCModels.HiDoctor_Master.UserModel user in lstUser)
                    {

                        strContent.Append("<li><a href='#' class='list-group-item' onclick='fnBindTreeWithSelectedUserChecked(\"" + user.User_Code + "\",\""
                            + treeId + "\",\"" + filterId + "\");'>" + user.Employee_Name + "(" + user.User_Name + ")" + "," + user.User_Type_Name + "," + user.Region_Name + "</li>");
                    }
                    strContent.Append("</div>");
                }
                else
                {
                    strContent.Append("NO_USERS");
                }
            }

            catch (Exception ex)
            {
                strContent.Append("NO_USERS");
            }
            return strContent.ToString();
        }
    }
}
