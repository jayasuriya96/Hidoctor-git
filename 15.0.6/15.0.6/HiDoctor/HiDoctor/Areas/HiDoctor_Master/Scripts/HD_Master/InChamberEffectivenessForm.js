var count = 0;
var userCode = '';
var ICEHistory = [];
var EvaluatedDates = [];
var evalDates = '';
var Userlst = '';



function fnGetICEQuestions() {
    debugger;


        $.ajax({
            type: "GET",
            url: "../HiDoctor_Master/FeedBack/GetICEQuestionsByUserCode",
            data: "userCode=" + userCode,           
            success: function (resp) {
                debugger;
                console.log(resp);
                fnQuestionsBindHtml(resp);
            }
        });
    
}
function fnQuestionsBindHtml(resp) {
    debugger;
    var content = '';
    var sno = 0;
    var Count = 0;
    var rcount = 0;
    if (resp.lstQuestions != null && resp.lstQuestions != '' && resp.lstQuestions != 0 && resp.lstParameters != null && resp.lstParameters != '' && resp.lstParameters != 0) {

        content += '<table class="table table-hover" style="padding:15px;" id="Qsntbl">';
        content += '<tbody>';
        for (i = 0; i < resp.lstQuestions.length; i++) {
            var Ques_id = resp.lstQuestions[i].Question_Id;
            var ParametersJson = jsonPath(resp.lstParameters, "$.[?(@.Question_Id=='" + Ques_id + "')]");
            if (ParametersJson.length >= 1) {
               
                Count++;
                count++;
                sno++;
                content += '<tr id="tableRow' + rcount + '" class="RowData">';
                content += '<td style="width:10px;font-size:15px; "><br/><b>' + sno + '.</b></td>';
                content += '<td style="width:40%;font-size:15px; white-space:normal;word-wrap:break-word;word-break:break-all;text-align:justify;"><br/><div id="Questionslst' + rcount + '"><input type="hidden" id="hdnvalue' + rcount + '" value=' + resp.lstQuestions[i].Question_Id + ' /><b>' + resp.lstQuestions[i].Questions + '</b><label id="mandatory' + rcount + '" style="color:red">*</label></div></td>';

                content += '<td style="width:40%;padding-left:20px;">';
                content += '<table  class="table table-hover">';
                content += '<tbody>';
                for (j = 0; j < ParametersJson.length; j++) {
                    debugger;
                    content += '<tr>';
                    content += '<td style="width:1%;"><input type="radio" id="rdio' + count + j + '" value="' + ParametersJson[j].Rating_Value + '" name="grp' + Count + '"><input type="hidden" value="' + ParametersJson[j].Parameter_Id + '" id="hdnParamId' + count + j + '"></td>';
                    content += '<td  style="text-align:justify;"><span id="name' + count + '">' + ParametersJson[j].Rating_Description + '</span></td>';
                    content += '</tr>';
                }
                content += '</tbody></table>';
                content += '</td>';
                content += '<td style="width:20%;"><div id="dvremarks' + rcount + '" style="padding-top:4px;"><label id=RmrksHdr>Remarks</label><br/><textarea rows="2" style="width:100%; resize:none;" placeholder="Please Enter Remarks" id="remarks' + rcount + '"></textarea></div></td>';
                content += '</tr>';

                rcount++;
            }
        }
        content += '</tbody></table>';
        content += '<label id=RmrksICE style="padding-left: 30px;">Over All Remarks</label><label style="margin-left: 76%;color:red;">* Mandatory Parameter(s)</label><br/>';
        content += '<textarea rows="4" style="width:60%;resize:none;margin-left: 30px;" placeholder="Remarks Here..." id="iceformremarks"></textarea>';
        content += '<input type="button" style="margin-bottom:65px;margin-left: 30.4%;"value="Submit" id="saveICE" class="btn btn-default" onclick="fnSaveICEForm();"/>';

        $('#Qstnslist').html(content);
        $('#divInputform').show();
        $('#Form').show();
        $('#formhdn').hide();

    }

    else {
        $('#divInputform').show();
        $('#Form').hide();
        $('#formhdn').show();

    }
    //$('#ICEslctformhdr').show();
}


function fnSaveICEForm() {
    debugger;
    //$.blockUI();
    var result = fnValidate();
    var FeedbackArray = [];
    var feedback=new Object();

    if (result == true) {
        $.blockUI();
        var Eval_date = $('#dtpckr').val();
        Eval_date = Eval_date.split('/');
        var Eval_Date = Eval_date[2] + '/' + Eval_date[1] + '/' + Eval_date[0];
        var Feedback_Remarks = $.trim($('#iceformremarks').val());     
      


        var tbl_length = $('#Qsntbl tr.RowData').length;
        var arrayno = 0;
        var radiobtncnt = 0;
        for (var tbl_count = 0; tbl_count < tbl_length; tbl_count++) {
            radiobtncnt++;
            var hdnidval = $('input[name=grp' + radiobtncnt + ']:checked').get(0).id
            var ParamId = hdnidval.replace('rdio', '');
            var lstQuestionsFdbk = {
                Questions: $('#Questionslst' + tbl_count).text().replace(/\*/g, ''),
                Question_Id: $("#hdnvalue" + tbl_count).val(),
                Assigned_Rating: $('input[name=grp' + radiobtncnt + ']:checked').val(),
                Parameter_Id: parseInt($('#hdnParamId' + ParamId).val()),
                Remarks: $.trim($('#remarks' + tbl_count).val()),
            };
            FeedbackArray[arrayno] = lstQuestionsFdbk;
            arrayno++;
        }
        if (FeedbackArray.length >= 1) {
            var Feedbackstr = JSON.stringify(FeedbackArray);
            feedback = {
                lstfeedback: FeedbackArray,
            }
            $.ajax({
                type: "POST",
                url: "../HiDoctor_Master/FeedBack/InsertFeedback",
                data: "userCode=" + userCode + "&fbRemarks=" + Feedback_Remarks + "&Eval_Date=" + Eval_Date + "&fbResponse=" + Feedbackstr,
                success: function (resp) {
                    console.log(resp);
                    $.unblockUI();
                    if (resp == "True") {
                        fnclearICEForm();
                        fnGetEvaluatedDates();
                        fnMsgAlert('info', 'In-Chamber Effectiveness', 'Feedback given Successfully.');
                        return false;
                       
                    }
                    else {
                        fnMsgAlert('info', 'In-Chamber Effectiveness', 'Failed to give feedback.Please try after sometime');
                        return false;
                    }
              
                    //$('#Feedbackform').hide();
                    //$('#hdnbtn').show();
                    

                }

            });
        }
    
    }
}

function fnValidate() {
    debugger;
    var flag = true;
    var condtn = false;
    var Eval_date = '';
    
    //var specialCharregex = new RegExp("^[a-zA-Z0-9()[]:._&;{}-\/,]+$");
   // var pattern = /[^a-z|^A-Z|^0-9|^()""{}[]&.,\/;:_-|^\s]/;


    if ($('#dtpckr').val() != '') {
        Eval_date = $('#dtpckr').val();
       // Eval_date = Eval_date.split('/');
        //Eval_Date = Eval_date[2] + '/' + Eval_date[1] + '/' + Eval_date[0];
    }
    else {
        fnMsgAlert('info', 'In-Chamber Effectiveness', 'Please Select Evaluation Date');
        flag = false;
        return;
    }


    for (var i = 0; i < EvaluatedDates.length; i++) {
        if (Eval_date == EvaluatedDates[i]) {
            condtn = true;
        }
    }

    if (condtn == true) {
        fnMsgAlert('info', 'In-Chamber Effectiveness', 'You have given feedback for this user for the selected date.\n Please select another date for feedback.');
        flag = false;
        return;
        $('#dtpckr').val();
    }
    var tbl_length = $('#Qsntbl tr.RowData').length;
    for (var tbl_count = 1; tbl_count <= tbl_length; tbl_count++) {
        if ($('input[name=grp' + tbl_count + ']:checked').val() == undefined) {
            fnMsgAlert('info', 'In-Chamber Effectiveness', 'Please give rating for parameter.' + tbl_count + '');
            flag = false;
            return;
        }

    }
    var rcount = 0;
    $('.RowData').each(function (index, obj) {
        rcount++;
        debugger;
        var result = '';
        var sRCount = obj.id.replace("tableRow", "");
        var Remarks = $('#remarks' + sRCount).val();
        if (Remarks != '') {
            result = regExforAlphaNumericSpecificRemarks($.trim($('#remarks' + sRCount).val()));
            if (result==false) {
                fnMsgAlert('info', 'In-Chamber Effectiveness', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the remarks.' + rcount + '');
                flag = false;
                return;
            }
        }
      
       
        if (Remarks.length > 500) {
            fnMsgAlert('info', 'In-Chamber Effectiveness', 'Remarks should not be more than 500 Characters.');
            flag = false;
            return;
        }
   
    });
    var FBRemarks = $.trim($('#iceformremarks').val());
    if (FBRemarks != '') {
        result = regExforAlphaNumericSpecificRemarks(FBRemarks);
        if (result==false) {
            fnMsgAlert('info', 'In-Chamber Effectiveness', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) special characters are allowed in the overall remarks.');
            flag = false;
            return;
        }
    }
    //var fbremarks = regExforAlphaNumeric($.trim($('#iceformremarks').val()));
    if (FBRemarks.length > 500) {
        fnMsgAlert('info', 'In-Chamber Effectiveness', 'Remarks should not be more than 500 Characters.');
        flag = false;
        return;
    }

    return flag;
}

function fnclearICEForm() {
    debugger;
    var radiobtncnt = 0;
    $('#dtpckr').val('');
    $('#iceformremarks').val('');
    var tbl_length = $('#Qsntbl tr').length;
    for (var tbl_count = 0; tbl_count < tbl_length; tbl_count++) {
        radiobtncnt++;
        $('#remarks' + tbl_count).val('');
        $("input:radio").attr("checked", false);
        count = 0;
        Count = 0;
    }       
}

function fnShowICEHistory() {
    debugger;
    $.ajax({
        type: "GET",
        url: "../HiDoctor_Master/FeedBack/GetFeedBackHistory",
        data: "userCode=" + userCode,       
        success: function (resp) {
            console.log(resp);
            fnBindICEhistoryHTML(resp);
        }
    });
}
function fnBindICEhistoryHTML(resp) {
    debugger;
    var content = '';
    var sno = 0;
    ICEHistory = resp;
    ICEHistoryResp = resp;
    if (resp != '' && resp != null && resp.length >= 1) {
        content += '<table class="table table-hover" id=TblhistoryICE>';
        content += '<thead>';
        content += '<tr style="text-align:center;">';
        content += '<th>S.No</th>';
        content += '<th>Feedback Id</th>';
        content += '<th>Evaluated For Date</th>';
        content += '<th>Evaluated On</th>';
        content += '<th>Evaluated For</th>';
        content += '<th>Evaluated By</th>';
        content += '<th>Action</th>';
        content += '</tr></thead>';
        content += '<tbody>';
        for (i = 0; i < resp.length; i++) {
            sno++;
            content += '<tr>';
            content += '<td>' + sno + '</td>';
            content += '<td>' + resp[i].Feedback_Id + '</td>';
            content += '<td>' + resp[i].Evaluation_Date.split(' ')[0] + '</td>';
            content += '<td>' + resp[i].Created_DateTime + '</td>';
            content += '<td>' + resp[i].User_Name + "(" + resp[i].Feedback_User_Employee_Name + ")" + '</td>';
            content += '<td>' + resp[i].Created_By + "(" + resp[i].Created_By_Employee_Name + ")" + '</td>';
            content += '<td style="cursor: pointer;text-decoration: underline;color: blue; text-align:center" Onclick="fnViewForm(\'' + resp[i].Feedback_Id + '\');">View</td>';
            content += '</tr>';
        }
        content += '</tbody></table>';
       
    }
    $('#HistoryICEbody').html(content);
    if (content != '') {
        $('#ModalICEFormHistory').modal('show');

    }
    else {
        fnMsgAlert('info', 'In-Chamber Effectiveness', 'No Feedback History For the Selected User');
        return false;
    }

}

function fnViewForm(FeedbackId) {
    debugger;
    $('#ModalICEFormHistory').modal('hide');
    var content = '';
    if (FeedbackId !== '' && FeedbackId != '') {
        $.ajax({
            type: "GET",
            url: "../HiDoctor_Master/FeedBack/GetFeedBackHistoryDetails",
            data: "Feedback_Id=" + FeedbackId,           
            success: function (resp) {
                debugger;
                console.log(resp);
                fnBindICEHistoryDetailsHTML(resp);
            }

        });
    
    }
}
function fnBindICEHistoryDetailsHTML(resp){
    debugger;
    var content = '';
    var sno = 0;
    if (resp != '') {
        var Evaluated_for = resp.lstfdbckdetails[0].User_Name + "(" +resp.lstfdbckdetails[0].Feedback_User_Employee_Name + ")";
        $('#EvalFor').html(Evaluated_for);
        var Evaluated_By = resp.lstfdbckdetails[0].Created_By + "(" + resp.lstfdbckdetails[0].Created_By_Employee_Name + ")";
        $('#EvalBy').html(Evaluated_By);
        $('#EvalDateFor').html(resp.lstfdbckdetails[0].Evaluation_Date.split(' ')[0]);
        $('#EvalOn').html(resp.lstfdbckdetails[0].Created_DateTime);
        $('#ovrallrmrks').html(resp.lstfdbckdetails[0].Feedback_Remarks);
        if (resp.lstfeedback != '' && resp.lstfeedback.length >= 1) {
            content += '<table class="table table-hover" id=TblhistoryICEFdbck  style="text-align:center;">';          
            content += '<thead>';
            content += '<tr style="text-align:center;">';
            content += '<th style="width:10px;">S.No</th>';            
            content += '<th style="width: 300px;white-space: normal;word-wrap: break-word;word-break:break-word; text-align:center;">Questions</th>';
            content += '<th style="width: 300px;white-space: normal;word-wrap: break-word;word-break:break-word;text-align:center;">Rating</th>';
            content += '<th style="width: 300px;white-space: normal;word-wrap: break-word;word-break:break-word;text-align:center;">Remarks</th>';
            content += '</tr></thead>';
            content += '<tbody>';
            for (i = 0; i < resp.lstfeedback.length; i++) {
                sno++;
                content += '<tr>';
                content += '<td>' + sno + '</td>';
                content += '<td style="text-align:left;width: 300px;white-space: normal;word-wrap: break-word;word-break:break-word;text-align:justify;">' + resp.lstfeedback[i].Questions + '</td>';
                if (resp.lstfeedback[i].Rating_Description == null) {
                    content += '<td></td>';
                } else {
                    content += '<td style="text-align:left;width: 300px;white-space: normal;word-wrap: break-word;word-break:break-word;text-align:justify;">' + resp.lstfeedback[i].Rating_Description + '</td>';
                }
                if (resp.lstfeedback[i].Remarks =='' ||resp.lstfeedback[i].Remarks ==null) {
                    content += '<td></td>';
                }
                else {
                    content += '<td style="text-align:left;width: 300px;white-space: normal;word-wrap: break-word;word-break:break-word;text-align:justify;">' + resp.lstfeedback[i].Remarks + '</td>';
                }
                content += '</tr>';

            }
            content += '</tbody></table>';
        }
        $('#DetHstry').html(content);
        $('#ModalICEFormHstrydetails').modal('show');
    }
}

function fnAssignTask() {
    debugger;
    
    var result = fnValidateTask();

    if (result == true) {
        $.blockUI();
        var taskName = $.trim($('#TskName').val());
        var taskDueDate = $('#tskduedte').val();
        taskDueDate = taskDueDate.split('/');
        var TaskDueDate = taskDueDate[2] + '/' + taskDueDate[1] + '/' + taskDueDate[0];
        var taskDescriptn = $.trim($('#tskdscrptn').val());

        $.ajax({
            type: "POST",
            url: "../HiDoctor_Master/FeedBack/InsertUserTaskDetails",
            data: "userCode=" + userCode + "&taskName=" + taskName + "&taskDescription=" + taskDescriptn + "&taskDueDate=" + TaskDueDate,
            success: function (resp) {
                console.log(resp);
                $.unblockUI();
                if (resp == "True") {
                    fnClearTask();
                    fnGetOpenTasks();
                    $('#divAddTask').hide();
                    $('#Taskslctformhdr').hide();
                    fnMsgAlert('info', 'In-Chamber Effectiveness', "Task assigned successfully");
                    return false;
                }
                else {
                    fnMsgAlert('info', 'In-Chamber Effectiveness', 'Failed to assign task.Please try after sometime');
                    return false;
                }
             
            }
        });
    }
}


function fnValidateTask() {
    debugger;
    var flag = true;
    var result = '';
    var taskName = $.trim($('#TskName').val());
    var taskDueDate = $('#tskduedte').val();
    var taskDescriptn = $.trim($('#tskdscrptn').val());
     //var specialCharregex = new RegExp("^[a-zA-Z0-9()[]:._&;{}-\/,]+$");
    if (taskName == '' || taskName == undefined || taskName == null) {
        fnMsgAlert('info', 'In-Chamber Effectiveness', "Please Enter Task Name");
        flag = false;
        return;
    }
    if(taskDescriptn == '' || taskDescriptn == undefined || taskDescriptn == null){
        fnMsgAlert('info', 'In-Chamber Effectiveness', "Please Enter Task Description");
        flag = false;
        return;
    }
    if (taskDueDate == '' || taskDueDate == undefined || taskDueDate == null) {
        fnMsgAlert('info', 'In-Chamber Effectiveness', "Please Enter Task Due Date");
        flag = false;
        return;
    }
    if (taskName.length > 200) {
        fnMsgAlert('info', 'In-Chamber Effectiveness', "Task Name Should Not Exceed 200 Characters");
        flag = false;
        return;
    }
    if (taskDescriptn.length > 250) {
        fnMsgAlert('info', 'In-Chamber Effectiveness', "Task Description Should Not Exceed 250 Characters");
        flag = false;
        return;
    }
    if (taskName != '') {
        result = regExforAlphaNumericSpecificTask(taskName);
        if (result == false) {
            fnMsgAlert('info', 'In-Chamber Effectiveness', "Only (a-z A-Z 0-9 (){}[]@\/.,-_:;!?) special characters are allowed in task name");
            flag = false;
            return;
        }
    }
    if (taskDescriptn != '') {
        taskDescriptn = regExforAlphaNumericSpecificTask(taskDescriptn);
      if (taskDescriptn==false) {
          fnMsgAlert('info', 'In-Chamber Effectiveness', "Only (a-z A-Z 0-9 (){}[]@\/.,-_:;!?) special characters are allowed in task description");
            flag = false;
            return;
        }
    }
    
    return flag;
}
function fnClearTask() {
    debugger;
    $('#TskName').val('');
    $('#tskduedte').val('');
    $('#tskdscrptn').val('');
}
function fnGetOpenTasks(value) {
    debugger;
    if (value != undefined) {
        var mode = value;
    }
    else {
        var mode = $('#filtertsks').val();
    }
    $.ajax({
        type: "GET",
        url: "../HiDoctor_Master/FeedBack/GetTasks",
        data: "userCode=" + userCode + "&mode=" + mode,        
        success: function (resp) {
            console.log(resp);
            fnBindOpenTasksHTML(resp);
        }
    });
}
function fnBindOpenTasksHTML(resp) {
    debugger;


    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    var currentdate = dd + '/' + mm + '/' + yyyy;



    var content = '';
    var sno = 0;
    content += '<table class="table table-hover" id=TblTaskhistory style="text-align:center;">';
    content += '<thead>';
    content += '<tr style="text-align:center;">';
    content += '<th style="width:10px;">S.No</th>';
    content += '<th>Task Id</th>';
    content += '<th style="width: 250px;white-space: normal;word-wrap: break-word;text-align:center;">Task Name</th>';
    content += '<th>Assigned To</th>';
    content += '<th>Assigned By</th>';
    content += '<th>Assigned On</th>';
    content += '<th>Due Date</th>';
    content += '<th>Status</th>';
    content += '<th style="width: 150px;">Days Left/OverDue By</th>';
    content += '</tr></thead>';
    content += '<tbody>';

    if (resp != '' && resp != null && resp.length >= 1) {

        for (i = 0; i < resp.length; i++) {
            sno++;
            content += '<tr>';
            content += '<td>' + sno + '</td>';
            content += '<td>' + resp[i].Task_Id + '</td>';
            content += '<td style="width: 250px;white-space: normal;word-wrap: break-word;text-align:justify;">' + resp[i].Task_Name + '</td>';
            content += '<td>' + resp[i].User_Name + "(" + resp[i].Task_User_Employee_Name + ")" + '</td>';
            content += '<td>' + resp[i].Created_By + "(" + resp[i].Created_By_Employee_Name + ")" + '</td>';
            content += '<td>' + resp[i].Created_DateTime + '</td>';
            content += '<td>' + resp[i].Task_Due_Date + '</td>';
            if (resp[i].Task_Status == 1) {
                content += '<td style="color:blue;">Open</td>';
            }
            else if (resp[i].Task_Status == 2) {
                content += '<td style="color:blue;">In Progress</td>';
            }
            else if (resp[i].Task_Status == 3) {
                content += '<td style="color:green">Completed</td>';
            }
            else if (resp[i].Task_Status == 5) {
                content += '<td style="color:blue">Re-Open</td>';
            }

            if (resp[i].Task_Status == 1 || resp[i].Task_Status == 2 || resp[i].Task_Status == 5) {
                /**********************************Over Due/Day(s) Left Calculation********************/
              
                var duedate = resp[i].Task_Due_Date;
                var duedate_dd = resp[i].Task_Due_Date.split('/')[0];
                var duedate_mm = resp[i].Task_Due_Date.split('/')[1];
                var duedate_yy = resp[i].Task_Due_Date.split('/')[2];

                if (duedate == currentdate || duedate_dd == dd && duedate_mm == mm && duedate_yy == yyyy) {
                    content += '<td style="color:blue">Today is the last day for task completion.</td>';
                }
                else if (resp[i].Days_Left != '' && resp[i].Days_Left!=0) {
                    //var daysleft = duedate - current_Date;
                    content += '<td style="color:green;">' + resp[i].Days_Left + ' Day(s) left for task completion.</td>';
                }
                else if (resp[i].Over_Due != '' && resp[i].Over_Due!=0) {
                    //var overdue = current_Date - duedate;
                    var due = resp[i].Over_Due;
                    content += '<td style="color:red;">Over due by ' + due + 'day(s).</td>';
                }

                /*****************************************************************************/
            } else if (resp[i].Task_Status == 3) {
                /**********************************Over Due/Day(s) Left Calculation For Completed Task********************/
               
                var updatedDate = resp[i].Updated_DateTime;
                var taskDueDate = resp[i].Task_Due_Date;
                var updatedDate_dd = resp[i].Updated_DateTime.split('/')[0];
                var updatedDate_mm = resp[i].Updated_DateTime.split('/')[1];
                var updatedDate_yy = resp[i].Updated_DateTime.split('/')[2];
                var taskDueDate_dd = resp[i].Task_Due_Date.split('/')[0];
                var taskDueDate_mm = resp[i].Task_Due_Date.split('/')[1];
                var taskDueDate_yy = resp[i].Task_Due_Date.split('/')[2];
                //if (updatedDate == currentdate || updatedDate_dd == dd && updatedDate_mm == mm && updatedDate_yy == yyyy) {
                //    content += '<td style="color:blue">Task completed today.</td>';
                //}
           // else 
                if (updatedDate == taskDueDate || taskDueDate_dd == updatedDate_dd && taskDueDate_mm == updatedDate_mm && taskDueDate_yy == updatedDate_yy) {
                    content += '<td style="color:blue">Task completed on due date.</td>';
                }
                else if (resp[i].After_Due != '' || resp[i].After_Due != 0) {
                    //var daysleft = duedate - current_Date;
                    content += '<td style="color:red;">Task completed after due date.</td>';
                }
                else if (resp[i].With_In != '' || resp[i].With_In != 0) {
                    //var overdue = current_Date - duedate;
                    content += '<td style="color:green;">Task completed within due date.</td>';
                }
                /*****************************************************************************/
            }

            content += '</tr>';

        }
        content += '</tbody></table>';
        $('#notsk').hide();
    }
    else {
        $('#notsk').show();
    }
    $('#TasksOpen').html(content);
}



function fnGetEvaluatedDates() {
    debugger;
    
    $.ajax({
        type: "GET",
        url: "../HiDoctor_Master/FeedBack/GetEvaluationDates",
        data: "userCode=" + userCode,       
        success: function (resp) {
            console.log(resp);
            fnPushEvalDates(resp);
        }
    });
}

function fnPushEvalDates(resp) {
    debugger;
    EvaluatedDates = [];
    if (resp.lstEvalDate != '' && resp.lstEvalDate.length >= 1) {
        var PCount = 0;
        for (i = 0; i < resp.lstEvalDate.length; i++) {
            EvaluatedDates[PCount] = resp.lstEvalDate[i].Evaluation_Date;       
           
            PCount++;
        }     
       
    }
    if (resp.lstStartDate != '' && resp.lstStartDate.length >= 1) {
       var HiDoctor_Start_Date = resp.lstStartDate[0].HiDoctor_Start_Date.split(' ')[0];
        //HiDoctor_Start_Date = HiDoctor_Start_Date.split('/');
        //HDdate = new Date();
        //HDdate.setDate(1,11,2017);
        //HDdate.setDate(HiDoctor_Start_Date);
       $("#dtpckr").datepicker("destroy");
        fnLoadHDDate(HiDoctor_Start_Date);
    }
}

function fnLoadHDDate(HDDate) {
    var date = HDDate.split('/');

    $("#dtpckr").datepicker({
        dateFormat: 'dd/mm/yy',
        numberOfMonths: 1,
        maxDate: 0,
        minDate: new Date(date[2], date[1] - 1, date[0]),
    });
}








function fnShowTaskHistory() {
    debugger;
    $.ajax({
        type:"GET",
        url: "../HiDoctor_Master/FeedBack/GetClosedTasks",
        data: "userCode=" + userCode,
        success: function (resp) {
            console.log(resp);
            fnBindTaskHistoryHTML(resp);
        }
    });
}
function fnBindTaskHistoryHTML(resp) {
    debugger;
    var content = "";
    var sno = 0;
    if (resp != '' && resp != null && resp.length >= 1) {
        content += '<table class="table table-hover" id=TblTaskhistory style="text-align:center;">';
        content += '<thead>';
        content += '<tr style="text-align:center;">';
        content += '<th style="width:10px;">S.No</th>';
        content += '<th>Task Id</th>';
        content += '<th style="width: 250px;white-space: normal;word-wrap: break-word;text-align:center;">Task Name</th>';
        content += '<th>Assigned To</th>';
        content += '<th>Assigned By</th>';
        content += '<th>Assigned On</th>';
        content += '<th>Due Date</th>';
        content += '<th>Completed On</th>';
        content += '<th>Reviewed Date</th>';
        content += '<th>Status</th>';
        content += '</tr></thead>';
        content += '<tbody>';
        for (i = 0; i < resp.length; i++) {
            sno++;
            content += '<tr>';
            content += '<td>' + sno + '</td>';
            content += '<td>' + resp[i].Task_Id + '</td>';
            content += '<td style="width: 250px;white-space: normal;word-wrap: break-word;text-align:justify;">' + resp[i].Task_Name + '</td>';
            content += '<td>' + resp[i].User_Name + "(" + resp[i].Task_User_Employee_Name + ")" + '</td>';
            content += '<td>' + resp[i].Created_By + "(" + resp[i].Created_By_Employee_Name + ")" + '</td>';
            content += '<td>' + resp[i].Created_DateTime + '</td>';
            content += '<td>' + resp[i].Task_Due_Date + '</td>';
            if (resp[i].Completed_On == null || resp[i].Completed_On == "01/01/1900") {
                content += '<td></td>';
            }
            else {
                content += '<td>' + resp[i].Completed_On + '</td>';
            }
            // content += '<td>' + resp[i].Completed_On + '</td>';
            if (resp[i].Task_Closed_Date == null) {
                content += '<td></td>';
            }
            else {
                content += '<td>' + resp[i].Task_Closed_Date + '</td>';
            }

            if (resp[i].Task_Status == 3) {
                content += '<td style="color:red;">Completed</td>';
            }
            else if (resp[i].Task_Status == 0) {
                content += '<td style="color:green;">Reviewed</td>';
            }

            content += '</tr>';

        }
        content += '</tbody></table>';
    }
    $('#TaskHistorybody').html(content);
    if (content != '') {
        $('#ModalTaskHistory').modal('show');
    }
    else {
        fnMsgAlert('info', 'In-Chamber Effectiveness', 'No Task(s) Available');
        return false;
    }
    
}

function fnGetUserTree(currentUserCode) {
    debugger;
    if (currentUserCode != '') {
        $.ajax({
            type: "GET",
            url: "../HiDoctor_Master/FeedBack/GetActiveUsers",
            data: "userCode=" + currentUserCode + "&includeOneLevelParent=NO",
            success: function (resp) {
                console.log(resp);
                Userlst = resp;
                fnBindUserTreeHTML(resp);
            }
        });
    }
}
function fnBindUserTreeHTML(resp) {
    debugger;
    var content = '';
    if (resp != '' && resp != null && resp.length >= 1) {

        autoComplete(resp, "usertree", "hdnusercode", "auto_Tree_List");
        
    }
   // $('#users').html(content);
}
function fnGetICEFormView(InptuserCode) {
    debugger;
    userCode = InptuserCode;
    fnGetEvaluatedDates();
    fnGetICEQuestions();
    fnGetOpenTasks();
}

function fnGetJointWorkingDates() {
    debugger;
    selectedMonth = fngetMonthNumber($('#mnthpckr').val().split('-')[0]);
    selectedYear = $('#mnthpckr').val().split('-')[1];
    days = daysInMonth(selectedMonth, selectedYear);

    var startDate = selectedYear + "-" + selectedMonth + "-" + "01";
    var endDate = selectedYear + "-" + selectedMonth + "-" + days;
    $.ajax({
        type: "GET",
        url: "../HiDoctor_Master/FeedBack/GetJointWorkingDates",
        data: "childuserCode=" + userCode + "&childuserName=" + childUserName + "&startDate=" + startDate + "&endDate=" + endDate,
        success: function (resp) {
            console.log(resp);
            fnBindGetJointWorkingDates(resp);
        }
    });
}

function fnBindGetJointWorkingDates(resp) {
    debugger;
    var content = '';
    var Content = '';
    var ContentData = '';
    var sno = 0;
    var sNo = 0;

    if (resp.lstParentDates != '' && resp.lstParentDates.length >= 1) {

        if (resp.lstParentDates != '' && resp.lstParentDates.length >= 1 && resp.lstParentDates != null) {
            content += '<table class="table table-hover">';
            content += '<tbody>';
            for (var i = 0; i < resp.lstParentDates.length; i++) {
                sno++;
                content += '<tr>';
                content += '<td>' + sno + '</td>';
                content += '<td>' + resp.lstParentDates[i].Jointdates.split(' ')[0] + '</td>';
                content += '</tr>';
            }
            content += '</tbody></table>';

        }
    }
    else {
        content = '<div style="width:100%;"><div style="padding: 15px;background: rgb(241, 241, 241); text-align:center;"><b>No Working Dates</b></div></div>';
        $('#ParentData').html(content);
    }
    $('#ParentData').html(content);
    //else{
    //    content = '<div class="container" style="width:100%;padding:20px;"><div style="padding: 15px;background: rgb(241, 241, 241); text-align:center;"><b>No Working Dates</b></div></div>';
    //}
    if (resp.lstChildDates != '' && resp.lstChildDates.length >= 1) {
        if (resp.lstChildDates != '' && resp.lstChildDates.length >= 1 && resp.lstChildDates != null) {
            Content += '<table class="table table-hover">';
            Content += '<tbody>';
            for (var i = 0; i < resp.lstChildDates.length; i++) {
                sNo++;
                Content += '<tr>';
                Content += '<td>' + sNo + '</td>';
                Content += '<td>' + resp.lstChildDates[i].Jointdates.split(' ')[0] + '</td>';
                Content += '</tr>';
            }
            Content += '</tbody></table>';


        }
    }
    else {
        Content = '<div style="width:100%;"><div style="padding: 15px;background: rgb(241, 241, 241); text-align:center;"><b>No Working Dates</b></div></div>';
        // $('#wrkdates').append(ContentData);
        // $('#parentdates').hide();
        // $('#childdates').hide();
        $('#ChildData').html(Content);
    }
    $('#ChildData').html(Content);
}

//function fnvalidateEvalDate() {
//    debugger;
//    var Eval_Date = $('#dtpckr').val();
//    if (Eval_Date != '') {
       
//    }
//}

function fngetMonthNumber(monthName) {
    if (monthName.toUpperCase() == "JAN") {
        return 1;
    }
    if (monthName.toUpperCase() == "FEB") {
        return 2;
    }
    if (monthName.toUpperCase() == "MAR") {
        return 3;
    }
    if (monthName.toUpperCase() == "APR") {
        return 4;
    }
    if (monthName.toUpperCase() == "MAY") {
        return 5;
    }
    if (monthName.toUpperCase() == "JUN") {
        return 6;
    }
    if (monthName.toUpperCase() == "JUL") {
        return 7;
    }
    if (monthName.toUpperCase() == "AUG") {
        return 8;
    }
    if (monthName.toUpperCase() == "SEP") {
        return 9;
    }
    if (monthName.toUpperCase() == "OCT") {
        return 10;
    }
    if (monthName.toUpperCase() == "NOV") {
        return 11;
    }
    if (monthName.toUpperCase() == "DEC") {
        return 12;
    }
}
function fngetMonthName(monthNum) {
    if (monthNum == 1) {
        return "JAN";
    }
    if (monthNum == 2) {
        return "FEB";
    }
    if (monthNum == 3) {
        return "MAR";
    }
    if (monthNum == 4) {
        return "APR";
    }
    if (monthNum == 5) {
        return "MAY";
    }
    if (monthNum == 6) {
        return "JUN";
    }
    if (monthNum == 7) {
        return "JUL";
    }
    if (monthNum == 8) {
        return "AUG";
    }
    if (monthNum == 9) {
        return "SEP";
    }
    if (monthNum == 10) {
        return "OCT";
    }
    if (monthNum == 11) {
        return "NOV";
    }
    if (monthNum == 12) {
        return "DEC";
    }
}
function regExforAlphaNumericSpecificRemarks(value) {
    var specialCharregex = new RegExp(/[*&%$^#<>+=~`""|]/g);
    //var specialCharregex = new RegExp("^[''!@#$%^*?+=|]+$");
    if (specialCharregex.test(value)==true) {
        return false;
    }
    else {
        return true;
    }
}
function regExforAlphaNumericSpecificTask(value) {
    var specialCharregex = new RegExp(/[*&%$^#<>+=~`""|]/g);
    //var specialCharregex = new RegExp("^[0-9''@#$%^*+=|]+$");
    if (specialCharregex.test(value) == true) {
        return false;
    }
    else {
        return true;
    }
}

