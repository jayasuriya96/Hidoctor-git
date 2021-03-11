//Created By :Suamthi
//Modified By :T Vignesh
//Date : 12/12/2013
//Modified Date: 13/03/2019

var objPasswordValidation = "";
var mailValue = "";
var historyCount = "";
var str = "";

function fncheckPassword() {
    debugger;
    var rValue = true;
    var password = $("#txtpwd").val();
    var usercode = selecteduserCode;
    var str = "";
    var count = 0;

    if (password.length > 30) {
        fnMsgAlert('info', 'Info', 'password length cannot exceed 30 characters');
        rValue = false;
    }

    $.ajax({
        url: '../HiDoctor_Master/PasswordReset/checkCurrentPassword',
        type: 'GET',
        data: "usercode=" + usercode,
        async: false,
        success: function (result) {
            //debugger;
            str = result;
            for (var i = 0; i < str.length; i++) {
                if (str[i].User_Pass == password) {
                    count++;
                }
            }
            if (count > 0) {
                fnMsgAlert('info', 'Change Password', 'The new password should be different from the current password');
                rValue = false;
            }
            else {
                rValue = fnpassPolicy(objPasswordValidation);
            }
        }
    })
    return rValue;
    rValue = fnpassPolicy(objPasswordValidation);
}

function fncheckpassPrivlige(usertype) {
    //debugger;
    $.ajax({
        url: '../HiDoctor_Master/PasswordReset/checkPasswordPrivilge',
        type: "GET",
        data: "usertypename=" + usertype,
        async: false,
        success: function (result) {
            debugger;
            objPasswordValidation = result;
        },
        error: function (result) {
            debugger;
        }
    });
}

var lstflag = true;

function fnpassPolicy(objPasswordValidation) {
    //debugger;
    var PASSWORD_POLICY = 'NO';
    var PASSWORD_STRENGTH = 'NO';
    var PASSWORD_HISTORY_COUNT = 'NO';
    if (objPasswordValidation.length > 0) {
        for (var i = 0 ; i < objPasswordValidation.length ; i++) {
            if (objPasswordValidation[i].Privilege_Name.toUpperCase() == 'PASSWORD_POLICY') {
                PASSWORD_POLICY = objPasswordValidation[i].Privilege_Value_Name;
            }
            else if (objPasswordValidation[i].Privilege_Name.toUpperCase() == 'PASSWORD_STRENGTH') {
                PASSWORD_STRENGTH = objPasswordValidation[i].Privilege_Value_Name;
            }
            else if (objPasswordValidation[i].Privilege_Name.toUpperCase() == 'PASSWORD_HISTORY_COUNT') {
                PASSWORD_HISTORY_COUNT = objPasswordValidation[i].Privilege_Value_Name;
            }
        }
    }
    else {
        fnSendPassword();
        lstflag = false;
    }

    //debugger;
    if (PASSWORD_POLICY == 'YES') {
        var passStrengt = true;
        var passHistoryCount = true;
        var validation = true;
        if (PASSWORD_STRENGTH != 'NO') {
            validation = fnpassStrength(PASSWORD_STRENGTH);
        }
        if (PASSWORD_HISTORY_COUNT != 'NO' && validation) {
            validation = fnpassHistoryCount(PASSWORD_HISTORY_COUNT);
        }
        if (validation) {
            fnSendPassword();
        }
    }
    else if (lstflag == true) {
        fnSendPassword();
    }
}

function fnpassStrength(PASSWORD_STRENGTH) {
    //debugger;
    var returValue = true;
    var val = "";
    var objPasswordValidation = PASSWORD_STRENGTH.split(',');
    var words = ["#", "$", "%", "^", "&", "(", ")", "{", "+", "=", "[", "}", "]", "?", ">", "<", ",", ".", ";", ":", "/", "|"];
    var password = new Array();
    password = $('#txtpwd').val();
    for (var i = 0; i <= password.length; i++) {
        var a = words.indexOf(password[i]);
        if (a >= 0) {
            fnMsgAlert('info', 'Change Password', "Special characters like * _ - @ ! are only allowed.");
            returValue = false;
            // return;
        }
    }
    for (var i = 0; i < objPasswordValidation.length ; i++) {
        if (objPasswordValidation[i] == 'VERY STRONG' && returValue) {
            val = $("#txtpwd").val();
            if (val.length > 9) {
                var regexLetter = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@*$!_-]).{10,30}/;
                if (!(regexLetter.test(val))) {
                    fnMsgAlert('info', 'Change Password', 'Password Should Contain atleast One Uppercase,One Lowercase,One Numeric,One Special Character');
                    returValue = false;
                    return;
                }
            }
            else {
                fnMsgAlert('info', 'Password Length', 'Passwaord should have atleast 10 characters');
                returValue = false;
                return;
            }
        }
        else if (objPasswordValidation[i] == 'STRONG' && returValue) {
            val = $("#txtpwd").val();
            if (val.length > 7) {
                var regexLetter = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@*$!_-])[A-Za-z\d@*$!_-]{8,30}$/;
                if (!(regexLetter.test(val))) {
                    fnMsgAlert('info', 'Change Password', 'Password Should Contain Atleast One Alphabet,One Numeric,One Special Character');
                    returValue = false;
                }
            }
            else {
                fnMsgAlert('info', 'Change Password', 'Password Should Contain minimum of 8 characters');
                returValue = false;
            }
        }
        else if (objPasswordValidation[i] == 'GOOD' && returValue) {
            //password strength good then validate password for special characters
            val = $("#txtpwd").val();
            var words = ["#", "$", "%", "^", "&", "(", ")", "{", "+", "=", "[", "}", "]", "?", ">", "<", ",", ".", ";", ":", "/", "|"];
            var password = new Array();
            password = $('#txtpwd').val();
            for (var i = 0; i <= password.length; i++) {
                var a = words.indexOf(password[i]);
                if (a >= 0) {
                    fnMsgAlert('info', 'Change Password', "Special characters '*_-@! '  are only allowed.");
                    returValue = false;
                }
            }
            if (val.length < 6) {
                fnMsgAlert('info', 'Change Password', 'Password Should Contain minimum of six characters');
                returValue = false;
            }
        }
    }
    return returValue;
}

function fnpassHistoryCount(PASSWORD_HISTORY_COUNT) {
    var returValue = true;
    var usercode = selecteduserCode;
    var password = "";
    var count = 0;
    debugger;
    for (var i = 0 ; i < objPasswordValidation.length ; i++) {
        if (!returValue) {
            return returValue;
        }
        if ((objPasswordValidation[i].Privilege_Name).toUpperCase() == 'PASSWORD_HISTORY_COUNT' && returValue) {
            historyCount = objPasswordValidation[i].Privilege_Value_Name;

            $.ajax({
                url: '../HiDoctor_Master/PasswordReset/checkPasswordHistory',
                type: "GET",
                data: { "usercode": usercode, "historyCount": historyCount },
                async: false,
                success: function (result) {
                    debugger;
                    lst = result;
                    password = $("#txtpwd").val();
                    for (var i = 0; i < lst.length; i++) {
                        if (lst[i].User_Pass == password) {
                            count++;
                        }
                    }
                    if (count > 0) {
                        fnMsgAlert('info', 'Change Password', 'The new password should be different from the last "' + historyCount + '" passwords. Please enter a new password');
                        returValue = false;
                        return;
                    }
                },
                error: function (count) {
                    HideModalPopup("dvloading");
                }
            });
        }
    }
    return returValue;
}

function fnValidate() {
    debugger;
    //enter password
    if ($.trim($("#txtpwd").val()) == "") {
        fnMsgAlert('info', 'Info', 'Enter The Password');
        return false;
    }
    //check password length
    var pwd = $("#txtpwd").val();
    if (pwd.length < 6) {
        fnMsgAlert('info', 'Info', 'Enter Atleast Six Characters');
        return false;
    }
    //checkbox value
    checkMailValue = $("input[name='checkMail']").prop("checked");
    if (checkMailValue == true) {
        mailValue = 1;
    }
    else {
        mailValue = 0;
    }
    fncheckPassword();
}

function fnSendPassword() {
    //debugger;
    var usercode = selecteduserCode;
    $("#lbluserstatus").html('');
    var newPassWord = $('#txtpwd').val();
    $.ajax({
        url: '../HiDoctor_Master/PasswordReset/GetandSendPassWord',
        type: "POST",
        data: { 'newPassWord': newPassWord, "usercode": usercode, 'mailvalue': mailValue },
        success: function (jsData) {
            var lockrelease = jsData.split('*')[0];
            var mailid = jsData.split('*')[1];
            if (lockrelease.toUpperCase() == "SUCCESS") {
                $('#txtpwd').val('');
                fnMsgAlert('info', 'Mail sent', 'The password has been sent to ' + mailid + ' Mail ID please check.');
                return false;
            }
            else if (lockrelease.toUpperCase() == "SAVED") {
                $('#txtpwd').val('');
                fnMsgAlert('info', 'Password Changed', 'The Password has been successfully reset');
                return false;
            }
            else if (lockrelease.toUpperCase() == "ERROR") {
                $('#txtpwd').val('');
                fnMsgAlert('error', 'Error', 'The Password cannot be reset since the selected User does not have an Email Id');
                return false;
            }
            else {
                $('#txtpwd').val('');
                fnMsgAlert('info', 'Password Reset', 'The password has been reset but Mail could not be sent due to invalid mail id');
                return false;
            }
            HideModalPopup("dvloading");
        },
        error: function () {
            HideModalPopup("dvloading");
        }
    });
}

function fnGetPasswordHistory() {
    //debugger;
    for (var i = 0; i < objPasswordValidation.length; i++) {
        if ((objPasswordValidation[i].Privilege_Name).toUpperCase() == 'PASSWORD_HISTORY_COUNT') {
            historyCount = objPasswordValidation[i].Privilege_Value_Name;
        }
    }
    var usercode = selecteduserCode;

    if (historyCount > 0) {
        $.ajax({

            url: '../HiDoctor_Master/PasswordReset/checkPasswordHistory',
            type: "GET",
            data: { "usercode": usercode, "historyCount": historyCount },
            async: false,
            success: function (result) {
                //debugger;
                $('#divUserPasswordHistory').html('');
                if (result != '') {
                    if (result.length > 0) {
                        var grid = new ej.grids.Grid({
                            dataSource: result,
                            showColumnChooser: true,
                            allowPaging: true,
                            allowGrouping: true,
                            allowSorting: true,
                            allowFiltering: true,
                            allowResizing: true,
                            allowCellMerging: true,
                            allowScrolling: true,
                            allowExcelExport: false,
                            height: 170,
                            pageSettings: { pageSize: 10, pageSizes: [10, 20, 30, 40, 50], pageCount: 10 },
                            filterSettings: { type: 'CheckBox' },
                            toolbar: ['Search', 'ColumnChooser'],
                            aggregates: [],
                            columns: [
                                    { field: 'User_Pass', headerText: 'Password', width: 220, textAlign: 'center' },
                                    { field: 'last_password_updated_date', headerText: 'Updated date', width: 220, textAlign: 'center' }
                            ]
                        });
                        grid.appendTo('#divUserPasswordHistory');
                    }
                }
            }
        });
    }

    else {
        $.ajax({

            url: '../HiDoctor_Master/PasswordReset/checkCurrentPassword',
            type: "GET",
            data: { "usercode": usercode },
            async: false,
            success: function (result) {
                //debugger;
                $('#divUserPasswordHistory').html('');
                if (result != '') {
                    if (result.length > 0) {
                        var grid = new ej.grids.Grid({
                            dataSource: result,
                            showColumnChooser: true,
                            allowPaging: true,
                            allowGrouping: true,
                            allowSorting: true,
                            allowFiltering: true,
                            allowResizing: true,
                            allowCellMerging: true,
                            allowScrolling: true,
                            allowExcelExport: false,
                            height: 170,
                            pageSettings: { pageSize: 10, pageSizes: [10, 20, 30, 40, 50], pageCount: 10 },
                            filterSettings: { type: 'CheckBox' },
                            toolbar: ['Search', 'ColumnChooser'],
                            aggregates: [],
                            columns: [
                                    { field: 'User_Pass', headerText: 'Password', width: 220, textAlign: 'center' },
                                    { field: 'last_password_updated_date', headerText: 'Updated date', width: 220, textAlign: 'center' }
                            ]
                        });
                        grid.appendTo('#divUserPasswordHistory');
                    }
                }
            }
        });
    }
}
