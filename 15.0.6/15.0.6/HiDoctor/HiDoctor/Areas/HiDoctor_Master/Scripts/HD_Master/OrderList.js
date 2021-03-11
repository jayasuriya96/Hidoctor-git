/*
Created By      : Chakkaravarthi C
Created Date    : 27-03-2017
For             : Order List
*/

//*********** Tree Function ****************//


var whichTreeHandle = "";
var dvId = "dvOrderMainContainer";

function fnRegionTreeActivate(node) {

    if (whichTreeHandle == "Add") {
        debugger;
        // Add Screen
        OrderAdd.defaults.action_Region_Code = node.data.key;
        // Get Line Of Business
        OrderAdd.GetLineOfBusiness()
        //
        
        if (OrderAdd.defaults.LineOfBusiness == "OTC") {
            $("#" + dvId + "").unblock();
            OrderAdd.blockUI("dvAddOrderContainer");
            OrderAdd.defaults.showAccData = 'false';
            OrderAdd.GetUserDetails();

            OrderAdd.defaults.customerCaption = fnGetPrivilegeValue("DOCTOR_CAPTION_DISPLAY_NAME", "Customer");
            $("#lblCustomerCaption").text(OrderAdd.defaults.customerCaption + " Name:");
            $("#txtCustomerOrChemist").attr("placeholder", OrderAdd.defaults.customerCaption);

            OrderAdd.defaults.stockistCaption = fnGetPrivilegeValue("STOCKIEST_CAPTION_DISPLAY_NAME", "Stockist");

            OrderAdd.GetStockist();
            OrderAdd.GetProduct();
            OrderAdd.GetCustomerOrChemistAndSetAutoFill();
            $("#txtUser").val(OrderAdd.defaults.action_User_Name);
            $("#hdnUserCode").val(OrderAdd.defaults.action_User_Code);
            $("#txtCustomerOrChemist").val("");
            $("#hdnCustomerOrChemist").val("");
            // Create Stockist POB Designs
            OrderAdd.defaults.eventTree = true;
            OrderAdd.defaults.stockistRowCount = 0;
            OrderAdd.fnAddStockistRow();
            OrderAdd.UnblockUI("dvAddOrderContainer");
            $("#dvAddOrderContainer").show();

        } else {
            

            $("#dvAddOrderContainer").block({
                message: '<h4>Sorry,Allowed for OTC / FMCG Line of Business User</h4>',
                css: {
                    'z-index': '0',
                    color: '#a94442',
                    border: '1px solid #ebccd1',
                    'background-color': '#f2dede',
                    padding: '15px',
                    'margin-bottom': '20px',
                    'border-radius': '4px'
                },
                overlayCSS: {
                    'z-index': '0',
                    backgroundColor: '#fff',
                    opacity: 1
                }
            });


        }


    } else {

        // List Screen

        debugger;
        Order.defaults.action_Region_Code = node.data.key;
        Order.defaults.regionName = node.data.title.split('-')[0];
        // Get Line Of Business
        Order.GetLineOfBusiness()
        //

        if (Order.defaults.LineOfBusiness == "OTC") {
            $("#btnAddNewOrder").show();
            $("#dvOrderMainContainer").unblock();

            // Set Default for Current Month.
            Order.defaults.startDate = "" + Order.defaults.curMonth + "/01/" + Order.defaults.curYear + "";
            Order.defaults.endDate = Order.fnGetLastDate(Order.defaults.curMonth, Order.defaults.curYear);
            Order.defaults.orderListEventName = "Current";

            // Pre and Next Month assigned data for Tree
            Order.defaults.preMonth = Order.defaults.tPreMonth;
            Order.defaults.preYear = Order.defaults.tPreYear;

            Order.defaults.nextMonth = Order.defaults.tNextMonth;
            Order.defaults.nextYear = Order.defaults.tNextYear;
            //

            //Previous and Next Month Button
            $("#btnPreviousMonth").data("month", Order.defaults.preMonth).data("year", Order.defaults.preYear);
            $("#btnNextMonth").data("month", Order.defaults.nextMonth).data("year", Order.defaults.nextYear);

            Order.GetOrderList();
            //Header Name 
            $("#headerName").text("" + Order.defaults.regionName + " - Purchase Order Booking Details - " + Order.defaults.monthNames[(parseInt(Order.defaults.startDate.split("/")[0]) - 1)] + " " + Order.defaults.startDate.split("/")[2] + "");
            //
            $('#dvOrderListTable').focus();
        } else {
            $("#dvOrderListTable").html("");
            $("#btnAddNewOrder").show();
            $("#dvOrderMainContainer").block({
                message: '<h4>Sorry,Allowed for OTC / FMCG Line of Business User</h4>',
                css: {
                    'z-index': '0',
                    color: '#a94442',
                    border: '1px solid #ebccd1',
                    'background-color': '#f2dede',
                    padding: '15px',
                    'margin-bottom': '20px',
                    'border-radius': '4px'
                },
                overlayCSS: {
                    'z-index': '0',
                    backgroundColor: '#fff',
                    opacity: 1
                }
            });

        }


    }
   


}

//*****************************************//







var Order = {
    defaults: {
        "LineOfBusiness":"",
        "action_Region_Code": "",
        "curMonth": 0,
        "curYear": 0,
        "preMonth": 0,
        "preYear": 0,
        "nextMonth": 0,
        "nextYear": 0,
        "month": 0,
        "year": 0,
        "startDate": "",
        "endDate": "",
        "tPreMonth": 0,
        "tPreYear": 0,
        "tNextMonth": 0,
        "tNextYear":0,
        "orderListEventName": "",
        "Child_User_Count":0,
        "regionName": "",
        "monthNames": ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"],
    },
    initialize: function () {


        // Pre and Next Month assigned data for Tree
        Order.defaults.tPreMonth = Order.defaults.preMonth;
        Order.defaults.tPreYear = Order.defaults.preYear;

        Order.defaults.tNextMonth = Order.defaults.nextMonth;
        Order.defaults.tNextYear = Order.defaults.nextYear;
        //

        // Set Default for Current Month.
        Order.defaults.startDate = "" + Order.defaults.curMonth + "/01/" + Order.defaults.curYear + "";
        Order.defaults.endDate = Order.fnGetLastDate(Order.defaults.curMonth, Order.defaults.curYear);
        Order.defaults.orderListEventName = "Current";


        if (Order.defaults.Child_User_Count > 1) {

            debugger;

            // Allow Manager
            $("#btnListTreeShowHide").show();
            $("#dvOrderMainContainer").removeClass("col-sm-12").addClass("col-sm-9");

            //Assign Tree for this DIV
            fnBindRegionTree("dvOrderListRegionTree");
            $("#dvAjaxLoad").hide();

            // Tree View Hide and Show Button Event
            $("#btnListTreeShowHide").click(function () {
                $("#dvOrderListRegionTreeContainer").toggle();
                if ($("#dvOrderListRegionTreeContainer").is(':visible')) {
                    $("#dvOrderMainContainer").removeClass("col-sm-12").addClass("col-sm-9");
                }
                else {
                    $("#dvOrderMainContainer").removeClass("col-sm-9").addClass("col-sm-12");
                }
            });

            if (Order.defaults.LineOfBusiness == "OTC") {

                $("#btnAddNewOrder").show();
                // Get Order List for Current Month
                Order.GetOrderList();
                //


            } else {


                $("#dvOrderListTable").html("");
                $("#btnAddNewOrder").hide();
                $("#dvOrderMainContainer").block({
                    message: '<h4>Sorry,Allowed for OTC / FMCG Line of Business User</h4>',
                    css: {
                        'z-index': '0',
                        color: '#a94442',
                        border: '1px solid #ebccd1',
                        'background-color': '#f2dede',
                        padding: '15px',
                        'margin-bottom': '20px',
                        'border-radius': '4px'
                    },
                    overlayCSS: {
                        'z-index': '0',
                        backgroundColor: '#fff',
                        opacity: 1
                    }
                });



            }



        } else {

            // Single User Not a Manager

            debugger;

            if (Order.defaults.LineOfBusiness == "OTC") {


                $("#btnAddNewOrder").show();
                // Allow User 
                $("#btnListTreeShowHide").hide();
                $("#dvOrderListRegionTreeContainer").hide();
                $("#dvOrderMainContainer").removeClass("col-sm-9").addClass("col-sm-12");

                // Get Order List for Current Month
                Order.GetOrderList();
                //

            } else {

                $("#dvOrderListTable").html("");
                $("#btnListTreeShowHide").hide();
                $("#btnAddNewOrder").hide();
                $("#dvOrderMainContainer").block({
                    message: '<h4>Sorry,Allowed for OTC / FMCG Line of Business User</h4>',
                    css: {
                        'z-index': '0',
                        color: '#a94442',
                        border: '1px solid #ebccd1',
                        'background-color': '#f2dede',
                        padding: '15px',
                        'margin-bottom': '20px',
                        'border-radius': '4px'
                    },
                    overlayCSS: {
                        'z-index': '0',
                        backgroundColor: '#fff',
                        opacity: 1
                    }
                });



            }


        }


        // Pop Modal
        $("#dvMoreInfoModal").overlay({
            onBeforeLoad: function () {
            },
            onLoad: function () {
            }
        });

        // Add New Order
        $("#btnAddNewOrder").click(function () {
            whichTreeHandle = "Add";
            $('#PopUpCss').addClass("PopUpMaxSize");
            $('#dvMoreInfoHeader').html('Add New Order');
            $('#dvInfoContent').load('HiDoctor_Master/Order/OrderAdd/Add~NoOrderId');
            Order.blockUI("dvOrderMainContainer");
            //$("#dvMoreInfoModal").overlay().load();
        });

     

        //Previous and Next Month Button
        $("#btnPreviousMonth").data("month", Order.defaults.preMonth).data("year", Order.defaults.preYear);
        $("#btnNextMonth").data("month", Order.defaults.nextMonth).data("year", Order.defaults.nextYear);


        $("#btnPreviousMonth").click(function () {
            Order.defaults.startDate = "" + Order.defaults.preMonth + "/01/" + Order.defaults.preYear + "";
            Order.defaults.endDate = Order.fnGetLastDate(Order.defaults.preMonth, Order.defaults.preYear);
            Order.defaults.orderListEventName = "Previous";
            Order.GetOrderList();
        });

        $("#btnNextMonth").click(function () {
            Order.defaults.startDate = "" + Order.defaults.nextMonth + "/01/" + Order.defaults.nextYear + "";
            Order.defaults.endDate = Order.fnGetLastDate(Order.defaults.nextMonth, Order.defaults.nextYear);
            Order.defaults.orderListEventName = "Next";
            Order.GetOrderList();
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
    fnGetLastDate: function (month, year) {
        var date = new Date();
        //var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(parseInt(year), parseInt(month), 0);

        var lastDayWithSlashes = (lastDay.getMonth() + 1) + '/' + (lastDay.getDate()) + '/' + lastDay.getFullYear();

        return lastDayWithSlashes;

    },
    fnPreMonthSwipe:function()
    {
        var preMonth = (parseInt(Order.defaults.preMonth) - 1);
        if (preMonth == 0) {
            Order.defaults.preMonth = 12;
            Order.defaults.preYear = (parseInt(Order.defaults.preYear) - 1);
        }
        else {
            Order.defaults.preMonth = preMonth;
        }

        var nextMonth = (parseInt(Order.defaults.nextMonth) - 1);
        if (nextMonth == 0) {
            Order.defaults.nextMonth = 12;
            Order.defaults.nextYear = (parseInt(Order.defaults.nextYear) - 1);
        }
        else {
            Order.defaults.nextMonth = nextMonth;
        }

        $("#btnPreviousMonth").data("month", Order.defaults.preMonth).data("year", Order.defaults.preYear);
        $("#btnNextMonth").data("month", Order.defaults.nextMonth).data("year", Order.defaults.nextYear);
    },
    fnNextMonthSwipe:function()
    {
        var preMonth = (parseInt(Order.defaults.preMonth) + 1);
        if (preMonth == 13) {
            Order.defaults.preMonth = 1;
            Order.defaults.preYear = (parseInt(Order.defaults.preYear) + 1);
        }
        else {
            Order.defaults.preMonth = preMonth;
        }

        var nextMonth = (parseInt(Order.defaults.nextMonth) + 1);
        if (nextMonth == 13) {
            Order.defaults.nextMonth = 1;
            Order.defaults.nextYear = (parseInt(Order.defaults.nextYear) + 1);
        }
        else {
            Order.defaults.nextMonth = nextMonth;
        }

        $("#btnPreviousMonth").data("month", Order.defaults.preMonth).data("year", Order.defaults.preYear);
        $("#btnNextMonth").data("month", Order.defaults.nextMonth).data("year", Order.defaults.nextYear);
    },
    GetOrderList: function () {
        debugger;
        var objData = {};
        objData.startDate = Order.defaults.startDate;
        objData.endDate = Order.defaults.endDate;
        objData.Region_Code = Order.defaults.action_Region_Code;

        $.ajax({
            start: Order.blockUI("dvOrderMainContainer"),
            type: 'POST',
            data:objData,
            url: "Order/GetOrderList",
            success: function (jsonData) {
                    Order.fnBuildOrderList(jsonData);
            },
            error: function (e) {
                Order.UnblockUI("dvOrderMainContainer");
                //fnMsgAlert('error', 'Error', 'Bind Divisions , Get Divisions failed');
            },
            complete: function (jsonData) {

                    switch (Order.defaults.orderListEventName) {
                        case "Previous":
                            Order.fnPreMonthSwipe();
                            break;
                        case "Next":
                            Order.fnNextMonthSwipe();
                            break;
                    }
     
                    Order.UnblockUI("dvOrderMainContainer");
                    $("#dvAjaxLoad").hide();
                    $(".blockUI").hide();
            }
        });

    },
    fnBuildOrderList: function (jsonData)
    {
        debugger;
        var str = '';
        if (jsonData.length > 0) {
            str += '<table class="dataTable table table-hover borderShadow" id="tblOrderList">';
            str += '<thead>';
            str += '<tr>';
            str += '<th style="text-align:center;width:2%;">S.No</th><th style="width:5%;">Order No</th><th style="width:6%;">Order Date</th><th style="width:11%;">Customer Name</th><th style="width:10%;">Local Area</th><th style="width:20%;">Stockist Name</th><th style="width:2%;">No of Products</th>';
            str += '<th style="width:4%;">Value</th><th style="width:5%;">Due Date</th><th style="width:7%;">Status</th><th style="width:5%;">Source</th><th style="width:7%;">Created By</th><th style="width:16%;">Action</th>';
            str += '</tr>';
            str += '</thead>';
            str += '<tbody>';
            for (var i = 0, SNo = 1 ; i < jsonData.length; i++, SNo++) {

                var Order_Date = new Date(eval(jsonData[i].Order_Date.replace(/\/Date\((\d+)\)\//gi, "new Date($1)")));
                var Due_Date = new Date(eval(jsonData[i].Order_Due_Date.replace(/\/Date\((\d+)\)\//gi, "new Date($1)")));

                str += '<tr id="' + i + '">';
                str += '<td style="text-align: center;">' + SNo + '<input type="hidden" id="' + i + '_hdnFavouring_Region_Code" value="' + jsonData[i].Favouring_Region_Code + '"/> <input type="hidden" id="' + i + '_hdnOrder_Id" value="' + jsonData[i].Order_Id + '"/> <input type="hidden" id="' + i + '_hdnCustomer_Code" value="' + jsonData[i].Customer_Code + '"/> <input type="hidden" id="' + i + '_hdnStockiest_Code" value="' + jsonData[i].Stockiest_Code + '"/> </td>';
                str += '<td id="' + i + '_Order_Number" style="text-align: center;">' + jsonData[i].Order_Number + '</td><td id="' + i + '_Order_Date" >'+(Order_Date.getMonth() + 1 )+'/' + Order_Date.getDate() + '/'+Order_Date.getFullYear()+'</td><td id="' + i + '_Customer_Name">' + jsonData[i].Customer_Name + '</td><td id="' + i + '_Local_Area">' + jsonData[i].Local_Area + '</td><td id="' + i + '_Stockiest_Name">' + jsonData[i].Stockiest_Name + '</td><td id="' + i + '_No_Of_Products">' + jsonData[i].No_Of_Products + '</td>';
                str += '<td id="' + i + '_Total_Value">' + jsonData[i].Total_Value + '</td><td id="' + i + '_Order_Due_Date">' + (Due_Date.getMonth() + 1) + '/' + Due_Date.getDate() + '/' + Due_Date.getFullYear() + '</td>';
                // Color Change For Status
                if (jsonData[i].Order_Status == "Completed") {
                    str += '<td id="' + i + '_Order_Status" style="text-align:center;color:green;">' + jsonData[i].Order_Status + '</td>';
                }
                else if (jsonData[i].Order_Status == "Cancelled") {
                    str += '<td id="' + i + '_Order_Status" style="text-align:center;color:red;">' + jsonData[i].Order_Status + '</td>';
                }
                else {
                    str += '<td id="' + i + '_Order_Status" style="text-align:center;">' + jsonData[i].Order_Status + '</td>';
                }
                str += '<td id="' + i + '_Order_Mode">' + jsonData[i].Order_Mode + '</td><td id="' + i + '_Created_By">' + jsonData[i].User_Name + '</td>';
                str += '<td>';
                // Status Wise Hide the Edit
                if (jsonData[i].Order_Status == "Completed" || jsonData[i].Order_Status == "Cancelled") {
                    str += '<a href="javascript:void(0)" class="btnChangeStatusOrder">Change Status</a></td>';
                } else {
                    str += '<a href="javascript:void(0)" class="btnEditOrder">Edit</a>&nbsp;&nbsp;<a href="javascript:void(0)" class="btnChangeStatusOrder">Change Status</a></td>';
                }
                str += '</tr>';
            }
            str += '</tbody>';
            str += '</table>';
            $("#dvOrderListTable").html(str);
            Order.fnAddedDataTableWithMethods();
        }
        else {
            str = '<br /><br /><div class="alert alert-danger borderShadow" style="text-align: center;"><strong>No</strong> Data Found.</div><br /><br />';
            $("#dvOrderListTable").html(str);
        }
        //Header Name 
        $("#headerName").text("" + Order.defaults.regionName + "(Territory) - Purchase Order Booking Details - " + Order.defaults.monthNames[(parseInt(Order.defaults.startDate.split("/")[0]) - 1)] + " " + Order.defaults.startDate.split("/")[2] + "");
    },
    fnAddedDataTableWithMethods: function ()
    {


        // Fire On Edit
        $(".btnEditOrder").off("click").click(function () {
            whichTreeHandle = "Add";
            var rowCount = $(this).closest('tr').attr('id');
            var OrderId = $("#" + rowCount + "_hdnOrder_Id").val();
            var CustomerCode = $("#" + rowCount + "_hdnCustomer_Code").val();
            var Favouring_Region_Code = $("#" + rowCount + "_hdnFavouring_Region_Code").val();
            $('#PopUpCss').addClass("PopUpMaxSize");
            $('#dvMoreInfoHeader').html('Edit Order');
            $('#dvInfoContent').load('HiDoctor_Master/Order/OrderAdd/Edit~' + OrderId + '~' + Favouring_Region_Code);
            Order.blockUI("dvOrderMainContainer");
            //$("#dvMoreInfoModal").overlay().load();
        });


        //Fire On Change Status
        $(".btnChangeStatusOrder").off("click").click(function () {
            var status = $(this).closest('tr').find("td").eq(9).html();
            var orderNo = $(this).closest('tr').find("td").eq(1).html();
            var orderDate = $(this).closest('tr').find("td").eq(2).html();
            var customerName = $(this).closest('tr').find("td").eq(3).html();
            var totalValue = $(this).closest('tr').find("td").eq(7).html();
            //var orderMode = $(this).closest('tr').find("td").eq(10).html() == "DCR" ? 0 : 1;
            var orderMode = 1;
            var rowCount = $(this).closest('tr').attr('id');
            var OrderId = $("#" + rowCount + "_hdnOrder_Id").val();
            var btn1 = '', btn2 = '';
            switch (status) {
                case "Cancelled":
                    btn1 = '<button type="button" class="btn btn-primary btn-sm pull-right btnStatusSubmit" data-Order_Id="' + OrderId + '" data-Order_Status="1" >In Progress Order</button>';
                    btn2 = '<button type="button" class="btn btn-primary btn-sm pull-right btnStatusSubmit" data-Order_Id="' + OrderId + '" data-Order_Status="2" >Complete Order</button>';
                    break;
                case "In Progress":
                    btn1 = '<button type="button" class="btn btn-primary btn-sm pull-right btnStatusSubmit" data-Order_Id="' + OrderId + '" data-Order_Status="2" >Complete Order</button>';
                    btn2 = '<button type="button" class="btn btn-primary btn-sm pull-right btnStatusSubmit" data-Order_Id="' + OrderId + '" data-Order_Status="0" >Cancel Order</button>';
                    break;
                case "Completed":
                    btn1 = '<button type="button" class="btn btn-primary btn-sm pull-right btnStatusSubmit" data-Order_Id="' + OrderId + '" data-Order_Status="1" >In Progress Order</button>';
                    btn2 = '<button type="button" class="btn btn-primary btn-sm pull-right btnStatusSubmit" data-Order_Id="' + OrderId + '" data-Order_Status="0" >Cancel Order</button>';
                    break;
            }

            var str = '';
            str += '<div class="col-xs-12 clearfix">';
            str += 'Order Number : ' + orderNo + '';
            str += '</div>';
            str += '<div class="col-xs-12 clearfix">';
            str += 'Order Date : ' + orderDate + '';
            str += '</div>';
            str += '<div class="col-xs-12 clearfix">';
            str += 'Order Name : ' + customerName + '';
            str += '</div>';
            str += '<div class="col-xs-12 clearfix">';
            str += 'Total Value : ' + totalValue + '';
            str += '</div>';
            str += '<div class="col-xs-12 clearfix">';
            str += '<div class="col-xs-6">';
            str += '<div class="form-group">';
            str += btn1;
            str += '</div>';
            str += '</div>';
            str += '<div class="col-xs-6">';
            str += '<div class="form-group">';
            str += btn2;
            str += '</div>';
            str += '</div>';
            str += '</div>';



            $('#dvMoreInfoHeader').html('Change Status ');
            $('#dvInfoContent').html(str);
            $('#PopUpCss').removeClass("PopUpMaxSize");
            $("#dvMoreInfoModal").overlay().load();

            // Event Fire On Status Submit
            $(".btnStatusSubmit").off("click").click(function () {

                $("#dvMoreInfoModal").overlay().close();

                var objData = {};
                objData.Order_Id = $(this).data("order_id");
                objData.Order_Status = $(this).data("order_status");
                objData.Order_Mode = orderMode;
                objData.Order_Date = orderDate;

                $.ajax({
                    start: Order.blockUI("dvOrderListTable"),
                    type: 'POST',
                    data: objData,
                    url: "Order/PutOrderStatus",
                    success: function (jsonData) {
                        if (jsonData == "Success") {
                            Order.GetOrderList();
                            fnMsgAlert('success', 'Success', 'Order Status Successfully Modified.');
                        }
                        else {
                            fnMsgAlert('failed', 'failed', 'Order Status is not Modified.');
                        }

                    },
                    error: function (e) {
                        Order.UnblockUI("dvOrderListTable");
                        fnMsgAlert('error', 'Error', 'Bind Divisions , Get Divisions failed');
                    },
                    complete: function (jsonData) {
                        Order.UnblockUI("dvOrderListTable");
                    }
                });


            });

        });



        /////////////////////////////////////////

        var table = $('#tblOrderList').dataTable({
            "sDom": 'CT<"clear">Rlfrtip', "bPaginate": true, "sPaginationType": "full_numbers", "aLengthMenu": [[10, 25, 50, -1], [10, 25, 50, "-- All --"]], "iDisplayLength": 25,
        });
        $(".TableTools_clipboard, .TableTools_csv, .TableTools_print").hide();
       
        // Stockist Data Bind
        var stockistData = $.unique(jsonPath(table.fnGetData(), "$..5"));

        var select = $('<select id="ddlStockist"><option value="">All Stockists</option></select>');
        for (var i = 0; i < stockistData.length; i++) {
            select.append('<option value="' + stockistData[i] + '">' + stockistData[i] + '</option>');
        }

        $("#dvStockist").html(select);

        $("#ddlStockist").on('change', function () {
            table.fnFilter($(this).val(), 5);
        });

        // ---------------------- //


        // Customer Data Bind
        var customerData = $.unique(jsonPath(table.fnGetData(), "$..3"));

        var select = $('<select id="ddlCustomerName"><option value="">All Customers</option></select>');
        for (var i = 0; i < customerData.length; i++) {
            select.append('<option value="' + customerData[i] + '">' + customerData[i] + '</option>');
        }

        $("#dvCustomers").html(select);

        $("#ddlCustomerName").on('change', function () {
            table.fnFilter($(this).val(), 3);
        });

        // ---------------------- //


        // Area Data Bind
        var areaData = $.unique(jsonPath(table.fnGetData(), "$..4"));

        var select = $('<select id="ddlArea"><option value="">All Areas</option></select>');
        for (var i = 0; i < areaData.length; i++) {
            select.append('<option value="' + areaData[i] + '">' + areaData[i] + '</option>');
        }

        $("#dvArea").html(select);

        $("#ddlArea").on('change', function () {
            table.fnFilter($(this).val(), 4);
        });

        // ---------------------- //


        // Orders Data Bind
        var orderData = $.unique(jsonPath(table.fnGetData(), "$..9"));

        var select = $('<select id="ddlOrders"><option value="">All Orders</option></select>');
        for (var i = 0; i < orderData.length; i++) {
            select.append('<option value="' + orderData[i] + '">' + orderData[i] + '</option>');
        }

        $("#dvOrders").html(select);

        $("#ddlOrders").on('change', function () {
            table.fnFilter($(this).val(), 9);
        });

        // ---------------------- //







    },
    GetLineOfBusiness: function () {
        $.ajax({
            start: Order.blockUI("dvOrderMainContainer"),
            type: 'POST',
            data: "Region_Code=" + Order.defaults.action_Region_Code,
            url: 'Order/GetLineOfBusiness',
            async: false,
            success: function (response) {
                if (response != '' && response != undefined) {
                    Order.defaults.LineOfBusiness = response;
                }
            },
            complete: function ()
            { Order.UnblockUI("dvOrderMainContainer"); }
        });
    },
    ReturnGetCalltoList: function () {

        // Call List //
        // Get Line Of Business
        Order.GetLineOfBusiness()
        //

        if (Order.defaults.LineOfBusiness == "OTC") {
            $("#dvOrderMainContainer").unblock();
            $("#btnAddNewOrder").show();
            Order.GetOrderList();
        } else {

            if (OrderAdd.defaults.Child_User_Count > 1) {
                dvId = "dvOrderHeadWithTable";
                $("#btnAddNewOrder").show();
            }

            $("#" + dvId + "").block({
                message: '<h4>Sorry,Allowed for OTC / FMCG Line of Business User</h4>',
                css: {
                    'z-index': '0',
                    color: '#a94442',
                    border: '1px solid #ebccd1',
                    'background-color': '#f2dede',
                    padding: '15px',
                    'margin-bottom': '20px',
                    'border-radius': '4px'
                },
                overlayCSS: {
                    'z-index': '0',
                    backgroundColor: '#fff',
                    opacity: 1
                }
            });

        }
        // Call List //
    }
}