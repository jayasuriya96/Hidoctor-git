
function fnValidateDateandName(holidayDateId, holidayNameId) {
    if ($.trim($('#' + holidayDateId).val()) == '') {
        fnMsgAlert('info', 'Info', 'Please enter holiday date');
        return false;
    }
    var result = isValidDateFormat($("#" + holidayDateId));
    if (!result) {
        fnMsgAlert('info', 'Info', 'Please enter valid holiday date');
        return false;
    }
    if ($.trim($('#' + holidayNameId).val()) == '') {
        fnMsgAlert('info', 'Info', 'Please enter holiday name');
        return false;
    }
    if ($.trim($('#' + holidayNameId).val()) != "") {
        var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._]+$");
        if (!specialCharregex.test($('#' + holidayNameId).val())) {
            fnMsgAlert('info', 'Information', 'Please remove the special characters from the holiday Name');
            return false;
        }
    }
    var holidayDate = $('#' + holidayDateId).val();
    var date = new Date(holidayDate.split('/')[2] + "-" + holidayDate.split('/')[1] + "-" + holidayDate.split('/')[0]);
  //  var serverDate = new Date(curdate.split('.')[2] + "-" + curdate.split('.')[1] + "-" + curdate.split('.')[0]);
    var dateDiff = fnGetDateDifference(date);
    if (dateDiff < 0) {
        fnMsgAlert('info', 'Info', 'Dear ' + $("#spnUser").html().split(',')[0] + ' ,</br> Since the selected date is a past date, ' +
        'you are not allowed to Save / Edit / Delete the holiday details');
        return false;
    }
    return true;
}

function fnSave() {
    if (selectedRegionCodes != undefined) {
        if (selectedRegionCodes.length > 0) {
            //if ($.trim($('#txtHolidayDate').val()) == '') {
            //    fnMsgAlert('info', 'Info', 'Please enter holiday date');
            //    return;
            //}
            //var result = isValidDateFormat($("#txtHolidayDate"));
            //if (!result) {
            //    fnMsgAlert('info', 'Info', 'Please enter valid holiday date');
            //    return;
            //}
            //if ($.trim($('#txtHolidayName').val()) == '') {
            //    fnMsgAlert('info', 'Info', 'Please enter holiday name');
            //    return;
            //}
            //if ($.trim($('#txtHolidayName').val()) != "") {
            //    var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._]+$");
            //    if (!specialCharregex.test($('#txtHolidayName').val())) {
            //        fnMsgAlert('info', 'Information', 'Please remove the special characters from the holiday Name');
            //        return;
            //    }
            //}
            var result = fnValidateDateandName("txtHolidayDate", "txtHolidayName");
            if (result) {
                fnValidateHoliday("INSERT", $("#txtHolidayDate").val(), $.trim($("#txtHolidayName").val()), selectedRegionCodes);
            }

        }
        else {
            fnMsgAlert('info', 'Validate', 'Please select atleast anyone region');
            return;
        }
    }
    else {
        fnMsgAlert('info', 'Validate', 'Please select atleast anyone region');
        return;
    }
}
function fnValidateHoliday(mode, holidayDate, holidayName, regionCodes) {
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });

    $.ajax({
        url: '../HiDoctor_Master/Region/GetMappedHolidaysByDate/',
        type: "POST",
        data: "holidayDate=" + holidayDate,
        success: function (result) {
            jsonResult = eval('(' + result + ')');
            if (jsonResult.length > 0) {
                var mappedRegionCodes = "";
                var unMappedRegionCodes = "";
                for (var i = 0; i < regionCodes.length; i++) {
                    var disJson = jsonPath(jsonResult, "$.[?(@.Region_Code=='" + regionCodes[i] + "')]");
                    if (disJson != false) {
                        mappedRegionCodes += disJson[0].Region_Code + ",";
                    }
                    else {
                        unMappedRegionCodes += regionCodes[i] + ',';
                    }
                }
                mappedRegionCodes = mappedRegionCodes.slice(0, -1);
                unMappedRegionCodes = unMappedRegionCodes.slice(0, -1);
                //if (regionCodes.length == mappedRegionCodes.split(',').length) {
                //    fnMsgAlert('info', 'Info', 'Same date or same holiday cannot be assigned more than once to any region. ' +
                //           'The selected date is already assigned as a holiday to the selected regions. ' +
                //           'Hence, assigning this date as holiday to the selected region will be ignored. Note: Using Search holiday tab, you can identify those regions.');
                //    return;
                //}
                if (mappedRegionCodes != '') {
                    if (unMappedRegionCodes == '') {
                        fnMsgAlert('info', 'Info', 'Same date or same holiday cannot be assigned more than once to any region. ' +
                               'The selected date is already assigned as a holiday to the selected regions. ' +
                               'Hence, assigning this date as holiday to the selected region will be ignored. Note: Using Search holiday tab, you can identify those regions.');
                        return;
                    }
                    //$("#dvInfoMsg").html('Dear ' + $("#spnUser").html().split(',')[0] + ' </br> Same date or same holiday cannot be assigned more than once to any region. ' +
                    //       'The selected date is already assigned as a holiday to one or more selected regions. ' +
                    //       'Hence, assigning this date as holiday to those region(s) will be ignored. Note: Using Search holiday tab, you can identify those regions.');
                    //$("#dvAlert").css('zIndex', 999999);
                    //$("#dvAlert").dialog({
                    //    resizable: true,
                    //    height: 300,
                    //    modal: true,
                    //    buttons: {
                    //        Ok: function () { $(this).dialog("close"); fnSubmitHoliday(unMappedRegionCodes); },
                    //        Cancel: function () {
                    //            $(this).dialog("close");
                    //        }
                    //    }
                    //});
                    if (confirm('Dear ' + $("#spnUser").html().split(',')[0] + ', Same date or same holiday cannot be assigned more than once to any region. ' +
                           'The selected date is already assigned as a holiday to one or more selected regions. ' +
                           'Hence, assigning this date as holiday to those region(s) will be ignored. Note:  ' +
                           'Using Search holiday tab, you can identify those regions.')) {
                        fnSubmitHoliday(unMappedRegionCodes);
                    }

                }
                else {
                    fnSubmitHoliday(unMappedRegionCodes);
                }
            }
            else {
                fnSubmitHoliday(regionCodes);
            }
        },
        error: function () {
            $("#main").unblock();
        },
        complete: function () {
            $("#main").unblock();
        }
    });
}

function fnSubmitHoliday(regionCodes) {
    //InsertHolidayMaster
    //string regionCodes, string holidayDate, string holidayName, string mode
    ShowModalPopup("dvLoading");
    var mode = $("#hdnMode").val();
    var holidayDate = "";
    var holidayName = "";
    if (mode == "INSERT") {
        //if ($.trim($('#txtHolidayDate').val()) == '') {
        //    fnMsgAlert('info', 'Info', 'Please enter holiday date');
        //    return;
        //}
        //var result = isValidDateFormat($("#txtHolidayDate"));
        //if (!result) {
        //    fnMsgAlert('info', 'Info', 'Please enter valid holiday date');
        //    return;
        //}
        //if ($.trim($('#txtHolidayName').val()) == '') {
        //    fnMsgAlert('info', 'Info', 'Please enter holiday name');
        //    return;
        //}
        //if ($.trim($('#txtHolidayName').val()) != "") {
        //    var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._]+$");
        //    if (!specialCharregex.test($('#txtHolidayName').val())) {
        //        fnMsgAlert('info', 'Information', 'Please remove the special characters from the holiday Name');
        //        return;
        //    }
        //}
        var result = fnValidateDateandName("txtHolidayDate", "txtHolidayName");
        if (result) {
            holidayDate = $("#txtHolidayDate").val();
            holidayName = $.trim($("#txtHolidayName").val());
        }
        else {
            return;
        }
    }
    else if (mode == "SINGLE_EDIT") {
        //if ($.trim($('#txtSEHolidayDate').val()) == '') {
        //    fnMsgAlert('info', 'Info', 'Please enter holiday date');
        //    return;
        //}
        //var result = isValidDateFormat($("#txtSEHolidayDate"));
        //if (!result) {
        //    fnMsgAlert('info', 'Info', 'Please enter valid holiday date');
        //    return;
        //}
        //if ($.trim($('#txtSEHolidayName').val()) == '') {
        //    fnMsgAlert('info', 'Info', 'Please enter holiday name');
        //    return;
        //}
        //if ($.trim($('#txtSEHolidayName').val()) != "") {
        //    var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._]+$");
        //    if (!specialCharregex.test($('#txtSEHolidayName').val())) {
        //        fnMsgAlert('info', 'Information', 'Please remove the special characters from the holiday Name');
        //        return;
        //    }
        //}
        var result = fnValidateDateandName("txtSEHolidayDate", "txtSEHolidayName");
        if (result) {
            holidayDate = $("#txtSEHolidayDate").val();
            holidayName = $.trim($("#txtSEHolidayName").val());
        } else {
            return;
        }
    }
    else {
        //if ($.trim($('#txtEHolidayDate').val()) == '') {
        //    fnMsgAlert('info', 'Info', 'Please enter holiday date');
        //    return;
        //}
        //var result = isValidDateFormat($("#txtEHolidayDate"));
        //if (!result) {
        //    fnMsgAlert('info', 'Info', 'Please enter valid holiday date');
        //    return;
        //}
        //if ($.trim($('#txtEHolidayName').val()) == '') {
        //    fnMsgAlert('info', 'Info', 'Please enter holiday name');
        //    return;
        //}
        //if ($.trim($('#txtEHolidayName').val()) != "") {
        //    var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._]+$");
        //    if (!specialCharregex.test($('#txtEHolidayName').val())) {
        //        fnMsgAlert('info', 'Information', 'Please remove the special characters from the holiday Name');
        //        return;
        //    }
        //}
        var result = fnValidateDateandName("txtEHolidayDate", "txtEHolidayName");
        if (result) {
            holidayDate = $("#txtEHolidayDate").val();
            holidayName = $.trim($("#txtEHolidayName").val());
        } else {
            return;
        }
    }
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/Region/InsertHolidayMaster/',
        type: "POST",
        data: "regionCodes=" + regionCodes + "&holidayDate=" + holidayDate + "&holidayName=" + escape(holidayName) + "&mode=" + mode + "&holidayCode="
            + $('#hdnHolidayCode').val() + "&Old_HolidayDate=" + $("#hdnHolidayDate").val() + "",
        success: function (result) {
            if (!isNaN(result)) {
                if (parseInt(result) > 0) {
                    if (mode == "INSERT") {
                        fnMsgAlert('success', 'Success', 'Holiday saved successfully');
                        $("#dvHoliday").html('');
                        fnClearAll();
                        HideModalPopup("dvLoading");
                    }
                    else {
                        fnMsgAlert('success', 'Success', 'Holiday updated successfully');
                        fnGetHolidayDetails(1);
                        $("#txtEHolidayDate").val('');
                        $("#txtEHolidayName").val('');
                        $("#txtSEHolidayDate").val('');
                        $("#txtSEHolidayName").val('');
                        HideModalPopup("dvLoading");
                    }
                    $("#hdnMode").val('INSERT');
                    $("#dvEditHolidayPopUp").overlay().close();
                    $("#dvSingleEditHolidayPopUp").overlay().close();

                }
                else {
                    fnMsgAlert('info', 'Error', 'Failed to save holiday details');
                    HideModalPopup("dvLoading");
                }
                fnGetRegions();
                fnSelectAllUnMappedRegions();
            }

        },
        error: function () {
            $("#main").unblock();
            HideModalPopup("dvLoading");
        },
        complete: function () {
            $("#main").unblock();
            HideModalPopup("dvLoading");
        }
    });
}

function fnReset() {
    $("#cboSourceRegion").val('');
    fnGetRegions();
}
function fnClearAll() {
    $("#txtHolidayDate").val('');
    $("#txtHolidayName").val('');
    $("#txtEHolidayDate").val('');
    $("#txtEHolidayName").val('');
    $("#txtSEHolidayDate").val('');
    $("#txtSEHolidayName").val('');
    $("#dvRegionTree").dynatree("getRoot").visit(function (node) {
        node.select(false);
    });
}

function fnGetHolidayDetails(pageNumber) {
    //GetMappedHolidayDetails
    $('#dvHoliday').html('');
    if ($("#cboYear").val() == "0") {
        fnMsgAlert('info', 'Info', 'Please select atleast any one year');
        return;
    }
    if (selectedRegionCodes == undefined) {
        fnMsgAlert('info', 'Info', 'Please select atleast any one region');
        fnHideTree();
        return;
    }
    if (selectedRegionCodes.length == 0) {
        fnMsgAlert('info', 'Info', 'Please select atleast any one region');
        fnHideTree();
        return;
    }
    var regionCodes = selectedRegionCodes + ",";
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/Region/GetMappedHolidayDetails/',
        type: "POST",
        data: "regionCodes=" + regionCodes + "&year=" + $("#cboYear").val() + "&pageNumber=" + pageNumber + "&excelDownload=false&SearchKey="
            + $('#txtHoliNameSearch').val(),
        success: function (result) {
            $("#dvHoliday").html(result);
            $("#dvEditMain").show();
        },
        error: function () {
            $("#main").unblock();
        },
        complete: function () {
            $("#main").unblock();
        }
    });
}

function fnDownloadExcel() {
    if ($("#cboYear").val() == "0") {
        fnMsgAlert('info', 'Info', 'Please select atleast any one year');
        return;
    }
    if (selectedRegionCodes == undefined) {
        fnMsgAlert('info', 'Info', 'Please select atleast any one region');
        fnHideTree();
        return;
    }
    var regionCodes = selectedRegionCodes + ",";
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/Region/GenerateYearWiseHolidayExcel/',
        type: "POST",
        data: "regionCodes=" + regionCodes + "&year=" + $("#cboYear").val() + "&pageNumber=1&excelDownload=true&SearchKey="
            + $('#txtHoliNameSearch').val(),
        success: function (result) {
            $("#lnkDownload").attr("href", result)
            $("#lnkDownload").show();
            $("#dvEditMain").show();
        },
        error: function () {
        },
        complete: function () {
            $("#main").unblock();
        }
    });
}

function fnGoToPrevPage() {
    var pno = parseInt($('#pageno').html()) - 1;
    fnGetHolidayDetails(pno);
}
function fnGoToNextPage() {
    var pno = parseInt($('#pageno').html()) + 1;
    fnGetHolidayDetails(pno);
}
function fnGoToPage() {
    var pno = $('#drpPaging :selected').val();
    fnGetHolidayDetails(pno);
}
function fnEditHoliday(holidayCode, obj) {
    var id = obj.id;
    var holidayDate = $("#" + id.replace("aEdit", "lblHolidayDate")).html();
    var holidayName = $("#" + id.replace("aEdit", "lblHolidayName")).html();
    var regionCode = $("#" + id.replace("aEdit", "hdnRegionCode")).val();
    var date = new Date(holidayDate.split('/')[2] + "-" + holidayDate.split('/')[1] + "-" + holidayDate.split('/')[0]);
    //var serverDate = new Date(curdate.split('.')[2] + "-" + curdate.split('.')[1] + "-" + curdate.split('.')[0]);
    var dateDiff = fnGetDateDifference(date);
    if (dateDiff < 0) {
        fnMsgAlert('info', 'Info', 'Dear ' + $("#spnUser").html().split(',')[0] + ' ,</br> Since the selected date is a past date, ' +
        'you are not allowed to Edit / Delete the holiday details');
        return;
    }
    $("#hdnMode").val("EDIT");
    $("#hdnRegionCode").val(regionCode);
    $("#hdnHolidayDate").val(holidayDate);
    $('#hdnHolidayCode').val(holidayCode);
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/Region/GetMappedHolidaysByDate/',
        type: "POST",
        data: "holidayDate=" + holidayDate,
        success: function (result) {
            jsonResult = eval(result);
            if (jsonResult.length > 1) {
                $("#dvInfoMsg").html('Dear ' + $("#spnUser").html().split(',')[0] + ' </br> The same date (' + holidayDate + ' | ' + holidayName + ') ,' +
                    "is also assigned as holiday to more than one region. Do you wish to apply the changes to all mapped regions. </br>" +
                    "Click 'Yes' to apply the changes to all regions </br>" +
                    "Click 'No' to apply the changes only to the selected region </br>" +
                    "Click 'Cancel' to ignore the edit action </br>");
                $("#dvAlert").css('zIndex', 999999);
                $("#dvAlert").dialog({
                    resizable: true,
                    height: 300,
                    modal: true,
                    buttons: {
                        Yes: function () { $(this).dialog("close"); fnOpenEditedPopUp("YES", jsonResult, holidayDate, holidayName); },
                        No: function () { $(this).dialog("close"); fnOpenEditedPopUp("NO", jsonResult, holidayDate, holidayName); },
                        Cancel: function () {
                            $(this).dialog("close");
                            $("#dvEditHolidayPopUp").overlay().close();
                        }
                    }
                });
            }
            else {
                fnOpenEditedPopUp("NO", jsonResult, holidayDate, holidayName);
            }
        },
        error: function () {
            $("#main").unblock();
        },
        complete: function () {
            $("#main").unblock();
        }
    });
}

function fnOpenEditedPopUp(mode, jsonResult, holidayDate, holidayName) {
    var content = "";
    if (mode == "YES") {
        $("#txtEHolidayDate").val(holidayDate);
        $("#txtEHolidayName").val(holidayName);
        content += "<table id='tblRegions' class='table table-striped'><thead><tr><td>S.No</td>";
        content += "<td><input type='checkbox' name='chkSelectAll' onclick='fnSelectAll();' /></td>";
        content += "<td>Date</td><td>Holiday Name</td>";
        content += "<td>Region Name</td><td>Region Type</td></tr></thead>";
        for (var i = 0; i < jsonResult.length; i++) {
            content += "<tr><td>" + (parseInt(i) + 1) + "</td>";
            content += "<td><input type='checkbox' name='chkSelect' id='chkSelect_" + parseInt(i) + 1 + "' value='" + jsonResult[i].Region_Code + "'/></td>";
            content += "<td>" + jsonResult[i].Holiday_Date + "</td>";
            content += "<td>" + jsonResult[i].Holiday_Name + "</td>";
            content += "<td>" + jsonResult[i].Region_Name + "</td>";
            content += "<td>" + jsonResult[i].Region_Type_Name + "</td>";
            content += "</tr>";
        }
        content += "</tbody></table>";
        $("#dvMappedRegions").html(content);
        $("#dvEditHolidayPopUp").overlay().load();
    }
    else {
        $("#txtSEHolidayDate").val(holidayDate);
        $("#txtSEHolidayName").val(holidayName);
        $("#dvSingleEditHolidayPopUp").overlay().load();
    }

}

function fnSelectAll() {
    if ($("input:checkbox[name=chkSelectAll]").attr("checked") == "checked") {
        $("input:checkbox[name=chkSelect]").each(function () {
            this.checked = true;
        });
    }
    else {
        $("input:checkbox[name=chkSelect]").each(function () {
            this.checked = false;
        });
    }
}

function fnDeleteHoliday(holidayCode, obj) {
    if (confirm('Do you want to delete this record?')) {
        $("#hdnMode").val("DELETE");
        var id = obj.id;
        var holidayDate = $("#" + id.replace("aDelete", "lblHolidayDate")).html();
        var regionCode = $("#" + id.replace("aDelete", "hdnRegionCode")).val();
        var date = new Date(holidayDate.split('/')[2] + "-" + holidayDate.split('/')[1] + "-" + holidayDate.split('/')[0]);
        //var serverDate = new Date(curdate.split('.')[2] + "-" + curdate.split('.')[1] + "-" + curdate.split('.')[0]);
        var dateDiff = fnGetDateDifference( date);
        if (dateDiff < 0) {
            fnMsgAlert('info', 'Info', 'Dear ' + $("#spnUser").html().split(',')[0] + ' ,</br> Since the selected date is a past date, ' +
            'you are not allowed to Edit / Delete the holiday details');
            return;
        }
        $('#main').block({
            message: '<h3>Processing</h3>',
            css: { border: '2px solid #ddd' }
        });
        $.ajax({
            url: '../HiDoctor_Master/Region/InsertHolidayMaster/',
            type: "POST",
            data: "regionCodes=" + regionCode + "&holidayDate=&holidayName=&mode=" + $("#hdnMode").val() + "&holidayCode=" + holidayCode + "",
            success: function (result) {
                if (!isNaN(result)) {
                    if (parseInt(result) > 0) {
                        fnMsgAlert('success', 'Success', 'Record is deleted successfully');
                        $("#hdnMode").val('INSERT');
                        var parent = $(obj).parent().parent();
                        parent.fadeOut('slow', function () { });
                        fnGetRegions();
                        fnSelectAllUnMappedRegions();
                    }
                    else {
                        fnMsgAlert('info', 'Error', 'Error while delete the holiday');
                    }
                }
            },
            error: function () {
                $("#main").unblock();
            },
            complete: function () {
                $("#main").unblock();
            }
        });
    }
}

function fnUpdate() {
    var holidayDate = $("#txtEHolidayDate").val();
    var holidayName = $("#txtEHolidayName").val();
    var regionCodes = new Array();
    var count = 0;
    $("input:checkbox[name=chkSelect]").each(function () {
        if (this.checked) {
            regionCodes.push(this.value);
            count = parseInt(count) + 1;
        }
    });
    if (count == 0) {
        fnMsgAlert('info', 'Validate', 'Please select atleast anyone region');
        return;
    }
    if (holidayDate != $("#hdnHolidayDate").val()) {
        fnValidateHoliday("EDIT", holidayDate, holidayName, regionCodes);
    }
    else {
        $('#hdnMode').val('EDIT');
        fnSubmitHoliday(regionCodes);
    }

}

function fnCloseEdit() {
    $("#dvEditHolidayPopUp").overlay().close();
}
function fnCloseSingleEdit() {
    $("#dvSingleEditHolidayPopUp").overlay().close();
}
function fnSingleUpdate() {
    $("#hdnMode").val('SINGLE_EDIT');
    var holidayDate = $("#txtSEHolidayDate").val();
    var holidayName = $("#txtSEHolidayName").val();
    var regionCode = $("#hdnRegionCode").val();
    var count = 0;
    if (holidayDate != $("#hdnHolidayDate").val()) {
        //fnValidateHoliday("EDIT", holidayDate, holidayName, regionCodes);
        $('#dvSingleEditHolidayPopUp').block({
            message: '<h3>Processing</h3>',
            css: { border: '2px solid #ddd' }
        });
        $.ajax({
            url: '../HiDoctor_Master/Region/GetMappedHolidaysByDate/',
            type: "POST",
            data: "holidayDate=" + holidayDate,
            success: function (result) {
                var jsonResult = eval(result);
                if (jsonResult.length > 0) {
                    var disJson = jsonPath(jsonResult, "$.[?(@.Region_Code=='" + regionCode + "')]");
                    if (disJson != false) {
                        if (confirm('Dear ' + $("#spnUser").html().split(',')[0] + ' , Selected date is already assigned as holiday to this region ' +
                                       '(i.e.' + holidayName + '). Do you want to update this record?')) {
                            fnSubmitHoliday(regionCode);
                        }
                    }
                    else {
                        fnSubmitHoliday(regionCode);
                    }
                }
                else {
                    fnSubmitHoliday(regionCode);
                }
            },
            error: function () {
                $("#dvSingleEditHolidayPopUp").unblock();
            },
            complete: function () {
                $("#dvSingleEditHolidayPopUp").unblock();
            }
        });

    }
    else {
        $("#txtEHolidayDate").val(holidayDate);
        $("#txtEHolidayName").val(holidayName);
        $('#hdnMode').val('EDIT');
        fnSubmitHoliday(regionCode);
    }

}

function fnSearchHoliday() {
    if ($.trim($("#txtSearchHolidayDate").val()) == "") {
        fnMsgAlert('info', 'Info', 'Please select holiday date');
        return;
    }
    var result = isValidDateFormat($("#txtSearchHolidayDate"));
    if (!result) {
        fnMsgAlert('info', 'Info', 'Please enter valid date');
        return;
    }
    $("#hdnSearchDate").val($("#txtSearchHolidayDate").val());
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/Region/GetSearchHolidayDetails/',
        type: "POST",
        data: "holidayDate=" + $("#txtSearchHolidayDate").val(),
        success: function (result) {
            $("#dvSearchResult").html(result);
            $('#dvExcelDown').show();
        },
        error: function () {
            $("#main").unblock();
        },
        complete: function () {
            $("#main").unblock();
        }
    });
}

function fnGetRegions() {
    $("#dvToRegions").html('');
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/Region/GetRegionsForHolidaySearch/',
        type: "POST",
        data: "A",
        success: function (result) {
            if (result != '') {
                var fromRegions = eval(result.split('~')[0]);
                if (fromRegions.length > 0) {
                    $("#cboSourceRegion").append("<option value=''>-Select Region-</option>");
                    for (var i = 0; i < fromRegions.length; i++) {
                        $("#cboSourceRegion").append("<option value='" + fromRegions[i].Region_Code + "'>" + fromRegions[i].Region_Name + "</option>");
                    }
                }
                else {
                    fnMsgAlert('info', 'None of the region has holiday mapping');
                    return;
                }
                $("#dvToRegions").html(result.split('~')[1]);
                // $(".chkAllUnMappedRegion").click(function () { fnSelectAllUnMappedRegions(this); });
            }
            else {
                fnMsgAlert('info', 'Info', 'None of the region has holiday mapping');
                return;
            }
        },
        error: function () {
            $("#main").unblock();
        },
        complete: function () {
            $("#main").unblock();
        }
    });
}

function fnHideTree() {
    if ($("#spnTree").html() == "Hide Tree") {
        $("#dvLeftPanel").hide();
        $("#dvRightPanel").removeClass('col-lg-8');
        $("#dvRightPanel").addClass('col-lg-12');
        $("#spnTree").html('Show Tree');
    }
    else if ($("#spnTree").html() == "Show Tree") {
        $("#dvLeftPanel").show();
        $("#dvLeftPanel").addClass('col-sm-4');
        $("#dvRightPanel").removeClass('col-lg-12');
        $("#dvRightPanel").addClass('col-lg-8');
        $("#spnTree").html('Hide Tree');
    }

}

function fnHide() {
    $("#spnTree").html('Hide Tree');
    fnHideTree();
}

function fnSelectAllUnMappedRegions(obj) {
    if ($("input:checkbox[name=chkAllUnMappedRegion]").attr("checked") == "checked") {
        $("input:checkbox[name=chkUnMappedRegion]").each(function () {
            this.checked = true;
        });
    }
    else {
        $("input:checkbox[name=chkUnMappedRegion]").each(function () {
            this.checked = false;
        });
    }
}
//
function fnCopy() {
    debugger;
    var count = 0;
    var regionCodes = "";
    $("input:checkbox[name=chkUnMappedRegion]").each(function () {
        if (this.checked) {
            regionCodes += this.value + ",";
            count = parseInt(count) + 1;
        }
    });
    if ($("#cboSourceRegion").val() == "") {
        fnMsgAlert('info', 'Validate', 'Please select copy from region');
        return;
    }
    if (count > 0) {
        regionCodes = regionCodes.slice(0, -1);
    }
    else {
        fnMsgAlert('info', 'Validate', 'Please select atleast one copy to region');
        return;
    }

    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });

    $.ajax({
        url: '../HiDoctor_Master/Region/HolidayInheritance/',
        type: "POST",
        data: "sourceRegion=" + $("#cboSourceRegion").val() + "&destinationRegions=" + regionCodes + "",
        success: function (result) {
            if (result != '') {
                if (parseInt(result) > 0) {
                    fnMsgAlert('success', 'Success', 'Holiday copied successfully');
                    fnGetRegions();
                    $("#cboSourceRegion").val('');
                }
                else {
                    fnMsgAlert('info', 'Info', 'There is no upcoming holidays mapped for the source region');
                    fnGetRegions();
                    $("#cboSourceRegion").val('');
                }
            }
            else {
                fnMsgAlert('info', 'Error', 'Error while copying the holiday');
                return;
            }
        },
        error: function () {
            $("#main").unblock();
        },
        complete: function () {
            $("#main").unblock();
        }
    });
}
function fnUploadHolidayExcelFile() {
    debugger;

    var filedata = new FormData();
    var fileUpload = $("#HMFile").get(0);
    var file = fileUpload.files;
    if (file.length > 0) {
        var Formate = getFileExtension(file[0].name);
        if (Formate == 'xlsx') {
            $('#main').block({
                message: '<h3>Processing</h3>',
                css: { border: '2px solid #ddd' }
            });
            try {
                filedata.append(file[0].name, file[0]);
                $.ajax({
                    url: '../HiDoctor_Master/Region/UploadHolidayExcelFile',
                    type: "POST",
                    data: filedata,
                    contentType: false,
                    processData: false,
                    success: function (result) {
                        $("#main").unblock();
                        if (result == "SUCCESS") {
                            $("#dvMsgSuccess").html("Holiday excel uploaded successfully.Please click on the Go to Batch processing screen link to view the status of the upload");
                            $("#divBatchprocessing").show();
                            $("#dvMsgSuccess").show();
                        }
                        else {
                            fnMsgAlert('error', 'Holiday Excel Upload', result);
                        }
                    },
                    error: function (xhr, errorType, exception) {
                        $("#main").unblock();
                        fnMsgAlert('error', 'Error', 'File not found');
                    }
                });
            }
            catch (err) {
                $("#main").unblock();
                fnMsgAlert('error', 'Error', err.message);
            }
        } else {
            fnMsgAlert('error', 'Holiday Excel Upload', 'Please upload .xlsx file format.');
        }
    }
    else {
        fnMsgAlert('error', 'Holiday Excel Upload', 'Please Select Excel file');
    }
}
function fnRedirectToBP(page) {
    $('#main').load('../BatchProcessing/Index?bpType=' + page);
}
function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}