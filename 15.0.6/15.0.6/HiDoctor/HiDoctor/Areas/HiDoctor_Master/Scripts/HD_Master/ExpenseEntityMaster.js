//Created By Sumathi
//Date : 6/12/2013

function fnGetEntityMaster() {
    $.ajax({
        url: '../HiDoctor_Master/ExpenseEntityMaster/GetExpenseEntityMaster',
        type: "GET",
        success: function (result) {
            if (result != '') {
                $("#divExpEntity").html(result);
            }
        }
    });
}

function fnClear() {
    $("#txtentityname").val('');
    $('#txtFromDate').val('');
    $('#txtToDate').val('');
    $("#expentitycodeval").val('');

    if ($("#btnsave").val() == 'Update') {
        $("#btnsave").val('Save');
        $("#hdnMode").val("I");
    }
    else {
        $("#btnsave").val('Save');
        $("#hdnMode").val("I");
    }
}

function fnSaveExpenseEntityMaster() {
    var result = fnsubvalidate();
    if (result) {
        var ExpenseEntityName = $.trim($("#txtentityname").val());
        var ExpenseName = ExpenseEntityName.toUpperCase();

        var day = $("#txtFromDate").val().split('/')[0];
        var month = $('#txtFromDate').val().split('/')[1];
        var year = $('#txtFromDate').val().split('/')[2];
        var EffectiveFrom = year + '-' + month + '-' + day;

        var day = $("#txtToDate").val().split('/')[0];
        var month = $('#txtToDate').val().split('/')[1];
        var year = $('#txtToDate').val().split('/')[2];
        var EffectiveTo = year + '-' + month + '-' + day;
        $.ajax({
            url: '../HiDoctor_Master/ExpenseEntityMaster/InsertandUpdateTheExpenseEntityMaster',
            type: "POST",
            data: { 'ExpenseEntityName': ExpenseName, 'EffectiveFrom': EffectiveFrom, 'EffectiveTo': EffectiveTo, 'Mode': $("#hdnMode").val(), 'ExpenseEntityCodeval': $("#expentitycodeval").val() },
            success: function (data) {
                if (data != null) {
                    if (data == "1") {
                        fnMsgAlert('success', 'Success', 'Saved successfully');
                        $("#txtentityname").val('');
                        $('#txtFromDate').val('');
                        $('#txtToDate').val('');
                        $("#expentitycodeval").val('');

                        $("#btnsave").val('Save'); //Button Value Change From Update To Save
                        $("#hdnMode").val("I");
                    }
                    else if (data == "2") {
                        fnMsgAlert('info', 'Error', 'Inserted Failure');
                    }
                    else if (data == "0") {
                        fnMsgAlert('info', 'Info', 'Expense Entity Name Already Exists');
                    }
                    else if (data == "3") {
                        fnMsgAlert('info', 'Error', 'Sorry An Error occured,please Try Again Later');
                    }
                    fnGetEntityMaster();
                }
                else {
                    fnMsgAlert('info', 'Error', 'Something went Wrong');
                }
            }
        });
    }
}

function fnsubvalidate() {
    if ($.trim($("#txtentityname").val()) == "") {
        fnMsgAlert('info', 'Info', 'Enter The Entity Name');
        return false;
    }

    if ($.trim($("#txtentityname").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Enter The Entity Name');
        return false;
    }

    if ($.trim($("#txtFromDate").val()) == "") {
        fnMsgAlert('info', 'Info', 'Select The Effective From Date');
        return false;
    }

    if ($.trim($("#txtToDate").val()) == "") {
        fnMsgAlert('info', 'Info', 'Select The Effective To Date');
        return false;
    }


    if (!(isNaN($("#txtentityname").val()))) {
        fnMsgAlert('info', 'Info', 'Enter The valid Entity Name');
        return false;
    }


    if (!regExforAlphaNumeric($("#txtentityname").val())) {
        fnMsgAlert('info', 'Info', 'Special characters are not allowed in the Entity Name');
        return false;
    }

    if ($("#txtentityname").val().length > 50) {
        fnMsgAlert('info', 'Info', 'Enity name should not exceed 50 characters');
        return false;
    }

    //Date validation    
    if (!(fnValidateDateFormate($("#txtFromDate"), "FromDate"))) {
        return false;
    }

    if (!(fnValidateDateFormate($("#txtToDate"), "ToDate"))) {
        return false;
    }

    var fromDate = $("#txtFromDate").val().split('/')[2] + '-' + $("#txtFromDate").val().split('/')[1] + '-' + $("#txtFromDate").val().split('/')[0];
    var toDate = $("#txtToDate").val().split('/')[2] + '-' + $("#txtToDate").val().split('/')[1] + '-' + $("#txtToDate").val().split('/')[0];
    var startDate = new Date(fromDate);
    var endDate = new Date(toDate);

    if (startDate > endDate) {
        fnMsgAlert('info', 'Info', 'To date can not be less than Start date.');
        return false;
    }
    return true;
}

function fnEdit(obj) {
    if (obj.id != null) {
        var tblexpenseEntitycode = obj.id.replace('E', 'Expense_Entity_Code');
        var tblexpenseentityname = obj.id.replace('E', 'Expense_Entity_Name');
        var tbleffectivefrom = obj.id.replace('E', 'Effective_From');
        var tbleffectiveto = obj.id.replace('E', 'Effective_To');

        var ExpenseEntityCode = $("#" + tblexpenseEntitycode).text();
        var EntityName = $("#" + tblexpenseentityname).text();
        var effectivefrom = $("#" + tbleffectivefrom).text();
        var effectiveto = $("#" + tbleffectiveto).text();

        $("#txtentityname").focus();
        $("#expentitycodeval").val(ExpenseEntityCode);
        $("#txtentityname").val(EntityName);
        $("#txtFromDate").val(effectivefrom);
        $("#txtToDate").val(effectiveto);

        $("#btnsave").val('Update'); //Button Value Change From Save To Update
        $("#hdnMode").val("E");
    }
}

function fnchangeStatus(obj) {
    if (obj.id != null) {
        var tblchange = obj.id.replace('C', 'Row_Status');
        var tblexpenseentitycode = obj.id.replace('C', 'Expense_Entity_Code');
        var status = $("#" + tblchange).text();
        var ExpenseEntityCode = $("#" + tblexpenseentitycode).text();
        $.ajax({
            url: '../HiDoctor_Master/ExpenseEntityMaster/ChangeStausforExpenseEntity',
            type: "POST",
            data: { 'status': status, 'ExpenseEntityCode': ExpenseEntityCode },
            success: function (data) {
                if (data) {
                    fnMsgAlert('success', 'Success', 'Status changed successfully');
                }
                else {
                    fnMsgAlert('info', 'Caution', 'somethinf went wrong');
                }
                fnGetEntityMaster();
            }
        });
    }
}

