using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace HiDoctor_Master.Models
{
    public class Regiontype
    {
        public string RegionTypeName { get; set; }
        public string UserRegionName { get; set; }
        public string UserRegionCode { get; set; }
        public string Ref_Key1 { get; set; }
        public string Ref_Key2 { get; set; }
    }
    public class ParameterMode
    {
        public string Company_Code { get; set; }
        public string SubDomain_Name { get; set; }
        public string Company_Id { get; set; }
        public string Region_Code { get; set; }
        public string User_Code { get; set; }
    }
}