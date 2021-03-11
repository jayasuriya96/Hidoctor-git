using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using MVCModels;
namespace DataControl.HD_MasterFactoryClasses
{
    public class DAL_ProductMapping : DapperRepository
    {
        Data _objData = new Data();

        const string SP_HD_Get_Destination_Product_Type = "SP_HD_Get_Destination_Product_Type";
        const string USP_hdGetActivityTypeMapping = "USP_hdGetActivityTypeMapping";
        const string SP_HD_Get_Destination_Product_List = "SP_HD_Get_Destination_Product_List";
        const string SP_HdGet_MappingProductSelect = "SP_HdGet_MappingProductSelect";

        /// <summary>
        /// Gets Destination Product Type List
        /// </summary>
        /// <param name="Company_Code"></param>
        /// <param name="product_Type_Name"></param>
        /// <returns></returns>
        public List<DestinationProductTypelst> GetProductTypelstForDes(string Company_Code, string product_Type_Name)
        {
            List<DestinationProductTypelst> lstDestinationPrdTypelst = new List<DestinationProductTypelst>();
            try
            {
                using (IDbConnection con = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", Company_Code);
                    p.Add("@Product_Type_Name", product_Type_Name);
                    lstDestinationPrdTypelst = con.Query<DestinationProductTypelst>(SP_HD_Get_Destination_Product_Type, p, commandType: CommandType.StoredProcedure).ToList();
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstDestinationPrdTypelst;
        }

        /// <summary>
        /// Gets Source Product List
        /// </summary>
        /// <param name="Company_Code"></param>
        /// <param name="User_Code"></param>
        /// <param name="Src_Prd_Type"></param>
        /// <returns></returns>
        public List<ProductMapping> GetSourceProductList(string Company_Code, string User_Code, string Src_Prd_Type)
        {
            List<ProductMapping> lstSourceProductlst = new List<ProductMapping>();
            try
            {
                using (IDbConnection con = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", Company_Code);
                    p.Add("@User_Code", User_Code);
                    p.Add("@Src_Prd_Type", Src_Prd_Type);
                    lstSourceProductlst = con.Query<ProductMapping>(USP_hdGetActivityTypeMapping, p, commandType: CommandType.StoredProcedure).ToList();
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstSourceProductlst;
        }

        /// <summary>
        /// Gets Destination Product List
        /// </summary>
        /// <param name="Company_Code"></param>
        /// <param name="User_Code"></param>
        /// <param name="product_code"></param>
        /// <param name="des_product_type"></param>
        /// <returns></returns>
        public List<DestinationProductMapping> GetDestinationProductList(string Company_Code, string User_Code, string product_code, string des_product_type)
        {
            List<DestinationProductMapping> lstDesProdlst = new List<DestinationProductMapping>();
            try
            {
                using (IDbConnection con = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", Company_Code);
                    p.Add("@User_Code", User_Code);
                    p.Add("@product_code", product_code);
                    p.Add("@des_product_type", des_product_type);
                    lstDesProdlst = con.Query<DestinationProductMapping>(SP_HD_Get_Destination_Product_List, p, commandType: CommandType.StoredProcedure).ToList();
                    con.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstDesProdlst;
        }

        public List<SelectedProductsList> GetAllSelectProductlst(string Company_Code, string Souce_Product_Code)
        {
            List<SelectedProductsList> SelectedProductlst = new List<SelectedProductsList>();
            try
            {
                using(IDbConnection con = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", Company_Code);
                    p.Add("@SalesProductCode", Souce_Product_Code);
                    SelectedProductlst = con.Query<SelectedProductsList>(SP_HdGet_MappingProductSelect, p, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch(Exception ex)
            {
                throw ex;
            }
            return SelectedProductlst;
        }
    }
}
