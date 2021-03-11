using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using MVCModels;


namespace DataControl.HiDoctor_ActivityFactoryClasses
{
    public class BLPrimarySales
    {
        #region Variables
        DataSet Ds;
        DataTable Dt;
        DALPrimarysales DL = new DALPrimarysales();
        
        #endregion 

        public DataSet GetPrimarySalesMasterData(string Mode,int Month, int Year)
        {
            Ds = new DataSet();
            Ds = DL.GetPrimarySalesMasterData(Mode,Month,Year);
            return Ds;
        }
        public DataSet GetValidationDetails(string Mode,int Month,int Year)
        {
            return DL.GetValidationDetails(Mode,Month,Year);
        }
        public bool PrimarySalesTempUpload(string companyCode,DataTable dt, string UserCode,string ConnectionString,string strGuid)
        {
            return DL.PrimarySalesTempUpload(companyCode,dt,UserCode,ConnectionString, strGuid);
        }
        public DataTable GetUploadSummary(string region, string depot, string customer, string document_no, string from, string to,string ProductCode,string Mode)
        {
            return DL.GetUploadSummary(region, depot, customer, document_no, from, to, ProductCode, Mode);
        }
        public void InsertPrimarySalesBatchProcessingHeader(string Companycode,string BPid, string type, string filename, string Upload_date, string status,string usercode, string ConnectionString)
        {
            DL.InsertPrimarySalesBatchProcessingHeader(Companycode, BPid, type, filename, Upload_date, status, usercode, ConnectionString);
            
        }
        //public void InsertPrimarySalesBatchProcessing(List<PrimarySalesModel> Error, string BPid, string ConnectionString)
        //{
        //    DL.InsertPrimarySalesBatchProcessing(Error, BPid, ConnectionString);
        //}
        //public string PrimarySaleBulkInsert(string subDomain, string company_Code, string usercode, string filename, DataSet ds, string stagingTableName1, string stagingTableName2)
        //{
        //    DataColumn column1, column2, column3, column4, column5, column6;
        //    column1 = new DataColumn("Company_Code");
        //    column1.DataType = typeof(string);
        //    column1.DefaultValue = company_Code;

        //    column2 = new DataColumn("Uploaded_By");
        //    column1.DataType = typeof(string);
        //    column2.DefaultValue = usercode;

        //    column3 = new DataColumn("Uploaded_file_name");
        //    column1.DataType = typeof(string);
        //    column3.DefaultValue = filename;

        //    ds.Tables[0].Columns.Add(column1);
        //    ds.Tables[0].Columns.Add(column2);
        //    ds.Tables[0].Columns.Add(column3);

        //    column1 = new DataColumn("Company_Code");
        //    column1.DataType = typeof(string);
        //    column1.DefaultValue = company_Code;

        //    column2 = new DataColumn("Uploaded_By");
        //    column1.DataType = typeof(string);
        //    column2.DefaultValue = usercode;
        //    ds.Tables[1].Columns.Add(column1);
        //    ds.Tables[1].Columns.Add(column2);



        //    return DL.PrimarySaleBulkInsert(subDomain, company_Code,usercode,filename,ds, stagingTableName1, stagingTableName2);
        //}
        public DataTable GetDepots()
        {
            Dt = new DataTable();
            Dt = DL.GetDepots();

            return Dt;
        }
        public DataSet GetPrimarySalesStockiestData(string region)
        {
            return DL.GetPrimarySalesStockiestData(region);
        }
        public DataTable GetRegion(string Mode,int Month,int Year)
        {
            return DL.GetRegion(Mode,Month,Year);
        }
        
        public void PrimarySalesValidation(string companyCode, string UserCode,string strGuid, string fileName, string ConnectionString,int Month,int Year,int UploadType)
        {
            DL.PrimarySalesValidation(companyCode,  UserCode, strGuid, fileName, ConnectionString,Month,Year,UploadType);
        }
        public DataTable GetProducts(string Region_Code)
        {
            return DL.GetProducts(Region_Code);
        }
    }
}
