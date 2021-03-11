using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using DataControl;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class MenuMasterController : Controller
    {
        //
        // GET: /MenuMaster/

        StringBuilder strMenuContent = new StringBuilder();

        #region Menu Master
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult MenuMaster()
        {
            return View();
        }
        public ActionResult ConfigSettings()
        {
            return View();
        }
        public ActionResult GetAppMenuAccess()
        {
            return View();
        }

        public ActionResult AppMenuMaster()
        {
            return View();
        }


        public string GetParentMenuItems()
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLMaster objMaster = new DataControl.BLMaster();
            StringBuilder strContent = new StringBuilder();
            strContent.Append("<option value=''>-Select Parent-</option>");
            strContent.Append("<option value='0'>[Set as a Parent]</option>");
            try
            {
                IEnumerable<MVCModels.MenuMasterModel> lstMenu = null;
                lstMenu = objMaster.GetParentMenuItems(objCurInfo.GetCompanyCode());
                if (lstMenu != null)
                {
                    foreach (var dr in lstMenu)
                    {
                        if (!string.IsNullOrEmpty(Convert.ToString(dr.Parent_Menu_Text)))
                        {
                            strContent.Append("<option value='" + dr.Menu_ID + "'>" + dr.Parent_Menu_Text + " | " + dr.Menu_Text + "</option>");
                        }
                        else
                        {
                            strContent.Append("<option value='" + dr.Menu_ID + "'>" + dr.Menu_Text + "</option>");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
            }
            return strContent.ToString();
        }

        public string GetMenuDetails()
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLMaster objMaster = new DataControl.BLMaster();
            StringBuilder strContent = new StringBuilder();
            strContent.Append("<table class='table table-striped'><thead><tr><td>Edit</td><td>Menu Title</td><td>Parent Menu</td><td>File Menu</td>");
            strContent.Append("<td>MM Order</td><td>SM Order</td><td>Is Report</td><td>Report Category</td><td>Description</td><td>Feature Name</td>");
            strContent.Append("<td>Is Print</td><td>Is Excel Export</td><td>Is Chart</td><td>Is DrillDown</td><td>Is MultiUser</td><td>Menu_Key_Words</td>");
            strContent.Append("</tr></thead>");
            try
            {
                IEnumerable<MVCModels.MenuMasterModel> lstMenu = null;
                lstMenu = objMaster.GetMenuItems(objCurInfo.GetCompanyCode());
                List<MVCModels.MenuMasterModel> lstParentMenu = new List<MVCModels.MenuMasterModel>();
                var parentMenus = lstMenu.AsEnumerable().Where(x => x.Menu_URL == DBNull.Value.ToString() || x.Menu_URL == string.Empty || x.Menu_URL == "NULL" ||
                            x.Menu_URL == "null" || x.Menu_URL == null || x.Menu_URL == "Menu/Index" || x.Menu_URL == "Menu/NewReportMenu").ToList();
                if (parentMenus.Count > 0)
                {
                    strContent.Append("<tr><th class='collapseHeader' style='text-align:left;' colspan='15' onclick='fnSummaryHide(\"dv_ParentMenu\",\"spn_ParentMenu\")'>");
                    strContent.Append("<span class='expandMenu' id='spn_ParentMenu'>Parent Menu (Click to Expand/Collapse)</span>");
                    strContent.Append("</th></tr>");
                    var filteredParentMenu = parentMenus.AsEnumerable().Where(x => x.Menu_ParentID == DBNull.Value.ToString() || x.Menu_ParentID == string.Empty
                                              || x.Menu_ParentID == "NULL" || x.Menu_ParentID == "null" || x.Menu_ParentID == null).ToList();
                    foreach (var lstParentFilter in filteredParentMenu)
                    {
                        strContent.Append("<tr class='dv_ParentMenu'><td><a onclick='fnEdit(\""
                            + Convert.ToString(lstParentFilter.Menu_ID) + "\");' href='#'>Edit</a></td>");
                        strContent.Append("<td>" + lstParentFilter.Menu_Text + "</td>");
                        strContent.Append("<td>" + lstParentFilter.Parent_Menu_Text + "</td>");
                        strContent.Append("<td>" + lstParentFilter.Menu_URL + "</td>");
                        strContent.Append("<td>" + lstParentFilter.MM_Order + "</td>");
                        strContent.Append("<td>" + lstParentFilter.SM_Order + "</td>");
                        if (lstParentFilter.Is_Report == "1")
                        {
                            strContent.Append("<td>Yes</td>");
                        }
                        else
                        {
                            strContent.Append("<td>No</td>");
                        }
                        strContent.Append("<td>" + lstParentFilter.Report_Category + "</td>");
                        strContent.Append("<td>" + lstParentFilter.Description + "</td>");
                        strContent.Append("<td>" + lstParentFilter.Feature_Name + "</td>");
                        strContent.Append("<td>" + lstParentFilter.IsPrint + "</td>");
                        strContent.Append("<td>" + lstParentFilter.IsExcelExport + "</td>");
                        strContent.Append("<td>" + lstParentFilter.IsChart + "</td>");
                        strContent.Append("<td>" + lstParentFilter.IsDrillDown + "</td>");
                        strContent.Append("<td>" + lstParentFilter.IsMultiUser + "</td>");
                        strContent.Append("<td>" + lstParentFilter.Menu_Key_Words + "</td>");
                        strContent.Append("</tr>");
                    }


                    foreach (var dr in parentMenus)
                    {
                        strContent.Append("<tr><th class='collapseHeader' style='text-align:left;' colspan='15' onclick='fnSummaryHide(\"dv_"
                            + dr.Menu_ID + "\",\"spn_" + dr.Menu_ID + "\")'>");
                        strContent.Append("<span class='expandMenu' id='spn_" + dr.Menu_ID + "'>" + dr.Menu_Text + " (Click to Expand/Collapse)</span>");
                        strContent.Append("</th></tr>");

                        lstParentMenu = lstMenu.AsEnumerable().Where(a => a.Menu_ParentID == dr.Menu_ID).ToList();
                        if (lstParentMenu.Count > 0)
                        {
                            foreach (var lstFilter in lstParentMenu)
                            {
                                strContent.Append("<tr class='dv_" + dr.Menu_ID + "'><td><a onclick='fnEdit(\""
                                    + Convert.ToString(lstFilter.Menu_ID) + "\");' href='#'>Edit</a></td>");
                                strContent.Append("<td>" + lstFilter.Menu_Text + "</td>");
                                strContent.Append("<td>" + lstFilter.Parent_Menu_Text + "</td>");
                                strContent.Append("<td>" + lstFilter.Menu_URL + "</td>");
                                strContent.Append("<td>" + lstFilter.MM_Order + "</td>");
                                strContent.Append("<td>" + lstFilter.SM_Order + "</td>");
                                if (lstFilter.Is_Report == "1")
                                {
                                    strContent.Append("<td>Yes</td>");
                                }
                                else
                                {
                                    strContent.Append("<td>No</td>");
                                }
                                strContent.Append("<td>" + lstFilter.Report_Category + "</td>");
                                strContent.Append("<td>" + lstFilter.Description + "</td>");
                                strContent.Append("<td>" + lstFilter.Feature_Name + "</td>");
                                strContent.Append("<td>" + lstFilter.IsPrint + "</td>");
                                strContent.Append("<td>" + lstFilter.IsExcelExport + "</td>");
                                strContent.Append("<td>" + lstFilter.IsChart + "</td>");
                                strContent.Append("<td>" + lstFilter.IsDrillDown + "</td>");
                                strContent.Append("<td>" + lstFilter.IsMultiUser + "</td>");
                                strContent.Append("<td>" + lstFilter.Menu_Key_Words + "</td>");
                                strContent.Append("</tr>");
                            }
                        }
                    }
                }

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
            }
            return strContent.ToString();
        }

       
        public string GetFeatureMaster()
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLMaster objMaster = new DataControl.BLMaster();
            StringBuilder strContent = new StringBuilder();
            strContent.Append("<option value=''>-Select Feature-</option>");
            try
            {
                IEnumerable<MVCModels.HiDoctor_Master.FeatureModel> lstFeature = null;
                lstFeature = objMaster.GetActiveFeatre(objCurInfo.GetCompanyCode());
                if (lstFeature != null)
                {
                    foreach (var dr in lstFeature)
                    {

                        strContent.Append("<option value='" + dr.Feature_Code + "'>" + dr.Feature_Name + "</option>");
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
            }
            return strContent.ToString();
        }

        public JsonResult GetSelectedMenuDetails(string menuId)
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLMaster objMaster = new DataControl.BLMaster();
            IEnumerable<MVCModels.MenuMasterModel> lstMenu = null;

            lstMenu = objMaster.GetSelectedMenuDetails(objCurInfo.GetCompanyCode(), menuId);
            DataControl.JSONConverter objJson = new DataControl.JSONConverter();
            return Json(objJson.Serialize(lstMenu));
        }


        //App Menu Master
        public JsonResult GetAppSelectedMenuDetails(string menuId)
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLMaster objMaster = new DataControl.BLMaster();
            IEnumerable<MVCModels.MenuMasterModel> lstMenu = null;

            lstMenu = objMaster.GetAppSelectedMenuDetails(objCurInfo.GetCompanyCode(), menuId);
            DataControl.JSONConverter objJson = new DataControl.JSONConverter();
            return Json(objJson.Serialize(lstMenu));
        }


        public string InsertMenuMaster(string menuText, string parentMenu, string menuURL, string mmOrder, string smOrder, string isReport,
                string isPrint, string isExcel, string isChart, string isDrillDown, string isMultiUser, string reportCategory, string description,
                string featureCode, string menuKeyWords, string ProjectName, string mode, string menuId)
        {
            string result = string.Empty;
            try
            {
                DataControl.BLMaster objMaster = new DataControl.BLMaster();
                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                int rowsAffected;
                StringBuilder strMenuFullPath = new StringBuilder();
                string currentParentMenuId = string.Empty;
                string rootParentId = string.Empty;
                List<MVCModels.MenuMasterModel> lstMenu = new List<MVCModels.MenuMasterModel>();
                MVCModels.MenuMasterModel objMenu = new MVCModels.MenuMasterModel();
                #region get menu fullpath
                List<MVCModels.MenuMasterModel> lstMenuPath = new List<MVCModels.MenuMasterModel>();
                lstMenuPath = new List<MVCModels.MenuMasterModel>(objMaster.GetMenuItems(objCurInfo.GetCompanyCode()));
                int i = 0;
                if (lstMenuPath.Count > 0)
                {
                    if (parentMenu != "0" && parentMenu != "")
                    {
                        currentParentMenuId = parentMenu;
                        while (!string.IsNullOrEmpty(currentParentMenuId))
                        {
                            var filtered = lstMenuPath.AsEnumerable().Where(z => z.Menu_ID == currentParentMenuId).ToList();
                            if (filtered.Count > 0)
                            {
                                if (!string.IsNullOrEmpty(filtered[0].Menu_URL))
                                {
                                    result = "ERROR:The selected parent has file name. so you can not choose this menu as a parent menu";
                                    break;
                                }
                                currentParentMenuId = filtered[0].Menu_ParentID;
                                strMenuFullPath.Append(filtered[0].Menu_Text + "|");
                            }
                        }
                    }
                    else
                    {
                        strMenuFullPath.Append(menuText + "|");
                    }
                }
                if (!string.IsNullOrEmpty(result))
                {
                    return result;
                }
                string[] arMenuFullPath = strMenuFullPath.ToString().TrimEnd('|').Split('|');
                string menuFullPath = string.Empty;
                i = arMenuFullPath.Length;
                while (i > 0)
                {
                    menuFullPath += arMenuFullPath[(i - 1)] + " | ";
                    i--;
                }
                menuFullPath = menuFullPath + menuText;
                #endregion get menu full path

                objMenu.Company_Code = objCurInfo.GetCompanyCode();
                objMenu.Menu_Text = menuText;
                if (parentMenu != "" && parentMenu != "0")
                {
                    objMenu.Menu_ParentID = parentMenu;
                }
                if (!string.IsNullOrEmpty(menuURL))
                {
                    objMenu.Menu_URL = menuURL;
                }
                objMenu.MM_Order = mmOrder;
                objMenu.SM_Order = smOrder;
                objMenu.Is_Report = isReport;
                objMenu.IsPrint = isPrint;
                objMenu.IsExcelExport = isExcel;
                objMenu.IsChart = isChart;
                objMenu.IsDrillDown = isDrillDown;
                objMenu.IsMultiUser = isMultiUser;
                objMenu.Menu_Full_Path = menuFullPath;
                //objMenu.Project_Name = "HIDOCTOR";
                objMenu.Project_Name = ProjectName == null ? "HIDOCTOR" : ProjectName.ToUpper();
                if (!string.IsNullOrEmpty(reportCategory))
                {
                    objMenu.Report_Category = reportCategory;
                }
                if (!string.IsNullOrEmpty(description))
                {
                    objMenu.Description = description;
                }
                if (!string.IsNullOrEmpty(featureCode))
                {
                    objMenu.Feature_Code = featureCode;
                }
                if (!string.IsNullOrEmpty(menuKeyWords))
                {
                    objMenu.Menu_Key_Words = menuKeyWords;
                }
                //if (!string.IsNullOrEmpty(ProjectName))
                //{
                //    objMenu.Project_Name = "HIDOCTOR";
                //}
                if ("INSERT" == mode.ToUpper())
                {
                    objMenu.Menu_Created_By = objCurInfo.GetUserName();
                    objMenu.Menu_Created_DateTime = System.DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                }
                else
                {
                    objMenu.Menu_Updated_By = objCurInfo.GetUserName();
                    objMenu.Menu_Updated_DateTime = System.DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                    objMenu.Menu_ID = menuId;
                }
                lstMenu.Add(objMenu);
                rowsAffected = objMaster.InsertMenuMaster(lstMenu, mode);
                if (rowsAffected > 0)
                {
                    if ("INSERT" == mode.ToUpper())
                    {
                        result = "SUCCESS:Menu inserted successfully";
                    }
                    else
                    {
                        result = "SUCCESS:Menu updated successfully";
                    }
                }
                else
                {
                    if ("INSERT" == mode.ToUpper())
                    {
                        result = "ERROR:Error while insert the menu details";
                    }
                    else
                    {
                        result = "ERROR:Error while update the menu details";
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return result;
        }

        //App Insert Master
        public string InsertAppMenuMaster(string menuText,string MenuLevel,string parentMenu, string menuURL, string Type, string Category,string mode, string menuId,string TypeOfModule,string Query_String_Parameters)
        {
            string result = string.Empty;
            try
            {
                menuURL = menuURL.Replace('^', '&');
                DataControl.BLMaster objMaster = new DataControl.BLMaster();
                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                int rowsAffected;
                StringBuilder strMenuFullPath = new StringBuilder();
                string currentParentMenuId = string.Empty;
                string rootParentId = string.Empty;
                List<MVCModels.MenuMasterModel> lstMenu = new List<MVCModels.MenuMasterModel>();
                MVCModels.MenuMasterModel objMenu = new MVCModels.MenuMasterModel();
                #region get menu fullpath
                List<MVCModels.MenuMasterModel> lstMenuPath = new List<MVCModels.MenuMasterModel>();
                lstMenuPath = new List<MVCModels.MenuMasterModel>(objMaster.GetAppMenuItems(objCurInfo.GetCompanyCode()));
                int i = 0;
                if (!string.IsNullOrEmpty(result))
                {
                    return result;
                }
                string[] arMenuFullPath = strMenuFullPath.ToString().TrimEnd('|').Split('|');
                string menuFullPath = string.Empty;
                i = arMenuFullPath.Length;
                while (i > 0)
                {
                    menuFullPath += arMenuFullPath[(i - 1)] + " | ";
                    i--;
                }
                menuFullPath = menuFullPath + menuText;
                #endregion get menu full path

                objMenu.Company_Code = objCurInfo.GetCompanyCode();
                objMenu.Menu_Text = menuText;
                objMenu.Query_String_Parameters = Query_String_Parameters;
                objMenu.TypeOfModule = TypeOfModule;
                if (parentMenu != "" && parentMenu != "0")
                {
                    objMenu.Menu_ParentID = parentMenu;
                }
                if (!string.IsNullOrEmpty(menuURL))
                {
                    objMenu.Menu_URL = menuURL;
                }
                objMenu.Menu_Text = menuText;
                objMenu.MenuLevel = MenuLevel;
                objMenu.Parent_Menu_Text = parentMenu;
                objMenu.Menu_URL = menuURL;
                objMenu.Type = Type;
                objMenu.Category = Category;
             
                
                //if (!string.IsNullOrEmpty(ProjectName))
                //{
                //    objMenu.Project_Name = "HIDOCTOR";
                //}
                if ("INSERT" == mode.ToUpper())
                {
                    objMenu.Menu_Created_By = objCurInfo.GetUserName();
                    objMenu.Menu_Created_DateTime = System.DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                }
                else
                {
                    objMenu.Menu_Updated_By = objCurInfo.GetUserName();
                    objMenu.Menu_Updated_DateTime = System.DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                    objMenu.Menu_ID = menuId;
                }
                lstMenu.Add(objMenu);
                if(MenuLevel=="P")
                {
                    lstMenu[0].MenuLevel = "1";
                    lstMenu[0].Menu_ParentID = "0";
                }
                else
                {
                    lstMenu[0].MenuLevel = "0";
                }

                if(Type== "N")
                {
                    lstMenu[0].Type = "1";
                }

                if (Type == "NR")
                {
                    lstMenu[0].Type = "2";
                }

                if (Type == "R")
                {
                    lstMenu[0].Type = "3";
                }
                rowsAffected = objMaster.InsertAppMenuMaster(lstMenu, mode);
                if (rowsAffected > 0)
                {
                    if ("INSERT" == mode.ToUpper())
                    {
                        result = "SUCCESS:Menu inserted successfully";
                    }
                    else
                    {
                        result = "SUCCESS:Menu updated successfully";
                    }
                }
                else
                {
                    if ("INSERT" == mode.ToUpper())
                    {
                        result = "ERROR:Error while insert the menu details";
                    }
                    else
                    {
                        result = "ERROR:Error while update the menu details";
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return result;
        }

        public string GetAppMenuDetails()
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLMaster objMaster = new DataControl.BLMaster();
            StringBuilder strContent = new StringBuilder();
            strContent.Append("<table class='table table-striped'><thead><tr><td>Edit</td><td>Menu Title</td><td>Parent Menu</td><td>File URL</td>");
            strContent.Append("<td>Type</td><td>Category</td>");
            strContent.Append("</tr></thead>");
            try
            {
                IEnumerable<MVCModels.MenuMasterModel> lstMenu = null;
                lstMenu = objMaster.GetAppMenuItems(objCurInfo.GetCompanyCode());
                List<MVCModels.MenuMasterModel> lstParentMenu = new List<MVCModels.MenuMasterModel>();
                var parentMenus = lstMenu.AsEnumerable().Where(x => x.Menu_URL == DBNull.Value.ToString() || x.Menu_URL == string.Empty || x.Menu_URL == "NULL" ||
                            x.Menu_URL == "null" || x.Menu_URL == null || x.Menu_URL == "Menu/Index" || x.Menu_URL == "Menu/NewReportMenu").ToList();
                if (parentMenus.Count > 0)
                {
                    //strContent.Append("<tr><th class='collapseHeader' style='text-align:left;' colspan='15' onclick='fnSummaryHide(\"dv_ParentMenu\",\"spn_ParentMenu\")'>");
                    //strContent.Append("<span class='expandMenu' id='spn_ParentMenu'>Parent Menu (Click to Expand/Collapse)</span>");
                    //strContent.Append("</th></tr>");
                    var filteredParentMenu = parentMenus.AsEnumerable().Where(x => x.Menu_ParentID == DBNull.Value.ToString() || x.Menu_ParentID == string.Empty
                                              || x.Menu_ParentID == "NULL" || x.Menu_ParentID == "null" || x.Menu_ParentID == null || x.Menu_ParentID == "0").ToList();
                    foreach (var lstParentFilter in filteredParentMenu)
                    {
                        strContent.Append("<tr class='dv_ParentMenu'><td></td>");
                        strContent.Append("<td>" + lstParentFilter.Menu_Text + "</td>");
                        strContent.Append("<td>" + lstParentFilter.Parent_Menu_Text + "</td>");
                        strContent.Append("<td>" + lstParentFilter.Menu_URL + "</td>");
                        strContent.Append("<td>" + lstParentFilter.Type + "</td>");
                        strContent.Append("<td>" + lstParentFilter.Category + "</td>");
                        strContent.Append("</tr>");
                    }


                    foreach (var dr in parentMenus)
                    {
                        //strContent.Append("<tr><th class='collapseHeader' style='text-align:left;' colspan='15' onclick='fnSummaryHide(\"dv_"
                        //    + dr.Menu_ID + "\",\"spn_" + dr.Menu_ID + "\")'>");
                        //strContent.Append("<span class='expandMenu' id='spn_" + dr.Menu_ID + "'>" + dr.Menu_Text + " (Click to Expand/Collapse)</span>");
                        //strContent.Append("</th></tr>");

                        lstParentMenu = lstMenu.AsEnumerable().Where(a => a.Menu_ParentID == dr.Menu_ID).ToList();
                        if (lstParentMenu.Count > 0)
                        {
                            foreach (var lstFilter in lstParentMenu)
                            {
                                if (lstFilter.Type == "Native and Responsive" || lstFilter.Type == "Responsive")
                                {
                                    strContent.Append("<tr class='dv_" + dr.Menu_ID + "'><td><a onclick='fnEdit(\""
                                        + Convert.ToString(lstFilter.Menu_ID) + "\");' href='#'>Edit</a></td>");
                                    strContent.Append("<td>" + lstFilter.Menu_Text + "</td>");
                                    strContent.Append("<td>" + lstFilter.Parent_Menu_Text + "</td>");
                                    strContent.Append("<td>" + lstFilter.Menu_URL + "</td>");
                                    strContent.Append("<td>" + lstFilter.Type + "</td>");
                                    strContent.Append("<td>" + lstFilter.Category + "</td>");
                                    strContent.Append("</tr>");
                                }
                                else
                                {
                                    strContent.Append("<tr class='dv_" + dr.Menu_ID + "'><td></td>");

                                    strContent.Append("<td>" + lstFilter.Menu_Text + "</td>");
                                    strContent.Append("<td>" + lstFilter.Parent_Menu_Text + "</td>");
                                    strContent.Append("<td>" + lstFilter.Menu_URL + "</td>");
                                    strContent.Append("<td>" + lstFilter.Type + "</td>");
                                    strContent.Append("<td>" + lstFilter.Category + "</td>");
                                    strContent.Append("</tr>");
                                }
                            }
                        }
                    }
                }

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
            }
            return strContent.ToString();
        }


        #endregion Menu Master
        #region UserType Menu Access
        public ActionResult MenuAccess()
        {
            return View();
        }
        public string GetMenuItems()
        {

            DataControl.BLMaster objMaster = new DataControl.BLMaster();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            try
            {
                IEnumerable<MVCModels.MenuMasterModel> lstMenu = null;
                lstMenu = objMaster.GetParentMenuItems(objCurInfo.GetCompanyCode());
                strMenuContent.Append("<ul id='ulMenu'>");
                int subMenuCount = 0;
                if (lstMenu != null)
                {
                    var lstFilteredMenu = lstMenu.AsEnumerable().Where(x => x.Menu_ParentID == DBNull.Value.ToString() || x.Menu_ParentID == string.Empty
                                              || x.Menu_ParentID == "NULL" || x.Menu_ParentID == "null" || x.Menu_ParentID == null).ToList();
                    if (lstFilteredMenu.Count > 0)
                    {
                        foreach (var dr in lstFilteredMenu)
                        {
                            var childMenus = lstMenu.AsEnumerable().Where(a => Convert.ToString(a.Menu_ParentID) == Convert.ToString(dr.Menu_ID)).ToList();


                            strMenuContent.Append("<li><input type='checkbox' value='" + Convert.ToString(dr.Menu_ID)
                                + "'><label>" + Convert.ToString(dr.Menu_Text) + "</label>");

                            if (childMenus.Count > 0)
                            {
                                strMenuContent.Append("<ul id='ddsubmenu" + subMenuCount.ToString() + "'>");
                                subMenuCount++;
                                GenerateSubMenuContent(dr.Menu_ID, lstMenu);
                                strMenuContent.Append("</ul>");
                            }

                            strMenuContent.Append("</li>");
                        }
                    }
                }
                strMenuContent.Append("</ul>");
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return strMenuContent.ToString();
        }
        private void GenerateSubMenuContent(string parentMenuId, IEnumerable<MVCModels.MenuMasterModel> lstMenuMaster)
        {
            var filteredMenuList = lstMenuMaster.AsEnumerable().Where(b => Convert.ToString(b.Menu_ParentID) == Convert.ToString(parentMenuId)).ToList();
            foreach (var dr in filteredMenuList)
            {
                var drFiltered = lstMenuMaster.AsEnumerable().Where(c => Convert.ToString(c.Menu_ParentID) == Convert.ToString(dr.Menu_ID)).ToList();
                strMenuContent.Append("<li>");
                strMenuContent.Append("<input type='checkbox' value='" + dr.Menu_ID + "'><label>" + dr.Menu_Text + "</label>");
                if (drFiltered.Count > 0)
                {
                    strMenuContent.Append("<ul>");
                    GenerateSubMenuContent(dr.Menu_ID, lstMenuMaster);
                    strMenuContent.Append("</ul>");
                }
                strMenuContent.Append("</li>");
            }
        }

        private void GenerateAppSubMenuContent(string parentMenuId, IEnumerable<MVCModels.MenuMasterModel> lstMenudet)
        {
            var filteredMenuList = lstMenudet.AsEnumerable().Where(b => Convert.ToString(b.Menu_ParentID) == Convert.ToString(parentMenuId)).ToList();
            foreach (var dr in filteredMenuList)
            {
                var drFiltered = lstMenudet.AsEnumerable().Where(c => Convert.ToString(c.Menu_ParentID) == Convert.ToString(dr.Menu_ID)).ToList();
                strMenuContent.Append("<li>");
                strMenuContent.Append("<input type='checkbox' value='" + dr.Menu_ID + "'><label>" + dr.Menu_Text + "</label>");
                if (drFiltered.Count > 0)
                {
                    strMenuContent.Append("<ul>");
                    GenerateAppSubMenuContent(dr.Menu_ID, lstMenudet);
                    strMenuContent.Append("</ul>");
                }
                strMenuContent.Append("</li>");
            }
        }
        public string GetUserTypes()
        {
            StringBuilder strUserType = new StringBuilder();
            strUserType.Append("<option value=''>-Select User Type-</option>");
            try
            {
                DataControl.BLUser objUser = new DataControl.BLUser();
                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                IEnumerable<MVCModels.HiDoctor_Master.UserTypeModel> lstUserType = null;
                lstUserType = objUser.GetUserTypes(objCurInfo.GetCompanyCode());
                if (lstUserType != null)
                {
                    foreach (var dr in lstUserType)
                    {
                        if (dr.User_Type_Status == "1")
                        {
                            strUserType.Append("<option value=" + dr.User_Type_Code + ">" + dr.User_Type_Name + "</option>");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
            }
            return strUserType.ToString();
        }

        /// <summary>
        /// Get active User  types
        /// </summary>
        /// <returns>Get active User types</returns>
        public JsonResult GetSourceUserTypes()
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLUser objUser = new DataControl.BLUser();
            List<MVCModels.HiDoctor_Master.UserTypeModel> lstUserType = new List<MVCModels.HiDoctor_Master.UserTypeModel>();
            lstUserType = objUser.GetUserTypes(objCurInfo.GetCompanyCode());
            DataControl.JSONConverter objJson = new DataControl.JSONConverter();
            return Json(objJson.Serialize(lstUserType));
        }

        public JsonResult GetUserTypeMenuAccess(string userTypeCode)
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLMaster objMaster = new DataControl.BLMaster();
            IEnumerable<MVCModels.UserTypeMenuAccessModel> lstMenu = null;

            lstMenu = objMaster.GetUserTypeMenuAccess(objCurInfo.GetCompanyCode(), userTypeCode);
            DataControl.JSONConverter objJson = new DataControl.JSONConverter();
            return Json(objJson.Serialize(lstMenu));
        }

        public JsonResult GetAppUserTypeMenuAccess(string userTypeCode)
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLMaster objMaster = new DataControl.BLMaster();
            IEnumerable<MVCModels.UserTypeAppMenuAccessModel> lstAppMenu = null;

            lstAppMenu = objMaster.GetAppUserTypeMenuAccess(objCurInfo.GetCompanyCode(), userTypeCode);
            DataControl.JSONConverter objJson = new DataControl.JSONConverter();
            return Json(objJson.Serialize(lstAppMenu));
        }

        public string InsertMenuAccess(string userTypeCode, string selectedMenus, string userTypeName)
        {
            string result = string.Empty;
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLMaster objMaster = new DataControl.BLMaster();
            try
            {
                IEnumerable<MVCModels.MenuMasterModel> lstAllMenus = null;
                lstAllMenus = objMaster.GetParentMenuItems(objCurInfo.GetCompanyCode());
                List<MVCModels.UserTypeMenuAccessModel> lstMenu = new List<MVCModels.UserTypeMenuAccessModel>();
                List<MVCModels.UserTypeMenuAccessModel> lstMappedMenus = new List<MVCModels.UserTypeMenuAccessModel>();
                lstMappedMenus = new List<MVCModels.UserTypeMenuAccessModel>(objMaster.GetUserTypeMenuAccess(objCurInfo.GetCompanyCode(), userTypeCode));

                if (!string.IsNullOrEmpty(selectedMenus))
                {
                    string[] ar = selectedMenus.Split('^');
                    if (ar.Length > 0)
                    {
                        foreach (var drMenu in ar)
                        {
                            if (!string.IsNullOrEmpty(drMenu))
                            {
                                MVCModels.UserTypeMenuAccessModel objMenu = new MVCModels.UserTypeMenuAccessModel();
                                objMenu.Company_Code = objCurInfo.GetCompanyCode();
                                objMenu.Menu_Id = drMenu.ToString();
                                objMenu.User_Type_Code = userTypeCode;
                                objMenu.User_Type_Name = userTypeName;
                                var filteredList = lstAllMenus.AsEnumerable().Where(n => Convert.ToString(n.Menu_ID) == drMenu.ToString()).ToList();
                                if (filteredList.Count > 0)
                                {
                                    objMenu.Menu_Text = filteredList[0].Menu_Text;
                                    objMenu.Menu_URL = filteredList[0].Menu_URL;
                                }
                                objMenu.Updated_By = objCurInfo.GetUserName();
                                objMenu.Updated_Date = System.DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                                objMenu.Access = "1";
                                lstMenu.Add(objMenu);
                            }
                        }
                        List<MVCModels.UserTypeMenuAccessModel> lstInsertMenu = lstMenu.Where(s => !lstMappedMenus.Where(e => e.Menu_Id == s.Menu_Id).Any()).ToList();
                        lstInsertMenu.ForEach(c =>
                        {
                            c.Updated_By = objCurInfo.GetUserName();
                            c.Updated_Date = System.DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                        });
                        lstMappedMenus.RemoveAll(s => lstMenu.Where(e => e.Menu_Id == s.Menu_Id).Any());
                        lstMappedMenus.ForEach(c =>
                        {
                            c.Updated_By = objCurInfo.GetUserName();
                            c.Updated_Date = System.DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                        });
                        if (lstInsertMenu.Count > 0 || lstMappedMenus.Count > 0)
                        {
                            int rowsAffected = objMaster.InsertMenuAccess(lstInsertMenu, lstMappedMenus, userTypeCode, objCurInfo.GetCompanyCode());
                            if (rowsAffected > 0)
                            {
                                result = "SUCCESS:The selected menus are successfully mapped to the selected user type";
                            }
                            else
                            {
                                result = "ERROR:Error while map the menu to selected user type";
                            }
                        }
                        else
                        {
                            result = "SUCCESS:The selected menus are successfully mapped to the selected user type";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
            }
            return result;
        }

        public string GetMenuMappedUserTypes()
        {
            StringBuilder strUserType = new StringBuilder();
            strUserType.Append("<option value=''>-Select User Type-</option>");
            try
            {
                DataControl.BLMaster objMaster = new DataControl.BLMaster();
                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                IEnumerable<MVCModels.HiDoctor_Master.UserTypeModel> lstUserType = null;
                lstUserType = objMaster.GetMenuMappedUserTypes(objCurInfo.GetCompanyCode());
                if (lstUserType != null)
                {
                    foreach (var dr in lstUserType)
                    {
                        strUserType.Append("<option value=" + dr.User_Type_Code + ">" + dr.User_Type_Name + "</option>");
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
            }
            return strUserType.ToString();
        }

        public string CopyMenuAccess(string sourceUserTypeCode, string userTypes, string userTypeNames)
        {
            string result = string.Empty;
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLMaster objMaster = new DataControl.BLMaster();
            try
            {
                List<MVCModels.HiDoctor_Master.UserTypeModel> lstUserTypes = new List<MVCModels.HiDoctor_Master.UserTypeModel>();
                if (!string.IsNullOrEmpty(userTypes))
                {
                    string[] arUserTypes;
                    string[] arUserTypeNames;
                    arUserTypes = userTypes.Split('^');
                    arUserTypeNames = userTypeNames.Split('^');

                    List<MVCModels.UserTypeMenuAccessModel> lstMenu = new List<MVCModels.UserTypeMenuAccessModel>();
                    lstMenu = new List<MVCModels.UserTypeMenuAccessModel>(objMaster.GetUserTypeMenuAccess(objCurInfo.GetCompanyCode(),
                              sourceUserTypeCode));
                    for (int i = 0; i < arUserTypes.Length; i++)
                    {
                        if (!string.IsNullOrEmpty(arUserTypes[i]))
                        {
                            //MVCModels.HiDoctor_Master.UserTypeModel objUserType = new MVCModels.HiDoctor_Master.UserTypeModel();
                            //objUserType.User_Type_Code = Convert.ToString(arUserTypes[i]);
                            //objUserType.Company_Code = objCurInfo.GetCompanyCode();
                            //lstUserTypes.Add(objUserType);


                            List<MVCModels.UserTypeMenuAccessModel> lstMappedMenus = new List<MVCModels.UserTypeMenuAccessModel>();
                            lstMappedMenus = new List<MVCModels.UserTypeMenuAccessModel>(objMaster.GetUserTypeMenuAccess(objCurInfo.GetCompanyCode(),
                                Convert.ToString(arUserTypes[i])));

                            List<MVCModels.UserTypeMenuAccessModel> lstInsertMenu = lstMenu.Where(s => !lstMappedMenus.Where(e =>
                                e.Menu_Id == s.Menu_Id).Any()).ToList();
                            lstInsertMenu.ForEach(c =>
                            {
                                c.Updated_By = objCurInfo.GetUserName();
                                c.Updated_Date = System.DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                                c.User_Type_Code = Convert.ToString(arUserTypes[i]);
                                c.User_Type_Name = Convert.ToString(arUserTypeNames[i]);
                            });
                            lstMappedMenus.RemoveAll(s => lstMenu.Where(e => e.Menu_Id == s.Menu_Id).Any());
                            lstMappedMenus.ForEach(c =>
                            {
                                c.Updated_By = objCurInfo.GetUserName();
                                c.Updated_Date = System.DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                                c.Access = "0";
                                c.User_Type_Code = Convert.ToString(arUserTypes[i]);
                                c.User_Type_Name = Convert.ToString(arUserTypeNames[i]);
                            });
                            if (lstInsertMenu.Count > 0 || lstMappedMenus.Count > 0)
                            {
                                int rowsAffected = objMaster.InsertMenuAccess(lstInsertMenu, lstMappedMenus,
                                                Convert.ToString(arUserTypes[i]), objCurInfo.GetCompanyCode());
                                if (rowsAffected > 0)
                                {
                                    result = "SUCCESS:The selected menus are successfully mapped to the selected user type";
                                }
                                else
                                {
                                    result = "ERROR:Error while map the menu to selected user type";
                                }
                            }
                            else
                            {
                                result = "SUCCESS:The selected menus are successfully mapped to the selected user type";
                            }
                        }
                    }
                }
                //int rowsAffected = 0;
                //rowsAffected = objMaster.CopyMenuAccess(lstUserTypes, sourceUserTypeCode, objCurInfo.GetCompanyCode(), objCurInfo.GetUserName(),
                //    System.DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss"));
                //if (rowsAffected > 0)
                //{
                //    result = "SUCCESS:Menu Access is copied for the selected user types";
                //}
                //else
                //{
                //    result = "ERROR:Error while copy the menu access";
                //}
                // rowsAffected = objUser.PaySlipInheritance(objCurInfo.GetCompanyCode(), sourceUserTypeCode, lstUserTypes);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("sourceUserTypeCode", sourceUserTypeCode);
                dicObj.Add("userTypes", userTypes);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return result;
        }


        public string CopyAppMenuAccess(string sourceUserTypeCode, string userTypes, string userTypeNames)
        {
            string result = string.Empty;
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLMaster objMaster = new DataControl.BLMaster();
            try
            {
                List<MVCModels.HiDoctor_Master.UserTypeModel> lstUserTypes = new List<MVCModels.HiDoctor_Master.UserTypeModel>();
                if (!string.IsNullOrEmpty(userTypes))
                {
                    string[] arUserTypes;
                    string[] arUserTypeNames;
                    arUserTypes = userTypes.Split('^');
                    arUserTypeNames = userTypeNames.Split('^');

                    List<MVCModels.UserTypeAppMenuAccessModel> lstAppMenu = new List<MVCModels.UserTypeAppMenuAccessModel>();
                    lstAppMenu = new List<MVCModels.UserTypeAppMenuAccessModel>(objMaster.GetAppUserTypeMenuAccess(objCurInfo.GetCompanyCode(), sourceUserTypeCode));
                    for (int i = 0; i < arUserTypes.Length; i++)
                    {
                        if (!string.IsNullOrEmpty(arUserTypes[i]))
                        {
                            //MVCModels.HiDoctor_Master.UserTypeModel objUserType = new MVCModels.HiDoctor_Master.UserTypeModel();
                            //objUserType.User_Type_Code = Convert.ToString(arUserTypes[i]);
                            //objUserType.Company_Code = objCurInfo.GetCompanyCode();
                            //lstUserTypes.Add(objUserType);


                            List<MVCModels.UserTypeAppMenuAccessModel> lstAppMappedMenus = new List<MVCModels.UserTypeAppMenuAccessModel>();
                            lstAppMappedMenus = new List<MVCModels.UserTypeAppMenuAccessModel>(objMaster.GetAppUserTypeMenuAccess(objCurInfo.GetCompanyCode(),
                                Convert.ToString(arUserTypes[i])));

                            //List<MVCModels.UserTypeMenuAccessModel> lstInsertMenu = lstMenu.Where(s => !lstMappedMenus.Where(e =>
                            //    e.Menu_Id == s.Menu_Id).Any()).ToList();
                            lstAppMenu.ForEach(c =>
                            {
                                c.Created_By = objCurInfo.GetUserName();
                                c.Created_Date = System.DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                                c.User_Type_Code = Convert.ToString(arUserTypes[i]);
                                c.User_Type_Name = Convert.ToString(arUserTypeNames[i]);
                            });
                            lstAppMappedMenus.RemoveAll(s => lstAppMenu.Where(e => e.Menu_Id == s.Menu_Id).Any());
                            lstAppMappedMenus.ForEach(c =>
                            {
                                c.Created_By = objCurInfo.GetUserName();
                                c.Created_Date = System.DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                                //c.Active_status = "0";
                                c.User_Type_Code = Convert.ToString(arUserTypes[i]);
                                c.User_Type_Name = Convert.ToString(arUserTypeNames[i]);
                            });
                            if (lstAppMenu.Count > 0 || lstAppMappedMenus.Count > 0)
                            {
                                int rowsAffected = objMaster.AppInsertMenuAccess(lstAppMenu,
                                                Convert.ToString(arUserTypes[i]), objCurInfo.GetCompanyCode());
                                if (rowsAffected > 0)
                                {
                                    result = "SUCCESS:The selected menus are successfully mapped to the selected user type";
                                }
                                else
                                {
                                    result = "ERROR:Error while map the menu to selected user type";
                                }
                            }
                            else
                            {
                                result = "SUCCESS:The selected menus are successfully mapped to the selected user type";
                            }
                        }
                    }
                }
                //int rowsAffected = 0;
                //rowsAffected = objMaster.CopyMenuAccess(lstUserTypes, sourceUserTypeCode, objCurInfo.GetCompanyCode(), objCurInfo.GetUserName(),
                //    System.DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss"));
                //if (rowsAffected > 0)
                //{
                //    result = "SUCCESS:Menu Access is copied for the selected user types";
                //}
                //else
                //{
                //    result = "ERROR:Error while copy the menu access";
                //}
                // rowsAffected = objUser.PaySlipInheritance(objCurInfo.GetCompanyCode(), sourceUserTypeCode, lstUserTypes);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("sourceUserTypeCode", sourceUserTypeCode);
                dicObj.Add("userTypes", userTypes);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return result;
        }


        #endregion  UserType Menu Access

        #region Config settings

        public string InsetConfigSetings(string configName, string configValue, string possibleValue, string configType, string mode, string confId)
        {
            DataControl.BLMaster objMaster = new DataControl.BLMaster();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            string result = objMaster.InsetConfigSetings(objCurInfo.GetCompanyCode(), configName, configValue, possibleValue, configType, mode, confId);
            return result;
        }
        public string fnFillConfigDetails()
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLMaster objMaster = new DataControl.BLMaster();
            StringBuilder strContent = new StringBuilder();
            strContent.Append("<table class='table table-striped'><thead><tr><td>Edit</td><td>Config Name</td><td>Config Value</td><td>Possible Values</td>");
            strContent.Append("<td>Config Type</td></tr></thead>");
            try
            {
                IEnumerable<MVCModels.ConfigSettingsModel> lstConfig = null;
                lstConfig = objMaster.GetConfigDetails(objCurInfo.GetCompanyCode());
                if (lstConfig != null)
                {
                    foreach (var configList in lstConfig)
                    {
                        strContent.Append("<tr class='dv_ParentMenu'><td><a onclick='fnConfigEdit(\""
                            + Convert.ToString(configList.Config_Id) + "\");'>Edit</a></td>");
                        strContent.Append("<td>" + configList.Config_Key + "</td>");
                        strContent.Append("<td>" + configList.Config_Value + "</td>");
                        strContent.Append("<td>" + configList.Possible_Values + "</td>");
                        strContent.Append("<td>" + configList.Type + "</td>");
                        strContent.Append("</tr>");
                    }

                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
            }
            return strContent.ToString();
        }

        public JsonResult GetSelectedConfigDetails(string configId)
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLMaster objMaster = new DataControl.BLMaster();
            IEnumerable<MVCModels.ConfigSettingsModel> lstMenu = null;

            lstMenu = objMaster.GetSelectedConfigDetails(objCurInfo.GetCompanyCode(), configId);
            DataControl.JSONConverter objJson = new DataControl.JSONConverter();
            return Json(objJson.Serialize(lstMenu));
        }
        #endregion Config settings

        #region - Menu access for mobile
        public JsonResult GetMenuaccessforMobile()
        {
            List<MVCModels.MenuMasterModel> lstmenus = new List<MVCModels.MenuMasterModel>();
            DataControl.JSONConverter _objjson = new DataControl.JSONConverter();
            BLMaster _oblBlmaster = new BLMaster();
            CurrentInfo _objcur = new CurrentInfo();
            lstmenus = _oblBlmaster.GetMenuaccessforMobile(_objcur.GetCompanyCode(), _objcur.GetUserTypeCode()).ToList();
            return Json(_objjson.Serialize(lstmenus));
        }
        #endregion - Menu access for mobile

        public string AppInsertMenuAccess(string userTypeCode, string selectedMenus, string userTypeName)
        {
            string result = string.Empty;
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLMaster objMaster = new DataControl.BLMaster();
            try
            {
                IEnumerable<MVCModels.MenuMasterModel> lstAllAppMenus = null;
                lstAllAppMenus = objMaster.GetAppParentMenuItems(objCurInfo.GetCompanyCode());
                List<MVCModels.UserTypeAppMenuAccessModel> lstAppMenu = new List<MVCModels.UserTypeAppMenuAccessModel>();
                List<MVCModels.UserTypeAppMenuAccessModel> lstAppMappedMenus = new List<MVCModels.UserTypeAppMenuAccessModel>();
                lstAppMappedMenus = new List<MVCModels.UserTypeAppMenuAccessModel>(objMaster.GetAppUserTypeMenuAccess(objCurInfo.GetCompanyCode(), userTypeCode));

                if (!string.IsNullOrEmpty(selectedMenus))
                {
                    string[] ar = selectedMenus.Split('^');
                    if (ar.Length > 0)
                    {
                        foreach (var drMenu in ar)
                        {
                            if (!string.IsNullOrEmpty(drMenu))
                            {
                                MVCModels.UserTypeAppMenuAccessModel objMenu = new MVCModels.UserTypeAppMenuAccessModel();
                                objMenu.Company_Code = objCurInfo.GetCompanyCode();
                                objMenu.Menu_Id = drMenu.ToString();
                                objMenu.User_Type_Code = userTypeCode;
                                objMenu.User_Type_Name = userTypeName;
                                var filteredList = lstAllAppMenus.AsEnumerable().Where(n => Convert.ToString(n.Menu_ID) == drMenu.ToString()).ToList();
                                if (filteredList.Count > 0)
                                {
                                    objMenu.Menu_Text = filteredList[0].Menu_Text;
                                    objMenu.Menu_URL = filteredList[0].Menu_URL;
                                }
                                objMenu.Created_By = objCurInfo.GetUserName();
                                objMenu.Created_Date = System.DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                                objMenu.Record_Status = "1";
                                lstAppMenu.Add(objMenu);
                            }
                        }
                        //List<MVCModels.UserTypeAppMenuAccessModel> lstAppInsertMenu = lstAppMenu.Where(s => !lstAppMappedMenus.Where(e => e.Menu_Id == s.Menu_Id).Any()).ToList();
                        lstAppMenu.ForEach(c =>
                        {
                            c.Created_By = objCurInfo.GetUserName();
                            c.Created_Date = System.DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                        });
                        lstAppMappedMenus.RemoveAll(s => lstAppMenu.Where(e => e.Menu_Id == s.Menu_Id).Any());
                        lstAppMappedMenus.ForEach(c =>
                        {
                            c.Created_By = objCurInfo.GetUserName();
                            c.Created_Date = System.DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                        });
                        if (lstAppMenu.Count > 0 || lstAppMappedMenus.Count > 0)
                        {
                            int rowsAffected = objMaster.AppInsertMenuAccess(lstAppMenu, userTypeCode, objCurInfo.GetCompanyCode());
                            if (rowsAffected > 0)
                            {
                                result = "SUCCESS:The selected menus are successfully mapped to the selected user type";
                            }
                            else
                            {
                                result = "ERROR:Error while map the menu to selected user type";
                            }
                        }
                        else
                        {
                            result = "SUCCESS:The selected menus are successfully mapped to the selected user type";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
            }
            return result;
        }

        public string GetAppMenuAccessItems()
        {

            DataControl.BLMaster objMaster = new DataControl.BLMaster();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            strMenuContent.Clear();
            try
            {
                IEnumerable<MVCModels.MenuMasterModel> lstMenudet = null;
                lstMenudet = objMaster.GetAppParentMenuItems(objCurInfo.GetCompanyCode());
                strMenuContent.Append("<ul id='ulMenu'>");
                int subMenuCount = 0;
                if (lstMenudet != null)
                {
                    var lstParentMenus = lstMenudet.AsEnumerable().Where(x => x.Menu_ParentID == "0").ToList();
                    if (lstParentMenus.Count > 0)
                    {
                        foreach (var dr in lstParentMenus)
                        {
                            var childMenus = lstMenudet.AsEnumerable().Where(a => Convert.ToString(a.Menu_ParentID) == Convert.ToString(dr.Menu_ID)).ToList();


                            strMenuContent.Append("<li><input type='checkbox' value='" + Convert.ToString(dr.Menu_ID)
                                + "'><label>" + Convert.ToString(dr.Menu_Text) + "</label>");

                            if (childMenus.Count > 0)
                            {
                                strMenuContent.Append("<ul id='ddsubmenu" + subMenuCount.ToString() + "'>");
                                subMenuCount++;
                                GenerateAppSubMenuContent(dr.Menu_ID, lstMenudet);
                                strMenuContent.Append("</ul>");
                            }

                            strMenuContent.Append("</li>");
                        }
                    }
                }
                strMenuContent.Append("</ul>");
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return strMenuContent.ToString();
        }

        //App Menu Master
        public string GetAppParentMenuItems()
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLMaster objMaster = new DataControl.BLMaster();
            StringBuilder strContent = new StringBuilder();
            strContent.Append("<option value=''>-Select Parent-</option>");
            strContent.Append("<option value='0'>[Set as a Parent]</option>");
            try
            {
                IEnumerable<MVCModels.MenuMasterModel> lstMenu = null;
                lstMenu = objMaster.GetAppParentMenuItems(objCurInfo.GetCompanyCode());
                if (lstMenu != null)
                {
                    foreach (var dr in lstMenu)
                    {
                        if (!string.IsNullOrEmpty(Convert.ToString(dr.Parent_Menu_Text)))
                        {
                            strContent.Append("<option value='" + dr.Menu_ID + "'>" + dr.Parent_Menu_Text + "</option>");
                        }
                        else
                        {
                            strContent.Append("<option value='" + dr.Menu_ID + "'>" + dr.Parent_Menu_Text + "</option>");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
            }
            return strContent.ToString();
        }

        //New 
        public string GetAppParentMenuItemsNew()
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLMaster objMaster = new DataControl.BLMaster();
            StringBuilder strContent = new StringBuilder();
            strContent.Append("<option value=''>-Select Parent-</option>");
            strContent.Append("<option value='0'>[Set as a Parent]</option>");
            try
            {
                IEnumerable<MVCModels.MenuMasterModel> lstMenu = null;
                lstMenu = objMaster.GetAppParentMenuItemsNew(objCurInfo.GetCompanyCode());
                if (lstMenu != null)
                {
                    foreach (var dr in lstMenu)
                    {
                        if (!string.IsNullOrEmpty(Convert.ToString(dr.Parent_Menu_Text)))
                        {
                            strContent.Append("<option value='" + dr.Menu_ID + "'>" + dr.Parent_Menu_Text + "</option>");
                        }
                        else
                        {
                            strContent.Append("<option value='" + dr.Menu_ID + "'>" + dr.Parent_Menu_Text + "</option>");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
            }
            return strContent.ToString();
        }

        public ActionResult Kennect()
        {
            return View();
        }

        public JsonResult GetSelectedKennect()
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.BLMaster objMaster = new DataControl.BLMaster();
            IEnumerable<MVCModels.Employeedetails> lstMenu = null;
            lstMenu = objMaster.GetSelectedKennect(objCurInfo.GetCompanyCode(), objCurInfo.GetUserCode());
            DataControl.JSONConverter objJson = new DataControl.JSONConverter();
            return Json(lstMenu , JsonRequestBehavior.AllowGet);
            //  return Json(objJson.Serialize(lstMenu).ToList(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAppParams()
        {
            DataControl.BLMaster objMaster = new DataControl.BLMaster();
            IEnumerable<MVCModels.AppMenuParams> lstMenu = null;
            lstMenu = objMaster.GetAppParams();
            DataControl.JSONConverter objJson = new DataControl.JSONConverter();
            return Json(lstMenu, JsonRequestBehavior.AllowGet);
            //  return Json(objJson.Serialize(lstMenu).ToList(), JsonRequestBehavior.AllowGet);
        }
    }
}
