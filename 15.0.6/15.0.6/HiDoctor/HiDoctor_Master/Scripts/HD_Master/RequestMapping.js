//Date : 26-12-2013
//Created For : Request mapping Screen
//Created by : SriSudan

//Fill usertype


var userType = "";
var request = "";
var resultmapData = "";
var mapCode_g = "";
function fnUnderUserType() {
    $.ajax({
        url: '../HiDoctor_Master/RequestUserTypeMapping/GetUserType',
        type: "POST",
        success: function (JsonResult) {
            userType = JsonResult;
            if (userType != null) {
                if (userType.length > 0) {
                    fnAddOptionToSelect("drpUserTypeName", "-Select-", "0");
                    for (var i = 0; i < userType.length; i++) {
                        fnAddOptionToSelect("drpUserTypeName", userType[i].User_Type_Name, userType[i].User_Type_Code);
                    }
                }
                else {
                    fnAddOptionToSelect("drpUserTypeName", "-No UserTypeName-", "0");
                }
            }
            else {
                fnAddOptionToSelect("drpUserTypeName", "-No UserTypeName-", "0");
            }
        }
    });
}

//fill request 
function fnFillRequest() {
    $.ajax({
        url: '../HiDoctor_Master/RequestUserTypeMapping/Getrequest',
        type: "POST",
        success: function (JsonResult) {
            request = JsonResult;
            if (request != null) {
                if (request.length > 0) {
                    fnAddOptionToSelect("drpRequestName", "-Select-", "0");
                    for (var i = 0; i < request.length; i++) {
                        fnAddOptionToSelect("drpRequestName", request[i].Request_Name, request[i].Request_Code);
                    }
                }
                else {
                    fnAddOptionToSelect("drpRequestName", "-No RequestName-", "0");
                }
            }
            else {
                fnAddOptionToSelect("drpRequestName", "-No RequestName-", "0");
            }
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

//fill Mapping Grid
function fnfillMappingGrid() {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/RequestUserTypeMapping/GetRequestmapValues',
        data: "A",
        success: function (result) {
            resultmapData = (result.split('*')[1]);
            if (result != '') {
                $("#dvTable").html(result.split('*')[0]);

            }
        }
    });
}

//change Status
function fnStatusChange(val) {
    $('#lblmessage').html("");
    var mapcode = val.split('_')[0]
    var status = val.split('_')[1]
    $("#dvTable").html("");
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/RequestUserTypeMapping/RequestChangeStatus',
        data: "mapCode=" + mapcode + "&recordStatus=" + status,
        success: function (result) {
            if (result == "1") {
                fnMsgAlert('success', 'Request Mapping', 'Status Changed Sucessfully');
            }
            else if (result == "2") {
                $('#lblmessage').html("Sorry an error occured. Please try again later");
            }
            HideModalPopup("dvloading");
            fnfillMappingGrid()
        }
    });
}

//insert//
function fnSave() {
    $('#lblmessage').html("");
    if (request.length > 0) {
        if ($("#drpRequestName").val() == "0") {
            fnMsgAlert('info', 'Request Mapping Screen', 'Please Select Request Name.');
            return false;
        }
    }
    if (userType.length > 0) {
        if ($("#drpUserTypeName").val() == "0") {
            fnMsgAlert('info', 'Request Mapping Screen', 'Please Select Usertype Name.');
            return false;
        }
    }
    var requestCode = $("#drpRequestName option:selected").val();
    var userTypeCode = $("#drpUserTypeName option:selected").val();
    var recordStatus = "1";
    var jsdata = eval(resultmapData);
    var disJson = jsonPath(jsdata, "$.[?(@.Request_Code =='" + requestCode + "' && @.User_Type_Code == '" + userTypeCode + "' && @.Record_Status == '" + recordStatus + "')]");
    if (disJson != false && disJson != undefined) {
        //fnMsgAlert('info', 'User Project Mapping', 'The Request ' + disJson[0].Request_Name + ' already mapped with the User Type ' + disJson[0].User_Type_Name);
        // $('#lblmessage').html("The Request" + " " + disJson[0].Request_Name + "already mapped with the User Type" + " " + disJson[0].User_Type_Name);
        fnMsgAlert('success', 'Request Mapping', "The Request " + disJson[0].Request_Name + "  already mapped with the User Type " + disJson[0].User_Type_Name);
        return false;
    }
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/RequestUserTypeMapping/InsertRequestMapping',
        data: "requestCode=" + requestCode + "&userTypeCode=" + userTypeCode,
        success: function (data) {
            if (data == "1") {
                fnMsgAlert('info', 'Request Mapping Screen', 'Saved Sucessfully.');
                //  $('#lblmessage').html("Saved Sucessfully");
                $("#drpRequestName").val("0");
                $("#drpUserTypeName").val("0");
                //$('option', select).remove();
                //$("#drpRequestName").val("0");
                //$("#drpUserTypeName").val("0");
                //$('option', select).remove();
                //$("#drpUserTypeName").val("0");

            }
            else if (data == "2") {
                // $('#lblmessage').html("Sorry an error occured. Please try again later");
                fnMsgAlert('info', 'Request Mapping Screen', 'Sorry an error occured. Please try again later.');
            }
            //fnUnderUserType()
            //fnFillRequest()
            fnfillMappingGrid()
        }
    });
}
//Edit//

function fnEdit(val) {
    $('#lblmessage').html("");
    $('#btnSave').hide();
    var requestCode = val.split('_')[0]
    var userTypeCode = val.split('_')[1]
    mapCode_g = val.split('_')[2]
    $("#hdRequestCode").val(requestCode);
    $("#drpRequestName").val(requestCode);
    $("#drpUserTypeName").val(userTypeCode);
    $('#btnUpdate').show();
}

//update//
function fnUpdate() {
    $('#lblmessage').html("");
    if (request.length > 0) {
        if ($("#drpRequestName").val() == "0") {
            fnMsgAlert('info', 'Request Mapping Screen', 'Please Select Request Name.');
            return false;
        }
    }
    if (userType.length > 0) {
        if ($("#drpUserTypeName").val() == "0") {
            fnMsgAlert('info', 'Request Mapping Screen', 'Please Select Usertype Name.');
            return false;
        }
    }
    var requestCode = $("#drpRequestName option:selected").val();
    var userTypeCode = $("#drpUserTypeName option:selected").val();
    var jsdata = eval(resultmapData);

    if ($("#hdRequestCode").val() !== requestCode) {
        var disJson = jsonPath(jsdata, "$.[?(@.Request_Code =='" + requestCode + "' && @.User_Type_Code == '" + userTypeCode + "')]");
        if (disJson != false && disJson != undefined) {
            fnMsgAlert('info', 'User Project Mapping', 'The Request ' + disJson[0].Request_Name + ' already mapped with the User Type ' + disJson[0].User_Type_Name);
            //  $('#lblmessage').html("The Request" + " " + disJson[0].Request_Name + "already mapped with the User Type" + " " + disJson[0].User_Type_Name);
            return false;
        }
    }
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/RequestUserTypeMapping/UpdateRequestMapping',
        data: "requestCode=" + requestCode + "&userTypeCode=" + userTypeCode + "&mapCode=" + mapCode_g,
        success: function (data) {
            if (data == "1") {
                //$('#lblmessage').html("Updated Sucessfully");
                fnMsgAlert('info', 'Request Mapping Screen', 'Updated Sucessfully.');
                $("#drpRequestName").val("0");
                $("#drpUserTypeName").val("0");
            }
            else if (data == "2") {
                //$('#lblmessage').html("Sorry an error occured. Please try again later");
                fnMsgAlert('info', 'Request Mapping Screen', 'Sorry an error occured. Please try again later.');

            }
            fnfillMappingGrid()
            $('#btnSave').show();
            $('#btnUpdate').hide();
        }
    });
}

//cncel//
function fnCancel() {
    $('#lblmessage').html("");
    $('#btnSave').show();
    $('#btnUpdate').hide();
    $("#drpRequestName").val("0");
    $("#drpUserTypeName").val("0");
}