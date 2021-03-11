//Created by Sumathi
//Date 27/11/2013

$(document).ready(function () {
    $("#dvAjaxLoad").hide();
    fnGetLeaveDetails();
    fnGetLOPStatus();
});
///////////************************ Leave Type Master Screen Start ***********************//////////
function fnGetLeaveDetails() {
    $.ajax({
        url: '../HiDoctor_Master/LeaveType/GetLeaveTypeMaster',
        type: "GET",
        success: function (result) {
            if (result != '') {
                $("#divleavetype").html(result);
            }
        }
    });
}

function fnSubmitLeaveType() {
    var result = fnsubvalidate();
    if (result) {
        var LeaveTypeName = $.trim($("#txtleavetypename").val());
        var IsLop = $('#chkLop').attr('Checked') ? 1 : 0;
        var payrollleavetypeCode = $.trim($("#txtPayrollleavetypeCode").val());
        $.ajax({
            url: '../HiDoctor_Master/LeaveType/InsertLeaveType',
            type: "POST",
            data: { 'LeaveTypeName': LeaveTypeName, 'Mode': $("#hdnMode").val(), 'LveLeaveTypeCode': $("#leavetypecodeval").val(), 'payrollleavetypeCode': payrollleavetypeCode, 'IsLop': IsLop },
            success: function (data) {
                if (data == "1") {
                    fnMsgAlert('success', 'Success', 'Saved successfully');
                    $("#txtleavetypename").val('');
                    $('#chkLop').attr('checked', false);
                    $("#txtPayrollleavetypeCode").val('');

                    $("#btnsave").val('Save'); //Button Value Change From Update To Save
                    $("#hdnMode").val("I");
                }
                else if (data == "2") {
                    fnMsgAlert('info', 'Error', 'Inserted Failure');
                }
                else if (data == "0") {
                    fnMsgAlert('info', 'Caution', 'LeaveType Name Already Exists');
                }
                fnGetLeaveDetails();
                fnGetLOPStatus();
            }
        });
    }
}

function fnsubvalidate() {
    if ($.trim($("#txtleavetypename").val()) == "") {
        fnMsgAlert('info', 'Info', 'Enter The LeaveType Name');
        return false;
    }

    if ($.trim($("#txtleavetypename").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Enter The LeaveType Name');
        return false;
    }

    if ($.trim($("#txtleavetypename").val()).length > 30) {
        fnMsgAlert('info', 'Info', 'You can enter only 30 characters in Leave Type Name.');
        return false;
    }

    if ($.trim($("#txtleavetypename").val()) != $("#txtleavetypename").val()) {
        fnMsgAlert('info', 'Information', 'Please remove space from prefix/suffix of the Leave Type Name."');
        return false;
    }

    if (!(isNaN($("#txtleavetypename").val()))) {
        fnMsgAlert('info', 'Info', 'Enter The valid LeaveType Name');
        return false;
    }

    if (!regExforAlphaNumeric($("#txtleavetypename").val())) {
        fnMsgAlert('info', 'Info', 'Special characters are not allowed in the LeaveType Name');
        return false;
    }

    if (isPayrollUser == true) {
        if ($.trim($("#txtPayrollleavetypeCode").val()) == "") {
            fnMsgAlert('info', 'Info', 'Please enter Payroll Leave Type Code.');
            return false;
        }

        if ($.trim($("#txtPayrollleavetypeCode").val()).length > 30) {
            fnMsgAlert('info', 'Info', 'You can enter only 30 characters in Payroll Leave Type Code.');
            return false;
        }

        if (!(fnCheckPayrollleavetypeCodeSpecialChar($("#txtPayrollleavetypeCode")))) {
            fnMsgAlert('info', 'Information', 'Please enter valid Payroll Leave Type Code. You can enter Aa-Zz-0-9 hyphen and underscore only."');
            return false;
        }

        var payrollexist = $("td[prlc=" + $.trim($("#txtPayrollleavetypeCode").val()).toUpperCase() + "]").length

        if ($("#hdnMode").val() == "I") { // for Insert check PayrollleavetypeCode duplication
            if (payrollexist > 0) {
                fnMsgAlert('info', 'Information', 'Payroll Leave Type Code is duplicated. Please enter unique value."');
                return false;
            }
        }
        else {// for Update check PayrollleavetypeCode duplication
            if (payrollexist > 0) {
                var duppayrollId = $("td[prlc=" + $.trim($("#txtPayrollleavetypeCode").val()).toUpperCase() + "]").attr('id');
                var dupLeavetypeId = $("#" + duppayrollId.replace('Payroll_Leave_Type_Code', 'Leave_Type_Code')).text();

                if (payrollexist > 1 && dupLeavetypeId == $("#leavetypecodeval").val()) {
                    fnMsgAlert('info', 'Information', 'Payroll Leave Type Code is duplicated. Please enter unique value."');
                    return false;
                }

                if (payrollexist > 0 && dupLeavetypeId != $("#leavetypecodeval").val()) {
                    fnMsgAlert('info', 'Information', 'Payroll Leave Type Code is duplicated. Please enter unique value."');
                    return false;
                }
            }
        }
        //
    }
    //Validate LOP
    var IsLop = $('#chkLop').attr('Checked') ? 1 : 0;
    if (IsLop == "1") {
        if (lopJson_g.length > 0) {
            var disJson = jsonPath(lopJson_g, "$.[?(@.Is_LOP=='" + IsLop + "')]");
            if (disJson.length > 0) {
                fnMsgAlert('info', 'Information', 'You cant assign Lop for this Leave,Since it is already assiged for ' + disJson[0].Leave_Type_Name + '.');
                return false;
            }
        }
    }
    return true;
}

function fnCheckPayrollleavetypeCodeSpecialChar(id) {
    if ($(id).val() != "") {
        var specialCharregex = new RegExp("^[a-zA-Z0-9_-]+$");
        if (!specialCharregex.test($(id).val())) {
            return false;
        }
        else {
            return true;
        }
    }
    return true
}

function fnchangeStatus(obj) {
    if (obj.id != null) {
        var tblchange = obj.id.replace('C', 'Leave_Type_Status');
        var tblLeaveTypeCode = obj.id.replace('C', 'Leave_Type_Code');
        var status = $("#" + tblchange).text();
        var LeaveTypeCode = $("#" + tblLeaveTypeCode).text();
        $.ajax({
            url: '../HiDoctor_Master/LeaveType/ChangestatusforLeaveType',
            type: "POST",
            data: { 'status': status, 'LeaveTypeCode': LeaveTypeCode },
            success: function (data) {
                if (data) {
                    fnMsgAlert('success', 'Success', 'Status changed successfully');
                }
                else {
                    fnMsgAlert('info', 'Error', 'something went wrong');
                }
                fnGetLeaveDetails();
                fnGetLOPStatus();
            }
        });
    }
}

function fnEditLeaveType(obj) {
    if (obj.id != null) {
        var tblLeaveTypeCode = obj.id.replace('E', 'Leave_Type_Code');
        var tblLeaveTypeName = obj.id.replace('E', 'Leave_Type_Name');
        var tblLeaveTypeChange = obj.id.replace('E', 'Leave_Type_Status');
        var tblisLOp = obj.id.replace('E', 'Is_LOP');

        var LveLeaveTypeCode = $("#" + tblLeaveTypeCode).text();
        var LeaveTypeName = $("#" + tblLeaveTypeName).text();
        var LeaveTypeChange = $("#" + tblLeaveTypeChange).text();
        var IsLOP = $("#" + tblisLOp).text();

        $("#txtleavetypename").focus();
        $("#txtleavetypename").val(LeaveTypeName);
        $("#leavetypecodeval").val(LveLeaveTypeCode);

        if (IsLOP.toUpperCase() == "YES") {
            $('#chkLop').attr('checked', true);
        }

        $("#btnsave").val('Update');  //Button Value Change From Save To Update
        $("#hdnMode").val("E");

        if (isPayrollUser == true) {
            var tblPayrollleavetypeCode = obj.id.replace('E', 'Payroll_Leave_Type_Code');
            var PayrollleavetypeCode = $("#" + tblPayrollleavetypeCode).text();
            $("#txtPayrollleavetypeCode").val(PayrollleavetypeCode);
        }
    }
}

function fnClearLeaveType() {
    $("#txtleavetypename").val('');
    $('#chkcompoff').attr('checked', false);
    $('#chkLop').attr('checked', false);
    $("#txtPayrollleavetypeCode").val("");

    if ($("#btnsave").val() == 'Update') {
        $("#btnsave").val('Save');
        $("#hdnMode").val("I");
    }
    else {
        $("#btnsave").val('Save');
        $("#hdnMode").val("I");
    }
}

function fnGetLOPStatus() {
    $.ajax({
        url: '../HiDoctor_Master/LeaveType/GetLopStatus',
        type: "GET",
        success: function (result) {
            if (result != '') {
                debugger;
                lopJson_g = result;
            }
        }
    });
}


/////////////// ******************** User Leave Type Master Screen Start **************************///////////
var userLeaveTypeJson_g = "";
function fnGetuserTypes() {
    debugger;
    $('#dvMainUserLeaveType').block({
        message: '<h3>Loading User Types...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/LeaveType/GetUserTypes/',
        type: "POST",
        data: "A",
        success: function (result) {
            var userType = $("#cboUserType");
            $("#cboUserType option").remove();
            userType.append(result);
            fnGetLeaveTypes();
        },
        error: function () {
            $("#dvMainUserLeaveType").unblock();
        },
        complete: function () {
            $("#dvMainUserLeaveType").unblock();
        }
    });
}

function fnGetLeaveTypes() {
    debugger;
    $('#dvMainUserLeaveType').block({
        message: '<h3>Loading Leave Types...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/LeaveType/GetLeaveTypes/',
        type: "POST",
        data: "A",
        success: function (result) {
            var leaveType = $("#cboLeaveType");
            $("#cboLeaveType option").remove();
            leaveType.append(result.split('^')[0]);
            $("#dvClubLeaveCntrl").html(result.split('^')[1]);
            $("#dvMainUserLeaveType").unblock();
        },
        error: function () {
            $("#dvMainUserLeaveType").unblock();
        },
        complete: function () {
            $("#dvMainUserLeaveType").unblock();
        }
    });
}

function fnGetUsers() {
    debugger;
    $('#dvMainUserLeaveType').block({
        message: '<h3>Loading Users...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/LeaveType/GetUsersByUserType/',
        type: "POST",
        data: "userTypeCode=" + $("#cboUserType").val() + "",
        success: function (result) {
            var users = $("#cboUsers");
            $("#cboUsers option").remove();
            users.append(result);
            $("#dvMainUserLeaveType").unblock();
        },
        error: function () {
            $("#dvMainUserLeaveType").unblock();
        },
        complete: function () {
            $("#dvMainUserLeaveType").unblock();
        }
    });
}

function fnGetUserLeaveType() {
    debugger;
    $('#dvMainUserLeaveType').block({
        message: '<h3>Loading User Leave Types...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/LeaveType/GetUserLeaveTypeMaster/',
        type: "POST",
        data: "userCode=" + $("#cboUsers").val() + "",
        success: function (jsResult) {
            if (jsResult != '' && jsResult != null) {
                $("#dvUserLeaveTypeMapping").html(jsResult);
            }
            $("#dvMainUserLeaveType").unblock();
        },
        error: function () {
            $("#dvMainUserLeaveType").unblock();
        },
        complete: function () {
            $("#dvMainUserLeaveType").unblock();
        }
    });
}

function fnDownloadExcel() {
    debugger;
    $('#dvMainUserLeaveType').block({
        message: '<h3>Loading User Leave Types...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/LeaveType/GetUserLeaveTypeMasterExcelDownload/',
        type: "POST",
        data: "userCode=" + $("#cboUsers").val() + "",
        success: function (result) {
            $("#lnkExcel").attr("href", result);
            $("#lnkExcel").html('Excel Download');
            $("#dvMainUserLeaveType").unblock();
        },
        error: function () {
            $("#dvMainUserLeaveType").unblock();
        },
        complete: function () {
            $("#dvMainUserLeaveType").unblock();
        }
    });
}

function fnSubmit() {
    debugger;
    var result = fnValidate();
    if (result) {
        debugger;
        $('#dvMainUserLeaveType').block({
            message: '<h3>Saving the records ...</h3>',
            css: { border: '2px solid #ddd' }
        });
        var userTypeCode = $("#cboUserType").val();
        var user = $("#cboUsers").val();
        var leaveType = $("#cboLeaveType").val();
        var minLeave = $("#txtMinLeave").val();
        var maxLeave = $("#txtMaxLeave").val();

        //clubbing
        var clubbingLeaveTypes = '';
        if ($('input:checkbox[name=chkClub]:checked').length > 0) {
            $('input:checkbox[name=chkClub]:checked').each(function () {
                clubbingLeaveTypes += $(this).val() + '^';
            });
            clubbingLeaveTypes = clubbingLeaveTypes.slice(0, -1);
        }
        var clubbing = clubbingLeaveTypes;
        if ($("#txtleaveeligible").val()!="") {
            var leaveeligible = $("#txtleaveeligible").val();
        }
        else {
            var leaveeligible = 0;
        }
        if ($('input:checkbox[name=leaveconfirmation]:checked').val()=="Y") {
            var leaveconfirmation = $('input:checkbox[name=leaveconfirmation]:checked').val();
        }
        else {
            var leaveconfirmation ="N";
        }
        if ($('input:checkbox[name=leaveoncompletion]:checked').val() == "Y") {
            var leaveoncompletion = $('input:checkbox[name=leaveoncompletion]:checked').val();
        }
        else {
            var leaveoncompletion = "N";
        }
        if ($("#days").val() != "") {
            var noofdays = $("#days").val();
        }
        else {
            var noofdays = 0;
        }
        if ($("#applicdays").val() != "") {
            var applicdays = $("#applicdays").val();
        }
        else {
            var applicdays = 0;
        }
       
        var includeWeekEnd = $('input:radio[name=rdWeekEnd]:checked').val();
        var includeWeekEnd = $('input:radio[name=rdWeekEnd]:checked').val();
        var includeHoliday = $('input:radio[name=rdHoliday]:checked').val();
        var validation_Mode = $('input:radio[name=rdValMode]:checked').val();

        var leave_Occurrence_Count = "";
        if ($("#txtLOC").val() != "" && $("#txtLOC").val() != null && $("#txtLOC").val() != undefined) {
            leave_Occurrence_Count = $("#txtLOC").val();
        }

        var leave_Max_Count = "";
        if ($("#txtLMC").val() != "" && $("#txtLMC").val() != null && $("#txtLMC").val() != undefined) {
            leave_Max_Count = $("#txtLMC").val();
        }

        var consecutvie_Leave_Allowed = "";
        if ($("#txtCLA").val() != "" && $("#txtCLA").val() != null && $("#txtCLA").val() != undefined) {
            consecutvie_Leave_Allowed = $("#txtCLA").val();
        }

        var Document_Upload = "";
        if ($("#txtDoc").val() != "" && $("#txtDoc").val() != null && $("#txtDoc").val() != undefined) {
            Document_Upload = $("#txtDoc").val();
        }

        if ($.trim($("#txtEffectiveFrom").val()) != '') {
            var effectiveFrom = $("#txtEffectiveFrom").val().split('/')[2] + "-" + $("#txtEffectiveFrom").val().split('/')[1] + "-"
                            + $("#txtEffectiveFrom").val().split('/')[0];
        }

        if ($.trim($("#txtEffectiveTo").val()) != '') {
            var effectiveTo = $("#txtEffectiveTo").val().split('/')[2] + "-" + $("#txtEffectiveTo").val().split('/')[1] + "-"
                            + $("#txtEffectiveTo").val().split('/')[0];
        }

        var mode = $("#hdnMode").val();
        var userLeaveTypeCode = $("#hdnUserLeaveTypeCode").val();
        var selectedUserName = $("#cboUsers :selected").text();
        var selectedUserTypeName = $("#cboUserType :selected").text();
        var leaveTypeName = $("#cboLeaveType :selected").text();

        debugger;
        $.ajax({
            url: '../HiDoctor_Master/LeaveType/InsertUserLeaveTypeMaster/',
            type: "POST",
            data: "&userTypeCode=" + userTypeCode + "&user=" + user + "&leaveType=" + leaveType + "&minLeave=" + minLeave +
            "&maxLeave=" + maxLeave + "&clubbing=" + clubbing + "&leaveeligible=" + leaveeligible + "&leaveconfirmation=" + leaveconfirmation +
            "&leaveoncompletion=" + leaveoncompletion + "&noofdays=" + noofdays + "&applicdays=" + applicdays + "&includeWeekEnd=" + includeWeekEnd + "&includeHoliday=" + includeHoliday +
            "&effectiveFrom=" + effectiveFrom + "&effectiveTo=" + effectiveTo + "&mode=" + mode + "&userLeaveTypeCode=" + userLeaveTypeCode +
            "&selectedUserName=" + selectedUserName + "&selectedUserTypeName=" + selectedUserTypeName + "&leaveTypeName=" + leaveTypeName +
            "&validation_Mode=" + validation_Mode + "&leave_Occurrence_Count=" + leave_Occurrence_Count + "&leave_Max_Count=" + leave_Max_Count +
            "&Document_Upload=" + Document_Upload + "&consecutvie_Leave_Allowed=" + consecutvie_Leave_Allowed,
            success: function (result) {
                debugger;
                if (result == '1') {
                    fnMsgAlert('success', 'Success', 'User Leave Type has been successfully mapped');
                    fnClearAll();
                    fnGetUserLeaveType();
                }
                else {
                    fnMsgAlert('info', 'Error', 'Error while mapping the user leave type');
                }
                $("#dvMainUserLeaveType").unblock();
            },
            error: function () {
                $("#dvMainUserLeaveType").unblock();
            },
            complete: function () {
                $("#dvMainUserLeaveType").unblock();
            }
        });
    }
}

function fnClearAll() {

    $("#cboUserType").val('');
    $("#cboUsers option").remove();
    $("#cboUsers").append("<option value=''>-Select User-</option>");
    $("#cboLeaveType").val('');
    $("#txtMinLeave").val('');
    $("#txtMaxLeave").val('');
    $('input:checkbox[name=chkClub]:checked').each(function () {
        $(this).removeAttr('checked');
    });
    $('input:radio[name=rdWeekEnd]').attr('checked', false);
    $('input:radio[name=rdWeekEnd][value=N]').attr('checked', true);
    $('input:radio[name=rdHoliday]').attr('checked', false);
    $('input:radio[name=rdHoliday][value=N]').attr('checked', true);
    $('input:radio[name=rdValMode]').attr('checked', false);
    $('input:radio[name=rdValMode][value=0]').attr('checked', true);
    $("#txtLOC").val('');
    $('#txtLMC').val('');
    $('#txtDoc').val('');
    $("#txtEffectiveFrom").val('');
    $('#txtEffectiveFrom').prop('disabled', false);
    $("#txtEffectiveTo").val('');
    $('#txtEffectiveTo').prop('disabled', false);
    $('#hdnMode').val('INSERT');
    $('#btnULTypeSubmit').val('Save');
    $('#btnULTypeClear').val('Cancel');
    $('#txtCLA').val('');
    $("#txtleaveeligible").val('');
    $("#days").val('');
    $("#applicdays").val('');
    $('input:checkbox[name=leaveconfirmation]').attr('checked', false);
    $('input:checkbox[name=leaveoncompletion]').attr('checked', false);
}

function fnValidate() {
    debugger;
    if ($("#cboUserType").val() == "") {
        fnMsgAlert('info', 'Validate', 'Please select any user type');
        return false;
    }
    if ($("#cboUsers").val() == "") {
        fnMsgAlert('info', 'Validate', 'Please select any user');
        return false;
    }
    if ($("#cboLeaveType").val() == "") {
        fnMsgAlert('info', 'Validate', 'Please select any leave type');
        return false;
    }
    if ($.trim($("#txtEffectiveFrom").val()) == "") {
        fnMsgAlert('info', 'Validate', 'Please Enter Effective from');
        return false;
    }
    if ($.trim($("#txtEffectiveTo").val()) == "") {
        fnMsgAlert('info', 'Validate', 'Please Enter Effective to');
        return false;
    }

    if ($.trim($("#txtMinLeave").val()) != '' && $.trim($("#txtMaxLeave").val()) != '') {
        if (parseFloat($("#txtMinLeave").val()) > parseFloat($("#txtMaxLeave").val())) {
            fnMsgAlert('info', 'Info', 'Minimum leave should not exceed the maximum leave');
            return false;
        }
    }
    if ($.trim($('#txtEffectiveFrom').val()).length > 0) {
        var result = isValidDateFormat($('#txtEffectiveFrom'));
        if (!result) {
            fnMsgAlert('info', 'Info', 'Please enter valid date in effective from');
            return false;
        }
    }
    if ($.trim($('#txtEffectiveTo').val()).length > 0) {
        var result = isValidDateFormat($('#txtEffectiveTo'));
        if (!result) {
            fnMsgAlert('info', 'Info', 'Please enter valid date in effective to');
            return false;
        }
    }
    if ($.trim($('#txtEffectiveFrom').val()).length > 0 && $.trim($('#txtEffectiveTo').val()).length > 0) {
        var effFrom = $('#txtEffectiveFrom').val().split('/')[1] + "/" + $('#txtEffectiveFrom').val().split('/')[0]
            + "/" + $('#txtEffectiveFrom').val().split('/')[2];
        var effTo = $('#txtEffectiveTo').val().split('/')[1] + "/" + $('#txtEffectiveTo').val().split('/')[0] + "/"
            + $('#txtEffectiveTo').val().split('/')[2];
        var d1 = new Date(effFrom);
        var d2 = new Date(effTo);
        if ((d2 - d1) < 0) {
            fnMsgAlert('info', 'Info', 'Effective to date must be greater than or equal to Effective from date');
            return false;
        }
    }

    return true;
}

function fnEdit(userLeaveTypeCode, userTypeCode) {
    debugger;
    $("#hdnMode").val('EDIT');
    $("#hdnUserLeaveTypeCode").val(userLeaveTypeCode);
    $("#cboUserType").val(userTypeCode);
    $.ajax({
        url: '../HiDoctor_Master/LeaveType/GetUsersByUserType/',
        type: "POST",
        data: "userTypeCode=" + userTypeCode + "",
        success: function (result) {
            var users = $("#cboUsers");
            $("#cboUsers option").remove();
            users.append(result);
            debugger;
            $.ajax({
                url: '../HiDoctor_Master/LeaveType/GetSelectedUserLeaveTypeDetails/',
                type: "POST",
                data: "userLeaveTypeCode=" + userLeaveTypeCode + "",
                success: function (result) {
                    if (result != '') {
                        var jsonResult = eval('(' + result + ')');
                        fnBindDetails(jsonResult);
                    }
                    else {
                        fnMsgAlert('info', 'Error', 'Sorry, can not get the leave type details');
                        return;
                    }
                },
                error: function () {
                },
                complete: function () {
                }
            });
        },
        error: function () {
        },
        complete: function () {
        }
    });

}

function fnBindDetails(userLeaveTypeJson) {
    debugger;
    if (userLeaveTypeJson != '') {
        $('#btnULTypeSubmit').val('Update');
        $("#cboUsers").val(userLeaveTypeJson[0].User_Code)
        $("#cboUserType").val(userLeaveTypeJson[0].User_Type_Code)
        $("#cboLeaveType").val(userLeaveTypeJson[0].Leave_Type_Code)
        $("#txtMinLeave").val(userLeaveTypeJson[0].Min_Leave);
        $("#txtMaxLeave").val(userLeaveTypeJson[0].Max_Leave);
        if (userLeaveTypeJson[0].Club_Other_Leavetype != "") {
            var clubLeaveArr = userLeaveTypeJson[0].Club_Other_Leavetype.split('^');
            $('input:checkbox[name=chkClub]').each(function () {
                if ($.inArray($(this).val(), clubLeaveArr) > -1) {
                    $(this).attr('checked', true);
                }
            });
        }
        else {
            $('input:checkbox[name=chkClub]:checked').each(function () {
                $(this).removeAttr('checked');
            });
        }
        $('input:radio[name=rdWeekEnd]').attr('checked', false)
        if (userLeaveTypeJson[0].IS_Added_Weekend_Holiday == 'Y') {
            $('input:radio[name=rdWeekEnd][value=Y]').attr('checked', true)
        }
        else {
            $('input:radio[name=rdWeekEnd][value=N]').attr('checked', true)
        }
        $('input:radio[name=rdHoliday]').attr('checked', false)
        if (userLeaveTypeJson[0].IS_Added_Holiday == 'Y') {
            $('input:radio[name=rdHoliday][value=Y]').attr('checked', true)
        }
        else {
            $('input:radio[name=rdHoliday][value=N]').attr('checked', true)
        }
        debugger;
        $('input:radio[name=rdValMode]').attr('checked', false);
        if (userLeaveTypeJson[0].Validation_Mode == '1') {
            $('input:radio[name=rdValMode][value=1]').attr('checked', true);
        }
        else if (userLeaveTypeJson[0].Validation_Mode == '2') {
            $('input:radio[name=rdValMode][value=2]').attr('checked', true);
        }
        else {
            $('input:radio[name=rdValMode][value=0]').attr('checked', true);
        }
        $("#txtLOC").val(userLeaveTypeJson[0].Leave_Occurence_Count);
        $("#txtLMC").val(userLeaveTypeJson[0].Leave_Max_Count);
        $("#txtCLA").val(userLeaveTypeJson[0].Consecutvie_Leave_Allowed);
        $("#txtDoc").val(userLeaveTypeJson[0].Document_Upload_Days);
        $("#txtEffectiveFrom").val(userLeaveTypeJson[0].Effective_From);
        $("#txtEffectiveTo").val(userLeaveTypeJson[0].Effective_To);
        $("#txtEffectiveFrom").prop("disabled", true);
        $("#txtEffectiveTo").prop("disabled", true);
        $('#dvTabs').tabs('option', 'selected', 0);
        $("#txtleaveeligible").val(userLeaveTypeJson[0].leave_Eligibleforyear);
        if (userLeaveTypeJson[0].leave_confirmation_days == 'Y') {
            $('input:checkbox[name=leaveconfirmation][value=Y]').attr('checked', true)
        }
        else {
            $('input:checkbox[name=leaveconfirmation]').attr('checked', false)
        }
        if (userLeaveTypeJson[0].leave_Oncompletion == 'Y') {
            $('input:checkbox[name=leaveoncompletion][value=Y]').attr('checked', true)
        }
        else {
            $('input:checkbox[name=leaveoncompletion]').attr('checked', false)
        }
        $("#days").val(userLeaveTypeJson[0].No_of_days);
        $("#applicdays").val(userLeaveTypeJson[0].leave_application_days);
    }
}

function fnChangeStatus(userLeaveTypeCode, status) {
    debugger;
    if (confirm('Do you want to change the status ? ')) {
        var userLeaveTypeStatus = "";
        if (status == "ENABLED") {
            userLeaveTypeStatus = "1";
        }
        else {
            userLeaveTypeStatus = "0";
        }
        $.ajax({
            url: '../HiDoctor_Master/LeaveType/DeleteUserLeaveTypeMaster/',
            type: "POST",
            data: "&userLeaveTypeCode=" + userLeaveTypeCode + "&status=" + userLeaveTypeStatus + "",
            success: function (result) {
                if (!isNaN(result)) {
                    if (parseInt(result) > 0) {
                        fnMsgAlert('success', 'Success', 'User leave type status changed successfully');
                        fnGetUserLeaveType();
                    }
                    else {
                        fnMsgAlert('error', 'Error', 'Error while changing the user leave type status');
                    }
                }
                else {
                    fnMsgAlert('error', 'Error', 'Error while changing the user leave type status');
                }
                $("#dvMainUserLeaveType").unblock();
            },
            error: function () {
                $("#dvMainUserLeaveType").unblock();
            },
            complete: function () {
                $("#dvMainUserLeaveType").unblock();
            }
        });
    }
}

function fnSummaryHide(divid, spnid) {
    debugger;
    if ($('.' + divid).css("display") == "none") {
        $('.' + divid).fadeIn('slow');
        $('#' + spnid).removeClass('expandLeaveType');
    }
    else {
        $('.' + divid).fadeOut('slow');
        $('#' + spnid).addClass('expandLeaveType');
    }
}

//-----------------------------START - LEAVE BALANCE UPDATE---------------------------------------//
//Download LeaveType Name
function fnGenerateLeaveTypeNameExcelData() {
    $.ajax({
        url: '../HiDoctor_Master/LeaveType/DownloadLeaveTypeNameExcelTemplate',
        type: "POST",
        data: "A",
        success: function (result) {
            if (result.length > 0) {
                if (result == "No Data Found") {
                    $('#lnkLeaveDownload').attr("href", "../Content/XLTemplates/" + result);
                    $('#lnkLeaveDownload').html(result);
                    $('#lnkLeaveDownload').css("display", "");
                    $("#dvDownoadforLeave").css("display", "block");
                }
                else {
                    $('#lnkLeaveDownload').attr("href", "../Content/XLTemplates/" + result);
                    $('#lnkLeaveDownload').html(result);
                    $('#lnkLeaveDownload').css("display", "");
                    $("#dvDownoadforLeave").css("display", "block");
                }
            }
            else {
                $('#dvDownoadforLeave').html("Failed");
            }

        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message.split('^')[1]);
        }
    });
}

//DownLoad EmployeeDetails
function fnGenerateEmployeedetailsExcelData() {
    $.ajax({
        url: '../HiDoctor_Master/LeaveType/DownloadEmployeeDetailsExcelTemplate',
        type: "POST",
        data: "A",
        success: function (result) {
            if (result.length > 0) {
                if (result == "No Data Found") {
                    $('#lnkEmployeeDownload').attr("href", "../Content/XLTemplates/" + result);
                    $('#lnkEmployeeDownload').html(result);
                    $('#lnkEmployeeDownload').css("display", "");
                    $("#dvDownoadforemployee").css("display", "block");
                }
                else {
                    $('#lnkEmployeeDownload').attr("href", "../Content/XLTemplates/" + result);
                    $('#lnkEmployeeDownload').html(result);
                    $('#lnkEmployeeDownload').css("display", "");
                    $("#dvDownoadforemployee").css("display", "block");
                }
            }
            else {
                $('#dvDownoadforemployee').html("Failed");
            }

        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message.split('^')[1]);
        }
    });
}
//-----------------------------END - LEAVE BALANCE UPDATE-----------------------------------------//