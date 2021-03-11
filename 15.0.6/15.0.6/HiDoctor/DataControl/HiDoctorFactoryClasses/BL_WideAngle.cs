using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataControl
{
    public class BL_WideAngle
    {
        DAL_WideAngle _objDALWA = new DAL_WideAngle();
        public bool IsEDAvailable(string companyCode, string userTypeCode)
        {
            return _objDALWA.IsEDAvailable(companyCode, userTypeCode);
        }
    }
}
