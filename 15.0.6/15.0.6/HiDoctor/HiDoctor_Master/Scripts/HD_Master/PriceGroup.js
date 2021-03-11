var rowNum = 1;
var productJson_g = "";
var priceGroupHeaderJson_g = "";
function fnGetAllSalesProduct() {
    //
    $.ajax({
        url: '../HiDoctor_Master/PriceGroup/GetAllSaleProducts/',
        type: "POST",
        data: "A",
        success: function (jsData) {
            $("#dvAjaxLoad").show();
            jsData = eval('(' + jsData + ')');
            productJson_g = jsData;
            if (jsData.length > 0) {
                fnGetPriceGroupHeader();
                $("#dvAjaxLoad").hide();
            }
        },
        error: function () {
            $("#dvAjaxLoad").hide();
        }
    });
}
function fnGetPriceGroupHeader() {
    $.ajax({
        url: '../HiDoctor_Master/PriceGroup/GetPriceGroupHeader/',
        type: "POST",
        data: "A",
        success: function (jsData) {
            jsData = eval('(' + jsData + ')');
            if (jsData.length > 0) {
                fnBindPriceGroupHeader(jsData);
            }
        },
        error: function () {
        }
    });
}

function fnBindPriceGroupHeader(jsData) {
    var content = "";
    var priceGroup = "[";
    var cboPriceGroup = $("#cboPriceGroup");
    var cboCustPriceGroup = $('#cboCustPriceGroup');
    $('option', cboPriceGroup).remove();
    $('option', cboCustPriceGroup).remove();
    cboPriceGroup.append("<option value=0>-Select price group-</option>");
    cboCustPriceGroup.append("<option value=0>-Select price group-</option>");
    content += "<table style='width:50%; border:1px solid #EFEFEF;' id='tblPriceGroupHeader' class='data display datatable'><thead style='width:100%;'>";
    content += "<tr>";
    content += "<td style='width:5%;'>S.No</td><td style='width:30%;'>Price group Name</td>";
    content += "<td  style='width:20%;'>View/Edit</td>";
    content += "</tr></thead><tbody>";
    for (var i = 0; i < jsData.length; i++) {
        content += "<tr>";
        content += "<td style='width:5%;text-align:center;'>" + (parseInt(i) + 1) + ". </td>";
        content += "<td><div id='dvProductName_" + i + "' style='width:95%;'/> " + jsData[i].Price_Group_Name + "</div>";
        content += "</td>";
        content += "<td><a href='#' onclick='fnShowPriceGroupDetails(\"" + jsData[i].Price_Group_Code + "\",\"" + jsData[i].Price_Group_Name + "\");'>View</a>&nbsp;";
        content += "<a href='#' onclick='fnEditPriceGroupDetails(\"" + jsData[i].Price_Group_Code + "\",\"" + jsData[i].Price_Group_Name + "\",\"EDIT\");'>Edit</a></td>";
        content += "</tr>";
        priceGroup += "{label:" + '"' + "" + jsData[i].Price_Group_Name + "" + '",' + "value:" + '"' + "" + jsData[i].Price_Group_Code + "" + '"' + "},";
        cboPriceGroup.append("<option value='" + jsData[i].Price_Group_Code + "'>" + jsData[i].Price_Group_Name + "</option>");
        cboCustPriceGroup.append("<option value='" + jsData[i].Price_Group_Code + "'>" + jsData[i].Price_Group_Name + "</option>");
    }
    content += "</tbody></table>";
    priceGroup = priceGroup.slice(0, -1);
    priceGroup += "]";
    priceGroup = eval('(' + priceGroup + ')');
    priceGroupHeaderJson_g = priceGroup;
    autoComplete(priceGroup, "txtOldPriceGroup", "hdnOldPriceGroup", "autoPriceGroup");
    $("#cboPriceGroup").attr('selectedIndex', 0);

    $("#dvPriceGroupHeader").html(content);
    $('#tblPriceGroupHeader').dataTable({
        "sPaginationType": "full_numbers", "bPaginate": true, "bDestroy": true, "bSort": true, "bSearch": true, "sDom": 'T<"clear">lfrtip', "oTableTools": {
            "sSwfPath": "/Content/ZeroClipboard.swf"
        }
    });
}

/*
* Bind all products 
*/
function fnBindAllProducts(disProArray) {
    if (productJson_g == "") {
        $.ajax({
            url: '../HiDoctor_Master/PriceGroup/GetAllSaleProducts/',
            type: "POST",
            data: "A",
            success: function (jsData) {
                jsData = eval('(' + jsData + ')');
                productJson_g = jsData;
                if (productJson_g != '') {
                    var product = "";
                    product += "<table class='data display' style='width: 85%; border: 1px solid #f2f2f2;' ><tr><td style='background-color: #ddd;'>";
                    product += "<input type='checkbox' id='chkSelectAll' name='chkSelectAll' onclick='fnSelectAll();'/></td><td style='background-color: #ddd;'>Product Name</td></tr><tr><td></td>";
                    product += '<td><input type="text" id="txtProductSearch" placeholder="Search Product" style="background: #FFFFFF url(../Content/images/search.png) no-repeat 4px 4px; ';
                    product += ' padding: 4px 4px 4px 22px; border: 1px solid #CCCCCC; width: 135px; height: 18px; float: right; margin-right: 14px;" /></td></tr></table>';
                    product += "<table class='data display filterable' style='width: 85%; border: 1px solid #f2f2f2;' id='tblAllProducts'>";
                    for (var p = 0; p < productJson_g.length; p++) {
                        if ($.inArray(productJson_g[p].Product_Code, disProArray) == -1) {
                            product += "<tr><td ><input type='checkbox' value='" + productJson_g[p].Product_Code + "' id='td_Pro_Code_" + p + "' name='chkProducts' /></td>";
                            product += "<td id='td_Pro_Name_" + p + "'>" + productJson_g[p].Product_Name + "</td></tr>";
                        }
                    }
                    product += "</table>";
                    $("#dvAllProducts").html(product);

                    $("#tblAllProducts tr:has(td)").each(function () {
                        var t = $(this).text().toLowerCase();
                        $("<td class='indexColumn'></td>")
                         .hide().text(t).appendTo(this);
                    }); //each tr
                    $("#txtProductSearch").keyup(function () {
                        var s = $(this).val().toLowerCase().split(" ");
                        $(".filterable tr:hidden").show();
                        $.each(s, function () {
                            $(".filterable tr:visible .indexColumn:not(:contains('"
                        + this + "'))").parent().hide();
                        }); //each
                    }); //key up.
                }
            }
        });
    }
    else {
        var product = "";
        product += "<table class='data display' style='width: 85%; border: 1px solid #f2f2f2;' ><tr><td style='background-color: #ddd;'>";
        product += "<input type='checkbox' id='chkSelectAll' name='chkSelectAll' onclick='fnSelectAll();'/></td><td style='background-color: #ddd;'>Product Name</td></tr><tr><td></td>";
        product += '<td><input type="text" id="txtProductSearch" placeholder="Search Product" style="background: #FFFFFF url(../Content/images/search.png) no-repeat 4px 4px; ';
        product += ' padding: 4px 4px 4px 22px; border: 1px solid #CCCCCC; width: 135px; height: 18px; float: right; margin-right: 14px;" /></td></tr></table>';
        product += "<table class='data display filterable' style='width: 85%; border: 1px solid #f2f2f2;' id='tblAllProducts'>";
        for (var p = 0; p < productJson_g.length; p++) {
            if ($.inArray(productJson_g[p].Product_Code, disProArray) == -1) {
                product += "<tr><td ><input type='checkbox' value='" + productJson_g[p].Product_Code + "' id='td_Pro_Code_" + p + "' name='chkProducts' /></td>";
                product += "<td id='td_Pro_Name_" + p + "'>" + productJson_g[p].Product_Name + "</td></tr>";
            }
        }
        product += "</table>";
        $("#dvAllProducts").html(product);

        $("#tblAllProducts tr:has(td)").each(function () {
            var t = $(this).text().toLowerCase();
            $("<td class='indexColumn'></td>")
             .hide().text(t).appendTo(this);
        }); //each tr
        $("#txtProductSearch").keyup(function () {
            var s = $(this).val().toLowerCase().split(" ");
            $(".filterable tr:hidden").show();
            $.each(s, function () {
                $(".filterable tr:visible .indexColumn:not(:contains('"
            + this + "'))").parent().hide();
            }); //each
        }); //key up.
    }

}

function fnSelectAll() {
    var i = $("#tblAllProducts tr").length;
    if ($("input:checkbox[name=chkSelectAll]").attr("checked") == "checked") {
        $("input:checkbox[name=chkProducts]").each(function () {
            this.checked = true;
        });
    }
    else {
        $("input:checkbox[name=chkProducts]").each(function () {
            this.checked = false;
        });
    }
}

function fnOpenProductPopUp() {
    fnGetEnteredProducts();
    $("#dvProducts").overlay().load();
}

function fnClosePopUp(id) {
    $("#" + id).overlay().close();
}

function fnGetEnteredProducts() {
    var disProArray = new Array();
    var tblLen = $("#tblPriceGroup tr").length;
    for (var i = 1; i <= tblLen; i++) {
        if ($("#hdnProductCode_" + i + "").val() != '') {
            disProArray.push($("#hdnProductCode_" + i + "").val());
        }
    }
    fnBindAllProducts(disProArray);
}

function fnGetSelectedProducts() {
    var selectedProArr = new Array();
    var proPrice = "[";
    $("input:checkbox[name=chkProducts]").each(function () {
        var tdName = this.value;
        if (this.checked) {
            var productCode = this.value;
            var productName = $("#" + this.id.replace("td_Pro_Code", "td_Pro_Name")).html();
            proPrice += "{Product_Code:" + '"' + "" + productCode + "" + '",'
                       + "Product_Name:" + '"' + "" + productName + "" + '",'
                       + "Invoice_Amount:" + '"' + "0.00" + '",'
                       + "PTS:" + '"' + "0.00" + '",'
                       + "PTR_WOTax:" + '"' + "0.00" + '",'
                       + "MRP:" + '"' + "0.00" + '",'
                       + "NRV:" + '"' + "0.00" + '",'
                       + "Source:" + "'Entry'" + ','
                       + "IsError:" + "'N'" + "},";

        }
    });
    proPrice = proPrice.slice(0, -1);
    proPrice += "]";
    var selectedProJson = eval('(' + proPrice + ')');
    fnCreatePriceGroup(selectedProJson)
}

function fnCreatePriceGroup(selectedProJson) {
    var content = "";
    var tblLen = $("#tblPriceGroup tr").length;
    if (tblLen > 1) {
        for (var i = 0; i < selectedProJson.length; i++) {
            fnCreateNewRow(selectedProJson[i]);
        }
    }
    else {

        content += "<table style='width:70%; border:1px solid #EFEFEF;' cellspacing='1' id='tblPriceGroup'><thead style='width:100%;'>";
        content += "<tr>";
        content += "<td class='tdHeaderStyle' style='width:5%;'>S.No</td><td class='tdHeaderStyle' style='width:30%;'>Product Name</td><td class='tdHeaderStyle' style='width:10%;'>Invoice Price</td>";
        content += "<td class='tdHeaderStyle' style='width:10%;'>PTS</td><td class='tdHeaderStyle' style='width:10%;'>PTR</td>";
        content += "<td class='tdHeaderStyle' style='width:10%;'>MRP</td><td class='tdHeaderStyle' style='width:10%;'>NRV</td>";
        content += "<td class='tdHeaderStyle' style='width:10%;'>Source</td><td class='tdHeaderStyle' style='width:5%;'>Delete</td>";
        content += "</tr></thead><tbody>";
        for (var i = 0; i < selectedProJson.length; i++) {
            var errorClass = "";
            content += "<tr>";
            if (selectedProJson[i].IsError == "Y") {
                errorClass = 'errorIndicator';
            }
            else {
                errorClass = "";
            }
            content += "<td style='width:5%;text-align:center;' id='tdSNo_" + rowNum + "'>" + (parseInt(i) + 1) + ". </td>";
            content += "<td><div id='dvProductName_" + rowNum + "' style='width:95%;' class=" + errorClass + "> " + selectedProJson[i].Product_Name + "</div>";
            content += "<input type='hidden' id='hdnProductCode_" + rowNum + "' value='" + selectedProJson[i].Product_Code + "'/></td>";
            content += "<td><input type='text' id='txtInvoicePrice_" + rowNum + "' class='tdDecimal' value='" + parseFloat(selectedProJson[i].Invoice_Amount).toFixed(2) + "' style='width:80%;'/></td>";
            content += "<td><input type='text' id='txtPTS_" + rowNum + "' class='tdDecimal' value='" + parseFloat(selectedProJson[i].PTS).toFixed(2) + "' style='width:80%;'/></td>";
            content += "<td><input type='text' id='txtPTR_" + rowNum + "' class='tdDecimal' value='" + parseFloat(selectedProJson[i].PTR_WOTax).toFixed(2) + "' style='width:80%;'/></td>";
            content += "<td><input type='text' id='txtMRP_" + rowNum + "' class='tdDecimal' value='" + parseFloat(selectedProJson[i].MRP).toFixed(2) + "' style='width:80%;'/></td>";
            content += "<td><input type='text' id='txtNRV_" + rowNum + "' class='tdDecimal' value='" + parseFloat(selectedProJson[i].NRV).toFixed(2) + "' style='width:80%;'/></td>";
            if (selectedProJson[i].Source != undefined) {
                content += "<td><span type='text' id='spnSource_" + rowNum + "' style='width:80%;padding-left:3px;;'>" + selectedProJson[i].Source + "</span></td>";
            }
            else {
                content += "<td><span type='text' id='spnSource_" + rowNum + "' style='width:80%;padding-left:3px;;'></span></td>";
            }
            content += "<td><div style='width:100%;' class='docProDelete'  id='tdDelete_" + rowNum + "' onclick='fnDelete(this);'></div></td>";
            content += "</tr>";
            rowNum = parseInt(rowNum) + 1;
        }
        content += "</tbody></table>";
        $("#dvPriceGroup").html(content);
        fnBindTableRowNumbering("tblPriceGroup", 0)
        //$("#" + newcompQtyId).keypress(function () { return fnIsNumber(event) });
        $(".tdDecimal").keypress(function () { return fnIsNumeric(event) });
        $(".tdDecimal").blur(function () { fnCheckNumeric(this) });
    }
    $("#dvSave").show();
    $("#dvProducts").overlay().close();
    //autoComplete(productJson_g, "txtProductName", "hdnProductCode", "autoProduct");
}


function fnCreateNewRow(obj) {
    if (obj != '') {
        var rCnt = document.getElementById("tblPriceGroup").getElementsByTagName("tr").length;
        var newRow = document.getElementById("tblPriceGroup").insertRow(parseInt(rCnt));
        var tdSNo = newRow.insertCell(0);
        var tdProductName = newRow.insertCell(1);
        var tdInvoicePrice = newRow.insertCell(2);
        var tdPTS = newRow.insertCell(3);
        var tdPTR = newRow.insertCell(4);
        var tdMRP = newRow.insertCell(5);
        var tdNRV = newRow.insertCell(6);
        var tdSource = newRow.insertCell(7);
        var tdDelete = newRow.insertCell(8);
        $(tdSNo).html(rowNum + '. ');
        tdSNo.id = 'tdSNo_' + rowNum;
        $(tdSNo).css('text-align', 'center');
        var errorClass = "";
        if (obj.IsError == "Y") {
            errorClass = 'errorIndicator';
        }
        else {
            errorClass = "";
        }
        $(tdProductName).html("<div id='dvProductName_" + rowNum + "' style='width:95%;' class=" + errorClass + "> " + obj.Product_Name + "</div><input type='hidden' id='hdnProductCode_" + rowNum + "' value='" + obj.Product_Code + "'/>");
        $(tdInvoicePrice).html("<input type='text' id='txtInvoicePrice_" + rowNum + "' class='tdDecimal' value='" + parseFloat(obj.Invoice_Amount).toFixed(2) + "' style='width:80%;'/>");
        $(tdPTS).html("<input type='text' id='txtPTS_" + rowNum + "' class='tdDecimal'  value='" + parseFloat(obj.PTS).toFixed(2) + "' style='width:80%;'/>");
        $(tdPTR).html("<input type='text' id='txtPTR_" + rowNum + "' class='tdDecimal'  value='" + parseFloat(obj.PTR_WOTax).toFixed(2) + "' style='width:80%;'/>");
        $(tdMRP).html("<input type='text' id='txtMRP_" + rowNum + "' class='tdDecimal'  value='" + parseFloat(obj.MRP).toFixed(2) + "' style='width:80%;'/>");
        $(tdNRV).html("<input type='text' id='txtNRV_" + rowNum + "' class='tdDecimal'  value='" + parseFloat(obj.NRV).toFixed(2) + "' style='width:80%;'/>");
        if (obj.Source != undefined) {
            $(tdSource).html("<span type='text' id='spnSource_" + rowNum + "'  style='width:85%;padding-left:3px;'>" + obj.Source + "</span>");
        }
        else {
            $(tdSource).html("<span type='text' id='spnSource_" + rowNum + "'  style='width:85%;padding-left:3px;'></span>");
        }
        $(tdDelete).html("<div style='width:100%;' class='docProDelete'  id='tdDelete_" + rowNum + "' onclick='fnDelete(this);'></div></div>");
        rowNum = parseInt(rowNum) + 1;
        fnBindTableRowNumbering("tblPriceGroup", 0)

        $(".tdDecimal").keypress(function () { return fnIsNumeric(event) });
        $(".tdDecimal").blur(function () { fnCheckNumeric(this) });
    }
    // autoComplete(productJson_g, "txtProductName", "hdnProductCode", "autoProduct");
}

function fnSubmit() {
    var result = fnSubmitValidate();
    if (result) {
        if ($("#tblPriceGroup") != undefined) {
            $("#dvAjaxLoad").show();
            var tblLen = $("#tblPriceGroup tr").length;
            var productPrice = "";
            for (var i = 1; i < rowNum; i++) {
                if ($("#txtInvoicePrice_" + i + "").is(":visible")) {
                    productPrice += $("#hdnProductCode_" + i).val() + "^";
                    productPrice += $("#txtInvoicePrice_" + i).val() + "^";
                    productPrice += $("#txtPTS_" + i).val() + "^";
                    productPrice += $("#txtPTR_" + i).val() + "^";
                    productPrice += $("#txtMRP_" + i).val() + "^";
                    productPrice += $("#txtNRV_" + i).val() + "^";
                    productPrice += "$";
                }
            }

            $.ajax({
                url: '../HiDoctor_Master/PriceGroup/InsertPriceGroup/',
                type: "POST",
                data: "priceGroupName=" + $("#txtPriceGroupName").val() + "&productPrice=" + productPrice + "&Mode=" + $("#hdnMode").val() + "&priceGroupCode=" + $("#hdnPriceGroupCode").val() + "",
                success: function (result) {
                    if (result.split(':')[0].toUpperCase() == "SUCCESS") {
                        fnMsgAlert('success', 'Success', 'Price group created successfully');
                        $("#dvDataEntry").show();
                        $("#dvOldPriceGroup").show();
                        $("#dvAjaxLoad").hide();
                        fnGetPriceGroupHeader();
                        fnClearAll();
                        $("#hdnPriceGroupCode").val(result.split(':')[1].split('_')[0]);
                        $("#dvRegionGroupMap").css('display', 'block');
                    }
                    else {
                        fnMsgAlert('error', 'Error', 'Can not create price group. Error:' + result.split(':')[1])
                        $("#dvAjaxLoad").hide();
                    }
                },
                error: function () {
                    $("#dvAjaxLoad").hide();
                }
            });
        }
        else {
            fnMsgAlert('info', 'Info', 'Please enter atleast one product');
        }
    }
    else {
        fnMsgAlert('info', 'Validate', 'Please correct the errors');
    }
}


function fnCheckNumeric(id) {
    if ($.trim($(id).val()).length > 0) {
        if (isNaN($(id).val())) {
            //fnMsgAlert('info', 'Information', 'Please enter numeric value only.');
            $(id).addClass('errorIndicator');
            $(id).attr('title', 'Please enter numeric value');
            // return false;
        }
        else {
            if ($(id).hasClass('errorIndicator')) {
                $(id).removeClass('errorIndicator');
                $(id).attr('title', '');
            }
            $(id).val(parseFloat($(id).val()).toFixed(2));
            //  return true;
        }
    }
    else {
        $(id).val("0.00");
    }
}

function fnClearAll() {
    $("#txtPriceGroupName").val('');
    $("#dvSave").hide();
    $("#dvPriceGroup").html('');
    $("#hdnPriceGroupCode").val('');
    $("#hdnMode").val('INSERT');
    $("#dvDataEntry").show();
    $("#dvOldPriceGroup").show();
    $("#dvUploadedData").hide();
    $("#dvExcelUpload").hide();
    $("#dvRegionGroupMap").hide();
    $("#txtOldPriceGroup").val('');
    $("#hdnOldPriceGroup").val('');
    $("#dvInsert .errorIndicator").removeClass('errorIndicator');
}

function fnShowPriceGroupDetails(priceGroupCode, priceGroupName) {
    $.ajax({
        url: '../HiDoctor_Master/PriceGroup/GetPriceGroupDetails/',
        type: "POST",
        data: "priceGroupCode=" + priceGroupCode + "",
        success: function (jsData) {
            jsData = eval('(' + jsData + ')');
            var content = "";
            if (jsData.length > 0) {
                content += "<div style='width:95%;font-size:13px;font-weight:bold;padding-left:15px;'>Product Group Name: " + priceGroupName + "</div>";
                content += "<div style='width:100%;'>";
                content += "<table style='width:95%; border:1px solid #EFEFEF;' class='data display datatable' id='tblPriceView'><thead style='width:100%;'>";
                content += "<tr>";
                content += "<td>Product Name</td><td>Invoice Price</td>";
                content += "<td>PTS</td><td>PTR</td>";
                content += "<td>MRP</td><td>NRV</td>";
                content += "</tr></thead><tbody>";
                for (var i = 0; i < jsData.length; i++) {
                    content += "<tr>";
                    content += "<td>" + jsData[i].Product_Name + "</td>";
                    content += "<td>" + jsData[i].Invoice_Amount + "</td>";
                    content += "<td>" + jsData[i].PTS + "</td>";
                    content += "<td>" + jsData[i].PTR_WOTax + "</td>";
                    content += "<td>" + jsData[i].MRP + "</td>";
                    content += "<td>" + jsData[i].NRV + "</td>";
                    content += "</tr>";
                }
                content += "</tbody></table><div>";
                $("#dvPrice").html(content);
                $('#tblPriceView').dataTable({
                    "sPaginationType": "full_numbers", "bPaginate": false, "bDestroy": true, "bSort": true, "bSearch": true//, "sGroupBy": "Doctor Name"
                });
                $("#dvPriceView").overlay().load();

            }
        },
        error: function () {
        }
    });
}

function fnEditPriceGroupDetails(priceGroupCode, priceGroupName, mode) {
    $("#dvInsert .errorIndicator").removeClass('errorIndicator');
    $("#hdnMode").val(mode);
    if (mode.toUpperCase() == "EDIT") {
        $("#hdnPriceGroupCode").val(priceGroupCode);
        $("#txtPriceGroupName").val(priceGroupName);
    }
    $("#dvPriceGroup").html('');
    $("#dvDataEntry").hide();
    $("#dvOldPriceGroup").hide();
    $.ajax({
        url: '../HiDoctor_Master/PriceGroup/GetPriceGroupDetails/',
        type: "POST",
        data: "priceGroupCode=" + priceGroupCode + "",
        success: function (jsData) {
            jsData = eval('(' + jsData + ')');
            if (jsData.length > 0) {
                fnCreatePriceGroup(jsData);
                $('#dvTabs').tabs('option', 'selected', 0);
            }
        },
        error: function () {
        }
    });
}


function fnGetPriceGroupDetails() {
    if (priceGroupHeaderJson_g == '') {
        $.ajax({
            url: '../HiDoctor_Master/PriceGroup/GetAllSaleProducts/',
            type: "POST",
            data: "A",
            success: function (jsData) {
                $("#dvAjaxLoad").show();
                jsData = eval('(' + jsData + ')');
                productJson_g = jsData;
                if (jsData.length > 0) {
                    var priceGroup = "[";
                    for (var i = 0; i < jsData.length; i++) {
                        priceGroup += "{label:" + '"' + "" + jsData[i].Price_Group_Name + "" + '",' + "value:" + '"' + "" + jsData[i].Price_Group_Code + "" + '"' + "},";
                    }
                    priceGroup = priceGroup.slice(0, -1);
                    priceGroup += "]";
                    priceGroup = eval('(' + priceGroup + ')');
                    priceGroupHeaderJson_g = priceGroup;
                    var disJson = jsonPath(priceGroupHeaderJson_g, "$.[?(@.label=='" + $("#txtOldPriceGroup").val() + "')]");
                    if (disJson != false) {
                        $("#hdnOldPriceGroup").val(disJson[0].value)
                    }
                    else {
                        $("#hdnOldPriceGroup").val('');
                    }
                    if ($("#hdnOldPriceGroup").val() == '') {
                        fnMsgAlert('info', 'Info', 'Please select any one valid group');
                        return;
                    }
                    if ($("#hdnOldPriceGroup").val() == undefined) {
                        fnMsgAlert('info', 'Info', 'Please select any one valid group');
                        return;
                    }
                    priceGroupCode = $("#hdnOldPriceGroup").val();
                    priceGroupName = $("#txtOldPriceGroup").val();
                    fnEditPriceGroupDetails(priceGroupCode, priceGroupName, 'INSERT')

                }
            }
        });
    } else {
        var disJson = jsonPath(priceGroupHeaderJson_g, "$.[?(@.label=='" + $("#txtOldPriceGroup").val() + "')]");
        if (disJson != false) {
            $("#hdnOldPriceGroup").val(disJson[0].value)
        }
        else {
            $("#hdnOldPriceGroup").val('');
        }
        if ($("#hdnOldPriceGroup").val() == '') {
            fnMsgAlert('info', 'Info', 'Please select any one valid group');
            return;
        }
        if ($("#hdnOldPriceGroup").val() == undefined) {
            fnMsgAlert('info', 'Info', 'Please select any one valid group');
            return;
        }
        priceGroupCode = $("#hdnOldPriceGroup").val();
        priceGroupName = $("#txtOldPriceGroup").val();
        fnEditPriceGroupDetails(priceGroupCode, priceGroupName, 'INSERT')
    }
    // fnValidateAutofill($("#txtOldPriceGroup"), priceGroupHeaderJson_g, "txtOldPriceGroup", "hdnOldPriceGroup");

}

function fnDelete(obj) {
    if (confirm("Are you sure you want to delete this row?")) {
        var parent = $(obj).parent().parent();
        parent.fadeOut('slow', function () { fnBindTableRowNumbering("tblPriceGroup", 0) });
    }
}

function fnBindTableRowNumbering(TableName, ColIndex) {
    var rows = $("#" + TableName + " tr:gt(0)"); // skip the header row
    var counter = 1;

    rows.each(function (index) {
        if ($(this).is(":visible")) {
            $("td:nth-child(1)", this).html((counter));
            counter = counter + 1;
        }
    });
}


function fnShowExcel() {
    var dataMode = $('input:radio[name=DataOption]:checked').val();
    if (dataMode == "1") {
        $("#dvOldPriceGroup").show();
        $("#dvExcelUpload").hide();
    }
    else {
        $("#dvOldPriceGroup").hide();
        $("#dvExcelUpload").show();
    }
}

function fnGenerateExcelData() {
    $("#dvAjaxLoad").show();
    $.ajax({
        url: '../HiDoctor_Master/PriceGroup/GetPriceGroupExcelData',
        type: "POST",
        data: "A",
        success: function (result) {
            if (result) {
                $('#aDownload').attr("href", "../Content/XLTemplates/" + result);
                $('#aDownload').html(result);
                $('#aDownload').css("display", "");
                $("#dvDownoad").css("display", "block");
                $("#dvAjaxLoad").hide();
            }
            else {
                // $('#spndownload').html("Failed");
                $("#dvAjaxLoad").hide();
            }

        },
        error: function () {
            alert("error");
            $("#dvAjaxLoad").hide();
        }
    });
}


function fnvalidateFile() {
    var fileName = $('#file').val();
    if (fileName.length == 0) {
        fnMsgAlert('info', 'Info', 'Please select the file and then click upload button');
        return false;
    }
    else {
        var ext = fileName.substring(fileName.lastIndexOf('.') + 1);
        if (ext == "xls") {
            $("#dvExcelUpload").css('display', 'none');
            $("#dvUploadedData").css('display', '');
            $("#dvUploadedMsg").html('Basic validation has been done for the uploaded excel file. Please <a hrerf="#" onclick="fnBindPriceData();" style="text-decoration:underline"> click here</a> to confirm');
            return true;
        }
        else {
            fnMsgAlert('info', 'Info', 'Please uplaod xls file only.')
            return false;
        }
    }
}
var uniqueJson = "";
function fnBindPriceData() {
    $("#dvTemp").html(document.getElementById('ifrmExcel').contentWindow.document.getElementById('dvData').innerHTML);
    if ($("#dvTemp").html() != '') {
        $("#tblExcel").tabletojson({
            headers: "Product_Name,Product_Code,Invoice_Amount,PTS,PTR_WOTax,MRP,NRV,Source,IsError",
            complete: function (x) {
                uniqueJson = eval('(' + x + ')');
                if (uniqueJson.length > 0) {
                    fnCreatePriceGroup(uniqueJson);
                }
            }
        });
    }
}


function fnSubmitValidate() {
    $("#dvInsert .errorIndicator").removeClass('errorIndicator');
    if ($("#txtPriceGroupName").val() == '') {
        $("#txtPriceGroupName").addClass('errorIndicator');
        $("#txtPriceGroupName").attr('title', 'Please enter price group name');
        fnMsgAlert('info', 'Info', 'Please enter price group name');
        return false;
    }
    if ($("#txtPriceGroupName").hasClass('errorIndicator')) {
        fnMsgAlert('info', 'Info', 'Please validate price group name');
        return false;
    }
    var disProArr = new Array();
    var disIndArr = new Array();
    var disIndRowNo = new Array();
    var tblLength = $("#tblPriceGroup tr").length;
    for (var i = 1; i < parseInt(rowNum) ; i++) {
        if ($("#txtInvoicePrice_" + i + "").is(":visible")) {
            if ($("#hdnProductCode_" + i) != undefined) {
                if ($("#hdnProductCode_" + i).val() == "") {
                    $("#dvProductName_" + i).addClass('errorIndicator');
                    $("#dvProductName_" + i).attr('title', 'Please validate the product Name');
                    return false;
                }
                else {
                    if ($("#dvProductName_" + i).hasClass('errorIndicator')) {
                        $("#dvProductName_" + i).removeClass('errorIndicator');
                        $("#dvProductName_" + i).removeAttr('title');
                    }
                }
                if ($.inArray($("#hdnProductCode_" + i).val(), disProArr) == -1) {
                    disProArr.push($("#hdnProductCode_" + i).val());
                    disIndArr.push($("#tdSNo_" + i).html());
                    disIndRowNo.push(i);
                    //Number Validation
                    fnCheckNumeric($("#txtInvoicePrice_" + i));
                    fnCheckNumeric($("#txtPTS_" + i));
                    fnCheckNumeric($("#txtPTR_" + i));
                    fnCheckNumeric($("#txtMRP_" + i));
                    fnCheckNumeric($("#txtNRV_" + i));
                }
                else {
                    var index = $.inArray($("#hdnProductCode_" + i).val(), disProArr);
                    fnMsgAlert('info', 'Validate', 'Product Name (' + $("#dvProductName_" + i).html() + ') repeated in the ' + disIndArr[index] + ' and ' + $("#tdSNo_" + i).html() + '  rows');
                    $("#dvProductName_" + disIndRowNo[index]).addClass('errorIndicator');
                    $("#dvProductName_" + i).addClass('errorIndicator');
                    $("#dvProductName_" + i).attr('title', 'Product Name repeated in the ' + disIndArr[index] + ' and ' + $("#tdSNo_" + i).html() + '  rows');
                    fnCheckNumeric($("#txtInvoicePrice_" + i));
                    fnCheckNumeric($("#txtPTS_" + i));
                    fnCheckNumeric($("#txtPTR_" + i));
                    fnCheckNumeric($("#txtMRP_" + i));
                    fnCheckNumeric($("#txtNRV_" + i));
                    return false;
                }
            }
        }
        //
    }
    //$("#tblPriceGroup").tabletojson({
    //    headers: "S_No,Product_Name,Product_Code,Invoice_Amount,PTS,PTR_WOTax,MRP,NRV,Source",
    //    complete: function (x) {
    //        uniqueJson = eval('(' + x + ')');
    //        return true;
    //    }
    //});
    return true;
}

function fnOpenMapping() {
    if ($("#hdnPriceGroupCode").val() != '') {
        $("#cboPriceGroup").val($("#hdnPriceGroupCode").val());
        fnGetMappedRegions();
    }
    $('#dvTabs').tabs('option', 'selected', 2);
}
var aa = "";
function fnBindRegionClassification() {

    $('option', $("#cboRegionClassification")).remove();
    $('option', $("#cboRegionType")).remove();
    $.ajax({
        url: '../HiDoctor_Master/PriceGroup/GetRegionClassification',
        type: "POST",
        data: "A",
        success: function (jsonData) {
            if (jsonData != '') {
                jsonData = eval('(' + jsonData + ')');
                aa = jsonData;
                var regionClassiJson = jsonData[0].Data;
                var regionTypeJson = jsonData[1].Data;
                if (regionClassiJson.length > 0) {
                    var regionClassi = "";
                    var regionClassiAll = "";
                    $("#cboRegionClassification").append("<option value='ALL' selected='selected'>ALL</option>");
                    for (var i = 0; i < regionClassiJson.length; i++) {
                        $("#cboRegionClassification").append("<option value='" + regionClassiJson[i].Region_Classification_Code + "'>" + regionClassiJson[i].Region_Classification_Name + "</option>");
                    }
                    $("#cboRegionClassification").multiselect();
                    $("#cboRegionClassification").multiselect({
                        noneSelectedText: 'Select RegionClassification'
                    }).multiselectfilter();
                }
                if (regionTypeJson.length > 0) {
                    var regionType = "";
                    var regionTypeAll = "";
                    $("#cboRegionType").append("<option value='ALL' selected='selected'>ALL</option>");
                    for (var i = 0; i < regionTypeJson.length; i++) {
                        $("#cboRegionType").append("<option value='" + regionTypeJson[i].Region_Type_Code + "'>" + regionTypeJson[i].Region_Type_Name + "</option>");
                    }
                    $("#cboRegionType").multiselect();
                    $("#cboRegionType").multiselect({
                        noneSelectedText: 'Select Region Type'
                    }).multiselectfilter();
                    //$("#cboRegionType").attr('selectedIndex', 0);
                    // $("#dRegClassi").show();
                }
                $("#cboRegionClassification").multiselect('refresh');
                $("#cboRegionType").multiselect('refresh');
                fnGetRegions();
            }
        },
        error: function () {
            alert("error");
        }
    });
}

function fnGetRegions(mode) {
    var isAll = false;
    var regionTypeCodes = "";
    var regionClassi = "";
    //Region Types
    $('select#cboRegionType > option:selected').each(function () {
        if ($(this).val() == "ALL") {
            isAll = true;
            return;
        }
    });
    if (!isAll) {
        $('select#cboRegionType > option:selected').each(function () {
            regionTypeCodes += $(this).val() + "^";
        });
    }
    else {
        $('select#cboRegionType > option').each(function () {
            if ($(this).val() != "ALL") {
                regionTypeCodes += $(this).val() + "^";
            }
        });
    }
    regionTypeCodes = regionTypeCodes.slice(0, -1);
    if (regionTypeCodes == "") {
        fnMsgAlert('info', 'info', 'Please select atleast one region type');
        return;
    }
    isAll = false;
    //Region Classification 
    if ($("#cboRegionClassification > option").length > 0) {
        $('select#cboRegionClassification > option:selected').each(function () {
            if ($(this).val() == "ALL") {
                isAll = true;
                return;
            }
        });
        if (!isAll) {
            $('select#cboRegionClassification > option:selected').each(function () {
                regionClassi += $(this).val() + "^";
            });
        }
        else {
            $('select#cboRegionClassification > option').each(function () {
                if ($(this).val() != "ALL") {
                    regionClassi += $(this).val() + "^";
                }
            });
        }
        regionClassi = regionClassi.slice(0, -1);
        if (regionClassi == "") {
            fnMsgAlert('info', 'info', 'Please select atleast one region classification');
            return;
        }
    }
    // $("#cboRegion").multiselect('destroy');
    $('option', $("#cboRegion")).remove();
    $.ajax({
        url: '../HiDoctor_Master/PriceGroup/GetRegions',
        type: "POST",
        data: "regionTypes=" + regionTypeCodes + "&regionClassifications=" + regionClassi + "",
        success: function (jsonData) {
            jsonData = eval('(' + jsonData + ')');
            if (jsonData.length > 0) {
                for (var i = 0; i < jsonData.length; i++) {
                    $("#cboRegion").append("<option value='" + jsonData[i].Region_Code + "'>" + jsonData[i].Region_Name + "</option>");
                }
                //  $("#cboRegion").multiselect('destroy');
                // $("#cboRegion").multiselect();
                $("#cboRegion").multiselect({
                    noneSelectedText: 'Select Regions'
                }).multiselectfilter();
                $("#cboRegion").multiselect('refresh');
                $.ajax({
                    url: '../HiDoctor_Master/PriceGroup/GetMappedRegionsByPriceGroup',
                    type: "POST",
                    data: "priceGroupCode=" + $("#cboPriceGroup").val() + "",
                    success: function (jsonData) {
                        jsonData = eval('(' + jsonData + ')');
                        if (jsonData.length > 0) {
                            for (var i = 0; i < jsonData.length; i++) {
                                $("#cboRegion").multiselect("widget").find(":checkbox[value='" + jsonData[i].Region_Code + "']").attr("checked", "checked");
                                $("#cboRegion option[value='" + jsonData[i].Region_Code + "']").attr("selected", true);
                            }
                            $("#cboRegion").multiselect({
                                noneSelectedText: 'Select Regions'
                            }).multiselectfilter();
                        }
                    },
                    error: function () {
                    }
                });

            }
        },
        error: function () {
            //
        }
    });
}


function fnPriceGroupMap() {
    //rdMap
    var regionCodes = "";
    var mappedRegion = $('input:radio[name=rdMap]:checked').val();
    if (mappedRegion == "1") {
        regionCodes = "ALL";
    }
    else {
        $('select#cboRegion > option:selected').each(function () {
            regionCodes += $(this).val() + "^";
        });
        //regionCodes = regionCodes.slice(0, -1);
        if (regionCodes == "") {
            fnMsgAlert('info', 'info', 'Please select atleast one region');
            return;
        }
    }
    //InsertPriceGroupMapping
    $.ajax({
        url: '../HiDoctor_Master/PriceGroup/InsertPriceGroupMapping',
        type: "POST",
        data: "priceGroupCode=" + $("#cboPriceGroup").val() + "&regionCodes=" + regionCodes + "",
        success: function (result) {
            if (result.split(':')[0].toUpperCase() == "SUCCESS") {
                fnMsgAlert('success', 'Success', 'Price group mapped to the selected regions');
                fnClearMapping();
            }
            else {
                fnMsgAlert('error', 'Error', 'Price group mapping failed. ' + result.split(':')[1]);
            }
        },
        error: function () {
            //
        }
    });
}

function fnGetMappedRegions() {
    //  $("#cboRegionType").multiselect("widget").find(":checkbox[value='ALL']").attr("checked", "checked");
    // $("#cboRegionClassification").multiselect("widget").find(":checkbox[value='ALL']").attr("checked", "checked");
    // fnGetRegions('CHANGE');
    fnBindRegionClassification();
}

function fnClearMapping() {
    $("#cboPriceGroup").attr('selectedIndex', 0);
    $("#cboPriceGroup").val('0');
    $("#cboRegionClassification").multiselect('destroy');
    $("#cboRegionType").multiselect('destroy');
    $("#cboRegion").multiselect('destroy');
    $('option', $("#cboRegionClassification")).remove();
    $('option', $("#cboRegionType")).remove();
    $('option', $("#cboRegion")).remove();
    // $("#dRegClassi").hide();
}

function fnValidatePriceGroupName() {
    //$("#txtPriceGroupName").removeClass('errorIndicator');
    //var priceGroupName = $("#txtPriceGroupName").val();
    //if (priceGroupHeaderJson_g != '') {
    //    var disJson = jsonPath(priceGroupHeaderJson_g, "$.[?(@.label=='" + priceGroupName + "')]");
    //    if (disJson != false) {
    //        $("#txtPriceGroupName").addClass('errorIndicator');
    //        $("#txtPriceGroupName").attr('title', 'Price group name already exists');
    //    }
    //    else {
    //        $("#txtPriceGroupName").removeClass('errorIndicator');
    //        $("#txtPriceGroupName").removeAttr('title');
    //    }
    //}

    var flag = false;
    if ($("#txtPriceGroupName").val() == "") {
        $("#txtPriceGroupName").addClass('errorIndicator');
        $("#txtPriceGroupName").attr('title', 'Please enter price group name');
    }
    else {
        var priceGroupName = $("#txtPriceGroupName").val();
        if (priceGroupHeaderJson_g != '') {

            for (var i = 0; i < priceGroupHeaderJson_g.length; i++) {
                if (priceGroupHeaderJson_g[i].label.toUpperCase() == priceGroupName.toUpperCase()) {
                    if ($("#hdnPriceGroupCode").val() != priceGroupHeaderJson_g[i].value) {
                        $("#txtPriceGroupName").addClass('errorIndicator');
                        $("#txtPriceGroupName").attr('title', 'Price group name already exists');
                        flag = true;
                        return;
                    }
                }
            }
        }
        if (!flag) {
            $("#txtPriceGroupName").removeClass('errorIndicator');
            $("#txtPriceGroupName").removeAttr('title');
        }
    }
}


function fnShowRegions() {
    var selectedVal = $("input:radio[name=rdMap]:checked").val();
    if (selectedVal == "1") {
        $("#dvRegionType").hide();
        $("#dRegClassi").hide();
        $("#dvBtnRegions").hide();
        $("#dvMainRegion").hide();
    }
    else {
        $("#dvRegionType").show();
        $("#dRegClassi").show();
        $("#dvBtnRegions").show();
        $("#dvMainRegion").show();
    }
}



function fnGetCustomers() {
    $('#dvRightCustomerPanel').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    var regionTree = $("#dvRegionTree").dynatree("getTree");
    var regionCode = regionTree.getActiveNode().data.key;
    var entity = $('input:radio[name=rdCustomer]:checked').val();
    $.ajax({
        url: '../HiDoctor_Master/PriceGroup/GetCustomersByRegionAndEntity',
        type: "POST",
        data: "regionCode=" + regionCode + "&entity=" + entity + "&priceGroupCode=" + $('#cboCustPriceGroup').val() + "",
        success: function (result) {
            $('#dvCustomer').html(result);
            //fnGetMappedCustomers();
        },
        error: function () {
            $("#dvRightCustomerPanel").unblock();
        },
        complete: function () {
            $("#dvRightCustomerPanel").unblock();
        }
    });
}


function fnSelectAllCustomers() {
    if ($("input:checkbox[name=chkSelectAllCustomer]").attr("checked") == "checked") {
        $("input:checkbox[name=chkSelectCustomer]").each(function () {
            this.checked = true;
        });
    }
    else {
        $("input:checkbox[name=chkSelectCustomer]").each(function () {
            this.checked = false;
        });
    }
}


function fnUpdateCustomer() {
    if ($('#cboCustPriceGroup').val() == '0') {
        fnMsgAlert('info', 'Info', 'Please select any one price group');
        return;
    }
    var i = 0;
    var customerCodes = "";
    $("input:checkbox[name=chkSelectCustomer]").each(function () {
        if (this.checked) {
            i = parseInt(i) + 1;
            customerCodes += this.value + "^";
        }
    });

    if (i == 0) {
        fnMsgAlert('info', 'Info', 'Please select atleast any one customer');
        return;
    }
    else {
        customerCodes = customerCodes.slice(0, -1);
        $('#dvRightCustomerPanel').block({
            message: '<h3>Processing</h3>',
            css: { border: '2px solid #ddd' }
        });
        var regionTree = $("#dvRegionTree").dynatree("getTree");
        var regionCode = regionTree.getActiveNode().data.key;
        var entity = $('input:radio[name=rdCustomer]:checked').val();
        $.ajax({
            url: '../HiDoctor_Master/PriceGroup/UpdateCustomerPriceGroup',
            type: "POST",
            data: "regionCode=" + regionCode + "&customerCodes=" + customerCodes + "&priceGroupCode=" + $('#cboCustPriceGroup').val() + "&entity=" + entity + "",
            success: function (result) {
                if (result.split(':')[0] == 'SUCCESS') {
                    fnMsgAlert('success', 'Success', result.split(':')[1]);
                    $("input:checkbox[name=chkSelectCustomer]").each(function () {
                        this.checked = false;
                    });
                    $("input:checkbox[name=chkSelectAllCustomer]").each(function () {
                        this.checked = false;
                    });
                }
                else {
                    fnMsgAlert('info', 'Error', result.split(':')[1]);
                }
            },
            error: function () {
                $("#dvRightCustomerPanel").unblock();
            },
            complete: function () {
                $("#dvRightCustomerPanel").unblock();
            }
        });
    }
}


function fnHideTree() {
    if ($("#spnTree").html() == "Hide Tree") {
        $("#dvLeftCustPanel").hide();
        $("#dvRightCustomerPanel").removeClass('col-lg-8');
        $("#dvRightCustomerPanel").addClass('col-lg-12');
        $("#spnTree").html('Show Tree');
    }
    else if ($("#spnTree").html() == "Show Tree") {
        $("#dvLeftCustPanel").show();
        $("#dvLeftCustPanel").addClass('col-sm-4');
        $("#dvRightCustomerPanel").removeClass('col-lg-12');
        $("#dvRightCustomerPanel").addClass('col-lg-8');
        $("#spnTree").html('Hide Tree');
    }
}
