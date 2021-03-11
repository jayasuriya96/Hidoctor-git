using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class DistanceFareChartModel
    {
        #region Properties
        public string Distance_Range_Code { get; set; }
        public int From_Km { get; set; }
        public int To_Km { get; set; }
        public string Fare_Amount { get; set; }
        public string User_Type_Code { get; set; }
        public string User_Type_Name { get; set; }
        public string Date_From { get; set; }
        public string Date_To { get; set; }
        public int Status { get; set; }
        public string Is_Amount_Fixed { get; set; }
        public string Entity_Name { get; set; }
        public string Entity_Code { get; set; }
        public string Fare { get; set; }
        public string Travel_Mode { get; set; }
        public string Created_By { get; set; }
        public string Update_By { get; set; }
        public string Action { get; set; }
        #endregion Properties
    }
}
