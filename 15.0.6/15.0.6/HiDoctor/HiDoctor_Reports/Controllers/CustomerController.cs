using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataControl;
using System.Text;

namespace HiDoctor_Reports.Controllers
{

    [AjaxSessionActionFilter]
    public class CustomerController : Controller
    {
        //
        // GET: /Customer/

        public ActionResult Index()
        {
            return View();
        }

        public string GetShareAllocationReport(string months, string year, string isExcel, string regionCodes, string Mode, string SelectedMonth)
        {
            StringBuilder strContent = new StringBuilder();
            CurrentInfo objCurInfo = new CurrentInfo();
            strContent.Append("<table class='table table-striped'><thead><tr><td rowspan='2'>User Name</td>");
            strContent.Append("<td rowspan='2'>Employee Name</td><td rowspan='2'>Employee No</td>");
            strContent.Append("<td rowspan='2'>Region Name</td><td rowspan='2'>Reporting Region Name</td>");
            strContent.Append("<td colspan='3'>Secondary Sales</td><td colspan='2'>Primary Sales</td>");
            strContent.Append("<td colspan='2'>Target</td></tr>");
            strContent.Append("<tr><td>Current Month</td><td>Variation</td><td>Previous Month</td>");
            strContent.Append("<td>Variation</td><td>Current Month</td>");
            strContent.Append("<td>Variation</td><td>Current Month</td></tr></thead><tbody>");
            try
            {
                DataControl.HiDoctor_ReportsFactoryClasses.DAL_ReportRegion objRegion = new DataControl.HiDoctor_ReportsFactoryClasses.DAL_ReportRegion();
                string previousMonth = string.Empty;
                string previousYear = string.Empty;
                if (Mode == "M")
                {
                    previousMonth = Convert.ToString(Convert.ToDateTime(year + "-" + months + "-01").AddMonths(-1).Month) + ",";
                    previousYear = Convert.ToString(Convert.ToDateTime(year + "-" + months + "-01").AddMonths(-1).Year);
                }
                else
                {
                    DateTime previousdate = Convert.ToDateTime(SelectedMonth.Split('-')[0] + "-"
                                        + SelectedMonth.Split('-')[1].Split('_')[0] + "-01");
                    previousMonth = Convert.ToString(previousdate.AddMonths(-3).Month) + "," + Convert.ToString(previousdate.AddMonths(-2).Month) + "," +
                                        Convert.ToString(previousdate.AddMonths(-1).Month + ",");
                    previousYear = Convert.ToString(previousdate.Year);
                }
                List<MVCModels.HiDoctor_Master.StockistShare> lstPreviousMonthShare = new List<MVCModels.HiDoctor_Master.StockistShare>();
                lstPreviousMonthShare = (List<MVCModels.HiDoctor_Master.StockistShare>)objRegion.GetStockistShareAllocation(objCurInfo.GetCompanyCode(),
                    previousMonth, previousYear, regionCodes);

                List<MVCModels.HiDoctor_Master.StockistShare> lstCurrentMonthShare = new List<MVCModels.HiDoctor_Master.StockistShare>();
                lstCurrentMonthShare = (List<MVCModels.HiDoctor_Master.StockistShare>)objRegion.GetStockistShareAllocation(objCurInfo.GetCompanyCode(),
                    months, year, regionCodes);

                var lstDisUsers = lstPreviousMonthShare.Concat(lstCurrentMonthShare).AsEnumerable().Select(a => a.User_Code).Distinct();



                foreach (string userCode in lstDisUsers)
                {
                    strContent.Append("<tr>");
                    var userDetails = lstPreviousMonthShare.AsEnumerable().Where(z => z.User_Code == Convert.ToString(userCode)).ToList();
                    if (userDetails.Count == 0)
                    {
                        userDetails = lstCurrentMonthShare.AsEnumerable().Where(z => z.User_Code == Convert.ToString(userCode)).ToList();
                    }
                    strContent.Append("<td>" + userDetails[0].User_Name + "</td>");
                    strContent.Append("<td>" + userDetails[0].Employee_Name + "</td>");
                    strContent.Append("<td>" + userDetails[0].Employee_Number + "</td>");
                    strContent.Append("<td>" + userDetails[0].Region_Name + "</td>");
                    strContent.Append("<td>" + userDetails[0].Reporting_Region_Name + "</td>");
                    double currentSecShare = 0;
                    double previousSecShare = 0;
                    double curPriShare = 0;
                    double curTargetShare = 0;
                    #region secondary sales
                    var lstCurrentMonth = lstCurrentMonthShare.AsEnumerable().Where(c => c.User_Code == Convert.ToString(userCode)).ToList();
                    if (lstCurrentMonth.Count > 0)
                    {
                        currentSecShare = Convert.ToDouble(lstCurrentMonth[0].SS_Value);
                        curPriShare = Convert.ToDouble(lstCurrentMonth[0].PS_Value);
                        curTargetShare = Convert.ToDouble(lstCurrentMonth[0].Target_Value);
                    }
                    var lstPreviousMonth = lstPreviousMonthShare.AsEnumerable().Where(c => c.User_Code == Convert.ToString(userCode)).ToList();
                    if (lstPreviousMonth.Count > 0)
                    {
                        previousSecShare = Convert.ToDouble(lstPreviousMonth[0].SS_Value);
                    }
                    double secVariation = 0;
                    strContent.Append("<td>" + currentSecShare + "</td>");
                    strContent.Append("<td>");
                    if (previousSecShare > 0)
                    {
                        secVariation = ((currentSecShare - previousSecShare) / previousSecShare) * 100;
                        if (secVariation > 0)
                        {
                            if (secVariation > 100)
                            {
                                strContent.Append("<div class='dvPositive' style='width:100% !important'>" + Math.Round(secVariation, 0) + "</div>");
                            }
                            else
                            {
                                strContent.Append("<div class='dvPositive' style='width:" + Math.Round(secVariation, 0)
                                  + "% !important'>" + Math.Round(secVariation, 0) + "</div>");
                            }
                        }
                        else
                        {
                            strContent.Append("<div class='dvNegative' style='width:" + Math.Round((secVariation * -1), 0)
                              + "% !important'>" + Math.Round(secVariation, 0) + "</div>");
                        }
                    }
                    else
                    {
                        strContent.Append("<div>NA</div>");
                    }
                    strContent.Append("</td>");
                    strContent.Append("<td>" + previousSecShare + "</td>");
                    #endregion secondary sales
                    #region primary sales
                    double priVariation = 0;
                    strContent.Append("<td>");
                    if (curPriShare > 0)
                    {
                        priVariation = ((currentSecShare - curPriShare) / curPriShare) * 100;
                        if (priVariation > 0)
                        {
                            if (priVariation > 100)
                            {
                                strContent.Append("<div class='dvPositive' style='width:100% !important'>" + Math.Round(priVariation, 0) + "</div>");
                            }
                            else
                            {
                                strContent.Append("<div class='dvPositive' style='width:" + Math.Round(priVariation, 0)
                                    + "% !important'>" + Math.Round(priVariation, 0) + "</div>");
                            }
                        }
                        else
                        {
                            strContent.Append("<div class='dvNegative' style='width:" + Math.Round(priVariation, 0)
                           + "% !important'>" + Math.Round(priVariation, 0) + "</div>");
                        }
                    }
                    else
                    {
                        strContent.Append("<div>NA</div>");
                    }

                    strContent.Append("</td>");
                    strContent.Append("<td>" + curPriShare + "</td>");
                    #endregion primary sales
                    #region target
                    double tarVariation = 0;
                    strContent.Append("<td>");
                    if (curTargetShare > 0)
                    {
                        tarVariation = ((currentSecShare - curTargetShare) / curTargetShare) * 100;
                        if (tarVariation > 0)
                        {
                            if (tarVariation > 100)
                            {
                                strContent.Append("<div class='dvPositive' style='width:100% !important'>" + Math.Round(tarVariation, 0) + "</div>");
                            }
                            else
                            {
                                strContent.Append("<div class='dvPositive' style='width:" + Math.Round(tarVariation, 0)
                                 + "% !important'>" + Math.Round(tarVariation, 0) + "</div>");
                            }
                        }
                        else
                        {
                            strContent.Append("<div class='dvNegative' style='width:" + Math.Round(tarVariation, 0)
                        + "% !important'>" + Math.Round(tarVariation, 0) + "</div>");
                        }
                    }
                    else
                    {
                        strContent.Append("<div>NA</div>");
                    }
                    strContent.Append("</td>");
                    strContent.Append("<td>" + curTargetShare + "</td>");
                    #endregion target
                    strContent.Append("</tr>");
                }

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                //  return "";
            }
            strContent.Append("</tbody></table>");

            string blobUrl = string.Empty;
            if ("Y" == isExcel)
            {
                DataControl.Abstraction.IConfigProvider iConfigPro = new DataControl.Impl.ConfigProvider();
                DataControl.Repository.AzureBlobUpload objAzureBlob = new DataControl.Repository.AzureBlobUpload();
                string accKey = iConfigPro.GetConfigValue("SWAASBLOBACCKEY");
                string userName = objCurInfo.GetUserName();
                string compCode = objCurInfo.GetCompanyCode();
                string fileName = "SHAREALLOCATIONREPORT_" + "_" + compCode + "_" + userName + ".xls";
                blobUrl = objAzureBlob.AzureBlobUploadText(strContent.ToString(), accKey, fileName, "bulkdatasvc");
                strContent.Clear();
                strContent.Append(blobUrl);
            }
            return strContent.ToString();
        }
    }
}
