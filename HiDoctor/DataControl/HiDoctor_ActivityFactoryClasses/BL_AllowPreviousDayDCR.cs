using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataControl;
using MVCModels;

namespace DataControl.HiDoctor_ActivityFactoryClasses
{
    public class BL_AllowPreviousDayDCR
    {
        #region private variables
        private DAL_Allow_PreviousDayDCR _objDALPrvDayDCR = new DAL_Allow_PreviousDayDCR();
        #endregion private variables

        public List<Allow_PreviousDayDCR> GetPreviousDayDCR(string CompCode, string UsrCode, char PrvDayDCRStatus)
        {
            return _objDALPrvDayDCR.GetPreviousDayDCR(CompCode, UsrCode, PrvDayDCRStatus);
        }

        public bool InsertPreDayDCR(string Comp_Code, string userCodes, string LogUserCode, string DCR_Date, string Remarks)
        {
            return _objDALPrvDayDCR.InserPreviousDayDCR(Comp_Code, userCodes, LogUserCode, DCR_Date, Remarks);
        }
    }
}
