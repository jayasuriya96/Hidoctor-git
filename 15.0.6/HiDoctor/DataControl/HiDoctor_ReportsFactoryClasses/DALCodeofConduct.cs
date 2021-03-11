using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace DataControl.HiDoctor_ReportsFactoryClasses
{
    public class DALCodeofConduct : DapperRepository
    {
        const string Usp_HD_GetAckCCForm = "Usp_HD_GetAckCCForm";

        public List<MVCModels.CCOverlayModel> GetAckRecords(string companyCode, string usertypecode, string userCode)
        {
            List<MVCModels.CCOverlayModel> lstccform = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@usertypecode", usertypecode);
                    p.Add("@userCode", userCode);
                    lstccform = connection.Query<MVCModels.CCOverlayModel>(Usp_HD_GetAckCCForm, p, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstccform;
        }

    }
}
