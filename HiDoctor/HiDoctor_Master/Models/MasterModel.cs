#region Usings
using System;
#endregion Usings

namespace HiDoctor_Master.Models
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
        public string  PrivilegeValue { get; set; }        
        #endregion Properties
    }
}