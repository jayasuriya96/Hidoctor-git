var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var Selected_Region_Code = "";
var valid = false;
var product_List;
var product_Name_List = [];
var price_Group = "";
var privilege_List = "";
var Selected_Product_List;
var grid2;
var privilege = "";
var Generated_Date = "";
var rowCount = 1;
var Input_Columns = "";
var Edited_SS_Code = "";
var stockCode = "";
var Compute_Field_Editable = false;
var Purchase_Editable = false;
var Opening_Editable = false;
var SEQUENCE_ENTRY = false;
var arr = [];
var Year = "";
var Month = "";
var final_Insert_Data = [];
var Insert_Mode = "";
var check_ps = "";
var global_variable = "";
var check_Mandatory_Privilege = true;
var lstEnteredProducts = [];
var lstUnMappedProducts = [];
var lstCheckMappedProd = [];
var can_Enter_SS = true;
var can_skip = true;
var double_Entry_Check = true;
var No_decimal = "";
var selectedKeys = "";
var saveMode = "NEW";
var g_secondarySalesHeaderDetails = "";
var gobfile = '';
var SS_Periodic_Lock = true;
var SecondarySales = {
    defaults: {

    },

    initializings: function () {
        debugger;
        SecondarySales.fnDeleteRows();
    },
}

var SecondarySales = {
    //setting default values related to logged in user
    defaults: {
        Company_Code: "",
        LogRegionCode: "",
        LogUserCode: "",
        CompanyId: "",
    },
    init: function () {
        atcObj2 = new ej.dropdowns.DropDownList({
            dataSource: [],
            fields: { text: 'label', value: 'value' },
            popupHeight: '300px',
        });
        atcObj2.appendTo('#txtStockist');
    },
    //function to show or hide tree and it's related impact on UI display
    fnToggleTree: function () {
        if ($('#btnTree').val() == "Hide Tree") {
            $("#dvtree").hide();
            $("#dvSSEntry").toggleClass("col-sm-9", false);
            $("#dvSSEntry").toggleClass("col-sm-12", true);
            $('#btnTree').val("Show Tree");
        }
        else {
            $("#dvSSEntry").toggleClass("col-sm-12", false);
            $("#dvSSEntry").toggleClass("col-sm-9", true);
            $("#dvtree").show();
            $('#btnTree').val("Hide Tree");

        }
    },
    //first validation done when selecting a region from tree
    //validates whether the selected region is territory type or not.
    //if it's territory type then loads the SS entry Screen.
    fnSecondarySalesEntryValidate: function (Company_Code, Region_Code) {
        Selected_Region_Code = Region_Code.data.key;
        if (Region_Code.data.title.split('-')[0].split('(')[1].split(')')[0].toUpperCase() != "TERRITORY") {
            $("#dvSSEntry").toggleClass("col-sm-12", false);
            $("#dvSSEntry").toggleClass("col-sm-9", true);
            $("#dvtree").show();
            $('#btnTree').val("Hide Tree");
            swal('Info', 'Please select Territory type region', 'info');
            return false;
        }
        else {
            SecondarySales.fnLoadSSEntryScreen();
        }
    },
    //displays year, month and get stockist option.
    //calls function fnGetSSEnteredDetails for getting all the stockist entered in current year and previous year 
    //that are part of the selected region
    fnLoadSSEntryScreen: function () {
        $('#txtYear').html('');
        $('#txtMonth').html('');
        $('#txtStockist').html('');
        $('#tblSecondarySalesEntered').html('');
        $('#tblSSStockistEntryHeader').html('');
        $('#dvSSEntry').show();
        $('#dvStockistList').hide();
        $('#dvShowProducts').hide();
        $('#tblSSProductEntry').html('');
        lstEnteredProducts = [];
        Edited_SS_Code = "";
        SecondarySales.fnBindMonthAndYear();
        SecondarySales.fnGetSSEnteredDetails();
    },
    //resets the entire screen.
    //hit when click on draft, submit, failure in getting stockist, failure in getting products.
    fnReset: function () {
        document.querySelector("#txtYear").ej2_instances[0].enabled = true;
        document.querySelector("#txtMonth").ej2_instances[0].enabled = true;
        document.querySelector("#txtStockist").ej2_instances[0].enabled = true;
        Year = "";
        Month = "";
        lstEnteredProducts = [];
        Edited_SS_Code = "";
        $('#tblSecondarySalesEntered').html('');
        $('#tblSSStockistEntryHeader').html('');
        $('#dvSSEntry').show();
        $('#dvStockistList').hide();
        $('#dvShowProducts').hide();
        $('.actionButtons').hide();
        $('.plusbtn').hide();
        $('#divattachment').hide();
        $('#tblSSProductEntry').html('');
        SecondarySales.fnBindMonthAndYear();
        SecondarySales.fnGetSSEnteredDetails();
    },
    //function called from fnLoadSSEntryScreen and fnReset
    //used to bind year and month
    fnBindMonthAndYear: function () {
        SecondarySales.fnBindYear();
    },
    //binds year value( only the current year and previous year is prefilled in the dropdown)
    //drop down code is written using syncfusion controls
    fnBindYear: function () {
        debugger;
        $('#dvYear').html('');
        $('#dvYear').html('<input id="txtYear" style="width:100%;text-align:left;" />');
        var lstYear = [];

        for (var i = 0; i < 2; i++) {
            _objYearData = {};
            _objYearData.value = new Date().getFullYear() - i;
            _objYearData.label = new Date().getFullYear() - i;
            lstYear.push(_objYearData);
        }

        atcObj = new ej.dropdowns.DropDownList({
            dataSource: lstYear,
            fields: { text: 'label', value: 'value' },
            popupHeight: '200px',
            change: function () { SecondarySales.fnBindMonth(); }
        });
        atcObj.appendTo('#txtYear');
        //atcObj.index = 0;
        if (new Date().getMonth() == 0) {
            $("#txtYear").val(new Date().getFullYear() - 1);
            // $("#txtMonth").val(new Date().getMonth() - 1);
        }
        else {
            $("#txtYear").val(new Date().getFullYear());
        }
        SecondarySales.fnonloadBindMonth();
    },
    fnonloadBindMonth: function (args) {
        debugger;
        $('#dvMonth').html('');
        $('#dvMonth').html('<input id="txtMonth" style="width:100%;text-align:left;" />');
        var lstMonth = [];

        if (new Date().getMonth() == 0) {
            var year = $('#txtYear').val() - 1;
        }
        else {
            var year = $('#txtYear').val();
        }
        if (year == new Date().getFullYear()) {
            for (var i = 0; i <= new Date().getMonth() ; i++) {
                _objMonthData = {};
                _objMonthData.value = i + 1;
                _objMonthData.label = monthNames[i];
                lstMonth.push(_objMonthData);
            }
        }
        else {
            for (var i = 0; i <= 11; i++) {
                _objMonthData = {};
                _objMonthData.value = i + 1;
                _objMonthData.label = monthNames[i];
                lstMonth.push(_objMonthData);
            }
        }

        atcObj1 = new ej.dropdowns.DropDownList({
            dataSource: lstMonth,
            fields: { text: 'label', value: 'value' },
            popupHeight: '200px',
        });

        atcObj1.appendTo('#txtMonth');

        //atcObj1.value = parseInt(Month);

        if (Month != '') {
            document.querySelector("#txtMonth").ej2_instances[0].enabled = false;
        }
        var d = new Date();
        var n = d.getMonth();
        if (n == 0) {
            var d = 11;
        }
        else {
            var d = n - 1;
        }
        atcObj1.index = d;
    },
    //for current year months are bounded upto the current month.
    //for previous year all the months are bounded
    //drop down code is written using syncfusion controls
    fnBindMonth: function (args) {
        debugger;
        $('#dvMonth').html('');
        $('#dvMonth').html('<input id="txtMonth" style="width:100%;text-align:left;" />');
        var lstMonth = [];

        // if (new Date().getMonth() == 0) {
        var year = $('#txtYear').val();
        //}

        if (year == new Date().getFullYear()) {
            for (var i = 0; i <= new Date().getMonth() ; i++) {
                _objMonthData = {};
                _objMonthData.value = i + 1;
                _objMonthData.label = monthNames[i];
                lstMonth.push(_objMonthData);
            }
        }
        else {
            for (var i = 0; i <= 11; i++) {
                _objMonthData = {};
                _objMonthData.value = i + 1;
                _objMonthData.label = monthNames[i];
                lstMonth.push(_objMonthData);
            }
        }

        atcObj1 = new ej.dropdowns.DropDownList({
            dataSource: lstMonth,
            fields: { text: 'label', value: 'value' },
            popupHeight: '200px',
        });

        atcObj1.appendTo('#txtMonth');

        //atcObj1.value = parseInt(Month);

        if (Month != '') {
            document.querySelector("#txtMonth").ej2_instances[0].enabled = false;
        }
        var d = new Date();
        var n = d.getMonth();
        if (year == new Date().getFullYear()) {
            if (n == 0) {
                var d = 0;
            }
            else {
                var d = n - 1;
            }
        }
        else {
            if (n == 0) {
                var d = 11;
            }
            else {
                var d = n - 1;
            }
        }
        atcObj1.index = d;
    },
    //validates whether month is selected or not.
    //if selected then api called for getting stockist list.
    //SP Used : SP_HD_GetStockistList
    //Api Success callback hits fnGetStockistListSuccessCallback
    fnGetStockistList: function () {
        debugger;
        $('#dvAjaxLoad').show()
        SS_Periodic_Lock = true;
        if ($('#txtMonth').val() == '') {
            swal('Info', 'Please Select Month', 'info');
            return false;
            $('#dvAjaxLoad').hide()
        }
        else {
            document.querySelector("#txtYear").ej2_instances[0].enabled = false;
            document.querySelector("#txtMonth").ej2_instances[0].enabled = false;
            $('#datepicker').datepicker("destroy");
            Year = $("#txtYear").val();
            //$("select[name='txtYear']").val();
            Month = $("select[name='txtMonth']").val();
            if (Month.length == 1) {
                Month = "0" + Month;
            }
            Generated_Date = Year + '-' + Month + '-' + '01'
            var details = SecondarySales.defaults.Company_Code + '/' + Selected_Region_Code + '/' + Generated_Date + '/' + SecondarySales.defaults.LogRegionCode;
            SSCoreREST.requestInvoke('api/GetStockistList', details, null, "GET", SecondarySales.fnGetStockistListSuccessCallback, SecondarySales.fnGetStockistListFailureCallback, null);
        }
    },
    //binds obtained stockist list using syncfusion control
    //if not stockist found then throws alert
    fnGetStockistListSuccessCallback: function (response) {
        $('#dvAjaxLoad').hide()
        debugger;
        if (response.Response.obj.Lock_Status != 0) {
            var lstStockist = [];
            $('#dvStockist').html('');
            $('#dvStockist').html('<input id="txtStockist" style="width:100%;text-align:left;" />');
            atcObj2 = new ej.dropdowns.DropDownList({
                fields: { text: 'label', value: 'value' },
                popupHeight: '300px',
            });
            if (response.Response.lststockiestdetails.length > 0) {
                for (var i = 0; i < response.Response.lststockiestdetails.length; i++) {
                    _objStockistData = {};
                    _objStockistData.value = response.Response.lststockiestdetails[i].Customer_Code;
                    _objStockistData.label = response.Response.lststockiestdetails[i].Customer_Name;
                    lstStockist.push(_objStockistData);
                }
                atcObj2.dataSource = lstStockist;
            } else {
                atcObj2.dataSource = [];
            }
            atcObj2.appendTo('#txtStockist');
            if (response.Response.length == 0) {
                document.querySelector("#txtYear").ej2_instances[0].enabled = true;
                document.querySelector("#txtMonth").ej2_instances[0].enabled = true;
                swal('Info', 'No Stockist mapped to the selected region. Please contact Swaas Support.', 'info');
                return false;
            }
            else {
                $('#dvStockistList').show();
            }
        }
        else {
            swal('Info', 'Your Secondary Sales is locked for this Period', 'info');
            SecondarySales.fnReset();
            SS_Periodic_Lock = false;
            return false;

        }
    },
    fnGetStockistListFailureCallback: function (response) {
        $('#dvAjaxLoad').hide()
    },
    //api call for getting all stockist entered in current year and previous year that are part of the selected region.
    //SP Used : SP_HD_Entered_Stockist_List
    //calls function fnGetEnteredStockistListSuccessCallback on success
    fnGetSSEnteredDetails: function () {
        debugger;
        var details = SecondarySales.defaults.Company_Code + '/' + Selected_Region_Code + '/null';
        SSCoreREST.requestInvoke('api/GetEnteredStockistList', details, null, "GET", SecondarySales.fnGetEnteredStockistListSuccessCallback, SecondarySales.fnGetEnteredStockistListFailureCallback);
    },
    //binds the fetched data to display in the form of tale using syncfusion grid
    //table displayed in SS Entry History tab
    //has option to edit drafted, unapproved records.
    //has option to view entered product details for a given Secondary Sales
    fnGetEnteredStockistListSuccessCallback: function (response) {
        debugger;
        $('#tblSecondarySalesEntered').html('');
        if (response.Count > 0) {
            g_secondarySalesHeaderDetails = response.Response;
            var grid = new ej.grids.Grid({
                dataSource: response.Response,
                allowPaging: true,
                allowGrouping: true,
                allowSorting: true,
                allowFiltering: true,
                allowResizing: true,
                allowCellMerging: true,
                allowScrolling: true,
                allowExcelExport: true,
                height: 400,
                gridLines: 'Both',
                pageSettings: { pageSize: 10, pageSizes: [10, 20, 30, 40, 50], pageCount: 10 },
                filterSettings: { type: 'CheckBox' },
                toolbar: ['Search'],
                aggregates: [],
                columns: [
                    { headerText: 'Edit', template: "<a href=#;>Edit</a>", width: 100, textAlign: 'center' },
                    { headerText: 'View', template: "<a href=#;>View</a>", width: 100, textAlign: 'center' },
                    { field: 'Stockist_Name', headerText: 'Stockist Name', width: 250, textAlign: 'center' },
                    { field: 'SS_Statement_Date', headerText: 'Statement Date', width: 150, textAlign: 'center' },
                    { field: 'Region_Name', headerText: 'Region Name', width: 120, textAlign: 'center' },
                    { field: 'User_Name', headerText: 'Entered User Name', width: 120, textAlign: 'center' },
                    { field: 'Sales_Amount', headerText: 'Total Sales Amount', width: 120, textAlign: 'center' },
                    //{ field: 'Sales_Amount', headerText: 'Purchase Amount', width: 120, textAlign: 'center' },
                    //{ field: 'Sales_Amount', headerText: 'Opening Balance Amount', width: 120, textAlign: 'center' },
                    { field: 'Closing_Amount', headerText: 'Total closing Amount', width: 120, textAlign: 'center' },
                    { field: 'Year', headerText: 'Year', width: 120, textAlign: 'center' },
                    { field: 'Month', headerText: 'Month', width: 120, textAlign: 'center' },
                    { field: 'SS_Status', headerText: 'Status', width: 150, textAlign: 'center' },
                    { headerText: 'Attachment', template: "<a href=#;>Attachment</a>", width: 100, textAlign: 'center' },
                    { field: 'Remarks', headerText: 'Approval/Unapproval Remarks', width: 300, textAlign: 'center' },

                ],
                queryCellInfo: SecondarySales.queryCellInfo,
            });
            grid.appendTo('#tblSecondarySalesEntered');
        }
    },
    fnGetEnteredStockistListFailureCallback: function (response) {
        debugger;
    },
    queryCellInfo: function (args) {
        if (args.column.headerText == "View") {
            if (args.cell.innerText == "View") {
                args.cell.innerHTML = "<a href='#' onclick='SecondarySales.fnViewSS(\"" + args.data.SS_Code + "\");'>View</a>";
            }
        }
        if (args.column.headerText == "Edit") {
            if (args.data.SS_Status == "Draft" || args.data.SS_Status == "Unapproved") {
                args.cell.innerHTML = "<a href='#' onclick='SecondarySales.fnEditStockist(\"" + args.data.SS_Code + "\",\"" + args.data.Stockist_Code + "\",\"" + args.data.SS_Statement_Date + "\",\"" + args.data.Year + "\",\"" + args.data.Month + "\");'>Edit</a>";
            }

            else {
                args.cell.innerHTML = "<a></a>";
            }
        }
        if (args.column.headerText == "Attachment") {
            if (args.cell.innerText == "Attachment") {

                args.cell.innerHTML = "<a href='#' onclick='SecondarySales.fnAttachment(\"" + args.data.Stockist_Code + "\",\"" + args.data.Month + "\",\"" + args.data.Year + "\");'>DownLoad Attachment</a>";

            }
            if (args.data.Attachments == null || args.data.Attachments == "")
                args.cell.innerHTML = "<a></a>";
            //    else {
            //        args.cell.innerHTML ="<a></a>";

            //}
            //    else {
            //        args.cell.innerHTML = "<a></a>";



        }


    },
    //function to get product list.
    //before getting the product list validation for Secondary Sales Entry takes palce.
    //Api call made when validation is a success for getting product list.
    //SP Used : SP_HD_GetProductList
    //calls function fnGetProductListSuccessCallback on success
    //once sucess call back function is executed calls fnGetSSEntryTable to load the SS Entry Table.
    fnGetProductList: function () {
        debugger;
        if ($('#txtStockist').val() == '') {
            swal('Info', 'Please select Stockist.', 'info');
            return false;
        }
        else {
            document.querySelector("#txtStockist").ej2_instances[0].enabled = false;
            SecondarySales.fnValidateSecondarySalesEntry();
            stockCode = $("select[name='txtStockist']").val();
            if (valid) {
                var details = SecondarySales.defaults.Company_Code + '/' + Selected_Region_Code + '/' + SecondarySales.defaults.LogRegionCode + '/' + $("select[name='txtStockist']").val() + '/' + price_Group + '/' + $("#txtYear").val() + '/' + $("select[name='txtMonth']").val();//$("select[name='txtYear']").val()
                SecondarySales.fnGetStockistSSEntryHeader($("select[name='txtStockist']").val());
                SSCoreREST.requestInvoke('api/GetProductList', details, null, "GET", SecondarySales.fnGetProductListSuccessCallback, SecondarySales.fnGetProductListFailureCallback);
                SecondarySales.fnGetSSEntryTable();
            }
        }
    },
    //calculation of purchase and purchase return column values
    //list obtained after calculation of purchase and purchase return column gets bounded to product_List global variable.
    //selectable calendar date range is set between 1st of selected month and year to current date and bounded to statement date datepicker.
    fnGetProductListSuccessCallback: function (response) {
        $("select[name='txtStockist']").attr('readonly', 'readonly');
        product_Name_List = [];
        product_List = response.Response;
        for (var i = 0; i < product_List.length; i++) {
            var op = product_List[i].Purchase.replace(/\d+/g, '');
            if (op.indexOf('+') >= 0) {
                product_List[i].Purchase = eval(product_List[i].Purchase);
            }
            else {
                product_List[i].Purchase = -(eval(product_List[i].Purchase));
            }
            op = "";
            op = product_List[i].Purchase_Return.replace(/\d+/g, '');
            if (op.indexOf('+') >= 0) {
                product_List[i].Purchase_Return = eval(product_List[i].Purchase_Return);
            }
            else {
                product_List[i].Purchase_Return = -(eval(product_List[i].Purchase_Return));
            }

        }
        var content = [];
        if (product_List.length > 0) {
            for (var i = 0; i < product_List.length; i++) {
                var _ObjTemp = {
                    label: product_List[i].Product_Name,
                    Id: product_List[i].Product_Code
                };
                product_Name_List.push(_ObjTemp);
            }
        }
        $('#dvShowProducts').show();
        $('#datepicker').datepicker({
            minDate: new Date(Generated_Date),
            maxDate: '0',
            dateFormat: 'dd-mm-yy'
        });
    },
    fnGetProductListFailureCallback: function (response) {
    },
    //api call made to get history of Secondary Sales Entry made for the selected stockist in the current year and the previous year.
    //SP Used : SP_HD_Entered_Stockist_List
    //Api success callback hits fnGetStockistSSEntryHeaderSuccessCallback function
    fnGetStockistSSEntryHeader: function (Stockist_Code) {
        debugger;
        var details = SecondarySales.defaults.Company_Code + '/' + Selected_Region_Code + '/' + Stockist_Code;
        SSCoreREST.requestInvoke('api/GetEnteredStockistList', details, null, "GET", SecondarySales.fnGetStockistSSEntryHeaderSuccessCallback, SecondarySales.fnGetStockistSSEntryHeaderFailureCallback);
    },
    //binds the Stockist Entered history for the curent year and previous year using Syncfusion grid
    //option to view entered product details.
    fnGetStockistSSEntryHeaderSuccessCallback: function (response) {
        debugger;
        $('#tblSSStockistEntryHeader').html('');
        if (response.Count > 0) {
            g_secondarySalesHeaderDetails = response.Response;
            var grid1 = new ej.grids.Grid({
                dataSource: response.Response,
                allowPaging: true,
                allowGrouping: true,
                allowSorting: true,
                allowFiltering: true,
                allowResizing: true,
                allowCellMerging: true,
                allowScrolling: true,
                allowExcelExport: true,
                height: 400,
                gridLines: 'Both',
                pageSettings: { pageSize: 10, pageSizes: [10, 20, 30, 40, 50], pageCount: 10 },
                filterSettings: { type: 'CheckBox' },
                toolbar: ['Search'],
                aggregates: [],
                columns: [
                    { field: 'Stockist_Name', headerText: 'Stockist Name', width: 250, textAlign: 'center' },
                    { field: 'SS_Statement_Date', headerText: 'Statement Date', width: 150, textAlign: 'center' },
                    { field: 'Region_Name', headerText: 'Region Name', width: 120, textAlign: 'center' },
                    { field: 'User_Name', headerText: 'Entered User Name', width: 120, textAlign: 'center' },
                    { field: 'Sales_Amount', headerText: 'Total Sales Amount', width: 120, textAlign: 'center' },
                    { field: 'Closing_Amount', headerText: 'Total closing Amount', width: 120, textAlign: 'center' },
                    { field: 'Year', headerText: 'Year', width: 120, textAlign: 'center' },
                    { field: 'Month', headerText: 'Month', width: 120, textAlign: 'center' },
                    { headerText: 'View', template: "<a href=#;>View</a>", width: 100, textAlign: 'center' },
                    { field: 'SS_Status', headerText: 'Status', width: 150, textAlign: 'center' },
                     { headerText: 'Attachment', template: "<a href=#;>Attachment</a>", width: 100, textAlign: 'center' },

                ],
                queryCellInfo: SecondarySales.queryCellInfo,

            });
            grid1.appendTo('#tblSSStockistEntryHeader');
            var prefillUrl = $.grep(g_secondarySalesHeaderDetails, function (v) {
                return v.Stockist_Code == atcObj2.value && v.Month == monthNames[atcObj1.value - 1] && v.Year == atcObj.value;
            });

            if (prefillUrl != null && prefillUrl.length > 0) {
                gobfile = '';
                gobfile = prefillUrl[0].Attachments;
                $("#fileUrl").html(prefillUrl[0].Attachments.split('/').reverse()[0]);
            }
        }
    },


    fnAttachment: function (SS_Code, month, year) {
        debugger;
        var data = g_secondarySalesHeaderDetails;

        var objAttachment = $.grep(data, function (v) {
            return v.Stockist_Code == SS_Code && v.Month == month && v.Year == year;
        });

        if (objAttachment.length > 0 && objAttachment != null) {
            var attachment = "";
            if (objAttachment[0].Attachments != "") {
                window.open(objAttachment[0].Attachments, "_blank");
                //var extension = objAttachment[0].Attachments.split('.');
                //extension = extension.reverse();
                //if (extension[0] == "jpg" || extension[0] == "png") {
                //    attachment += '<img src="' + objAttachment[0].Attachments + '" />';
                //    $('#AttachmentBody').html(attachment);
                //    $('#Attachment').modal('toggle');
            }

            else {

                $('#AttachmentBody tbody').html('');
            }


        }
        else {
            $('#AttachmentBody').html("");
        }
    },

    //called before getting product list.
    //api call made to get Privileges mapped
    //SP Used : SP_HD_GetSSPrivileges
    //Api Success call back hits fnValidateSecondarySalesEntrySuccessCallback
    fnValidateSecondarySalesEntry: function () {
        debugger;
        Generated_Date = $("#txtYear").val() + '-' + $("select[name='txtMonth']").val() + '-' + '01';//$("select[name='txtYear']").val()
        var details = SecondarySales.defaults.Company_Code + '/' + $("select[name='txtStockist']").val() + '/' + Selected_Region_Code + '/' + SecondarySales.defaults.LogRegionCode + '/' + SecondarySales.defaults.LogUserCode + '/' + Generated_Date;
        SSCoreREST.requestInvoke('api/GetSSPrivileges', details, null, "GET", SecondarySales.fnValidateSecondarySalesEntrySuccessCallback, SecondarySales.fnValidateSecondarySalesEntryFailureCallback);
    },
    //validiton done based on privilege list obtained
    //if all the privileges are mapped then calls fnCheckForSSEntry for next set of validations
    fnValidateSecondarySalesEntrySuccessCallback: function (response) {
        debugger;
        var privilege = "";
        check_Mandatory_Privilege = true;
        privilege_List = response.Response;
        privilege = $.grep(response.Response, function (ele, index) {
            return ele.Privilege_Name == "PRICE_GROUP";
            console.log(privilege);
        });
        if ($.grep(response.Response, function (ele, index) {
            return ele.Privilege_Name == "SS_COMPUTED_FIELD_EDITABLE";
        }).length > 0) {
            if ($.grep(response.Response, function (ele, index) {
            return ele.Privilege_Name == "SS_COMPUTED_FIELD_EDITABLE";
            })[0].Privilege_Value == "YES") {
                Compute_Field_Editable = true;
            }
        }
        if ($.grep(response.Response, function (ele, index) {
            return ele.Privilege_Name == "SS_PRIMARYSALES_PREFILL_COLUMN_EDITABLE";
        }).length > 0) {
            if ($.grep(response.Response, function (ele, index) {
            return ele.Privilege_Name == "SS_PRIMARYSALES_PREFILL_COLUMN_EDITABLE";
            })[0].Privilege_Value == "YES") {
                Purchase_Editable = true;
            }
        }
        if ($.grep(response.Response, function (ele, index) {
            return ele.Privilege_Name == "SS_OPENING_BALANCE_EDITABLE";
        }).length > 0) {
            if ($.grep(response.Response, function (ele, index) {
            return ele.Privilege_Name == "SS_OPENING_BALANCE_EDITABLE";
            })[0].Privilege_Value == "YES") {
                Opening_Editable = true;
            }
        }

        if ($.grep(response.Response, function (ele, index) {
                    return ele.Privilege_Name == "ALLOW_SS_SEQUENTIAL_ENTRY";
        }).length > 0) {
            if ($.grep(response.Response, function (ele, index) {
            return ele.Privilege_Name == "ALLOW_SS_SEQUENTIAL_ENTRY";
            })[0].Privilege_Value == "YES") {
                SEQUENCE_ENTRY = true;
            }
        }
        if (privilege.length == 0) {
            swal('Info', 'Price Group is not mapped. Please contact SwaaS Support.', 'info');
            check_Mandatory_Privilege = false;
            valid = false;
            return false;
        }
        else {
            price_Group = privilege[0].Privilege_Value;
            privilege = $.grep(response.Response, function (ele, index) {
                return ele.Privilege_Name == "SS_FORMULA_V1";
                console.log(privilege);
            });
            if (privilege.length == 0) {
                swal('Info', 'SS_FORMULA_V1 Privilege is not mapped. Please contact SwaaS Support.', 'info');
                check_Mandatory_Privilege = false;
                valid = false;
                return false;
            }
            else {
                privilege = $.grep(response.Response, function (ele, index) {
                    return ele.Privilege_Name == "SS_WHAT_TO_COMPUTE";
                    console.log(privilege);
                });
                if (privilege.length == 0) {
                    swal('Info', 'SS_WHAT_TO_COMPUTE Privilege is not mapped. Please contact SwaaS Support.', 'info');
                    check_Mandatory_Privilege = false;
                    valid = false;
                    return false;
                }
                else {
                    SecondarySales.fnCheckForSSEntry();
                }
            }
        }
    },
    fnValidateSecondarySalesEntryFailureCallback: function (response) {
    },
    //Api called made to check for validations
    //Validation logic written in SP
    //SP Used : SP_HD_CheckForSSEntry
    //Api success callback calls fnCheckForSSEntrySuccessCallback
    fnCheckForSSEntry: function () {
        debugger;
        var details = SecondarySales.defaults.Company_Code + '/' + $("select[name='txtStockist']").val() + '/' + $("#txtYear").val() + '/' + $("select[name='txtMonth']").val();//$("select[name='txtYear']").val()
        SSCoreREST.requestInvoke('api/CheckForSSEntry', details, null, "GET", SecondarySales.fnCheckForSSEntrySuccessCallback, SecondarySales.fnCheckForSSEntryFailureCallback);
    },
    //two types of resposne obtained either "NO ISSUE" or some other statement.
    //response displayed in the form of alert if "NO ISSUE" is not received as response
    //if response received as "NO ISSUE" then function fnCheckForMonthsToBeSkipped called for next set of validation
    fnCheckForSSEntrySuccessCallback: function (response) {
        debugger;
        if (response.Response != "NO ISSUE") {
            swal('Info', response.Response, 'info');
            valid = false;
            return false;
        }
        else {
            if (Edited_SS_Code == '') {
                SecondarySales.fnCheckForMonthsToBeSkipped();
            }
            else {
                valid = true;
                return valid;
            }
        }
    },
    fnCheckForSSEntryFailureCallback: function (response) {
    },
    //Api called for getting months skipped details
    //SP Used : SP_HD_SS_Skipped_Months
    //Api success call back hits function fnCheckForMonthsToBeSkippedSuccessCallback
    fnCheckForMonthsToBeSkipped: function () {
        debugger;
        var details = SecondarySales.defaults.Company_Code + '/' + $("select[name='txtStockist']").val() + '/' + $("#txtYear").val() + '/' + $("select[name='txtMonth']").val() + '/' + SecondarySales.defaults.LogRegionCode;// $("select[name='txtYear']").val()
        SSCoreREST.requestInvoke('api/CheckForMonthsToBeSkipped', details, null, "GET", SecondarySales.fnCheckForMonthsToBeSkippedSuccessCallback, SecondarySales.fnCheckForMonthsToBeSkippedFailureCallback);
    },
    //displays confirmation alert if there is atleast one month skipped between two Secondary Sales Entries.
    //all validations are considered pass if the confirmation alert is not displayed 
    //or the user clicks on OK in the confirmation alert box.
    //if alert displayed and user selects cancel then validation fails

    fnCheckForMonthsToBeSkippedSuccessCallback: function (response) {
        debugger;
        var next_month = "";
        var next_year = "";
        if (response.Response.length > 0) {
            if (response.Response[0].Month == 12) {
                next_year = response.Response[0].Year + 1;
                next_month = "1";
            }
            else {
                next_year = response.Response[0].Year;
                next_month = response.Response[0].Month + 1;
            }
            if ($.grep(privilege_List, function (ele, index) {
                                return ele.Privilege_Name == "ALLOW_SS_SEQUENTIAL_ENTRY";
            }).length > 0) {
                if ($.grep(privilege_List, function (ele, index) {
                return ele.Privilege_Name == "ALLOW_SS_SEQUENTIAL_ENTRY";
                })[0].Privilege_Value == "YES") {
                    SEQUENCE_ENTRY = true;
                }
            }
            if (SEQUENCE_ENTRY == true && response.Response[0].result == 'False') {
                $("#tblSSProductEntry").hide();
                $("#tblSSStockistEntryHeader").hide();
                $('.actionButtons').hide();
                $('.actionButtons').hide();
                $('.btn-circle').hide();
                $('#dvDraftAndSave').hide();
                $('#btnShowProducts').hide()
                $('.plusbtn').hide();
                $('#divattachment').hide();
                swal('Info', 'You cannot enter the Secondary Sales for This Month  , Because of  Sequential Entry', 'info');
                return false;
            }

            else {
                $("#tblSSProductEntry").show();
                $("#tblSSStockistEntryHeader").show();
                $('.actionButtons').show();
                $('.btn-circle').show();
                $('#dvDraftAndSave').show();
                $('#btnShowProducts').show();
                if (next_year == $("#txtYear").val()) {//$("select[name='txtYear']").val()
                    if (next_month != $("select[name='txtMonth']").val()) {
                        if (!confirm('You have not entered Secondary Sales from ' + next_year + '-' + monthNames[next_month - 1] + ' to ' + $("#txtYear").val() + '-' + monthNames[$("select[name='txtMonth']").val() - 2] + ' for ' + $('#txtStockist').val() + '.If you wish to continue click OK. Otherwise click Cancel')) {//$("select[name='txtYear']").val()
                            valid = false;
                            return valid;
                        }
                        else {
                            valid = true;
                            return valid;
                        }
                    }
                    else {
                        valid = true;
                        return valid;
                    }
                }
                else {
                    if ($("select[name='txtMonth']").val() == "1") {
                        if (!confirm('You have not entered Secondary Sales from ' + next_year + '-' + monthNames[next_month - 1] + ' to ' + next_year + '-' + monthNames[11] + ' for ' + $('#txtStockist').val() + '.If you wish to continue click OK. Otherwise click Cancel')) {
                            valid = false;
                            return valid;
                        }
                        else {
                            valid = true;
                            return valid;
                        }
                    } else {
                        if (!confirm('You have not entered Secondary Sales from ' + next_year + '-' + monthNames[next_month - 1] + ' to ' + $("#txtYear").val() + '-' + monthNames[$("select[name='txtMonth']").val() - 2] + ' for ' + $('#txtStockist').val() + '.If you wish to continue click OK. Otherwise click Cancel')) {//$("select[name='txtYear']").val()
                            valid = false;
                            return valid;
                        }
                        else {
                            valid = true;
                            return valid;
                        }
                    }
                }
            }
            //else {
            //    valid = true;
            //    return valid;
            //}
        }
        else {
            valid = true;
            return valid;
        }

    },
    fnCheckForMonthsToBeSkippedFailureCallback: function (response) {
    },
    fnViewSS: function (SS_Code) {
        debugger;

        var element = $.grep(g_secondarySalesHeaderDetails, function (ele, index) {
            return ele.SS_Code == SS_Code;
        });
        $('#SckstName').html(element[0].Stockist_Name);
        $('#SMonth').html(element[0].Month);
        $('#SYear').html(element[0].Year);
        var details = SecondarySales.defaults.Company_Code + '/' + SS_Code;
        SSCoreREST.requestInvoke('api/GetSSStockistDetails', details, null, "GET", SecondarySales.fnViewSS_SuccessCallback, SecondarySales.fnViewSS_FailureCallback);
    },
    fnViewSS_SuccessCallback: function (Jdata) {
        var response = Jdata.Response;
        $('#SS_Details').html('');
        var content = ''
        var Opening_Balance = 0, Purchase = 0, Sales = 0, Sales_Amount = 0, Closing_Balance = 0, Closing_Amount = 0;


        content += '<div class="tableFixHead">';
        content += ' <table>';
        content += '<thead>';
        content += '<tr>';
        content += '<th class="collong">Product Name</th>';
        content += '<th class="colshort">Product Price</th>';
        content += '<th class="colshort">Opening Balance</th>';
        content += '<th class="colshort">Purchase </th>';
        content += '<th class="colshort">Purchase Return</th>';
        content += '<th class="colshort">Sales</th>';
        content += '<th class="colshort">Sales Return</th>';
        content += '<th class="colshort">Sales Amount</th>';
        content += '<th class="colshort">Closing Balance</th>';
        content += '<th class="colshort">Closing Amount</th>';
        content += '<th class="colshort">Transit</th>';
        content += '<th class="colshort">Free Goods</th>';
        content += '<th class="colshort">Damaged Goods</th>';
        content += '<th class="colshort">Expired Goods</th>';
        content += '<th class="colshort">Product Remarks</th>';
        content += '</tr>';
        content += '</thead>';
        content += '<tbody>';
        for (var i = 0; i < response.length; i++) {

            content += '<tr>';
            content += '<td class="collong">' + response[i].Product_Name + '</td>';
            content += '<td class="colshort">' + response[i].Product_Price + '</td>';
            content += '<td class="colshort">' + response[i].Opening_Stock + '</td>';
            content += '<td class="colshort">' + response[i].Purchase + '</td>';
            content += '<td class="colshort">' + response[i].Purchase_Return + '</td>';
            content += '<td class="colshort">' + response[i].Sales + '</td>';
            content += '<td class="colshort">' + response[i].Sales_Return + '</td>';
            content += '<td class="colshort">' + response[i].Sales_Amount + '</td>';
            content += '<td class="colshort">' + response[i].Closing_Balance + '</td>';
            content += '<td class="colshort">' + response[i].Closing_Amount + '</td>';
            content += '<td class="colshort">' + response[i].Transit + '</td>';
            content += '<td class="colshort">' + response[i].Free_Goods + '</td>';
            content += '<td class="colshort">' + response[i].Damaged_Goods + '</td>';
            content += '<td class="colshort">' + response[i].Expired_Goods + '</td>';
            content += '<td class="colshort">' + response[i].Remarks + '</td>';
            content += '</tr>';
            // Opening_Balance = Opening_Balance + (response[i].Opening_Balance)
            // Purchase = Purchase + (response[i].Purchase);
            //Sales = Sales + (response[i].Sales);
            Sales_Amount = Sales_Amount + (response[i].Sales_Amount)
            // Closing_Balance = Closing_Balance + (response[i].Closing_Balance)
            Closing_Amount = Closing_Amount + (response[i].Closing_Amount);
        }
        content += '<tr>';
        content += '<td class="col1">Total</td>';
        content += '<td class="col2"></td>';
        content += '<td class="col2"></td>';
        content += '<td class="col2"></td>';
        content += '<td class="col2"></td>';
        content += '<td class="col2"></td>';
        content += '<td class="col2"></td>';
        content += '<td class="col2">' + Sales_Amount.toFixed(2) + '</td>';//.toFixed(2) 
        content += '<td class="col2"></td>';
        content += '<td class="col2">' + Closing_Amount.toFixed(2) + '</td>';//.toFixed(2) 
        content += '<td class="col2"></td>';
        content += '<td class="col2"></td>';
        content += '<td class="col2"></td>';
        content += '<td class="col2"></td>';
        content += '<td class="col2"></td>';
        content += '</tr>';
        content += ' </tbody>';
        content += ' </table>';
        content += '</div>';



        $('#SS_Details').html(content);
        $("#myModal").modal('show');





    },
    fnViewSS_FailureCallback: function (response) {
    },
    queryViewSSCellInfo: function (args) {
        if (args.column.headerText == "Product Remarks") {
            if (args.cell.innerText == "null") {
                args.cell.innerHTML = "<a>No Remarks</a>";
            }
        }
    },
    fnShowProductList: function () {
        debugger;
        $('#Product_Details').html('');
        var content = "";
        if (product_List.length > 0) {

            content += '<table class="table table-responsive" style="overflow:none !important;">';
            content += '<thead>';
            content += '<tr class="bg-info text-white" style="font-size: 16px;">';
            var p_Exists = $.grep(privilege_List, function (v) {
                return v.Privilege_Name == "SS_ENTRY_PRODUCT_CHECK_V1";
            })
            //if (p_Exists.length == 0) {
            content += '<th><div class="custom-control custom-checkbox align-top"><input type="checkbox" class="custom-control-input align-top" value="41011" id="selectAllProducts"><label class="custom-control-label" for="selectAllProducts" onclick="SecondarySales.fnSelectAll();"></label></div></th>';
            //}
            //else {
            //    content += '<th></th>';
            //}
            content += '<th>Product Name</th>';
            content += '<th>Opening Balance</th>';
            content += '<th>Product Price</th>';
            content += '</tr>';
            content += '</thead>';
            content += "<tbody>";
            for (var i = 0; i < product_List.length; i++) {
                content += "<tr class='font_class'>";
                if ($.inArray(product_List[i].Product_Code, lstEnteredProducts) == -1) {
                    content += "<td><div class='custom-control custom-checkbox align-top productShowGrid' onclick='SecondarySales.fnRemoveValueFromArr(this,\"" + i + "\",\"" + product_List[i].Product_Code + "\")'><input type='checkbox' class='custom-control-input align-top' value='" + product_List[i].Product_Code + "' id='Produt_" + i + "'><label class='custom-control-label' for='Produt_" + i + "'></label></div></td>";
                }
                else {
                    if (product_List[i].Is_Mandatory == 1) {
                        content += "<td><div class='custom-control custom-checkbox align-top productShowGrid' onclick='SecondarySales.fnRemoveValueFromArr(this,\"" + i + "\",\"" + product_List[i].Product_Code + "\")'><input type='checkbox' checked class='custom-control-input align-top' value='" + product_List[i].Product_Code + "' id='Produt_" + i + "' disabled><label class='custom-control-label' for='Produt_" + i + "'></label></div></td>";
                    }
                    else {
                        content += "<td><div class='custom-control custom-checkbox align-top productShowGrid' onclick='SecondarySales.fnRemoveValueFromArr(this,\"" + i + "\",\"" + product_List[i].Product_Code + "\")'><input type='checkbox' checked class='custom-control-input align-top' value='" + product_List[i].Product_Code + "' id='Produt_" + i + "'><label class='custom-control-label' for='Produt_" + i + "'></label></div></td>";
                    }
                }
                content += "<td>" + product_List[i].Product_Name + "</td>";
                content += "<td>" + product_List[i].Opening_Balance + "</td>";
                content += "<td>" + product_List[i].Product_Price + "</td>";
                content += "</tr>";
            }
            content += "</tbody>";
            content += "</table>";
        }
        $('#Product_Details').html(content);
        $('#productModal').show();
    },
    fnRemoveValueFromArr: function (Id, rowId, productCode) {
        debugger;
        if ($('#Produt_' + rowId).prop("checked") == false) {
            if (!($.inArray(productCode, lstEnteredProducts) == -1)) {
                lstCheckMappedProd.push(productCode);
                lstUnMappedProducts.push(productCode);
            }
            lstEnteredProducts = lstEnteredProducts.filter(function (item) {
                return item !== productCode;
            });

        }
        else {
            lstUnMappedProducts = lstUnMappedProducts.filter(function (item) {
                return item !== productCode;
            });

            if (!($.inArray(productCode, lstCheckMappedProd) == -1)) {
                lstEnteredProducts.push(productCode);
            }
            lstCheckMappedProd = lstCheckMappedProd.filter(function (item) {
                return item !== productCode;
            });
        }
    },
    fnPopViewProductsQueryCell: function (args) {
        if (args.column.headerText == "Select") {
            if ($.inArray(args.data.Product_Code, lstEnteredProducts) != -1) {
                args.cell.innerHTML = '<div class="e-checkbox-wrapper e-css"><input class="e-checkselect e-focus" type="checkbox"><span class="e-frame e-icons e-check"></span><span class="e-label"> </span></div>'
            }
        }
    },
    fnPrefillSelectedProducts: function (mode, binddata) {
        debugger;
        var selectedData = "";
        var bindProduct = false;
        Insert_Mode = mode;
        if (mode == 'ShowAllProduct') {
            var lst = [];
            for (var i = 0; i < product_List.length; i++) {
                if ($("#Produt_" + i).prop('checked') == false) {
                    var productCode = product_List[i].Product_Code;
                    if (!($.inArray(productCode, lstEnteredProducts) == -1)) {
                        lstCheckMappedProd.push(productCode);
                    }
                    lstEnteredProducts = lstEnteredProducts.filter(function (item) {
                        return item !== productCode;
                    });
                    lstUnMappedProducts.push(productCode);
                }
                else {
                    var productCode = product_List[i].Product_Code;
                    lstUnMappedProducts = lstUnMappedProducts.filter(function (item) {
                        return item !== productCode;
                    });
                    if (!($.inArray(productCode, lstCheckMappedProd) == -1)) {
                        lstEnteredProducts.push(productCode);
                    }
                    lstCheckMappedProd = lstCheckMappedProd.filter(function (item) {
                        return item !== productCode;
                    });
                }
            }
            $('.productShowGrid :checked').map(function () {
                var productCode = this.value;
                var disjson = $.grep(product_List, function (ele, index) {
                    return ele.Product_Code == productCode;
                });
                if ($.inArray(productCode, lstEnteredProducts) == -1) {
                    lst.push(disjson[0]);
                }
            });
            debugger;
            selectedData = lst;// grid2.getSelectedRecords();
            if (lstEnteredProducts.length == 0 && selectedData.length == 0) {
                swal('Info', 'Please Select Atleast One Product.', 'info');
                return false;
            }
            else {
                bindProduct = true;
            }
            if (lstEnteredProducts.length == 0) {
                $('#tblSSProductEntry tbody').html('');
            }
        }
        privilege = $.grep(privilege_List, function (ele, index) {
            return ele.Privilege_Name == "SS_INPUT_COLUMNS";
        });

        if (bindProduct) {
            var num = $("#tblSSProductEntry table tbody tr").length

            if ($('#tblSSProductEntry table tr').eq(num).find("#PRODUCT_NAME").val() == '') {
                $('#tblSSProductEntry table tr').eq(num).remove();
            }
            if (privilege.length != 0) {
                var content = "";
                Input_Columns = privilege[0].Privilege_Value.split(',');
                for (var i = 0; i < selectedData.length; i++) {
                    content = '';
                    content += '<tr>';

                    $("#tblSSProductEntry table tbody tr").length
                    content += '<td><input type="text" id="PRODUCT_NAME" name="Product_Name' + ($("#tblSSProductEntry table tbody tr").length + i + 1) + '" class="form-control form-control-sm product_' + ($("#tblSSProductEntry table tbody tr").length + i + 1) + '"></td>';
                    content += '<td><div style="display: flex;">';
                    var price_Edit = $.grep(privilege_List, function (v) {
                        return v.Privilege_Name == "ALLOW_SS_PRICE_EDIT";
                    });

                    if (price_Edit.length > 0) {
                        if (price_Edit[0].Privilege_Value == "YES") {
                            content += '<div><input type="number"  id="PRODUCT_PRICE" class="form-control form-control-sm" value="' + selectedData[i].Product_Price.toFixed(2) + '" step=".01"></div>';
                        }
                        else {
                            content += '<div><input type="number"  id="PRODUCT_PRICE" class="form-control form-control-sm" value="' + selectedData[i].Product_Price.toFixed(2) + '" readonly></div>';
                        }
                    }
                    else {
                        content += '<div><input type="number"  id="PRODUCT_PRICE" class="form-control form-control-sm" value="' + selectedData[i].Product_Price.toFixed(2) + '" readonly></div>';
                    }
                    var prd_Price = $.grep(product_List, function (v) {
                        return v.Product_Name == selectedData[i].Product_Name;
                    });
                    if (prd_Price.length > 0) {
                        if ($.inArray(prd_Price[0].Product_Code, lstEnteredProducts) == -1) {
                            lstEnteredProducts.push(prd_Price[0].Product_Code)
                        }
                        if (prd_Price[0].Product_Price != selectedData[i].Product_Price) {
                            content += "<div><i class='fa fa-refresh' style='padding-top: 5px; padding-left: 3px; cursor: pointer;' id='refresh'></i></div>";
                        }
                    }
                    content += '</div></td>';
                    for (var j = 0; j < Input_Columns.length; j++) {
                        var tileCase = SecondarySales.toTitleCase(Input_Columns[j].toLowerCase().replace('_', ' ')).replace(' ', '_');
                        var value = selectedData[i][tileCase] == undefined ? 0 : selectedData[i][tileCase];
                        var manually_edited = selectedData[i].Is_Manually_Edited;
                        if (Input_Columns[j] == "OPENING_BALANCE") {
                            var OBE = $.grep(privilege_List, function (v) {
                                return v.Privilege_Name == "SS_OPENING_BALANCE_EDITABLE";
                            })
                            if (OBE.length > 0) {
                                if (OBE[0].Privilege_Value == "YES") {
                                    content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01"></td>';
                                }
                                else {
                                    if (prd_Price[0].Product_Exists == 0) {
                                        content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01"></td>';
                                    }
                                    else {
                                        content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01" readonly></td>';
                                    }
                                }
                            }
                            else {
                                if (prd_Price[0].Product_Exists == 0) {
                                    content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01"></td>';
                                }
                                else {
                                    content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01" readonly></td>';
                                }
                            }
                        }
                        else {
                            if (Input_Columns[j] == "PURCHASE" || Input_Columns[j] == "PURCHASE_RETURN") {
                                var P_PR_Editable = $.grep(privilege_List, function (v) {
                                    return v.Privilege_Name == "SS_PRIMARYSALES_PREFILL_COLUMN_EDITABLE";
                                })
                                if (P_PR_Editable.length > 0) {
                                    if (P_PR_Editable[0].Privilege_Value == "YES") {
                                        content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01"></td>';
                                    }
                                    else {
                                        content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" readonly step=".01"></td>';
                                    }
                                }
                                else {
                                    content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01"></td>';
                                }
                            }
                            else {
                                debugger;
                                var CF_Editable = $.grep(privilege_List, function (v) {
                                    return v.Privilege_Name == "SS_COMPUTED_FIELD_EDITABLE";
                                })
                                if (CF_Editable.length > 0) {
                                    if (CF_Editable[0].Privilege_Value == "YES") {
                                        var WTC = $.grep(privilege_List, function (v) {
                                            return v.Privilege_Name == "SS_WHAT_TO_COMPUTE";
                                        })
                                        if (WTC.length > 0) {
                                            content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01" data=' + manually_edited + ' ></td>';
                                        }
                                    }
                                    else {
                                        var WTC = $.grep(privilege_List, function (v) {
                                            return v.Privilege_Name == "SS_WHAT_TO_COMPUTE";
                                        })
                                        if (WTC.length > 0) {
                                            if (((WTC[0].Privilege_Value == "SALES") || (WTC[0].Privilege_Value == "CLOSING_BALANCE")) && (WTC[0].Privilege_Value == Input_Columns[j])) {
                                                content += '<td><input type="number" onclick="SecondarySales.highlight(this);" id ="' + Input_Columns[j] + '" class="form-control form-control-sm computedfield" value = "' + value + '" readonly step=".01"></td>';
                                            }
                                            else {
                                                content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01"></td>';
                                            }
                                        }
                                    }
                                }
                                else {
                                    var WTC = $.grep(privilege_List, function (v) {
                                        return v.Privilege_Name == "SS_WHAT_TO_COMPUTE";
                                    })
                                    if (WTC.length > 0) {
                                        if (((WTC[0].Privilege_Value == "SALES") || (WTC[0].Privilege_Value == "CLOSING_BALANCE")) && (WTC[0].Privilege_Value == Input_Columns[j])) {
                                            content += '<td><input type="number" onclick="SecondarySales.highlight(this);" id ="' + Input_Columns[j] + '" class="form-control form-control-sm computedfield" value = "' + value + '" readonly step=".01"></td>';
                                        }
                                        else {
                                            content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01"></td>';
                                        }
                                    }
                                }
                                //else {
                                //    if (WTC != undefined) {
                                //        if (((WTC[0].Privilege_Value == "SALES") || (WTC[0].Privilege_Value == "CLOSING_BALANCE")) && (WTC[0].Privilege_Value == Input_Columns[j])) {
                                //            content += '<td><input type="number" onclick="SecondarySales.highlight(this);" id ="' + Input_Columns[j] + '" class="form-control form-control-sm computedfield" value = "' + value + '" readonly step=".01"></td>';
                                //        }
                                //    }
                                //    else {
                                //        //if (dec.indexOf(Input_Columns[j]) != -1) {
                                //        content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                //        //}
                                //        //else {
                                //        //  content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01"></td>';
                                //        //}
                                //    }
                                //}
                            }
                        }
                    }
                    // var tileCase = SecondarySales.toTitleCase(P;
                    var value = selectedData[i]["Purchase"] * selectedData[i]["Product_Price"] == undefined ? 0 : selectedData[i]["Purchase"] * selectedData[i]["Product_Price"];
                    var value1 = selectedData[i]["Opening_Balance"] * selectedData[i]["Product_Price"] == undefined ? 0 : selectedData[i]["Opening_Balance"] * selectedData[i]["Product_Price"];
                    content += '<td><input type="number" id="OPENINGBALANCE_AMOUNT" class="form-control form-control-sm OPENINGBALANCE_AMOUNT" readonly value=' + value1.toFixed(2) + ' step=".01" ></td>';
                    content += '<td><input type="number" id="PURCHASE_AMOUNT" class="form-control form-control-sm PURCHASE_AMOUNT" readonly value=' + value.toFixed(2) + ' step=".01" ></td>';
                    content += '<td><input type="number" id="SALES_AMOUNT" class="form-control form-control-sm Sales_Amount" readonly step=".01"></td>';
                    content += '<td><input type="number" id="CLOSING_BALANCE_AMOUNT" class="form-control form-control-sm Closing_Amount" readonly step=".01"></td>';
                    content += '<td><input type="text" id="REMARKS" class="form-control form-control-sm Remark"></td>';
                    if (selectedData[i].Is_Mandatory == 0) {
                        content += '<td><button type="button" id="DELETE" class="btn btn-primary btn-sm form-control form-control-sm" onclick = "SecondarySales.fnRemove(this);"><i class="fa fa-trash"></i></button></td>';
                    }
                    else {
                        content += '<td></td>';
                    }
                    content += '</tr>';

                    $('#tblSSProductEntry tbody').append(content);
                    if (mode == 'ShowAllProduct') {
                        var Is_Mand = $.grep(product_List, function (v) {
                            return v.Product_Code == selectedData[i].Product_Code;
                        });
                    }
                    else {
                        var Is_Mand = $.grep(product_List, function (v) {
                            return v.Product_Code == currentProductCode;
                        });
                    }

                    if (Is_Mand[0].Is_Mandatory == 1) {
                        var atcObj = new ej.dropdowns.AutoComplete({
                            //set the data to dataSource property
                            dataSource: product_Name_List,
                            fields: { value: 'label' },
                            enabled: false,
                            // set the placeholder to AutoComplete input element
                            placeholder: 'Search Product',
                            change: function (e) {
                                SecondarySales.fnEditChangeProductList(e);
                            }
                        });
                        atcObj.appendTo('input[name=Product_Name' + ($("#tblSSProductEntry table tbody tr").length + i) + ']');
                        atcObj.value = selectedData[i].Product_Name;
                    }
                    else {
                        var atcObj = new ej.dropdowns.AutoComplete({
                            //set the data to dataSource property
                            dataSource: product_Name_List,
                            fields: { value: 'label' },
                            // set the placeholder to AutoComplete input element
                            placeholder: 'Search Product',
                            change: function (e) {
                                SecondarySales.fnEditChangeProductList(e);
                            }
                        });
                        atcObj.appendTo('input[name=Product_Name' + ($("#tblSSProductEntry table tbody tr").length + i) + ']');
                        atcObj.value = selectedData[i].Product_Name;
                    }
                }
            }
            if (lstUnMappedProducts.length > 0) {
                for (var i = 0; i < lstUnMappedProducts.length; i++) {
                    var disjson = $.grep(product_Name_List, function (ele, index) {
                        return ele.Id == lstUnMappedProducts[i]
                    })
                    $('[value="' + disjson[0].label + '"]').parent().parent().parent().parent().remove();
                }
            }

            lstUnMappedProducts = [];
            lstCheckMappedProd = [];
        }
        $('#productModal').hide();
        SecondarySales.fnReCalculate();

    },
    fnGetandBindSelectedProducts: function (mode, binddata) {
        debugger;
        var selectedData = "";
        var bindProduct = false;
        Insert_Mode = mode;
        if (mode == 'ShowAllProduct') {
            var lst = [];
            $('.productShowGrid :checked').map(function () {
                var productCode = this.value;
                var disjson = $.grep(product_List, function (ele, index) {
                    return ele.Product_Code == productCode;
                });
                lst.push(disjson[0]);
            });
            //Product_Code: "PDC00000006"
            //Product_Name: "Adaferin Gel  (A03010)"
            //Opening_Balance: 17
            //Product_Exists: 1
            //Division_Code: "DIV00000001"
            //Product_Price: 103
            //Purchase: -0
            //Purchase_Return: -0
            selectedData = lst;
            if (lstEnteredProducts.length == 0 && selectedData.length == 0) {
                swal('Info', 'Please Select Atleast One Product.', 'info');
                return false;
            }
            else {
                bindProduct = true;
            }
        }
        else if (mode == 'Edit') {
            selectedData = binddata;
            bindProduct = true;
        }

        privilege = $.grep(privilege_List, function (ele, index) {
            return ele.Privilege_Name == "SS_INPUT_COLUMNS";
        });
        if (bindProduct) {
            if (privilege.length != 0) {
                var content = "";
                Input_Columns = privilege[0].Privilege_Value.split(',');
                var wid = Input_Columns.length;
                if (wid > 3) {
                    var C_width = '120%';
                }
                else if (wid > 5) {
                    var C_width = '130%';
                }

                else {
                    var C_width = '100%';
                }
                content += '<table class="table table-bordered" style="font-size:13px;width:' + C_width + ';">';//width:' + C_width + '; 
                content += '<thead class="thead bg-info text-white text-center">';
                content += '<tr>';
                content += '<th scope = "col" style="width:300px;"> PRODUCT NAME</th>';
                content += '<th scope = "col" style="width:140px;"> PRODUCT PRICE</th>';
                for (var i = 0; i < Input_Columns.length; i++) {
                    content += '<th scope = "col" style="width:140px;">' + Input_Columns[i].replace('_', ' ') + '</th>';
                }
                content += '<th scope = "col" style="width:100px;">OPENING BALANCE AMOUNT</th>';
                content += '<th scope = "col" style="width:100px;">PURCHASE AMOUNT</th>';
                content += '<th scope = "col" style="width:100px;">SALES AMOUNT</th>';
                content += '<th scope = "col" style="width:100px;">CLOSING BALANCE AMOUNT</th>';
                content += '<th scope = "col" style="width:150px;"> REMARKS</th>';
                content += '<th scope = "col">DELETE</th>';
                content += '</tr>';
                content += '</thead>';
                content += '<tbody>';
                content += '</tbody>';
                content += '<tfoot>';
                content += '<tr>';
                content += '<td colspan="' + (4 + Input_Columns.length) + '" style="text-align: right;"><label style="font-size: 18px;font-weight: 600;">Total</label> </td>';
                content += '<td><input type="number" id ="TOTAL_SALE_AMOUNT"  class="form-control form-control-sm" readonly step=".01"> </td>';
                content += '<td><input type="number"  id="TOTAL_CLOSING_AMOUNT" class="form-control form-control-sm" readonly step=".01"></td>';
                content += '<td colspan="2"></td>';
                content += '</tr>';
                content += '</tfoot>';
                content += '</table>';
                $('#tblSSProductEntry').html(content);
                var decimalColumn = $.grep(privilege_List, function (v) {
                    return v.Privilege_Name == "DISALLOW_DECIMAL_IN_SS";
                });
                var dec = []
                if (decimalColumn.length > 0) {
                    var val = decimalColumn[0].Privilege_Value;
                    if (val.indexOf(',') != -1) {
                        dec = decimalColumn[0].Privilege_Value.split(',');
                    }
                    else {
                        dec = decimalColumn[0].Privilege_Value;
                    }
                }
                for (var i = 0; i < selectedData.length; i++) {
                    content = '';
                    content += '<tr>';
                    content += '<td><input type="text" id="PRODUCT_NAME" name="Product_Name' + (i + 1) + '" class="form-control form-control-sm product_' + (i + 1) + '"></td>';
                    content += '<td><div style="display: flex;">';
                    var price_Edit = $.grep(privilege_List, function (v) {
                        return v.Privilege_Name == "ALLOW_SS_PRICE_EDIT";
                    });
                    if (price_Edit.length > 0) {
                        if (price_Edit[0].Privilege_Value == "YES") {
                            content += '<div><input type="number"  id="PRODUCT_PRICE" class="form-control form-control-sm" value="' + selectedData[i].Product_Price.toFixed(2) + '"></div>';
                        }
                        else {
                            content += '<div><input type="number"  id="PRODUCT_PRICE" class="form-control form-control-sm" value="' + selectedData[i].Product_Price.toFixed(2) + '" readonly></div>';
                        }
                    }
                    else {
                        content += '<div><input type="number"  id="PRODUCT_PRICE" class="form-control form-control-sm" value="' + selectedData[i].Product_Price.toFixed(2) + '" readonly></div>';
                    }
                    var prd_Price = $.grep(product_List, function (v) {
                        return v.Product_Name == selectedData[i].Product_Name;
                    });
                    if ($.inArray(prd_Price[0].Product_Code, lstEnteredProducts) == -1) {
                        lstEnteredProducts.push(prd_Price[0].Product_Code)
                    }
                    if (prd_Price.length > 0) {
                        if (prd_Price[0].Product_Price != selectedData[i].Product_Price) {
                            content += "<div><i class='fa fa-refresh' style='padding-top: 5px; padding-left: 3px; cursor: pointer;' id='refresh'></i></div>";
                        }
                    }
                    content += '</div></td>';
                    for (var j = 0; j < Input_Columns.length; j++) {
                        var tileCase = SecondarySales.toTitleCase(Input_Columns[j].toLowerCase().replace('_', ' ')).replace(' ', '_');
                        var value = selectedData[i][tileCase] == undefined ? 0 : selectedData[i][tileCase];
                        manually_edited = selectedData[i].Is_Manually_Edited;
                        if (Input_Columns[j] == "OPENING_BALANCE") {
                            var OBE = $.grep(privilege_List, function (v) {
                                return v.Privilege_Name == "SS_OPENING_BALANCE_EDITABLE";
                            })
                            if (OBE.length > 0) {
                                if (OBE[0].Privilege_Value == "YES") {
                                    if (dec.indexOf(Input_Columns[j]) != -1) {
                                        content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                    }
                                    else {
                                        content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01"></td>';
                                    }
                                }
                                else {
                                    var Open_Edit = $.grep(product_List, function (v) {
                                        return v.Product_Name == selectedData[i].Product_Name;
                                    })
                                    if (Open_Edit.length > 0) {
                                        if (Open_Edit[0].Product_Exists == 0) {
                                            if (dec.indexOf(Input_Columns[j]) != -1) {
                                                content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                            }
                                            else {
                                                content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01"></td>';
                                            }
                                        }
                                        else {
                                            content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01" readonly></td>';
                                        }
                                    }
                                }
                            }
                            else {
                                var Open_Edit = $.grep(product_List, function (v) {
                                    return v.Product_Name == selectedData[i].Product_Name;
                                })
                                if (Open_Edit.length > 0) {
                                    if (Open_Edit[0].Product_Exists == 0) {
                                        if (dec.indexOf(Input_Columns[j]) != -1) {
                                            content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                        }
                                        else {
                                            content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01"></td>';
                                        }
                                    }
                                    else {
                                        content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01" readonly></td>';
                                    }
                                }
                            }
                        }
                        else {
                            if (Input_Columns[j] == "PURCHASE" || Input_Columns[j] == "PURCHASE_RETURN") {
                                var P_PR_Editable = $.grep(privilege_List, function (v) {
                                    return v.Privilege_Name == "SS_PRIMARYSALES_PREFILL_COLUMN_EDITABLE";
                                })
                                if (P_PR_Editable.length > 0) {
                                    if (P_PR_Editable[0].Privilege_Value == "YES") {
                                        if (dec.indexOf(Input_Columns[j]) != -1) {
                                            content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                        }
                                        else {
                                            content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                        }
                                    }
                                    else {
                                        content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" readonly step=".01" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                    }
                                }
                                else {
                                    if (dec.indexOf(Input_Columns[j]) != -1) {
                                        content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                    }
                                    else {
                                        content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                    }
                                }
                            }

                            else {
                                debugger;
                                var CF_Editable = $.grep(privilege_List, function (v) {
                                    return v.Privilege_Name == "SS_COMPUTED_FIELD_EDITABLE";
                                })
                                if (CF_Editable.length > 0) {
                                    var WTC = $.grep(privilege_List, function (v) {
                                        return v.Privilege_Name == "SS_WHAT_TO_COMPUTE";
                                    })

                                    if (CF_Editable[0].Privilege_Value == "YES") {
                                        if (WTC.length > 0) {
                                            if (dec.indexOf(Input_Columns[j]) != -1) {
                                                content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" onkeypress="return fnValidateDecimal(this,event)" data=' + manually_edited + '></td>';
                                            }
                                            else {
                                                content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01" data=' + manually_edited + ' onkeypress="return fnValidateDecimal(this,event)"></td>';
                                            }
                                          
                                        }

                                    }
                                    else {
                                        if (WTC.length > 0) {
                                            if (((WTC[0].Privilege_Value == "SALES") || (WTC[0].Privilege_Value == "CLOSING_BALANCE")) && (WTC[0].Privilege_Value == Input_Columns[j])) {
                                                content += '<td><input onclick="SecondarySales.highlight(this);" type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm computedfield" value = "' + value + '" readonly step=".01" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                            }
                                            else {
                                                if (dec.indexOf(Input_Columns[j]) != -1) {
                                                    content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                                }
                                                else {
                                                    content += '<td><input  type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                                }
                                            }
                                        }
                                    }
                                }
                                else {
                                    var WTC = $.grep(privilege_List, function (v) {
                                        return v.Privilege_Name == "SS_WHAT_TO_COMPUTE";
                                    })
                                    if (WTC.length > 0) {
                                        if (((WTC[0].Privilege_Value == "SALES") || (WTC[0].Privilege_Value == "CLOSING_BALANCE")) && (WTC[0].Privilege_Value == Input_Columns[j])) {
                                            content += '<td><input type="number" onclick="SecondarySales.highlight(this);" id ="' + Input_Columns[j] + '" class="form-control form-control-sm computedfield" value = "' + value + '" readonly step=".01"></td>';
                                        }
                                    }
                                    else {
                                        if (dec.indexOf(Input_Columns[j]) != -1) {
                                            content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                        }
                                        else {
                                            content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01"></td>';
                                        }
                                    }
                                }

                            }

                        }
                    }
                    var value = selectedData[i]["Purchase"] * selectedData[i]["Product_Price"] == undefined ? 0 : selectedData[i]["Purchase"] * selectedData[i]["Product_Price"];
                    var value1 = selectedData[i]["Opening_Balance"] * selectedData[i]["Product_Price"] == undefined ? 0 : selectedData[i]["Opening_Balance"] * selectedData[i]["Product_Price"];
                    content += '<td><input type="number" id="OPENINGBALANCE_AMOUNT" class="form-control form-control-sm OPENINGBALANCE_AMOUNT" readonly value=' + value1.toFixed(2) + ' step=".01" ></td>';
                    content += '<td><input type="number" id="PURCHASE_AMOUNT" class="form-control form-control-sm PURCHASE_AMOUNT" readonly value=' + value.toFixed(2) + ' step=".01" ></td>';
                    content += '<td><input type="number" id="SALES_AMOUNT" class="form-control form-control-sm Sales_Amount" readonly step=".01"></td>';
                    content += '<td><input type="number" id="CLOSING_BALANCE_AMOUNT" class="form-control form-control-sm Closing_Amount" readonly step=".01"></td>';
                    if (selectedData[i].Remarks.length > 0) {
                        content += '<td><input type="text" id="REMARKS" class="form-control form-control-sm Remark" value="' + selectedData[i].Remarks + '"></td>';
                    }
                    else {
                        content += '<td><input type="text" id="REMARKS" class="form-control form-control-sm Remark"></td>';
                    }
                    var Is_Mandatory = $.grep(product_List, function (v) {
                        return v.Product_Name == selectedData[i].Product_Name;
                    });
                    if (Is_Mandatory.length > 0) {
                        if (Is_Mandatory[0].Is_Mandatory == 1) {
                            content += '<td></td>';
                        }
                        else {
                            content += '<td><button type="button" id="DELETE" class="btn btn-primary btn-sm form-control form-control-sm" onclick = "SecondarySales.fnRemove(this);"><i class="fa fa-trash"></i></button></td>';
                        }
                    }
                    else {
                        content += '<td><button type="button" id="DELETE" class="btn btn-primary btn-sm form-control form-control-sm" onclick = "SecondarySales.fnRemove(this);"><i class="fa fa-trash"></i></button></td>';
                    }

                    content += '</tr>';

                    $('#tblSSProductEntry tbody').append(content);
                    var WTC = $.grep(privilege_List, function (v) {
                        return v.Privilege_Name == "SS_WHAT_TO_COMPUTE";
                    })
                    $("#" + WTC[0].Privilege_Value + "").removeClass("changecolor").addClass("computedfield");
                    //var a = $("#PURCHASE").val() * $("#PRODUCT_PRICE").val();
                    //$("#PURCHASE_AMOUNT").val(a);
                    //var b = $("#OPENING_BALANCE").val() * $("#PRODUCT_PRICE").val();
                    //$("#OPENINGBALANCE_AMOUNT").val(b);
                    if (Is_Mandatory[0].Is_Mandatory == 1) {
                        var atcObj = new ej.dropdowns.AutoComplete({
                            //set the data to dataSource property
                            dataSource: product_Name_List,
                            fields: { value: 'label' },
                            enabled: false,
                            // set the placeholder to AutoComplete input element
                            placeholder: 'Search Product',
                            change: function (e) {
                                SecondarySales.fnEditChangeProductList(e);
                            }
                        });
                        atcObj.appendTo('input[name=Product_Name' + (i + 1) + ']');
                        atcObj.value = selectedData[i].Product_Name;
                    }
                    else {
                        var atcObj = new ej.dropdowns.AutoComplete({
                            //set the data to dataSource property
                            dataSource: product_Name_List,
                            fields: { value: 'label' },
                            // set the placeholder to AutoComplete input element
                            placeholder: 'Search Product',
                            change: function (e) {
                                SecondarySales.fnEditChangeProductList(e);
                            }
                        });
                        atcObj.appendTo('input[name=Product_Name' + (i + 1) + ']');
                        atcObj.value = selectedData[i].Product_Name;
                    }
                }
            }
            $('#productModal').hide();
            if (mode != 'Edit') {
                SecondarySales.fnReCalculate();
            }
            else {
                SecondarySales.fnEditReCalculate();
            }

        }
        $('#dvDraftAndSave').show();
    },
    toTitleCase: function (str) {
        return str.replace(/(?:^|\s)\w/g, function (match) {
            return match.toUpperCase();
        });
    },
    fnHideModalPopup: function () {
        $('#productModal').hide();
    },
    fnGetSSEntryTable: function () {
        debugger;
        var currentDate = new Date();
        $('#datepicker').datepicker("setDate", currentDate);
        var SSEntryhtml = "";
        privilege = $.grep(privilege_List, function (ele, index) {
            return ele.Privilege_Name == "SS_INPUT_COLUMNS";
        });
        if (privilege.length != 0) {
            $('#tblSSProductEntry').html('');
            Input_Columns = privilege[0].Privilege_Value.split(',');
            var wid = Input_Columns.length;
            if (wid > 3 && wid <= 5) {
                var C_width = '120%';
            }
            else if (wid > 5) {
                var C_width = '130%';
            }
            else {
                var C_width = '100%';
            }
            SSEntryhtml += '<table class="table table-bordered" style="font-size:13px;width:' + C_width + ';">';//width:' + C_width + ';
            SSEntryhtml += '<thead class="thead bg-info text-white text-center">';
            SSEntryhtml += '<tr>';
            SSEntryhtml += '<th scope = "col" style="width:300px;"> PRODUCT NAME</th>';
            SSEntryhtml += '<th scope = "col"> PRODUCT PRICE</th>';
            for (var i = 0; i < Input_Columns.length; i++) {
                SSEntryhtml += '<th scope = "col">' + Input_Columns[i].replace('_', ' ') + '</th>';
            }
            SSEntryhtml += '<th scope = "col" style="width:100px;">OPENING BALANCE AMOUNT</th>';
            SSEntryhtml += '<th scope = "col" style="width:100px;">PURCHASE AMOUNT</th>';
            SSEntryhtml += '<th scope = "col" style="width:100px;">SALES AMOUNT</th>';
            SSEntryhtml += '<th scope = "col" style="width:100px;">CLOSING BALANCE AMOUNT</th>';
            SSEntryhtml += '<th scope="col" style="width:150px;"> REMARKS</th>';
            SSEntryhtml += '<th scope = "col">DELETE</th>';
            SSEntryhtml += '</tr>';
            SSEntryhtml += '</thead>';
            SSEntryhtml += '<tbody>';
            SSEntryhtml += '</tbody>';
            SSEntryhtml += '<tfoot>';
            SSEntryhtml += '<tr>';
            SSEntryhtml += '<td colspan="' + (4 + Input_Columns.length) + '" style="text-align: right;"><label style="font-size: 18px;font-weight: 600;">Total</label> </td>';
            SSEntryhtml += '<td><input type="number" id ="TOTAL_SALE_AMOUNT" class="form-control form-control-sm" readonly step=".01"> </td>';
            SSEntryhtml += '<td><input type="number" id = "TOTAL_CLOSING_AMOUNT" class="form-control form-control-sm" readonly step=".01"></td>';
            SSEntryhtml += '<td colspan="2"></td>';
            SSEntryhtml += '</tr>';
            SSEntryhtml += '</tfoot>';
            SSEntryhtml += '</table>';
            $('#tblSSProductEntry').html(SSEntryhtml);
            var decimalColumn = $.grep(privilege_List, function (v) {
                return v.Privilege_Name == "DISALLOW_DECIMAL_IN_SS";
            });
            var dec = []
            if (decimalColumn.length > 0) {
                var val = decimalColumn[0].Privilege_Value;
                if (val.indexOf(',') != -1) {
                    dec = decimalColumn[0].Privilege_Value.split(',');
                }
                else {
                    dec = decimalColumn[0].Privilege_Value;
                }

            }

            if (product_List.length > 0) {
                for (var j = 0; j < product_List.length; j++) {
                    if (product_List[j].Is_Mandatory == 1) {
                        var SSEntryhtml = '';
                        SSEntryhtml += '<tr>';
                        var num = rowCount + j;
                        SSEntryhtml += '<td><input type="text" id="PRODUCT_NAME" name="Product_Name' + num + '" class="form-control form-control-sm product_' + num + '"></td>';
                        rowCount = rowCount + j;
                        var price_Edit = $.grep(privilege_List, function (v) {
                            return v.Privilege_Name == "ALLOW_SS_PRICE_EDIT";
                        });
                        if (price_Edit.length > 0) {
                            if (price_Edit[0].Privilege_Value == "YES") {
                                SSEntryhtml += '<td><input type="number" id="PRODUCT_PRICE" value = "' + product_List[j].Product_Price.toFixed(2) + '" class="form-control form-control-sm"></td>';
                            }
                            else {
                                SSEntryhtml += '<td><input type="number" id="PRODUCT_PRICE" value = "' + product_List[j].Product_Price.toFixed(2) + '" class="form-control form-control-sm" readonly></td>';
                            }
                        }
                        else {
                            SSEntryhtml += '<td><input type="number" id="PRODUCT_PRICE" value = "' + product_List[j].Product_Price.toFixed(2) + '" class="form-control form-control-sm" readonly></td>';
                        }
                        for (var i = 0; i < Input_Columns.length; i++) {
                            if (Input_Columns[i] == "OPENING_BALANCE") {
                                var OBE = $.grep(privilege_List, function (v) {
                                    return v.Privilege_Name == "SS_OPENING_BALANCE_EDITABLE";
                                })
                                if (OBE.length > 0) {
                                    if (OBE[0].Privilege_Value == "YES") {
                                        if (dec.indexOf(Input_Columns[i]) != -1) {
                                            SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" value = "' + product_List[j].Opening_Balance + '" class="form-control form-control-sm" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                        }
                                        else {
                                            SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" value = "' + product_List[j].Opening_Balance + '" class="form-control form-control-sm" step=".01"></td>';
                                        }

                                    }
                                    else {

                                        SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" value = "' + product_List[j].Opening_Balance + '" class="form-control form-control-sm" step=".01" readonly></td>';
                                    }
                                }
                                else {
                                    SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" value = "' + product_List[j].Opening_Balance + '" class="form-control form-control-sm" step=".01" readonly></td>';
                                }
                            }
                            else {
                                if (Input_Columns[i] == "PURCHASE" || Input_Columns[i] == "PURCHASE_RETURN") {
                                    var P_PR_Editable = $.grep(privilege_List, function (v) {
                                        return v.Privilege_Name == "SS_PRIMARYSALES_PREFILL_COLUMN_EDITABLE";
                                    })
                                    if (P_PR_Editable.length > 0) {
                                        if (P_PR_Editable[0].Privilege_Value == "YES") {
                                            if (Input_Columns[i] == "PURCHASE") {
                                                if (dec.indexOf(Input_Columns[i]) != -1) {
                                                    SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" value = "' + product_List[j].Purchase + '" class="form-control form-control-sm" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                                }
                                                else {
                                                    SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" value = "' + product_List[j].Purchase + '" class="form-control form-control-sm" step=".01"></td>';
                                                }
                                            }
                                            else {
                                                if (dec.indexOf(Input_Columns[i]) != -1) {
                                                    SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" value = "' + product_List[j].Purchase_Return + '" class="form-control form-control-sm" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                                }
                                                else {
                                                    SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" value = "' + product_List[j].Purchase_Return + '" class="form-control form-control-sm" step=".01"></td>';
                                                }
                                            }
                                        }
                                        else {
                                            if (Input_Columns[i] == "PURCHASE") {
                                                SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" value = "' + product_List[j].Purchase + '" class="form-control form-control-sm" readonly step=".01"></td>';
                                            }
                                            else {
                                                SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" value = "' + product_List[j].Purchase_Return + '" class="form-control form-control-sm" readonly step=".01"></td>';
                                            }
                                        }
                                    }
                                    else {
                                        if (Input_Columns[i] == "PURCHASE") {
                                            if (dec.indexOf(Input_Columns[i]) != -1) {
                                                SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" value = "' + product_List[j].Purchase + '" class="form-control form-control-sm"  onkeypress="return fnValidateDecimal(this,event)"></td>';
                                            }
                                            else {
                                                SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" value = "' + product_List[j].Purchase + '" class="form-control form-control-sm" step=".01" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                            }

                                        }
                                        else {
                                            if (dec.indexOf(Input_Columns[i]) != -1) {
                                                SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" value = "' + product_List[j].Purchase_Return + '" class="form-control form-control-sm" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                            }
                                            else {
                                                SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" value = "' + product_List[j].Purchase_Return + '" class="form-control form-control-sm" step=".01" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                            }
                                        }
                                    }
                                }
                                else {
                                    debugger;
                                    var CF_Editable = $.grep(privilege_List, function (v) {
                                        return v.Privilege_Name == "SS_COMPUTED_FIELD_EDITABLE";
                                    })

                                    if (CF_Editable.length > 0) {
                                        debugger;
                                        if (CF_Editable[0].Privilege_Value == "YES") {
                                            var WTC = $.grep(privilege_List, function (v) {
                                                return v.Privilege_Name == "SS_WHAT_TO_COMPUTE";
                                            })
                                            if (WTC.length > 0) {
                                                if (dec.indexOf(Input_Columns[i]) != -1) {
                                                    SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '"  class="form-control form-control-sm " onkeypress="return fnValidateDecimal(this,event)"></td>';
                                                }
                                                else {
                                                    SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" step=".01" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                                }
                                            }
                                        }
                                        else {
                                            debugger;
                                            var WTC = $.grep(privilege_List, function (v) {
                                                return v.Privilege_Name == "SS_WHAT_TO_COMPUTE";
                                            })
                                            if (WTC.length > 0) {
                                                debugger;
                                                if (((WTC[0].Privilege_Value == "SALES") || (WTC[0].Privilege_Value == "CLOSING_BALANCE")) && (WTC[0].Privilege_Value == Input_Columns[i])) {
                                                    SSEntryhtml += '<td><input onclick="SecondarySales.highlight(this);" type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm computedfield" readonly step=".01" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                                }
                                                else {
                                                    debugger;
                                                    if (dec.indexOf(Input_Columns[i]) != -1) {
                                                        SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" onkeypress="return fnValidateDecimal(this,event)" value = "' + product_List[j].Opening_Balance + '"></td>';
                                                    }
                                                    else {
                                                        SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" step=".01 " onkeypress="return fnValidateDecimal(this,event)" value = "' + product_List[j].Opening_Balance + '"></td>';
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        debugger;
                                        var WTC = $.grep(privilege_List, function (v) {
                                            return v.Privilege_Name == "SS_WHAT_TO_COMPUTE";
                                        })
                                        if (WTC.length > 0) {
                                            debugger;
                                            if (((WTC[0].Privilege_Value == "SALES") || (WTC[0].Privilege_Value == "CLOSING_BALANCE")) && (WTC[0].Privilege_Value == Input_Columns[i])) {
                                                SSEntryhtml += '<td><input onclick="SecondarySales.highlight(this);" type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm computedfield" readonly step=".01" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                            }
                                            else {
                                                debugger;
                                                if (dec.indexOf(Input_Columns[i]) != -1) {
                                                    SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" onkeypress="return fnValidateDecimal(this,event)" value = "' + product_List[j].Opening_Balance + '"></td>';
                                                }
                                                else {
                                                    SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" step=".01 " onkeypress="return fnValidateDecimal(this,event)" value = "' + product_List[j].Opening_Balance + '"></td>';
                                                }
                                            }
                                        }
                                    }
                                    //else {
                                    //    //var WTC = $.grep(privilege_List, function (v) {
                                    //    //    return v.Privilege_Name == "SS_WHAT_TO_COMPUTE";
                                    //    //})
                                    //    if (WTC != undefined) {
                                    //        if (((WTC[0].Privilege_Value == "SALES") || (WTC[0].Privilege_Value == "CLOSING_BALANCE")) && (WTC[0].Privilege_Value == Input_Columns[i])) {
                                    //            SSEntryhtml += '<td><input onclick="SecondarySales.highlight(this);" type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm computedfield" readonly step=".01" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                    //        }
                                    //    }
                                    //    else {
                                    //        debugger;
                                    //        if (dec.indexOf(Input_Columns[i]) != -1) {
                                    //            SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm"  onkeypress="return fnValidateDecimal(this,event)"></td>';
                                    //        }
                                    //        else {
                                    //            SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '"  class="form-control form-control-sm" step=".01"  onkeypress="return fnValidateDecimal(this,event)"></td>';
                                    //        }
                                    //    }
                                    //}
                                }
                            }

                        }
                        //if (selectedData != undefined) {
                        //    var value = selectedData[i]["Purchase"] * selectedData[i]["Product_Price"] == undefined ? 0 : selectedData[i]["Purchase"] * selectedData[i]["Product_Price"];
                        //    var value1 = selectedData[i]["Opening_Balance"] * selectedData[i]["Product_Price"] == undefined ? 0 : selectedData[i]["Opening_Balance"] * selectedData[i]["Product_Price"];
                        //}
                        SSEntryhtml += '<td><input type="number" id="OPENINGBALANCE_AMOUNT" class="form-control form-control-sm OPENINGBALANCE_AMOUNT" readonly  step=".01" ></td>';//value=' + value1 + '
                        SSEntryhtml += '<td><input type="number" id="PURCHASE_AMOUNT" class="form-control form-control-sm PURCHASE_AMOUNT" readonly step=".01" ></td>';//value=' + value + '
                        SSEntryhtml += '<td><input type="number" id="SALES_AMOUNT" class="form-control form-control-sm Sales_Amount" step=".01" readonly></td>';
                        SSEntryhtml += '<td><input type="number" id="CLOSING_BALANCE_AMOUNT" class="form-control form-control-sm Closing_Amount" step=".01" readonly></td>';
                        SSEntryhtml += '<td><input type="text" id="REMARKS" class="form-control form-control-sm Remark"></td>';
                        SSEntryhtml += '<td></td>';
                        SSEntryhtml += '</tr>';

                        $('#tblSSProductEntry tbody').append(SSEntryhtml);
                        //var a = $("#PURCHASE").val() * $("#PRODUCT_PRICE").val();
                        //$("#PURCHASE_AMOUNT").val(a);
                        //var b = $("#OPENING_BALANCE").val() * $("#PRODUCT_PRICE").val();
                        //$("#OPENINGBALANCE_AMOUNT").val(b);
                        var atcObj3 = new ej.dropdowns.AutoComplete({
                            //set the data to dataSource property
                            dataSource: product_Name_List,
                            fields: { value: 'label' },
                            enabled: false,
                            // set the placeholder to AutoComplete input element
                            placeholder: 'Search Product',
                            change: function (e) {
                                SecondarySales.fnChangeProductList(e);
                            }
                        });
                        atcObj3.appendTo('input[name=Product_Name' + num + ']');
                        atcObj3.value = product_List[j].Product_Name;
                    }
                }
            }

            debugger;
            if ($("#tblSSProductEntry table tbody tr").length == 0) {
                var SSEntryhtml = '';
                SSEntryhtml += '<tr>';
                SSEntryhtml += '<td><input type="text" id="PRODUCT_NAME" name="Product_Name1" class="form-control form-control-sm product_1"></td>';
                var price_Edit = $.grep(privilege_List, function (v) {
                    return v.Privilege_Name == "ALLOW_SS_PRICE_EDIT";
                });
                if (price_Edit.length > 0) {
                    if (price_Edit[0].Privilege_Value == "YES") {
                        SSEntryhtml += '<td><input type="number" id="PRODUCT_PRICE" class="form-control form-control-sm"></td>';
                    }
                    else {
                        SSEntryhtml += '<td><input type="number" id="PRODUCT_PRICE" class="form-control form-control-sm" readonly></td>';
                    }
                }
                else {
                    SSEntryhtml += '<td><input type="number" id="PRODUCT_PRICE" class="form-control form-control-sm" readonly></td>';
                }
                for (var i = 0; i < Input_Columns.length; i++) {
                    if (Input_Columns[i] == "OPENING_BALANCE") {
                        var OBE = $.grep(privilege_List, function (v) {
                            return v.Privilege_Name == "SS_OPENING_BALANCE_EDITABLE";
                        })
                        if (OBE.length > 0) {
                            if (OBE[0].Privilege_Value == "YES") {
                                if (dec.indexOf(Input_Columns[i]) != -1) {
                                    SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                }
                                else {
                                    SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" step=".01" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                }
                            }
                            else {
                                SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" step=".01" readonly onkeypress="return fnValidateDecimal(this,event)"></td>';
                            }
                        }
                        else {
                            SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" step=".01" readonly onkeypress="return fnValidateDecimal(this,event)"></td>';
                        }
                    }
                    else {
                        if (Input_Columns[i] == "PURCHASE" || Input_Columns[i] == "PURCHASE_RETURN") {
                            var P_PR_Editable = $.grep(privilege_List, function (v) {
                                return v.Privilege_Name == "SS_PRIMARYSALES_PREFILL_COLUMN_EDITABLE";
                            })
                            if (P_PR_Editable.length > 0) {
                                if (P_PR_Editable[0].Privilege_Value == "YES") {
                                    if (dec.indexOf(Input_Columns[i]) != -1) {
                                        SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                    }
                                    else {
                                        SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" step=".01" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                    }
                                }
                                else {
                                    SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" readonly step=".01" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                }
                            }
                            else {
                                if (dec.indexOf(Input_Columns[i]) != -1) {
                                    SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                }
                                else {
                                    SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" step=".01" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                }
                            }
                        }
                        else {
                            debugger;
                            var WTC = $.grep(privilege_List, function (v) {
                                return v.Privilege_Name == "SS_WHAT_TO_COMPUTE";
                            })
                            if (WTC.length > 0) {
                                debugger;
                                if (((WTC[0].Privilege_Value == "SALES") || (WTC[0].Privilege_Value == "CLOSING_BALANCE")) && (WTC[0].Privilege_Value == Input_Columns[i])) {
                                    SSEntryhtml += '<td><input onclick="SecondarySales.highlight(this);" type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm computedfield" readonly step=".01" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                }
                                else {
                                    debugger;
                                    if (dec.indexOf(Input_Columns[i]) != -1) {
                                        SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                    }
                                    else {
                                        SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" step=".01" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                    }
                                }
                            }
                        }

                    }
                }
                //var value = selectedData[i]["Purchase"] * selectedData[i]["Product_Price"] == undefined ? 0 : selectedData[i]["Purchase"] * selectedData[i]["Product_Price"];
                //var value1 = selectedData[i]["Opening_Balance"] * selectedData[i]["Product_Price"] == undefined ? 0 : selectedData[i]["Opening_Balance"] * selectedData[i]["Product_Price"];
                SSEntryhtml += '<td><input type="number" id="OPENINGBALANCE_AMOUNT" class="form-control form-control-sm OPENINGBALANCE_AMOUNT" readonly step=".01"></td>';
                SSEntryhtml += '<td><input type="number" id="PURCHASE_AMOUNT" class="form-control form-control-sm PURCHASE_AMOUNT" readonly step=".01"></td>';
                SSEntryhtml += '<td><input type="number" id="SALES_AMOUNT" class="form-control form-control-sm Sales_Amount" step=".01" readonly></td>';
                SSEntryhtml += '<td><input type="number" id="CLOSING_BALANCE_AMOUNT" class="form-control form-control-sm Closing_Amount" step=".01" readonly></td>';
                SSEntryhtml += '<td><input type="text" id="REMARKS" class="form-control form-control-sm Remark"></td>';
                SSEntryhtml += '<td><button type="button" id="DELETE" class="btn btn-primary btn-sm form-control form-control-sm" onclick = "SecondarySales.fnRemove(this);"><i class="fa fa-trash"></i></button></td>';
                SSEntryhtml += '</tr>';
                //var a = $("#PURCHASE").val() * $("#PRODUCT_PRICE").val();
                //$("#PURCHASE_AMOUNT").val(a);
                //var b = $("#OPENING_BALANCE").val() * $("#PRODUCT_PRICE").val();
                //$("#OPENINGBALANCE_AMOUNT").val(b);
                $('#tblSSProductEntry tbody').append(SSEntryhtml);
                var atcObj = new ej.dropdowns.AutoComplete({
                    //set the data to dataSource property
                    dataSource: product_Name_List,
                    fields: { value: 'label' },
                    // set the placeholder to AutoComplete input element
                    placeholder: 'Search Product',
                    change: function (e) {
                        SecondarySales.fnChangeProductList(e);
                    }
                });
                atcObj.appendTo('input[name=Product_Name1]');
            }


        }
        //SecondarySales.fnReCalculate();plusbtn
        //$('#tblSSProductEntry').append(SSEntryhtml);
        $('.actionButtons').show();
        $('.plusbtn').show();
        $('#divattachment').show();
    },

    fnAddnewRow: function () {
        debugger;
        SecondarySales.fnReCalculate();
        SecondarySales.fnSubmit(3, 'plus');
        var decimalColumn = $.grep(privilege_List, function (v) {
            return v.Privilege_Name == "DISALLOW_DECIMAL_IN_SS";
        });
        var dec = []
        if (decimalColumn.length > 0) {
            var val = decimalColumn[0].Privilege_Value;
            if (val.indexOf(',') != -1) {
                dec = decimalColumn[0].Privilege_Value.split(',');
            }
            else {
                dec = decimalColumn[0].Privilege_Value;
            }
        }
        rowCount = rowCount + 1;
        var SSEntryhtml = "";
        SSEntryhtml += '<tr>';
        SSEntryhtml += '<td><input type="text" id="PRODUCT_NAME" name="Product_Name' + rowCount + '" class="form-control product_' + rowCount + '"></td>';
        var price_Edit = $.grep(privilege_List, function (v) {
            return v.Privilege_Name == "ALLOW_SS_PRICE_EDIT";
        });
        if (price_Edit.length > 0) {
            if (price_Edit[0].Privilege_Value == "YES") {
                SSEntryhtml += '<td><input type="text"  id="PRODUCT_PRICE" class="form-control form-control-sm"></td>';
            }
            else {
                SSEntryhtml += '<td><input type="text"  id="PRODUCT_PRICE" class="form-control form-control-sm" readonly></td>';
            }
        }
        else {
            SSEntryhtml += '<td><input type="text"  id="PRODUCT_PRICE" class="form-control form-control-sm" readonly></td>';
        }
        for (var i = 0; i < Input_Columns.length; i++) {
            if (Input_Columns[i] == "OPENING_BALANCE") {
                var OBE = $.grep(privilege_List, function (v) {
                    return v.Privilege_Name == "SS_OPENING_BALANCE_EDITABLE";
                })
                if (OBE.length > 0) {
                    if (OBE[0].Privilege_Value == "YES") {
                        if (dec.indexOf(Input_Columns[i]) != -1) {
                            SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" onkeypress="return fnValidateDecimal(this,event)"></td>';
                        }
                        else {
                            SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" step=".01" onkeypress="return fnValidateDecimal(this,event)"></td>';
                        }
                    }
                    else {
                        SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" step=".01" readonly onkeypress="return fnValidateDecimal(this,event)"></td>';
                    }
                }
                else {
                    SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" step=".01" readonly onkeypress="return fnValidateDecimal(this,event)"></td>';
                }
            }
            else {
                if (Input_Columns[i] == "PURCHASE" || Input_Columns[i] == "PURCHASE_RETURN") {
                    var P_PR_Editable = $.grep(privilege_List, function (v) {
                        return v.Privilege_Name == "SS_PRIMARYSALES_PREFILL_COLUMN_EDITABLE";
                    })
                    if (P_PR_Editable.length > 0) {
                        if (P_PR_Editable[0].Privilege_Value == "YES") {
                            if (dec.indexOf(Input_Columns[i]) != -1) {
                                SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" onkeypress="return fnValidateDecimal(this,event)"></td>';
                            }
                            else {
                                SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" step=".01" onkeypress="return fnValidateDecimal(this,event)"></td>';
                            }
                        }
                        else {
                            SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" readonly step=".01" onkeypress="return fnValidateDecimal(this,event)"></td>';
                        }
                    }
                    else {
                        if (dec.indexOf(Input_Columns[i]) != -1) {
                            SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" onkeypress="return fnValidateDecimal(this,event)"></td>';
                        }
                        else {
                            SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" step=".01" onkeypress="return fnValidateDecimal(this,event)"></td>';

                        }
                    }
                }
                else {
                    debugger;
                    var CF_Editable = $.grep(privilege_List, function (v) {
                        return v.Privilege_Name == "SS_COMPUTED_FIELD_EDITABLE";
                    })
                    if (CF_Editable.length > 0) {
                        var WTC = $.grep(privilege_List, function (v) {
                            return v.Privilege_Name == "SS_WHAT_TO_COMPUTE";
                        })
                        if (CF_Editable[0].Privilege_Value == "YES") {
                            if (WTC.length > 0) {
                                if (dec.indexOf(Input_Columns[i]) != -1) {
                                    SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                }
                                else {
                                    SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                }
                            }
                        }
                        else {
                            if (WTC.length > 0) {
                                if (((WTC[0].Privilege_Value == "SALES") || (WTC[0].Privilege_Value == "CLOSING_BALANCE")) && (WTC[0].Privilege_Value == Input_Columns[i])) {
                                    SSEntryhtml += '<td><input onclick="SecondarySales.highlight(this);" type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm computedfield" onkeypress="return fnValidateDecimal(this,event)" readonly></td>';
                                }
                                else {
                                    if (dec.indexOf(Input_Columns[i]) != -1) {
                                        SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                    }
                                    else {
                                        SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                    }
                                }
                            }
                        }
                    }
                    else {
                        var WTC = $.grep(privilege_List, function (v) {
                            return v.Privilege_Name == "SS_WHAT_TO_COMPUTE";
                        })
                        if (WTC.length > 0) {
                            if (((WTC[0].Privilege_Value == "SALES") || (WTC[0].Privilege_Value == "CLOSING_BALANCE")) && (WTC[0].Privilege_Value == Input_Columns[i])) {
                                SSEntryhtml += '<td><input onclick="SecondarySales.highlight(this);" type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm computedfield" onkeypress="return fnValidateDecimal(this,event)" readonly></td>';
                            }
                            else {
                                if (dec.indexOf(Input_Columns[i]) != -1) {
                                    SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                }
                                else {
                                    SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                }
                            }
                        }
                    }

                }
                //else {
                //    debugger;
                //    var CF_Editable = $.grep(privilege_List, function (v) {
                //        return v.Privilege_Name == "SS_COMPUTED_FIELD_EDITABLE";
                //    })
                //    if (CF_Editable.length > 0) {
                //        if (CF_Editable[0].Privilege_Value == "YES") {
                //            var WTC = $.grep(privilege_List, function (v) {
                //                return v.Privilege_Name == "SS_WHAT_TO_COMPUTE";
                //            })
                //            if (WTC.length > 0) {
                //                if (dec.indexOf(Input_Columns[i]) != -1) {
                //                    SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" onkeypress="return fnValidateDecimal(this,event)"></td>';
                //                }
                //                else {
                //                    SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" step=".01" onkeypress="return fnValidateDecimal(this,event)"></td>';
                //                }
                //            }
                //        }
                //        else {
                //            if (dec.indexOf(Input_Columns[i]) != -1) {
                //                SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" onkeypress="return fnValidateDecimal(this,event)"></td>';
                //            }
                //            else {
                //                SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" step=".01" onkeypress="return fnValidateDecimal(this,event)"></td>';
                //            }
                //        }

                //    }
                //    else {
                //        var WTC = $.grep(privilege_List, function (v) {
                //            return v.Privilege_Name == "SS_WHAT_TO_COMPUTE";
                //        })
                //        if (WTC.length > 0) {
                //            if (dec.indexOf(Input_Columns[i]) != -1) {
                //                SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" onkeypress="return fnValidateDecimal(this,event)"></td>';
                //            }
                //            else {
                //                SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" step=".01"></td>';
                //            }
                //        }
                //    }
                //}
            }
        }
        //var value = selectedData[i]["Purchase"] * selectedData[i]["Product_Price"] == undefined ? 0 : selectedData[i]["Purchase"] * selectedData[i]["Product_Price"];
        //var value1 = selectedData[i]["Opening_Balance"] * selectedData[i]["Product_Price"] == undefined ? 0 : selectedData[i]["Opening_Balance"] * selectedData[i]["Product_Price"];
        SSEntryhtml += '<td><input type="number" id="OPENINGBALANCE_AMOUNT" class="form-control form-control-sm OPENINGBALANCE_AMOUNT" readonly step=".01"></td>';
        SSEntryhtml += '<td><input type="number" id="PURCHASE_AMOUNT" class="form-control form-control-sm PURCHASE_AMOUNT" readonly step=".01"></td>';
        SSEntryhtml += '<td><input type="number" id="SALES_AMOUNT" class="form-control form-control-sm Sales_Amount" step=".01" readonly></td>';
        SSEntryhtml += '<td><input type="number" id="CLOSING_BALANCE_AMOUNT" class="form-control form-control-sm Closing_Amount" step=".01" readonly></td>';
        SSEntryhtml += '<td><input type="text" id="REMARKS" class="form-control form-control-sm Remark"></td>';
        SSEntryhtml += '<td><button type="button" id="DELETE" class="btn btn-primary btn-sm form-control form-control-sm" onclick = "SecondarySales.fnRemove(this);"><i class="fa fa-trash"></i></button></td>';
        SSEntryhtml += '</tr>';

        $("#tblSSProductEntry tbody").append(SSEntryhtml);

        var atcObj = new ej.dropdowns.AutoComplete({
            //set the data to dataSource property
            dataSource: product_Name_List,
            fields: { value: 'label' },
            // set the placeholder to AutoComplete input element
            placeholder: 'Search Product',
            change: function (e) {
                SecondarySales.fnChangeProductList(e);
            }

        });
        atcObj.appendTo('input[name=Product_Name' + rowCount + ']');
        $(".product_" + rowCount).focus();
    },
    fnChangeProductList: function (e) {
        $('#dvDraftAndSave').show();
        $('#dvReCal').show();

        var currentRow = $(e.element).parent().parent().parent();
        var currentProductCode = e.itemData.Id;
        var lstProduct = $.grep(product_List, function (v) {
            return v.Product_Code == currentProductCode;
        });
        if (lstProduct.length > 0) {
            if ($.inArray(currentProductCode, lstEnteredProducts) == -1) {
                lstEnteredProducts.push(currentProductCode);
            }

            if (lstProduct[0].Product_Exists == 1) {
                currentRow.find('#OPENING_BALANCE').val(lstProduct[0].Opening_Balance);
            }
            else {
                currentRow.find('#OPENING_BALANCE').val(lstProduct[0].Opening_Balance);
                currentRow.find('#OPENING_BALANCE').attr('readonly', false);
            }
            currentRow.find('#PURCHASE').val(lstProduct[0].Purchase);
            currentRow.find('#PURCHASE_RETURN').val(lstProduct[0].Purchase_Return);
            currentRow.find('#PRODUCT_PRICE').val(lstProduct[0].Product_Price);
            currentRow.find('#SALES').val(0);
            currentRow.find('#CLOSING_BALANCE').val(0);
            currentRow.find('#FREE_GOODS').val(0);
            currentRow.find('#SALES_RETURN').val(0);
            currentRow.find('#TRANSIT').val(0);
            SecondarySales.fnReCalculate();
        }
    },

    fnEditChangeProductList: function (e) {
        $('#dvDraftAndSave').show();
        $('#dvReCal').show();
        var currentRow = $(e.element).parent().parent().parent();
        var currentProductCode = e.itemData.Id;
        var lstProduct = $.grep(product_List, function (v) {
            return v.Product_Code == currentProductCode;
        });
    },

    fnEditStockist: function (SS_Code, Stockist_Code, SS_Statement_Date, year, month) {
        debugger;
        lstEnteredProducts = [];
        Edited_SS_Code = SS_Code;

        if (month == "January") {
            Month = 01;
        }
        else if (month == "February") {
            Month = 02;
        }
        else if (month == "March") {
            Month = 03;
        }
        else if (month == "April") {
            Month = 04;
        }
        else if (month == "May") {
            Month = 05;
        }
        else if (month == "June") {
            Month = 06;
        }
        else if (month == "July") {
            Month = 07;
        }
        else if (month == "August") {
            Month = 08;
        }
        else if (month == "September") {
            Month = 09;
        }
        else if (month == "October") {
            Month = 10;
        }
        else if (month == "November") {
            Month = 11;
        }
        else if (month == "December") {
            Month = 12;
        }

        Year = year;
        debugger;
        can_Enter_SS = true;
        can_skip = true;
        SS_Periodic_Lock = true;
        var d = SecondarySales.defaults.Company_Code + '/' + Selected_Region_Code + '/' + Stockist_Code + '/' + Year + '/' + Month;
        SSCoreREST.requestInvoke('api/CanEnterSS', d, null, "GET", SecondarySales.fnCanEnterSS_SuccessCallback, SecondarySales.fnCanEnterSS_FailureCallback);
        var sequence = SecondarySales.defaults.Company_Code + '/' + Stockist_Code + '/' + Year + '/' + Month + '/' + SecondarySales.defaults.LogRegionCode;
        SSCoreREST.requestInvoke('api/CheckForMonthsToBeSkipped', sequence, null, "GET", SecondarySales.fnCheckForMonthsToBeSkippedinEditSuccessCallback, SecondarySales.fnCheckForMonthsToBeSkippedinEditFailureCallback);
        if (can_Enter_SS && can_skip) {
            can_skip = true;

            Generated_Date = Year + '-' + Month + '-' + '01';
            var details = SecondarySales.defaults.Company_Code + '/' + Selected_Region_Code + '/' + Generated_Date + '/' + SecondarySales.defaults.LogRegionCode;
            SSCoreREST.requestInvoke('api/GetStockistList', details, null, "GET", SecondarySales.fnGetStockistListSuccessCallback, SecondarySales.fnGetStockistListFailureCallback);
            if (SS_Periodic_Lock) {
                var StockistObj = document.querySelector("#txtStockist").ej2_instances[0];
                StockistObj.value = Stockist_Code;

                stockCode = Stockist_Code;
                $('#dvStockistList').show();
                var details = SecondarySales.defaults.Company_Code + '/' + Stockist_Code + '/' + Selected_Region_Code + '/' + SecondarySales.defaults.LogRegionCode + '/' + SecondarySales.defaults.LogUserCode + '/' + Generated_Date;
                SSCoreREST.requestInvoke('api/GetSSPrivileges', details, null, "GET", SecondarySales.fnValidateSecondarySalesEntrySuccessCallback, SecondarySales.fnValidateSecondarySalesEntryFailureCallback);
                if (check_Mandatory_Privilege) {


                    //details = SecondarySales.defaults.Company_Code + '/' + Selected_Region_Code + '/' + Stockist_Code + '/' + price_Group + '/' + Year + '/' + Month;
                    details = SecondarySales.defaults.Company_Code + '/' + Selected_Region_Code + '/' + SecondarySales.defaults.LogRegionCode + '/' + Stockist_Code + '/' + price_Group + '/' + Year + '/' + Month;
                    SSCoreREST.requestInvoke('api/GetProductList', details, null, "GET", SecondarySales.fnGetProductListSuccessCallback, SecondarySales.fnGetProductListFailureCallback);

                    $('#dvShowProducts').show();
                    $("#fileUploader").val('').show
                    // Stockist Details Prefilling.
                    $("#datepicker").val(SS_Statement_Date);
                    // Get Stockist Product List.
                    details = SecondarySales.defaults.Company_Code + '/' + SS_Code;
                    SSCoreREST.requestInvoke('api/GetSSStockistDetails', details, null, "GET", SecondarySales.fnEidtSS_SuccessCallback, SecondarySales.fnEditSS_FailureCallback);
                    $('#nav-home-tab').tab('show');
                    var yearObj = document.querySelector("#txtYear").ej2_instances[0]
                    yearObj.value = parseInt(Year);
                    var monthObj = document.querySelector("#txtMonth").ej2_instances[0]
                    monthObj.value = parseInt(Month);
                    $('#dvReCal').show();
                    $('#dvDraftAndSave').show();

                    SecondarySales.fnGetStockistSSEntryHeader(Stockist_Code);

                    document.querySelector("#txtYear").ej2_instances[0].enabled = false;
                    document.querySelector("#txtMonth").ej2_instances[0].enabled = false;
                    document.querySelector("#txtStockist").ej2_instances[0].enabled = false;
                }
            }
        }
    },
    fnEidtSS_SuccessCallback: function (response) {
        debugger;
        // Product binding.
        SecondarySales.fnGetandBindSelectedProducts("Edit", response.Response);
        $('#dvDraftAndSave').show();
        //$('#Draft').prop('disabled', false);
        //$('#Submit').prop('disabled', false);
        $('.actionButtons').show();
        $('.plusbtn').show();
        $('#divattachment').show();
    },
    fnEditSS_FailureCallback: function (response) {
    },
    fnSubmit: function (status, mode) {
        debugger;
        final_Insert_Data = [];
        global_variable = mode;
        $('#Draft').prop('disabled', true);
        $('#Submit').prop('disabled', true);
        var ss_Flag = true;
        if ($('#datepicker').val() == '') {
            $('#Draft').prop('disabled', false);
            $('#Submit').prop('disabled', false);
            swal('Info', 'Please enter Statement Date.', 'info');
            return false;
        }
        else {
            var statementDate = $('#datepicker').val();
            statementDate = statementDate.split('-')[2] + '-' + statementDate.split('-')[1] + '-' + statementDate.split('-')[0];
            arr = [];
            var No_decimal = $.grep(privilege_List, function (ele, index) {
                return ele.Privilege_Name == "DISALLOW_DECIMAL_IN_SS";
            });
            var dec = []

            if (No_decimal.length > 0) {
                var val = No_decimal[0].Privilege_Value;
                if (val.indexOf(',') != -1) {
                    dec = No_decimal[0].Privilege_Value.split(',');
                }
                else {
                    dec = No_decimal[0].Privilege_Value;
                }
            }
            if (status == 1) {
                $("#tblSSProductEntry table tbody tr").map(function (i, e) {
                    var obj = {};
                    var formula = $.grep(privilege_List, function (v) { return v.Privilege_Name == "SS_FORMULA_V1" }).map(a=>a.Privilege_Value)[0];
                    var product_Name = $(this).find("select").val();
                    var Restrict_Decimal = No_decimal[0].Privilege_Value;
                    if (product_Name != null && product_Name != undefined) {
                        var PC = $.grep(product_List, function (v) { return v.Product_Name == product_Name }).map(a=>a.Product_Code)[0];
                        if ($.grep(arr, function (e) { return e.Product_Code === PC; }).length > 0) {
                            $('#Draft').prop('disabled', false);
                            $('#Submit').prop('disabled', false);
                            swal('info', ' You cannot enter the same Product more than once.', 'info');
                            ss_Flag = false;
                            return false;
                        }
                        obj.Product_Code = PC;
                        obj.Division_Code = $.grep(product_List, function (v) { return v.Product_Code == PC }).map(a=>a.Division_Code)[0];
                        if ($(this).find("#PRODUCT_PRICE").val() >= 0) {
                            obj.Unit_Rate = $(this).find("#PRODUCT_PRICE").val();
                        }
                        else {
                            $('#Draft').prop('disabled', false);
                            $('#Submit').prop('disabled', false);
                            swal('Info', 'Product Price cannot be less than 0.', 'info');
                            ss_Flag = false;
                            return false;
                        }
                        for (var i = 0; i < Input_Columns.length; i++) {
                            if (dec.indexOf(Input_Columns[i]) != -1) {
                                var disallow_Decimal = true;
                            }
                            else {
                                var disallow_Decimal = false;
                            }
                            if (Input_Columns[i] == "OPENING_BALANCE") {
                                if ($(this).find("#OPENING_BALANCE").val() >= 0) {
                                    obj.Opening_Balance = $(this).find("#OPENING_BALANCE").val();
                                    var OB = $.grep(product_List, function (v) { return v.Product_Code == PC; })[0].Opening_Balance;
                                    if (obj.Opening_Balance != OB) {
                                        obj.Is_Manually_Edited = 1;
                                        obj.hdn_Opening_Balance = OB;
                                    }
                                    else {
                                        obj.Is_Manually_Edited = 0;
                                        obj.hdn_Opening_Balance = $(this).find("#OPENING_BALANCE").val();
                                    }
                                }
                                else {
                                    $('#Draft').prop('disabled', false);
                                    $('#Submit').prop('disabled', false);
                                    swal('Info', 'Opening Balance cannot be less than 0.', 'info');
                                    ss_Flag = false;
                                    return false;
                                }
                                if (disallow_Decimal) {
                                    if (obj.Opening_Balance.split('.').length > 1) {
                                        $('#Draft').prop('disabled', false);
                                        $('#Submit').prop('disabled', false);
                                        swal('Info', 'Please do not enter decimal values in Opening Balance', 'info');
                                        ss_Flag = false;
                                        return false;
                                    }
                                }
                            }
                            if (Input_Columns[i] == "PURCHASE") {
                                if ($(this).find("#PURCHASE").val() == '') {
                                    $(this).find("#PURCHASE").val(0);
                                }
                                obj.Purchase = $(this).find("#PURCHASE").val();
                                var P = $.grep(product_List, function (v) { return v.Product_Code == PC; })[0].Purchase;
                                var PWT = $.grep(privilege_List, function (v) { return v.Privilege_Name == "SS_WHAT_TO_COMPUTE"; })[0].Privilege_Value;
                                if (PWT != "PURCHASE") {
                                    if (P >= 0) {
                                        if (obj.Purchase < 0) {
                                            $('#Draft').prop('disabled', false);
                                            $('#Submit').prop('disabled', false);
                                            swal('Info', 'Purchase cannot be less than 0', 'info');
                                            ss_Flag = false;
                                            return false;
                                        }
                                    }
                                }
                                if (obj.Purchase != P) {
                                    obj.Purchase_Edited = 1;
                                    obj.hdnPurchase = P;
                                }
                                if (disallow_Decimal) {
                                    if (obj.Purchase.split('.').length > 1) {
                                        $('#Draft').prop('disabled', false);
                                        $('#Submit').prop('disabled', false);
                                        swal('Info', 'Please do not enter decimal values in Purchase', 'info');
                                        ss_Flag = false;
                                        return false;
                                    }
                                }
                            }
                            if (Input_Columns[i] == "PURCHASE_RETURN") {
                                if ($(this).find("#PURCHASE_RETURN").val() == '') {
                                    $(this).find("#PURCHASE_RETURN").val(0);
                                }
                                if ($(this).find("#PURCHASE_RETURN").val() >= 0) {
                                    obj.Purchase_Return = $(this).find("#PURCHASE_RETURN").val();
                                    var PR = $.grep(product_List, function (v) { return v.Product_Code == PC; })[0].Purchase_Return;
                                    if (obj.Purchase_Return != PR) {
                                        if (obj.Purchase_Edited != 1) {
                                            obj.Purchase_Edited = 1;
                                        }
                                    }
                                }
                                else {
                                    $('#Draft').prop('disabled', false);
                                    $('#Submit').prop('disabled', false);
                                    swal('Info', 'Purchase Return cannot be less than 0.', 'info');
                                    ss_Flag = false;
                                    return false;
                                }
                                if (disallow_Decimal) {
                                    if (obj.Purchase_Return.split('.').length > 1) {
                                        $('#Draft').prop('disabled', false);
                                        $('#Submit').prop('disabled', false);
                                        swal('Info', 'Please do not enter decimal values in Purchase Return', 'info');
                                        ss_Flag = false;
                                        return false;
                                    }
                                }
                            }
                            if (Input_Columns[i] == "SALES") {
                                if ($(this).find("#SALES").val() >= 0) {
                                    if ($(this).find("#SALES").val() == '') {
                                        $(this).find("#SALES").val(0);
                                    }
                                    obj.Sales = $(this).find("#SALES").val();
                                    var WTC = $.grep(privilege_List, function (v) { return v.Privilege_Name == "SS_WHAT_TO_COMPUTE"; })[0].Privilege_Value;
                                    var CF = $.grep(privilege_List, function (v) { return v.Privilege_Name == "SS_COMPUTED_FIELD_EDITABLE"; });
                                    if (CF.length > 0) {
                                        var CF = $.grep(privilege_List, function (v) { return v.Privilege_Name == "SS_COMPUTED_FIELD_EDITABLE"; })[0].Privilege_Value;
                                    }
                                    if (WTC == "SALES") {
                                        if (CF == "YES") {
                                            var inputFields = $(this).find('input[type=number]');
                                            inputFields.map(function (i, e) {
                                                if (formula.indexOf($(this).attr('id')) > -1) {
                                                    formula = formula.replace($(this).attr('id'), ($(this).val() == "" ? 0 : $(this).val()))
                                                }
                                            });
                                            if ($(this).find("#SALES").val() == '') {
                                                $(this).find("#SALES").val(0);
                                            }
                                            if (eval(formula) != $(this).find("#SALES").val()) {
                                                if (obj.Is_Manually_Edited == 0) {
                                                    obj.Is_Manually_Edited = 1;
                                                }
                                            }
                                        }
                                    }
                                }
                                else {
                                    $('#Draft').prop('disabled', false);
                                    $('#Submit').prop('disabled', false);
                                    swal('Info', 'Sales cannot be less than 0.', 'info');
                                    ss_Flag = false;
                                    return false;
                                }
                                if (disallow_Decimal) {
                                    if (obj.Sales.split('.').length > 1) {
                                        $('#Draft').prop('disabled', false);
                                        $('#Submit').prop('disabled', false);
                                        swal('Info', 'Please do not enter decimal values in Sales', 'info');
                                        ss_Flag = false;
                                        return false;
                                    }
                                }
                            }
                            if (Input_Columns[i] == "SALES_RETURN") {
                                if ($(this).find("#SALES_RETURN").val() == '') {
                                    $(this).find("#SALES_RETURN").val(0);
                                }
                                if ($(this).find("#SALES_RETURN").val() >= 0) {
                                    obj.Sales_Return = $(this).find("#SALES_RETURN").val();
                                }
                                else {
                                    $('#Draft').prop('disabled', false);
                                    $('#Submit').prop('disabled', false);
                                    swal('Info', 'Sales Return cannot be less than 0.', 'info');
                                    ss_Flag = false;
                                    return false;
                                }
                                if (disallow_Decimal) {
                                    if (obj.Sales_Return.split('.').length > 1) {
                                        $('#Draft').prop('disabled', false);
                                        $('#Submit').prop('disabled', false);
                                        swal('Info', 'Please do not enter decimal values in Sales Return', 'info');
                                        ss_Flag = false;
                                        return false;
                                    }
                                }
                            }
                            if (Input_Columns[i] == "TRANSIT") {
                                if ($(this).find("#TRANSIT").val() == '') {
                                    $(this).find("#TRANSIT").val(0);
                                }
                                obj.Transit = $(this).find("#TRANSIT").val();
                                if (disallow_Decimal) {
                                    if (obj.Transit.split('.').length > 1) {
                                        $('#Draft').prop('disabled', false);
                                        $('#Submit').prop('disabled', false);
                                        swal('Info', 'Please do not enter decimal values in Transit', 'info');
                                        ss_Flag = false;
                                        return false;
                                    }
                                }
                            }
                            if (Input_Columns[i] == "FREE_GOODS") {
                                if ($(this).find("#FREE_GOODS").val() == '') {
                                    $(this).find("#FREE_GOODS").val(0);
                                }
                                obj.Free_Goods = $(this).find("#FREE_GOODS").val();
                                if (disallow_Decimal) {
                                    if (obj.Free_Goods.split('.').length > 1) {
                                        $('#Draft').prop('disabled', false);
                                        $('#Submit').prop('disabled', false);
                                        swal('Info', 'Please do not enter decimal values in Free Goods', 'info');
                                        ss_Flag = false;
                                        return false;
                                    }
                                }
                            }
                            if (Input_Columns[i] == "EXPIRED_GOODS") {
                                if ($(this).find("#EXPIRED_GOODS").val() == '') {
                                    $(this).find("#EXPIRED_GOODS").val(0);
                                }
                                if ($(this).find("#EXPIRED_GOODS").val() >= 0) {
                                    obj.Expired_Goods = $(this).find("#EXPIRED_GOODS").val();
                                }
                                else {
                                    $('#Draft').prop('disabled', false);
                                    $('#Submit').prop('disabled', false);
                                    swal('Info', 'Expired Goods cannot be less than 0.');
                                    ss_Flag = false;
                                    return false;
                                }
                                if (disallow_Decimal) {
                                    if (obj.Expired_Goods.split('.').length > 1) {
                                        $('#Draft').prop('disabled', false);
                                        $('#Submit').prop('disabled', false);
                                        swal('Info', 'Please do not enter decimal values in Expired Goods', 'info');
                                        ss_Flag = false;
                                        return false;
                                    }
                                }
                            }
                            if (Input_Columns[i] == "DAMAGED_GOODS") {
                                if ($(this).find("DAMAGED_GOODS").val() == '') {
                                    $(this).find("DAMAGED_GOODS").val(0);
                                }
                                if ($(this).find("DAMAGED_GOODS").val() >= 0) {
                                    obj.Damaged_Goods = $(this).find("#DAMAGED_GOODS").val();
                                }
                                else {
                                    $('#Draft').prop('disabled', false);
                                    $('#Submit').prop('disabled', false);
                                    swal('Info', 'Damaged Goods cannot be less than 0', 'info');
                                    ss_Flag = false;
                                    return false;
                                }
                                if (disallow_Decimal) {
                                    if (obj.Damaged_Goods.split('.').length > 1) {
                                        $('#Draft').prop('disabled', false);
                                        $('#Submit').prop('disabled', false);
                                        swal('Info', 'Please do not enter decimal values in Damaged Goods', 'info');
                                        ss_Flag = false;
                                        return false;
                                    }
                                }
                            }
                            if (Input_Columns[i] == "CLOSING_BALANCE") {
                                if ($(this).find("#CLOSING_BALANCE").val() >= 0) {
                                    if ($(this).find("#CLOSING_BALANCE").val() == '') {
                                        $(this).find("#CLOSING_BALANCE").val(0);
                                    }
                                    obj.Closing_Balance = $(this).find("#CLOSING_BALANCE").val();
                                    var WTC = $.grep(privilege_List, function (v) { return v.Privilege_Name == "SS_WHAT_TO_COMPUTE"; })[0].Privilege_Value;
                                    var CF = $.grep(privilege_List, function (v) { return v.Privilege_Name == "SS_COMPUTED_FIELD_EDITABLE"; });
                                    if (CF.length > 0) {
                                        var CF = $.grep(privilege_List, function (v) { return v.Privilege_Name == "SS_COMPUTED_FIELD_EDITABLE"; })[0].Privilege_Value;
                                    }
                                    if (WTC == "CLOSING_BALANCE") {
                                        if (CF == "YES") {
                                            var inputFields = $(this).find('input[type=number]');
                                            inputFields.map(function (i, e) {
                                                if (formula.indexOf($(this).attr('id')) > -1) {
                                                    formula = formula.replace($(this).attr('id'), ($(this).val() == "" ? 0 : $(this).val()))
                                                }
                                            });
                                            if (eval(formula) != $(this).find("#CLOSING_BALANCE").val()) {
                                                if (obj.Is_Manually_Edited == 0) {
                                                    obj.Is_Manually_Edited = 1;
                                                }
                                            }
                                        }
                                    }
                                }
                                else {
                                    $('#Draft').prop('disabled', false);
                                    $('#Submit').prop('disabled', false);
                                    swal('Info', 'Closing Balance cannot be less than 0.', 'info');
                                    ss_Flag = false;
                                    return false;
                                }

                                if (disallow_Decimal) {
                                    if (obj.Closing_Balance.split('.').length > 1) {
                                        $('#Draft').prop('disabled', false);
                                        $('#Submit').prop('disabled', false);
                                        swal('Info', 'Please do not enter decimal values in Closing Balance', 'info');
                                        ss_Flag = false;
                                        return false;
                                    }
                                }
                            }
                        }
                        obj.Product_Remarks = $(this).find("#REMARKS").val();
                        arr.push(obj);
                    }
                });
            }
            else {
                $("#tblSSProductEntry table tbody tr").map(function (i, e) {
                    var obj = {};
                    var formula = $.grep(privilege_List, function (v) { return v.Privilege_Name == "SS_FORMULA_V1" }).map(a=>a.Privilege_Value)[0];
                    var Restrict_Decimal = No_decimal[0].Privilege_Value;
                    var product_Name = $(this).find("select").val();
                    if (product_Name != null && product_Name != undefined) {
                        var PC = $.grep(product_List, function (v) { return v.Product_Name == product_Name }).map(a=>a.Product_Code)[0];
                        if ($.grep(arr, function (e) { return e.Product_Code === PC; }).length > 0) {
                            $('#Draft').prop('disabled', false);
                            $('#Submit').prop('disabled', false);
                            swal('info', ' You cannot enter the same Product more than once.', 'info');
                            ss_Flag = false;
                            return false;
                        }
                        obj.Product_Code = PC;
                        obj.Division_Code = $.grep(product_List, function (v) { return v.Product_Code == PC }).map(a=>a.Division_Code)[0];
                        obj.Unit_Rate = $(this).find("#PRODUCT_PRICE").val();
                        for (var i = 0; i < Input_Columns.length; i++) {
                            if (Restrict_Decimal.includes(Input_Columns[i])) {
                                var disallow_Decimal = true;
                            }
                            else {
                                var disallow_Decimal = false;
                            }
                            if (Input_Columns[i] == "OPENING_BALANCE") {
                                obj.Opening_Balance = $(this).find("#OPENING_BALANCE").val();
                                var OB = $.grep(product_List, function (v) { return v.Product_Code == PC; })[0].Opening_Balance;
                                if (obj.Opening_Balance != OB) {
                                    obj.Is_Manually_Edited = 1;
                                    obj.hdn_Opening_Balance = OB;
                                }
                                else {
                                    obj.Is_Manually_Edited = 0;
                                    obj.hdn_Opening_Balance = $(this).find("#OPENING_BALANCE").val();
                                }
                                if (disallow_Decimal) {
                                    if (obj.Opening_Balance.split('.').length > 1) {
                                        $('#Draft').prop('disabled', false);
                                        $('#Submit').prop('disabled', false);
                                        swal('Info', 'Please do not enter decimal values in Opening Balance', 'info');
                                        ss_Flag = false;
                                        return false;
                                    }
                                }
                            }
                            if (Input_Columns[i] == "PURCHASE") {
                                if ($(this).find("#PURCHASE").val() == '') {
                                    $(this).find("#PURCHASE").val(0);
                                }
                                obj.Purchase = $(this).find("#PURCHASE").val();
                                var P = $.grep(product_List, function (v) { return v.Product_Code == PC; })[0].Purchase;
                                if (obj.Purchase != P) {
                                    obj.Purchase_Edited = 1;
                                    obj.hdnPurchase = P;
                                }
                                if (disallow_Decimal) {
                                    if (obj.Purchase.split('.').length > 1) {
                                        $('#Draft').prop('disabled', false);
                                        $('#Submit').prop('disabled', false);
                                        swal('Info', 'Please do not enter decimal values in Purchase', 'info');
                                        ss_Flag = false;
                                        return false;
                                    }
                                }
                            }
                            if (Input_Columns[i] == "PURCHASE_RETURN") {
                                if ($(this).find("#PURCHASE_RETURN").val() == '') {
                                    $(this).find("#PURCHASE_RETURN").val(0);
                                }
                                obj.Purchase_Return = $(this).find("#PURCHASE_RETURN").val();
                                var PR = $.grep(product_List, function (v) { return v.Product_Code == PC; })[0].Purchase_Return;
                                if (obj.Purchase_Return != PR) {
                                    if (obj.Purchase_Edited != 1) {
                                        obj.Purchase_Edited = 1;
                                    }
                                }
                                if (disallow_Decimal) {
                                    if (obj.Purchase_Return.split('.').length > 1) {
                                        $('#Draft').prop('disabled', false);
                                        $('#Submit').prop('disabled', false);
                                        swal('Info', 'Please do not enter decimal values in Purchase Return', 'info');
                                        ss_Flag = false;
                                        return false;
                                    }
                                }
                            }
                            if (Input_Columns[i] == "SALES") {
                                if ($(this).find("#SALES").val() == '') {
                                    $(this).find("#SALES").val(0);
                                }
                                obj.Sales = $(this).find("#SALES").val();
                                var WTC = $.grep(privilege_List, function (v) { return v.Privilege_Name == "SS_WHAT_TO_COMPUTE"; })[0].Privilege_Value;
                                var CF = $.grep(privilege_List, function (v) { return v.Privilege_Name == "SS_COMPUTED_FIELD_EDITABLE"; });
                                if (CF.length > 0) {
                                    var CF = $.grep(privilege_List, function (v) { return v.Privilege_Name == "SS_COMPUTED_FIELD_EDITABLE"; })[0].Privilege_Value;
                                }
                                if (WTC == "SALES") {
                                    if (CF == "YES") {
                                        var inputFields = $(this).find('input[type=number]');
                                        inputFields.map(function (i, e) {
                                            if (formula.indexOf($(this).attr('id')) > -1) {
                                                formula = formula.replace($(this).attr('id'), ($(this).val() == "" ? 0 : $(this).val()))
                                            }
                                        });
                                        if ($(this).find("#SALES").val() == '') {
                                            $(this).find("#SALES").val(0);
                                        }
                                        if (eval(formula) != $(this).find("#SALES").val()) {
                                            if (obj.Is_Manually_Edited == 0) {
                                                obj.Is_Manually_Edited = 1;
                                            }
                                        }
                                    }
                                }
                                if (disallow_Decimal) {
                                    if (obj.Sales.split('.').length > 1) {
                                        $('#Draft').prop('disabled', false);
                                        $('#Submit').prop('disabled', false);
                                        swal('Info', 'Please do not enter decimal values in Sales', 'info');
                                        ss_Flag = false;
                                        return false;
                                    }
                                }
                            }
                            if (Input_Columns[i] == "SALES_RETURN") {
                                if ($(this).find("#SALES_RETURN").val() == '') {
                                    $(this).find("#SALES_RETURN").val(0);
                                }
                                obj.Sales_Return = $(this).find("#SALES_RETURN").val();
                                if (disallow_Decimal) {
                                    if (obj.Sales_Return.split('.').length > 1) {
                                        $('#Draft').prop('disabled', false);
                                        $('#Submit').prop('disabled', false);
                                        swal('Info', 'Please do not enter decimal values in Sales Return', 'info');
                                        ss_Flag = false;
                                        return false;
                                    }
                                }
                            }
                            if (Input_Columns[i] == "TRANSIT") {
                                if ($(this).find("#TRANSIT").val() == '') {
                                    $(this).find("#TRANSIT").val(0);
                                }
                                obj.Transit = $(this).find("#TRANSIT").val();
                                if (disallow_Decimal) {
                                    if (obj.Transit.split('.').length > 1) {
                                        $('#Draft').prop('disabled', false);
                                        $('#Submit').prop('disabled', false);
                                        swal('Info', 'Please do not enter decimal values in Transit', 'info');
                                        ss_Flag = false;
                                        return false;
                                    }
                                }
                            }
                            if (Input_Columns[i] == "FREE_GOODS") {
                                if ($(this).find("#FREE_GOODS").val() == '') {
                                    $(this).find("#FREE_GOODS").val(0);
                                }
                                obj.Free_Goods = $(this).find("#FREE_GOODS").val();
                                if (disallow_Decimal) {
                                    if (obj.Free_Goods.split('.').length > 1) {
                                        $('#Draft').prop('disabled', false);
                                        $('#Submit').prop('disabled', false);
                                        swal('Info', 'Please do not enter decimal values in Free Goods', 'info');
                                        ss_Flag = false;
                                        return false;
                                    }
                                }
                            }
                            if (Input_Columns[i] == "EXPIRED_GOODS") {
                                if ($(this).find("#EXPIRED_GOODS").val() == '') {
                                    $(this).find("#EXPIRED_GOODS").val(0);
                                }
                                obj.Expired_Goods = $(this).find("#EXPIRED_GOODS").val();
                                if (disallow_Decimal) {
                                    if (obj.Expired_Goods.split('.').length > 1) {
                                        $('#Draft').prop('disabled', false);
                                        $('#Submit').prop('disabled', false);
                                        swal('Info', 'Please do not enter decimal values in Expired Goods', 'info');
                                        ss_Flag = false;
                                        return false;
                                    }
                                }
                            }
                            if (Input_Columns[i] == "DAMAGED_GOODS") {
                                if ($(this).find("DAMAGED_GOODS").val() == '') {
                                    $(this).find("DAMAGED_GOODS").val(0);
                                }
                                obj.Damaged_Goods = $(this).find("#DAMAGED_GOODS").val();
                                if (disallow_Decimal) {
                                    if (obj.Damaged_Goods.split('.').length > 1) {
                                        $('#Draft').prop('disabled', false);
                                        $('#Submit').prop('disabled', false);
                                        swal('Info', 'Please do not enter decimal values in Damaged Goods', 'info');
                                        ss_Flag = false;
                                        return false;
                                    }
                                }
                            }
                            if (Input_Columns[i] == "CLOSING_BALANCE") {
                                debugger;
                                if ($(this).find("#CLOSING_BALANCE").val() == '') {
                                    $(this).find("#CLOSING_BALANCE").val(0);
                                }
                                if ($(this).find("#CLOSING_BALANCE").val() >= 0) {
                                    debugger;
                                    obj.Closing_Balance = $(this).find("#CLOSING_BALANCE").val();
                                    var WTC = $.grep(privilege_List, function (v) { return v.Privilege_Name == "SS_WHAT_TO_COMPUTE"; })[0].Privilege_Value;
                                    var CF = $.grep(privilege_List, function (v) { return v.Privilege_Name == "SS_COMPUTED_FIELD_EDITABLE"; });
                                    if (CF.length > 0) {
                                        var CF = $.grep(privilege_List, function (v) { return v.Privilege_Name == "SS_COMPUTED_FIELD_EDITABLE"; })[0].Privilege_Value;
                                    }
                                    if (WTC == "CLOSING_BALANCE") {
                                        if (CF == "YES") {
                                            var inputFields = $(this).find('input[type=number]');
                                            inputFields.map(function (i, e) {
                                                if (formula.indexOf($(this).attr('id')) > -1) {
                                                    formula = formula.replace($(this).attr('id'), ($(this).val() == "" ? 0 : $(this).val()))
                                                }
                                            });
                                            if (eval(formula) != $(this).find("#CLOSING_BALANCE").val()) {
                                                if (obj.Is_Manually_Edited == 0) {
                                                    obj.Is_Manually_Edited = 1;
                                                }
                                            }
                                        }
                                    }
                                    if (disallow_Decimal) {
                                        if (obj.Closing_Balance.split('.').length > 1) {
                                            $('#Draft').prop('disabled', false);
                                            $('#Submit').prop('disabled', false);
                                            swal('Info', 'Please do not enter decimal values in Closing Balance', 'info');
                                            ss_Flag = false;
                                            return false;
                                        }
                                    }
                                }
                                else {
                                    $('#Draft').prop('disabled', false);
                                    $('#Submit').prop('disabled', false);
                                    swal('Info', 'Closing Balance cannot be less than 0.', 'info');
                                    ss_Flag = false;
                                    return false;
                                }
                            }
                        }
                        obj.Product_Remarks = $(this).find("#REMARKS").val();
                        arr.push(obj);
                    }
                });
            }
            var obj1 = {
                Company_Code: SecondarySales.defaults.Company_Code,
                Month: Month,
                Year: Year,
                Region_Code: Selected_Region_Code,
                Base_Code: stockCode,
                Entered_By: SecondarySales.defaults.LogUserCode,
                StatementDate: statementDate,
                BaseTypeCode: 'STOCKIEST',
                Existing_SS_Code: Edited_SS_Code,
                SS_Status: status
            }
            var objDetails = {
                lstSecondaryDetails: arr,
                obj: obj1
            }
            debugger;
            if (ss_Flag) {
                debugger;
                //var attachment = $.grep(privilege_List, function (ele, index) {
                //    return ele.Privilege_Name == "SS_ATTACHMENT_MANDATORY";
                //});
                var attachment = fnGetPrivilegeValue("SS_ATTACHMENT_MANDATORY", "NO");
                if (status == 1 && $('#fileUploader').val() == "" && attachment == "YES") {
                    swal('Info', ' Please Upload Attachment', 'info');
                    $("#Submit").prop('disabled', false);
                    $("#Draft").prop('disabled', false);
                    return false;
                }
                var det = SecondarySales.defaults.Company_Code + '/' + Selected_Region_Code + '/' + stockCode + '/' + Year + '/' + Month;
                final_Insert_Data = objDetails;
                SSCoreREST.requestInvoke('api/CheckForDoubleEntry', det, null, "GET", SecondarySales.ChkForDoubleEntry_SucessCallback, SecondarySales.ChkForDoubleEntry_FailureCallback);
                if (double_Entry_Check) {
                    if (final_Insert_Data.lstSecondaryDetails.length > 0) {
                        if ($('#fileUploader').val() != "") {
                            var fileData = $("#fileUploader").get(0);
                        }
                        var formdata = new FormData();
                        if ($('#fileUploader').val() != "") {
                            formdata.append('File_Name', fileData.files[0].name);
                            formdata.append('File_Data', fileData.files[0]);
                            gobfile = '';
                            $.ajax({
                                type: 'post',
                                url: '../SecondarySales/BlopUpload',
                                data: formdata,
                                cache: false,
                                contentType: false,
                                processData: false,
                                async: false,
                                success: function (response) {
                                    debugger;
                                    var lstAttachementArr = [];
                                    var obj = {
                                        "Company_Code": SecondarySales.defaults.Company_Code,
                                        "Attachments": response,
                                        //"Filename": response.file[0],
                                        "Customer_Code": SecondarySales.defaults.LogUserCode

                                    }
                                    lstAttachementArr.push(obj);
                                    final_Insert_Data.lstattachments = lstAttachementArr
                                },
                                error: function () {

                                }
                            });
                        }
                        else if (gobfile != '') {
                            var lstAttachementArr = [];
                            var obj = {
                                "Company_Code": SecondarySales.defaults.Company_Code,
                                "Attachments": gobfile,
                                //"Filename": response.file[0],
                                "Customer_Code": SecondarySales.defaults.LogUserCode

                            }
                            lstAttachementArr.push(obj);
                            final_Insert_Data.lstattachments = lstAttachementArr
                        }
                        else {
                            var lstAttachementArr = [];
                            var obj = {
                                "Company_Code": SecondarySales.defaults.Company_Code,
                                "Attachments": '',
                                //"Filename": response.file[0],
                                "Customer_Code": SecondarySales.defaults.LogUserCode

                            }

                            lstAttachementArr.push(obj);
                            final_Insert_Data.lstattachments = lstAttachementArr
                        }
                        SSCoreREST.requestInvoke('api/InsertSecondarySales', "", final_Insert_Data, "POST", SecondarySales.fnEntry_SuccessCallback, SecondarySales.fnEntry_FailureCallback, null, "JSON");
                    }
                    else {
                        $('#Draft').prop('disabled', false);
                        $('#Submit').prop('disabled', false);
                        swal('Info', ' Please enter atleast one product to Draft/Submit Secondary Sales', 'info');
                        return false;
                    }
                }
                else {
                    $('#Draft').prop('disabled', false);
                    $('#Submit').prop('disabled', false);
                }
            }
        }
    },

    ChkForDoubleEntry_SucessCallback: function (response) {
        debugger;
        if (response.Response.split('-')[0] == "2") {
            final_Insert_Data.obj.Existing_SS_Code = response.Response.split('-')[1];
            double_Entry_Check = true;
        }
        else if (response.Response.split('-')[0] == "1") {
            $('#Draft').prop('disabled', false);
            $('#Submit').prop('disabled', false);
            swal('Info', ' Secondary Sales has already been entered for the selected Year and Month combination . Please check in SS Entry History tab', 'info');
            double_Entry_Check = false;
            return false;
        }
        else if (response.Response.split('-')[0] == "0") {
            double_Entry_Check = true;
        }
    },

    ChkForDoubleEntry_FailureCallback: function (response) {

    },

    fnEntry_SuccessCallback: function (response) {
        debugger;
        if (response.Response == 'SUCCESS') {
            gobfile = '';
            if (final_Insert_Data.obj.SS_Status == "3") {
                if (global_variable != "plus") {
                    SecondarySales.fnReset();
                    $('#Draft').prop('disabled', false);
                    $('#Submit').prop('disabled', false);

                    $("#fileUploader").val('')
                    $("#fileUrl").html('')
                    swal('Success', 'Secondary Sales Entry Saved successfully', 'success');
                    return false;




                    //$('#dvStockistList').show();
                    //$('#dvShowProducts').show();
                    //$('#Draft').prop('visible', true);
                    //$('#Submit').prop('visible', true);
                }
                else {
                    $('#dvStockistList').show();
                    $('#dvShowProducts').show();
                    $('#Draft').prop('visible', true);
                    $('#Submit').prop('visible', true);
                    $('#Draft').prop('disabled', false);
                    $('#Submit').prop('disabled', false);


                }

            }
            else {
                SecondarySales.fnReset();
                $('#Draft').prop('disabled', false);
                $('#Submit').prop('disabled', false);
                $("#fileUploader").val('')
                $("#fileUrl").html('')
                swal('Success', 'Secondary Sales Applied successfully', 'success');
                return false;
            }
            //if (final_Insert_Data.obj.SS_Status == "1") {
            //    var auto_Approval = $.grep(privilege_List, function (v) {
            //        return v.Privilege_Name == "ALLOW_SS_AUTO_APPROVAL";
            //    });
            //    if (auto_Approval.length > 0) {
            //        if (auto_Approval[0].Privilege_Value == "YES") {
            //            var details = SecondarySales.defaults.Company_Code + '/' + stockCode + '/' + Year + '/' + Month;
            //            SSCoreREST.requestInvoke('api/AutoApproveSS', details, "", "GET", SecondarySales.fnAutoApproveSS_SuccessCallback, SecondarySales.fnAutoApproveSS_FailureCallback);
            //        }
            //        else {
            //            //if()
            //            //{
            //            //    SecondarySales.fnReset();
            //            //}
            //            SecondarySales.fnReset();
            //            $('#Draft').prop('disabled', false);
            //            $('#Submit').prop('disabled', false);
            //            $("#fileUploader").val('')
            //            $("#fileUrl").html('')
            //            swal('Success', 'Secondary Sales Applied successfully', 'success');
            //            return false;
            //        }
            //    }
            //    else {
            //        SecondarySales.fnReset();
            //        $('#Draft').prop('disabled', false);
            //        $('#Submit').prop('disabled', false);
            //        swal('Success', 'Secondary Sales Applied successfully', 'success');
            //        return false;
            //    }
            //}
        }
    },

    fnEntry_FailureCallback: function (response) {
        $('#Draft').prop('disabled', false);
        $('#Submit').prop('disabled', false);
        if (response.statusText != "Internal Server Error" && response.statusText != "error") {
            swal('Info', 'One Of The value Is Invalid Please Check .', 'info');
            return false;
        }
        else {

            swal('Info', 'There is an Network Error.Please try After Some time', 'info');
            return false;

        }

    },

    fnAutoApproveSS_SuccessCallback: function (response) {
        if (response.Response == "SUCCESS") {
            SecondarySales.fnReset();
            $('#Draft').prop('disabled', false);
            $('#Submit').prop('disabled', false);
            swal('Success', 'Secondary Sales Approved successfully', 'success');
            return false;
        }
        else {
            SecondarySales.fnReset();
            $('#Draft').prop('disabled', false);
            $('#Submit').prop('disabled', false);
            swal('Success', 'Secondary Sales Applied successfully but failed to approve', 'success');
            return false;
        }
    },

    fnAutoApproveSS_FailureCallback: function (response) {
        SecondarySales.fnReset();
        $('#Draft').prop('disabled', false);
        $('#Submit').prop('disabled', false);
        swal('Success', 'Secondary Sales Applied successfully but failed to approve', 'success');
        return false;
    },

    fnRemove: function (id) {
        debugger;
        $('#TOTAL_SALE_AMOUNT').val('');
        $('#TOTAL_CLOSING_AMOUNT').val('');
        $('#dvDraftAndSave').show();
        $('#dvReCal').show();
        if ($(id).parent().parent().children().children().children().children().length > 0) {
            var productName = $(id).parent().parent().children().children().children().children()[0].value;
            var disjson = $.grep(product_Name_List, function (ele, index) {
                return ele.label == productName;
            });
            lstEnteredProducts = lstEnteredProducts.filter(function (item) {
                return item !== disjson[0].Id;
            });
        }
        $(id).parent().parent().remove();

    },
    fnHideDisplay: function () {
        $('#dvShowProducts').hide();
        $('#tblSSProductEntry').hide();
        $('.actionButtons').hide();
        $('.plusbtn').hide();
        $('#divattachment').hide();
        $('#tblSSStockistEntryHeader').hide();
    },

    fnSelectAll: function () {
        debugger;
        if ($("#selectAllProducts").prop('checked') == false) {
            for (var i = 0; i < product_List.length; i++) {
                var productCode = product_List[i].Product_Code;
                lstUnMappedProducts = lstUnMappedProducts.filter(function (item) {
                    return item !== productCode;
                });
                if (!($.inArray(productCode, lstCheckMappedProd) == -1)) {
                    lstEnteredProducts.push(productCode);
                }
                lstCheckMappedProd = lstCheckMappedProd.filter(function (item) {
                    return item !== productCode;
                });
                $("#Produt_" + i).attr('checked', true);
            }
        }
        else {
            for (var i = 0; i < product_List.length; i++) {
                var productCode = product_List[i].Product_Code;
                if (product_List[i].Is_Mandatory != 1) {
                    if ($("#Produt_" + i).prop('checked') == true) {
                        if (!($.inArray(productCode, lstEnteredProducts) == -1)) {
                            lstCheckMappedProd.push(productCode);
                            lstUnMappedProducts.push(productCode);
                        }
                        lstEnteredProducts = lstEnteredProducts.filter(function (item) {
                            return item !== productCode;
                        });
                        $("#Produt_" + i).attr('checked', false);
                    }
                    else {
                        lstUnMappedProducts = lstUnMappedProducts.filter(function (item) {
                            return item !== productCode;
                        });

                        if (!($.inArray(productCode, lstCheckMappedProd) == -1)) {
                            lstEnteredProducts.push(productCode);
                        }
                        lstCheckMappedProd = lstCheckMappedProd.filter(function (item) {
                            return item !== productCode;
                        });
                        $("#Produt_" + i).attr('checked', true);
                    }
                }
            }
        }
    },
    highlight: function (cell) {
        cell.style.borderColor = "green";
    },

    fnReCalculate: function () {
        debugger;

        $('#dvReCal').hide();
        $("#tblSSProductEntry table tbody tr").map(function (i, e) {

            var computeColumn = $.grep(privilege_List, function (v) { return v.Privilege_Name == "SS_WHAT_TO_COMPUTE" }).map(a=>a.Privilege_Value)[0];
            var formula = $.grep(privilege_List, function (v) { return v.Privilege_Name == "SS_FORMULA_V1" }).map(a=>a.Privilege_Value)[0];
            var inputFields = $(this).find('input[type=number]');
            inputFields.map(function (i, e) {
                if (formula.indexOf($(this).attr('id')) > -1) {
                    formula = formula.replace($(this).attr('id'), ($(this).val() == "" ? 0 : $(this).val()))
                }
            });
            var product_Name = $(this).find("select").val();
            var computeColumn = $.grep(privilege_List, function (v) { return v.Privilege_Name == "SS_WHAT_TO_COMPUTE" }).map(a=>a.Privilege_Value)[0];

            if (computeColumn == "CLOSING_BALANCE") {
                //$("#"+computeColumn+"").removeClass("computedfield").addClass("changecolor");
                $(this).find("#SALES_AMOUNT").val(($(this).find("#SALES").val() * $(this).find("#PRODUCT_PRICE").val()).toFixed(2));
            }
            else {
                //$("#" + computeColumn + "").removeClass("computedfield").addClass("changecolor");
                $(this).find("#CLOSING_BALANCE_AMOUNT").val(($(this).find("#CLOSING_BALANCE").val() * $(this).find("#PRODUCT_PRICE").val()).toFixed(2));
                //if($(this).find("#CLOSING_BALANCE").val()=='')//
                //{
                //    $(this).find("#CLOSING_BALANCE").val(0);
                //}
            }
            var a = ($(this).find("#PURCHASE").val() * $(this).find("#PRODUCT_PRICE").val()).toFixed(2);
            $(this).find("#PURCHASE_AMOUNT").val(a);
            var b = ($(this).find("#OPENING_BALANCE").val() * $(this).find("#PRODUCT_PRICE").val()).toFixed(2);
            $(this).find("#OPENINGBALANCE_AMOUNT").val(b);
            //inputFields.map(function (i, e) {
            //    if (formula.indexOf($(this).attr('id')) > -1) {
            //        formula = formula.replace($(this).attr('id'), ($(this).val() == "" ? 0 : $(this).val()))
            //    }
            //});
            if (computeColumn != $(this).attr('id')) {
                ($(this).find('#' + computeColumn).val(eval(formula)));//.toFixed(2)
            }
            //if (computeColumn != $(this).attr('id')) {
            //    if ($(this).find('#' + computeColumn).attr('data') != '1') {
            //        $(this).find('#' + computeColumn).val(eval(formula));
            //    }

            //}

            if (computeColumn == "CLOSING_BALANCE") {
                $(this).find("#CLOSING_BALANCE_AMOUNT").val(($(this).find("#CLOSING_BALANCE").val() * $(this).find("#PRODUCT_PRICE").val()).toFixed(2));//.toFixed(2)
            }
            else if (computeColumn == "SALES") {
                $(this).find("#SALES_AMOUNT").val(($(this).find("#SALES").val() * $(this).find("#PRODUCT_PRICE").val()).toFixed(2));//.toFixed(2)
            }
            else if (computeColumn == "PURCHASE") {
                $(this).find("#CLOSING_BALANCE_AMOUNT").val(($(this).find("#CLOSING_BALANCE").val() * $(this).find("#PRODUCT_PRICE").val()).toFixed(2));//.toFixed(2)
                $(this).find("#SALES_AMOUNT").val(($(this).find("#SALES").val() * $(this).find("#PRODUCT_PRICE").val()).toFixed(2));//.toFixed(2)
            }
            var total_sale_Amount = 0;
            $("#tblSSProductEntry table tbody #SALES_AMOUNT").map(function (i, e) {
                total_sale_Amount = total_sale_Amount + parseFloat($(this).val());
            });
            $("#TOTAL_SALE_AMOUNT").val((total_sale_Amount).toFixed(2));//.toFixed(2)
            //var cb = $(this).find("#OPENING_BALANCE").val();
            //$(this).find("#CLOSING_BALANCE").val(cb)
            // Total Closing Amount Calculation.
            var total_closing_Amount = 0;
            $("#tblSSProductEntry table tbody #CLOSING_BALANCE_AMOUNT").map(function (i, e) {
                total_closing_Amount = total_closing_Amount + parseFloat($(this).val());
            });
            $("#TOTAL_CLOSING_AMOUNT").val((total_closing_Amount).toFixed(2));//.toFixed(2)
        });
        //var a = $(this).find("#PURCHASE").val() * $(this).find("#PRODUCT_PRICE").val();
        //$("#PURCHASE_AMOUNT").val(a);
        //var b = $(this).find("#OPENING_BALANCE").val() * $(this).find("#PRODUCT_PRICE").val();
        //$("#OPENINGBALANCE_AMOUNT").val(b);
        if (Edited_SS_Code == '') {
            Edited_SS_Code = 0;
        }
        $('#dvDraftAndSave').show();
    },
    fnEditReCalculate: function () {
        debugger;
        $('#dvReCal').hide();
        $("#tblSSProductEntry table tbody tr").map(function (i, e) {
            //var a = $(this).find("#PURCHASE").val() * $(this).find("#PRODUCT_PRICE").val();
            //$("#PURCHASE_AMOUNT").val(a);
            //var b = $(this).find("#OPENING_BALANCE").val() * $(this).find("#PRODUCT_PRICE").val();
            //$("#OPENINGBALANCE_AMOUNT").val(b);
            var computeColumn = $.grep(privilege_List, function (v) { return v.Privilege_Name == "SS_WHAT_TO_COMPUTE" }).map(a=>a.Privilege_Value)[0];
            var formula = $.grep(privilege_List, function (v) { return v.Privilege_Name == "SS_FORMULA_V1" }).map(a=>a.Privilege_Value)[0];
            //  var inputFields = $(this).find('input[type=number]');
            var inputFields = $(this).find('input[type=number]');

            inputFields.map(function (i, e) {
                if (formula.indexOf($(this).attr('id')) > -1) {
                    formula = formula.replace($(this).attr('id'), ($(this).val() == "" ? 0 : $(this).val()))
                }
            });
            var product_Name = $(this).find("select").val();
            var computeColumn = $.grep(privilege_List, function (v) { return v.Privilege_Name == "SS_WHAT_TO_COMPUTE" }).map(a=>a.Privilege_Value)[0];

            if (computeColumn == "CLOSING_BALANCE") {
                $(this).find("#SALES_AMOUNT").val(($(this).find("#SALES").val() * $(this).find("#PRODUCT_PRICE").val()).toFixed(2));
            }
            else {
                $(this).find("#CLOSING_BALANCE_AMOUNT").val(($(this).find("#CLOSING_BALANCE").val() * $(this).find("#PRODUCT_PRICE").val()).toFixed(2));

            }

            if (computeColumn != $(this).attr('id')) {
                $(this).find('#' + computeColumn).val(eval(formula).toFixed(2));//.toFixed(2)
            }
            if (computeColumn == "CLOSING_BALANCE") {
                $(this).find("#CLOSING_BALANCE_AMOUNT").val(($(this).find("#CLOSING_BALANCE").val() * $(this).find("#PRODUCT_PRICE").val()).toFixed(2));//.toFixed(2)
            }
            else if (computeColumn == "SALES") {
                $(this).find("#SALES_AMOUNT").val(($(this).find("#SALES").val() * $(this).find("#PRODUCT_PRICE").val()).toFixed(2));//.toFixed(2)
            }
            else if (computeColumn == "PURCHASE") {
                $(this).find("#CLOSING_BALANCE_AMOUNT").val(($(this).find("#CLOSING_BALANCE").val() * $(this).find("#PRODUCT_PRICE").val()).toFixed(2));//.toFixed(2)
                $(this).find("#SALES_AMOUNT").val(($(this).find("#SALES").val() * $(this).find("#PRODUCT_PRICE").val()).toFixed(2));//.toFixed(2)
            }
            var total_sale_Amount = 0;
            $("#tblSSProductEntry table tbody #SALES_AMOUNT").map(function (i, e) {
                total_sale_Amount = total_sale_Amount + parseFloat($(this).val());
            });
            $("#TOTAL_SALE_AMOUNT").val((total_sale_Amount).toFixed(2));//.toFixed(2)
            //var cb = $(this).find("#OPENING_BALANCE").val();
            //$(this).find("#CLOSING_BALANCE").val(cb)
            // Total Closing Amount Calculation.
            var total_closing_Amount = 0;
            $("#tblSSProductEntry table tbody #CLOSING_BALANCE_AMOUNT").map(function (i, e) {
                total_closing_Amount = total_closing_Amount + parseFloat($(this).val());
            });
            $("#TOTAL_CLOSING_AMOUNT").val((total_closing_Amount).toFixed(2));//.toFixed(2)
        });
        if (Edited_SS_Code == '') {
            Edited_SS_Code = 0;
        }
        $('#dvDraftAndSave').show();
    },
    fnCanEnterSS_SuccessCallback: function (response) {
        debugger;
        if (response.Response != 'NO ISSUE') {
            can_Enter_SS = false;
            swal('Info', response.Response, 'info');
            return false;
        }
    },

    fnCanEnterSS_FailureCallback: function (response) {
        debugger;
    },
    fnCheckForMonthsToBeSkippedinEditSuccessCallback: function (response) {
        if (response.Response.length > 0) {
            if ($.grep(privilege_List, function (ele, index) {
                   return ele.Privilege_Name == "ALLOW_SS_SEQUENTIAL_ENTRY";
            }).length > 0) {
                if ($.grep(privilege_List, function (ele, index) {
                return ele.Privilege_Name == "ALLOW_SS_SEQUENTIAL_ENTRY";
                })[0].Privilege_Value == "YES") {
                    SEQUENCE_ENTRY = true;
                }
            }
            if (response.Response[0].result == 'False') {

                swal('Info', 'You cannot enter the Secondary Sales for This Month  , Because of  Sequential Entry', 'info');

                can_skip = false;
                $("#tblSSProductEntry").hide();
                $("#tblSSStockistEntryHeader").hide();
                $('.actionButtons').hide();
                $('.actionButtons').hide();
                $(".btn-circle").hide();
                $('.plusbtn').hide();
                $('#divattachment').hide();
            }
            else {
                can_skip = true;


            }
        }
        else {
            can_skip = true;


        }

    },
    fnCheckForMonthsToBeSkippedinEditFailureCallback: function () {
        $("#tblSSProductEntry").show();
        $("#tblSSStockistEntryHeader").show();
        $('.actionButtons').show();
        $('.actionButtons').show();
        $('.plusbtn').show();
        $('#divattachment').show();
    }
}
function fnValidateDecimal(Id, event) {
    debugger;
    if (event.keyCode == 46) {
        return false;
    }
}
function fnvalidatetransit(Id, event) {
    debugger;
    var RE = new RegExp(/^\d*\.?\d{0,1}$/g);
    if (RE.test(value)) {
        return true;
    } else {
        return false;
    }
}

