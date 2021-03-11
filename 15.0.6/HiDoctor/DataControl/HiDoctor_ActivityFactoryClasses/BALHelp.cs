using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace DataControl
{
    public class BALHelp
    {
        private DALHelp objDALHelp = new DALHelp();

        public bool InsertHelpDescription(string pageId, string controlId, string helpItemId, string helpDescrip, out string errorMsg)
        {
            return objDALHelp.InsertHelpDescription(pageId, controlId, helpItemId, helpDescrip, out errorMsg);
        }
        public DataSet GetHelpDescription(string pageId, string controlId, out string errorMsg)
        {
            return objDALHelp.GetHelpDescription(pageId, controlId, out errorMsg);
        }

    }
}
