function fnTpVsActualDeviationSummaryReport() {
    debugger;
    ShowModalPopup("dvloading");

    if ($("#hdnMainUserCode").val() == "") {
        fnMsgAlert('info', screenName, 'Please select the user.');
        HideModalPopup("dvloading");
        return false;
    }

    if (fnValidateTpVsActualDoctorVisits("TP Vs Actual Deviation Summary")) {

        $("#divSubReport").empty();
        $("#divHeader").empty();
        $("#divSubReport").hide();
        $("#divHeader").hide();
        $('#dvRptQueuePanel').show();
        $('#dvRptPanel').hide();
        $('#dvAsynMsg').show();
        $("#dvAsynReport").show();
        $('#dvAsynReport').html("");
        $('#dvAsynMsg').html("");
        $("#dvTree").hide();
        $("#lnkTree").html('Show Tree');

        var month = fngetMonthNumber($('#txtFromDate').val().split('-')[0]);
        var year = $('#txtFromDate').val().split('-')[1];
        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Reports/AysncReports/ProcessTPvsActualSummaryReport',
            data: 'month=' + month + '&year=' + year + '&userCode=' + $("#hdnMainUserCode").val(),
            success: function (response) {
                debugger;
                /*$("#divReport").html(response);
                $("#divReport").append('<div style="clear:both"></div>');
                $("#divPrint").html(response);
                $('#tblTpVsActualDeviationSummaryReport').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true
                    , "sDom": 'T<"clear">lfrtip'
                }).dataTable()*/
               
              
                $('#dvAsynMsg').html('Report submitted for processing...Trasaction Reference Number:' + response);
                fnGetAsynReportstatus('TPvsActualSummaryReport');
                HideModalPopup("dvloading");
            },
            error: function () {
                fnMsgAlert('info', 'Report', 'Error.');
                HideModalPopup("dvloading");
            }
        });
    }

}

function fnValidateTpVsActualDoctorVisits(screenName) {
    debugger;
    
    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', screenName, 'Please select month.');
        //$("#txtFromDate").focus();
        HideModalPopup("dvloading");
        return false;
    }
    return true;
}

function fnRedirectToDeviationDetails(regionCode) {
    $("#divSubReport").hide();
    $("#divHeader").hide();
    $('#hdnRegionCode').val(regionCode);
    fnGetTPvsActualDeviationDetails();
    $("#divSubReport").show();
    $("#divHeader").show();
}