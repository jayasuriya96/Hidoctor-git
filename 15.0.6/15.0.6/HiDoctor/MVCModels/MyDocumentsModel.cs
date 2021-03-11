using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class MyDocumentsModel
    {
        public string Company_Code { get; set; }
        public int Doc_Type_Id { get; set; }
        public string Doc_Type_Name { get; set; }
        public DateTime Created_DateTime { get; set; }
        public string Icon_Path { get; set; }
    }

    public class MyDocumentTypeModel
    {
        public string Company_Code { get; set; }
        public string Doc_Id { get; set; }
        public string Doc_Type_Id { get; set; }
        public string User_Code { get; set; }
        public string Doc_Name { get; set; }
        public int Doc_Month { get; set; }
        public int Doc_Year { get; set; }
        public string Doc_Url { get; set; }
        public string Doc_Ext { get; set; }
        public string Uploaded_By { get; set; }
        public DateTime Uploaded_Date { get; set; }
        public string Download_By { get; set; }
        public string File_name { get; set; }
        public DateTime Download_Date { get; set; }

        public string Doc_Type_Name { get; set; }

    }

    public class MyDocumentFileUploads
    {
        public string Company_Code { get; set; }
        public int Doc_Upload_Id { get; set; }
        public string Doc_Type_Id { get; set; }
        public string Doc_Month { get; set; }
        public string Doc_Year { get; set; }
        public string Doc_Name { get; set; }
        public string Uploaded_By { get; set; }
        public string Uploaded_File_Url { get; set; }
        public string Uploaded_File_name { get; set; }
        public string Uploaded_Date { get; set; }
        public int User_Uploaded_Files_Count { get; set; }
        public int System_Uploaded_Files_Count { get; set; }
        public int Invalid_File_Count { get; set; }
        public int Status { get; set; }
        public int Processing_Status { get; set; }
        public string File_Extracting_status { get; set; }
        public string Doc_Upload_Category { get; set; }
        public int result { get; set; }
    }

    public class InvalidFiles
    {
        public string Company_Code { get; set; }
        public string Doc_file_Name { get; set; }
        public string ERR_REASON { get; set; }
    }
}
