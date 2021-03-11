//Created By Sumathi
//Date : 10/12/2013
var utlst = ''
function fnGetUserType() {
    debugger;
    $.ajax({
        url: '../HiDoctor_Master/UserTypeMaster/GetUserTypeMaster',
        type: "GET",
        success: function (result) {
            var excellst = [];
            result = eval('(' + result + ')');
            utlst = result.Tables[0].Rows;
            for (var i = 0; i < result.Tables[0].Rows.length; i++) {
                var newObj = {

                }
            }
            if (result != '') {
                $("#divUserType").html('');
                var grid = new ej.grids.Grid({
                    dataSource: result.Tables[0].Rows,
                    queryCellInfo: queryCellInfo,
                    //   rowSelected: fnRowSelected,
                    showColumnChooser: true,
                    allowPaging: true,
                    allowGrouping: true,
                    allowSorting: true,
                    allowFiltering: true,
                    allowResizing: true,
                    allowCellMerging: true,
                    allowScrolling: true,
                    allowExcelExport: true,
                    pageSettings: { pageSize: 10, pageSizes: [10, 20, 30, 40, 50], pageCount: 10 },
                    filterSettings: { type: 'CheckBox' },
                    toolbar: ['ExcelExport', 'Search', 'ColumnChooser'],

                    aggregates: [],
                    columns: [

                            { headerText: 'Edit', width: 150, textAlign: 'center' },
                            { headerText: 'Change Status', width: 150, textAlign: 'center' },
                            { field: 'User_Type_Name', headerText: 'User Type Name', width: 200, textAlign: 'center' },
                            { field: 'UnderUser', headerText: 'Reporting User Type', width: 200, textAlign: 'center' },
                            { field: 'User_Type_Category', headerText: 'User Type Category', width: 200, textAlign: 'center' },
                            { field: 'Ref_Key1', headerText: 'User Type Ref Key1', width: 200, textAlign: 'center' },
                            { field: 'Ref_Key2', headerText: 'User Type Ref Key2', width: 200, textAlign: 'center' },
                            { field: 'Status', headerText: 'Status', width: 200, textAlign: 'center', isPrimaryKey: true },
                    ],
                });

                var secgrid = new ej.grids.Grid({
                    dataSource: result.Tables[0].Rows,
                    allowPaging: true,
                    allowExcelExport: true,
                    columns: [
                            { field: 'User_Type_Name', headerText: 'User Type Name', width: 200, textAlign: 'center' },
                            { field: 'UnderUser', headerText: 'Reporting User Type', width: 200, textAlign: 'center' },
                            { field: 'User_Type_Category', headerText: 'User Type Category', width: 200, textAlign: 'center' },
                            { field: 'Ref_Key1', headerText: 'User Type Ref Key1', width: 200, textAlign: 'center' },
                            { field: 'Ref_Key2', headerText: 'User Type Ref Key2', width: 200, textAlign: 'center' },
                            { field: 'Status', headerText: 'Status', width: 200, textAlign: 'center', isPrimaryKey: true },
                    ]
                });

                grid.toolbarClick = function (args) {
                    debugger;
                    if (args['item'].id === 'divUserType_excelexport') {
                        secgrid.excelExport();
                    }
                }
            }
            grid.appendTo('#divUserType');
            secgrid.appendTo('#divUserTypeHidden');

            //  $("#divUserType").html(result);
        }
    });
}

function fnRowSelected(args) {
    debugger;
    console.log(args);
    if (args.target.innerText == 'Edit') {
        fnEdit(args);
    }
    else if (args.target.innerText == 'Change Status') {

        fnchangeStatus(args);
    }
}

function queryCellInfo(args) {
    debugger;
    if (args.column.headerText == "Change Status") {
        debugger;


        //args.cell.style.cursor = "pointer";
        //args.cell.style.color = "blue";
        //args.cell.style.cursor = "pointer";
        //args.cell.style.textDecoration = "underline";

        args.cell.innerHTML = "<a style='textDecoration:\'underline\';cursor:\'pointer\'' onclick='fnchangeStatus(\"" + args + "\")'>Change Status</a>"

        $(args.cell).bind("click", function () {
            debugger;

            fnchangeStatus(args);
        })
    }

    else if (args.column.headerText == "Edit") {
        if (args.data.Status == "Enabled") {
            //if (args.cell.innerText == "[object Object]") {
            //args.cell.style.cursor = "pointer";
            //args.cell.style.color = "blue";
            //args.cell.style.cursor = "pointer";
            //args.cell.style.textDecoration = "underline";
            args.cell.innerHTML = "<a style='textDecoration:\'underline\'' onclick='fnEdit()'>Edit</a>"
            //}
            $(args.cell).bind("click", function () {
                debugger;
                fnEdit(args);
            })
        } else {
            args.cell.innerHTML = "<a> </a>"
        }


    }
}


function fnGetUnderUserType() {
    $.ajax({
        url: '../HiDoctor_Master/UserTypeMaster/GetUnderUserType',
        type: "POST",
        success: function (JsonResult) {
            division_g = JsonResult;
            var userType = $("#ddlDivision");
            $('option', userType).remove();
            $('#ddlDivision').append("<option value='0'>-Select-</option>");
            if (division_g != null) {
                for (var i = 0; i < division_g.length; i++) {
                    $('#ddlDivision').append("<option value='" + division_g[i].User_Type_Code + "'>" + division_g[i].User_Type_Name + "</option>");
                }
                //                if (division_g.length > 0) {
                //                    fnAddOptionToSelect("ddlDivision", "-Select-", "0");
                //                    for (var di = 0; di < division_g.length; di++) {
                //                        fnAddOptionToSelect("ddlDivision", division_g[di].User_Type_Name,

                //division_g[di].User_Type_Code);
                //                    }
                //                }
                //                else {
                //                    fnAddOptionToSelect("ddlDivision", "-No Division-", "0");
                //                }
                //            }
                //            else {
                //                fnAddOptionToSelect("ddlDivision", "-No Division-", "0");
                //            }
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

function fnchangeStatus(obj) {
    debugger;
    if (obj != null) {
        //var tblchange = obj.id.replace('C', 'Status');
        //var tblusertypecode = obj.id.replace('C', 'User_Type_Code');
        //var status = $("#" + tblchange).text();
        //var userTypeCode = $("#" + tblusertypecode).text();

        var status = obj.data.Status;
        var userTypeCode = obj.data.User_Type_Code;

        $.ajax({
            url: '../HiDoctor_Master/UserTypeMaster/ChangestatusforUserType',
            type: "POST",
            data: { 'status': status, 'userTypeCode': userTypeCode },
            success: function (data) {
                if (data.split(":")[0].toString() == "SUCCESS") {
                    fnMsgAlert('success', 'User Type Master', data.split(":")[1].toString());
                    fnKIChangeUserTypeStatus(userTypeCode, status.toUpperCase() == "ENABLED" ? "0" : "1" );
                    fnGetUserType(); fnGetUnderUserType();
                }
                else if (data.split(":")[0].toString() == "INFO") {
                    fnMsgAlert('info', 'User Type Master', data.split(":")[1].toString());
                    return false;
                }
                if (data.split(":")[0].toString() == "ERROR") {
                    fnMsgAlert('error', 'User Type Master', data.split(":")[1].toString());
                    return false;
                }
            }
        });
    }
}

$("#btncancel").click(function () {
    $("#txtUserType").val('');
    $("#ddlDivision").val('0');
    $('input:radio[name=rdnFieldUser][value=FIELD_USER]').prop('checked', true);
    $('input:radio[name=rdnFieldUser][value=NON_FIELD_USER]').prop('checked', false);
    $("#txtUTRefKey1").val('');
    $("#txtUTRefKey2").val('');
    if ($("#btnsave").val() == 'Save') {
        $("#btnsave").val('Save');
    }
    else {
        $("#btnsave").val('Save');
    }

});


function fnsave() {
    debugger;
    var valid = '';
    valid = fnsubvalidate($("#hdnMode").val());
    if (valid) {
        var userTypeName = $.trim($("#txtUserType").val());
        var underUserType = $("#ddlDivision option:selected").val();
        var userTypeCategory = $('input:radio[name=rdnFieldUser]:checked').val();
        var refkey1 = $("#txtUTRefKey1").val();
        var refkey2 = $("#txtUTRefKey2").val();
        $.ajax({
            url: '../HiDoctor_Master/UserTypeMaster/InsertandUpdateUserType',
            type: "POST",
            data: {
                'userTypeName': userTypeName, 'underUserType': underUserType,

                'userTypeCategory': userTypeCategory, 'Mode': $("#hdnMode").val(), 'userTypeCodeval':

                $("#hdnUserTypecodeval").val(), 'refkey1': refkey1, 'refkey2': refkey2
            },
            success: function (data) {
                if (data == "1") {
                    fnMsgAlert('success', 'Success', 'Saved successfully');
                    var mode = "";
                    if($("#hdnMode").val().toUpperCase() == "I" )
                        mode = "INSERT";
                    else if ($("#hdnMode").val().toUpperCase() == "E" )
                        mode = "EDIT";
                    fnGetKIUserType(userTypeName, mode);
                    $("#txtUserType").val('');
                    $("#ddlDivision").val('0');
                    $('input:radio[name=rdnFieldUser][value=FIELD_USER]').prop('checked', true);
                    $('input:radio[name=rdnFieldUser][value=NON_FIELD_USER]').prop('checked', false);
                    $("#hdnUserTypecodeval").val('');
                    $("#hdnUnderUserTypeval").val('');
                    $("#txtUTRefKey1").val('');
                    $("#txtUTRefKey2").val('');
                    $("#btnsave").val('Save');  //Button Value Change From Update To Save
                    $("#hdnMode").val("I");
                    fnGetUserType();
                    fnGetUnderUserType();
                    fnUpdateUserTypeIndex();
                }
                else if (data == "2") {
                    fnMsgAlert('info', 'Error', 'Inserted Failure');
                }
                else if (data == "0") {
                    fnMsgAlert('info', 'Caution', 'UserType Name Already Exists');
                }

                else if (data == "3") {
                    fnMsgAlert('info', 'Error', 'Sorry An Error occured,please Try Again Later');
                }
                else if (data == "4") {
                    fnMsgAlert('info', 'Validate', 'User type and Under user type should not be the same');
                }
                else if (data == "5") {
                    fnMsgAlert('info', 'Validate', 'You should not choose the under user type who is mapped under the selected user type');
                }
            }
        });
    }
}

function fnsubvalidate(mode) {
    debugger;
    var refkey1 = '';
    var refkey2 = '';
    var refkey1edit = '';
    var refkey2edit = '';

    refkey1 = fncheckrefkeysedit();
    if (refkey1 == true) {
        refkey2 = fncheckrefkeys2edit();
        if (refkey2 == true) {
            if ($.trim($("#txtUserType").val()) == "") {
                fnMsgAlert('info', 'Info', 'Enter The UserType Name');
                return false;
            }

            if ($.trim($("#txtUserType").val()).length == 0) {
                fnMsgAlert('info', 'Info', 'Enter The UserType Name');
                return false;
            }

            if ($('#ddlDivision').val() == '0') {
                fnMsgAlert('info', 'Info', 'Select The Under UserType');
                return false;
            }

            if (!(isNaN($("#txtUserType").val()))) {
                fnMsgAlert('info', 'Info', 'Enter The valid UserType Name');
                return false;
            }

            if (regExforAlphaNumeric($("#txtUserType").val()) == false) {
                fnMsgAlert('info', 'Info', 'Special characters are not allowed in the UserType Name');
                return false;
            }
            if ($("#txtUTRefKey1").val() != '' && $("#txtUTRefKey1").val() != null) {
                if (regExforAlphaNumeric($("#txtUTRefKey1").val()) == false) {
                    fnMsgAlert('info', 'Info', 'Special characters are not allowed in the UserType Ref Key 1');
                    return false;
                }
               
            }
            if ($("#txtUTRefKey2").val() != '' && $("#txtUTRefKey2").val() != null) {
                if (regExforAlphaNumeric($("#txtUTRefKey2").val()) == false) {
                    fnMsgAlert('info', 'Info', 'Special characters are not allowed in the UserType Ref Key 2');
                    return false;
                }
                
            }
            if ($.trim($("#txtUserType").val()).length > 30) {
                fnMsgAlert('info', 'Info', 'UserType Name should not exceed 30 Characters');
                return false;
            }

            if (refkey1 == false) {
                fnMsgAlert('info', 'User Type Master', 'Ref key1 already exists');
                return false;
            }
            if (refkey2 == false) {
                fnMsgAlert('info', 'User Type Master', 'Ref key2 already exists');
                return false;
            }

            return true;
        }
    }
}

function fnEdit(args) {
    debugger;
    if (args != null) {

        //var tblUserTypeCode = obj.id.replace('E', 'User_Type_Code');
        //var tblUserTypeName = obj.id.replace('E', 'User_Type_Name');
        //var tblUnderUserTypecode = obj.id.replace('E', 'Under_User_Type');
        //var tblUnderUserType = obj.id.replace('E', 'UnderUser');
        //var tblUserTypeCategory = obj.id.replace('E', 'User_Type_Category');

        //var UserTypeCode = $("#" + tblUserTypeCode).text();
        //var UserTypeName = $("#" + tblUserTypeName).text();
        //var UnderUserTypecode = $("#" + tblUnderUserTypecode).text();
        //var UnderUserType = $("#" + tblUnderUserType).text();
        //var UserTypeCategory = $("#" + tblUserTypeCategory).text();


        var UserTypeCode = args.data.User_Type_Code;
        var UserTypeName = args.data.User_Type_Name;
        var UnderUserTypecode = args.data.Under_User_Type;
        var UnderUserType = args.data.UnderUser;
        var UserTypeCategory = args.data.User_Type_Category;
        var Ref_Key1 = args.data.Ref_Key1;
        var Ref_Key2 = args.data.Ref_Key2;

        if (UserTypeCategory.toUpperCase() == "FIELD USER") {
            UserTypeCategory = 'FIELD_USER';
        }
        else {
            UserTypeCategory = 'NON_FIELD_USER';
        }
        $("#hdnUserTypecodeval").val(UserTypeCode);
        $("#txtUserType").val(UserTypeName);
        $("#hdnUnderUserTypeval").val(UnderUserTypecode);
        $('#ddlDivision').val(UnderUserTypecode);
        $('input:radio[name=rdnFieldUser][value="' + UserTypeCategory + '"]').prop('checked', true);
        if (Ref_Key1 == 'null' || Ref_Key1 == undefined || Ref_Key1 == '') {
            $("#txtUTRefKey1").val('');
        } else {
            $("#txtUTRefKey1").val(Ref_Key1);
        }
        if (Ref_Key2 == 'null' || Ref_Key2 == undefined || Ref_Key2 == '') {
            $("#txtUTRefKey2").val('');
        } else {
            $("#txtUTRefKey2").val(Ref_Key2);
        }
        $("#btnsave").val('Update');  //Button Value Change From Save To Update
        $("#hdnMode").val("E");
    }
}
function fncheckutname() {
    debugger;
    if (utlst != '' || utlst != null || utlst != undefined) {
        var usertypelist = $.grep(utlst, function (element, index) {
            return element.User_Type_Name == $("#txtUserType").val();
        });
    }
    if (usertypelist.length > 0) {
        fnMsgAlert('info', 'User Type Master', 'User Type Name already exists');
        return false;
    }

}
function fncheckrefkeys() {
    debugger;
    var ref_key1 = $("#txtUTRefKey1").val();
    var usertypelist = '';
    if (ref_key1 != '' && ref_key1 != null && ref_key1 != undefined) {

        if (utlst != '' || utlst != null || utlst != undefined) {
            usertypelist = $.grep(utlst, function (element, index) {
                return element.Ref_Key1 == ref_key1;
            });
        }
        if (usertypelist.length > 0) {
            fnMsgAlert('info', 'User Type Master', 'Ref key1 already exists');
            return false;
        }
        else {
            return true;
        }
    }
    else {
        return true;
    }
}
function fncheckrefkeys2() {
    debugger;
    var ref_key2 = $("#txtUTRefKey2").val();
    if (ref_key2 != '' && ref_key2 != null && ref_key2 != undefined) {
        var usertypelist = ''
        if (utlst != '' || utlst != null || utlst != undefined) {
            usertypelist = $.grep(utlst, function (element, index) {
                return element.Ref_Key2 == ref_key2;
            });
        }
        if (usertypelist.length > 0) {
            fnMsgAlert('info', 'User Type Master', 'Ref key2 already exists');
            return false;
        }
        else {
            return true;
        }
    }
    else {
        return true;
    }
}
function fncheckrefkeysedit() {
    debugger;
    var ref_key1 = $("#txtUTRefKey1").val();
    var usertypelist = '';
    var utlist = '';
    if (ref_key1 != '' && ref_key1 != null && ref_key1 != undefined) {
        if (utlst != '' || utlst != null || utlst != undefined) {
            usertypelist = $.grep(utlst, function (element, index) {
                return element.Ref_Key1 == ref_key1;
            });
            var flag = true;
            for (var i = 0; i < utlst.length; i++) {
                if (utlst[i].Ref_Key1 == ref_key1 && utlst[i].User_Type_Code == $("#hdnUserTypecodeval").val()) {
                    flag = true;
                    return true;
                }
                else {
                    flag = false;
                }
            }
            if (flag == false) {
                if (usertypelist.length > 0) {
                    fnMsgAlert('info', 'User Type Master', 'Ref key1 already exists');
                    return false;
                }
                else {
                    return true;
                }
            }
        }
    }
    else {
        return true;
    }
}
function fncheckrefkeys2edit() {
    debugger;
    var ref_key2 = $("#txtUTRefKey2").val();
    var usertypelist = '';
    var utlist = '';
    if (ref_key2 != '' && ref_key2 != null && ref_key2 != undefined) {
        if (utlst != '' || utlst != null || utlst != undefined) {
            usertypelist = $.grep(utlst, function (element, index) {
                return element.Ref_Key2 == ref_key2;
            });
            var flag = true;
            for (var i = 0; i < utlst.length; i++) {
                if (utlst[i].Ref_Key2 == ref_key2 && utlst[i].User_Type_Code == $("#hdnUserTypecodeval").val()) {
                    flag = true;
                    return true;
                   
                }
                else {
                    flag = false;
                }
            }
            if (flag == false) {
                if (usertypelist.length > 0) {
                    fnMsgAlert('info', 'User Type Master', 'Ref key2 already exists');
                    return false;
                }
                else {
                    return true;
                }
            }

        }
      
    }
    else {
        return true;
    }
}

function fnGetKIUserType(userTypeName, Mode) {
    $.ajax({
        url: '../HiDoctor_Master/UserTypeMaster/GetKIUserType',
        data: "UserTypeName=" + userTypeName,
        success: function (JsonResult) {
            JsonResult.Mode = Mode;
            KangleIntegration.requestInvoke("UserMigration", "ManageUserTypeHiDoctor", JsonResult, "POST");
        },
        error: function (resp) {
            console.log(resp);
        }
    });
}

function fnKIChangeUserTypeStatus(userTypeCode, status) {
    var obj = {
        Company_Code: CompanyCode,
        User_Type_Code: userTypeCode,
        User_Type_Status: status
    }
    KangleIntegration.requestInvoke("UserMigration", "ChangeUserTypeStatusMigration", obj, "POST");
}

 function fnUpdateUserTypeIndex() {
        // $("#dvAjaxLoad").show();
   
        $.ajax({
            type: 'POST',//UpdateUserNewIndex
            url: '../HiDoctor_Master/User/UpdateUserTypeNewIndex',
            data: "A",
            success: function (result) {
                if (result != '') {
                    if (result.split(':')[0] == "SUCCESS") {
                     //   fnMsgAlert('success', 'Success', 'User Type master updated successfully');
                    }
                    else {
                      //  fnMsgAlert('error', 'error', 'User Type master updation failed because of ' + result.split(':')[1]);
                    }
                }
                else {
                   // fnMsgAlert('error', 'error', 'User Type master updation failed');
                }
            },
            error: function () {
            },
            complete: function () {
                $("#dvAjaxLoad").hide();
            }
        });
        
    }
