using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using MVCModels;
using ElmahWrapper;
using System.Linq;
using Microsoft.SqlServer.Server;

namespace DataControl
{
    public class DAL_DCRStockiestExpense : DapperRepository
    {
        private SqlDataReader sqlDR;
        const string SP_hdGetStockiest = "SP_hdGetStockiest";
        const string SP_hdGetDraftedStockiest = "SP_hdGetDraftedStockiest";
        const string SP_HD_V4_GetExpenseNG = "SP_HD_V4_GetExpenseNG";
        const string SP_hdGetDraftedExpense = "SP_hdGetDraftedExpense";
        const string SP_hdInsertStockiest = "SP_hdInsertStockiest";
        const string SP_hdInsertExpense = "SP_hdInsertExpense";
        const string SP_hdUpdateProductAndChangeStatus = "SP_hdUpdateProductAndChangeStatus";
        const string SP_hdCheckDailyAllowanceEntry = "SP_hdCheckDailyAllowanceEntry";
        const string SP_hdGetWeeklyExpenseSum = "SP_hdGetWeeklyExpenseSum";
        const string SP_hdGetExpenseSum = "SP_hdGetExpenseSum";
        const string SP_HD_V4_GetDCRCommonRemarks = "SP_HD_V4_GetDCRCommonRemarks";
        const string SP_HDUpdateOrderStatus = "SP_HDUpdateOrderStatus";

        const string SP_hdUpdateDCRCommonRemarks = "SP_hdUpdateDCRCommonRemarks";
        const string SP_hdDeleteDCRFromTempTable = "SP_hdDeleteDCRFromTempTable";
        const string SP_hd_V4_GetHopPlacesForDFCCalculation = "SP_hd_V4_GetHopPlacesForDFCCalculation";
        const string SP_hd_V4_GetDistanceMatrixValues = "SP_hd_V4_GetDistanceMatrixValues";
        const string SP_HDGETEXPENSESUM_FOR_VALIDATION = "SP_hdGetExpenseSum_For_Validation";
        const string SP_HD_GETCOMMONREMARKSMANDATORY = "Sp_hd_getcommonremarksmandatory";
        //Adding Accompanist's Stockiest Details
        const string SP_HD_V4_GETACCOMPANISTSTOCKIESTDETAILS = "SP_HD_V4_GetAccompanistStockiestDetails";
        const string Sp_hd_VisitTimePrivValues = "Sp_hd_VisitTimePrivValues";

        #region - Adding Accompanist's Stockiest details
        public List<DCRStockiestModel> GetAccompaistStockist(string companyCode, string acc_RegionCode, string regionCode)
        {
            SPData _objSPData = new SPData();
            Data _objData = new Data();
            List<DCRStockiestModel> lstStock = new List<DCRStockiestModel>();

            try
            {
                SqlCommand command = new SqlCommand(SP_HD_V4_GETACCOMPANISTSTOCKIESTDETAILS);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@Acc_RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 200, acc_RegionCode);
                _objSPData.AddParamToSqlCommand(command, "@Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);

                _objData.OpenConnection(companyCode);
                {
                    using (sqlDR = _objData.ExecuteReader(command))
                    {
                        while (sqlDR.Read())
                        {
                            DCRStockiestModel objStock = new DCRStockiestModel();
                            objStock.StockiestCode = sqlDR["Customer_Code"].ToString();
                            objStock.StockiestName = sqlDR["Customer_Name"].ToString();
                            objStock.StockiestRegionCode = sqlDR["Region_Code"].ToString();
                            lstStock.Add(objStock);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstStock;
        }
        #endregion - Adding Accompanist's stockiest details

        public List<VisitTimePrivValues> checkVisitTimePrivilge(string companyCode, string usertypecode)
        {
            List<VisitTimePrivValues> lstresult = new List<VisitTimePrivValues>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@companycode", companyCode);
                    p.Add("@usertype", usertypecode);
                    lstresult = connection.Query<VisitTimePrivValues>(Sp_hd_VisitTimePrivValues, p, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lstresult;
        }


        public List<DCRStockiestModel> GetStockist(string companyCode, string regionCode)
        {
            SPData _objSPData = new SPData();
            Data _objData = new Data();
            List<DCRStockiestModel> lstStock = new List<DCRStockiestModel>();

            try
            {
                SqlCommand command = new SqlCommand(SP_HD_V4_GETACCOMPANISTSTOCKIESTDETAILS);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);

                _objData.OpenConnection(companyCode);
                {
                    using (sqlDR = _objData.ExecuteReader(command))
                    {
                        while (sqlDR.Read())
                        {
                            DCRStockiestModel objStock = new DCRStockiestModel();
                            objStock.StockiestCode = sqlDR["Customer_Code"].ToString();
                            objStock.StockiestName = sqlDR["Customer_Name"].ToString();
                            lstStock.Add(objStock);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstStock;
        }

        public List<DCRStockiestModel> GetDraftedStockist(string companyCode, string userCode, string dcrCode, string dcrDate)
        {
            SPData _objSPData = new SPData();
            Data _objData = new Data();
            List<DCRStockiestModel> lstStock = new List<DCRStockiestModel>();

            try
            {
                SqlCommand command = new SqlCommand(SP_hdGetDraftedStockiest);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@DCRCode", ParameterDirection.Input, SqlDbType.VarChar, 50, dcrCode);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objSPData.AddParamToSqlCommand(command, "@DCRActualDate", ParameterDirection.Input, SqlDbType.VarChar, 30, dcrDate);

                _objData.OpenConnection(companyCode);
                {
                    using (sqlDR = _objData.ExecuteReader(command))
                    {
                        while (sqlDR.Read())
                        {
                            DCRStockiestModel objStock = new DCRStockiestModel();
                            objStock.StockiestCode = sqlDR["Customer_Code"].ToString();
                            objStock.StockiestName = sqlDR["Stockiest_Name"].ToString();
                            objStock.VisitSession = sqlDR["Visit_Mode"].ToString();
                            objStock.StockiestRemark = sqlDR["Remarks_By_User"].ToString();
                            objStock.POB = sqlDR["PO_Amount"].ToString();
                            objStock.collectionAmnt = sqlDR["Collection_Amount"].ToString();
                            objStock.VisitTime = sqlDR["Visit_Time"].ToString();
                            lstStock.Add(objStock);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstStock;
        }

        // Stockiest Expense
        public string InsertStockiest(string companyCode, string userCode, string dcrCode, string dcrDate, string dcrStatus, string stockiestData)
        {
            SPData _objSPData = new SPData();
            Data _objData = new Data();
            try
            {
                string cmdText = SP_hdInsertStockiest;
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@DCRCode", ParameterDirection.Input, SqlDbType.VarChar, 50, dcrCode);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objSPData.AddParamToSqlCommand(command, "@DCRActualDate", ParameterDirection.Input, SqlDbType.VarChar, 30, dcrDate);
                _objSPData.AddParamToSqlCommand(command, "@DCRStatus", ParameterDirection.Input, SqlDbType.VarChar, 5, dcrStatus);
                _objSPData.AddParamToSqlCommand(command, "@StockiestDetails", ParameterDirection.Input, SqlDbType.VarChar, stockiestData.Length, stockiestData);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                string result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "InsertStockiest()");
                return ex.Message;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }



        public DataSet GetExenseDetails(string companyCode, string userCode, string regionCode, string dcrDate, string expenseEntity,string dcrFlag)
        {
            DataSet ds = new DataSet();
            SPData _objSPData = new SPData();
            Data _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_V4_GetExpenseNG);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@DCRDate", ParameterDirection.Input, SqlDbType.VarChar, 15, dcrDate);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                _objSPData.AddParamToSqlCommand(command, "@ExpenseEntity", ParameterDirection.Input, SqlDbType.VarChar, 20, expenseEntity);
                _objSPData.AddParamToSqlCommand(command, "@dcrFlag", ParameterDirection.Input, SqlDbType.VarChar, 20, dcrFlag);
                _objData.OpenConnection(companyCode);
                ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public List<DCRExpenseModel> GetDraftedExenseDetails(string companyCode, string userCode, string dcrCode, string dcrDate, string dcrFlag)
        {
            SPData _objSPData = new SPData();
            Data _objData = new Data();
            List<DCRExpenseModel> lstExp = new List<DCRExpenseModel>();

            try
            {
                SqlCommand command = new SqlCommand(SP_hdGetDraftedExpense);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@DCRCode", ParameterDirection.Input, SqlDbType.VarChar, 50, dcrCode);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objSPData.AddParamToSqlCommand(command, "@DCRActualDate", ParameterDirection.Input, SqlDbType.VarChar, 30, dcrDate);
                _objSPData.AddParamToSqlCommand(command, "@DCRFlag", ParameterDirection.Input, SqlDbType.VarChar, 20, dcrFlag);

                _objData.OpenConnection(companyCode);
                {
                    using (sqlDR = _objData.ExecuteReader(command))
                    {
                        while (sqlDR.Read())
                        {
                            DCRExpenseModel objExp = new DCRExpenseModel();

                            objExp.ExpenseTypeCode = sqlDR["Expense_Type_Code"].ToString();
                            objExp.ExpenseTypeName = sqlDR["Expense_Type_Name"].ToString();
                            objExp.ExpenseRemark = sqlDR["Expense_Remarks"].ToString();
                            objExp.ExpenseAmount = sqlDR["Expense_Amount"].ToString();

                            lstExp.Add(objExp);
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstExp;
        }

        public string DailyAllowanceCheck(string companyCode, string dcrCode, string dcrFlag, string expenseTypeCode)
        {
            string result = string.Empty;
            SPData _objSPData = new SPData();
            Data _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_hdCheckDailyAllowanceEntry);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@DCRCode", ParameterDirection.Input, SqlDbType.VarChar, 50, dcrCode);
                _objSPData.AddParamToSqlCommand(command, "@Flag", ParameterDirection.Input, SqlDbType.VarChar, 5, dcrFlag);
                _objSPData.AddParamToSqlCommand(command, "@ExpenseTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, expenseTypeCode);

                _objData.OpenConnection(companyCode);
                result = Convert.ToString(_objData.ExecuteScalar(command));
                return result;
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public double GetWeeklyExpenseSum(string companyCode, string userCode, string dcrDate, string expenseTypeCode)
        {
            double result = 0.0;
            SPData _objSPData = new SPData();
            Data _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_hdGetWeeklyExpenseSum);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objSPData.AddParamToSqlCommand(command, "@DCRDate", ParameterDirection.Input, SqlDbType.VarChar, 30, dcrDate);
                _objSPData.AddParamToSqlCommand(command, "@expenseTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, expenseTypeCode);

                _objData.OpenConnection(companyCode);
                result = Convert.ToDouble(_objData.ExecuteScalar(command));
                return result;
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public double GetExpenseSum(string companyCode, string userCode, string fromDate, string toDate, string expenseTypeCode, string dcrActualDate)
        {
            double result = 0.0;
            SPData _objSPData = new SPData();
            Data _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETEXPENSESUM_FOR_VALIDATION);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@userCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objSPData.AddParamToSqlCommand(command, "@fromDate", ParameterDirection.Input, SqlDbType.VarChar, 30, fromDate);
                _objSPData.AddParamToSqlCommand(command, "@toDate", ParameterDirection.Input, SqlDbType.VarChar, 30, toDate);
                _objSPData.AddParamToSqlCommand(command, "@expenseTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, expenseTypeCode);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Actual_Date", ParameterDirection.Input, SqlDbType.VarChar, 15, dcrActualDate);

                _objData.OpenConnection(companyCode);
                result = Convert.ToDouble(_objData.ExecuteScalar(command));
                return result;
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }




        public string InsertExpense(string companyCode, string userCode, string dcrCode, string dcrDate,
          string dcrStatus, string expenseContent, string dailyAllowance, string flag, DateCapturingModel _objDateDetails)
        {
            SPData _objSPData = new SPData();
            Data _objData = new Data();
            try
            {
                string cmdText = SP_hdInsertExpense;

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@DCRCode", ParameterDirection.Input, SqlDbType.VarChar, 50, dcrCode);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objSPData.AddParamToSqlCommand(command, "@DCRActualDate", ParameterDirection.Input, SqlDbType.Date, 30, dcrDate);
                _objSPData.AddParamToSqlCommand(command, "@DCRStatus", ParameterDirection.Input, SqlDbType.VarChar, 5, dcrStatus);
                _objSPData.AddParamToSqlCommand(command, "@PrivilegeValue", ParameterDirection.Input, SqlDbType.VarChar, 1000, dailyAllowance);
                _objSPData.AddParamToSqlCommand(command, "@ExpenseDetails", ParameterDirection.Input, SqlDbType.VarChar, expenseContent.Length, expenseContent);
                _objSPData.AddParamToSqlCommand(command, "@DCRFlag", ParameterDirection.Input, SqlDbType.VarChar, 1, flag);
                _objSPData.AddParamToSqlCommand(command, "@UTC_Date", ParameterDirection.Input, SqlDbType.VarChar, 100, _objDateDetails.UTC_Date);
                _objSPData.AddParamToSqlCommand(command, "@Entered_Date", ParameterDirection.Input, SqlDbType.VarChar, 100, _objDateDetails.Date);
                _objSPData.AddParamToSqlCommand(command, "@Entered_TimeZone", ParameterDirection.Input, SqlDbType.VarChar, 1000, _objDateDetails.TimeZone);
                _objSPData.AddParamToSqlCommand(command, "@Entered_OffSet", ParameterDirection.Input, SqlDbType.VarChar, 100, _objDateDetails.Off_Set);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                string result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "InsertExpense()");
                return ex.Message;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string UpdateProductAndStatus(string companyCode, string userCode, string userName, string regionCode, string regionName, string dcrCode,
                                                string dcrDate, string autoApproval, string dcrFlag, string lattitude, string longitude, string location)
        {
            SPData _objSPData = new SPData();
            Data _objData = new Data();
            try
            {
                string cmdText = SP_hdUpdateProductAndChangeStatus;
                string todayDate = DateTime.Now.ToShortDateString();

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@DCRCode", ParameterDirection.Input, SqlDbType.VarChar, 50, dcrCode);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objSPData.AddParamToSqlCommand(command, "@AutoApproval", ParameterDirection.Input, SqlDbType.VarChar, 5, autoApproval);
                _objSPData.AddParamToSqlCommand(command, "@UserName", ParameterDirection.Input, SqlDbType.VarChar, 30, userName);
                _objSPData.AddParamToSqlCommand(command, "@Date", ParameterDirection.Input, SqlDbType.VarChar, 12, dcrDate);
                _objSPData.AddParamToSqlCommand(command, "@Lattitue", ParameterDirection.Input, SqlDbType.VarChar, 30, lattitude);
                _objSPData.AddParamToSqlCommand(command, "@Longitude", ParameterDirection.Input, SqlDbType.VarChar, 30, longitude);
                _objSPData.AddParamToSqlCommand(command, "@Location", ParameterDirection.Input, SqlDbType.VarChar, 500, location);
                _objSPData.AddParamToSqlCommand(command, "@RegionName", ParameterDirection.Input, SqlDbType.VarChar, 500, regionName);
                _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 500, regionCode);
                _objSPData.AddParamToSqlCommand(command, "@flag", ParameterDirection.Input, SqlDbType.VarChar, 1, dcrFlag);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                string result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "UpdateProductAndStatus()");
                return ex.Message;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string UpdateDCRCommonRemarks(string companyCode, string dcrCode, string dcrFlag, string dcrStatus, string commonRemarks, string isSubmit, string commonRemarksStatus)
        {
            SPData _objSPData = new SPData();
            Data _objData = new Data();
            try
            {
                string cmdText = SP_hdUpdateDCRCommonRemarks;
                string todayDate = DateTime.Now.ToShortDateString();

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@DCRCode", ParameterDirection.Input, SqlDbType.VarChar, 50, dcrCode);
                _objSPData.AddParamToSqlCommand(command, "@DCRFlag", ParameterDirection.Input, SqlDbType.VarChar, 1, dcrFlag);
                _objSPData.AddParamToSqlCommand(command, "@DCRStatus", ParameterDirection.Input, SqlDbType.VarChar, 1, dcrStatus);
                _objSPData.AddParamToSqlCommand(command, "@CommonRemarks", ParameterDirection.Input, SqlDbType.VarChar, commonRemarks.Length, commonRemarks);
                _objSPData.AddParamToSqlCommand(command, "@isSubmit", ParameterDirection.Input, SqlDbType.VarChar, isSubmit.Length, isSubmit);
                _objSPData.AddParamToSqlCommand(command, "@commonRemarksStatus", ParameterDirection.Input, SqlDbType.VarChar, commonRemarksStatus.Length, commonRemarksStatus);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                string result = returnValue.Value.ToString();
                return result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "UpdateDCRCommonRemarks()");
                return ex.Message;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }


        public string GetCommonRemarks(string companyCode, string dcrCode, string dcrFlag)
        {
            string result = string.Empty;
            SPData _objSPData = new SPData();
            Data _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_V4_GetDCRCommonRemarks);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@DCRCode", ParameterDirection.Input, SqlDbType.VarChar, 50, dcrCode);
                _objSPData.AddParamToSqlCommand(command, "@DCRFlag", ParameterDirection.Input, SqlDbType.VarChar, 5, dcrFlag);

                _objData.OpenConnection(companyCode);
                result = Convert.ToString(_objData.ExecuteScalar(command));
                return result;
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public int UpdatePOBOrderStatus(string companyCode, string Order_Id, string orderStatus, string orderMode, string createdBy, string dcrActualDate)
        {
            SPData _objSPData = new SPData();
            Data _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_HDUpdateOrderStatus);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@Order_Id", ParameterDirection.Input, SqlDbType.Int, 8, Order_Id);
                _objSPData.AddParamToSqlCommand(command, "@Order_Status", ParameterDirection.Input, SqlDbType.Int, 8, orderStatus);
                _objSPData.AddParamToSqlCommand(command, "@Order_Mode", ParameterDirection.Input, SqlDbType.Int, 8, orderMode);
                _objSPData.AddParamToSqlCommand(command, "@Created_By", ParameterDirection.Input, SqlDbType.VarChar, 12, createdBy);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Actual_Date", ParameterDirection.Input, SqlDbType.Date, 50, dcrActualDate);

                _objData.OpenConnection(companyCode);
                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.Int);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                int result = Convert.ToInt32(returnValue.Value.ToString());
                return result;
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        public string GetCommonRemarksMandatory(string companyCode, DateTime dcrDate, string userCode, string dcrFlag)
        {
            string result = "NO";
            SPData _objSPData = new SPData();
            Data _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_GETCOMMONREMARKSMANDATORY);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@dcrDate", ParameterDirection.Input, SqlDbType.Date, 50, dcrDate);
                _objSPData.AddParamToSqlCommand(command, "@userCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objSPData.AddParamToSqlCommand(command, "@dcrFlag", ParameterDirection.Input, SqlDbType.VarChar, 5, dcrFlag);
                _objData.OpenConnection(companyCode);
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                    if (dataReader.HasRows)
                        while (dataReader.Read())
                            result = dataReader["status"].ToString();
                return result;
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string DeleteDCRTempTableRecords(string companyCode, string dcrCode, string dcrFlag)
        {
            SPData _objSPData = new SPData();
            Data _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_hdDeleteDCRFromTempTable);
                command.CommandType = CommandType.StoredProcedure;
                string result = string.Empty;

                _objSPData.AddParamToSqlCommand(command, "@DCRCode", ParameterDirection.Input, SqlDbType.VarChar, 50, dcrCode);
                _objSPData.AddParamToSqlCommand(command, "@Flag", ParameterDirection.Input, SqlDbType.VarChar, 10, dcrFlag);

                SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 500;
                command.Parameters.Add(returnValue);

                _objData.OpenConnection(companyCode);
                using (SqlDataReader sqldataReader = _objData.ExecuteReader(command))
                {
                    result = returnValue.Value.ToString();
                }

                return result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "DeleteDCRTempTableRecords()");
                return ex.Message;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetDCRTravelledPlacesForFareCalculation(string companyCode, string dcrCode, string dcrFlag, string dcrCategory)
        {
            DataSet ds = new DataSet();
            SPData _objSPData = new SPData();
            Data _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_hd_V4_GetHopPlacesForDFCCalculation);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@DcrCode", ParameterDirection.Input, SqlDbType.VarChar, 50, dcrCode);
                _objSPData.AddParamToSqlCommand(command, "@DCRFlag", ParameterDirection.Input, SqlDbType.VarChar, 1, dcrFlag);
                _objSPData.AddParamToSqlCommand(command, "@DCRCategory", ParameterDirection.Input, SqlDbType.VarChar, 50, dcrCategory);

                _objData.OpenConnection(companyCode);
                ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }


        public DataSet GetDistanceMatrixForFareCalculation(string companyCode, string userTypeCode, string entity, string travelMode, string dcrDate)
        {
            DataSet ds = new DataSet();
            SPData _objSPData = new SPData();
            Data _objData = new Data();
            try
            {
                SqlCommand command = new SqlCommand(SP_hd_V4_GetDistanceMatrixValues);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@userTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userTypeCode);
                _objSPData.AddParamToSqlCommand(command, "@entity", ParameterDirection.Input, SqlDbType.VarChar, 50, entity);
                _objSPData.AddParamToSqlCommand(command, "@travelMode", ParameterDirection.Input, SqlDbType.VarChar, 50, travelMode);
                _objSPData.AddParamToSqlCommand(command, "@dcrDate", ParameterDirection.Input, SqlDbType.VarChar, 10, dcrDate);


                _objData.OpenConnection(companyCode);
                ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public double GetSFCFare(string companyCode, string fromPlace, string toPlace, string sfcRegionCode, string sfcCategory, string travelMode, string dcrDate)
        {
            try
            {
                double fareAmount = 0.0;
                Data objData = new Data();
                objData.OpenConnection(companyCode);
                {
                    fareAmount = Convert.ToDouble(objData.ExecuteScalar("exec SP_hd_V4_GetSFCAmount '" + companyCode + "','" + sfcRegionCode + "','" + fromPlace + "','" + toPlace + "','" + sfcCategory + "','" + travelMode + "','" + dcrDate + "'"));
                }
                objData.CloseConnection();
                return fareAmount;
            }
            catch
            {
                return 0.0;
            }
        }
        public string InsertAttendanceDoctor(List<DCRDoctorVisitModel> lsAttendance_Doctor_Details, List<DCRProductDetailsModel> lsAttendance_Samples_Details, List<DCRActivity> lstAttendance_Activity, List<DCRProductDetailsModel> lstAttendance_Batch, string Company_Code, string dcr_code, DateTime dcr_date, string user_code,List<CMETracking> CME)
        {
            string rValue = "";
            if (lsAttendance_Doctor_Details != null && lsAttendance_Doctor_Details.Count > 0)
            {
                SqlConnection objSqlConnection = new SqlConnection();
                Data _objData = new Data();
                objSqlConnection = _objData.GetConnectionObject(Company_Code);
                objSqlConnection.Open();

                SqlTransaction objSqlTransaction = objSqlConnection.BeginTransaction();

                try
                {
                    //using (IDbConnection connection = IDbOpenConnection())
                    //{
                    //    var p = new DynamicParameters();
                    //    p.Add("@dcr_code", dcr_code);
                    //    p.Add("@dcr_date", dcr_date);
                    //    p.Add("@user_code", user_code);
                    //    connection.Execute("HD_SP_UpdateAttrndanceDoctorDetails", p, commandType: CommandType.StoredProcedure);
                    //    connection.Close();
                    //}

                    SPData _objSPData = new SPData();


                    string cmdText = "HD_SP_InsertAttendance";
                    SqlCommand command = new SqlCommand(cmdText);
                    command.Connection = objSqlConnection;
                    command.Transaction = objSqlTransaction;
                    command.CommandType = CommandType.StoredProcedure;
                    // _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_AttendanceDoctor", ParameterDirection.Input, SqlDbType.Structured, new AttendanceDoctorEnumurator(lsAttendance_Doctor_Details), "TVP_AttendanceDoctor");
                    // _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_AttendanceDoctorSample", ParameterDirection.Input, SqlDbType.Structured, new AttendanceSamplesDetailEnumurator(lsAttendance_Samples_Details), "TVP_AttendanceDoctorSample");
                    //  _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCR_Attendance_Activity", ParameterDirection.Input, SqlDbType.Structured, new AttendanceActivityDetailEnumurator(lstAttendance_Activity), "TVP_DCR_Attendance_Activity");
                    //  _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCR_Attendance_Batch_Details", ParameterDirection.Input, SqlDbType.Structured, new AttendanceSamplesBatchDetailEnumurator(lstAttendance_Batch), "TVP_DCR_Attendance_Batch_Details");
                    _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, user_code);
                    if (lsAttendance_Doctor_Details.Count == 0)
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_AttendanceDoctor", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_AttendanceDoctor");
                    }
                    else
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_AttendanceDoctor", ParameterDirection.Input, SqlDbType.Structured, new AttendanceDoctorEnumurator(lsAttendance_Doctor_Details), "TVP_AttendanceDoctor");
                    }

                    if (lsAttendance_Samples_Details.Count == 0)
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_AttendanceDoctorSample", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_AttendanceDoctorSample");
                    }
                    else
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_AttendanceDoctorSample", ParameterDirection.Input, SqlDbType.Structured, new AttendanceSamplesDetailEnumurator(lsAttendance_Samples_Details), "TVP_AttendanceDoctorSample");
                    }
                    if (lstAttendance_Activity.Count == 0)
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCR_Attendance_Activity", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_DCR_Attendance_Activity");
                    }
                    else
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCR_Attendance_Activity", ParameterDirection.Input, SqlDbType.Structured, new AttendanceActivityDetailEnumurator(lstAttendance_Activity), "TVP_DCR_Attendance_Activity");
                    }
                    if (lstAttendance_Batch.Count == 0)
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCR_Attendance_Batch_Details", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_DCR_Attendance_Batch_Details");
                    }
                    else
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCR_Attendance_Batch_Details", ParameterDirection.Input, SqlDbType.Structured, new AttendanceSamplesBatchDetailEnumurator(lstAttendance_Batch), "TVP_DCR_Attendance_Batch_Details");
                    }
                    if (CME.Count == 0)
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCR_Attendance_CME_Details", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_DCR_Attendance_CME_Details");
                    }
                    else
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCR_Attendance_CME_Details", ParameterDirection.Input, SqlDbType.Structured, new AttendanceCMEEnumurator(CME), "TVP_DCR_Attendance_CME_Details");
                    }
                    // command.ExecuteNonQuery();
                    //_objData.OpenConnection(Company_Code);
                    //_objData.ExecuteNonQuery(command);
                    //SqlDataReader reader = _objData.ExecuteReader(command);
                    //if (reader.HasRows)
                    //    while (reader.Read())
                    //    {
                    //    }
                    SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                    returnValue.Direction = ParameterDirection.Output;
                    returnValue.Size = 500;
                    command.Parameters.Add(returnValue);

                    //    _objData.OpenConnection(company_Code);
                    _objData.ExecuteNonQuery(command);
                    objSqlTransaction.Commit();
                    rValue = command.Parameters["@Result"].Value.ToString();
                }

                catch (Exception ex)
                {
                    objSqlTransaction.Rollback();
                    rValue = "0";
                    throw ex;
                }
            }
            return rValue;
        }
        public List<Attendance_Doctor_Details> GetDoctorProductDetails(DateTime dcr_date, string dcr_code)
        {
            List<Attendance_Doctor_Details> lsAttendance_Doctor_Details = new List<Attendance_Doctor_Details>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@dcr_code", dcr_code);
                    p.Add("@dcr_date", dcr_date);
                    lsAttendance_Doctor_Details = connection.Query<Attendance_Doctor_Details>("HD_SP_GetDoctorProductDetails", p, commandType: CommandType.StoredProcedure).ToList();

                    connection.Close();
                }
            }
            catch (Exception ex)
            {

            }
            return lsAttendance_Doctor_Details;
        }
    }
    public class AttendanceDoctorEnumurator : IEnumerable<SqlDataRecord>
    {

        public AttendanceDoctorEnumurator(IEnumerable<DCRDoctorVisitModel> data)
        {
            _data = data;
        }
        private IEnumerable<DCRDoctorVisitModel> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("Doctor_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("Doctor_Name", SqlDbType.VarChar, 100),
         new SqlMetaData("DCR_Code", SqlDbType.VarChar, 50),
         new SqlMetaData("DCR_Actual_Date", SqlDbType.DateTime),
         new SqlMetaData("Speciality_Name", SqlDbType.VarChar, 50),
         new SqlMetaData("Speciality_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("Category_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("Company_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("Company_Id", SqlDbType.Int),
         new SqlMetaData("MDL_Number", SqlDbType.VarChar, 100),
         new SqlMetaData("Doctor_Region_Code", SqlDbType.VarChar, 30 ),
         new SqlMetaData("Doctor_Region_Name", SqlDbType.VarChar, 30),
         new SqlMetaData("Category_Name ", SqlDbType.VarChar, 30),
         //new SqlMetaData("id", SqlDbType.Int),
         new SqlMetaData("User_code", SqlDbType.VarChar, 30),
         new SqlMetaData("Statue", SqlDbType.Int),
         new SqlMetaData("Visit_Time", SqlDbType.VarChar,10),
         new SqlMetaData("Visit_Mode", SqlDbType.VarChar,10),
         new SqlMetaData("Campaign_Code", SqlDbType.VarChar,10),
         new SqlMetaData("CampaignType",SqlDbType.VarChar,30),
         new SqlMetaData("Call_Objective_ID", SqlDbType.BigInt),
         new SqlMetaData("Business_Status_ID", SqlDbType.Int),
         new SqlMetaData("Remarks_By_User", SqlDbType.VarChar,500),


          };
            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.Doctor_Code);
                record.SetValue(1, item.Doctor_Name);
                record.SetValue(2, item.DCR_Code);
                record.SetValue(3, Convert.ToDateTime(item.DCR_Actual_Date));
                record.SetValue(4, item.Speciality_Name);
                record.SetValue(5, item.Speciality_Code);
                record.SetValue(6, item.Category_Code);
                record.SetValue(7, item.Company_Code);
                record.SetValue(8, item.Company_Id);
                record.SetValue(9, item.MDL_Number);
                record.SetValue(10, item.Doctor_Region_Code);
                record.SetValue(11, item.Doctor_Region_Name);
                record.SetValue(12, item.Category_Name);
                //record.SetValue(13, item.Category_Code);
                record.SetValue(13, item.User_code);
                record.SetValue(14, 0);
                record.SetValue(15, item.Doctor_Visit_Time);
                record.SetValue(16, item.Visit_Mode);
                record.SetValue(17, item.Marketing_Campaign_ID);
                record.SetValue(18, item.CampaignType);
                record.SetValue(19, Convert.ToInt64(item.Call_Objective_ID));
                record.SetValue(20, Convert.ToInt32(item.Business_Status_ID));
                record.SetValue(21, item.Remarks);

                yield return record;
            }

        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }
    public class AttendanceSamplesDetailEnumurator : IEnumerable<SqlDataRecord>
    {

        public AttendanceSamplesDetailEnumurator(IEnumerable<DCRProductDetailsModel> data)
        {
            _data = data;
        }
        private IEnumerable<DCRProductDetailsModel> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("DCR_Code", SqlDbType.VarChar, 50),
         new SqlMetaData("DCR_Actual_Date", SqlDbType.Date),
         new SqlMetaData("Product_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("Quantity_Provided", SqlDbType.Int),
         new SqlMetaData("Company_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("Company_Id", SqlDbType.Int),
         new SqlMetaData("Doctor_Name", SqlDbType.VarChar, 100),
         new SqlMetaData("Remark", SqlDbType.VarChar, 500),
         new SqlMetaData("User_code", SqlDbType.VarChar, 30),
         new SqlMetaData("Speciality_Name",SqlDbType.VarChar,50),
          };

            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.DCR_Code);
                record.SetValue(1, item.DCR_Actual_Date);
                record.SetValue(2, item.Product_Code);
                record.SetValue(3, Convert.ToInt32(item.Quantity_Provided));
                record.SetValue(4, item.Company_Code);
                record.SetValue(5, item.Company_Id);
                record.SetValue(6, item.Doctor_Name);
                record.SetValue(7, item.Remark);
                record.SetValue(8, item.User_code);
                record.SetValue(9, item.Speciality_Name);
                yield return record;
            }

        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }

    public class AttendanceSamplesBatchDetailEnumurator : IEnumerable<SqlDataRecord>
    {

        public AttendanceSamplesBatchDetailEnumurator(IEnumerable<DCRProductDetailsModel> data)
        {
            _data = data;
        }
        private IEnumerable<DCRProductDetailsModel> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("Quantity_Provided", SqlDbType.Int),
         new SqlMetaData("Product_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("Batch_Number", SqlDbType.VarChar, 30),
         new SqlMetaData("Doctor_Name", SqlDbType.VarChar,50),
         new SqlMetaData("DCR_Visit_Code", SqlDbType.VarChar, 30),
          };

            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, Convert.ToInt32(item.Quantity_Provided));
                record.SetValue(1, item.Product_Code);
                record.SetValue(2, item.Batch_Number);
                record.SetValue(3, item.Doctor_Name);
                record.SetValue(4, item.DCR_Visit_Code);
                yield return record;
            }

        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }

    public class AttendanceActivityDetailEnumurator : IEnumerable<SqlDataRecord>
    {

        public AttendanceActivityDetailEnumurator(IEnumerable<DCRActivity> data)
        {
            _data = data;
        }
        private IEnumerable<DCRActivity> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("Activity_Type", SqlDbType.VarChar, 10),
         new SqlMetaData("Customer_Activity_ID", SqlDbType.Int),
         new SqlMetaData("Activity_Remarks", SqlDbType.VarChar,250),
         new SqlMetaData("Created_By", SqlDbType.VarChar,30),
         new SqlMetaData("MC_Activity_Id", SqlDbType.Int),
         new SqlMetaData("Campaign_Code", SqlDbType.VarChar,30),
         new SqlMetaData("Campaign_Type", SqlDbType.VarChar,15),
         new SqlMetaData("Current_Sales", SqlDbType.Int),
         new SqlMetaData("Expected_Sales", SqlDbType.Int),
         new SqlMetaData("NoofMonths", SqlDbType.Int),
          };

            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.Activity_Type);
                record.SetValue(1, item.Customer_Activity_ID);
                record.SetValue(2, item.Activity_Remarks);
                record.SetValue(3, item.Created_By);
                record.SetValue(4, item.MC_Activity_Id);
                record.SetValue(5, item.Campaign_Code);
                record.SetValue(6, item.Campaign_Type);
                record.SetValue(7, item.Current_Sales);
                record.SetValue(8, item.Expected_Sales);
                record.SetValue(9, item.NoofMonths);
                yield return record;
            }

        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }
    public class AttendanceCMEEnumurator : IEnumerable<SqlDataRecord>
    {

        public AttendanceCMEEnumurator(IEnumerable<CMETracking> data)
        {
            _data = data;
        }
        private IEnumerable<CMETracking> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("Customer_Code", SqlDbType.VarChar, 30),
             new SqlMetaData("Campaign_Code", SqlDbType.Int),
         new SqlMetaData("Product_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("Current_Sales", SqlDbType.Int),
         new SqlMetaData("Expected_Sales", SqlDbType.Int),
           new SqlMetaData("No_Of_Months", SqlDbType.Int),

          };

            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.Customer_Code);
                record.SetValue(1, Convert.ToInt32(item.Campaign_Code));
                record.SetValue(2, item.Product_Code);
                record.SetValue(3, item.Current_Sales);
                record.SetValue(4, item.Expected_Sales);
                record.SetValue(5, item.No_Of_Month);
                yield return record;
            }

        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }


}
