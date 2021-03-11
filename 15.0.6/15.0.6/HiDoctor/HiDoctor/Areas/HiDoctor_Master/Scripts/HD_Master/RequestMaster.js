//Created By: Sumathi
//Date: 24/12/2013

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

//Get CycleList
var division_C
function fnGetCycle() {
    $.ajax({
        url: '../HiDoctor_Master/RequestMaster/GetCycles',
        type: "POST",
        success: function (JsonResult) {
            division_C = JsonResult;
            if (division_C != null) {
                if (division_C.length > 0) {
                    fnAddOptionToSelect("ddlcycle", "-Select a Cycle-", "0");
                    for (var di = 0; di < division_C.length; di++) {
                        fnAddOptionToSelect("ddlcycle", division_C[di].Cycle_Name, division_C[di].Cycle_Code);
                    }
                }
                else {
                    fnAddOptionToSelect("ddlcycle", "-No Division-", "0");
                }

            }
            else {
                fnAddOptionToSelect("ddlcycle", "-No Division-", "0");
            }
        }
    });
}

//Bind the Date with Html Table
function fnGetRequestDetails() {
    $.ajax({
        url: '../HiDoctor_Master/RequestMaster/GetRequestMaster',
        type: "GET",
        success: function (result) {
            if (result != '') {
                $("#divRequestMaster").html(result);
            }
        }
    });
}

//Change status
function fnchangeStatus(obj) {
    if (obj.id != null) {
        var tblchange = obj.id.replace('C', 'Record_Status');
        var tblRequestcode = obj.id.replace('C', 'Request_Code');
        var status = $("#" + tblchange).text();
        var Requestcode = $("#" + tblRequestcode).text();

        $.ajax({
            url: '../HiDoctor_Master/RequestMaster/ChangestatusforRequestMaster',
            type: "POST",
            data: { 'status': status, 'requestCode': Requestcode },
            success: function (data) {
                if (data) {
                    fnMsgAlert('success', 'Success', 'Status changed successfully');
                    fnGetRequestDetails();
                }
                else {
                    fnMsgAlert('info', 'Caution', 'something went wrong');
                    fnGetRequestDetails();
                }

            }
        });
    }
}
//Validation

function fncreditLimit() {

    if ($('#ddlreqEntity').val() == '1') {
        $('#Creditlimit').show();
    }
    else {
        $('#Creditlimit').hide();
    }

}

function fnsubvalidate() {
    if ($('#txtRequestName').val() == '') {
        fnMsgAlert('info', 'Info', 'Enter The Request Name');
        return false;
    }

    if ($.trim($("#txtRequestName").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Enter The Request Name');
        return false;
    }

    if (!(isNaN($("#txtRequestName").val()))) {
        fnMsgAlert('info', 'Info', 'Enter The valid Request Name');
        return false;
    }

    if (!regExforAlphaNumeric($("#txtRequestName").val())) {
        fnMsgAlert('info', 'Info', 'Special characters are not allowed in the Request Name');
        return false;
    }

    if ($('#ddlreqEntity').val() == '0') {
        fnMsgAlert('info', 'Info', 'Select The RequestEntity');
        return false;
    }
    if ($('#ddlreqType').val() == '0') {
        fnMsgAlert('info', 'Info', 'Select The RequestType');
        return false;
    }

    if (isNaN($("#txtcreditclient").val())) {
        fnMsgAlert('info', 'Info', 'Enter The Valid Amount');
        return false;
    }

    if ($('#ddlcycle').val() == '0') {
        fnMsgAlert('info', 'Info', 'Select The Cycle');
        return false;
    }

    if ($.trim($("#txtRequestName").val()).length > 50) {
        fnMsgAlert('info', 'Info', 'Request Name should not exceed 50 Characters');
        return false;
    }
    //Numeric value check
    if ($.trim($("#txtcreditclient").val()) != "") {

        if (!(fnCheckNumericWithPrecScale(txtcreditclient, 9, 2))) {
            return false;
        }

        if (parseInt($("#txtcreditclient").val()) < 0) {
            fnMsgAlert('info', 'Info', 'Negative numbers are not allowed for Credit Limit.');
            return false;
        }
    }

    if ($("#hdnMode").val() == "I") {
        var RequestName = $.trim($("#txtRequestName").val().toUpperCase());
        if (RequestName != '') {
            if ($("#tblsummary tr").length > 0) {
                for (var i = 0; i <= $("#tblsummary tr").length - 1 ; i++) {
                    if (i == 0) {
                        continue;
                    }
                    if ($("#Request_Name" + i).html().toUpperCase() == RequestName) {
                        fnMsgAlert('info', 'Info', 'Request Name Already Exists');
                        return false;
                    }
                }
            }
        }
    }

    if ($("#hdnMode").val() == "I") {
        var CycleCode = $("#ddlcycle option:selected").val();

        if (RequestName != '') {
            if ($("#tblsummary tr").length > 0) {
                for (var i = 0; i <= $("#tblsummary tr").length - 1 ; i++) {
                    if (i == 0) {
                        continue;
                    }
                    if ($("#Cycle_Code" + i).html() == CycleCode) {
                        fnMsgAlert('info', 'Info', 'This Cycle is already mapped for a request');
                        return false;
                    }
                }
            }
        }
    }

    if ($("#hdnMode").val() == "E") {
        var RequestCode = $.trim($("#hdnRequestCodeval").val());
        var RequestName = $.trim($("#txtRequestName").val().toUpperCase());
        if (RequestName != '') {
            if ($("#tblsummary tr").length > 0) {
                for (var i = 0; i <= $("#tblsummary tr").length - 1 ; i++) {
                    if (i == 0) {
                        continue;
                    }
                    if ($("#Request_Name" + i).html().toUpperCase() == RequestName && $("#Request_Code" + i).html() != RequestCode) {
                        fnMsgAlert('info', 'Info', 'Request Name Already Exists');
                        return false;
                    }
                }
            }
        }
    }
    return true;
}

//Submit
function fnSaveRequestMaster() {
    var result = fnsubvalidate();
    if (result) {
        var RequestName = $.trim($("#txtRequestName").val());

        var RequestEntityCode = $("#ddlreqEntity option:selected").val();
        var RequestEntityName = $("#ddlreqEntity option:selected").text();

        var RequestTypeCode = $("#ddlreqType option:selected").val();
        var RequestTypeName = $("#ddlreqType option:selected").text();
        if ($("#txtcreditclient").is(':visible') == true) {
            var creditLimit = $.trim($("#txtcreditclient").val());
            if (creditLimit == "undefined") {
                creditLimit = '';
            }
        }
        else {
            creditLimit = '';
        }
        var CycleCode = $("#ddlcycle option:selected").val();
        var CycletName = $("#ddlcycle option:selected").text();

        $('#main').block({
            message: '<h3>Processing</h3>',
            css: { border: '2px solid #ddd' }
        });

        $.ajax({
            url: '../HiDoctor_Master/RequestMaster/InsertandUpdateforRequestMaster',
            type: "POST",
            data: {
                'requestName': RequestName, 'requestEntity': RequestEntityName,

                'requestType': RequestTypeName, 'creditLimit': creditLimit, 'cycleCode': CycleCode, 'Mode': $("#hdnMode").val(), 'requestCodeval':

                $("#hdnRequestCodeval").val()
            },
            success: function (data) {
                if (data != '') {
                    if (!isNaN(data)) {
                        if (parseInt(data) > 0) {
                            fnMsgAlert('success', 'Success', 'Saved successfully');
                            fnCancelRequestscreen();
                            fnGetRequestDetails();
                            $("#main").unblock();
                        }
                        else {
                            fnMsgAlert('info', 'Error', 'Insertion Failed');
                            $("#main").unblock();
                        }
                    }
                }
            },
            error: function (e) {
                fnMsgAlert('info', '', 'Error.' + e.Message);
                $("#main").unblock();
            }
        });
    }
}

function fnCancelRequestscreen() {
    $("#txtRequestName").val('');
    $("#ddlreqEntity").val('0');
    $("#ddlreqType").val('0');
    $("#txtcreditclient").val('');
    $("#ddlcycle").val('0');
    $("#hdnMode").val("I");
    if ($("#btnsave").val() == 'Update') {
        $("#btnsave").val('Save');
    }
    else {
        $("#btnsave").val('Save');
    }
    $("#Creditlimit").hide();
}


function fnEditRequestMaster(obj) {
    
    $('#Creditlimit').show();
    if (obj.id != null) {
        var tblRequestCode = obj.id.replace('E', 'Request_Code');
        var tblRequestName = obj.id.replace('E', 'Request_Name');
        var tblRequestEntity = obj.id.replace('E', 'Request_Entity');
        var tblRequestType = obj.id.replace('E', 'Request_Type');
        var tblCreditLimit = obj.id.replace('E', 'Credit_Limit');
        var tblCycleCode = obj.id.replace('E', 'Cycle_Code');

        var RequestCode = $("#" + tblRequestCode).text();
        var RequestName = $("#" + tblRequestName).text();
        var RequestEntity = $("#" + tblRequestEntity).text();
        var RequestType = $("#" + tblRequestType).text();
        var CreditLimit = $("#" + tblCreditLimit).text();
        var CycleCode = $("#" + tblCycleCode).text();

        var RequestEntityval = "";
        if (RequestEntity == 'Customer Wise') {
            RequestEntityval = '1'
        }
        else if (RequestEntity == 'Region Wise') {
            RequestEntityval = '2'
        }
        else {
            RequestEntityval = '0'
        }

        $("#hdnRequestCodeval").val(RequestCode);
        $("#txtRequestName").val(RequestName);
        $("#ddlreqEntity").val(RequestEntityval);
        $('#ddlreqType').val(RequestType);
        $("#txtcreditclient").val(CreditLimit);
        $('#ddlcycle').val(CycleCode);
        $("#hdnMode").val("E");
        $("#btnsave").val('Update');
        $("#txtRequestName").focus();

        if ($('#ddlreqEntity').val() == '1') {
            $('#Creditlimit').show();
        }
        else {
            $('#Creditlimit').hide();
        }

    }
}


//----------------------------------START - DCR-Request Screen---------------------------------------//
function fnGetRegionCategoryName() {
    $.ajax({
        url: '../HiDoctor_Master/RequestMaster/GetRequestCategoryNames',
        type: "POST",
        success: function (jsData) {
            if (jsData != '') {
                jsData = eval('(' + jsData + ')');
                var selectcolumn = $("#ddlRequestCategory");
                $("#ddlRequestCategory option").remove();
                selectcolumn.append("<option value=0>-Select Category-</option>");
                for (var i = 0; i < jsData.length; i++) {
                    selectcolumn.append("<option value=" + jsData[i].Request_Category_Id + ">" + jsData[i].Request_Category_Name + "</option>");
                }
            }
        },
        error: function () {
        },
        complete: function () {
        }
    });

}

function fnGetDCRRequestScreen() {
    $.ajax({
        url: '../HiDoctor_Master/RequestMaster/GetDCRRequestMaser',
        type: "GET",
        success: function (result) {
            if (result != '') {
                $("#dvDCRRequest").html(result);
            }
        }
    });
}

function fnsubmitRequest() {
    var result = fnValidatetheRequestScreen();
    if (result) {
        var requestCategoryId = $("#ddlRequestCategory option:selected").val();
        var requestCategoryName = $("#ddlRequestCategory option:selected").text();
        var remarks = $.trim($("#txtRemarks").val());
        var Mode = $("#hdnMode").val();

        var day = $("#txtFromDate").val().split('/')[0];
        var month = $('#txtFromDate').val().split('/')[1];
        var year = $('#txtFromDate').val().split('/')[2];
        var fromDate = year + '-' + month + '-' + day;

        var day = $("#txtEndDate").val().split('/')[0];
        var month = $('#txtEndDate').val().split('/')[1];
        var year = $('#txtEndDate').val().split('/')[2];
        var toDate = year + '-' + month + '-' + day;

        $('#dvTabs').block({
            message: '<h3>Loading...</h3>',
            css: { border: '2px solid #ddd' }
        });
        $.ajax({
            url: '../HiDoctor_Master/RequestMaster/checkWAUser',
            type: "POST",
            success: function (result) {
                if (result == "SUCCESS") {
                    fnInsertDCRRequestScreen(requestCategoryId, requestCategoryName, fromDate, toDate, Mode, remarks);
                }
                else {
                    fnMsgAlert('info', 'Information', result);
                    return;
                }
            },
            error: function (e) {
                fnMsgAlert('info', '', 'Error.' + e.Message);
                $('#dvTabs').unblock();
            },
            complete: function () {
                $('#dvTabs').unblock();
            }
        });
    }
}

function fnInsertDCRRequestScreen(requestCategoryId, requestCategoryName, fromDate, toDate, Mode, remarks) {
    $('#dvTabs').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/RequestMaster/InsertandUpdatetheDCRRequestScreen',
        type: "POST",
        data: "requestcategoryId=" + requestCategoryId + "&reguestCategoryName=" + requestCategoryName + "&fromDate=" + fromDate + "&toDate=" + toDate + "&mode=" + Mode + "&remarks=" + remarks + "&editRequestId=" + $('#hdnRequestId').val(),
        success: function (data) {
            if (data.split(':')[0] == "SUCCESS") {
                fnMsgAlert('info', 'Success', data.split(':')[1]);
                $("#ddlRequestCategory").val('0');
                $("#txtFromDate").val('');
                $("#txtEndDate").val('');
                $("#txtRemarks").val('');
                $("#btnSave").val('Submit');
                $("#hdnMode").val("I");
                if ($("#btnSave").val() == 'Update') {
                    $("#btnSave").val('Save');
                }
                else {
                    $("#btnSave").val('Save');
                }
                fnGetDCRRequestScreen();
            }
            else {
                fnMsgAlert('info', 'Error', data.split(':')[1]);
                $("#ddlRequestCategory").val('0');
                $("#txtFromDate").val('');
                $("#txtEndDate").val('');
                $("#txtRemarks").val('');
                $("#btnSave").val('Submit');
                $("#hdnMode").val("I");
                if ($("#btnSave").val() == 'Update') {
                    $("#btnSave").val('Save');
                }
                else {
                    $("#btnSave").val('Save');
                }
                fnGetDCRRequestScreen();
            }
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
            $('#dvTabs').unblock();
        },
        complete: function (e) {
            $('#dvTabs').unblock();
        }
    });
}


function fnValidatetheRequestScreen() {
    if ($('#ddlRequestCategory').val() == '0') {
        fnMsgAlert('info', 'Info', 'Please Select Request Category Name.');
        return false;
    }

    if ($.trim($("#txtFromDate").val()) == "") {
        fnMsgAlert('info', 'Info', 'Please Select the From Date for Request Period');
        return false;
    }

    if ($.trim($("#txtEndDate").val()) == "") {
        fnMsgAlert('info', 'Info', 'Please Select the To Date for Request Period');
        return false;
    }


    if ($.trim($("#txtRemarks").val()) == "") {
        fnMsgAlert('info', 'Info', 'Please enter the Remarks');
        return false;
    }

    if ($.trim($("#txtRemarks").val()).length > 500) {
        fnMsgAlert('info', 'Info', 'Remarks should not exceed 500 characters');
        return false;
    }

    //if ($.trim($("#txtRemarks").val()) != "") {
    // if (!regExforAlphaNumeric($("#txtRemarks").val())) {
    //        fnMsgAlert('info', 'Info', 'Special characters are not allowed in the Remarks.');
    //        return false;
    //    }
    //}

    var specialCharregexfordcr = new RegExp(/^[a-zA-Z0-9-_.?,;:&*()[\] ]+$/);
    var restrictedSpecialchar_g = "/\\+^%$#@!~{}'><=";

    if (!specialCharregexfordcr.test($("#txtRemarks").val())) {
        fnMsgAlert('info', 'Info', 'Please Remove the following special characters ' + restrictedSpecialchar_g + '');
        return false;
    }

    //Date validation    
    if (!(fnValidateDateFormate($("#txtFromDate"), "FromDate"))) {
        return false;
    }

    if (!(fnValidateDateFormate($("#txtEndDate"), "ToDate"))) {
        return false;
    }

    var fromDate = $("#txtFromDate").val().split('/')[2] + '-' + $("#txtFromDate").val().split('/')[1] + '-' + $("#txtFromDate").val().split('/')[0];
    var toDate = $("#txtEndDate").val().split('/')[2] + '-' + $("#txtEndDate").val().split('/')[1] + '-' + $("#txtEndDate").val().split('/')[0];
    var startDate = new Date(fromDate);
    var endDate = new Date(toDate);

    if (startDate > endDate) {
        fnMsgAlert('info', 'Info', 'To date can not be less than Start date.');
        return false;
    }
    return true;
}

function fnClearAllRequest() {
    $("#ddlRequestCategory").val('0');
    $("#txtFromDate").val('');
    $("#txtEndDate").val('');
    $("#txtRemarks").val('');
    $("#btnSave").val('Submit');
    $("#hdnMode").val("I");
    if ($("#btnSave").val() == 'Update') {
        $("#btnSave").val('Save');
    }
    else {
        $("#btnSave").val('Save');
    }
}

function fnEditDCRRequest(tblValue) {
    var requestId = "";
    var requestCategoryId = "";
    var requestCategoryName = "";
    var fromDate = "";
    var toDate = "";
    var reMarks = "";
    var status = "";

    requestId = tblValue.split('|')[0];
    requestCategoryId = tblValue.split('|')[1];
    status = $('#Record_Status_' + requestId).html();
    if (status.toUpperCase() == "APPROVED") {
        fnMsgAlert('info', 'Info', 'You cannot modified the Approved Records.');
        return false;
    }

    $('#hdnRequestId').val(requestId);
    $("#ddlRequestCategory").val(requestCategoryId);
    $('#txtFromDate').val($('#Date_From_' + requestId).html());
    $('#txtEndDate').val($('#Date_To_' + requestId).html());
    $('#txtRemarks').val($('#User_Remarks_' + requestId).html());
    $('#dvTabs').tabs('option', 'selected', 0);
    $("#hdnMode").val("E");
    $("#btnSave").val('Update');
    $('#ddlRequestCategory').focus();
}

function fnEditRemarkforuser(val) {
    var requestId = "";
    var remarks = "";
    requestId = val.split('|')[0];
    remarks = val.split('|')[1];

    if (remarks != '') {
        $("#divModel").html(remarks);
        $("#dvOverlay").overlay().load();
    }
    else {
        fnMsgAlert('info', 'Info', 'No Remarks Found');
    }
}

function fnEditRemarkforadmin(val) {
    var requestId = "";
    var remarks = "";
    requestId = val.split('|')[0];
    remarks = val.split('|')[1];

    if (remarks != '') {
        $("#divModel").html(remarks);
        $("#dvOverlay").overlay().load();
    }
    else {
        fnMsgAlert('info', 'Info', 'No data Found');
    }
}
//----------------------------------END - DCR-Request Screen---------------------------------------//

//-----------------------------------REQUEST CATEGORY MASTER---------------------------------------//

function fnRequestSave() {
    if ($('#txtRequestCategory').val() == "") {
        fnMsgAlert('info', 'Info', 'Enter The RequestCategoryName');
        return false;
    }

    if ($.trim($("#txtRequestCategory").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Enter The RequestCategoryName');
        return false;
    }

    if (!(isNaN($("#txtRequestCategory").val()))) {
        fnMsgAlert('info', 'Info', 'Enter The valid RequestCategoryName');
        return false;
    }

    if (!regExforAlphaNumeric($("#txtRequestCategory").val())) {
        fnMsgAlert('info', 'Info', 'Special characters are not allowed in the RequestCategoryName');
        return false;
    }

    if ($.trim($("#txtRequestCategory").val()).length > 100) {
        fnMsgAlert('info', 'Info', 'Request Name should not exceed 100 Characters');
        return false;
    }

    var requestCategoryName = $.trim($("#txtRequestCategory").val());
    var status = $("input[name='rptOptions']:checked").val();
    var jsdata = eval(resultData);
    var disJson = jsonPath(jsdata, "$.[?(@.Request_Category_Name =='" + requestCategoryName + "')]");
    if (disJson != false && disJson != undefined) {
        //fnMsgAlert('info', 'User Project Mapping', 'The Request ' + disJson[0].Request_Name + ' already mapped with the User Type ' + disJson[0].User_Type_Name);
        // $('#lblmessage').html("The Request" + " " + disJson[0].Request_Name + "already mapped with the User Type" + " " + disJson[0].User_Type_Name);
        fnMsgAlert('success', 'Request Mapping', "The Request " + disJson[0].Request_Category_Name + " already mapped ");
        return false;
    }



    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/RequestMaster/InsertRequestCategory',
        data: "requestCategoryName=" + requestCategoryName + "&status=" + status,
        success: function (data) {
            if (data == "1") {
                fnMsgAlert('success', 'Region Type Master', 'Saved Sucessfully');
                fnfillRequestCategoryGrid();
                $("#txtRequestCategory").val("");
                $('input:radio[name=rptOptions][value=1]').prop('checked', true);
                $('input:radio[name=rptOptions][value=0]').prop('checked', false);
            }
            else if (data == "2") {
                fnMsgAlert('info', 'Error', 'Saved Failure');
            }
            else if (data == "0") {
                fnMsgAlert('info', 'Caution', 'Region Type Name Already Exists');
            }

            else if (data == "3") {
                fnMsgAlert('info', 'Error', 'Sorry An Error occured,please Try Again Later');
            }
        }

    });

}


function fnfillRequestCategoryGrid() {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/RequestMaster/GetRequestCategoryDetail',
        data: "A",
        success: function (result) {
            resultData = (result.split('*')[1]);
            if (result != '') {
                $("#dvTable").html(result.split('*')[0]);

            }
        }
    });
}
function fnEdit(val) {
    $('#btnSave').hide();
    requestId_G = val.split('_')[0]
    var requestCategoryName = val.split('_')[1]
    var status = val.split('_')[2]

    if (status == 'Enabled') {
        status = '1'
    }
    else {
        status = '0'
    }

    $("#txtRequestCategory").val(requestCategoryName);
    $('input:radio[name=rptOptions][value="' + status + '"]').prop('checked', true);
    $('#btnUpdate').show();
}


function fnUpdate() {

    if ($('#txtRequestCategory').val() == "") {
        fnMsgAlert('info', 'Info', 'Enter The RequestCategoryName');
        return false;
    }

    if ($.trim($("#txtRequestCategory").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Enter The RequestCategoryName');
        return false;
    }

    if (!(isNaN($("#txtRequestCategory").val()))) {
        fnMsgAlert('info', 'Info', 'Enter The valid RequestCategoryName');
        return false;
    }

    if (!regExforAlphaNumeric($("#txtRequestCategory").val())) {
        fnMsgAlert('info', 'Info', 'Special characters are not allowed in the RequestCategoryName');
        return false;
    }

    if ($.trim($("#txtRequestCategory").val()).length > 100) {
        fnMsgAlert('info', 'Info', 'Request Name should not exceed 50 Characters');
        return false;
    }

    var requestCategoryName = $.trim($("#txtRequestCategory").val());
    var status = $("input[name='rptOptions']:checked").val();
    var statusRequest = "";
    if (status == "1") {
        statusRequest = "Enabled"
    }
    else {
        statusRequest = "Disabled"
    }

    var jsdata = eval(resultData);
    var disJson = jsonPath(jsdata, "$.[?(@.Request_Category_Name =='" + requestCategoryName + "' && @.Request_Category_Status == '" + statusRequest + "')]");
    if (disJson != false && disJson != undefined) {
        //fnMsgAlert('info', 'User Project Mapping', 'The Request ' + disJson[0].Request_Name + ' already mapped with the User Type ' + disJson[0].User_Type_Name);
        // $('#lblmessage').html("The Request" + " " + disJson[0].Request_Name + "already mapped with the User Type" + " " + disJson[0].User_Type_Name);
        fnMsgAlert('success', 'Request Mapping', "The Request " + disJson[0].Request_Category_Name + " already mapped  ");
        return false;
    }



    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/RequestMaster/UpdateRequestCategory',
        data: "requestCategoryName=" + requestCategoryName + "&status=" + status + "&requestID=" + requestId_G,
        success: function (data) {
            if (data == "1") {
                //$('#lblmessage').html("Updated Sucessfully");
                fnMsgAlert('info', 'Request Mapping Screen', 'Updated Sucessfully.');
                $("#txtRequestCategory").val("");
                $('input:radio[name=rptOptions][value=1]').prop('checked', true);
                $('input:radio[name=rptOptions][value=0]').prop('checked', false);

            }
            else if (data == "2") {
                //$('#lblmessage').html("Sorry an error occured. Please try again later");
                fnMsgAlert('info', 'Request Mapping Screen', 'Sorry an error occured. Please try again later.');

            }
            fnfillRequestCategoryGrid()
            $('#btnSave').show();
            $('#btnUpdate').hide();
        }
    });
}



function fnCancel() {
    $("#txtRequestCategory").val("");
    $('input:radio[name=rptOptions][value=1]').prop('checked', true);
    $('input:radio[name=rptOptions][value=0]').prop('checked', false);
    $('#btnSave').show();
    $('#btnUpdate').hide();
}



