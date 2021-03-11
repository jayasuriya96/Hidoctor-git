//Created By:Sumathi.M
//Date:09/04/2014

//Date Validation
function fnValidate() {
    if ($.trim($('#txtStartDate').val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Please Select Start Date');
        $('#txtStartDate').focus();
        HideModalPopup("dvloading");
        return false;
    }
    if ($.trim($('#txtEndDate').val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Please Select End Date');
        HideModalPopup("dvloading");
        return false;
    }

    //Date Validation
    if (!(fnValidateDateFormate($("#txtStartDate"), "StartDate"))) {
        HideModalPopup("dvloading");
        return false;
    }

    if (!(fnValidateDateFormate($("#txtEndDate"), "EndDate"))) {
        HideModalPopup("dvloading");
        return false;
    }

    var FromDateArr = $("#txtStartDate").val().split('/');
    var ToDateArr = $("#txtEndDate").val().split('/');
    var dt1 = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
    var dt2 = new Date(ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Info', 'EndDate Should not be less than the StartDate');
        HideModalPopup("dvloading");
        return false;
    }
    return true;
}

function fnshowSamplestockReport() {
    if (fnValidate()) {
        ShowModalPopup('dvloading');
        $("#dvsamplestockforAlumni").empty();
        var pageHeader = $("#divPageHeader").html();

        var options = "", userCode = '', userName = '';
        //GET OPTIONS
        if ($('#optViewInScreen').attr('checked') == "checked") {
            options = "S";
        }
        else {
            options = "E";
        }

        userCode = $('#hdnUserCode').val();
        userName = $('#hdnUserName').val();
        var day = $("#txtStartDate").val().split('/')[0];
        var month = $('#txtStartDate').val().split('/')[1];
        var year = $('#txtStartDate').val().split('/')[2];
        var startDate = year + '-' + month + '-' + day;

        var day = $("#txtEndDate").val().split('/')[0];
        var month = $('#txtEndDate').val().split('/')[1];
        var year = $('#txtEndDate').val().split('/')[2];
        var endDate = year + '-' + month + '-' + day;

        HideModalPopup("dvloading");
        $('#dvsamplestock').block({
            message: 'Retrieving data...',
            css: { border: '1px solid #ddd' }
        });
        var reportViewType = $("input:radio[name=rdReportView]:checked").val();
        debugger;
        $("#divPrint").html('');
        $('#dvsamplestockforAlumni').html('');
        $.ajax({
            type: 'POST',
            data: 'userCode=' + userCode + '&pageHeader=' + pageHeader + '&option=' + options + '&startDate=' + startDate + '&endDate=' + endDate + "&reportViewType=" + reportViewType,
            url: '../ReportsLevelThree/GenerateInwardDetails',
            success: function (response) {
                if (response != '') {
                    if (reportViewType == 'View in screen') {
                        $('#dvsamplestockforAlumni').html(response);
                        var rowCount = $("#tbldetails tr").length;
                        if (parseInt(rowCount) > 4) {
                            $("#divPrint").html(response);
                            //$("#divReport").html(content);
                            //$("#divPrint").html(content);
                            var type = '[{type : "text"},{type : "text"},{type : "text"},{type : "text"},{type : "number-range"},{type : "number-range"},{type : "number-range"},{type : "number-range"},{type : "number-range"}]';
                            var jsonType = eval(type);
                            if ($.fn.dataTable) {
                                $.datepicker.regional[""].dateFormat = 'dd/mm/yy';
                                $.datepicker.setDefaults($.datepicker.regional['']);
                                $('#tbldetails').dataTable({
                                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                                }).dataTable().columnFilter({
                                    sPlaceHolder: "head:after",
                                    aoColumns: jsonType

                                });
                                fninializePrint("divPrint", "ifrmPrint", "dvsamplestockforAlumni");
                                $("#dvsamplestock").unblock();
                            }
                        }
                        else {
                            var content = "";;
                            content = "<div id='errorMsge' style='border: 1px solid; background-color: dimgray; padding: 2%;margin-top: 50px;'>";
                            content += "<span style='font-weight: bold;border: 1%;color: white; font-size: initial;'>No Data Found</span>"
                            content += "</div>";
                            $('#dvsamplestockforAlumni').html(content);
                            $("#dvsamplestock").unblock();
                        }
                    }
                    else {
                        $('#dvsamplestockforAlumni').html(response);
                        $("#dvsamplestock").unblock();
                    }
                }

            },
            error: function (e) {
                fnMsgAlert('info', 'Error.' + e.Message.split('^')[0]);
                $("#dvsamplestock").unblock();
            }
        });
    }
}

function fnClickProduct(val) {
    var userCode = '';
    var startDate = '';
    var endDate = '';
    userCode = val.split('|')[0];
    startDate = val.split('|')[1];
    endDate = val.split('|')[2];

    var reportViewType = $("input:radio[name=rdReportView]:checked").val();

    $('#dvsamplestock').block({
        message: 'Retrieving data...',
        css: { border: '1px solid #ddd' }
    });
    debugger;
    $.ajax({
        type: 'POST',
        data: "userCode=" + userCode + "&startDate=" + startDate + "&endDate=" + endDate + "&reportViewType=" + reportViewType,
        url: '../ReportsLevelThree/GenerateInwardDetails',
        success: function (response) {
            if (response != "" && response != null) {
                $("#tblInwardTaken").html(response);
                $("#dvInward").overlay().load();
                $("#dvsamplestock").unblock();
            }
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
            $("#dvsamplestock").unblock();
        }
    });


}
function fnToggleTreeapop() {
    if ($("#spnDivToggle").html() == "Hide Filter") {

        $("#tblTrpop").hide();
        $("#spnDivToggle").html('Show Filter');
    }
    else if ($("#spnDivToggle").html() == "Show Filter") {
        $("#tblTrpop").show();
        $("#spnDivToggle").html('Hide Filter');
    }
}
function fninializePrint(divId, iFrameId, mainDiv) {
    $('#' + mainDiv + ' #dvPrint').remove();
    $("#" + mainDiv + " .TableTools").append("<div id='dvPrint' onclick='fnPrint(\"" + divId + "\",\"" + iFrameId + "\");' title='Print Table' class='TableTools_button' style='background: url(../Content/DataTable/media/images/print.png) no-repeat center center;border: 1px solid #f0f0f0;height: 30px; width: 30px;cursor:pointer;'></div>");
}
function fnPrint(divId, iFrameId) {
    debugger;
    try {
        var oIframe = document.getElementById(iFrameId);
        var oContent = document.getElementById(divId).innerHTML;
        var oDoc = (oIframe.contentWindow || oIframe.contentDocument);
        if (oDoc.document) oDoc = oDoc.document;
        oDoc.write("<html><head> <style media='all'>th, td{border-left:1px solid #000;border-top:1px solid #000;} table{border:1px solid #111;font-family:Arial;font-size:10px} </style> </head><body  onload='this.print();' this.print();'><center>");
        oDoc.write(oContent + "</center></body></html>");
        // oDoc.write("<html><head></head><body  onload='this.print();'><center>");
        // oDoc.write(oContent + "</center></body></html>");
        oDoc.close();
    }
    catch (e) {
        self.print();
    }
}