//Created By : Sumathi.M
//Date : 29/1/2014

function fnGetshowDailycallstatusRept() {
    if ($('#optViewInScreen').attr('checked') == "checked") {
        fnGetDailycallstatusinHTMLFormat();
    }
    else if ($('#optExportToExcel').attr('checked') == "checked") {
        fnGetDailycallstatusIntoExcelExport();
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

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

//Get Grid Format
function fnGetDailycallstatusinHTMLFormat() {
    var regionCode = $('#hdnRegionCode').val();

    if ($("#txtFrom").val() == "") {
        fnMsgAlert('info', 'DailyCallStatus Report.', 'Select month and year');
        return false;
    }

    if ($(":checkbox[name=chkstatus]:checked").length == 0) {
        fnMsgAlert('info', 'Info', 'Please select DCR status.');
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

    GetDailycallstatusReport(regionCode, checkedstatus, selectedMonth, selectedYear, days, "S");
}

//Get Excel Format

function fnGetDailycallstatusIntoExcelExport() {
    var regionCodes = $('#hdnRegionCode').val();

    if ($("#txtFrom").val() == "") {
        fnMsgAlert('info', 'DailyCallStatus Report.', 'Select month and year');
        return false;
    }

    if ($(":checkbox[name=chkstatus]:checked").length == 0) {
        fnMsgAlert('info', 'Info', 'Please select DCR status.');
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

    GetDailycallstatusReport(regionCodes, checkedstatus, selectedMonth, selectedYear, days, "E");
}

//Bind the data with Html Table
function GetDailycallstatusReport(regionCodes, checkedstatus, selectedMonth, selectedYear, days, viewFormat) {
    $('#dvDailycallstatus').block({
        message: 'Retrieving data...',
        css: { border: '1px solid #ddd' }
    });
    var RegionType = $('#hdnUseractivity').val();
    $('#regiontree').hide();
    $('#leftNav').removeClass('col-xs-5');
    $('#leftNav').removeClass('col-xs-4');
    $('#leftNav').removeClass('col-xs-3');
    $("#divMain").removeClass('col-xs-9');
    $("#divMain").removeClass('col-xs-8');
    $("#divMain").removeClass('col-xs-7');
    $("#divMain").addClass('col-xs-11');
    $("#spnTreeToggle").html('Show Tree');

    $('#divDailycallstatusrpt').hide();


    $.ajax({
        type: 'POST',
        data: "regionCode=" + regionCodes + "&viewFormat=" + viewFormat + "&dcrStatus=" + checkedstatus + "&Month=" + selectedMonth + "&Year=" + selectedYear + "&Days=" + days + "&title=" + $("#divPageHeader").html() +"&SelectedUser="+RegionType,
        url: '../ReportsLevelThree/GetDailyCallStatusDetails',
        success: function (response) {
            if (response != '') {
                $("#spnTreeToggle").show();
                $("#divDailycallstatusrpt").show();
                $('#divDailycallstatusrpt').html(response);
            }
            $("#dvDailycallstatus").unblock();
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message.split('^')[1]);
            $("#dvDailycallstatus").unblock();
        }
    });
}


