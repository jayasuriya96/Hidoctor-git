using MVCModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataControl.HD_MasterFactoryClasses
{
     public class BL_LockRelease : LockRelease
    {
       
        DAL_LockRelease _objDL_LockRelease = new DAL_LockRelease();
  

        public List<LockRelease.RegionName> GetAllRegionName(string subDomainName, string Company_Code, string Region_Code)
    {

        return _objDL_LockRelease.GetAllRegionName(subDomainName, Company_Code, Region_Code);

    }
        public List<LockRelease.LockedDetails> GetAllLockedDetails(string subDomainName,  string Region_Code)
        {

            return _objDL_LockRelease.GetAllLockedDetails(subDomainName,  Region_Code);

        }
        public int UpdateLockStatus(LockRelease.Updatelist _ObjData)
        {
            DataTable dtTable = new DataTable();
            dtTable.Columns.Add("Region_Code", typeof(string));
            dtTable.Columns.Add("Month", typeof(int));
            dtTable.Columns.Add("Year", typeof(int));
            dtTable.Columns.Add("Remarks", typeof(string));
          dtTable.Columns.Add("Actual_released_By", typeof(string));
            if (_ObjData.lstLockedDetails != null && _ObjData.lstLockedDetails.Count > 0)
            {
                for (int i = 0; i < _ObjData.lstLockedDetails.Count(); i++)
                {
                    dtTable.Rows.Add(_ObjData.lstLockedDetails[i].Region_Code, _ObjData.lstLockedDetails[i].Month, _ObjData.lstLockedDetails[i].Year, _ObjData.lstLockedDetails[i].Remarks, _ObjData.lstLockedDetails[i].Actual_released_By);

                }
            }
            return _objDL_LockRelease.UpdateLockStatus(_ObjData, dtTable);
        }
        public List<LockRelease.StockistDetails> GetStockistDetails(string subDomainName, string Region_Code, int Month, int Year)
        {

            return _objDL_LockRelease.GetStockistDetails(subDomainName, Region_Code,Month,Year);

        }
        public List<LockRelease.ReleasedDetails> GetAllReleasedDetails(string subDomainName, string Region_Code, string FromDate, string ToDate)
        {

            return _objDL_LockRelease.GetAllReleasedDetails(subDomainName, Region_Code,FromDate,ToDate);

        }
        public List<LockRelease.RegionName> GetActualRegionName(string subDomainName, string Company_Code, string Region_Code, string login_Region)
        {

            return _objDL_LockRelease.GetActualRegionName(subDomainName, Company_Code, Region_Code, login_Region);

        }
       
    }
}