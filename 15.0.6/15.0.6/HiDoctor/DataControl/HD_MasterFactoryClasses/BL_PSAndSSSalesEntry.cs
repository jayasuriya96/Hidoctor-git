
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MVCModels;
using Newtonsoft.Json;
using System.Data;

namespace DataControl.HD_MasterFactoryClasses
{




    public class BL_PsAndSSSalesEntry : PSAndSSSalesEntry.PPAndSS
    {
        DL_PSAndSSSalesEntry _objDL_PSAndSSSalesEntry = new DL_PSAndSSSalesEntry();



        public List<PSAndSSSalesEntry.ProductDeatils> GetAlreadyMappedData(string entityType, int month, int year, string selectedMappingCode, string mappingType, string subDomainName)
        {
            return _objDL_PSAndSSSalesEntry.GetAlreadyMappedData(entityType, month, year, selectedMappingCode, mappingType, subDomainName);
        }
        public List<PSAndSSSalesEntry.RegionName> GetAllRegionName(string Region_Code, string subDomainName)
        {

            return _objDL_PSAndSSSalesEntry.GetAllRegionName(Region_Code, subDomainName);

        }


        public List<PSAndSSSalesEntry.HSProductName> GetAllProductSales(string Region_Code, string subDomainName, string TypeOfMapping)
        {
            return _objDL_PSAndSSSalesEntry.GetAllProductSales(Region_Code, subDomainName, TypeOfMapping);

        }
        public List<PSAndSSSalesEntry.ConfigDetails> GetConfigMaster(string Config_Key, string Possible_Values, string Config_Value, string Type, string companycode, string subdomain)
        {
            return _objDL_PSAndSSSalesEntry.GetConfigMaster(Config_Key, Possible_Values, Config_Value, Type, companycode, subdomain);

        }
        public List<PSAndSSSalesEntry.CustomerDetails> GetCustomerDetails(string RegionCode, string Value, string subDomainName, string SDate, int month, int year)
        {
            return _objDL_PSAndSSSalesEntry.GetCustomerDetails(RegionCode, subDomainName, Value, SDate, month, year);
        }
        public int GetInsertProductSales(PSAndSSSalesEntry.PPAndSS _ObjData)
        {

            DataTable dtTable = new DataTable();
            dtTable.Columns.Add("Company_Id", typeof(int));
            dtTable.Columns.Add("User_Code", typeof(string));
            dtTable.Columns.Add("Product_Code", typeof(string));
            dtTable.Columns.Add("Product_Name", typeof(string));
            dtTable.Columns.Add("Units", typeof(decimal));
            dtTable.Columns.Add("Closing", typeof(decimal));
            dtTable.Columns.Add("Sales_Id", typeof(int));
            dtTable.Columns.Add("Transit", typeof(decimal));
            dtTable.Columns.Add("Price_Per_Unit", typeof(decimal));
            if (_ObjData.lstProductSales != null && _ObjData.lstProductSales.Count > 0)
            {
                for (int i = 0; i < _ObjData.lstProductSales.Count(); i++)
                {
                    dtTable.Rows.Add(_ObjData.CompanyId, _ObjData.User_Code, _ObjData.lstProductSales[i].Product_Code,
                         _ObjData.lstProductSales[i].Product_Name, _ObjData.lstProductSales[i].Units,
                         _ObjData.lstProductSales[i].Closing, _ObjData.lstProductSales[i].Sales_Id,
                         _ObjData.lstProductSales[i].Transit, _ObjData.lstProductSales[i].Price_Per_Unit);

                }
            }
            return _objDL_PSAndSSSalesEntry.GetInsertProductSales(_ObjData, dtTable);
        }
        public List<PSAndSSSalesEntry.ProductDeatils> GetAllEntityProduct(string Region_Code, string subDomainName)
        {

            return _objDL_PSAndSSSalesEntry.GetAllEntityProduct(Region_Code, subDomainName);
        }
        public string GetEntitySalesMob(string User_Code, string subDomainName, string privilege_Name, string default_value)
        {
            //_objDL_PSAndSSSalesEntry._PPAndSS.User_Code = User_Code;
            //_objDL_PSAndSSSalesEntry._PPAndSS.subDomainName = subDomainName;
            //_objDL_PSAndSSSalesEntry._PPAndSS.privilege_Name = privilege_Name;
            //_objDL_PSAndSSSalesEntry._PPAndSS.default_value = default_value;
            return _objDL_PSAndSSSalesEntry.GetEntitySalesMob(User_Code, subDomainName, privilege_Name, default_value);

        }
        public PSAndSSSalesEntry.AllSalesDetails GetAllSalesDetails(string Region_Code, string subDomainName, string Entity_Type, int Month, int Year)
        {

            return _objDL_PSAndSSSalesEntry.GetAllSalesDetails(Region_Code, subDomainName, Entity_Type, Month, Year);
        }

        public int GetUpdateProductSales(PSAndSSSalesEntry.PPAndSS _ObjData)
        {

            DataTable dtTable = new DataTable();
            dtTable.Columns.Add("Company_Id", typeof(int));
            dtTable.Columns.Add("User_Code", typeof(string));
            dtTable.Columns.Add("Product_Code", typeof(string));
            dtTable.Columns.Add("Product_Name", typeof(string));
            dtTable.Columns.Add("Units", typeof(decimal));
            dtTable.Columns.Add("Closing", typeof(decimal));
            dtTable.Columns.Add("Sales_Id", typeof(int));
            dtTable.Columns.Add("Transit", typeof(decimal));
            dtTable.Columns.Add("Price_Per_Unit", typeof(decimal));
            if (_ObjData.lstProductSales != null && _ObjData.lstProductSales.Count > 0)
            {
                for (int i = 0; i < _ObjData.lstProductSales.Count(); i++)
                {
                    dtTable.Rows.Add(_ObjData.CompanyId, _ObjData.User_Code, _ObjData.lstProductSales[i].Product_Code,
                         _ObjData.lstProductSales[i].Product_Name, _ObjData.lstProductSales[i].Units,
                         _ObjData.lstProductSales[i].Closing, _ObjData.lstProductSales[i].Sales_Id,
                         _ObjData.lstProductSales[i].Transit, _ObjData.lstProductSales[i].Price_Per_Unit);

                }
            }
            return _objDL_PSAndSSSalesEntry.GetUpdateProductSales(_ObjData, dtTable);
        }
        public PSAndSSSalesEntry.PPAndSSDetails GetAllEntityDetails(string Region_Code, string EntityCode, string Entity, int Month, int Year, string TypeOfMapping, string subDomainName)
        {

            return _objDL_PSAndSSSalesEntry.GetAllEntityDetails(Region_Code, EntityCode, Entity, Month, Year, TypeOfMapping, subDomainName);
        }
        public int GetEntityStatusChange(PSAndSSSalesEntry.PPAndSS _ObjData)
        {

            return _objDL_PSAndSSSalesEntry.GetEntityStatusChange(_ObjData);
        }
        public int GetMultipleEntityStatusChange(PSAndSSSalesEntry.PPAndSS _objData)
        {

            DataTable dtTable = new DataTable();
            dtTable.Columns.Add("User_Code", typeof(string));
            dtTable.Columns.Add("Sales_Id", typeof(int));
            dtTable.Columns.Add("Remark", typeof(string));
            if (_objData.lstSaleEntity != null && _objData.lstSaleEntity.Count > 0)
            {
                for (int i = 0; i < _objData.lstSaleEntity.Count(); i++)
                {
                    dtTable.Rows.Add(_objData.User_Code, _objData.lstSaleEntity[i].Sales_Id, _objData.lstSaleEntity[i].Remark);

                }
            }

            return _objDL_PSAndSSSalesEntry.GetMultipleEntityStatusChange(dtTable, _objData);
        }
    }
}

