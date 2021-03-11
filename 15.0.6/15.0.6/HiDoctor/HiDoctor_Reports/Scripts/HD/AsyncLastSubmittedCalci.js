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
    $('#dvRptQueuePanel').show();
    $('#dvRptPanel').hide();
    $('#dvAsynMsg').show();
    $('#dvAsynReport').html("");
    $('#dvAsynMsg').html("");
    $("#dvTree").hide();
    $("#spnTreeToggle").html('Show Tree');
    $("#divInput").slideUp();
    $("#spnInputToggle").html("Show Input");
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/AysncReports/ProcessLastSubmittedCalciReport',
        data: 'userCode=' + userCode + '&month=' + month + '&year=' + year + '&type=' + unlistedDoctor + '&selectionType=' + DCRDate + '&title=' + $("#divPageHeader").html() + '&missed=' + doctorMissed + '&reportViewType=' + reportViewType + '&childUsersCount=' + JSON.stringify(arrUserandChildcount_g),
        success: function (response) {
            $("#divReport").html('');
            if (response != "") {
                $('#dvAsynMsg').html('Report submitted for processing...Trasaction Reference Number:' + response);
                fnGetAsynReportstatus('LastSubmittedCalciReport');
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
    $('#dvRptQueuePanel').show();
    $('#dvRptPanel').hide();
    $('#dvAsynMsg').show();
    $('#dvAsynReport').html("");
    $('#dvAsynMsg').html("");
    $("#dvTree").hide();
    $("#spnTreeToggle").html('Show Tree');
    $("#divInput").slideUp();
    $("#spnInputToggle").html("Show Input");
    debugger;
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/AysncReports/ProcessLastSubmittedCalciReport',
        data: 'userCode=' + userCode + '&month=' + month + '&year=' + year + '&type=' + unlistedDoctor + '&selectionType=' + DCRDate + '&title=' + $("#divPageHeader").html() + '&missed=' + doctorMissed + '&reportViewType=' + reportViewType + '&childUsersCount=' + JSON.stringify(arrUserandChildcount_g),
        success: function (response) {
            $("#divReport").html('');
            if (response != "") {
                $('#dvAsynMsg').html('Report submitted for processing...Trasaction Reference Number:' + response);
                fnGetAsynReportstatus('LastSubmittedCalciReport');
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
