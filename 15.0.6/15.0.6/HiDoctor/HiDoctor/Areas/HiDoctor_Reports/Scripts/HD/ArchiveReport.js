/* Comprehensive Analysis Report */
function fnRequestComprehensiveAnalysisReport() {
    var startDate = $('#txtFromDate').val().split('/');
    var endDate = $('#txtToDate').val().split('/');

    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'Comprehensive Analysis Report', 'Please select Start Date.');
        HideModalPopup("dvloading");
        return false;

    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'Comprehensive Analysis Report', 'Please select End Date.');
        HideModalPopup("dvloading");
        return false;
    }
    var dt1 = new Date(startDate[2] + "-" + startDate[1] + "-" + startDate[0]);
    var dt2 = new Date(endDate[2] + "-" + endDate[1] + "-" + endDate[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Comprehensive Analysis Report', 'Start date should be less than end date.');
        HideModalPopup("dvloading");
        return false;
    }

    // to open as a sub report from expense group wise analysis, check report type 
    var reportType = "";
    if ($("#ddlReportType") == null || $("#ddlReportType") === undefined) {
        reportType = "VISIT";
    }
    else {
        reportType = $("#ddlReportType").val();
    }

    // assign date values in server controls for excel export
    $("#sd").val($("#txtFromDate").val());
    $("#ed").val($("#txtToDate").val());
    $("#reportType").val(reportType);

    var userCodes = "";

    for (var i = 0; i < selKeys.length; i++) {
        userCodes += selKeys[i] + '^';
    }

    $("#userCode").val(userCodes);

    if (userCodes == "") {
        fnMsgAlert('info', 'Comprehensive Analysis Report', 'Please select atleast one user.');
        HideModalPopup("dvloading");
        return false;
    }
    debugger;
    $('#dvRptQueuePanel').show();
    $('#dvRptPanel').hide();
    $('#dvAsynMsg').show();
    $('#dvAsynReport').html("");
    $('#dvAsynMsg').html("");
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ArchiveReport/ProcessComprehensiveAnalysisReport',
        data: "userCode=" + userCodes + "&sd=" + $("#txtFromDate").val() + "&ed=" + $("#txtToDate").val() + "&reportType=" + reportType,
        success: function (response) {
            if (response != "") {
                HideModalPopup("dvloading");
                $('#dvAsynMsg').html('Report submitted for processing...Trasaction Reference Number:' + response);
                fnGetAsynReportstatus('ComprehensiveAnalysisReport');
            }
            HideModalPopup("dvloading");
            $('#dvRptQueuePanel').show();
        },
        error: function () {
            fnMsgAlert('info', 'Comprehensive Analysis Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

/* Category Wise DrVisit Analysis Report */
function fnCategoryWiseDoctorVisitAnalysis() {
    debugger;
    ShowModalPopup("dvloading");
    if (!fnValidateInputs()) {
        HideModalPopup("dvloading");
        return false;
    }

    $('#divInput').show();
    $('#divToggle').show();
    var selectedMonth = $('#txtMonth').val();
    var Month = fngetMonthNumber(selectedMonth.split('-')[0]);
    var Year = selectedMonth.split('-')[1];
    var groupbyRegionTypeCode = $('#ddlGroupByRegionType').val();
    var aggregateRegionTypeCode = $('#ddlAggregateRegionType').val();
    var groupbyRegionTypeName = $('#ddlGroupByRegionType :selected').text();
    var aggregateRegionTypeName = $('#ddlAggregateRegionType :selected').text();

    var dcrOptions = $('input:checkbox[name=DCRStatus]:checked');
    var dcrStatus = "";

    for (var intLoop = 0; intLoop < dcrOptions.length; intLoop++) {
        dcrStatus += dcrOptions[intLoop].value + "^";
    }

    var monthName = $('#txtMonth').val();
    $('#dvRptQueuePanel').show();
    $('#dvAsynMsg').show();
    $('#dvAsynReport').html("");
    $('#dvAsynMsg').html("");
    $.ajax({
        url: '../HiDoctor_Reports/AysncReports/ProcessCategoryWiseDrVisitAnalysis',
        type: "POST",
        data: "Month=" + Month + "&Year=" + Year + "&GroupByRegionTypeCode=" + groupbyRegionTypeCode + "&AggregateRegionTypeCode=" + aggregateRegionTypeCode + "&DCRStatus=" + dcrStatus + "&MonthName=" + monthName + "&GroupByRegionTypeName=" + groupbyRegionTypeName + "&AggregateRegionTypeName=" + aggregateRegionTypeName + "",
        success: function (response) {
            if (response != "") {
                debugger;
                HideModalPopup('dvloading');
                $('#dvAsynMsg').html('Report submitted for processing...Trasaction Reference Number:' + response);
                fnGetAsynReportstatus('CategoryWiseDrVisitAnalysis');
                $('#tblTpVsActualDocVisits').tablePagination({});
                $('#dvTblHelpIcon').show();

            }
            else {
                fnMsgAlert('info', 'Report', 'No data found.');
                HideModalPopup('dvloading');
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });

    $("#divMain").css('width', '100%');
    $("#dvAsynReport").css('width', '100%');
}

function fnLoadRegionTypes() {
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/CategoryWiseDrVisitAnalysis/GetRegionTypes',
        data: 'A',
        success: function (response) {
            jsData = eval('(' + response + ')');

            $('option', $("#ddlGroupByRegionType")).remove();
            $('option', $("#ddlAggregateRegionType")).remove();

            if (jsData.Tables[0].Rows.length > 0) {
                $('#ddlGroupByRegionType').append("<option value='0'>-Select-</option>");
                $('#ddlAggregateRegionType').append("<option value='0'>-Select-</option>");

                for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                    $("#ddlGroupByRegionType").append("<option value='" + jsData.Tables[0].Rows[i].Region_Type_Code + "'>" + jsData.Tables[0].Rows[i].Region_Type_Name + "</option>");
                    $("#ddlAggregateRegionType").append("<option value='" + jsData.Tables[0].Rows[i].Region_Type_Code + "'>" + jsData.Tables[0].Rows[i].Region_Type_Name + "</option>");
                }

                $("#ddlGroupByRegionType").val('0');
                $("#ddlAggregateRegionType").val('0');
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

function fnValidateInputs() {
    // Month validation
    if ($('#txtMonth').val() == "") {
        alert('Please select report month');
        return false;
    }

    // Group by region type validation
    if ($('#ddlGroupByRegionType').val() == 0) {
        alert('Please select Group by option');
        return false;
    }

    // Aggregate region type validation
    if ($('#ddlAggregateRegionType').val() == 0) {
        alert('Please select Aggregate option');
        return false;
    }

    // DCR Status validation
    var adjustType = $('input:checkbox[name=DCRStatus]:checked');
    var selectedval = "";
    for (var intLoop = 0; intLoop < adjustType.length; intLoop++) {
        selectedval += adjustType[intLoop].value + ",";
    }
    if (selectedval != "") {
        selectedval = selectedval.substring(0, selectedval.length - 1);
    }
    else {
        alert('Select at least one DCR status');
        return false;
    }

    return true;
}


/* Category Wise DrVisit Analysis Report */

// ProductWise Doctor Tabular
function fnProductWiseDoctorTabular() {
    var startDate = $("#txtFromDate").val();
    var endDate = $("#txtToDate").val();
    startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
    endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];



    if (selKeys == "") {
        fnMsgAlert('info', 'Product Wise Doctor Report', 'Select atleast one user');
        HideModalPopup("dvloading");
        return false;
    }

    var productSelection = $("#ddlproductSelection option:selected").val();

    var selectedval = "";
    var adjustType = $('input:checkbox[name=DcrStatus]:checked');
    for (var intLoop = 0; intLoop < adjustType.length; intLoop++) {
        selectedval += adjustType[intLoop].value + "^";
        if (adjustType[intLoop].value.length > 4) {
            selectedval = "1^2^0^";
            break;
        }
    }


    var quanity = $('input:radio[name=Quantity]:checked').val();
    if (quanity == "2") {
        quanity = "";
    }
    var viewFormat = $("input[name='rptOptions']:checked").val();


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

    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'Product Wise Doctor Report', 'Select start date');
        HideModalPopup("dvloading");
        return false;

    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'Product Wise Doctor Report', 'Select end date');
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

    if ($("#drpUserTypeName").val() == "0") {
        fnMsgAlert('info', 'Product Wise Doctor Report', 'Please Select Usertype Name.');
        return false;
    }

    if (selectedval != "") {
        selectedval = selectedval.substring(0, selectedval.length - 1);
    }
    else {
        fnMsgAlert('info', 'Product Wise Doctor Report', 'Select atleast one dcr Status.');
        HideModalPopup("dvloading");
        return false;
    }

    if ($('input:radio[name=Quantity]:checked').val() == " ") {
        fnMsgAlert('info', 'Product Wise Doctor Report', 'Please Select Usertype Name.');
        return false;
    }
    ShowModalPopup("dvloading");
    $('#dvRptQueuePanel').show();
    $('#dvRptPanel').hide();
    $('#dvAsynMsg').show();
    $('#dvAsynReport').html("");
    $('#dvAsynMsg').html("");
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Reports/AysncReports/ProcessProductWiseDoctorTabularReport',
        data: "userCode=" + selKeys + "&startDate=" + startDate + "&endDate=" + endDate + "&productSelection=" + productSelection + "&dcrStatus=" + selectedval + "&quanity=" + quanity,
        success: function (response) {
            if (response != '') {
                HideModalPopup("dvloading");
                $('#dvAsynMsg').html('Report submitted for processing...Trasaction Reference Number:' + response);
                fnGetAsynReportstatus('ProductWiseDoctorTabularReport');
                // $('#dvdata').addClass('col-lg-12')
                // $('#dvdata').removeClass('col-lg-9')
            }
            else {
                fnMsgAlert('info', 'Product Wise Doctor Report', 'No data Found');
            }
            HideModalPopup("dvloading");
            $('#dvRptQueuePanel').show();
        }
    });


}
//ProductWise Doctor Tabular

//Asyc Daily Call Report

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function fnGetshowDailycallstatusRept() {
    var regionCode = $('#hdnRegionCode').val();

    if (regionCode == "") {
        fnMsgAlert('info', 'DailyCallStatus Report.', 'Select Region Code');
        return false;
    }

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
    var ReportOption = "";
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
    debugger;
    if ($("#optViewInScreen").is(":checked")) {
        ReportOption = "S";
    }
    else { ReportOption = "S"; }

    AsyncGetDailycallstatusReport(regionCode, checkedstatus, selectedMonth, selectedYear, days, ReportOption);
}

function AsyncGetDailycallstatusReport(regionCodes, checkedstatus, selectedMonth, selectedYear, days, viewFormat) {
    $('#dvDailycallstatus').block({
        message: 'Retrieving data...',
        css: { border: '1px solid #ddd' }
    });
    var RegionType = $('#hdnUseractivity').val();
    $('#regiontree').hide();
    $('#leftNav').removeClass('col-xs-5');
    $('#leftNav').removeClass('col-xs-4');
    $('#leftNav').removeClass('col-xs-3');
    $("#divMainDCR").removeClass('col-xs-9');
    $("#divMainDCR").removeClass('col-xs-8');
    $("#divMainDCR").removeClass('col-xs-7');
    $("#divMainDCR").addClass('col-xs-11');
    $("#spnTreeToggle").html('Show Tree');

    //$('#divDailycallstatusrpt').hide();
    $('#dvRptQueuePanel').show();
    $('#dvRptPanel').hide();
    $('#dvAsynMsg').show();
    $('#dvAsynReport').html("");
    $('#dvAsynMsg').html("");
    debugger;
    $.ajax({
        type: 'POST',
        data: "regionCode=" + regionCodes + "&viewFormat=" + viewFormat + "&dcrStatus=" + checkedstatus + "&Month=" + selectedMonth + "&Year=" + selectedYear + "&Days=" + days + "&title=" + $("#divPageHeader").html() + "&SelectedUser=" + RegionType,
        url: '../HiDoctor_Reports/AysncReports/ProcessDailyCallStatusReport',
        success: function (response) {
            debugger;
            if (response != '') {
                $("#spnTreeToggle").show();
                $('#dvAsynMsg').html('Report submitted for processing...Trasaction Reference Number:' + response);
                fnGetAsynReportstatus('DailyCallStatusReport');
            }
            $("#dvDailycallstatus").unblock();
        },
        error: function (e) {
            debugger;
            fnMsgAlert('info', '', 'Error.' + e.Message.split('^')[1]);
            $("#dvDailycallstatus").unblock();
            $('#dvRptQueuePanel').show();
        }
    });
}

/* Async Last Submitted Quick Ref */

function fnSubvalidate() {
    if (selKeys.length == 0) {
        fnMsgAlert('info', 'Info', 'Please Select Atleast one User');
        return false;
    }
    if ($.trim($('#txtstartDate').val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Please Select Start Date');
        return false;
    }
    if ($.trim($('#txtEndDate').val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Please Select End Date');
        return false;
    }

    //Date Validation
    if (!(fnValidateDateFormate($("#txtstartDate"), "StartDate"))) {
        return false;
    }

    if (!(fnValidateDateFormate($("#txtEndDate"), "EndDate"))) {
        return false;
    }

    var FromDateArr = $("#txtstartDate").val().split('/');
    var ToDateArr = $("#txtEndDate").val().split('/');
    var dt1 = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
    var dt2 = new Date(ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Info', 'EndDate Should not be less than the StartDate');
        return false;
    }


    return true;
}

//Get Grid Format
function fnValidateLastSubmittedRept() {
    if (fnSubvalidate()) {
        var userCodes = "";
        for (var i = 0; i < selKeys.length; i++) {
            userCodes += selKeys[i] + '^';
        }
        var startDate = $('#txtstartDate').val().split('/');
        startDate = startDate[1] + '/' + startDate[0] + '/' + startDate[2];
        var endDate = $('#txtEndDate').val().split('/');
        endDate = endDate[1] + '/' + endDate[0] + '/' + endDate[2];
        if ($('#optViewInScreen').attr('checked') == "checked") {

            AsyncGetLastSubmittedQuickReference(userCodes, startDate, endDate, "S");
        }
        else {
            AsyncGetLastSubmittedQuickReference(userCodes, startDate, endDate, "E");
        }

    }
}
//Bind the data with Html Table
function AsyncGetLastSubmittedQuickReference(userCodes, startDate, endDate, viewFormat) {
    $('#dvLastsubmitted').block({
        message: 'Retriveing data...',
        css: { border: '1px solid #ddd' }
    });
    $('#dvRptQueuePanel').show();
    $('#dvRptPanel').hide();
    $('#dvAsynMsg').show();
    $('#dvAsynReport').html("");
    $('#dvAsynMsg').html("");
    $("#dvTree").hide();
    $("#lnkTree").html('Show Tree');
    $.ajax({
        type: 'POST',
        data: "userCodes=" + userCodes + "&startDate=" + startDate + "&endDate=" + endDate + "&viewFormat=" + viewFormat,
        url: '../AysncReports/ProcessAsyncLastSubmittedQuickRefReport',
        success: function (response) {
            if (response != '') {
                //$("#spnTreeToggle").show();
                $('#dvAsynMsg').html('Report submitted for processing...Trasaction Reference Number:' + response);
                fnGetAsynReportstatus('LastSubmittedQuickRef');
                //$('#divLastsubmittedQuickRef').html(response);
            }
            $('#tblLastsubmittedqukRefRept').tablePagination({});
            //$("#dvUserTree").dynatree("getRoot").visit(function (node) {
            //    node.select(false);
            //});
            $("#dvLastsubmitted").unblock();
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
            $("#dvLastsubmitted").unblock();
            $('#dvRptQueuePanel').show();
        }
    });
}

function fnGetLastSubmittedCalciReport() {
    //var childUserCounts = [];
    //if (arrUserandChildcount_g != null && arrUserandChildcount_g.length > 0) {
    //    childUserCounts  = arrUserandChildcount_g;
    //}
    ShowModalPopup("dvloading");
    $('#lnkExcel').hide();
    $("#dvTree").hide();
    $('#divInput').show();
    $("#spnTreeToggle").html('Show Tree');
    $('#divToggle').show();
    $("#divMain").css('width', '100%');

    $("#divCompReport").html("");
    $("#divCompPrint").html("");

    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'Last Submitted Report', 'Select month & year.');
        HideModalPopup("dvloading");
        return false;
    }
    var month = fngetMonthNumber($('#txtFromDate').val().split('-')[0]);
    var year = $('#txtFromDate').val().split('-')[1];

    var unlistedDoctor = $('input:radio[name=Unlisted]:checked').val();
    var DCRDate = "ACTUAL";

    var doctorMissed = "";
    if ($(":checkbox[name=missed]:checked").length > 0) {
        doctorMissed = "MISSED";
    }

    var userCode = selKeys;
    var reportViewType = $("input:radio[name=rdReportView]:checked").val();

    if (userCode == "") {
        fnMsgAlert('info', 'Last Submitted Report', 'Please select atleast one user.');
        HideModalPopup("dvloading");
        return false;
    }
    $('#hdnDownload').val('');
    $('#hdnDownload').val(userCode);
    $('#dvRptQueuePanel').show();
    $('#dvRptPanel').hide();
    $('#dvAsynMsg').show();
    $('#dvAsynReport').html("");
    $('#dvAsynMsg').html("");
    $("#dvTree").hide();
    $("#spnTreeToggle").html('Show Tree');
    $("#divInput").slideUp();
    $("#spnInputToggle").html("Show Input");
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ArchiveReport/ProcessLastSubmittedCalciReport',
        data: 'userCode=' + userCode + '&month=' + month + '&year=' + year + '&type=' + unlistedDoctor + '&selectionType=' + DCRDate + '&title=' + $("#divPageHeader").html() + '&missed=' + doctorMissed + '&reportViewType=' + reportViewType + '&childUsersCount=' + JSON.stringify(arrUserandChildcount_g),
        success: function (response) {
            $("#divReport").html('');
            if (response != "") {
                $('#dvAsynMsg').html('Report submitted for processing...Trasaction Reference Number:' + response);
                fnGetAsynReportstatus('LastSubmittedCalciReport');
                $('#tblLastSubmittedReport').tablePagination({});
                HideModalPopup("dvloading");
            }
            else {
                fnMsgAlert('info', 'Last Submitted Report', 'No data found.');
                $("#spnTreeToggle").show();
                $('#dvTablePrint').hide();
                HideModalPopup("dvloading");

            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

function fnGetViewAllLastSubmittedCalciReport() {
    if (selKeys.length > 1) {
        fnMsgAlert("info", "Report", "Please select only one user to View All.");
        return false;
    }


    ShowModalPopup("dvloading");
    $('#lnkExcel').hide();
    $("#dvTree").hide();
    $('#divInput').show();
    $("#spnTreeToggle").html('Show Tree');
    $('#divToggle').show();
    $("#divMain").css('width', '100%');

    $("#divCompReport").html("");
    $("#divCompPrint").html("");


    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'Last Submitted Report', 'Select month & year.');
        HideModalPopup("dvloading");
        return false;
    }
    var month = fngetMonthNumber($('#txtFromDate').val().split('-')[0]);
    var year = $('#txtFromDate').val().split('-')[1];

    var unlistedDoctor = $('input:radio[name=Unlisted]:checked').val();
    var DCRDate = "ACTUAL";

    var doctorMissed = "";
    if ($(":checkbox[name=missed]:checked").length > 0) {
        doctorMissed = "MISSED";
    }
    var userCode = "ALL";
    $('#hdnDownload').val('');
    $('#hdnDownload').val(userCode);
    var reportViewType = $("input:radio[name=rdReportView]:checked").val();
    $('#dvRptQueuePanel').show();
    $('#dvRptPanel').hide();
    $('#dvAsynMsg').show();
    $('#dvAsynReport').html("");
    $('#dvAsynMsg').html("");
    $("#dvTree").hide();
    $("#spnTreeToggle").html('Show Tree');
    $("#divInput").slideUp();
    $("#spnInputToggle").html("Show Input");
    debugger;
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ArchiveReport/ProcessLastSubmittedCalciReport',
        data: 'userCode=' + userCode + '&month=' + month + '&year=' + year + '&type=' + unlistedDoctor + '&selectionType=' + DCRDate + '&title=' + $("#divPageHeader").html() + '&missed=' + doctorMissed + '&reportViewType=' + reportViewType + '&childUsersCount=' + JSON.stringify(arrUserandChildcount_g),
        success: function (response) {
            $("#divReport").html('');
            if (response != "") {
                $('#dvAsynMsg').html('Report submitted for processing...Trasaction Reference Number:' + response);
                fnGetAsynReportstatus('LastSubmittedCalciReport');
                $('#tblLastSubmittedReport').tablePagination({});
                HideModalPopup("dvloading");
            }
            else {
                fnMsgAlert('info', 'Last Submitted Report', 'No data found.');
                $("#spnTreeToggle").show();
                $('#dvTablePrint').hide();
                HideModalPopup("dvloading");

            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}
//LastSubmittedCalci

var FWADetailsJson_g = "";

//function to get the login user code under user types



function fnGetUnderUserTypes() {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Reports/ArchiveReport/GetUnderUserType',
        data: "A",
        success: function (jsData) {
            if (jsData != "") {
                jsData = eval('(' + jsData + ')');
                //To remove all the options
                var select = $('#drpUserType');
                $('option', select).remove();
                $('#drpUserType').append("<option value='0'>-Select user type-</option>");
                for (var j = 0; j < jsData.Tables[0].Rows.length; j++) {
                    $('#drpUserType').append("<option value='" + jsData.Tables[0].Rows[j].User_Type_Code + "'>" + jsData.Tables[0].Rows[j].User_Type_Name + "</option>");
                }
            }
        }
    });
}
//function to disable team / self
function fnGetUnderUserTypeCount() {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Reports/ArchiveReport/GetUnderUserTypeCount',
        data: "userTypeCode=" + $('#drpUserType').val() + "",
        success: function (count) {
            if (count == 0) {
                $("input[name=mode][value=1]").attr('checked', 'checked');
                $('input[type=radio][name=mode]').prop('disabled', true);
            }
            else {
                $('input[type=radio][name=mode]').prop('disabled', false);
            }
        }
    });
}


function fnGetFWAnanlysisDetails() {
    if ($("#txtMonth").val() == "") {
        fnMsgAlert('info', 'FieldWorkAnalysis Report', 'Please Select The Month');
        return false;
    }
    if ($("#drpUserType").val() == "0") {
        fnMsgAlert('info', 'FieldWorkAnalysis Report', 'Please Select The UserType Name .');
        return false;
    }

    if (!$("input[name='mode']").is(":checked")) {
        fnMsgAlert('info', 'FieldWorkAnalysis Report', 'Please Select the Mode type .');
        return false;
    }

    $.blockUI();
    $("#dvFWAnalysisReport").html('');
    var userTypeCode = $('#drpUserType').val();
    var month = $('#txtMonth').val().split('-')[0];
    var year = $('#txtMonth').val().split('-')[1];
    var mode = $("input[type='radio'][name='mode']:checked").val();
    var userTypeName = $('option:selected', $('#drpUserType')).text();

    $.ajax({
        type: "POST",
        url: '../HiDoctor_Reports/ArchiveReport/GetFWAnanlysisDetails',
        data: "userTypeCode=" + userTypeCode + "&month=" + month + "&year=" + year + "&mode=" + mode + "&userTypeName=" + userTypeName + "",
        success: function (tableContent) {
            $("#dvFWAnalysisReport").html(tableContent);
            $("#MaindivPrint").html($("#FWAMainreport").html());

            //enabling datatable
            if ($.fn.dataTable) {
                var oTable = $('#tblFWAReport').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            };

            fninializePrint("MaindivPrint", "MainifrmPrint", "FWAMainreport");
            $.unblockUI();
        },
        error: function (jsData) {
            $.unblockUI();
        },
        complete: function (jsData) {
            $.unblockUI();
        }
    });
}
function fnBindUserDetails(rowIndex) {
    if ($("#txtMonth").val() == "") {
        fnMsgAlert('info', 'FieldWorkAnalysis Report', 'Please Select The Month');
        return false;
    }
    if ($("#drpUserType").val() == "0") {
        fnMsgAlert('info', 'FieldWorkAnalysis Report', 'Please Select The UserType Name .');
        return false;
    }

    if (!$("input[name='mode']").is(":checked")) {
        fnMsgAlert('info', 'FieldWorkAnalysis Report', 'Please Select the Mode type .');
        return false;
    }

    $.blockUI();
    var userCode = $("#hdnUserCode_" + rowIndex).val();
    var month = $('#txtMonth').val().split('-')[0];
    var year = $('#txtMonth').val().split('-')[1];
    var mode = $("input[type='radio'][name='mode']:checked").val();
    var userTypeName = $('option:selected', $('#drpUserType')).text();

    $("#dvFWAnalysisReport").html('');

    $.ajax({
        type: "POST",
        url: '../HiDoctor_Reports/ArchiveReport/GetChildUserDetails',
        data: "userCode=" + userCode + "&month=" + month + "&year=" + year + "&mode=" + mode + "",
        success: function (tableContent) {
            $("#dvFWAnalysisReport").html(tableContent);

            $("#MaindivPrint").html($("#FWAMainreport").html());
            //enabling datatable
            if ($.fn.dataTable) {
                $('#tblFWAReport').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            };

            fninializePrint("MaindivPrint", "MainifrmPrint", "FWAMainreport");

            $.unblockUI();
        },
        error: function (jsData) {
            $.unblockUI();
        },
        complete: function (jsData) {
            $.unblockUI();
        }
    });
}

//function to bind the FwAdayworked analysis report//
function fnGetFWADayWorkedAnalysis(rowIndex) {
    $.blockUI();
    var userCode = $("#hdnUserCode_" + rowIndex).val();
    var month = $('#txtMonth').val().split('-')[0];
    var year = $('#txtMonth').val().split('-')[1];
    var mode = $("input[type='radio'][name='mode']:checked").val();
    var userTypeName = $('option:selected', $('#drpUserType')).text();

    //to remove and rebind the table
    $("#dv_FieldWorkAnalysis_DayAnalysis").remove('');
    $('#tbl_FieldWorkAnalysis_DayAnalysis_wrapper').remove()

    $.ajax({
        url: '../HiDoctor_Reports/ArchiveReport/GetDaysWorkeddDtails',
        type: "POST",
        data: "userCode=" + userCode + "&month=" + month + "&year=" + year + "&mode=" + mode + "&userTypeName=" + userTypeName + "",
        success: function (response) {
            $("#dvFWAnalysisReport").append("<div style='clear:both'></div><br />");

            $("#dvFWAnalysisReport").append(response.split('*')[0]);
            $("#dvFWAnalysisReport").append("<br />");
            $("#dvFWAnalysisReport").append(response.split('*')[1]);
            $("#DaysWorkeddivPrint").html($("#daysWorked").html());
            if ($.fn.dataTable) {
                $('#tbl_FieldWorkAnalysis_DayAnalysis').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            };
            fninializePrint("DaysWorkeddivPrint", "DaysWorkedfrmPrint", "daysWorked");

            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

//Sub Report Doctor CAll Analysis bindind//
function fnGetFWADoctorCallAnalysis(rowIndex) {
    $.blockUI();
    var userCode = $("#hdnUserCode_" + rowIndex).val();
    var month = $('#txtMonth').val().split('-')[0];
    var year = $('#txtMonth').val().split('-')[1];
    var mode = $("input[type='radio'][name='mode']:checked").val();
    var userTypeName = $('option:selected', $('#drpUserType')).text();

    $("#spnDocCallAnalyHeader").remove()
    $('#tbl_FWADoctorCallAnanlysis_wrapper').remove();

    $.ajax({
        url: '../HiDoctor_Reports/ArchiveReport/FWGetDoctorCallAnalysisdetails',
        type: "POST",
        data: "userCode=" + userCode + "&month=" + month + "&year=" + year + "&mode=" + mode + "&userTypeName=" + userTypeName + "",
        success: function (response) {
            $("#dvFWAnalysisReport").append("<div style='clear:both'></div><br />");
            $("#dvFWAnalysisReport").append(response.split('*')[0]);
            $("#dvFWAnalysisReport").append("<br />");
            $("#dvFWAnalysisReport").append(response.split('*')[1]);
            $("#DrcallAnalysisdivPrint").html($("#DrCallanalysis").html());
            if ($.fn.dataTable) {
                $('#tbl_FWADoctorCallAnanlysis').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            };
            fninializePrint("DrcallAnalysisdivPrint", "DrcallAnalysisfrmPrint", "DrCallanalysis");
            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });

}

//Field Work Chemist met Analysis report//
function fnGetChemistCallAnalysis(rowIndex) {
    $.blockUI();
    var userCode = $("#hdnUserCode_" + rowIndex).val();
    var month = $('#txtMonth').val().split('-')[0];
    var year = $('#txtMonth').val().split('-')[1];
    var mode = $("input[type='radio'][name='mode']:checked").val();
    var userTypeName = $('option:selected', $('#drpUserType')).text();

    $("#spnChemistHeader").remove()
    $('#tbl_ChemistMetAnalysis_wrapper').remove();

    $.ajax({
        url: '../HiDoctor_Reports/ArchiveReport/FWGetChemistCallAnalysis',
        type: "POST",
        data: "userCode=" + userCode + "&month=" + month + "&year=" + year + "&mode=" + mode + "&userTypeName=" + userTypeName + "",
        success: function (response) {
            $("#dvFWAnalysisReport").append("<div style='clear:both'></div><br />");
            $("#dvFWAnalysisReport").append(response.split('*')[0]);
            $("#dvFWAnalysisReport").append("<br />");
            $("#dvFWAnalysisReport").append(response.split('*')[1]);
            $("#DrchemistdivPrint").html($("#ChemistMetAnalysis").html());
            if ($.fn.dataTable) {
                $('#tbl_ChemistMetAnalysis').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            };
            fninializePrint("DrchemistdivPrint", "DrchemistfrmPrint", "ChemistMetAnalysis");

            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

//Doctor visit frequency analysis report
function fnGetFWADoctorVisitsFrequencyAnalysisReport(rowIndex) {
    $.blockUI();
    var userCode = $("#hdnUserCode_" + rowIndex).val();
    var month = $('#txtMonth').val().split('-')[0];
    var year = $('#txtMonth').val().split('-')[1];
    var mode = $("input[type='radio'][name='mode']:checked").val();
    var userTypeName = $('option:selected', $('#drpUserType')).text();

    $("#spndoctorVisitfreqHeader").remove();
    $('#tbl_FWADoctorvisitAnanlysis_wrapper').remove();
    $("#colonmDefini").remove();

    $.ajax({
        url: '../HiDoctor_Reports/ArchiveReport/FWGetVisitsFrequencyAnalysis',
        type: "POST",
        data: "userCode=" + userCode + "&month=" + month + "&year=" + year + "&mode=" + mode + "&userTypeName=" + userTypeName + "",
        success: function (response) {
            $("#dvFWAnalysisReport").append("<div style='clear:both'></div><br />");
            $("#dvFWAnalysisReport").append(response.split('*')[0]);
            $("#dvFWAnalysisReport").append("<br />");
            $("#dvFWAnalysisReport").append(response.split('*')[1]);
            $("#DrvisitdivPrint").html($("#DoctorVisitsFrequncy").html());
            if ($.fn.dataTable) {
                $('#tbl_FWADoctorvisitAnanlysis').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            };
            fninializePrint("DrvisitdivPrint", "DrvisitfrmPrint", "DoctorVisitsFrequncy");

            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });

}

//Doctor Call Analysis Popupstart//
function fntotalApprovedDoctorspopup(val, obj) {
    $.blockUI();
    var id = obj.id;

    $.ajax({
        url: '../HiDoctor_Reports/ArchiveReport/GetDoctorDetailPopup',
        type: "POST",
        data: "userCode=" + val.split('_')[0] + "&category=" + val.split('_')[1] + "&month=" + val.split('_')[2] + "&year=" + val.split('_')[3],
        success: function (response) {
            $("#divModel").html(response);

            var header = val.split('_')[4];
            $("#popheader").html(header);
            $("#DrdetailPopupdivPrint").html($("#DrdetailPopup").html());
            $("#dvOverlay").overlay().load();

            //if ($.fn.dataTable) {
            //    $('#tbl_ApprovedDoctorDetails').dataTable({
            //        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
            //    });
            //};
            $("#DrdetailPopup").html(response);
            fninializePrint("DrdetailPopupdivPrint", "DrdetailPopupfrmPrint", "DrdetailPopup");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}
function fntotallistedDrs(val, obj) {
    $.blockUI();
    var id = obj.id;

    $.ajax({
        url: '../HiDoctor_Reports/ArchiveReport/GetlistedDoctorDetailPopup',
        type: "POST",
        data: "userCode=" + val.split('_')[0] + "&category=" + val.split('_')[1] + "&month=" + val.split('_')[2] + "&year=" + val.split('_')[3],
        success: function (response) {
            $("#divModel").html(response);

            var header = val.split('_')[4];
            $("#popheader").html(header);
            $("#listedDrPopupdivPrint").html($("#dvlistedDrpopup").html());
            //$("#modal").show();
            $("#dvOverlay").overlay().load();
            if ($.fn.dataTable) {
                $('#tbl_ApprovedDoctorDetails').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            };
            fninializePrint("listedDrPopupdivPrint", "listedDrPopupfrmPrint", "dvlistedDrpopup");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

//Frquency PopUp
function fnFrequencyPopUp(val, obj) {
    $.blockUI();
    var id = obj.id;

    $.ajax({
        url: '../HiDoctor_Reports/ArchiveReport/GetlistedDrFreqAchievedPop',
        type: "POST",
        data: "userCode=" + val.split('_')[0] + "&category=" + val.split('_')[1] + "&month=" + val.split('_')[2] + "&year=" + val.split('_')[3] + "&CategoryName=" + val.split('_')[4],
        success: function (response) {
            $("#divModel").html(response);

            var header = val.split('_')[4];
            $("#popheader").html(header);

            $("#dvOverlay").overlay().load();
            $("#DrFreqPopupdivPrint").html($("#dvDrFreqpopup").html());
            //if ($.fn.dataTable) {
            //    $('#tbl_drFreqAchieved').dataTable({
            //        "bPaginate": false, "bSort": false, "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
            //    }).rowGrouping({ bExpandableGrouping: true, iGroupingColumnIndex: 7 });
            //};
            $("#dvDrFreqpopup").html(response);
            fninializePrint("DrFreqPopupdivPrint", "DrFreqpopupfrmPrint", "dvDrFreqpopup");


        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

function fnChemistPopup(val) {
    $.blockUI();
    $.ajax({
        url: '../HiDoctor_Reports/ArchiveReport/GetChemistDetailPopup',
        type: "POST",
        data: "userCode=" + val.split('_')[0] + "&month=" + val.split('_')[1] + "&year=" + val.split('_')[2] + "&entity=" + val.split('_')[3] + "&mode=" + val.split('_')[5],
        success: function (response) {
            $("#divModel").html(response);

            var header = val.split('_')[4];
            $("#popheader").html(header);
            $("#chemistdivPrint").html($("#dvChemistpopup").html());
            HideModalPopup("dvloading");
            $("#modal").show();
            if ($.fn.dataTable) {
                $('#tbl_ChemistDetails').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            };

            fninializePrint("chemistdivPrint", "chemistfrmPrint", "dvChemistpopup");
            $("#dvOverlay").overlay().load();
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}


//stockiest//

function fnstockiestPopup(val) {
    $.blockUI();
    $.ajax({
        url: '../HiDoctor_Reports/ArchiveReport/GetStockiestDetailPopup',
        type: "POST",
        data: "userCode=" + val.split('_')[0] + "&month=" + val.split('_')[1] + "&year=" + val.split('_')[2] + "&entity=" + val.split('_')[3] + "&mode=" + val.split('_')[5],
        success: function (response) {
            $("#divModel").html(response);

            var header = val.split('_')[4];
            $("#popheader").html(header);
            $("#stockiestdivPrint").html($("#dvStockiestpopup").html());
            $("#modal").show();
            if ($.fn.dataTable) {
                $('#tbl_stockDetails').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            };
            fninializePrint("stockiestdivPrint", "stockiestfrmPrint", "dvStockiestpopup");
            $("#dvOverlay").overlay().load();
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

function fnindependentPopup(val) {
    $.blockUI();
    $.ajax({
        url: '../HiDoctor_Reports/ArchiveReport/GetIndependentdrsDetailPopup',
        type: "POST",
        data: "userCode=" + val.split('_')[0] + "&month=" + val.split('_')[1] + "&year=" + val.split('_')[2] + "&entity=" + val.split('_')[3] + "&mode=" + val.split('_')[5],
        success: function (response) {
            var header = val.split('_')[4];
            $("#popheader").html(header);

            $("#divModel").html(response);

            $("#dvOverlay").overlay().load();
            $("#independentDrdivPrint").html($("#independentDr").html());
            if ($.fn.dataTable) {
                $('#tbl_independentDr').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            };
            fninializePrint("independentDrdivPrint", "independentDrfrmPrint", "independentDr");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

//Doctor Call Analysis Popup End//

//%days worked pop up started here
function fnDayanalysis(val) {
    $.blockUI();
    var userCode = val.split("~")[0];
    var month = val.split("~")[1];
    var year = val.split("~")[2];
    var reportType = val.split("~")[3];
    var rowIndex = val.split("~")[4];

    var userName = $("#tdUserName_" + rowIndex).html();
    var userTypeName = $("#tdUserTypeName_" + rowIndex).html();
    var regionName = $("#tdRegionName_" + rowIndex).html();

    $.ajax({
        url: '../HiDoctor_Reports/ArchiveReport/GetDaywiseAnalysis',
        type: "POST",
        data: "userCode=" + userCode + "&month=" + month + "&year=" + year + "&reportType=" + reportType + "",
        success: function (response) {

            $("#divModel").html(response);

            if (reportType == "FIELD_DAYS") {
                if ($.fn.dataTable) {
                    $('#FIELD_DAYS').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true
                    });
                };

                $("#popheader").html("Field Work Days Details of " + userName + " (" + userTypeName + ") | " + regionName + "");
            }
            else if (reportType == "NONFIELD_DAYS") {
                if ($.fn.dataTable) {
                    $('#NONFIELD_DAYS').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true
                    });
                };

                $("#popheader").html("Non-Field Work Days Details of " + userName + " (" + userTypeName + ") | " + regionName + "");
            }
            else if (reportType == "LEAVE") {
                if ($.fn.dataTable) {
                    $('#LEAVE').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true
                    });
                };

                $("#popheader").html("Leave Details of " + userName + " (" + userTypeName + ") | " + regionName + "");
            }
            else if (reportType == "HOLIDAY") {
                if ($.fn.dataTable) {
                    $('#HOLIDAY').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true
                    });
                };

                if ($.fn.dataTable) {
                    $('#HOLIDAY_WORKED').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true
                    });
                };

                $("#popheader").html("Holiday Details of " + userName + " (" + userTypeName + ") | " + regionName + "");
            }
            else if (reportType == "WEEKEND") {
                if ($.fn.dataTable) {
                    $('#WEEKEND').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true
                    });
                };
                if ($.fn.dataTable) {
                    $('#WEEKEND_WORKED').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true
                    });
                };
                $("#popheader").html("Weekend Details of " + userName + " (" + userTypeName + ") | " + regionName + "");
            }
            else if (reportType == "NO_REPORT_DAYS") {
                if ($.fn.dataTable) {
                    $('#NO_REPORT_DAYS').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true
                    });
                };

                $("#popheader").html("No reporting days details of " + userName + " (" + userTypeName + ") | " + regionName + "");
            }
            else if (reportType == "NOT_AVAIL_DAYS") {
                if ($.fn.dataTable) {
                    $('#NOT_AVAIL_DAYS').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true
                    });
                };

                $("#popheader").html("Not Available Days details of " + userName + " (" + userTypeName + ") | " + regionName + "");
            }
            else if (reportType == "STANDARED_WORK_DAYS") {
                if ($.fn.dataTable) {
                    $('#STANDARED_WORK_DAYS').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true
                    });
                };

                $("#popheader").html("Standared Work Days - details of " + userName + " (" + userTypeName + ") | " + regionName + "");
            }
            else if (reportType == "AVAIL_FIELD_DAYS") {
                if ($.fn.dataTable) {
                    $('#AVAIL_FIELD_DAYS').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true
                    });
                };

                $("#popheader").html("Available field days of " + userName + " (" + userTypeName + ") | " + regionName + "");
            }

            //$("#modal").show();
            $("#dvOverlay").overlay().load();
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}
//joint work report start//
function fnGetFWAJointFieldWorkAnalysisReport(rowIndex) {
    $.blockUI();
    var userCode = $("#hdnUserCode_" + rowIndex).val();
    var month = $('#txtMonth').val().split('-')[0];
    var year = $('#txtMonth').val().split('-')[1];
    var mode = $("input[type='radio'][name='mode']:checked").val();
    var userTypeName = $('option:selected', $('#drpUserType')).text();

    $("#dvJointWorkHeader").remove();
    $('#tbl_FWAjointWorkAnanlysis_wrapper').remove();

    $.ajax({
        url: '../HiDoctor_Reports/ArchiveReport/FWGetJointWorkAnalysis',
        type: "POST",
        data: "userCode=" + userCode + "&month=" + month + "&year=" + year + "&mode=" + mode + "&userTypeName=" + userTypeName + "",
        success: function (response) {
            $("#dvFWAnalysisReport").append("<div style='clear:both'></div><br />");
            $("#dvFWAnalysisReport").append(response.split('*')[0]);
            $("#dvFWAnalysisReport").append("<br />");
            $("#dvFWAnalysisReport").append(response.split('*')[1]);
            $("#DrjointdivPrint").html($("#JointFieldreport").html());
            if ($.fn.dataTable) {
                $('#tbl_FWAjointWorkAnanlysis').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            };
            fninializePrint("DrjointdivPrint", "DrjointfrmPrint", "JointFieldreport");

            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}
//joint work

//For Print
function fnPrint(divId, iFrameId) {
    try {
        var oIframe = document.getElementById(iFrameId);
        var oContent = document.getElementById(divId).innerHTML;
        var oDoc = (oIframe.contentWindow || oIframe.contentDocument);
        if (oDoc.document) oDoc = oDoc.document;
        oDoc.write("<html><head> <style media='all'>th, td{border-left:1px solid #000;border-top:1px solid #000;} table{border:1px solid #111;font-family:Arial;font-size:10px} </style> </head><body  onload='this.print();' this.print();'><center>");
        oDoc.write(oContent + "</center></body></html>");
        // oDoc.write("<html><head></head><body  onload='this.print();'><center>");
        // oDoc.write(oContent + "</center></body></html>");
        oDoc.close();
    }
    catch (e) {
        self.print();
    }
}

function fninializePrint(divId, iFrameId, mainDiv) {
    // $('#' + mainDiv + ' #dvPrint').remove();
    $("#" + mainDiv + " .TableTools").append("<div id='dvPrint' onclick='fnPrint(\"" + divId + "\",\"" + iFrameId + "\");' title='Print Table' class='TableTools_button' style='background: url(../Content/DataTable/media/images/print.png) no-repeat center center;border: 1px solid #f0f0f0;height: 30px; width: 30px;cursor:pointer;'></div>");
}


//Added Srisudhan//
//SubReport Fot //

//Radoi button Enable/Disable

function fnGetUnderChildUserCount() {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Reports/FWAnalysis/GetUnderChildUserCount',
        data: "userCode=" + $("#hdnUserCode").val() + "",
        success: function (count) {
            if (count == 1) {
                $("input[name=mode][value=1]").attr('checked', 'checked');
                $('input[type=radio][name=mode]').prop('disabled', true);
            }
            else {
                $('input[type=radio][name=mode]').prop('disabled', false);
            }
        }
    });
}

//DayWorked Analysis Report//


function fnGetDayWorkedAnalysiscals() {
    if ($("#txtMonth").val() == "") {
        fnMsgAlert('info', 'DaysWorkedAnalysis Report', 'Please Select The Month');
        return false;
    }

    if (!$("input[name='mode']").is(":checked")) {
        fnMsgAlert('info', 'DaysWorkedAnalysis Report', 'Please Select the Mode type .');
        return false;
    }

    $.blockUI();
    var userCode = $("#hdnUserCode").val()
    var month = $('#txtMonth').val().split('-')[0];
    var year = $('#txtMonth').val().split('-')[1];
    var mode = $("input[type='radio'][name='mode']:checked").val();
    var usertitle = $("#hdnUserUsertypeName").val();
    var userTypeName = usertitle.split(",")[1];


    //to remove and rebind the table
    $("#dv_FieldWorkAnalysis_DayAnalysis").remove('');
    $('#tbl_FieldWorkAnalysis_DayAnalysis_wrapper').remove()

    $.ajax({
        url: '../HiDoctor_Reports/ArchiveReport/GetDaysWorkeddDtails',
        type: "POST",
        data: "userCode=" + userCode + "&month=" + month + "&year=" + year + "&mode=" + mode + "&userTypeName=" + userTypeName + "",
        success: function (response) {
            $("#daysWorked").append("<div style='clear:both'></div><br />");

            $("#daysWorked").append(response.split('*')[0]);
            $("#daysWorked").append("<br />");
            $("#daysWorked").append(response.split('*')[1]);
            $("#DaysWorkeddivPrint").html($("#daysWorked").html());
            if ($.fn.dataTable) {
                $('#tbl_FieldWorkAnalysis_DayAnalysis').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            };
            fninializePrint("DaysWorkeddivPrint", "DaysWorkedfrmPrint", "daysWorked");

            $.unblockUI();
        },

        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

//Sub report Doctor Call Analysis //
function fnGetDoctorCallAnalysiscals() {
    if ($("#txtMonth").val() == "") {
        fnMsgAlert('info', 'Doctor Call Analysis Report', 'Please Select The Month');
        return false;
    }

    if (!$("input[name='mode']").is(":checked")) {
        fnMsgAlert('info', 'Doctor Call Analysis Report', 'Please Select the Mode type .');
        return false;
    }

    $.blockUI();
    var userCode = $("#hdnUserCode").val()
    var month = $('#txtMonth').val().split('-')[0];
    var year = $('#txtMonth').val().split('-')[1];
    var mode = $("input[type='radio'][name='mode']:checked").val();
    var usertitle = $("#hdnUserUsertypeName").val();
    var userTypeName = usertitle.split(",")[1];

    $("#spnDocCallAnalyHeader").remove()
    $('#tbl_FWADoctorCallAnanlysis_wrapper').remove();

    $.ajax({
        url: '../HiDoctor_Reports/ArchiveReport/FWGetDoctorCallAnalysisdetails',
        type: "POST",
        data: "userCode=" + userCode + "&month=" + month + "&year=" + year + "&mode=" + mode + "&userTypeName=" + userTypeName + "",
        success: function (response) {
            $("#dvdoctorcall").append("<div style='clear:both'></div><br />");
            $("#dvdoctorcall").append(response.split('*')[0]);
            $("#dvdoctorcall").append("<br />");
            $("#dvdoctorcall").append(response.split('*')[1]);
            $("#DrcallAnalysisdivPrint").html($("#dvdoctorcall").html());
            if ($.fn.dataTable) {
                $('#tbl_FWADoctorCallAnanlysis').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            };
            fninializePrint("DrcallAnalysisdivPrint", "DrcallAnalysisfrmPrint", "DrCallanalysis");
            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });

}


//Sub report JointWorkAnalysiscals //

function fnGetJointWorkAnalysiscals() {

    if ($("#txtMonth").val() == "") {
        fnMsgAlert('info', 'Joint Work Analysis Report', 'Please Select The Month');
        return false;
    }
    if (!$("input[name='mode']").is(":checked")) {
        fnMsgAlert('info', 'Joint Work Analysis Report', 'Please Select the Mode type .');
        return false;
    }
    $.blockUI();
    var userCode = $("#hdnUserCode").val()
    var month = $('#txtMonth').val().split('-')[0];
    var year = $('#txtMonth').val().split('-')[1];
    var mode = $("input[type='radio'][name='mode']:checked").val();
    var usertitle = $("#hdnUserUsertypeName").val();
    var userTypeName = usertitle.split(",")[1];

    $("#dvJointWorkHeader").remove();
    $('#tbl_FWAjointWorkAnanlysis_wrapper').remove();

    $.ajax({
        url: '../HiDoctor_Reports/ArchiveReport/FWGetJointWorkAnalysis',
        type: "POST",
        data: "userCode=" + userCode + "&month=" + month + "&year=" + year + "&mode=" + mode + "&userTypeName=" + userTypeName + "",
        success: function (response) {
            $("#jointWorked").append("<div style='clear:both'></div><br />");
            $("#jointWorked").append(response.split('*')[0]);
            $("#jointWorked").append("<br />");
            $("#jointWorked").append(response.split('*')[1]);
            $("#DrjointdivPrint").html($("#jointWorked").html());
            if ($.fn.dataTable) {
                $('#tbl_FWAjointWorkAnanlysis').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            };
            fninializePrint("DrjointdivPrint", "DrjointfrmPrint", "JointFieldreport");

            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

//Sub report chemist met analysis//


function fnGetChemistAnalysiscals() {
    if ($("#txtMonth").val() == "") {
        fnMsgAlert('info', 'Chemist Met Analysis Report', 'Please Select The Month');
        return false;
    }

    if (!$("input[name='mode']").is(":checked")) {
        fnMsgAlert('info', 'Chemist Met Analysis Report', 'Please Select the Mode type .');
        return false;
    }

    $.blockUI();
    var userCode = $("#hdnUserCode").val();
    var month = $('#txtMonth').val().split('-')[0];
    var year = $('#txtMonth').val().split('-')[1];
    var mode = $("input[type='radio'][name='mode']:checked").val();
    var usertitle = $("#hdnUserUsertypeName").val();
    var userTypeName = usertitle.split(",")[1];

    $("#spnChemistHeader").remove()
    $('#tbl_ChemistMetAnalysis_wrapper').remove();

    $.ajax({
        url: '../HiDoctor_Reports/ArchiveReport/FWGetChemistCallAnalysis',
        type: "POST",
        data: "userCode=" + userCode + "&month=" + month + "&year=" + year + "&mode=" + mode + "&userTypeName=" + userTypeName + "",
        success: function (response) {
            $("#dvchemistmet").append("<div style='clear:both'></div><br />");
            $("#dvchemistmet").append(response.split('*')[0]);
            $("#dvchemistmet").append("<br />");
            $("#dvchemistmet").append(response.split('*')[1]);
            $("#DrchemistdivPrint").html($("#dvchemistmet").html());
            if ($.fn.dataTable) {
                $('#tbl_ChemistMetAnalysis').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            };
            fninializePrint("DrchemistdivPrint", "DrchemistfrmPrint", "ChemistMetAnalysis");

            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}


//Sub Drfrequency report


function fnGetDrvisitFrequencyAnalysiscals() {

    $('#tree').hide();
    $("#spnTreeToggle").html('Show Tree');
    $('#leftNav').removeClass('col-xs-5');
    $('#leftNav').removeClass('col-xs-4');
    $('#leftNav').removeClass('col-xs-3');
    $("#divMain").removeClass('col-xs-9');
    $("#divMain").removeClass('col-xs-8');
    $("#divMain").removeClass('col-xs-7');
    $("#divMain").addClass('col-xs-11');

    //Hide all divs   
    $("#aExpandCollapse").html("Collapse All");
    $("#aExpandCollapse").html("Collapse All");
    // $("#divuserperday").hide();
    $("#dvDrvisitfrequency").hide();
    // $("#dvPrint").hide();

    //Clear All the Fields
    // $("#dvUserPerDayCont").empty();
    $("#dvDrvisitfrequency").html('');
    $("#dvPrint").empty();

    if ($("#txtMonth").val() == "") {
        fnMsgAlert('info', 'Dr Visit Frequency Analysis Report', 'Please Select The Month');
        return false;
    }
    if (!$("input[name='mode']").is(":checked")) {
        fnMsgAlert('info', 'Dr Visit Frequency Analysis Report', 'Please Select the Mode type .');
        return false;
    }
    $.blockUI();

    var userCode = $("#hdnUserCode").val();
    var month = $('#txtMonth').val().split('-')[0];
    var year = $('#txtMonth').val().split('-')[1];
    var mode = $("input[type='radio'][name='mode']:checked").val();
    var usertitle = $("#hdnUserUsertypeName").val();
    var userTypeName = usertitle.split(",")[1];

    $("#spndoctorVisitfreqHeader").remove();
    $('#tbl_FWADoctorvisitAnanlysis_wrapper').remove();
    $("#colonmDefini").remove();
    $('#dvRptQueuePanel').show();
    $('#dvRptPanel').hide();
    $('#dvAsynMsg').show();
    $('#dvAsynReport').html("");
    $('#dvAsynMsg').html("");
    $("#dvTree").hide();
    $("#spnTreeToggle").html('Show Tree');
    $("#divInput").slideUp();
    $("#spnInputToggle").html("Show Input");
    $.ajax({
        url: '../HiDoctor_Reports/ArchiveReport/ProcessDoctorVisitsFACalciReport',
        type: "POST",
        data: "userCode=" + userCode + "&month=" + month + "&year=" + year + "&mode=" + mode + "&userTypeName=" + userTypeName + "",
        success: function (response) {
            $('#dvAsynMsg').html('Report submitted for processing...Trasaction Reference Number:' + response);
            fnGetAsynReportstatus('DoctorVisitsFACalciReport');
            if ($.fn.dataTable) {
                $('#tbl_FWADoctorvisitAnanlysis').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip'
                });
            };
            //fninializePrint("DrvisitdivPrint", "DrvisitfrmPrint", "DoctorVisitsFrequncy");

            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });

}


