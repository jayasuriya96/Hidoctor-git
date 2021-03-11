
namespace MVCModels
{
  public class ProjectMasterModel
    {
        public string Company_Code { get; set; }
        public string Project_Code { get; set; }
        public string Project_Name { get; set; }
        public string Project_Lead_Code { get; set; }
        public string Project_Lead_Name { get; set; }
        public string Client_Code { get; set; }
        public string Domain_Code { get; set; }
        public string Start_Date { get; set; }
        public string End_Date { get; set; }
        public string Status { get; set; }
        public string Remarks { get; set; }
        public string Company_Name { get; set; }
        public string Domain_Name { get; set; }
      public string Created_By {get;set;}
      public string Created_Date{get;set;}
      public string Updated_By {get;set;}
      public string Updated_Date { get; set; }
    }

  public class ProjectLead
  {
      public string User_Code { get; set; }
      public string User_Name { get; set; }
      public string Company_Code { get; set; }
  }

}
