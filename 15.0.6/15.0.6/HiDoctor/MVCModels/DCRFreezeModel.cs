using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class DCRFreezeModel
    {
        public DCRFreezeUsersModel dcrFreezeModel { get; set; }
        public DCRUNFreezeModel dcrUNFreezeModel { get; set; }
        public DCRFreezeInputs dcrFreezeInputs { get; set; }
    }

    public class DCRFreezeInputs
    {
        public string User_Code { get; set; }
        public string Company_Code { get; set; }
        public string DivisionCode { get; set; }
        public string Month { get; set; }
        public string Year { get; set; }
    }

    public class DCRFreezeUsersModel
    {
        public string User_Code { get; set; }
        public string User_Name { get; set; }
        public string User_Type_Name { get; set; }
        public string Region_Name { get; set; }
    }

    public class DCRUNFreezeModel
    {
        public string User_Code { get; set; }
        public string TP_Date { get; set; } // DCR Date
        public string TP_DateShow { get; set; }
        public string Activity_Code { get; set; } // DCR Type -- project_code
        public string Category { get; set; } // Work Category
        public string Work_Area { get; set; } // Work Place
       // public string CP_name { get; set; }
        public string CP_Name { get; set; } // CP Name
        public string SFC { get; set; } // SFC
        public string created_by { get; set; }
        public string Company_Code { get; set; }
        public string Request_UserCode { get; set; }
        public string Remark { get; set; }
        public int Company_Id { get; set; }
        public string Request_Released_By { get; set; }
        public string Released_Reason { get; set; }
        public string Released_By { get; set; }
    }
}
