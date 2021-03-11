using DataControl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HiDoctor_Master.Controllers
{
    public class TableToolsController : Controller
    {
        //
        // GET: /TableTools/
        DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();

        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GetAllCustomers(MVCModels.JQueryDataTableParamModel param)
        {

            string cacheKey = "SomeKey";
            Cog.Cache.Lib.CacheServer server = new Cog.Cache.Lib.CacheServer(true);
            object allCompaniesTemp = null;
            List<MVCModels.HiDoctor_Master.CustomerModel> allCompanies = null;

            //if (!server.IsKeyExist(cacheKey))
            //{
            DAL_Customer _objDALCustomer = new DAL_Customer();
            allCompanies = _objDALCustomer.GetAllCustomers(_objcurrentInfo.GetCompanyCode()) as List<MVCModels.HiDoctor_Master.CustomerModel>;
            allCompaniesTemp = allCompanies;
            //  server.SetData(cacheKey, allCompaniesTemp, 240);
            //}
            //else
            //{
            //    server.GetData(cacheKey, ref allCompaniesTemp);
            //    allCompanies = allCompaniesTemp as List<MVCModels.HiDoctor_Master.CustomerModel>;
            //}
            IEnumerable<MVCModels.HiDoctor_Master.CustomerModel> filteredCompanies;
            if (!string.IsNullOrEmpty(param.sSearch))
            {
                filteredCompanies = allCompanies.Where(c => c.Customer_Name.ToLower().Contains(param.sSearch.ToLower()) ||
                    c.Customer_Code.ToLower().Contains(param.sSearch.ToLower())
                      ||
                    c.Address1.ToLower().Contains(param.sSearch.ToLower())
                      ||
                    c.Address2.ToLower().Contains(param.sSearch.ToLower())
                      ||
                    c.Local_Area.ToLower().Contains(param.sSearch.ToLower())
                      ||
                    c.City.ToLower().Contains(param.sSearch.ToLower())
                      ||
                    c.Phone.ToLower().Contains(param.sSearch.ToLower())
                      ||
                    c.Mobile.ToLower().Contains(param.sSearch.ToLower())
                      ||
                    c.MDL_Number.ToLower().Contains(param.sSearch.ToLower())
                      ||
                    c.Region_Code.ToLower().Contains(param.sSearch.ToLower())
                      ||
                    c.Region_Type_Code.ToLower().Contains(param.sSearch.ToLower())
                    );

            }
            else
            {
                filteredCompanies = allCompanies;
            }

            //  var isNameSortable = Convert.ToBoolean(Request["bSortable_1"]);
            var sortColumnIndex = Convert.ToInt32(Request["iSortCol_0"]);
            Func<MVCModels.HiDoctor_Master.CustomerModel, string> orderingFunction = (c => sortColumnIndex == 1 ? c.Customer_Name :
                                                        sortColumnIndex == 2 ? c.Customer_Code :
                                                         sortColumnIndex == 3 ? c.Address1 :
                                                         sortColumnIndex == 4 ? c.Address2 :
                                                         sortColumnIndex == 5 ? c.Local_Area :
                                                         sortColumnIndex == 6 ? c.City :
                                                         sortColumnIndex == 7 ? c.Phone :
                                                         sortColumnIndex == 8 ? c.Mobile :
                                                         sortColumnIndex == 9 ? c.MDL_Number :
                                                         sortColumnIndex == 10 ? c.Region_Code :
                                                         sortColumnIndex == 11 ? c.Region_Type_Code :
                                                        "");

            var sortDirection = Request["sSortDir_0"]; // asc or desc
            if (sortDirection == "asc")
                filteredCompanies = filteredCompanies.OrderBy(orderingFunction);
            else
                filteredCompanies = filteredCompanies.OrderByDescending(orderingFunction);

            var displayedCompanies = filteredCompanies.Skip(param.iDisplayStart).Take(param.iDisplayLength);
            var result = from c in displayedCompanies
                         select new[] { Convert.ToString(c.ID), c.Customer_Name, c.Customer_Code,c.Address1,c.Address2,
                                                                c.Local_Area,
                                                                c.City,
                                                                c.Phone,
                                                                c.Mobile,
                                                                c.MDL_Number,
                                                                c.Region_Code,
                                                                c.Region_Type_Code,};


            return Json(new
            {
                sEcho = param.sEcho,
                iTotalRecords = allCompanies.Count(),
                iTotalDisplayRecords = filteredCompanies.Count(),
                aaData = result
            },
                        JsonRequestBehavior.AllowGet);
        }
    }
}
