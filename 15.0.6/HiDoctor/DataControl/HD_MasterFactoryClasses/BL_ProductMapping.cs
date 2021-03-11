using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MVCModels;

namespace DataControl.HD_MasterFactoryClasses
{
    public class BL_ProductMapping
    {
        DAL_ProductMapping _objDALPrdMap = new DAL_ProductMapping();
        DataControl.CurrentInfo _objCurrentInfo = new DataControl.CurrentInfo();

        public List<DestinationProductTypelst> GetProductTypelstForDes(string product_Type_Name)
        {
            string Company_Code = string.Empty;
            Company_Code = _objCurrentInfo.GetCompanyCode();
            try
            {
                return _objDALPrdMap.GetProductTypelstForDes(Company_Code, product_Type_Name);
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public List<ProductMapping> GetSourceProductList(string Src_Prd_Type)
        {
            string Company_Code = string.Empty;
            string User_Code = string.Empty;
            Company_Code = _objCurrentInfo.GetCompanyCode();
            User_Code = _objCurrentInfo.GetUserCode();
            try
            {
                return _objDALPrdMap.GetSourceProductList(Company_Code, User_Code, Src_Prd_Type);
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public List<DestinationProductMapping> GetDestinationProductList(string product_code, string des_product_type)
        {
            string Company_Code = string.Empty;
            string User_Code = string.Empty;
            Company_Code = _objCurrentInfo.GetCompanyCode();
            User_Code = _objCurrentInfo.GetUserCode();
            try
            {
                return _objDALPrdMap.GetDestinationProductList(Company_Code, User_Code, product_code, des_product_type);
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public List<SelectedProductsList> GetAllSelectProductlst(string Souce_Product_Code)
        {
            string Company_Code = string.Empty;
            Company_Code = _objCurrentInfo.GetCompanyCode();
            try
            {
                return _objDALPrdMap.GetAllSelectProductlst(Company_Code, Souce_Product_Code);
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }
    }
}
