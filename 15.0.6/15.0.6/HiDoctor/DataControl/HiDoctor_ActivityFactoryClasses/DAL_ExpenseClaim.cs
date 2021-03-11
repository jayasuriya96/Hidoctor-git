using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Dapper;
using System.Data.SqlClient;
using Microsoft.SqlServer.Server;
using System.Reflection;

namespace DataControl
{
    public class DAL_ExpenseClaim : DapperRepository
    {
        #region Private Variables
        SPData _objSPData = new SPData();
        private Data _objData = new Data();
        private CurrentInfo _objCurInfo = new CurrentInfo();
        #endregion Private Variables

        #region Const Strings
        const string SP_hdGetRequestsMappedForUserType = "SP_hdGetRequestsMappedForUserType";
        const string SP_hdGetExpenseClaimHeaderDetails = "SP_hdGetExpenseClaimHeaderDetails";
        const string SP_hdGetFieldExpenseClaimDetails = "SP_hdGetFieldExpenseClaimDetails";
        const string SP_hdGetDoctorCRMClaimDetails = "SP_hdGetDoctorCRMClaimDetails";
        const string SP_HDGETCLAIMREQUESTBYUSER = "SP_hdGetClaimRequestByUser";
        const string SP_HDGETACTIVESTATUSCYCLE = "SP_hdGetActiveStatusCycle";
        const string SP_hdGetDCRExpenseDetails = "SP_hdGetDCRExpenseDetails";
        const string SP_hdGetExpenseClaimSummary = "SP_hdGetExpenseClaimSummary";
        const string SP_HDGETSTOCKIESTFORCRM = "SP_hdGetStockiestForCRM";
        const string SP_HDGETCRMPRODUCT = "SP_hdGetCRMProduct";
        const string SP_HDGETDCRSFCDETAILS = "SP_hdGetDCRSFCDetails";
        const string SP_HDGETEXPESECLAIMHISTORYDETAIL = "SP_HdGetExpeseClaimHistoryDetail";
        const string SP_HDGETEXPESECLAIMHISTORYDETAILEXPENSETYPEWISE = "SP_HdGetExpeseClaimHistoryDetailExpenseTypeWise";
        const string SP_HDGETUSERTYPEEXPENSECLAIMREQUEST = "Sp_HdGetUserTypeExpenseclaimRequest";
        const string SP_HDGETREQUESTCREDITLIMIT = "Sp_HdGetRequestCreditLimit";
        const string SP_HDGETREQUESTTYPE = "Sp_HdGetRequesttype";
        const string TBL_SFA_EXPENSE_CLAIM_STOCKIEST_DETAILS_STAGING = "tbl_SFA_Expense_Claim_Stockiest_Details_Staging";
        const string SP_HDINSERTCRMEXPENSEREQUEST = "SP_hdInsertCRMExpenseRequest";
        const string SP_HDGETCRMREQUEST = "SP_hdGetCRMRequest";
        const string SP_HDGETCRMEDITREQUEST = "SP_hdGetCRMEditRequest";
        const string SP_HDGETCRMAPPROVEDCUSTOMERS = "SP_hdGetCRMApprovedCustomers";
        const string SP_HDGETCRMAPPROVALSTOCKIESTS = "SP_HDGetCRMApprovalStockiests";
        const string SP_HDGETCRMPRODUCTSALES = "SP_HDGetCRMProductSales";
        const string SP_HDGETCRMYEILDANDPOTENTIAL = "SP_HDGetCRMYeildandPotential";
        const string SP_HDGETEXPENSECLAIMCYCLESTATUS = "SP_HDGetExpenseClaimCycleStatus";
        const string SP_HDGETEXPENSECLAIMPRINT = "SP_hdGetExpenseClaimPrint";
        const string SP_HDGETEXPENSECLAIMREQUEST_CUSTCOUNT = "SP_hdGetExpenseClaimRequest_CustCount";
        const string SP_GETSTATUSCYCLE = "SP_GetStatusCycle";
        const string SP_HDGETCRMPAYMENTDETAILS = "SP_HDGetCRMPaymentDetails";
        const string SP_HD_GetAddlExpenseClaimDetails = "SP_HD_GetAddlExpenseClaimDetails";
        //Delete Claim Header
        const string SP_HD_DELETECLAIMHEADER = "SP_Hd_DeleteClaimHeader";

        //Expense Claim Month wise
        const string SP_HD_GETPRIVILEGEVALUEFOREXPENSECLAIM = "SP_Hd_GetPRivilegeValueforExpenseclaim";
        const string SP_HD_GETDCREXPENSEDETAILSFORMONTHWISE = "Sp_Hd_GetDCRExpenseDetailsformonthwise";
        const string SP_HD_GETEXPENSECLAIMFORMONTH = "Sp_Hd_GetExpenseclaimformonth";
        const string SP_HD_GETEXPENSECLAIMSTATUSFORMONTH = "Sp_Hd_GetExpenseclaimStatusforMonth";
        const string SP_HD_GETEXPENSEAPPROVEDETAILSFORMONTH = "Sp_Hd_GetExpenseApprovedetailsforMonth";
        const string Sp_hd_GETTPDETAILSBYDCRDATE = "Sp_hd_getTpDetailsByDcrdate";
        const string USP_HD_GETCALENDERHOLIDAYDETAILSFOREXPENSECLAIMMONTH = "usp_hd_GetCalenderHolidayDetailsForExpenseClaimMonth";
        const string USP_HD_GETWEEKENDOFFFOREXPENSECALIMMONTH = "usp_hd_GetWeekendOffForExpenseCalimMonth";
        const string USP_HD_GETDCRLOCKLEAVEDETAILSFOREXPENSECLAIM = "usp_hd_GetDCRLockLeaveDetailsForExpenseClaim";
        const string USP_HD_GETDCRACTIVITYDETAILSFOREXPENSECLAIM = "usp_hd_GetDCRActivityDetailsforExpenseClaim";
        const string Sp_HD_InsertingUploadImage = "Sp_HD_InsertingUploadImage";
        const string Sp_hd_GetDetailsOfUploadImage = "Sp_hd_GetDetailsOfUploadImage";
        const string SP_HD_GetConfigValueForSize = "SP_HD_GetConfigValueForSize";
        const string SP_hdGetExpenseClaimSummary_Search = "SP_hdGetExpenseClaimSummary_Search";
        const string SP_HD_GETDCRADDLEXPENSEDETAILSFORMONTHWISE = "Sp_Hd_GetDCRAddlExpenseDetailsformonthwise";
        const string SP_HD_GETDCRADDLEXPENSEDETAILS = "SP_HD_GETDCRADDLEXPENSEDETAILS";
        const string USP_HD_INSERTADDLEXPENSE = "USP_HD_InsertAddlExpense";
        const string USP_HD_ValidateDcrExpense = "USP_HD_ValidateDcrExpense";
        const string USP_HD_ValidateADDLEXPENSE = "USP_HD_ValidateADDLEXPENSE";
        const string SP_HD_GETUNAPPROVEADDLEXPFORMONTHWISE = "SP_HD_GETUNAPPROVEADDLEXPFORMONTHWISE";
        const string Sp_HD_GetDistanceTravelled = "Sp_HD_GetDistanceTravelled";
        const string Sp_hd_GetExpenseDCRDetails = "Sp_hd_GetExpenseDCRDetails";

        #endregion Const Strings

        #region Private Methods
        public void AddParamToSqlCommand(SqlCommand cmd, string paramName, ParameterDirection paramDirection, SqlDbType dbType, int size, object paramValue)
        {
            try
            {
                SqlParameter parameter = new SqlParameter();
                parameter.ParameterName = paramName;
                parameter.Direction = paramDirection;
                parameter.SqlDbType = dbType;
                parameter.Value = paramValue;
                parameter.Size = size;
                cmd.Parameters.Add(parameter);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion
        public string ExpenseClaimFormLoadValuesSel(string FavUserCode)
        {
            string User_Type_Code = string.Empty;
            using (IDbConnection connection = IDbOpenConnection())
            {
                string query = "SELECT User_Type_Code FROM tbl_sfa_user_master WITH(NOLOCK) "
                               + " WHERE User_Code = @FavUserCode";
                User_Type_Code = connection.Query<string>(query, new { FavUserCode = FavUserCode }).Single();
                connection.Close();
            }
            return User_Type_Code;
        }
        public IEnumerable<MVCModels.RequestModel> GetRequestsMappedForUserType(string companyCode, string userTypeCode)
        {
            IEnumerable<MVCModels.RequestModel> lstReq;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstReq = connection.Query<MVCModels.RequestModel>(SP_hdGetRequestsMappedForUserType,
                                  new { CompanyCode = companyCode, UserTypeCode = userTypeCode },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstReq;
        }

        public List<MVCModels.ExpenseClaimModel> GetExpenseClaimDetails(string companyCode, string claimCode)
        {
            List<MVCModels.ExpenseClaimModel> lst = new List<MVCModels.ExpenseClaimModel>();
            //   IDbConnection connection = null;
            try
            {
                List<MVCModels.HiDoctor_Master.UserModel> lstUser = null;
                List<MVCModels.ExpenseClaimHeaderModel> lstExpClaim = null;
                List<MVCModels.ExpenseClaimRemarks> lstExpRemarks = null;
                List<MVCModels.ExpenseClaimHeaderModel> lstExpclaimHistory = null;
                List<MVCModels.ClaimExpenseTypeDetail> lstExpenseTypewiseDetail = null;


                using (IDbConnection connection = IDbOpenConnection())
                {
                    using (var multi = connection.QueryMultiple(SP_hdGetExpenseClaimHeaderDetails,
                                  new { CompanyCode = companyCode, ClaimCode = claimCode },
                                  commandType: CommandType.StoredProcedure))
                    {
                        lstUser = multi.Read<MVCModels.HiDoctor_Master.UserModel>().ToList();
                        lstExpClaim = multi.Read<MVCModels.ExpenseClaimHeaderModel>().ToList();
                        lstExpRemarks = multi.Read<MVCModels.ExpenseClaimRemarks>().ToList();
                        lstExpclaimHistory = multi.Read<MVCModels.ExpenseClaimHeaderModel>().ToList();
                        lstExpenseTypewiseDetail = multi.Read<MVCModels.ClaimExpenseTypeDetail>().ToList();
                    }
                }

                MVCModels.ExpenseClaimModel objExp = new MVCModels.ExpenseClaimModel();
                objExp.lstUser = lstUser;
                objExp.lstClaimHeader = lstExpClaim;
                objExp.lstClaimRemarks = lstExpRemarks;
                objExp.lstClaimHeaderHistory = lstExpclaimHistory;
                objExp.lstExpenseTypewiseDetail = lstExpenseTypewiseDetail;
                lst.Add(objExp);

            }
            catch (Exception)
            {
                throw;
            }
            //finally
            //{
            //    if (connection.State == ConnectionState.Open)
            //    {
            //        connection.Close();
            //        connection.Dispose();
            //    }
            //}
            return lst;
        }

        public IEnumerable<MVCModels.ExpenseClaimDetailsModel> GetFieldExpenseClaimDetails(string companyCode, string claimCode)
        {
            IEnumerable<MVCModels.ExpenseClaimDetailsModel> lstExp;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstExp = connection.Query<MVCModels.ExpenseClaimDetailsModel>(SP_hdGetFieldExpenseClaimDetails,
                                  new { CompanyCode = companyCode, ClaimCode = claimCode },
                                 commandTimeout: 0, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstExp;
        }


        public int GetclaimHistoryCount(string companyCode, string claimCode)
        {
            int rowcount = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Comapany_Code", companyCode);
                    p.Add("@Claim_Code", claimCode);

                    p.Add("@Result", 0, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>(SP_HDGETEXPESECLAIMHISTORYDETAIL, p, commandType: CommandType.StoredProcedure);
                    rowcount = p.Get<int>("@Result");
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rowcount;
        }


        // GetExpenseClaimHistoryCount

        public IEnumerable<MVCModels.ClaimExpenseTypeWiseHistory> GetExpenseClaimHistoryCount(string companyCode, string claimCode)
        {
            IEnumerable<MVCModels.ClaimExpenseTypeWiseHistory> lstExpHistory;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstExpHistory = connection.Query<MVCModels.ClaimExpenseTypeWiseHistory>(SP_HDGETEXPESECLAIMHISTORYDETAILEXPENSETYPEWISE,
                                  new { Comapany_Code = companyCode, Claim_Code = claimCode },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstExpHistory;
        }




        public IEnumerable<MVCModels.ExpenseClaimDetailsModel> GetDoctorCRMClaimDetails(string companyCode, string claimCode)
        {
            IEnumerable<MVCModels.ExpenseClaimDetailsModel> lstExp;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstExp = connection.Query<MVCModels.ExpenseClaimDetailsModel>(SP_hdGetDoctorCRMClaimDetails,
                                  new { CompanyCode = companyCode, ClaimCode = claimCode },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstExp;
        }

        #region expense claim approval
        /// <summary>
        /// Get Expense Claim request header details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="userTypeCode"></param>
        /// <returns>returns the ExpenseClaimHeaderModel list</returns>
        public IEnumerable<MVCModels.ExpenseClaimHeaderModel> GetClaimRequestByUser(string companyCode, string userCode, string userTypeCode, string searchKey)
        {
            IEnumerable<MVCModels.ExpenseClaimHeaderModel> lstClaim;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstClaim = connection.Query<MVCModels.ExpenseClaimHeaderModel>(SP_HDGETCLAIMREQUESTBYUSER,
                                  new { CompanyCode = companyCode, UserCode = userCode, UserTypeCode = userTypeCode, SearchKey = searchKey },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", userCode);
                dicObj.Add("userTypeCode", userTypeCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                throw ex;
            }

            return lstClaim;
        }
        /// <summary>
        /// Get the active status cycle mapping details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns>returns the StatusCycleMapping list </returns>
        public IEnumerable<MVCModels.StatusCycleMapping> GetActiveStatusCycle(string companyCode)
        {
            IEnumerable<MVCModels.StatusCycleMapping> lstStatusCycle;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstStatusCycle = connection.Query<MVCModels.StatusCycleMapping>(SP_HDGETACTIVESTATUSCYCLE,
                                  new { CompanyCode = companyCode },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: null);
                throw ex;
            }

            return lstStatusCycle;
        }

        /// <summary>
        /// Insert expense claim approval
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="claimCode"></param>
        /// <param name="updatedTime"></param>
        /// <param name="lstClaimDetail"></param>
        /// <param name="statusCode"></param>
        /// <param name="approvedAmount"></param>
        /// <param name="adminRemarks"></param>
        /// <param name="orderNo"></param>
        /// <returns></returns>
        public int InsertExpenseClaimApproval(string companyCode, string userCode, string claimCode, string updatedTime,
                    List<MVCModels.ExpenseClaimDetailsModel> lstClaimDetail, string statusCode, double approvedAmount, string adminRemarks, string orderNo,
            string OtherDeduction, string ExpType, int versionNumber, string payementMode, string payemntRemarks, string expensePrivilegevalue, double actualAmount)//,string favoringUserCode, string statusCycleMapping)
        {

            int rowsAffected = 0;
            DateTime minDate;
            DateTime maxDate;
            List<MVCModels.ExpenseClaimHeaderModel> lstClaim = new List<MVCModels.ExpenseClaimHeaderModel>();
            try
            {
                List<DateTime> dates = lstClaimDetail.Select(x => Convert.ToDateTime(String.Join("-", x.DCR_Actual_Date.Split('-').Reverse()))).ToList();

                if (dates.Count > 0)
                {
                    minDate = dates.Min();
                    maxDate = dates.Max();
                }
                else if (lstClaimDetail.Count > 0)
                {
                    minDate = Convert.ToDateTime(lstClaimDetail[0].DCR_Date);
                    maxDate = Convert.ToDateTime(lstClaimDetail[0].DCR_Date);
                }
                else
                {
                    minDate = DateTime.MinValue;
                    maxDate = DateTime.MaxValue;
                }
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();


                    #region Insert Claim Details history
                    const string insertDetailsHistory = "INSERT INTO tbl_SFA_Expense_Claim_Details_History (Company_Code,Claim_Code,Claim_Detail_Code, " +
                                               "Expense_Type_Code,Expense_Amount,Customer_Code,Present_Contribution ," +
                                               "Potential_Contribution,Bill_Number,Remarks_By_User,Record_Status,Ref_Key1,Ref_Key2, " +
                                               "DCR_Actual_Date,Updated_By,Updated_DateTime,Approved_Amount,Managers_Approval_Remark,Version_Number,DCR_Activity_Flag,Expense_Mode) " +
                                               "SELECT Company_Code,Claim_Code,Claim_Detail_Code,Expense_Type_Code,Expense_Amount,Customer_Code,Present_Contribution , " +
                                               "Potential_Contribution,Bill_Number,Remarks_By_User,Record_Status,Ref_Key1,Ref_Key2,DCR_Actual_Date,@UserCode ," +
                                               "@UpdatedTime,Approved_Amount,Managers_Approval_Remark,Version_Number,DCR_Activity_Flag,Expense_Mode FROM tbl_SFA_Expense_Claim_Details WITH(NOLOCK) WHERE Claim_Code=@ClaimCode ";

                    rowsAffected = connection.Execute(insertDetailsHistory, new
                    {
                        //CompanyCode = companyCode,
                        ClaimCode = claimCode,
                        UserCode = userCode,
                        UpdatedTime = updatedTime
                    }, transaction: trans);
                    #endregion Insert Claim Details history
                    #region Update expense claim header history
                    if (rowsAffected > 0)
                    {
                        rowsAffected = 0;
                        const string headerHistoryQry = "INSERT INTO tbl_SFA_Expense_Claim_Header_History (Company_Code,Claim_Code,User_Code, " +
                                            "Region_Code,Cylce_Code,Request_Code,Status_Code,Actual_Amount,Approved_Amount , " +
                                            "Date_From,Date_To,Entered_DateTime,Favouring_User_Code,Remarks_By_User,Remarks_By_Admin,Order_No, " +
                                            "Record_Status ,Ref_Key1,Ref_Key2,Updated_By,Updated_DateTime,Version_Number) " +
                                            "SELECT Company_Code,Claim_Code,User_Code,Region_Code,Cylce_Code,Request_Code,Status_Code,Actual_Amount, " +
                                            "Approved_Amount ,Date_From,Date_To,Entered_DateTime,Favouring_User_Code,Remarks_By_User,Remarks_By_Admin, " +
                                            "Order_No,Record_Status ,Ref_Key1,Ref_Key2,Updated_By,Updated_Date,Version_Number " +
                                            " FROM tbl_SFA_Expense_Claim_Header WITH(NOLOCK) WHERE Claim_Code=@Claim_Code  ";
                        rowsAffected = connection.Execute(headerHistoryQry, new
                        {
                            User_Code = userCode,
                            Updated_Date = updatedTime,
                            Claim_Code = claimCode
                            //Company_Code = companyCode
                        }, transaction: trans);
                    }
                    #endregion Update expense claim header history

                    if (rowsAffected > 0)
                    {
                        rowsAffected = 0;
                        #region Update Claim Details
                        string detailQuery = string.Empty;
                        if (ExpType != "FIELD_EXPENSE_REQUEST_FOR" && ExpType != "REQUEST_CUSTOMER_FOR")
                        {
                            detailQuery = "UPDATE tbl_SFA_Expense_Claim_Details SET Approved_Amount=@Approved_Amount , Bill_Number=@Bill_Number, " +
                                             "Managers_Approval_Remark=@Managers_Approval_Remark,Version_Number=@Version_Number  WHERE Claim_Code=@Claim_Detail_Code  AND Company_Code=@Company_Code";
                        }
                        else
                        {
                            detailQuery = "UPDATE tbl_SFA_Expense_Claim_Details SET Approved_Amount=@Approved_Amount , Bill_Number=@Bill_Number, " +
                                                "Managers_Approval_Remark=@Managers_Approval_Remark,Version_Number=@Version_Number  WHERE Claim_Detail_Code=@Claim_Detail_Code  AND Company_Code=@Company_Code";
                        }

                        rowsAffected = connection.Execute(detailQuery, lstClaimDetail, transaction: trans);
                        #endregion Update Claim Details

                        if (rowsAffected > 0)
                        {
                            rowsAffected = 0;
                            //Removed Code for Updating the Actual Amount,as Actual Amount should not Update during Claim Approval
                            #region update claim header
                            const string headerQry = "UPDATE tbl_SFA_Expense_Claim_Header SET Status_Code = @Status_Code,Approved_Amount = @Approved_Amount, " +
                                                   "Remarks_By_Admin = @Remarks_By_Admin,Order_No = @Order_No,Other_Deduction=@Other_Deduction, " +
                                                   "Updated_Date=@Updated_Date,Updated_By=@Updated_By,Version_Number=@Version_Number, " +
                                                   "Payment_Mode = @Payment_Mode, Payment_Remarks = @Payment_Remarks " +
                                                   "WHERE Company_Code = @Company_Code AND Claim_Code = @Claim_Code";
                            rowsAffected = connection.Execute(headerQry, new
                            {
                                Status_Code = statusCode,
                                Approved_Amount = approvedAmount,
                                Remarks_By_Admin = adminRemarks,
                                Order_No = orderNo,
                                Company_Code = companyCode,
                                Claim_Code = claimCode,
                                Other_Deduction = OtherDeduction,
                                Updated_Date = updatedTime,
                                Updated_By = userCode,
                                Version_Number = versionNumber,
                                Payment_Mode = payementMode,
                                Payment_Remarks = payemntRemarks,
                                //Date_From = minDate,
                                //Date_To = maxDate Date_From = @Date_From,
                                //Date_To = @Date_To
                            }, transaction: trans);
                            #endregion update claim header
                        }
                    }
                    trans.Commit();
                    lstClaim = GetExpenseclaimstatusforMonth(companyCode, claimCode).ToList();
                    IDbTransaction trans1 = connection.BeginTransaction();
                    if (expensePrivilegevalue.ToUpper() == "MONTHLY")
                    {
                        if (expensePrivilegevalue.ToUpper() == "MONTHLY" && ExpType == "FIELD_EXPENSE_REQUEST_FOR")
                        {
                            ExpType = "FIELD";
                        }
                        else if (ExpType == "REQUEST_CUSTOMER_FOR")
                        {
                            ExpType = "CRM";
                        }
                        if (lstClaim != null && lstClaim.Count > 0)
                        {
                            if (lstClaim[0].Move_Order != "")
                            {
                                lstClaim[0].Move_Order = lstClaim[0].Move_Order.TrimEnd(',');
                                if (lstClaim[0].Move_Order == "1") // if move order applied status
                                {
                                    #region Insert Claim Details history
                                    const string insertDetailsHistory1 = "INSERT INTO tbl_SFA_Expense_Claim_Details_History (Company_Code,Claim_Code,Claim_Detail_Code, " +
                                                               "Expense_Type_Code,Expense_Amount,Customer_Code,Present_Contribution ," +
                                                               "Potential_Contribution,Bill_Number,Remarks_By_User,Record_Status,Ref_Key1,Ref_Key2, " +
                                                               "DCR_Actual_Date,Updated_By,Updated_DateTime,Approved_Amount,Managers_Approval_Remark,Version_Number,DCR_Activity_Flag,Expense_Mode) " +
                                                               "SELECT Company_Code,Claim_Code,Claim_Detail_Code,Expense_Type_Code,Expense_Amount,Customer_Code,Present_Contribution , " +
                                                               "Potential_Contribution,Bill_Number,Remarks_By_User,Record_Status,Ref_Key1,Ref_Key2,DCR_Actual_Date,@UserCode ," +
                                                               "@UpdatedTime,Approved_Amount,Managers_Approval_Remark,Version_Number,DCR_Activity_Flag,Expense_Mode FROM tbl_SFA_Expense_Claim_Details WITH(NOLOCK) WHERE Claim_Code=@ClaimCode ";

                                    rowsAffected = connection.Execute(insertDetailsHistory1, new
                                    {
                                        //CompanyCode = companyCode,
                                        ClaimCode = claimCode,
                                        UserCode = userCode,
                                        UpdatedTime = updatedTime
                                    }, transaction: trans1);
                                    #endregion Insert Claim Details history
                                    #region Update expense claim header history
                                    if (rowsAffected > 0)
                                    {
                                        rowsAffected = 0;
                                        const string headerHistoryQry1 = "INSERT INTO tbl_SFA_Expense_Claim_Header_History (Company_Code,Claim_Code,User_Code, " +
                                                            "Region_Code,Cylce_Code,Request_Code,Status_Code,Actual_Amount,Approved_Amount , " +
                                                            "Date_From,Date_To,Entered_DateTime,Favouring_User_Code,Remarks_By_User,Remarks_By_Admin,Order_No, " +
                                                            "Record_Status ,Ref_Key1,Ref_Key2,Updated_By,Updated_DateTime,Version_Number) " +
                                                            "SELECT Company_Code,Claim_Code,User_Code,Region_Code,Cylce_Code,Request_Code,Status_Code,Actual_Amount, " +
                                                            "Approved_Amount ,Date_From,Date_To,Entered_DateTime,Favouring_User_Code,Remarks_By_User,Remarks_By_Admin, " +
                                                            "Order_No,Record_Status ,Ref_Key1,Ref_Key2,Updated_By,Updated_Date,Version_Number " +
                                                            " FROM tbl_SFA_Expense_Claim_Header WITH(NOLOCK) WHERE Claim_Code=@Claim_Code  ";
                                        rowsAffected = connection.Execute(headerHistoryQry1, new
                                        {
                                            User_Code = userCode,
                                            Updated_Date = updatedTime,
                                            Claim_Code = claimCode
                                            //Company_Code = companyCode
                                        }, transaction: trans1);
                                    }
                                    #endregion Update expense claim header history
                                    rowsAffected = 0;
                                    string deletequery = "DELETE FROM tbl_SFA_Expense_Claim_Details " +
                                                        " WHERE Claim_Code=@Claim_Code AND Expense_Mode='Automatic'";
                                    rowsAffected = connection.Execute(deletequery, new
                                    {
                                        //Company_Code = companyCode,
                                        Claim_Code = claimCode
                                    }, transaction: trans1);

                                    string UpdateExpquery = "UPDATE tbl_SFA_Expense_Claim_Details SET Record_Status='0' " +
                                                       " WHERE Claim_Code=@Claim_Code AND Expense_Mode='Manual'";
                                    rowsAffected = connection.Execute(UpdateExpquery, new
                                    {
                                        //Company_Code = companyCode,
                                        Claim_Code = claimCode
                                    }, transaction: trans1);

                                    string dcrUpdatenull = "UPDATE tbl_SFA_DCR_Expense_Details SET Expense_Claim_Code =	NULL"
                                                + " WHERE Expense_Claim_Code = @Claim_Code ";
                                    rowsAffected = connection.Execute(dcrUpdatenull, new
                                    {
                                        //Company_Code = companyCode,
                                        Claim_Code = claimCode
                                    }, transaction: trans1);
                                }
                            }



                        }
                        //if (modeType == "U" && lstClaimDetail.Count == 0)
                        //{

                        //}
                    }
                    else
                    {
                        if (lstClaim != null && lstClaim.Count > 0)
                        {
                            if (lstClaim[0].Move_Order == "1") // if move order applied status
                            {
                                #region Insert Claim Details history
                                const string insertDetailsHistory1 = "INSERT INTO tbl_SFA_Expense_Claim_Details_History (Company_Code,Claim_Code,Claim_Detail_Code, " +
                                                       "Expense_Type_Code,Expense_Amount,Customer_Code,Present_Contribution ," +
                                                       "Potential_Contribution,Bill_Number,Remarks_By_User,Record_Status,Ref_Key1,Ref_Key2, " +
                                                       "DCR_Actual_Date,Updated_By,Updated_DateTime,Approved_Amount,Managers_Approval_Remark,Version_Number,DCR_Activity_Flag,Expense_Mode) " +
                                                       "SELECT Company_Code,Claim_Code,Claim_Detail_Code,Expense_Type_Code,Expense_Amount,Customer_Code,Present_Contribution , " +
                                                       "Potential_Contribution,Bill_Number,Remarks_By_User,Record_Status,Ref_Key1,Ref_Key2,DCR_Actual_Date,@UserCode ," +
                                                       "@UpdatedTime,Approved_Amount,Managers_Approval_Remark,Version_Number,DCR_Activity_Flag,Expense_Mode FROM tbl_SFA_Expense_Claim_Details WITH(NOLOCK) WHERE Claim_Code=@ClaimCode ";

                                rowsAffected = connection.Execute(insertDetailsHistory1, new
                                {
                                    //CompanyCode = companyCode,
                                    ClaimCode = claimCode,
                                    UserCode = userCode,
                                    UpdatedTime = updatedTime
                                }, transaction: trans1);
                                #endregion Insert Claim Details history
                                #region Update expense claim header history
                                if (rowsAffected > 0)
                                {
                                    rowsAffected = 0;
                                    const string headerHistoryQry1 = "INSERT INTO tbl_SFA_Expense_Claim_Header_History (Company_Code,Claim_Code,User_Code, " +
                                                        "Region_Code,Cylce_Code,Request_Code,Status_Code,Actual_Amount,Approved_Amount , " +
                                                        "Date_From,Date_To,Entered_DateTime,Favouring_User_Code,Remarks_By_User,Remarks_By_Admin,Order_No, " +
                                                        "Record_Status ,Ref_Key1,Ref_Key2,Updated_By,Updated_DateTime,Version_Number) " +
                                                        "SELECT Company_Code,Claim_Code,User_Code,Region_Code,Cylce_Code,Request_Code,Status_Code,Actual_Amount, " +
                                                        "Approved_Amount ,Date_From,Date_To,Entered_DateTime,Favouring_User_Code,Remarks_By_User,Remarks_By_Admin, " +
                                                        "Order_No,Record_Status ,Ref_Key1,Ref_Key2,Updated_By,Updated_Date,Version_Number " +
                                                        " FROM tbl_SFA_Expense_Claim_Header WITH(NOLOCK) WHERE Claim_Code=@Claim_Code  ";
                                    rowsAffected = connection.Execute(headerHistoryQry1, new
                                    {
                                        User_Code = userCode,
                                        Updated_Date = updatedTime,
                                        Claim_Code = claimCode
                                        //Company_Code = companyCode
                                    }, transaction: trans1);
                                }
                                #endregion Update expense claim header history

                            }
                        }
                    }
                    trans1.Commit();

                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("statusCode", statusCode);
                dicContext.Add("adminRemarks", adminRemarks);
                dicContext.Add("claimCode", claimCode);
                dicContext.Add("orderNo", orderNo);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
            }
            finally
            {

            }
            return rowsAffected;
        }

        public DataSet GetDCRSFCDetails(string companyCode, string userCode, string dcrDate, string dcrFlag)
        {
            DataSet ds = new DataSet();
            _objSPData = new SPData();
            try
            {
                List<dynamic> lst1 = new List<dynamic>();
                List<dynamic> lst2 = new List<dynamic>();
                List<dynamic> lst3 = new List<dynamic>();
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@UserCode", userCode);
                    p.Add("@DCRDate", dcrDate);
                    p.Add("@DCRFlag", dcrFlag);
                    var read = conn.QueryMultiple("SP_hdGetDCRSFCDetailsForExpenseClaimReq", p, commandType: CommandType.StoredProcedure);
                    var json = Newtonsoft.Json.JsonConvert.SerializeObject(read.Read<dynamic>().ToList());
                    var json1 = Newtonsoft.Json.JsonConvert.SerializeObject(read.Read<dynamic>().ToList());
                    var json2 = Newtonsoft.Json.JsonConvert.SerializeObject(read.Read<dynamic>().ToList());

                    ds.Tables.Add((DataTable)Newtonsoft.Json.JsonConvert.DeserializeObject(json, (typeof(DataTable))));
                    ds.Tables.Add((DataTable)Newtonsoft.Json.JsonConvert.DeserializeObject(json1, (typeof(DataTable))));
                    ds.Tables.Add((DataTable)Newtonsoft.Json.JsonConvert.DeserializeObject(json2, (typeof(DataTable))));
                    conn.Close();
                }

                //SqlCommand command = new SqlCommand("SP_hdGetDCRSFCDetailsForExpenseClaimReq");
                //command.CommandType = CommandType.StoredProcedure;
                //_objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                //_objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                //_objSPData.AddParamToSqlCommand(command, "@DCRDate", ParameterDirection.Input, SqlDbType.VarChar, 30, dcrDate);
                //_objSPData.AddParamToSqlCommand(command, "@DCRFlag", ParameterDirection.Input, SqlDbType.VarChar, 1, dcrFlag);
                //_objData.OpenConnection();
                //ds = _objData.ExecuteDataSet(command);

            }
            catch (Exception ex)
            {
                throw ex;
            }
            //finally
            //{
            //    _objData.CloseConnection();
            //    // _objData = null;
            //    ds.Dispose();
            //}

            return ds;
        }
        #endregion expense claim approval

        public IEnumerable<MVCModels.DCRUserExpenseDetails> GetDCRExpenseDetails(string companyCode, string userCode, string dcrFrom, string dcrTo)
        {
            IEnumerable<MVCModels.DCRUserExpenseDetails> lstDCR;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstDCR = connection.Query<MVCModels.DCRUserExpenseDetails>(SP_hdGetDCRExpenseDetails,
                                  new { CompanyCode = companyCode, UserCode = userCode, DCRFromDate = dcrFrom, DCRToDate = dcrTo },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstDCR;
        }

        public IEnumerable<MVCModels.ExpenseClaimHeaderModel> GetDCRExpenseClaimSummary(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.ExpenseClaimHeaderModel> lstClaimSummary;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstClaimSummary = connection.Query<MVCModels.ExpenseClaimHeaderModel>(SP_hdGetExpenseClaimSummary,
                                  new { CompanyCode = companyCode, UserCode = userCode },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstClaimSummary;
        }

        public IEnumerable<MVCModels.StatusCycleMapping> GetStatusCycleMappingByOrderNumber(string companyCode, string cycleCode, int orderNumber)
        {
            IEnumerable<MVCModels.StatusCycleMapping> lstStatusCycle;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    string query = "SELECT Status_Code,Status_Owner_Type FROM tbl_SFA_Status_Cycle_Master WITH(NOLOCK) "
                                   + " WHERE Cycle_Code = @CycleCode AND Order_No = @OrderNumber AND Record_Status = '1' AND Company_Code = @CompanyCode";
                    lstStatusCycle = connection.Query<MVCModels.StatusCycleMapping>(query, new { CompanyCode = companyCode, CycleCode = cycleCode, OrderNumber = orderNumber });
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstStatusCycle;
        }

        public string GetUserTypeName(string userCode)
        {
            string UserType = string.Empty;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {

                    string query = "SELECT User_Type_Name from tbl_SFA_User_Master UM with(nolock) "
                                       + " INNER JOIN tbl_SFA_User_Type_Master UTM WITH(NOLOCK) ON UTM.User_Type_Code = UM.User_Type_Code"
                                       + " Where User_Code= @userCode and User_Status=1";
                    UserType = connection.Query<string>(query, new { userCode = userCode }).Single();
                    // connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return UserType;
        }


        public int InsertFieldExpenseClaim(string companyCode, string claimCode, string userCode, string regionCode, string cycleCode, string requestCode,
                                      string statusCode, double actualAmount, string dateFrom, string dateTo, string enteredDate, string favouringUser,
                                      string remarks, List<MVCModels.ExpenseClaimDetailNewModel> lstClaimDetail, string createdBy, string createdDate, string screenMode, IEnumerable<MVCModels.ExpenseClaimAddlDetailsModel> lstAddlExp)
        {
            int rowsAffected = 0;
            int ExpRowAffected = 0;
            string result = "";
            try
            {
                List<MVCModels.ExpenseClaimAddlDetailsModel> lstAddlExpenses = lstAddlExp.ToList();
                lstAddlExpenses.ForEach(c => { c.DCR_Date = c.DCR_Date.Split('/')[2] + "-" + c.DCR_Date.Split('/')[1] + "-" + c.DCR_Date.Split('/')[0]; });
                if (lstClaimDetail != null && lstClaimDetail.Count > 0)
                {
                    using (IDbConnection conn = IDbOpenConnection())
                    {
                        var p = new DynamicParameters();
                        p.Add("@CompanyCode", companyCode);
                        //p.Add("@ClaimCode", claimCode);
                        p.Add("@UserCode", userCode);
                        p.Add("@RegionCode", regionCode);
                        p.Add("@CycleCode", cycleCode);
                        p.Add("@RequestCode", requestCode);
                        p.Add("@StatusCode", statusCode);
                        p.Add("@Favouring_User_Code ", favouringUser);
                        //p.Add("@AcutalAmount", actualAmount);
                        p.Add("@RemarksByUser", remarks);
                        p.Add("@CreatedBy", createdBy);
                        p.Add("@VersionNo", "1");
                        p.Add("@ExpenseClaimScreenMode", screenMode);
                        p.Add("@TVP_HD_EC_InsertDCRExpenseDetails", ToDataTable(lstClaimDetail).AsTableValuedParameter());
                        p.Add("@TVP_HD_EC_InsertAddlExpenseDetails", ToDataTable(lstAddlExpenses).AsTableValuedParameter());
                        //p.Add("@ModeOfInsert", "Insert");
                        p.Add("@Result", "", dbType: DbType.String, direction: ParameterDirection.Output);
                        conn.Execute("SP_HD_EC_InsertExpenseClaim", p, commandType: CommandType.StoredProcedure);
                        result = p.Get<string>("@Result");
                        conn.Close();
                        if (!(result.Contains("INFO")))
                        {
                            if (Convert.ToInt32(result.Split('~')[0]) > 0)
                            {
                                rowsAffected = Convert.ToInt32(result.Split('~')[1]);
                            }
                        }
                        else
                        {
                            rowsAffected = 0;
                        }
                    }
                }
                else
                {
                    rowsAffected = -1;
                }

            }
            catch (Exception ex)
            {
                throw;
            }
            return rowsAffected;
        }

        public int InsertDoctorCRMClaim(string companyCode, string claimCode, string userCode, string regionCode, string cycleCode, string requestCode,
                                      string statusCode, double actualAmount, string enteredDate, string favouringUser,
                                      string remarks, List<MVCModels.ExpenseClaimDetailsModel> lstClaimDetail, string createdBy, string createdDate)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();

                    #region Insert Header
                    string query = "INSERT INTO tbl_SFA_Expense_Claim_Header" +
                                   "(Company_Code,Claim_Code,User_Code,Region_Code,Cylce_Code,Request_Code,Status_Code" +
                                   ",Actual_Amount,Entered_DateTime,Favouring_User_Code,Remarks_By_User" +
                                   ",Record_Status,Order_No,Created_By,Created_Date,Version_Number) " +
                                   "VALUES (@Company_Code,@Claim_Code,@User_Code,@Region_Code,@Cylce_Code,@Request_Code,@Status_Code" +
                                   ",@Actual_Amount,@Entered_DateTime,@Favouring_User_Code,@Remarks_By_User" +
                                   ",'1','1',@Created_By,@Created_Date,@Version_Number)";
                    rowsAffected = connection.Execute(query, new
                    {
                        Company_Code = companyCode,
                        Claim_Code = claimCode,
                        User_Code = userCode,
                        Region_Code = regionCode,
                        Cylce_Code = cycleCode,
                        Request_Code = requestCode,
                        Status_Code = statusCode,
                        Actual_Amount = actualAmount,
                        Entered_DateTime = enteredDate,
                        Favouring_User_Code = favouringUser,
                        Remarks_By_User = remarks,
                        Created_By = createdBy,
                        Created_Date = createdDate,
                        Version_Number = 1
                    }, transaction: trans);
                    #endregion Insert Header

                    if (rowsAffected > 0 && lstClaimDetail.Count > 0)
                    {
                        rowsAffected = 0;
                        #region Insert Detail
                        string detailQuery = "INSERT INTO tbl_SFA_Expense_Claim_Details" +
                                            "(Company_Code,Claim_Code,Claim_Detail_Code" +
                                            ",Customer_Code,Doctor_Region_Code,Expense_Amount" +
                                            ",Present_Contribution,Potential_Contribution,Remarks_By_User,Bill_Number,Record_Status,Version_Number)" +
                                            " VALUES (@Company_Code,@Claim_Code,NEXT VALUE FOR SEQ_tbl_SFA_Expense_Claim_Details" +
                                            ",@Customer_Code,@Doctor_Region_Code,@Expense_Amount" +
                                            ",@Present_Contribution,@Potential_Contribution,@Remarks_By_User,@Bill_Number,'1',@Version_Number)";

                        rowsAffected = connection.Execute(detailQuery, lstClaimDetail, transaction: trans);
                        #endregion Insert Detail

                    }
                    trans.Commit();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return rowsAffected;
        }

        public int InsertOtherClaim(string companyCode, string claimCode, string userCode, string regionCode, string cycleCode, string requestCode,
                                      string statusCode, double actualAmount, string enteredDate, string favouringUser,
                                      string remarks, string createdBy, string createdDate)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();

                    #region Insert Header
                    string query = "INSERT INTO tbl_SFA_Expense_Claim_Header" +
                                   "(Company_Code,Claim_Code,User_Code,Region_Code,Cylce_Code,Request_Code,Status_Code" +
                                   ",Actual_Amount,Entered_DateTime,Favouring_User_Code,Remarks_By_User" +
                                   ",Record_Status,Order_No,Created_By,Created_Date,Version_Number) " +
                                   "VALUES (@Company_Code,@Claim_Code,@User_Code,@Region_Code,@Cylce_Code,@Request_Code,@Status_Code" +
                                   ",@Actual_Amount,@Entered_DateTime,@Favouring_User_Code,@Remarks_By_User" +
                                   ",'1','1',@Created_By,@Created_Date,@Version_Number)";
                    rowsAffected = connection.Execute(query, new
                    {
                        Company_Code = companyCode,
                        Claim_Code = claimCode,
                        User_Code = userCode,
                        Region_Code = regionCode,
                        Cylce_Code = cycleCode,
                        Request_Code = requestCode,
                        Status_Code = statusCode,
                        Actual_Amount = actualAmount,
                        Entered_DateTime = enteredDate,
                        Favouring_User_Code = favouringUser,
                        Remarks_By_User = remarks,
                        Created_By = createdBy,
                        Created_Date = createdDate,
                        Version_Number = 1
                    }, transaction: trans);
                    #endregion Insert Header

                    if (rowsAffected > 0)
                    {
                        rowsAffected = 0;
                        #region Insert Detail
                        string detailQuery = "INSERT INTO tbl_SFA_Expense_Claim_Details" +
                                            "(Company_Code,Claim_Code,Claim_Detail_Code" +
                                            ",Expense_Amount,Remarks_By_User,Record_Status,Version_Number)" +
                                            " VALUES (@Company_Code,@Claim_Code,NEXT VALUE FOR SEQ_tbl_SFA_Expense_Claim_Details" +
                                            ",@Expense_Amount,@Remarks_By_User,'1',@Version_Number)";

                        rowsAffected = connection.Execute(detailQuery, new
                        {
                            Company_Code = companyCode,
                            Claim_Code = claimCode,
                            Expense_Amount = actualAmount,
                            Remarks_By_User = remarks,
                            Created_By = createdBy,
                            Created_Date = createdDate,
                            Version_Number = 1
                        }, transaction: trans);
                        #endregion Insert Detail
                    }
                    trans.Commit();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return rowsAffected;
        }


        public int UpdateExpenseClaim(string companyCode, string claimCode, string userCode, string regionCode, string statusCode, double actualAmount
                                    , double approvedAmount, double otherDeductions, string enteredDate, string remarks
                                    , List<MVCModels.ExpenseClaimDetailsModel> lstClaimDetail, string updatedBy, string updatedDate, string expenseType, int versionNumber, string modeType)
        {
            int rowsAffected = 0;
            DateTime minDate;
            DateTime maxDate;

            using (IDbConnection connection = IDbOpenConnection())
            {
                IDbTransaction trans = connection.BeginTransaction();
                try
                {
                    List<DateTime> dates = lstClaimDetail.Select(x => Convert.ToDateTime(x.DCR_Actual_Date)).ToList();

                    if (dates.Count > 0)
                    {
                        minDate = dates.Min();
                        maxDate = dates.Max();
                    }
                    else if (lstClaimDetail.Count > 0)
                    {
                        minDate = Convert.ToDateTime(lstClaimDetail[0].DCR_Date);
                        maxDate = Convert.ToDateTime(lstClaimDetail[0].DCR_Date);
                    }
                    else
                    {
                        minDate = DateTime.MinValue;
                        maxDate = DateTime.MaxValue;
                    }


                    #region Insert History
                    string historyquery = "INSERT INTO tbl_SFA_Expense_Claim_Header_History" +
                                   "(Company_Code,Claim_Code,User_Code,Region_Code,Cylce_Code,Request_Code,Status_Code,Actual_Amount" +
                                   ",Approved_Amount,Date_From,Date_To,Entered_DateTime,Favouring_User_Code,Remarks_By_User,Remarks_By_Admin" +
                                   ",Record_Status,Order_No,Ref_Key1,Ref_Key2,Created_By,Created_Date,Updated_By,Updated_DateTime,Other_Deduction,Version_Number)" +
                                   "SELECT " +
                                   " Company_Code,Claim_Code,User_Code,Region_Code,Cylce_Code,Request_Code,Status_Code,Actual_Amount" +
                                   ",Approved_Amount,Date_From,Date_To,Entered_DateTime,Favouring_User_Code,Remarks_By_User,Remarks_By_Admin" +
                                   ",Record_Status,Order_No,Ref_Key1,Ref_Key2,Created_By,Created_Date,Updated_By,Updated_Date,Other_Deduction,Version_Number" +
                                   " FROM tbl_SFA_Expense_Claim_Header WITH(NOLOCK) " +
                                   " WHERE Claim_Code=@Claim_Code";
                    rowsAffected = connection.Execute(historyquery, new
                    {
                        //Company_Code = companyCode,
                        Claim_Code = claimCode
                    }, transaction: trans);
                    #endregion Insert History

                    #region Update Header
                    if (rowsAffected > 0 && modeType == "S")
                    {
                        rowsAffected = 0;
                        string query = "UPDATE tbl_SFA_Expense_Claim_Header SET"
                                        + " Actual_Amount= @Actual_Amount,Status_Code= @Status_Code"
                                        + ",Approved_Amount= @Approved_Amount,Other_Deduction= @Other_Deduction"
                                        + ",User_Code= @User_Code,Region_Code= @Region_Code,Entered_DateTime= @Entered_DateTime"
                                        + ",Remarks_By_User= @Remarks_By_User,Order_No= '1',Updated_By= @Updated_By,Updated_Date= @Updated_Date,Version_Number=@Version_Number"
                                        + ",Date_From = @Date_From,Date_To=@Date_To"
                                        + " WHERE Claim_Code=@Claim_Code";
                        //AND Company_Code=@Company_Code";

                        rowsAffected = connection.Execute(query, new
                        {
                            Company_Code = companyCode,
                            Claim_Code = claimCode,
                            Actual_Amount = actualAmount,
                            Status_Code = statusCode,
                            Approved_Amount = approvedAmount,
                            Other_Deduction = otherDeductions,
                            User_Code = userCode,
                            Region_Code = regionCode,
                            Entered_DateTime = enteredDate,
                            Remarks_By_User = remarks,
                            Updated_By = updatedBy,
                            Updated_Date = updatedDate,
                            Version_Number = versionNumber,
                            Date_From = minDate,
                            Date_To = maxDate,
                        }, transaction: trans);
                    }
                    else
                    {
                        rowsAffected = 0;
                        string query = "UPDATE tbl_SFA_Expense_Claim_Header SET"
                                        + " Actual_Amount= @Actual_Amount"
                                        + " ,Remarks_By_Admin=@Remarks_By_Admin"
                                        + ",Approved_Amount= @Approved_Amount,Other_Deduction= @Other_Deduction"
                                        + ",Updated_By= @Updated_By,Updated_Date= @Updated_Date"
                                        + ",Date_From = @Date_From,Date_To=@Date_To"
                                        + " WHERE Claim_Code=@Claim_Code";
                        //AND Company_Code=@Company_Code";

                        rowsAffected = connection.Execute(query, new
                        {
                            Company_Code = companyCode,
                            Claim_Code = claimCode,
                            Actual_Amount = actualAmount,
                            Approved_Amount = approvedAmount,
                            Other_Deduction = otherDeductions,
                            Updated_By = updatedBy,
                            Updated_Date = updatedDate,
                            Remarks_By_Admin = remarks,
                            Date_From = minDate,
                            Date_To = maxDate,

                        }, transaction: trans);
                    }
                    #endregion Update Header

                    #region insert detail history
                    if (rowsAffected > 0)
                    {
                        rowsAffected = 0;
                        string detailhistoryquery = "INSERT INTO tbl_SFA_Expense_Claim_Details_History"
                                                   + "(Company_Code,Claim_Code,Claim_Detail_Code,Expense_Type_Code,Expense_Amount,Customer_Code"
                                                   + ",Present_Contribution,Potential_Contribution,Bill_Number,Remarks_By_User,Record_Status,Ref_Key1,Ref_Key2"
                                                   + ",Updated_By,Updated_DateTime,DCR_Actual_Date,Approved_Amount,Managers_Approval_Remark,DCR_Activity_Flag"
                                                   + ",Doctor_Region_Code,Version_Number,Expense_Mode)"
                                                   + "SELECT "
                                                   + " Company_Code,Claim_Code,Claim_Detail_Code,Expense_Type_Code,Expense_Amount,Customer_Code"
                                                   + ",Present_Contribution,Potential_Contribution,Bill_Number,Remarks_By_User,Record_Status,Ref_Key1,Ref_Key2"
                                                   + ",@Updated_By,@Updated_DateTime,DCR_Actual_Date,Approved_Amount,Managers_Approval_Remark,DCR_Activity_Flag"
                                                   + ",Doctor_Region_Code,Version_Number,Expense_Mode"
                                                   + " FROM tbl_SFA_Expense_Claim_Details WITH(NOLOCK)"
                                                   + " WHERE Claim_Code=@Claim_Code";
                        rowsAffected = connection.Execute(detailhistoryquery, new
                        {
                            //Company_Code = companyCode,
                            Claim_Code = claimCode,
                            Updated_By = updatedBy,
                            Updated_DateTime = updatedDate
                        }, transaction: trans);
                    }
                    #endregion insert detail history

                    #region delete Detail
                    if (rowsAffected > 0)
                    {
                        rowsAffected = 0;
                        string deletequery = "DELETE FROM tbl_SFA_Expense_Claim_Details " +
                                            " WHERE Claim_Code=@Claim_Code AND Expense_Mode='Automatic'";
                        rowsAffected = connection.Execute(deletequery, new
                        {
                            //Company_Code = companyCode,
                            Claim_Code = claimCode
                        }, transaction: trans);

                        string UpdateExpquery = "UPDATE tbl_SFA_Expense_Claim_Details SET Record_Status='0' " +
                                           " WHERE Claim_Code=@Claim_Code AND Expense_Mode='Manual'";
                        rowsAffected = connection.Execute(UpdateExpquery, new
                        {
                            //Company_Code = companyCode,
                            Claim_Code = claimCode
                        }, transaction: trans);
                    }
                    #endregion delete DEtail
                    //re aply the claim when there is no claim in details
                    //if (rowsAffected > 0 )
                    //{
                    rowsAffected = 0;

                    //no details when editable
                    if (modeType == "U" && lstClaimDetail.Count == 0)
                    {
                        string dcrUpdatenull = "UPDATE tbl_SFA_DCR_Expense_Details SET Expense_Claim_Code =	NULL"
                                              + " WHERE Expense_Claim_Code = @Claim_Code ";
                        rowsAffected = connection.Execute(dcrUpdatenull, new
                        {
                            //Company_Code = companyCode,
                            Claim_Code = claimCode
                        }, transaction: trans);
                    }

                    if (lstClaimDetail != null && lstClaimDetail.Count() > 0)
                    {
                        rowsAffected = 0;
                    }



                    if (expenseType == "FIELD" && lstClaimDetail != null && lstClaimDetail.Count() > 0)
                    {
                        #region Insert Detail
                        List<MVCModels.ExpenseClaimDetailsModel> lstAutomaticExpense = new List<MVCModels.ExpenseClaimDetailsModel>();
                        lstAutomaticExpense = lstClaimDetail.Where(x => x.Expense_Mode == "Automatic").ToList();
                        string detailQuery = "INSERT INTO tbl_SFA_Expense_Claim_Details" +
                                             "(Company_Code,Claim_Code,Claim_Detail_Code,Expense_Type_Code" +
                                             ",Expense_Amount,Record_Status,DCR_Actual_Date,DCR_Activity_Flag,Bill_Number,Remarks_By_User,Approved_Amount,Version_Number,Expense_Mode)" +
                                             "VALUES" +
                                             "(@Company_Code,@Claim_Code,NEXT VALUE FOR SEQ_tbl_SFA_Expense_Claim_Details,@Expense_Type_Code" +
                                             ",@Expense_Amount,'1',@DCR_Actual_Date,@DCR_Activity_Flag,@Bill_Number,@Remarks_By_User,@Approved_Amount,@Version_Number,'Automatic')";

                        rowsAffected = connection.Execute(detailQuery, lstAutomaticExpense, transaction: trans);
                        #endregion Insert Detail

                        #region UpdateExpenseClaim null in expenseType Claim for old dcr records
                        //if (rowsAffected > 0)
                        //{
                        rowsAffected = 0;
                        string dcrUpdatenull = "UPDATE tbl_SFA_DCR_Expense_Details SET Expense_Claim_Code =	NULL"
                                          + " WHERE Expense_Claim_Code = @Claim_Code";
                        //AND Company_Code = @Company_Code";
                        rowsAffected = connection.Execute(dcrUpdatenull, new { Company_Code = companyCode, Claim_Code = claimCode }, transaction: trans);
                        //}
                        #endregion UpdateExpenseClaim null in expenseType Claim for old dcr records

                        #region Update expense claim code in dcr
                        //if (rowsAffected > 0)
                        //{
                        rowsAffected = 0;
                        string dcrUpdate = "UPDATE tbl_SFA_DCR_Expense_Details SET Expense_Claim_Code =	@Claim_Code"
                                          + " WHERE DCR_Expense_Code = @DCR_Expense_Code";
                        //AND Company_Code = @Company_Code";
                        rowsAffected = connection.Execute(dcrUpdate, lstClaimDetail, transaction: trans);
                        //}
                        #endregion Update expense claim code in dcr
                    }
                    else if (expenseType == "CRM" && lstClaimDetail != null && lstClaimDetail.Count() > 0)
                    {
                        #region Insert Detail
                        string detailQuery = "INSERT INTO tbl_SFA_Expense_Claim_Details" +
                                            "(Company_Code,Claim_Code,Claim_Detail_Code" +
                                            ",Customer_Code,Doctor_Region_Code,Expense_Amount" +
                                            ",Present_Contribution,Potential_Contribution,Remarks_By_User,Bill_Number,Record_Status,Approved_Amount,Version_Number)" +
                                            " VALUES (@Company_Code,@Claim_Code,NEXT VALUE FOR SEQ_tbl_SFA_Expense_Claim_Details" +
                                            ",@Customer_Code,@Doctor_Region_Code,@Expense_Amount" +
                                            ",@Present_Contribution,@Potential_Contribution,@Remarks_By_User,@Bill_Number,'1',@Approved_Amount,@Version_Number)";

                        rowsAffected = connection.Execute(detailQuery, lstClaimDetail, transaction: trans);
                        #endregion Insert Detail
                    }
                    else if (expenseType != "CRM" && expenseType != "FIELD")
                    {
                        #region Insert Detail
                        string detailQuery = "INSERT INTO tbl_SFA_Expense_Claim_Details" +
                                            "(Company_Code,Claim_Code,Claim_Detail_Code" +
                                            ",Expense_Amount,Remarks_By_User,Record_Status,Approved_Amount,Version_Number)" +
                                            " VALUES (@Company_Code,@Claim_Code,NEXT VALUE FOR SEQ_tbl_SFA_Expense_Claim_Details" +
                                            ",@Expense_Amount,@Remarks_By_User,'1',@Approved_Amount,@Version_Number)";

                        rowsAffected = connection.Execute(detailQuery, new
                        {
                            Company_Code = companyCode,
                            Claim_Code = claimCode,
                            Expense_Amount = actualAmount,
                            Remarks_By_User = remarks,
                            Created_By = updatedBy,
                            Created_Date = updatedDate,
                            Approved_Amount = approvedAmount,
                            Version_Number = versionNumber,
                        }, transaction: trans);
                        #endregion Insert Detail
                    }
                    // }
                    trans.Commit();
                }

                catch (Exception ex)
                {
                    trans.Rollback();
                    throw;
                }
            }
            return rowsAffected;
        }
        public int UpdateAddlExpenseClaim(string companyCode, string claimCode, string userCode, string regionCode, string statusCode, double actualAmount
                            , double approvedAmount, double otherDeductions, string enteredDate, string remarks
                            , List<MVCModels.ExpenseClaimDetailNewModel> lstClaimDetail, string updatedBy, string updatedDate, string expenseType, int versionNumber, string modeType, IEnumerable<MVCModels.ExpenseClaimAddlDetailsModel> lstAddlExp)
        {
            int rowsAffected = 0;
            DateTime minDate;
            DateTime maxDate;
            string result = "";
            try
            {
                List<MVCModels.ExpenseClaimAddlDetailsModel> lstAddExpenses = lstAddlExp.ToList();
                //if (lstClaimDetail != null && lstClaimDetail.Count > 0)
                //{
                    lstAddExpenses.ForEach(c => { c.DCR_Date = c.DCR_Date.Split('/')[2] + "-" + c.DCR_Date.Split('/')[1] + "-" + c.DCR_Date.Split('/')[0]; });
                    using (IDbConnection Conn = IDbOpenConnection())
                    {
                        var p = new DynamicParameters();
                        p.Add("@CompanyCode", companyCode);
                        p.Add("@ClaimCode", claimCode);
                        p.Add("@UserCode", userCode);
                        p.Add("@RegionCode", regionCode);
                        p.Add("@StatusCode", statusCode);
                        p.Add("@OtherDeductions", otherDeductions);
                        p.Add("@ApprovedAmount", approvedAmount);
                        p.Add("@ExpenseType", expenseType);
                        p.Add("@Remarks", remarks);
                        p.Add("@UpdatedBy", updatedBy);
                        p.Add("@Mode", modeType);
                        p.Add("@VersionNo", versionNumber);
                        p.Add("@TVP_HD_EC_InsertDCRExpenseDetails", ToDataTable(lstClaimDetail).AsTableValuedParameter());
                        p.Add("@TVP_HD_EC_InsertAddlExpenseDetails", ToDataTable(lstAddExpenses).AsTableValuedParameter());
                        p.Add("@Result", "", dbType: DbType.String, direction: ParameterDirection.Output);
                        Conn.Execute("SP_HD_EC_UpdateExpesenClaim", p, commandType: CommandType.StoredProcedure);
                        result = p.Get<string>("@Result");
                        Conn.Close();
                        if (!(result.Contains("INFO:")))
                        {
                            rowsAffected = Convert.ToInt32(result);
                        }
                        else
                        {
                            rowsAffected = 0;
                        }
                    }
                //}
                //else
                //{
                //    rowsAffected = -1;
                //}
            }
            catch (Exception ex)
            {

                throw;
            }


            return rowsAffected;
        }

        public int GetExpenseClaimMaxVersionNumber(string companyCode, string claimCode)
        {
            int maxnumber = 1;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    string selectQry = "SELECT IsNull(MAX(Version_Number),0) FROM tbl_SFA_Expense_Claim_Header WITH(NOLOCK) WHERE Claim_Code = @Claim_Code";

                    maxnumber = connection.Query<int>(selectQry, new { Claim_Code = claimCode }).Single();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return maxnumber;
        }

        public int GetvalidClaimRequest(string companyCode, string userCode, string requestCode)
        {
            {
                int rowcount = 0;
                try
                {
                    using (IDbConnection connection = IDbOpenConnection())
                    {
                        var p = new DynamicParameters();
                        p.Add("@CompanyCode", companyCode);
                        p.Add("@UserCode", userCode);
                        p.Add("@ClaimRequestCode", requestCode);
                        p.Add("@Result", 0, DbType.Int32, ParameterDirection.Output);
                        connection.Query<int>(SP_HDGETUSERTYPEEXPENSECLAIMREQUEST, p, commandType: CommandType.StoredProcedure);
                        rowcount = p.Get<int>("@Result");
                        connection.Close();
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                return rowcount;
            }


        }

        public string GetRequestLimit(string companyCode, string requestCode)
        {
            {
                string rowcount = string.Empty;
                try
                {
                    using (IDbConnection connection = IDbOpenConnection())
                    {
                        var p = new DynamicParameters();
                        p.Add("@CompanyCode", companyCode);
                        p.Add("@ClaimRequestCode", requestCode);
                        p.Add("@Result", string.Empty, DbType.String, ParameterDirection.Output);
                        connection.Query<string>(SP_HDGETREQUESTCREDITLIMIT, p, commandType: CommandType.StoredProcedure);
                        rowcount = p.Get<string>("@Result");
                        connection.Close();
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                return rowcount;
            }


        }

        public string GetExpenserequestType(string companyCode, string requestCode)
        {
            {
                string rowcount = string.Empty;
                try
                {
                    using (IDbConnection connection = IDbOpenConnection())
                    {
                        var p = new DynamicParameters();
                        p.Add("@CompanyCode", companyCode);
                        p.Add("@ClaimRequestCode", requestCode);
                        p.Add("@Result", string.Empty, DbType.String, ParameterDirection.Output);
                        connection.Query<string>(SP_HDGETREQUESTTYPE, p, commandType: CommandType.StoredProcedure);
                        rowcount = p.Get<string>("@Result");
                        connection.Close();
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                return rowcount;
            }


        }

        public IEnumerable<MVCModels.CRMStockiest> GetCRMStockiest(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.CRMStockiest> lstCRMStock;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstCRMStock = connection.Query<MVCModels.CRMStockiest>(SP_HDGETSTOCKIESTFORCRM,
                                  new { CompanyCode = companyCode, UserCode = userCode },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstCRMStock;
        }

        public IEnumerable<MVCModels.CRMProduct> GetCRMProduct(string Company_Code, string User_Code)
        {
            IEnumerable<MVCModels.CRMProduct> lstCRMProd;
            try
            {

                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstCRMProd = connection.Query<MVCModels.CRMProduct>(SP_HDGETCRMPRODUCT,
                                  new { Company_Code = Company_Code, User_Code = User_Code },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstCRMProd;
        }

        public IEnumerable<MVCModels.CRMCustomerDetails> GetCRMCustomerDetails(string companyCode, string BaseCode, string ClaimCode)
        {
            IEnumerable<MVCModels.CRMCustomerDetails> lstCRMCustomer;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstCRMCustomer = connection.Query<MVCModels.CRMCustomerDetails>(SP_HDGETCRMEDITREQUEST,
                        new { CompanyCode = companyCode, BaseCode = BaseCode, ClaimCode = ClaimCode },
                        commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstCRMCustomer;
        }

        public IEnumerable<MVCModels.CRMCustomerDetails> GetApprovedCRMCustomerDetails(string companyCode, string BaseCode)
        {
            IEnumerable<MVCModels.CRMCustomerDetails> lstCRMCustomer;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstCRMCustomer = connection.Query<MVCModels.CRMCustomerDetails>(SP_HDGETCRMAPPROVEDCUSTOMERS,
                        new { CompanyCode = companyCode, BaseCode = BaseCode },
                        commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstCRMCustomer;
        }


        // INSERT BULK USER 
        public string BulkUserInsert(string companyCode, DataTable dt)
        {
            string result = string.Empty;
            try
            {
                using (SqlConnection cn = _objData.GetConnectionObject(companyCode))
                {
                    cn.Open();
                    using (SqlBulkCopy copy = new SqlBulkCopy(cn))
                    {
                        copy.ColumnMappings.Add("Company_Code", "Company_Code");
                        copy.ColumnMappings.Add("Customer_Code", "Customer_Code");
                        copy.ColumnMappings.Add("Base_Code", "Base_Code");
                        copy.ColumnMappings.Add("Product_Code", "Product_Code");
                        copy.ColumnMappings.Add("Percentage", "Percentage");
                        copy.ColumnMappings.Add("GUID", "GUID");
                        copy.ColumnMappings.Add("Row_No", "Row_No");
                        copy.ColumnMappings.Add("Status", "Status");
                        copy.DestinationTableName = TBL_SFA_EXPENSE_CLAIM_STOCKIEST_DETAILS_STAGING;
                        copy.WriteToServer(dt);
                    }
                    cn.Close();
                }
                result = "SUCCESS";
            }
            catch (Exception ex)
            {
                result = String.Concat("FAILURE: ", ex.StackTrace.Substring(0, 499));
            }
            finally
            {
                _objData.CloseConnection();
            }
            return result;
        }

        //public string InsertBulkUserStagingToMaster(string companyCode, Guid guid, string uploadedBy)
        //{

        //    SPData _objSPData = new SPData();
        //    string result = "";
        //    try
        //    {
        //        SqlCommand command = new SqlCommand(SP_HDINSERTCRMEXPENSEREQUEST);
        //        command.CommandType = CommandType.StoredProcedure;
        //        command.CommandTimeout = 1000;
        //        _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
        //        _objSPData.AddParamToSqlCommand(command, "@GUID", ParameterDirection.Input, SqlDbType.NVarChar, 100, guid.ToString());
        //        _objSPData.AddParamToSqlCommand(command, "@UploadedBy", ParameterDirection.Input, SqlDbType.VarChar, 30, uploadedBy);
        //        SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
        //        returnValue.Direction = ParameterDirection.Output;
        //        returnValue.Size = 500;
        //        returnValue.Value = "";
        //        command.Parameters.Add(returnValue);
        //        _objData.OpenConnection(companyCode);
        //        _objData.ExecuteNonQuery(command);
        //        result = returnValue.Value.ToString();
        //    }
        //    catch
        //    {
        //        result = "FAILURE:";
        //    }
        //    finally
        //    {
        //        _objData.CloseConnection();
        //        result="Duplication of Doctor and Stockiest is not allowed";
        //    }
        //    return result;
        //}

        public int InsertCRMRequest(string companyCode, List<MVCModels.CRMCustomerDetails> crmDetails)
        {
            int result = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    for (int i = 0; i < crmDetails.Count; i++)
                    {
                        string query = " DELETE FROM tbl_sfa_expense_claim_stockiest_details WHERE Claim_Code=@Claim_Code";
                        result = connection.Execute(query, crmDetails[i]);
                    }
                    for (int i = 0; i < crmDetails.Count; i++)
                    {
                        if (crmDetails[i].Customer_Code != "" && crmDetails[i].Customer_Code != null)
                        {
                            string insertquery = "INSERT INTO tbl_sfa_expense_claim_stockiest_details(Company_Code,Customer_Code,Base_Code,Product_Code,Percentage,Updated_By,Updated_Date,Claim_Code)"
                            + "VALUES(@Company_Code,@Customer_Code,@Base_Code,@Product_Code,@Percentage,@Updated_By,@Updated_Date,@Claim_Code)";
                            result = connection.Execute(insertquery, crmDetails[i]);
                        }
                    }

                    return result;
                }
            }
            catch
            {
                throw;
            }

        }

        public int GetCRMRequest(string companyCode, string customerCode)
        {
            try
            {
                SPData _objSPData = new SPData();
                SqlCommand command = new SqlCommand(SP_HDGETCRMREQUEST);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@CustomerCode", ParameterDirection.Input, SqlDbType.VarChar, 30, customerCode);
                _objData.OpenConnection();
                string returnvalue = _objData.ExecuteScalar(command).ToString();
                _objData.CloseConnection();
                return Convert.ToInt32(returnvalue);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public IEnumerable<MVCModels.CRMCustomerDetails> GetExpenseClaimApprovedStockiest(string companyCode, string customerCode, string claimCode)
        {
            IEnumerable<MVCModels.CRMCustomerDetails> lstCRMCustomer;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstCRMCustomer = connection.Query<MVCModels.CRMCustomerDetails>(SP_HDGETCRMAPPROVALSTOCKIESTS,
                        new { CompanyCode = companyCode, CustomerCode = customerCode, ClaimCode = claimCode },
                        commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstCRMCustomer;
        }

        public IEnumerable<MVCModels.CRMExpenseApproavedProducts> GetExpenseClaimApprovedProducts(string companyCode, string claimCode)
        {
            IEnumerable<MVCModels.CRMExpenseApproavedProducts> lstCRMProduct;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstCRMProduct = connection.Query<MVCModels.CRMExpenseApproavedProducts>(SP_HDGETCRMPRODUCTSALES,
                        new { CompanyCode = companyCode, ClaimCode = claimCode },
                        commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstCRMProduct;
        }

        public IEnumerable<MVCModels.CRMYeildPotential> GetExpenseClaimYeildPotential(string companyCode, string customerCode)
        {
            IEnumerable<MVCModels.CRMYeildPotential> lstCRMProduct;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstCRMProduct = connection.Query<MVCModels.CRMYeildPotential>(SP_HDGETCRMYEILDANDPOTENTIAL,
                        new { CompanyCode = companyCode, CustomerCode = customerCode },
                        commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstCRMProduct;
        }

        public IEnumerable<MVCModels.CRMCycleMapping> GetCRMCycleMapping(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.CRMCycleMapping> lstCRMCycle;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstCRMCycle = connection.Query<MVCModels.CRMCycleMapping>(SP_HDGETEXPENSECLAIMCYCLESTATUS,
                        new { CompanyCode = companyCode, UserCode = userCode },
                        commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstCRMCycle;
        }


        public List<MVCModels.CRMPaymentDetails> GetCRMPaymentDetails(string companyCode, string claimCode)
        {
            List<MVCModels.CRMPaymentDetails> lstCRMPayment = new List<MVCModels.CRMPaymentDetails>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var param = new DynamicParameters();
                    param.Add("@CompanyCode", companyCode);
                    param.Add("@ClaimCode", claimCode);
                    lstCRMPayment = connection.Query<MVCModels.CRMPaymentDetails>(SP_HDGETCRMPAYMENTDETAILS, param, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstCRMPayment;
        }

        public DataSet GetExpenseClaimForPrint(string companyCode, string userCode, string fromDate, string toDate, string claimCode)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETEXPENSECLAIMPRINT);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objSPData.AddParamToSqlCommand(command, "@FromDate", ParameterDirection.Input, SqlDbType.VarChar, 10, fromDate);
                _objSPData.AddParamToSqlCommand(command, "@ToDate", ParameterDirection.Input, SqlDbType.VarChar, 10, toDate);
                _objSPData.AddParamToSqlCommand(command, "@ClaimCode", ParameterDirection.Input, SqlDbType.VarChar, 30, claimCode);

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

        public DataSet GetExpenseClaimCustomerCount(string companyCode, string userCode, string fromDate, string toDate, string option)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlCommand command = new SqlCommand(SP_HDGETEXPENSECLAIMREQUEST_CUSTCOUNT);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objSPData.AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 10, fromDate);
                _objSPData.AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 10, toDate);
                _objSPData.AddParamToSqlCommand(command, "@Option", ParameterDirection.Input, SqlDbType.Char, 5, option);

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



        public int GetStatusCycleCount(string companyCode, string cycleCode, string moveOrder)
        {
            int rowcount = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@Company_Code", companyCode);
                    parameter.Add("@Move_Order", moveOrder);
                    parameter.Add("@Cycle_Code", cycleCode);
                    parameter.Add("@Result", 0, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>(SP_GETSTATUSCYCLE, parameter, commandType: CommandType.StoredProcedure);
                    rowcount = parameter.Get<int>("@Result");
                    connection.Close();
                    return rowcount;
                }
            }
            catch
            {
                throw;
            }
        }





        #region - Delete Expense Claim header
        /// <summary>
        /// Delete claim header when there is no details found
        /// </summary>
        /// <param name="claimCode"></param>
        /// <param name="requestCode"></param>
        /// <param name="userCode"></param>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public int DeleteClaimHeader(string claimCode, string requestCode, string userCode, string companyCode)
        {
            int rowsAffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@ClaimCode", claimCode);
                    parameter.Add("@RequestCode", requestCode);
                    parameter.Add("@userCode", userCode);
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@Result", 0, DbType.Int32, ParameterDirection.Output);

                    connection.Query<int>(SP_HD_DELETECLAIMHEADER, parameter, commandType: CommandType.StoredProcedure);
                    rowsAffected = parameter.Get<int>("@Result");
                }

            }
            catch
            {
                throw;
            }
            return rowsAffected;
        }
        #endregion - Delete Expense Claim header

        #region - Expense claim MOnth wise
        public List<MVCModels.HiDoctor_Master.PrivilegeMasterModel> GetExpenseMonthPrivilege(string companyCode, string userCode)
        {
            List<MVCModels.HiDoctor_Master.PrivilegeMasterModel> lstPrivilegevalues = new List<MVCModels.HiDoctor_Master.PrivilegeMasterModel>();
            using (IDbConnection connection = IDbOpenConnection())
            {
                var param = new DynamicParameters();
                param.Add("@Company_Code", companyCode);
                param.Add("@User_Code", userCode);
                lstPrivilegevalues = connection.Query<MVCModels.HiDoctor_Master.PrivilegeMasterModel>(SP_HD_GETPRIVILEGEVALUEFOREXPENSECLAIM, param, commandType: CommandType.StoredProcedure).ToList();
                return lstPrivilegevalues;
            }
        }
        /// <summary>
        /// showing dcr expense details for monthwise
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <returns></returns>
        public List<MVCModels.DCRUserExpenseDetails> GetDCRExpensedetailsforMonthwise(string companyCode, string userCode, int month, int year)
        {
            List<MVCModels.DCRUserExpenseDetails> lstDCRExpensedetails = new List<MVCModels.DCRUserExpenseDetails>();
            using (IDbConnection connection = IDbOpenConnection())
            {
                var param = new DynamicParameters();
                param.Add("@Company_Code", companyCode);
                param.Add("@User_Code", userCode);
                param.Add("@Month", month);
                param.Add("@Year", year);
                lstDCRExpensedetails = connection.Query<MVCModels.DCRUserExpenseDetails>(SP_HD_GETDCREXPENSEDETAILSFORMONTHWISE, param, commandType: CommandType.StoredProcedure).ToList();
                return lstDCRExpensedetails;
            }
        }
        public List<MVCModels.AddlUnapproveExpModel> GetAddlExpenseClaimDetails(string companycode, string claimCode)
        {
            List<MVCModels.AddlUnapproveExpModel> lstAddlUnapproveExpdetails = new List<MVCModels.AddlUnapproveExpModel>();
            using (IDbConnection connection = IDbOpenConnection())
            {
                var param = new DynamicParameters();
                param.Add("@claimCode", claimCode);
                lstAddlUnapproveExpdetails = connection.Query<MVCModels.AddlUnapproveExpModel>(SP_HD_GetAddlExpenseClaimDetails, param, commandType: CommandType.StoredProcedure).ToList();
                return lstAddlUnapproveExpdetails;
            }
        }
        public List<MVCModels.AddlUnapproveExpModel> GetUnapproveAddlExpdetforMonthwise(string companyCode, string userCode, int month, int year)
        {
            List<MVCModels.AddlUnapproveExpModel> lstAddlUnapproveExpdetails = new List<MVCModels.AddlUnapproveExpModel>();
            using (IDbConnection connection = IDbOpenConnection())
            {
                var param = new DynamicParameters();
                param.Add("@Company_Code", companyCode);
                param.Add("@User_Code", userCode);
                param.Add("@Month", month);
                param.Add("@Year", year);
                lstAddlUnapproveExpdetails = connection.Query<MVCModels.AddlUnapproveExpModel>(SP_HD_GETUNAPPROVEADDLEXPFORMONTHWISE, param, commandType: CommandType.StoredProcedure).ToList();
                return lstAddlUnapproveExpdetails;
            }
        }
        public List<MVCModels.AddlExpenseDetails> GetAddlDcrExpDetforMonthwise(string userCode, int month, int year)
        {
            List<MVCModels.AddlExpenseDetails> lstAddlExp = new List<MVCModels.AddlExpenseDetails>();
            List<MVCModels.DCRUserExpenseDetails> lstDcrExp = new List<MVCModels.DCRUserExpenseDetails>();
            List<MVCModels.UserExpenseTypeDetails> lstUserExpType = new List<MVCModels.UserExpenseTypeDetails>();
            List<MVCModels.AddlDcrUniqueDate> lstDcrDateUq = new List<MVCModels.AddlDcrUniqueDate>();
            List<MVCModels.MonthlyExpense> lstDcrExpense = new List<MVCModels.MonthlyExpense>();
            using (IDbConnection connection = IDbOpenConnection())
            {
                var param = new DynamicParameters();
                param.Add("@User_Code", userCode);
                param.Add("@Month", month);
                param.Add("@Year", year);
                using (var multiple = connection.QueryMultiple(SP_HD_GETDCRADDLEXPENSEDETAILSFORMONTHWISE, param, commandType: CommandType.StoredProcedure))
                {
                    lstDcrExp = multiple.Read<MVCModels.DCRUserExpenseDetails>().ToList();
                    lstUserExpType = multiple.Read<MVCModels.UserExpenseTypeDetails>().ToList();
                    lstDcrDateUq = multiple.Read<MVCModels.AddlDcrUniqueDate>().ToList();
                    lstDcrExpense = multiple.Read<MVCModels.MonthlyExpense>().ToList();
                }
                MVCModels.AddlExpenseDetails objAddlExp = new MVCModels.AddlExpenseDetails();
                objAddlExp.lstDcrExp = lstDcrExp;
                objAddlExp.lstUserExpDet = lstUserExpType;
                objAddlExp.lstDcrDateUq = lstDcrDateUq;
                objAddlExp.lstDcrExpense = lstDcrExpense;
                lstAddlExp.Add(objAddlExp);
                return lstAddlExp;
            }
        }
        public List<MVCModels.AddlExpenseDetails> GetAddlDcrExpDet(string userCode, string Dcr_From, string Dcr_To)
        {
            List<MVCModels.AddlExpenseDetails> lstAddlExp = new List<MVCModels.AddlExpenseDetails>();
            List<MVCModels.DCRUserExpenseDetails> lstDcrExp = new List<MVCModels.DCRUserExpenseDetails>();
            List<MVCModels.UserExpenseTypeDetails> lstUserExpType = new List<MVCModels.UserExpenseTypeDetails>();
            List<MVCModels.AddlDcrUniqueDate> lstDcrDateUq = new List<MVCModels.AddlDcrUniqueDate>();
            using (IDbConnection connection = IDbOpenConnection())
            {
                var param = new DynamicParameters();
                param.Add("@User_Code", userCode);
                param.Add("@Dcr_From", Dcr_From);
                param.Add("@Dcr_To", Dcr_To);
                using (var multiple = connection.QueryMultiple(SP_HD_GETDCRADDLEXPENSEDETAILS, param, commandType: CommandType.StoredProcedure))
                {
                    lstDcrExp = multiple.Read<MVCModels.DCRUserExpenseDetails>().ToList();
                    lstUserExpType = multiple.Read<MVCModels.UserExpenseTypeDetails>().ToList();
                    lstDcrDateUq = multiple.Read<MVCModels.AddlDcrUniqueDate>().ToList();
                }
                MVCModels.AddlExpenseDetails objAddlExp = new MVCModels.AddlExpenseDetails();
                objAddlExp.lstDcrExp = lstDcrExp;
                objAddlExp.lstUserExpDet = lstUserExpType;
                objAddlExp.lstDcrDateUq = lstDcrDateUq;
                lstAddlExp.Add(objAddlExp);
                return lstAddlExp;
            }
        }
        public List<MVCModels.ExpenseCalimHolidayList> GetExpenseClaimHolidayList(string companyCode, string userCode, string startDate, string endDate)
        {
            List<MVCModels.ExpenseCalimHolidayList> lstExpenseCalimHoliday = new List<MVCModels.ExpenseCalimHolidayList>();
            using (IDbConnection connection = IDbOpenConnection())
            {
                var param = new DynamicParameters();
                param.Add("@CompanyCode", companyCode);
                param.Add("@UserCode", userCode);
                param.Add("@StartDate", startDate);
                param.Add("@EndDate", endDate);
                lstExpenseCalimHoliday = connection.Query<MVCModels.ExpenseCalimHolidayList>(USP_HD_GETCALENDERHOLIDAYDETAILSFOREXPENSECLAIMMONTH, param, commandType: CommandType.StoredProcedure).ToList();
                return lstExpenseCalimHoliday;
            }
        }

        public List<MVCModels.ExpenseClaimLockLeaveDetails> GetExpenseClaimLockLeavelist(string companyCode, string userCode, string startDate, string endDate)
        {
            List<MVCModels.ExpenseClaimLockLeaveDetails> lstExpenseCalimLockLeave = new List<MVCModels.ExpenseClaimLockLeaveDetails>();
            using (IDbConnection connection = IDbOpenConnection())
            {
                var param = new DynamicParameters();
                param.Add("@CompanyCode", companyCode);
                param.Add("@UserCode", userCode);
                param.Add("@StartDate", startDate);
                param.Add("@EndDate", endDate);
                lstExpenseCalimLockLeave = connection.Query<MVCModels.ExpenseClaimLockLeaveDetails>(USP_HD_GETDCRLOCKLEAVEDETAILSFOREXPENSECLAIM, param, commandType: CommandType.StoredProcedure).ToList();
                return lstExpenseCalimLockLeave;
            }
        }


        public List<MVCModels.ExpenseWeekendList> GetExpenseClaimWeekendList(string companyCode, string userCode, string startDate, string endDate)
        {
            List<MVCModels.ExpenseWeekendList> lstExpenseCalimWeekEnd = new List<MVCModels.ExpenseWeekendList>();
            using (IDbConnection connection = IDbOpenConnection())
            {
                var param = new DynamicParameters();
                param.Add("@CompanyCode", companyCode);
                param.Add("@UserCode", userCode);
                param.Add("@StartDate", startDate);
                param.Add("@EndDate", endDate);
                lstExpenseCalimWeekEnd = connection.Query<MVCModels.ExpenseWeekendList>(USP_HD_GETWEEKENDOFFFOREXPENSECALIMMONTH, param,
              commandTimeout: 0, commandType: CommandType.StoredProcedure).ToList();
                return lstExpenseCalimWeekEnd;
            }
        }



        /// <summary>
        /// Get expense claim for a month
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="requestClaimcode"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <returns></returns>
        public int GetExpenseMonthCount(string companyCode, string userCode, string requestClaimcode, int month, int year)
        {
            int rowcount = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@Company_Code", companyCode);
                    parameter.Add("@User_Code", userCode);
                    parameter.Add("@Claim_RequestCode", requestClaimcode);
                    parameter.Add("@Month", month);
                    parameter.Add("@Year", year);
                    parameter.Add("@Result", 0, DbType.Int32, ParameterDirection.Output);
                    connection.Query<int>(SP_HD_GETEXPENSECLAIMFORMONTH, parameter, commandType: CommandType.StoredProcedure);
                    rowcount = parameter.Get<int>("@Result");
                    connection.Close();
                    return rowcount;
                }
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Get Claim status for Month wise
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns></returns>
        public List<MVCModels.ExpenseClaimHeaderModel> GetExpenseclaimstatusforMonth(string companyCode, string claimCode)
        {
            List<MVCModels.ExpenseClaimHeaderModel> lstClaimHeader = new List<MVCModels.ExpenseClaimHeaderModel>();
            using (IDbConnection connection = IDbOpenConnection())
            {
                var parameter = new DynamicParameters();
                parameter.Add("@Company_Code", companyCode);
                parameter.Add("@Claim_Code", claimCode);
                lstClaimHeader = connection.Query<MVCModels.ExpenseClaimHeaderModel>(SP_HD_GETEXPENSECLAIMSTATUSFORMONTH, parameter, commandType: CommandType.StoredProcedure).ToList();
                return lstClaimHeader;
            }
        }
        /// <summary>
        /// Get Expense claim approval popup
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="claimCode"></param>
        /// <param name="userCode"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <returns></returns>
        public List<MVCModels.ExpenseClaimApprovalModel> GetExpenseClaimApproval(string companyCode, string claimCode, string userCode, int month, int year)
        {
            MVCModels.ExpenseClaimApprovalModel _objExpenseclaim = new MVCModels.ExpenseClaimApprovalModel();
            List<MVCModels.ExpenseClaimApprovalModel> lstExpenseclaimApproval = new List<MVCModels.ExpenseClaimApprovalModel>();
            List<MVCModels.ExpenseTypeclaimModel> lstExpenseTypes = new List<MVCModels.ExpenseTypeclaimModel>();
            List<MVCModels.ExpenseSFCModel> lstExpenseSFC = new List<MVCModels.ExpenseSFCModel>();
            List<MVCModels.ExpenseActivityModel> lstExpenseActivity = new List<MVCModels.ExpenseActivityModel>();
            List<MVCModels.DCRUserExpenseDetails> lsFieldDates = new List<MVCModels.DCRUserExpenseDetails>();
            List<MVCModels.DCRUserExpenseDetails> lsAttendanceDates = new List<MVCModels.DCRUserExpenseDetails>();
            List<MVCModels.DCRUserExpenseDetails> lsLeavDaysExceptLOP = new List<MVCModels.DCRUserExpenseDetails>();
            using (IDbConnection connection = IDbOpenConnection())
            {
                var parameter = new DynamicParameters();
                parameter.Add("@Company_Code", companyCode);
                parameter.Add("@User_Code", userCode);
                parameter.Add("@Claim_Code", claimCode);
                parameter.Add("@Month", month);
                parameter.Add("@Year", year);
                using (var mutiple = connection.QueryMultiple(SP_HD_GETEXPENSEAPPROVEDETAILSFORMONTH, parameter, commandType: CommandType.StoredProcedure))
                {
                    lstExpenseSFC = mutiple.Read<MVCModels.ExpenseSFCModel>().ToList();
                    lstExpenseActivity = mutiple.Read<MVCModels.ExpenseActivityModel>().ToList();
                    lstExpenseTypes = mutiple.Read<MVCModels.ExpenseTypeclaimModel>().ToList();
                    lsFieldDates = mutiple.Read<MVCModels.DCRUserExpenseDetails>().ToList();
                    lsAttendanceDates = mutiple.Read<MVCModels.DCRUserExpenseDetails>().ToList();
                    lsLeavDaysExceptLOP = mutiple.Read<MVCModels.DCRUserExpenseDetails>().ToList();

                }
                _objExpenseclaim.lstExpenseTypes = lstExpenseTypes;
                _objExpenseclaim.lstExpenseSFC = lstExpenseSFC;
                _objExpenseclaim.lstExpenseActivity = lstExpenseActivity;
                _objExpenseclaim.lsFieldDates = lsFieldDates;
                _objExpenseclaim.lsAttendanceDates = lsAttendanceDates;
                _objExpenseclaim.lsLeavDaysExceptLOP = lsLeavDaysExceptLOP;
                lstExpenseclaimApproval.Add(_objExpenseclaim);
            }
            return lstExpenseclaimApproval;
        }

        public List<MVCModels.ExpenseActivityModel> GetDCRActivityCounts(string companyCode, string userCode, int month, int year)
        {
            List<MVCModels.ExpenseActivityModel> lstExpenseActivity = new List<MVCModels.ExpenseActivityModel>();
            using (IDbConnection connection = IDbOpenConnection())
            {
                var parameter = new DynamicParameters();
                parameter.Add("@Company_Code", companyCode);
                parameter.Add("@User_Code", userCode);
                parameter.Add("@Month", month);
                parameter.Add("@Year", year);


                IEnumerable<MVCModels.ExpenseActivityModel> IExpActivityModel = connection.Query<MVCModels.ExpenseActivityModel>(USP_HD_GETDCRACTIVITYDETAILSFOREXPENSECLAIM, parameter, commandType: CommandType.StoredProcedure);
                if (IExpActivityModel != null)
                {
                    lstExpenseActivity = IExpActivityModel.ToList();
                }

            }
            return lstExpenseActivity;
        }
        public List<MVCModels.HiDoctor_Reports.DCRHOPPlace> GetGetTpDetails(string usercode, string companyCode, DateTime dcrDate)
        {
            var lsTpDatails = new List<MVCModels.HiDoctor_Reports.DCRHOPPlace>();
            using (IDbConnection connection = IDbOpenConnection())
            {
                var parameter = new DynamicParameters();
                parameter.Add("@user_code", usercode);
                parameter.Add("@Company_Code", companyCode);
                parameter.Add("@dcrDate", dcrDate);
                lsTpDatails = connection.Query<MVCModels.HiDoctor_Reports.DCRHOPPlace>(Sp_hd_GETTPDETAILSBYDCRDATE, parameter, commandType: CommandType.StoredProcedure).ToList();
            }
            return lsTpDatails;
        }

        public List<MVCModels.HiDoctor_Reports.ExpenseClaimDCRDetails> GetDCRDetails(string DCR_Code, string companyCode)
        {
            var lstdcrDetails = new List<MVCModels.HiDoctor_Reports.ExpenseClaimDCRDetails>();
            using (IDbConnection connection = IDbOpenConnection())
            {
                var parameter = new DynamicParameters();
                parameter.Add("@DCR_code", DCR_Code);
                parameter.Add("@Company_Code", companyCode);
                lstdcrDetails = connection.Query<MVCModels.HiDoctor_Reports.ExpenseClaimDCRDetails>(Sp_hd_GetExpenseDCRDetails, parameter, commandType: CommandType.StoredProcedure).ToList();
                connection.Close();
            }
            return lstdcrDetails;

        }

        public List<MVCModels.ExpenseClaimImageUpload> GetDetailsUploadImage(string claimCode)
        {
            var lstimg = new List<MVCModels.ExpenseClaimImageUpload>();
            using (IDbConnection connection = IDbOpenConnection())
            {
                var p = new DynamicParameters();
                p.Add("@claimCode", claimCode);
                lstimg = connection.Query<MVCModels.ExpenseClaimImageUpload>(Sp_hd_GetDetailsOfUploadImage, p, commandType: CommandType.StoredProcedure).ToList();
            }
            return lstimg;
        }

        public string GetConfitValueForSize(string companyCode)
        {
            string fileDetails = "";
            try
            {
                SqlCommand command = new SqlCommand(SP_HD_GetConfigValueForSize);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 400;
                AddParamToSqlCommand(command, "@companyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objData.OpenConnection(companyCode);
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                    if (dataReader.HasRows)
                        while (dataReader.Read())
                            fileDetails = dataReader["Result"].ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return fileDetails;

        }
        public void GetDeleteUploadImage(int ID)
        {
            int rowaffected = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@ID", ID);
                    const string query = "Delete from tbl_SFA_Expense_Claim_ImageUpload where EI_ID=@ID";
                    rowaffected = connection.Execute(query, p);

                }
            }
            catch
            {
                throw;
            }

        }

        public void GetSaveUploadImage(string claimCode, List<string> Img)
        {
            for (int i = 0; i < Img.Count; i++)
            {
                string File_Name = Img[i].Split('#')[1];
                string Image_File_Path = Img[i].Split('#')[0];
                string DCR_ID = Img[i].Split('#')[2];
                try
                {
                    using (IDbConnection connection = IDbOpenConnection())
                    {
                        var p = new DynamicParameters();
                        p.Add("@Claim_Code", claimCode);
                        p.Add("@Image_File_Path", Image_File_Path);
                        p.Add("@File_Name", File_Name);
                        p.Add("@DCR_ID", DCR_ID);
                        p.Add("@id", i);
                        connection.Execute(Sp_HD_InsertingUploadImage, p, commandType: CommandType.StoredProcedure);
                    }
                }
                catch
                {
                    throw;
                }

            }


        }

        #endregion - Expense claim MOnth wise
        public IEnumerable<MVCModels.ExpenseClaimHeaderModel> GetExpClaimSearch(string UserCode, string UserName, int ExpMonth, int ExpYear,string Type)
        {
            IEnumerable<MVCModels.ExpenseClaimHeaderModel> lstClaimSummary;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstClaimSummary = connection.Query<MVCModels.ExpenseClaimHeaderModel>(SP_hdGetExpenseClaimSummary_Search,
                                  new { UserCode = UserCode, UserName = UserName, ExpMonth = ExpMonth, ExpYear = ExpYear, Type = Type },
                                  commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstClaimSummary;
        }

        public class ExpAddlClaimEnumurator : IEnumerable<SqlDataRecord>
        {
            public ExpAddlClaimEnumurator(IEnumerable<MVCModels.ExpenseClaimDetailsModel> data)
            {
                _data = data;
            }
            private IEnumerable<MVCModels.ExpenseClaimDetailsModel> _data;
            public IEnumerator<SqlDataRecord> GetEnumerator()
            {
                SqlMetaData[] metaData = {
            new SqlMetaData("S_No", SqlDbType.Int),
            new SqlMetaData("DCR_Date", SqlDbType.VarChar, 20),
            new SqlMetaData("DCR_Flag", SqlDbType.VarChar, 10),
            new SqlMetaData("Expense_Type_Code", SqlDbType.VarChar, 30),
            new SqlMetaData("Expense_Amount",SqlDbType.Float),
         };

                foreach (var item in _data)
                {
                    SqlDataRecord record = new SqlDataRecord(metaData);
                    record.SetValue(0, item.S_No);
                    record.SetValue(1, item.DCR_Actual_Date);
                    record.SetValue(2, item.DCRExpense_Activity_Flag);
                    record.SetValue(3, item.Expense_Type_Code);
                    record.SetValue(4, item.Expense_Amount);
                    yield return record;
                }
            }
            System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
            {
                return this.GetEnumerator();
            }
        }

        public string ValidateDcrExp(string CompanyCode, List<MVCModels.ExpenseClaimDetailsModel> lstClaimDetail, string Fav_UserCode)
        {
            _objSPData = new SPData();
            _objData = new Data();
            string cmdText = string.Empty;
            try
            {
                cmdText = USP_HD_ValidateDcrExpense;
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, CompanyCode);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, Fav_UserCode);
                if (lstClaimDetail.Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@DcrExp_Type", ParameterDirection.Input, SqlDbType.Structured, null, "DcrExp_TVP");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@DcrExp_Type", ParameterDirection.Input, SqlDbType.Structured, new ExpAddlClaimEnumurator(lstClaimDetail.AsEnumerable()), "DcrExp_TVP");
                }
                SqlParameter returnvalue = new SqlParameter("@Result", SqlDbType.VarChar);
                returnvalue.Direction = ParameterDirection.Output;
                returnvalue.Size = 500;
                command.Parameters.Add(returnvalue);
                _objData.OpenConnection(CompanyCode);
                _objData.ExecuteNonQuery(command);
                string result = returnvalue.Value.ToString();
                return result;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public string ValidateExpenses(string UserCode, string DcrDate, string DcrFlag, string DcrCat, string DcrExp, string DcrExpCode, string DcrAmt)
        {
            string result = string.Empty;
            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@DcrDate", DcrDate);
                    parameter.Add("@DcrFlag", DcrFlag);
                    parameter.Add("@DcrCat", DcrCat);
                    parameter.Add("@DcrExp", DcrExp);
                    parameter.Add("@DcrExpCode", DcrExpCode);
                    parameter.Add("@DcrAmt", DcrAmt);
                    parameter.Add("@UserCode", UserCode);
                    parameter.Add("@Result", string.Empty, DbType.String, ParameterDirection.Output);
                    conn.Query<string>(USP_HD_ValidateADDLEXPENSE, parameter, commandType: CommandType.StoredProcedure);
                    result = parameter.Get<string>("@Result");
                    conn.Close();
                }
            }
            catch (Exception)
            {

                throw;
            }
            return result;
        }

        public int DeleteDailyExpEdit(string userCode, string ClaimDet)
        {
            string Curr_Date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            int rowsAffected = 0;
            StringBuilder strExpHistory = new StringBuilder();
            strExpHistory.Append("INSERT INTO tbl_SFA_Expense_Claim_Details_history");
            strExpHistory.Append("(Company_Code,Claim_Code,Claim_Detail_Code,");
            strExpHistory.Append("Expense_Type_Code,Expense_Amount,Customer_Code,");
            strExpHistory.Append("Present_Contribution,Potential_Contribution,");
            strExpHistory.Append("Bill_Number,Remarks_By_User,Record_Status,Ref_Key1,Ref_Key2,");
            strExpHistory.Append("DCR_Actual_Date,Updated_By,Updated_DateTime,Approved_Amount,");
            strExpHistory.Append("Managers_Approval_Remark,Version_Number,DCR_Activity_Flag,");
            strExpHistory.Append("Expense_Mode) SELECT Company_Code,Claim_Code,Claim_Detail_Code,");
            strExpHistory.Append("Expense_Type_Code,Expense_Amount,Customer_Code,");
            strExpHistory.Append("Present_Contribution,Potential_Contribution,Bill_Number,");
            strExpHistory.Append("Remarks_By_User,Record_Status,Ref_Key1,Ref_Key2,DCR_Actual_Date,");
            strExpHistory.Append("'" + userCode + "','" + Curr_Date + "',Approved_Amount,");
            strExpHistory.Append("Managers_Approval_Remark,Version_Number,DCR_Activity_Flag,Expense_Mode FROM ");
            strExpHistory.Append("tbl_SFA_Expense_Claim_Details WITH(NOLOCK) WHERE Claim_Detail_Code='" + ClaimDet + "'");

            StringBuilder strDelExp = new StringBuilder();
            strDelExp.Append("DELETE tbl_SFA_Expense_Claim_Details ");
            strDelExp.Append("WHERE Claim_Detail_Code='" + ClaimDet + "'");
            using (IDbConnection conn = IDbOpenConnection())
            {
                rowsAffected = conn.Execute(strExpHistory.ToString());
                if (rowsAffected > 0)
                {
                    rowsAffected = 0;
                    rowsAffected = conn.Execute(strDelExp.ToString());
                }
            }
            return rowsAffected;
        }

        public string GetDistanceTravelled(string companyCode, string dcrDateSFC, string DCR_Code)
        {
            string result = "";
            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@companyCode", companyCode);
                    parameter.Add("@dcrDateSFC", dcrDateSFC);
                    parameter.Add("@DCR_Code", DCR_Code);
                    parameter.Add("@Result", string.Empty, DbType.String, ParameterDirection.Output);
                    conn.Query<string>(Sp_HD_GetDistanceTravelled, parameter, commandType: CommandType.StoredProcedure);
                    result = parameter.Get<string>("@Result");
                    conn.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        public List<MVCModels.ExpenseActivity> GetExpenseTypeDetails()
        {
            List<MVCModels.ExpenseActivity> result = new List<MVCModels.ExpenseActivity>();
            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    result= conn.Query<MVCModels.ExpenseActivity>("Sp_ExpenseTypeDetails", parameter, commandType: CommandType.StoredProcedure).ToList();
                    conn.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        public List<MVCModels.ExpenseActivityType> GetExpenseActivitytype()
        {
            List<MVCModels.ExpenseActivityType> result = new List<MVCModels.ExpenseActivityType>();
            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    result = conn.Query<MVCModels.ExpenseActivityType>("SP_hdgetexpenseActivity", parameter, commandType: CommandType.StoredProcedure).ToList();
                    conn.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        public string InsertExpenseActivityMapping(string UserCode,string CompanyCode,DataTable Expensetable,string startdate, string enddate, string activity)
        {
            string result = "";
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();


                    string cmdTxt = "SP_HD_InsertExpenseActivityMapping";
                    SqlCommand command = new SqlCommand(cmdTxt);
                    command.CommandType = CommandType.StoredProcedure;
                    AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, UserCode);
                    AddParamToSqlCommand(command, "@startdate", ParameterDirection.Input, SqlDbType.VarChar, 30, startdate);
                    AddParamToSqlCommand(command, "@enddate", ParameterDirection.Input, SqlDbType.VarChar, 30, enddate);
                    AddParamToSqlCommand(command, "@activity", ParameterDirection.Input, SqlDbType.VarChar, 30, activity);
                    AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar,2000, "");
                    if (Expensetable != null)
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Expense_ActivityMapping", ParameterDirection.Input, SqlDbType.Structured, Expensetable, "TVP_Expense_ActivityMapping");
                    }
                    else
                    {
                        _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_Expense_ActivityMapping", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_Expense_ActivityMapping");
                    }
                    _objData.OpenConnection(CompanyCode);
                     _objData.ExecuteNonQuery(command);
                    result = command.Parameters["@Result"].Value.ToString();
                }
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<MVCModels.Details> Getallexpenseactivitymapping(string User_Code)
        {
            List<MVCModels.Details> result = new List<MVCModels.Details>();
            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@User_Code", User_Code);
                    result = conn.Query<MVCModels.Details>("SP_hdGetAllExpenseActivityMapping", parameter, commandType: CommandType.StoredProcedure).ToList();
                    conn.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        public static DataTable ToDataTable<T>(List<T> items)
        {
            DataTable dataTable = new DataTable(typeof(T).Name);

            //Get all the properties
            PropertyInfo[] Props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
            foreach (PropertyInfo prop in Props)
            {
                //Defining type of data column gives proper data table 
                var type = (prop.PropertyType.IsGenericType && prop.PropertyType.GetGenericTypeDefinition() == typeof(Nullable<>) ? Nullable.GetUnderlyingType(prop.PropertyType) : prop.PropertyType);
                //Setting column names as Property names
                dataTable.Columns.Add(prop.Name, type);
            }
            foreach (T item in items)
            {
                var values = new object[Props.Length];
                for (int i = 0; i < Props.Length; i++)
                {
                    //inserting property values to datatable rows
                    values[i] = Props[i].GetValue(item, null);
                }
                dataTable.Rows.Add(values);
            }
            //put a breakpoint here and check datatable
            return dataTable;
        }

        public int ChangeStatus(int id, string user_code)
        {
            int result = 0;
            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@id", id);
                    parameter.Add("@user_code", user_code);
                    conn.Query<int>("Sp_HD_ExpenseMappingChangesStatus", parameter, commandType: CommandType.StoredProcedure);
                    result = 1;
                    conn.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        public List<MVCModels.UserExpenseTypeDetails> GetAdditionalExpense(string userCode, string DcrDate, string Flag)
        {
            List<MVCModels.UserExpenseTypeDetails> result = new List<MVCModels.UserExpenseTypeDetails>();
            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@userCode", userCode);
                    parameter.Add("@DcrDate", DcrDate);
                    parameter.Add("@Flag", Flag);
                    result = conn.Query<MVCModels.UserExpenseTypeDetails>("SP_hdGetGetAdditionalExpense", parameter, commandType: CommandType.StoredProcedure).ToList();
                    conn.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        public List<MVCModels.ExpenseUrl> fngetdcrExpenseUrl(string userCode, int month, int year, string Effective_from, string Effective_to)
        {
            List<MVCModels.ExpenseUrl> result = new List<MVCModels.ExpenseUrl>();
            try
            {
                using (IDbConnection conn = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@userCode", userCode);
                    parameter.Add("@month", month);
                    parameter.Add("@year", year);
                    parameter.Add("@Effective_from", Effective_from);
                    parameter.Add("@Effective_to", Effective_to);
                    result = conn.Query<MVCModels.ExpenseUrl>("SP_hdgetdcrExpenseUrl", parameter, commandType: CommandType.StoredProcedure).ToList();
                    conn.Close();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }
    }
}
