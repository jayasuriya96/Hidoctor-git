
function fnValidateAndSubmit() {
    debugger;
    var ALPHANUMERICREGX_g = new RegExp("^[a-zA-Z0-9_-]+$");
    if ($("#txtOldPassword").val() == "") {
        fnMsgAlert('info', 'Change Password', "Old password should be given");
        $("#txtOldPassword").focus();
        return false;
    }
    if ($("#txtNewPassword").val().indexOf(" ") > -1) {
        fnMsgAlert('info', 'Change Password', "Space(s) are not allowed in the new password.");
        $("#txtNewPassword").focus();
        return false;
    }

    if ($.trim($("#txtNewPassword").val()) == "") {
        fnMsgAlert('info', 'Change Password', "Please enter the Password");
            $("#txtNewPassword").focus();
            return false;
    }
    

    if ($.trim($("#txtNewPassword").val()) == "") {
        fnMsgAlert('info', 'Change Password', "New password should be given");
        $("#txtNewPassword").focus();
        return false;
    }
    if ($.trim($("#txtNewPassword").val()) != $("#txtConfirmPassword").val()) {
        fnMsgAlert('info', 'Change Password', "New password & conform password should be same");
        $("#txtNewPassword").focus();
        return false;
    }
    if ($.trim($("#txtOldPassword").val()) == $.trim($("#txtNewPassword").val())) {
        fnMsgAlert('info', 'Change Password', "Old password & New password should not be same");
        $("#txtNewPassword").focus();
        return false;
    }
    if ($.trim($("#txtConfirmPassword").val()) == "") {
        fnMsgAlert('info', 'Change Password', "Confirm Password should be given");
        $("#txtConfirmPassword").focus();
        return false;
    }

    if ($.trim($("#txtNewPassword").val()).length > 30) {
        fnMsgAlert('info', 'Change Password', "Please enter 30 characters only in New Password.");
        $("#txtNewPassword").focus();
        return false;
    }

    if ($("#txtNewPassword").val() == $("#txtConfirmPassword").val()) {
        if ($("#txtpasshistoryneed").val() == "YES") {
            var historycount = $('#txtpasshistorycount').val();
            var passhis = $("#txtpasshistory").val();
            var passValue = $("#txtNewPassword").val();
            var str = passhis;
            var count = 0;
            var checkedItemsArray = str.split(",");

            var j = 0;
            for (j = 0; j < checkedItemsArray.length; j++) {
                if (checkedItemsArray[j] == passValue) {
                    count++;
                }
            }
            if (count > 0) {
                fnMsgAlert('info', 'Change Password', 'The new password should be different from last "' + historycount + '" passwords . Please enter a new password. ');
                return false;
            }
        }
    }
    debugger;

    var words = ["#", "$", "%", "^", "&", "(", ")", "{", "+", "=", "[", "}", "]", "?", ">", "<", ",", ".", ";", ":", "/", "|"];
    var password = new Array();
    password = $('#txtNewPassword').val();
    for (var i = 0; i <= password.length; i++) {
        var a = words.indexOf(password[i]);
        if (a >=0) {
            fnMsgAlert('info', 'Change Password', "Special characters like * _ - @ ! are only allowed.");
            return false;
        }
    }
    if (password.length >= 31) {
        fnMsgAlert('info', 'Change Password', "Please enter minimum 30 character in password.");
        return false;
    }

    if ($("#txtpass").val() == "GOOD") {
        if ($("#txtNewPassword").val() == $("#txtConfirmPassword").val()) {
            var val = $("#txtNewPassword").val();
            var val1 = $("#txtConfirmPassword").val();
           
            var words = ["#", "$", "%", "^", "&", "(", ")", "{", "+", "=", "[", "}", "]", "?", ">", "<", ",", ".", ";", ":", "/", "|"];
            var password = new Array();
            password = $('#txtNewPassword').val();
            for (var i = 0; i <= password.length; i++) {
                var a = words.indexOf(password[i]);
                if (a >=0) {
                    fnMsgAlert('info', 'Change Password', "Special characters like * _ - @ ! are only allowed.");
                    return false;
                }
            }
            if (val.length > 5) {
            }
            else {
                fnMsgAlert('info', 'Change Password', 'Password Should Contain minimum of six characters');
                return false;
            }
        }
    }
    if ($("#txtpass").val() == "STRONG") {
        if ($("#txtNewPassword").val() == $("#txtConfirmPassword").val()) {
            var val = $("#txtNewPassword").val();
            var val1 = $("#txtConfirmPassword").val();
            if (val.length > 7) {
                var regexLetter = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@*$!_-])[A-Za-z\d@*$!_-]{8,30}$/;
                if (regexLetter.test(val)) {
                }
                else {
                    fnMsgAlert('info', 'Change Password', 'Password Should Contain Atleast One Alphabet,One Numeric,One Special Character and minimum of Eight characters');
                    return false;
                }
            }
            else {
                fnMsgAlert('info', 'Change Password', 'Password Should Contain minimum of Eight characters')
                return false;
            }
        }
    }
    if ($("#txtpass").val() == "VERY_STRONG") {
        if ($("#txtNewPassword").val() == $("#txtConfirmPassword").val()) {
            var val = $("#txtNewPassword").val();
            var val1 = $("#txtConfirmPassword").val();
            var regexLetter = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@*$!_-]).{10,30}/;
            if (regexLetter.test(val)) {
            }
            else {
                fnMsgAlert('info', 'Change Password', 'Password Should Contain atleast One Uppercase,One Lowercase,One Numeric,One Special Character and minimum of ten characters')
                return false;
            }
        }
    }
    fnUpdatePassword();
}
/*
function fnUpdatePassword1() {
    debugger;
    var oldPassword = $("#txtOldPassword").val();
    var newPassword = $("#txtNewPassword").val();
    var confirmPassword = $("#txtConfirmPassword").val();
    
    $.ajax({
        type: 'POST',
        dataType: "text",
        url: "../ChangePassword/UpdatePassword",
        data: { 'newPassword': newPassword,
                'oldPassword': oldPassword,
                'confirmPassword': confirmPassword
        },
        success: function (result) {
            debugger;
            if (result != null) {
                var returnResult = result.split(':');
                if (returnResult[0] == "1") {
                    fnMsgAlert('success', 'Change Password', returnResult[1]);
                    fnClearAll();
                    document.getElementById('dvQuickLinks').style.pointerEvents = 'auto';
                    document.getElementById('hometopimage').style.pointerEvents = 'auto';
                    document.getElementById('menu1').style.pointerEvents = 'auto';
                    if ($("#wrapperbody").is(":visible")) {
                    }
                    else {
                        location.reload()
                    }
                    fnLogOut();
                }
                else {
                    fnMsgAlert('info', 'Change Password', returnResult[1]);
                }
            }
        },
        error: function (e) {
            fnMsgAlert('error', 'Error', 'Please try after some time');
        }
    });
}*/

function fnUpdatePassword() {
    debugger;
    var oldPassword = $("#txtOldPassword").val();
    var newPassword = $("#txtNewPassword").val();
    var confirmPassword = $("#txtConfirmPassword").val();

    $.ajax({
        type: 'POST',
        dataType: "text",
        url: "../ChangePassword/UpdatePassword",
        data: {
            'newPassword': newPassword,
            'oldPassword': oldPassword,
            'confirmPassword': confirmPassword
        },
        success: function (result) {
            var returnResult = result.split(':');
            if (returnResult[0] == "1") {
                fnMsgAlert('success', 'Change Password', returnResult[1]);
                fnClearAll();
                document.getElementById('dvQuickLinks').style.pointerEvents = 'auto';
                document.getElementById('hometopimage').style.pointerEvents = 'auto';
                document.getElementById('menu1').style.pointerEvents = 'auto';
                if ($("#wrapperbody").is(":visible")) {
                }
                else {
                    location.reload()
                }
                fnLogOut();
            }
            else {
                fnMsgAlert('info', 'Change Password', returnResult[1]);
            }
        },
        error: function (e) {
            fnMsgAlert('error', 'Error', 'Please try after some time');
        },
        complete: function (e) {
            fnMsgAlert('info', 'Change Password', 'Password has been updated');
            fnLogOut();
        }
    });
}





function fnstrength(event) {
    debugger;
    var val1 = $("#txtNewPassword").val();
    if (event.keyCode == 8 || event.keyCode == 0)
        {
        return false;
    }
    else
    {
        var words =["#", "$", "%", "^", "&", "(", ")", "{", "+", "=", "[", "}", "]", "?", ">", "<", ",", ".", ";", ":", "/", "|"];
        var val1 = new Array();
        val1 = $("#txtNewPassword").val();
        for (var i = 0; i <= val1.length; i++) {
            var a = words.indexOf(val1[i]);
            if(a >= 0) {
                fnMsgAlert('info', 'Change Password', "Special characters like * _ - @ ! are only allowed.");
                return false;
            }
        }
        }

    if (val1.length > 5) {
        $('#lblstrength').css('display', 'block');
        $('#lblstrength').html('Strength: Good');
        var regex = /\d/g;
            var regexLetter = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@*$!_-])[A-Za-z\d@*$!_-]{8,30}$/;
            if (regexLetter.test(val1)) {
                $('#lblstrength').css('display', 'block');
                $('#lblstrength').html('Strength: Strong');
                var regexstrong = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@*$!_-]).{10,30}/;
                if (regexstrong.test(val1)) {
                    $('#lblstrength').css('display', 'block');
                    $('#lblstrength').html('Strength: Very strong');
                }
            }
    }
    else {
        $('#lblstrength').css('display', 'block');
        $('#lblstrength').html('Strength: weak');
    }
}

function fnClearAll() {
    $('#lblstrength').css('display', 'none');
    $("#txtOldPassword").val('');
    $("#txtNewPassword").val('');
    $("#txtConfirmPassword").val('');
}

function fnLogOut()
    {
        $("#IsLogOut").val("LOGOUT")
        $('#frmHomeIndexForm').submit();
    }