using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace HiDoctor_Reports
{
    public interface IReportRepository
    {
        List<Models.MasterModel> UserDetails(string userCode, string companyCode) ;
        List<Models.TPReport> TPActualCount(string userCode, string companyCode, int month, int year,string entity);
        List<Models.TPDoctor> TPDoctorDetails(string userCode, string companyCode, int month, int year, string entity);       
    }
}
