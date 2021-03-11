var userPrivilegeContainer_g = "";
var productPrice_g = "";
var productAutofill_g = "";
var productAutofill_ProductCheck = "", secondaryDetails = "";
var rowNumber = "", tableCount = "";
var inputColumn = "", stockiestjsonString = "", poolstockiestjsonString = "";
var ssEntryMode = "", customerjsonString = "";
var compute = "", editMode = "";
var selectedUserCode = "";
var regionCode = "";
var ssformulas = "";
var priceEdit = "";
var productjsonString = "";
var inputColumnArr = new Array();
var flag = true;
var validateCustomerCode = "";
var PSDetails = "";
var PSPrefillDetails = "";
var checkIsPSPrefill = "";
var mode = "";
var draftOrSubmitmode = "";
var Draft_const_string = "DRAFT";
var validateStockSales = "";
var IsDraftValidationReq = true;
var ssEntryProductCheck = "";
var productCode = "", month = "", year = "", statementDate = "", baseTypeCode = "", baseCode = "", ssStatus = "", ProductRemarks = "";
var customerCode = "", customerEntityType = "", divisionCode = "";
var openingBalance = 0.0, purchase = 0.0, purchaseReturn = 0.0, unitrate = 0;
var hdnOpeningBalance = 0.0;
var hdnIs_Manually_Edited = "";
var sales = 0.0, salesReturn = 0.0, transit = 0.0, closingBalance = 0.0, freeGoods = 0.0;
var SSProductBringType = "";
var savemode = "";
var yearVal = "";
var monthVal = "";
var productarray = new Array();
var SalesArr = [];

function fnCreateSecondarySalesTable(selectedRegion) {
    debugger;
    regionCode = selectedRegion.data.key.split('_')[0];
    userPrivilegeContainer_g = "";
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/Master/GetUserPrivileges',
        data: 'regionCode=' + selectedRegion.data.key.split('_')[0],
        success: function (response) {
            debugger;
            userPrivilegeContainer_g = response;
            if (userPrivilegeContainer_g[1] != null) {
                if (userPrivilegeContainer_g[1].Data[0] != undefined) {
                    selectedUserCode = userPrivilegeContainer_g[1].Data[0].UserCode;
                    validateStockSales = jsonPath(userPrivilegeContainer_g[0], "$.Data[?(@.PrivilegeName=='VALIDATE_PREVIOUS_STOCK_SALES_ON_DRAFT')]");

                    //Initialize as false
                    IsDraftValidationReq = false

                    //Check if privilege is set
                    if (validateStockSales != false) {
                        //Get the privilege value
                        validateStockSales = validateStockSales[0].PrivilegeValue;
                        if (validateStockSales == Draft_const_string) {
                            //Privilege is set to check on Draft
                            IsDraftValidationReq = true;
                        }
                    }
                    // regionCode = userPrivilegeContainer_g[1].Data[0].RegionCode;
                }
                else {
                    selectedUserCode = "";
                }
            }
            else {
                fnMsgAlert('info', 'Secondary Sales', 'No user found for this region.');
                $('#SecondarySalesDetails').hide();
                $('#productopoupLink').hide();
                $('#trStockiest').hide();
                $('#imgAdd').hide();
                return false;
            }
            fnCreateSecandryTable(selectedUserCode, regionCode);
            fnMonthAndYear();
            $('#divMain').show();
            $('#txtStockiestName').val('')
            $('#txtStatmentDate').val('');
            $('#hdnStatus').val('');
        }
    });
}
// create empty table
function fnCreateSecandryTable(selectedUserCode, regionCode) {
    debugger;
    if (userPrivilegeContainer_g != null) {
        // SeCondary Sales Privilege    

        $("#divInputHeader").show();
        var secProductBringType = jsonPath(userPrivilegeContainer_g[0], "$.Data[?(@.PrivilegeName=='SECONDARY_SALES_PRODUCTS_BRING_TYPE')]");
        if (secProductBringType != false) {
            secProductBringType = secProductBringType[0].PrivilegeValue;
            secProductBringType = secProductBringType.replace(',', '^');
            if (secProductBringType != "") {
                secProductBringType = secProductBringType + "^";
            }
        }
        else {
            $.unblockUI();
            fnMsgAlert('info', 'Secondary Sales', 'Secondary sales product bring type privilege not mapped.');
            $('#SecondarySalesDetails').hide();
            $('#productopoupLink').hide();
            $('#trStockiest').hide();
            $('#imgAdd').hide();
            $('#btnSubmit').hide();
            $("#divInputHeader").hide();
            return false;
        }

        // Get InputColumns
        inputColumn = jsonPath(userPrivilegeContainer_g[0], "$.Data[?(@.PrivilegeName=='SS_INPUT_COLUMNS')]");
        if (inputColumn != false) {
            inputColumn = inputColumn[0].PrivilegeValue;
            inputColumnArr = inputColumn.split(',');
            inputColumnArr.push("REMARKS");
        }
        else {
            $.unblockUI();
            fnMsgAlert('info', 'Secondary Sales', 'SS input column privilege not mapped.');
            $('#SecondarySalesDetails').hide();
            $('#productopoupLink').hide();
            $('#trStockiest').hide();
            $('#imgAdd').hide();
            $('#btnSubmit').hide();
            $("#divInputHeader").hide();
            return false;
        }
        // Entry Mode          
        ssEntryMode = jsonPath(userPrivilegeContainer_g[0], "$.Data[?(@.PrivilegeName=='SS_ENTRY_MODE')]");
        if (ssEntryMode != false) {
            ssEntryMode = ssEntryMode[0].PrivilegeValue;
        }
        else {
            $.unblockUI();
            fnMsgAlert('info', 'Secondary Sales', 'Entry mode privilege not mapped.');
            $('#SecondarySalesDetails').hide();
            $('#productopoupLink').hide();
            $('#trStockiest').hide();
            $('#imgAdd').hide();
            $('#btnSubmit').hide();
            $("#divInputHeader").hide();
            return false;
        }
        debugger;

        compute = jsonPath(userPrivilegeContainer_g[0], "$.Data[?(@.PrivilegeName=='SS_WHAT_TO_COMPUTE')]");
        if (compute != false) {
            compute = compute[0].PrivilegeValue;
        }
        else {
            $.unblockUI();
            fnMsgAlert('info', 'Secondary Sales', 'SS what to compute privilege not mapped.');
            $('#SecondarySalesDetails').hide();
            $('#productopoupLink').hide();
            $('#trStockiest').hide();
            $('#imgAdd').hide();
            $('#btnSubmit').hide();
            $("#divInputHeader").hide();
            return false;
        }

        ssformulas = jsonPath(userPrivilegeContainer_g[0], "$.Data[?(@.PrivilegeName=='SS_FORMULA')]");
        if (ssformulas != false) {
            ssformulas = ssformulas[0].PrivilegeValue;
        }
        else {
            $.unblockUI();
            fnMsgAlert('info', 'Secondary Sales', 'SS formula privilege not mapped.');
            $('#SecondarySalesDetails').hide();
            $('#productopoupLink').hide();
            $('#trStockiest').hide();
            $('#imgAdd').hide();
            $('#btnSubmit').hide();
            $("#divInputHeader").hide();
            return false;
        }


        editMode = jsonPath(userPrivilegeContainer_g[0], "$.Data[?(@.PrivilegeName=='SS_COMPUTED_FIELD_EDITABLE')]");
        if (editMode != false) {
            editMode = editMode[0].PrivilegeValue;
        }
        else {
            editMode = "NO";
        }

        priceEdit = jsonPath(userPrivilegeContainer_g[0], "$.Data[?(@.PrivilegeName=='ALLOW_SS_PRICE_EDIT')]");
        if (priceEdit != false) {
            priceEdit = priceEdit[0].PrivilegeValue;
        }
        else {
            priceEdit = "NO";
        }
        $('#btnSubmit').show();
        if (ssEntryMode.toUpperCase() == "REP") {
            $('#trStockiest').hide();
            $('#imgAdd').hide();
        }
        else if (ssEntryMode.toUpperCase() == "STOCKIEST") {
            $('#trStockiest').show();
            $('#imgAdd').hide();
        }
        else if (ssEntryMode.toUpperCase() == "CUSTOMER") {
            $('#trStockiest').show();
            $('#imgAdd').show();
        }
        else {
            $('#imgAdd').hide();
        }
        $("#divReport").html('');
        $("#SecondarySalesDetails").html('');
        $.blockUI();
        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Activity/SecondarySales/GetSecProductAutoFill ',
            async: false,
            data: 'userCode=' + selectedUserCode + '&ProductTypeCode=' + secProductBringType + '&regionCode=' + regionCode + '&entryMode=' + ssEntryMode + '&stockiestCode=' + $('#hdnStockiestCode').val(),
            success: function (response) {
                debugger;
                if (response.error) {
                    $.unblockUI();
                    fnMsgAlert('error', 'Error', 'An error occurred while retrieving data. Please try again');
                    $.unblockUI();
                    return false;
                }
                else {
                    debugger
                    productAutofill_g = response.Data;
                    $.unblockUI();
                    stockiestjsonString = "";
                    customerjsonString = "";
                    productjsonString = "";
                    if (productAutofill_g[0].Data.length > 0) {
                        //var product = "[";
                        //for (var i = 0; i < productAutofill_g[0].Data.length; i++) {
                        //    var prodName = "";
                        //    if (productAutofill_g[0].Data[i].Ref_Key1 == "0") {
                        //        prodName = productAutofill_g[0].Data[i].Product_Name + ' (-)';
                        //    } else {
                        //        prodName = productAutofill_g[0].Data[i].Product_Name + ' (' + productAutofill_g[0].Data[i].Ref_Key1 + ')';
                        //    }
                        //    product += "{label:" + '"' + "" + prodName + "" + '",' + "value:" + '"' + "" + productAutofill_g[0].Data[i].Product_Code + "" + '"' + "}";
                        //    if (i < productAutofill_g[0].Data.length - 1) {
                        //        product += ",";
                        //    }
                        //}
                        //product += "];";
                        //productjsonString = eval(product);


                        var product = [];
                        for (var i = 0; i < productAutofill_g[0].Data.length; i++) {
                            var obj = {};
                            var prodName = "";
                            if (productAutofill_g[0].Data[i].Ref_Key1 == "0") {
                                prodName = productAutofill_g[0].Data[i].Product_Name + ' (-)';
                            } else {
                                prodName = productAutofill_g[0].Data[i].Product_Name + ' (' + productAutofill_g[0].Data[i].Ref_Key1 + ')';
                            }
                            obj.label = prodName;
                            obj.value = productAutofill_g[0].Data[i].Product_Code;
                            product.push(obj);
                        }
                        productjsonString = eval(product);
                        if (ssEntryMode.toUpperCase() == "STOCKIEST") {
                            debugger;
                            var stockiest = "[";
                            for (var i = 0; i < productAutofill_g[5].Data.length; i++) {

                                stockiest += "{label:" + '"' + "" + productAutofill_g[5].Data[i].Customer_Name + "" + '",' + "value:" + '"' + "" + productAutofill_g[5].Data[i].Customer_Code + "" + '"' + "}";
                                if (i < productAutofill_g[5].Data.length - 1) {
                                    stockiest += ",";
                                }
                            }


                            stockiest += "];";
                            stockiestjsonString = eval(stockiest);

                            //debugger;
                            //var poolstockiest = "[";

                            //poolstockiest += "];";
                            //poolstockiestjsonString = eval(poolstockiest);



                            if (productAutofill_g[2].Data.length > 0) {
                                $('#trStockiest').show();
                                $('#imgAdd').hide();
                                $("#txtStockiestName").unautocomplete();
                                autoComplete(stockiestjsonString, "txtStockiestName", "hdnStockiestCode", 'autoStockiest');
                            }
                            else {
                                $('#trStockiest').hide();
                                $('#SecondarySalesDetails').hide();
                                $('#productopoupLink').hide();
                                $.unblockUI();
                                fnMsgAlert('info', 'Secondary Sales', 'No Stockiest Found.');
                                $('#imgAdd').hide();
                                $('#btnSubmit').hide();
                            }

                        }
                        var tableContent = "";

                        //if (ssEntryMode.toUpperCase() == "CUSTOMER") {
                        //    $('#trStockiest').show();
                        //    $('#imgAdd').show();
                        //    var stockiest = "[";
                        //    for (var i = 0; i < productAutofill_g[2].Data.length; i++) {
                        //        stockiest += "{label:" + '"' + "" + productAutofill_g[2].Data[i].StockiestName + "" + '",' + "value:" + '"' + "" + productAutofill_g[2].Data[i].StockiestCode + "" + '"' + "}";
                        //        if (i < productAutofill_g[2].Data.length - 1) {
                        //            stockiest += ",";
                        //        }
                        //    }
                        //    stockiest += "];";
                        //    stockiestjsonString = eval(stockiest);
                        //    // if (stockiestBringType != "") {
                        //    $('#trStockiest').show();
                        //    $('#imgAdd').show();
                        //    $("#txtStockiestName").unautocomplete();
                        //    autoComplete(stockiestjsonString, "txtStockiestName", "hdnStockiestCode", 'autoStockiest');
                        //    // }
                        //    var customer = "[";
                        //    for (var i = 0; i < productAutofill_g[3].Data.length; i++) {
                        //        customer += "{label:" + '"' + "" + productAutofill_g[3].Data[i].Customer_Name + "" + '",' + "value:" + '"' + "" + productAutofill_g[3].Data[i].Customer_Code + "" + '"' + "}";
                        //        if (i < productAutofill_g[3].Data.length - 1) {
                        //            customer += ",";
                        //        }
                        //    }
                        //    customer += "];";
                        //    customerjsonString = eval(customer);
                        //    tableCount = "1";
                        //    tableContent += "<table cellspacing='0' cellpadding='0' id='tblSecondarySales' width='100%' class='data display datatable' >";
                        //    tableContent += "<tr><td align='left' style='font-size: 15px;'><label style='margin-right:55px'>Customer Name<label>  </label></label>  <input type='text' id='txtCustomerName_1_1'  class='autoCustomers'  style='width:200px' /><input type='hidden' id='hdnCustomerCode_1_1' />";
                        //    tableContent += "</td></tr>";
                        //    tableContent += "<tr><td>";
                        //    tableContent += "<table id='tblSubSec_1_1'>";
                        //    tableContent += "<thead>";
                        //    tableContent += "<tr><th  style='width:15%'>PRODUCT NAME</th>";
                        //    tableContent += "<th   style='width:9%;'>UNIT RATE</th>";
                        //    for (var i = 0; i < inputColumnArr.length; i++) {
                        //        if (inputColumnArr[i].toUpperCase() == "CLOSING_BALANCE") {
                        //            tableContent += "<th class='numericth' style='width:9%;'>" + inputColumnArr[i].replace('_', ' ') + "</th>";
                        //            tableContent += "<th class='numericth' style='width:9%;'>" + inputColumnArr[i].replace('_', ' ') + " AMOUNT</th>";
                        //        }
                        //        else if (inputColumnArr[i].toUpperCase() == "SALES") {
                        //            tableContent += "<th class='numericth' style='width:9%;'>" + inputColumnArr[i].replace('_', ' ') + "</th>";
                        //            tableContent += "<th class='numericth' style='width:9%;'>" + inputColumnArr[i].replace('_', ' ') + " AMOUNT</th>";
                        //        }
                        //        else if (inputColumnArr[i].toUpperCase() == "REMARKS") {
                        //            tableContent += "<th style='width:9%;'>" + inputColumnArr[i].replace('_', ' ') + "</th>";
                        //        }
                        //        else {
                        //            tableContent += "<th class='numericth' style='width:9%;'>" + inputColumnArr[i].replace('_', ' ') + "</th>";
                        //        }
                        //    }
                        //    tableContent += "</tr>";
                        //    tableContent += "</thead>";
                        //    tableContent += "<tbody>";
                        //    for (var i = 1; i <= 2; i++) {
                        //        tableContent += "<tr>";
                        //        tableContent += "<td><input type='text' id='txtProductName_1_" + i + "'  class='autoProducts' ondblclick='fnCreateNewRowInCustomerProduct(this);'  onkeyup= 'fnCreateNewRowInCustomerProduct(this);' style='width:200px' /><input type='hidden' id='hdnProductCode_1_" + i + "' /></td>";
                        //        if (priceEdit.toUpperCase() == "NO") {
                        //            tableContent += "<td><input type='text' id='txtUnitRate_1_" + i + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;' readonly='readonly' /></td>";
                        //        }
                        //        else {
                        //            tableContent += "<td><input type='text' id='txtUnitRate_1_" + i + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'  /></td>";
                        //        }
                        //        for (var j = 0; j < inputColumnArr.length; j++) {
                        //            if (inputColumnArr[j].toUpperCase() == compute.toUpperCase()) {
                        //                if (editMode.toUpperCase() == "NO") {
                        //                    tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-1_" + i + "'  style='width:70px;' class='checknumeric txtReadonly' readonly='readonly' /></td>";
                        //                }
                        //                else {
                        //                    tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-1_" + i + "'  style='width:70px;' class='checknumeric' onclick= '$(this).select();'  /></td>";
                        //                }
                        //            }
                        //            else {
                        //                if (inputColumnArr[j].toUpperCase() == "OPENING_BALANCE") {
                        //                    if (editMode.toUpperCase() == "NO") {
                        //                        tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-1_" + i + "'  style='width:70px;' class='checknumeric txtReadonly' readonly='readonly'  /></td>";
                        //                    }
                        //                    else {
                        //                        tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-1_" + i + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'  /></td>";
                        //                    }
                        //                }
                        //                else if (inputColumnArr[j].toUpperCase() == "REMARKS") {
                        //                    tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "' value='" + jsData.Tables[0].Rows[i - 1].ProductRemarks + "'  onclick= '$(this).select();' style='width:90px;' class='CheckProductRemark'/></td>";
                        //                }
                        //                else {
                        //                    tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-1_" + i + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'  /></td>";
                        //                }
                        //            }
                        //            if (inputColumnArr[j].toUpperCase() == "CLOSING_BALANCE") {
                        //                tableContent += "<td><input type='text' id='txtAmount" + inputColumnArr[j] + "-1_" + i + "'  style='width:70px;' class='checknumeric' readonly='readonly' /></td>";
                        //            }
                        //            if (inputColumnArr[j].toUpperCase() == "SALES") {
                        //                tableContent += "<td><input type='text' id='txtAmount" + inputColumnArr[j] + "-1_" + i + "'  style='width:70px;' class='checknumeric' readonly='readonly' /></td>";
                        //            }
                        //            if (inputColumnArr[j].toUpperCase() == "REMARKS") {
                        //                tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "' value='" + jsData.Tables[0].Rows[i - 1].ProductRemarks + "'  onclick= '$(this).select();' style='width:90px;' class='CheckProductRemark'/></td>";
                        //            }
                        //        }
                        //        tableContent += "</tr>";
                        //    }
                        //    tableContent += "<tr id='tbllastRow'><td style='width:261px;font-weight: bold'>TOTAL</td>";
                        //    tableContent += "<td></td>";
                        //    for (var i = 0; i < inputColumnArr.length; i++) {
                        //        if (inputColumnArr[i].toUpperCase() == "CLOSING_BALANCE") {
                        //            tableContent += "<td></td>";
                        //            tableContent += "<td><input type='text' id='txtClosingAmountSum-1' readonly='true'  class='checknumeric'style='width:70px;border:none;font-weight:bold' /></td>";
                        //        }
                        //        else if (inputColumnArr[i].toUpperCase() == "SALES") {
                        //            tableContent += "<td></td>";
                        //            tableContent += "<td><input type='text' id='txtSalesAmountSum-1' readonly='true'  class='checknumeric'style='width:70px;border:none;font-weight:bold' /></td>";
                        //        }
                        //        else {
                        //            tableContent += "<td></td>";
                        //        }
                        //    }
                        //    tableContent += "</tbody>";
                        //    tableContent += "</table>";
                        //    var tblRowlength = $("#tblSecondarySales tr").length;
                        //}
                        //else {
                        debugger
                        tableContent += "<table cellspacing='0' cellpadding='0' id='tblSecondarySales' width='100%' class='data display datatable' >";
                        tableContent += "<thead>";
                        tableContent += "<tr><th  style='width:15%'>PRODUCT NAME</th>";
                        tableContent += "<th style='width:9%;'>UNIT RATE</th>";

                        for (var i = 0; i < inputColumnArr.length; i++) {

                            if (inputColumnArr[i].toUpperCase() == "CLOSING_BALANCE") {

                                tableContent += "<th class='numericth' style='width:9%;'>" + inputColumnArr[i].replace('_', ' ') + "</th>";
                                tableContent += "<th class='numericth' style='width:9%;'>" + inputColumnArr[i].replace('_', ' ') + " AMOUNT</th>";
                            }
                            else if (inputColumnArr[i].toUpperCase() == "SALES") {

                                tableContent += "<th class='numericth' style='width:9%;'>" + inputColumnArr[i].replace('_', ' ') + "</th>";
                                tableContent += "<th class='numericth' style='width:9%;'>" + inputColumnArr[i].replace('_', ' ') + " AMOUNT</th>";
                            }
                            else if (inputColumnArr[i].toUpperCase() == "REMARKS") {
                                tableContent += "<th style='width:9%;'>" + inputColumnArr[i].replace('_', ' ') + "</th>";
                            }
                            else {
                                tableContent += "<th class='numericth' style='width:9%;'>" + inputColumnArr[i].replace('_', ' ') + "</th>";
                            }
                        }
                        debugger;
                        tableContent += "</tr>";
                        tableContent += "</thead>";
                        tableContent += "<tbody>";
                        for (var i = 1; i <= 2; i++) {
                            tableContent += "<tr>";
                            tableContent += "<td><input type='text' id='txtProductName_" + i + "'  class='autoProducts'  onclick= '$(this).select();' style='width:200px' /><input type='hidden' id='hdnProductCode_" + i + "'/></td>";

                            if (priceEdit.toUpperCase() == "NO") {
                                tableContent += "<td><input type='text' id='txtUnitRate_" + i + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;' readonly='readonly'  /></td>";
                            }
                            else {
                                tableContent += "<td><input type='text' id='txtUnitRate_" + i + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'  /></td>";
                            }
                            for (var j = 0; j < inputColumnArr.length; j++) {
                                if (inputColumnArr[j].toUpperCase() == compute.toUpperCase()) {
                                    if (editMode.toUpperCase() == "NO") {
                                        tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "' value='0'   style='width:70px;' class='checknumeric txtReadonly' readonly='readonly'  /></td>";
                                    }
                                    else if (inputColumnArr[j].toUpperCase() == "REMARKS") {
                                        tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "' value='" + jsData.Tables[0].Rows[i - 1].ProductRemarks + "'  onclick= '$(this).select();' style='width:90px;' class='CheckProductRemark'/></td>";
                                    }
                                    else {
                                        tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "' value='0'  style='width:70px;' class='checknumeric' onclick= '$(this).select();'  /></td>";
                                    }
                                }
                                else {

                                    if (inputColumnArr[j].toUpperCase() == "OPENING_BALANCE") {
                                        if (editMode.toUpperCase() == "NO") {
                                            tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "' value='0' class='checknumeric txtReadonly'  style='width:70px;' readonly='readonly'  /></td>";
                                            tableContent += "<input type='hidden' id = 'hdntxt" + inputColumnArr[j] + "-" + i + "' value = '0.00'><input type='hidden' id='hdnmanually_edited" + inputColumnArr[j] + "-" + i + "' value='0'>";
                                        }
                                        else if (inputColumnArr[j].toUpperCase() == "REMARKS") {
                                            tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "'  onclick= '$(this).select();' style='width:90px;' class='CheckProductRemark'/></td>";
                                        }
                                        else {
                                            tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "' value='0' class='checknumeric' onclick= '$(this).select();' style='width:70px;' /></td>";
                                            tableContent += "<input type='hidden' id = 'hdntxt" + inputColumnArr[j] + "-" + i + "' value = '0.00'><input type='hidden' id='hdnmanually_edited" + inputColumnArr[j] + "-" + i + "' value='0'>;";
                                        }
                                    }
                                    else if (inputColumnArr[j].toUpperCase() == "REMARKS") {
                                        tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "'   onclick= '$(this).select();' style='width:90px;' class='CheckProductRemark'/></td>";
                                    }
                                    else {
                                        tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "' value='0' class='checknumeric' onclick= '$(this).select();' style='width:70px;' /></td>";
                                    }

                                }
                                if (inputColumnArr[j].toUpperCase() == "CLOSING_BALANCE") {

                                    tableContent += "<td><input type='text' id='txtAmount" + inputColumnArr[j] + "-" + i + "' value='0'  style='width:70px;' class='checknumeric' readonly='readonly'  /></td>";
                                }
                                if (inputColumnArr[j].toUpperCase() == "SALES") {

                                    tableContent += "<td><input type='text' id='txtAmount" + inputColumnArr[j] + "-" + i + "' value='0'  style='width:70px;' class='checknumeric' readonly='readonly'  /></td>";
                                }

                            }
                            tableContent += "</tr>";

                        }
                        debugger;
                        tableContent += "<tr id='tbllastRow'><td style='width:261px;font-weight: bold'>TOTAL</td>";

                        tableContent += "<td></td>";

                        for (var i = 0; i < inputColumnArr.length; i++) {

                            if (inputColumnArr[i].toUpperCase() == "CLOSING_BALANCE") {

                                tableContent += "<td></td>";
                                tableContent += "<td><input type='text' id='txtClosingAmountSum' readonly='true' class='checknumeric'style='width:70px;border:none;font-weight:bold' /></td>";

                            }
                            else if (inputColumnArr[i].toUpperCase() == "SALES") {

                                tableContent += "<td></td>";
                                tableContent += "<td><input type='text' id='txtSalesAmountSum' readonly='true' class='checknumeric'style='width:70px;border:none;font-weight:bold' /></td>";
                            }
                            else {
                                tableContent += "<td></td>";
                            }

                        }



                        tableContent += "</tr>";
                        rowNumber = 3;
                        tableContent += "</tbody>";
                        tableContent += "</table>";
                        // }

                        $('#SecondarySalesDetails').html(tableContent);

                        autoComplete(customerjsonString, "txtCustomerName", "hdnCustomerCode", 'autoCustomers');
                        autoComplete(productjsonString, "txtProductName", "hdnProductCode", 'autoProducts');

                        fnSecondaryEventBinder();
                        debugger;
                        fnSecondarySummary();
                        $(function () {
                            $(".datepicker").datepicker({
                                numberOfMonths: 3
                            });
                        });
                    }
                    else {
                        var regionTree = $("#tree").dynatree("getTree");
                        var regionName = regionTree.getActiveNode().data.title.split('(')[0];
                        fnMsgAlert('info', 'info', 'This region (' + regionName + ') does not have product price list. Please contact your administrator to configure price list.');
                        $('#SecondarySalesDetails').hide();
                        $('#productopoupLink').hide();
                        debugger;
                        fnSecondarySummary();
                        $("#divInputHeader").hide();
                        return false;
                    }
                }
                HideModalPopup('dvLoading');
            }
        });
    }
}

// create customer master table add row
function CreateNewCustomerRow() {
    var nextRowId = parseInt(tableCount) + 1;
    var tableContent = "";
    var newRow = document.getElementById("tblSecondarySales").insertRow(parseInt(nextRowId));
    var tdCustomer = newRow.insertCell(0);
    //   tableContent += "<tr><td align='left' style='font-size: 15px;'><label style='margin-right:55px'>Customer Name</label> <label>  </label> <input type='text' id='txtCustomerName_1_" + nextRowId + "' class='autoCustomers'  style='width:200px' /><input type='hidden' id='hdnCustomerCode_1_" + nextRowId + "' /></td></tr>";
    //  tableContent += "<tr><td>";
    tableContent += "<label style='margin-right:55px'>Customer Name</label> <label>  </label> <input type='text' id='txtCustomerName_1_" + nextRowId + "' class='autoCustomers'  style='width:200px' /><input type='hidden' id='hdnCustomerCode_1_" + nextRowId + "' /><br/>";
    //  tableContent += "<tr><td>";
    tableContent += "<table id='tblSubSec_1_" + nextRowId + "'>";
    tableContent += "<thead>";
    tableContent += "<tr><th  style='width:15%'>PRODUCT NAME</th>";
    tableContent += "<th   style='width:9%;'>UNIT RATE</th>";
    for (var i = 0; i < inputColumnArr.length; i++) {

        if (inputColumnArr[i].toUpperCase() == "CLOSING_BALANCE") {

            tableContent += "<th class='numericth' style='width:9%;'>" + inputColumnArr[i].replace('_', ' ') + "</th>";
            tableContent += "<th class='numericth' style='width:9%;'>" + inputColumnArr[i].replace('_', ' ') + " AMOUNT</th>";
        }
        else if (inputColumnArr[i].toUpperCase() == "SALES") {

            tableContent += "<th class='numericth' style='width:9%;'>" + inputColumnArr[i].replace('_', ' ') + "</th>";
            tableContent += "<th class='numericth' style='width:9%;'>" + inputColumnArr[i].replace('_', ' ') + " AMOUNT</th>";
        }
        else if (inputColumnArr[i].toUpperCase() == "REMARKS") {
            tableContent += "<th style='width:9%;'>" + inputColumnArr[i].replace('_', ' ') + "</th>";
        }
        else {
            tableContent += "<th class='numericth' style='width:9%;'>" + inputColumnArr[i].replace('_', ' ') + "</th>";
        }

    }
    tableContent += "</tr>";
    tableContent += "</thead>";
    tableContent += "<tbody>";
    for (var i = 1; i <= 2; i++) {
        tableContent += "<tr>";
        tableContent += "<td><input type='text' id='txtProductName_" + nextRowId + "_" + i + "'  class='autoProducts' ondblclick='fnCreateNewRowInCustomerProduct(this);'  onkeyup= 'fnCreateNewRowInCustomerProduct(this);' style='width:200px' /><input type='hidden' id='hdnProductCode_" + nextRowId + "_" + i + "'/></td>";
        if (priceEdit.toUpperCase() == "NO") {
            tableContent += "<td><input type='text' id='txtUnitRate_" + nextRowId + "_" + i + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;' readonly='readonly' /></td>";
        }
        else {
            tableContent += "<td><input type='text' id='txtUnitRate_" + nextRowId + "_" + i + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;' /></td>";
        }
        for (var j = 0; j < inputColumnArr.length; j++) {
            if (inputColumnArr[j].toUpperCase() == compute.toUpperCase()) {
                if (editMode.toUpperCase() == "NO") {
                    tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + nextRowId + "_" + i + "' class='checknumeric txtReadonly'  style='width:70px;' readonly='readonly'  /></td>";
                }
                else if (inputColumnArr[j].toUpperCase() == "REMARKS") {
                    tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "'  onclick= '$(this).select();' style='width:90px;' class='CheckProductRemark'/></td>";
                }
                else {
                    tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + nextRowId + "_" + i + "' class='checknumeric' onclick= '$(this).select();' style='width:70px;'/></td>";
                }
            }
            else {
                if (inputColumnArr[j].toUpperCase() == "OPENING_BALANCE") {
                    if (editMode.toUpperCase() == "NO") {
                        tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + nextRowId + "_" + i + "'  class='checknumeric txtReadonly'  style='width:70px;' readonly='readonly'  /></td>";
                    }
                    else {
                        tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + nextRowId + "_" + i + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'/></td>";
                    }
                }
                else if (inputColumnArr[j].toUpperCase() == "REMARKS") {
                    tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "'  onclick= '$(this).select();' style='width:90px;' class='CheckProductRemark'/></td>";
                }
                else {
                    tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + nextRowId + "_" + i + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'/></td>";
                }
            }

            if (inputColumnArr[j].toUpperCase() == "CLOSING_BALANCE") {
                tableContent += "<td><input type='text' id='txtAmount" + inputColumnArr[j] + "-" + nextRowId + "_" + i + "' class='checknumeric'   style='width:70px;' readonly='readonly' /></td>";
            }
            if (inputColumnArr[j].toUpperCase() == "SALES") {
                tableContent += "<td><input type='text' id='txtAmount" + inputColumnArr[j] + "-" + nextRowId + "_" + i + "' class='checknumeric'  style='width:70px;' readonly='readonly' /></td>";

            }

        }
        tableContent += "</tr>";
    }

    tableContent += "<tr id='tbllastRow'><td style='width:261px;font-weight: bold'>TOTAL</td>";

    tableContent += "<td></td>";

    for (var i = 0; i < inputColumnArr.length; i++) {

        if (inputColumnArr[i].toUpperCase() == "CLOSING_BALANCE") {

            tableContent += "<td></td>";
            tableContent += "<td><input type='text' id='txtClosingAmountSum-" + nextRowId + "' readonly='true' class='checknumeric'style='width:70px;border:none;font-weight:bold' /></td>";

        }
        else if (inputColumnArr[i].toUpperCase() == "SALES") {

            tableContent += "<td></td>";
            tableContent += "<td><input type='text' id='txtSalesAmountSum-" + nextRowId + "' readonly='true' class='checknumeric'style='width:70px;border:none;font-weight:bold' /></td>";
        }
        else {
            tableContent += "<td></td>";
        }

    }
    tableCount = parseInt(nextRowId);
    tableContent += "</tbody>";
    tableContent += "</table>";
    tableContent += "</td></tr>";
    $(tdCustomer).html(tableContent)
    autoComplete(customerjsonString, "txtCustomerName", "hdnCustomerCode", 'autoCustomers');
    autoComplete(productjsonString, "txtProductName", "hdnProductCode", 'autoProducts');

    fnSecondaryEventBinder();
}

// create customer master product new row
function fnCreateNewRowInCustomerProduct(e) {
    var tableId = e.id.split('_')[1];
    var rowId = e.id.split('_')[2];
    if (rowId < 2) {
        return;
    }
    rowId = parseInt(rowId) + 1;
    var id = "txtProductName_" + tableId + "_" + rowId;
    var tableName = "tblSubSec_1_" + tableId;
    var iRow = 2;
    var rCnt = $("#" + tableName + " tr").length - 1;
    if (rCnt > rowId) {
        return;
    }
    var newRow = document.getElementById(tableName).insertRow(parseInt(rCnt));
    var tdProductName = newRow.insertCell(0);
    var tdUnitRate = newRow.insertCell(1);
    $(tdProductName).html("<input type='text' id='txtProductName_" + tableId + "_" + rowId + "'  class='autoProducts' ondblclick='fnCreateNewRowInCustomerProduct(this);'  onkeyup= 'fnCreateNewRowInCustomerProduct(this);'  style='width:200px' /><input type='hidden' id='hdnProductCode_" + tableId + "_" + rowId + "'/>");

    if (priceEdit.toUpperCase() == "NO") {
        $(tdUnitRate).html("<input type='text' id='txtUnitRate_" + tableId + "_" + rowId + "' style='width:70px;'   class='checknumeric' onclick= '$(this).select();' readonly='readonly'  />");
    }
    else {
        $(tdUnitRate).html("<input type='text' id='txtUnitRate_" + tableId + "_" + rowId + "' style='width:70px;'   class='checknumeric' onclick= '$(this).select(); '/>");
    }
    if (inputColumnArr.length > 0) {
        for (var j = 0; j < inputColumnArr.length; j++) {
            var tdValue = newRow.insertCell(iRow);
            if (inputColumnArr[j].toUpperCase() == compute.toUpperCase()) {
                if (editMode.toUpperCase() == "NO") {
                    $(tdValue).html("<input type='text' id='txt" + inputColumnArr[j] + "-" + tableId + "_" + rowId + "' class='checknumeric txtReadonly'  style='width:70px;' readonly='readonly' />");
                }
                else if (inputColumnArr[j].toUpperCase() == "REMARKS") {
                    $(tdValue).html("<td><input type='text' id='txt" + inputColumnArr[j] + "-" + rowId + "'  onclick= '$(this).select();' style='width:90px;' class='CheckProductRemark'/></td>' />");
                }
                else {
                    $(tdValue).html("<input type='text' id='txt" + inputColumnArr[j] + "-" + tableId + "_" + rowId + "'  class='checknumeric' onclick= '$(this).select();'   style='width:70px;' />");
                }
                iRow++;
            }
            else {

                if (inputColumnArr[j].toUpperCase() == "OPENING_BALANCE") {

                    if (editMode.toUpperCase() == "NO") {

                        $(tdValue).html("<input type='text' id='txt" + inputColumnArr[j] + "-" + tableId + "_" + rowId + "' class='checknumeric txtReadonly'   style='width:70px;' readonly='readonly' />");
                    }
                    else if (inputColumnArr[j].toUpperCase() == "REMARKS") {
                        $(tdValue).html("<input type='text' id='txt" + inputColumnArr[j] + "-" + rowId + "'   onclick= '$(this).select();' style='width:90px;' class='CheckProductRemark'/></td>");
                    }
                    else {
                        $(tdValue).html("<input type='text' id='txt" + inputColumnArr[j] + "-" + tableId + "_" + rowId + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'/>");
                    }
                }
                else if (inputColumnArr[j].toUpperCase() == "REMARKS") {
                    $(tdValue).html("<input type='text' id='txt" + inputColumnArr[j] + "-" + rowId + "'   onclick= '$(this).select();' style='width:90px;' class='CheckProductRemark'/></td>");
                }
                else {

                    $(tdValue).html("<input type='text' id='txt" + inputColumnArr[j] + "-" + tableId + "_" + rowId + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'/>");
                }
                iRow++;
            }

            if (inputColumnArr[j].toUpperCase() == "CLOSING_BALANCE") {
                tdValue = newRow.insertCell(iRow);
                $(tdValue).html("<input type='text' id='txtAmount" + inputColumnArr[j] + "-" + tableId + "_" + rowId + "' class='checknumeric'  style='width:70px;' readonly='readonly' />");
                iRow++;
            }
            if (inputColumnArr[j].toUpperCase() == "SALES") {
                tdValue = newRow.insertCell(iRow);
                $(tdValue).html("<input type='text' id='txtAmount" + inputColumnArr[j] + "-" + tableId + "_" + rowId + "'  class='checknumeric'  style='width:70px;' readonly='readonly' />");
                iRow++;
            }
        }
    }

    $(e)[0].onkeyup = null;
    $(e)[0].ondblclick = null;
    autoComplete(productjsonString, "txtProductName", "hdnProductCode", 'autoProducts');

    fnSecondaryEventBinder();
}
// create product new row
function fnCreateNewRowInProduct(e) {
    debugger;
    var id = "txtProductName_" + (rowNumber - 1) + "";

    if (e != "") {
        if (e.id != id) {
            return;
        }
    }
    var iRow = 2;
    var rCnt = $("#tblSecondarySales tr").length - 1;
    var newRow = document.getElementById("tblSecondarySales").insertRow(parseInt(rCnt));

    var tdProductName = newRow.insertCell(0);
    var tdUnitRate = newRow.insertCell(1);
    debugger;
    $(tdProductName).html("<input type='text' id='txtProductName_" + rowNumber + "'  class='autoProducts' onclick= '$(this).select();'  style='width:200px' /><input type='hidden' id='hdnProductCode_" + rowNumber + "'/>");

    if (priceEdit.toUpperCase() == "NO") {
        $(tdUnitRate).html("<input type='text' id='txtUnitRate_" + rowNumber + "' style='width:70px;' readonly='readonly'   class='checknumeric' onclick= '$(this).select(); '/>");
    }
    else {
        $(tdUnitRate).html("<input type='text' id='txtUnitRate_" + rowNumber + "' style='width:70px;'  class='checknumeric' onclick= '$(this).select(); '/>");
    }

    if (inputColumnArr.length > 0) {

        for (var j = 0; j < inputColumnArr.length; j++) {
            var tdValue = newRow.insertCell(iRow);
            if (inputColumnArr[j].toUpperCase() == compute.toUpperCase()) {

                if (editMode.toUpperCase() == "NO") {
                    $(tdValue).html("<input type='text' id='txt" + inputColumnArr[j] + "-" + rowNumber + "' class='checknumeric txtReadonly' value='0'  style='width:70px;' readonly='readonly' />");
                }
                else if (inputColumnArr[j].toUpperCase() == "REMARKS") {
                    $(tdValue).html("<input type='text' id='txt" + inputColumnArr[j] + "-" + rowNumber + "'   onclick= '$(this).select();' style='width:90px;' class='CheckProductRemark'/></td>");
                }
                else {
                    $(tdValue).html("<input type='text' id='txt" + inputColumnArr[j] + "-" + rowNumber + "' value='0' class='checknumeric' onclick= '$(this).select();'    style='width:70px;'/>");
                }
                iRow++;
            }
            else {
                if (inputColumnArr[j].toUpperCase() == "OPENING_BALANCE") {

                    if (editMode.toUpperCase() == "NO") {
                        $(tdValue).html("<input type='text' value='0' id='txt" + inputColumnArr[j] + "-" + rowNumber + "' class='checknumeric txtReadonly'  style='width:70px;' readonly='readonly'/><input type='hidden' id='hdntxt" + inputColumnArr[j] + "-" + rowNumber + "' value = '0.00'/><input type='hidden' id='hdnmanually_edited" + inputColumnArr[j] + "-" + rowNumber + "' value='0'/>");
                    }
                    else if (inputColumnArr[j].toUpperCase() == "REMARKS") {
                        $(tdValue).html("input type='text' id='txt" + inputColumnArr[j] + "-" + rowNumber + "'   onclick= '$(this).select();' style='width:90px;' class='CheckProductRemark'/></td>' />");
                    }
                    else {
                        $(tdValue).html("<input type='text' value='0' id='txt" + inputColumnArr[j] + "-" + rowNumber + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'/><input type='hidden' id='hdntxt" + inputColumnArr[j] + "-" + rowNumber + "' value = '0.00'/><input type='hidden' id='hdnmanually_edited" + inputColumnArr[j] + "-" + rowNumber + "' value='0'/>");
                    }
                }
                else if (inputColumnArr[j].toUpperCase() == "REMARKS") {
                    $(tdValue).html("<input type='text' id='txt" + inputColumnArr[j] + "-" + rowNumber + "'   onclick= '$(this).select();' style='width:90px;' class='CheckProductRemark'/></td>");
                }
                else {
                    $(tdValue).html("<input type='text' id='txt" + inputColumnArr[j] + "-" + rowNumber + "' value='0' class='checknumeric' onclick= '$(this).select();' style='width:70px;'/>");
                }
                iRow++;
            }

            if (inputColumnArr[j].toUpperCase() == "CLOSING_BALANCE") {
                var tdValue = newRow.insertCell(iRow);
                $(tdValue).html("<input type='text' id='txtAmount" + inputColumnArr[j] + "-" + rowNumber + "' value='0' class='checknumeric'  style='width:70px;' readonly='readonly' />");
                iRow++;
            }
            if (inputColumnArr[j].toUpperCase() == "SALES") {
                var tdValue = newRow.insertCell(iRow);
                $(tdValue).html("<input type='text' id='txtAmount" + inputColumnArr[j] + "-" + rowNumber + "' class='checknumeric' value='0'  style='width:70px;' readonly='readonly' />");
                iRow++;
            }

        }
    }
    autoComplete(productjsonString, "txtProductName", "hdnProductCode", 'autoProducts');

    fnSecondaryEventBinder();
    rowNumber = parseInt(rowNumber) + 1;
}
// bind summary data table
function fnSecondarySummary() {
    debugger;
    var tableContent = "";
    tableContent += "<div><span style='font-weight:bold;font-style:italic'>Approved and Applied Secondary Sales records cannot be edited.</span></div>";
    tableContent += "<div style='background: #efefef; padding: 1%'><h2>Secondary Sales Transactions : </h2></div>";
    if (productAutofill_g[1].Data.length > 0) {
        tableContent += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblSummary' >";
        tableContent += "<thead><tr>";
        tableContent += "<th> Region Name </th>";
        tableContent += "<th>SS.Month</th>";
        tableContent += "<th>SS.Year</th>";
        if (ssEntryMode.toUpperCase() == "STOCKIEST") {
            tableContent += "<th>Stockiest Name</th>";
        }
        if (ssEntryMode.toUpperCase() == "CUSTOMER") {
            tableContent += "<th>Stockiest Name</th>";
            tableContent += "<th>Customer Name</th>";
        }
        tableContent += "<th>SS StatementDate</th>";
        // tableContent += " <th>User Name</th>";
        tableContent += " <th>Action</th>";
        tableContent += " <th>Status</th>";
        tableContent += "</tr></thead>";
        tableContent += "<tbody>";
        for (var i = 0; i < productAutofill_g[1].Data.length; i++) {
            tableContent += "<tr>";
            tableContent += "<td align='left' width='15%'>" + productAutofill_g[1].Data[i].Region_Name + "</td>";
            tableContent += "<td align='left' width='15%'>" + productAutofill_g[1].Data[i].MonthName + "</td>";
            tableContent += "<td align='left' width='15%'>" + productAutofill_g[1].Data[i].Year + "</td>";
            if (ssEntryMode.toUpperCase() == "STOCKIEST") {
                tableContent += "<td align='left' width='15%'>" + productAutofill_g[1].Data[i].Customer_Name + "</td>";
            }
            if (ssEntryMode.toUpperCase() == "CUSTOMER") {
                if (productAutofill_g[1].Data[i].Stockiest_Name != "" && productAutofill_g[1].Data[i].Stockiest_Name != null) {
                    tableContent += "<td align='left' width='15%'>" + productAutofill_g[1].Data[i].Stockiest_Name + "</td>";
                }
                else {
                    tableContent += "<td align='left' width='15%'></td>";
                }
                tableContent += "<td align='left' width='15%'>" + productAutofill_g[1].Data[i].Customer_Name + "</td>";
            }

            tableContent += "<td align='left' width='15%'>" + productAutofill_g[1].Data[i].SS_Statement_Date + "</td>";
            //tableContent += "<td align='left' width='15%'>" + productAutofill_g[1].Data[i].User_Name + "</td>";
            // tableContent += "<td align='left' width='15%' " + GetColorCode(productAutofill_g[1].Data[i].SS_Status) + ">" + productAutofill_g[1].Data[i].SS_Status + "</td>";
            if (productAutofill_g[1].Data[i].SS_Status.toUpperCase() == "APPLIED" || productAutofill_g[1].Data[i].SS_Status.toUpperCase() == "APPROVED") {
                tableContent += "<td align='left' width='15%'><span onclick='fnDetails(\"" + productAutofill_g[1].Data[i].Region_Code + "_" + productAutofill_g[1].Data[i].Month + "_" + productAutofill_g[1].Data[i].Year + "_" + productAutofill_g[1].Data[i].ss_Code + "_" + productAutofill_g[1].Data[i].SS_Statement_Date + "_" + productAutofill_g[1].Data[i].Customer_Code + "\")' style='text-decoration:underline;cursor:pointer'>View</span></td>";
            }
            else {
                tableContent += "<td align='left' width='15%'><span onclick='fnFillEdit(\"" + productAutofill_g[1].Data[i].Region_Code + "_" + productAutofill_g[1].Data[i].Month + "_" + productAutofill_g[1].Data[i].Year + "_" + productAutofill_g[1].Data[i].ss_Code + "_" + productAutofill_g[1].Data[i].SS_Statement_Date + "_" + productAutofill_g[1].Data[i].Customer_Code + "_" + productAutofill_g[1].Data[i].SS_Status + "\")' style='text-decoration:underline;cursor:pointer'>Edit</span>/<span onclick='fnDetails(\"" + productAutofill_g[1].Data[i].Region_Code + "_" + productAutofill_g[1].Data[i].Month + "_" + productAutofill_g[1].Data[i].Year + "_" + productAutofill_g[1].Data[i].ss_Code + "_" + productAutofill_g[1].Data[i].SS_Statement_Date + "_" + productAutofill_g[1].Data[i].Customer_Code + "\")' style='text-decoration:underline;cursor:pointer'>View</span></td>";

            }
            tableContent += "<td align='left' width='15%' " + GetColorCode(productAutofill_g[1].Data[i].SS_Status) + ">" + productAutofill_g[1].Data[i].SS_Status + "</td>";
            // tableContent += "<td align='center' width='10%'><a href='#' rel='#facebox' onclick='fnFillEdit(\"" + productAutofill_g[1].Data[i].User_Name + "\")' >Edit</a> | <a href='#' onclick='fnDetails(\"" + productAutofill_g[1].Data[i].User_Name + "\")'>View</td>
            tableContent += "</tr>";
        }
        tableContent += "</tbody>";
        tableContent += "</table>";
        $("#divReport").html(tableContent);
        if ($.fn.dataTable) { $('#tblSummary').dataTable({ "sPaginationType": "full_numbers", "bSort": false, "bSortable": false }); };
    }
    else {
        tableContent += "<br/>No data found.";
        $("#divReport").html(tableContent);
    }
}
// event calling
function fnSecondaryEventBinder() {
    debugger;
    if (ssEntryMode.toUpperCase() != "CUSTOMER") {
        $(".autoProducts").keypress(function () { fnCreateNewRowInProduct(this); });
        $(".autoProducts").dblclick(function () { fnCreateNewRowInProduct(this); });

    }
    $(".autoProducts").blur(function () { return fnCheckValidProduct(this, productAutofill_g, "Product_Name") });

    $(".checknumeric").blur(function () { return fnCalculate(this) });
    $(".CheckProductRemark").blur(function () { return fnProductRemarksValidation(this) });

    if (ssEntryMode.toUpperCase() == "CUSTOMER") {
        $(".autoCustomers").blur(function () { return fnCheckValidCustomer(this, productAutofill_g, "Customer_Name") });


    }

}

var ss = "";
// Calculate Secondary sales values
function fnCalculate(ctl) {

    var total = 0.0;
    var pricePerUnit = 0;
    var openingBalance = 0.0, purchase = 0.0, purchaseReturn = 0.0, sales = 0.0, salesReturn = 0.0, transit = 0.0, closingStock = 0.0; freeGoods = 0.0;
    var amountCalc = 0.0;


    var rowN = ctl.id.split('_')[1]
    if ($("#txtProductName_" + rowN).val() != "") {
        if (ctl.id.split('_')[0] == "txtUnitRate") {
            if ($.trim($("#txtUnitRate_" + rowN).val()) == "") {
                fnMsgAlert('info', 'Secondary Sales', 'Please Enter The Price.');
                return false;
            }
        }
    }

    if ($.trim($(ctl).val()).length > 0) {
        var rowNumber = ctl.id.split('-')[1]


        var id = (ctl.id).split('-')[0];
        if (isNaN($("#" + ctl.id).val())) {
            fnMsgAlert('info', 'Secondary Sales', 'Please enter numeric value only.');
            $("#" + ctl.id).val('');
            $("#" + ctl.id).focus();
            return false;
        }



        if ((ctl.id) != "txtUnitRate_" + ctl.id.split('_')[1]) {
            if ($("#" + ctl.id).val() != "") {
                var value = parseFloat($("#" + ctl.id).val()).toFixed(2);
                $("#" + ctl.id).val(value);
            }
        }


        if ($("#txtUnitRate_" + rowNumber).val() != null && $("#txtUnitRate_" + rowNumber).val() != "") {
            pricePerUnit = parseFloat($("#txtUnitRate_" + rowNumber).val());
        }
        if ($("#txtFREE_GOODS-" + rowNumber).val() != null && $("#txtFREE_GOODS-" + rowNumber).val() != "") {
            freeGoods = parseFloat($("#txtFREE_GOODS-" + rowNumber).val()).toFixed(2);
        }
        if ($("#txtPURCHASE-" + rowNumber).val() != null && $("#txtPURCHASE-" + rowNumber).val() != "") {
            purchase = parseFloat($("#txtPURCHASE-" + rowNumber).val()).toFixed(2);
        }
        if ($("#txtPURCHASE_RETURN-" + rowNumber).val() != null && $("#txtPURCHASE_RETURN-" + rowNumber).val() != "") {
            purchaseReturn = parseFloat($("#txtPURCHASE_RETURN-" + rowNumber).val()).toFixed(2);
        }
        if ($("#txtSALES-" + rowNumber).val() != null && $("#txtSALES-" + rowNumber).val() != "") {
            sales = parseFloat($("#txtSALES-" + rowNumber).val()).toFixed(2);
        }
        if ($("#txtSALES_RETURN-" + rowNumber).val() != null && $("#txtSALES_RETURN-" + rowNumber).val() != "") {
            salesReturn = parseFloat($("#txtSALES_RETURN-" + rowNumber).val()).toFixed(2);
        }
        if ($("#txtTRANSIT-" + rowNumber).val() != null && $("#txtTRANSIT-" + rowNumber).val() != "") {
            transit = parseFloat($("#txtTRANSIT-" + rowNumber).val()).toFixed(2);
        }
        if ($("#txtCLOSING_BALANCE-" + rowNumber).val() != null && $("#txtCLOSING_BALANCE-" + rowNumber).val() != "") {
            closingStock = parseFloat($("#txtCLOSING_BALANCE-" + rowNumber).val()).toFixed(2);
        }
        ssformula = "";
        //  ssformula = "OPENING_BALANCE + PURCHASE - PURCHASE_RETURN - SALES + SALES_RETURN +TRANSIT";
        ssformula = ssformulas;
        ssformula = ssformula.replace("PURCHASE_RETURN", "REPPUR");
        ssformula = ssformula.replace("SALES_RETURN", "SRDUM");
        ssformula = ssformula.replace("SALES", "ESSALES");
        ssformula = ssformula.replace("PURCHASE", "DUMPURCHASE");
        ssformula = ssformula.replace("OPENING_BALANCE", "ASOPENING");
        ssformula = ssformula.replace("CLOSING_BALANCE", "CLOSINGDUM");
        ssformula = ssformula.replace("FREE_GOODS", "FREEGOODSDUM");

        ssformula = ssformula.replace(/\s+/g, '');

        if (ssformula.indexOf("ASOPENING") >= 0) {

            if ($("#txtOPENING_BALANCE-" + rowNumber).val() != null && $("#txtOPENING_BALANCE-" + rowNumber).val() != "") {
                ssformula = ssformula.replace("ASOPENING", "(parseFloat($('#txtOPENING_BALANCE-" + rowNumber + "').val()))");
            }
            else {
                ssformula = ssformula.replace("ASOPENING", "(parseFloat(0))");
            }
        }

        if (ssformula.indexOf("REPPUR") >= 0) {
            if ($("#txtPURCHASE_RETURN-" + rowNumber).val() != null && $("#txtPURCHASE_RETURN-" + rowNumber).val() != "") {
                ssformula = ssformula.replace("REPPUR", "(parseFloat($('#txtPURCHASE_RETURN-" + rowNumber + "').val()))");
            }
            else {
                ssformula = ssformula.replace("REPPUR", "(parseFloat(0))");
            }
        }

        if (ssformula.indexOf("DUMPURCHASE") >= 0) {
            if ($("#txtPURCHASE-" + rowNumber).val() != null && $("#txtPURCHASE-" + rowNumber).val() != "") {
                ssformula = ssformula.replace("DUMPURCHASE", "(parseFloat($('#txtPURCHASE-" + rowNumber + "').val()))");
            }
            else {
                ssformula = ssformula.replace("DUMPURCHASE", "(parseFloat(0))");
            }
        }

        if (ssformula.indexOf("SRDUM") >= 0) {
            if ($("#txtSALES_RETURN-" + rowNumber).val() != null && $("#txtSALES_RETURN-" + rowNumber).val() != "") {
                ssformula = ssformula.replace("SRDUM", "(parseFloat($('#txtSALES_RETURN-" + rowNumber + "').val()))");
            }
            else {
                ssformula = ssformula.replace("SRDUM", "(parseFloat(0))");
            }
        }


        //if (ssformula.indexOf("FREEGOODSDUM") >= 0) {

        //    if ($("#txtFREE_GOODS-" + rowNumber).val() != null && $("#txtFREE_GOODS-" + rowNumber).val() != "") {
        //        ssformula = ssformula.replace("FREEGOODSDUM", "(parseFloat($('#txtFREE_GOODS-" + rowNumber + "').val()))");
        //    }
        //    else {
        //        ssformula = ssformula.replace("FREEGOODSDUM", "(parseFloat(0))");
        //    }
        //}

        if (ssformula.indexOf("ESSALES") >= 0) {

            if ($("#txtSALES-" + rowNumber).val() != null && $("#txtSALES-" + rowNumber).val() != "") {
                if (ssformula.indexOf("FREEGOODSDUM") >= 0) {
                    if ($("#txtFREE_GOODS-" + rowNumber).val() != null && $("#txtFREE_GOODS-" + rowNumber).val() != "") {
                        ssformula = ssformula.replace("ESSALES", "(parseFloat($('#txtSALES-" + rowNumber + "').val()))");
                        ssformula = ssformula.replace("FREEGOODSDUM", "(parseFloat($('#txtFREE_GOODS-" + rowNumber + "').val()))");
                    }
                    else {
                        ssformula = ssformula.replace("ESSALES", "(parseFloat($('#txtSALES-" + rowNumber + "').val()))+(parseFloat(0))");
                    }
                }
                else {
                    ssformula = ssformula.replace("ESSALES", "(parseFloat($('#txtSALES-" + rowNumber + "').val()))");
                }
            }
            else {
                ssformula = ssformula.replace("ESSALES", "(parseFloat(0))");
            }
        }
        if ((ssformula.indexOf("ESSALES") == -1) && (ssformula.indexOf("FREEGOODSDUM") >= 0)) {

            if ($("#txtFREE_GOODS-" + rowNumber).val() != null && $("#txtFREE_GOODS-" + rowNumber).val() != "") {
                ssformula = ssformula.replace("FREEGOODSDUM", "(parseFloat($('#txtFREE_GOODS-" + rowNumber + "').val()))");
            }
            else {
                ssformula = ssformula.replace("FREEGOODSDUM", "(parseFloat(0))");
            }
        }

        if ($("#txtTRANSIT-" + rowNumber).val() != null && $("#txtTRANSIT-" + rowNumber).val() != "") {
            ssformula = ssformula.replace("TRANSIT", "parseFloat($('#txtTRANSIT-" + rowNumber + "').val())");
        }
        else {
            ssformula = ssformula.replace("TRANSIT", "parseFloat(0)");
        }
        if (ssformula.indexOf("CLOSINGDUM") >= 0) {
            if ($("#txtCLOSING_BALANCE-" + rowNumber).val() != null && $("#txtCLOSING_BALANCE-" + rowNumber).val() != "") {
                ssformula = ssformula.replace("CLOSINGDUM", "parseFloat($('#txtCLOSING_BALANCE-" + rowNumber + "').val())");
            }
            else {
                ssformula = ssformula.replace("CLOSINGDUM", "parseFloat(0)");
            }
        }
        if (ssformulas != "") {
            total = parseFloat(eval(ssformula)).toFixed(2);
        }
        else {
            total = 0;
        }

        // Calculation 
        amountCalc = 0.0;

        if (compute.toUpperCase() == "CLOSING_BALANCE") {
            // total = openingBalance + purchase - purchaseReturn - sales + salesReturn - transit;
            $("#txtCLOSING_BALANCE-" + rowNumber).val(0);
            if (total != "") {
                if (total >= 0) {
                    $("#txtCLOSING_BALANCE-" + rowNumber).val(total)
                }
                //else {
                //    fnMsgAlert('info', 'Secondary Sales', 'Sales quanitity should not greater than opening balance and purchase.');
                //    return false;
                //}


            }
        }

        var closingBalanceVal = 0;
        if ($("#txtAmountCLOSING_BALANCE-" + rowNumber) != null) {

            if ($("#txtCLOSING_BALANCE-" + rowNumber).val() != null && $("#txtCLOSING_BALANCE-" + rowNumber).val() != "") {
                closingBalanceVal = $("#txtCLOSING_BALANCE-" + rowNumber).val();
            }

            amountCalc = (pricePerUnit * closingBalanceVal);
            amountCalc = parseFloat(amountCalc).toFixed(2);
            $("#txtAmountCLOSING_BALANCE-" + rowNumber).val(amountCalc);
        }


        //  var totalsaleamount = 0.0;
        if ($("#txtAmountSALES-" + rowNumber) != null) {


            amountCalc = (pricePerUnit * sales);
            //  totalsaleamount += amountCalc;
            amountCalc = parseFloat(amountCalc).toFixed(2);
            $("#txtAmountSALES-" + rowNumber).val(amountCalc);

        }


        if (compute.toUpperCase() == "SALES") {
            // total = openingBalance + purchase - purchaseReturn - closingStock + salesReturn - transit;
            $("#txtSALES-" + rowNumber).val(0);
            if (total >= 0) {
                $("#txtSALES-" + rowNumber).val(total)
            }
            else {
                $("#txtSALES-" + rowNumber).val(total);
                fnMsgAlert('info', 'Info', 'Negative numbers are not allowed.');
                return false;
            }

        }
        // clsStock = clsStock - clsStockVal;
    }
    fncalTotal();
}


function fncalTotal() {

    var totalsaleamount = 0.0;
    var saleamount = 0.0;
    var totalclosingAmount = 0.0;
    var totalcloamount = 0.0;
    var tableProduct = $('#tblSecondarySales tr')
    for (var i = 0; i <= tableProduct.length; i++) {
        if ($("#txtAmountSALES-" + i).val() != undefined && $("#txtAmountSALES-" + i).val() != "") {
            saleamount += parseFloat($("#txtAmountSALES-" + i).val());
            totalclosingAmount += parseFloat($("#txtAmountCLOSING_BALANCE-" + i).val());
            totalsaleamount = parseFloat(saleamount).toFixed(2);
            totalcloamount = parseFloat(totalclosingAmount).toFixed(2);

        }
    }
    $("#txtSalesAmountSum").val(totalsaleamount);
    $("#txtClosingAmountSum").val(totalcloamount);
    if (ssEntryMode == "CUSTOMER") {
        var maintable = $('#tblSecondarySales table')
        for (var i = 1; i <= maintable.length; i++) {
            var tableCus = $('#tblSubSec_1_' + i + ' tr');

            for (var x = 0; x <= tableCus.length; x++) {
                if ($("#txtAmountSALES-" + i + "_" + x).val() != undefined && $("#txtAmountSALES-" + i + "_" + x).val() != "") {
                    saleamount += parseFloat($("#txtAmountSALES-" + i + "_" + x).val());
                    totalclosingAmount += parseFloat($("#txtAmountCLOSING_BALANCE-" + i + "_" + x).val());
                    totalsaleamount = parseFloat(saleamount).toFixed(2);
                    totalcloamount = parseFloat(totalclosingAmount).toFixed(2);

                }
            }
            $("#txtSalesAmountSum-" + i).val(totalsaleamount);
            $("#txtClosingAmountSum-" + i).val(totalcloamount);
            saleamount = 0.0;
            totalclosingAmount = 0.0;
            totalclosingAmount = 0.0;
            totalcloamount = 0.0;
        }

    }

}

// Month and year value binding in dropdown
function fnMonthAndYear() {
    var select = $('#drpMonth');
    $('option', select).remove();
    $('#drpMonth').append("<option value='0'>-Select Month-</option>"); // new Option("-Select Month-", "0", true, true));
    $('#drpMonth').append("<option value='1'>January</option>");
    $('#drpMonth').append("<option value='2'>February</option>");
    $('#drpMonth').append("<option value='3'>March</option>");
    $('#drpMonth').append("<option value='4'>April</option>");
    $('#drpMonth').append("<option value='5'>May</option>");
    $('#drpMonth').append("<option value='6'>June</option>");
    $('#drpMonth').append("<option value='7'>July</option>");
    $('#drpMonth').append("<option value='8'>August</option>");
    $('#drpMonth').append("<option value='9'>September</option>");
    $('#drpMonth').append("<option value='10'>October</option>");
    $('#drpMonth').append("<option value='11'>November</option>");
    $('#drpMonth').append("<option value='12'>December</option>");
    $("#drpMonth").val('0');
    var currentYear = (new Date).getFullYear();
    currentYear = currentYear - 1;
    var yearselect = $("#drpYear");
    $('option', yearselect).remove();
    $('#drpYear').append("<option value='0'>-Select Year-</option>");
    for (var t = 0; t < 2; t++) {
        $('#drpYear').append("<option value='" + currentYear + "'>" + currentYear + "</option>");
        // $('#drpYear').append(new Option(currentYear, currentYear, true, true));
        currentYear = currentYear + 1;
    }
    $("#drpYear").val('0');
}

// Validate screens
function fbValidation() {
    if ($('#drpMonth').val() == 0) {
        fnMsgAlert('info', 'Secondary Sales', 'Select month.');
        return false;
    }
    if ($('#drpYear').val() == 0) {
        fnMsgAlert('info', 'Secondary Sales', 'Select year.');
        return false;
    }
    if ($('#txtStatmentDate').val() == "") {
        fnMsgAlert('info', 'Secondary Sales', 'Select StatementDate.');
        return false;
    }
    if (ssEntryMode.toUpperCase() == "STOCKIEST") {
        if ($('#txtStockiestName').val() == "") {
            fnMsgAlert('info', 'Secondary Sales', 'Enter stockiest name.');
            return false;
        }
    }
    if (ssEntryMode == "CUSTOMER") {
        var customerNameArr = [];
        var rCntSSalesTable = $('#tblSecondarySales table').length;
        for (var j = 1; j <= rCntSSalesTable; j++) {
            if ($("#txtCustomerName_1_" + j).val() != "") {

                // Customer validation
                if ($.inArray($("#txtCustomerName_1_" + j).val(), customerNameArr) > -1) {

                    fnMsgAlert('info', 'Secondary Sales', 'Customer Name ' + $("#txtCustomerName_1_" + j).val() + ' is entered more than one time. It is not allowed.');
                    $("#txtCustomerName_1_" + j).focus();
                    return false;
                }
                customerNameArr.push($("#txtCustomerName_1_" + j).val());
                // PRoduct Validation
                var productNameArr = [];
                var rCntSSales = $('#tblSubSec_1_' + j + ' tr').length;
                for (var i = 1; i < rCntSSales; i++) {
                    if (($("#txtProductName_" + j + "_" + i).val() != "") && ($("#txtProductName_" + j + "_" + i).val() != "undefined")) {
                        if ($.inArray($("#txtProductName_" + j + "_" + i).val(), productNameArr) > -1) {
                            fnMsgAlert('info', 'Secondary Sales', 'Product name ' + $("#txtProductName_" + j + "_" + i).val() + ' is entered more than one time for the customer Name ' + $("#txtCustomerName_1_" + j).val() + '.It is not allowed.');
                            $("#txtProductName_" + j + "_" + i).focus();

                            return false;
                        }
                        productNameArr.push($("#txtProductName_" + j + "_" + i).val());

                    }
                }
                if (productNameArr.length == 0) {
                    fnMsgAlert('info', 'Secondary Sales', 'Enter atleast one Product name for ' + $("#txtCustomerName_1_" + j).val() + ' ..');
                    return false;
                }
            }
        }
        if (customerNameArr.length == 0) {
            fnMsgAlert('info', 'Secondary Sales', 'Enter atleast one Customer Name.');
            return false;
        }
    }
    else {
        var rCntSSales = $("#tblSecondarySales tr").length - 1;
        var productNameArr = [];
        for (var i = 1; i < rowNumber; i++) {
            if ($("#txtProductName_" + i).length > 0 && $("#txtProductName_" + i).val() != "") {
                if ($.inArray($("#txtProductName_" + i).val(), productNameArr) > -1) {
                    fnMsgAlert('info', 'Secondary Sales', 'Product name ' + $("#txtProductName_" + i).val() + ' is entered more than one time. It is not allowed.');
                    $("#txtProductName_" + i).focus();
                    return false;
                }
                productNameArr.push($("#txtProductName_" + i).val());
            }
        }
        if (productNameArr.length == 0) {
            fnMsgAlert('info', 'Secondary Sales', 'Enter atleast one Product name.');
            return false;
        }


    }
    return true;
}

// Validation 
function fnSecondarySalesValidation() {
    debugger;
    if ($.trim($('#txtStatmentDate').val()).length > 0) {

        monthVal = $('#drpMonth').val();
        if (monthVal.length == 1) {
            monthVal = '0' + monthVal;
        }
        yearVal = $('#drpYear').val();
        var DateVal = yearVal + "-" + monthVal + "-" + "01";
        var ssStatement = $.trim($('#txtStatmentDate').val());
        var ss = $.trim($('#txtStatmentDate').val()).split('/');
        var ssDate = ss[2] + "-" + ss[1] + "-" + ss[0];

        var ssMonth = ssStatement.split('/')[1];
        var ssYear = ssStatement.split('/')[2];
        if (monthVal.length > 0 && yearVal.length > 0) {
            if (ssDate < DateVal) {
                fnMsgAlert('info', 'Secondary Sales', 'Sales Statement date cannot be prior to Secondary Sales Month & Year.');
                return false;
            }
        }
    }

    debugger;
    // Stockiest Validation
    if ($('#txtStockiestName').val() != "") {
        var jSonStockiest = jsonPath(productAutofill_g[2], "$.Data[?(@.StockiestCode =='" + $('#hdnStockiestCode').val() + "')]");
        var jsonPoolSockiest = jsonPath(productAutofill_g[5], "$.Data[?(@.StockiestCode =='" + $('#hdnStockiestCode').val() + "')]");
        if (!(jSonStockiest.length > 0) && !(jsonPoolSockiest.length > 0)) {
            fnMsgAlert('info', 'Secondary Sales', $('#txtStockiestName').val() + '  Stockiest name  is invalid.');
            $('#txtStockiestName').focus();
            return false;
        }
    }

    if (ssEntryMode == "CUSTOMER") {
        var rCntSSalesTable = $('#tblSecondarySales table').length;
        for (var j = 1; j <= rCntSSalesTable; j++) {
            if ($("#txtCustomerName_1_" + j).val() != "") {
                var jSonCustomer = jsonPath(productAutofill_g[3], "$.Data[?(@.Customer_Code=='" + $("#hdnCustomerCode_1_" + j).val() + "')]");
                if (!(jSonCustomer.length > 0)) {
                    fnMsgAlert('info', 'Secondary Sales', $("#txtCustomerName_1_" + j).val() + '  Customer name  is invalid');
                    $("#txtCustomerName_1_" + j).focus();
                    return false;
                }
                var rCntSSales = $('#tblSubSec_1_' + j + ' tr').length - 1;
                for (var i = 1; i < rCntSSales; i++) {
                    if (($("#txtProductName_" + j + "_" + i).val() != "") && ($("#txtProductName_" + j + "_" + i).val() != "undefined")) {
                        var selectedValue = jsonPath(productAutofill_g[0], "$.Data[?(@.productCode =='" + $("#hdnProductCode_" + j + "_" + i).val().split('_')[0] + "')]");
                        if (!(selectedValue.length > 0)) {
                            fnMsgAlert('info', 'Secondary Sales', $("#txtProductName_" + j + "_" + i).val() + '  Product name  is invalid.');
                            $("#txtProductName_" + j + "_" + i).focus();
                            return false;
                        }
                    }
                }
            }
        }
    }
    else {
        var rCntSSales = $("#tblSecondarySales tr").length - 1;
        for (var i = 1; i < rowNumber; i++) {
            if ($("#txtProductName_" + i).length > 0 && $("#txtProductName_" + i).val() != "") {
                var selectedValue = jsonPath(productAutofill_g[0], "$.Data[?(@.productCode =='" + $("#hdnProductCode_" + i).val().split('_')[0] + "')]");
                if (!(selectedValue.length > 0)) {
                    fnMsgAlert('info', 'Secondary Sales', $("#txtProductName_" + i).val() + '  Product name  is invalid.');
                    $("#txtProductName_" + i).focus();
                    return false;
                }
            }
        }
    }
    return true;
}

function fnSubmitValidate(val) {
    debugger;
    $.blockUI();
    SalesArr = [];
    draftOrSubmitmode = val;
    var isTrue = new Boolean(true);
    var results = "";
    isTrue = fbValidation();
    if (isTrue != true) {
        $.unblockUI();
        return false;
    }
    debugger;
    isTrue = fnSecondarySalesValidation();
    if (isTrue != true) {
        $.unblockUI();
        return false;
    }

    fnCheckMonthDiff(draftOrSubmitmode);

    // $.unblockUI();
}

function fncheckNegative(string) {


    if (/-/.test(string) == true) {

        return false;
    }
    else {
        return true;
    }
}

// Read table and insert method
function fnReadSecondarySalesTable(val) {
    debugger;
    var results = "";
    secondaryDetails = "";
    productCode = "", month = "", year = "", statementDate = "", baseTypeCode = "", baseCode = "", ProductRemarks = "";
    customerCode = "", customerEntityType = "", divisionCode = "";
    openingBalance = 0.0, purchase = 0.0, purchaseReturn = 0.0, unitrate = 0;
    hdnOpeningBalance = 0.0;
    hdnIs_Manually_Edited = "";
    savemode = val;
    month = $('#drpMonth').val();
    year = $('#drpYear').val();
    statementDate = $('#txtStatmentDate').val();
    //ssStatus = $('#hdnStatus').val();
    //if (ssEntryMode == "CUSTOMER") {
    //    if ($('#txtStockiestName').val() != null && $('#txtStockiestName').val() != "") {
    //        baseCode = $('#hdnStockiestCode').val();
    //        baseTypeCode = "STOCKIEST";
    //    }
    //    else {
    //        baseCode = "NULL";
    //        baseTypeCode = "NULL";
    //    }
    //    var rCntSSalesTable = $('#tblSecondarySales table').length;
    //    results = "";
    //    for (var j = 1; j <= rCntSSalesTable; j++) {
    //        if ($("#txtCustomerName_1_" + j).val() != "") {
    //            secondaryDetails = "";
    //            customerCode = $("#hdnCustomerCode_1_" + j).val();
    //            entityType = jsonPath(productAutofill_g[3], "$.Data[?(@.Customer_Code=='" + customerCode + "')]");
    //            if (entityType != false) {
    //                customerEntityType = entityType[0].Customer_Entity
    //            }
    //            // customerEntityType = "DOCTOR";
    //            var rCntSSales = $('#tblSubSec_1_' + j + ' tr').length - 1;
    //            for (var i = 1; i < rCntSSales; i++) {
    //                if (($("#txtProductName_" + j + "_" + i).val() != "") && ($("#txtProductName_" + j + "_" + i).val() != "undefined")) {
    //                    productCode = $("#hdnProductCode_" + j + "_" + i).val();
    //                    unitrate = $("#txtUnitRate_" + j + "_" + i).val();
    //                    if ($("#txtOPENING_BALANCE-" + j + "_" + i).length > 0) {
    //                        if ($("#txtOPENING_BALANCE-" + j + "_" + i).val() != undefined) {
    //                            if (fncheckNegative($("#txtOPENING_BALANCE-" + j + "_" + i).val()) != false) {
    //                                if ($("#txtOPENING_BALANCE-" + j + "_" + i).val() != null && $("#txtOPENING_BALANCE-" + j + "_" + i).val() != "") {
    //                                    openingBalance = parseFloat($("#txtOPENING_BALANCE-" + j + "_" + i).val());
    //                                    hdnOpeningBalance = parseFloat($("#hdntxtOPENING_BALANCE-" + j + "_" + i).val()).toFixed(2);
    //                                }
    //                                else {
    //                                    openingBalance = 0.0;
    //                                    hdnOpeningBalance = 0.0;
    //                                }
    //                            }
    //                            else {
    //                                fnMsgAlert('info', 'Secondary sales', 'Negative values not allowed.');
    //                                return false;
    //                            }
    //                        }
    //                    }
    //                    if ($("#txtPURCHASE-" + j + "_" + i).length > 0) {
    //                        if ($("#txtPURCHASE-" + j).val() != undefined) {
    //                            if (fncheckNegative($("#txtPURCHASE-" + j).val()) != false) {
    //                                if ($("#txtPURCHASE-" + j + "_" + i).val() != null && $("#txtPURCHASE-" + j + "_" + i).val() != "") {
    //                                    purchase = parseFloat($("#txtPURCHASE-" + j + "_" + i).val());
    //                                }
    //                                else {
    //                                    purchase = 0.0;
    //                                }
    //                            }
    //                            else {
    //                                fnMsgAlert('info', 'Secondary sales', 'Negative values not allowed.');
    //                                return false;
    //                            }
    //                        }
    //                    }
    //                    if ($("#txtPURCHASE_RETURN-" + j + "_" + i).length > 0) {
    //                        if ($("#txtPURCHASE_RETURN-" + j + "_" + i).val() != undefined) {
    //                            if (fncheckNegative($("#txtPURCHASE_RETURN-" + j + "_" + i).val()) != false) {
    //                                if ($("#txtPURCHASE_RETURN-" + j + "_" + i).val() != null && $("#txtPURCHASE_RETURN-" + j + "_" + i).val() != "") {
    //                                    purchaseReturn = parseFloat($("#txtPURCHASE_RETURN-" + j + "_" + i).val());
    //                                }
    //                                else {
    //                                    purchaseReturn = 0.0;
    //                                }
    //                            }
    //                            else {
    //                                fnMsgAlert('info', 'Secondary sales', 'Negative values not allowed.');
    //                                return false;
    //                            }
    //                        }
    //                    }
    //                    if ($("#txtSALES-" + j + "_" + i).length > 0) {
    //                        if ($("#txtSALES-" + j).val() != undefined) {
    //                            if (fncheckNegative($("#txtSALES-" + j).val()) != false) {
    //                                if ($("#txtSALES-" + j + "_" + i).val() != null && $("#txtSALES-" + j + "_" + i).val() != "") {
    //                                    sales = parseFloat($("#txtSALES-" + j + "_" + i).val());
    //                                }
    //                                else {
    //                                    sales = 0.0;
    //                                }
    //                            }
    //                            else {
    //                                fnMsgAlert('info', 'Secondary sales', 'Negative values not allowed.');
    //                                return false;
    //                            }
    //                        }
    //                    }
    //                    if ($("#txtSALES_RETURN-" + j + "_" + i).length > 0) {
    //                        if ($("#txtSALES_RETURN-" + j + "_" + i).val() != undefined) {
    //                            if (fncheckNegative($("#txtSALES_RETURN-" + j + "_" + i).val()) != false) {
    //                                if ($("#txtSALES_RETURN-" + j + "_" + i).val() != null && $("#txtSALES_RETURN-" + j + "_" + i).val() != "") {
    //                                    salesReturn = parseFloat($("#txtSALES_RETURN-" + j + "_" + i).val());
    //                                }
    //                                else {
    //                                    salesReturn = 0.0;
    //                                }
    //                            }
    //                            else {
    //                                fnMsgAlert('info', 'Secondary sales', 'Negative values not allowed.');
    //                                return false;
    //                            }
    //                        }
    //                    }
    //                    if ($("#txtTRANSIT-" + j + "_" + i).length > 0) {
    //                        if ($("#txtTRANSIT-" + j + "_" + i).val() != undefined) {
    //                            if ($("#txtTRANSIT-" + j + "_" + i).val() != null && $("#txtTRANSIT-" + j + "_" + i).val() != "") {
    //                                transit = parseFloat($("#txtTRANSIT-" + j + "_" + i).val());
    //                            }
    //                            else {
    //                                transit = 0.0;
    //                            }
    //                        }
    //                    }
    //                    if ($("#txtCLOSING_BALANCE-" + j + "_" + i).length > 0) {
    //                        if ($("#txtCLOSING_BALANCE-" + j).val() != undefined) {
    //                            if (fncheckNegative($("#txtCLOSING_BALANCE-" + j).val()) != false) {
    //                                if ($("#txtCLOSING_BALANCE-" + j + "_" + i).val() != null && $("#txtCLOSING_BALANCE-" + j + "_" + i).val() != "") {
    //                                    closingBalance = parseFloat($("#txtCLOSING_BALANCE-" + j + "_" + i).val());
    //                                }
    //                                else {
    //                                    closingBalance = 0.0;
    //                                }
    //                            }
    //                            else {
    //                                fnMsgAlert('info', 'Secondary sales', 'Negative values not allowed.');
    //                                return false;
    //                            }
    //                        }
    //                    }
    //                    if ($("#txtFREE_GOODS-" + j + "_" + i).length > 0) {
    //                        if ($("#txtFREE_GOODS-" + j).val() != undefined) {
    //                            if (fncheckNegative($("#txtFREE_GOODS-" + j).val()) != false) {
    //                                if ($("#txtFREE_GOODS-" + j).val() != null && $("#txtFREE_GOODS-" + j).val() != "") {
    //                                    freeGoods = parseFloat($("#txtFREE_GOODS-" + j).val());
    //                                }
    //                                else {
    //                                    freeGoods = 0.0;
    //                                }
    //                            }
    //                            else {
    //                                fnMsgAlert('info', 'Secondary sales', 'Negative values not allowed.');
    //                                return false;
    //                            }
    //                        }
    //                    }
    //                    if ($("#txtREMARKS-" + j + "_" + i).length > 0) {
    //                        if ($("#txtREMARKS-" + j).val() != undefined) {
    //                            ProductRemarks = $("#txtREMARKS-" + j).val();
    //                        }
    //                    }
    //                    if (productCode.split('_')[1] == "undefined") {
    //                        divisionCode = "NULL";
    //                    }
    //                    else {
    //                        divisionCode = productCode.split('_')[1];
    //                    }
    //                    debugger;
    //                    secondaryDetails += divisionCode + "^" + productCode.split('_')[0] + "^" + parseFloat(openingBalance).toFixed(2) + "^" + purchase + "^"
    //                                    + purchaseReturn + "^" + sales + "^" + salesReturn + "^" + closingBalance + "^" + transit + "^"
    //                                    + freeGoods + "^" + unitrate + "^" + ProductRemarks + "~";
    //                    var openingBalanceVal = parseFloat($("#txtOPENING_BALANCE-" + j + "_" + i).val());
    //                    var purchaseVal = parseFloat($("#txtPURCHASE-" + j).val());
    //                    var purchaseReturnVal = parseFloat($("#txtPURCHASE_RETURN-" + j).val());
    //                    var salesVal = parseFloat($("#txtSALES-" + j).val());
    //                    var freeGoodsVal = parseFloat($("#txtFREE_GOODS-" + j).val());
    //                    if ($("#txtUnitRate_" + i).val() != null && $("#txtUnitRate_" + i).val() != "") {
    //                        unitrate = parseFloat($("#txtUnitRate_" + j).val());
    //                    }
    //                    if ($("#txtOPENING_BALANCE-" + i).val() != null && $("#txtOPENING_BALANCE-" + i).val() != "") {
    //                        openingBalance = parseFloat($("#txtOPENING_BALANCE-" + i).val());
    //                    }
    //                    if ($("#txtFREE_GOODS-" + i).val() != null && $("#txtFREE_GOODS-" + i).val() != "") {
    //                        freeGoods = parseFloat($("#txtFREE_GOODS-" + i).val());
    //                    }
    //                    if ($("#txtPURCHASE-" + j).val() != null && $("#txtPURCHASE-" + j).val() != "") {
    //                        purchase = parseFloat($("#txtPURCHASE-" + j).val());
    //                    }
    //                    if ($("#txtPURCHASE_RETURN-" + j).val() != null && $("#txtPURCHASE_RETURN-" + j).val() != "") {
    //                        purchaseReturn = parseFloat($("#txtPURCHASE_RETURN-" + j).val());
    //                    }
    //                    if ($("#txtSALES-" + j).val() != null && $("#txtSALES-" + j).val() != "") {
    //                        sales = parseFloat($("#txtSALES-" + j).val());
    //                    }
    //                    if ($("#txtSALES_RETURN-" + j).val() != null && $("#txtSALES_RETURN-" + j).val() != "") {
    //                        salesReturn = parseFloat($("#txtSALES_RETURN-" + j).val());
    //                    }
    //                    if ($("#txtTRANSIT-" + j).val() != null && $("#txtTRANSIT-" + j).val() != "") {
    //                        transit = parseFloat($("#txtTRANSIT-" + j).val());
    //                    }
    //                    if ($("#txtCLOSING_BALANCE-" + j).val() != null && $("#txtCLOSING_BALANCE-" + j).val() != "") {
    //                        closingStock = parseFloat($("#txtCLOSING_BALANCE-" + j).val());
    //                    }
    //                    ssformula = "";
    //                    //  ssformula = "OPENING_BALANCE + PURCHASE - PURCHASE_RETURN - SALES + SALES_RETURN +TRANSIT";
    //                    ssformula = ssformulas;
    //                    ssformula = ssformula.replace("PURCHASE_RETURN", "REPPUR");
    //                    ssformula = ssformula.replace("SALES_RETURN", "SRDUM");
    //                    ssformula = ssformula.replace("SALES", "ESSALES");
    //                    ssformula = ssformula.replace("PURCHASE", "DUMPURCHASE");
    //                    ssformula = ssformula.replace("OPENING_BALANCE", "ASOPENING");
    //                    ssformula = ssformula.replace("CLOSING_BALANCE", "CLOSINGDUM");
    //                    ssformula = ssformula.replace("FREE_GOODS", "FREEGOODSDUM");
    //                    debugger;
    //                    ssformula = ssformula.replace(/\s+/g, '');
    //                    if (ssformula.indexOf("ASOPENING") >= 0) {
    //                        if ($("#txtOPENING_BALANCE-" + j).val() != null && $("#txtOPENING_BALANCE-" + j).val() != "") {
    //                            ssformula = ssformula.replace("ASOPENING", "(parseFloat($('#txtOPENING_BALANCE-" + j + "').val()))");
    //                        }
    //                        else {
    //                            ssformula = ssformula.replace("ASOPENING", "(parseFloat(0))");
    //                        }
    //                    }
    //                    if (ssformula.indexOf("FREEGOODSDUM") >= 0) {
    //                        if ($("#txtFREE_GOODS-" + j).val() != null && $("#txtFREE_GOODS-" + j).val() != "") {
    //                            ssformula = ssformula.replace("FREEGOODSDUM", "(parseFloat($('#txtFREE_GOODS-" + j + "').val()))");
    //                        }
    //                        else {
    //                            ssformula = ssformula.replace("FREEGOODSDUM", "(parseFloat(0))");
    //                        }
    //                    }
    //                    if (ssformula.indexOf("REPPUR") >= 0) {
    //                        if ($("#txtPURCHASE_RETURN-" + j).val() != null && $("#txtPURCHASE_RETURN-" + j).val() != "") {
    //                            ssformula = ssformula.replace("REPPUR", "(parseFloat($('#txtPURCHASE_RETURN-" + j + "').val()))");
    //                        }
    //                        else {
    //                            ssformula = ssformula.replace("REPPUR", "(parseFloat(0))");
    //                        }
    //                    }
    //                    if (ssformula.indexOf("DUMPURCHASE") >= 0) {
    //                        if ($("#txtPURCHASE-" + j).val() != null && $("#txtPURCHASE-" + j).val() != "") {
    //                            ssformula = ssformula.replace("DUMPURCHASE", "(parseFloat($('#txtPURCHASE-" + j + "').val()))");
    //                        }
    //                        else {
    //                            ssformula = ssformula.replace("DUMPURCHASE", "(parseFloat(0))");
    //                        }
    //                    }
    //                    if (ssformula.indexOf("SRDUM") >= 0) {
    //                        if ($("#txtSALES_RETURN-" + j).val() != null && $("#txtSALES_RETURN-" + j).val() != "") {
    //                            ssformula = ssformula.replace("SRDUM", "(parseFloat($('#txtSALES_RETURN-" + j + "').val()))");
    //                        }
    //                        else {
    //                            ssformula = ssformula.replace("SRDUM", "(parseFloat(0))");
    //                        }
    //                    }
    //                    if (ssformula.indexOf("ESSALES") >= 0) {
    //                        debugger;
    //                        if ($("#txtSALES-" + j).val() != null && $("#txtSALES-" + j).val() != "") {
    //                            if (ssformula.indexOf("(parseFloat($('#txtFREE_GOODS-" + j + "').val()))") >= 0) {
    //                                if ($("#txtFREE_GOODS-" + j).val() != null && $("#txtFREE_GOODS-" + j).val() != "") {
    //                                    ssformula = ssformula.replace("ESSALES", "(parseFloat($('#txtSALES-" + j + "').val()))");
    //                                    ssformula = ssformula.replace("FREEGOODSDUM", "(parseFloat($('#txtFREE_GOODS-" + j + "').val()))");
    //                                }
    //                                else {
    //                                    ssformula = ssformula.replace("ESSALES", "(parseFloat($('#txtSALES-" + j + "').val()))+(parseFloat(0))");
    //                                }
    //                            }
    //                            else {
    //                                ssformula = ssformula.replace("ESSALES", "(parseFloat($('#txtSALES-" + j + "').val()))");
    //                            }
    //                        }
    //                        else {
    //                            ssformula = ssformula.replace("ESSALES", "(parseFloat(0))");
    //                        }
    //                    }
    //                    if ($("#txtTRANSIT-" + j).val() != null && $("#txtTRANSIT-" + j).val() != "") {
    //                        ssformula = ssformula.replace("TRANSIT", "parseFloat($('#txtTRANSIT-" + j + "').val())");
    //                    }
    //                    else {
    //                        ssformula = ssformula.replace("TRANSIT", "parseFloat(0)");
    //                    }
    //                    if ($("#txtFREE_GOODS-" + j).val() != null && $("#txtFREE_GOODS-" + j).val() != "") {
    //                        ssformula = ssformula.replace("FREE_GOODS", "parseFloat($('#txtFREE_GOODS-" + j + "').val())");
    //                    }
    //                    else {
    //                        ssformula = ssformula.replace("FREE_GOODS", "parseFloat(0)");
    //                    }
    //                    if (ssformula.indexOf("CLOSINGDUM") >= 0) {
    //                        if ($("#txtCLOSING_BALANCE-" + j).val() != null && $("#txtCLOSING_BALANCE-" + j).val() != "") {
    //                            ssformula = ssformula.replace("CLOSINGDUM", "parseFloat($('#txtCLOSING_BALANCE-" + j + "').val())");
    //                        }
    //                        else {
    //                            ssformula = ssformula.replace("CLOSINGDUM", "parseFloat(0)");
    //                        }
    //                    }
    //                    if (ssformulas != "") {
    //                        total = parseFloat(eval(ssformula)).toFixed(2);
    //                    }
    //                    else {
    //                        total = 0;
    //                    }
    //                    // Calculation 
    //                    amountCalc = 0.0;
    //                    if (compute.toUpperCase() == "CLOSING_BALANCE") {
    //                        // total = openingBalance + purchase - purchaseReturn - sales + salesReturn - transit;
    //                        $("#txtCLOSING_BALANCE-" + j).val(0);
    //                        if (total != "") {
    //                            if (total >= 0) {
    //                                $("#txtCLOSING_BALANCE-" + j).val(total)
    //                            }
    //                        }
    //                    }
    //                    var closingBalanceVal = 0;
    //                    if ($("#txtAmountCLOSING_BALANCE-" + j) != null) {
    //                        if ($("#txtCLOSING_BALANCE-" + j).val() != null && $("#txtCLOSING_BALANCE-" + j).val() != "") {
    //                            closingBalanceVal = $("#txtCLOSING_BALANCE-" + j).val();
    //                        }
    //                        amountCalc = (unitrate * closingBalanceVal);
    //                        amountCalc = parseFloat(amountCalc).toFixed(2);
    //                        $("#txtAmountCLOSING_BALANCE-" + j).val(amountCalc);
    //                    }
    //                    if ($("#txtAmountSALES-" + j) != null) {
    //                        amountCalc = (unitrate * sales);
    //                        amountCalc = parseFloat(amountCalc).toFixed(2);
    //                        $("#txtAmountSALES-" + j).val(amountCalc);
    //                    }
    //                    if (compute.toUpperCase() == "SALES") {
    //                        // total = openingBalance + purchase - purchaseReturn - closingStock + salesReturn - transit;
    //                        $("#txtSALES-" + j).val(0);
    //                        if (total >= 0) {
    //                            $("#txtSALES-" + j).val(total)
    //                        }
    //                        else {
    //                            $("#txtSALES-" + j).val(total);
    //                            fnMsgAlert('info', 'Info', 'Negative numbers are not allowed.');
    //                            return false;
    //                        }
    //                    }
    //                    var C_OB = 0;
    //                    var C_PUR = 0;
    //                    var C_PUR_RET = 0;
    //                    var C_SALES = 0;
    //                    var C_SAL_RET = 0;
    //                    var C_CB = 0;
    //                    var C_TRANSIT = 0;
    //                    var C_FREE = 0;
    //                    // Get the values for calcluation. Please use the following order for getting the values.
    //                    C_OB = fnGetOBValueForCalc(j);
    //                    if (!C_OB && C_OB != 0) {
    //                        return false;
    //                    }
    //                    C_FREE = fnGetFGValueForCalc(j);
    //                    if (!C_FREE && C_FREE != 0) {
    //                        return false;
    //                    }
    //                    C_PUR_RET = fnGetPurchaseReturnValueForCalc(j);
    //                    if (!C_PUR_RET && C_PUR_RET != 0) {
    //                        return false;
    //                    }
    //                    C_SAL_RET = fnGetSalesReturnValueForCalc(j);
    //                    if (!C_SAL_RET && C_SAL_RET != 0) {
    //                        return false;
    //                    }
    //                    C_PUR = fnGetPurchaseValueForCalc(j);
    //                    if (!C_PUR && C_PUR != 0) {
    //                        return false;
    //                    }
    //                    C_SALES = fnGetSalesValueForCalc(j);
    //                    if (!C_SALES && C_SALES != 0) {
    //                        return false;
    //                    }
    //                    C_CB = fnGetClosingBalValueForCalc(j);
    //                    if (!C_CB && C_CB != 0) {
    //                        return false;
    //                    }
    //                    C_TRANSIT = fnGetTransitValueForCalc(j);
    //                    if (!C_TRANSIT && C_TRANSIT != 0) {
    //                        return false;
    //                    }
    //                    debugger;
    //                    // Closing Balance Verify.
    //                    if (ssformulas.indexOf('+TRANSIT') > -1) {
    //                        var calculateClosingBalance = ((parseFloat(C_OB) + (parseFloat(C_PUR) - parseFloat(C_PUR_RET)) + parseFloat(C_SAL_RET)) + parseFloat(C_TRANSIT))
    //                                                        - (parseFloat(C_SALES) + parseFloat(C_FREE));
    //                    } else {
    //                        var calculateClosingBalance = ((parseFloat(C_OB) + (parseFloat(C_PUR) - parseFloat(C_PUR_RET)) + parseFloat(C_SAL_RET)) - parseFloat(C_TRANSIT))
    //                                                        - (parseFloat(C_SALES) + parseFloat(C_FREE));
    //                    }
    //                    debugger;
    //                    var ClosingBlanceValue = fnGetClosingBalanceValue(j);
    //                    if (parseFloat(ClosingBlanceValue) != parseFloat(calculateClosingBalance)) {
    //                        fnMsgAlert('info', 'Info', 'There is a computation error in the product - <b> ' + $("#txtProductName_" + j).val() + "</b>");
    //                        return false;
    //                    }
    //                    // Sales Calculation Verify.
    //                    if (ssformulas.indexOf('+TRANSIT') > -1) {
    //                        var calculateSales = (((parseFloat(C_OB) + (parseFloat(C_PUR) - parseFloat(C_PUR_RET)) + parseFloat(C_SAL_RET))) + parseFloat(C_TRANSIT))
    //                                            - parseFloat(C_CB);
    //                    }
    //                    else {
    //                        var calculateSales = (((parseFloat(C_OB) + (parseFloat(C_PUR) - parseFloat(C_PUR_RET)) + parseFloat(C_SAL_RET))) - parseFloat(C_TRANSIT))
    //                                            - parseFloat(C_CB);
    //                    }
    //                    if (ssformulas.indexOf('FREE_GOODS') > -1) {
    //                        calculateSales = calculateSales + C_FREE;
    //                    }
    //                    var SalesValue = fnGetSalesValue(j);
    //                    if (parseFloat(calculateSales) != parseFloat(SalesValue + C_FREE)) {
    //                        fnMsgAlert('info', 'Info', 'There is a computation error in the product  -  <b>' + $("#txtProductName_" + j).val() + "</b>");
    //                        return false;
    //                    }
    //                    // clsStock = clsStock - clsStockVal;
    //                    fncalTotal();
    //                    if (($("#txtOPENING_BALANCE-" + j).val() != undefined)) {
    //                        if (($("#txtOPENING_BALANCE-" + j).val() != null) && ($("#txtOPENING_BALANCE-" + j).val() !== "")) {
    //                            openingBalance = $("#txtOPENING_BALANCE-" + j).val();
    //                        }
    //                    }
    //                    else {
    //                        openingBalance = 0;
    //                    }
    //                    debugger;
    //                    if (($("#txtFREE_GOODS-" + j).val() != undefined)) {
    //                        if (($("#txtFREE_GOODS-" + j).val() != null) && ($("#txtFREE_GOODS-" + j).val() !== "")) {
    //                            freeGoods = $("#txtFREE_GOODS-" + j).val();
    //                        }
    //                    }
    //                    else {
    //                        openingBalance = 0;
    //                    }
    //                    if (($("#txtPURCHASE-" + j).val() != undefined)) {
    //                        if (($("#txtPURCHASE_RETURN-" + j).val() != null) && ($("#txtPURCHASE_RETURN-" + j).val() != "")) {
    //                            purchase = $("#txtPURCHASE-" + j).val();
    //                        }
    //                    }
    //                    else {
    //                        purchase = 0;
    //                    }
    //                    if (($("#txtPURCHASE_RETURN-" + j).val() != undefined)) {
    //                        if (($("#txtPURCHASE_RETURN-" + j).val() != null) && ($("#txtPURCHASE_RETURN-" + j).val() != "")) {
    //                            purchaseReturn = $("#txtPURCHASE_RETURN-" + j).val();
    //                        }
    //                    }
    //                    else {
    //                        purchaseReturn = 0;
    //                    }
    //                    if (($("#txtSALES-" + j).val() != undefined)) {
    //                        if (($("#txtSALES-" + j).val() != null) && ($("#txtSALES-" + j).val() != "")) {
    //                            sales = $("#txtSALES-" + j).val();
    //                        }
    //                    }
    //                    else {
    //                        sales = 0.00;
    //                    }
    //                    if (($("#txtSALES_RETURN-" + j).val() != undefined)) {
    //                        if (($("#txtSALES_RETURN-" + j).val() != null) && ($("#txtSALES_RETURN-" + j).val() != "")) {
    //                            salesReturn = $("#txtSALES_RETURN-" + j).val();
    //                        }
    //                    }
    //                    else {
    //                        salesReturn = 0;
    //                    }
    //                    if (($("#txtCLOSING_BALANCE-" + j).val() != undefined)) {
    //                        if (($("#txtCLOSING_BALANCE-" + j).val() != null) && ($("#txtCLOSING_BALANCE-" + j).val() != "")) {
    //                            closingBalance = $("#txtCLOSING_BALANCE-" + j).val();
    //                        }
    //                    }
    //                    else {
    //                        closingBalance = 0;
    //                    }
    //                    if (($("#txtTRANSIT-" + j).val() != undefined)) {
    //                        if (($("#txtTRANSIT-" + j).val() != null) && ($("#txtTRANSIT-" + j).val() != "")) {
    //                            transit = $("#txtTRANSIT-" + j).val();
    //                        }
    //                        else {
    //                            transit = 0;
    //                        }
    //                    }
    //                    if (($("#txtUnitRate_" + j).val() != undefined)) {
    //                        if (($("#txtUnitRate_" + j).val() != null) && ($("#txtUnitRate_" + j).val() != "")) {
    //                            unitrate = $("#txtUnitRate_" + j).val();
    //                        }
    //                    }
    //                    else {
    //                        unitrate = 0;
    //                    }
    //                    debugger;
    //                    secondaryDetails += divisionCode + "^" + productCode.split('_')[0] + "^" + parseFloat(openingBalance).toFixed(2) + "^" + purchase + "^" + purchaseReturn
    //                                        + "^" + sales + "^" + salesReturn + "^" + closingBalance + "^" + transit + "^" + unitrate + freeGoods
    //                                        + ProductRemarks + "^" + hdnOpeningBalance + "~";
    //                }
    //            }
    //            fnSecondaryEventBinder();
    //            debugger;
    //            var ssEntryProductCheck = "";
    //            var productarray = new Array();
    //            $.ajax({
    //                type: 'POST',
    //                url: '../HiDoctor_Activity/SecondarySales/GetPrivilegeValue',
    //                data: "userCode=" + selectedUserCode + "&privilegeName=" + "SS_ENTRY_PRODUCT_CHECK",
    //                async: false,
    //                success: function (result) {
    //                    debugger;
    //                    if (result != null || result != undefined) {
    //                        ssEntryProductCheck = result;
    //                    }
    //                }
    //            });
    //            debugger;
    //            var monthVal = $('#drpMonth').val();
    //            var yearVal = $('#drpYear').val();
    //            var SSProductBringType = jsonPath(userPrivilegeContainer_g[0], "$.Data[?(@.PrivilegeName=='SECONDARY_SALES_PRODUCTS_BRING_TYPE')]");
    //            if (SSProductBringType != false) {
    //                SSProductBringType = SSProductBringType[0].PrivilegeValue;
    //                SSProductBringType = SSProductBringType.replace(',', '^');
    //                if (SSProductBringType != "") {
    //                    SSProductBringType = SSProductBringType + "^";
    //                }
    //            }
    //            var secstrng = [];
    //            secstrng = secondaryDetails.split('~');
    //            var appliedProductArray = new Array();
    //            for (var i = 0; i < secstrng.length - 1; i++) {
    //                appliedProductArray.push(secstrng[i].split('^')[1]);
    //            }
    //            if (ssEntryProductCheck != "" || ssEntryProductCheck != null || ssEntryProductCheck != undefined) {
    //                if (ssEntryProductCheck == "YES") {
    //                    $.ajax({
    //                        type: 'POST',
    //                        url: '../HiDoctor_Activity/SecondarySales/GetSecProductAutoFill ',
    //                        async: false,
    //                        data: 'userCode=' + selectedUserCode + '&ProductTypeCode=' + SSProductBringType + '&regionCode=' + regionCode + '&entryMode=' + ssEntryMode + '&stockiestCode=' + $('#hdnStockiestCode').val(),
    //                        success: function (response) {
    //                            debugger;
    //                            productAutofill_ProductCheck = response.Data;
    //                        }
    //                    });
    //                    $.ajax({
    //                        type: 'POST',
    //                        url: '../HiDoctor_Activity/SecondarySales/GetClosingBalanceGreaterThanZero',
    //                        data: '&productAutofill=' + escape(JSON.stringify(productAutofill_g[0].Data)) + '&productPrice=' + escape(JSON.stringify(productPrice_g[0].Data)) + '&openingBalances=' + escape(JSON.stringify(productAutofill_ProductCheck[4].Data)) + '&year=' + yearVal + '&month=' + monthVal + '&StockiestCode=' + $('#hdnStockiestCode').val() + '&priceType=' + escape(JSON.stringify(productPrice_g[1].Data)) + '&regionCode=' + regionCode,
    //                        async: false,
    //                        success: function (response) {
    //                            debugger;
    //                            var res = eval(response);
    //                            for (var i = 0; i < res.length; i++) {
    //                                productarray.push(res[i].Product_Code);
    //                            }
    //                        }
    //                    });
    //                    var openig = [];
    //                    var preSSMonth = month;
    //                    var previousmonth = "";
    //                    previousmonth = month - 1;
    //                    if (preSSMonth == "1") {
    //                        previousmonth = "12";
    //                    }
    //                    //sonPath(Header_g[0].Data[3], "$.Data[?(@.Region_Code=='" + regionCodeArr[i] + "' & @.Category_Name=='" + $("#ddlCategory :selected").text() + "')]");
    //                    openig = jsonPath(productAutofill_g[4].Data, "$.[?(@.Opening_Balance > 0  & @.Month=='" + previousmonth + "')]");
    //                    //debugger;
    //                    //for (var i = 0; i < openig.length; i++) {
    //                    //    productarray.push(openig[i].Product_Code);
    //                    //}
    //                    debugger;
    //                    for (var i = 0; i < productarray.length; i++) {
    //                        if ($.inArray(productarray[i], appliedProductArray) == -1) {
    //                            fnMsgAlert('info', 'Secondary Sales', 'You have not selected all products which are having closing balance for the last month');
    //                            return false;
    //                        }
    //                    }
    //                }
    //            }
    //            $.ajax({
    //                type: 'POST',
    //                url: '../HiDoctor_Activity/SecondarySales/InsertSecondarySalesValues',
    //                data: "tblSecondaryDetails=" + secondaryDetails + "&month=" + month + "&year=" + year + "&userCode=" + selectedUserCode + "&regionCode=" + regionCode + "&baseCode=" + baseCode + "&stDate=" + statementDate +
    //                "&baseTypeCode=" + baseTypeCode + "&status=" + ssStatus + "&cusCode=" + customerCode + "&cusType=" + customerEntityType + "&EntryMode=" + ssEntryMode + "&draftMode=" + savemode + '&openingBalances=' + escape(JSON.stringify(productAutofill_g[4].Data)),
    //                success: function (result) {
    //                    if (result.toUpperCase() == "TRUE") {
    //                        results = result;
    //                    }
    //                }
    //            });
    //            fnMsgAlert('success', 'Secondary Sales', 'Saved successfully.');
    //            fnMonthAndYear();
    //            $('#hdnStatus').val('')
    //            $('#hdnStockiestCode').val('');
    //            $('#txtStockiestName').val('');
    //            $('#txtStatmentDate').val('');
    //            $('#txtStatmentDate').attr('disabled', false);
    //            $('#txtStockiestName').attr('disabled', false);
    //            $('#drpMonth').attr('disabled', false);
    //            $('#drpYear').attr('disabled', false);
    //            fnCreateSecandryTable(selectedUserCode, regionCode);
    //        }
    //    }
    //}
    //else {
    debugger;
    var rCntSSales = $("#tblSecondarySales tr").length - 1;
    if (ssEntryMode.toUpperCase() == "REP") {
        customerCode = "NULL";
        customerEntityType = "NULL";
    }
    if (ssEntryMode.toUpperCase() == "STOCKIEST") {
        baseCode = $('#hdnStockiestCode').val();
        baseTypeCode = "STOCKIEST";
    }
    else {
        baseCode = selectedUserCode;
        baseTypeCode = "USER";
    }
    var i = 0;

    for (i = 1; i < rowNumber; i++) {

        if ($("#txtProductName_" + i).length > 0 && $("#txtProductName_" + i).val() != "") {

            productCode = $("#hdnProductCode_" + i).val();
            unitrate = $("#txtUnitRate_" + i).val();


            var ps = jsonPath(PSDetails, "$.[?(@.Product_Code=='" + productCode.split('_')[0] + "')]");


            if (ps != false) {
                var inputCol = jsonPath(ps, "$.[?(@.Column_Name=='OPENING_BALANCE')]");
                {
                    if (inputCol == false) {
                        if (fncheckNegative($("#txtOPENING_BALANCE-" + i).val()) == false) {
                            $.unblockUI();
                            fnMsgAlert('info', 'Secondary sales', 'Negative values not allowed.');
                            return false;
                        }
                        else {

                            if ($("#txtOPENING_BALANCE-" + i).val() != null && $("#txtOPENING_BALANCE-" + i).val() != "") {
                                openingBalance = parseFloat($("#txtOPENING_BALANCE-" + i).val());
                                hdnOpeningBalance = parseFloat($("#hdntxtOPENING_BALANCE-" + i).val()).toFixed(2);
                                hdnIs_Manually_Edited = $("#hdnmanually_editedOPENING_BALANCE-" + i).val();
                            }
                            else {
                                openingBalance = 0.0;
                                hdnOpeningBalance = 0.0;
                                hdnIs_Manually_Edited = 0;
                            }
                        }
                    }
                    else {

                        if ($("#txtOPENING_BALANCE-" + i).val() != null && $("#txtOPENING_BALANCE-" + i).val() != "") {
                            openingBalance = parseFloat($("#txtOPENING_BALANCE-" + i).val());
                            hdnOpeningBalance = parseFloat($("#hdntxtOPENING_BALANCE-" + i).val()).toFixed(2);
                            hdnIs_Manually_Edited = $("#hdnmanually_editedOPENING_BALANCE-" + i).val();
                        }
                        else {
                            openingBalance = 0.0;
                            hdnOpeningBalance = 0.0;
                            hdnIs_Manually_Edited = 0;
                        }
                    }
                }
            }
            else {
                if ($("#txtOPENING_BALANCE-" + i).val() != undefined) {
                    if (fncheckNegative($("#txtOPENING_BALANCE-" + i).val()) != false) {
                        if ($("#txtOPENING_BALANCE-" + i).val() != null && $("#txtOPENING_BALANCE-" + i).val() != "") {
                            openingBalance = parseFloat($("#txtOPENING_BALANCE-" + i).val());
                            hdnOpeningBalance = parseFloat($("#hdntxtOPENING_BALANCE-" + i).val()).toFixed(2);
                            hdnIs_Manually_Edited = $("#hdnmanually_editedOPENING_BALANCE-" + i).val();
                        }
                        else {
                            openingBalance = 0.0;
                            hdnOpeningBalance = 0.0;
                            hdnIs_Manually_Edited = 0;
                        }
                    }
                    else {
                        $.unblockUI();
                        fnMsgAlert('info', 'Secondary sales', 'Negative values not allowed.');
                        return false;
                    }
                }
            }

            if (ps != false) {
                var inputCol = jsonPath(ps, "$.[?(@.Column_Name=='FREE_GOODS')]");
                {
                    if (inputCol == false) {
                        if (fncheckNegative($("#txtFREE_GOODS-" + i).val()) == false) {
                            $.unblockUI();
                            fnMsgAlert('info', 'Secondary sales', 'Negative values not allowed.');
                            return false;
                        }
                        else {
                            if ($("#txtFREE_GOODS-" + i).length > 0) {
                                if ($("#txtFREE_GOODS-" + i).val() != null && $("#txtFREE_GOODS-" + i).val() != "") {
                                    freeGoods = parseFloat($("#txtFREE_GOODS-" + i).val());
                                }
                                else {
                                    freeGoods = 0.0;
                                }
                            }
                        }
                    }
                    else {
                        if ($("#txtFREE_GOODS-" + i).length > 0) {
                            if ($("#txtFREE_GOODS-" + i).val() != null && $("#txtFREE_GOODS-" + i).val() != "") {
                                freeGoods = parseFloat($("#txtFREE_GOODS-" + i).val());
                            }
                            else {
                                freeGoods = 0.0;
                            }
                        }
                    }
                }
            }
            else {
                if ($("#txtFREE_GOODS-" + i).length > 0) {
                    if ($("#txtFREE_GOODS-" + i).val() != undefined) {
                        if (fncheckNegative($("#txtFREE_GOODS-" + i).val()) != false) {
                            if ($("#txtFREE_GOODS-" + i).val() != null && $("#txtFREE_GOODS-" + i).val() != "") {
                                freeGoods = parseFloat($("#txtFREE_GOODS-" + i).val());
                            }
                            else {
                                freeGoods = 0.0;
                            }
                        }
                        else {
                            $.unblockUI();
                            fnMsgAlert('info', 'Secondary sales', 'Negative values not allowed.');
                            return false;
                        }
                    }
                }
            }

            if (ps != false) {
                var inputCol = jsonPath(ps, "$.[?(@.Column_Name=='PURCHASE')]");
                {
                    if (inputCol == false) {
                        if ($("#txtPURCHASE-" + i).length > 0) {
                            if (fncheckNegative($("#txtPURCHASE-" + i).val()) == false) {
                                $.unblockUI();
                                fnMsgAlert('info', 'Secondary sales', 'Negative values not allowed.');
                                return false;
                            }
                            else {
                                if ($("#txtPURCHASE-" + i).val() != null && $("#txtPURCHASE-" + i).val() != "") {
                                    purchase = parseFloat($("#txtPURCHASE-" + i).val());
                                }
                                else {
                                    freeGoods = 0.0;
                                }
                            }
                        }
                    }
                    else {
                        if ($("#txtPURCHASE-" + i).length > 0) {
                            if ($("#txtPURCHASE-" + i).val() != null && $("#txtPURCHASE-" + i).val() != "") {
                                purchase = parseFloat($("#txtPURCHASE-" + i).val());
                            }
                            else {
                                purchase = 0.0;
                            }

                        }
                    }
                }
            }
            else {
                if ($("#txtPURCHASE-" + i).val() != undefined) {
                    if (fncheckNegative($("#txtPURCHASE-" + i).val()) != false) {
                        if ($("#txtPURCHASE-" + i).val() != null && $("#txtPURCHASE-" + i).val() != "") {
                            purchase = parseFloat($("#txtPURCHASE-" + i).val());
                        }
                        else {
                            purchase = 0.0;
                        }
                    }
                    else {
                        $.unblockUI();
                        fnMsgAlert('info', 'Secondary sales', 'Negative values not allowed.');
                        return false;
                    }
                }
            }
            if (ps != false) {
                var inputCol = jsonPath(ps, "$.[?(@.Column_Name=='PURCHASE_RETURN')]");
                {
                    if (inputCol == false) {
                        if ($("#txtPURCHASE_RETURN-" + i).length > 0) {
                            if (fncheckNegative($("#txtPURCHASE_RETURN-" + i).val()) == false) {
                                $.unblockUI();
                                fnMsgAlert('info', 'Secondary sales', 'Negative values not allowed.');
                                return false;
                            }
                            else {
                                if ($("#txtPURCHASE_RETURN-" + i).val() != null && $("#txtPURCHASE_RETURN-" + i).val() != "") {
                                    purchaseReturn = parseFloat($("#txtPURCHASE_RETURN-" + i).val());
                                }
                                else {
                                    purchaseReturn = 0.0;
                                }
                            }
                        }
                    }
                    else {
                        if ($("#txtPURCHASE_RETURN-" + i).length > 0) {
                            if ($("#txtPURCHASE_RETURN-" + i).val() != null && $("#txtPURCHASE_RETURN-" + i).val() != "") {
                                purchaseReturn = parseFloat($("#txtPURCHASE_RETURN-" + i).val());
                            }
                            else {
                                purchaseReturn = 0.0;
                            }
                        }
                    }
                }
            }
            else {
                if ($("#txtPURCHASE_RETURN-" + i).length > 0) {
                    if ($("#txtPURCHASE_RETURN-" + i).val() != undefined) {
                        if (fncheckNegative($("#txtPURCHASE_RETURN-" + i).val()) != false) {
                            if ($("#txtPURCHASE_RETURN-" + i).val() != null && $("#txtOPENING_BALANCE-" + i).val() != "") {
                                purchaseReturn = parseFloat($("#txtOPENING_BALANCE-" + i).val());
                            }
                            else {
                                purchaseReturn = 0.0;
                            }
                        }
                        else {
                            $.unblockUI();
                            fnMsgAlert('info', 'Secondary sales', 'Negative values not allowed.');
                            return false;
                        }
                    }
                }
            }

            if (ps != false) {
                var inputCol = jsonPath(ps, "$.[?(@.Column_Name=='SALES')]");
                {
                    if (inputCol == false) {
                        if ($("#txtSALES-" + i).length > 0) {
                            if (fncheckNegative($("#txtSALES-" + i).val()) == false) {
                                $.unblockUI();
                                fnMsgAlert('info', 'Secondary sales', 'Negative values not allowed.');
                                return false;
                            }
                            else {
                                if ($("#txtSALES-" + i).val() != null && $("#txtSALES-" + i).val() != "") {
                                    sales = parseFloat($("#txtSALES-" + i).val());
                                }
                                else {
                                    sales = 0.0;
                                }
                            }
                        }
                    }
                    else {
                        if ($("#txtSALES-" + i).length > 0) {
                            if ($("#txtSALES-" + i).val() != null && $("#txtSALES-" + i).val() != "") {
                                sales = parseFloat($("#txtSALES-" + i).val());
                            }
                            else {
                                sales = 0.0;
                            }
                        }
                    }
                }
            }
            else {
                if ($("#txtSALES-" + i).length > 0) {
                    if ($("#txtSALES-" + i).val() != undefined) {
                        if (fncheckNegative($("#txtSALES-" + i).val()) != false) {
                            if ($("#txtSALES-" + i).val() != null && $("#txtSALES-" + i).val() != "") {
                                sales = parseFloat($("#txtSALES-" + i).val());
                            }
                            else {
                                sales = 0.0;
                            }
                        }
                        else {
                            $.unblockUI();
                            fnMsgAlert('info', 'Secondary sales', 'Negative values not allowed.');
                            return false;
                        }
                    }
                }
            }

            if (ps != false) {
                var inputCol = jsonPath(ps, "$.[?(@.Column_Name=='SALES_RETURN')]");
                {
                    if (inputCol == false) {
                        if ($("#txtSALES_RETURN-" + i).length > 0) {
                            if (fncheckNegative($("#txtSALES_RETURN-" + i).val()) == false) {
                                $.unblockUI();
                                fnMsgAlert('info', 'Secondary sales', 'Negative values not allowed.');
                                return false;
                            }
                            else {
                                if ($("#txtSALES_RETURN-" + i).val() != null && $("#txtSALES_RETURN-" + i).val() != "") {
                                    salesReturn = parseFloat($("#txtSALES_RETURN-" + i).val());
                                }
                                else {
                                    salesReturn = 0.0;
                                }
                            }
                        }
                    }
                    else {
                        if ($("#txtSALES_RETURN-" + i).length > 0) {
                            if ($("#txtSALES_RETURN-" + i).val() != null && $("#txtSALES_RETURN-" + i).val() != "") {
                                salesReturn = parseFloat($("#txtSALES_RETURN-" + i).val());
                            }
                            else {
                                salesReturn = 0.0;
                            }
                        }
                    }
                }
            }
            else {
                if ($("#txtSALES_RETURN-" + i).length > 0) {
                    if ($("#txtSALES_RETURN-" + i).val() != null && $("#txtSALES_RETURN-" + i).val() != "") {
                        salesReturn = parseFloat($("#txtSALES_RETURN-" + i).val());
                    }
                    else {
                        salesReturn = 0.0;
                    }
                }
            }

            if ($("#txtTRANSIT-" + i).length > 0) {
                if ($("#txtTRANSIT-" + i).val() != undefined) {
                    if ($("#txtTRANSIT-" + i).val() != null && $("#txtTRANSIT-" + i).val() != "") {
                        transit = parseFloat($("#txtTRANSIT-" + i).val());
                    }
                    else {
                        transit = 0.0;
                    }
                }
            }

            if (ps != false) {
                var inputCol = jsonPath(ps, "$.[?(@.Column_Name=='CLOSING_BALANCE')]");
                {
                    if (inputCol == false) {
                        if ($("#txtCLOSING_BALANCE-" + i).length > 0) {
                            if (fncheckNegative($("#txtCLOSING_BALANCE-" + i).val()) == false) {
                                $.unblockUI();
                                fnMsgAlert('info', 'Secondary sales', 'Negative values not allowed.');
                                return false;
                            }
                            else {
                                if ($("#txtCLOSING_BALANCE-" + i).val() != null && $("#txtCLOSING_BALANCE-" + i).val() != "") {
                                    closingBalance = parseFloat($("#txtCLOSING_BALANCE-" + i).val());
                                }
                                else {
                                    closingBalance = 0.0;
                                }
                            }
                        }
                    }
                    else {
                        if ($("#txtCLOSING_BALANCE-" + i).length > 0) {
                            if ($("#txtCLOSING_BALANCE-" + i).val() != null && $("#txtCLOSING_BALANCE-" + i).val() != "") {
                                closingBalance = parseFloat($("#txtCLOSING_BALANCE-" + i).val());
                            }
                            else {
                                closingBalance = 0.0;
                            }
                        }
                    }
                }
            }
            else {
                if ($("#txtCLOSING_BALANCE-" + i).length > 0) {
                    if ($("#txtCLOSING_BALANCE-" + i).val() != null && $("#txtCLOSING_BALANCE-" + i).val() != "") {
                        closingBalance = parseFloat($("#txtCLOSING_BALANCE-" + i).val());
                    }
                    else {
                        closingBalance = 0.0;
                    }
                }
            }


            if ($("#txtREMARKS-" + i).val() != undefined) {
                ProductRemarks = $("#txtREMARKS-" + i).val();
            }

            if (productCode.split('_')[1] == "undefined") {
                divisionCode = "NULL";
            }
            else {
                divisionCode = productCode.split('_')[1];
            }

            if ($("#txtPURCHASE_RETURN-" + i).val() != undefined) {
                var purchaseReturnVal = parseInt($("#txtPURCHASE_RETURN-" + i).val());
            }

            if ($("#txtUnitRate_" + i).val() != null && $("#txtUnitRate_" + i).val() != "") {
                unitrate = parseFloat($("#txtUnitRate_" + i).val());
            }
            if ($("#txtOPENING_BALANCE-" + i).val() != null && $("#txtOPENING_BALANCE-" + i).val() != "") {
                openingBalance = parseFloat($("#txtOPENING_BALANCE-" + i).val());
            }
            if ($("#txtFREE_GOODS-" + i).val() != null && $("#txtFREE_GOODS-" + i).val() != "") {
                freeGoods = parseFloat($("#txtFREE_GOODS-" + i).val());
            }
            if ($("#txtPURCHASE-" + i).val() != null && $("#txtPURCHASE-" + i).val() != "") {
                purchase = parseFloat($("#txtPURCHASE-" + i).val());
            }
            if ($("#txtPURCHASE_RETURN-" + i).val() != null && $("#txtPURCHASE_RETURN-" + i).val() != "") {
                purchaseReturn = parseFloat($("#txtPURCHASE_RETURN-" + i).val());
            }
            if ($("#txtSALES-" + i).val() != null && $("#txtSALES-" + i).val() != "") {
                sales = parseFloat($("#txtSALES-" + i).val());
            }
            if ($("#txtSALES_RETURN-" + i).val() != null && $("#txtSALES_RETURN-" + i).val() != "") {
                salesReturn = parseFloat($("#txtSALES_RETURN-" + i).val());
            }
            if ($("#txtTRANSIT-" + i).val() != null && $("#txtTRANSIT-" + i).val() != "") {
                transit = parseFloat($("#txtTRANSIT-" + i).val());
            }
            if ($("#txtCLOSING_BALANCE-" + i).val() != null && $("#txtCLOSING_BALANCE-" + i).val() != "") {
                closingStock = parseFloat($("#txtCLOSING_BALANCE-" + i).val());
            }
            ssformula = "";
            //  ssformula = "OPENING_BALANCE + PURCHASE - PURCHASE_RETURN - SALES + SALES_RETURN +TRANSIT";
            ssformula = ssformulas;
            ssformula = ssformula.replace("PURCHASE_RETURN", "REPPUR");
            ssformula = ssformula.replace("SALES_RETURN", "SRDUM");
            ssformula = ssformula.replace("SALES", "ESSALES");
            ssformula = ssformula.replace("PURCHASE", "DUMPURCHASE");
            ssformula = ssformula.replace("OPENING_BALANCE", "ASOPENING");
            ssformula = ssformula.replace("CLOSING_BALANCE", "CLOSINGDUM");
            ssformula = ssformula.replace("FREE_GOODS", "FREEGOODSDUM");

            ssformula = ssformula.replace(/\s+/g, '');

            if (ssformula.indexOf("ASOPENING") >= 0) {

                if ($("#txtOPENING_BALANCE-" + i).val() != null && $("#txtOPENING_BALANCE-" + i).val() != "") {
                    ssformula = ssformula.replace("ASOPENING", "(parseFloat($('#txtOPENING_BALANCE-" + i + "').val()))");
                }
                else {
                    ssformula = ssformula.replace("ASOPENING", "(parseFloat(0))");
                }
            }

            if (ssformula.indexOf("REPPUR") >= 0) {
                if ($("#txtPURCHASE_RETURN-" + i).val() != null && $("#txtPURCHASE_RETURN-" + i).val() != "") {
                    ssformula = ssformula.replace("REPPUR", "(parseFloat($('#txtPURCHASE_RETURN-" + i + "').val()))");
                }
                else {
                    ssformula = ssformula.replace("REPPUR", "(parseFloat(0))");
                }
            }

            if (ssformula.indexOf("DUMPURCHASE") >= 0) {
                if ($("#txtPURCHASE-" + i).val() != null && $("#txtPURCHASE-" + i).val() != "") {
                    ssformula = ssformula.replace("DUMPURCHASE", "(parseFloat($('#txtPURCHASE-" + i + "').val()))");
                }
                else {
                    ssformula = ssformula.replace("DUMPURCHASE", "(parseFloat(0))");
                }
            }

            if (ssformula.indexOf("SRDUM") >= 0) {
                if ($("#txtSALES_RETURN-" + i).val() != null && $("#txtSALES_RETURN-" + i).val() != "") {
                    ssformula = ssformula.replace("SRDUM", "(parseFloat($('#txtSALES_RETURN-" + i + "').val()))");
                }
                else {
                    ssformula = ssformula.replace("SRDUM", "(parseFloat(0))");
                }
            }

            if (ssformula.indexOf("ESSALES") >= 0) {
                if ($("#txtSALES-" + i).val() != null && $("#txtSALES-" + i).val() != "") {
                    ssformula = ssformula.replace("ESSALES", "(parseFloat($('#txtSALES-" + i + "').val()))");
                }
                else {
                    ssformula = ssformula.replace("ESSALES", "(parseFloat(0))");
                }
            }

            if ($("#txtTRANSIT-" + i).val() != null && $("#txtTRANSIT-" + i).val() != "") {
                ssformula = ssformula.replace("TRANSIT", "parseFloat($('#txtTRANSIT-" + i + "').val())");
            }
            else {
                ssformula = ssformula.replace("TRANSIT", "parseFloat(0)");
            }
            if (ssformula.indexOf("CLOSINGDUM") >= 0) {
                if ($("#txtCLOSING_BALANCE-" + i).val() != null && $("#txtCLOSING_BALANCE-" + i).val() != "") {
                    ssformula = ssformula.replace("CLOSINGDUM", "parseFloat($('#txtCLOSING_BALANCE-" + i + "').val())");
                }
                else {
                    ssformula = ssformula.replace("CLOSINGDUM", "parseFloat(0)");
                }
            }

            if (ssformula.indexOf("-FREEGOODSDUM") >= 0) {
                if (ssformula.indexOf("(parseFloat($('#txtSALES-" + i + "').val()))") >= 0) {
                    if ($("#txtSALES-" + i).val() != null && $("#txtSALES-" + i).val() != "") {
                        ssformula = ssformula.replace("(parseFloat($('#txtSALES-" + i + "').val()))", "((parseFloat($('#txtSALES-" + i + "').val()))+(parseFloat($('#txtFREE_GOODS-" + i + "').val())))");
                        ssformula = ssformula.replace("-FREEGOODSDUM", "");

                    }
                    else {
                        ssformula = ssformula.replace("ESSALES", "(parseFloat($('#txtSALES-" + i + "').val()))+(parseFloat(0))");
                    }
                }
                else if (ssformula.indexOf("parseFloat($('#txtCLOSING_BALANCE-" + i + "').val())") >= 0) {
                    ssformula = ssformula.replace("parseFloat($('#txtCLOSING_BALANCE-" + i + "').val())", "((parseFloat($('#txtCLOSING_BALANCE-" + i + "').val()))+(parseFloat($('#txtFREE_GOODS-" + i + "').val())))");
                    ssformula = ssformula.replace("-FREEGOODSDUM", "");
                }

                else {
                    ssformula = ssformula.replace("-FREEGOODSDUM", "");
                }
            }
            else if (ssformula.indexOf("+FREEGOODSDUM") >= 0) {
                if (ssformula.indexOf("(parseFloat($('#txtSALES-" + i + "').val()))") >= 0) {
                    if ($("#txtSALES-" + i).val() != null && $("#txtSALES-" + i).val() != "") {
                        ssformula = ssformula.replace("(parseFloat($('#txtSALES-" + i + "').val()))", "((parseFloat($('#txtSALES-" + i + "').val()))+(parseFloat($('#txtFREE_GOODS-" + i + "').val())))");
                        ssformula = ssformula.replace("+FREEGOODSDUM", "");

                    }
                    else if (ssformula.indexOf("parseFloat($('#txtCLOSING_BALANCE-" + i + "').val())") >= 0) {
                        ssformula = ssformula.replace("parseFloat($('#txtCLOSING_BALANCE-" + i + "').val())", "((parseFloat($('#txtCLOSING_BALANCE-" + i + "').val()))+(parseFloat($('#txtFREE_GOODS-" + i + "').val())))");
                        ssformula = ssformula.replace("-FREEGOODSDUM", "");
                    }
                    else {
                        ssformula = ssformula.replace("ESSALES", "(parseFloat($('#txtSALES-" + i + "').val()))+(parseFloat(0))");
                    }

                }
                else {
                    ssformula = ssformula.replace("+FREEGOODSDUM", "");
                }
            }

            if (ssformulas != "") {
                total = parseFloat(eval(ssformula)).toFixed(2);
            }
            else {
                total = 0;
            }

            // Calculation 
            amountCalc = 0.0;

            if (compute.toUpperCase() == "CLOSING_BALANCE") {

                $("#txtCLOSING_BALANCE-" + i).val(0);
                if (total != "") {
                    if (total >= 0) {
                        $("#txtCLOSING_BALANCE-" + i).val(total)
                    }
                }
            }

            if (compute.toUpperCase() == "SALES") {
                $("#txtSALES-" + i).val(0);
                if (total >= 0) {

                    $("#txtSALES-" + i).val(total)
                }
                else {
                    $("#txtSALES-" + i).val(total);
                    $.unblockUI();
                    fnMsgAlert('info', 'Info', 'Negative numbers are not allowed.');
                    return false;
                }
            }

            var closingBalanceVal = 0;
            if ($("#txtAmountCLOSING_BALANCE-" + i) != null) {

                if ($("#txtCLOSING_BALANCE-" + i).val() != null && $("#txtCLOSING_BALANCE-" + i).val() != "") {
                    closingBalanceVal = $("#txtCLOSING_BALANCE-" + i).val();
                }

                amountCalc = (unitrate * closingBalanceVal);
                amountCalc = parseFloat(amountCalc).toFixed(2);
                $("#txtAmountCLOSING_BALANCE-" + i).val(amountCalc);
            }


            //  var totalsaleamount = 0.0;
            if ($("#txtAmountSALES-" + i) != null) {


                amountCalc = (unitrate * sales);
                //  totalsaleamount += amountCalc;
                amountCalc = parseFloat(amountCalc).toFixed(2);
                $("#txtAmountSALES-" + i).val(amountCalc);

            }


            var C_OB = 0;
            var C_PUR = 0;
            var C_PUR_RET = 0;
            var C_SALES = 0;
            var C_SAL_RET = 0;
            var C_CB = 0;
            var C_TRANSIT = 0;
            var C_FREE = 0;
            // Get the values for calcluation. Please use the following order for getting the values.
            C_OB = fnGetOBValueForCalc(i);

            if (!C_OB && C_OB != 0) {
                return false;
            }

            C_PUR_RET = fnGetPurchaseReturnValueForCalc(i);
            if (!C_PUR_RET && C_PUR_RET != 0) {
                return false;
            }
            C_FREE = fnGetFGValueForCalc(i);
            if (!C_FREE && C_FREE != 0) {
                return false;
            }

            C_SAL_RET = fnGetSalesReturnValueForCalc(i);
            if (!C_SAL_RET && C_SAL_RET != 0) {
                return false;
            }

            C_PUR = fnGetPurchaseValueForCalc(i);
            if (!C_PUR && C_PUR != 0) {
                return false;
            }

            C_SALES = fnGetSalesValueForCalc(i);
            if (!C_SALES && C_SALES != 0) {
                return false;
            }
            C_CB = fnGetClosingBalValueForCalc(i);
            if (!C_CB && C_CB != 0) {
                return false;
            }

            C_TRANSIT = fnGetTransitValueForCalc(i);
            if (!C_TRANSIT && C_TRANSIT != 0) {
                return false;
            }


            // Closing Balance Verify.
            var SalesValue = fnGetSalesValue(i);
            var ClosingBlanceValue = fnGetClosingBalanceValue(i);

            if (ssformulas.indexOf("+TRANSIT") > -1) {
                var calculateClosingBalance = ((parseFloat(C_OB) + (parseFloat(C_PUR) - parseFloat(C_PUR_RET)) + parseFloat(C_SAL_RET)) + parseFloat(C_TRANSIT))
                                                - (parseFloat(SalesValue) + parseFloat(C_FREE));
            }
            else {
                var calculateClosingBalance = ((parseFloat(C_OB) + (parseFloat(C_PUR) - parseFloat(C_PUR_RET)) + parseFloat(C_SAL_RET)) - parseFloat(C_TRANSIT))
                                             - (parseFloat(SalesValue) + parseFloat(C_FREE));
            }


            if (parseFloat(ClosingBlanceValue).toFixed(2) != parseFloat(calculateClosingBalance).toFixed(2)) {
                $.unblockUI();
                fnMsgAlert('info', 'Info', 'There is a computation error in the product - <b>' + $("#txtProductName_" + i).val() + "</b>");
                return false;
            }

            // Sales Calculation Verify.
            if (ssformulas.indexOf("+TRANSIT") > -1) {
                var calculateSales = ((parseFloat(C_OB) + (parseFloat(C_PUR) - parseFloat(C_PUR_RET)) + parseFloat(C_SAL_RET)) + parseFloat(C_TRANSIT)) -
                                        (parseFloat(ClosingBlanceValue));
            }
            else {
                var calculateSales = ((parseFloat(C_OB) + (parseFloat(C_PUR) - parseFloat(C_PUR_RET)) + parseFloat(C_SAL_RET)) - parseFloat(C_TRANSIT))
                                     - (parseFloat(ClosingBlanceValue));
            }

            if (parseFloat(calculateSales).toFixed(2) != parseFloat(SalesValue + C_FREE).toFixed(2)) {
                $.unblockUI();
                fnMsgAlert('info', 'Info', 'There is a computation error in the product  - <b> ' + $("#txtProductName_" + i).val() + "</b>");
                return false;
            }

            // clsStock = clsStock - clsStockVal;
            fncalTotal();

            if (($("#txtOPENING_BALANCE-" + i).val() != undefined)) {
                if (($("#txtOPENING_BALANCE-" + i).val() != null) && ($("#txtOPENING_BALANCE-" + i).val() !== "")) {
                    openingBalance = $("#txtOPENING_BALANCE-" + i).val();
                }
            }
            else {
                openingBalance = 0;
            }

            if (($("#txtFREE_GOODS-" + i).val() != undefined)) {
                if (($("#txtFREE_GOODS-" + i).val() != null) && ($("#txtFREE_GOODS-" + i).val() !== "")) {
                    freeGoods = $("#txtFREE_GOODS-" + i).val();
                }
            }
            else {
                freeGoods = 0;
            }
            if (($("#txtPURCHASE-" + i).val() != undefined)) {
                if (($("#txtPURCHASE_RETURN-" + i).val() != null) && ($("#txtPURCHASE_RETURN-" + i).val() != "")) {
                    purchase = $("#txtPURCHASE-" + i).val();
                }
            }
            else {
                purchase = 0;
            }
            if (($("#txtPURCHASE_RETURN-" + i).val() != undefined)) {
                if (($("#txtPURCHASE_RETURN-" + i).val() != null) && ($("#txtPURCHASE_RETURN-" + i).val() != "")) {
                    purchaseReturn = $("#txtPURCHASE_RETURN-" + i).val();
                }
            }
            else {
                purchaseReturn = 0;
            }
            if (($("#txtSALES-" + i).val() != undefined)) {
                if (($("#txtSALES-" + i).val() != null) && ($("#txtSALES-" + i).val() != "")) {
                    sales = $("#txtSALES-" + i).val();
                }
            }
            else {
                sales = 0.00;
            }
            if (($("#txtSALES_RETURN-" + i).val() != undefined)) {
                if (($("#txtSALES_RETURN-" + i).val() != null) && ($("#txtSALES_RETURN-" + i).val() != "")) {
                    salesReturn = $("#txtSALES_RETURN-" + i).val();
                }
            }
            else {
                salesReturn = 0;
            }
            if (($("#txtCLOSING_BALANCE-" + i).val() != undefined)) {
                if (($("#txtCLOSING_BALANCE-" + i).val() != null) && ($("#txtCLOSING_BALANCE-" + i).val() != "")) {
                    closingBalance = $("#txtCLOSING_BALANCE-" + i).val();
                }
            }
            else {
                closingBalance = 0;
            }
            if (($("#txtTRANSIT-" + i).val() != undefined)) {
                if (($("#txtTRANSIT-" + i).val() != null) && ($("#txtTRANSIT-" + i).val() != "")) {
                    transit = $("#txtTRANSIT-" + i).val();
                }
                else {
                    transit = 0;
                }
            }
            if (($("#txtUnitRate_" + i).val() != undefined)) {
                if (($("#txtUnitRate_" + i).val() != null) && ($("#txtUnitRate_" + i).val() != "")) {
                    unitrate = $("#txtUnitRate_" + i).val();
                }
            }
            else {
                unitrate = 0;
            }

            secondaryDetails += divisionCode + "^" + productCode.split('_')[0] + "^" + parseFloat(openingBalance).toFixed(2) + "^" + purchase + "^"
                            + purchaseReturn + "^" + sales + "^" + salesReturn + "^" + closingBalance + "^" + transit + "^"
                            + freeGoods + "^" + unitrate + "^" + ProductRemarks + "^" + hdnOpeningBalance + "^" + hdnIs_Manually_Edited + "~";

            var obj = {};
            obj.Division_Code = divisionCode;
            obj.Product_Code = productCode.split('_')[0];
            obj.Opening_Balance = parseFloat(openingBalance).toFixed(2);
            obj.Purchase = purchase;
            obj.Purchase_Return = purchaseReturn;
            obj.Sales = sales;
            obj.Sales_Return = salesReturn;
            obj.Closing_Balance = closingBalance;
            obj.Transit = transit;
            obj.Free_Goods = freeGoods;
            obj.Unit_Rate = unitrate;
            obj.Product_Remarks = ProductRemarks;
            obj.OldOpening_Balance = hdnOpeningBalance;
            obj.Is_Manually_Edited = hdnIs_Manually_Edited;

            SalesArr.push(obj);
        }
    }
    // }

    debugger
    //  if (draftval == '1') {
    if (val == 1) {
        if (!confirm('The data now saved will go into Applied/Approved Mode and cannot be edited later for any changes.If you wish to edit it for any changes after saving,please click the Draft button and save in Draft Mode.Else if you wish to submit to Applied/Approved Mode directly, continue to click OK.')) {
            $.unblockUI();
            SalesArr = [];
            return false;
        }
       
    }
    debugger;

    monthVal = $('#drpMonth').val();
    yearVal = $('#drpYear').val();
    SSProductBringType = jsonPath(userPrivilegeContainer_g[0], "$.Data[?(@.PrivilegeName=='SECONDARY_SALES_PRODUCTS_BRING_TYPE')]");
    if (SSProductBringType != false) {
        SSProductBringType = SSProductBringType[0].PrivilegeValue;
        SSProductBringType = SSProductBringType.replace(',', '^');
        if (SSProductBringType != "") {
            SSProductBringType = SSProductBringType + "^";
        }
    }

    //$.ajax({
    //    type: 'POST',
    //    url: '../HiDoctor_Activity/SecondarySales/GetSecProductAutoFill ',
    //    data: 'userCode=' + selectedUserCode + '&ProductTypeCode=' + SSProductBringType + '&regionCode=' + regionCode + '&entryMode=' + ssEntryMode + '&stockiestCode=' + $('#hdnStockiestCode').val(),
    //    success: function (response) {
    //        debugger;
    //        productAutofill_ProductCheck = response.Data;
    //    }
    //});

    fnCheckPreviousStockSales(savemode);
    debugger;
    //var secstrng = [];
    //secstrng = secondaryDetails.split('~');
    //var appliedProductArray = new Array();
    //for (var i = 0; i < secstrng.length - 1; i++) {
    //    appliedProductArray.push(secstrng[i].split('^')[1]);
    //}
    //var pr = new Array()
    //for (var i = 0; i < PSDetails.length; i++) {
    //    pr.push(PSDetails[i].Product_Code);
    //}
    //pr = pr.unique();
    //var prodArray = [];
    //for (var i = 0; i < pr.length; i++) {
    //    if ($.inArray(pr[i], appliedProductArray) == -1) {
    //        prodArray.push(pr[i]);
    //    }
    //}
    //var prodNames = [];
    //for (var i = 0; i < prodArray.length; i++) {
    //    var prjson = jsonPath(productAutofill_ProductCheck[0], "$.[?(@.productCode=='" + prodArray[i] + "')]");
    //    if (prjson != false) {
    //        prodNames.push(prjson[0].Product_Name);
    //    }
    //}
    //var alerthtml = ""
    //if (prodNames.length > 0) {
    //    alerthtml += "<h3 style='margin-top: 35px;'>You have missed to enter some product(s) which are entered in primary sales. Kindly enter secondary sales for the all products which are entered in primary sales. \nThe below mentioned products are missing in secondary sales.</h3><br/>";
    //    for (var p = 0; p < prodNames.length; p++) {
    //        alerthtml += (p + 1) + ". " + prodNames[p] + "<br/>";
    //    }
    //    $('#dvalert').show()
    //    $('#dvDetails').html(alerthtml);
    //    $("#dvalert").overlay().load();
    //    return false;
    //}
    //if (ssEntryProductCheck != "" || ssEntryProductCheck != null || ssEntryProductCheck != undefined) {
    //    if (ssEntryProductCheck == "YES") {
    //        $.ajax({
    //            type: 'POST',
    //            url: '../HiDoctor_Activity/SecondarySales/GetSecProductAutoFill ',
    //            data: 'userCode=' + selectedUserCode + '&ProductTypeCode=' + SSProductBringType + '&regionCode=' + regionCode + '&entryMode=' + ssEntryMode + '&stockiestCode=' + $('#hdnStockiestCode').val(),
    //            success: function (response) {
    //                debugger;
    //                productAutofill_ProductCheck = response.Data;
    //            }
    //        });
    //        $.ajax({
    //            type: 'POST',
    //            url: '../HiDoctor_Activity/SecondarySales/GetClosingBalanceGreaterThanZero',
    //            data: '&productAutofill=' + escape(JSON.stringify(productAutofill_g[0].Data)) + '&productPrice=' + escape(JSON.stringify(productPrice_g[0].Data)) + '&openingBalances=' + escape(JSON.stringify(productAutofill_ProductCheck[4].Data)) + '&year=' + yearVal + '&month=' + monthVal + '&StockiestCode=' + $('#hdnStockiestCode').val() + '&priceType=' + escape(JSON.stringify(productPrice_g[1].Data)) + '&regionCode=' + regionCode,
    //            success: function (response) {
    //                debugger;
    //                var res = eval(response);
    //                for (var i = 0; i < res.length; i++) {
    //                    productarray.push(res[i].Product_Code);
    //                }
    //            }
    //        });
    //        var openig = [];
    //        var preSSMonth = month;
    //        var previousmonth = "";
    //        previousmonth = month - 1;
    //        if (preSSMonth == "1") {
    //            previousmonth = "12";
    //        }
    //        openig = jsonPath(productAutofill_g[4].Data, "$.[?(@.Opening_Balance > 0  & @.Month=='" + previousmonth + "')]");
    //        debugger;
    //        for (var i = 0; i < productarray.length; i++) {
    //            if ($.inArray(productarray[i], appliedProductArray) == -1) {
    //                fnMsgAlert('info', 'Secondary Sales', 'You have not selected all products which are having closing balance for the last month');
    //                return false;
    //            }
    //        }
    //    }
    //}
    //fnCreateSecandryTable(selectedUserCode, regionCode);
    //draftval = '1';
    //$('#txtStatmentDate').attr('disabled', false);
    //$('#txtStockiestName').attr('disabled', false);
    //$('#txtStatmentDate').val('');
    //if (ssEntryMode.toUpperCase() == "STOCKIEST") {
    //    $("#txtStockiestName").val('');

    //}
    //$('#SecondarySalesDetails').hide();
    //$('#productopoupLink').hide();
    //$("#divInput").hide();
}

//Returns the unique records in the array
Array.prototype.unique = function () {
    var unique = [];
    for (var i = 0; i < this.length; i++) {
        if (unique.indexOf(this[i]) == -1) {
            unique.push(this[i]);
        }
    }
    return unique;
};
function fnClose() {
    $('#dvalert').hide();
    return false;
}
// Details Showing popup
function fnDetails(id) {
    debugger;
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/SecondarySales/GetSecSelectedDetails',
        data: 'userCodeDetails=' + id,
        success: function (response) {
            jsData = eval('(' + response + ')');
            if (jsData.Tables[0].Rows.length > 0) {
                debugger;

                var tableContent = "";
                tableContent += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblPopUp' >";
                tableContent += "<thead><tr>";
                tableContent += "<th>Product Name</th>";
                tableContent += "<th>Price per Unit</th>";
                tableContent += "<th>Opening Balance</th>";
                tableContent += " <th>Purchase</th>";
                tableContent += " <th>Purchase Return</th>";
                tableContent += " <th>Sales</th>";
                tableContent += " <th>Sales Amount</th>";
                tableContent += " <th>Sales Return</th>";
                tableContent += " <th>Closing Balance</th>";
                tableContent += " <th>Closing Amount</th>";
                tableContent += " <th>Transit</th>";
                tableContent += " <th> Free Goods</th>";
                tableContent += " <th> Remarks</th>";

                tableContent += "</tr></thead>";
                var totalSale = 0.0;
                var ClosingBalance = 0.0;
                var saleamount = 0.0;
                var totalsaleamount = 0.0;
                var closingAmount = 0.0;
                var totalclosingstock = 0.0;
                for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {

                    tableContent += "<tr>";
                    tableContent += "<td align='right' width='15%'>" + jsData.Tables[0].Rows[i].Product_Name + "</td>";
                    tableContent += "<td align='center' width='15%'>" + jsData.Tables[0].Rows[i].Price_per_Unit + "</td>";
                    tableContent += "<td align='center' width='15%'>" + jsData.Tables[0].Rows[i].Opening_Stock + "</td>";
                    tableContent += "<td align='center' width='15%'>" + jsData.Tables[0].Rows[i].Purchase + "</td>";
                    tableContent += "<td align='center' width='15%'>" + jsData.Tables[0].Rows[i].Purchase_Return + "</td>";
                    tableContent += "<td align='center' width='15%'>" + jsData.Tables[0].Rows[i].Sales + "</td>";
                    saleamount = (parseFloat(jsData.Tables[0].Rows[i].Price_per_Unit) * parseFloat(jsData.Tables[0].Rows[i].Sales))
                    tableContent += "<td align='center' width='15%'>" + saleamount.toFixed(2) + "</td>";
                    tableContent += "<td align='center' width='15%'>" + jsData.Tables[0].Rows[i].Sales_Return + "</td>";
                    tableContent += "<td align='center' width='15%'>" + jsData.Tables[0].Rows[i].Closing_Stock + "</td>";
                    closingAmount = (parseFloat(jsData.Tables[0].Rows[i].Price_per_Unit) * parseFloat(jsData.Tables[0].Rows[i].Closing_Stock))
                    tableContent += "<td align='center' width='15%'>" + closingAmount.toFixed(2) + "</td>";
                    tableContent += "<td align='center' width='15%'>" + jsData.Tables[0].Rows[i].Transit + "</td>";
                    tableContent += "<td align='center' width='15%'>" + jsData.Tables[0].Rows[i].Free_Goods + "</td>";
                    tableContent += "<td align='center' width='15%'>" + jsData.Tables[0].Rows[i].Remarks + "</td>";

                    tableContent += "</tr>";
                    totalSale += parseFloat(jsData.Tables[0].Rows[i].Sales);
                    ClosingBalance += parseFloat(jsData.Tables[0].Rows[i].Closing_Stock);
                    totalsaleamount += saleamount
                    totalclosingstock += closingAmount
                }
                tableContent += "<tr>";
                tableContent += "<td align='right' width='15%' style='font-weight:bold'>Total</td>";
                tableContent += "<td align='center' width='15%'></td>";
                tableContent += "<td align='center' width='15%'></td>";
                tableContent += "<td align='center' width='15%'></td>";
                tableContent += "<td align='center' width='15%'></td>";
                tableContent += "<td align='center' width='15%' style='font-weight:bold'>" + totalSale + "</td>";
                tableContent += "<td align='center' width='15%' style='font-weight:bold'>" + totalsaleamount.toFixed(2) + "</td>";
                tableContent += "<td align='center' width='15%'></td>";
                tableContent += "<td align='center' width='15%' style='font-weight:bold'>" + ClosingBalance + "</td>";
                tableContent += "<td align='center' width='15%' style='font-weight:bold'>" + totalclosingstock.toFixed(2) + "</td>";
                tableContent += "<td align='center' width='15%'></td>";
                tableContent += "<td align='center' width='15%'></td>";
                tableContent += "</tr>";
                tableContent += "</table>";
                $("#divModel").html(tableContent);
                ShowModalPopup('modal');
            }
        }
    });

}

function fnFillEdit(id) {
    if (id.split('_')[5].toUpperCase() == "APPLIED") {
        fnMsgAlert('info', 'Secondary Sales', 'Applied Secondary Sales records cannot be edited.');
        return false;
    }
    else if (id.split('_')[5].toUpperCase() == "APPROVED") {
        fnMsgAlert('info', 'Secondary Sales', 'Approved Secondary Sales records cannot be edited..');
        return false;
    }
    var ss_Code = id.split('_')[3];
    var month = id.split('_')[1];
    var year = id.split('_')[2];

    ShowModalPopup("dvloading");
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/SecondarySales/CheckPreMonthSSData',
        data: 'SS_Code=' + ss_Code + "&month=" + month + "&year=" + year,
        success: function (response) {
            if (response != null && response == "0") {
                fnEdit(id);
            }
            else {
                fnMsgAlert("info", "Secondary Sales", "Kindly get the secondary sales approved for the previous month");
                HideModalPopup("dvloading");
                return false;
            }
        },
        error: function (e) {
            fnMsgAlert("info", "Secondary Sales", "There is an error for Edit Record.");
            HideModalPopup("dvloading");
            return false;
        }
    });
} //need to add alert

function fnProductRemarksValidation(value) {
    debugger;
    var allowCharacterinDCR = "-_.,()";
    if ("$(#txt" + value + ")" != '') {
        debugger;
        var res = DCRAllowedSpecialCharacters.CheckDCRSpecialCharacterGroup2(value);
        if (!res) {
            HideModalPopup('dvLoading');
            fnMsgAlert('info', 'Information', 'The following characters are only allowed in Product Remarks ' + allowCharacterinDCR + ' .');
            fnErrorIndicator(value);
            return false;
        }
    }
}

// Edit Method
function fnEdit(id) {
    debugger;
    try {
        validateCustomerCode = "";

        $('#drpMonth').attr("disabled", true);
        $('#drpYear').attr('disabled', true);
        //$('#txtStatmentDate').attr('disabled', true);
        $('#txtStockiestName').attr('disabled', true);
        //if (ssEntryMode.toUpperCase() == "STOCKIEST") {
        //    $("#txtStockiestName").removeAttr('readonly');
        //}


        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Activity/SecondarySales/GetSecEditDetails',
            data: 'userCodeDetails=' + id + '&entryMode=' + ssEntryMode,
            success: function (response) {
                jsData = eval('(' + response + ')');
                debugger;
                if (jsData.Tables[0].Rows.length > 0) {
                    if (jsData != "" && jsData != null) {
                        $('#unapprovedRemarks').html("UNAPPROVAL REMARKS: " + jsData.Tables[0].Rows[0].Remarks)
                        debugger;
                        if (productPrice_g == "") {
                            var monthVal = jsData.Tables[0].Rows[0].Month;
                            var edityear = jsData.Tables[0].Rows[0].Year;
                            //   var editcustomerCode = $("#hdnStockiestCode").val();
                            if (ssEntryMode.toUpperCase() == "STOCKIEST") {
                                $('#hdnStockiestCode').val($.trim(jsData.Tables[0].Rows[0].Customer_Code));
                                var editcustomerCode = $('#hdnStockiestCode').val();
                                validateCustomerCode = $('#hdnStockiestCode').val();
                                //  $('#txtStockiestName').val($.trim(jsData.Tables[0].Rows[0].Customer_Name));
                            }
                            $('#drpMonth').val(monthVal);
                            $('#drpYear').val(jsData.Tables[0].Rows[0].Year);
                        }
                    }
                }

                rowNumber = 0;
                $('#SecondarySalesDetails').html('');
                if (jsData.Tables[0].Rows.length > 0) {

                    var monthVal = jsData.Tables[0].Rows[0].Month;
                    if (ssEntryMode.toUpperCase() == "STOCKIEST") {
                        $('#hdnStockiestCode').val($.trim(jsData.Tables[0].Rows[0].Customer_Code));
                        $('#txtStockiestName').val($.trim(jsData.Tables[0].Rows[0].Customer_Name));
                    }

                    $('#drpMonth').val(monthVal);
                    $('#drpYear').val(jsData.Tables[0].Rows[0].Year);
                    $('#txtStatmentDate').val(jsData.Tables[0].Rows[0].SS_Statement_Date);
                    $('#hdnStatus').val('EDIT_' + jsData.Tables[0].Rows[0].SS_Code);
                    fnProductWisePriceForEdit();
                    debugger;
                    var rCntSSales = $("#tblSecondarySales tr").length;
                    var tableContent = "";
                    var unitPricePerproduct = 0;
                    var salesAmount = 0;

                    debugger;

                    var input = [];
                    var inputvalues = {
                        Month: $('#drpMonth').val(),
                        Year: $('#drpYear').val(),
                        Region_Code: regionCode
                    }
                    input.push(inputvalues);
                    if (input.length > 0) {
                        input = JSON.stringify({ 'lstPS_input': input });
                    }
                    debugger;
                    fnCheckIsPSPrefill(input);
                    if (checkIsPSPrefill == '1') {
                        fnPSDetailsToPrefill();
                    }
                    debugger;
                    // START: CUSTOMER.
                    if (ssEntryMode.toUpperCase() == "CUSTOMER") {

                        if (jsData.Tables[0].Rows[0].Customer_Code != null) {
                            $('#hdnStockiestCode').val($.trim(jsData.Tables[0].Rows[0].Stockiest_Code));
                            $('#txtStockiestName').val($.trim(jsData.Tables[0].Rows[0].Stockiest_Name));
                        }
                        else {
                            $('#hdnStockiestCode').val('');
                            $('#txtStockiestName').val('');
                        }
                        tableCount = "1";
                        tableContent += "<table cellspacing='0' cellpadding='0' id='tblSecondarySales' width='100%' class='data display datatable' >";
                        tableContent += "<tr><td align='left' style='font-size: 15px;'><label style='margin-right:55px'>Customer Name</label><label>  </label> <input type='text' id='txtCustomerName_1_1'  value='" + jsData.Tables[0].Rows[0].Customer_Name + "'  class='autoCustomers'  style='width:200px' /><input type='hidden' id='hdnCustomerCode_1_1' value='" + jsData.Tables[0].Rows[0].Customer_Code + "' />";
                        tableContent += "</td></tr>";
                        tableContent += "<tr><td>";
                        tableContent += "<table id='tblSubSec_1_1'>";
                        tableContent += "<thead>";
                        tableContent += "<tr><th  style='width:15%'>PRODUCT NAME</th>";
                        tableContent += "<th   style='width:9%;'>UNIT RATE</th>";
                        for (var i = 0; i < inputColumnArr.length; i++) {

                            if (inputColumnArr[i].toUpperCase() == "CLOSING_BALANCE") {
                                tableContent += "<th class='numericth' style='width:9%;'>" + inputColumnArr[i].replace('_', ' ') + "</th>";
                                tableContent += "<th class='numericth' style='width:9%;'>" + inputColumnArr[i].replace('_', ' ') + " AMOUNT</th>";
                            }
                            else if (inputColumnArr[i].toUpperCase() == "SALES") {
                                tableContent += "<th class='numericth' style='width:9%;'>" + inputColumnArr[i].replace('_', ' ') + "</th>";
                                tableContent += "<th class='numericth' style='width:9%;'>" + inputColumnArr[i].replace('_', ' ') + " AMOUNT</th>";
                            }
                            else if (inputColumnArr[i].toUpperCase() == "REMARKS") {
                                tableContent += "<th style='width:9%;'>" + inputColumnArr[i].replace('_', ' ') + "</th>";
                            }
                            else {
                                tableContent += "<th class='numericth' style='width:9%;'>" + inputColumnArr[i].replace('_', ' ') + "</th>";
                            }


                        }
                        tableContent += "</tr>";
                        tableContent += "</thead>";
                        tableContent += "<tbody>";
                        for (var i = 1; i <= jsData.Tables[0].Rows.length; i++) {


                            unitPricePerproduct = parseFloat(jsData.Tables[0].Rows[i - 1].Price_per_Unit);
                            if (productPrice_g[1].Data.length > 0) {
                                productPrice = jsonPath(productPrice_g[0], "$.Data[?(@.Product_Code=='" + jsData.Tables[0].Rows[i - 1].Product_Code + "' )]");
                                if (productPrice != false && productPrice.length > 0) {
                                    if (productPrice_g[1].Data[0].Price_Type == "PTS") {
                                        price = productPrice[0].PTS;
                                    }
                                    else if (productPrice_g[1].Data[0].Price_Type == "INVOICE_AMOUNT") {
                                        price = productPrice[0].INVOICE_AMOUNT;
                                    }
                                    else if (productPrice_g[1].Data[0].Price_Type == "PTR_WOTAX") {
                                        price = productPrice[0].PTR_WOTAX;
                                    }
                                    else if (productPrice_g[1].Data[0].Price_Type == "MRP") {
                                        price = productPrice[0].MRP;
                                    }
                                    else if (productPrice_g[1].Data[0].Price_Type == "NRV") {
                                        price = productPrice[0].NRV;
                                    }
                                }
                            }
                            //srisudhan

                            unitPricePerproduct = parseFloat(jsData.Tables[0].Rows[i - 1].Price_per_Unit);
                            tableContent += "<tr>";
                            tableContent += "<td><input type='text' id='txtProductName_1_" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Product_Name + "'  class='autoProducts' ondblclick='fnCreateNewRowInCustomerProduct(this);'  onkeyup= 'fnCreateNewRowInCustomerProduct(this);' style='width:200px' /><input type='hidden' id='hdnProductCode_1_" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Product_Code + "_" + jsData.Tables[0].Rows[i - 1].Division_Code + "' /></td>";
                            if (priceEdit.toUpperCase() == "NO") {
                                if (jsData.Tables[0].Rows[i - 1].Price_per_Unit != price) {
                                    tableContent += "<td><input type='text' id='txtUnitRate_1_" + i + "' title='old price for this product was " + jsData.Tables[0].Rows[i - 1].Price_per_Unit + "'  value='" + price + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;background-color:yellow' readonly='readonly' /></td>";
                                }
                                else {
                                    tableContent += "<td><input type='text' id='txtUnitRate_1_" + i + "'  value='" + price + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;' readonly='readonly' /></td>";
                                }
                            }
                            else {
                                if (jsData.Tables[0].Rows[i - 1].Price_per_Unit != price) {
                                    tableContent += "<td><input type='text' title='old price for this product was " + jsData.Tables[0].Rows[i - 1].Price_per_Unit + "' id='txtUnitRate_1_" + i + "'  value='" + jsData.Tables[0].Rows[i - 1].Price_per_Unit + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;background-color:yellow' /></td>";
                                }
                                else {
                                    tableContent += "<td><input type='text' id='txtUnitRate_1_" + i + "'  value='" + price + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;' /></td>";
                                }
                            }
                            for (var j = 0; j < inputColumnArr.length; j++) {
                                debugger;
                                if (inputColumnArr[j].toUpperCase() == "FREE_GOODS") {
                                    if (inputColumnArr[j].toUpperCase() == compute.toUpperCase()) {
                                        if (editMode.toUpperCase() == "NO") {
                                            debugger;
                                            tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-1_" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Free_Goods + "'  class='checknumeric txtReadonly' onclick= '$(this).select();' style='width:70px; ' readonly='readonly' /></td>";
                                        }
                                        else {
                                            tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-1_" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Free_Goods + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'/></td>";
                                        }
                                    }
                                    else {
                                        tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-1_" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Free_Goods + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'/></td>";
                                    }
                                }
                                else if (inputColumnArr[j].toUpperCase() == "OPENING_BALANCE") {
                                    if (editMode.toUpperCase() == "NO") {
                                        tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-1_" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Opening_Stock + "'  class='checknumeric txtReadonly' onclick= '$(this).select();' style='width:70px;' readonly='readonly' /></td>";
                                    }
                                    else if (inputColumnArr[j].toUpperCase() == "REMARKS") {
                                        tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "' value='" + jsData.Tables[0].Rows[i - 1].ProductRemarks + "'  onclick= '$(this).select();' style='width:90px;' class='CheckProductRemark'/></td>";
                                    }
                                    else {
                                        tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-1_" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Opening_Stock + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'/></td>";
                                    }
                                }
                                else if (inputColumnArr[j].toUpperCase() == "PURCHASE") {
                                    tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-1_" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Purchase + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'/></td>";
                                }
                                else if (inputColumnArr[j].toUpperCase() == "PURCHASE_RETURN") {
                                    tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-1_" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Purchase_Return + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'/></td>";
                                }
                                else if (inputColumnArr[j].toUpperCase() == "SALES") {

                                    salesAmount = parseFloat(jsData.Tables[0].Rows[i - 1].Sales);

                                    if (inputColumnArr[j].toUpperCase() == compute.toUpperCase()) {
                                        if (editMode.toUpperCase() == "NO") {
                                            tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-1_" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Sales + "' class='checknumeric txtReadonly'  style='width:70px;' readonly='readonly' /></td>";
                                        }
                                        else if (inputColumnArr[j].toUpperCase() == "REMARKS") {
                                            tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "' value='" + jsData.Tables[0].Rows[i - 1].ProductRemarks + "'  onclick= '$(this).select();' style='width:90px;' class='CheckProductRemark'/></td>";
                                        }
                                        else {
                                            tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-1_" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Sales + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'/></td>";
                                        }
                                    }
                                    else if (inputColumnArr[j].toUpperCase() == "REMARKS") {
                                        tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "' value='" + jsData.Tables[0].Rows[i - 1].ProductRemarks + "'  onclick= '$(this).select();' style='width:90px;' class='CheckProductRemark'/></td>";
                                    }
                                    else {
                                        tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-1_" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Sales + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'/></td>";
                                    }

                                    tableContent += "<td><input type='text' id='txtAmount" + inputColumnArr[j] + "-1_" + i + "' value='" + unitPricePerproduct * salesAmount + "'  class='checknumeric' onclick= '$(this).select();' readonly='readonly' style='width:70px;'/></td>";
                                }
                                else if (inputColumnArr[j].toUpperCase() == "SALES_RETURN") {
                                    tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-1_" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Sales_Return + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'/></td>";
                                }
                                else if (inputColumnArr[j].toUpperCase() == "TRANSIT") {
                                    if (inputColumnArr[j].toUpperCase() == compute.toUpperCase()) {
                                        if (editMode.toUpperCase() == "NO") {
                                            tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-1_" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Transit + "'  class='checknumeric txtReadonly' onclick= '$(this).select();' style='width:70px; ' readonly='readonly' /></td>";
                                        }
                                        else if (inputColumnArr[j].toUpperCase() == "REMARKS") {
                                            tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "' value='" + jsData.Tables[0].Rows[i - 1].ProductRemarks + "'  onclick= '$(this).select();' style='width:90px;' class='CheckProductRemark'/></td>";
                                        }
                                        else {
                                            tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-1_" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Transit + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'/></td>";
                                        }
                                    }
                                    else {
                                        tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-1_" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Transit + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'/></td>";
                                    }
                                }

                                else if (inputColumnArr[j].toUpperCase() == "CLOSING_BALANCE") {
                                    if (inputColumnArr[j].toUpperCase() == compute.toUpperCase()) {

                                        salesAmount = parseFloat(jsData.Tables[0].Rows[i - 1].Closing_Stock);

                                        if (editMode.toUpperCase() == "NO") {
                                            tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-1_" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Closing_Stock + "' class='checknumeric txtReadonly'  style='width:70px;' readonly='readonly' /></td>";
                                        }
                                        else {
                                            tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-1_" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Closing_Stock + "'  class='checknumeric' onclick= '$(this).select();'  style='width:70px;'/></td>";
                                        }
                                    }
                                    else if (inputColumnArr[j].toUpperCase() == "REMARKS") {
                                        tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "' value='" + jsData.Tables[0].Rows[i - 1].ProductRemarks + "'  onclick= '$(this).select();' style='width:90px;' class='CheckProductRemark'/></td>";
                                    }
                                    else {
                                        tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-1_" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Closing_Stock + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'/></td>";
                                    }

                                    tableContent += "<td><input type='text' id='txtAmount" + inputColumnArr[j] + "-1_" + i + "' value='" + unitPricePerproduct * salesAmount + "'  class='checknumeric' readonly='readonly' onclick= '$(this).select();' style='width:70px;'/></td>";

                                }
                                else if (inputColumnArr[j].toUpperCase() == "REMARKS") {
                                    tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "' value='" + jsData.Tables[0].Rows[i - 1].ProductRemarks + "'  onclick= '$(this).select();' style='width:90px;' class='CheckProductRemark'/></td>";
                                }
                            }

                            tableContent += "</tr>";

                            debugger;
                            //PS prefill functionality
                            if (PSPrefillDetails != undefined && PSPrefillDetails.length != 0) {
                                if (PSDetails.length != 0) {
                                    for (var p = 0; p < PSDetails.length; p++) {
                                        var psjson = jsonPath(PSDetails, "$.[?(@.Product_Code=='" + $('#hdnProductCode_1').val() + "')]");
                                        if (psjson != false && psjson.length != 0) {
                                            for (var k = 0; k < inputColumnArr.length; k++) {
                                                var inputcol = jsonPath(psjson, "$.[?(@.Column_Name=='" + inputColumnArr[k] + "')]");

                                                if (inputcol != false && inputcol.length > 0) {
                                                    var txtbox = "txt" + inputcol[0].Column_Name + "-";
                                                    txtbox = txtbox + i;
                                                    $("#" + txtbox).val(inputcol[0].Qty);
                                                }
                                            }
                                            for (var k = 0; k < inputColumnArr.length; k++) {
                                                var EditJs = jsonPath(PSPrefillDetails, "$.[?(@.Column_Name=='" + inputColumnArr[k] + "')]");
                                                //Check Wheather to enable the prefilled column to write.
                                                if (EditJs != false) {
                                                    var txtbox = "txt" + EditJs[0].Column_Name + "-";
                                                    txtbox = txtbox + i;
                                                    if (EditJs[0].Is_Editable == '0') {
                                                        $("#" + txtbox).attr('readonly', 'true');
                                                    }
                                                }
                                            }
                                        }
                                        else {
                                            break;
                                        }
                                    }
                                }
                            }


                        }
                        rowNumber = parseInt(jsData.Tables[0].Rows.length) + 1;
                        tableContent += "<tr>";
                        tableContent += "<td><input type='text' id='txtProductName_1_" + i + "'   class='autoProducts' ondblclick='fnCreateNewRowInCustomerProduct(this);'  onkeyup= 'fnCreateNewRowInCustomerProduct(this);' style='width:200px' /><input type='hidden' id='hdnProductCode_1_" + i + "' /></td>";

                        if (priceEdit.toUpperCase() == "NO") {
                            tableContent += "<td><input type='text' id='txtUnitRate_1_" + i + "'   class='checknumeric' onclick= '$(this).select();' style='width:70px;' readonly='readonly' /></td>";
                        }
                        else {
                            tableContent += "<td><input type='text' id='txtUnitRate_1_" + i + "'   class='checknumeric' onclick= '$(this).select();' style='width:70px;' /></td>";
                        }
                        for (var j = 0; j < inputColumnArr.length; j++) {

                            if (inputColumnArr[j].toUpperCase() == compute.toUpperCase()) {
                                if (editMode.toUpperCase() == "NO") {
                                    tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-1_" + rowNumber + "'  class='checknumeric txtReadonly' onclick= '$(this).select();' style='width:70px;' readonly='readonly' /></td>";
                                }
                                else if (inputColumnArr[j].toUpperCase() == "REMARKS") {
                                    tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "' value='" + jsData.Tables[0].Rows[i - 1].ProductRemarks + "'  onclick= '$(this).select();' style='width:90px;' class='CheckProductRemark'/></td>";
                                }
                                else {
                                    tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-1_" + rowNumber + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'/></td>";
                                }
                            }
                            else {
                                if (inputColumnArr[j].toUpperCase() == "OPENING_BALANCE") {

                                    if (editMode.toUpperCase() == "NO") {
                                        tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-1_" + rowNumber + "'  class='checknumeric txtReadonly' onclick= '$(this).select();' style='width:70px;'  readonly='readonly'/></td>";
                                    }
                                    else if (inputColumnArr[j].toUpperCase() == "REMARKS") {
                                        tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "' value='" + jsData.Tables[0].Rows[i - 1].ProductRemarks + "'  onclick= '$(this).select();' style='width:90px;' class='CheckProductRemark'/></td>";
                                    }
                                    else {
                                        tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-1_" + rowNumber + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'/></td>";
                                    }
                                }
                                else if (inputColumnArr[j].toUpperCase() == "REMARKS") {
                                    tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "' value='" + jsData.Tables[0].Rows[i - 1].ProductRemarks + "'  onclick= '$(this).select();' style='width:90px;' class='CheckProductRemark'/></td>";
                                }
                                else {
                                    tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-1_" + rowNumber + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'/></td>";
                                }
                            }

                            if (inputColumnArr[j].toUpperCase() == "CLOSING_BALANCE") {
                                tableContent += "<td><input type='text' id='txtAmount" + inputColumnArr[j] + "-1_" + rowNumber + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'  readonly='readonly'/></td>";
                            }
                            if (inputColumnArr[j].toUpperCase() == "SALES") {

                                tableContent += "<td><input type='text' id='txtAmount" + inputColumnArr[j] + "-1_" + rowNumber + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'  readonly='readonly'/></td>";
                            }
                            else if (inputColumnArr[j].toUpperCase() == "REMARKS") {
                                tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "' value='" + jsData.Tables[0].Rows[i - 1].ProductRemarks + "'  onclick= '$(this).select();' style='width:90px;' class='CheckProductRemark'/></td>";
                            }

                        }
                        tableContent += "</tr>";
                        tableContent += "</tr>";
                        tableContent += "<tr id='tbllastRow'><td style='width:261px;font-weight:bold'>TOTAL</td>";

                        tableContent += "<td></td>";

                        for (var k = 0; k < inputColumnArr.length; k++) {

                            if (inputColumnArr[k].toUpperCase() == "CLOSING_BALANCE") {

                                tableContent += "<td></td>";
                                tableContent += "<td><input type='text' id='txtClosingAmountSum-1' readonly='true' class='checknumeric'style='width:70px;border:none;font-weight:bold' /></td>";

                            }
                            else if (inputColumnArr[k].toUpperCase() == "SALES") {

                                tableContent += "<td></td>";
                                tableContent += "<td><input type='text' id='txtSalesAmountSum-1' readonly='true' class='checknumeric'style='width:70px;border:none;font-weight:bold' /></td>";
                            }
                            else {
                                tableContent += "<td></td>";
                            }

                        }
                        tableContent += "</tbody>";
                        tableContent += "</table>";
                        tableContent += "</td></tr>";
                        tableContent += "</table>";
                    }// END : CUSTOMER.
                    else {// START: STOCKIEST.
                        debugger;
                        tableContent += "<table cellspacing='0' cellpadding='0' id='tblSecondarySales' width='100%' class='data display datatable' >";
                        tableContent += "<thead>";
                        tableContent += "<tr><th  style='width:15%'>PRODUCT NAME</th>";
                        tableContent += "<th  style='width:9%;'>UNIT RATE</th>";

                        for (var i = 0; i < inputColumnArr.length; i++) {

                            if (inputColumnArr[i].toUpperCase() == "CLOSING_BALANCE") {
                                tableContent += "<th class='numericth' style='width:9%;'>" + inputColumnArr[i].replace('_', ' ') + "</th>";
                                tableContent += "<th class='numericth' style='width:9%;'>" + inputColumnArr[i].replace('_', ' ') + " AMOUNT</th>";
                            }
                            else if (inputColumnArr[i].toUpperCase() == "SALES") {
                                tableContent += "<th class='numericth' style='width:9%;'>" + inputColumnArr[i].replace('_', ' ') + "</th>";
                                tableContent += "<th class='numericth' style='width:9%;'>" + inputColumnArr[i].replace('_', ' ') + " AMOUNT</th>";
                            }
                            else if (inputColumnArr[i].toUpperCase() == "REMARKS") {
                                tableContent += "<th style='width:9%;'>" + inputColumnArr[i].replace('_', ' ') + "</th>";
                            }
                            else {
                                tableContent += "<th class='numericth' style='width:9%;'>" + inputColumnArr[i].replace('_', ' ') + "</th>";
                            }

                        }
                        tableContent += "</tr>";
                        tableContent += "</thead>";
                        tableContent += "<tbody>";
                        for (var i = 1; i <= jsData.Tables[0].Rows.length; i++) {
                            var price = "";
                            unitPricePerproduct = parseFloat(jsData.Tables[0].Rows[i - 1].Price_per_Unit);
                            if (productPrice_g[1].Data.length > 0) {
                                productPrice = jsonPath(productPrice_g[0], "$.Data[?(@.Product_Code=='" + jsData.Tables[0].Rows[i - 1].Product_Code + "' )]");
                                if (productPrice != false && productPrice.length > 0) {
                                    if (productPrice_g[1].Data[0].Price_Type == "PTS") {
                                        price = productPrice[0].PTS;
                                    }
                                    else if (productPrice_g[1].Data[0].Price_Type == "INVOICE_AMOUNT") {
                                        price = productPrice[0].INVOICE_AMOUNT;
                                    }
                                    else if (productPrice_g[1].Data[0].Price_Type == "PTR_WOTAX") {
                                        price = productPrice[0].PTR_WOTAX;
                                    }
                                    else if (productPrice_g[1].Data[0].Price_Type == "MRP") {
                                        price = productPrice[0].MRP;
                                    }
                                    else if (productPrice_g[1].Data[0].Price_Type == "NRV") {
                                        price = productPrice[0].NRV;
                                    }
                                }
                            }
                            tableContent += "<tr>";
                            if (jsData.Tables[0].Rows[i - 1].Ref_Key1 == "0" || jsData.Tables[0].Rows[i - 1].Ref_Key1 == null) {
                                tableContent += "<td><input type='text' id='txtProductName_" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Product_Name + " (-)" + "' class='autoProducts'  onclick= '$(this).select();' style='width:200px' /><input value='" + jsData.Tables[0].Rows[i - 1].Product_Code + "_" + jsData.Tables[0].Rows[i - 1].Division_Code + "' type='hidden' id='hdnProductCode_" + i + "'/></td>";
                            }
                            else {
                                tableContent += "<td><input type='text' id='txtProductName_" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Product_Name + " (" + jsData.Tables[0].Rows[i - 1].Ref_Key1 + ")" + "' class='autoProducts'  onclick= '$(this).select();' style='width:200px' /><input value='" + jsData.Tables[0].Rows[i - 1].Product_Code + "_" + jsData.Tables[0].Rows[i - 1].Division_Code + "' type='hidden' id='hdnProductCode_" + i + "'/></td>";
                            }
                            debugger;
                            if (priceEdit.toUpperCase() == "NO") {

                                if (jsData.Tables[0].Rows[i - 1].Price_per_Unit != price) {
                                    tableContent += "<td><input type='text' title='old price for this product was " + jsData.Tables[0].Rows[i - 1].Price_per_Unit + "' id='txtUnitRate_" + i + "' value='" + price + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;background-color:yellow'  readOnly='readOnly'/></td>";
                                }
                                else {
                                    tableContent += "<td><input type='text'  id='txtUnitRate_" + i + "' value='" + price + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;' readOnly='readOnly' /></td>";
                                }

                            }
                            else {
                                if (jsData.Tables[0].Rows[i - 1].Price_per_Unit != price) {
                                    tableContent += "<td><input type='text' title='old price for this product was " + jsData.Tables[0].Rows[i - 1].Price_per_Unit + "' id='txtUnitRate_" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Price_per_Unit + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;background-color:yellow' /></td>";
                                }
                                else {
                                    tableContent += "<td><input type='text'  id='txtUnitRate_" + i + "' value='" + price + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;' /></td>";
                                }
                            }
                            for (var j = 0; j < inputColumnArr.length; j++) {
                                if (inputColumnArr[j].toUpperCase() == "FREE_GOODS") {
                                    if (inputColumnArr[j].toUpperCase() == compute.toUpperCase()) {
                                        if (editMode.toUpperCase() == "NO") {
                                            tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Free_Goods + "'  class='checknumeric txtReadonly' onclick= '$(this).select();' style='width:70px; ' readonly='readonly' /></td>";
                                        }
                                        else {
                                            tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Free_Goods + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'/></td>";
                                        }
                                    }
                                    else {
                                        tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Free_Goods + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'/></td>";
                                    }
                                }
                                else if (inputColumnArr[j].toUpperCase() == "OPENING_BALANCE") {

                                    if (editMode.toUpperCase() == "NO") {
                                        tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Opening_Stock + "'  class='checknumeric txtReadonly' onclick= '$(this).select();' style='width:70px;' readonly='readonly'  /></td>";
                                        tableContent += "<input type='hidden' id= 'hdntxt" + inputColumnArr[j] + "-" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Opening_Stock + "'>";
                                        tableContent += "<input type='hidden' id='hdnmanually_edited" + inputColumnArr[j] + "-" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Is_Manually_Edited + "'>";
                                    }
                                    else {
                                        tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Opening_Stock + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'/></td>";
                                        tableContent += "<input type='hidden' id= 'hdntxt" + inputColumnArr[j] + "-" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Opening_Stock + "'>";
                                        tableContent += "<input type='hidden' id='hdnmanually_edited" + inputColumnArr[j] + "-" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Is_Manually_Edited + "'>";
                                    }
                                }
                                else if (inputColumnArr[j].toUpperCase() == "PURCHASE") {

                                    tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Purchase + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'/></td>";
                                }
                                else if (inputColumnArr[j].toUpperCase() == "PURCHASE_RETURN") {
                                    tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Purchase_Return + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'/></td>";
                                }
                                else if (inputColumnArr[j].toUpperCase() == "SALES") {

                                    salesAmount = parseFloat(jsData.Tables[0].Rows[i - 1].Sales);
                                    if (inputColumnArr[j].toUpperCase() == compute.toUpperCase()) {
                                        if (editMode.toUpperCase() == "NO") {
                                            tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Sales + "' class='checknumeric txtReadonly'  style='width:70px;' readonly='readonly' /></td>";
                                        }
                                        else {
                                            tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Sales + "' class='checknumeric'   style='width:70px;'/></td>";
                                        }
                                    }
                                    else {
                                        tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Sales + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'/></td>";
                                    }
                                    tableContent += "<td><input type='text' id='txtAmount" + inputColumnArr[j] + "-" + i + "' value='" + unitPricePerproduct * salesAmount + "'  class='checknumeric'  style='width:70px;' readonly='readonly' /></td>";
                                }
                                else if (inputColumnArr[j].toUpperCase() == "SALES_RETURN") {
                                    if (inputColumnArr[j].toUpperCase() == compute.toUpperCase()) {
                                        if (editMode.toUpperCase() == "NO") {
                                            tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Sales_Return + "'  class='checknumeric txtReadonly' onclick= '$(this).select();' style='width:70px;' readonly='readonly' /></td>";
                                        }
                                        else {
                                            tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Sales_Return + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'/></td>";
                                        }
                                    }
                                    else {
                                        tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Sales_Return + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'/></td>";

                                    }
                                }
                                else if (inputColumnArr[j].toUpperCase() == "TRANSIT") {

                                    if (inputColumnArr[j].toUpperCase() == compute.toUpperCase()) {
                                        if (editMode.toUpperCase() == "NO") {
                                            tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Transit + "'  class='checknumeric class='txtReadonly' onclick= '$(this).select();' style='width:70px;' readonly='readonly'/></td>";
                                        }
                                        else {
                                            tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Transit + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'/></td>";
                                        }
                                    }
                                    else {
                                        tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Transit + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'/></td>";
                                    }

                                }
                                else if (inputColumnArr[j].toUpperCase() == "CLOSING_BALANCE") {
                                    salesAmount = parseFloat(jsData.Tables[0].Rows[i - 1].Closing_Stock);
                                    if (inputColumnArr[j].toUpperCase() == compute.toUpperCase()) {
                                        if (editMode.toUpperCase() == "NO") {
                                            tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Closing_Stock + "' class='checknumeric txtReadonly'  style='width:70px;' readonly='readonly'  /></td>";
                                        }
                                        else {
                                            tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Closing_Stock + "' class='checknumeric'  style='width:70px;'/></td>";
                                        }
                                    }
                                    else {
                                        tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "' value='" + jsData.Tables[0].Rows[i - 1].Closing_Stock + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'/></td>";
                                    }

                                    tableContent += "<td><input type='text' id='txtAmount" + inputColumnArr[j] + "-" + i + "' value='" + unitPricePerproduct * salesAmount + "'   style='width:70px;' readonly='readonly'  /></td>";
                                }
                                else if (inputColumnArr[j].toUpperCase() == "REMARKS") {
                                    tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "' value='" + jsData.Tables[0].Rows[i - 1].ProductRemarks + "'  onclick= '$(this).select();' style='width:94px;' class='CheckProductRemark'/></td>";
                                    //var test = "20";
                                    //tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-1_" + i + "' value='" + jsData.Tables[0].Rows[i - 1].ProductRemarks + "'  onclick= '$(this).select();' style='width:94px;' OnBlur='fnProductRemarksValidation("+test+");'/></td>";
                                }
                            }
                            tableContent += "</tr>";
                        }
                        rowNumber = parseInt(jsData.Tables[0].Rows.length) + 1;
                        tableContent += "<tr>";
                        tableContent += "<td><input type='text' id='txtProductName_" + rowNumber + "'  class='autoProducts'  onclick= '$(this).select();' style='width:200px' /><input type='hidden' id='hdnProductCode_" + rowNumber + "'/></td>";
                        if (priceEdit.toUpperCase() == "NO") {
                            tableContent += "<td><input type='text' id='txtUnitRate_" + rowNumber + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;' readonly='readonly' /></td>";
                        }
                        else {
                            tableContent += "<td><input type='text' id='txtUnitRate_" + rowNumber + "' class='checknumeric' onclick= '$(this).select();' style='width:70px;' /></td>";
                        }
                        for (var j = 0; j < inputColumnArr.length; j++) {
                            if (inputColumnArr[j].toUpperCase() == compute.toUpperCase()) {
                                if (editMode.toUpperCase() == "NO") {
                                    tableContent += "<td><input type='text' value='0' id='txt" + inputColumnArr[j] + "-" + rowNumber + "'  class='checknumeric txtReadonly' onclick= '$(this).select();' style='width:70px;' readonly='readonly' /></td>";
                                }
                                else {
                                    tableContent += "<td><input type='text' value='0' id='txt" + inputColumnArr[j] + "-" + rowNumber + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'/></td>";
                                }
                            }
                            else {
                                if (inputColumnArr[j].toUpperCase() == "OPENING_BALANCE") {
                                    if (editMode.toUpperCase() == "NO") {

                                        tableContent += "<td><input type='text' value='0' id='txt" + inputColumnArr[j] + "-" + rowNumber + "'  class='checknumeric txtReadonly' onclick= '$(this).select();' style='width:70px;' readonly='readonly' /></td>";
                                        tableContent += "<input type='hidden' id='hdntxt" + inputColumnArr[j] + "-" + rowNumber + "' value='0.00'>";
                                        tableContent += "<input type='hidden' id ='hdnmanually_edited" + inputColumnArr[j] + "-" + rowNumber + "' value='0'>";
                                    }
                                    else {
                                        tableContent += "<td><input type='text' value='0' id='txt" + inputColumnArr[j] + "-" + rowNumber + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'/></td>";
                                        tableContent += "<input type='hidden' id='hdntxt" + inputColumnArr[j] + "-" + rowNumber + "' value = '0.00'>";
                                        tableContent += "<input type='hidden' id ='hdnmanually_edited" + inputColumnArr[j] + "-" + rowNumber + "' value='0'>";
                                    }
                                }
                                else if (inputColumnArr[j].toUpperCase() == "REMARKS") {
                                    tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "'  onclick= '$(this).select();' style='width:90px;' class='CheckProductRemark'/></td>";
                                }
                                else {
                                    tableContent += "<td><input type='text' value='0' id='txt" + inputColumnArr[j] + "-" + rowNumber + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;'/></td>";
                                }

                            }
                            if (inputColumnArr[j].toUpperCase() == "CLOSING_BALANCE") {
                                tableContent += "<td><input type='text' value='0' id='txtAmount" + inputColumnArr[j] + "-" + rowNumber + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;' readonly='readonly' /></td>";
                            }
                            if (inputColumnArr[j].toUpperCase() == "SALES") {
                                tableContent += "<td><input type='text' value='0' id='txtAmount" + inputColumnArr[j] + "-" + rowNumber + "'  class='checknumeric' onclick= '$(this).select();' style='width:70px;' readonly='readonly' /></td>";
                            }
                            //if (inputColumnArr[j].toUpperCase() == "REMARKS") {
                            //    tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "-" + i + "'  onclick= '$(this).select();' style='width:90px;' class='CheckProductRemark'/></td>";
                            //}
                        }

                        tableContent += "</tr>";
                        //srisudhan
                        tableContent += "<tr id='tbllastRow'><td style='width:261px;font-weight:bold'>TOTAL</td>";

                        tableContent += "<td></td>";

                        for (var k = 0; k < inputColumnArr.length; k++) {

                            if (inputColumnArr[k].toUpperCase() == "CLOSING_BALANCE") {

                                tableContent += "<td></td>";
                                tableContent += "<td><input type='text' id='txtClosingAmountSum' readonly='true' class='checknumeric'style='width:70px;border:none;font-weight:bold' /></td>";

                            }
                            else if (inputColumnArr[k].toUpperCase() == "SALES") {

                                tableContent += "<td></td>";
                                tableContent += "<td><input type='text' id='txtSalesAmountSum' readonly='true' class='checknumeric'style='width:70px;border:none;font-weight:bold' /></td>";
                            }
                            else {
                                tableContent += "<td></td>";
                            }

                        }
                        //srisudhan/
                        tableContent += "</tbody>";
                        tableContent += "</table>";
                        rowNumber = parseInt(rowNumber) + 1;
                    }
                    debugger;
                    $('#SecondarySalesDetails').html(tableContent);
                    $("#dvMainHeader").show();
                    $('#SecondarySalesDetails').show();

                    for (var i = 1; i <= jsData.Tables[0].Rows.length; i++) {
                        debugger;
                        //PS prefill functionality
                        if (PSPrefillDetails != undefined && PSPrefillDetails.length != 0) {
                            if (Company_Code != "COM00000141" && Company_Code != "COM00000213") {
                                if (PSDetails.length != 0) {
                                    for (var p = 0; p < PSDetails.length; p++) {
                                        var psjson = jsonPath(PSDetails, "$.[?(@.Product_Code=='" + jsData.Tables[0].Rows[i - 1].Product_Code + "')]");
                                        if (psjson != false && psjson.length != 0) {
                                            for (var k = 0; k < inputColumnArr.length; k++) {
                                                var inputcol = jsonPath(psjson, "$.[?(@.Column_Name=='" + inputColumnArr[k] + "')]");

                                                if (inputcol != false && inputcol.length > 0) {
                                                    var txtbox = "txt" + inputcol[0].Column_Name + "-";
                                                    txtbox = txtbox + i;
                                                    $("#" + txtbox).val(inputcol[0].Qty);
                                                }
                                            }
                                            for (var k = 0; k < inputColumnArr.length; k++) {
                                                var EditJs = jsonPath(PSPrefillDetails, "$.[?(@.Column_Name=='" + inputColumnArr[k] + "')]");
                                                //Check Wheather to enable the prefilled column to write.                                           
                                                if (EditJs != false) {
                                                    var txtbox = "txt" + EditJs[0].Column_Name + "-";
                                                    txtbox = txtbox + i;

                                                    if (EditJs[0].Is_Editable == '0') {
                                                        $("#" + txtbox).attr('readonly', 'true');
                                                    }
                                                }
                                            }
                                        }
                                        break;
                                    }
                                }
                            }
                            else {
                                if (PSDetails.length != 0) {
                                    for (var p = 0; p < PSDetails.length; p++) {
                                        var psjson = jsonPath(PSDetails, "$.[?(@.Product_Code=='" + jsData.Tables[0].Rows[i - 1].Product_Code + "')]");
                                        if (psjson != false && psjson.length != 0) {
                                            for (var k = 0; k < inputColumnArr.length; k++) {
                                                var inputcol = jsonPath(psjson, "$.[?(@.Column_Name=='" + inputColumnArr[k] + "')]");

                                                if (inputcol != false && inputcol.length > 0) {
                                                    var txtbox = "txt" + inputcol[0].Column_Name + "-";
                                                    txtbox = txtbox + i;
                                                    $("#" + txtbox).val(inputcol[0].Qty);
                                                }
                                            }
                                            for (var k = 0; k < inputColumnArr.length; k++) {
                                                var EditJs = jsonPath(PSPrefillDetails, "$.[?(@.Column_Name=='" + inputColumnArr[k] + "')]");
                                                //Check Wheather to enable the prefilled column to write.                                           
                                                if (EditJs != false) {
                                                    var txtbox = "txt" + EditJs[0].Column_Name + "-";
                                                    txtbox = txtbox + i;

                                                    if (EditJs[0].Is_Editable == '0') {
                                                        $("#" + txtbox).attr('readonly', 'true');
                                                    }
                                                }
                                            }
                                        }
                                        else {
                                            for (var k = 0; k < inputColumnArr.length; k++) {
                                                var EditJs = jsonPath(PSPrefillDetails, "$.[?(@.Column_Name=='" + inputColumnArr[k] + "')]");
                                                //Check Wheather to enable the prefilled column to write.                                           
                                                if (EditJs != false) {
                                                    var txtbox = "txt" + EditJs[0].Column_Name + "-";
                                                    txtbox = txtbox + i;

                                                    if (EditJs[0].Is_Editable == '0') {
                                                        $("#" + txtbox).attr('readonly', 'true');
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                else {
                                    for (var k = 0; k < inputColumnArr.length; k++) {
                                        var EditJs = jsonPath(PSPrefillDetails, "$.[?(@.Column_Name=='" + inputColumnArr[k] + "')]");
                                        //Check Wheather to enable the prefilled column to write.                                           
                                        if (EditJs != false) {
                                            var txtbox = "txt" + EditJs[0].Column_Name + "-";
                                            txtbox = txtbox + i;

                                            if (EditJs[0].Is_Editable == '0') {
                                                $("#" + txtbox).attr('readonly', 'true');
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    $("#divInput").show();
                    $('#productopoupLink').show();
                    fncalTotal();
                    autoComplete(productjsonString, "txtProductName", "hdnProductCode", 'autoProducts');
                    autoComplete(customerjsonString, "txtCustomerName", "hdnCustomerCode", 'autoCustomers');
                    for (var i = 1; i <= rowNumber; i++) {
                        if ($("#txtOPENING_BALANCE-" + i.toString()).length > 0) {

                            fnCalculate($("#txtOPENING_BALANCE-" + i.toString())[0]);
                        }
                    }

                    fnSecondaryEventBinder();
                    HideModalPopup("dvloading");
                    $(function () {
                        $(".datepicker").datepicker({
                            numberOfMonths: 3
                            //showButtonPanel: true
                        });
                    });
                }
                HideModalPopup("dvloading");

            }
        });

    }
    catch (e) {
        HideModalPopup("dvloading");
        alert(e.message);
    }
}

function fnCheckValidCustomer(id, jsonData, name) {

    var value = $(id).val();
    if (value != "") {
        var selectedValue = jsonPath(jsonData[3], "$.Data[?(@." + name + "=='" + value + "')]");
        if (!(selectedValue.length > 0)) {

            //fnValidateAutofill(id, productAutofill_g, 'txtCustomerName', 'hdnCustomerCode');
            // msgAlert(value + '  Customer name  is invalid.', 'alert');
            fnErrorIndicator(id);
            // $("#" + id.id).val('');
            return false;
        }
        else {
            fnRemoveErrorIndicatior(id);
            return true;
        }
    }
    else {
        return true;
    }
}

// Validate product 
function fnCheckValidProduct(id, jsonData, name) {
    debugger;
    var value = $(id).val();
    var openingBalId = id.id;
    var openingBalanceId = "";
    var customerId = "";
    var productId = "";
    var price = "0";
    var ids = "";
    var psDetails = "";

    if (jsonData != null) {
        if (value != "") {
            monthVal = $('#drpMonth').val();
            yearVal = $('#drpYear').val();
            var currentDate = new Date(monthVal + "-" + monthVal + "-" + yearVal);
            //var selectedValue = jsonPath(jsonData[0], "$.Data[?(@." + name + "=='" + value + "')]");
            //var selectedValue = jsonPath(productjsonString, "$.[?(@.label=='" + value + "')]");

            var selectedValue = $.grep(productjsonString, function (ele, index) {
                return ele.label == value;
            });
            ids = id.id;
            productId = ids.replace("txtProductName_", "hdnProductCode_");
            openingBalance = ids.replace("txtProductName_", "txtOPENING_BALANCE-");
            hdnOpeningBalance = ids.replace("txtProductName_", "hdntxtOPENING_BALANCE-");
            hdnIs_Manually_Edited = ids.replace("txtProductName_", "hdnmanually_editedOPENING_BALANCE-");
            productValue = $("#" + productId).val();

            if ($('#drpMonth').val() == 0) {
                fnMsgAlert('info', 'Secondary Sales', 'Select month.');
                $("#" + ids).val('');
                return false;
            }
            if ($('#drpYear').val() == 0) {
                fnMsgAlert('info', 'Secondary Sales', 'Select year.');
                $("#" + ids).val('');
                return false;
            }
            if (openingBalance != null) {
                debugger;
                if (jsonData[4].Data.length > 0) {
                    if (ssEntryMode.toUpperCase() == "STOCKIEST") {
                        debugger;
                        var i = 0;
                        var value = 1;
                        var customerCode_lcl = $('#hdnStockiestCode').val();
                        var productCode_lcl = productValue.split('_')[0];
                        var data = jsonData[4].Data;
                        openingBal = $.grep(data, function (v) {
                            return v.Product_Code == productCode_lcl;
                        });
                        //openingBal = jsonPath(jsonData[4], "$.Data[?(@.Product_Code=='" + productValue.split('_')[0] + "' & @.Month <='" + (currentDate.getMonth()) + "' & @.Year <='" + currentDate.getFullYear() + "' & @.Customer_Code=='" + $('#hdnStockiestCode').val() + "')]");
                        //openingBal = jsonPath(jsonData[4], "$.Data[?(@.Product_Code=='" + productValue.split('_')[0] + "' & @.Customer_Code=='" + $('#hdnStockiestCode').val() + "')]");
                        if (openingBal != false) {
                            debugger;
                            if (yearVal != "0") {
                                while (i <= value) {
                                    currentDate.setMonth(currentDate.getMonth() - 1);
                                    var month = currentDate.getMonth() + 1;
                                    var year = currentDate.getFullYear();
                                    openingBalVal = $.grep(data, function (v) {
                                        return v.Product_Code == productCode_lcl;
                                    });
                                    if (openingBalVal != false) {
                                        if ($("#" + hdnIs_Manually_Edited).val() == "0") {
                                            $("#" + openingBalance).val(openingBalVal[0].Opening_Balance);
                                            parseFloat($("#" + hdnOpeningBalance).val(openingBalVal[0].Opening_Balance)).toFixed(2);
                                            break;
                                        }
                                        else {
                                            $("#" + hdnOpeningBalance).val(parseFloat($("#" + openingBalance).val()).toFixed(2));
                                            break;
                                        }
                                    }
                                    else {
                                        $("#" + openingBalance).val('0.00');
                                        $("#" + hdnOpeningBalance).val('0.00');
                                    }
                                }
                            }
                        }
                        else {
                            $("#" + openingBalance).val('0.00');
                            $("#" + hdnOpeningBalance).val('0.00');
                        }
                    }
                    //else {
                    //    var i = 0;
                    //    var value = 1;
                    //    openingBal = jsonPath(jsonData[4], "$.Data[?(@.Product_Code=='" + productValue.split('_')[0] + "')]");
                    //    if (openingBal != false) {
                    //        if (yearVal != "0") {
                    //            while (i <= value) {
                    //                var month = currentDate.getMonth() + 1;
                    //                var year = currentDate.getFullYear();
                    //                openingBal = jsonPath(jsonData[4], "$.Data[?(@.Product_Code=='" + productValue.split('_')[0] + "' & @.Month =='" + month + "' & @.Year=='" + year + "')]");
                    //                if (openingBal != false) {
                    //                    $("#" + openingBalance).val(openingBal[0].Opening_Balance);
                    //                    parseFloat($("#" + hdnOpeningBalance).val(openingBalVal[0].Opening_Balance)).toFixed(2);
                    //                    break;
                    //                }
                    //                currentDate.setMonth(currentDate.getMonth() - 1);
                    //            }
                    //        }
                    //    }
                    //}
                }

                if (productPrice_g[1].Data.length > 0) {
                    debugger;
                    productPrice = jsonPath(productPrice_g[0], "$.Data[?(@.Product_Code=='" + productValue.split('_')[0] + "' )]");
                    if (productPrice != false && productPrice.length > 0) {
                        if (productPrice_g[1].Data[0].Price_Type == "PTS") {
                            price = productPrice[0].PTS;
                        }
                        else if (productPrice_g[1].Data[0].Price_Type == "INVOICE_AMOUNT") {
                            price = productPrice[0].INVOICE_AMOUNT;
                        }
                        else if (productPrice_g[1].Data[0].Price_Type == "PTR_WOTAX") {
                            price = productPrice[0].PTR_WOTAX;
                        }
                        else if (productPrice_g[1].Data[0].Price_Type == "MRP") {
                            price = productPrice[0].MRP;
                        }
                        else if (productPrice_g[1].Data[0].Price_Type == "NRV") {
                            price = productPrice[0].NRV;
                        }
                    }
                }
                debugger;
                //PS prefill functionality
                if (PSPrefillDetails != undefined && PSPrefillDetails.length != 0) {
                    if (Company_Code != "COM00000141" && Company_Code != "COM00000213") {
                        if (PSDetails.length != 0) {
                            for (var p = 0; p < PSDetails.length; p++) {
                                var psjson = jsonPath(PSDetails, "$.[?(@.Product_Code=='" + productValue.split('_')[0] + "')]");
                                if (psjson != false && psjson.length != 0) {
                                    for (var k = 0; k < inputColumnArr.length; k++) {
                                        var inputcol = jsonPath(psjson, "$.[?(@.Column_Name=='" + inputColumnArr[k] + "')]");
                                        if (inputcol != false && inputcol.length > 0) {
                                            var txtbox = "txt" + inputcol[0].Column_Name + "-";
                                            var hdntxt = "hdntxt" + inputcol[0].Column_Name + "-";
                                            var rowid = id.id.split('_');
                                            txtbox = txtbox + rowid[1];
                                            hdntxt = hdntxt + rowid[1];
                                            $("#" + txtbox).val(inputcol[0].Qty);
                                        }
                                    }
                                    for (var k = 0; k < inputColumnArr.length; k++) {
                                        var EditJs = jsonPath(PSPrefillDetails, "$.[?(@.Column_Name=='" + inputColumnArr[k] + "')]");

                                        //Check Wheather to enable the prefilled column to write.
                                        if (EditJs != false) {
                                            var txtbox = "txt" + EditJs[0].Column_Name + "-";
                                            var rowid = id.id.split('_');
                                            txtbox = txtbox + rowid[1];

                                            if (EditJs[0].Is_Editable == '0') {
                                                $("#" + txtbox).attr('readonly', 'true');
                                            }
                                        }
                                    }
                                }
                                else {
                                    for (var k = 0; k < inputColumnArr.length; k++) {
                                        var txtbox = "txt" + inputColumnArr[k] + "-";
                                        var rowid = id.id.split('_');
                                        txtbox = txtbox + rowid[1];

                                        if (inputColumnArr[k] != "OPENING_BALANCE") {
                                            //$("#" + txtbox).val('0.00');
                                            $("#" + txtbox).removeAttr('readonly');
                                        }
                                        if (inputColumnArr[k] == "REMARKS") {
                                            $("#" + txtbox).val('');
                                        }
                                        if (inputColumnArr[k] == "OPENING_BALANCE") {
                                            if (editMode.toUpperCase() != "NO") {
                                                $("#" + txtbox).removeAttr('readonly');
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            for (var k = 0; k < inputColumnArr.length; k++) {
                                var txtbox = "txt" + inputColumnArr[k] + "-";
                                var hdntxt = "hdntxt" + inputColumnArr[k] + "-";
                                var rowid = id.id.split('_');
                                txtbox = txtbox + rowid[1];
                                hdntxt = hdntxt + rowid[1];

                                if (inputColumnArr[k] != "OPENING_BALANCE") {
                                    //$("#" + txtbox).val('0.00');
                                    $("#" + txtbox).removeAttr('readonly');
                                }
                                if (inputColumnArr[k] == "REMARKS") {
                                    $("#" + txtbox).val('');
                                }
                                if (inputColumnArr[k] == "OPENING_BALANCE") {
                                    if (editMode.toUpperCase() != "NO") {
                                        $("#" + txtbox).removeAttr('readonly');
                                    }
                                }
                            }
                        }
                    }
                    else {
                        if (PSDetails.length != 0) {
                            for (var p = 0; p < PSDetails.length; p++) {
                                var psjson = jsonPath(PSDetails, "$.[?(@.Product_Code=='" + productValue.split('_')[0] + "')]");
                                if (psjson != false && psjson.length != 0) {
                                    for (var k = 0; k < inputColumnArr.length; k++) {
                                        var inputcol = jsonPath(psjson, "$.[?(@.Column_Name=='" + inputColumnArr[k] + "')]");
                                        if (inputcol != false && inputcol.length > 0) {
                                            var txtbox = "txt" + inputcol[0].Column_Name + "-";
                                            var hdntxt = "hdntxt" + inputcol[0].Column_Name + "-";
                                            var rowid = id.id.split('_');
                                            txtbox = txtbox + rowid[1];
                                            hdntxt = hdntxt + rowid[1];
                                            $("#" + txtbox).val(inputcol[0].Qty);
                                        }
                                    }
                                    for (var k = 0; k < inputColumnArr.length; k++) {
                                        var EditJs = jsonPath(PSPrefillDetails, "$.[?(@.Column_Name=='" + inputColumnArr[k] + "')]");

                                        //Check Wheather to enable the prefilled column to write.
                                        if (EditJs != false) {
                                            var txtbox = "txt" + EditJs[0].Column_Name + "-";
                                            var rowid = id.id.split('_');
                                            txtbox = txtbox + rowid[1];

                                            if (EditJs[0].Is_Editable == '0') {
                                                $("#" + txtbox).attr('readonly', 'true');
                                            }
                                        }
                                    }
                                }
                                else {
                                    for (var k = 0; k < inputColumnArr.length; k++) {
                                        var EditJs = jsonPath(PSPrefillDetails, "$.[?(@.Column_Name=='" + inputColumnArr[k] + "')]");

                                        //Check Wheather to enable the prefilled column to write.
                                        if (EditJs != false) {
                                            var txtbox = "txt" + EditJs[0].Column_Name + "-";
                                            var rowid = id.id.split('_');
                                            txtbox = txtbox + rowid[1];

                                            if (EditJs[0].Is_Editable == '0') {
                                                $("#" + txtbox).attr('readonly', 'true');
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            for (var k = 0; k < inputColumnArr.length; k++) {
                                var EditJs = jsonPath(PSPrefillDetails, "$.[?(@.Column_Name=='" + inputColumnArr[k] + "')]");

                                //Check Wheather to enable the prefilled column to write.
                                if (EditJs != false) {
                                    var txtbox = "txt" + EditJs[0].Column_Name + "-";
                                    var rowid = id.id.split('_');
                                    txtbox = txtbox + rowid[1];

                                    if (EditJs[0].Is_Editable == '0') {
                                        $("#" + txtbox).attr('readonly', 'true');
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (!(selectedValue.length > 0)) {

                //fnValidateAutofill(id, productAutofill_g, 'txtProductName_', 'hdnProductCode_');
            }
            else {
                fnRemoveErrorIndicatior(id);
                if (selectedValue[0].product_Price != "") {
                    id = id.id;
                    id = id.replace("txtProductName_", "txtUnitRate_");
                }
                else {
                    selectedValue = 0.0;
                }
                $("#" + id).val(price);
                return true;
            }
        }
    }
    else {
        return true;
    }
}

function GetColorCode(status) {
    var style = "";
    switch (status.toUpperCase()) {
        case "APPROVED":
            style = "style=color:white;background-color:darkgreen";
            break;
        case "APPLIED":
            style = "style=color:white;background-color:DodgerBlue";
            break;
        case "UNAPPROVED":
            style = "style=color:white;background-color:crimson";
            break;
        case "DRAFT":
            style = "style=color:white;background-color:pink";
            break;
        default:
            style = "";
            break;
    }
    return style;
}

function fnDoubleCheckSecondarySalesEntry(mode) {
    var SS_Count = "";
    var istrue = true;
    var month = $('#drpMonth').val();
    var year = $('#drpYear').val();
    var stockiest_Code = $("#hdnStockiestCode").val();
    debugger;
    $.ajax({
        type: 'GET',
        url: '../HiDoctor_Activity/SecondarySales/GetDoubleCheckSSEntry',
        data: "&month=" + month + "&year=" + year + "&stockiest_Code=" + stockiest_Code + "&regionCode=" + regionCode,
        success: function (result) {
            SS_Count = result;
            ssStatus = "";
            if (SS_Count.split('-')[0] == "2") {
                ssStatus = "EDIT" + "_" + SS_Count.split('-')[1];
                fnReadSecondarySalesTable(mode);

            }
            else if (SS_Count.split('-')[0] == "1") {
                fnMsgAlert('info', 'Info', 'Secondary Sales has already been entered for the selectd customer');
                $.unblockUI();
                fnCreateSecandryTable(selectedUserCode, regionCode);
                fnMonthAndYear();
                $('#hdnStatus').val('')
                $('#hdnStockiestCode').val('');
                $('#txtStockiestName').val('');
                $('#txtStatmentDate').val('');
                $('#txtStatmentDate').attr('disabled', false);
                $('#txtStockiestName').attr('disabled', false);
                $('#drpMonth').attr('disabled', false);
                $('#drpYear').attr('disabled', false);
                $('#unapprovedRemarks').html('');
                return false;
            }
            else if(SS_Count.split('-')[0] == "0"){
                fnReadSecondarySalesTable(mode);
            }
            //if (SS_Count > 0) {
            //    fnMsgAlert('info', 'Info', 'Secondary Sales has already been entered for the selectd customer');
            //    $.unblockUI();
            //    fnCreateSecandryTable(selectedUserCode, regionCode);
            //    fnMonthAndYear();
            //    $('#hdnStatus').val('')
            //    $('#hdnStockiestCode').val('');
            //    $('#txtStockiestName').val('');
            //    $('#txtStatmentDate').val('');
            //    $('#txtStatmentDate').attr('disabled', false);
            //    $('#txtStockiestName').attr('disabled', false);
            //    $('#drpMonth').attr('disabled', false);
            //    $('#drpYear').attr('disabled', false);
            //    $('#unapprovedRemarks').html('');
            //    return false;
            //}
            //else {
            //    if (ssEntryMode.toUpperCase() == "CUSTOMER") {
            //        isTrue = fnStockiestWiseCustomerValidation(mode);
            //        if (isTrue != true) {
            //            return false;
            //        }
            //    }
            //    else {
            //        debugger;
            //        fnReadSecondarySalesTable(mode);
            //    }
            //}
        }
    });
}

function fnCheckMonthDiff(mode) {
    var latestmonth = "";
    var latestyear = "";
    var month = $('#drpMonth').val();
    var year = $('#drpYear').val();

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/SecondarySales/GetMonth',
        data: "&region_Code=" + regionCode + "&stockiest_Code=" + $("#hdnStockiestCode").val(),

        success: function (result) {
            debugger;
            var data = eval('(' + result + ')');
            if (data.Tables[0].Rows.length != 0) {
                latestmonth = data.Tables[0].Rows[0].month;
                latestyear = data.Tables[0].Rows[0].year;
            }
            if (latestmonth != "" && latestyear != "") {
                debugger;
                if (month != latestmonth || year != latestyear) {
                    if (latestmonth != 12) {
                        latestmonth = latestmonth + 1;
                    }
                    else {
                        latestmonth = 1;
                        latestyear = latestyear + 1;
                    }
                    var startDate = latestyear + "-" + ("0" + latestmonth).slice(-2) + "-" + "01";
                    var endDate = year + "-" + ("0" + month).slice(-2) + "-" + "01";

                    var betweenMonths = getMonthYearArray(new Date(startDate), new Date(endDate));
                    var data = [];
                    if (startDate != endDate) {

                        for (var i = 0; i < betweenMonths.length; i++) {
                            data = data + betweenMonths[i] + ",";
                        }
                    }
                    data = data.slice(0, -1);
                    if (data != "") {
                        if (!confirm('The secondary sales for ' + data + ' months(s) not done .If you wish to continue click OK. Otherwise click Cancel')) {
                            fnSecondarySalesReset();
                            return false;
                        }
                        else {
                            fnDoubleCheckSecondarySalesEntry(draftOrSubmitmode);
                        }
                    }
                    else {
                        fnDoubleCheckSecondarySalesEntry(draftOrSubmitmode);
                    }
                }
                else {
                    fnDoubleCheckSecondarySalesEntry(draftOrSubmitmode);
                }
            }
            else {
                fnDoubleCheckSecondarySalesEntry(draftOrSubmitmode);
            }
        }
    });
}
function getMonthYearArray(start, end) {
    var MonthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var arr = new Array();
    var dt = new Date(start);
    while (dt <= end) {
        var dd = new Date(dt);
        arr.push(MonthArr[(dd.getMonth())] + '-' + dd.getFullYear());
        dt.setMonth(dt.getMonth() + 1);
    }
    return arr;
}
function fnCheckIsPSPrefill(input) {
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        type: 'POST',
        dataType: 'json',
        url: '../HiDoctor_Activity/SecondarySales/CheckPSIsPrefill',
        data: input,
        async: false,
        success: function (response) {
            checkIsPSPrefill = response;
        }
    });
}

function fnReadSecondarySalesPrice() {
    $.blockUI();
    debugger;
    $('#hdnStatus').val('');
    customerCode = $("#hdnStockiestCode").val();
    monthVal = $('#drpMonth').val();
    yearVal = $('#drpYear').val();
    var days = daysInMonth(monthVal, yearVal);
    var startDate = new Date(yearVal + "/" + monthVal + "/" + days);
    $('#SecondarySalesDetails').hide();
    $('#productopoupLink').hide();
    $("#divInput").hide();

    //feature month validation

    var todayDate = curdate.split('.')[2] + '-' + curdate.split('.')[1] + '-' + days;
    var today = new Date(todayDate);


    if (startDate > today) {
        $.unblockUI();
        fnMsgAlert('info', 'Secondary Sales', 'Month & Year can not be a future Date.');
        return false;
    }

    if ($('#drpMonth').val() == 0) {
        $.unblockUI();
        fnMsgAlert('info', 'Secondary Sales', 'Select month.');

        return false;
    }
    else {
        $('#drpMonth').attr('disabled', 'disabled');
    }
    if ($('#drpYear').val() == 0) {
        $.unblockUI();
        fnMsgAlert('info', 'Secondary Sales', 'Select year.');
        return false;
    }
    else {
        $('#drpYear').attr('disabled', 'disabled');
    }
    if ($('#txtStatmentDate').val() == "") {
        $.unblockUI();
        fnMsgAlert('info', 'Secondary Sales', 'Select StatementDate.');
        return false;
    }
    else {
        $('#txtStatmentDate').attr('readonly', 'readonly');
    }

    if ($.trim($('#txtStatmentDate').val()).length > 0) {

        monthVal = $('#drpMonth').val();
        if (monthVal.length == 1) {
            monthVal = '0' + monthVal;
        }
        yearVal = $('#drpYear').val();
        var DateVal = yearVal + "-" + monthVal + "-" + "01";
        var ssStatement = $.trim($('#txtStatmentDate').val());
        var ss = $.trim($('#txtStatmentDate').val()).split('/');
        var ssDate = ss[2] + "-" + ss[1] + "-" + ss[0];

        var ssMonth = ssStatement.split('/')[1];
        var ssYear = ssStatement.split('/')[2];
        if (monthVal.length > 0 && yearVal.length > 0) {
            if (ssDate < DateVal) {
                $.unblockUI();
                fnMsgAlert('info', 'Secondary Sales', 'Sales Statement date cannot be prior to Secondary Sales Month & Year.');
                return false;
            }
        }
    }

    if ($('#txtStockiestName').val() == '') {
        $.unblockUI();
        fnMsgAlert('info', 'Secondary Sales', 'Enter Stockiest Name.');
        $('#txtStockiestName').focus();
        return false;
    }

    fnProductWisePrice();

    if (product == '1') {

        var latestmonth = "";
        var latestyear = "";
        var month = $('#drpMonth').val();
        var year = $('#drpYear').val();

        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Activity/SecondarySales/GetMonth',
            data: "&region_Code=" + regionCode + "&stockiest_Code=" + $("#hdnStockiestCode").val(),
            async: false,
            success: function (result) {
                debugger;
                var data = eval('(' + result + ')');
                if (data.Tables[0].Rows.length != 0) {
                    latestmonth = data.Tables[0].Rows[0].month;
                    latestyear = data.Tables[0].Rows[0].year;
                }
                if (latestmonth != "" && latestyear != "") {
                    debugger;
                    if (month != latestmonth || year != latestyear) {
                        if (latestmonth != 12) {
                            latestmonth = latestmonth + 1;
                        }
                        else {
                            latestmonth = 1;
                            latestyear = latestyear + 1;
                        }
                        var startDate = latestyear + "-" + ("0" + latestmonth).slice(-2) + "-" + "01";
                        var endDate = year + "-" + ("0" + month).slice(-2) + "-" + "01";

                        var betweenMonths = getMonthYearArray(new Date(startDate), new Date(endDate));
                        var data = [];
                        if (startDate != endDate) {

                            for (var i = 0; i < betweenMonths.length; i++) {
                                data = data + betweenMonths[i] + ",";
                            }
                        }
                        data = data.slice(0, -1);
                        if (data != "") {
                            if (!confirm('The secondary sales for ' + data + ' months(s) not done .If you wish to continue click OK. Otherwise click Cancel')) {
                                fnSecondarySalesReset();
                                return false;
                            }
                        }
                    }
                }
            }
        });
    }

    var input = [];
    var monthval = "";
    if ($('#drpMonth').val().length == 1) {
        monthval = "0" + $('#drpMonth').val();
    }
    else {
        monthval = $('#drpMonth').val();
    }

    var inputvalues = {
        Month: monthval,
        Year: $('#drpYear').val(),
        Region_Code: regionCode
    }
    input.push(inputvalues);
    if (input.length > 0) {
        input = JSON.stringify({ 'lstPS_input': input });
    }

    debugger;
    fnCheckIsPSPrefill(input);

    if (checkIsPSPrefill == '1') {
        fnPSDetailsToPrefill();
    }

    debugger;
    fnCreateSecandryTable(selectedUserCode, regionCode);
    if (ssEntryMode.toUpperCase() == "STOCKIEST") {
        // Stockiest Validation
        if ($('#txtStockiestName').val() != "") {
            debugger;
            var jSonStockiest = jsonPath(productAutofill_g[2], "$.Data[?(@.StockiestCode =='" + $.trim($('#hdnStockiestCode').val()) + "')]");
            var jsonPoolSockiest = jsonPath(productAutofill_g[5], "$.Data[?(@.StockiestCode =='" + $('#hdnStockiestCode').val() + "')]");
            if (!(jSonStockiest.length > 0) && !(jsonPoolSockiest.length > 0)) {
                $.unblockUI();
                fnMsgAlert('info', 'Secondary Sales', $('#txtStockiestName').val() + '  Stockiest name  is invalid.');
                $('#txtStockiestName').focus();
                return false;
            }
            else {
                $('#txtStockiestName').attr('readonly', 'readonly');
            }
        }
    }
}

function fnPSDetailsToPrefill() {
    debugger;
    var input = [];
    var monthval = "";
    if ($('#drpMonth').val().length == 1) {
        monthval = "0" + $('#drpMonth').val();
    }
    else {
        monthval = $('#drpMonth').val();
    }

    var inputvalues = {
        Month: monthval,
        Year: $('#drpYear').val(),
        Region_Code: regionCode,
        SelectionType: '',
        Customer_Code: $("#hdnStockiestCode").val()
    }

    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '../HiDoctor_Activity/SecondarySales/GetPSDetailsForSS',
        data: inputvalues,
        async: false,
        success: function (response) {
            PSDetails = response[1].Data;
            PSPrefillDetails = response[0].Data;
        }
    });
}

var draftval = '1';
function fnProductWisePrice() {
    debugger;
    customerCode = $("#hdnStockiestCode").val();
    monthVal = $('#drpMonth').val();
    yearVal = $('#drpYear').val();
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/SecondarySales/GetSecondartSalesPrice',
        data: 'regionCode=' + regionCode + '&customer=' + customerCode + '&entryMode=' + ssEntryMode + '&month=' + monthVal + '&year=' + yearVal,
        async: false,
        success: function (response) {
            productPrice_g = response.Data;
            if (productPrice_g[2].Data[0].Is_Check != "0" && ssEntryMode.toUpperCase() == "STOCKIEST") {
                $('#SecondarySalesDetails').hide();
                $('#productopoupLink').hide();
                $("#divInput").hide();
                $.unblockUI();
                fnMsgAlert('info', 'Secondary Sales', 'Kindly get your secondary sales for the previous month approved else system will not allow you to make current month entry');
                fnSecondarySalesReset();
                draftval = '1';
                product = '0';
                return false;
            }
            else {

                product = '1';

                $("#dvMainHeader").show();
                $('#SecondarySalesDetails').show();
                $('#productopoupLink').show();
                $("#divInput").show();
                draftval = '0';
            }

            if (parseInt(productPrice_g[3].Data[0].Is_Available) > 0 && ssEntryMode.toUpperCase() == "STOCKIEST") {

                $('#SecondarySalesDetails').hide();
                $('#productopoupLink').hide();
                $("#divInput").hide();
                $('#drpMonth').attr('disabled', false);
                $('#drpYear').attr('disabled', false);
                $('#txtStatmentDate').removeAttr('readonly');
                $("#txtStockiestName").removeAttr('readonly');
                $.unblockUI();
                fnMsgAlert('info', 'Secondary Sales', 'Dear user you have already entered secondary sales for this customer in the subsequent months ');
                draftval = '1';
                product = '0';

                return false;

            }
            else {

                product = '1';

                $("#dvMainHeader").show();
                $('#SecondarySalesDetails').show();
                $("#divInput").show();
                $('#productopoupLink').show();
            }
            debugger;
            if ($('#hdnStatus').val() == "" && $('#hdnStatus').val() != null) {
                if (parseInt(productPrice_g[4].Data[0].Is_CurrentMonth) > 0 && ssEntryMode.toUpperCase() == "STOCKIEST") {
                    $('#SecondarySalesDetails').hide();
                    $('#productopoupLink').hide();
                    $("#divInput").hide();
                    $('#drpMonth').attr('disabled', false);
                    $('#drpYear').attr('disabled', false);
                    $('#txtStatmentDate').removeAttr('readonly');
                    $("#txtStockiestName").removeAttr('readonly');
                    if (parseInt(productPrice_g[4].Data[0].Is_Inherited) == 1) {
                        $.unblockUI();
                        fnMsgAlert('info', 'Secondary Sales', 'Dear user secondary sales is already entered for the selected customer . ');
                        draftval = '1';
                        product = '0';
                        return false;
                    }
                    else {
                        $.unblockUI();
                        fnMsgAlert('info', 'Secondary Sales', 'Dear user you have already entered secondary sales for this customer . ');
                        draftval = '1';
                        product = '0';
                        return false;
                    }

                }
                else {

                    $("#dvMainHeader").show();
                    $('#SecondarySalesDetails').show();
                    $("#divInput").show();
                    $('#productopoupLink').show();
                }
            }
        }
    });
    draftval = '2';
}

function fnProductWisePriceForEdit() {
    debugger;

    customerCode = $("#hdnStockiestCode").val();
    monthVal = $('#drpMonth').val();
    yearVal = $('#drpYear').val();
    fnCreateSecandryTable(selectedUserCode, regionCode);
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/SecondarySales/GetSecondartSalesPriceForEdit',
        data: 'regionCode=' + regionCode + '&customer=' + customerCode + '&entryMode=' + ssEntryMode + '&month=' + monthVal + '&year=' + yearVal,
        async: false,
        success: function (response) {

            productPrice_g = response.Data;
            product = '1';


            draftval = '0';
            if (ssEntryMode.toUpperCase() == "STOCKIEST") {
                $("#dvMainHeader").show();
                $('#SecondarySalesDetails').show();
                $('#productopoupLink').show();
                $("#divInput").show();
                //fnSecondarySalesReset();
                draftval = '1';
                product = '0';
                return false;
            }






            if (ssEntryMode.toUpperCase() == "REP") {

                $('#trStockiest').hide();
                $('#imgAdd').hide();

                if (productPrice_g[2].Data[0].Is_Check == "1") {
                    $('#SecondarySalesDetails').hide();
                    $('#productopoupLink').hide();
                    $("#divInput").hide();
                    fnMsgAlert('info', 'Secondary Sales', 'Dear user you have already entered secondary sales for this rep in the subsequent months ');
                    product = '0';
                    return false;
                }
                else {

                    product = '1';

                    $("#dvMainHeader").show();
                    $('#SecondarySalesDetails').show();
                    $("#divInput").show();
                    $('#productopoupLink').show();
                }


                if ($('#hdnStatus').val() == "" && $('#hdnStatus').val() != null) {
                    if (parseInt(productPrice_g[4].Data[0].Is_CurrentMonth) > 0) {
                        $('#SecondarySalesDetails').hide();
                        $('#productopoupLink').hide();
                        $("#divInput").hide();
                        fnMsgAlert('info', 'Secondary Sales', 'Dear user you have already entered secondary sales for this month . ');
                        product = '0';

                        return false;
                    }
                    else {

                        product = '1';

                        $("#dvMainHeader").show();
                        $('#SecondarySalesDetails').show();
                        $("#divInput").show();
                        $('#productopoupLink').show();
                    }
                }
            }
        }

    });
    draftval = '2';
}

function fnSecondarySalesReset() {
    $('#hdnStatus').val('');
    $('#drpMonth').attr('disabled', false);
    $('#drpYear').attr('disabled', false);
    $('#txtStatmentDate').attr('disabled', false);
    $('#txtStockiestName').attr('disabled', false);
    $('#drpMonth').val(0);
    $('#drpYear').val(0);
    $('#txtStatmentDate').removeAttr('readonly');
    $('#txtStatmentDate').val('');
    $('#SecondarySalesDetails').hide();
    $('#productopoupLink').hide();
    $("#divInput").hide();
    if (ssEntryMode.toUpperCase() == "STOCKIEST") {
        $("#txtStockiestName").removeAttr('readonly');
        $("#txtStockiestName").val('');

    }
    fnCreateSecandryTable(selectedUserCode, regionCode);
    $("#dvMainHeader").show();
    $('#unapprovedRemarks').html('');
}

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function fnStockiestWiseCustomerValidation(val) {

    var mode = val;
    stockiestCode = $("#hdnStockiestCode").val();
    monthVal = $('#drpMonth').val();
    yearVal = $('#drpYear').val();
    customerCode = "";

    var rCntSSalesTable = $('#tblSecondarySales table').length;
    for (var j = 1; j <= rCntSSalesTable; j++) {
        if ($("#txtCustomerName_1_" + j).val() != "") {
            customerCode += $("#hdnCustomerCode_1_" + j).val() + "^";
        }
    }
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/SecondarySales/GetStockiestWiseCustomerValidation',
        data: 'regionCode=' + regionCode + '&customer=' + customerCode + '&stockiest=' + stockiestCode + '&month=' + monthVal + '&year=' + yearVal,
        success: function (response) {
            debugger;
            var previous = response.split('$')[0];
            var nextMonth = response.split('$')[1];
            var currentMonth = response.split('$')[2];
            if (previous != "NO") {
                fnMsgAlert('info', 'Secondary Sales', 'Kindly get your secondary sales for the previous month approved else system will not allow you to make current month entry');
                return false;

            }
            else {
                debugger;
                fnReadSecondarySalesTable(mode);
            }
            if (nextMonth.toUpperCase() == "YES") {
                fnMsgAlert('info', 'Secondary Sales', 'Dear user you have already entered secondary sales for this customer in the subsequent months ');
                return false;
            }

            if (currentMonth.toUpperCase() == "YES") {
                fnMsgAlert('info', 'Secondary Sales', 'Dear user you have already entered secondary sales for this customer ');
                return false;
            }
        }
    });

    return true;
}

function fnGetsecproductPopUp() {
    disProArray = new Array();
    var trs = $("#tblSecondarySales tr");
    var i = 1;
    for (i = 1; i < trs.length; i++) {
        var rowId = fnGetRowId(trs[i]);

        if ($("#txtProductName_" + rowId + "").val() != "" && $("#hdnProductCode_" + rowId + "").val() != "" && $("#hdnProductCode_" + rowId + "").val() != undefined) {
            var product = {};
            var hdproductCode = $("#hdnProductCode_" + rowId + "").val().split("_")[0];
            product.Code = hdproductCode;
            disProArray.push(product);
        }
    }




    monthVal = $('#drpMonth').val();
    yearVal = $('#drpYear').val();
    var currentDate = new Date(monthVal + "-" + monthVal + "-" + yearVal);
    var openingBalspopup = "";
    var openingBalValue = "";
    //var ProductAutoFillArray = [];
    //ProductAutoFillArray.push(productAutofill_g[0].Data);
    //var ProductPriceFillArray = [];
    //ProductPriceFillArray.push(productPrice_g[1].Data);
    //var ProductOpenningBalanceFillArray = [];
    //ProductOpenningBalanceFillArray.push(productAutofill_g[4].Data);
    debugger;
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/SecondarySales/GetSecondarySalesopeningbalancePopup',
        data: 'selectedProductDetail=' + escape(JSON.stringify(disProArray)) + '&productAutofill=' + escape(JSON.stringify(productAutofill_g[0].Data)) + '&productPrice=' + escape(JSON.stringify(productPrice_g[0].Data)) + '&openingBalances=' + escape(JSON.stringify(productAutofill_g[4].Data)) + '&year=' + yearVal + '&month=' + monthVal + '&StockiestCode=' + $('#hdnStockiestCode').val() + '&priceType=' + escape(JSON.stringify(productPrice_g[1].Data)) + '&regionCode=' + regionCode,
        success: function (response) {

            $("#dvAllPro").html(response);
            $("#dvAllProduct").overlay().load();
        }
    });
}


function fnSelectAll() {
    if ($("input:checkbox[name=chkSelectAll]").attr("checked") == "checked") {
        $("input:checkbox[name=chkSelect]").each(function () {
            this.checked = true;
        });
    }
    else {
        $("input:checkbox[name=chkSelect]").each(function () {
            this.checked = false;
        });
    }
}


function fnGetSelectedProduct() {
    debugger;

    var productCode = "";
    var products = "[";
    var PS = "[";
    var flag = false;
    var inputarr = []
    inputarr.push(inputColumn.split(','));

    $("input:checkbox[name=chkSelect]").each(function () {
        if (this.checked) {
            flag = true;
            var id = this.id;
            flag = true;
            var productname = "";
            var unitprice = "";
            var opBalances = "";

            productCode = this.value.split("_")[0];
            productname = $("#" + this.id.replace("chkSelect", "tdProductName")).html();
            unitprice = $("#" + this.id.replace("chkSelect", "tdProductPrice")).text();
            opBalances = $("#" + this.id.replace("chkSelect", "tdpopOpeningbalanes")).html();

            products += "{ProductName:" + "'" + productname + "'" + ",ProductCode:" + "'" + productCode + "'" + ",Productprice:" + "'" + unitprice + "'" + ",opBlances:" + "'" + opBalances + "'" + "},";

        }

    });

    if (flag) {
        products = products.slice(0, -1);
        PS = PS.slice(0, -1);
    }
    if (productCode == "") {
        fnMsgAlert('info', 'Secondary Sales', 'Atleast one product has to be selected to Show in Grid');
        return false;
    }
    products += "]";
    PS += "]";
    //var newSelectedproJson = eval('(' + products + ')');
    var newSelectedproJson = eval('(' + products + ')');
    fnBindSelectedproduct(newSelectedproJson);
    $('#dvAllProduct').overlay().close();
    flag = "";
}

function fnresetAll() {
    $('input:checkbox[name=chkSelect]').each(function () {
        $(this).removeAttr('checked', 'checked');
    });
    $('#dvAllProduct').overlay().close();
    $('input:checkbox[name=chkSelectAll]').each(function () {
        $(this).removeAttr('checked', 'checked');
    });

}

function fnBindSelectedproduct(newSelectedproJson) {
    debugger;
    var alreadySelectedPro = "[";
    var trObj = $("#tblSecondarySales tr");
    var vallen = "";
    var pcode = "";

    //for (var i = 1; i < tblLen; i++) {
    //    
    //    if ($("#txtProductName_" + i + "").val() == '') {
    //        $("#hdnProductCode_" + i + "").val('');
    //    }
    //}

    var trObjects = $("#tblSecondarySales tr");
    var g = 1;
    var i = 1;
    for (i = 1; i < trObjects.length; i++) {
        if ($("#txtProductName_" + i + "").val() == '') {
            $("#hdnProductCode_" + i + "").val('');
        }
        var tr = trObjects[i];
        var rowId = fnGetRowId(tr);
        if ($("#hdnProductCode_" + rowId + "").length > 0 && $("#hdnProductCode_" + rowId + "").val() != '' && $("#hdnProductCode_" + rowId + "").val() != undefined) {
            pcode = $("#hdnProductCode_" + rowId + "").val();
            pcode = pcode.split('_')[0];
            alreadySelectedPro += "{ProductCode:" + "'" + pcode + "'" + "},";
            vallen++
        }
    }

    alreadySelectedPro += "]";
    alreadySelectedPro = eval('(' + alreadySelectedPro + ')');
    var k = 0;
    debugger;
    for (var i = 0; i < newSelectedproJson.length; i++) {
        if (newSelectedproJson[i].ProductCode != undefined) {
            var pcode1 = newSelectedproJson[i].ProductCode.split("_")[0]
            var productCode = jsonPath(alreadySelectedPro, "$.[?(@.ProductCode=='" + pcode1 + "')]");
            if (productCode == false) {
                fnCreateNewRowInProduct("");
                k = parseInt(vallen) + 1;
                var trObjects = $("#tblSecondarySales tr");
                var g = 1;
                for (g = 1; g < trObjects.length; g++) {
                    var tr = trObjects[g];
                    var rowId = fnGetRowId(tr);

                    if ($("#hdnProductCode_" + rowId + "").length > 0 && $("#hdnProductCode_" + rowId + "").val() == '' && $("#hdnProductCode_" + rowId + "").val() != undefined) {
                        $("#txtProductName_" + rowId + "").val(newSelectedproJson[i].ProductName);
                        $("#hdnProductCode_" + rowId + "").val(pcode1);
                        $("#txtUnitRate_" + rowId + "").val(newSelectedproJson[i].Productprice);
                        if (priceEdit == "NO") {
                            $("#txtUnitRate_" + rowId + "").attr("readOnly", "readOnly");
                        }
                        $("#txtOPENING_BALANCE-" + rowId + "").val(newSelectedproJson[i].opBlances);
                        parseFloat($("#hdntxtOPENING_BALANCE-" + rowId + "").val(newSelectedproJson[i].opBlances)).toFixed(2);
                        debugger;
                        //PS prefill functionality
                        if (PSPrefillDetails != undefined && PSPrefillDetails.length != 0) {
                            if (Company_Code != "COM00000141" && Company_Code != "COM00000213") {
                                if (PSDetails.length != 0) {
                                    for (var p = 0; p < PSDetails.length; p++) {
                                        var psjson = jsonPath(PSDetails, "$.[?(@.Product_Code=='" + newSelectedproJson[i].ProductCode.split("_")[0] + "')]");

                                        if (psjson != false && psjson.length != 0) {
                                            for (var k = 0; k < inputColumnArr.length; k++) {
                                                var inputcol = jsonPath(psjson, "$.[?(@.Column_Name=='" + inputColumnArr[k] + "')]");

                                                if (inputcol != false && inputcol.length > 0) {
                                                    var txtbox = "txt" + inputcol[0].Column_Name + "-" + rowId;
                                                    var EditJs = jsonPath(PSPrefillDetails, "$.[?(@.Column_Name=='" + inputColumnArr[k] + "')]");

                                                    $("#" + txtbox).val(inputcol[0].Qty);

                                                    if (EditJs != false && EditJs.length > 0) {
                                                        if (EditJs[0].Is_Editable == '0') {
                                                            $("#" + txtbox).attr('readonly', 'true');
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                else {
                                    for (var k = 0; k < PSPrefillDetails.length; k++) {
                                        var EditJs = PSPrefillDetails[k].Is_Editable;
                                        if (EditJs != '' && EditJs.length > 0) {
                                            if (EditJs == '0') {
                                                var Column_Name = PSPrefillDetails[k].Column_Name;
                                                $("#" + Column_Name + "-" + rowId).attr('readonly', 'true');
                                            }
                                        }
                                    }
                                }
                            }
                            else {
                                debugger;
                                if (PSDetails.length != 0) {
                                    for (var p = 0; p < PSDetails.length; p++) {
                                        var psjson = jsonPath(PSDetails, "$.[?(@.Product_Code=='" + newSelectedproJson[i].ProductCode.split("_")[0] + "')]");

                                        if (psjson != false && psjson.length != 0) {
                                            for (var k = 0; k < inputColumnArr.length; k++) {
                                                var inputcol = jsonPath(psjson, "$.[?(@.Column_Name=='" + inputColumnArr[k] + "')]");

                                                if (inputcol != false && inputcol.length > 0) {
                                                    var txtbox = "txt" + inputcol[0].Column_Name + "-" + rowId;
                                                    var EditJs = jsonPath(PSPrefillDetails, "$.[?(@.Column_Name=='" + inputColumnArr[k] + "')]");

                                                    $("#" + txtbox).val(inputcol[0].Qty);

                                                    if (EditJs != false && EditJs.length > 0) {
                                                        if (EditJs[0].Is_Editable == '0') {
                                                            $("#" + txtbox).attr('readonly', 'true');
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        else {
                                            for (var k = 0; k < inputColumnArr.length; k++) {
                                                var EditJs = jsonPath(PSPrefillDetails, "$.[?(@.Column_Name=='" + inputColumnArr[k] + "')]");

                                                //Check Wheather to enable the prefilled column to write.
                                                if (EditJs != false) {
                                                    var txtbox = "txt" + EditJs[0].Column_Name + "-";
                                                    txtbox = txtbox + rowId;

                                                    $("#" + txtbox).val(0);
                                                    if (EditJs[0].Is_Editable == '0') {
                                                        $("#" + txtbox).attr('readonly', 'true');
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        //else {
                        //    for (var k = 0; k < inputColumnArr.length; k++) {
                        //        var EditJs = jsonPath(PSPrefillDetails, "$.[?(@.Column_Name=='" + inputColumnArr[k] + "')]");

                        //        //Check Wheather to enable the prefilled column to write.
                        //        if (EditJs != false) {
                        //            var txtbox = "txt" + EditJs[0].Column_Name + "-";
                        //            txtbox = txtbox + rowId;

                        //            $("#" + txtbox).val(0);
                        //            if (EditJs[0].Is_Editable == '0') {
                        //                $("#" + txtbox).attr('readonly', 'true');
                        //            }
                        //        }
                        //    }
                        //}
                        break;
                    }
                }
            }
        }
    }

    //  fnCreateNewRowInProduct("");
    for (var x = 0; x < alreadySelectedPro.length; x++) {

        if (alreadySelectedPro[x].ProductCode != undefined) {
            var apcode = alreadySelectedPro[x].ProductCode.split("_")[0]
            var alreadyselectedproductCode = jsonPath(newSelectedproJson, "$.[?(@.ProductCode=='" + apcode + "')]");
            if (!alreadyselectedproductCode || alreadyselectedproductCode == null) {
                var i = 1;
                for (i = 1; i < trObjects.length; i++) {
                    var tr = trObjects[i];
                    var rowId = fnGetRowId(tr);
                    if ($("#hdnProductCode_" + rowId + "").length > 0 && $("#hdnProductCode_" + rowId + "").val() != '') {
                        var hdprocode = $("#hdnProductCode_" + rowId + "").val();
                        hdprocode = hdprocode.split('_')[0];
                        if (hdprocode == apcode) {

                            $("#txtProductName_" + rowId + "").closest('tr').remove();
                        }
                    }
                }
            }
        }
    }

}


//////////////////////////////////////////Delete Secondary Sales///////////////////////////////////////////

function fngetStockiest() {
    debugger;
    var regionCode = $('#hdnRegionCode').val();
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/SecondarySales/GetSSStockiest',
        data: 'regionCode=' + regionCode,
        success: function (response) {

            jsData = eval('(' + response + ')');
            $('option', $("#ddlStockiest")).remove();
            if (jsData.Tables[0].Rows.length > 0) {
                $('#ddlStockiest').append("<option value='0'>-Select-</option>");
                for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                    $("#ddlStockiest").append("<option value='" + jsData.Tables[0].Rows[i].Customer_Code + "'>" + jsData.Tables[0].Rows[i].Customer_Name + "</option>");
                }


                $("#ddlStockiest").val('0');
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });


}


function fnDeletedSecondarySalesDetail() {

    ShowModalPopup("dvloading");
    var regionCode = $('#hdnRegionCode').val();
    var stockiestCode = $("#ddlStockiest").val();
    var mode = $('input:radio[name=rptOptions]:checked').val();

    if (stockiestCode == 0) {
        HideModalPopup("dvloading");
        fnMsgAlert('info', 'Info', 'Please select Stockiest Name.');
        return false;
    }

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/SecondarySales/GetSecondarySalesForDelete',
        data: 'regionCode=' + regionCode + '&stockiestCode=' + stockiestCode + '&mode=' + mode,
        success: function (response) {

            if (response != "") {
                HideModalPopup("dvloading");
                $('#divReportHeader').html(response);
                $('#txtarea').show();
                $('#buttonsTwo').show();
            }
            else {
                HideModalPopup("dvloading");
                fnMsgAlert('info', 'Secondary Sales', 'No details found');
                $('#txtarea').hide();
                $('#buttonsTwo').hide();
                return false;
            }

        }

    });

}



function fnSSDelete(status) {

    var details = "";
    var remarks = "";
    var month = "";
    var year = "";
    var currentStatus = "";
    var mesgstatus = "";
    if (status == 0) {
        mesgstatus = "Unapproved";
    } else {
        mesgstatus = "Deleted";
    }




    if (confirm('All these entries will be "' + mesgstatus + '". Please click OK to continue, else CANCEL to cancel the operation')) {
        if (fnValidateDeleteSecondarySales(status)) {
            $("input:checkbox[name=chk_SS_Select]").each(function () {
                if (this.checked) {
                    var id = this.id;
                    details += $("#" + id.replace("chkSelect", "hdnDeleteDetails")).val() + "|";
                    details += "$";
                }
            });


            var remarks = $("#txtReason").val();
            try {
                $.ajax({
                    type: "POST",
                    url: '../HiDoctor_Activity/SecondarySales/DeleteandUnapproveSecondarysales',
                    data: 'details=' + escape(details) + '&status=' + status + '&remarks=' + remarks + '&IS_Inherited=' + $('#hdnIs_inherited').val(),
                    success: function (response) {
                        if (response != "") {
                            if (response != "") {
                                fnMsgAlert('success', 'Success', response);
                                $('#dvSSDetails').html();
                                fnDeletedSecondarySalesDetail();
                                $('#txtReason').val("");
                                $('#rbtThreeEntries').attr('checked', 'checked');
                            }
                        }

                    },
                    error: function (e) {
                        fnMsgAlert('error', 'Error', 'Error.');

                    }
                });
            }
            catch (e) {
                fnMsgAlert('error', 'Error', e.message);
                $("#divDates").hide();
                return false;
            }
        }
    }
}


function fnValidateDeleteSecondarySales(status) {
    var flag = false;
    var remarks = "";
    var currentStatus = "";
    var isResult = true;

    $("input:checkbox[name=chk_SS_Select]").each(function () {
        if (this.checked) {
            var id = this.id;
            flag = true;

        }
    });
    if (!flag) {
        fnMsgAlert('info', 'Info', 'Please select atleast one Secondary Sales.');
        isResult = false;
        return false;
    }

    remarks = $("#txtReason").val();
    if (status == 0) {

        if (remarks == "") {
            fnMsgAlert('info', 'Information', 'Please Enter remarks.');
            isResult = false;
            return false;
        }
    }
    if ($.trim(remarks) != "") {
        var specialCharregex = new RegExp("^[a-zA-Z0-9() |._%#@!;{}:*\\-,`=+?]+$");
        if (!specialCharregex.test(remarks)) {
            fnMsgAlert('info', 'Information', 'The following characters not allowed in this system. "&~^$<>[]\\/\'.please remove the special characters.');
            isResult = false;
            return false;
        }
        else {
            return true;
        }
    }

    return isResult;
}

function fnSSSelectAll() {
    if ($("input:checkbox[name=chkSSSelectAll]").attr("checked") == "checked") {
        $("input:checkbox[name=chk_SS_Select]").each(function () {
            this.checked = true;
            $("input:checkbox[name=chk_SS_Select]").attr('disabled', 'disabled')
        });
    }
    else {
        $("input:checkbox[name=chk_SS_Select]").each(function () {
            this.checked = false;
            $("input:checkbox[name=chk_SS_Select]").removeAttr('disabled')
        });
    }

}

function fnSelectDecsAll() {
    var tablelength = $("#divReportHeader tr").length;
    var selectedRowid = 0;
    $("input[type=checkbox]:enabled").each(function () {
        if ($(this).is(':checked')) {
            selectedRowid = $(this).val();
            return false;
        }
    });

    if (selectedRowid != 0) {
        for (var i = selectedRowid; i < tablelength; i++) {
            $("#chkSelect_" + i + "").attr("checked", true);
            $("#chkSelect_" + i + "").attr("disabled", true);
            $("#chkSelect_" + selectedRowid + "").attr("disabled", false);
        }
    }
    else {
        for (var i = selectedRowid; i < tablelength; i++) {
            $("#chkSelect_" + i + "").attr("checked", false);
            $("#chkSelect_" + i + "").attr("disabled", false);
        }
    }
}

function fnGetRowId(rowObject) {
    return $(rowObject).find("input")[0].id.split("_")[1];
}


// MICHAEL: START: Get the Calculation values based SS_FORMULA privileges.
// DO NOT ERASE.
function fnGetOBValueForCalc(rowNo) {
    try {
        var ssformula = ssformulas;
        ssformula = ssformula.replace("OPENING_BALANCE", "ASOPENING");

        var C_OB = 0;
        if (ssformula.indexOf("ASOPENING") >= 0) {
            if ($("#txtOPENING_BALANCE-" + rowNo).val() != null && $("#txtOPENING_BALANCE-" + rowNo).val() != "") {
                C_OB = parseFloat($("#txtOPENING_BALANCE-" + rowNo).val());
            }
        }
        return C_OB;
    }
    catch (e) {
        fnMsgAlert("info", "Secondary Sales", "Invalid Opening Balance value for the Product <b>" + $("#txtProduct_Name-" + rowNo).val() + "</b>. Please correct then proceed.");
        return false;
    }
}

function fnGetFGValueForCalc(rowNo) {
    try {
        var ssformula = ssformulas;
        ssformula = ssformula.replace("FREE_GOODS", "FREEGOODSDUM");

        var C_OB = 0;
        if (ssformula.indexOf("FREEGOODSDUM") >= 0) {
            if ($("#txtFREE_GOODS-" + rowNo).val() != null && $("#txtFREE_GOODS-" + rowNo).val() != "") {
                C_OB = parseFloat($("#txtFREE_GOODS-" + rowNo).val());
            }
        }
        return C_OB;
    }
    catch (e) {
        fnMsgAlert("info", "Secondary Sales", "Invalid Free Goods value for the Product <b>" + $("#txtFREE_GOODS-" + rowNo).val() + "</b>. Please correct then proceed.");
        return false;
    }
}

function fnGetPurchaseReturnValueForCalc(rowNo) {
    try {
        var ssformula = ssformulas;
        ssformula = ssformula.replace("PURCHASE_RETURN", "REPPUR");
        var C_PUR_RET = 0;
        if (ssformula.indexOf("REPPUR") >= 0) {
            if ($("#txtPURCHASE_RETURN-" + rowNo).val() != null && $("#txtPURCHASE_RETURN-" + rowNo).val() != "") {
                C_PUR_RET = parseFloat($("#txtPURCHASE_RETURN-" + rowNo).val());
            }
        }
        return C_PUR_RET;
    }
    catch (e) {
        fnMsgAlert("info", "Secondary Sales", "Invalid Purchase Return value for the Product <b>" + $("#txtProduct_Name-" + rowNo).val() + "</b>. Please correct then proceed.");
        return false;
    }
}

function fnGetSalesReturnValueForCalc(rowNo) {
    try {
        var ssformula = ssformulas;
        ssformula = ssformula.replace("SALES_RETURN", "SRDUM");
        var C_SAL_RET = 0;
        if (ssformula.indexOf("SRDUM") >= 0) {
            if ($("#txtSALES_RETURN-" + rowNo).val() != null && $("#txtSALES_RETURN-" + rowNo).val() != "") {
                C_SAL_RET = parseFloat($("#txtSALES_RETURN-" + rowNo).val());
            }
        }
        return C_SAL_RET;
    }
    catch (e) {
        fnMsgAlert("info", "Secondary Sales", "Invalid Sales Return value for the Product <b>" + $("#txtProduct_Name-" + rowNo).val() + "</b>. Please correct then proceed.");
        return false;

    }

}

function fnGetPurchaseValueForCalc(rowNo) {
    try {
        var ssformula = ssformulas;
        ssformula = ssformula.replace("PURCHASE", "DUMPURCHASE");
        var C_PUR = 0;
        if (ssformula.indexOf("DUMPURCHASE") >= 0) {
            if ($("#txtPURCHASE-" + rowNo).val() != null && $("#txtPURCHASE-" + rowNo).val() != "") {
                C_PUR = parseFloat($("#txtPURCHASE-" + rowNo).val());
            }
        }

        return C_PUR;
    }
    catch (e) {
        fnMsgAlert("info", "Secondary Sales", "Invalid Purchase value for the Product <b>" + $("#txtProduct_Name-" + rowNo).val() + "</b>. Please correct then proceed.");
        return false;
    }
}

function fnGetSalesValueForCalc(rowNo) {
    try {
        var ssformula = ssformulas;
        ssformula = ssformula.replace("SALES", "ESSALES");
        var C_SALES = 0;
        if (ssformula.indexOf("ESSALES") >= 0) {
            if ($("#txtSALES-" + rowNo).val() != null && $("#txtSALES-" + rowNo).val() != "") {
                C_SALES = parseFloat($("#txtSALES-" + rowNo).val());
            }
            if ($("#txtFREE_GOODS-" + rowNo).val() != undefined) {
                C_SALES = C_SALES + parseFloat($("#txtFREE_GOODS-" + rowNo).val());
            }
        }
        return C_SALES;
    }
    catch (e) {
        fnMsgAlert("info", "Secondary Sales", "Invalid Sales value for the Product <b>" + $("#txtProduct_Name-" + rowNo).val() + "</b>. Please correct then proceed.");
        return false;

    }

}

function fnGetClosingBalValueForCalc(rowNo) {
    try {
        var ssformula = ssformulas;
        ssformula = ssformula.replace("CLOSING_BALANCE", "CLOSINGDUM");
        var C_CB = 0;
        if (ssformula.indexOf("CLOSINGDUM") >= 0) {
            if ($("#txtCLOSING_BALANCE-" + rowNo).val() != null && $("#txtCLOSING_BALANCE-" + rowNo).val() != "") {
                C_CB = parseFloat($("#txtCLOSING_BALANCE-" + rowNo).val());
            }
        }
        return C_CB;
    }
    catch (e) {
        fnMsgAlert("info", "Secondary Sales", "Invalid Closing Balance value for the Product <b>" + $("#txtProduct_Name-" + rowNo).val() + "</b>. Please correct then proceed.");
        return false;
    }

}

function fnGetTransitValueForCalc(rowNo) {
    try {
        var ssformula = ssformulas;
        ssformula = ssformula.replace("TRANSIT", "TRANSIT");
        var C_TRANSIT = 0;
        if (ssformula.indexOf("TRANSIT") >= 0) {
            if ($("#txtTRANSIT-" + rowNo).val() != null && $("#txtTRANSIT-" + rowNo).val() != "") {
                C_TRANSIT = parseFloat($("#txtTRANSIT-" + rowNo).val());
            }
        }
        return C_TRANSIT;
    }
    catch (e) {
        fnMsgAlert("info", "Secondary Sales", "Invalid Transit value for the Product <b>" + $("#txtProduct_Name-" + rowNo).val() + "</b>. Please correct then proceed.");
        return false;
    }
}
// END: Get the Calculation values based SS_FORMULA privileges.


function fnGetClosingBalanceValue(rowNo) {
    try {
        var C_CB = 0;
        if ($("#txtCLOSING_BALANCE-" + rowNo).val() != null && $("#txtCLOSING_BALANCE-" + rowNo).val() != "") {
            C_CB = parseFloat($("#txtCLOSING_BALANCE-" + rowNo).val());
        }
        return C_CB;
    }
    catch (e) {
        fnMsgAlert("info", "Secondary Sales", "Invalid Closing Balance value for the Product <b>" + $("#txtProduct_Name-" + rowNo).val() + "</b>. Please correct then proceed.");
        return false;

    }
}

function fnGetSalesValue(rowNo) {
    try {
        var C_SALES = 0;
        if ($("#txtSALES-" + rowNo).val() != null && $("#txtSALES-" + rowNo).val() != "") {
            C_SALES = parseFloat($("#txtSALES-" + rowNo).val());

        }
        //if (ssformula.indexOf("FREEGOODS") >= 0) {
        //    if ($("#txtFREE_GOODS-" + rowNo).val() != undefined) {
        //        C_SALES = C_SALES + parseInt($("#txtFREE_GOODS-" + rowNo).val());
        //    }
        //}
        return C_SALES;
    }
    catch (e) {
        fnMsgAlert("info", "Secondary Sales", "Invalid Sales value for the Product <b>" + $("#txtProduct_Name-" + rowNo).val() + "</b>. Please correct then proceed.");
        return false;

    }
}

function fnCheckEdit() {
    debugger;
    if (productPrice_g[2].Data[0].Is_Check != "0" && ssEntryMode.toUpperCase() == "STOCKIEST") {
        $('#SecondarySalesDetails').hide();
        $('#productopoupLink').hide();
        $("#divInput").hide();
        fnMsgAlert('info', 'Secondary Sales', 'Kindly get your secondary sales for the previous month approved else system will not allow you to make current month entry');
        fnSecondarySalesReset();
        draftval = '1';
        product = '0';
        return false;
    }
    else {

        product = '1';

        $("#dvMainHeader").show();
        $('#SecondarySalesDetails').show();
        $('#productopoupLink').show();
        $("#divInput").show();
        draftval = '0';
    }
    debugger;
    if (parseInt(productPrice_g[4].Data[0].Is_Available) > 0 && ssEntryMode.toUpperCase() == "STOCKIEST") {
        if (productPrice_g[3].Data[0].Is_Unapproved != "0") {

            $('#SecondarySalesDetails').hide();
            $('#productopoupLink').hide();
            $("#divInput").hide();
            $('#drpMonth').attr('disabled', false);
            $('#drpYear').attr('disabled', false);
            $('#txtStatmentDate').removeAttr('readonly');
            $("#txtStockiestName").removeAttr('readonly');
            fnMsgAlert('info', 'Secondary Sales', 'Dear user you have already entered secondary sales for this customer in the subsequent months ');
            draftval = '1';
            product = '0';

            return false;
        }
        else {

            product = '1';

            $("#dvMainHeader").show();
            $('#SecondarySalesDetails').show();
            $("#divInput").show();
            $('#productopoupLink').show();
        }

    }
    else {

        product = '1';

        $("#dvMainHeader").show();
        $('#SecondarySalesDetails').show();
        $("#divInput").show();
        $('#productopoupLink').show();
    }
    debugger;
    if ($('#hdnStatus').val() == "" && $('#hdnStatus').val() != null) {
        if (parseInt(productPrice_g[4].Data[0].Is_CurrentMonth) > 0 && ssEntryMode.toUpperCase() == "STOCKIEST") {
            $('#SecondarySalesDetails').hide();
            $('#productopoupLink').hide();
            $("#divInput").hide();
            $('#drpMonth').attr('disabled', false);
            $('#drpYear').attr('disabled', false);
            $('#txtStatmentDate').removeAttr('readonly');
            $("#txtStockiestName").removeAttr('readonly');
            fnMsgAlert('info', 'Secondary Sales', 'Dear user you have already entered secondary sales for this customer . ');
            draftval = '1';
            product = '0';
            return false;
        }
        else {

            $("#dvMainHeader").show();
            $('#SecondarySalesDetails').show();
            $("#divInput").show();
            $('#productopoupLink').show();
        }
    }

    if (ssEntryMode.toUpperCase() == "REP") {

        $('#trStockiest').hide();
        $('#imgAdd').hide();

        if (productPrice_g[2].Data[0].Is_Check == "1") {
            $('#SecondarySalesDetails').hide();
            $('#productopoupLink').hide();
            $("#divInput").hide();
            fnMsgAlert('info', 'Secondary Sales', 'Dear user you have already entered secondary sales for this rep in the subsequent months ');
            product = '0';
            return false;
        }
        else {

            product = '1';

            $("#dvMainHeader").show();
            $('#SecondarySalesDetails').show();
            $("#divInput").show();
            $('#productopoupLink').show();
        }


        if ($('#hdnStatus').val() == "" && $('#hdnStatus').val() != null) {
            if (parseInt(productPrice_g[4].Data[0].Is_CurrentMonth) > 0) {
                $('#SecondarySalesDetails').hide();
                $('#productopoupLink').hide();
                $("#divInput").hide();
                fnMsgAlert('info', 'Secondary Sales', 'Dear user you have already entered secondary sales for this month . ');
                product = '0';

                return false;
            }
            else {

                product = '1';

                $("#dvMainHeader").show();
                $('#SecondarySalesDetails').show();
                $("#divInput").show();
                $('#productopoupLink').show();
            }
        }
    }

}


// START - SECONDARY SALES FOR CUSTOMER //
var SSSCUSTOMER = {

    defaults: {
        "gridRowNo_g": 0,
        "ApprovedCustomerJson_g": "",
        "ApprovedChemistJson_g": "",
        "ApprovedSSJson_g": "",
        "gridRow_g": 0,
        "baseCustomerJson_g": "",
        "baseChemistJson_g": "",
        "StockistProductJson_g": "",
        "rowNumber": 0,
        "ProductCustomerJson_g": new Array(),
        "ProductCustomerJson_Insert": new Array(),

        "formMode_g": "",
        "ProductAndQuantityJson_g": "",
        "CustomerJson_g": "",
    },

    //fnInitializeEvents: function () {
    //    SSSCUSTOMER.fnGetApprovedStockiestandCustomer();
    //},



    // Month and year value binding in dropdown
    fnMonthAndYear: function () {
        var select = $('#drpMonth');
        $('option', select).remove();
        $('#drpMonth').append("<option value='0'>-Select Month-</option>"); // new Option("-Select Month-", "0", true, true));
        $('#drpMonth').append("<option value='1'>January</option>");
        $('#drpMonth').append("<option value='2'>February</option>");
        $('#drpMonth').append("<option value='3'>March</option>");
        $('#drpMonth').append("<option value='4'>April</option>");
        $('#drpMonth').append("<option value='5'>May</option>");
        $('#drpMonth').append("<option value='6'>June</option>");
        $('#drpMonth').append("<option value='7'>July</option>");
        $('#drpMonth').append("<option value='8'>August</option>");
        $('#drpMonth').append("<option value='9'>September</option>");
        $('#drpMonth').append("<option value='10'>October</option>");
        $('#drpMonth').append("<option value='11'>November</option>");
        $('#drpMonth').append("<option value='12'>December</option>");
        $("#drpMonth").val('0');
        var currentYear = (new Date).getFullYear();
        currentYear = currentYear - 1;
        var yearselect = $("#drpYear");
        $('option', yearselect).remove();
        $('#drpYear').append("<option value='0'>-Select Year-</option>");
        for (var t = 0; t < 2; t++) {
            $('#drpYear').append("<option value='" + currentYear + "'>" + currentYear + "</option>");
            // $('#drpYear').append(new Option(currentYear, currentYear, true, true));
            currentYear = currentYear + 1;
        }
        $("#drpYear").val('0');
    },

    fnGetApprovedStockiestandCustomer: function () {

        $('#frmProduct').hide();
        $('#divstockList').show();
        SSSCUSTOMER.defaults.formMode_g = "";
        $('#imgloaddDOCLST').css('display', 'none');
        $('#docLSTLoadingTitle').css('display', 'none');
        $("#tbl_Stockiest_list").html('');

        var regionCode = $('#hdnRegionCode').val();
        var month = $('#drpMonth').val();
        var year = $('#drpYear').val();

        if (month == "0" && year == "0") {
            fnMsgAlert("info", "Stockiest Customer", "Select Month and Year");
            return false;
        }

        var ar = new Array();

        var a = {};

        a.name = "month";
        a.value = month;
        ar.push(a);

        var b = {};
        b.name = "year";
        b.value = year;
        ar.push(b);

        var c = {};
        c.name = "regionCode";
        c.value = regionCode;
        ar.push(c);

        HDAjax.requestInvoke("SecondarySales", "GetApprovedSS", ar, "POST",
        function (jsonResult) {

            SSSCUSTOMER.defaults.ApprovedSSJson_g = jsonResult[0].Data;
            SSSCUSTOMER.defaults.ApprovedCustomerJson_g = jsonResult[1].Data;
            SSSCUSTOMER.fnBindCustomerAutocomplete();
            SSSCUSTOMER.fnBindStockiestList(jsonResult[0].Data);
        },
              function (e) {
                  $('.dash-content-wrapper').unblock();
                  $.unblockUI();

              },
             function () {
                 $('.dash-content-wrapper').unblock();
                 $.unblockUI();
             });

    },

    fnBindCustomerAutocomplete: function () {

        if (SSSCUSTOMER.defaults.ApprovedCustomerJson_g != null && SSSCUSTOMER.defaults.ApprovedCustomerJson_g.length > 0) {
            var jsData = SSSCUSTOMER.defaults.ApprovedCustomerJson_g;
            var baseCustomerName = "[";
            for (var s = 0 ; s < jsData.length ; s++) {

                baseCustomerName += "{label:" + '"' + "" + jsData[s].Customer_Name + "_" + jsData[s].MDL_Number + "_" + jsData[s].Customer_Entity_Type + "_" + jsData[s].Region_Name + "" + '",' + "value:" + '"' + "" + jsData[s].Customer_Code + "_" + jsData[s].Region_Code + "" + '"' + "}";
                if (s < jsData.length - 1) {
                    baseCustomerName += ",";
                }
            }
            baseCustomerName += "];";
            SSSCUSTOMER.defaults.baseCustomerJson_g = eval(baseCustomerName);
        }
    },

    fnBindCustomerEdit: function () {

        //SSSCUSTOMER.defaults.CustomerJson_g = jsonResult[0].lstSecondarysalesforCustomer;

        if (SSSCUSTOMER.defaults.CustomerJson_g != null && SSSCUSTOMER.defaults.CustomerJson_g.length > 0) {
            var jsData = SSSCUSTOMER.defaults.CustomerJson_g;
            var baseCustomerName = "[";
            for (var s = 0 ; s < jsData.length ; s++) {

                baseCustomerName += "{label:" + '"' + "" + jsData[s].Customer_Name + '",' + "value:" + '"' + "" + jsData[s].Customer_Code + '"' + "}";
                if (s < jsData.length - 1) {
                    baseCustomerName += ",";
                }
            }
            baseCustomerName += "];";
            SSSCUSTOMER.defaults.CustomerJson_g = eval(baseCustomerName);
        }
    },


    fnBindStockiestList: function (stockiestJson) {

        SSSCUSTOMER.defaults.gridRow_g = 0;
        var tblstock = "";
        var rowNum = 1;
        if (stockiestJson != null && stockiestJson != '' && stockiestJson.length > 0) {
            for (var s = 0; s < stockiestJson.length; s++) {
                SSSCUSTOMER.fnCreateStockiestRow(stockiestJson, s);
            }
        }
        else {
            SSSCUSTOMER.fnCreateStockiestRow(stockiestJson, 0);
        }
    },

    fnCreateStockiestRow: function (stockiestJson, s) {

        $('#tbl_Stockiest_list').show();
        SSSCUSTOMER.defaults.gridRow_g++;
        var rowIndex = $('#tbl_Stockiest_list tr').length;
        var newListRow = document.getElementById('tbl_Stockiest_list').insertRow(parseInt(rowIndex++));
        //var newListRow_None = document.getElementById('tbl_StockiestNone_list').insertRow(parseInt(rowIndex++));

        newListRow.id = "stock_List_" + SSSCUSTOMER.defaults.gridRow_g;
        $(newListRow).addClass("grdRow");

        $("#stock_List_" + SSSCUSTOMER.defaults.gridRow_g).click(function () {

            $('#tbl_Stockiest_list tr').removeClass('fontweightbold');
            var row = this.id.split('_')[2];
            $("#stock_List_" + this.id.split('_')[2]).addClass('fontweightbold');
            SSSCUSTOMER.fnFillSSProducts(this.id.split('_')[2]);
        });

        //Row No
        var td1 = newListRow.insertCell(0);
        $(td1).html(rowIndex);
        //Customer Name
        var td2 = newListRow.insertCell(1);

        if (stockiestJson != "" && stockiestJson.length != 0) {

            $(td2).html('<input type="hidden" id="hdnstockiestName_' + SSSCUSTOMER.defaults.gridRow_g + '" value=\'' + stockiestJson[s].Customer_Name + '\' /><div id="spnDocName_' + SSSCUSTOMER.defaults.gridRow_g + '">' + stockiestJson[s].Customer_Name + '</span>');
            //stociestcode
            var td3 = newListRow.insertCell(1);
            $(td3).html('<input type="hidden" id="hdnstockiestCode_' + SSSCUSTOMER.defaults.gridRow_g + '" value=\'' + stockiestJson[s].Base_Code + '\' />');
            $(td3).css('display', 'none');
        }
        else {

            td2 = newListRow;
            $(td2).html('<span style="font-size: large;font-weight: 5px!important;font-weight: 500;">No Stockiest details found for the selected month and year</span>');
            $(td2).attr('disabled', 'disabled');
            $('#dvProductForm').hide();
            $("#stock_List_" + SSSCUSTOMER.defaults.gridRow_g).attr('disabled', 'disabled');
            $("#stock_List_" + SSSCUSTOMER.defaults.gridRow_g).prop('disabled', true);
        }
    },

    fnBindNextRow: function () {
        $('#tbl_Stockiest_list').show();
        var rowNo = parseInt($('#hdnbindRowNumber').val()) + 1;
        if (rowNo <= $('#tbl_Stockiest_list tr').length) {
            fnFillForm(rowNo);
        }
        else {
            fnFillForm("1");
        }
    },

    fnFillSSProducts: function (value) {

        if ($('#stock_List_' + value).css('display') == 'none') {
            SSSCUSTOMER.fnClear();
            return false;
        }

        if (SSSCUSTOMER.defaults.formMode_g == "Edit") {
            var result = confirm('The data you have entered/modified will be saved. Do you want to save and continue? \n Click Ok for save and continue.');
            if (!result) {
                SSSCUSTOMER.defaults.formMode_g = "";
                $('#dvProductForm').hide();
                $('#tbl_Stockiest_list tr').removeClass('fontweightbold');
                return false;
            }
            else {
                SSSCUSTOMER.fnInsertCustomerProductData();
                $('#tbl_Stockiest_list tr').removeClass('fontweightbold');
            }
        }
        else {
            SSSCUSTOMER.fnGetSSProducts(value);
        }
    },
    //rowposition,  = value
    fnGetSSProducts: function (value) {



        $('#frmProduct').hide();
        $('#dvProductForm').hide();

        var baseCode = $('#hdnstockiestCode_' + value + '').val();
        var regionCode = $('#hdnRegionCode').val();
        var month = $('#drpMonth').val();
        var year = $('#drpYear').val();
        // var ssDetailCode = $('#').val();

        var ar = new Array();

        var a = {};
        a.name = "baseCode";
        a.value = baseCode;
        ar.push(a);

        var b = {};
        b.name = "regionCode";
        b.value = regionCode;
        ar.push(b);

        var c = {};
        c.name = "month";
        c.value = month;
        ar.push(c);

        var d = {};
        d.name = "year";
        d.value = year;
        ar.push(d);


        HDAjax.requestInvoke("SecondarySales", "GetSSSProductdetails", ar, "POST",
       function (result) {

           if (result != null && result.length > 0) {
               var jsonResult = eval(result);
               SSSCUSTOMER.defaults.StockistProductJson_g = jsonResult[0].lstSecondarysalesProducts;
               SSSCUSTOMER.defaults.ProductCustomerJson_g = jsonResult[0].lstSecondarysalesforCustomer;
               SSSCUSTOMER.fnBindProductDetails(jsonResult[0].lstSecondarysalesProducts);
               SSSCUSTOMER.defaults.CustomerJson_g = jsonResult[0].lstSecondarysalesforCustomer;
               //SSSCUSTOMER.fnBindCustomerEdit();

           }
       },
             function (e) {
                 $('.dash-content-wrapper').unblock();
                 $.unblockUI();

             },
            function () {
                $('.dash-content-wrapper').unblock();
                $.unblockUI();
            });



    },

    fnEditSSProducts: function () {

    },

    fnBindProductDetails: function (jsonResult) {
        debugger;
        var tblProduct = "";
        var prodCount = jsonResult.length;
        ProductAndQuantityJson_g = jsonResult;
        if (jsonResult != null && jsonResult.length > 0) {

            for (var s = 0 ; s < jsonResult.length; s++) {
                tblProduct += "<center>";
                tblProduct += "<div class='listheaderbarforcustomer' style='width:98%;' id='divOverallProduct_" + s + "' onclick='SSSCUSTOMER.fnTableShowHide('tbl_Customer_" + s + "','spnproducts_" + s + "')'>";
                tblProduct += "<div class='collapse' id='spnproducts_" + s + "' >";
                tblProduct += "<div style='float:left' id='dvProductName_" + s + "'></div> ";
                tblProduct += "<span id='inputsLoadingTitle' class='loadingcaption'>" + jsonResult[s].Product_Name + " - Product Quantity " + jsonResult[s].Qty + "</span><input type='hidden' id='hdnProductClosingQty_" + s + "' value=" + jsonResult[s].Qty + ">";
                tblProduct += "<input type='hidden' id='hdnProductCode_" + s + "' value=" + jsonResult[s].Product_Code + "'/>";
                tblProduct += "<input type='hidden' id='hdnProductdetailsCode_" + s + "' value='" + jsonResult[s].SS_Details_Code + "' />";
                tblProduct += "</div>";

                var jsonProductcustomer = jsonPath(SSSCUSTOMER.defaults.ProductCustomerJson_g, "$.[?(@.SS_Details_Code=='" + jsonResult[s].SS_Details_Code + "')]");



                if (jsonProductcustomer.length > 0) {
                    SSSCUSTOMER.defaults.formMode_g = "Edit";
                    tblProduct += "<table id='tbl_Customer_" + s + "' style='width: 98.5%;margin-bottom:10px;'>";
                    tblProduct += "<thead>";
                    tblProduct += "<tr>";
                    tblProduct += "<th class='dcr_product_header' style='text-align:left;'>Customer Name</th>";
                    tblProduct += "<th class='dcr_product_header txtqty' style='text-align:left;padding-left:30px;width:10px'>Qty</th>";
                    tblProduct += "<th class='dcr_product_header'></th></tr></thead>";
                    tblProduct += "<tbody>";
                    for (var j = 0 ; j < jsonProductcustomer.length ; j++) {
                        //Created customer autocomplete
                        tblProduct += "<tr id='tbl_Customer_" + s + "$tr_" + s + "'>";
                        tblProduct += "<td>";
                        //Customer Name
                        tblProduct += "<input type='text' style='width: 98.5%;' id='tbl_Customer_" + s + "_txtCustomer_" + j + "' value='" + jsonProductcustomer[j].Customer_Name + "_" + jsonProductcustomer[j].MDL_Number + "_" + jsonProductcustomer[j].Customer_Entity_Type + "_" + jsonProductcustomer[j].Region_Name + "' class='autoCustomer txtCustomer setfocus' maxlength='299' ";
                        //tblProduct += "ondblclick='SSSCUSTOMER.fnCreateNewCustomerRow(null,this)' onkeyup='SSSCUSTOMER.fnCreateNewCustomerRow(null,this)' onblur='fnValidateAutofill(this," + 'SSSCUSTOMER.defaults.baseCustomerJson_g' + " ,\"txtCustomer_\",\"hdnCustomerCode_\");' /></td>";
                        tblProduct += "ondblclick='SSSCUSTOMER.fnCreateNewCustomerRow(null,this)' onkeyup='SSSCUSTOMER.fnCreateNewCustomerRow(null,this) onblur='fnValidateAutofill(this, " + SSSCUSTOMER.defaults.baseCustomerJson_g + " ,\"txtCustomer_\",\"hdnCustomerCode_\");' /></td>";
                        tblProduct += "<input type='hidden'  id='tbl_Customer_" + s + "_hdnCustomerCode_" + j + "' value='" + jsonProductcustomer[j].Customer_Code + "_" + jsonProductcustomer[j].Region_Code + "' /></td>";

                        //Quanity
                        tblProduct += "<td><input type='text' onkeyup='return isNumberKey(this);' id='tbl_Customer_" + s + "_txtQty_" + j + "' value='" + jsonProductcustomer[j].Quantity + "' /><input type='hidden' id='tbl_Customer_" + s + "_hdnSSlineId_" + j + "' value='" + jsonProductcustomer[j].SS_Line_Id + "' /></td>";
                        tblProduct += "</tr>";
                    }
                    tblProduct += "<tr id='tbl_Customer_" + s + "$tr_" + s + "'>";
                    tblProduct += "<td>";

                    tblProduct += "<input type='text' style='width: 98.5%;' id='tbl_Customer_" + s + "_txtCustomer_" + jsonProductcustomer.length + "' class='autoCustomer txtCustomer setfocus' maxlength='299' ";
                    tblProduct += "ondblclick='SSSCUSTOMER.fnCreateNewCustomerRow(null,this)' onkeyup='SSSCUSTOMER.fnCreateNewCustomerRow(null,this)' onblur='fnValidateAutofill(this, " + SSSCUSTOMER.defaults.baseCustomerJson_g + " ,\"txtCustomer_\",\"hdnCustomerCode_\");'/> ";
                    tblProduct += "<input type='hidden' id='tbl_Customer_" + s + "_hdnCustomerCode_" + jsonProductcustomer.length + "' /></td>";
                    //Quanity
                    tblProduct += "<td><input type='text' class='checkinteger' onkeyup='return isNumberKey(this);' id='tbl_Customer_" + s + "_txtQty_" + jsonProductcustomer.length + "' /><input type='hidden' id='tbl_Customer_" + s + "_hdnSSlineId_" + jsonProductcustomer.length + "' /></td>";
                    tblProduct += "</tr>";
                    tblProduct += "</tbody>";
                    tblProduct += "</table>";
                }
                else {
                    debugger;
                    tblProduct += "<table id='tbl_Customer_" + s + "' style='width: 98.5%;margin-bottom:10px;'>";
                    tblProduct += "<thead>";
                    tblProduct += "<tr>";
                    tblProduct += "<th class='dcr_product_header' style='text-align:left;'>Customer Name</th>";
                    tblProduct += "<th class='dcr_product_header txtqty' style='text-align:left;padding-left:30px;width:10px'>Qty</th>";
                    tblProduct += "<th class='dcr_product_header'></th></tr></thead>";

                    tblProduct += "<tbody>";
                    //Created customer autocomplete
                    //tblProduct += "<tr id='tbl_Customer_" + s + "$tr_" + s + "'>";
                    //tblProduct += "<td>";
                    //Customer Name
                    for (var i = 0; i < 2; i++) {
                        debugger;
                        tblProduct += "<tr id='tbl_Customer_" + s + "$tr_" + s + "'>";
                        tblProduct += "<td>";
                        tblProduct += "<input type='text' style='width: 98.5%;' id='tbl_Customer_" + s + "_txtCustomer_" + i + "' class='autoCustomer txtCustomer setfocus' maxlength='299' ";
                        tblProduct += "ondblclick='SSSCUSTOMER.fnCreateNewCustomerRow(null,this)' onkeyup='SSSCUSTOMER.fnCreateNewCustomerRow(null,this);' onblur='fnValidateAutofill(this, " + SSSCUSTOMER.defaults.baseCustomerJson_g + " ,\"txtCustomer_\",\"hdnCustomerCode_\");''/> ";

                        tblProduct += "<input type='hidden' id='tbl_Customer_" + s + "_hdnCustomerCode_" + i + "' /></td>";
                        //Quanity
                        tblProduct += "<td><input type='text' class='checkinteger' onkeyup='return isNumberKey(this);' id='tbl_Customer_" + s + "_txtQty_" + i + "' /><input type='hidden' id='tbl_Customer_" + s + "_hdnSSlineId_" + i + "' /></td>";
                        tblProduct += "</tr>";
                    }

                    rowNumber = parseInt(s) + 1;
                    tblProduct += "</tbody>";
                    tblProduct += "</table>";
                }
                tblProduct += "</div>";
                tblProduct += "</center>";
            }

            $('#div_procustomerdetails_entry').html(tblProduct);
            if (SSSCUSTOMER.defaults.baseCustomerJson_g != null && SSSCUSTOMER.defaults.baseCustomerJson_g.length > 0) {

                autoComplete(SSSCUSTOMER.defaults.baseCustomerJson_g, "txtCustomer_", "hdnCustomerCode_", "autoCustomer");
            }
            $('#frmProduct').show();
            $('#dvProductForm').show();

        }
        //$('#frmProduct').show();
        //$('#dvProductForm').show();
    },

    fnCreateNewCustomerRow: function (isDraft, obj) {
        debugger;
        SSSCUSTOMER.defaults.formMode_g = "Edit";
        SSSCUSTOMER.defaults.ProductCustomerJson_g;

        var objtblId = $(obj).parents().eq(1).attr('id').split('$')[0];
        var tblId = $("#" + objtblId);
        var tblRow = objtblId.split('_')[2];
        var rCnt = $("#" + objtblId + " tr").length;
        var tblRowId = rCnt - 1;
        var newRow = document.getElementById(objtblId).insertRow(parseInt(rCnt));
        newRow.id = objtblId + "$tr_" + tblRowId + "";

        var td1 = newRow.insertCell(0);
        var htmlvalue = "";
        if (isDraft) {
            //htmlvalue = "<input type='text' id='txtProd_" + productRowIndex_g + "' class='autoProduct txtproduct setfocus' maxlength='299'  onblur='fnValidateAutofill(this," + 'productAutoFill_g' + ",\"txtCustomer_\",\"hdnCustomerCode_\");' /><input type='hidden' id='hdnProd_" + productRowIndex_g + "'  />";
            htmlvalue = "<input type='text' id='txtProd_" + productRowIndex_g + "' class='autoProduct txtproduct setfocus' maxlength='299' onblur='fnValidateAutofill(this, " + SSSCUSTOMER.defaults.baseCustomerJson_g + " ,\"txtCustomer_\",\"hdnCustomerCode_\");'  />";

        }
        else {
            htmlvalue += "<input type='text'style='width: 98.5%;' id=" + objtblId + '_txtCustomer_' + tblRowId + "  class='autoCustomer txtCustomer setfocus' maxlength='299' ";
            htmlvalue += "ondblclick='SSSCUSTOMER.fnCreateNewCustomerRow(null,this)' onkeyup='SSSCUSTOMER.fnCreateNewCustomerRow(null,this)' onblur='fnValidateAutofill(this, " + SSSCUSTOMER.defaults.baseCustomerJson_g + " ,\"txtCustomer_\",\"hdnCustomerCode_\");' /><input type='hidden' id='tbl_Customer_" + tblRow + "_hdnCustomerCode_" + tblRowId + "' /> ";
        }
        $(td1).html(htmlvalue);
        $(td1).addClass("txtCustomer");


        var td2 = newRow.insertCell(1);
        var htmlValue = "";
        htmlValue += "<input type='text' onkeyup='return isNumberKey(this);' class='checkinteger' id=" + objtblId + '_txtQty_' + tblRowId + " />";
        htmlValue += "<input type='hidden' id=" + objtblId + '_hdnSSlineId_' + tblRowId + " />";
        $(td2).html(htmlValue)
        $(td2).addClass("txtqty");
        //$(td2).attr('align', 'center');

        if (obj != null) {
            obj.onkeyup = null;
            obj.ondblclick = null;
        }
        if (SSSCUSTOMER.defaults.baseCustomerJson_g.length != null && SSSCUSTOMER.defaults.baseCustomerJson_g.length > 0) {

            autoComplete(SSSCUSTOMER.defaults.baseCustomerJson_g, "txtCustomer_", "hdnCustomerCode_", "autoCustomer");

        }

        $(".").click(function () { $(this).select(); });
        $(".checkinteger").blur(function () { $(this).blur(function () { fnChekInteger(this) }); });

    },

    fnSetFormMode: function (event) {

        if (event != null && event.target != null && event.target.value == "Reset") {
            return true;
        }
        else {

            SSSCUSTOMER.defaults.formMode_g = "Edit";
        }
    },

    fnTableShowHide: function (tableid, spnid) {

        if ($('#' + tableid).css("display") == "none") {
            $('#' + tableid).fadeIn('slow');
            $('#' + spnid).removeClass('expand');
            $('#' + spnid).addClass('collapse');
        }
        else {
            $('#' + tableid).fadeOut('slow');
            $('#' + spnid).removeClass('collapse');
            $('#' + spnid).addClass('expand');
        }
    },

    sampleToolTip: function (id) {
        $('#' + id).tooltip({ effect: 'slide' });
    },

    fnInsertCustomerProductDetails: function () {

        if (SSSCUSTOMER.defaults.formMode_g == "Edit") {
            if (confirm('The data you have entered/modified will be saved. Do you want to save and continue? \n Click Ok for save and continue.')) {
                SSSCUSTOMER.fnInsertCustomerProductData(true);
            }
            else {
                $('#tbl_Stockiest_list tr').removeClass('fontweightbold');
                SSSCUSTOMER.defaults.formMode_g = "";
                $('#dvProductForm').hide();
            }
        }
        else {
            if (confirm('The data you have entered/modified will be saved. Do you want to save and continue? \n Click Ok for save and continue.')) {
                SSSCUSTOMER.fnInsertCustomerProductData(true);
            }
            else {
                $('#tbl_Stockiest_list tr').removeClass('fontweightbold');
                SSSCUSTOMER.defaults.formMode_g = "";
                $('#dvProductForm').hide();
            }
        }

    },

    fnInsertCustomerProductData: function () {
        var quantity = 0.0;

        debugger;
        //Have to write the validation
        SSSCUSTOMER.defaults.formMode_g == "Edit";
        if (SSSCUSTOMER.defaults.StockistProductJson_g != null && SSSCUSTOMER.defaults.StockistProductJson_g.length > 0) {

            SSSCUSTOMER.fnBindCustomerEdit();
            var totalProductsCount = SSSCUSTOMER.defaults.StockistProductJson_g.length;
            SSSCUSTOMER.defaults.ProductCustomerJson_g = [];
            for (var s = 0; s < totalProductsCount ; s++) {

                var ssdetailsCode = $('#hdnProductdetailsCode_' + s + '').val();
                var tblRowCount = $('#tbl_Customer_' + s + ' tbody tr').length;
                var c = [];
                var b = "";
                var prodQty = "";
                var uniqueArray = new Array();
                for (var a = 0 ; a <= tblRowCount ; a++) {
                    var customerName = "";
                    var customerEntity = "";
                    var customerCode = "";
                    var regionCode = "";

                    if ($('#tbl_Customer_' + s + '_txtCustomer_' + a + '').val() == "") {
                        debugger;
                        $('#tbl_Customer_' + s + '_hdnCustomerCode_' + a + '').val('');
                        $('#tbl_Customer_' + s + '_txtQty_' + a + '').val('');

                    }

                    if ($('#tbl_Customer_' + s + '_txtCustomer_' + a + '').val() != "" && $('#tbl_Customer_' + s + '_txtCustomer_' + a + '').val() != undefined) {
                        b = "";
                        prodQty = $("#hdnProductClosingQty_" + s).val();

                        if ($('#tbl_Customer_' + s + '_txtCustomer_' + a + '').val() != "" && $('#tbl_Customer_' + s + '_txtCustomer_' + a + '').val() != undefined) {
                            var validCustomer = jsonPath(SSSCUSTOMER.defaults.baseCustomerJson_g, "$.[?(@.label=='" + $('#tbl_Customer_' + s + '_txtCustomer_' + a + '').val() + "')]");

                            if (validCustomer == false) {
                                fnMsgAlert("info", "Stockiest Customer", "Invalid Customer Name For Product :" + SSSCUSTOMER.defaults.StockistProductJson_g[s].Product_Name);
                                $('#tbl_Customer_' + s + '_txtCustomer_' + a + '').val('');
                                $('#tbl_Customer_' + s + '_txtCustomer_' + a + '').focus();
                                return false;
                            }
                        }

                        if ($('#tbl_Customer_' + s + '_txtCustomer_' + a + '').val() != "" && $('#tbl_Customer_' + s + '_txtCustomer_' + a + '').val() != undefined) {

                            if ($('#tbl_Customer_' + s + '_hdnCustomerCode_' + a + '').val() == "") {

                                fnMsgAlert("info", "Stockiest Customer", "Invalid Customer Name For Product :" + SSSCUSTOMER.defaults.StockistProductJson_g[s].Product_Name);
                                $('#tbl_Customer_' + s + '_txtCustomer_' + a + '').val('');
                                $('#tbl_Customer_' + s + '_txtCustomer_' + a + '').focus();
                                return false;
                            }
                        }

                        if ($('#tbl_Customer_' + s + '_hdnCustomerCode_' + a + '').val() != "" && $('#tbl_Customer_' + s + '_hdnCustomerCode_' + a + '').val() != undefined) {
                            debugger;
                            customerName = $('#tbl_Customer_' + s + '_txtCustomer_' + a + '').val().split('_')[0];
                            customerEntity = $('#tbl_Customer_' + s + '_txtCustomer_' + a + '').val().split('_')[2];
                            customerCode = $('#tbl_Customer_' + s + '_hdnCustomerCode_' + a + '').val().split('_')[0];
                            regionCode = $('#tbl_Customer_' + s + '_hdnCustomerCode_' + a + '').val().split('_')[1];

                            if ($('#tbl_Customer_' + s + '_txtCustomer_' + a + '').val() !== "" && $('#tbl_Customer_' + s + '_txtCustomer_' + a + '').val() != undefined) {

                                if ($('#tbl_Customer_' + s + '_txtCustomer_' + a + '').val() !== "" && $('#tbl_Customer_' + s + '_txtCustomer_' + a + '').val() != undefined) {
                                    if ($('#tbl_Customer_' + s + '_txtQty_' + a + '').val() == "") {
                                        fnMsgAlert("info", "Stockiest Customer", "Quantity cannot be empty for Product :" + SSSCUSTOMER.defaults.StockistProductJson_g[s].Product_Name + " and Customer :" + $('#tbl_Customer_' + s + '_txtCustomer_' + a + '').val().split('_')[0]);
                                        $('#tbl_Customer_' + s + '_txtQty_' + a + '').focus();
                                        return false;
                                    }
                                }


                                if (!isNaN($('#tbl_Customer_' + s + '_txtQty_' + a + '').val())) {
                                    var qty = $('#tbl_Customer_' + s + '_txtQty_' + a + '').val();
                                }
                                else {
                                    fnMsgAlert("info", "Stockiest Customer", "Enter only numbers in Quantity");
                                    $('#tbl_Customer_' + s + '_txtQty_' + a + '').val('');
                                    $('#tbl_Customer_' + s + '_txtQty_' + a + '').focus();
                                    return false;
                                }

                                if (/^[0-9]*$/.test($('#tbl_Customer_' + s + '_txtQty_' + a + '').val()) == false) {
                                    fnMsgAlert("info", "Stockiest Customer", "Decimal values are not allowed in Quantity");
                                    $('#tbl_Customer_' + s + '_txtQty_' + a + '').val('');
                                    $('#tbl_Customer_' + s + '_txtQty_' + a + '').focus();
                                    return false;
                                }


                                if (Math.round($('#tbl_Customer_' + s + '_txtQty_' + a + '').val()) != $('#tbl_Customer_' + s + '_txtQty_' + a + '').val()) {
                                    fnMsgAlert("info", "Stockiest Customer", "Enter only numeric values in Quantity");
                                    $('#tbl_Customer_' + s + '_txtQty_' + a + '').val('');
                                    $('#tbl_Customer_' + s + '_txtQty_' + a + '').focus();
                                    return false;
                                }

                                var ssLineId = $('#tbl_Customer_' + s + '_hdnSSlineId_' + a + '').val();
                                var d = {};

                                b = SSSCUSTOMER.defaults.StockistProductJson_g[s].Product_Code + "-" + customerCode + "-" + customerName;

                                if ($.inArray(b, c) != -1) {
                                    fnMsgAlert("info", "Stockiest Customer", "Duplication of Product : " + SSSCUSTOMER.defaults.StockistProductJson_g[s].Product_Name + "<br/> and Customer: " + customerName + " is not allowed");
                                    return false;
                                }
                                else {
                                    c.push(b);
                                }

                                d.SS_Details_Code = ssdetailsCode;
                                d.Product_Name = "";
                                d.Product_Code = "";
                                d.Customer_Code = customerCode;

                                if (customerName != "" && customerEntity != "") {
                                    d.Customer_Name = customerName;
                                    d.Customer_Entity_Type = customerEntity;
                                    d.SS_Line_ID = ssLineId;
                                    d.Quantity = qty;
                                } else {
                                    d.Customer_Name = "";
                                    d.Customer_Entity_Type = "";
                                    d.SS_Line_ID = "";

                                }
                                debugger;
                                d.Region_Code = regionCode;
                                SSSCUSTOMER.defaults.ProductCustomerJson_g.push(d);
                                quantity = quantity + parseInt($('#tbl_Customer_' + s + '_txtQty_' + a + '').val());
                                SSSCUSTOMER.defaults.CustomerJson_g = "";
                                if (parseInt(quantity) > parseInt(prodQty)) {
                                    fnMsgAlert("info", "Stockiest Customer", "Quantity exceeds the Sales for Product :" + SSSCUSTOMER.defaults.StockistProductJson_g[s].Product_Name);
                                    quantity = 0;
                                    return false;
                                }
                            }
                        }
                        else {
                            var ssdetailsCode = $('#hdnProductdetailsCode_' + s + '').val();
                            var ssLineId = $('#tbl_Customer_' + s + '_hdnSSlineId_' + a + '').val();
                            var d = {};
                            d.SS_Details_Code = ssdetailsCode;
                            d.Product_Name = "";
                            d.Product_Code = "";
                            d.Customer_Name = "";
                            d.Customer_Entity_Type = "";
                            d.SS_Line_ID = ssLineId;
                            d.Region_Code = "";
                            SSSCUSTOMER.defaults.ProductCustomerJson_g.push(d);
                        }
                    }
                    else {
                        var ssdetailsCode = $('#hdnProductdetailsCode_' + s + '').val();
                        var ssLineId = $('#tbl_Customer_' + s + '_hdnSSlineId_' + a + '').val();
                        var d = {};
                        d.SS_Details_Code = ssdetailsCode;
                        d.Product_Name = "";
                        d.Product_Code = "";
                        d.Customer_Name = "";
                        d.Customer_Entity_Type = "";
                        d.SS_Line_ID = ssLineId;
                        d.Region_Code = "";
                        SSSCUSTOMER.defaults.ProductCustomerJson_g.push(d);
                        quantity = 0;
                    }

                    //quantity = 0;
                }
            }


            var ar = new Array();

            var a = {};
            a.name = "customerProducts_arr";
            a.value = JSON.stringify(SSSCUSTOMER.defaults.ProductCustomerJson_g);
            ar.push(a);

            var b = {};
            b.name = "formstatus";
            b.value = SSSCUSTOMER.defaults.formMode_g;
            ar.push(b);


            HDAjax.requestInvoke("SecondarySales", "InsertSSProductforCustomer", ar, "POST",
           function (jsonResult) {

               fnMsgAlert("info", "Stockiest Customer", "Saved Successfully");
               SSSCUSTOMER.defaults.formMode_g = "";
               SSSCUSTOMER.defaults.CustomerJson_g = "";
               SSSCUSTOMER.fnGetApprovedStockiestandCustomer();
               return;
           },
                 function (e) {
                     fnMsgAlert("info", "Stockiest-Customer", "There is some issue. Please contact support team.");
                     $('.dash-content-wrapper').unblock();
                     $.unblockUI();

                 },
                function () {
                    $('.dash-content-wrapper').unblock();
                    $.unblockUI();
                });
        }
    },

    fnClear: function () {
    },

    fncancel: function () {
        debugger;
        if (SSSCUSTOMER.defaults.formMode_g == "Edit") {

            if (confirm('Do you wish to cancel the changes?')) {

                $('#dvProductForm').hide();
                SSSCUSTOMER.defaults.formMode_g = "";
                $('#tbl_Stockiest_list tr').removeClass('fontweightbold');
                return false;

            }
            //else {
            //    
            //    //$('#dvProductForm').hide();
            //    //SSSCUSTOMER.defaults.formMode_g = "";
            //    $('#tbl_Stockiest_list tr').removeClass('fontweightbold');
            //    return false;
            //}
        }
        else {

            SSSCUSTOMER.defaults.formMode_g = "";
            fnFillForm('default');
        }
    },
};

function fnFillForm(rowPosition, doctorjson, productJson, chemistJson, rcpaJson) {

    if ($('#dvProductForm').css('display') == 'none') {
        return false;
    }

    if (SSSCUSTOMER.defaults.formMode_g == "Edit") {
        var result = confirm('The data you have entered/modified will be saved. Do you want to save and continue? \n Click Ok for save and continue.');
        if (!result) {

            //$('#dvProductForm').hide();
            SSSCUSTOMER.defaults.formMode_g = "";
            $('#tbl_Stockiest_list tr').removeClass('fontweightbold');
            return false;
        }
        else {
            SSSCUSTOMER.defaults.formMode_g = "";
            //$('#dvProductForm').hide();
            $('#tbl_Stockiest_list tr').removeClass('fontweightbold');


        }
    }
    else {

        $('#dvProductForm').hide();
        SSSCUSTOMER.defaults.formMode_g = "";
    }
    SSSCUSTOMER.defaults.formMode_g = "";
}


// Numeric only control handler
function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
}
// END - SECONDARY SALES FOR CUSTOMER //

function fnCheckPreviousStockSales(savemode) {
    debugger;
    //Here we validate if all the previous month stocks have to be entered
    //even during draft stage. If the setting is ON, then we check, else we don't
    //3 is draft
    if (savemode == "3") {
        if (!IsDraftValidationReq) {
            fnPrimarySalesCheck();
        }
        else {
            fnInsertSecondarySalesValues();
        }
    }
    else {
        fnPrimarySalesCheck();
    }
}

function fnPrimarySalesCheck() {
    var secstrng = [];
    secstrng = secondaryDetails.split('~');
    var appliedProductArray = new Array();
    for (var i = 0; i < secstrng.length - 1; i++) {
        appliedProductArray.push(secstrng[i].split('^')[1]);
    }

    var pr = new Array()

    for (var i = 0; i < PSDetails.length; i++) {
        pr.push(PSDetails[i].Product_Code);
    }
    pr = pr.unique();
    var prodArray = [];

    for (var i = 0; i < pr.length; i++) {
        if ($.inArray(pr[i], appliedProductArray) == -1) {
            prodArray.push(pr[i]);
        }
    }

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/SecondarySales/GetSecProductAutoFill ',
        data: 'userCode=' + selectedUserCode + '&ProductTypeCode=' + SSProductBringType + '&regionCode=' + regionCode + '&entryMode=' + ssEntryMode + '&stockiestCode=' + $('#hdnStockiestCode').val(),
        async: false,
        success: function (response) {
            debugger;
            productAutofill_ProductCheck = response.Data;
        }
    });

    var prodNames = [];
    for (var i = 0; i < prodArray.length; i++) {
        var prjson = jsonPath(productAutofill_ProductCheck[0], "$.[?(@.productCode=='" + prodArray[i] + "')]");
        if (prjson != false) {
            prodNames.push(prjson[0].Product_Name);
        }
    }

    if (prodNames.length > 0) {
        $.unblockUI();
        var alerthtml = "";
        alerthtml += "<h3 style='margin-top: 35px;'>You have missed to enter some product(s) which are entered in primary sales. Kindly enter secondary sales for the all products which are entered in primary sales. \nThe below mentioned products are missing in secondary sales.</h3><br/>";

        alerthtml += '<table class="table table-bordered" style="border-collapse: collapse;font-size: 14px;">';
        alerthtml += '<thead>';
        alerthtml += '<tr>';
        alerthtml += '<th>Sno</th>';
        alerthtml += '<th>Product Name</th>';
        alerthtml += '</tr>';
        alerthtml += '</thead>';
        alerthtml += '<tbody>';
        for (var p = 0; p < prodNames.length; p++) {
            alerthtml += '<tr>';
            alerthtml += '<td>' + (p + 1) + '</td>';
            alerthtml += '<td>' + prodNames[p] + '</td>';
            alerthtml += '</tr>';
        }
        alerthtml += '</tbody>';
        alerthtml += '</table>';

        $('#dvalert').show()
        $('#dvDetails').html(alerthtml);
        $("#dvalert").overlay().load();
        return false;
    }
    else {
        fnEntryProductCheck(appliedProductArray);
    }
}

function fnEntryProductCheck(appliedProductArray) {
    debugger;
    ssEntryProductCheck = jsonPath(userPrivilegeContainer_g[0], "$.Data[?(@.PrivilegeName=='SS_ENTRY_PRODUCT_CHECK')]");
    if (ssEntryProductCheck != "" && ssEntryProductCheck != null && ssEntryProductCheck != 'undefined' && ssEntryProductCheck != false) {
        ssEntryProductCheck = ssEntryProductCheck[0].PrivilegeValue;
        if (ssEntryProductCheck == "YES") {
            fnGetSecProductAutoFill(appliedProductArray);
        }
        else {
            fnInsertSecondarySalesValues();
        }
    }
    else {
        fnInsertSecondarySalesValues();
    }
}

function fnGetSecProductAutoFill(appliedProductArray) {
    debugger;
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/SecondarySales/GetSecProductAutoFill ',
        data: 'userCode=' + selectedUserCode + '&ProductTypeCode=' + SSProductBringType + '&regionCode=' + regionCode + '&entryMode=' + ssEntryMode + '&stockiestCode=' + $('#hdnStockiestCode').val(),
        async: false,
        success: function (response) {
            debugger;
            productAutofill_ProductCheck = response.Data;
            fnGetClosingBalanceGreaterThanZero(appliedProductArray);
        }
    });
}

function fnGetClosingBalanceGreaterThanZero(appliedProductArray) {
    debugger;
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/SecondarySales/GetClosingBalanceGreaterThanZero',
        data: '&productAutofill=' + escape(JSON.stringify(productAutofill_g[0].Data)) + '&productPrice=' + escape(JSON.stringify(productPrice_g[0].Data)) + '&openingBalances=' + escape(JSON.stringify(productAutofill_ProductCheck[4].Data)) + '&year=' + yearVal + '&month=' + monthVal + '&StockiestCode=' + $('#hdnStockiestCode').val() + '&priceType=' + escape(JSON.stringify(productPrice_g[1].Data)) + '&regionCode=' + regionCode,
        async: false,
        success: function (response) {
            debugger;
            var res = eval(response);
            var openig = [];
            var preSSMonth = month;
            var previousmonth = "";
            previousmonth = month - 1;
            if (preSSMonth == "1") {
                previousmonth = "12";
            }

            openig = jsonPath(productAutofill_g[4].Data, "$.[?(@.Opening_Balance > 0  & @.Month=='" + previousmonth + "')]");

            debugger;
            var arrMismatchProduct = [];
            var misMatchResult = false;
            for (var i = 0; i < res.length; i++) {
                if ($.inArray(res[i].Product_Code, appliedProductArray) == -1) {
                    misMatchResult = true;
                    arrMismatchProduct.push(res[i]);
                }
            }
            debugger;
            if (misMatchResult) {
                $.unblockUI();
                var alerthtml = "";
                alerthtml += "<h3 style='margin-top: 35px;'>You have not selected all products which are having closing balance.</h3><br/>";
                alerthtml += '<table class="table table-bordered" style="border-collapse: collapse;font-size: 14px;">';
                alerthtml += '<thead>';
                alerthtml += '<tr>';
                alerthtml += '<th>Sno</th>';
                alerthtml += '<th>Product Name</th>';
                alerthtml += '</tr>';
                alerthtml += '</thead>';
                alerthtml += '<tbody>';
                for (var p = 0; p < arrMismatchProduct.length; p++) {
                    var productData = $.grep(productAutofill_g[0].Data, function (v) {
                        return v.productCode == arrMismatchProduct[p].Product_Code;
                    });
                    if (productData != null && productData.length) {
                        alerthtml += '<tr>';
                        alerthtml += '<td>' + (p + 1) + '</td>';
                        alerthtml += '<td>' + productData[0].Product_Name + '</td>';
                        alerthtml += '</tr>';
                    }
                }
                alerthtml += '</tbody>';
                alerthtml += '</table>';

                $('#dvalert').show();
                $('#dvDetails').html('');
                $('#dvDetails').html(alerthtml);
                $("#dvalert").overlay().load();
                return false;
            }
            else {
                fnInsertSecondarySalesValues();
            }
        }
    });
}




//////
function fnInsertSecondarySalesValues() {
    debugger;
    var obj = {
        Month: month,
        Year: year,
        User_Code: selectedUserCode,
        Region_Code: regionCode,
        Base_Code: baseCode,
        StatementDate: statementDate.split('/')[2] + "-" + statementDate.split('/')[1] + "-" + statementDate.split('/')[0],
        BaseTypeCode: baseTypeCode,
        SS_Status: ssStatus,
        Customer_Code: customerCode,
        Customer_Type: customerEntityType,
        Entry_Mode: ssEntryMode,
        Draft_Mode: savemode
    }
    var objDetails = {
        lstSecondaryDetails: SalesArr,
        objDet: obj
    }

    $.ajax({
        url: '../HiDoctor_Activity/SecondarySales/InsertSecondarySalesValues',
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(objDetails),
        //data: "tblSecondaryDetails=" + secondaryDetails + "&month=" + month + "&year=" + year + "&userCode=" + selectedUserCode + "&regionCode=" + regionCode + "&baseCode=" + baseCode + "&stDate=" + statementDate +
        //"&baseTypeCode=" + baseTypeCode + "&status=" + ssStatus + "&cusCode=" + customerCode + "&cusType=" + customerEntityType + "&EntryMode=" + ssEntryMode + "&draftMode=" + savemode + '&openingBalances=' + escape(JSON.stringify(productAutofill_g[4].Data)),
        async: false,
        success: function (result) {
            debugger;
            SalesArr = [];
            if (result > 0) {
                $.unblockUI();
                fnMsgAlert('success', 'Secondary Sales', 'Saved successfully.');
                fnCreateSecandryTable(selectedUserCode, regionCode);
                fnMonthAndYear();
                $('#hdnStatus').val('')
                $('#hdnStockiestCode').val('');
                $('#txtStockiestName').val('');
                $('#txtStatmentDate').val('');
                $('#txtStatmentDate').attr('disabled', false);
                $('#txtStockiestName').attr('disabled', false);
                $('#drpMonth').attr('disabled', false);
                $('#drpYear').attr('disabled', false);
                $('#unapprovedRemarks').html('');
                productCode = "", month = "", year = "", statementDate = "", baseTypeCode = "", baseCode = "", ssStatus = "", ProductRemarks = "";
                customerCode = "", customerEntityType = "", divisionCode = "";
                openingBalance = 0.0, purchase = 0.0, purchaseReturn = 0.0, unitrate = 0;
                hdnOpeningBalance = 0.0;
                hdnIs_Manually_Edited = "";
                sales = 0.0, salesReturn = 0.0, transit = 0.0, closingBalance = 0.0, freeGoods = 0.0;
            }
            else {
                $.unblockUI();
                fnMsgAlert('info', 'Secondary Sales', 'Insertion Failed.');
                return false;
            }
        }
    });
}