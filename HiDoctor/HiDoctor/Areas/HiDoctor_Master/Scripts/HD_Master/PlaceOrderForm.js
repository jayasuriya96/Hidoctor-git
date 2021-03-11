var PurchaseRequisitionList = '';
var PlaceOrderList='';
var CurrentPO_Id = '';
var ReqDet_Id = '';
var OrderId = '';
var gridId = '';
var Invoices_List = '';

var PlaceOrder = {
    defaults: {

    },
    Init: function () {
        PlaceOrder.fnGetAllPurchaseRequisitionForms();
        PlaceOrder.fnGetAllInvoices();
    },
    fnGetAllPurchaseRequisitionForms: function () {
        debugger;
        $.ajax({
            type: "GET",
            url: "../HIDoctor_Master/PurchaseRequisition/GetAllPurchaseRequisitions",
            data: "",
            async: false,
            success: function (resp) {
                console.log(resp);
                PurchaseRequisitionList = resp;
                PlaceOrder.fnBindPurchaseRequisitionsList(resp);
                PlaceOrder.fnGetAllPlaceOrdersForms();
            }
        });
    },
    fnBindPurchaseRequisitionsList: function (resp) {
        debugger;
        var content = '';
        var sno = 0;
        content += '<table class="table table-hover">';
        content += '<thead style="text-align:center;">';
        content += '<tr>';
        content += '<th>S.No</th>';
        content += '<th>Requisition Id</th>';
        content += '<th>Requisition By</th>';
        content += '<th>Requisition On</th>';
        content += '<th>Reference Type</th>';
        content += '<th>Action</th>';
        content += '</tr>';
        content += '</thead><tbody>';
        if (resp.lstHeader.length >= 1) {
            for (var i = 0; i < resp.lstHeader.length; i++) {                
                sno++;
                content += '<tr>';
                content += '<td style="text-align:center;">' + sno + '</td>';
                content += '<td style="text-align:center;">' + resp.lstHeader[i].Requisition_Id + '</td>';
                content += '<td style="text-align:center;">' + resp.lstHeader[i].Requisition_By + '</td>';
                content += '<td style="text-align:center;">' + resp.lstHeader[i].Requisition_Date.split(' ')[0] + '</td>';
                if (resp.lstHeader[i].Campaign_Code != 0) {
                    content += '<td style="text-align:center;word-wrap: break-word;white-space: normal;word-break: break-word;width: 25%;">' + resp.lstHeader[i].Campaign_Name + '</td>';
                } else {
                    content += '<td style="text-align:center;word-wrap: break-word;white-space: normal;word-break: break-word;width: 25%;">General</td>';
                }
                content += '<td style="cursor: pointer;text-decoration: underline;color: blue; text-align:center" Onclick="PlaceOrder.fnViewForm(\'' + resp.lstHeader[i].Requisition_Id + '\',\'' + i + '\');">View</td>';
                content += '</tr>';
                content += '<tr id="rowData' + i + '" class="RowData" style="display:none;"><td colspan="6">';
                content += '<div  id="detmain' + i + '">';
                content += '<div class="form-group" id="detailsProd' + i + '">';
                content += '<div class="row">';
                content += '<div class="col-xs-12">';
                content += '<div class="col-xs-2">';
                content += '<p><span style="font-weight:bold;">Requistion By</span></p>';
                content += '</div>';
                content += '<div class="col-xs-1"><p><span style="text-align:center;"><label>:</label></span></p></div>';
                content += '<div class="col-xs-6">';
                content += '<p><span id="ReqBy' + i + '"></span></p>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '<div class="row">';
                content += ' <div class="col-xs-12">';
                content += '<div class="col-xs-2">';
                content += '<p><span style="font-weight:bold;">Requistion On</span></p>';
                content += '</div>';
                content += '<div class="col-xs-1"><p><span style="text-align:center;"><label>:</label></span></p></div>';
                content += '<div class="col-xs-6">';
                content += '<p><span id="ReqOn' + i + '"></span></p>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '<div class="row">';
                content += '<div class="col-xs-12">';
                content += '<div class="col-xs-2">';
                content += '<p><span style="font-weight:bold;">Objective</span></p>';
                content += ' </div>';
                content += '<div class="col-xs-1"><p><span style="text-align:center;"><label>:</label></span></p></div>';
                content += '<div class="col-xs-6">';
                content += ' <p><span id="Objctve' + i + '"></span></p>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '<div class="row">';
                content += '<div class="col-xs-12">';
                content += '<div class="col-xs-2">';
                content += '<p><span style="font-weight:bold;">Reference Type</span></p>';
                content += '</div>';
                content += '<div class="col-xs-1"><p><span style="text-align:center;"><label>:</label></span></p></div>';
                content += '<div class="col-xs-6">';
                content += '<p><span id="RefType' + i + '"></span></p>';
                content += '</div>';
                content += '</div></div>';
                content += '<div class="col-xs-12" id="prodtable' + i + '">';
                content += '</div>';
                content += '<div class="col-xs-12" id="actnbtns' + i + '">';
                content += '<div class="col-xs-6"></div>';
                content += '<div class="col-xs-6">';
                content += '<input type="button" class="btn" value="Close" style="float:right;" onclick="PlaceOrder.fnClosePODetails(' + i + ');" />';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '</td></tr>';

            }
        } else {
            //content = '';
            content += "<tr style='font-style:italic;text-align:center;'><td colspan='6'>No Purchase Requisition Form(s) Available to Place Order.</td></tr>";
        }
        content += '</tbody></table>';
        $('#PRList').html(content);
    },
    fnViewForm: function (PR_Id,rowId) {
        debugger;
        if ($('.RowData').is(':visible')) {
            $('.RowData').hide();
            CurrentPO_Id = '';
            gridId = '';
        }
        $('#RefType').removeClass('reftypestyle');
        CurrentPO_Id = PR_Id;
        gridId = rowId;
        var disjsonProd = '';
        var disjsonHdr = '';
        var content = '';
        var sno = 0;
        if (PR_Id != "" && PR_Id != undefined) {
            disjsonProd = jsonPath(PurchaseRequisitionList.lstProd, "$.[?(@.Requisition_Id =='" + PR_Id + "')]");
        }
        if (PR_Id != "" && PR_Id != undefined) {
            disjsonHdr = jsonPath(PurchaseRequisitionList.lstHeader, "$.[?(@.Requisition_Id=='" + PR_Id + "')]");
        }
        if (disjsonHdr.length > 0 && disjsonHdr != undefined) {


            $('#ReqBy' + rowId).html(disjsonHdr[0].Requisition_By);
            $('#ReqOn' + rowId).html(disjsonHdr[0].Requisition_Date.split(' ')[0]);
            if (disjsonHdr[0].Objective == "") {
                $('#Objctve' + rowId).html("No Objective");
                $('#Objctve' + rowId).addClass('reftypestyle');
            } else {
                $('#Objctve' + rowId).html(disjsonHdr[0].Objective);
            }

            if (disjsonHdr[0].Campaign_Code != 0) {
                $('#RefType' + rowId).html(disjsonHdr[0].Campaign_Name);
            } else {
                $('#RefType' + rowId).html("No Reference Type");
                $('#RefType' + rowId).addClass('reftypestyle');
            }
            if (disjsonProd.length >= 1) {
                content += '<table class="table table-hover" style="text-align:center;">';
                content += '<thead style="text-align:center;">';
                content += '<tr>';
                content += '<th>S.No</th>';
                content += '<th width="30%;">Product</th>';
                content += '<th width="10%;">Requested Quantity</th>';
                content += '<th width="10%;">Ordered Quantity</th>';
                content += '<th width="10%;">Balance Quantity</th>';
                content += '<th width="30%;">Remarks</th>';
                content += '<th>Acknowledge</th>';
                content += '<th>Place Order</th>';
                content += '</tr>';
                content += '</thead><tbody>';
                for (var i = 0; i < disjsonProd.length; i++) {
                    sno++;
                    var pending_quantity = disjsonProd[i].Quantity - disjsonProd[i].Ordered_Quantity;
                    content += '<tr>';
                    content += '<td>' + sno + '</td>';
                    content += '<td>' + disjsonProd[i].Product_Name + '</td>';
                    content += '<td>' + disjsonProd[i].Quantity + '</td>';
                    content += '<td>' + disjsonProd[i].Ordered_Quantity + '</td>';
                    content += '<td>' + pending_quantity + '</td>';
                    if (disjsonProd[i].Remarks == null) {
                        content += '<td></td>';
                    }
                    else {
                        content += '<td style="text-align:justify;">' + disjsonProd[i].Remarks + '</td>';
                    }
                    if (disjsonProd[i].Acknowledge_Status == 0) {
                        content += '<td style="cursor: pointer;text-decoration: underline;color: blue; text-align:center" Onclick="PlaceOrder.fnAcknowledgeItem(\'' + disjsonProd[i].Requisition_Details_Id + '\');">Acknowledge</td>';
                    } else {
                        content += '<td><img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/tpapp_approve.png" title="Acknowledged"></td>';
                    }
                    if (disjsonProd[i].Acknowledge_Status == 0) {
                        content += '<td></td>';
                    } else {
                        if (disjsonProd[i].Quantity == disjsonProd[i].Ordered_Quantity) {
                            content += '<td><img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/tpapp_approve.png" title="Ordered total Requested Quantity"></td>';
                        } else {
                            content += '<td style="cursor: pointer;text-decoration: underline;color: blue; text-align:center" Onclick="PlaceOrder.fnPlaceOrderForLineItem(\'' + disjsonProd[i].Requisition_Details_Id + '\');">Place Order</td>';
                        }

                    }

                    content += '</tr>';
                }
                content += '</tbody></table>';
            }
            $('#prodtable' + rowId).html(content);
            $('#detailsProd' + rowId).show();
            $('#rowData' + rowId).show();
        }
    },
    fnClosePODetails: function (rowId) {
        debugger;
        $('#detailsProd' + rowId).hide();
        $('#rowData' + rowId).hide();
    },
    fnAcknowledgeItem: function (Req_Det_Id) {
        debugger;
        var mode = 'PO';
        $.ajax({
            type: "PUT",
            url: "../HiDoctor_Master/PurchaseRequisition/UpdateAcknowledgement",
            data: "mode=" + mode + "&UpdateId=" + Req_Det_Id,
            success: function (resp) {
                console.log(resp);
                if (resp == "True") {
                    PlaceOrder.fnGetAllPurchaseRequisitionForms();
                    if (CurrentPO_Id != "" && gridId!="") {
                        PlaceOrder.fnViewForm(CurrentPO_Id, gridId);
                    }
                    fnMsgAlert('success', 'Place Order', 'Acknowledged Successfully.')
                    return false;
                } else {
                    fnMsgAlert('error', 'Place Order', 'Failed to Acknowledge.Please try After Sometime.')
                    return false;
                }
            }
        });
    },
    

    fnPlaceOrderForLineItem: function (Req_Det_Id) {
        debugger;
        ReqDet_Id = Req_Det_Id;
        var disjson = '';
        if (Req_Det_Id != "" && Req_Det_Id != undefined) {
            disjson = jsonPath(PurchaseRequisitionList.lstProd, "$.[?(@.Requisition_Details_Id=='" + ReqDet_Id + "')]");
        }
        if (Req_Det_Id != "" && Req_Det_Id != undefined) {
            disjsonhdr = jsonPath(PurchaseRequisitionList.lstHeader, "$.[?(@.Requisition_Id=='" + CurrentPO_Id + "')]");
        }
        if (disjson.length >= 1) {
            $('#ItemName').html(disjson[0].Product_Name);
            $('#POtotQtity').html(disjson[0].Quantity);
            $('#POordrdqtity').html(disjson[0].Ordered_Quantity);
            var pending_quantity = disjson[0].Quantity - disjson[0].Ordered_Quantity;
            $('#BalPOQtity').html(pending_quantity);
            $('#OrdrdOn').datepicker('destroy');
            PlaceOrder.fnGetDateBasedonRequisitionDate(disjsonhdr[0].Requisition_Date);
            $('#main').block();
            $("#dvOverLay").overlay().load();
        }

    },
    fnGetDateBasedonRequisitionDate:function(reqDate){
        debugger;
        if (reqDate != '' && reqDate != undefined) {
            reqDate = reqDate.split('/')[2] + '/' + reqDate.split('/')[1] + '/' + reqDate.split('/')[0];
        }
        $(function () {
            $('#OrdrdOn').datepicker({
                dateFormat: 'dd/mm/yy',
                numberOfMonths: 1,
                maxDate: 0,
                changeMonth: true,
                changeYear: true,
                minDate: new Date(reqDate)
            });
        });
    },

    fnSavePlaceOrder: function () {
        debugger;
        var result = PlaceOrder.fnValidatePlaceOrderForm();
        if (result == true) {
            $.blockUI();
            $('#dvOverLay').block();
            var vendorName = $('#vndrName').val();
            var Quantity = $('#Qntity').val();
            var remarks = $('#POremarks').val();
            var orderedOn = $('#OrdrdOn').val();
            if (orderedOn != "") {
                orderedOn = orderedOn.split('/')[2] + '/' + orderedOn.split('/')[1] + '/' + orderedOn.split('/')[0];
            }
            var Objplaceorder = {
                Vendor_Name: vendorName,
                Quantity: Quantity,
                Remarks: remarks,
                Ordered_On: orderedOn,
                Requisition_Details_Id: ReqDet_Id,
            };
            $.ajax({
                type: "POST",
                url: "../HiDoctor_Master/PurchaseRequisition/InsertPlaceOrderDetails",
                data: JSON.stringify({ "ObjPlaceOrder": Objplaceorder }),
                contentType: 'application/json; charset=utf-8',
                success: function (resp) {
                    if (resp = "True") {
                        PlaceOrder.fnClearForm();
                        PlaceOrder.fnGetAllPlaceOrdersForms();
                        $('#dvOverLay').unblock();
                        $("#dvOverLay").overlay().close();
                        PlaceOrder.fnGetAllPurchaseRequisitionForms();
                        if (CurrentPO_Id != "") {
                            PlaceOrder.fnViewForm(CurrentPO_Id,gridId);
                        }
                        $.unblockUI();
                        fnMsgAlert('info', 'Place Order', 'Order Placed Successfully.')
                        return false;
                    } else {
                        $('#dvOverLay').unblock();
                        $("#dvOverLay").overlay().close();
                        $.unblockUI();
                        fnMsgAlert('info', 'Place Order', 'Failed to Place Order.Please try after sometime');
                        return false;
                    }
                }
            });
        }
    },
    fnValidatePlaceOrderForm:function(){
        debugger;
        var flag = true;

        if ($('#OrdrdOn').val() == '') {
            fnMsgAlert('info', 'Place Order', 'Please Enter Order Date.');
            flag = false;
            return;
        }
        if ($('#vndrName').val() == '') {
            fnMsgAlert('info', 'Place Order', 'Please Enter Vendor Name.');
            flag = false;
            return;

        }
        if ($('#vndrName').val() != '') {
            var result = PlaceOrder.fnValidateRemarks($('#vndrName').val());          
            if (result == false) {
                fnMsgAlert('info', 'Place Order', 'Only (a-z A-Z 0-9 (){}[]@\/.,-_:;!?) special characters are allowed in Vendor Name.');
                flag = false;
                return;
            }
        }
        if ($('#Qntity').val() == '') {
            fnMsgAlert('info', 'Place Order', 'Please Enter Quantity.');
            flag = false;
            return;
        }
        if ($('#Qntity').val() == 0) {
            fnMsgAlert('info', 'Place Order', 'Please Enter Quantity other than Zero(0).');
            flag = false;
            return;
        }
        if (ReqDet_Id != undefined && ReqDet_Id != "") {
            var disjson = jsonPath(PurchaseRequisitionList, "$.[?(@.Requisition_Details_Id=='" + ReqDet_Id + "')]");
            if (disjson.length >= 1 && $('#Qntity').val() != '') {
                var Bal_Quantity = disjson[0].Quantity - disjson[0].Ordered_Quantity;
                if ($('#Qntity').val() > Bal_Quantity) {
                    fnMsgAlert('info', 'Place Order', 'Place Order Quantity cannot exceed the Balance Quantity.');
                    flag = false;
                    return;
                }
            }
        }
        if ($('#POremarks').val() != "") {
            var result = PlaceOrder.fnValidateRemarks($('#POremarks').val());
            if (result == false) {
                fnMsgAlert('info', 'Place Order', 'Only (a-z A-Z 0-9 (){}[]@\/.,-_:;!?) special characters are allowed in Remarks.');
                flag = false;
                return;
            }
        }
        return flag;
    },
    fnClearForm: function () {
        debugger;
        $('#vndrName').val('');
        $('#Qntity').val('');
        $('#POremarks').val('');
        $('#OrdrdOn').val('');
        $('#main').unblock();
    },
    fnGetAllPlaceOrdersForms: function () {
        debugger;
        $.ajax({
            type: "GET",
            url: "../HiDoctor_Master/PurchaseRequisition/GetAllPlaceOrders",
            data: "",
            success: function (resp) {
                PlaceOrderList = resp;
                PlaceOrder.fnBindPlaceOrdersList(resp);
            }
        });
    },

    fnBindPlaceOrdersList: function (resp) {
        debugger;
        var content = '';
        var sno = 0;
        content += '<table class="table table-hover" style="text-align:center;">';
        content += '<thead style="text-align:center;">';
        content += '<tr>';
        content += '<th>S.No</th>';
        content += '<th>Requisition Id</th>';
        content += '<th>Product Name</th>';
        content += '<th>Ordered Quantity</th>';
        content += '<th>Received Quantity</th>';
        content += '<th>Balance Quantity</th>';
        content += '<th>Requisition By</th>';
        content += '<th>Reference Type</th>';
        content += '<th>Ordered By</th>';
        content += '<th>Ordered Date</th>';     
        content += '<th>Action</th>';
        content += '<th>Receipt</th>';
        content += '</tr></thead>';
        if (resp.length >= 1) {
            for (var i = 0; i < resp.length; i++) {
                if (resp[i].Quantity > resp[i].Received_Quantity) {
                    sno++;
                    var pending_Quantity = resp[i].Quantity - resp[i].Received_Quantity;
                    content += '<tr>';
                    content += '<td>' + sno + '</td>';
                    content += '<td>' + resp[i].Requisition_Id + '</td>';
                    content += '<td>' + resp[i].Product_Name + '</td>';
                    content += '<td>' + resp[i].Quantity + '</td>';
                    content += '<td>' + resp[i].Received_Quantity + '</td>';
                    content += '<td>' + pending_Quantity + '</td>';
                    content += '<td>' + resp[i].Requisition_By + '</td>';
                    if (resp[i].Campaign_Name == null) {
                        content += '<td style="text-align:center;word-wrap: break-word;white-space: normal;word-break: break-word;width: 25%;">General</td>';
                    } else {
                        content += '<td style="text-align:center;word-wrap: break-word;white-space: normal;word-break: break-word;width: 25%;">' + resp[i].Campaign_Name + '</td>';
                    }                   
                    content += '<td>' + resp[i].User_Name + '</td>';
                    content += '<td>' + resp[i].Ordered_On + '</td>';
                    content += '<td style="cursor: pointer;text-decoration: underline;color: blue; text-align:center" Onclick="PlaceOrder.fnViewOrderedItem(\'' + resp[i].Order_Id + '\');">View</td>';
                    content += '<td style="cursor: pointer;text-decoration: underline;color: blue; text-align:center" Onclick="PlaceOrder.fnPlaceReciept(\'' + resp[i].Order_Id + '\');">Receipt</td>';
                    content += '</tr>';
                }
            }
        }
        else {
            //content = ''
            content += "<tr style='font-style:italic;text-align:center;'><td colspan='10'>No Placed Order(s) Available.</td></tr>";
                //<div class='col-lg-12 form-group' style='font-style:italic;'>No Placed Order(s) Available.</div>";
        }
        content += '</tbody></table>';
        $('#tblPOlist').html(content);
    },
    fnViewOrderedItem:function(Order_id){
        debugger;
        var disjson = '';
        if (Order_id != '' && Order_id != undefined) {
            disjson = jsonPath(PlaceOrderList, "$.[?(@.Order_Id=='" + Order_id + "')]");
        }
        $('#RECItemName').html(disjson[0].Product_Name);
        $('#ordrdon').html(disjson[0].Ordered_On);
        $('#vndrname').html(disjson[0].Vendor_Name);
        $('#qtity').html(disjson[0].Quantity);
        $('#ordtotQtity').html(disjson[0].Quantity);
        $('#RECvdqtity').html(disjson[0].Received_Quantity);
        var pending_Quantity = disjson[0].Quantity - disjson[0].Received_Quantity;
        $('#BalrecQtity').html(pending_Quantity);
        if (disjson[0].Remarks != null) {
            $('#rmrks').html(disjson[0].Remarks);
        } else {
            $('#rmrks').html('');
        }
       
       //$('')
        $("#dvRecOverLay").overlay().load();
    },

    fnPlaceReciept: function (Order_Id) {
        debugger;
        OrderId = Order_Id;
        var disjson = '';
        if (OrderId != "" && OrderId != undefined) {
            disjson = jsonPath(PlaceOrderList, "$.[?(@.Order_Id==" + OrderId + ")]");
        }
        if (disjson.length >= 1) {
            $('#RItemname').html(disjson[0].Product_Name);
            $('#pototQtity').html(disjson[0].Quantity);
            $('#recvdqtity').html(disjson[0].Received_Quantity);
            var pending_Quantity = disjson[0].Quantity - disjson[0].Received_Quantity;
            $('#BalpoQtity').html(pending_Quantity);
            $('#IvoceOn').datepicker('destroy');
            PlaceOrder.fnGetDateBAsedonorderDate(disjson[0].Ordered_On);
            $('#main').block();
            $("#dvReceiptOverLay").overlay().load();
        }

    },

    fnGetDateBAsedonorderDate:function(OrdDte){
        debugger;
        if(OrdDte!="" && OrdDte!=undefined){
            OrdDte = OrdDte.split('/')[2] + '/' + OrdDte.split('/')[1] + '/' + OrdDte.split('/')[0];
        }
        $(function () {
            $('#IvoceOn').datepicker({
                dateFormat: 'dd/mm/yy',
                numberOfMonths: 1,
                maxDate: 0,
                changeMonth: true,
                changeYear: true,
                minDate:new Date(OrdDte)
            });
        });

    },
    //fnValidateNumber: function (Id, evt) {

    //    if (evt.keyCode == 69 || evt.keyCode == 16 || evt.keyCode == 101) {
    //        return false;
    //    }
    //    else if (evt.keyCode == 46) {
    //        return false;
    //    }
    //    else {
    //        if ($('#' + Id.id).val() != '') {
    //            if ($('#' + Id.id).val().length >= 3) {
    //                return false;
    //            }
    //        }
    //    }
    //},
    fnValidateNumberQty: function (Id, evt) {

        if (evt.keyCode == 69 || evt.keyCode == 16 || evt.keyCode == 101) {
            return false;
        }
        else if (evt.keyCode == 46 || evt.keyCode == 45 || evt.keyCode == 43|| evt.shiftKey==true || evt.keyCode==187 || evt.keyCode==189) {
            return false;
        }
        else {
            if ($('#' + Id.id).val() != '') {
                if ($('#' + Id.id).val().length >= 5) {
                    return false;
                }
            }
        }
    },
  
    fnSaveReceipt: function () {
        debugger;
        var result = PlaceOrder.fnValidateReceipt();
        if (result == true) {
            $.blockUI();
            $('#dvReceiptOverLay').block();
            var Invoice_Num = $('#InvoceNum').val();
            var Invoice_dte = $('#IvoceOn').val();
            var remarks = $('#Rremarks').val();
            var qty = $('#RQntity').val();
            if (Invoice_dte != "") {
                Invoice_dte = Invoice_dte.split('/')[2] + '/' + Invoice_dte.split('/')[1] + '/' + Invoice_dte.split('/')[0];
            }
            var ObjReceipt = {
                Invoice_Number: Invoice_Num,
                Invoice_Date: Invoice_dte,
                Remarks: remarks,
                Quantity: qty,
                Order_Id: OrderId
            };
            $.ajax({
                type: "POST",
                url: "../HiDoctor_Master/PurchaseRequisition/InsertReceiptDetails",
                data: JSON.stringify({ "objReceipt": ObjReceipt }),
                contentType: 'application/json; charset=utf-8',
                success: function (resp) {
                    if (resp = "True") {
                        $.unblockUI();
                        $('#dvReceiptOverLay').unblock();
                        $("#dvReceiptOverLay").overlay().close();
                        PlaceOrder.fnClearReceiptForm();
                        PlaceOrder.fnGetAllPlaceOrdersForms();
                        PlaceOrder.fnGetAllInvoices();
                        fnMsgAlert('info', 'Place Order', 'Successfully saved Receipt.');
                        return false;
                    }
                    else {
                        $.unblockUI();
                        $('#dvReceiptOverLay').unblock();
                        $("#dvReceiptOverLay").overlay().close();
                        PlaceOrder.fnClearReceiptForm();
                        PlaceOrder.fnGetAllPlaceOrdersForms();
                        PlaceOrder.fnGetAllInvoices();
                        fnMsgAlert('info', 'Place Order', 'Failed to save Receipt.');
                        return false;
                    }
                }
            });
        }
    },
    fnClearReceiptForm: function () {
        debugger;
        $('#RQntity').val('');
        $('#Rremarks').val('');
        $('#InvoceNum').val('');
        $('#IvoceOn').val('');
        $('#main').unblock();
    },
    fnValidateReceipt:function(){
        debugger;
        var flag = true;
        var condt = false;
        if ($('#IvoceOn').val() == '') {
            fnMsgAlert('info', 'Place Order', 'Please Enter Invoice Date.');
            flag = false;
            return;
        }
        if( $('#InvoceNum').val()==""){
            fnMsgAlert('info','Place Order','Please Enter Invoice Number.');
            flag=false;
            return;
        }
        if ($('#InvoceNum').val() != "") {
            var result = PlaceOrder.fnValidateRemarks($('#InvoceNum').val());
            if (result == false) {
                fnMsgAlert('info', 'Place Order', 'Only (a-z A-Z 0-9 (){}[]@\/.,-_:;!?) special characters are allowed in Invoice Number.');
                flag = false;
                return;
            }
        }
        if ($('#RQntity').val() == '') {
            fnMsgAlert('info', 'Place Order', 'Please Enter Quantity.');
            flag = false;
            return;
        }
        if ($('#RQntity').val() == 0) {
            fnMsgAlert('info', 'Place Order', 'Please Enter Quantity other than Zero(0).');
            flag = false;
            return;
        }
        if ($('#InvoceNum').val() != "") {
            for (var i = 0; i <Invoices_List.length; i++) {
                if (Invoices_List[i].Invoice_Number.toUpperCase() == $('#InvoceNum').val().toUpperCase()) {
                    condt = true;
                }
            }
        }
        if (condt == true) {
            fnMsgAlert('info', 'Place Order', 'Please Enter different Invoice Number.System already contains the "' + $('#InvoceNum').val() + '" Invoice number entered.');
            flag = false;
            return;
        }

        if (OrderId != undefined && OrderId != "") {
            var disjson = jsonPath(PlaceOrderList, "$.[?(@.Order_Id=='" + OrderId + "')]");
            if (disjson.length >= 1 && $('#RQntity').val() != '') {
                var Bal_Quantity = disjson[0].Quantity - disjson[0].Received_Quantity;
                if ($('#RQntity').val() > Bal_Quantity) {
                    fnMsgAlert('info', 'Place Order', 'Receipt Quantity cannot exceed the Balance Quantity.');
                    flag = false;
                    return;
                }
            }
        }
        if ($('#Rremarks').val() != '') {
            var result = PlaceOrder.fnValidateRemarks($('#Rremarks').val());
            if (result == false) {
                fnMsgAlert('info', 'Place Order', 'Only (a-z A-Z 0-9 (){}[]@\/.,-_:;!?) special characters are allowed in Remarks.');
                flag = false;
                return;
            }
           
        }
        return flag;
    },
    fnValidateRemarks: function (value) {
        var specialCharregex = new RegExp(/[*&%$^#<>+=~`""|]/g);
        if (specialCharregex.test(value) == true) {
            return false;
        }
        else {
            return true;
        }
    },
    fnGetAllInvoices: function () {
        debugger;
        $.ajax({
            type: "GET",
            url: "../HiDoctor_Master/PurchaseRequisition/GetAllInvoices",
            data: "",
            success: function (resp) {
                Invoices_List = resp;
            }
        });
    },
}