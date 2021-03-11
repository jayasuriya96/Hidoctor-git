using System;
using System.Text;
//using HiDoctor_Activity.Models;

namespace HiDoctor_Activity
{
    /// <summary>
    /// Sylvia
    /// This interface contains methods that need to be implemented by concrete classes
    /// that are varieties of SFC fare calculations
    /// </summary>

    public interface ISFCFareCalculator
    {
        double CalculateSFCFare(HiDoctor_Activity.Models.FareCalculationDTO fareCalcPassed);
    }

    public interface IDFCFareCalculator
    {
        double CalculateSFCFare(HiDoctor_Activity.Models.FareCalculationDTO fareCalcPassed, double distance, string travelmode, string entity, string sumDistance);
    }
  
}
