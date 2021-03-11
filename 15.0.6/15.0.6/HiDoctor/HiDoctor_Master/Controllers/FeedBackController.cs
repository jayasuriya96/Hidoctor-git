using DataControl;
using DataControl.HiDoctor_ActivityFactoryClasses;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MVCModels;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class FeedBackController : Controller
    {
        // To View ICE Questions Mapping Page
        public ActionResult ICEQuestionsMapping()
        {
           
            return View();
        }
        // To View In Chamber Effectiveness Form
        public ActionResult InChamberEffectivenessForm()
        {
            CurrentInfo _ObjectCurrentInfo = new CurrentInfo();
            ViewBag.User_Code = _ObjectCurrentInfo.GetUserCode();
            ViewBag.User_Name = _ObjectCurrentInfo.GetUserName();
            return View();
        }
        public ActionResult ICETasksView(string id)
        {
            ViewBag.ICETaskMenu = id;
            return View();
        }
        public ActionResult ICERatingParameters()
        {
            return View();
        }
        /// <summary>
        /// To Get Active User Types
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [ActionName("GetActiveUserTypes")]
        public JsonResult GetActiveUserTypes()
        {
            string company_code = null;
            try
            {
                BL_ICE objusertyp = new BL_ICE();
                CurrentInfo _ObjectCurrentInfo = new CurrentInfo();               
                company_code=ViewBag.Company_Code =_ObjectCurrentInfo.GetCompanyCode();
                return Json(objusertyp.GetActiveUserTypes(company_code).ToList(), JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex)
            {
                throw;
            }           
        }
        /// <summary>
        /// Method to Get Active Users
        /// </summary>
        /// <param name="userCode"></param>
        /// <param name="includeOneLevelParent"></param>
        /// <param name="excludeFirstLevel"></param>
        /// <returns></returns>
        [HttpGet]
        [ActionName("GetActiveUsers")]
        public JsonResult GetActiveUsers(string userCode, string includeOneLevelParent, string excludeFirstLevel)
        {
            string companyCode = null;
            string currentUserCode = null;
            try
            {
                BL_ICE objtree = new BL_ICE();
                CurrentInfo _ObjectCurrentInfo = new CurrentInfo();
                companyCode = ViewBag.Company_Code = _ObjectCurrentInfo.GetCompanyCode();
                currentUserCode = ViewBag.Current_User_Code = _ObjectCurrentInfo.GetUserCode();
                return Json(objtree.GetActiveUsers(companyCode, userCode, includeOneLevelParent, excludeFirstLevel,currentUserCode), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        /// <summary>
        /// Method to Insert Mapped Questions
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="usertypeCode"></param>
        /// <param name="createdBy"></param>
        /// <param name="Questions"></param>
        /// <returns></returns>
        [HttpPost]
       [ActionName("InsertNewMappingQuestions")]
       public bool InsertNewMappingQuestions(string usertypeCode,string Questions)
        {
            bool result = false;
            try
            {
                string companyCode = null;
                string createdBy = null;
                if (!string.IsNullOrEmpty(Questions))
                {
                    var questions = JsonConvert.DeserializeObject<List<string>>(Questions);

                    foreach (string qstns in questions)
                    {                       
                            BL_ICE objmapqstns = new BL_ICE();
                            CurrentInfo _ObjectCurrentInfo = new CurrentInfo();
                            companyCode = ViewBag.Company_Code = _ObjectCurrentInfo.GetCompanyCode();
                            createdBy = ViewBag.Created_By = _ObjectCurrentInfo.GetUserName();
                            result = objmapqstns.InsertNewMappingQuestions(companyCode, usertypeCode, createdBy,qstns);                      
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }
        /// <summary>
        ///  Method to change question status for the mapped to User_Type
        /// </summary>
        /// <param name="usertypeCode"></param>
        /// <param name="questionId"></param>
        /// <returns></returns>
        [HttpPut]
        [ActionName("UpdateQuestionStatus")]
        public bool UpdateQuestionStatus(string usertypeCode,int questionId)
        {
            bool result = false;
            try
            {
                BL_ICE objStatQstn = new BL_ICE();
                CurrentInfo _ObjectCurrentInfo = new CurrentInfo();
                string companyCode = ViewBag.Company_Code = _ObjectCurrentInfo.GetCompanyCode();
                string modifiedBy = ViewBag.Created_By = _ObjectCurrentInfo.GetUserName();
                result = objStatQstn.UpdateQuestionStatus(companyCode, usertypeCode, modifiedBy, questionId);
            }
            catch(Exception ex)
            {
                throw;
            }
            return result;
        }

        /// <summary>
        /// Method to Get all the mapped questions of the User_Type Selected
        /// </summary>
        /// <param name="userCode"></param>
        /// <returns></returns>
        [HttpGet]
        [ActionName("GetICEQuestions")]
        public JsonResult GetICEQuestions(string usertypeCode)
        {
            string companyCode = null;
            try
            {
                BL_ICE objlstqstns = new BL_ICE();
                CurrentInfo _ObjectCurrentInfo = new CurrentInfo();
                companyCode = ViewBag.Company_Code = _ObjectCurrentInfo.GetCompanyCode();
                return Json(objlstqstns.GetICEQuestions(companyCode, usertypeCode).ToList(), JsonRequestBehavior.AllowGet);        
            }
            catch(Exception ex)
            {
                throw;
            }           
        }
        /// <summary>
        /// Method to get Questions based on User_Code
        /// </summary>
        /// <param name="userCode"></param>
        /// <returns></returns>
        [HttpGet]
        [ActionName("GetICEQuestionsByUserCode")]
        public JsonResult GetICEQuestionsByUserCode(string userCode)
        {
            string companyCode = null;
            try
            {
                BL_ICE objlstqstns = new BL_ICE();
                CurrentInfo _ObjectCurrentInfo = new CurrentInfo();
                companyCode = ViewBag.Company_Code = _ObjectCurrentInfo.GetCompanyCode();
                return Json(objlstqstns.GetICEQuestionsByUserCode(companyCode, userCode),JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex)
            {
                throw;
            }
        }
        /// <summary>
        /// Method to Insert ICE feedback
        /// </summary>
        /// <param name="userCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="fbResponse"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("InsertFeedback")]
        public bool InsertFeedback(string userCode, string fbRemarks, string Eval_Date, string fbResponse)
        {
            bool result = false;
            string companyCode = null;
            string createdBy = null;
            try
            {
                BL_ICE objfbresp = new BL_ICE();
                CurrentInfo _ObjectCurrentInfo = new CurrentInfo();
                companyCode = ViewBag.Company_Code = _ObjectCurrentInfo.GetCompanyCode();
                createdBy = ViewBag.Created_By = _ObjectCurrentInfo.GetUserName();
                result = objfbresp.InsertFeedback(companyCode, userCode, fbRemarks, Eval_Date, fbResponse, createdBy);
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }
        /// <summary>
        /// Method To Get ICE FORM History
        /// </summary>
        /// <param name="userCode"></param>
        /// <returns></returns>
        [HttpGet]
        [ActionName("GetFeedBackHistory")]
        public JsonResult GetFeedBackHistory(string userCode)
        {
            string companyCode = null;
            try
            {
                BL_ICE onjlsthstry = new BL_ICE();
                CurrentInfo _ObjectCurrentInfo = new CurrentInfo();
                companyCode = ViewBag.Company_Code = _ObjectCurrentInfo.GetCompanyCode();
                return Json(onjlsthstry.GetFeedBackHistory(companyCode, userCode), JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex)
            {
                throw;
            }
        }
        /// <summary>
        /// Method to  get Feedback Details based on feedback
        /// </summary>
        /// <param name="Feedback_Id"></param>
        /// <returns></returns>
        [HttpGet]
        [ActionName("GetFeedBackHistoryDetails")]
        public JsonResult GetFeedBackHistoryDetails(int Feedback_Id)
        {
            string companyCode = null;
            try
            {
                BL_ICE objsltdlst = new BL_ICE();
                CurrentInfo _ObjectCurrentInfo = new CurrentInfo();
                companyCode = ViewBag.Company_Code = _ObjectCurrentInfo.GetCompanyCode();
                return Json(objsltdlst.GetFeedBackHistoryDetails(companyCode, Feedback_Id), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        /// <summary>
        /// Method To Post Or Assign New Task
        /// </summary>
        /// <param name="userCode"></param>
        /// <param name="taskName"></param>
        /// <param name="taskDescription"></param>
        /// <param name="taskDueDate"></param>
        /// <returns></returns>
       [HttpPost]
       [ActionName("InsertUserTaskDetails")]
        public bool InsertUserTaskDetails(string userCode,string taskName,string taskDescription, string taskDueDate)
        {
            bool result = false;
            string companyCode = null;
            string createdBy = null;
            try
            {
                BL_ICE objtskinsrt = new BL_ICE();
                CurrentInfo _ObjectCurrentInfo = new CurrentInfo();
                companyCode = ViewBag.Company_Code = _ObjectCurrentInfo.GetCompanyCode();
                createdBy = ViewBag.Created_By = _ObjectCurrentInfo.GetUserName();
                result = objtskinsrt.InsertUserTaskDetails(companyCode, userCode, taskName, taskDescription, taskDueDate, createdBy);
            }
            catch(Exception ex)
            {
                throw;
            }
            return result;
        }
        /// <summary>
        /// Method To Get Tasks Assigned to Logged in User
        /// </summary>
        /// <param name="userCode"></param>
        /// <returns></returns>
        [HttpGet]
        [ActionName("GetTasks")]
        public JsonResult GetTasks(string userCode,string mode)
        {
            string companyCode = null;
            string createdBy = null;
            try
            {
                BL_ICE objtsklst = new BL_ICE();
                CurrentInfo _ObjectCurrentInfo = new CurrentInfo();
                companyCode = ViewBag.Company_Code = _ObjectCurrentInfo.GetCompanyCode();
                createdBy = ViewBag.Created_By = _ObjectCurrentInfo.GetUserName();
                return Json(objtsklst.GetTasks(companyCode, userCode,mode, createdBy), JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex)
            {
                throw;
            }
        }
        /// <summary>
        /// Method to Get Evaluated Dates
        /// </summary>
        /// <param name="userCode"></param>
        /// <returns></returns>
        [HttpGet]
        [ActionName("GetEvaluationDates")]
        public JsonResult GetEvaluationDates(string userCode)
        {

            string companyCode = null;
            string createdBy = null;
            try
            {
                BL_ICE objEvaldtslst = new BL_ICE();
                CurrentInfo _ObjectCurrentInfo = new CurrentInfo();
                companyCode = ViewBag.Company_Code = _ObjectCurrentInfo.GetCompanyCode();
                createdBy = ViewBag.Created_By = _ObjectCurrentInfo.GetUserName();
                return Json(objEvaldtslst.GetEvaluationDates(companyCode, userCode, createdBy), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        /// <summary>
        /// Method to Get Closed Tasks
        /// </summary>
        /// <param name="userCode"></param>
        /// <returns></returns>
        [HttpGet]
        [ActionName("GetClosedTasks")]
        public JsonResult GetClosedTasks(string userCode)
        {
            string createdBy = null;
            try
            {
                BL_ICE objlstclsdtsks = new BL_ICE();
                CurrentInfo _ObjectCurrentInfo = new CurrentInfo();               
                createdBy = ViewBag.Created_By = _ObjectCurrentInfo.GetUserName();
                return Json(objlstclsdtsks.GetClosedTasks(userCode, createdBy), JsonRequestBehavior.AllowGet);

            }
            catch(Exception ex)
            {
                throw;
            }
        }
        /// <summary>
        /// Mehtod to Get Task Based on Status
        /// </summary>
        /// <param name="userCode"></param>
        /// <param name="mode"></param>
        /// <returns></returns>
        [HttpGet]
        [ActionName("GetTasksByStatus")]
        public JsonResult GetTasksByStatus()
        {           
            string userCode = null;
            try
            {
                BL_ICE objlstdtsks = new BL_ICE();
                CurrentInfo _ObjectCurrentInfo = new CurrentInfo();               
                userCode = ViewBag.User_Code = _ObjectCurrentInfo.GetUserCode();
                return Json(objlstdtsks.GetTasksByStatus(userCode), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        /// <summary>
        /// Method to Get Task Details by Task_Id
        /// </summary>
        /// <param name="Task_Id"></param>
        /// <returns></returns>
        [HttpGet]
        [ActionName("GetTaskById")]
        public JsonResult GetTaskById(int Task_Id)
        {
            try 
            {
                BL_ICE objtsk = new BL_ICE();
                return Json(objtsk.GetTaskById(Task_Id), JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex)
            {
                throw;
            }
        }
        /// <summary>
        /// Method To Update Task Status
        /// </summary>
        /// <param name="Task_Id"></param>
        /// <param name="Task_Status"></param>
        /// <param name="Remarks"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("UpdateTaskStatus")]
        public bool UpdateTaskStatus(int Task_Id, int Task_Status,string Remarks)
        {
            bool result = false;
            string updateBy = null;
            try
            {
                BL_ICE objupdttsk = new BL_ICE();
                CurrentInfo _ObjectCurrentInfo = new CurrentInfo();
                updateBy = ViewBag.Updated_By = _ObjectCurrentInfo.GetUserName();               
                result = objupdttsk.UpdateTaskStatus(Task_Id, Task_Status, Remarks, updateBy);

            }
            catch(Exception ex)
            {
                throw;
            }
            return result;
        }
        /// <summary>
        /// Method to Get InActive Questions
        /// </summary>
        /// <param name="usertypeCode"></param>
        /// <returns></returns>

        [HttpGet]
        [ActionName("GetInActiveMappedQuestions")]
        public JsonResult GetInActiveMappedQuestions(string usertypeCode)
        {
            try
            {
                BL_ICE objinact = new BL_ICE();
                return Json(objinact.GetInActiveMappedQuestions(usertypeCode), JsonRequestBehavior.AllowGet);
            }
            catch (Exception Ex)
            {
                throw;
            }
        }
        /// <summary>
        /// Method to Change Question Status from InActive to Active
        /// </summary>
        /// <param name="usertypeCode"></param>
        /// <param name="Question_Id"></param>
        /// <returns></returns>
        [HttpPut]
        [ActionName("UpdateQuestionStatusToActive")]
        public bool UpdateQuestionStatusToActive(string usertypeCode,int questionId)
        {
            string companyCode = null;
            string modifiedBy = null;
            bool result = false;
            try
            {
                BL_ICE objchngstaAct = new BL_ICE();
                CurrentInfo _ObjectCurrentInfo = new CurrentInfo();
                companyCode = ViewBag.Company_Code = _ObjectCurrentInfo.GetCompanyCode();
                modifiedBy = ViewBag.Created_By = _ObjectCurrentInfo.GetUserName();
                result = objchngstaAct.UpdateQuestionStatusToActive(companyCode, usertypeCode, questionId, modifiedBy);
            }
            catch (Exception Ex)
            {
                throw;
            }
            return result;
        }
        /// <summary>
        /// Method to get Tasks Assigned by Logged in User
        /// </summary>      
        /// <returns></returns>
        [HttpGet]
        [ActionName("GetAllTasksByMe")]
        public JsonResult GetAllTasksByMe()
        {
            string assignedBy = null;
            try
            {
                BL_ICE objlstdtsks = new BL_ICE();
                CurrentInfo _ObjectCurrentInfo = new CurrentInfo();
                assignedBy = ViewBag.User_Code = _ObjectCurrentInfo.GetUserName();
                return Json(objlstdtsks.GetAllTasksByMe(assignedBy), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        /// <summary>
        /// Method to Get Tasks Live Count
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [ActionName("GetTaskLiveCount")]
        public JsonResult GetTaskLiveCount()
        {
            string companyCode = null;
            string userCode = null;
            string createdBy = null;
           
            try
            {
                BL_ICE objtskscount = new BL_ICE();
                CurrentInfo _ObjectCurrentInfo = new CurrentInfo();
                companyCode = ViewBag.Company_Code = _ObjectCurrentInfo.GetCompanyCode();
                userCode = ViewBag.User_Code = _ObjectCurrentInfo.GetUserCode();
                createdBy = ViewBag.Created_By = _ObjectCurrentInfo.GetUserName();
                return  Json(objtskscount.GetTaskLiveCount(companyCode, userCode, createdBy),JsonRequestBehavior.AllowGet);

            }
            catch(Exception ex)
            {
                throw;
            }           
        }
        /// <summary>
        /// Method to get Joint Working Dates
        /// </summary>
        /// <param name="childuserCode"></param>
        /// <param name="childuserName"></param>
        /// <returns></returns>
        [HttpGet]
        [ActionName("GetJointWorkingDates")]
        public JsonResult GetJointWorkingDates (string childuserCode,string childuserName,string startDate,string endDate)
        {
            string companyCode = null;
            string parentuserCode = null;
            string parentuserName = null;
            try
            {
                BL_ICE objjntdtes = new BL_ICE();
                CurrentInfo _ObjectCurrentInfo = new CurrentInfo();
                companyCode = ViewBag.Company_Code = _ObjectCurrentInfo.GetCompanyCode();
                parentuserCode = ViewBag.PUser_Code = _ObjectCurrentInfo.GetUserCode();
                parentuserName = ViewBag.PUser_Name = _ObjectCurrentInfo.GetUserName();               
                return Json(objjntdtes.GetJointWorkingDates(companyCode,parentuserCode, parentuserName, childuserCode, childuserName,startDate,endDate), JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex)
            {
                throw;
            }
        }
        /// <summary>
        /// Method to Get UserChild count
        /// </summary>
        /// <returns></returns>
        public JsonResult GetChildUserCount()
        {
            string companyCode = null;
            string userCode = null;
            try
            {
                BL_ICE objusercnt = new BL_ICE();
                CurrentInfo _ObjectCurrentInfo = new CurrentInfo();
                companyCode = ViewBag.Company_Code = _ObjectCurrentInfo.GetCompanyCode();
                userCode = ViewBag.User_Code = _ObjectCurrentInfo.GetUserCode();
                return Json(objusercnt.GetChildUserCount(companyCode,userCode), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="Question_Id"></param>
        /// <param name="usertypeCode"></param>
        /// <returns></returns>
        public JsonResult GetRatingParamters(int Question_Id,string usertypeCode)
        {
            try
            {
                BL_ICE objparams = new BL_ICE();
                return Json(objparams.GetRatingParamters(Question_Id, usertypeCode), JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex)
            {
                throw;
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="lstRtngParams"></param>
        /// <param name="usertypeCode"></param>
        /// <returns></returns>
        public bool InsertRatingParameters(List<ParametersModel> lstRtngParams, string usertypeCode)
        {
            bool result = false;
            string companyCode = null;
            string createdBy = null;
            string updatedBy = null;
            try
            {
                BL_ICE objparams = new BL_ICE();
                CurrentInfo _ObjCurrentInfo = new CurrentInfo();
                companyCode = _ObjCurrentInfo.GetCompanyCode();
                createdBy = _ObjCurrentInfo.GetUserCode();
                updatedBy = _ObjCurrentInfo.GetUserCode();
                result = objparams.InsertRatingParameters(companyCode, lstRtngParams, usertypeCode, createdBy, updatedBy);
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }

        [HttpGet]
        [ActionName("GetAllFollowUps")]
        public JsonResult GetAllFollowUps()
        {
            string assignedBy = null;
            try
            {
                BL_ICE objlstdtsks = new BL_ICE();
                CurrentInfo _ObjectCurrentInfo = new CurrentInfo();
                assignedBy = _ObjectCurrentInfo.GetUserCode();
                return Json(objlstdtsks.GetAllFollowUps(assignedBy), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpGet]
        [ActionName("GetAllTeamFollowUps")]
        public JsonResult GetAllTeamFollowUps()
        {
            string assignedBy = null;
            try
            {
                BL_ICE objlstdtsks = new BL_ICE();
                CurrentInfo _ObjectCurrentInfo = new CurrentInfo();
                assignedBy = _ObjectCurrentInfo.GetUserCode();
                return Json(objlstdtsks.GetAllTeamFollowUps(assignedBy), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

    }
}
