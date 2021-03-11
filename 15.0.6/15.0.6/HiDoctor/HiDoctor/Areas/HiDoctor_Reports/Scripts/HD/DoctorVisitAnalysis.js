function fnOpenDoctorVisitAnalysisSpecialityWise() {
    $("#divReport").empty();
    ShowModalPopup("dvloading");
    if (fnValidateDoctorVisitAnalysisSpecialityWise()) {
        var year = $('#txtMonth').val().split('-')[1];
        var month = fngetMonthNumber($('#txtMonth').val().split('-')[0]);
        var mode = $("input:radio[name=mode]:checked").val();

        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Reports/DoctorVisitAnalysisSpecialityWise/GetDoctorVisitAnalysisSpecialityWiseReport',
            data: 'userCode=' + $("#hdnUserCode").val() + '&month=' + month + '&year=' + year + '&mode=' + mode + '&reportName=' + escape($("#divPageHeader").html()) + '&monthName=' + $('#txtMonth').val().split('-')[0],
            success: function (response) {
                if (response != "") {

                    $("#divReport").html(response.split('$')[0]);
                    $("#divPrint").html(response.split('$')[0]);

                    $('#tblDrVisitAnalysisSpecialityWise').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip'
                    });

                    fninializeExcel("lnkReport", response.split('$')[1], "divReport");
                    fninializePrint("divPrint", "ifrmPrint", "divReport");



                    $('#divReport').show();
                    HideModalPopup("dvloading");
                }
                else {
                    fnMsgAlert('info', $("#divPageHeader").html(), 'No Data found.');
                    HideModalPopup("dvloading");
                }
            },
            error: function (e) {
                fnMsgAlert('info', $("#divPageHeader").html(), 'Error.' + e.Message);
                HideModalPopup("dvloading");
            }
        });
    }
}

function fnOpenDoctorVisitAnalysisSpecialityWiseDrCountPopUp(id) {
    //id= userCode_RegionCode_SpecialityCode_CategoryCode_Mode
    $("#dvDrscountPopUp").empty();
    var userCode = id.split('_')[0];
    var regionCode = id.split('_')[1];
    var specialityCode = id.split('_')[2];
    var categoryCode = id.split('_')[3];
    var mode = id.split('_')[4];

    if ($('#txtMonth').val() == "") {
        fnMsgAlert('info', $("#divPageHeader").html(), 'Please enter Month.');
        HideModalPopup("dvloading");
        return false;
    }
    var year = $('#txtMonth').val().split('-')[1];
    var month = fngetMonthNumber($('#txtMonth').val().split('-')[0]);

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/DoctorVisitAnalysisSpecialityWise/GetDoctorVisitAnalysisSpecialityWiseReportDrsCountPopUp',
        data: 'userCode=' + userCode + '&month=' + month + '&year=' + year + '&mode=' + mode + '&regionCode=' + regionCode + '&specialityCode=' + specialityCode + '&categoryCode=' + categoryCode,
        success: function (response) {
            if (response != "") {

                $("#dvDrscountPopUp").html(response.split('$')[0]);
                $("#divPrintDrsCount").html(response.split('$')[2] + response.split('$')[0]);

                $('#tblDrCount').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip'
                });

                fninializeExcel("lnkDrscountPopUp", response.split('$')[1], "dvDrscountPopUp");
                fninializePrint("divPrintDrsCount", "ifrmPrintDrsCount", "dvDrscountPopUp");

                $("#dvDrsCountOverLay").overlay().load();

            }
            else {
                fnMsgAlert('info', $("#divPageHeader").html(), 'No Data found.');
                HideModalPopup("dvloading");
            }
        },
        error: function (e) {
            fnMsgAlert('info', $("#divPageHeader").html(), 'Error.' + e.Message);
            HideModalPopup("dvloading");
        }
    });

}

function fnOpenDoctorVisitAnalysisSpecialityWiseFreqPopUp(id) {
    //id= userCode_RegionCode_SpecialityCode_CategoryCode_Mode
    $("#dvFreqAchievPopUp").empty();
    var userCode = id.split('_')[0];
    var regionCode = id.split('_')[1];
    var specialityCode = id.split('_')[2];
    var categoryCode = id.split('_')[3];
    var mode = id.split('_')[4];

    if ($('#txtMonth').val() == "") {
        fnMsgAlert('info', $("#divPageHeader").html(), 'Please enter Month.');
        HideModalPopup("dvloading");
        return false;
    }
    var year = $('#txtMonth').val().split('-')[1];
    var month = fngetMonthNumber($('#txtMonth').val().split('-')[0]);

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/DoctorVisitAnalysisSpecialityWise/GetDoctorVisitAnalysisSpecialityWiseReportFreqPopUp',
        data: 'userCode=' + userCode + '&month=' + month + '&year=' + year + '&mode=' + mode + '&regionCode=' + regionCode + '&specialityCode=' + specialityCode + '&categoryCode=' + categoryCode,
        success: function (response) {
            if (response != "") {

                $("#dvFreqAchievPopUp").html(response.split('$')[0]);
                $("#divPrintFreq").html(response.split('$')[2] + response.split('$')[0]);

                $('#tblFreqCount').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip'
                }).rowGrouping({ bExpandableGrouping: true, iGroupingColumnIndex: 7 });

                fninializeExcel("lnkFreqAchievPopUp", response.split('$')[1], "dvFreqAchievPopUp");
                fninializePrint("divPrintFreq", "ifrmPrintFreq", "dvFreqAchievPopUp");

                $("#dvFreqAchievOverLay").overlay().load();

            }
            else {
                fnMsgAlert('info', $("#divPageHeader").html(), 'No Data found.');
                HideModalPopup("dvloading");
            }
        },
        error: function (e) {
            fnMsgAlert('info', $("#divPageHeader").html(), 'Error.' + e.Message);
            HideModalPopup("dvloading");
        }
    });

}

function fnValidateDoctorVisitAnalysisSpecialityWise() {
    if ($("#txtMonth").val() == "") {
        fnMsgAlert('info', $("#divPageHeader").html(), 'Please enter Month.');
        HideModalPopup("dvloading");
        return false;
    }
    return true;
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

function fninializePrint(divId, iFrameId, mainDiv) {
    $('#' + mainDiv + ' #dvPrint').remove();
    $("#" + mainDiv + " .TableTools").append("<div id='dvPrint' onclick='fnPrint(\"" + divId + "\",\"" + iFrameId + "\");' title='Print Table' class='TableTools_button' style='background: url(../Content/DataTable/media/images/print.png) no-repeat center center;border: 1px solid #f0f0f0;height: 30px; width: 30px;cursor:pointer;'></div>");
}

function fninializeExcel(lnkId, href, mainDiv) {
    $('#' + mainDiv + ' #dvExcel').remove();
    $("#" + mainDiv + " .TableTools").append('<a id="' + lnkId + '" href="' + href + '" title="Excel Export" style="float: right;"><img src="../Content/DataTable/media/images/xls.png" style="border: 1px solid #f0f0f0; height: 30px; width: 30px; cursor: pointer;" /></a>');
}
