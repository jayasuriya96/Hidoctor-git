var task_Status = '';
var MyTasksCount = '';
var TeamTasksCount = '';
var MyFollowUpsCount = '';
var TeamFollowUpsCount = '';
var Status = 1;

function fnTaskActivePane() {

    if (MyTasksCount > 0) {
        //$('#MyTasks').addClass("active");
        //$('.MYTasks').addClass("active");
        $('#dvTab').tabs('option', 'selected', 0);
    }
    else if (TeamTasksCount > 0) {
        //$('#TasksByMe').addClass("active");
        //$('.taskByME').addClass("active");
        $('#dvTab').tabs('option', 'selected', 1);
    }
    else if (MyFollowUpsCount > 0) {
        $('#dvTab').tabs('option', 'selected', 2);
    }
    else if (TeamFollowUpsCount > 0) {
        $('#dvTab').tabs('option', 'selected', 3);
    } else {
        $('#dvTab').tabs('option', 'selected', 0);
    }
}
//assigned to me
var MyTasksDrpDwn = '';
function fnGetMyTasksByStatus() {
    debugger;
   
   
    $.ajax({
        type: "Get",
        url: "../HIDoctor_Master/FeedBack/GetTasksByStatus",
        data: "",
        //async: false,
        success: function (resp) {
            //console.log(resp);
            MyTasksList = resp;
            MyTasksCount = resp.length;
            MyTasksDrpDwn = $('#myfiltertsks :selected').val();
            if (MyTasksDrpDwn != 4) {
                resp = $.grep(resp, function (element, index) {
                    return element.Task_Status == MyTasksDrpDwn;
                });
                if (resp.length == 0) {

                    resp = $.grep(resp, function (element, index) {
                        return element.Task_Status == 2;
                    });
                    $('#myfiltertsks').val(2);
                }
                if (resp.length == 0) {
                    resp = $.grep(resp, function (element, index) {
                        return element.Task_Status == 5;
                    });
                    $('#myfiltertsks').val(5);
                }
            }
           
            fnBindTasksByStatusHTML(resp);
        },
        complete: function (e) {
            fnGetTeamTasksByStatus();
        }
    });
}
function fnFilterMyTasks(value) {
    debugger;
    var resp='';
    if (value != 4) {
        resp = $.grep(MyTasksList, function (element, index) {
            return element.Task_Status == value;
        });
    } else {
        resp = MyTasksList;
    }
   
    fnBindTasksByStatusHTML(resp);
}

function fnBindTasksByStatusHTML(resp) {
    debugger;
    var content = '';
    var sno = 0;
   
    //$('#myfiltertsks').val(stat);
    //if (stat != undefined && stat != "" && stat != 4) {
    //    resp = jsonPath(resp, "$.[?(@.Task_Status=='" + stat + "')]");
    //}
    if (resp != '' && resp != null && resp.length >= 1) {
        content += '<table class="main table table-hover " id=TblTaskhistory style="text-align:center;overflow-x:hidden;overflow-y:auto;">';
        content += '<thead>';
        content += '<tr style="text-align:center;">';
        content += '<th style="width:10px;">S.No</th>';
        content += '<th style="display:none;">Task Id</th>';
        content += '<th>Assigned To</th>';
        content += '<th>Assigned By</th>';
        content += '<th>Assigned On</th>';
        content += '<th>Due Date</th>';
        content += '<th style="width: 150px;">Days Left/OverDue By</th>';
        //content += '<th>Closed Date</th>';
        content += '<th>Task Status</th>';
        content += '<th>Action</th>';
        content += '</tr></thead>';
        content += '<tbody>';
        for (i = 0; i < resp.length; i++) {
            //if (Status == resp[i].Task_Status || Status == 4) {
                sno++;
                content += '<tr>';
                content += '<td>' + sno + '</td>';
                content += '<td type= hidden style="display:none;">' + resp[i].Task_Id + '</td>';
                content += '<td>' + resp[i].User_Name + "(" + resp[i].Task_User_Employee_Name + ")" + '</td>';
                content += '<td>' + resp[i].Created_By + "(" + resp[i].Created_By_Employee_Name + ")" + '</td>';
                content += '<td>' + resp[i].Created_DateTime + '</td>';
                content += '<td>' + resp[i].Task_Due_Date + '</td>';

                /**********************************Over Due/Day(s) Left Calculation********************/

                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth() + 1;
                var yyyy = today.getFullYear();
                var currentdate = dd + '/' + mm + '/' + yyyy;
               
                var duedate = resp[i].Task_Due_Date;
                var duedate_dd = resp[i].Task_Due_Date.split('/')[0];
                var duedate_mm = resp[i].Task_Due_Date.split('/')[1];
                var duedate_yy = resp[i].Task_Due_Date.split('/')[2];
            
                if (resp[i].Task_Status != 0 && resp[i].Task_Status != 3) {

                    if (duedate == currentdate || duedate_dd == dd && duedate_mm == mm && duedate_yy == yyyy) {
                        content += '<td style="color:blue">Today is the last day for task completion.</td>';
                    }
                    else if (resp[i].Days_Left != '' && resp[i].Days_Left != 0) {
                        //var daysleft = duedate - current_Date;
                        content += '<td style="color:green;">' + resp[i].Days_Left + ' Day(s) left for task completion.</td>';
                    }
                    else if (resp[i].Over_Due != '' && resp[i].Over_Due != 0) {
                        //var overdue = current_Date - duedate;
                        var due = resp[i].Over_Due;
                        content += '<td style="color:red;">Over due by ' + due + 'day(s).</td>';
                    }
                    else if (resp[i].Over_Due = '' && resp[i].Over_Due == 0) {
                        //var overdue = current_Date - duedate;

                        content += '<td></td>';
                    }
                } else if (resp[i].Task_Status == 3) {
                    if (resp[i].Updated_DateTime != null && resp[i].Updated_DateTime != undefined && resp[i].Updated_DateTime != "") {
                        var today = new Date();
                        var dd = today.getDate();
                        var mm = today.getMonth() + 1;
                        var yyyy = today.getFullYear();
                        var currentdate = dd + '/' + mm + '/' + yyyy;
                        var tdDate = yyyy + '/' + mm + '/' + dd;
                        var TDdate = new Date(tdDate);

                        var updatedDate = resp[i].Updated_DateTime;//.split(' ')[0];
                        updatedDate = updatedDate.split('/')[2] + '/' + updatedDate.split('/')[0] + '/' + updatedDate.split('/')[1];
                        var UPdate = new Date(updatedDate);
                        var taskDueDate = resp[i].Task_Due_Date;
                        taskDueDate = taskDueDate.split('/')[2] + '/' + taskDueDate.split('/')[1] + '/' + taskDueDate.split('/')[0];
                        var DDDate = new Date(taskDueDate);
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
                    }
                    if (taskDueDate_yy != undefined && updatedDate_yy != undefined && taskDueDate != undefined && updatedDate != undefined && taskDueDate_mm != undefined && updatedDate_mm != undefined) {

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
                        else if (updatedDate == null || updatedDate == '' || resp[i].With_In == '' || resp[i].After_Due == '') {
                            content += '<td> </td>'

                        }
                    }
                    else {
                        content += '<td></td>';
                    }
                }
                else {
                    content += '<td>Task Reviewed</td>';
                }
                /*****************************************************************************/

                //if (resp[i].Task_Closed_Date == null || resp[0].Task_Closed_Date != "1/1/1900") {
                //    content += '<td></td>';
                //}
                //else {
                //    content += '<td>' + resp[i].Task_Closed_Date + '</td>';
                //}
                if (resp[i].Task_Status == 1) {
                    content += '<td style="color:brown">Open</td>';
                }
                else if (resp[i].Task_Status == 2) {
                    content += '<td style="color:brown">In Progress</td>';
                }
                else if (resp[i].Task_Status == 5) {
                    content += '<td style="color:brown">Re-Open</td>';
                }
                else if (resp[i].Task_Status == 3) {
                    content += '<td style="color:green">Completed</td>';
                }
                else if (resp[i].Task_Status == 0) {
                    content += '<td style="color:red">Reviewed</td>';
                }
                content += '<td style="cursor: pointer;text-decoration: underline;color: blue; text-align:center" Onclick="fnViewTask(\'' + resp[i].Task_Id + '\');">View</td>';
                content += '</tr>';
            //}
        }

        content += '</tbody></table>';


    }
    else {
        content += '<div class="container" style="width:100%;padding:20px;"><div style="padding: 15px;background: rgb(241, 241, 241); text-align:center;"><b>No Tasks Assigned</b></div></div>';
    }
    $('#MyTaskData').html(content);

}
//assigned to me view popup
function fnViewTask(TaskId) {
    debugger;
   
    $.ajax({
        type: "GET",
        url: "../HiDoctor_Master/FeedBack/GetTaskById",
        data: "Task_Id=" + TaskId,
        success: function (resp) {
            console.log(resp);
            fnBindTaskByIdHTML(resp);
        },

    });
}



function fnBindTaskByIdHTML(resp) {
    debugger;
    task_Status = '';

    $("#Statusfiltertsks option[value='1']").show();
    $("#Statusfiltertsks option[value='5']").show();
    $("#Statusfiltertsks option[value='2']").show();
    $("#Statusfiltertsks option[value='0']").show();
    if (resp != '' && resp != null) {
        $('#TaskId').html(resp[0].Task_Id);
        $('#tskName').html(resp[0].Task_Name);
        $('#tskDescrtn').html(resp[0].Task_Description);
        var Assigned_To = resp[0].User_Name + "(" + resp[0].Task_User_Employee_Name + ")";
        $('#AssgnTo').html(Assigned_To);
        var Assigned_By = resp[0].Created_By + "(" + resp[0].Created_By_Employee_Name + ")";
        $('#AssgnBy').html(Assigned_By);
        $('#DueDate').html(resp[0].Task_Due_Date);
        $('#AssgnOn').html(resp[0].Created_DateTime);
        $('#rmrks').html(resp[0].Assignee_Remarks);
        if (resp[0].Updated_DateTime != null || resp[0].Updated_DateTime != "1/1/1900") {
            $('#ClosedOn').html(resp[0].Updated_DateTime);
        }
        else {
            $('#ClosedOn').html('');
        }
        if (resp[0].Task_Status == 1) {
            $("#Statusfiltertsks option[value='5']").hide();
            $("#Statusfiltertsks option[value='1']").hide();
           // $("#Statusfiltertsks option[value='2']").show();
            $('#Statusdrpdwn').show();
            $('#Statusfiltertsks').val(resp[0].Task_Status);
            $('#reviewedstat').hide();
            $('#remarks').hide();
            $('#updtbtn').hide();
            $('#tskclsdon').hide();
            $('#remrks').hide();
            task_Status = resp[0].Task_Status;

        }
        else if (resp[0].Task_Status == 2) {
            $("#Statusfiltertsks option[value='1']").hide();
            $("#Statusfiltertsks option[value='5']").hide();
            $("#Statusfiltertsks option[value='2']").hide();
            $('#Statusdrpdwn').show();
            $('#Statusfiltertsks').val(resp[0].Task_Status);
            $('#reviewedstat').hide();
            $('#remarks').hide();
            $('#updtbtn').hide();
            $('#tskclsdon').hide();
            $('#remrks').hide();
            task_Status = resp[0].Task_Status;
        }
        else if (resp[0].Task_Status == 3) {
            var status = 'Completed'
            $('#Statusdrpdwn').hide();
            $('#Status').html(status);
            $('#Statusfiltertsks').val(resp[0].Task_Status);
            $('#reviewedstat').show();
            $('#remarks').hide();
            $('#updtbtn').hide();
            $('#remrks').show();
            $('#tskclsdon').show();
            task_Status = resp[0].Task_Status;
        }
        else if (resp[0].Task_Status == 5) {
            var status = 'Re-Open'
            $("#Statusfiltertsks option[value='1']").hide();
            $("#Statusfiltertsks option[value='5']").hide();
            $('#reviewedstat').hide();
            $('#Statusfiltertsks').val(resp[0].Task_Status);
           // $('#Status').html(status);
            $('#Statusdrpdwn').show();
            $('#remarks').hide();
            $('#updtbtn').hide();
            $('#tskclsdon').hide();
            $('#remrks').hide();
            task_Status = resp[0].Task_Status;
        }
        else if (resp[0].Task_Status == 0) {
            var status = "Reviewed";
            $('#Status').html(status);
            $('#Statusdrpdwn').hide();
            $('#reviewedstat').show();
            $('#updtbtn').hide();
            $('#remrks').show();
            $('#tskclsdon').hide();
            $('#remarks').hide();
        }

        var Updatebutton = '<button type="button" class="btn btn-default" id="btnupdt" onclick="fnUpdateStatus(\'' + resp[0].Task_Id + '\')">Update</button>';
        $('#updtbtn').html(Updatebutton);
    }
    $('#ModalTaskView').modal('show');
}

function fnChange(value) {
    debugger;
    if (value == 2 || value == 1 || value == 5) {
        $('#remarks').hide();
        $('#rmrkstxt').val('');

    }
    if (value == 2 || value == 3) {
        $('#updtbtn').show();
    }
    if (value == 3) {
        $('#remarks').show();
    }
    if (value == task_Status) {
        $('#updtbtn').hide();

    }
}

function fnUpdateStatus(TaskId) {
    debugger;
    if (TaskId != undefined) {
        var TaskStatus = $('#Statusfiltertsks').val();

        var Remarks = $.trim($('#rmrkstxt').val());
        if (Remarks.length > 500) {
            fnMsgAlert('info', 'Tasks View', 'Remarks should not be more than 500 Characters.');
            return false;
        }
        else if (Remarks != '') {
            // result=regExforAlphaNumericSpecificRemarks(Remarks);
            var result = regExforAlphaNumericSpecificRemarks(Remarks);
            if (result == false) {
                fnMsgAlert('info', 'Tasks View', "Only (a-z A-Z 0-9 (){}@[]\/.,'-_?!) special characters are allowed in the remarks.");
                return false;
            }
        }
        $('#ModalTaskView').modal('hide');
        //else if (Remarks == '' || Remarks != '') {
        $.blockUI();
        $.ajax({
            type: "POST",
            url: "../HiDoctor_Master/FeedBack/UpdateTaskStatus",
            data: "Task_Id=" + TaskId + "&Task_Status=" + TaskStatus + "&Remarks=" + Remarks,
            success: function (resp) {
                debugger;
                console.log(resp);
                $.unblockUI();
                fnGetMyTasksByStatus();
                $('#rmrkstxt').val('');

                $("#Statusfiltertsks option[value='1']").show();
                $("#Statusfiltertsks option[value='5']").show();
                $("#Statusfiltertsks option[value='2']").show();
                $("#Statusfiltertsks option[value='0']").show();
            }
        });
        fnMsgAlert('info', 'Tasks View', "Status has been updated.");
        fnGetMyTasksByStatus();
        // fnGetMyTasksByStatus(3);
       // window.location.reload();

    }
}

//function fnUpdatewithRemarks() {
//    debugger;
//    $('#ModalTaskView').modal('show');
//}
//function fnUpdatewithRemarks(TaskId,TaskStatus) {
//    debugger;
//    var TaskStatus = $('#Statusfiltertsks').val();

//}
//assigned by me 
var TeamTasksDrpDwn = '';
function fnGetTeamTasksByStatus() {
    debugger;
    //Status = parseInt(status)
    //var Statusfltr = '';
    //if (status != undefined && status != null) {
    //    Statusfltr = status;
    //}
    $.ajax({
        type: "Get",
        url: "../HIDoctor_Master/FeedBack/GetAllTasksByMe",
        //data: "status=" + status,
        data: "",
        //async: false,
        success: function (resp) {
            //console.log(resp);
            TeamTasksList = resp;
            TeamTasksCount = resp.length;
            TeamTasksDrpDwn = $('#filtertsksteam :selected').val();
            if (TeamTasksDrpDwn != 4) {
                resp = $.grep(resp, function (element, index) {
                    return element.Task_Status == TeamTasksDrpDwn;
                });
            }
            fnBindTeamTasksByStatusHTML(resp);
        },
        complete: function (e) {
            Followuptasks();
        }
    });
}
function fnFilterTeamTasks(value) {
    debugger;
    var resp = '';
    if (value != 4) {
        resp = $.grep(TeamTasksList, function (element, index) {
            return element.Task_Status == value;
        });
    } else {
        resp = TeamTasksList;
    }

    fnBindTeamTasksByStatusHTML(resp);
}

function fnBindTeamTasksByStatusHTML(resp) {
    debugger;
    var content = '';
    var sno = 0;
   
    //$('#filtertsksteam').val(stat);
    //if (stat != undefined && stat != "" && stat != 4) {
    //    resp = jsonPath(resp, "$.[?(@.Task_Status=='" + stat + "')]");
    //}
    if (resp != '' && resp != null && resp.length >= 1) {
        content += '<table class="main table table-hover" style="text-align:center;overflow-x:hidden;overflow-y:auto;">';
        content += '<thead>';
        content += '<tr style="text-align:center;">';
        content += '<th style="width:10px;">S.No</th>';
        content += '<th style="display:none;">Task Id</th>';
        content += '<th>Task Name</th>';
        content += '<th>Assigned To</th>';
        content += '<th>Assigned On</th>';
        content += '<th>Due Date</th>';
        content += '<th>Completed On</th>';
        content += '<th>Completion Duration</th>';
        content += '<th>Task Status</th>';
        content += '<th>Action</th>';
        content += '</tr></thead>';
        content += '<tbody>';
        for (i = 0; i < resp.length; i++) {
            //if (Status == resp[i].Task_Status || Status == 4) {


                sno++;
                content += '<tr>';
                content += '<td>' + sno + '</td>';
                content += '<td type=hidden style="display:none;">' + resp[i].Task_Id + '</td>';
                content += '<td style="width: 400px;white-space: normal;word-wrap: break-word; text-align:left;">' + resp[i].Task_Name + '</td>';
                content += '<td>' + resp[i].User_Name + "(" + resp[i].Task_User_Employee_Name + ")" + '</td>';
                //content += '<td>' + resp[i].Created_By + '</td>';
                content += '<td>' + resp[i].Created_DateTime + '</td>';
                content += '<td>' + resp[i].Task_Due_Date + '</td>';
                if (resp[i].Updated_DateTime == '' || resp[i].Updated_DateTime == null) {
                    content += '<td> </td>';
                } else if (resp[i].Task_Status==3) {
                    content += '<td>' + resp[i].Updated_DateTime + '</td>';
                } else {
                    content += '<td> </td>';
                }

            /**********************************Over Due/Day(s) Left Calculation********************/
                if (resp[i].Task_Status == 3) {


                    if (resp[i].Updated_DateTime != null && resp[i].Updated_DateTime != "" && resp[i].Updated_DateTime != undefined) {
                        var today = new Date();
                        var dd = today.getDate();
                        var mm = today.getMonth() + 1;
                        var yyyy = today.getFullYear();
                        var currentdate = dd + '/' + mm + '/' + yyyy;
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
                    }
                    if (taskDueDate_yy != undefined && updatedDate_yy != undefined && taskDueDate != undefined && updatedDate != undefined && taskDueDate_mm != undefined && updatedDate_mm != undefined) {
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
                        else if (updatedDate == null || updatedDate == '' || resp[i].With_In == '' || resp[i].After_Due == '' || taskDueDate_yy == '' || taskDueDate_mm == '' || taskDueDate_dd == '' || updatedDate_dd == '' || updatedDate_mm == '' || updatedDate_yy == '') {
                            content += '<td> </td>'

                        }
                    }
                } else if (resp[i].Task_Status==5) {

                    content += '<td>Task Re-Opened</td>';
                } 
              
                else if (resp[i].Task_Status == 0) {
                    content += '<td>Task Reviewed</td>';
                } else if(resp[i].Task_Status == 2){
                    content += '<td>Task In-Progress</td>';
                }
                else {
                    content += '<td>Task Open</td>';
                }
                /*****************************************************************************/

                //if (resp[i].Task_Closed_Date == null) {
                //    content += '<td></td>';
                //}
                //else {
                //    content += '<td>' + resp[i].Task_Closed_Date + '</td>';
                //}
                //content += '<td></td>';
                if (resp[i].Task_Status == 3) {
                    content += '<td style="color:green">Completed</td>';
                }
                else if (resp[i].Task_Status == 0) {
                    content += '<td style="color:red">Reviewed</td>';
                }
                else if (resp[i].Task_Status == 1) {
                    content += '<td style="color:brown">Open</td>';
                }
                else if (resp[i].Task_Status == 2) {
                    content += '<td style="color:brown">In Progress</td>';
                }
                else if (resp[i].Task_Status == 5) {
                    content += '<td style="color:brown">Re-Open</td>';
                }

                content += '<td style="cursor: pointer;text-decoration: underline;color: blue; text-align:center;" Onclick="fnViewTaskAssgnByMe(\'' + resp[i].Task_Id + '\');">View</td>';
                content += '</tr>';

           // }
        }
        content += '</tbody></table>';

    }
    else {
        content += '<div class="container" style="width:100%;padding:20px;"><div style="padding: 15px;background: rgb(241, 241, 241); text-align:center;"><b>No Tasks Assigned </b></div></div>';
    }
    $('#TaskDataByMe').html(content);
   
}

function fnViewTaskAssgnByMe(TaskId) {
    debugger;
    $.ajax({
        type: "GET",
        url: "../HiDoctor_Master/FeedBack/GetTaskById",
        data: "Task_Id=" + TaskId,
        success: function (resp) {
            console.log(resp);
            fnBindTeamTaskByIdHTML(resp);
        }
    });
}
function fnBindTeamTaskByIdHTML(resp) {
    debugger;
    if (resp != '' && resp != null) {
        $('#TaskId').html(resp[0].Task_Id);
        $('#tskName').html(resp[0].Task_Name);
        $('#tskDescrtn').html(resp[0].Task_Description);
        var Assigned_To = resp[0].User_Name + "(" + resp[0].Task_User_Employee_Name + ")";
        $('#AssgnTo').html(Assigned_To);
        var Assigned_By = resp[0].Created_By + "(" + resp[0].Created_By_Employee_Name + ")";
        $('#AssgnBy').html(Assigned_By);
        $('#DueDate').html(resp[0].Task_Due_Date);
        $('#AssgnOn').html(resp[0].Created_DateTime);
        $('#rmrks').html(resp[0].Assignee_Remarks);
        if (resp[0].Updated_DateTime != null || resp[0].Updated_DateTime != "1/1/1900") {
            $('#ClosedOn').html(resp[0].Updated_DateTime);
        }
        else {
            $('#ClosedOn').html('');
        }
        if (resp[0].Task_Status == 1) {
            $('#Statusdrpdwn').hide();
            var status="Open"
            $('#Status').html(status);
            $('#reviewedstat').show();          
            $('#remarks').hide();
            $('#remrks').hide();
            $('#updtbtn').hide();

        }
        else if (resp[0].Task_Status == 2) {
            $('#Statusdrpdwn').hide();
            var status="In Progress"
            $('#Status').html(status);
            $('#reviewedstat').show();
            $('#remarks').hide();
            $('#remrks').hide();
            $('#updtbtn').hide();
        }
        else if (resp[0].Task_Status == 3) {
            $('#Statusdrpdwn').hide();
            var status = "Completed"
            $('#Status').html(status);
            $('#tskclsdon').show();
            $('#reviewedstat').show();
            $('#remarks').hide();
            $('#remrks').show();
            $('#updtbtn').show();
            //$('#rmrkstxt').hide();
        }
        else if (resp[0].Task_Status == 0) {
            $('#Statusdrpdwn').hide();
            var status = "Reviewed";
            $('#Status').html(status);
            $('#Statusdrpdwn').hide();
            $('#reviewedstat').show();
            $('#remrks').show();
            $('#updtbtn').hide();
            $('#remarks').hide();
            $('#tskclsdon').hide();
            //$('#rmrkstxt').hide();

        }
        else if (resp[0].Task_Status == 5) {
            $('#Statusdrpdwn').hide();
            var status = "Re-Open";
            $('#Status').html(status);
            $('#Statusdrpdwn').hide();
            $('#reviewedstat').show();
            $('#tskclsdon').hide();
            $('#remrks').hide();
            $('#remarks').hide();
            $('#updtbtn').hide();
           // $('#ClosedOn').hide();
        }
        var task_status = 0;
        var Task_Status = 5;
        var Updatebutton = '<button type="button" class="btn btn-default" id="btnupdt" onclick="fnUpdateTeamStatus(\'' + resp[0].Task_Id + '\',\'' + task_status + '\')">Reviewed</button><button type="button" class="btn btn-default" id="btnupdt" onclick="fnUpdateTeamStatus(\'' + resp[0].Task_Id + '\',\'' + Task_Status + '\')">Re-open</button>';
        $('#updtbtn').html(Updatebutton);
    }
    $('#ModalTaskView').modal('show');
}

function fnUpdateTeamStatus(TaskId, TaskStatus) {
    debugger;
    var remarks = $('#rmrkstxt').val();

    var Task_Status = TaskStatus;
    $('#ModalTaskView').modal('hide');
    $.ajax({
        type: "POST",
        url: "../HiDoctor_Master/FeedBack/UpdateTaskStatus",
        data: "Task_Id=" + TaskId + "&Task_Status=" + Task_Status + "&Remarks=" + remarks,
        success: function (resp) {
            //console.log(resp);
            fnGetTeamTasksByStatus();
            $('#rmrkstxt').val('');

        }
    });
}
function regExforAlphaNumericSpecificRemarks(value) {

    var specialCharregex = new RegExp(/[*&%$^#<>+=~`""|]/g);
    //var specialCharregex = new RegExp("^[0-9''@#$%^*+=|]+$");
    if (specialCharregex.test(value) == true) {
        return false;
    }
    else {
        return true;
    }
}
var task_list = '';
var MyFollowupsDrpDwn = '';
function Followuptasks() {
    //Status = parseInt(status)
    debugger;
    //var Statusfltr='';
    //if(status!=undefined&&status!=null){
    //    Statusfltr=status;
    //}
    $.ajax({
        type: "Get",
        url: "../HIDoctor_Master/FeedBack/GetAllFollowUps",
        data: "",
        //async: false,
        success: function (resp) {
            //task_list = resp;
            //console.log(resp);
            MyFollowupsList = resp;
            MyFollowUpsCount = resp.length;
            MyFollowupsDrpDwn = $('#filterfollteam :selected').val();
            if (MyFollowupsDrpDwn != 4) {
                resp = $.grep(resp, function (element, index) {
                    return element.Task_Status == MyFollowupsDrpDwn;
                });
                if (resp.length == 0) {

                    resp = $.grep(resp, function (element, index) {
                        return element.Task_Status == 2;
                    });
                    $('#filterfollteam').val(2);
                }
            }
            fnBindFollowups(resp);
        },
        complete: function (e) {
            Followupteamtasks();
        }
    });
}

function fnFilterMyFollowUps(value) {
    debugger;
    var resp = '';
    if (value != 4) {
        resp = $.grep(MyFollowupsList, function (element, index) {
            return element.Task_Status == value;
        });
    } else {
        resp = MyFollowupsList;
    }

    fnBindFollowups(resp);
}

function fnBindFollowups(resp) {
    debugger;
    var content = '';
    var sno = 0;
    var statcount = 0;
   
    //$('#filterfollteam').val(stat);
    //if (stat != undefined && stat != "" && stat != 4) {
    //    resp = jsonPath(resp, "$.[?(@.Task_Status=='" + stat + "')]");
    //}

    if (resp != '' && resp != null && resp.length >= 1) {
        content += '<table class="main table table-hover " id=tblfollowup style="text-align:center;overflow-x:hidden;overflow-y:auto;">';
        content += '<thead>';
        content += '<tr style="text-align:center;">';
        content += '<th style="width:10px;">S.No</th>';
        content += '<th  type=hidden style="display:none;">Task Id</th>';
        content += '<th>Task Name</th>';
        content += '<th>Task Description</th>';
        content += '<th>Due Date</th>';
        content += '<th id=completedon>Completed On</th>';
        // content += '<th style="width: 150px;">Days Left/OverDue By</th>';
        content += '<th>Task Status</th>';
        content += '<th>Action</th>';
        content += '</tr></thead>';
        content += '<tbody>';
        for (var i = 0; i < resp.length; i++) {
           
               // if (Status == 4 || Status == resp[i].Task_Status) {
                    sno = sno + 1;
                    //if (resp[i].Task_Status == 1) {
                        //$('#completedon').hide();
                       // $('#closed').hide();
                   // }
                    content += '<tr>'
                    content += '<td>' + sno + '</td>'
                    content += '<td type=hidden style="display:none;">' + resp[i].Task_Id + '</td>';
                    content += '<td>' + resp[i].Task_Name + '</td>';
                    if (resp[i].Task_Description == '' || resp[i].Task_Description == null) {
                        content += '<td> </td>';
                    } else {
                        content += '<td>' + resp[i].Task_Description + '</td>';
                    }

                    content += '<td>' + resp[i].Task_Due_Date + '</td>';
                    if (resp[i].Task_Closed_Date == null || resp[i].Task_Closed_Date == '') {
                        content += '<td>Yet to be completed</td>';
                    } else {
                        content += '<td id= closed>' + resp[i].Task_Closed_Date + '</td>';
                    }

                    if (resp[i].Updated_DateTime != null && resp[i].Updated_DateTime!="" && resp[i].Updated_DateTime!=undefined) {
                        var today = new Date();
                        var dd = today.getDate();
                        var mm = today.getMonth() + 1;
                        var yyyy = today.getFullYear();
                        var currentdate = dd + '/' + mm + '/' + yyyy;
                        var updatedDate = resp[i].Updated_DateTime;
                        var taskDueDate = resp[i].Task_Due_Date;
                        var updatedDate_dd = resp[i].Updated_DateTime.split('/')[0];
                        var updatedDate_mm = resp[i].Updated_DateTime.split('/')[1];
                        var updatedDate_yy = resp[i].Updated_DateTime.split('/')[2];
                        var taskDueDate_dd = resp[i].Task_Due_Date.split('/')[0];
                        var taskDueDate_mm = resp[i].Task_Due_Date.split('/')[1];
                        var taskDueDate_yy = resp[i].Task_Due_Date.split('/')[2];
                    }

                    //if (updatedDate == taskDueDate || taskDueDate_dd == updatedDate_dd && taskDueDate_mm == updatedDate_mm && taskDueDate_yy == updatedDate_yy) {
                    //    content += '<td style="color:blue">Followup completed on due date.</td>';
                    //}
                    //else if (resp[i].After_Due != '' || resp[i].After_Due != 0) {
                    //    //var daysleft = duedate - current_Date;
                    //    content += '<td style="color:red;">Followup completed after due date.</td>';
                    //}
                    //else if (resp[i].With_In != '' || resp[i].With_In != 0) {
                    //    //var overdue = current_Date - duedate;
                    //    content += '<td style="color:green;">Followup completed within due date.</td>';
                    //}
                    if (resp[i].Task_Status == 3) {
                        content += '<td style="color:green">Completed</td>';
                    }
                    else if (resp[i].Task_Status == 0) {
                        content += '<td style="color:red">Reviewed</td>';
                    }
                    else if (resp[i].Task_Status == 1) {
                        content += '<td style="color:brown">Open</td>';
                    }
                    else if (resp[i].Task_Status == 2) {
                        content += '<td style="color:brown">In Progress</td>';
                    }
                    else if (resp[i].Task_Status == 5) {
                        content += '<td style="color:brown">Re-Open</td>';
                    }
                    content += '<td style="cursor: pointer;text-decoration: underline;color: blue; text-align:center" Onclick="fnViewFollowup(\'' + resp[i].Task_Id + '\');">View</td>';
                    content += '</tr>';
               // }
            }
           
       
    }
    else {
        content += '<div class="container" style="width:100%;padding:20px;"><div style="padding: 15px;background: rgb(241, 241, 241); text-align:center;"><b>No Tasks Assigned</b></div></div>';
    }
    $('#FollowDataByMe').html(content);
}
function fnViewFollowup(TaskId) {
    debugger;
    $.ajax({
        type: "GET",
        url: "../HiDoctor_Master/FeedBack/GetTaskById",
        data: "Task_Id=" + TaskId,
        success: function (resp) {
            console.log(resp);
            fnBindFollowupByIdHTML(resp);
        }
    });
}
var TeamFollowUps = '';
function fnBindFollowupByIdHTML(resp) {
    debugger;
    task_Status = '';
    TeamFollowUps = resp;

    $("#Statusfiltertsks option[value='1']").show();
    $("#Statusfiltertsks option[value='5']").show();
    $("#Statusfiltertsks option[value='2']").show();
    $("#Statusfiltertsks option[value='0']").show();
    if (resp != '' && resp != null) {
        $('#TaskId').html(resp[0].Task_Id);
        $('#tskName').html(resp[0].Task_Name);
        $('#tskDescrtn').html(resp[0].Task_Description);
        var Assigned_To = resp[0].User_Name + "(" + resp[0].Task_User_Employee_Name + ")";
        $('#AssgnTo').html(Assigned_To);
        var Assigned_By = resp[0].Created_By + "(" + resp[0].Created_By_Employee_Name + ")";
        $('#AssgnBy').html(Assigned_By);
        $('#DueDate').html(resp[0].Task_Due_Date);
        $('#AssgnOn').html(resp[0].Created_DateTime);
        $('#rmrks').html(resp[0].Assignee_Remarks);
        if (resp[0].Task_Closed_Date != null || resp[0].Task_Closed_Date != "1/1/1900") {
            $('#ClosedOn').html(resp[0].Task_Closed_Date);
        }
        else {
            $('#ClosedOn').html('');
        }
        if (resp[0].Task_Status == 1) {
            $("#Statusfiltertsks option[value='5']").hide();
            $("#Statusfiltertsks option[value='1']").hide();
            $("#Statusfiltertsks option[value='2']").show();
            $('#Statusdrpdwn').show();
            $('#Statusfiltertsks').val(resp[0].Task_Status);
            $('#tskclsdon').hide();
            $('#remrks').hide();
            $('#reviewedstat').hide();
            $('#remarks').hide();
            $('#updtbtn').hide();
            task_Status = resp[0].Task_Status;

        }
        else if (resp[0].Task_Status == 2) {
            $("#Statusfiltertsks option[value='1']").hide();
            $("#Statusfiltertsks option[value='5']").hide();
            $("#Statusfiltertsks option[value='2']").hide();
            $('#Statusdrpdwn').show();
            $('#Statusfiltertsks').val(resp[0].Task_Status);
            $('#tskclsdon').hide();
            $('#remrks').hide();
            $('#reviewedstat').hide();
            $('#remarks').hide();
            $('#updtbtn').hide();
            task_Status = resp[0].Task_Status;
        }
        else if (resp[0].Task_Status == 5) {
            $("#Statusfiltertsks option[value='1']").hide();
            $("#Statusfiltertsks option[value='5']").hide();
            $('#reviewedstat').hide();
            $('#Statusfiltertsks').val(resp[0].Task_Status);
            //$('#reviewedstat').show();
            $('#reviewedstat').hide();
            $('#remarks').hide();
            $('#updtbtn').hide();
            task_Status = resp[0].Task_Status;
        }
        else if (resp[0].Task_Status == 0) {
            var status = "Reviewed";
            $('#Status').html(status);
            $('#Statusdrpdwn').hide();
            $('#reviewedstat').show();
            $('#updtbtn').hide();
        }
        else if (resp[0].Task_Status == 3) {
            $('#Statusdrpdwn').hide();
            // $('#Statusdrpdwn').show();
            // $('#Statusfiltertsks').val(resp[0].Task_Status);
            $('#reviewedstat').hide();
            $('#remarks').hide();
            $('#updtbtn').hide();
            task_Status = resp[0].Task_Status;

        }

        var Updatebutton = '<button type="button" class="btn btn-default" id="btnupdt" onclick="fnUpdateFollowupStatus(\'' + resp[0].Task_Id + '\')">Update</button>';
        $('#updtbtn').html(Updatebutton);

    }
    $('#ModalTaskView').modal('show');
}
function fnUpdateFollowupStatus(TaskId) {
    debugger;
    if (TaskId != undefined) {
        var TaskStatus = $('#Statusfiltertsks').val();

        var Remarks = $.trim($('#rmrkstxt').val());
        if (Remarks.length > 500) {
            fnMsgAlert('info', 'Tasks View', 'Remarks should not be more than 500 Characters.');
            return false;
        }
        else if (Remarks != '') {
            // result=regExforAlphaNumericSpecificRemarks(Remarks);
            var result = regExforAlphaNumericSpecificRemarks(Remarks);
            if (result == false) {
                fnMsgAlert('info', 'Tasks View', "Only (a-z A-Z 0-9 (){}@[]\/.,'-_?!) special characters are allowed in the remarks.");
                return false;
            }
        }
        $('#ModalTaskView').modal('hide');
        //else if (Remarks == '' || Remarks != '') {
        $.blockUI();
        $.ajax({
            type: "POST",
            url: "../HiDoctor_Master/FeedBack/UpdateTaskStatus",
            data: "Task_Id=" + TaskId + "&Task_Status=" + TaskStatus + "&Remarks=" + Remarks,
            success: function (resp) {
                debugger;
                console.log(resp);
                $.unblockUI();
               
                $('#rmrkstxt').val('');

                $("#Statusfiltertsks option[value='1']").show();
                $("#Statusfiltertsks option[value='5']").show();
                $("#Statusfiltertsks option[value='2']").show();
                $("#Statusfiltertsks option[value='0']").show();

            }
        });
        fnMsgAlert('info', 'Tasks View', "Status has been updated.");
        Followuptasks();
        // fnGetMyTasksByStatus(3);
        // window.location.reload();

    }
}
var TeamFollowUpsDrpDwn = '';
function Followupteamtasks() {
   // Status = parseInt(status)
    debugger;
    //var Statusfltr = '';
    //if (status != undefined && status != null) {
    //    Statusfltr = status;
    //}
    $.ajax({
        type: "Get",
        url: "../HIDoctor_Master/FeedBack/GetAllTeamFollowUps",
        data: "",
        //: false,
        success: function (resp) {
            //task_list = resp;
            //console.log(resp);
            TeamFollowupsList = resp;
            TeamFollowUpsCount = resp.length;
            TeamFollowUpsDrpDwn = $('#filterfollowsteam :selected').val();
            resp = $.grep(resp, function (element, index) {
                return element.Task_Status == TeamFollowUpsDrpDwn;
            });
            if (resp.length == 0) {

                resp = $.grep(resp, function (element, index) {
                    return element.Task_Status == 2;
                });
                $('#filterfollowsteam').val(2);
            }
            if (resp.length == 0) {
                resp = $.grep(resp, function (element, index) {
                    return element.Task_Status == 3;
                });
                $('#filterfollowsteam').val(3);
            }
            
            fnBindteamFollowups(resp);
        },
        complete: function (e) {
            fnTaskActivePane();
        }
    });
}
function fnFilterTeamFollowUps(value) {
    debugger;
    if (value != 4) {

        resp = $.grep(TeamFollowupsList, function (element, index) {
            return element.Task_Status == value;
        });
    } else {
        resp = TeamFollowupsList;
    }

    fnBindteamFollowups(resp);
    
}
function fnBindteamFollowups(resp) {
    debugger;
    var content = '';
    var sno = 0;
    var statcount = 0;
    TeamFollowUpsCount = resp.length;
    //$('#filterfollowsteam').val(stat);
    //if (stat != undefined && stat != "" && stat != 4) {
    //    resp = jsonPath(resp, "$.[?(@.Task_Status=='" + stat + "')]");
    //}

    if (resp != '' && resp != null && resp.length >= 1) {
        content += '<table class="main table table-hover " id=tblfollowup style="text-align:center;overflow-x:hidden;overflow-y:auto;">';
        content += '<thead>';
        content += '<tr style="text-align:center;">';
        content += '<th style="width:10px;">S.No</th>';
        content += '<th  type=hidden style="display:none;">Task Id</th>';
        content += '<th>Task Name</th>';
        content += '<th>Task Description</th>';
        content += '<th>Created By</th>';
        content += '<th>Due Date</th>';
        content += '<th id=completedon>Completed On</th>';
        // content += '<th style="width: 150px;">Days Left/OverDue By</th>';
        content += '<th>Task Status</th>';
        
        //content += '<th>Action</th>';
        content += '</tr></thead>';
        content += '<tbody>';
        for (var i = 0; i < resp.length; i++) {

            //if (Status == 4 || Status == resp[i].Task_Status) {
                sno = sno + 1;
                //if (resp[i].Task_Status == 1) {
                //    //$('#completedon').hide();
                //    $('#closed').hide();
                //}
                content += '<tr>'
                content += '<td>' + sno + '</td>'
                content += '<td type=hidden style="display:none;">' + resp[i].Task_Id + '</td>';
                content += '<td>' + resp[i].Task_Name + '</td>';
                if (resp[i].Task_Description == '' || resp[i].Task_Description == null) {
                    content += '<td> </td>';
                } else {
                    content += '<td>' + resp[i].Task_Description + '</td>';
                }
                content +='<td>'+resp[i].Created_By+'</td>'
                content += '<td>' + resp[i].Task_Due_Date + '</td>';
                if (resp[i].Task_Closed_Date == null || resp[i].Task_Closed_Date == '') {
                    content += '<td>Yet to be completed</td>';
                } else {
                    content += '<td id= closed>' + resp[i].Task_Closed_Date + '</td>';
                }

                if (resp[i].Updated_DateTime != null && resp[i].Updated_DateTime != "" && resp[i].Updated_DateTime != undefined) {
                    var today = new Date();
                    var dd = today.getDate();
                    var mm = today.getMonth() + 1;
                    var yyyy = today.getFullYear();
                    var currentdate = dd + '/' + mm + '/' + yyyy;
                    var updatedDate = resp[i].Updated_DateTime;
                    var taskDueDate = resp[i].Task_Due_Date;
                    var updatedDate_dd = resp[i].Updated_DateTime.split('/')[0];
                    var updatedDate_mm = resp[i].Updated_DateTime.split('/')[1];
                    var updatedDate_yy = resp[i].Updated_DateTime.split('/')[2];
                    var taskDueDate_dd = resp[i].Task_Due_Date.split('/')[0];
                    var taskDueDate_mm = resp[i].Task_Due_Date.split('/')[1];
                    var taskDueDate_yy = resp[i].Task_Due_Date.split('/')[2];
                }

                //if (updatedDate == taskDueDate || taskDueDate_dd == updatedDate_dd && taskDueDate_mm == updatedDate_mm && taskDueDate_yy == updatedDate_yy) {
                //    content += '<td style="color:blue">Followup completed on due date.</td>';
                //}
                //else if (resp[i].After_Due != '' || resp[i].After_Due != 0) {
                //    //var daysleft = duedate - current_Date;
                //    content += '<td style="color:red;">Followup completed after due date.</td>';
                //}
                //else if (resp[i].With_In != '' || resp[i].With_In != 0) {
                //    //var overdue = current_Date - duedate;
                //    content += '<td style="color:green;">Followup completed within due date.</td>';
                //}
                if (resp[i].Task_Status == 3) {
                    content += '<td style="color:green">Completed</td>';
                }
                else if (resp[i].Task_Status == 0) {
                    content += '<td style="color:red">Reviewed</td>';
                }
                else if (resp[i].Task_Status == 1) {
                    content += '<td style="color:brown">Open</td>';
                }
                else if (resp[i].Task_Status == 2) {
                    content += '<td style="color:brown">In Progress</td>';
                }
                else if (resp[i].Task_Status == 5) {
                    content += '<td style="color:brown">Re-Open</td>';
                }
               // content += '<td style="cursor: pointer;text-decoration: underline;color: blue; text-align:center" Onclick="fnViewFollowup(\'' + resp[i].Task_Id + '\');">View</td>';
                content += '</tr>';
            //}
        }


    }
    else {
        content += '<div class="container" style="width:100%;padding:20px;"><div style="padding: 15px;background: rgb(241, 241, 241); text-align:center;"><b>No Tasks Assigned</b></div></div>';
    }
    $('#FollowDatateam').html(content);
  
}
