

var IncludeClosedStockiest = 0;
function fnIncludeClosedStockiest() {
    debugger;
    if ($('#chkbxIncludClsdStckst').is(":checked")) {
        IncludeClosedStockiest = 1;
    } else {
        IncludeClosedStockiest = 0;
    }
    fngetStockiest();
}

function fngetStockiest() {
    debugger;
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yy = today.getFullYear();
    var currentDate = yy + '/' + mm + '/' + dd;
    var CDate = new Date(currentDate);
    var regionCode = $('#hdnRegionCode').val();
    var monthYear = $('#mnthyr').val();
    var month = monthYear.split('-')[0];
    if (month != "" && month != undefined) {
        month = fnGetMonthNumber(month);
    }
    var year = monthYear.split('-')[1];
    if ($('#chkbxIncludClsdStckst').is(":checked")) {
        IncludeClosedStockiest = 1;
    } else {
        IncludeClosedStockiest = 0;
    }
    $.blockUI();
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/SecondarySales/GetSSStockiestDetails',
        data: 'regionCode=' + regionCode + "&IncludeClosedStockiest=" + IncludeClosedStockiest + "&month=" + month + "&year=" + year,
        success: function (response) {
            fnBindStockiestList(response);
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        },
        complete: function (e) {
            $.unblockUI();
        }
    });
}

function fnBindStockiestList(resp) {
    debugger;
    var content = '';
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yy = today.getFullYear();
    var curreDate = yy + '/' + mm + '/' + dd;
    var CDate = new Date(curreDate);
    $('option', $("#ddlStockiest")).remove();
    content += "<option value='0'>-Select-</option>";
    if (resp.length > 0) {
        for (var i = 0; i < resp.length; i++) {
            var Effct_To = resp[i].Effective_To;
            Effct_To = Effct_To.split('/')[2] + '/' + Effct_To.split('/')[1] + '/' + Effct_To.split('/')[0];
            var EffDate = new Date(Effct_To);
            if (resp[i].Ref_Key1 == 0) {
                if (EffDate >= CDate) {
                    content += "<option value='" + resp[i].Customer_Code + "'>" + resp[i].Customer_Name + '-(No Ref Key)-(' + resp[i].Effective_From + '-Active...)' + "</option>";
                } else {
                    content += "<option value='" + resp[i].Customer_Code + "'>" + resp[i].Customer_Name + '-(No Ref Key)-(' + resp[i].Effective_From + '-' + resp[i].Effective_To + ')' + "</option>";
                }
            }
            else {
                if (EffDate >= CDate) {
                    content += "<option value='" + resp[i].Customer_Code + "'>" + resp[i].Customer_Name + '-(' + resp[i].Ref_Key1 + ')-(' + resp[i].Effective_From + '-Active...)' + "</option>";
                } else {
                    content += "<option value='" + resp[i].Customer_Code + "'>" + resp[i].Customer_Name + '-(' + resp[i].Ref_Key1 + ')-(' + resp[i].Effective_From + '-' + resp[i].Effective_To + ')' + "</option>";
                }
            }
        }
        $("#ddlStockiest").html(content);
        $('#tblInputDet').show();
        $("#ddlStockiest").val('0');
        $('#divReportHeader').hide();
        $('#txtarea').hide();
        $('#buttonsTwo').hide();
    }
}

var SSData = '';
function fnDeletedSecondarySalesDetail() {
    debugger;
    var jsData = '';
    ShowModalPopup("dvloading");
    var regionCode = $('#hdnRegionCode').val();
    var stockiestCode = $("#ddlStockiest").val();
    var mode = $('input:radio[name=rptOptions]:checked').val();
    if (stockiestCode == 0) {
        HideModalPopup("dvloading");
        fnMsgAlert('info', 'Info', 'Please select Stockist Name.');
        return false;
    }
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Activity/SecondarySales/GetListSecondarySalesForDelete',
        data: 'regionCode=' + regionCode + '&stockiestCode=' + stockiestCode + '&mode=' + mode,
        success: function (response) {
            debugger;
            SSData = response;
            fnBindSSForDeleteHTML(response);
        }
    });
}

function fnBindSSForDeleteHTML(resp) {
    debugger;
    var content = '';
    var rowNo = 0;
    content += "<table class='table table-striped'>";
    content += "<thead>";
    content += "<tr>";
    content += "<td style='width: 64px;'>Select<input style='margin:2px;' type='checkbox' name='chkSSSelectAll' onclick='fnSSSelectAll();'/></td>";
    content += "<td>Remarks</td>";
    content += "<td>Region Name </td>";
    content += "<td>Month</td>";
    content += "<td>Year</td>";
    content += "<td>Statement Date</td>";
    content += "<td>Secondary Sales Amount.(Rs.) </td>";
    content += "<td>Product View</td>";
    content += "<td>History</td>";
    content += "<td>Status</td>";
    content += "</tr>";
    content += "<thead>";
    content += "<tbody>";
    if (resp.length > 0) {
        for (var i = 0; i < resp.length; i++) {
            rowNo++;
            content += "<tr>";
            content += "<td><input type='checkbox' name='chk_SS_Select' onclick='fnSelectDecsAll();' id='chkSelect_" + rowNo + "' value='" + rowNo + "' da_id='" + rowNo + "'/></td>";
            content += "<td><textarea rows='3' style='resize:none;' id='txtUnApprvRemrks_" + rowNo + "'></textarea></td>";
            content += "<input type='hidden' id='hdnDeleteDetails_" + rowNo + "' value='" + resp[i].Region_Code + "|" + resp[i].SS_Code + "|" + resp[i].Month + "|" + resp[i].Year + "|" + resp[i].Base_Code + "|" + resp[i].SS_Status + "'/>";
            content += "<input type='hidden' id='hdnIs_inherited' value='" + resp[i].IS_Inherited + "'/><td>";
            content += resp[i].Region_Name + "</td>";
            content += "<td>" + resp[i].MonthName + "</td>";
            content += "<td>" + resp[i].Year + "</td >";
            content += "<td>" + resp[i].SS_Statement_Date + "</td>";
            content += "<td>" + resp[i].SS_Amount + "</td>";
            content += "<td align='left' width='15%'><span onclick='fnDetailsViewProducts(\"" + resp[i].Region_Code + "_" + resp[i].Month + "_" + resp[i].Year + "_" + resp[i].SS_Code + "_" + resp[i].SS_Statement_Date + "\")' style='text-decoration:underline;cursor:pointer'>View</span></td>";
            content += "<td align='left' width='15%'><span onclick='fnViewRemarksHistory(\"" + resp[i].Region_Code + "|" + resp[i].SS_Code + "\");' style='text-decoration:underline;cursor:pointer'>View History</span></td>";
            var result = fnGetColorCode(resp[i].SS_Status_Val);
            content += "<td " + result + ">" + resp[i].SS_Status_Val + "</td>";
            content += "</tr>";
        }
       // $('#txtarea').show();
        $('#buttonsTwo').show();
    }
    else {
        content += "<tr><td colspan='9' style='font-style:italic;font-weight:bold;text-align:center;'>No Record(s) Found.</td></tr>";
        $('#txtarea').hide();
        $('#buttonsTwo').hide();
    }
    content += "</tbody>";
    content += "</table>";
    $('#divReportHeader').html(content);
    $('#divReportHeader').show();
    HideModalPopup("dvloading");
}

function fnGetColorCode(status) {
    debugger;
    var style = '';
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

function fnGetMonth(month) {
    debugger;
    var MonthName = '';
    if (month == "1") {
        MonthName = "January";
    } else if (month == "2") {
        MonthName = "February";
    } else if (month == "3") {
        MonthName = "March";
    } else if (month == "4") {
        MonthName = "April";
    } else if (month == "5") {
        MonthName = "May";
    } else if (month == "6") {
        MonthName = "June";
    } else if (month == "7") {
        MonthName = "July";
    } else if (month == "8") {
        MonthName = "August";
    } else if (month == "9") {
        MonthName = "September";
    } else if (month == "10") {
        MonthName = "October";
    } else if (month == "11") {
        MonthName = "November";
    } else if (month == "12") {
        MonthName = "December";
    }
    return MonthName;
}

function fnGetMonthNumber(month) {
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

function fnDetailsViewProducts(id) {
    debugger;
    var userCodeDetails = id;
    var Stockiest_Name = $('#ddlStockiest :selected').text();
    var StockName = Stockiest_Name.split('-')[0];
    if (StockName != "" && StockName != undefined) {
        $('#SckstName').html(StockName);
    }
    var StockRefKey = Stockiest_Name.split('-')[1].replace(')', '').replace('(', '');
    if (StockRefKey != "" && StockRefKey != null && StockRefKey != undefined && StockRefKey != "-") {
        $('#Sckstrefkey').html(StockRefKey);
    } else {
        $('#Sckstrefkey').html("-");
    }
    var effectiveFrom = Stockiest_Name.split('-')[2].replace('(', '');
    if (effectiveFrom != "" && effectiveFrom != undefined && effectiveFrom != null) {
        $('#ScksteffFrm').html(effectiveFrom);
    } else {
        $('#ScksteffFrm').html("01/01/2010");
    }
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yy = today.getFullYear();
    var currentDate = dd + '/' + mm + '/' + yy;
    var effectiveTo = Stockiest_Name.split('-')[3].replace(')', '');
    if (effectiveTo == "Acitve...") {
        $('#ScksteffTo').html(currentDate);
    } else {
        $('#ScksteffTo').html(effectiveTo);
    }
    var otherReleData = id.split('_');
    var regionCode = otherReleData[0];
    var month = otherReleData[1];
    month = fnGetMonth(otherReleData[1]);
    var year = otherReleData[2];
    var ssCode = otherReleData[3];
    var StatementDate = otherReleData[4];
    var disjson = $.grep(SSData, function (ele, index) {
        return ele.SS_Code == ssCode;
    });
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
            fnFixedcolum(2);
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
    tableContent += " <th class='col1'>Expired Goods</th>";
    tableContent += " <th class='col1'>Damaged Goods</th>";
    tableContent += " <th class='col1'>Remarks</th>";
    tableContent += "</tr></thead></table>";
    tableContent += "</div>";

    tableContent += '<div class="table-body" style="font-size:12px;">';
    tableContent += '<table class="table table-bordered maintable" id="bodytable" style="width: 0%; margin-bottom: 0px;border: 0px solid #ddd;">';
    tableContent += ' <tbody style="height: 200px;">';

    var totalSale = 0.0;
    var ClosingBalance = 0.0;
    var saleamount = 0.0;
    var totalsaleamount = 0.0;
    var closingAmount = 0.0;
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
            if (resp[i].Ref_Key1 == "0") {
                tableContent += "<td align='right'  class='col1'>" + resp[i].Product_Name + ' (-)' + "</td>";

            } else {
                tableContent += "<td align='right'  class='col1'>" + resp[i].Product_Name + ' (' + resp[i].Ref_Key1 + ')' + "</td>";
            }
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
            tableContent += "<td class='col1'>" + resp[i].Expired_Goods + "</td>";
            tableContent += "<td class='col1'>" + resp[i].Damaged_Goods + "</td>";
            tableContent += "<td class='col1'>" + resp[i].Remarks + "</td>";
            tableContent += "</tr>";
            tableContent += "<tr id='rowDataDynaPop_" + i + "' class='dynaSSPop' style='display:none;background:#f1f1f1;'><td style='background-color:#f1f1f1 !important;' colspan='16' id='rowtdDyna_" + i + "'></td></tr>";
            totalSale += parseFloat(resp[i].Sales);
            ClosingBalance += parseFloat(resp[i].Closing_Stock);
            totalsaleamount += saleamount
            totalclosingstock += closingAmount
        }
        tableContent += "<tr style='text-align-center;'>";
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
    }
    else {
        tableContent += "<tr ><td colspan='13' style='text-align:center;font-weight:bold;'>No Records(s) Found.</td></tr>";
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
var mesgstatus = "";
function fnSSDeleteConfirmation(status) {
    debugger;
    var details = "";
    var remarks = "";
    var month = "";
    var year = "";
    var currentStatus = "";
    if (status == 0) {
        mesgstatus = "Unapproved";
    } else {
        mesgstatus = "Deleted";
    }
    if (fnValidateDeleteSecondarySales(status)) {
        var content = 'All these entries will be "' + mesgstatus + '". Please click Yes to continue, else No to cancel the operation.';
        var confrmBtn = '<button type="button" class="btn btn-default" data-dismiss="modal" onclick="fnSSDelete(\'' + status + '\')">Yes</button>';
        if (content != "") {
            $('#deleteMappingBody').html(content);
            $('#confrmdelte').html(confrmBtn);
            $('#DeleteModal').modal('show');
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

function fnSSDelete(status) {
    debugger;
    var details = "";
    var remarks = "";
    var month = "";
    var year = "";
    var currentStatus = "";
    var DeleteArr = [];
    if (fnValidateDeleteSecondarySales(status)) {
        $("input:checkbox[name=chk_SS_Select]").each(function () {
            if (this.checked) {
                var id = this.id;
                var idVal=id.split('_')[1];
                var det=$("#hdnDeleteDetails_"+idVal).val() ;
                var ObjDel = {
                    Region_Code: det.split('|')[0],
                    SS_Code: det.split('|')[1],
                    Month: det.split('|')[2],
                    Year: det.split('|')[3],
                    Base_Code: det.split('|')[4],
                    SS_Status: det.split('|')[5],
                    Remarks: $("#txtUnApprvRemrks_" + idVal).val()
                };
                DeleteArr.push(ObjDel);
            }
        });
        try {
            $.ajax({
                type: "POST",
                url: '../HiDoctor_Activity/SecondarySales/DeleteandUnapproveSecondarysales',
                data: JSON.stringify({ "lstDeleteDet": DeleteArr,"status": status }),
                contentType: 'application/json; charset=utf-8',
                success: function (response) {
                    if (response == "True") {
                        if (status == 0) {
                            fnMsgAlert('success', 'Secondary Sales Approval', 'The selected Secondary Sales records are Un-Approved Successfully.');
                            $('#dvSSDetails').html();
                            fnDeletedSecondarySalesDetail();
                            $('#txtReason').val("");
                            $('#rbtThreeEntries').attr('checked', 'checked');
                            return false;
                        } else {
                            fnMsgAlert('success', 'Secondary Sales Approval', 'The selected Secondary Sales records are Deleted Successfully.');
                            $('#dvSSDetails').html();
                            fnDeletedSecondarySalesDetail();
                            $('#txtReason').val("");
                            $('#rbtThreeEntries').attr('checked', 'checked');
                            return false;
                        }
                    }
                },
                error: function (e) {
                    if (status == 0) {
                        fnMsgAlert('success', 'Secondary Sales Approval', 'Failed to Un-Approve the selected Secondary Sales records.Please try after sometime.');
                        return false;
                    } else {
                        fnMsgAlert('success', 'Secondary Sales Approval', 'Failed to Delete the selected Secondary Sales records.Please try after sometime.');
                        return false;
                    }

                }
            });
        }
        catch (e) {
            fnMsgAlert('error', 'Error', e.message);
            $("#divDates").hide();
            return false;
        }
    }
}

function fnValidateDeleteSecondarySales(status) {
    var flag = false;
    var remarks = "";
    var currentStatus = "";
    var isResult = true;
    $("input:checkbox[name=chk_SS_Select]").each(function () {
        if (this.checked) {
            var id = this.id;
            flag = true;
        }
        if (status == 0) {
            if (this.checked) {
                var id = this.id;
                var idVal = id.split('_')[1];
                if ($('#txtUnApprvRemrks_' + idVal).val() == "" || $('#txtUnApprvRemrks_' + idVal).val() == null || $('#txtUnApprvRemrks_' + idVal).val() == undefined) {
                    fnMsgAlert('info', 'Secondary Sales', 'Remarks is Mandatory for UnApproval.');
                    isResult = false;
                    return;
                }
                if ($('#txtUnApprvRemrks_' + idVal).val() != "" && $('#txtUnApprvRemrks_' + idVal).val() != null && $('#txtUnApprvRemrks_' + idVal).val() != undefined) {
                    var result = fnValidateInputParamters($('#txtUnApprvRemrks_' + idVal).val());
                    if (result) {
                        fnMsgAlert('info', 'Secondary Sales', "Special characters (A-Za-z0-9@.,'(){}[]/\<>?!_-) are allowed in the Remarks.");
                        isResult = false;
                        return;
                    }
                }
            }
            if (isResult == false) {
                return isResult;
            }
        }
    });
    if (!flag) {
        fnMsgAlert('info', 'Info', 'Please select atleast one Secondary Sales.');
        isResult = false;
        return isResult;
    }
    return isResult;
}

function fnSSSelectAll() {
    if ($("input:checkbox[name=chkSSSelectAll]").attr("checked") == "checked") {
        $("input:checkbox[name=chk_SS_Select]").each(function () {
            this.checked = true;
            $("input:checkbox[name=chk_SS_Select]").attr('disabled', 'disabled')
        });
    }
    else {
        $("input:checkbox[name=chk_SS_Select]").each(function () {
            this.checked = false;
            $("input:checkbox[name=chk_SS_Select]").removeAttr('disabled')
        });
    }
}

function fnSelectDecsAll() {
    debugger;
    var tablelength = $("#divReportHeader tr").length;
    var selectedRowid = 0;
    $("input[name=chk_SS_Select][type=checkbox]:enabled").each(function () {
        if ($(this).is(':checked')) {
            selectedRowid = $(this).val();
            return false;
        }
    });
    if (selectedRowid != 0) {
        for (var i = selectedRowid; i < tablelength; i++) {
            $("#chkSelect_" + i + "").attr("checked", true);
            $("#chkSelect_" + i + "").attr("disabled", true);
            $("#chkSelect_" + selectedRowid + "").attr("disabled", false);
        }
    }
    else {
        for (var i = selectedRowid; i < tablelength; i++) {
            $("#chkSelect_" + i + "").attr("checked", false);
            $("#chkSelect_" + i + "").attr("disabled", false);
        }
    }
}

function fnGetRowId(rowObject) {
    return $(rowObject).find("input")[0].id.split("_")[1];
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
            var contentBind = secondarySalesApproval.fnBindDynamicGridForView(rowid, resp);
            if (contentBind != "" && contentBind != undefined) {
                $('#rowtdDyna_' + rowid).html(contentBind);
                $('#gridpluspop_' + rowid).hide();
                $('#gridminuspop_' + rowid).show();
                $('#rowDataDynaPop_' + rowid).show();
            }
        }
    });
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
                content += "<td>" + resp[i].Entered_By + "</td>";
            } else {
                content += "<td>" + resp[i].Approved_By + "</td>";
            }
            if (resp[i].SS_Status == "DRAFT" || resp[i].SS_Status == "APPLIED") {
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
    var month = fnGetMonth(resp[0].Month);
    $('#monthSSrmrks').html(month);
    $('#yearSSrmrks').html(resp[0].Year);
    $('#divModelrmrks').html(content);
    $('#mymodalRemarks').modal('show');
}