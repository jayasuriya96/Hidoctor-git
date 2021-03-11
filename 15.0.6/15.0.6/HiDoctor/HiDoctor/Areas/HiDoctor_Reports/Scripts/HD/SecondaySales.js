function fnSecondarySalesTrendAnalysis() {
    var month = $('input:radio[name=Selection]:checked').val();
    ShowModalPopup("dvloading");
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetSecondarySalesTrendAnalysis',
        data: 'regionCode=' + $('#hdnRegionCode').val() + '&month=' + month + '&ProductCode=' + $("#ddlProductName").val(),
        success: function (response) {
            jsData = eval('(' + response + ')');
            var tableContent = "", monthName = "";
            var tableContentRatio = "", tableContentSales = "", tableContentClose = "";
            var quterCount = 0, quter = 0, sales = 0, close = 0;
            var monthSales = 0, halfSales = 0, totalSales = 0, totalClosing = 0, totalRatio = 0;
            var avg = 0.0;
            var isRegionNameBind = true;
            var isStockiestNameBind = true;
            var monthList = new Array();

            monthList.push("Apr_4"); monthList.push("May_5"); monthList.push("Jun_6"); monthList.push("Jul_7");
            monthList.push("Aug_8"); monthList.push("Sep_9"); monthList.push("Oct_10"); monthList.push("Nov_11");
            monthList.push("Dec_12"); monthList.push("Jan_1"); monthList.push("Feb_2"); monthList.push("Mar_3");

            if (jsData.Tables[0].Rows.length > 0) {

                tableContent = "";
                tableContent += "<table cellspacing='0' cellpadding='0' width='100%' id='tblSalesAndActivity' class='data display datatable' >";
                tableContent += "<thead>";

                tableContent += "<tr style='display: none;' id='tblTr'>"
                tableContent += "<th style='display:none;width: 15%'>User Name</th>";
                tableContent += "<th style='display:none;width: 15%'>Employee Name</th>";
                tableContent += "<th style='display:none;width: 15%'>Division Name</th>";
                tableContent += "<th style='display:none;width: 15%'>Date of Joining</th>";
                tableContent += "<th style='display:none;width: 15%'>Manager Name</th>";
                tableContent += "<th style='display:none;width: 15%'>Manager Territory name</th>";

                tableContent += "<th style='text-align:left;width: 15%'>Territory Name</th>";
                tableContent += "<th style='text-align:left;width: 15%'>Stockist Name</th>";
                tableContent += "<th style='text-align:left;width: 15%'>Parameter</th>";

                var type = '[{ type: "text" }, { type: "text" }, { type: "text" },{ type: "text" }, { type: "text" }, { type: "text" }';
                type += ',{ type: "text" }, { type: "text" }, { type: "text" }';
                for (var k = 0; k < monthList.length; k++) {
                    type += ', { type: "number-range" }';
                    tableContent += "<th style='text-align:left;width: 15%'>" + monthList[k].split('_')[0] + " </th>";
                    quterCount++;
                    if (quterCount == 3) {
                        quterCount = 0;
                        quter++;
                        monthName = monthQuter(quter);
                        type += ', { type: "number-range" }';
                        tableContent += "<th style='text-align:left;width: 15%'>" + monthName + "</th>";
                        if (quter == 2) {
                            type += ', { type: "number-range" }';
                            tableContent += "<th style='text-align:left;width: 15%'>Half Yearly</th>";
                        }
                        else if (quter == 4) {
                            type += ', { type: "number-range" }';
                            tableContent += "<th style='text-align:left;width: 15%'>Second Half Yearly</th>";
                        }
                    }
                    if (month == k) {
                        break;
                    }
                }
                type += ', { type: "number-range" }]';
                tableContent += "<th style='text-align:left;width: 15%'>Annual Total</th>";
                tableContent += "</tr>";
                quterCount = 0, quter = 0;
                // HEADER 2
                var iRow = 9;
                tableContent += "<tr>";
                tableContent += "<th style='display:none;width: 15%'>User Name</th>";
                tableContent += "<th style='display:none;width: 15%'>Employee Name</th>";
                tableContent += "<th style='display:none;width: 15%'>Division Name</th>";
                tableContent += "<th style='display:none;width: 15%'>Date of Joining</th>";
                tableContent += "<th style='display:none;width: 15%'>Manager Name</th>";
                tableContent += "<th style='display:none;width: 15%'>Manager Territory name</th>";

                tableContent += "<th style='text-align:left;width: 15%' >Territory Name</th>";
                tableContent += "<th style='text-align:left;width: 15%'>Stockist Name</th>";
                tableContent += "<th style='text-align:left;width: 15%'>Parameter</th>";
                for (var k = 0; k < monthList.length; k++) {
                    iRow++;
                    tableContent += "<th style='text-align:left;width: 15%'>" + monthList[k].split('_')[0] + " </th>";
                    quterCount++;
                    if (quterCount == 3) {
                        quterCount = 0;
                        quter++;
                        monthName = monthQuter(quter);
                        iRow++;
                        tableContent += "<th style='text-align:left;width: 15%'>" + monthName + "</th>";
                        if (quter == 2) {
                            iRow++;
                            tableContent += "<th style='text-align:left;width: 15%'>Half Yearly</th>";
                        }
                        else if (quter == 4) {
                            iRow++;
                            tableContent += "<th style='text-align:left;width: 15%'>Second Half Yearly</th>";
                        }
                    }
                    if (month == k) {
                        break;
                    }
                }
                iRow++;
                tableContent += "<th style='text-align:left;width: 15%'>Annual Total</th>";
                tableContent += "</tr>";

                tableContent += "<tr >";
                tableContent += "<th colspan= '" + iRow + "' align='left' width='15%' ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreea()'>Show Filter</span></th>";
                tableContent += "</tr>";

                tableContent += "</thead><tbody>";

                for (var i = 0; i < jsData.Tables[2].Rows.length; i++) {

                    isRegionNameBind = true;
                    var dJsonDataH = jsonPath(jsData, "$.Tables[0].Rows[?(@.Region_Code=='" + jsData.Tables[2].Rows[i].Region_Code + "')]");
                    if (dJsonDataH != false) {
                        for (var j = 0; j < dJsonDataH.length; j++) {
                            isStockiestNameBind = true;
                            quter = 0, quterCount = 0;
                            monthSales = 0, halfSales = 0, totalSales = 0, totalClosing = 0;
                            tableContentSales = "<tr>";
                            if (isRegionNameBind) {

                                var dJsonDataDiv = jsonPath(jsData, "$.Tables[3].Rows[?(@.Region_Code=='" + jsData.Tables[2].Rows[i].Region_Code + "')]");
                                divisionName = "";
                                if (dJsonDataDiv != false) {
                                    for (var index = 0; index < dJsonDataDiv.length; index++) {
                                        divisionName += dJsonDataDiv[index].Division_Name + ",";
                                    }

                                    if (divisionName != "") {
                                        divisionName = divisionName.substring(0, divisionName.length - 1);
                                    }
                                }
                                tableContentSales += "<td style='display:none'>" + jsData.Tables[2].Rows[i].User_Name + "</td>";
                                tableContentSales += "<td style='display:none'>" + jsData.Tables[2].Rows[i].Employee_Name + "</td>";
                                tableContentSales += "<td style='display:none'>" + divisionName + "</td>";
                                tableContentSales += "<td style='display:none'>" + jsData.Tables[2].Rows[i].DOJ + "</td>";
                                tableContentSales += "<td style='display:none'>" + jsData.Tables[2].Rows[i].Manager_Name + "</td>";
                                tableContentSales += "<td style='display:none'>" + jsData.Tables[2].Rows[i].Manager_Region_Name + "</td>";
                                tableContentSales += "<td style='text-align:left'>" + jsData.Tables[2].Rows[i].Region_Name + "</td>";
                            }
                            else {
                                tableContentSales += "<td style='display:none'></td>";
                                tableContentSales += "<td style='display:none'></td>";
                                tableContentSales += "<td style='display:none'></td>";
                                tableContentSales += "<td style='display:none'></td>";
                                tableContentSales += "<td style='display:none'></td>";
                                tableContentSales += "<td style='display:none'></td>";
                                tableContentSales += "<td style='text-align:left;'></td>";
                            }
                            if (isStockiestNameBind) {
                                tableContentSales += "<td style='text-align:left;'>" + dJsonDataH[j].Customer_Name + "</td>";
                            }
                            else {
                                tableContentSales += "<td style='text-align:left;'></td>";
                            }
                            tableContentSales += "<td style='text-align:left'>Secondary</td>";

                            isStockiestNameBind = false;
                            isRegionNameBind = false;

                            tableContentClose = "<tr>";
                            tableContentClose += "<td style='display:none'></td>";
                            tableContentClose += "<td style='display:none'></td>";
                            tableContentClose += "<td style='display:none'></td>";
                            tableContentClose += "<td style='display:none'></td>";
                            tableContentClose += "<td style='display:none'></td>";
                            tableContentClose += "<td style='display:none'></td>";
                            tableContentClose += "<td style='text-align:left;'></td>";
                            tableContentClose += "<td style='text-align:left;'></td>";
                            tableContentClose += "<td style='text-align:left'>Closing</td>";

                            tableContentRatio = "<tr>";
                            tableContentRatio += "<td style='display:none'></td>";
                            tableContentRatio += "<td style='display:none'></td>";
                            tableContentRatio += "<td style='display:none'></td>";
                            tableContentRatio += "<td style='display:none'></td>";
                            tableContentRatio += "<td style='display:none'></td>";
                            tableContentRatio += "<td style='display:none'></td>";
                            tableContentRatio += "<td style='text-align:left;'></td>";
                            tableContentRatio += "<td style='text-align:left;'></td>";
                            tableContentRatio += "<td style='text-align:left'>Ratio % </td>";

                            for (var k = 0; k < monthList.length; k++) {
                                sales = 0, close = 0;
                                var dJsonData = jsonPath(jsData, "$.Tables[1].Rows[?(@.Region_Code=='" + jsData.Tables[2].Rows[i].Region_Code + "' & @.Base_Code=='" + dJsonDataH[j].Customer_Code + "' & @.Month=='" + monthList[k].split('_')[1] + "')]");
                                if (dJsonData != false) {

                                    totalClosing = parseInt(dJsonData[0].Closing_Stock);
                                    sales = parseInt(dJsonData[0].Sales);
                                    close = parseInt(dJsonData[0].Closing_Stock);
                                    monthSales += parseInt(dJsonData[0].Sales);

                                    tableContentSales += "<td style='text-align:center'>" + sales + "</td>";
                                    tableContentClose += "<td style='text-align:center'>" + close + "</td>";

                                    if (sales > 0) {
                                        avg = (close / sales) * 100;
                                        tableContentRatio += "<td style='text-align:center'>" + Math.round(avg * 100) / 100 + "</td>";
                                    }
                                    else {
                                        tableContentRatio += "<td style='text-align:center'>0</td>";
                                    }
                                }
                                else {
                                    tableContentSales += "<td style='text-align:center'>0</td>";
                                    tableContentClose += "<td style='text-align:center'>0</td>";
                                    tableContentRatio += "<td style='text-align:center'>0</td>";
                                }

                                quterCount++;
                                if (quterCount == 3) {
                                    quterCount = 0;
                                    quter++;
                                    halfSales += monthSales;
                                    totalSales += monthSales;
                                    tableContentSales += "<td style='text-align:center'>" + monthSales + "</td>";
                                    tableContentClose += "<td style='text-align:center'>" + close + "</td>";
                                    if (monthSales > 0) {
                                        avg = (close / monthSales) * 100;
                                        tableContentRatio += "<td style='text-align:center'>" + Math.round(avg * 100) / 100 + "</td>";
                                    }
                                    else {
                                        tableContentRatio += "<td style='text-align:center'>0</td>";
                                    }

                                    if (quter == 2) {
                                        tableContentSales += "<td style='text-align:center'>" + halfSales + "</td>";
                                        tableContentClose += "<td style='text-align:center'>" + close + "</td>";

                                        if (halfSales > 0) {
                                            avg = (close / halfSales) * 100;
                                            tableContentRatio += "<td style='text-align:center'>" + Math.round(avg * 100) / 100 + "</td>";
                                        }
                                        else {
                                            tableContentRatio += "<td style='text-align:center'>0</td>";
                                        }
                                        halfSales = 0;
                                    }
                                    else if (quter == 4) {
                                        tableContentSales += "<td style='text-align:center'>" + halfSales + "</td>";
                                        tableContentClose += "<td style='text-align:center'>" + close + "</td>";

                                        if (halfSales > 0) {
                                            avg = (close / halfSales) * 100;
                                            tableContentRatio += "<td style='text-align:center'>" + Math.round(avg * 100) / 100 + "</td>";
                                        }
                                        else {
                                            tableContentRatio += "<td style='text-align:center'>0</td>";
                                        }
                                        halfSales = 0;
                                    }

                                }
                                if (month == k) {
                                    break;
                                }
                            }

                            tableContentSales += "<td style='text-align:center'>" + totalSales + "</td>";
                            tableContentClose += "<td style='text-align:center'>" + totalClosing + "</td>";

                            if (totalSales > 0) {
                                avg = (totalClosing / totalSales) * 100;
                                tableContentRatio += "<td style='text-align:center'>" + Math.round(avg * 100) / 100 + "</td>";
                            }
                            else {
                                tableContentRatio += "<td style='text-align:center'>0</td>";
                            }

                            tableContentSales += "</tr>";
                            tableContentClose += "</tr>";
                            tableContentRatio += "</tr>";

                            tableContent += tableContentSales;
                            tableContent += tableContentClose;
                            tableContent += tableContentRatio;

                        }
                    }

                }

                tableContent += "</tbody>";
                tableContent += "</table>";
                var jsonType = eval(type);
                $("#divReport").html(tableContent);
                $("#divPrint").html(tableContent);
                if ($.fn.dataTable) {
                    $('#tblSalesAndActivity').dataTable({
                        "sPaginationType": "full_numbers", "bSort": false, "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                    }).columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType
                    });
                };
                fninializePrint("divPrint", "ifrmPrint", "divReport");
                if (tableContent != "") {
                    $("#divInput").slideUp();
                    $("#spnInputToggle").html("Show Input");
                }
                fninializePrint("divPrint", "ifrmPrint", "divReport");
                HideModalPopup("dvloading");
            }
            else {
                fnMsgAlert('info', 'Report', 'No Data found.');
                HideModalPopup("dvloading");
            }


        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

function monthQuter(number) {
    if (1 == number) {
        return "Apr-Jun";
    }
    if (2 == number) {
        return "Jul-Sep";
    }
    if (3 == number) {
        return "Oct-Dec";
    }
    if (4 == number) {
        return "Jan-Mar";
    }
}
// Secondary Sales Header Report
function fnShowProductDetails() {
    debugger;
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetSaleProductsSS',
        data: 'A',
        success: function (response) {
            jsData = eval('(' + response + ')');
            $('option', $("#ddlProductName")).remove();
            if (jsData.Tables[0].Rows.length > 0) {
                $('#ddlProductName').append("<option value='0'>-Select Product-</option>");
                for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                    $("#ddlProductName").append("<option value='" + jsData.Tables[0].Rows[i].Product_Code + "'>" + jsData.Tables[0].Rows[i].Product_Name + "</option>");
                }
                $("#ddlProductName").val('0');
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}
function fnShowProductMulDetails() {
    debugger;
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetSaleProductsSS',
        data: 'A',
        success: function (response) {
            jsData = eval('(' + response + ')');


            $('option', $("#ddlProductName")).remove();
            if (jsData.Tables[0].Rows.length > 0) {
                for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                    $("#ddlProductName").append(new Option(jsData.Tables[0].Rows[i].Product_Name, jsData.Tables[0].Rows[i].Product_Code, false, false));
                }
                $("#selectall").click(function () {
                    $('.case').attr('checked', this.checked);
                });
                $("#ddlProductName").multiselect({
                    noneSelectedText: 'Select Product',
                    selectedList: 4
                }).multiselectfilter();

            }
        }
    });
}

function fnShowStockiestDetails() {
    debugger;
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetStockiestSSOld',
        data: 'A',
        success: function (response) {
            jsData = eval('(' + response + ')');
            $('option', $("#ddlStockiestName")).remove();
            if (jsData.Tables[0].Rows.length > 0) {
                $('#ddlStockiestName').append("<option value='0'>-Select Stockiest-</option>");
                for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                    $("#ddlStockiestName").append("<option value='" + jsData.Tables[0].Rows[i].Customer_Code + "'>" + jsData.Tables[0].Rows[i].Customer_Name + "</option>");
                }
                $("#ddlStockiestName").val('0');
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

function fnShowStockiestMulDetails(regionCode) {
    debugger;
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetStockiestSSOldReport',
        data: "regionCode=" + regionCode,
        success: function (response) {
            debugger;
            jsData = eval('(' + response + ')');
            $('option', $("#ddlStockiestName")).remove();
            if (jsData.Tables[0].Rows.length > 0) {
                for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                    $("#ddlStockiestName").append(new Option(jsData.Tables[0].Rows[i].Customer_Name, jsData.Tables[0].Rows[i].Customer_Code, false, false));
                }
                $("#selectall").click(function () {
                    $('.case').attr('checked', this.checked);
                });
                $("#ddlStockiestName").multiselect({
                    noneSelectedText: 'Select Stockiest',
                    selectedList: 4
                }).multiselectfilter();

            }
        }
    });
}

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function monthDiff(fromDate, toDate) {
    var tempDate = new Date(fromDate);
    var endDate = new Date(toDate);

    var monthCount = 0;
    while ((tempDate.getMonth() + '' + tempDate.getFullYear()) != (endDate.getMonth() + '' + endDate.getFullYear())) {
        monthCount++;
        tempDate.setMonth(tempDate.getMonth() + 1);
    }
    return monthCount + 1;
}
// Get Month val();
function fngetMonthNumber(monthName) {
    if (monthName.toUpperCase() == "JAN") {
        return 1;
    }
    if (monthName.toUpperCase() == "FEB") {
        return 2;
    }
    if (monthName.toUpperCase() == "MAR") {
        return 3;
    }
    if (monthName.toUpperCase() == "APR") {
        return 4;
    }
    if (monthName.toUpperCase() == "MAY") {
        return 5;
    }
    if (monthName.toUpperCase() == "JUN") {
        return 6;
    }
    if (monthName.toUpperCase() == "JUL") {
        return 7;
    }
    if (monthName.toUpperCase() == "AUG") {
        return 8;
    }
    if (monthName.toUpperCase() == "SEP") {
        return 9;
    }
    if (monthName.toUpperCase() == "OCT") {
        return 10;
    }
    if (monthName.toUpperCase() == "NOV") {
        return 11;
    }
    if (monthName.toUpperCase() == "DEC") {
        return 12;
    }
}

//******************************************StockistWise UnderOver Stock SS ********************************************************//
function fnStockistWiseUnderOverStock() {
  
    var startMonth = fngetMonthNumber($('#txtFromDate').val().split('-')[0]);
    var endMonth = fngetMonthNumber($('#txtToDate').val().split('-')[0]);
    var startYear = $('#txtFromDate').val().split('-')[1];
    var endYear = $('#txtToDate').val().split('-')[1];

    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'Stockist Wise Under Over Stock', 'Please enter Start month.');
        HideModalPopup("dvloading");
        return false;
    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'Stockist Wise Under Over Stock', 'Please enter End month.');
        HideModalPopup("dvloading");
        return false;
    }
    var days = daysInMonth(endMonth, endYear);
    var startDate = "", endDate = "";
    if (parseInt(startMonth) >= 10) {
        startDate = startYear + "-" + startMonth + "-01";
    }
    else {
        startDate = startYear + "-0" + startMonth + "-01";
    }
    endDate = endYear + "-" + endMonth + "-" + days;
    var dt1 = new Date(startYear + "/" + startMonth + "/01");
    var dt2 = new Date(endYear + "/" + endMonth + "/" + days);
    if (dt1 > dt2) {
        fnMsgAlert('info', 'Stockist Wise Under Over Stock', 'Start Month&Year should be less than End Month&Year.');
        HideModalPopup("dvloading");
        return false;
    }
    if ($("#ddlProductName").val() == "0") {
        fnMsgAlert('info', 'Stockist Wise Under Over Stock', 'Select  product.');
        HideModalPopup("dvloading");
        return false;
    }
    var diffMonth = monthDiff(startMonth + "/01/" + startYear, endMonth + "/" + days + "/" + endYear);
    ShowModalPopup("dvloading");
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetStockistWiseUnderOverStock',
        data: 'regionCode=' + $('#hdnRegionCode').val() + '&sd=' + startDate + '&ed=' + endDate + '&ProductCode=' + $("#ddlProductName").val(),
        success: function (response) {
            jsData = eval('(' + response + ')');
            var tableContent = "";
            var sales = 0, close = 0, reionTotal = 0, totalsummary = 0;
            var salesEndMonth = 0, closingEndMonth = 0, noOfDaysStock = 0;
            var totalSalesEndMonth = 0, totalClosingEndMonth = 0, TotalNoOfDaysStock = 0;
            var endMonthSales = 0, EndMonthClosing = 0, monthSales = 0;
            var regionAvg = 0.0, totalAvg = 0.0, avg = 0.0;
            var isRegionNameBind = true;
            if (jsData.Tables[0].Rows.length > 0) {

                tableContent = "";
                tableContent += "<table cellspacing='0' cellpadding='0' width='100%' id='tblSalesAndActivity' class='data display datatable' >";
                tableContent += "<thead>";
                tableContent += "<tr style='display: none;' id='tblTr'>";
                tableContent += "<th style='display:none;width: 15%'>User Name</th>";
                tableContent += "<th style='display:none;width: 15%'>Employee Name</th>";
                tableContent += "<th style='display:none;width: 15%'>Division Name</th>";
                tableContent += "<th style='display:none;width: 15%'>Date of Joining</th>";
                tableContent += "<th style='display:none;width: 15%'>Manager Name</th>";
                tableContent += "<th style='display:none;width: 15%'>Manager Territory name</th>";

                tableContent += "<th style='text-align:left;width: 15%'>Territory Name</th>";
                tableContent += "<th style='text-align:left;width: 15%'>Stockist Name</th>";
                tableContent += "<th style='text-align:left;width: 15%'>Average Monthly Secondary Sales Units</th>";
                tableContent += "<th style='text-align:left;width: 15%'>% To Total Units</th>";
                tableContent += "<th style='text-align:left;width: 15%'>Secondary Sales Units for the month - (End Month)</th>";
                tableContent += "<th style='text-align:left;width: 15%'>Closing Units for the month - (End Month)</th>";
                tableContent += "<th style='text-align:left;width: 15%'>No of Days Stock</th>";
                tableContent += "</tr>";


                tableContent += "<tr>";

                tableContent += "<th style='display:none;width: 15%'>User Name</th>";
                tableContent += "<th style='display:none;width: 15%'>Employee Name</th>";
                tableContent += "<th style='display:none;width: 15%'>Division Name</th>";
                tableContent += "<th style='display:none;width: 15%'>Date of Joining</th>";
                tableContent += "<th style='display:none;width: 15%'>Manager Name</th>";
                tableContent += "<th style='display:none;width: 15%'>Manager Territory name</th>";

                tableContent += "<th style='text-align:left;width: 15%'>Territory Name</th>";
                tableContent += "<th style='text-align:left;width: 15%'>Stockist Name</th>";
                tableContent += "<th style='text-align:left;width: 15%'>Average Monthly Secondary Sales Units</th>";
                tableContent += "<th style='text-align:left;width: 15%'>% To Total Units</th>";
                tableContent += "<th style='text-align:left;width: 15%'>Secondary Sales Units for the month - (End Month)</th>";
                tableContent += "<th style='text-align:left;width: 15%'>Closing Units for the month - (End Month)</th>";
                tableContent += "<th style='text-align:left;width: 15%'>No of Days Stock</th>";
                tableContent += "</tr>";

                tableContent += "<tr >";
                tableContent += "<th colspan= '13' style='text-align:left' width='15%' ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreea()'>Show Filter</span></th>";
                tableContent += "</tr>";
                var type = '[{ type: "text" }, { type: "text" }, { type: "text" },{ type: "text" }, { type: "text" }, { type: "text" }';
                type += ',{ type: "text" }, { type: "text" },{ type: "number-range" }';
                type += ', { type: "number-range" }, { type: "number-range" }, { type: "number-range" }, { type: "number-range" }]';


                tableContent += "</thead><tbody>";
                // Summary Value           
                for (var i = 0; i < jsData.Tables[2].Rows.length; i++) {
                    var dJsonDataH = jsonPath(jsData, "$.Tables[0].Rows[?(@.Region_Code=='" + jsData.Tables[2].Rows[i].Region_Code + "')]");
                    if (dJsonDataH != false) {
                        for (var j = 0; j < dJsonDataH.length; j++) {
                            var dJsonData = jsonPath(jsData, "$.Tables[1].Rows[?(@.Region_Code=='" + jsData.Tables[2].Rows[i].Region_Code + "' & @.Base_Code=='" + dJsonDataH[j].Customer_Code + "')]");
                            if (dJsonData != false) {
                                for (var k = 0; k < dJsonData.length; k++) {
                                    totalsummary = totalsummary + parseInt(dJsonData[k].Sales);
                                }
                            }
                        }
                    }
                }

                if (jsData.Tables[2].Rows.length > 0) {
                    for (var i = 0; i < jsData.Tables[2].Rows.length; i++) {
                        var dJsonDataH = jsonPath(jsData, "$.Tables[0].Rows[?(@.Region_Code=='" + jsData.Tables[2].Rows[i].Region_Code + "')]");
                        if (dJsonDataH != false) {
                            reionTotal = 0;
                            monthSales = 0;
                            isRegionNameBind = true;
                            for (var j = 0; j < dJsonDataH.length; j++) {
                                var dJsonData = jsonPath(jsData, "$.Tables[1].Rows[?(@.Region_Code=='" + jsData.Tables[2].Rows[i].Region_Code + "' & @.Base_Code=='" + dJsonDataH[j].Customer_Code + "')]");
                                if (dJsonData != false) {
                                    for (var k = 0; k < dJsonData.length; k++) {
                                        reionTotal += parseInt(dJsonData[k].Sales);
                                    }

                                }
                            }
                            for (var j = 0; j < dJsonDataH.length; j++) {

                                sales = 0, close = 0;
                                tableContent += "<tr>";
                                if (isRegionNameBind) {

                                    var dJsonDataDiv = jsonPath(jsData, "$.Tables[3].Rows[?(@.Region_Code=='" + jsData.Tables[2].Rows[i].Region_Code + "')]");
                                    divisionName = "";
                                    if (dJsonDataDiv != false) {
                                        for (var index = 0; index < dJsonDataDiv.length; index++) {
                                            divisionName += dJsonDataDiv[index].Division_Name + ",";
                                        }

                                        if (divisionName != "") {
                                            divisionName = divisionName.substring(0, divisionName.length - 1);
                                        }

                                    }
                                    tableContent += "<td style='display:none'>" + jsData.Tables[2].Rows[i].User_Name + "</td>";
                                    tableContent += "<td style='display:none'>" + jsData.Tables[2].Rows[i].Employee_Name + "</td>";
                                    tableContent += "<td style='display:none'>" + divisionName + "</td>";
                                    tableContent += "<td style='display:none'>" + jsData.Tables[2].Rows[i].DOJ + "</td>";
                                    tableContent += "<td style='display:none'>" + jsData.Tables[2].Rows[i].Manager_Name + "</td>";
                                    tableContent += "<td style='display:none'>" + jsData.Tables[2].Rows[i].Manager_Region_Name + "</td>";
                                    tableContent += "<td align='left' onclick='fnSecondarySalesDetails(\"" + jsData.Tables[2].Rows[i].Region_Code + "_" + jsData.Tables[2].Rows[i].User_Code + "_" + startMonth + "_" + endMonth + "_" + startYear + "_" + endYear + "_" + $("#ddlProductName").val() + "\")' style='text-decoration:underline;cursor:pointer'>" + jsData.Tables[2].Rows[i].Region_Name + "</td>";
                                }
                                else {
                                    tableContent += "<td style='display:none'>" + jsData.Tables[2].Rows[i].User_Name + "</td>";
                                    tableContent += "<td style='display:none'>" + jsData.Tables[2].Rows[i].Employee_Name + "</td>";
                                    tableContent += "<td style='display:none'>" + divisionName + "</td>";
                                    tableContent += "<td style='display:none'>" + jsData.Tables[2].Rows[i].DOJ + "</td>";
                                    tableContent += "<td style='display:none'>" + jsData.Tables[2].Rows[i].Manager_Name + "</td>";
                                    tableContent += "<td style='display:none'>" + jsData.Tables[2].Rows[i].Manager_Region_Name + "</td>";
                                    tableContent += "<td style='text-align:left'></td>";
                                }
                                tableContent += "<td align='left' >" + dJsonDataH[j].Customer_Name + "</td>";
                                isRegionNameBind = false;
                                var dJsonData = jsonPath(jsData, "$.Tables[1].Rows[?(@.Region_Code=='" + jsData.Tables[2].Rows[i].Region_Code + "' & @.Base_Code=='" + dJsonDataH[j].Customer_Code + "')]");
                                if (dJsonData != false) {
                                    for (var k = 0; k < dJsonData.length; k++) {
                                        sales += parseInt(dJsonData[k].Sales);
                                        //monthSales += parseInt(dJsonData[k].Sales);
                                        close += parseInt(dJsonData[k].Closing_Stock);

                                    }
                                }
                                endMonthSales = 0;
                                EndMonthClosing = 0;

                                var dJson = jsonPath(jsData, "$.Tables[1].Rows[?(@.Month=='" + endMonth + "' & @.Year=='" + endYear + "' & @.Base_Code=='" + dJsonDataH[j].Customer_Code + "' & @.Region_Code=='" + jsData.Tables[2].Rows[i].Region_Code + "')]");
                                if (dJson != false) {
                                    for (var k = 0; k < dJson.length; k++) {

                                        endMonthSales += parseInt(dJson[k].Sales);
                                        EndMonthClosing += parseInt(dJson[k].Closing_Stock);
                                    }
                                }
                                avg = 0.0;
                                if (sales > 0) {
                                    avg = (sales / diffMonth);
                                    tableContent += "<td style='text-align:center'>" + Math.round(avg * 100) / 100 + "</td>";
                                }
                                else {
                                    tableContent += "<td style='text-align:center'>0</td>";
                                }
                                if (avg > 0) {
                                    regionAvg = (parseFloat(reionTotal) / parseFloat(diffMonth));
                                    avg = (avg / regionAvg) * 100;
                                    tableContent += "<td style='text-align:center'>" + Math.round(avg * 100) / 100 + "</td>";
                                }
                                else {
                                    tableContent += "<td style='text-align:center'>0</td>";
                                }

                                salesEndMonth += endMonthSales;
                                closingEndMonth += EndMonthClosing;

                                tableContent += "<td style='text-align:center'>" + endMonthSales + "</td>";
                                tableContent += "<td style='text-align:center'>" + EndMonthClosing + "</td>";
                                if (endMonthSales > 0) {
                                    avg = ((EndMonthClosing * 30) / endMonthSales);
                                    tableContent += "<td style='text-align:center'>" + Math.round(avg * 100) / 100 + "</td></tr>";
                                }
                                else {
                                    tableContent += "<td style='text-align:center'>0</td>";
                                }
                                tableContent += "</tr>"
                            }


                            tableContent += "<tr>"

                            tableContent += "<td style='display:none'></td>";
                            tableContent += "<td style='display:none'></td>";
                            tableContent += "<td style='display:none'></td>";
                            tableContent += "<td style='display:none'></td>";
                            tableContent += "<td style='display:none'></td>";
                            tableContent += "<td style='display:none'></td>";
                            tableContent += "<td style='text-align:center;background-color:#C0C0C0;' ></td>";
                            tableContent += "<td style='text-align:center;background-color:#C0C0C0;' >" + jsData.Tables[2].Rows[i].Region_Name + " - Total</td>";
                            var totalAvg = 0;
                            if (totalsummary > 0) {
                                totalAvg = (reionTotal / diffMonth)
                                tableContent += "<td style='text-align:center;background-color:#C0C0C0;'>" + Math.round(totalAvg * 100) / 100 + "</td>";
                            }
                            else {
                                tableContent += "<td style='text-align:center;background-color:#C0C0C0;'>0</td>";
                            }
                            if (totalAvg > 0) {

                                regionAvg = (parseFloat(totalsummary) / parseFloat(diffMonth));
                                var avg = (totalAvg / regionAvg) * 100;
                                tableContent += "<td style='text-align:center;background-color:#C0C0C0;'>" + Math.round(avg * 100) / 100 + "</td>";
                            }
                            else {
                                tableContent += "<td style='text-align:center;background-color:#C0C0C0;'>0</td>";
                            }
                            tableContent += "<td style='text-align:center;background-color:#C0C0C0;'>" + salesEndMonth + "</td>";
                            tableContent += "<td style='text-align:center;background-color:#C0C0C0;'>" + closingEndMonth + "</td>";
                            totalClosingEndMonth += closingEndMonth;
                            totalSalesEndMonth += salesEndMonth;
                            if (salesEndMonth > 0) {
                                var avg = ((closingEndMonth * 30) / salesEndMonth);
                                tableContent += "<td style='text-align:center;background-color:#C0C0C0;'>" + Math.round(avg * 100) / 100 + "</td>";
                            }
                            else {
                                tableContent += "<td style='text-align:center;background-color:#C0C0C0;'>0</td>";
                            }
                            tableContent += "</tr>";

                            salesEndMonth = 0;
                            closingEndMonth = 0;
                        }
                    }


                    tableContent += "<tr>"

                    tableContent += "<th style='display:none' ></th>";
                    tableContent += "<th style='display:none'></th>";
                    tableContent += "<th style='display:none'></th>";
                    tableContent += "<th style='display:none'></th>";
                    tableContent += "<th style='display:none'></th>";
                    tableContent += "<th style='display:none'></th>";

                    tableContent += "<th style='text-align:right'></th>";
                    tableContent += "<th style='text-align:right'>Total :</th>";
                    if (totalsummary > 0) {
                        var avg = (totalsummary / diffMonth);
                        tableContent += "<th style='text-align:center'>" + Math.round(avg * 100) / 100 + "</th>";
                    }
                    else {
                        tableContent += "<th style='text-align:center'>0</th>";
                    }
                    tableContent += "<th style='text-align:center'></th>";
                    tableContent += "<th style='text-align:center'>" + totalSalesEndMonth + "</th>";
                    tableContent += "<th style='text-align:center'>" + totalClosingEndMonth + "</th>";
                    if (totalSalesEndMonth > 0) {
                        var avg = ((totalClosingEndMonth * 30) / totalSalesEndMonth);
                        tableContent += "<th style='text-align:center'>" + Math.round(avg * 100) / 100 + "</th>";
                    }
                    else {
                        tableContent += "<th style='text-align:center'>0</th>";
                    }
                    tableContent += "</tr>";
                }
                tableContent += "</tbody>";
                tableContent += "</table>";
            }
            $("#divReport").html(tableContent);
            $("#divPrint").html(tableContent);
            var jsonType = eval(type);
            if ($.fn.dataTable) {
                $('#tblSalesAndActivity').dataTable({
                    "sPaginationType": "full_numbers", "bSort": false, "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                }).columnFilter({
                    sPlaceHolder: "head:after",
                    aoColumns: jsonType
                });
            };

            if (tableContent != "") {
                $("#divInput").slideUp();
                $("#spnInputToggle").html("Show Input");
            }
            fninializePrint("divPrint", "ifrmPrint", "divReport");
            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Stockist Wise Under Over Stock', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}


function fnToggleTreea() {
    if ($("#spnDivToggle").html() == "Hide Filter") {

        $("#tblTr").hide();
        $("#spnDivToggle").html('Show Filter');
    }
    else if ($("#spnDivToggle").html() == "Show Filter") {
        $("#tblTr").show();
        $("#spnDivToggle").html('Hide Filter');
    }
}
function fnToggleTreeaSub() {
    if ($("#spnDivToggleSub").html() == "Hide Filter") {

        $("#tblTr1").hide();
        $("#spnDivToggleSub").html('Show Filter');
    }
    else if ($("#spnDivToggleSub").html() == "Show Filter") {
        $("#tblTr1").show();
        $("#spnDivToggleSub").html('Hide Filter');
    }
}
function fnSecondarySalesDetails(val) {
    ShowModalPopup("dvloading");
    var regionCode = val.split('_')[0];
    var startMonth = val.split('_')[2];
    var endMonth = val.split('_')[3];
    var startYear = val.split('_')[4];
    var endYear = val.split('_')[5];
    var productCode = val.split('_')[6];


    var days = daysInMonth(endMonth, endYear);
    var startDate = "", endDate = "";
    if (parseInt(startMonth) >= 10) {
        startDate = startYear + "-" + startMonth + "-01";
    }
    else {
        startDate = startYear + "-0" + startMonth + "-01";
    }
    endDate = endYear + "-" + endMonth + "-" + days;
    var dt1 = new Date(startYear + "/" + startMonth + "/01");
    var dt2 = new Date(endYear + "/" + endMonth + "/" + days);

    var diffMonth = monthDiff(startMonth + "/01/" + startYear, endMonth + "/" + days + "/" + endYear);
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetStockistWiseUnderOverStockDetails',
        data: 'regionCode=' + regionCode + '&sd=' + startDate + '&ed=' + endDate + '&ProductCode=' + productCode,
        success: function (response) {
            jsData = eval('(' + response + ')');
            var tableContent = "";
            var divisionName = "";
            $("#divModel").html('');
            if (jsData.Tables[2].Rows.length > 0) {


                tableContent += "<table cellspacing='0' cellpadding='0' width='100%' id='tblUserDetails' class='data display datatable' >";
                tableContent += "<thead><tr>";
                tableContent += "<th colspan='6'>User Details</th>";
                tableContent += "</tr></thead>";
                tableContent += "<tbody>";
                tableContent += "<tr>";
                tableContent += "<td style='text-align:left' >User Name</td>";
                tableContent += "<td style='text-align:left' >" + jsData.Tables[2].Rows[0].User_Name + "</td>";
                tableContent += "<td style='text-align:left' >Division Name</td>";
                var dJsonData = jsonPath(jsData, "$.Tables[3].Rows[?(@.Region_Code=='" + jsData.Tables[2].Rows[0].Region_Code + "')]");
                divisionName = "";
                if (dJsonData != false) {
                    for (var j = 0; j < dJsonData.length; j++) {
                        divisionName += dJsonData[j].Division_Name + ",";
                    }

                    if (divisionName != "") {
                        divisionName = divisionName.substring(0, divisionName.length - 1);
                    }
                    tableContent += "<td style='text-align:left' >" + divisionName + "</td>";
                }
                else {
                    tableContent += "<td style='text-align:left' ></td>";
                }
                tableContent += "<td style='text-align:left' >Manager Name</td>";
                tableContent += "<td style='text-align:left' >" + jsData.Tables[2].Rows[0].Manager_Name + "</td></tr>";

                tableContent += "<tr>";
                tableContent += "<td style='text-align:left' >Employee Name</td>";
                tableContent += "<td style='text-align:left' >" + jsData.Tables[2].Rows[0].Employee_Name + "</td>";
                tableContent += "<td style='text-align:left' >Date of Joining</td>";
                tableContent += "<td style='text-align:left' >" + jsData.Tables[2].Rows[0].DOJ + "</td>";
                tableContent += "<td style='text-align:left' >Manager Territory name</td>";
                tableContent += "<td style='text-align:left' >" + jsData.Tables[2].Rows[0].Manager_Region_Name + "</td></tr>";
                tableContent += "<tr>";
                tableContent += "<td style='text-align:left' >Region Name</td>";
                tableContent += "<td style='text-align:left'  colspan='5'>" + jsData.Tables[2].Rows[0].Region_Name + "</td></tr>";
                tableContent += "</tbody>";
                tableContent += "</table>";
                $("#divHeader").html(tableContent);

                var sales = 0, totalSales = 0;;
                if (jsData.Tables[0].Rows.length > 0) {
                    tableContent = "";
                    tableContent += "<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblSecondarySalesDetails' >";
                    tableContent += "<thead><tr style='display: none;' id='tblTr1'>";
                    tableContent += "<th style='display:none;width: 15%'>User Name</th>";
                    tableContent += "<th style='display:none;width: 15%'>Employee Name</th>";
                    tableContent += "<th style='display:none;width: 15%'>Division Name</th>";
                    tableContent += "<th style='display:none;width: 15%'>Date of Joining</th>";
                    tableContent += "<th style='display:none;width: 15%'>Manager Name</th>";
                    tableContent += "<th style='display:none;width: 15%'>Manager Territory name</th>";
                    tableContent += "<th style='display:none;width: 15%'>Territory Name</th>";

                    tableContent += "<th style='text-align:left;width: 15%' >Stockist Name</th>";
                    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    var dd = new Date(startDate);
                    var current_month = dd.getMonth();
                    for (var k = 0; k < parseInt(diffMonth) ; k++) {
                        tableContent += "<th style='text-align:left;width: 15%'>" + monthNames[current_month] + " - " + dd.getFullYear() + " </th>";
                        dd.setMonth(dd.getMonth() + 1);
                        current_month = dd.getMonth();
                    }

                    tableContent += "<th style='text-align:left;width: 15%'>Average Monthly Secondary Sales Units</th>";
                    tableContent += "</tr>";
                    var iRow = 9;
                    tableContent += "<tr>";
                    tableContent += "<th style='display:none;width: 15%'>User Name</th>";
                    tableContent += "<th style='display:none;width: 15%'>Employee Name</th>";
                    tableContent += "<th style='display:none;width: 15%'>Division Name</th>";
                    tableContent += "<th style='display:none;width: 15%'>Date of Joining</th>";
                    tableContent += "<th style='display:none;width: 15%'>Manager Name</th>";
                    tableContent += "<th style='display:none;width: 15%'>Manager Territory name</th>";
                    tableContent += "<th style='display:none;width: 15%'>Territory Name</th>";
                    tableContent += "<th style='text-align:left;width: 15%'>Stockist Name</th>";
                    var dd = new Date(startDate);
                    var current_month = dd.getMonth();
                    var type = '[{ type: "text" }, { type: "text" }, { type: "text" },{ type: "text" }, { type: "text" }, { type: "text" }, { type: "text" }';
                    type += ',{ type: "text" }';
                    for (var k = 0; k < parseInt(diffMonth) ; k++) {
                        iRow++;
                        tableContent += "<th style='text-align:left;width: 15%'>" + monthNames[current_month] + " - " + dd.getFullYear() + " </th>";
                        dd.setMonth(dd.getMonth() + 1);
                        current_month = dd.getMonth();
                        type += ', { type: "number-range" }';
                    }
                    type += ', { type: "number-range" }]';
                    tableContent += "<th style='text-align:left;width: 15%'>Average Monthly Secondary Sales Units</th>";
                    tableContent += "</tr>";

                    tableContent += "<tr>";
                    tableContent += "<th colspan= '" + iRow + "' style='text-align:left' width='15%' ><span id='spnDivToggleSub' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreeaSub()'>Show Filter</span></th>";
                    tableContent += "</tr>";

                    tableContent += "</thead><tbody>";
                    for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                        tableContent += "<tr>";

                        tableContent += "<td style='display:none;text-align:left;'>" + jsData.Tables[2].Rows[0].User_Name + "</td>";
                        tableContent += "<td style='display:none;text-align:left;'>" + jsData.Tables[2].Rows[0].Employee_Name + "</td>";

                        var dJsonData = jsonPath(jsData, "$.Tables[3].Rows[?(@.Region_Code=='" + jsData.Tables[2].Rows[0].Region_Code + "')]");
                        divisionName = "";
                        if (dJsonData != false) {
                            for (var j = 0; j < dJsonData.length; j++) {
                                divisionName += dJsonData[j].Division_Name + ",";
                            }
                            if (divisionName != "") {
                                divisionName = divisionName.substring(0, divisionName.length - 1);
                            }
                        }


                        tableContent += "<td style='display:none;text-align:left;'>" + divisionName + "</td>";
                        tableContent += "<td style='display:none;text-align:left;'>" + jsData.Tables[2].Rows[0].DOJ + "</td>";
                        tableContent += "<td style='display:none;text-align:left;'>" + jsData.Tables[2].Rows[0].Manager_Name + "</td>";
                        tableContent += "<td style='display:none;text-align:left;'>" + jsData.Tables[2].Rows[0].Manager_Region_Name + "</td>";
                        tableContent += "<td style='display:none;text-align:left;'>" + jsData.Tables[2].Rows[0].Region_Name + "</td>";

                        tableContent += "<td style='text-align:left'>" + jsData.Tables[0].Rows[i].Customer_Name + "</td>";
                        totalSales = 0;
                        var d = new Date(startDate);
                        var current_month = d.getMonth();
                        for (var k = 0; k < parseInt(diffMonth) ; k++) {
                            sales = 0;
                            var dJson = jsonPath(jsData, "$.Tables[1].Rows[?(@.Month=='" + (d.getMonth() + 1) + "' & @.Year=='" + d.getFullYear() + "' & @.Base_Code=='" + jsData.Tables[0].Rows[i].Customer_Code + "')]");
                            if (dJson != false) {
                                for (var j = 0; j < dJson.length; j++) {
                                    sales += parseInt(dJson[j].Sales);
                                    totalSales += parseInt(dJson[j].Sales);
                                }
                            }

                            d.setMonth(d.getMonth() + 1);
                            current_month = d.getMonth();
                            tableContent += "<td style='text-align:center'>" + sales + "</td>";
                        }

                        if (totalSales > 0) {
                            var avg = (totalSales / diffMonth);
                            tableContent += "<td style='text-align:center'>" + Math.round(avg * 100) / 100 + "</td>";
                        }
                        else {
                            tableContent += "<td style='text-align:center'>0</td>";
                        }
                        tableContent += "</tr>";
                    }
                    tableContent += "</tbody>";
                    tableContent += "</table>";
                    $("#divModel").html(tableContent);
                    $("#divsubPrint").html(tableContent);
                    var jsonType = eval(type);
                    if ($.fn.dataTable) {
                        $('#tblSecondarySalesDetails').dataTable({
                            "sPaginationType": "full_numbers", "bSort": false, "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                        }).columnFilter({
                            sPlaceHolder: "head:after",
                            aoColumns: jsonType
                        });
                    };

                    if (tableContent != "") {
                        $("#divInput").slideUp();
                        $("#spnInputToggle").html("Show Input");
                    }
                    fninializePrint("divsubPrint", "ifrmsubPrint", "divModel");
                    ShowModalPopup('modal');
                    HideModalPopup("dvloading");
                }
            }
            else {

                fnMsgAlert('info', 'Stockist Wise Under Over Stock', 'No Data found.');
                HideModalPopup("dvloading");
            }

        },
        error: function () {


            HideModalPopup("dvloading");
        }
    });
}

function fnSecSalesStockiestWiseReport() {
    debugger;
    $('#regiontree').hide();
    $("#spnTreeToggle").html('Show Tree');
    $('#leftNav').removeClass('col-xs-5');
    $('#leftNav').removeClass('col-xs-4');
    $('#leftNav').removeClass('col-xs-3');
    $("#divMain").removeClass('col-xs-9');
    $("#divMain").removeClass('col-xs-8');
    $("#divMain").removeClass('col-xs-7');
    $("#divMain").addClass('col-xs-12');

    $("#divReport").hide();

    var regionCode = $('#hdnRegionCode').val();
    var startMonth = fngetMonthNumber($('#txtFrom').val().split('-')[0]);
    var endMonth = fngetMonthNumber($('#txtTo').val().split('-')[0]);
    var startYear = $('#txtFrom').val().split('-')[1];
    var endYear = $('#txtTo').val().split('-')[1];
    ShowModalPopup("dvloading");
    if ($("#txtFrom").val() == "") {
        fnMsgAlert('info', 'Secondary Sales Stockist Wise Report', 'Please enter Start month.');
        HideModalPopup("dvloading");
        return false;
    }
    if ($("#txtTo").val() == "") {
        fnMsgAlert('info', 'Secondary Sales Stockist Wise Report', 'Please enter End month.');
        HideModalPopup("dvloading");
        return false;
    }
    var days = daysInMonth(endMonth, endYear);
    var startDate = "", endDate = "";
    if (parseInt(startMonth) >= 10) {
        startDate = startYear + "-" + startMonth + "-01";
    }
    else {
        startDate = startYear + "-0" + startMonth + "-01";
    }
    endDate = endYear + "-" + endMonth + "-" + days;
    var dt1 = new Date(startYear + "/" + startMonth + "/01");
    var dt2 = new Date(endYear + "/" + endMonth + "/" + days);
    if (dt1 > dt2) {
        fnMsgAlert('info', 'Secondary Sales Stockist Wise Report', 'Start Month&Year should be less than End Month&Year.');
        HideModalPopup("dvloading");
        return false;
    }
    var productCodes = "";
    var productCode = new Array();
    if ($("#ddlProductName").val() != null) {
        for (var index = 0; index < $("#ddlProductName").val().length; index++) {
            productCodes += $("#ddlProductName").val()[index] + "^";
        }
    }


    if (productCodes == "") {
        fnMsgAlert('info', 'Secondary Sales Stockist Wise Report', 'Select atleast one product.');
        HideModalPopup("dvloading");
        return false;
    }
   

    var reportViewType = $("input:radio[name=rptOptions]:checked").val();

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ReportsLevelTwo/GetstockiestwiseSSReport',
        data: 'regionCode=' + regionCode + '&productCodes=' + productCodes + '&startDate=' + startDate + '&endDate=' + endDate + '&viewOption=' + reportViewType,
        success: function (response) {
            if (response != null && response != "") {
                
                $("#divReport").show();
                $("#divReport").html('');
                $("#divReport").html(response);                
                HideModalPopup("dvloading");
            }
            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Secondary Sales Stockist Wise Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

function fnSecSalesStockiestWiseOldReport() {
    debugger;
    $('#regiontree').hide();
    $("#spnTreeToggle").html('Show Tree');
    $('#leftNav').removeClass('col-xs-5');
    $('#leftNav').removeClass('col-xs-4');
    $('#leftNav').removeClass('col-xs-3');
    $("#divMain").removeClass('col-xs-9');
    $("#divMain").removeClass('col-xs-8');
    $("#divMain").removeClass('col-xs-7');
    $("#divMain").addClass('col-xs-11');

   $("#divReport").hide();

    var regionCode = $('#hdnRegionCode').val();
    var startMonth = fngetMonthNumber($('#txtFrom').val().split('-')[0]);
    var endMonth = fngetMonthNumber($('#txtTo').val().split('-')[0]);
    var startYear = $('#txtFrom').val().split('-')[1];
    var endYear = $('#txtTo').val().split('-')[1];
    ShowModalPopup("dvloading");
    if ($("#txtFrom").val() == "") {
        fnMsgAlert('info', 'Secondary Sales Stockist Wise Report', 'Please enter Start month.');
        HideModalPopup("dvloading");
        return false;
    }
    if ($("#txtTo").val() == "") {
        fnMsgAlert('info', 'Secondary Sales Stockist Wise Report', 'Please enter End month.');
        HideModalPopup("dvloading");
        return false;
    }
    var days = daysInMonth(endMonth, endYear);
    var startDate = "", endDate = "";
    if (parseInt(startMonth) >= 10) {
        startDate = startYear + "-" + startMonth + "-01";
    }
    else {
        startDate = startYear + "-0" + startMonth + "-01";
    }
    endDate = endYear + "-" + endMonth + "-" + days;
    var dt1 = new Date(startYear + "/" + startMonth + "/01");
    var dt2 = new Date(endYear + "/" + endMonth + "/" + days);
    if (dt1 > dt2) {
        fnMsgAlert('info', 'Secondary Sales Stockist Wise Report', 'Start Month&Year should be less than End Month&Year.');
        HideModalPopup("dvloading");
        return false;
    }
    var productCodes = "";
    var stockiestCodes = "";
    var productCode = new Array();
    if ($("#ddlProductName").val() != null) {
        for (var index = 0; index < $("#ddlProductName").val().length; index++) {
            productCodes += $("#ddlProductName").val()[index] + "^";
        }
    }

    if (productCodes == "") {
        fnMsgAlert('info', 'Secondary Sales Stockist Wise Report', 'Select atleast one product.');
        HideModalPopup("dvloading");
        return false;
    }

    var stockiestCode = new Array();
    if ($("#ddlStockiestName").val() != null) {
        for (var index = 0; index < $("#ddlStockiestName").val().length; index++) {
            stockiestCodes += $("#ddlStockiestName").val()[index] + "^";
        }
    }

    if (stockiestCodes == "") {
        fnMsgAlert('info', 'Secondary Sales Stockist Wise Report', 'Select atleast one Stockiest.');
        HideModalPopup("dvloading");
        return false;
    }

    var reportViewType = $("input:radio[name=rptOptions]:checked").val();
    //GET OPTIONS
    if ($('#optViewInScreen').attr('checked') == "checked") {
        reportViewType = "S";
    }
    else {
        reportViewType = "E";
    }
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ReportsLevelTwo/GetstockiestwiseSSOldReport',
        data: 'regionCode=' + regionCode + '&productCodes=' + productCodes + '&stockiestCodes=' + stockiestCodes + '&startDate=' + startDate + '&endDate=' + endDate + '&viewOption=' + reportViewType,
        success: function (response) {
            debugger;
            if (response != null && response != "") {

                $("#divReport").show();
                $("#divReport").html('');
                $("#divReport").html(response);
                $("#divstockiestPrint").html(response);
                if (reportViewType == "E") {
                    $("#dvPrint").hide();
                }
                else {
                    $("#dvPrint").show();
                }

                fninializePrint("divstockiestPrint", "ifrmuserperday", "divReport");
                HideModalPopup("dvloading");
            }
            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Secondary Sales Stockist Wise Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}


function addCommas(nStr) {
    nStr += ''; x = nStr.split('.'); x1 = x[0]; x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) { x1 = x1.replace(rgx, '$1' + ',' + '$2'); }
    return x1 + x2;
}
//******************************************StockistWise UnderOver Stock SS Product Multi Selection ********************************************************//
function fnStockistWiseUnderOverStockReport() {

    var startMonth = fngetMonthNumber($('#txtFromDate').val().split('-')[0]);
    var endMonth = fngetMonthNumber($('#txtToDate').val().split('-')[0]);
    var startYear = $('#txtFromDate').val().split('-')[1];
    var endYear = $('#txtToDate').val().split('-')[1];

    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'Stockist Wise Under Over Stock Report', 'Please enter Start month.');
        HideModalPopup("dvloading");
        return false;
    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'Stockist Wise Under Over Stock Report', 'Please enter End month.');
        HideModalPopup("dvloading");
        return false;
    }
    var days = daysInMonth(endMonth, endYear);
    var startDate = "", endDate = "";
    if (parseInt(startMonth) >= 10) {
        startDate = startYear + "-" + startMonth + "-01";
    }
    else {
        startDate = startYear + "-0" + startMonth + "-01";
    }
    endDate = endYear + "-" + endMonth + "-" + days;
    var dt1 = new Date(startYear + "/" + startMonth + "/01");
    var dt2 = new Date(endYear + "/" + endMonth + "/" + days);
    if (dt1 > dt2) {
        fnMsgAlert('info', 'Stockist Wise Under Over Stock Report', 'Start Month&Year should be less than End Month&Year.');
        HideModalPopup("dvloading");
        return false;
    }
    if ($("#ddlProductName").val() == "0") {
        fnMsgAlert('info', 'Stockist Wise Under Over Stock Report', 'Select  product.');
        HideModalPopup("dvloading");
        return false;
    }
    $("#MonthName").html('')
    var DatePeriod = 'Period :' + $('#txtFromDate').val().split('-')[0] + " " + $('#txtFromDate').val().split('-')[1] + " To " + $('#txtToDate').val().split('-')[0] + " " + $('#txtToDate').val().split('-')[1] + "";
    $("#MonthName").html(DatePeriod);
    var productCodes = "";

    if ($("#ddlProductName").val() != null) {
        for (var index = 0; index < $("#ddlProductName").val().length; index++) {
            productCodes += "'" + $("#ddlProductName").val()[index] + "',";
        }
    }
    if (productCodes != "") {
        productCodes = productCodes.substring(0, productCodes.length - 1);
    }
    else {
        fnMsgAlert('info', 'Stockist Wise Under Over Stock Report', 'Select  product.');
        HideModalPopup("dvloading");
        return false;
    }


    var diffMonth = monthDiff(startMonth + "/01/" + startYear, endMonth + "/" + days + "/" + endYear);
    ShowModalPopup("dvloading");
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ReportsLevelTwo/GetStockistWiseUnderOverStockReport',
        data: 'regionCode=' + $('#hdnRegionCode').val() + '&sd=' + startDate + '&ed=' + endDate + '&ProductCode=' + productCodes,
        success: function (response) {
            jsData = eval('(' + response + ')');
            var tableContent = "";
            var sales = 0, close = 0, reionTotal = 0, totalsummary = 0, productWiseSales = 0;;
            var salesEndMonth = 0, closingEndMonth = 0, noOfDaysStock = 0;
            var totalSalesEndMonth = 0, totalClosingEndMonth = 0, TotalNoOfDaysStock = 0;
            var endMonthSales = 0, EndMonthClosing = 0, monthSales = 0;
            var endMonthProductWiseSales = 0, endMonthProClosing = 0;
            var regionAvg = 0.0, totalAvg = 0.0, avg = 0.0;
            var isRegionNameBind = true;
            if (jsData.Tables[0].Rows.length > 0) {
                tableContent = "";
                tableContent += "<table cellspacing='0' cellpadding='0' width='100%' id='tblSalesAndActivity' class='data display datatable' >";
                tableContent += "<thead>";
                tableContent += "<tr style='display: none;' id='tblTr'>";
                tableContent += "<th style='width: 15%'>User Name</th>";
                tableContent += "<th style='width: 15%'>Employee Name</th>";
                tableContent += "<th style='width: 15%'>Date of Joining</th>";
                tableContent += "<th style='width: 15%'>Manager Name</th>";
                tableContent += "<th style='width: 15%'>Manager Territory name</th>";
                tableContent += "<th style='text-align:left;width: 15%'>Product Name</th>";
                tableContent += "<th style='text-align:left;width: 15%'>Territory Name</th>";
                tableContent += "<th style='text-align:left;width: 15%'>Division Name</th>";
                tableContent += "<th style='text-align:left;width: 15%'>Stockist Name</th>";
                tableContent += "<th style='text-align:left;width: 15%'>Average Monthly Secondary Sales Units</th>";
                tableContent += "<th style='text-align:left;width: 15%'>% To Total Units</th>";
                tableContent += "<th style='text-align:left;width: 15%'>Secondary Sales Units for the month - (" + $('#txtToDate').val().split('-')[0] + "-" + $('#txtToDate').val().split('-')[1] + ")</th>";
                tableContent += "<th style='text-align:left;width: 15%'>Closing Units for the month - (" + $('#txtToDate').val().split('-')[0] + "-" + $('#txtToDate').val().split('-')[1] + ")</th>";
                tableContent += "<th style='text-align:left;width: 15%'>No of Days Stock</th>";
                tableContent += "</tr>";


                tableContent += "<tr>";

                tableContent += "<th style='width: 15%'>User Name</th>";
                tableContent += "<th style='width: 15%'>Employee Name</th>";
                tableContent += "<th style='width: 15%'>Date of Joining</th>";
                tableContent += "<th style='width: 15%'>Manager Name</th>";
                tableContent += "<th style='width: 15%'>Manager Territory name</th>";

                tableContent += "<th style='text-align:left;width: 15%'>Product Name</th>";
                tableContent += "<th style='text-align:left;width: 15%'>Territory Name</th>";
                tableContent += "<th style='text-align:left;width: 15%'>Division Name</th>";
                tableContent += "<th style='text-align:left;width: 15%'>Stockist Name</th>";
                tableContent += "<th style='text-align:left;width: 15%'>Average Monthly Secondary Sales Units</th>";
                tableContent += "<th style='text-align:left;width: 15%'>% To Total Units</th>";
                tableContent += "<th style='text-align:left;width: 15%'>Secondary Sales Units for the month - (" + $('#txtToDate').val().split('-')[0] + "-" + $('#txtToDate').val().split('-')[1] + " )</th>";
                tableContent += "<th style='text-align:left;width: 15%'>Closing Units for the month - (" + $('#txtToDate').val().split('-')[0] + "-" + $('#txtToDate').val().split('-')[1] + ")</th>";
                tableContent += "<th style='text-align:left;width: 15%'>No of Days Stock</th>";
                tableContent += "</tr>";

                tableContent += "<tr >";
                tableContent += "<th colspan= '14' style='text-align:left' width='15%' ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreea()'>Show Filter</span></th>";
                tableContent += "</tr>";
                var type = '[{ type: "text" }, { type: "text" }, { type: "text" },{ type: "text" }, { type: "text" }, { type: "text" }';
                type += ',{ type: "text" }, { type: "text" },{ type: "number-range" }';
                type += ', { type: "number-range" }, { type: "number-range" }, { type: "number-range" }, { type: "number-range" }]';


                tableContent += "</thead><tbody>";
                // Summary Value           
                for (var i = 0; i < jsData.Tables[3].Rows.length; i++) {
                    var dJsonDataH = jsonPath(jsData, "$.Tables[1].Rows[?(@.Region_Code=='" + jsData.Tables[3].Rows[i].Region_Code + "')]");
                    if (dJsonDataH != false) {
                        for (var j = 0; j < dJsonDataH.length; j++) {
                            var dJsonData = jsonPath(jsData, "$.Tables[2].Rows[?(@.Region_Code=='" + jsData.Tables[3].Rows[i].Region_Code + "' & @.Base_Code=='" + dJsonDataH[j].Customer_Code + "')]");
                            if (dJsonData != false) {
                                for (var k = 0; k < dJsonData.length; k++) {
                                    totalsummary = totalsummary + parseInt(dJsonData[k].Sales);
                                }
                            }
                        }
                    }
                }

                if (jsData.Tables[3].Rows.length > 0) {
                    for (var i = 0; i < jsData.Tables[3].Rows.length; i++) {
                        var dJsonDataH = jsonPath(jsData, "$.Tables[1].Rows[?(@.Region_Code=='" + jsData.Tables[3].Rows[i].Region_Code + "')]");
                        if (dJsonDataH != false) {
                            reionTotal = 0;
                            monthSales = 0;
                            for (var j = 0; j < dJsonDataH.length; j++) {
                                var dJsonData = jsonPath(jsData, "$.Tables[2].Rows[?(@.Region_Code=='" + jsData.Tables[3].Rows[i].Region_Code + "' & @.Base_Code=='" + dJsonDataH[j].Customer_Code + "')]");
                                if (dJsonData != false) {
                                    for (var k = 0; k < dJsonData.length; k++) {
                                        reionTotal += parseInt(dJsonData[k].Sales);
                                    }
                                }
                            }
                            for (var j = 0; j < jsData.Tables[0].Rows.length; j++) {
                                isRegionNameBind = true;
                                productWiseSales = 0;
                                var dJsonDataPro = jsonPath(jsData, "$.Tables[2].Rows[?(@.Region_Code=='" + jsData.Tables[3].Rows[i].Region_Code + "'  & @.Product_Code=='" + jsData.Tables[0].Rows[j].Product_Code + "')]");
                                if (dJsonDataPro != false) {
                                    for (var l = 0; l < dJsonDataPro.length; l++) {
                                        productWiseSales += parseInt(dJsonDataPro[l].Sales);

                                    }
                                }
                                for (var k = 0; k < dJsonDataH.length; k++) {
                                    tableContent += "<tr>";
                                    sales = 0.0;
                                    close = 0.0;
                                    if (isRegionNameBind) {
                                        var dJsonDataDiv = jsonPath(jsData, "$.Tables[4].Rows[?(@.Region_Code=='" + jsData.Tables[3].Rows[i].Region_Code + "')]");
                                        divisionName = "";
                                        if (dJsonDataDiv != false) {
                                            for (var index = 0; index < dJsonDataDiv.length; index++) {
                                                divisionName += dJsonDataDiv[index].Division_Name + ",";
                                            }
                                            if (divisionName != "") {
                                                divisionName = divisionName.substring(0, divisionName.length - 1);
                                            }
                                        }
                                        tableContent += "<td>" + jsData.Tables[3].Rows[i].User_Name + "</td>";
                                        tableContent += "<td>" + jsData.Tables[3].Rows[i].Employee_Name + "</td>";
                                        tableContent += "<td>" + jsData.Tables[3].Rows[i].DOJ + "</td>";
                                        tableContent += "<td>" + jsData.Tables[3].Rows[i].Manager_Name + "</td>";
                                        tableContent += "<td>" + jsData.Tables[3].Rows[i].Manager_Region_Name + "</td>";
                                        tableContent += "<td  style='text-align:left'>" + jsData.Tables[0].Rows[j].Product_Name + "</td>";
                                        tableContent += "<td align='left' onclick='fnSecondarySalesDetails(\"" + jsData.Tables[3].Rows[i].Region_Code + "_" + jsData.Tables[3].Rows[i].User_Code + "_" + startMonth + "_" + endMonth + "_" + startYear + "_" + endYear + "_" + jsData.Tables[0].Rows[j].Product_Code + "\")' style='text-decoration:underline;cursor:pointer'>" + jsData.Tables[3].Rows[i].Region_Name + "</td>";
                                        tableContent += "<td  style='text-align:left'>" + divisionName + "</td>";
                                    }
                                    else {
                                        tableContent += "<td></td>";
                                        tableContent += "<td></td>";
                                        tableContent += "<td></td>";
                                        tableContent += "<td></td>";
                                        tableContent += "<td></td>";
                                        tableContent += "<td style='text-align:left'></td>";
                                        tableContent += "<td style='text-align:left'></td>";
                                        tableContent += "<td style='text-align:left'></td>";
                                    }
                                    tableContent += "<td align='left' >" + dJsonDataH[k].Customer_Name + "</td>";
                                    var dJsonData = jsonPath(jsData, "$.Tables[2].Rows[?(@.Region_Code=='" + jsData.Tables[3].Rows[i].Region_Code + "' & @.Base_Code=='" + dJsonDataH[k].Customer_Code + "' & @.Product_Code=='" + jsData.Tables[0].Rows[j].Product_Code + "')]");
                                    if (dJsonData != false) {
                                        for (var index = 0; index < dJsonData.length; index++) {
                                            sales += parseInt(dJsonData[index].Sales);
                                            close += parseInt(dJsonData[index].Closing_Stock);

                                        }
                                    }
                                    endMonthSales = 0;
                                    EndMonthClosing = 0;
                                    var dJson = jsonPath(jsData, "$.Tables[2].Rows[?(@.Month=='" + endMonth + "' & @.Year=='" + endYear + "' & @.Base_Code=='" + dJsonDataH[k].Customer_Code + "' & @.Region_Code=='" + jsData.Tables[3].Rows[i].Region_Code + "' & @.Product_Code=='" + jsData.Tables[0].Rows[j].Product_Code + "')]");
                                    if (dJson != false) {
                                        for (var index = 0; index < dJson.length; index++) {
                                            endMonthSales += parseInt(dJson[index].Sales);
                                            EndMonthClosing += parseInt(dJson[index].Closing_Stock);
                                        }
                                    }
                                    avg = 0.0;
                                    if (sales > 0) {
                                        avg = (sales / diffMonth);
                                        tableContent += "<td style='text-align:center'>" + Math.round(avg * 100) / 100 + "</td>";
                                    }
                                    else {
                                        tableContent += "<td style='text-align:center'>0</td>";
                                    }
                                    if (avg > 0) {
                                        regionAvg = (parseFloat(productWiseSales) / parseFloat(diffMonth));
                                        avg = (avg / regionAvg) * 100;
                                        tableContent += "<td style='text-align:center'>" + Math.round(avg * 100) / 100 + "</td>";
                                    }
                                    else {
                                        tableContent += "<td style='text-align:center'>0</td>";
                                    }

                                    salesEndMonth += endMonthSales;
                                    closingEndMonth += EndMonthClosing;
                                    endMonthProductWiseSales += endMonthSales;
                                    endMonthProClosing += EndMonthClosing;

                                    tableContent += "<td style='text-align:center'>" + endMonthSales + "</td>";
                                    tableContent += "<td style='text-align:center'>" + EndMonthClosing + "</td>";
                                    if (endMonthSales > 0) {
                                        avg = ((EndMonthClosing * 30) / endMonthSales);
                                        tableContent += "<td style='text-align:center'>" + Math.round(avg * 100) / 100 + "</td></tr>";
                                    }
                                    else {
                                        tableContent += "<td style='text-align:center'>0</td>";
                                    }
                                    tableContent += "</tr>"
                                    isRegionNameBind = false;
                                }

                                //  Product Wise

                                tableContent += "<tr>"

                                tableContent += "<td></td>";
                                tableContent += "<td></td>";
                                tableContent += "<td></td>";
                                tableContent += "<td></td>";
                                tableContent += "<td></td>";
                                tableContent += "<td style='text-align:center;background-color:#D6D8D9;' ></td>";
                                tableContent += "<td style='text-align:center;background-color:#D6D8D9;'></td>";
                                tableContent += "<td style='text-align:center;background-color:#D6D8D9;' >" + jsData.Tables[3].Rows[i].Region_Name + " - Total</td>";
                                tableContent += "<td style='text-align:left;background-color:#D6D8D9;'>(" + jsData.Tables[0].Rows[j].Product_Name + ")</td>";
                                var totalAvg = 0;
                                if (reionTotal > 0) {
                                    totalAvg = (productWiseSales / diffMonth)
                                    tableContent += "<td style='text-align:center;background-color:#D6D8D9;'>" + Math.round(totalAvg * 100) / 100 + "</td>";
                                }
                                else {
                                    tableContent += "<td style='text-align:center;background-color:#D6D8D9;'>0</td>";
                                }
                                if (totalAvg > 0) {

                                    regionAvg = (parseFloat(reionTotal) / parseFloat(diffMonth));
                                    var avg = (totalAvg / regionAvg) * 100;
                                    tableContent += "<td style='text-align:center;background-color:#D6D8D9;'>" + Math.round(avg * 100) / 100 + "</td>";
                                }
                                else {
                                    tableContent += "<td style='text-align:center;background-color:#D6D8D9;'>0</td>";
                                }
                                tableContent += "<td style='text-align:center;background-color:#D6D8D9;'>" + endMonthProductWiseSales + "</td>";
                                tableContent += "<td style='text-align:center;background-color:#D6D8D9;'>" + endMonthProClosing + "</td>";

                                if (endMonthProductWiseSales > 0) {
                                    var avg = ((endMonthProClosing * 30) / endMonthProductWiseSales);
                                    tableContent += "<td style='text-align:center;background-color:#D6D8D9;'>" + Math.round(avg * 100) / 100 + "</td>";
                                }
                                else {
                                    tableContent += "<td style='text-align:center;background-color:#D6D8D9;'>0</td>";
                                }
                                tableContent += "</tr>";
                                endMonthProductWiseSales = 0;
                                endMonthProClosing = 0;

                            }

                            tableContent += "<tr>"

                            tableContent += "<td></td>";
                            tableContent += "<td></td>";
                            tableContent += "<td></td>";
                            tableContent += "<td></td>";
                            tableContent += "<td></td>";
                            tableContent += "<td style='text-align:center;background-color:#C0C0C0;' ></td>";
                            tableContent += "<td style='text-align:center;background-color:#C0C0C0;'></td>";
                            tableContent += "<td style='text-align:center;background-color:#C0C0C0;' >" + jsData.Tables[3].Rows[i].Region_Name + " - Total</td>";
                            tableContent += "<td style='text-align:center;background-color:#C0C0C0;'></td>";
                            var totalAvg = 0;
                            if (totalsummary > 0) {
                                totalAvg = (reionTotal / diffMonth)
                                tableContent += "<td style='text-align:center;background-color:#C0C0C0;'>" + Math.round(totalAvg * 100) / 100 + "</td>";
                            }
                            else {
                                tableContent += "<td style='text-align:center;background-color:#C0C0C0;'>0</td>";
                            }
                            if (totalAvg > 0) {

                                regionAvg = (parseFloat(totalsummary) / parseFloat(diffMonth));
                                var avg = (totalAvg / regionAvg) * 100;
                                tableContent += "<td style='text-align:center;background-color:#C0C0C0;'>" + Math.round(avg * 100) / 100 + "</td>";
                            }
                            else {
                                tableContent += "<td style='text-align:center;background-color:#C0C0C0;'>0</td>";
                            }
                            tableContent += "<td style='text-align:center;background-color:#C0C0C0;'>" + salesEndMonth + "</td>";
                            tableContent += "<td style='text-align:center;background-color:#C0C0C0;'>" + closingEndMonth + "</td>";
                            totalClosingEndMonth += closingEndMonth;
                            totalSalesEndMonth += salesEndMonth;
                            if (salesEndMonth > 0) {
                                var avg = ((closingEndMonth * 30) / salesEndMonth);
                                tableContent += "<td style='text-align:center;background-color:#C0C0C0;'>" + Math.round(avg * 100) / 100 + "</td>";
                            }
                            else {
                                tableContent += "<td style='text-align:center;background-color:#C0C0C0;'>0</td>";
                            }
                            tableContent += "</tr>";

                            salesEndMonth = 0;
                            closingEndMonth = 0;
                        }
                    }
                    tableContent += "<tr>"

                    tableContent += "<th  ></th>";
                    tableContent += "<th ></th>";
                    tableContent += "<th ></th>";
                    tableContent += "<th></th>";
                    tableContent += "<th ></th>";
                    tableContent += "<th style='text-align:right'></th>";
                    tableContent += "<th style='text-align:right'></th>";
                    tableContent += "<th style='text-align:right'></th>";
                    tableContent += "<th style='text-align:right'>Total :</th>";
                    if (totalsummary > 0) {
                        var avg = (totalsummary / diffMonth);
                        tableContent += "<th style='text-align:center'>" + Math.round(avg * 100) / 100 + "</th>";
                    }
                    else {
                        tableContent += "<th style='text-align:center'>0</th>";
                    }
                    tableContent += "<th style='text-align:center'></th>";
                    tableContent += "<th style='text-align:center'>" + totalSalesEndMonth + "</th>";
                    tableContent += "<th style='text-align:center'>" + totalClosingEndMonth + "</th>";
                    if (totalSalesEndMonth > 0) {
                        var avg = ((totalClosingEndMonth * 30) / totalSalesEndMonth);
                        tableContent += "<th style='text-align:center'>" + Math.round(avg * 100) / 100 + "</th>";
                    }
                    else {
                        tableContent += "<th style='text-align:center'>0</th>";
                    }
                    tableContent += "</tr>";
                }

                tableContent += "</tbody>";
                tableContent += "<tbody><tfoot>";
                tableContent += "<tr>";
                tableContent += "<th></th>";
                tableContent += "<th></th>";
                tableContent += "<th></th>";
                tableContent += "<th></th>";
                tableContent += "<th></th>";
                tableContent += "<th></th>";
                tableContent += "<th></th>";
                tableContent += "<th></th>";
                tableContent += "<th></th>";
                tableContent += "<th></th>";
                tableContent += "<th>Total</th>";
                tableContent += "<th></th>";
                tableContent += "<th></th>";
                tableContent += "<th></th>";
                tableContent += "</tr>";
                tableContent += "</tfoot>";
                tableContent += "</tbody>";
                tableContent += "</table>";
            }
            $("#divReport").html(tableContent);
            $("#divPrint").html(DatePeriod + tableContent);
            var jsonType = eval(type);
            if ($.fn.dataTable) {
         
                $('#tblSalesAndActivity').dataTable({
                    "sPaginationType": "full_numbers",
                    "fnFooterCallback": function (nRow, aaData, iStart, iEnd, aiDisplay) {
                        var averageMonthly = 0; var toTotalUnits = 0; var startmonth = 0; var endmonth = 0; var no = 0;
                        var totalaverageMonthly = 0; var totaltoTotalUnits = 0; var totalstartmonth = 0; var totalendmonth = 0; var totalno = 0;
                        for (var i = 0; i < aaData.length; i++) {
                            //averageMonthly += parseFloat(aaData[i][4].replace(',', '')); toTotalUnits += parseFloat(aaData[i][5].replace(',', ''));
                            startmonth += parseFloat(aaData[i][11].replace(',', '')); endmonth += parseFloat(aaData[aiDisplay[i]][12].replace(',', ''));
                            no += parseFloat(aaData[aiDisplay[i]][13].replace(',', ''));
                        }
                        var pageTotal_costs = 0; var pageTotal_count = 0;
                        for (var i = iStart; i < iEnd; i++) {
                            // totalaverageMonthly += parseFloat(aaData[aiDisplay[i]][4].replace(',', '')); totaltoTotalUnits += parseFloat(aaData[aiDisplay[i]][5].replace(',', ''));
                            totalstartmonth += parseFloat(aaData[aiDisplay[i]][11].replace(',', '')); totalendmonth += parseFloat(aaData[aiDisplay[i]][12].replace(',', ''));
                            totalno += parseFloat(aaData[aiDisplay[i]][13].replace(',', ''));
                        }
                        var ncell = nRow.getElementsByTagName('th');
                        //var nCells = nRow.getElementsByTagName('th');
                        // ncell[4].innerHTML = addCommas(totalaverageMonthly.toFixed(2)) + '<br/>(' + addCommas(averageMonthly.toFixed(2)) + ')';
                        //  ncell[5].innerHTML = '' + addCommas(totaltoTotalUnits.toFixed(2)) + '<br/>(' + addCommas(toTotalUnits.toFixed(2)) + ')';
                        ncell[11].innerHTML = '' + addCommas(totalstartmonth.toFixed(2)) + '<br/>(' + addCommas(startmonth.toFixed(2)) + ')';
                        ncell[12].innerHTML = '' + addCommas(totalendmonth.toFixed(2)) + '<br/>(' + addCommas(endmonth.toFixed(2)) + ')';
                        ncell[13].innerHTML = '' + addCommas(totalno.toFixed(2)) + '<br/>(' + addCommas(no.toFixed(2)) + ')';
                    },





                    "bSort": false, "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                }).columnFilter({
                    sPlaceHolder: "head:after",
                    aoColumns: jsonType
                });
            };
            $('#dvPrint').remove();
            fninializePrint("divPrint", "ifrmPrint", "divReport");
            if (tableContent != "") {
                $("#divInput").slideUp();
                $("#spnInputToggle").html("Show Input");
            }

            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Stockist Wise Under Over Stock Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

function addCommas(nStr) {
    nStr += ''; x = nStr.split('.'); x1 = x[0]; x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) { x1 = x1.replace(rgx, '$1' + ',' + '$2'); }
    return x1 + x2;
}

function fnSecondarySalesTrendAnalysisNew() {
    var month = $('input:radio[name=Selection]:checked').val();
    ShowModalPopup("dvloading");
    var monthList = new Array();


    var startMonth = fngetMonthNumber($('#txtFromDate').val().split('-')[0]);
    var endMonth = fngetMonthNumber($('#txtToDate').val().split('-')[0]);
    var startYear = $('#txtFromDate').val().split('-')[1];
    var endYear = $('#txtToDate').val().split('-')[1];

    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'Secondary Sales Trend Analysis Report', 'Please enter Start month.');
        HideModalPopup("dvloading");
        return false;
    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'Secondary Sales Trend Analysis Report', 'Please enter End month.');
        HideModalPopup("dvloading");
        return false;
    }
    var days = daysInMonth(endMonth, endYear);
    var startDate = "", endDate = "";
    if (parseInt(startMonth) >= 10) {
        startDate = startYear + "-" + startMonth + "-01";
    }
    else {
        startDate = startYear + "-0" + startMonth + "-01";
    }

    if (parseInt(endMonth) >= 10) {
        endDate = endYear + "-" + endMonth + "-" + days;
    }
    else {
        endDate = endYear + "-0" + endMonth + "-" + days;
    }
    var dt1 = new Date(startYear + "/" + startMonth + "/01");
    var dt2 = new Date(endYear + "/" + endMonth + "/" + days);
    if (dt1 > dt2) {
        fnMsgAlert('info', 'Secondary Sales Trend Analysis Report', 'Start Month&Year should be less than End Month&Year.');
        HideModalPopup("dvloading");
        return false;
    }
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    var datePeriod = 'Period :' + $('#txtFromDate').val().split('-')[0] + " " + $('#txtFromDate').val().split('-')[1] + " To " + $('#txtToDate').val().split('-')[0] + " " + $('#txtToDate').val().split('-')[1] + "";
    $("#MonthName").html(datePeriod);
    var dd = new Date(startDate);
    var diffMonth = monthDiff(startDate, endDate);
    var monthCount = 0;
    var current_month = dd.getMonth();
    for (var k = 0; k < parseInt(diffMonth) ; k++) {
        monthList.push(monthNames[current_month] + "_" + (dd.getMonth() + 1) + "_" + dd.getFullYear());
        dd.setMonth(dd.getMonth() + 1);
        current_month = dd.getMonth();
        monthCount++;
    }
    if ($("#ddlProductName").val() == "0") {
        fnMsgAlert('info', 'Secondary Sales Trend Analysis Report', 'Select  product.');
        HideModalPopup("dvloading");
        return false;
    }
    var productCodes = "";
    if ($("#ddlProductName").val() != null) {
        for (var index = 0; index < $("#ddlProductName").val().length; index++) {
            productCodes += "'" + $("#ddlProductName").val()[index] + "',";
        }
    }
    if (productCodes != "") {
        productCodes = productCodes.substring(0, productCodes.length - 1);
    }
    else {
        fnMsgAlert('info', 'Secondary Sales Trend Analysis Report', 'Select  product.');
        HideModalPopup("dvloading");
        return false;
    }
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ReportsLevelTwo/GetSecondarySalesTrendAnalysisNew',
        data: 'regionCode=' + $('#hdnRegionCode').val() + '&sd=' + startDate + '&ed=' + endDate + '&ProductCode=' + productCodes,
        success: function (response) {
            jsData = eval('(' + response + ')');
            var tableContent = "", monthName = "";
            var tableContentRatio = "", tableContentSales = "", tableContentClose = "";
            var quterCount = 0, quter = 0, sales = 0, close = 0, monthClosing = 0;
            var monthSales = 0, halfSales = 0, totalSales = 0, totalClosing = 0, totalRatio = 0, halfClose = 0;
            var avg = 0.0;
            var isRegionNameBind = true;
            var isStockiestNameBind = true;
            if (jsData.Tables[0].Rows.length > 0) {

                tableContent = "";
                tableContent += "<table cellspacing='0' cellpadding='0' width='100%' id='tblSalesAndActivity' class='data display datatable' >";
                tableContent += "<thead>";

                var iRow = 0, rowNo = 0;
                tableContent += "<tr style='display: none;' id='tblTr'>";
                tableContent += "<th style='display:none;width: 15%'>User Name</th>";
                tableContent += "<th style='display:none;width: 15%'>Employee Name</th>";
                tableContent += "<th style='display:none;width: 15%'>Date of Joining</th>";
                tableContent += "<th style='display:none;width: 15%'>Manager Name</th>";
                tableContent += "<th style='display:none;width: 15%'>Manager Territory name</th>";

                tableContent += "<th style='text-align:left;width: 15%' >Territory Name</th>";
                tableContent += "<th style='text-align:left;width: 15%'>Division Name</th>";
                tableContent += "<th style='text-align:left;width: 15%'>Stockist Name</th>";
                tableContent += "<th style='text-align:left;width: 15%'>Parameter</th>";
                var type = '[{ type: "text" }, { type: "text" }, { type: "text" },{ type: "text" }, { type: "text" }, { type: "text" }';
                type += ',{ type: "text" }, { type: "text" },{ type: "text" }';
                rowNo = 9;
                for (var k = 0; k < monthList.length; k++) {

                    type += ', { type: "number-range" }';
                    tableContent += "<th style='text-align:center;width: 15%'>" + monthList[k].split('_')[0] + " </th>";
                    rowNo++;
                    if (iRow != 0) {
                        monthName = monthQuterValue(parseInt(monthList[k].split('_')[1]));
                    }
                    if (monthName != "") {
                        if (quter == 0) {
                            rowNo++;
                            type += ', { type: "number-range" }';

                            tableContent += "<th style='text-align:center;width: 15%'>" + monthList[0].split('_')[0] + "-" + monthList[k].split('_')[0] + "-" + monthList[k].split('_')[0] + "</th>";
                        }
                        else {
                            rowNo++;
                            type += ', { type: "number-range" }';
                            tableContent += "<th style='text-align:center;width: 15%'>" + monthName + "-" + monthList[k].split('_')[2] + "</th>";
                        }
                        quter++;
                    }
                    if (parseInt(monthList[k].split('_')[1]) == 9) {
                        if (iRow >= 5) {
                            rowNo++;
                            type += ', { type: "number-range" }';
                            tableContent += "<th style='text-align:center;width: 15%'>Half Yearly-" + monthList[k].split('_')[2] + "</th>";
                        }
                        else {
                            rowNo++;
                            type += ', { type: "number-range" }';
                            tableContent += "<th style='text-align:center;width: 15%'>Total</th>";
                        }
                    }
                    else if (parseInt(monthList[k].split('_')[1]) == 3) {
                        if (iRow >= 11) {
                            rowNo++;
                            type += ', { type: "number-range" }';
                            tableContent += "<th style='text-align:center;width: 15%'>Second Half Yearly-" + monthList[k].split('_')[2] + "</th>";
                        }
                        else {
                            rowNo++;
                            type += ', { type: "number-range" }';
                            tableContent += "<th style='text-align:center;width: 15%'>Total</th>";
                        }
                    }
                    iRow++;
                }
                if (monthCount > 3) {
                    rowNo++;
                    type += ', { type: "number-range" }';
                    tableContent += "<th style='text-align:center;width: 15%'>Annual Total</th>";
                }
                else {
                    if (monthCount <= 2) {
                        rowNo++;
                        type += ', { type: "number-range" }';
                        tableContent += "<th style='text-align:center;width: 15%'>Total</th>";
                    }
                }
                type += ']';
                tableContent += "</tr>";

                iRow = 0;
                quter = 0;
                monthName = "";
                tableContent += "<tr>";
                tableContent += "<th style='display:none;width: 15%'>User Name</th>";
                tableContent += "<th style='display:none;width: 15%'>Employee Name</th>";

                tableContent += "<th style='display:none;width: 15%'>Date of Joining</th>";
                tableContent += "<th style='display:none;width: 15%'>Manager Name</th>";
                tableContent += "<th style='display:none;width: 15%'>Manager Territory name</th>";
                tableContent += "<th style='text-align:left;width: 15%' >Territory Name</th>";
                tableContent += "<th style='text-align:left;width: 15%'>Division Name</th>";
                tableContent += "<th style='text-align:left;width: 15%'>Stockist Name</th>";
                tableContent += "<th style='text-align:left;width: 15%'>Parameter</th>";
                for (var k = 0; k < monthList.length; k++) {

                    tableContent += "<th style='text-align:center;width: 15%'>" + monthList[k].split('_')[0] + "-" + monthList[k].split('_')[2] + " </th>";
                    if (iRow != 0) {
                        monthName = monthQuterValue(parseInt(monthList[k].split('_')[1]));
                    }
                    if (monthName != "") {
                        if (quter == 0) {
                            tableContent += "<th style='text-align:center;width: 15%'>" + monthList[0].split('_')[0] + "-" + monthList[k].split('_')[0] + "-" + monthList[k].split('_')[2] + "</th>";
                        }
                        else {
                            tableContent += "<th style='text-align:center;width: 15%'>" + monthName + "-" + monthList[k].split('_')[2] + "</th>";
                        }
                        quter++;
                    }
                    if (parseInt(monthList[k].split('_')[1]) == 9) {
                        if (iRow >= 5) {
                            tableContent += "<th style='text-align:center;width: 15%'>Half Yearly-" + monthList[k].split('_')[2] + "</th>";
                        }
                        else {
                            tableContent += "<th style='text-align:center;width: 15%'>Total</th>";
                        }
                    }
                    else if (parseInt(monthList[k].split('_')[1]) == 3) {
                        if (iRow >= 11) {
                            tableContent += "<th style='text-align:center;width: 15%'>Second Half Yearly-" + monthList[k].split('_')[2] + "</th>";
                        }
                        else {
                            tableContent += "<th style='text-align:center;width: 15%'>Total</th>";
                        }
                    }
                    iRow++;
                }
                if (monthCount > 3) {
                    tableContent += "<th style='text-align:center;width: 15%'>Annual Total</th>";
                }
                else {
                    if (monthCount <= 2) {
                        tableContent += "<th style='text-align:center;width: 15%'>Total</th>";
                    }
                }
                tableContent += "</tr>";

                tableContent += "<tr >";
                tableContent += "<th colspan= '" + rowNo + "' style='text-align:left' width='15%' ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreea()'>Show Filter</span></th>";
                tableContent += "</tr>";

                tableContent += "</thead><tbody>";
                rowNo = 0;
                for (var i = 0; i < jsData.Tables[2].Rows.length; i++) {
                    isRegionNameBind = true;
                    var dJsonDataH = jsonPath(jsData, "$.Tables[0].Rows[?(@.Region_Code=='" + jsData.Tables[2].Rows[i].Region_Code + "')]");
                    if (dJsonDataH != false) {
                        for (var j = 0; j < dJsonDataH.length; j++) {
                            isStockiestNameBind = true;
                            quter = 0, quterCount = 0;
                            monthSales = 0, halfSales = 0, totalSales = 0;
                            halfClose = 0;
                            tableContentSales = "<tr>";
                            if (isRegionNameBind) {

                                var dJsonDataDiv = jsonPath(jsData, "$.Tables[3].Rows[?(@.Region_Code=='" + jsData.Tables[2].Rows[i].Region_Code + "')]");
                                divisionName = "";
                                if (dJsonDataDiv != false) {
                                    for (var index = 0; index < dJsonDataDiv.length; index++) {
                                        divisionName += dJsonDataDiv[index].Division_Name + ",";
                                    }

                                    if (divisionName != "") {
                                        divisionName = divisionName.substring(0, divisionName.length - 1);
                                    }
                                }
                                tableContentSales += "<td style='display:none'>" + jsData.Tables[2].Rows[i].User_Name + "</td>";
                                tableContentSales += "<td style='display:none'>" + jsData.Tables[2].Rows[i].Employee_Name + "</td>";
                                tableContentSales += "<td style='display:none'>" + jsData.Tables[2].Rows[i].DOJ + "</td>";
                                tableContentSales += "<td style='display:none'>" + jsData.Tables[2].Rows[i].Manager_Name + "</td>";
                                tableContentSales += "<td style='display:none'>" + jsData.Tables[2].Rows[i].Manager_Region_Name + "</td>";
                                tableContentSales += "<td style='text-align:left'>" + jsData.Tables[2].Rows[i].Region_Name + "</td>";
                                tableContentSales += "<td style='text-align:left;'>" + divisionName + "</td>";
                            }
                            else {
                                tableContentSales += "<td style='display:none'>" + jsData.Tables[2].Rows[i].User_Name + "</td>";
                                tableContentSales += "<td style='display:none'>" + jsData.Tables[2].Rows[i].Employee_Name + "</td>";

                                tableContentSales += "<td style='display:none'>" + jsData.Tables[2].Rows[i].DOJ + "</td>";
                                tableContentSales += "<td style='display:none'>" + jsData.Tables[2].Rows[i].Manager_Name + "</td>";
                                tableContentSales += "<td style='display:none'>" + jsData.Tables[2].Rows[i].Manager_Region_Name + "</td>";
                                tableContentSales += "<td style='text-align:left;'>" + jsData.Tables[2].Rows[i].Region_Name + "</td>";
                                tableContentSales += "<td style='text-align:left;'>" + divisionName + "</td>";
                            }

                            if (isStockiestNameBind) {
                                tableContentSales += "<td style='text-align:left;'>" + dJsonDataH[j].Customer_Name + "</td>";
                            }
                            else {
                                tableContentSales += "<td style='text-align:left;'></td>";
                            }

                            tableContentSales += "<td style='text-align:left'>Secondary</td>";

                            isStockiestNameBind = false;
                            isRegionNameBind = false;
                            tableContentClose = "<tr>";
                            tableContentClose += "<td style='display:none'></td>";
                            tableContentClose += "<td style='display:none'></td>";
                            tableContentClose += "<td style='display:none'></td>";
                            tableContentClose += "<td style='display:none'></td>";
                            tableContentClose += "<td style='display:none'></td>";
                            tableContentClose += "<td style='text-align:left;'></td>";
                            tableContentClose += "<td style='text-align:left;'></td>";
                            tableContentClose += "<td style='text-align:left;'></td>";
                            tableContentClose += "<td style='text-align:left'>Closing</td>";

                            tableContentRatio = "<tr>";
                            tableContentRatio += "<td style='display:none'></td>";
                            tableContentRatio += "<td style='display:none'></td>";
                            tableContentRatio += "<td style='display:none'></td>";
                            tableContentRatio += "<td style='display:none'></td>";
                            tableContentRatio += "<td style='display:none'></td>";
                            tableContentRatio += "<td style='text-align:left;'></td>";
                            tableContentRatio += "<td style='text-align:left;'></td>";
                            tableContentRatio += "<td style='text-align:left;'></td>";
                            tableContentRatio += "<td style='text-align:left'>Ratio % </td>";
                            iRow = 0;
                            quter = 0;

                            for (var k = 0; k < monthList.length; k++) {
                                sales = 0, close = 0;

                                var dJsonData = jsonPath(jsData, "$.Tables[1].Rows[?(@.Region_Code=='" + jsData.Tables[2].Rows[i].Region_Code + "' & @.Base_Code=='" + dJsonDataH[j].Customer_Code + "' & @.Month=='" + monthList[k].split('_')[1] + "' & @.Year=='" + monthList[k].split('_')[2] + "')]");
                                if (dJsonData != false) {

                                    for (var index = 0; index < dJsonData.length; index++) {
                                        if ($('#ReportOption').val() == "Unit") {
                                            sales += parseInt(dJsonData[index].Sales);
                                            close += parseInt(dJsonData[index].Closing_Stock);
                                            monthSales += parseInt(dJsonData[index].Sales);
                                            totalSales += parseInt(dJsonData[index].Sales);
                                        }
                                        else {
                                            sales += parseInt(dJsonData[index].Sales_Amount);
                                            close += parseInt(dJsonData[index].Closing_Stock_Amount);
                                            monthSales += parseInt(dJsonData[index].Sales_Amount);
                                            totalSales += parseInt(dJsonData[index].Sales_Amount);
                                        }
                                    }

                                    if (sales > 0) {
                                        halfClose = close;
                                    }

                                    tableContentSales += "<td style='text-align:center'>" + sales + "</td>";
                                    tableContentClose += "<td style='text-align:center'>" + close + "</td>";

                                    if (sales > 0) {
                                        avg = (close / sales) * 100;
                                        tableContentRatio += "<td style='text-align:center'>" + Math.round(avg * 100) / 100 + "</td>";
                                    }
                                    else {
                                        tableContentRatio += "<td style='text-align:center'>0</td>";
                                    }
                                    monthName = "";
                                    if (iRow != 0) {
                                        monthName = monthQuterValue(parseInt(monthList[k].split('_')[1]));
                                    }
                                    if (monthName != "") {
                                        halfSales += monthSales;
                                        tableContentSales += "<td style='text-align:center'>" + monthSales + "</td>";
                                        if (monthSales > 0) {
                                            tableContentClose += "<td style='text-align:center'>" + halfClose + "</td>";
                                        }
                                        else {
                                            tableContentClose += "<td style='text-align:center'>0</td>";
                                        }
                                        if (monthSales > 0) {
                                            avg = (halfClose / monthSales) * 100;
                                            tableContentRatio += "<td style='text-align:center'>" + Math.round(avg * 100) / 100 + "</td>";
                                        }
                                        else {
                                            tableContentRatio += "<td style='text-align:center'>0</td>";
                                        }
                                        quter++;
                                        monthSales = 0;
                                    }
                                    if (parseInt(monthList[k].split('_')[1]) == 9) {

                                        if (iRow >= 5) {
                                            tableContentSales += "<td style='text-align:center'>" + halfSales + "</td>";
                                            if (halfSales > 0) {
                                                tableContentClose += "<td style='text-align:center'>" + halfClose + "</td>";
                                            }
                                            else {
                                                tableContentClose += "<td style='text-align:center'>0</td>";
                                            }
                                            if (halfSales > 0) {
                                                avg = (halfClose / halfSales) * 100;
                                                tableContentRatio += "<td style='text-align:center'>" + Math.round(avg * 100) / 100 + "</td>";
                                            }
                                            else {
                                                tableContentRatio += "<td style='text-align:center'>0</td>";
                                            }
                                        }
                                        else {
                                            tableContentSales += "<td style='text-align:center'>" + halfSales + "</td>";
                                            if (halfSales > 0) {
                                                tableContentClose += "<td style='text-align:center'>" + halfClose + "</td>";
                                            }
                                            else {
                                                tableContentClose += "<td style='text-align:center'>0</td>";
                                            }
                                            if (halfSales > 0) {
                                                avg = (halfClose / halfSales) * 100;
                                                tableContentRatio += "<td style='text-align:center'>" + Math.round(avg * 100) / 100 + "</td>";
                                            }
                                            else {
                                                tableContentRatio += "<td style='text-align:center'>0</td>";
                                            }
                                            totalSales = 0;
                                            monthSales = 0;
                                        }
                                        halfSales = 0;
                                    }
                                    else if (parseInt(monthList[k].split('_')[1]) == 3) {

                                        if (iRow >= 11) {
                                            tableContentSales += "<td style='text-align:center'>" + halfSales + "</td>";
                                            if (halfSales > 0) {
                                                tableContentClose += "<td style='text-align:center'>" + halfClose + "</td>";
                                            }
                                            else {
                                                tableContentClose += "<td style='text-align:center'>0</td>";
                                            }

                                            if (halfSales > 0) {
                                                avg = (halfClose / halfSales) * 100;
                                                tableContentRatio += "<td style='text-align:center'>" + Math.round(avg * 100) / 100 + "</td>";
                                            }
                                            else {
                                                tableContentRatio += "<td style='text-align:center'>0</td>";
                                            }
                                        }
                                        else {
                                            tableContentSales += "<td style='text-align:center'>" + halfSales + "</td>";
                                            if (halfSales > 0) {
                                                tableContentClose += "<td style='text-align:center'>" + halfClose + "</td>";
                                            }
                                            else {
                                                tableContentClose += "<td style='text-align:center'>0</td>";
                                            }
                                            if (halfSales > 0) {
                                                avg = (halfClose / halfSales) * 100;
                                                tableContentRatio += "<td style='text-align:center'>" + Math.round(avg * 100) / 100 + "</td>";
                                            }
                                            else {
                                                tableContentRatio += "<td style='text-align:center'>0</td>";
                                            }
                                            totalSales = 0;
                                            monthSales = 0;

                                        }
                                        halfSales = 0;
                                    }
                                }
                                else {
                                    tableContentSales += "<td style='text-align:center'>0</td>";
                                    tableContentClose += "<td style='text-align:center'>0</td>";
                                    tableContentRatio += "<td style='text-align:center'>0</td>";
                                    monthName = "";
                                    if (iRow != 0) {
                                        monthName = monthQuterValue(parseInt(monthList[k].split('_')[1]));
                                    }
                                    if (monthName != "") {

                                        halfSales += monthSales;
                                        //  totalSales += monthSales;
                                        tableContentSales += "<td style='text-align:center'>" + monthSales + "</td>";
                                        if (monthSales > 0) {
                                            tableContentClose += "<td style='text-align:center'>" + halfClose + "</td>";
                                        }
                                        else {
                                            tableContentClose += "<td style='text-align:center'>0</td>";
                                        }
                                        if (monthSales > 0) {
                                            avg = (halfClose / monthSales) * 100;
                                            tableContentRatio += "<td style='text-align:center'>" + Math.round(avg * 100) / 100 + "</td>";
                                        }
                                        else {
                                            tableContentRatio += "<td style='text-align:center'>0</td>";
                                        }
                                        quter++;
                                        monthSales = 0;
                                    }
                                    if (parseInt(monthList[k].split('_')[1]) == 9) {

                                        if (iRow >= 5) {
                                            tableContentSales += "<td style='text-align:center'>" + halfSales + "</td>";

                                            if (halfSales > 0) {
                                                avg = (halfClose / halfSales) * 100;
                                                tableContentClose += "<td style='text-align:center'>" + halfClose + "</td>";
                                                tableContentRatio += "<td style='text-align:center'>" + Math.round(avg * 100) / 100 + "</td>";
                                            }
                                            else {
                                                tableContentRatio += "<td style='text-align:center'>0</td>";
                                                tableContentClose += "<td style='text-align:center'>0</td>";
                                            }
                                        }
                                        else {
                                            tableContentSales += "<td style='text-align:center'>" + halfSales + "</td>";

                                            if (halfSales > 0) {
                                                avg = (halfClose / halfSales) * 100;
                                                tableContentClose += "<td style='text-align:center'>" + halfClose + "</td>";
                                                tableContentRatio += "<td style='text-align:center'>" + Math.round(avg * 100) / 100 + "</td>";
                                            }
                                            else {
                                                tableContentClose += "<td style='text-align:center'>0</td>";
                                                tableContentRatio += "<td style='text-align:center'>0</td>";
                                            }
                                            totalSales = 0;
                                            monthSales = 0;
                                        }
                                        halfSales = 0;

                                    }
                                    else if (parseInt(monthList[k].split('_')[1]) == 3) {

                                        if (iRow >= 11) {

                                            tableContentSales += "<td style='text-align:center'>" + halfSales + "</td>";


                                            if (halfSales > 0) {
                                                avg = (halfClose / halfSales) * 100;
                                                tableContentClose += "<td style='text-align:center'>" + halfClose + "</td>";
                                                tableContentRatio += "<td style='text-align:center'>" + Math.round(avg * 100) / 100 + "</td>";
                                            }
                                            else {
                                                tableContentClose += "<td style='text-align:center'>0</td>";
                                                tableContentRatio += "<td style='text-align:center'>0</td>";
                                            }
                                        }
                                        else {
                                            tableContentSales += "<td style='text-align:center'>" + halfSales + "</td>";

                                            if (halfSales > 0) {
                                                avg = (halfClose / halfSales) * 100;
                                                tableContentClose += "<td style='text-align:center'>" + halfClose + "</td>";
                                                tableContentRatio += "<td style='text-align:center'>" + Math.round(avg * 100) / 100 + "</td>";
                                            }
                                            else {
                                                tableContentClose += "<td style='text-align:center'>0</td>";
                                                tableContentRatio += "<td style='text-align:center'>0</td>";
                                            }
                                            totalSales = 0;
                                            monthSales = 0;
                                        }
                                        halfSales = 0;
                                    }
                                }
                                iRow++;
                            }
                            if (monthCount > 3) {
                                tableContentSales += "<td style='text-align:center'>" + totalSales + "</td>";

                                if (totalSales > 0) {
                                    avg = (halfClose / totalSales) * 100;
                                    tableContentClose += "<td style='text-align:center'>" + halfClose + "</td>";
                                    tableContentRatio += "<td style='text-align:center'>" + Math.round(avg * 100) / 100 + "</td>";
                                }
                                else {
                                    tableContentClose += "<td style='text-align:center'>0</td>";
                                    tableContentRatio += "<td style='text-align:center'>0</td>";
                                }
                            }
                            else {
                                if (monthCount <= 2) {
                                    tableContentSales += "<td style='text-align:center'>" + totalSales + "</td>";

                                    if (totalSales > 0) {
                                        avg = (halfClose / totalSales) * 100;
                                        tableContentClose += "<td style='text-align:center'>" + halfClose + "</td>";
                                        tableContentRatio += "<td style='text-align:center'>" + Math.round(avg * 100) / 100 + "</td>";
                                    }
                                    else {
                                        tableContentClose += "<td style='text-align:center'>0</td>";
                                        tableContentRatio += "<td style='text-align:center'>0</td>";
                                    }
                                }
                            }

                            tableContentSales += "</tr>";
                            tableContentClose += "</tr>";
                            tableContentRatio += "</tr>";

                            tableContent += tableContentSales;
                            tableContent += tableContentClose;
                            tableContent += tableContentRatio;

                        }
                    }
                }
                tableContent += "</tbody>";
                tableContent += "</table>";

                $("#divReport").html(tableContent);
                $("#divPrint").html(datePeriod + tableContent);
                var jsonType = eval(type);
                if ($.fn.dataTable) {
                    $('#tblSalesAndActivity').dataTable({
                        "sPaginationType": "full_numbers", "bSort": false, "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                    }).columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType
                    });
                };
                $('#dvPrint').remove();
                fninializePrint("divPrint", "ifrmPrint", "divReport");
                if (tableContent != "") {
                    $("#divInput").slideUp();
                    $("#spnInputToggle").html("Show Input");
                }
                HideModalPopup("dvloading");
            }
            else {
                fnMsgAlert('info', 'Secondary Sales Trend Analysis Report', 'No data found.');
                HideModalPopup("dvloading");
            }
        },
        error: function () {
            fnMsgAlert('info', 'Secondary Sales Trend Analysis Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });
}

function fnMonthAndYear() {
    var fromMonth = $('#drpFromMonth');
    $('option', fromMonth).remove();
    var toMonth = $('#drpToMonth');
    $('option', toMonth).remove();
    var monthName = "";
    monthName += "<option value='0'>-Select Month-</option>"; // new Option("-Select Month-", "0", true, true));
    monthName += "<option value='1'>JAN</option>";
    monthName += "<option value='2'>FEB</option>";
    monthName += "<option value='3'>MAR</option>";
    monthName += "<option value='4'>APR</option>";
    monthName += "<option value='5'>MAY</option>";
    monthName += "<option value='6'>JUN</option>";
    monthName += "<option value='7'>JUL</option>";
    monthName += "<option value='8'>AUG</option>";
    monthName += "<option value='9'>SEP</option>";
    monthName += "<option value='10'>OCT</option>";
    monthName += "<option value='11'>NOV</option>";
    monthName += "<option value='12'>DEC</option>";
    $("#drpFromMonth").append(monthName);
    $("#drpToMonth").append(monthName);
    $("#drpFromMonth").val('0');
    $("#drpToMonth").val('0');

    var year = "";
    var currentYear = (new Date).getFullYear();
    currentYear = currentYear - 2;
    var yearselect = $("#drpYear");
    $('option', yearselect).remove();
    year += "<option value='0'>-Select Year-</option>";
    for (var t = 0; t < 3; t++) {
        year += "<option value='" + currentYear + "'>" + currentYear + "</option>";
        currentYear = currentYear + 1;
    }
    $("#drpYear").append(year);
    $("#drpYear").val('0');
}

function monthDiff(fromDate, toDate) {
    var tempDate = new Date(fromDate);
    var endDate = new Date(toDate);

    var monthCount = 0;
    while ((tempDate.getMonth() + '' + tempDate.getFullYear()) != (endDate.getMonth() + '' + endDate.getFullYear())) {
        monthCount++;
        tempDate.setMonth(tempDate.getMonth() + 1);
    }
    return monthCount + 1;
}

// GET Month Value

function monthQuterValue(number) {
    if (3 == number) {
        return "jan-Mar";
    }
    else if (6 == number) {
        return "Apr-Jun";
    }
    else if (9 == number) {
        return "Jul-Sep";
    }
    else if (12 == number) {
        return "Oct-Dec";
    }
    else {
        return "";
    }
}



function fnPrint(divId, iFrameId) {
    try {
        var oIframe = document.getElementById(iFrameId);
        var oContent = document.getElementById(divId).innerHTML;
        var oDoc = (oIframe.contentWindow || oIframe.contentDocument);
        if (oDoc.document) oDoc = oDoc.document;
        oDoc.write("<html><head> <style media='all'>th, td{border-left:1px solid #000;border-top:1px solid #000;} table{border:1px solid #111;font-family:Arial;font-size:10px} </style> </head><body  onload='this.print();' this.print();'><center>");
        oDoc.write(oContent + "</center></body></html>");
        // oDoc.write("<html><head></head><body  onload='this.print();'><center>");
        // oDoc.write(oContent + "</center></body></html>");
        oDoc.close();
    }
    catch (e) {
        self.print();
    }
}

function fninializePrint(divId, iFrameId, mainDiv) {
    $('#' + mainDiv + ' #dvPrint').remove();
    $("#" + mainDiv + " .TableTools").append("<div id='dvPrint' onclick='fnPrint(\"" + divId + "\",\"" + iFrameId + "\");' title='Print Table' class='TableTools_button' style='background: url(../Content/DataTable/media/images/print.png) no-repeat center center;border: 1px solid #f0f0f0;height: 30px; width: 30px;cursor:pointer;'></div>");
}


function fnSecondarySalesCustomer() {

    var month = $('input:radio[name=Selection]:checked').val();
    ShowModalPopup("dvloading");
    var monthList = new Array();


    var startMonth = fngetMonthNumber($('#txtFromDate').val().split('-')[0]);
    var endMonth = fngetMonthNumber($('#txtToDate').val().split('-')[0]);
    var startYear = $('#txtFromDate').val().split('-')[1];
    var endYear = $('#txtToDate').val().split('-')[1];

    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'Secondary Sales Customer Report', 'Please enter Start month.');
        HideModalPopup("dvloading");
        return false;
    }
    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'Secondary Sales Customer Report', 'Please enter End month.');
        HideModalPopup("dvloading");
        return false;
    }
    var days = daysInMonth(endMonth, endYear);
    var startDate = "", endDate = "";
    if (parseInt(startMonth) >= 10) {
        startDate = startYear + "-" + startMonth + "-01";
    }
    else {
        startDate = startYear + "-0" + startMonth + "-01";
    }

    if (parseInt(endMonth) >= 10) {
        endDate = endYear + "-" + endMonth + "-" + days;
    }
    else {
        endDate = endYear + "-0" + endMonth + "-" + days;
    }
    var dt1 = new Date(startYear + "/" + startMonth + "/01");
    var dt2 = new Date(endYear + "/" + endMonth + "/" + days);
    if (dt1 > dt2) {
        fnMsgAlert('info', 'Secondary Sales Customer Report', 'Start Month&Year should be less than End Month&Year.');
        HideModalPopup("dvloading");
        return false;
    }
    if ($("#ddlProductName").val() == "0") {
        fnMsgAlert('info', 'Secondary Sales Customer Report', 'Select  product.');
        HideModalPopup("dvloading");
        return false;
    }
    var productCodes = "";
    if ($("#ddlProductName").val() != null) {
        for (var index = 0; index < $("#ddlProductName").val().length; index++) {
            productCodes += $("#ddlProductName").val()[index] + "^";
        }
    }
    if (productCodes == "") {
        fnMsgAlert('info', 'Secondary Sales Customer Report', 'Select  product.');
        HideModalPopup("dvloading");
        return false;
    }

    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/Reports/GetSecondarySalesCustomer',
        data: 'regionCode=' + $('#hdnRegionCode').val() + '&sd=' + startDate + '&ed=' + endDate + '&ProductCode=' + productCodes,
        success: function (response) {
            if (response != "") {
                $("#divReport").html(response);
                $("#divPrint").html(response);
                if ($.fn.dataTable) {
                    $('#tblSecondarySalesCustomer').dataTable({
                        "iDisplayLength": 25,
                        "sPaginationType": "full_numbers",
                        "bDestroy": true,
                        "sDom": 'T<"clear">lfrtip',
                        "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                    });
                };

                var oTable = $('#tblSecondarySalesCustomer').dataTable({
                    "sPaginationType": "full_numbers",
                    "fnFooterCallback": function (nRow, aaData, iStart, iEnd, aiDisplay) {
                        var orderCount = 0; var Amount = 0;
                        var salesSRQty = 0, closingBalanceQty = 0;
                        var closingBalanceAmt = 0;
                        for (var i = 0; i < aaData.length; i++) {
                            orderCount += parseFloat(aaData[i][11].replace(',', ''));
                            Amount += parseFloat(aaData[i][13].replace(',', ''));
                            salesSRQty += parseFloat(aaData[i][14].replace(',', ''));
                            closingBalanceQty += parseFloat(aaData[i][15].replace(',', ''));
                            closingBalanceAmt += parseFloat(aaData[i][16].replace(',', ''));
                        }
                        var TotalorderCount = 0; var totalAmount = 0;
                        var TotalSalesSRQty = 0, TotalClosingBalanceQty = 0;
                        var TotalClosingBalanceAmt = 0;
                        for (var i = iStart; i < iEnd; i++) {
                            TotalorderCount += parseFloat(aaData[aiDisplay[i]][11].replace(',', ''));
                            totalAmount += parseFloat(aaData[aiDisplay[i]][13].replace(',', ''));
                            TotalSalesSRQty += parseFloat(aaData[aiDisplay[i]][14].replace(',', ''));
                            TotalClosingBalanceQty += parseFloat(aaData[aiDisplay[i]][15].replace(',', ''));
                            TotalClosingBalanceAmt += parseFloat(aaData[aiDisplay[i]][16].replace(',', ''));
                        }
                        var ncell = nRow.getElementsByTagName('th');
                        //var nCells = nRow.getElementsByTagName('th');
                        ncell[10].innerHTML = addCommas('Subtotal') + '<br/>' + addCommas('Grand Total ');
                        ncell[11].innerHTML = addCommas(TotalorderCount.toFixed(2)) + '<br/>(' + addCommas(orderCount.toFixed(2)) + ')';
                        ncell[13].innerHTML = '' + addCommas(totalAmount.toFixed(2)) + '<br/>(' + addCommas(Amount.toFixed(2)) + ')';
                        ncell[14].innerHTML = '' + addCommas(TotalSalesSRQty.toFixed(2)) + '<br/>(' + addCommas(salesSRQty.toFixed(2)) + ')';
                        ncell[15].innerHTML = '' + addCommas(TotalClosingBalanceQty.toFixed(2)) + '<br/>(' + addCommas(closingBalanceQty.toFixed(2)) + ')';
                        ncell[16].innerHTML = '' + addCommas(TotalClosingBalanceAmt.toFixed(2)) + '<br/>(' + addCommas(closingBalanceAmt.toFixed(2)) + ')';
                    },
                    "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });

                $('#dvPrint').remove();
                fninializePrint("divPrint", "ifrmPrint", "divReport");
                if (response != "") {
                    $("#divInput").slideUp();
                    $("#spnInputToggle").html("Show Input");
                }
                HideModalPopup("dvloading");
            }
            else {
                fnMsgAlert('info', 'Secondary Sales Customer Report', 'No data found.');
                HideModalPopup("dvloading");
            }
        },
        error: function () {
            fnMsgAlert('info', 'Secondary Sales Customer Report', 'Error.');
            HideModalPopup("dvloading");
        }
    });

}