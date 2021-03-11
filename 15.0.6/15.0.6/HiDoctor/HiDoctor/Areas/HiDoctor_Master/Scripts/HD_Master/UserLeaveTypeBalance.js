var LeaveJson = "";
var OldLeaveJson = "";
var LeaveCode = new Array();
var UserCode = new Array();
var selectedUsers = "";
var selectedUserNames = "";
var sno = 0;
var arrLeave = [];

function fnGetuserTypes() {
    debugger;
    // $('#dvUserLeaveType').block();
    $.blockUI();
    $.ajax({
        url: '../HiDoctor_Master/LeaveType/GetUserTypes/',
        type: "POST",
        data: "A",
        success: function (result) {
            userType = $("#BindUserType");
            $("#BindUserType option").remove();
            userType.append(result);
        },
        error: function () {
            $("#dvUserLeaveType").unblock();
        },
        complete: function () {
            $("#dvUserLeaveType").unblock();
        }
    });
    $.unblockUI();
}

function fnGetYear() {
    debugger;
    for (y = 1990; y <= 2100; y++) {
        var optn = document.createElement("OPTION");
        optn.text = y;
        optn.value = y;

        // if year is 2015 selected
        if (y == new Date().getFullYear()) {
            optn.selected = true;
        }

        document.getElementById('BindCalYear').options.add(optn);
    }
}

function fnGetLeaveTypes() {
    $.blockUI();
    if ($('#BindCalYear').val == '') {
        $.unblockUI();
        fnMsgAlert('info', 'Info', 'Please Select Calendar Year');
        return false;
    }
    else {
        CalYear = $('#BindCalYear').val();
        debugger;
        $.ajax({
            url: '../HiDoctor_Master/LeaveType/GetUserTypeLeave/',
            type: "POST",
            data: "UserTypeCode=" + userTypeforleave + "&cal_Year=" + CalYear,
            success: function (result) {
                // if (result.length > 0) {
                debugger;
                var LeaveType = $("#BindLeaveTypes");
                $("#BindLeaveTypes option").remove();
                LeaveType.append(result);
                $("#BindLeaveTypes").multiselect("destroy").multiselectfilter("destroy").multiselect().multiselectfilter();

                $("#BindLeaveTypes").multiselect({
                    noneSelectedText: '-Leave Type-'
                }).multiselectfilter();


                var AddLeaveType = $("#BindAddLeaveTypes");
                $("#BindAddLeaveTypes option").remove();
                AddLeaveType.append(result);

                //$("#BindLeave option").remove();
                //$("#BindLeave").append(result);
                //$("#BindLeave").multiselect("destroy").multiselectfilter("destroy").multiselect().multiselectfilter();
                //$("#BindLeave").multiselect({
                //    noneSelectedText: '-Leave Type-'
                //}).multiselectfilter();
            },
            error: function () {
                $("#dvUserLeaveType").unblock();
            },
            complete: function () {
                $("#dvUserLeaveType").unblock();
            }
        });
        $.unblockUI();
    }
}

function fnGetUserCodes() {
    debugger;
    $.blockUI();
    $('#dvLeaveGrid').hide();
    userTypeforleave = $("#BindUserType").val();
    //$.blockUI({ message: '<h3> Just a moment...</h3>' });
    // $("#dvLusertree").html();
    // fnBindUserTreeWithCheckBox('dvLusertree');
    selkeys = "";
    $("span").removeClass("dynatree-selected");

    userTypeCode = $('#BindUserType').val();

    $.ajax({
        url: '../HiDoctor_Master/LeaveType/GetUsersForTree/',
        type: "POST",
        data: "userTypeCode=" + userTypeCode,
        success: function (jsonResult) {
            debugger;
            //if (jsonResult != false && jsonResult != '' && jsonResult != null) {
            $("#dvusertree").dynatree("getRoot").visit(function (node) {
                //node.select(true);
                var grpuser = jsonPath(jsonResult, "$.[?(@.User_Code=='" + node.data.key + "')]");
                if (grpuser.length > 0) {
                    node.data.unselectable = false; //make it selectable
                    node.data.hideCheckbox = false;
                    node.render(true);
                    node.select(true);
                }
                else {
                    node.select(false);
                    node.data.unselectable = true; //make it unselectable
                    node.data.hideCheckbox = true; //hide the checkbox (mo
                    node.render(true);
                    node.select(false);
                }
            });
            $('#dvusertree').show();
            $('#btnUncheck').show();
            //}
            debugger;
            fnGetLeaveTypes();
        }
    })
    $.unblockUI();
}

function fnAddLeaveType() {
    debugger;
    //var NewLeaveType = $('#txtAddLeave').val().toUpperCase();
    var NewLeaveType = $("#BindAddLeaveTypes").find("option:selected").text().toUpperCase();
    var selectedUsers = selKeys.join(',');
    var condt = false;

    OldLeaveJson = LeaveJson;
    if (selectedUsers == '') {
        fnMsgAlert('info', 'warning', 'Please Select atleast one user');
        return false;
    }

    if (NewLeaveType == '' || NewLeaveType == '-SELECT LEAVE TYPE-') {
        fnMsgAlert('info', 'warning', 'Please Select leave type');
        return false;
    }

    if ($('#Effective_From').val() == '') {
        fnMsgAlert('info', 'Info', 'Please enter Effective From');
        return false;
    }
    if ($('#Effective_To').val() == '') {
        fnMsgAlert('info', 'Info', 'Please enter Effective To');
        return false;
    }

    if ($('#Effective_From').val() > $('#Effective_To').val()) {
        fnMsgAlert('info', 'Info', 'Effective From cannot be greater than Effective To');
        return false;
    }

    if ($('#Effective_From').val().split('/')[2] != $('#Effective_To').val().split('/')[2]) {
        fnMsgAlert('info', 'User Creation Wizard', 'Effective From and Effective To should have the same year');
        return false;
    }

    $.blockUI();
    if (NewLeaveType != '') {
        $.ajax({
            url: '../HiDoctor_Master/LeaveType/AddNewLeaveType/',
            type: "POST",
            data: "NewLeaveType=" + NewLeaveType + "&userTypeCode=" + userTypeCode + "&UserCode=" + selectedUsers + "&Effective_from=" + $('#Effective_From').val() + "&Effective_To=" + $('#Effective_To').val(),
            success: function (resp) {
                debugger;
                $('#Leave_Add_Details').html('');
                var content = '';
                content += "<table id='myTable' class='table' border=1><thead><tr class='header'>";
                content += "<th>User Name</th><th>Leave Type</th><th>HiDoctor Start Date</th>";
                content += "<th>Effective From</th><th>Effective To</th><th>Remarks</th></tr></thead><tbody>";
                for (var i = 0; i < resp.length; i++) {
                    content += '<tr>';
                    content += '<td>' + resp[i].User_Name + '</td>';
                    content += '<td>' + resp[i].Leave_Type_Name + '</td>';
                    content += '<td>' + resp[i].HiDoctor_Start_Date.split('-')[2] + '/' + resp[i].HiDoctor_Start_Date.split('-')[1] + '/' + resp[i].HiDoctor_Start_Date.split('-')[0] + '</td>';
                    content += '<td>' + resp[i].Effective_From.split('-')[2] + '/' + resp[i].Effective_From.split('-')[1] + '/' + resp[i].Effective_From.split('-')[0] + '</td>';
                    content += '<td>' + resp[i].Effective_To.split('-')[2] + '/' + resp[i].Effective_To.split('-')[1] + '/' + resp[i].Effective_To.split('-')[0] + '</td>';
                    content += '<td>' + resp[i].Remarks + '</td>';
                    content += '</tr>';
                }
                $('#Leave_Add_Details').html(content);
                $("#myModal1").modal('show');
                fnGetLeaveDetails('2');
                //if (resp == 1) {
                //    $('#BindAddLeaveTypes').val('');
                //    $('#Effective_From').val('');
                //    $('#Effective_To').val('');
                //    fnMsgAlert('success', 'Success', 'Leave Details Added Successfully');
                //    fnGetLeaveDetails('2');
                //}
                //else {
                //    $('#BindAddLeaveTypes').val('');
                //    $('#Effective_From').val('');
                //    $('#Effective_To').val('');
                //    fnMsgAlert('info', 'warning', 'Selected Leave Details already exists');
                //}
            }
        })
    }
    else {
        fnMsgAlert('info', 'Info', 'Please Select Leave Type');
    }
    $.unblockUI();
}

function fnGetDetails(type) {
    $.blockUI();
    debugger;
    fnGetLeaveDetails(type);
    fnBindFilters();
    $.unblockUI();
}

function fnGetLeaveDetails(type) {
    $('#dvLeaveFilter').hide();
    $('#dvLeaveGrid').hide();
    debugger;
    LeaveTypeCode = "";
    $('select#BindLeaveTypes > option:selected').each(function () {
        LeaveTypeCode += $(this).val() + ',';
    });
    LeaveTypeCode = LeaveTypeCode.slice(0, -1);
    //  LeaveTypeCode = $('#BindLeaveTypes').val();
    if (userTypeCode == '') {
        fnMsgAlert('info', 'Info', 'Please Select atleast one user type');
        return false;
    }

    selectedUsers = selKeys.join(',');
    if (selectedUsers == '') {
        fnMsgAlert('info', 'Info', 'Please Select atleast one user');
        return false;
    }
    if (LeaveTypeCode == '') {
        fnMsgAlert('info', 'Info', 'Please Select atleast one leave type');
        return false;
    }
    sno = 0;
    $.blockUI();
    $('#dvLeaveFilter').show();
    $('#dvLeaveGrid').show();
    debugger;
    $.ajax({
        url: '../HiDoctor_Master/LeaveType/GetUserLeaveDetails/',
        type: "POST",
        data: "LeaveTypeCode=" + LeaveTypeCode + "&userTypeCode=" + userTypeCode + "&Usercodes=" + selectedUsers,
        success: function (resp) {
            debugger;
            $('#dvLeaveGrid').html('');
            var content = '';
            content += "<table id='myTable' class='table' border=1><thead><tr class='header'>";
            content += "<th>User Name</th><th>Leave Type</th><th>Balance CF</th><th>Leave Eligible</th>";
            content += "<th>Opening Balance</th><th>Leave Taken</th><th>Lapsed</th><th>Leave Balance</th>";
            content += "<th>View</th><th>Effective From</th><th>Effective To</th></tr></thead><tbody>";

            if (resp.length != 0) {
                LeaveJson = resp;
                for (var i = 0; i < resp.length; i++) {
                    sno++;

                    var flag = false;
                    var LeaveCode = "";
                    var UserCode = "";
                    if (OldLeaveJson.length > 0) {
                        var disjson = jsonPath(OldLeaveJson, "$.[?(@.User_Code=='" + resp[i].User_Code + "' & @.Leave_Type_Code=='" + resp[i].Leave_Type_Code + "')]");
                    }
                    if (type == '1') {
                        disjson = true;
                    }
                    if (OldLeaveJson != '' && disjson == undefined) {
                        content += "<tr class='hdnLeave_" + sno + "'>";
                    }
                    else if (disjson != false && disjson != undefined) {
                        content += "<tr class='hdnLeave_" + sno + "'>";
                    }
                    else {
                        content += "<tr style='background-color:blanchedalmond;' class='hdnLeave_" + sno + "'>";
                    }
                    content += "<input type=hidden value='0' class='hdnChange_" + sno + "'/>";
                    content += "<input type=hidden value='" + resp[i].User_Leave_Code + "' class='hdnULC_" + sno + "'/>";
                    content += "<input type=hidden value='" + resp[i].Leave_Type_Code + "' class='hdnLeaveCode_" + sno + "'/>";
                    content += "<input type=hidden value='" + resp[i].User_Code + "' class='hdnUserCode_" + sno + "'/>";
                    content += "<td>" + resp[i].User_Name + "</td><td>" + resp[i].Leave_Type_Name + "</td>";
                    //content += "<td><input type='number' min='0' class='form-control' style='cursor:pointer;' onblur='fnAddFunction(" + sno + ")' onkeypress='javascript:return fnvalidate(this,event);' disabled id='BalCF_" + sno + "' value='" + resp[i].Balance_CF + "'/></td>";
                    //content += "<td id='BalCF_" + sno + "'>" + resp[i].Balance_CF + "</td>";
                    content += "<td><input type='number' min='0' style='width: 60px;' class='form-control' style='cursor:pointer;' onblur='fnAddFunction(" + sno + ")' onkeypress='javascript:return fnvalidate(this,event);' id='BalCF_" + sno + "' value='" + resp[i].Balance_CF + "'/></td>";
                    //content += "<td><input type='number' min='0' class='form-control' style='cursor:pointer;' onblur='fnAddFunction(" + sno + ")' onkeypress='javascript:return fnvalidate(this,event);' disabled id='LeaveElg_" + sno + "' value='" + resp[i].Leave_Eligible + "'/></td>";
                    //content += "<td id='LeaveElg_" + sno + "'>" + resp[i].Leave_Eligible + "</td>";
                    content += "<td><input type='number' min='0' style='width: 60px;' class='form-control' style='cursor:pointer;' onblur='fnAddFunction(" + sno + ")' onkeypress='javascript:return fnvalidate(this,event);' id='LeaveElg_" + sno + "' value='" + resp[i].Leave_Eligible + "'/></td>";
                    content += "<td id='OpenBal_" + sno + "'>" + resp[i].Opening_Balance + "</td>";
                    content += "<td class='CLvTkn_" + sno + "'  id='LvTkn_" + sno + "'>" + resp[i].Leave_Taken + "</td>";
                    //content += "<td><input type='number' min='0' class='form-control' style='cursor:pointer;' onblur='fnAddFunction(" + sno + ")'onkeypress='javascript:return fnvalidate(this,event);' disabled id='Lapsed_" + sno + "' value='" + resp[i].Lapsed + "'/></td>";
                    //content += "<td id='Lapsed_" + sno + "'>" + resp[i].Lapsed + "</td>";
                    content += "<td><input type='number' min='0' style='width: 60px;' class='form-control' style='cursor:pointer;' onblur='fnAddFunction(" + sno + ")' onkeypress='javascript:return fnvalidate(this,event);' id='Lapsed_" + sno + "' value='" + resp[i].Lapsed + "'/></td>";
                    content += "<td id='LeaveBal_" + sno + "'>" + resp[i].Leave_Balance + "</td>";
                    content += "<td style='cursor: pointer; text-decoration: underline; color: blue; text-align: center' id='View_" + sno + "' onclick= fnView(" + sno + ");>View</td>";
                    content += "<td id='Eff_From_" + sno + "'>" + resp[i].Effective_From + "</td>";
                    content += "<td id='Eff_To_" + sno + "'>" + resp[i].Effective_To + "</td>";
                    //content += "<td style='cursor: pointer;text-decoration: underline;color: blue; text-align:center' id='OptEdit_" + sno + "' Onclick=fnEditLeave(" + sno + ");>Edit</td>";
                    //content += "<td style='cursor: pointer;text-decoration: underline;color: blue;display: none; text-align:center' id='OptUpd_" + sno + "' Onclick=fnUpdLeave(" + sno + ");>Update</td>";

                    //content += "<td id='LeaveEdit_" + sno + "' style='display:none'><span style='cursor: pointer;text-decoration: underline;color: blue;display: none; text-align:center' id='OptUpd_" + sno + "' Onclick=fnUpdLeave(" + sno + ");>Update</span>&nbsp;&nbsp;";
                    //content += "|&nbsp;&nbsp;<span style='cursor: pointer;text-decoration: underline;color: blue;display: none; text-align:center' id='OptCancel_" + sno + "' Onclick=fnCancel(" + sno + ");>Cancel</span></td>";
                    content += "</tr>";

                }

            }
            else {
                content += "<td colspan=10 style='text-align:center;'>No Records Found</td>";
            }
            OldLeaveJson = '';
            content += "</tbody></table>";
            $("#dvLeaveGrid").html(content);

            //fnBindFilters();
        }
    })
    $.unblockUI();
}

function fnBindFilters() {
    debugger;
    fnGetYearFilter();
    fnGetLeaveTypesForFilter();
    selectedUserNames = selTitle.join(',');
    fnBindUserFilter(selectedUsers, selectedUserNames);
}

function fnGetYearFilter() {
    debugger;
    for (y = 1990; y <= 2100; y++) {
        var optn = document.createElement("OPTION");
        optn.text = y;
        optn.value = y;

        if (y == new Date().getFullYear()) {
            optn.selected = true;
        }
        document.getElementById('BindYear').options.add(optn);
    }
}

function fnGetLeaveTypesForFilter() {
    debugger;
    $.ajax({
        url: '../HiDoctor_Master/LeaveType/GetLeaveTypesForFilter/',
        type: "POST",
        async: false,
        data: "UserTypeCode=" + userTypeforleave + "&cal_Year=" + CalYear,
        success: function (resp) {
            debugger;
            var LTC = LeaveTypeCode.split(',');
            var arr1 = [];
            var arr2 = [];
            var LeaveFilterDropdwn = $("#BindLeave");
            $("#BindLeave option").remove();
            var result = '';
            result = '<option value="">--Select Leave--</option>';
            for (var i = 0; i < LTC.length; i++) {
                var ltcode = $.grep(resp, function (v) {
                    return v.Leave_Type_Code == LTC[i];
                });
                if (ltcode.length > 0) {
                    result = result + '<option value= "' + ltcode[0].Leave_Type_Code + '">' + ltcode[0].Leave_Type_Name + '</option>';
                }
            }
            debugger;
            LeaveFilterDropdwn.append(result);
            $("#BindLeave").multiselect("destroy").multiselectfilter("destroy").multiselect().multiselectfilter();

            $("#BindLeave").multiselect({
                noneSelectedText: '-Leave Type-'
            }).multiselectfilter();
        }
    });
}

function fnBindUserFilter(selectedUsers, selectedUserNames) {
    debugger;
    var UserDropdwn = $("#BindUserNames");
    $("#BindUserNames option").remove();

    var arr1 = [];
    var arr2 = [];
    arr1 = selectedUsers.split(',');
    arr2 = selectedUserNames.split(',');
    debugger;
    var result = '';
    result = '<option value="">--Select User--</option>';
    for (var i = 0; i < arr1.length; i++) {
        result = result + '<option value= "' + arr1[i] + '">' + arr2[i] + '</option>';
    }
    debugger;
    UserDropdwn.append(result);
    $("#BindUserNames").multiselect("destroy").multiselectfilter("destroy").multiselect().multiselectfilter();

    $("#BindUserNames").multiselect({
        noneSelectedText: '-User Name-'
    }).multiselectfilter();
}

function fnFilterRecords(type) {
    debugger;
    var LTC = "";
    var UC = "";
    $('select#BindUserNames > option:selected').each(function () {
        UC += $(this).val() + ',';
    });

    UC = UC.slice(0, -1);

    $('select#BindLeave > option:selected').each(function () {
        LTC += $(this).val() + ',';
    });

    LTC = LTC.slice(0, -1);

    var selectedYear = $('#BindYear').val();

    if (UC == '') {
        fnMsgAlert('info', 'Info', 'Please Select atleast one user');
        return false;
    }
    if (LTC == '') {
        fnMsgAlert('info', 'Info', 'Please Select atleast one leave type');
        return false;
    }
    if (selectedYear == '') {
        fnMsgAlert('info', 'Info', 'Please Select Year');
        return false;
    }
    $('#dvLeaveGrid').html('');

    debugger;

    $.ajax({
        url: '../HiDoctor_Master/LeaveType/GetUserLeaveFilterDetails/',
        type: "POST",
        data: "LeaveTypeCode=" + LTC + "&Usercodes=" + UC + "&Year=" + selectedYear,
        success: function (resp) {
            debugger;
            $('#dvLeaveGrid').html('');
            var content = '';
            content += "<table id='myTable' class='table' border=1><thead><tr class='header'>";
            content += "<th>User Name</th><th>Leave Type</th><th>Balance CF</th><th>Leave Eligible</th>";
            content += "<th>Opening Balance</th><th>Leave Taken</th><th>Lapsed</th><th>Leave Balance</th>";
            content += "<th>View</th><th>Effective From</th><th>Effective To</th></tr></thead><tbody>";
            if (resp.length != 0) {
                LeaveJson = resp;
                for (var i = 0; i < resp.length; i++) {
                    sno++;

                    var flag = false;
                    var LeaveCode = "";
                    var UserCode = "";
                    if (OldLeaveJson.length > 0) {
                        var disjson = jsonPath(OldLeaveJson, "$.[?(@.User_Code=='" + resp[i].User_Code + "' & @.Leave_Type_Code=='" + resp[i].Leave_Type_Code + "')]");
                    }
                    if (type == '1') {
                        disjson = true;
                    }
                    if (OldLeaveJson != '' && disjson == undefined) {
                        content += "<tr class='hdnLeave_" + sno + "'>";
                    }
                    else if (disjson != false && disjson != undefined) {
                        content += "<tr class='hdnLeave_" + sno + "'>";
                    }
                    else {
                        content += "<tr style='background-color:blanchedalmond;' class='hdnLeave_" + sno + "'>";
                    }
                    content += "<input type=hidden value='0' class='hdnChange_" + sno + "'/>";
                    content += "<input type=hidden value='" + resp[i].User_Leave_Code + "' class='hdnULC_" + sno + "'/>";
                    content += "<input type=hidden value='" + resp[i].Leave_Type_Code + "' class='hdnLeaveCode_" + sno + "'/>";
                    content += "<input type=hidden value='" + resp[i].User_Code + "' class='hdnUserCode_" + sno + "'/>";
                    content += "<td>" + resp[i].User_Name + "</td><td>" + resp[i].Leave_Type_Name + "</td>";
                    content += "<td><input type='number' min='0' style='width: 60px;' class='form-control' style='cursor:pointer;' onblur='fnAddFunction(" + sno + ")' onkeypress='javascript:return fnvalidate(this,event);' id='BalCF_" + sno + "' value='" + resp[i].Balance_CF + "'/></td>";
                    content += "<td><input type='number' min='0' style='width: 60px;' class='form-control' style='cursor:pointer;' onblur='fnAddFunction(" + sno + ")' onkeypress='javascript:return fnvalidate(this,event);' id='LeaveElg_" + sno + "' value='" + resp[i].Leave_Eligible + "'/></td>";
                    content += "<td id='OpenBal_" + sno + "'>" + resp[i].Opening_Balance + "</td>";
                    content += "<td class='CLvTkn_" + sno + "'  id='LvTkn_" + sno + "'>" + resp[i].Leave_Taken + "</td>";
                    content += "<td><input type='number' min='0' style='width: 60px;' class='form-control' style='cursor:pointer;' onblur='fnAddFunction(" + sno + ")' onkeypress='javascript:return fnvalidate(this,event);' id='Lapsed_" + sno + "' value='" + resp[i].Lapsed + "'/></td>";
                    content += "<td id='LeaveBal_" + sno + "'>" + resp[i].Leave_Balance + "</td>";
                    content += "<td style='cursor: pointer; text-decoration: underline; color: blue; text-align: center' id='View_" + sno + "' onclick= fnView(" + sno + ");>View</td>";
                    content += "<td id='Eff_From_" + sno + "'>" + resp[i].Effective_From + "</td>";
                    content += "<td id='Eff_To_" + sno + "'>" + resp[i].Effective_To + "</td>";
                    content += "</tr>";
                }
            }
            else {
                content += "<td colspan=10 style='text-align:center;'>No Records Found</td>";
            }
            OldLeaveJson = '';
            content += "</tbody></table>";
            $("#dvLeaveGrid").html(content);
        }
    });
}

function fnEditLeave(sno) {
    debugger;

    var balcf = "";
    var LeaveElg = "";
    var Lapsed = "";
    balcf = $("#BalCF_" + sno).text();
    LeaveElg = $("#LeaveElg_" + sno).text();
    Lapsed = $("#Lapsed_" + sno).text();
    $("#BalCF_" + sno).replaceWith(function () {
        return "<td><input type='number' min='0' class='form-control' style='cursor:pointer;' onblur='fnAddFunction(" + sno + ")' onkeypress='javascript:return fnvalidate(this,event);' id='BalCF_" + sno + "' value='" + balcf + "'/></td>";
    });

    $("#LeaveElg_" + sno).replaceWith(function () {
        return "<td><input type='number' min='0' class='form-control' style='cursor:pointer;' onblur='fnAddFunction(" + sno + ")' onkeypress='javascript:return fnvalidate(this,event);' id='LeaveElg_" + sno + "' value='" + LeaveElg + "'/></td>";
    });

    $("#Lapsed_" + sno).replaceWith(function () {
        return "<td><input type='number' min='0' class='form-control' style='cursor:pointer;' onblur='fnAddFunction(" + sno + ")' onkeypress='javascript:return fnvalidate(this,event);' id='Lapsed_" + sno + "' value='" + Lapsed + "'/></td>";
    });

    //$("#BalCF_" + sno + "").attr('disabled', false);
    //$("#LeaveElg_" + sno + "").attr('disabled', false);
    //$("#Lapsed_" + sno + "").attr('disabled', false);
    $("#LeaveEdit_" + sno + "").show();
    $("#OptUpd_" + sno + "").show();
    $("#OptCancel_" + sno + "").show();
    $("#OptEdit_" + sno + "").hide();

}

function fnvalidate(ele, e) {
    debugger;
    if (e.keyCode == 45 || e.keyCode == 69 || e.keyCode == 101) {
        return false;
    }
}

function fnAddFunction(sno) {

    // return true
    debugger;
    $('.hdnChange_' + sno).val('1');
    if ($("#BalCF_" + sno + "").val() == '') {
        $("#BalCF_" + sno + "").val('0');
    }
    if ($("#LeaveElg_" + sno + "").val() == '') {
        $("#LeaveElg_" + sno + "").val('0');
    }
    if ($("#Lapsed_" + sno + "").val() == '') {
        $("#Lapsed_" + sno + "").val('0');
    }
    Lapsed = $("#Lapsed_" + sno + "").val();
    Addval1 = $("#BalCF_" + sno + "").val();
    Addval2 = $("#LeaveElg_" + sno + "").val();
    sum = parseFloat(Addval1) + parseFloat(Addval2);
    $("#OpenBal_" + sno + "").html(sum);
    LvTkn = $(".CLvTkn_" + sno).text();
    LeaveBal = parseFloat(sum) - parseFloat(LvTkn);
    TotalLeaveBal = parseFloat(LeaveBal) - parseFloat(Lapsed);
    $("#LeaveBal_" + sno + "").html(TotalLeaveBal);
}

function fnUpdLeave(sno) {
    $.blockUI();
    Usercode = $(".hdnUserCode_" + sno + "").val();
    ULeaveTypeCode = $(".hdnLeaveCode_" + sno + "").val();
    debugger;
    $.ajax({
        url: '../HiDoctor_Master/LeaveType/UpdateUserLeaveDetails/',
        type: "POST",
        data: "LeaveTypeCode=" + ULeaveTypeCode + "&userTypeCode=" + userTypeCode + "&UserCode=" + Usercode + "&BalCF=" + Addval1 + "&LeaveElg=" + Addval2 + "&OpenBal=" + sum + "&LvTkn=" + LvTkn + "&Lapsed=" + Lapsed + "&LeaveBal=" + TotalLeaveBal,
        success: function (resp) {
            if (resp == "True") {
                fnMsgAlert('success', 'Success', 'Updated Successfully');
                Lapsed = '';
                Addval1 = '';
                Addval2 = '';
                sum = '';
                LvTkn = '';
                OpBal = '';
                LeaveBal = '';
                TotalLeaveBal = '';
                //$("#BalCF_" + sno + "").attr('disabled', true);
                //$("#LeaveElg_" + sno + "").attr('disabled', true);
                //$("#Lapsed_" + sno + "").attr('disabled', true);
                $("#OptEdit_" + sno + "").show();
                $("#OptUpd_" + sno + "").hide();
                $("#LeaveEdit_" + sno + "").hide();
                fnGetLeaveDetails('1');
            }
        }
    })
    $.unblockUI();
}

function fnCancel(sno) {
    debugger
    //var Cbalcf = "";
    //var CLeaveElg = "";
    //var CLapsed = "";
    //Cbalcf = $("#BalCF_" + sno).val();
    //CLeaveElg = $("#LeaveElg_" + sno).val();
    //CLapsed = $("#Lapsed_" + sno).val();
    //$("#BalCF_" + sno).replaceWith(function () {
    //    return "<td id='BalCF_" + sno + "'>" + Cbalcf + "</td>";
    //});

    //$("#LeaveElg_" + sno).replaceWith(function () {
    //    return "<td id='LeaveElg_" + sno + "'>" + CLeaveElg + "</td>";
    //});

    //$("#Lapsed_" + sno).replaceWith(function () {
    //    return "<td id='Lapsed_" + sno + "'>" + CLapsed + "</td>";
    //});

    //$("#LeaveEdit_" + sno + "").hide();
    //$("#OptUpd_" + sno + "").hide();
    //$("#OptCancel_" + sno + "").hide();
    //$("#OptEdit_" + sno + "").show();
    fnGetLeaveDetails('1');
}

function fnClearAll() {
    $('#dvLeaveGrid').hide();
    $('#dvLeaveFilter').hide();
    $('#BindUserType').val('');
    $('#BindLeaveTypes').val('');
    $('#BindCalYear').val('');
    $("#BindLeaveTypes").multiselect("destroy").multiselect().multiselectfilter();
    $("#BindLeaveTypes").multiselect().multiselectfilter();
    $("span").removeClass("dynatree-selected");
    fnBindUserTreeWithCheckBoxDoubleClick("dvusertree");
    $('#dvusertree').hide();
    $('#BindAddLeaveTypes').val('');
    $('#btnUncheck').hide();
    userTypeCode = '';
    selKeys = "";
    entityDetails_g = "";
    userType = "";
    LeaveType = "";
    userTypeforleave = "";
    LeaveTypeCode = "";
}

function fnUpdateLeaveDetails() {
    debugger;
    $.blockUI();
    arrLeave = [];
    if (sno > 0) {
        for (var i = 1; i <= sno; i++) {
            if ($('.hdnChange_' + i).val() == '1') {
                if ($("#LeaveBal_" + i).html() > 0) {
                    var obj = {};
                    obj.User_Leave_Code = $(".hdnULC_" + i).val();
                    obj.Balance_CF = $("#BalCF_" + i).val();
                    obj.Leave_Eligible = $("#LeaveElg_" + i).val();
                    obj.Lapsed = $("#Lapsed_" + i).val();
                    obj.Opening_Balance = $("#OpenBal_" + i).html();
                    obj.Leave_Balance = $("#LeaveBal_" + i).html();
                    arrLeave.push(obj);
                }
                else {
                    $.unblockUI();
                    fnMsgAlert('info', 'Info', 'Leave Balance cannot be negative.');
                    return false;
                }
            }
        }
        debugger;
        objDetails = {
            lstUpdateDet: arrLeave,
        }
        $.ajax({
            url: '../HiDoctor_Master/LeaveType/BulkUpdateUserLeaveDetails',
            type: "POST",
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(objDetails),
            success: function (result) {
                debugger;
                fnMsgAlert('success', 'Success', result);
                fnGetLeaveDetails('1');
            }
        });
    }
    else {
        $.unblockUI();
        fnMsgAlert('info', 'Info', 'There are no records to update');
        return false;
    }
    $.unblockUI();
}

function fnView(sno) {
    debugger;
    //    var alerthtml = "";
    var User_Leave_Code = $(".hdnULC_" + sno).val();
    $('#Leave_Details').html('');
    $.ajax({
        url: '../HiDoctor_Master/LeaveType/GetSelectedLeaveDetails',
        type: "GET",
        data: "User_Leave_Code=" + User_Leave_Code,
        success: function (result) {
            debugger;
            var Leave_Details = "";
            Leave_Details += '</br>User Name : ' + result[0].User_Name;
            Leave_Details += '</br>Leave Type Name : ' + result[0].Leave_Type_Name;
            Leave_Details += '</br>Effective From : ' + result[0].Effective_From;
            Leave_Details += '</br>Effective To : ' + result[0].Effective_To;
            Leave_Details += '</br>Balance CF : ' + result[0].Balance_CF;
            Leave_Details += '</br>Leave Eligible : ' + result[0].Leave_Eligible;
            Leave_Details += '</br>Opening Balance : ' + result[0].Opening_Balance;
            Leave_Details += '</br>Lapsed : ' + result[0].Lapsed;
            Leave_Details += '</br>Leave Taken : ' + result[0].Leave_Taken;
            Leave_Details += '</br>Leave Balance : ' + result[0].Leave_Balance;
            $('#Leave_Details').html(Leave_Details);
            $("#myModal").modal('show');
        }
    });
}