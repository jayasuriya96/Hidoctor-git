using Dapper;
using MVCModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataControl.HD_MasterFactoryClasses
{
    public class DAL_DoctorsBirthday : DapperRepository
    {
        //public string GetDoctorDetails(string User_Code, string Region_Code, string Company_Code)
        //{
        //    string result = string.Empty;
        //    try
        //    {
        //        using (IDbConnection connection = IDbOpenConnection())
        //        {

        //            var p = new DynamicParameters();

        //            p.Add("@Region_Code", Region_Code);
        //            p.Add("@Company_Code", Company_Code);

        //            connection.Execute("SP_HD_Doctors_Birthday_Details", p, commandType: CommandType.StoredProcedure);
        //            connection.Close();
        //        }
        //    }
        //    catch (Exception ex)
        //    {

        //    }
        //    return result;
        //}

        public List<DoctorsBirthday.DoctorsDetails> GetDoctorDetails(string Region_Code, string Company_Code, string Dob,string Division_code)
        {

            List<DoctorsBirthday.DoctorsDetails> lst = new List<DoctorsBirthday.DoctorsDetails>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Code", Region_Code);
                    p.Add("@Company_Code", Company_Code);
                    p.Add("@Dob", Dob);
                    p.Add("@Division_code", Division_code);
                    lst = connection.Query<DoctorsBirthday.DoctorsDetails>("SP_HD_Doctors_Birthday_Details", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch (Exception ex)
            {
                throw;
            }

            return lst;

        }

        public List<DoctorsBirthday.CCUsers> GetdoctorsHierarchyByRegion(string Region_Code,string login_Region)
        {

            List<DoctorsBirthday.CCUsers> lst = new List<DoctorsBirthday.CCUsers>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Code", Region_Code);
                    p.Add("@login_Region", login_Region);
                    //p.Add("@Year", Year);
                    lst = connection.Query<DoctorsBirthday.CCUsers>("Sp_Hd_Get_copy_holdersforMail", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch (Exception ex)
            {
                throw;
            }

            return lst;

        }

        public List<DoctorsBirthday.MailTemplates> GetMailTemplates()
        {

            List<DoctorsBirthday.MailTemplates> lstEmaildets = new List<DoctorsBirthday.MailTemplates>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();


                    //p.Add("@Year", Year);
                    lstEmaildets = connection.Query<DoctorsBirthday.MailTemplates>("Sp_Hd_GetMailDocTemplates", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch (Exception ex)
            {
                throw;
            }

            return lstEmaildets;

        }





       

        public List<DoctorsBirthday.Division> GetAllDivisions(string Company_Code)
        {

            List<DoctorsBirthday.Division> lst = new List<DoctorsBirthday.Division>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                   
                    p.Add("@Company_Code", Company_Code);
               
                    //p.Add("@Year", Year);
                    lst = connection.Query<DoctorsBirthday.Division>("SP_hd_GetDivisionlist", p, commandTimeout: 300, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch (Exception ex)
            {
                throw;
            }

            return lst;

        }

    }
}
