using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataControl;
using MVCModels;
using DataControl.HD_MasterFactoryClasses;
using Newtonsoft.Json;
using System.Data.Metadata.Edm;

namespace HiDoctor_Master.Controllers
{
    public class PSAndSSController : Controller
    {
        //
        // GET: /PSAndSS/
        BL_PsAndSSSalesEntry _objBL_PsAndSSSalesEntry = new BL_PsAndSSSalesEntry();
        private DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();

        public ActionResult PSAndSSSalesEntry(string Lid)
        {
            //string parameters = System.Text.ASCIIEncoding.ASCII.GetString(System.Convert.FromBase64String(Lid));
            //ParameterMode obj = Newtonsoft.Json.JsonConvert.DeserializeObject<ParameterMode>(parameters);
            if (Lid == null)
            {
                ViewBag.subDomainName = _objCurrentInfo.GetSubDomain();
                ViewBag.CompanyCode = _objCurrentInfo.GetCompanyCode();
                ViewBag.LoginRegionCode = _objCurrentInfo.GetRegionCode();
                ViewBag.LoginUserCode = _objCurrentInfo.GetUserCode();
                ViewBag.CompanyId = _objCurrentInfo.GetCompanyId();
                ViewBag.IsResponsive = "No";
            }
            else
            {

                string parameters = System.Text.ASCIIEncoding.ASCII.GetString(System.Convert.FromBase64String(Lid));
                MVCModels.PSAndSSSalesEntry.ParameterMode dd = Newtonsoft.Json.JsonConvert.DeserializeObject<MVCModels.PSAndSSSalesEntry.ParameterMode>(parameters);


                ViewBag.subDomainName = dd.SubDomain_Name;
                ViewBag.CompanyCode = dd.Company_Code;
                ViewBag.LoginRegionCode = dd.Region_Code;
                ViewBag.LoginUserCode = dd.User_Code;
                ViewBag.CompanyId = dd.Company_Id;
                ViewBag.IsResponsive = "YES";

            }
            return View();

        }

        public ActionResult PSAndSSSalesRelease(string Lid)

        {
            if (Lid == null)
            {
                ViewBag.subDomainName = _objCurrentInfo.GetSubDomain();
                ViewBag.CompanyCode = _objCurrentInfo.GetCompanyCode();
                ViewBag.LoginRegionCode = _objCurrentInfo.GetRegionCode();
                ViewBag.LoginUserCode = _objCurrentInfo.GetUserCode();
                ViewBag.CompanyId = _objCurrentInfo.GetCompanyId();
                ViewBag.IsResponsive = "No";

            }
            else
            {
                string parameters = System.Text.ASCIIEncoding.ASCII.GetString(System.Convert.FromBase64String(Lid));
                MVCModels.PSAndSSSalesEntry.ParameterMode dd = Newtonsoft.Json.JsonConvert.DeserializeObject<MVCModels.PSAndSSSalesEntry.ParameterMode>(parameters);

                ViewBag.subDomainName = dd.SubDomain_Name;
                ViewBag.CompanyCode = dd.Company_Code;
                ViewBag.LoginRegionCode = dd.Region_Code;
                ViewBag.LoginUserCode = dd.User_Code;
                ViewBag.CompanyId = dd.Company_Id;
                ViewBag.IsResponsive = "YES";


            }

            return View();
        }
        public Dictionary<string, string> ConvertParameter(string Lid)
        {
            try
            {
                Dictionary<string, string> dicparams = new Dictionary<string, string>();
                string parameters = System.Text.ASCIIEncoding.ASCII.GetString(System.Convert.FromBase64String(Lid));
                string[] param = parameters.Split('~');
                string[] key = { "subDomainName", "CompanyCode", "RegionCode", "UserCode" };
                if (param.Length > 1)
                {
                    for (int index = 0; index < param.Length; index++)
                    {
                        dicparams.Add(key[index], param[index]);
                    }
                }

                return dicparams;
            }
            catch
            {
                throw;
            }

        }
        public Dictionary<string, string> ConvertParameterSales(string Lid)
        {
            try
            {
                Dictionary<string, string> dicparams = new Dictionary<string, string>();
                string parameters = System.Text.ASCIIEncoding.ASCII.GetString(System.Convert.FromBase64String(Lid));
                var obj = Newtonsoft.Json.JsonConvert.DeserializeObject(parameters);

                string[] param = parameters.Split('/');
                string[] key = { "subDomainName", "CompanyCode", "RegionCode", "UserCode" };
                if (param.Length > 1)
                {
                    for (int index = 0; index < param.Length; index++)
                    {
                        dicparams.Add(key[index], param[index]);
                    }
                }

                return dicparams;
            }
            catch
            {
                throw;
            }

        }
        public JsonResult GetAlreadyMappedData(string entityType, int month, int year, string selectedMappingCode, string mappingType, string subDomainName)
        {
            return Json(_objBL_PsAndSSSalesEntry.GetAlreadyMappedData(entityType, month, year, selectedMappingCode, mappingType, subDomainName), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetAllRegionName(string Region_Code, string subDomainName)
        {

            return Json(_objBL_PsAndSSSalesEntry.GetAllRegionName(Region_Code, subDomainName), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAllProductSales(string Region_Code, string subDomainName, string TypeOfMapping)
        {


            return Json(_objBL_PsAndSSSalesEntry.GetAllProductSales(Region_Code, subDomainName, TypeOfMapping), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetConfigMaster(string Config_Key, string Possible_Values, string Config_Value, string Type, string companycode, string subdomain)
        {
            return Json(_objBL_PsAndSSSalesEntry.GetConfigMaster(Config_Key, Possible_Values, Config_Value, Type, companycode, subdomain), JsonRequestBehavior.AllowGet);

        }
        public JsonResult GetCustomerDetails(string RegionCode, string subDomainName, string Value, string SDate, int month, int year)
        {
            return Json(_objBL_PsAndSSSalesEntry.GetCustomerDetails(RegionCode, subDomainName, Value, SDate, month, year), JsonRequestBehavior.AllowGet);
        }

        public int GetInsertProductSales(PSAndSSSalesEntry.PPAndSS _ObjData)
        {
            //_objBL_PsAndSSSalesEntry.Region_Code = _ObjData.Region_Code;
            ////_objBatch.EntityCode = _ObjData.EntityCode;
            ////_objBatch.Entity = _ObjData.Entity;
            //_objBL_PsAndSSSalesEntry.Month = _ObjData.Month;
            //_objBL_PsAndSSSalesEntry.Year = _ObjData.Year;
            //_objBL_PsAndSSSalesEntry.Date = _ObjData.Date;
            //_objBL_PsAndSSSalesEntry.EntityName = _ObjData.EntityName;
            //_objBL_PsAndSSSalesEntry.lstProductSales = _ObjData.lstProductSales;
            //_objBL_PsAndSSSalesEntry.User_Code = _ObjData.User_Code;
            //_objBL_PsAndSSSalesEntry.CompanyId = _ObjData.CompanyId;
            //_objBL_PsAndSSSalesEntry.TypeOfMapping = _ObjData.TypeOfMapping;
            //_objBL_PsAndSSSalesEntry.subDomainName = _ObjData.subDomainName;

            return _objBL_PsAndSSSalesEntry.GetInsertProductSales(_ObjData);
        }
        public JsonResult GetAllEntityProduct(string Region_Code, string subDomainName)
        {

            return Json(_objBL_PsAndSSSalesEntry.GetAllEntityProduct(Region_Code, subDomainName), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetEntitySalesMob(string User_Code, string subDomainName, string privilege_Name, string default_value)
        {
            //_objBL_PsAndSSSalesEntry.User_Code = _obj.User_Code;
            //_objBL_PsAndSSSalesEntry.subDomainName = _obj.subDomainName;
            //_objBL_PsAndSSSalesEntry.privilege_Name = _obj.privilege_Name;
            //_objBL_PsAndSSSalesEntry.default_value = _obj.default_value;
            return Json(_objBL_PsAndSSSalesEntry.GetEntitySalesMob(User_Code, subDomainName, privilege_Name, default_value), JsonRequestBehavior.AllowGet);

        }
        public JsonResult GetAllSalesDetails(string Region_Code, string subDomainName, string Entity_Type, int Month, int Year)
        {

            return Json(_objBL_PsAndSSSalesEntry.GetAllSalesDetails(Region_Code, subDomainName, Entity_Type, Month, Year), JsonRequestBehavior.AllowGet);
        }
        public int GetUpdateProductSales(PSAndSSSalesEntry.PPAndSS _ObjData)
        {
            //_objBatch.Region_Code = _ObjData.Region_Code;
            //_objBatch.EntityCode = _ObjData.EntityCode;
            //_objBatch.Entity = _ObjData.Entity;
            //_objBatch.Month = _ObjData.Month;
            //_objBatch.Year = _ObjData.Year;
            //_objBatch.Date = _ObjData.Date;
            //_objBatch.EntityName = _ObjData.EntityName;
            //_objBatch.Sales_Id = _ObjData.Sales_Id;
            //_objBatch.lstProductSales = _ObjData.lstProductSales;
            //_objBatch.User_Code = _ObjData.User_Code;
            //_objBatch.CompanyId = _ObjData.CompanyId;
            //_objBatch.TypeOfMapping = _ObjData.TypeOfMapping;
            //_objBatch.subDomainName = _ObjData.subDomainName;
            return _objBL_PsAndSSSalesEntry.GetUpdateProductSales(_ObjData);
        }
        public JsonResult GetAllEntityDetails(string Region_Code, string EntityCode, string Entity, int Month, int Year, string TypeOfMapping, string subDomainName)
        {

            return Json(_objBL_PsAndSSSalesEntry.GetAllEntityDetails(Region_Code, EntityCode, Entity, Month, Year, TypeOfMapping, subDomainName), JsonRequestBehavior.AllowGet);
        }
        public int GetEntityStatusChange(PSAndSSSalesEntry.PPAndSS _ObjData)
        {
            //_objBatch.User_Code = _obj.User_Code;
            //_objBatch.subDomainName = _obj.subDomainName;
            //_objBatch.Sales_Id = _obj.Sales_Id;
            //_objBatch.Remark = _obj.Remark;
            return _objBL_PsAndSSSalesEntry.GetEntityStatusChange(_ObjData);
        }
        public int GetMultipleEntityStatusChange(PSAndSSSalesEntry.PPAndSS _ObjData)
        {

            //_objBatch.lstSaleEntity = _obj.lstSaleEntity;
            //_objBatch.Remark = _obj.Remark;
            return _objBL_PsAndSSSalesEntry.GetMultipleEntityStatusChange(_ObjData);
        }
    }
}
