
//Lists
var stockistList_g = ""; userPrivilegeContainer_g = ""; PreviousSSDetails = ""; productPrice_g = ""; productAutofill_g = "";
var productjsonString = "";
var productjsonStringPop = ""; SS_DynamicColumns_g = "";


//Arrays
var inputColumnArr = new Array();

//variables
var regionCode = ""; selectedUserCode = "";
var ssformulas = ""; editMode = ""; priceEdit = ""; inputColumn = ""; compute = "";
var checkIsPSPrefill = ""; PSDetails = ""; PSPrefillDetails = "";
var rowNumber = "", tableCount = ""; openingBalEdit = "";
var stockistEntries_g = "";


function fnValidateUserSelection() {
    debugger;
    if ($('input[name=selsingluser]:checked').length == 0) {
        fnMsgAlert('info', 'Secondary Sales', 'Please select a user of the region ' + regionName + ' to get all the privileges.');
        return false;
    } else {
        $('#UserList').modal('hide');
    }
}

function fnGetCountofUsersByRegion(selectedRegion) {
    debugger;
    regionCode = selectedRegion.split('_')[0];
    $.ajax({
        type: "GET",
        url: "../HiDoctor_Activity/SecondarySales/GetUsersByRegion",
        data: "regionCode=" + regionCode,
        success: function (resp) {
            if (resp.length > 1) {
                fnBindListofUsersByRegionHTML(resp);
            } else {
                fnCreateSecondarySalesTable(regionCode);
            }
        },
    });
}

function fnBindListofUsersByRegionHTML(resp) {
    debugger;
    var content = "";
    if (resp.length > 0) {
        for (var i = 0; i < resp.length; i++) {
            content += '<input  type="radio" name="selsingluser" id="radiouser' + i + '" onclick="fnGetPrivilegesBasedonSelectedUser(\'' + resp[i].Region_Code + '\',\'' + resp[i].User_Code + '\',\'' + resp[i].User_Type_Code + '\');">' + resp[i].Region_Name + '(' + resp[i].Region_Type_Name + ')' + '-' + resp[i].User_Name + '(' + resp[i].User_Type_Name + ')<br>';
        }
    }
    $('#UserListBody').html(content);
    $('#UserList').modal('show');
}

function fnGetPrivilegesBasedonSelectedUser(userCode, regionCode, usertypeCode) {
    debugger;
    $.ajax({
        type: "GET",
        url: "../HiDoctor_Activity/SecondarySales/GetUserPrivileges",
        data: "regionCode=" + regionCode + "&userCode=" + userCode + "&usertypeCode=" + usertypeCode,
        success: function (resp) {
            $('#UserList').modal('hide');
            userPrivilegeContainer_g = resp;
            if (userPrivilegeContainer_g[1] != null) {
                if (userPrivilegeContainer_g[1].Data[0] != undefined) {
                    selectedUserCode = userPrivilegeContainer_g[1].Data[0].UserCode;
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
        },
    });
}

function fnvalidateInputsSel() {
    var flag = true;
    if ($('#txtMonth').val() == "" || $('#txtMonth').val() == undefined || $('#txtMonth').val() == null) {
        fnMsgAlert('info', 'Secondary Sales', 'Please select Month & Year to get Stockist(s).');
        flag = false;
        return;
    }
    return flag;
}

function fnGetSSStockistBasedonInput() {
    debugger;
    $('#dvStockGrid').hide();
    //var month = $('#drpMonth :selected').val();
    //var year = $('#drpYear :selected').val();
    var monthYear = $('#txtMonth').val();
    var month = fnGetMonth(monthYear.split('-')[0]);
    var year = monthYear.split('-')[1];
    $('#txtStatmentDate').datepicker('destroy');
    fnSecondarySalesResetStockistGrid();
    var result = fnvalidateInputsSel();
    fnGetDateBasedonMonthandYear(month, year);
    if (result) {
        $.blockUI()
        $.ajax({
            type: "GET",
            url: "../HiDoctor_Activity/SecondarySales/GetSSStockistBasedOnInput",
            data: "regionCode=" + regionCode + "&month=" + month + "&year=" + year,
            success: function (resp) {
                fnBindSSStockiestHTML(resp);
            },
            complete: function (e) {
                $.unblockUI();
                fnGetSSDetailsHistory(month, year);
            }
        });
    }
}

function fnBindSSStockiestHTML(resp) {
    debugger;
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yy = today.getFullYear();
    var curreDate = yy + '/' + mm + '/' + dd;
    var CDate = new Date(curreDate);
    if (resp.length > 0) {
        var lstStockist = "["
        for (var i = 0; i < resp.length; i++) {
            var stockistName = "";
            var Effct_To = resp[i].Effective_To;
            Effct_To = Effct_To.split('/')[2] + '/' + Effct_To.split('/')[1] + '/' + Effct_To.split('/')[0];
            var EffDate = new Date(Effct_To);
            if (resp[i].Ref_Key1 == "0") {
                if (EffDate >= CDate) {
                    stockistName = resp[i].Customer_Name + "-(No Ref Key)-" + "(" + resp[i].Effective_From + "-Active...)";
                } else {
                    stockistName = resp[i].Customer_Name + "-(No Ref Key)-" + "(" + resp[i].Effective_From + "-" + resp[i].Effective_To + ")";
                }
            } else {
                if (EffDate >= CDate) {
                    stockistName = resp[i].Customer_Name + "-(" + resp[i].Ref_Key1 + ")-" + "(" + resp[i].Effective_From + "-Active...)";
                } else {
                    stockistName = resp[i].Customer_Name + "-(" + resp[i].Ref_Key1 + ")-" + "(" + resp[i].Effective_From + "-" + resp[i].Effective_To + ")";
                }
            }
            lstStockist += "{label:" + '"' + "" + stockistName + "" + '",' + "value:" + '"' + "" + resp[i].Customer_Code + "" + '"' + "}";
            if (i < resp.length - 1) {
                lstStockist += ",";
            }
        }
        lstStockist += "];";
        stockistList_g = eval(lstStockist);
        $("#txtStockiestName").unautocomplete();
        autoComplete(stockistList_g, "txtStockiestName", "hdnStockiestCode", 'autoStockiest');
        if (!managerorchild) {
            $('#dvStockGrid').show();
        }
    } else {
        if (!managerorchild) {
            $('#dvStockGrid').hide();
            fnMsgAlert('info', 'Secondary Sales', 'No Stockist Found.');
            return false;
        }
    }
}

function fnSecondarySalesResetStockistGrid() {
    debugger;
    $('#hdnStatus').val('');
    //$('#drpMonth').attr('disabled', false);
    //$('#drpYear').attr('disabled', false);
    $('#txtMonth').attr('disabled', false);
    $('#txtStatmentDate').attr('disabled', false);
    $('#txtStockiestName').attr('disabled', false);
    $('#txtStatmentDate').val('');
    $('#SecondarySalesDetails').hide();
    $('#productopoupLink').hide();
    $("#divInput").hide();
    $("#txtStockiestName").removeAttr('readonly');
    $('#btnGoForProd').attr('disabled', false);
    $("#txtStockiestName").val('');
    $("#dvMainHeader").show();
    $('#unapprovedRemarks').html('');
    $('#stckstrefkey').html('');
    $('#effctfrm').html('');
    $('#effctto').html('');
    $('#stockistdetblr').hide();
    $('#dvStockGrid').hide();
    $('#btnGoForProd').attr('disabled', false);
    $('#btnGo').attr('disabled', false);
    $("#divReport").hide();

    stockistList_g = "";
    PreviousSSDetails = "";
    productPrice_g = "";
    productAutofill_g = "";
    productjsonString = "";
    productjsonStringPop = "";
    SS_DynamicColumns_g = "";
    checkIsPSPrefill = "";
    PSDetails = "";
    PSPrefillDetails = "";
    rowNumber = "",
    tableCount = "";
    stockistEntries_g = "";
}

function fnFillSelectedStockistDetails(Id) {
    debugger;
    var stockist_Name = "";
    if ($('#' + Id.id).val() != "") {
        stockist_Name = $('#' + Id.id).val();
    }
    if (stockist_Name != "") {
        var i = "false";
        var s = "";
        for (var o = 0; o < stockistList_g.length; o++) {
            if (stockistList_g[o].label == stockist_Name) {
                i = "true";
                s = stockistList_g[o].value;
            }
        }
        if (i == "false") {
            $("#hdnStockiestCode").val(0);
            $('#stckstrefkey').html('');
            $('#effctfrm').html('');
            $('#effctto').html('');
            $('#stockistdetblr').hide();
        } else {
            $("#hdnStockiestCode").val(s);
            var stock_ref_key = stockist_Name.split('-')[1].replace('(', '').replace(')', '');
            var effect_frm = stockist_Name.split('-')[2].replace('(', '');
            var effect_to = stockist_Name.split('-')[3].replace(')', '');
            $('#stckstrefkey').html(stock_ref_key);
            $('#effctfrm').html(effect_frm);
            $('#effctto').html(effect_to);
            $('#stockistdetblr').show();
        }
    } else {
        $("#hdnStockiestCode").val(0);
        $('#stckstrefkey').html('');
        $('#effctfrm').html('');
        $('#effctto').html('');
        $('#stockistdetblr').hide();
    }
}


function fnCreateSecondarySalesTable(selectedRegion) {
    debugger;
    $('#UserList').modal('hide');
    regionCode = selectedRegion.split('_')[0];
    userPrivilegeContainer_g = "";
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/Master/GetUserPrivileges',
        data: 'regionCode=' + regionCode,
        success: function (response) {
            userPrivilegeContainer_g = response;
            if (userPrivilegeContainer_g[1] != null) {
                if (userPrivilegeContainer_g[1].Data[0] != undefined) {
                    selectedUserCode = userPrivilegeContainer_g[1].Data[0].UserCode;
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
        },
    });
}

function fnCreateSecandryTable(userCode, regionCode) {
    debugger;
    if (userPrivilegeContainer_g != null) {
        $("#divInputHeader").show();
        var privilegelist_lcl = userPrivilegeContainer_g[0].Data;
        //************************SS_INPUT_COLUMNS***************************//
        inputColumn = $.grep(privilegelist_lcl, function (ele, index) {
            return ele.PrivilegeName == "SS_INPUT_COLUMNS";
        });
        if (inputColumn != false) {
            inputColumn = inputColumn[0].PrivilegeValue;
            inputColumnArr = inputColumn.split(',');
            inputColumnArr.push("REMARKS");
        }
        else {
            fnMsgAlert('info', 'Secondary Sales', '"SS INPUT COLUMNS" privilege not mapped.');
            $('#SecondarySalesDetails').hide();
            $('#productopoupLink').hide();
            $('#trStockiest').hide();
            $('#imgAdd').hide();
            $('#btnSubmit').hide();
            $("#divInputHeader").hide();
            return false;
        }
        /************************************************************************/

        //************************SS_WHAT_TO_COMPUTE***************************//
        compute = $.grep(privilegelist_lcl, function (ele, index) {
            return ele.PrivilegeName == "SS_WHAT_TO_COMPUTE";
        });
        if (compute != false) {
            compute = compute[0].PrivilegeValue;
        }
        else {
            fnMsgAlert('info', 'Secondary Sales', '"SS WHAT TO COMPUTE" privilege not mapped.');
            $('#SecondarySalesDetails').hide();
            $('#productopoupLink').hide();
            $('#trStockiest').hide();
            $('#imgAdd').hide();
            $('#btnSubmit').hide();
            $("#divInputHeader").hide();
            return false;
        }
        /************************************************************************/

        //*****************************SS_FORMULA******************************//

        ssformulas = $.grep(privilegelist_lcl, function (ele, index) {
            return ele.PrivilegeName == "SS_FORMULA";
        });
        if (ssformulas != false) {
            ssformulas = ssformulas[0].PrivilegeValue;
            fnSplitFormula(ssformulas);
        }
        else {
            fnMsgAlert('info', 'Secondary Sales', '"SS FORMULA" privilege not mapped.');
            $('#SecondarySalesDetails').hide();
            $('#productopoupLink').hide();
            $('#trStockiest').hide();
            $('#imgAdd').hide();
            $('#btnSubmit').hide();
            $("#divInputHeader").hide();
            return false;
        }
        /************************************************************************/

        //**********************SS_OPENING_BALANCE_EDITABLE***********************//

        openingBalEdit = $.grep(privilegelist_lcl, function (ele, index) {
            return ele.PrivilegeName == "SS_OPENING_BALANCE_EDITABLE"
        });
        if (openingBalEdit != false && openingBalEdit.length > 0) {
            openingBalEdit = openingBalEdit[0].PrivilegeValue;
        }
        else {
            openingBalEdit = "NO";

        }
        /************************************************************************/

        //****************************ALLOW_SS_PRICE_EDIT***********************//

        priceEdit = $.grep(privilegelist_lcl, function (ele, index) {
            return ele.PrivilegeName == "ALLOW_SS_PRICE_EDIT"
        });
        if (priceEdit != false) {
            priceEdit = priceEdit[0].PrivilegeValue;
        }
        else {
            priceEdit = "NO";
        }
        $('#btnSubmit').show();
        $('#trStockiest').show();
        $("#divReport").html('');
        $("#SecondarySalesDetails").html('');
        /************************************************************************/
    }
}

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
    var currentYear = currentDate_g.split('/')[2];
    currentYear = currentYear - 1;
    var yearselect = $("#drpYear");
    $('option', yearselect).remove();
    $('#drpYear').append("<option value='0'>-Select Year-</option>");
    for (var t = 0; t < 2; t++) {
        $('#drpYear').append("<option value='" + currentYear + "'>" + currentYear + "</option>");
        currentYear = currentYear + 1;
    }
    $("#drpYear").val('0');
}

function fnSecondarySalesReset() {
    $('#hdnStatus').val('');
    //$('#drpMonth').attr('disabled', false);
    //$('#drpYear').attr('disabled', false);
    $('#txtMonth').attr('disabled', false);
    $('#txtStatmentDate').attr('disabled', false);
    $('#txtStockiestName').attr('disabled', false);
    //$('#drpMonth').val(0);
    //$('#drpYear').val(0);
    $('#txtMonth').val('');
    $('#txtStatmentDate').val('');
    $('#SecondarySalesDetails').hide();
    $('#productopoupLink').hide();
    $("#divInput").hide();
    $("#txtStockiestName").removeAttr('readonly');
    $('#btnGoForProd').attr('disabled', false);
    $("#txtStockiestName").val('');
    $("#dvMainHeader").show();
    $('#unapprovedRemarks').html('');
    $('#stckstrefkey').html('');
    $('#effctfrm').html('');
    $('#effctto').html('');
    $('#stockistdetblr').hide();
    $('#dvStockGrid').hide();
    $('#btnGoForProd').attr('disabled', false);
    $('#btnGo').attr('disabled', false);
    $("#divReport").hide();
    stockistList_g = "";
    PreviousSSDetails = "";
    productPrice_g = "";
    productAutofill_g = "";
    productjsonString = "";
    productjsonStringPop = "";
    SS_DynamicColumns_g = "";
    checkIsPSPrefill = "";
    PSDetails = "";
    PSPrefillDetails = "";
    rowNumber = "",
    tableCount = "";
    stockistEntries_g = "";
}
function fnGetSSDetailsHistory(month, year) {
    debugger;
    $.ajax({
        type: "GET",
        url: "../HiDoctor_Activity/SecondarySales/GetSSDetailsForSelectedRegion",
        data: "regionCode=" + regionCode + "&month=" + month + "&year=" + year,
        success: function (resp) {
            PreviousSSDetails = resp;
            fnBindSSSummaryHTML(resp);
        }
    });
}
function fnBindSSSummaryHTML(resp) {
    debugger;
    var tableContent = "";
    tableContent += "<div><span style='font-weight:bold;font-style:italic'>Approved and Applied Secondary Sales records cannot be edited.</span></div>";
    tableContent += "<div style='background: #efefef; padding: 1%'><h2>Secondary Sales Transactions : </h2></div>";
    tableContent += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblSummary' >";
    tableContent += "<thead><tr>";
    tableContent += "<th>Region Name </th>";
    tableContent += "<th>SS.Month</th>";
    tableContent += "<th>SS.Year</th>";
    tableContent += "<th>Stockiest Name</th>";
    tableContent += "<th>SS StatementDate</th>";
    tableContent += "<th>Action</th>";
    tableContent += "<th>History</th>";
    tableContent += "<th>Status</th>";
    tableContent += "</tr></thead>";
    tableContent += "<tbody style='text-align:center;'>";
    if (resp.length > 0) {
        for (var i = 0; i < resp.length; i++) {
            tableContent += "<tr>";
            tableContent += "<td align='left' width='15%'>" + resp[i].Region_Name + "</td>";
            tableContent += "<td align='left' width='15%'>" + resp[i].MonthName + "</td>";
            tableContent += "<td align='left' width='15%'>" + resp[i].Year + "</td>";
            tableContent += "<td align='left' width='15%'>" + resp[i].Customer_Name + "</td>";
            tableContent += "<td align='left' width='15%'>" + resp[i].SS_Statement_Date + "</td>";
            if (resp[i].SS_Status.toUpperCase() == "APPLIED" || resp[i].SS_Status.toUpperCase() == "APPROVED") {
                tableContent += "<td align='left' width='15%'><span onclick='fnDetails(\"" + resp[i].Region_Code + "_" + resp[i].Month + "_" + resp[i].Year + "_" + resp[i].SS_Code + "_" + resp[i].SS_Statement_Date + "\")' style='text-decoration:underline;cursor:pointer'>View</span></td>";
            }
            else {
                if (regionCode == resp[i].Region_Code) {
                    tableContent += "<td align='left' width='15%'><span onclick='fnFillEdit(\"" + resp[i].Region_Code + "_" + resp[i].Month + "_" + resp[i].Year + "_" + resp[i].SS_Code + "_" + resp[i].SS_Statement_Date + "_" + resp[i].SS_Status + "\")' style='text-decoration:underline;cursor:pointer'>Edit</span>/<span onclick='fnDetails(\"" + resp[i].Region_Code + "_" + resp[i].Month + "_" + resp[i].Year + "_" + resp[i].SS_Code + "_" + resp[i].SS_Statement_Date + "\")' style='text-decoration:underline;cursor:pointer'>View</span></td>";

                } else {
                    tableContent += "<td align='left' width='15%'><span onclick='fnDetails(\"" + resp[i].Region_Code + "_" + resp[i].Month + "_" + resp[i].Year + "_" + resp[i].SS_Code + "_" + resp[i].SS_Statement_Date + "\")' style='text-decoration:underline;cursor:pointer'>View</span></td>";
                }
            }
            tableContent += "<td><span onclick='fnViewRemarksHistory(\"" + resp[i].Region_Code + "|" + resp[i].SS_Code + "\")' style='text-decoration:underline;cursor:pointer'>View History</span></td>";
            tableContent += "<td align='left' width='15%' " + GetColorCode(resp[i].SS_Status) + ">" + resp[i].SS_Status + "</td>";
            tableContent += "</tr>";
        }
        tableContent += "</tbody>";
        tableContent += "</table>";
        $("#divReport").html(tableContent);
        if ($.fn.dataTable) { $('#tblSummary').dataTable({ "sPaginationType": "full_numbers", "bSort": false, "bSortable": false }); };
    }
    else {
        tableContent += "<tr style='font-style:italic;font-weight:bold;text-align:center;'><td colspan='8'>No Secondary Sales Record(s) Found.</td></tr>";
        $("#divReport").html(tableContent);
    }
    $("#divReport").show();
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

function fnDetails(id) {
    debugger;
    var ssCode = id.split('_')[3];
    var disjson = $.grep(PreviousSSDetails, function (ele, index) {
        return ele.SS_Code == ssCode;
    });
    $('#SckstName').html(disjson[0].Customer_Name);
    var month = disjson[0].Month;
    var year = disjson[0].Year;
    var StatementDate = disjson[0].SS_Statement_Date;
    $('#monthSS').html(month);
    $('#yearSS').html(year);
    $('#SSSDate').html(StatementDate);
    $('#SSAmount').html(disjson[0].SS_Amount);
    var jsData = '';
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/SecondarySales/GetSSDetailsForSelectedRecord',
        data: 'userCodeDetails=' + id,
        success: function (response) {
            fnBindDetailedSSHTML(response);
        },
        complete: function () {
            $('#mymodal').modal('show');
            fnFixedcolum(1);
        }
    });
}

function fnBindDetailedSSHTML(resp) {
    debugger;
    var ColumnCount = 1;
    var tableContent = "";
    tableContent += '<div id="parent" class="parentDiv">';
    tableContent += ' <div class="divHead table-header ">';
    tableContent += '<table class="table table-bordered maintable" id="headertable" style="width: 0%; margin-bottom: 0px;border: 0px solid #ddd;">';
    tableContent += '<thead>';
    tableContent += "<tr>";
    tableContent += "<th class='col1'>Action</th>";
    tableContent += "<th class='col1'>Product Name</th>";
    tableContent += "<th class='col1'>Price per Unit</th>";
    tableContent += "<th class='col1'>Opening Balance</th>";
    tableContent += " <th class='col1'>Purchase</th>";
    tableContent += " <th class='col1'>Purchase Return</th>";
    tableContent += " <th class='col1'>Sales</th>";
    tableContent += " <th class='col1'>Sales Amount</th>";
    tableContent += " <th class='col1'>Sales Return</th>";
    tableContent += " <th class='col1'>Closing Balance</th>";
    tableContent += " <th class='col1'>Closing Amount</th>";
    tableContent += " <th class='col1'>Transit</th>";
    tableContent += " <th class='col1'>Free Goods</th>";
    tableContent += " <th class='col1'>Damaged Goods</th>";
    tableContent += " <th class='col1'>Expired Goods</th>";
    tableContent += " <th class='col1'>Remarks</th>";
    tableContent += "</tr></thead></table>";
    tableContent += "</div>";

    tableContent += '<div class="table-body" style="font-size:12px;overflow-x:hidden;">';
    tableContent += '<table class="table table-bordered maintable" id="bodytable" style="width: 0%; margin-bottom: 0px;border: 0px solid #ddd;">';
    tableContent += ' <tbody style="height: 200px;">';

    var totalSale = 0.00;
    var ClosingBalance = 0.00;
    var saleamount = 0.00;
    var totalsaleamount = 0.00;
    var closingAmount = 0.00;
    var totalclosingstock = 0.0;
    if (resp.length > 0) {
        debugger;
        for (var i = 0; i < resp.length; i++) {
            tableContent += "<tr id='rowDataPop_" + i + "' style='text-align: center;'>";
            if (resp[i].Input_DynamicCount > 0) {
                tableContent += "<td align='right'  class='col1'><i class='fa fa-minus' id='gridminuspop_" + i + "' style='font-size: 15px !important;display:none;' onclick='fnPopHideGridDynamic(" + i + ");' aria-hidden='true'></i><i class='fa fa-plus' style='font-size: 15px !important;' id='gridpluspop_" + i + "' onclick='fnPopShowGridDynamic(\"" + i + "\",\"" + resp[i].SS_Details_Code + "\");' aria-hidden='true'></i></td>";
            } else {
                tableContent += "<td  class='col1'></td>";
            }
            tableContent += "<td align='right'  class='col1'>" + resp[i].Product_Name + "</td>";
            tableContent += "<td class='col1'>" + resp[i].Price_per_Unit + "</td>";
            tableContent += "<td class='col1'>" + resp[i].Opening_Stock + "</td>";
            tableContent += "<td class='col1'>" + resp[i].Purchase + "</td>";
            tableContent += "<td class='col1'>" + resp[i].Purchase_Return + "</td>";
            tableContent += "<td class='col1'>" + resp[i].Sales + "</td>";
            saleamount = (parseFloat(resp[i].Price_per_Unit) * parseFloat(resp[i].Sales))
            tableContent += "<td class='col1'>" + saleamount.toFixed(2) + "</td>";
            tableContent += "<td class='col1'>" + resp[i].Sales_Return + "</td>";
            tableContent += "<td class='col1'>" + resp[i].Closing_Stock + "</td>";
            closingAmount = (parseFloat(resp[i].Price_per_Unit) * parseFloat(resp[i].Closing_Stock))
            tableContent += "<td class='col1'>" + closingAmount.toFixed(2) + "</td>";
            tableContent += "<td class='col1'>" + resp[i].Transit + "</td>";
            tableContent += "<td class='col1'>" + resp[i].Free_Goods + "</td>";
            tableContent += "<td class='col1'>" + resp[i].Damaged_Goods + "</td>";
            tableContent += "<td class='col1'>" + resp[i].Expired_Goods + "</td>";
            tableContent += "<td class='col1'>" + resp[i].Remarks + "</td>";
            tableContent += "</tr>";
            tableContent += "<tr id='rowDataDynaPop_" + i + "' class='dynaSSPop' style='display:none;background:#f1f1f1;'><td style='background-color:#f1f1f1 !important;' colspan='16' id='rowtdDyna_" + i + "'></td></tr>";
            totalSale += parseFloat(resp[i].Sales);
            ClosingBalance += parseFloat(resp[i].Closing_Stock);
            totalsaleamount += saleamount
            totalclosingstock += closingAmount
        }
        tableContent += "<tr style='text-align:center;'>";
        tableContent += "<td></td>";
        tableContent += "<td align='right' width='15%' style='font-weight:bold;text-align:center;'>Total</td>";
        tableContent += "<td></td>";
        tableContent += "<td></td>";
        tableContent += "<td></td>";
        tableContent += "<td></td>";
        tableContent += "<td style='font-weight:bold'>" + totalSale + "</td>";
        tableContent += "<td style='font-weight:bold'>" + totalsaleamount.toFixed(2) + "</td>";
        tableContent += "<td></td>";
        tableContent += "<td style='font-weight:bold'>" + ClosingBalance + "</td>";
        tableContent += "<td style='font-weight:bold'>" + totalclosingstock.toFixed(2) + "</td>";
        tableContent += "<td></td>";
        tableContent += "<td></td>";
        tableContent += "<td></td>";
        tableContent += "<td></td>";
        tableContent += "<td></td>";
        tableContent += "</tr>";
        tableContent += "</tbody></table></div></div>";
        $('#SSAmount').html(totalsaleamount.toFixed(2));
    }
    else {
        tableContent += "<tr ><td colspan='16' style='text-align:center;font-weight:bold;'>No Records(s) Found.</td></tr>";
    }
    $("#divModel").html(tableContent);
    $('#mymodal').modal('show');
    fnFixedcolum(2);
}
function fnFixedcolum(ColumnCount) {
    $('.maintable thead').css("width", $(".table-body").width());
    $('.maintable tbody').css("width", $(".table-body").width());
    $('.tblcollapse tbody').css("width", "fit-content");
    $('#reportRegion').css("width", $(".maintable thead").width());
    var fixcol = 0;
    while (ColumnCount > fixcol) {
        fixcol++;
        //header coumn.
        $('.maintable thead th:nth-child(' + fixcol + ')').css("position", "relative");
        $('.maintable thead th:nth-child(' + fixcol + ')').css("background-color", "#337ab7");
        $('.maintable tbody th:nth-child(' + fixcol + ')').css("border", "none");

        //row column.
        $('.maintable tbody tr td:nth-child(' + fixcol + ')').css("position", "relative");
        $('.maintable tbody tr td:nth-child(' + fixcol + ')').css("height", "40px");
        $('.maintable tbody tr td:nth-child(' + fixcol + ')').css("background-color", "#ebf2fa");
        $('.maintable tbody tr.dynaSSPop td:nth-child(' + fixcol + ')').css("background-color", "#f1f1f1");
        $('.maintable tbody tr td:nth-child(' + fixcol + ')').css("overflow-wrap", "break-word");
        $('#bodytable tbody').on('scroll', function (e) {
            $('#headertable thead').css("left", -$("#bodytable tbody").scrollLeft());
            for (var i = 1; i <= fixcol; i++) {
                $('#headertable thead th:nth-child(' + i + ')').css("left", $("#bodytable tbody").scrollLeft());
                $('#bodytable tbody td:nth-child(' + i + ')').css("left", $("#bodytable tbody").scrollLeft());
                $('thead .second_header_row th:nth-child(' + i + ')').css("position", "initial");
            }
        });
    }
    $(window).resize(function () {
        if ($(".table-body").width() < 1336) {
            $('.maintable thead').css("width", $(".table-body").width());
            $('.maintable tbody').css("width", $(".table-body").width());
            $('.tblcollapse tbody').css("width", "fit-content");
        }
        else {
            $('.maintable thead').css("width", $(".table-body").width());
            $('.maintable tbody').css("width", $(".table-body").width());
            $('.tblcollapse tbody').css("width", "fit-content");
        }
    });
    $(".table-body").on('scroll', function () {
        debugger;
        $(".table-header").offset({ left: -1 * this.scrollLeft });
    });
}
function fnGetDateBasedonMonthandYear(month, year) {
    debugger;
    var SDate = "";
    SDate = year + '/' + month + '/' + '01';
    if (SDate != '' && SDate != undefined) {
        $(function () {
            $('#txtStatmentDate').datepicker({
                dateFormat: 'dd/mm/yy',
                numberOfMonths: 1,
                maxDate: 0,
                changeMonth: true,
                changeYear: true,
                minDate: new Date(SDate)
            });
        });
    }
}

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function fnValidateBeforeProductBring() {
    debugger;
    var flag = true;
    //var monthVal = $('#drpMonth').val();
    //var yearVal = $('#drpYear').val();
    var monthYear = $('#txtMonth').val();
    var monthVal = fnGetMonth(monthYear.split('-')[0]);
    var yearVal = monthYear.split('-')[1];
    var days = daysInMonth(monthVal, yearVal);
    var startDate = new Date(yearVal + "/" + monthVal + "/" + days);
    var todayDate = curdate.split('.')[2] + '-' + curdate.split('.')[1] + '-' + days;
    var today = new Date(todayDate);

    //if ($('#drpMonth').val() == 0) {
    //    fnMsgAlert('info', 'Secondary Sales', 'Select month.');
    //    flag = false;
    //    return;
    //}
    //if ($('#drpYear').val() == 0) {
    //    fnMsgAlert('info', 'Secondary Sales', 'Select year.');
    //    flag = false;
    //    return;
    //}
    if ($('#txtMonth').val() == "" || $('#txtMonth').val() == undefined || $('#txtMonth').val() == null) {
        fnMsgAlert('info', 'Secondary Sales', 'Please select Month & Year to get Stockist(s).');
        flag = false;
        return;
    }
    if (startDate > today) {
        fnMsgAlert('info', 'Secondary Sales', 'Month & Year can not be a future Date.');
        flag = false;
        return;
    }
    if ($('#txtStockiestName').val() == '') {
        fnMsgAlert('info', 'Secondary Sales', 'Enter Stockiest Name.');
        $('#txtStockiestName').focus();
        return false;
    }
    if ($('#txtStatmentDate').val() == "") {
        fnMsgAlert('info', 'Secondary Sales', 'Select Statement Date.');
        flag = false;
        return;
    }
    if ($.trim($('#txtStatmentDate').val()).length > 0) {
        //var monthVal = $('#drpMonth').val();
        var monthYear = $('#txtMonth').val();
        var monthVal = fnGetMonth(monthYear.split('-')[0]);
        var yearVal = monthYear.split('-')[1];
        if (monthVal.length == 1) {
            monthVal = '0' + monthVal;
        }
        var yearVal = $('#drpYear').val();
        var DateVal = yearVal + "-" + monthVal + "-" + "01";
        var ssStatement = $.trim($('#txtStatmentDate').val());
        var ss = $.trim($('#txtStatmentDate').val()).split('/');
        var ssDate = ss[2] + "-" + ss[1] + "-" + ss[0];
        var ssMonth = ssStatement.split('/')[1];
        var ssYear = ssStatement.split('/')[2];
        if (monthVal.length > 0 && yearVal.length > 0) {
            if (ssDate < DateVal) {
                fnMsgAlert('info', 'Secondary Sales', 'Sales Statement date cannot be prior to Secondary Sales Month & Year.');
                flag = false;
                return;
            }
        }
    }
    return flag;
}
function fnReadSecondarySalesPrice() {
    debugger;
    $('#hdnStatus').val('');
    var customerCode = $("#hdnStockiestCode").val();
    //var monthVal = $('#drpMonth').val();
    //var yearVal = $('#drpYear').val();
    var monthYear = $('#txtMonth').val();
    var monthVal = fnGetMonth(monthYear.split('-')[0]);
    var yearVal = monthYear.split('-')[1];
    var days = daysInMonth(monthVal, yearVal);
    var startDate = new Date(yearVal + "/" + monthVal + "/" + days);
    $('#SecondarySalesDetails').hide();
    $('#productopoupLink').hide();
    $("#divInput").hide();

    //feature month validation
    var todayDate = curdate.split('.')[2] + '-' + curdate.split('.')[1] + '-' + days;
    var today = new Date(todayDate);

    if (fnValidateBeforeProductBring()) {
        $.blockUI();
        $('#drpMonth').attr('disabled', 'disabled');
        $('#drpYear').attr('disabled', 'disabled');
        $('#txtStockiestName').attr('disabled', 'disabled');
        $('#txtStatmentDate').attr('disabled', 'disabled');
        $('#btnGoForProd').attr('disabled', 'disabled');
        fnGetDynamicColumnsforGrid();

    }
}

var draftval = '1';
var product = '0';
function fnProductWisePrice() {
    debugger;
    var customerCode = $("#hdnStockiestCode").val();
    //var monthVal = $('#drpMonth').val();
    //var yearVal = $('#drpYear').val();
    var monthYear = $('#txtMonth').val();
    var monthVal = fnGetMonth(monthYear.split('-')[0]);
    var yearVal = monthYear.split('-')[1];
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/SecondarySales/GetPriceforSecondarySales',
        data: 'regionCode=' + regionCode + '&customer=' + customerCode + '&month=' + monthVal + '&year=' + yearVal,
        //async: false,
        success: function (response) {
            productPrice_g = response;
            if (productPrice_g.lstCheck[0].Is_Check != "0") {
                $('#SecondarySalesDetails').hide();
                $('#productopoupLink').hide();
                $("#divInput").hide();
                fnMsgAlert('info', 'Secondary Sales', 'Kindly get your secondary sales for the previous month approved else system will not allow you to make current month entry.');
                fnSecondarySalesReset();
                draftval = '1';
                product = '0';
                $.unblockUI();
                return false;
            }
            else {
                product = '1';
                draftval = '0';
            }

            if (parseInt(productPrice_g.lstisAvail[0].Is_Available) > 0) {
                $('#SecondarySalesDetails').hide();
                $('#productopoupLink').hide();
                $("#divInput").hide();
                $('#drpMonth').attr('disabled', false);
                $('#drpYear').attr('disabled', false);
                $('#txtStatmentDate').val('');
                $("#txtStockiestName").removeAttr('readonly');
                fnMsgAlert('info', 'Secondary Sales', 'Dear user you have already entered secondary sales for this customer in the subsequent months.');
                draftval = '1';
                product = '0';
                fnSecondarySalesReset();
                $.unblockUI();
                return false;

            }
            else {
                product = '1';
            }

            if ($('#hdnStatus').val() == "" && $('#hdnStatus').val() != null) {
                if (parseInt(productPrice_g.lststckstinhertd[0].Is_CurrentMonth) > 0) {
                    $('#SecondarySalesDetails').hide();
                    $('#productopoupLink').hide();
                    $("#divInput").hide();
                    $('#drpMonth').attr('disabled', false);
                    $('#drpYear').attr('disabled', false);
                    $('#txtStatmentDate').val('');
                    $("#txtStockiestName").removeAttr('readonly');
                    if (parseInt(productPrice_g.lststckstinhertd[0].Is_Inherited) == 1) {
                        fnMsgAlert('info', 'Secondary Sales', 'Dear user secondary sales is already entered for the selected customer.');
                        draftval = '1';
                        product = '0';
                        fnSecondarySalesReset();
                        $.unblockUI();
                        return false;
                    }
                    else {
                        fnMsgAlert('info', 'Secondary Sales', 'Dear user you have already entered secondary sales for this customer.');
                        draftval = '1';
                        product = '0';
                        $.unblockUI();
                        fnSecondarySalesReset();
                        return false;
                    }

                }
                if (product == '1') {
                    fnCheckMonthDiff();
                } else {
                    $.unblockUI();
                }
            }
        },
        complete: function () {
            //fnCheckOtherDetailsSS();
        }
    });
    draftval = '2';
}

var continueflag = false;
function fnCheckOtherDetailsSS() {
    debugger;
    if (product == '1') {
        fnCheckMonthDiff();
    } else {
        $.unblockUI();
    }
}

function fnCheckMonthDiff() {
    debugger;
    var latestmonth = "";
    var latestyear = "";
    //var month = $('#drpMonth').val();
    //var year = $('#drpYear').val();
    var monthYear = $('#txtMonth').val();
    var month = fnGetMonth(monthYear.split('-')[0]);
    var year = monthYear.split('-')[1];
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/SecondarySales/GetMonth',
        data: "&region_Code=" + regionCode + "&stockiest_Code=" + $("#hdnStockiestCode").val(),
        //async: false,
        success: function (result) {
            var data = eval('(' + result + ')');
            if (data.Tables[0].Rows.length != 0) {
                latestmonth = data.Tables[0].Rows[0].month;
                latestyear = data.Tables[0].Rows[0].year;

                var data = [];
                var monthsNotSubmit = '';
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
                        if (latestmonth.toString().length == 1) {
                            latestmonth = '0' + latestmonth;
                        }
                        if (month.toString().length == 1) {
                            month = '0' + month;
                        }
                        var startDate = latestyear + "-" + latestmonth + "-" + "01";
                        var endDate = year + "-" + month + "-" + "01";
                        $.ajax({
                            type: 'POST',
                            url: '../HiDoctor_Activity/SecondarySales/GetMonthDiff',
                            data: "&startDate=" + startDate + "&endDate=" + endDate,
                            // async: false,
                            success: function (result) {
                                if (result != "") {
                                    var jsData = eval('(' + result + ')');
                                    if (startDate != endDate) {
                                        for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                                            monthsNotSubmit += "<b>" + jsData.Tables[0].Rows[i].MonthName + "-" + jsData.Tables[0].Rows[i].MonthYear + "</b>";
                                            if (i < jsData.Tables[0].Rows.length - 1) {
                                                monthsNotSubmit += ',</br>';
                                            }
                                        }
                                    }
                                    if (monthsNotSubmit != "") {
                                        var content = 'The secondary sales for the months(s) mentioned below is not Submitted.If you wish to continue click Yes. Otherwise click No.</br>' + monthsNotSubmit + '';
                                        $('#deleteMappingBody').html(content);
                                        var buttnprcd = '<button type="button" class="btn btn-default" data-dismiss="modal" onclick="fnSecondarySalesProceed();">Yes</button>';
                                        $('#confrmdelte').html(buttnprcd);
                                        $('#DeleteModal').modal('show');
                                        $.unblockUI();
                                    } else {
                                        fnSecondarySalesProceed();
                                    }
                                }
                            }
                        });
                    }
                }
            }
            else {
                fnSecondarySalesProceed();
            }
        }
    });
}

function fnSecondarySalesProceed() {
    debugger;
    continueflag = true;
    $.blockUI();
    var input = [];
    var monthYear = $('#txtMonth').val();
    var monthval = fnGetMonth(monthYear.split('-')[0]);
    var year = monthYear.split('-')[1];
    if (monthval.length == 1) {
        monthval = "0" + monthval;
    }
    else {
        monthval = fnGetMonth(monthYear.split('-')[0]);
    }
    var inputvalues = {
        Month: monthval,
        Year: year,
        Region_Code: regionCode
    }
    input.push(inputvalues);
    if (input.length > 0) {
        input = JSON.stringify({ 'lstPS_input': input });
    }

    fnCheckIsPSPrefill(input);


}

function fnCheckIsPSPrefill(input) {
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        type: 'POST',
        dataType: 'json',
        url: '../HiDoctor_Activity/SecondarySales/CheckPSIsPrefill',
        data: input,
        //async: false,
        success: function (response) {
            checkIsPSPrefill = response;
            if (checkIsPSPrefill == '1') {
                fnPSDetailsToPrefill();
            }
            else {
                PSDetails = "";
                PSPrefillDetails = "";
                fnGetProductsFortheSelecRegandStockist();
            }
            if ($('#txtStockiestName').val() != "") {
                debugger;
                var jSonStockiest = jsonPath(stockistList_g, "$.[?(@.value =='" + $.trim($('#hdnStockiestCode').val()) + "')]");
                if (!(jSonStockiest.length > 0)) {
                    fnMsgAlert('info', 'Secondary Sales', $('#txtStockiestName').val() + '  Stockiest name  is invalid.');
                    $('#txtStockiestName').focus();
                    return false;
                }
                else {
                    $('#txtStockiestName').attr('readonly', 'readonly');
                }
            }

        }
    });

}

function fnPSDetailsToPrefill() {
    debugger;
    var input = [];
    var monthYear = $('#txtMonth').val();
    var monthval = fnGetMonth(monthYear.split('-')[0]);
    var year = monthYear.split('-')[1];
    if (monthval.length == 1) {
        monthval = "0" + monthval;
    }
    else {
        monthval = monthval;
    }
    var inputvalues = {
        Month: monthval,
        Year: year,
        Region_Code: regionCode,
        SelectionType: '',
        Customer_Code: $("#hdnStockiestCode").val()
    }

    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '../HiDoctor_Activity/SecondarySales/GetPSDetailsForSS',
        data: inputvalues,
        //async: false,
        success: function (response) {
            PSDetails = response[1].Data;
            PSPrefillDetails = response[0].Data;
            fnGetProductsFortheSelecRegandStockist();
        }
    });
}
function fnGetProductsFortheSelecRegandStockist() {
    debugger;
    //var month = $('#drpMonth').val();
    //var year = $('#drpYear').val();
    var monthYear = $('#txtMonth').val();
    var month = fnGetMonth(monthYear.split('-')[0]);
    var year = monthYear.split('-')[1];
    $.ajax({
        type: "GET",
        url: "../HiDoctor_Activity/SecondarySales/GetProductsBasedonStockist",
        data: "regionCode=" + regionCode + "&customerCode=" + $('#hdnStockiestCode').val(),
        //+ "&month=" + month + "&year=" + year,
        success: function (resp) {
            productAutofill_g = resp;
            productjsonString = "";
            if (productAutofill_g.lstProdDet.length > 0) {
                var product = "[";
                for (var i = 0; i < productAutofill_g.lstProdDet.length; i++) {
                    product += "{label:" + '"' + "" + productAutofill_g.lstProdDet[i].Product_Name + "" + '",' + "value:" + '"' + "" + productAutofill_g.lstProdDet[i].Product_Code + "_" + productAutofill_g.lstProdDet[i].Division_Code + "" + '"' + "}";
                    if (i < productAutofill_g.lstProdDet.length - 1) {
                        product += ",";
                    }
                }
                product += "];";

                var productforPop = "[";
                for (var i = 0; i < productAutofill_g.lstProdDet.length; i++) {
                    productforPop += "{Product_Name:" + '"' + "" + productAutofill_g.lstProdDet[i].Product_Name + "" + '",' + "productCode:" + '"' + "" + productAutofill_g.lstProdDet[i].Product_Code + "_" + productAutofill_g.lstProdDet[i].Division_Code + "" + '",' + "Product_Code:" + '"' + "" + productAutofill_g.lstProdDet[i].Product_Code + "" + '"' + "}";
                    if (i < productAutofill_g.lstProdDet.length - 1) {
                        productforPop += ",";
                    }
                }
                productforPop += "];";
                productjsonString = eval(product);
                productjsonStringPop = eval(productforPop);
                if ($('#hdnStatus').val() == "") {
                    fnCheckSSEntriesforSelectedStockist();
                }
            }
            else {
                fnMsgAlert('info', 'Secondary Sales', 'No Products found for the selected Region.');
                $('#btnGoForProd').attr('disabled', false);
                $.unblockUI();
                return false;
            }
        },
    });
}

function fnCheckSSEntriesforSelectedStockist() {
    debugger;
    var stockCode = $('#hdnStockiestCode').val();
    $.ajax({
        type: "GET",
        url: "../HiDoctor_Activity/SecondarySales/GetCountofSSFortheSelectedStockiest",
        data: "customerCode=" + stockCode,
        success: function (resp) {
            stockistEntries_g = resp[0].Entries_Count;
            fnBindColumnsInputFromPrivilege();
        },
        complete: function (e) {

        }
    });
}

function fnBindColumnsInputFromPrivilege() {
    debugger;
    var tableContent = "";
    if (productPrice_g.lstPricegrpSS.length > 0) {
        tableContent += "<table cellspacing='0' cellpadding='0' id='tblSecondarySales' class='table table-hover'>";
        tableContent += "<thead style='text-align:center;'>";
        tableContent += "<tr><th>PRODUCT NAME</th>";
        tableContent += "<th>UNIT RATE</th>";
        for (var i = 0; i < inputColumnArr.length; i++) {
            if (inputColumnArr[i].toUpperCase() == "CLOSING_BALANCE") {
                tableContent += "<th class='numericth'>" + inputColumnArr[i].replace('_', ' ') + "</th>";
                tableContent += "<th class='numericth'>" + inputColumnArr[i].replace('_', ' ') + " AMOUNT</th>";
            }
            else if (inputColumnArr[i].toUpperCase() == "SALES") {
                tableContent += "<th class='numericth'>" + inputColumnArr[i].replace('_', ' ') + "</th>";
                tableContent += "<th class='numericth'>" + inputColumnArr[i].replace('_', ' ') + " AMOUNT</th>";
            }
            else if (inputColumnArr[i].toUpperCase() == "REMARKS") {
                tableContent += "<th>" + inputColumnArr[i].replace('_', ' ') + "</th>";
            }
            else {
                tableContent += "<th class='numericth'>" + inputColumnArr[i].replace('_', ' ') + "</th>";
            }
        }
        tableContent += "<th class='numericth'>Action</th>";
        tableContent += "</tr>";
        tableContent += "</thead>";
        tableContent += "<tbody>";
        for (var i = 1; i <= 2; i++) {
            tableContent += "<tr id='rowData_" + i + "' class='RowDataVisi'>";
            tableContent += "<td><input type='text' id='txtProductName_" + i + "' onblur='fnOnBlurForProductsGrid(this);' class='autoProducts form-control'  onclick= '$(this).select();' style='width:200px' autocomplete='off' /><input type='hidden' id='hdnProductCode_" + i + "'/><input type='hidden' id='hdnStatusforEachItem_" + i + "' value='0'/></td>";
            if (priceEdit.toUpperCase() == "NO") {
                tableContent += "<td><input type='text' id='txtUnitRate_" + i + "' value='0.00'  class='form-control checknumeric numbersOnly' onclick= '$(this).select();' style='width:70px;' readonly='readonly' autocomplete='off'  /></td>";
            }
            else {
                tableContent += "<td><input type='text' id='txtUnitRate_" + i + "'  value='0.00' class='form-control checknumeric numbersOnly' onclick= '$(this).select();' style='width:70px;' autocomplete='off'  /></td>";
            }
            for (var j = 0; j < inputColumnArr.length; j++) {

                if (inputColumnArr[j].toUpperCase() == "CLOSING_BALANCE") {
                    if (compute.toUpperCase() == "CLOSING_BALANCE") {
                        tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "_" + i + "' value='0.00'   style='width:70px;' class='checknumeric form-control numbersOnly' readonly='readonly' onkeypress='return fnValidateNumber(this,event);'  onpaste='return false' autocomplete='off' /></td>";
                        tableContent += "<td><input type='text' id='txtAmount" + inputColumnArr[j] + "_" + i + "' value='0.00'   style='width:70px;' class='form-control numbersOnly' readonly='readonly'  autocomplete='off' /></td>";
                    } else {
                        tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "_" + i + "'  value='0.00'  style='width:70px;' class='checknumeric numbersOnly form-control' onclick= '$(this).select();' onkeypress='return fnValidateNumber(this,event);'  onpaste='return false' autocomplete='off'  /></td>";
                        tableContent += "<td><input type='text' id='txtAmount" + inputColumnArr[j] + "_" + i + "' value='0.00'   style='width:70px;' class='form-control numbersOnly' readonly='readonly' autocomplete='off' /></td>";
                    }
                }
                else if (inputColumnArr[j].toUpperCase() == "DAMAGED_GOODS") {
                    tableContent += "<td><input type='number' min='1' max='999999' id='txt" + inputColumnArr[j] + "_" + i + "'  value='0.00'  style='width:70px;' class='checknumeric numbersOnly form-control' onclick= '$(this).select();' onkeypress='return fnValidateNumber(this,event);'  onpaste='return false' autocomplete='off'  /></td>";
                }
                else if (inputColumnArr[j].toUpperCase() == "EXPIRED_GOODS") {
                    tableContent += "<td><input  type='number' min='1' max='999999' id='txt" + inputColumnArr[j] + "_" + i + "'  value='0.00'  style='width:70px;' class='checknumeric numbersOnly  form-control' onclick= '$(this).select();'  onkeypress='return fnValidateNumber(this,event);'  onpaste='return false' autocomplete='off' /></td>";
                }
                else if (inputColumnArr[j].toUpperCase() == "FREE_GOODS") {
                    tableContent += "<td><input  type='number' min='1' max='999999' id='txt" + inputColumnArr[j] + "_" + i + "'  value='0.00'  style='width:70px;' class='checknumeric form-control' onclick= '$(this).select();' onkeypress='return fnValidateNumberForTransitandFreeGoods(this,event);'  onpaste='return false' autocomplete='off'  /></td>";
                }
                else if (inputColumnArr[j].toUpperCase() == "OPENING_BALANCE") {
                    if (openingBalEdit.toUpperCase() == "YES" || stockistEntries_g == 0) {
                        tableContent += "<td><input  type='number' min='1' max='999999' id='txt" + inputColumnArr[j] + "_" + i + "'  value='0.00'  style='width:70px;' class='checknumeric numbersOnly  form-control' onclick= '$(this).select();' onkeypress='return fnValidateNumber(this,event);'  onpaste='return false' autocomplete='off'  /></td>";
                    } else {
                        tableContent += "<td><input  type='number' min='1' max='999999' id='txt" + inputColumnArr[j] + "_" + i + "'  value='0.00'  style='width:70px;' class='checknumeric numbersOnly  form-control' onclick= '$(this).select();' readonly='readonly' autocomplete='off' /></td>";
                    }
                }
                else if (inputColumnArr[j].toUpperCase() == "PURCHASE") {
                    tableContent += "<td><input  type='number' min='1' max='999999' id='txt" + inputColumnArr[j] + "_" + i + "'  value='0.00'  style='width:70px;' class='checknumeric  numbersOnly form-control' onclick= '$(this).select();'  onkeypress='return fnValidateNumber(this,event);'  onpaste='return false' autocomplete='off' /></td>";
                }
                else if (inputColumnArr[j].toUpperCase() == "PURCHASE_RETURN") {
                    tableContent += "<td><input  type='number' min='1' max='999999' id='txt" + inputColumnArr[j] + "_" + i + "'  value='0.00'  style='width:70px;' class='checknumeric  numbersOnly form-control' onclick= '$(this).select();'  onkeypress='return fnValidateNumber(this,event);'  onpaste='return false' autocomplete='off' /></td>";
                }
                else if (inputColumnArr[j].toUpperCase() == "SALES") {
                    if (compute.toUpperCase() == "SALES") {
                        tableContent += "<td><input  type='number' min='1' max='999999' id='txt" + inputColumnArr[j] + "_" + i + "' value='0.00'   style='width:70px;' class='checknumeric  numbersOnly form-control' readonly='readonly' onkeypress='return fnValidateNumber(this,event);'  onpaste='return false' autocomplete='off'  /></td>";
                        tableContent += "<td><input type='text' id='txtAmount" + inputColumnArr[j] + "_" + i + "' value='0.00'   style='width:70px;' class='form-control numbersOnly' readonly='readonly' autocomplete='off' /></td>";
                    } else {
                        tableContent += "<td><input type='number' min='1' max='999999' id='txt" + inputColumnArr[j] + "_" + i + "'  value='0.00'  style='width:70px;' class='checknumeric numbersOnly form-control' onclick= '$(this).select();' onkeypress='return fnValidateNumber(this,event);'  onpaste='return false' autocomplete='off'  /></td>";
                        tableContent += "<td><input type='text' id='txtAmount" + inputColumnArr[j] + "_" + i + "' value='0.00'   style='width:70px;' class='form-control numbersOnly' readonly='readonly' autocomplete='off' /></td>";
                    }
                }
                else if (inputColumnArr[j].toUpperCase() == "SALES_RETURN") {
                    tableContent += "<td><input  type='number' min='1' max='999999' id='txt" + inputColumnArr[j] + "_" + i + "'  value='0.00'  style='width:70px;' class='checknumeric numbersOnly form-control' onclick= '$(this).select();'  onkeypress='return fnValidateNumber(this,event);'  onpaste='return false' autocomplete='off' /></td>";
                }
                else if (inputColumnArr[j].toUpperCase() == "TRANSIT") {
                    tableContent += "<td><input  type='number' min='1' max='999999' id='txt" + inputColumnArr[j] + "_" + i + "'  value='0.00'  style='width:70px;' class='checknumeric  form-control' onclick= '$(this).select();' onkeypress='return fnValidateNumberForTransitandFreeGoods(this,event);'  onpaste='return false' autocomplete='off'  /></td>";
                }
                else if (inputColumnArr[j].toUpperCase() == "REMARKS") {
                    tableContent += "<td><textarea  id='txt" + inputColumnArr[j] + "_" + i + "'   onclick= '$(this).select();' style='resize:none;width:100%;' class='CheckProductRemark' rows='3'></textarea></td>";
                }
                else {
                    tableContent += "<td><input  type='number' min='1' max='999999' id='txt" + inputColumnArr[j] + "_" + i + "'  value='0.00'  style='width:70px;' class='checknumeric  numbersOnly form-control' onclick= '$(this).select();' onkeypress='return fnValidateNumber(this,event);'  onpaste='return false' autocomplete='off'  /></td>";
                }
            }
            if (SS_DynamicColumns_g.length > 0) {
                tableContent += "<td><i class='fa fa-minus' id='gridminus_" + i + "' style='font-size: 15px !important;display:none;' onclick='fnHideGridDynamic(" + i + ");' aria-hidden='true'></i><i class='fa fa-plus' style='font-size: 15px !important;' id='gridplus_" + i + "' onclick='fnShowGridDynamic(" + i + ");' aria-hidden='true'></i></td>";
            } else {
                tableContent += "<td></td>";
            }
            tableContent += "</tr>";
            if (SS_DynamicColumns_g.length > 0) {
                var BindDynamic = fnGetDynamicColumnsBindHTML(i);
                tableContent += "<tr id='rowDataDyn_" + i + "' class='RowDataInVisi' style='display:none;background: rgb(241, 241, 241);' ><td colspan='" + (inputColumnArr.length + 5) + "'>" + BindDynamic + "</td></tr>";
            }
        }
        tableContent += "<tr id='tbllastRow'><td style='width:261px;font-weight: bold'>TOTAL</td>";
        tableContent += "<td></td>";
        for (var i = 0; i < inputColumnArr.length; i++) {
            if (inputColumnArr[i].toUpperCase() == "CLOSING_BALANCE") {
                tableContent += "<td></td>";
                tableContent += "<td><input type='text' id='txtClosingAmountSum' readonly='true' class='checknumeric form-control'style='width:70px;border:none;font-weight:bold' /></td>";

            }
            else if (inputColumnArr[i].toUpperCase() == "SALES") {
                tableContent += "<td></td>";
                tableContent += "<td><input type='text' id='txtSalesAmountSum' readonly='true' class='checknumeric form-control'style='width:70px;border:none;font-weight:bold' /></td>";
            }
            else {
                tableContent += "<td></td>";
            }
        }
        tableContent += "</tr>";
        rowNumber = 3;
        tableContent += "</tbody>";
        tableContent += "</table>";
    }
    else {
        fnMsgAlert('info', 'info', 'This region (' + regionName + ') does not have product price list.Please contact your administrator to configure the price list.');
        $('#SecondarySalesDetails').hide();
        $('#productopoupLink').hide();
        fnSecondarySalesResetStockistGrid();
        $.unblockUI();
        return false;
    }
    $('#SecondarySalesDetails').html(tableContent);
    if ((inputColumnArr.length + 4) >= 12) {
        if ($('#tree').is(":visible")) {
            $('#tblSecondarySales').css('width', '200%');
            $('#SecondarySalesDetails').css("overflow-x", "scroll");
        } else {
            $('#tblSecondarySales').css('width', '150%');
            $('#SecondarySalesDetails').css("overflow-x", "scroll");
        }

    }
    else {
        if ($('#tree').is(":visible")) {
            $('#tblSecondarySales').css('width', '150%');
            $('#SecondarySalesDetails').css("overflow-x", "scroll");
        } else {
            $('#tblSecondarySales').css('width', '150%');
            $('#SecondarySalesDetails').css("overflow-x", "scroll");
        }
    }
    //if ($('#tree').is(":visible")) {
    //    $('#tblSecondarySales').css('width', '150%');
    //    $('#SecondarySalesDetails').css("overflow-x", "scroll");
    //} else {
    //    $('#tblSecondarySales').css('width', '100%');
    //    $('#SecondarySalesDetails').css("overflow-x", "hidden");
    //}
    $("#dvMainHeader").show();
    $('#SecondarySalesDetails').show();
    $("#divInput").show();
    $('#productopoupLink').show();
    $('#imgAdd').hide();
    $.unblockUI();

    autoComplete(productjsonString, "txtProductName", "hdnProductCode", 'autoProducts');
    fnSecondaryEventBinder();
    fnDynamicEventBinder();
    $(function () {
        $(".datepicker").datepicker({
            numberOfMonths: 3
        });
    });
    $(".datecls").datepicker({
        dateFormat: 'dd/mm/yy',
        numberOfMonths: 1,
        changeMonth: true,
        changeYear: true,
    });
}

function fnSecondaryEventBinder() {
    debugger;
    $(".autoProducts").keypress(function () { fnCreateNewRowInProduct(this); });
    $(".autoProducts").dblclick(function () { fnCreateNewRowInProduct(this); });
    $(".autoProducts").blur(function () { return fnCheckValidProduct(this, productAutofill_g, "Product_Name") });
    $(".checknumeric").blur(function () { return fnCalculate(this) });
    $(".CheckProductRemark").blur(function () { return fnProductRemarksValidation(this) });
}

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
            var monthVal = $('#drpMonth').val();
            var yearVal = $('#drpYear').val();
            var currentDate = new Date(monthVal + "-" + monthVal + "-" + yearVal);
            //var selectedValue = jsonPath(jsonData.lstProdDet, "$.[?(@.Product_Name=='" + value + "')]");
            var selectedValue = $.grep(jsonData.lstProdDet, function (ele, index) {
                return ele.Product_Name == value;
            });
            ids = id.id;
            productId = ids.replace("txtProductName_", "hdnProductCode_");
            openingBalance = ids.replace("txtProductName_", "txtOPENING_BALANCE_");
            productValue = $("#" + productId).val();

            //if ($('#drpMonth').val() == 0) {
            //    fnMsgAlert('info', 'Secondary Sales', 'Select month.');
            //    $("#" + ids).val('');
            //    return false;
            //}
            //if ($('#drpYear').val() == 0) {
            //    fnMsgAlert('info', 'Secondary Sales', 'Select year.');
            //    $("#" + ids).val('');
            //    return false;
            //}
            if ($('#txtMonth').val() == "" || $('#txtMonth').val() == null || $('#txtMonth').val() == undefined) {
                fnMsgAlert('info', 'Secondary Sales', 'Select month.');
                $('#txtMonth').val('');
                return false;
            }
            if (openingBalance != null) {
                if (jsonData.lstProdDet.length > 0) {


                    var i = 0;
                    var value = 1;
                    // openingBal = jsonPath(jsonData.lstOpnBal, "$.[?(@.Product_Code=='" + productValue.split('_')[0] + "' & @.Customer_Code=='" + $('#hdnStockiestCode').val() + "')]");
                    openingBal = $.grep(jsonData.lstOpnBal, function (ele, index) {
                        return ele.Product_Code == productValue.split('_')[0] && ele.Customer_Code == $('#hdnStockiestCode').val();
                    });
                    if (openingBal.length > 0) {
                        if (yearVal != "0") {
                            while (i <= value) {
                                currentDate.setMonth(currentDate.getMonth() - 1);
                                var month = currentDate.getMonth() + 1;
                                var year = currentDate.getFullYear();
                                //openingBalVal = jsonPath(jsonData[4], "$.Data[?(@.Product_Code=='" + productValue.split('_')[0] + "' & @.Month =='" + month + "' & @.Year=='" + year + "' & @.Customer_Code=='" + $('#hdnStockiestCode').val() + "')]");
                                openingBalVal = $.grep(jsonData.lstOpnBal, function (ele, index) {
                                    return ele.Product_Code == productValue.split('_')[0] && ele.Customer_Code == $('#hdnStockiestCode').val();// && Month == month && Year == year;
                                });
                                openingBalVal.sort(function (a, b) { return a - b });
                                if (openingBalVal != false) {
                                    if (openingBalVal[0].Closing_Stock == 0 || openingBalVal.length == 0) {
                                        $("#" + openingBalance).val(0.00);
                                        $("#" + openingBalance).removeAttr('readOnly');
                                    } else {
                                        $("#" + openingBalance).val(openingBalVal[0].Closing_Stock);
                                        if (openingBalEdit.toUpperCase() == "YES") {
                                            $("#" + openingBalance).removeAttr('readOnly');
                                        } else {
                                            $("#" + openingBalance).attr('readOnly', 'readOnly');
                                        }
                                    }
                                    break;
                                }

                                if (year == "2011") {
                                    break;
                                }
                            }

                        }
                    }
                    else {
                        $("#" + openingBalance).val(0.00);
                        $("#" + openingBalance).removeAttr('readOnly');
                    }
                }
                else {
                    $("#" + openingBalance).val(0.00);
                    $("#" + openingBalance).removeAttr('readOnly');
                }

                if (productPrice_g.lstgrpType.length > 0) {
                    debugger;
                    productPrice = jsonPath(productPrice_g.lstPricegrpSS, "$.[?(@.Product_Code=='" + productValue.split('_')[0] + "' )]");
                    if (productPrice != false && productPrice.length > 0) {
                        if (productPrice_g.lstgrpType[0].Price_Type == "PTS") {
                            price = productPrice[0].PTS;
                        }
                        else if (productPrice_g.lstgrpType[0].Price_Type == "INVOICE_AMOUNT") {
                            price = productPrice[0].INVOICE_AMOUNT;
                        }
                        else if (productPrice_g.lstgrpType[0].Price_Type == "PTR_WOTAX") {
                            price = productPrice[0].PTR_WOTAX;
                        }
                        else if (productPrice_g.lstgrpType[0].Price_Type == "MRP") {
                            price = productPrice[0].MRP;
                        }
                        else if (productPrice_g.lstgrpType[0].Price_Type == "NRV") {
                            price = productPrice[0].NRV;
                        }
                    }
                }
                debugger;
                //PS prefill functionality
                if (PSPrefillDetails != undefined && PSPrefillDetails.length != 0) {
                    if (PSDetails.length != 0) {
                        //for (var p = 0; p < PSDetails.length; p++) {
                        var psjson = jsonPath(PSDetails, "$.[?(@.Product_Code=='" + productValue.split('_')[0] + "')]");
                        if (psjson != false && psjson.length != 0) {
                            for (var k = 0; k < inputColumnArr.length; k++) {
                                var inputcol = jsonPath(psjson, "$.[?(@.Column_Name=='" + inputColumnArr[k] + "')]");


                                if (inputcol != false && inputcol.length > 0) {
                                    var txtbox = "txt" + inputcol[0].Column_Name + "_";
                                    var rowid = id.id.split('_');
                                    txtbox = txtbox + rowid[1];
                                    $("#" + txtbox).val(inputcol[0].Qty);
                                }
                            }
                            for (var k = 0; k < inputColumnArr.length; k++) {
                                var EditJs = jsonPath(PSPrefillDetails, "$.[?(@.Column_Name=='" + inputColumnArr[k] + "')]");

                                //Check Wheather to enable the prefilled column to write.
                                if (EditJs != false) {
                                    var txtbox = "txt" + EditJs[0].Column_Name + "_";
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
                                var txtbox = "txt" + inputColumnArr[k] + "_";
                                var rowid = id.id.split('_');
                                txtbox = txtbox + rowid[1];

                                if (inputColumnArr[k] != "OPENING_BALANCE") {
                                    $("#" + txtbox).val('0.00');
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
                        //}

                    }
                    else {
                        for (var k = 0; k < inputColumnArr.length; k++) {
                            var txtbox = "txt" + inputColumnArr[k] + "_";
                            var rowid = id.id.split('_');
                            txtbox = txtbox + rowid[1];

                            if (inputColumnArr[k] != "OPENING_BALANCE") {
                                $("#" + txtbox).val('0.00');
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
                    selectedValue = 0.00;
                }
                $("#" + id).val(price);
                return true;
            }
        }
        fnCalculate(id);
    }
    else {
        return true;
    }
}


function fnProductRemarksValidation(value) {
    debugger;
    var allowCharacterinDCR = "-_.,()";
    if ($("#" + value.id).val() != '') {
        debugger;
        var result = fnValidateInputParamters($("#" + value.id).val());
        var rowNo = value.id.split('_')[1];
        if (result) {
            fnMsgAlert('info', 'Secondary Sales', "Special characters (A-Za-z0-9@.,'(){}[]/\<>?!_-) are allowed in the Remarks for the product '" + $('#txtProductName_' + rowNo).val() + "'");
            return false;
        }
    }
}

function fnValidateInputParamters(value) {
    var specialCharregex = new RegExp(/[*&%$^#+=~`""|]/g);
    if (specialCharregex.test(value) == false) {
        return false;
    }
    else {
        return true;
    }
}

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
    newRow.id = "rowData_" + rowNumber;
    newRow.className = "RowDataVisi";
    var tdProductName = newRow.insertCell(0);
    var tdUnitRate = newRow.insertCell(1);
    debugger;
    $(tdProductName).html("<input type='text' id='txtProductName_" + rowNumber + "'  onblur='fnOnBlurForProductsGrid(this);' autocomplete='off' class='autoProducts form-control' onclick= '$(this).select();'  style='width:200px' /><input type='hidden' id='hdnProductCode_" + rowNumber + "'/><input type='hidden' id='hdnStatusforEachItem_" + rowNumber + "' value='0'/>");

    if (priceEdit.toUpperCase() == "NO") {
        $(tdUnitRate).html("<input type='text' id='txtUnitRate_" + rowNumber + "'autocomplete='off' value='0.00' style='width:70px;' readonly='readonly'   class='form-control' onclick= '$(this).select(); '/>");
    }
    else {
        $(tdUnitRate).html("<input type='text' id='txtUnitRate_" + rowNumber + "' style='width:70px;'  value='0.00' autocomplete='off' class='form-control' onclick= '$(this).select(); '/>");
    }

    if (inputColumnArr.length > 0) {

        for (var j = 0; j < inputColumnArr.length; j++) {
            var tdValue = newRow.insertCell(iRow);
            if (inputColumnArr[j].toUpperCase() == "CLOSING_BALANCE") {
                if (compute.toUpperCase() == "CLOSING_BALANCE") {
                    $(tdValue).html("<input  type='number' min='1' max='999999' id='txt" + inputColumnArr[j] + "_" + rowNumber + "' class='checknumeric form-control' value='0.00'  style='width:70px;' readonly='readonly' autocomplete='off' />");
                } else {
                    $(tdValue).html("<input  type='number' min='1' max='999999' id='txt" + inputColumnArr[j] + "_" + rowNumber + "' value='0.00' class='checknumeric form-control' onclick= '$(this).select();'  onkeypress='return fnValidateNumber(this,event);'  onpaste='return false' autocomplete='off'   style='width:70px;' />");
                }
                iRow++;
            }
            else if (inputColumnArr[j].toUpperCase() == "DAMAGED_GOODS") {
                $(tdValue).html("<input  type='number' min='1' max='999999' id='txt" + inputColumnArr[j] + "_" + rowNumber + "' value='0.00' class='checknumeric form-control' onclick= '$(this).select();' onkeypress='return fnValidateNumber(this,event);'  onpaste='return false' autocomplete='off' style='width:70px;'/>");
                iRow++;
            }
            else if (inputColumnArr[j].toUpperCase() == "EXPIRED_GOODS") {
                $(tdValue).html("<input type='number' min='1' max='999999' id='txt" + inputColumnArr[j] + "_" + rowNumber + "' value='0.00' class='checknumeric form-control' onclick= '$(this).select();' onkeypress='return fnValidateNumber(this,event);'  onpaste='return false' autocomplete='off' style='width:70px;'/>");
                iRow++;
            }
            else if (inputColumnArr[j].toUpperCase() == "FREE_GOODS") {
                $(tdValue).html("<input  type='number' min='1' max='999999' id='txt" + inputColumnArr[j] + "_" + rowNumber + "' value='0.00' class='checknumeric form-control' onclick= '$(this).select();' onkeypress='return fnValidateNumberForTransitandFreeGoods(this,event);'  onpaste='return false' autocomplete='off' style='width:70px;'/>");
                iRow++;
            }
            else if (inputColumnArr[j].toUpperCase() == "OPENING_BALANCE") {
                if (openingBalEdit.toUpperCase() == "YES" || stockistEntries_g == 0) {
                    $(tdValue).html("<input  type='number' min='1' max='999999' id='txt" + inputColumnArr[j] + "_" + rowNumber + "' value='0.00' class='checknumeric form-control' onclick= '$(this).select();' onkeypress='return fnValidateNumber(this,event);'  onpaste='return false' autocomplete='off' style='width:70px;'/>");
                    iRow++;
                } else {
                    $(tdValue).html("<input  type='number' min='1' max='999999' id='txt" + inputColumnArr[j] + "_" + rowNumber + "' value='0.00' class='checknumeric form-control' autocomplete='off'  readonly='readonly' onclick= '$(this).select();' style='width:70px;'/>");
                    iRow++;
                }
            }
            else if (inputColumnArr[j].toUpperCase() == "PURCHASE") {
                $(tdValue).html("<input  type='number' min='1' max='999999' id='txt" + inputColumnArr[j] + "_" + rowNumber + "' value='0.00' class='checknumeric form-control' autocomplete='off' onclick= '$(this).select();' onkeypress='return fnValidateNumber(this,event);'  onpaste='return false' autocomplete='off' style='width:70px;'/>");
                iRow++;
            }
            else if (inputColumnArr[j].toUpperCase() == "PURCHASE_RETURN") {
                $(tdValue).html("<input  type='number' min='1' max='999999' id='txt" + inputColumnArr[j] + "_" + rowNumber + "' value='0.00' class='checknumeric form-control' autocomplete='off' onclick= '$(this).select();' onkeypress='return fnValidateNumber(this,event);'  onpaste='return false' autocomplete='off' style='width:70px;'/>");
                iRow++;
            }
            else if (inputColumnArr[j].toUpperCase() == "SALES") {
                if (compute.toUpperCase() == "SALES") {
                    $(tdValue).html("<input  type='number' min='1' max='999999' id='txt" + inputColumnArr[j] + "_" + rowNumber + "' class='checknumeric form-control' value='0.00'  style='width:70px;' readonly='readonly' autocomplete='off' />");
                } else {
                    $(tdValue).html("<input  type='number' min='1' max='999999' id='txt" + inputColumnArr[j] + "_" + rowNumber + "' value='0.00' class='checknumeric form-control' onclick= '$(this).select();' onkeypress='return fnValidateNumber(this,event);'  onpaste='return false' autocomplete='off'   style='width:70px;'/>");
                }
                iRow++;
            }
            else if (inputColumnArr[j].toUpperCase() == "SALES_RETURN") {
                $(tdValue).html("<input  type='number' min='1' max='999999' id='txt" + inputColumnArr[j] + "_" + rowNumber + "' value='0.00' class='checknumeric form-control' onclick= '$(this).select();'  onkeypress='return fnValidateNumber(this,event);'  onpaste='return false' autocomplete='off' style='width:70px;'/>");
                iRow++;
            }
            else if (inputColumnArr[j].toUpperCase() == "TRANSIT") {
                $(tdValue).html("<input  type='number' min='1' max='999999' id='txt" + inputColumnArr[j] + "_" + rowNumber + "' value='0.00' class='checknumeric form-control' onclick= '$(this).select();' onkeypress='return fnValidateNumberForTransitandFreeGoods(this,event);'  onpaste='return false' autocomplete='off' style='width:70px;'/>");
                iRow++;
            } else if (inputColumnArr[j].toUpperCase() == "REMARKS") {
                $(tdValue).html("<textarea  id='txt" + inputColumnArr[j] + "_" + rowNumber + "'   onclick= '$(this).select();'  style='resize:none;width:100%;' class='CheckProductRemark' rows='3'></textarea></td>");
                iRow++;
            } else {
                $(tdValue).html("<input type='text' id='txt" + inputColumnArr[j] + "_" + rowNumber + "' value='0.00' class='checknumeric form-control' autocomplete='off' onclick= '$(this).select();' style='width:70px;'/>");
                iRow++;
            }
            if (inputColumnArr[j].toUpperCase() == "CLOSING_BALANCE") {
                var tdValue = newRow.insertCell(iRow);
                $(tdValue).html("<input type='text' id='txtAmount" + inputColumnArr[j] + "_" + rowNumber + "' value='0.00' class='form-control'  style='width:70px;' readonly='readonly' />");
                iRow++;
            }
            if (inputColumnArr[j].toUpperCase() == "SALES") {
                var tdValue = newRow.insertCell(iRow);
                $(tdValue).html("<input type='text' id='txtAmount" + inputColumnArr[j] + "_" + rowNumber + "' class='form-control' value='0.00'  style='width:70px;' readonly='readonly' />");
                iRow++;
            }


        }
        var tdValue = newRow.insertCell(iRow);
        if (SS_DynamicColumns_g.length > 0) {
            $(tdValue).html("<i class='fa fa-minus' id='gridminus_" + rowNumber + "' style='font-size: 15px !important;display:none;' onclick='fnHideGridDynamic(" + rowNumber + ");' aria-hidden='true'></i><i class='fa fa-plus' style='font-size: 15px !important;' id='gridplus_" + rowNumber + "' onclick='fnShowGridDynamic(" + rowNumber + ");' aria-hidden='true'></i>");
        } else {
            $(tdValue).html('');
        }

    }
    if (SS_DynamicColumns_g.length > 0) {
        var rdynCnt = $("#tblSecondarySales tr").length - 1
        var newRowDyna = document.getElementById("tblSecondarySales").insertRow(parseInt(rdynCnt));
        newRowDyna.id = "rowDataDyn_" + rowNumber;
        newRowDyna.className = "RowDataInVisi";
        newRowDyna.style.display = "none";
        newRowDyna.style.background = "#f1f1f1";
        var cellDyna = newRowDyna.insertCell(0);
        cellDyna.colSpan = inputColumnArr.length + 5;
        var BindDynaCol = fnGetDynamicColumnsBindHTML(rowNumber);
        $(cellDyna).html(BindDynaCol);
    }

    autoComplete(productjsonString, "txtProductName", "hdnProductCode", 'autoProducts');
    fnSecondaryEventBinder();
    fnDynamicEventBinder();

    rowNumber = parseInt(rowNumber) + 1;
    $.unblockUI();
}
var arrayvalues = [];
function fnSplitFormula(value) {
    var temp = '';
    var formula = value;
    arrayvalues = [];
    for (var i = 0; i < formula.length; i++) {
        if (formula[i] == '+') {

            arrayvalues.push(temp);
            arrayvalues.push('+');
            temp = '';
            i++;
        }
        else if (formula[i] == '-') {


            arrayvalues.push(temp);
            arrayvalues.push('-');
            temp = '';
            i++;
        }
        temp += formula[i];

    }
    if (temp != "") {
        arrayvalues.push(temp);
    }
}
function fnCalculate(ctl) {
    debugger;
    arrayvalues = [];
    fnSplitFormula(ssformulas);
    var total = 0.00;
    var pricePerUnit = 0;
    var openingBalance = 0.00, purchase = 0.00, purchaseReturn = 0.00, sales = 0.00, salesReturn = 0.00, transit = 0.00, closingStock = 0.00; freeGoods = 0.00;
    var amountCalc = 0.00;
    var expiredGoods = 0.00; damagedGoods = 0.00;
    var ssformula = '';
    if (ctl.id != "txtSalesAmountSum" && ctl.id != "txtClosingAmountSum") {


        var rowN = ctl.id.split('_')[ctl.id.split('_').length - 1];
        if ($("#txtProductName_" + rowN).val() != "") {
            if (ctl.id.split('_')[0] == "txtUnitRate") {
                if ($.trim($("#txtUnitRate_" + rowN).val()) == "") {
                    fnMsgAlert('info', 'Secondary Sales', 'Please Enter The Price.');
                    return false;
                }
            }
        }

        if ($.trim($('#' + ctl.id).val()).length > 0) {
            var rowNumber = ctl.id.split('_')[ctl.id.split('_').length - 1]


            //var id = (ctl.id).split('_');
            //for (var i = 0; i < id.length-1; i++) {
            //    id += id[i];
            //    if (i < id.length - 2) {
            //        id += '_';
            //    }
            //}
            if (isNaN($("#" + ctl.id).val())) {
                fnMsgAlert('info', 'Secondary Sales', 'Please enter numeric value only.');
                $("#" + ctl.id).val(0.00);
                $("#" + ctl.id).focus();
                return false;
            }



            if ((ctl.id) != "txtUnitRate_" + ctl.id.split('_')[1]) {
                if ($("#" + ctl.id).val() != "") {
                    var value = parseFloat($("#" + ctl.id).val()).toFixed(2);
                    var idprod = ctl.id.split('_')[0]
                    if (idprod.toUpperCase() != "TXTPRODUCTNAME") {
                        $("#" + ctl.id).val(value);
                    }
                }
            }


            if ($("#txtUnitRate_" + rowNumber).val() != null && $("#txtUnitRate_" + rowNumber).val() != "") {
                pricePerUnit = parseFloat($("#txtUnitRate_" + rowNumber).val());
            } else {
                pricePerUnit = 0.00;
                pricePerUnit = pricePerUnit.toFixed(2);
                $("#txtUnitRate_" + rowNumber).val(pricePerUnit)
            }

            for (var i = 0; i < inputColumnArr.length; i++) {
                if (inputColumnArr[i].toUpperCase() == "OPENING_BALANCE") {
                    if ($("#txt" + inputColumnArr[i] + "_" + rowNumber).val() != null && $("#txt" + inputColumnArr[i] + "_" + rowNumber).val() != "") {
                        openingBalance = parseFloat($("#txt" + inputColumnArr[i] + "_" + rowNumber).val()).toFixed(2);
                    } else {
                        openingBalance = 0.00;
                        $("#txt" + inputColumnArr[i] + "_" + rowNumber).val(0.00)
                    }
                } else if (inputColumnArr[i].toUpperCase() == "PURCHASE") {
                    if ($("#txt" + inputColumnArr[i] + "_" + rowNumber).val() != null && $("#txt" + inputColumnArr[i] + "_" + rowNumber).val() != "") {
                        purchase = parseFloat($("#txt" + inputColumnArr[i] + "_" + rowNumber).val()).toFixed(2);
                    } else {
                        purchase = 0.00;
                        $("#txt" + inputColumnArr[i] + "_" + rowNumber).val(0.00)
                    }
                } else if (inputColumnArr[i].toUpperCase() == "PURCHASE_RETURN") {
                    if ($("#txt" + inputColumnArr[i] + "_" + rowNumber).val() != null && $("#txt" + inputColumnArr[i] + "_" + rowNumber).val() != "") {
                        purchaseReturn = parseFloat($("#txt" + inputColumnArr[i] + "_" + rowNumber).val()).toFixed(2);
                    } else {
                        purchaseReturn = 0.00;
                        $("#txt" + inputColumnArr[i] + "_" + rowNumber).val(0.00)
                    }
                } else if (inputColumnArr[i].toUpperCase() == "SALES") {
                    if ($("#txt" + inputColumnArr[i] + "_" + rowNumber).val() != null && $("#txt" + inputColumnArr[i] + "_" + rowNumber).val() != "") {
                        sales = parseFloat($("#txt" + inputColumnArr[i] + "_" + rowNumber).val()).toFixed(2);
                    } else {
                        sales = 0.00;
                        $("#txt" + inputColumnArr[i] + "_" + rowNumber).val(0.00)
                    }
                }
                else if (inputColumnArr[i].toUpperCase() == "SALES_RETURN") {
                    if ($("#txt" + inputColumnArr[i] + "_" + rowNumber).val() != null && $("#txt" + inputColumnArr[i] + "_" + rowNumber).val() != "") {
                        salesReturn = parseFloat($("#txt" + inputColumnArr[i] + "_" + rowNumber).val()).toFixed(2);
                    } else {
                        salesReturn = 0.00;
                        $("#txt" + inputColumnArr[i] + "_" + rowNumber).val(0.00)
                    }
                }
                else if (inputColumnArr[i].toUpperCase() == "CLOSING_BALANCE") {
                    if ($("#txt" + inputColumnArr[i] + "_" + rowNumber).val() != null && $("#txt" + inputColumnArr[i] + "_" + rowNumber).val() != "") {
                        closingStock = parseFloat($("#txt" + inputColumnArr[i] + "_" + rowNumber).val()).toFixed(2);
                    } else {
                        closingStock = 0.00;
                        $("#txt" + inputColumnArr[i] + "_" + rowNumber).val(0.00)
                    }
                }
                else if (inputColumnArr[i].toUpperCase() == "TRANSIT") {
                    if ($("#txt" + inputColumnArr[i] + "_" + rowNumber).val() != null && $("#txt" + inputColumnArr[i] + "_" + rowNumber).val() != "") {
                        transit = parseFloat($("#txt" + inputColumnArr[i] + "_" + rowNumber).val()).toFixed(2);
                    } else {
                        transit = 0.00;
                        $("#txt" + inputColumnArr[i] + "_" + rowNumber).val(0.00)
                    }
                }
                else if (inputColumnArr[i].toUpperCase() == "FREE_GOODS") {
                    if ($("#txt" + inputColumnArr[i] + "_" + rowNumber).val() != null && $("#txt" + inputColumnArr[i] + "_" + rowNumber).val() != "") {
                        freeGoods = parseFloat($("#txt" + inputColumnArr[i] + "_" + rowNumber).val()).toFixed(2);
                    } else {
                        freeGoods = 0.00;
                        $("#txt" + inputColumnArr[i] + "_" + rowNumber).val(0.00)
                    }
                }
                else if (inputColumnArr[i].toUpperCase() == "DAMAGED_GOODS") {
                    if ($("#txt" + inputColumnArr[i] + "_" + rowNumber).val() != null && $("#txt" + inputColumnArr[i] + "_" + rowNumber).val() != "") {
                        damagedGoods = parseFloat($("#txt" + inputColumnArr[i] + "_" + rowNumber).val()).toFixed(2);
                    } else {
                        damagedGoods = 0.00;
                        $("#txt" + inputColumnArr[i] + "_" + rowNumber).val(0.00)
                    }
                }
                else if (inputColumnArr[i].toUpperCase() == "EXPIRED_GOODS") {
                    if ($("#txt" + inputColumnArr[i] + "_" + rowNumber).val() != null && $("#txt" + inputColumnArr[i] + "_" + rowNumber).val() != "") {
                        expiredGoods = parseFloat($("#txt" + inputColumnArr[i] + "_" + rowNumber).val()).toFixed(2);
                    } else {
                        expiredGoods = 0.00;
                        $("#txt" + inputColumnArr[i] + "_" + rowNumber).val(0.00)
                    }
                }
            }

            ssformula = "";
            ssformula = ssformulas;
            var tempssForm = ssformulas;
            ssformula = ssformula.toUpperCase();

            ssformula = ssformula.replace(/\s+/g, '');

            var newformArr = arrayvalues;

            for (var i = 0; i < inputColumnArr.length; i++) {
                var newIndex = newformArr.indexOf(inputColumnArr[i]);
                if (inputColumnArr[i].toUpperCase() == "CLOSING_BALANCE") {
                    if (newIndex > -1) {
                        newformArr[newIndex] = "(parseFloat($('#txt" + inputColumnArr[i] + "_" + rowNumber + "').val()))";
                    }
                }
                else if (inputColumnArr[i].toUpperCase() == "DAMAGED_GOODS") {
                    if (newIndex > -1) {
                        newformArr[newIndex] = "(parseFloat($('#txt" + inputColumnArr[i] + "_" + rowNumber + "').val()))";
                    }
                }
                else if (inputColumnArr[i].toUpperCase() == "EXPIRED_GOODS") {
                    if (newIndex > -1) {
                        newformArr[newIndex] = "(parseFloat($('#txt" + inputColumnArr[i] + "_" + rowNumber + "').val()))";
                    }
                }
                else if (inputColumnArr[i].toUpperCase() == "FREE_GOODS") {
                    if (newIndex > -1) {
                        newformArr[newIndex] = "(parseFloat($('#txt" + inputColumnArr[i] + "_" + rowNumber + "').val()))";
                    }
                }
                else if (inputColumnArr[i].toUpperCase() == "OPENING_BALANCE") {
                    if (newIndex > -1) {
                        newformArr[newIndex] = "(parseFloat($('#txt" + inputColumnArr[i] + "_" + rowNumber + "').val()))";
                    }
                }
                else if (inputColumnArr[i].toUpperCase() == "PURCHASE") {
                    if (newIndex > -1) {
                        newformArr[newIndex] = "(parseFloat($('#txt" + inputColumnArr[i] + "_" + rowNumber + "').val()))";
                    }
                }
                else if (inputColumnArr[i].toUpperCase() == "PURCHASE_RETURN") {
                    if (newIndex > -1) {
                        newformArr[newIndex] = "(parseFloat($('#txt" + inputColumnArr[i] + "_" + rowNumber + "').val()))";
                    }
                }
                else if (inputColumnArr[i].toUpperCase() == "SALES") {
                    if (newIndex > -1) {
                        newformArr[newIndex] = "(parseFloat($('#txt" + inputColumnArr[i] + "_" + rowNumber + "').val()))";
                    }
                }
                else if (inputColumnArr[i].toUpperCase() == "SALES_RETURN") {
                    if (newIndex > -1) {
                        newformArr[newIndex] = "(parseFloat($('#txt" + inputColumnArr[i] + "_" + rowNumber + "').val()))";
                    }
                }
                else if (inputColumnArr[i].toUpperCase() == "TRANSIT") {
                    if (newIndex > -1) {
                        newformArr[newIndex] = "(parseFloat($('#txt" + inputColumnArr[i] + "_" + rowNumber + "').val()))";
                    }
                }

            }
            debugger;
            var ssform = '';
            for (var i = 0; i < newformArr.length; i++) {
                ssform += newformArr[i]
            }


            ssform = ssform.replace(/\s+/g, '');
            if (ssformulas != "") {
                total = parseFloat(eval(ssform)).toFixed(2);
            }
            else {
                total = 0.00;
            }

            // Calculation 
            amountCalc = 0.00;

            if (compute.toUpperCase() == "CLOSING_BALANCE") {
                var value = parseFloat($("#txtCLOSING_BALANCE_" + rowNumber).val()).toFixed(2);
                $("#txtCLOSING_BALANCE_" + rowNumber).val(value);
                if (total != "") {
                    if (total >= 0) {
                        $("#txtCLOSING_BALANCE_" + rowNumber).val(total);

                    }
                    else {
                        $("#txtCLOSING_BALANCE_" + rowNumber).val(total);
                        fnMsgAlert('info', 'Secondary Sales', 'Negative numbers are not allowed.');
                        //return false;
                    }
                }
            }

            var closingBalanceVal = 0;
            if ($("#txtAmountCLOSING_BALANCE_" + rowNumber) != null) {

                if ($("#txtCLOSING_BALANCE_" + rowNumber).val() != null && $("#txtCLOSING_BALANCE_" + rowNumber).val() != "") {
                    closingBalanceVal = $("#txtCLOSING_BALANCE_" + rowNumber).val();
                }

                amountCalc = (pricePerUnit * closingBalanceVal);
                amountCalc = parseFloat(amountCalc).toFixed(2);
                $("#txtAmountCLOSING_BALANCE_" + rowNumber).val(amountCalc);
            }
            if ($("#txtAmountSALES_" + rowNumber) != null) {
                amountCalc = (pricePerUnit * sales);
                amountCalc = parseFloat(amountCalc).toFixed(2);
                $("#txtAmountSALES_" + rowNumber).val(amountCalc);
            }
            if (compute.toUpperCase() == "SALES") {
                var value = parseFloat($("#txtSALES_" + rowNumber).val()).toFixed(2);
                $("#txtSALES_" + rowNumber).val(value);
                if (total >= 0.00) {
                    $("#txtSALES_" + rowNumber).val(total)
                }
                else {
                    $("#txtSALES_" + rowNumber).val(total);
                    fnMsgAlert('info', 'Secondary Sales', 'Negative numbers are not allowed.');
                    //return false;
                }
            }
        } else {
            var idprod = ctl.id.split('_')[0]
            if (idprod.toUpperCase() != "TXTPRODUCTNAME") {
                var value = parseFloat($('#' + ctl.id).val()).toFixed(2);
                $('#' + ctl.id).val(value);
            }
        }
        fncalTotal();
    }
}

function fncalTotal() {
    var totalsaleamount = 0.00;
    var saleamount = 0.00;
    var totalclosingAmount = 0.00;
    var totalcloamount = 0.00;
    var tableProduct = $('#tblSecondarySales tr.RowDataVisi')
    for (var i = 0; i <= tableProduct.length; i++) {
        if ($("#txtAmountSALES_" + i).val() != undefined && $("#txtAmountSALES_" + i).val() != "") {
            saleamount += parseFloat($("#txtAmountSALES_" + i).val());
            totalclosingAmount += parseFloat($("#txtAmountCLOSING_BALANCE_" + i).val());
            totalsaleamount = parseFloat(saleamount).toFixed(2);
            totalcloamount = parseFloat(totalclosingAmount).toFixed(2);
        }
    }
    $("#txtSalesAmountSum").val(totalsaleamount);
    $("#txtClosingAmountSum").val(totalcloamount);
}

function fnGetsecproductPopUp() {
    debugger;
    $.blockUI();
    disProArray = new Array();
    var trs = $("#tblSecondarySales tbody tr.RowDataVisi");
    var i = 0;
    for (i = 0; i < trs.length; i++) {
        var rowId = fnGetRowId(trs[i]);
        if ($("#txtProductName_" + rowId + "").val() != "" && $("#hdnProductCode_" + rowId + "").val() != "" && $("#hdnProductCode_" + rowId + "").val() != undefined) {
            var product = {};
            var hdproductCode = $("#hdnProductCode_" + rowId + "").val().split("_")[0];
            product.Code = hdproductCode;
            disProArray.push(product);
        }
    }

    //var monthVal = $('#drpMonth').val();
    //var yearVal = $('#drpYear').val();
    var monthyear = $('#txtMonth').val();
    var monthVal = fnGetMonth(monthyear.split('-')[0]);
    var yearVal = monthyear.split('-')[1];
    var currentDate = new Date(monthVal + "-" + monthVal + "-" + yearVal);
    var openingBalspopup = "";
    var openingBalValue = "";
    var stockCode = $('#hdnStockiestCode').val();

    //$.ajax({
    //    type: 'POST',
    //    url: '../HiDoctor_Activity/SecondarySales/GetSecondarySalesopeningbalancePopup',
    //    data: JSON.stringify({ "SelectedProdlst": disProArray, "ProdDetailslst": productjsonStringPop, "Productprieclst": ProductPriceFillArray, "ProdOpenBallst": ProductOpenningBalanceFillArray, "year": yearVal, "month": monthVal, "PriceTypelst": productPrice_g.lstgrpType, "StockiestCode": $('#hdnStockiestCode').val(), "regionCode": regionCode }),
    //    contentType: 'application/json; charset=utf-8',
    //    success: function (response) {

    //        $("#dvAllPro").html(response);
    //        $("#dvAllProduct").overlay().load();
    //    }
    //});
    var op = 0;
    var is_inherited = "";
    var content = '';
    var sno = 0;
    if (disProArray.length > 0) {
        var lstopenBalances = "";
        content += "<div class='legendpopup'>";
        content += "<p>1.The products selected in this screen will get populated into the outside details grid screen with corresponding details. You can continue further editing as required.</p>";
        content += "<p>2.If you are modifying a Draft / Unapproved record, previously selected products will be shown as checked in this screen.</p>";
        content += "<p>Note: If you unselect a previously checked product from here, its details will be removed from the outside details grid as well.</p>";
        content += "</div>";
        content += "<div style='height:220px;overflow-y:scroll;overflow-x: hidden'>";
        content += "<table class='table table-striped' style='width: 99%;margin-left:7px'><thead>";
        if (disProArray.length == productjsonString.length) {
            content += "<tr><td style='padding:5px'>Select<input type='checkbox' checked='checked' name='chkSelectAll' onclick='fnSelectAll();'/></td>";
        } else {
            content += "<tr><td style='padding:5px'>Select<input type='checkbox' name='chkSelectAll' onclick='fnSelectAll();'/></td>";
        }
        content += "<td style='padding:5px'>Product Name</td><td style='padding:5px'>Unit Price(Rs.)</td><td style='padding:5px'>Last Closing Stock Qty.(Nos)</td></tr></thead><tbody>";
        is_inherited = fnGetStockiestinheritedOrNot(regionCode, stockCode);
        for (var i = 0; i < productjsonStringPop.length; i++) {
            sno++;
            lstopenBalances = "";
            var disjsonfilProd = $.grep(disProArray, function (ele, index) {
                return ele.Code == productjsonStringPop[i].Product_Code;
            });
            if (disjsonfilProd.length > 0) {
                content += "<tr><td><input type='checkbox' name='chkSelect' checked='checked' id='chkSelect_" + sno + "' value='" + productjsonStringPop[i].productCode + "'/></td>";
            }
            else {
                content += "<tr><td><input type='checkbox' name='chkSelect' id='chkSelect_" + sno + "' value='" + productjsonStringPop[i].productCode + "'/></td>";
            }
            if (productPrice_g.lstPricegrpSS.length > 0) {
                var lstProductpricecode = $.grep(productPrice_g.lstPricegrpSS, function (ele, index) {
                    return ele.Product_Code == productjsonStringPop[i].Product_Code;
                });
                var popProductprice = "";
                if (lstProductpricecode.length > 0) {
                    if (productPrice_g.lstgrpType[0].Price_Type == "PTS") {
                        popProductprice = lstProductpricecode[0].PTS;
                    }
                    else if (productPrice_g.lstgrpType[0].Price_Type == "INVOICE_AMOUNT") {
                        popProductprice = lstProductpricecode[0].INVOICE_AMOUNT;
                    }
                    else if (productPrice_g.lstgrpType[0].Price_Type == "PTR_WOTAX") {
                        popProductprice = lstProductpricecode[0].PTR_WOTax;
                    }
                    else if (productPrice_g.lstgrpType[0].Price_Type == "MRP") {
                        popProductprice = lstProductpricecode[0].MRP;
                    }
                    else if (productPrice_g.lstgrpType[0].Price_Type == "NRV") {
                        popProductprice = lstProductpricecode[0].NRV;
                    }
                }
            }
            content += "<td id='tdProductName_" + sno + "'>" + productjsonStringPop[i].Product_Name + "</td>";
            content += "<td id='tdProductPrice_" + sno + "'>" + popProductprice + "</td>";

            if (productAutofill_g.lstOpnBal.length > 0) {
                if (is_inherited == "1") {
                    lstopenBalances = $.grep(productAutofill_g.lstOpnBal, function (ele, index) {
                        return ele.Product_Code == productjsonStringPop[i].Product_Code && ele.Customer_Code == stockCode && ele.IS_Inherited == "1"
                    });
                }
                else {
                    lstopenBalances = $.grep(productAutofill_g.lstOpnBal, function (ele, index) {
                        return ele.Product_Code == productjsonStringPop[i].Product_Code && ele.Customer_Code == stockCode
                    });
                }
            }

            if (productAutofill_g.lstOpnBal.length > 0) {
                if (lstopenBalances.length > 0) {
                    content += "<td id='tdpopOpeningbalanes_" + sno + "'>" + lstopenBalances[0].Closing_Stock + "</td></tr>";
                    op = 1;
                }
                else {
                    content += "<td id='tdpopOpeningbalanes_" + sno + "'>0.00</td></tr>";
                }
            }
            else {
                content += "<td id='tdpopOpeningbalanes_" + sno + "'>0.00</td></tr>";
            }
        }
        content += "</tbody></table>";
        content += "</div>";
    } else {
        var lstopenBalances = "";
        content += "<div class='legendpopup'>";
        content += "<p>1.The products selected in this screen will get populated into the outside details grid screen with corresponding details. You can continue further editing as required.</p>";
        content += "<p>2.If you are modifying a Draft / Unapproved record, previously selected products will be shown as checked in this screen.</p>";
        content += "<p>Note: If you unselect a previously checked product from here, its details will be removed from the outside details grid as well.</p>";
        content += "</div>";
        content += "<div style='height:220px;overflow-y:scroll;overflow-x: hidden'>";
        content += "<table class='table table-striped' style='width: 99%;margin-left:7px'><thead>";
        if (disProArray.length == productjsonString.length) {
            content += "<tr><td style='padding:5px'>Select<input type='checkbox' checked='checked' name='chkSelectAll' onclick='fnSelectAll();'/></td>";
        } else {
            content += "<tr><td style='padding:5px'>Select<input type='checkbox' name='chkSelectAll' onclick='fnSelectAll();'/></td>";
        }
        content += "<td style='padding:5px'>Product Name</td><td style='padding:5px'>Unit Price(Rs.)</td><td style='padding:5px'>Last Closing Stock Qty.(Nos)</td></tr></thead><tbody>";
        is_inherited = fnGetStockiestinheritedOrNot(regionCode, stockCode);
        for (var i = 0; i < productjsonStringPop.length; i++) {
            lstopenBalances = "";
            sno++;
            content += "<tr><td><input type='checkbox' name='chkSelect' id='chkSelect_" + sno + "' value='" + productjsonStringPop[i].productCode + "'/></td>";
            if (productPrice_g.lstPricegrpSS.length > 0) {
                var lstProductpricecode = $.grep(productPrice_g.lstPricegrpSS, function (ele, index) {
                    return ele.Product_Code == productjsonStringPop[i].Product_Code;
                });
                var popProductprice = "";
                if (lstProductpricecode.length > 0) {
                    if (productPrice_g.lstgrpType[0].Price_Type == "PTS") {
                        popProductprice = lstProductpricecode[0].PTS;
                    }
                    else if (productPrice_g.lstgrpType[0].Price_Type == "INVOICE_AMOUNT") {
                        popProductprice = lstProductpricecode[0].INVOICE_AMOUNT;
                    }
                    else if (productPrice_g.lstgrpType[0].Price_Type == "PTR_WOTAX") {
                        popProductprice = lstProductpricecode[0].PTR_WOTax;
                    }
                    else if (productPrice_g.lstgrpType[0].Price_Type == "MRP") {
                        popProductprice = lstProductpricecode[0].MRP;
                    }
                    else if (productPrice_g.lstgrpType[0].Price_Type == "NRV") {
                        popProductprice = lstProductpricecode[0].NRV;
                    }
                }
            }
            content += "<td id='tdProductName_" + sno + "'>" + productjsonStringPop[i].Product_Name + "</td>";
            content += "<td id='tdProductPrice_" + sno + "'>" + popProductprice + "</td>";
            // 
            if (productAutofill_g.lstOpnBal.length > 0) {
                if (is_inherited == "1") {
                    lstopenBalances = $.grep(productAutofill_g.lstOpnBal, function (ele, index) {
                        return ele.Product_Code == productjsonStringPop[i].Product_Code && ele.Customer_Code == stockCode && ele.IS_Inherited == "1";
                    });
                }
                else {
                    lstopenBalances = $.grep(productAutofill_g.lstOpnBal, function (ele, index) {
                        return ele.Product_Code == productjsonStringPop[i].Product_Code && ele.Customer_Code == stockCode;
                    });
                }
            }

            if (productAutofill_g.lstOpnBal.length > 0) {
                if (lstopenBalances.length > 0) {
                    content += "<td id='tdpopOpeningbalanes_" + sno + "'>" + lstopenBalances[0].Closing_Stock + "</td></tr>";
                    op = 1;
                }
                else {
                    content += "<td id='tdpopOpeningbalanes_" + sno + "'>0.00</td></tr>";
                }
            }
            else {
                content += "<td id='tdpopOpeningbalanes_" + sno + "'>0.00</td></tr>";
            }
        }
        content += "</tbody></table>";
        content += "</div>";
    }
    if (productjsonStringPop.length > 0) {
        $("#dvAllPro").html(content);
        $("#dvAllProduct").overlay().load();
    }
}

function fnGetStockiestinheritedOrNot(regionCode, customerCode) {
    debugger;
    var is_Inherited = "";
    $.ajax({
        type: "GET",
        url: "../HiDoctor_Activity/SecondarySales/GetSSInheritedStatus",
        data: "regionCode=" + regionCode + "&customerCode=" + customerCode,
        async: false,
        success: function (resp) {
            is_Inherited = resp;
            return is_Inherited;
        }
    });
}

function fnGetRowId(rowObject) {
    return $(rowObject).find("input")[0].id.split("_")[1];
}

function fnresetAll() {
    $('input:checkbox[name=chkSelect]').each(function () {
        $(this).removeAttr('checked', 'checked');
    });
    $('#dvAllProduct').overlay().close();
    $.unblockUI();
    $('input:checkbox[name=chkSelectAll]').each(function () {
        $(this).removeAttr('checked', 'checked');
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
    var sno = 0;
    $("input:checkbox[name=chkSelect]").each(function () {
        sno++;
        if (this.checked) {
            debugger;
            flag = true;
            var id = this.id;
            flag = true;
            var productname = "";
            var unitprice = "";
            var opBalances = "";

            productCode = this.value;
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

    products += "]";
    PS += "]";
    var newSelectedproJson = eval('(' + products + ')');
    if (newSelectedproJson.length == 0) {
        fnMsgAlert('info', 'Secondary Sales', 'Atleast one product has to be selected to Show in Grid.');
        return false;
    } else {
        fnBindSelectedproduct(newSelectedproJson);
        $('#dvAllProduct').overlay().close();
        flag = "";
    }

}
function fnBindSelectedproduct(newSelectedproJson) {
    debugger;
    var alreadySelectedPro = "[";
    var trObj = $("#tblSecondarySales tr");
    var vallen = "";
    var pcode = "";

    var trObjects = $('#tblSecondarySales tbody tr.RowDataVisi');
    var i = 0;
    for (i = 0; i < trObjects.length; i++) {
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
    for (var x = 0; x < alreadySelectedPro.length; x++) {
        if (alreadySelectedPro[x].ProductCode != undefined) {
            var apcode = alreadySelectedPro[x].ProductCode.split("_")[0]
            var alreadyselectedproductCode = jsonPath(newSelectedproJson, "$.[?(@.ProductCode=='" + apcode + "')]");
            if (!alreadyselectedproductCode || alreadyselectedproductCode == null) {
                var i = 0;
                for (i = 0; i < trObjects.length; i++) {
                    var tr = trObjects[i];
                    var rowId = fnGetRowId(tr);
                    if ($("#hdnProductCode_" + rowId + "").length > 0 && $("#hdnProductCode_" + rowId + "").val() != '') {
                        var hdprocode = $("#hdnProductCode_" + rowId + "").val();
                        hdprocode = hdprocode.split('_')[0];
                        if (hdprocode == apcode) {

                            $("#txtProductName_" + rowId + "").closest('tr').remove();
                            $("#rowDataDyn_" + rowId + "").remove();
                        }
                    }
                }
            }
        }
    }

    for (var i = 0; i < newSelectedproJson.length; i++) {

        if (newSelectedproJson[i].ProductCode != undefined) {
            var pcode1 = newSelectedproJson[i].ProductCode.split("_")[0]
            //var productCode = jsonPath(alreadySelectedPro, "$.[?(@.ProductCode=='" + pcode1 + "')]");
            if (pcode1 != "" && pcode1 != undefined && pcode1 != null) {
                fnCreateNewRowInProduct("");
                k = parseInt(vallen) + 1;
                var trObjects = $("#tblSecondarySales tbody tr.RowDataVisi");
                var g = 0;
                for (g = 0; g < trObjects.length; g++) {
                    var tr = trObjects[g];
                    var rowId = fnGetRowId(tr);

                    if ($("#hdnProductCode_" + rowId + "").length > 0 && $("#hdnProductCode_" + rowId + "").val() == '' && $("#hdnProductCode_" + rowId + "").val() != undefined) {
                        $("#txtProductName_" + rowId + "").val(newSelectedproJson[i].ProductName);
                        $("#hdnProductCode_" + rowId + "").val(newSelectedproJson[i].ProductCode);
                        $("#txtUnitRate_" + rowId + "").val(newSelectedproJson[i].Productprice);
                        if (priceEdit == "NO") {
                            $("#txtUnitRate_" + rowId + "").attr("readOnly", "readOnly");
                        }
                        if (newSelectedproJson[i].opBlances == 0) {
                            $("#txtOPENING_BALANCE_" + rowId + "").val(0.00);
                            $("#txtOPENING_BALANCE_" + rowId + "").removeAttr('readOnly');
                            var ObjIdCal = {};
                            ObjIdCal.id = "txtUnitRate_" + rowId + "";
                            fnCalculate(ObjIdCal);
                        } else {
                            if (openingBalEdit.toUpperCase() == "YES") {
                                $("#txtOPENING_BALANCE_" + rowId + "").val(newSelectedproJson[i].opBlances);
                                $("#txtOPENING_BALANCE_" + rowId + "").removeAttr('readOnly');
                                var ObjIdCal = {};
                                ObjIdCal.id = "txtUnitRate_" + rowId + "";
                                fnCalculate(ObjIdCal);
                            } else {
                                $("#txtOPENING_BALANCE_" + rowId + "").val(newSelectedproJson[i].opBlances);

                                var ObjIdCal = {};
                                ObjIdCal.id = "txtUnitRate_" + rowId + "";
                                fnCalculate(ObjIdCal);
                            }

                        }
                        debugger;
                        //PS prefill functionality
                        //if (PSPrefillDetails != undefined && PSPrefillDetails.length != 0) {
                        //    if (PSDetails.length != 0) {
                        //        for (var p = 0; p < PSDetails.length; p++) {
                        //            var psjson = jsonPath(PSDetails, "$.[?(@.Product_Code=='" + newSelectedproJson[i].ProductCode.split("_")[0] + "')]");

                        //            if (psjson != false && psjson.length != 0) {
                        //                for (var k = 0; k < inputColumnArr.length; k++) {
                        //                    var inputcol = jsonPath(psjson, "$.[?(@.Column_Name=='" + inputColumnArr[k] + "')]");

                        //                    if (inputcol != false && inputcol.length > 0) {
                        //                        var txtbox = "txt" + inputcol[0].Column_Name + "_" + rowId;
                        //                        var EditJs = jsonPath(PSPrefillDetails, "$.[?(@.Column_Name=='" + inputColumnArr[k] + "')]");

                        //                        $("#" + txtbox).val(inputcol[0].Qty);
                        //                        var ObjIdCal = {};
                        //                        ObjIdCal.id = "txtUnitRate_" + rowId + "";
                        //                        fnCalculate(ObjIdCal);

                        //                        if (EditJs != false && EditJs.length > 0) {
                        //                            if (EditJs[0].Is_Editable == '0') {
                        //                                $("#" + txtbox).attr('readonly', 'true');
                        //                            }
                        //                        }
                        //                    }
                        //                }
                        //            }
                        //        }
                        //    }
                        //}
                        if (PSPrefillDetails != undefined && PSPrefillDetails.length != 0) {
                            if (PSDetails.length != 0) {
                                var psjson = jsonPath(PSDetails, "$.[?(@.Product_Code=='" + newSelectedproJson[i].ProductCode.split("_")[0] + "')]");
                                if (psjson != false && psjson.length != 0) {
                                    for (var k = 0; k < inputColumnArr.length; k++) {
                                        var inputcol = jsonPath(psjson, "$.[?(@.Column_Name=='" + inputColumnArr[k] + "')]");

                                        if (inputcol != false && inputcol.length > 0) {
                                            var txtbox = "txt" + inputcol[0].Column_Name + "_" + rowId;
                                            var EditJs = jsonPath(PSPrefillDetails, "$.[?(@.Column_Name=='" + inputColumnArr[k] + "')]");

                                            $("#" + txtbox).val(inputcol[0].Qty);
                                            var ObjIdCal = {};
                                            ObjIdCal.id = "txtUnitRate_" + rowId + "";
                                            fnCalculate(ObjIdCal);

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
                        break;
                    }

                }
            }
        }
    }
    $.unblockUI();
}

function fnGetDynamicColumnsforGrid() {
    debugger;
    var monthyear = $('#txtMonth').val();
    var monthVal = fnGetMonth(monthyear.split('-')[0]);
    var yearVal = monthyear.split('-')[1];
    $.ajax({
        type: "GET",
        url: "../HiDoctor_Activity/SecondarySales/GetDynamicColumnsForSS",
        data: "month=" + monthVal + "&year=" + yearVal,
        success: function (resp) {
            SS_DynamicColumns_g = resp;
            SS_DynamicColumns_g = SS_DynamicColumns_g.sort(function (a, b) { return a - b });
            fnProductWisePrice();
        }
    });
}
function fnHideGridDynamic(rowid) {
    debugger;
    $('#gridminus_' + rowid).hide();
    $('#gridplus_' + rowid).show();
    $('#rowDataDyn_' + rowid).hide();
}
function fnShowGridDynamic(rowid) {
    debugger;
    $('#gridplus_' + rowid).hide();
    $('#gridminus_' + rowid).show();
    $('#rowDataDyn_' + rowid).show();
}

function fnPopHideGridDynamic(rowid) {
    debugger;
    $('#gridminuspop_' + rowid).hide();
    $('#gridpluspop_' + rowid).show();
    $('#rowDataDynaPop_' + rowid).hide();
}
function fnPopShowGridDynamic(rowid, ssDetCode) {
    debugger;
    $.ajax({
        type: "GET",
        url: "../HiDoctor_Activity/SecondarySales/GetDynamicColumnsInfo",
        data: "ssdetailCode=" + ssDetCode,
        success: function (resp) {
            var contentBind = fnBindDynamicGridForView(rowid, resp);
            if (contentBind != "" && contentBind != undefined) {
                $('#rowtdDyna_' + rowid).html(contentBind);
                $('#gridpluspop_' + rowid).hide();
                $('#gridminuspop_' + rowid).show();
                $('#rowDataDynaPop_' + rowid).show();
            }
        }
    });
}

function fnGetDynamicColumnsBindHTML(rowVal) {
    debugger;
    var content = '';
    if (SS_DynamicColumns_g.length > 0) {
        content += '<div class="col-lg-12  form-group">';
        for (var i = 0; i < SS_DynamicColumns_g.length; i++) {

            if (SS_DynamicColumns_g[i].Input_DataType.toUpperCase() == "TEXT") {

                content += '<div id="rowdyn_' + rowVal + '_' + i + '" class="row">';
                content += '<div class="col-lg-12 form-group remove-left-padding">';
                content += '<div class="col-lg-3 form-group">';
                content += '<label style="font-size:12px;">' + SS_DynamicColumns_g[i].Input_Label + '</label></div>';
                content += '<div class="col-lg-8 form-group">';
                var label = SS_DynamicColumns_g[i].Input_Label;
                label = label.replace(/ /g, "_");
                content += '<input type="text" id="txt' + label + '_' + rowVal + '" maxLength="500"  class="input-large form-control dynaSS checkstring" style="width:50% !important;" autocomplete="off" placeholder="Please Enter ' + SS_DynamicColumns_g[i].Input_Label + ' Here..." />';
                content += '<input type="hidden" id="hdn' + label + '_' + rowVal + '" value="0"/></div>';
                content += '</div></div>';
            }
            if (SS_DynamicColumns_g[i].Input_DataType.toUpperCase() == "NUMBER") {
                content += '<div id="rowdyn_' + rowVal + '_' + i + '" class="row">';
                content += '<div class="col-lg-12 form-group remove-left-padding">';
                content += '<div class="col-lg-3 form-group">';
                content += '<label style="font-size:12px;">' + SS_DynamicColumns_g[i].Input_Label + '</label></div>';
                content += '<div class="col-lg-8 form-group">';
                var label = SS_DynamicColumns_g[i].Input_Label;
                label = label.replace(/ /g, "_");
                content += '<input type="number" min="1" max="999999" id="txt' + label + '_' + rowVal + '" class="input-large form-control numbersOnly dynaSS checknumber" autocomplete="off" onkeypress="return fnValidateNumber(this,event);" onpaste="return false";  style="width:50% !important;" placeholder="Please Enter ' + SS_DynamicColumns_g[i].Input_Label + ' Here...(Numbers Only)" />';
                content += '<input type="hidden" id="hdn' + label + '_' + rowVal + '" value="0"/></div>';
                content += '</div></div>';
            }
            if (SS_DynamicColumns_g[i].Input_DataType.toUpperCase() == "TEXTAREA") {
                content += '<div id="rowdyn_' + rowVal + '_' + i + '" class="row">';
                content += '<div class="col-lg-12 form-group remove-left-padding">';
                content += '<div class="col-lg-3 form-group">';
                content += '<label style="font-size:12px;">' + SS_DynamicColumns_g[i].Input_Label + '</label></div>';
                content += '<div class="col-lg-8 form-group">';
                var label = SS_DynamicColumns_g[i].Input_Label;
                label = label.replace(/ /g, "_");
                content += '<textarea id="txt' + label + '_' + rowVal + '" maxLength="500" rows="3" style="resize:none;width:50% !important;"  placeholder="Please Enter ' + SS_DynamicColumns_g[i].Input_Label + ' Here..."  class="dynaSS checkstring"/></textarea>';
                content += '<input type="hidden" id="hdn' + label + '_' + rowVal + '" value="0"/></div>';
                content += '</div></div>';
            }
            if (SS_DynamicColumns_g[i].Input_DataType.toUpperCase() == "DATE") {
                content += '<div id="rowdyn_' + rowVal + '_' + i + '" class="row">';
                content += '<div class="col-lg-12 form-group remove-left-padding">';
                content += '<div class="col-lg-3 form-group">';
                content += '<label style="font-size:12px;">' + SS_DynamicColumns_g[i].Input_Label + '</label></div>';
                content += '<div class="col-lg-8 form-group">';
                var label = SS_DynamicColumns_g[i].Input_Label;
                label = label.replace(/ /g, "_");
                content += '<input type="text" readOnly="readOnly" id="txt' + label + '_' + rowVal + '" autocomplete="off" class="input-large form-control datecls dynaSS checkdate" style="width:50% !important;" placeholder="Please Enter ' + SS_DynamicColumns_g[i].Input_Label + ' Date Here..." />';
                content += '<input type="hidden" id="hdn' + label + '_' + rowVal + '" value="0"/></div>';
                content += '</div></div>';

            }

        }
        content += '</div>';
    }
    return content;

}
function fnDynamicEventBinder() {

    $('.datecls').click(function () { fnCreateDatePickerforDynamic(this); });
    $('.checkstring').blur(function () { fnValidateDynaInputs(this, 'TEXT'); });
    // $('.checknumber').blur(function () { return fnValidateNumber(this, 'NUMBER', event); });
    //$('.checkdate').blur(function () { fnValidateDynaInputs(this, 'DATE'); });
    $('.checkstring').blur(function () { fnValidateDynaInputs(this, 'TEXTAREA'); });



}
function fnCreateDatePickerforDynamic(Id) {
    debugger;
    if (Id.id != "") {
        $(function () {
            $("#" + Id.id).datepicker({
                dateFormat: 'dd/mm/yy',
                numberOfMonths: 1,
                changeMonth: true,
                changeYear: true,
            });
        });
    }
}

function fnBindDynamicGridForView(rowid, resp) {
    debugger;
    var content = '';
    if (resp.length > 0) {
        content += '<div class="col-lg-12  form-group">';
        for (var i = 0; i < resp.length; i++) {

            if (resp[i].Input_DataType.toUpperCase() == "TEXT") {

                content += '<div id="rowdyn_' + rowid + '_' + i + '" class="row pddng">';
                content += '<div class="col-lg-12 form-group remove-left-padding">';
                content += '<div class="col-lg-3 form-group">';
                content += '<label style="font-size:12px;">' + resp[i].Input_Label + '</label></div>';
                content += '<div class="col-lg-3 form-group">';
                content += '<span style="font-size:12px;">' + resp[i].Input_Value + '</span></div></div></div>';

            }
            if (resp[i].Input_DataType.toUpperCase() == "NUMBER") {
                content += '<div id="rowdyn_' + rowid + '_' + i + '" class="row pddng">';
                content += '<div class="col-lg-12 form-group remove-left-padding">';
                content += '<div class="col-lg-3 form-group">';
                content += '<label style="font-size:12px;">' + resp[i].Input_Label + '</label></div>';
                content += '<div class="col-lg-3 form-group">';
                content += '<span style="font-size:12px;">' + resp[i].Input_Value + '</span></div></div></div>';
            }
            if (resp[i].Input_DataType.toUpperCase() == "TEXTAREA") {
                content += '<div id="rowdyn_' + rowid + '_' + i + '" class="row pddng">';
                content += '<div class="col-lg-12 form-group remove-left-padding">';
                content += '<div class="col-lg-3 form-group">';
                content += '<label style="font-size:12px;">' + resp[i].Input_Label + '</label></div>';
                content += '<div class="col-lg-3 form-group">';
                content += '<span style="font-size:12px;">' + resp[i].Input_Value + '</span></div></div></div>';
            }
            if (resp[i].Input_DataType.toUpperCase() == "DATE") {
                content += '<div id="rowdyn_' + rowid + '_' + i + '" class="row pddng">';
                content += '<div class="col-lg-12 form-group remove-left-padding">';
                content += '<div class="col-lg-3 form-group">';
                content += '<label style="font-size:12px;">' + resp[i].Input_Label + '</label></div>';
                content += '<div class="col-lg-3 form-group">';
                content += '<span style="font-size:12px;">' + resp[i].Input_Value + '</span></div></div></div>';
            }
        }
        content += '</div>';
    }
    return content;
}

function fnViewRemarksHistory(value) {
    debugger;
    if (value != "") {
        $.ajax({
            type: "GET",
            url: "../HiDoctor_Master/Approval/GetSSRemarksHistory",
            data: "regionCode=" + value.split('|')[0] + "&ssCode=" + value.split('|')[1],
            success: function (resp) {
                fnBindRemraksHistoryHTML(resp);
            }
        })
    }
}
function fnBindRemraksHistoryHTML(resp) {
    debugger;
    var content = "";


    content += "<table class='table table-striped'>";
    content += "<thead>";
    content += "<tr>";
    content += "<th>Action By</th>";
    content += "<th>Action Date</th>";
    content += "<th>Status</th>";
    content += "<th>Remarks</th>";
    content += "</tr></thead><tbody style='text-align:center;'>";
    if (resp.length > 0 && resp != "NO") {
        for (var i = 0; i < resp.length; i++) {
            content += "<tr>";
            if (resp[i].SS_Status == "DRAFT" || resp[i].SS_Status == "APPLIED") {
                //if (resp[i].Approved_By == "") {
                content += "<td>" + resp[i].Entered_By + "</td>";
            } else {
                content += "<td>" + resp[i].Approved_By + "</td>";
            }
            if (resp[i].SS_Status == "DRAFT" || resp[i].SS_Status == "APPLIED") {
                //if (resp[i].Approved_Date == "") {
                content += "<td>" + resp[i].Entered_Date + "</td>";
            } else {
                content += "<td>" + resp[i].Approved_Date + "</td>";
            }
            content += "<td>" + resp[i].SS_Status + "</td>";
            content += "<td>" + resp[i].Remarks + "</td>";
            content += "</tr>";
        }
    }
    else {
        content += "<tr style='text-align:center;font-weight:bold;'><td colspan='4'>No Record(s) Found.</td></tr>";
    }
    content += "</tbody></table>";
    $('#SckstNamermrks').html(resp[0].Customer_Name);
    var month = fnGetMonthName(resp[0].Month);
    $('#monthSSrmrks').html(month);
    $('#yearSSrmrks').html(resp[0].Year);
    $('#divModelrmrks').html(content);
    $('#mymodalRemarks').modal('show');
}
function fnGetMonth(month) {

    var MonthNum = '';
    if (month.toUpperCase() == "JAN") {
        MonthNum = 1;
    } else if (month.toUpperCase() == "FEB") {
        MonthNum = 2;
    } else if (month.toUpperCase() == "MAR") {
        MonthNum = 3;
    } else if (month.toUpperCase() == "APR") {
        MonthNum = 4;
    } else if (month.toUpperCase() == "MAY") {
        MonthNum = 5;
    } else if (month.toUpperCase() == "JUN") {
        MonthNum = 6;
    } else if (month.toUpperCase() == "JUL") {
        MonthNum = 7;
    } else if (month.toUpperCase() == "AUG") {
        MonthNum = 8;
    } else if (month.toUpperCase() == "SEP") {
        MonthNum = 9;
    } else if (month.toUpperCase() == "OCT") {
        MonthNum = 10;
    } else if (month.toUpperCase() == "NOV") {
        MonthNum = 11;
    } else if (month.toUpperCase() == "DEC") {
        MonthNum = 12;
    }
    return MonthNum;
}
function fnGetMonthName(month) {

    var MonthNum = '';
    if (month == "1") {
        MonthNum = "JANUARY";
    } else if (month == "2") {
        MonthNum = "FEBRUARY";
    } else if (month == "3") {
        MonthNum = "MARCH";
    } else if (month == "4") {
        MonthNum = "APRIL";
    } else if (month == "5") {
        MonthNum = "MAY";
    } else if (month == "6") {
        MonthNum = "JUNE";
    } else if (month == "7") {
        MonthNum = "JULY";
    } else if (month == "8") {
        MonthNum = "AUGUST";
    } else if (month == "9") {
        MonthNum = "SEPTEMBER";
    } else if (month == "10") {
        MonthNum = "OCTOBER";
    } else if (month == "11") {
        MonthNum = "NOVEMBER";
    } else if (month == "12") {
        MonthNum = "DECEMBER";
    }
    return MonthNum;
}
function fnValidateDynaInputs(ID, type) {
    debugger;
    var rowNo = ID.id.split('_');
    rowNo = rowNo[rowNo.length - 1];
    if (type.toUpperCase() == "TEXT") {
        if ($('#' + ID.id).val() != "" && $('#' + ID.id).val() != undefined && $('#' + ID.id).val() != null) {
            var result = fnValidateInputParamters($('#' + ID.id).val());
            var label = ID.id;
            label = label.replace('txt', '');
            label = label.replace(/[0-9_ ]/g, ' ');
            if (result) {
                fnMsgAlert('info', 'Secondary Sales', "Special characters (A-Za-z0-9@.,'(){}[]/\<>?!_-) are allowed in the " + label + "for the product '" + $('#txtProductName_' + rowNo).val() + "'");
                return false;
            }
        }
    }
    else if (type.toUpperCase() == "TEXTAREA") {
        if ($('#' + ID.id).val() != "" && $('#' + ID.id).val() != undefined && $('#' + ID.id).val() != null) {
            var result = fnValidateInputParamters($('#' + ID.id).val());
            var label = ID.id;
            label = label.replace('txt', '');
            label = label.replace(/[0-9_ ]/g, ' ');
            if (result) {
                fnMsgAlert('info', 'Secondary Sales', "Special characters (A-Za-z0-9@.,'(){}[]/\<>?!_-) are allowed in the " + label + "for the product '" + $('#txtProductName_' + rowNo).val() + "'");
                return false;
            }
        }
    }
    //else if (type.toUpperCase() == "DATE") {
    //    if ($('#' + ID.id).val() != "" && $('#' + ID.id).val() != undefined && $('#' + ID.id).val() != null) {
    //        var result = fnValidDateOrNot($('#' + ID.id));
    //        if (!result) {

    //        }
    //    }

    //}
}
function fnValidateNumber(id, evt) {
    debugger;
    if (evt.keyCode == 69 || evt.keyCode == 16 || evt.keyCode == 101) {
        return false;
    }
    else if (evt.keyCode == 45 || evt.keyCode == 43 || evt.shiftKey == true || evt.keyCode == 187 || evt.keyCode == 189) {
        return false;
    } else {
        if ($('#' + id.id).val().length >= 10) {
            return false;

        }
    }
}

function fnValidateNumberForTransitandFreeGoods(id, evt) {
    debugger;
    if (evt.keyCode == 69 || evt.keyCode == 16 || evt.keyCode == 101) {
        return false;
    }
    else {
        if ($('#' + id.id).val().length >= 10) {
            return false;
        }
    }
}
function fnClose() {
    debugger;
    $('#dvalert').hide();
    return false;
}
function fnCloseOverlay() {
    debugger;

    var selectd_lgth = $("input:checkbox[name=chkSelect]:checked").length;
    var disProArray = new Array();
    var trs = $("#tblSecondarySales tr.RowDataVisi");


    var sno = 0;
    for (i = 0; i < trs.length; i++) {
        sno++;
        var rowId = fnGetRowId(trs[i]);

        if ($("#txtProductName_" + rowId + "").val() != "" && $("#hdnProductCode_" + rowId + "").val() != "" && $("#hdnProductCode_" + rowId + "").val() != undefined) {
            var product = {};
            var hdproductCode = $("#hdnProductCode_" + rowId + "").val().split("_")[0];
            product.Code = hdproductCode;
            disProArray.push(product);
        }
    }
    if (selectd_lgth == disProArray.length) {
        $('#dvAllProduct').overlay().close();
        $.unblockUI();
    } else {
        fnMsgAlert('info', 'Secondary Sales', 'Please click on "Show in Grid" for the newly selected products to fill in the grid.');
        return false;
    }
}

function fnDraftSecodnarySales(val) {
    debugger;
    $.blockUI();
    var monthyear = $('#txtMonth').val();
    var month = fnGetMonth(monthyear.split('-')[0]);
    var year = monthyear.split('-')[1];
    var baseCode = $('#hdnStockiestCode').val();
    var baseType = 'STOCKIEST';
    var ssStatementDate = $('#txtStatmentDate').val();
    if (ssStatementDate != "") {
        ssStatementDate = ssStatementDate.split('/')[2] + '/' + ssStatementDate.split('/')[1] + '/' + ssStatementDate.split('/')[0];
    }
    var ssStatus = ""
    if ($('#hdnStatus').val() != "" && $('#hdnStatus').val() != undefined && $('#hdnStatus').val() != null) {
        ssStatus = $('#hdnStatus').val();
    }
    var ssCode = "";
    if ($('#hdnSSCode').val() != "" && $('#hdnSSCode').val() != undefined && $('#hdnSSCode').val() != null) {
        ssCode = $('#hdnSSCode').val();
    }

    var rCntSSalesTable = $('#tblSecondarySales tbody tr.RowDataVisi').length;
    var rCntSSalesDetTbl = $('#tblSecondarySales tbody tr.RowDataVisi');
    var SSProdArray = [];
    var SSDynaProdArrary = [];
    //var rowno = 0;
    for (var i = 0; i < rCntSSalesTable; i++) {
        var rowno = rCntSSalesDetTbl[i].id;
        rowno = rowno.split('_')[1];


        if ($('#hdnProductCode_' + rowno).val().split('_')[0] != 0 && $('#hdnProductCode_' + rowno).val().split('_')[0] != undefined && $('#hdnProductCode_' + rowno).val().split('_')[0] != null) {

            var productCode = $('#hdnProductCode_' + rowno).val().split('_')[0];
            var divisionCode = $('#hdnProductCode_' + rowno).val().split('_')[1]
            var unitPrice = $('#txtUnitRate_' + rowno).val();
            var openingBalance = 0.00;
            var purchase = 0.00;
            var purchaseReturn = 0.00;
            var sales = 0.00;
            var salesReturn = 0.00;
            var damagedGoods = 0.00;
            var expiredGoods = 0.00;
            var transit = 0.00;
            var freeGoods = 0.00;
            var remarks = "";
            var closingBalance = 0.00;
            var rowFlag = rowno;

            for (var k = 0; k < inputColumnArr.length; k++) {
                if (inputColumnArr[k] == "CLOSING_BALANCE") {
                    closingBalance = $('#txt' + inputColumnArr[k] + '_' + rowno).val();
                }
                else if (inputColumnArr[k] == "DAMAGED_GOODS") {
                    damagedGoods = $('#txt' + inputColumnArr[k] + '_' + rowno).val();
                }
                else if (inputColumnArr[k] == "FREE_GOODS") {
                    freeGoods = $('#txt' + inputColumnArr[k] + '_' + rowno).val();
                }
                else if (inputColumnArr[k] == "EXPIRED_GOODS") {
                    expiredGoods = $('#txt' + inputColumnArr[k] + '_' + rowno).val();
                }
                else if (inputColumnArr[k] == "OPENING_BALANCE") {
                    openingBalance = $('#txt' + inputColumnArr[k] + '_' + rowno).val();
                }
                else if (inputColumnArr[k] == "TRANSIT") {
                    transit = $('#txt' + inputColumnArr[k] + '_' + rowno).val();
                }
                else if (inputColumnArr[k] == "PURCHASE") {
                    purchase = $('#txt' + inputColumnArr[k] + '_' + rowno).val();
                }
                else if (inputColumnArr[k] == "PURCHASE_RETURN") {
                    purchaseReturn = $('#txt' + inputColumnArr[k] + '_' + rowno).val();
                }
                else if (inputColumnArr[k] == "SALES") {
                    sales = $('#txt' + inputColumnArr[k] + '_' + rowno).val();
                }
                else if (inputColumnArr[k] == "SALES_RETURN") {
                    salesReturn = $('#txt' + inputColumnArr[k] + '_' + rowno).val();
                }
                else if (inputColumnArr[k] == "REMARKS") {
                    remarks = $('#txt' + inputColumnArr[k] + '_' + rowno).val();
                }

            }
            var objProductRow = {
                Product_Code: productCode,
                Unit_Price_Rate: unitPrice,
                Opening_Balance: openingBalance,
                Closing_Balance: closingBalance,
                Division_Code: divisionCode,
                Purchase: purchase,
                Purchase_Return: purchaseReturn,
                Sales: sales,
                Sales_Return: salesReturn,
                Damaged_Goods: damagedGoods,
                Expired_Goods: expiredGoods,
                Free_Goods: freeGoods,
                Transit: transit,
                Remarks: remarks,
                Row_Exists_Flag: rowFlag
            };
            SSProdArray.push(objProductRow);
            for (var j = 0; j < SS_DynamicColumns_g.length; j++) {

                var label = SS_DynamicColumns_g[j].Input_Label;
                label = label.replace(/ /g, '_');

                var InputValue = "";
                var InputId = "";
                if ($('#txt' + label + '_' + rowno).val() != "" && $('#txt' + label + '_' + rowno).val() != null && $('#txt' + label + '_' + rowno).val() != undefined) {
                    InputValue = $('#txt' + label + '_' + rowno).val();
                    InputId = SS_DynamicColumns_g[j].Input_DynamicId;

                    var objDynaDet = {
                        Input_Value: InputValue,
                        Input_DynamicId: InputId,
                        Product_Code: productCode,
                        Row_Dynamic_Exists_Flag: rowno
                    };
                    SSDynaProdArrary.push(objDynaDet);
                }
            }
        }
    }
    var ObjMainSSComplete = {
        Month: month,
        Year: year,
        User_Code: selectedUserCode,
        SS_Code: ssCode,
        Region_Code: regionCode,
        Base_Code: baseCode,
        Base_Type: baseType,
        SS_Statement_Date: ssStatementDate,
        SS_Status: ssStatus,
        SS_Approval_Status: '3',
        LstProdDet: SSProdArray,
        LstDynaDet: SSDynaProdArrary
    };
    $.ajax({
        type: "POST",
        url: "../HiDoctor_Activity/SecondarySales/InsertSecondarySalesDraft",
        data: JSON.stringify({ "ObjSSDetails": ObjMainSSComplete }),
        contentType: 'application/json; charset=utf-8',
        success: function (resp) {
            if (resp != "" && resp != null) {
                $('#hdnStatus').val('EXIST');
                $('#hdnSSCode').val(resp);
                fnChnageEachRowStatusForDraft();
                var monthName = fnGetMonthName(month);
                fnMsgAlert('success', 'Secondary Sales', 'Secondary Sales for ' + monthName + '-' + year + ' is drafted Successfully.');
                return false;
            } else {
                $('#hdnStatus').val('');
                var monthName = fnGetMonthName(month);
                $.unblockUI();
                fnMsgAlert('error', 'Secondary Sales', 'Secondary Sales for ' + monthName + '-' + year + ' is failed to draft.');
                return false;
            }

        },
    });
}
function fnChnageEachRowStatusForDraft() {
    debugger;
    var rCntSSalesTable = $('#tblSecondarySales tbody tr.RowDataVisi').length;
    var rCntSSalesDetTbl = $('#tblSecondarySales tbody tr.RowDataVisi');

    for (var i = 0; i < rCntSSalesTable; i++) {
        var rowno = rCntSSalesDetTbl[i].id;
        rowno = rowno.split('_')[1];
        if ($('#hdnProductCode_' + rowno).val().split('_')[0] != 0 && $('#hdnProductCode_' + rowno).val().split('_')[0] != undefined && $('#hdnProductCode_' + rowno).val().split('_')[0] != null) {
            $('#hdnStatusforEachItem_' + rowno).val(1);
        }
        for (var j = 0; j < SS_DynamicColumns_g.length; j++) {

            var label = SS_DynamicColumns_g[j].Input_Label;
            label = label.replace(/ /g, '_');

            if ($('#txt' + label + '_' + rowno).val() != "" && $('#txt' + label + '_' + rowno).val() != null && $('#txt' + label + '_' + rowno).val() != undefined) {
                $('#hdn' + label + '_' + rowno).val(1);
            }

        }
    }
    $.unblockUI();
}
var submitwithoutsubmittingprevmonthss = false;
function fnSubmitValidate(val) {
    debugger;
    $.blockUI();
    var mode = val
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
    isTrue = fnValidateNumbers();
    if (isTrue != true) {
        $.unblockUI();
        return false;
    }
    fnSubmitProceed();
}
function fnValidateNumbers() {
    debugger;
    var flag = true;
    var rCntSSales = $('#tblSecondarySales tbody tr.RowDataVisi').length;
    var rCntSSalesDet = $('#tblSecondarySales tbody tr.RowDataVisi');
    var productNameArr = [];
    for (var i = 0; i < rCntSSales; i++) {
        var rowno = rCntSSalesDet[i].id;
        rowno = rowno.split('_')[1];
        for (var k = 0; k < inputColumnArr.length; k++) {
            if (inputColumnArr[k].toUpperCase() != "REMARKS" && inputColumnArr[k].toUpperCase() != "TRANSIT" && inputColumnArr[k].toUpperCase() != "FREE_GOODS") {
                if ($('#txt' + inputColumnArr[k] + '_' + rowno).val() != 0 && $('#txt' + inputColumnArr[k] + '_' + rowno).val() != NaN) {
                    if ($('#txt' + inputColumnArr[k] + '_' + rowno).val() < 0) {
                        var label = inputColumnArr[k].replace('_', ' ');
                        fnMsgAlert('info', 'Secondary Sales', 'Negative Values are not allowed in ' + label + ' field.')
                        flag = false;
                        return;
                    }
                }
            }
            if (!flag) {
                return flag;
            }
        }
        if (!flag) {
            return flag;
        }
    }
    return flag;
}

// Validate screens
function fbValidation() {
    var flag = true;
    //if ($('#drpMonth').val() == 0) {
    //    fnMsgAlert('info', 'Secondary Sales', 'Select month.');
    //    flag = false;
    //    return;
    //}
    //if ($('#drpYear').val() == 0) {
    //    fnMsgAlert('info', 'Secondary Sales', 'Select year.');
    //    flag = false;
    //    return;
    //}

    if ($('#txtMonth').val() == "" || $('#txtMonth').val() == null || $('#txtMonth').val() == undefined) {
        fnMsgAlert('info', 'Secondary Sales', 'Please Select Month & Year.');
        flag = false;
        return;
    }
    if ($('#txtStatmentDate').val() == "") {
        fnMsgAlert('info', 'Secondary Sales', 'Select StatementDate.');
        flag = false;
        return;
    }
    if ($('#txtStockiestName').val() == "") {
        fnMsgAlert('info', 'Secondary Sales', 'Enter stockiest name.');
        flag = false;
        return;
    }

    var rCntSSales = $('#tblSecondarySales tbody tr.RowDataVisi').length;
    var rCntSSalesDet = $('#tblSecondarySales tbody tr.RowDataVisi');
    var productNameArr = [];
    for (var i = 0; i < rCntSSales; i++) {
        var rowno = rCntSSalesDet[i].id;
        rowno = rowno.split('_')[1];
        if ($("#txtProductName_" + rowno).length > 0 && $("#txtProductName_" + rowno).val() != "") {
            if ($.inArray($("#txtProductName_" + rowno).val(), productNameArr) > -1) {
                fnMsgAlert('info', 'Secondary Sales', 'Product name ' + $("#txtProductName_" + rowno).val() + ' is entered more than one time. It is not allowed.');
                $("#txtProductName_" + rowno).focus();
                flag = false;
                return;
            }
            productNameArr.push($("#txtProductName_" + rowno).val());
        }
    }
    if (productNameArr.length == 0) {
        fnMsgAlert('info', 'Secondary Sales', 'Enter atleast one Product name.');
        flag = false;
        return;
    }
    return flag;
}

function fnSecondarySalesValidation() {
    debugger;
    var ssValidationflag = true;
    if ($.trim($('#txtStatmentDate').val()).length > 0) {
        var monthyear = $('#txtMonth').val();
        var monthVal = fnGetMonth(monthyear.split('-')[0]);
        var yearVal = monthyear.split('-')[1];
        if (monthVal.length == 1) {
            monthVal = '0' + monthVal;
        }
        var DateVal = yearVal + "-" + monthVal + "-" + "01";
        var ssStatement = $.trim($('#txtStatmentDate').val());
        var ss = $.trim($('#txtStatmentDate').val()).split('/');
        var ssDate = ss[2] + "-" + ss[1] + "-" + ss[0];
        var ssMonth = ssStatement.split('/')[1];
        var ssYear = ssStatement.split('/')[2];
        if (monthVal.length > 0 && yearVal.length > 0) {
            if (ssDate < DateVal) {
                fnMsgAlert('info', 'Secondary Sales', 'Sales Statement date cannot be prior to Secondary Sales Month & Year.');
                ssValidationflag = false;
                return;
            }
        }
    }
    // Stockiest Validation
    if ($('#txtStockiestName').val() != "") {
        var jSonStockiest = jsonPath(stockistList_g, "$.[?(@.value =='" + $.trim($('#hdnStockiestCode').val()) + "')]");
        if (!(jSonStockiest.length > 0)) {
            fnMsgAlert('info', 'Secondary Sales', $('#txtStockiestName').val() + '  Stockiest name  is invalid.');
            $('#txtStockiestName').focus();
            ssValidationflag = false;
            return;
        }
    }
    var rCntSSales = $('#tblSecondarySales tbody tr.RowDataVisi').length;
    var rCntSSalesDet = $('#tblSecondarySales tbody tr.RowDataVisi');

    for (var i = 0; i < rCntSSales; i++) {
        var sno = rCntSSalesDet[i].id;
        sno = sno.split('_')[1];
        if ($("#txtProductName_" + sno).length > 0 && $("#txtProductName_" + sno).val() != "") {
            var selectedValue = jsonPath(productAutofill_g.lstProdDet, "$.[?(@.Product_Code =='" + $("#hdnProductCode_" + sno).val().split('_')[0] + "')]");
            if (!(selectedValue.length > 0)) {
                fnMsgAlert('info', 'Secondary Sales', $("#txtProductName_" + sno).val() + '  Product name  is invalid.');
                $("#txtProductName_" + sno).focus();
                ssValidationflag = false;
                return;
            }
        }
    }
    return ssValidationflag;
}

function fnSecondarySalesProceedChangeBoolean() {
    debugger;
    submitwithoutsubmittingprevmonthss = true;
    $('#DeleteModal').modal('hide');
    if (submitwithoutsubmittingprevmonthss) {
        fnReadSecondarySalesTable(1);

    }

}
function fnSubmitProceed() {
    debugger;
    fnReadSecondarySalesTable(1);
}

var SSProdArray = [];
var SSDynaProdArrary = [];
var ObjMainSSComplete = {};
function fnReadSecondarySalesTable(val) {
    debugger;
    var savemode = "";
    savemode = val;
    var results = "";
    secondaryDetails = "";
    var productCode = "", month = "", year = "", statementDate = "", baseTypeCode = "", baseCode = "", ssStatus = "", ProductRemarks = "";
    var customerCode = "", customerEntityType = "", divisionCode = "";
    var openingBalance = 0.00, purchase = 0.00, purchaseReturn = 0.00, unitrate = 0.00;
    var sales = 0.00, salesReturn = 0.00, transit = 0.00, closingBalance = 0.00, freeGoods = 0.00; damagedGoods = 0.00; expiredGoods = 0.00;
    var monthyear = $('#txtMonth').val();
    month = fnGetMonth(monthyear.split('-')[0]);
    year = monthyear.split('-')[1];
    statementDate = $('#txtStatmentDate').val();
    if (statementDate != "") {
        statementDate = statementDate.split('/')[2] + '/' + statementDate.split('/')[1] + '/' + statementDate.split('/')[0];
    }
    ssStatus = $('#hdnStatus').val();
    SSProdArray = [];
    SSDynaProdArrary = [];
    ObjMainSSComplete = {};
    debugger;
    var rCntSSalesTable = $('#tblSecondarySales tbody tr.RowDataVisi').length;
    var rCntSSalesDettbl = $('#tblSecondarySales tbody tr.RowDataVisi');
    baseCode = $('#hdnStockiestCode').val();
    baseTypeCode = "STOCKIEST";


    for (i = 0; i < rCntSSalesTable; i++) {
        var rowno = rCntSSalesDettbl[i].id;
        rowno = rowno.split('_')[1];
        if ($("#txtProductName_" + rowno).length > 0 && $("#txtProductName_" + rowno).val() != "") {
            var prodDivCode = $("#hdnProductCode_" + rowno).val();
            productCode = $("#hdnProductCode_" + rowno).val().split('_')[0];
            unitrate = $("#txtUnitRate_" + rowno).val();

            var ps = jsonPath(PSDetails, "$.[?(@.Product_Code=='" + productCode.split('_')[0] + "')]");
            var rowFlag = rowno;
            if (ps != false) {
                var inputCol = jsonPath(ps, "$.[?(@.Column_Name=='OPENING_BALANCE')]");
                {
                    if (inputCol == false) {
                        if (fncheckNegative($("#txtOPENING_BALANCE_" + rowno).val()) == false) {
                            fnMsgAlert('info', 'Secondary sales', 'Negative values not allowed.');
                            return false;
                        }
                        else {
                            if ($("#txtOPENING_BALANCE_" + rowno).val() != null && $("#txtOPENING_BALANCE_" + rowno).val() != "") {
                                openingBalance = parseFloat($("#txtOPENING_BALANCE_" + rowno).val());
                            }
                            else {
                                openingBalance = 0.0;
                            }
                        }
                    }
                    else {
                        if ($("#txtOPENING_BALANCE_" + rowno).val() != null && $("#txtOPENING_BALANCE_" + rowno).val() != "") {
                            openingBalance = parseFloat($("#txtOPENING_BALANCE_" + rowno).val());
                        }
                        else {
                            openingBalance = 0.0;
                        }
                    }
                }
            }
            else {
                if ($("#txtOPENING_BALANCE_" + rowno).val() != undefined) {
                    if (fncheckNegative($("#txtOPENING_BALANCE_" + rowno).val()) != false) {
                        if ($("#txtOPENING_BALANCE_" + rowno).val() != null && $("#txtOPENING_BALANCE_" + rowno).val() != "") {
                            openingBalance = parseFloat($("#txtOPENING_BALANCE_" + rowno).val());
                        }
                        else {
                            openingBalance = 0.0;
                        }
                    }
                    else {
                        fnMsgAlert('info', 'Secondary sales', 'Negative values not allowed.');
                        return false;
                    }
                }
            }

            if (ps != false) {
                var inputCol = jsonPath(ps, "$.[?(@.Column_Name=='FREE_GOODS')]");
                {
                    if (inputCol == false) {
                        if (fncheckNegative($("#txtFREE_GOODS_" + rowno).val()) == false) {
                            fnMsgAlert('info', 'Secondary sales', 'Negative values not allowed.');
                            return false;
                        }
                        else {
                            if ($("#txtFREE_GOODS_" + rowno).length > 0) {
                                if ($("#txtFREE_GOODS_" + rowno).val() != null && $("#txtFREE_GOODS_" + rowno).val() != "") {
                                    freeGoods = parseFloat($("#txtFREE_GOODS_" + rowno).val());
                                }
                                else {
                                    freeGoods = 0.0;
                                }
                            }
                        }
                    }
                    else {
                        if ($("#txtFREE_GOODS_" + rowno).length > 0) {
                            if ($("#txtFREE_GOODS_" + rowno).val() != null && $("#txtFREE_GOODS_" + rowno).val() != "") {
                                freeGoods = parseFloat($("#txtFREE_GOODS_" + rowno).val());
                            }
                            else {
                                freeGoods = 0.0;
                            }
                        }
                    }
                }
            }
            else {
                if ($("#txtFREE_GOODS_" + rowno).length > 0) {
                    if ($("#txtFREE_GOODS_" + rowno).val() != undefined) {
                        if (fncheckNegative($("#txtFREE_GOODS_" + rowno).val()) != false) {
                            if ($("#txtFREE_GOODS_" + rowno).val() != null && $("#txtFREE_GOODS_" + rowno).val() != "") {
                                freeGoods = parseFloat($("#txtFREE_GOODS_" + rowno).val());
                            }
                            else {
                                freeGoods = 0.0;
                            }
                        }
                        else {
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
                        if ($("#txtPURCHASE_" + rowno).length > 0) {
                            if (fncheckNegative($("#txtPURCHASE_" + rowno).val()) == false) {
                                fnMsgAlert('info', 'Secondary sales', 'Negative values not allowed.');
                                return false;
                            }
                            else {
                                if ($("#txtPURCHASE_" + rowno).val() != null && $("#txtPURCHASE_" + rowno).val() != "") {
                                    purchase = parseFloat($("#txtPURCHASE_" + rowno).val());
                                }
                                else {
                                    purchase = 0.0;
                                }
                            }
                        }
                    }
                    else {
                        if ($("#txtPURCHASE_" + rowno).length > 0) {
                            if ($("#txtPURCHASE_" + rowno).val() != null && $("#txtPURCHASE_" + rowno).val() != "") {
                                purchase = parseFloat($("#txtPURCHASE_" + rowno).val());
                            }
                            else {
                                purchase = 0.0;
                            }
                        }
                    }
                }
            }
            else {
                if ($("#txtPURCHASE_" + rowno).val() != undefined) {
                    if (fncheckNegative($("#txtPURCHASE_" + rowno).val()) != false) {
                        if ($("#txtPURCHASE-" + rowno).val() != null && $("#txtPURCHASE_" + rowno).val() != "") {
                            purchase = parseFloat($("#txtPURCHASE_" + rowno).val());
                        }
                        else {
                            purchase = 0.0;
                        }
                    }
                    else {
                        fnMsgAlert('info', 'Secondary sales', 'Negative values not allowed.');
                        return false;
                    }
                }
            }

            if (ps != false) {
                var inputCol = jsonPath(ps, "$.[?(@.Column_Name=='PURCHASE_RETURN')]");
                {
                    if (inputCol == false) {
                        if ($("#txtPURCHASE_RETURN_" + rowno).length > 0) {
                            if (fncheckNegative($("#txtPURCHASE_RETURN_" + rowno).val()) == false) {
                                fnMsgAlert('info', 'Secondary sales', 'Negative values not allowed.');
                                return false;
                            }
                            else {
                                if ($("#txtPURCHASE_RETURN_" + rowno).val() != null && $("#txtPURCHASE_RETURN_" + rowno).val() != "") {
                                    purchaseReturn = parseFloat($("#txtPURCHASE_RETURN_" + rowno).val());
                                }
                                else {
                                    purchaseReturn = 0.0;
                                }
                            }
                        }
                    }
                    else {
                        if ($("#txtPURCHASE_RETURN_" + rowno).length > 0) {
                            if ($("#txtPURCHASE_RETURN_" + rowno).val() != null && $("#txtPURCHASE_RETURN_" + rowno).val() != "") {
                                purchaseReturn = parseFloat($("#txtPURCHASE_RETURN_" + rowno).val());
                            }
                            else {
                                purchaseReturn = 0.0;
                            }
                        }
                    }
                }
            }
            else {
                if ($("#txtPURCHASE_RETURN_" + rowno).length > 0) {
                    if ($("#txtPURCHASE_RETURN_" + rowno).val() != undefined) {
                        if (fncheckNegative($("#txtPURCHASE_RETURN_" + rowno).val()) != false) {
                            if ($("#txtPURCHASE_RETURN_" + rowno).val() != null && $("#txtPURCHASE_RETURN_" + rowno).val() != "") {
                                purchaseReturn = parseFloat($("#txtPURCHASE_RETURN_" + rowno).val());
                            }
                            else {
                                purchaseReturn = 0.0;
                            }
                        }
                        else {
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
                        if ($("#txtSALES_" + rowno).length > 0) {
                            if (fncheckNegative($("#txtSALES_" + rowno).val()) == false) {
                                fnMsgAlert('info', 'Secondary sales', 'Negative values not allowed.');
                                return false;
                            }
                            else {
                                if ($("#txtSALES_" + rowno).val() != null && $("#txtSALES_" + rowno).val() != "") {
                                    sales = parseFloat($("#txtSALES_" + rowno).val());
                                }
                                else {
                                    sales = 0.0;
                                }
                            }
                        }
                    }
                    else {
                        if ($("#txtSALES_" + rowno).length > 0) {
                            if ($("#txtSALES_" + rowno).val() != null && $("#txtSALES_" + rowno).val() != "") {
                                sales = parseFloat($("#txtSALES_" + rowno).val());
                            }
                            else {
                                sales = 0.0;
                            }
                        }
                    }
                }
            }
            else {
                if ($("#txtSALES_" + rowno).length > 0) {
                    if ($("#txtSALES_" + rowno).val() != undefined) {
                        if (fncheckNegative($("#txtSALES_" + rowno).val()) != false) {
                            if ($("#txtSALES_" + rowno).val() != null && $("#txtSALES_" + rowno).val() != "") {
                                sales = parseFloat($("#txtSALES_" + rowno).val());
                            }
                            else {
                                sales = 0.0;
                            }
                        }
                        else {
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
                        if ($("#txtSALES_RETURN_" + rowno).length > 0) {
                            if (fncheckNegative($("#txtSALES_RETURN_" + rowno).val()) == false) {
                                fnMsgAlert('info', 'Secondary sales', 'Negative values not allowed.');
                                return false;
                            }
                            else {
                                if ($("#txtSALES_RETURN_" + rowno).val() != null && $("#txtSALES_RETURN_" + rowno).val() != "") {
                                    salesReturn = parseFloat($("#txtSALES_RETURN_" + rowno).val());
                                }
                                else {
                                    salesReturn = 0.0;
                                }
                            }
                        }
                    }
                    else {
                        if ($("#txtSALES_RETURN_" + rowno).length > 0) {
                            if ($("#txtSALES_RETURN_" + rowno).val() != null && $("#txtSALES_RETURN_" + rowno).val() != "") {
                                salesReturn = parseFloat($("#txtSALES_RETURN_" + rowno).val());
                            }
                            else {
                                salesReturn = 0.0;
                            }
                        }
                    }
                }
            }
            else {
                if ($("#txtSALES_RETURN_" + rowno).length > 0) {
                    if ($("#txtSALES_RETURN_" + rowno).val() != null && $("#txtSALES_RETURN_" + rowno).val() != "") {
                        salesReturn = parseFloat($("#txtSALES_RETURN_" + rowno).val());
                    }
                    else {
                        salesReturn = 0.0;
                    }
                }
            }

            if ($("#txtTRANSIT_" + rowno).length > 0) {
                if ($("#txtTRANSIT_" + rowno).val() != undefined) {
                    if ($("#txtTRANSIT_" + rowno).val() != null && $("#txtTRANSIT_" + rowno).val() != "") {
                        transit = parseFloat($("#txtTRANSIT_" + rowno).val());
                    }
                    else {
                        transit = 0.0;
                    }
                }
            }

            if ($("#txtDAMAGED_GOODS_" + rowno).length > 0) {
                if ($("#txtDAMAGED_GOODS_" + rowno).val() != undefined) {
                    if ($("#txtDAMAGED_GOODS_" + rowno).val() != null && $("#txtDAMAGED_GOODS_" + rowno).val() != "") {
                        damagedGoods = parseFloat($("#txtDAMAGED_GOODS_" + rowno).val());
                    }
                    else {
                        damagedGoods = 0.0;
                    }
                }
            }

            if ($("#txtEXPIRED_GOODS_" + rowno).length > 0) {
                if ($("#txtEXPIRED_GOODS_" + rowno).val() != undefined) {
                    if ($("#txtEXPIRED_GOODS_" + rowno).val() != null && $("#txtEXPIRED_GOODS_" + rowno).val() != "") {
                        expiredGoods = parseFloat($("#txtEXPIRED_GOODS_" + rowno).val());
                    }
                    else {
                        expiredGoods = 0.0;
                    }
                }
            }

            if (ps != false) {
                var inputCol = jsonPath(ps, "$.[?(@.Column_Name=='CLOSING_BALANCE')]");
                {
                    if (inputCol == false) {
                        if ($("#txtCLOSING_BALANCE_" + rowno).length > 0) {
                            if (fncheckNegative($("#txtCLOSING_BALANCE_" + rowno).val()) == false) {
                                fnMsgAlert('info', 'Secondary sales', 'Negative values not allowed.');
                                return false;
                            }
                            else {
                                if ($("#txtCLOSING_BALANCE_" + rowno).val() != null && $("#txtCLOSING_BALANCE_" + rowno).val() != "") {
                                    closingBalance = parseFloat($("#txtCLOSING_BALANCE_" + rowno).val());
                                }
                                else {
                                    closingBalance = 0.0;
                                }
                            }
                        }
                    }
                    else {
                        if ($("#txtCLOSING_BALANCE_" + rowno).length > 0) {
                            if ($("#txtCLOSING_BALANCE_" + rowno).val() != null && $("#txtCLOSING_BALANCE_" + rowno).val() != "") {
                                closingBalance = parseFloat($("#txtCLOSING_BALANCE_" + rowno).val());
                            }
                            else {
                                closingBalance = 0.0;
                            }
                        }
                    }
                }
            }
            else {
                if ($("#txtCLOSING_BALANCE_" + rowno).length > 0) {
                    if ($("#txtCLOSING_BALANCE_" + rowno).val() != null && $("#txtCLOSING_BALANCE_" + rowno).val() != "") {
                        closingBalance = parseFloat($("#txtCLOSING_BALANCE_" + rowno).val());
                    }
                    else {
                        closingBalance = 0.0;
                    }
                }
            }

            if ($("#txtREMARKS_" + rowno).val() != undefined) {
                ProductRemarks = $("#txtREMARKS_" + rowno).val();
            }
            if (prodDivCode.split('_')[1] == "undefined") {
                divisionCode = null;
            }
            else {
                divisionCode = prodDivCode.split('_')[1];
            }
            if ($("#txtUnitRate_" + rowno).val() != null && $("#txtUnitRate_" + rowno).val() != "") {
                pricePerUnit = parseFloat($("#txtUnitRate_" + rowno).val());
            }
            if ($("#txtOPENING_BALANCE_" + rowno).val() != null && $("#txtOPENING_BALANCE_" + rowno).val() != "") {
                openingBalance = parseFloat($("#txtOPENING_BALANCE_" + rowno).val());
            }
            if ($("#txtFREE_GOODS_" + rowno).val() != null && $("#txtFREE_GOODS_" + rowno).val() != "") {
                freeGoods = parseFloat($("#txtFREE_GOODS_" + rowno).val());
            }
            if ($("#txtPURCHASE_" + rowno).val() != null && $("#txtPURCHASE_" + rowno).val() != "") {
                purchase = parseFloat($("#txtPURCHASE_" + rowno).val());
            }
            if ($("#txtPURCHASE_RETURN_" + rowno).val() != null && $("#txtPURCHASE_RETURN_" + rowno).val() != "") {
                purchaseReturn = parseFloat($("#txtPURCHASE_RETURN_" + rowno).val());
            }
            if ($("#txtSALES_" + rowno).val() != null && $("#txtSALES_" + rowno).val() != "") {
                sales = parseFloat($("#txtSALES_" + rowno).val());
            }
            if ($("#txtSALES_RETURN_" + rowno).val() != null && $("#txtSALES_RETURN_" + rowno).val() != "") {
                salesReturn = parseFloat($("#txtSALES_RETURN_" + rowno).val());
            }
            if ($("#txtTRANSIT_" + rowno).val() != null && $("#txtTRANSIT_" + rowno).val() != "") {
                transit = parseFloat($("#txtTRANSIT_" + rowno).val());
            }
            if ($("#txtCLOSING_BALANCE_" + rowno).val() != null && $("#txtCLOSING_BALANCE_" + rowno).val() != "") {
                closingStock = parseFloat($("#txtCLOSING_BALANCE_" + rowno).val());
            }
            if ($("#txtEXPIRED_GOODS_" + rowno).val() != null && $("#txtEXPIRED_GOODS_" + rowno).val() != "") {
                expiredGoods = parseFloat($("#txtEXPIRED_GOODS_" + rowno).val());
            }
            if ($("#txtDAMAGED_GOODS_" + rowno).val() != null && $("#txtDAMAGED_GOODS_" + rowno).val() != "") {
                damagedGoods = parseFloat($("#txtDAMAGED_GOODS_" + rowno).val());
            }

            var ObjIdCal = {};
            ObjIdCal.id = "txtUnitRate_" + rowno + "";
            fnCalculate(ObjIdCal);
            var objProductRow = {
                Product_Code: productCode,
                Unit_Price_Rate: unitrate,
                Opening_Balance: openingBalance,
                Closing_Balance: closingStock,
                Division_Code: divisionCode,
                Purchase: purchase,
                Purchase_Return: purchaseReturn,
                Sales: sales,
                Sales_Return: salesReturn,
                Damaged_Goods: damagedGoods,
                Expired_Goods: expiredGoods,
                Free_Goods: freeGoods,
                Transit: transit,
                Remarks: ProductRemarks,
                Row_Exists_Flag: rowFlag
            };
            SSProdArray.push(objProductRow);
            for (var j = 0; j < SS_DynamicColumns_g.length; j++) {
                var label = SS_DynamicColumns_g[j].Input_Label;
                label = label.replace(/ /g, '_');
                var InputValue = "";
                var InputId = "";
                if ($('#txt' + label + '_' + rowno).val() != "" && $('#txt' + label + '_' + rowno).val() != null && $('#txt' + label + '_' + rowno).val() != undefined) {
                    InputValue = $('#txt' + label + '_' + rowno).val();
                    InputId = SS_DynamicColumns_g[j].Input_DynamicId;

                    var objDynaDet = {
                        Input_Value: InputValue,
                        Input_DynamicId: InputId,
                        Product_Code: productCode,
                        Row_Dynamic_Exists_Flag: rowno
                    };
                    SSDynaProdArrary.push(objDynaDet);
                }
            }
        }
    }
    var ssCode = "";
    if ($('#hdnSSCode').val() != "" && $('#hdnSSCode').val() != undefined && $('#hdnSSCode').val() != null) {
        ssCode = $('#hdnSSCode').val();
    }
    ObjMainSSComplete = {
        Month: month,
        Year: year,
        User_Code: selectedUserCode,
        SS_Code: ssCode,
        Region_Code: regionCode,
        Base_Code: baseCode,
        Base_Type: baseTypeCode,
        SS_Statement_Date: statementDate,
        SS_Status: ssStatus,
        LstProdDet: SSProdArray,
        LstDynaDet: SSDynaProdArrary
    };
    fnProceedToCheckPSProductsandSave(val);
}
function fnProceedToCheckPSProductsandSave(saveval) {
    debugger;
    var ssEntryProductCheck = "";
    var productarray = new Array();

    var saveValue = saveval;
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/SecondarySales/GetPrivilegeValue',
        data: "userCode=" + selectedUserCode + "&privilegeName=" + "SS_ENTRY_PRODUCT_CHECK",
        //async: false,
        success: function (result) {
            debugger;
            if (result != null || result != undefined) {
                ssEntryProductCheck = result;
            }
            var monthVal = $('#drpMonth').val();
            var yearVal = $('#drpYear').val();
            var secstrng = [];
            secstrng = SSProdArray;
            var appliedProductArray = new Array();
            for (var i = 0; i < secstrng.length; i++) {
                appliedProductArray.push(secstrng[i].Product_Code);
            }
            var pr = new Array()
            for (var i = 0; i < PSDetails.length; i++) {
                pr.push(PSDetails[i].Product_Code);
            }
            pr = pr.unique();
            var prodArray = [];
            for (var i = 0; i < pr.length; i++) {
                if (appliedProductArray.indexOf(pr[i]) == -1) {
                    var productCode = pr[i];
                    var productName = $.grep(productAutofill_g.lstProdDet, function (ele, index) {
                        return ele.Product_Code == pr[i];
                    });
                    var DivisionCode = null;
                    if (productName.length > 0) {
                        productName[0].Division_Code;
                    }
                    if (productName != "") {
                        productName = productName[0].Product_Name;
                    }
                    var prodrpice = $.grep(productPrice_g.lstPricegrpSS, function (ele, index) {
                        return ele.Product_Code == pr[i];
                    });
                    if (prodrpice != false && prodrpice.length > 0) {
                        if (productPrice_g.lstgrpType[0].Price_Type == "PTS") {
                            prodrpice = prodrpice[0].PTS;
                        }
                        else if (productPrice_g.lstgrpType[0].Price_Type == "INVOICE_AMOUNT") {
                            prodrpice = prodrpice[0].INVOICE_AMOUNT;
                        }
                        else if (productPrice_g.lstgrpType[0].Price_Type == "PTR_WOTAX") {
                            prodrpice = prodrpice[0].PTR_WOTAX;
                        }
                        else if (productPrice_g.lstgrpType[0].Price_Type == "MRP") {
                            prodrpice = prodrpice[0].MRP;
                        }
                        else if (productPrice_g.lstgrpType[0].Price_Type == "NRV") {
                            prodrpice = prodrpice[0].NRV;
                        }
                    }
                    var opeingBal = $.grep(productAutofill_g.lstOpnBal, function (ele, index) {
                        return ele.Product_Code == pr[i];
                    });
                    if (opeingBal.length > 0) {
                        opeingBal.sort(function (a, b) { return a - b });
                        opeingBal = opeingBal[0].Closing_Stock;
                    } else {
                        opeingBal = 0;
                    }
                    var newProdCode = productCode + '_' + DivisionCode;
                    var objDetails = {
                        Product_Code: newProdCode,
                        Product_Price: prodrpice,
                        Opening_Balance: opeingBal,
                        Product_Name: productName
                    };
                    prodArray.push(objDetails);
                }
            }
            var BindContent = "";
            if (prodArray.length > 0) {
                BindContent = fnBindProductsNotEntered(prodArray, "PS");
            }
            var alerthtml = ""
            if (BindContent != "") {
                $.unblockUI();
                $('#primarySalesbody').html(BindContent);
                $('#EnterPrimarySalesProds').modal('show');
                return false;
            }
            if (ssEntryProductCheck != "" && ssEntryProductCheck != null && ssEntryProductCheck != undefined) {
                if (ssEntryProductCheck == "YES") {
                    //var ProductAutoFillArray = new Array();
                    //ProductAutoFillArray = productAutofill_g.lstProdDet;
                    //var ProductPriceFillArray = new Array();
                    //ProductPriceFillArray = productPrice_g.lstPricegrpSS;
                    //var ProductOpenningBalanceFillArray = new Array();
                    //ProductOpenningBalanceFillArray = productAutofill_g.lstOpnBal;
                    //$.ajax({
                    //    type: 'POST',
                    //    url: '../HiDoctor_Activity/SecondarySales/GetClosingBalanceGreaterThanZero',
                    //    data: JSON.stringify({ "ProdDetailslst": productjsonStringPop, "Productprieclst": ProductPriceFillArray, "ProdOpenBallst": ProductOpenningBalanceFillArray, "year": yearVal, "month": monthVal, "PriceTypelst": productPrice_g.lstgrpType, "StockiestCode": $('#hdnStockiestCode').val(), "regionCode": regionCode }),
                    //    contentType: 'application/json; charset=utf-8',
                    //    //async: false,
                    //    success: function (response) {
                    var ClosingArrayProd = fnFilterProductHavingClosingBalGreaterthanZero();
                    if (ClosingArrayProd.length > 0) {
                        var openig = [];
                        var preSSMonth = monthVal;
                        var preSSYear = yearVal;
                        var previousmonth = "";
                        previousmonth = monthVal - 1;
                        var previousYear = "";
                        if (preSSMonth == "1") {
                            previousmonth = "12";
                            previousYear = preSSYear - 1;
                        }
                        var prodMainSSCheck = [];
                        for (var i = 0; i < ClosingArrayProd.length; i++) {
                            if (appliedProductArray.indexOf(ClosingArrayProd[i]) == -1) {
                                var productCode = ClosingArrayProd[i];
                                var productName = $.grep(productAutofill_g.lstProdDet, function (ele, index) {
                                    return ele.Product_Code == ClosingArrayProd[i];
                                });
                                var DivisionCode = productName[0].Division_Code;
                                if (productName != "") {
                                    productName = productName[0].Product_Name;
                                }
                                var prodrpice = $.grep(productPrice_g.lstPricegrpSS, function (ele, index) {
                                    return ele.Product_Code == ClosingArrayProd[i];
                                });
                                if (prodrpice != false && prodrpice.length > 0) {
                                    if (productPrice_g.lstgrpType[0].Price_Type == "PTS") {
                                        prodrpice = prodrpice[0].PTS;
                                    }
                                    else if (productPrice_g.lstgrpType[0].Price_Type == "INVOICE_AMOUNT") {
                                        prodrpice = prodrpice[0].INVOICE_AMOUNT;
                                    }
                                    else if (productPrice_g.lstgrpType[0].Price_Type == "PTR_WOTAX") {
                                        prodrpice = prodrpice[0].PTR_WOTAX;
                                    }
                                    else if (productPrice_g.lstgrpType[0].Price_Type == "MRP") {
                                        prodrpice = prodrpice[0].MRP;
                                    }
                                    else if (productPrice_g.lstgrpType[0].Price_Type == "NRV") {
                                        prodrpice = prodrpice[0].NRV;
                                    }
                                }
                                var opeingBal = $.grep(productAutofill_g.lstOpnBal, function (ele, index) {
                                    return ele.Product_Code == ClosingArrayProd[i] && ele.Closing_Stock > 0
                                });
                                if (opeingBal.length > 0) {
                                    opeingBal.sort(function (a, b) { return a - b });
                                    opeingBal = opeingBal[0].Closing_Stock;
                                } else {
                                    opeingBal = 0;
                                }
                                var newProdCode = productCode + '_' + DivisionCode;
                                var monthName = fnGetMonthName(previousmonth);
                                var objDetails = {
                                    Product_Code: newProdCode,
                                    Product_Price: prodrpice,
                                    Opening_Balance: opeingBal,
                                    Product_Name: productName,
                                    Month: monthName,
                                    Year: previousYear
                                };
                                prodMainSSCheck.push(objDetails);
                            }
                        }
                        var BindContent = "";
                        if (prodMainSSCheck.length > 0) {
                            BindContent = fnBindProductsNotEntered(prodMainSSCheck, "SSPM");
                        }
                        if (BindContent != "") {
                            $.unblockUI();
                            $('#secondarySalesbody').html(BindContent);
                            $('#EnterSecondarySalesProds').modal('show');
                            return false;
                        }
                        else {
                            var content = 'The data now saved will go into Applied/Approved Mode and cannot be edited later for any changes.If you wish to edit it for any changes after saving,please click the Draft button and save in Draft Mode.Else if you wish to submit to Applied/Approved Mode directly, continue to click OK.';
                            $('#saveconfrmbody').html(content);
                            var buttnprcd = '<button type="button" class="btn btn-default" data-dismiss="modal" onclick="fnFinalSaveofSecondarySales();">Yes</button>';
                            $('#saveconfrmbtn').html(buttnprcd);
                            $.unblockUI();
                            $('#FinalSaveModal').modal('show');
                        }
                    }
                    else {
                        var content = 'The data now saved will go into Applied/Approved Mode and cannot be edited later for any changes.If you wish to edit it for any changes after saving,please click the Draft button and save in Draft Mode.Else if you wish to submit to Applied/Approved Mode directly, continue to click OK.';
                        $('#saveconfrmbody').html(content);
                        var buttnprcd = '<button type="button" class="btn btn-default" data-dismiss="modal" onclick="fnFinalSaveofSecondarySales();">Yes</button>';
                        $('#saveconfrmbtn').html(buttnprcd);
                        $.unblockUI();
                        $('#FinalSaveModal').modal('show');
                    }
                }
            }
            else if (saveValue == 1) {
                var content = 'The data now saved will go into Applied/Approved Mode and cannot be edited later for any changes.If you wish to edit it for any changes after saving,please click the Draft button and save in Draft Mode.Else if you wish to submit to Applied/Approved Mode directly, continue to click OK.';
                $('#saveconfrmbody').html(content);
                var buttnprcd = '<button type="button" class="btn btn-default" data-dismiss="modal" onclick="fnFinalSaveofSecondarySales();">Yes</button>';
                $('#saveconfrmbtn').html(buttnprcd);
                $.unblockUI();
                $('#FinalSaveModal').modal('show');
            }
        }
    });
}
function fnFinalSaveofSecondarySales() {
    debugger;
    $.blockUI();
    var monthyear = $('#txtMonth').val();
    var monthVal = fnGetMonth(monthyear.split('-')[0]);
    var yearVal = monthyear.split('-')[1];
    $.ajax({
        type: "POST",
        url: "../HiDoctor_Activity/SecondarySales/InsertSecondarySalesSubmit",
        data: JSON.stringify({ "ObjSSDetails": ObjMainSSComplete }),
        contentType: 'application/json; charset=utf-8',
        success: function (resp) {
            if (resp != "" && resp != null) {
                $('#hdnStatus').val('');
                $('#hdnSSCode').val('');
                var monthName = fnGetMonthName(monthVal);
                fnGetSSDetailsHistory(monthVal, yearVal);
                fnResetStockistGridAfterSave();
                $.unblockUI();
                fnMsgAlert('success', 'Secondary Sales', 'Secondary Sales for ' + monthName + '-' + yearVal + ' is Submitted Successfully.');
                return false;
            } else {
                $('#hdnStatus').val('');
                $('#hdnSSCode').val('');
                var monthName = fnGetMonthName(monthVal);
                $.unblockUI();
                fnMsgAlert('error', 'Secondary Sales', 'Secondary Sales for ' + monthName + '-' + yearVal + ' is failed to Submit.');
                return false;
            }

        },
    });
    draftval = '1';
}
function fncheckNegative(string) {
    if (/-/.test(string) == true) {
        return false;
    }
    else {
        return true;
    }
}
Array.prototype.unique = function () {
    var unique = [];
    for (var i = 0; i < this.length; i++) {
        if (unique.indexOf(this[i]) == -1) {
            unique.push(this[i]);
        }
    }
    return unique;
};
function fnBindProductsNotEntered(resp, type) {
    debugger;
    var content = '';
    if (resp.length > 0) {
        if (type.toUpperCase() == "PS") {
            content += "<div class='legendpopup'>";
            content += "<p>You have missed to enter some product(s) which are entered in primary sales. Kindly enter secondary sales for the all products which are entered in primary sales. \nThe below mentioned products are missing in secondary sales.</p>";
            content += "</div>";
            content += "<div style='height:220px;overflow-y:scroll;overflow-x: hidden'>";
            content += "<table class='table table-striped' style='width: 99%;margin-left:7px'>";
            content += "<thead>";
            content += "<tr>";
            content += "<td style='padding:5px'>Select<input type='checkbox' name='chkSelectAllPS' onclick='fnSelectAllPS();' style='margin:5px;'/></td>";
            content += "<td style='padding:5px'>Product Name</td>";
            content += "<td style='padding:5px'>Unit Price(Rs.)</td>";
            content += "<td style='padding:5px'>Last Closing Stock Qty.(Nos)</td>";
            content += "</tr></thead><tbody>";
            for (var i = 0; i < resp.length; i++) {
                content += "<tr>";
                content += "<td><input type='checkbox' name='chkSelectPS' id='chkSelect_" + i + 1 + "' value='" + resp[i].Product_Code + "'/></td>";
                content += "<td>" + resp[i].Product_Name + "</td>";
                content += "<td>" + resp[i].Product_Price + "</td>";
                content += "<td>" + resp[i].Opening_Balance + "</td>";
                content += "</tr>";

            }
            content += "</tbody></table></div>";
        } else if (type.toUpperCase() == "SSPM") {
            var month = resp[0].Month;
            var year = resp[0].Year;
            content += "<div class='legendpopup'>";
            content += "<p>You have missed to enter some product(s) which are having Closing Balance(s). Kindly enter secondary sales for the all products which are are having Closing Balance(s). \nThe below mentioned products are missing in secondary sales.</p>";
            content += "</div>";
            content += "<div style='height:220px;overflow-y:scroll;overflow-x: hidden'>";
            content += "<table class='table table-striped' style='width: 99%;margin-left:7px'>";
            content += "<thead>";
            content += "<tr>";
            content += "<td style='padding:5px'>Select<input type='checkbox' name='chkSelectAllSS' onclick='fnSelectAllSS();' style='margin:5px;'/></td>";
            content += "<td style='padding:5px'>Product Name</td>";
            content += "<td style='padding:5px'>Unit Price(Rs.)</td>";
            content += "<td style='padding:5px'>Last Closing Stock Qty.(Nos)</td>";
            content += "</tr></thead><tbody>";
            for (var i = 0; i < resp.length; i++) {
                content += "<tr>";
                content += "<td><input type='checkbox' name='chkSelectSS' id='chkSelect_" + i + 1 + "' value='" + resp[i].Product_Code + "'/></td>";
                content += "<td>" + resp[i].Product_Name + "</td>";
                content += "<td>" + resp[i].Product_Price + "</td>";
                content += "<td>" + resp[i].Opening_Balance + "</td>";
                content += "</tr>";

            }
            content += "</tbody></table></div>";
        }
    }
    return content;
}
function fnGetSelectedProductPrimarySales() {
    debugger;
    var productArray = [];
    $("input:checkbox[name=chkSelectPS]").each(function () {
        if (this.checked) {
            var productCode = $(this).val();
            var productName = $.grep(productAutofill_g.lstProdDet, function (ele, index) {
                return ele.Product_Code == productCode.split('_')[0];
            });
            var DivisionCode = productCode.split('_')[1];
            if (productName != "") {
                productName = productName[0].Product_Name;
            }
            var prodrpice = $.grep(productPrice_g.lstPricegrpSS, function (ele, index) {
                return ele.Product_Code == productCode.split('_')[0];
            });
            if (prodrpice != false && prodrpice.length > 0) {
                if (productPrice_g.lstgrpType[0].Price_Type == "PTS") {
                    prodrpice = prodrpice[0].PTS;
                }
                else if (productPrice_g.lstgrpType[0].Price_Type == "INVOICE_AMOUNT") {
                    prodrpice = prodrpice[0].INVOICE_AMOUNT;
                }
                else if (productPrice_g.lstgrpType[0].Price_Type == "PTR_WOTAX") {
                    prodrpice = prodrpice[0].PTR_WOTAX;
                }
                else if (productPrice_g.lstgrpType[0].Price_Type == "MRP") {
                    prodrpice = prodrpice[0].MRP;
                }
                else if (productPrice_g.lstgrpType[0].Price_Type == "NRV") {
                    prodrpice = prodrpice[0].NRV;
                }
            }
            var opeingBal = $.grep(productAutofill_g.lstOpnBal, function (ele, index) {
                return ele.Product_Code == productCode.split('_')[0];
            });
            if (opeingBal.length > 0) {
                opeingBal.sort(function (a, b) { return a - b });
                opeingBal = opeingBal[0].Closing_Stock;
            } else {
                opeingBal = 0;
            }
            var objDetails = {
                Product_Code: productCode,
                Product_Price: prodrpice,
                Opening_Balance: opeingBal,
                Product_Name: productName
            };
            productArray.push(objDetails);
        }
    });
    if (productArray.length > 0) {
        fnBindPSDetailsSelected(productArray);
    }
}
function fnGetSelectedProductSecondarySales() {
    debugger;
    var productArray = [];
    $("input:checkbox[name=chkSelectSS]").each(function () {
        debugger;
        if (this.checked) {
            var productCode = $(this).val();
            var productName = $.grep(productAutofill_g.lstProdDet, function (ele, index) {
                return ele.Product_Code == productCode.split('_')[0];
            });
            var DivisionCode = productCode.split('_')[1];
            if (productName != "") {
                productName = productName[0].Product_Name;
            }
            var prodrpice = $.grep(productPrice_g.lstPricegrpSS, function (ele, index) {
                return ele.Product_Code == productCode.split('_')[0];
            });
            if (prodrpice != false && prodrpice.length > 0) {
                if (productPrice_g.lstgrpType[0].Price_Type == "PTS") {
                    prodrpice = prodrpice[0].PTS;
                }
                else if (productPrice_g.lstgrpType[0].Price_Type == "INVOICE_AMOUNT") {
                    prodrpice = prodrpice[0].INVOICE_AMOUNT;
                }
                else if (productPrice_g.lstgrpType[0].Price_Type == "PTR_WOTAX") {
                    prodrpice = prodrpice[0].PTR_WOTAX;
                }
                else if (productPrice_g.lstgrpType[0].Price_Type == "MRP") {
                    prodrpice = prodrpice[0].MRP;
                }
                else if (productPrice_g.lstgrpType[0].Price_Type == "NRV") {
                    prodrpice = prodrpice[0].NRV;
                }
            }
            var opeingBal = $.grep(productAutofill_g.lstOpnBal, function (ele, index) {
                return ele.Product_Code == productCode.split('_')[0];
            });
            if (opeingBal.length > 0) {
                opeingBal.sort(function (a, b) { return a - b });
                opeingBal = opeingBal[0].Closing_Stock;
            } else {
                opeingBal = 0;
            }
            var objDetails = {
                Product_Code: productCode,
                Product_Price: prodrpice,
                Opening_Balance: opeingBal,
                Product_Name: productName
            };
            productArray.push(objDetails);
        }
    });
    if (productArray.length > 0) {
        fnBindPSDetailsSelected(productArray);
    }
}
function fnSelectAllPS(val) {
    debugger;
    if ($("input:checkbox[name=chkSelectAllPS]").attr("checked") == "checked") {
        $("input:checkbox[name=chkSelectPS]").each(function () {
            this.checked = true;
        });
    }
    else {
        $("input:checkbox[name=chkSelectPS]").each(function () {
            this.checked = false;
        });
    }
}
function fnSelectAllSS(val) {
    if ($("input:checkbox[name=chkSelectAllSS]").attr("checked") == "checked") {
        $("input:checkbox[name=chkSelectSS]").each(function () {
            this.checked = true;
        });
    }
    else {
        $("input:checkbox[name=chkSelectSS]").each(function () {
            this.checked = false;
        });
    }
}
function fnBindPSDetailsSelected(resp) {
    debugger;
    if (resp.length > 0) {
        var total = $("#tblSecondarySales tr.RowDataVisi").length;
        var rowId = '';
        for (var k = 0; k < total; k++) {
            if ($("#txtProductName_" + k).val() != "" && $("#txtProductName_" + k).val() != null && $("#txtProductName_" + k) != undefined) {
                rowId = k;
            }
        }
        for (var i = 0; i < resp.length; i++) {
            rowId++;
            $("#txtProductName_" + rowId + "").val(resp[i].Product_Name);
            $("#hdnProductCode_" + rowId + "").val(resp[i].Product_Code);
            $("#txtUnitRate_" + rowId + "").val(resp[i].Product_Price);
            if (priceEdit == "NO") {
                $("#txtUnitRate_" + rowId + "").attr("readOnly", "readOnly");
            }
            if (resp[i].Opening_Balance == 0) {
                $("#txtOPENING_BALANCE_" + rowId + "").val(0.00);
                $("#txtOPENING_BALANCE_" + rowId + "").removeAttr('readOnly');
                var ObjIdCal = {};
                ObjIdCal.id = "txtUnitRate_" + rowId + "";
                fnCalculate(ObjIdCal);
            } else {
                if (openingBalEdit.toUpperCase() == "YES") {
                    $("#txtOPENING_BALANCE_" + rowId + "").val(resp[i].Opening_Balance);
                    $("#txtOPENING_BALANCE_" + rowId + "").removeAttr('readOnly');
                    var ObjIdCal = {};
                    ObjIdCal.id = "txtUnitRate_" + rowId + "";
                    fnCalculate(ObjIdCal);
                } else {
                    $("#txtOPENING_BALANCE_" + rowId + "").val(resp[i].Opening_Balance);

                    var ObjIdCal = {};
                    ObjIdCal.id = "txtUnitRate_" + rowId + "";
                    fnCalculate(ObjIdCal);
                }
            }
            //PS prefill functionality
            if (PSPrefillDetails != undefined && PSPrefillDetails.length != 0) {
                if (PSDetails.length != 0) {
                    //for (var p = 0; p < PSDetails.length; p++) {
                    var psjson = jsonPath(PSDetails, "$.[?(@.Product_Code=='" + resp[i].Product_Code.split("_")[0] + "')]");

                    if (psjson != false && psjson.length != 0) {
                        for (var k = 0; k < inputColumnArr.length; k++) {
                            var inputcol = jsonPath(psjson, "$.[?(@.Column_Name=='" + inputColumnArr[k] + "')]");

                            if (inputcol != false && inputcol.length > 0) {
                                var txtbox = "txt" + inputcol[0].Column_Name + "_" + rowId;
                                var EditJs = jsonPath(PSPrefillDetails, "$.[?(@.Column_Name=='" + inputColumnArr[k] + "')]");

                                $("#" + txtbox).val(inputcol[0].Qty);
                                var ObjIdCal = {};
                                ObjIdCal.id = "txtUnitRate_" + rowId + "";
                                fnCalculate(ObjIdCal);

                                if (EditJs != false && EditJs.length > 0) {
                                    if (EditJs[0].Is_Editable == '0') {
                                        $("#" + txtbox).attr('readonly', 'true');
                                    }
                                }
                            }
                        }
                    }
                    //}
                }
            }
            fnCreateNewRowInProduct("");
        }
    }
    $('#EnterPrimarySalesProds').modal('hide');
    $('#EnterSecondarySalesProds').modal('hide');
}
function fnResetStockistGridAfterSave() {
    $('#hdnStatus').val('');
    $('#txtMonth').attr('disabled', false);
    $('#txtStatmentDate').attr('disabled', false);
    $('#txtStockiestName').attr('disabled', false);
    $('#txtStatmentDate').val('');
    $('#SecondarySalesDetails').hide();
    $('#SecondarySalesDetails').empty();
    $('#productopoupLink').hide();
    $("#divInput").hide();
    $("#txtStockiestName").removeAttr('readonly');
    $('#btnGoForProd').attr('disabled', false);
    $("#txtStockiestName").val('');
    $("#dvMainHeader").show();
    $('#unapprovedRemarks').html('');
    $('#stckstrefkey').html('');
    $('#effctfrm').html('');
    $('#effctto').html('');
    $('#stockistdetblr').hide();
    $('#dvStockGrid').hide();
    $('#btnGoForProd').attr('disabled', false);
    $('#btnGo').attr('disabled', false);
    $("#divReport").hide();
    stockistList_g = "";
    PreviousSSDetails = "";
    productPrice_g = "";
    productAutofill_g = "";
    productjsonString = "";
    productjsonStringPop = "";
    SS_DynamicColumns_g = "";
    checkIsPSPrefill = "";
    PSDetails = "";
    PSPrefillDetails = "";
    rowNumber = "",
    tableCount = "";
    stockistEntries_g = "";

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
    if ($('#txtMonth').val() == "" || $('#txtMonth').val() == null || $('#txtMonth').val() == undefined) {
        fnMsgAlert('info', 'Secondary Sales', 'Please Select Month & Year.');
        return false;
    } 
    var ss_Code = id.split('_')[3];
    var month = id.split('_')[1];
    var year = id.split('_')[2];
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
}
function fnEdit(id) {
    debugger;
    $.blockUI();
    validateCustomerCode = "";
    var ssEntryMode = 'STOCKIEST';
    $('#txtMonth').attr('disabled', false);
    $('#txtStockiestName').attr('disabled', true);
    var userCodeDetails = id;
    var ssDate = id.split('_')[4];
    if (ssDate != "" && ssDate != undefined && ssDate != null) {
        ssDate = ssDate.split('/')[2] + '-' + ssDate.split('/')[1] + '-' + ssDate.split('/')[0];
    }
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/SecondarySales/GetSecondarySalesEditDetails',
        data: 'regionCode=' + id.split('_')[0] + '&ssCode=' + id.split('_')[3] + '&month=' + id.split('_')[1] + '&year=' + id.split('_')[2] + '&ssStatementDate=' + ssDate,
        success: function (response) {
            var stockCode = response.lstHeader[0].Base_Code;
            $('#hdnStockiestCode').val(stockCode);
            fnProductWisePriceForEdit(response);

        },
        error: function (e) {
            $.unblockUI();
        }
    });
}
function fnBindEditDetails(resp) {
    debugger;
    var rCntSSales = $("#tblSecondarySales tr").length;
    var tableContent = "";
    var unitPricePerproduct = 0;
    var salesAmount = 0;
    var monthName = '';
    var month = '';
    var year = '';
    SS_DynamicColumns_g = resp.lstDynaCol;
    if (resp.lstHeader.length > 0) {
        $('#divInputHeader').show();
        monthName = fnGetMonthName(resp.lstHeader[0].Month);
        year = resp.lstHeader[0].Year;
        month = resp.lstHeader[0].Month;
        year = resp.lstHeader[0].Year;
        var monthyear = monthName + '-' + year;
        $('#txtMonth').val(monthyear);
        $('#txtMonth').attr('disabled', 'disabled');
        $('#btnGo').attr('disabled', 'disabled');
        $('#divInputform').show();
        var stockist_name = '';
        var today = new Date();
        var dd = today.getDay();
        var mm = today.getMonth() + 1;
        var yy = today.getFullYear();
        var currDate = yy + '/' + mm + '/' + dd;
        var CDate = new Date(currDate);
        var effect_to = resp.lstHeader[0].Effective_To;
        effect_to = effect_to.split('/')[2] + '/' + effect_to.split('/')[1] + '/' + effect_to.split('/')[0];
        var EDate = new Date(effect_to);
        if (resp.lstHeader[0].Ref_Key1 == "0") {
            if (EDate >= CDate) {
                stockist_name = resp.lstHeader[0].Base_Name + "-(No Ref Key)-" + "(" + resp.lstHeader[0].Effective_From + "-Active...)";
            } else {
                stockist_name = resp.lstHeader[0].Base_Name + "-(No Ref Key)-" + "(" + resp.lstHeader[0].Effective_From + "-" + resp.lstHeader[0].Effective_To + ")";
            }
        } else {
            if (EDate >= CDate) {
                stockist_name = resp.lstHeader[0].Base_Name + "-(" + resp.lstHeader[0].Ref_Key1 + ")-" + "(" + resp.lstHeader[0].Effective_From + "-Active...)";
            }
            else {
                stockist_name = resp.lstHeader[0].Base_Name + "-(" + resp.lstHeader[0].Ref_Key1 + ")-" + "(" + resp.lstHeader[0].Effective_From + "-" + resp.lstHeader[0].Effective_To + ")";
            }
        }
        $('#txtStockiestName').val(stockist_name);
        $('#hdnStockiestCode').val(resp.lstHeader[0].Base_Code);
        $('#hdnStatus').val('EDIT');
        $('#hdnSSCode').val(resp.lstHeader[0].SS_Code);
        $('#dvStockGrid').show();
        var ssStatementDate = resp.lstHeader[0].SS_Statement_Date;
        $('#txtStatmentDate').val(ssStatementDate);
        if (resp.lstHeader[0].Ref_Key1 == 0) {
            $('#stckstrefkey').html('No Ref Key');
        } else {
            $('#stckstrefkey').html(resp.lstHeader[0].Ref_Key1);
        }
        $('#effctfrm').html(resp.lstHeader[0].Effective_From);
        $('#effctto').html(resp.lstHeader[0].Effective_To);
        $('#stockistdetblr').show();
        $('#btnGoForProd').attr('disabled', 'disabled');
    }
    var tableCount = "";
    if (resp.lstDetails.length > 0) {
        tableCount = "1";
        tableContent += "<table cellspacing='0' cellpadding='0' id='tblSecondarySales' class='table table-hover'>";
        tableContent += "<thead style='text-align:center;'>";
        tableContent += "<tr><th>PRODUCT NAME</th>";
        tableContent += "<th>UNIT RATE</th>";
        for (var i = 0; i < inputColumnArr.length; i++) {
            if (inputColumnArr[i].toUpperCase() == "CLOSING_BALANCE") {

                tableContent += "<th class='numericth'>" + inputColumnArr[i].replace('_', ' ') + "</th>";
                tableContent += "<th class='numericth'>" + inputColumnArr[i].replace('_', ' ') + " AMOUNT</th>";
            }
            else if (inputColumnArr[i].toUpperCase() == "SALES") {

                tableContent += "<th class='numericth'>" + inputColumnArr[i].replace('_', ' ') + "</th>";
                tableContent += "<th class='numericth'>" + inputColumnArr[i].replace('_', ' ') + " AMOUNT</th>";
            }
            else if (inputColumnArr[i].toUpperCase() == "REMARKS") {
                tableContent += "<th>" + inputColumnArr[i].replace('_', ' ') + "</th>";
            }
            else {
                tableContent += "<th class='numericth'>" + inputColumnArr[i].replace('_', ' ') + "</th>";
            }
        }
        tableContent += "<th class='numericth'>Action</th>";
        tableContent += "</tr>";
        tableContent += "</thead>";
        tableContent += "<tbody>";
        var sno = 0;
        for (var i = 0; i < resp.lstDetails.length; i++) {
            sno++;
            var productCode = resp.lstDetails[i].Product_Code;
            tableContent += "<tr id='rowData_" + sno + "' class='RowDataVisi'>";
            tableContent += "<td><input type='text' id='txtProductName_" + sno + "'  onblur='fnOnBlurForProductsGrid(this);' class='autoProducts form-control'  onclick= '$(this).select();' style='width:200px' autocomplete='off' value='" + resp.lstDetails[i].Product_Name + "'/><input type='hidden' id='hdnProductCode_" + sno + "'  value='" + resp.lstDetails[i].Product_Code + '_' + resp.lstDetails[i].Division_Code + "'/><input type='hidden' id='hdnStatusforEachItem_" + sno + "' value='1'/></td>";
            var priceval = resp.lstDetails[i].Unit_Price_Rate;
            if (priceEdit.toUpperCase() == "NO") {
                tableContent += "<td><input type='text' id='txtUnitRate_" + sno + "' class='checknumeric numbersOnly form-control' onclick= '$(this).select();' style='width:70px;' readonly='readonly' autocomplete='off' value='" + resp.lstDetails[i].Unit_Price_Rate + "' /></td>";
            }
            else {
                tableContent += "<td><input type='text' id='txtUnitRate_" + sno + "'  class='checknumeric  numbersOnly form-control' onclick= '$(this).select();' style='width:70px;' autocomplete='off' value='" + resp.lstDetails[i].Unit_Price_Rate + "' /></td>";
            }
            for (var j = 0; j < inputColumnArr.length; j++) {
                if (inputColumnArr[j].toUpperCase() == "CLOSING_BALANCE") {
                    var closingBalAmount = (parseFloat(priceval) * parseFloat(resp.lstDetails[i].Closing_Balance));
                    closingBalAmount = closingBalAmount.toFixed(2);
                    if (compute.toUpperCase() == "CLOSING_BALANCE") {
                        tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "_" + sno + "' value='" + resp.lstDetails[i].Closing_Balance + "'   style='width:70px;' class='checknumeric numbersOnly form-control' readonly='readonly' onkeypress='return fnValidateNumber(this,event);'  onpaste='return false' autocomplete='off' /></td>";

                        tableContent += "<td><input type='text' id='txtAmount" + inputColumnArr[j] + "_" + sno + "' value='" + closingBalAmount + "'   style='width:70px;' class='form-control numbersOnly' readonly='readonly'  autocomplete='off' /></td>";
                    } else {
                        tableContent += "<td><input type='text' id='txt" + inputColumnArr[j] + "_" + sno + "'  value='" + resp.lstDetails[i].Closing_Balance + "'  style='width:70px;' class='checknumeric numbersOnly  form-control' onclick= '$(this).select();' onkeypress='return fnValidateNumber(this,event);'  onpaste='return false' autocomplete='off'  /></td>";
                        tableContent += "<td><input type='text' id='txtAmount" + inputColumnArr[j] + "_" + sno + "' value='" + closingBalAmount + "'   style='width:70px;' class='form-control numbersOnly' readonly='readonly' autocomplete='off' /></td>";
                    }
                }
                else if (inputColumnArr[j].toUpperCase() == "DAMAGED_GOODS") {
                    tableContent += "<td><input type='number' min='1' max='999999' id='txt" + inputColumnArr[j] + "_" + sno + "'  value='" + resp.lstDetails[i].Damaged_Goods + "'  style='width:70px;' class='checknumeric numbersOnly form-control' onclick= '$(this).select();' onkeypress='return fnValidateNumber(this,event);'  onpaste='return false' autocomplete='off'  /></td>";
                }
                else if (inputColumnArr[j].toUpperCase() == "EXPIRED_GOODS") {
                    tableContent += "<td><input  type='number' min='1' max='999999' id='txt" + inputColumnArr[j] + "_" + sno + "'  value='" + resp.lstDetails[i].Expired_Goods + "'  style='width:70px;' class='checknumeric numbersOnly form-control' onclick= '$(this).select();'  onkeypress='return fnValidateNumber(this,event);'  onpaste='return false' autocomplete='off' /></td>";
                }
                else if (inputColumnArr[j].toUpperCase() == "FREE_GOODS") {
                    tableContent += "<td><input  type='number' min='1' max='999999' id='txt" + inputColumnArr[j] + "_" + sno + "'  value='" + resp.lstDetails[i].Free_Goods + "'  style='width:70px;' class='checknumeric  form-control' onclick= '$(this).select();' onkeypress='return fnValidateNumberForTransitandFreeGoods(this,event);'  onpaste='return false' autocomplete='off'  /></td>";
                }
                else if (inputColumnArr[j].toUpperCase() == "OPENING_BALANCE") {
                    if (openingBalEdit.toUpperCase() == "YES" || stockistEntries_g == 0) {
                        tableContent += "<td><input  type='number' min='1' max='999999' id='txt" + inputColumnArr[j] + "_" + sno + "'  value='" + resp.lstDetails[i].Opening_Balance + "'  style='width:70px;' class='checknumeric numbersOnly form-control' onclick= '$(this).select();' onkeypress='return fnValidateNumber(this,event);'  onpaste='return false' autocomplete='off'  /></td>";
                    } else {
                        tableContent += "<td><input  type='number' min='1' max='999999' id='txt" + inputColumnArr[j] + "_" + sno + "'  value='" + resp.lstDetails[i].Opening_Balance + "'  style='width:70px;' class='checknumeric numbersOnly  form-control' onclick= '$(this).select();' readonly='readonly' autocomplete='off' /></td>";
                    }
                }
                else if (inputColumnArr[j].toUpperCase() == "PURCHASE") {
                    tableContent += "<td><input  type='number' min='1' max='999999' id='txt" + inputColumnArr[j] + "_" + sno + "'  value='" + resp.lstDetails[i].Purchase + "'  style='width:70px;' class='checknumeric  numbersOnly form-control' onclick= '$(this).select();'  onkeypress='return fnValidateNumber(this,event);'  onpaste='return false' autocomplete='off' /></td>";
                }
                else if (inputColumnArr[j].toUpperCase() == "PURCHASE_RETURN") {
                    tableContent += "<td><input  type='number' min='1' max='999999' id='txt" + inputColumnArr[j] + "_" + sno + "'  value='" + resp.lstDetails[i].Purchase_Return + "'  style='width:70px;' class='checknumeric numbersOnly form-control' onclick= '$(this).select();'  onkeypress='return fnValidateNumber(this,event);'  onpaste='return false' autocomplete='off' /></td>";
                }
                else if (inputColumnArr[j].toUpperCase() == "SALES") {
                    var salesAmount = (parseFloat(resp.lstDetails[i].Sales) * parseFloat(priceval));
                    salesAmount = salesAmount.toFixed(2);
                    if (compute.toUpperCase() == "SALES") {
                        tableContent += "<td><input  type='number' min='1' max='999999' id='txt" + inputColumnArr[j] + "_" + sno + "' value='" + resp.lstDetails[i].Sales + "'   style='width:70px;' class='checknumeric  form-control numbersOnly' readonly='readonly' onkeypress='return fnValidateNumber(this,event);'  onpaste='return false' autocomplete='off'  /></td>";
                        tableContent += "<td><input type='text' id='txtAmount" + inputColumnArr[j] + "_" + sno + "' value='" + salesAmount + "'   style='width:70px;' class='form-control numbersOnly' readonly='readonly' autocomplete='off' /></td>";
                    } else {
                        tableContent += "<td><input type='number' min='1' max='999999' id='txt" + inputColumnArr[j] + "_" + sno + "'  value='" + resp.lstDetails[i].Sales + "'  style='width:70px;' class='checknumeric  form-control numbersOnly' onclick= '$(this).select();' onkeypress='return fnValidateNumber(this,event);'  onpaste='return false' autocomplete='off'  /></td>";
                        tableContent += "<td><input type='text' id='txtAmount" + inputColumnArr[j] + "_" + sno + "'  value='" + salesAmount + "'   style='width:70px;' class='form-control numbersOnly' readonly='readonly' autocomplete='off' /></td>";
                    }
                }
                else if (inputColumnArr[j].toUpperCase() == "SALES_RETURN") {
                    tableContent += "<td><input  type='number' min='1' max='999999' id='txt" + inputColumnArr[j] + "_" + sno + "'  value='" + resp.lstDetails[i].Sales_Return + "'  style='width:70px;' class='checknumeric numbersOnly form-control' onclick= '$(this).select();'  onkeypress='return fnValidateNumber(this,event);'  onpaste='return false' autocomplete='off' /></td>";
                }
                else if (inputColumnArr[j].toUpperCase() == "TRANSIT") {
                    tableContent += "<td><input  type='number' min='1' max='999999' id='txt" + inputColumnArr[j] + "_" + sno + "' value='" + resp.lstDetails[i].Transit + "'  style='width:70px;' class='checknumeric  form-control' onclick= '$(this).select();' onkeypress='return fnValidateNumberForTransitandFreeGoods(this,event);'  onpaste='return false' autocomplete='off'  /></td>";
                }
                else if (inputColumnArr[j].toUpperCase() == "REMARKS") {
                    tableContent += "<td><textarea  id='txt" + inputColumnArr[j] + "_" + sno + "'   onclick= '$(this).select();' style='resize:none;width:100%;' class='CheckProductRemark' rows='3'>" + resp.lstDetails[i].Remarks + "</textarea></td>";
                }
            }
            if (SS_DynamicColumns_g.length > 0) {
                tableContent += "<td><i class='fa fa-minus' id='gridminus_" + sno + "' style='font-size: 15px !important;display:none;' onclick='fnHideGridDynamic(" + sno + ");' aria-hidden='true'></i><i class='fa fa-plus' style='font-size: 15px !important;' id='gridplus_" + sno + "' onclick='fnShowGridDynamic(" + sno + ");' aria-hidden='true'></i></td>";
            } else {
                tableContent += "<td></td>";
            }
            tableContent += "</tr>";
            if (SS_DynamicColumns_g.length > 0 && resp.lstDynaDet.length > 0) {
                var BindDynamic = fnGetDynamicColumnsBindHTMLwithResponse(sno, resp.lstDynaDet, productCode);
                tableContent += "<tr id='rowDataDyn_" + sno + "' class='RowDataInVisi' style='display:none;background: rgb(241, 241, 241);' ><td colspan='" + (inputColumnArr.length + 5) + "'>" + BindDynamic + "</td></tr>";
            } else if (resp.lstDynaCol.length > 0) {
                var BindDynamic = fnGetDynamicColumnsBindHTML(sno);
                tableContent += "<tr id='rowDataDyn_" + sno + "' class='RowDataInVisi' style='display:none;background: rgb(241, 241, 241);' ><td colspan='" + (inputColumnArr.length + 5) + "'>" + BindDynamic + "</td></tr>";
            }
        }
        tableContent += "<tr id='tbllastRow'><td style='width:261px;font-weight: bold'>TOTAL</td>";
        tableContent += "<td></td>";
        for (var i = 0; i < inputColumnArr.length; i++) {
            if (inputColumnArr[i].toUpperCase() == "CLOSING_BALANCE") {
                tableContent += "<td></td>";
                tableContent += "<td><input type='text' id='txtClosingAmountSum' readonly='true' class='checknumeric form-control'style='width:70px;border:none;font-weight:bold' /></td>";
            }
            else if (inputColumnArr[i].toUpperCase() == "SALES") {

                tableContent += "<td></td>";
                tableContent += "<td><input type='text' id='txtSalesAmountSum' readonly='true' class='checknumeric form-control'style='width:70px;border:none;font-weight:bold' /></td>";
            }
            else {
                tableContent += "<td></td>";
            }
        }
        tableContent += "</tr>";
        tableContent += "</tbody>";
        tableContent += "</table>";
        $("#dvMainHeader").show();
        $('#SecondarySalesDetails').show();
        $("#divInput").show();
        $('#productopoupLink').show();
        $('#imgAdd').hide();
        $.unblockUI();
        fnGetDateBasedonMonthandYear(month, year);

        $('#SecondarySalesDetails').html(tableContent);
        if ((inputColumnArr.length + 4) >= 12) {
            if ($('#tree').is(":visible")) {
                $('#tblSecondarySales').css('width', '200%');
                $('#SecondarySalesDetails').css("overflow-x", "scroll");
            } else {
                $('#tblSecondarySales').css('width', '150%');
                $('#SecondarySalesDetails').css("overflow-x", "scroll");
            }

        }
        else {
            if ($('#tree').is(":visible")) {
                $('#tblSecondarySales').css('width', '150%');
                $('#SecondarySalesDetails').css("overflow-x", "scroll");
            } else {
                $('#tblSecondarySales').css('width', '150%');
                $('#SecondarySalesDetails').css("overflow-x", "scroll");
            }
        }
        //if ($('#tree').is(":visible")) {
        //    $('#tblSecondarySales').css('width', '150%');
        //    $('#SecondarySalesDetails').css("overflow-x", "scroll");
        //} else {
        //    $('#tblSecondarySales').css('width', '100%');
        //    $('#SecondarySalesDetails').css("overflow-x", "hidden");
        //}
        rowNumber = resp.lstDetails.length + 1;
        fnGetProductsFortheSelecRegandStockistForEdit();



    }
    else {
        fnMsgAlert('info', 'info', 'This region (' + regionName + ') does not have product price list.Please contact your administrator to configure the price list.');
        $('#SecondarySalesDetails').hide();
        $('#productopoupLink').hide();
        fnSecondarySalesResetStockistGrid();
        $('#imgAdd').hide();
        $.unblockUI();
        $("#dvMainHeader").hide();
        $('#SecondarySalesDetails').hide();
        $("#divInput").hide();
        $('#productopoupLink').hide();
        return false;
        $.unblockUI();
    }
    fncalTotal();
}
function fnGetDynamicColumnsBindHTMLwithResponse(rowVal, resp, prodCode) {
    debugger;
    var content = '';
    if (SS_DynamicColumns_g.length > 0) {
        content += '<div class="col-lg-12  form-group">';
        for (var i = 0; i < SS_DynamicColumns_g.length; i++) {
            var disjson = $.grep(resp, function (ele, index) {
                return ele.Product_Code == prodCode && ele.Input_DynamicId == SS_DynamicColumns_g[i].Input_DynamicId;
            });
            //for (var a = 0; a < disjson.length; a++) {
            if (SS_DynamicColumns_g[i].Input_DataType.toUpperCase() == "TEXT") {
                if (disjson.length == 0) {
                    content += '<div id="rowdyn_' + rowVal + '_' + i + '" class="row">';
                    content += '<div class="col-lg-12 form-group remove-left-padding">';
                    content += '<div class="col-lg-3 form-group">';
                    content += '<label style="font-size:12px;">' + SS_DynamicColumns_g[i].Input_Label + '</label></div>';
                    content += '<div class="col-lg-8 form-group">';
                    var label = SS_DynamicColumns_g[i].Input_Label;
                    label = label.replace(/ /g, "_");
                    content += '<input type="text" id="txt' + label + '_' + rowVal + '" maxLength="500"  class="input-large form-control dynaSS checkstring" style="width:50% !important;" autocomplete="off" placeholder="Please Enter ' + SS_DynamicColumns_g[i].Input_Label + ' Here..." />';
                    content += '<input type="hidden" id="hdn' + label + '_' + rowVal + '" value="0"/></div>';
                    content += '</div></div>';
                } else {
                    content += '<div id="rowdyn_' + rowVal + '_' + i + '" class="row">';
                    content += '<div class="col-lg-12 form-group remove-left-padding">';
                    content += '<div class="col-lg-3 form-group">';
                    content += '<label style="font-size:12px;">' + SS_DynamicColumns_g[i].Input_Label + '</label></div>';
                    content += '<div class="col-lg-8 form-group">';
                    var label = SS_DynamicColumns_g[i].Input_Label;
                    label = label.replace(/ /g, "_");
                    content += '<input type="text" id="txt' + label + '_' + rowVal + '" maxLength="500"  value="' + disjson[0].Input_Value + '" class="input-large form-control dynaSS checkstring" style="width:50% !important;" autocomplete="off" placeholder="Please Enter ' + SS_DynamicColumns_g[i].Input_Label + ' Here..." />';
                    content += '<input type="hidden" id="hdn' + label + '_' + rowVal + '" value="1"/></div>';
                    content += '</div></div>';
                }

            }
            if (SS_DynamicColumns_g[i].Input_DataType.toUpperCase() == "NUMBER") {
                if (disjson.length == 0) {
                    content += '<div id="rowdyn_' + rowVal + '_' + i + '" class="row">';
                    content += '<div class="col-lg-12 form-group remove-left-padding">';
                    content += '<div class="col-lg-3 form-group">';
                    content += '<label style="font-size:12px;">' + SS_DynamicColumns_g[i].Input_Label + '</label></div>';
                    content += '<div class="col-lg-8 form-group">';
                    var label = SS_DynamicColumns_g[i].Input_Label;
                    label = label.replace(/ /g, "_");
                    content += '<input type="number" min="1" max="999999" id="txt' + label + '_' + rowVal + '" class="input-large form-control dynaSS checknumber" autocomplete="off" onkeypress="return fnValidateNumberForTransitandFreeGoods(this,event);" onpaste="return false";  style="width:50% !important;" placeholder="Please Enter ' + SS_DynamicColumns_g[i].Input_Label + ' Here...(Numbers Only)" />';
                    content += '<input type="hidden" id="hdn' + label + '_' + rowVal + '" value="0"/></div>';
                    content += '</div></div>';
                } else {
                    content += '<div id="rowdyn_' + rowVal + '_' + i + '" class="row">';
                    content += '<div class="col-lg-12 form-group remove-left-padding">';
                    content += '<div class="col-lg-3 form-group">';
                    content += '<label style="font-size:12px;">' + SS_DynamicColumns_g[i].Input_Label + '</label></div>';
                    content += '<div class="col-lg-8 form-group">';
                    var label = SS_DynamicColumns_g[i].Input_Label;
                    label = label.replace(/ /g, "_");
                    content += '<input type="number" min="1" max="999999" id="txt' + label + '_' + rowVal + '"   value="' + disjson[0].Input_Value + '" class="input-large form-control dynaSS checknumber" autocomplete="off" onkeypress="return fnValidateNumberForTransitandFreeGoods(this,event);" onpaste="return false";  style="width:50% !important;" placeholder="Please Enter ' + SS_DynamicColumns_g[i].Input_Label + ' Here...(Numbers Only)" />';
                    content += '<input type="hidden" id="hdn' + label + '_' + rowVal + '" value="1"/></div>';
                    content += '</div></div>';
                }
            }
            if (SS_DynamicColumns_g[i].Input_DataType.toUpperCase() == "TEXTAREA") {
                if (disjson.length == 0) {
                    content += '<div id="rowdyn_' + rowVal + '_' + i + '" class="row">';
                    content += '<div class="col-lg-12 form-group remove-left-padding">';
                    content += '<div class="col-lg-3 form-group">';
                    content += '<label style="font-size:12px;">' + SS_DynamicColumns_g[i].Input_Label + '</label></div>';
                    content += '<div class="col-lg-8 form-group">';
                    var label = SS_DynamicColumns_g[i].Input_Label;
                    label = label.replace(/ /g, "_");
                    content += '<textarea id="txt' + label + '_' + rowVal + '" maxLength="500" rows="3" style="resize:none;width:50% !important;"  placeholder="Please Enter ' + SS_DynamicColumns_g[i].Input_Label + ' Here..."  class="dynaSS checkstring"/></textarea>';
                    content += '<input type="hidden" id="hdn' + label + '_' + rowVal + '" value="0"/></div>';
                    content += '</div></div>';
                } else {
                    content += '<div id="rowdyn_' + rowVal + '_' + i + '" class="row">';
                    content += '<div class="col-lg-12 form-group remove-left-padding">';
                    content += '<div class="col-lg-3 form-group">';
                    content += '<label style="font-size:12px;">' + SS_DynamicColumns_g[i].Input_Label + '</label></div>';
                    content += '<div class="col-lg-8 form-group">';
                    var label = SS_DynamicColumns_g[i].Input_Label;
                    label = label.replace(/ /g, "_");
                    content += '<textarea id="txt' + label + '_' + rowVal + '" maxLength="500" rows="3" style="resize:none;width:50% !important;"  placeholder="Please Enter ' + SS_DynamicColumns_g[i].Input_Label + ' Here..."  class="dynaSS checkstring">' + disjson[0].Input_Value + '</textarea>';
                    content += '<input type="hidden" id="hdn' + label + '_' + rowVal + '" value="1"/></div>';
                    content += '</div></div>';
                }
            }
            if (SS_DynamicColumns_g[i].Input_DataType.toUpperCase() == "DATE") {
                if (disjson.length == 0) {
                    content += '<div id="rowdyn_' + rowVal + '_' + i + '" class="row">';
                    content += '<div class="col-lg-12 form-group remove-left-padding">';
                    content += '<div class="col-lg-3 form-group">';
                    content += '<label style="font-size:12px;">' + SS_DynamicColumns_g[i].Input_Label + '</label></div>';
                    content += '<div class="col-lg-8 form-group">';
                    var label = SS_DynamicColumns_g[i].Input_Label;
                    label = label.replace(/ /g, "_");
                    content += '<input type="text" readOnly="readOnly" id="txt' + label + '_' + rowVal + '" autocomplete="off" class="input-large form-control datecls dynaSS checkdate" style="width:50% !important;" placeholder="Please Enter ' + SS_DynamicColumns_g[i].Input_Label + ' Date Here..." />';
                    content += '<input type="hidden" id="hdn' + label + '_' + rowVal + '" value="0"/></div>';
                    content += '</div></div>';
                } else {
                    content += '<div id="rowdyn_' + rowVal + '_' + i + '" class="row">';
                    content += '<div class="col-lg-12 form-group remove-left-padding">';
                    content += '<div class="col-lg-3 form-group">';
                    content += '<label style="font-size:12px;">' + SS_DynamicColumns_g[i].Input_Label + '</label></div>';
                    content += '<div class="col-lg-8 form-group">';
                    var label = SS_DynamicColumns_g[i].Input_Label;
                    label = label.replace(/ /g, "_");
                    content += '<input type="text" readOnly="readOnly" id="txt' + label + '_' + rowVal + '" value="' + disjson[0].Input_Value + '" autocomplete="off" class="input-large form-control datecls dynaSS checkdate" style="width:50% !important;" placeholder="Please Enter ' + SS_DynamicColumns_g[i].Input_Label + ' Date Here..." />';
                    content += '<input type="hidden" id="hdn' + label + '_' + rowVal + '" value="1"/></div>';
                    content += '</div></div>';
                }
            }
            //}
        }
        content += '</div>';
    }
    return content;
}
function fnProductWisePriceForEdit(mainresp) {
    debugger;
    var customerCode = $("#hdnStockiestCode").val();
    var monthYear = $('#txtMonth').val();
    var month = fnGetMonth(monthYear.split('-')[0]);
    var year = monthYear.split('-')[1];
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/SecondarySales/GetPriceforSecondarySales',
        data: 'regionCode=' + regionCode + '&customer=' + customerCode + '&month=' + monthVal + '&year=' + yearVal,
        async: false,
        success: function (response) {
            productPrice_g = response;
            product = '1';
            draftval = '1';
            product = '0';
            var input = [];
            var inputvalues = {
                Month: month,
                Year: year,
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
            fnBindEditDetails(mainresp);
            //return false;
        }

    });
    draftval = '2';
}
function fnOnBlurForProductsGrid(Id) {
    debugger;
    var ProductName = "";
    var product_Code = "";
    var rowId = Id.id.split('_');
    rowId = rowId[rowId.length - 1];
    if ($('#' + Id.id).val() != "") {
        ProductName = $('#' + Id.id).val();
        product_Code = $('#hdnProductCode_' + rowId).val();
    }
    if (ProductName != "") {
        var i = "false";
        var s = ""; name = "";

        for (var o = 0; o < productjsonString.length; o++) {
            if (productjsonString[o].label == ProductName) {
                i = "true";
                s = productjsonString[o].value;
                name = productjsonString[o].label;
            }
        }
        if (i == "false") {
            $('#hdnProductCode_' + rowId).val(0);
            var valueprice = parseFloat($('#txtUnitRate_' + rowId).val()).toFixed(2);
            $('#txtUnitRate_' + rowId).val(valueprice);
            var valueamountsales = parseFloat($('#txtAmountSALES_' + rowId).val()).toFixed(2);
            $("#txtAmountSALES_" + rowId).val(valueamountsales);
            var valueamountCB = parseFloat($('#txtAmountCLOSING_BALANCE_' + rowId).val()).toFixed(2);
            $("#txtAmountCLOSING_BALANCE_" + rowId).val(valueamountCB);
            for (var i = 0; i < inputColumnArr.length; i++) {
                if (inputColumnArr[i].toUpperCase() != "REMARKS") {
                    var value = parseFloat($('#txt' + inputColumnArr[i] + '_' + rowId).val()).toFixed(2);
                    $('#txt' + inputColumnArr[i] + '_' + rowId).val(value);
                } else {
                    $('#txt' + inputColumnArr[i] + '_' + rowId).val('');
                }

                if (inputColumnArr[i].toUpperCase() == "PURCHASE") {
                    $('#txt' + inputColumnArr[i] + '_' + rowId).attr('readonly', false);
                }
                fnCalculate(Id);
            }
            $('#txtProductName_' + rowId).val('');
        } else {
            $('#hdnProductCode_' + rowId).val(s);
            $('#txtProductName_' + rowId).val(name);
        }
    } else {
        $('#hdnProductCode_' + rowId).val(0);
        var valueprice = parseFloat($('#txtUnitRate_' + rowId).val()).toFixed(2);
        $('#txtUnitRate_' + rowId).val(valueprice);
        var valueamountsales = parseFloat($('#txtAmountSALES_' + rowId).val()).toFixed(2);
        $("#txtAmountSALES_" + rowId).val(valueamountsales);
        var valueamountCB = parseFloat($('#txtAmountCLOSING_BALANCE_' + rowId).val()).toFixed(2);
        $("#txtAmountCLOSING_BALANCE_" + rowId).val(valueamountCB);
        for (var i = 0; i < inputColumnArr.length; i++) {
            if (inputColumnArr[i].toUpperCase() != "REMARKS") {
                var value = parseFloat($('#txt' + inputColumnArr[i] + '_' + rowId).val()).toFixed(2);
                $('#txt' + inputColumnArr[i] + '_' + rowId).val(value);
            } else {
                $('#txt' + inputColumnArr[i] + '_' + rowId).val('');
            }


            if (inputColumnArr[i].toUpperCase() == "PURCHASE") {
                $('#txt' + inputColumnArr[i] + '_' + rowId).attr('readonly', false);
            }
            fnCalculate(Id);
        }
        $('#txtProductName_' + rowId).val('');
    }
}
function fnGetProductsFortheSelecRegandStockistForEdit() {
    debugger;
    var monthYear = $('#txtMonth').val();
    var month = fnGetMonth(monthYear.split('-')[0]);
    var year = monthYear.split('-')[1];
    $.ajax({
        type: "GET",
        url: "../HiDoctor_Activity/SecondarySales/GetProductsBasedonStockist",
        data: "regionCode=" + regionCode + "&customerCode=" + $('#hdnStockiestCode').val(),
        //+ "&month=" + monthVal + "&year=" + yearVal,
        success: function (resp) {
            productAutofill_g = resp;
            productjsonString = "";
            if (productAutofill_g.lstProdDet.length > 0) {
                var product = "[";
                for (var i = 0; i < productAutofill_g.lstProdDet.length; i++) {
                    product += "{label:" + '"' + "" + productAutofill_g.lstProdDet[i].Product_Name + "" + '",' + "value:" + '"' + "" + productAutofill_g.lstProdDet[i].Product_Code + "_" + productAutofill_g.lstProdDet[i].Division_Code + "" + '"' + "}";
                    if (i < productAutofill_g.lstProdDet.length - 1) {
                        product += ",";
                    }
                }
                product += "];";

                var productforPop = "[";
                for (var i = 0; i < productAutofill_g.lstProdDet.length; i++) {
                    productforPop += "{Product_Name:" + '"' + "" + productAutofill_g.lstProdDet[i].Product_Name + "" + '",' + "productCode:" + '"' + "" + productAutofill_g.lstProdDet[i].Product_Code + "_" + productAutofill_g.lstProdDet[i].Division_Code + "" + '",' + "Product_Code:" + '"' + "" + productAutofill_g.lstProdDet[i].Product_Code + "" + '"' + "}";
                    if (i < productAutofill_g.lstProdDet.length - 1) {
                        productforPop += ",";
                    }
                }
                productforPop += "];";
                productjsonString = eval(product);
                productjsonStringPop = eval(productforPop);
                autoComplete(productjsonString, "txtProductName", "hdnProductCode", 'autoProducts');
                fnSecondaryEventBinder();
                fnDynamicEventBinder();
                fnCreateNewRowInProduct("");


            } else {
                fnMsgAlert('info', 'Secondary Sales', 'No Products found for the selected Region.');
                $('#btnGoForProd').attr('disabled', false);
                $.unblockUI();
                return false;
            }

        },
        // complete: function () {

        //}
    });
}
function fnFilterProductHavingClosingBalGreaterthanZero() {
    debugger;
    var ClosingProdArray = [];
    var popProductprice = "";
    var sno = 0;
    var is_inherited = "";
    var lstopenBalances = "";
    var stockCode = $('#hdnStockiestCode').val();
    is_inherited = fnGetStockiestinheritedOrNot(regionCode, stockCode);
    for (var i = 0; i < productjsonStringPop.length; i++) {
        sno++;
        if (productPrice_g.lstPricegrpSS.length > 0) {
            var lstProductpricecode = $.grep(productPrice_g.lstPricegrpSS, function (ele, index) {
                return ele.Product_Code == productjsonStringPop[i].Product_Code;
            });
            var popProductprice = "";
            if (lstProductpricecode.length > 0) {
                if (productPrice_g.lstgrpType[0].Price_Type == "PTS") {
                    popProductprice = lstProductpricecode[0].PTS;
                }
                else if (productPrice_g.lstgrpType[0].Price_Type == "INVOICE_AMOUNT") {
                    popProductprice = lstProductpricecode[0].INVOICE_AMOUNT;
                }
                else if (productPrice_g.lstgrpType[0].Price_Type == "PTR_WOTAX") {
                    popProductprice = lstProductpricecode[0].PTR_WOTax;
                }
                else if (productPrice_g.lstgrpType[0].Price_Type == "MRP") {
                    popProductprice = lstProductpricecode[0].MRP;
                }
                else if (productPrice_g.lstgrpType[0].Price_Type == "NRV") {
                    popProductprice = lstProductpricecode[0].NRV;
                }
            }
        }
        if (productAutofill_g.lstOpnBal.length > 0) {
            if (is_inherited == "1") {
                lstopenBalances = $.grep(productAutofill_g.lstOpnBal, function (ele, index) {
                    return ele.Product_Code == productjsonStringPop[i].Product_Code && ele.Customer_Code == stockCode && ele.IS_Inherited == "1"
                });
            }
            else {
                lstopenBalances = $.grep(productAutofill_g.lstOpnBal, function (ele, index) {
                    return ele.Product_Code == productjsonStringPop[i].Product_Code && ele.Customer_Code == stockCode
                });
            }
        }
        if (lstopenBalances.length > 0) {
            lstopenBalances = lstopenBalances.sort(function (a, b) { return a - b });
            if (lstopenBalances[0].Closing_Stock > 0) {
                ClosingProdArray.push(productjsonStringPop[i].Product_Code);
            }
        }
    }
    return ClosingProdArray;
}