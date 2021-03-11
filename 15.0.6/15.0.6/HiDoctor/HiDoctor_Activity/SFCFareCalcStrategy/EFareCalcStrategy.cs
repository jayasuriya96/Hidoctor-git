using System;
using System.Web;

namespace HiDoctor_Activity.SFCFareCalcStrategy
{
    public class EFareCalcStrategy:ISFCFareCalculator
    {
        public double CalculateSFCFare(Models.FareCalculationDTO fareCalcPassed)
        {
            double totalFare = fareCalcPassed.EligibilityAmount;
            return totalFare;
        }
    }
}

