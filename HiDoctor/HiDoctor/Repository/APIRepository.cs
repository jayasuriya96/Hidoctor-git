using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using DataControl.Repository;
using MVCModels.HiDoctor_Reports;
using System.Text;
using DataControl;
using System.Threading.Tasks;


namespace HiDoctor.Repository
{
    public class APIRepository
    {
        public DataSet GetAPIServices(string companyCode, string userTypeCode)
        {
            DALAPI objdalAPI = new DALAPI();
            //string companyCode = HttpContext.Current.Session["Company_Code"].ToString();
            return objdalAPI.GetAPIServices(companyCode, userTypeCode);
        }
        public DataSet GetAPIUIElements(int apiId)
        {
            DALAPI objdalAPI = new DALAPI();
            return objdalAPI.GetAPIUIElements(apiId);
        }
        public string ExecuteService(string companyCode, string userName, System.Web.Mvc.FormCollection coll, string subDominName, out string error)
        {
            try
            {
                //string companyCode = HttpContext.Current.Session["Company_Code"].ToString();
                //string userName = HttpContext.Current.Session["User_Name"].ToString();

                DALAPI objdalAPI = new DALAPI();
                int apiID = Convert.ToInt32(coll["APIId"]);
                string serviceId = coll["ServiceId"].ToString();

                DataSet ds = GetAPIUIElements(apiID);
                object[] param = new object[ds.Tables[0].Rows.Count];
                int i = 0;

                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    if (dr["Show_In_UI"].ToString().ToUpper() == "N")
                    {
                        param[i] = HttpContext.Current.Session[dr["Session_Key"].ToString()].ToString();
                    }
                    else
                    {
                        if (dr["Type"].ToString() != "TEXT_CSV")
                        {
                            param[i] = coll[dr["InputParam"].ToString()].ToString();
                        }
                        else
                        {
                            // input string formate for TEXT_CSV aaa^bbb^ccc^bbbb^
                            string paramValue = coll[dr["InputParam"].ToString()].ToString();
                            paramValue = paramValue.Replace("^", "','");
                            paramValue = "'" + paramValue + "'";
                            param[i] = paramValue;
                        }
                    }
                    i++;
                }

                //Log Bulk API SVC Log
                string hdLogId = Guid.NewGuid().ToString();
                objdalAPI.BulkAPISvcLog(companyCode, userName, serviceId, hdLogId, apiID);

                //HDCoreDataService.HDCoreDataServiceClient coreClt = new HDCoreDataService.HDCoreDataServiceClient();

                HDCoreDataService.HDCoreDataServiceClient coreClt = new HDCoreDataService.HDCoreDataServiceClient();
                string url = coreClt.ExecuteService("SWAAS", subDominName, apiID, hdLogId, param, out error);

               // string url = coreClt.ExecuteService(out error,"SWAAS", subDominName, apiID, hdLogId, param);
                if (!string.IsNullOrEmpty(url))
                {
                    return url;
                }
                else
                {
                    return "FAIL:" + error;
                }
            }
            catch (Exception ex)
            {
                error = ex.Message.ToString();
                return "FAIL:" + error;
            }
        }

        #region async process

        public string AysncExecuteService(string companyCode, string userName, System.Web.Mvc.FormCollection coll, string subDominName, out string error)
        {
            try
            {
                int isExcel = Convert.ToInt32(coll["isExcel"]);
                if (isExcel == 1)
                {
                    GetExcelData(companyCode, userName, coll, subDominName, out error);
                    return "SUCCESS";
                }
                else
                {
                    return GetReportData(companyCode, userName, coll, subDominName, out error);
                }



            }
            catch (Exception ex)
            {
                error = ex.Message.ToString();
                return "FAILURE";
            }
        }
        public string GetExcelData(string companyCode, string userName, System.Web.Mvc.FormCollection coll, string subDominName, out string error)
        {

            DALAPI objdalAPI = new DALAPI();
            CurrentInfo _objcurrentInfo = new CurrentInfo();
            Data _objData = new Data();
            int apiID = Convert.ToInt32(coll["APIId"]);
            string serviceId = coll["ServiceId"].ToString();
            //string ErrorMSG = string.Empty;
            string TransNumber = Guid.NewGuid().ToString();
            string CurrentUserCode = _objcurrentInfo.GetUserCode();
            //string CurrentUserName = _objcurrentInfo.GetUserName();
            string ConnectionString = _objData.GetConnectionString_Client();
            string ExcelURL = string.Empty;
            StringBuilder ParamDetails = new StringBuilder();

            DataSet ds = GetAPIUIElements(apiID);
            object[] param = new object[ds.Tables[0].Rows.Count];
            int i = 0;

            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                if (dr["Show_In_UI"].ToString().ToUpper() == "N")
                {
                    param[i] = HttpContext.Current.Session[dr["Session_Key"].ToString()].ToString();
                }
                else
                {
                    if (dr["Type"].ToString() != "TEXT_CSV")
                    {
                        param[i] = coll[dr["InputParam"].ToString()].ToString();
                    }
                    else
                    {
                        // input string formate for TEXT_CSV aaa^bbb^ccc^bbbb^
                        string paramValue = coll[dr["InputParam"].ToString()].ToString();
                        paramValue = paramValue.Replace("^", "','");
                        paramValue = "'" + paramValue + "'";
                        param[i] = paramValue;
                    }
                }
                ParamDetails.Append(dr["InputParam"].ToString() + ": " + param[i].ToString() + "<br />");
                i++;
            }

            //Log Bulk API SVC Log
            string hdLogId = Guid.NewGuid().ToString();
            string OutError;
            objdalAPI.BulkAPISvcLog(companyCode, userName, serviceId, hdLogId, apiID);
            InsertExcelAPITransactionQueue(companyCode, TransNumber, apiID, ParamDetails.ToString(), "In Progress", false, "", "", "", ConnectionString, CurrentUserCode);

            //HDCoreDataService.HDCoreDataServiceClient coreClt = new HDCoreDataService.HDCoreDataServiceClient();
            Task task = Task.Factory.StartNew(() =>
            {
                try
                {
                    HDCoreDataService.HDCoreDataServiceClient coreClt = new HDCoreDataService.HDCoreDataServiceClient();
                   // ExcelURL = coreClt.ExecuteService(out OutError,"SWAAS", subDominName, apiID, hdLogId, param);
                    ExcelURL = coreClt.ExecuteService("SWAAS", subDominName, apiID, hdLogId, param, out OutError);
                    if (ExcelURL != "")
                    {
                        OnAsyncReportProcessCompletion(companyCode, CurrentUserCode, TransNumber, apiID, ExcelURL, ConnectionString);
                    }
                    else
                    {
                        UpdateExcelAPITransactionQueue(TransNumber, "Error", OutError, OutError, "", ConnectionString, CurrentUserCode);
                    }
                }
                catch (Exception ex)
                {
                    UpdateExcelAPITransactionQueue(TransNumber, "Error", ex.Message, "Error occurred while processing the request, please try again later", "", ConnectionString, CurrentUserCode);
                }

            });
            error = TransNumber;
            return "SUCCESS";
        }

        public string GetReportData(string companyCode, string userName, System.Web.Mvc.FormCollection coll, string subDominName, out string error)
        {

            DALAPI objdalAPI = new DALAPI();
            CurrentInfo _objcurrentInfo = new CurrentInfo();
            Data _objData = new Data();
            int apiID = Convert.ToInt32(coll["APIId"]);
            string serviceId = coll["ServiceId"].ToString();
            //string ErrorMSG = string.Empty;
            string TransNumber = Guid.NewGuid().ToString();
            string CurrentUserCode = _objcurrentInfo.GetUserCode();
            //string CurrentUserName = _objcurrentInfo.GetUserName();
            string ConnectionString = _objData.GetConnectionString_Client();
            string ExcelURL = string.Empty;
            StringBuilder ParamDetails = new StringBuilder();

            DataSet ds = GetAPIUIElements(apiID);
            object[] param = new object[ds.Tables[0].Rows.Count];
            int i = 0;

            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                if (dr["Show_In_UI"].ToString().ToUpper() == "N")
                {
                    param[i] = HttpContext.Current.Session[dr["Session_Key"].ToString()].ToString();
                }
                else
                {
                    if (dr["Type"].ToString() != "TEXT_CSV")
                    {
                        param[i] = coll[dr["InputParam"].ToString()].ToString();
                    }
                    else
                    {
                        // input string formate for TEXT_CSV aaa^bbb^ccc^bbbb^
                        string paramValue = coll[dr["InputParam"].ToString()].ToString();
                        paramValue = paramValue.Replace("^", "','");
                        paramValue = "'" + paramValue + "'";
                        param[i] = paramValue;
                    }
                }
                ParamDetails.Append(dr["InputParam"].ToString() + ": " + param[i].ToString() + "<br />");
                i++;
            }

            //Log Bulk API SVC Log
            string hdLogId = Guid.NewGuid().ToString();
            string OutError;
            objdalAPI.BulkAPISvcLog(companyCode, userName, serviceId, hdLogId, apiID);
            HDCoreDataService.HDCoreDataServiceClient coreClt = new HDCoreDataService.HDCoreDataServiceClient();
            DataSet dsReport = new DataSet();
            dsReport = coreClt.ExecuteServiceDS("SWAAS", subDominName, apiID, "", "", 0, param, out OutError);

           // dsReport = coreClt.ExecuteServiceDS(out OutError,"SWAAS", subDominName, apiID, "", "", 0, param);
            error = "";
            return bindReport(dsReport).ToString();


        }

        private StringBuilder bindReport(DataSet ds)
        {
            StringBuilder tableContent = new StringBuilder();

            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
               
                tableContent.Append("<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblDoctorMaster' >");
                tableContent.Append("<thead>");
                foreach (DataColumn column in ds.Tables[0].Columns)
                {
                    tableContent.Append("<th >");
                    tableContent.Append(column.ColumnName);
                    tableContent.Append("</th>");
                }             
                tableContent.Append("</tr >");                
                tableContent.Append("</thead>");

                tableContent.Append("<tbody>");
                foreach (DataRow drRow in ds.Tables[0].Rows)
                {
                    tableContent.Append("<tr>");
                    foreach (DataColumn column in ds.Tables[0].Columns)
                    {
                      
                        tableContent.Append("<td >");
                        tableContent.Append(drRow[column.ColumnName].ToString());
                        tableContent.Append("</td>");
                    }
                    tableContent.Append("</tr>");
                }
                tableContent.Append("</tbody>");
                tableContent.Append("</table>");

            }
            else
            {
                tableContent.Append("No data found");
            }
            return tableContent;
        }

        public IList<UsersExcelAPIQueues> GetUsersExcelAPIProcessQueue(string UserCode, int API_ID)
        {
            try
            {
                DALAPI objdalAPI = new DALAPI();
                return objdalAPI.GetUsersExcelAPIProcessQueue(UserCode, API_ID);
            }
            catch
            {
                throw;
            }
        }

        public int InsertExcelAPITransactionQueue(string CompanyCode, string TransactionID, int API_ID, string Rpt_Parameters, string ProcessState, bool IsRptViewed, string TechError, string UserError, string Excel_File_Path, string Connection, string CurrUserCode)
        {
            try
            {
                DALAPI objdalAPI = new DALAPI();
                return objdalAPI.InsertExcelAPITransactionQueue(CompanyCode, TransactionID, API_ID, Rpt_Parameters, ProcessState, IsRptViewed, TechError, UserError, Excel_File_Path, Connection, CurrUserCode);
            }
            catch
            {
                throw;
            }
        }

        public int UpdateExcelAPITransactionQueue(string TransactionID, string ProcessState, string TechError, string UserError, string Excel_File_Path, string Connection, string CurrUserCode)
        {
            try
            {
                DALAPI objdalAPI = new DALAPI();
                return objdalAPI.UpdateExcelAPITransactionQueue(TransactionID, ProcessState, TechError, UserError, Excel_File_Path, Connection, CurrUserCode);
            }
            catch
            {
                throw;
            }
        }

        public void OnAsyncReportProcessCompletion(string CompanyCode, string CurrentUserCode, string TransNumber, int API_ID, string URL, string ConnectionString)
        {
            //DataSet dsEmail = new DataSet();
            //string strEmailContent = string.Empty;
            //string strEmailID = string.Empty;
            //string strUserName = string.Empty;
            //BLUser objBLuser = new BLUser();
            //BLMaster _objBL = new BLMaster();

            try
            {
                UpdateExcelAPITransactionQueue(TransNumber, "Completed", "", "", URL, ConnectionString, CurrentUserCode);
                //dsEmail = objBLuser.checkEmailid(CompanyCode, CurrentUserCode, ConnectionString);
                //if (dsEmail.Tables[0].Rows.Count > 0)
                //{
                //    strUserName = dsEmail.Tables[0].Rows[0]["User_Name"].ToString();
                //    strEmailID = dsEmail.Tables[0].Rows[0]["Email_Id"].ToString();
                //    strEmailContent = FrameEmailContent(strUserName, API_ID, TransNumber);
                //    _objBL.SendMail(strEmailID, "Excel API Report" + API_ID + " - Generated Successfully", strEmailContent);
                //}
            }
            finally
            {
                //dsEmail.Dispose();
                //objBLuser = null;
                //_objBL = null;
            }
        }

        public string FrameEmailContent(string UserName, int API_ID, string TransNumber)
        {
            StringBuilder EmailContent = new StringBuilder();
            EmailContent.Append("<div>");
            EmailContent.Append("Hello " + UserName);
            EmailContent.Append("<br /><br />");
            EmailContent.Append("Your request for report '<b>" + API_ID.ToString() + "</b>' with transaction ref no: '<b>" + TransNumber + "</b>' was processed successfully. ");
            EmailContent.Append("Please login into portal and view them.");
            EmailContent.Append("<br /><br />");
            EmailContent.Append("Sincerely<br />");
            EmailContent.Append("From Swaas Systems");
            EmailContent.Append("<br /><br />");
            EmailContent.Append("<i>* This is system generated e-mail. Please do not reply back.</i>");
            EmailContent.Append("</div>");
            return EmailContent.ToString();
        }
        public List<ExcelApiInput> GetExcelApiInputData(string companyCode, string userCode, string regionCode, string sessionKey, string searchKey)
        {
            try
            {
                DALAPI objDALAPI = new DALAPI();
                List<ExcelApiInput> lstExcelApiInput = new List<ExcelApiInput>();
                lstExcelApiInput = objDALAPI.GetExcelApiInputData(companyCode, userCode, regionCode, sessionKey, searchKey).ToList();
                return lstExcelApiInput;

            }
            catch
            {
                throw;
            }
        }
        #endregion async process

    }
}