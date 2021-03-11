using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using DataControl;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class DivisionController : Controller
    {
        //
        // GET: /Division/

        public ActionResult Index()
        {
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            string getusertypename = GetUserType();
            ViewBag.getusertypename = getusertypename;
            ViewBag.CompanyCode = _objCurInfo.GetCompanyCode();
            ViewBag.UserName = _objCurInfo.GetUserName();
            ViewBag.User_Code = _objCurInfo.GetUserCode();
            ViewBag.Region_Code = _objCurInfo.GetRegionCode();
            return View();
        }
        public ActionResult DivisionEntityMapping()
        {
           
            return View();
        }

        public string GetUserType()
        {
             DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
             string getusertypename = _objCurInfo.GetUserTypeName();
             return getusertypename;
        }

        public string GetDivisions()
        {
            StringBuilder strtblContent = new StringBuilder();
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLDivision _objBlDivision = new DataControl.BLDivision();
            List<MVCModels.DivisionModel> lstDivision = new List<MVCModels.DivisionModel>();
            try
            {
                lstDivision = _objBlDivision.GetDivisions(_objCurInfo.GetCompanyCode());
                strtblContent.Append("<table class='table table-striped'><thead><tr><th>Edit</th><th>Division Name</th><th>Line Of Business</th><th>Status</th><th>Change Status</th></tr></thead><tbody>");
                if (lstDivision.Count > 0)
                {
                    for (int i = 0; i < lstDivision.Count; i++)
                    {
                        strtblContent.Append("<tr><td><a onclick='fnEditDivision(\"" + lstDivision[i].Division_Code + "\");'>Edit</a></td>");
                        strtblContent.Append("<td>" + lstDivision[i].Division_Name + "</td>");
                        strtblContent.Append("<td>" + lstDivision[i].Lineofbussiness + "</td>");
                        if (lstDivision[i].Record_Status == "1")
                        {
                            strtblContent.Append("<td id='tdDelete_" + i + "'>Enabled</td>");
                        }
                        else
                        {
                            strtblContent.Append("<td id='tdDelete_" + i + "'>Disabled</td>");
                        }
                        strtblContent.Append("<td><a onclick='fnDeleteDivision(\"" + lstDivision[i].Division_Code + "\",\"" + lstDivision[i].Record_Status
                            + "\");'>Change Status</a></td></tr>");
                    }
                    strtblContent.Append("</tbody></table>");
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("strtblContent", strtblContent.ToString());
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            DataControl.JSONConverter _objJson = new DataControl.JSONConverter();
            return strtblContent.ToString() + "$" + _objJson.Serialize(lstDivision);
        }
        public int InsertDivision(string divisionCode, string divisionName, string mode,string divisionline)
        {
            DataControl.BLDivision _objBlDivision = new DataControl.BLDivision();
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            return _objBlDivision.InsertDivision(_objCurInfo.GetCompanyCode(), divisionCode, divisionName, mode, _objCurInfo.GetUserName(),divisionline);
        }

        public int DeleteDivision(string divisionCode, string status)
        {
            string result = string.Empty;
            DataControl.BLDivision _objBlDivision = new DataControl.BLDivision();
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            return _objBlDivision.DeleteDivision(_objCurInfo.GetCompanyCode(), divisionCode, status, _objCurInfo.GetUserName());
        }
        public JsonResult GetApprovedDoctorsByRegion(string regionCode)
        {
            DataControl.BL_Customer _objCus = new DataControl.BL_Customer();
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            List<MVCModels.HiDoctor_Master.DoctorModel> lstDoctor = new List<MVCModels.HiDoctor_Master.DoctorModel>();
            lstDoctor = _objCus.GetApprovedDoctorsByRegion(_objCurInfo.GetCompanyCode(), regionCode);
            DataControl.JSONConverter _objJson = new DataControl.JSONConverter();
            return Json(_objJson.Serialize(lstDoctor));
        }
        public JsonResult GetSpeciality()
        {
            DataControl.BLProduct _objProduct = new DataControl.BLProduct();
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            List<MVCModels.HiDoctor_Master.SpecialityModel> lstSpeciality = new List<MVCModels.HiDoctor_Master.SpecialityModel>();
            lstSpeciality = _objProduct.GetSpeciality(_objCurInfo.GetCompanyCode());
            DataControl.JSONConverter _objJson = new DataControl.JSONConverter();
            return Json(_objJson.Serialize(lstSpeciality));
        }
        public JsonResult GetAllActiveProducts()
        {
            DataControl.BLProduct _objProduct = new DataControl.BLProduct();
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            List<MVCModels.HiDoctor_Master.ProductModel> lstProduct = new List<MVCModels.HiDoctor_Master.ProductModel>();
            lstProduct = _objProduct.GetAllActiveProducts(_objCurInfo.GetCompanyCode());
            DataControl.JSONConverter _objJson = new DataControl.JSONConverter();
            return Json(_objJson.Serialize(lstProduct));
        }
        public int InsertDivisionEntityMapping(string divisionCode, string entityCode, string entityName)
        {
            try
            {
                DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
                DataControl.BLDivision _objBlDivision = new DataControl.BLDivision();
                return _objBlDivision.DivisionEntityMapping(_objCurInfo.GetCompanyCode(), _objCurInfo.GetUserCode(), _objCurInfo.GetRegionCode(), entityCode, divisionCode, entityName, _objCurInfo.GetUserName());
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("EntityCode", entityCode);
                dicObj.Add("divisionCode", divisionCode);
                dicObj.Add("entityName", entityName);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return 0;
            }
        }
        public JsonResult GetGetDivisionEntityDetails(string divisionCode, string entityType)
        {
            DataControl.BLDivision _objMapping = new DataControl.BLDivision();
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            IEnumerable<MVCModels.DivisionEntityMapping> lstMapping = new List<MVCModels.DivisionEntityMapping>();
            lstMapping = _objMapping.GetDivisionEntityDetails(_objCurInfo.GetCompanyCode(), divisionCode, entityType);
            DataControl.JSONConverter _objJson = new DataControl.JSONConverter();
            return Json(_objJson.Serialize(lstMapping));
        }
        public JsonResult GetDivisionsBasedonLoggedUser()
        {
            List<MVCModels.DivisionModel> lstDivision = null;
            string companyCode = null;
            string regionCode = null;
            try
            {
                BLDivision _ObjDivisns = new BLDivision();
                CurrentInfo _ObjCurrentInfo = new CurrentInfo();
                companyCode = ViewBag.Company_Code = _ObjCurrentInfo.GetCompanyCode();
                regionCode = ViewBag.Region_Code = _ObjCurrentInfo.GetRegionCode();
                lstDivision = _ObjDivisns.GetDivisionsBasedonLoggedUser(companyCode, regionCode);
                return Json(lstDivision, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
