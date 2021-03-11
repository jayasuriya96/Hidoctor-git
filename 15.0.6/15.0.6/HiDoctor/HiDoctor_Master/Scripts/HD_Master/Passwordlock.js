//Created By:SRISUDHAN//
//Craeted Date:03-12-2013


//bind the tree//
function fnUserTreeNodeClick(node) {
    $('#hdnUserCode').val(node.data.key);
    $('#divInput').show();
    $("#divMain").css('width', '60%');
    $('#treetitle').val(node.data.title);
    //treetitle
    $("#spnTreeToggle").html('Hide Tree');
    $('#divToggle').show();
    fnGetAccountIsLock();

}

function fnUserTreePostInit() {
}

//hide tree show tree enable
function fnToggleTree() {
    if ($("#spnTreeToggle").html() == "Hide Tree") {
        $("#dvTree").hide();
        $("#divMain").css('width', '60%');
        $("#spnTreeToggle").html('Show Tree');
    }
    else if ($("#spnTreeToggle").html() == "Show Tree") {
        $("#dvTree").show();
        $("#divMain").css('width', '60%');
        $("#spnTreeToggle").html('Hide Tree');
    }
}


//get accout status
function fnGetAccountIsLock() {
    $.ajax({
        url: '../HiDoctor_Master/PasswordLockRelease/fnGetAccountIsLock',
        type: "POST",
        data: "UserCode=" + $("#hdnUserCode").val(),
        success: function (jsData) {        
            if (jsData == "Y" && jsData != "") {
                $('#lbluserstatus').html($('#treetitle').val() + " " + "Account is locked.");
                $('#btnsendpassword').hide();
                $('#btnrelease').show();
            }
            else {
                $('#lbluserstatus').html($('#treetitle').val() + " " + "Account is not locked.");
                $('#btnrelease').hide();
                $('#btnsendpassword').show();
            }
            $("#dvAjaxLoad").hide();
        },
        error: function () {
            $("#dvAjaxLoad").hide();
        }
    });
}


//lock release function
function fnlockRelease() {
    ShowModalPopup("dvloading");
    $.ajax({
        url: '../HiDoctor_Master/PasswordLockRelease/fnGetLockRelease',
        type: "POST",
        data: "UserCode=" + $("#hdnUserCode").val(),
        success: function (jsData) {
         
            var lockrelease = jsData.split('*')[0];
            var mailid = jsData.split('*')[1];
            if (lockrelease == "SUCCESS") {
                $('#lbluserstatus').html("Account is unlocked and password is sent to " + mailid + "  Mail ID please check.");
                $('#btnsendpassword').hide();
                $('#btnrelease').show();
            }
            else {
                $('#lbluserstatus').html("Not registed Mail.");
                $('#btnsendpassword').hide();
                $('#btnrelease').show();
            }

            HideModalPopup("dvloading");
        },
        error: function () {
            HideModalPopup("dvloading");
        }
    });
}
//pass sending 
function fnSendpassword() {
    ShowModalPopup("dvloading");
    $.ajax({
        url: '../HiDoctor_Master/PasswordLockRelease/fnGetsendpassword',
        type: "POST",
        data: "UserCode=" + $("#hdnUserCode").val(),
        success: function (jsData) {
           
            var lockrelease = jsData.split('*')[0];
            var mailid = jsData.split('*')[1];
            if (lockrelease == "SUCCESS") {
                $('#lbluserstatus').html("User account password is sent to " + mailid + "  Mail ID please check.");
                $('#btnsendpassword').show();
                $('#btnrelease').hide();
            }
            else {
                $('#lbluserstatus').html("Not registed Mail.");
                $('#btnsendpassword').show();
                $('#btnrelease').hide();
            }
            HideModalPopup("dvloading");
        },
        error: function () {
            HideModalPopup("dvloading");
        }
    });
}