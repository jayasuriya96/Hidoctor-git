var region_g = "";
var regionTypeCode_g = "";
function fnUnderRegion() {
    $.ajax({
        url: '../HiDoctor_Master/RegionType/GetRegionType',
        type: "POST",
        success: function (JsonResult) {
            region_g = JsonResult;
            if (region_g != null) {
                if (region_g.length > 0) {
                    fnAddOptionToSelect("ddlUnderRegion", "-Select-", "0");
                    for (var di = 0; di < region_g.length; di++) {
                        fnAddOptionToSelect("ddlUnderRegion", region_g[di].UserRegionName, region_g[di].UserRegionCode);
                    }
                }
                else {
                    fnAddOptionToSelect("ddlUnderRegion", "-No UnderRegion-", "0");
                }
            }
            else {
                fnAddOptionToSelect("ddlUnderRegion", "-No UnderRegion-", "0");
            }
        }
    });
}
//fill grid//
var regiontpelist = '';
function fnfillRegionTypeGrid() {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/RegionType/GetRegionTypeDetail',
        data: "A",
        success: function (result) {

            result = eval('(' + result + ')');
            regiontpelist = result;
            if (result != '') {
                $("#divRegionType").html('');
                var grid = new ej.grids.Grid({
                    dataSource: result.Tables[0].Rows,
                    // toolbar: ['Edit', 'Delete', 'Update', 'Cancel'],
                    //  rowSelected: fnRowSelected,
                    queryCellInfo: queryCellInfo,
                    showColumnChooser: true,
                    allowPaging: true,
                    allowGrouping: true,
                    allowSorting: true,
                    allowFiltering: true,
                    allowResizing: true,
                    allowCellMerging: true,
                    allowScrolling: true,
                    allowExcelExport: true,
                    // editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true },
                    pageSettings: { pageSize: 10, pageSizes: [10, 20, 30, 40, 50], pageCount: 10 },
                    filterSettings: { type: 'CheckBox' },
                    toolbar: ['ExcelExport', 'Search', 'ColumnChooser'],

                    aggregates: [],
                    columns: [
                            { headerText: 'Edit', template: "<a href=#;>Edit</a>", width: 150, textAlign: 'center' },
                            { headerText: 'Change Status', template: "<a href=#;>Change Status</a>", width: 150, textAlign: 'center' },
                            { field: 'Region_Type_Name', headerText: 'Region Type Name', width: 200, textAlign: 'center' },
                            { field: 'UnderRegion', headerText: 'Reporting Region', width: 200, textAlign: 'center' },
                            { field: 'Ref_Key1', headerText: 'Region Type Ref Key1', width: 200, textAlign: 'center' },
                            { field: 'Ref_Key2', headerText: 'Region Type Ref Key2', width: 200, textAlign: 'center' },
                            { field: 'Region_Type_Category', headerText: 'Region Type Category', width: 200, textAlign: 'center' },
                            { field: 'Status', headerText: 'Status', width: 200, textAlign: 'center', isPrimaryKey: true },
                    ]
                });
                var secgrid = new ej.grids.Grid({
                    dataSource: result.Tables[0].Rows,
                    allowPaging: true,
                    allowExcelExport: true,
                    columns: [
                            { field: 'Region_Type_Name', headerText: 'Region Type Name', width: 200, textAlign: 'center' },
                            { field: 'UnderRegion', headerText: 'Reporting Region', width: 200, textAlign: 'center' },
                            { field: 'Ref_Key1', headerText: 'Region Type Ref Key1', width: 200, textAlign: 'center' },
                            { field: 'Ref_Key2', headerText: 'Region Type Ref Key2', width: 200, textAlign: 'center' },
                            { field: 'Region_Type_Category', headerText: 'Region Type Category', width: 200, textAlign: 'center' },
                            { field: 'Status', headerText: 'Status', width: 200, textAlign: 'center', isPrimaryKey: true },
                    ]
                });
                grid.toolbarClick = function (args) {
                    if (args['item'].id === 'divRegionType_excelexport') {
                        secgrid.excelExport();
                    }
                }

                grid.appendTo('#divRegionType');
                secgrid.appendTo('#regiontypedivhidden');
                //  $("#divRegionType").html(result);          
            }
        }
    });
}
function fnRowSelected(args) {
    debugger;
    console.log(args);
    if (args.target.innerText == 'Edit') {
        fnEdit(args.data.Region_Type_Code + "_" + args.data.Region_Type_Name + "_" + args.data.Under_Region_Type + "_" + args.data.Ref_Key1 + "_" + args.data.Ref_Key2 + "^" + args.data.Region_Type_Category);
    }
    else if (args.target.innerText == 'Change Status') {
        fnChangeStatus(args.data.Region_Type_Code + "_" + args.data.Region_Type_Status);
    }
}
function queryCellInfo(args) {
    debugger;
    if (args.column.headerText == "Change Status") {
        debugger;
        args.cell.innerHTML = "<a style='textDecoration:\'underline\';cursor:\'pointer\'' onclick='fnChangeStatus(\"" + args.data.Region_Type_Code + "_" + args.data.Region_Type_Status + "\");'>Change Status</a>"

        $(args.cell).bind("click", function () {
            debugger;
            fnChangeStatus(args.data.Region_Type_Code + "_" + args.data.Region_Type_Status);
        })
    }
    else if (args.column.headerText == "Edit") {
        if (args.data.Status == 'Enabled') {

            args.cell.innerHTML = "<a style='textDecoration:\'underline\'>Edit</a>"
            $(args.cell).bind("click", function () {
                debugger;
                fnEdit(args.data.Region_Type_Code + "_" + args.data.Region_Type_Name + "_" + args.data.Under_Region_Type + "_" + args.data.Ref_Key1 + "_" + args.data.Ref_Key2 + "^" + args.data.Region_Type_Category);
            })
        }
        else {
            args.cell.innerHTML = "<a> </a>"
        }
    }
}
//insert 
function fnSave() {
    $('#lblmessage').html("");
    if (fnvalidate()) {
        var regionTypeName = $.trim($("#txtRegionTypename").val());
        var underRegionCode = $("#ddlUnderRegion option:selected").val();
        var refkey1 = $("#ddlRefkey1").val();
        var refkey2 = $("#ddlRefkey2").val();
        var regTypeCat = $("input[name='optradio']:checked").val();
        $.ajax({
            type: "POST",
            url: '../HiDoctor_Master/RegionType/InsertRegionType',
            data: "regionTypeName=" + regionTypeName + "&underRegionCode=" + underRegionCode + "&Refkey1=" + refkey1 + "&Refkey2=" + refkey2 + "&RegionTypeCat=" + regTypeCat,
            success: function (data) {
                if (data == "1") {
                    fnMsgAlert('success', 'Region Type Master', 'Saved Sucessfully');
                    fnGetKIRegionType(regionTypeName, "INSERT");
                    $("#txtRegionTypename").val("");
                    $("#ddlUnderRegion").val("0");
                    $('input[name="optradio"][value="FIELD_REGION"]').prop('checked', true);
                    $("#ddlRefkey1").val("");
                    $("#ddlRefkey2").val("");
                }
                else if (data == "2") {
                    fnMsgAlert('info', 'Error', 'Saved Failure');
                }
                else if (data == "0") {
                    fnMsgAlert('info', 'Caution', 'Region Type Name Already Exists');
                }

                else if (data == "3") {
                    fnMsgAlert('info', 'Error', 'Sorry An Error occured,please Try Again Later');
                }
                fnfillRegionTypeGrid()
                $('option', $("#ddlUnderRegion")).remove()
                $('input[name="optradio"][value="FIELD_REGION"]').prop('checked', true);
                fnUnderRegion();
            }

        });
    }
}
function fnvalidate() {
    debugger;
    var refkey1valid = fncheckrefkeys();
    var refkey2valid = fncheckrefkeys2();
    if (refkey1valid == true) {
        var refkey2valid = fncheckrefkeys2();
        if (refkey2valid == true) {
            if ($("#txtRegionTypename").val() == "") {
                fnMsgAlert('info', 'Region Type Master', 'Please Enter RegionType.');
                return false;
            }
            if (regExforAlphaNumeric($("#txtRegionTypename").val()) == false) {
                fnMsgAlert('info', 'Info', 'Special characters are not allowed in the Region Type');
                return false;
            }
            //else if (refkey1valid == false) {
            //    fnMsgAlert('info', 'Region Type Master', 'Region Type Ref Key1 already exists');
            //    return false;
            //}
            //else if (refkey2valid == false) {
            //    fnMsgAlert('info', 'Region Type Master', 'Region Type Ref Key2 already exists');
            //    return false;
            //}
            if ($("#ddlRefkey1").val() != null && $("#ddlRefkey1").val() != '') {
                if (regExforAlphaNumeric($("#ddlRefkey1").val()) == false) {
                    fnMsgAlert('info', 'Info', 'Special characters are not allowed in the Region Type Ref Key1');
                    return false;
                }
            }
            else if ($("#ddlRefkey2").val() != null && $("#ddlRefkey2").val() != '') {
                if (regExforAlphaNumeric($("#ddlRefkey2").val()) == false) {
                    fnMsgAlert('info', 'Info', 'Special characters are not allowed in the Region Type Ref Key2');
                    return false;
                }
            }
            if (!(isNaN($("#txtRegionTypename").val()))) {
                fnMsgAlert('info', 'Info', 'Enter The valid Region type');
                return false;
            }
            if ($.trim($("#txtRegionTypename").val()).length > 30) {
                fnMsgAlert('info', 'Info', 'Region Type Name should not exceed 30 Characters');
                return false;
            }
            if (region_g.length > 0) {
                if ($("#ddlUnderRegion").val() == "0") {
                    fnMsgAlert('info', 'Region Type Master', 'Please Select Under RegionType.');
                    return false;
                }
                else {
                    return true;
                }
            }

            return true;
        }
    }
}
function fnChangeStatus(val) {
    debugger;
    var regionTypeCode = val.split('_')[0];
    var regionTypeStatus = val.split('_')[1];
    //$("#divRegionType").html("");

    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/RegionType/RegionChangeStatus',
        data: "regionTypeCode=" + regionTypeCode + "&changeStatus=" + regionTypeStatus,
        success: function (result) {
            if (result.split(":")[0].toString() == "SUCCESS") {

                fnMsgAlert('success', 'Region Type Master', result.split(":")[1].toString());
                fnKIChangeRegionTypeStatus(regionTypeCode, regionTypeStatus == "1" ? "0" : "1");
                fnfillRegionTypeGrid();
            }
            else if (result.split(":")[0].toString() == "INFO") {
                fnMsgAlert('info', 'Region Type Master', result.split(":")[1].toString());
                return false;
            }
            if (result.split(":")[0].toString() == "ERROR") {
                fnMsgAlert('error', 'Region Type Master', result.split(":")[1].toString());
                return false;
            }

            fnUnderRegion();
            HideModalPopup("dvloading");

            $('option', $("#ddlUnderRegion")).remove()

        }
    });

}

function fnEdit(val) {
    debugger;
    $('#lblmessage').html("");
    $('#btnSave').hide();
    var details = val.split('^')[0];
    regionTypeCode_g = details.split('_')[0]
    var regionTypeName = details.split('_')[1]
    var underRegionCode = details.split('_')[2]
    var refkey1 = details.split('_')[3]
    var refkey2 = details.split('_')[4]
    var regionTypeOrder = val.split('^')[1];
    if (refkey1 == 'null' || refkey1 == undefined || refkey1 == '') {
        $("#ddlRefkey1").val('');
    } else {
        $("#ddlRefkey1").val(refkey1);
    }
    if (refkey2 == 'null' || refkey2 == undefined || refkey2 == '') {
        $("#ddlRefkey2").val('');
    } else {
        $("#ddlRefkey2").val(refkey2);
    }
    editflag1 = false;
    editflag2 = false;
    $("#regtypecode").val(regionTypeCode_g);
    $("#txtRegionTypename").val(regionTypeName);
    $("#ddlUnderRegion").val(underRegionCode);
    $('input[name="optradio"][value="' + regionTypeOrder + '"]').prop('checked', true);
    $('#btnUpdate').show();
}

function fnUpdate() {
    debugger;
    $('#lblmessage').html("");

    if (fnvalidateedit()) {
        var regionTypeName = $.trim($("#txtRegionTypename").val());
        var underRegionCode = $("#ddlUnderRegion option:selected").val();
        var refkey1 = $("#ddlRefkey1").val();
        var refkey2 = $("#ddlRefkey2").val();
        var regTypeCat = $("input[name='optradio']:checked").val();
        $.ajax({
            type: "POST",
            url: '../HiDoctor_Master/RegionType/UpdateRegionType',
            data: "regionTypeCode=" + regionTypeCode_g + "&regionTypeName=" + regionTypeName + "&underRegionCode=" + underRegionCode + "&refkey1=" + refkey1 + "&refkey2=" + refkey2 + "&RegionTypeCat=" + regTypeCat,
            success: function (data) {
                debugger;
                if (data == "1") {
                    fnMsgAlert('success', 'Region Type Master', 'Updated Sucessfully');
                    fnGetKIRegionType(regionTypeName, "EDIT");
                    $("#txtRegionTypename").val("");
                    $("#ddlUnderRegion").val("0");
                    $('input[name="optradio"][value="FIELD_REGION"]').prop('checked', true);
                    $("#ddlRefkey1").val("");
                    $("#ddlRefkey2").val("");
                }
                else if (data == "2") {
                    fnMsgAlert('info', 'Error', 'Saved Failure');
                }
                else if (data == "0") {
                    fnMsgAlert('info', 'Caution', 'Region Type Name Already Exists');
                }

                else if (data == "3") {
                    fnMsgAlert('info', 'Error', 'Sorry An Error occured,please Try Again Later');
                }
                fnfillRegionTypeGrid()
                $('option', $("#ddlUnderRegion")).remove();
                $('input[name="optradio"][value="FIELD_REGION"]').prop('checked', true);
                fnUnderRegion();
                $('#btnUpdate').hide();
                $('#btnSave').show();
            }

        });
    }
}

function fnvalidateedit() {
    debugger;
    var refkey1valid = '';
    var refkey2valid = '';

    //refkey2valid = fncheckrefkeys2edit();
    var regionTypeName = $.trim($("#txtRegionTypename").val());
    var underRegionCode = $("#ddlUnderRegion option:selected").val();
    var refkey1 = $("#ddlRefkey1").val();
    var refkey2 = $("#ddlRefkey2").val();
    refkey1valid = fncheckrefkeysedit();
    if (refkey1valid == true) {
        refkey2valid = fncheckrefkeys2edit();
        if (refkey2valid == true) {

            if ($("#txtRegionTypename").val() == "") {
                fnMsgAlert('info', 'Region Type Master', 'Please Enter RegionType.');
                return false;
            }
            if ($("#ddlUnderRegion").val() == "0") {
                fnMsgAlert('info', 'Region Type Master', 'Please Select Under RegionType.');
                return false;
            }

            if (regExforAlphaNumeric($("#txtRegionTypename").val()) == false) {
                fnMsgAlert('info', 'Info', 'Special characters are not allowed in the Region Type');
                return false;
            }
            if ($("#ddlRefkey1").val() != null && $("#ddlRefkey1").val() != '') {
                if (regExforAlphaNumeric($("#ddlRefkey1").val()) == false) {
                    fnMsgAlert('info', 'Info', 'Special characters are not allowed in the Region Type Ref Key1');
                    return false;
                }

            }
            if ($("#ddlRefkey2").val() != null && $("#ddlRefkey2").val() != '') {
                if (regExforAlphaNumeric($("#ddlRefkey2").val()) == false) {
                    fnMsgAlert('info', 'Info', 'Special characters are not allowed in the Region Type Ref Key2');
                    return false;
                }

            }
            if (!(isNaN($("#txtRegionTypename").val()))) {
                fnMsgAlert('info', 'Info', 'Enter The valid Region type');
                return false;
            }

            if ($.trim($("#txtRegionTypename").val()).length > 30) {
                fnMsgAlert('info', 'Info', 'Region type Name should not exceed 30 Characters');
                return false;
            }
            if (refkey1valid == false) {
                fnMsgAlert('info', 'Region Type Master', 'Region Type Ref Key1 already exists');
                return false;
            }
            if (refkey2valid == false) {
                fnMsgAlert('info', 'Region Type Master', 'Region Type Ref Key2 already exists');
                return false;
            }
            return true;

        }
    }
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

function fnCancel() {
    $('#lblmessage').html("");
    $("#txtRegionTypename").val("");
    $("#ddlUnderRegion").val("0");
    $('input[name="optradio"][value="FIELD_REGION"]').prop('checked', true);
    $('#btnUpdate').hide();
    $("#ddlRefkey1").val("");
    $("#ddlRefkey2").val("");
    $('#btnSave').show();
}

var regiontypelst = '';
function fncheckregiontype() {
    debugger;
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/RegionType/GetRegionTypeDetail',
        data: "A",
        success: function (result) {
            regiontypelst = result;
            if (result != '' || result != null || result != undefined) {
                var regiontypelist = $.grep(result, function (element, index) {
                    return element.Region_Type_Name == $("#txtRegionTypename").val();
                });
            }
            if (regiontypelist.length > 0) {
                fnMsgAlert('info', 'Region Type Master', 'Region Type Name already exists');
                return false;
            }

        }
    });
}
var refkey1flag = true;
function fncheckrefkeys() {
    debugger;

    var refkey1 = $("#ddlRefkey1").val();
    var response = regiontpelist.Tables[0].Rows;
    if (refkey1 != null && refkey1 != undefined && refkey1 != '') {
        debugger;
        var regiontypelist = $.grep(response, function (element, index) {
            return element.Ref_Key1 == refkey1;
        });
        if (regiontypelist.length > 0) {
            fnMsgAlert('info', 'Region Type Master', 'Region Type Ref Key 1  already exists');
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
var refkey2flag = true;
function fncheckrefkeys2() {
    debugger;
    var refkey2 = $("#ddlRefkey2").val();
    var response = regiontpelist.Tables[0].Rows;
    if (refkey2 != null && refkey2 != undefined && refkey2 != '') {
        debugger;
        debugger;
        var regiontypelist = $.grep(response, function (element, index) {
            return element.Ref_Key2 == refkey2;
        });
        if (regiontypelist.length > 0) {
            fnMsgAlert('info', 'Region Type Master', 'Region Type Ref Key 2 already exists');
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

    var refkey1 = $("#ddlRefkey1").val();
    var regtypename = $("#txtRegionTypename").val();
    var regtypecode = $("#regtypecode").val();
    var response = regiontpelist.Tables[0].Rows;
    if (refkey1 != null && refkey1 != undefined && refkey1 != '') {
        debugger;
        var regiontypelist = $.grep(response, function (element, index) {
            return element.Ref_Key1 == refkey1 && element.Region_Type_Code == regtypecode;
        });
        var regiontyperefkeylst = $.grep(response, function (element, index) {
            return element.Ref_Key1 == refkey1;
        });
        var flag = true;
        for (var i = 0; i < response.length; i++) {
            if (response[i].Ref_Key1 == refkey1 && response[i].Region_Type_Code == regtypecode) {
                flag = true;
                return true;

            }
            else {
                flag = false;
            }
        }
        if (flag == false) {
            if (regiontyperefkeylst.length > 0) {
                debugger;
                fnMsgAlert('info', 'Region Type Master', 'Region Type Ref Key 1 already exists');
                return false;
            }
            else {
                return true;
            }
        }

    }
    else {
        return true;
    }

}
function fncheckrefkeys2edit() {
    debugger;

    var refkey2 = $("#ddlRefkey2").val();
    var regtypename = $("#txtRegionTypename").val();
    var regtypecode = $("#regtypecode").val();
    var response = regiontpelist.Tables[0].Rows;
    if (refkey2 != null && refkey2 != undefined && refkey2 != '') {
        debugger;

        var regiontyperefkeylst = $.grep(response, function (element, index) {
            return element.Ref_Key2 == refkey2;
        });
        var flag = true;
        for (var i = 0; i < response.length; i++) {
            if (response[i].Ref_Key2 == refkey2 && response[i].Region_Type_Code == regtypecode) {
                flag = true;
                return true;

            }
            else {
                flag = false;
            }
        }
        if (flag == false) {
            if (regiontyperefkeylst.length > 0) {
                fnMsgAlert('info', 'Region Type Master', 'Region Type Ref Key 2 already exists');
                return false;
            }
            else {
                return true;
            }
        }
    }
    else {
        return true;
    }

}


function fnGetKIRegionType(regionTypeName, mode) {

    $.ajax({
        url: '../HiDoctor_Master/RegionType/GetKIRegionType',
        data: "RegionTypeName=" + regionTypeName,
        success: function (JsonResult) {
            if(mode == "INSERT")
                KangleIntegration.requestInvoke("UserMigration", "InsertRegionTypeMigration", JsonResult, "POST");
            else if (mode == "EDIT")
                KangleIntegration.requestInvoke("UserMigration", "UpdateRegionTypeMigration", JsonResult, "POST");
        },
        error: function (resp) {
            console.log(resp);
        }
    });
}

function fnKIChangeRegionTypeStatus(regionTypeCode, status)
{
    //var data = CompanyCode + "&RegionTypeCode=" + regionTypeCode + "&Status=" + status.toString();
    var obj = {
        Company_Code: CompanyCode,
        Region_Type_Code: regionTypeCode,
        Region_Type_Status: status
    }
    KangleIntegration.requestInvoke("UserMigration", "ChangeRegionTypeStatusMigration", obj, "POST");
}