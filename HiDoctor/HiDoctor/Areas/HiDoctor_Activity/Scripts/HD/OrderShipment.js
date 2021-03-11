
var globalOrderlst = "", globalProduct = "", rowId = 0, ShipmentDetails = "";

var OrderShipment = {

    init: function () {

        var param = "Region_Code=" + RegionCode + "&subDomainName=" + subDomainName + "&CompanyCode=" + CompanyCode;
        Ajax.requestInvoke("OrderFulfillment", "GetAllRegionName", param, "GET", OrderShipment.fnRegionSucessCallBack, OrderShipment.fnRegionErrorCallBack, '', '');

        
    },
    fnRegionSucessCallBack: function (response) {
        debugger;
        //var regionDownListObj = new ej.dropdowns.DropDownList({
        //    placeholder: 'Select a Region Name',
        //    filterBarPlaceholder: 'Search',
        //    dataSource: response,
        //    fields: { text: 'Region_Name', value: 'Region_Code' },
        //    popupHeight: '250px',
        //    change: OrderShipment.fnddRegionOnChange,
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
                change: OrderShipment.fnddRegionOnChange

            });
            atcObj.appendTo('#region');
            atcObj.id = response[0].Region_Code;

        }
       OrderShipment.fnddRegionOnChange();

    },
    fnRegionErrorCallBack: function () {

    },
    fnddRegionOnChange:function()
    {
        var param = "Region_Code=" + $("#region_hidden").val() + "&subDomainName=" + subDomainName;
        Ajax.requestInvoke("OrderFulfillment", "GetShipmentOrders", param, "GET", OrderShipment.fnOrderListSuccessCallBack, OrderShipment.fnOrderListErrorCallBack, '', '');

    },
    fnOrderListSuccessCallBack: function (result) {
        debugger;
        var content = "";
        var response = result.lstOrder;
        var details = result.lstDetails;
        if (response != null && response.length > 0) {
            $("#orderList").show();
            $("#divregion").show();
            $("#alert").hide();
          //  $("#label").show();
            globalOrderlst = response;
            //$("#orderCount").html(response.length);
            for (var i = 0; i < response.length; i++) {
                content += '<div class="card border-info mb-6">';
                content += '<div class="card-header" style="font-size :16px; font-weight: 600;">';
                content += '<span>Order No : ' + response[i].Order_Number + '</span>';
                //content += '<div class="form-check float-right">';
                //content += '<input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios2" value=" ' + response[i].Order_Id + ' ">';
                //content += '</div>';
                content += '</div>';
                content += '<div class="card-body p-4">';
                content += '<div class="form-group row mb-1">';
                content += '<label for="staticEmail" class="col-sm-5 col-6 col-form-label pl-1">Order Date</label>';
                content += '<label for="staticEmail" class="col-sm-7 col-6 col-form-label pl-1">' + response[i].Order_Date + ' </label>';
                content += '</div>';
                content += '<div class="form-group row mb-1">';
                content += '<label for="staticEmail" class="col-sm-5 col-6 col-form-label pl-1">Delivery To</label>';
                content += '<label for="staticEmail" class="col-sm-7 col-6 col-form-label pl-1">' + response[i].Customer_Name + ' </label>';
                content += '</div>';
                content += '<div class="form-group row mb-1">';
                content += '<label for="staticEmail" class="col-sm-5 col-6 col-form-label pl-1">Entity</label>';
                content += '<label for="staticEmail" class="col-sm-7 col-6 col-form-label pl-1">' + response[i].Customer_Entity_Type + ' </label>';
                content += '</div>';
                content += '<div class="form-group row mb-1">';
                content += '<label for="staticEmail" class="col-sm-5 col-6 col-form-label pl-1">Delivery By</label>';
                content += '<label for="staticEmail" class="col-sm-7 col-6 col-form-label pl-1">' + response[i].Stokiest_Name + ' </label>';
                content += '</div>';
                var lststatus = $.grep(details, function (v) {
                    return v.Order_Id == response[i].Order_Id;
                });
                var Dispatch_Qty = lststatus[0].Dispatch_Qty, Cancelled_Qty = lststatus[0].Cancelled_Qty, Balance_Qty = lststatus[0].Balance_Qty;
               
                content += '<div class="form-group row mb-1">';
                content += '<label for="staticEmail" class="col-sm-5 col-6 col-form-label pl-1">Status</label>';
                content += '<div class="col-sm-7 col-6 col-form-label pl-1">';

                if (lststatus.length > 0) {
                    if (Balance_Qty == 0)
                    {
                        content += '<span class="badge badge-info p-1">Completed</span>';
                    }
                    else if (Dispatch_Qty > 0 && Cancelled_Qty == 0 && Balance_Qty !=0) {
                        content += '<span class="badge badge-info p-1">Partial Dispatch</span>';
                    }
                    else if (Dispatch_Qty == 0 && Cancelled_Qty > 0 && Balance_Qty != 0) {
                        content += '<span class="badge badge-info p-1">Partial Cancelled</span>';
                    }
                    else if (Dispatch_Qty > 0 && Cancelled_Qty > 0 && Balance_Qty != 0) {
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

                content += '</div>';
              
                if (Balance_Qty == 0) {
                    content += '<div class="card-footer" style="padding: 6%;">';
                    content += '</div>';
                }
                else {
                    content += '<div class="card-footer">';
                    content += '<span class="badge badge-info p-2" style="cursor:pointer;" onclick="OrderShipment.fnDispatch(' + response[i].Order_Id + ')">Dispatch</span>'
                    content += '</div>';
                }
              

                content += '</div>';
            }
            $("#shipmentOrders").html(content);
        }
        else {
            $("#orderList").hide();
            $("#alert").show();
           // $("#label").hide();
        }
    },
    fnOrderListErrorCallBack: function () {

    },
    fnDispatch: function (Order_Id) {
        debugger;
        $("#orderId").val(Order_Id);
        $("#orderList").hide();
        $("#divregion").hide();
       // $("#label").html("Order Details");
        $('#details').show();
        $("#seconddiv").show();
    
        var param = "Order_Id=" + Order_Id + "&subDomainName=" + subDomainName;
        Ajax.requestInvoke("OrderFulfillment", "GetDispatchOrderDetails", param, "GET", OrderShipment.fnDispatchOrderDetialsSuccessCallBack, OrderShipment.fnDispatchOrderDetailsErrorCallBack, Order_Id, '');
    },
   
    fnDispatchOrderDetialsSuccessCallBack: function (response, Order_Id) {
        if (response != null && response.length > 0) {
            globalProduct = response;
            var SDownListObj = new ej.dropdowns.DropDownList({
                placeholder: 'Select a Product Name',
                filterBarPlaceholder: 'Search',
                dataSource: globalProduct,
                fields: { text: 'Product_Name', value: 'Product_Code' },
                popupHeight: '250px',
                allowFiltering: true,
                filtering: function (e) {
                    var dropdown_query = new ej.data.Query();
                    dropdown_query = (e.text !== '') ? dropdown_query.where('Product_Name', 'contains', e.text, true) : dropdown_query;
                    e.updateData(globalProduct, dropdown_query);
                }
            });
            $('#Products_0').html('');
            $('#Products_0').html('<input class="form-control" type"text" tabindex="1" id="Product_0" />');
            SDownListObj.appendTo('#Product_0');
           
        }
        var content = "";
        if (response != null && response.length > 0) {
            ShipmentDetails = response;
            var Orderlst = $.grep(globalOrderlst, function (v) {
                return v.Order_Id == Order_Id;
            });
            $("#invoiceDate").datepicker(
                {
                    dateFormat: 'dd-mm-yy',
                    minDate: new Date(OrderShipment.fnConvertDateFormat(Orderlst[0].Order_Date, 1))
                });
            $("#dispatchDate").datepicker(
              {
                  dateFormat: 'dd-mm-yy',
                  minDate: new Date(OrderShipment.fnConvertDateFormat(Orderlst[0].Order_Date, 1))
              });
            $("#ackDate").datepicker(
              {
                  dateFormat: 'dd-mm-yy',
                  minDate: new Date(OrderShipment.fnConvertDateFormat(Orderlst[0].Order_Date, 1))
              });

            

            content += ' <div class="d-flex flex-wrap bd-highlight bg-info text-white">';
            content += '<div class="p-2 flex-fill bd-highlight"><span style="font-size:14px;font-weight:500;">Order No : </span> ' + Orderlst[0].Order_Number + '</div>';
            content += '<div class="p-2 flex-fill bd-highlight"><span style="font-size:14px;font-weight:500;">Stockiest Name : </span> ' + Orderlst[0].Stokiest_Name + '</div>';
            content += '<div class="p-2 flex-fill bd-highlight"><span style="font-size:14px;font-weight:500;">Delivery To : </span> ' + Orderlst[0].Customer_Name + ' </div>';
            content += '<div class="p-2 flex-fill bd-highlight"><span style="font-size:14px;font-weight:500;">Entity : </span> ' + Orderlst[0].Customer_Entity_Type + '</div>';
            content += '</div>';

            content += ' <table class="table table-bordered table-responsive-sm table-responsive-md mt-1">';
            content += '<thead style="background:#428bca;color:#fff;">';
            content += '<tr>';
            content += '<th style="min-width:150px;">Product Name </th>';
            content += '<th>Total Qty</th>';
            content += '<th>Dispatch Qty</th>';
            content += '<th>Cancelled Qty</th>';
            content += '<th>Balance Qty</th>';
            content += '</tr>';
            content += '</thead>';
            content += '<tbody>';
            for (var i = 0; i < response.length; i++) {
                content += '<tr>';
                content += '<td>' + response[i].Product_Name + ' </td>';
                content += '<td>' + response[i].Product_Qty + ' </td>';
                content += '<td>' + response[i].Dispatch_Qty + ' </td>';
                content += '<td>' + response[i].Cancelled_Qty + ' </td>';
                content += '<td>' + response[i].Balance_Qty + ' </td>';
                content += '</tr>';
            }
            content += '</tbody>';
            content += '</table>';
            $("#details").html(content);
        }
    },
    fnDispatchOrderDetailsErrorCallBack: function () {

    },
    fnCancel: function () {
        $("#orderList").show();
        $("#divregion").show();
        $("#seconddiv").hide();
        $('#details').hide();
        $('#invoiceNo').val('');
        $('#invoiceDate').val('');
        $('#dispatchDate').val('');
        $('#ackDate').val('');
        $('#filename').html('');
        rowId = 0;
        var content = "";
        content += '<div class="form-row" id="row">';
        content += '<div class="col-sm-12 col-md-4 col-lg-4 mb-3">';
        content += '<label for="validationDefault01">Product Name</label>';
        content += '<div id="Products_0"> <input type="text" class="form-control form-control-sm" id="Product_0" name="autodispatchProd" placeholder="" value=""></div>';
        content += '</div>';
        content += '<div class="col-sm-12 col-md-3 col-lg-3 mb-3">';
        content += '<label for="validationDefault02">Dispatch Qty</label>';
        content += '<input type="number" class="form-control form-control-sm" id="dispatchQty_0" placeholder="" value="">';
        content += '</div>';
        content += '<div class="col-sm-12 col-md-3 col-lg-3 mb-3">';
        content += '<label for="validationDefault02">Rate</label>';
        content += '<input type="number" class="form-control form-control-sm" id="rate_0" placeholder="" value="" min="1" onkeypress="return fnValidateBudget(this,event);">';
        content += '</div>';
        content += '<div class=" col-sm-12 col-md-2 col-lg-2 mb-3" id="newProduct">';
        content += '<button type="button" class="btn btn-sm btn-outline-info" style="position:relative;top:27px;" id="Add" onclick="OrderShipment.fnAdd()"><i class="fa fa-plus-square" aria-hidden="true"></i></button>';
        content += '</div>';
        content += '</div>';

        $("#Produt").html(content);
    },
    fnAdd: function () {
        rowId++;
        //$("#Produt #newProduct button").remove();
        //$("#Produt #newProduct").append('<button type="button" class="btn btn-sm btn-outline-info" style="position:relative;top:27px;" id="remove"><i class="fa fa-minus-square" aria-hidden="true"></i></button>');
        var content = "";
        content += '<div class="form-row" id="row' + rowId + '">';
        content += '<div class="col-sm-12 col-md-4 col-lg-4 mb-3">';
        content += '<label for="validationDefault01">Product Name</label>';
        content += '<div id="Products_' + rowId + '"><input type="text" class="form-control form-control-sm Product" id="Product_' + rowId + '"></div>';
        content += '</div>                       ';
        content += '<div class="col-sm-12 col-md-3 col-lg-3 mb-3">';
        content += '<label for="validationDefault02">Dispatch Qty</label>';
        content += '<input type="number" class="form-control form-control-sm" id="dispatchQty_' + rowId + '" placeholder="" value="">';
        content += '</div>';
        content += '<div class="col-sm-12 col-md-3 col-lg-3 mb-3">';
        content += '<label for="validationDefault02">Rate</label>';
        content += '<input type="number" class="form-control form-control-sm" id="rate_' + rowId + '" placeholder="" value="">';
        content += '</div>';
        content += '<div class="col-sm-12 col-md-2 col-lg-2 mb-3" id="newProduct">';
        content += '<div class="d-flex justify-content-end">';
        content += '<div class="bd-highlight mr-1">';
        content += '<button type="button" class="btn btn-sm btn-outline-info" style="position:relative;top:27px;" id="Add" onclick="OrderShipment.fnAdd()"><i class="fa fa-plus-square" aria-hidden="true"></i></button>';
        content += '</div>';
        content += '<div class="bd-highlight"><button type="button" class="btn btn-sm btn-outline-info" style="position:relative;top:27px;" id="remove"><i class="fa fa-minus-square" aria-hidden="true"></i></button></div>';
        content += '</div>';
        //content += '<button type="button" class="btn btn-sm btn-outline-info" style="position:relative;top:27px;" id="Add" onclick="OrderShipment.fnAdd()"><i class="fa fa-plus-square" aria-hidden="true"></i></button>';
        content += '</div>';
        content += '</div>';
        $("#Produt").append(content);
        var removetrigger = $("#newProduct #remove");
        removetrigger.click(function () {
            OrderShipment.fnRemove($(this));
        });
        var SDownListObj = new ej.dropdowns.DropDownList({
            placeholder: 'Select a Product Name',
            filterBarPlaceholder: 'Search',
            dataSource: globalProduct,
            fields: { text: 'Product_Name', value: 'Product_Code' },
            popupHeight: '250px',
            allowFiltering: true,
            filtering: function (e) {
                var dropdown_query = new ej.data.Query();
                dropdown_query = (e.text !== '') ? dropdown_query.where('Product_Name', 'contains', e.text, true) : dropdown_query;
                e.updateData(globalProduct, dropdown_query);
            }
        });
        $('#Products_' + rowId + '').html('');
        $('#Products_' + rowId + '').html('<input class="form-control" type"text" tabindex="1" id="Product_' + rowId + '" />');
        SDownListObj.appendTo('#Product_' + rowId + '');
    },
    fnRemove: function (id) {
        id.parent().parent().parent().parent().remove();
    },
    fnDispatchSave: function () {
        $('#btnshipment').prop("disabled", true);
        debugger;
        var fileData = new FormData();

        var invoiceNo = $("#invoiceNo").val();
        var invoiceDate = $("#invoiceDate").val();
        var dispatchDate = $("#dispatchDate").val();
        var ackDate = $("#ackDate").val();
        var inputGroupFile = $("#inputGroupFile").val();
        if (invoiceDate == "") {
            swal('Please Select Invoice Date !', "", "info");
            $('#btnshipment').prop("disabled", false);
            return false;
        }
        if (dispatchDate == "") {
            swal('Please Select Dispatch Date !', "", "info");
            $('#btnshipment').prop("disabled", false);
            return false;
        }
        if (ackDate == "") {
            swal('Please Select Acknowledge Date!', "", "info");
            $('#btnshipment').prop("disabled", false);
            return false;
        }
        var obj = {};
        obj.Company_Id = Company_Id,
        obj.UserCode = UserCode,
        obj.Order_Id = $("#orderId").val(),
        obj.InvoiceNo = invoiceNo,
        obj.InvoiceDate = invoiceDate.split('-')[2] + '-' + invoiceDate.split('-')[1] + '-' + invoiceDate.split('-')[0],
        obj.DispatchDate = dispatchDate.split('-')[2] + '-' + dispatchDate.split('-')[1] + '-' + dispatchDate.split('-')[0],
        obj.AckDate = ackDate.split('-')[2] + '-' + ackDate.split('-')[1] + '-' + ackDate.split('-')[0],
        obj.UploadImg = inputGroupFile,
        obj.subDomainName = subDomainName
        var loopCount = $('#Produt .form-row').map(function () {
            return this.id;
        });
        var arr = [];
        for (var i = 0; i < loopCount.length; i++) {
            var obj1 = {
                Product_Name: $("#Product_" + i + "_hidden").val(),
                Product_Code: $("#Product_" + i + "_hidden").val(),
                Dispatch_Qty: $("#dispatchQty_"+i).val(),
                Rate: $("#rate_"+i).val()
            }
            if (obj1.Product_Code != undefined) {
                arr.push(obj1);
               
            }
           
        }

        var params = [];
        obj.Product = arr;
        if (OrderShipment.fnValidation(obj)) {
        // File.
        var fileUpload = $("#inputGroupFile").get(0);
        var files = fileUpload.files;


        if (files.length > 0) {
            // File Validation.
            var fileSize = Math.round(files[0].size / 1024 / 1024); //Convert byte to MB.
            var fileExtension = files[0].name.split('.');
            if (fileSize > 5) {
                swal('File Size Must be Less than 5 MB !', "", "info");
                $('#btnshipment').prop("disabled", false);
                return false;

            }
            if (fileExtension[1] == 'jpg' || fileExtension[1] == 'png' || fileExtension[1] == 'bmp' || fileExtension[1] == 'Gif' || fileExtension[1] == 'jpeg' || fileExtension[1] == 'xls' || fileExtension[1] == 'xlsx' || fileExtension[1] == 'pdf' || fileExtension[1] == 'doc' || fileExtension[1] == 'docx' || fileExtension[1] == 'ppt' || fileExtension[1] == 'pptx' || fileExtension[1] == 'txt') {

            }
            else {
                $("#filename").html("");
                swal('File Not Supported !', "", "info");
                $('#btnshipment').prop("disabled", false);
                return false;
            }


            fileData.append(files[0].name, files[0]);
        }
            
        
      
        obj.lstProduct = JSON.stringify(arr);
        if (files.length == 0) {
            var p = {};
            obj.Attachment = '';
            p.name = "objData";
            p.value = obj;
            params.push(p);
            OrderShipment.fninsertshipment(params);
        }
        else {
            var hdUrl = '';
            if (IsResponsive == 'Yes')
            {
                hdUrl = "../UploadAttachment";
            }
            else {
                hdUrl = "../../HiDoctor_Activity/OrderFulfillment/UploadAttachment";
            }
            $.ajax({
                type: "POST",
                url: hdUrl,
                contentType: false, // Not to set any content header  
                processData: false, // Not to process data  
                data: fileData,
                success: function (result) {
                    debugger;
                    var p = {};
                    obj.Attachment = result;
                    p.name = "objData";
                    p.value = obj;
                    params.push(p);
                    OrderShipment.fninsertshipment(params);
                }
            })
        }

       //JSON.stringify(obj)
       // var p = {};
       // p.name = "objData";
       // p.value = obj;
       // params.push(p);

      

       //     $.ajax({
       //         url: '../../HiDoctor_Activity/OrderFulfillment/InsertOrderShipmentDetails',
       //         type: "POST",
       //         contentType: false, // Not to set any content header  
       //         processData: false, // Not to process data  
       //         data: fileData,
       //         success: function (result) {
       //             OrderShipment.fnInsertSuccessCallBack(result);
       //             $('#btnshipment').prop("disabled", false);
       //         },
       //         error: function (err) {
       //             OrderShipment.fnInsertErrorCallBack();
       //             $('#btnshipment').prop("disabled", false);
       //         }
       //     });
            //CoreRest.requestInvoke("OrderProcessingApi/InsertOrderShipmentDetails", "", params, "POST", OrderShipment.fnInsertSuccessCallBack, OrderShipment.fnInsertErrorCallBack, null, "JSON");
        }
        else {
            $('#btnshipment').prop("disabled", false);
        }
    },
    fnUpdateSuccessCallBack: function () {

    },
    fninsertshipment:function(parms)
    {
        debugger;
        Ajax.requestInvoke("OrderFulfillment", "InsertOrderShipmentDetails", parms, "POST", OrderShipment.fnInsertSuccessCallBack, OrderShipment.fnUpdateErrorCallBack, null, 'JSON');
    },
    fnUpdateErrorCallBack: function () {

    },
    fnInsertSuccessCallBack: function (response) {
        if (response > 0) {
            swal({
                title: 'Successfully!!',
                imageUrl: "https://lipis.github.io/bootstrap-sweetalert/assets/thumbs-up.jpg"
            });
            $("#invoiceNo").val("");
            $("#invoiceDate").val("");
            $("#dispatchDate").val("");
            $("#ackDate").val("");
            $("#inputGroupFile").val("");
            $("#filename").html("");
            $('#btnshipment').prop("disabled", false);
            rowId = 0;
            var content = "";
            content += '<div class="form-row" id="row">';
            content += '<div class="col-sm-12 col-md-4 col-lg-4 mb-3">';
            content += '<label for="validationDefault01">Product Name</label>';
            content += '<div id="Products_0"> <input type="text" class="form-control form-control-sm" id="Product_0" name="autodispatchProd" placeholder="" value=""></div>';
            content += '</div>';
            content += '<div class="col-sm-12 col-md-3 col-lg-3 mb-3">';
            content += '<label for="validationDefault02">Dispatch Qty</label>';
            content += '<input type="number" class="form-control form-control-sm" id="dispatchQty_0" placeholder="" value="">';
            content += '</div>';
            content += '<div class="col-sm-12 col-md-3 col-lg-3 mb-3">';
            content += '<label for="validationDefault02">Rate</label>';
            content += '<input type="number" class="form-control form-control-sm" id="rate_0" placeholder="" value="" min="1" onkeypress="return fnValidateBudget(this,event);">';
            content += '</div>';
            content += '<div class=" col-sm-12 col-md-2 col-lg-2 mb-3" id="newProduct">';
            content += '<button type="button" class="btn btn-sm btn-outline-info" style="position:relative;top:27px;" id="Add" onclick="OrderShipment.fnAdd()"><i class="fa fa-plus-square" aria-hidden="true"></i></button>';
            content += '</div>';
            content += '</div>';

            $("#Produt").html(content);
            $("#orderList").show();
            $("#divregion").show();
           // $("#label").html("Order List");
            $("#seconddiv").hide();
            $('#details').hide();
            $('#invoiceNo').val('');
            $('#invoiceDate').val('');
            $('#dispatchDate').val('');
            $('#ackDate').val('');
            $('#dispatchQty_0').val('');
            $('#rate_0').val('');
            $('#filename').html('');
            OrderShipment.fnddRegionOnChange();
        }
        else {
            swal('Invoice Number Already Exists !', "", "info");
        }
    },
    fnInsertErrorCallBack: function () {
        $('#invoiceNo').val('');
        $('#invoiceDate').val('');
        $('#dispatchDate').val('');
        $('#ackDate').val('');
        $('#dispatchQty_0').val('');
        $('#rate_0').val('');
        $('#filename').html('');
    },
    fnValidation: function (obj) {
        var status = true;
        if (obj.InvoiceNo == "") {
            swal('Please Enter the Invoice Number !', "", "info");
            status = false;
            $('#btnshipment').prop("disabled", true);
            return false;
        }
        if (obj.InvoiceDate == "") {
            swal('Please Select Invoice Date !', "", "info");
            $('#btnshipment').prop("disabled", true);
            status = false;
            return false;
        }
        if (obj.DispatchDate == "") {
            swal('Please Select Dispatch Date !', "", "info");
            $('#btnshipment').prop("disabled", true);
            status = false;
            return false;
        }
        if (obj.AckDate == "") {
            swal('Please Select Acknowledge Date!', "", "info");
            $('#btnshipment').prop("disabled", true);
            status = false;
            return false;
        }

        if (new Date(obj.DispatchDate) < new Date(obj.InvoiceDate)) {
            swal('Dispatch Date Must be Greater Than Invoice Date !', "", "info");
            $('#btnshipment').prop("disabled", true);
            status = false;
            return false;
        }
        if (new Date(obj.AckDate) < new Date(obj.DispatchDate)) {
            swal('Acknowledge Date Must be Greater Than Dispatch Date !', "", "info");
            $('#btnshipment').prop("disabled", true);
            status = false;
            return false;
        }

        for (var i = 0; i < obj.Product.length; i++) {
            if (obj.Product[i].Product_Code == "") {
                swal('Select Product !', "", "info");
                $('#btnshipment').prop("disabled", true);
                status = false;
                return false;
            }
            if (obj.Product[i].Dispatch_Qty == "") {
                swal('Select Dispatch Quantity !', "", "info");
                $('#btnshipment').prop("disabled", true);
                status = false;
                return false;
            }
            if (obj.Product[i].Rate == "") {
                swal('Select Rate !', "", "info");
                $('#btnshipment').prop("disabled", true);
                status = false;
                return false;
            }
        }
       if (obj.Product.length==0)  {
           swal('Please Select Product !', "", "info");
           $('#btnshipment').prop("disabled", true);
            status = false;
            return false;
        }
        var productCode = $.map(ShipmentDetails, function (index, value) {
            var obj = {
                Product_Code: index.Product_Code,
                Balance_Qty: index.Balance_Qty,
            };
            return obj;
        });
        for (var i = 0; i < productCode.length; i++) {
            debugger;
            var lst = $.grep(obj.Product, function (v) {
                return v.Product_Code == productCode[i].Product_Code;
            });
            var balance = productCode[i].Balance_Qty;
            if (lst != null && lst.length > 0) {
                if (parseInt(lst[0].Dispatch_Qty) > balance) {
                    swal("Sum of Dispatch Quantity Should not exceed the Balance Quantity", "", "info");
                    $('#btnshipment').prop("disabled", true);
                    status = false;
                    return false;
                }
            }
            

            //var sumQty = 0;
            //if (lst != null && lst.length > 0) {
            //    for (var j = 0; j < lst.length; j++) {
            //        sumQty += parseInt(lst[j].Dispatch_Qty);
            //    }
            //    var arr = $.grep(ShipmentDetails, function (v) {
            //        return v.Product_Code == productCode[i].Product_Code;
            //    })
            //    if (arr != null && arr.length > 0) {
            //        if ((arr[0].Total_Qty - (arr[0].Dispatch_Qty + arr[0].Cancel_Qty)) < sumQty) {
            //            swal("Sum of Dispatch Quantity Should not exceed the Balance Quantity", "", "info");
            //            status = false;
            //            return false;
            //        }
            //    }
            //    else {
            //        swal('Please Select Product !', "", "info");
            //    }
            //}
        }
        var arr = [];
        $("#Produt input[id=rate]").map(function () {
            if ($(this).val() == "") {
                arr.push($(this).val());
            }

        });
        if (arr.length > 0) {
            swal('Enter Product Quantity Rate !', "", "info")
            $('#btnshipment').prop("disabled", true);
            status = false;
            return false;
        }
        return status;
    },
    // Common Function.
    fnConvertDateFormat: function (date, type) {
        var convertedDate = "";
        var d = date.split('/');
        if (type == 1) {// MM-DD-YYYY          
            convertedDate = d[1] + '-' + d[0] + '-' + d[2];
        }
        return convertedDate;
    },
    isNumber: function (evt, element) {
        debugger;
        var charCode = (evt.which) ? evt.which : event.keyCode

        if (
            //(charCode != 45 || $(element).val().indexOf('-') != -1) &&      // “-” CHECK MINUS, AND ONLY ONE.
            (charCode != 46 || $(element).val().indexOf('.') != -1) &&      // “.” CHECK DOT, AND ONLY ONE.
            (charCode < 48 || charCode > 57))
            return false;

        return true;
    },
    
}
function fnValidateBudget(Id, evt) {
    debugger;
    if (evt.keyCode == 69 || evt.keyCode == 16 || evt.keyCode == 101) {
        return false;
    }
    else if (evt.keyCode == 45 || evt.keyCode == 43 || evt.shiftKey == true || evt.keyCode == 187 || evt.keyCode == 189) {
        return false;
    } else {
        if ($('#' + Id.id + '').val().length >= 7) {
            return false;

        }

    }
    var value = $('#' + Id.id + '').val();
    var RE = new RegExp(/^\d*\.?\d{0,1}$/g);
    if (RE.test(value)) {
        return true;
    } else {
        return false;
    }
}