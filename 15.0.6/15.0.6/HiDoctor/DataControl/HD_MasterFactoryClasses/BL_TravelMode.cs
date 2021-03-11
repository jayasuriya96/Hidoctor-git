#region Usings
using System;
using System.Linq;
using System.Collections.Generic;
using MVCModels;
#endregion Usings
namespace DataControl
{
    public class BL_TravelMode
    {
        #region Private Variables
        #endregion Private Variables

        #region Private Methods
        #endregion Private Methods

        #region Public Methods
        public IEnumerable<TravelModeModel> GetTravelModes(string company_Code)
        {
            DAL_TravelMode objTravelMode = new DAL_TravelMode();
            return objTravelMode.GetTravelModes(company_Code);
        }
        #endregion Public Methods
    }
}
