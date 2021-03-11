using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class ShieldRCPA
    {
        public DateTime PeriodFrom { get; set; }
        public DateTime PeriodTo { get; set; }
        public string Company_code { get; set; }
        public int Company_Id { get; set; }
        public string user_code { get; set; }
    }
}
