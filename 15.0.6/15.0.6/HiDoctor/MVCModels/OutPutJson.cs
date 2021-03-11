using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels.OutputJson
{
    public class OutPutJson
    {
        public int Status { get; set; }
        public string Message { get; set; }
        public object list { get; set; }
        public int Count { get; set; }
    }
}
