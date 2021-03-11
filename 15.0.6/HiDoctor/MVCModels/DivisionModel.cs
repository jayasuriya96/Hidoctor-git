using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class DivisionModel
    {
        public string Division_Name { get; set; }
        public string Division_Code { get; set; }
        public string Record_Status { get; set; }
        //  public List<DivisionEntityMapping> lstEntityMapping { get; set; }
        public string Entity_Code { get; set; }
        public string Entity_Type { get; set; }
        public string Company_Code { get; set; }
        public string Created_By { get; set; }
        public string Updated_By { get; set; }
        public DateTime Created_Date { get; set; }
        public DateTime Updated_Date { get; set; }
        public string divisionline { get; set; }
        public string Lineofbussiness { get; set; }
    }

    public class DivisionEntityMapping
    {
        public string Entity_Code { get; set; }
        public string Entity_Name { get; set; }
    }
}
