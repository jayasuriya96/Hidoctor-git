using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class ProductMapping
    {
        public string Product_Name { get; set; }
        public string Brand_Name { get; set; }
        public string Speciality_Name { get; set; }
        public string Product_code { get; set; }
    }

    public class DestinationProductTypelst
    {
        public string Product_Type_Name { get; set; }
    }

    public class DestinationProductMapping
    {
        public string Product_Name { get; set; }
        public string Brand_Name { get; set; }
        public string Speciality_Name { get; set; }
        public string Competitor_Name { get; set; }
        public string UOM_Name { get; set; }
        public string UOM_Type_Name { get; set; }
        public string Product_code { get; set; }
        public string Mapped_Status { get; set; }
    }

    public class SelectedProductsList
    {
        public string Sales_Product_Code { get; set; }
        public string Mapping_Product_Code { get; set; }
    }

}
