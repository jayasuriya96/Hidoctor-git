using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MVCModels
{
    public class DieticianModel
    {
        public string SubDomain_Name { get; set; }
        public string Company_Code { get; set; }
        public string Region_Code { get; set; }
        public string User_Code { get; set; }
        public string User_Type_Code { get; set; }
        public string User_Name { get; set; }
        public string Region_Name { get; set; }
        public string latitude { get; set; }
        public string longitude { get; set; }

    }
    public class DieticianAPPView
    {
        public string User_Code { get; set; }
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public string User_Name { get; set; }
        public string Company_Code { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public int Sub_Activity_Code { get; set; }
        public string Activity_Code { get; set; }
        public int Header_Id { get; set; }
        public string Dcr_Date { get; set; }
        public string Selected_Region_Code { get; set; }
    }
}
