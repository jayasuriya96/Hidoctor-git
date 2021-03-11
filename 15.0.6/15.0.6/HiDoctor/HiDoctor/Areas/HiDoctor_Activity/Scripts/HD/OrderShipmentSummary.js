var globaldata = "", globaldoc = "";
var OrderShipmentSummary = {
    init: function () {
        var param = "Region_Code=" + RegionCode + "&subDomainName=" + subDomainName + "&CompanyCode=" + CompanyCode;
        Ajax.requestInvoke("OrderFulfillment", "GetAllRegionName", param, "GET", OrderShipmentSummary.fnRegionSucessCallBack, OrderShipmentSummary.fnRegionErrorCallBack, '', '');
    },
    fnRegionSucessCallBack: function (response) {
        debugger;
        $('#regions').html('');
        $('#regions').html('<input class="form-control" type"text" tabindex="1" id="region" />');
        //regionDownListObj.appendTo('#region');
        var indexDet = 0;

        var indexDet = 0;
        if (response != null && response.length > 0) {
            var lstRegions = [];
            for (var i = 0; i < response.length; i++) {
                if (i == 0) {
                    indexDet = 0;
                    var regioncode = response[0].Region_Code;
                    $('#region').val(response[0].Region_Name)
                }

                var _obj = {
                    label: response[i].Region_Name,
                    id: response[i].Region_Code,
                    index: i

                }
                lstRegions.push(_obj)
            }
            var atcObj = new ej.dropdowns.DropDownList({
                //set the data to dataSource property
                dataSource: lstRegions,
                fields: { text: 'label', value: 'id' },
                filterBarPlaceholder: 'Search',
                showClearButton: true,
                allowFiltering: true,
                placeholder: 'Select a Region',
                index: indexDet,
                filtering: function (e) {
                    var dropdown_query = new ej.data.Query();
                    dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                    e.updateData(lstRegions, dropdown_query);
                },
                change: OrderShipmentSummary.fnddRegionOnChange

            });
            atcObj.appendTo('#region');
            atcObj.id = response[0].Region_Code;

        }
            OrderShipmentSummary.fnddRegionOnChange();
    },
    fnRegionErrorCallBack: function () {

    },
    fnddRegionOnChange: function () {
        debugger;
        //var param = "Region_Code=" + $('#region').val() + "&subDomainName=" + subDomainName;
        //Ajax.requestInvoke("Batch", "GetAllRegionName", param, "GET", OrderShipmentSummary.fnDoctorSucessCallBack, OrderShipmentSummary.fnDoctorErrorCallBack, '', '');

        var param = "Region_Code=" + $('#region_hidden').val() + "&subDomainName=" + subDomainName;
        Ajax.requestInvoke("OrderFulfillment", "GetOrderShipmentSummary", param, "GET", OrderShipmentSummary.fnOrderSummarySuccessCallBack, OrderShipmentSummary.fnOrderSummaryErrorCallBack, '', '');
    },
    fnDoctorSucessCallBack: function (response) {
        if (response != null && response.length > 0) {
            globaldoc = response;
        }
    },
    fnDoctorErrorCallBack: function () {
    },
    fnOrderSummarySuccessCallBack: function (response) {
        debugger;
        var content = "";

        if (response.lstOrder != null && response.lstOrder.length > 0) {
            $("#alert").hide();
            globaldata = response;
            var lstHeader = response.lstOrder;
            var lstDetails = response.lstDetails;
            var lstCancel = response.lstCancel;

            for (var i = 0; i < lstHeader.length; i++) {

                content += '<div class="card border-info mb-6">';
                content += '<div class="card-header" style="font-size :16px; font-weight: 600;">';
                content += '<span>Order No : ' + lstHeader[i].Order_Number + '</span>';
                content += '</div>';
                content += '<div class="card-body p-4">';
                content += '<div class="form-group row mb-1">';
                content += '<label for="staticEmail" class="col-sm-4 col-4 col-form-label pl-1">Delivery By</label>';
                content += '<label for="staticEmail" class="col-sm-8 col-8 col-form-label pl-1">' + lstHeader[i].Stokiest_Name + ' </label>';
                content += '</div>';
                content += '<div class="form-group row mb-1">';
                content += '<label for="staticEmail" class="col-sm-4 col-4 col-form-label pl-1">Delivery To</label>';
                content += '<label for="staticEmail" class="col-sm-8 col-8 col-form-label pl-1">' + lstHeader[i].Customer_Name + '</label>';
                content += '</div>';
                content += '<div class="form-group row mb-1">';
                content += '<label for="staticEmail" class="col-sm-4 col-4 col-form-label pl-1">Status</label>';
                content += '<label for="staticEmail" class="col-sm-8 col-8 col-form-label pl-1">';
                var lststatus = $.grep(lstDetails, function (v) {
                    return v.Order_Id == lstHeader[i].Order_Id;
                });
                var Cancel = $.grep(lstCancel, function (v) {
                    return v.Order_Id == lstHeader[i].Order_Id;
                });
                if (Cancel.length > 0) {
                    content += '<span class="badge badge-secondary p-1">Canceled</span>';
                }
                else {
                    if (lststatus.length > 0) {
                        if (lststatus[0].Balance_Qty == 0) {
                            content += '<span class="badge badge-success p-1">Completed</span>';
                        }
                        else {
                           
                            //lststatus[0].Cancelled_Qty
                            if (lststatus[0].Dispatch_Qty > 0 && lststatus[0].Cancelled_Qty == 0)
                            {
                                content += '<span class="badge badge-info p-1">Partial Dispatch</span>';
                            }
                            else if (lststatus[0].Dispatch_Qty == 0 && lststatus[0].Cancelled_Qty > 0)
                            {
                                content += '<span class="badge badge-info p-1">Partial Cancelled</span>';
                            }
                            else if (lststatus[0].Dispatch_Qty > 0 && lststatus[0].Cancelled_Qty > 0) {
                                content += '<span class="badge badge-info p-1">Partial Dispatch / Cancelled</span>';
                            }
                            else {
                                content += '<span class="badge badge-info p-1">In Progress</span>';
                            }
                            
                        }
                    }
                    else {
                        content += '<span class="badge badge-warning p-1">Yet to Start</span>';
                    }
                }
                // Yet to Start.
                //if (lstDetails[i].Status_Code == 0) {
                //    content += '<span class="badge badge-warning p-1">' + lstDetails[i].Status_Name + '</span>';
                //}
                //     Inprogress.
                //else if (lstDetails[i].Status_Code == 1) {
                //    content += '<span class="badge badge-primary p-1">' + lstDetails[i].Status_Name + '</span>';
                //}
                //     Completed.
                //else if (lstDetails[i].Status_Code == 2) {
                //    content += '<span class="badge badge-success p-1">' + lstDetails[i].Status_Name + '</span>';
                //}
                //     Cancel
                //else if (lstDetails[i].Status_Code == 3) {
                //    content += '<span class="badge badge-secondary p-1">' + lstDetails[i].Status_Name + '</span>';
                //}
                //     Partial Completed.
                //else {
                //    content += '<span class="badge badge-info p-1">0</span>';
                //}

                content += '</label>';
                content += '</div>';

                //content += '<div class="form-group row mb-1">';
                //content += '<label for="staticEmail" class="col-sm-4 col-4 col-form-label pl-1">Over All Status</label>';
                //content += '<label for="staticEmail" class="col-sm-8 col-8 col-form-label pl-1">0</label>';
                //content += '</div>';

                content += '</div>';


                /// Dispatch ///////


                content += '<div class="card-footer">';
                content += '<p>Dispatch Status</p>';
                content += '<div class="progress">';
                if (lststatus.length > 0) {
                    if (lststatus[0].Product_Qty > 0) {
                        content += '<div class="progress-bar progress-bar-striped" role="progressbar" style="width: ' + ((lststatus[0].Dispatch_Qty + lststatus[0].Cancelled_Qty) / lststatus[0].Product_Qty) * 100 + '%" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100">' + Math.round(((lststatus[0].Dispatch_Qty + lststatus[0].Cancelled_Qty) / lststatus[0].Product_Qty) * 100) + ' % </div>';
                    }
                    else {
                        content += '<div class="progress-bar progress-bar-striped" role="progressbar" style="width: 0%" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100">0.00 %</div>';
                    }
                }
                else {
                    content += '<div class="progress-bar progress-bar-striped" role="progressbar" style="width: 0%" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100">0.00 %</div>';
                }

                content += '</div>';

                content += '<div class="mt-1 text-right">';
                content += '<a href="#" class="card-link" onclick="OrderShipmentSummary.fnShowMore(' + lstHeader[i].Order_Id + ',' + lstHeader[i].Order_Number + ');">Show More</a>';
                content += '</div>';
                content += '</div>';
                content += '</div> ';
            }
            $("#shipmentOrderSummary").html(content);
        }
        else {
            $("#shipmentOrderSummary").html("");
            $("#alert").show();
        }
    },
    //Common Function .

    fnUniqueData: function (arr) {
        var res = arr.reduce(function (item, e1) {
            var matches = item.filter(function (e2)
            { return e1 == e2 });
            if (matches.length == 0) {
                item.push(e1);
            }
            return item;
        }, []);
        return res;
    },
    fnOrderSummaryErrorCallBack: function () {

    },
    fnShowMore: function (orderId, Order_Number) {
        var param = "Order_Id=" + orderId + "&subDomainName=" + subDomainName;
        Ajax.requestInvoke("OrderFulfillment", "GetSummaryDetails", param, "GET", OrderShipmentSummary.fnShowMoresucessCallBack, OrderShipmentSummary.fnShowMoreErrorCallBack, Order_Number, '');
    },
    fnShowMoresucessCallBack: function (response, Order_Number) {
        debugger;
        var product = response.lstProduct;
        var header = response.lstHeader;
        var details = response.lstDetails;
        var cancel = response.lstCancel;

        $("#DetailsModal").modal('show');
        //$(".modal-title").html("Order No : " + orderId);
        //var invoiceNo = OrderShipmentSummary.fnUniqueData(globaldata.lstProduct.map(a=>a.Invoice_No));
        $(".modal-body").html('');
        var content = "";

        if (product != null && product.length > 0) {
            content += '<h6>Order No: ' + Order_Number + '</h6>';
            content += '<h6>Order Details</h6>';
            content += '<table class="table table-bordered text-center">';
            content += '<thead>';
            content += '<tr style="background: #17a2b8;color: #fff;">';
            content += '<th>Product Name</th>';
            content += '<th>Product Quantity</th>';
            content += '<th>Dispatch Quantity</th>';
            content += '<th>Cancelled Quantity</th>';
            content += '<th>Balance Quantity</th>';
            content += ' </tr>';
            content += '</thead>';
            content += '<tbody id="idInvoice">';
            for (var j = 0; j < product.length; j++) {
                content += '<tr>';
                content += '<td>' + product[j].Product_Name + '</td>';
                content += '<td>' + product[j].Product_Qty + '</td>';
                content += '<td>' + product[j].Dispatch_Qty + '</td>';
                content += '<td>' + product[j].Cancelled_Qty + '</td>';
                content += '<td>' + product[j].Balance_Qty + '</td>';
                content += '</tr>';
            }
            content += '</tbody>';
            content += '</table>';
        }

        if (header != null && header.length > 0) {

            for (var i = 0; i < header.length; i++) {

                content += '<div class="card border-info mb-2">';
                content += '<div class="card-header" style="font-size:14px; font-weight:600;background: #17a2b8;color: #fff;" id="toggle">';
                content += '<span>Invoice No : ' + header[i].Invoice_No + '</span>';
                content += '<div class="form-check float-right">';
                content += '<span id="toggle">';
                content += '<i class="fa fa-plus" aria-hidden="true"></i>';
                content += '</span>';
                content += '</div>';
                content += '</div>';
                content += '<div class="card-body p-2" style="display:none">';
                content += '<div class="container-fluid p-0">';


                content += '<table class="table table-bordered text-center">';
                content += '<thead>';
                content += '<tr style="background: #0070ba;color: #fff;">';
                content += '<th>Invoice Date</th>';
                content += '<th>Dispatch Date</th>';
                content += '<th>Acknowledge Date</th>';
                content += '<th>Attachment</th>';
                content += ' </tr>';
                content += '</thead>';
                content += '<tbody id="idInvoice">';
                content += '<tr>';
                content += '<td>' + header[i].Invoice_Date + '</td>';
                content += '<td>' + header[i].Dispatch_Date + '</td>';
                content += '<td>' + header[i].Acknowledge_Date + '</td>';
                if (header[i].Attachement == null || header[i].Attachement == "") {
                    content += '<td>-</td>';
                }
                else {
                    content += '<td><a href="' + header[i].Attachement + '" download><i class="fa fa-download" aria-hidden="true" ></i></a></td>';
                }
                content += '</tr>';
                content += '</tbody>';
                content += '</table>';

                content += '<table class="table table-bordered text-center">';
                content += '<thead>';
                content += '<tr style="background: #0070ba;color: #fff;">';
                content += '<th>Product Name</th>';

                content += '<th>Dispatch Qty</th>';
                content += '<th>Rate</th>';
                //content += '<th>Balance Qty</th>';
                content += ' </tr>';
                content += '</thead>';
                content += '<tbody id="idInvoice">';
                var productdetails = $.grep(details, function (v) {
                    return v.Dispatch_Id == header[i].Dispatch_Id;
                });
                for (var j = 0; j < productdetails.length; j++) {
                    content += '<tr>';
                    content += '<td>' + productdetails[j].Product_Name + '</td>';
                    content += '<td>' + productdetails[j].Dispatch_Quantity + '</td>';
                    content += '<td>' + productdetails[j].Rate + '</td>';
                    //content += '<td>' + (lstProd[j].Total_Qty - lstProd[j].Dispatch_Qty) + '</td>';
                    content += '</tr>';
                }
                content += '</tbody>';
                content += '</table>';

                content += '</div>';
                content += '</div>';
                content += '</div>';

            }
        }

        if (cancel != null && cancel.length > 0) {
            content += '<h6>Cancel Products</h6>';
            content += '<table class="table table-bordered text-center">';
            content += '<thead>';
            content += '<tr style="background: #17a2b8;color: #fff;">';
            content += '<th>Product Name</th>';
            content += '<th>Cancel Qty</th>';
            content += '<th>Remarks</th>';
            content += '<th>Canceled By</th>';
            content += '<th>Canceled Date</th>';
            content += ' </tr>';
            content += '</thead>';
            content += '<tbody id="idInvoice">';
            for (var j = 0; j < cancel.length; j++) {
                content += '<tr>';
                content += '<td>' + cancel[j].Product_Name + '</td>';
                content += '<td>' + cancel[j].Cancel_Qty + '</td>';
                content += '<td>' + cancel[j].Remarks + '</td>';
                content += '<td>' + cancel[j].Created_by + '</td>';
                content += '<td>' + cancel[j].Created_date + '</td>';
                content += '</tr>';
            }
            content += '</tbody>';
            content += '</table>';
        }
        if (content == "")
        {
            $(".modal-body").html('No Record Found');
        }
        else {
            $(".modal-body").html(content);
        }
      
        var trigger = $(".modal-body #toggle");

        trigger.click(function () {
            debugger;
            var dd = $(this).parent().find('.card-body').css("display");
            if (dd == "block") {
                $(this).parent().find('.card-body').slideUp().delay(200);
                $(this).find('div span').html('<i class="fa fa-plus" aria-hidden="true"></i>');
                //$(this).html('<i class="fa fa-plus" aria-hidden="true"></i>');
                $(this).parent().find('.card-body').css("display", "none");
            }
            else {
                $(this).parent().find('.card-body').slideDown().delay(200);
                $(this).find('div span').html('<i class="fa fa-minus" aria-hidden="true"></i>');
                //$(this).html('<i class="fa fa-minus" aria-hidden="true"></i>');
                $(this).parent().find('.card-body').css("display", "block");
            }
        });
    },
    fnShowMoreErrorCallBack: function (response) {

    },
}
