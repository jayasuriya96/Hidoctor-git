using MVCModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace DataControl.HD_MasterFactoryClasses
{
    public class BL_MasterDataDownload
    {
        DAL_MasterDataDownload _objDALMasterDataDownload = new DAL_MasterDataDownload();
        CurrentInfo _objCurrentInfo = new CurrentInfo();

        public bool InsertMasterData(List<MasterDataModel> lstUsers)
        {
            bool result = false;

            DataTable dtUserCodes = null;
            if (lstUsers.Count >= 1)
            {
                dtUserCodes = new DataTable();
                dtUserCodes.Columns.Add("Id", typeof(int));
                dtUserCodes.Columns.Add("Company_Code", typeof(string));
                dtUserCodes.Columns.Add("LoggedUser_Code", typeof(string));
                dtUserCodes.Columns.Add("Region_Code", typeof(string));
                dtUserCodes.Columns.Add("User_Code", typeof(string));
                dtUserCodes.Columns.Add("Entity", typeof(string));
                dtUserCodes.Columns.Add("Info", typeof(string));
                int id = 0;
                for (int i = 0; i < lstUsers.Count; i++)
                {
                    id++;
                    dtUserCodes.Rows.Add(id, lstUsers[i].Company_Code, lstUsers[i].LoggedUser_Code, lstUsers[i].Region_Code, lstUsers[i].User_Code, lstUsers[i].Entity, lstUsers[i].Info);
                }
            }
            result = _objDALMasterDataDownload.InsertMasterData(dtUserCodes);
            return result;
        }

        public List<MasterDetails> GetMasterData(string FromDate, string ToDate)
        {
            return _objDALMasterDataDownload.GetMasterData(FromDate, ToDate);
        }
    }
}
