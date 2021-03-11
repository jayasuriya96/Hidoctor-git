//Global Variables
var projCode = "";
var activCode = "";

function fnGetProjectActivityDetails() {
    $.ajax({
        url: '../HiDoctor_Master/ProjectActivity/GetProjectActivityDetails/',
        type: "POST",
        data: "A",
        success: function (jsData) {
            if (jsData != '') {
                jsData = eval('(' + jsData + ')');

                //Bining the project Name
                var project = $("#drpProjectName");
                project.append("<option value='0'>-Select Project Name-</option>");
                for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                    project.append("<option value=" + jsData.Tables[0].Rows[i].Project_Code + ">" + jsData.Tables[0].Rows[i].Project_Name + "</option>");
                }

                //Binding the activtiy name
                var activity = $("#drpActivityName");
                activity.append("<option value='0'>-Select Activity Name-</option>");
                for (var i = 0; i < jsData.Tables[1].Rows.length; i++) {
                    activity.append("<option value=" + jsData.Tables[1].Rows[i].Activity_Code + ">" + jsData.Tables[1].Rows[i].Activity_Name + "</option>");
                }
            }
        },
        error: function () {
        },
        complete: function () {
        }
    });
}
function fnGetProjectActivityMappingDetails() {
    $.ajax({
        url: '../HiDoctor_Master/ProjectActivity/GetProjectActivityMappingDetails/',
        type: "POST",
        data: "A",
        success: function (jsData) {
            if (jsData != '') {
                $("#dvProjActMappDet").html(jsData.split("$")[0]);
            }
        },
        error: function () {
        },
        complete: function () {
        }
    });
}

function fnPutProjectActivityIntoAzure() {
    $.ajax({
        url: '../HiDoctor_Master/ProjectActivity/PutProjectActivityIntoAzure/',
        type: "POST",
        data: "A",
        success: function (jsData) {
        },
        error: function () {
        },
        complete: function () {
        }
    });
}
function checkDate(str) {
    debugger;
    var matches = str.match(/(\d{1,2})[- \/](\d{1,2})[- \/](\d{4})/);
    if (!matches) return false;

    // parse each piece and see if it makes a valid date object
    var month = parseInt(matches[1], 10);
    var day = parseInt(matches[2], 10);
    var year = parseInt(matches[3], 10);
    var date = new Date(year, month - 1, day);
    if (!date || !date.getTime()) return;

    // make sure we have no funny rollovers that the date object sometimes accepts
    // month > 12, day > what's allowed for the month
    if (date.getMonth() + 1 != month ||
        date.getFullYear() != year ||
        date.getDate() != day) {
        return false;
    }
    return (date);
}
function fnInsertProjectActivityMapping() {
    if ($("#drpProjectName").val() == 0) {
        fnMsgAlert('info', 'Project Activity Mapping', 'Please select the project name to map');
        return false;
    }
    if ($("#drpActivityName").val() == 0) {
        fnMsgAlert('info', 'Project Activity Mapping', 'Please select the activity name to map');
        return false;
    }
    if ($("#txtStartDate").val() == "" || $("#txtStartDate").val() == "/") {
        fnMsgAlert('info', 'Project Activity Mapping', 'Please select the start date');
        return false;
    }
    if ($("#txtEndDate").val() == "" || $("#txtEndDate").val() == "/") {
        fnMsgAlert('info', 'Project Activity Mapping', 'Please select the end date');
        return false;
    }

    var startDateArray = $('#txtStartDate').val().split('/');
    if (startDateArray.length < 2) {
        fnMsgAlert('info', 'Project Activity Mapping', 'Please Enter the  Valid Start date Format');
        return false;
    }
    if (!checkDate(startDateArray[1] + "/" + startDateArray[0] + "/" + startDateArray[2])) {
        fnMsgAlert('info', 'Project Activity Mapping', 'Please Enter the  Valid Start date Format');
        return false;
    }

    var endDateArray = $('#txtEndDate').val().split('/');
    if (endDateArray.length < 2) {
        fnMsgAlert('info', 'Project Activity Mapping', 'Please Enter the  Valid End date Format');
        return false;
    }
    if (!checkDate(endDateArray[1] + "/" + endDateArray[0] + "/" + endDateArray[2])) {
        fnMsgAlert('info', 'Project Activity Mapping', 'Please Enter the  Valid End date Format');
        return false;
    }
    //if (($('#txtStartDate').val().split('/')[0].toString().length > 2) || ($('#txtStartDate').val().split('/')[1].toString().length > 2) || ($('#txtStartDate').val().split('/')[2].toString().length > 4)) {
    //    fnMsgAlert('info', 'Project Activity Mapping', 'Please Enter the  Valid date Format');
    //   return false;
    //}
    // if (($('#txtEndDate').val().split('/')[0].toString().length > 2) || ($('#txtStartDate').val().split('/')[1].toString().length > 2) || ($('#txtStartDate').val().split('/')[2].toString().length > 4)) {
    //     fnMsgAlert('info', 'Project Activity Mapping', 'Please Enter the  Valid date Format');
    //    return false;
    //}
    var startDate = $('#txtStartDate').val().split('/')[2].toString() + "-" + $('#txtStartDate').val().split('/')[1].toString() + "-" + $('#txtStartDate').val().split('/')[0].toString();
    var endDate = $('#txtEndDate').val().split('/')[2].toString() + "-" + $('#txtEndDate').val().split('/')[1].toString() + "-" + $('#txtEndDate').val().split('/')[0].toString();
    var mode = $('#hdnMode').val();

    if (new Date(startDate) > new Date(endDate)) {
        fnMsgAlert('info', 'Project Activity Mapping', 'Start date can not be greater than end date , please select valid start date & end date');
        return false;
    }

    if (mode == "I") {
        $.ajax({
            url: '../HiDoctor_Master/ProjectActivity/InsertProjectActivityMapping/',
            type: "POST",
            data: "projectcode=" + $("#drpProjectName").val() + "&activityCode=" + $("#drpActivityName").val() + "&startDate=" + startDate + "&endDate=" + endDate + "",
            success: function (jsData) {
                if (jsData != '') {
                    if (jsData.split(":")[0].toString() == "SUCCESS") {
                        fnMsgAlert('success', 'Project Activity Mapping', jsData.split(":")[1].toString());
                    }
                    else if (jsData.split(":")[0].toString() == "INFO") {
                        fnMsgAlert('info', 'Project Activity Mapping', jsData.split(":")[1].toString());
                    }
                    if (jsData.split(":")[0].toString() == "ERROR") {
                        fnMsgAlert('error', 'Project Activity Mapping', jsData.split(":")[1].toString());
                    }
                    fnGetProjectActivityMappingDetails();
                }
            },
            error: function () {
            },
            complete: function () {
            }
        });
    }
    else {
        $.ajax({
            url: '../HiDoctor_Master/ProjectActivity/UpdateSalesActivityMapping/',
            type: "POST",
            data: "nprojectcode=" + $("#drpProjectName").val() + "&nactivityCode=" + $("#drpActivityName").val() + "&oprojectcode=" + projCode + "&oactivityCode=" + activCode + "&startDate=" + startDate + "&endDate=" + endDate + "&mode=" + mode + "&status=0",
            success: function (jsData) {
                if (jsData != '') {
                    if (jsData.split(":")[0].toString() == "SUCCESS") {
                        fnMsgAlert('success', 'Project Activity Mapping', jsData.split(":")[1].toString());
                    }
                    else if (jsData.split(":")[0].toString() == "INFO") {
                        fnMsgAlert('info', 'Project Activity Mapping', jsData.split(":")[1].toString());
                    }
                    if (jsData.split(":")[0].toString() == "ERROR") {
                        fnMsgAlert('error', 'Project Activity Mapping', jsData.split(":")[1].toString());
                    }
                }
                fnGetProjectActivityMappingDetails();
            },
            error: function () {
            },
            complete: function () {
            }
        });
    }

    //function to clear all the form elements.
    fnClearAll();

}

function fnEditProjAct(rowIndex) {
    var projectCode = $("#hdnProjCode_" + rowIndex).val();
    var activityCode = $("#hdnActivityCode_" + rowIndex).val();
    var startDate = $("#tdStartDate_" + rowIndex).html();
    var endDate = $("#tdEndDate_" + rowIndex).html();

    projCode = projectCode;
    activCode = activityCode;

    $("#drpProjectName").val(projectCode)
    $("#drpActivityName").val(activityCode)
    $('#txtStartDate').val(startDate)
    $('#txtEndDate').val(endDate);
    $('#hdnMode').val("E");
    $("#btnSave").html("Update")
}

function fnchangeStatus(rowIndex) {
    var projectCode = $("#hdnProjCode_" + rowIndex).val();
    var activityCode = $("#hdnActivityCode_" + rowIndex).val();
    var changeStatus;

    var status = $("#tdStatus_" + rowIndex).html();

    if ($.trim(status.toUpperCase()) == "ENABLED") {
        changeStatus = "0";
    }
    else if ($.trim(status.toUpperCase()) == "DISABLED") {
        changeStatus = "1";
    }

    $.ajax({
        url: '../HiDoctor_Master/ProjectActivity/UpdateSalesActivityMapping/',
        type: "POST",
        data: "nprojectcode=" + projectCode + "&nactivityCode=" + activityCode + "&oprojectcode=&oactivityCode=&startDate=&endDate=&mode=C&status=" + changeStatus + "",
        success: function (jsData) {
            if (jsData != '') {
                if (jsData.split(":")[0].toString() == "SUCCESS") {
                    fnMsgAlert('success', 'Project Activity Mapping', jsData.split(":")[1].toString());
                }
                else if (jsData.split(":")[0].toString() == "INFO") {
                    fnMsgAlert('info', 'Project Activity Mapping', jsData.split(":")[1].toString());
                }
                if (jsData.split(":")[0].toString() == "ERROR") {
                    fnMsgAlert('error', 'Project Activity Mapping', jsData.split(":")[1].toString());
                }
            }
            fnClearAll();
            fnGetProjectActivityMappingDetails();
        },
        error: function () {
        },
        complete: function () {
        }
    });
}

function fnClearAll() {
    $("#drpProjectName").val(0);
    $("#drpActivityName").val(0);
    $("#txtStartDate").val("");
    $("#txtEndDate").val("");
    $('#hdnMode').val("I");
    $("#btnSave").html("Save")
}
