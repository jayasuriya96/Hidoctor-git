using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace DataControl
{
    public class BLDivision
    {
        DALDivision _dalDivision = new DALDivision();
        public List<MVCModels.DivisionModel> GetDivisions(string companyCode)
        {
            return _dalDivision.GetDivisions(companyCode);
        }
        public int InsertDivision(string companyCode, string divisionCode, string divisionName, string mode, string userName, string divisionline)
        {
            List<MVCModels.DivisionModel> lstDivision = new List<MVCModels.DivisionModel>();
            try
            {
                if ("INSERT" == mode.ToUpper())
                {
                    MVCModels.DivisionModel objDivision = new MVCModels.DivisionModel();
                    objDivision.Company_Code = companyCode;
                    objDivision.Created_By = userName;
                    objDivision.Created_Date = DateTime.Now;
                    objDivision.Division_Name = divisionName;
                    objDivision.Record_Status = "1";
                    objDivision.Updated_By = userName;
                    objDivision.Updated_Date = DateTime.Now;
                    objDivision.divisionline = divisionline;
                    lstDivision.Add(objDivision);
                    return _dalDivision.InsertDivision(lstDivision, mode);
                }
                else
                {
                    MVCModels.DivisionModel objDivision = new MVCModels.DivisionModel();
                    objDivision.Company_Code = companyCode;
                    objDivision.Updated_By = userName;
                    objDivision.Updated_Date = DateTime.Now;
                    objDivision.Division_Name = divisionName;
                    objDivision.Division_Code = divisionCode;
                    objDivision.divisionline = divisionline;
                    lstDivision.Add(objDivision);
                    return _dalDivision.InsertDivision(lstDivision, mode);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("divisionCode", divisionCode);
                dicObj.Add("divisionName", divisionName);
                dicObj.Add("mode", mode);
                dicObj.Add("userName", userName);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return 0;
            }

        }
        public int DeleteDivision(string companyCode, string divisionCode, string divisionStatus, string userName)
        {
            try
            {
                List<MVCModels.DivisionModel> lstDivision = new List<MVCModels.DivisionModel>();
                MVCModels.DivisionModel objDivision = new MVCModels.DivisionModel();
                objDivision.Company_Code = companyCode;
                objDivision.Updated_By = userName;
                objDivision.Updated_Date = DateTime.Now;
                objDivision.Division_Code = divisionCode;
                objDivision.Record_Status = divisionStatus;
                lstDivision.Add(objDivision);
                return _dalDivision.InsertDivision(lstDivision, "DELETE");
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("divisionStatus", divisionStatus);
                dicObj.Add("divisionCode", divisionCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return 0;
            }
        }
        public int InsertDivisionEntityMapping(List<MVCModels.DivisionModel> lstDivision, string companyCode, string userCode, string regionCode, string entityCode, string entityName, string divisionCode)
        {
            return _dalDivision.InsertDivisionEntityMapping(lstDivision, entityCode,entityName, companyCode,userCode,regionCode, divisionCode);
        }
        public int DivisionEntityMapping(string companyCode, string userCode, string regionCode, string entityCode, string divisionCode, string entityName, string userName)
        {
            int rowAffected = 0;
            try
            {
                string[] arEntity;
                arEntity = entityCode.Split('^');
                if (arEntity.Length > 0)
                {
                    List<MVCModels.DivisionModel> lstDivision = new List<MVCModels.DivisionModel>();
                    for (int i = 0; i < arEntity.Length - 1; i++)
                    {
                        MVCModels.DivisionModel objDivision = new MVCModels.DivisionModel();
                        objDivision.Division_Code = divisionCode;
                        objDivision.Entity_Code = arEntity[i];
                        objDivision.Entity_Type = entityName;
                        objDivision.Company_Code = companyCode;
                        objDivision.Record_Status = "1";
                        objDivision.Created_By = userName;
                        objDivision.Created_Date = System.DateTime.Now;
                        objDivision.Updated_By = userName;
                        objDivision.Updated_Date = DateTime.Now;
                        lstDivision.Add(objDivision);
                    }
                    rowAffected = InsertDivisionEntityMapping(lstDivision, companyCode, userCode,regionCode, entityCode,entityName, divisionCode);
                }
                return rowAffected;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("EntityCode", entityCode);
                dicObj.Add("divisionCode", divisionCode);
                dicObj.Add("entityName", entityName);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return 0;
            }

        }
        public IEnumerable<MVCModels.DivisionEntityMapping> GetDivisionEntityDetails(string companyCode, string divisionCode, string entityType)
        {
            return _dalDivision.GetDivisionEntityDetails(companyCode, divisionCode, entityType);
        }
        public List<MVCModels.DivisionModel> GetDivisionsBasedonLoggedUser(string companyCode,string regionCode)
        {
            return _dalDivision.GetDivisionsBasedonLoggedUser(companyCode,regionCode);
        }
        public List<MVCModels.DivisionModel> GetDivisionsBasedonLoggedUserdivision(string companyCode, string regionCode,string UserCode)
        {
            return _dalDivision.GetDivisionsBasedonLoggedUserdivision(companyCode, regionCode,UserCode);
        }
    }
}
