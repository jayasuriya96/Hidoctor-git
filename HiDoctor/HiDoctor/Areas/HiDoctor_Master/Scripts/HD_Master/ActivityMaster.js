//Created By Sumathi.M
//Date : 5/12/2013

function fnGetActivityMaster() {
    $.ajax({
        url: '../HiDoctor_Master/ActivityMaster/GetActivityMaster',
        type: "GET",
        success: function (result) {
            if (result != '') {
                $("#divActivityMaster").html(result);
            }
        }
    });
}


$("#btnsave").click(function () {
    var result = fnsubvalidate();
    if (result) {
        var ActivityName = $.trim($("#txtActivityName").val());

        var day = $("#txtstartdate").val().split('/')[0];
        var month = $('#txtstartdate').val().split('/')[1];
        var year = $('#txtstartdate').val().split('/')[2];
        var StartDate = year + '-' + month + '-' + day;

        var day = $("#txtEnddate").val().split('/')[0];
        var month = $('#txtEnddate').val().split('/')[1];
        var year = $('#txtEnddate').val().split('/')[2];
        var EndDate = year + '-' + month + '-' + day;

        $.ajax({
            url: '../HiDoctor_Master/ActivityMaster/InsertActivityMaster',
            type: "POST",
            data: { 'activityName': ActivityName, 'startDate': StartDate, 'endDate': EndDate, 'Mode': $("#hdnMode").val(), 'updateActivityCode': $("#hdnActivitycode").val() },
            success: function (data) {
                if (data == "1") {
                    fnMsgAlert('success', 'Success', 'Saved successfully');
                    $("#txtActivityName").val('');
                    $("#txtstartdate").val('');
                    $("#txtEnddate").val('');
                    $("#hdnActivitycode").val('');

                    $("#btnsave").val('Save'); //Button Value Change From Update To Save
                    $("#hdnMode").val("I");
                    fnGetActivityMaster();
                }
                else if (data == "2") {
                    fnMsgAlert('info', 'Error', 'Inserted Failure');
                }
                else if (data == "0") {
                    fnMsgAlert('info', 'Caution', 'ActivityName Already Exists');
                }
            }
        });
    }
});

function fnsubvalidate() {
    if ($.trim($("#txtActivityName").val()) == "") {
        fnMsgAlert('info', 'Info', 'Enter The ActivityName');
        return false;
    }

    if ($.trim($("#txtActivityName").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Enter The ActivityName');
        return false;
    }

    if ($.trim($("#txtstartdate").val()) == "0") {
        fnMsgAlert('info', 'Info', 'Select the StartDate');
        return false;
    }

    if ($.trim($("#txtEnddate").val()) == "0") {
        fnMsgAlert('info', 'Info', 'Select The EndDate');
        return false;
    }
    if (!(isNaN($("#txtActivityName").val()))) {
        fnMsgAlert('info', 'Info', 'Enter The valid ActivityName');
        return false;
    }

    if (!regExforAlphaNumeric($("#txtActivityName").val())) {
        fnMsgAlert('info', 'Info', 'Special characters are not allowed in the ActivityName');
        return false;
    }

    if ($.trim($("#txtActivityName").val()).length > 200) {
        fnMsgAlert('info', 'Info', 'Activity Name should not exceed 200 Characters');
        return false;
    }
    
    var validformat = /^\d{2}\/\d{2}\/\d{4}$/
    if (!validformat.test($('#txtstartdate').val())) {
        fnMsgAlert('info', 'Info', 'Enter The Valid Start Date');
        return false;
    }

    if (!validformat.test($('#txtEnddate').val())) {
        fnMsgAlert('info', 'Info', 'Enter The Valid End Date');
        return false;
    }

    var FromDateArr = $("#txtstartdate").val().split('/');
    var ToDateArr = $("#txtEnddate").val().split('/');
    var dt1 = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
    var dt2 = new Date(ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Info', 'Start Date Can not be Greater than the End Date');
        return false;
    }
    return true;
}

$("#btncancel").click(function () {
    $("#txtActivityName").val('');
    $("#txtstartdate").val('');
    $("#txtEnddate").val('');

    if ($("#btnsave").val() == 'Update') {
        $("#btnsave").val('Save');
    }
    else {
        $("#btnsave").val('Save');
    }
});

function fnEdit(obj) {
    if (obj.id != null) {
        var tblActivityCode = obj.id.replace('E', 'Activity_Code');
        var tblActivityName = obj.id.replace('E', 'Activity_Name');
        var tblStartDate = obj.id.replace('E', 'Start_Date');
        var tblEndDate = obj.id.replace('E', 'End_Date');

        var Categorycode = $("#" + tblActivityCode).text();
        var categoryname = $("#" + tblActivityName).text();
        var visitcount = $("#" + tblStartDate).text();
        var doctorcount = $("#" + tblEndDate).text();

        $("#hdnActivitycode").val(Categorycode);
        $("#txtActivityName").val(categoryname);
        $("#txtstartdate").val(visitcount);
        $("#txtEnddate").val(doctorcount);

        $("#btnsave").val('Update'); //Button Value Change From Save To Update
        $("#hdnMode").val("E");
    }
}

function fnchangeStatus(obj) {
    if (obj.id != null) {
        var tblchange = obj.id.replace('C', 'Row_Status');
        var tblActivityCode = obj.id.replace('C', 'Activity_Code');
        var status = $("#" + tblchange).text();
        var ActivityCode = $("#" + tblActivityCode).text();
        $.ajax({
            url: '../HiDoctor_Master/ActivityMaster/ChangestatusforActivityMaster',
            type: "POST",
            data: { 'status': status, 'activityCode': ActivityCode },
            success: function (data) {
                if (data) {
                    fnMsgAlert('success', 'Success', 'Status changed successfully');
                }
                else {
                    fnMsgAlert('info', 'Error', 'Sorry An Error occured,please Try Again Later');
                }
                fnGetActivityMaster();
            }
        });
    }
}