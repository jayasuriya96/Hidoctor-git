
function fnClearDoctorVisitHourlyReport() {
    $("#txtFromDate").val('');
    $("#txtToDate").val('');
    $('#dvTablePrint').hide();
}

var options = "";

//GET OPTIONS
if ($('#optViewInScreen').attr('checked') == "checked") {
    options = "S";
}
else {
    options = "E";
}


function fnValidateDoctorVisitHourlyReport(screenName) {
    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', screenName, 'Please enter Start date.');
        $("#txtFromDate").focus();
        HideModalPopup("dvloading");
        return false;
    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', screenName, 'Please enter End date.');
        $("#txtToDate").focus();
        HideModalPopup("dvloading");
        return false;
    }

    var DcrfromDate = $("#txtFromDate").val().split('/')[2] + '/' + $("#txtFromDate").val().split('/')[1] + '/' + $("#txtFromDate").val().split('/')[0];
    var DcrEndDate = $("#txtToDate").val().split('/')[2] + '/' + $("#txtToDate").val().split('/')[1] + '/' + $("#txtToDate").val().split('/')[0];
    var startDate = new Date(DcrfromDate);
    var endDate = new Date(DcrEndDate);

    if (endDate != "") {
        if (startDate > endDate) {
            fnMsgAlert('info', screenName, 'End date can not be less than start date.');
            HideModalPopup("dvloading");
            $("#txtToDate").val("");
            return false;
        }
    }

    var noOfDays = endDate - startDate;
    noOfDays = Math.round(noOfDays / 1000 / 60 / 60 / 24);

    if (noOfDays > 92) {

        fnMsgAlert('info', screenName, 'Start date and end date should not be greater than 92 days.');
        HideModalPopup("dvloading");
        return false;
    }
    return true;

}

function fninializePrint(divId, iFrameId, mainDiv) {
    $('#' + mainDiv + ' #dvPrint').remove();
    $("#" + mainDiv + " .TableTools").append("<div id='dvPrint' onclick='fnPrint(\"" + divId + "\",\"" + iFrameId + "\");' title='Print Table' class='TableTools_button' style='background: url(../Content/DataTable/media/images/print.png) no-repeat center center;border: 1px solid #f0f0f0;height: 30px; width: 30px;cursor:pointer;'></div>");
}

function fnDoctorVisitHourlyreport() {

    $("#dvUserPerDayCont").empty();
    $('#dvTablePrint').hide();
    ShowModalPopup("dvloading");
    var userCode = $('#hdnUserCode').val();
    if (fnValidateDoctorVisitHourlyReport("Hourly Report")) {
        var options = "";

        startDate = $("#txtFromDate").val();
        endDate = $("#txtToDate").val();
        if (startDate != "" & endDate != "") {
            startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
            endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];
        }

        if ($('#optViewInScreen').attr('checked') == "checked") {
            options = "S";
        }
        else {
            options = "E";
        }

        //if (options == 'E') {
        //    $('#dvPrint').hide();
        //}
        $.ajax({
            url: '../HiDoctor_Reports/ReportsLevelThree/GetDoctorProfileReport',
            type: "POST",
            data: "userCode=" + userCode + '&DcrFromDate=' + startDate + '&DcrEndDate=' + endDate + '&options=' + options,
            success: function (response) {
                if (response.split('^')[0] != 'FAIL') {
                    $("#dvUserPerDayCont").html(response);

                    $("#divuserperPrint").html(response);
                    var userName = $('#hdnUserName').val();
                    $('#UserName').html(userName);
                    // $("#divuserperday").show();
                    $("#dvUserPerDayCont").show();
                    $("#dvPrint").show();
                    HideModalPopup("dvloading");
                    $('#tblDoctorHour').dataTable({
                        "sPaginationType": "full_numbers",
                        //"sDom": 'T<"clear">lfrtip'
                        //"bDestroy": true, "sDom": 'T<"clear">lfrtip' //, "sGroupBy": "Doctor Name"
                    }).dataTable().columnFilter({
                        PlaceHolder: "head:after",
                    });

                    fninializePrint("divuserperPrint", "ifrmuserperday", "dvUserPerDayCont");
                    //HideModalPopup("dvloading");
                    HideModalPopup('dvloading');
                    return;
                }
                if (response != '') {

                }
                else {
                }
            },
        });
    }

}
//function getDoctorAddressPopup() {

//    $.ajax({
//        url: '../HiDoctor_Reports/ReportsLevelThree/GetDoctorProfileReport',
//        type: "POST",
//        data: "userCode=" + userCode + '&DcrFromDate=' + startDate + '&DcrEndDate=' + endDate + '&options=' + options,
//        success: function (response) {
          
//        }
//    });
//}