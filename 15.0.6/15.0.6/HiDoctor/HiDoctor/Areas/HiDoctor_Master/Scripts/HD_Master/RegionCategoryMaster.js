//Craeted  By:Sumathi
//Date: 16/12/2013

//Bind regionCategory with Html
/////////////////
var regclassN = '';
var editflag1 = true;
var editflag2 = true;
var regclasslst = '';

function fnGetRegionCategory() {
    debugger;
    $.ajax({
        type: "GET",
        url: '../HiDoctor_Master/RegionCategoryMaster/GetRegionCategoryMaster',
        data: "",
        success: function (result) {
            debugger;
            regclasslst = result;
            $('#divregincategory').html('');

            if (result != '') {
                result = eval('(' + result + ')');
                regclassN = result.Tables[0].Rows;
                var grid = new ej.grids.Grid({
                    dataSource: result.Tables[0].Rows,
                    // rowSelected: fnRowSelected,
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
                            { headerText: 'Edit', template: "<a href=#;>Edit</a>", width: 150, textAlign: 'center' },
                            { headerText: 'Change Status', template: "<a href=#;>Change Status</a>", width: 150, textAlign: 'center' },
                            { field: 'Region_Classification_Name', headerText: 'Region Classification Name', width: 200, textAlign: 'center' },
                            { field: 'Ref_Key1', headerText: 'Reference Key1', width: 200, textAlign: 'center' },
                            { field: 'Ref_Key2', headerText: 'Reference Key2', width: 200, textAlign: 'center' },
                            { field: 'Record_Status', headerText: 'Status', width: 200, textAlign: 'center' },
                    ],
                    queryCellInfo: queryCellInfo,
                });
                var secgrid = new ej.grids.Grid({
                    dataSource: result.Tables[0].Rows,
                    allowPaging: true,
                    allowExcelExport: true,
                    columns: [

                              { field: 'Region_Classification_Name', headerText: 'Region Classification Name', width: 200, textAlign: 'center' },
                              { field: 'Ref_Key1', headerText: 'Reference Key1', width: 200, textAlign: 'center' },
                              { field: 'Ref_Key2', headerText: 'Reference Key2', width: 200, textAlign: 'center' },
                              { field: 'Record_Status', headerText: 'Status', width: 200, textAlign: 'center' },
                    ],
                });

                grid.toolbarClick = function (args) {
                    if (args['item'].id === 'divregincategory_excelexport') {
                        secgrid.excelExport();
                    }
                }

                grid.appendTo('#divregincategory');
                secgrid.appendTo('#divregincategoryhdn');

                //  $("#divregincategory").html(result);
            }
        }
    });
}

//function queryCellInfo(args) {
//    debugger;
//    if (args.column.headerText == "Change Status") {
//        debugger;

//        if (args.cell.innerText == "[object Object ]") {
//            //args.cell.style.cursor = "pointer";
//            //args.cell.style.color = "blue";
//            args.cell.style.cursor = "pointer";
//            //args.cell.style.textDecoration = "underline";
//            args.cell.innerHTML = "<a style='textDecoration:\'underline\'' onclick='fnChangeStatus("+ args +")'>Change Status</a>"
//        }

//            $(args.cell).bind("click", function () {
//                debugger;

//                    fnChangeStatus(args);

//            })
//        }
//}


function queryCellInfo(args) {
    debugger;
    if (args.column.headerText == "Edit") {
        debugger;
        if (args.data.Record_Status == 'Enabled') {
            if (args.cell.innerText == "[Edit]") {
                
                args.cell.style.cursor = "pointer";
               
                args.cell.innerHTML = "<a style='textDecoration:\'underline\'' onclick='fnEdit(" + args + ")'>Edit</a>"
            }

            $(args.cell).bind("click", function () {
                debugger;

                fnEdit(args);

            })
        } else  {
            // (args.cell.innerText == "[Edit]") 
                
               //args.cell.style.cursor = "pointer";
               
                args.cell.innerHTML = "<a></a>"
            }
        }

       
     else if (args.column.headerText == "Change Status") {
        debugger;

        if (args.cell.innerText == "[Change Status]") {
           
            args.cell.style.cursor = "pointer";
           
            args.cell.innerHTML = "<a style='textDecoration:\'underline\'' onclick='fnChangeStatus(" + args + ")'>Change Status</a>"
        }

        $(args.cell).bind("click", function () {
            debugger;

            fnChangeStatus(args);

        })
    }
}


//function fnRowSelected(args) {
//    debugger;
//    var count = 1;
//    var isRowSelected = true;
//    if (count == 1 && isRowSelected) {
//        if (args.target.innerText == 'Edit') {
//            fnEdit(args.data.Region_Classification_Code + "_" + args.data.Region_Classification_Name );
//        }
//        else if (args.target.innerText == 'Change Status') {
//            debugger;
//            if (count == 1 && isRowSelected) {
//                fnChangeStatus(args.data.Region_Classification_Code + "_" + args.data.Region_Classification_Name + "_" + args.data.Record_Status);
//                //isRowSelected = false;
//            }
//        }
//        isRowSelected = false;
//        count++;
//    } 
//}

//Cancel The Date
function fnClearAll() {
    $("#txtregioncategoryName").val('');
    $('#txtReference_Key1').val('');
    $('#txtReference_Key2').val('');



    if ($("#btnsave").val() == 'Update') {
        $("#btnsave").val('Save');
        $("#hdnMode").val("I");
    }
    else {
        $("#btnsave").val('Save');
        $("#hdnMode").val("I");
    }
}

//Save and Update///////////////////
function fnSubmit() {
    editflag1 = true;
    editflag2 = true;
    debugger;
    var result = fnsubvalidate();    
    if (result) {
        var regcategorycode = $("#hdndoccategorycode").val();
        var Regioncategoryname = $.trim($("#txtregioncategoryName").val());
        //var Status = $('input:radio[name=rdnstatus]:checked').val();
        var refkey1 = $('#txtReference_Key1').val();
        var refkey2 = $('#txtReference_Key2').val();

        $.ajax({
            url: '../HiDoctor_Master/RegionCategoryMaster/InsertandUpdateRegionCategory',
            type: "POST",
            data: {
                'regionCategorycodeval': regcategorycode,
                'regionCategoryname': Regioncategoryname, 'status': 'ENABLED', 'Ref_key1': refkey1, 'Ref_key2': refkey2,
                'mode': $("#hdnMode").val(), 'regionCategorycodeval': $("#hdndoccategorycode").val()
            },
            success: function (data) {
                if (data.split(":")[0].toString() == "SUCCESS") {
                    fnMsgAlert('success', 'Region Classification Master', data.split(":")[1].toString());
                    $("#txtregioncategoryName").val('');

                    $('#txtReference_Key1').val('');
                    $('#txtReference_Key2').val('');
                    

                    $("#btnsave").val('Save');
                    $("#hdnMode").val("I");
                    fnGetRegionCategory();
                    fntxtReferenceKey1();
                    fntxtReferenceKey2();

                }
                else if (data.split(":")[0].toString() == "INFO") {
                    fnMsgAlert('info', 'Region Classification Master', data.split(":")[1].toString());
                    if (data.split(":")[1] == 1) {
                        $('#txtReference_Key1').val('');

                    } else {
                        $('#txtReference_Key2').val('');

                    }

                }
                if (data.split(":")[0].toString() == "ERROR") {
                    fnMsgAlert('error', 'Region Classification Master', data.split(":")[1].toString());
                    $("#txtregioncategoryName").val('');
                    $('#txtReference_Key1').val('');
                    $('#txtReference_Key2').val('');


                    $("#btnsave").val('Save');
                    $("#hdnMode").val("I");
                    fnGetRegionCategory();
                    fntxtReferenceKey1();
                    fntxtReferenceKey2();
                }

            }
        });
    }
}

//change status ///////////
function fnChangeStatus(val) {
    //alert("hello");
    debugger;
    var regionClassificationCode = val.data.Region_Classification_Code;
    var regionClassificationname = val.data.Region_Classification_Name;
    var changeStatus = val.data.Record_Status;
    $("#divRegionType").html("");
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/RegionCategoryMaster/regionclassificationchangestatus',
        data: "regionClassificationCode=" + regionClassificationCode + "&regionClassificationname=" + regionClassificationname + "&changeStatus=" + changeStatus,
        success: function (result) {
            debugger;
            if (result.split(":")[0].toString() == "SUCCESS") {
                fnMsgAlert('success', 'Region Classification Master', result.split(":")[1].toString());
            }
            if (result.split(":")[0].toString() == "INFO") {
                fnMsgAlert('info', 'Region Classification Master', result.split(":")[1].toString());
            }
            if (result.split(":")[0].toString() == "ERROR") {
                fnMsgAlert('error', 'Region Classification Master', result.split(":")[1].toString());
            }
            HideModalPopup("dvloading");
            //    fnfillRegionTypeGrid();
            fnGetRegionCategory();
            $('option', $("#ddlUnderRegion")).remove()
            fnUnderRegion();
        }
    });

}
function fnsubvalidate() {
    if ($.trim($("#txtregioncategoryName").val()) == "") {
        fnMsgAlert('info', 'Info', 'Enter The Region Classification Name');
        return false;
    }

    if ($.trim($("#txtregioncategoryName").val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Enter The Region Classification Name');
        return false;
    }

    if (!(isNaN($("#txtregioncategoryName").val()))) {
        fnMsgAlert('info', 'Info', 'Enter The valid Region Classification Name');
        return false;
    }

    if (!regExforAlphaNumeric($("#txtregioncategoryName").val())) {
        fnMsgAlert('info', 'Info', 'Special characters are not allowed in the Region Classification Name');
        return false;
    }

    if ($.trim($("#txtregioncategoryName").val()).length > 30) {
        fnMsgAlert('info', 'Info', 'Region Classification Name should not exceed 30 Characters');
        return false;
    }
    if ($('#txtReference_Key1').val() != "") {
        var result = ExforAlphaNumericSpecificRemarks($('#txtReference_Key1').val());
        if (result == false) {
            fnMsgAlert('info', 'Info', 'Only (a-z A-Z 0-9)  are allowed.');
            // HideModalPopup("dvloading");
            // flag = false;
            return false;
        }
    }
    if ($('#txtReference_Key2').val() != "") {
        var result = ExforAlphaNumericSpecificRemarks($('#txtReference_Key2').val());
        if (result == false) {
            fnMsgAlert('info', 'Info', 'Only (a-z A-Z 0-9) are allowed.');
            // HideModalPopup("dvloading");
            // flag = false;
            return false;
        }
    }
    //if (action != 'Edit')
    var result = fntxtReferenceKey1();
    if (!result)
       
    if (regclasslst[i].Ref_Key1 == Ref_Key1 && regclasslst[i].User_Type_Code == $("#hdnUserTypecodeval").val()) {
        return false;
    }

   // if (action != 'Edit')
    var result_ref2 = fntxtReferenceKey2();
    if (!result_ref2)
        return false;
    return true;
}
/////
function fnEdit(val) {
    debugger;
    if (val != null) {
        //var tblRegionCategoryCode = obj.id.replace('E', 'Region_Classification_Code');
        //var tblRegioncategoryName = obj.id.replace('E', 'Region_Classification_Name');
        //var tblstatus = val.Status;
       // action = 'Edit';
        var RegionCategoryCode = val.data.Region_Classification_Code;
        var RegioncategoryName = val.data.Region_Classification_Name;
        var Ref_Key1 = val.data.Ref_Key1;
        var Ref_Key2 = val.data.Ref_Key2;
        var tblstatus = val.data.Record_Status;
        $("#hdndoccategorycode").val(RegionCategoryCode);
        $("#txtregioncategoryName").val(RegioncategoryName);
        $("#txtReference_Key1").val(Ref_Key1);
        $("#txtReference_Key2").val(Ref_Key2);

        editflag1 = false;
        editflag2 = false;

        //$('#txtReference_Key1').val('');
        //$('#txtReference_Key2').val('');
        //$("#txtReference_Key1").val(Reference_Key1);
        //$('input:radio[name=rdnstatus][value="' + status + '"]').prop('checked', true);

        $("#btnsave").val('Update');  //Button Value Change From Save To Update
        $("#hdnMode").val("E");

    }
}


////////
function fntxtReferenceKey1() {
    var result = true;
    debugger;
    var empRefKey1 = $('#txtReference_Key1').val();
    var Regionclassificationname = $('#txtregioncategoryName').val();
    var hdnMode = $('#hdnMode').val();
    if (editflag1) {
        if (empRefKey1 != "" && empRefKey1 != null && empRefKey1 != undefined) {
            $.ajax({
                type: "POST",
                url: '../HiDoctor_Master/RegionCategoryMaster/GetRefKey_1',
                data: "refKey=" + empRefKey1 + "&Regionclassificationname=" + Regionclassificationname + "&mode=" + hdnMode,
                async: false,
                success: function (resp) {
                    if (resp == "False") {
                        fnMsgAlert('info', 'Info', 'Reference Key1 already exists');
                       // $('#txtReference_Key1').val('');
                        result = false;
                    }
                    //else {
                    //    fnMsgAlert('info','Info','Reference Key is available');
                    //}
                }
            });
        }
    }
    return result;

}
//////////////////
function fntxtReferenceKey2() {
    debugger;
    var result = true;
    var empRefKey2 = $('#txtReference_Key2').val();
    var Regionclassificationname = $('#txtregioncategoryName').val();
    var hdnMode = $('#hdnMode').val();
    if (editflag2) {
        if (empRefKey2 != "" && empRefKey2 != null && empRefKey2 != undefined) {
            $.ajax({
                type: "POST",
                url: '../HiDoctor_Master/RegionCategoryMaster/GetRefKey_2',
                data: "refKey=" + empRefKey2 + "&Regionclassificationname=" + Regionclassificationname + "&mode=" + hdnMode,
                async: false,
                success: function (resp) {
                    if (resp == "False") {
                        fnMsgAlert('info', 'Info', 'Reference Key2 already exists');
                       // $('#txtReference_Key2').val('');
                        result = false;
                    }
                    //else {
                    //   fnMsgAlert('info', 'Info', 'Reference Key is available');
                    //}
                }

            });
        }
    }
    return result;
}
function fnRegClassName() {
    debugger;
    if (regclassN != '' || regclassN != null || regclassN != undefined) {
        var regclasslst = $.grep(regclasslst, function (element, index) {
            return element.User_Type_Name == $("#txtregioncategoryName").val();
        });
    }
    if (regclasslst.length > 0) {
       
        fnMsgAlert('info', 'Region Classification Name', 'Region Classification Name already exists');
        
        return false;
    }

}

function fneditflagrefkey1(txtReference_Key1, event) {
    debugger;
    if (event.keycode == 8) {
        editflag1 = true;

    }
    else if (event.keycode >= 65 && event.keycode <= 90) {
        editflag1 = true;
    }
    else if (event.keycode >= 97 && event.keycode <= 122) {
        editflag1 = true;
    }
    else if (event.keycode >= 48 && event.keycode <= 57) {
        editflag1 = true;
    }
}


function fneditflagrefkey2(txtReference_Key1, event) {
    debugger;
    if (event.keycode == 8) {
        editflag2 = true;
    }
    else if (event.keycode >= 65 && event.keycode <= 90) {
        editflag2 = true;
    }
    else if (event.keycode >= 97 && event.keycode <= 122) {
        editflag2 = true;
    }
    else if (event.keycode >= 48 && event.keycode <= 57) {
        editflag2 = true;
    }
}


function ExforAlphaNumericSpecificRemarks(value) {
    var specialCharregex = new RegExp(/[*&%$^#<>+=~`""|]/g);

    if (specialCharregex.test(value) == true) {
        return false;
    }
    else {
        return true;
    }
}


