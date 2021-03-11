function fnToggleTree() {
    if ($("#spnDivToggle").html() == "Hide Filter") {

        $("#tblTr").hide();
        $("#spnDivToggle").html('Show Filter');
    }
    else if ($("#spnDivToggle").html() == "Show Filter") {
        $("#tblTr").show();
        $("#spnDivToggle").html('Hide Filter');
    }
}

function fnToggleReport() {
    if ($("#spnDivToggle").html() == "Hide Filter") {

        $("#tblTr").hide();
        $("#tblTr1").hide();
        $("#spnDivToggle").html('Show Filter');
    }
    else if ($("#spnDivToggle").html() == "Show Filter") {
        $("#tblTr").show();
        $("#tblTr1").show();
        $("#spnDivToggle").html('Hide Filter');
    }
}

function fnToggleTreeHeader(divId, tblId) {
    if ($("#" + divId).html() == "Hide Filter") {

        $("#" + tblId).hide();
        $("#" + divId).html('Show Filter');
    }
    else if ($("#" + divId).html() == "Show Filter") {
        $("#" + tblId).show();
        $("#" + divId).html('Hide Filter');
    }
}



function fnValidate() {
    debugger;
    $('#dvAsyn').show();
    fnGetAsynReportstatus();

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
    debugger;

    var FromDateArr = [];
    var ToDateArr = [];

    debugger;

    //var FromDate = "";
    //var ToDate = "";
    //for (var i = 0; i < $("#txtFromDate").val().length; i++) {
    //    FromDate = $("#txtFromDate").val().replace('-', '/');
    //}
    //for (var i = 0; i < $("#txtToDate").val().length; i++) {
    //    ToDate = $("#txtToDate").val().replace('-', '/');
    //}
    //var FromDateArr = FromDate.split('/');
    //var ToDateArr = ToDate.split('/');



    //debugger;
    //var dt1 = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
    //var dt2 = new Date(ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0]);

    //var startDate = FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0];
    //var endDate = ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0];
    //$('#txtFromDate').val(startDate);
    //$('#txtToDate').val(endDate);

    //FromDateArr = [];
    //ToDateArr = [];

    debugger;
    //if (dt1 > dt2) {
    //    fnMsgAlert('info', 'Last Submitted Report', 'Start date should be less than End date.');
    //    HideModalPopup("dvloading");
    //    return false;
    //}

    //var noOfDays = dt2 - dt1;
    //noOfDays = Math.round(noOfDays / 1000 / 60 / 60 / 24);

    //if (noOfDays > 92) {

    //    fnMsgAlert('info', 'Last Submitted Report', 'Start date and end date should not be greater than 92 days.');
    //    HideModalPopup("dvloading");
    //    return false;
    //}


    var userCode = selKeys_ls;
    //var reportViewType = $("input:radio[name=rdReportView]:checked").val();

    if (userCode == "") {
        fnMsgAlert('info', 'Last Submitted Report', 'Please select atleast one user.');
        HideModalPopup("dvloading");
        return false;
    }

    $("#hdnUserCode").val(userCode);
    $("#hdnDownload").val(userCode);
    $("#divInput").slideUp();
    $("#spnInputToggle").html("Show Input");
}

function fnGetAsyncLastsubmitReport(val) {
    $('#dvAsynReport').html('');
    $('#divPrint').html('');
    var UnlistedDoc = "", MissedDoc = "";
    debugger;
    if ($('input:radio[id=rdInClude]').prop('checked') == true) {
        UnlistedDoc = "1";
    }
    else if ($('input:radio[id=rdInClude]').prop('checked') == false) {
        UnlistedDoc = "0";
    }
    if ($("input:checkbox[name=missed]:checked").length != 0) {
        MissedDoc = "1";
    }
    else {
        MissedDoc = "0";
    }

    var FromDate = "";
    var ToDate = "";
    for (var i = 0; i < $("#txtFromDate").val().length; i++) {
        FromDate = $("#txtFromDate").val().replace('-', '/');
    }
    for (var i = 0; i < $("#txtToDate").val().length; i++) {
        ToDate = $("#txtToDate").val().replace('-', '/');
    }
    var FromDateArr = FromDate.split('/');
    var ToDateArr = ToDate.split('/');

    var startDate = FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0];
    var endDate = ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0];
    //$('#txtFromDate').val(startDate);
    //$('#txtToDate').val(endDate);


    var requestId = val;
    $.ajax({
        type: 'POST',
        url: '../AsynLastsubmittedRept/GetAsyncReport',
        data: 'requestId=' + requestId + "&MissedDoc=" + MissedDoc + "&UnlistedDoc=" + UnlistedDoc+"&startDate="+startDate+"&endDate="+endDate,
        success: function (response) {
            if (response != null && response != '') {
                debugger;
                $('#dvAsynReport').html(response);
                $('#divPrint').html(response);
                $('#DcrDisclaimer').show();

                $('#tblAsynLastsubrept').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }

                });
                fninializePrint("divPrint", "ifrmPrint", "dvAsynReport");
                HideModalPopup("dvloading");
            }
        }
    });
}


function fnGetAsynReportstatus() {
    $.ajax({
        type: 'GET',
        data: 'A',
        url: '../AsynLastsubmittedRept/GetAsynReportstatus',
        success: function (response) {
            if (response != '' && response != null) {
                $('#dvReprotURL').html(response);
            }
            $("#dvAjaxLoad").hide();
        }
    });
}

function fnRefresh() {
    $('#dvAsynReport').html('');
    $('#dvLegends').html('');
    $('#DcrDisclaimer').hide();
    fnGetAsynReportstatus();
}