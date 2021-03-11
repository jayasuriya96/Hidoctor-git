using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using Dapper;
using DataControl;
using MVCModels;
using Newtonsoft.Json;
using Microsoft.SqlServer.Server;
using System.Data.SqlClient;

namespace DataControl.HiDoctor_ActivityFactoryClasses
{
    public class DAL_ICE : DapperRepository
    {
        /// <summary>
        /// Stored Procedures
        /// </summary>
        #region Stored_Procedures
        public const string SP_HD_ICE_INSERTQUESTIONS = "SP_HD_ICE_InsertQuestions";
        public const string SP_HD_ICE_CHANGEQUESTIONSTATUS = "SP_HD_ICE_ChangeQuestionStatus";
        public const string SP_HD_ICE_GETALLMAPPEDQUESTIONS = "SP_HD_ICE_GetAllMappedQuestions";
        public const string SP_HD_ICE_GETACTIVEUSERTYPES = "SP_HD_ICE_GetactiveUserTypes";
        public const string SP_HD_ICE_GETALLMAPPEDQUESTIONSBYUSERCODE = "SP_HD_ICE_GetAllMappedQuestionsByUserCode";
        public const string SP_HD_ICE_INSERTFEEDBACK = "SP_HD_ICE_InsertFeedBack";
        public const string SP_HD_ICE_INSERTFEEDBACKDETAILS = "SP_HD_ICE_InsertFeedBackDetails";
        public const string SP_HD_ICE_GETICEFORMHISTORY = "SP_HD_ICE_GetICEFormHistory";
        public const string SP_HD_ICE_GETICEFORMHISTORYDETAILS = "SP_HD_ICE_GetICEFormHistoryDetails";
        public const string SP_HD_ICE_INSERTTASK = "SP_HD_ICE_InsertTask";
        public const string SP_HD_ICE_GETOPENTASKS = "SP_HD_ICE_GetOpenTasks";
        public const string SP_HD_ICE_GETEVALUATEDDATES = "SP_HD_ICE_GetEvaluatedDates";
        public const string SP_HD_ICE_GETCLOSEDTASKS = "SP_HD_ICE_GetClosedTasks";
        public const string SP_HD_ICE_GETALLTASKS = "SP_HD_ICE_GetAllTasks";
        public const string SP_HD_ICE_GETTASKBYTASKID = "SP_HD_ICE_GetTaskByTaskId";
        public const string SP_HD_ICE_UPDATETASKSTATUS = "SP_HD_ICE_UpdateTaskStatus";
        public const string SP_HD_ICE_GETINACTIVEMAPPEDQUESTIONS = "SP_HD_ICE_GetInActiveMappedQuestions";
        public const string SP_HD_ICE_CHANGEQUESTIONSTATUSTOACTIVE = "SP_HD_ICE_ChangeQuestionStatustoActive";
        public const string SP_HD_ICE_GETACTIVEUSERSTREEDETAILS = "SP_HD_ICE_GetActiveUsersTreeDetails";
        public const string SP_HD_ICE_GETTASKSASSIGNEDBYME = "SP_HD_ICE_GetTasksAssignedByMe";
        public const string SP_HD_ICE_GETLIVETASKDASHBOARDCOUNT = "SP_HD_ICE_GetLiveTaskDashboardCount";
        public const string SP_HD_ICE_GETJOINTWORKINGDATES = "SP_HD_ICE_GetJointWorkingDates";
        public const string SP_HD_ICE_GETCHILDUSERCOUNTFORTASKS = "SP_HD_ICE_GetChildUserCountforTasks";
        public const string SP_HD_ICE_GETRATINGPARAMETERSBASEDONQUESTIONID = "SP_HD_ICE_GetRatingParametersBasedonQuestionID";
        public const string SP_HD_ICE_GetAllFollowups = "SP_HD_ICE_GetAllFollowups";
        public const string SP_HD_ICE_GetAllTeamFollowups = "SP_HD_ICE_GetAllTeamFollowups";
        #endregion Stored_Procedures



        private SPData _objSPData = null;
        private Data _objData = null;
        /// <summary>
        /// To Get Active User Types
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>

        public List<UserTypeModel> GetActiveUserTypes(string companyCode)
        {
            List<UserTypeModel> lstusertyp = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    lstusertyp = connection.Query<UserTypeModel>(SP_HD_ICE_GETACTIVEUSERTYPES, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstusertyp;
        }
        /// <summary>
        ///   Method to Get Active Users
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="includeOneLevelParent"></param>
        /// <param name="excludeFirstLevel"></param>
        /// <returns></returns>
        public List<ICEUserTreeModel> GetActiveUsers(string companyCode, string userCode, string includeOneLevelParent, string excludeFirstLevel, string currentUserCode)
        {
            List<ICEUserTreeModel> lsttree = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    p.Add("@Include_Parent", includeOneLevelParent);
                    p.Add("@Exclude_First_Level", excludeFirstLevel);
                    p.Add("@CurrentUserCode", currentUserCode);
                    lsttree = connection.Query<ICEUserTreeModel>(SP_HD_ICE_GETACTIVEUSERSTREEDETAILS, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
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
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Type_Code", usertypeCode);
                    p.Add("@Created_By", createdBy);
                    p.Add("@Questions", Questions);
                    connection.Execute(SP_HD_ICE_INSERTQUESTIONS, p, commandType: CommandType.StoredProcedure);
                    result = true;
                    connection.Close();
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
        /// <param name="companyCode"></param>
        /// <param name="usertypeCode"></param>
        /// <param name="modifiedBy"></param>
        /// <param name="questionId"></param>
        /// <returns></returns>
        public bool UpdateQuestionStatus(string companyCode, string usertypeCode, string modifiedBy, int questionId)
        {
            bool result = false;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Question_Id", questionId);
                    p.Add("@User_Type_Code", usertypeCode);
                    p.Add("@Modified_By", modifiedBy);
                    connection.Execute(SP_HD_ICE_CHANGEQUESTIONSTATUS, p, commandType: CommandType.StoredProcedure);
                    result = true;
                    connection.Close();
                }
            }
            catch (Exception ex)
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
        public IEnumerable<QuestionModel> GetICEQuestions(string companyCode, string usertypeCode)
        {
            IEnumerable<QuestionModel> lstqstns = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Type_Code", usertypeCode);
                    lstqstns = connection.Query<QuestionModel>(SP_HD_ICE_GETALLMAPPEDQUESTIONS, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstqstns;
        }
        /// <summary>
        ///  Method to get Questions based on User_Code
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns></returns>
        public QuestionParameterModel GetICEQuestionsByUserCode(string companyCode, string userCode)
        {
            QuestionParameterModel lstqstnbyuser = new QuestionParameterModel();
            try
            {
                List<QuestionModel> lstquestions = null;
                List<ParametersModel> lstparameters = null;
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    using (var multiselect=connection.QueryMultiple(SP_HD_ICE_GETALLMAPPEDQUESTIONSBYUSERCODE, p, commandType: CommandType.StoredProcedure))
                    {
                        lstquestions = multiselect.Read<QuestionModel>().ToList();
                        lstparameters = multiselect.Read<ParametersModel>().ToList();
                    }
                    // lstqstnbyuser = connection.Query<QuestionModel>(SP_HD_ICE_GETALLMAPPEDQUESTIONSBYUSERCODE, p, commandType: CommandType.StoredProcedure);
                    lstqstnbyuser.lstQuestions = lstquestions;
                    lstqstnbyuser.lstParameters = lstparameters;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstqstnbyuser;
        }
        /// <summary>
        /// Method to Insert ICE feedback
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="Eval_Date"></param>
        /// <param name="fbRemarks"></param>
        /// <param name="fdbkresp"></param>
        /// <param name="createdBy"></param>
        /// <returns></returns>
        public bool InsertFeedback(string companyCode, string userCode, string fbRemarks, string Eval_Date, string fdbkresp, string createdBy)
        {
            bool result = false;
            List<ResponseModel> lstfdbkid = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    p.Add("@Eval_Date", Eval_Date);
                    p.Add("@Feedback_Remarks", fbRemarks);
                    p.Add("@Created_By", createdBy);
                    lstfdbkid = connection.Query<ResponseModel>(SP_HD_ICE_INSERTFEEDBACK, p, commandType: CommandType.StoredProcedure).ToList();
                    if (!string.IsNullOrEmpty(fdbkresp))
                    {

                        var fdbk = JsonConvert.DeserializeObject<List<ResponseModel>>(fdbkresp);
                        foreach (ResponseModel fbobj in fdbk)
                        {
                            var q = new DynamicParameters();
                            q.Add("@Company_Code", companyCode);
                            q.Add("@User_Code", userCode);
                            q.Add("@FeedBack_Id", lstfdbkid[0].Feedback_Id);
                            q.Add("@Question_Id", fbobj.Question_Id);
                            q.Add("@Questions", fbobj.Questions);
                            q.Add("@Assigned_Rating", fbobj.Assigned_Rating);
                            q.Add("@Remarks", fbobj.Remarks);
                            q.Add("@Parameter_Id", fbobj.Parameter_Id);
                            q.Add("@Created_By", createdBy);
                            connection.Execute(SP_HD_ICE_INSERTFEEDBACKDETAILS, q, commandType: CommandType.StoredProcedure);
                        }
                       
                    }
                    connection.Close();
                    result = true;
                }

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
        public List<FeedbackDetailsModel> GetFeedBackHistory(string companyCode, string userCode)
        {
            List<FeedbackDetailsModel> lsthstry = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    lsthstry = connection.Query<FeedbackDetailsModel>(SP_HD_ICE_GETICEFORMHISTORY, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
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
        public FeedbackModel GetFeedBackHistoryDetails(string companyCode, int Feedback_Id)
        {
            FeedbackModel objsltdlst = new FeedbackModel();
            try
            {
                List<FeedbackDetailsModel> lstDetails = null;
                List<ResponseModel> lstrespfdbk = null;
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Feedback_Id", Feedback_Id);
                    using (var multiselect = connection.QueryMultiple(SP_HD_ICE_GETICEFORMHISTORYDETAILS, p, commandType: CommandType.StoredProcedure))
                    {
                        lstDetails = multiselect.Read<FeedbackDetailsModel>().ToList();
                        lstrespfdbk = multiselect.Read<ResponseModel>().ToList();

                    }

                    objsltdlst.lstfeedback = lstrespfdbk;
                    objsltdlst.lstfdbckdetails = lstDetails;
                    connection.Close();
                }

            }
            catch (Exception ex)
            {
                throw;
            }
            return objsltdlst;
        }
        /// <summary>
        ///  Method To Post Or Assign New Task
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="taskName"></param>
        /// <param name="taskDescription"></param>
        /// <param name="taskDueDate"></param>
        /// <param name="createdBy"></param>
        /// <returns></returns>
        public bool InsertUserTaskDetails(string companyCode, string userCode, string taskName, string taskDescription, string taskDueDate, string createdBy)
        {
            bool result = false;
            //  DateTime taskdueDate= Convert.ToDateTime(taskDueDate);
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    p.Add("@Task_Name", taskName);
                    p.Add("@Task_Description", taskDescription);
                    p.Add("@Task_Due_Date", taskDueDate);
                    p.Add("@Created_By", createdBy);
                    connection.Execute(SP_HD_ICE_INSERTTASK, p, commandType: CommandType.StoredProcedure);
                    result = true;
                    connection.Close();
                }
            }
            catch (Exception ex)
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
        /// <param name="mode"></param>
        /// <param name="createdBy"></param>
        /// <returns></returns>
        public List<TaskDetailsModel> GetTasks(string companyCode, string userCode, string mode, string createdBy)
        {
            List<TaskDetailsModel> lsttsks = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    p.Add("@Mode", mode);
                    p.Add("@Created_By", createdBy);
                    lsttsks = connection.Query<TaskDetailsModel>(SP_HD_ICE_GETOPENTASKS, p, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lsttsks;
        }
        /// <summary>
        ///  Method to Get Evaluated Dates
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="createdBy"></param>
        /// <returns></returns>
        public DatesModel GetEvaluationDates(string companyCode, string userCode, string createdBy)
        {
            DatesModel lstdts = new DatesModel();
            try
            {
                List<FeedbackDetailsModel> lstEvaldate = null;
                List<UserStartDateModel> lstStartdate = null;
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("User_Code", userCode);
                    p.Add("Created_By", createdBy);
                    using (var multiselect = connection.QueryMultiple(SP_HD_ICE_GETEVALUATEDDATES, p, commandType: CommandType.StoredProcedure))
                    {
                       lstEvaldate=multiselect.Read<FeedbackDetailsModel>().ToList();
                        lstStartdate = multiselect.Read<UserStartDateModel>().ToList();
                    }
                    lstdts.lstEvalDate = lstEvaldate;
                    lstdts.lstStartDate = lstStartdate;
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstdts;

        }
        /// <summary>
        /// Method to Get Closed Tasks
        /// </summary>
        /// <param name="userCode"></param>
        /// <param name="createdBy"></param>
        /// <returns></returns>
        public List<TaskDetailsModel> GetClosedTasks(string userCode, string createdBy)
        {
            List<TaskDetailsModel> lstclsdtsks = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Code", userCode);
                    p.Add("@Created_By", createdBy);
                    lstclsdtsks = connection.Query<TaskDetailsModel>(SP_HD_ICE_GETCLOSEDTASKS, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch (Exception ex)
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
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Code", userCode);
                    lstdtsks = connection.Query<TaskDetailsModel>(SP_HD_ICE_GETALLTASKS, p, commandType: CommandType.StoredProcedure).ToList();
                }
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
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("Task_Id", Task_Id);
                    objtask = connection.Query<TaskDetailsModel>(SP_HD_ICE_GETTASKBYTASKID, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
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
        public bool UpdateTaskStatus(int Task_Id, int Task_Status, string Remarks, string updatedBy)
        {
            bool result = false;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Task_Id", Task_Id);
                    p.Add("@Task_Status", Task_Status);
                    p.Add("@Remarks", Remarks);
                    p.Add("@Updated_By", updatedBy);
                    connection.Execute(SP_HD_ICE_UPDATETASKSTATUS, p, commandType: CommandType.StoredProcedure);
                    result = true;
                    connection.Close();
                }
            }
            catch (Exception ex)
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
        public List<QuestionModel> GetInActiveMappedQuestions(string usertypeCode)
        {
            List<QuestionModel> lstinact = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Type_Code", usertypeCode);
                    lstinact = connection.Query<QuestionModel>(SP_HD_ICE_GETINACTIVEMAPPEDQUESTIONS, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstinact;
        }
        /// <summary>
        ///  Method to Change Question Status from InActive to Active
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="usertypeCode"></param>
        /// <param name="Question_Id"></param>
        /// <param name="modifiedBy"></param>
        /// <returns></returns>
        public bool UpdateQuestionStatusToActive(string companyCode, string usertypeCode, int questionId, string modifiedBy)
        {
            bool result = false;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Type_Code", usertypeCode);
                    p.Add("@Question_Id", questionId);
                    p.Add("@Modified_By", modifiedBy);
                    connection.Execute(SP_HD_ICE_CHANGEQUESTIONSTATUSTOACTIVE, p, commandType: CommandType.StoredProcedure);
                    result = true;
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }
        /// <summary>
        /// Method to get Tasks Assigned by Logged in User
        /// </summary>
        /// <param name="assignedBy"></param>
        /// <param name="mode"></param>
        /// <returns></returns>
        public List<TaskDetailsModel> GetAllTasksByMe(string assignedBy)
        {
            List<TaskDetailsModel> lstdtsks = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Assigned_By", assignedBy);
                        
                    lstdtsks = connection.Query<TaskDetailsModel>(SP_HD_ICE_GETTASKSASSIGNEDBYME, p, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstdtsks;
        }

        public List<TaskDetailsModel> GetAllFollowUps(string assignedBy)
        {
            List<TaskDetailsModel> lstdtsks = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Code", assignedBy);

                    lstdtsks = connection.Query<TaskDetailsModel>(SP_HD_ICE_GetAllFollowups, p, commandType: CommandType.StoredProcedure).ToList();
                }
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
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@User_Code", assignedBy);

                    lstdtsks = connection.Query<TaskDetailsModel>(SP_HD_ICE_GetAllTeamFollowups, p, commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstdtsks;
        }
        /// <summary>
        /// Method to Get Tasks Live Count
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="createdBy"></param>
        /// <returns></returns>
        public List<TaskCount> GetTaskLiveCount(string companyCode, string userCode, string createdBy)
        {
            List<TaskCount> objcount = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    p.Add("@Created_By", createdBy);
                    objcount = connection.Query<TaskCount>(SP_HD_ICE_GETLIVETASKDASHBOARDCOUNT, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }

            }
            catch (Exception ex)
            {
                throw;
            }
            return objcount;
        }
        /// <summary>
        /// Method to get Joint Working Dates
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="parentuserCode"></param>
        /// <param name="parentuserName"></param>
        /// <param name="childuserCode"></param>
        /// <param name="childuserName"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public JointWorkingDatesModel GetJointWorkingDates(string companyCode, string parentuserCode, string parentuserName, string childuserCode, string childuserName, string startDate, string endDate)
        {
            JointWorkingDatesModel lstdtes = new JointWorkingDatesModel();
            try
            {
                List<JointDatesModel> lstParentdates = null;
                List<JointDatesModel> lstchilddates = null;
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Parent_UserCode", parentuserCode);
                    p.Add("@Parent_UserName", parentuserName);
                    p.Add("@Child_UserCode", childuserCode);
                    p.Add("@Child_UserName", childuserName);
                    p.Add("@Start_Date", startDate);
                    p.Add("@End_Date", endDate);
                    using (var multiselect = connection.QueryMultiple(SP_HD_ICE_GETJOINTWORKINGDATES, p, commandType: CommandType.StoredProcedure))
                    {
                        lstParentdates = multiselect.Read<JointDatesModel>().ToList();
                        lstchilddates = multiselect.Read<JointDatesModel>().ToList();
                    }
                    lstdtes.lstParentDates = lstParentdates;
                    lstdtes.lstChildDates = lstchilddates;
                    connection.Close();
                }

            }
            catch (Exception ex)
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
        public List<ICEUserTreeModel> GetChildUserCount(string companyCode, string userCode)
        {
            List<ICEUserTreeModel> objcnt = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Code", userCode);
                    objcnt = connection.Query<ICEUserTreeModel>(SP_HD_ICE_GETCHILDUSERCOUNTFORTASKS, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return objcnt;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="Question_Id"></param>
        /// <param name="usertypeCode"></param>
        /// <returns></returns>

        public List<ParametersModel>GetRatingParamters(int Question_Id,string usertypeCode)
        {
            List<ParametersModel> lstParams = null;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Question_Id", Question_Id);
                    p.Add("@User_Type_Code", usertypeCode);
                    lstParams = connection.Query<ParametersModel>(SP_HD_ICE_GETRATINGPARAMETERSBASEDONQUESTIONID, p, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch(Exception ex)
            {
                throw;
            }
            return lstParams;
        }
        public bool InsertRatingParameters(string companyCode, List<ParametersModel> lstRtngParams, string usertypeCode, string createdBy, string updatedBy)
        {
            bool result = false;
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                string cmdText = "SP_HD_ICE_InsertRatingParameters";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@User_Type_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, usertypeCode);
                _objSPData.AddParamToSqlCommand(command, "@Created_By", ParameterDirection.Input, SqlDbType.VarChar, 30, createdBy);
                _objSPData.AddParamToSqlCommand(command, "@Updated_By", ParameterDirection.Input, SqlDbType.VarChar, 30, updatedBy);
                
               
                if (lstRtngParams == null || lstRtngParams.Count == 0)
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@ICE_Rating_Parameters_TVP", ParameterDirection.Input, SqlDbType.Structured, null, "ICE_Rating_Parameters_TVP");
                else
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@ICE_Rating_Parameters_TVP", ParameterDirection.Input, SqlDbType.Structured, new ParametersEnumurator(lstRtngParams), "ICE_Rating_Parameters_TVP");

                _objData.OpenConnection();
                _objData.ExecuteNonQuery(command);
                result = true;

            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }





        public class ParametersEnumurator : IEnumerable<SqlDataRecord>
        {

            public ParametersEnumurator(IEnumerable<ParametersModel> data)
            {
                _data = data;
            }
            private IEnumerable<ParametersModel> _data;
            public IEnumerator<SqlDataRecord> GetEnumerator()
            {
                SqlMetaData[] metaData = {

                new SqlMetaData("Question_Id", SqlDbType.Int),
                new SqlMetaData("Rating_Value", SqlDbType.Int),
                new SqlMetaData("Rating_Description",SqlDbType.VarChar,500),
                new SqlMetaData("Parameter_Id",SqlDbType.Int),

                };

                foreach (var item in _data)
                {
                    SqlDataRecord record = new SqlDataRecord(metaData);
                    record.SetValue(0, item.Question_Id);
                    record.SetValue(1, item.Rating_Value);
                    record.SetValue(2, item.Rating_Description);
                    record.SetValue(3, item.Parameter_Id);
                    yield return record;
                }

            }
            System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
            {
                return this.GetEnumerator();
            }
        }
    }
}

