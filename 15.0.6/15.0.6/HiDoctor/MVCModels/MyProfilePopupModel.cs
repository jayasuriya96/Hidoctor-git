using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class MyProfilePopupModel
    {
        public string Company_Code { get; set; }
        public string User_Code { get; set; }
        public int Status { get; set; }
        public int Result { get; set; }
        public int NumberOfDay { get; set; }
    }

    public class CCOverlayModel
    {
        public string Company_Code { get; set; }
        public string User_Type_Code { get; set; }
        public string User_Code { get; set; }
        public int Result { get; set; }
        public int File_Id { get; set; }
        public string File_Name { get; set; }
        public string File_Title { get; set; }
        public string Ack_Option { get; set; }
        public int Acknowledge_Id { get; set; }
        public string Acknowledged_Date { get; set; }

    }
}
