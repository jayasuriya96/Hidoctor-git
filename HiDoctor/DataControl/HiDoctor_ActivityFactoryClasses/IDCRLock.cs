#region Usings
using System.Collections.Generic;
using MVCModels;
using System.Text;
using MVCModels.HiDoctor_Master;
#endregion Usings

namespace DataControl.HiDoctor_ActivityFactoryClasses
{
    public interface IDCRLock
    {
        StringBuilder GetActivityLockHTMLFormat(string company_Code, string user_Code);
        string ReleaseActivityLock(string company_Code, string userCode, string dcrDetails,string releasedBy);
        List<UserModel> GetAcivityLockedUsers(string company_Code);
        int InsertActivityLock(string company_Code, List<DCRActivityLockModel> dcrActivityLockModel);
        bool InsertDCRManualLock(string company_Code, string lock_User_Codes, string LockDateFrom, string LockDateTo, string user_Code, string lockReason);
        List<MVCModels.HiDoctor_Master.UserModel> EmployeeDetails(string companycode, string user_Code);
    }
}
