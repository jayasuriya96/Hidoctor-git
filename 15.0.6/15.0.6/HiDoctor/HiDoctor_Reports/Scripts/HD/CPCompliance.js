//Created By:Sumathi.M
//Date:18/1/2014


//Bind the RegionTypes
function fnBindRegionTypes() {
    $.blockUI();
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetChildRegionType',
        data: "regionCode=" + $("#hdnRegioncode").val(),
        success: function (response) {
            jsData = eval('(' + response + ')');
            $('option', $("#drplevelOne")).remove();
            $('option', $("#drplevelTwo")).remove();

            if (jsData.Tables[0].Rows.length > 0) {
                for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                    $('#drplevelOne').append("<option value='" + jsData.Tables[0].Rows[i].Region_Type_Code + "'>" + jsData.Tables[0].Rows[i].Region_Type_Name + "</option>");
                    $('#drplevelTwo').append("<option value='" + jsData.Tables[0].Rows[i].Region_Type_Code + "'>" + jsData.Tables[0].Rows[i].Region_Type_Name + "</option>");
                }
            }
        },
        error: function (e) {
            fnMsgAlert('info', 'CP Compliance', e.responseText);
        }
    });
}

//Validation
function fnSubValidate() {
    if ($.trim($("#txtFilterVal").val()) == "") {
        fnMsgAlert('info', 'Info', 'Please enter The FilterVal');
        return false;
    }

    if ($('#drpFilter').val() == '0') {
        fnMsgAlert('info', 'Info', 'Select The Filter');
        return false;
    }

    if (isNaN($("#txtFilterVal").val())) {
        fnMsgAlert('info', 'Info', 'Enter The Valid Filter Value');
        return false;
    }
    return true;
}

function fnGetshowLastsubmittedRept() {
    if ($('#optViewInScreen').attr('checked') == "checked") {
        fnGetLastSubmittedreptinHTMLFormat();
    }
    else if ($('#optExportToExcel').attr('checked') == "checked") {
        fnGetLastSubmittedIntoExcelExport();
    }
}


//Get Grid Format
function fnGetLastSubmittedreptinHTMLFormat() {
    if (fnSubvalidate()) {
        var userCodes = "";
        for (var i = 0; i < selKeys.length; i++) {
            userCodes += selKeys[i] + '^';
        }
        var startDate = $('#txtstartDate').val().split('/');
        startDate = startDate[1] + '/' + startDate[0] + '/' + startDate[2];
        var endDate = $('#txtEndDate').val().split('/');
        endDate = endDate[1] + '/' + endDate[0] + '/' + endDate[2];
        GetLastSubmittedQuickReference(userCodes, startDate, endDate, "S");
    }
}

//Get Excel Format
function fnGetLastSubmittedIntoExcelExport() {
    if (fnSubvalidate()) {
        var userCodes = "";
        for (var i = 0; i < selKeys.length; i++) {
            userCodes += selKeys[i] + '^';
        }
        var startDate = $('#txtstartDate').val().split('/');
        startDate = startDate[1] + '/' + startDate[0] + '/' + startDate[2];
        var endDate = $('#txtEndDate').val().split('/');
        endDate = endDate[1] + '/' + endDate[0] + '/' + endDate[2];
        GetLastSubmittedQuickReference(userCodes, startDate, endDate, "E");
    }
}
