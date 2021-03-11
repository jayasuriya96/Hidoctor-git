using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace DataControl
{
    public class BLDepot
    {
        DALDepot objDepot;
        public DataSet GetDepotsforPrimarySales(string company_Code)
        {
            objDepot = new DALDepot();
            return objDepot.GetDepotsforPrimarySales(company_Code);
        }
    }
}
