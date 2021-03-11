using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class ChangePasswordModel
    {
        
    }
    public class PasswordHistory
    {
        public string User_Pass { get; set; }
    }
    public class UserInfoModel
    {
        public string Company_Code { get; set; }
        public string User_Type_Code { get; set; }
        public string User_Code { get; set; }
        public string Region_Code { get; set; }
        public string Company_Id { get; set; }
        public string User_Details { get; set; }
        public string Region_Details { get; set; }
        public string Is_Mobile { get; set; }
        public int BatchProcessingId { get; set; }
        public string BP_Guid { get; set; }
        public int FileProcessId { get; set; }
        public string ViewType { get; set; }
    }

}
