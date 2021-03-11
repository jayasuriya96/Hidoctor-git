//Created By : SRISUDHAN//
//Created Date : 27/01/2014//
var request = "";
function GetCampaignName() {
    var userCode = $('#hdnUserCode').val();
    var startDate = $("#txtFromDate").val();
    var endDate = $("#txtToDate").val();

    startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
    endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];

    $.ajax({
        url: '../HiDoctor_Reports/ReportsLevelThree/GetCampaignName',
        type: "POST",
        data: "userCode=" + userCode + "&startDate=" + startDate + "&endDate=" + endDate,
        success: function (JsonResult) {
            request = JsonResult;
            if (request != null) {
                if (request.length > 0) {
                    fnAddOptionToSelect("ddlMc", "-Select-", "0");
                    for (var i = 0; i < request.length; i++) {
                        fnAddOptionToSelect("ddlMc", request[i].Campaign_Name, request[i].Campaign_Code);
                    }
                }
                else {
                    fnAddOptionToSelect("ddlMc", "-No CampaignName-", "0");
                    //$("#dvdata").hide();
                }
            }
            else {
                fnAddOptionToSelect("ddlMc", "-No CampaignName-", "0");
               // $("#dvdata").hide();
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

function fnShowMCDetail() {
    $("#dvTable").html("");
    ShowModalPopup("dvloading");
    fnCloseTree();
    var campaignCode = $("#ddlMc option:selected").val();
    var viewFormat = $("input[name='rptOptions']:checked").val()
    var userCode = $('#hdnUserCode').val();

    var startDate = $("#txtFromDate").val();
    var endDate = $("#txtToDate").val();

    startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
    endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];

    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'MC Report', 'Select Start Date.');
        HideModalPopup("dvloading");
        return false;
    }

    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'MC Report', 'Select End Date.');
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
    if (request.length > 0) {
        if ($("#ddlMc").val() == "0") {
            fnMsgAlert('info', 'MC Report', 'Please Select campaign Name.');
            HideModalPopup("dvloading");
            return false;
        }
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

    $.ajax({
        type: "POST",
        url: '../HiDoctor_Reports/ReportsLevelThree/GetMcdetailHtmlFormat',
        data: "userCode=" + userCode + "&campaignCode=" + campaignCode + "&viewFormat=" + viewFormat + "&startDate=" + startDate + "&endDate=" + endDate,
        success: function (result) {
            if (result != '') {
                $("#tree").hide();
                $("#tblMC").hide();
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

function fnShowPopup(val) {
    var regionCode = val.split('_')[0];
    var startDate = val.split('_')[1];
    var endDate = val.split('_')[2];
    var planneddate = val.split('_')[3];
    var campaignCode = val.split('_')[4];
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Reports/ReportsLevelThree/GetMcpopup',
        data: "regionCode=" + regionCode + "&startDate=" + startDate + "&endDate=" + endDate + "&campaignCode=" + campaignCode + "&plannedDate=" + planneddate,
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

function fnExpand(val) {
    if ($(val).is(":visible")) {
        $("#tbl_1").hide();
    }
    else {
        $("#tbl_1").show();
    }
}

function fnSummaryHide(divid, spnid) {
    if ($('.' + divid).css("display") == "none") {
        $('.' + divid).fadeIn('slow');
        $('#' + spnid).removeClass('expandPrivilege');
        $('#' + spnid).addClass('collapseDFC');
    }
    else {
        $('.' + divid).fadeOut('slow');
        $('#' + spnid).removeClass('collapseDFC');
        $('#' + spnid).addClass('expandPrivilege');
    }
}