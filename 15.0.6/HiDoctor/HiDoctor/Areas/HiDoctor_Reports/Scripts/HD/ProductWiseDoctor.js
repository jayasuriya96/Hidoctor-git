//Created By:SRI//
//Created date :04-01-2014//
function fnShowreport() {
    $("#dvTable").html("");
    fnCloseTree();
    var startDate = $("#txtFromDate").val();
    var endDate = $("#txtToDate").val();
    startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
    endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];



    if (selKeys == "") {
        fnMsgAlert('info', 'Product Wise Doctor Report', 'Select atleast one user');
        HideModalPopup("dvloading");
        return false;
    }

    var productSelection = $("#ddlproductSelection option:selected").val();

    var selectedval = "";
    var adjustType = $('input:checkbox[name=DcrStatus]:checked');
    for (var intLoop = 0; intLoop < adjustType.length; intLoop++) {
        selectedval += adjustType[intLoop].value + "^";
        if (adjustType[intLoop].value.length > 4) {
            selectedval = "1^2^0^";
            break;
        }
    }


    var quanity = $('input:radio[name=Quantity]:checked').val();

    var viewFormat = $("input[name='rptOptions']:checked").val();

    if (productSelection == "") {
        fnMsgAlert("info", "Information", "Please select mode to group by");
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

    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'Product Wise Doctor Report', 'Select start date');
        HideModalPopup("dvloading");
        return false;

    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'Product Wise Doctor Report', 'Select end date');
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

    if ($("#drpUserTypeName").val() == "0") {
        fnMsgAlert('info', 'Product Wise Doctor Report', 'Please Select Usertype Name.');
        return false;
    }

    //if (selectedval != "") {
    //    selectedval = selectedval.substring(0, selectedval.length - 1);
    //}
    if (selectedval == "") {
        fnMsgAlert('info', 'Product Wise Doctor Report', 'Select atleast one dcr Status.');
        HideModalPopup("dvloading");
        return false;
    }

    if ($('input:radio[name=Quantity]:checked').val() == " ") {
        fnMsgAlert('info', 'Product Wise Doctor Report', 'Please Select Usertype Name.');
        return false;
    }
    ShowModalPopup("dvloading");
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Reports/ReportsLevelThree/GetProductWiseDoctorFormat',
        data: "userCode=" + selKeys + "&startDate=" + startDate + "&endDate=" + endDate + "&productSelection=" + productSelection + "&dcrStatus=" + selectedval + "&quanity=" + quanity + "&viewFormat=" + viewFormat,
        success: function (result) {
            if (result != '') {
                $("#tree").hide();
               // $("#rptInputs").hide();
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

///Tpstatus report New//

function fnUnderUserType() {
    $.ajax({
        url: '../HiDoctor_Reports/ReportsLevelThree/GetUserType',
        type: "POST",
        success: function (JsonResult) {
            userType = JsonResult;
            if (userType != null) {
                if (userType.length > 0) {
                    fnAddOptionToSelect("drpUserTypeName", "-Select-", "0");
                    for (var i = 0; i < userType.length; i++) {
                        fnAddOptionToSelect("drpUserTypeName", userType[i].User_Type_Name, userType[i].User_Type_Code);
                    }
                }
                else {
                    fnAddOptionToSelect("drpUserTypeName", "-No UserTypeName-", "0");
                }
            }
            else {
                fnAddOptionToSelect("drpUserTypeName", "-No UserTypeName-", "0");
            }
        }
    });
}

function fnGroupWiseUsertype() {
    $.ajax({
        url: '../HiDoctor_Reports/ReportsLevelThree/GetUserType',
        type: "POST",
        success: function (JsonResult) {
            userType = JsonResult;
            if (userType != null) {
                if (userType.length > 0) {
                    fnAddOptionToSelect("ddlUserTypeName2", "-Select-", "0");
                    for (var i = 0; i < userType.length; i++) {
                        fnAddOptionToSelect("ddlUserTypeName2", userType[i].User_Type_Name, userType[i].User_Type_Code);
                    }
                }
                else {
                    fnAddOptionToSelect("ddlUserTypeName2", "-No UserTypeName-", "0");
                }
            }
            else {
                fnAddOptionToSelect("ddlUserTypeName2", "-No UserTypeName-", "0");
            }
        }
    });
}


function fnAddOptionToSelect(id, text, value) {
    if ($.msie) {
        var option = document.createElement('option');
        jQuery(option).appendTo('#' + id);
        option.text = text;
        option.value = value;
    }
    else {
        $('#' + id).append("<option value='" + value + "'>" + text + "</option>");
    }
}


function fnShowTPreport() {
    ShowModalPopup("dvloading");

    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'Report', 'Please Select StartDate.');
        HideModalPopup("dvloading");
        return false;
    }

    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'Report', 'Please Select EndDate.');
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
    if ($("#drpUserTypeName").val() == "0") {
        fnMsgAlert('info', 'Report', 'Please Select UserType.');
        HideModalPopup("dvloading");
        return false;
    }
    if ($("#ddlUserTypeName2").val() == "0") {
        fnMsgAlert('info', 'Report', 'Please Select UserType.');
        HideModalPopup("dvloading");
        return false;
    }
    if ($(":checkbox[name=TPStatus]:checked").length == 0) {
        fnMsgAlert('info', 'Info', 'Please select TP status.');
        HideModalPopup("dvloading");
        return false;
    }
    var userCode = $('#hdnUserCode').val();

    var startDate = $("#txtFromDate").val();
    var endDate = $("#txtToDate").val();
    startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
    endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];

    var usertypelevel1 = $("#drpUserTypeName option:selected").val();
    var usertypelevel2 = $("#ddlUserTypeName2 option:selected").val();

    var selectedval = "";
    var adjustType = $('input:checkbox[name=TPStatus]:checked');
    for (var intLoop = 0; intLoop < adjustType.length; intLoop++) {
        selectedval += adjustType[intLoop].value + "^";
        if (adjustType[intLoop].value.length > 4) {
            selectedval = "1^2^0^";
            break;
        }
    }
    var viewFormat = $("input[name='rptOptions']:checked").val()

    var FromDateArr = $("#txtFromDate").val().split('/');
    var ToDateArr = $("#txtToDate").val().split('/');
    var dt1 = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
    var dt2 = new Date(ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Info', 'Start Date Can not be Greater than the End Date');
        HideModalPopup("dvloading");
        return false;
    }
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Reports/ReportsLevelThree/GetNewTpReportFormat',
        data: "userCode=" + userCode + "&startDate=" + startDate + "&endDate=" + endDate + "&userTypeLevel1=" + usertypelevel1 + "&userTypeLevel2=" + usertypelevel2 + "&tpStatus=" + selectedval + "&viewFormat=" + viewFormat,
        success: function (result) {
            if (result != '') {
                $("#tree").hide();
                $("#dvinput").hide();
                $('#dvdata').addClass('col-lg-12')
                $('#dvdata').removeClass('col-lg-9')
                $("#dvTable").html(result);
            }
            else {
                fnMsgAlert('info', 'TP Status Report', 'No data Found');
            }
            HideModalPopup("dvloading");
        }
    });

}

//END TP REPORT??

function fnShowSelfActivity() {
    ShowModalPopup("dvloading");
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
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Reports/ReportsLevelThree/GetSelfActivity',
        data: "userCode=" + userCode + "&startDate=" + startDate + "&endDate=" + endDate + "&DcrStatus=" + selectedval,
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