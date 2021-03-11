
var rowNum = 1;
var dvContent = "";
var dvNum = "";
var saleProductJson_g = "";
var allProductJson_g = "";
var schemeHeaderJson_g = "";
var schemeDetailsJson_g = "";
function fnCreateSchemeTable() {
    var content = "";
    content += '<div class="widget" style="width:100%" id="dv_dvNum">';
    content += '<div style="width:100%;" class="widget-title">';
    content += '<div style="width: 100%; float: left;">';
    content += '<div style="float: left; width: 4%;">S.No</div>';
    content += '<div style="float: left; width: 40%;">Product Name</div>';
    //content += '<div style="float: left; width: 15%;">Scheme On</div>';
    content += '<div style="float: left; width: 15%;">Base Value</div>';
    content += '<div style="float: left; width: 15%;">From</div>';
    content += '<div style="float: left; width: 15%;">To</div>';
    content += '<div style="float: left; width: 5%;">Delete</div>';
    content += '</div></div>';
    content += '<div class="widget-body" style="width:100%;">';
    content += '<div style="width: 100%; float: left; height: 30px;" id="dvMainProduct_dvNum">';
    content += '<div style="float: left; width: 4%;" id="dv_SNo_dvNum">';
    content += 'dvNum';
    content += '</div>';
    content += '<div style="float: left; width: 40%;">';
    content += '<input type="text" id="txtProductName_dvNum" onblur="fnValidateAutofill(this,' + "saleProductJson_g" + ',\'txtProductName\',\'hdnProductCode\');fnCreateProductNewRow(dvNum);"  class="autoSaleProducts txtOffer" /><input type="hidden" id="hdnProductCode_dvNum"/>';
    content += '</div>';
    //content += '<div style="float: left; width: 15%;" >';
    //content += '<input type="text" id="txtSchemeOn_dvNum" class="txtOffer" />';
    //content += '</div>';
    content += '<div style="float: left; width: 15%;" >';
    content += '<input type="text" id="txtBaseValue_dvNum" class="txtOffer tdDecimal" style="text-align:right;"  />';
    content += '</div>';
    content += '<div style="float: left; width: 15%;">';
    content += '<input type="text" id="txtFromDate_dvNum"  class="txtOffer" disabled="disabled"/>';
    content += '</div>';
    content += '<div style="float: left; width: 15%;">';
    content += '<input type="text" id="txtToDate_dvNum" class="txtOffer" disabled="disabled" />';
    content += '</div>';
    content += '<div style="float: left; width: 5%;"><div style="width:50%;margin-top: 7px;" id="dvSalesDelete_dvNum" class="docProDelete"  id="dvDelete_dvNum" onclick="fnParentDelete(dvNum);"></div></div></div>';
    content += '<div style="width:90%" id="dvOffer_dvNum"><div style="width:4%;float:left;">&nbsp;</div><div style="width:80%;float:left;padding-top: 5px;">';
    content += '<table cellspacing="0" cellpadding="0" class="table table-bordered table-advance" id="tblOffer_dvNum">';
    content += '<thead>';
    content += '<tr>';
    content += '<td colspan="4" style="background-color:#E7F2FC;">Offer Products</td>';
    content += '</tr>';
    content += '<tr>';
    content += '<th style="width: 20%;display:none;">Offer Mode</th>';
    content += '<th style="width: 50%;">Product Name</th>';
    content += '<th style="width: 20%">Offer <span id="spnOfferValue_1"></span></th>';
    content += '<th style="width: 9%">Delete</th>';
    content += '</tr>';
    content += '</thead>';
    content += '<tbody>';
    content += '<tr>';
    content += '<td style="width: 20%; display:none;">';
    content += '<input type="text" id="txtOfferMode_dvNum_1" class="txtOffer" value="Quantity"  disabled="disabled"  /></td>';
    content += '<td style="width: 50%;">';
    content += '<input type="text" id="txtOfferProduct_dvNum_1" class="autoAllProducts txtOffer" onblur="fnValidateAutofill(this,' + "allProductJson_g" + ',\'txtOfferProduct\',\'hdnOfferProduct\');fnCreateOfferNewRow(dvNum,1);" /><input type="hidden" id="hdnOfferProduct_dvNum_1"/></td>';
    content += '<td style="width: 20%">';
    content += '<input type="text" id="txtOfferQty_dvNum_1" class="txtOffer tdDecimal" style="text-align:right;" /></td>';
    content += '<td style="width: 20%; vertical-align: middle;"><div style="width:15%;margin-left: 40%;" id="dvOfferDelete_dvNum_1" class="docProDelete"  id="dvDelete_dvNum_1" onclick="fnOfferDelete(this,\'1\');"></div></td>';
    content += '</tr>';
    content += '</tbody>';
    content += '</table></div><div style="clear:both"></div>';
    content += '</div><div style="clear:both"></div></div>';
    dvContent = content;
    content = content.replace(/dvNum/g, rowNum);
    $("#dvScheme").html(content);
    autoComplete(saleProductJson_g, "txtProductName", "hdnProductCode", "autoSaleProducts");//hdnOfferProduct_dvNum_1
    autoComplete(allProductJson_g, "txtOfferProduct", "hdnOfferProduct", "autoAllProducts");
    $(".tdDecimal").keypress(function () { return fnIsNumeric(event) });
    $(".tdDecimal").blur(function () { fnCheckNumeric(this) });

    rowNum = parseInt(rowNum) + 1;
}

function fnCreateProductNewRow(rowNo) {
    if (rowNo != parseInt(rowNum) - 1) {
        return;
    }
    else {
        var tempContent = dvContent;
        tempContent = tempContent.replace(/dvNum/g, rowNum);
        $("#dvScheme").append(tempContent);
        autoComplete(saleProductJson_g, "txtProductName", "hdnProductCode", "autoSaleProducts");//hdnOfferProduct_dvNum_1
        autoComplete(allProductJson_g, "txtOfferProduct", "hdnOfferProduct", "autoAllProducts");
        fnFillEffectiveFrom($("#txtEffectiveFrom"));
        fnFillEffectiveTo($("#txtEffectiveTo"));
        rowNum = parseInt(rowNum) + 1;
    }
}

function fnCreateOfferNewRow(maintblNo, rowNo) {
    var tblRow = $("#tblOffer_" + maintblNo + " tr").length;
    if (rowNo != parseInt(tblRow) - 2) {
        return;
    }
    else {
        var newRow = document.getElementById("tblOffer_" + maintblNo).insertRow(parseInt(tblRow));
        var tdOfferMode = newRow.insertCell(0);
        $(tdOfferMode).css("display", "none");
        var tdProductName = newRow.insertCell(1);
        var tdOfferQty = newRow.insertCell(2);
        var tdDelete = newRow.insertCell(3);
        $(tdOfferMode).html('<input type="text" id="txtOfferMode_' + maintblNo + '_' + (parseInt(rowNo) + 1) + '" class="txtOffer" value="Product"  disabled="disabled"   />');
        $(tdProductName).html('<input type="text" id="txtOfferProduct_' + maintblNo + '_' + (parseInt(rowNo) + 1) + '" class="txtOffer autoAllProducts" onblur="fnValidateAutofill(this,' + "allProductJson_g" + ',\'txtOfferProduct\',\'hdnOfferProduct\');fnCreateOfferNewRow(' + maintblNo + ',' + (parseInt(rowNo) + 1) + ');" /><input type="hidden" id="hdnOfferProduct_' + maintblNo + '_' + (parseInt(rowNo) + 1) + '"/>');
        $(tdOfferQty).html('<input type="text" id="txtOfferQty_' + maintblNo + '_' + (parseInt(rowNo) + 1) + '" class="txtOffer tdDecimal"  style="text-align:right;" />');
        $(tdDelete).html('<div style="width:15%;margin-left: 40%;" class="docProDelete"  id="dvOfferDelete_' + maintblNo + '_' + (parseInt(rowNo) + 1) + '" onclick="fnOfferDelete(this,' + maintblNo + ');"></div>');
        autoComplete(allProductJson_g, "txtOfferProduct", "hdnOfferProduct", "autoAllProducts");
        $(".tdDecimal").keypress(function () { return fnIsNumeric(event) });
        $(".tdDecimal").blur(function () { fnCheckNumeric(this) });
    }
}

function fnParentDelete(rowNo) {
    if (rowNo == parseInt(rowNum) - 1) {
        fnMsgAlert('info', 'Info', 'You can not delete the last row');
        return;
    }
    if (confirm("Are you sure you want to delete this row?")) {
        $("#dv_" + rowNo).hide();
    }
    var j = 1;
    for (var i = 1; i < parseInt(rowNum) ; i++) {
        if ($("#dv_" + i).is(":visible")) {
            $("#dv_SNo_" + i).html(j);
            j++;
        }
    }
}


function fnOfferDelete(obj, tblNo) {
    var objId = obj.id;
    var tblLen = $("#tblOffer_" + tblNo + " tr").length;
    if ($('#tblOffer_' + tblNo + ' tr:visible').length == "3") {
        fnMsgAlert('info', 'Info', 'You can not delete the entire row');
        return;
    }
    if (objId == "dvOfferDelete_" + tblNo + "_" + (parseInt(tblLen) - 2)) {
        fnMsgAlert('info', 'Info', 'You can not delete the last row');
        return;
    }
    if (confirm("Are you sure you want to delete this row?")) {
        var parent = $(obj).parent().parent();
        parent.fadeOut('slow', function () { });
    }
}

jQuery('.widget .tools .icon-chevron-down, .widget .tools .icon-chevron-up').click(function () {
    var el = jQuery(this).parents(".widget").children(".widget-body");
    if (jQuery(this).hasClass("icon-chevron-down")) {
        jQuery(this).removeClass("icon-chevron-down").addClass("icon-chevron-up");
        el.slideUp(200);
    } else {
        jQuery(this).removeClass("icon-chevron-up").addClass("icon-chevron-down");
        el.slideDown(200);
    }
});


function fnGetSalesProducts() {
    $.ajax({
        url: '../HiDoctor_Master/Scheme/GetAllSaleProducts/',
        type: "POST",
        data: "A",
        success: function (jsData) {
            jsData = eval('(' + jsData + ')');
            if (jsData.length > 0) {
                var salesProducts = "[";
                for (var i = 0; i < jsData.length; i++) {
                    salesProducts += "{label:" + '"' + "" + jsData[i].Product_Name + "" + '",' + "value:" + '"' + "" + jsData[i].Product_Code + "" + '"' + "},";
                }
                salesProducts = salesProducts.slice(0, -1);
                salesProducts += "];";
                salesProducts = eval(salesProducts);
                saleProductJson_g = salesProducts;
                // autoComplete(saleProductJson_g, "txtOldPriceGroup", "hdnOldPriceGroup", "autoPriceGroup");

                $.ajax({
                    url: '../HiDoctor_Master/Scheme/GetAllProducts/',
                    type: "POST",
                    data: "A",
                    success: function (jsData) {
                        jsData = eval('(' + jsData + ')');
                        if (jsData.length > 0) {
                            var products = "[";
                            for (var i = 0; i < jsData.length; i++) {
                                products += "{label:" + '"' + "" + jsData[i].Product_Name + "" + '",' + "value:" + '"' + "" + jsData[i].Product_Code + "" + '"' + "},";
                            }
                            products = products.slice(0, -1);
                            products += "];";
                            products = eval(products);
                            allProductJson_g = products;
                            // autoComplete(allProductJson_g, "txtOldPriceGroup", "hdnOldPriceGroup", "autoPriceGroup");
                            fnCreateSchemeTable();
                            fnGetSchemeHeader();
                        }
                    },
                    error: function () {
                        $("#dvAjaxLoad").hide();
                    }
                });

            }
        },
        error: function () {
            $("#dvAjaxLoad").hide();
        }
    });
}

function fnFillEffectiveFrom(obj) {
    var id = $(obj).attr('id');
    var effectiveFrom = $("#" + id).val();
    for (var i = 1; i <= parseInt(rowNum) ; i++) {
        if ($("#txtFromDate_" + i + "") != undefined) {
            $("#txtFromDate_" + i + "").val(effectiveFrom);
        }
    }
}


function fnFillEffectiveTo(obj) {
    var id = $(obj).attr('id');
    var effectiveTo = $("#" + id).val();
    for (var i = 1; i <= parseInt(rowNum) ; i++) {
        if ($("#txtToDate_" + i + "") != undefined) {
            $("#txtToDate_" + i + "").val(effectiveTo);
        }
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



function fnSubmit() {
    var result = fnSubmitValidate();


    if (result) {
        var errorCnt = $("#dv_" + i + " .errorIndicator").length;
        if (errorCnt > 0) {
            $("#dv_" + i + " .errorIndicator").removeClass('errorIndicator');
        }
        var salesProducts = "";
        $("#dvAjaxLoad").show();
        var schemeProducts = "";
        for (var i = 1; i < parseInt(rowNum) ; i++) {
            if ($("#dv_" + i + "").is(":visible")) {
                if ($("#hdnProductCode_" + i).val() != '') {
                    schemeProducts += $("#hdnProductCode_" + i).val() + "^";
                    salesProducts += $("#hdnProductCode_" + i).val() + "^";
                    schemeProducts += $("#txtBaseValue_" + i).val() + "|";
                    var offerTblLen = $("#tblOffer_" + i + " tr").length;
                    for (var j = 1; j < offerTblLen - 1; j++) {
                        if ($("#txtOfferProduct_" + i + "_" + j + "").is(":visible")) {
                            if ($("#hdnOfferProduct_" + i + "_" + j + "").val() != '') {
                                schemeProducts += $("#hdnOfferProduct_" + i + "_" + j + "").val() + "^";
                                schemeProducts += $("#txtOfferQty_" + i + "_" + j + "").val() + "~";
                            }
                        }
                    }
                    schemeProducts += "$";
                }
            }
        }
        if (schemeProducts == '') {
            fnMsgAlert('info', 'info', 'Please enter atleast one product');
            $("#dvAjaxLoad").hide();
            return;
        }
        var effectiveFrom = $("#txtEffectiveFrom").val().split('/')[1] + "/" + $("#txtEffectiveFrom").val().split('/')[0] + "/" + $("#txtEffectiveFrom").val().split('/')[2];
        var effectiveTo = $("#txtEffectiveTo").val().split('/')[1] + "/" + $("#txtEffectiveTo").val().split('/')[0] + "/" + $("#txtEffectiveTo").val().split('/')[2];

        $.ajax({
            url: '../HiDoctor_Master/Scheme/CheckSchemeProductValidation/',
            type: "POST",
            data: "salesProducts=" + salesProducts + "&effectiveFrom=" + effectiveFrom + "&effectiveTo="
                + effectiveTo + "&schemeCode=" + $("#hdnSchemeCode").val() + "",
            success: function (result) {
                if (result.split(':')[0].toUpperCase() == "SUCCESS") {
                    $.ajax({
                        url: '../HiDoctor_Master/Scheme/InsertScheme/',
                        type: "POST",
                        data: "schemeName=" + $("#txtSchemeName").val() + "&schemeBase=Quantity&effectiveFrom=" + effectiveFrom + "&effectiveTo="
                            + effectiveTo + "&mode=" + $("#hdnMode").val() + "&schemeCode=" + $("#hdnSchemeCode").val() + "&schemeProducts=" + schemeProducts + "",
                        success: function (result) {
                            if (result.split(':')[0].toUpperCase() == "SUCCESS") {
                                fnMsgAlert('success', 'Success', 'Scheme created successfully');
                                fnClearAll();
                            }
                            else if (result.split(':')[0].toUpperCase() == "FAILURE" & result.split(':')[1].toUpperCase().slice(0, 8) == "REPEATED") {
                                var repeatedproductCode = result.split(':')[1].toUpperCase().split('_')[1];
                                for (var i = 1; i < parseInt(rowNum) ; i++) {
                                    if ($("#dv_" + i + "").is(":visible")) {
                                        if ($("#hdnProductCode_" + i).val() == repeatedproductCode) {
                                            var repeatedProductName = $("#txtProductName_" + i).val();
                                            fnMsgAlert('info', 'Validate', 'Product Name (' + repeatedProductName + ') repeated in another one scheme with in selected from and to date');
                                            $("#dvAjaxLoad").hide();
                                            return;
                                        }
                                    }
                                }
                            }
                            else {
                                fnMsgAlert('error', 'Error', 'Failed to save. ' + result.split(':')[1].toUpperCase());
                            }
                            $("#dvAjaxLoad").hide();
                        },
                        error: function () {
                            $("#dvAjaxLoad").hide();
                        }
                    });
                }
                else if (result.split(':')[0].toUpperCase() == "FAILURE" & result.split(':')[1].toUpperCase().slice(0, 8) == "REPEATED") {
                    var repeatedproductCode = result.split(':')[1].toUpperCase().split('_')[1];
                    for (var i = 1; i < parseInt(rowNum) ; i++) {
                        if ($("#dv_" + i + "").is(":visible")) {
                            if ($("#hdnProductCode_" + i).val() == repeatedproductCode) {
                                var repeatedProductName = $("#txtProductName_" + i).val();
                                fnMsgAlert('info', 'Validate', 'Product Name (' + repeatedProductName + ') repeated in another one scheme with in selected from and to date');
                                $("#dvAjaxLoad").hide();
                                return;
                            }
                        }
                    }
                }
            }
        });
        //string schemeName, string schemeBase, string effectiveFrom, string effectiveTo, string mode, string schemeCode, string schemeProducts

    }
    else {
        // fnMsgAlert('info', 'Info', 'Please enter atleast one product');
    }

}


function fnSubmitValidate() {
    $("#dvInsert .errorIndicator").removeAttr('title');
    $("#dvInsert .errorIndicator").removeClass('errorIndicator');
    var flag = true;
    //for (var i = 1; i < parseInt(rowNum) ; i++) {
    //    var errorCnt = $("#dv_" + i + " .errorIndicator").length;
    //    if (errorCnt > 0) {
    //        $("#dv_" + i + " .errorIndicator").removeClass('errorIndicator');
    //    }
    //}

    if ($("#txtSchemeName").val() == '') {
        $("#txtSchemeName").addClass('errorIndicator');
        $("#txtSchemeName").attr('title', 'Please enter scheme name');
        flag = false;
    }
    if ($("#txtEffectiveFrom").val() == '') {
        $("#txtEffectiveFrom").addClass('errorIndicator');
        $("#txtEffectiveFrom").attr('title', 'Please select effective from date');
        flag = false;
    }
    if ($("#txtEffectiveTo").val() == '') {
        $("#txtEffectiveTo").addClass('errorIndicator');
        $("#txtEffectiveTo").attr('title', 'Please select effective to date');
        flag = false;
    }
    var saleProductAr = new Array();
    for (var i = 1; i < parseInt(rowNum) ; i++) {
        if ($("#dv_" + i + "").is(":visible")) {
            if ($("#txtProductName_" + i).val() != "") {
                if ($("#hdnProductCode_" + i).val() == "") {
                    $("#txtProductName_" + i).addClass('errorIndicator');
                    $("#txtProductName_" + i).attr('title', 'Please validate product name');
                    flag = false;
                }

                if ($("#txtBaseValue_" + i).val() == "" || $("#txtBaseValue_" + i).val() == "0.00") {
                    $("#txtBaseValue_" + i).addClass('errorIndicator');
                    $("#txtBaseValue_" + i).attr('title', 'Please enter base value');
                    flag = false;
                }
                var offerTblLen = $("#tblOffer_" + i + " tr").length;
                for (var j = 1; j < offerTblLen - 1; j++) {
                    if ($("#txtOfferProduct_" + i + "_" + j + "").is(":visible")) {
                        if ($("#txtOfferProduct_" + i + "_" + j + "").val() != '') {
                            if ($("#hdnOfferProduct_" + i + "_" + j + "").val() == "") {
                                $("#txtOfferProduct_" + i + "_" + j + "").addClass('errorIndicator');
                                $("#txtOfferProduct_" + i + "_" + j + "").attr('title', 'Please validate product name');
                                flag = false;
                            }
                            else {
                                if ($("#txtOfferQty_" + i + "_" + j + "").val() == "" || $("#txtOfferQty_" + i + "_" + j + "").val() == "0.00") {
                                    $("#txtOfferQty_" + i + "_" + j + "").addClass('errorIndicator');
                                    $("#txtOfferQty_" + i + "_" + j + "").attr('title', 'Please enter base value');
                                    flag = false;
                                }
                            }
                        }
                    }

                }
            }
        }
    }

    for (var i = 1; i < parseInt(rowNum) ; i++) {
        var errorCnt = $("#dv_" + i + " .errorIndicator").length;
        if (errorCnt == 0) {
            if ($("#dv_" + i + "").is(":visible")) {
                if ($("#hdnProductCode_" + i).val() == "") {
                    var offerTblLen = $("#tblOffer_" + i + " tr").length;
                    var offerCnt = 0;
                    for (var j = 1; j < offerTblLen - 1; j++) {
                        if ($("#txtOfferProduct_" + i + "_" + j + "").val() != '') {
                            offerCnt++;
                        }
                    }
                    if (offerCnt > 0) {
                        fnMsgAlert('info', 'Info', 'Please enter sale product at row number ' + i);
                        flag = false;
                        return;
                    }
                }
                if ($("#hdnProductCode_" + i).val() != "") {
                    if ($.inArray($("#hdnProductCode_" + i).val(), saleProductAr) >= 0) {
                        //   var index = $.inArray($("#hdnProductCode_" + i).val(), saleProductAr);
                        fnMsgAlert('info', 'Info', 'Product Name (' + $("#txtProductName_" + i).val() + ') repeated in row number ' + i);
                        flag = false;
                        return;
                    }
                    else {
                        saleProductAr.push($("#hdnProductCode_" + i).val());
                    }
                    var offerTblLen = $("#tblOffer_" + i + " tr").length;
                    var offerProductAr = new Array();
                    var offerCnt = 0;
                    for (var j = 1; j < offerTblLen - 1; j++) {
                        if ($("#txtOfferProduct_" + i + "_" + j + "").is(":visible")) {
                            if ($("#hdnOfferProduct_" + i + "_" + j + "").val() != '') {
                                if ($.inArray($("#hdnOfferProduct_" + i + "_" + j + "").val(), offerProductAr) >= 0) {
                                    fnMsgAlert('info', 'Info', ' Offer Product Name (' + $("#txtOfferProduct_" + i + "_" + j + "").val() + ') repeated in S.No ' + i);
                                    flag = false;
                                    return;
                                }
                                else {
                                    offerProductAr.push($("#hdnOfferProduct_" + i + "_" + j + "").val());
                                }
                                offerCnt++;
                            }
                        }
                    }
                    if (offerCnt == 0) {
                        fnMsgAlert('info', 'Info', 'Please enter atleast one offer at row number ' + i);
                        flag = false;
                        return;
                    }
                }
            }
        }
    }
    return flag;
}


function fnGetSchemeHeader() {
    $.ajax({
        url: '../HiDoctor_Master/Scheme/GetSchemeHeader/',
        type: "POST",
        data: "A",
        success: function (jsData) {
            jsData = eval('(' + jsData + ')');
            if (jsData.length > 0) {
                schemeHeaderJson_g = jsData;
                fnBindSchemeHeader(jsData);
            }
        },
        error: function () {
        }
    });
}

function fnBindSchemeHeader(jsData) {
    var content = "";
    var cboScheme = $("#cboScheme");
    $('option', cboScheme).remove();
    cboScheme.append("<option value=0>-Select Scheme-</option>");
    content += "<table style='width:50%; border:1px solid #EFEFEF;' id='tblSchemeHeader' class='data display datatable'><thead style='width:100%;'>";
    content += "<tr>";
    content += "<td style='width:5%;'>S.No</td><td style='width:20%;'>Scheme Name</td><td style='width:20%;'>Effective From</td><td style='width:20%;'>Effective to</td>";
    content += "<td  style='width:20%;'>View/Edit</td>";
    content += "</tr></thead><tbody>";
    for (var i = 0; i < jsData.length; i++) {
        content += "<tr>";
        content += "<td style='width:5%;text-align:center;'>" + (parseInt(i) + 1) + ". </td>";
        content += "<td>" + jsData[i].Scheme_Name + "</td>";
        content += "<td>" + jsData[i].Effective_From + "</td>";
        content += "<td>" + jsData[i].Effective_To + "</td>";
        content += "<td><a href='#' onclick='fnShowSchemeDetails(\"" + jsData[i].Scheme_Code + "\",\"" + jsData[i].Scheme_Name + "\",\"" + jsData[i].Effective_From + "\",\"" + jsData[i].Effective_To + "\");'>View</a>&nbsp;";
        content += "<a href='#' onclick='fnEditSchemeDetails(\"" + jsData[i].Scheme_Code + "\",\"" + jsData[i].Scheme_Name + "\",\"" + jsData[i].Effective_From + "\",\"" + jsData[i].Effective_To + "\");'>Edit</a></td>";
        content += "</tr>";
        cboScheme.append("<option value='" + jsData[i].Scheme_Code + "'>" + jsData[i].Scheme_Name + "</option>");
    }
    content += "</tbody></table>";
    $("#cboScheme").attr('selectedIndex', 0);

    $("#dvSchemeHeader").html(content);
    $('#tblSchemeHeader').dataTable({
        "sPaginationType": "full_numbers", "bPaginate": false, "bDestroy": true, "bSort": true, "bSearch": true//, "sGroupBy": "Doctor Name"
    });
}


function fnShowSchemeDetails(schemeCode, schemeName, effectiveFrom, effectiveTo) {
    $.ajax({
        url: '../HiDoctor_Master/Scheme/GetSchemeDetails/',
        type: "POST",
        data: "schemeCode=" + schemeCode + "",
        success: function (jsData) {
            jsData = eval('(' + jsData + ')');
            var content = "";
            if (jsData.Tables[0].Rows.length > 0) {
                content += "<div style='width:95%;font-size:13px;font-weight:bold;padding-left:15px;'>Scheme Name: " + schemeName + "</div>";
                content += "<div style='width:95%;font-size:13px;font-weight:bold;padding-left:15px;'>Effective From: " + effectiveFrom + "</div>";
                content += "<div style='width:95%;font-size:13px;font-weight:bold;padding-left:15px;'>Effective To: " + effectiveTo + "</div>";
                content += "<div style='width:100%;'>";
                content += "<table style='width:95%; border:1px solid #EFEFEF;' class='data display datatable' id='tblSchemeView'><thead style='width:100%;'>";
                content += "<tr>";
                content += "<td>Product Name</td><td>Base Value</td>";
                content += "<td>From</td><td>To</td>";
                content += "</tr></thead><tbody>";
                for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                    content += "<tr>";
                    content += "<td>" + jsData.Tables[0].Rows[i].Product_Name + "</td>";
                    content += "<td>" + jsData.Tables[0].Rows[i].Base_Value + "</td>";
                    content += "<td>" + jsData.Tables[0].Rows[i].Effective_From + "</td>";
                    content += "<td>" + jsData.Tables[0].Rows[i].Effective_To + "</td>";
                    content += "</tr>";
                    content += "<tr>";
                    content += "<td>";
                    content += "<td colspan='3'>";
                    var disJson = jsonPath(jsData, "$.Tables[1].Rows[?(@.Scheme_Detail_Code=='" + jsData.Tables[0].Rows[i].Scheme_Detail_Code + "')]");
                    if (disJson != false) {
                        content += "<table style='width:95%; border:1px solid #EFEFEF;' class='data display datatable'><thead style='width:100%;'>";
                        content += "<tr>";
                        content += "<td>Product Name</td><td>Offer</td>";
                        content += "</tr></thead><tbody>";
                        for (var f = 0; f < disJson.length; f++) {
                            content += "<tr>";
                            content += "<td>" + disJson[f].Product_Name + "</td>";
                            content += "<td>" + disJson[f].Offer_Value + "</td>";
                            content += "</tr>";
                        }

                    }
                    content += "</tbody></table>";
                    content += "</td>";
                    content += "</tr>";
                }
                content += "</tbody></table><div>";
                $("#dvAllScheme").html(content);
                $("#dvSchemeView").overlay().load();
            }
        },
        error: function () {
        }
    });
}

function fnEditSchemeDetails(schemeCode, schemeName, effectiveFrom, effectiveTo) {
    $("#txtEffectiveFrom").removeAttr("disabled");
    $("#txtEffectiveTo").removeAttr("disabled");
    $("#dvInsert .errorIndicator").removeClass('errorIndicator');
    $("#hdnMode").val("EDIT");
    $("#hdnSchemeCode").val(schemeCode);
    $("#txtSchemeName").val(schemeName);
    $("#txtEffectiveFrom").val(effectiveFrom);
    $("#txtEffectiveTo").val(effectiveTo)
    $("#dvScheme").html('');
    rowNum = 1;
    fnCreateSchemeTable();
    $.ajax({
        url: '../HiDoctor_Master/Scheme/GetSchemeDetails/',
        type: "POST",
        data: "schemeCode=" + schemeCode + "",
        success: function (jsData) {
            jsData = eval('(' + jsData + ')');
            if (jsData.Tables[0].Rows.length > 0) {
                $('#dvTabs').tabs('option', 'selected', 0);
                fnBindSchemeData(jsData);
            }
        },
        error: function () {
        }
    });
}

function fnBindSchemeData(jsData) {
    var d = 0;
    var isEdit = false;
    for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {

        if (i > 0) {
            fnCreateProductNewRow(d);
        }
        d = parseInt(i + 1);
        var disSchJson = jsonPath(jsData, "$.Tables[2].Rows[?(@.Scheme_Code=='" + jsData.Tables[0].Rows[i].Scheme_Code + "')]");
        $("#hdnProductCode_" + d).val(jsData.Tables[0].Rows[i].Product_Code);
        $("#txtProductName_" + d).val(jsData.Tables[0].Rows[i].Product_Name);
        $("#txtBaseValue_" + d).val(jsData.Tables[0].Rows[i].Base_Value);
        var e = 0;
        var disJson = jsonPath(jsData, "$.Tables[1].Rows[?(@.Scheme_Detail_Code=='" + jsData.Tables[0].Rows[i].Scheme_Detail_Code + "')]");
        if (disJson != false) {
            for (var f = 0; f < disJson.length; f++) {

                if (f > 0) {
                    fnCreateOfferNewRow(d, e);
                }
                e = parseInt(f + 1);

                if (disSchJson != false && disSchJson != undefined) {
                    isEdit = true;
                    $("#dvOfferDelete_" + d + "_" + e + "").removeClass('docProDelete');
                }
                $("#txtOfferProduct_" + d + "_" + e + "").val(disJson[f].Product_Name);
                $("#hdnOfferProduct_" + d + "_" + e + "").val(disJson[f].Product_Code);
                $("#txtOfferQty_" + d + "_" + e + "").val(disJson[f].Offer_Value)

            }
            if (disSchJson == false || disSchJson == undefined) {
                fnCreateOfferNewRow(d, parseInt(disJson.length));
                autoComplete(allProductJson_g, "txtOfferProduct", "hdnOfferProduct", "autoAllProducts");
            }
        }

        if (disSchJson != false && disSchJson != undefined) {
            isEdit = true;
            $("#dv_" + d + " input").attr('disabled', 'disabled');
            $("#dvSalesDelete_" + d).removeClass('docProDelete');
        }
        //if (jsData.Tables[0].Rows[i].Scheme_Code != null) {
        //    isEdit = true;
        //    $("#dv_" + d + " input").attr('disabled', 'disabled');
        //    $("#dvSalesDelete_" + d).removeClass('docProDelete');
        //}
    }
    fnCreateProductNewRow(parseInt(jsData.Tables[0].Rows.length));
    fnFillEffectiveFrom($("#txtEffectiveFrom"));
    fnFillEffectiveTo($("#txtEffectiveTo"));
    if (isEdit) {
        $("#txtEffectiveFrom").attr("disabled", "disabled");
        $("#txtEffectiveTo").attr("disabled", "disabled");
    }
}


function fnValidateSchemeName() {
    var flag = false;
    if ($("#txtSchemeName").val() == "") {
        $("#txtSchemeName").addClass('errorIndicator');
        $("#txtSchemeName").attr('title', 'Please enter scheme name');
    }
    else {
        var schemeName = $("#txtSchemeName").val();
        if (schemeHeaderJson_g != '') {
            for (var i = 0; i < schemeHeaderJson_g.length; i++) {
                if (schemeHeaderJson_g[i].Scheme_Name.toUpperCase() == schemeName.toUpperCase()) {
                    if ($("#hdnSchemeCode").val() != schemeHeaderJson_g[i].Scheme_Code) {
                        $("#txtSchemeName").addClass('errorIndicator');
                        $("#txtSchemeName").attr('title', 'Scheme name already exists');
                        flag = true;
                        return;
                    }
                }
            }
        }
        if (!flag) {
            $("#txtSchemeName").removeClass('errorIndicator');
            $("#txtSchemeName").removeAttr('title');
        }
    }
}

function fnClearAll() {
    $("#dvInsert .errorIndicator").removeClass('errorIndicator');
    $("#txtSchemeName").val('');
    $("#dvScheme").html('');
    $("#hdnSchemeCode").val('');
    $("#hdnMode").val('INSERT');
    $("#dvMapping").load("../HiDoctor_Master/Scheme/RegionSchemeMapping");
    $("#txtEffectiveFrom").val('');
    $("#txtEffectiveTo").val('');
    fnGetSalesProducts();
}


function fnClosePopUp(id) {
    $("#" + id).overlay().close();
}

