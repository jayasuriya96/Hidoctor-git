//Created By:Sumathi
//Date:3/6/2014

//---------------Start PrivilegeMaster----------------------------------------//
function fnGetPrivilegeMaster(val) {
    $('#dvTabs').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/PrivilegeMaster/GetPrivilegeMaster',
        type: "POST",
        data: "searchName=" + val + "",
        success: function (result) {
            if (result != '') {
                $("#dvprivilegeMaster").html(result);
                $('#dvTabs').unblock();
            }
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
            $('#dvTabs').unblock();
        },
        complete: function () {
            $('#dvTabs').unblock();
        }
    });
}
//Litral Values
function fnGetLiteralValues() {
    $('#dvTabs').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/PrivilegeMaster/GetLiteralName',
        type: "GET",
        success: function (result) {
            if (result != '') {
                $("#chkliteral").html(result);
                $('#dvTabs').unblock();
            }
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
            $('#dvTabs').unblock();
        },
        complete: function () {
            $('#dvTabs').unblock();
        }
    });
}
//Get Grid
function fnGetFeature() {
    $('#dvTabs').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/PrivilegeMaster/GetFeatureName',
        type: "GET",
        success: function (result) {
            if (result != '') {
                $("#tblFeature").html(result);
                $('#dvTabs').unblock();
            }
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
            $('#dvTabs').unblock();
        },
        complete: function () {
            $('#dvTabs').unblock();
        }
    });
}

function fnsearch() {
    var searchName = $('#txtsearch').val();
    fnGetPrivilegeMaster(searchName);
}
//AutoFill the BasePrivilegeName
function fnGetBasePrivilegeName() {
    $.ajax({
        url: '../HiDoctor_Master/PrivilegeMaster/GetBasePrivilegeName',
        type: "POST",
        data: "A",
        success: function (jsData) {
            jsData = eval('(' + jsData + ')');
            if (jsData.length > 0) {
                var basePrivilegeName = "[";
                for (var i = 0; i < jsData.length; i++) {
                    basePrivilegeName += "{label:" + '"' + "" + jsData[i].Privilege_Name + "" + '",' + "value:" + '"' + "" + jsData[i].Privilege_Code + "" + '"' + "}";
                    if (i < jsData.length - 1) {
                        basePrivilegeName += ",";
                    }
                }
                basePrivilegeName += "];";
                basePrivilegeNameJson_g = eval(basePrivilegeName);
                autoComplete(basePrivilegeNameJson_g, "txtBasePrivilegeName", "hdnBaseprivilegeCode", "Groupname");
            }
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
        }
    });
}

function fncheckRadio(val) {
    var value = val;
    if (value == '1') {
        $('#rdoLookup').show();
        $('#rdoLiteral').hide();
    }
    else {
        $('#rdoLookup').hide();
        $('#rdoLiteral').show();
    }
}

//Check LiteralValues
function fnChecklitral() {
    var val = [];
    var i = 0;
    var chkPriviliegeValue;
    $(':checkbox:checked').each(function (i) {
        val[i] = $(this).val();
        chkPriviliegeValue += val[i] + ',';
    });
}

//Check Feature
function fnCheckFeature() {
    var val = [];
    var chkFeatureCode;
    var i = 0;
    $(':checkbox:checked').each(function (i) {
        val[i] = $(this).val();
        chkFeatureCode += val[i] + ',';
    });
}

//Add LitralValue
function fnAddlitral() {
    var litralValue = "";
    if ($.trim($("#txtlitral").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Please Enter The Literal Value');
        return false;
    }

    var words = ["!", "@", "#", "$", "%", "^", "&", "(", ")", "{", "=", "[", "}", "]", ">", "<",";",":","|"];
    var passwords = new Array();
    passwords =$("#txtlitral").val();
    for (var c = 0; c<= passwords.length; c++) {
        var a = words.indexOf(passwords[c]);
        if (a >= 0) {
            fnMsgAlert('info', 'Info', 'Special characters are not allowed in Literal Name.Minus,Plus,Underscore,Space,Comma,Full Stop,Question Mark,Slash only allowed.');
            return false;
        }
    }
    

    if ($.trim($("#txtlitral").val()).length > 500) {
        fnMsgAlert('info', 'Info', 'Literal Name should not exceed 500 Characters');
        return false;
    }
    if (litralValue != null) {
        $.ajax({
            url: '../HiDoctor_Master/PrivilegeMaster/checkLitralValue',
            type: "POST",
            data: { litralValue: $.trim($("#txtlitral").val()).toUpperCase() },
            success: function (result) {
                if (result == "SUCCESS") {
                    fnInsertLitralValue($.trim($("#txtlitral").val()).toUpperCase());
                }
                else {
                    fnMsgAlert('info', 'Information', result);
                    return;
                }
            },
            error: function (e) {
                fnMsgAlert('info', '', 'Error.' + e.Message);
            }
        });
    }
}

//Insert the Litral Value
function fnInsertLitralValue(litralValue) {
    $.ajax({
        url: '../HiDoctor_Master/PrivilegeMaster/InsertLitralValue',
        type: "POST",
        data: { litralValue: litralValue },
        success: function (result) {
            if (result.split(':')[0] == "SUCCESS") {
                fnMsgAlert('success', 'Success', result.split(':')[1]);
                $('#txtlitral').val('');
                fnGetLiteralValues();
            }
            else {
                fnMsgAlert('info', 'Error', result.split(':')[1]);
                $('#txtlitral').val('');
                fnGetLiteralValues();
            }
            $('#txtlitral').val('');
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
        }
    });
    $('#txtlitral').val('');
}

//Edit
function fnEditprivilegeMaster(tblprivilegeCode) {
    var privilegeCode = "";
    var privilegeName = "";
    var featureCodeArr = "";
    var valueType = "";
    var editFeaturecodeArr = "";
    privilegeCode = tblprivilegeCode.split('|')[0];
    privilegeName = tblprivilegeCode.split('|')[1];

    $('#hdnPrivilegeCode').val(privilegeCode);
    $('#txtPrivilegeName').val($('#priName_' + privilegeName).html());
    $('#txtBasePrivilegeName').val($('#basePrivilege_' + privilegeCode).html());
    $('#txtDescription').val($('#descri_' + privilegeCode).html());


    valueType = $('#ValueType_' + privilegeCode).html();
    if (valueType.toUpperCase() == "LOOKUP") {
        $('input:radio[id=optLookup]').prop('checked', true);
        $('#rdoLookup').show();
        $('#rdoLiteral').hide();
    }
    else {
        $('input:radio[id=optlitral]').prop('checked', true);
        var status = $('input:radio[id=optlitral]').prop('checked', true);
        $('#rdoLookup').hide();
        $('#rdoLiteral').show();
    }

    $("input:checkbox[name=chkFeature]").prop('checked', false);
    featureCodeArr = $('#featureCode_' + privilegeCode).html();
    editFeaturecodeArr = featureCodeArr.split(',');
    for (var i = 0 ; i < editFeaturecodeArr.length ; i++) {
        $('input:checkbox[name=chkFeature]').each(function () {
            if (this.value == editFeaturecodeArr[i]) {
                this.checked = true;
            }
        });
    }

    fnGetPrivilegeCodeforLitral(privilegeCode, valueType);
    $('#dvTabs').tabs('option', 'selected', 0);
    $("#btnSave").val('Update');
    $("#hdnMode").val("E");
    $('#txtPrivilegeName').focus();
}

function fnGetPrivilegeCodeforLitral(privilegeCode, valueType) {
    var tblprivlegeCode = privilegeCode;
    if (tblprivlegeCode != null) {
        $.ajax({
            url: '../HiDoctor_Master/PrivilegeMaster/GetPrivilegeMasterbyPrivilegeCode',
            type: "POST",
            data: "privilegeCode=" + tblprivlegeCode + "",
            success: function (jsData) {
                if (jsData != '') {
                    var jsonDatas = eval('(' + jsData + ')');
                    if (jsonDatas.length > 0) {
                        if (valueType.toUpperCase() == "LOOKUP") {
                            $("#ddlLookUpTable option[value='" + jsonDatas[0].Value + "']").attr("selected", true);
                            var tablename = jsonDatas[0].Value;
                            var columnName = jsonDatas[0].Text;
                            if (tablename.length > 0) {
                                $.ajax({
                                    url: '../HiDoctor_Master/PrivilegeMaster/GetColumNames',
                                    type: "POST",
                                    data: "tableName=" + tablename + "",
                                    success: function (result) {
                                        if (result != '') {
                                            jsonresult = eval('(' + result + ')');
                                            var selectcolumn = $("#ddlLookupColumn");
                                            $("#ddlLookupColumn option").remove();
                                            selectcolumn.append("<option value=0>-Select Column-</option>");
                                            for (var i = 0; i < jsonresult.length; i++) {
                                                selectcolumn.append("<option value=" + jsonresult[i].Value + ">" + jsonresult[i].Text + "</option>");
                                            }
                                            for (var i = 0; i < jsonDatas.length; i++) {
                                                $('#ddlLookupColumn').val(jsonDatas[i].Text);
                                            }
                                        }
                                    }
                                });
                            }
                        }
                        else {
                            $("input:checkbox[name=chkLitral]").prop('checked', false);
                            for (var i = 0 ; i < jsonDatas.length; i++) {
                                var privilegeValueCodes = '';
                                privilegeValueCodes = jsonDatas[i].Privilege_Value_Code;
                                $("input:checkbox[name=chkLitral]").each(function () {
                                    if (this.value == privilegeValueCodes) {
                                        this.checked = true;
                                    }
                                });
                            }
                        }
                    }
                }
            },
            error: function (e) {
                fnMsgAlert('info', '', 'Error.' + e.Message);
            },
            complete: function () {
            }
        });
    }
}
//Table Changes
function fnLookup_Tablechange() {
    var tableName = $("#ddlLookUpTable option:selected").val();
    fnGetColumnNames(tableName)
}
//Get column name for LookUp table changes
function fnGetColumnNames(val) {
    var tableName = val;
    if (tableName != null) {
        $.ajax({
            url: '../HiDoctor_Master/PrivilegeMaster/GetColumNames',
            type: "POST",
            data: "tableName=" + tableName + "",
            success: function (jsData) {
                if (jsData != '') {
                    jsData = eval('(' + jsData + ')');
                    var selectcolumn = $("#ddlLookupColumn");
                    $("#ddlLookupColumn option").remove();
                    selectcolumn.append("<option value=0>-Select Column-</option>");
                    for (var i = 0; i < jsData.length; i++) {
                        selectcolumn.append("<option value=" + jsData[i].Value + ">" + jsData[i].Text + "</option>");
                    }
                }
            },
            error: function (e) {
                fnMsgAlert('info', '', 'Error.' + e.Message);
            },
            complete: function () {
            }
        });
    }
}
//Validation
function fnSubValidate() {
    if ($.trim($("#txtPrivilegeName").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Please Enter The Privilege Name');
        return false;
    }

    if ($('input[name=rptOptions]:checked').length <= 0) {
        fnMsgAlert('info', 'Info', 'Please select any Privilege Value Type');
        return false;
    }

    if ($.trim($("#txtPrivilegeName").val()).length > 100) {
        fnMsgAlert('info', 'Info', 'Privilege Name should not exceed 100 Characters');
        return false;
    }

    if (!(isNaN($("#txtPrivilegeName").val()))) {
        fnMsgAlert('info', 'Info', 'Enter The valid Privilege Name');
        return false;
    }

    if (!(regExforAllowingUnderscorewithoutSpace($.trim($("#txtPrivilegeName").val())))) {
        fnMsgAlert('info', 'Info', 'Alphapets,Numeric and Underscore only allowed.');
        return false;
    }

    if ($.trim($("#txtDescription").val()).length > 500) {
        fnMsgAlert('info', 'Info', 'Description should not exceed 500 Characters');
        return false;
    }

    privilegeValueType = $('input:radio[name=rptOptions]:checked').val();
    if (privilegeValueType.toUpperCase() == "LOOKUP") {
        if ($('#ddlLookUpTable').val() == '0') {
            fnMsgAlert('info', 'Info', 'Please Select Lookup Table Name');
            return false;
        }

        if ($('#ddlLookupColumn').val() == '0') {
            fnMsgAlert('info', 'Info', 'Please Select Lookup Column Name');
            return false;
        }
    }
    else {
        if ($("input:checkbox[name=chkLitral]:checked").length == 0) {
            fnMsgAlert('info', 'Info', 'Please Check any Literal');
            return false;
        }
    }
    return true;
}
//save 
function fnsavePrivilege() {
    var result = fnSubValidate()
    if (result) {
        $('#dvTabs').tabs('option', 'selected', 0);
        var editPrivilegeCode = '', privilegeName = '', BaseprivilegeName = '', BasePrivilegecode = '', Featurecode = '', Description = '', privilegeValueType = '', LookupTableName = '', LookUpColumnName = '', LitralValue = '';
        privilegeName = $.trim($("#txtPrivilegeName").val()).toUpperCase();
        BaseprivilegeName = $('#txtBasePrivilegeName').val();
        editPrivilegeCode = $('#hdnPrivilegeCode').val();
        var disJson = jsonPath(basePrivilegeNameJson_g, "$.[?(@.label=='" + $("#txtBasePrivilegeName").val() + "')]");

        if (disJson != false) {
            $("#hdnBaseprivilegeCode").val(disJson[0].value)
        }
        else {
            $("#hdnBaseprivilegeCode").val('');
        }

        if ($("#txtBasePrivilegeName").val() != '') {
            if ($("#hdnBaseprivilegeCode").val() == '') {
                fnMsgAlert('info', 'Info', 'Please Choose the valid Base Privilege Name');
                return false;
            }
        }
        var BasePrivilegecode = $('#hdnBaseprivilegeCode').val();
        $("input:checkbox[name=chkFeature]").each(function () {
            if (this.checked) {
                var id = this.id;
                Featurecode += this.value + ",";
                Featurecode += $("#" + id.replace("td", "chkFeature")).html();
            }
        });

        Description = $.trim($("#txtDescription").val());
        privilegeValueType = $('input:radio[name=rptOptions]:checked').val();
        if (privilegeValueType.toUpperCase() == "LOOKUP") {
            LookupTableName = $("#ddlLookUpTable option:selected").val();
            LookUpColumnName = $("#ddlLookupColumn option:selected").val();
        }
        else {
            $("input:checkbox[name=chkLitral]").each(function () {
                if (this.checked) {
                    var id = this.id;
                    LitralValue += this.value + ",";
                    LitralValue += $("#" + id.replace("td", "chkLitral")).html();
                }
            });
        }
        mode = $("#hdnMode").val();
        $('#dvTabs').block({
            message: '<h3>Loading...</h3>',
            css: { border: '2px solid #ddd' }
        });
        $.ajax({
            url: '../HiDoctor_Master/PrivilegeMaster/checkPrivilegeName',
            type: "POST",
            data: "privilegeName=" + privilegeName + "&privilegeCode=" + editPrivilegeCode,
            success: function (result) {
                if (result == "SUCCESS") {
                    fnInsertPrivilegeValue(privilegeName, BaseprivilegeName, BasePrivilegecode, Featurecode, Description, privilegeValueType, LookupTableName, LookUpColumnName, mode, LitralValue, editPrivilegeCode);
                }
                else {
                    fnMsgAlert('info', 'Information', result);
                    return;
                }
            },
            error: function (e) {
                fnMsgAlert('info', '', 'Error.' + e.Message);
                $('#dvTabs').unblock();
            },
            complete: function () {
                $('#dvTabs').unblock();
            }
        });
    }
}

function fnInsertPrivilegeValue(privilegeName, BaseprivilegeName, BasePrivilegecode, Featurecode, Description, privilegeValueType, LookupTableName, LookUpColumnName, mode, LitralValue, editPrivilegeCode) {
    mode = $("#hdnMode").val();
    $('#dvTabs').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/PrivilegeMaster/InsertandUpdatethePrivilegeMaster',
        type: "POST",
        data: "privilegeName=" + privilegeName + "&BaseprivilegeName=" + BaseprivilegeName
                + "&BasePrivilegecode=" + BasePrivilegecode + "&Featurecode=" + Featurecode + "&Description=" + Description
                + "&privilegeValueType=" + privilegeValueType + "&LookupTableName=" + LookupTableName + "&LookUpColumnName=" + LookUpColumnName
                + "&LitralValues=" + LitralValue + "&mode=" + mode + "&editPrivilegeCode=" + editPrivilegeCode,
        success: function (data) {
            if (data.split(':')[0] == "SUCCESS") {
                fnMsgAlert('info', 'Success', data.split(':')[1]);
                fnClearAllprivilegeMaster();
                fnGetPrivilegeMaster();
                $('#dvTabs').unblock();
            }
            else {
                fnMsgAlert('info', 'Error', data.split(':')[1]);
                fnClearAllprivilegeMaster();
                fnGetPrivilegeMaster();
                $('#dvTabs').unblock();
            }
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
            $('#dvTabs').unblock();
        },
        complete: function () {
            $('#dvTabs').unblock();
        }
    });
}

function fnClearAllprivilegeMaster() {
    $("#txtPrivilegeName").val('');
    $("#txtBasePrivilegeName").val('');
    $("#txtDescription").val('');
    $("#ddlLookUpTable").val('0');
    $('#ddlLookupColumn').val('0');
    $('#txtlitral').val('');
    $('#hdnPrivilegeCode').val('');
    $('input:radio[name=rptOptions][value=LOOKUP]').prop('checked', false);
    $('input:radio[name=rptOptions][value=LITERAL]').prop('checked', false);

    $("input:checkbox[name=chkFeature]").each(function () {
        if (this.checked) {
            this.checked = false;
        }
    });

    $("input:checkbox[name=chkLitral]").each(function () {
        if (this.checked) {
            this.checked = false;
        }
    });
    $('#rdoLookup').hide();
    $('#rdoLiteral').hide();
    if ($("#btnSave").val() == 'Update') {
        $("#btnSave").val('Save');
    }
    else {
        $("#btnSave").val('Save');
    }
    $("#hdnMode").val("I");
}
//-------------------------End PrivilegeMaster--------------------------------//

//************************ Privilege Mapping *******************************//
var arrPrivilegeCodes = new Array();
var arrPrivilegeNames = new Array();
var privilegeType_g = "";
function fnGetchkPrivilegeValues(sid) {
    var id = sid.id;
    if ($(sid).val() != '') {
        var privilegeValueCode = $(sid).val();
        var privilegeValueName = $.trim($("#" + id.replace("td", "td_Value")).html());
        if ($.inArray(privilegeValueCode, arrPrivilegeCodes) == -1) {
            arrPrivilegeCodes.push(privilegeValueCode);
            arrPrivilegeNames.push(privilegeValueName);
        }
        else {
            fnDeletePrivilegeCodes(id);
        }
    }
}

function fnDeletePrivilegeCodes(id) { 
    arrPrivilegeNames = [];
    arrPrivilegeCodes = [];
    $("input:checkbox[name=chkValue]").each(function () {
        if (this.checked) {
            var id = this.id;
            arrPrivilegeCodes.push($.trim(this.value));
            arrPrivilegeNames.push($.trim($("#" + id.replace("td", "td_Value")).html()));
        }
    });
}


function fnGetActivePrivileges() {
    $('#dvPanel').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/PrivilegeMaster/GetPrivileges',
        type: "GET",
        success: function (result) {
            $('#cboPrivilege option').remove();
            $('#cboSearchPrivilege option').remove();
            if (result != '') {
                $('#cboPrivilege').append("<option value=''>-Select Privilege-</option>");
                $("#cboPrivilege").append(result);
                $('#cboSearchPrivilege').append("<option value='ALL'>ALL</option>");
                $('#cboSearchPrivilege').append(result);
                //fnGetActiveUserTypes();
            }
            //fnGetUserTypePrivilegeMapping();
        },
        error: function (e) {
            $('#dvPanel').unblock();
        },
        complete: function () {
            $('#dvPanel').unblock();
        }
    });
}
function fnGetActiveUserTypes() {
    $('#cboSearchUserType option').remove();
    $('#dvPanel').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/PrivilegeMaster/GetUserTypes',
        type: "GET",
        success: function (result) {
            if (result != '') {
                $('#cboSearchUserType').append(result);
            }
            //fnGetUserTypePrivilegeMapping();
        },
        error: function (e) {
            $('#dvPanel').unblock();
        },
        complete: function () {
            $('#dvPanel').unblock();
        }
    });
}


function fnGetUserTypePrivilegeMapping() {
    $("#dvMapping").html('');
    $('#dvPanel').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/PrivilegeMaster/GetPrivilegeMapping',
        type: "GET",
        data: "privilegeCode=" + $('#cboSearchPrivilege').val() + "&userTypeCode=" + $('#cboSearchUserType').val() + "",
        success: function (result) {
            $("#dvMapping").html(result);
        },
        error: function (e) {
            $('#dvPanel').unblock();
        },
        complete: function () {
            $('#dvPanel').unblock();
        }
    });
}

function fnSDGetUserTypePrivilegeMapping() {
    $("#dvMapping").html('');
    $('#dvPanel').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/PrivilegeMaster/GetSDPrivilegeMapping',
        type: "GET",
        data: "privilegeCode=" + $('#cboSearchPrivilege').val() + "&userTypeCode=" + $('#cboSearchUserType').val() + "",
        success: function (result) {
            $("#dvMapping").html(result);
        },
        error: function (e) {
            $('#dvPanel').unblock();
        },
        complete: function () {
            $('#dvPanel').unblock();
        }
    });
}


function fnGetPrivilegeValues() {
    $('#dvPanel').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    var content = '<table style="padding: 2%;">';
    $.ajax({
        url: '../HiDoctor_Master/PrivilegeMaster/GetPrivilegeValues',
        type: "GET",
        data: "privilegeCode=" + $('#cboPrivilege').val() + "",
        success: function (result) {
            if (result != '' && result != null && result != undefined) {
                var jsonResult = eval('(' + result + ')');
                if (jsonResult.length > 0) {
                    for (var i = 0; i < jsonResult.length; i++) {
                        content += "<tr><td><input type='checkbox' class='chkprivilege' name='chkValue' value='" + jsonResult[i].Privilege_Value_Code + "' id='td_" + i + "' /></td>";
                        content += "<td id='td_Value_" + i + "'>" + jsonResult[i].Privilege_Value_Name + "</td></tr>";
                    }                    
                }
            }
            else {
                fnMsgAlert('info', 'Info', 'There is no values are mapped for the selected privilege');
                return;
            }
            content += "</table>";
            $('#dvPriValues').html(content);
            $('.chkprivilege').unbind('click').bind('click', function () { fnGetchkPrivilegeValues(this) });

            fnGetPrivilegeMasterDetails();
            $('input[name="rdStatus"][value="1"]').attr('checked', true);
        },
        error: function (e) {
            $('#dvPanel').unblock();
        },
        complete: function () {
            $('#dvPanel').unblock();
        }
    });
}

function fnGetPrivilegeMasterDetails() {
    $('#dvPanel').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });

    $.ajax({
        url: '../HiDoctor_Master/PrivilegeMaster/GetPrivilegeMasterDetails',
        type: "GET",
        data: "privilegeCode=" + $('#cboPrivilege').val() + "",
        success: function (result) {
            $('#spnDescription').html('');
            if (result != '' && result != null && result != undefined) {
                var jsonResult = eval('(' + result + ')');
                if (jsonResult.length > 0) {
                    $('#spnDescription').html(jsonResult[0].Description);
                }
            }
        },
        error: function (e) {
            $('#dvPanel').unblock();
        },
        complete: function () {
            $('#dvPanel').unblock();
        }
    });
}


function fnSummaryHide(divid, spnid) {
    if ($('.' + divid).css("display") == "none") {
        $('.' + divid).fadeIn('slow');
        $('#' + spnid).removeClass('expandPrivilege');
        $('#' + spnid).addClass('collapseDFC');
    }
    else {
        $('.' + divid).fadeOut('slow');
        $('#' + spnid).removeClass('collapseDFC');
        $('#' + spnid).addClass('expandPrivilege');
    }
}


function fnEdit(privilegeCode, userTypeCode) {
    fnClearAll();
    $('#hdnMode').val('EDIT');
    $('#cboPrivilege').attr('disabled', true);
    $('#dvPanel').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/PrivilegeMaster/GetPrivilegeDetails',
        type: "GET",
        data: "userTypeCode=" + userTypeCode + "&privilegeCode=" + privilegeCode + "",
        success: function (result) {
            if (result != '' && result != null && result != undefined) {
                var jsonResult = eval('(' + result + ')');
                if (jsonResult.length > 0) {
                    $('#cboPrivilege').val(jsonResult[0].Privilege_Code);
                    $.ajax({
                        url: '../HiDoctor_Master/PrivilegeMaster/GetPrivilegeValues',
                        type: "GET",
                        data: "privilegeCode=" + jsonResult[0].Privilege_Code + "",
                        success: function (priResult) {
                            var content = "<table>";
                            if (priResult != '' && priResult != null && priResult != undefined) {
                                var jsonValues = eval('(' + priResult + ')');
                                if (jsonValues.length > 0) {
                                    for (var i = 0; i < jsonValues.length; i++) {
                                        content += "<tr><td><input type='checkbox' class='chkprivilege' name='chkValue' value='" + jsonValues[i].Privilege_Value_Code + "' id='td_" + i + "' /></td>";
                                        content += "<td id='td_Value_" + i + "'>" + jsonValues[i].Privilege_Value_Name + "</td></tr>";
                                    }
                                }
                            }
                            content += "</table>";

                            $('#dvPriValues').html(content);
                            $('.chkprivilege').unbind('click').bind('click', function () { fnGetchkPrivilegeValues(this) });                      
                            var privilegeValueCodes = jsonResult[0].Privilege_Value_Code.split(',');
                            var privilegeValueNames = jsonResult[0].Privilege_Value_Name.split(',');
                            arrPrivilegeCodes = privilegeValueCodes;
                            arrPrivilegeNames = privilegeValueNames;
                            privilegeType_g = jsonResult[0].Privilege_Value_Type;
                            if (jsonResult[0].Privilege_Value_Type != 'LOOKUP') {
                                for (var j = 0; j < privilegeValueCodes.length; j++) {
                                    $("input:checkbox[name=chkValue]").each(function () {
                                        if ($.trim(this.value) == $.trim(privilegeValueCodes[j])) {
                                            this.checked = true;
                                        }
                                        //else {
                                        //    this.checked = false;
                                        //}
                                    });
                                }
                            }
                            else {
                                for (var j = 0; j < privilegeValueNames.length; j++) {
                                    $("input:checkbox[name=chkValue]").each(function () {
                                        var id = this.id
                                        if ($.trim($("#" + id.replace("td", "td_Value")).html().toUpperCase()) == $.trim(privilegeValueNames[j].toUpperCase())) {
                                            //  alert($("#" + id.replace("td", "td_Value")).html().toUpperCase());
                                            // alert(privilegeValueNames[j].toUpperCase());
                                            // this.checked = true;
                                            $("#" + id).attr('checked', true);
                                        }
                                        //else {
                                        //    this.checked = false;
                                        //}
                                    });
                                }
                            }
                            $('#spnDescription').html(jsonResult[0].Description);
                            $('#txtRequestFrom').val(jsonResult[0].Request_From);
                            $('#txtRequestDate').val(jsonResult[0].Request_Date);
                            $('#txtSupportUser').val(jsonResult[0].Support_User_Name);
                            $('#txtRequestReason').val(jsonResult[0].Request_Reason);
                            var userTypeCode = jsonResult[0].User_Type_Code;
                            if (jsonResult[0].Record_Status == "1") {
                                $('input[name="rdStatus"][value="1"]').prop('checked', true);
                            }
                            else {
                                $('input[name="rdStatus"][value="0"]').prop('checked', true);
                            }
                            $("#dvUserTypeTree").dynatree("getRoot").visit(function (node) {
                                node.data.unselectable = false;
                                node.data.hideCheckbox = false;
                                if (userTypeCode == node.data.key) {
                                    node.select(true);
                                }
                                else {
                                    node.data.unselectable = true;
                                    node.data.hideCheckbox = true;
                                }
                            });
                            $('#dvPanel').tabs('option', 'selected', 0);
                        },
                        error: function (e) {
                            fnMsgAlert('info', 'Info', 'Error while fetching the data');
                        },
                        complete: function () {
                        }
                    });

                }
            }
        },
        error: function (e) {
            $('#dvPanel').unblock();
        },
        complete: function () {
            $('#dvPanel').unblock();
        }
    });
}

function fnClearAll() {
    $('#cboPrivilege').attr('disabled', false);
    $('#cboPrivilege').val('');
    $('#spnDescription').html('');
    $('#txtRequestFrom').val('');
    $('#txtRequestDate').val('');
    $('#txtSupportUser').val('');
    $('#txtRequestReason').val('');
    $("#dvUserTypeTree").dynatree("getRoot").visit(function (node) {
        node.select(false);
        node.data.unselectable = false;
        node.data.hideCheckbox = false;
    });
    $('#dvPriValues').html('');
    $("#hdnMode").val('INSERT');
    $('input[name="rdStatus"][value="1"]').attr('checked', true);

    arrPrivilegeNames = [];
    arrPrivilegeCodes = [];
    privilegeType_g = "";
}


function fnSubmit() {
    debugger;
    var result = fnValidate();
    if (result) {
        var privilegeCode = '', privilegeName = '', privilegeValueCode = '', privilegeValueName = '', description = '', requestFrom = '', requestDate = '',
            requestReason = '', supportUser = '',
            status = '', userTypeCodes = '', userTypeNames = '', mode = '';
        privilegeCode = $('#cboPrivilege').val();
        privilegeName = $("#cboPrivilege option:selected").text();
        status = $('input[name="rdStatus"]:checked').val();

        for (var s = 0 ; s < arrPrivilegeCodes.length ; s++) {
            privilegeValueCode += arrPrivilegeCodes[s] + ',';
        }
        for (var s = 0; s < arrPrivilegeNames.length ; s++) {
            privilegeValueName += arrPrivilegeNames[s] + ',';
        }

        userTypeCodes = selectedUserTypeCodes;
        userTypeNames = selectedUserTypeNames;
    
        if ($('#hdnMode').val() == 'EDIT') {
            if (privilegeType_g.toUpperCase() == 'LOOKUP') {
                privilegeValueCode = "N/A";
            }
            else {
                privilegeValueCode = privilegeValueCode.slice(0,-1);
            }

        } else {
            if (privilegeValueCode == privilegeValueName) {
                privilegeValueCode = "N/A";
            }
            else {
                privilegeValueCode = privilegeValueCode.slice(0, -1);
            }
        }
        // privilegeValueCode = privilegeValueCode.slice(0, -1);
        privilegeValueName = privilegeValueName.slice(0, -1);
        mode = $("#hdnMode").val();
        requestFrom = $('#txtRequestFrom').val();
        requestDate = $('#txtRequestDate').val().split('/')[2] + '-' + $('#txtRequestDate').val().split('/')[1] + '-' + $('#txtRequestDate').val().split('/')[0];
        requestReason = $('#txtRequestReason').val();
        supportUser = $('#txtSupportUser').val();
        if (mode == "INSERT") {
            $('#dvPanel').block({
                message: '<h3>Loading...</h3>',
                css: { border: '2px solid #ddd' }
            });
            $.ajax({
                url: '../HiDoctor_Master/PrivilegeMaster/checkUserTypePrivilegeMapping',
                type: "POST",
                data: {
                    privilegeCode: privilegeCode, privilegeName: privilegeName, userTypeCodes: userTypeCodes.toString(),
                    userTypeNames: userTypeNames.toString()
                },
                success: function (result) {
                    if (result == "SUCCESS") {
                        fnInsertMapping(privilegeCode, privilegeName, privilegeValueCode, privilegeValueName, userTypeCodes.toString(), requestFrom, requestDate,
                                requestReason, supportUser, userTypeNames.toString(), status, mode);
                    }
                    else {
                        fnMsgAlert('info', 'Information', result);
                        return;
                    }
                },
                error: function (e) {
                    $('#dvPanel').unblock();
                },
                complete: function () {
                    $('#dvPanel').unblock();
                }
            });
        }
        else {
            fnInsertMapping(privilegeCode, privilegeName, privilegeValueCode, privilegeValueName, userTypeCodes.toString(), requestFrom, requestDate,
                      requestReason, supportUser, userTypeNames.toString(), status, mode);
        }
    }
}
function fnInsertMapping(privilegeCode, privilegeName, privilegeValueCode, privilegeValueName, UTCodes, requestFrom, requestDate,
    requestReason, supportUser, UTNames, status, mode) {
    $('#dvPanel').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/PrivilegeMaster/InsertUserTypePrivilegeMapping',
        type: "POST",
        data: {
            privilegeCode: privilegeCode, privilegeName: privilegeName, privilegeValueCodes: privilegeValueCode,
            privilegeValueNames: privilegeValueName, userTypeCodes: UTCodes.toString(), requestFrom: requestFrom,
            requestDate: requestDate, requestReason: requestReason, supportUser: supportUser,
            userTypeNames: UTNames.toString(), status: status, mode: mode, description: $('#spnDescription').html()
        },
        success: function (result) {
            if (result.split(':')[0] == "SUCCESS") {
                fnMsgAlert('success', 'Success', result.split(':')[1]);
                fnClearAll();
                fnGetUserTypePrivilegeMapping();
                fnGetAllPrivileges();
            }
            else {
                fnMsgAlert('info', 'Error', result.split(':')[1]);
            }

        },
        error: function (e) {
            $('#dvPanel').unblock();
        },
        complete: function () {
            $('#dvPanel').unblock();
        }
    });
}
function fnGetSingleActivityPerDayValue(User_Type, privilegeValue) {
    $.ajax({
        url: '../HiDoctor_Master/PrivilegeMaster/GetSingleActivityPerDayValue',
        type: "POST",
        data: 'User_Type=' + User_Type,
        async:false,
        success: function (result) {
            debugger;
            if(result.length > 0){
                for (var i = 0; i < result.length; i++) {
                    var value = result[i].Value;
                    if (value == 'SINGLE' && privilegeValue == 'HALF_A_DAY') {
                        fnMsgAlert('info', 'Validate', 'Please enter the LEAVE_ENTRY_MODE value as FULL_DAY because your SINGLE_PER_DAY_DCR  value is SINGLE');
                        SingledayActivity = false;
                    }
                    else {
                        SingledayActivity = true;
                    }
                }
            }
            else {
                SingledayActivity = true;
            }

        },
        error: function (e) {
            fnMsgAlert('Info', 'Error');
        }
    });
}
var SingledayActivity = true;
function fnValidate() {
    debugger;
    var flag = true;
    if ($('#cboPrivilege').val() == '') {
        fnMsgAlert('info', 'Validate', 'Please select any one privilege');
        flag = false;
        return;
    }
    
   
    if ($("#cboPrivilege option:selected").text() == 'LEAVE_ENTRY_MODE') {
        if (arrPrivilegeNames.length > 1) {
            fnMsgAlert('info', 'Validate', 'Please enter any one privilege value');
            flag = false;
            return;
        }
    }
    if ($("#cboPrivilege option:selected").text() == 'LEAVE_ENTRY_MODE') {
        var privilegeValue = arrPrivilegeNames[0];
        fnGetSingleActivityPerDayValue(selectedUserTypeCodes, privilegeValue);
        if (SingledayActivity == false) {
            flag = false;
            return;
        }
    }
    if ($.trim($('#txtRequestFrom').val()) == '') {
        fnMsgAlert('info', 'Validate', 'Please enter value in request from field');
        flag = false;
        return;
    }
    if ($.trim($('#txtRequestDate').val()) == '') {
        fnMsgAlert('info', 'Validate', 'Please enter value in request date field');
        flag = false;
        return;
    }
    else {
        var result = isValidDateFormat($('#txtRequestDate'));
        if (!result) {
            fnMsgAlert('info', 'Info', 'Please enter valid date in request date field');
            flag = false;
            return;
        }
    }
    if ($.trim($('#txtSupportUser').val()) == '') {
        fnMsgAlert('info', 'Validate', 'Please enter value in support user field');
        flag = false;
        return;
    }
    if ($.trim($('#txtRequestReason').val()) == '') {
        fnMsgAlert('info', 'Validate', 'Please enter value in request reason field');
        flag = false;
        return;
    }
    if (selectedUserTypeCodes == undefined) {
        fnMsgAlert('info', 'Validate', 'Please select atleast any one user type');
        flag = false;
        return;
    }
    else {
        if (selectedUserTypeCodes.length == 0) {
            fnMsgAlert('info', 'Validate', 'Please select atleast any one user type');
            flag = false;
            return;
        }
    }
    if ($("#dvPriValues table tr").length == 0) {
        fnMsgAlert('info', 'Validate', 'No privilege values found');
        flag = false;
        return;
    }
    else {
        var i = 0;
        $("input:checkbox[name=chkValue]").each(function () {
            if (this.checked) {
                i = parseInt(i) + 1;
            }
        });
        if (i == 0) {
            fnMsgAlert('info', 'Validate', 'Please select atleast any one privilege value');
            flag = false;
            return;
        }
    }
    return flag;
}

function fnSubmitSD() {
    debugger;
    var result = fnValidate();
    if (result) {
        var privilegeCode = '', privilegeName = '', privilegeValueCode = '', privilegeValueName = '', description = '', requestFrom = '', requestDate = '',
            requestReason = '', supportUser = '',
            status = '', userTypeCodes = '', userTypeNames = '', mode = '';
        privilegeCode = $('#cboPrivilege').val();
        privilegeName = $("#cboPrivilege option:selected").text();
        status = $('input[name="rdStatus"]:checked').val();
        $("input:checkbox[name=chkValue]").each(function () {
            if (this.checked) {
                var id = this.id;
                privilegeValueCode += $.trim(this.value) + ",";
                privilegeValueName += $.trim($("#" + id.replace("td", "td_Value")).html()) + ',';
            }
        });
        userTypeCodes = selectedUserTypeCodes;
        userTypeNames = selectedUserTypeNames;      
        privilegeValueCode = privilegeValueCode.slice(0, -1);   
         
        privilegeValueName = privilegeValueName.slice(0, -1);
        mode = $("#hdnMode").val();
        requestFrom = $('#txtRequestFrom').val();
        requestDate = $('#txtRequestDate').val().split('/')[2] + '-' + $('#txtRequestDate').val().split('/')[1] + '-' + $('#txtRequestDate').val().split('/')[0];
        requestReason = $('#txtRequestReason').val();
        supportUser = $('#txtSupportUser').val();
        if (mode == "INSERT") {
            $('#dvPanel').block({
                message: '<h3>Loading...</h3>',
                css: { border: '2px solid #ddd' }
            });
            $.ajax({
                url: '../HiDoctor_Master/PrivilegeMaster/SDcheckUserTypePrivilegeMapping',
                type: "POST",
                data: {
                    privilegeCode: privilegeCode, privilegeName: privilegeName, userTypeCodes: userTypeCodes.toString(),
                    userTypeNames: userTypeNames.toString()
                },
                success: function (result) {
                    if (result == "SUCCESS") {
                        fnSDInsertMapping(privilegeCode, privilegeName, privilegeValueCode, privilegeValueName, userTypeCodes.toString(), requestFrom, requestDate,
                                requestReason, supportUser, userTypeNames.toString(), status, mode);
                    }
                    else {
                        fnMsgAlert('info', 'Information', result);
                        return;
                    }
                },
                error: function (e) {
                    $('#dvPanel').unblock();
                },
                complete: function () {
                    $('#dvPanel').unblock();
                }
            });
        }
        else {
            fnSDInsertMapping(privilegeCode, privilegeName, privilegeValueCode, privilegeValueName, userTypeCodes.toString(), requestFrom, requestDate,
                      requestReason, supportUser, userTypeNames.toString(), status, mode);
        }
    }
}

function fnSDInsertMapping(privilegeCode, privilegeName, privilegeValueCode, privilegeValueName, UTCodes, requestFrom, requestDate,
    requestReason, supportUser, UTNames, status, mode) {
    $('#dvPanel').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/PrivilegeMaster/SDInsertUserTypePrivilegeMapping',
        type: "POST",
        data: {
            privilegeCode: privilegeCode, privilegeName: privilegeName, privilegeValueCodes: privilegeValueCode,
            privilegeValueNames: privilegeValueName, userTypeCodes: UTCodes.toString(), requestFrom: requestFrom,
            requestDate: requestDate, requestReason: requestReason, supportUser: supportUser,
            userTypeNames: UTNames.toString(), status: status, mode: mode, description: $('#spnDescription').html()
        },
        success: function (result) {
            if (result.split(':')[0] == "SUCCESS") {
                fnMsgAlert('success', 'Success', result.split(':')[1]);
                fnClearAll();
                fnSDGetUserTypePrivilegeMapping();
                fnGetAllPrivileges();
            }
            else {
                fnMsgAlert('info', 'Error', result.split(':')[1]);
            }

        },
        error: function (e) {
            $('#dvPanel').unblock();
        },
        complete: function () {
            $('#dvPanel').unblock();
        }
    });
}
function fnEditSD(privilegeCode, userTypeCode) {
    fnClearAll();
    $('#hdnMode').val('EDIT');
    $('#cboPrivilege').attr('disabled', true);
    $('#dvPanel').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/PrivilegeMaster/GetSDPrivilegeDetails',
        type: "GET",
        data: "userTypeCode=" + userTypeCode + "&privilegeCode=" + privilegeCode + "",
        success: function (result) {
            if (result != '' && result != null && result != undefined) {
                var jsonResult = eval('(' + result + ')');
                if (jsonResult.length > 0) {
                    $('#cboPrivilege').val(jsonResult[0].Privilege_Code);
                    $.ajax({
                        url: '../HiDoctor_Master/PrivilegeMaster/GetPrivilegeValues',
                        type: "GET",
                        data: "privilegeCode=" + jsonResult[0].Privilege_Code + "",
                        success: function (priResult) {
                            var content = "<table>";
                            if (priResult != '' && priResult != null && priResult != undefined) {
                                var jsonValues = eval('(' + priResult + ')');
                                if (jsonValues.length > 0) {
                                    for (var i = 0; i < jsonValues.length; i++) {
                                        content += "<tr><td><input type='checkbox' name='chkValue' value='" + jsonValues[i].Privilege_Value_Code + "' id='td_" + i + "' /></td>";
                                        content += "<td id='td_Value_" + i + "'>" + jsonValues[i].Privilege_Value_Name + "</td></tr>";
                                    }
                                }
                            }
                            content += "</table>";

                            $('#dvPriValues').html(content);
                            var privilegeValueCodes = jsonResult[0].Privilege_Value_Code.split(',');
                            var privilegeValueNames = jsonResult[0].Privilege_Value_Name.split(',');
                            if (jsonResult[0].Privilege_Value_Type != 'LOOKUP') {
                                for (var j = 0; j < privilegeValueCodes.length; j++) {
                                    $("input:checkbox[name=chkValue]").each(function () {
                                        if ($.trim(this.value) == $.trim(privilegeValueCodes[j])) {
                                            this.checked = true;
                                        }
                                        //else {
                                        //    this.checked = false;
                                        //}
                                    });
                                }
                            }
                            else {
                                for (var j = 0; j < privilegeValueNames.length; j++) {
                                    $("input:checkbox[name=chkValue]").each(function () {
                                        var id = this.id
                                        if ($.trim($("#" + id.replace("td", "td_Value")).html().toUpperCase()) == $.trim(privilegeValueNames[j].toUpperCase())) {
                                            //  alert($("#" + id.replace("td", "td_Value")).html().toUpperCase());
                                            // alert(privilegeValueNames[j].toUpperCase());
                                            // this.checked = true;
                                            $("#" + id).attr('checked', true);
                                        }
                                        //else {
                                        //    this.checked = false;
                                        //}
                                    });
                                }
                            }
                            $('#spnDescription').html(jsonResult[0].Description);
                            $('#txtRequestFrom').val(jsonResult[0].Request_From);
                            $('#txtRequestDate').val(jsonResult[0].Request_Date);
                            $('#txtSupportUser').val(jsonResult[0].Support_User_Name);
                            $('#txtRequestReason').val(jsonResult[0].Request_Reason);
                            var userTypeCode = jsonResult[0].User_Type_Code;
                            if (jsonResult[0].Record_Status == "1") {
                                $('input[name="rdStatus"][value="1"]').prop('checked', true);
                            }
                            else {
                                $('input[name="rdStatus"][value="0"]').prop('checked', true);
                            }
                            $("#dvUserTypeTree").dynatree("getRoot").visit(function (node) {
                                node.data.unselectable = false;
                                node.data.hideCheckbox = false;
                                if (userTypeCode == node.data.key) {
                                    node.select(true);
                                }
                                else {
                                    node.data.unselectable = true;
                                    node.data.hideCheckbox = true;
                                }
                            });
                            $('#dvPanel').tabs('option', 'selected', 0);
                        },
                        error: function (e) {
                            fnMsgAlert('info', 'Info', 'Error while fetching the data');
                        },
                        complete: function () {
                        }
                    });

                }
            }
        },
        error: function (e) {
            $('#dvPanel').unblock();
        },
        complete: function () {
            $('#dvPanel').unblock();
        }
    });
}