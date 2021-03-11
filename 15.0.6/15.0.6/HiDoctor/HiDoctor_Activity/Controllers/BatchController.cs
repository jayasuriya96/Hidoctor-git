using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataControl;
using MVCModels;
using DataControl.HiDoctor_ActivityFactoryClasses;
using Newtonsoft.Json;
using HiDoctor_Activity.Models;

namespace HiDoctor_Activity.Controllers
{
    public class BatchController : Controller
    {
        //
        // GET: /Batch/
        BL_Batch _objBatch = new BL_Batch();
        private DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
        public ActionResult BatchCreation()
        {
            ViewBag.subDomainName = _objCurrentInfo.GetSubDomain();
            ViewBag.CompanyCode = _objCurrentInfo.GetCompanyCode();
            ViewBag.LoginRegionCode = _objCurrentInfo.GetRegionCode();
            ViewBag.LoginUserCode = _objCurrentInfo.GetUserCode();
            return View();
        }
        public ActionResult BatchCreationMoblie(string Lid)
        {
            // string subDomainName, CompanyCode, RegionCode, UserCode;
            //Dictionary<string, string> param = ConvertParameter(Lid);
            //param.TryGetValue("subDomainName", out subDomainName);
            //param.TryGetValue("CompanyCode", out CompanyCode);
            //param.TryGetValue("RegionCode", out RegionCode);
            //param.TryGetValue("UserCode", out UserCode);
            string parameters = System.Text.ASCIIEncoding.ASCII.GetString(System.Convert.FromBase64String(Lid));
            ParameterMode obj = Newtonsoft.Json.JsonConvert.DeserializeObject<ParameterMode>(parameters);
            ViewBag.subDomainName = obj.SubDomain_Name;
            ViewBag.CompanyCode = obj.Company_Code;
            ViewBag.LoginRegionCode = obj.Region_Code;
            ViewBag.LoginUserCode = obj.User_Code;
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
        public JsonResult GetBatchDetails(Batch.BatchData _objData)
        {
            _objBatch.status = _objData.status;
            _objBatch.Region_Code = _objData.Region_Code;
            _objBatch.CustomerCode = _objData.CustomerCode;
            _objBatch.subDomainName = _objData.subDomainName;
            return Json(_objBatch.GetBatchDetails(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetDoctorName(Batch.BatchData _objData)
        {
            _objBatch.Region_Code = _objData.Region_Code;
            _objBatch.subDomainName = _objData.subDomainName;
            return Json(_objBatch.GetDoctorName(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetAllProductName(string Region_Code, string subDomainName)
        {
            _objBatch.Region_Code = Region_Code;
            _objBatch.subDomainName = subDomainName;
            return Json(_objBatch.GetAllProductName(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetAllRegionName(string Region_Code, string subDomainName)
     {
            _objBatch.Region_Code = Region_Code;
            _objBatch.subDomainName = subDomainName;
            return Json(_objBatch.GetAllRegionName(), JsonRequestBehavior.AllowGet);
        }
        public int GetSaveBatchDetalis(Batch.BatchData _objData)
        {
            _objBatch.Region_Code = _objData.Region_Code;
            _objBatch.User_Code = _objData.LoginUserCode;
            _objBatch.CustomerName = _objData.CustomerName;
            _objBatch.CustomerCode = _objData.CustomerCode;
            _objBatch.Customer_RegionCode = _objData.Customer_RegionCode;
            _objBatch.BatchName = _objData.BatchName;
            _objBatch.NoOfChicks = _objData.NoOfChicks;
            _objBatch.StartDate = _objData.StartDate;
            _objBatch.EndDate = _objData.EndDate;
            _objBatch.status = _objData.status;
            _objBatch.subDomainName = _objData.subDomainName;
            return _objBatch.GetSaveBatchDetalis();
        }
        public int GetUpDateBatchDetalis(Batch.BatchData _objData)
        {
            _objBatch.Region_Code = _objData.Region_Code;
            _objBatch.User_Code = _objData.LoginUserCode;
            _objBatch.CustomerName = _objData.CustomerName;
            _objBatch.CustomerCode = _objData.CustomerCode;
            _objBatch.Customer_RegionCode = _objData.Customer_RegionCode;
            _objBatch.BatchName = _objData.BatchName;
            _objBatch.Batch_Id = _objData.Batch_Id;
            _objBatch.NoOfChicks = _objData.NoOfChicks;
            _objBatch.StartDate = _objData.StartDate;
            _objBatch.EndDate = _objData.EndDate;
            _objBatch.status = _objData.status;
            _objBatch.subDomainName = _objData.subDomainName;
            return _objBatch.GetUpDateBatchDetalis();

        }
        public int GetInsertSchedule(Batch.BatchData _ObjData)
        {

            _objBatch.Product = _ObjData.Product;
            _objBatch.User_Code = _ObjData.LoginUserCode;
            _objBatch.ScheduleName = _ObjData.ScheduleName;
            _objBatch.StartDate = _ObjData.StartDate;
            _objBatch.EndDate = _ObjData.EndDate;
            _objBatch.Notes = _ObjData.Notes;
            _objBatch.NumofWeeks = _ObjData.NumofWeeks;
            _objBatch.Batch_Id = _ObjData.Batch_Id;
            _objBatch.subDomainName = _ObjData.subDomainName;
            return _objBatch.GetInsertSchedule();

        }
        public int GetUpdateSchedule(Batch.BatchData _ObjData)
        {

            _objBatch.Product = _ObjData.Product;
            _objBatch.User_Code = _ObjData.LoginUserCode;
            _objBatch.ScheduleName = _ObjData.ScheduleName;
            _objBatch.StartDate = _ObjData.StartDate;
            _objBatch.EndDate = _ObjData.EndDate;
            _objBatch.Notes = _ObjData.Notes;
            _objBatch.NumofWeeks = _ObjData.NumofWeeks;
            _objBatch.Batch_Id = _ObjData.Batch_Id;
            _objBatch.Schedule_Id = _ObjData.Schedule_Id;
            _objBatch.subDomainName = _ObjData.subDomainName;
            return _objBatch.GetUpdateSchedule();

        }
        public int GetDeleteSchedule(int Schedule_Id, string subDomainName)
        {
            return _objBatch.GetDeleteSchedule(Schedule_Id, subDomainName);
        }
        public JsonResult GetScheduledetails(Batch.BatchData _ObjData)
        {
            _objBatch.Batch_Id = _ObjData.Batch_Id;
            _objBatch.subDomainName = _ObjData.subDomainName;
            return Json(_objBatch.GetScheduledetails(), JsonRequestBehavior.AllowGet);
        }
        public int GetInsertQuantity(Batch.BatchData _ObjData)
        {
            _objBatch.Product = _ObjData.Product;
            _objBatch.User_Code = _ObjData.LoginUserCode; ;
            _objBatch.subDomainName = _ObjData.subDomainName;
            return _objBatch.GetInsertQuantity();
        }
        public JsonResult GetInformation(string Product_Id, string Batch_Id, string Schedule_Id, string subDomainName)
        {
            return Json(_objBatch.GetInformation(Product_Id, Batch_Id, Schedule_Id, subDomainName), JsonRequestBehavior.AllowGet);
        }
        public int GetChangeScheduleStatus(int Status, int Schedule_Id, string Remark, string User_Code, string subDomainName)
        {
            return _objBatch.GetChangeScheduleStatus(Status, Schedule_Id, User_Code, Remark, subDomainName);
        }
        public int GetScheduleStatus(int Schedule_Id, string subDomainName)
        {
            return _objBatch.GetScheduleStatus(Schedule_Id, subDomainName);
        }

        /****************************************************************************************************************************/
        #region Hospital Sales
        public ActionResult EntitySales()
        {
            ViewBag.subDomainName = _objCurrentInfo.GetSubDomain();
            ViewBag.CompanyCode = _objCurrentInfo.GetCompanyCode();
            ViewBag.LoginRegionCode = _objCurrentInfo.GetRegionCode();
            ViewBag.LoginUserCode = _objCurrentInfo.GetUserCode();
            ViewBag.CompanyId = _objCurrentInfo.GetCompanyId();
            return View();
        }
        public ActionResult EntitySalesMobile(string Lid)
        {

            //string subDomainName, CompanyCode, RegionCode, UserCode, Company_id;

            string parameters = System.Text.ASCIIEncoding.ASCII.GetString(System.Convert.FromBase64String(Lid));
            ParameterMode dd = Newtonsoft.Json.JsonConvert.DeserializeObject<ParameterMode>(parameters);

            ViewBag.subDomainName = dd.SubDomain_Name;
            ViewBag.CompanyCode = dd.Company_Code;
            ViewBag.LoginRegionCode = dd.Region_Code;
            ViewBag.LoginUserCode = dd.User_Code;
            ViewBag.CompanyId = dd.Company_Id;
            return View();
        }
        public ActionResult EntitySalesRelease(string Lid)
        {
            if (Lid == null)
            {
                ViewBag.subDomainName = _objCurrentInfo.GetSubDomain();
                ViewBag.CompanyCode = _objCurrentInfo.GetCompanyCode();
                ViewBag.LoginRegionCode = _objCurrentInfo.GetRegionCode();
                ViewBag.LoginUserCode = _objCurrentInfo.GetUserCode();
                ViewBag.CompanyId = _objCurrentInfo.GetCompanyId();
                ViewBag.IsResponsive = "No";
                System.Web.HttpContext.Current.Session["IsResponsive"] = "No";

            }
            else
            {
                string parameters = System.Text.ASCIIEncoding.ASCII.GetString(System.Convert.FromBase64String(Lid));
                ParameterMode dd = Newtonsoft.Json.JsonConvert.DeserializeObject<ParameterMode>(parameters);

                ViewBag.subDomainName = dd.SubDomain_Name;
                ViewBag.CompanyCode = dd.Company_Code;
                ViewBag.LoginRegionCode = dd.Region_Code;
                ViewBag.LoginUserCode = dd.User_Code;
                ViewBag.CompanyId = dd.Company_Id;
                ViewBag.IsResponsive = "Yes";
                System.Web.HttpContext.Current.Session["IsResponsive"] = "Yes";
            }
            return View();
        }
        //public ActionResult EntitySalesReleaseMobile(string Lid)
        //{
        //    string parameters = System.Text.ASCIIEncoding.ASCII.GetString(System.Convert.FromBase64String(Lid));
        //    ParameterMode dd = Newtonsoft.Json.JsonConvert.DeserializeObject<ParameterMode>(parameters);

        //    ViewBag.subDomainName = dd.SubDomain_Name;
        //    ViewBag.CompanyCode = dd.Company_Code;
        //    ViewBag.LoginRegionCode = dd.Region_Code;
        //    ViewBag.LoginUserCode = dd.User_Code;
        //    ViewBag.CompanyId = dd.Company_Id;
        //    TempData["IsResponsive"] = "Yes";
        //    TempData["encryptURL"] = Lid;
        //    return RedirectToAction("EntitySalesRelease", new { Lid = TempData["encryptURL"].ToString() });
        //}

        public JsonResult GetCustomerDetails(string RegionCode, string subDomainName, string Value, string SDate, string doctoMasterFrom, int month, int year)
        {
            return Json(_objBatch.GetCustomerDetails(RegionCode, subDomainName, Value, SDate, doctoMasterFrom, month, year), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetStateName(string subDomainName)
        {
            return Json(_objBatch.GetStateName(subDomainName), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetCityName(string subDomainName, string StateID)
        {
            return Json(_objBatch.GetCityName(subDomainName, StateID), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetHospitalName(string subDomainName, int StateID, int CityID)
        {
            return Json(_objBatch.GetHospitalName(subDomainName, StateID, CityID), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetAllProductSales(string Region_Code, string subDomainName, string TypeOfMapping)
        {
            _objBatch.Region_Code = Region_Code;
            _objBatch.subDomainName = subDomainName;
            //_objBatch.TypeOfMapping = TypeOfMapping;
            return Json(_objBatch.GetAllProductSales(), JsonRequestBehavior.AllowGet);
        }
        //public int GetSaveSalesMonth(Batch.BatchData _obj)
        //{
        //    _objBatch.Region_Code = _obj.Region_Code;
        //    _objBatch.EntityCode = _obj.EntityCode;
        //    _objBatch.Entity = _obj.Entity;
        //    _objBatch.Month = _obj.Month;
        //    _objBatch.Year = _obj.Year;
        //    _objBatch.Date = _obj.Date;
        //    _objBatch.subDomainName = _obj.subDomainName;
        //    _objBatch.CompanyId = _obj.CompanyId;
        //    _objBatch.User_Code = _obj.User_Code;
        //    _objBatch.EntityName = _obj.EntityName;
        //    return _objBatch.GetSaveSalesMonth();
        //}
        //public int GetUpdateSalesMonth(Batch.BatchData _obj)
        //{
        //    _objBatch.Region_Code = _obj.Region_Code;
        //    _objBatch.EntityCode = _obj.EntityCode;
        //    _objBatch.Entity = _obj.Entity;
        //    _objBatch.Month = _obj.Month;
        //    _objBatch.Year = _obj.Year;
        //    _objBatch.Date = _obj.Date;
        //    _objBatch.subDomainName = _obj.subDomainName;
        //    _objBatch.CompanyId = _obj.CompanyId;
        //    _objBatch.User_Code = _obj.User_Code;
        //    _objBatch.EntityName = _obj.EntityName;
        //    _objBatch.Sales_Id = _obj.Sales_Id;
        //    return _objBatch.GetUpdateSalesMonth();
        //}
        public JsonResult GetAllSalesDetails(Batch.BatchData _obj)
        {
            _objBatch.Region_Code = _obj.Region_Code;
            _objBatch.subDomainName = _obj.subDomainName;
            _objBatch.Entity_Type = _obj.Entity_Type;
            return Json(_objBatch.GetAllSalesDetails(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetAllEntityProduct(Batch.BatchData _obj)
        {
            _objBatch.Region_Code = _obj.Region_Code;
            _objBatch.subDomainName = _obj.subDomainName;
            return Json(_objBatch.GetAllEntityProduct(), JsonRequestBehavior.AllowGet);
        }
        public int GetInsertProductSales(Batch.BatchData _ObjData)
        {
            _objBatch.Region_Code = _ObjData.Region_Code;
            _objBatch.EntityCode = _ObjData.EntityCode;
            _objBatch.Entity = _ObjData.Entity;
            _objBatch.Month = _ObjData.Month;
            _objBatch.Year = _ObjData.Year;
            _objBatch.Date = _ObjData.Date;
            _objBatch.EntityName = _ObjData.EntityName;
            _objBatch.lstProductSales = _ObjData.lstProductSales;
            _objBatch.User_Code = _ObjData.User_Code;
            _objBatch.CompanyId = _ObjData.CompanyId;
            _objBatch.TypeOfMapping = _ObjData.TypeOfMapping;
            _objBatch.subDomainName = _ObjData.subDomainName;

            return _objBatch.GetInsertProductSales();
        }
        public int GetUpdateProductSales(Batch.BatchData _ObjData)
        {
            _objBatch.Region_Code = _ObjData.Region_Code;
            _objBatch.EntityCode = _ObjData.EntityCode;
            _objBatch.Entity = _ObjData.Entity;
            _objBatch.Month = _ObjData.Month;
            _objBatch.Year = _ObjData.Year;
            _objBatch.Date = _ObjData.Date;
            _objBatch.EntityName = _ObjData.EntityName;
            _objBatch.Sales_Id = _ObjData.Sales_Id;
            _objBatch.lstProductSales = _ObjData.lstProductSales;
            _objBatch.User_Code = _ObjData.User_Code;
            _objBatch.CompanyId = _ObjData.CompanyId;
            _objBatch.TypeOfMapping = _ObjData.TypeOfMapping;
            _objBatch.subDomainName = _ObjData.subDomainName;
            return _objBatch.GetUpdateProductSales();
        }
        public JsonResult GetAllEntityDetails(Batch.BatchData _obj)
        {
            _objBatch.Region_Code = _obj.Region_Code;
            _objBatch.EntityCode = _obj.EntityCode;
            _objBatch.Entity = _obj.Entity;
            _objBatch.Month = _obj.Month;
            _objBatch.Year = _obj.Year;
            _objBatch.subDomainName = _obj.subDomainName;
            return Json(_objBatch.GetAllEntityDetails(), JsonRequestBehavior.AllowGet);
        }
        public int GetEntityStatusChange(Batch.BatchData _obj)
        {
            _objBatch.User_Code = _obj.User_Code;
            _objBatch.subDomainName = _obj.subDomainName;
            _objBatch.Sales_Id = _obj.Sales_Id;
            _objBatch.Remark = _obj.Remark;
            return _objBatch.GetEntityStatusChange();
        }

        public JsonResult GetEntitySalesMob(Batch.BatchData _obj)
        {
            _objBatch.User_Code = _obj.User_Code;
            _objBatch.subDomainName = _obj.subDomainName;
            _objBatch.privilege_Name = _obj.privilege_Name;
            _objBatch.default_value = _obj.default_value;
            return Json(_objBatch.GetEntitySalesMob(), JsonRequestBehavior.AllowGet);
            //return _objBatch.GetEntitySalesMob(user_Code, sub_Domain_Name, privilege_Name, default_value);
        }

        public int GetMultipleEntityStatusChange(Batch.BatchData _obj)
        {
            _objBatch.subDomainName = _obj.lstSaleEntity[0].SubDomainName;
            //_objBatch.lstSaleEntity = _obj.lstSaleEntity;
            //_objBatch.Remark = _obj.Remark;
            return _objBatch.GetMultipleEntityStatusChange(_obj);
        }
        public JsonResult GetAlreadyMappedData(string entityType, int month, int year, string selectedMappingCode, string mappingType, string subDomainName)
        {
            return Json(_objBatch.GetAlreadyMappedData(entityType, month, year, selectedMappingCode, mappingType, subDomainName), JsonRequestBehavior.AllowGet);
        }
        public bool UpdateStatusofDraft(string regionCode, int salesId, string subDomainName)
        {
            // _objBatch.subDomainName = _ObjData.subDomainName;
            return _objBatch.UpdateStatusofDraft(regionCode, salesId, subDomainName);
        }

        public JsonResult GetConfigMaster(string Config_Key, string Possible_Values, string Config_Value, string Type, string companycode, string subdomain)
        {
            return Json(_objBatch.GetConfigMaster(Config_Key, Possible_Values, Config_Value, Type, companycode, subdomain), JsonRequestBehavior.AllowGet);

        }
        #endregion
    }
}
