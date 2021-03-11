using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class RCPA_Header
    {
        public DateTime PeriodFrom { get; set; }
        public DateTime PeriodTo { get; set; }
        public string Region_Code { get; set; }
        public string Company_code { get; set; }
        public int Company_Id { get; set; }
        public string user_code { get; set; }
    }
    public class RCPA_Doctor
    {
        public int Row_Number { get; set; }
        public string Doctor_Name { get; set; }
    }
    public class RCPA_SalesProduct
    {
        public string Doctor_Name { get; set; }
        public string SalesProduct_Name { get; set; }
        public string Product_Quantity { get; set; }
        public int Row_No { get; set; }
    }
    public class RCPA_CompProduct
    {
        public string Doctor_Name { get; set; }
        public string SalesProduct_Name { get; set; }
        public string Comp_Product_Name { get; set; }
        public string Product_Quantity { get; set; }
        public int Row_No { get; set; }
    }
    public class RcpaExcelUpload
    {
        public int Sno { get; set; }
        public string Doctor_Name { get; set; }
        public string File_Name { get; set; }
        public string File_Path { get; set; }
        public string User_name { get; set; }
        public string Created_Date { get; set; }
    }
}
