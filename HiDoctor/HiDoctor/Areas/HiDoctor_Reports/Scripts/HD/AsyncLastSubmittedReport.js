function fnGetLastSubmittedReport() {

    ShowModalPopup("dvloading");

    $('#dvExcelPrint').hide();
    $('#lnkExcel').hide();
    $("#dvTree").hide();
    $('#divInput').show();
    $("#spnTreeToggle").html('Show Tree');
    $('#divToggle').show();
    $("#divMain").css('width', '100%');

    $("#divCompReport").html("");
    $("#divCompPrint").html("");

    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'Last Submitted Report', 'Select start date.');
        HideModalPopup("dvloading");
        return false;
    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'Last Submitted Report', 'Select end date.');
        HideModalPopup("dvloading");
        return false;
    }

    var unlistedDoctor = $('input:radio[name=Unlisted]:checked').val();
    var DCRDate = "ACTUAL";

    var FromDateArr = $("#txtFromDate").val().split('/');
    var ToDateArr = $("#txtToDate").val().split('/');
    var dt1 = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
    var dt2 = new Date(ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0]);
    if (new Date(dt1).toString() == 'Invalid Date') {
        $("#txtFromDate").val('');
        fnMsgAlert('info', 'Last Submitted Report', 'Invalid Date format');
        HideModalPopup("dvloading");
        return false;
    }
    if (new Date(dt2).toString() == 'Invalid Date') {
        $("#txtToDate").val('');
        fnMsgAlert('info', 'Last Submitted Report', 'Invalid Date format');
        HideModalPopup("dvloading");
        return false;
    }
    if (dt1 > dt2) {
        fnMsgAlert('info', 'Last Submitted Report', 'Start date should be less than End date.');
        HideModalPopup("dvloading");
        return false;
    }

    var noOfDays = dt2 - dt1;
    noOfDays = Math.round(noOfDays / 1000 / 60 / 60 / 24);

    if (noOfDays > 92) {

        fnMsgAlert('info', 'Last Submitted Report', 'Start date and end date should not be greater than 92 days.');
        HideModalPopup("dvloading");
        return false;
    }
    var doctorMissed = "";
    if ($(":checkbox[name=missed]:checked").length > 0) {
        doctorMissed = "MISSED";
    }

    var userCode = selKeys_ls;
    var reportViewType = $("input:radio[name=rdReportView]:checked").val();

    if (userCode == "") {
        fnMsgAlert('info', 'Last Submitted Report', 'Please select atleast one user.');
        HideModalPopup("dvloading");
        return false;
    }
    $('#hdnDownload').val('');
    $('#hdnDownload').val(userCode);
    $('#dvAsynReport').html("");
    $('#dvAsynMsg').html("");
    $("#divInput").slideUp();
    $("#spnInputToggle").html("Show Input");
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/AysncReports/ProcessLastSubmittedReport',
        data: 'userCode=' + userCode + '&sd=' + FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0] + '&ed=' + ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0] + '&type=' + unlistedDoctor + '&selectionType=' + DCRDate + '&title=' + $("#divPageHeader").html() + '&missed=' + doctorMissed + '&reportViewType=' + reportViewType,
        success: function (response) {
            $("#divReport").html('');
            if (response != "") {
                $('#dvAsynMsg').html('Report submitted for processing...Trasaction Reference Number:' + response);
                fnGetAsynReportstatus('LastSubmittedReport');
                $('#tblLastSubmittedReport').tablePagination({});
                $("#dvRptQueuePanel").show();
                $("#dvAsynMsg").show();
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

function fnGetViewAllLastSubmittedReport() {

    ShowModalPopup("dvloading");
    $('#dvExcelPrint').hide();
    $('#lnkExcel').hide();
    $("#dvTree").hide();
    $('#divInput').show();
    $("#spnTreeToggle").html('Show Tree');
    $('#divToggle').show();
    $("#divMain").css('width', '100%');

    $("#divCompReport").html("");
    $("#divCompPrint").html("");

    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'Last Submitted Report', 'Select start date.');
        HideModalPopup("dvloading");
        return false;
    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'Last Submitted Report', 'Select end date.');
        HideModalPopup("dvloading");
        return false;
    }
    var unlistedDoctor = $('input:radio[name=Unlisted]:checked').val();
    var DCRDate = "ACTUAL";

    var FromDateArr = $("#txtFromDate").val().split('/');
    var ToDateArr = $("#txtToDate").val().split('/');
    var dt1 = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
    var dt2 = new Date(ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0]);
    if (new Date(dt1).toString() == 'Invalid Date') {
        $("#txtFromDate").val('');
        fnMsgAlert('info', 'Last Submitted Report', 'Invalid Date format');
        HideModalPopup("dvloading");
        return false;
    }
    if (new Date(dt2).toString() == 'Invalid Date') {
        $("#txtToDate").val('');
        fnMsgAlert('info', 'Last Submitted Report', 'Invalid Date format');
        HideModalPopup("dvloading");
        return false;
    }
    if (dt1 > dt2) {
        fnMsgAlert('info', 'Last Submitted Report', 'Start date should be less than End date.');
        HideModalPopup("dvloading");
        return false;
    }

    var noOfDays = dt2 - dt1;
    noOfDays = Math.round(noOfDays / 1000 / 60 / 60 / 24);

    if (noOfDays > 92) {

        fnMsgAlert('info', 'Last Submitted Report', 'Start date and end date should not be greater than 92 days.');
        HideModalPopup("dvloading");
        return false;
    }
    var doctorMissed = "";
    if ($(":checkbox[name=missed]:checked").length > 0) {
        doctorMissed = "MISSED";
    }
    var userCode = "ALL";
    $('#hdnDownload').val('');
    $('#hdnDownload').val(userCode);
    var reportViewType = $("input:radio[name=rdReportView]:checked").val();
    $("#divInput").slideUp();
    $("#spnInputToggle").html("Show Input");
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/AysncReports/ProcessLastSubmittedReport',
        data: 'userCode=' + userCode + '&sd=' + FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0] + '&ed=' + ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0] + '&type=' + unlistedDoctor + '&selectionType=' + DCRDate + '&title=' + $("#divPageHeader").html() + '&missed=' + doctorMissed + '&reportViewType=' + reportViewType,
        success: function (response) {
            $("#divReport").html('');
            if (response != "") {
                $('#dvAsynMsg').html('Report submitted for processing...Trasaction Reference Number:' + response);
                fnGetAsynReportstatus('LastSubmittedReport');
                $('#tblLastSubmittedReport').tablePagination({});
                $("#dvRptQueuePanel").show();
                $("#dvAsynMsg").show();
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