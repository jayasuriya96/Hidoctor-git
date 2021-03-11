using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels.HiDoctor_Master
{
    public class WeekendGroup
    {
        #region Properties
        public string Weekend_Off_Code { get; set; }
        public string Weekend_Off_Name { get; set; }
        public string Region_Code { get; set; }
        #endregion Properties
    }

    public class WeekendDaysForARegion
    {
        public string Weekend_Date { get; set; }
    }
}
