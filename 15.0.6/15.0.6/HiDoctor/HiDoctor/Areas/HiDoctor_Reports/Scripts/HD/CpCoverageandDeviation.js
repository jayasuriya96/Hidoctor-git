//Created By:Sumathi.M
//Date:2/3/2014

function fnGetCpcoverageandDeviationreport() {
    if ($('#optViewInScreen').attr('checked') == "checked") {
        fnGetCpCoverageAndDeviationinHTMLFormat();
    }
    else if ($('#optExportToExcel').attr('checked') == "checked") {
        fnGetCpCoverageAndDeviationIntoExcelExport();
    }
}

function checkAll() {
    if ($('#chkAll').attr('checked') == 'checked') {
        $('.clsCheck').attr('checked', 'checked')
    }
    else {
        $('.clsCheck').attr('checked', false);
    }
}

function chkAllChecked() {
    if ($('.clsCheck:checked').length == 3) {
        $('#chkAll').attr('checked', 'checked');
    }
    else {
        $('#chkAll').attr('checked', false);
    }
}

// Get Month val();
function fngetMonthNumber(monthName) {
    if (monthName.toUpperCase() == "JAN") {
        return 01;
    }
    if (monthName.toUpperCase() == "FEB") {
        return 02;
    }
    if (monthName.toUpperCase() == "MAR") {
        return 03;
    }
    if (monthName.toUpperCase() == "APR") {
        return 04;
    }
    if (monthName.toUpperCase() == "MAY") {
        return 05;
    }
    if (monthName.toUpperCase() == "JUN") {
        return 06;
    }
    if (monthName.toUpperCase() == "JUL") {
        return 07;
    }
    if (monthName.toUpperCase() == "AUG") {
        return 08;
    }
    if (monthName.toUpperCase() == "SEP") {
        return 09;
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

//Get DaysinMonth
function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

//Get Grid Format
function fnGetCpCoverageAndDeviationinHTMLFormat() {
    var userCode = $('#hdnUserCode').val();

    if ($("#txtFrom").val() == "") {
        fnMsgAlert('info', 'DailyCallStatus Report.', 'Select month and year');
        return false;
    }

    if ($(":checkbox[name=chkstatus]:checked").length == 0) {
        fnMsgAlert('info', 'Info', 'Please select DCR status.');       
        return false;
    }

    if ($('input:radio[name=rptOptionswiseDayandDate]:checked').length == 0) {
        fnMsgAlert('info', 'Info', 'Please select Any Order.');
        return false;
    }

    var selectedMonth = fngetMonthNumber($('#txtFrom').val().split('-')[0]);
    var selectedYear = $('#txtFrom').val().split('-')[1];
    var days = daysInMonth(selectedMonth, selectedYear);

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

    var orderWise = $('input:radio[name=rptOptionswiseDayandDate]:checked').val();

    fnGetCPCoverageandDeviation(userCode,orderWise, checkedstatus, selectedMonth, selectedYear, days, "S");
}

//Excel DownLoad
function fnGetCpCoverageAndDeviationIntoExcelExport() {
    var userCode = $('#hdnUserCode').val();

    if ($("#txtFrom").val() == "") {
        fnMsgAlert('info', 'DailyCallStatus Report.', 'Select month and year');
        return false;
    }

    if ($(":checkbox[name=chkstatus]:checked").length == 0) {
        fnMsgAlert('info', 'Info', 'Please select DCR status.');
        return false;
    }

    if ($('input:radio[name=rptOptionswiseDayandDate]:checked').length == 0) {
        fnMsgAlert('info', 'Info', 'Please select Any Order.');
        return false;
    }

    var selectedMonth = fngetMonthNumber($('#txtFrom').val().split('-')[0]);
    var selectedYear = $('#txtFrom').val().split('-')[1];
    var days = daysInMonth(selectedMonth, selectedYear);

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

    var orderWise = $('input:radio[name=rptOptionswiseDayandDate]:checked').val();

    fnGetCPCoverageandDeviation(userCode,orderWise, checkedstatus, selectedMonth, selectedYear, days, "E");
}

function fnGetCPCoverageandDeviation(userCode, orderWise, checkedstatus, selectedMonth, selectedYear, days, viewFormat) {
    $('#dvcpCoverage').block({
        message: 'Retriveing data...',
        css: { border: '1px solid #ddd' }
    });
    $.ajax({
        type: 'POST',
        data: "userCode=" + userCode + "&order=" + orderWise  + "&dcrStatus=" + checkedstatus + "&Month=" + selectedMonth + "&Year=" + selectedYear + "&Days=" + days + "&viewFormat=" + viewFormat + "&title=" + $("#divPageHeader").html(),
        url: '../ReportsLevelThree/GetCpCoverageandDeviationDetails',
        success: function (response) {
            if (response != '') {
                $('#divCpCoverageandDeviation').html(response);                
            }
            $("#dvcpCoverage").unblock();
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message.split('^')[1]);
            $("#dvcpCoverage").unblock();
        }
    });
}