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
    public class DoctorCategoryMasterController : Controller
    {
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        private SPData _objSPData = new SPData();
        DataControl.Data _objData = new DataControl.Data();

        #region "Doctorcategory Master Public Methods"

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Create()
        {
            return View();
        }

        /// <summary>
        /// Method is Used to get doctor category Details
        /// </summary>
        /// <returns></returns>
        private IEnumerable<MVCModels.HiDoctor_Master.DoctorModel> GetdoctorcategoryDetails()
        {
            try
            {
                MVCModels.HiDoctor_Master.DoctorModel objdoctoecategorymodel = new MVCModels.HiDoctor_Master.DoctorModel();
                objdoctoecategorymodel.Company_Code = _objcurrentInfo.GetCompanyCode();
                BLMaster objMaster = new BLMaster();
                return objMaster.GetdoctorCategoryDetails(objdoctoecategorymodel);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }

        }

        /// <summary>
        /// Method to bind the data with HtmDoctorcategoryMaster Table
        /// </summary>
        /// <returns></returns>
        public string GetDoctorCatgegory()
        {
            string companycode = _objcurrentInfo.GetCompanyCode();
            try
            {
                BLMaster _objmaster = new BLMaster();
                List<MVCModels.HiDoctor_Master.DoctorModel> lstdoctcategory = (List<MVCModels.HiDoctor_Master.DoctorModel>)GetdoctorcategoryDetails();

                //dsc
                StringBuilder sb = new StringBuilder();
                sb.Append("<table WIDTH='100%' id='tblsummary' class='table table-striped' >");
                sb.Append("<thead class='active'>");
                sb.Append("<tr style='background-color:#428bca;'>");
                sb.Append("<td>Edit</td>");
                sb.Append("<td>Change Status</td>");
                sb.Append("<td>Doctor Category Name</td>");
                sb.Append("<td>Visit Count</td>");
                sb.Append("<td>Doctor Count</td>");
                sb.Append("<td>Division Name</td>");
                sb.Append("<td>Effective From</td>");
                sb.Append("<td>Effective To</td>");
                sb.Append("<td>Status</td>");
                sb.Append("</tr>");
                sb.Append("</thead>");
                sb.Append("<tbody>");
                //
                if (lstdoctcategory != null && lstdoctcategory.Count > 0)
                {
                    int i = 0;
                    foreach (var lstdoc in lstdoctcategory)
                    {
                        i++;
                        sb.Append("<tr><td class='td-a'><a id='E" + i + "' onclick='fnEdit(this)'>Edit</a></td>");
                        sb.Append("<td class='td-a'><a id='C" + i + "' onclick='fnchangeStatus(this)'>Change Status</a></td>");
                        sb.Append("<td style='display:none' id='Category_Code" + i + "'>" + lstdoc.Category_Code + "</td>");
                        sb.Append("<td id='Category_Name" + i + "'>" + lstdoc.Category_Name + "</td>");
                        sb.Append("<td id='Visit_Count" + i + "'>" + lstdoc.Visit_Count+ "</td>");
                        sb.Append("<td id='Doctor_Count" + i + "'>" + lstdoc.Doctor_Count + "</td>");
                        sb.Append("<td style='display:none' id='Division_Code" + i + "'>" + lstdoc.Division_Code + "</td>");
                        sb.Append("<td id='Division_Name" + i + "'>" + lstdoc.Division_Name + "</td>");
                        sb.Append("<td id='Effective_From" + i + "'>" + lstdoc.Effective_From + "</td>");
                        sb.Append("<td id='Effective_To" + i + "'>" + lstdoc.Effective_To + "</td>");
                        sb.Append("<td id='Status" + i + "'>" + lstdoc.Status + "</td></tr>");
                    }
                }
                sb.Append("</tbody>");
                sb.Append("</table>");
                return sb.ToString();
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return ex.Message.ToString();
            }
        }

        /// <summary>
        /// Method is used to download the Doctorcategory into Excel
        /// </summary>
        /// <returns></returns>
        public void PutDoctorcategoryIntoExcel()
        {
            string companycode = _objcurrentInfo.GetCompanyCode();
            string error = string.Empty;
            try
            {
                BLMaster _objmaster = new BLMaster();
                List<MVCModels.HiDoctor_Master.DoctorModel> lstdoctcategory = (List<MVCModels.HiDoctor_Master.DoctorModel>)GetdoctorcategoryDetails();
                DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();
                DataControl.Abstraction.IFileProvider objProvider = new DataControl.Impl.FileSystemProvider();
                //dsc
                StringBuilder sb = new StringBuilder();
                sb.Append("<table WIDTH='100%' id='tblsummary' class='table table-striped' >");
                sb.Append("<thead class='active'>");
                sb.Append("<tr style='background-color:#428bca;'>");               
                sb.Append("<td>Doctor Category Name</td>");
                sb.Append("<td>Visit Count</td>");
                sb.Append("<td>Doctor Count</td>");
                sb.Append("<td>Division Name</td>");
                sb.Append("<td>Effective From</td>");
                sb.Append("<td>Effective To</td>");
                sb.Append("<td>Status</td>");
                sb.Append("</tr>");
                sb.Append("</thead>");
                sb.Append("<tbody>");
                //
                if (lstdoctcategory != null && lstdoctcategory.Count > 0)
                {
                    int i = 0;
                    foreach (var lstdoc in lstdoctcategory)
                    {
                        i++;
                        sb.Append("<tr><td id='Category_Name" + i + "' style='text-align:left;'>" + lstdoc.Category_Name + "</td>");
                        sb.Append("<td id='Visit_Count" + i + "' style='text-align:left;'>" + lstdoc.Visit_Count + "</td>");
                        sb.Append("<td id='Doctor_Count" + i + "' style='text-align:left;' >" + lstdoc.Doctor_Count + "</td>");
                        sb.Append("<td id='Division_Name" + i + "' style='text-align:left;' >" + lstdoc.Division_Name + "</td>");
                        sb.Append("<td id='Effective_From" + i + "' style='text-align:left;' >" + lstdoc.Effective_From + "</td>");
                        sb.Append("<td id='Effective_To" + i + "' style='text-align:left;' >" + lstdoc.Effective_To + "</td>");
                        sb.Append("<td id='status" + i + "' style='text-align:left;'>" + lstdoc.Status + "</td></tr>");
                    }
                }
                sb.Append("</tbody>");
                sb.Append("</table>");
                DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");

                string userName = _objcurrentInfo.GetUserName();
                string subdomainName = System.Web.HttpContext.Current.Request.Url.DnsSafeHost; ;

                string fileName = "DoctorCategoryMaster" + " - " + subdomainName + " - " + userName + ".xls";
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
        /// Get DivisionName
        /// </summary>
        /// <returns></returns>
        public JsonResult GetDivisionName()
        {
            try
            {
                BLMaster objMaster = new BLMaster();
                MVCModels.HiDoctor_Master.DoctorModel objDivisonName = new MVCModels.HiDoctor_Master.DoctorModel();
                objDivisonName.Company_Code = _objcurrentInfo.GetCompanyCode();
                IEnumerable<MVCModels.HiDoctor_Master.DoctorModel> lstdivisonName = objMaster.GetDivisionName(objDivisonName);

                var DivisionList = (from division in lstdivisonName.AsEnumerable()
                                    select new MVCModels.HiDoctor_Master.DoctorModel()
                                    {
                                        Division_Name = division.Division_Name.ToString(),
                                        Division_Code = division.Division_Code.ToString()
                                    }).ToList<MVCModels.HiDoctor_Master.DoctorModel>();
                return Json(DivisionList);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
        }

        /// <summary>
        /// Change status
        /// </summary>
        /// <param name="status"></param>
        /// <param name="domainCode"></param>
        /// <returns></returns>
        public bool ChangestatusforDoctorCategoryMaster(string status, string doctorCategoryCode)
        {
            string doctorStatus = string.Empty;
            bool changeResult = false;
            try
            {
                doctorStatus = status.ToUpper() == "ENABLED" ? "1" : "0"; //1 is Enable, 0 is Disable
                BLMaster Master = new BLMaster();
                string companyCode = _objcurrentInfo.GetCompanyCode();
                string changestatus = Master.ChangestatusforDoctorCategoryMaster(doctorStatus, doctorCategoryCode, companyCode);
                changeResult = true;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:status", status);
                dicContext.Add("Filter:domainCode", doctorCategoryCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                changeResult = false;
            }
            return changeResult;
        }

        public int InsertandUpdateforDoctorcategoryMaster(string CategoryName, string VisitCount, string DoctorCount, string divisionCode, string EffectiveFrom, string EffectiveTo,
                                                   string mode, string Doccategotycodeval)
        {
            try
            {
                BLMaster Master = new BLMaster();
                MVCModels.HiDoctor_Master.DoctorModel objdoctorcategoryModel = new MVCModels.HiDoctor_Master.DoctorModel();
                List<MVCModels.HiDoctor_Master.DoctorModel> lstdoctorcategoryModel = new List<MVCModels.HiDoctor_Master.DoctorModel>();
                if (mode.ToUpper() == "I") // Insert Data
                {
                    objdoctorcategoryModel.Company_Code = _objcurrentInfo.GetCompanyCode();
                    objdoctorcategoryModel.Category_Name = CategoryName;
                    if (string.IsNullOrEmpty(DoctorCount))
                    {
                        DoctorCount = "0";
                    }
                    objdoctorcategoryModel.Doctor_Count = DoctorCount;
                    objdoctorcategoryModel.Visit_Count = VisitCount;                    
                    objdoctorcategoryModel.Effective_From = EffectiveFrom;
                    objdoctorcategoryModel.Effective_To = EffectiveTo;
                    objdoctorcategoryModel.Status = "1";
                    objdoctorcategoryModel.Division_Code = divisionCode;
                    objdoctorcategoryModel.Created_By = _objcurrentInfo.GetUserName();
                    objdoctorcategoryModel.Created_Date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff");
                    lstdoctorcategoryModel.Add(objdoctorcategoryModel);
                    int result = Master.InsertforDoctorCategoryMaster(lstdoctorcategoryModel);
                    return result;
                }
                else
                {
                    objdoctorcategoryModel.Company_Code = _objcurrentInfo.GetCompanyCode();
                    objdoctorcategoryModel.Category_Code = Doccategotycodeval;
                    objdoctorcategoryModel.Category_Name = CategoryName;
                    objdoctorcategoryModel.Effective_From = EffectiveFrom;
                    objdoctorcategoryModel.Effective_To = EffectiveTo;
                    objdoctorcategoryModel.Visit_Count = VisitCount;
                    if (string.IsNullOrEmpty(DoctorCount))
                    {
                        DoctorCount = "0";
                    }
                    objdoctorcategoryModel.Doctor_Count = DoctorCount;
                    objdoctorcategoryModel.Division_Code = divisionCode;
                    objdoctorcategoryModel.Updated_By = _objcurrentInfo.GetUserName();
                    objdoctorcategoryModel.Updated_Date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss:fff");
                    lstdoctorcategoryModel.Add(objdoctorcategoryModel);
                    int result = Master.UpdateforDoctorcategoryMaster(lstdoctorcategoryModel);
                    return result;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("Filter:CategoryName", CategoryName);
                dicContext.Add("Filter:VisitCount", VisitCount);
                dicContext.Add("Filter:DoctorCount", DoctorCount);
                dicContext.Add("Filter:mode", mode);
                dicContext.Add("Filter:EffectiveFrom", EffectiveFrom);
                dicContext.Add("Filter:EffectiveTo", EffectiveTo);
                dicContext.Add("Filter:Doccategotycodeval", Doccategotycodeval);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return 0;
            }
        }
        #endregion "Doctorcategory Master Public Methods"

    }
}
