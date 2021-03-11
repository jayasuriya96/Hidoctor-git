//Created By :SRISUDHAN
//Created Date:11-02-2014

function fnShowreport() {
    ShowModalPopup("dvloading");
    //start month data

    if ($("#txtFromMonth").val() == "") {
        fnMsgAlert('info', 'Work Analysis Report', 'Please Select The Start Month');
        HideModalPopup("dvloading");
        return false;
    }

    if ($("#txtToMonth").val() == "") {
        fnMsgAlert('info', 'Work Analysis Report', 'Please Select The End Month');
        HideModalPopup("dvloading");
        return false;
    }

    var startMonth = "", startYear = "";
    if ($("#txtFromMonth").val().split('-')[0] == "Jan") {
        startMonth = "01";
    }
    else if ($("#txtFromMonth").val().split('-')[0] == "Feb") {
        startMonth = "02";
    }
    else if ($("#txtFromMonth").val().split('-')[0] == "Mar") {
        startMonth = "03";
    }
    else if ($("#txtFromMonth").val().split('-')[0] == "Apr") {
        startMonth = "04";
    }
    else if ($("#txtFromMonth").val().split('-')[0] == "May") {
        startMonth = "05";
    }
    else if ($("#txtFromMonth").val().split('-')[0] == "Jun") {
        startMonth = "06";
    }
    else if ($("#txtFromMonth").val().split('-')[0] == "Jul") {
        startMonth = "07";
    }
    else if ($("#txtFromMonth").val().split('-')[0] == "Aug") {
        startMonth = "08";
    }
    else if ($("#txtFromMonth").val().split('-')[0] == "Sep") {
        startMonth = "09";
    }
    else if ($("#txtFromMonth").val().split('-')[0] == "Oct") {
        startMonth = "10";
    }
    else if ($("#txtFromMonth").val().split('-')[0] == "Nov") {
        startMonth = "11";
    }
    else if ($("#txtFromMonth").val().split('-')[0] == "Dec") {
        startMonth = "12";
    }
    startYear = $("#txtFromMonth").val().split('-')[1];

    //end month data

    var endMonth = "", endYear = "";
    if ($("#txtToMonth").val().split('-')[0] == "Jan") {
        endMonth = "01";
    }
    else if ($("#txtToMonth").val().split('-')[0] == "Feb") {
        endMonth = "02";
    }
    else if ($("#txtToMonth").val().split('-')[0] == "Mar") {
        endMonth = "03";
    }
    else if ($("#txtToMonth").val().split('-')[0] == "Apr") {
        endMonth = "04";
    }
    else if ($("#txtToMonth").val().split('-')[0] == "May") {
        endMonth = "05";
    }
    else if ($("#txtToMonth").val().split('-')[0] == "Jun") {
        endMonth = "06";
    }
    else if ($("#txtToMonth").val().split('-')[0] == "Jul") {
        endMonth = "07";
    }
    else if ($("#txtToMonth").val().split('-')[0] == "Aug") {
        endMonth = "08";
    }
    else if ($("#txtToMonth").val().split('-')[0] == "Sep") {
        endMonth = "09";
    }
    else if ($("#txtToMonth").val().split('-')[0] == "Oct") {
        endMonth = "10";
    }
    else if ($("#txtToMonth").val().split('-')[0] == "Nov") {
        endMonth = "11";
    }
    else if ($("#txtToMonth").val().split('-')[0] == "Dec") {
        endMonth = "12";
    }
    endYear = $("#txtToMonth").val().split('-')[1];
    var dt1 = new Date("1" + "-" + startMonth + "-" + startYear);
    var dt2 = new Date("1" + "-" + endMonth + "-" + endYear);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Info', 'Start Month Can not be Greater than the End Month');
        HideModalPopup("dvloading");
        return false;
    }

    var userCode = $('#hdnUserCode').val();

    var viewFormat = $("input[name='rptOptions']:checked").val();


    $.ajax({
        type: "POST",
        url: '../HiDoctor_Reports/ReportsLevelThree/GetWorkanalysisReportFormat',
        data: "userCode=" + userCode + "&startMonth=" + startMonth + "&startYear=" + startYear + "&endMonth=" + endMonth + "&endYear=" + endYear + "&viewFormat=" + viewFormat,
        success: function (result) {
            if (result != '') {
                $("#tree").hide();
                $("#dvinput").hide();
                $("#lnkExcel").show();
                $('#dvdata').addClass('col-lg-12')
                $('#dvdata').removeClass('col-lg-9')
                $("#imggr").show();
                $("#imgless").hide();
                $("#dvTable").html(result.split('$')[0]);
                $("#lnkExcel").attr('href', result.split('$')[1]);
            }
            else {
                fnMsgAlert('info', 'Product Wise Doctor Report', 'No data Found');
                $("#lnkExcel").hide();
            }
            HideModalPopup("dvloading");

        }
    });

}

function GetnonfieldWorkpopup(val) {
    var userCode = val.split('_')[0];
    var startDate = val.split('_')[1];
    var endDate = val.split('_')[2];

    $.ajax({
        type: "POST",
        url: '../HiDoctor_Reports/ReportsLevelThree/GetnonfieldWorkpopupdetail',
        data: "userCode=" + userCode + "&startDate=" + startDate + "&endDate=" + endDate,
        success: function (result) {
            if (result != '') {
                $("#divModel").html(result);
                $("#dvOverlay").overlay().load();
            }
            else {
                fnMsgAlert('info', 'Product Wise Doctor Report', 'No data Found');
                $("#lnkExcel").hide();
            }
            HideModalPopup("dvloading");

        }
    });

}

function GetCpDeviation(val) {
    var userCode = val.split('_')[0];
    var startDate = val.split('_')[1];
    var endDate = val.split('_')[2];

    $.ajax({
        type: "POST",
        url: '../HiDoctor_Reports/ReportsLevelThree/GetCpDeviationpopupdetail',
        data: "userCode=" + userCode + "&startDate=" + startDate + "&endDate=" + endDate,
        success: function (result) {
            if (result != '') {
                $("#divModel").html(result);
                $("#dvOverlay").overlay().load();
            }
            else {
                fnMsgAlert('info', 'Product Wise Doctor Report', 'No data Found');

            }
            HideModalPopup("dvloading");

        }
    });
}

function GetCCallMissedPopup(val) {
    var userCode = val.split('_')[0];
    var startDate = val.split('_')[1];
    var endDate = val.split('_')[2];
    var category = val.split('_')[3];

    $.ajax({
        type: "POST",
        url: '../HiDoctor_Reports/ReportsLevelThree/GetCCallMissedPopupDetail',
        data: "userCode=" + userCode + "&startDate=" + startDate + "&endDate=" + endDate + "&category=" + category,
        success: function (result) {
            if (result != '') {
                $("#divModel").html(result);
                $("#dvOverlay").overlay().load();
            }
            else {
                fnMsgAlert('info', 'Product Wise Doctor Report', 'No data Found');

            }
            HideModalPopup("dvloading");

        }
    });
}


function GetDoctorDetails(val) {
    var userCode = val.split('_')[0];
    var startDate = val.split('_')[1];
    var endDate = val.split('_')[2];
    var category = val.split('_')[3];

    $.ajax({
        type: "POST",
        url: '../HiDoctor_Reports/ReportsLevelThree/GetDoctorDetailsPopup',
        data: "userCode=" + userCode + "&startDate=" + startDate + "&endDate=" + endDate + "&category=" + category,
        success: function (result) {
            if (result != '') {
                $("#divModel").html(result);
                $("#dvOverlay").overlay().load();
            }
            else {
                fnMsgAlert('info', 'Product Wise Doctor Report', 'No data Found');

            }
            HideModalPopup("dvloading");

        }
    });
}

function GetTpDeviation(val) {
    var userCode = val.split('_')[0];
    var startDate = val.split('_')[1];
    var endDate = val.split('_')[2];

    $.ajax({
        type: "POST",
        url: '../HiDoctor_Reports/ReportsLevelThree/GettpDeviationpopupdetail',
        data: "userCode=" + userCode + "&startDate=" + startDate + "&endDate=" + endDate,
        success: function (result) {
            if (result != '') {
                $("#divModel").html(result);
                $("#dvOverlay").overlay().load();
            }
            else {
                fnMsgAlert('info', 'Product Wise Doctor Report', 'No data Found');

            }
            HideModalPopup("dvloading");

        }
    });
}

function GetRepeatCallpopup(val) {
    var userCode = val.split('_')[0];
    var startDate = val.split('_')[1];
    var endDate = val.split('_')[2];
    var category = val.split('_')[3];

    $.ajax({
        type: "POST",
        url: '../HiDoctor_Reports/ReportsLevelThree/GetRepeatCallpopupDetail',
        data: "userCode=" + userCode + "&startDate=" + startDate + "&endDate=" + endDate + "&category=" + category,
        success: function (result) {
            if (result != '') {
                $("#divModel").html(result);
                $("#dvOverlay").overlay().load();
            }
            else {
                fnMsgAlert('info', 'Product Wise Doctor Report', 'No data Found');

            }
            HideModalPopup("dvloading");

        }
    });
}