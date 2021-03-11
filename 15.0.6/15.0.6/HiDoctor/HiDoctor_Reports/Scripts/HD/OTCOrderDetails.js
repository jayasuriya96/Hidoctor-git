
function fnOTCProductWiseOrderDetailsReport() {
    ShowModalPopup("dvloading");
    $("#divReportSummary").html("");
    $("#divReport").html("");
    var userCode = $('#hdnUserCode').val();
    var startDate = $('#txtFromDate').val().split('/');
    var endDate = $('#txtToDate').val().split('/');

    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'OTC Product Wise Order Details', 'Select start date');
        HideModalPopup("dvloading");
        return false;

    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'OTC Product Wise Order Details', 'Select end date');
        HideModalPopup("dvloading");
        return false;
    }

    var dt1 = new Date(startDate[2] + "-" + startDate[1] + "-" + startDate[0]);
    var dt2 = new Date(endDate[2] + "-" + endDate[1] + "-" + endDate[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'OTC Product Wise Order Details', 'Start date should be less than  End date');
        HideModalPopup("dvloading");
        return false;
    }
    var dcrStatus = "";
    // GET DCR STATUS
    if ($(":checkbox[name=dcrStatusAll]:checked").length > 0) {
        dcrStatus = $("input:checkbox[name=dcrStatusAll]:checked").val();
    }
    else {
        $('input:checkbox[name=dcrStatus]').each(function () {
            if ($(this).is(':checked')) {
                dcrStatus += $(this).val();
            }
        });
    }

    if (dcrStatus == "") {
        fnMsgAlert('info', 'OTC Product Wise Order Details', 'Select Order status');
        HideModalPopup("dvloading");
        return false;
    }

    $("#divHeaderText").show();

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/OTCOrderDetails/GetOTCOrderDetailsReport',
        data: 'userCode=' + userCode + '&sd=' + startDate[2] + "-" + startDate[1] + "-" + startDate[0] + '&ed=' + endDate[2] + "-" + endDate[1] + "-" + endDate[0] + '&orderStatus=' + dcrStatus,
        success: function (response) {

            if (response != "") {
                $("#divReport").html(response.split('^')[0]);
                $("#divPrint").html(response.split('^')[0]);

                $("#divReportSummary").html(response.split('^')[1]);
                $("#divPrintSummary").html(response.split('^')[1]);
                if ($.fn.dataTable) {
                    $('#OtcOrderDetails').dataTable({
                        "iDisplayLength": 25,
                        "sPaginationType": "full_numbers",
                        "bDestroy": true,
                        "sDom": 'T<"clear">lfrtip',
                        "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                    });
                };
                fninializePrint("divPrint", "ifrmPrint", "divReport");

                var oTable = $('#OtcOrderSummary').dataTable({
                    "sPaginationType": "full_numbers",
                    "fnFooterCallback": function (nRow, aaData, iStart, iEnd, aiDisplay) {
                        var orderCount = 0; var Amount = 0;
                        for (var i = 0; i < aaData.length; i++) {
                            orderCount += parseFloat(aaData[i][1].replace(',', ''));
                            Amount += parseFloat(aaData[i][2].replace(',', ''));
                        }
                        var TotalorderCount = 0; var totalAmount = 0;
                        for (var i = iStart; i < iEnd; i++) {
                            TotalorderCount += parseFloat(aaData[aiDisplay[i]][1].replace(',', ''));
                            totalAmount += parseFloat(aaData[aiDisplay[i]][2].replace(',', ''));

                        }
                        var ncell = nRow.getElementsByTagName('th');
                        //var nCells = nRow.getElementsByTagName('th');
                        ncell[1].innerHTML = addCommas(TotalorderCount.toFixed(2)) + '<br/>(' + addCommas(orderCount.toFixed(2)) + ')';
                        ncell[2].innerHTML = '' + addCommas(totalAmount.toFixed(2)) + '<br/>(' + addCommas(Amount.toFixed(2)) + ')';
                    },
                    "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });

                fninializePrint("divPrintSummary", "ifrmPrintSummary", "divReportSummary");
                $("#divInput").slideUp();
                $("#spnInputToggle").html("Show Input");
            }
            else {
                $("#divReport").html("");
                $("#divHeaderText").hide();
                fnMsgAlert('info', 'Report', 'No data found.');
                HideModalPopup("dvloading");
            }
            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

function fninializePrint(divId, iFrameId, mainDiv) {
    $('#' + mainDiv + ' #dvPrint').remove();
    $("#" + mainDiv + " .TableTools").append("<div id='dvPrint' onclick='fnPrint(\"" + divId + "\",\"" + iFrameId + "\");' title='Print Table' class='TableTools_button' style='background: url(../Content/DataTable/media/images/print.png) no-repeat center center;border: 1px solid #f0f0f0;height: 30px; width: 30px;cursor:pointer;'></div>");
}