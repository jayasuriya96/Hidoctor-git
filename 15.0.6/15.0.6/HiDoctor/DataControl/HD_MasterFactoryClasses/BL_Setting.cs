using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MVCModels;
using Newtonsoft.Json;
using System.Data;
using static MVCModels.TargetSetting;

namespace DataControl.HD_MasterFactoryClasses
{

    public class BL_Setting: TargetSetting
    {
          DAL_Setting _objDALSetting = new DAL_Setting();
    

        //public List<TargetSetting.HSProductDetails> productdetails(string regionCode)
        //{
        //    //_objDALSetting.TargetSetting.Region_Code = Region_Code;
        //    //_objDALSetting.TargetSetting.subDomainName = subDomainName;
        //    //_objDALBatch._batch.TypeOfMapping = TypeOfMapping;
        //    return _objDALSetting.productdetails( regionCode);
        //}
        public IEnumerable<RegionSalesProductList> productdetails(string Region_Code)
        {
            DAL_Setting _objDALSetting = new DAL_Setting();
            return _objDALSetting.productdetails(Region_Code);
        }

        public string  InsertProduts(SalesProductDetails obj)
        {
            DAL_Setting _objDALSetting = new DAL_Setting();
            return _objDALSetting.InsertProduts(obj);
        }

        public IEnumerable<RegionSalesProductList> GetProduts(string Region_Code)
        {
            DAL_Setting _objDALSetting = new DAL_Setting();
            return _objDALSetting.GetProduts(Region_Code);
        }
        public IEnumerable<WorkCategory> GetWorkCategory(string CompanyCode)
        {
            DAL_Setting _objDALSetting = new DAL_Setting();
            return _objDALSetting.GetWorkCategory(CompanyCode);
        }
        public int InsertCategorySetting(CategoryDetails obj, string user_code)
        {
            DAL_Setting _objDALSetting = new DAL_Setting();
            return _objDALSetting.InsertCategorySetting(obj, user_code);
        }
        public IEnumerable<WorkCategoryDetails> Getallcategorysetting(string user_code)
        {
            DAL_Setting _objDALSetting = new DAL_Setting();
            return _objDALSetting.Getallcategorysetting(user_code);
        }
        public int ChangeStatus(int id, string user_code)
        {
            DAL_Setting _objDALSetting = new DAL_Setting();
            return _objDALSetting.ChangeStatus(id, user_code);
        }
    }
    }

