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
        url: '../HiDoctor_Reports/AysncReports/ProcessComprehensiveAnalysisReport',
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


    var quantity = $('input:radio[name=Quantity]:checked').val();
    /*if (quanity == "2") {
        quanity = "";
    }*/
    var viewFormat = $("input[name='rptOptions']:checked").val();

    if (productSelection == "") {
        fnMsgAlert("info", "Information", "Please Select Mode to group by");
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

    //if (selectedval != "") {
    //    selectedval = selectedval.substring(0, selectedval.length - 1);
    //}
    if (selectedval == "") {
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
        data: "userCode=" + selKeys + "&startDate=" + startDate + "&endDate=" + endDate + "&productSelection=" + productSelection + "&dcrStatus=" + selectedval + "&quantity=" + quantity,
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
        else{
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


