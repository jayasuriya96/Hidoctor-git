using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using DataControl;

namespace HiDoctor_Activity.Controllers
{
    [AjaxSessionActionFilter]
    public class CampaignPlannerController : Controller
    {
        //
        // GET: /CampaignPlanner/
        DataControl.JSONConverter _objJson = new DataControl.JSONConverter();
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetExpenseEntity()
        {
            DataControl.BLCampaignPlanner _objBlCP = new DataControl.BLCampaignPlanner();
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            List<MVCModels.ExpenseEntity> lstExpEntity = new List<MVCModels.ExpenseEntity>();
            lstExpEntity = _objBlCP.GetExpenseEntity(_objCurInfo.GetCompanyCode());
            return Json(_objJson.Serialize(lstExpEntity));
        }
        public JsonResult GetSFC(string regionCode)
        {
            DataControl.BLCampaignPlanner _objBlCP = new DataControl.BLCampaignPlanner();
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            List<MVCModels.SFC> lstSFC = new List<MVCModels.SFC>();
            lstSFC = _objBlCP.GetSFC(_objCurInfo.GetCompanyCode(), regionCode);
            return Json(_objJson.Serialize(lstSFC));
        }
        public JsonResult GetApprovedDoctorsByRegion(string regionCode)
        {
            DataControl.BLCampaignPlanner _objBlCP = new DataControl.BLCampaignPlanner();
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            List<MVCModels.HiDoctor_Master.DoctorModel> lstDoctor = new List<MVCModels.HiDoctor_Master.DoctorModel>();
            lstDoctor = _objBlCP.GetApprovedDoctorsByRegion(_objCurInfo.GetCompanyCode(), regionCode);
            return Json(_objJson.Serialize(lstDoctor));
        }

        public string GetCPDetails(string regionCode)
        {
            string blobUrl = string.Empty;
            DataControl.BLCampaignPlanner _objBlCP = new DataControl.BLCampaignPlanner();
            DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
            StringBuilder strContent = new StringBuilder();
            DataSet ds = new DataSet();
            try
            {
                ds = _objBlCP.GetCPDetails(_objCurInfo.GetCompanyCode(), regionCode);
                strContent.Append("<table class='table table-striped'>");
                strContent.Append("<thead><tr><td>Edit</td><td>CP Name</td><td>Status</td> <td>Category Name</td>");
                strContent.Append("<td>Work Area</td><td>Place From</td> <td>Place To</td><td>SFC Category</td>");
                strContent.Append("<td >Distance</td><td>Fare</td><td >Travel Mode</td>");
                strContent.Append("<td>Doctor Name</td>");//<td>MDL/SVL No</td>");
                strContent.Append("<td>Unapprove Reason</td></tr></thead><tbody>");
                if (ds.Tables.Count > 0)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {

                        for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                        {
                            string cpCode = Convert.ToString(ds.Tables[0].Rows[i]["CP_Code"]);
                            DataRow[] drHop = ds.Tables[1].AsEnumerable().Where(a => Convert.ToString(a["CP_Code"]) == cpCode).ToArray();
                            DataRow[] drDoctors = ds.Tables[2].AsEnumerable().Where(a => Convert.ToString(a["CP_Code"]) == cpCode).ToArray();
                            #region cp details
                            //StringBuilder strWorkArea = new StringBuilder();
                            StringBuilder strFromPlace = new StringBuilder();
                            StringBuilder strToPlace = new StringBuilder();
                            StringBuilder strSFCCategory = new StringBuilder();
                            StringBuilder strDistance = new StringBuilder();
                            StringBuilder strTravelMode = new StringBuilder();
                            StringBuilder strFare = new StringBuilder();
                            // strWorkArea.Append("<table>");
                            strFromPlace.Append("<table>");
                            strToPlace.Append("<table>");
                            strSFCCategory.Append("<table>");
                            strDistance.Append("<table>");
                            strTravelMode.Append("<table>");
                            strFare.Append("<table>");
                            if (drHop.Length > 0)
                            {
                                for (int j = 0; j < drHop.Length; j++)
                                {
                                    //strWorkArea.Append("<tr><td>" + drHop[j]["Work_Place"] + "</td></tr>");
                                    if (drHop[j]["Route_Way"].ToString() == "D")
                                    {
                                        strFromPlace.Append("<tr><td>" + drHop[j]["From_Place"] + "</td></tr>");
                                        strToPlace.Append("<tr><td>" + drHop[j]["To_Place"] + "</td></tr>");
                                        strSFCCategory.Append("<tr><td>" + drHop[j]["SFC_Category_Name"] + "</td></tr>");
                                    }
                                    else
                                    {
                                        strFromPlace.Append("<tr><td>" + drHop[j]["To_Place"] + "</td></tr>");
                                        strToPlace.Append("<tr><td>" + drHop[j]["From_Place"] + "</td></tr>");
                                        strSFCCategory.Append("<tr><td>" + drHop[j]["SFC_Category_Name"] + "</td></tr>");
                                    }
                                    strDistance.Append("<tr><td>" + drHop[j]["Distance"] + "</td></tr>");
                                    strTravelMode.Append("<tr><td>" + drHop[j]["Travel_Mode"] + "</td></tr>");
                                    strFare.Append("<tr><td>" + drHop[j]["Amount"] + "</td></tr>");

                                }
                            }
                            else
                            {
                                // strWorkArea.Append("<tr><td>" + ds.Tables[0].Rows[i]["Work_Area"] + "</td></tr>");
                                if (ds.Tables[0].Rows[i]["Route_Way"].ToString() == "D")
                                {
                                    strFromPlace.Append("<tr><td>" + ds.Tables[0].Rows[i]["Place_From"] + "</td></tr>");
                                    strToPlace.Append("<tr><td>" + ds.Tables[0].Rows[i]["Place_To"] + "</td></tr>");
                                    strSFCCategory.Append("<tr><td>" + ds.Tables[0].Rows[i]["SFC_Category_Name"] + "</td></tr>");
                                }
                                else
                                {
                                    strFromPlace.Append("<tr><td>" + ds.Tables[0].Rows[i]["Place_To"] + "</td></tr>");
                                    strToPlace.Append("<tr><td>" + ds.Tables[0].Rows[i]["Place_From"] + "</td></tr>");
                                    strSFCCategory.Append("<tr><td>" + ds.Tables[0].Rows[i]["SFC_Category_Name"] + "</td></tr>");
                                }
                                strDistance.Append("<tr><td>" + ds.Tables[0].Rows[i]["Distance"] + "</td></tr>");
                                strTravelMode.Append("<tr><td>" + ds.Tables[0].Rows[i]["Travel_Mode"] + "</td></tr>");
                                strFare.Append("<tr><td>" + ds.Tables[0].Rows[i]["Fare_Amount"] + "</td></tr>");
                            }
                            //strWorkArea.Append("</table>");
                            strFromPlace.Append("</table>");
                            strToPlace.Append("</table>");
                            strSFCCategory.Append("</table>");
                            strDistance.Append("</table>");
                            strTravelMode.Append("</table>");
                            strFare.Append("</table>");
                            #endregion cp details
                            #region cp doctor details
                            StringBuilder strDoctorName = new StringBuilder();
                            if (drDoctors.Length > 0)
                            {
                                foreach (DataRow drr in drDoctors)
                                {
                                    if (drr["Qualification"] != "")
                                    {
                                        strDoctorName.Append(drr["Customer_Name"] + "_" + drr["MDL_Number"] + "_" + drr["Speciality_Name"] + "_" + drr["Qualification"] + "</br>");
                                    }
                                    else
                                    {
                                        strDoctorName.Append(drr["Customer_Name"] + "_" + drr["MDL_Number"] + "_" + drr["Speciality_Name"] + "</br>");
                                    }
                                }
                            }
                            #endregion cp doctor details
                            if (Convert.ToString(ds.Tables[0].Rows[i]["Status"]).ToUpper() == "APPROVED")
                            {
                                strContent.Append("<tr><td></td>");
                            }
                            else
                            {
                                strContent.Append("<tr><td><a onclick='fnEditCPDetails(\"" + cpCode + "\");'>Edit</a></td>");
                            }
                            strContent.Append("<td>" + Convert.ToString(ds.Tables[0].Rows[i]["CP_Name"]) + "</td>");
                            strContent.Append("<td>" + Convert.ToString(ds.Tables[0].Rows[i]["Status"]) + "</td>");
                            strContent.Append("<td>" + Convert.ToString(ds.Tables[0].Rows[i]["Expense_Entity_Name"]) + "</td>");
                            // strContent.Append("<td>" + Convert.ToString(strWorkArea) + "</td>");
                            strContent.Append("<td>" + Convert.ToString(ds.Tables[0].Rows[i]["Work_Area"]) + "</td>");
                            strContent.Append("<td>" + Convert.ToString(strFromPlace) + "</td>");
                            strContent.Append("<td>" + Convert.ToString(strToPlace) + "</td>");
                            strContent.Append("<td>" + Convert.ToString(strSFCCategory) + "</td>");
                            strContent.Append("<td>" + Convert.ToString(strDistance) + "</td>");
                            strContent.Append("<td>" + Convert.ToString(strFare) + "</td>");
                            strContent.Append("<td>" + Convert.ToString(strTravelMode) + "</td>");
                            strContent.Append("<td>" + Convert.ToString(strDoctorName) + "</td>");
                            strContent.Append("<td>" + Convert.ToString(ds.Tables[0].Rows[i]["Unapprove_Reason"]) + "</td></tr>");
                        }

                    }

                }
                strContent.Append("</tbody></table>");
                MasterController objMaster = new MasterController();
                string compCode = _objCurInfo.GetCompanyCode();
                DataSet dsUser = null;
                string userName = string.Empty;
                dsUser = new DataSet();
                dsUser = objMaster.GetRegionWiseUser(compCode, regionCode);
                if (dsUser != null && dsUser.Tables[0].Rows.Count>0)
                {
                    userName = dsUser.Tables[0].Rows[0]["User_Name"].ToString();
                }
                else
                {
                    userName = _objCurInfo.GetUserName();
                }
                DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                string fileName = "CampaignPlanner_" + "_" + compCode + "_" + userName + ".xls";
                blobUrl = objAzureBlob.AzureBlobUploadText(strContent.ToString(), accKey, fileName, "bulkdatasvc");
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("regionCode", regionCode);
                dicObj.Add("strContent", strContent.ToString());
                dicObj.Add("blobUrl", blobUrl);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return strContent.ToString() + "$" + _objJson.Serialize(ds) + "^" + blobUrl;
        }
        public int InsertCampaignPlanner(string regionCode, string regionName, string cpName, string categoryCode, string categoryName,
                       string sfcDetails, string doctorDetails, string Mode, string CPCode, string workArea, string CPStatus, string EditPrivilege)
        {
            int rowsAffected = 0;
            try
            {
                DataControl.CurrentInfo _objCurInfo = new DataControl.CurrentInfo();
                DataControl.BLCampaignPlanner _objBlCP = new DataControl.BLCampaignPlanner();
                rowsAffected = _objBlCP.InsertCampaignPlanner(_objCurInfo.GetCompanyCode(), regionCode, regionName, cpName, categoryCode,
                    categoryName, sfcDetails, doctorDetails,
                    Mode, CPCode, _objCurInfo.GetUserName(), workArea, CPStatus, EditPrivilege);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("regionCode", regionCode);
                dicObj.Add("regionName", regionName);
                dicObj.Add("cpName", cpName);
                dicObj.Add("categoryCode", categoryCode);
                dicObj.Add("categoryName", categoryName);
                dicObj.Add("sfcDetails", sfcDetails);
                dicObj.Add("doctorDetails", doctorDetails);
                dicObj.Add("Mode", Mode);
                dicObj.Add("CPCode", CPCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return rowsAffected;
        }

        public JsonResult GetRegionWiseUser(string regionCode)
        {
            DataSet ds = null;
            ds = new DataSet();
            CurrentInfo objCurInfo = new CurrentInfo();
            MasterController objMaster = new MasterController();
            ds = objMaster.GetRegionWiseUser(objCurInfo.GetCompanyCode(), regionCode);
            JSONConverter objJson = new JSONConverter();
            return Json(objJson.Serialize(ds), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetModifiedCPSFCDetails(string regionCode, string cpCode)
        {
            DataSet ds = new DataSet();
            CurrentInfo objCurInfo = new CurrentInfo();
            BLCampaignPlanner objCP = new BLCampaignPlanner();
            ds = objCP.GetModifiedCPSFCDetails(objCurInfo.GetCompanyCode(), regionCode, cpCode);
            JSONConverter objJson = new JSONConverter();
            return Json(objJson.Serialize(ds), JsonRequestBehavior.AllowGet);
        }
    }
}
