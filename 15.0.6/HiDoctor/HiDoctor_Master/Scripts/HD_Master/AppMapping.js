function GetAppDetails() {
    $('#main').block({
        message: '<h3>Loading...Please wait...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/AppMapping/GetAppDetails/',
        type: "POST",
        data: "A",
        success: function (result) {
            $('#dvCompanyMapping').html(result)
        },
        error: function () {
            $("#main").unblock();
        },
        complete: function () {
            $("#main").unblock();
        }
    });
}


function fnAppSelectAll() {
    if ($('#bulkcheckDetails').is(":checked")) {
        $("input:checkbox[name=chkSelect]").attr('checked', 'checked');
    }
    else {
        $("input:checkbox[name=chkSelect]").removeAttr('checked');
    }
}



//function fnValidateCompanyApp() {
//    var flag = false;
//    var isResult = true;
//    $("input:checkbox[name=chkSelect]").each(function () {
//        if (this.checked) {
//            var id = this.id;
//            flag = true;
//        }
//    });
//    if (!flag) {
//        fnMsgAlert('info', 'Info', 'Please select atleast one App');
//        return false;
//    }
//    return isResult;
//}
function fnAppSubmit() {

    //if (fnValidateCompanyApp()) {
    var appDetails = "";
    $("input:checkbox[name=chkSelect]").each(function () {
        if (this.checked) {
            var id = this.id;
            appDetails += $("#" + id.replace("chkSelect", "hdnApprovlDetails")).val() + "$";
        }
    });
    try {
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Master/AppMapping/InsertCompanyAppMapping',
            data: 'appDetails=' + escape(appDetails),
            success: function (response) {
                if (response != "") {
                    if (response != "") {
                        fnMsgAlert('success', 'Success', response);
                        GetAppDetails();
                    }
                }

            },
            error: function (e) {
                fnMsgAlert('error', 'Error', 'Error.');

            }
        });
    }
    catch (e) {
        fnMsgAlert('error', 'Error', e.message);
        return false;
    }
    //}
}


function GetActiveAppName() {
    $('#dvMainUserMapping').block({
        message: '<h3>Loading...Please wait...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $("#dvAppName").html('');
    $("#divErrorMsg").html('');
    $.ajax({
        url: '../HiDoctor_Master/AppMapping/GetActiveAppName',
        type: "POST",
        data: "A",
        success: function (response) {

            if (response != "NO") {
                $('#dvAppName').html(response);
                $('#divUserAppHeader').show();
            }
            else {

                fnMsgAlert('info', 'User App Mapping', 'No app found.');
                $('#divUserAppHeader').hide();
                $('#dvAppName').html("No app found.");
                $("#divErrorMsg").html("No app found.");

            }
            $('#dvMainUserMapping').unblock();
        },
        error: function () {
            $('#dvMainUserMapping').unblock();
        },
        complete: function () {
            $('#dvMainUserMapping').unblock();
        }
    });
}

function fnSelectedApp(appDetails) {

    $("#txtEffectiveFrom").val('');
    $("#txtEffectiveTo").val('');
    $('#dvMainUserMapping').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $("#dvuserTree").dynatree("getRoot").visit(function (node) {
        node.select(false);
        node.data.unselectable = false;
        node.data.hideCheckbox = false;
    });
    var appId = appDetails.split('|')[0]
    $.ajax({
        url: '../HiDoctor_Master/AppMapping/GetAppMappedUserDetails',
        type: "POST",
        data: "appId=" + appId,
        success: function (jsData) {
            if (jsData != '') {
                Jsondata = eval('(' + jsData + ')');
                if (Jsondata != null && Jsondata.length > 0) {
                    $("#txtEffectiveFrom").val(Jsondata[0].Effective_From);
                    $("#txtEffectiveTo").val(Jsondata[0].Effective_To);
                }
                $("#dvuserTree").dynatree("getRoot").visit(function (node) {
                    var user = jsonPath(Jsondata, "$.[?(@.User_Code=='" + node.data.key + "')]");
                    if (user.length > 0) {
                        node.select(true);


                    }
                    else {
                        // node.data.unselectable = true;
                        node.data.hideCheckbox = true;
                    }
                });
                $('#dvMainUserMapping').unblock();
            }
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
            $('#dvMainUserMapping').unblock();
        },
        complete: function () {
            $('#dvMainUserMapping').unblock();
        }
    });
}

function fnInsertUserAppMapping() {

    var userCode = selKeys;
    var appDetails = $('input[name="App"]:checked').val();

    if (appDetails == "" || appDetails === undefined) {
        fnMsgAlert('info', 'User App Mapping', 'Select app name');
        return false;
    }

    if ($.trim($("#txtEffectiveFrom").val()) == "") {
        fnMsgAlert('info', 'User App Mapping', 'Select effective from date.');
        return false;

    }

    if ($.trim($("#txtEffectiveTo").val()) == "") {
        fnMsgAlert('info', 'User App Mapping', 'Select effective to date');
        return false;
    }

    if (!fnValidateDateFormate($('#txtEffectiveFrom'), "Effective from Date")) {
        return false;
    }

    if (!fnValidateDateFormate($('#txtEffectiveTo'), "Effective to Date")) {
        return false;
    }

    var FromDateArr = $("#txtEffectiveFrom").val().split('/');
    var ToDateArr = $("#txtEffectiveTo").val().split('/');
    var dt1 = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
    var dt2 = new Date(ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'User App Mapping', 'Effective from date should be less than Effective to date.');
        return false;
    }

    try {
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Master/AppMapping/InsertUserAppMapping',
            data: 'appDetails=' + escape(appDetails) + "&userCode=" + userCode + '&ef=' + FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0] + '&et=' + ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0],
            success: function (response) {
                if (response != "") {
                    if (response != "") {
                        fnMsgAlert('success', 'Success', response);
                        fnSelectedApp(appDetails);
                    }
                }

            },
            error: function (e) {
                fnMsgAlert('error', 'Error', 'Error.');

            }
        });
    }
    catch (e) {
        fnMsgAlert('error', 'Error', e.message);
        return false;
    }

}
