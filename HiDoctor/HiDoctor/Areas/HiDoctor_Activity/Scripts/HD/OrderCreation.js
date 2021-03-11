var globalProduct = '', rowId = 0;
var globalcustomerdetails = '';
var Order = {

    init: function () {

        var param = "Region_Code=" + RegionCode + "&subDomainName=" + subDomainName + "&CompanyCode=" + Company_Code;
        Ajax.requestInvoke("OrderFulfillment", "GetAllRegionName", param, "GET", Order.fnRegionSucessCallBack, Order.fnRegionErrorCallBack, '', '');


    },
    fnRegionSucessCallBack: function (response) {
        debugger;
        $('#regions').html('');
        $('#regions').html('<input class="form-control" type"text" tabindex="1" id="region" />');
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
                change: Order.fnddRegionOnChange

            });
            atcObj.appendTo('#region');
            atcObj.id = response[0].Region_Code;
            
            Order.GetStockiest($("#region_hidden").val());
            Order.GetCustomer($("#region_hidden").val());
            Order.GetProduct($("#region_hidden").val());

        }
        
    },
    fnRegionErrorCallBack: function () {

    },
    fnddRegionOnChange:function()
    {
        Order.GetStockiest($("#region_hidden").val());
        Order.GetCustomer($("#region_hidden").val());
        Order.GetProduct($("#region_hidden").val());
    },
  
    GetStockiest: function (region_code) {
        debugger;
        $('#stockiests').html('');
        $('#stockiests').html('<input class="form-control" type"text" tabindex="1" id="stockiest" />');
        date = new Date();
        date = (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
        var param = "Region_Code=" + region_code + "&Order_Date=" + date + "&subDomainName=" + subDomainName+"&Entity=Stockiest";
        Ajax.requestInvoke("OrderFulfillment", "GetRegionWiseStockiest", param, "GET", Order.fnListStockSucessCallBack, Order.fnListStockErrorCallBack, '', '');
    },
    fnListStockSucessCallBack: function (response) {
     
        var SDownListObj = new ej.dropdowns.DropDownList({
            placeholder: 'Select a Stockiest Name',
            filterBarPlaceholder: 'Search',
            dataSource: response,
            fields: { text: 'Stockiest_Name', value: 'Stockiest_Code' },
            popupHeight: '250px',
            allowFiltering: true,
            filtering: function (e) {
                var dropdown_query = new ej.data.Query();
                dropdown_query = (e.text !== '') ? dropdown_query.where('Stockiest_Name', 'contains', e.text, true) : dropdown_query;
                e.updateData(response, dropdown_query);
            }
        });
        $('#stockiests').html('');
        $('#stockiests').html('<input class="form-control" type"text" tabindex="1" id="stockiest" />');
        SDownListObj.appendTo('#stockiest');
    },
    fnListStockErrorCallBack: function () {

    },
    GetCustomer: function (region_code) {
        debugger;
        $('#customers').html('');
        $('#customers').html('<input class="form-control" type"text" tabindex="1" id="customer" />');
        date = new Date();
        date = (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
        var entity = $('input:radio[name=entity]:checked').val()
        var param = "Region_Code=" + region_code + "&Order_Date=" + date + "&subDomainName=" + subDomainName + "&Entity=" + entity;
        Ajax.requestInvoke("OrderFulfillment", "GetRegionWiseStockiest", param, "GET", Order.fnCustomerSucessCallBack, Order.fnCustomerErrorCallBack, '', '');
    },
    fnCustomerSucessCallBack: function (response) {
        globalcustomerdetails = response;
        var CDownListObj = new ej.dropdowns.DropDownList({
            placeholder: 'Select a Customer Name',
            filterBarPlaceholder: 'Search',
            dataSource: response,
            fields: { text: 'Customer_Name', value: 'Customer_Code' },
            popupHeight: '250px',
            allowFiltering: true,
            filtering: function (e) {
                var dropdown_query = new ej.data.Query();
                dropdown_query = (e.text !== '') ? dropdown_query.where('Customer_Name', 'contains', e.text, true) : dropdown_query;
                e.updateData(response, dropdown_query);
            }
        });
        $('#customers').html('');
        $('#customers').html('<input class="form-control" type"text" tabindex="1" id="customer" />');
        CDownListObj.appendTo('#customer');
    },
    fnCustomerErrorCallBack: function () {

    },
    fnConvertDateFormat: function (date, type) {
        var convertedDate = "";
        var d = date.split('/');
        if (type == 1) {// MM-DD-YYYY          
            convertedDate = d[1] + '-' + d[0] + '-' + d[2];
        }
        return convertedDate;
    },
    fnAdd: function () {
        rowId++;
        //$("#Produt #newProduct button").remove();
        //$("#Produt #newProduct").append('<button type="button" class="btn btn-sm btn-outline-info" style="position:relative;top:27px;" id="remove"><i class="fa fa-minus-square" aria-hidden="true"></i></button>');
        var content = "";
        content += '<div class="form-row remove" id="row' + rowId + '">';
        content += '<div class="col-sm-12 col-md-4 col-lg-4 mb-3">';
        content += '<label for="validationDefault01">Product Name</label>';
        content += '<div id="Products_' + rowId + '"><input type="text" class="form-control form-control-sm Product" id="Product_' + rowId + '"></div>';
        content += '</div>                       ';
        content += '<div class="col-sm-12 col-md-2 col-lg-2 mb-3">';
        content += '<label for="validationDefault02">Quantity</label>';
        content += '<input type="number" class="form-control form-control-sm dispatchQty" min="1" id="dispatchQty_' + rowId + '" placeholder="" value="" onkeyup=fngetamount(' + rowId + ') onkeypress="return fnValidateBudget(this,event);">';
        content += '</div>';
        content += '<div class="col-sm-12 col-md-2 col-lg-2 mb-3">';
        content += '<label for="validationDefault02">Unit Rate</label>';
        content += '<input type="number" class="form-control form-control-sm " id="rate_' + rowId + '" placeholder="" value="" onkeyup=fncalamount(' + rowId + ') readonly>';
        content += '</div>';
        content += '<div class="col-sm-12 col-md-2 col-lg-2 mb-3">';
        content += '<label for="validationDefault02">Amount</label>';
        content += '<input type="number" class="form-control form-control-sm" id="amount_' + rowId + '" placeholder="" value="" readonly>';
        content += '</div>';
        content += '<div class="col-sm-12 col-md-2 col-lg-2 mb-3" id="newProduct">';
        content += '<div class="d-flex justify-content-end">';
        content += '<div class="bd-highlight mr-1">';
        content += '<button type="button" class="btn btn-sm btn-outline-info" style="position:relative;top:27px;" id="Add" onclick="Order.fnAdd()"><i class="fa fa-plus-square" aria-hidden="true"></i></button>';
        content += '</div>';
        content += '<div class="bd-highlight"><button type="button" class="btn btn-sm btn-outline-info" style="position:relative;top:27px;" id="remove"><i class="fa fa-minus-square" aria-hidden="true"></i></button></div>';
        content += '</div>';
        //content += '<button type="button" class="btn btn-sm btn-outline-info" style="position:relative;top:27px;" id="Add" onclick="Order.fnAdd()"><i class="fa fa-plus-square" aria-hidden="true"></i></button>';
        content += '</div>';
        content += '</div>';
        $("#Produt").append(content);
        var removetrigger = $("#newProduct #remove");
        removetrigger.click(function () {
            Order.fnRemove($(this));
        });
        var SDownListObj = new ej.dropdowns.DropDownList({
            placeholder: 'Select a Product Name',
            filterBarPlaceholder: 'Search',
            dataSource: globalProduct,
            fields: { text: 'Product_Name', value: 'Product_Code' },
            popupHeight: '250px',
            allowFiltering: true,
            change: Order.fnProductOnChange,
            filtering: function (e) {
                var dropdown_query = new ej.data.Query();
                dropdown_query = (e.text !== '') ? dropdown_query.where('Product_Name', 'contains', e.text, true) : dropdown_query;
                e.updateData(globalProduct, dropdown_query);
            }
        });
        $('#Products_' + rowId + '').html('');
        $('#Products_' + rowId + '').html('<input class="form-control" type"text" tabindex="1" id="Product_' + rowId + '" />');
        SDownListObj.appendTo('#Product_'+ rowId + '');
    },
    fnRemove: function (id) {
        id.parent().parent().parent().parent().remove();
    },
    GetProduct: function (region_code) {
        debugger;
        date = new Date();
        date = (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
        var param = "Region_Code=" + region_code + "&CompanyCode=" + Company_Code + "&UserCode=" + UserCode + "&subDomainName=" + subDomainName;
        Ajax.requestInvoke("OrderFulfillment", "GetRegionWiseProduct", param, "GET", Order.fnListProductSucessCallBack, Order.fnListProductErrorCallBack, '', '');
    },
    fnListProductSucessCallBack: function (response) {
        //var uniqueOrder = response.map(a=>a.Product_Code).reduce(function (item, e1) {
        //    var matches = item.filter(function (e2)
        //    { return e1 == e2 });
        //    if (matches.length == 0) {
        //        item.push(e1);
        //    }
        //    return item;
        //}, []);
        globalProduct = response;
        var SDownListObj = new ej.dropdowns.DropDownList({
            placeholder: 'Select a Product Name',
            filterBarPlaceholder: 'Search',
            dataSource: globalProduct,
            fields: { text: 'Product_Name', value: 'Product_Code' },
            popupHeight: '250px',
            allowFiltering: true,
            change: Order.fnProductOnChange,
            filtering: function (e) {
                var dropdown_query = new ej.data.Query();
                dropdown_query = (e.text !== '') ? dropdown_query.where('Product_Name', 'contains', e.text, true) : dropdown_query;
                e.updateData(globalProduct, dropdown_query);
            }
        });
        $('#Products_0').html('');
        $('#Products_0').html('<input class="form-control" type"text" tabindex="1" id="Product_0" />');
        SDownListObj.appendTo('#Product_0');
    },
    fnListProductErrorCallBack: function () {

    },
    fnProductOnChange: function (args)
    {
        var id = args.element.id
        var row = id.split('_')[1];
        $('#dispatchQty_' + row).val('');
        $('#rate_' + row).val('');
        $('#amount_' + row).val('');
       
    }
}
function fngetPOBOrder() {
    debugger;
        var region_code = $("#region_hidden").val()
        var Sdate = $('#StartDate').val();
        var Edate = $('#EndDate').val();
        if (Sdate == "") {
            swal('Please Select Start Date !', "", "info");
            return false;
        }
        if (Edate == "") {
            swal('Please Select End Date !', "", "info");
            return false;
        }
        if (RegionCode == '')
        {
            swal('Please Select Region Name !', "", "info");
            return false;
        }
        Sdate = Sdate.split('-')[2] + '-' + Sdate.split('-')[1] + '-' + Sdate.split('-')[0];
        Edate = Edate.split('-')[2] + '-' + Edate.split('-')[1] + '-' + Edate.split('-')[0];
        var Customer_Code = $('#customer_hidden').val();
        var param = "Region_Code=" + region_code + "&Start_Date=" + Sdate + "&End_Date=" + Edate +"&Customer_Code="+Customer_Code+ "&subDomainName=" + subDomainName;
        Ajax.requestInvoke("OrderFulfillment", "GetOderNumber", param, "GET", fnOrderSucessCallBack, fnOrderErrorCallBack, '', '');
    }
function fnOrderSucessCallBack(response) {
        debugger;
        var content = "";
        if (response != null && response.length > 0) {
            if (response.length > 1)
                content += '<option value=0>Select</option>';
            for (var i = 0; i < response.length; i++) {
                content += '<option value= "' + response[i].Order_Id + '">' + response[i].Order_Number + '</option>';
            }
            $("#Order").html(content);
          
        }
        $('#orderdetails').css("display", "flex");
        $('#orderdetails').show();
    }
function fnOrderErrorCallBack()
{

}
function fngetOrderDetails() {
    debugger;

    var Order_Id = $('#Order').val();

    if (Order_Id == 0)
    {
        swal('Please Select Order Number !', "", "info");
        return false;
    }

    var param = "Order_Id=" + Order_Id + "&subDomainName=" + subDomainName;
    Ajax.requestInvoke("OrderFulfillment", "GetPOBOrderDetails", param, "GET", fnOrderDetialsSuccessCallBack, fnOrderDetailsErrorCallBack, Order_Id, '');
}
function fnOrderDetialsSuccessCallBack(response, Order_Id) {
    var content = '';
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
    $("#modelbody").html(content);
    $('#myModal').modal('show');
}
function fnOrderDetailsErrorCallBack()
{

}
function fnSave()
{
    debugger;
    $('#btnshipment').prop("disabled", true);
    var region = $("#region_hidden").val()
    var customer_code = $('#customer_hidden').val()
    var stockiest_code = $('#stockiest_hidden').val()
    var dueDate = $('#dueDate').val();
    var remark = $('#remark').val();
    if(region=='')
    {
        swal('Please Select Region Name !', "", "info");
        $('#btnshipment').prop("disabled", false);
        return false;
    }
    if (customer_code == '') {
        swal('Please Select Customer Name !', "", "info");
        $('#btnshipment').prop("disabled", false);
        return false;
    }
    if(stockiest_code=='')
    {
        swal('Please Select Stockiest Name !', "", "info");
        $('#btnshipment').prop("disabled", false);
        return false;
    }
    if (dueDate == '') {
        swal('Please Select Due Date !', "", "info");
        $('#btnshipment').prop("disabled", false);
        return false;
    }
    dueDate = dueDate.split('-')[2] + '-' + dueDate.split('-')[1] + '-' + dueDate.split('-')[0];
    var loopCount = $('#Produt .form-row').map(function () {
        return this.id;
    });
    var arr = [];
    for (var i = 0; i <= rowId; i++) {
        var obj1 = {
            Product_Code: $("#Product_"+i+"_hidden").val(),
            Dispatch_Quantity: $("#dispatchQty_"+i+"").val(),
            Rate: $("#rate_" + i + "").val(),
            Amount: $("#amount_" + i + "").val()
        }
        if (obj1.Product_Code != undefined)
        {
            arr.push(obj1);
            var result = fncheckIfArrayIsUnique(arr);
            if (result == true) {
                swal('You have already entered the product', "", "info");
                $('#btnshipment').prop("disabled", false);
                return false;
            }
        }
        if($("#dispatchQty_"+i+"").val()=='')
        {
            swal('Please  enter the quantity', "", "info");
            $('#btnshipment').prop("disabled", false);
            return false;
        }
        if ($("#rate_" + i + "").val() == '') {
            swal('Please enter the unit rate', "", "info");
            $('#btnshipment').prop("disabled", false);
            return false;
        }
      
    }
    if (arr.length ==0) {
        swal('Select Product !', "", "info");
        $('#btnshipment').prop("disabled", false);
        return false;
    }

    if (remark.length > 500)
    {
        swal('Enter 500 character in remark', "", "info");
        $('#btnshipment').prop("disabled", false);
        return false;
    }
    var lst = $.grep(globalcustomerdetails, function (v) {
        return v.Customer_Code == customer_code;
    });

    var obj = {};
    obj.Company_Id = Company_Id,
    obj.UserCode = UserCode,
    obj.Region_Code = region;
    obj.Customer_Code = customer_code;
    obj.Stockiest_Code = stockiest_code;
    obj.DueDate = dueDate;
    obj.subDomainName = subDomainName;
    obj.Category = lst[0].Category;
    obj.Speciality_Name = lst[0].Speciality_Name;
    obj.MDL_Number = lst[0].MDL_Number;
    obj.Customer_Entity_Type = lst[0].Customer_Entity_Type;
    obj.Customer_Name = lst[0].Customer_Name;
    obj.remark = remark;
    if ($('input:radio[name=age]:checked').val() == "Yes") {
        obj.Order_Id = $('#Order').val();
    }
    else {
        obj.Order_Id = 0;
    }
    var params = [];
    obj.Product = JSON.stringify(arr);
    obj.date = JSON.stringify(CommonDateDetails.fnGetTodaysDateNew());
    var p = {};
    p.name = "objData";
    p.value = obj;
    params.push(p);
    Ajax.requestInvoke("OrderFulfillment", "InsertPOBOrder", params, "POST", fnInsertSuccessCallBack, fnInserErrorCallBack, null, 'JSON');
}
function fnInsertSuccessCallBack(result)
{
    if (result == 1) {
        swal("Success", "Order Saved successfully.", "success");
        $('#btnshipment').prop("disabled", false);
    }
    fnCancel()
    Order.fnddRegionOnChange();
}
function fnInserErrorCallBack()
{
    $('#btnshipment').prop("disabled", false);
}
function fngetamount(rowid)
{
    debugger;
    var productcode = $("#Product_" + rowid + "_hidden").val();
    var lst = $.grep(globalProduct, function (v) {
        return v.Product_Code == productcode;
    });
    var qty = $('#dispatchQty_'+rowid).val();
    $('#rate_' + rowid).val(lst[0].Unit_Rate);
    var unit = lst[0].Unit_Rate;
    $('#amount_' + rowid).val(fnRound(parseFloat(qty) * parseFloat(unit), 2))

}
function fncalamount(rowid)
{
    debugger;
    var qty = $('#dispatchQty_' + rowid).val();
    var unit = $('#rate_' + rowid).val();
    $('#amount_' + rowid).val(fnRound(parseFloat(qty) * parseFloat(unit), 2))
}
function fnRound(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}
function fnCancel()
{
    $('#stockiests').html('<input class="form-control" type"text" tabindex="1" id="stockiest" />');
    $('#customers').html('<input class="form-control" type"text" tabindex="1" id="customer" />');
    $('#dueDate').val('');
    $('#remark').val('');
    $('#NO').prop("checked", true);
    $('#date').hide();
    $('#dispatchQty_0').val('');
    $('#rate_0').val('');
    $('#amount_0').val('');
    $('#Products_0').html('<input type="text" class="form-control form-control-sm Product" id="Product_0">');
    $('.remove').html('');
    rowId = 0;
    Order.fnddRegionOnChange();

}
function fncheckIfArrayIsUnique (myArray) {
    for (var i = 0; i < myArray.length; i++) {
        for (var j = i + 1; j < myArray.length; j++) {
            if (myArray[i].Product_Code == myArray[j].Product_Code) {
                return true; // means there are duplicate values
            }
        }
    }
    return false; // means there are no duplicate values.
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