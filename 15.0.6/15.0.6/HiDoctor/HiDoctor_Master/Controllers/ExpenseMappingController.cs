using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using DataControl;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class ExpenseMappingController : Controller
    {
        #region Create
        //
        // GET: /ExpenseMapping/Create

        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /ExpenseMapping/Create

        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
        #endregion Create


        #region Private Variables
        private DataControl.CurrentInfo _objCurr = new DataControl.CurrentInfo();
        private DataControl.SPData _objSP = new DataControl.SPData();
        private DataControl.Data _objData = new DataControl.Data();
        #endregion Private Variables


        #region Get ExpenseMapping MasterData
        public JsonResult GetExpenseMappingMasterData()
        {
            Models.ExpensesMapping objExpensesMapping = new Models.ExpensesMapping();
            DataSet ds = new DataSet();
            ds = objExpensesMapping.GetExpenseMappingMasterData();
            DataControl.JSONConverter json = new DataControl.JSONConverter();
            return Json(json.Serialize(ds), JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Get Regions
        public JsonResult GetRegions(FormCollection collection)
        {
            string divisionCode = collection["DivisionCode"];
            string regionTypeCode = collection["RegionTypeCode"];
            string regionClassificatinCode = collection["RegionClassificatinCode"];
            string expenseGroup = collection["ExpenseGroup"];
            Models.ExpensesMapping objExpensesMapping = new Models.ExpensesMapping();
            DataTable dt = new DataTable();

            dt = objExpensesMapping.GetRegions(divisionCode == "0" ? "" : divisionCode, regionTypeCode == "0" ? "" : regionTypeCode, regionClassificatinCode == "0" ? "" : regionClassificatinCode, expenseGroup == "0" ? "" : expenseGroup);
            List<Models.ExpensesMapping> lstCombo = (from c in dt.AsEnumerable()
                                                     select new Models.ExpensesMapping
                                                {
                                                    RegionCode = c["Region_Code"].ToString(),
                                                    RegionName = c["Region_Name"].ToString()
                                                }
                                                ).ToList<Models.ExpensesMapping>();
            return Json(lstCombo, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Get Users
        public JsonResult GetUsers(FormCollection collection)
        {
            string divisionCode = collection["DivisionCode"];
            string userTypeCode = collection["UserTypeCode"];
            string regionClassification = collection["RegionClassification"];
            string regionTypeCode = collection["RegionTypeCode"];
            string expenseGroup = collection["ExpenseGroup"];
            Models.ExpensesMapping objExpensesMapping = new Models.ExpensesMapping();
            DataTable dt = new DataTable();

            dt = objExpensesMapping.GetUsers(divisionCode == "0" ? "" : divisionCode, userTypeCode == "0" ? "" : userTypeCode, expenseGroup == "0" ? "" : expenseGroup, regionClassification == "0" ? "" : regionClassification, regionTypeCode == "0" ? "" : regionTypeCode);
            List<Models.ExpensesMapping> lstCombo = (from c in dt.AsEnumerable()
                                                     select new Models.ExpensesMapping
                                                {
                                                    UserCode = c["User_Code"].ToString(),
                                                    UserName = c["User_Name"].ToString()
                                                }
                                                ).ToList<Models.ExpensesMapping>();
            return Json(lstCombo, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Type Insert
        public string TypeInsert(FormCollection collection)
        {
            string strQry = string.Empty;
            string result = string.Empty;
            string expenseGroup = collection["ExpenseGroup"];
            int rowCount = int.Parse(collection["rowCount"]);
            string type = collection["Type"];
            DataControl.CurrentInfo _ObjCurInfo = new DataControl.CurrentInfo();
            Models.ExpensesMapping objExpensesMapping = new Models.ExpensesMapping();
            if (type == "Region")
            {
                for (int i = 1; i <= rowCount - 1; i++)
                {
                    strQry += "Exec SP_hdUpdateExpenseGroupInRegionMaster '" + collection["cbk_" + i.ToString()] + "','" + expenseGroup + "','" + collection["Checked_" + i.ToString()] + "','" + _ObjCurInfo.GetCompanyCode() + "';";
                    //objExpensesMapping.RegionExpenseInsert(collection["cbk_" + i.ToString()], ExpenseGroup, collection["Checked_" + i.ToString()]);
                }
                result = objExpensesMapping.ExpenseMappingInsert(strQry);
            }
            else if (type == "User")
            {
                for (int i = 1; i <= rowCount - 1; i++)
                {
                    strQry += "Exec SP_hdUpdateExpenseGroupInUserMaster '" + collection["cbk_" + i.ToString()] + "','" + expenseGroup + "','" + collection["Checked_" + i.ToString()] + "','" + _ObjCurInfo.GetCompanyCode() + "';";
                    //objExpensesMapping.UserExpenseInsert(collection["cbk_" + i.ToString()], ExpenseGroup, collection["Checked_" + i.ToString()]);
                }
                result = objExpensesMapping.ExpenseMappingInsert(strQry);
            }
            return result;
        }
        #endregion

        public JsonResult GetExpenseGroupDetails(FormCollection coll)
        {
            try
            {

                DataControl.JSONConverter objJson = new DataControl.JSONConverter();
                DataSet dsGroupDetails = new DataSet();

                _objData.OpenConnection(_objCurr.GetCompanyCode());
                {
                    dsGroupDetails = _objData.ExecuteDataSet("exec SP_hdGetExpenseGroupDetailsForMapping '" + _objCurr.GetCompanyCode() + "','" + coll["groupID"].ToString() + "'");
                }
            

                return Json(objJson.Serialize(dsGroupDetails));
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string GetExpenseGroupMaxID(FormCollection coll)
        {
            try
            {
                string expenseID = string.Empty;

                _objData.OpenConnection(_objCurr.GetCompanyCode());
                {
                    expenseID = Convert.ToString(_objData.ExecuteScalar("exec SP_hdGetExpenseGroupMaxID '" + _objCurr.GetCompanyCode() + "'"));
                }
              

                return expenseID;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

    }
}
