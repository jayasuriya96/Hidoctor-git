

// Open Sales Order
function fnOpenSalesOrder() {
    $.mobile.changePage("/HiDoctor_Activity/OTC/SalesOrder", {
        type: "post",
        reverse: false,
        changeHash: false
    });
}

//Sale Order customer selection
function fnOpenSaleOrderEntry(id) {
    var regionCode = "";
    if (childCnt > 1) { regionCode = $('#ddlMyCustList').val(); }
    else { regionCode = "SESSION"; }
    $.mobile.changePage("/HiDoctor_Activity/OTC/SalesOrderEntry?customerCode=" + id.split('^')[0] + "&customerName=" + id.split('^')[1] + "&Address=" + escape(id.split('^')[2]) + "&salesPersonCode=" + regionCode + "&tinNumber=" + escape(id.split('^')[3]) + "&cstNumber=" + escape(id.split('^')[4]), {
        type: "post",
        reverse: false,
        changeHash: false
    });
}

function fnNavSaleOrderEntry(custCode, custName, salesPersonCode, address, tinNumb, cstNumb) {

    $.mobile.changePage("/HiDoctor_Activity/OTC/SalesOrderEntry?customerCode=" + custCode + "&customerName=" + custName + "&Address=" + escape(address) + "&salesPersonCode=" + salesPersonCode + "&tinNumber=" + tinNumb + "&cstNumber=" + cstNumb, {
        type: "post",
        reverse: false,
        changeHash: false
    });
}

// Open Sale Order Add Product
function fnOpenSOAddProduct() {
    $.mobile.changePage("/HiDoctor_Activity/OTC/SOAddProduct", {
        type: "post",
        reverse: false,
        changeHash: false
    });
}

// Open Order History
function fnOpenOrderHistory() {
    $.mobile.changePage("/HiDoctor_Activity/OTC/OrderHistory", {
        type: "post",
        reverse: false,
        changeHash: false
    });
}

// Open Order Detail View
function fnOpenOrderHistoryDetailView(id) {
    $.mobile.changePage("/HiDoctor_Activity/OTC/OrderHistoryDetailView?orderID=" + id.split('_')[0] + "&from=" + id.split('_')[1], {
        type: "post",
        reverse: false,
        changeHash: false
    });
}

// Open Customer List
function fnOpenCustomerList() {
    $.mobile.changePage("/HiDoctor_Activity/OTC/SalesOrderCustomerList", {
        type: "post",
        reverse: false,
        changeHash: false
    });
}

//open Order Status
function fnOpenOrderStatus() {
    $.mobile.changePage("/HiDoctor_Activity/OTC/SalesOrderStatus", {
        type: "post",
        reverse: false,
        changeHash: false
    });
}

//Otc Order Status Edit
function fnOpenOrderStatusEdit(id) {

    $.mobile.changePage("/HiDoctor_Activity/OTC/OrderStatusEdit?orderCode=" + id.split('_')[0] + "&isEdit=" + id.split('_')[1], {
        type: "post",
        reverse: false,
        changeHash: false
    });
}

// Open Order Detail Edit
function fnOpenOrderHistoryDetailEdit(id) {
    $.mobile.changePage("/HiDoctor_Activity/OTC/SOAddProduct?orderId=" + id.split('_')[0] + "&orderDate=" + id.split('_')[1] + "", {
        type: "post",
        reverse: false,
        changeHash: false
    });
}

// open Approve Order 
function fnOpenApproveOrder() {
    $.mobile.changePage("/HiDoctor_Activity/OTC/ApproveOrder", {
        type: "post",
        reverse: false,
        changeHash: false
    });
}


// Open Order Bulk Approval
function fnOpenOrderBulkApproval(userCode) {
    $.mobile.changePage("/HiDoctor_Activity/OTC/SalesOrderBulkApproval?userCode=" + userCode, {
        type: "post",
        reverse: false,
        changeHash: false
    });
}

// Open Order Single Approval
function fnOpenOrderSingleApproval(id) {
    $.mobile.changePage("/HiDoctor_Activity/OTC/SalesOrderSingleApproval?orderID=" + id.split('^')[0] + "&userCode=" + id.split('^')[1], {
        type: "post",
        reverse: false,
        changeHash: false
    });
}

//Open DCR Locked UserS

function fnOpenDcrLockeduserScreen(userCode) {
    $.mobile.changePage("/HiDoctor_Activity/MobileNotification/DCRLockDetail?userCode=" + userCode, {
        type: "post",
        reverse: false,
        changeHash: false
    });
}


// Customer Selection
function fnLoadSaleOrderCustomerSelection() {

    try {
        $.mobile.loading('show');
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Activity/OTC/GetSalesOrderLoadDetails',
            data: "user=aa",
            success: function (response) {
                var jLoad = eval('(' + response + ')');

                if (!(jLoad.Tables === undefined) && jLoad.Tables.length > 0 && jLoad.Tables[0].Rows.length > 0) {
                    //jLoad.Tables[0].Rows[0]["Customer_Entity_Type"]
                    var rbCont = "";
                    rbCont = '<div data-role="content"><div  data-role="fieldcontain">';
                    rbCont += '<fieldset data-role="controlgroup" data-type="horizontal" data-mini="true">';
                    rbCont += '<legend>Select Customer type:</legend>';
                    var isCheck = "";
                    for (var i = 0; i < jLoad.Tables[0].Rows.length; i++) {
                        if (i == 0) {
                            isCheck = 'checked="checked"';
                        }
                        else {
                            isCheck = "";
                        }
                        rbCont += '<input id="rbEntity_' + i + '" name="custEntity" value="' + jLoad.Tables[0].Rows[i]["Customer_Entity_Type"].toUpperCase() + '" type="radio"  ' + isCheck + ' >';
                        rbCont += '<label for="rbEntity_' + i + '">' + jLoad.Tables[0].Rows[i]["Customer_Entity_Type"].toUpperCase() + '</label>';
                    }
                    rbCont += '</fieldset>';
                    rbCont += '</div></div>';
                    $("#rbCustomerEntity").html(rbCont).trigger('create');
                }
                else {
                    $("#rbCustomerEntity").html("You have no Customers.").trigger('create');
                }
                if (!(jLoad.Tables === undefined) && jLoad.Tables.length > 1) {
                    $("#dvMyCustList").css("display", "");
                    for (var j = 0; j < jLoad.Tables[1].Rows.length; j++) {
                        $('#ddlMyCustList').append('<option value="' + jLoad.Tables[1].Rows[j].Region_Code + '" >' + jLoad.Tables[1].Rows[j].User_Name + '</option>');
                    }
                    $("#ddlMyCustList :selected").text("My Customer List");
                    $("#ddlMyCustList").selectmenu('refresh');
                    childCnt = jLoad.Tables[1].Rows.length;
                }
                $.mobile.loading('hide');
            },
            error: function (e) {
                $.mobile.loading('hide');
                fnMsgAlert('error', 'Error', 'GetSalesOrderLoadDetails Failed.');
            }
        });
    }
    catch (e) {
        fnMsgAlert('error', 'Error', e.message);
        $.mobile.loading('hide');
        return false;
    }
}

function fnCustomerSearch() {
    $.mobile.loading('show');
    var regionCode = "";

    if ($("#txtCustSelection").val() == "") {
        $.mobile.loading('hide');
        fnMsgAlert("info", "Sales Order-Customer Selection", "Please enter the Matching string.");
        $("#txtCustSelection").focus();
        return false;
    }
    if ($("#txtCustSelection").val().length < 3) {
        $.mobile.loading('hide');
        fnMsgAlert("info", "Sales Order-Customer Selection", "Please enter atleast 3 characters.");
        $("#txtCustSelection").focus();
        return false;
    }

    if (!(fnCheckRemarksSpecialChar("#txtCustSelection"))) {
        $.mobile.loading('hide');
        fnMsgAlert("info", "Sales Order-Customer Selection", "Please remove special characters.");
        $("#txtCustSelection").focus();
        return false;
    }


    if (childCnt > 1) {
        regionCode = $('#ddlMyCustList').val();
    }
    else {
        regionCode = "SESSION";
    }

    try {
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Activity/OTC/GetCustomerDetails',
            data: "customerEntity=" + $("input:radio[name=custEntity]:checked").val() + "&regionCode=" + regionCode + "&match=" + $("#txtCustSelection").val(),
            success: function (response) {
                //var jLoad = eval('(' + response + ')');
                var jLoad = response;

                if (!(jLoad === undefined) && jLoad.length > 0) {
                    var lstCustCont = "";
                    lstCustCont = '<div data-role="content">';
                    lstCustCont += '<ul id="lstCustomer" data-role="listview" data-divider-theme="b" data-inset="true">';
                    lstCustCont += ' <li data-role="list-divider" role="heading">Search Result</li>';

                    for (var a = 0; a < jLoad.length; a++) {
                        lstCustCont += '<li data-theme="c">';
                        lstCustCont += '<a href="#" data-transition="turn" onclick="fnOpenSaleOrderEntry(\'' + jLoad[a]["Customer_Code"] + '^' + jLoad[a]["Customer_Name"] + '^' + escape(jLoad[a]["Address"]) + '^' + escape(jLoad[a]["Tin_Number"]) + '^' + escape(jLoad[a]["CST_Number"]) + '\')">' + jLoad[a]["Customer_Name"] + '</a>';
                        lstCustCont += '</li>';
                    }
                    lstCustCont += '</ul>';
                    lstCustCont += '</div>';
                    $("#dvSearchCustList").html(lstCustCont).trigger('create');
                    $.mobile.loading('hide');
                }
                else {
                    $("#dvSearchCustList").html("<span style='color:red;'>No search result found.</span>").trigger('create');
                    $.mobile.loading('hide');
                }
            },
            error: function (e) {
                $.mobile.loading('hide');
                fnMsgAlert('error', 'Error', 'GetCustomerDetails Failed.');
            }
        });
    }
    catch (e) {
        $.mobile.loading('hide');
        fnMsgAlert('error', 'Error', e.message);
        return false;
    }
}



//****************** Add Product ************************************
function fnOpenProductSearch() {

    $('#dvOTCProductPopup').simpledialog2();
}

var searchPrd = "";

function fnBindProductSearch(custCode, salesPersonCode) {
    $.mobile.loading('show');

    $("#lblOTCProdSearchErr").html("");
    //product search txt validation.
    if ($("#txtOTCProductSN").val() == "" & $("#txtOTCProductSearch").val() == "") {
        $.mobile.loading('hide');
        $("#lblOTCProdSearchErr").html("Please enter any one Matching string.");
        return false;
    }
    if ($("#txtOTCProductSN").val().length > 0 && $("#txtOTCProductSN").val().length < 3) {
        $.mobile.loading('hide');
        $("#lblOTCProdSearchErr").html("Please enter atleast 3 characters.");
        $("#txtOTCProductSN").focus();
        return false;
    }
    if ($("#txtOTCProductSearch").val().length > 0 && $("#txtOTCProductSearch").val().length < 3) {
        $.mobile.loading('hide');
        $("#lblOTCProdSearchErr").html("Please enter atleast 3 characters.");
        $("#txtOTCProductSearch").focus();
        return false;
    }

    if (!(fnCheckRemarksSpecialChar("#txtOTCProductSN"))) {
        $.mobile.loading('hide');
        $("#lblOTCProdSearchErr").html("Please remove special characters.");
        $("#txtOTCProductSN").focus();
        return false;
    }

    if (!(fnCheckRemarksSpecialChar("#txtOTCProductSearch"))) {
        $.mobile.loading('hide');
        $("#lblOTCProdSearchErr").html("Please remove special characters.");
        $("#txtOTCProductSearch").focus();
        return false;
    }


    var matchingString = "", columnName = "";
    if ($("#txtOTCProductSN").val() != "" & $("#txtOTCProductSearch").val() != "") {
        matchingString = $("#txtOTCProductSN").val() + '^' + $("#txtOTCProductSearch").val();
        columnName = "BOTH";
    }
    else if ($("#txtOTCProductSN").val() != "" & $("#txtOTCProductSearch").val() == "") {
        matchingString = $("#txtOTCProductSN").val();
        columnName = "SHORT";
    }
    else {
        matchingString = $("#txtOTCProductSearch").val();
        columnName = "PRODUCT";
    }
    try {
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Activity/OTC/GetProductDetails',
            data: "regionCode=" + salesPersonCode + "&match=" + matchingString + "&columnName=" + columnName,
            success: function (response) {
                var jLoad = response;
                var isAdd = 0;
                if (searchPrd.length == 0) {
                    searchPrd = jLoad;
                }
                else {
                    isAdd = 1;
                }
                if (!(jLoad === undefined) && jLoad.length > 0 && jLoad[0]["Product_Code"] != null) {
                    var content = "";
                    content = '<div data-role="content">';
                    content += '<ul id="lstOTCProduct" data-role="listview" data-divider-theme="b" data-inset="true">';
                    content += '<li data-role="list-divider" role="heading">Search Results</li>';
                    for (var m = 0; m < jLoad.length; m++) {
                        if (isAdd == 1) {
                            var searchprdJson = jsonPath(searchPrd, "$.[?(@.Product_Code=='" + jLoad[m]["Product_Code"] + "')]");
                            if (searchprdJson == false || searchprdJson === undefined || searchprdJson.length == 0) {
                                searchPrd.push(jLoad[m]);
                            }
                        }
                        content += '<li data-theme="c" id="SOPrd_' + m + '" onclick="fnSOAddSelectedProduct(\'' + jLoad[m]["Product_Code"] + '\',\'' + jLoad[m]["Product_Name"] + '\')">';
                        content += '<a href="#page1" data-transition="slide">' + jLoad[m]["Product_Name"] + '</a>';
                        content += '</li>';
                    }
                    content += '</ul>';
                    content += ' </div>';

                    $("#dvSearchProductList").html(content).trigger('create');
                    $.mobile.loading('hide');
                }
                else {
                    $("#dvSearchProductList").html("No Matching product found.").trigger('create');
                    $.mobile.loading('hide');
                }
            },
            error: function (e) {
                $.mobile.loading('hide');
                fnMsgAlert('error', 'Error', 'GetProductDetails Failed.');
            }
        });
    }
    catch (e) {
        $.mobile.loading('hide');
        fnMsgAlert('error', 'Error', e.message);
        return false;
    }
    //$('#dvOTCProductPopup').simpledialog2('close');
}

function fnSOAddSelectedProduct(value, text) {
    var n = $('#SOselectedProductlist li').length;
    $('#SOselectedProductlist').append('<li id="SOselectprd_' + n + '"><a class="getPrdlabel" href="#">' + text + '</a><a href="#" onclick="fnDeleteProductPoPUp(\'' + n + '\')"></a><input type="hidden" value="' + value + '" id="hdnSOselectprd_' + n + '"></li>')
    $("#SOPrd_" + n + " div.ui-btn-inner").css("background-color", "green");
    $("#SOPrd_" + n + " div.ui-btn-inner div a").css("color", "#fff");

    $('#SOselectedProductlist').trigger('create');
    $('#SOselectedProductlist').listview('refresh');
}

function fnDeleteProductPoPUp(n) {
    $('#SOselectprd_' + n).remove();
    $("#SOPrd_" + n + " div.ui-btn-inner").css("background-color", "");
    $("#SOPrd_" + n + " div.ui-btn-inner div a").css("color", "");
}

function fnBindSOSelectedProducts() {
    $.mobile.loading('show');
    if ($("#SOselectedProductlist li").length > 0) {
        var content = "";
        var priceChange = "";

        if ($("#dvSOProductList div.OHDROW").length == 0) {
            content = '<div class="OHDRow" style="font-weight:bold;">';
            content += '<div class="OHDL">Product Name</div><div class="OHDR">Quantity</div>';
            content += '</div>';
        }

        var isPriceEdit = fnGetPrivilegeValue("OTC_PRODUCT_PRICE_CHANGE", "NO");
        if (isPriceEdit == "YES") {
            priceChange = 'onclick="fnOpenSOPriceChange(this);" style="text-decoration:underline;color:#06C;"'
        }

        var idCnt = (($("#dvSOProductList div.OHDROW").length == 0) ? ($("#dvSOProductList div.OHDROW").length + 1) : $("#dvSOProductList div.OHDROW").length);
        for (var l = 0; l < $("#SOselectedProductlist li").length; l++) {

            var prdJson = jsonPath(searchPrd, "$.[?(@.Product_Code=='" + $("#SOselectedProductlist li input")[l].value + "')]");

            content += '<div class="OHDRow" id="dvOrderProdList_' + idCnt + '" style="font-weight:bold;">';
            content += '<a href="#" id="deleteProduct_' + idCnt + '" class="delete-icon" style="float:right;margin-right:5px;" onclick="fnDeleteOrderProduct(this)"></a>';
            content += '<input type="hidden"  id="hdnOrderProdList_' + idCnt + '" value="1"/>';
            //prdJson[0].Product_Name
            //Product detail
            content += '<div class="OHDL">';
            content += '<div class="OHDL1">' + idCnt + '</div>';

            content += '<div class="OHDL2">';
            content += '<div id="txtSOProdName_' + idCnt + '">' + prdJson[0]["Product_Name"] + '</div>';
            content += '<div>Price (Rs) : <span id="spnUnitPrice_' + idCnt + '" ' + priceChange + '>' + prdJson[0]["Unit_Price"] + '</span></div>';
            content += '<div>UOM :' + prdJson[0]["UOM_Name"] + '</div>';
            content += '<div>UOM type :' + prdJson[0]["UOM_Type_Name"] + '</div>';
            content += '</div>';

            content += '</div>';

            //Quantity
            content += '<div class="OHDR"><input type="text" id="txtSOProductQty_' + idCnt + '" value="' + prdJson[0]["Ordered_Qty"] + '" onblur="fnCheckNumeric(this);" style="width:100%;"/><input type="hidden" id="hdnSOPrdCode_' + idCnt + '"  value="' + prdJson[0]["Product_Code"] + '"/><input type="hidden" id="hdnSOUOMCode_' + idCnt + '"  value="' + prdJson[0]["UOM_Code"] + '"/><input type="hidden" id="hdnSOUOMTypeCode_' + idCnt + '" value="' + prdJson[0]["UOM_Type_Code"] + '"/></div>';
            content += '</div>';
            idCnt++;
        }
        $("#dvSOProductList").append(content).trigger('create');
        $('#dvOTCProductPopup').simpledialog2('close');
        $('#SOselectedProductlist').html("");
        $("#dvSearchProductList").html("");
        $("#SOBtnField").css('display', '');
        $.mobile.loading('hide');
    }
    else {
        $.mobile.loading('hide');
        $("#lblOTCProdSearchErr").html("Please select atleast one product.");
        return false;
    }
}

function fnOpenOrderSummary(orderId, orderDate, from) {
    $.mobile.loading('show');
    if (orderId == null) { // New Entry
        if (fnValidateOTCDate()) { // Validate dtae
            orderDate = $("#txtOrderYear").val() + '-' + $("#txtOrderMonth").val() + '-' + $("#txtOrderDate").val();
        }
        else {
            $.mobile.loading('hide');
            return false;
        }
    }

    var prodCodes = "";
    var prdArray = new Array();
    for (var q = 1; q < $("#dvSOProductList div.OHDROW").length; q++) {
        if ($("#hdnOrderProdList_" + q).val() == "1") {
            if (jQuery.inArray($("#hdnSOPrdCode_" + q).val(), prdArray) === -1) {
                prdArray.push($("#hdnSOPrdCode_" + q).val());
            }
            else {
                $.mobile.loading('hide');
                $("#dvOrderProdList_" + q).css('border', '1px solid red');
                fnMsgAlert('info', 'Sale Order Entry', 'You have entered the product more than one time.Please enter it for only one time. ');
                return false;
            }

            if ($("#txtSOProductQty_" + q).val() != "") {
                if ($("#txtSOProductQty_" + q).val() != '0') {
                    prodCodes += $("#hdnSOPrdCode_" + q).val() + "^"; // to get schemes
                }
            }
        }
    }

    try {
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Activity/OTC/GetSchemeDetails',
            data: "regionCode=" + sPersonCode_g + "&productCodes=" + prodCodes + "&orderDate=" + orderDate,
            success: function (response) {
                var jLoad = response;

                var orderedQty = 0, orderedPrd = 0, orderValue = 0;;
                var offQty = 0, offPrd = 0;

                for (var q = 1; q < $("#dvSOProductList div.OHDROW").length; q++) {
                    if ($("#hdnOrderProdList_" + q).val() == "1") {
                        if ($("#txtSOProductQty_" + q).val() != "") {
                            if ($("#txtSOProductQty_" + q).val() != '0') {
                                orderedPrd++; // number of products
                                orderedQty += parseFloat($("#txtSOProductQty_" + q).val()); // product Quantity
                                orderValue += (parseFloat($("#txtSOProductQty_" + q).val()) * parseFloat($("#spnUnitPrice_" + q).html())); // Total Order Value

                                if (!(jLoad === undefined) && jLoad.length > 0) {
                                    var schemeJson = jsonPath(jLoad, "$.[?(@.Product_Code=='" + $("#hdnSOPrdCode_" + q).val() + "')]");
                                    if (schemeJson != false && schemeJson.length > 0) {
                                        if (schemeJson[0].Ordered_Qty <= $("#txtSOProductQty_" + q).val()) {
                                            for (var m = 0; m < schemeJson.length; m++) {
                                                offPrd++;
                                                offQty += parseInt(parseFloat($("#txtSOProductQty_" + q).val()) / parseFloat(schemeJson[m].Ordered_Qty)) * parseFloat(schemeJson[m].Offer_Product_Qty);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                $("#APProductOrd").html(orderedPrd);
                $("#APQtyOrd").html(orderedQty);
                $("#APOffProductOrd").html(offPrd);
                $("#APOffQtyOrd").html(offQty);
                $("#APOrderValue").html(orderValue);

                $("#APRefNumber").html($("#txtaSORefNumber").val());
                if ($("#txtaSORemarks").val() == "") {
                    $("#APRemarks").html("Remarks : Not Applicable");
                }
                else {
                    $("#APRemarks").html("Remarks : " + $("#txtaSORemarks").val());
                }

                if (from == "SUBMIT") {
                    $("#APSuccessMessege").css("display", "");
                    $("#btnRedirectOtcHome").css("display", "");
                    $('a[rel=close]').css("display", "none");
                }

                $.mobile.loading('hide');
                $('#dvOTCOrderSummary').simpledialog2();
                if (from == "SUBMIT") {
                    $('a[rel=close]').css("display", "none");
                }
            },
            error: function (e) {
                $.mobile.loading('hide');
                fnMsgAlert('error', 'Error', 'GetOrderDetails Failed.');
            }
        });
    }
    catch (e) {
        $.mobile.loading('hide');
        fnMsgAlert('error', 'Error', e.message);
        return false;
    }
}

function fnOpenOrderSchemeSummary(orderId, orderDate) {
    $.mobile.loading('show');

    if (orderId == null) { // New Entry
        if (fnValidateOTCDate()) { // Validate dtae
            orderDate = $("#txtOrderYear").val() + '-' + $("#txtOrderMonth").val() + '-' + $("#txtOrderDate").val();
        }
        else {
            $.mobile.loading('hide');
            return false;
        }
    }
    var prodCodes = "";
    var prdArray = new Array();

    for (var q = 1; q < $("#dvSOProductList div.OHDROW").length; q++) {
        if ($("#hdnOrderProdList_" + q).val() == "1") {
            if (jQuery.inArray($("#hdnSOPrdCode_" + q).val(), prdArray) === -1) {
                prdArray.push($("#hdnSOPrdCode_" + q).val());
            }
            else {
                $.mobile.loading('hide');
                $("#dvOrderProdList_" + q).css('border', '1px solid red');
                fnMsgAlert('info', 'Sale Order Entry', 'You have entered the product more than one time.Please enter it for only one time. ');
                return false;
            }
            if ($("#txtSOProductQty_" + q).val() != "") {
                if ($("#txtSOProductQty_" + q).val() != '0') {
                    prodCodes += $("#hdnSOPrdCode_" + q).val() + "^"; // to get schemes
                }
            }
        }
    }
    try {
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Activity/OTC/GetSchemeDetails',
            data: "regionCode=" + sPersonCode_g + "&productCodes=" + prodCodes + "&orderDate=" + orderDate,
            success: function (response) {
                var jLoad = response;
                if (!(jLoad === undefined) && jLoad.length > 0) {
                    var offQty = 0;
                    var sCont = "";

                    for (var q = 1; q < $("#dvSOProductList div.OHDROW").length; q++) {
                        if ($("#hdnOrderProdList_" + q).val() == "1") {

                            var schemeJson = jsonPath(jLoad, "$.[?(@.Product_Code=='" + $("#hdnSOPrdCode_" + q).val() + "')]");

                            if (schemeJson != false && schemeJson !== undefined) {
                                // check base value
                                if (schemeJson[0].Ordered_Qty <= $("#txtSOProductQty_" + q).val()) {

                                    sCont += '<div><h5 style="margin: 0.5em 0em 0.5em 0em;">Offer details for : <span>' + schemeJson[0].Product_Name + '</span></h5>';

                                    if (schemeJson.length > 0) {
                                        for (var m = 0; m < schemeJson.length; m++) {
                                            sCont += '<div class="SCHRow">';
                                            sCont += '<div class="OHDL"><div class="OHDL1">' + (m + 1) + ' .</div><div class="OHDL2">' + schemeJson[m].Offer_Product_Name + '</div></div>';

                                            // Calculate offer Quantity
                                            offQty = parseInt(parseFloat($("#txtSOProductQty_" + q).val()) / parseFloat(schemeJson[m].Ordered_Qty)) * parseFloat(schemeJson[m].Offer_Product_Qty);

                                            sCont += '<div class="OHDR">' + offQty + '</div>';
                                            sCont += '</div>';
                                        }
                                    }
                                    sCont += '<div style="clear:both;"></div></div>';
                                }
                            }
                        }
                    }

                    $.mobile.loading('hide');
                    $("#dvOTCSchemeSummaryDetail").html(sCont).trigger('create');
                    $('#dvOTCSchemeSummary').simpledialog2();
                }
                else {
                    $.mobile.loading('hide');
                    $("#dvOTCSchemeSummaryDetail").html("No offer products for the ordered products.").trigger('create');
                    $('#dvOTCSchemeSummary').simpledialog2();
                }
            },
            error: function (e) {
                $.mobile.loading('hide');
                fnMsgAlert('error', 'Error', 'GetOrderDetails Failed.');
            }
        });
    }
    catch (e) {
        $.mobile.loading('hide');
        fnMsgAlert('error', 'Error', e.message);
        return false;
    }
}

function fnOpenSOPriceChange(id) {
    $.mobile.loading('show');
    $("#txtOTCProdPricePopUp").val($(id).html());
    $("#dvOCProdNamePopUp").html($("#txtSOProdName_" + (id.id).split('_')[1]).html());
    $("#hdnPriceChangeRow").val((id.id).split('_')[1]);
    $.mobile.loading('hide');

    $('#dvOTCChangePrice').simpledialog2();
}

function fnFillChangedPrice() {
    if ($("#txtOTCProdPricePopUp").val() == "") {
        $("#lblPriceChange").html("Please enter price.");
        return false;
    }
    if (isNaN($("#txtOTCProdPricePopUp").val())) {
        $("#lblPriceChange").html("Please enter numeric value.");
        return false;
    }

    if ($("#txtOTCProdPricePopUp").val() < 0) {
        $("#lblPriceChange").html("Negative entry is not allowed for Product Price.");
        return false;
    }

    $("#spnUnitPrice_" + $("#hdnPriceChangeRow").val()).html($("#txtOTCProdPricePopUp").val());
    $('#dvOTCChangePrice').simpledialog2('close');
}

function fnDeleteOrderProduct(ctl) {
    var rowNo = ctl.id.split('_')[1];
    $("#dvOrderProdList_" + rowNo).css('display', 'none');
    $("#hdnOrderProdList_" + rowNo).val("0");
}


//****************** Add Product -END ************************************


//************************* SAVE OTC**************************************
function fnSaveOTCOrder(isSubmit, orderDate, orderId) {
    $.mobile.loading('show');
    isValidDate = new Boolean(true);

    if (orderDate == null) {
        isValidDate = fnValidateOTCDate();
    }
    if (isValidDate) {
        var prdArray = new Array();
        var isProdQuantity = 0;
        for (var q = 1; q < $("#dvSOProductList div.OHDROW").length; q++) {
            if ($("#hdnOrderProdList_" + q).val() == "1") {
                if (jQuery.inArray($("#hdnSOPrdCode_" + q).val(), prdArray) === -1) {
                    prdArray.push($("#hdnSOPrdCode_" + q).val());
                }
                else {
                    $.mobile.loading('hide');
                    $("#dvOrderProdList_" + q).css('border', '1px solid red');
                    fnMsgAlert('info', 'Sale Order Entry', 'You have entered the product more than one time.Please enter it for only one time. ');
                    return false;
                }

                if (parseInt($("#txtSOProductQty_" + q).val()) < 0) {
                    $.mobile.loading('hide');
                    $("#txtSOProductQty_" + q).focus();
                    fnMsgAlert('info', 'Sale Order Entry', 'Negative value is not allowed for Quantity. ');
                    return false;
                }
                if (parseInt($("#txtSOProductQty_" + q).val()) > 0) {
                    isProdQuantity++;
                }
            }
        }
        if (isProdQuantity == 0) {
            $.mobile.loading('hide');
            fnMsgAlert('info', 'Sale Order Entry', 'You did not enter quantity for any of the products.');
            return false;
        }

        // remarks length check
        if ($("#txtaSORemarks").val() != "") {
            if ($("#txtaSORemarks").val().length > 500) {
                $.mobile.loading('hide');
                fnMsgAlert('info', 'Sale Order Entry', 'You have entered more then 500 character in remarks. That is not allowed.');
                fnErrorIndicator("#txtaSORemarks");
                return false;
            }
            // remarks special char check.
            if (!(fnCheckRemarksSpecialChar("#txtaSORemarks"))) {
                $.mobile.loading('hide');
                return false;
            }
        }



        // ref number length check
        if ($("#txtaSORefNumber").val() != "") {
            if ($("#txtaSORefNumber").val().length > 30) {
                $.mobile.loading('hide');
                fnMsgAlert('info', 'Sale Order Entry', 'You have entered more then 500 character in Reference number. That is not allowed.');
                fnErrorIndicator("#txtaSORefNumber");
                return false;
            }
        }
        else {
            $.mobile.loading('hide');
            fnMsgAlert('info', 'Sale Order Entry', 'Please enter Reference number.');
            fnErrorIndicator("#txtaSORefNumber");
            return false;
        }

        // remarks special char check.
        if (!(fnCheckRemarksSpecialChar("#txtaSORefNumber"))) {
            $.mobile.loading('hide');
            return false;
        }

        //----------- Due Date Validation
        // empty Check
        if ($("#txtDueDate").val() == "") {
            $.mobile.loading('hide');
            fnMsgAlert('info', 'Sale Order Entry', 'Please enter Due Date.');
            $("#txtDueDate").focus();
            return false;
        }
        if ($("#txtDueMonth").val() == "") {
            $.mobile.loading('hide');
            fnMsgAlert('info', 'Sale Order Entry', 'Please enter Due Month.');
            $("#txtDueMonth").focus();
            return false;
        }
        if ($("#txtDueYear").val() == "") {
            $.mobile.loading('hide');
            fnMsgAlert('info', 'Sale Order Entry', 'Please enter Due Year.');
            $("#txtDueYear").focus();
            return false;
        }
        var dDate = $("#txtDueYear").val() + '-' + $("#txtDueMonth").val() + '-' + $("#txtDueDate").val();

        var dueDate = new Date(dDate);

        // validate correct date
        if (dueDate == "Invalid Date") {
            $.mobile.loading('hide');
            fnMsgAlert('error', 'Sale Order Entry', 'Please enter valid Due Date');
            return false;
        }

        if (($("#txtDueMonth").val() == 4 || $("#txtDueMonth").val() == 6 || $("#txtDueMonth").val() == 9 || $("#txtDueMonth").val() == 11) && $("#txtDueDate").val() == 31) {
            $.mobile.loading('hide');
            fnMsgAlert('error', 'Sale Order Entry', 'Please enter valid Due Date.');
            return false;
        }
        if ($("#txtDueMonth").val() == 2) {
            var isleap = ($("#txtDueDate").val() % 4 == 0 && ($("#txtDueDate").val() % 100 != 0 || $("#txtDueDate").val() % 400 == 0));
            if ($("#txtDueDate").val() > 29 || ($("#txtDueDate").val() == 29 && !isleap)) {
                $.mobile.loading('hide');
                fnMsgAlert('error', 'Sale Order Entry', 'Please enter valid Due Date.');
                return false;
            }
        }
        //end

        var oDate = $("#txtOrderYear").val() + '-' + $("#txtOrderMonth").val() + '-' + $("#txtOrderDate").val();
        var oredrDate = new Date(oDate);


        if (oredrDate > dueDate) {
            $.mobile.loading('hide');
            fnMsgAlert('error', 'Sale Order Entry', 'Due date cannot be lesser then order date.');
            return false;
        }
        //----------- Due Date validation end

        // disable the buttons after validation
        $("#btnSODraft").attr("disabled", "disabled");
        $("#btnSOSubmit").attr("disabled", "disabled");
        fnReadOrderDetails(isSubmit, orderDate, orderId);
    }
}

function fnReadOrderDetails(isSubmit, orderDate, orderId) {

    var productString = "";
    var prodCodes = "";
    var offProdCode = "";

    //txtSOProductQty_
    //hdnSOPrdCode_
    //hdnSOUOMCode_
    //hdnSOUOMTypeCode_
    //spnUnitPrice_

    for (var q = 1; q < $("#dvSOProductList div.OHDROW").length; q++) {
        if ($("#hdnOrderProdList_" + q).val() == "1") {
            if ($("#txtSOProductQty_" + q).val() != "" && $("#txtSOProductQty_" + q).val() != '0') {
                prodCodes += $("#hdnSOPrdCode_" + q).val() + "^"; // to get schemes
            }
        }
    }

    if (orderId == null) { // New Entry
        orderDate = $("#txtOrderYear").val() + '-' + $("#txtOrderMonth").val() + '-' + $("#txtOrderDate").val();
    }

    try {
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Activity/OTC/GetSchemeDetails',
            data: "regionCode=" + sPersonCode_g + "&productCodes=" + prodCodes + "&orderDate=" + orderDate,
            success: function (response) {
                var jLoad = response;

                var orderValue = 0;
                var offQty = 0;


                for (var q = 1; q < $("#dvSOProductList div.OHDROW").length; q++) {
                    if ($("#hdnOrderProdList_" + q).val() == "1") {
                        if ($("#txtSOProductQty_" + q).val() != "" && $("#txtSOProductQty_" + q).val() != '0') {

                            // product details.
                            productString += $("#hdnSOPrdCode_" + q).val() + '^';
                            productString += $("#txtSOProductQty_" + q).val() + '^';
                            productString += $("#spnUnitPrice_" + q).html() + '^';
                            productString += $("#hdnSOUOMCode_" + q).val() + '^';
                            productString += $("#hdnSOUOMTypeCode_" + q).val() + '^';

                            orderValue += (parseFloat($("#txtSOProductQty_" + q).val()) * parseFloat($("#spnUnitPrice_" + q).html())); // Total Order Value

                            if (!(jLoad === undefined) && jLoad.length > 0) {
                                var schemeJson = jsonPath(jLoad, "$.[?(@.Product_Code=='" + $("#hdnSOPrdCode_" + q).val() + "')]");
                                if (schemeJson != false && schemeJson.length > 0) {
                                    // check base value
                                    if (schemeJson[0].Ordered_Qty <= $("#txtSOProductQty_" + q).val()) {

                                        productString += schemeJson[0].Scheme_Code + '|'; // scheme code for sale product

                                        for (var m = 0; m < schemeJson.length; m++) { //Read Scheme     
                                            offProdCode += schemeJson[m].Offer_Product_Code + '^';
                                            productString += schemeJson[m].Offer_Product_Code + '^';// offer product code
                                            //offerString += schemeJson[m].Offer_UOM_Code + '^';// offer product code
                                            //offerString += schemeJson[m].Offer_UOM_Type_Code + '^';// offer product code

                                            offQty = parseInt(parseFloat($("#txtSOProductQty_" + q).val()) / parseFloat(schemeJson[m].Ordered_Qty)) * parseFloat(schemeJson[m].Offer_Product_Qty);
                                            productString += offQty + '~';// offer Quantity
                                        }
                                        productString += '$';
                                    }
                                    else {
                                        productString += 'NULL|$'; // scheme code for sale product
                                    }
                                }
                                else {
                                    productString += 'NULL|$'; // scheme code for sale product
                                }
                            }
                            else {
                                productString += 'NULL|$'; // scheme code for sale product
                            }
                        }
                    }
                }

                // Insert Order.
                fnInsertOrder(isSubmit, orderDate, orderId, productString, prodCodes, offProdCode, orderValue);


            },
            error: function (e) {
                $.mobile.loading('hide');
                fnMsgAlert('error', 'Error', 'GetSchemeDetails Failed.');
            }
        });
    }
    catch (e) {
        $.mobile.loading('hide');
        fnMsgAlert('error', 'Error', e.message);
        return false;
    }
}

// insert Otc
function fnInsertOrder(isSubmit, orderDate, orderId, productString, prodCodes, offProdCode, orderValue) {
    try {
        var dueDate = $("#txtDueYear").val() + '-' + $("#txtDueMonth").val() + '-' + $("#txtDueDate").val();
        var remarksVal = (($("#txtaSORemarks").val() == "") ? "NA" : $("#txtaSORemarks").val());

        $.ajax({
            type: "POST",
            url: '/HiDoctor_Activity/OTC/InsertOTC',
            data: "orderId=" + orderId + "&orderDate=" + orderDate + "&isSubmit=" + isSubmit + "&productString=" + escape(productString)
                + "&custCode=" + cCode_g + "&salesPersonCode=" + sPersonCode_g + "&salesPersonName=" + sPersonName_g
                + "&orderValue=" + orderValue + "&remarks=" + remarksVal + "&refNumber=" + $("#txtaSORefNumber").val() + "&productCodes=" + prodCodes + "&offerCodes=" + offProdCode + "&dueDate=" + dueDate,
            success: function (response) {
                if (response.split('^')[0] == "SUCCESS") {
                    if (isSubmit == 2) {// submit
                        // Redirect to home.
                        fnOpenOrderSummary(orderId, orderDate, "SUBMIT");
                    }
                    else {
                        fnMsgAlert('error', 'Error', 'Your order has saved successfully.');
                        if (orderId == null && isSubmit == 3) { // for new entry draft                            
                            orderId = response.split('^')[1];

                            $("#SOHeader").append(' - Edit');
                            $("#APOrderDateEdit").css('display', '');
                            $("#APOrderDate").css('display', 'none');
                            $("#SOOrderDateEdit").append(orderDate.split('-')[2] + '/' + orderDate.split('-')[1] + '/' + orderDate.split('-')[0]);
                            $("#SOOrderNumberEdit").append(orderId);
                            $("#SOBtnField").css('display', '');
                            $("#dvSOProductList").empty();

                            $("#SOOrderSummary").unbind();
                            $("#SOSchemeDetail").unbind();

                            $("#btnSODraft").unbind();
                            $("#btnSOSubmit").unbind();

                            $("#SOOrderSummary").click(function () { fnOpenOrderSummary(orderId, orderDate, ""); });
                            $("#SOSchemeDetail").click(function () { fnOpenOrderSchemeSummary(orderId, orderDate); });

                            $("#btnSODraft").click(function () { fnSaveOTCOrder('3', orderDate, orderId); });
                            $("#btnSOSubmit").click(function () { fnSaveOTCOrder('2', orderDate, orderId); });

                            fnBindOrderHistoryDetailEdit(orderId);
                        }

                        $("#btnSODraft").removeAttr("disabled");
                        $("#btnSOSubmit").removeAttr("disabled");
                    }

                    $.mobile.loading('hide');
                }
                else {
                    $.mobile.loading('hide');
                    fnMsgAlert('error', 'Error', 'Insertion Failed.' + response);
                }

            },
            error: function (e) {
                $.mobile.loading('hide');
                fnMsgAlert('error', 'Error', 'Get Customer Orders Failed.');
            }
        });
    }
    catch (e) {
        $.mobile.loading('hide');
        fnMsgAlert('error', 'Error', e.message);
        return false;
    }
}

function fnValidateOTCDate() {
    // empty Check
    if ($("#txtOrderDate").val() == "") {
        $.mobile.loading('hide');
        fnMsgAlert('info', 'Sale Order Entry', 'Please enter Order Date.');
        $("#txtOrderDate").focus();
        return false;
    }
    if ($("#txtOrderMonth").val() == "") {
        $.mobile.loading('hide');
        fnMsgAlert('info', 'Sale Order Entry', 'Please enter Order Month.');
        $("#txtOrderMonth").focus();
        return false;
    }
    if ($("#txtOrderYear").val() == "") {
        $.mobile.loading('hide');
        fnMsgAlert('info', 'Sale Order Entry', 'Please enter Order Year.');
        $("#txtOrderYear").focus();
        return false;
    }
    var oDate = $("#txtOrderYear").val() + '-' + $("#txtOrderMonth").val() + '-' + $("#txtOrderDate").val();

    var oredrDate = new Date(oDate);

    // validate correct date
    if (oredrDate == "Invalid Date") {
        $.mobile.loading('hide');
        fnMsgAlert('error', 'Sale Order Entry', 'Please enter valid Order Date');
        return false;
    }

    if (($("#txtOrderMonth").val() == 4 || $("#txtOrderMonth").val() == 6 || $("#txtOrderMonth").val() == 9 || $("#txtOrderMonth").val() == 11) && $("#txtOrderDate").val() == 31) {
        $.mobile.loading('hide');
        fnMsgAlert('error', 'Sale Order Entry', 'Please enter valid Order Date.');
        return false;
    }
    if ($("#txtOrderMonth").val() == 2) {
        var isleap = ($("#txtOrderDate").val() % 4 == 0 && ($("#txtOrderDate").val() % 100 != 0 || $("#txtOrderDate").val() % 400 == 0));
        if ($("#txtOrderDate").val() > 29 || ($("#txtOrderDate").val() == 29 && !isleap)) {
            $.mobile.loading('hide');
            fnMsgAlert('error', 'Sale Order Entry', 'Please enter valid Order Date.');
            return false;
        }
    }
    //end

    var todayObj = new Date(todayDate);
    if (oredrDate > todayDate) {
        $.mobile.loading('hide');
        fnMsgAlert('error', 'Sale Order Entry', 'Order date cannot be a future date.');
        return false;
    }

    return true;
}
//************************* SAVE OTC end **************************************

//*************************** History **************************************************
function fnBindOrderHistory(custCode, salesPersonCode, custName, currentDate) {
    $.mobile.loading('show');
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
    "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

    var tempDate = new Date(currentDate.split('/')[2] + "-" + currentDate.split('/')[1] + "-10");
    var monthCount = 10;
    var thisMonth = "";
    while (monthCount > 0) {

        $('#ddlOHMonth').append('<option value="' + (tempDate.getMonth() + 1) + '_' + tempDate.getFullYear() + '" >' + monthNames[tempDate.getMonth()] + ' ' + tempDate.getFullYear() + '</option>');
        if (monthCount == 10) {
            thisMonth = (tempDate.getMonth() + 1) + '_' + tempDate.getFullYear();
        }
        monthCount--;
        tempDate.setMonth(tempDate.getMonth() - 1);
    }
    $("#ddlOHMonth").val(thisMonth);

    fnGetMonthWiseOrderHistory(custCode, salesPersonCode);
    $.mobile.loading('hide');
}

function fnGetMonthWiseOrderHistory(custCode, salesPersonCode) {

    try {
        $.mobile.loading('show');
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Activity/OTC/GetCustomerOrders',
            data: "regionCode=" + salesPersonCode + "&customerCode=" + custCode + "&month=" + $("#ddlOHMonth").val().split('_')[0] + "&year=" + $("#ddlOHMonth").val().split('_')[1],
            success: function (response) {
                //var jLoad = eval('(' + response + ')');
                var jLoad = response;
                if (!(jLoad === undefined) && jLoad.length > 0) {
                    var content = "";
                    content = '<div class="OHRow" style="font-weight:bold;">';
                    content += '<div class="OHCol1">Date</div><div class="OHCol2">Order ID</div><div class="OHCol3">Action</div>';
                    content += '</div>';

                    var orderStatus = "";
                    orders_g = new Array();
                    var tempOrderDate = "";

                    for (var k = 0; k < jLoad.length; k++) {
                        content += '<div class="OHRow">';
                        content += '<div class="OHCol1">' + jLoad[k]["SaleOrder_Date"] + '</div>';

                        content += '<div class="OHCol2">' + jLoad[k]["SaleOrder_Code"] + '<br />';
                        orders_g.push(jLoad[k]["SaleOrder_Code"]);

                        content += 'Value (Rs):' + jLoad[k]["SaleOrder_Amt"] + '<br />';
                        content += 'Ref #:' + ((jLoad[k]["Ref_Number"] == null) ? "" : jLoad[k]["Ref_Number"]) + '<br />';

                        orderStatus = jLoad[k]["SO_Approve_Status"];
                        content += 'Status:' + ((orderStatus == 2) ? 'Applied' : (orderStatus == 1) ? 'Approved' : (orderStatus == 3) ? 'Drafted' : 'Unapproved') + '</div>';

                        content += '<div class="OHCol3"><div data-role="content">';
                        // View button
                        content += '<a data-role="button" data-inline="true" data-theme="b" href="#" data-icon="grid" data-iconpos="notext" onclick="fnOpenOrderHistoryDetailView(\'' + jLoad[k]["SaleOrder_Code"] + '_HISTORY' + '\');"></a>';

                        // Edit icon will show only for unapproved or drafted records.
                        if (orderStatus == '0' || orderStatus == '3') {
                            tempOrderDate = jLoad[k]["SaleOrder_Date"].split('/')[2] + '-' + jLoad[k]["SaleOrder_Date"].split('/')[1] + '-' + jLoad[k]["SaleOrder_Date"].split('/')[0];
                            if (orderStatus == '3') { // for drafted gray theme
                                content += '<a data-role="button" data-inline="true" data-theme="c" href="#"  data-icon="edit" data-iconpos="notext" onclick="fnOpenOrderHistoryDetailEdit(\'' + jLoad[k]["SaleOrder_Code"] + '_' + tempOrderDate + '\');"></a>';
                            }
                            else { // for unapproved yellow theme
                                content += '<a data-role="button" data-inline="true" data-theme="e" href="#"  data-icon="edit" data-iconpos="notext" onclick="fnOpenOrderHistoryDetailEdit(\'' + jLoad[k]["SaleOrder_Code"] + '_' + tempOrderDate + '\');"></a>';
                            }
                        }
                        content += '</div></div>';
                        content += '</div>';
                    }
                    content += '<div style="clear: both;"></div>';

                    $("#OHOrderDetailHistory").html(content).trigger('create');
                    $.mobile.loading('hide');
                }
                else {
                    $("#OHOrderDetailHistory").html("This customer don't have any order in this month.").trigger('create');
                    $.mobile.loading('hide');
                }
            },
            error: function (e) {
                $.mobile.loading('hide');
                fnMsgAlert('error', 'Error', 'Get Customer Orders Failed.');
            }
        });
    }
    catch (e) {
        $.mobile.loading('hide');
        fnMsgAlert('error', 'Error', e.message);
        return false;
    }
}

// View Mode
function fnBindOrderHistoryDetailView(orderID) {
    $("#OHDOrderID").html(orderID);
    try {
        $.mobile.loading('show');
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Activity/OTC/GetOrderDetails',
            data: "orderId=" + orderID + "&mode=VIEW",
            success: function (response) {
                var jLoad = eval('(' + response + ')');
                if (!(jLoad.Tables === undefined) && jLoad.Tables.length > 0 && jLoad.Tables[0].Rows.length > 0) {

                    // For Product Details
                    var content = "";
                    content = '<div class="OHDRow" style="font-weight:bold;">';
                    content += '<div class="OHDL">Product Name</div><div class="OHDR">Quantity</div>';
                    content += '</div>';
                    for (var m = 0; m < jLoad.Tables[0].Rows.length; m++) {
                        content += '<div class="OHDRow" style="font-weight:bold;">';

                        //Product detail
                        content += '<div class="OHDL">';
                        content += '<div class="OHDL1">' + (m + 1) + '</div>';

                        content += '<div class="OHDL2">';
                        content += '<div>' + jLoad.Tables[0].Rows[m]["Product_Name"] + '</div>';
                        content += '<div>Price (Rs) : ' + jLoad.Tables[0].Rows[m]["Unit_Price"] + '</div>';
                        content += '<div>UOM :' + jLoad.Tables[0].Rows[m]["UOM_Name"] + '</div>';
                        content += '<div>UOM type :' + jLoad.Tables[0].Rows[m]["UOM_Type_Name"] + '</div>';
                        content += '</div>';

                        content += '</div>';

                        //Quantity
                        content += '<div class="OHDR">' + jLoad.Tables[0].Rows[m]["Ordered_Qty"] + '</div>';
                        content += '</div>';
                    }
                    $("#OHDDetail").html(content).trigger('create');

                    // customer name
                    $("#OHDCustName h5").html("Name: " + jLoad.Tables[3].Rows[0]["Customer_Name"]);

                    // Order Summary
                    $("#OHDProductOrd").html(jLoad.Tables[1].Rows[0]["Ordered_Products"]);
                    $("#OHDQtyOrd").html(jLoad.Tables[1].Rows[0]["Toatal_Ordered_Qty"]);
                    $("#OHDOffProductOrd").html(jLoad.Tables[1].Rows[0]["Offer_Products"]);
                    $("#OHDOffQtyOrd").html(jLoad.Tables[1].Rows[0]["Total_Offer_Quantity"]);
                    $("#OHDOrderValue").html(jLoad.Tables[1].Rows[0]["Order_Amount"]);

                    $("#OHDRefNumb").html("Ref No : " + jLoad.Tables[1].Rows[0]["Ref_Number"]);
                    $("#OHDOrderDate").html("Order Date : " + jLoad.Tables[1].Rows[0]["Order_Date"]);
                    $("#OHDDueDate").html("Due Date : " + jLoad.Tables[3].Rows[0]["Delivery_Date"].split('-')[2] + '/' + jLoad.Tables[3].Rows[0]["Delivery_Date"].split('-')[1] + '/' + jLoad.Tables[3].Rows[0]["Delivery_Date"].split('-')[0]);

                    //SchemeSummary
                    var sCont = "";
                    var saleProdArr = new Array();

                    if (jLoad.Tables.length > 2 && jLoad.Tables[2].Rows.length > 0) {
                        for (var t = 0; t < jLoad.Tables[2].Rows.length; t++) {
                            if (jQuery.inArray(jLoad.Tables[2].Rows[t].Product_Code, saleProdArr) === -1) {
                                saleProdArr.push(jLoad.Tables[2].Rows[t].Product_Code);

                                var saleJson = jsonPath(jLoad, "$.Tables[2].Rows[?(@.Product_Code=='" + jLoad.Tables[2].Rows[t].Product_Code + "')]");
                                if (saleJson != false && saleJson !== undefined) {

                                    sCont += '<div><h6>Offer details for : <span>' + jLoad.Tables[2].Rows[t].Product_Name + '</span></h6>';

                                    if (saleJson.length > 0) {
                                        for (var m = 0; m < saleJson.length; m++) {
                                            sCont += '<div class="SCHRow">';
                                            sCont += '<div class="OHDL"><div class="OHDL1">' + (m + 1) + '</div><div class="OHDL2">' + saleJson[m].Offer_Product_Name + '</div></div>';
                                            sCont += '<div class="OHDR">' + saleJson[m].Offer_Product_Qty + '</div>';
                                            sCont += '</div>';
                                        }
                                    }
                                    sCont += '<div style="clear:both;"></div></div>';
                                }
                            }
                        }
                        sCont += "<div style='clear:both;'></div>";
                        $("#OHDSchemeDetails").html(sCont).trigger('create');
                    }
                    else {
                        $("#OHDSchemeDetails").html("No Offer products for this order.").trigger('create');
                    }

                    // Old  remarks                    
                    if (jLoad.Tables[3].Rows[0]["Remarks"] != null) {
                        var oldRemarks = jLoad.Tables[3].Rows[0]["Remarks"].split('^');
                        var remarkcont = "";
                        if (oldRemarks.length > 1) {
                            remarkcont += "<h5 style='margin: 0.2em 0em;'>Old Remarks:</h5>";
                            for (w = 1; w < oldRemarks.length; w++) {
                                if (oldRemarks[w] != "NA") {
                                    remarkcont += "<div class='oldremarksDiv'>" + w + ". " + oldRemarks[w] + "</div>";
                                }
                                else {
                                    remarkcont += "<div class='oldremarksDiv'>" + w + ". Not Applicable</div>";
                                }
                            }
                            $("#OHDOldRemarks").html(remarkcont).trigger('create');
                        }
                    }

                    // Old Approval remarks                    
                    if (jLoad.Tables[3].Rows[0]["Decision_Remarks"] != null) {
                        var oldRemarks = jLoad.Tables[3].Rows[0]["Decision_Remarks"].split('^');
                        var remarkcont = "";
                        if (oldRemarks.length > 1) {
                            remarkcont += "<h5 style='margin: 0.2em 0em;'>Old Approval Remarks:</h5>";
                            var b = 1;
                            for (w = 1; w < oldRemarks.length; w++) {
                                if (oldRemarks[w] != "-~-") { // if no remarks entered for approval
                                    remarkcont += "<div class='oldremarksDiv'>" + b + ". " + oldRemarks[w] + "</div>";
                                    b++;
                                }
                            }
                            $("#OHDApprovalOldRemarks").html(remarkcont).trigger('create');
                        }
                    }

                    $.mobile.loading('hide');
                }
                else {
                    $.mobile.loading('hide');
                }
            },
            error: function (e) {
                $.mobile.loading('hide');
                fnMsgAlert('error', 'Error', 'GetSalesOrderLoadDetails Failed.');
            }
        });
    }
    catch (e) {
        $.mobile.loading('hide');
        fnMsgAlert('error', 'Error', e.message);
        return false;
    }
}


function fnShowPreviousOrder() {
    var preIndex = $.inArray($("#OHDOrderID").html(), orders_g);
    fnBindOrderHistoryDetailView(orders_g[((preIndex + orders_g.length) - 1) % orders_g.length]);
}

function fnShowNextOrder() {
    var nextIndex = $.inArray($("#OHDOrderID").html(), orders_g);
    fnBindOrderHistoryDetailView(orders_g[(nextIndex + 1) % orders_g.length]);
}


// Edit mode
function fnBindOrderHistoryDetailEdit(orderID) {
    try {
        $.mobile.loading('show');
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Activity/OTC/GetOrderDetails',
            data: "orderId=" + orderID + "&mode=EDIT",
            success: function (response) {
                var jLoad = eval('(' + response + ')');

                if (!(jLoad.Tables === undefined) && jLoad.Tables.length > 0 && jLoad.Tables[0].Rows.length > 0) {

                    var content = "";
                    var priceChange = "";
                    content = '<div class="OHDRow" style="font-weight:bold;">';
                    content += '<div class="OHDL">Product Name</div><div class="OHDR">Quantity</div>';
                    content += '</div>';

                    var isPriceEdit = fnGetPrivilegeValue("OTC_PRODUCT_PRICE_CHANGE", "NO");
                    if (isPriceEdit == "YES") {
                        priceChange = 'onclick="fnOpenSOPriceChange(this);" style="text-decoration:underline;color:#06C;"'
                    }

                    for (var m = 0; m < jLoad.Tables[0].Rows.length; m++) {
                        content += '<div class="OHDRow" style="font-weight:bold;" id="dvOrderProdList_' + (m + 1) + '" >';
                        content += '<a href="#" id="deleteProduct_' + (m + 1) + '" class="delete-icon" style="float:right;margin-right:5px;" onclick="fnDeleteOrderProduct(this)"></a>';
                        content += '<input type="hidden"  id="hdnOrderProdList_' + (m + 1) + '" value="1"/>';

                        //Product detail
                        content += '<div class="OHDL">';
                        content += '<div class="OHDL1">' + (m + 1) + '</div>';

                        content += '<div class="OHDL2">';
                        content += '<div id="txtSOProdName_' + (m + 1) + '">' + jLoad.Tables[0].Rows[m]["Product_Name"] + '</div>';
                        content += '<div>Price (Rs) : <span id="spnUnitPrice_' + (m + 1) + '" ' + priceChange + '>' + jLoad.Tables[0].Rows[m]["Unit_Price"] + '</span></div>';
                        content += '<div>UOM :' + jLoad.Tables[0].Rows[m]["UOM_Name"] + '</div>';
                        content += '<div>UOM type :' + jLoad.Tables[0].Rows[m]["UOM_Type_Name"] + '</div>';
                        content += '</div>';

                        content += '</div>';

                        //Quantity
                        content += '<div class="OHDR"><input type="text" id="txtSOProductQty_' + (m + 1) + '" value="' + jLoad.Tables[0].Rows[m]["Ordered_Qty"] + '" onblur="fnCheckNumeric(this);" style="width:100%;"/>';
                        content += '<input type="hidden" id="hdnSOPrdCode_' + (m + 1) + '"  value="' + jLoad.Tables[0].Rows[m]["Product_Code"] + '"/>';
                        content += '<input type="hidden" id="hdnSOUOMCode_' + (m + 1) + '"  value="' + jLoad.Tables[0].Rows[m]["UOM_Code"] + '"/>';
                        content += '<input type="hidden" id="hdnSOUOMTypeCode_' + (m + 1) + '" value="' + jLoad.Tables[0].Rows[m]["UOM_Type_Code"] + '"/></div>';
                        content += '</div>';
                    }
                    $("#dvSOProductList").append(content).trigger('create');
                    $("#txtaSORefNumber").val(jLoad.Tables[1].Rows[0]["Ref_Number"]);


                    //BIND REMARKS
                    if (jLoad.Tables[1].Rows[0]["SO_Approve_Status"] == "0") { // for unapproved record edit.
                        //APApprovalOldRemarks
                        // Old remarks

                        if (jLoad.Tables[1].Rows[0]["Remarks"] != null) {
                            var oldRemarks = jLoad.Tables[1].Rows[0]["Remarks"].split('^');
                            var remarkcont = "";
                            if (oldRemarks.length > 1) {
                                remarkcont += "<h5 style='margin: 0.2em 0em;'>Old Remarks:</h5>";
                                for (w = 1; w < oldRemarks.length; w++) {
                                    remarkcont += "<div class='oldremarksDiv'>" + w + ". " + oldRemarks[w] + "</div>";
                                }
                                $("#APApprovalOldRemarks").html(remarkcont).trigger('create');
                            }
                        }

                        $("#txtaSORemarks").val("");
                    }
                    else {// for drafted record edit fill last remarks in text area.
                        // Old remarks
                        if (jLoad.Tables[1].Rows[0]["Remarks"] != null) {
                            var oldRemarks = jLoad.Tables[1].Rows[0]["Remarks"].split('^');
                            var remarkcont = "";
                            if (oldRemarks.length > 1) {
                                remarkcont += "<h5 style='margin: 0.2em 0em;'>Old Remarks:</h5>";
                                for (w = 1; w < (oldRemarks.length - 1) ; w++) {
                                    if (oldRemarks[w] != "NA") {
                                        remarkcont += "<div class='oldremarksDiv'>" + w + ". " + oldRemarks[w] + "</div>";
                                    }
                                    else {
                                        remarkcont += "<div class='oldremarksDiv'>" + w + ". Not Applicable</div>";
                                    }
                                }
                                $("#APApprovalOldRemarks").html(remarkcont).trigger('create');
                            }
                        }
                        if (oldRemarks[oldRemarks.length - 1] != 'NA') {
                            $("#txtaSORemarks").val(oldRemarks[oldRemarks.length - 1]);
                        }
                        else {
                            $("#txtaSORemarks").val("");
                        }

                    }

                    // fill Due Date
                    $("#txtDueYear").val(jLoad.Tables[1].Rows[0]["Delivery_Date"].split('-')[0]);
                    $("#txtDueMonth").val(jLoad.Tables[1].Rows[0]["Delivery_Date"].split('-')[1]);
                    $("#txtDueDate").val(jLoad.Tables[1].Rows[0]["Delivery_Date"].split('-')[2]);

                    $("#SOBtnField").css('display', '');
                    $.mobile.loading('hide');
                }
                else {
                    $.mobile.loading('hide');
                }
            },
            error: function (e) {
                $.mobile.loading('hide');
                fnMsgAlert('error', 'Error', 'GetOrderDetails Failed.');
            }
        });
    }
    catch (e) {
        $.mobile.loading('hide');
        fnMsgAlert('error', 'Error', e.message);
        return false;
    }
}
//*************************** History END **************************************************

// Customer List
function fnCLBindCustomerList(val) {
    try {
        $.mobile.loading('show');
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Activity/OTC/GetCustomerDetails',
            data: "customerEntity=ALL" + '&mode=' + val,
            success: function (response) {
                //var jLoad = eval('(' + response + ')');
                var jLoad = response;

                if (!(jLoad === undefined) && jLoad.length > 0) {
                    var lstCustCont = "";
                    lstCustCont = '<div data-role="content">';
                    lstCustCont += '<ul id="lstCustomer" data-role="listview" data-divider-theme="a" data-inset="true">';
                    lstCustCont += ' <li data-role="list-divider" role="heading">Customer Names</li>';

                    for (var a = 0; a < jLoad.length; a++) {
                        lstCustCont += '<li data-theme="c">';
                        lstCustCont += '<a href="#" data-transition="turn" onclick="fnOpenSaleOrderEntry(\'' + jLoad[a]["Customer_Code"] + '^' + jLoad[a]["Customer_Name"] + '^' + escape(jLoad[a]["Address"]) + '^' + escape(jLoad[a]["Tin_Number"]) + '^' + escape(jLoad[a]["CST_Number"]) + '\')">' + jLoad[a]["Customer_Name"] + '</a>';

                        lstCustCont += '</li>';
                    }
                    lstCustCont += '</ul>';
                    lstCustCont += '</div>';
                    $("#dvCLCustList").html(lstCustCont).trigger('create');
                    $.mobile.loading('hide');
                }
                else {
                    $("#dvCLCustList").html("<span style='color:red;'>No search result found.</span>").trigger('create');
                    $.mobile.loading('hide');
                }
            },
            error: function (e) {
                $.mobile.loading('hide');
                fnMsgAlert('error', 'Error', 'GetCustomerDetails Failed.');
            }
        });
    }
    catch (e) {
        $.mobile.loading('hide');
        fnMsgAlert('error', 'Error', e.message);
        return false;
    }
}


// Order Status
function fnCLBindSalesOrderStatus() {
    try {
        $.mobile.loading('show');
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Activity/OTC/GetSalesOrderStatus',
            data: "a",
            success: function (response) {
                //var jLoad = eval('(' + response + ')');
                var jLoad = response;
                //unapproved orders
                if (!(jLoad === undefined) && jLoad.length > 0) {
                    var lstsalesorder = "";
                    var saleOrderCode = "";
                    var refNumber = "";
                    var no = 0;
                    lstsalesorder = '<div data-role="content">';
                    lstsalesorder += '<ul id="lstsalesorder" data-role="listview" data-divider-theme="a" data-inset="true">'

                    var dJsonData = jsonPath(jLoad, "$.[?(@.SO_Approve_Status==0)]");

                    if (dJsonData != false) {
                        for (var j = 0; j < dJsonData.length; j++) {
                            no++
                            saleOrderCode = dJsonData[j].SaleOrder_Code;
                            refNumber = dJsonData[j].Ref_Number;
                            lstsalesorder += '<li data-theme="c">';
                            lstsalesorder += '<a href="#" data-transition="turn" onclick="fnOpenOrderStatusEdit(\'' + saleOrderCode + '_YES' + '\')">' + no + "." + "<span><b> Order No:</b></span>" + saleOrderCode + "<br />" + "<span><b> Ref No:</b></span>" + refNumber + '</a>';
                            lstsalesorder += '</li>';
                        }
                    }

                    lstsalesorder += '</ul>';
                    lstsalesorder += '</div>';
                    $("#dvCLOrderStatus").html(lstsalesorder).trigger('create');
                }
                else {
                    $("#dvCLOrderStatus").html("<span style='color:red;'>No search result found.</span>").trigger('create');
                }
                //applied orders
                if (!(jLoad === undefined) && jLoad.length > 0) {
                    var lstsalesorder = "";
                    var orderCode = ""
                    var salesRefNo = "";
                    var no = 0;
                    lstsalesorder = '<div data-role="content">';
                    lstsalesorder += '<ul id="lstsalesorder" data-role="listview" data-divider-theme="a" data-inset="true">'

                    var dJsonDatatotal = jsonPath(jLoad, "$.[?(@.SO_Approve_Status==2)]");

                    if (dJsonDatatotal != false) {

                        orders_g = new Array(); // for single approval navigation.

                        for (var k = 0; k < dJsonDatatotal.length; k++) {
                            no++
                            orderCode = dJsonDatatotal[k].SaleOrder_Code;
                            salesRefNo = dJsonDatatotal[k].Ref_Number;

                            orders_g.push(orderCode);

                            lstsalesorder += '<li data-theme="c">';
                            lstsalesorder += '<a href="#" data-transition="turn" onclick="fnOpenOrderHistoryDetailView(\'' + orderCode + '_STATUS' + '\');">' + no + "." + "<span><b> Order No:</b></span>" + orderCode + "<br />" + "<span><b> Ref No:</b></span>" + salesRefNo + '</a>';
                            lstsalesorder += '</li>';
                        }
                    }

                    lstsalesorder += '</ul>';
                    lstsalesorder += '</div>';
                    $("#dvCLOrderAppliedStatus").html(lstsalesorder).trigger('create');
                    $.mobile.loading('hide');
                }
                else {
                    $("#dvCLOrderAppliedStatus").html("<span style='color:red;'>No search result found.</span>").trigger('create');
                    $.mobile.loading('hide');
                }
            },
            error: function (e) {
                $.mobile.loading('hide');
                fnMsgAlert('error', 'Error', 'GetCustomerDetails Failed.');
            }
        });
    }
    catch (e) {
        $.mobile.loading('hide');
        fnMsgAlert('error', 'Error', e.message);
        return false;
    }
}

function fnBindOrderStatusEdit(orderCode) {
    try {
        $.mobile.loading('show');
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Activity/OTC/GetOrderStatusView',
            data: "orderId=" + orderCode + "&mode=VIEW",
            success: function (response) {
                var jLoad = eval('(' + response + ')');
                if (!(jLoad.Tables === undefined) && jLoad.Tables.length > 0 && jLoad.Tables[0].Rows.length > 0) {
                    var content = "";

                    // bind Event for Edit button     
                    if (isEditOrder == "YES") { // only for unapproved orders
                        $("#Cl_btnEdit").css('display', '');
                        var tempOrderDate = jLoad.Tables[1].Rows[0]["Order_Date"].split('/')[2] + '-' + jLoad.Tables[1].Rows[0]["Order_Date"].split('/')[1] + '-' + jLoad.Tables[1].Rows[0]["Order_Date"].split('/')[0]
                        $("#Cl_btnEdit").click(function () { fnOpenOrderHistoryDetailEdit(orderCode + '_' + tempOrderDate); });

                        // initialize global string to open edit
                        cCode_g = jLoad.Tables[3].Rows[0]["Customer_Code"];
                        cName_g = jLoad.Tables[3].Rows[0]["Customer_Name"];
                        sPersonCode_g = jLoad.Tables[3].Rows[0]["Customer_Region_Code"];
                        ((cNo_g == "") ? "Not Available" : ((cNo_g.toUpperCase() == "NULL") ? "Not Available" : cNo_g));
                        adrs_g = (jLoad.Tables[3].Rows[0]["Address1"] == null) ? "Not Available" : ((jLoad.Tables[3].Rows[0]["Address1"] == "") ? "Not Available" : ((jLoad.Tables[3].Rows[0]["Address1"].toUpperCase() == "NULL") ? "Not Available" : jLoad.Tables[3].Rows[0]["Address1"]));
                        tNo_g = (jLoad.Tables[3].Rows[0]["Tin_Number"] == null) ? "Not Available" : ((jLoad.Tables[3].Rows[0]["Tin_Number"] == "") ? "Not Available" : ((jLoad.Tables[3].Rows[0]["Tin_Number"].toUpperCase() == "NULL") ? "Not Available" : jLoad.Tables[3].Rows[0]["Tin_Number"]));
                        cNo_g = (jLoad.Tables[3].Rows[0]["CST_Number"] == null) ? "Not Available" : ((jLoad.Tables[3].Rows[0]["CST_Number"] == "") ? "Not Available" : ((jLoad.Tables[3].Rows[0]["CST_Number"].toUpperCase() == "NULL") ? "Not Available" : jLoad.Tables[3].Rows[0]["CST_Number"]));
                        //

                        // bind remarks                   
                        if (jLoad.Tables[3].Rows[0]["Decision_Remarks"] != null) {
                            var oldRemarks = jLoad.Tables[3].Rows[0]["Decision_Remarks"].split('^');
                            var remarkcont = "";
                            if (oldRemarks.length > 1) {
                                var b = 1;
                                for (w = 1; w < oldRemarks.length; w++) {
                                    if (oldRemarks[w] != "-~-") { // if no remarks entered for approval
                                        remarkcont += "<div class='oldremarksDiv'>" + b + ". " + oldRemarks[w] + "</div>";
                                        b++;
                                    }
                                }
                                $("#cl_lbReason").html(remarkcont).trigger('create');
                            }
                        }
                    }

                    else {
                        // bind remarks                   
                        if (jLoad.Tables[3].Rows[0]["Remarks"] != null) {
                            var oldRemarks = jLoad.Tables[3].Rows[0]["Remarks"].split('^');
                            var remarkcont = "";
                            if (oldRemarks.length > 1) {
                                for (w = 1; w < oldRemarks.length; w++) {
                                    if (oldRemarks[w] != "NA") {
                                        remarkcont += "<div class='oldremarksDiv'>" + w + ". " + oldRemarks[w] + "</div>";
                                    }
                                    else {
                                        remarkcont += "<div class='oldremarksDiv'>" + w + ". Not Applicable</div>";
                                    }
                                }
                                $("#cl_lbReason").html(remarkcont).trigger('create');
                            }
                        }
                    }

                    $("#OtcOrdercode h3").html("Order ID :" + orderCode + " | " + "Date: " + jLoad.Tables[1].Rows[0]["Order_Date"]);
                    $("#OtcCustName h5").html(jLoad.Tables[3].Rows[0]["Customer_Name"]);
                    $("#Cl_lbRefNo").html("Ref No :" + jLoad.Tables[1].Rows[0]["Ref_Number"]);
                    $("#Cl_lbDueDate").html("Due Date :" + jLoad.Tables[3].Rows[0]["Delivery_Date"].split('-')[2] + '/' + jLoad.Tables[3].Rows[0]["Delivery_Date"].split('-')[1] + '/' + jLoad.Tables[3].Rows[0]["Delivery_Date"].split('-')[0]);




                    $("#OHDProductOrd").html(jLoad.Tables[1].Rows[0]["Ordered_Products"]);
                    $("#OHDQtyOrd").html(jLoad.Tables[1].Rows[0]["Toatal_Ordered_Qty"]);
                    $("#OHDOffProductOrd").html(jLoad.Tables[1].Rows[0]["Offer_Products"]);
                    $("#OHDOffQtyOrd").html(jLoad.Tables[1].Rows[0]["Total_Offer_Quantity"]);
                    $("#OHDOrderValue").html(jLoad.Tables[1].Rows[0]["Order_Amount"]);
                    var sCont = "";
                    var saleProdArr = new Array();
                    if (jLoad.Tables.length > 2 && jLoad.Tables[2].Rows.length > 0) {
                        for (var t = 0; t < jLoad.Tables[2].Rows.length; t++) {
                            if (jQuery.inArray(jLoad.Tables[2].Rows[t].Product_Code, saleProdArr) === -1) {
                                saleProdArr.push(jLoad.Tables[2].Rows[t].Product_Code);
                                var saleJson = jsonPath(jLoad, "$.Tables[2].Rows[?(@.Product_Code=='" + jLoad.Tables[2].Rows[t].Product_Code + "')]");
                                if (saleJson != false && saleJson !== undefined) {
                                    sCont += '<div><h6>Offer details for : <span>' + jLoad.Tables[2].Rows[t].Product_Name + '</span></h6>';
                                    if (saleJson.length > 0) {
                                        for (var m = 0; m < saleJson.length; m++) {
                                            sCont += '<div class="SCHRow">';
                                            sCont += '<div class="OHDL"><div class="OHDL1">' + (m + 1) + '</div><div class="OHDL2">' + saleJson[m].Offer_Product_Name + '</div></div>';
                                            //sCont += '<div class="OHDR">' + saleJson[m].Offer_Product_Qty + '</div>';
                                            sCont += '</div>';
                                        }
                                    }
                                    sCont += '<div style="clear:both;"></div></div>';
                                }
                            }
                        }
                        sCont += "<div style='clear:both;'></div>";
                        $("#dvofferProduct").html(sCont).trigger('create');
                    }
                    else {
                        $("#dvofferProduct").html("No Offer products for this order.").trigger('create');
                    }
                    $.mobile.loading('hide');
                }
                else {
                    $.mobile.loading('hide');
                }
            },
            error: function (e) {
                $.mobile.loading('hide');
                fnMsgAlert('error', 'Error', 'GetSalesOrderLoadDetails Failed.');
            }
        });
    }
    catch (e) {
        $.mobile.loading('hide');
        fnMsgAlert('error', 'Error', e.message);
        return false;
    }
}


// ******************************* Approval *****************************************

//ApproveOrderList
function fnBindApproveOrderList() {
    try {
        $.mobile.loading('show');
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Activity/OTC/GetApproveOrderlist',
            data: "mode=ALL",
            success: function (response) {
                var jLoad = eval('(' + response + ')');
                //var jLoad = response;
                underUser = "";
                if (!(jLoad.Tables === undefined) && jLoad.Tables.length > 0 && jLoad.Tables[0].Rows.length > 0) {
                    var lstCustCont = "";
                    lstCustCont = '<div data-role="content">';
                    lstCustCont += '<ul id="lstCustomer" data-role="listview" data-divider-theme="b" data-inset="true">';
                    lstCustCont += ' <li data-role="list-divider" role="heading">Subordinates List</li>';

                    for (var a = 0; a < jLoad.Tables[0].Rows.length; a++) {
                        lstCustCont += '<li data-theme="c">';
                        lstCustCont += '<a href="#" data-transition="turn" onclick="fnOpenOrderBulkApproval(\'' + jLoad.Tables[0].Rows[a].Entered_By + '\')">' + jLoad.Tables[0].Rows[a].User_Name + " | " + jLoad.Tables[0].Rows[a].Region_Name + " | " + jLoad.Tables[0].Rows[a].Applied_Orders + "nos" + '</a>';
                        underUser += jLoad.Tables[0].Rows[a].Entered_By + '^' + jLoad.Tables[0].Rows[a].User_Name + " | " + jLoad.Tables[0].Rows[a].Region_Name + '~';

                        lstCustCont += '</li>';
                    }
                    lstCustCont += '</ul>';
                    lstCustCont += '</div>';
                    $("#dvCLApproveOreerList").html(lstCustCont).trigger('create');
                }
                else {
                    $("#dvCLApproveOreerList").html("<span style='color:red;'>No search result found.</span>").trigger('create');
                }
                $.mobile.loading('hide');
            },
            error: function (e) {
                $.mobile.loading('hide');
                fnMsgAlert('error', 'Error', 'GetCustomerDetails Failed.');
            }
        });
    }
    catch (e) {
        $.mobile.loading('hide');
        fnMsgAlert('error', 'Error', e.message);
        return false;
    }
}

// Bulk approval Start
function fnSOABindUnderUser(userCode) {
    $.mobile.loading('show');
    var underUserArray = new Array();
    if (underUser.length > 0) {
        underUser = underUser.slice(0, -1);
        underUserArray = underUser.split('~');
        $("#ddlSOAUnderUserList").selectmenu(); // to initialize the select menu.
        for (var r = 0; r < underUserArray.length; r++) {
            $('#ddlSOAUnderUserList').append('<option value="' + underUserArray[r].split('^')[0] + '" >' + underUserArray[r].split('^')[1] + '</option>');
        }

        $("#ddlSOAUnderUserList").val(userCode);
        $("#ddlSOAUnderUserList").selectmenu('refresh');
        fnBindOrderBulkApproval();
    }
    else {
        $.mobile.loading('hide');
    }
}

function fnBindOrderBulkApproval() {
    try {
        $.mobile.loading('show');
        $("#SOAApprovalRemarks").val("");
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Activity/OTC/GetApproveOrderlist',
            data: "mode=DETAIL&userCode=" + $("#ddlSOAUnderUserList").val(),
            success: function (response) {
                var jLoad = eval('(' + response + ')');

                orders_g = new Array(); // for single approval navigation.
                var content = "";
                if (!(jLoad.Tables === undefined) && jLoad.Tables.length > 0 && jLoad.Tables[0].Rows.length > 0) {
                    for (var h = 0; h < jLoad.Tables[0].Rows.length; h++) {

                        orders_g.push(jLoad.Tables[0].Rows[h]["SaleOrder_Code"]);
                        content += '<div class="SOARowMain">';

                        content += '<div class="SOALeft">';
                        content += '<div id="chkSOABoxes_' + h + '" data-role="fieldcontain">';
                        content += '<fieldset data-role="controlgroup" data-type="vertical">';
                        content += '<input id="chkSOA_' + h + '" name="chkSOA" value="' + jLoad.Tables[0].Rows[h]["SaleOrder_Code"] + '" type="checkbox">';
                        content += '<label for="chkSOA_' + h + '"></label>';
                        content += '</fieldset></div>';
                        content += '</div>';

                        content += '<div class="SOARight" onclick="fnOpenOrderSingleApproval(\'' + jLoad.Tables[0].Rows[h]["SaleOrder_Code"] + '^' + $("#ddlSOAUnderUserList").val() + '\');">';
                        content += '<div class="SOARow">Order No : ' + jLoad.Tables[0].Rows[h]["SaleOrder_Code"] + ' | ' + jLoad.Tables[0].Rows[h]["SaleOrder_Date"].split('-')[2] + '/' + jLoad.Tables[0].Rows[h]["SaleOrder_Date"].split('-')[1] + '/' + jLoad.Tables[0].Rows[h]["SaleOrder_Date"].split('-')[0] + ' </div>';
                        content += '<div class="SOARow">Customer Name : ' + jLoad.Tables[0].Rows[h]["Customer_Name"] + ' </div>';
                        content += '<div class="SOARow">Ref Number : ' + jLoad.Tables[0].Rows[h]["Ref_Number"] + ' </div>';
                        content += '<div class="SOARow">Order Value : ' + jLoad.Tables[0].Rows[h]["SaleOrder_Amt"] + ' </div>';
                        content += '</div>';
                        content += '<div style="clear: both;"></div>';
                        content += '</div>';
                    }
                    content += '<div style="clear: both;"></div>';
                    $("#dvSOApproveOrderDetails").html(content).trigger('create');
                }
                else {
                    $("#dvCLApproveOreerList").html("<span >There is no order in applied status.</span>").trigger('create');
                }
                $.mobile.loading('hide');
            },
            error: function (e) {
                $.mobile.loading('hide');
                fnMsgAlert('error', 'Error', 'GetCustomerDetails Failed.');
            }
        });
    }
    catch (e) {
        $.mobile.loading('hide');
        fnMsgAlert('error', 'Error', e.message);
        return false;
    }

}

function fnBulkApprovalUnapproval(status) {
    $.mobile.loading('show');
    // validate if one order has checked
    if ($(":checkbox[name=chkSOA]:checked").length == 0) {
        $.mobile.loading('hide');
        fnMsgAlert('info', 'Sale Order Approval', 'Please Select atleast one order.');
        return false;
    }

    if (status == "0") { // Remarks is mandatory only for unapproval
        if ($("#SOAApprovalRemarks").val() == "") {
            $.mobile.loading('hide');
            fnMsgAlert('info', 'Sale Order Approval', 'Please Enter unapproval reason.');
            fnErrorIndicator("#SOAApprovalRemarks");
            return false;
        }
    }

    if ($("#SOAApprovalRemarks").val().length > 500) {
        $.mobile.loading('hide');
        fnMsgAlert('info', 'Sale Order Approval', 'You have entered more then 500 character in remarks. That is not allowed.');
        fnErrorIndicator("#SOAApprovalRemarks");
        return false;
    }

    // remarks special char check.
    if (!(fnCheckRemarksSpecialChar("#SOAApprovalRemarks"))) {
        $.mobile.loading('hide');
        return false;
    }

    // Read selected order ids
    var orderIds = "";
    $('input:checkbox[name=chkSOA]').each(function () {
        if ($(this).is(':checked')) { orderIds += $(this).val() + "^"; }
    });

    var remarks = ($("#SOAApprovalRemarks").val() == "") ? "-~-" : $("#SOAApprovalRemarks").val();

    try {
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Activity/OTC/ChangeOrderStatus',
            data: "status=" + status + "&orderIds=" + orderIds + "&approvalRemarks=" + escape(remarks),
            success: function (response) {
                if (response == "SUCCESS") {
                    $.mobile.loading('hide');
                    fnMsgAlert('error', 'Sale Order Approval', 'Approval/Unapproval Successfull.');
                    $("#SOAApprovalRemarks").val("");
                    fnBindOrderBulkApproval();
                }
                else {
                    $.mobile.loading('hide');
                    fnMsgAlert('error', 'Error', 'Approval/Unapproval Failed.' + response);
                }
            },
            error: function (e) {
                $.mobile.loading('hide');
                fnMsgAlert('error', 'Error', 'ChangeOrderStatus Failed.');
            }
        });
    }
    catch (e) {
        $.mobile.loading('hide');
        fnMsgAlert('error', 'Error', e.message);
        return false;
    }
}

function fnSelectAllOrderForApproval() {
    $('input:checkbox[name=chkSOA]').each(function () {
        $(this).attr("checked", true).checkboxradio("refresh");
    });
    return;
}

function fnUnSelectAllOrderForApproval() {
    $('input:checkbox[name=chkSOA]').each(function () {
        $(this).attr("checked", false).checkboxradio("refresh");
    });
    return;
}

// Single  Approval Start
function fnShowPreviousOrderApproval() {
    var preIndex = $.inArray($("#SOASOrderID").html(), orders_g);
    fnBindOrderSingleApproval(orders_g[((preIndex + orders_g.length) - 1) % orders_g.length]);
}

function fnShowNextOrderApproval() {
    var nextIndex = $.inArray($("#SOASOrderID").html(), orders_g);
    fnBindOrderSingleApproval(orders_g[(nextIndex + 1) % orders_g.length]);
}

function fnSOSingleApprovalBindUnderUser(userCode, orderID) {
    $.mobile.loading('show');
    var underUserArray = new Array();

    if (underUser.length > 0) {
        underUser = underUser.slice(0, -1);
        underUserArray = underUser.split('~');
        $("#ddlSOASUnderUserList").selectmenu(); // to initialize the select menu.
        for (var r = 0; r < underUserArray.length; r++) {
            $('#ddlSOASUnderUserList').append('<option value="' + underUserArray[r].split('^')[0] + '" >' + underUserArray[r].split('^')[1] + '</option>');
        }

        $("#ddlSOASUnderUserList").val(userCode);
        $("#ddlSOASUnderUserList").selectmenu('refresh');
        fnBindOrderSingleApproval(orderID);
    }
    else {
        $.mobile.loading('hide');
    }
}

function fnBindOrderSingleApproval(orderID) {
    $.mobile.loading('show');

    $("#SOASOrderID").html(orderID);
    $("#SOASApprovalRemarks").val("");
    $("#SOASApprovalOldRemarks").html("");
    $("#SOASNoOrder").css('display', 'none');
    $("#SOASOrderDetailDisplay").css('display', '');
    try {
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Activity/OTC/GetOrderDetails',
            data: "orderId=" + orderID + "&mode=VIEW",
            success: function (response) {
                var jLoad = eval('(' + response + ')');
                if (!(jLoad.Tables === undefined) && jLoad.Tables.length > 0 && jLoad.Tables[0].Rows.length > 0) {

                    // For Product Details
                    var content = "";
                    content = '<div class="OHDRow" style="font-weight:bold;">';
                    content += '<div class="OHDL">Product Name</div><div class="OHDR">Quantity</div>';
                    content += '</div>';
                    for (var m = 0; m < jLoad.Tables[0].Rows.length; m++) {
                        content += '<div class="OHDRow" style="font-weight:bold;">';

                        //Product detail
                        content += '<div class="OHDL">';
                        content += '<div class="OHDL1">' + (m + 1) + '</div>';

                        content += '<div class="OHDL2">';
                        content += '<div>' + jLoad.Tables[0].Rows[m]["Product_Name"] + '</div>';
                        content += '<div>Price (Rs) : ' + jLoad.Tables[0].Rows[m]["Unit_Price"] + '</div>';
                        content += '<div>UOM :' + jLoad.Tables[0].Rows[m]["UOM_Name"] + '</div>';
                        content += '<div>UOM type :' + jLoad.Tables[0].Rows[m]["UOM_Type_Name"] + '</div>';
                        content += '</div>';

                        content += '</div>';

                        //Quantity
                        content += '<div class="OHDR">' + jLoad.Tables[0].Rows[m]["Ordered_Qty"] + '</div>';
                        content += '</div>';
                    }
                    $("#SOASDetail").html(content).trigger('create');

                    //Customer Name
                    $("#SOASCustName h5").html(jLoad.Tables[3].Rows[0]["Customer_Name"]);


                    // Order Summary
                    $("#SOASProductOrd").html(jLoad.Tables[1].Rows[0]["Ordered_Products"]);
                    $("#SOASQtyOrd").html(jLoad.Tables[1].Rows[0]["Toatal_Ordered_Qty"]);
                    $("#SOASOffProductOrd").html(jLoad.Tables[1].Rows[0]["Offer_Products"]);
                    $("#SOASOffQtyOrd").html(jLoad.Tables[1].Rows[0]["Total_Offer_Quantity"]);
                    $("#SOASOrderValue").html(jLoad.Tables[1].Rows[0]["Order_Amount"]);

                    $("#SOASRefNumb").html("Ref No : " + jLoad.Tables[1].Rows[0]["Ref_Number"]);
                    $("#SOASOrderDate").html("Order Date : " + jLoad.Tables[1].Rows[0]["Order_Date"]);
                    $("#SOASDueDate").html("Due Date : " + jLoad.Tables[3].Rows[0]["Delivery_Date"].split('-')[2] + '/' + jLoad.Tables[3].Rows[0]["Delivery_Date"].split('-')[1] + '/' + jLoad.Tables[3].Rows[0]["Delivery_Date"].split('-')[0]);


                    //SchemeSummary
                    var sCont = "";
                    var saleProdArr = new Array();

                    if (jLoad.Tables.length > 2 && jLoad.Tables[2].Rows.length > 0) {
                        for (var t = 0; t < jLoad.Tables[2].Rows.length; t++) {
                            if (jQuery.inArray(jLoad.Tables[2].Rows[t].Product_Code, saleProdArr) === -1) {
                                saleProdArr.push(jLoad.Tables[2].Rows[t].Product_Code);

                                var saleJson = jsonPath(jLoad, "$.Tables[2].Rows[?(@.Product_Code=='" + jLoad.Tables[2].Rows[t].Product_Code + "')]");
                                if (saleJson != false && saleJson !== undefined) {

                                    sCont += '<div><h6>Offer details for : <span>' + jLoad.Tables[2].Rows[t].Product_Name + '</span></h6>';

                                    if (saleJson.length > 0) {
                                        for (var m = 0; m < saleJson.length; m++) {
                                            sCont += '<div class="SCHRow">';
                                            sCont += '<div class="OHDL"><div class="OHDL1">' + (m + 1) + '</div><div class="OHDL2">' + saleJson[m].Offer_Product_Name + '</div></div>';
                                            sCont += '<div class="OHDR">' + saleJson[m].Offer_Product_Qty + '</div>';
                                            sCont += '</div>';
                                        }
                                    }
                                    sCont += '<div style="clear:both;"></div></div>';
                                }
                            }
                        }
                        sCont += "<div style='clear:both;'></div>";
                        $("#SOASSchemeDetails").html(sCont).trigger('create');
                    }
                    else {
                        $("#SOASSchemeDetails").html("No Offer products for this order.").trigger('create');
                    }

                    // Old remarks
                    //SOASApprovalOldRemarks
                    if (jLoad.Tables[3].Rows[0]["Decision_Remarks"] != null) {
                        var oldRemarks = jLoad.Tables[3].Rows[0]["Decision_Remarks"].split('^');
                        var remarkcont = "";
                        if (oldRemarks.length > 1) {
                            remarkcont += "<h5 style='margin: 0.2em 0em;'>Old Remarks:</h5>";
                            var b = 1;
                            for (w = 1; w < oldRemarks.length; w++) {
                                if (oldRemarks[w] != "-~-") { // if no remarks entered for approval
                                    remarkcont += "<div class='oldremarksDiv'>" + b + ". " + oldRemarks[w] + "</div>";
                                    b++;
                                }
                            }
                            $("#SOASApprovalOldRemarks").html(remarkcont).trigger('create');
                        }
                    }

                }
                $.mobile.loading('hide');
            },
            error: function (e) {
                $.mobile.loading('hide');
                fnMsgAlert('error', 'Error', 'GetSalesOrderLoadDetails Failed.');
            }
        });
    }
    catch (e) {
        $.mobile.loading('hide');
        fnMsgAlert('error', 'Error', e.message);
        return false;
    }
}

function fnSingleApprovalUnApproval(status) {
    $.mobile.loading('show');

    if (status == "0") {// remarks is mandatory only for unapproval
        if ($("#SOASApprovalRemarks").val() == "") {
            $.mobile.loading('hide');
            fnMsgAlert('info', 'Sale Order Approval', 'Please Enter the unapproval reason.');
            fnErrorIndicator("#SOASApprovalRemarks");
            return false;
        }
    }

    if ($("#SOASApprovalRemarks").val().length > 500) {
        $.mobile.loading('hide');
        fnMsgAlert('info', 'Sale Order Approval', 'You have entered more then 500 character in remarks. That is not allowed.');
        fnErrorIndicator("#SOASApprovalRemarks");
        return false;
    }

    // remarks special char check.
    if (!(fnCheckRemarksSpecialChar("#SOASApprovalRemarks"))) {
        $.mobile.loading('hide');
        return false;
    }

    var orderID = $("#SOASOrderID").html();
    // Read selected order ids
    var orderIds = orderID + "^";

    var remarks = ($("#SOASApprovalRemarks").val() == "") ? "-~-" : $("#SOASApprovalRemarks").val();
    try {
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Activity/OTC/ChangeOrderStatus',
            data: "status=" + status + "&orderIds=" + orderIds + "&approvalRemarks=" + escape(remarks),
            success: function (response) {
                if (response == "SUCCESS") {
                    fnMsgAlert('error', 'Sale Order Approval', 'Approval/Unapproval Successfull.');

                    //Bind next order
                    var nextIndex = $.inArray($("#SOASOrderID").html(), orders_g);
                    if (orders_g.length > 1) { // if it has only one order there is no next order.
                        var nextOrderId = orders_g[(nextIndex + 1) % orders_g.length];

                        orders_g = orders_g.splice(orders_g.indexOf($("#SOASOrderID").html()), 1); // Remove the approved / unapproved order]                        
                        fnBindOrderSingleApproval(nextOrderId);
                    }
                    else { // if no order
                        $("#SOASNoOrder").css('display', '');
                        $("#SOASOrderDetailDisplay").css('display', 'none');
                        $.mobile.loading('hide');
                    }
                }
                else {
                    $.mobile.loading('hide');
                    fnMsgAlert('error', 'Error', 'Approval/Unapproval Failed.' + response);
                }
            },
            error: function (e) {
                $.mobile.loading('hide');
                fnMsgAlert('error', 'Error', 'ChangeOrderStatus Failed.');
            }
        });
    }
    catch (e) {
        $.mobile.loading('hide');
        fnMsgAlert('error', 'Error', e.message);
        return false;
    }
}

function fnGetAllOrdersForTheUser() {
    try {
        $.mobile.loading('show');
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Activity/OTC/GetApproveOrderlist',
            data: "mode=DETAIL&userCode=" + $("#ddlSOASUnderUserList").val(),
            success: function (response) {
                var jLoad = eval('(' + response + ')');

                orders_g = new Array(); // for single approval navigation.
                var content = "";
                if (!(jLoad.Tables === undefined) && jLoad.Tables.length > 0 && jLoad.Tables[0].Rows.length > 0) {
                    for (var h = 0; h < jLoad.Tables[0].Rows.length; h++) {
                        orders_g.push(jLoad.Tables[0].Rows[h]["SaleOrder_Code"]);
                    }

                    // Bind for the first order.
                    fnBindOrderSingleApproval(jLoad.Tables[0].Rows[0]["SaleOrder_Code"]);
                }
                else { // if no orders
                    $("#SOASNoOrder").css('display', '');
                    $("#SOASOrderDetailDisplay").css('display', 'none');

                }
                $.mobile.loading('hide');
            },
            error: function (e) {
                $.mobile.loading('hide');
                fnMsgAlert('error', 'Error', 'GetCustomerDetails Failed.');
            }
        });
    }
    catch (e) {
        $.mobile.loading('hide');
        fnMsgAlert('error', 'Error', e.message);
        return false;
    }
}

// ******************************* Approval end *****************************************

//********************************DCR LOCK RELEASE****************************************//

function fnLockUsersearch() {
    $.mobile.loading('show');
    var regionCode = "";

    if ($("#txtUserSelection").val() == "") {
        $.mobile.loading('hide');
        fnMsgAlert("info", "DCR Lock Release Selection", "Please enter the Matching string.");
        $("#txtUserSelection").focus();
        $("#dvSearchUserList").html("")
        return false;
    }
    if ($("#txtUserSelection").val().length < 3) {
        $.mobile.loading('hide');
        fnMsgAlert("info", "DCR Lock Release Selection", "Please enter atleast 3 characters.");
        $("#txtUserSelection").focus();
        return false;
    }

    if (!(fnCheckRemarksSpecialChar("#txtUserSelection"))) {
        $.mobile.loading('hide');
        fnMsgAlert("info", "DCR Lock Release Selection", "Please remove special characters.");
        $("#txtUserSelection").focus();
        return false;
    }

    try {
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Activity/MobileNotification/GetlockUsers',
            data: "&match=" + $("#txtUserSelection").val(),
            success: function (response) {
                //var jLoad = eval('(' + response + ')');
                var jLoad = response;
                if (!(jLoad === undefined) && jLoad.length > 0) {
                    var lstDcrLockUsers = "";
                    lstDcrLockUsers = '<div data-role="content">';
                    lstDcrLockUsers += '<ul id="lstLockedUsers" data-role="listview" data-divider-theme="b" data-inset="true">';
                    lstDcrLockUsers += ' <li data-role="list-divider" role="heading">Search Result</li>';

                    for (var a = 0; a < jLoad.length; a++) {
                        lstDcrLockUsers += '<li data-theme="c">';
                        lstDcrLockUsers += '<a href="#" data-transition="turn" onclick="fnOpenDcrLockeduserScreen(\'' + jLoad[a]["User_code"] + '\')">' + jLoad[a]["User_Name"] + '</a>';
                        lstDcrLockUsers += '</li>';
                    }
                    lstDcrLockUsers += '</ul>';
                    lstDcrLockUsers += '</div>';
                    $("#dvSearchUserList").html(lstDcrLockUsers).trigger('create');
                    $.mobile.loading('hide');
                }
                else {
                    $("#dvSearchUserList").html("<span style='color:red;'>No search result found.</span>").trigger('create');
                    $.mobile.loading('hide');
                }
            },
            error: function (e) {
                $.mobile.loading('hide');
                fnMsgAlert('error', 'Error', 'GetuserDetails Failed.');
            }
        });
    }
    catch (e) {
        $.mobile.loading('hide');
        fnMsgAlert('error', 'Error', e.message);
        return false;
    }
}
var hiddenuserCode = "";
function fnDCRlockDetail(usercode) {
    hiddenuserCode = usercode;
    $.mobile.loading('show')
    $.ajax({
        type: "POST",
        url: '/HiDoctor_Activity/MobileNotification/GetLockDcrDetail',
        data: "userCode=" + usercode,
        success: function (result) {
            
            if (result != 'FAIL') {
                
                var lockDetail = result;
                if (lockDetail != "") {
                    $("#dvLockDetailList").html(lockDetail).trigger('create');
                }
                else {
                    $("#dvLockDetailList").html("<span style='color:red;'>No lock details found.</span>").trigger('create');
                    $('#btnlockSubmit').closest('.ui-btn').hide();
                }
            }
            else {
                fnMsgAlert('error', 'Error', 'Error.' + result);
                return;
            }
            $.mobile.loading('hide');
        }
    });

}


function fnreleasethelock() {
    debugger;
    var checkboxchecked = false
    var dcrLockLeaveRelease = '';
    var dcrDCRActualDate = ''
    var dcrLockedDate = '';
    var userCode = ''
    var lockType = 'LOCK LEAVE';
    var lockleavedate = fnGetLockedandDCRDate(lockType)
    if (lockleavedate.length > 1) {
        checkboxchecked = true;
        dcrLockedDate = lockleavedate.split('~')[0];
        dcrDCRActualDate = lockleavedate.split('~')[1];
        //  alert($("#hdnUserCode").val() + '^' + dcrDCRActualDate + '^' + dcrLockedDate + '^' + "LOCK_LEAVE");
        fnrelease("LOCK_LEAVE", dcrLockedDate, dcrDCRActualDate);
    }


    lockType = 'IDLE DCR';
    var data = fnGetLockedandDCRDate(lockType)
    dcrLockedDate = '';
    dcrDCRActualDate = '';
    if (data.length > 1) {
        checkboxchecked = true;
        dcrLockedDate = data.split('~')[0];
        dcrDCRActualDate = data.split('~')[1];
        //alert($("#hdnUserCode").val() + '^' + dcrDCRActualDate + '^' + dcrLockedDate + '^' + lockType);
        fnrelease("IDLE_DCR", dcrLockedDate, dcrDCRActualDate);
    }
    if (!checkboxchecked) {
        fnMsgAlert('info', 'DCR Lock Release', 'Please select one row for lock release.');
    }
}


function fnGetLockedandDCRDate(lock_Type) {
    debugger
    var dcrLockedDate = '';
    var dcrDCRActualDate = '';
    $("li").each(function (index) {
        if (($('#rowcheckbox_' + (index + 1)).attr('checked')) == "checked"
           && $('#spnLockType_' + (index + 1)).html().toUpperCase() == lock_Type) {
            var lockdate = $('#spnlockedDate_' + (index + 1)).html();
            var dcrdate = $('#spnDcrActualDate_' + (index + 1)).html();
            if ($.trim(lockdate).length > 0) {
                lockdate = lockdate.split('/')[1] + '/' + lockdate.split('/')[0] + '/' + lockdate.split('/')[2]
                dcrLockedDate += lockdate + '^';
            }
            if ($.trim(dcrdate).length > 0) {
                dcrdate = dcrdate.split('/')[1] + '/' + dcrdate.split('/')[0] + '/' + dcrdate.split('/')[2]
                dcrDCRActualDate += dcrdate + '^';
            }
        

        }
    });
    if ($.trim(dcrLockedDate).length == 0 && $.trim(dcrDCRActualDate).length == 0) {
        return "";
    }
    else {
        return dcrLockedDate + '~' + dcrDCRActualDate;
    }

}

function fnrelease(lock_Type, locked_date, dcr_Actual_Date) {
    $.ajax({
        type: 'POST',
        data: "user_Code=" + hiddenuserCode + "&lock_Type=" + lock_Type + "&locked_Date=" + locked_date + '&dcr_Actual_Date=' + dcr_Actual_Date,

        url: '/HiDoctor_Activity/MobileNotification/UpdateDCRLockToReleaseMob',
        success: function (response) {
            
            if (response == "-1") {
                fnMsgAlert('success', 'DCR Lock Release', 'DCR Lock Released Successfully!');
                $.mobile.loading('show');
                fnDCRlockDetailRedirect(hiddenuserCode);
                
            }
            else {
                fnMsgAlert('success', 'DCR Lock Release', response);
            }
        },
        error: function (e) {
            fnMsgAlert('error', 'Error', e.responseText);
        }
    });
}


function fnDCRlockDetailRedirect(usercode) {

    $.mobile.loading('show')
    $.ajax({
        type: "POST",
        url: '/HiDoctor_Activity/MobileNotification/GetLockDcrDetail',
        data: "userCode=" + usercode,
        success: function (result) {

            if (result != 'FAIL') {

                var lockDetail = result;
                if (lockDetail != "") {
                    $("#dvLockDetailList").html(lockDetail).trigger('create');
                    fnGetDCRLockReleaseDates(usercode);
                }
                else {
                    fnGetDCRLockReleaseDates(usercode);
                    $("#dvLockDetailList").hide();
                }
            }
            else {
                fnMsgAlert('error', 'Error', 'Error.' + result);
                return;
            }
            $.mobile.loading('hide');
        }
    });


}



function fngoBackLock() {
    $.mobile.changePage("/HiDoctor_Activity/MobileNotification/DCRLockRelease", {
        type: "post",
        reverse: false,
        changeHash: false
    });

}

function fnGetDCRLockReleaseDates(userCode) {    
    try    
    {
        if (userCode != null && userCode != '') {
            $.ajax({
                url: '/HiDoctor_Activity/MobileNotification/GetDCRLockReleaseDates',
                type: 'POST',
                data: "userCode=" + hiddenuserCode,
                success: function (result) {
                    
                    if (result.length > 0) {
                        $('#divDCRLockrelease').html(result).trigger('create');
                    }
                    $.mobile.loading('hide');
                }
            });
        }
    }
    catch (e) {
        $.mobile.loading('hide');
        fnMsgAlert('error', 'Error', e.message);
        return false;
    }
}