using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class MasterDataModel
    {
        public string Company_Code { get; set; }
        public string LoggedUser_Code { get; set; }
        public string Region_Code { get; set; }
        public string User_Code { get; set; }
        public string Entity { get; set; }
        public string Info { get; set; }
    }
    public class MasterDetails
    {
        public string User_Name { get; set; }
        public string Designation { get; set; }
        public int User_Id { get; set; }
        public string Region_Name { get; set; }
        public string Date { get; set; }
        public string Status { get; set; }
    }
}
