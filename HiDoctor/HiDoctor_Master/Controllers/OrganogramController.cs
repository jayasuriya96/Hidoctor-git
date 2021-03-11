using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using ElmahWrapper;
using DataControl;
using MVCModels;
using System.Text;
using HiDoctor_Master.Models;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class OrganogramController : Controller
    {
        private DataControl.SPData _objSPData = new DataControl.SPData();
        private DataControl.CurrentInfo _objcurrentInfo = new DataControl.CurrentInfo();
        DataControl.Data _objData = new DataControl.Data();
        private BLRegion _objBLRegion;
        //
        // GET: /Organogram/

        public ActionResult Index()
        {
            return View();
        }

        //
        // GET: /Organogram/Details/5

        public ActionResult Details(int id)
        {
            return View();
        }

        //
        // GET: /Organogram/Create

        public ActionResult Create()
        {
            ViewBag.Cur_Region_Code = _objcurrentInfo.GetRegionCode();
            ViewBag.Cur_User_Code = _objcurrentInfo.GetUserCode();
            ViewBag.Lat = _objcurrentInfo.GetLattitude();
            ViewBag.Long = _objcurrentInfo.GetLongitude();
            return View();
        }


        public ActionResult RegionLockMapping()
        {
            return View();
        }

        //
        // POST: /Organogram/Create
        /// <summary>
        /// REgion master insert and update
        /// </summary> 
        /// <returns>SUCCESS OR FAILURE</returns>

        [HttpPost]
        public string Create(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here
                string result = "";
                if (collection["RegionCode"].ToString() == "")
                {
                    string regionCode = _objData.GetMaxCode(_objcurrentInfo.GetCompanyCode(), "tbl_SFA_Region_Master", "Region_Code", "REC");
                    result = _objSPData.InsertRegionMaster(_objcurrentInfo.GetCompanyCode(), regionCode, collection["RegionName"].ToString(), collection["RegionTypeCode"].ToString(),
                        collection["UnderRegionCode"], collection["RegionStatus"].ToString(), collection["RegionClassification"].ToString(),
                        collection["RegionClassification"].ToString(), "", collection["ExpenseGroupId"].ToString(), "",
                        collection["Country"].ToString(), collection["State"].ToString(), collection["City"].ToString(), collection["LocalArea"].ToString(),
                        collection["Lat"].ToString(), collection["Long"].ToString());
                }
                else
                {
                    result = _objSPData.UpdateRegionMaster(_objcurrentInfo.GetCompanyCode(), collection["RegionCode"].ToString(), collection["RegionName"].ToString(), collection["RegionTypeCode"].ToString(),
                       collection["UnderRegionCode"], collection["RegionStatus"].ToString(), collection["RegionClassification"].ToString(),
                       collection["RegionClassification"].ToString(), "", collection["ExpenseGroupId"].ToString(), "",
                       collection["Country"].ToString(), collection["State"].ToString(), collection["City"].ToString(), collection["LocalArea"].ToString(),
                        collection["Lat"].ToString(), collection["Long"].ToString());
                }
                return result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "Create()");
                return "";
            }
        }

        //
        // GET: /Organogram/Edit/5

        public ActionResult Edit(int id)
        {
            return View();
        }

        //
        // POST: /Organogram/Edit/5

        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /Organogram/Delete/5

        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /Organogram/Delete/5

        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }


        public ActionResult RegionExcelBlukUpload()
        {
            return View();
        }



        /// <summary>
        /// Get user master details for tree generation
        /// </summary> 
        public JsonResult GetUserTreeDetails()
        {
            try
            {
                DataSet ds = new DataSet();
                DataControl.Data _objData = new DataControl.Data();
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                {
                    ds = _objData.ExecuteDataSet("exec SP_hdGetUserTreeDetails '" + _objcurrentInfo.GetCompanyCode() + "'");
                }

                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        /// <summary>
        /// Get region master details for tree generation
        /// </summary> 
        public JsonResult GetRegionTreeDetails()
        {
            try
            {
                DataSet ds = new DataSet();
                DataControl.Data _objData = new DataControl.Data();
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                {
                    ds = _objData.ExecuteDataSet("exec SP_hdGetRegionTreeDetails '" + _objcurrentInfo.GetCompanyCode() + "'");
                }
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        /// <summary>
        /// Get dependening data for region master insert or upadte
        /// </summary> 
        public JsonResult GetRegionMasterDetails()
        {
            try
            {
                DataSet ds = new DataSet();
                DataControl.Data _objData = new DataControl.Data();
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                {
                    string strQry = "exec SP_hd_Region_Type_Select '" + _objcurrentInfo.GetCompanyCode() + "';";
                    strQry += "exec SP_hdGetChildRegionsForRegionMaster '" + _objcurrentInfo.GetCompanyCode()+"'" + ","+"'"+_objcurrentInfo.GetRegionCode()+"';";
                    strQry += "exec SP_hdGetRegionClassificationMasterData '" + _objcurrentInfo.GetCompanyCode() + "';";
                    strQry += "exec SP_hdGetExpenseGroup '" + _objcurrentInfo.GetCompanyCode() + "'";
                    strQry += "exec SP_HD_CheckAssignRegionName'" + _objcurrentInfo.GetCompanyCode() + "'";
                    ds = _objData.ExecuteDataSet(strQry);
                }
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        /// <summary>
        /// Get the selected region details
        /// </summary> 
        public JsonResult GetRegionDetails(FormCollection collection)
        {
            try
            {
                DataSet ds = new DataSet();
                DataControl.Data _objData = new DataControl.Data();
                _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
                {
                    ds = _objData.ExecuteDataSet("EXEC SP_hdGetSelectedRegion '" + _objcurrentInfo.GetCompanyCode() + "','" + collection["RegionCode"].ToString() + "'");
                }
                DataControl.JSONConverter json = new DataControl.JSONConverter();
                return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        /// <summary>
        /// Get the depending user details for user master insert or update
        /// </summary> 

        //public JsonResult GetUserMasterDetails()
        //{
        //    try
        //    {
        //        DataSet ds = new DataSet();
        //        DataControl.Data _objData = new DataControl.Data();
        //        _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
        //        {
        //            string strQry = "exec SP_hd_User_Type_Select '" + _objcurrentInfo.GetCompanyCode() + "';";
        //            strQry += "exec SP_hdGetEmployee '" + _objcurrentInfo.GetCompanyCode() + "';";
        //            strQry += "exec SP_hdGetUsers '" + _objcurrentInfo.GetCompanyCode() + "';";
        //            strQry += "exec SP_hdGetDivisions '" + _objcurrentInfo.GetCompanyCode() + "';";
        //            strQry += "exec SP_hdGetRegion '" + _objcurrentInfo.GetCompanyCode() + "';";
        //            strQry += "exec SP_hdGetDoctorCategory '" + _objcurrentInfo.GetCompanyCode() + "';";
        //            strQry += "exec SP_hdGetExpenseGroup '" + _objcurrentInfo.GetCompanyCode() + "'";
        //            ds = _objData.ExecuteDataSet(strQry);
        //        }

        //        DataControl.JSONConverter json = new DataControl.JSONConverter();
        //        return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        //    }
        //    finally
        //    {
        //        _objData.CloseConnection();
        //    }
        //}

        /// <summary>
        /// User master insert and update
        /// </summary> 
        //[HttpPost]
        //public string insertUser(FormCollection collection)
        //{
        //    try
        //    {
        //        // TODO: Add insert logic here
        //        string result = "";
        //        //string hidoctorStartDate = collection["HiDOCTOR_Start_Date"].ToString();
        //        string hidoctorStartDate = "";
        //        if (!string.IsNullOrEmpty(collection["HiDOCTORStartDate"].ToString()))
        //        {
        //            hidoctorStartDate = collection["HiDOCTORStartDate"].ToString().Split('/')[1] + "/" + collection["HiDOCTORStartDate"].ToString().Split('/')[0] + "/" + collection["HiDOCTORStartDate"].ToString().Split('/')[2];
        //        }
        //        else
        //        {
        //            hidoctorStartDate = DateTime.Now.ToString("yyyy-MM-dd");
        //        }
        //        if (collection["UserCode"].ToString() == "")
        //        {
        //            string userCode = _objData.GetMaxCode(_objcurrentInfo.GetCompanyCode(), "tbl_SFA_User_Master", "User_Code", "USC");
        //            //result = _objSPData.InsertUserMaster(_objcurrentInfo.GetCompanyCode(), userCode, collection["EmployeeCode"].ToString(), collection["UserTypeCode"].ToString(),
        //            //    collection["UnderUserCode"], collection["UserName"].ToString(), collection["UserPass"].ToString(),
        //            //    collection["Status"].ToString(), collection["RegionCode"].ToString(), collection["UserDivisionCode"].ToString(),
        //            //    collection["UserCategoryCode"].ToString(), collection["ExpenseEligibilityRegion"].ToString(), collection["ExpenseGroupId"].ToString(),
        //            //  Convert.ToDateTime(hidoctorStartDate).ToString("yyyy-MM-dd"), "");
        //        }
        //        else
        //        {
        //            result = _objSPData.UpdateUserMaster(_objcurrentInfo.GetCompanyCode(), collection["UserCode"].ToString(), collection["EmployeeCode"].ToString(), collection["UserTypeCode"].ToString(),
        //                collection["UnderUserCode"], collection["UserName"].ToString(), collection["UserPass"].ToString(),
        //                collection["Status"].ToString(), collection["RegionCode"].ToString(), collection["UserDivisionCode"].ToString(),
        //                collection["UserCategoryCode"].ToString(), collection["ExpenseEligibilityRegion"].ToString(), collection["ExpenseGroupId"].ToString(),
        //              Convert.ToDateTime(hidoctorStartDate).ToString("yyyy-MM-dd"), "");
        //        }
        //        return result;
        //    }
        //    catch (Exception ex)
        //    {
        //        ErrorLog.LogError(ex, "insertUser()");
        //        return "";
        //    }
        //}
        ///// <summary>
        ///// Get selected user details
        ///// </summary> 
        //public JsonResult GetSelectedUserDetails(FormCollection collection)
        //{
        //    try
        //    {
        //        DataSet ds = new DataSet();
        //        DataControl.Data _objData = new DataControl.Data();
        //        _objData.OpenConnection(_objcurrentInfo.GetCompanyCode());
        //        {
        //            ds = _objData.ExecuteDataSet("EXEC SP_hdGetSelectedUser '" + _objcurrentInfo.GetCompanyCode() + "','" + collection["UserCode"].ToString() + "'");
        //        }

        //        DataControl.JSONConverter json = new DataControl.JSONConverter();
        //        return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        //    }
        //    finally
        //    {
        //        _objData.CloseConnection();
        //    }
        //}

        /// <summary>
        /// Update region master seq_index column while change the parent region using drag and drop
        /// </summary> 

        public string UpdateRegionSeq(FormCollection collection)
        {
            string result = "";
            try
            {
                // TODO: Add insert logic here
                result = _objSPData.UpdateRegionSeqIndex(_objcurrentInfo.GetCompanyCode(), collection["Node"].ToString(), collection["SourceNode"].ToString(), collection["HitMode"].ToString());
                return result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "UpdateRegionSeq()");
                return "";
            }
        }
        /// <summary>
        /// Update user master seq_index column while change the parent user using drag and drop
        /// </summary> 
        public string UpdateUserSeq(FormCollection collection)
        {
            string result = "";
            try
            {
                // TODO: Add insert logic here
                result = _objSPData.UpdateUserSeqIndex(_objcurrentInfo.GetCompanyCode(), collection["Node"].ToString(), collection["SourceNode"].ToString(), collection["HitMode"].ToString());
                return result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "UpdateUserSeq()");
                return "";
            }
        }
        /// <summary>
        /// Update region master all full_index column while  click the refresh button
        /// </summary> 
        public string UpdateRegionFullIndex()
        {
            string result = "";
            try
            {
                // TODO: Add insert logic here
                result = _objSPData.UpdateRegionFullIndex(_objcurrentInfo.GetCompanyCode());
                return result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "UpdateRegionFullIndex()");
                return "";
            }
        }

        /// <summary>
        /// Update user master all full_index column while  click the refresh button
        /// </summary> 
        public string UpdateUserFullIndex()
        {
            string result = "";
            try
            {
                // TODO: Add insert logic here
                result = _objSPData.UpdateUserFullIndex(_objcurrentInfo.GetCompanyCode());
                return result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "UpdateUserFullIndex()");
                return "";
            }
        }

        public string UpdateUserFullIndexNew()
        {
            string result = "";
            try
            {
                // TODO: Add insert logic here
                result = _objSPData.UpdateUserFullIndexNew(_objcurrentInfo.GetCompanyCode());
                return result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "UpdateUserFullIndex()");
                return "";
            }
        }
        /// <summary>
        /// Region disable
        /// </summary> 
        public string UpdateRegionStatus(FormCollection collection)
        {
            string result = "";
            try
            {
                // TODO: Add insert logic here
                result = _objSPData.UpdateRegionStatus(_objcurrentInfo.GetCompanyCode(), collection["RegionCode"].ToString());
                return result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "UpdateRegionStatus()");
                return "";
            }
        }
        ///// <summary>
        ///// User disable
        ///// </summary> 
        //public string UpdateUserStatus(FormCollection collection)
        //{
        //    string result = "";
        //    try
        //    {
        //        // TODO: Add insert logic here
        //        result = _objSPData.UpdateUserStatus(_objcurrentInfo.GetCompanyCode(), collection["UserCode"].ToString());
        //        return result;
        //    }
        //    catch (Exception ex)
        //    {
        //        ErrorLog.LogError(ex, "UpdateUserStatus()");
        //        return "";
        //    }
        //}

        /// <summary>
        /// Move region mode up
        /// </summary> 
        public string RegionNodeUp(FormCollection collection)
        {
            string result = "";
            try
            {
                // TODO: Add insert logic here
                result = _objSPData.RegionNodeUp(_objcurrentInfo.GetCompanyCode(), collection["RegionCode"].ToString(),_objcurrentInfo.GetUserName());
                return result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "RegionNodeUp()");
                return "";
            }
        }
        /// <summary>
        /// Move user mode up
        /// </summary> 
        public string UserNodeUp(FormCollection collection)
        {
            string result = "";
            try
            {
                // TODO: Add insert logic here
                result = _objSPData.UserNodeUp(_objcurrentInfo.GetCompanyCode(), collection["UserCode"].ToString(),_objcurrentInfo.GetUserName());
                return result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "UserNodeUp()");
                return "";
            }
        }
        /// <summary>
        /// Move region mode down
        /// </summary> 
        public string RegionNodeDown(FormCollection collection)
        {
            string result = "";
            try
            {
                // TODO: Add insert logic here
                result = _objSPData.RegionNodeDown(_objcurrentInfo.GetCompanyCode(), collection["RegionCode"].ToString(),_objcurrentInfo.GetUserName());
                return result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "RegionNodeDown()");
                return "";
            }
        }
        /// <summary>
        /// Move user mode down
        /// </summary> 
        public string UserNodeDown(FormCollection collection)
        {
            string result = "";
            try
            {
                // TODO: Add insert logic here
                result = _objSPData.UserNodeDown(_objcurrentInfo.GetCompanyCode(), collection["UserCode"].ToString(),_objcurrentInfo.GetUserName());
                return result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "UserNodeDown()");
                return "";
            }
        }

        /// <summary>
        /// Parent region change
        /// </summary> 
        public string RegionHierarchyChange(FormCollection collection)
        {
            string result = "";
            try
            {
                // TODO: Add insert logic here
                result = _objSPData.UpdateRegionHierarchy(_objcurrentInfo.GetCompanyCode(), collection["RegionCodes"].ToString(),
                      collection["UnderRegionCode"]);

                return result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "RegionHierarchyChange()");
                return "";
            }
        }
        /// <summary>
        /// Parent User change
        /// </summary> 

        public string UserHierarchyChange(FormCollection collection)
        {
            string result = "";
            try
            {
                // TODO: Add insert logic here
                result = _objSPData.UpdateUserHierarchy(_objcurrentInfo.GetCompanyCode(), collection["UserCodes"].ToString(),
                      collection["UnderUserCode"]);

                return result;
            }
            catch (Exception ex)
            {
                ErrorLog.LogError(ex, "UserHierarchyChange()");
                return "";
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        //public ActionResult DownloadRegionExcelTemplate()
        //{
        //    return new DownloadResult { VirtualPath = "~/Content/XLTemplates/Region_Upload.xlsx", FileDownloadName = "Region_Upload.xlsx" };
        //    //return new DownloadResult { VirtualPath = "~/Content/XLTemplates/" + File_Name.ToUpper() + "_MASTER.csv", FileDownloadName = File_Name.ToUpper() + "_MASTER.csv" };
        //}

        public void DownloadRegionExcelTemplate()
        {
            try
            {

                DataControl.Repository.FileDownload objFileDownload = new DataControl.Repository.FileDownload();
                DataControl.Abstraction.IFileProvider objProvider = new DataControl.Impl.FileSystemProvider();
                string error = string.Empty;

                string fileName = "Region_Upload.xlsx";
                string blobURL = objProvider.GetConfigValue("EXCELTEMPLATES") + fileName;

                objFileDownload.DownloadFile(blobURL, fileName, out error);

                // return new DownloadResult { VirtualPath = "~/Content/XLTemplates/EmployeeMaster.xls", FileDownloadName = "EmployeeMaster.xls" };
                //return new DownloadResult { VirtualPath = "~/Content/XLTemplates/" + File_Name.ToUpper() + "_MASTER.csv", FileDownloadName = File_Name.ToUpper() + "_MASTER.csv" };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost]
        public ActionResult UploadedRegionExcel(HttpPostedFileBase fileUpload)
        {
            _objBLRegion = new BLRegion();
            string companyCode = _objcurrentInfo.GetCompanyCode();
            string subDomain = _objcurrentInfo.GetSubDomain();
            string user_Code = _objcurrentInfo.GetUserCode();
            string errorCode = _objBLRegion.InsertRegionMasterBulkUpload(subDomain, companyCode, fileUpload, user_Code,_objcurrentInfo.GetUserName());
            ViewBag.ErrorCode = errorCode;
            return View();
        }

        private IEnumerable<RegionLockMappingModel> GetListActiveRegionLockMapping(string company_Code)
        {
            _objBLRegion = new BLRegion();
            _objcurrentInfo = new CurrentInfo();
            IEnumerable<RegionLockMappingModel> lstRegionLockModel = _objBLRegion.GetActiveRegionLockMapping(company_Code);
            return lstRegionLockModel;
        }
        public int UnmapRegionslock(string Regioncode)
        {
            int result = 0;
            _objBLRegion = new BLRegion();
            _objcurrentInfo = new CurrentInfo();

            string UserName = string.Empty;
            UserName = _objcurrentInfo.GetUserName();
            result = _objBLRegion.UnmapRegionslock(Regioncode, UserName);
            return result;
        }
        private StringBuilder ConvertListToHTMLFormat(List<RegionLockMappingModel> lstRegionLockMapping)
        {

            StringBuilder strRegionLockTableBuilder = new StringBuilder();
            if (lstRegionLockMapping != null && lstRegionLockMapping.Count > 0)
            {
                int rowNo = 0;
                strRegionLockTableBuilder.Append("<table cellspacing='0' cellpadding='0' id='tblSFCRegions' class='table table-striped'><thead><tr>");
                strRegionLockTableBuilder.Append("<th style='text-align:left'>Region Type Name</th>");
                strRegionLockTableBuilder.Append("<th style='text-align:left'>Region Name</th>");
                strRegionLockTableBuilder.Append("<th style='text-align:left'>Mapped Date</th>");
                strRegionLockTableBuilder.Append("<th style='text-align:left'>Region Status</th>");
                strRegionLockTableBuilder.Append("<th style='text-align:left'>Action</th>");
                strRegionLockTableBuilder.Append("</tr></thead><tbody>");

                foreach (RegionLockMappingModel regionLock in lstRegionLockMapping)
                {
                    rowNo++;
                    strRegionLockTableBuilder.Append("<tr>");


                    strRegionLockTableBuilder.Append("<td><span id='spnRegionType_");
                    strRegionLockTableBuilder.Append(rowNo.ToString());
                    strRegionLockTableBuilder.Append("'>");
                    strRegionLockTableBuilder.Append(regionLock.Region_Type_Name);
                    strRegionLockTableBuilder.Append("</span><span style='display:none' id='spnRegionCode_");
                    strRegionLockTableBuilder.Append(rowNo.ToString());
                    strRegionLockTableBuilder.Append("'>");
                    strRegionLockTableBuilder.Append(regionLock.Region_Type_Code);
                    strRegionLockTableBuilder.Append("</span></td>");


                    strRegionLockTableBuilder.Append("<td><span id='spnRegion_");
                    strRegionLockTableBuilder.Append(rowNo.ToString());
                    strRegionLockTableBuilder.Append("'>");
                    strRegionLockTableBuilder.Append(regionLock.Region_Name);
                    strRegionLockTableBuilder.Append("</span><span style='display:none' id='spnRegionCode_");
                    strRegionLockTableBuilder.Append(rowNo.ToString());
                    strRegionLockTableBuilder.Append("'>");
                    strRegionLockTableBuilder.Append(regionLock.Region_Code);
                    strRegionLockTableBuilder.Append("</span></td>");

                   
                    strRegionLockTableBuilder.Append("<td><span id='spnRegiondate_");
                    strRegionLockTableBuilder.Append(rowNo.ToString());
                    strRegionLockTableBuilder.Append("'>");
                    strRegionLockTableBuilder.Append(regionLock.Created_DateTime);
                    strRegionLockTableBuilder.Append("</span><span style='display:none' id='spnRegionCode_");
                    strRegionLockTableBuilder.Append(rowNo.ToString());
                    strRegionLockTableBuilder.Append("'>");
                    strRegionLockTableBuilder.Append(regionLock.Region_Code);
                    strRegionLockTableBuilder.Append("</span></td>");


                    //strRegionLockTableBuilder.Append("<td><span id='spnRegiondate_");
                    //strRegionLockTableBuilder.Append(rowNo.ToString());
                    //strRegionLockTableBuilder.Append("'>");
                    ////strRegionLockTableBuilder.Append(regionLock.Region_Status);
                    if (regionLock.Region_Status == "1")
                    {
                        strRegionLockTableBuilder.Append("<td>Active</td>");
                    }
                    else
                    {
                        strRegionLockTableBuilder.Append("<td>In Active</td>");
                    }
                    //strRegionLockTableBuilder.Append("</span><span style='display:none' id='spnRegionCode_");
                    //strRegionLockTableBuilder.Append(rowNo.ToString());
                    //strRegionLockTableBuilder.Append("'>");
                    //strRegionLockTableBuilder.Append(regionLock.Region_Code);
                    //strRegionLockTableBuilder.Append("</span></td>");





                    strRegionLockTableBuilder.Append("<td><a href='#' onclick='fnUnmapRegionlock(\"" + regionLock.Region_Code + "\");'>Unmap</a><span id='spnRegionaction_");
                    strRegionLockTableBuilder.Append(rowNo.ToString());
                    strRegionLockTableBuilder.Append("'>");
                   
                    strRegionLockTableBuilder.Append("</span></td>");

                    strRegionLockTableBuilder.Append("</tr>");
                }
                strRegionLockTableBuilder.Append("</tbody></table>");
            }
            else
            {
                strRegionLockTableBuilder.Append("<span>No Region Lock Mapping Details.</span>");
            }
            return strRegionLockTableBuilder;
        }

        public JsonResult GetActiveRegionLockMappingHTMLFormat()
        {
            try
            {
                _objcurrentInfo = new CurrentInfo();
                string company_Code = _objcurrentInfo.GetCompanyCode();
                List<RegionLockMappingModel> lstRegionLockMappingModel = GetListActiveRegionLockMapping(company_Code).ToList();
                //return ConvertListToHTMLFormat(lstRegionLockMappingModel).ToString();
                return Json(lstRegionLockMappingModel, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw;
            }
        }
        public JsonResult GetMappedRegion()
        {
           // _objcurrentInfo = new CurrentInfo();
            string company_Code = string.Empty;
            company_Code = _objcurrentInfo.GetCompanyCode();
            List<RegionLockMappingModel> lstRegDet = new List<RegionLockMappingModel>();
            _objBLRegion = new BLRegion();
            lstRegDet = _objBLRegion.GetMappedRegion(company_Code);
            return Json(lstRegDet, JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetActiveRegionLockJson()
        {
            try
            {
                _objcurrentInfo = new CurrentInfo();
                string company_Code = _objcurrentInfo.GetCompanyCode();
                List<RegionLockMappingModel> lstRegionLockMappingModel = GetListActiveRegionLockMapping(company_Code).ToList();
                return Json(lstRegionLockMappingModel);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw;
            }
        }
        //public bool InsertRegionLock(List<RegionLockMappingModel> lstRegionLockMapping)
        //{
        //    bool result = false;
        //    DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
        //    string UserName = objCurInfo.GetUserName();
        //    string CompanyCode = objCurInfo.GetCompanyCode();
        //    string RegionCode = objCurInfo.GetRegionCode();
        //    string RegionTypeCode = null;
        //    //string RegionTypeCode = lstRegionLockMapping[i].Region_Type_Code;
        //    result = _objBLRegion.InsertRegionLockMapping(lstRegionLockMapping, CompanyCode, RegionCode, RegionTypeCode, UserName);
        //    return result;
        //}

        public bool InsertRegionLock(string regionLockJson)
        {
            try
            {
                _objcurrentInfo = new CurrentInfo();
                _objBLRegion = new BLRegion();
                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                string UserName = objCurInfo.GetUserName();
                string CompanyCode = objCurInfo.GetCompanyCode();
                // RegionCode = objCurInfo.GetRegionCode();
               
               // string company_Code = _objcurrentInfo.GetCompanyCode();
                return _objBLRegion.InsertRegionLockMapping(CompanyCode, UserName, regionLockJson);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                dicContext.Add("region Lock Json:", regionLockJson);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
                throw;
            }
        }
        public JsonResult GetCurrentMapDetails()
        {
            try
            {
                _objcurrentInfo = new CurrentInfo();
                _objBLRegion = new BLRegion();
                List<MapConfigDetails> lstMap = new List<MapConfigDetails>();
                lstMap = _objBLRegion.GetCurrentMapDetails(_objcurrentInfo.GetCompanyCode()).ToList();
                return Json(lstMap, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public void DownloadSubList()
        {
            DataControl.BLUser objUser = new BLUser();
            DataControl.CurrentInfo objCurInfo = new CurrentInfo();
            string companyCode = objCurInfo.GetCompanyCode();
            DataSet Ds = new DataSet();
            Ds = objUser.DownloadSubList(companyCode);
            Ds.Tables[0].TableName = "State Details";
            Ds.Tables[1].TableName = "City Details";
            Ds.Tables.RemoveAt(3);
            Ds.Tables.RemoveAt(2);
            HttpResponse response = System.Web.HttpContext.Current.Response;
            DownloadExcel excel = new DownloadExcel();
            excel.Convert(Ds, "State_City" + "_" + DateTime.Now.ToShortDateString(), response);

        }
        public void DownloadMasterList()
        {
            DataControl.BLUser objUser = new BLUser();
            DataControl.CurrentInfo objCurInfo = new CurrentInfo();
            string companyCode = objCurInfo.GetCompanyCode();
            DataSet Ds = new DataSet();
            Ds = objUser.DownloadMasterList(companyCode);
            Ds.Tables[0].TableName = "Region Details";
            Ds.Tables[1].TableName = "Region Type Details";
            Ds.Tables[2].TableName = "Region Classification Details";
            Ds.Tables[3].TableName = "Expense Group Details";
            Ds.Tables[4].TableName = "Price Group Details";
            Ds.Tables[5].TableName = "State Details";
            Ds.Tables[6].TableName = "City Details";
            HttpResponse response = System.Web.HttpContext.Current.Response;
            DownloadExcel excel = new DownloadExcel();
            excel.Convert(Ds, "Master_List" + "_" + DateTime.Now.ToShortDateString(), response);

        }
    }
}
