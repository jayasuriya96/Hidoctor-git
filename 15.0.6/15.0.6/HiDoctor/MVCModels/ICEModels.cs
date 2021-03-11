using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class ICEUserTypeModel
    {
        public string User_Type_Name { get; set; }
        public string User_Type_Code { get; set; }
    }
    public class ICEUserTreeModel
    {
        public string User_Code { get; set; }
        public string User_Name { get; set; }
        public string User_Type_Code { get; set; }
        public string User_Type_Name { get; set; }
        public string Region_Name { get; set; }
        public string Region_Code { get; set; }
        public string Under_User_Code { get; set; }
        public int Child_Count { get; set; }
        public string Full_Index { get; set; }
        public string label { get; set; }
        public string value { get; set; }

    }
    public class QuestionModel
    {
        public string Questions { get; set; }
        public int Question_Id { get; set; }
        public int Question_Active { get; set; }
        public int Question_Type { get; set; }
    }

    public class ResponseModel
    {
        public string Questions { get; set; }
        public int Question_Id { get; set; }
        public int Assigned_Rating { get; set; }
        public string Remarks { get; set; }
        public int Feedback_Id { get; set; }
        public int Question_Type { get; set; }
        public string Rating_Description { get; set; }
        public int Rating_Value { get; set; }      
        public int Parameter_Id { get; set; }

    }

    public class FeedbackDetailsModel
    {
        public string Evaluation_Date { get; set; }
        public string Feedback_Remarks { get; set; }
        public int Feedback_Id { get; set; }
        public string User_Code { get; set; }
        public string User_Name { get; set; }
        public int Feedback_Status { get; set; }
        public string Created_By { get; set; }
        public string Created_DateTime { get; set; }
        public string Feedback_User_Employee_Name { get; set; }
        public string Created_By_Employee_Name { get; set; }
    }
    public class FeedbackModel
    {
        public List<FeedbackDetailsModel> lstfdbckdetails { get; set; }
        public List<ResponseModel> lstfeedback { get; set; }
    }
    public class TaskDetailsModel
    {
        public string Task_Name { get; set; }
        public string Task_Description { get; set; }
        public int Task_Id { get; set; }
        public int Task_Status { get; set; }
        public string Task_Due_Date { get; set; }
        public string Created_By { get; set; }
        public string Created_DateTime { get; set; }
        public string User_Name { get; set; }
        public string User_Code { get; set; }
        public string Task_Closed_Date { get; set; }
        public string Completed_On { get; set; }
        public string Assignee_Remarks { get; set; }
        public int Over_Due { get; set; }
        public int Days_Left { get; set; }
        public int After_Due { get; set; }
        public int With_In { get; set; }
        public string Created_By_Employee_Name { get; set; }
        public string Task_User_Employee_Name { get; set; }
        public string Updated_DateTime { get; set; }
    }
    public class TaskCount
    {
        public int Task_Count { get; set; }
    }
    public class JointDatesModel
    {
        public string Jointdates { get; set; }


    }
    public class JointWorkingDatesModel
    {
        public List<JointDatesModel> lstParentDates { get; set; }
        public List<JointDatesModel> lstChildDates { get; set; }
    }
    public class UserStartDateModel
    {
        public string HiDoctor_Start_Date { get; set; }
    }
    public class DatesModel
    {
        public List<UserStartDateModel> lstStartDate { get; set; }
        public List<FeedbackDetailsModel> lstEvalDate { get; set; }
    }
    public class ParametersModel
    {
        public string Rating_Description { get; set; }
        public int Rating_Value { get; set; }
        public int Question_Id { get; set; }
        public int Parameter_Id{get;set;}
    }
    public  class QuestionParameterModel
    {
        public List<QuestionModel> lstQuestions { get; set; }
        public List<ParametersModel> lstParameters { get; set; }

    }
    
}