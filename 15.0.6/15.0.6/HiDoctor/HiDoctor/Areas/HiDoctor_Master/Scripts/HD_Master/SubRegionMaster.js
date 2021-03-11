//Created By:Sumathi.M
//Date : 21/2/2014

var division_g
function fnBindUnderregion() {
    $.ajax({
        url: '../HiDoctor_Master/SubRegionMaster/GetUnderRegion',
        type: "POST",
        success: function (JsonResult) {
            division_g = JsonResult;
            if (division_g != null) {
                if (division_g.length > 0) {
                    fnAddOptionToSelect("ddlUnderRegion", "-Select a Region-", "0");
                    for (var di = 0; di < division_g.length; di++) {
                        fnAddOptionToSelect("ddlUnderRegion", division_g[di].Region_Name, division_g[di].Region_Code);
                    }
                }
                else {
                    fnAddOptionToSelect("ddlUnderRegion", "-No Region-", "0");
                }
            }
            else {
                fnAddOptionToSelect("ddlUnderRegion", "-No Region-", "0");
            }
        },
        error: function () {
            fnMsgAlert("Get Divisions failed.")
        }
    });
}

function fnAddOptionToSelect(id, text, value) {
    if ($.msie) {
        var option = document.createElement('option');
        jQuery(option).appendTo('#' + id);
        option.text = text;
        option.value = value;
    }
    else {
        $('#' + id).append("<option value='" + value + "'>" + text + "</option>");
    }
}


function fnGetSubregionMaster() {
    $('#dvTabs').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        url: '../HiDoctor_Master/SubRegionMaster/GetSubRegionMaster',
        type: "GET",
        success: function (result) {
            if (result != '') {
                $("#dvSubRegionMaster").html(result);
                $('#dvTabs').unblock();
            }
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
            $('#dvTabs').unblock();
        }
    });
}

function fnEditSubRegionMaster(val) {
    var SubRegionName = "";
    var UnderRegionName = "";
    var UnderRegionCode = "";
    var Subregioncode = "";
    Subregioncode = val.split('|')[0];
    SubRegionName = val.split('|')[1];
    UnderRegionCode = val.split('|')[2];
    UnderRegionName = val.split('|')[3];
 

    $('#dvTabs').tabs('option', 'selected', 0);
    $('#hdnSubRgionCode').val(Subregioncode);
    $("#txtSubRegionName").val(SubRegionName);
    $("#hdnUnderRegion").val(UnderRegionCode);    
    $("#ddlUnderRegion").val(UnderRegionCode);   
    $("#btnSave").val('Update');
    $("#hdnMode").val("E");
    $("#txtSubRegionName").focus();   
}

function fnChangestatusSubRegionMaster(val) {
    if (confirm('Do you want to change the status?')) {
        var subRegionCode = "";
        var Status = "";
        var subRegionStatus = "";
        subRegionCode = val.split('|')[0];
        Status = val.split('|')[1];
        if (Status.toUpperCase() == "ENABLED") {
            subRegionStatus = "1";
        }
        else {
            subRegionStatus = "0";
        }
        $.ajax({
            url: '../HiDoctor_Master/SubRegionMaster/ChangestatusforSubRegionmaster',
            type: "POST",
            data: "subRgioncodeVal=" + subRegionCode + "&status=" + subRegionStatus,
            success: function (data) {
                if (data) {
                    fnMsgAlert('success', 'Success', 'Status changed successfully');
                }
                else {
                    fnMsgAlert('info', 'Caution', 'something went wrong');
                }
                fnGetSubregionMaster();
            }
        });
    }
}

function fnValidate() {
    if ($.trim($("#txtSubRegionName").val()).length == 0) {
        fnMsgAlert('info', 'SubRegion Master', 'Please Enter The SubRegion Name.');
        return false;
    }

    if ($('#ddlUnderRegion').val() == '0') {
        fnMsgAlert('info', 'SubRegion Master', 'Please select The Under RegionName.');
        return false;
    }

    if (!(isNaN($("#txtSubRegionName").val()))) {
        fnMsgAlert('info', 'Info', 'Please Enter The valid SubRegion Name');
        return false;
    }

    if (!regExforAlphaNumeric($("#txtSubRegionName").val())) {
        fnMsgAlert('info', 'Info', 'Special characters are not allowed in the SubRegion Name');
        return false;
    }

    if ($.trim($("#txtSubRegionName").val()).length > 50) {
        fnMsgAlert('info', 'Info', 'SubRegion Name should not exceed 50 Characters');
        return false;
    }
    return true;
}

function fnSaveSubRegionMaster() {
    var Result = fnValidate();
    if (Result) {       
        var subRegionName = $.trim($("#txtSubRegionName").val());
        var UnderRegion = $("#ddlUnderRegion option:selected").val();
        var Mode = $("#hdnMode").val();
        var subRegionCodeval = $("#hdnSubRgionCode").val()
        $('#dvTabs').block({
            message: '<h3>Loading...</h3>',
            css: { border: '2px solid #ddd' }
        });
        $.ajax({
            url: '../HiDoctor_Master/SubRegionMaster/InsertandUpdateSubRegionmaster',
            type: "POST",
            data: "subRegionName=" + subRegionName + "&UnderRegionName=" + UnderRegion + "&subRegionCodeVal=" + subRegionCodeval + "&mode=" + Mode,
            success: function (data) {
                if (data != '') {
                    if (!isNaN(data)) {
                        if (parseInt(data) > 0) {
                            fnMsgAlert('success', 'Success', 'Saved successfully');
                            fnCancelSubRegionMaster();
                            fnGetSubregionMaster();                           
                            $('#dvTabs').unblock();
                        }
                        else {
                            fnMsgAlert('info', 'Error', 'Insertion Failed');                          
                            $('#dvTabs').unblock();
                        }
                    }
                }               
            },
            error: function (e) {
                fnMsgAlert('info', '', 'Error.' + e.Message);
                $('#dvTabs').unblock();
            }
        });
    }
}

function fnCancelSubRegionMaster() {
    $("#txtSubRegionName").val('');
    $("#ddlUnderRegion").val('0');
    if ($("#btnSave").val() == 'Update') {
        $("#btnSave").val('Save');
    }
    else {
        $("#btnSave").val('Save');
    }
    $("#hdnMode").val("I");  
}