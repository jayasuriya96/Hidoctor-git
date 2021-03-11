using System;
using System.Web;

namespace HiDoctor_Activity.SFCFareCalcStrategy
{
    public class DSFlatFareCalcStrategy : ISFCFareCalculator
    {
        public double CalculateSFCFare(Models.FareCalculationDTO fareCalcPassed)
        {
            double totalFare = 0.0;

            // for DFC
            DFlatFareCalcStrategy objDFLAT = new DFlatFareCalcStrategy();
            totalFare = objDFLAT.CalculateSFCFare(fareCalcPassed);

            if (totalFare == 0.0)// for SFC
            {
                SFareCalcStrategy objS = new SFareCalcStrategy();
                totalFare = objS.CalculateSFCFare(fareCalcPassed);
            }
            return totalFare;
        }
    }
}