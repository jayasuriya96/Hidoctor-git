using MVCModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataControl.HD_MasterFactoryClasses
{
    public class BL_DoctorsBirthday : DoctorsBirthday

    {
        DAL_DoctorsBirthday _objDL_DoctorsBirthday = new DAL_DoctorsBirthday();

        //public string GetDoctorDetails(string User_code, string Region_Code,string Company_Code)
        //{
        //    return _objDL_DoctorsBirthday.GetDoctorDetails(User_code,Region_Code, Company_Code);
        //}
        public List<DoctorsBirthday.DoctorsDetails> GetDoctorDetails(string Region_Code, string Company_Code, string Dob,string Division_code)
        {

            return _objDL_DoctorsBirthday.GetDoctorDetails(Region_Code, Company_Code, Dob, Division_code);
        }
        public List<DoctorsBirthday.CCUsers> GetdoctorsHierarchyByRegion(string Region_Code,string login_Region)
        {

            return _objDL_DoctorsBirthday.GetdoctorsHierarchyByRegion(Region_Code, login_Region);
        }
        public List<DoctorsBirthday.MailTemplates> GetMailTemplates()
        {

            return _objDL_DoctorsBirthday.GetMailTemplates();
        }
        public List<DoctorsBirthday.Division> GetAllDivisions(string Company_Code)


        {

            return _objDL_DoctorsBirthday.GetAllDivisions(Company_Code);

        }
    }
}
