using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class SplashScreenModel
    {
        public int Splash_Screen_Id { get; set; }
        public string Splash_Type { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime Date_From { get; set; }
        public DateTime Date_To { get; set; }
        public string File_Path { get; set; }
        public bool Record_Status { get; set; }
        public string Record_Status_Display_Name { get; set; }
        public string Company_Code { get; set; }
        public bool Has_Attachment { get; set; }
        public string Mobile_Attachment_Url { get; set; }
        public int Assigned_To_All_Users { get; set; }
        public int Is_Completed { get; set; }
        public DateTime Last_Modified_DateTime { get; set; }
        public string Description_HTML { get; set; }
        public int Splash_Count { get; set; }
    }

    public class SplashUsersModel
    {
        public string Company_Code { get; set; }
        public int Splash_Screen_Id { get; set; }
        public int User_Id { get; set; }
        public DateTime History_DateTime { get; set; }
        public string Splash_Type { get; set; }
    }
}
