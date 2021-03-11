#region Usings
using System;
#endregion Usings

namespace HiDoctor.Models
{
    public class MasterModel
    {
        #region Properties
        public string UserName { get; set; }
        public string UserCode { get; set; }
        public string UsertypeCode { get; set; }
        public string UserTypeName { get; set; }

        public string RegionName { get; set; }
        public string RegionCode { get; set; }
        public string RegionTypeCode { get; set; }
        public string RegionTypeName { get; set; }

        public string PrivilegeName { get; set; }
        public string PrivilegeValue { get; set; }
        #endregion Properties
    }
    public class CompanyDetails
    {
        public string UserName { get; set; }
        public string SubDomainName { get; set; }
        public string User_Type_Code { get; set; }

        public string User_Code { get; set; }
        public string Region_Code { get; set; }
        public string Company_Code { get; set; }
        public string Employee_Code { get; set; }
        public string Employee_Number { get; set; }
        public string Employee_Name { get; set; }
        public string Region_Name { get; set; }
        public string User_Type_Name { get; set; }
        public int Role_Id { get; set; }
    }
}