using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataControl.HiDoctorFactoryClasses
{
    public class BL_OneLib
    {
        DAL_OneLib _objDALOneLib = new DAL_OneLib();

        public bool IsOneLibAvailable(string companyCode, string userTypeCode)
        {
            return _objDALOneLib.IsOneLibAvailable(companyCode, userTypeCode);
        }
    }
}
