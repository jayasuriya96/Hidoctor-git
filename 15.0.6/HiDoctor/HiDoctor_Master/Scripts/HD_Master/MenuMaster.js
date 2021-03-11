
function fnFillParentMenu() {
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/MenuMaster/GetParentMenuItems/',
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

function fnFillFeatureNames() {
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/MenuMaster/GetFeatureMaster/',
        type: "POST",
        data: "A",
        success: function (result) {
            $('#cboFeatureName').html(result)
        },
        error: function () {
            $("#main").unblock();
        },
        complete: function () {
            $("#main").unblock();
        }
    });
}



function fnFillMenuDetails() {
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/MenuMaster/GetMenuDetails/',
        type: "POST",
        data: "A",
        success: function (result) {
            $('#dvMenuItems').html(result)
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
    $("#hdnMode").val('EDIT');
    $('#btnSave').val('Update');
    $("#hdnMenuId").val(menuId);
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/MenuMaster/GetSelectedMenuDetails/',
        type: "POST",
        data: "menuId=" + menuId + "",
        success: function (result) {
            if (result != '' && result != undefined && result != null) {
                var jsonResult = eval('(' + result + ')');
                if (jsonResult.length > 0) {
                    $('#txtMenuText').val(jsonResult[0].Menu_Text);
                    $('#cboParentMenu').val(jsonResult[0].Parent_Id);
                    $('#txtMenuURL').val(jsonResult[0].Menu_URL);
                    $('#txtMMOrder').val(jsonResult[0].MM_Order);
                    $('#txtSMOrder').val(jsonResult[0].SM_Order);
                    $('input[name="rdIsReport"][value=' + jsonResult[0].Is_Report + ']').prop('checked', true);
                    $('input[name="rdIsPrint"][value=' + jsonResult[0].IsPrint + ']').prop('checked', true);
                    $('input[name="rdIsExcel"][value=' + jsonResult[0].IsExcelExport + ']').prop('checked', true);
                    $('input[name="rdIsChart"][value=' + jsonResult[0].IsChart + ']').prop('checked', true);
                    $('input[name="rdIsDrillDown"][value=' + jsonResult[0].IsDrillDown + ']').prop('checked', true);
                    $('input[name="rdIsMultiUser"][value=' + jsonResult[0].IsMultiUser + ']').prop('checked', true);
                    $('#cboReportCategory').val(jsonResult[0].Report_Category);
                    $('#txtDescription').val(jsonResult[0].Description);
                    $('#cboFeatureName').val(jsonResult[0].Feature_Code);
                    $('#txtMenuKeyWords').val(jsonResult[0].Menu_Key_Words);
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
    var result = fnValidate();

    if (result) {
        var menuText = $.trim($('#txtMenuText').val());
        var parentMenu = $('#cboParentMenu').val();
        var menuURL = $.trim($('#txtMenuURL').val());
        var mmOrder = $.trim($('#txtMMOrder').val());
        var smOrder = $('#txtSMOrder').val();
        var isReport = $('input[name="rdIsReport"]:checked').val();
        var isPrint = $('input[name="rdIsPrint"]:checked').val();
        var isExcel = $('input[name="rdIsExcel"]:checked').val();
        var isChart = $('input[name="rdIsChart"]:checked').val();
        var isDrillDown = $('input[name="rdIsDrillDown"]:checked').val();
        var isMultiUser = $('input[name="rdIsMultiUser"]:checked').val();
        var reportCategory = $('#cboReportCategory').val();
        var description = $.trim($('#txtDescription').val());
        var featureCode = $('#cboFeatureName').val();
        var menuKeyWords = $('#txtMenuKeyWords').val();
        var ProjectName = $('input[name="rdprojopt"]:checked').val();
        $('#main').block({
            message: '<h3>Processing</h3>',
            css: { border: '2px solid #ddd' }
        });
        $.ajax({
            url: '../HiDoctor_Master/MenuMaster/InsertMenuMaster/',
            type: "POST",
            data: "menuText=" + menuText + "&parentMenu=" + parentMenu + "&menuURL=" + menuURL + "&mmOrder=" + mmOrder + "&smOrder="
                + smOrder + "&isReport=" + isReport + "&isPrint=" + isPrint + "&isExcel=" + isExcel + "&isChart=" + isChart + "&isDrillDown="
                + isDrillDown + "&isMultiUser=" + isMultiUser + "&reportCategory=" + reportCategory + "&description=" + description
                + "&featureCode=" + featureCode + "&menuKeyWords=" + menuKeyWords + "&ProjectName=" + ProjectName + "&mode=" + $("#hdnMode").val() + "&menuId=" + $('#hdnMenuId').val() + "",
            success: function (result) {
                if (result.split(':')[0] == 'SUCCESS') {
                    fnMsgAlert('success', 'Success', result.split(':')[1]);
                    fnClearAll();
                    fnFillMenuDetails();
                    fnFillParentMenu();
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
        fnMsgAlert('info', 'Validate', 'Please enter menu title');
        return false;
    }
    else {
        var specialCharregex = new RegExp("^[a-zA-Z0-9:()' '-._]+$");
        if (!specialCharregex.test($.trim($('#txtMenuText').val()))) {
            fnMsgAlert('info', 'Information', 'Please remove the special characters from menu title.');
            return false;
        }
    }

    if ($('#cboParentMenu').val() == '') {
        fnMsgAlert('info', 'Validate', 'Please select parent menu');
        return false;
    }
    if ($.trim($('#txtMenuURL').val()) == '') {
        //if ($('#cboParentMenu').val() != '0') {
        //    fnMsgAlert('info', 'Validate', 'Please enter file name');
        //    return false;
        //}
    }
    else {
        if ($('#cboParentMenu').val() == '0') {
            fnMsgAlert('info', 'Validate', 'File name should not be given for parent menu');
            return false;
        }
    }
    if ($.trim($('#txtMenuURL').val()) != '') {
        var specialCharregex = new RegExp(/[*&%$^#<>+=~`""|]/g);

        //var specialCharregex = new RegExp("^[:a-zA-Z0-9_\/]+$");
        if (specialCharregex.test($.trim($('#txtMenuURL').val()))) {
            //if (!(specialCharregex($.trim($("#txtMenuURL").val())))) {
            fnMsgAlert('info', 'Information', 'Please remove the special characters from menu URl.Minus,Full Stop,Question Mark,Slash only allowed.');
            return false;
        }
    }
    if ($.trim($('#txtMMOrder').val()) == '') {
        fnMsgAlert('info', 'Validate', 'Please enter MM Order');
        return false;
    }
    else {
        if (isNaN($.trim($('#txtMMOrder').val()))) {
            fnMsgAlert('info', 'Validate', 'Please enter numbers alone in MM Order');
            return false;
        }
    }

    if ($.trim($('#txtSMOrder').val()) == '') {
        fnMsgAlert('info', 'Validate', 'Please enter SM Order');
        return false;
    }
    else {
        if (isNaN($.trim($('#txtSMOrder').val()))) {
            fnMsgAlert('info', 'Validate', 'Please enter numbers alone in SM Order');
            return false;
        }
    }
    if ($('input[name="rdIsReport"]:checked').val() == "1") {
        if ($('#cboReportCategory').val() == '') {
            fnMsgAlert('info', 'Validate', 'Please select report category');
            return false;
        }
    }
    if ($.trim($('#txtDescription').val()) != '') {
        var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._&%#!;{}*-\/,`=?]+$");
        if (!specialCharregex.test($.trim($('#txtDescription').val()))) {
            fnMsgAlert('info', 'Information', 'Please remove the special characters from description.');
            return false;
        }
    }
    if ($.trim($('#txtMenuKeyWords').val()) != '') {
        var specialCharregex = new RegExp("^[a-zA-Z0-9()' '.,_]+$");
        if (!specialCharregex.test($.trim($('#txtMenuKeyWords').val()))) {
            fnMsgAlert('info', 'Information', 'Please remove the special characters from menu key words.');
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

function fnShowReportDetails() {
    if ($('input[name="rdIsReport"]:checked').val() == "1") {
        $('#dvReportDetails').show();
    }
    else {
        $('#dvReportDetails').hide();
        $('input[name="rdIsPrint"][value=N]').prop('checked', true);
        $('input[name="rdIsExcel"][value=N]').prop('checked', true);
        $('input[name="rdIsChart"][value=N]').prop('checked', true);
        $('input[name="rdIsDrillDown"][value=N]').prop('checked', true);
        $('input[name="rdIsMultiUser"][value=N]').prop('checked', true);
    }
}

function fnClearAll() {
    $('#txtMenuText').val('');
    $('#cboParentMenu').val('');
    $('#txtMenuURL').val('');
    $('#txtMMOrder').val('');
    $('#txtSMOrder').val('');
    $('input[name="rdIsReport"][value=0]').prop('checked', true);
    $('input[name="rdIsPrint"][value=N]').prop('checked', true);
    $('input[name="rdIsExcel"][value=N]').prop('checked', true);
    $('input[name="rdIsChart"][value=N]').prop('checked', true);
    $('input[name="rdIsDrillDown"][value=N]').prop('checked', true);
    $('input[name="rdIsMultiUser"][value=N]').prop('checked', true);
    $('#cboReportCategory').val('');
    $('#txtDescription').val('');
    $('#cboFeatureName').val('');
    $('#txtMenuKeyWords').val('');
    $('#hdnMode').val('INSERT');
    $('#hdnMenuId').val('');
    $('#dvReportDetails').hide();
    $('#btnSave').val('Save');
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

function fnFillUserType() {
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/MenuMaster/GetUserTypes/',
        type: "POST",
        data: "A",
        success: function (result) {
            $('#cboUserTypeCode').html(result)
        },
        error: function () {
            $("#main").unblock();
        },
        complete: function () {
            $("#main").unblock();
        }
    });
}


function fnGetMenuAccess() {
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/MenuMaster/GetMenuItems/',
        type: "POST",
        data: "A",
        success: function (result) {
            $('#dvMenus').html(result);
            $('.btnSave').show();
            $('#ulMenu').checkboxTree({
                onCheck: {
                    node: 'expand'
                },
                onUncheck: {
                    node: 'collapse'
                },
                collapseImage: 'Content/images/downArrow.gif',
                expandImage: 'Content/images/rightArrow.gif'

            });
        },
        error: function () {
            $("#main").unblock();
        },
        complete: function () {
            $("#main").unblock();
        }
    });
}

function fnGetAppMenuAccess() {
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/MenuMaster/GetAppMenuAccessItems/',
        type: "POST",
        data: "A",
        success: function (result) {
            //alert(result);
            $('#dvMenus').html(result);
            $('.btnSave').show();
            $('#ulMenu').checkboxTree({
                onCheck: {
                    node: 'expand'
                },
                onUncheck: {
                    node: 'collapse'
                },
                collapseImage: 'Content/images/downArrow.gif',
                expandImage: 'Content/images/rightArrow.gif'

            });
        },
        error: function () {
            $("#main").unblock();
        },
        complete: function () {
            $("#main").unblock();
        }
    });
}

function fnGetUserTypeMenuAccess() {
    //$("#ulMenu input[type='checkbox']").each(function (i) {
    //    $(this).prop("checked", false);
    //    // $(this).checked = false;
    //});
    $("#ulMenu input[type='checkbox']").prop('checked', false);
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/MenuMaster/GetUserTypeMenuAccess/',
        type: "POST",
        data: "userTypeCode=" + $('#cboUserTypeCode').val() + "",
        success: function (result) {
            if (result != '' && result != undefined && result != null) {
                var jsonResult = eval('(' + result + ')');
                for (var a = 0; a < jsonResult.length; a++) {

                    $("#ulMenu input[type='checkbox'][value='" + jsonResult[a].Menu_Id + "']").prop('checked', true)
                    //$("#ulMenu input[type='checkbox']").each(function (i) {
                    //    
                    //    if ($(this).val() == jsonResult[a].Menu_Id) {
                    //        //$(this).attr("checked", "true");
                    //        $(this).checked = true;
                    //    }
                    //});
                }
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


function fnGetAppUserTypeMenuAccess() {
    //$("#ulMenu input[type='checkbox']").each(function (i) {
    //    $(this).prop("checked", false);
    //    // $(this).checked = false;
    //});
    $("#ulMenu input[type='checkbox']").prop('checked', false);
    $('#main').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/MenuMaster/GetAppUserTypeMenuAccess/',
        type: "POST",
        data: "userTypeCode=" + $('#cboUserTypeCode').val() + "",
        success: function (result) {
            if (result != '' && result != undefined && result != null) {
                var jsonResult = eval('(' + result + ')');
                for (var a = 0; a < jsonResult.length; a++) {

                    $("#ulMenu input[type='checkbox'][value='" + jsonResult[a].Menu_Id + "']").prop('checked', true)
                    //$("#ulMenu input[type='checkbox']").each(function (i) {
                    //    
                    //    if ($(this).val() == jsonResult[a].Menu_Id) {
                    //        //$(this).attr("checked", "true");
                    //        $(this).checked = true;
                    //    }
                    //});
                }
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

// *************************************End Config Screen***************************************************************************************


