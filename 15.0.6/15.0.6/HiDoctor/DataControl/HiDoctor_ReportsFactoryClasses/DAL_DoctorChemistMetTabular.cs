#region Usings
using Dapper;
using MVCModels.HiDoctor_Reports;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
#endregion Usings
namespace DataControl
{
    public class DAL_DoctorChemistMetTabular:DapperRepository
    {
        #region Constant Strings
        const string SP_HDGETDOCTORCHEMISTMETTABULARREPORT = "SP_HDGetDoctorChemistMetTabularReport";
        #endregion Constant Strings

        public DoctorChemistMetReportModel GetDoctorChemistMetTabular(string company_Code, string user_Code, string start_Date, 
            string end_Date)
        {
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", company_Code);
                    p.Add("@User_Code", user_Code);
                    p.Add("@StartDate", start_Date);
                    p.Add("@EndDate", end_Date);

                    var DoctorChemistTabular = connection.QueryMultiple(SP_HDGETDOCTORCHEMISTMETTABULARREPORT, p, commandType: CommandType.StoredProcedure);

                    DoctorChemistMetReportModel objDocChemMetReport = new DoctorChemistMetReportModel();
                    objDocChemMetReport.lstUserDetail = DoctorChemistTabular.Read<UserDetailModel>().ToList();
                    objDocChemMetReport.lstDivisionModel = DoctorChemistTabular.Read<DivisionReportModel>().ToList();
                    objDocChemMetReport.lstDCRHeader = DoctorChemistTabular.Read<DCRHeaderReportModel>().ToList();
                    objDocChemMetReport.lstDCRDoctorVisit = DoctorChemistTabular.Read<DCRDoctorVisitReportModel>().ToList();
                    objDocChemMetReport.lstAccompanist = DoctorChemistTabular.Read<DCRAccompanistDetail>().ToList();
                    objDocChemMetReport.lstDCRChemistVisit = DoctorChemistTabular.Read<DCRChemistVisitReportModel>().ToList();
                    

                    connection.Close();
                    return objDocChemMetReport;
                }
            }
            catch
            {
                throw;
            }
        }

        //overloaded method for asynchronous reports
        public DoctorChemistMetReportModel GetDoctorChemistMetTabular(string company_Code, string user_Code, string start_Date,
            string end_Date, string ConnectionString)
        {
            try
            {
                using (IDbConnection connection = IDbOpenConnection(ConnectionString))
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", company_Code);
                    p.Add("@User_Code", user_Code);
                    p.Add("@StartDate", start_Date);
                    p.Add("@EndDate", end_Date);

                    var DoctorChemistTabular = connection.QueryMultiple(SP_HDGETDOCTORCHEMISTMETTABULARREPORT, p, commandType: CommandType.StoredProcedure);

                    DoctorChemistMetReportModel objDocChemMetReport = new DoctorChemistMetReportModel();
                    objDocChemMetReport.lstUserDetail = DoctorChemistTabular.Read<UserDetailModel>().ToList();
                    objDocChemMetReport.lstDivisionModel = DoctorChemistTabular.Read<DivisionReportModel>().ToList();
                    objDocChemMetReport.lstDCRHeader = DoctorChemistTabular.Read<DCRHeaderReportModel>().ToList();
                    objDocChemMetReport.lstDCRDoctorVisit = DoctorChemistTabular.Read<DCRDoctorVisitReportModel>().ToList();
                    objDocChemMetReport.lstAccompanist = DoctorChemistTabular.Read<DCRAccompanistDetail>().ToList();
                    objDocChemMetReport.lstDCRChemistVisit = DoctorChemistTabular.Read<DCRChemistVisitReportModel>().ToList();

                    connection.Close();
                    return objDocChemMetReport;
                }
            }
            catch
            {
                throw;
            }
        }
    }
}
