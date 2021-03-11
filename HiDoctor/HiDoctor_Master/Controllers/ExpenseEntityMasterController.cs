using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.Threading.Tasks;
using System.Collections;
using System.Text;
using DataControl;
using HiDoctor_Master.Models;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class ExpenseEntityMasterController : Controller
    {
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        private SPData _objSPData = new SPData();
        DataControl.Data _objData = new DataControl.Data();

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Create()
        {
            return View();
        }


        /// <summary>
        /// Bind the ExpenseEntityMaster with Html table
        /// </summary>
        /// <returns></returns>
        public string GetExpenseEntityMaster()
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            try
            {
                BLMaster Master = new BLMaster();
                DataSet dsExpenseEntityMaster = new DataSet();
                dsExpenseEntityMaster = Master.GetExpenseEntityMaster(companyCode);

                StringBuilder sb = new StringBuilder();
                sb.Append("<table WIDTH='75%' id='tblsummary' class='table table-striped' >");
                sb.Append("<thead class='active'>");
                sb.Append("<tr style='background-color:grey;'>");
                sb.Append("<td>Edit</td>");
                sb.Append("<td>Change Status</td>");
                sb.Append("<td>Entity Name</td>");
                sb.Append("<td>Effective From</td>");
                sb.Append("<td>Effective To</td>");
                sb.Append("<td>Status</td>");
                sb.Append("</tr>");
                sb.Append("</thead>");
                sb.Append("<tbody>");

                if (dsExpenseEntityMaster != null && dsExpenseEntityMaster.Tables[0] != null && dsExpenseEntityMaster.Tables[0].Rows.Count > 0)
                {
                    for (int i = 0; i < dsExpenseEntityMaster.Tables[0].Rows.Count; i++)
                    {
                        sb.Append("<tr><td class='td-a'><a id='E" + i + "' onclick='fnEdit(this)'>Edit</a></td>");
                        sb.Append("<td class='td-a'><a id='C" + i + "' onclick='fnchangeStatus(this)'>Change Status</a></td>");
                        sb.Append("<td style='display:none' id='Expense_Entity_Code" + i + "'>" + dsExpenseEntityMaster.Tables[0].Rows[i]["Expense_Entity_Code"].ToString() + "</td>");
                        sb.Append("<td id='Expense_Entity_Name" + i + "'>" + dsExpenseEntityMaster.Tables[0].Rows[i]["Expense_Entity_Name"].ToString() + "</td>");
                        sb.Append("<td id='Effective_From" + i + "'>" + dsExpenseEntityMaster.Tables[0].Rows[i]["Effective_From"].ToString() + "</td>");
                        sb.Append("<td id='Effective_To" + i + "'>" + dsExpenseEntityMaster.Tables[0].Rows[i]["Effective_To"].ToString() + "</td>");
                        sb.Append("<td id='Row_Status" + i + "'>" + dsExpenseEntityMaster.Tables[0].Rows[i]["Row_Status"].ToString() + "</td></tr>");
                    }
                }

                else
                {
                    sb.Append("<tr><td>No records To Display</td></tr>");
                }

                sb.Append("</body>");
                sb.Append("</table>");
                return sb.ToString();

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:companyCode", companyCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return ex.Message.ToString();
            }
        }

        /// <summary>
        /// DownLoad The ExpenseEntityMasterDetails into Excel
        /// </summary>
        /// <returns></returns>
        public void PutExpenseEntityMasterIntoExcel()
        {
            string error = string.Empty;
            try
            {
                string companyCode = _objcurrentInfo.GetCompanyCode();
                DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();
                DataControl.Abstraction.IFileProvider objProvider = new DataControl.Impl.FileSystemProvider();
                BLMaster Master = new BLMaster();
                DataSet dsExpenseEntityMaster = new DataSet();
                dsExpenseEntityMaster = Master.GetExpenseEntityMaster(companyCode);

                StringBuilder sb = new StringBuilder();
                sb.Append("<table WIDTH='75%' id='tblsummary' class='table table-striped' >");
                sb.Append("<thead class='active'>");
                sb.Append("<tr style='background-color:#428bca;'>");               
                sb.Append("<td>Entity Name</td>");
                sb.Append("<td>Effective From</td>");
                sb.Append("<td>Effective To</td>");
                sb.Append("<td>Status</td>");
                sb.Append("</tr>");
                sb.Append("</thead>");
                sb.Append("<tbody>");

                if (dsExpenseEntityMaster != null && dsExpenseEntityMaster.Tables[0] != null && dsExpenseEntityMaster.Tables[0].Rows.Count > 0)
                {
                    for (int i = 0; i < dsExpenseEntityMaster.Tables[0].Rows.Count; i++)
                    {                       
                        sb.Append("<td id='Expense_Entity_Name" + i + "'  style='text-align:left;'>" + dsExpenseEntityMaster.Tables[0].Rows[i]["Expense_Entity_Name"] + "</td>");
                        sb.Append("<td id='Effective_From" + i + "'  style='text-align:left;'>" + dsExpenseEntityMaster.Tables[0].Rows[i]["Effective_From"] + "</td>");
                        sb.Append("<td id='Effective_To" + i + "'  style='text-align:left;'>" + dsExpenseEntityMaster.Tables[0].Rows[i]["Effective_To"] + "</td>");
                        sb.Append("<td id='Row_Status" + i + "'  style='text-align:left;'>" + dsExpenseEntityMaster.Tables[0].Rows[i]["Row_Status"] + "</td></tr>");
                    }
                }

                else
                {
                    sb.Append("<tr><td>No records To Display</td></tr>");
                }

                sb.Append("</body>");
                sb.Append("</table>");
                

                DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");

                string userName = _objcurrentInfo.GetUserName();
                string subdomainName = System.Web.HttpContext.Current.Request.Url.DnsSafeHost; ;

                string fileName = "ExpenseEntityMaster" + " - " + subdomainName + " - " + userName + ".xls";
                string blobUrl = objAzureBlob.AzureBlobUploadText(sb.ToString(), accKey, fileName, "bulkdatasvc");

                objFileDownload.DownloadFile(blobUrl, fileName, out error);

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
            }
        }
        /// <summary>
        /// Insert and Update
        /// </summary>
        /// <param name="ExpenseEntityName"></param>
        /// <param name="EffectiveFrom"></param>
        /// <param name="EffectiveTo"></param>
        /// <param name="ExpenseEntityCodeval"></param>
        /// <param name="Mode"></param>
        /// <returns></returns>
        public int InsertandUpdateTheExpenseEntityMaster(string ExpenseEntityName,string EffectiveFrom, string EffectiveTo, string ExpenseEntityCodeval,string Mode)
        {
            string companyCode = _objcurrentInfo.GetCompanyCode();
            try
            {
                string data = string.Empty;
                BLMaster Master = new BLMaster();

                if (Mode.ToUpper() == "I") //Insert Data
                {
                    string ExpenseEntityCode = _objData.GetMaxCode(_objcurrentInfo.GetCompanyCode(), "tbl_SFA_Expense_Entity_Master", "Expense_Entity_Code", "EEC");
                    string status = "1";
                    int InsertExpenseEntityMaster = Master.InsertExpenseEntityMaster(companyCode, ExpenseEntityCode, ExpenseEntityName, EffectiveFrom, EffectiveTo, status, _objcurrentInfo.GetUserName(), DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff"));
                    return InsertExpenseEntityMaster;
                }
                else
                {
                    int UpdateExpenseEntityMaster = Master.UpdateExpenseEntityMaster(companyCode, ExpenseEntityCodeval, ExpenseEntityName, EffectiveFrom, EffectiveTo, _objcurrentInfo.GetUserName(), DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff"));
                    return UpdateExpenseEntityMaster;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:ExpenseEntityName", ExpenseEntityName);
                dicContext.Add("Filter:ExpenseEntityCodeval", ExpenseEntityCodeval);
                dicContext.Add("Filter:EffectiveFrom", EffectiveFrom);
                dicContext.Add("Filter:EffectiveTo", EffectiveTo);
                dicContext.Add("Filter:Mode", Mode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return 3;
            }
        }


        /// <summary>
        /// Changestatus
        /// </summary>
        /// <param name="status"></param>
        /// <param name="ExpenseEntityCode"></param>
        /// <returns></returns>
        public bool ChangeStausforExpenseEntity(string status, string ExpenseEntityCode)
        {
            string Docstatus = string.Empty;
            string companyCode = _objcurrentInfo.GetCompanyCode();
            bool changeResult = false;
            try
            {
                Docstatus = status.ToUpper() == "ENABLED" ? "1" : "0"; //1 is enabled,0 is Disabled
                BLMaster Master = new BLMaster();
                Master.ChangeStatusforExpenseEntityMaster(companyCode, ExpenseEntityCode, Docstatus);
                changeResult = true;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:companyCode", companyCode);
                dicContext.Add("Filter:status", status);
                dicContext.Add("Filter:activityCode", ExpenseEntityCode);
                changeResult = false;
            }
            return changeResult;
        }


    }
}
