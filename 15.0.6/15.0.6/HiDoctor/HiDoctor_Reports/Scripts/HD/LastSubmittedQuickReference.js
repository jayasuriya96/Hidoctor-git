//Created By :Sumathi
//Date: 15/1/2014

//Validation
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


//Bind the data with Html Table
function GetLastSubmittedQuickReference(userCodes, startDate, endDate, viewFormat) {
    $('#dvLastsubmitted').block({
        message: 'Retriveing data...',
        css: { border: '1px solid #ddd' }
    });
    $.ajax({
        type: 'POST',
        data: "userCodes=" + userCodes + "&startDate=" + startDate + "&endDate=" + endDate + "&viewFormat=" + viewFormat,
        url: '../ReportsLevelThree/GetLastSubmittedQuickReferenceDetails',
        success: function (response) {
            if (response != '') {
                $('#divLastsubmittedQuickRef').html(response);               
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
        }
    });
}