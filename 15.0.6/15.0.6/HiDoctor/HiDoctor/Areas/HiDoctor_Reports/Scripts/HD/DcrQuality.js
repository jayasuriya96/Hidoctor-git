//Created By:SRI//
//Created date :21-01-2014//
function fnBindRegionTypes() {
    var nodeVal = $('#hdnRegionCode').val();
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetChildRegionType',
        data: "regionCode=" + nodeVal.split('_')[0],
        success: function (response) {
            var tableContent = "";
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
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

//Dcr Quvality Report//

//To check and Uncheck All
function checkAll() {
    if ($('#chkAll').attr('checked') == 'checked') {
        $('.clsCheck').attr('checked', 'checked')
    }
    else {
        $('.clsCheck').attr('checked', false);
    }
}
//To check All
function chkAllChecked() {
    if ($('.clsCheck:checked').length == 4) {
        $('#chkAll').attr('checked', 'checked');
    }
    else {
        $('#chkAll').attr('checked', false);
    }
}
function fnShowDcrQualityreport() {
    $("#dvTable").html("");
    ShowModalPopup("dvloading");
    fnCloseTree();
    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'DCR Quality Report', 'Select Start Date.');
        HideModalPopup("dvloading");
        return false;
    }

    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'DCR Quality Report', 'Select End Date.');
        HideModalPopup("dvloading");
        return false;
    }
    if ($.trim($("#txtFromDate").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Please Select StartDate.');
        HideModalPopup("dvloading");
        return false;
    }

    if ($.trim($("#txtToDate").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Please Select EndDate.');
        HideModalPopup("dvloading");
        return false;
    }

    if (!(fnValidateDateFormate($("#txtFromDate"), "StartDate"))) {
        HideModalPopup("dvloading");
        return false;
    }
    if (!(fnValidateDateFormate($("#txtToDate"), "EndDate"))) {
        HideModalPopup("dvloading");
        return false;
    }



    var FromDateArr = $("#txtFromDate").val().split('/');
    var ToDateArr = $("#txtToDate").val().split('/');
    var dt1 = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
    var dt2 = new Date(ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Info', 'Start Date Can not be Greater than the End Date');
        HideModalPopup("dvloading");
        return false;
    }
    var selectedval = "";
    var adjustType = $('input:checkbox[name=DcrStatus]:checked');
    for (var intLoop = 0; intLoop < adjustType.length; intLoop++) {
        selectedval += adjustType[intLoop].value + "^";
        if (adjustType[intLoop].value.length > 4) {
            selectedval = "1^2^0^";
            break;
        }
    }
    if (selectedval != "") {
        selectedval = selectedval.substring(0, selectedval.length - 1);
    }
    else {
        fnMsgAlert('info', 'DCR Quality Report', 'Select atleast one dcr Status.');
        HideModalPopup("dvloading");
        return false;
    }

    if ($("#txtDoctorCount").val() == "") {
        fnMsgAlert('info', 'DCR Quality Report', 'Enter Doctor Value.');
        HideModalPopup("dvloading");
        return false;
    }

    if ($("#txtDocChemistValue").val() == "") {
        fnMsgAlert('info', 'DCR Quality Report', 'Enter Chemist Value.');
        HideModalPopup("dvloading");
        return false;
    }

    if ($("#txtSample").val() == "") {
        fnMsgAlert('info', 'DCR Quality Report', 'Enter ProductSample Value.');
        HideModalPopup("dvloading");
        return false;
    }

    if (isNaN($("#txtDoctorCount").val())) {
        alert('MUST BE A NUMBER')
        return false;
    }
    if (isNaN($("#txtDocChemistValue").val())) {
        alert('MUST BE A NUMBER')
        return false;
    }
    if (isNaN($("#txtSample").val())) {
        alert('MUST BE A NUMBER')
        return false;
    }
    var regionCode = $('#hdnRegionCode').val();

    var startDate = $("#txtFromDate").val();
    var endDate = $("#txtToDate").val();

    startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
    endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];

    var regiontypelevel1 = $("#drplevelOne option:selected").val();
    var regiontypelevel2 = $("#drplevelTwo option:selected").val();

  
    //Average Doctors Filter Val//

    var ddldocFilter = $("#ddldrs option:selected").val();
    var doctorCount = $("#txtDoctorCount").val();
    var doctorcondition = $("#ddlCondition option:selected").val();

    //Doctor Wise Chemist Filter Val//

    var docChemistFilter = $("#ddlDocChemistFilter option:selected").val();
    var docChemistCount = $("#txtDocChemistValue").val();
    var docChemistcondition = $("#ddlDocChemistCondition option:selected").val();

    //Doctor Wise sample/Detailed Filter val//


    var sampleFilter = $("#ddlSampleFilter option:selected").val();
    var sampleCount = $("#txtSample").val();
    var samplecondition = $("#ddlSampleCondition option:selected").val();

    var viewFormat = $("input[name='rptOptions']:checked").val()


    $.ajax({
        type: "POST",
        url: '../HiDoctor_Reports/ReportsLevelThree/GetDCRQualityDetailFormat',
        data: "regionCode=" + regionCode + "&startDate=" + startDate + "&endDate=" + endDate +
            "&regionTypeLevelone=" + regiontypelevel1 + "&regionTypeLeveltwo=" + regiontypelevel2 + "&DcrStatus=" + selectedval +
            "&docFilter=" + ddldocFilter + "&docCount=" + doctorCount + "&docCondition=" + doctorcondition +
            "&chemistFilter=" + docChemistFilter + "&chemistCount=" + docChemistCount + "&chemistCondition=" + docChemistcondition +
            "&sampleFilter=" + sampleFilter + "&sampleCount=" + samplecondition + "&sampleCondition=" + samplecondition + "&viewFormat=" + viewFormat,
        success: function (result) {      
            if (result != '-1') {
                $("#tree").hide();
                $("#dvinput").hide();
                $('#dvdata').addClass('col-lg-12')
                $('#dvdata').removeClass('col-lg-9')
                $("#dvTable").html(result);
               
            }
            else {
                fnMsgAlert('info', 'Product Wise Doctor Report', 'No data Found');
            }
            HideModalPopup("dvloading");

        }
    });
}


//DCR WEEKILY REPORT//
function fnShowDCRWeeklyreport() {
    $("#dvTable").html("");
    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'DCR Quality Report', 'Select Start Date.');
        HideModalPopup("dvloading");
        return false;
    }

    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'DCR Quality Report', 'Select End Date.');
        HideModalPopup("dvloading");
        return false;
    }


    var FromDateArr = $("#txtFromDate").val().split('/');
    var ToDateArr = $("#txtToDate").val().split('/');
    var dt1 = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
    var dt2 = new Date(ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Info', 'Start Date Can not be Greater than the End Date');
        return false;
    }


    var userCode = $('#hdnUserCode').val();


    var startDate = $("#txtFromDate").val();
    var endDate = $("#txtToDate").val();

    startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
    endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];

    var selectedval = "";
    var adjustType = $('input:checkbox[name=DcrStatus]:checked');
    for (var intLoop = 0; intLoop < adjustType.length; intLoop++) {
        selectedval += adjustType[intLoop].value + "^";
        if (adjustType[intLoop].value.length > 4) {
            selectedval = "1^2^0^";
            break;
        }
    }

    var viewFormat = $("input[name='rptOptions']:checked").val()



    $.ajax({
        type: "POST",
        url: '../HiDoctor_Reports/ReportsLevelThree/GetDCRWeeklyReportFormat',
        data: "userCode=" + userCode + "&startDate=" + startDate + "&endDate=" + endDate + "&DcrStatus=" + selectedval + "&viewFormat=" + viewFormat,
        success: function (result) {
            if (result != '') {
                $("#tree").hide();
                $("#dvinput").hide(); 
                $('#dvdata').addClass('col-lg-12')
                $('#dvdata').removeClass('col-lg-9')          
                $("#dvTable").html(result);
            }
            else {
                fnMsgAlert('info', 'Product Wise Doctor Report', 'No data Found');
            }
            HideModalPopup("dvloading");

        }
    });
}

