using DataControl.EnumType;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Collections.Generic;
using System.Reflection;
using Dapper;
using Microsoft.SqlServer.Server;
using MVCModels;

namespace DataControl.HiDoctor_ActivityFactoryClasses
{
    public class DALPromotionalInput : DapperRepository
    {
        const string SP_HD_GetUsersbasedonloginuser = "SP_HD_GetUsersbasedonloginuser";
        const string SP_HD_Promotional_Input_Approval = "SP_HD_Promotional_Input_Approval";
        const string SP_HD_TransferDetails_SingleUser = "SP_HD_TransferDetails_SingleUser";
        const string SP_HD_GetUserProductData = "SP_HD_GetUserProductData";
        const string SP_HD_InsertUserProductData = "SP_HD_InsertUserProductData";
        const string SP_HD_PromotionalInputRejectdata = "SP_HD_PromotionalInputRejectdata";
        const string SP_HD_ApproveInputTransferRequest = "SP_HD_ApproveInputTransferRequest";
        const string SP_HD_ResubmitProductData = "SP_HD_ResubmitProductData";
        const string SP_HD_Promotional_Input_Rejection = "SP_HD_Promotional_Input_Rejection";
        const string SP_HD_CancelUserProductData = "SP_HD_CancelUserProductData";
        const string SP_HD_Deliverychallandata = "SP_HD_Deliverychallandata";
        const string SP_HD_PromotionalInputTransferDataHistory = "SP_HD_PromotionalInputTransferDataHistory";
        const string SP_HD_GetRemarksHistory = "SP_HD_GetRemarksHistory";




        public IEnumerable<MVCModels.PromotionalInputUserModel> GetUsers(string companyCode,string usercode, string effective_from, string effective_to)
        {
            IEnumerable<MVCModels.PromotionalInputUserModel> lstusers;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@UserCode", usercode);
                p.Add("@Effectivefrom", effective_from);
                p.Add("@Effectiveto", effective_to);
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstusers = connection.Query<MVCModels.PromotionalInputUserModel>(SP_HD_GetUsersbasedonloginuser, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstusers;

        }
        public IEnumerable<MVCModels.Productmodel> GetUserProductdata(string companyCode, string UserCode)
        {
            IEnumerable<MVCModels.Productmodel> lstproduct;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@UserCode", UserCode);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstproduct = connection.Query<MVCModels.Productmodel>(SP_HD_GetUserProductData, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstproduct;

        }
        public bool Insertuserproduct(string companyCode,string usercode,int companyid, List<MVCModels.UserProductModel> lstuserproduct,string UserCode, DataTable dtdisable)
        {
            Data _objData;
            SPData _objSPData;
            _objSPData = new SPData();
            bool result = false;
            _objData = new Data();
            string cmdText = string.Empty;
            try
            {
                DynamicParameters p = new DynamicParameters();
              
               // p.Add("@User_Code", UserCode);
                cmdText = SP_HD_InsertUserProductData;
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@User_Code", UserCode);
                if (lstuserproduct.Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_UserProductTransfer", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_UserProductTransfer");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_UserProductTransfer", ParameterDirection.Input, SqlDbType.Structured, dtdisable, "TVP_UserProductTransfer");
                }


                //SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                //returnValue.Direction = ParameterDirection.Output;
                //returnValue.Size = 500;
                //command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                result = true;
                //string result = returnValue.Value.ToString();

            }
            catch (Exception ex)
            {

                throw ex;
            }
            return result;
        }
        public IEnumerable<MVCModels.Productmodel> GetRejectedUserProductdata(string companyCode, string UserCode, string username, string sourceusercode, string destinationusercode, int transferid)
        {
            IEnumerable<MVCModels.Productmodel> lstproduct;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@UserCode", UserCode);
                p.Add("@UserName", username);
                p.Add("@SourceUserCode", sourceusercode);
                p.Add("@destinationusercode", destinationusercode);
                p.Add("@TransferId", transferid);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstproduct = connection.Query<MVCModels.Productmodel>(SP_HD_PromotionalInputRejectdata, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstproduct;

        }
        public IEnumerable<MVCModels.PromotionalInputUserModel> GetUsersdata(string companyCode, string usercode)
        {
            IEnumerable<MVCModels.PromotionalInputUserModel> lstusers;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@UserCode", usercode);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstusers = connection.Query<MVCModels.PromotionalInputUserModel>(SP_HD_GetUsersbasedonloginuser, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstusers;
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="usercode"></param>
        /// <returns></returns>

        public IEnumerable<MVCModels.promotionalApprovalModel> GetUsersForApproval(string companyCode, string usercode)
        {
            IEnumerable<MVCModels.promotionalApprovalModel> lstuserapproval;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@UserCode", usercode);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstuserapproval = connection.Query<MVCModels.promotionalApprovalModel>(SP_HD_Promotional_Input_Approval, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstuserapproval;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="usercode"></param>
        /// <param name="username"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.ViewTransferModel> GetUserDetailsOnView(string companyCode, string usercode,string username,string sourceusercode,string destinationusercode,int transferid)
        {
            IEnumerable<MVCModels.ViewTransferModel> lstviewselecteduser;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@UserCode", usercode);
                p.Add("@UserName", username);
                p.Add("@SourceUserCode", sourceusercode);
                p.Add("@destinationusercode", destinationusercode);
                p.Add("@TransferId", transferid);


                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstviewselecteduser = connection.Query<MVCModels.ViewTransferModel>(SP_HD_TransferDetails_SingleUser, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstviewselecteduser;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="usercode"></param>
        /// <param name="companyid"></param>
        /// <param name="lstuserproduct"></param>
        /// <param name="UserCode"></param>
        /// <param name="dtdisable"></param>
        /// <returns></returns>
        public bool ApproveUserRequest(string companyCode, string usercode, int companyid, List<MVCModels.UserProductModel> lstuserproduct, DataTable dtdisable)
        {
            Data _objData;
            SPData _objSPData;
            _objSPData = new SPData();
            bool result = false;
            _objData = new Data();
            string cmdText = string.Empty;
            try
            {
                DynamicParameters p = new DynamicParameters();

                // p.Add("@User_Code", UserCode);
                cmdText = SP_HD_ApproveInputTransferRequest;
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // command.Parameters.AddWithValue("@User_Code", UserCode);
                if (lstuserproduct.Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_UserProductTransferApproval", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_UserProductTransferApproval");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_UserProductTransferApproval", ParameterDirection.Input, SqlDbType.Structured, dtdisable, "TVP_UserProductTransferApproval");
                }


                //SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                //returnValue.Direction = ParameterDirection.Output;
                //returnValue.Size = 500;
                //command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                result = true;
                //string result = returnValue.Value.ToString();

            }
            catch (Exception ex)
            {

                throw ex;
            }
            return result;
        }
        public bool Resubmitproductdata(List<MVCModels.UserProductModel> lstuserproduct, DataTable dtdisable)
        {
            Data _objData;
            SPData _objSPData;
            _objSPData = new SPData();
            bool result = false;
            _objData = new Data();
            string cmdText = string.Empty;
            try
            {
                DynamicParameters p = new DynamicParameters();

                // p.Add("@User_Code", UserCode);
                cmdText = SP_HD_ResubmitProductData;
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                DataControl.CurrentInfo _objcurr = new CurrentInfo();
                string companyCode = _objcurr.GetCompanyCode();
                if (lstuserproduct.Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_UserProductResubmit", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_UserProductResubmit");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_UserProductResubmit", ParameterDirection.Input, SqlDbType.Structured, dtdisable, "TVP_UserProductResubmit");
                }


                //SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                //returnValue.Direction = ParameterDirection.Output;
                //returnValue.Size = 500;
                //command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                result = true;
                //string result = returnValue.Value.ToString();

            }
            catch (Exception ex)
            {

                throw ex;
            }
            return result;
        }
        public bool RejectUserRequest(string companyCode, string usercode, List<MVCModels.RejectedRequestModel> lstuserproduct, DataTable dtdisable)
        {
            Data _objData;
            SPData _objSPData;
            _objSPData = new SPData();
            bool result = false;
            _objData = new Data();
            string cmdText = string.Empty;
            try
            {
                DynamicParameters p = new DynamicParameters();

                // p.Add("@User_Code", UserCode);
                cmdText = SP_HD_Promotional_Input_Rejection;
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                // command.Parameters.AddWithValue("@User_Code", UserCode);
                if (lstuserproduct.Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_UserProductReject", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_UserProductReject");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_UserProductReject", ParameterDirection.Input, SqlDbType.Structured, dtdisable, "TVP_UserProductReject");
                }


                //SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                //returnValue.Direction = ParameterDirection.Output;
                //returnValue.Size = 500;
                //command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                result = true;
                //string result = returnValue.Value.ToString();

            }
            catch (Exception ex)
            {

                throw ex;
            }
            return result;
        }
        public bool Canceluserrequest(string companyCode, string usercode, int companyid, List<MVCModels.UserProductModel> lstuserproduct,DataTable dtdisable)
        {
            Data _objData;
            SPData _objSPData;
            _objSPData = new SPData();
            bool result = false;
            _objData = new Data();
            string cmdText = string.Empty;
            try
            {
                DynamicParameters p = new DynamicParameters();

                // p.Add("@User_Code", UserCode);
                cmdText = SP_HD_CancelUserProductData;
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;
                
                if (lstuserproduct.Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_UserProductTransferApproval", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_UserProductTransferApproval");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_UserProductTransferApproval", ParameterDirection.Input, SqlDbType.Structured, dtdisable, "TVP_UserProductTransferApproval");
                }


                //SqlParameter returnValue = new SqlParameter("@Result", SqlDbType.VarChar);
                //returnValue.Direction = ParameterDirection.Output;
                //returnValue.Size = 500;
                //command.Parameters.Add(returnValue);
                _objData.OpenConnection(companyCode);
                _objData.ExecuteNonQuery(command);
                result = true;
                //string result = returnValue.Value.ToString();

            }
            catch (Exception ex)
            {

                throw ex;
            }
            return result;
        }
        public string Deliverychallan(string CompanyCode, string Deliverychallanno)
        {
            string result = string.Empty;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", CompanyCode);
                p.Add("@Deliverychallanno", Deliverychallanno);
                p.Add("@Result", "", DbType.String, ParameterDirection.Output);


                using (IDbConnection connection = IDbOpenConnection())
                {
                    connection.Query<string>(SP_HD_Deliverychallandata, p, commandType: CommandType.StoredProcedure);
                    result = p.Get<string>("@Result");
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }
        public IEnumerable<MVCModels.promotionalApprovalModel> GetUsersForApprovalHistory(string companyCode, string usercode)
        {
            IEnumerable<MVCModels.promotionalApprovalModel> lstuserapproval;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@UserCode", usercode);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstuserapproval = connection.Query<MVCModels.promotionalApprovalModel>(SP_HD_PromotionalInputTransferDataHistory, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstuserapproval;
        }
        public IEnumerable<MVCModels.promotionalApprovalModel> GetRemarksHistory(string companyCode, int TransId,string Product_Code)
        {
            IEnumerable<MVCModels.promotionalApprovalModel> lstuserapproval;
            try
            {
                DynamicParameters p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@Trans_Id", TransId);
                p.Add("@Product_Code", Product_Code);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstuserapproval = connection.Query<MVCModels.promotionalApprovalModel>(SP_HD_GetRemarksHistory, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return lstuserapproval;
        }
    }
}
