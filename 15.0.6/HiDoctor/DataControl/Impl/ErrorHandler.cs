using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace DataControl.Impl
{
    public class ErrorHandler 
    {
        static Data _objData = new Data();
        static SPData _objSPData;
        const string SP_HD_Error_Log = "SP_HD_Error_Log";

        public static string InsertErrorLog(Exception ex, string screen_name, string menuurl)
        {
            string result = "";
            _objSPData = new SPData();
            _objData = new Data();
            CurrentInfo _objCur = new CurrentInfo();
            try
            {
                string companycode = _objCur.GetCompanyCode();
                string UserCode = _objCur.GetUserCode();
                string Companyid = _objCur.GetCompanyId();
                string message = ex.Message;
                string errdata = ex.Data.ToString();
                string errstacktrace = ex.StackTrace;
                string innerexception = ex.InnerException==null ? null : ex.InnerException.ToString();
                string source = ex.Source;
                using (SqlConnection cn = _objData.GetConnectionObject(companycode))
                {
                    cn.Open();
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companycode);
                    p.Add("@User_Code", UserCode);
                    p.Add("@Companyid", Companyid);
                    p.Add("@errmsg", message);
                    p.Add("@errdata", errdata);
                    p.Add("@errstack", errstacktrace);
                    p.Add("@errinnerex", innerexception);
                    p.Add("@errsrc", source);
                    p.Add("@screenname", screen_name);
                    p.Add("@menuurl", menuurl); //file/controller/method name
                    result = cn.Query<string>(SP_HD_Error_Log, p, commandType: CommandType.StoredProcedure).SingleOrDefault();
                    cn.Close();
                }
                if(result == "" || result == null)
                {
                    result = "Please contact salesadmin,there is some error in data";
                }
                
                return result;
            }
            catch (Exception exp)
            {
                throw exp;
            }

        }
        public static string InsertErrorLogsurvey(string ex, string screen_name, string menuurl)
        {
            string result = "";
            _objSPData = new SPData();
            _objData = new Data();
            CurrentInfo _objCur = new CurrentInfo();
            try
            {
                string companycode = _objCur.GetCompanyCode();
                string UserCode = _objCur.GetUserCode();
                string Companyid = _objCur.GetCompanyId();
                string message = ex;
                string errdata = "";
                string errstacktrace = "";
                string innerexception = "";
                string source ="";
                using (SqlConnection cn = _objData.GetConnectionObject(companycode))
                {
                    cn.Open();
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companycode);
                    p.Add("@User_Code", UserCode);
                    p.Add("@Companyid", Companyid);
                    p.Add("@errmsg", message);
                    p.Add("@errdata", errdata);
                    p.Add("@errstack", errstacktrace);
                    p.Add("@errinnerex", innerexception);
                    p.Add("@errsrc", source);
                    p.Add("@screenname", screen_name);
                    p.Add("@menuurl", menuurl); //file/controller/method name
                    result = cn.Query<string>(SP_HD_Error_Log, p, commandType: CommandType.StoredProcedure).SingleOrDefault();
                    cn.Close();
                }
                if (result == "" || result == null)
                {
                    result = "Please contact salesadmin,there is some error in data";
                }

                return result;
            }
            catch (Exception exp)
            {
                throw exp;
            }

        }
    }
}
