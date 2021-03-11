var lastSubmittedData_g = "";
var regionType_g = "";
var tableDesign_g = "";
function fnGetLastSubmittedData() {
    ShowModalPopup("dvloading");
    var nodeVal = $('#hdnRegionCode').val();
    var regionCode = nodeVal.split('_')[0];
    var startMonth = fngetMonthNumber($('#txtFromDate').val().split('-')[0]);
    var endMonth = fngetMonthNumber($('#txtToDate').val().split('-')[0]);
    var startYear = $('#txtToDate').val().split('-')[1];
    var endYear = $('#txtToDate').val().split('-')[1];
    var firstLevel = $('#ddlLevelOneGroup').val();
    var secondLevel = $('#ddlLevelTwoGroup').val();
    var regionTypeCode = "";
    for (var i = 0; i < $('#ddlLevelTwoGroup')[0].options.length; i++) {
        if (i >= $('#ddlLevelOneGroup')[0].options.selectedIndex && i <= $('#ddlLevelTwoGroup')[0].options.selectedIndex) {
            regionTypeCode += $('#ddlLevelTwoGroup')[0].options[i].value + "^";
        }
    }
    if (regionTypeCode.length == 0) {
        fnMsgAlert('info', 'Last Submitted Report ', 'Invalid region level wise.');
        HideModalPopup("dvloading");
        return false;
    }
    var category = $('#ddlCategory').val();

    $.ajax({
        type: "POST",
        url: '../HiDoctor_Reports/Reports/GetLastSubmittedData',
        data: "startMonth=" + startMonth + "&endMonth=" + endMonth + "&startYear=" + startYear + "&endYear=" + endYear + "&regionCode=" + regionCode + "&firstLevel=" + firstLevel + "&secondLevel=" + secondLevel + "&category=" + category + "&regionTypeCode=" + regionTypeCode,
        success: function (lastSubmiitedData) {
            var tableContent = "";


            if (lastSubmiitedData != null && lastSubmiitedData.length > 0) {
                lastSubmittedData_g = eval('(' + lastSubmiitedData + ')');
            }
            tableContent += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblLastsubmitted' style='border:1px solid #f0f0f0' >";
            tableContent += "<thead>";
            tableContent += "<tr style='display: none;' id='tblTr'>";
            tableContent += "<th>Employee Number</th>";
            tableContent += "<th>Designation</th>";
            tableContent += "<th>User name</th>";
            tableContent += "<th>Employee Name</th>";
            tableContent += "<th>Reporting manager</th>";
            tableContent += "<th>Region (Reporting Manager)</th>";
            tableContent += "<th>Region (Self)</th>";
            tableContent += "<th>Active Period From</th>";
            tableContent += "<th>Active Period To</th>";
            tableContent += "<th>DCR Last submitted</th>";
            tableContent += "<th>No. Of RCPA done</th>";
            tableContent += "<th>Doctor 0 Visit</th>";
            tableContent += "<th>Doctor 1 Visit</th>";
            tableContent += "<th>2 Visit</th>";
            tableContent += "<th>3 Visit</th>";
            tableContent += "<th>More than 3</th>";
            tableContent += "<th>Doctors Met</th>";
            tableContent += "<th>Doctors Calls</th>";
            tableContent += "<th>Doctor Call Avg</th>";
            tableContent += "<th>Chemist PoB</th>";
            tableContent += "<th>Field Working Days</th>";
            tableContent += "<th>Attendance</th>";
            tableContent += "<th>Leave</th>";
            tableContent += "<th>Sundays</th>";
            tableContent += "<th>Holidays</th>";
            tableContent += "<th>Stockist PoB</th>";
            tableContent += "</tr >";
            var type = '[{ type: "text" }, { type: "text" }, { type: "text" }, { type: "text" }, { type: "text" },{ type: "text" },{ type: "text" },{ type: "date-range" },{ type: "date-range" },{ type: "text" },{ type: "number-range" },{ type: "number-range" },{ type: "number-range" }';
            type += ',{ type: "number-range" },{ type: "number-range" },{ type: "number-range" },{ type: "number-range" },{ type: "number-range" },{ type: "number-range" },{ type: "number-range" },{ type: "number-range" },{ type: "number-range" },{ type: "number-range" },{ type: "number-range" },{ type: "number-range" },{ type: "number-range" }]';
            tableContent += "<tr >";
            tableContent += "<th>Employee Number</th>";
            tableContent += "<th>Designation</th>";
            tableContent += "<th>User name</th>";
            tableContent += "<th>Employee Name</th>";
            tableContent += "<th>Reporting manager</th>";
            tableContent += "<th>Region (Reporting Manager)</th>";
            tableContent += "<th>Region (Self)</th>";
            tableContent += "<th>Active Period From</th>";
            tableContent += "<th>Active Period To</th>";
            tableContent += "<th>DCR Last submitted</th>";
            tableContent += "<th>No. Of RCPA done</th>";
            tableContent += "<th>Doctor 0 Visit</th>";
            tableContent += "<th>Doctor 1 Visit</th>";
            tableContent += "<th>2 Visit</th>";
            tableContent += "<th>3 Visit</th>";
            tableContent += "<th>More than 3</th>";
            tableContent += "<th>Doctors Met</th>";
            tableContent += "<th>Doctors Calls</th>";
            tableContent += "<th>Doctor Call Avg</th>";
            tableContent += "<th>Chemist PoB</th>";
            tableContent += "<th>Field Working Days</th>";
            tableContent += "<th>Attendance</th>";
            tableContent += "<th>Leave</th>";
            tableContent += "<th>Sundays</th>";
            tableContent += "<th>Holidays</th>";
            tableContent += "<th>Stockist PoB</th>";
            tableContent += "</tr >";
            tableContent += "<th colspan= '26' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreea()'>Show Filter</span></th>";
            tableContent += "</thead>";

            for (var i = 0; i < lastSubmittedData_g.Tables[0].Rows.length; i++) {
                var data = lastSubmittedData_g.Tables[0].Rows[i];
                var empNo = data.EmpNo;
                var desg = data.Desigination;
                var userName = data.User_Name;
                var empName = data.Employee_Name;
                var manager = data.Manager;
                var manager_region = data.Manager_Region;
                var region_self = data.Region;
                // var active_period_from = data.Action_Period_From == null ? "" : data.Action_Period_From;
                var active_period_end = data.Action_Period_End == null ? "" : data.Action_Period_End;
                var dcrLastSubmitted = data.LastSubmitted == null ? "" : data.LastSubmitted;
                var no_of_RCAP_done = data.No_of_RCPA_Done == null ? "0" : data.No_of_RCPA_Done;
                var doc_0_visit = data.Doctor_0_Visit == null ? "0" : data.Doctor_0_Visit;
                var doc_1_visit = data.Doctor_1_Visit == null ? "0" : data.Doctor_1_Visit;
                var doc_2_visit = data.Doctor_2_Visit == null ? "0" : data.Doctor_2_Visit;
                var doc_3_visit = data.Doctor_3_Visit == null ? "0" : data.Doctor_3_Visit;
                var doc_visit_exceed = data.More_than_3 == null ? "0" : data.More_than_3;
                var doctors_met = data.Doctors_Met == null ? "0" : data.Doctors_Met;
                var doc_calls = data.Doctors_Calls == null ? "0" : data.Doctors_Calls;
                var doc_call_avg = data.Doctors_Calls == null ? "0" : data.Doctors_Calls;
                var chemist_pob = data.Chemist_POB == null ? "0" : data.Chemist_POB;
                var field_working_days = data.Field_Working_Days == null ? "0" : data.Field_Working_Days;
                var attendance_count = data.Attendance_Days == null ? "0" : data.Attendance_Days;
                var leave_count = data.Leave_Days == null ? "0" : data.Leave_Days;
                var sundays_count = data.Sundays == null ? "0" : data.Sundays;
                var holidays_count = data.Holidays == null ? "0" : data.Holidays;
                var stockiest_pob = data.Stockiest_POB == null ? "0" : data.Stockiest_POB;
                var style = "";
                if ($('#ddlLevelOneGroup').val() == data.Region_Type_Code) {
                    style = "style='background-color:lightblue;text-align:center'";
                    tableContent += "<tr style='background-color:#f5f5f9 !important'>";
                }
                else {
                    style = "style='text-align:center'";
                    tableContent += "<tr>";
                }

                tableContent += "<td " + style + ">" + empNo + "</td>";
                tableContent += "<td " + style + ">" + desg + "</td>";
                tableContent += "<td " + style + "><a href='#' onclick='fnRedirectToDCRConsolidatedReprot(\"" + data.User_Code + "\")'>" + userName + "</a></td>";
                tableContent += "<td " + style + ">" + empName + "</td>";
                tableContent += "<td " + style + ">" + manager + "</td>";
                tableContent += "<td " + style + ">" + manager_region + "</td>";
                tableContent += "<td " + style + ">" + region_self + "</td>";
                tableContent += "<td " + style + ">" + data.Action_Period_From + "</td>";
                tableContent += "<td " + style + ">" + active_period_end + "</td>";
                tableContent += "<td " + style + ">" + dcrLastSubmitted + "</td>";
                tableContent += "<td " + style + " >" + no_of_RCAP_done + "</td>";
                tableContent += "<td  " + style + " >" + doc_0_visit + "</td>";
                tableContent += "<td " + style + " style='text-align:center'>" + doc_1_visit + "</td>";
                tableContent += "<td  " + style + " style='text-align:center'>" + doc_2_visit + "</td>";
                tableContent += "<td  " + style + " style='text-align:center'>" + doc_3_visit + "</td>";
                tableContent += "<td  " + style + " style='text-align:center'>" + doc_visit_exceed + "</td>";
                tableContent += "<td  " + style + " style='text-align:center'>" + doctors_met + "</td>";
                tableContent += "<td  " + style + " style='text-align:center'>" + doc_calls + "</td>";
                tableContent += "<td  " + style + " style='text-align:center'>" + doc_call_avg + "</td>";
                tableContent += "<td  " + style + " style='text-align:center'>" + chemist_pob + "</td>";
                tableContent += "<td " + style + " style='text-align:center'>" + field_working_days + "</td>";
                tableContent += "<td " + style + "  style='text-align:center'>" + attendance_count + "</td>";
                tableContent += "<td  " + style + " style='text-align:center'>" + leave_count + "</td>";
                tableContent += "<td " + style + " style='text-align:center'>" + sundays_count + "</td>";
                tableContent += "<td  " + style + " style='text-align:center'>" + holidays_count + "</td>";
                tableContent += "<td  " + style + " style='text-align:center'>" + stockiest_pob + "</td>";
            }
            tableContent += "</table>";
            tableDesign_g = tableContent;
            $('#divReport').html(tableDesign_g);
            $("#divPrint").html(tableDesign_g);
            var jsonType = eval(type);
            //if ($.fn.dataTable) { $('.datatable').dataTable({ "sPaginationType": "full_numbers" }); };
            if ($.fn.dataTable) {
                $.datepicker.regional[""].dateFormat = 'dd/mm/yy';
                $.datepicker.setDefaults($.datepicker.regional['']);
                $('#tblLastsubmitted').dataTable({
                    "sPaginationType": "full_numbers", "bSort": false, "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                }).dataTable().columnFilter({
                    sPlaceHolder: "head:after",
                    aoColumns: jsonType
                });
            };
            fninializePrint("divPrint", "ifrmPrint", "divReport");
            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }

    });
}


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

function fnRedirectToDCRConsolidatedReprot(userCode) {
    var startMonth = fngetMonthNumber($('#txtFromDate').val().split('-')[0]);
    var endMonth = fngetMonthNumber($('#txtToDate').val().split('-')[0]);
    var startYear = $('#txtToDate').val().split('-')[1];
    var endYear = $('#txtToDate').val().split('-')[1];
    //var startDate = startYear + '-' + startMonth + '-' + '01';
    var startDate = '01' + '/' + startMonth + '/' + startYear;
    var endDate = new Date(endYear, endMonth, 0).getDate() + '/' + endMonth + '/' + endYear;
    //var endDate = endYear + '-' + endMonth + '-' + new Date(endYear, endMonth, 0).getDate();
    $('#main').load('../HiDoctor_Reports/Reports/DCRConsolidatedReport/?userCode=' + userCode + '&fromDate=' + startDate + '&toDate=' + endDate);

}

function fnRedirectToRCPA(userCode) {
    var startMonth = fngetMonthNumber($('#txtFromDate').val().split('-')[0]);
    var endMonth = fngetMonthNumber($('#txtToDate').val().split('-')[0]);
    var startYear = $('#txtToDate').val().split('-')[1];
    var endYear = $('#txtToDate').val().split('-')[1];
    //var startDate = startYear + '-' + startMonth + '-' + '01';
    var startDate = '01' + '/' + startMonth + '/' + startYear;
    var endDate = new Date(endYear, endMonth, 0).getDate() + '/' + endMonth + '/' + endYear;
    //var endDate = endYear + '-' + endMonth + '-' + new Date(endYear, endMonth, 0).getDate();
    $('#main').load('../HiDoctor_Reports/Reports/DCRConsolidatedReport/?user_Code=' + userCode + '&fromDate=' + startDate + '&toDate=' + endDate);

}

// DOCTOR WISE PRODUCT REPORT
function fnBindRegionTypeName1() {
    var nodeVal = $('#hdnRegionCode').val();
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetChildRegionType',
        data: "regionCode=" + nodeVal.split('_')[0],
        success: function (response) {
            var tableContent = "";
            jsData = eval('(' + response + ')');
            regionType_g = jsData;
            $('option', $("#ddlLevelOneGroup")).remove();
            $('option', $("#ddlLevelTwoGroup")).remove();
            if (jsData.Tables[0].Rows.length > 0) {
                for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                    $("#ddlLevelOneGroup").append(new Option(jsData.Tables[0].Rows[i].Region_Type_Name, jsData.Tables[0].Rows[i].Region_Type_Code, false, false));
                    $("#ddlLevelTwoGroup").append(new Option(jsData.Tables[0].Rows[i].Region_Type_Name, jsData.Tables[0].Rows[i].Region_Type_Code, false, false));
                }
            }
            if (jsData.Tables[1].Rows.length > 0) {
                for (var j = 0; j < jsData.Tables[0].Rows.length; j++) {
                    $("#ddlCategory").append(new Option(jsData.Tables[1].Rows[j].Category_Name, jsData.Tables[1].Rows[j].Category_Code, false, false));
                }
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
        }
    });
}

///          LAST Submitted Calci  fields


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

    $("#divInput").slideUp();
    $("#spnInputToggle").html("Show Input");
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/LastsubmittedCalcifieldArchiveReport/GetLastSubmittedReportCalci',
        data: 'userCode=' + userCode + '&month=' + month + '&year=' + year + '&type=' + unlistedDoctor + '&selectionType=' + DCRDate + '&title=' + $("#divPageHeader").html() + '&missed=' + doctorMissed + '&reportViewType=' + reportViewType + '&childUsersCount=' + JSON.stringify(arrUserandChildcount_g),
        success: function (response) {
            $("#divReport").html('');
            if (response != "") {
                $("#divReport").html(response);
                if (response != "") {
                    $("#divInput").slideUp();
                    $("#spnInputToggle").html("Show Input");
                    $('#dvTablePrint').hide();
                }
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
    $("#divInput").slideUp();
    $("#spnInputToggle").html("Show Input");
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/LastsubmittedCalcifieldArchiveReport/GetLastSubmittedReportCalci',
        data: 'userCode=' + userCode + '&month=' + month + '&year=' + year + '&type=' + unlistedDoctor + '&selectionType=' + DCRDate + '&title=' + $("#divPageHeader").html() + '&missed=' + doctorMissed + '&reportViewType=' + reportViewType + '&childUsersCount=' + JSON.stringify(arrUserandChildcount_g),
        success: function (response) {
            $("#divReport").html('');
            if (response != "") {
                $("#divReport").html(response);
                if (response != "") {
                    $("#divInput").slideUp();
                    $("#spnInputToggle").html("Show Input");
                    $('#dvTablePrint').hide();
                }
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


function fnLeaveDetailPopUp(details) {
    ShowModalPopup("dvloading");

    $("#dvTree").hide();
    $('#divInput').show();
    $("#spnTreeToggle").html('Show Tree');
    $('#divToggle').show();
    $("#divMain").css('width', '100%');
    var DCRDate = $('input:radio[name=UnDCRDate]:checked').val();
    var leavetypeCode = details.split('_')[0];
    var userCode = details.split('_')[1];
    var startDate = details.split('_')[2];
    var endDate = details.split('_')[3];
    var regionCode = details.split('_')[4];
    var leaveTypeName = details.split('_')[5];

    $("#divInput").slideUp();
    $("#divModel").html('');
    $("#spnInputToggle").html("Show Input");
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/LastsubmittedCalcifieldArchiveReport/GetLastsubmittedLeaveReportSub',
        data: 'userCode=' + userCode + '&sd=' + startDate + '&ed=' + endDate + '&ltn=' + leaveTypeName + '&ltc=' + leavetypeCode + '&regionCode=' + regionCode,
        success: function (response) {
            $("#divModel").html('');
            if (response != "") {
                $("#divModel").html(response);
                HideModalPopup("dvloading");
                ShowModalPopup('modal');
            }
            else {
                fnMsgAlert('info', 'Last Submitted Report', 'No data found.');
                HideModalPopup("dvloading");

            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });

}

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function fnComprehensiveAnalysisReportPop(input) {

    $('#hdnUserCode').val(input);
    $('#userCode').val(input);

    ShowModalPopup("dvloading");
    $("#dvExcelPrint").hide();
    // to open as a sub report from expense group wise analysis, check report type 
    var reportType = "";
    if ($("#ddlReportType") == null || $("#ddlReportType") === undefined) {
        reportType = "VISIT";
    }
    else {
        reportType = $("#ddlReportType").val();
    }
    var statrtDate = ""
    var endDate = "";
    var month = fngetMonthNumber($('#txtFromDate').val().split('-')[0]);
    var year = $('#txtFromDate').val().split('-')[1];
    var days = daysInMonth(month, year);
    statrtDate = "01/" + month + "/" + year;
    endDate = days + "/" + month + "/" + year;

    // assign date values in server controls for excel export
    $("#sd").val(statrtDate);
    $("#ed").val(endDate);
    $("#reportType").val(reportType);



    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetComprehensiveAnalysisReport',
        data: "userCode=" + $("#hdnUserCode").val() + "&sd=" + statrtDate + "&ed=" + endDate + "&reportType=" + reportType,
        success: function (response) {

            $("#divCompReport").html(response);
            $("#divCompReport").show();
            $("#dvExcelPrint").show();
            $("#divCompPrint").html(response);

            if (response != "") {
                $("#divInput").slideUp();
                $("#spnInputToggle").html("Show Input");
                $("#dvTree").hide();
                $("#spnTreeToggle").html('Show Tree');
                $("#divMain").css('width', '100%');
            }
            else {
                fnMsgAlert('info', 'Comprehensive Analysis Report', 'No data found.');

                HideModalPopup("dvloading");
            }
            HideModalPopup("dvloading");
            fninializePrint("divCompPrint", "ifrmCompPrint", "divCompReport");
        },
        error: function () {
            fnMsgAlert('info', 'Comprehensive Analysis Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}


function fnLastSubmittedPopupCalc(details) {
    ShowModalPopup("dvloading");
    $("#dvTree").hide();
    $('#divInput').show();
    $("#spnTreeToggle").html('Show Tree');
    $('#divToggle').show();
    $("#divMain").css('width', '100%');
    var DCRDate = $('input:radio[name=UnDCRDate]:checked').val();
    var regionCode = details.split('_')[0];
    var userCode = details.split('_')[1];
    var month = details.split('_')[2];
    var year = details.split('_')[3];
    var type = details.split('_')[4];
    var reporttype = details.split('_')[5]
    var visitCount = details.split('_')[6]
    var divisionName = details.split('_')[7];
    $("#divInput").slideUp();
    $("#spnInputToggle").html("Show Input");
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/LastsubmittedCalcifieldArchiveReport/GetLastsubmittedReportSub',
        data: 'userCode=' + userCode + '&month=' + month + '&year=' + year + '&type=' + type + '&regionCode=' + regionCode + '&reportType=' + reporttype + '&vCount=' + visitCount + '&divisionName=' + escape(divisionName),
        success: function (response) {
            $("#divModel").html('');
            if (response != "") {
                $("#divModel").html(response);
                if (response != "") {
                    $("#divInput").slideUp();
                    $("#spnInputToggle").html("Show Input");
                    $('#dvTablePrint').hide();
                }
                HideModalPopup("dvloading");
                ShowModalPopup('modal');
            }
            else {
                fnMsgAlert('info', 'Last Submitted Report', 'No data found.');
                HideModalPopup("dvloading");

            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}
