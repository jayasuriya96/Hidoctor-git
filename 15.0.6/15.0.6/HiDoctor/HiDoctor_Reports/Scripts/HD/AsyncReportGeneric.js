/* Common functions */
function fnPrint(divId, iFrameId) {
    try {
        debugger;
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
    $('#' + mainDiv + ' #dvPrint').remove();
    $("#" + mainDiv + " .TableTools").append("<div id='dvPrint' onclick='fnPrint(\"" + divId + "\",\"" + iFrameId + "\");' title='Print Table' class='TableTools_button' style='background: url(../Content/DataTable/media/images/print.png) no-repeat center center;border: 1px solid #f0f0f0;height: 30px; width: 30px;cursor:pointer;'></div>");
}

function fnToggleReportQueue(val) {
    debugger;
    if ($("#spnReportQueueToggle").html() == "Hide Report Queue Status") {
        $("#dvRptQueuePanel").slideUp();
        $("#spnReportQueueToggle").html("Show Report Queue Status");
    }
    else if ($("#spnReportQueueToggle").html() == "Show Report Queue Status") {
        $("#spnReportQueueToggle").html("Hide Report Queue Status");
        fnRefreshReportQueueStatus(val);
        $("#dvRptQueuePanel").slideDown();

    }
}

function fnRefreshReportQueueStatus(val) {
    debugger;
    $('#dvAsynMsg').html();
    $('#dvAsynMsg').hide();
    fnGetAsynReportstatus(val);
}

function fnGetAsynReportstatus(val) {
    debugger;
    $('#dvReportQueue').show();
    $('#dvReportQueue').html('');
    var Reportname = val;
    $("#ReportName").val(Reportname);
    $.ajax({
        type: 'GET',
        data: "ReportName=" + val,
        url: '../HiDoctor_Reports/AysncReports/GetReportProcessQueueStatus',
        success: function (response) {
            if (response != '' && response != null) {
                debugger;
                $('#dvReportQueue').html(response);                
            }
            $("#dvAjaxLoad").hide();
        },
        error: function () {
            fnMsgAlert('info', 'Loading report queue', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

function fnGetAsyncReportByID(TransID, rptName) {
    debugger;
    ShowModalPopup("dvloading");
    $('#dvRptPanel').show();
    $('#dvAsynReport').html('');
    //$('#divPrint').html('');
    var TransactionID = TransID;

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/AysncReports/GetAsyncReportByID',
        data: 'TransactionID=' + TransactionID,
        success: function (response) {
            if (response != null && response != '') {
                debugger;
                $('#dvAsynReport').html(response);
                $("#dvExcelPrint").show();
                // $("#divCompPrint").html(response);
                $("#divInput").slideUp();
                $("#divToggle").show();
                $("#spnInputToggle").html("Show Input");
                $("#dvTree").hide();
                $("#leftNav").hide();
                $("#spnTreeToggle").html('Show Tree');
                $("#dvRptQueuePanel").hide();
                $("#dvReportQueue").hide();
                $("#spnReportQueueToggle").html('Show Report Queue Status');
                $("#divMain").css('width', '99%');
                $("#divMainDCR").css('width', '99%');
                $("#ReportTransactionID").val(TransactionID);
                $('#dvMain').addClass('col-md-12');
                $('#dvMain').removeClass('col-md-9');
                HideModalPopup("dvloading");
                if (rptName != null && rptName != '')
                {
                    if ($.fn.dataTable) {
                        $('#'+ rptName).dataTable({
                            "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                        });
                    };
                }
            }
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
/* Common functions */
