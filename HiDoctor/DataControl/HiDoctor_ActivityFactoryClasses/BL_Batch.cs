
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MVCModels;
using Newtonsoft.Json;
using System.Data;

namespace DataControl.HiDoctor_ActivityFactoryClasses
{
    public class BL_Batch : Batch.BatchData

    {
        DAL_Batch _objDALBatch = new DAL_Batch();

        public List<Batch.BatchDetails> GetBatchDetails()
        {
            _objDALBatch._batch.status = status;
            _objDALBatch._batch.Region_Code = Region_Code;
            _objDALBatch._batch.CustomerCode = CustomerCode;
            _objDALBatch._batch.subDomainName = subDomainName;
            return _objDALBatch.GetBatchDetails();

        }
        public List<Batch.CustomerName> GetDoctorName()
        {
            _objDALBatch._batch.Region_Code = Region_Code;
            _objDALBatch._batch.subDomainName = subDomainName;
            return _objDALBatch.GetDoctorName();

        }
        public List<Batch.ProductName> GetAllProductName()
        {
            _objDALBatch._batch.Region_Code = Region_Code;
            _objDALBatch._batch.subDomainName = subDomainName;
            return _objDALBatch.GetAllProductName();

        }
        public List<Batch.RegionName> GetAllRegionName()
        {
            _objDALBatch._batch.Region_Code = Region_Code;
            _objDALBatch._batch.subDomainName = subDomainName;
            return _objDALBatch.GetAllRegionName();

        }
        public int GetSaveBatchDetalis()
        {
            _objDALBatch._batch.Region_Code = Region_Code;
            _objDALBatch._batch.User_Code = User_Code;
            _objDALBatch._batch.CustomerName = CustomerName;
            _objDALBatch._batch.CustomerCode = CustomerCode;
            _objDALBatch._batch.Customer_RegionCode = Customer_RegionCode;
            _objDALBatch._batch.BatchName = BatchName;
            _objDALBatch._batch.NoOfChicks = NoOfChicks;
            _objDALBatch._batch.StartDate = StartDate;
            _objDALBatch._batch.EndDate = EndDate;
            _objDALBatch._batch.status = status;
            _objDALBatch._batch.subDomainName = subDomainName;
            return _objDALBatch.GetSaveBatchDetalis();

        }
        public int GetUpDateBatchDetalis()
        {
            _objDALBatch._batch.Region_Code = Region_Code;
            _objDALBatch._batch.User_Code = User_Code;
            _objDALBatch._batch.CustomerName = CustomerName;
            _objDALBatch._batch.CustomerCode = CustomerCode;
            _objDALBatch._batch.Customer_RegionCode = Customer_RegionCode;
            _objDALBatch._batch.BatchName = BatchName;
            _objDALBatch._batch.Batch_Id = Batch_Id;
            _objDALBatch._batch.NoOfChicks = NoOfChicks;
            _objDALBatch._batch.StartDate = StartDate;
            _objDALBatch._batch.EndDate = EndDate;
            _objDALBatch._batch.status = status;
            _objDALBatch._batch.subDomainName = subDomainName;
            return _objDALBatch.GetUpDateBatchDetalis();
        }
        public int GetInsertSchedule()
        {
            _objDALBatch._batch.Product = Product;
            _objDALBatch._batch.User_Code = User_Code;
            _objDALBatch._batch.ScheduleName = ScheduleName;
            _objDALBatch._batch.StartDate = StartDate;
            _objDALBatch._batch.EndDate = EndDate;
            _objDALBatch._batch.Notes = Notes;
            _objDALBatch._batch.NumofWeeks = NumofWeeks;
            _objDALBatch._batch.Batch_Id = Batch_Id;
            _objDALBatch._batch.subDomainName = subDomainName;
            return _objDALBatch.GetInsertSchedule();
        }
        public int GetUpdateSchedule()
        {
            _objDALBatch._batch.Product = Product;
            _objDALBatch._batch.User_Code = User_Code;
            _objDALBatch._batch.ScheduleName = ScheduleName;
            _objDALBatch._batch.StartDate = StartDate;
            _objDALBatch._batch.EndDate = EndDate;
            _objDALBatch._batch.Notes = Notes;
            _objDALBatch._batch.NumofWeeks = NumofWeeks;
            _objDALBatch._batch.Batch_Id = Batch_Id;
            _objDALBatch._batch.Schedule_Id = Schedule_Id;
            _objDALBatch._batch.subDomainName = subDomainName;
            return _objDALBatch.GetUpdateSchedule();
        }
        public Batch.ScheduleDetails GetScheduledetails()
        {
            _objDALBatch._batch.Batch_Id = Batch_Id;
            _objDALBatch._batch.subDomainName = subDomainName;
            return _objDALBatch.GetScheduledetails();
        }
        public int GetDeleteSchedule(int Schedule_Id, string subDomainName)
        {
            return _objDALBatch.GetDeleteSchedule(Schedule_Id, subDomainName);
        }
        public int GetInsertQuantity()
        {
            _objDALBatch._batch.Product = Product;
            _objDALBatch._batch.User_Code = User_Code;
            _objDALBatch._batch.subDomainName = subDomainName;
            return _objDALBatch.GetInsertQuantity();
        }
        public List<Batch.Information> GetInformation(string Product_Id, string Batch_Id, string Schedule_Id, string subDomainName)
        {
            return _objDALBatch.GetInformation(Product_Id, Batch_Id, Schedule_Id, subDomainName);
        }
        public int GetChangeScheduleStatus(int Status, int Schedule_Id, string User_Code, string Remark, string subDomainName)
        {
            return _objDALBatch.GetChangeScheduleStatus(Status, Schedule_Id, User_Code, Remark, subDomainName);
        }
        public int GetScheduleStatus(int Schedule_Id, string subDomainName)
        {
            return _objDALBatch.GetScheduleStatus(Schedule_Id, subDomainName);
        }
        public List<Batch.CustomerDetails> GetCustomerDetails(string RegionCode, string subDomainName, string Value, string SDate, string doctoMasterFrom, int month, int year)
        {
            return _objDALBatch.GetCustomerDetails(RegionCode, subDomainName, Value, SDate, doctoMasterFrom, month, year);
        }
        public List<Batch.State> GetStateName(string subDomainName)
        {
            return _objDALBatch.GetStateName(subDomainName);
        }
        public List<Batch.City> GetCityName(string subDomainName, string StateID)
        {
            return _objDALBatch.GetCityName(subDomainName, StateID);
        }
        public List<Batch.HospitalDetails> GetHospitalName(string subDomainName, int StateID, int CityID)
        {
            return _objDALBatch.GetHospitalName(subDomainName, StateID, CityID);
        }
        public List<Batch.HSProductName> GetAllProductSales()
        {
            _objDALBatch._batch.Region_Code = Region_Code;
            _objDALBatch._batch.subDomainName = subDomainName;
            //_objDALBatch._batch.TypeOfMapping = TypeOfMapping;
            return _objDALBatch.GetAllProductSales();

        }
        //public int GetSaveSalesMonth()
        //{
        //    _objDALBatch._batch.Region_Code = Region_Code;
        //    _objDALBatch._batch.EntityCode = EntityCode;
        //    _objDALBatch._batch.Entity = Entity;
        //    _objDALBatch._batch.Month = Month;
        //    _objDALBatch._batch.Year = Year;
        //    _objDALBatch._batch.Date = Date;
        //    _objDALBatch._batch.subDomainName = subDomainName;
        //    _objDALBatch._batch.CompanyId = CompanyId;
        //    _objDALBatch._batch.User_Code = User_Code;
        //    _objDALBatch._batch.EntityName = EntityName;
        //    return _objDALBatch.GetSaveSalesMonth();
        //}
        //public int GetUpdateSalesMonth()
        //{
        //    _objDALBatch._batch.Region_Code = Region_Code;
        //    _objDALBatch._batch.EntityCode = EntityCode;
        //    _objDALBatch._batch.Entity = Entity;
        //    _objDALBatch._batch.Month = Month;
        //    _objDALBatch._batch.Year = Year;
        //    _objDALBatch._batch.Date = Date;
        //    _objDALBatch._batch.subDomainName = subDomainName;
        //    _objDALBatch._batch.CompanyId = CompanyId;
        //    _objDALBatch._batch.User_Code = User_Code;
        //    _objDALBatch._batch.EntityName = EntityName;
        //    _objDALBatch._batch.Sales_Id = Sales_Id;
        //    return _objDALBatch.GetUpdateSalesMonth();
        //}
        public List<Batch.SalesDetails> GetAllSalesDetails()
        {
            _objDALBatch._batch.Region_Code = Region_Code;
            _objDALBatch._batch.subDomainName = subDomainName;
            _objDALBatch._batch.Entity_Type = Entity_Type;
            return _objDALBatch.GetAllSalesDetails();
        }
        public List<Batch.ProductDeatils> GetAllEntityProduct()
        {
            _objDALBatch._batch.Region_Code = Region_Code;
            _objDALBatch._batch.subDomainName = subDomainName;
            return _objDALBatch.GetAllEntityProduct();
        }
        public int GetInsertProductSales()
        {
            _objDALBatch._batch.Region_Code = Region_Code;
            _objDALBatch._batch.EntityCode = EntityCode;
            _objDALBatch._batch.Entity = Entity;
            _objDALBatch._batch.Month = Month;
            _objDALBatch._batch.Year = Year;
            _objDALBatch._batch.Date = Date;
            _objDALBatch._batch.EntityName = EntityName;
            _objDALBatch._batch.lstProductSales = lstProductSales;
            _objDALBatch._batch.User_Code = User_Code;
            _objDALBatch._batch.CompanyId = CompanyId;
            _objDALBatch._batch.TypeOfMapping = TypeOfMapping;
            _objDALBatch._batch.subDomainName = subDomainName;
            DataTable dtTable = new DataTable();
            dtTable.Columns.Add("Company_Id", typeof(int));
            dtTable.Columns.Add("User_Code", typeof(string));
            dtTable.Columns.Add("Product_Code", typeof(string));
            dtTable.Columns.Add("Product_Name", typeof(string));
            dtTable.Columns.Add("Units", typeof(decimal));
            dtTable.Columns.Add("Closing", typeof(decimal));
            dtTable.Columns.Add("Sales_Id", typeof(int));
            dtTable.Columns.Add("Transit", typeof(decimal));
            if (_objDALBatch._batch.lstProductSales != null && _objDALBatch._batch.lstProductSales.Count > 0)
            {
                for (int i = 0; i < _objDALBatch._batch.lstProductSales.Count(); i++)
                {
                    dtTable.Rows.Add(_objDALBatch._batch.CompanyId, _objDALBatch._batch.User_Code, _objDALBatch._batch.lstProductSales[i].Product_Code,
                         _objDALBatch._batch.lstProductSales[i].Product_Name, _objDALBatch._batch.lstProductSales[i].Units,
                         _objDALBatch._batch.lstProductSales[i].Closing, _objDALBatch._batch.lstProductSales[i].Sales_Id,
                         _objDALBatch._batch.lstProductSales[i].Transit);

                }
            }
            return _objDALBatch.GetInsertProductSales(dtTable);
        }
        public int GetUpdateProductSales()
        {
            _objDALBatch._batch.Region_Code = Region_Code;
            _objDALBatch._batch.EntityCode = EntityCode;
            _objDALBatch._batch.Entity = Entity;
            _objDALBatch._batch.Month = Month;
            _objDALBatch._batch.Year = Year;
            _objDALBatch._batch.Date = Date;
            _objDALBatch._batch.EntityName = EntityName;
            _objDALBatch._batch.Sales_Id = Sales_Id;
            _objDALBatch._batch.lstProductSales = lstProductSales;
            _objDALBatch._batch.User_Code = User_Code;
            _objDALBatch._batch.TypeOfMapping = TypeOfMapping;
            _objDALBatch._batch.CompanyId = CompanyId;
            _objDALBatch._batch.subDomainName = subDomainName;
            DataTable dtTable = new DataTable();
            dtTable.Columns.Add("Company_Id", typeof(int));
            dtTable.Columns.Add("User_Code", typeof(string));
            dtTable.Columns.Add("Product_Code", typeof(string));
            dtTable.Columns.Add("Product_Name", typeof(string));
            dtTable.Columns.Add("Units", typeof(decimal));
            dtTable.Columns.Add("Closing", typeof(decimal));
            dtTable.Columns.Add("Sales_Id", typeof(int));
            dtTable.Columns.Add("Transit", typeof(decimal));
            if (_objDALBatch._batch.lstProductSales != null && _objDALBatch._batch.lstProductSales.Count > 0)
            {
                for (int i = 0; i < _objDALBatch._batch.lstProductSales.Count(); i++)
                {
                    dtTable.Rows.Add(_objDALBatch._batch.CompanyId, _objDALBatch._batch.User_Code, _objDALBatch._batch.lstProductSales[i].Product_Code,
                         _objDALBatch._batch.lstProductSales[i].Product_Name, _objDALBatch._batch.lstProductSales[i].Units,
                         _objDALBatch._batch.lstProductSales[i].Closing, _objDALBatch._batch.lstProductSales[i].Sales_Id,
                         _objDALBatch._batch.lstProductSales[i].Transit);

                }
            }
            return _objDALBatch.GetUpdateProductSales(dtTable);
        }
        public Batch.EntityDetails GetAllEntityDetails()
        {
            _objDALBatch._batch.Region_Code = Region_Code;
            _objDALBatch._batch.subDomainName = subDomainName;
            _objDALBatch._batch.EntityCode = EntityCode;
            _objDALBatch._batch.Entity = Entity;
            _objDALBatch._batch.Month = Month;
            _objDALBatch._batch.Year = Year;
            return _objDALBatch.GetAllEntityDetails();
        }
        public int GetEntityStatusChange()
        {
            _objDALBatch._batch.User_Code = User_Code;
            _objDALBatch._batch.subDomainName = subDomainName;
            _objDALBatch._batch.Sales_Id = Sales_Id;
            _objDALBatch._batch.Remark = Remark;
            return _objDALBatch.GetEntityStatusChange();
        }
        public string GetEntitySalesMob()
        {
            _objDALBatch._batch.User_Code = User_Code;
            _objDALBatch._batch.subDomainName = subDomainName;
            _objDALBatch._batch.privilege_Name = privilege_Name;
            _objDALBatch._batch.default_value = default_value;
            return _objDALBatch.GetEntitySalesMob();

        }
        public int GetMultipleEntityStatusChange(Batch.BatchData _objData)
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
            _objDALBatch._batch.subDomainName = subDomainName;
            return _objDALBatch.GetMultipleEntityStatusChange(dtTable);
        }
        public List<Batch.ProductDeatils> GetAlreadyMappedData(string entityType, int month, int year, string selectedMappingCode, string mappingType,string subDomainName)
        {
            return _objDALBatch.GetAlreadyMappedData(entityType, month, year, selectedMappingCode, mappingType, subDomainName);
        }
        public bool UpdateStatusofDraft(string regionCode, int salesId,string subDomainName)
        {
            return _objDALBatch.UpdateStatusofDraft(regionCode, salesId,subDomainName);
        }
        public List<Batch.ConfigDetails> GetConfigMaster(string Config_Key, string Possible_Values, string Config_Value, string Type, string companycode, string subdomain)
        {
            return _objDALBatch.GetConfigMaster(Config_Key, Possible_Values, Config_Value, Type,companycode, subdomain);

        }
    }
}
