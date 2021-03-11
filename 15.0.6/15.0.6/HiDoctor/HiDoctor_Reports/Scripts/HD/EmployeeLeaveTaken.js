//Created By:SRISUDHAN//
//Created Date:31-01-2014//

function fnEmployeeLeaveTakenreport() {
    ShowModalPopup("dvloading");
    $("#dvTable").html("");
    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'DCR Quality Report', 'Select Start Date.');
        HideModalPopup("dvloading");
        return false;
    }

    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'DCR Quality Report', 'Select End Date.');
        HideModalPopup("dvloading");
        return false;
    }

    if ($.trim($("#txtFromDate").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Please Select StartDate.');
        HideModalPopup("dvloading");
        return false;
    }

    if ($.trim($("#txtToDate").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Please Select EndDate.');
        HideModalPopup("dvloading");
        return false;
    }

    if (!(fnValidateDateFormate($("#txtFromDate"), "StartDate"))) {
        HideModalPopup("dvloading");
        return false;
    }
    if (!(fnValidateDateFormate($("#txtToDate"), "EndDate"))) {
        HideModalPopup("dvloading");
        return false;
    }

    var FromDateArr = $("#txtFromDate").val().split('/');
    var ToDateArr = $("#txtToDate").val().split('/');
    var dt1 = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
    var dt2 = new Date(ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Info', 'Start Date Can not be Greater than the End Date');
        HideModalPopup("dvloading");
        return false;
    }

    var userCode = $('#hdnUserCode').val();

    var startDate = $("#txtFromDate").val();
    var endDate = $("#txtToDate").val();

    startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
    endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];

    var viewFormat = $("input[name='rptOptions']:checked").val();
    var report = "MAIN";
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Reports/ReportsLevelThree/GetEmployeeLeaveDetailFormat',
        data: "userCode=" + userCode + "&startDate=" + startDate + "&endDate=" + endDate + "&viewFormat=" + viewFormat + "&Report=" + report,
        success: function (result) {
            if (result != "No Data Found") {
                $("#tree").hide();
                $('#dvdata').addClass('col-lg-12')
                $('#dvdata').removeClass('col-lg-9')
                $("#dvTable").html(result);
            }
            else {
                fnMsgAlert('info', 'Employee Leave Taken Report', 'No data Found');
            }
            HideModalPopup("dvloading");
        }
    });

}

//Alumini//

function fnEmployeeLeaveTakenAlumini() {
    ShowModalPopup("dvloading");
    $("#dvTable").html("");
    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'DCR Quality Report', 'Select Start Date.');
        HideModalPopup("dvloading");
        return false;
    }

    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'DCR Quality Report', 'Select End Date.');
        HideModalPopup("dvloading");
        return false;
    }

    if ($.trim($("#txtFromDate").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Please Select StartDate.');
        HideModalPopup("dvloading");
        return false;
    }

    if ($.trim($("#txtToDate").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Please Select EndDate.');
        HideModalPopup("dvloading");
        return false;
    }

    if (!(fnValidateDateFormate($("#txtFromDate"), "StartDate"))) {
        HideModalPopup("dvloading");
        return false;
    }
    if (!(fnValidateDateFormate($("#txtToDate"), "EndDate"))) {
        HideModalPopup("dvloading");
        return false;
    }

    var FromDateArr = $("#txtFromDate").val().split('/');
    var ToDateArr = $("#txtToDate").val().split('/');
    var dt1 = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
    var dt2 = new Date(ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Info', 'Start Date Can not be Greater than the End Date');
        HideModalPopup("dvloading");
        return false;
    }

    var userCode = $('#hdnUserCode').val();

    var startDate = $("#txtFromDate").val();
    var endDate = $("#txtToDate").val();

    startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
    endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];

    var viewFormat = $("input[name='rptOptions']:checked").val();
    var report = "ALUMINI";
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Reports/ReportsLevelThree/GetEmployeeLeaveDetailFormat',
        data: "userCode=" + userCode + "&startDate=" + startDate + "&endDate=" + endDate + "&viewFormat=" + viewFormat + "&Report=" + report,
        success: function (result) {
          
            if (result != "No Data Found") {
                $("#tree").hide();
                $('#dvdata').addClass('col-lg-12')
                $('#dvdata').removeClass('col-lg-9')
                $("#dvTable").html(result);
            }
            else {
                fnMsgAlert('info', 'Employee Leave Taken Report', 'No data Found');
            }
            HideModalPopup("dvloading");

        }
    });



}