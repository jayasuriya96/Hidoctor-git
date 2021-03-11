#region Using
using System;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.Collections.Generic;
using DataControl;
#endregion Using

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class ExpenseGroupController : Controller
    {
        #region Create
        public ActionResult Create()
        {
            try
            {
                DataSet ds = new DataSet();
                _objData.OpenConnection(_objCurr.GetCompanyCode());
                {
                    ds = _objData.ExecuteDataSet("exec SP_hdGetExpenseGroup '" + _objCurr.GetCompanyCode() + "'");
                }

                ViewBag.expenseGroup = GetList(ds.Tables[0]);
                return View();
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        #endregion Create

        #region Private Variables
        private DataControl.CurrentInfo _objCurr = new DataControl.CurrentInfo();
        private DataControl.SPData _objSP = new DataControl.SPData();
        private DataControl.Data _objData = new DataControl.Data();
        #endregion Private Variables

        #region Private Method
        private SelectList GetList(DataTable dt)
        {
            List<object> lt = new List<object>();
            if (dt.Rows.Count > 0)
            {
                foreach (DataRow dr in dt.Rows)
                {
                    lt.Add(new
                    {
                        value = dr["Expense_Group_Id"].ToString(),
                        text = dr["Expense_Group_Name"].ToString()
                    });
                }
            }
            return new SelectList(lt.AsEnumerable(), "value", "text");
        }
        #endregion Private Method

        #region Public Method
        public JsonResult GetExpenseTypeDetails(FormCollection coll)
        {
            try
            {

                DataControl.JSONConverter objJson = new DataControl.JSONConverter();
                DataSet dsExpenseDetails = new DataSet();

                _objData.OpenConnection(_objCurr.GetCompanyCode());
                {
                    dsExpenseDetails = _objData.ExecuteDataSet("exec SP_hdGetExpenseTypeDetails '" + _objCurr.GetCompanyCode() + "'");
                }
            

                return Json(objJson.Serialize(dsExpenseDetails));
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

        public JsonResult GetExpenseGroupDetails(FormCollection coll)
        {
            try
            {

                DataControl.JSONConverter objJson = new DataControl.JSONConverter();
                DataSet dsGroupDetails = new DataSet();

                _objData.OpenConnection(_objCurr.GetCompanyCode());
                {
                    dsGroupDetails = _objData.ExecuteDataSet("exec SP_hdGetExpenseGroupDetails '" + _objCurr.GetCompanyCode() + "','" + coll["groupID"].ToString() + "'");
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

        public string UpdateExpenseGroup(FormCollection coll)
        {            
            try
            {
                string result = string.Empty;
                result = _objSP.UpdateExpenseGroup(coll["insertExpense"].ToString(), coll["grpid"].ToString());                
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }           
        }
        public JsonResult InsertExpenseGroup(FormCollection coll)
        {
            try
            {
                string result = string.Empty;
                DataSet ds = new DataSet();
                DataControl.JSONConverter objJson = new DataControl.JSONConverter();
                result = _objSP.InsertExpenseGroup(coll["insertExpense"].ToString(), coll["grpName"].ToString());

                if (result == "SUCCESS")
                {
                    _objData.OpenConnection(_objCurr.GetCompanyCode());
                    {
                        ds = _objData.ExecuteDataSet("exec SP_hdGetExpenseGroup '" + _objCurr.GetCompanyCode() + "'");
                    }
                 
                }
                return Json(objJson.Serialize(ds));
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
        #endregion Public Method
    }
}
