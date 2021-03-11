
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class DCRActivityLockModel
    {
        public string User_Code { get; set; }
        public string Locked_Date { get; set; }
        public string Released_Date { get; set; }
        public string Lock_Status { get; set; }
        public string Released_By { get; set; }
        public string Record_Status { get; set; }
        public string Lock_Type { get; set; }
        public string Lock_Reason { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string Activity_Flag { get; set; }
        public string Unapprove_Reason { get; set; }
        public string User_Name { get; set; }
        public string Request_Released_By { get; set; }
        public string Released_Reason { get; set; }
        public string Unapproved_by { get; set; }
        public string Privilegevalue { get; set; }

    }
   
    public class DCRLockReleaseDataForPagination
    {
        public int Totalcount { get; set; }
        public List<DCRLockReleaseData> lstDCRLock { get; set; }
    }
    public class DCRLockReleaseData
    {
        public string Locked_Date { get; set; }
        public string Released_Date { get; set; }
        public string DCR_Actual_Date { get; set; }
        public string Released_By { get; set; }
        public string Lock_Type { get; set; }
        public string LockDate { get; set; }
        public string ActualDate { get; set; }
        public string Request_Released_By { get; set; }
        public string Released_Reason { get; set; }
    }
    public class GroupModel
    {
        public int Group_Id { get; set; }
    }

    public class ManualLock
    {
        public string ErrorName { get; set; }
    }

}
