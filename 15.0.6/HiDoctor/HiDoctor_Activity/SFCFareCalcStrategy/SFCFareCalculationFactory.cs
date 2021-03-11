using System;
using System.Web;

namespace HiDoctor_Activity
{
    public class SFCFareCalculationFactory
    {
        public static ISFCFareCalculator GetSFCFareCalculationEngine(string TypeOfSFCFare)
        {
            switch (TypeOfSFCFare)
            {
                case "E":
                    return new SFCFareCalcStrategy.EFareCalcStrategy();
                case "S":
                    return new SFCFareCalcStrategy.SFareCalcStrategy();
                case "D":
                    return new SFCFareCalcStrategy.DFareCalcStrategy();
                case "D_FLAT":
                    return new SFCFareCalcStrategy.DFlatFareCalcStrategy();
                case "D_SLAB":
                    return new SFCFareCalcStrategy.DSlabFareCalcStrategy();
                case "DS":
                    return new SFCFareCalcStrategy.DSFareCalcStrategy();
                case "DS_FLAT":
                    return new SFCFareCalcStrategy.DSFlatFareCalcStrategy();
                case "DS_SLAB":
                    return new SFCFareCalcStrategy.DSSlabFareCalcStrategy();
                case "SD":
                    return new SFCFareCalcStrategy.SDFareCalcStrategy();
                case "SD_FLAT":
                    return new SFCFareCalcStrategy.SDFlatFareCalcStrategy();
                case "SD_SLAB":
                    return new SFCFareCalcStrategy.SDSlabFareCalcStrategy();
                default:
                    return null;
            }                
        }

        public bool CheckSfcMasterExist()
        {
            try
            {
                bool flag = false;
                DataControl.CurrentInfo objCurr = new DataControl.CurrentInfo();
                DataControl.Data objData = new DataControl.Data();
                string companyCode = objCurr.GetCompanyCode();
                string regionCode = objCurr.GetRegionCode();
                int result = 0;

                objData.OpenConnection(companyCode);
                {
                    result = Convert.ToInt32(objData.ExecuteScalar("exec SP_hdCheckSfcMasterExist '" + companyCode + "','" + regionCode + "'"));
                }
                objData.CloseConnection();

                if (result > 0)
                {
                    flag = true;
                }
                return flag;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}