//Created By: Sumathi
//Date: 24/12/2013

function fnGetStatusMasterDetails() {
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/StatusMaster/GetstatusMaster',
        type: "GET",
        success: function (result) {
            if (result != '') {
                $("#divstatusmaster").html(result);
                $("#main").unblock();
            }
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error:' + e.message);
            $("#main").unblock();
        }
    });
}

//Change status
function fnchangeStatus(obj) {
    if (obj.id != null) {
        var tblchange = obj.id.replace('C', 'Record_Status');
        var tblstatuscode = obj.id.replace('C', 'Status_Code');
        var status = $("#" + tblchange).text();
        var Statuscode = $("#" + tblstatuscode).text();

        $.ajax({
            url: '../HiDoctor_Master/StatusMaster/ChangestatusforStatusMaster',
            type: "POST",
            data: { 'status': status, 'statusCode': Statuscode },
            success: function (data) {
                if (data) {
                    fnMsgAlert('success', 'Success', 'Status changed successfully');
                }
                else {
                    fnMsgAlert('info', 'Caution', 'something went wrong');
                }
                fnGetStatusMasterDetails();
            }
        });
    }
}

//Validation
function fnsubvalidate() {
    if ($.trim($("#txtstatusname").val()) == "") {
        fnMsgAlert('info', 'Info', 'Enter The Status Name');
        return false;
    }

    if (parseInt($("#txtstatusname").val()) < 0) {
        fnMsgAlert('info', 'Info', 'Enter the Valid Status Name.');
        return false;
    }

    if ($.trim($("#txtstatusname").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Enter The Status tName');
        return false;
    }

    if (!(isNaN($("#txtstatusname").val()))) {
        fnMsgalert('info', 'info', 'enter the valid status name');
        return false;
    }

    if (!regExforAlphaNumeric($("#txtstatusname").val())) {
        fnMsgAlert('info', 'Info', 'Special characters are not allowed in the Status Name');
        return false;
    }

    if ($.trim($("#txtstatusname").val()).length > 30) {
        fnMsgAlert('info', 'Info', 'Status Name should not exceed 30 Characters');
        return false;
    }

    if ($("#hdnMode").val() == "I") {
        var StatusName = $.trim($("#txtstatusname").val().toUpperCase());
        if (StatusName != '') {
            if ($("#tblsummary tr").length > 0) {
                for (var i = 0; i <= $("#tblsummary tr").length - 1 ; i++) {
                    if (i == 0) {
                        continue;
                    }
                    if ($("#Status_Name" + i).html().toUpperCase() == StatusName) {
                        fnMsgAlert('info', 'Info', 'Status Name Already Exists');
                        return false;
                    }
                }
            }
        }
    }

    if ($("#hdnMode").val() == "E") {
        var StatuscodeVal = $.trim($("#hdnstatusCodeval").val());
        var StatusName = $.trim($("#txtstatusname").val().toUpperCase());
        if (StatusName != '') {
            if ($("#tblsummary tr").length > 0) {
                for (var i = 0; i < $("#tblsummary tr").length - 1 ; i++) {
                    if (i == 0) {
                        continue;
                    }
                    if ($("#Status_Name" + i).html().toUpperCase() == StatusName && $("#Status_Code" + i).html() != StatuscodeVal) {
                        fnMsgAlert('info', 'Info', 'Status Name Already Exists');
                        return false;
                    }
                }
            }
        }

    }
    return true;
}

//Save
function fnSaveStatusMaster() {
    var result = fnsubvalidate();
    if (result) {
        $('#main').block({
            message: '<h3>Processing</h3>',
            css: { border: '2px solid #ddd' }
        });
        var StatusName = $("#txtstatusname").val();
        var DisplayName= $("#txtdispname").val();
        $.ajax({
            url: '../HiDoctor_Master/StatusMaster/InsertandUpdateforStatusMaster',
            type: "POST",
            data: {
                'statusName': StatusName, 'Mode': $("#hdnMode").val(), 'statusCodeval': $("#hdnstatusCodeval").val(),
                'DisplayName': DisplayName
            },
            success: function (data) {
                if (data != '') {
                    if (!isNaN(data)) {
                        if (parseInt(data) > 0) {
                            fnMsgAlert('success', 'Success', 'Saved successfully');
                            $("#txtstatusname").val('');
                            $("#txtdispname").val('');
                            fnCancel();
                            fnGetStatusMasterDetails();
                            $("#main").unblock();
                        }
                        else {
                            fnMsgAlert('info', 'Error', 'Sorry An Error occured,please Try Again Later');
                            $("#main").unblock();
                        }
                    }
                }
                else {
                    fnMsgAlert('info', 'Caution', 'Insertion Failed');
                    $("#main").unblock();
                }

            }
        });
    }
}

//Cancel
function fnCancel() {
    $("#txtstatusname").val('');
    if ($("#btnsave").val() == 'Update') {
        $("#btnsave").val('Save');
    }
    else {
        $("#btnsave").val('Save');
    }
    $("#hdnMode").val("I");
}

//Edit
function fnEdit(obj) {
    if (obj.id != null) {
        var tblStatusCode = obj.id.replace('E', 'Status_Code');
        var tblStatusName = obj.id.replace('E', 'Status_Name');
        var tblDisplayName = obj.id.replace('E', 'Display_Name');

        var StatusCode = $("#" + tblStatusCode).text();
        var StatusName = $("#" + tblStatusName).text();
        var DisplayName = $("#" + tblDisplayName).text();

        $("#hdnstatusCodeval").val(StatusCode);
        $("#txtstatusname").val(StatusName);
        $("#txtdispname").val(DisplayName);
        $("#hdnMode").val("E");
        $("#btnsave").val('Update');
        $('#txtstatusname').focus();
    }
}