//To check all status
function checkAll() {
    if ($('#chkAll').attr('checked') == 'checked') {
        $('.clsCheck').attr('checked', 'checked')
    }
    else {
        $('.clsCheck').attr('checked', false);
    }
}
//Check single selection
function chkAllChecked() {
    if ($('.clsCheck:checked').length == 3) {
        $('#chkAll').attr('checked', 'checked');
    }
    else {
        $('#chkAll').attr('checked', false);
    }
}
//To Check all SFC Validity
//function ValidAll() {
//    if ($('#chkValidAll').attr('checked') == 'checked') {
//        $('.clsValidCheck').attr('checked', 'checked');
//        //$('#chkCurrent').prop('checked', true);
//        //$('#chkExpired').prop('checked', true);
//        //$('#chkFuture').prop('checked', true);
//        // $('#chkValidAll').prop('checked', true);
//    }
//    else {
//        $('.clsValidCheck').attr('checked', false);
//    }
//}
//For ClickingRegiontree View
function fnGetsfcReportclick() {
    if ($('#optViewInScreen').attr('checked') == "checked") {
        fnGetSFCReportinHTMLFormat();
    }
    else if ($('#optExportToExcel').attr('checked') == "checked") {
        fnGetSFCReportIntoExcelExport();
    }
}
//Download EXCEL for All View
function fnGetsfcReportIntoExcelReportforAllView() {
    var regionCodes = "";
    for (var i = 0; i < selKeys.length; i++) {
        regionCodes += selKeys[i] + ',';
    }
    if (regionCodes == '') {
        GetSFCReport("ALL", "E");
    }
    else {
        GetSFCReport(regionCodes, "E");
    }
}
//Get Grid Format
function fnGetSFCReportinHTMLFormat() {
    if (fnSubValidate()) {
        var regionCodes = "";
        for (var i = 0; i < selKeys.length; i++) {
            regionCodes += selKeys[i] + ',';
        }
        GetSFCReport(regionCodes, "S");
    }
}
//Get Excel Format
function fnGetSFCReportIntoExcelExport() {
    if (fnSubValidate()) {
        var regionCodes = "";
        for (var i = 0; i < selKeys.length; i++) {
            regionCodes += selKeys[i] + ',';
        }
        GetSFCReport(regionCodes, "E");
    }
}
//To get the travel modes
function fnGetTravelModes() {
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/SFCRegion/GetTravelModes',
        success: function (response) {
            if (response != "") {
                var content = "";
                // content = "<table></table>";
                content += '<table>';
                content += '<tbody>';
                content += '<tr>';
                for (var i = 0; i < response.length; i++) {


                    if (i == 0) {

                        content += '<td><input type="checkbox" name="chkTravelModes" class="clsTravelCheck" checked="checked" id="chkSelectUsers_' + i + '"  value="'
                            + response[i].TravelMode_Name + '"/></td>';
                        content += '<td checked="checked">' + response[i].TravelMode_Name + '</td>';
                        //$("#chkSelectUsers_ " + i + "").attr("checked", true);
                    }
                    else {
                        content += '<td><input type="checkbox" class="clsTravelCheck" name="chkTravelModes" id="chkSelectUsers_' + i + '"  value="'
                                + response[i].TravelMode_Name + '"/></td>';
                        content += '<td>' + response[i].TravelMode_Name + '</td>';
                    }




                    //    if ($(this).value == "BIKE") {
                    //        
                    //        $("#chkSelectUsers_ "+ i + "").attr("checked", true);
                    //    }

                }
                content += '<td><input type="checkbox" onclick="fnCheckUnCheckAllTravleMode(this)" class="clsTravelCheckAll" name="chkTravelModes" id="chkSelectUsers_' + i + '"  value="All"/></td>';
                content += '<td>All</td>';
                content += '</tr></tbody></table>';

                $('#divTravelMode').html(content);
            }

            $(".clsTravelCheck").unbind("click").bind("click", function () { fnCheckedAllOption(); });

        },
        error: function (e) {
            travelModeArr.clear();
        }
    });
}
//Bind the data with Html Table
function GetSFCReport(regionCodes, viewFormat) {
    var singleRegionCode = $('#hdnRegionCode').val();
    var checkedstatus = '';
    var Validity = '';

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
    var validcheckbox = $('input:checkbox[name=chkValidity]:checked');
    for (var intLoop1 = 0; intLoop1 < validcheckbox.length; intLoop1++) {
        if (validcheckbox[intLoop1].id == "chkValidAll") {
            Validity = validcheckbox[intLoop1].value + ",";
            break;
        }
        else {
            Validity += validcheckbox[intLoop1].value + ",";
        }
    }
    //if (validcheckbox == "All,") {

    //    $('#chkValidity').prop("checked", true);
    //}
    //
    //Validity = Validity.slice(0, -1);
    ////if (checkedstatus != "") {
    ////    checkedstatus = checkedstatus.substring(0, checkedstatus.length - 1);
    ////}



    $('#dvsfc').block({
        message: 'Retriveing data...',
        css: { border: '1px solid #ddd' }
    });
    var checkboxValues = "";
    $("#divTravelMode").find("input:checked").each(function () {
        checkboxValues = checkboxValues + $(this).val() + ",";
    });

    $.ajax({
        type: 'POST',
        data: "regionCode=" + regionCodes + "&viewFormat=" + viewFormat + "&title=" + $("#divPageHeader").html() + "&Status=" + checkedstatus + "&TravelMode=" + checkboxValues + "&SFCValidity=" + Validity,
        url: '../ReportsLevelThree/GetSFCReportDetails',
        success: function (response) {
            if (response != '' && response.length > 0) {
                if (response == "No Records To Display") {
                    $('#divsfcReport').html(response);
                }
                else {
                    $('#divsfcReport').html(response);
                    $("#divsfcReport div :nth-child(3)").hide();
                    $("#divsfcReport div :nth-child(4)").hide();
                }
                $("#dvsfc").unblock();
            }
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message.split('^')[1]);
            $("#dvsfc").unblock();
        }
    });
}
function fnSubValidate() {
    if (selKeys.length == 0) {
        fnMsgAlert('info', 'SFC Report', 'Please Select Atleast one User.');
        return false;
    }

    if ($(":checkbox[name=chkstatus]:checked").length == 0) {
        fnMsgAlert('info', 'SFC Report', 'Please Select the Status.');
        return false;
    }

    if ($(":checkbox[name=chkTravelModes]:checked").length == 0) {
        fnMsgAlert('info', 'SFC Report', 'Please Select any one Travel Mode.');
        return false;
    }

    if ($(":checkbox[name=chkValidity]:checked").length == 0) {
        fnMsgAlert('info', 'SFC Report', 'Please Select any one SFC Validity.');
        return false;
    }

    return true;
}
function fnCheckUnCheckAllTravleMode(obj) {
    if ($(obj).attr("checked") == "checked") {
        $(".clsTravelCheck").attr("checked", true);
    }
    else {
        $(".clsTravelCheck").attr("checked", false);
    }
}
function fnCheckedAllOption() {
    if ($(".clsTravelCheck:checked").length == $(".clsTravelCheck").length) {
        $(".clsTravelCheckAll").attr("checked", "checked");
    }
    else {
        $(".clsTravelCheckAll").attr("checked", false);
    }
}s
