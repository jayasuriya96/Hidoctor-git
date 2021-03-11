/*
Created By      : Chakkaravarthi C
Created Date    : 29-03-2017
For             : Order Add
*/


var OrderAdd = {
    defaults: {
        "LineOfBusiness": "",
        "stockistRowCount": 0,
        "productRowCount": 0,
        "Child_User_Count": 0,
        "Current_Date": "",
        "showAccData": "",
        "action_Region_Code": "",
        "action_User_Code": "",
        "action_User_Name": "",
        "Order_Id": 0,
        "OrderMode": "",
        "login_User_Code": "",
        "customerCaption": "",
        "stockistCaption":"",
        "CustomerOrChemistAutoFill_Data": [],
        "StockistAutoFill_Data": [],
        "ProductAutoFill_Data": [],
        "eventTree": false,
        "sameProduct":true,
    },
    initialize: function () {
        debugger;
        if (OrderAdd.defaults.OrderMode == "Add") {
            debugger;
            // Add //
            $('#txtCustomerOrChemist').prop('disabled', false);
            if (OrderAdd.defaults.Child_User_Count > 1) {

                // Tree View to Show Details //
                $("#dvAddOrderContainer").hide();
                $("#dvAddOrderContainer").removeClass("col-sm-12").addClass("col-sm-9");
                fnBindRegionTree("dvRegionTree");
                $("#dvRegionTreeContainer").show();
                OrderAdd.UnblockUI("dvAddOrderMainContainer");
                Order.UnblockUI("dvOrderMainContainer");
                $("#dvMoreInfoModal").overlay().load();
                $("#btnAddTreeShowHide").show();


                // Tree View Hide and Show Button Event
                $("#btnAddTreeShowHide").click(function () {
                    debugger;
                    $("#dvRegionTreeContainer").toggle();
                    if ($("#dvRegionTreeContainer").is(':visible')) {
                        $(this).html('<<');
                        $("#dvAddOrderContainer").removeClass("col-sm-12").addClass("col-sm-9");
                    }
                    else {
                        $(this).html('>>');
                        $("#dvAddOrderContainer").removeClass("col-sm-9").addClass("col-sm-12");
                    }
                });

            } else {
                OrderAdd.defaults.eventTree = false;
                debugger;
                $("#btnAddTreeShowHide").hide();
                $("#dvRegionTreeContainer").hide();
                $("#dvAddOrderContainer").removeClass("col-sm-9").addClass("col-sm-12");
                OrderAdd.GetStockist();
                OrderAdd.GetProduct();
                OrderAdd.GetCustomerOrChemistAndSetAutoFill();
                OrderAdd.GetUserDetails();

                $("#txtUser").val(OrderAdd.defaults.action_User_Name);
                $("#hdnUserCode").val(OrderAdd.defaults.action_User_Code);
                $("#dvAddOrderContainer").show();

                // Create Stockist POB Designs
                OrderAdd.fnAddStockistRow();

                OrderAdd.UnblockUI("dvAddOrderMainContainer");
                Order.UnblockUI("dvOrderMainContainer");
                $("#dvMoreInfoModal").overlay().load();

            }
        } else {
            OrderAdd.defaults.eventTree = false;
            // Edit //
            $("#btnAddTreeShowHide").hide();
            debugger;
            $("#dvRegionTreeContainer").hide();
            $("#dvAddOrderContainer").removeClass("col-sm-9").addClass("col-sm-12");
            OrderAdd.GetStockist();
            OrderAdd.GetProduct();
            OrderAdd.GetCustomerOrChemistAndSetAutoFill();
            OrderAdd.GetUserDetails();

            $("#txtUser").val(OrderAdd.defaults.action_User_Name);
            $("#hdnUserCode").val(OrderAdd.defaults.action_User_Code);
            OrderAdd.GetOrder();
            $("#dvAddOrderContainer").show();
            OrderAdd.UnblockUI("dvAddOrderMainContainer");
            Order.UnblockUI("dvOrderMainContainer");
            $("#dvMoreInfoModal").overlay().load();

        }
       
        // Customer Caption Add 
            $("#lblCustomerCaption").text(OrderAdd.defaults.customerCaption + " Name:");
            $("#txtCustomerOrChemist").attr("placeholder", OrderAdd.defaults.customerCaption);


        // Check for Customer Or Chemist
            $("#txtCustomerOrChemist").blur(function () {
                debugger;
            var CustomerOrChemistArr = jsonPath(OrderAdd.defaults.CustomerOrChemistAutoFill_Data, "$.[?(@.value=='" + $("#hdnCustomerOrChemist").val() + "')]");
            if (CustomerOrChemistArr != false && CustomerOrChemistArr != undefined) {
                if (CustomerOrChemistArr[0].label != $(this).val()) {
                    $(this).val("");
                    $("#hdnCustomerOrChemist").val("");
                }
            }

            if (CustomerOrChemistArr == false) {
                $(this).val("");
                $("#hdnCustomerOrChemist").val("");
            }
        });

        //Submit to Set Order
        $("#btnSubmit").click(function () {
            if (OrderAdd.fnValidation()) {
                $('#btnSubmit').prop('disabled', true);
                OrderAdd.SetOrder();
            }         
        });

        // Close Overlay Event
        $(".close").click(function () {
            whichTreeHandle = "OrderList";
            $('#dvInfoContent').html("");
            $('#dvAjaxLoad').hide();
            // Call to List Page
            Order.ReturnGetCalltoList();
            // Call to List Page
        });

        // Reset Button Event
        $("#btnReset").click(function () {
            if (OrderAdd.defaults.OrderMode == "Add") {
                var strconfirm = confirm("Do you wish to clear");
                if (strconfirm) {
                    $('input[type="text"]').val('');
                    $('input[type="hidden"]').val('');
                    $('.clsRemarks').val('');
                    $("#txtUser").val(OrderAdd.defaults.action_User_Name);
                    $("#hdnUserCode").val(OrderAdd.defaults.action_User_Code);
                    $(".clsDueDate").datepicker('setDate', new Date());
                }
            }
            else {
                var strconfirm = confirm("Do you wish to Reset");
                if (strconfirm) {
                    $("#txtUser").val(OrderAdd.defaults.action_User_Name);
                    $("#hdnUserCode").val(OrderAdd.defaults.action_User_Code);
                    $("#tblStockist").empty();
                    OrderAdd.GetOrder();
                }
            }
        });
     
    },
    blockUI: function (dvId) {
        $('#' + dvId).block({
            message: '<img src="../../Content/images/loader1.gif" width="40px" height="40px"  />',
            css: {
                padding: 0,
                margin: 0,
                width: '30%',
                top: '40%',
                left: '35%',
                textAlign: 'center',
                color: '#000',
                border: 'none',
                backgroundColor: 'rgba(0,0,0,0)',
                //opacity: 0.6,
                cursor: 'wait'
            },

            // minimal style set used when themes are used 
            themedCSS: {
                width: '30%',
                top: '40%',
                left: '35%'
            },

            // styles for the overlay 
            overlayCSS: {
                backgroundColor: '#000',
                opacity: 0.6,
                cursor: 'wait'
            },

            // style to replace wait cursor before unblocking to correct issue 
            // of lingering wait cursor 
            cursorReset: 'default',
        })
    },
    UnblockUI: function (dvId) {
        $('#' + dvId).unblock();
    },
    fnIsNumber: function (evt, element) {

        var charCode = (evt.which) ? evt.which : event.keyCode

        if (
            //(charCode != 45 || $(element).val().indexOf('-') != -1) &&      // “-” CHECK MINUS, AND ONLY ONE.
            (charCode != 46 || $(element).val().indexOf('.') != -1) &&      // “.” CHECK DOT, AND ONLY ONE.
            (charCode < 48 || charCode > 57))
            return false;

        return true;
    },
    fnAddStockistRow: function () {
        debugger;
        if (OrderAdd.defaults.eventTree) {
            if (parseInt(OrderAdd.defaults.stockistRowCount) == 0) {
                OrderAdd.defaults.stockistRowCount = '0';
                $("#tblStockist").html("");
            }
        }

        var stockistRowCount = parseInt(OrderAdd.defaults.stockistRowCount);
        var productRowCount = 0;
        var str = '';

        str += '<tr class="clsRowStockist borderShadow" id="' + stockistRowCount + '" style="background: rgba(221, 221, 221, 0.35);border-radius: 0px;"><td class="borderLine">';

        // Stockist Header
        str += '<div class="col-xs-12 clearfix" style="padding:0px;">';
        str += '<div class="col-xs-7" style="padding-left:0px;">';
        str += '<div class="form-group" style="margin-bottom: 0px;">';
        str += '<label for="txtStockist">' + OrderAdd.defaults.stockistCaption + ' Name :</label>';
        str += '<input type="text" class="clsOnChangeStockistName form-control clsStockist CutPaste"  id="' + stockistRowCount + '_txtStockistName" placeholder="Select ' + OrderAdd.defaults.stockistCaption + ' Name" required />';
        str += '<input type="hidden" id="' + stockistRowCount + '_hdnStockistCode" />';
        str += '</div>';
        str += '</div>';
        str += '<div class="col-xs-4" style="padding-right:0px;">';
        str += '<div class="form-group">';
        str += '<label for="txtUser">Due Date :</label>';
        str += '<input type="text" class="form-control clsDueDate"  id="' + stockistRowCount + '_txtDueDate" style="width: 60% !important;background-color: white !important;" placeholder="Select Due Date" />';
        str += '</div>';
        if (stockistRowCount != 0) {
            str += '<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif" class="clsStockistRemove" alt="Remove" style="cursor:pointer;float: right;position: relative;bottom: 28px;right: 80px;">';
        }
        str += '</div>';
        str += '</div>';

        str += '<div class="col-xs-12 clearfix">';
        str += '<table class="clsTblProduct" id="' + stockistRowCount + '_tblProduct">';
        str += '<thead>';
        str += '<tr>';
        str += '<th>Product Name</th><th>Qty</th><th>Unit Rate</th><th>Amount</th>';
        str += '</tr>';
        str += '</thead>';
        str += ' <tbody>';
        str += '<tr id="' + productRowCount + '" data-stockistRowCount = "' + stockistRowCount + '" >';
        str += '<td><input type="text" class="form-control clsOnChangeProductName clsProduct CutPaste" id="' + stockistRowCount + '_' + productRowCount + '_txtProductName"  placeholder="Select Product Name" required /> <input type="hidden" id="' + stockistRowCount + '_' + productRowCount + '_hdnProductCode"  /> <input type="hidden" id="' + stockistRowCount + '_' + productRowCount + '_hdnEditProductCode"  /></td>';
        str += '<td style="width: 14%;"><input type="text" class="form-control clsKeyupQty clsKeypressIsNumber CutPaste txtRight" id="' + stockistRowCount + '_' + productRowCount + '_txtQty" maxlength="6" placeholder="Enter the Qty" required /></td>';
        str += '<td style="width: 14%;"><input type="text" disabled="disabled" class="form-control txtRight" id="' + stockistRowCount + '_' + productRowCount + '_txtUnitRate" placeholder="Unit Rate" /></td>';
        str += '<td style="width: 15%;">';
        str += '<input type="text" disabled="disabled" class="form-control input-disabled txtRight" id="' + stockistRowCount + '_' + productRowCount + '_txtAmount" placeholder="Amount" />';
        if (productRowCount != 0) {
            str += '<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif" class="clsProductRemove" alt="Remove" style="cursor: pointer;float: right;position: relative;top: -20px;right: -16px;padding-bottom: 0px;">';
        }
        str += '</td>';
        str += '</tr>';
        str += '</tbody>';
        str += '<tfoot>';
        str += '<tr>';
        str += '<td>No of Products : <span id="' + stockistRowCount + '_spanNoOfProducts">0</span></td>';
        str += '<td><input type="text" disabled="disabled" class="form-control txtRight" id="' + stockistRowCount + '_txtTotalQty" placeholder="Total Qty" /></td>';
        str += '<td></td>';
        str += '<td><input type="text" disabled="disabled" class="form-control txtRight" id="' + stockistRowCount + '_txtTotalPOB" placeholder="Total POB Amount" /></td>';
        str += '</tr>';
        str += '<tr><td colspan="4" id="' + stockistRowCount + '_errProduct" style="text-align:center;color:red;"></td></tr>';
        str += '<tr><td colspan="4">Remarks : </td> </tr>';
        str += '<tr><td colspan="4"><textarea id="' + stockistRowCount + '_txtRemarks" class="form-control clsRemarks" rows="4" cols="50" style="height: 55px !important;" name="comment" placeholder="Enter the Remarks"></textarea></td></tr>';
        str += '</tfoot>';
        str += '</table>';
        str += '</div>';

        str += '</td></tr>';     
        $("#tblStockist").append(str);
        OrderAdd.fnAddAutoCompleteForStockist(stockistRowCount);
        OrderAdd.fnAddAutoCompleteForProduct();
        OrderAdd.fnEventCreateforStockistRow();
    },
    fnEditStockistRow: function (orderEdit) {
        debugger;
        var str = '';
        for (var sRCount = 0; sRCount < orderEdit.lstHeader.length; sRCount++) {
            OrderAdd.defaults.stockistRowCount = sRCount;

            if (sRCount == 0) {

                OrderAdd.defaults.action_User_Code = orderEdit.lstHeader[sRCount].Favouring_User_Code;
                OrderAdd.defaults.action_Region_Code = orderEdit.lstHeader[sRCount].Favouring_Region_Code;
                OrderAdd.defaults.action_User_Code = orderEdit.lstHeader[sRCount].Created_By;

                var createdDate = new Date(eval(orderEdit.lstHeader[sRCount].Created_Date.replace(/\/Date\((\d+)\)\//gi, "new Date($1)")));

                OrderAdd.defaults.Current_Date = (createdDate.getMonth() + 1) + ' / ' + createdDate.getDate() + ' / ' + createdDate.getFullYear();

                var orderDate = new Date(eval(orderEdit.lstHeader[sRCount].Order_Date.replace(/\/Date\((\d+)\)\//gi, "new Date($1)")));

                var _orderDate = (orderDate.getMonth() + 1) + ' / ' + orderDate.getDate() + ' / ' + orderDate.getFullYear();

                $("#txtUser").val(orderEdit.lstHeader[sRCount].Favouring_User_Name);
                $("#hdnUserCode").val(orderEdit.lstHeader[sRCount].Favouring_User_Code);
                $("#hdnCustomerOrChemist").val(orderEdit.lstHeader[sRCount].Customer_Code);
                $("#txtCustomerOrChemist").val(orderEdit.lstHeader[sRCount].Customer_Name);
                $('#txtCustomerOrChemist').prop('disabled', true);
                $("#hdnOrderStatus").val(orderEdit.lstHeader[sRCount].Order_Status);
                $("#hdnOrderMode").val(orderEdit.lstHeader[sRCount].Order_Mode);
                $("#hdnOrderNumber").val(orderEdit.lstHeader[sRCount].Order_Number);
                //$("#hdnCustomer_Visit_Code").val(orderEdit.lstHeader[sRCount].Customer_Visit_Code);
                $("#hdnCustomer_Region_Code").val(orderEdit.lstHeader[sRCount].Customer_Region_Code);
                $("#hdnCustomer_Speciality").val(orderEdit.lstHeader[sRCount].Customer_Speciality);
                $("#hdnMDL_Number").val(orderEdit.lstHeader[sRCount].MDL_Number);
                $("#hdnCustomer_Category_Code").val(orderEdit.lstHeader[sRCount].Customer_Category_Code);

                $("#hdnOrder_Date").val(_orderDate);

                $("#hdnEditOldStockistCode").val(orderEdit.lstHeader[sRCount].Stockist_Code);

            }

            str += '<tr class="clsRowStockist borderShadow" id="' + sRCount + '" style="background: rgba(221, 221, 221, 0.35);border-radius: 0px;"><td class="borderLine">';

            // Stockist Header
            str += '<div class="col-xs-12 clearfix" style="padding:0px;">';
            str += '<div class="col-xs-7" style="padding-left:0px;">';
            str += '<div class="form-group" style="margin-bottom: 0px;">';
            str += '<label for="txtStockist">' + OrderAdd.defaults.stockistCaption + ' Name :</label>';
            str += '<input type="text" class="clsOnChangeStockistName form-control clsStockist CutPaste" value="' + orderEdit.lstHeader[sRCount].Stockist_Name + '"  id="' + sRCount + '_txtStockistName" placeholder="Select ' + OrderAdd.defaults.stockistCaption + ' Name" required />';
            str += '<input type="hidden" value="' + orderEdit.lstHeader[sRCount].Stockist_Code + '" id="' + sRCount + '_hdnStockistCode" />';
            str += '</div>';
            str += '</div>';
            str += '<div class="col-xs-4" style="padding-right:0px;">';
            str += '<div class="form-group">';
            str += '<label for="txtUser">Due Date :</label>';

            var orderDueDate = new Date(eval(orderEdit.lstHeader[sRCount].Order_Due_Date.replace(/\/Date\((\d+)\)\//gi, "new Date($1)")));

            str += '<input type="text" class="form-control clsDueDate" value="' + (orderDueDate.getMonth() + 1) + '/' + orderDueDate.getDate() + '/' + orderDueDate.getFullYear() + '" style="width: 60% !important;background-color: white !important;"  id="' + sRCount + '_txtDueDate" placeholder="Select Due Date" />';
            str += '</div>';
            if (sRCount != 0) {
                str += '<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif" class="clsStockistRemove" alt="Remove" style="cursor:pointer;float: right;position: relative;bottom: 28px;right: 80px;">';
            }
            str += '</div>';
            str += '</div>';

            str += '<div class="col-xs-12 clearfix">';
            str += '<table class="clsTblProduct" id="' + sRCount + '_tblProduct">';
            str += '<thead>';
            str += '<tr>';
            str += '<th>Product Name</th><th>Qty</th><th>Unit Rate</th><th>Amount</th>';
            str += '</tr>';
            str += '</thead>';
            str += ' <tbody>';

            for (var pRCount = 0; pRCount < orderEdit.lstDetails.length; pRCount++) {
                str += '<tr id="' + pRCount + '" data-stockistRowCount = "' + sRCount + '" >';
                str += '<td><input type="text" class="form-control clsOnChangeProductName clsProduct CutPaste" value="' + orderEdit.lstDetails[pRCount].Product_Name + '" id="' + sRCount + '_' + pRCount + '_txtProductName"  placeholder="Select Product Name" required /> <input type="hidden" value="' + orderEdit.lstDetails[pRCount].Product_Code + '" id="' + sRCount + '_' + pRCount + '_hdnProductCode"  /> <input type="hidden" value="' + orderEdit.lstDetails[pRCount].Product_Code + '" id="' + sRCount + '_' + pRCount + '_hdnEditProductCode"  /></td>';
                str += '<td style="width: 14%;"><input type="text" class="form-control clsKeyupQty clsKeypressIsNumber CutPaste txtRight" maxlength="6" value="' + orderEdit.lstDetails[pRCount].Product_Qty + '"  id="' + sRCount + '_' + pRCount + '_txtQty" placeholder="Enter the Qty" required /></td>';
                str += '<td style="width: 14%;"><input type="text" disabled="disabled" value="' + orderEdit.lstDetails[pRCount].Unit_Rate + '"  class="form-control CutPaste txtRight" id="' + sRCount + '_' + pRCount + '_txtUnitRate" placeholder="Unit Rate" /></td>';
                str += '<td style="width: 15%;">';
                str += '<input type="text" disabled="disabled" value="' + orderEdit.lstDetails[pRCount].Amount + '" class="form-control txtRight" id="' + sRCount + '_' + pRCount + '_txtAmount" placeholder="Amount" />';
                if (pRCount != 0) {
                    str += '<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif" class="clsProductRemove" alt="Remove" style="cursor: pointer;float: right;position: relative;top: -20px;right: -16px;padding-bottom: 0px;">';
                }
                str += '</td>';
                str += '</tr>';

                if ( parseInt( orderEdit.lstDetails.length - 1 ) == pRCount) {
                    str += '<tr id="' +  ( pRCount + 1 ) + '" data-stockistRowCount = "' + sRCount + '" >';
                    str += '<td><input type="text" class="form-control clsOnChangeProductName clsProduct CutPaste"  id="' + sRCount + '_' + (pRCount + 1) + '_txtProductName"  placeholder="Select Product Name" required /> <input type="hidden"  id="' + sRCount + '_' + (pRCount + 1) + '_hdnProductCode"  /></td>';
                    str += '<td style="width: 14%;"><input type="text" class="form-control clsKeyupQty clsKeypressIsNumber CutPaste txtRight" maxlength="6"   id="' + sRCount + '_' + (pRCount + 1) + '_txtQty" placeholder="Enter the Qty" required /></td>';
                    str += '<td style="width: 14%;"><input type="text" disabled="disabled"   class="form-control CutPaste txtRight" id="' + sRCount + '_' + (pRCount + 1) + '_txtUnitRate" placeholder="Unit Rate" /></td>';
                    str += '<td style="width: 15%;">';
                    str += '<input type="text" disabled="disabled"  class="form-control txtRight" id="' + sRCount + '_' + (pRCount + 1) + '_txtAmount" placeholder="Amount" />';
                        str += '<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif" class="clsProductRemove" alt="Remove" style="cursor: pointer;float: right;position: relative;top: -20px;right: -16px;padding-bottom: 0px;">';
                    str += '</td>';
                    str += '</tr>';
                }
            }
            str += '</tbody>';
            str += '<tfoot>';
            str += '<tr>';
            str += '<td>No of Products : <span id="' + sRCount + '_spanNoOfProducts">'+ orderEdit.lstHeader[sRCount].No_Of_Products+'</span></td>';
            str += '<td><input type="text" disabled="disabled" value="' + orderEdit.lstHeader[sRCount].Total_Qty + '" class="form-control txtRight" id="' + sRCount + '_txtTotalQty" placeholder="Total Qty" /></td>';
            str += '<td></td>';
            str += '<td><input type="text" disabled="disabled" value="' + orderEdit.lstHeader[sRCount].Total_POB_Value + '" class="form-control txtRight" id="' + sRCount + '_txtTotalPOB" placeholder="Total POB Amount" /></td>';
            str += '</tr>';
            str += '<tr><td colspan="4" id="' + sRCount + '_errProduct" style="text-align:center;color:red;"></td></tr>';
            str += '<tr><td colspan="4">Remarks : </td> </tr>';
            str += '<tr><td colspan="4"><textarea id="' + sRCount + '_txtRemarks"  class="form-control clsRemarks" rows="4" cols="50" style="height: 55px !important;" name="comment" placeholder="Enter the Remarks">' + orderEdit.lstHeader[sRCount].Remarks + '</textarea></td></tr>';
            str += '</tfoot>';
            str += '</table>';
            str += '</div>';

            str += '</td></tr>';

            $("#tblStockist").append(str);
            OrderAdd.fnAddAutoCompleteForStockist(sRCount);
            OrderAdd.fnAddAutoCompleteForProduct();
            OrderAdd.fnEventCreateforStockistRow();

        }


    },
    fnEventCreateforStockistRow: function () {
        // Event For Stockist Name
        $(".clsOnChangeStockistName").off("blur").blur(function () {

            if (OrderAdd.defaults.OrderMode == "Add") {
                //Validate Acc Data with add Unit Rate
                var thisRowCount = parseInt($(this).closest('tr').attr('id'));
                var StockistCode = $("#" + thisRowCount + "_hdnStockistCode").val();
                var stockistArr = jsonPath(OrderAdd.defaults.StockistAutoFill_Data, "$.[?(@.value=='" + StockistCode + "')]");
                if (stockistArr != false) { //this is uncommend for Invalid Stockist Select validate 
                    if (stockistArr[0].label == $(this).val()) {
                    if ($(this).closest('tr').next('tr').length == 0) {
                        OrderAdd.defaults.stockistRowCount = thisRowCount + 1;
                        OrderAdd.fnAddStockistRow();
                    }
                    } else {
                        $(this).val("");
                        $("#" + thisRowCount + "_hdnStockistCode").val("");
                    }
                } else {
                    $(this).val("");
                    $("#" + thisRowCount + "_hdnStockistCode").val("");
                }
            }

        });

        // Event For Product Name
        $(".clsOnChangeProductName").off("blur").blur(function () {
            var productRowCount = (parseInt($(this).closest('tr').attr('id')) + 1);
            var tblProductId = $(this).closest('.clsTblProduct').attr('id');
            var stockistRowCount = tblProductId.replace('_tblProduct', '');

            //Validate Acc Data with add Unit Rate
            var thisRowCount = parseInt($(this).closest('tr').attr('id'));
            var productCode = $("#" + stockistRowCount + "_" + thisRowCount + "_hdnProductCode").val();
            var productArr = jsonPath(OrderAdd.defaults.ProductAutoFill_Data, "$.[?(@.value=='" + productCode + "')]");
            if (productArr != false) { //this is uncommend for Invalid Product Select Validate

                if (productArr[0].label == $(this).val()) {
                    $("#" + stockistRowCount + "_" + thisRowCount + "_txtUnitRate").val(productArr[0].Unit_Rate);
                //if ($("#" + stockistRowCount + "_" + thisRowCount + "_hdnEditProductCode").val() != productCode) {
                //    $("#" + stockistRowCount + "_" + thisRowCount + "_txtUnitRate").val(productArr[0].Unit_Rate);
                //}
                if ($(this).closest('tr').next('tr').length == 0) {
                    var str = '';
                    str += '<tr id="' + productRowCount + '" data-stockistRowCount = "' + stockistRowCount + '" >';
                    str += '<td><input type="text" class="form-control clsOnChangeProductName clsProduct" id="' + stockistRowCount + '_' + productRowCount + '_txtProductName"  placeholder="Select Product Name" required /> <input type="hidden" id="' + stockistRowCount + '_' + productRowCount + '_hdnProductCode"  /></td>';
                    str += '<td style="width: 14%;"><input type="text" class="form-control clsKeyupQty clsKeypressIsNumber txtRight" id="' + stockistRowCount + '_' + productRowCount + '_txtQty" placeholder="Enter the Qty" required /></td>';
                    str += '<td style="width: 14%;"><input type="text" disabled="disabled" class="form-control txtRight" id="' + stockistRowCount + '_' + productRowCount + '_txtUnitRate" placeholder="Unit Rate" /></td>';
                    str += '<td style="width: 15%;">';
                    str += '<input type="text" disabled="disabled" class="form-control txtRight" id="' + stockistRowCount + '_' + productRowCount + '_txtAmount" placeholder="Amount" />';
                    if (productRowCount != 0) {
                        str += '<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif"  class="clsProductRemove" alt="Remove" style="cursor: pointer;float: right;position: relative;top: -20px;right: -16px;padding-bottom: 0px;">';
                    }
                    str += '</td>';
                    str += '</tr>';
                    $("#" + stockistRowCount + "_tblProduct").append(str);

                    OrderAdd.fnAddAutoCompleteForProduct();
                    OrderAdd.fnEventCreateforStockistRow();
                }
                } else {
                    $(this).val("");
                    $("#" + stockistRowCount + "_" + thisRowCount + "_txtUnitRate").val("");
                }
            }
            else {
                $(this).val("");
                $("#" + stockistRowCount + "_" + thisRowCount + "_txtUnitRate").val("");
            }

        });

        // Event for Check Is Number
        $(".clsKeypressIsNumber").off("keypress").keypress(function (event) {
            return OrderAdd.fnIsNumber(event, this);
        });

        // Event for POB Quentity
        $(".clsKeyupQty").off("keyup").keyup(function () {
            OrderAdd.fnPOBCalculationWithNoOfProductCount(this);
        });

        // Event For Stockist Remove
        $(".clsStockistRemove").off("click").click(function () {
            $(this).closest("tr").remove();
        });

        // Event For Product Remove
        $(".clsProductRemove").off("click").click(function () {
            $(this).closest("tr").remove();
            OrderAdd.fnPOBCalculationWithNoOfProductCount(this);
        });

        //Disable Cut and Paste
        $('.CutPaste').bind("cut paste", function (e) {
            e.preventDefault();
        });

        // Clear Remarks for DCR Special Character.
        $(".clsRemarks").keyup(function () {

            if (/[^A-Z0-9 \r\n.]/ig.test(this.value))
                this.value = this.value.replace(/[^A-Z0-9 \r\n.]/ig, '')

        });



    },
    fnAddAutoCompleteForStockist: function (stockistRowCount) {
        $("#" + stockistRowCount + "_txtDueDate").datepicker({
            dateFormat: 'mm/dd/yy',
            minDate: 0
        }).attr('readonly', 'readonly');

        if (OrderAdd.defaults.OrderMode == "Add") {
            $("#" + stockistRowCount + "_txtDueDate").datepicker('setDate', new Date());
        }

        autoComplete(OrderAdd.defaults.StockistAutoFill_Data, "_txtStockistName", "_hdnStockistCode", "clsStockist");

    },
    fnAddAutoCompleteForProduct: function () {
        autoComplete(OrderAdd.defaults.ProductAutoFill_Data, "_txtProductName", "_hdnProductCode", "clsProduct");
    },
    fnPOBCalculationWithNoOfProductCount: function (element) {
        //POB Calculation
        var thisRowCount = parseInt($(element).closest('tr').attr('id'));
        var stockistRowCount = $(element).closest('tr').data('stockistrowcount');

        // Check Same Product
        OrderAdd.fnCheckSameProduct(stockistRowCount, thisRowCount);
        //

        var thisTotalAmount = parseFloat($('#' + stockistRowCount + '_' + thisRowCount + '_txtQty').val() == '' ? 0 : $('#' + stockistRowCount + '_' + thisRowCount + '_txtQty').val())
                      * parseFloat($('#' + stockistRowCount + '_' + thisRowCount + '_txtUnitRate').val() == '' ? 0 : $('#' + stockistRowCount + '_' + thisRowCount + '_txtUnitRate').val());
        $('#' + stockistRowCount + '_' + thisRowCount + '_txtAmount').val(thisTotalAmount.toFixed(2));

        var fullTotalAmount = 0.00, fullTotalQty = 0.00, noOfProductCount = 0;
        $("#" + stockistRowCount + "_tblProduct tbody tr").each(function () {

            var rowCount = $(this).attr('id');
            if ($('#' + stockistRowCount + '_' + rowCount + '_txtQty').val() != '' && $('#' + stockistRowCount + '_' + rowCount + '_txtProductName').val() != '') {
                fullTotalQty += parseFloat($('#' + stockistRowCount + '_' + rowCount + '_txtQty').val() == '' ? 0.00 : $('#' + stockistRowCount + '_' + rowCount + '_txtQty').val());
                fullTotalAmount += parseFloat($('#' + stockistRowCount + '_' + rowCount + '_txtAmount').val() == '' ? 0.00 : $('#' + stockistRowCount + '_' + rowCount + '_txtAmount').val());
                noOfProductCount++;
            }

        });

        $('#' + stockistRowCount + '_txtTotalQty').val(fullTotalQty.toFixed(2));
        $('#' + stockistRowCount + '_txtTotalPOB').val(fullTotalAmount.toFixed(2));
        // No Of Product Count
        $("#" + stockistRowCount + "_spanNoOfProducts").text(noOfProductCount);

    },
    fnCheckSameProduct: function (sRCount, pRCount) {

        var thisProductCode = $('#' + sRCount + '_' + pRCount + '_hdnProductCode').val();
        var chk = true;

        // Get Product Code 
        var arrProduct = [];
        var i = 0
        $("#" + sRCount + "_tblProduct tbody tr").each(function () {
            var rowCount = $(this).attr('id');
            if ($('#' + sRCount + '_' + rowCount + '_hdnProductCode').val() != '' && $('#' + sRCount + '_' + rowCount + '_txtProductName').val() != '') {
                arrProduct[i] = $('#' + sRCount + '_' + rowCount + '_hdnProductCode').val();
                i++;
            }
        });


        var sorted_arr = arrProduct.slice().sort();
        var results = [];
        for (var i = 0; i < arrProduct.length - 1; i++) {
            if (sorted_arr[i + 1] == sorted_arr[i]) {
                results.push(sorted_arr[i]);
            }
        }

        if (results.length > 0) {
            chk = false;
            OrderAdd.defaults.sameProduct = false;
            $('#' + sRCount + '_errProduct').html("Please avoid repetition of Products");
            $('#' + sRCount + '_' + pRCount + '_txtProductName').css('border-color', 'red');
        } else {
            chk = true;
            OrderAdd.defaults.sameProduct = true;
            $('#' + sRCount + '_errProduct').html("");
            $('#' + sRCount + '_' + pRCount + '_txtProductName').css('border-color', '');
        }


        return chk;
    },
    fnValidation: function () {
        debugger;
        var validate = true;

        // Customer Name Empty Validate
        if ($("#txtCustomerOrChemist").val() == '') {
            fnMsgAlert('error', 'Error', 'Please Select the Customer Name');
            validate = false;
            return false;
        }

        //Check the Stockist
        if ($("#0_txtStockistName").val() == "" && $("#0_hdnStockistCode").val() == "") {
            fnMsgAlert('error', 'Error', 'Please Select the Stockist');
            validate = false;
            return false;
        }

        //Check the Product
        if ($('#0_0_txtProductName').val() == "" && $('#0_0_hdnProductCode').val() == "") {
            fnMsgAlert('error', 'Error', 'Please Select the Product');
            validate = false;
            return false;
        }


        ////////////  Same Product ////////////////
        var ptCheck = false;
        $('.clsRowStockist').each(function () {
            debugger;
            var sRCount = $(this).attr("id");

            if ($('#' + sRCount + '_hdnStockistCode').val() != '' && $('#' + sRCount + '_hdnStockistCode').val() != undefined) {
                if ($("#" + sRCount + "_errProduct").html() == "Please avoid repetition of Products") {
                    fnMsgAlert('error', 'Error', 'Please Avoid Same Product');
                    ptCheck = true;
                }
            }

            if (ptCheck) {
                validate = false;
                return false;
            }

        });
        ////////////////////////////////////////////


        /////////// Same Stockist Validation  /////////////
        var arrStockist = [];
        var stCount = 0;
        $('.clsRowStockist').each(function () {
            debugger;
            var sRCount = $(this).attr("id");
           
            if ($('#' + sRCount + '_hdnStockistCode').val() != '' && $('#' + sRCount + '_hdnStockistCode').val() != undefined) {
                arrStockist[stCount] = $('#' + sRCount + '_hdnStockistCode').val();
            }
            stCount++;
        });

        var sorted_arr = arrStockist.slice().sort();
        var results = [];
        for (var i = 0; i < arrStockist.length - 1; i++) {
            if (sorted_arr[i + 1] == sorted_arr[i]) {
                results.push(sorted_arr[i]);
            }
        }

        if (results.length > 0) {
            fnMsgAlert('error', 'Error', 'Please Avoid Same Stockoist');
            validate = false;
        }

        /////////////////////////////////////////////////////


        // ----------- Total POB Validate ------------ //

        var arrTotalPob = [];
        var tPobCount = 0;
        $('.clsRowStockist').each(function () {
            debugger;
            var sRCount = $(this).attr("id");
           
            if ($('#' + sRCount + '_hdnStockistCode').val() != '' && $('#' + sRCount + '_hdnStockistCode').val() != undefined) {
                arrTotalPob[tPobCount] = $('#' + sRCount + '_txtTotalPOB').val();
            }
            tPobCount++;
        });

        for (var i = 0; i < arrTotalPob.length; i++) {
            if (parseFloat(arrTotalPob[i]) == 0)
            {
                fnMsgAlert('error', 'Error', 'Total POB Value Should be Greater then Zero');
                validate = false;
                break;
            }
        }

        // ------------------------------- //

        return validate;

    },
    fnBuildObject: function () {
        debugger;
        var objOrderAdd = { lstHeader: [], lstDetails: [] };

        // get customer Region Code from Json Path.
        var customerArr = jsonPath(OrderAdd.defaults.CustomerOrChemistAutoFill_Data, "$.[?(@.value=='" + $("#hdnCustomerOrChemist").val() + "')]");
        var customerRegionCode = "", customerSpeciality = "", mdl_Number = "", customerCategoryCode = "";
        if (customerArr != undefined && customerArr.length > 0) {
            customerRegionCode = customerArr[0].Doctor_Region_Code;
            customerSpeciality = customerArr[0].Speciality_Name;
            mdl_Number = customerArr[0].label.split('_')[1];
            customerCategoryCode = customerArr[0].Category_Code;
        }
        else {
            customerRegionCode = $("#hdnCustomer_Region_Code").val();
            customerSpeciality = $("#hdnCustomer_Speciality").val();
            mdl_Number = $("#hdnMDL_Number").val();
            customerCategoryCode = $("#hdnCustomer_Category_Code").val();
            //fnMsgAlert('error', 'Error', 'There is no Region Code in Selected Customer So Invalid Customer');
            //return false;
        }
        

        var Client_Order_ID = 1;
        var productID = 1 ;
        $('.clsRowStockist').each(function () {

            var objOrderHeader = {};
            var sRCount = $(this).attr("id");

            if ($('#' + sRCount + '_hdnStockistCode').val() != '' && $('#' + sRCount + '_hdnStockistCode').val() != undefined) {

                objOrderHeader.Client_Order_Id = Client_Order_ID;
                objOrderHeader.ID = Client_Order_ID;
                if (OrderAdd.defaults.OrderMode == "Add") {
                    //         For Insert         //
                    objOrderHeader.Order_Id = -1;
                    objOrderHeader.Order_Number = -1;
                    objOrderHeader.Order_Status =  $("#hdnOrderStatus").val();
                    objOrderHeader.Order_Mode = 1;

                    if ($("#hdnCustomerOrChemist").val() != '') {
                        objOrderHeader.Customer_Name = $("#txtCustomerOrChemist").val().split('_')[0];
                    }

                    //___________________________ //
                }
                else {
                    //         For Edit         //
                    objOrderHeader.Order_Id = OrderAdd.defaults.Order_Id;
                    objOrderHeader.Order_Number = $("#hdnOrderNumber").val();
                    objOrderHeader.Order_Status = $("#hdnOrderStatus").val();

                    // Check Same Stockist Code for cancel and Inprogress Order .
                    if ($("#hdnEditOldStockistCode").val() == $('#' + sRCount + '_hdnStockistCode').val()) {
                        objOrderHeader.Order_Mode = $("#hdnOrderMode").val();
                    } else {
                        objOrderHeader.Order_Mode = 1;
                    }
                    //
                    
                    objOrderHeader.Order_Date = $("#hdnOrder_Date").val();
                    //objOrderHeader.Customer_Visit_Code = $("#hdnCustomer_Visit_Code").val();
                    objOrderHeader.Customer_Name = $("#txtCustomerOrChemist").val();
                    //___________________________ //
                }

                //// Newly Added for Customer Visti Code Logic

                objOrderHeader.Customer_Speciality = customerSpeciality;
                objOrderHeader.MDL_Number = mdl_Number;
                objOrderHeader.Customer_Category_Code = customerCategoryCode;

             
              

                ////


                objOrderHeader.Source_Of_Entry = 1;
                objOrderHeader.Action = 0;

                objOrderHeader.Favouring_User_Code = OrderAdd.defaults.action_User_Code; // Edit Also ..
                objOrderHeader.Favouring_Region_Code = OrderAdd.defaults.action_Region_Code;
                objOrderHeader.Created_By = OrderAdd.defaults.login_User_Code;
                objOrderHeader.Created_Date = OrderAdd.defaults.Current_Date;   // Edit Also ..

                objOrderHeader.Customer_Code = $("#hdnCustomerOrChemist").val();
                objOrderHeader.Customer_Region_Code = customerRegionCode;



                objOrderHeader.Stockist_Code = $('#' + sRCount + '_hdnStockistCode').val();
                // get Stockist Region Code from Json Path.
                var stockistArr = jsonPath(OrderAdd.defaults.StockistAutoFill_Data, "$.[?(@.value=='" + objOrderHeader.Stockist_Code + "')]");
                if (stockistArr.length > 0) {
                    objOrderHeader.Stockist_Region_Code = stockistArr[0].Region_Code;
                }
                else {
                    //fnMsgAlert('error', 'Error', 'There is no Region Code in Selected Stockist So Invalid Stockist');
                    //return false;
                }
                objOrderHeader.Order_Due_Date = $('#' + sRCount + '_txtDueDate').val() == "" ? null : $('#' + sRCount + '_txtDueDate').val();

                objOrderHeader.Total_Qty = $('#' + sRCount + '_txtTotalQty').val();
                objOrderHeader.Total_POB_Value = $('#' + sRCount + '_txtTotalPOB').val();
                objOrderHeader.No_Of_Products = $('#' + sRCount + '_spanNoOfProducts').text();
                objOrderHeader.Remarks = $('#' + sRCount + '_txtRemarks').val();

                objOrderAdd.lstHeader.push(objOrderHeader);

                var id = 1;
                $("#" + sRCount + "_tblProduct tbody tr").each(function () {
                    var pRCount = $(this).attr("id");
                    if ($('#' + sRCount + '_' + pRCount + '_hdnProductCode').val() != '' && $('#' + sRCount + '_' + pRCount + '_hdnProductCode').val() != undefined && $('#' + sRCount + '_' + pRCount + '_txtProductName').val() != '' && $('#' + sRCount + '_' + pRCount + '_txtProductName').val() != undefined) {
                        var objDetails = {};

                        objDetails.Client_Order_Id = Client_Order_ID;
                        if (OrderAdd.defaults.OrderMode == "Add") {
                            //         For Insert         //
                            objDetails.Order_Id = -1;
                            //___________________________ //
                        } else {
                            //         For Edit         //
                            objDetails.Order_Id = OrderAdd.defaults.Order_Id;
                            //___________________________ //
                        }

                        objDetails.ID = productID;
                        objDetails.Product_Code = $('#' + sRCount + '_' + pRCount + '_hdnProductCode').val();
                        objDetails.Product_Qty = $('#' + sRCount + '_' + pRCount + '_txtQty').val();
                        objDetails.Unit_Rate = $('#' + sRCount + '_' + pRCount + '_txtUnitRate').val();
                        objDetails.Amount = $('#' + sRCount + '_' + pRCount + '_txtAmount').val();

                        objOrderAdd.lstDetails.push(objDetails);
                        id++;
                        productID++;
                    }
                });



                Client_Order_ID++;
            }


        });

        return objOrderAdd;

    },
    SetOrder: function () {

        jsonData = JSON.stringify({ 'orderAdd': OrderAdd.fnBuildObject() });

        $.ajax({
            start: OrderAdd.blockUI("dvAddOrderMainContainer"),
            contentType: 'application/json; charset=utf-8',
            type: 'POST',
            dataType: 'json',
            data: jsonData,
            url: "Order/SetOrder",
            async: false,
            success: function (jsonData) {
                if (jsonData == '') {
                    if (OrderAdd.defaults.OrderMode == "Add") {
                        fnMsgAlert('success', 'Success', 'Order has been Successfully Created.');
                    } else {
                        fnMsgAlert('success', 'Success', 'Order has been Successfully Updated.');
                    }
                    $('#btnSubmit').prop('disabled', false);
                    $("#dvMoreInfoModal").overlay().close();
                    $('#dvInfoContent').html("");

                    // Call to List Page
                    Order.ReturnGetCalltoList();
                    // Call to List Page

                    whichTreeHandle = "OrderList";
                } else {
                    fnMsgAlert('error', 'Error', 'This Order Number ' + jsonData + ' status has been modified So system ignored this Order.');
                }
               

            },
            error: function (e) {
            },
            complete: function () {
                OrderAdd.UnblockUI("dvAddOrderMainContainer");
                $('#btnSubmit').prop('disabled', false);
            }
        });
    },
    GetOrder: function () {
        debugger;
        $.ajax({
            start: OrderAdd.blockUI("dvAddOrderMainContainer"),
            type: 'POST',
            data: 'orderId=' + OrderAdd.defaults.Order_Id,
            url: 'Order/GetOrder',
            async: false,
            success: function (response) {
                if (response != null && response != undefined) {
                    OrderAdd.fnEditStockistRow(response);
                }
            },
            complete: function ()
            { OrderAdd.UnblockUI("dvAddOrderMainContainer"); }
        });


    },
    GetCustomerOrChemistAndSetAutoFill: function () {
        debugger;
        $.ajax({
            start: OrderAdd.blockUI("dvAddOrderMainContainer"),
            type: 'POST',
            data: 'Region_Code=' + OrderAdd.defaults.action_Region_Code + "&showAccDataValue=" + OrderAdd.defaults.showAccData + "&dcrActualDate=" + OrderAdd.defaults.Current_Date,
            url: 'Order/GetDoctorOrChemist',
            async: false,
            success: function (response) {
                if (response != null) {
                    OrderAdd.defaults.CustomerOrChemistAutoFill_Data = response;
                    autoComplete(OrderAdd.defaults.CustomerOrChemistAutoFill_Data, "txtCustomerOrChemist", "hdnCustomerOrChemist", "clsCustomerOrChemist");
                }
            },
            complete: function ()
            { OrderAdd.UnblockUI("dvAddOrderMainContainer"); }
        });
    },
    GetStockist: function () {

        $.ajax({
            start: OrderAdd.blockUI("dvAddOrderMainContainer"),
            type: 'POST',
            data: "accom_Regioncodes=" + OrderAdd.defaults.action_Region_Code,
            url: 'Order/GetStockist',
            async: false,
            success: function (response) {
                if (response != '' && response != undefined)
                    var StockistAuto = response;
                for (var i = 0; i < StockistAuto.length; i++) {
                    var acc = {};
                    acc.label = StockistAuto[i].StockiestName;
                    acc.value = StockistAuto[i].StockiestCode;
                    acc.Region_Code = StockistAuto[i].StockiestRegionCode;
                    OrderAdd.defaults.StockistAutoFill_Data.push(acc);
                }
            },
            complete: function ()
            { OrderAdd.UnblockUI("dvAddOrderMainContainer"); }
        });
    },
    GetProduct: function () {
        $.ajax({
            start: OrderAdd.blockUI("dvAddOrderMainContainer"),
            type: 'POST',
            data: "Region_Code=" + OrderAdd.defaults.action_Region_Code,
            url: 'Order/GetProduct',
            async: false,
            success: function (response) {
                if (response != '' && response != undefined)
                    OrderAdd.defaults.ProductAutoFill_Data = response;
            },
            complete: function ()
            { OrderAdd.UnblockUI("dvAddOrderMainContainer"); }
        });
    },
    GetUserDetails: function ()
    {
        $.ajax({
            start: OrderAdd.blockUI("dvAddOrderMainContainer"),
            type: 'POST',
            data: "Region_Code=" + OrderAdd.defaults.action_Region_Code,
            url: 'Order/GetUserDetails',
            async: false,
            success: function (response) {
                if (response != '' && response != undefined) {
                    OrderAdd.defaults.action_User_Code = response.Favouring_User_Code;
                    OrderAdd.defaults.action_User_Name = response.Favouring_User_Name;
                }
            },
            complete: function ()
            { OrderAdd.UnblockUI("dvAddOrderMainContainer"); }
        });
    },
    GetLineOfBusiness: function () {
        $.ajax({
            start: OrderAdd.blockUI("dvAddOrderMainContainer"),
            type: 'POST',
            data: "Region_Code=" + OrderAdd.defaults.action_Region_Code,
            url: 'Order/GetLineOfBusiness',
            async: false,
            success: function (response) {
                if (response != '' && response != undefined) {
                    OrderAdd.defaults.LineOfBusiness = response;
                }
            },
            complete: function ()
            { OrderAdd.UnblockUI("dvAddOrderMainContainer"); }
        });
    }



}
