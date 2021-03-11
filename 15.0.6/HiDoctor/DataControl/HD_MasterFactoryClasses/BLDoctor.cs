using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using DataControl.HD_MasterFactoryClasses;
using MVCModels;

namespace DataControl.HD_MasterFactoryClasses
{

    public class BLDoctor
    {
        DALDoctor _objDALDoctorspcl = new DALDoctor();
        //public List<DoctormasterModel> GetDoctorcolumns(string CompanyCode, string UserCode)
        //{
        //    List<DoctormasterModel> lstdc = null;
        //    try
        //    {
        //        lstdc = _objDALDoctorspcl.GetDoctorcolumns(CompanyCode, UserCode).ToList();
        //    }
        //    catch (Exception ex)
        //    {
        //        throw;
        //    }
        //    return lstdc;
        //}
      
        public List<MVCModels.speciality> GetDoctorspcl(string CompanyCode)
        {
            List<MVCModels.speciality> lstspcl = null;
            try
            {
                lstspcl = _objDALDoctorspcl.GetDoctorspcl(CompanyCode).ToList();
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstspcl;
        }
        public List<MVCModels.city> GetAllCities()
        {
            List<MVCModels.city> lstCities = null;
            try
            {
                lstCities = _objDALDoctorspcl.GetAllCities().ToList();
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstCities;
        }
        public List<MVCModels.category> GetDoctorcat(string CompanyCode,string RegionCode)
        {
            List<MVCModels.category> lstcat = null;
            try
            {
                lstcat = _objDALDoctorspcl.GetDoctorcat(CompanyCode,RegionCode).ToList();
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstcat;
        }
        public string InsertNewCityDetails(string UserCode, string cityname)
        {
            return _objDALDoctorspcl.InsertNewCityDetails(UserCode, cityname);
        }
    }
}
