using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataControl
{
    public class BL_STOS
    {
        public string GetConfitValueForSize(string companyCode)
        {
            DAL_STOS _objSTOS = new DAL_STOS();
            return _objSTOS.GetConfitValueForSize(companyCode);
        }
    }
}
