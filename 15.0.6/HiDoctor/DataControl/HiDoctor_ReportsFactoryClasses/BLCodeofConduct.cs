using DataControl.HiDoctor_ReportsFactoryClasses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataControl.HiDoctor_ReportsFactoryClasses
{
    public class BLCodeofConduct
    {
        DALCodeofConduct objDCC;


        public List<MVCModels.CCOverlayModel> GetAckRecords(string companyCode, string usertypecode, string userCode)
        {
            List<MVCModels.CCOverlayModel> lstCCForm = null;
            try
            {
                objDCC = new DALCodeofConduct();
                lstCCForm = objDCC.GetAckRecords(companyCode, usertypecode, userCode).ToList();
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstCCForm;
        }


    }
}
