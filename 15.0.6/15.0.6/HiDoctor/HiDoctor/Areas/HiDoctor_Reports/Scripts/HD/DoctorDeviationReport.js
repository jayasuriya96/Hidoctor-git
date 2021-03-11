//Created By:Sumathi.M
//Date : 2/13/2014

//Validation
function fnSubvalidate() {
    if ($.trim($('#txtStartDate').val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Please Select Start Date');
        return false;
    }
    if ($.trim($('#txtEndDate').val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Please Select End Date');
        return false;
    }

    if ($(":checkbox[name=chkstatus]:checked").length == 0) {
        fnMsgAlert('info', 'Info', 'Please select DCR status.');
        return false;
    }
    //Date Validation
    if (!(fnValidateDateFormate($("#txtStartDate"), "StartDate"))) {
        return false;
    }

    if (!(fnValidateDateFormate($("#txtEndDate"), "EndDate"))) {
        return false;
    }

    var FromDateArr = $("#txtStartDate").val().split('/');
    var ToDateArr = $("#txtEndDate").val().split('/');
    var dt1 = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
    var dt2 = new Date(ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Info', 'EndDate Should not be less than the StartDate');
        return false;
    }
    return true;
}

function fnBindDoctorDeviationReport() {
    if ($('#optViewInScreen').attr('checked') == "checked") {
        fnGetDoctorDeviationinHTMLFormat();
    }
    else if ($('#optExportToExcel').attr('checked') == "checked") {
        fnDoctorDeviationIntoExcelExport();
    }
}
//To check and Uncheck All
function checkAll() {
    if ($('#chkAll').attr('checked') == 'checked') {
        $('.clsCheck').attr('checked', 'checked')
    }
    else {
        $('.clsCheck').attr('checked', false);
    }
}
//To check All
function chkAllChecked() {
    if ($('.clsCheck:checked').length == 4) {
        $('#chkAll').attr('checked', 'checked');
    }
    else {
        $('#chkAll').attr('checked', false);
    }
}

//Get Grid Format
function fnGetDoctorDeviationinHTMLFormat() {
    if (fnSubvalidate()) {
        var userCode = $('#hdnUserCode').val();
        var day = $("#txtStartDate").val().split('/')[0];
        var month = $('#txtStartDate').val().split('/')[1];
        var year = $('#txtStartDate').val().split('/')[2];
        var startDate = year + '-' + month + '-' + day;

        var day = $("#txtEndDate").val().split('/')[0];
        var month = $('#txtEndDate').val().split('/')[1];
        var year = $('#txtEndDate').val().split('/')[2];
        var endDate = year + '-' + month + '-' + day;

        var checkedstatus = "";
        var adjustType = $('input:checkbox[name=chkstatus]:checked');
        for (var intLoop = 0; intLoop < adjustType.length; intLoop++) {
            if (adjustType[intLoop].id == "chkAll") {
                checkedstatus = adjustType[intLoop].value + ",";
                break;
            }
            else {
                checkedstatus += adjustType[intLoop].value + ",";
            }
        }
        if (checkedstatus != "") {
            checkedstatus = checkedstatus.substring(0, checkedstatus.length - 1);
        }

        GetDoctorDeviationReport(userCode, startDate, endDate, checkedstatus, "S");
    }
}


//Get Excel Report
function fnDoctorDeviationIntoExcelExport() {
    if (fnSubvalidate()) {
        var userCode = $('#hdnUserCode').val();

        var day = $("#txtStartDate").val().split('/')[0];
        var month = $('#txtStartDate').val().split('/')[1];
        var year = $('#txtStartDate').val().split('/')[2];
        var startDate = year + '-' + month + '-' + day;

        var day = $("#txtEndDate").val().split('/')[0];
        var month = $('#txtEndDate').val().split('/')[1];
        var year = $('#txtEndDate').val().split('/')[2];
        var endDate = year + '-' + month + '-' + day;

        var checkedstatus = "";
        var adjustType = $('input:checkbox[name=chkstatus]:checked');
        for (var intLoop = 0; intLoop < adjustType.length; intLoop++) {
            if (adjustType[intLoop].id == "chkAll") {
                checkedstatus = adjustType[intLoop].value + ",";
                break;
            }
            else {
                checkedstatus += adjustType[intLoop].value + ",";
            }
        }
        if (checkedstatus != "") {
            checkedstatus = checkedstatus.substring(0, checkedstatus.length - 1);
        }

        GetDoctorDeviationReport(userCode, startDate, endDate, checkedstatus, "E");
    }
}

//Bind the data with Html Table
function GetDoctorDeviationReport(userCode, startDate, endDate, checkedstatus, viewFormat) {
    $('#dvDoctorDeviation').block({
        message: 'Retriveing data...',
        css: { border: '1px solid #ddd' }
    });
    $.ajax({
        type: 'POST',
        data: "userCode=" + userCode + "&startDate=" + startDate + "&endDate=" + endDate + "&dcrStatus=" + checkedstatus + "&viewFormat=" + viewFormat+ "&title=" + $("#divPageHeader").html(),
        url: '../ReportsLevelThree/GetDoctorDeviationReportDetails',
        success: function (response) {
            if (response != '') {
                $('#dvDoctorDeviationReportGrid').html(response);                
            }
            $("#dvDoctorDeviation").unblock();
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
            $("#dvDoctorDeviation").unblock();
        }
    });
}
