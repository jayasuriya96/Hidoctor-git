function fnGetPaySlipMetaData() {
    var userTypeTree = $("#dvUserTypeTree").dynatree("getTree");
    var userTypeCode = "";
    if (userTypeTree.getActiveNode() != null) {
        userTypeCode = userTypeTree.getActiveNode().data.key;
    }
    $('#dvRightPanel').block({
        message: '<h3>Loading...Please wait...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/PaySlip/GetPaySlipMetaData/',
        type: "POST",
        data: "userTypeCode=" + userTypeCode,
        success: function (result) {
            if (result != '') {
                $("#dvRightPanel").show();
                $("#dvPaySlip").html(result);
                $('#dvRightPanel').tabs('option', 'selected', 0);
                $(".clsCheckSpecial").blur(function () { fnValidateColumnName(this) });
                if ($("#dvPaySlip table").length == 0) {
                    //fnMsgAlert('info', 'Info', 'PaySlip data not found for the selected user type');
                    $('#dvSubmitButton').hide();
                    return;
                }
                else {
                    $('#dvSubmitButton').show();
                }
            }
        },
        error: function () {
            $('#dvRightPanel').unblock();
        },
        complete: function () {
            $('#dvRightPanel').unblock();
        }
    });
}
function fnValidateColumnName(obj) {
    if ($.trim($(obj).val()) != "") {
        var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._]+$");
        if (!specialCharregex.test($(obj).val())) {
            fnMsgAlert('info', 'Information', 'Please remove the special characters.');
            return false;
        }
    }
}
function fnSubmit() {

    //tblPaySlipMetaData
    var tblLength = $("#tblPaySlipMetaData tr").length;
    if (tblLength > 1) {
        for (var i = 1; i < tblLength; i++) {
            if ($.trim($("#txtColumnName_" + i).val()) != '') {
                var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._]+$");
                if (!specialCharregex.test($.trim($("#txtColumnName_" + i).val()))) {
                    fnMsgAlert('info', 'Information', 'Please remove the special characters from the Column Name.Error at row no ' + i);
                    return false;
                }
            }
            if ($.trim($("#txtLabelText_" + i).val()) != '') {
                if (!specialCharregex.test($.trim($("#txtLabelText_" + i).val()))) {
                    fnMsgAlert('info', 'Information', 'Please remove the special characters from the Label text.Error at row no ' + i);
                    return false;
                }
            }
            if ($.trim($("#txtColumnName_" + i).val()) != '') {
                if ($.trim($("#txtLabelText_" + i).val()) == '') {
                    fnMsgAlert('info', 'Information', 'Please enter label text . Error at row no  ' + i);
                    return false;
                }
            }
            if ($.trim($("#cboColDataType_" + i).val()) != '') {
                if ($.trim($("#cboColDataType_" + i).val()) == '') {
                    fnMsgAlert('info', 'Information', 'Please select column data type. Error at row no  ' + i);
                    return false;
                }
            }
            else {
                if ($.trim($("#txtLabelText_" + i).val()) != '' || $.trim($("#cboZoneIndex_" + i).val()) != "0" || $.trim($("#cboRowIndex_" + i).val()) != "0" ||
                      $.trim($("#cboColumnIndex_" + i).val()) != "0" || $.trim($("#cboHorAlign_" + i).val()) != "" || $.trim($("#cboVerAlign_" + i).val()) != "") {
                    fnMsgAlert('info', 'Information', 'Please enter column name. Error at row no  ' + i);
                    return false;
                }
            }
        }
        var userTypeTree = $("#dvUserTypeTree").dynatree("getTree");
        var userTypeCode = "";
        if (userTypeTree.getActiveNode() != null) {
            userTypeCode = userTypeTree.getActiveNode().data.key;
        }
        var paySlipJson = new Array();
        for (var i = 1; i <= tblLength; i++) {
            var data = {};
            data.Column_No = $.trim($("#spnColumnNo_" + i).html());
            data.Label_Text = $.trim($("#txtLabelText_" + i).val());
            data.Column_Name = $.trim($("#txtColumnName_" + i).val());
            data.Zone_Index = $.trim($("#cboZoneIndex_" + i).val());
            data.Row_Index = $.trim($("#cboRowIndex_" + i).val());
            data.Column_Index = $.trim($("#cboColumnIndex_" + i).val());
            data.Horizontal_Align = $.trim($("#cboHorAlign_" + i).val());
            data.Vertical_Align = $.trim($("#cboVerAlign_" + i).val());
            data.Column_Type = $.trim($("#cboColType_" + i).val());
            data.Column_Data_Type = $.trim($("#cboColDataType_" + i).val());
            paySlipJson.push(data);
        }
        $('#dvRightPanel').block({
            message: '<h3>Loading...Please wait...</h3>',
            css: { border: '2px solid #ddd' }
        });
        $.ajax({
            type: "POST",
            url: '../HiDoctor_Master/PaySlip/UpdatePaySlipMetaData',
            data: "paySlipData=" + JSON.stringify(paySlipJson) + "&userTypeCode=" + userTypeCode + "",
            success: function (result) {
                fnMsgAlert('success', 'Success', 'Payslip details updated successfully');
                fnGetPaySlipMetaData();
            },
            error: function () {
                fnMsgAlert('info', 'Error', 'Error occured while submit the data');
                $('#dvRightPanel').unblock();
            },
            complete: function () {
                $('#dvRightPanel').unblock();
            }
        });
    }
    else {
        fnMsgAlert('info', 'Info', 'No payslip data found for the selected user type');
        return;
    }
}


function GetActiveUserTypes() {
    $('#dvRightPanel').block({
        message: '<h3>Loading...Please wait...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/PaySlip/GetUserTypes/',
        type: "POST",
        data: "A",
        success: function (jsonData) {
            $('#dvUType').html('');
            // $('option', $("#cboDestUserType")).remove();
            // $("#cboDestUserType").multiselect("destroy");
            var content = "<select id='cboDestUserType'  multiple='multiple'>";
            if (jsonData != '') {
                jsonData = eval('(' + jsonData + ')');
                if (jsonData.length > 0) {
                    for (var i = 0; i < jsonData.length; i++) {
                        if (jsonData[i].User_Type_Status == "1") {
                            content += "<option value='" + jsonData[i].User_Type_Code + "'>" + jsonData[i].User_Type_Name + "</option>";
                        }
                    }
                    content += "</select>";
                    $('#dvUType').html(content);
                    //$("#cboDestUserType").multiselect("refresh");
                    $("#cboDestUserType").multiselect().multiselectfilter();
                    //$("#cboDestUserType").multiselect({
                    //    noneSelectedText: 'Select User Types'
                    //}).multiselectfilter();
                }
            }
        },
        error: function () {
            $('#dvRightPanel').unblock();
        },
        complete: function () {
            $('#dvRightPanel').unblock();
        }
    });
}


function GetPaySlipMappedUserTypes() {
    $('#dvRightPanel').block({
        message: '<h3>Loading...Please wait...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/PaySlip/GetPaySlipMappedUserTypes/',
        type: "POST",
        data: "A",
        success: function (jsonData) {
            $("#cboSourceUserType option").remove();
            $("#cboSourceUserType").append("<option value=''>-Select-</option>");
            if (jsonData != '') {
                jsonData = eval('(' + jsonData + ')');
                if (jsonData.length > 0) {
                    for (var i = 0; i < jsonData.length; i++) {
                        $("#cboSourceUserType").append("<option value='" + jsonData[i].User_Type_Code
                            + "'>" + jsonData[i].User_Type_Name + "</option>");
                    }
                }
            }
        },
        error: function () {
            $('#dvRightPanel').unblock();
        },
        complete: function () {
            $('#dvRightPanel').unblock();
        }
    });
}

function fnChangePaySlipColumnStatus(columnNo, status) {
    if (confirm('Do you want to change the status?')) {
        $('#dvRightPanel').block({
            message: '<h3>Loading...Please wait...</h3>',
            css: { border: '2px solid #ddd' }
        });
        var recordStatus = "0";
        if (status == "0") {
            recordStatus = '1';
        }
        else {
            recordStatus = '0';
        }
        var userTypeTree = $("#dvUserTypeTree").dynatree("getTree");
        var userTypeCode = "";
        if (userTypeTree.getActiveNode() != null) {
            userTypeCode = userTypeTree.getActiveNode().data.key;
        }
        $.ajax({
            url: '../HiDoctor_Master/PaySlip/ChangePaySlipMetadataStatus/',
            type: "POST",
            data: "userTypeCode=" + userTypeCode + "&columnNo=" + columnNo + "&status=" + recordStatus,
            success: function (result) {
                fnMsgAlert('success', 'Success', 'Payslip data status changed successfully');
                fnGetPaySlipMetaData();
            },
            error: function () {
                fnMsgAlert('info', 'Error', 'Failed to change the status');
                $('#dvRightPanel').unblock();
            },
            complete: function () {
                $('#dvRightPanel').unblock();
            }
        });
    }
}


function fnCopyPaySlipData() {
    var userTypes = "";
    if ($('#cboSourceUserType').val() == '') {
        fnMsgAlert('info', 'info', 'Please select source user type');
        return;
    }
    var i = 0;
    $('select#cboDestUserType > option:selected').each(function () {
        if ($(this).val() == $('#cboSourceUserType').val()) {
            i = parseInt(i) + 1;
        }
        userTypes += $(this).val() + "^";
    });
    if (i > 0) {
        fnMsgAlert('info', 'info', 'You have selected the same user type in source and destination.Please select any other user type');
        return;
    }

    if (i == 0) {
        if (userTypes == "") {
            fnMsgAlert('info', 'info', 'Please select atleast one destination user type');
            return;
        }

        $('#dvRightPanel').block({
            message: '<h3>Loading...Please wait...</h3>',
            css: { border: '2px solid #ddd' }
        });
        $.ajax({
            url: '../HiDoctor_Master/PaySlip/PaySlipInheritance/',
            type: "POST",
            data: "sourceUserTypeCode=" + $("#cboSourceUserType").val() + "&userTypes=" + userTypes,
            success: function (result) {
                $("#cboSourceUserType").val('');
                $("#cboSourceUserType").attr('selectedIndex', 0);
                //$('select#cboDestUserType > option:selected').each(function () {
                //    this.checked = false;
                //});
                $('select#cboDestUserType > option').attr('selected', false);
                $('#cboDestUserType').multiselect("destroy").multiselect().multiselectfilter();

                fnMsgAlert('success', 'Success', 'Payslip data copied successfully');
                GetActiveUserTypes();
                GetPaySlipMappedUserTypes();
            },
            error: function () {
                fnMsgAlert('info', 'Error', 'Error occured while copy the payslip data');
                $('#dvRightPanel').unblock();
            },
            complete: function () {
                $('#dvRightPanel').unblock();
            }
        });
    }
}
//SRISUDHAN //
//PAY SLIP DATA UPLOAD//
function fnValidateUploadedFile() {
    $("#dvRedirect").hide();
    $("#dvMsgSuccess").hide();
    $("#dvMsgError").hide();
    $("#dvMsgError").html('');
    $("#dvMsgSuccess").html('');
    var fileName = $('#file').val();

    if ($("#txtMonthDate").val() == "") {
        fnMsgAlert('info', 'PayslipUpload', 'Please Select The Month');
        return false;
    }

    var month = "", year = "";

    if ($("#txtMonthDate").val().split('-')[0] == "Jan") {
        month = "01";
    }
    else if ($("#txtMonthDate").val().split('-')[0] == "Feb") {
        month = "02";
    }
    else if ($("#txtMonthDate").val().split('-')[0] == "Mar") {
        month = "03";
    }
    else if ($("#txtMonthDate").val().split('-')[0] == "Apr") {
        month = "04";
    }
    else if ($("#txtMonthDate").val().split('-')[0] == "May") {
        month = "05";
    }
    else if ($("#txtMonthDate").val().split('-')[0] == "Jun") {
        month = "06";
    }
    else if ($("#txtMonthDate").val().split('-')[0] == "Jul") {
        month = "07";
    }
    else if ($("#txtMonthDate").val().split('-')[0] == "Aug") {
        month = "08";
    }
    else if ($("#txtMonthDate").val().split('-')[0] == "Sep") {
        month = "09";
    }
    else if ($("#txtMonthDate").val().split('-')[0] == "Oct") {
        month = "10";
    }
    else if ($("#txtMonthDate").val().split('-')[0] == "Nov") {
        month = "11";
    }
    else if ($("#txtMonthDate").val().split('-')[0] == "Dec") {
        month = "12";
    }
    year = $("#txtMonthDate").val().split('-')[1];

    
    var monthNo = month;

    $('#txtMonth').val(monthNo);
    $('#txtYear').val(year);
    if (fileName.length == 0) {
        fnMsgAlert('info', 'Info', 'Please select any excel file then click the upload button');
        return false;
    }
    else {
        var ext = fileName.substring(fileName.lastIndexOf('.') + 1);
        if (ext == "xlsx") {
            return true;
        }
        else {
            fnMsgAlert('info', 'Info', 'Please select  xlsx file only');
            return false;
        }
    }
}