
var globalorderlist = "", globalcancelProdLst = "";
var globstockiest = "", globaldetails = ""; var stockiestcontent = ''; var map = 0;
var OrderMaintain = {
    OrderId: "",
    init: function () {

        var param = "Region_Code=" + RegionCode + "&subDomainName=" + subDomainName + "&CompanyCode=" + CompanyCode;
        Ajax.requestInvoke("OrderFulfillment", "GetAllRegionName", param, "GET", OrderMaintain.fnRegionSucessCallBack, OrderMaintain.fnRegionErrorCallBack, '', '');
    },
    fnRegionSucessCallBack: function (response) {
        debugger;
        //var regionDownListObj = new ej.dropdowns.DropDownList({
        //    placeholder: 'Select a Region Name',
        //    filterBarPlaceholder: 'Search',
        //    dataSource: response,
        //    fields: { text: 'Region_Name', value: 'Region_Code' },
        //    popupHeight: '250px',
        //    change: OrderMaintain.fnddRegionOnChange,
        //    allowFiltering: true,
        //    filtering: function (e) {
        //        var dropdown_query = new ej.data.Query();
        //        dropdown_query = (e.text !== '') ? dropdown_query.where('Region_Name', 'contains', e.text, true) : dropdown_query;
        //        e.updateData(response, dropdown_query);
        //    }
        //});
        $('#regions').html('');
        $('#regions').html('<input class="form-control" type"text" tabindex="1" id="region" />');
        //regionDownListObj.appendTo('#region');
      

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
                change: OrderMaintain.fnddRegionOnChange

            });
            atcObj.appendTo('#region');
            atcObj.id = response[0].Region_Code;

        }
        OrderMaintain.fnddRegionOnChange();
    },
    fnRegionErrorCallBack: function () {

    },
    fnddRegionOnChange: function () {
        debugger;

        OrderMaintain.GetStockiest($("#region_hidden").val());
    },
    GetStockiest: function (region_code) {
        debugger;
        date = new Date();
        date = (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
        var param = "Region_Code=" + region_code + "&Order_Date=" + date + "&subDomainName=" + subDomainName + "&Entity=Stockiest";
        Ajax.requestInvoke("OrderFulfillment", "GetRegionWiseStockiest", param, "GET", OrderMaintain.fnListStockSucessCallBack, OrderMaintain.fnListStockErrorCallBack, '', '');
    },
    fnListStockSucessCallBack: function (response) {
        var content = "";
        stockiestcontent = response;
        OrderMaintain.fnGetOrderMaintenance($("#region_hidden").val());
    },
    fnListStockErrorCallBack: function () {

    },
    fnGetOrderMaintenance: function (regionCode) {
        debugger;
        var param = "Region_Code=" + regionCode + "&subDomainName=" + subDomainName;
        Ajax.requestInvoke("OrderFulfillment", "GetOrderMaintenance", param, "GET", OrderMaintain.fnOrderListSuccessCallBack, OrderMaintain.fnOrderListErrorCallBack, '', '');
    },
    fnOrderListSuccessCallBack: function (result) {
        debugger;
        var content = "";
        var response = result.lstOrder;
        var details = result.lstDetails;
        globaldetails = details;
        if (response != null && response.length > 0) {
            $("#alert").hide();
            $("#mOrderInputs").show();
            globalorderlist = response;
            for (var i = 0 ; i < response.length; i++) {
                content += '<div class="card border-info mb-6">';
                content += '<div class="card-header" style="font-size :16px; font-weight: 600;">';
                content += '<span> Order No : ' + response[i].Order_Number + '</span>';
                content += '<div class="form-check float-right">';
                //   content += '<input class="form-check-input" type="radio" name="exampleRadios" id="' + response[i].Order_Id + '" value="' + response[i].Order_Id + '" onclick=OrderMaintain.fnCheckBoxchange(' + response[i].Order_Id + ',"' + response[i].Stockiest_Code + '")>';
                content += '<input type="hidden" id="hdregion" value ="' + response[i].Region_Code + '">';
                content += '</div>';

                content += '</div>';
                content += '<div class="card-body p-4">';
                content += '<form>';
                content += '<div class="form-group row mb-1">';
                content += '<label for="staticEmail" class="col-sm-4 col-5 col-form-label pl-1">Customer Name </label>';
                content += '<label for="staticEmail" class="col-sm-8 col-7 col-form-label pl-1">' + response[i].Customer_Name + '</label>';
                content += '</div>';
                content += '<div class="form-group row mb-1">';
                content += '<label for="staticEmail" class="col-sm-4 col-5 col-form-label pl-1">Entity</label>';
                content += '<label for="staticEmail" class="col-sm-8 col-7 col-form-label pl-1">' + response[i].Customer_Entity_Type + '</label>';
                content += '</div>';
                content += '<div class="form-group row mb-1">';
                content += '<label for="staticEmail" class="col-sm-4 col-5 col-form-label pl-1">Order Date</label>';
                content += '<label for="staticEmail" class="col-sm-8 col-7 col-form-label pl-1">' + response[i].Order_Date + '</label>';
                content += '</div>';
                content += '<div class="form-group row mb-1">';
                content += '<label for="staticEmail" class="col-sm-4 col-5 col-form-label pl-1">Due Date</label>';
                content += '<label for="staticEmail" class="col-sm-8 col-7 col-form-label pl-1">' + response[i].Order_Due_Date + '</label>';
                content += '</div>';
                content += '<div class="form-group row mb-1">';
                content += '<label for="staticEmail" class="col-sm-4 col-5 col-form-label pl-1">Product</label>';
                content += '<label for="staticEmail" class="col-sm-8 col-7 col-form-label pl-1"><a href="#" onclick="OrderMaintain.fnProductDetails(' + response[i].Order_Id + ','+response[i].Order_Number+')">View</a></label>';
                content += '</div>';
                //content += '<div class="form-group row mb-1">';
                //content += '<label for="staticEmail" class="col-sm-4 col-5 col-form-label pl-1">Stockist Name</label>';
                //content += '<label for="staticEmail" class="col-sm-8 col-7 col-form-label pl-1"> ' + response[i].Stokiest_Name + '</label>';
                //content += '</div>';
                content += '<div class="form-group row mb-1">';
                content += '<label for="staticEmail" class="col-sm-4 col-5 col-form-label pl-1">POB Remarks</label>';
                content += '<label for="staticEmail" class="col-sm-8 col-7 col-form-label pl-1">' + response[i].Remarks + '</label>';
                content += '</div>';

                var lststatus = $.grep(details, function (v) {
                    return v.Order_Id == response[i].Order_Id;
                });
                var Dispatch_Qty = 0, Cancelled_Qty = 0;
                for (var j = 0; j < lststatus.length; j++) {
                    Dispatch_Qty = Dispatch_Qty + lststatus[j].Dispatch_Qty
                    Cancelled_Qty = Cancelled_Qty + lststatus[j].Cancelled_Qty
                }
                content += '<div class="form-group row mb-1">';
                content += '<label for="staticEmail" class="col-sm-4 col-5 col-form-label pl-1">Status</label>';
                content += '<div class="col-sm-8 col-7 col-form-label pl-1">';

                if (lststatus.length > 0) {
                    if (Dispatch_Qty > 0 && Cancelled_Qty == 0) {
                        content += '<span class="badge badge-info p-1">Partial Dispatch</span>';
                    }
                    else if (Dispatch_Qty == 0 && Cancelled_Qty > 0) {
                        content += '<span class="badge badge-info p-1">Partial Cancelled</span>';
                    }
                    else if (Dispatch_Qty > 0 && Cancelled_Qty > 0) {
                        content += '<span class="badge badge-info p-1">Partial Dispatch / Cancelled</span>';
                    }
                    else {
                        content += '<span class="badge badge-info p-1">In Progress</span>';
                    }
                }
                else {
                    content += '<span class="badge badge-warning p-1">Yet to Start</span>';
                }

                content += '</div></div>';


                content += '<div class="form-group row mb-1">';
                content += '<label for="staticEmail" class="col-sm-4 col-5 col-form-label pl-1">Stockist</label>';
                if (lststatus.length > 0) {
                    content += '<select class="form-control form-control-sm stockiest col-sm-8 col-7 col-form-label pl-1" id="ddStock_' + response[i].Order_Id + '" disabled="true">';
                }
                else {
                    content += '<select class="form-control form-control-sm stockiest col-sm-8 col-7 col-form-label pl-1" id="ddStock_' + response[i].Order_Id + '">';
                }
                content += '<option value="0">Select a stockiest</option>';
                for (var k = 0; k < stockiestcontent.length; k++) {
                    if (response[i].Stockiest_Code == stockiestcontent[k].Stockiest_Code) {

                        content += '<option value="' + stockiestcontent[k].Stockiest_Code + '" selected>' + stockiestcontent[k].Stockiest_Name + '</option>';
                    }
                    else {
                        content += '<option value="' + stockiestcontent[k].Stockiest_Code + '">' + stockiestcontent[k].Stockiest_Name + '</option>';
                    }
                }

                content += '</select>';
                content += '</div>';


                content += '<div class="form-group row mb-1">';
                content += '<label for="staticEmail" class="col-sm-4 col-5 col-form-label pl-1">Remarks</label>';
                content += '<textarea for="staticEmail" class="col-sm-8 col-7 col-form-label pl-1" id="remarks_' + response[i].Order_Id + '" rows="2"></textarea>';
                content += '</div>';

                //content += '<div class="form-group col-12">';
                //content += '<label for="inputStartDate">Remark</label>';
                //content += '<textarea class="form-control form-control-sm remark" id="remarks_' + response[i].Order_Id + '" rows="2"></textarea>';
                //content += '</div>';

                content += '<div class="text-sm-left">';
                if (lststatus.length > 0) {
                    content += '<button type="button" class="btn btn-outline-info btn-sm mr-2 acknow "  id="map" disabled>Acknowledge</button>';

                }
                else {
                    content += '<button type="button" class="btn btn-outline-info btn-sm mr-2 acknow" id="map_' + response[i].Order_Id + '"  onclick="OrderMaintain.fnAcknowledge(1,' + response[i].Order_Id + ',' + response[i].Stockiest_Code + ');">Acknowledge</button>';
                }

                content += ' <button type="button" class="btn btn-outline-info btn-sm" id="cancel_' + response[i].Order_Id + '"  onclick="OrderMaintain.fncancelorder(' + response[i].Order_Id + ');">Order Cancel</button>';
                content += '</div>';


                content += '</div>';
                content += '</form>';
                content += '</div>';
                // content += '<div class="card-footer text-right"><a href="#" onclick="OrderMaintain.fnShowMore(' + lineItem[0].Order_Id + ')">Show More</a></div>';
                content += '</div>';
                // content += $('#ddStocks_' + response[i].Order_Id + '').val(response[i].Stockiest_Code);

            }
            $("#orderLst").show();

            $('#stockiest').show();
            $("#orderLst").html(content);
            // $(".acknow").prop("disabled", false);
          //  $(".remark").attr("disabled", false);
            //$(".stockiest").attr("disabled", false);
            //var trigger = $("#orderLst input[name=exampleRadios]");
            //trigger.click(function () {
            //    OrderMaintain.fnCheckBoxchange($(this));
            //});
        }
        else {
            $("#mOrderInputs").hide();
            $("#alert").show();
            $("#orderLst").hide();
            $('#stockiest').hide();
        }
    },
    fnOrderListErrorCallBack: function () {

    },
    fnProductDetails: function (order_id,Order_Number) {
        var param = "Order_Id=" + order_id + "&subDomainName=" + subDomainName;
        Ajax.requestInvoke("OrderFulfillment", "GetProductDetails", param, "GET", OrderMaintain.fnProductListSuccessCallBack, OrderMaintain.fnProductListErrorCallBack, Order_Number, '');
    },

    fnProductListSuccessCallBack: function (respone, Order_Number) {
        var content = '';
        var totalamount = 0;
        content += '<h6>Order No: ' + Order_Number + '</h6>';
        content += '<table class="table table-bordered text-center">';
        content += '<thead style="color: #fff;background: #337ab7;">';
        content += '<tr>';
        content += '<th>Product Name</th>';
        content += '<th>Product Qty</th>';
        content += '<th>Product Unit Rate</th>';
        content += '<th>Product Amount</th>';
        content += '</tr>';
        content += '</thead>';
        content += '<tbody id="rowdata">';
        for (var i = 0; i < respone.length; i++) {
            content += '<tr>';
            content += '<td>' + respone[i].Product_Name + '</td>';
            content += '<td>' + respone[i].Product_Qty + '</td>';
            content += '<td>' + respone[i].Product_Unit_Rate + '</td>';
            content += '<td>' + respone[i].Product_Amount + '</td>';
            content += '</tr>';
            totalamount = totalamount + respone[i].Product_Amount;
        }
        content += '</tbody>';
        content += '</table>';
        content += '<label style="float: right;">Total Amount : ' + totalamount + '</label>'
        $('#modelbody').html('');
        $("#modelbody").html(content);
        $("#myModal").modal('show');
    },

    fncancelorder: function (Order_Id) {
        debugger;
        $("#cancel_" + Order_Id + "").prop("disabled", true);
        var Order_Id = Order_Id;
        //if (Order_Id == "") {
        //    swal('Please Select any Order !', "", "info");
        //    return false;
        //}
        var response = $.grep(globaldetails, function (v) {
            return v.Order_Id == Order_Id;
        });
        var content = '';
        var content1 = '';
        if (response.length > 0) {
            content += '<table class="table table-bordered text-center">';
            content += '<thead>';
            content += '<tr style="background: #17a2b8;color: #fff;">';
            content += '<th class="text-left">Product Name</th>';
            content += '<th>Total Qty</th>';
            content += '<th>Dispatch Qty</th>';
            content += '<th>Cancelled Qty</th>';
            content += '<th>Cancel Qty</th>';
            content += '<th>Remarks</th>';
            //content += '<th>Status</th>';
            content += '<th>Select</th>';
            content += '</tr>';
            content += '</thead>';
            content += '<tbody id="partialproduct">';
            for (var i = 0; i < response.length; i++) {
                content += '<tr id=' + response[i].Order_Id + '>';
                content += '<td class="text-left">' + response[i].Product_Name;
                //   content += '<input type ="hidden" value= "' + response[i].Product_Type + '" id="productType">';
                content += '</td>';
                content += '<td>' + response[i].Product_Qty + '</td>';
                content += '<td>' + response[i].Dispatch_Qty + '</td>';
                content += '<td>' + response[i].Cancelled_Qty + '</td>';
                content += '<td><input type="number" class="form-control form-control-sm" id="inputDiscount" min="1" max="100" value ="' + response[i].Balance_Qty + '"></td>';
                content += '<td><textarea class="form-control form-control-sm" id="remarks" rows="1" onpaste="return false;"></textarea></td>';
                //content += '<td><span class="badge badge-primary p-1">Active</span></td>';
                content += '<td>';
                content += '<input type="checkbox" class="form-check-input ml-0" id="exampleCheck1" value="' + response[i].Product_Code + '">  ';
                content += '</td>';
                content += '</tr>';
            }
            content += '</tbody>';
            content += '</table>';
            $('#modelbody1').html('');
            $("#modelbody1").html(content);
            $("#footer").html('<button type="button" class="btn  btn-outline-info btn-sm" onclick="OrderMaintain.fnProductCancel(' + Order_Id + ');">Product Cancel</button>');
            $("#myModalcancel").modal('show');
            $("#cancel_" + Order_Id + "").prop("disabled", false);
        }
        else {
            OrderMaintain.fnAcknowledge(2, Order_Id,0);
           
        }
    },
    fnAcknowledge: function (status, Order_Id, stockiest_code) {
        debugger;
        
        $("#map_" + Order_Id + "").prop("disabled", true);
        $("#cancel_" + Order_Id + "").prop("disabled", true);
        map = Order_Id;
       
        var remarks = $("#remarks_" + Order_Id + "").val();
        if ($("#ddStock_" + Order_Id + "").val() == 0)
        {
            swal('Please select Stockist Name', "", "info");
            $("#map_" + Order_Id + "").prop("disabled", false);
            $("#cancel_" + Order_Id + "").prop("disabled", false);

            return false;
        }
        var stockiest = $("#ddStock_" + Order_Id + "").val() == 'Select a stockiest' ? "" : $("#ddStock_" + Order_Id + "").val();
     
        if (status == 2) {
            if (remarks == '') {
                swal('Please Enter Remark', "", "info");
                $("#cancel_" + Order_Id + "").prop("disabled", false);
                $("#map_" + Order_Id + "").prop("disabled", false);
             
                return false;
            }
            if (remarks.length > 500) {
                swal('Remark Length less than 500', "", "info");
                $("#cancel_" + Order_Id + "").prop("disabled", false);
                $("#map_" + Order_Id + "").prop("disabled", false);

                return false;
            }

        }
        else {
            if (stockiest != stockiest_code) {
                if (remarks == '') {
                    swal('Please Enter Remark', "", "info");
                    $("#map_" + Order_Id + "").prop("disabled", false);
                    $("#cancel_" + Order_Id + "").prop("disabled", false);
                    return false;
                }

            }
        }
       
        var obj = new Object();

        var OrderRegion = $("#region_hidden").val();

        obj.Company_Id = Company_Id;
        obj.User_Code = UserCode;
        obj.Region_Code = RegionCode;
        obj.OrderRegion = OrderRegion;
        obj.Order_Id = Order_Id;
        obj.Stockiest_Code = stockiest;
        obj.Stockiest_Name = $("#ddStock_" + Order_Id + " option:selected").text() == "Select a stockiest" ? "" : $("#ddStock_" + Order_Id + " option:selected").text();
        obj.Remarks = remarks;
        obj.subDomainName = subDomainName;

        // 1 - In Progress ,2 - Complete, 3 - Cancel , 4 - Partialy Completed .
        if (status == 1) {
            obj.Status = 1;
        }
        else {
            obj.Status = 2;
        }

        var params = [];
        var p = {};
        p.name = "objData";
        p.value = obj;
        params.push(p);

        Ajax.requestInvoke("OrderFulfillment", "InsertMaintaningOrder", params, "POST", OrderMaintain.fnInsertSuccessCallBack, OrderMaintain.fnInsertErrorCallBack, status, 'JSON');
        $("#cancel_" + Order_Id + "").prop("disabled", false);
    },

    fnInsertSuccessCallBack: function (response, status) {
        if (response > 0) {
            if (status == 1) {
                swal({
                    title: 'Order Acknowledge Successfully ',
                    imageUrl: "https://lipis.github.io/bootstrap-sweetalert/assets/thumbs-up.jpg"
                });
            }
            else {
                swal({
                    title: 'Order Canceled Successfully',
                    imageUrl: "https://lipis.github.io/bootstrap-sweetalert/assets/thumbs-up.jpg"
                });
            }
            $(".remarks").val("");
            //$(".stockiest").val($(".stockiest option:first").val());
            //$('.card-columns input:checked').prop('checked', false);
         //   $("#map_" + map + "").prop("disabled", false);
           // $(".remarks").attr("disabled", false);
           // $(".stockiest").attr("disabled", false);
            OrderMaintain.fnGetOrderMaintenance($("#region_hidden").val());
        }
    },
    fnInsertErrorCallBack: function () {
        $("#map_" + map + "").prop("disabled", false);
        $("#cancel_" + map + "").prop("disabled", false);
    },
    //fnOrderMaintainSuccessCallBack: function (response) {
    //    debugger;
    //    var content = "";
    //    if (response != null && response.length > 0) {
    //        globalcancelProdLst = response;

    //        for (var i = 0; i < response.length; i++) {
    //            content += '<tr id=' + response[i].LineItem + '>';
    //            content += '<td class="text-left">' + response[i].Product_Name;
    //            content += '<input type ="hidden" value= "' + response[i].Product_Type + '" id="productType">';
    //            content += '</td>';
    //            var remaining = 0;
    //            if (response[i].Status == 0) {
    //                content += '<td>' + response[i].Total_Qty + '</td>';
    //                content += '<td>' + response[i].Dispatch_Qty + '</td>';
    //                content += '<td>' + response[i].CancelQty + '</td>';
    //                remaining = (response[i].Total_Qty - (response[i].Dispatch_Qty + response[i].CancelQty));
    //                content += '<td><input type="number" class="form-control form-control-sm" id="inputDiscount" min="1" max="100" value ="' + (remaining) + '"></td>';
    //                content += '<td><textarea class="form-control form-control-sm" id="remarks" rows="1" onpaste="return false;" value ="' + response[i].Remarks + '"></textarea></td>';
    //                content += '<td><span class="badge badge-primary p-1">Active</span></td>';
    //                content += '<td>';
    //                content += '<input type="checkbox" class="form-check-input ml-0" id="exampleCheck1" value="' + response[i].Product_Code + '">  ';
    //                content += '</td>';
    //            }
    //            else {
    //                content += '<td>' + response[i].Total_Qty + '</td>';
    //                content += '<td>' + response[i].Dispatch_Qty + '</td>';
    //                content += '<td>' + response[i].CancelQty + '</td>';
    //                remaining = (response[i].Total_Qty - (response[i].Dispatch_Qty + response[i].CancelQty));
    //                content += '<td><input type="number" class="form-control form-control-sm" id="inputDiscount" min="1" max="100" value ="' + (remaining) + '"></td>';
    //                content += '<td>' + response[i].Remarks + '</td>';
    //                content += '<td><span class="badge badge-secondary p-1">Closed</span></td>';
    //                content += '<td></td>';
    //            }
    //            content += '</tr>';
    //        }
    //        $("#partialproduct").html(content);
    //        $("#ProductModal .modal-title").html("Order Id : " + $("input[type=radio]:checked").val());
    //    }
    //},
    //fnOrderMaintainProductErrorCallBack: function () {

    //},
    fnCheckBoxchange: function (id, stockiest_code) {
        debugger;

        $('#ddStock').val(stockiest_code);
        globstockiest = stockiest_code;
        //  var a = $("#hd" + id.attr('id')).val();
        var lststatus = $.grep(globaldetails, function (v) {
            return v.Order_Id == id;
        });
        if (lststatus.length > 0) {
            $("#map").prop("disabled", true);
            $("#remarks").attr("disabled", true);
            $("#ddStock").attr("disabled", true);
        }
        else {
            $("#map").prop("disabled", false);
            $("#remarks").attr("disabled", false);
            $("#ddStock").attr("disabled", false);
        }
    },
    fnProductCancel: function (Order_Id) {
        debugger;
        var ProductCode = "";


        var arr = [];
        $("input[type=checkbox]:checked").map(function () {
            var obj = {
                Company_Id: Company_Id,
                Order_Id: Order_Id,
                Product_Code: $(this).val(),
                Cancel_Qty: $(this).parent().parent().find('input[type=number]').val(),
                Remarks: $(this).parent().parent().find('textarea').val(),
                UserCode: UserCode

            };
            arr.push(obj);
        });
        var Order_Id = $("input[type=radio]:checked").val();
        var obj = {
            Product: JSON.stringify(arr),
            subDomainName: subDomainName
        }
        if (arr.length > 0) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].Remarks == "") {
                    swal('Please Enter Remarks!', "", "info");
                    return false;
                }
            }
        }
        else {
            swal('Please Select Product !', "", "info");
            return false;
        }
        if (arr.length > 0) {
            for (var i = 0; i < arr.length; i++) {
                var lstobj = $.grep(globaldetails, function (v) {
                    return v.Product_Code == arr[i].Product_Code && v.Order_Id == Order_Id;
                });
                if (lstobj != null && lstobj.length > 0) {
                    if (lstobj[0].Balance_Qty < arr[i].Cancel_Qty) {
                        swal("Cancel Quantity Should not exceed the Balance Quantity", "", "info");
                        return false;
                    }
                }
            }
        }
        var params = [];
        var p = {};
        p.name = "objData";
        p.value = obj;
        params.push(p);


        Ajax.requestInvoke("OrderFulfillment", "UpdatePratialProduct", params, "POST", OrderMaintain.fnUpdateSuccessCallBack, OrderMaintain.fnUpdateErrorCallBack, null, 'JSON');

    },
    fnUpdateSuccessCallBack: function (response) {
        $("#ProductModal").modal('hide');
        if (response > 0) {
            swal({
                title: 'Successfully!!',
                imageUrl: "https://lipis.github.io/bootstrap-sweetalert/assets/thumbs-up.jpg"
            });
            $("#remarks").val("");
           // $("#ddStock").val($("#ddStock option:first").val());
          //  $('.card-columns input:checked').prop('checked', false);
            $('#myModalcancel').modal('hide');
            OrderMaintain.fnGetOrderMaintenance($("#region_hidden").val());

        }
    },
    fnUpdateErrorCallBack: function () {

    },
    fnShowMore: function (OrderId) {
        debugger;
        OrderMaintain.OrderId = OrderId;
        var action = Company_Id + '/' + OrderId;
        CoreRest.requestInvoke("OrderProcessingApi/GetMaintenanceOrderDetails", action, null, "GET", OrderMaintain.fnOrderDetailsSuccessCallBack, OrderMaintain.fnOrderDetailsErrorCallBack)
    },
    fnOrderDetailsErrorCallBack: function () {

    },
    //fnOrderDetailsSuccessCallBack: function (response) {
    //    debugger;
    //    $("#DetailsModal").modal('show');

    //    var lstLine = OrderMaintain.fnUniqueData(response.map(a=>a.Line_Item));

    //    var content = "";
    //    if (lstLine != null && lstLine.length > 0) {
    //        $(".modal-title").html("Order No : " + OrderMaintain.OrderId);
    //        for (var i = 0; i < lstLine.length; i++) {
    //            content += '<div class="card border-info mb-2">';
    //            content += '<div class="card-header" style="font-size:14px; font-weight:600;background: #17a2b8;color: #fff;" id="toggle">';
    //            content += '<span>Line Item : ' + lstLine[i] + '</span>';
    //            content += '<div class="form-check float-right">';
    //            content += '<span id="toggle">';
    //            content += '<i class="fa fa-plus" aria-hidden="true"></i>';
    //            content += '</span>';
    //            content += '</div>';
    //            content += '</div>';
    //            content += '<div class="card-body p-2" style="display:none">';
    //            content += '<div class="container-fluid p-0">';
    //            content += '<div id="tbl">';
    //            var lstProd = $.grep(response, function (v) {
    //                return v.Line_Item == lstLine[i];
    //            });

    //            if (lstProd != null && lstProd.length > 0) {
    //                content += '<h2>Products :</h2>';
    //                content += '<table class="table table-bordered text-center">';
    //                content += '<thead style="color: #fff;background: #337ab7;">';
    //                content += '<tr>';
    //                content += '<th>Name</th>';
    //                content += '<th>Type</th>';
    //                content += '<th>Total Qty</th>';
    //                content += '</tr>';
    //                content += '</thead>';
    //                content += '<tbody id="rowdata">';
    //                for (var j = 0; j < lstProd.length; j++) {
    //                    content += '<tr>';
    //                    content += '<td>' + lstProd[j].Product_Name + '</td>';
    //                    content += '<td>' + (lstProd[j].Product_Type == null ? '-' : lstProd[j].Product_Type) + '</td>';
    //                    content += '<td>' + lstProd[j].Total_Qty + '</td>';
    //                    content += '</tr>';
    //                }
    //                content += '</tbody>';
    //                content += '</table>';
    //            }

    //            content += '</div>';

    //            content += '</div>';
    //            content += '</div>';
    //            content += '</div>';
    //        }
    //    }
    //    $(".detail-modal-body").html(content);
    //    var trigger = $(".detail-modal-body #toggle");

    //    trigger.click(function () {
    //        debugger;
    //        var dd = $(this).parent().find('.card-body').css("display");
    //        if (dd == "block") {
    //            $(this).parent().find('.card-body').slideUp().delay(200);
    //            $(this).find('div span').html('<i class="fa fa-plus" aria-hidden="true"></i>');
    //            //$(this).html('<i class="fa fa-plus" aria-hidden="true"></i>');
    //            $(this).parent().find('.card-body').css("display", "none");
    //        }
    //        else {
    //            $(this).parent().find('.card-body').slideDown().delay(200);
    //            $(this).find('div span').html('<i class="fa fa-minus" aria-hidden="true"></i>');
    //            //$(this).html('<i class="fa fa-minus" aria-hidden="true"></i>');
    //            $(this).parent().find('.card-body').css("display", "block");
    //        }
    //    });
    //},
    ////Common Function .

    //fnUniqueData: function (arr) {
    //    var res = arr.reduce(function (item, e1) {
    //        var matches = item.filter(function (e2)
    //        { return e1 == e2 });
    //        if (matches.length == 0) {
    //            item.push(e1);
    //        }
    //        return item;
    //    }, []);
    //    return res;
    //},
}