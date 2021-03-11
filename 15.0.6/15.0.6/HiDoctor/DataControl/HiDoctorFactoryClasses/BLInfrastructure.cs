using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataControl
{
    public class BLInfrastructure
    {
        DALInfrastructure objDALInfra = new DALInfrastructure();

        public bool SiteMaintenance(string subdomainName)
        {
            return objDALInfra.SiteMaintenance(subdomainName);
        }
    }
}
