using System;
using System.Web;

namespace HiDoctor_Activity.SFCFareCalcStrategy
{
    public class SDFlatFareCalcStrategy : ISFCFareCalculator
    {
        public double CalculateSFCFare(Models.FareCalculationDTO fareCalcPassed)
        {
            double totalFare = 0.0;
            bool flag = false;
            SFCFareCalculationFactory objSFCFact = new SFCFareCalculationFactory();

            flag = objSFCFact.CheckSfcMasterExist();
            if (flag)
            {
                // for SFC
                SFareCalcStrategy objS = new SFareCalcStrategy();
                totalFare = objS.CalculateSFCFare(fareCalcPassed);

                if (totalFare == 0.0)
                {
                    // for DFC
                    DFlatFareCalcStrategy objD = new DFlatFareCalcStrategy();
                    totalFare = objD.CalculateSFCFare(fareCalcPassed);
                }
            }
            else
            {
                // for DFC
                DFlatFareCalcStrategy objD = new DFlatFareCalcStrategy();
                totalFare = objD.CalculateSFCFare(fareCalcPassed);
            }
            return totalFare;
        }
    }
}