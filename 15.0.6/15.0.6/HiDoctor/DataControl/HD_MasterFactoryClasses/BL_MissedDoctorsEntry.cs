using MVCModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataControl.HD_MasterFactoryClasses
{
    public class BL_MissedDoctorsEntry : DoctorMissedReason
    {
        DAL_MissedDoctorsEntry _objDL_MissedDoctorsEntry = new DAL_MissedDoctorsEntry();
        private object objData;
        private object _objData;

        public List<DoctorMissedReason.RegionName> GetAllRegionName( string subDomainName ,string Company_Code, string Region_Code)


        {

            return _objDL_MissedDoctorsEntry.GetAllRegionName(subDomainName,Company_Code, Region_Code);

        }
        public List<DoctorMissedReason.DoctorsList> GetAllDoctorslist(string subDomainName,string Company_Code, string Region_Code, int Month, int Year)
        {
            return _objDL_MissedDoctorsEntry.GetAllDoctorslist(subDomainName,Company_Code, Region_Code, Month, Year);

        }
        public int GetInsertDoctorsList(DoctorMissedReason.DoctorsDetailsList _ObjData)
        {

            DataTable dtTable = new DataTable();
           
            dtTable.Columns.Add("Region_Code", typeof(string));
            dtTable.Columns.Add("Customer_Code", typeof(string));
            dtTable.Columns.Add("Customer_Name", typeof(string));
           dtTable.Columns.Add("Reason", typeof(string));
            dtTable.Columns.Add("Remarks", typeof(string));
            //dtTable.Columns.Add("Month", typeof(int));
            //dtTable.Columns.Add("Year", typeof(int));

            if (_ObjData.lstProductSales != null && _ObjData.lstProductSales.Count > 0)
            {
                for (int i = 0; i < _ObjData.lstProductSales.Count(); i++)
                {
                    dtTable.Rows.Add( _ObjData.Region_Code, _ObjData.lstProductSales[i].Customer_Code, _ObjData.lstProductSales[i].Customer_Name, _ObjData.lstProductSales[i].Reason, _ObjData.lstProductSales[i].Remarks);

                }
            }
            return _objDL_MissedDoctorsEntry.GetInsertDoctorsList(_ObjData, dtTable);
        }
        public List<DoctorMissedReason.SalesDetails> GetAllDoctorDetails( string subDomainName,string Company_Code, string Region_Code, int Month, int Year)
        {

            return _objDL_MissedDoctorsEntry.GetAllDoctorDetails(subDomainName,Company_Code, Region_Code, Month, Year);
        }

        public List<DoctorMissedReason.DetailsGrid> GetGridDetails(string subDomainName,string Company_Code, string Region_Code, int Month, int Year)
        {

            return _objDL_MissedDoctorsEntry.GetGridDetails(subDomainName,Company_Code, Region_Code, Month, Year);
        }

        public List<DoctorMissedReason.DoctorsList> GetprefilDoctorslist(string subDomainName,string Company_Code, string Region_Code, int Month, int Year)
        {
            return _objDL_MissedDoctorsEntry.GetprefilDoctorslist(subDomainName,Company_Code, Region_Code, Month, Year);

        }
        public List<DoctorMissedReason.DetailsGrid> GetGridDetailslist(string subDomainName,string Company_Code, string Region_Code, int Month, int Year)
        {

            return _objDL_MissedDoctorsEntry.GetGridDetailslist(subDomainName,Company_Code, Region_Code, Month, Year);
        }
        public List<DoctorMissedReason.SalesDetails> prefileditDetails(string subDomainName, string Company_Code, string Region_Code, int Month, int Year)
        {

            return _objDL_MissedDoctorsEntry.prefileditDetails(subDomainName, Company_Code, Region_Code, Month, Year);
        }

        public List<DoctorMissedReason.ReasonDetails> ReasonDetails(string subDomainName,string Region_Code)
        {

            return _objDL_MissedDoctorsEntry.ReasonDetails(subDomainName, Region_Code);
        }
    }
}
