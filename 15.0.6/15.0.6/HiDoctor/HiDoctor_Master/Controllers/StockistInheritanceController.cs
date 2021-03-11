using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Data;
using MVCModels;
using DataControl.HD_MasterFactoryClasses;
using System.Web.SessionState;
using Newtonsoft.Json;
namespace HiDoctor_Master.Controllers
{
    public class StockistInheritanceController : Controller
    {
        private BL_StockiestInheritance _objStockiest = new BL_StockiestInheritance();
        
        #region PRIVATE VARIABLES
        DataControl.SPData _objSPData = new DataControl.SPData();
        DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        DataControl.Data _objData = new DataControl.Data();
        List<string> obj = new List<string>();
        #endregion

        public ActionResult Index(string id)
        {
            ViewBag.RegionCode = _objcurrentInfo.GetRegionCode();
            ViewBag.Entity = id;
            return View();
        }

        public string GetCustomers(FormCollection collection)
        {
            StringBuilder tableContent = new StringBuilder();
            tableContent.Append(GetCustomerTable(collection["EntityName"].ToString(), "HD", collection["Mode"].ToString(), collection["RegionCode"].ToString()));
            return tableContent.ToString();
        }

        public string GetCustomerTable(string entity, string tableName, string mode, string regionCode)
        {
            DataSet ds = new DataSet();
            ds = _objStockiest.GetCustomerData(entity, tableName, mode, regionCode, 0, "SINGLE");
            StringBuilder content = new StringBuilder();
            if (ds.Tables[0].Rows.Count > 0)
            {
                content.Append("<table style='width:100% !important;' id='tblDoctor'><thead  style='background-color:#227ee5;'><tr><th  style='min-width:20px !important;background-color:#f8f8f8;' id='tdMain'><input type='checkbox' id='bulkSScheck' name='bulkchk_SS' onclick='fnSSselectall()'>;</th>");
                for (var i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    if (ds.Tables[0].Rows[i]["Display_Option"].ToString() == "Y")
                    {
                        content.Append("<th style='white-space:nowrap;'>" + ds.Tables[0].Rows[i]["Field_Alias_Name"] + "</th>");
                        obj.Add(ds.Tables[0].Rows[i]["Field_Alias_Name"].ToString());
                        obj.Add("Customer_Status");
                        obj.Add("Delete");
                    }
                    else
                    {
                        content.Append("<th style='display:none'>" + ds.Tables[0].Rows[i]["Field_Alias_Name"] + "</th>");
                    }
                }
                content.Append("<th>Customer Status</th>");
                content.Append("</tr></thead><tbody>");
                for (var j = 0; j < ds.Tables[1].Rows.Count; j++)
                {
                    content.Append("<tr id='tr_" + j + "'>");
                    content.Append("<td style='text-align: center !important;border-right: 1px solid #DDD !important;background-color: #f2f2f2;height: 35px;'><input type='checkbox' id='chkSelect_" + j + "' name='chkSelect' /></td>");
                    for (var k = 0; k < ds.Tables[0].Rows.Count; k++)
                    {
                        if (ds.Tables[1].Rows[j][ds.Tables[0].Rows[k]["Field_Name"].ToString()] == null)
                        {
                            ds.Tables[1].Rows[j][ds.Tables[0].Rows[k]["Field_Name"].ToString()] = "";
                        }
                        if (ds.Tables[0].Rows[k]["Display_Option"].ToString() == "Y")
                        {
                            if (ds.Tables[0].Rows[k]["Field_Name"].ToString().ToUpper() == "SPECIALITY_CODE")
                            {
                                content.Append("<td id='td_" + ds.Tables[0].Rows[k]["Field_Name"] + "_" + j + "'>" + ds.Tables[1].Rows[j]["Speciality_Name"] + "</td>");
                            }
                            else if (ds.Tables[0].Rows[k]["Field_Name"].ToString().ToUpper() == "CATEGORY")
                            {
                                content.Append("<td id='td_" + ds.Tables[0].Rows[k]["Field_Name"] + "_" + j + "'>" + ds.Tables[1].Rows[j]["Category_Name"] + "</td>");
                            }
                            else if (ds.Tables[0].Rows[k]["Field_Name"].ToString().ToUpper() == "SUBREGION_CODE")
                            {
                                content.Append("<td id='td_" + ds.Tables[0].Rows[k]["Field_Name"] + "_" + j + "'>" + ds.Tables[1].Rows[j]["Subregion_Name"] + "</td>");
                            }

                            else if (ds.Tables[0].Rows[k]["Field_Name"].ToString().ToUpper() == "CUSTOMER_GROUP")
                            {
                                content.Append("<td id='td_" + ds.Tables[0].Rows[k]["Field_Name"] + "_" + j + "' >" + ds.Tables[1].Rows[j]["Customer_Group_Name"] + "</td>");
                            }
                            else if (ds.Tables[0].Rows[k]["Field_Name"].ToString().ToUpper() == "DEPOT_CODE")
                            {
                                content.Append("<td id='td_" + ds.Tables[0].Rows[k]["Field_Name"] + "_" + j + "'>" + ds.Tables[1].Rows[j]["Depot_Name"] + "</td>");
                            }
                            else
                            {
                                content.Append("<td id='td_" + ds.Tables[0].Rows[k]["Field_Name"] + "_" + j + "'>" + ds.Tables[1].Rows[j][ds.Tables[0].Rows[k]["Field_Name"].ToString()] + "</td>");
                            }
                        }
                        else
                        {
                            content.Append("<td id='td_" + ds.Tables[0].Rows[k]["Field_Name"] + "_" + j + "' style='display:none'>" + ds.Tables[1].Rows[j][ds.Tables[0].Rows[k]["Field_Name"].ToString()] + "</td>");
                        }
                    }
                    content.Append("<td id='td_Customer_Status_" + j + "'>" + ds.Tables[1].Rows[j]["Customer_Status"].ToString() + "</td>");
                    content.Append("</tr>");
                    content.Append("<input type='hidden' id='hdnisBillable_" + j + "' value='" + ds.Tables[1].Rows[j]["Is_Billable"] + "'/>");
                    content.Append("<input type='hidden' id='hdnSpecialityCode_" + j + "' value='" + ds.Tables[1].Rows[j]["Speciality_Code"] + "'/>");
                    content.Append("<input type='hidden' id='hdnRegion_Type_Code_" + j + "' value='" + ds.Tables[1].Rows[j]["Region_Type_Code"] + "'/>");
                    content.Append("<input type='hidden' id='hdnCategory_" + j + "' value='" + ds.Tables[1].Rows[j]["Category"] + "'/>");
                    content.Append("<input type='hidden' id='hdnContact_Relation_" + j + "' value='" + ds.Tables[1].Rows[j]["Contact_Relation"] + "'/>");
                    content.Append("<input type='hidden' id='hdnRow_Status_" + j + "' value='" + ds.Tables[1].Rows[j]["Row_Status"] + "'/>");
                    content.Append("<input type='hidden' id='hdnRow_Version_No_" + j + "' value='" + ds.Tables[1].Rows[j]["Row_Version_No"] + "'/>");
                    content.Append("<input type='hidden' id='hdnCCM_Customer_ID_" + j + "' value='" + ds.Tables[1].Rows[j]["CCM_Customer_ID"] + "'/>");
                    content.Append("<input type='hidden' id='hdnIs_Inherited_" + j + "' value='" + ds.Tables[1].Rows[j]["Is_Inherited"] + "'/>");
                    content.Append("<input type='hidden' id='hdnCustomer_Name_" + j + "' value='" + ds.Tables[1].Rows[j]["Customer_Name"] + "'/>");

                    content.Append("<input type='hidden' id='hdnSubRegionCode_" + j + "' value='" + ds.Tables[1].Rows[j]["SubRegion_Code"] + "'/>");
                    content.Append("<input type='hidden' id='hdnRegionCode_" + j + "' value='" + ds.Tables[1].Rows[j]["Region_Code"] + "'/>");
                    content.Append("<input type='hidden' id='hdnCustomerCode_" + j + "' value='" + ds.Tables[1].Rows[j]["Customer_Code"] + "'/>");
                    content.Append("<input type='hidden' id='hdnDepotCode_" + j + "' value='" + ds.Tables[1].Rows[j]["Depot_Code"] + "'/>");
                    content.Append("<input type='hidden' id='hdnCustomerGroup_" + j + "' value='" + ds.Tables[1].Rows[j]["Customer_Group"] + "'/>");
                    content.Append("<input type='hidden' id='hdnRefKey1_" + j + "' value='" + ds.Tables[1].Rows[j]["Ref_Key1"] + "'/>");
                    content.Append("<input type='hidden' id='hdnRefKey2_" + j + "' value='" + ds.Tables[1].Rows[j]["Ref_Key2"] + "'/>");
                    content.Append("<input type='hidden' id='hdnRegistrationNumber_" + j + "' value='" + ds.Tables[1].Rows[j]["Registration_Number"] + "'/>");

                    if (ds.Tables[1].Rows[j]["Effective_From"] != "")
                    {
                        DateTime dt = DateTime.Parse(ds.Tables[1].Rows[j]["Effective_From"].ToString());
                        content.Append("<input type='hidden' id='hdnEffectiveFrom_" + j + "' value='" + dt + "'/>");
                    }
                    else
                    {
                        content.Append("<input type='hidden' id='hdnEffectiveFrom_" + j + "' value=''/>");
                    }


                }

                content.Append("<tbody></table>");
            }
            return content.ToString();
        }

        public JsonResult GetCustomerHeaders(string entity, string tableName, string mode, string regionCode)
        {
            DataSet ds = new DataSet();
            ds = _objStockiest.GetCustomerData(entity, "HD", mode, regionCode, 0, "SINGLE");
            StringBuilder content = new StringBuilder();
            if (ds.Tables[0].Rows.Count > 0)
            {
                content.Append("<table style='width:100% !important;' id='tblDoctor'><thead  style='background-color:#227ee5;'><tr><th  style='min-width:20px !important;background-color:#f8f8f8;' id='tdMain'><input type='checkbox' id='chkSelect_All' name='chkSelect' onclick='fnCheckAll()';</th>");
                for (var i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    if (ds.Tables[0].Rows[i]["Display_Option"].ToString() == "Y")
                    {
                        obj.Add(ds.Tables[0].Rows[i]["Field_Name"].ToString());
                    }
                }
                obj.Add("Customer_Status");
                obj.Add("Delete");
                List<MVCModels.StockiestHeaderDetails> lst = new List<MVCModels.StockiestHeaderDetails>();
            }
            return Json(obj,JsonRequestBehavior.AllowGet);
        }

        public JsonResult ShiftStockiest(string companyCode,string stockiestArray, string TargetRegionCode,string customerCodes)
        {
            string result = "";
            List<MVCModels.StockiestHeaderDetails> objStock = new List<MVCModels.StockiestHeaderDetails>();
            List<MVCModels.StockiestHeaderDetails> objStock_New = new List<MVCModels.StockiestHeaderDetails>();
            objStock = (List<MVCModels.StockiestHeaderDetails>)JsonConvert.DeserializeObject(stockiestArray, typeof(List<MVCModels.StockiestHeaderDetails>));
            objStock_New = (List<MVCModels.StockiestHeaderDetails>)JsonConvert.DeserializeObject(stockiestArray, typeof(List<MVCModels.StockiestHeaderDetails>));
            IEnumerable<MVCModels.StockiestHeaderDetails> IStockiest = (IEnumerable<MVCModels.StockiestHeaderDetails>)JsonConvert.DeserializeObject(stockiestArray, typeof(List<MVCModels.StockiestHeaderDetails>));
            result=_objStockiest.ShiftStockiest(companyCode, objStock,objStock_New, TargetRegionCode,customerCodes);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public string GetStokiestInheritanceStatus(string companyCode, string customerCode, string customerName, string customerEntityType, string region_Code)
        {
            string[] CustomerCodes = customerCode.Split(',');
            string[] CustomerNames=customerName.Split(',');
            List<string> lstresult = new List<string>();
            string result = "";
            for (int i = 0; i < CustomerCodes.Count(); i++)
            {
                if (result == "" || result == "true")
                {
                    lstresult = _objStockiest.GetStokiestInheritanceStatus(companyCode, CustomerCodes[i].ToString(), "STOCKIEST",region_Code);

                    for (int r = 0; r < lstresult.Count; r++)
                    {
                        if (lstresult[r] == "1")
                        {
                            result = "Selected stockiest " + CustomerNames[i].ToString() + " is already in INHERITED status, Please select the base source region ";
                            break;
                        }
                        else
                        {
                            result = "true";
                        }
                    }
                }
            }
            return result;
        }

        public JsonResult InheritStockiest(string companyCode, string stockiestArray, string TargetRegionCode)
        {
            List<MVCModels.StockiestHeaderDetails> objStock = new List<MVCModels.StockiestHeaderDetails>();
            objStock = (List<MVCModels.StockiestHeaderDetails>)JsonConvert.DeserializeObject(stockiestArray, typeof(List<MVCModels.StockiestHeaderDetails>));
            IEnumerable<MVCModels.StockiestHeaderDetails> IStockiest = (IEnumerable<MVCModels.StockiestHeaderDetails>)JsonConvert.DeserializeObject(stockiestArray, typeof(List<MVCModels.StockiestHeaderDetails>));
            string result = _objStockiest.InheritStockiest(companyCode, objStock, TargetRegionCode);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}
