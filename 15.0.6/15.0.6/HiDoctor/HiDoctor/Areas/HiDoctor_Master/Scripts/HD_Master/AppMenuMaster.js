
function fnFillAppParentMenu() {
    debugger;
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/MenuMaster/GetAppParentMenuItems/',
        type: "POST",
        data: "A",
        success: function (result) {
            $('#cboParentMenu').html(result)
        },
        error: function () {
            $("#main").unblock();
        },
        complete: function () {
            $("#main").unblock();
        }
    });
}

function fnFillAppParentMenuNew() {
    debugger;
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/MenuMaster/GetAppParentMenuItemsNew/',
        type: "POST",
        data: "A",
        success: function (result) {
            $('#cboParentMenu').html(result)
        },
        error: function () {
            $("#main").unblock();
        },
        complete: function () {
            $("#main").unblock();
        }
    });
}
$("input[name='rdType']").change(function () {
    if ($(this).val() == "NR" || $(this).val() == "R") {
        $("#Category").show();
        $("#Moduletype").show();
    }
    else {
        $("#Category").hide();
        $("#Moduletype").hide();
    }
});
$("input[name='rdprojopt']").change(function () {
    if ($(this).val() == "C") {
        $("#Parent").show();
        $("#Type").show();
        $("#Category").show();
        $("#MenuUrl").show();
        $("#Moduletype").show();
        $("#Params").show();
    }
    else {
        $("#Parent").hide();
        $("#Type").hide();
        $("#Category").hide();
        $("#MenuUrl").hide();
        $("#Moduletype").hide();
        //$("#cboModuleType").val(0);
        $("#Params").hide();
    }
});


//$("input[name='rdType']").change(function () {
//    if ($(this).val() == "NR" || $(this).val() == "R") {
//        $("#MenuUrl").show();
//        $("#Moduletype").show();
//    }
//    else {
//        $("#MenuUrl").hide();
//        $("#Moduletype").hide();
//        $("#Params").hide();
//    }
//});

//$(function () {
//    $("#Moduletype").change(function () {
//        debugger;
//        if ($("#Moduletype").val() == "0") {
//            $("#Params").hide();
//        }
//        if ($("#Moduletype").val() == "1") {
//            $("#Employee_Code").hide();
//            $("#Employee_Number").hide();
//            $("#Employee_Name").hide();
//            $("#Region_Name").hide();
//            $("#Role_Id").hide();
//            $("#Params").show();
//        }
//        if ($("#Moduletype").val() == "3") {
//            $("#Employee_Code").hide();
//            $("#Employee_Number").hide();
//            $("#Employee_Name").hide();
//            $("#Region_Name").hide();
//            $("#Role_Id").hide();
//            $("#Params").show();
//        }
//        if ($("#Moduletype").val() == "4") {
//            $("#Employee_Code").show();
//            $("#Employee_Number").show();
//            $("#Employee_Name").show();
//            $("#Region_Name").show();
//            $("#Role_Id").show();
//            $("#Params").show();
//        }
//    });
//});

function fnFillAppMenuDetails() {
    debugger;
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/MenuMaster/GetAppMenuDetails/',
        type: "POST",
        data: "A",
        success: function (result) {
            $('#dvMenuItems').html(result)
            if ($('input[name="rdprojopt"]:checked').val() == 'P') {
                $("#Parent").hide();
                $("#Type").hide();
                $("#Category").hide();
                $("#MenuUrl").hide();
                $("#Moduletype").hide();
                $("#Params").hide();
            }
            else {
                $("#Type").show();
                $("#Category").show();
                $("#MenuUrl").show();
                $("#Moduletype").show();
            }
        },
        error: function () {
            $("#main").unblock();
        },
        complete: function () {
            $("#main").unblock();
        }
    });
}

function fnEdit(menuId) {
    debugger;
    $("#hdnMode").val('EDIT');
    $('#btnSave').val('Update');
    $("#hdnMenuId").val(menuId);
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/MenuMaster/GetAppSelectedMenuDetails/',
        type: "POST",
        data: "menuId=" + menuId + "",
        success: function (result) {
            if (result != '' && result != undefined && result != null) {
                var jsonResult = eval('(' + result + ')');
                if (jsonResult.length > 0) {
                    $('#txtMenuText').val(jsonResult[0].Menu_Text);
                    $('input[name="rdprojopt"][value=' + jsonResult[0].MenuLevel + ']').prop('checked', true);
                    if (jsonResult[0].MenuLevel == "P") {
                        $("#Parent").hide();
                        $("#Type").hide();
                        $("#Category").hide();
                        $("#MenuUrl").hide();
                        $("#Params").hide();
                    }
                    else {
                        $("#Parent").show();
                        $("#Type").show();
                        $("#Category").show();
                        $("#Moduletype").show();
                        $("#Params input[type=checkbox]").prop("checked", false);
                        $("#Params").show();
                        $("#MenuUrl").show();
                    }
                    if (jsonResult[0].MenuLevel == "C" && jsonResult[0].Type == "N") {
                        $("#Category").hide();
                        $("#MenuUrl").hide();
                    }
                    else if (jsonResult[0].MenuLevel == "C" && jsonResult[0].Type == "NR" || jsonResult[0].Type == "R") {
                        $("#Category").show();
                        $("#MenuUrl").show();
                        $("#Moduletype").show();
                    }
                    else {
                        $("#Category").hide();
                        $("#MenuUrl").hide();
                        $("#Moduletype").hide();
                    }
                    $("#cboParentMenu option[value=" + jsonResult[0].Parent_Id + "]").attr("selected", "selected");
                    //$('#cboParentMenu').val(jsonResult[0].Parent_Id);
                    $('#txtMenuURL').val(jsonResult[0].Menu_URL);
                    $('input[name="rdType"][value=' + jsonResult[0].Type + ']').prop('checked', true);
                    $('#cboCategory').val(jsonResult[0].Category);
                    $("#cboModuleType option[value=" + jsonResult[0].TypeOfModule + "]").attr("selected", "selected");
                    var querystringparams = "";
                    var selected = new Array();
                    $("#Params input[type=checkbox]").each(function () {
                        selected.push(this.value);
                    });
                    if (selected.length > 0) {
                        querystringparams = selected.join(",");
                    }
                    if (jsonResult[0].Query_String_Parameters != null || jsonResult[0].Query_String_Parameters != "NA") {
                        var newselected = jsonResult[0].Query_String_Parameters.split(",");
                        for (var i = 0; i < selected.length; i++) {
                            if (newselected.indexOf(selected[i]) !== -1) {
                                $('#Params #subdomn input[value = "' + selected[i] + '"]').prop('checked', true);
                            }
                        }
                    }
                    
                    // $('input[name="rdprojopt"]').val(jsonResult[0].MenuLevel);
                }
            }
            $('#dvPanel').tabs('option', 'selected', 0);
        },
        error: function () {
            $("#main").unblock();
        },
        complete: function () {
            $("#main").unblock();
        }
    });
}

function fnSubmit() {
    debugger;
    var result = fnValidate();

    if (result) {

     

        var menuText = $.trim($('#txtMenuText').val());
        var MenuLevel = $('input[name="rdprojopt"]:checked').val();
        var parentMenu = $('#cboParentMenu').val();
        var Type = $('input[name="rdType"]:checked').val();
        var Category = $('#cboCategory').val();
        var menuURL = $('#txtMenuURL').val();
        if (MenuLevel == "P") {
            parentMenu = "0";
            Category = "";
            Type = "";
            menuURL = "";
        }

        if (Type == "N") {
            Category = "";
            menuURL = "";
        }
        if ($("#cboModuleType").val() == 0) {
            //  swal("Please Choose atleast one Parameter.", "", "info");
            fnMsgAlert('info', 'Validate', 'Please Choose Type Of Module.');
            return false;
        }
        if ($('#Params input[type=checkbox]:checked').size() == 0) {
          //  swal("Please Choose atleast one Parameter.", "", "info");
            fnMsgAlert('info', 'Validate', 'Please Choose atleast one Parameter.');
            return false;
        }
        var querystringparams = "";
        var selected = new Array();
        $("#Params input[type=checkbox]:checked").each(function () {
            selected.push(this.value);
        });
        if (selected.length > 0) {
            querystringparams = selected.join(",");
        }
        else {
            querystringparams = "";
        }
       

        $.ajax({
            url: '../HiDoctor_Master/MenuMaster/InsertAppMenuMaster/',
            type: "POST",
            data: "menuText=" + menuText + "&MenuLevel=" + MenuLevel + "&parentMenu=" + parentMenu + "&menuURL=" + menuURL + "&Type=" + Type + "&Category=" + Category + "&mode=" + $("#hdnMode").val() + "&menuId=" + $('#hdnMenuId').val() + "&TypeOfModule=" + $("#cboModuleType").val() + "&Query_String_Parameters=" + querystringparams + "",
            success: function (result) {
                if (result.split(':')[0] == 'SUCCESS') {
                    debugger;
                    fnMsgAlert('success', 'Success', result.split(':')[1]);
                    fnClearAll();
                    fnFillAppMenuDetails();
                }
                else {
                    fnMsgAlert('info', 'Error', result.split(':')[1]);
                }
            },
            error: function () {
                $("#main").unblock();
            },
            complete: function () {
                $("#main").unblock();
            }
        });
    }
}
function fnValidate() {
    debugger;
    if ($.trim($('#txtMenuText').val()) == '') {
        fnMsgAlert('info', 'Validate', 'Please Enter Menu Name');
        return false;
    }
    else {
        var specialCharregex = new RegExp("^[a-zA-Z0-9:()' '-._]+$");
        if (!specialCharregex.test($.trim($('#txtMenuText').val()))) {
            fnMsgAlert('info', 'Information', 'Please remove the special characters from menu title.');
            return false;
        }
    }

    if ($('input[name="rdprojopt"]:checked').val() == 'C') {
        if ($('#cboParentMenu').val() == '0' || $('#cboParentMenu').val() == '') {
            fnMsgAlert('info', 'Validate', 'Please select parent menu');
            return false;
        }
    }

    if ($('input[name="rdprojopt"]:checked').val() == 'C' && $('input[name="rdType"]:checked').val() == 'NR' && $('#cboCategory').val() == '') {
        fnMsgAlert('info', 'Validate', 'Please select menu category');
        return false;
    }
    else if ($('input[name="rdprojopt"]:checked').val() == 'C' && $('input[name="rdType"]:checked').val() == 'R' && $('#cboCategory').val() == '') {
        fnMsgAlert('info', 'Validate', 'Please select menu category');
        return false;
    }

    if ($('input[name="rdprojopt"]:checked').val() == 'C' && $('input[name="rdType"]:checked').val() == 'NR' || $('input[name="rdType"]:checked').val() == 'R') {
        if ($('#txtMenuURL').val() == '') {
            fnMsgAlert('info', 'Validate', 'Please Enter the URL');
            return false;
        }
    }

    return true;
}

function fnSummaryHide(divid, spnid) {
    if ($('.' + divid).css("display") == "none") {
        $('.' + divid).fadeIn('slow');
        $('#' + spnid).removeClass('expandMenu');
        $('#' + spnid).addClass('collapseHeader');
    }
    else {
        $('.' + divid).fadeOut('slow');
        $('#' + spnid).removeClass('collapseHeader');
        $('#' + spnid).addClass('expandMenu');
    }
}

function fnClearAll() {
    $('#txtMenuText').val('');
    $('#cboParentMenu').val('');
    $('#txtMenuURL').val('');
    $('#cboCategory').val('');
    $('#hdnMode').val('INSERT');
    $('#hdnMenuId').val('');
    $('#btnSave').val('Save');
    $('input[name="rdprojopt"][value=P]').prop('checked', true);
    $('input[name="rdType"][value=N]').prop('checked', true);
    $("#cboModuleType").val('');
    $("#Params input[type=checkbox]").prop("checked", false);
}

function fnValidateInteger(obj) {
    var specialCharregex = new RegExp("^[0-9]+$");
    if ($.trim($(obj).val()) != '') {
        if (!specialCharregex.test($.trim($(obj).val()))) {
            fnMsgAlert('info', 'Information', 'Please enter integer only.');
            $(obj).val('');
        }
    }
}
///************************** Menu Access *********************************//
function fnSubmitMapping() {

    var checkedItems = "";
    var count = 0;
    $("#ulMenu input[type='checkbox']").each(function (i) {
        if ($(this).attr("checked") == 'checked') {
            count = parseInt(count) + 1;
            checkedItems += $(this).val() + "^";
        }
    });
    if (count == 0) {
        fnMsgAlert('info', 'Info', 'Please select atleast one menu item');
        return;
    }
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/MenuMaster/InsertMenuAccess/',
        type: "POST",
        data: "userTypeCode=" + $('#cboUserTypeCode').val() + "&selectedMenus=" + checkedItems.slice(0, -1) + "&userTypeName="
            + $('#cboUserTypeCode option:selected').text() + "",
        success: function (result) {
            if (result.split(':')[0] == "SUCCESS") {
                fnMsgAlert('success', 'Success', result.split(':')[1]);
                $("#ulMenu input[type='checkbox']").prop('checked', false);
                $('#cboUserTypeCode').val('');
                fnGetMenuMappedUserTypes();
            }
            else {
                fnMsgAlert('info', 'Error', result.split(':')[1]);
            }
        },
        error: function () {
            $("#main").unblock();
        },
        complete: function () {
            $("#main").unblock();
        }
    });
}


function fnAppSubmitMapping() {

    var checkedItems = "";
    var count = 0;
    $("#ulMenu input[type='checkbox']").each(function (i) {
        if ($(this).attr("checked") == 'checked') {
            count = parseInt(count) + 1;
            checkedItems += $(this).val() + "^";
        }
    });
    if (count == 0) {
        fnMsgAlert('info', 'Info', 'Please select atleast one menu item');
        return;
    }
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/MenuMaster/AppInsertMenuAccess/',
        type: "POST",
        data: "userTypeCode=" + $('#cboUserTypeCode').val() + "&selectedMenus=" + checkedItems.slice(0, -1) + "&userTypeName="
            + $('#cboUserTypeCode option:selected').text() + "",
        success: function (result) {
            if (result.split(':')[0] == "SUCCESS") {
                fnMsgAlert('success', 'Success', result.split(':')[1]);
                $("#ulMenu input[type='checkbox']").prop('checked', false);
                $('#cboUserTypeCode').val('');
                fnGetMenuMappedUserTypes();
            }
            else {
                fnMsgAlert('info', 'Error', result.split(':')[1]);
            }
        },
        error: function () {
            $("#main").unblock();
        },
        complete: function () {
            $("#main").unblock();
        }
    });
}


function fnOpenCopy() {
    $("#dvCopyPopUp").overlay().load();
}


function GetActiveUserTypes() {
    $('#dvRightPanel').block({
        message: '<h3>Loading...Please wait...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/MenuMaster/GetSourceUserTypes/',
        type: "POST",
        data: "A",
        success: function (jsonData) {
            $('#dvUType').html('');
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
                    $("#cboDestUserType").multiselect().multiselectfilter();
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

function fnGetMenuMappedUserTypes() {
    $('#main').block({
        message: '<h3>Loading...Please wait...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/MenuMaster/GetMenuMappedUserTypes/',
        type: "POST",
        data: "A",
        success: function (result) {
            $('#cboSourceUserType').html(result);
        },
        error: function () {
            $('#main').unblock();
        },
        complete: function () {
            $('#main').unblock();
        }
    });
}

function fnCopyMenuAccess() {
    var userTypes = "";
    var userTypeNames = "";
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
        userTypeNames += $(this).text() + "^";
    });
    if (i > 0) {
        fnMsgAlert('info', 'info', 'You have selected the same user type in source and destination.Please change any other user type.');
        return;
    }

    if (i == 0) {
        if (userTypes == "") {
            fnMsgAlert('info', 'info', 'Please select atleast one destination user type');
            return;
        }

        $('#main').block({
            message: '<h3>Loading...Please wait...</h3>',
            css: { border: '2px solid #ddd' }
        });
        $.ajax({
            url: '../HiDoctor_Master/MenuMaster/CopyMenuAccess/',
            type: "POST",
            data: "sourceUserTypeCode=" + $("#cboSourceUserType").val() + "&userTypes=" + userTypes + "&userTypeNames=" + userTypeNames,
            success: function (result) {
                if (result.split(':')[0] == "SUCCESS") {
                    $("#dvCopyPopUp").overlay().close();
                    fnMsgAlert('success', 'Success', result.split(':')[1]);
                    $("#cboSourceUserType").val('');
                    $("#cboSourceUserType").attr('selectedIndex', 0);
                    $('select#cboDestUserType > option').attr('selected', false);
                    $('#cboDestUserType').multiselect("destroy").multiselect().multiselectfilter();
                    GetActiveUserTypes();
                    fnGetMenuMappedUserTypes();
                    $("#ulMenu input[type='checkbox']").prop('checked', false);
                    $('#cboUserTypeCode').val('');
                }
                else {
                    fnMsgAlert('info', 'Error', result.split(':')[1]);
                }
            },
            error: function () {
                fnMsgAlert('info', 'Error', 'Error occured while copy the menu access');
                $('#main').unblock();
            },
            complete: function () {
                $('#main').unblock();
            }
        });
    }
}


function fnCopyAppMenuAccess() {
    var userTypes = "";
    var userTypeNames = "";
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
        userTypeNames += $(this).text() + "^";
    });
    if (i > 0) {
        fnMsgAlert('info', 'info', 'You have selected the same user type in source and destination.Please change any other user type.');
        return;
    }

    if (i == 0) {
        if (userTypes == "") {
            fnMsgAlert('info', 'info', 'Please select atleast one destination user type');
            return;
        }

        $('#main').block({
            message: '<h3>Loading...Please wait...</h3>',
            css: { border: '2px solid #ddd' }
        });
        $.ajax({
            url: '../HiDoctor_Master/MenuMaster/CopyAppMenuAccess/',
            type: "POST",
            data: "sourceUserTypeCode=" + $("#cboSourceUserType").val() + "&userTypes=" + userTypes + "&userTypeNames=" + userTypeNames,
            success: function (result) {
                if (result.split(':')[0] == "SUCCESS") {
                    $("#dvCopyPopUp").overlay().close();
                    fnMsgAlert('success', 'Success', result.split(':')[1]);
                    $("#cboSourceUserType").val('');
                    $("#cboSourceUserType").attr('selectedIndex', 0);
                    $('select#cboDestUserType > option').attr('selected', false);
                    $('#cboDestUserType').multiselect("destroy").multiselect().multiselectfilter();
                    GetActiveUserTypes();
                    fnGetMenuMappedUserTypes();
                    $("#ulMenu input[type='checkbox']").prop('checked', false);
                    $('#cboUserTypeCode').val('');
                }
                else {
                    fnMsgAlert('info', 'Error', result.split(':')[1]);
                }
            },
            error: function () {
                fnMsgAlert('info', 'Error', 'Error occured while copy the menu access');
                $('#main').unblock();
            },
            complete: function () {
                $('#main').unblock();
            }
        });
    }
}
// *************************************Start Config Screen *******************************************************************************
function fnConfigSubmit() {

    var result = fnConfigValidation();
    if (result) {
        var configName = $.trim($('#txtConfiName').val());
        var confifValue = $('#txtConfigValue').val();
        var possibleValue = $.trim($('#txtPossibleValue').val());
        var configType = $('#cboConfigType').val();
        var mode = $("#hdnMode").val();
        var configId = $("#hdnConfigID").val();
        $.ajax({
            url: '../HiDoctor_Master/MenuMaster/InsetConfigSetings/',
            type: "POST",
            data: "configName=" + configName + "&configValue=" + confifValue + "&possibleValue=" + possibleValue + "&configType=" + configType + "&mode=" + mode + "&confId=" + configId,
            success: function (result) {
                if (result.split(':')[0] == 'SUCCESS') {
                    fnMsgAlert('success', 'Success', result.split(':')[1]);
                    fnConfigClearAll();
                    fnFillConfigDetails();
                }
                else {
                    fnMsgAlert('info', 'Error', result.split(':')[1]);
                }
            },
            error: function () {
                $("#main").unblock();
            },
            complete: function () {
                $("#main").unblock();
            }
        });
    }
}

function fnConfigValidation() {

    if ($.trim($('#txtConfiName').val()) == '') {
        fnMsgAlert('info', 'Validate', 'Please enter configuration name');
        return false;
    }

    if ($.trim($('#txtConfigValue').val()) == '') {
        fnMsgAlert('info', 'Validate', 'Please enter configuration value');
        return false;
    }
    if ($.trim($('#txtPossibleValue').val()) == '') {
        fnMsgAlert('info', 'Validate', 'Please enter possible value');
        return false;
    }
    if ($.trim($('#cboConfigType').val()) == '0') {
        fnMsgAlert('info', 'Validate', 'Please enter configuration Type');
        return false;
    }

    return true
}
function fnConfigClearAll() {

    $('#txtConfiName').val('');
    $('#txtConfigValue').val('');
    $('#txtPossibleValue').val('');
    $('#cboConfigType').val('0');
    $('#hdnMode').val('INSERT');
    $('#btnConfSave').val('Save');
}



function fnFillConfigDetails() {
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/MenuMaster/fnFillConfigDetails/',
        type: "POST",
        data: "A",
        success: function (result) {
            $('#dvConfigtems').html(result)
        },
        error: function () {
            $("#main").unblock();
        },
        complete: function () {
            $("#main").unblock();
        }
    });
}



function fnConfigEdit(configId) {
    $("#hdnMode").val('EDIT');
    $('#btnConfSave').val('Edit');
    $("#hdnConfigID").val(configId);
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/MenuMaster/GetSelectedConfigDetails/',
        type: "POST",
        data: "configId=" + configId + "",
        success: function (result) {
            if (result != '' && result != undefined && result != null) {
                var jsonResult = eval('(' + result + ')');
                if (jsonResult.length > 0) {

                    $('#txtConfiName').val(jsonResult[0].Config_Key);
                    $('#txtConfigValue').val(jsonResult[0].Config_Value);
                    $('#txtPossibleValue').val(jsonResult[0].Possible_Values);
                    $('#cboConfigType').val(jsonResult[0].Type);
                }
            }
            $('#dvPanel').tabs('option', 'selected', 0);
        },
        error: function () {
            $("#main").unblock();
        },
        complete: function () {
            $("#main").unblock();
        }
    });
}

//App Menu Master
function fnAppMenuSubmit() {
    var result = fnValidate();

    if (result) {
        var menuText = $.trim($('#txtMenuText').val());
        var MenuLevel = $('input[name="rdprojopt"]:checked').val();
        var parentMenu = $('#cboParentMenu').val();
        var menuURL = $.trim($('#txtMenuURL').val());
        var Type = $('input[name="rdType"]:checked').val();
        var Category = $('#cboCategory').val();

        $('#main').block({
            message: '<h3>Processing</h3>',
            css: { border: '2px solid #ddd' }
        });
        $.ajax({
            url: '../HiDoctor_Master/MenuMaster/InsertAppMenuMaster/',
            type: "POST",
            data: "menuText=" + menuText + "&MenuLevel=" + MenuLevel + "&parentMenu=" + parentMenu + "&menuURL=" + menuURL + "&Type=" + Type + "&Category="
                   + Category + "&mode=" + $("#hdnMode").val(),
            success: function (result) {
                if (result.split(':')[0] == 'SUCCESS') {
                    fnMsgAlert('success', 'Success', result.split(':')[1]);
                    fnClearAll();
                    fnFillMenuDetails();
                }
                else {
                    fnMsgAlert('info', 'Error', result.split(':')[1]);
                }
            },
            error: function () {
                $("#main").unblock();
            },
            complete: function () {
                $("#main").unblock();
            }
        });
    }
}

// *************************************End Config Screen***************************************************************************************


