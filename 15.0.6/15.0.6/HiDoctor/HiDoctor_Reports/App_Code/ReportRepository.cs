#region Using
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using HiDoctor_Reports;
using System.Data;
using System.Data.SqlClient;
using System.Reflection;

#endregion Using

namespace HiDoctor_Reports
{
    public class ReportRepository :IReportRepository
    {
        #region Private Variables
        //private IReportRepository _objI = new ReportRepository();       

        private DataControl.Data _objData = new  DataControl.Data();
        #endregion Private Variables

        public List<object> GetTpVsActualDeviationSummary(string userCode, string companyCode, int month, int year)
        {
            List<object> lstTP = new List<object>();

            List<Models.MasterModel> lstUser = UserDetails(userCode, companyCode);
            List<Models.TPReport> lstPlanCount = TPActualCount(userCode, companyCode, month, year, "P");
            List<Models.TPReport> lstDeviation = TPActualCount(userCode, companyCode, month, year, "D");
            List<Models.TPDoctor> lstDoc = TPDoctorDetails(userCode, companyCode, month, year, "D");
            List<Models.TPDoctor> lstCP = TPDoctorDetails(userCode, companyCode, month, year, "CP");
            lstTP.Add(lstUser);
            lstTP.Add(lstPlanCount);
            lstTP.Add(lstDeviation);
            lstTP.Add(lstDoc);
            lstTP.Add(lstCP);
             
            return lstTP;
        }

        //async tp vs actual deviation summary report
        public List<object> GetTpVsActualDeviationSummary(string userCode, string companyCode, int month, int year, string ConnectionString)
        {
            List<object> lstTP = new List<object>();

            List<Models.MasterModel> lstUser = UserDetails(userCode, companyCode, ConnectionString);
            List<Models.TPReport> lstPlanCount = TPActualCount(userCode, companyCode, month, year, "P", ConnectionString);
            List<Models.TPReport> lstDeviation = TPActualCount(userCode, companyCode, month, year, "D", ConnectionString);
            List<Models.TPDoctor> lstDoc = TPDoctorDetails(userCode, companyCode, month, year, "D", ConnectionString);
            List<Models.TPDoctor> lstCP = TPDoctorDetails(userCode, companyCode, month, year, "CP", ConnectionString);
            lstTP.Add(lstUser);
            lstTP.Add(lstPlanCount);
            lstTP.Add(lstDeviation);
            lstTP.Add(lstDoc);
            lstTP.Add(lstCP);

            return lstTP;
        }

        private List<T> DataReaderMapToList<T>(IDataReader dr)
        {
            List<T> list = new List<T>();
            T obj = default(T);

            var cols = dr.GetSchemaTable().Rows.Cast<DataRow>().Select(row => row["ColumnName"] as string).ToList();
            while (dr.Read())
            {
                obj = Activator.CreateInstance<T>();
                foreach (PropertyInfo prop in obj.GetType().GetProperties())
                {
                    if (cols.Contains(prop.Name))
                    {
                        if (!object.Equals(dr[prop.Name], DBNull.Value))
                        {
                            prop.SetValue(obj, dr[prop.Name], null);
                        }
                    }
                }
                list.Add(obj);
            }
            return list;
        }

        public List<Models.MasterModel> UserDetails(string userCode, string companyCode)
        {
            try
            {
                List<Models.MasterModel> lstUserDetail = new List<Models.MasterModel>();

                _objData.OpenConnection(companyCode);
                using (IDataReader reader = _objData.ExecuteReader("exec SP_hdGetTpVsActualDeviationSummary '" + companyCode + "', '" + userCode + "','','','USER'"))
                {
                    lstUserDetail = DataReaderMapToList<Models.MasterModel>(reader);
                }
                _objData.CloseConnection();

                return lstUserDetail;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        //async tp vs actual deviation summary report
        public List<Models.MasterModel> UserDetails(string userCode, string companyCode, string ConnectionString)
        {
            try
            {
                List<Models.MasterModel> lstUserDetail = new List<Models.MasterModel>();

                _objData.OpenConnection(companyCode, ConnectionString);
                using (IDataReader reader = _objData.ExecuteReader("exec SP_hdGetTpVsActualDeviationSummary '" + companyCode + "', '" + userCode + "','','','USER'"))
                {
                    lstUserDetail = DataReaderMapToList<Models.MasterModel>(reader);
                }
                _objData.CloseConnection();

                return lstUserDetail;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public List<Models.TPReport> TPActualCount(string userCode, string companyCode, int month, int year, string entity)
        {
            try
            {
                List<Models.TPReport> lstTP = new List<Models.TPReport>();

                if (entity == "P")
                {
                    _objData.OpenConnection(companyCode);
                    using (IDataReader reader = _objData.ExecuteReader("exec SP_hdGetTpVsActualDeviationSummary '" + companyCode + "', '" + userCode + "','" + month + "','" + year + "','COUNT'"))
                    {
                        lstTP = DataReaderMapToList<Models.TPReport>(reader);
                    }
                    _objData.CloseConnection();
                }
                else if (entity == "D")
                {
                    _objData.OpenConnection(companyCode);
                    using (IDataReader reader = _objData.ExecuteReader("exec SP_hdGetTpVsActualDeviationSummaryCount '" + companyCode + "', '" + userCode + "','" + month + "','" + year + "'"))
                    {
                        lstTP = DataReaderMapToList<Models.TPReport>(reader);
                    }
                    _objData.CloseConnection();
                }
                return lstTP;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }


        //async tp vs actual deviation summary
        public List<Models.TPReport> TPActualCount(string userCode, string companyCode, int month, int year, string entity, string ConnectionString)
        {
            try
            {
                List<Models.TPReport> lstTP = new List<Models.TPReport>();
                _objData.OpenConnection(companyCode, ConnectionString);

                if (entity == "P")
                {
                    using (IDataReader reader = _objData.ExecuteReader("exec SP_hdGetTpVsActualDeviationSummary '" + companyCode + "', '" + userCode + "','" + month + "','" + year + "','COUNT'"))
                    {
                        lstTP = DataReaderMapToList<Models.TPReport>(reader);
                    }
                }
                else if (entity == "D")
                {
                    using (IDataReader reader = _objData.ExecuteReader("exec SP_hdGetTpVsActualDeviationSummaryCount '" + companyCode + "', '" + userCode + "','" + month + "','" + year + "'"))
                    {
                        lstTP = DataReaderMapToList<Models.TPReport>(reader);
                    }
                }
                _objData.CloseConnection();
                return lstTP;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public List<Models.TPDoctor> TPDoctorDetails(string userCode, string companyCode, int month, int year, string entity)
        {
            SqlDataReader sqldataReader;
            List<Models.TPDoctor> lstTP = new List<Models.TPDoctor>();
            try
            {
                _objData.OpenConnection(companyCode);
                {
                    if (entity == "D")
                    {
                        using (sqldataReader = _objData.ExecuteReader("exec SP_hdGetTpVsActualDeviationSummary '" + companyCode + "', '"
                            + userCode + "','" + month + "','" + year + "','DOCTOR'"))
                        {
                            while (sqldataReader.Read())
                            {
                                Models.TPDoctor objDoc = new Models.TPDoctor();
                                objDoc.User_Code = sqldataReader["User_Code"].ToString();
                                objDoc.Doctor_Code = sqldataReader["Doctor_Code"].ToString();
                                objDoc.TP_Count = Convert.ToInt32(sqldataReader["TP_Count"]);
                                if (!string.IsNullOrEmpty(Convert.ToString(sqldataReader["Visit_Count"])))
                                {
                                    objDoc.Visit_Count = Convert.ToInt32(sqldataReader["Visit_Count"]);
                                }
                                else
                                {
                                    objDoc.Visit_Count = 0;
                                }
                                lstTP.Add(objDoc);
                            }
                        }
                    }
                    else if (entity == "CP")
                    {
                        using (sqldataReader = _objData.ExecuteReader("exec SP_hdGetTpVsActualDeviationSummary '" + companyCode + "', '"
                            + userCode + "','" + month + "','" + year + "','CP'"))
                        {
                            while (sqldataReader.Read())
                            {
                                Models.TPDoctor objDoc = new Models.TPDoctor();
                                objDoc.User_Code = sqldataReader["User_Code"].ToString();
                                objDoc.Doctor_Code = sqldataReader["Doctor_Code"].ToString();
                                lstTP.Add(objDoc);
                            }
                        }
                    }

                }
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstTP;
        }

        //async tp vs actual deviation summary
        public List<Models.TPDoctor> TPDoctorDetails(string userCode, string companyCode, int month, int year, string entity, string ConnectionString)
        {
            SqlDataReader sqldataReader;
            List<Models.TPDoctor> lstTP = new List<Models.TPDoctor>();
            try
            {
                _objData.OpenConnection(companyCode, ConnectionString);
                {
                    if (entity == "D")
                    {
                        using (sqldataReader = _objData.ExecuteReader("exec SP_hdGetTpVsActualDeviationSummary '" + companyCode + "', '"
                            + userCode + "','" + month + "','" + year + "','DOCTOR'"))
                        {
                            while (sqldataReader.Read())
                            {
                                Models.TPDoctor objDoc = new Models.TPDoctor();
                                objDoc.User_Code = sqldataReader["User_Code"].ToString();
                                objDoc.Doctor_Code = sqldataReader["Doctor_Code"].ToString();
                                objDoc.TP_Count = Convert.ToInt32(sqldataReader["TP_Count"]);
                                if (!string.IsNullOrEmpty(Convert.ToString(sqldataReader["Visit_Count"])))
                                {
                                    objDoc.Visit_Count = Convert.ToInt32(sqldataReader["Visit_Count"]);
                                }
                                else
                                {
                                    objDoc.Visit_Count = 0;
                                }
                                lstTP.Add(objDoc);
                            }
                        }
                    }
                    else if (entity == "CP")
                    {
                        using (sqldataReader = _objData.ExecuteReader("exec SP_hdGetTpVsActualDeviationSummary '" + companyCode + "', '"
                            + userCode + "','" + month + "','" + year + "','CP'"))
                        {
                            while (sqldataReader.Read())
                            {
                                Models.TPDoctor objDoc = new Models.TPDoctor();
                                objDoc.User_Code = sqldataReader["User_Code"].ToString();
                                objDoc.Doctor_Code = sqldataReader["Doctor_Code"].ToString();
                                lstTP.Add(objDoc);
                            }
                        }
                    }

                }
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstTP;
        }

    }
}