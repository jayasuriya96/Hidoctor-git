using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace HiDoctor_Master.Models
{
    public class RegionCategoryModel
    {
        [Display(Name="Region Category Name")]
        public string Region_Classification_Name { get; set; }

        public string Region_Classification_Code { get; set; }
        public string Record_Status { get; set; }
        public string Row_Version_No { get; set; }

    }
}