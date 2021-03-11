#region Usings
using MVCModels.HiDoctor_Reports;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
#endregion Usings
namespace DataControl
{
   public class BL_DoctorChemistMetTabular
   {
       #region Private Variables
       private DAL_DoctorChemistMetTabular _dalDocChemTabular = null;
       #endregion Private Variables

       public List<DoctorChemistMetReportModel> GetDoctorChemistMetTabular(string company_Code, string userCodes, string startDate, string endDate)
       {
           userCodes = userCodes.Replace("[", "").Replace("]", "").Replace("\"","").ToString();
           List<string> lstUserCodes = new List<string>();
           lstUserCodes=(from string s in userCodes.Split(',')
                        select Convert.ToString(s)).ToList<string>();
           _dalDocChemTabular = new DAL_DoctorChemistMetTabular();
           List<DoctorChemistMetReportModel> lstDoctorChemistMetReport = new List<DoctorChemistMetReportModel>();
           foreach (string userCode in lstUserCodes)
           {
               DoctorChemistMetReportModel docChemReportModel = _dalDocChemTabular.GetDoctorChemistMetTabular(company_Code, userCode, startDate, endDate);
               lstDoctorChemistMetReport.Add(docChemReportModel);
           }
           return lstDoctorChemistMetReport;
       }

       //overloaded method for asynchronous reports
       public List<DoctorChemistMetReportModel> GetDoctorChemistMetTabular(string company_Code, string userCodes, string startDate, string endDate, string CurrUserCode, string ConnectionString, string SubDomain)
       {
           userCodes = userCodes.Replace("[", "").Replace("]", "").Replace("\"", "").ToString();
           List<string> lstUserCodes = new List<string>();
           lstUserCodes = (from string s in userCodes.Split(',')
                           select Convert.ToString(s)).ToList<string>();
           _dalDocChemTabular = new DAL_DoctorChemistMetTabular();
           List<DoctorChemistMetReportModel> lstDoctorChemistMetReport = new List<DoctorChemistMetReportModel>();
           foreach (string userCode in lstUserCodes)
           {
               DoctorChemistMetReportModel docChemReportModel = _dalDocChemTabular.GetDoctorChemistMetTabular(company_Code, userCode, startDate, endDate, ConnectionString);
               lstDoctorChemistMetReport.Add(docChemReportModel);
           }
           return lstDoctorChemistMetReport;
       }
    }
}
