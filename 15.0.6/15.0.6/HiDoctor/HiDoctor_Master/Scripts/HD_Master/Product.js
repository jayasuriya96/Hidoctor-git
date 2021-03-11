/*
Created By : Senthil S
Date : 2012-08-07
For Batch Lock
*/
//Global variables
var result_g = "";
var isBase = "Y";
var ONE_CHAR_MANDATORY_REGEX = /^(?=.*[a-zA-Z])/;
var ALPHANUMERICREGX_g = new RegExp("^[a-zA-Z0-9 _]+$");
var EditRowIndex = "";
var PageStatus = 1;
var Speciality_Count = "";

function fnGetProductAttributes() {
    if (PageStatus == 1) {
        debugger;
        $('#dvPanel').block({
            message: '<h3>Loading...</h3>',
            css: { border: '2px solid #ddd' }
        });
        $.ajax({
            type: "POST",
            url: "../HiDoctor_Master/ProductMaster/GetProductAttributes",
            async: false,
            data: $("form").serialize(),
            success: function (result) {
                result = eval('(' + result + ')');
                result_g = result;
                debugger;
                fnBindProductAttributes(result);
                if (isPopup == 0)
                    fnBindProduts(result);

                $('#dvPanel').unblock();
            }
        });
    }
}
function fnBindProductAttributes(result) {
    //Bind Speciality
    var speciality = $('#drpSpeciality');
    $('option', speciality).remove();
    $('#drpSpeciality').append(new Option("-Select Speciality-", "-Select Speciality-", true, true));
    //  if (isPopup == 0) $('#drpSpeciality').append(new Option("+ Add new speciality", "0", true, true));
    for (var i = 0; i < result.Tables[0].Rows.length; i++) {
        $('#drpSpeciality').append(new Option(result.Tables[0].Rows[i].Speciality_Name, result.Tables[0].Rows[i].Speciality_Code, true, true));
    }
    $("select#drpSpeciality").attr('selectedIndex', 0);
    $("#drpSpeciality").val('-Select Speciality-');
    //Brand
    var speciality = $('#drpBrand');
    $('option', speciality).remove();
    $('#drpBrand').append(new Option("-Select Brand-", "-Select Brand-", true, true));
    if (isPopup == 0)  // Inward bulk upload screen calls this product master screen as popup.
        $('#drpBrand').append(new Option("+ Add new brand", "0", true, true));

    for (var i = 0; i < result.Tables[1].Rows.length; i++) {
        $('#drpBrand').append(new Option(result.Tables[1].Rows[i].Brand_Name, result.Tables[1].Rows[i].Brand_Code, true, true));
    }
    $("select#drpBrand").attr('selectedIndex', 0);
    $("#drpBrand").val('-Select Brand-');
    //Competitor
    var speciality = $('#drpComp');
    $('option', speciality).remove();
    $('#drpComp').append(new Option("-Select Competitor-", "-Select Competitor-", true, true));
    if (isPopup == 0) $('#drpComp').append(new Option("+ Add new Competitor", "0", true, true));
    for (var i = 0; i < result.Tables[8].Rows.length; i++) {
        $('#drpComp').append(new Option(result.Tables[8].Rows[i].Competitor_Name, result.Tables[8].Rows[i].Competitor_Code, true, true));
    }
    $("select#drpComp").attr('selectedIndex', 0);
    $("#drpComp").val('-Select Competitor-');

    //Category
    var speciality = $('#drpCategory');
    $('option', speciality).remove();
    $('#drpCategory').append(new Option("-Select category-", "-Select category-", true, true));
    if (isPopup == 0) $('#drpCategory').append(new Option("+ Add new category", "0", true, true));
    for (var i = 0; i < result.Tables[2].Rows.length; i++) {
        $('#drpCategory').append(new Option(result.Tables[2].Rows[i].Category_Name, result.Tables[2].Rows[i].Category_Code, true, true));
    }
    $("select#drpCategory").attr('selectedIndex', 0);
    $("select#drpCategory").val('-Select category-');
    //UOM Type
    var speciality = $('#drpUOMType');
    $('option', speciality).remove();
    $('#drpUOMType').append(new Option("-Select UOM type-", "-Select UOM type-", true, true));
    if (isPopup == 0) $('#drpUOMType').append(new Option("+ Add new UOM type", "0", true, true));
    for (var i = 0; i < result.Tables[3].Rows.length; i++) {
        $('#drpUOMType').append(new Option(result.Tables[3].Rows[i].UOM_Type_Name, result.Tables[3].Rows[i].UOM_Type_Code, true, true));
    }
    $("select#drpUOMType").attr('selectedIndex', 0);
    $("#drpUOMType").val('-Select UOM type-');
    //UOM
    var speciality = $('#drpUOM');
    $('option', speciality).remove();
    $('#drpUOM').append(new Option("-Select UOM-", "-Select UOM-", true, true));
    if (isPopup == 0) $('#drpUOM').append(new Option("+ Add new UOM", "0", true, true));
    for (var i = 0; i < result.Tables[4].Rows.length; i++) {
        $('#drpUOM').append(new Option(result.Tables[4].Rows[i].UOM_Name, result.Tables[4].Rows[i].UOM_Code, true, true));
    }
    $("select#drpUOM").attr('selectedIndex', 0);
    $("#drpUOM").val('-Select UOM-');
    //Product Type
    var speciality = $('#drpProType');
    $('option', speciality).remove();
    $('#drpProType').append(new Option("-Select product type-", "-Select product type-", true, true));
    if (isPopup == 0) $('#drpProType').append(new Option("+ Add new Product Type", "0", true, true));
    for (var i = 0; i < result.Tables[5].Rows.length; i++) {
        $('#drpProType').append(new Option(result.Tables[5].Rows[i].Product_Type_Name, result.Tables[5].Rows[i].Product_Type_Code, true, true));
    }
    $("select#drpProType").attr('selectedIndex', 0);
    $("#drpProType").val('-Select product type-');

    if (isPopup == 1) {
        var options = $("select#drpProType").find("option");
        var productTypeVal = "";
        for (var i = 0; i < options.length; i++) {
            if ($(options[i]).text() == Product_Type) {
                productTypeVal = $(options[i]).val();
                break;
            }
        }
        $("select#drpProType").val(productTypeVal);
        $("#txtRefKey1").val(Product_Ref_Key);
        $("#txtRefKey1").prop("disabled", true);
    }

    //Product Group
    var speciality = $('#drpProGroup');
    $('option', speciality).remove();
    $('#drpProGroup').append(new Option("-Select product group-", "-Select product group-", true, true));
    if (isPopup == 0) $('#drpProGroup').append(new Option("+ Add new Product Group", "0", true, true));
    for (var i = 0; i < result.Tables[6].Rows.length; i++) {
        $('#drpProGroup').append(new Option(result.Tables[6].Rows[i].Product_Group_Name, result.Tables[6].Rows[i].Product_Group_Code, true, true));
    }
    $("select#drpProGroup").attr('selectedIndex', 0);
    $("#drpProGroup").val('-Select product group-');

}

//function fnBindProduts(result) {
//    debugger;
//    $('#dvPanel').block({
//        message: '<h3>Loading...</h3>',
//        css: { border: '2px solid #ddd' }
//    });
//    // ShowModalPopup('dvLoading');
//    var content = "";
//    content += "<table class='data display datatable'>";
//    content += "<thead><tr>";
//    content += "<td><b>Product Name</b></td>";
//    content += "<td><b>Speciality</b></td><td><b>Brand</b></td><td><b>Category</b></td><td><b>UOM Type</b></td>";
//    content += "<td><b>UOM</b></td><td><b>Product Type</b></td><td><b>Product Group</b></td><td><b>Description</b></td>";
//    content += "<td><b>Product Cost</b></td><td><b>Product Short Name</b></td><td><b>Status</b></td><td><b>Ref Key1</b></td><td><b>Action</b></td>";
//    content += "</tr></thead>";
//    content += "<tbody>";
//    for (var i = 0; i < result.Tables[7].Rows.length; i++) {
//        content += "<tr id='tr_" + i + "'>";
//        content += "<td id='tdProductName_" + i + "'>" + result.Tables[7].Rows[i].Product_Name + "</td>";
//        content += "<td>" + result.Tables[7].Rows[i].Speciality_Name + "</td>";
//        content += "<td>" + result.Tables[7].Rows[i].Brand_Name + "</td>";
//        content += "<td>" + result.Tables[7].Rows[i].Category_Name + "</td>";
//        content += "<td>" + result.Tables[7].Rows[i].UOM_Type_Name + "</td>";
//        content += "<td>" + result.Tables[7].Rows[i].UOM_Name + "</td>";
//        content += "<td id='tdProductTypeName_" + i + "'>" + result.Tables[7].Rows[i].Product_Type_Name + "</td>";
//        if (result.Tables[7].Rows[i].Product_Group_Name != null) {
//            content += "<td>" + result.Tables[7].Rows[i].Product_Group_Name + "</td>";
//        }
//        else {
//            content += "<td>-NIL-</td>";
//        }
//        content += "<td id='tdproductDesc_" + i + "'>" + result.Tables[7].Rows[i].Product_Description + "</td>";
//        if (result.Tables[7].Rows[i].Product_Cost != null) {
//            content += "<td id='tdCost_" + i + "'>" + result.Tables[7].Rows[i].Product_Cost + "</td>";
//        }
//        else {
//            content += "<td id='tdCost_" + i + "'>-NIL-</td>";
//        }
//        if (result.Tables[7].Rows[i].Product_Short_Name != null) {
//            content += "<td id='tdProductShortName_" + i + "'>" + result.Tables[7].Rows[i].Product_Short_Name + "</td>";
//        }
//        else {
//            content += "<td id='tdProductShortName_" + i + "'>-NIL-</td>";
//        }
//        content += "<td>" + result.Tables[7].Rows[i].Status + "</td>";
//        var ref_key1 = "";
//        if (result.Tables[7].Rows[i].Ref_Key1 != null) {
//            ref_key1 = result.Tables[7].Rows[i].Ref_Key1;
//        }
//        content += "<td id='tdRefKey1" + i + "'>" + ref_key1 + "</td>";
//        content += "<td><span onclick='fnEdit(" + i + ")' style='cursor:pointer;text-decoration:underline'>Edit</span> | ";
//        content += "<span onclick='fnChangeStatus(" + i + ")' style='cursor:pointer;text-decoration:underline'>Change Status</span> | ";
//        content += "<span onclick='fnAddBatch(" + i + ")' style='cursor:pointer;text-decoration:underline'>Add/View Batch</span>";
//        content += "<input type='hidden' id='hdnProductCode_" + i + "' value='" + result.Tables[7].Rows[i].Product_Code + "' />";
//        content += "<input type='hidden' id='hdnSpecialityCode_" + i + "' value='" + result.Tables[7].Rows[i].Speciality_Code + "' />";
//        content += "<input type='hidden' id='hdnBrandCode_" + i + "' value='" + result.Tables[7].Rows[i].Brand_Code + "' />";
//        content += "<input type='hidden' id='hdnCategoryCode_" + i + "' value='" + result.Tables[7].Rows[i].Category_Code + "' />";
//        content += "<input type='hidden' id='hdnUOMTypeCode_" + i + "' value='" + result.Tables[7].Rows[i].UOM_Type_Code + "' />";
//        content += "<input type='hidden' id='hdnUOMCode_" + i + "' value='" + result.Tables[7].Rows[i].UOM_Code + "' />";
//        content += "<input type='hidden' id='hdnProductTypeCode_" + i + "' value='" + result.Tables[7].Rows[i].Product_Type + "' />";
//        content += "<input type='hidden' id='hdnProductGroupCode_" + i + "' value='" + result.Tables[7].Rows[i].Product_Group_Code + "' />";
//        content += "<input type='hidden' id='hdnEffectiveFrom_" + i + "' value='" + result.Tables[7].Rows[i].Effective_From + "' />";
//        content += "<input type='hidden' id='hdnEffectiveTo_" + i + "' value='" + result.Tables[7].Rows[i].Effective_To + "' />";
//        content += "<input type='hidden' id='hdnCompetitor_" + i + "' value='" + result.Tables[7].Rows[i].Competitor_Code + "' />";
//        content += "<input type='hidden' id='hdnRefKey2_" + i + "' value='" + result.Tables[7].Rows[i].Ref_Key2 + "' />";
//        content += "</td>";
//        content += "</tr>";
//    }
//    content += "</tbody>";
//    content += "</table>";
//    $("#dvProducts").html(content);
//    if ($.fn.dataTable) { $('.datatable').dataTable({ "sPaginationType": "full_numbers", "bDestroy": true }); };
//    $('#dvPanel').unblock();
//    // HideModalPopup('dvLoading');
//}

function fnBindProduts(result) {
    debugger;
    if (result != '')
        $('#dvAllProducts').html('');
    var grid = new ej.grids.Grid({
        dataSource: result.Tables[7].Rows,

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
        frozenColumns: 0,
      
        pageSettings: { pageSize: 10, pageSizes: [10, 20, 30, 40, 50], pageCount: 10 },
        filterSettings: { type: 'CheckBox' },
        width: '100%',
        toolbar: ['Search', 'ColumnChooser'],

        aggregates: [],
        columns: [
                { field: 'Product_Name', headerText: 'Product Name', width: 200, textAlign: 'center' },
                { field: 'Product_Type_Name', headerText: 'Product Type', width: 200, textAlign: 'center' },
                { field: 'Product_Group_Name', headerText: 'Product Group', width: 200, textAlign: 'center' },
                { field: 'Brand_Name', headerText: 'Brand', width: 200, textAlign: 'center' },
                { field: 'Speciality_Name', headerText: 'Speciality', width: 200, textAlign: 'center' },
                { field: 'Category_Name', headerText: 'Category', width: 200, textAlign: 'center' },
                { field: 'UOM_Type_Name', headerText: 'UOM Type', width: 200, textAlign: 'center' },
                { field: 'UOM_Name', headerText: 'UOM', width: 200, textAlign: 'center' },
                { field: 'Product_Cost', headerText: 'Product Cost', width: 200, textAlign: 'center' },
                { field: 'Product_Short_Name', headerText: 'Product Short Name', width: 200, textAlign: 'center' },
                { field: 'Ref_Key1', headerText: 'Ref Key 1', width: 200, textAlign: 'center' },
                { field: 'Status', headerText: 'Status', width: 200, textAlign: 'center' },
                { headerText: 'Edit', width: 200, textAlign: 'center' },
                { headerText: 'Change Status', width: 200, textAlign: 'center' },
                { headerText: 'Add/View Batch', width: 200, textAlign: 'center' },
        ],
        queryCellInfo: queryCellInfo1,
    });
    grid.appendTo('#dvAllProducts');
    var style = $("#customSyncStyle").html();
    $("#customSyncStyle").html(style)
}
function queryCellInfo1(args) {
    debugger;
    if (args.column.headerText == "Edit") {
        debugger;
        args.cell.style.cursor = "pointer";
        args.cell.style.color = "blue";
        //args.cell.style.cursor = "pointer";
        args.cell.style.textDecoration = "underline";

        args.cell.innerHTML = "<a onclick='fnEdit(" + args + ")'>Edit</a>"
        $(args.cell).bind("click", function () {
            debugger;

            fnEdit(args);
        })
    }
    if (args.column.headerText == "Change Status") {
        debugger;
        args.cell.style.cursor = "pointer";
        args.cell.style.color = "blue";
        //args.cell.style.cursor = "pointer";
        args.cell.style.textDecoration = "underline";

        //TS- 825 - shiled was unable edit the product has Itran was being test sales drive is not supported any more since removing this check.
        // args.cell.innerHTML = "<a onclick='fnChangeStatus(" + args + ")'>Change Status</a>"
        args.cell.innerHTML = "<a>Change Status</a>"

        $(args.cell).bind("click", function () {
            debugger;
            fnChangeProductStatus(args);
            //fnChangeStatus(args);
        })
    }
    if (args.column.headerText == "Add/View Batch") {
        (args.cell.innerText == "Add/View Batch")
        debugger;
        args.cell.style.cursor = "pointer";
        args.cell.style.color = "blue";
        //args.cell.style.cursor = "pointer";
        args.cell.style.textDecoration = "underline";

        args.cell.innerHTML = "<a onclick='fnAddBatch(" + args + ")'>Add/View Batch</a>"
        $(args.cell).bind("click", function () {
            debugger;

            fnAddBatch(args);
        })
    }
}
function fnAddBatch(rowIndex) {
    debugger;
    //  var ProductCode = $("#hdnProductCode_" + rowIndex).val();
    var ProductCode = rowIndex.data.Product_Code;
    $('#dvAjaxLoad').hide();
    $.modal({ ajax: '../HiDoctor_Master/ProductMaster/ProductBatch?ProductCode=' + ProductCode, title: 'Add / Edit Batch', overlayClose: false });
}

function fnProductTypeChangeStatus(rowIndex) {
    debugger;
    var rowedit = $('#hdProductTypeIndex').val();
    $("#hdnMode").val("C");
    var code = rowIndex.data.Product_Type_Code;
    var name = rowIndex.data.Product_Type_Name;

    $("#hdnProductTypeCode").val(code);

    $.ajax({
        type: "POST",
        url: "ProductMaster/InsertProductType",
        data: "ProductType=" + $("#txtProductTypeName").val() + "&ProductTypeCode=" + $("#hdnProductTypeCode").val() + "&Mode=" + $("#hdnMode").val() + "",
        success: function (result) {
            if (result.split(':')[0].toUpperCase() == "SUCCESS") {
                fnMsgAlert('info', 'Product Type Master', result.split(':')[1]);
                $("#hdnMode").val("S");
                if (isBase != undefined) {
                    if (isBase == "Y") {
                        var ProductTypeJson = new Array();
                        $('#drpProType Option').each(function () {
                            debugger;
                            ProductTypeJson.push($(this).text() + " : " + $(this).val());
                        });
                        var flag = 0;
                        for (var i = 0; i < ProductTypeJson.length; i++) {
                            if (ProductTypeJson[i].split(':')[0].trim() == $("#txtProductTypeName").val()) {
                                flag = 1;
                            }
                        }
                        debugger;
                        if (flag == 0) {
                            $.ajax({
                                type: "POST",
                                url: "../HiDoctor_Master/ProductMaster/GetProductAttributes",
                                async: false,
                                data: $("form").serialize(),
                                success: function (result) {
                                    result = eval('(' + result + ')');
                                    result_g = result;
                                    $('#drpProType').empty();
                                    $('#drpProType').append(new Option("-Select product type-", "-Select product type-", true, true));
                                    $('#drpProType').append(new Option("+ Add new Product Type", "0", true, true));
                                    for (var i = 0; i < result.Tables[5].Rows.length; i++) {
                                        $('#drpProType').append(new Option(result.Tables[5].Rows[i].Product_Type_Name, result.Tables[5].Rows[i].Product_Type_Code, true, true));
                                    }

                                    $('#dvPanel').unblock();
                                }
                            });
                        }
                        fnGetAllProductType();
                        if (rowedit != "" || rowedit != undefined) {
                            var productTypeCode = $("#hdnProductTypeCode_" + rowedit).val();
                            $('#drpProType').val(productTypeCode);
                            EditRowIndex = $('#hdProductTypeIndex').val();
                        }
                        $("#txtProductTypeName").val('');
                    }
                }
            }
            else {
                fnMsgAlert('info', 'Product Type Master', result.split(':')[1]);
                $("#hdnMode").val("S");
            }
        }
    });
}

function fnInsertProductType() {
    debugger;
    var rowedit = $('#hdProductTypeIndex').val();
    if ($.trim($("#txtProductTypeName").val()) == "") {
        fnMsgAlert('info', 'Product Type Master', 'Please enter product type');
        return false;
    }
    if ($.trim($('#hdProductTypeIndex').val()).length > 0) {
        if (!fnCheckSpecialChar('hdProductTypeIndex')) {
            fnMsgAlert('info', 'Product Type Master', 'Please remove the special characters in  product type.');
            return false;
        }
    }
    var disjson = $.grep(producttypelst_g, function (element, index) {
        return (element.Product_Type_Name).toUpperCase() == ($("#txtProductTypeName").val()).toUpperCase();
    });
    if (disjson.length > 0) {
        fnMsgAlert('info', 'Product Master', 'Product Type Name already exists');
        return false;
    }
    $.ajax({
        type: "POST",
        url: "ProductMaster/InsertProductType",
        data: "ProductType=" + $("#txtProductTypeName").val() + "&ProductTypeCode=" + $("#hdnProductTypeCode").val() + "&Mode=" + $("#hdnMode").val() + "",
        success: function (result) {
            if (result.split(':')[0].toUpperCase() == "SUCCESS") {
                //$("#message").html(result.split(':')[1].toUpperCase())
                //$("#message").css('color', 'green');
                fnMsgAlert('info', 'Product Type Master', result.split(':')[1]);
                if (isBase != undefined) {
                    if (isBase == "Y") {
                        var ProductTypeJson = new Array();
                        $('#drpProType').each(function () {
                            ProductTypeJson.push($(this).text() + " : " + $(this).val());
                        });
                        var flag = 0;
                        for (var i = 0; i < ProductTypeJson.length; i++) {
                            if (ProductTypeJson[i].split(':')[0].trim() == $("#txtProductTypeName").val()) {
                                flag = 1;

                            }
                        }
                        debugger;
                        if (flag == 0) {
                            $.ajax({
                                type: "POST",
                                url: "../HiDoctor_Master/ProductMaster/GetProductAttributes",
                                async: false,
                                data: $("form").serialize(),
                                success: function (result) {
                                    result = eval('(' + result + ')');
                                    result_g = result;
                                    $('#drpProType').empty();
                                    $('#drpProType').append(new Option("-Select product type-", "-Select product type-", true, true));
                                    $('#drpProType').append(new Option("+ Add new Product Type", "0", true, true));
                                    for (var i = 0; i < result.Tables[5].Rows.length; i++) {
                                        $('#drpProType').append(new Option(result.Tables[5].Rows[i].Product_Type_Name, result.Tables[5].Rows[i].Product_Type_Code, true, true));
                                    }

                                    $('#dvPanel').unblock();
                                }
                            });
                        }
                        fnGetAllProductType();
                        if (rowedit != "" || rowedit != undefined) {
                            var productTypeCode = $("#hdnProductTypeCode_" + rowedit).val();
                            $('#drpProType').val(productTypeCode);
                            EditRowIndex = $('#hdProductTypeIndex').val();
                        }
                        $("#txtProductTypeName").val('');
                    }
                }
            }
            else {
                //$("#message").html(result.split(':')[1].toUpperCase())
                //$("#message").css('color', '#C85305');
                fnMsgAlert('info', 'Product Type Master', result.split(':')[1]);
            }
        }
    });
}

function fnInsertUOM() {
    debugger;
    var rowedit = $('#hdnUOMIndex').val();
    if ($.trim($("#txtUOMName").val()) == "") {
        fnMsgAlert('info', 'UOM Master', 'Please enter UOM');
        return false;
    }
    if ($.trim($('#txtUOMName').val()).length > 0) {
        if (!fnCheckSpecialChar('txtUOMName')) {
            fnMsgAlert('info', 'UOM Master', 'Please remove the special characters in UOM.');
            return false;
        }
    }
    var disjson = $.grep(UOMlst_g, function (element, index) {
        return (element.UOM_Name).toUpperCase() == ($("#txtUOMName").val()).toUpperCase();
    });
    if (disjson.length > 0) {
        fnMsgAlert('info', 'Product Master', 'UOM Name already exists');
        return false;
    }
    $.ajax({
        type: "POST",
        url: "ProductMaster/InsertUOM",
        data: "UOM=" + $("#txtUOMName").val() + "&UOMCode=" + $("#hdnUOMCode").val() + "&Mode=" + $("#hdnMode").val() + "",
        success: function (result) {
            if (result.split(':')[0].toUpperCase() == "SUCCESS") {
                //$("#message").html(result.split(':')[1].toUpperCase())
                //$("#message").css('color', 'green');
                fnMsgAlert('info', 'UOM Master', result.split(':')[1]);
                if (isBase != undefined) {
                    if (isBase == "Y") {
                        var UOMJson = new Array();
                        $('#drpUOM  option').each(function (i) {
                            UOMJson.push($(this).text() + " : " + $(this).val());
                        });
                        var flag = 0;
                        for (var i = 0; i < UOMJson.length; i++) {
                            if (UOMJson[i].split(':')[0].trim() == $("#txtUOMName").val()) {
                                debugger;
                                flag = 1;

                            }
                        }
                        debugger;
                        if (flag == 0) {
                            $.ajax({
                                type: "POST",
                                url: "../HiDoctor_Master/ProductMaster/GetProductAttributes",
                                async: false,
                                data: $("form").serialize(),
                                success: function (result) {
                                    result = eval('(' + result + ')');
                                    result_g = result;
                                    $('#drpUOM').empty();
                                    $('#drpUOM').append(new Option("-Select UOM-", "-Select UOM-", true, true));
                                    $('#drpUOM').append(new Option("+ Add new UOM", "0", true, true));
                                    for (var i = 0; i < result.Tables[4].Rows.length; i++) {
                                        $('#drpUOM').append(new Option(result.Tables[4].Rows[i].UOM_Name, result.Tables[4].Rows[i].UOM_Code, true, true));
                                    }

                                    $('#dvPanel').unblock();
                                }
                            });
                        }
                        fnGetAllUOM();
                        if (rowedit != "" || rowedit != undefined) {
                            var UOMCode = $("#hdnUOMCode_" + rowedit).val();
                            $('#drpUOM').val(UOMCode);
                            fnUOMClearAll();
                            EditRowIndex = $('#hdnUOMIndex').val();
                        }
                        $("#txtUOMName").val('');
                    }
                }
            }
            else {
                //$("#message").html(result.split(':')[1].toUpperCase())
                //$("#message").css('color', '#C85305');
                fnMsgAlert('info', 'UOM Master', result.split(':')[1]);
            }
        }
    });
}

function fnUOMChangeStatus(rowIndex) {
    debugger;
    var rowedit = $('#hdnUOMIndex').val();
    $("#hdnMode").val("C");
    var code = rowIndex.data.UOM_Code;
    var name = rowIndex.data.UOM_Name;

    $("#hdnUOMCode").val(code);

    $.ajax({
        type: "POST",
        url: "ProductMaster/InsertUOM",
        data: "UOM=" + name + "&UOMCode=" + code + "&Mode=" + $("#hdnMode").val() + "",
        success: function (result) {
            if (result.split(':')[0].toUpperCase() == "SUCCESS") {

                fnMsgAlert('info', 'UOM Master', result.split(':')[1]);
                $("#hdnMode").val("S");
                if (isBase != undefined) {
                    if (isBase == "Y") {
                        var UOMJson = new Array();
                        $('#drpUOM  option').each(function (i) {
                            debugger;
                            UOMJson.push($(this).text() + " : " + $(this).val());
                        });
                        var flag = 0;
                        for (var i = 0; i < UOMJson.length; i++) {
                            if (UOMJson[i].split(':')[0].trim() == $("#txtUOMName").val()) {
                                flag = 1;

                            }
                        }

                        debugger;
                        if (flag == 0) {
                            $.ajax({
                                type: "POST",
                                url: "../HiDoctor_Master/ProductMaster/GetProductAttributes",
                                async: false,
                                data: $("form").serialize(),
                                success: function (result) {
                                    result = eval('(' + result + ')');
                                    result_g = result;
                                    $('#drpUOM').empty();
                                    $('#drpUOM').append(new Option("-Select UOM-", "-Select UOM-", true, true));
                                    $('#drpUOM').append(new Option("+ Add new UOM", "0", true, true));
                                    for (var i = 0; i < result.Tables[4].Rows.length; i++) {
                                        $('#drpUOM').append(new Option(result.Tables[4].Rows[i].UOM_Name, result.Tables[4].Rows[i].UOM_Code, true, true));
                                    }

                                    $('#dvPanel').unblock();
                                }
                            });
                        }
                        fnGetAllUOM();
                        if (rowedit != "" || rowedit != undefined) {
                            var UOMCode = $("#hdnUOMCode_" + rowedit).val();
                            $('#drpUOM').val(UOMCode);
                            fnUOMClearAll();
                            EditRowIndex = $('#hdnUOMIndex').val();
                        }
                        $("#txtUOMName").val('');

                    }
                }
            }
            else {

                fnMsgAlert('info', 'UOM Master', result.split(':')[1]);
                $("#hdnMode").val("S");
            }
        }
    });
}

function fnInsertUOMType() {
    debugger;
    var rowedit = $('#hdnUOMRowIndex').val();
    if ($.trim($("#txtUOMTypeName").val()) == "") {
        fnMsgAlert('info', 'UOM Type Master', 'Please enter UOM Type.');
        return false;
    }
    if ($.trim($('#txtUOMTypeName').val()).length > 0) {
        if (!fnCheckSpecialChar('txtUOMTypeName')) {
            fnMsgAlert('info', 'UOM Type Master', 'Please remove the special characters in UOM Type.');
            return false;
        }
    }
    var disjson = $.grep(UOMTypelst_g, function (element, index) {
        return (element.UOM_Type_Name).toUpperCase() == ($("#txtUOMTypeName").val()).toUpperCase();
    });
    if (disjson.length > 0) {
        fnMsgAlert('info', 'Product Master', 'UOM Type Name already exists');
        return false;
    }
    $.ajax({
        type: "POST",
        url: "ProductMaster/InsertUOMType",
        data: "UOMTypeName=" + $("#txtUOMTypeName").val() + "&UOMTypeCode=" + $("#hdnUOMTypeCode").val() + "&Mode=" + $("#hdnMode").val() + "",
        success: function (result) {
            if (result.split(':')[0].toUpperCase() == "SUCCESS") {
                //$("#message").html(result.split(':')[1].toUpperCase())
                //$("#message").css('color', 'green');
                fnMsgAlert('info', 'UOM Type Master', result.split(':')[1]);
                if (isBase != undefined) {
                    if (isBase == "Y") {
                        //fnGetProductAttributes();
                        var UOMJson = new Array();
                        $('#drpUOMType  option').each(function (i) {
                            debugger;
                            UOMJson.push($(this).text() + " : " + $(this).val());
                        });
                        var flag = 0;
                        for (var i = 0; i < UOMJson.length; i++) {
                            if (UOMJson[i].split(':')[0].trim() == $("#txtUOMTypeName").val()) {
                                flag = 1;

                            }
                        }
                        debugger;

                        if (flag == 0) {
                            $.ajax({
                                type: "POST",
                                url: "../HiDoctor_Master/ProductMaster/GetProductAttributes",
                                async: false,
                                data: $("form").serialize(),
                                success: function (result) {
                                    result = eval('(' + result + ')');
                                    result_g = result;
                                    $('#drpUOMType').empty();
                                    $('#drpUOMType').append(new Option("-Select UOM Type-", "-Select UOM Type-", true, true));
                                    $('#drpUOMType').append(new Option("+ Add new UOM Type", "0", true, true));
                                    for (var i = 0; i < result.Tables[3].Rows.length; i++) {
                                        $('#drpUOMType').append(new Option(result.Tables[3].Rows[i].UOM_Type_Name, result.Tables[3].Rows[i].UOM_Type_Code, true, true));
                                    }

                                    $('#dvPanel').unblock();
                                }
                            });
                        }
                        fnGetAllUOMType();
                        if (rowedit != "" || rowedit != undefined) {
                            var UOMTypeCode = $("#hdnUOMTypeCode_" + rowedit).val();
                            $('#drpUOMType').val(UOMTypeCode);
                            EditRowIndex = $('#hdnUOMRowIndex').val();
                        }
                        fnUOMTypeClearAll();
                        $("#txtUOMTypeName").val('');
                    }
                }
            }
            else {
                //$("#message").html(result.split(':')[1].toUpperCase())
                //$("#message").css('color', '#C85305');
                fnMsgAlert('info', 'UOM Type Master', result.split(':')[1]);
                return false;
            }
        }
    });
}

function fnUOMTypeChangeStatus(rowIndex) {
    debugger;
    var rowedit = $('#hdnUOMRowIndex').val();
    $("#hdnMode").val("C");
    var brandCode = rowIndex.data.UOM_Type_Code;
    var brandName = rowIndex.data.UOM_Type_Name;

    $("#hdnUOMTypeCode").val(brandCode);

    $.ajax({
        type: "POST",
        url: "ProductMaster/InsertUOMType",
        data: "UOMTypeName=" + brandName + "&UOMTypeCode=" + brandCode + "&Mode=" + $("#hdnMode").val() + "",
        success: function (result) {
            if (result.split(':')[0].toUpperCase() == "SUCCESS") {

                fnMsgAlert('info', 'UOM Type Master', result.split(':')[1]);
                $("#hdnMode").val("S");

                if (isBase != undefined) {
                    if (isBase == "Y") {
                        var UOMJson = new Array();
                        $('#drpUOMType  option').each(function (i) {
                            UOMJson.push($(this).text() + " : " + $(this).val());
                        });
                        var flag = 0;
                        for (var i = 0; i < UOMJson.length; i++) {
                            if (UOMJson[i].split(':')[0].trim() == $("#txtUOMTypeName").val()) {
                                flag = 1;

                            }
                        }
                        debugger;

                        if (flag == 0) {
                            $.ajax({
                                type: "POST",
                                url: "../HiDoctor_Master/ProductMaster/GetProductAttributes",
                                async: false,
                                data: $("form").serialize(),
                                success: function (result) {
                                    result = eval('(' + result + ')');
                                    result_g = result;
                                    $('#drpUOMType').empty();
                                    $('#drpUOMType').append(new Option("-Select UOM Type-", "-Select UOM Type-", true, true));
                                    $('#drpUOMType').append(new Option("+ Add new UOM Type", "0", true, true));
                                    for (var i = 0; i < result.Tables[3].Rows.length; i++) {
                                        $('#drpUOMType').append(new Option(result.Tables[3].Rows[i].UOM_Type_Name, result.Tables[3].Rows[i].UOM_Type_Code, true, true));
                                    }

                                    $('#dvPanel').unblock();
                                }
                            });
                        }
                        fnGetAllUOMType();
                        if (rowedit != "" || rowedit != undefined) {
                            var UOMTypeCode = $("#hdnUOMTypeCode_" + rowedit).val();
                            $('#drpUOMType').val(UOMTypeCode);
                            EditRowIndex = $('#hdnUOMRowIndex').val();
                        }
                        fnUOMTypeClearAll();
                        $("#txtUOMTypeName").val('');
                    }
                }
            }
            else {

                fnMsgAlert('info', 'UOM Type Master', result.split(':')[1]);
                $("#hdnMode").val("S");
            }
        }
    });
}

function fnInsertCategory() {
    debugger;
    var rowedit = $('#hdnCategoryRowIndex').val();
    if ($.trim($("#txtCategoryName").val()) == "") {
        fnMsgAlert('info', 'Category Master', 'Please enter Category Name.');
        return false;
    }
    if ($.trim($('#txtCategoryName').val()).length > 0) {
        if (!fnCheckSpecialChar('txtCategoryName')) {
            fnMsgAlert('info', 'Category Master', 'Please remove the special characters in Category Name.');
            return false;
        }
    }
    var disjson = $.grep(categorylst_g, function (element, index) {
        return (element.Category_Name).toUpperCase() == ($('#txtCategoryName').val()).toUpperCase();
    });
    if (disjson.length > 0) {
        fnMsgAlert('info', 'Category Master', 'Category Name already exists');
        return false;
    }
    $.ajax({
        type: "POST",
        url: "ProductMaster/InsertCategory",
        data: "CategoryName=" + $("#txtCategoryName").val() + "&CategoryCode=" + $("#hdnCategoryCode").val() + "&Mode=" + $("#hdnMode").val() + "",
        success: function (result) {
            if (result.split(':')[0].toUpperCase() == "SUCCESS") {
                //$("#message").html(result.split(':')[1].toUpperCase())
                //$("#message").css('color', 'green');
                fnMsgAlert('info', 'Product Master', result.split(':')[1].toUpperCase());
                if (isBase != undefined) {
                    if (isBase == "Y") {
                        var CategoryJson = new Array();
                        $('#drpCategory  option').each(function (i) {
                            debugger;
                            CategoryJson.push($(this).text() + " : " + $(this).val());
                        });
                        var flag = 0;
                        for (var i = 0; i < CategoryJson.length; i++) {
                            if (CategoryJson[i].split(':')[0].trim() == $("#txtCategoryName").val()) {
                                flag = 1;
                            }
                        }
                        debugger;

                        if (flag == 0) {
                            $.ajax({
                                type: "POST",
                                url: "../HiDoctor_Master/ProductMaster/GetProductAttributes",
                                async: false,
                                data: $("form").serialize(),
                                success: function (result) {
                                    result = eval('(' + result + ')');
                                    result_g = result;
                                    $('#drpCategory').empty();
                                    $('#drpCategory').append(new Option("-Select Category-", "-Select Category-", true, true));
                                    $('#drpCategory').append(new Option("+ Add new Category", "0", true, true));
                                    for (var i = 0; i < result.Tables[2].Rows.length; i++) {
                                        $('#drpCategory').append(new Option(result.Tables[2].Rows[i].Category_Name, result.Tables[2].Rows[i].Category_Code, true, true));
                                    }

                                    $('#dvPanel').unblock();
                                }
                            });
                        }
                        fnGetAllCategory();
                        if (rowedit != "" || rowedit != undefined) {
                            var categoryCode = $("#hdnCategoryCode_" + rowedit).val();
                            $('#drpCategory').val(categoryCode);
                            EditRowIndex = $('#hdnCategoryRowIndex').val();
                        }
                        fnCategoryClearAll();
                        $("#txtCategoryName").val('');
                    }
                }
            }
            else {

                fnMsgAlert('info', 'Category Master', result.split(':')[1]);
                return false;
            }
        }
    });
}
function fnCategoryChangeStatus(rowIndex) {
    var rowedit = $('#hdnCategoryRowIndex').val();
    $("#hdnMode").val("C");
    //var brandCode = $("#hdnCategory_" + rowIndex).val();
    //var brandName = $("#tdCategory_" + rowIndex).html();
    var brandCode = rowIndex.data.Category_Code;
    var brandName = rowIndex.data.Category_Name;
    $("#hdnCategoryCode").val(brandCode);

    $.ajax({
        type: "POST",
        url: "ProductMaster/InsertCategory",
        data: "CategoryName=" + $("#txtBrandName").val() + "&CategoryCode=" + $("#hdnCategoryCode").val() + "&Mode=" + $("#hdnMode").val() + "",
        success: function (result) {
            if (result.split(':')[0].toUpperCase() == "SUCCESS") {
                fnMsgAlert('info', 'Category Master', result.split(':')[1]);
                $("#hdnMode").val("S");
                if (isBase != undefined) {
                    if (isBase == "Y") {
                        debugger;
                        var CategoryJson = new Array();
                        $('#drpCategory  option').each(function (i) {
                            debugger;
                            CategoryJson.push($(this).text() + " : " + $(this).val());
                        });
                        var flag = 0;
                        for (var i = 0; i < CategoryJson.length; i++) {
                            if (CategoryJson[i].split(':')[0].trim() == $("#txtBrandName").val()) {
                                flag = 1;

                            }
                        }
                        debugger;

                        if (flag == 0) {
                            $.ajax({
                                type: "POST",
                                url: "../HiDoctor_Master/ProductMaster/GetProductAttributes",
                                async: false,
                                data: $("form").serialize(),
                                success: function (result) {
                                    result = eval('(' + result + ')');
                                    result_g = result;
                                    $('#drpCategory').empty();
                                    $('#drpCategory').append(new Option("-Select Category-", "-Select Category-", true, true));
                                    $('#drpCategory').append(new Option("+ Add new Category", "0", true, true));
                                    for (var i = 0; i < result.Tables[2].Rows.length; i++) {
                                        $('#drpCategory').append(new Option(result.Tables[2].Rows[i].Category_Name, result.Tables[2].Rows[i].Category_Code, true, true));
                                    }

                                    $('#dvPanel').unblock();
                                }
                            });
                        }
                        fnGetAllCategory();
                        if (rowedit != "" || rowedit != undefined) {
                            var categoryCode = $("#hdnCategoryCode_" + rowedit).val();
                            $('#drpCategory').val(categoryCode);
                            EditRowIndex = $('#hdnCategoryRowIndex').val();
                        }
                        fnCategoryClearAll();
                        $("#txtCategoryName").val('');
                    }
                }
            }
            else {
                fnMsgAlert('info', 'Category Master', result.split(':')[1]);
                $("#hdnMode").val("S");
            }
        }
    });
}

function fnInsertBrand() {
    debugger;
    var rowedit = $('#hdnBrandRowIndex').val();
    var brandcode = $("hdnBrandCode").val();
    if ($.trim($("#txtBrandName").val()) == "") {
        fnMsgAlert('info', 'Brand Master', 'Please enter Brand Name');
        return false;
    }
    if ($.trim($('#txtBrandName').val()).length > 0) {
        if (!fnCheckSpecialChar('txtBrandName')) {
            fnMsgAlert('info', 'Brand Master', 'Please remove the special characters in Brand Name.');
            return false;
        }
    }
    var disjson = $.grep(brandlst_g, function (element, index) {
        return (element.Brand_Name).toUpperCase() == ($("#txtBrandName").val()).toUpperCase();
    });
    if (disjson.length > 0) {
        debugger;
        fnMsgAlert('info', 'Brand Master', 'Brand Name already exists');
        return false;
    }
    $.ajax({
        type: "POST",
        url: "ProductMaster/InsertBrand",
        data: "BrandName=" + $("#txtBrandName").val() + "&BrandCode=" + $("#hdnBrandCode").val() + "&Mode=" + $("#hdnMode").val() + "",
        async: false,
        success: function (result) {
            debugger;
            if (result.split(':')[0].toUpperCase() == "SUCCESS") {
                fnMsgAlert('info', 'Brand Master', result.split(':')[1]);
                if (isBase != undefined) {
                    if (isBase == "Y") {
                        var BrandJson = new Array();
                        $('#drpBrand  option').each(function (i) {
                            BrandJson.push($(this).text() + " : " + $(this).val());
                        });
                        var flag = 0;
                        for (var i = 0; i < BrandJson.length; i++) {
                            if (BrandJson[i].split(':')[0].trim() == $("#txtBrandName").val()) {
                                flag = 1;
                            }
                        }
                        debugger;

                        if (flag == 0) {
                            $.ajax({
                                type: "POST",
                                url: "../HiDoctor_Master/ProductMaster/GetProductAttributes",
                                async: false,
                                data: $("form").serialize(),
                                success: function (result) {
                                    result = eval('(' + result + ')');
                                    result_g = result;
                                    $('#drpBrand').empty();
                                    $('#drpBrand').append(new Option("-Select Brand-", "-Select Brand-", true, true));
                                    $('#drpBrand').append(new Option("+ Add new Brand", "0", true, true));
                                    for (var i = 0; i < result.Tables[1].Rows.length; i++) {
                                        $('#drpBrand').append(new Option(result.Tables[1].Rows[i].Brand_Name, result.Tables[1].Rows[i].Brand_Code, true, true));
                                    }

                                    $('#dvPanel').unblock();
                                }
                            });
                        }
                        fnGetAllBrand();
                        if (rowedit != "" || rowedit != undefined) {
                            var brandCode = $("#hdnBrandCode_" + rowedit).val();
                            $('#drpBrand').val(brandCode);
                            EditRowIndex = $('#hdnBrandRowIndex').val();
                        }

                        fnBrandClearAll();
                        $("#txtBrandName").val('');
                    }
                }
            }
            else {
                fnMsgAlert('info', 'Brand Master', result.split(':')[1]);
            }
        }
    });
}
function fnInsertComp() {
    var rowedit = $('#hdnCompRowIndex').val();
    if ($.trim($("#txtCompName").val()) == "") {
        fnMsgAlert('info', 'Competitor Master', 'Please enter Competitor Name.');
        return false;
    }
    if ($.trim($('#txtCompName').val()).length > 0) {
        if (!fnCheckSpecialChar('txtCompName')) {
            fnMsgAlert('info', 'Competitor Master', 'Please remove the special characters in Competitor Name.');
            return false;
        }
    }
    var disjson = $.grep(complst_g, function (element, index) {
        return (element.Competitor_Name).toUpperCase() == ($('#txtCompName').val()).toUpperCase();
    });
    if (disjson.length > 0) {
        fnMsgAlert('info', 'Competitor Master', 'Competitor Name already exists');
        return false;
    }
    $.ajax({
        type: "POST",
        url: "ProductMaster/InsertCompetitor",
        data: "CompetitorName=" + $("#txtCompName").val() + "&CompetitorCode=" + $("#hdnCompCode").val() + "&Mode=" + $("#hdnMode").val() + "",
        async: false,
        success: function (result) {
            if (result.split(':')[0].toUpperCase() == "SUCCESS") {
                fnMsgAlert('info', 'Competitor Master', result.split(':')[1]);
                if (isBase != undefined) {
                    if (isBase == "Y") {
                        var CompJson = new Array();
                        $('#drpComp  option').each(function (i) {
                            CompJson.push($(this).text() + " : " + $(this).val());
                        });
                        var flag = 0;
                        for (var i = 0; i < CompJson.length; i++) {
                            if (CompJson[i].split(':')[0].trim() == $("#txtCompName").val()) {
                                flag = 1;

                            }
                        }
                        debugger;

                        if (flag == 0) {
                            $.ajax({
                                type: "POST",
                                url: "../HiDoctor_Master/ProductMaster/GetProductAttributes",
                                async: false,
                                data: $("form").serialize(),
                                success: function (result) {
                                    result = eval('(' + result + ')');
                                    result_g = result;
                                    $('#drpComp').empty();
                                    $('#drpComp').append(new Option("-Select Competitor-", "-Select Competitor-", true, true));
                                    $('#drpComp').append(new Option("+ Add new Competitor", "0", true, true));
                                    for (var i = 0; i < result.Tables[8].Rows.length; i++) {
                                        $('#drpComp').append(new Option(result.Tables[8].Rows[i].Competitor_Name, result.Tables[8].Rows[i].Competitor_Code, true, true));
                                    }

                                    $('#dvPanel').unblock();
                                }
                            });
                        }
                        fnGetAllCompetitor();
                        if (rowedit != "" || rowedit != undefined) {
                            var CompCode = $("#hdnCompCode_" + rowedit).val();
                            $('#drpComp').val(CompCode);
                            EditRowIndex = $('#hdnCompRowIndex').val();
                        }
                        fnCompClearAll();
                        $("#txtCompName").val('');
                    }
                }
            }
            else {
                fnMsgAlert('info', 'Competitor Master', result.split(':')[1]);
            }
        }
    });
}

function fnBrandChangeStatus(rowIndex) {
    debugger;
    var rowedit = $('#hdnBrandRowIndex').val();
    $("#hdnMode").val("C");
    //var brandCode = $("#hdnBrand_" + rowIndex).val();
    //var brandName = $("#tdBrand_" + rowIndex).html();
    var brandCode = rowIndex.data.Brand_Code;
    var brandName = rowIndex.data.Brand_Name;
    $("#hdnBrandCode").val(brandCode);

    $.ajax({
        type: "POST",
        url: "ProductMaster/InsertBrand",
        data: "BrandName=" + brandName + "&BrandCode=" + brandCode + "&Mode=" + $("#hdnMode").val() + "",
        success: function (result) {
            debugger;
            if (result.split(':')[0].toUpperCase() == "SUCCESS") {
                fnMsgAlert('info', 'Brand Master', result.split(':')[1]);
                $("#hdnMode").val("S");
                if (isBase != undefined) {
                    debugger;
                    if (isBase == "Y") {
                        var BrandJson = new Array();
                        $('#drpBrand  option').each(function (i) {
                            BrandJson.push($(this).text() + " : " + $(this).val());
                        });
                        var flag = 0;

                        for (var i = 0; i < BrandJson.length; i++) {
                            if (BrandJson[i].split(':')[0].trim() == $("#txtBrandName").val()) {
                                flag = 1;
                            }
                        }
                        debugger;

                        if (flag == 0) {
                            $.ajax({
                                type: "POST",
                                url: "../HiDoctor_Master/ProductMaster/GetProductAttributes",
                                async: false,
                                data: $("form").serialize(),
                                success: function (result) {
                                    result = eval('(' + result + ')');
                                    result_g = result;
                                    $('#drpBrand').empty();
                                    $('#drpBrand').append(new Option("-Select Brand-", "-Select Brand-", true, true));
                                    $('#drpBrand').append(new Option("+ Add new Brand", "0", true, true));
                                    for (var i = 0; i < result.Tables[1].Rows.length; i++) {
                                        $('#drpBrand').append(new Option(result.Tables[1].Rows[i].Brand_Name, result.Tables[1].Rows[i].Brand_Code, true, true));
                                    }

                                    $('#dvPanel').unblock();
                                }
                            });
                        }
                        fnGetAllBrand();
                        if (rowedit != "" || rowedit != undefined) {
                            var brandCode = $("#hdnBrandCode_" + rowedit).val();
                            $('#drpBrand').val(brandCode);
                            EditRowIndex = $('#hdnBrandRowIndex').val();
                        }
                        fnBrandClearAll();
                    }
                }
            }
            else {
                fnMsgAlert('info', 'Brand Master', result.split(':')[1]);
                $("#hdnMode").val("S");
            }
        }
    });
}
function fnCompChangeStatus(rowIndex) {
    debugger;
    var rowedit = $('#hdnCompRowIndex').val();
    $("#hdnMode").val("C");
    //var CompCode = $("#hdnComp_" + rowIndex).val();
    //var CompName = $("#tdComp_" + rowIndex).html();
    var CompCode = rowIndex.data.Competitor_Code;
    var CompName = rowIndex.data.Competitor_Name;
    $("#hdnCompCode").val(CompCode);
    $.ajax({
        type: "POST",
        url: "ProductMaster/InsertCompetitor",
        data: "CompetitorName=" + CompName + "&CompetitorCode=" + CompCode + "&Mode=" + $("#hdnMode").val() + "",
        success: function (result) {
            if (result.split(':')[0].toUpperCase() == "SUCCESS") {

                fnMsgAlert('info', 'Competitor Master', result.split(':')[1]);
                $("#hdnMode").val("S");
                if (isBase != undefined) {
                    debugger;
                    if (isBase == "Y") {
                        var CompJson = new Array();
                        $('#drpComp  option').each(function (i) {
                            CompJson.push($(this).text() + " : " + $(this).val());
                        });
                        var flag = 0;

                        for (var i = 0; i < CompJson.length; i++) {
                            if (CompJson[i].split(':')[0].trim() == $("#txtCompName").val()) {
                                flag = 1;
                            }
                        }
                        debugger;

                        if (flag == 0) {
                            $.ajax({
                                type: "POST",
                                url: "../HiDoctor_Master/ProductMaster/GetProductAttributes",
                                async: false,
                                data: $("form").serialize(),
                                success: function (result) {
                                    result = eval('(' + result + ')');
                                    result_g = result;
                                    $('#drpComp').empty();
                                    $('#drpComp').append(new Option("-Select Competitor-", "-Select Competitor-", true, true));
                                    $('#drpComp').append(new Option("+ Add new Competitor", "0", true, true));
                                    for (var i = 0; i < result.Tables[8].Rows.length; i++) {
                                        $('#drpComp').append(new Option(result.Tables[8].Rows[i].Competitor_Name, result.Tables[8].Rows[i].Competitor_Code, true, true));
                                    }
                                    fnGetAllCompetitor();
                                    $('#dvPanel').unblock();
                                }
                            });
                        }
                        fnGetAllCompetitor();
                        if (rowedit != "" || rowedit != undefined) {
                            var CompCode = $("#hdnCompCode_" + rowedit).val();
                            $('#drpComp').val(CompCode);
                            EditRowIndex = $('#hdnCompRowIndex').val();
                        }
                        fnCompClearAll();
                    }
                }
            }
            else {

                fnMsgAlert('info', 'Competitor Master', result.split(':')[1]);
                $("#hdnMode").val("S");
            }
        }
    });
}

function fnInsertSpeciality() {
    debugger;
    var rowedit = $('#hdnSpecRowIndex').val();
    if ($.trim($("#txtSpecialityName").val()) == "") {
        fnMsgAlert('info', 'Product Master', 'Please Select Speciality Name');
        return false;
    }
    if (!regExforAlphaNumeric($("#txtSpecialityName").val())) {
        fnMsgAlert('info', 'Info', 'Special characters are not allowed in the Speciality Name');
        return false;
    }
    var num = $("#txtmaxcount").val();
    if (num == "") {
        Speciality_Count = "0";
    }
    else {
        if (!($.isNumeric(num))) {
            fnMsgAlert('info', 'Info', 'Please enter the numeric value');
            $("#txtmaxcount").val('');
            return false;
        }
        if (num < 0) {
            fnMsgAlert('info', 'Info', 'Please enter the valid number');
            $("#txtmaxcount").val('');
            return false;
        }
        if (num.indexOf('.') != -1 || num.indexOf('-') != -1 || num.indexOf('+') != -1) {
            fnMsgAlert('info', 'Info', 'Please enter the valid number');
            $("#txtmaxcount").val('');
            return false;
        }
        if (num.length >= 4) {
            fnMsgAlert('info', 'Info', 'Maximum count exists');
            $("#txtmaxcount").val('');
            return false;
        }
        Speciality_Count = $("#txtmaxcount").val();
    }

    $.ajax({
        type: "POST",
        url: "ProductMaster/InsertSpeciality",
        data: "SpecialityName=" + $.trim($("#txtSpecialityName").val()) + "&SpecialityCount=" + Speciality_Count + "&SpecialityCode=" + $("#hdnSpecialityCode").val() + "&Mode=" + $("#hdnMode").val() + "",
        success: function (result) {
            if (result.split(':')[0].toUpperCase() == "SUCCESS") {
                fnMsgAlert('info', 'Product Master', result.split(':')[1].toUpperCase());
                if (isBase != undefined) {
                    if (isBase == "Y") {
                        var SpecialityJson = new Array();
                        $('#drpSpeciality  option').each(function (i) {
                            SpecialityJson.push($(this).text() + " : " + $(this).val());
                        });
                        var flag = 0;
                        for (var i = 0; i < SpecialityJson.length; i++) {
                            if (SpecialityJson[i].split(':')[0].trim() == $("#txtSpecialityName").val()) {
                                flag = 1;

                            }
                        }
                        debugger;

                        if (flag == 0) {
                            $.ajax({
                                type: "POST",
                                url: "../HiDoctor_Master/ProductMaster/GetProductAttributes",
                                async: false,
                                data: $("form").serialize(),
                                success: function (result) {
                                    result = eval('(' + result + ')');
                                    result_g = result;
                                    $('#drpSpeciality').empty();
                                    $('#drpSpeciality').append(new Option("-Select Speciality-", "-Select Speciality-", true, true));
                                    // $('#drpSpeciality').append(new Option("+ Add new Speciality", "0", true, true));
                                    for (var i = 0; i < result.Tables[0].Rows.length; i++) {
                                        $('#drpSpeciality').append(new Option(result.Tables[0].Rows[i].Speciality_Name, result.Tables[0].Rows[i].Speciality_Code, true, true));
                                    }
                                    $('#dvPanel').unblock();
                                }
                            });
                        }
                        fnGetAllSpeciality();
                        if (rowedit != "" || rowedit != undefined) {
                            var specialityCode = $("#hdnSpecialityCode_" + rowedit).val();
                            $('#drpSpeciality').val(specialityCode);
                            EditRowIndex = $('#hdnSpecRowIndex').val();
                        }
                        $("#txtSpecialityName").val('');
                        $("#txtmaxcount").val('');
                        Speciality_Count = '';
                    }
                }
            }
            else {
                fnMsgAlert('info', 'Product Master', result.split(':')[1].toUpperCase());
            }
        }
    });
}
function fnSpecChangeStatus(rowIndex) {
    debugger;
    var rowedit = $('#hdnSpecRowIndex').val();
    $("#hdnMode").val("C");
    var specilaityCode = $("#hdnSpec_" + rowIndex).val();
    var specialityName = $("#tdSpec_" + rowIndex).html();
    var specialityCount = $("#tdSpecCount_" + rowIndex).html();
    var status = $("#tdSpecStatus_" + rowIndex).html().split("<")[0];
    $("#hdnSpecialityCode").val(specilaityCode);

    if (status == "Active") {
        var resultstatus = confirm("Dear " + UserName[0].toUpperCase() + UserName.slice(1) + ", You are trying to modify the status of this record. The effect of this action may affect the"
 + " display of doctors who are associated with this specialty in one or more screens/reports. Later, you have to manually"
       + " find those doctors and associate them with another specialty.")
        if (resultstatus == false) {
            return false;
        }
    }

    $.ajax({
        type: "POST",
        url: "ProductMaster/InsertSpeciality",
        data: "SpecialityName=" + $.trim($("#txtSpecialityName").val()) + "&SpecialityCount=" + $("#txtmaxcount").val() + "&SpecialityCode=" + $("#hdnSpecialityCode").val() + "&Mode=" + $("#hdnMode").val() + "",
        success: function (result) {
            debugger;
            if (result.split(':')[0].toUpperCase() == "SUCCESS") {
                fnMsgAlert('info', 'Product Master', result.split(':')[1]);
                $("#hdnMode").val("S");
                if (isBase != undefined) {
                    if (isBase == "Y") {
                        var SpecialityJson = new Array();
                        $('#drpSpeciality  option').each(function (i) {
                            SpecialityJson.push($(this).text() + " : " + $(this).val());
                        });
                        var flag = 0;
                        for (var i = 0; i < SpecialityJson.length; i++) {
                            if (SpecialityJson[i].split(':')[0].trim() == $("#txtSpecialityName").val()) {
                                flag = 1;
                            }
                        }

                        if (flag == 0) {
                            $.ajax({
                                type: "POST",
                                url: "../HiDoctor_Master/ProductMaster/GetProductAttributes",
                                async: false,
                                data: $("form").serialize(),
                                success: function (result) {
                                    result = eval('(' + result + ')');
                                    result_g = result;
                                    $('#drpSpeciality').empty();
                                    $('#drpSpeciality').append(new Option("-Select Speciality-", "-Select Speciality-", true, true));
                                    $('#drpSpeciality').append(new Option("+ Add new Speciality", "0", true, true));
                                    for (var i = 0; i < result.Tables[0].Rows.length; i++) {
                                        $('#drpSpeciality').append(new Option(result.Tables[0].Rows[i].Speciality_Name, result.Tables[0].Rows[i].Speciality_Code, true, true));
                                    }

                                    $('#dvPanel').unblock();
                                }
                            });
                        }
                        fnGetAllSpeciality();
                        if (rowedit != "" || rowedit != undefined) {
                            var specialityCode = $("#hdnSpecialityCode_" + rowedit).val();
                            $('#drpSpeciality').val(specialityCode);
                            EditRowIndex = $('#hdnSpecRowIndex').val();
                        }
                        fnClearAll();
                    }
                }
            }
            else {
                fnMsgAlert('info', 'Product Master', result.split(':')[1].toUpperCase());
                $("#hdnMode").val("S");
            }
        }
    });
}

function fnSubmitProductGroup() {
    debugger;
    var rowedit = $('#hdnRowIndex').val();
    var resultproductGroup = fnValidateproductgroup();
    var flag = "";
    if (resultproductGroup) {
        $.ajax({
            url: '../HiDoctor_Master/ProductMaster/ProductGroup/',
            type: "POST",
            async: false,
            data: "Product_Group=" + $("#txtProductGroup").val() + "&Effective_From=" + $("#txtEffectiveFrom").val() + "&Effective_To=" +
        $("#txtEffectiveTo").val() + "&Status=" + $('input:radio[name=Status]:checked').val() + "&Mode=" + $("#hdnMode").val() + "&Product_Group_Code=" + $("#hdnProductGroupCode").val() + "",
            success: function (data) {
                if (data.split(':')[0] == 'SUCCESS') {
                    // $("#message").html('PRODUCT GROUP SAVED SUCCCESSFULLY');
                    fnMsgAlert('info', 'Product Group Master', 'Product Group Saved Successfully');
                    if (isBase != undefined) {
                        if (isBase == "Y") {
                            var ProductJson = new Array();
                            $('#drpProGroup  option').each(function (i) {
                                ProductJson.push($(this).text() + " : " + $(this).val());
                            });
                            var flag = 0;
                            for (var i = 0; i < ProductJson.length; i++) {
                                if (ProductJson[i].split(':')[0].trim() == $("#txtProductGroup").val()) {
                                    flag = 1;
                                }
                            }
                            debugger;

                            if (flag == 0) {
                                $.ajax({
                                    type: "POST",
                                    url: "../HiDoctor_Master/ProductMaster/GetProductAttributes",
                                    async: false,
                                    data: $("form").serialize(),
                                    success: function (result) {
                                        result = eval('(' + result + ')');
                                        result_g = result;
                                        $('#drpProGroup').empty();
                                        $('#drpProGroup').append(new Option("-Select Product Group-", "-Select Product Group-", true, true));
                                        $('#drpProGroup').append(new Option("+ Add new Product Group", "0", true, true));
                                        for (var i = 0; i < result.Tables[6].Rows.length; i++) {
                                            $('#drpProGroup').append(new Option(result.Tables[6].Rows[i].Product_Group_Name, result.Tables[6].Rows[i].Product_Group_Code, true, true));
                                        }
                                        $('#dvPanel').unblock();
                                    }
                                });
                            }


                            if (rowedit != "" || rowedit != undefined) {
                                var productGroupCode = $("#hdnProductGroupCode_" + rowedit).val();
                                $('#drpProGroup').val(productGroupCode);
                                EditRowIndex = $('#hdnRowIndex').val();
                            }
                            fnFillProductGroup();
                            fnClearAll();
                        }
                    }
                }
                else if (data.split(':')[0] == 'Info') {
                    fnMsgAlert('info', 'Product group Master', 'Product Group already exists');

                    return false;
                }
                    //fnMsgAlert('error', 'error', 'Error occured(' + data.split(':')[1] + ')');
                    //   $("#message").html('Error occured(' + data.split(':')[1] + ')');
                else {
                    fnMsgAlert('info', 'Product group Master', 'Error occured(' + data.split(':')[1] + ')');
                    return false
                }
            },
            error: function (jqXhr, textStatus, errorThrown) {

            },
            complete: function () {

            }
        });
    }
}

function fnProductGroupEdit(code) {
    debugger;
    var rowedit = $('#hdnRowIndex').val();
    if (productGroup_g != '') {
        var disJson = jsonPath(productGroup_g, "$.Tables[0].Rows[?(@.Product_Group_Code=='" + code + "')]");
        if (disJson.length > 0) {
            $("#txtProductGroup").val(disJson[0].Product_Group_Name);
            $("#txtEffectiveFrom").val(disJson[0].Effective_From);
            $("#txtEffectiveTo").val(disJson[0].Effective_To);
            if (disJson[0].Record_Status == 'Disabled') {
                $("#rdDisabled").attr("checked", "checked");
            }
            else {
                $("#rdEnabled").attr("checked", "checked");
            }
            $("#hdnProductGroupCode").val(disJson[0].Product_Group_Code);
            //   fnEdit(rowedit);
            $("#hdnMode").val("EDIT");
            $("#btnSave").val("Update");
        }
    }
}

function fnEdit(rowIndex) {
    debugger;

    //  EditRowIndex = rowIndex;

    $("#txtProductName").focus();

    //var productCode = $("#hdnProductCode_" + rowIndex).val();
    //var productName = $("#tdProductName_" + rowIndex).html();
    //var productTypeName = $("#tdProductTypeName_" + rowIndex).html();
    //var specialityCode = $("#hdnSpecialityCode_" + rowIndex).val();
    //var brandCode = $("#hdnBrandCode_" + rowIndex).val();
    //var categoryCode = $("#hdnCategoryCode_" + rowIndex).val();
    //var UOMTypeCode = $("#hdnUOMTypeCode_" + rowIndex).val();
    //var UOMCode = $("#hdnUOMCode_" + rowIndex).val();
    //var productTypeCode = $("#hdnProductTypeCode_" + rowIndex).val();
    //var productGroupCode = $("#hdnProductGroupCode_" + rowIndex).val();
    //var effectiveFrom = $("#hdnEffectiveFrom_" + rowIndex).val();
    //var effectiveTo = $("#hdnEffectiveTo_" + rowIndex).val();

    //var productCost = $("#tdCost_" + rowIndex).html();
    //var productShortName = $("#tdProductShortName_" + rowIndex).html();
    //var productDesc = $("#tdproductDesc_" + rowIndex).html();
    //var competitorName = $("#hdnCompetitor_" + rowIndex).val();
    //var RefKey1 = $('#tdRefKey1' + rowIndex).html();
    //var RefKey2 = $('#hdnRefKey2_' + rowIndex).val();
    //if (effectiveFrom == "null") {
    //    effectiveFrom = "";
    //}
    //if (effectiveTo == "null") {
    //    effectiveTo = "";
    //}
    //if (productCost == "null") {
    //    productCost = "";
    //}
    //if (productShortName == "null") {
    //    productShortName = "";
    //}
    //$("#tr_" + rowIndex).css('border', '2px solid #6FA54B');
    //$("#tr_" + rowIndex).css('font-weight', 'bold');

    var productCode = rowIndex.data.Product_Code;
    var productName = rowIndex.data.Product_Name;
    var productTypeName = rowIndex.data.Product_Type_Name;
    var specialityCode = rowIndex.data.Speciality_Code;
    var brandCode = rowIndex.data.Brand_Code;
    var categoryCode = rowIndex.data.Category_Code;
    var UOMTypeCode = rowIndex.data.UOM_Type_Code;
    var UOMCode = rowIndex.data.UOM_Code;
    var productTypeCode = rowIndex.data.Product_Type;
    var productGroupCode = rowIndex.data.Product_Group_Code;
    var effectiveFrom = rowIndex.data.Effective_From;
    var effectiveTo = rowIndex.data.Effective_To;

    var productCost = rowIndex.data.Product_Cost;
    var productShortName = rowIndex.data.Product_Short_Name;
    var productDesc = rowIndex.data.Product_Description;
    var competitorName = rowIndex.data.Competitor_Code;
    var RefKey1 = rowIndex.data.Ref_Key1;
    var RefKey2 = rowIndex.data.Ref_Key2;
    if (effectiveFrom == "null") {
        effectiveFrom = "";
    }
    if (effectiveTo == "null") {
        effectiveTo = "";
    }
    if (productCost == "null") {
        productCost = "";
    }
    if (productShortName == "null") {
        productShortName = "";
    }


    $("#hdnProductName").val(productName);
    $("#hdnProductCode").val(productCode);
    $("#txtProductName").val(productName);
    $("#drpSpeciality").val(specialityCode);
    $("#drpBrand").val(brandCode);
    //$("#drpComp").val(competitorName);
    $("#drpCategory").val(categoryCode);
    $("#drpUOMType").val(UOMTypeCode);
    $("#drpUOM").val(UOMCode);
    $("#drpProType").val(productTypeCode);
    $("#drpProGroup").val(productGroupCode);
    $("#txtProductCost").val(productCost);
    debugger;
    $("#txtProductShortName").val(productShortName);
    $("#txtEffFrom").val(effectiveFrom);
    $("#txtEffTo").val(effectiveTo);
    $("#txtDescription").val(productDesc);
    $('#txtRefKey1').val(RefKey1);
    $('#txtRefKey2').val(RefKey2);

    if (productTypeName.toUpperCase() == "COMPETITOR") {
        $("#drpComp").val(competitorName);
        $('#trCompetitor').css('display', '');
    }
    else {
        $('#trCompetitor').css('display', 'none');
    }
    $("#hdnmode").val('E');
    $('#dvTab').tabs('option', 'selected', 0);
}
function fnChangeStatus(rowIndex) {
    debugger;
    //  var productCode = $("#hdnProductCode_" + rowIndex).val();
    //   var productName = $("#tdProductName_" + rowIndex).html();

    var productCode = rowIndex.data.Product_Code;
    var productName = rowIndex.data.Product_Name;
    $("#hdnProductCode").val(productCode);
    $('#dvPanel').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        type: "POST",
        url: "../HiDoctor_Master/ProductMaster/CheckItranProduct",
        data: "ProductCode=" + productCode + "",
        success: function (result) {
            if (result > 0) {
                var content = "Product : " + productName + " used in some invoices, still do you want to change the status  <a href='#' onclick='fnChangeProductStatus()'>continue</a> <a href='#' onclick='fnclearAll()'>cancel</a>";
                $("#dvError").html(content);
                $("#dvError").slideDown();
            }
            else {
                fnChangeProductStatus();
            }
            $('#dvPanel').unblock();
        }
    });
}
function fnChangeProductStatus(rowIndex) {
    debugger;
    var productCode = rowIndex.data.Product_Code;
    $('#dvPanel').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
    $.ajax({
        type: "POST",
        url: "../HiDoctor_Master/ProductMaster/ChangeProductStatus",
        data: "ProductCode=" + productCode + "",
        success: function (result) {
            if (result == "SUCCESS") {
                fnMsgAlert('success', 'Product Master', 'Product status changed successfully');
                fnGetProductAttributes();
                fnclearAll();
            }
            else {
                fnMsgAlert('info', 'Product Master', result);
            }
            $('#dvPanel').unblock();
        }
    });
}
//Drop down change events
function fnSpecialityChange() {
    var index = $('#drpSpeciality').val();
    if (index === "0") {
        debugger;
        $.modal({ ajax: '../HiDoctor_Master/ProductMaster/Speciality/' + EditRowIndex, title: 'Add New Speciality', overlayClose: false });
        $('#hdnSpecRowIndex').val(EditRowIndex);
        index = "";

    }
}
function fnBrandChange() {
    var index = $('#drpBrand').val();

    if (index === "0") {
        debugger;
        $.modal({ ajax: '../HiDoctor_Master/ProductMaster/Brand/' + EditRowIndex, title: 'Add New Brand', overlayClose: false });
        $('#hdnBrandRowIndex').val(EditRowIndex);
        index = "";
    }
}
function fnCompChange() {
    debugger;
    var index = $('#drpComp').val();

    if (index === "0") {
        debugger;
        $.modal({ ajax: '../HiDoctor_Master/ProductMaster/Competitor/' + EditRowIndex, title: 'Add New Competitor', overlayClose: false });
        $('#hdnCompRowIndex').val(EditRowIndex);
        index = "";
    }
}
function fnCategoryChange() {
    var index = $('#drpCategory').val();


    if (index === "0") {
        $.modal({ ajax: '../HiDoctor_Master/ProductMaster/Category/' + EditRowIndex, title: 'Add New Category', overlayClose: false });
        $('#hdnCategoryRowIndex').val(EditRowIndex);
        index = "";

    }
}
function fnUOMTypeChange() {
    var index = $('#drpUOMType').val();
    if (index === "0") {
        $.modal({ ajax: '../HiDoctor_Master/ProductMaster/UOMType/' + EditRowIndex, title: 'Add New UOM Type', overlayClose: false });
        $('#hdnUOMRowIndex').val(EditRowIndex);
        index = "";
    }
}
function fnUOMChange() {
    var index = $('#drpUOM').val();
    if (index === "0") {
        $.modal({ ajax: '../HiDoctor_Master/ProductMaster/UOM/' + EditRowIndex, title: 'Add New UOM', overlayClose: false });
        $('#hdnUOMIndex').val(EditRowIndex);
        index = "";

    }
}
function fnProductTypeChange() {
    debugger;
    var index = $('#drpProType').val();
    var productTypeName = $("#drpProType option:selected").text();
    if (productTypeName.toUpperCase() == "COMPETITOR") {
        $('#trCompetitor').css('display', '');
    }
    else {
        $('#trCompetitor').css('display', 'none');
        $('#drpComp').val('');
    }
    if (index === "0") {
        $.modal({ ajax: '../HiDoctor_Master/ProductMaster/ProductType/' + EditRowIndex, title: 'Add New Product Type', overlayClose: false });
        $('#hdnRowIndex').val( );
        index = "";
    }
}
function fnProductGroupChange() {
    var index = $('#drpProGroup').val();
    if (index === "0") {
        debugger;
        $.modal({ ajax: '../HiDoctor_Master/ProductMaster/ProductGroup/' + EditRowIndex, title: 'Add New Product Group', overlayClose: false, css: "width:800px;" });
    }
}

//Calling pages
function fnShowSpecility() {
    $.modal({ ajax: '../HiDoctor_Master/ProductMaster/Speciality/' + EditRowIndex, title: 'Add New Speciality', overlayClose: false });
}
function fnShowBrand() {
    $.modal({ ajax: '../HiDoctor_Master/ProductMaster/Brand/' + EditRowIndex, title: 'Add New Brand', overlayClose: false });
}
function fnShowCategory() {
    $.modal({ ajax: '../HiDoctor_Master/ProductMaster/Category/' + EditRowIndex, title: 'Add New Category', overlayClose: false });
}
function fnShowUOMType() {
    $.modal({ ajax: '../HiDoctor_Master/ProductMaster/UOMType/' + EditRowIndex, title: 'Add New UOM Type', overlayClose: false });
}
function fnShowUOM() {
    $.modal({ ajax: '../HiDoctor_Master/ProductMaster/UOM/' + EditRowIndex, title: 'Add New UOM', overlayClose: false });
}
function fnShowProductType() {
    $.modal({ ajax: '../HiDoctor_Master/ProductMaster/ProductType/' + EditRowIndex, title: 'Add New Product Type', overlayClose: false });
}
function fnShowProductGroup() {
    $.modal({ ajax: '../HiDoctor_Master/ProductMaster/ProductGroup/' + EditRowIndex, title: 'Add New Product Group', overlayClose: false });
}
function fnShowCompetitor() {
    $.modal({ ajax: '../HiDoctor_Master/ProductMaster/Competitor/' + EditRowIndex, title: 'Add New Competitor', overlayClose: false });
}

function fnCheckAvailabilty() {
    if ($("#hdnProductCode").val() == "") {
        var productName = $("#txtProductName").val();
        if (productName != "") {
            var product = jsonPath(result_g, "$.Tables[7].Rows[?(@.Product_Name=='" + productName.toUpperCase() + "')]");
            var result = fnCheckSpecialChar("txtProductName");
            if (!result) {
                fnMsgAlert('info', 'Product Master', 'The follwing charcters not allowed in this system. ~^+$<>_()-!\&');
                return false;
            }
        }
    }
}
function fnChkProShrtNameAvail() {
    debugger;
    if ($("#hdnProductCode").val() == "") {
        var productShortName = $("#txtProductShortName").val();
        if (productShortName != "") {
            var productShort = jsonPath(result_g, "$.Tables[7].Rows[?(@.Product_Short_Name=='" + productShortName.toUpperCase() + "')]");
            if (productShort.length > 0) {
                //$("#dvPrdShortNameCheck").html('Product short name already exist');
                //$("#dvPrdShortNameCheck").css('color', '#C85305')
                //$("#txtProductShortName").addClass("error")
                fnMsgAlert('info', 'Product Master', 'Product short name already exist')
            }
            else {
                var result = fnCheckSpecialChar("txtProductShortName");
                if (!result) {
                    //   $("#dvPrdShortNameCheck").html('The follwing charcters not allowed in this system. ~^+$<>_()-!\&');
                    // $("#dvPrdShortNameCheck").css('color', '#C85305');
                    //   $("#txtProductShortName").addClass("error")
                    fnMsgAlert('info', 'Product Master', 'The follwing charcters not allowed in this system. ~^+$<>_()-!\&')
                }
            }
        }
    }
}

function fnSubmit() {
    debugger;
    $("#dvProductCheck").hide();
    var validateresult = fnValidate();
    if (validateresult) {
        validateresult = fnValidateRefKey1();
        if (!validateresult) {
            fnMsgAlert('info', 'Product Master', 'Ref Key1 value already exist for another product.');
            return false
        }
    }

    if (validateresult) {
        //Read controls
        var productName = $("#txtProductName").val();
        var specialityCode = $("#drpSpeciality").val();
        var brandCode = $('#drpBrand').val();
        var categoryCode = $("#drpCategory").val();
        var uomtypeCode = $("#drpUOMType").val();
        var uomCode = $("#drpUOM").val();
        var productTypeCode = $("#drpProType").val();
        var productGroupCode = $("#drpProGroup").val();

        if (parseInt($('#txtProductCost').val()) < 0) {
            fnMsgAlert('info', 'Product Master', 'Product Cost cannot be negative');
            return;
        }

        var productCost = $("#txtProductCost").val();
        var productShortName = $("#txtProductShortName").val();
        var effectiveFrom = $("#txtEffFrom").val();
        var effectiveTo = $("#txtEffTo").val();
        var productDesc = $("#txtDescription").val();
        var productTypeName = $("#drpProType option:selected").text();
        var competitorName = $("#drpComp option:selected").text();
        var Ref_key1 = $.trim($("#txtRefKey1").val());
        var Ref_key2 = $.trim($("#txtRefKey2").val());
        $.ajax({
            type: "POST",
            url: "../HiDoctor_Master/ProductMaster/InsertProduct",
            data: "ProductName=" + encodeURIComponent(productName) + "&SpecialityCode=" + specialityCode + "&BrandCode=" + brandCode + "&CategoryCode=" + categoryCode + "&UOMTypeCode=" + uomtypeCode +
                "&UOMCode=" + uomCode + "&ProductTypeCode=" + productTypeCode + "&ProductTypeName=" + productTypeName +
                "&ProductGroupCode=" + productGroupCode + "&ProductCost=" + productCost + "&ProductShortName=" + productShortName +
                "&ProductDesc=" + productDesc + "&EffectiveFrom=" + effectiveFrom + "&EffectiveTo=" + effectiveTo +
                "&ProductCode=" + $("#hdnProductCode").val() + "&competitor=" + competitorName + "&RefKey1=" + Ref_key1 + "&RefKey2=" + Ref_key2,
            success: function (result) {
                if (result.toUpperCase() == "SUCCESS") {
                    fnMsgAlert('success', 'success', 'Product inserted successfully');
                    fnGetProductAttributes();
                    fnclearAll();
                    $("#hdnmode").val('');
                    if (isPopup == 1) {
                        // map product with user.
                        UserProductMap();
                    }
                }
                else if (result != "") {
                    fnMsgAlert('error', 'Product Master', result);
                }
                $('#dvPanel').unblock();
            },
            error: function (e) {
                $('#dvPanel').unblock();
                fnMsgAlert('error', 'Product Master', e.responseText);
            }
        });
    }
}
function fnCheckItranProduts() {
    debugger;
    if ($("#hdnProductCode").val() != "") {
        if ($.trim($("#hdnProductName").val()) != $.trim($("#txtProductName").val())) {
            $('#dvPanel').block({
                message: '<h3>Loading...</h3>',
                css: { border: '2px solid #ddd' }
            });
            $.ajax({
                type: "POST",
                url: "../HiDoctor_Master/ProductMaster/CheckItranProduct",
                data: "ProductCode=" + $("#hdnProductCode").val() + "",
                success: function (result) {
                    if (result > 0) {
                        var content = "Product : " + $("#txtProductName").val() + " used in some invoices, still do you want to change the product name  <a href='#' onclick='fnSubmit()'>continue</a> <a href='#' onclick='fnclearAll()'>cancel</a>";
                        $("#dvError").html(content);
                        $("#dvError").slideDown();
                    }
                    else {
                        fnSubmit();
                    }
                    $('#dvPanel').unblock();
                }
            });
        }
        else {
            fnSubmit();
        }
    }
    else {
        fnSubmit();
    }
}
function fnValidate() {
    debugger;
    var count = 0;
    var prodname = '';
    var prodtype = '';
    prodname = $("#txtProductName").val();
    prodtype = $("#drpProType :selected").text();

    if ($("#txtProductName").val() == "") {
        fnMsgAlert('info', 'Product Master', 'Please enter Product Name');
        return false;
    }
    else {
        if (!ONE_CHAR_MANDATORY_REGEX.test($("#txtProductName").val())) {
            fnMsgAlert('info', 'Product Master', 'Please enter atleast one character');
            return false;
        }
        if ($.trim($('#txtProductName').val()).length > 0) {
            if (regExforAlphaNumeric($("#txtProductName").val()) == false) {
                fnMsgAlert('info', 'Product Master', 'Please remove special characters from product name');
                return false;
            }

        }
    }
    var prodnamevalid = fnvalidateprodname();
    debugger;

    if (prodnamevalid) {
        if ($("#drpProType").val() === 0 || $("#drpProType").val() == "-Select product type-" || $("#drpProType option:selected").text() == "") {
            fnMsgAlert('info', 'Product Master', 'Please select product type');
            return false;
        }
        if ($("#drpProType :selected").text() == 'Competitor') {
            if ($("#drpComp").val() === 0 || $("#drpComp").val() == "-Select Competitor-" || $("#drpComp option:selected").text() == "") {
                fnMsgAlert('info', 'Product Master', 'Please select Competitor');
                return false;
            }
        }
        if ($("#drpProGroup").val() === 0 || $("#drpProGroup").val() == "-Select product group-" || $("#drpProGroup option:selected").text() == "") {
            fnMsgAlert('info', 'Product Master', 'Please select product group');
            return false;
        }
        if ($("#drpBrand").val() === 0 || $("#drpBrand").val() == "-Select Brand-" || $("#drpBrand option:selected").text() == "") {
            fnMsgAlert('info', 'Product Master', 'Please select brand');
            return false;
        }
        if ($("#drpSpeciality").val() === 0 || $("#drpSpeciality").val() == "-Select Speciality-" || $("#drpSpeciality option:selected").text() == "") {
            fnMsgAlert('info', 'Product Master', 'Please select speciality');
            return false;
        }
        if ($("#drpCategory").val() === 0 || $("#drpCategory").val() == "-Select category-" || $("#drpCategory option:selected").text() == "") {
            fnMsgAlert('info', 'Product Master', 'Please select Category');
            return false;
        }

        if ($("#drpUOMType").val() === 0 || $("#drpUOMType").val() == "-Select UOM type-" || $("#drpUOMType option:selected").text() == "") {
            fnMsgAlert('info', 'Product Master', 'Please select UOM type');
            return false;
        }

        if ($("#drpUOM").val() === 0 || $("#drpUOM").val() == "-Select UOM-" || $("#drpUOM option:selected").text() == "") {
            fnMsgAlert('info', 'Product Master', 'Please select UOM');
            return false;
        }
        if (isNaN($("#txtProductCost").val())) {
            fnMsgAlert('info', 'Product Master', 'Please enter valid product cost');
            return false;
        }

        if ($.trim($('#txtRefKey1').val()).length > 0) {
            if (!fnCheckSpecialChar('txtRefKey1')) {
                fnMsgAlert('info', 'Product Master', 'Please remove the special characters in Ref Key1.');
                return false;
            }
        }
        if ($.trim($('#txtRefKey2').val()).length > 0) {
            if (!fnCheckSpecialChar('txtRefKey2')) {
                fnMsgAlert('info', 'Product Master', 'Please remove the special characters in Ref Key2.');
                return false;
            }
        }
        return true;
    }
    else {
        fnMsgAlert('info', 'Product Master', 'Product Name already exists for the selected product type');
        return false;
    }
}

function fnclearAll() {
    debugger;
    $("#txtProductName").val('');
    $("#drpSpeciality").attr('selectedIndex', 0);
    $("#drpBrand").attr('selectedIndex', 0);
    $("#drpComp").attr('selectedIndex', 0);
    $("#drpCategory").attr('selectedIndex', 0);
    $("#trCompetitor").hide();
    $("#drpUOMType").attr('selectedIndex', 0);
    $("#drpUOM").attr('selectedIndex', 0);
    $("#drpProType").attr('selectedIndex', 0);
    $("#drpProGroup").attr('selectedIndex', 0);
    $("#txtProductCost").val('');
    $("#txtProductShortName").val('');
    $("#txtEffFrom").val('');
    $("#txtEffTo").val('');
    $("#txtDescription").val('');
    $("#dvProductCheck").html('');
    $("#dvPrdShortNameCheck").html('');
    $("#hdnProductCode").val('');
    $("#drpComp").val('');
    $('#trCompetitor').css('display', 'none');
    $('#txtRefKey1').val('');
    $('#txtRefKey2').val('');

    $("#dvError").slideUp();
}

function fnCheckSpecialChar(id) {

    if ($("#" + id).val() != "") {
        var specialCharregex = new RegExp("^[a-zA-Z0-9' '-.%#;,@,{}*/,`=? ]+$");
        if (!specialCharregex.test($("#" + id).val())) {
            //  fnMsgAlert('error', 'Error', 'The follwing charcters not allowed in this system. ~^$<>_()!\&');
            return false;
        }
        else {
            return true;
        }
    }
    return true
}

//modal
(function ($) {
    $.modalnew = function (config) {

        var defaults, options, modal, header, content, footer, close, overlay, width, centerOffset;

        defaults = {
            title: ''
			, byline: ''

			, ajax: ''
			, div: ''

			, slide: false
			, slideEl: '.slide'

			, btnClass: 'btn small secondary'

			, overlay: true
			, overlayClose: true

			, beforeOpen: function () { }
			, afterOpen: function () { }

			, debug: false
        };

        options = $.extend(defaults, config);

        $.modal.forceClose();

        modal = $('<div>', { 'id': 'modal' });
        header = $('<div>', { 'id': 'dialog-title' });
        content = $('<div>', { 'id': 'modal_content' });
        overlay = $('<div>', { 'id': 'modal_overlay' });
        close = $('<div>', { 'id': 'modal_close', 'html': 'x' });

        header.appendTo(modal);
        content.appendTo(modal);
        close.appendTo(modal);

        options.beforeOpen(modal);

        modal.appendTo('body').hide().fadeIn(500);

        if (options.overlay) {
            overlay.appendTo('body');
        }

        if (options.overlayClose) {
            overlay.bind('click', function (e) { $.modal.close(); });
        }

        close.bind('click', function (e) { $.modal.close(); });

        (options.title !== '') ? header.append('<h3>' + options.title + '</h3>') : '';
        (options.byline !== '') ? header.append('<div class="byline">' + options.byline + '</div>') : '';

        if (options.ajax !== '') {
            content.html('<div id="modal_loader"><img src="../Content/images/mba/ajax-loader.gif" /></div>');
            $.modal.reposition();
            $.get(options.ajax, function (response) {
                content.html(response);
                handleContent();
            });
        }

        if (options.div !== '') {
            content.html($(options.div).html());
            handleContent();
        }

        function handleContent() {
            $.modal.reposition();
            if (options.slide) { handleSlides(); }

            setTimeout(function () {
                options.afterOpen(modal);
            }, 1000);
        }

        function handleSlides() {
            var slides = modal.find(options.slideEl);
            slides.hide().eq(0).show().addClass('current_slide');
            var footer = $('<div>', { id: 'modal_footer' }).appendTo(modal);
            var prev = $('<button>', { id: 'prev', html: '<u>P</u>revious' }).addClass(options.btnClass).appendTo(footer);
            var display = $('<span>', { id: 'display' }).appendTo(footer);
            var next = $('<button>', { id: 'next', html: '<u>N</u>ext' }).addClass(options.btnClass).appendTo(footer);
            display.html('<span class="current_page">1</span> of ' + slides.length);
            prev.attr('disabled', 'disabled');

            $(document).bind('keyup.modal', function (e) {
                if (e.keyCode == 78 || e.keyCode == 39) { navigateSlides('forward', slides); }
                if (e.keyCode == 80 || e.keyCode == 37) { navigateSlides('backward', slides); }
            });

            footer.find('button').bind('click', function (e) {
                var direction = ($(this).is('#next')) ? 'forward' : 'backward';
                navigateSlides(direction, slides);
            });

        }

        function navigateSlides(direction, slides) {
            var currentSlide, nextSlide, next, prev;
            next = $('#next');
            prev = $('#prev');
            currentSlide = content.find('.current_slide');
            nextSlide = (direction == 'forward') ? currentSlide.next(options.slideEl) : currentSlide.prev(options.slideEl);

            if (nextSlide.length > 0) {
                nextSlide.addClass('current_slide').show().siblings(options.slideEl).hide().removeClass('current_slide');
                $('#display .current_page').text(nextSlide.index() + 1);

                (nextSlide.index() === 0) ? prev.attr('disabled', 'disabled') : prev.removeAttr('disabled');
                (nextSlide.index() === slides.length - 1) ? next.attr('disabled', 'disabled') : next.removeAttr('disabled');

                var contentWidth = nextSlide.outerWidth();
                content.width(contentWidth + 30);
                //$.modal.reposition ();	
            }
        }

        $(document).bind('keyup.modal', function (e) {
            if (e.keyCode == 27) { $.modal.close(); }
        });

    };

    $.modal.reposition = function () {
        var width = $('#modal').outerWidth();
        var centerOffset = width / 2;
        var pageScroll = getPageScroll();
        //$('#modal').css({ 'left': '50%', 'top': pageScroll[1] + 100, 'margin-left': '-' + centerOffset + 'px' });
        // $('#modal').css({ 'left': '39%!important', 'top': '87px !important' });
    };

    $.modal.close = function () {
        $('#modal').fadeOut('medium', function () { $(this).remove(); });
        $('#modal_overlay').fadeOut('medium', function () { $(this).remove(); });
        $(document).unbind('keyup.modal');
    };

    $.modal.forceClose = function () {
        $('#modal').remove();
        $('#modal_overlay').remove();
        $(document).unbind('keyup.modal');
    };

    $.modal.setTitle = function (title) {
        var h3 = $('#modal_header').find('h3');
        if (h3.length > 0) {
            h3.html(title);
        } else {
            $('<h3>', { html: title }).prependTo('#modal_header');
        }
    };

    $.modal.setByline = function (text) {
        var el = $('#modal_header').find('.byline');
        if (el.length > 0) {
            el.html(text);
        } else {
            $('<div>', { 'class': 'byline', html: text }).appendTo('#modal_header');
        }
    };

    // getPageScroll() by quirksmode.com
    function getPageScroll() {
        var xScroll, yScroll;
        if (self.pageYOffset) {
            yScroll = self.pageYOffset;
            xScroll = self.pageXOffset;
        } else if (document.documentElement && document.documentElement.scrollTop) {	 // Explorer 6 Strict
            yScroll = document.documentElement.scrollTop;
            xScroll = document.documentElement.scrollLeft;
        } else if (document.body) {// all other Explorers
            yScroll = document.body.scrollTop;
            xScroll = document.body.scrollLeft;
        }
        return new Array(xScroll, yScroll);
    }
})(jQuery);


function fnValidateRefKey1() {
    debugger;
    var RefKey1Result = false;
    var Ref_key1 = $('#txtRefKey1').val();
    var Product_Type = $('#drpProType').val();
    var prodcode = $("#hdnProductCode").val();
    var mode = $("#hdnmode").val();
    if ($.trim(Ref_key1).length > 0) {
        $.ajax({
            type: "POST",
            url: "../HiDoctor_Master/ProductMaster/ValidateRefKey1",
            data: "&refKey1=" + Ref_key1 + "&product_Type=" + Product_Type + "&mode=" + mode + "&prodcode=" + prodcode,
            async: false,
            success: function (result) {
                RefKey1Result = result;

            },
            error: function (e) {
                fnMsgAlert('error', 'Product Master', e.responseText);
            }
        });

        if (RefKey1Result > 0) {
            return false;
        }
        else {
            return true;
        }
    }
    return true;
}

function UserProductMap() {
    $.ajax({
        type: "POST",
        url: "../BatchProcessing/UserProductMap",
        data: "Emp_No=" + Emp_No + "&Product_Ref_Key=" + Product_Ref_Key,
        async: false,
        success: function (result) {
            RefKey1Result = result;

        },
        error: function (e) {
            fnMsgAlert('error', 'Product Master', e.responseText);
        }
    });
}
function fncheckprodcost(e) {
    debugger;
    if ((e.keyCode <= 105 && e.keyCode >= 96) && (e.keyCode <= 57 && e.keyCode >= 48)) {
        return true;
    }
    else {
        return false;
    }
}
function fnvalidateprodname() {
    debugger;
    var Productresult = '';
    var prodname = '';
    var prodtype = '';
    var prodcode = '';
    var mode = '';
    prodname = $("#txtProductName").val();
    prodtype = $("#drpProType").val();
    prodcode = $("#hdnProductCode").val();
    mode = $("#hdnmode").val();
    $.ajax({
        type: "POST",
        url: "../HiDoctor_Master/ProductMaster/Validprodname",
        data: "product_name=" + prodname + "&product_type=" + prodtype + "&prod_Code=" + prodcode + '&mode=' + mode,
        async: false,
        success: function (result) {
            if (result > 0) {
                Productresult = 1;
            }
            else {
                Productresult = 0;
            }
        },
        error: function (e) {
            fnMsgAlert('error', 'Product Master', e.responseText);
        }
    });
    if (Productresult > 0) {
        return false;
    }
    else {
        return true;
    }
}