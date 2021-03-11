var Divisions = "";
var AddDivisions = "";
var DivisionCode = "";
var AddDivisionCode = "";
var AddUserType = "";
var UserType = "";
var Usertypecode = "";
var Status = "";
var Catagory = "";


var specialKeys = new Array();
specialKeys.push(8); //Backspace
specialKeys.push(9); //Tab
specialKeys.push(46); //Delete
specialKeys.push(36); //Home
specialKeys.push(35); //End
specialKeys.push(37); //Left
specialKeys.push(39); //Right
function IsAlphaNumeric(e) {
    var keyCode = e.keyCode == 0 ? e.charCode : e.keyCode;
    var ret = (keyCode == 32 || (keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122) || (specialKeys.indexOf(e.keyCode) != -1 && e.charCode != e.keyCode));
    document.getElementById("error").style.display = ret ? "none" : "inline";
    return ret;
}

function fnGetDivisions() {
    debugger;
    $("#AddStatus").block();
    $("#Dcrstatus").block();
    $.ajax({
        url: '../HiDoctor_Master/DcrStatusMaster/GetAllDivisions/',
        type: "GET",
        data: "A",
        success: function (result) {
            AddDivisions = $("#BindAddDivision");
            $("#BindAddDivision option").remove();
            AddDivisions.append(result);
            $("#AddStatus").unblock();

            Divisions = $("#BindDivision");
            $("#BindDivision option").remove();
            Divisions.append(result);
            $("#Dcrstatus").unblock();
        },
        error: function () {
            $("#AddStatus").unblock();
            $("#Dcrstatus").unblock();
        },
        complete: function () {
            $("#AddStatus").unblock();
            $("#Dcrstatus").unblock();
        }
    });

}

function fnGetUnderUsertype() {
    debugger
    $("#AddStatus").block();
    $("#Dcrstatus").block();
    $.ajax({
        url: '../HiDoctor_Master/DcrStatusMaster/GetUnderUserTypes/',
        type: "POST",
        data: "A",
        success: function (result) {
            AddUserType = $("#BindAddDesg");
            $("#BindAddDesg option").remove();
            AddUserType.append(result);
            $("#AddStatus").unblock();

            UserType = $("#BindDesg");
            $("#BindDesg option").remove();
            UserType.append(result);
            $("#Dcrstatus").unblock();
        },
        error: function () {
            $("#dvUserLeaveType").unblock();
            $("#AddStatus").unblock();
            $("#Dcrstatus").unblock();
        },
        complete: function () {
            $("#dvUserLeaveType").unblock();
            $("#AddStatus").unblock();
            $("#Dcrstatus").unblock();
        }
    });
}

function fnAddNewStatus() {
    debugger
    var Div = $('#BindAddDivision').val();
    var UsrType = $('#BindAddDesg').val();
    var stsChecked = "";
    var statuschkd = "";
    var catChecked = "";
    var NewStatus = $('#txtnewstatus').val();
    if (Div == '') {
        fnMsgAlert('info', 'DCR Status Master', 'Please Select Division');
        return false;
    }

    stsChecked = $('input[name="stsAddOptions"]:checked').val();
    if (stsChecked == undefined) {
        fnMsgAlert('info', 'DCR Status Master', 'Please Choose Dcr Status');
        return false;
    }

    if (stsChecked == 'Business Status') {
        statuschkd = 'Business_Status';
    }
    if (stsChecked == 'Call Objective') {
        statuschkd = 'Call_Objective';
    }
    if (stsChecked == 'Call Activity') {
        statuschkd = 'Call_Activity';
    }

    catChecked = $('input[name="catAddOpt"]:checked').val();
    if (catChecked == undefined) {
        fnMsgAlert('info', 'DCR Status Master', 'Please Choose Category');
        return false;
    }
    if (UsrType == '') {
        fnMsgAlert('info', 'DCR Status Master', 'Please Select Designation');
        return false;
    }
    if (NewStatus == "") {
        fnMsgAlert('info', 'DCR Status Master', 'Please Enter the Status Value');
        return false;
    }

    if (NewStatus.trim().length > 50) {
        fnMsgAlert("info", "DCR Status Master", "Only 50 Characters are allowed!");
        $('#txtnewstatus').val('');
        return false;
    }

    $('#dvTab').block();
    debugger
    $.ajax({
        url: '../HiDoctor_Master/DcrStatusMaster/AddNewStatus/',
        type: "POST",
        data: "Division=" + Div + "&Usertype=" + UsrType + "&Status=" + statuschkd + "&Catagory=" + catChecked + "&NewStatus=" + NewStatus,
        success: function (result) {
            if (result == 1) {
                fnMsgAlert('success', 'DCR Status Master', 'Status Added successfully');
                $('#lblAddProdCat').hide();
                $('#optAddProdCat').hide();
                $('input[name="catAddOpt"]').prop('checked', false);
                $('input[name="stsAddOptions"]').prop('checked', false);
                $('#BindAddDivision').val('');
                $('#BindAddDesg').val('');
                $('#txtnewstatus').val('');
                $("#txtnewstatus").removeClass("errTxtBox");
            }
            else {
                fnMsgAlert('info', 'DCR Status Master', 'Status Already Exists');
                $('#txtnewstatus').val('');
                $("#txtnewstatus").addClass("errTxtBox");
            }
        }
    })
    $('#dvTab').unblock();
}


function fnGetAddCatagory(value) {
    $('input[name="catAddOpt"]').prop('checked', false);
    $('#BindAddDesg').val('')
    $('#txtnewstatus').val('');
    $('#lblAddProdCat').hide();
    $('#optAddProdCat').hide();
    if (value == 1) {
        $('#optAddProdCat').show();
        $('#lblAddProdCat').show();
        Status = "Business_Status";
    }
    if (value == 2) {
        Status = "Call_Objective";
    }
    if (value == 3) {
        Status = "Call_Activity";
    }
    AddDivisionCode = $('#BindAddDivision').val();
}

function fnclrdesgnstatus() {
    $('#BindAddDesg').val('');
    $('#txtnewstatus').val('');
}

function fncleardsgn() {
    $('#BindDesg').val('');
}

function fnclrstatus() {
    $('#txtnewstatus').val('');
}

function fnGetCatagory(value) {
    debugger;
    $('input[name="catOpt"]').prop('checked', false);
    $('#BindDesg').val('');
    $('#lblProdCat').hide();
    $('#optProdCat').hide();
    $('#dvcatagory').show();
    $('#dvdesg').show();
    $('#dvgo').show();

    if (value == 1) {
        $('#optProdCat').show();
        $('#lblProdCat').show();
        Status = "Business_Status";
    }
    if (value == 2) {
        Status = "Call_Objective";
    }
    if (value == 3) {
        Status = "Call_Activity";
    }
    DivisionCode = $('#BindDivision').val();

}

function fnGetDcrStatusDetails() {
    debugger;
    var Statuschkd = "";
    var DcrStatus = "";
    var catChkd = "";
    DivisionCode = $('#BindDivision').val();
    Usertypecode = $('#BindDesg').val();

    if (DivisionCode == '') {
        fnMsgAlert('info', 'DCR Status Master', 'Please Select Division');
        return false;
    }

    Statuschkd = $('input[name="stsOptions"]:checked').val();
    if (Statuschkd == undefined) {
        fnMsgAlert('info', 'DCR Status Master', 'Please Choose Dcr Status');
        return false;
    }
    if (Statuschkd == 'Business Status') {
        DcrStatus = 'Business_Status';
    }
    if (Statuschkd == 'Call Objective') {
        DcrStatus = 'Call_Objective';
    }
    if (Statuschkd == 'Call Activity') {
        DcrStatus = 'Call_Activity';
    }

    catChkd = $('input[name="catOpt"]:checked').val();
    if (catChkd == undefined) {
        fnMsgAlert('info', 'DCR Status Master', 'Please Choose Category');
        return false;
    }
    if (catChkd == "Doctor") {
        Catagory = "Doctor";
    }
    if (catChkd == "Chemist") {
        Catagory = "Chemist";
    }
    if (catChkd == "Stockiest") {
        Catagory = "Stockiest";
    }
    if (catChkd == "Product") {
        Catagory = "Product";
    }
    if (Usertypecode == '') {
        fnMsgAlert('info', 'DCR Status Master', 'Please Select Designation');
        return false;
    }

    $('#dvstatustable').show();
    $.ajax({
        url: '../HiDoctor_Master/DcrStatusMaster/GetDcrStatusDetails/',
        type: "GET",
        data: "DivisionCode=" + DivisionCode + "&Usertypecode=" + Usertypecode + "&Status=" + DcrStatus + "&Catagory=" + Catagory,
        success: function (result) {
            debugger
            var tblstatus = "";
            var sno = "";
            tblstatus += "<table class='table table-hover scroll' style='width: 100%;'>";
            tblstatus += "<thead>";
            tblstatus += "<tr>";
            tblstatus += "<th style='text-align:center;'>S.No</th>";
            tblstatus += "<th style='text-align:center;padding-left:121px;'>Division</th>";
            tblstatus += "<th style='text-align:center;padding-left:135px;'>Designation</th>";
            tblstatus += "<th style='text-align:center;padding-left:110px;'>Entity Type</th>";
            tblstatus += "<th style='text-align:center;padding-left:130px;'>Name</th>";
            tblstatus += "<th style='text-align:center;padding-left:145px;'>Status</th>";
            tblstatus += "<th style='text-align:center;padding-left:141px;'>Change Status</th>";
            tblstatus += "</tr>";
            tblstatus += "</thead><tbody>";

            if (result.length != 0) {
                debugger
                for (var i = 0; i < result.length; i++) {
                    sno++;
                    if (result[i].Status == 1) {
                        tblstatus += "<tr style='text-align:center;width: 133%;'>";
                        tblstatus += "<td>" + sno + "</td>";
                        tblstatus += "<td style='padding-left:137px;' id='divisionname'>" + result[i].Division_Name + "</td><td style='padding-left:162px;' id='usertypename'>" + result[i].User_Type_Name + "</td>";
                        tblstatus += "<td style='padding-left:135px;' id='entitytype'>" + result[i].Entity_Type_Description + "</td><td style='padding-left:147px;' id='name'>" + result[i].Status_Name + "</td><td id='status' style='padding-left:153px;'> Active </td>";
                        tblstatus += "<td style='padding-left:140px; cursor: pointer;text-decoration: underline;color: blue;' Onclick='fnChangeStatus(\"" + result[i].Status_Name + " \"," + result[i].Status + ");'>Change Status</td>";
                        tblstatus += "</tr>";
                    }

                    if (result[i].Status == 0) {
                        tblstatus += "<tr style='text-align:center;width: 133%;'>";
                        tblstatus += "<td>" + sno + "</td>";
                        tblstatus += "<td style='padding-left:135px;' id='divisionname'>" + result[i].Division_Name + "</td><td style='padding-left:135px;' id='usertypename'>" + result[i].User_Type_Name + "</td>";
                        tblstatus += "<td style='padding-left:135px;' id='entitytype'>" + result[i].Entity_Type_Description + "</td><td style='padding-left:135px;' id='name'>" + result[i].Status_Name + "</td><td id='status' style='padding-left:135px;'> InActive </td>";
                        tblstatus += "<td style='padding-left:135px; cursor: pointer;text-decoration: underline;color: blue;' Onclick='fnChangeStatus(\"" + result[i].Status_Name + " \"," + result[i].Status + ");'>Change Status</td>";
                        tblstatus += "</tr>";
                    }

                }
            }
            else {
                tblstatus += "<tr>";
                tblstatus += "<td colspan=7 style='text-align:center;'>No Records Found</td>";
                tblstatus += "</tr>";
            }

            tblstatus += "</tbody></table>";
            $("#tblstsRecords").html(tblstatus);

        }
    })
}

function fnClearAddSel() {
    debugger
    $('#lblAddProdCat').hide();
    $('#optAddProdCat').hide();
    $('input[name="catAddOpt"]').prop('checked', false);
    $('input[name="stsAddOptions"]').prop('checked', false);
    $('#txtnewstatus').val('');
    $('#BindAddDesg').val('');
}

function fnClearSel() {
    $('input[name="catOpt"]').prop('checked', false);
    $('input[name="stsOptions"]').prop('checked', false);
    $('#dvstatustable').hide();
    $('#dvStatus').show();
    $('#dvcatagory').hide();
    $('#dvdesg').hide();
    $('#BindDesg').val('')
}


function fnChangeStatus(StatusName, status) {
    //UpdateStatus
    debugger
    var Statusname = StatusName;
    var Recstatus = status;
    debugger
    //if (confirm("Do you want to change the status?")) {
    $("#dvTab").block();
    bootbox.confirm({
        message: "<h3>Are you sure! Do you want to change the status?</h3>",
        buttons: {
            confirm: {
                label: 'Yes',
                className: 'btn-success'
            },
            cancel: {
                label: 'No',
                className: 'btn-danger'
            }
        },

        callback: function (result) {
            if (result == true) {
                debugger;
                $.ajax({
                    type: 'POST',
                    url: '../HiDoctor_Master/DcrStatusMaster/UpdateRecordStatus/',
                    data: "DivisionCode=" + DivisionCode + "&Usertypecode=" + Usertypecode + "&Status=" + Status + "&Catagory=" + Catagory + "&Statusname=" + Statusname + "&Recstatus=" + Recstatus,
                    success: function (result) {
                        debugger;
                        if (result == 1) {

                            fnMsgAlert('success', 'DCR Status Master', 'Status changed successfully');
                        }
                        else {
                            fnMsgAlert('info', 'DCR Status Master', 'Failed to change the Status');
                        }
                        fnGetDcrStatusDetails();
                        $("#dvTab").unblock();
                    },
                    error: function () {
                        $("#dvTab").unblock();
                    },
                    complete: function () {
                        $("#dvTab").unblock();
                    }
                });
            }
            else {
                $("#dvTab").unblock();
            }

        }
    });
    //}
}

function fnGetMappedRegion() {
    debugger;
    selKeys = [];
    $.ajax({
        url: '../HiDoctor_Master/DcrStatusMaster/GetMappedRegion/',
        type: "GET",
        data: "A",
        success: function (result) {
            debugger

            //if (result != false && result != '' && result != null) {
            $("#dvregtree").dynatree("getRoot").visit(function (node) {
                var user = $.grep(result, function (element, index) {
                    return element.Region_Code == node.data.key;
                });
                //  var user = jsonPath(result, "$.[?(@.Region_Code=='" + node.data.key + "')]");
                if (user.length > 0) {
                    // node.select(true);

                    node.data.unselectable = true; //make it unselectable
                    node.data.hideCheckbox = true; //hide the checkbox (mo
                    node.render(true);
                    node.select(false);
                    $(node.span).css("background-color", "lightgreen");
                    //$('.span.dynatree-checkbox').prop('checked', false);
                }
                else {
                    // node.select(false);
                    node.data.unselectable = false;
                    node.data.hideCheckbox = false;
                    node.render(true);
                    node.select(false);
                    $(node.span).css("background-color", "");
                }
            });
            //}
            var tblreg = "";
            var sno = "";
            tblreg += "<table class='table table-responsive' style='width: 100%;'>";
            tblreg += "<thead>";
            tblreg += "<tr>";
            tblreg += "<th style='text-align:center;'>S.No</th>";
            tblreg += "<th style='text-align:center;'>Region Name</th>";

            tblreg += "<th style='text-align:center;padding-left: 42px;min-width:128px;'>Mapped Date</th>";
            tblreg += "<th style='text-align:center;padding-left:110px'>Region Status</th>";
            tblreg += "<th style='text-align:center;padding-left: 69px;'>Action</th>";
            tblreg += "</tr>";
            tblreg += "</thead><tbody>";

            if (result.length != 0) {
                for (var i = 0; i < result.length; i++) {
                    sno++;
                    tblreg += "<tr style='width: 300%;'>";
                    tblreg += "<td>" + sno + "</td>";
                    tblreg += "<input type=hidden value=" + result[i].Region_Code + " class='hdnREG_" + sno + "'/>";

                    tblreg += "<td style='padding-left:20px;'>" + result[i].Region_Name + "</td><td style='padding-left: 47px;' id='date'>" + result[i].Created_Datetime + "</td>";
                    if (result[i].Region_Status == 1) {
                        tblreg += "<td style='padding-left:121px;'>Active</td>";
                    }
                    else {
                        tblreg += "<td style='padding-left:109px;' id='inactive'>In Active</td>";
                    }

                    tblreg += "<td style='cursor: pointer;text-decoration: underline;color: blue; text-align:center;min-width:227px;' onclick='fnUnmapRegion(\"" + result[i].Region_Code + "\");'>Unmap</td>";
                    tblreg += "</tr>";
                }
            }
            else {
                tblreg += "<tr>";
                tblreg += "<td colspan=4 style='text-align:center;min-width:408px;'>No Records Found</td>";
                tblreg += "</tr>";
            }

            tblreg += "</tbody></table>";
            $("#tblRegRecords").html(tblreg);
            $.unblockUI();
        }
    })

}

function fnMapRegion() {
    debugger
    //var selectedRegions = selKeys.join('^');
    var regionArray = [];
    for (var i = 0; i < selKeys.length; i++) {
        var regionObj = {
            Region_Code: selKeys[i],
        };
        regionArray.push(regionObj);
    }

    if (regionArray.length == 0) {
        fnMsgAlert('info', 'DCR Status Master', 'Please Select atleast one Region');
        return false;
    } else {
        $.ajax({
            url: '../HiDoctor_Master/DcrStatusMaster/InsertMappedRegions/',
            type: "POST",
            data: JSON.stringify({ "lstRegions": regionArray }),
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                debugger
                if (result == true || result == "True") {
                    fnMsgAlert('success', 'DCR Status Master', 'Region Mapped successfully');
                    fnGetMappedRegion();
                }
                else {
                    fnMsgAlert('info', 'DCR Status Master', 'Please Try Again Later');
                }
            }
        });
    }
}

function fnUnmapRegion(Regioncode) {
    debugger
    $("#dvTab").block();
    bootbox.confirm({
        message: "<h3>Are you sure! Do you want to unmap the region?</h3>",
        buttons: {
            confirm: {
                label: 'Yes',
                className: 'btn-success'
            },
            cancel: {
                label: 'No',
                className: 'btn-danger'
            }
        },

        callback: function (result) {
            if (result == true) {
                debugger;
                $.ajax({
                    url: '../HiDoctor_Master/DcrStatusMaster/UnmapRegions/',
                    type: "GET",
                    data: "Regioncode=" + Regioncode,
                    success: function (result) {
                        debugger
                        fnMsgAlert('success', 'DCR Status Master', 'Region Unmapped successfully');
                        selKeys = [];
                        fnGetMappedRegion();
                        $("#dvTab").unblock();
                    }
                })
            }
            else {
                $("#dvTab").unblock();
            }
        }
    })
}


function fnmapRegions() {
    debugger
    //var selectedRegions = selKeys.join('^');
    var regionArray = [];
    for (var i = 0; i < selKeys.length; i++) {
        var regionObj = {
            Region_Code: selKeys[i],
        };
        regionArray.push(regionObj);
    }

    if (regionArray.length == 0) {
        fnMsgAlert('info', 'DCR Status Master', 'Please Select atleast one Region');
        return false;
    } else {
        $.ajax({
            url: '../HiDoctor_Master/DcrStatusMaster/InsertMappedHospitalRegions/',
            type: "POST",
            async: false,
            data: JSON.stringify({ "lstRegions": regionArray }),
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                debugger
                if (result == true || result == "True") {
                    fnMsgAlert('success', 'DCR Status Master', 'Region Mapped successfully');
                    fnMappedRegion();
                }
                else {
                    fnMsgAlert('info', 'DCR Status Master', 'Please Try Again Later');
                }
            }
        });
    }
}
function fnGetDcrHospitalDetails() {
    debugger;
    //fnBindRegionTreeWithCheckBox('dvtree');
    $('.dynatree-selected span.dynatree-checkbox').attr('disabled', 'disabled');
    //fnGetDivisions();
    //fnGetUnderUsertype();
    fnMappedRegion();
    selKeys = [];
    selKeys = "";
    $('#dvTab').unblock();
    $.unblockUI();

}

function fnMappedRegion() {
    debugger;
    selKeys = [];
    $.ajax({
        url: '../HiDoctor_Master/DcrStatusMaster/GetMappedHospRegion/',
        type: "GET",
        data: "A",
        async: false,
        success: function (result) {
            debugger

            //if (result != false && result != '' && result != null) {

            $("#dvtree").dynatree("getRoot").visit(function (node) {
                var user = $.grep(result, function (element, index) {
                    return element.Region_Code == node.data.key;
                });
                //  var user = jsonPath(result, "$.[?(@.Region_Code=='" + node.data.key + "')]");
                if (user.length > 0) {
                    // node.select(true);

                    node.data.unselectable = true; //make it unselectable
                    node.data.hideCheckbox = true; //hide the checkbox (mo
                    node.render(true);
                    node.select(false);
                    $(node.span).css("background-color", "lightgreen");
                    //$('.span.dynatree-checkbox').prop('checked', false);
                }
                else {
                    // node.select(false);
                    node.data.unselectable = false;
                    node.data.hideCheckbox = false;
                    node.render(true);
                    node.select(false);
                    $(node.span).css("background-color", "");
                }
            });
            //}
            var tblreg = "";
            var sno = "";
            tblreg += "<table class='table table-responsive' style='width: 100%;'>";
            tblreg += "<thead>";
            tblreg += "<tr>";
            tblreg += "<th style='text-align:center;'>S.No</th>";
            tblreg += "<th style='text-align:center;'>Region Name</th>";

            tblreg += "<th style='text-align:center;padding-left: 42px;min-width:128px;'>Mapped Date</th>";
            tblreg += "<th style='text-align:center;padding-left:110px'>Region Status</th>";
            tblreg += "<th style='text-align:center;padding-left: 69px;'>Action</th>";
            tblreg += "</tr>";
            tblreg += "</thead><tbody>";

            if (result.length != 0) {
                for (var i = 0; i < result.length; i++) {
                    sno++;
                    tblreg += "<tr style='width: 300%;'>";
                    tblreg += "<td>" + sno + "</td>";
                    tblreg += "<input type=hidden value=" + result[i].Region_Code + " class='hdnREG_" + sno + "'/>";

                    tblreg += "<td style='padding-left:20px;'>" + result[i].Region_Name + "</td><td style='padding-left: 47px;' id='date'>" + result[i].Created_Datetime + "</td>";
                    if (result[i].Region_Status == 1) {
                        tblreg += "<td style='padding-left:121px;'>Active</td>";
                    }
                    else {
                        tblreg += "<td style='padding-left:109px;' id='inactive'>In Active</td>";
                    }

                    tblreg += "<td style='cursor: pointer;text-decoration: underline;color: blue; text-align:center;min-width:227px;' onclick='fnUnMappedRegion(\"" + result[i].Region_Code + "\");'>Unmap</td>";
                    tblreg += "</tr>";
                }
            }
            else {
                tblreg += "<tr>";
                tblreg += "<td colspan=4 style='text-align:center;min-width:408px;'>No Records Found</td>";
                tblreg += "</tr>";
            }

            tblreg += "</tbody></table>";
            $("#tblHospRecords").html(tblreg);
            $.unblockUI();
        }
    })

}
function fnUnMappedRegion(Regioncode) {
    debugger
    $("#dvTab").block();
    bootbox.confirm({
        message: "<h3>Are you sure! Do you want to unmap the region?</h3>",
        buttons: {
            confirm: {
                label: 'Yes',
                className: 'btn-success'
            },
            cancel: {
                label: 'No',
                className: 'btn-danger'
            }
        },

        callback: function (result) {
            if (result == true) {
                debugger;
                $.ajax({
                    url: '../HiDoctor_Master/DcrStatusMaster/UnMapHospitalRegions/',
                    type: "GET",
                    data: "Regioncode=" + Regioncode,
                    success: function (result) {
                        debugger
                        fnMsgAlert('success', 'DCR Status Master', 'Region Unmapped successfully');
                        selKeys = [];
                        fnMappedRegion();
                        $("#dvTab").unblock();
                    }
                })
            }
            else {
                $("#dvTab").unblock();
            }
        }
    })
}

/////  Dcr Status Hospital Visit(Field) /////////

function fnmapRegionsField() {
    debugger
    //var selectedRegions = selKeys.join('^');
    var regionArray = [];
    for (var i = 0; i < selKeys.length; i++) {
        var regionObj = {
            Region_Code: selKeys[i],
        };
        regionArray.push(regionObj);
    }

    if (regionArray.length == 0) {
        fnMsgAlert('info', 'DCR Status Master', 'Please Select atleast one Region');
        return false;
    } else {
        $.ajax({
            url: '../HiDoctor_Master/DcrStatusMaster/InsertMappedHospitalRegionsField',
            type: "POST",
            async: false,
            data: JSON.stringify({ "lstRegions": regionArray }),
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                debugger
                if (result == true || result == "True") {
                    fnMsgAlert('success', 'DCR Status Master', 'Region Mapped successfully');
                    fnMappedRegionField();
                }
                else {
                    fnMsgAlert('info', 'DCR Status Master', 'Please Try Again Later');
                }
            }
        });
    }
}
function fnGetDcrHospitalFileldDetails() {
    debugger;
    //fnBindRegionTreeWithCheckBox('dvtree');
    $('.dynatree-selected span.dynatree-checkbox').attr('disabled', 'disabled');
    //fnGetDivisions();
    //fnGetUnderUsertype();
    fnMappedRegionField();
    selKeys = [];
    selKeys = "";
    $('#dvTab').unblock();
    $.unblockUI();

}

function fnMappedRegionField() {
    debugger;
    selKeys = [];
    $.ajax({
        url: '../HiDoctor_Master/DcrStatusMaster/GetMappedHospRegionField/',
        type: "GET",
        data: "A",
        async: false,
        success: function (result) {
            debugger

            //if (result != false && result != '' && result != null) {

            $("#dvtreeField").dynatree("getRoot").visit(function (node) {
                var user = $.grep(result, function (element, index) {
                    return element.Region_Code == node.data.key;
                });
                //  var user = jsonPath(result, "$.[?(@.Region_Code=='" + node.data.key + "')]");
                if (user.length > 0) {
                    // node.select(true);

                    node.data.unselectable = true; //make it unselectable
                    node.data.hideCheckbox = true; //hide the checkbox (mo
                    node.render(true);
                    node.select(false);
                    $(node.span).css("background-color", "lightgreen");
                    //$('.span.dynatree-checkbox').prop('checked', false);
                }
                else {
                    // node.select(false);
                    node.data.unselectable = false;
                    node.data.hideCheckbox = false;
                    node.render(true);
                    node.select(false);
                    $(node.span).css("background-color", "");
                }
            });
            //}
            var tblreg = "";
            var sno = "";
            tblreg += "<table class='table table-responsive' style='width: 100%;'>";
            tblreg += "<thead>";
            tblreg += "<tr>";
            tblreg += "<th style='text-align:center;'>S.No</th>";
            tblreg += "<th style='text-align:center;'>Region Name</th>";

            tblreg += "<th style='text-align:center;padding-left: 42px;min-width:128px;'>Mapped Date</th>";
            tblreg += "<th style='text-align:center;padding-left:110px'>Region Status</th>";
            tblreg += "<th style='text-align:center;padding-left: 69px;'>Action</th>";
            tblreg += "</tr>";
            tblreg += "</thead><tbody>";

            if (result.length != 0) {
                for (var i = 0; i < result.length; i++) {
                    sno++;
                    tblreg += "<tr style='width: 300%;'>";
                    tblreg += "<td>" + sno + "</td>";
                    tblreg += "<input type=hidden value=" + result[i].Region_Code + " class='hdnREG_" + sno + "'/>";

                    tblreg += "<td style='padding-left:20px;'>" + result[i].Region_Name + "</td><td style='padding-left: 47px;' id='date'>" + result[i].Created_Datetime + "</td>";
                    if (result[i].Region_Status == 1) {
                        tblreg += "<td style='padding-left:121px;'>Active</td>";
                    }
                    else {
                        tblreg += "<td style='padding-left:109px;' id='inactive'>In Active</td>";
                    }

                    tblreg += "<td style='cursor: pointer;text-decoration: underline;color: blue; text-align:center;min-width:227px;' onclick='fnUnMappedRegionField(\"" + result[i].Region_Code + "\");'>Unmap</td>";
                    tblreg += "</tr>";
                }
            }
            else {
                tblreg += "<tr>";
                tblreg += "<td colspan=4 style='text-align:center;min-width:408px;'>No Records Found</td>";
                tblreg += "</tr>";
            }

            tblreg += "</tbody></table>";
            $("#tblHospRecordsField").html(tblreg);
            $.unblockUI();
        }
    })

}
function fnUnMappedRegionField(Regioncode) {
    debugger
    $("#dvTab").block();
    bootbox.confirm({
        message: "<h3>Are you sure! Do you want to unmap the region?</h3>",
        buttons: {
            confirm: {
                label: 'Yes',
                className: 'btn-success'
            },
            cancel: {
                label: 'No',
                className: 'btn-danger'
            }
        },

        callback: function (result) {
            if (result == true) {
                debugger;
                $.ajax({
                    url: '../HiDoctor_Master/DcrStatusMaster/UnMapHospitalRegionsField/',
                    type: "GET",
                    data: "Regioncode=" + Regioncode,
                    success: function (result) {
                        debugger
                        fnMsgAlert('success', 'DCR Status Master', 'Region Unmapped successfully');
                        selKeys = [];
                        fnMappedRegionField();
                        $("#dvTab").unblock();
                    }
                })
            }
            else {
                $("#dvTab").unblock();
            }
        }
    })
}
