using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MVCModels;

namespace DataControl.HiDoctor_ActivityFactoryClasses
{
    public class BL_ICE
    {
        /// <summary>
        /// To Get active user types
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public List<UserTypeModel>GetActiveUserTypes(string companyCode)
        {
            List<UserTypeModel> lstusertyp = null;
            try
            {
                DAL_ICE objusertyp = new DAL_ICE();
                lstusertyp = objusertyp.GetActiveUserTypes(companyCode).ToList();
                
            }
            catch(Exception ex)
            {
                throw;
            }
            return lstusertyp;
        }
        /// <summary>
        ///  Method to Get Active Users
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="includeOneLevelParent"></param>
        /// <param name="excludeFirstLevel"></param>
        /// <returns></returns>
        public List<ICEUserTreeModel> GetActiveUsers(string companyCode,string userCode, string includeOneLevelParent, string excludeFirstLevel,string currentUserCode)
        {
            List<ICEUserTreeModel> lsttree = null;
            try
            {
                DAL_ICE objtree = new DAL_ICE();
                lsttree= objtree.GetActiveUsers(companyCode, userCode, includeOneLevelParent, excludeFirstLevel,currentUserCode);
            }
            catch (Exception ex)
            {
                throw;
            }
            return lsttree;
        }
        /// <summary>
        /// Method to Insert Mapped Questions
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="usertypeCode"></param>
        /// <param name="createdBy"></param>
        /// <param name="Questions"></param>
        /// <returns></returns>
        public bool InsertNewMappingQuestions(string companyCode, string usertypeCode, string createdBy, string Questions)
        {
            bool result = false;
            try
            {
                DAL_ICE objmapqstns = new DAL_ICE();
                result = objmapqstns.InsertNewMappingQuestions(companyCode, usertypeCode, createdBy, Questions);
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
        /// <param name="companyCode"></param>
        /// <param name="usertypeCode"></param>
        /// <param name="modifiedBy"></param>
        /// <param name="questionId"></param>
        /// <returns></returns>
        public bool UpdateQuestionStatus(string companyCode,string usertypeCode,string modifiedBy,int questionId)
        {
            bool result = false;
            try
            {
                DAL_ICE objStatQstn = new DAL_ICE();
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
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns></returns>
        public List<QuestionModel> GetICEQuestions(string companyCode,string usertypeCode)
        {
            List<QuestionModel> lstqstns = null;
            try
            {
                DAL_ICE objqstnslst = new DAL_ICE();
                lstqstns = objqstnslst.GetICEQuestions(companyCode, usertypeCode).ToList();
            }
            catch(Exception ex)
            {
                throw;
            }
            return lstqstns;
        }
        /// <summary>
        /// Method to get Questions based on User_Code
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns></returns>
        public QuestionParameterModel GetICEQuestionsByUserCode(string companyCode,string userCode)
        {
          QuestionParameterModel lstqstns = null;
            try
            {
                DAL_ICE objqstnlst = new DAL_ICE();
                lstqstns = objqstnlst.GetICEQuestionsByUserCode(companyCode, userCode);

            }
            catch (Exception ex)
            {
                throw;
            }
            return lstqstns;
        }
        /// <summary>
        /// Method to Insert ICE feedback
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="fdbkresp"></param>
        /// <param name="createdBy"></param>
        /// <returns></returns>


        public bool InsertFeedback(string companyCode, string userCode, string fbremarks, string Eval_Date, string fdbkresp, string createdBy)
        {
            bool result = false;
            try
            {
                DAL_ICE objfdbkresp = new DAL_ICE();
                result = objfdbkresp.InsertFeedback(companyCode, userCode, fbremarks, Eval_Date, fdbkresp, createdBy);
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
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns></returns>
        public List<FeedbackDetailsModel> GetFeedBackHistory(string companyCode,string userCode)
        {
            List<FeedbackDetailsModel> lsthstry = null;
            try
            {
                DAL_ICE objlsthstry = new DAL_ICE();
                lsthstry = objlsthstry.GetFeedBackHistory(companyCode, userCode);

            }
            catch(Exception ex)
            {
                throw;
            }
            return lsthstry;
        }
        /// <summary>
        ///  Method to  get Feedback Details based on feedback
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="Feedback_Id"></param>
        /// <returns></returns>
        public FeedbackModel GetFeedBackHistoryDetails(string companyCode,int Feedback_Id)
        {
            FeedbackModel objfblstsltd = null;
            try
            {
                DAL_ICE objsltdlst = new DAL_ICE();
                objfblstsltd = objsltdlst.GetFeedBackHistoryDetails(companyCode, Feedback_Id);
                
            }
            catch(Exception ex)
            {
                throw;
            }
            return objfblstsltd;
        }
        /// <summary>
        /// Method To Post Or Assign New Task
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="taskName"></param>
        /// <param name="taskDescription"></param>
        /// <param name="taskDueDate"></param>
        /// <param name="createdBy"></param>
        /// <returns></returns>
        public bool InsertUserTaskDetails(string companyCode,string userCode,string taskName,string taskDescription, string taskDueDate,string createdBy)
        {
            bool result = false;
            try
            {
                DAL_ICE objtskinsrt = new DAL_ICE();
                result = objtskinsrt.InsertUserTaskDetails(companyCode, userCode, taskName, taskDescription, taskDueDate, createdBy);
            }
            catch(Exception ex)
            {
                throw;
            }
            return result;
        }
        /// <summary>
        ///  Method To Get Tasks Assigned to Logged in User
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="createdBy"></param>
        /// <returns></returns>
        public List<TaskDetailsModel> GetTasks(string companyCode,string userCode,string mode,string createdBy)
        {
            List<TaskDetailsModel> lsttsks = null;
            try
            {
                DAL_ICE objlsttsks = new DAL_ICE();
                lsttsks = objlsttsks.GetTasks(companyCode, userCode,mode, createdBy);
            }
            catch(Exception ex)
            {
                throw;
            }
            return lsttsks;
        }
        /// <summary>
        /// Method to Get Evaluated Dates
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="createdBy"></param>
        /// <returns></returns>
        public DatesModel GetEvaluationDates(string companyCode,string userCode,string createdBy)
        {
            DatesModel lstEvaldts = null;
            try
            {
                DAL_ICE objlstEvaldts = new DAL_ICE();
                lstEvaldts = objlstEvaldts.GetEvaluationDates(companyCode, userCode, createdBy);

            }
            catch (Exception ex)
            {
                throw;
            }
            return lstEvaldts;

        }
        /// <summary>
        ///  Method to Get Closed Tasks
        /// </summary>
        /// <param name="userCode"></param>
        /// <param name="createdBy"></param>
        /// <returns></returns>
        public List<TaskDetailsModel> GetClosedTasks(string userCode,string createdBy)
        {
            List<TaskDetailsModel> lstclsdtsks = null;
            try
            {
                DAL_ICE objlstclsdtsks = new DAL_ICE();
                lstclsdtsks = objlstclsdtsks.GetClosedTasks(userCode, createdBy);
            }
            catch(Exception ex)
            {
                throw;
            }
            return lstclsdtsks;
        }
        /// <summary>
        ///  Mehtod to Get Task Based on Status
        /// </summary>
        /// <param name="userCode"></param>
        /// <param name="mode"></param>
        /// <param name="createdBy"></param>
        /// <returns></returns>
        public List<TaskDetailsModel> GetTasksByStatus(string userCode)
        {
            List<TaskDetailsModel> lstdtsks = null;
            try
            {
                DAL_ICE objlstdtsks = new DAL_ICE();
                lstdtsks=objlstdtsks.GetTasksByStatus(userCode);
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstdtsks;
        }
        /// <summary>
        /// Method to Get Task Details by Task_Id
        /// </summary>
        /// <param name="Task_Id"></param>
        /// <returns></returns>
        public List<TaskDetailsModel> GetTaskById(int Task_Id)
        {
            List<TaskDetailsModel> objtask = null;
            try
            {
                DAL_ICE objtsk = new DAL_ICE();
                objtask = objtsk.GetTaskById(Task_Id);
                
            }
            catch (Exception ex)
            {
                throw;
            }
            return objtask;
        }
        /// <summary>
        /// Method To Update Task Status
        /// </summary>
        /// <param name="Task_Id"></param>
        /// <param name="Task_Status"></param>
        /// <param name="Remarks"></param>
        /// <param name="updatedBy"></param>
        /// <returns></returns>
        public bool UpdateTaskStatus(int Task_Id,int Task_Status,string Remarks,string updatedBy)
        {
            bool result = false;
            try
            {
                DAL_ICE objupdttsk = new DAL_ICE();
                result = objupdttsk.UpdateTaskStatus(Task_Id, Task_Status, Remarks, updatedBy);

            }
            catch(Exception ex)
            {
                throw;
            }
            return result;
        }
        /// <summary>
        ///  Method to Get InActive Questions
        /// </summary>
        /// <param name="usertypeCode"></param>
        /// <returns></returns>
        public List<QuestionModel>GetInActiveMappedQuestions(string usertypeCode)
        {
            List<QuestionModel> lstinactvQstns = null;
            try
            {
                DAL_ICE objinact = new DAL_ICE();
                lstinactvQstns = objinact.GetInActiveMappedQuestions(usertypeCode);
            }
            catch(Exception ex)
            {
                throw;
            }
            return lstinactvQstns;
        }
        /// <summary>
        /// Method to Change Question Status from InActive to Active
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="usertypeCode"></param>
        /// <param name="Question_Id"></param>
        /// <param name="modifiedBy"></param>
        /// <returns></returns>
        public bool UpdateQuestionStatusToActive(string companyCode,string usertypeCode, int questionId, string modifiedBy)
        {
           
            bool result = false;
            try
            {
                DAL_ICE objchngstaAct = new DAL_ICE();              
                result = objchngstaAct.UpdateQuestionStatusToActive(companyCode, usertypeCode, questionId, modifiedBy);
            }
            catch (Exception Ex)
            {
                throw;
            }
            return result;
        }
        /// <summary>
        ///  Method to get Tasks Assigned by Logged in User
        /// </summary>
        /// <param name="assignedBy"></param>       
        /// <returns></returns>
        public List<TaskDetailsModel> GetAllTasksByMe(string assignedBy)
        {
            List<TaskDetailsModel> lstdtsks = null;
            try
            {
                DAL_ICE objlstdtsks = new DAL_ICE();
                lstdtsks = objlstdtsks.GetAllTasksByMe(assignedBy);
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstdtsks;
        }
        /// <summary>
        ///  Method to Get Tasks Live Count
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="createdBy"></param>
        /// <returns></returns>
        public List<TaskCount> GetTaskLiveCount(string companyCode,string userCode,string createdBy)
        {
            List<TaskCount> objcount = null;
            try
            {
                DAL_ICE objtskscount = new DAL_ICE();
                objcount = objtskscount.GetTaskLiveCount(companyCode, userCode, createdBy);

            }
            catch(Exception ex)
            {
                throw;
            }
            return objcount;
          
        }
        /// <summary>
        /// Method to get Joint Working Dates
        /// </summary>
        /// <param name="parentuserCode"></param>
        /// <param name="parentuserName"></param>
        /// <param name="childuserCode"></param>
        /// <param name="childuserName"></param>
        /// <returns></returns>
        public JointWorkingDatesModel GetJointWorkingDates(string companyCode,string parentuserCode,string parentuserName,string childuserCode,string childuserName,string startDate,string endDate)
        {
            JointWorkingDatesModel lstdtes = null;
            try
            {
                DAL_ICE objdtes = new DAL_ICE();
                lstdtes = objdtes.GetJointWorkingDates(companyCode,parentuserCode, parentuserName, childuserCode, childuserName,startDate,endDate);
            }
            catch(Exception ex)
            {
                throw;
            }
            return lstdtes;
        }
        /// <summary>
        /// Method to Get UserChild count
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns></returns>
        public List<ICEUserTreeModel> GetChildUserCount(string companyCode,string userCode)
        {
            List<ICEUserTreeModel> objchldcnt = null;
            try
            {
                DAL_ICE objcnt = new DAL_ICE();
                objchldcnt = objcnt.GetChildUserCount(companyCode, userCode);
            }
            catch (Exception ex)
            {
                throw;
            }
            return objchldcnt;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="Question_Id"></param>
        /// <param name="usertypeCode"></param>
        /// <returns></returns>
        public List<ParametersModel> GetRatingParamters(int Question_Id,string usertypeCode)
        {
            List<ParametersModel> lstParams = null;
            try
            {
                DAL_ICE objparams = new DAL_ICE();
                lstParams = objparams.GetRatingParamters(Question_Id, usertypeCode).ToList();
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstParams;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="lstRtngParams"></param>
        /// <param name="usertypeCode"></param>
        /// <returns></returns>
        public bool InsertRatingParameters(string companyCode, List<ParametersModel> lstRtngParams, string usertypeCode, string createdby, string updatedBy)
        {
            bool result = false;
            try
            {

                DAL_ICE objparams = new DAL_ICE();
                result = objparams.InsertRatingParameters(companyCode, lstRtngParams, usertypeCode, createdby, updatedBy);
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }
        public List<TaskDetailsModel> GetAllFollowUps(string assignedBy)
        {
            List<TaskDetailsModel> lstdtsks = null;
            try
            {
                DAL_ICE objlstdtsks = new DAL_ICE();
                lstdtsks = objlstdtsks.GetAllFollowUps(assignedBy);
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstdtsks;
        }
        public List<TaskDetailsModel> GetAllTeamFollowUps(string assignedBy)
        {
            List<TaskDetailsModel> lstdtsks = null;
            try
            {
                DAL_ICE objlstdtsks = new DAL_ICE();
                lstdtsks = objlstdtsks.GetAllTeamFollowUps(assignedBy);
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstdtsks;
        }
    }   
}
