using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
   public class RequestMasterModel
    {
       public string Request_Code { get; set; }
       public string Request_Name { get; set; }
       public string Request_Entity { get; set; }
       public string Request_Type { get; set; }
       public string Credit_Limit { get; set; }
       public string Cycle_Code { get; set; }
       public string Cycle_Name { get; set; }
       public string Record_Status { get; set; }
       public string CM_Company_Code { get; set; }
       public string RM_Company_Code { get; set; }
       public string Created_By { get; set; }
       public string Created_Date { get; set; }
       public string Updated_By { get; set; }
       public string Updated_Date { get; set; }

    }

   public class DCRRestrictionModel
   {
       public string Company_Code { get; set; }
       public string Request_Id { get; set; }
       public string User_Code { get; set; }
       public string Region_Code { get; set; }
       public string Date_From { get; set; }
       public string Date_To { get; set; }
       public string Request_Category_Id { get; set; }
       public string Request_Category_Name { get; set; }
       public string Approved_Date_From { get; set; }
       public string Approved_Date_To { get; set; }
       public string Request_Status { get; set; }
       public string Requesting_User_Remarks { get; set; }
       public string Admin_Remarks { get; set; }
   }

   public class DCRRestriction_ExtensionModel
   {
       public string Request_Id { get; set; }
       public string Requesting_User_Remarks { get; set; }
       public string Requested_Date { get; set; }
       public string Released_By { get; set; }
       public string Released_Date { get; set; }
       public string Admin_Remarks { get; set; }
   }


   public class RequestCategoryMasterModel
   {
       public string Company_Code { get; set; }
       public string Request_Category_Id { get; set; }
       public string Request_Category_Name { get; set; }
       public string Request_Category_Status { get; set; }

   }
}
