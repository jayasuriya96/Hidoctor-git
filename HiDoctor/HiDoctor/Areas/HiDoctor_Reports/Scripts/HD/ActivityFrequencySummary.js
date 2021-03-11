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

    var FromDateArr = $("#txtStartDate").val().split('/');
    var ToDateArr = $("#txtEndDate").val().split('/');
    var dt1 = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
    var dt2 = new Date(ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Info', 'Start Date Can not be Greater than the End Date');
        return false;
    }

    var validformat = /^\d{2}\/\d{2}\/\d{4}$/
    if (!validformat.test($('#txtStartDate').val())) {
        fnMsgAlert('info', 'Info', 'Enter The Valid Start Date');
        return false;
    }

    var validformat = /^\d{2}\/\d{2}\/\d{4}$/
    if (!validformat.test($('#txtEndDate').val())) {
        fnMsgAlert('info', 'Info', 'Enter The Valid End Date');
        return false;
    }
    return true;
}

function GetActivityFrequencySummaryRept() {
    if ($('#optViewInScreen').attr('checked') == "checked") {
        fnGetActivityFrequencyinHTMLFormat();
    }
    else if ($('#optExportToExcel').attr('checked') == "checked") {
        fnActivityFrequencyIntoExcelExport();
    }
}



//Get Grid Format
//Get Grid Format
function fnGetActivityFrequencyinHTMLFormat() {
    if (fnSubvalidate()) {
        var userCodes = "";
        for (var i = 0; i < selKeys.length; i++) {
            userCodes += selKeys[i] + '^';
        }
        var startDate = $('#txtStartDate').val().split('/');
        startDate = startDate[1] + '/' + startDate[0] + '/' + startDate[2];
        var endDate = $('#txtEndDate').val().split('/');
        endDate = endDate[1] + '/' + endDate[0] + '/' + endDate[2];
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
        var startDate = $('#txtStartDate').val().split('/');
        startDate = startDate[1] + '/' + startDate[0] + '/' + startDate[2];
        var endDate = $('#txtEndDate').val().split('/');
        endDate = endDate[1] + '/' + endDate[0] + '/' + endDate[2];
        GetActivityFrequencySummary(userCodes, startDate, endDate, "E");
    }
}

//Bind the data with Html Table
function GetActivityFrequencySummary(userCodes, startDate, endDate, viewFormat) {
    $.ajax({
        type: 'POST',
        data: "userCodes=" + userCodes + "&startDate=" + startDate + "&endDate=" + endDate + "&viewFormat=" + viewFormat,
        url: '../ReportsLevelThree/GetActivityFrequencySummaryDetails',
        success: function (response) {
            if (response != '') {
                $('#divActivityfrequencySummary').html(response);
            }
            $('#tblLastsubmittedqukRefRept').tablePagination({});
            $("#dvUserTree").dynatree("getRoot").visit(function (node) {
                node.select(false);
            });
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
        }
    });
}


function fnshowReport() {
    var result = fnSubValidate();
    if (result) {
        $('#main').block({
            message: '<h3>Processing</h3>',
            css: { border: '2px solid #ddd' }
        });

        var userCodes = "";
        for (var i = 0; i < selKeys.length; i++) {
            userCodes += selKeys[i] + '^';
        }
        var day = $("#txtStartDate").val().split('/')[0];
        var month = $('#txtStartDate').val().split('/')[1];
        var year = $('#txtStartDate').val().split('/')[2];
        var StartDate = year + '-' + month + '-' + day;

        var day = $("#txtendDate").val().split('/')[0];
        var month = $('#txtendDate').val().split('/')[1];
        var year = $('#txtendDate').val().split('/')[2];
        var EndDate = year + '-' + month + '-' + day;
        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Reports/ReportsLevelThree/GetActivityFrequencySummaryDetails',
            data: { 'userCode': userCodes, 'startDate': StartDate, 'endDate': EndDate },
            success: function (response) {
                if (response != "" && response != null) {
                    if (response.split('^')[0] != "FAIL") {
                        $("#divActivityfrequencySummary").html(response.split('$')[0]);
                        $("#lnkExcel").attr('href', response.split('$')[1]);
                        $("#dvTablePrint").show();
                    }
                    else {
                        fnMsgAlert('info', '', 'Error:' + response.split('^')[1]);
                    }
                }
                $("#main").unblock();
            },
            error: function (e) {
                fnMsgAlert('info', '', 'Error.' + e.Message);
                $("#main").unblock();
            }
        });
    }
}

function fnSubValidate() {
    if ($.trim($("#hdnUserCode").val()) == "") {
        fnMsgAlert('info', 'Info', 'Please Choose any User');
        return false;
    }
    return true;
}