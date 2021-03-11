using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;

namespace HiDoctor_Master.Controllers
{
    public class SchemeController : Controller
    {
        DataControl.JSONConverter _objJson = new DataControl.JSONConverter();
        DataControl.BLProduct _objBLProduct = new DataControl.BLProduct();
        DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();
        //
        // GET: /Scheme/

        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GetAllSaleProducts()
        {
            List<MVCModels.HiDoctor_Master.ProductModel> lstProdModel = _objBLProduct.GetAllSaleProducts(_objCurrentInfo.GetCompanyCode());
            return Json(_objJson.Serialize(lstProdModel));
        }

        public JsonResult GetAllProducts()
        {
            List<MVCModels.HiDoctor_Master.ProductModel> lstProdModel = _objBLProduct.GetAllProducts(_objCurrentInfo.GetCompanyCode());
            return Json(_objJson.Serialize(lstProdModel));
        }

        public string InsertScheme(string schemeName, string schemeBase, string effectiveFrom, string effectiveTo, string mode, string schemeCode, string schemeProducts)
        {
            return _objBLProduct.InsertScheme(_objCurrentInfo.GetCompanyCode(), schemeName, schemeBase, effectiveFrom, effectiveTo, mode, schemeCode, schemeProducts);
        }

        public JsonResult GetSchemeHeader()
        {
            List<MVCModels.HiDoctor_Master.SchemeModel> lstScheme = _objBLProduct.GetSchemeHeader(_objCurrentInfo.GetCompanyCode());
            return Json(_objJson.Serialize(lstScheme));
        }

        public JsonResult GetSchemeDetails(string schemeCode)
        {
            DataSet ds = null;
            ds = _objBLProduct.GetSchemeDetails(_objCurrentInfo.GetCompanyCode(), schemeCode);
            return Json(_objJson.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        public ActionResult RegionSchemeMapping()
        {
            return View();
        }

        public string InsertSchemeMapping(string schemeCode, string regionCodes)
        {
            DataControl.BLRegion _blRegion = new DataControl.BLRegion();
            return _blRegion.SchemeRegionMapping(_objCurrentInfo.GetCompanyCode(), schemeCode, regionCodes);
        }

        public string CheckSchemeProductValidation(string salesProducts, string effectiveFrom, string effectiveTo, string schemeCode)
        {
            return _objBLProduct.CheckSchemeProductValidation(_objCurrentInfo.GetCompanyCode(), salesProducts, effectiveFrom, effectiveTo, schemeCode);
        }
        public JsonResult GetMappedRegionsByScheme(string schemeCode)
        {
            DataControl.BLRegion _blRegion = new DataControl.BLRegion();
            List<MVCModels.HiDoctor_Master.RegionModel> lstRegion = _blRegion.GetMappedRegionsByScheme(_objCurrentInfo.GetCompanyCode(), schemeCode);
            return Json(_objJson.Serialize(lstRegion));
        }
    }
}
