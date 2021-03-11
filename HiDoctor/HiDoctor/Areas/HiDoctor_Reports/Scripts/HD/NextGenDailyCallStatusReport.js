var reponseResult = "";
var selectedMonth = "";
var selectedYear = "";
var days = "";
var startDate = "";
var endDate = "";

function fnGetshowDailycallstatusRept() {
    if ($('#optViewInScreen').attr('checked') == "checked") {
        fnGetDailycallstatusinHTMLFormat();
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
//Get Grid Format
function fnGetDailycallstatusinHTMLFormat() {
    debugger;
    var regionCode = $('#hdnRegionCode').val();

    if ($("#txtFrom").val() == "") {
        fnMsgAlert('info', 'DailyCallStatus Report.', 'Select month and year');
        return false;
    }

    if ($(":checkbox[name=chkstatus]:checked").length == 0) {
        fnMsgAlert('info', 'Info', 'Please select DCR status.');
        return false;
    }

    selectedMonth = fngetMonthNumber($('#txtFrom').val().split('-')[0]);
    selectedYear = $('#txtFrom').val().split('-')[1];
    days = daysInMonth(selectedMonth, selectedYear);

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

    startDate = selectedYear + "-" + selectedMonth + "-" + "01"
    endDate = selectedYear + "-" + selectedMonth + "-" + days

    debugger;

    $.ajax({
        type: 'Get',
        url: "http://localhost:14829/DailyCallStatus/DCR/" + "MON00000051" + "/" + $('#hdnRegionCode').val() + "/" + startDate + "/" + endDate + "/" + checkedstatus + "/" + "T" + "",
        success: function (response) {
            if (response != "") {
                debugger;
                reponseResult = response;
                fnBindCallStatusReport();
            }
        },
        error: function (e) {
            debugger;
            fnMsgAlert('info', '', 'Error.');
            $("#dvDailycallstatus").unblock();
        }
    });
}

function fnBindCallStatusReport() {
    var rowCount = 0;
    var strTableRept = "<div id='DailycallstatusReportDetails'>";
    strTableRept += "<div class='dvHeader' id='spnDailycallstatusReportDetails'>";


    if (reponseResult != null || reponseResult != "") {
        strTableRept += "<div class='dvheader-inner'><b>Daily Call Status Report for " + $('#hdnUseractivity').val().split('-')[0] + " for the month of " + $('#txtFrom').val().split('-')[0] + " - " + selectedYear + "</b></div>";
    }
    else {
        strTableRept += "<div class='dvheader-inner'><b> Daily Call Status Report for " + $('#hdnUseractivity').val().split('-')[0] + " for the month of " + $('#txtFrom').val().split('-')[0] + " - " + selectedYear + "</b></div>";
    }
    strTableRept += "</div>";
    strTableRept += "<br/>";
    strTableRept += "<table class='table table-striped' cellspacing='0' cellpadding='0' width='100%'><thead class='active'><tr><th align='left' valign='top'>S.No</th>";
    strTableRept += "<th align='left' valign='top'style='width:370px;'>Sales Region Name</th><th align='left' valign='top'style='width:370px;'>User Name</th><th align='left' valign='top'style='width:370px;'>Employee Name</th>";
    strTableRept += "<th align='left' valign='top'style='width:370px;'>Designation</th>";
    strTableRept += "<th align='left' valign='top'style='width:370px;'>Reporting Manager</th><th align='left' valign='top'style='width:370px;'>Reporting to Region</th>";
    strTableRept += "<th align='left' valign='top' style='width:50px;'>Day</th>";



    var dt = [];

    dt = getDates(startDate, endDate);//to get the dates between the specified start date and end date
    for (var i = 0; i < dt.length; i++) {
        strTableRept += dt[i].split('-')[2];
        strTableRept += "<th align='left' style='width:50px;'> " + dt[i].split('-')[2] + "-" + $('#txtFrom').val().split('-')[0] + " </th>";
    }
    var regioncodes = [];


    //for (var i = 0; i < reponseResult.length; i++) {
    //    regioncodes.push(reponseResult[i].DCRHeader.RegionCode);
    //}

    //var uniqueRegionCodes = fnGetUniqueValues(regioncodes);//to get the unique region codes 

    strTableRept += "</tr></thead><tbody>";

    for (var i = 0; i < reponseResult.length; i++) {
        var userName = reponseResult[i]._id.UserName;
        var employeeName = reponseResult[i]._id.EmployeeName;
        var userTypeName = reponseResult[i]._id.UserTypeName;
        //var divName = "";

        //for (var d = 0; d < lstuniqueRegion[0].DivisionDetails.length; d++) {
        //    divName = lstuniqueRegion[0].DivisionDetails[d].DivisionName + ",";
        //}
        var regionName = reponseResult[i]._id.RegionName;
        var reportingManagerName = reponseResult[i]._id.ReportingDetails.UserName;
        var ReportingManagerRegionName = reponseResult[i]._id.ReportingDetails.RegionName + ",";

        strTableRept += "<tr>";
        strTableRept += "<td align='left' rowspan='2'>";
        strTableRept += i;
        strTableRept += "</td>";

        //Sales Region Name
        strTableRept += "<td align='left' rowspan='2'>";
        strTableRept += regionName;
        strTableRept += "</td>";

        //User Name
        strTableRept += "<td align='left' rowspan='2'>";
        strTableRept += userName;
        strTableRept += "</td>";

        //Employee Name
        strTableRept += "<td align='left' rowspan='2'>";
        strTableRept += employeeName;
        strTableRept += "</td>";

        //Designtaions
        strTableRept += "<td align='left' rowspan='2'>";
        strTableRept += userTypeName;
        strTableRept += "</td>";

        ////Division
        //strTableRept += "<td align='left' rowspan='2'>";
        //strTableRept +=divName);
        //strTableRept += "</td>";

        //Reporting Manager
        strTableRept += "<td align='left' rowspan='2'>";
        strTableRept += reportingManagerName;
        strTableRept += "</td>";

        //Reporting to Region
        strTableRept += "<td align='left' rowspan='2'>";
        strTableRept += ReportingManagerRegionName;
        strTableRept += "</td>";

        //DCREntered date
        strTableRept += "<td align='left' valign='top'>Sub.On</td>";

        var dcrdate = reponseResult[i].dcrCallStatus[0].DCRHeader.LocalDCREnteredDate.split('T')[0];


        for (var d = 0; d < dt.length; d++) {
            var dtmonth = "";
            var dtday = "";


            //jsonPath(reponseResult[i].dcrCallStatus, "$.[?(@.DCRActualDateUTC=='2017-04-01T00:00:00Z')]")

            var filterdate = jsonPath(reponseResult[i].dcrCallStatus, "$.[?(@.DCRActualDateUTC=='" + dt[d] + "T00:00:00Z')]");
            if (filterdate != false) {
                debugger;
                strTableRept += "<td align='left' style='width:50px;'>";
                strTableRept += filterdate[0].LocalDCREnteredDate.split('T')[0].split('-')[2]+"-"+ $('#txtFrom').val().split('-')[0];
                strTableRept += "</td>";
            }
            else {
                strTableRept += "<td align='left'  style='width:50px;'>-</td>";
            }
        }
            strTableRept += "</tr>";
            strTableRept += "<tr>";
            strTableRept += "<td align='left' valign='top'  style='width:50px;'>No.of.Dr.</td>";




            for (var j = 0; j < reponseResult[i].dcrCallStatus.length; j++) {
                var toolTipContent = "";
                var tooltipActivity = "";
                var status = "";

                toolTipContent = "<div>";
                if (reponseResult[i].dcrCallStatus[j].DCRDoctorsVisit!=null)
                {
                    toolTipContent += GenerateToolTip(reponseResult[i].dcrCallStatus[j].DCRDoctorsVisit) + "</div>";
                }

                if (reponseResult[i].dcrCallStatus[j].DCRHeader.ActivityFlag == "F") {
                    if (reponseResult[i].dcrCallStatus[j].DCRDoctorsVisit.length > 0) {
                        status += reponseResult[i].dcrCallStatus[j].DCRDoctorsVisit.length + "/I/";
                    }
                        //else {
                        //    status += reponseResult[i].dcrCallStatus[0].DCRDoctorsVisit.length + "/";
                        //}
                    else {
                        status += "F/";
                    }
                }

                else if (reponseResult[i].dcrCallStatus[j].DCRHeader.ActivityFlag == "L") {
                    status += "L/";
                }
                else if (reponseResult[i].dcrCallStatus[j].DCRHeader.ActivityFlag == "A") {
                    tooltipActivity = "<div>";
                    tooltipActivity += GenerateActivityTooltip(reponseResult[i].dcrCallStatus[j].DCRHeader.DCRAttendanceActivity) + "</div>";
                    status += "A/";
                }


                if (toolTipContent.length != 0 || tooltipActivity.length != 0) {
                    toolTipContent = toolTipContent + tooltipActivity;
                    tooltiptestContent = "<a style='text-decoration:underline;cursor:pointer' onmouseover=\"Tip('" + toolTipContent + "')\" onmouseout=\"UnTip()\"> " + status + " </a>";
                    strTableRept += "<td class='td-a' align='left' style='width:50px;'> " + tooltiptestContent + " </td>";
                }
                else {
                    strTableRept += "<td> " + status + " </td>";
                }

            }
            //var filterdoc = jsonPath(reponseResult[i].dcrCallStatus, "$.[?(@.DCRActualDateUTC=='" + dt[d] + "T00:00:00Z')]");


    }

    $('#divDailycallstatusrpt').html(strTableRept);
    $('#dvDailycallstatus').unblock();
    HideModalPopup("dvloading");
    $('#divDailycallstatusrpt').show();

}


function GenerateToolTip(value) {
    var strTblTooltip = "<table>";
    strTblTooltip += "<thead><tr>";
    strTblTooltip += "<th><p><b><u>Doctor Name</u></b></p></th><th><p><b><u>MDL Number</u></b></p></th><th><p><b><u>Speciality Name</u></b></p></th>";
    strTblTooltip += "</tr></thead>";
    strTblTooltip += "<tbody>";
    if (value != null && value.length > 0) {
        for (var i = 0; i < value.length; i++) {
            strTblTooltip += "<tr>";
            strTblTooltip += "<td> " + value[i].DoctorName + " </td>";

            if (value[i].MDLNo != undefined) {
                strTblTooltip += "<td> " + value[i].MDLNo + " </td>";
            }           
            else {
                strTblTooltip += "<td >-</td>";
            }
            strTblTooltip += "<td> " + value[i].SpecialityName + " </td>";

            strTblTooltip += "</tr>";
        }
        strTblTooltip += "</tbody>";
        strTblTooltip += "</table>";

    }
    return strTblTooltip;
}

function GenerateActivityTooltip(value)
{
    var strTbActive="";
    strTbActive ="<table>";
    strTbActive +="<thead><tr>";
    strTbActive +="<th><p><b><u>Attendance Activity Name</u></b></p></th>";
    strTbActive +="</tr></thead>";
    strTbActive +="<tbody>";
    //if (lstActivity != null && lstActivity.Count() > 0)
    //{
    //    for(var i=0;i<reponseResult[i].dcrCallStatus.length;i++)
    //    {

    strTbActive += "<tr>";
    if (value != null)
    {
        if (value.DCRAttendanceActivity != "" || value.DCRAttendanceActivity != undefined) {
            strTbActive += "<td> " + value.DCRAttendanceActivity + " </td>";
        }
        else {
            strTbActive += "<td>No Activity</td>";
        }
    }
    else {
        strTbActive += "<td>No Activity</td>";
    }
           
            strTbActive +="</tr>";
    //    }
    //}
    strTbActive +="</tbody>";
    strTbActive +="</table>";

    return strTbActive;
}

function fnGetUniqueValues(arrayObject) {
    var arrIndex = 0;
    var uniqueValues = new Array();
    for (arrIndex = 0; arrIndex < arrayObject.length; arrIndex++) {
        if ($.inArray(arrayObject[arrIndex], uniqueValues) == -1) {
            uniqueValues.push(arrayObject[arrIndex]);
        }
    }

    return uniqueValues;
}

function getDates(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    var noOfDays = new Date(selectedYear, selectedMonth, 0).getDate();
    for (var i = 0; i < noOfDays; i++) {
        var newdate = new Date(currentDate);

        newdate.setDate(newdate.getDate() + i);
        var dd = newdate.getDate();
        var mm = newdate.getMonth() + 1;
        if (mm.toString().length == 1) {
            mm = "0" + mm;
        }
        if (dd.toString().length == 1) {
            dd = "0" + dd;
        }
        var y = newdate.getFullYear();
        var da = y + "-" + mm + "-" + dd;
        dateArray.push(da);

    }
    return dateArray;
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



function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}
