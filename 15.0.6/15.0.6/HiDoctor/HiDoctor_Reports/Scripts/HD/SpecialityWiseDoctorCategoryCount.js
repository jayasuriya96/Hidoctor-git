//Created By:Sumathi.M
//Date : 2/5/2013


//For ClickingRegiontree View
function fnShowspecialitydoctorcategoryReport() {
    if ($('#optViewInScreen').attr('checked') == "checked") {
        fnGetSpecialitywiseDoctorcategoryCountinHTMLFormat();
    }
    else if ($('#optExportToExcel').attr('checked') == "checked") {
        fnGetSpecialitywiseDoctorcategoryCountIntoExcelExport();
    }
}

//Get Grid Format
function fnGetSpecialitywiseDoctorcategoryCountinHTMLFormat() {
    var regionCode = $('#hdnRegionCode').val();
    if (regionCode == '') {
        fnMsgAlert('info', 'Info', 'Please Select any Region from Region Tree');
        return false;
    }
    GetSpecialitywiseDoctorCategoryCount(regionCode, "S");
}

//Get Excel Format
function fnGetSpecialitywiseDoctorcategoryCountIntoExcelExport() {
    var regionCode = $('#hdnRegionCode').val();
    if (regionCode == '') {
        fnMsgAlert('info', 'Info', 'Please Select any Region from Region Tree');
        return false;
    }
    GetSpecialitywiseDoctorCategoryCount(regionCode, "E");
}


//Bind the data with Html Table
function GetSpecialitywiseDoctorCategoryCount(regionCode, viewFormat) {
    $('#dvSpeciality').block({
        message: 'Retriveing data...',
        css: { border: '1px solid #ddd' }
    });
    $.ajax({
        type: 'POST',
        data: "regionCode=" + regionCode + "&viewFormat=" + viewFormat +"&title=" + $("#divPageHeader").html(),
        url: '../ReportsLevelThree/GetSpecialitywiseDoctorcategoryCountdetails',
        success: function (response) {
            if (response != '') {
                $('#divSpecialitywiseDoctorcategoryCount').html(response);
            }
            $("#dvSpeciality").unblock();
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message.split('^')[1]);
            // $('#hdnRegionCode').val()
            $("#dvSpeciality").unblock();
        }
    });
}
