//Created By : Sumathi.M
//Date : 6/1/2014

//Validation
function fnSubvalidate() {
    if (selKeys.length == 0) {
        fnMsgAlert('info', 'Info', 'Please Select Atleast one User');
        return false;
    }
    if ($.trim($('#txtStartDate').val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Please Select Start Date');
        return false;
    }
    if ($.trim($('#txtEndDate').val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Please Select End Date');
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

function fnGetActivityFrequencySummaryRept() {
    if ($('#optViewInScreen').attr('checked') == "checked") {
        fnGetActivityFrequencyinHTMLFormat();
    }
    else if ($('#optExportToExcel').attr('checked') == "checked") {
        fnActivityFrequencyIntoExcelExport();
    }
}

//Get Grid Format
function fnGetActivityFrequencyinHTMLFormat() {
    if (fnSubvalidate()) {        
        var userCodes = "";
        for (var i = 0; i < selKeys.length; i++) {
            userCodes += selKeys[i] + '^';
        }
        var day = $("#txtStartDate").val().split('/')[0];
        var month = $('#txtStartDate').val().split('/')[1];
        var year = $('#txtStartDate').val().split('/')[2];
        var startDate = year + '-' + month + '-' + day;

        var day = $("#txtEndDate").val().split('/')[0];
        var month = $('#txtEndDate').val().split('/')[1];
        var year = $('#txtEndDate').val().split('/')[2];
        var endDate = year + '-' + month + '-' + day;

        GetActivityFrequencySummary(userCodes, startDate, endDate, "S");
    }
}


//Get Excel Report
function fnActivityFrequencyIntoExcelExport() {
    if (fnSubvalidate()) {  
        var userCodes = "";
        for (var i = 0; i < selKeys.length; i++) {
            userCodes += selKeys[i] + '^';
        }
        var day = $("#txtStartDate").val().split('/')[0];
        var month = $('#txtStartDate').val().split('/')[1];
        var year = $('#txtStartDate').val().split('/')[2];
        var startDate = year + '-' + month + '-' + day;

        var day = $("#txtEndDate").val().split('/')[0];
        var month = $('#txtEndDate').val().split('/')[1];
        var year = $('#txtEndDate').val().split('/')[2];
        var endDate = year + '-' + month + '-' + day;

        GetActivityFrequencySummary(userCodes, startDate, endDate, "E");
    }
}

//Bind the data with Html Table
function GetActivityFrequencySummary(userCodes, startDate, endDate, viewFormat) {
    $('#dvActivityfrequencysummary').block({
        message: 'Retriveing data...',
        css: { border: '1px solid #ddd' }
    });
    $.ajax({
        type: 'POST',
        data: "userCodes=" + userCodes + "&startDate=" + startDate + "&endDate=" + endDate + "&viewFormat=" + viewFormat + "&title=" + $("#divPageHeader").html(),
        url: '../ReportsLevelThree/GetActivityFrequencySummaryDetails',
        success: function (response) {
            if (response != '') {
                $('#divActivityfrequencySummary').html(response);                
            }            
            $("#dvActivityfrequencysummary").unblock();
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message.split('^')[1]);
            $("#dvActivityfrequencysummary").unblock();
        }
    });
}

function fnclick() {
    $("#divPageHeader").html('TP Approval')
    $('#main').load('HiDoctor_Activity/TourPlanner/TPApproval');
}



