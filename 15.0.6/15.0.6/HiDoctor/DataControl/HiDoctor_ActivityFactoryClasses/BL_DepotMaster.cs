using System;
using System.Data;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MVCModels;

namespace DataControl.HiDoctor_ActivityFactoryClasses
{
    public class BL_DepotMaster
    {
        #region private variables
        private DAL_Depot _objDALDepotMaster = new DAL_Depot();
        private DataControl.CurrentInfo _objCurrentInfo = new CurrentInfo();
        #endregion private variables

        public List<DepotModel> GetDepotDetails()
        {
            return _objDALDepotMaster.GetDepotDetails();
        }

        public int InsertDepotDetails(string DepotCode, string DepName, string DepShtName, string Add1, string Add2, string phne, string mob, string DLN1, string DLN2, string GST, string RKey1)
        {
            List<DepotModel> lstDepModel = new List<DepotModel>();
            DepotModel DM = new DepotModel();
            string CmpCode = _objCurrentInfo.GetCompanyCode();
            string UsrCode = _objCurrentInfo.GetUserCode();

            DM.Company_Code = CmpCode;
            DM.Depot_Code = DepotCode;
            DM.Location = "";
            DM.Depot_Name = DepName;
            DM.Depot_Short_Name = DepShtName;
            DM.Address1 = Add1;
            DM.Address2 = Add2;
            DM.Phone_Number = phne;
            DM.Mobile_Number = mob;
            DM.Drug_License_Number1 = DLN1;
            DM.Drug_License_Number2 = DLN2;
            DM.CST_Number = GST;
            DM.UserCode = UsrCode;
            DM.Ref_Key1 = RKey1;

            lstDepModel.Add(DM);

            return _objDALDepotMaster.InsertDepot(lstDepModel);
        }

        public List<DepotModel> FindDepotDetails(string CmpCode, string DepCode, string DepName)
        {
            List<DepotModel> lstDModel = new List<DepotModel>();
            lstDModel = _objDALDepotMaster.SearchDepotDetails(CmpCode, DepCode, DepName);
            return lstDModel;
        }

        public int ChangingRecordStatus(string C_Code, string D_Code, string D_Name)
        {
            int lstReturnValue = 0;
            lstReturnValue = _objDALDepotMaster.UpdateRecordStatus(C_Code, D_Code, D_Name);
            return lstReturnValue;
        }
    }
}