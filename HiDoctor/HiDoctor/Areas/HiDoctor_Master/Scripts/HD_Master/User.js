
var ExpenseGroupMapping = "Expense Group";
var userCodes = "";
var userC = "";
var dcrdate = "";
/************* Get Master Datas for User **************/
function regExforAlphaNumericUserName(value) {
    var specialCharregex = new RegExp("^[a-zA-Z0-9]+$");
    if (!specialCharregex.test(value)) {
        return false;
    }
    else {
        return true;
    }
}



function fnGetMasterDataForUser() {
    debugger;
    $.blockUI();
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/User/GetMasterDetailsForUser',
        data: "A",
        success: function (jsData) {
            // jsData = eval('(' + jsData + ')');
            var divisionJson = jsData[0].Data;
            var employeeJson = jsData[1].Data;
            var expenseJson = jsData[2].Data;
            var userJson = jsData[3].Data;
            userJson_g = userJson;
            var regionJson = jsData[4].Data;
            var userTypeJson = jsData[5].Data;
            var allusersJson = jsData[6].Data;
            allusersJson_g = allusersJson;

            var region = $("#cboRegion");
            var user = $("#cboUnderUser");
            var userType = $("#cboUserType");
            //var division = $("#cboDivision");
            //var category = $("#cboCategory");
            var expense = $("#cboExpense");
            var expenseGroup = $("#cboExpenseGroupCode");

            //Division Bind
            //var division = $("#cboDivision");
            //$('option', division).remove();
            //division.append("<option value=0>-Division-</option>");
            //if (divisionJson.length > 0) {
            //    for (var a = 0; a < divisionJson.length; a++) {
            //        division.append("<option value=" + divisionJson[a].Division_Code + ">" + divisionJson[a].Division_Name + "</option>");
            //    }
            //}
            //$("#cboDivision").attr('selectedIndex', 0)

            //Employee Bind
            var employee = "[";
            for (var b = 0; b < employeeJson.length; b++) {
                employee += "{label:" + '"' + "" + employeeJson[b].Employee_Name + '_' + employeeJson[b].Employee_Number + "" + '",' + "value:" + '"' + ""
                                + employeeJson[b].Employee_Code + "" + '"' + "}";
                if (b < employeeJson.length - 1) {
                    employee += ",";
                }
            }
            employee += "];";
            employeeJson_g = eval(employee);
            autoComplete(employeeJson_g, "txtEmployee", "hdnEmployeeCode", "autoEmployee");

            //ExpenseGroup Bind
            $('option', expenseGroup).remove();
            expenseGroup.append("<option value=0>-Expense Group-</option>");
            if (expenseJson.length > 0) {
                for (var c = 0; c < expenseJson.length; c++) {
                    expenseGroup.append("<option value=" + expenseJson[c].Expense_Group_Id + ">" + expenseJson[c].Expense_Group_Name + "</option>");
                }
            }
            $("#cboExpenseGroupCode").attr('selectedIndex', 0)

            //userJson
            $('option', user).remove();
            user.append("<option value=0>-Under User-</option>");
            if (userJson.length > 0) {
                for (var d = 0; d < userJson.length; d++) {
                    user.append("<option value=" + userJson[d].User_Code + ">" + userJson[d].User_Name + "</option>");
                }
            }
            $("#cboUnderUser").attr('selectedIndex', 0)
            var userTree = $("#dvUserTree").dynatree("getTree");
            if (userTree.getActiveNode() != null) {
                $("#cboUnderUser").val(userTree.getActiveNode().data.key);
            }
            //Region Bind
            $('option', region).remove();
            region.append("<option value=0>-Region-</option>");
            if (regionJson.length > 0) {
                for (var e = 0; e < regionJson.length; e++) {
                    region.append("<option value=" + regionJson[e].Region_Code + ">" + regionJson[e].Region_Name + "</option>");
                }
            }
            $("#cboRegion").attr('selectedIndex', 0)
            //User Type Json

            $('option', userType).remove();
            userType.append("<option value=0>-User Type-</option>");
            if (userTypeJson.length > 0) {
                for (var f = 0; f < userTypeJson.length; f++) {
                    if (userTypeJson[f].User_Type_Status == "1") {
                        userType.append("<option value=" + userTypeJson[f].User_Type_Code + ">" + userTypeJson[f].User_Type_Name + "</option>");
                    }
                }
            }
            $("#cboUserType").attr('selectedIndex', 0)
            $("#dvAjaxLoad").hide();
            if ($("#hdnMode").val() == "EDIT") {
                $("#dvAjaxLoad").show();
                $.ajax({
                    url: '../HiDoctor_Master/User/GetSelectedUserDetails/',
                    type: "POST",
                    data: "UserCode=" + userCode + "",
                    success: function (jsData) {
                        if (jsData != '') {
                            fnBindSelectedUserDetails(jsData);
                            $("#dvAjaxLoad").hide();
                        }
                        $.unblockUI();
                    },
                    error: function () {
                        $("#dvAjaxLoad").hide();
                        $.unblockUI();
                    },
                    complete: function () {
                        $("#dvAjaxLoad").hide();
                        $.unblockUI();
                    }
                });
            }
        },
        error: function () {
            $("#dvAjaxLoad").hide();
            $.unblockUI();
        },
        complete: function () {
            $.unblockUI();
        }
    });
}
function FnValidateUserNameExistance() {
    if ($("#hdnMode").val() != "EDIT") {
        if ($("#txtUserName").val() != '') {
            if ($("#hdnUserCode").val() == '') {
                var result = regExforAlphaNumericUserName($.trim($("#txtUserName").val()));
                if (!result) {
                    fnMsgAlert('info', 'Info', 'Space between the User Name is not Allowed.', 'dvErrorUser');
                    $("#txtUserName").val('');
                }
                if (allusersJson_g != '') {
                    if (allusersJson_g.length > 0) {
                        var disJson = jsonPath(allusersJson_g, "$.[?(@.User_Name=='" + $.trim($("#txtUserName").val()).toUpperCase() + "')]");
                        if (disJson.length > 0) {
                            if (disJson[0].User_Status == "1") {
                                fnMsgAlert('info', 'Caution!', 'Dear User the same user name ' + $.trim($("#txtUserName").val()).toUpperCase() + ' is already available in the system in active status.You cannot assign this name to any other user. Please use some other user name');
                            }
                            else {
                                fnMsgAlert('info', 'Caution!', 'Dear User the same user name ' + $.trim($("#txtUserName").val()).toUpperCase() + ' is already available in the system in disable status.You cannot assign this name to any other user. Please use some other user name');
                            }

                        }
                    }
                }
            }
        }
    }
}

function fnValidateUserInsertion() {
    debugger;

    //var g_Ex_Mandatory;
    fnUserExpenseGroup();
    var flag = true;
    if ($("#dvUser").is(":visible")) {
        if ($("#cboRegion").val() == "0") {
            $("#cboRegion").attr('title', 'Please select region');
            $("#cboRegion").addClass('errorIndicator tip');
            $("#cboRegion").focus();
            flag = false;
        }
    }
    if ($("#txtUserName").val() == "") {
        $("#txtUserName").attr('title', 'Please enter user name');
        $("#txtUserName").addClass('errorIndicator tip');
        flag = false;
    }
    //if ($("#txtUserName").val() != "") {
    //    var result = regExforAlphaNumericUserName($.trim($("#txtUserName").val()));
    //    if (!result) {
    //        fnMsgAlert('info', 'User BUlk Add', 'Special characters are not allowed in User Name.');
    //        return false;
    //    }
    //}
    //if ($("#hdnMode").val() != "EDIT") {
    //if ($("#txtUserPassWord").val() == "") {
    //    $("#txtUserPassWord").attr('title', 'Please enter user password');
    //    $("#txtUserPassWord").addClass('errorIndicator tip');
    //    flag = false;
    //}
    // }
    //var words = ["!", "@", "#", "$", "%", "^", "&", "(", ")", "{", "+", "=", "[", "}", "]", "?", ">", "<", ",", ".", ";", ":", "/", "|"];
    //var password = new Array();
    //password = $("#txtUserPassWord").val();
    //for (var i = 0; i <= password.length; i++) {
    //    var a = words.indexOf(password[i]);
    //    if (a >= 0) {
    //        $("#txtUserPassWord").attr('title', 'Special characters like * _ - are only allowed');
    //        $("#txtUserPassWord").addClass('errorIndicator tip');
    //        flag = false;
    //    }
    //}

    //if (password.length >= 31) {
    //    $("#txtUserPassWord").attr('title', 'Please enter minimum 30 character in password.');
    //    $("#txtUserPassWord").addClass('errorIndicator tip');
    //    flag = false;
    //}
    if ($("#txtEmployee").val() == "") {
        $("#txtEmployee").attr('title', 'Please select employee name which is available in the employee master');
        $("#txtEmployee").addClass('errorIndicator tip');
        flag = false;
    }
    if ($("#txtEmployee").val() != "") {
        if ($("#hdnEmployeeCode").val() == "") {
            $("#txtEmployee").attr('title', 'Please select the valid employee name which is available in the employee master');
            $("#txtEmployee").addClass('errorIndicator tip');
            flag = false;
        }
    }

    if ($("#cboUserType").val() == "0") {
        $("#cboUserType").attr('title', 'Please select User type');
        $("#cboUserType").addClass('errorIndicator tip');
        flag = false;
    }
    if ($("#cboUnderUser").val() == "0") {
        $("#cboUnderUser").attr('title', 'Please select under user');
        $("#cboUnderUser").addClass('errorIndicator tip');
        flag = false;
    }


    if ($("#txtHiDoctorStartDate").val() == "") {
        $("#txtHiDoctorStartDate").attr('title', 'Please select HiDoctor start Date');
        $("#txtHiDoctorStartDate").addClass('errorIndicator tip');
        flag = false;
    }

    // ************************Expense Group Mapping Mandatory Based on Privilege Set**************************//

    debugger;
    var mandatoryExpGrp = false;
    var leng = g_Ex_Mandatory.length;
    for (var k = 0; k < leng; k++) {
        if (g_Ex_Mandatory[k].user_type_code == $('#cboUserType option:selected').val()) {
            if (g_Ex_Mandatory[k].PRIVILEGE_VALUE_NAME == "YES")
                mandatoryExpGrp = true;

            //else {
            //    (g_Ex_Mandatory[k].PRIVILEGE_VALUE_NAME == "NO")
            //    mandatoryExpGrp = false;
            //}
        }

    }



    var expenseGroupIds = $('#cboExpenseGroupCode option:selected').val();
    if (mandatoryExpGrp)
        if ($("#cboExpenseGroupCode").val() == '0') {
            $("#cboExpenseGroupCode").attr('title', 'Expense group mapping is mandatory for this selected user type(s)/designation(s)');
            $("#cboExpenseGroupCode").addClass('errorIndicator tip');
            expenseGroupIds = false;
        }
    if (!mandatoryExpGrp) {
        $("#cboExpenseGroupCode").removeAttr('title', 'Expense group mapping is mandatory for this selected user type(s)/designation(s)');
        $("#cboExpenseGroupCode").removeClass('errorIndicator tip');

    }

    if ($("#hdnMode").val() != "EDIT") {
        if ($("#txtUserName").val() != '') {
            if ($("#hdnUserCode").val() == '') {
                if (allusersJson_g != '') {
                    if (allusersJson_g.length > 0) {
                        var disJson = jsonPath(allusersJson_g, "$.[?(@.User_Name=='" + $.trim($("#txtUserName").val()).toUpperCase() + "')]");
                        if (disJson.length > 0) {
                            if (disJson[0].User_Status == "1") {
                                //  fnMsgAlert('info', 'Caution!', 'Dear User the same user name ' + $("#txtUserName").val().toUpperCase() + ' is already available in the system in active status');
                                $("#txtUserName").attr('title', 'User name ' + $.trim($("#txtUserName").val()).toUpperCase() + ' already exists in the system in active status');
                                $("#txtUserName").addClass('errorIndicator tip');
                                flag = false;
                            }
                            else {
                                $("#txtUserName").attr('title', 'User name ' + $.trim($("#txtUserName").val()).toUpperCase() + ' already exists in the system in disable status');
                                $("#txtUserName").addClass('errorIndicator tip');
                                flag = false;
                                // fnMsgAlert('info', 'Caution!', 'Dear User the same user name ' + $("#txtUserName").val().toUpperCase() + ' is already available in the system in disable status');
                            }
                        }
                    }
                }
            }

        }
    }
    if ($("#hdnUserCode").val() == '') {
        if (employeeJson_g != '') {
            if (employeeJson_g.length > 0) {
                var disJson = jsonPath(employeeJson_g, "$.[?(@.Employee_Name=='" + $("#txtEmployee").val().toUpperCase() + "')]");
                if (disJson != false) {
                    if (disJson.length > 0) {
                        $("#txtEmployee").attr('title', 'Please validate employee name');
                        $("#txtEmployee").addClass('errorIndicator tip');
                        flag = false;
                    }
                }

            }
        }
    }
    if ($("#hdnMode").val() != "EDIT") {
        if ($("#hdnUserCode").val() == '') {
            if (userJson_g != '') {
                if (userJson_g.length > 0) {
                    var disJson = jsonPath(userJson_g, "$.[?(@.Employee_Code=='" + $("#hdnEmployeeCode").val() + "')]");
                    if (disJson != false) {
                        if (disJson.length > 0) {
                            $("#txtEmployee").attr('title', 'Employee name already mapped to ' + disJson[0].User_Name);
                            $("#txtEmployee").addClass('errorIndicator tip');
                            flag = false;
                        }
                    }

                }
            }
        }
    }
    // $(".tip").tooltip({ position: "center right", offset: [-2, 10], effect: "fade", opacity: 0.7 });
    return flag;
}
function fnRemoverErrorIndicator(obj) {
    $(obj).removeClass('errorIndicator');
    $(obj).removeClass('tip');
    $(obj).removeClass('tooltip');
    $(obj).removeAttr('title');
}

function fnUserSubmit() {
    debugger;
    $("#dvAjaxLoad").show();
    //$('#btnUserSave').hide();
    var result = fnValidateUserInsertion();
    if (result == true) {
        $('#btnUserSave').show();
    }
    else {
        $('#btnUserSave').show();
    }
    if (result) {
        $("#dvAjaxLoad").show();
        if ($("#dvUserMain .errorIndicator").length > 0) {
            fnMsgAlert('info', 'Info', 'Please correct the error then try to submit');
            $("#dvAjaxLoad").show();
            return;
        }
        //if (password == '') {
        //    $("#txtPassWord_" + i).addClass("errorIndicator");
        //    $("#txtPassWord_" + i).attr('title', 'Please enter user password');
        //    flag = false;
        //}

        //var words = ["#", "$", "%", "^", "&", "(", ")", "{", "+", "=", "[", "}", "]", "?", ">", "<", ",", ".", ";", ":", "/", "|"];
        //var passwords = new Array();
        //passwords = password;
        //for (var c = 0; c <= passwords.length; c++) {
        //    var a = words.indexOf(passwords[c]);
        //    if (a >= 0) {
        //        $("#txtPassWord_" + i).addClass("errorIndicator");
        //        $("#txtPassWord_" + i).attr('title', 'Special characters like * _ - ! @ are only allowed');
        //        //fnMsgAlert('info', 'Change Password', "Special character are not allowed in password.");
        //        flag = false;
        //    }
        //}

        //if (passwords.length >= 31) {
        //    $("#txtPassWord_" + i).addClass("errorIndicator");
        //    $("#txtPassWord_" + i).attr('title', 'Please enter minimum 30 character in password.');
        //    flag = false;
        //}

        //if (passwords.length < 5) {
        //    $("#txtPassWord_" + i).addClass("errorIndicator");
        //    $("#txtPassWord_" + i).attr('title', 'Please enter minimum 6 character in password.');
        //    flag = false;
        //}
        var regionCode = "";
        if ($("#dvUser").is(":visible")) {
            regionCode = $("#cboRegion").val();
        }
        else {
            regionCode = $("#hdnRegionCode").val();
        }
        var hidoctorStartDate = $("#txtHiDoctorStartDate").val().split('/')[2] + "-" + $("#txtHiDoctorStartDate").val().split('/')[1]
                                + "-" + $("#txtHiDoctorStartDate").val().split('/')[0];
        var divisionName = "";
        //var UserPass = $("#txtUserPassWord").val();
        //if (UserPass == "") {
        //    UserPass = null;
        //}
        $.blockUI();
        $.ajax({
            url: '../HiDoctor_Master/User/InsertUserMaster/',
            type: "POST",
            data: "UserCode=" + $("#hdnUserCode").val() + "&EmployeeCode=" + $("#hdnEmployeeCode").val() + "&UserTypeCode=" + $("#cboUserType").val()
                + "&UnderUserCode=" + $("#cboUnderUser").val() + "&UserName=" + $.trim($("#txtUserName").val()) + "&UserPass=" + $("#txtUserPassWord").val()
                + "&UserStatus=1&RegionCode=" + regionCode + "&UserDivisionCode=" + divisionName + "&ExpenseGroupId=" + $("#cboExpenseGroupCode").val()
                + "&HiDOCTORStartDate=" + hidoctorStartDate + "&mode=" + $("#hdnMode").val() + "",
            success: function (data) {
                debugger;
                if (data.split(':')[0] == 'SUCCESS') {
                    //  $("#dvAjaxLoad").hide();
                    if ($("#hdnUserCode").val() != '') {
                        fnMsgAlert('success', 'Success', "" + data.split(':')[1] + " user updated successfully");
                        fnUserClearAll();
                        fnGetMasterDataForUser();
                        $('#btnUserSave').show();
                        $("#dvEditUser").overlay().close();
                        $("#dvUserInfo").show();
                        $("#dvUserInfo").html(" --> Click refresh button to see your changes");
                        if (entryMode.toUpperCase() == "REGION") {
                            $("#dvRegionInfo").show();
                            $("#dvRegionInfo").html(" --> Click refresh button to see your changes");
                        }
                        $('.blink').blink();
                        // $("#dvAjaxLoad").hide();
                    }
                    else {
                        //  $("#dvAddUser").overlay().close();
                        fnMsgAlert('success', 'Success', "" + data.split(':')[1] + " user inserted successfully");
                        //fnBindUserTree("dvUserTree");
                        fnUserClearAll();
                        fnGetMasterDataForUser();
                        $('#btnUserSave').show();
                        $("#dvAddUser").overlay().close();
                        $("#dvUserInfo").show();
                        $("#dvUserInfo").html(" --> Click refresh button to see your changes");
                        if (entryMode.toUpperCase() == "REGION") {
                            $("#dvRegionInfo").show();
                            $("#dvRegionInfo").html(" --> Click refresh button to see your changes");
                        }
                        $('.blink').blink();
                        // $("#dvAjaxLoad").hide();
                    }
                }
                else {
                    // $("#dvAjaxLoad").hide();
                    fnMsgAlert('error', 'Error', "" + data.split(':')[1] + " user inserted failed");
                    $('#btnUserSave').show();

                }
                $.unblockUI();
            },
            error: function () {
                // $("#dvAjaxLoad").hide();
                $.unblockUI();
            },

            complete: function () {
                $.unblockUI();
                // $("#dvAjaxLoad").hide();
            }
        });
    }
    else {
        $("#dvAjaxLoad").hide();
        if ($("#dvUserMain .errorIndicator").length > 0) {
            fnMsgAlert('info', 'Info', 'Please correct the errors then try to submit');
            //$("#dvUserMain .errorIndicator")[0].focus();
            return;
        }
    }

}

/*
* clear user deatils from the user pop up
*/
function fnUserClearAll() {
    $("#txtEmployee").val("");
    $("#hdnEmployeeCode").val("");
    $("#cboUserType").val("0");
    $("#cboUnderUser").val("0");
    $("#cboRegion").val("0");
    $("#txtRegion").val('');
    $("#hdnRegionCode").val('');
    // $("#cboDivision").val("0");
    //  $("#cboCategory").val("0");
    $("#cboExpenseGroupCode").val("0");
    $("#hdnUserCode").val("");
    $("#txtUserName").val("");
    $("#txtUserPassWord").val("");
    $("#hdnMode").val('INSERT');
}

function fnGetChildUsersFromRegion() {
    $.blockUI();
    // $("#dvAjaxLoad").show();
    $("#dvUsers").html('');
    $("#dvUserCountInfo").html('');
    if (disableMode_g == "REGION") {
        $.ajax({
            url: '../HiDoctor_Master/User/GetChildUsersByRegion/',
            type: "POST",
            data: "regionCode=" + disRegionCode_g + "",
            success: function (jsData) {
                if (jsData != '') {
                    //  jsData = eval('(' + jsData + ')');
                    var content = "";
                    content += "<table style=width:90%'><thead style='height:25px;'><tr><td style='width:5%;text-align:left;'>Select</td><td style='width:30%;text-align:left;'>Users</td><td style='width:20%;text-align:left;'>Resignation Date</td></tr></thead>";
                    var disUserJson = jsonPath(jsData, "$.[?(@.Region_Code=='" + disRegionCode_g + "')]");
                    if (disUserJson != false) {
                        var flag = true;
                        for (var r = 0; r < disUserJson.length; r++) {
                            content += "<tr>";
                            // var disJson = jsonPath(jsData, "$.[?(@.Reporting_Manager_Code=='" + disUserJson[r].User_Code + "')]");
                            //   if (disJson != false) {
                            if (parseInt(disUserJson[r].Child_User_Count) > 0) {
                                content += "<td><span>*</span><input type='checkbox' disabled=disabled id='chkUser_" + r + "' name='chkUserSelect' value='" + disUserJson[r].User_Code + "' /></td>";
                                content += "<td id='tdUserName_" + r + "'>" + disUserJson[r].User_Name + "(" + disUserJson[r].User_Type_Name + ") - " + disUserJson[r].Region_Name + "</td>";
                                content += "<td><input type='text' id='txtResignationDate_" + r + "' disabled=disabled  style='width:85% !important'/></td>";
                                flag = false;
                            }
                            else {
                                content += "<td><input type='checkbox' id='chkUser_" + r + "' name='chkUserSelect' value='" + disUserJson[r].User_Code + "' /></td>";
                                content += "<td id='tdUserName_" + r + "'>" + disUserJson[r].User_Name + "(" + disUserJson[r].User_Type_Name + ") - " + disUserJson[r].Region_Name + "</td>";
                                content += "<td><input type='text' id='txtResignationDate_" + r + "'  class='datepicker' style='width:85% !important'/><span class='Mandatory'>*</span></td>";
                            }
                            content += "</tr>";
                        }
                    }

                    content += "</table>";
                    $("#dvUsers").html(content);
                    $(".datepicker").datepicker({ "changeMonth": true, "changeYear": true, "dateFormat": "dd/mm/yy" });
                    $("#dvUserCountInfo").html("There are " + disUserJson.length + " user(s) mapped to " + disRegionName_g + "<br/>Please select the user(s)  and enter the resignation date then click Disable User button to disable the users");
                    if (flag) {
                        $("#dvReporingInfo").hide();
                    }
                    $("#dvAjaxLoad").hide();
                }
                $.unblockUI();
            },
            error: function () {
                $("#dvAjaxLoad").hide();
                $.unblockUI();
            },
            complete: function () {
                $.unblockUI();
            }
        });
    }
    else {
        $.ajax({
            url: '../HiDoctor_Master/User/GetChildUsers/',
            type: "POST",
            data: "userCode=" + disableUserCode_g + "",
            success: function (jsData) {
                if (jsData != '') {
                    var content = "";
                    content += "<table style=width:90%'><thead style='height:25px;'><tr><td style='width:5%;text-align:left;'>Select</td><td style='width:30%;text-align:left;'>Users</td><td style='width:20%;text-align:left;'>Resignation Date</td></tr></thead>";
                    for (var r = 0; r < jsData.length; r++) {
                        content += "<tr>";
                        content += "<td><input type='checkbox' id='chkUser_" + r + "' name='chkUserSelect' value='" + jsData[r].User_Code + "' /></td>";
                        content += "<td id='tdUserName_" + r + "'>" + jsData[r].User_Name + "(" + jsData[r].User_Type_Name + ") - " + jsData[r].Region_Name + "</td>";
                        content += "<td><input type='text' id='txtResignationDate_" + r + "'  class='datepicker' style='width:85% !important'/><span class='Mandatory'>*</span></td>";
                        content += "</tr>";
                    }

                    content += "</table>";
                    $("#dvUsers").html(content);
                    $(".datepicker").datepicker({ "changeMonth": true, "changeYear": true, "dateFormat": "dd/mm/yy" });
                    $("#dvUserCountInfo").html("Please select the user(s) and enter the resignation date then click Disable User button to disable the users");
                    $("#dvReporingInfo").hide();
                    $("#dvAjaxLoad").hide();
                }
                $.unblockUI();
            },
            error: function () {
                $("#dvAjaxLoad").hide();
                $.unblockUI();
            },
            complete: function () {
                $.unblockUI();
            }
        });
    }
}


function fnGetDCRdate() {
    debugger;
    var usercode = userC;

    var dcr = "";
    $.ajax({
        url: '../HiDoctor_Master/User/GetDCRdate',
        type: "POST",
        async: false,
        //  dataType:"application/json",
        data: "UserCode=" + usercode,
        success: function (JsonResult) {
            debugger;
            if (JsonResult != null && JsonResult != '') {
                if (JsonResult.length > 1) {
                    json_GetchildUsers = eval('(' + JsonResult + ')');
                    dcr = eval('(' + JsonResult + ')');
                    dcrdate = dcr[0].DCR_Entered_Date;
                    //$('#txtResignationDate_' + r).datepicker('option', { minDate: new Date(dcrdate), "changeMonth": true, "changeYear": true, "dateFormat": "dd/mm/yy" });
                    //$(".datepicker").datepicker({ "changeMonth": true, "changeYear": true, "dateFormat": "dd/mm/yy" ,minDate: new Date(dcrdate) });
                }
            }
        }
    });
}
var resDate = '';
function fnDisableUser() {
    debugger;
    if ($("#dvUsers .errorIndicator").length > 0) {
        $("#dvUsers .errorIndicator").removeClass("errorIndicator");
    }
    var count = 0;
    var flag = true;

    $("input:checkbox[name=chkUserSelect]").each(function () {
        if (this.checked) {
            debugger;
            var rowId = $(this)[0].id;
            resDate = $("#txtResignationDate_" + rowId.split('_')[1]).val();
            //dcrdate = fnGetDCRdate();

            if (resDate == '') {
                $("#txtResignationDate_" + rowId.split('_')[1]).addClass("errorIndicator");
                flag = false;
                count = parseInt(count) + 1;
            }
            else {
                resDate = resDate.split('/')[2] + "/" + resDate.split('/')[1] + "/" + resDate.split('/')[0];
                userCodes += $(this).val() + "|" + resDate + "~";
                var user = userCodes.split('|');
                userC = user[0];

                //fnGetDCRdate();

                count = parseInt(count) + 1;


            }
        }

    });

    if (count == 0) {
        fnMsgAlert('info', 'Info', 'Please select atleast any one user');
        return;
    }
    if (flag == false) {
        fnMsgAlert('info', 'Info', 'Please select the Resignation date for the selected users');
        return;
    }
    else {
        $.blockUI();
        //$("#dvAjaxLoad").show();
        $.ajax({
            url: '../HiDoctor_Master/User/BulkUserDisable',
            type: "POST",
            data: "userCodes=" + userCodes + "",
            success: function (result) {
                debugger;
                //var dtDcr = new Date(dcrdate);
                //var resgDate = new Date(resDate);
                //dcrdate = dcrdate.split('/')[2] + "/" + dcrdate.split('/')[1] + "/" + dcrdate.split('/')[0];
                //debugger;
                //if (dtDcr >= resgDate) {
                //    fnMsgAlert('info', 'Info', 'Resignation date should be greater than last DCR date "' + dcrdate + '"');
                //    return false;
                //}
                //else 
                if (result.split(':')[0] == "SUCCESS") {
                    //  $("#dvDisableUser").overlay().close();
                    fnMsgAlert('success', 'Success', "User status updated successfully");
                    // fnBindUserTree("dvUserTree");
                    //fnBindRegionTree("dvRegionTree");
                    if (disableMode_g == "REGION") {
                        $("#dvDisableRegionUser").overlay().close();
                        $("#dvUserInfo").show();
                        $("#dvUserInfo").html(" --> Click refresh button to see your changes");
                        $("#dvRegionInfo").show();
                        $("#dvRegionInfo").html(" --> Click refresh button to see your changes");
                        $('.blink').blink();
                    }

                    if (disableMode_g == "BULK_USER") {
                        $("#dvBulkUserDisable").overlay().close();
                        fnBindUserTreeWithCheckBox("dvUserTree");
                    }
                    else if (disableMode_g == "EMPLOYEE") {
                        $("#dvDisableUser").overlay().close();
                        fnGetEmpDetails(1);
                        //var parent = $($("#hdnSelectedRow").val()).parent().parent();
                        //parent.fadeOut('slow', function () { });
                    }
                    else {
                        $("#dvDisableUser").overlay().close();
                        $("#dvUserInfo").show();
                        $("#dvUserInfo").html(" --> Click refresh button to see your changes");
                        $("#dvRegionInfo").show();
                        $("#dvRegionInfo").html(" --> Click refresh button to see your changes");
                        $('.blink').blink();
                    }
                }
                else {
                    fnMsgAlert('info', 'Information', "User status updation failed");
                    return false;
                }
                $.unblockUI();
            },
            error: function () {
                $("#dvAjaxLoad").hide();
                $.unblockUI();
            },
            complete: function () {
                $("#dvAjaxLoad").hide();
                $.unblockUI();
                //$("#dvDisableRegionUser").overlay().close();
                //$("#dvDisableUser").overlay().close();
            }
        });
    }
}

function fnCloseDisableUserPopUp() {
    if (disableMode_g == "REGION") {
        $("#dvDisableRegionUser").overlay().close();
    }
    if (disableMode_g == "BULK_USER") {
        $("#dvBulkUserDisable").overlay().close();
    }
    else {

        $("#dvDisableUser").overlay().close();

    }
    $("#dvAjaxLoad").hide();
}

//*******************************Bulk User Add entry Start ****************************//

function fnCreateTable() {
    debugger;
    var tblContent = "";
    tblContent += '<table style="width: 100%;" id="tblUser" cellspacing="0" cellpadding="0">';
    tblContent += '<thead><tr>';
    tblContent += '<th style="width: 15%;">Employee Name <span class="Mandatory">*</span></th>';
    tblContent += '<th style="width: 12%;">User Name <span class="Mandatory">*</span></th>';
    tblContent += '<th style="width: 10%;">Password <span class="Mandatory">*</span></th>';
    tblContent += '<th style="width: 12%;">Reporting Manager Name <span class="Mandatory">*</span></th>';
    tblContent += '<th style="width: 12%;">User Type Name <span class="Mandatory">*</span></th>';
    //tblContent += '<th style="width: 10%;">Division Name</th>';
    tblContent += '<th style="width: 12%;">Region Name <span class="Mandatory">*</span></th>';
    tblContent += '<th style="width: 8%;">HiDoctor Start Date</th>';
    tblContent += '<th style="width: 10%;">Expense Group</th>';
    tblContent += '<th style="width: 3%;">Delete</th></tr></thead><tbody>';
    for (var i = 1; i <= 5; i++) {
        tblContent += '<tr>';
        tblContent += '<td><div style="width:100%;"><div style="float:left;width:10%;" id="dvAddEmp_' + i + '"  class="addEmp">+</div>';
        tblContent += '<div style="float:left;width:85%;"><input type="text" id="txtEmployeeName_' + i + '" class="autoEmployee" onblur="fnValidateAutofill(this,' + "employeeJson_g" + ',\'txtEmployeeName\',\'hdnEmployeeCode\');" onkeypress="fnCreateNewRow(this);" ondblclick="fnCreateNewRow(this);"/>';
        // tblContent += 'onblur="fnValidateAutofill(this,' + "employeeJson_g" + ',\'txtEmployeeName\',\'hdnEmployeeCode\');" onkeypress="fnCreateNewRow(this);" ondblclick="fnCreateNewRow(this);"/>';      
        tblContent += '<input type="hidden" id="hdnEmployeeCode_' + i + '" /></div><div style="clear:both"></div></div></td>';
        tblContent += '<td><input type="text" id="txtUserName_' + i + '" maxlength="30" /></td>';
        tblContent += '<td><input type="password" id="txtPassWord_' + i + '"  maxlength="30"/></td>';
        tblContent += '<td><input type="text" id="txtUnderUserName_' + i + '" class="autoUnderUser" onblur="fnValidateAutofill(this,' + "userJson_g" + ',\'txtUnderUserName\',\'hdnUnderUserCode\');"/>';
        tblContent += '<input type="hidden" id="hdnUnderUserCode_' + i + '" /></td>';
        tblContent += '<td><input type="text" id="txtUserTypeName_' + i + '" class="autoUserType" onblur="fnValidateAutofill(this,' + "userTypeJson_g" + ',\'txtUserTypeName\',\'hdnUserTypeCode\');"/>';
        tblContent += '<input type="hidden" id="hdnUserTypeCode_' + i + '" /></td>';
        // tblContent += '<td><input type="text" id="txtDivisionName_' + i + '" class="autoDivision" onblur="fnValidateAutofill(this,' + "divisionJson_g" + ',\'txtDivisionName\',\'hdnDivisionCode\');" />';
        // tblContent += '<input type="hidden" id="hdnDivisionCode_' + i + '" /></td>';
        tblContent += '<td><input type="text" id="txtRegionName_' + i + '" class="autoRegion" onblur="fnValidateAutofill(this,' + "regionJson_g" + ',\'txtRegionName\',\'hdnRegionCode\');" />';
        tblContent += '<input type="hidden" id="hdnRegionCode_' + i + '" /></td>';
        tblContent += '<td><input type="text" id="txtHiDoctorStartDate_' + i + '" class="datepicker" /></td>';
        tblContent += '<td> <input type="text" id="txtExpenseGroup_' + i + '" class="autoExpenseGroup" onblur="fnValidateAutofill(this,' + "expenseJson_g" + ',\'txtExpenseGroup\',\'hdnExpenseGroup\');"  />';
        tblContent += '<input type="hidden" id="hdnExpenseGroup_' + i + '" /></td>';
        tblContent += '<td><div style="width:100%;" class="docProDelete"  id="tdDelete_' + i + '" onclick="fnDelete(this);"></div></td>';
        tblContent += '</tr>';
    }
    tblContent += ' </tbody>';
    tblContent += ' </table>';
    $("#dvUser").html(tblContent);
    rowNo = "6";
    fnGetMasterDataForUserBulkAdd();
    $(".datepicker").datepicker({ "dateFormat": "dd/mm/yy", "changeMonth": true, "changeYear": true });
    //$(".autoEmployee").focus(function () { fnShowAddEmp(this) });
    $(".addEmp").click(function () { fnOpenEmployee(this); });
    $("#txtEmployeeName_1").focus();
    $("#dvAjaxLoad").hide();
}

function fnCreateNewRow(obj) {
    debugger;
    var id = obj.id;
    var serverDate = curdate.split('.')[0] + "/" + curdate.split('.')[1] + "/" + curdate.split('.')[2];

    var currentRowNo = id.split('_')[1];
    //if ($(obj).val() != '') {
    if ($("#txtPassWord_" + currentRowNo + "").val() == '') {
        $("#txtPassWord_" + currentRowNo + "").val('hidoctor');
    }
    if ($("#txtHiDoctorStartDate_" + currentRowNo + "").val() == "") {
        $("#txtHiDoctorStartDate_" + currentRowNo + "").val(serverDate);
        // }
    }
    if (currentRowNo != parseInt(rowNo) - 1) {
        return;
    }
    var tblRowlength = $("#tblUser tr").length;
    var newRow = document.getElementById("tblUser").insertRow(parseInt(tblRowlength));
    var tdEmployeeName = newRow.insertCell(0);
    var tdUserName = newRow.insertCell(1);
    var tdPassword = newRow.insertCell(2);
    var tdUnserUser = newRow.insertCell(3);
    var tdUserType = newRow.insertCell(4);
    // var tdDivision = newRow.insertCell(5);
    var tdRegion = newRow.insertCell(6);
    var tdHioDoctorStartDate = newRow.insertCell(7);
    var tdExpenseGroup = newRow.insertCell(8);
    var tdDelete = newRow.insertCell(9);
    var empName = "";
    var tblContent = "";
    tblContent += '<div style="width:100%;"><div style="float:left;width:10%;" id="dvAddEmp_' + rowNo + '"  class="addEmp">+</div>';
    tblContent += '<div style="float:left;width:85%;"><input type="text" id="txtEmployeeName_' + rowNo + '" class="autoEmployee"';
    tblContent += 'onblur="fnValidateAutofill(this,' + "employeeJson_g" + ',\'txtEmployeeName\',\'hdnEmployeeCode\');" onkeypress="fnCreateNewRow(this);" ondblclick="fnCreateNewRow(this);"/>';
    tblContent += '<input type="hidden" id="hdnEmployeeCode_' + rowNo + '" /></div><div style="clear:both"></div></div>';
    $(tdEmployeeName).html(tblContent);
    $(tdUserName).html('<input type="text" id="txtUserName_' + rowNo + '" />');
    $(tdPassword).html('<input type="password" id="txtPassWord_' + rowNo + '" />');
    $(tdUnserUser).html('<input type="text" id="txtUnderUserName_' + rowNo + '" class="autoUnderUser" onblur="fnValidateAutofill(this,' + "userJson_g"
        + ',\'txtUnderUserName\',\'hdnUnderUserCode\');"/><input type="hidden" id="hdnUnderUserCode_' + rowNo + '" />');
    $(tdUserType).html('<input type="text" id="txtUserTypeName_' + rowNo + '" class="autoUserType" onblur="fnValidateAutofill(this,' + "userTypeJson_g"
        + ',\'txtUserTypeName\',\'hdnUserTypeCode\');"/><input type="hidden" id="hdnUserTypeCode_' + rowNo + '" />');
    //$(tdDivision).html('<input type="text" id="txtDivisionName_' + rowNo + '" class="autoDivision" onblur="fnValidateAutofill(this,' + "divisionJson_g"
    //    + ',\'txtDivisionName\',\'hdnDivisionCode\');" /><input type="hidden" id="hdnDivisionCode_' + rowNo + '" />');
    $(tdRegion).html('<input type="text" id="txtRegionName_' + rowNo + '" class="autoRegion" onblur="fnValidateAutofill(this,' + "regionJson_g"
        + ',\'txtRegionName\',\'hdnRegionCode\');" /><input type="hidden" id="hdnRegionCode_' + rowNo + '" />');
    $(tdHioDoctorStartDate).html('<input type="text" id="txtHiDoctorStartDate_' + rowNo + '" class="datepicker" />');
    $(tdExpenseGroup).html(' <input type="text" id="txtExpenseGroup_' + rowNo + '" class="autoExpenseGroup" onblur="fnValidateAutofill(this,'
        + "expenseJson_g" + ',\'txtExpenseGroup\',\'hdnExpenseGroup\');"  /><input type="hidden" id="hdnExpenseGroup_' + rowNo + '" />');
    $(tdDelete).html('<div style="width:100%;" class="docProDelete"  id="tdDelete_' + rowNo + '" onclick="fnDelete(this);"></div>');
    // autoComplete(divisionJson_g, "txtDivisionName", "hdnDivisionCode", "autoDivision");
    autoComplete(employeeJson_g, "txtEmployeeName", "hdnEmployeeCode", "autoEmployee");
    autoComplete(expenseJson_g, "txtExpenseGroup", "hdnExpensegroup", "autoExpenseGroup");
    autoComplete(userJson_g, "txtUnderUser", "hdnUnderUser", "autoUnderUser");
    autoComplete(userTypeJson_g, "txtUserType", "hdnUserType", "autoUserType");
    autoComplete(regionJson_g, "txtRegionName", "hdnRegionCode", "autoRegion");
    rowNo = parseInt(rowNo) + 1;
    $(".datepicker").datepicker({ "dateFormat": "dd/mm/yy", "changeMonth": true, "changeYear": true });
    $(".addEmp").click(function () { fnOpenEmployee(this); });
}

function fnGetMasterDataForUserBulkAdd() {
    debugger;
    $("#dvAjaxLoad").show();
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/User/GetMasterDetailsForUser',
        data: "A",
        async: false,
        success: function (jsData) {
            debugger;
            $("#dvAjaxLoad").show();
            //  var divisionJson = jsData[0].Data;
            var employeeJson = jsData[1].Data;
            var expenseJson = jsData[2].Data;
            var userJson = jsData[3].Data;
            var regionJson = jsData[4].Data;
            var userTypeJson = jsData[5].Data;
            allUserJson_g = jsData[6].Data;

            //var division = "[";
            //for (var a = 0; a < divisionJson.length; a++) {
            //    division += "{label:" + '"' + "" + divisionJson[a].Division_Name + "" + '",' + "value:" + '"' + ""
            //                    + divisionJson[a].Division_Code + "" + '"' + "}";
            //    if (a < divisionJson.length - 1) {
            //        division += ",";
            //    }
            //}
            //division += "];";
            //divisionJson_g = eval(division);
            //autoComplete(divisionJson_g, "txtDivisionName", "hdnDivisionCode", "autoDivision");

            var employee = "[";
            // employee += "{label:" + "' + Add Employee '" + ',' + "value:" + "'ADD'" + "},";
            for (var b = 0; b < employeeJson.length; b++) {
                employee += "{label:" + '"' + "" + employeeJson[b].Employee_Name + '_' + employeeJson[b].Employee_Number + "" + '",' + "value:" + '"' + ""
                                + employeeJson[b].Employee_Code + "" + '"' + "}";
                if (b < employeeJson.length - 1) {
                    employee += ",";
                }
            }
            employee += "];";
            employeeJson_g = eval(employee);
            autoComplete(employeeJson_g, "txtEmployeeName", "hdnEmployeeCode", "autoEmployee");

            var expense = "[";
            for (var c = 0; c < expenseJson.length; c++) {
                expense += "{label:" + '"' + "" + expenseJson[c].Expense_Group_Name + "" + '",' + "value:" + '"' + ""
                                + expenseJson[c].Expense_Group_Id + "" + '"' + "}";
                if (c < expenseJson.length - 1) {
                    expense += ",";
                }
            }
            expense += "];";
            expenseJson_g = eval(expense);
            autoComplete(expenseJson_g, "txtExpenseGroup", "hdnExpensegroup", "autoExpenseGroup");

            var user = "[";
            for (var d = 0; d < userJson.length; d++) {
                user += "{label:" + '"' + "" + userJson[d].User_Name + "" + '",' + "value:" + '"' + ""
                                + userJson[d].User_Code + "" + '"' + "}";
                if (d < userJson.length - 1) {
                    user += ",";
                }
            }
            user += "];";
            userJson_g = eval(user);
            autoComplete(userJson_g, "txtUnderUser", "hdnUnderUser", "autoUnderUser");

            var userType = "[";
            for (var e = 0; e < userTypeJson.length; e++) {
                userType += "{label:" + '"' + "" + userTypeJson[e].User_Type_Name + "" + '",' + "value:" + '"' + ""
                                + userTypeJson[e].User_Type_Code + "" + '"' + "}";
                if (e < userTypeJson.length - 1) {
                    userType += ",";
                }
            }
            userType += "];";
            userTypeJson_g = eval(userType);
            autoComplete(userTypeJson_g, "txtUserType", "hdnUserType", "autoUserType");

            var region = "[";
            for (var e = 0; e < regionJson.length; e++) {
                region += "{label:" + '"' + "" + regionJson[e].Region_Name + "" + '",' + "value:" + '"' + ""
                                + regionJson[e].Region_Code + "" + '"' + "}";
                if (e < regionJson.length - 1) {
                    region += ",";
                }
            }
            region += "];";
            regionJson_g = eval(region);
            autoComplete(regionJson_g, "txtRegionName", "hdnRegionCode", "autoRegion");
            // $("#dvAjaxLoad").hide();
            // $.unblockUI();
        },
        error: function () {
            $("#dvAjaxLoad").hide();
            $.unblockUI();
        },
        complete: function () {
            $("#dvAjaxLoad").hide();
            $.unblockUI();
        }
    });
}

function fnDelete(obj) {
    var deleteRowNo = obj.id.split('_')[1];
    if (rowNo == parseInt(deleteRowNo) + 1) {
        fnMsgAlert('info', 'Info', 'Sorry! you can not delete the last row');
        return;
    }
    if (confirm("Are you sure you want to delete this row?")) {
        var parent = $(obj).parent().parent();
        parent.fadeOut('slow', function () { });
    }
}
function fnOpenEmployee(obj) {
    var id = obj.id;
    var rowId = id.split('_')[1];
    $("#hdnCurrentEmpName").val(id);
    ////  if ($("#hdnEmployeeCode_" + rowId).val() == "ADD") {
    //var id = obj.id;
    //var serverDate = curdate.split('.')[0] + "/" + curdate.split('.')[1] + "/" + curdate.split('.')[2];
    //if ($(obj).val() != '') {
    //    if ($("#txtPassWord_" + rowId + "").val() == '') {
    //        $("#txtPassWord_" + rowId + "").val('hidoctor');
    //    }
    //    if ($("#txtHiDoctorStartDate_" + rowId + "").val() == "") {
    //        $("#txtHiDoctorStartDate_" + rowId + "").val(serverDate);
    //    }
    //}
    fnCreateNewRow(obj);
    $("#dvEmp").overlay().load();

    //  }
}

function fnBulkUserSubmitValidate() {
    debugger;
    fnUserExpenseGroup(); // Newly added for Expense Group Mandatory
    var flag = true;
    var tblLength = $("#tblUser tr").length;
    var empArray = new Array();
    var userArray = new Array();
    for (var i = 1; i < parseInt(rowNo) ; i++) {
        var empName = "", empCode = "", userName = "", password = "", underUserName = "", underUserCode = "",
            //divisionName = "",
            //divisionCode = "",
            regionName = "", regionCode = "", hidoctorStartDate = "", expenseGroupName = "",
            expenseGroupCode = "", userTypeName = "", userTypeCode = "";
        empName = $("#txtEmployeeName_" + i).val();
        empCode = $("#hdnEmployeeCode_" + i).val();
        userName = $.trim($("#txtUserName_" + i).val());
        password = $("#txtPassWord_" + i).val();
        underUserName = $("#txtUnderUserName_" + i).val();
        underUserCode = $("#hdnUnderUserCode_" + i).val();
        // divisionName = $("#txtDivisionName_" + i).val();
        // divisionCode = $("#hdnDivisionCode_" + i).val();
        regionName = $("#txtRegionName_" + i).val();
        regionCode = $("#hdnRegionCode_" + i).val();
        hidoctorStartDate = $("#txtHiDoctorStartDate_" + i).val();
        expenseGroupName = $("#txtExpenseGroup_" + i).val();
        expenseGroupCode = $("#hdnExpenseGroup_" + i).val();
        userTypeName = $("#txtUserTypeName_" + i).val();
        userTypeCode = $("#hdnUserTypeCode_" + i).val();
        if (empName != '') {
            if ($("#txtEmployeeName_" + i + "").is(":visible")) {
                /****************** Employee Check *********************/
                if (empCode == "ADD") {
                    $("#txtEmployeeName_" + i).attr('title', 'Please select employee Name');
                    $("#txtEmployeeName_" + i).addClass("errorIndicator");
                    flag = false;
                }
                if (empCode == "") {
                    $("#txtEmployeeName_" + i).attr('title', 'Please select employee Name');
                    $("#txtEmployeeName_" + i).addClass("errorIndicator");
                    flag = false;
                }
                if (empName != '') {
                    if (empCode != '') {
                        if ($.inArray(empCode, empArray) == -1) {
                            empArray.push(empCode);
                        }
                        else {
                            $("#txtEmployeeName_" + i).addClass("errorIndicator");
                            $("#txtEmployeeName_" + i).attr('title', 'Employee name repeated');
                            flag = false;
                        }
                    }
                }
                /************************** User Name check ******************************/
                if (userName == "") {
                    $("#txtUserName_" + i).addClass("errorIndicator");
                    $("#txtUserName_" + i).attr('title', 'Please enter user name');
                    flag = false;
                }
                else {
                    var disUserName = jsonPath(allUserJson_g, "$.[?(@.User_Name=='" + userName.toUpperCase() + "')]");
                    if (disUserName != false & disUserName != undefined) {
                        $("#txtUserName_" + i).addClass("errorIndicator");
                        $("#txtUserName_" + i).attr('title', userName.toUpperCase() + ' already existing in the system');
                        flag = false;
                    }
                    else {
                        if ($.inArray(userName.toUpperCase(), userArray) == -1) {
                            userArray.push(userName.toUpperCase());
                        }
                        else {
                            $("#txtUserName_" + i).addClass("errorIndicator");
                            $("#txtUserName_" + i).attr('title', 'you have entered this User Name multiple times');
                            flag = false;
                        }
                    }
                }
                var result = regExforAlphaNumericUserName(userName);
                if (!result) {
                    $("#txtUserName_" + i).addClass("errorIndicator");
                    $("#txtUserName_" + i).attr('title', 'Space between the User Name is not Allowed.');
                    flag = false;
                }
                /**************************** Password ********************/
                if (password == '') {
                    $("#txtPassWord_" + i).addClass("errorIndicator");
                    $("#txtPassWord_" + i).attr('title', 'Please enter user password');
                    flag = false;
                }

                var words = ["#", "$", "%", "^", "&", "(", ")", "{", "+", "=", "[", "}", "]", "?", ">", "<", ",", ".", ";", ":", "/", "|"];
                var passwords = new Array();
                passwords = password;
                for (var c = 0; c <= passwords.length; c++) {
                    var a = words.indexOf(passwords[c]);
                    if (a >= 0) {
                        $("#txtPassWord_" + i).addClass("errorIndicator");
                        $("#txtPassWord_" + i).attr('title', 'Special characters like * _ - ! @ are only allowed');
                        //fnMsgAlert('info', 'Change Password', "Special character are not allowed in password.");
                        flag = false;
                    }
                }

                if (passwords.length >= 31) {
                    $("#txtPassWord_" + i).addClass("errorIndicator");
                    $("#txtPassWord_" + i).attr('title', 'Please enter minimum 30 character in password.');
                    flag = false;
                }

                if (passwords.length < 5) {
                    $("#txtPassWord_" + i).addClass("errorIndicator");
                    $("#txtPassWord_" + i).attr('title', 'Please enter minimum 6 character in password.');
                    flag = false;
                }
                /************************ Under User Name ***********************/
                if (underUserName == '') {
                    $("#txtUnderUserName_" + i).addClass("errorIndicator");
                    $("#txtUnderUserName_" + i).attr('title', 'Please select reporting manager Name');
                    flag = false;
                }
                else {
                    if (underUserCode == '') {
                        //$("#txtUnderUserName_" + i).addClass("errorIndicator");
                        //$("#txtUnderUserName_" + i).attr('title', 'Please select valid reporting manager Name');
                        //flag = false;
                        if ($.inArray(underUserName, userArray) == -1) {
                            $("#txtUnderUserName_" + i).addClass("errorIndicator");
                            $("#txtUnderUserName_" + i).attr('title', 'Please enter valid reporting manager Name');
                            flag = false;
                        }
                    }
                }
                var result = regExforAlphaNumeric(underUserName);
                if (!result) {
                    $("#txtUnderUserName_" + i).addClass("errorIndicator");
                    $("#txtUnderUserName_" + i).attr('title', 'Please remove the special characters');
                    flag = false;
                }

                /****************** User Type Name *******************/
                if (userTypeName == '') {
                    $("#txtUserTypeName_" + i).addClass("errorIndicator");
                    $("#txtUserTypeName_" + i).attr('title', 'Please select user type name');
                    flag = false;
                }
                else {
                    if (userTypeCode == '') {
                        $("#txtUserTypeName_" + i).addClass("errorIndicator");
                        $("#txtUserTypeName_" + i).attr('title', 'Please select valid user type name');
                        flag = false;
                    }
                }
                // ------------------------------------------
                debugger;
                var man = false;
                for (var k = 0; k < g_Ex_Mandatory.length; k++) {
                    debugger;
                    if (g_Ex_Mandatory[k].user_type_code == userTypeCode)
                        if (g_Ex_Mandatory[k].PRIVILEGE_VALUE_NAME == "YES") {
                            man = true;
                        }

                }


                /*********************** Division ********************/
                //if (divisionName != '') {
                //    if (divisionCode == '') {
                //        $("#txtDivisionName_" + i).addClass("errorIndicator");
                //        $("#txtDivisionName_" + i).attr('title', 'Please select valid division name');
                //        flag = false;
                //    }
                //}
                /********************* Region Name ***********************/
                if (regionName == '') {
                    $("#txtRegionName_" + i).addClass("errorIndicator");
                    $("#txtRegionName_" + i).attr('title', 'Please select region name');
                    flag = false;
                }
                else {
                    if (regionCode == '') {
                        $("#txtRegionName_" + i).addClass("errorIndicator");
                        $("#txtRegionName_" + i).attr('title', 'Please select valid region name');
                        flag = false;
                    }
                }
                if (passwords.length <= 5) {
                    $("#txtPassWord_" + i).addClass("errorIndicator");
                    $("#txtPassWord_" + i).attr('title', 'Please enter minimum 6 character in password.');
                    flag = false;
                }
                /******************** HiDoctor Start Date ***************************/
                if (hidoctorStartDate == '') {
                    $("#txtHiDoctorStartDate_" + i).addClass("errorIndicator");
                    $("#txtHiDoctorStartDate_" + i).attr('title', 'Please enter hidoctor start date');
                    flag = false;
                }
                /************************Expense Group ***********************/
                if (expenseGroupName != '') {
                    debugger;
                    if (expenseGroupCode == '') {
                        $("#txtExpenseGroup_" + i).addClass("errorIndicator");
                        $("#txtExpenseGroup_" + i).attr('title', 'Please select valid expense group');
                        flag = false;
                    }
                }
                // *************************Expense Group Mapping Mandatory Function**********************//
                if (man)
                    if (expenseGroupName == '' || expenseGroupCode == '') {
                        $("#txtExpenseGroup_" + i).addClass("errorIndicator");
                        $("#txtExpenseGroup_" + i).attr('title', 'Expense group mapping is mandatory for this selected user type(s)/designation(s)');
                        flag = false;
                    }
                if (man == false) {
                    $("#txtExpenseGroup_" + i).removeAttr('title', 'Expense group mapping is mandatory for this selected user type(s)/designation(s)');
                    $("#txtExpenseGroup_" + i).removeClass('errorIndicator tip');

                }
            }
        }
    }
    return flag;
}
var g_Ex_Mandatory;
function fnUserExpenseGroup() {
    debugger;
    var UserExpenseGroup = true;
    var User_Type_Code = "";
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/User/GetExpenseGroupMand',
        data: 'User_Type_Code=' + User_Type_Code,
        async: false,
        success: function (result) {
            debugger;
            g_Ex_Mandatory = eval('(' + result + ')');
            g_Ex_Mandatory = g_Ex_Mandatory.Rows;
        }
    });
    return UserExpenseGroup;
}

function fnBulkUserSubmit() {
    debugger;
    $("#dvAjaxLoad").show();
    var result = fnBulkUserSubmitValidate();
    var tblContent = "";
    if (result) {
        $("#dvAjaxLoad").hide();
        $.blockUI();
        var tblLength = $("#tblUser tr").length;
        for (var i = 1; i <= tblLength; i++) {
            var empName = "", empCode = "", userName = "", password = "", underUserName = "", underUserCode = "",
                          divisionName = "", divisionCode = "", regionName = "", regionCode = "", hidoctorStartDate = "", expenseGroupName = "",
                          expenseGroupCode = "", userTypeName = "", userTypeCode = "";
            empName = $("#txtEmployeeName_" + i).val();
            empCode = $("#hdnEmployeeCode_" + i).val();
            userName = $.trim($("#txtUserName_" + i).val());
            password = $("#txtPassWord_" + i).val();
            underUserName = $("#txtUnderUserName_" + i).val();
            underUserCode = $("#hdnUnderUserCode_" + i).val();
            // divisionCode = $("#hdnDivisionCode_" + i).val();
            regionCode = $("#hdnRegionCode_" + i).val();
            hidoctorStartDate = $("#txtHiDoctorStartDate_" + i).val();
            expenseGroupCode = $("#hdnExpenseGroup_" + i).val();
            userTypeCode = $("#hdnUserTypeCode_" + i).val();
            if (empName != '') {
                if ($("#txtEmployeeName_" + i + "").is(":visible")) {
                    tblContent += empCode + "^";
                    tblContent += userName + "^";
                    tblContent += password + "^";
                    tblContent += underUserName + "^";
                    tblContent += underUserCode + "^";
                    // tblContent += divisionCode + "^";
                    tblContent += regionCode + "^";
                    tblContent += hidoctorStartDate.split('/')[2] + "-" + hidoctorStartDate.split('/')[1] + "-" + hidoctorStartDate.split('/')[0] + "^";
                    tblContent += expenseGroupCode + "^";
                    tblContent += userTypeCode + "^";
                    tblContent += "~";
                }
            }
        }
        //UserBulkInsert
        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Master/User/UserBulkInsert',
            data: "tblContent=" + tblContent + "",
            success: function (result) {
                $("#dvAjaxLoad").hide();
                if (result.split(':')[0] == "SUCCESS") {
                    fnMsgAlert('success', 'Success', 'User id created successfully');
                    fnCreateTable();
                    $("#dvAjaxLoad").hide();
                }
                $.unblockUI();
            },
            error: function () {
                $("#dvAjaxLoad").hide();
                $.unblockUI();
            },
            complete: function () {
                $("#dvAjaxLoad").hide();
                $.unblockUI();
            }
        });
    }
    else {
        $("#dvAjaxLoad").hide();
        if ($("#dvUser .errorIndicator").length > 0) {
            fnMsgAlert('info', 'Info', 'Please correct the errors then try to submit');
            // $("#dvMainEmployee .errorIndicator")[0].focus();
            return;
        }
    }
}

//*******************************Bulk User Add entry end ****************************//

//*******************************USER HIERARCHY CHANGE START ****************************//

function fnGetAllUsers() {
    $("#dvAjaxLoad").show();
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/User/GetAllUsers',
        data: "A",
        success: function (jsData) {
            if (jsData != '') {
                $("#cboOriginalUser").append("<option value=0>-Original User Position-</option>");
                $("#cboProposedUser").append("<option value=0>-Proposed User Position-</option>");
                for (var i = 0; i < jsData.length; i++) {
                    $("#cboOriginalUser").append("<option value=" + jsData[i].User_Code + ">" + jsData[i].User_Name + "</option>");
                    $("#cboProposedUser").append("<option value=" + jsData[i].User_Code + ">" + jsData[i].User_Name + "</option>");
                }
                if (OriginalUser_g != '' && OriginalUser_g != null) {
                    $("#cboOriginalUser").val(OriginalUser_g);
                    fnGetOriginalChildUsers();

                }
            }
            $.unblockUI();
        },
        error: function () {
            $.unblockUI();
        },
        complete: function () {
            $("#dvAjaxLoad").hide();
            $.unblockUI();
        }
    });
}


function fnGetOriginalChildUsers() {
    $("#cboOriginalChildUsers option").remove();
    $("#dvAjaxLoad").show();
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/User/GetImmediateChildUsers',
        data: "userCode=" + $("#cboOriginalUser").val() + "",
        success: function (jsData) {
            if (jsData != '') {
                originalChildUsersJson_g = jsData;
                for (var i = 0; i < jsData.length; i++) {
                    if ($("#cboOriginalUser").val().toUpperCase() != jsData[i].User_Code.toUpperCase()) {
                        $("#cboOriginalChildUsers").append("<option value=" + jsData[i].User_Code + "_" + jsData[i].User_Id + ">" + jsData[i].User_Name + "(" + jsData[i].User_Type_Name + ")(" + jsData[i].Region_Name + ")" + "</option>");
                    }
                    //$("#cboProposedUsers").append("<option value=" + jsData[i].User_Code + ">" + jsData[i].User_Name + "</option>");
                }
                originalChildUsers = $("#cboOriginalChildUsers option");
            }
            $.unblockUI();
        },
        error: function () {
            $.unblockUI();
        },
        complete: function () {
            $("#dvAjaxLoad").hide();
            $.unblockUI();
        }
    });
}
function fnGetProposedChildUsers() {
    $("#dvAjaxLoad").show();
    $("#cboProposedChildUsers option").remove();
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/User/GetImmediateChildUsers',
        data: "userCode=" + $("#cboProposedUser").val() + "",
        success: function (jsData) {
            if (jsData != '') {
                proposedChildUsersJson_g = jsData;
                for (var i = 0; i < jsData.length; i++) {
                    if ($("#cboProposedUser").val().toUpperCase() != jsData[i].User_Code.toUpperCase()) {
                        $("#cboProposedChildUsers").append("<option value=" + jsData[i].User_Code + "_" + jsData[i].User_Id + ">" + jsData[i].User_Name + "(" + jsData[i].User_Type_Name + ")(" + jsData[i].Region_Name + ")" + "</option>");
                    }
                }
                proposedChildUsers = $("#cboProposedChildUsers option");
            }
            $.unblockUI();
        },
        error: function () {
            $.unblockUI();
        },
        complete: function () {
            $("#dvAjaxLoad").hide();
            $.unblockUI();
        }
    });
}
function fnOriginalMoveUp() {
    userChanged_g = "Y";
    $("#cboOriginalChildUsers option:selected").each(function () {
        var listItem = $(this);
        var listItemPosition = $("#cboOriginalChildUsers option").index(listItem) + 1;
        if (listItemPosition == 1) return false;
        listItem.insertBefore(listItem.prev());
    });
}

function fnOriginalMoveDown() {
    userChanged_g = "Y";
    var itemsCount = $("#cboOriginalChildUsers option").length;
    $($("#cboOriginalChildUsers option:selected").get().reverse()).each(function () {
        var listItem = $(this);
        var listItemPosition = $("#cboOriginalChildUsers option").index(listItem) + 1;
        if (listItemPosition == itemsCount) return false;
        listItem.insertAfter(listItem.next());
    });
}

function fnProposedMoveUp() {
    userChanged_g = "Y";
    // get all selected items and loop through each
    $("#cboProposedChildUsers option:selected").each(function () {
        var listItem = $(this);
        var listItemPosition = $("#cboProposedChildUsers option").index(listItem) + 1;

        // when the item is already at the topmost,
        // we do not need to move it up anymore
        if (listItemPosition == 1) return false;

        // the following will move the item up
        // this inserts the listItem over the element before it
        listItem.insertBefore(listItem.prev());
    });
}

function fnProposedMoveDown() {
    userChanged_g = "Y";
    // get the number of items
    // we will need this later to determine
    // if the item is at the bottommost already
    var itemsCount = $("#cboProposedChildUsers option").length;

    // for move down, we will need to start moving down items
    //   from the bottom
    // we get the selected items, reverse it then then loop each item
    $($("#cboProposedChildUsers option:selected").get().reverse()).each(function () {
        var listItem = $(this);
        var listItemPosition = $("#cboProposedChildUsers option").index(listItem) + 1;

        // when the item is already at the bottommost,
        //we do not need to move it down anymore
        if (listItemPosition == itemsCount) return false;

        // the following will move down the item
        // this inserts the listItem below the element after it
        listItem.insertAfter(listItem.next());
    });
}

function fnOriginalReset() {
    userChanged_g = "Y";
    $("#cboOriginalChildUsers").html(originalChildUsers);
}
function fnProposedReset() {
    userChanged_g = "Y";
    $("#cboProposedChildUsers").html(proposedChildUsers);
}

function fnMoveLefttoRight() {
    userChanged_g = "Y";
    $("#cboOriginalChildUsers  option:selected").appendTo("#cboProposedChildUsers");
}
function fnMoveRighttoLeft() {
    userChanged_g = "Y";
    $("#cboProposedChildUsers  option:selected").appendTo("#cboOriginalChildUsers");
}
function fnMoveAllLefttoRight() {
    userChanged_g = "Y";
    $("#cboOriginalChildUsers  option").appendTo("#cboProposedChildUsers");
}
function fnMoveAllRighttoLeft() {
    userChanged_g = "Y";
    $("#cboProposedChildUsers  option").appendTo("#cboOriginalChildUsers");
}

function fnChangeUserHierarchy(action, node) {
    $("#main").load('HiDoctor_Master/User/UserHierarchyChange/' + node.data.key);
}

function fnChangeUserHierarchySubmit() {
    $("#dvAjaxLoad").show();
    var originalUsers = "";
    var proposedUsers = "";
    var originalUserslength = $("#cboOriginalChildUsers option").length;
    var originalParentUserCode = $("#cboOriginalUser").val();
    var proposedUserslength = $("#cboProposedChildUsers option").length;
    var proposedParentUserCode = $("#cboProposedUser").val();
    var originalParentFullIndex = ""
    var proposedParentFullIndex = "";
    var originalParentId = "";
    var proposedParentId = "";
    if (originalParentUserCode == "0" && proposedParentUserCode == "0") {
        $("#dvAjaxLoad").hide();
        fnMsgAlert('info', 'Info', 'Please select original or proposed user position');
        return;
    }
    //if (proposedParentUserCode == "0") {
    //    $("#dvAjaxLoad").hide();
    //    fnMsgAlert('info', 'Info', 'Please select proposed user position');
    //    return;
    //}
    if ($("#cboOriginalChildUsers option").length == 0 && $("#cboProposedChildUsers option").length == 0) {
        $("#dvAjaxLoad").hide();
        fnMsgAlert('info', 'Info', 'No original child users and proposed child users position found. So you can not proceed.');
        return;
    }
    if (originalParentUserCode == proposedParentUserCode) {
        $("#dvAjaxLoad").hide();
        fnMsgAlert('info', 'Info', 'You should not select the same original and proposed user');
        return;
    }
    if (originalChildUsersJson_g != '' && originalChildUsersJson_g != null) {
        var disOriginal = jsonPath(originalChildUsersJson_g, "$.[?(@.User_Code=='" + originalParentUserCode + "')]");
        if (disOriginal != false) {
            originalParentFullIndex = disOriginal[0].Full_Index;
            originalParentId = disOriginal[0].User_Id;
        }
    }
    if (proposedChildUsersJson_g != '' && proposedChildUsersJson_g != null) {
        var disPro = jsonPath(proposedChildUsersJson_g, "$.[?(@.User_Code=='" + proposedParentUserCode + "')]");
        if (disPro != false) {
            proposedParentFullIndex = disPro[0].Full_Index;
            proposedParentId = disPro[0].User_Id;
        }
    }

    for (var i = 0; i < originalUserslength; i++) {
        originalUsers += $("#cboOriginalChildUsers option")[i].value + "|" + parseInt(i + 1) + "^";
    }
    for (var i = 0; i < proposedUserslength; i++) {
        proposedUsers += $("#cboProposedChildUsers option")[i].value + "|" + parseInt(i + 1) + "^";
    }
    try {
        if (userChanged_g == "Y") {
            $.ajax({
                type: 'POST',
                url: '../HiDoctor_Master/User/ChangeUserHierarchy',
                data: "originalChildUsers=" + originalUsers + "&proposedChildUsers=" + proposedUsers + "&originalParentIndex=" + originalParentFullIndex + "&proposedParentIndex=" +
                    proposedParentFullIndex + "&originalParentId=" + originalParentId + "&proposedParentId=" + proposedParentId + "&originalParentUserCode=" +
                    originalParentUserCode + "&proposedParentUserCode=" + proposedParentUserCode + "",
                success: function (result) {
                    if (result.split(':')[0] == "SUCCESS") {
                        fnMsgAlert('success', 'Success', 'User hierarchy changed successfully');
                        $("#cboOriginalChildUsers option").remove();
                        $("#cboProposedChildUsers option").remove();
                        if (OriginalUser_g != null && OriginalUser_g != '') {
                            $("#dvUserHierarchy").overlay().close();
                        }
                    }
                    else {
                        fnMsgAlert('error', 'Error', 'User hierarchy change failed because of ' + result.split(':')[1]);
                    }
                    $("#dvAjaxLoad").hide();
                    $.unblockUI();
                },
                error: function () {
                    $("#dvAjaxLoad").hide();
                    $.unblockUI();
                },
                complete: function () {
                    $("#dvAjaxLoad").hide();
                    $.unblockUI();
                }
            });
        }
        else {
            fnMsgAlert('info', 'Info', 'No changes has been done');
            $("#dvAjaxLoad").hide();
            return;
        }
    }
    catch (exception) {
        $("#dvAjaxLoad").hide();
    }
}

function fnBindSelectedUserDetails(jsData) {

    if (jsData.length > 0) {
        $("#txtUserName").val(jsData[0].User_Name);
        $("#hdnUserCode").val(jsData[0].User_Code);
        $("#txtUserPassWord").val(jsData[0].User_Pass);
        $("#hdnEmployeeCode").val(jsData[0].Employee_Code);
        $("#txtEmployee").val(jsData[0].Employee_Name);

        if (jsData[0].User_Type_Code == null || jsData[0].User_Type_Code == '') {
            $("#cboUserType").val('0');
        }
        else {
            $("#cboUserType").val(jsData[0].User_Type_Code);
        }
        if (jsData[0].Reporting_Manager_Code == null || jsData[0].Reporting_Manager_Code == '') {
            $("#cboUnderUser").val('0');
        }
        else {
            $("#cboUnderUser").val(jsData[0].Reporting_Manager_Code);
        }
        if (jsData[0].Region_Code == null || jsData[0].Region_Code == '') {
            $("#cboRegion").val('0');
        }
        else {
            $("#cboRegion").val(jsData[0].Region_Code);
        }
        //if (jsData[0].User_Division_Code == null || jsData[0].User_Division_Code == '') {
        //    $("#cboDivision").val('0');
        //}
        //else {
        //    $("#cboDivision").val(jsData[0].User_Division_Code);
        //}
        if (jsData[0].Expense_Group_Id == null || jsData[0].Expense_Group_Id == '') {
            $("#cboExpenseGroupCode").val('0');
        }
        else {
            $("#cboExpenseGroupCode").val(jsData[0].Expense_Group_Id);
        }
        if (jsData[0].HiDOCTOR_Start_Date == null || jsData[0].HiDOCTOR_Start_Date == '') {
            // $("#HiDOCTOR_Start_Date").val();
        }
        else {
            $("#txtHiDoctorStartDate").val(jsData[0].HiDOCTOR_Start_Date);
        }
        $("#txtUserName").attr("disabled", "disabled");
        $("#txtEmployee").attr("disabled", "disabled");
        $("#dvAjaxLoad").hide();
    }
}


function fnBulkUserDisable() {
    if (selKeys.length > 0) {
        //bootbox.confirm({
        //    //css:"background: none;box-shadow: none;",
        //    message: "<h3>Are you sure want to disable the selected users?</h3>",
        //    buttons: {
        //        confirm: {
        //            label: 'Yes',
        //            className: 'btn-success'
        //        },
        //        cancel: {
        //            label: 'No',
        //            className: 'btn-danger'
        //        }
        //    },
        //    callback: function (result) {
        //        if (result == true) {
        //            debugger;
        //            $("#dvBulkUserDisable").overlay().load();
        //        }
        //    }
        //});
        $.msgAlert({
            type: 'warning'
          , title: 'Delete'
          , text: 'Do you want to disable these users'
          , callback: function () {
              //$("#dvAjaxLoad").show();
              //$.ajax({
              //    type: 'POST',
              //    url: '../HiDoctor_Master/User/BulkUserDisable',
              //    async: false,
              //    data: "userCodes=" + selKeys + "",
              //    success: function (result) {
              //        if (result.split(':')[0] == "SUCCESS") {
              //            fnMsgAlert('success', 'Success', 'User status changed successfully');
              //            fnBindUserTreeWithCheckBox("dvUserTree");
              //        }
              //        else {
              //            fnMsgAlert('error', 'Error', 'User status change failed because of ' + result.split(':')[1]);
              //        }
              //        $("#dvAjaxLoad").hide();
              //    },
              //    error: function () {
              //        $("#dvAjaxLoad").hide();
              //    },
              //    complete: function () {
              //        $("#dvAjaxLoad").hide();
              //    }
              //});
              $("#dvBulkUserDisable").overlay().load();
          }
        });
    }
    else {
        fnMsgAlert('info', 'info', 'Please select atleast any one user');
    }
}

function fnRedirectToChangeHierarchy() {
    if (selKeys.length == 1) {
        var userCode = selKeys[0];
        $("#main").load('../HiDoctor_Master/User/UserHierarchyChange/' + userCode);
    }
    else {
        $("#main").load('../HiDoctor_Master/User/UserHierarchyChange');
    }
}

function fnCloseUserPopUp() {
    $("#dvAddUser").overlay().close();
    $("#dvEditUser").overlay().close();
}


function fnRedirectToBP(page) {
    $('#main').load('../BatchProcessing/Index?bpType=' + page);
}

function fnCloseUserHierarchyPopUp() {
    $("#cboOriginalChildUsers option").remove();
    $("#cboProposedChildUsers option").remove();
    if (OriginalUser_g != null && OriginalUser_g != '') {
        $("#dvUserHierarchy").overlay().close();
    }
}

var r = "";

function fnBindBulkDisableUserDetails() {
    debugger;
    $("#dvAjaxLoad").show();
    var content = "";
    content += "<table style=width:90%'><thead style='height:25px;'><tr><td style='width:5%;text-align:left;'>Select</td><td style='width:30%;text-align:left;'>Users</td>";
    content += "<td style='width:20%;text-align:left;'>Resignation Date</td></tr></thead><tbody style='text-align:left'>";
    for (r = 0; r < selKeys.length; r++) {
        content += "<tr>";
        content += "<td><input type='checkbox' id='chkUser_" + r + "' name='chkUserSelect' value='" + selKeys[r] + "' onclick ='fnClearInputDisable(" + r + ")' /></td>";
        content += "<td id='tdUserName_" + r + "' style='text-align:left !important;'>" + selUsers[r] + "</td>";
        content += "<td><input type='text' disabled readonly id='txtResignationDate_" + r + "'  class='datepicker' style='width:85% !important'/><span class='Mandatory'>*</span></td>";
        content += "</tr>";
    }
    content += "</tbody></table>";
    $("#dvUsers").html(content);
    $(".datepicker").datepicker({ "changeMonth": true, "changeYear": true, "dateFormat": "dd/mm/yy" });
    $("#dvUserCountInfo").html("Please select the user(s) and enter the resignation date then click Disable User button to disable the users");
    $("#dvReporingInfo").hide();
    $("#dvAjaxLoad").hide();
}

function fnClearInputDisable(r) {
    debugger;
    //var rowId = $(this)[0].id;
    var check = $('#chkUser_' + r).is(":checked");
    if (check) {
        $('#txtResignationDate_' + r).prop('disabled', false);
        userC = selKeys[r];
        debugger;
        fnGetDCRdate();
        debugger;
        //dcrdate + 1
        //var myDate = new Date(dcrdate);
        //myDate.setDate(myDate.getDate() + 1);
        //var y = myDate.getFullYear(),m = myDate.getMonth() + 1,d = myDate.getDate();
        //var pad = function (val) { var str = val.toString(); return (str.length < 2) ? "0" + str : str };
        //dcrdate = [y, pad(m), pad(d)].join("/");

        $('#txtResignationDate_' + r).datepicker('option', { minDate: new Date(dcrdate), "changeMonth": true, "changeYear": true, "dateFormat": "dd/mm/yy" });
    }
    else {
        $('#txtResignationDate_' + r).val('');
        $('#txtResignationDate_' + r).prop('disabled', true);
    }
}


