//Created By:Sumathi.M
//Date:30/04/2014

function fnGetuserType() {
    $('#dvMainUserProductMapping').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/UserProductMapping/GetUserType',
        type: "POST",
        success: function (result) {
            if (result != '') {
                jsonresult = eval('(' + result + ')');
                var selectcolumn = $("#ddlUserType");
                $("#ddlUserType option").remove();
                selectcolumn.append("<option value=0>-Select UserType-</option>");
                for (var i = 0; i < jsonresult.length; i++) {
                    selectcolumn.append("<option value=" + jsonresult[i].User_Type_Code + ">" + jsonresult[i].User_Type_Name + "</option>");
                }
            }
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
            $('#dvMainUserProductMapping').unblock();
        },
        complete: function () {
            $('#dvMainUserProductMapping').unblock();
        }
    });
}

function fnChangeUserTypes() {
    var userTypeCode = $("#ddlUserType option:selected").val();
    fnCheckTree(userTypeCode);
}

function fnCheckTree(UserTypeCode) {
    $('#dvMainUserProductMapping').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $("#dvuserTree").dynatree("getRoot").visit(function (node) {
        node.select(false);
        node.data.unselectable = false;
        node.data.hideCheckbox = false;
    });
    var selectUserTypeCode = UserTypeCode;
    if (selectUserTypeCode != null && selectUserTypeCode != '') {
        $.ajax({
            url: '../HiDoctor_Master/UserProductMapping/GetUsersbyUserTypeCode',
            type: "POST",
            data: "userTypeCode=" + selectUserTypeCode + "",
            success: function (jsData) {
                if (jsData != '') {
                    Jsondata = eval('(' + jsData + ')');
                    $("#dvuserTree").dynatree("getRoot").visit(function (node) {
                        var user = jsonPath(Jsondata, "$.[?(@.User_Code=='" + node.data.key + "')]");
                        if (user.length > 0) {
                            node.select(true);
                        }
                        else {
                            node.data.unselectable = true;
                            node.data.hideCheckbox = true;
                        }
                    });
                    fnGetUserProductMapping(selectUserTypeCode);
                    $('#dvMainUserProductMapping').unblock();
                }
            },
            error: function (e) {
                fnMsgAlert('info', '', 'Error.' + e.Message);
                $('#dvMainUserProductMapping').unblock();
            },
            complete: function () {
                $('#dvMainUserProductMapping').unblock();
            }
        });
    }
}

function fnGetUserProductMapping(selectUserTypeCode) {
    if (selectUserTypeCode != null && selectUserTypeCode != '') {
        $('#dvMainUserProductMapping').block({
            message: '<h3>Loading...</h3>',
            css: { border: '2px solid #ddd' }
        });
        $.ajax({
            url: '../HiDoctor_Master/UserProductMapping/GetUserProductMapping',
            type: "POST",
            data: "userTypeCode=" + selectUserTypeCode + "",
            success: function (jsData) {
                if (jsData != '') {
                    $('#divUserTypeproduct').html(jsData);
                    if (jsData == "No Records To Display.") {
                        $('#lblmessage').html('');
                        $("#btnSave").hide();
                        $('#dvMainUserProductMapping').unblock();
                    }
                    else {
                        $('#lblmessage').html('The Products shown below are irrespective of any user');
                        $("#btnSave").show();
                        $('#dvMainUserProductMapping').unblock();
                    }
                }
                else {
                    $('#divUserTypeproduct').html('No Records To Display.');
                    $('#lblmessage').html('');
                    $("#btnSave").hide();
                    $('#dvMainUserProductMapping').unblock();
                }
            },
            error: function (e) {
                fnMsgAlert('info', '', 'Error.' + e.Message);
                $('#dvMainUserProductMapping').unblock();
            },
            complete: function () {
                $('#dvMainUserProductMapping').unblock();
            }
        });
    }
}

function fnCheckAll() {
    if ($('#userproductbulkChk').is(":checked")) {
        $("input:checkbox[name=chk_UserProduct]").attr('checked', 'checked');
    }
    else {
        $("input:checkbox[name=chk_UserProduct]").removeAttr('checked');
    }
}

function fnSaveUserProduct() {
    var productCode = "";
    var status = "";
    var userCodes = "";
   
    $("input:checkbox[name=chk_UserProduct]").each(function () {
        if (this.checked) {
            productCode += "" + $(this).val() + "^";
        }
    });

    for (var i = 0; i < selKeys.length; i++) {
        userCodes += selKeys[i] + '^';
    }

    var userTypeCode = $("#ddlUserType option:selected").val();

    if (userCodes == '') {
        fnMsgAlert('info', 'User Product Mapping Screen', 'Please Click Any User');
        return false;
    }
    if (!$("input[name='chk_UserProduct']").is(":checked")) {
        fnMsgAlert('info', 'User Product Mapping Screen', 'Please select alteast one product');
        HideModalPopup("dvloading");
        return false;
    }


    $('#dvMainUserProductMapping').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });

    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/UserProductMapping/InsertUserProductMapping',
        data: "userCodes=" + userCodes + "&productCodes=" + productCode,
        success: function (result) {         
            if ($.trim(result) != '') {
                fnMsgAlert('info', 'User Product Mapping', result);
            }
            $('#dvMainUserProductMapping').unblock();
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
            $('#dvMainUserProductMapping').unblock();
        }
    });
}